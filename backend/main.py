# Enforce UTF-8 encoding for all std streams and environment
import os
import sys
import uuid
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

# Set environment variable for all subprocesses
os.environ["PYTHONIOENCODING"] = "utf-8"

# Reconfigure stdout/stderr if possible (Python 3.7+)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Request, File, UploadFile, Form
from fastapi.responses import JSONResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from image_service import get_image_service
import base64
from pydantic import BaseModel
from typing import List, Optional
import subprocess
import io
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
    MODEL_PATH, MODEL_VERBOSE, MODEL_N_CTX, MODEL_MAX_TOKENS, MODEL_TEMPERATURE,
    IMAGE_MODELS_DIR, get_selected_diffusion_model, set_selected_diffusion_model,
    get_diffusion_model_path, scan_diffusion_models
)
from pathlib import Path
from datetime import datetime
from routes import milestones
import student_service
from llama_inference import LlamaInference
from process_pool import submit_task, shutdown_executor
from llama_inference import run_llama_inference
from curriculum_matcher import CurriculumMatcher
from chat_memory import get_chat_memory
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

_json_cache = {}

def load_json_data(filename: str):
    """Load data from a JSON file with in-memory cache"""
    if filename in _json_cache:
        return _json_cache[filename]

    filepath = get_data_directory() / filename

    if not filepath.exists():
        with open(filepath, 'w') as f:
            json.dump([], f)
        _json_cache[filename] = []
        return []

    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        _json_cache[filename] = data
        return data
    except json.JSONDecodeError:
        _json_cache[filename] = []
        return []

def save_json_data(filename: str, data):
    """Save data to a JSON file and update cache"""
    filepath = get_data_directory() / filename

    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
    _json_cache[filename] = data
        
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
    
    # Initialize SQLite chat memory and migrate old JSON data if present
    memory = get_chat_memory()
    memory.import_from_json(CHAT_HISTORY_FILE)
    logger.info(f"Chat memory initialized (SQLite): {memory.db_path}")
    
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
    from milestones.milestone_db import get_milestone_db
    try:
        milestone_db = get_milestone_db()
        logger.info("Milestone database initialized")
    except Exception as e:
        logger.error(f"Failed to initialize milestone database: {e}")

    # Initialize Student DB
    try:
        student_service.init_db()
        logger.info("Student database initialized")
    except Exception as e:
        logger.error(f"Failed to initialize student database: {e}")

    # Initialize Image Service
    try:
        from image_service import get_image_service
        image_service = get_image_service()
        logger.info("Image service initialized")

        # Start IOPaint on startup
        image_service.start_iopaint()
    except Exception as e:
        logger.error(f"Failed to initialize image service: {e}")

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
        
    try:
        from image_service import get_image_service
        image_service = get_image_service()
        image_service.cleanup()
        logger.info("Image service cleaned up")
    except Exception as e:
        logger.error(f"Error cleaning up image service: {e}")
        
    cleanup_all_processes()
    shutdown_executor()

app = FastAPI(lifespan=lifespan)

# Include milestone routes
app.include_router(milestones.router)

# Include scene-based image generation routes
from scene_api_endpoints import router as scene_router
app.include_router(scene_router)

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

class AutocompleteRequest(BaseModel):
    text: str
    max_tokens: int = 20

class StudentCreate(BaseModel):
    full_name: str
    date_of_birth: Optional[str] = None
    class_name: Optional[str] = None
    grade_level: Optional[str] = None
    gender: Optional[str] = None
    contact_info: Optional[str] = None

class QuizGradeCreate(BaseModel):
    student_id: str
    quiz_title: str
    subject: str
    score: float
    total_points: float
    percentage: float
    letter_grade: str
    answers: Optional[dict] = {}

class AttendanceRecord(BaseModel):
    student_id: str
    class_name: str
    date: str
    status: str
    engagement_level: str
    notes: Optional[str] = ''

class AttendanceSave(BaseModel):
    records: list[AttendanceRecord]


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
    """Get all chat histories from SQLite"""
    try:
        memory = get_chat_memory()
        return memory.get_all_chats_with_messages()
    except Exception as e:
        logger.error(f"Error loading chat history: {e}")
        return []

@app.post("/api/chat-history")
async def save_chat_history(chat: ChatHistory):
    """Save or update a chat history in SQLite"""
    try:
        memory = get_chat_memory()
        memory.ensure_chat(chat.id, chat.title)
        memory.update_chat_title(chat.id, chat.title)
        memory.save_messages_bulk(chat.id, [m.dict() for m in chat.messages])
        return {"success": True, "id": chat.id}
    except Exception as e:
        logger.error(f"Error saving chat history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/chat-history/{chat_id}")
async def delete_chat_history(chat_id: str):
    """Delete a chat history from SQLite"""
    try:
        memory = get_chat_memory()
        memory.delete_chat(chat_id)
        return {"success": True}
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


@app.post("/api/autocomplete")
async def autocomplete(request: AutocompleteRequest):
    """Generate a short text completion for the auto-finish sentence feature."""
    try:
        text = request.text.strip()
        if not text or len(text) < 10:
            return {"completion": ""}

        prompt = f"Continue this text naturally with a few more words. Only output the continuation, nothing else:\n\n{text}"

        from inference_factory import get_inference_instance
        inference = get_inference_instance()
        result = inference.generate(
            tool_name="autocomplete",
            input_data=text,
            prompt_template=prompt,
            max_tokens=min(request.max_tokens, 30),
            temperature=0.7
        )

        if result["metadata"]["status"] == "error":
            return {"completion": ""}

        completion = result["result"].strip()
        # Remove any text that repeats the original input
        if completion.lower().startswith(text.lower()[-20:]):
            completion = completion[len(text[-20:]):]

        # Clean up: only return a short, clean continuation
        # Stop at sentence boundaries
        for stop_char in ['.', '!', '?', '\n']:
            idx = completion.find(stop_char)
            if idx >= 0:
                completion = completion[:idx + 1]
                break

        # Limit length
        words = completion.split()
        if len(words) > 15:
            completion = ' '.join(words[:15])

        return {"completion": completion}

    except Exception as e:
        logger.error(f"Autocomplete error: {e}")
        return {"completion": ""}


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

    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            user_message = message_data.get("message", "")
            chat_id = message_data.get("chat_id", None)
            # Support custom system prompt from AI assistant panel
            custom_system_prompt = message_data.get("system_prompt", None)
            # Support conversation history sent from frontend (for panels without chat_id)
            client_history = message_data.get("history", None)

            if not user_message:
                continue

            default_system_prompt = "You are a helpful AI assistant. Answer questions naturally and conversationally. Keep responses concise but informative. Adapt your detail level to what the user asks - brief for simple questions, detailed for complex topics."

            # Use custom system prompt if provided, otherwise use default
            base_system_prompt = custom_system_prompt if custom_system_prompt else default_system_prompt

            # Build context from SQLite (Tier 1 sliding window + Tier 2 summary)
            history = []
            summary_block = ""

            if chat_id:
                try:
                    memory = get_chat_memory()
                    N = LLAMA_PARAMS.get("conversation_history_length", 4)
                    summary_block, history = memory.build_context(chat_id, n_pairs=N)
                except Exception as e:
                    logger.error(f"Error loading chat context: {e}")
            elif client_history:
                # Use conversation history sent from the client (for AI assistant panel)
                history = client_history[-8:]  # Cap at last 8 messages to avoid context overflow

            # Inject summary into system prompt if available
            system_prompt = base_system_prompt + summary_block

            prompt = build_multi_turn_prompt(system_prompt, history, user_message)

            logger.info(f"Context: chat_id={chat_id}, {len(history)} messages in window, summary={'yes' if summary_block else 'no'}, custom_prompt={'yes' if custom_system_prompt else 'no'}")

            try:
                from inference_factory import get_inference_instance
                inference = get_inference_instance()

                # Use streaming method for real-time generation
                token_buffer = []
                full_response_tokens = []  # Accumulate full response for memory
                last_send = time.time()
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
                        # Send any remaining tokens
                        if token_buffer:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                await asyncio.sleep(0)
                            except Exception as e:
                                logger.error(f"Error sending final tokens: {e}")
                        try:
                            await websocket.send_json({"type": "done"})
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send done message - connection closed")

                        # Trigger background summary update if needed (fire-and-forget)
                        if chat_id:
                            try:
                                memory = get_chat_memory()
                                asyncio.create_task(memory.maybe_update_summary(chat_id))
                            except Exception as e:
                                logger.warning(f"Summary trigger failed: {e}")

                        break

                    # Batch tokens before sending
                    if chunk.get("token"):
                        token_buffer.append(chunk["token"])
                        full_response_tokens.append(chunk["token"])

                        # Send every 50ms or 5 tokens (whichever comes first)
                        if len(token_buffer) >= 5 or (time.time() - last_send) > 0.05:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                token_buffer = []
                                last_send = time.time()
                                await asyncio.sleep(0)
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
    model_config = {"extra": "allow"}

    id: str
    title: str
    timestamp: str
    formData: dict
    generatedPlan: Optional[str] = None
    parsedLesson: Optional[dict] = None
    curriculumMatches: Optional[list] = None

@app.get("/api/lesson-plan-history")
async def get_lesson_plan_history():
    """Get all lesson plan histories"""
    try:
        if os.path.exists(LESSON_PLAN_HISTORY_FILE):
            with open(LESSON_PLAN_HISTORY_FILE, 'r', encoding='utf-8') as f:
                histories = json.load(f)
            histories.sort(key=lambda x: x['timestamp'], reverse=True)
            return histories
        return []
    except (json.JSONDecodeError, ValueError):
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
            try:
                with open(LESSON_PLAN_HISTORY_FILE, 'r', encoding='utf-8') as f:
                    histories = json.load(f)
            except (json.JSONDecodeError, ValueError):
                histories = []
        
        existing_index = None
        for i, h in enumerate(histories):
            if h['id'] == plan.id:
                existing_index = i
                break
        
        plan_dict = plan.model_dump()
        
        if existing_index is not None:
            histories[existing_index] = plan_dict
        else:
            histories.append(plan_dict)
        
        tmp_file = LESSON_PLAN_HISTORY_FILE + ".tmp"
        with open(tmp_file, 'w', encoding='utf-8') as f:
            json.dump(histories, f, indent=2, ensure_ascii=False)
        os.replace(tmp_file, LESSON_PLAN_HISTORY_FILE)

        return {"success": True, "id": plan.id}
    except Exception as e:
        logger.error(f"Error saving lesson plan history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/lesson-plan-history/{plan_id}")
async def delete_lesson_plan_history(plan_id: str):
    """Delete a lesson plan history"""
    try:
        if os.path.exists(LESSON_PLAN_HISTORY_FILE):
            try:
                with open(LESSON_PLAN_HISTORY_FILE, 'r', encoding='utf-8') as f:
                    histories = json.load(f)
            except (json.JSONDecodeError, ValueError):
                histories = []

            histories = [h for h in histories if h['id'] != plan_id]

            tmp_file = LESSON_PLAN_HISTORY_FILE + ".tmp"
            with open(tmp_file, 'w', encoding='utf-8') as f:
                json.dump(histories, f, indent=2, ensure_ascii=False)
            os.replace(tmp_file, LESSON_PLAN_HISTORY_FILE)
            
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
                # Extract grade and subject for exact filtering
                grade_filter = ""
                subject_filter = ""
                query = ""
                if isinstance(form_data, dict) and form_data:
                    grade_filter = str(form_data.get("gradeLevel", "")).strip()
                    subject_filter = str(form_data.get("subject", "")).strip()
                    # Build query from topic-relevant fields only (not duration, class size, etc.)
                    topic_parts = [
                        str(form_data.get("topic", "")),
                        str(form_data.get("strand", "")),
                        str(form_data.get("subject", "")),
                    ]
                    query = " ".join(p for p in topic_parts if p and p != "None")
                if not query:
                    query = prompt
                matches = curriculum_matcher.find_matching_pages(
                    query, top_k=3,
                    grade=grade_filter, subject=subject_filter
                )
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

            # Prefer user-selected ELO/SCOs from the form over generic curriculum context
            user_elo = ""
            user_scos = ""
            if isinstance(form_data, dict) and form_data:
                user_elo = str(form_data.get("essentialOutcomes", "")).strip()
                user_scos = str(form_data.get("specificOutcomes", "")).strip()

            if user_elo or user_scos:
                selected_context = "\n\nTeacher-Selected Curriculum Outcomes (align lesson to these):"
                if user_elo:
                    selected_context += f"\n\nEssential Learning Outcome:\n{user_elo}"
                if user_scos:
                    sco_list = [s.strip() for s in user_scos.split("\n") if s.strip()]
                    selected_context += "\n\nSpecific Curriculum Outcomes:"
                    for i, sco in enumerate(sco_list, 1):
                        selected_context += f"\n  {i}. {sco}"
                system_prompt += selected_context
            elif curriculum_context:
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
                inference = get_inference_instance(use_singleton=(generation_mode == "queued"))

                # Stream tokens in real-time (works with both Gemma API and local models)
                token_buffer = []
                last_send = time.time()
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
                        # Send any remaining tokens
                        if token_buffer:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                await asyncio.sleep(0)
                            except Exception as e:
                                logger.error(f"Error sending final tokens: {e}")
                        try:
                            await websocket.send_json({"type": "done"})
                            await asyncio.sleep(0)
                        except:
                            logger.error("Could not send done message - connection closed")
                        break

                    # Batch tokens before sending
                    if chunk.get("token"):
                        token_buffer.append(chunk["token"])

                        # Send every 50ms or 5 tokens (whichever comes first)
                        if len(token_buffer) >= 5 or (time.time() - last_send) > 0.05:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                token_buffer = []
                                last_send = time.time()
                                await asyncio.sleep(0)
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
            form_data = data.get("formData", {})
            job_id = data.get("jobId") or data.get("id") or "quiz"
            generation_mode = data.get("generationMode", "queued")

            if not prompt:
                logger.error("Empty quiz prompt received")
                continue

            system_prompt = "You are an expert educational assessment designer. Create comprehensive, well-structured quizzes that accurately assess student learning."

            # Add curriculum context for alignment
            if curriculum_matcher and isinstance(form_data, dict) and form_data:
                grade_filter = str(form_data.get("gradeLevel", "")).strip()
                subject_filter = str(form_data.get("subject", "")).strip()
                topic_parts = [str(form_data.get("topic", "")), str(form_data.get("strand", "")), str(form_data.get("subject", ""))]
                query = " ".join(p for p in topic_parts if p and p != "None")
                if query:
                    matches = curriculum_matcher.find_matching_pages(query, top_k=2, grade=grade_filter, subject=subject_filter)
                    context_blocks = [curriculum_matcher.get_curriculum_context(m.get("id")) for m in matches]
                    context_blocks = [c for c in context_blocks if c]
                    if context_blocks:
                        system_prompt += "\n\nCurriculum Alignment Context:\n" + "\n\n".join(context_blocks)

            full_prompt = "<|begin_of_text|>"
            full_prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
            full_prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>"
            full_prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"

            slot_mode = None
            try:
                # Acquire generation slot (queue or parallel)
                slot_mode = await acquire_generation_slot(websocket, generation_mode, job_id)
                from inference_factory import get_inference_instance
                inference = get_inference_instance(use_singleton=(generation_mode == "queued"))

                # Stream tokens as they are generated
                token_buffer = []
                last_send = time.time()
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
                        # Send any remaining tokens
                        if token_buffer:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                await asyncio.sleep(0)
                            except Exception as e:
                                logger.error(f"Error sending final tokens: {e}")
                        try:
                            await websocket.send_json({"type": "done"})
                            await asyncio.sleep(0)
                        except:
                            logger.error("Could not send done message - connection closed")
                        break

                    # Batch tokens before sending
                    if chunk.get("token"):
                        token_buffer.append(chunk["token"])

                        # Send every 50ms or 5 tokens (whichever comes first)
                        if len(token_buffer) >= 5 or (time.time() - last_send) > 0.05:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                token_buffer = []
                                last_send = time.time()
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
            form_data = data.get("formData", {})
            job_id = data.get("jobId") or data.get("id") or "rubric"
            generation_mode = data.get("generationMode", "queued")

            if not prompt:
                logger.error("Empty rubric prompt received")
                continue

            logger.info("Building rubric prompt...")
            system_prompt = "You are an expert educational assessment designer. Create detailed, fair, and comprehensive grading rubrics that clearly define performance criteria at each level."

            # Add curriculum context for alignment
            if curriculum_matcher and isinstance(form_data, dict) and form_data:
                grade_filter = str(form_data.get("gradeLevel", "")).strip()
                subject_filter = str(form_data.get("subject", "")).strip()
                topic_parts = [str(form_data.get("topic", "")), str(form_data.get("strand", "")), str(form_data.get("subject", ""))]
                query = " ".join(p for p in topic_parts if p and p != "None")
                if query:
                    matches = curriculum_matcher.find_matching_pages(query, top_k=2, grade=grade_filter, subject=subject_filter)
                    context_blocks = [curriculum_matcher.get_curriculum_context(m.get("id")) for m in matches]
                    context_blocks = [c for c in context_blocks if c]
                    if context_blocks:
                        system_prompt += "\n\nCurriculum Alignment Context:\n" + "\n\n".join(context_blocks)

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
                inference = get_inference_instance(use_singleton=(generation_mode == "queued"))
                logger.info("Starting rubric generation...")

                # Use streaming method for real-time generation
                token_buffer = []
                last_send = time.time()
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
                        # Send any remaining tokens
                        if token_buffer:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                await asyncio.sleep(0)
                            except Exception as e:
                                logger.error(f"Error sending final tokens: {e}")
                        logger.info("Rubric generation complete")
                        try:
                            await websocket.send_json({"type": "done"})
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send done message - connection closed")
                        break

                    # Batch tokens before sending
                    if chunk.get("token"):
                        token_buffer.append(chunk["token"])

                        # Send every 50ms or 5 tokens (whichever comes first)
                        if len(token_buffer) >= 5 or (time.time() - last_send) > 0.05:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                token_buffer = []
                                last_send = time.time()
                                await asyncio.sleep(0)
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
                inference = get_inference_instance(use_singleton=(generation_mode == "queued"))

                # Use streaming method for real-time generation
                token_buffer = []
                last_send = time.time()
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
                        # Send any remaining tokens
                        if token_buffer:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                await asyncio.sleep(0)
                            except Exception as e:
                                logger.error(f"Error sending final tokens: {e}")
                        try:
                            await websocket.send_json({"type": "done"})
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send done message - connection closed")
                        break

                    # Batch tokens before sending
                    if chunk.get("token"):
                        token_buffer.append(chunk["token"])

                        # Send every 50ms or 5 tokens (whichever comes first)
                        if len(token_buffer) >= 5 or (time.time() - last_send) > 0.05:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                token_buffer = []
                                last_send = time.time()
                                await asyncio.sleep(0)
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
                inference = get_inference_instance(use_singleton=(generation_mode == "queued"))

                # Use streaming method for real-time generation
                token_buffer = []
                last_send = time.time()
                chunk_count = 0
                async for chunk in inference.generate_stream(
                    tool_name="multigrade",
                    input_data=prompt,
                    prompt_template=full_prompt,
                    max_tokens=6000,
                    temperature=0.7
                ):
                    chunk_count += 1
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
                        logger.info(f"Generation finished for job {job_id}, total chunks: {chunk_count}")
                        # Send any remaining tokens
                        if token_buffer:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                await asyncio.sleep(0)
                            except Exception as e:
                                logger.error(f"Error sending final tokens: {e}")
                        try:
                            await websocket.send_json({"type": "done"})
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send done message - connection closed")
                        break

                    # Batch tokens before sending
                    if chunk.get("token"):
                        token_buffer.append(chunk["token"])

                        # Send every 50ms or 5 tokens (whichever comes first)
                        if len(token_buffer) >= 5 or (time.time() - last_send) > 0.05:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                token_buffer = []
                                last_send = time.time()
                                await asyncio.sleep(0)
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
                inference = get_inference_instance(use_singleton=(generation_mode == "queued"))

                # Use streaming method for real-time generation
                token_buffer = []
                last_send = time.time()
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
                        # Send any remaining tokens
                        if token_buffer:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                await asyncio.sleep(0)
                            except Exception as e:
                                logger.error(f"Error sending final tokens: {e}")
                        try:
                            await websocket.send_json({"type": "done"})
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send done message - connection closed")
                        break

                    # Batch tokens before sending
                    if chunk.get("token"):
                        token_buffer.append(chunk["token"])

                        # Send every 50ms or 5 tokens (whichever comes first)
                        if len(token_buffer) >= 5 or (time.time() - last_send) > 0.05:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                token_buffer = []
                                last_send = time.time()
                                await asyncio.sleep(0)
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


@app.websocket("/ws/worksheet")
async def worksheet_websocket(websocket: WebSocket):
    await websocket.accept()
    from generation_gate import acquire_generation_slot, release_generation_slot

    cancelled_job_ids = set()

    try:
        while True:
            logger.info("Worksheet WebSocket waiting for message...")
            data = await websocket.receive_json()
            logger.info(f"Worksheet WebSocket received data: {data.keys() if isinstance(data, dict) else 'non-dict'}")

            # Handle cancellation message
            if isinstance(data, dict) and data.get("type") == "cancel" and "jobId" in data:
                cancelled_job_ids.add(data["jobId"])
                await websocket.send_json({"type": "cancelled", "jobId": data["jobId"]})
                continue

            prompt = data.get("prompt", "")
            form_data = data.get("formData", {})
            job_id = data.get("jobId") or data.get("id") or "worksheet"
            generation_mode = data.get("generationMode", "queued")

            logger.info(f"Worksheet generation request - job_id: {job_id}, prompt length: {len(prompt)}")

            if not prompt:
                logger.warning("Empty prompt received, skipping")
                continue

            # Build worksheet-specific prompt
            subject = form_data.get("subject", "")
            grade_level = form_data.get("gradeLevel", "")
            strand = form_data.get("strand", "")
            topic = form_data.get("topic", "")
            question_type = form_data.get("questionType", "")
            question_count = form_data.get("questionCount", "")
            worksheet_title = form_data.get("worksheetTitle", "")

            system_prompt = f"You are an expert educational worksheet designer. Create comprehensive, well-structured worksheets that accurately assess student learning and align with curriculum standards. Focus on clear instructions, appropriate difficulty level, and educational value."

            # Add curriculum context for alignment
            if curriculum_matcher and (subject or grade_level):
                query = " ".join(p for p in [topic, strand, subject] if p)
                if query:
                    matches = curriculum_matcher.find_matching_pages(query, top_k=2, grade=grade_level, subject=subject)
                    context_blocks = [curriculum_matcher.get_curriculum_context(m.get("id")) for m in matches]
                    context_blocks = [c for c in context_blocks if c]
                    if context_blocks:
                        system_prompt += "\n\nCurriculum Alignment Context:\n" + "\n\n".join(context_blocks)

            full_prompt = "<|begin_of_text|>"
            full_prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
            full_prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>"
            full_prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"

            slot_mode = None
            try:
                logger.info(f"Acquiring generation slot for job {job_id}")
                # Acquire generation slot (queue or parallel)
                slot_mode = await acquire_generation_slot(websocket, generation_mode, job_id)
                logger.info(f"Generation slot acquired: {slot_mode}")

                from inference_factory import get_inference_instance
                inference = get_inference_instance(use_singleton=(generation_mode == "queued"))
                logger.info("Got inference instance, starting generation...")

                # Use streaming method for real-time generation
                token_buffer = []
                last_send = time.time()
                chunk_count = 0
                async for chunk in inference.generate_stream(
                    tool_name="worksheet",
                    input_data=prompt,
                    prompt_template=full_prompt,
                    max_tokens=6000,
                    temperature=0.7
                ):
                    chunk_count += 1
                    if chunk_count <= 5:  # Log first few chunks
                        logger.info(f"Received chunk {chunk_count}: {chunk}")
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
                        # Send any remaining tokens
                        if token_buffer:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                await asyncio.sleep(0)
                            except Exception as e:
                                logger.error(f"Error sending final tokens: {e}")
                        try:
                            await websocket.send_json({"type": "done"})
                            await asyncio.sleep(0)  # Force flush
                        except:
                            logger.error("Could not send done message - connection closed")
                        break

                    # Batch tokens before sending
                    if chunk.get("token"):
                        token_buffer.append(chunk["token"])

                        # Send every 50ms or 5 tokens (whichever comes first)
                        if len(token_buffer) >= 5 or (time.time() - last_send) > 0.05:
                            try:
                                await websocket.send_json({
                                    "type": "token",
                                    "content": "".join(token_buffer)
                                })
                                token_buffer = []
                                last_send = time.time()
                                await asyncio.sleep(0)
                            except Exception as e:
                                logger.error(f"Error sending token: {e}")
                                break

            except Exception as e:
                logger.error(f"Worksheet generation error for job {job_id}: {e}")
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
        logger.info("Worksheet WebSocket disconnected")
    except Exception as e:
        logger.error(f"Worksheet WebSocket error: {str(e)}")

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


# ── Student Management ────────────────────────────────────────────────────────

@app.get("/api/students")
async def get_students(class_name: Optional[str] = None):
    return student_service.list_students(class_name)

@app.post("/api/students")
async def add_student(student: StudentCreate):
    return student_service.create_student(student.model_dump())

@app.get("/api/students/sample-excel")
async def download_sample_excel():
    """Generate and return a sample Excel file with student columns and example data."""
    import io
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

    wb = Workbook()
    ws = wb.active
    ws.title = "Class List"

    headers = ["Full Name", "Date of Birth", "Class", "Grade Level", "Gender", "Contact Info"]
    header_fill = PatternFill(start_color="2563EB", end_color="2563EB", fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF", size=11)
    thin_border = Border(
        left=Side(style='thin'), right=Side(style='thin'),
        top=Side(style='thin'), bottom=Side(style='thin')
    )

    for col, h in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col, value=h)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal='center')
        cell.border = thin_border

    sample_data = [
        ["Jane Smith", "2015-03-12", "A", "3", "Female", "jane.parent@email.com"],
        ["Marcus Johnson", "2014-11-05", "A", "3", "Male", "555-0123"],
        ["Aaliyah Charles", "2015-06-22", "A", "3", "Female", "555-0456"],
        ["Devon Williams", "2014-09-18", "B", "4", "Male", "devon.parent@email.com"],
        ["Keisha Brown", "2013-12-01", "B", "4", "Female", "555-0789"],
        ["Tyler Joseph", "2015-01-30", "A", "3", "Male", "tyler.mom@email.com"],
        ["Sophia Pierre", "2014-07-14", "C", "4", "Female", "555-0321"],
        ["Elijah Francis", "2013-04-09", "D", "5", "Male", "eli.dad@email.com"],
    ]

    for row_idx, row_data in enumerate(sample_data, 2):
        for col_idx, value in enumerate(row_data, 1):
            cell = ws.cell(row=row_idx, column=col_idx, value=value)
            cell.border = thin_border

    # Auto-fit column widths
    for col in ws.columns:
        max_len = 0
        col_letter = col[0].column_letter
        for cell in col:
            if cell.value:
                max_len = max(max_len, len(str(cell.value)))
        ws.column_dimensions[col_letter].width = max_len + 4

    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)

    from starlette.responses import Response
    return Response(
        content=buf.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=sample_class_list.xlsx"}
    )


@app.post("/api/students/import-excel")
async def import_excel(file: UploadFile = File(...)):
    """Import students from an uploaded Excel (.xlsx/.xls) or CSV file."""
    fname = (file.filename or "").lower()
    content = await file.read()

    rows: list[dict] = []

    if fname.endswith(('.xlsx', '.xls')):
        from openpyxl import load_workbook
        import io
        wb = load_workbook(io.BytesIO(content), read_only=True, data_only=True)
        ws = wb.active
        all_rows = list(ws.iter_rows(values_only=True))
        if len(all_rows) < 2:
            raise HTTPException(status_code=400, detail="Excel file has no data rows.")
        headers = [str(h or '').strip() for h in all_rows[0]]
        for data_row in all_rows[1:]:
            row_dict = {}
            for h, v in zip(headers, data_row):
                row_dict[h] = str(v) if v is not None else ''
            rows.append(row_dict)
        wb.close()
    elif fname.endswith('.csv'):
        import csv, io
        text = content.decode('utf-8-sig')
        reader = csv.DictReader(io.StringIO(text))
        rows = [dict(r) for r in reader]
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Please upload .xlsx, .xls, or .csv")

    if not rows:
        raise HTTPException(status_code=400, detail="No data rows found in file.")

    result = student_service.bulk_import_students(rows)
    return result

@app.get("/api/students/{student_id}")
async def get_student_profile(student_id: str):
    s = student_service.get_student(student_id)
    if not s:
        raise HTTPException(status_code=404, detail="Student not found")
    return s

@app.put("/api/students/{student_id}")
async def update_student_profile(student_id: str, student: StudentCreate):
    s = student_service.update_student(student_id, student.model_dump())
    if not s:
        raise HTTPException(status_code=404, detail="Student not found")
    return s

@app.delete("/api/students/{student_id}")
async def remove_student(student_id: str):
    student_service.delete_student(student_id)
    return {"success": True}

@app.get("/api/classes")
async def get_classes(grade_level: str | None = None):
    return student_service.list_classes(grade_level=grade_level)

@app.post("/api/quiz-grades")
async def add_quiz_grade(grade: QuizGradeCreate):
    return student_service.save_quiz_grade(grade.model_dump())

@app.get("/api/quiz-grades/student/{student_id}")
async def get_grades_for_student(student_id: str):
    return student_service.get_student_grades(student_id)

@app.get("/api/attendance")
async def get_attendance(class_name: str, date: str):
    return student_service.get_attendance(class_name, date)

@app.post("/api/attendance")
async def save_attendance(body: AttendanceSave):
    return student_service.save_attendance([r.model_dump() for r in body.records])


# ── Bulk Auto-Grading ─────────────────────────────────────────────────────────

def _extract_text_from_file(content: bytes, filename: str, content_type: str) -> tuple[str, str | None]:
    """
    Extract plain text from an uploaded file.
    Returns (extracted_text, error_message).
    """
    fname_lower = filename.lower()

    # HTML
    if fname_lower.endswith(('.html', '.htm')) or 'html' in content_type:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(content.decode('utf-8', errors='replace'), 'html.parser')
        # Remove script/style noise
        for tag in soup(['script', 'style']):
            tag.decompose()
        return soup.get_text(separator='\n', strip=True), None

    # PDF
    if fname_lower.endswith('.pdf') or 'pdf' in content_type:
        try:
            import io as _io
            from pypdf import PdfReader
            reader = PdfReader(_io.BytesIO(content))
            pages = [page.extract_text() or '' for page in reader.pages]
            text = '\n'.join(pages).strip()
            if not text:
                return '', 'PDF has no extractable text (may be a scanned image).'
            return text, None
        except ImportError:
            return '', 'PDF support requires pypdf: pip install pypdf'
        except Exception as e:
            return '', f'PDF read error: {e}'

    # Plain text / markdown
    if fname_lower.endswith(('.txt', '.md')) or 'text' in content_type:
        return content.decode('utf-8', errors='replace'), None

    # Image — no reliable OCR without tesseract
    if fname_lower.endswith(('.jpg', '.jpeg', '.png', '.webp', '.bmp')):
        return '', 'Image files cannot be read automatically. Please use HTML or PDF exports from the app.'

    return content.decode('utf-8', errors='replace'), None


def _build_extraction_prompt(quiz_questions: list, text: str) -> str:
    """Build LLM prompt that extracts student answers from quiz text."""
    question_hints = []
    for i, q in enumerate(quiz_questions, 1):
        qtype = q.get('type', '')
        q_text = q.get('question', '')[:80]
        if qtype == 'multiple-choice':
            options = q.get('options', [])
            letters = ', '.join(chr(65 + j) for j in range(len(options)))
            question_hints.append(f"Q{i} (Multiple Choice – answer is one of: {letters}): {q_text}")
        elif qtype == 'true-false':
            question_hints.append(f"Q{i} (True/False – answer is exactly True or False): {q_text}")
        elif qtype == 'fill-blank':
            question_hints.append(f"Q{i} (Fill in the blank – answer is a word or phrase): {q_text}")
        # open-ended: skip

    hints_block = '\n'.join(question_hints)

    return f"""You are a quiz grading assistant. A student's completed quiz is shown below.

IMPORTANT: The student's quiz may have questions in a DIFFERENT ORDER than the teacher's version.
You must match each student question to the correct teacher question by its content/text, not by its number.

Teacher's question list (use these to match):
{hints_block}

Rules:
- For each question on the student's paper, find the matching teacher question by content.
- Use the TEACHER's question number (Q1, Q2, etc.) as the key in your response, NOT the student's question number.
- For Multiple Choice, return only the letter (A, B, C, or D).
- For True/False, return exactly "True" or "False".
- For Fill in the blank, return the word or phrase the student wrote.
- If a question has no visible answer, return null.
- If a student name or ID is visible on the paper, extract them; otherwise return null.

Student quiz text:
\"\"\"
{text[:3000]}
\"\"\"

Return ONLY valid JSON in this exact structure, no explanation:
{{
  "student_name": null,
  "student_id": null,
  "answers": {{
    "1": "A",
    "2": "True",
    "3": "photosynthesis"
  }}
}}"""


def _grade_extracted_answers(quiz_questions: list, extracted_answers: dict) -> dict:
    """Grade extracted student answers against the answer key."""
    results = []
    total = 0
    earned = 0

    for i, q in enumerate(quiz_questions, 1):
        qtype = q.get('type', '')
        if qtype == 'open-ended':
            continue  # skip

        pts = q.get('points', 1) or 1
        total += pts
        student_raw = extracted_answers.get(str(i))

        correct = False
        if student_raw is not None:
            correct_answer = q.get('correctAnswer')
            if qtype == 'multiple-choice':
                try:
                    letter_index = ord(str(student_raw).strip().upper()) - 65
                    correct = letter_index == int(correct_answer)
                except Exception:
                    correct = False
            elif qtype == 'true-false':
                correct = str(student_raw).strip().lower() == str(correct_answer).strip().lower()
            elif qtype == 'fill-blank':
                student_norm = str(student_raw).strip().lower()
                accepted = [a.strip().lower() for a in str(correct_answer or '').split(',')]
                correct = student_norm in accepted

        points_earned = pts if correct else 0
        earned += points_earned
        results.append({
            'question_number': i,
            'question': q.get('question', ''),
            'type': qtype,
            'student_answer': student_raw,
            'correct_answer': q.get('correctAnswer'),
            'correct': correct,
            'points_earned': points_earned,
            'points_possible': pts,
        })

    percentage = round((earned / total * 100), 1) if total > 0 else 0
    return {
        'results': results,
        'score': earned,
        'total_points': total,
        'percentage': percentage,
        'letter_grade': student_service.get_letter_grade(percentage),
    }


@app.post("/api/parse-teacher-quiz")
async def parse_teacher_quiz(teacher_file: UploadFile = File(...)):
    """
    Parse a teacher version quiz file (HTML or PDF) and extract the answer key
    as a ParsedQuiz-compatible JSON structure.
    """
    content = await teacher_file.read()
    filename = teacher_file.filename or ''
    content_type = teacher_file.content_type or ''

    text, extract_error = _extract_text_from_file(content, filename, content_type)
    if extract_error:
        raise HTTPException(status_code=422, detail=extract_error)
    if not text.strip():
        raise HTTPException(status_code=422, detail="No text could be extracted from this file.")

    prompt = f"""You are a quiz parser. Extract all questions and answers from this teacher quiz.

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{{
  "metadata": {{
    "title": "Quiz Title",
    "subject": "Subject",
    "gradeLevel": "5",
    "totalQuestions": 5
  }},
  "questions": [
    {{
      "id": "q_1",
      "type": "multiple-choice",
      "question": "Question text here",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correctAnswer": 0,
      "points": 1
    }},
    {{
      "id": "q_2",
      "type": "true-false",
      "question": "Statement here",
      "options": ["True", "False"],
      "correctAnswer": "true",
      "points": 1
    }},
    {{
      "id": "q_3",
      "type": "fill-blank",
      "question": "The ___ is the powerhouse of the cell.",
      "correctAnswer": "mitochondria",
      "points": 1
    }}
  ]
}}

Rules:
- For multiple-choice: correctAnswer is a 0-based index (0=A, 1=B, 2=C, 3=D)
- For true-false: correctAnswer is "true" or "false" (lowercase string)
- For fill-blank: correctAnswer is the expected word or phrase
- Skip open-ended questions entirely
- Extract the subject and grade level from the quiz header if present

Quiz text:
\"\"\"
{text[:4000]}
\"\"\"
"""

    from inference_factory import get_inference_instance
    inference = get_inference_instance()
    llm_result = await inference.generate(
        tool_name='parse_teacher_quiz',
        input_data=text[:200],
        prompt_template=prompt,
        max_tokens=2000,
        temperature=0.1,
        stop=['```'],
    )

    raw = llm_result.get('result') or ''

    import re as _re
    json_match = _re.search(r'\{[\s\S]*\}', raw)
    if not json_match:
        raise HTTPException(status_code=422, detail="Could not extract quiz structure. Make sure the file is a teacher version with answers marked.")

    try:
        parsed = json.loads(json_match.group())
        # Ensure required structure
        if 'questions' not in parsed or not isinstance(parsed['questions'], list):
            raise ValueError("Missing questions array")
        if 'metadata' not in parsed:
            parsed['metadata'] = {'title': 'Uploaded Quiz', 'subject': '', 'gradeLevel': '', 'totalQuestions': len(parsed['questions'])}
        return parsed
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Parsed output was not valid quiz JSON: {e}")


@app.post("/api/bulk-grade")
async def bulk_grade(
    quiz_json: str = Form(...),
    student_files: List[UploadFile] = File(...),
):
    """
    Accept a quiz answer key (as JSON) and multiple student files.
    Extract student answers from each file using LLM, then auto-grade.
    """
    try:
        quiz_data = json.loads(quiz_json)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid quiz_json")

    quiz_questions = quiz_data.get('questions', [])
    if not quiz_questions:
        raise HTTPException(status_code=400, detail="Quiz has no questions")

    from inference_factory import get_inference_instance

    graded_results = []

    for upload in student_files:
        file_result = {
            'file_name': upload.filename,
            'student_name': None,
            'error': None,
            'score': 0,
            'total_points': 0,
            'percentage': 0,
            'letter_grade': 'F',
            'details': [],
        }

        try:
            content = await upload.read()
            content_type = upload.content_type or ''

            text, extract_error = _extract_text_from_file(content, upload.filename or '', content_type)
            if extract_error:
                file_result['error'] = extract_error
                graded_results.append(file_result)
                continue

            if not text.strip():
                file_result['error'] = 'No text could be extracted from this file.'
                graded_results.append(file_result)
                continue

            # Call LLM to extract student answers
            prompt = _build_extraction_prompt(quiz_questions, text)
            inference = get_inference_instance()
            llm_result = await inference.generate(
                tool_name='bulk_grade_extract',
                input_data=text[:500],
                prompt_template=prompt,
                max_tokens=600,
                temperature=0.1,
                stop=['```', '\n\n\n'],
            )

            raw_output = llm_result.get('result') or ''

            # Parse JSON from LLM output (it may include markdown fences)
            json_match = None
            import re as _re
            json_match = _re.search(r'\{[\s\S]*\}', raw_output)
            if not json_match:
                file_result['error'] = 'LLM could not extract answers from this file.'
                graded_results.append(file_result)
                continue

            extracted = json.loads(json_match.group())
            student_name = extracted.get('student_name')
            extracted_answers = extracted.get('answers', {})

            grading = _grade_extracted_answers(quiz_questions, extracted_answers)

            file_result.update({
                'student_name': student_name,
                'score': grading['score'],
                'total_points': grading['total_points'],
                'percentage': grading['percentage'],
                'letter_grade': grading['letter_grade'],
                'details': grading['results'],
            })

        except Exception as e:
            file_result['error'] = f'Processing error: {str(e)}'

        graded_results.append(file_result)

    return graded_results


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

@app.get("/api/worksheet-history")
async def get_worksheet_history():
    return load_json_data("worksheet_history.json")

@app.post("/api/worksheet-history")
async def save_worksheet_history(data: dict):
    histories = load_json_data("worksheet_history.json")
    existing = next((h for h in histories if h.get("id") == data.get("id")), None)
    if existing:
        histories = [h for h in histories if h.get("id") != data.get("id")]
    histories.append(data)
    save_json_data("worksheet_history.json", histories[-20:])
    return {"success": True}

@app.delete("/api/worksheet-history/{worksheet_id}")
async def delete_worksheet_history(worksheet_id: str):
    histories = load_json_data("worksheet_history.json")
    histories = [h for h in histories if h.get("id") != worksheet_id]
    save_json_data("worksheet_history.json", histories)
    return {"success": True}

@app.get("/api/images-history")
async def get_images_history():
    return load_json_data("images_history.json")

@app.post("/api/images-history")
async def save_images_history(data: dict):
    histories = load_json_data("images_history.json")
    existing = next((h for h in histories if h.get("id") == data.get("id")), None)
    if existing:
        histories = [h for h in histories if h.get("id") != data.get("id")]
    histories.append(data)
    save_json_data("images_history.json", histories[-20:])
    return {"success": True}

@app.delete("/api/images-history/{image_id}")
async def delete_images_history(image_id: str):
    histories = load_json_data("images_history.json")
    histories = [h for h in histories if h.get("id") != image_id]
    save_json_data("images_history.json", histories)
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
            # Reload singleton so it picks up the new model
            try:
                from inference_factory import reload_local_model
                reload_local_model()
            except Exception as reload_err:
                logger.warning(f"Could not reload model singleton: {reload_err}")

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


# ============================================================================
# DIFFUSION MODEL MANAGEMENT ENDPOINTS
# ============================================================================

@app.get("/api/diffusion-models")
async def get_available_diffusion_models():
    """Get list of available diffusion models in the image_generation directory"""
    try:
        models = scan_diffusion_models()
        return {
            "success": True,
            "models": models,
            "models_directory": str(IMAGE_MODELS_DIR),
            "count": len(models)
        }
    except Exception as e:
        logger.error(f"Error retrieving diffusion models: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving diffusion models: {str(e)}")


@app.post("/api/diffusion-models/select")
async def select_diffusion_model(request: Request):
    """Set the active diffusion model for image generation"""
    try:
        data = await request.json()
        model_name = data.get('modelName')

        if not model_name:
            return JSONResponse(
                status_code=400,
                content={"error": "Model name is required"}
            )

        model_path = IMAGE_MODELS_DIR / model_name
        if not model_path.exists():
            return JSONResponse(
                status_code=404,
                content={"error": f"Diffusion model not found: {model_name}"}
            )

        if set_selected_diffusion_model(model_name):
            # Reset the image service singleton so it picks up the new model on next use
            try:
                from image_service import reset_image_service
                reset_image_service(model_name)
                logger.info("Image service reset for new diffusion model")
            except Exception as e:
                logger.warning(f"Could not reset image service: {e}")

            return JSONResponse(content={
                "success": True,
                "message": f"Diffusion model set to {model_name}",
                "selectedModel": model_name
            })
        else:
            return JSONResponse(
                status_code=500,
                content={"error": "Failed to save diffusion model selection"}
            )

    except Exception as e:
        logger.error(f"Error selecting diffusion model: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.get("/api/diffusion-models/active")
async def get_active_diffusion_model():
    """Get the currently active diffusion model"""
    try:
        selected_model = get_selected_diffusion_model()
        model_path = get_diffusion_model_path()

        return JSONResponse(content={
            "modelName": selected_model,
            "modelPath": model_path,
            "exists": Path(model_path).exists()
        })
    except Exception as e:
        logger.error(f"Error getting active diffusion model: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.post("/api/diffusion-models/open-folder")
async def open_diffusion_models_folder():
    """Open the image generation models directory in Windows File Explorer"""
    try:
        models_path = str(IMAGE_MODELS_DIR.resolve())

        if not IMAGE_MODELS_DIR.exists():
            IMAGE_MODELS_DIR.mkdir(parents=True, exist_ok=True)

        if os.name == 'nt':
            subprocess.run(['explorer', models_path], check=True)
            return {
                "success": True,
                "message": "Diffusion models folder opened",
                "path": models_path
            }
        else:
            return {
                "success": False,
                "message": "Opening folder is only supported on Windows",
                "path": models_path
            }
    except Exception as e:
        logger.error(f"Error opening diffusion models folder: {e}")
        raise HTTPException(status_code=500, detail=f"Error opening diffusion models folder: {str(e)}")


@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "model_found": os.path.exists(get_model_path()),
        "llama_cli_found": os.path.exists(LLAMA_CLI_PATH),
        "chat_memory_db": os.path.exists(get_chat_memory().db_path)
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
    "kindergarten": {"pdf", "docx"},
    "multigrade": {"pdf", "docx"},
    "cross-curricular": {"pdf", "docx"},
    "curriculum": {"pdf", "docx", "csv", "json", "md", "markdown"},
    "chat_history": {"pdf", "docx", "csv", "json", "md", "markdown"},
    "lesson_plan_history": {"pdf", "docx", "csv", "json", "md", "markdown"},
    "quiz_history": {"pdf", "docx", "csv", "json", "md", "markdown"},
    "rubric_history": {"pdf", "docx", "csv", "json", "md", "markdown"},
    "kindergarten_history": {"pdf", "docx", "csv", "json", "md", "markdown"},
    "multigrade_history": {"pdf", "docx", "csv", "json", "md", "markdown"},
    "cross_curricular_history": {"pdf", "docx", "csv", "json", "md", "markdown"},
    "worksheet": {"pdf", "docx"},
    "report-card": {"pdf"},
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
    logger.info(f"Export request: data_type={data_type}, format={format}, title={title}")

    # Validate data_type
    if data_type not in EXPORT_TYPE_FORMATS:
        logger.error(f"Invalid data_type: {data_type}")
        return JSONResponse(
            status_code=400,
            content={"error": f"Invalid data_type '{data_type}'. Allowed: {list(EXPORT_TYPE_FORMATS.keys())}"}
        )
    # Validate format
    allowed_formats = EXPORT_TYPE_FORMATS[data_type]
    if format not in allowed_formats:
        logger.error(f"Format '{format}' not allowed for data_type '{data_type}'")
        return JSONResponse(
            status_code=400,
            content={"error": f"Format '{format}' not allowed for data_type '{data_type}'. Allowed: {sorted(allowed_formats)}"}
        )
    # Validate formatter
    formatter = EXPORT_FORMATTERS.get(format)
    if not formatter:
        logger.error(f"Export format '{format}' is not supported")
        return JSONResponse(
            status_code=400,
            content={"error": f"Export format '{format}' is not supported."}
        )
    # Export
    try:
        logger.info(f"Starting export with formatter: {format}")
        exported_bytes = formatter(data, title=title)
        logger.info(f"Export successful, size: {len(exported_bytes)} bytes")
    except Exception as e:
        logger.error(f"Export failed: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"error": f"Export failed: {str(e)}"}
        )
    # Prepare response
    ext = "md" if format == "markdown" else format
    filename = f"{data_type}_{title.replace(' ', '_')}.{ext}"
    content_type = CONTENT_TYPES.get(format, "application/octet-stream")
    logger.info(f"Sending response: filename={filename}, content_type={content_type}")
    return StreamingResponse(
        io.BytesIO(exported_bytes),
        media_type=content_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

    


# =========================
# IMAGE GENERATION ENDPOINTS
# =========================
 
@app.post("/api/generate-image-prompt")
async def generate_image_prompt(request: Request):
    """
    Generate an optimized image prompt using LLaMA model
    """
    try:
        data = await request.json()
        context = data.get('context', {})
        
        # Extract context information
        subject = context.get('subject', '')
        grade = context.get('grade', '')
        topic = context.get('topic', '')
        question_type = context.get('questionType', '')
        additional = context.get('additionalContext', '')
        
        # Build LLaMA prompt for image generation
        llama_prompt = f"""You are an expert at creating image prompts for educational materials.

Generate a detailed, specific image prompt for SDXL image generation with these requirements:

CONTEXT:
- Subject: {subject}
- Grade Level: {grade}
- Topic: {topic}
- Question Type: {question_type}
- Additional Context: {additional}

REQUIREMENTS:
1. The image must be age-appropriate for Grade {grade}
2. Style: Colorful, cartoon/illustration style, educational
3. Content: Simple, clear, focused on the main concept
4. Avoid: Text, words, numbers, multiple subjects, complex scenes
5. Format: Single clear subject, suitable for worksheet inclusion

Generate ONLY the image prompt (no explanation, no preamble). The prompt should be 1-2 sentences, specific and detailed.

PROMPT:"""
        
        # Get inference instance
        from inference_factory import get_inference_instance
        inference = get_inference_instance()
        
        if not inference.is_loaded:
            return JSONResponse(
                status_code=503,
                content={"error": "AI model not loaded"}
            )
        
        # Call LLaMA using the correct API (matches your llama_inference.py)
        result = await inference.generate(
            tool_name="image_prompt_generator",
            input_data=llama_prompt,
            prompt_template=None,  # Use input_data as-is
            max_tokens=150,
            temperature=0.7,
            top_p=0.9
        )
        
        # Extract generated text from result
        if result.get("metadata", {}).get("status") != "success":
            error_msg = result.get("metadata", {}).get("error_message", "Generation failed")
            return JSONResponse(
                status_code=500,
                content={"error": error_msg}
            )
        
        generated_prompt = result.get("result", "").strip()
        
        if not generated_prompt:
            return JSONResponse(
                status_code=500,
                content={"error": "No prompt generated"}
            )
        
        # Generate negative prompt based on educational context
        negative_prompt = "text, words, letters, numbers, multiple subjects, people, faces, complex scene, dark, scary, violent, inappropriate, blurry, distorted"
        
        if grade and grade.lower() in ['k', '1', '2', '3']:
            negative_prompt += ", realistic, photographic, detailed background"
        
        logger.info(f"Generated image prompt: {generated_prompt[:100]}...")
        
        return JSONResponse(content={
            "success": True,
            "prompt": generated_prompt,
            "negativePrompt": negative_prompt
        })
        
    except Exception as e:
        logger.error(f"Error generating image prompt: {e}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@app.post("/api/generate-comic-prompts")
async def generate_comic_prompts(request: Request):
    """
    Generate scene prompts for a comic page using LLaMA.
    Takes a short description and number of panels, returns per-panel prompts.
    """
    try:
        data = await request.json()
        description = data.get('description', '')
        num_panels = data.get('numPanels', 4)
        style = data.get('style', 'cartoon_3d')

        if not description:
            return JSONResponse(
                status_code=400,
                content={"error": "Description is required"}
            )

        llama_prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are an expert comic book writer. Given a short story description, break it into exactly {num_panels} sequential comic panel scenes. Each scene should be a vivid, visual image prompt suitable for AI image generation. Focus on action, composition, and visual storytelling. Do NOT include dialogue or text in the prompts.

IMPORTANT: Return ONLY a JSON array of strings, one per panel. No explanation, no markdown, no extra text. Example format:
["scene 1 prompt", "scene 2 prompt", "scene 3 prompt", "scene 4 prompt"]<|eot_id|><|start_header_id|>user<|end_header_id|>

Story description: {description}
Number of panels: {num_panels}

Generate {num_panels} sequential comic panel image prompts as a JSON array:<|eot_id|><|start_header_id|>assistant<|end_header_id|>

["""

        settings = {
            "model_path": get_model_path(),
            "n_ctx": MODEL_N_CTX,
            "max_tokens": 600,
            "temperature": 0.7,
            "tool_name": "comic_prompts",
            "prompt_template": llama_prompt,
        }
        future = submit_task(run_llama_inference, description, settings)
        result = await asyncio.wrap_future(future)

        if result.get("metadata", {}).get("status") != "success":
            error_msg = result.get("metadata", {}).get("error_message", "Generation failed")
            return JSONResponse(
                status_code=500,
                content={"error": error_msg}
            )

        generated_text = result.get("result", "").strip()

        # Try to parse the JSON array from the response
        # The model might return it with or without the leading [
        text_to_parse = generated_text
        if not text_to_parse.startswith("["):
            text_to_parse = "[" + text_to_parse

        # Find the closing bracket
        bracket_idx = text_to_parse.rfind("]")
        if bracket_idx != -1:
            text_to_parse = text_to_parse[:bracket_idx + 1]
        else:
            text_to_parse = text_to_parse + "]"

        try:
            prompts = json.loads(text_to_parse)
            if not isinstance(prompts, list):
                raise ValueError("Not a list")
            # Ensure we have exactly num_panels prompts
            prompts = [str(p) for p in prompts[:num_panels]]
            while len(prompts) < num_panels:
                prompts.append(f"Scene {len(prompts) + 1} of: {description}")
        except (json.JSONDecodeError, ValueError):
            # Fallback: split by newlines or create generic prompts
            logger.warning(f"Failed to parse comic prompts JSON, using fallback. Raw: {generated_text[:200]}")
            prompts = []
            for i in range(num_panels):
                prompts.append(f"Scene {i + 1} of a comic story: {description}, panel {i + 1} of {num_panels}")

        logger.info(f"Generated {len(prompts)} comic panel prompts")

        return JSONResponse(content={
            "success": True,
            "prompts": prompts
        })

    except Exception as e:
        logger.error(f"Error generating comic prompts: {e}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


# ============================================================================
# TEXT-TO-SPEECH (Piper TTS — fully offline)
# ============================================================================

@app.post("/api/tts")
async def text_to_speech(request: Request):
    """
    Synthesize text to speech using Piper TTS (offline).
    Returns WAV audio bytes.
    """
    try:
        data = await request.json()
        text = data.get("text", "").strip()
        speed = float(data.get("speed", 1.0))

        if not text:
            return JSONResponse(status_code=400, content={"error": "Text is required"})

        from tts_service import get_tts_service
        tts = get_tts_service()

        # Run synthesis in thread pool to avoid blocking the event loop
        loop = asyncio.get_event_loop()
        wav_bytes = await loop.run_in_executor(None, tts.synthesize, text, speed)

        return Response(content=wav_bytes, media_type="audio/wav")

    except Exception as e:
        logger.error(f"TTS error: {e}", exc_info=True)
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/api/tts/status")
async def tts_status():
    """Check if TTS voice model is loaded and ready."""
    try:
        from tts_service import get_tts_service
        tts = get_tts_service()
        return JSONResponse(content=tts.get_voice_info())
    except Exception as e:
        return JSONResponse(content={"loaded": False, "error": str(e)})


@app.post("/api/generate-image")
async def generate_image(request: Request):
    """
    Generate image using SDXL-Turbo
    
    Request body:
    {
        "prompt": "image description",
        "negativePrompt": "things to avoid",
        "width": 1024,
        "height": 512,
        "numInferenceSteps": 2
    }
    
    Returns:
        PNG image as bytes
    """
    try:
        data = await request.json()
        
        prompt = data.get('prompt', '')
        negative_prompt = data.get('negativePrompt', 'deformed, distorted, blurry, extra fingers, mutated hands, poorly drawn hands, bad anatomy, extra limbs, fused fingers, too many fingers, ugly, low quality, worst quality')
        width = data.get('width', 1024)
        height = data.get('height', 512)
        num_steps = data.get('numInferenceSteps', 2)
        
        if not prompt:
            return JSONResponse(
                status_code=400,
                content={"error": "Prompt is required"}
            )
        
        # Validate dimensions
        if width < 256 or width > 2048 or height < 256 or height > 2048:
            return JSONResponse(
                status_code=400,
                content={"error": "Width and height must be between 256 and 2048"}
            )
        
        # Get image service
        image_service = get_image_service()
        
        # Generate image
        image_bytes = image_service.generate_image(
            prompt=prompt,
            negative_prompt=negative_prompt,
            width=width,
            height=height,
            num_inference_steps=num_steps
        )
        
        if image_bytes is None:
            return JSONResponse(
                status_code=500,
                content={"error": "Image generation failed"}
            )
        
        # Return image as PNG
        return Response(
            content=image_bytes,
            media_type="image/png"
        )
        
    except Exception as e:
        logger.error(f"Error generating image: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.post("/api/generate-image-base64")
async def generate_image_base64(request: Request):
    """
    Generate image and return as base64 (easier for frontend embedding)

    Same request body as /api/generate-image

    Returns:
    {
        "success": true,
        "imageData": "data:image/png;base64,..."
    }
    """
    try:
        data = await request.json()

        prompt = data.get('prompt', '')
        negative_prompt = data.get('negativePrompt', 'deformed, distorted, blurry, extra fingers, mutated hands, poorly drawn hands, bad anatomy, extra limbs, fused fingers, too many fingers, ugly, low quality, worst quality')
        width = data.get('width', 1024)
        height = data.get('height', 512)
        num_steps = data.get('numInferenceSteps', 2)
        init_image_b64 = data.get('initImage')
        strength = data.get('strength', 0.5)

        if not prompt:
            return JSONResponse(
                status_code=400,
                content={"error": "Prompt is required"}
            )

        # Decode init_image if provided (for img2img)
        init_image_bytes = None
        if init_image_b64:
            if init_image_b64.startswith('data:'):
                init_image_b64 = init_image_b64.split(',')[1]
            try:
                init_image_bytes = base64.b64decode(init_image_b64)
            except Exception as e:
                logger.error(f"Failed to decode init image: {e}")
                return JSONResponse(
                    status_code=400,
                    content={"error": "Invalid init image data"}
                )

        # Get image service
        image_service = get_image_service()

        # Generate image (text-to-image or image-to-image)
        image_bytes = image_service.generate_image(
            prompt=prompt,
            negative_prompt=negative_prompt,
            width=width,
            height=height,
            num_inference_steps=num_steps,
            init_image=init_image_bytes,
            strength=strength
        )

        if image_bytes is None:
            return JSONResponse(
                status_code=500,
                content={"error": "Image generation failed"}
            )

        # Convert to base64
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')
        data_uri = f"data:image/png;base64,{image_b64}"

        return JSONResponse(content={
            "success": True,
            "imageData": data_uri
        })

    except Exception as e:
        logger.error(f"Error generating image: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.post("/api/generate-batch-images-base64")
async def generate_batch_images_base64(request: Request):
    """
    Generate multiple images in batch and return as base64

    Request body:
    {
        "prompt": "image description",
        "negativePrompt": "things to avoid",
        "width": 1024,
        "height": 512,
        "numInferenceSteps": 2,
        "numImages": 4
    }

    Returns:
    {
        "success": true,
        "images": [
            {
                "imageData": "data:image/png;base64,...",
                "seed": 12345
            },
            ...
        ]
    }
    """
    try:
        data = await request.json()

        prompt = data.get('prompt', '')
        negative_prompt = data.get('negativePrompt', 'deformed, distorted, blurry, extra fingers, mutated hands, poorly drawn hands, bad anatomy, extra limbs, fused fingers, too many fingers, ugly, low quality, worst quality')
        width = data.get('width', 1024)
        height = data.get('height', 512)
        num_steps = data.get('numInferenceSteps', 2)
        num_images = data.get('numImages', 1)

        if not prompt:
            return JSONResponse(
                status_code=400,
                content={"error": "Prompt is required"}
            )

        if num_images < 1 or num_images > 10:
            return JSONResponse(
                status_code=400,
                content={"error": "numImages must be between 1 and 10"}
            )

        # Get image service
        image_service = get_image_service()

        # Generate batch images
        batch_results = image_service.generate_batch_images(
            prompt=prompt,
            negative_prompt=negative_prompt,
            width=width,
            height=height,
            num_inference_steps=num_steps,
            num_images=num_images
        )

        if not batch_results:
            return JSONResponse(
                status_code=500,
                content={"error": "Batch image generation failed"}
            )

        # Convert to base64
        images = []
        for result in batch_results:
            image_b64 = base64.b64encode(result['image_data']).decode('utf-8')
            data_uri = f"data:image/png;base64,{image_b64}"
            images.append({
                "imageData": data_uri,
                "seed": result['seed']
            })

        return JSONResponse(content={
            "success": True,
            "images": images
        })

    except Exception as e:
        logger.error(f"Error generating batch images: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.post("/api/generate-image-from-seed")
async def generate_image_from_seed(request: Request):
    """
    Generate image using a specific seed and init image (for AI Edit functionality)

    Request body:
    {
        "prompt": "modified image description",
        "negativePrompt": "things to avoid",
        "width": 1024,
        "height": 512,
        "numInferenceSteps": 2,
        "seed": 12345,
        "initImage": "data:image/png;base64,..."  // optional, for img2img
    }

    Returns:
    {
        "success": true,
        "imageData": "data:image/png;base64,...",
        "seed": 12345
    }
    """
    try:
        data = await request.json()

        prompt = data.get('prompt', '')
        negative_prompt = data.get('negativePrompt', 'deformed, distorted, blurry, extra fingers, mutated hands, poorly drawn hands, bad anatomy, extra limbs, fused fingers, too many fingers, ugly, low quality, worst quality')
        width = data.get('width', 1024)
        height = data.get('height', 512)
        num_steps = data.get('numInferenceSteps', 2)
        seed = data.get('seed')
        init_image_b64 = data.get('initImage')
        strength = data.get('strength', 0.5)

        if not prompt:
            return JSONResponse(
                status_code=400,
                content={"error": "Prompt is required"}
            )

        if seed is None:
            return JSONResponse(
                status_code=400,
                content={"error": "Seed is required"}
            )

        # Decode init_image if provided
        init_image_bytes = None
        if init_image_b64:
            if init_image_b64.startswith('data:'):
                init_image_b64 = init_image_b64.split(',')[1]
            try:
                init_image_bytes = base64.b64decode(init_image_b64)
            except Exception as e:
                logger.error(f"Failed to decode init image: {e}")
                return JSONResponse(
                    status_code=400,
                    content={"error": "Invalid init image data"}
                )

        # Get image service
        image_service = get_image_service()

        # Generate image with seed and optional init image
        image_bytes = image_service.generate_image(
            prompt=prompt,
            negative_prompt=negative_prompt,
            width=width,
            height=height,
            num_inference_steps=num_steps,
            seed=seed,
            init_image=init_image_bytes,
            strength=strength
        )

        if image_bytes is None:
            return JSONResponse(
                status_code=500,
                content={"error": "Image generation failed"}
            )

        # Convert to base64
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')
        data_uri = f"data:image/png;base64,{image_b64}"

        return JSONResponse(content={
            "success": True,
            "imageData": data_uri,
            "seed": seed
        })

    except Exception as e:
        logger.error(f"Error generating image from seed: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.post("/api/inpaint")
async def inpaint_image(
    image: UploadFile = File(...),
    mask: UploadFile = File(...),
    seed: Optional[int] = None
):
    """
    Remove objects from image using IOPaint (LaMa model)
    
    Form data:
    - image: Original image file
    - mask: Mask image file (white = remove, black = keep)
    - seed: Optional random seed
    
    Returns:
        Inpainted image as PNG
    """
    try:
        # Read uploaded files
        image_data = await image.read()
        mask_data = await mask.read()
        
        if not image_data or not mask_data:
            return JSONResponse(
                status_code=400,
                content={"error": "Both image and mask are required"}
            )
        
        # Get image service
        image_service = get_image_service()
        
        # Perform inpainting
        result_bytes = image_service.inpaint_image(
            image_data=image_data,
            mask_data=mask_data,
            seed=seed
        )
        
        if result_bytes is None:
            return JSONResponse(
                status_code=500,
                content={"error": "Inpainting failed"}
            )
        
        # Return result image
        return Response(
            content=result_bytes,
            media_type="image/png"
        )
        
    except Exception as e:
        logger.error(f"Error in inpainting: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.post("/api/inpaint-base64")
async def inpaint_image_base64(request: Request):
    """
    Inpaint with base64 input/output (easier for frontend)

    Request body:
    {
        "image": "data:image/png;base64,...",
        "mask": "data:image/png;base64,...",
        "seed": 12345 (optional)
    }

    Returns:
    {
        "success": true,
        "imageData": "data:image/png;base64,..."
    }
    """
    try:
        logger.info("=== INPAINT-BASE64 REQUEST RECEIVED ===")
        data = await request.json()
        logger.info(f"Request data keys: {list(data.keys())}")

        image_b64 = data.get('image', '')
        mask_b64 = data.get('mask', '')
        seed = data.get('seed')

        logger.info(f"Image b64 length: {len(image_b64) if image_b64 else 0}")
        logger.info(f"Mask b64 length: {len(mask_b64) if mask_b64 else 0}")
        logger.info(f"Seed: {seed}")

        if not image_b64 or not mask_b64:
            logger.error("Missing image or mask data")
            return JSONResponse(
                status_code=400,
                content={"error": "Both image and mask are required"}
            )

        # Remove data URI prefix if present
        if image_b64.startswith('data:'):
            image_b64 = image_b64.split(',')[1]
            logger.info("Removed data URI prefix from image")
        if mask_b64.startswith('data:'):
            mask_b64 = mask_b64.split(',')[1]
            logger.info("Removed data URI prefix from mask")

        logger.info(f"Cleaned image b64 length: {len(image_b64)}")
        logger.info(f"Cleaned mask b64 length: {len(mask_b64)}")

        # Decode base64
        try:
            image_data = base64.b64decode(image_b64)
            logger.info(f"Decoded image data: {len(image_data)} bytes")
        except Exception as e:
            logger.error(f"Failed to decode image base64: {e}")
            return JSONResponse(
                status_code=400,
                content={"error": f"Invalid image base64: {str(e)}"}
            )

        try:
            mask_data = base64.b64decode(mask_b64)
            logger.info(f"Decoded mask data: {len(mask_data)} bytes")
        except Exception as e:
            logger.error(f"Failed to decode mask base64: {e}")
            return JSONResponse(
                status_code=400,
                content={"error": f"Invalid mask base64: {str(e)}"}
            )

        # Get image service
        logger.info("Getting image service...")
        image_service = get_image_service()
        logger.info("Image service obtained")

        # Perform inpainting
        logger.info("Calling inpaint_image...")
        result_bytes = image_service.inpaint_image(
            image_data=image_data,
            mask_data=mask_data,
            seed=seed
        )

        if result_bytes is None:
            logger.error("inpaint_image returned None")
            return JSONResponse(
                status_code=500,
                content={"error": "Inpainting failed"}
            )

        logger.info(f"Inpainting successful, result size: {len(result_bytes)} bytes")

        # Convert to base64
        result_b64 = base64.b64encode(result_bytes).decode('utf-8')
        data_uri = f"data:image/png;base64,{result_b64}"

        logger.info(f"Returning result, data URI length: {len(data_uri)}")
        return JSONResponse(content={
            "success": True,
            "imageData": data_uri
        })

    except Exception as e:
        logger.error(f"Error in inpainting: {e}")
        import traceback
        logger.error(f"Full traceback: {traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.post("/api/remove-background-base64")
async def remove_background_base64(request: Request):
    """Remove image background using rembg. Returns transparent PNG as base64."""
    try:
        try:
            from rembg import remove as rembg_remove
        except ImportError:
            return JSONResponse(
                status_code=503,
                content={"error": "rembg is not installed. Run: pip install rembg"}
            )

        import io
        from PIL import Image as PILImage

        data = await request.json()
        image_data_uri = data.get("image", "")
        strength = max(0, min(100, int(data.get("strength", 100))))

        image_b64 = image_data_uri.split(",", 1)[1] if "," in image_data_uri else image_data_uri
        img_bytes = base64.b64decode(image_b64)
        img = PILImage.open(io.BytesIO(img_bytes)).convert("RGBA")

        result = rembg_remove(img)

        # Blend with original based on strength (100 = full removal, 0 = no removal)
        if strength < 100:
            # Get the alpha channel from the result and blend it toward fully opaque
            r_r, r_g, r_b, r_a = result.split()
            import numpy as np
            alpha_arr = np.array(r_a, dtype=np.float32)
            # Blend alpha toward 255 (opaque) based on inverse strength
            blend_factor = strength / 100.0
            blended_alpha = alpha_arr * blend_factor + 255.0 * (1.0 - blend_factor)
            r_a = PILImage.fromarray(blended_alpha.astype(np.uint8))
            result = PILImage.merge("RGBA", (r_r, r_g, r_b, r_a))

        output = io.BytesIO()
        result.save(output, format="PNG")
        output.seek(0)

        result_b64 = base64.b64encode(output.read()).decode("utf-8")
        return JSONResponse(content={"success": True, "imageData": f"data:image/png;base64,{result_b64}"})

    except Exception as e:
        logger.error(f"Background removal error: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/api/image-service/status")
async def get_image_service_status():
    """
    Check status of image generation services
    
    Returns:
    {
        "sdxl": {"initialized": true/false},
        "iopaint": {"running": true/false, "port": 8080}
    }
    """
    try:
        image_service = get_image_service()
        
        return JSONResponse(content={
            "sdxl": {
                "initialized": image_service.pipeline is not None
            },
            "iopaint": {
                "running": image_service.is_iopaint_running(),
                "port": image_service.iopaint_port
            }
        })
        
    except Exception as e:
        logger.error(f"Error checking image service status: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.post("/api/image-service/start-iopaint")
async def start_iopaint_service():
    """
    Manually start IOPaint service
    
    Returns:
    {
        "success": true/false,
        "message": "status message"
    }
    """
    try:
        image_service = get_image_service()
        
        if image_service.is_iopaint_running():
            return JSONResponse(content={
                "success": True,
                "message": "IOPaint already running"
            })
        
        success = image_service.start_iopaint()
        
        if success:
            return JSONResponse(content={
                "success": True,
                "message": "IOPaint started successfully"
            })
        else:
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "message": "Failed to start IOPaint"
                }
            )
        
    except Exception as e:
        logger.error(f"Error starting IOPaint: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


# ── Bulk Export / Import ──────────────────────────────────────────────────────

@app.get("/api/export-data")
async def export_data(categories: str = ""):
    """Export selected data categories.
    categories is a comma-separated string of: chats, lesson_plans, quizzes, rubrics,
    kindergarten, multigrade, cross_curricular, worksheets, images, students, settings
    """
    cats = [c.strip() for c in categories.split(",") if c.strip()]
    result: dict = {}

    if "chats" in cats:
        try:
            memory = get_chat_memory()
            result["chats"] = memory.get_all_chats_with_messages()
        except Exception:
            result["chats"] = []

    if "lesson_plans" in cats:
        try:
            plans = []
            if os.path.exists(LESSON_PLAN_HISTORY_FILE):
                with open(LESSON_PLAN_HISTORY_FILE, 'r', encoding='utf-8') as f:
                    plans = json.load(f)
            result["lesson_plans"] = plans
        except Exception:
            result["lesson_plans"] = []

    if "quizzes" in cats:
        result["quizzes"] = load_json_data("quiz_history.json")

    if "rubrics" in cats:
        result["rubrics"] = load_json_data("rubric_history.json")

    if "kindergarten" in cats:
        result["kindergarten"] = load_json_data("kindergarten_history.json")

    if "multigrade" in cats:
        result["multigrade"] = load_json_data("multigrade_history.json")

    if "cross_curricular" in cats:
        result["cross_curricular"] = load_json_data("cross_curricular_history.json")

    if "worksheets" in cats:
        result["worksheets"] = load_json_data("worksheet_history.json")

    if "images" in cats:
        result["images"] = load_json_data("images_history.json")

    if "students" in cats:
        try:
            result["students"] = student_service.list_students()
        except Exception:
            result["students"] = []

    return {
        "exportDate": datetime.now().isoformat(),
        "version": "1.0.0",
        "categories": cats,
        "data": result
    }


@app.post("/api/import-data")
async def import_data(payload: dict):
    """Import data from a previously exported bundle.
    payload.categories: list of category keys to import
    payload.data: dict mapping category key -> array of records
    """
    cats = payload.get("categories", [])
    data = payload.get("data", {})
    imported: dict = {}
    errors: list = []

    if "chats" in cats and "chats" in data:
        try:
            memory = get_chat_memory()
            count = 0
            for chat in data["chats"]:
                cid = chat.get("id") or str(uuid.uuid4())
                title = chat.get("title", "Imported Chat")
                messages = chat.get("messages", [])
                memory.ensure_chat(cid, title)
                memory.update_chat_title(cid, title)
                if messages:
                    memory.save_messages_bulk(cid, messages)
                count += 1
            imported["chats"] = count
        except Exception as e:
            errors.append(f"chats: {e}")

    if "lesson_plans" in cats and "lesson_plans" in data:
        try:
            existing = []
            if os.path.exists(LESSON_PLAN_HISTORY_FILE):
                with open(LESSON_PLAN_HISTORY_FILE, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
            existing_ids = {h.get("id") for h in existing}
            added = 0
            for plan in data["lesson_plans"]:
                if plan.get("id") not in existing_ids:
                    existing.append(plan)
                    added += 1
            with open(LESSON_PLAN_HISTORY_FILE, 'w', encoding='utf-8') as f:
                json.dump(existing, f, indent=2)
            imported["lesson_plans"] = added
        except Exception as e:
            errors.append(f"lesson_plans: {e}")

    # Generic JSON history imports
    json_map = {
        "quizzes": "quiz_history.json",
        "rubrics": "rubric_history.json",
        "kindergarten": "kindergarten_history.json",
        "multigrade": "multigrade_history.json",
        "cross_curricular": "cross_curricular_history.json",
        "worksheets": "worksheet_history.json",
        "images": "images_history.json",
    }
    for cat_key, filename in json_map.items():
        if cat_key in cats and cat_key in data:
            try:
                existing = load_json_data(filename)
                existing_ids = {h.get("id") for h in existing}
                added = 0
                for item in data[cat_key]:
                    if item.get("id") not in existing_ids:
                        existing.append(item)
                        added += 1
                save_json_data(filename, existing)
                imported[cat_key] = added
            except Exception as e:
                errors.append(f"{cat_key}: {e}")

    if "students" in cats and "students" in data:
        try:
            count = 0
            for student in data["students"]:
                try:
                    student_service.create_student(student)
                    count += 1
                except Exception:
                    pass  # skip duplicates
            imported["students"] = count
        except Exception as e:
            errors.append(f"students: {e}")

    return {
        "success": len(errors) == 0,
        "imported": imported,
        "errors": errors
    }


@app.post("/api/factory-reset")
async def factory_reset():
    """Wipe all app data: databases, history files, and cached state.
    After this, the app behaves as if opened for the first time."""
    errors = []
    deleted = []

    data_dir = get_data_directory()

    # 1. Delete all JSON history files in data directory
    json_files = [
        "quiz_history.json",
        "rubric_history.json",
        "kindergarten_history.json",
        "multigrade_history.json",
        "cross_curricular_history.json",
        "worksheet_history.json",
        "images_history.json",
    ]
    for fname in json_files:
        fpath = data_dir / fname
        if fpath.exists():
            try:
                os.remove(fpath)
                deleted.append(str(fpath))
            except Exception as e:
                errors.append(f"Failed to delete {fname}: {e}")

    # 2. Delete lesson_plan_history.json (stored in backend dir)
    if os.path.exists(LESSON_PLAN_HISTORY_FILE):
        try:
            os.remove(LESSON_PLAN_HISTORY_FILE)
            deleted.append(LESSON_PLAN_HISTORY_FILE)
        except Exception as e:
            errors.append(f"Failed to delete lesson_plan_history.json: {e}")

    # 3. Delete chat_history.json (legacy, stored in backend dir)
    if os.path.exists(CHAT_HISTORY_FILE):
        try:
            os.remove(CHAT_HISTORY_FILE)
            deleted.append(CHAT_HISTORY_FILE)
        except Exception as e:
            errors.append(f"Failed to delete chat_history.json: {e}")

    # 4. Delete SQLite databases (close singletons first)
    import chat_memory as _cm
    from milestones.milestone_db import _milestone_db as _mdb_ref
    import milestones.milestone_db as _mdb_mod

    # Close and delete chat_memory.db
    try:
        if _cm._instance is not None:
            _cm._instance = None
        db_path = data_dir / "chat_memory.db"
        if db_path.exists():
            os.remove(db_path)
            deleted.append(str(db_path))
    except Exception as e:
        errors.append(f"Failed to delete chat_memory.db: {e}")

    # Close and delete milestones.db
    try:
        _mdb_mod._milestone_db = None
        db_path = data_dir / "milestones.db"
        if db_path.exists():
            os.remove(db_path)
            deleted.append(str(db_path))
    except Exception as e:
        errors.append(f"Failed to delete milestones.db: {e}")

    # Close and delete students.db
    try:
        db_path = data_dir / "students.db"
        if db_path.exists():
            os.remove(db_path)
            deleted.append(str(db_path))
    except Exception as e:
        errors.append(f"Failed to delete students.db: {e}")

    logger.info(f"Factory reset completed. Deleted: {deleted}. Errors: {errors}")
    return {
        "success": len(errors) == 0,
        "deleted": deleted,
        "errors": errors
    }












