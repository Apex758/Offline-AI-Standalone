
# Enforce UTF-8 encoding for all std streams and environment
import os
import sys

# Set environment variable for all subprocesses
os.environ["PYTHONIOENCODING"] = "utf-8"

# Reconfigure stdout/stderr if possible (Python 3.7+)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import JSONResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import subprocess
import os
import io
import sys
import logging
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import threading
import time
import json
import asyncio
import signal
import atexit
from config import ( 
    get_model_path, get_selected_model, set_selected_model,
    LLAMA_CLI_PATH, LLAMA_PARAMS, CORS_ORIGINS, MODELS_DIR,
    MODEL_PATH, MODEL_VERBOSE, MODEL_N_CTX, MODEL_MAX_TOKENS, MODEL_TEMPERATURE
)
from pathlib import Path
from routes import milestones as milestone_routes
from llama_inference import LlamaInference
from process_pool import submit_task, shutdown_executor
from llama_inference import run_llama_inference
from curriculum_matcher import CurriculumMatcher
sys.stdout.reconfigure(encoding='utf-8')

# Set up logging
logger = logging.getLogger(__name__)

# Global set to track all active subprocess processes
active_processes = set()
process_lock = threading.Lock()

def register_process(process):
    """Register a subprocess for cleanup tracking"""
    with process_lock:
        active_processes.add(process)

def unregister_process(process):
    """Unregister a subprocess after it's been cleaned up"""
    with process_lock:
        active_processes.discard(process)

def cleanup_process(process):
    """Safely cleanup a subprocess and all its children"""
    if not process or process.poll() is not None:
        unregister_process(process)
        return
    
    pid = process.pid
    
    try:
        process.terminate()
        
        try:
            process.wait(timeout=2)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait(timeout=1)
        
        if os.name == 'nt':
            try:
                subprocess.run(
                    ['taskkill', '/F', '/T', '/PID', str(pid)],
                    capture_output=True,
                    creationflags=subprocess.CREATE_NO_WINDOW
                )
            except Exception as e:
                logger.error(f"Error killing process tree: {e}")
    
    except Exception as e:
        logger.error(f"Error cleaning up process PID {pid}: {e}")
    finally:
        unregister_process(process)

def cleanup_all_processes():
    """Cleanup all tracked processes"""
    with process_lock:
        processes_to_clean = list(active_processes)
    
    for process in processes_to_clean:
        cleanup_process(process)

# Register cleanup function to run on exit
atexit.register(cleanup_all_processes)

# Handle termination signals
def signal_handler(signum, frame):
    cleanup_all_processes()
    sys.exit(0)

if hasattr(signal, 'SIGTERM'):
    signal.signal(signal.SIGTERM, signal_handler)
if hasattr(signal, 'SIGINT'):
    signal.signal(signal.SIGINT, signal_handler)


def get_data_directory():
    """Get user-writable data directory"""
    if os.name == 'nt':  # Windows
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Learning Hub' / 'data'
    else:  # macOS/Linux
        data_dir = Path.home() / '.olh_ai_education' / 'data'
    
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir

def load_json_data(filename: str):
    """Load data from a JSON file, create if doesn't exist"""
    filepath = get_data_directory() / filename
    
    if not filepath.exists():
        with open(filepath, 'w') as f:
            json.dump([], f)
        return []
    
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def save_json_data(filename: str, data):
    """Save data to a JSON file"""
    filepath = get_data_directory() / filename
    
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
        
# (Create app only once, after defining lifespan)

# Path for chat history storage
CHAT_HISTORY_FILE = os.path.join(os.path.dirname(__file__), "chat_history.json")

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app):
    # Startup logic
    logger.info("Checking for required files...")
    if not os.path.exists(get_model_path()):
        logger.warning(f"Model file not found at {get_model_path()}")
    else:
        logger.info(f"Model file found: {get_model_path()}")
    
    if not os.path.exists(LLAMA_CLI_PATH):
        logger.warning(f"llama-cli.exe not found at {LLAMA_CLI_PATH}")
    else:
        logger.info(f"llama-cli.exe found: {LLAMA_CLI_PATH}")
    
    # Initialize chat history file
    if not os.path.exists(CHAT_HISTORY_FILE):
        with open(CHAT_HISTORY_FILE, 'w') as f:
            json.dump([], f)
    
    # Initialize Llama model singleton
    try:
        from inference_factory import get_inference_instance
        logger.info("Initializing inference backend...")
        inference = get_inference_instance()
        if inference.is_loaded:
            logger.info(f"Inference backend loaded successfully")
        else:
            logger.error("Failed to load inference backend")
    except Exception as e:
        logger.error(f"Inference backend initialization failed: {e}")

    # Initialize CurriculumMatcher singleton
    global curriculum_matcher
    try:
        curriculum_matcher = CurriculumMatcher()
        logger.info("CurriculumMatcher initialized successfully")
    except Exception as e:
        curriculum_matcher = None
        logger.error(f"Failed to initialize CurriculumMatcher: {e}")

    # Initialize MilestoneDB
    from models.milestone_db import get_milestone_db
    try:
        milestone_db = get_milestone_db()
        logger.info("Milestone database initialized")
    except Exception as e:
        logger.error(f"Failed to initialize milestone database: {e}")
    
    logger.info("Server ready!")
    yield
    # Shutdown logic
    try:
        from inference_factory import get_inference_instance
        inference = get_inference_instance()
        inference.cleanup()
        logger.info("Inference backend cleaned up")
    except Exception as e:
        logger.error(f"Error cleaning up inference backend: {e}")
    cleanup_all_processes()
    shutdown_executor()

app = FastAPI(lifespan=lifespan)

# Include milestone routes
app.include_router(milestone_routes.router)

# Add CORS middleware AFTER creating app
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # This allows OPTIONS, POST, DELETE, etc.
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    username: str
    password: str

class ChatMessage(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []

class Message(BaseModel):
    id: str
    role: str
    content: str
    timestamp: str

class ChatHistory(BaseModel):
    id: str
    title: str
    timestamp: str
    messages: List[Message]

class TitleGenerateRequest(BaseModel):
    user_message: str
    assistant_message: str

class TitleGenerateResponse(BaseModel):
    title: str
    generated: bool
    fallback: bool
    generationTime: float


# (Removed redundant OPTIONS handler; CORS middleware handles preflight)
    
    
@app.post("/api/login")
async def login(credentials: dict):
    username = credentials.get("username")
    password = credentials.get("password")
    
    return {
        "success": True,
        "user": {
            "username": username,
            "name": username.replace("_", " ").title()  
        },
        "token": "some_token_here"
    }

@app.get("/api/chat-history")
async def get_chat_history():
    """Get all chat histories"""
    try:
        if os.path.exists(CHAT_HISTORY_FILE):
            with open(CHAT_HISTORY_FILE, 'r') as f:
                histories = json.load(f)
            histories.sort(key=lambda x: x['timestamp'], reverse=True)
            return histories
        return []
    except Exception as e:
        logger.error(f"Error loading chat history: {e}")
        return []

@app.post("/api/chat-history")
async def save_chat_history(chat: ChatHistory):
    """Save or update a chat history"""
    try:
        histories = []
        if os.path.exists(CHAT_HISTORY_FILE):
            with open(CHAT_HISTORY_FILE, 'r') as f:
                histories = json.load(f)
        
        existing_index = None
        for i, h in enumerate(histories):
            if h['id'] == chat.id:
                existing_index = i
                break
        
        chat_dict = chat.dict()
        
        if existing_index is not None:
            histories[existing_index] = chat_dict
        else:
            histories.append(chat_dict)
        
        with open(CHAT_HISTORY_FILE, 'w') as f:
            json.dump(histories, f, indent=2)
        
        return {"success": True, "id": chat.id}
    except Exception as e:
        logger.error(f"Error saving chat history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/chat-history/{chat_id}")
async def delete_chat_history(chat_id: str):
    """Delete a chat history"""
    try:
        if os.path.exists(CHAT_HISTORY_FILE):
            with open(CHAT_HISTORY_FILE, 'r') as f:
                histories = json.load(f)
            
            histories = [h for h in histories if h['id'] != chat_id]
            
            with open(CHAT_HISTORY_FILE, 'w') as f:
                json.dump(histories, f, indent=2)
            
            return {"success": True}
        
        raise HTTPException(status_code=404, detail="Chat history not found")
    except Exception as e:
        logger.error(f"Error deleting chat history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# Title Generation Helper Functions
# ============================================================================

def build_title_prompt(user_msg: str, assistant_msg: str) -> str:
    system_prompt = """You are a title generation assistant. Create concise, descriptive titles for chat conversations.

Rules:
- Maximum 60 characters
- Use title case
- Be specific and descriptive
- Capture the main topic or question
- No special characters except hyphens and ampersands
- No quotes or punctuation at the end
- Focus on the key concept or action"""
    
    user_prompt = f"""Based on this conversation, create a concise title (max 60 characters):

User: {user_msg[:200]}
Assistant: {assistant_msg[:200]}

Generate only the title, nothing else."""
    
    prompt = "<|begin_of_text|>"
    prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
    prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{user_prompt}<|eot_id|>"
    prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"
    
    return prompt


def clean_title_text(raw_title: str) -> str:
    import re
    
    prefixes_to_remove = [
        r'^Title:\s*',
        r'^Here\'s a title:\s*',
        r'^Here is a title:\s*',
        r'^A title:\s*',
        r'^Chat title:\s*',
        r'^Conversation title:\s*',
    ]
    
    title = raw_title.strip()
    
    for prefix in prefixes_to_remove:
        title = re.sub(prefix, '', title, flags=re.IGNORECASE)
    
    title = title.strip('"\'""''')
    title = re.sub(r'[.,:;!?]+$', '', title)
    
    max_length = 60
    if len(title) > max_length:
        truncated = title[:max_length]
        last_space = truncated.rfind(' ')
        if last_space > 30:
            title = truncated[:last_space] + "..."
        else:
            title = truncated[:max_length-3] + "..."
    
    return title.strip()


def create_fallback_title(user_message: str) -> str:
    from datetime import datetime
    
    if user_message and len(user_message.strip()) > 0:
        title = user_message.strip()
        title = ' '.join(title.split())
        
        max_length = 60
        if len(title) > max_length:
            truncated = title[:max_length]
            last_space = truncated.rfind(' ')
            if last_space > 20:
                title = truncated[:last_space] + "..."
            else:
                title = truncated[:max_length-3] + "..."
        
        return title
    
    now = datetime.now()
    return f"Chat - {now.strftime('%I:%M %p')}"


def validate_title(title: str) -> bool:
    if not title or len(title.strip()) == 0:
        return False
    
    if len(title) > 63:  # 60 + "..."
        return False
    
    if len(title.strip()) < 3:
        return False
    
    return True

# ============================================================================
# Title Generation Endpoint
# ============================================================================

@app.post("/api/generate-title")
async def generate_title(request: TitleGenerateRequest):
    """Generate a concise title for a chat conversation"""
    start_time = time.time()
    
    try:
        prompt = build_title_prompt(request.user_message, request.assistant_message)
        
        from inference_factory import get_inference_instance
        inference = get_inference_instance()
        result = inference.generate(
            tool_name="title_generation",
            input_data=request.user_message,
            prompt_template=prompt,
            max_tokens=30,
            temperature=0.5
        )
        
        if result["metadata"]["status"] == "error":
            raise ValueError(result["metadata"].get("error_message", "Generation failed"))
        
        raw_title = result["result"]
        title = clean_title_text(raw_title)
        
        if validate_title(title):
            generation_time = time.time() - start_time
            return TitleGenerateResponse(
                title=title,
                generated=True,
                fallback=False,
                generationTime=generation_time
            )
        else:
            raise ValueError("Generated title failed validation")
        
    except Exception as e:
        logger.error(f"Title generation error: {e}")
        title = create_fallback_title(request.user_message)
        generation_time = time.time() - start_time
        
        return TitleGenerateResponse(
            title=title,
            generated=False,
            fallback=True,
            generationTime=generation_time
        )


@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    from config import LLAMA_PARAMS
    import os

    def build_multi_turn_prompt(system_prompt, history, user_message):
        prompt = "<|begin_of_text|>"
        prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
        # Add previous turns
        for msg in history:
            if msg["role"] == "user":
                prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{msg['content']}<|eot_id|>"
            elif msg["role"] == "assistant":
                prompt += f"<|start_header_id|>assistant<|end_header_id|>\n\n{msg['content']}<|eot_id|>"
        # Add current user message
        prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{user_message}<|eot_id|>"
        prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"
        return prompt

    def get_last_n_message_pairs(messages, n_pairs):
        """
        Extract the last N user+assistant message pairs from the message list.
        Only complete pairs are included. If the last message is a user message without a following assistant,
        it is not included in the window.
        TODO: In the future, consider implementing token-based windowing for more precise context control.
        """
        # Filter only user/assistant messages
        filtered = [m for m in messages if m["role"] in ("user", "assistant")]
        # Group into pairs: (user, assistant)
        pairs = []
        i = 0
        while i < len(filtered) - 1:
            if filtered[i]["role"] == "user" and filtered[i+1]["role"] == "assistant":
                pairs.append([filtered[i], filtered[i+1]])
                i += 2
            else:
                i += 1  # skip to next, looking for a user/assistant pair
        # Take the last n_pairs
        last_pairs = pairs[-n_pairs:] if n_pairs > 0 else []
        # Flatten back to a list of messages
        return [msg for pair in last_pairs for msg in pair]

    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            user_message = message_data.get("message", "")
            chat_id = message_data.get("chat_id", None)

            if not user_message:
                continue

            system_prompt = "You are a helpful AI assistant. Answer questions naturally and conversationally. Keep responses concise but informative. Adapt your detail level to what the user asks - brief for simple questions, detailed for complex topics."

            # Default: stateless (old behavior)
            history = []

            # If chat_id is provided, try to load last N message pairs from chat history
            if chat_id:
                chat_history_file = os.path.join(os.path.dirname(__file__), "chat_history.json")
                if os.path.exists(chat_history_file):
                    try:
                        with open(chat_history_file, "r", encoding="utf-8") as f:
                            histories = json.load(f)
                        chat = next((h for h in histories if h.get("id") == chat_id), None)
                        if chat and "messages" in chat:
                            # Use sliding window: keep only the most recent N user+assistant pairs
                            N = LLAMA_PARAMS.get("conversation_history_length", 4)
                            # Exclude the current user message (not yet in history)
                            prev_msgs = [m for m in chat["messages"] if m["role"] in ("user", "assistant")]
                            history = get_last_n_message_pairs(prev_msgs, N)
                            # Note: This is message-pair based windowing. For future: implement token-based windowing.
                    except Exception as e:
                        logger.error(f"Error loading chat history for context: {e}")

            prompt = build_multi_turn_prompt(system_prompt, history, user_message)

            # === TEMP DEBUG LOGGING FOR CONTEXT WINDOW TEST ===
            try:
                logger.info("=== CONTEXT WINDOW DEBUG ===")
                logger.info(f"chat_id: {chat_id}")
                logger.info(f"conversation_history_length: {LLAMA_PARAMS.get('conversation_history_length', 4)}")
                logger.info(f"Number of messages in context: {len(history)}")
                logger.info("Message roles in context: " + str([m['role'] for m in history]))
                logger.info("Message contents in context: " + str([m['content'][:60] for m in history]))
                logger.info(f"Current user message: {user_message[:60]}")
                logger.info(f"Prompt preview: {prompt[:500]}")
            except Exception as e:
                logger.error(f"Error in context window debug logging: {e}")
            # === END TEMP DEBUG LOGGING ===

            try:
                from inference_factory import get_inference_instance
                inference = get_inference_instance()

                # Use streaming method for real-time generation
                async for chunk in inference.generate_stream(
                    tool_name="chat",
                    input_data=user_message,
                    prompt_template=prompt,
                    max_tokens=LLAMA_PARAMS["max_tokens"],
                    temperature=LLAMA_PARAMS["temperature"]
                ):
                    if chunk.get("error"):
                        try:
                            await websocket.send_json({
                                "type": "error",
                                "message": chunk["error"]
                            })
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send error message - connection closed")
                        break

                    if chunk["finished"]:
                        try:
                            await websocket.send_json({"type": "done"})
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send done message - connection closed")
                        break

                    # Send each token as it's generated in real-time
                    try:
                        await websocket.send_json({
                            "type": "token",
                            "content": chunk["token"]
                        })
                        await asyncio.sleep(0)  # Force immediate flush - critical for Electron
                    except Exception as e:
                        logger.error(f"Error sending token: {e}")
                        break

            except Exception as e:
                logger.error(f"Chat generation error: {e}")
                try:
                    await websocket.send_json({
                        "type": "error",
                        "message": str(e)
                    })
                except:
                    # Connection already closed, just log
                    logger.error("Could not send error message - connection closed")

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")

class LessonPlanRequest(BaseModel):
    prompt: str


LESSON_PLAN_HISTORY_FILE = os.path.join(os.path.dirname(__file__), "lesson_plan_history.json")

class LessonPlanHistory(BaseModel):
    id: str
    title: str
    timestamp: str
    formData: dict
    generatedPlan: str

@app.get("/api/lesson-plan-history")
async def get_lesson_plan_history():
    """Get all lesson plan histories"""
    try:
        if os.path.exists(LESSON_PLAN_HISTORY_FILE):
            with open(LESSON_PLAN_HISTORY_FILE, 'r') as f:
                histories = json.load(f)
            histories.sort(key=lambda x: x['timestamp'], reverse=True)
            return histories
        return []
    except Exception as e:
        logger.error(f"Error loading lesson plan history: {e}")
        return []

@app.post("/api/lesson-plan-history")
async def save_lesson_plan_history(plan: LessonPlanHistory):
    """Save or update a lesson plan history"""
    try:
        histories = []
        if os.path.exists(LESSON_PLAN_HISTORY_FILE):
            with open(LESSON_PLAN_HISTORY_FILE, 'r') as f:
                histories = json.load(f)
        
        existing_index = None
        for i, h in enumerate(histories):
            if h['id'] == plan.id:
                existing_index = i
                break
        
        plan_dict = plan.dict()
        
        if existing_index is not None:
            histories[existing_index] = plan_dict
        else:
            histories.append(plan_dict)
        
        with open(LESSON_PLAN_HISTORY_FILE, 'w') as f:
            json.dump(histories, f, indent=2)
        
        return {"success": True, "id": plan.id}
    except Exception as e:
        logger.error(f"Error saving lesson plan history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/lesson-plan-history/{plan_id}")
async def delete_lesson_plan_history(plan_id: str):
    """Delete a lesson plan history"""
    try:
        if os.path.exists(LESSON_PLAN_HISTORY_FILE):
            with open(LESSON_PLAN_HISTORY_FILE, 'r') as f:
                histories = json.load(f)
            
            histories = [h for h in histories if h['id'] != plan_id]
            
            with open(LESSON_PLAN_HISTORY_FILE, 'w') as f:
                json.dump(histories, f, indent=2)
            
            return {"success": True}
        
        raise HTTPException(status_code=404, detail="Lesson plan history not found")
    except Exception as e:
        logger.error(f"Error deleting lesson plan history: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    
@app.post("/api/generate-lesson-plan")
async def generate_lesson_plan(request: LessonPlanRequest):
    """Generate a lesson plan using the LLM (via process pool)"""
    try:
        prompt_text = f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are an expert educational consultant and curriculum designer. Create detailed, engaging, and pedagogically sound lesson plans.<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{request.prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n"

        settings = {
            "model_path": get_model_path(),
            "n_ctx": MODEL_N_CTX,
            "max_tokens": 6000,
            "temperature": 0.7,
            "tool_name": "lesson_plan",
            "prompt_template": prompt_text,
        }
        future = submit_task(run_llama_inference, request.prompt, settings)
        result = await asyncio.wrap_future(future)

        if result["metadata"]["status"] == "error":
            raise HTTPException(status_code=500, detail=result["metadata"].get("error_message", "Generation failed"))

        return {"lessonPlan": result["result"]}

    except Exception as e:
        logger.error(f"Error generating lesson plan: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.websocket("/ws/lesson-plan")
async def websocket_lesson_plan(websocket: WebSocket):
    await websocket.accept()
    global curriculum_matcher
    from generation_gate import acquire_generation_slot, release_generation_slot

    cancelled_job_ids = set()

    try:
        while True:
            data = await websocket.receive_json()
            # Handle cancellation message
            if isinstance(data, dict) and data.get("type") == "cancel" and "jobId" in data:
                cancelled_job_ids.add(data["jobId"])
                await websocket.send_json({"type": "cancelled", "jobId": data["jobId"]})
                continue

            prompt = data.get("prompt", "")
            form_data = data.get("formData", {})
            job_id = data.get("jobId") or data.get("id") or "lesson-plan"
            generation_mode = data.get("generationMode", "queued")

            if not prompt:
                continue

            # Use CurriculumMatcher to find relevant curriculum pages
            curriculum_refs = []
            curriculum_context = ""
            if curriculum_matcher:
                query = ""
                if isinstance(form_data, dict) and form_data:
                    query = " ".join(str(v) for v in form_data.values() if v)
                if not query:
                    query = prompt
                matches = curriculum_matcher.find_matching_pages(query, top_k=3)
                curriculum_refs = [
                    {
                        "id": m.get("id"),
                        "displayName": m.get("displayName"),
                        "grade": m.get("grade"),
                        "subject": m.get("subject"),
                        "route": m.get("route"),
                        "matchScore": m.get("matchScore"),
                    }
                    for m in matches
                ]
                context_blocks = []
                for m in matches:
                    ctx = curriculum_matcher.get_curriculum_context(m.get("id"))
                    if ctx:
                        context_blocks.append(ctx)
                if context_blocks:
                    curriculum_context = "\n\n".join(context_blocks)

            system_prompt = "You are an expert educational consultant and curriculum designer. Create detailed, engaging, and pedagogically sound lesson plans that teachers can immediately implement. Focus on practical activities, clear assessment strategies, and alignment with curriculum standards."
            if curriculum_context:
                system_prompt += "\n\nCurriculum Alignment Context:\n" + curriculum_context

            full_prompt = "<|begin_of_text|>"
            full_prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
            full_prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>"
            full_prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"

            # Send curriculum references to frontend before generation
            if curriculum_refs:
                try:
                    await websocket.send_json({
                        "type": "curriculum_refs",
                        "references": curriculum_refs
                    })
                except Exception as e:
                    logger.error(f"Error sending curriculum references: {e}")

            slot_mode = None
            try:
                # Acquire generation slot (queue or parallel)
                slot_mode = await acquire_generation_slot(websocket, generation_mode, job_id)
                
                # ✅ FIX: Use inference factory instead of process pool
                from inference_factory import get_inference_instance
                inference = get_inference_instance()

                # Stream tokens in real-time (works with both Gemma API and local models)
                async for chunk in inference.generate_stream(
                    tool_name="lesson_plan",
                    input_data=prompt,
                    prompt_template=full_prompt,
                    max_tokens=6000,
                    temperature=0.7
                ):
                    if job_id in cancelled_job_ids:
                        await websocket.send_json({"type": "cancelled", "jobId": job_id})
                        break

                    if chunk.get("error"):
                        try:
                            await websocket.send_json({
                                "type": "error",
                                "message": chunk["error"]
                            })
                            await asyncio.sleep(0)
                        except:
                            logger.error("Could not send error message - connection closed")
                        break

                    if chunk.get("finished"):
                        try:
                            await websocket.send_json({"type": "done"})
                            await asyncio.sleep(0)
                        except:
                            logger.error("Could not send done message - connection closed")
                        break

                    # Send each token as it's generated
                    try:
                        await websocket.send_json({
                            "type": "token",
                            "content": chunk["token"]
                        })
                        await asyncio.sleep(0)  # Force immediate flush
                    except Exception as e:
                        logger.error(f"Error sending token: {e}")
                        break

            except Exception as e:
                logger.error(f"Lesson plan generation error: {e}")
                import traceback
                logger.error(f"Full traceback: {traceback.format_exc()}")
                try:
                    await websocket.send_json({
                        "type": "error",
                        "message": str(e)
                    })
                except:
                    logger.error("Could not send error message - connection closed")
            finally:
                try:
                    release_generation_slot(slot_mode or generation_mode)
                except Exception as e:
                    logger.error(f"Error releasing generation slot: {e}")

    except WebSocketDisconnect:
        logger.info("Lesson Plan WebSocket disconnected")
    except Exception as e:
        logger.error(f"Lesson Plan WebSocket error: {str(e)}")
        import traceback
        logger.error(f"Full traceback: {traceback.format_exc()}")
 
 

@app.websocket("/ws/quiz")
async def quiz_websocket(websocket: WebSocket):
    await websocket.accept()
    from generation_gate import acquire_generation_slot, release_generation_slot

    cancelled_job_ids = set()

    try:
        while True:
            data = await websocket.receive_json()
            # Handle cancellation message
            if isinstance(data, dict) and data.get("type") == "cancel" and "jobId" in data:
                cancelled_job_ids.add(data["jobId"])
                await websocket.send_json({"type": "cancelled", "jobId": data["jobId"]})
                continue

            prompt = data.get("prompt", "")
            job_id = data.get("jobId") or data.get("id") or "quiz"
            generation_mode = data.get("generationMode", "queued")
            
            if not prompt:
                logger.error("Empty quiz prompt received")
                continue

            system_prompt = "You are an expert educational assessment designer. Create comprehensive, well-structured quizzes that accurately assess student learning."

            full_prompt = "<|begin_of_text|>"
            full_prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
            full_prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>"
            full_prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"

            slot_mode = None
            try:
                # Acquire generation slot (queue or parallel)
                slot_mode = await acquire_generation_slot(websocket, generation_mode, job_id)
                from inference_factory import get_inference_instance
                inference = get_inference_instance()

                # Stream tokens as they are generated
                async for chunk in inference.generate_stream(
                    tool_name="quiz",
                    input_data=prompt,
                    prompt_template=full_prompt,
                    max_tokens=6000,
                    temperature=0.7
                ):
                    if job_id in cancelled_job_ids:
                        await websocket.send_json({"type": "cancelled", "jobId": job_id})
                        break

                    if chunk.get("error"):
                        try:
                            await websocket.send_json({
                                "type": "error",
                                "message": chunk["error"]
                            })
                            await asyncio.sleep(0)
                        except:
                            logger.error("Could not send error message - connection closed")
                        break

                    if chunk.get("finished"):
                        try:
                            await websocket.send_json({"type": "done"})
                            await asyncio.sleep(0)
                        except:
                            logger.error("Could not send done message - connection closed")
                        break

                    # Send each token as it's generated in real-time
                    try:
                        await websocket.send_json({
                            "type": "token",
                            "content": chunk["token"]
                        })
                        await asyncio.sleep(0)
                    except Exception as e:
                        logger.error(f"Error sending token: {e}")
                        break

            except Exception as e:
                logger.error(f"Quiz generation error: {e}")
                try:
                    await websocket.send_json({
                        "type": "error",
                        "message": str(e)
                    })
                except:
                    logger.error("Could not send error message - connection closed")
            finally:
                # Always release the slot
                try:
                    release_generation_slot(slot_mode or generation_mode)
                except Exception as e:
                    logger.error(f"Error releasing generation slot: {e}")

    except WebSocketDisconnect:
        logger.info("Quiz WebSocket disconnected")
    except Exception as e:
        logger.error(f"Quiz WebSocket error: {str(e)}")
        
        

@app.websocket("/ws/rubric")
async def rubric_websocket(websocket: WebSocket):
    await websocket.accept()
    logger.info("Rubric WebSocket connection accepted")
    from generation_gate import acquire_generation_slot, release_generation_slot

    cancelled_job_ids = set()

    try:
        while True:
            logger.info("Waiting for rubric request...")
            data = await websocket.receive_json()
            # Handle cancellation message
            if isinstance(data, dict) and data.get("type") == "cancel" and "jobId" in data:
                cancelled_job_ids.add(data["jobId"])
                await websocket.send_json({"type": "cancelled", "jobId": data["jobId"]})
                continue

            logger.info(f"Received rubric request, prompt length: {len(data.get('prompt', ''))}")

            prompt = data.get("prompt", "")
            job_id = data.get("jobId") or data.get("id") or "rubric"
            generation_mode = data.get("generationMode", "queued")

            if not prompt:
                logger.error("Empty rubric prompt received")
                continue

            logger.info("Building rubric prompt...")
            system_prompt = "You are an expert educational assessment designer. Create detailed, fair, and comprehensive grading rubrics that clearly define performance criteria at each level."

            full_prompt = "<|begin_of_text|>"
            full_prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
            full_prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>"
            full_prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"

            slot_mode = None
            try:
                # Acquire generation slot (queue or parallel)
                slot_mode = await acquire_generation_slot(websocket, generation_mode, job_id)
                logger.info("Getting LlamaInference instance...")
                from inference_factory import get_inference_instance
                inference = get_inference_instance()
                logger.info("Starting rubric generation...")

                # Use streaming method for real-time generation
                async for chunk in inference.generate_stream(
                    tool_name="rubric",
                    input_data=prompt,
                    prompt_template=full_prompt,
                    max_tokens=6000,
                    temperature=0.7
                ):
                    if job_id in cancelled_job_ids:
                        await websocket.send_json({"type": "cancelled", "jobId": job_id})
                        break

                    if chunk.get("error"):
                        try:
                            await websocket.send_json({
                                "type": "error",
                                "message": chunk["error"]
                            })
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send error message - connection closed")
                        break

                    if chunk.get("finished"):
                        logger.info("Rubric generation complete")
                        try:
                            await websocket.send_json({"type": "done"})
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send done message - connection closed")
                        break

                    # Send each token as it's generated in real-time
                    try:
                        await websocket.send_json({
                            "type": "token",
                            "content": chunk["token"]
                        })
                        await asyncio.sleep(0)  # Force immediate flush - critical for Electron
                    except Exception as e:
                        logger.error(f"Error sending token: {e}")
                        break

            except Exception as e:
                logger.error(f"Rubric generation error: {e}")
                try:
                    await websocket.send_json({
                        "type": "error",
                        "message": str(e)
                    })
                except:
                    logger.error("Could not send error message - connection closed")
            finally:
                try:
                    release_generation_slot(slot_mode or generation_mode)
                except Exception as e:
                    logger.error(f"Error releasing generation slot: {e}")

    except WebSocketDisconnect:
        logger.info("Rubric WebSocket disconnected")
    except Exception as e:
        logger.error(f"Rubric WebSocket error: {str(e)}")



@app.websocket("/ws/kindergarten")
async def kindergarten_websocket(websocket: WebSocket):
    await websocket.accept()
    from generation_gate import acquire_generation_slot, release_generation_slot

    cancelled_job_ids = set()

    try:
        while True:
            data = await websocket.receive_json()
            # Handle cancellation message
            if isinstance(data, dict) and data.get("type") == "cancel" and "jobId" in data:
                cancelled_job_ids.add(data["jobId"])
                await websocket.send_json({"type": "cancelled", "jobId": data["jobId"]})
                continue

            prompt = data.get("prompt", "")
            job_id = data.get("jobId") or data.get("id") or "kindergarten"
            generation_mode = data.get("generationMode", "queued")

            if not prompt:
                continue

            system_prompt = "You are an expert early childhood educator specializing in kindergarten education. Create developmentally appropriate, engaging, and playful lesson plans that foster learning through exploration and hands-on activities."

            full_prompt = "<|begin_of_text|>"
            full_prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
            full_prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>"
            full_prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"

            slot_mode = None
            try:
                # Acquire generation slot (queue or parallel)
                slot_mode = await acquire_generation_slot(websocket, generation_mode, job_id)
                from inference_factory import get_inference_instance
                inference = get_inference_instance()

                # Use streaming method for real-time generation
                async for chunk in inference.generate_stream(
                    tool_name="kindergarten",
                    input_data=prompt,
                    prompt_template=full_prompt,
                    max_tokens=6000,
                    temperature=0.7
                ):
                    if job_id in cancelled_job_ids:
                        await websocket.send_json({"type": "cancelled", "jobId": job_id})
                        break

                    if chunk.get("error"):
                        try:
                            await websocket.send_json({
                                "type": "error",
                                "message": chunk["error"]
                            })
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send error message - connection closed")
                        break

                    if chunk.get("finished"):
                        try:
                            await websocket.send_json({"type": "done"})
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send done message - connection closed")
                        break

                    # Send each token as it's generated in real-time
                    try:
                        await websocket.send_json({
                            "type": "token",
                            "content": chunk["token"]
                        })
                        await asyncio.sleep(0)  # Force immediate flush - critical for Electron
                    except Exception as e:
                        logger.error(f"Error sending token: {e}")
                        break

            except Exception as e:
                logger.error(f"Kindergarten generation error: {e}")
                try:
                    await websocket.send_json({
                        "type": "error",
                        "message": str(e)
                    })
                except:
                    logger.error("Could not send error message - connection closed")
            finally:
                try:
                    release_generation_slot(slot_mode or generation_mode)
                except Exception as e:
                    logger.error(f"Error releasing generation slot: {e}")

    except WebSocketDisconnect:
        logger.info("Kindergarten WebSocket disconnected")
    except Exception as e:
        logger.error(f"Kindergarten WebSocket error: {str(e)}")

@app.websocket("/ws/multigrade")
async def multigrade_websocket(websocket: WebSocket):
    await websocket.accept()
    from generation_gate import acquire_generation_slot, release_generation_slot

    cancelled_job_ids = set()

    try:
        while True:
            data = await websocket.receive_json()
            # Handle cancellation message
            if isinstance(data, dict) and data.get("type") == "cancel" and "jobId" in data:
                cancelled_job_ids.add(data["jobId"])
                await websocket.send_json({"type": "cancelled", "jobId": data["jobId"]})
                continue

            prompt = data.get("prompt", "")
            job_id = data.get("jobId") or data.get("id") or "multigrade"
            generation_mode = data.get("generationMode", "queued")

            if not prompt:
                continue

            system_prompt = "You are an expert educator specializing in multigrade and multi-age classroom instruction. Create comprehensive lesson plans that address multiple grade levels simultaneously with differentiated activities and flexible grouping strategies."

            full_prompt = "<|begin_of_text|>"
            full_prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
            full_prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>"
            full_prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"

            slot_mode = None
            try:
                # Acquire generation slot (queue or parallel)
                slot_mode = await acquire_generation_slot(websocket, generation_mode, job_id)
                from inference_factory import get_inference_instance
                inference = get_inference_instance()

                # Use streaming method for real-time generation
                async for chunk in inference.generate_stream(
                    tool_name="multigrade",
                    input_data=prompt,
                    prompt_template=full_prompt,
                    max_tokens=6000,
                    temperature=0.7
                ):
                    if job_id in cancelled_job_ids:
                        await websocket.send_json({"type": "cancelled", "jobId": job_id})
                        break

                    if chunk.get("error"):
                        try:
                            await websocket.send_json({
                                "type": "error",
                                "message": chunk["error"]
                            })
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send error message - connection closed")
                        break

                    if chunk.get("finished"):
                        try:
                            await websocket.send_json({"type": "done"})
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send done message - connection closed")
                        break

                    # Send each token as it's generated in real-time
                    try:
                        await websocket.send_json({
                            "type": "token",
                            "content": chunk["token"]
                        })
                        await asyncio.sleep(0)  # Force immediate flush - critical for Electron
                    except Exception as e:
                        logger.error(f"Error sending token: {e}")
                        break

            except Exception as e:
                logger.error(f"Multigrade generation error: {e}")
                try:
                    await websocket.send_json({
                        "type": "error",
                        "message": str(e)
                    })
                except:
                    logger.error("Could not send error message - connection closed")
            finally:
                try:
                    release_generation_slot(slot_mode or generation_mode)
                except Exception as e:
                    logger.error(f"Error releasing generation slot: {e}")

    except WebSocketDisconnect:
        logger.info("Multigrade WebSocket disconnected")
    except Exception as e:
        logger.error(f"Multigrade WebSocket error: {str(e)}")


@app.websocket("/ws/cross-curricular")
async def cross_curricular_websocket(websocket: WebSocket):
    await websocket.accept()
    from generation_gate import acquire_generation_slot, release_generation_slot

    cancelled_job_ids = set()

    try:
        while True:
            data = await websocket.receive_json()
            # Handle cancellation message
            if isinstance(data, dict) and data.get("type") == "cancel" and "jobId" in data:
                cancelled_job_ids.add(data["jobId"])
                await websocket.send_json({"type": "cancelled", "jobId": data["jobId"]})
                continue

            prompt = data.get("prompt", "")
            job_id = data.get("jobId") or data.get("id") or "cross-curricular"
            generation_mode = data.get("generationMode", "queued")

            if not prompt:
                continue

            system_prompt = "You are an expert educational consultant specializing in integrated and cross-curricular lesson planning. Create comprehensive lesson plans that meaningfully connect multiple subject areas and demonstrate authentic interdisciplinary learning."

            full_prompt = "<|begin_of_text|>"
            full_prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
            full_prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>"
            full_prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"

            slot_mode = None
            try:
                # Acquire generation slot (queue or parallel)
                slot_mode = await acquire_generation_slot(websocket, generation_mode, job_id)
                from inference_factory import get_inference_instance
                inference = get_inference_instance()

                # Use streaming method for real-time generation
                async for chunk in inference.generate_stream(
                    tool_name="cross_curricular",
                    input_data=prompt,
                    prompt_template=full_prompt,
                    max_tokens=6000,
                    temperature=0.7
                ):
                    if job_id in cancelled_job_ids:
                        await websocket.send_json({"type": "cancelled", "jobId": job_id})
                        break

                    if chunk.get("error"):
                        try:
                            await websocket.send_json({
                                "type": "error",
                                "message": chunk["error"]
                            })
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send error message - connection closed")
                        break

                    if chunk.get("finished"):
                        try:
                            await websocket.send_json({"type": "done"})
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send done message - connection closed")
                        break

                    # Send each token as it's generated in real-time
                    try:
                        await websocket.send_json({
                            "type": "token",
                            "content": chunk["token"]
                        })
                        await asyncio.sleep(0)  # Force immediate flush - critical for Electron
                    except Exception as e:
                        logger.error(f"Error sending token: {e}")
                        break

            except Exception as e:
                logger.error(f"Cross-curricular generation error: {e}")
                try:
                    await websocket.send_json({
                        "type": "error",
                        "message": str(e)
                    })
                except:
                    logger.error("Could not send error message - connection closed")
            finally:
                try:
                    release_generation_slot(slot_mode or generation_mode)
                except Exception as e:
                    logger.error(f"Error releasing generation slot: {e}")

    except WebSocketDisconnect:
        logger.info("Cross-curricular WebSocket disconnected")
    except Exception as e:
        logger.error(f"Cross-curricular WebSocket error: {str(e)}")

@app.get("/api/quiz-history")
async def get_quiz_history():
    return load_json_data("quiz_history.json")

@app.post("/api/quiz-history")
async def save_quiz_history(data: dict):
    histories = load_json_data("quiz_history.json")
    existing = next((h for h in histories if h.get("id") == data.get("id")), None)
    if existing:
        histories = [h for h in histories if h.get("id") != data.get("id")]
    histories.append(data)
    save_json_data("quiz_history.json", histories[-20:])
    return {"success": True}

@app.delete("/api/quiz-history/{quiz_id}")
async def delete_quiz_history(quiz_id: str):
    histories = load_json_data("quiz_history.json")
    histories = [h for h in histories if h.get("id") != quiz_id]
    save_json_data("quiz_history.json", histories)
    return {"success": True}


@app.get("/api/rubric-history")
async def get_rubric_history():
    return load_json_data("rubric_history.json")

@app.post("/api/rubric-history")
async def save_rubric_history(data: dict):
    histories = load_json_data("rubric_history.json")
    existing = next((h for h in histories if h.get("id") == data.get("id")), None)
    if existing:
        histories = [h for h in histories if h.get("id") != data.get("id")]
    histories.append(data)
    save_json_data("rubric_history.json", histories[-20:])
    return {"success": True}

@app.delete("/api/rubric-history/{rubric_id}")
async def delete_rubric_history(rubric_id: str):
    histories = load_json_data("rubric_history.json")
    histories = [h for h in histories if h.get("id") != rubric_id]
    save_json_data("rubric_history.json", histories)
    return {"success": True}


@app.get("/api/kindergarten-history")
async def get_kindergarten_history():
    return load_json_data("kindergarten_history.json")

@app.post("/api/kindergarten-history")
async def save_kindergarten_history(data: dict):
    histories = load_json_data("kindergarten_history.json")
    existing = next((h for h in histories if h.get("id") == data.get("id")), None)
    if existing:
        histories = [h for h in histories if h.get("id") != data.get("id")]
    histories.append(data)
    save_json_data("kindergarten_history.json", histories[-20:])
    return {"success": True}

@app.delete("/api/kindergarten-history/{plan_id}")
async def delete_kindergarten_history(plan_id: str):
    histories = load_json_data("kindergarten_history.json")
    histories = [h for h in histories if h.get("id") != plan_id]
    save_json_data("kindergarten_history.json", histories)
    return {"success": True}


@app.get("/api/multigrade-history")
async def get_multigrade_history():
    return load_json_data("multigrade_history.json")

@app.post("/api/multigrade-history")
async def save_multigrade_history(data: dict):
    histories = load_json_data("multigrade_history.json")
    existing = next((h for h in histories if h.get("id") == data.get("id")), None)
    if existing:
        histories = [h for h in histories if h.get("id") != data.get("id")]
    histories.append(data)
    save_json_data("multigrade_history.json", histories[-20:])
    return {"success": True}

@app.delete("/api/multigrade-history/{plan_id}")
async def delete_multigrade_history(plan_id: str):
    histories = load_json_data("multigrade_history.json")
    histories = [h for h in histories if h.get("id") != plan_id]
    save_json_data("multigrade_history.json", histories)
    return {"success": True}


@app.get("/api/cross-curricular-history")
async def get_cross_curricular_history():
    return load_json_data("cross_curricular_history.json")

@app.post("/api/cross-curricular-history")
async def save_cross_curricular_history(data: dict):
    histories = load_json_data("cross_curricular_history.json")
    existing = next((h for h in histories if h.get("id") == data.get("id")), None)
    if existing:
        histories = [h for h in histories if h.get("id") != data.get("id")]
    histories.append(data)
    save_json_data("cross_curricular_history.json", histories[-20:])
    return {"success": True}

@app.delete("/api/cross-curricular-history/{plan_id}")
async def delete_cross_curricular_history(plan_id: str):
    histories = load_json_data("cross_curricular_history.json")
    histories = [h for h in histories if h.get("id") != plan_id]
    save_json_data("cross_curricular_history.json", histories)
    return {"success": True}


def scan_models_directory():
    """Scan the models directory for available AI model files"""
    models = []
    
    if not MODELS_DIR.exists():
        MODELS_DIR.mkdir(parents=True, exist_ok=True)
        return models
    
    model_extensions = ['.gguf', '.bin', '.ggml']
    
    try:
        for file_path in MODELS_DIR.iterdir():
            if file_path.is_file() and file_path.suffix.lower() in model_extensions:
                file_size_mb = file_path.stat().st_size / (1024 * 1024)
                
                model_info = {
                    "name": file_path.name,
                    "path": str(file_path),
                    "size_mb": round(file_size_mb, 2),
                    "extension": file_path.suffix,
                    "is_active": file_path.name == get_selected_model()
                }
                models.append(model_info)
        
        models.sort(key=lambda x: x["name"])
        
    except Exception as e:
        logger.error(f"Error scanning models directory: {e}")
    
    return models


@app.get("/api/models")
async def get_available_models():
    """Get list of available AI models in the models directory"""
    try:
        models = scan_models_directory()
        return {
            "success": True,
            "models": models,
            "models_directory": str(MODELS_DIR),
            "count": len(models)
        }
    except Exception as e:
        logger.error(f"Error retrieving models: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving models: {str(e)}")


@app.post("/api/models/select")
async def select_model(request: Request):
    """Set the active model for generation"""
    try:
        data = await request.json()
        model_name = data.get('modelName')
        
        if not model_name:
            return JSONResponse(
                status_code=400,
                content={"error": "Model name is required"}
            )
        
        model_path = MODELS_DIR / model_name
        if not model_path.exists():
            return JSONResponse(
                status_code=404,
                content={"error": f"Model not found: {model_name}"}
            )
        
        if set_selected_model(model_name):
            return JSONResponse(content={
                "success": True,
                "message": f"Model set to {model_name}",
                "selectedModel": model_name
            })
        else:
            return JSONResponse(
                status_code=500,
                content={"error": "Failed to save model selection"}
            )
            
    except Exception as e:
        logger.error(f"Error selecting model: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.get("/api/models/active")
async def get_active_model():
    """Get the currently active model"""
    try:
        selected_model = get_selected_model()
        model_path = get_model_path()
        
        return JSONResponse(content={
            "modelName": selected_model,
            "modelPath": model_path,
            "exists": Path(model_path).exists()
        })
    except Exception as e:
        logger.error(f"Error getting active model: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.post("/api/models/open-folder")
async def open_models_folder():
    """Open the models directory in Windows File Explorer"""
    try:
        models_path = str(MODELS_DIR.resolve())
        
        if not MODELS_DIR.exists():
            MODELS_DIR.mkdir(parents=True, exist_ok=True)
        
        if os.name == 'nt':  # Windows
            subprocess.run(['explorer', models_path], check=True)
            return {
                "success": True,
                "message": "Models folder opened",
                "path": models_path
            }
        else:
            return {
                "success": False,
                "message": "Opening folder is only supported on Windows",
                "path": models_path
            }
    except Exception as e:
        logger.error(f"Error opening models folder: {e}")
        raise HTTPException(status_code=500, detail=f"Error opening models folder: {str(e)}")


@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "model_found": os.path.exists(get_model_path()),
        "llama_cli_found": os.path.exists(LLAMA_CLI_PATH),
        "chat_history_file": os.path.exists(CHAT_HISTORY_FILE)
    }

@app.post("/api/shutdown")
async def shutdown():
    """Gracefully shutdown the backend and cleanup all processes"""
    cleanup_all_processes()
    
    # Schedule server shutdown after sending response
    import asyncio
    asyncio.create_task(_shutdown_server())
    
    return {"status": "shutting down"}

async def _shutdown_server():
    """Shutdown the server after a brief delay"""
    await asyncio.sleep(0.5)  # Allow response to be sent
    os._exit(0)  # Force terminate the process


# (Removed old shutdown event handler, now handled in lifespan)
    
    
# =========================
# Export Endpoint
# =========================

from fastapi import Body
from fastapi.responses import StreamingResponse
# NOTE: This file must be run as a module/package (e.g., `python -m backend.main` or `uvicorn backend.main:app`)
from export_utils import EXPORT_FORMATTERS

EXPORT_TYPE_FORMATS = {
    "plan": {"pdf", "docx"},
    "quiz": {"pdf", "docx"},
    "rubric": {"pdf", "docx"},
    "curriculum": {"pdf", "docx", "csv", "json", "md", "markdown"},
    "chat_history": {"pdf", "docx", "csv", "json", "md", "markdown"},
    "lesson_plan_history": {"pdf", "docx", "csv", "json", "md", "markdown"},
    "quiz_history": {"pdf", "docx", "csv", "json", "md", "markdown"},
    "rubric_history": {"pdf", "docx", "csv", "json", "md", "markdown"},
    "kindergarten_history": {"pdf", "docx", "csv", "json", "md", "markdown"},
    "multigrade_history": {"pdf", "docx", "csv", "json", "md", "markdown"},
    "cross_curricular_history": {"pdf", "docx", "csv", "json", "md", "markdown"},
}

CONTENT_TYPES = {
    "pdf": "application/pdf",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "csv": "text/csv",
    "json": "application/json",
    "md": "text/markdown",
    "markdown": "text/markdown",
}

@app.post("/api/export")
async def export_data(
    data_type: str = Body(..., embed=True),
    format: str = Body(..., embed=True),
    data: dict = Body(..., embed=True),
    title: str = Body("Export", embed=True)
):
    """
    Export endpoint for various data types and formats.
    """
    # Validate data_type
    if data_type not in EXPORT_TYPE_FORMATS:
        return JSONResponse(
            status_code=400,
            content={"error": f"Invalid data_type '{data_type}'. Allowed: {list(EXPORT_TYPE_FORMATS.keys())}"}
        )
    # Validate format
    allowed_formats = EXPORT_TYPE_FORMATS[data_type]
    if format not in allowed_formats:
        return JSONResponse(
            status_code=400,
            content={"error": f"Format '{format}' not allowed for data_type '{data_type}'. Allowed: {sorted(allowed_formats)}"}
        )
    # Validate formatter
    formatter = EXPORT_FORMATTERS.get(format)
    if not formatter:
        return JSONResponse(
            status_code=400,
            content={"error": f"Export format '{format}' is not supported."}
        )
    # Export
    try:
        exported_bytes = formatter(data, title=title)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Export failed: {str(e)}"}
        )
    # Prepare response
    ext = "md" if format == "markdown" else format
    filename = f"{data_type}_{title.replace(' ', '_')}.{ext}"
    content_type = CONTENT_TYPES.get(format, "application/octet-stream")
    return StreamingResponse(
        io.BytesIO(exported_bytes),
        media_type=content_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

    
