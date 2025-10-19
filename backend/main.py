from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import subprocess
import os
import io
import sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import threading
import time
import json
import asyncio
from config import MODEL_PATH, LLAMA_CLI_PATH, LLAMA_PARAMS, CORS_ORIGINS
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')


def get_data_directory():
    """Get user-writable data directory"""
    if os.name == 'nt':  # Windows
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Learning Hub' / 'data'
    else:  # macOS/Linux
        data_dir = Path.home() / '.olh_ai_education' / 'data'
    
    # Create directory if it doesn't exist
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
        
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path for chat history storage
CHAT_HISTORY_FILE = os.path.join(os.path.dirname(__file__), "chat_history.json")

@app.on_event("startup")
async def check_files():
    print("Checking for required files...")
    if not os.path.exists(MODEL_PATH):
        print(f"[Warning]  Warning: Model file not found at {MODEL_PATH}")
    else:
        print(f"[OK]Model file found: {MODEL_PATH}")
    
    if not os.path.exists(LLAMA_CLI_PATH):
        print(f"[Warning]  Warning: llama-cli.exe not found at {LLAMA_CLI_PATH}")
    else:
        print(f"[OK]llama-cli.exe found: {LLAMA_CLI_PATH}")
    
    # Initialize chat history file if it doesn't exist
    if not os.path.exists(CHAT_HISTORY_FILE):
        with open(CHAT_HISTORY_FILE, 'w') as f:
            json.dump([], f)
        print(f"[OK]Created chat history file: {CHAT_HISTORY_FILE}")
    else:
        print(f"[OK]Chat history file found: {CHAT_HISTORY_FILE}")
    
    print("Server ready!")

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
            # Sort by timestamp, newest first
            histories.sort(key=lambda x: x['timestamp'], reverse=True)
            return histories
        return []
    except Exception as e:
        print(f"Error loading chat history: {e}")
        return []

@app.post("/api/chat-history")
async def save_chat_history(chat: ChatHistory):
    """Save or update a chat history"""
    try:
        # Load existing histories
        histories = []
        if os.path.exists(CHAT_HISTORY_FILE):
            with open(CHAT_HISTORY_FILE, 'r') as f:
                histories = json.load(f)
        
        # Check if chat with this ID already exists
        existing_index = None
        for i, h in enumerate(histories):
            if h['id'] == chat.id:
                existing_index = i
                break
        
        # Convert to dict
        chat_dict = chat.dict()
        
        if existing_index is not None:
            # Update existing chat
            histories[existing_index] = chat_dict
        else:
            # Add new chat
            histories.append(chat_dict)
        
        # Save back to file
        with open(CHAT_HISTORY_FILE, 'w') as f:
            json.dump(histories, f, indent=2)
        
        return {"success": True, "id": chat.id}
    except Exception as e:
        print(f"Error saving chat history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/chat-history/{chat_id}")
async def delete_chat_history(chat_id: str):
    """Delete a chat history"""
    try:
        if os.path.exists(CHAT_HISTORY_FILE):
            with open(CHAT_HISTORY_FILE, 'r') as f:
                histories = json.load(f)
            
            # Filter out the chat to delete
            histories = [h for h in histories if h['id'] != chat_id]
            
            # Save back to file
            with open(CHAT_HISTORY_FILE, 'w') as f:
                json.dump(histories, f, indent=2)
            
            return {"success": True}
        
        raise HTTPException(status_code=404, detail="Chat history not found")
    except Exception as e:
        print(f"Error deleting chat history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            # Receive message from frontend
            data = await websocket.receive_text()
            message_data = json.loads(data)
            user_message = message_data.get("message", "")
            
            if not user_message:
                continue
            
            # Build teaching assistant prompt
            system_prompt = "You are a helpful AI teaching assistant. Your role is to explain concepts clearly, break down complex topics into understandable parts, provide examples, and encourage learning. Keep your explanations engaging and educational."
            
            prompt = "<|begin_of_text|>"
            prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
            prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{user_message}<|eot_id|>"
            prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"
            
            cmd = [
                LLAMA_CLI_PATH,
                "-m", MODEL_PATH,
                "-p", prompt,
                "-n", str(LLAMA_PARAMS["max_tokens"])
            ]
            
            print(f"\n{'='*60}")
            print(f"WebSocket chat request")
            print(f"User message: {user_message}")
            print(f"{'='*60}\n")
            
            process = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
            )
            
            process.stdin.close()
            
            all_output = []
            generation_started = {'value': False}
            
            # Patterns that indicate end of useful content
            garbage_patterns = [
                'llama_perf',
                '> EOF',
                'Interrupted by user',
                'llama_sampler',
                'llama_print',
                '> llama',
                'sampler_',
                'l>a m',
            ]
            
            def read_stream(stream, output_list):
                """Read from stream character by character"""
                while True:
                    char = stream.read(1)
                    if not char:
                        break
                    output_list.append(char)
                    
                    current_text = ''.join(output_list)
                    if not generation_started['value'] and "Not using system message" in current_text:
                        generation_started['value'] = True
                        print(f"\n{'='*60}\n🤖 AI RESPONSE:\n{'='*60}\n")
                    
                    if generation_started['value']:
                        sys.stdout.write(char)
                        sys.stdout.flush()
            
            # Start threads to read both streams
            stderr_thread = threading.Thread(target=read_stream, args=(process.stderr, all_output))
            stdout_thread = threading.Thread(target=read_stream, args=(process.stdout, all_output))
            stderr_thread.daemon = True
            stdout_thread.daemon = True
            stderr_thread.start()
            stdout_thread.start()
            
            # Wait for generation and stream to websocket
            start_time = time.time()
            timeout_seconds = LLAMA_PARAMS["timeout"]
            last_streamed_index = 0
            found_assistant_start = False
            skip_initial_garbage = False
            should_stop_streaming = False
            
            while time.time() - start_time < timeout_seconds:
                if process.poll() is not None:
                    break
                
                current_output = ''.join(all_output)
                
                # Check for garbage patterns
                if not should_stop_streaming:
                    for pattern in garbage_patterns:
                        if pattern in current_output[last_streamed_index:]:
                            should_stop_streaming = True
                            print("\n[Detected end pattern, stopping stream]")
                            break
                
                if should_stop_streaming:
                    break
                
                # Find where assistant response actually starts
                if not found_assistant_start and "<|start_header_id|>assistant<|end_header_id|>" in current_output:
                    found_assistant_start = True
                    assistant_index = current_output.find("<|start_header_id|>assistant<|end_header_id|>")
                    if assistant_index != -1:
                        last_streamed_index = assistant_index + len("<|start_header_id|>assistant<|end_header_id|>")
                        while last_streamed_index < len(current_output) and current_output[last_streamed_index] in ['\n', '\r', ' ']:
                            last_streamed_index += 1
                
                # Check if we need to skip the "To change it" message
                if found_assistant_start and not skip_initial_garbage:
                    remaining = current_output[last_streamed_index:]
                    if "To change it, set a different value via -sys PROMPT" in remaining:
                        skip_index = remaining.find("To change it, set a different value via -sys PROMPT")
                        if skip_index != -1:
                            last_streamed_index += skip_index + len("To change it, set a different value via -sys PROMPT")
                            while last_streamed_index < len(current_output) and current_output[last_streamed_index] in ['\n', '\r']:
                                last_streamed_index += 1
                            skip_initial_garbage = True
                
                # Stream new content
                if found_assistant_start and skip_initial_garbage and last_streamed_index < len(current_output):
                    new_content = current_output[last_streamed_index:]
                    
                    # Check for end tokens or garbage in the new content
                    should_break = False
                    for pattern in ["<|", *garbage_patterns]:
                        if pattern in new_content:
                            pattern_index = new_content.find(pattern)
                            new_content = new_content[:pattern_index]
                            should_break = True
                            break
                    
                    # Stream character by character
                    for char in new_content:
                        try:
                            await websocket.send_json({
                                "type": "token",
                                "content": char
                            })
                        except:
                            break
                    
                    last_streamed_index += len(new_content)
                    
                    if should_break:
                        break
                
                await asyncio.sleep(0.05)
            
            # Kill the process
            process.terminate()
            time.sleep(0.5)
            if process.poll() is None:
                process.kill()
            
            # Wait for threads
            stderr_thread.join(timeout=2)
            stdout_thread.join(timeout=2)
            
            full_output = ''.join(all_output)
            
            print(f"\n\n{'='*60}")
            print(f"RAW OUTPUT - {len(full_output)} characters total")
            print(f"{'='*60}\n")
            
            # Clean the response
            response_text = full_output
            
            if "<|start_header_id|>assistant<|end_header_id|>" in response_text:
                response_text = response_text.split("<|start_header_id|>assistant<|end_header_id|>", 1)[1]
            
            for marker in garbage_patterns + ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"]:
                if marker in response_text:
                    response_text = response_text.split(marker)[0]
            
            if "To change it, set a different value via -sys PROMPT" in response_text:
                response_text = response_text.split("To change it, set a different value via -sys PROMPT", 1)[1]
            
            response_text = response_text.strip()
   
            # Send completion
            try:
                await websocket.send_json({"type": "done", "full_response": response_text})
            except Exception as e:
                print(f"Could not send done message (connection may have closed): {e}")

            print(f"\n{'='*60}")
            print(f"Response complete - {len(response_text)} chars")
            print(f"{'='*60}\n")
                        
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        import traceback
        traceback.print_exc()

class LessonPlanRequest(BaseModel):
    prompt: str


LESSON_PLAN_HISTORY_FILE = os.path.join(os.path.dirname(__file__), "lesson_plan_history.json")

@app.on_event("startup")
async def check_files():
    print("Checking for required files...")
    if not os.path.exists(MODEL_PATH):
        print(f"[Warning]  Warning: Model file not found at {MODEL_PATH}")
    else:
        print(f"[OK]Model file found: {MODEL_PATH}")
    
    if not os.path.exists(LLAMA_CLI_PATH):
        print(f"[Warning]  Warning: llama-cli.exe not found at {LLAMA_CLI_PATH}")
    else:
        print(f"[OK]llama-cli.exe found: {LLAMA_CLI_PATH}")
    
    # Initialize chat history file if it doesn't exist
    if not os.path.exists(CHAT_HISTORY_FILE):
        with open(CHAT_HISTORY_FILE, 'w') as f:
            json.dump([], f)
        print(f"[OK]Created chat history file: {CHAT_HISTORY_FILE}")
    else:
        print(f"[OK]Chat history file found: {CHAT_HISTORY_FILE}")
    
    # Initialize lesson plan history file if it doesn't exist
    if not os.path.exists(LESSON_PLAN_HISTORY_FILE):
        with open(LESSON_PLAN_HISTORY_FILE, 'w') as f:
            json.dump([], f)
        print(f"[OK]Created lesson plan history file: {LESSON_PLAN_HISTORY_FILE}")
    else:
        print(f"[OK]Lesson plan history file found: {LESSON_PLAN_HISTORY_FILE}")
    
    print("Server ready!")

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
            # Sort by timestamp, newest first
            histories.sort(key=lambda x: x['timestamp'], reverse=True)
            return histories
        return []
    except Exception as e:
        print(f"Error loading lesson plan history: {e}")
        return []

@app.post("/api/lesson-plan-history")
async def save_lesson_plan_history(plan: LessonPlanHistory):
    """Save or update a lesson plan history"""
    try:
        # Load existing histories
        histories = []
        if os.path.exists(LESSON_PLAN_HISTORY_FILE):
            with open(LESSON_PLAN_HISTORY_FILE, 'r') as f:
                histories = json.load(f)
        
        # Check if plan with this ID already exists
        existing_index = None
        for i, h in enumerate(histories):
            if h['id'] == plan.id:
                existing_index = i
                break
        
        # Convert to dict
        plan_dict = plan.dict()
        
        if existing_index is not None:
            # Update existing plan
            histories[existing_index] = plan_dict
        else:
            # Add new plan
            histories.append(plan_dict)
        
        # Save back to file
        with open(LESSON_PLAN_HISTORY_FILE, 'w') as f:
            json.dump(histories, f, indent=2)
        
        return {"success": True, "id": plan.id}
    except Exception as e:
        print(f"Error saving lesson plan history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/lesson-plan-history/{plan_id}")
async def delete_lesson_plan_history(plan_id: str):
    """Delete a lesson plan history"""
    try:
        if os.path.exists(LESSON_PLAN_HISTORY_FILE):
            with open(LESSON_PLAN_HISTORY_FILE, 'r') as f:
                histories = json.load(f)
            
            # Filter out the plan to delete
            histories = [h for h in histories if h['id'] != plan_id]
            
            # Save back to file
            with open(LESSON_PLAN_HISTORY_FILE, 'w') as f:
                json.dump(histories, f, indent=2)
            
            return {"success": True}
        
        raise HTTPException(status_code=404, detail="Lesson plan history not found")
    except Exception as e:
        print(f"Error deleting lesson plan history: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    
@app.post("/api/generate-lesson-plan")
async def generate_lesson_plan(request: LessonPlanRequest):
    """Generate a lesson plan using the LLM"""
    try:
        prompt_text = f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are an expert educational consultant and curriculum designer. Create detailed, engaging, and pedagogically sound lesson plans.<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{request.prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n"
        
        cmd = [
            LLAMA_CLI_PATH,
            "-m", MODEL_PATH,
            "-p", prompt_text,
            "-n", "3000",  # Allow longer responses for lesson plans
            "-t", "4",
            "--temp", "0.7"
        ]
        
        print(f"\n{'='*60}")
        print(f"Generating lesson plan...")
        print(f"{'='*60}\n")
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=180,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
        )
        
        # Combine stdout and stderr
        output = result.stdout + result.stderr
        
        # Extract the response
        if "<|start_header_id|>assistant<|end_header_id|>" in output:
            response = output.split("<|start_header_id|>assistant<|end_header_id|>", 1)[1]
        else:
            response = output
        
        # Clean up the response
        garbage_patterns = [
            'llama_perf', '> EOF', 'Interrupted by user', 'llama_sampler',
            'llama_print', '> llama', 'sampler_', 'l>a m',
            '<|eot_id|>', '<|end_of_text|>', '<|begin_of_text|>'
        ]
        
        for pattern in garbage_patterns:
            if pattern in response:
                response = response.split(pattern)[0]
        
        if "To change it, set a different value via -sys PROMPT" in response:
            response = response.split("To change it, set a different value via -sys PROMPT", 1)[1]
        
        response = response.strip()
        
        print(f"\n{'='*60}")
        print(f"Lesson plan generated - {len(response)} characters")
        print(f"{'='*60}\n")
        
        return {"lessonPlan": response}
        
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=500, detail="Lesson plan generation timed out")
    except Exception as e:
        print(f"Error generating lesson plan: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/lesson-plan")
async def websocket_lesson_plan(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            # Receive message from frontend
            data = await websocket.receive_text()
            message_data = json.loads(data)
            prompt = message_data.get("prompt", "")
            
            if not prompt:
                continue
            
            # Build lesson plan prompt - keep it simple like chat
            system_prompt = "You are an expert educational consultant and curriculum designer. Create detailed, engaging, and pedagogically sound lesson plans that teachers can immediately implement. Focus on practical activities, clear assessment strategies, and alignment with curriculum standards."
            
            full_prompt = "<|begin_of_text|>"
            full_prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
            full_prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>"
            full_prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"
            
            cmd = [
                LLAMA_CLI_PATH,
                "-m", MODEL_PATH,
                "-p", full_prompt,
                "-n", str(LLAMA_PARAMS["max_tokens"])
            ]
            
            print(f"\n{'='*60}")
            print(f"Lesson Plan Generation Request")
            print(f"{'='*60}\n")
            
            process = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
            )
            
            process.stdin.close()
            
            all_output = []
            generation_started = {'value': False}
            
            # Same garbage patterns as chat
            garbage_patterns = [
                'llama_perf',
                '> EOF',
                'Interrupted by user',
                'llama_sampler',
                'llama_print',
                '> llama',
                'sampler_',
                'l>a m',
            ]
            
            def read_stream(stream, output_list):
                """Read from stream character by character - same as chat"""
                while True:
                    char = stream.read(1)
                    if not char:
                        break
                    output_list.append(char)
                    
                    current_text = ''.join(output_list)
                    if not generation_started['value'] and "Not using system message" in current_text:
                        generation_started['value'] = True
                        print(f"\n{'='*60}\n📝 GENERATING LESSON PLAN:\n{'='*60}\n")
                    
                    if generation_started['value']:
                        sys.stdout.write(char)
                        sys.stdout.flush()
            
            # Start threads to read both streams - same as chat
            stderr_thread = threading.Thread(target=read_stream, args=(process.stderr, all_output))
            stdout_thread = threading.Thread(target=read_stream, args=(process.stdout, all_output))
            stderr_thread.daemon = True
            stdout_thread.daemon = True
            stderr_thread.start()
            stdout_thread.start()
            
            # Wait for generation and stream to websocket - same logic as chat
            start_time = time.time()
            timeout_seconds = LLAMA_PARAMS["timeout"]
            last_streamed_index = 0
            found_assistant_start = False
            skip_initial_garbage = False
            should_stop_streaming = False
            
            while time.time() - start_time < timeout_seconds:
                if process.poll() is not None:
                    break
                
                current_output = ''.join(all_output)
                
                # Check for garbage patterns - same as chat
                if not should_stop_streaming:
                    for pattern in garbage_patterns:
                        if pattern in current_output[last_streamed_index:]:
                            should_stop_streaming = True
                            print("\n[Detected end pattern, stopping stream]")
                            break
                
                if should_stop_streaming:
                    break
                
                # Find where assistant response actually starts - same as chat
                if not found_assistant_start and "<|start_header_id|>assistant<|end_header_id|>" in current_output:
                    found_assistant_start = True
                    assistant_index = current_output.find("<|start_header_id|>assistant<|end_header_id|>")
                    if assistant_index != -1:
                        last_streamed_index = assistant_index + len("<|start_header_id|>assistant<|end_header_id|>")
                        while last_streamed_index < len(current_output) and current_output[last_streamed_index] in ['\n', '\r', ' ']:
                            last_streamed_index += 1
                
                # Check if we need to skip the "To change it" message - same as chat
                if found_assistant_start and not skip_initial_garbage:
                    remaining = current_output[last_streamed_index:]
                    if "To change it, set a different value via -sys PROMPT" in remaining:
                        skip_index = remaining.find("To change it, set a different value via -sys PROMPT")
                        if skip_index != -1:
                            last_streamed_index += skip_index + len("To change it, set a different value via -sys PROMPT")
                            while last_streamed_index < len(current_output) and current_output[last_streamed_index] in ['\n', '\r']:
                                last_streamed_index += 1
                            skip_initial_garbage = True
                
                # Stream new content - same as chat
                if found_assistant_start and skip_initial_garbage and last_streamed_index < len(current_output):
                    new_content = current_output[last_streamed_index:]
                    
                    # Check for end tokens or garbage in the new content
                    should_break = False
                    for pattern in ["<|", *garbage_patterns]:
                        if pattern in new_content:
                            pattern_index = new_content.find(pattern)
                            new_content = new_content[:pattern_index]
                            should_break = True
                            break
                    
                    # Stream character by character - same as chat
                    for char in new_content:
                        try:
                            await websocket.send_json({
                                "type": "token",
                                "content": char
                            })
                        except:
                            break
                    
                    last_streamed_index += len(new_content)
                    
                    if should_break:
                        break
                
                await asyncio.sleep(0.05)
            
            # Kill the process - same as chat
            process.terminate()
            time.sleep(0.5)
            if process.poll() is None:
                process.kill()
            
            # Wait for threads - same as chat
            stderr_thread.join(timeout=2)
            stdout_thread.join(timeout=2)
            
            full_output = ''.join(all_output)
            
            print(f"\n\n{'='*60}")
            print(f"Lesson plan generation complete")
            print(f"{'='*60}\n")
            
            # Clean the response - same as chat
            response_text = full_output
            
            if "<|start_header_id|>assistant<|end_header_id|>" in response_text:
                response_text = response_text.split("<|start_header_id|>assistant<|end_header_id|>", 1)[1]
            
            for marker in garbage_patterns + ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"]:
                if marker in response_text:
                    response_text = response_text.split(marker)[0]
            
            if "To change it, set a different value via -sys PROMPT" in response_text:
                response_text = response_text.split("To change it, set a different value via -sys PROMPT", 1)[1]
            
            response_text = response_text.strip()
            
            # Send completion
            try:
                await websocket.send_json({"type": "done", "full_response": response_text})
            except Exception as e:
                print(f"Could not send done message (connection may have closed): {e}")

            print(f"\n{'='*60}")
            print(f"Response complete - {len(response_text)} chars")
            print(f"{'='*60}\n")
                        
    except WebSocketDisconnect:
        print("Lesson Plan WebSocket disconnected")
    except Exception as e:
        print(f"Lesson Plan WebSocket error: {str(e)}")
        import traceback
        traceback.print_exc()
 
 

@app.websocket("/ws/quiz")
async def quiz_websocket(websocket: WebSocket):
    await websocket.accept()
    print("Quiz WebSocket connection accepted")
    
    try:
        while True:
            data = await websocket.receive_json()
            prompt = data.get("prompt", "")
            print(f"Received quiz prompt: {prompt[:100]}...")
            
            if not prompt:
                print("ERROR: Empty prompt received")
                continue
            
            system_prompt = "You are an expert educational assessment designer. Create comprehensive, well-structured quizzes that accurately assess student learning."
            
            full_prompt = "<|begin_of_text|>"
            full_prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
            full_prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>"
            full_prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"
            
            cmd = [
                LLAMA_CLI_PATH,
                "-m", MODEL_PATH,
                "-p", full_prompt,
                "-n", "4000",  # INCREASED TOKEN LIMIT
                "-t", "4",
                "--temp", "0.7"
            ]
            
            print(f"\n{'='*60}")
            print(f"Quiz Generation Request")
            print(f"{'='*60}\n")
            
            try:
                process = subprocess.Popen(
                    cmd,
                    stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    bufsize=1,  # Line buffered instead of 0
                    creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
                )
                
                print("✓ Subprocess created successfully")
                process.stdin.close()
                
            except Exception as e:
                print(f"ERROR: Failed to create subprocess: {e}")
                await websocket.send_json({"type": "error", "message": str(e)})
                continue
            
            all_output = []
            
            garbage_patterns = [
                'llama_perf', '> EOF', 'Interrupted by user', 'llama_sampler',
                'llama_print', '> llama', 'sampler_'
            ]
            
            def read_stream(stream, output_list):
                try:
                    while True:
                        char = stream.read(1)
                        if not char:
                            break
                        output_list.append(char)
                        sys.stdout.write(char)
                        sys.stdout.flush()
                except Exception as e:
                    print(f"Error in read_stream: {e}")
            
            # Start reading both streams
            stderr_thread = threading.Thread(target=read_stream, args=(process.stderr, all_output))
            stdout_thread = threading.Thread(target=read_stream, args=(process.stdout, all_output))
            stderr_thread.daemon = True
            stdout_thread.daemon = True
            stderr_thread.start()
            stdout_thread.start()
            
            print("✓ Read threads started")
            
            # IMPROVED STREAMING LOGIC - Filter all initialization logs
            start_time = time.time()
            timeout_seconds = LLAMA_PARAMS["timeout"]
            chars_sent = 0
            started_streaming = False
            last_sent_index = 0
            
            # Comprehensive initialization markers to skip
            init_markers = [
                "llama_model_loader",
                "llama_load_model",
                "llm_load_print_meta",
                "llama_new_context",
                "system_info",
                "Not using system message",
                "To change it, set a different value via -sys PROMPT",
                "log_",
                "compute params",
                "total RAM required",
                "ROPs",
                "model desc",
                "model size",
                "model ftype",
                "model params",
                "model type",
                "ggml ctx size",
                "batch size",
                "context size",
                "vocab type",
                "pooling type",
            ]
            
            while time.time() - start_time < timeout_seconds:
                if process.poll() is not None:
                    print(f"Process exited with code: {process.poll()}")
                    break
                
                current_output = ''.join(all_output)
                
                # Check if we should start streaming
                if not started_streaming:
                    # Look for the assistant header to start streaming
                    if "<|start_header_id|>assistant<|end_header_id|>" in current_output:
                        started_streaming = True
                        # Find position after the header
                        header_pos = current_output.find("<|start_header_id|>assistant<|end_header_id|>")
                        last_sent_index = header_pos + len("<|start_header_id|>assistant<|end_header_id|>")
                        
                        # Skip whitespace and initialization markers
                        while last_sent_index < len(current_output) and current_output[last_sent_index] in ['\n', '\r', ' ']:
                            last_sent_index += 1
                        
                        # Skip "To change it..." message if present
                        remaining = current_output[last_sent_index:]
                        if remaining.startswith("To change it, set a different value via -sys PROMPT"):
                            last_sent_index += len("To change it, set a different value via -sys PROMPT")
                            while last_sent_index < len(current_output) and current_output[last_sent_index] in ['\n', '\r']:
                                last_sent_index += 1
                        
                        print("✓ Started streaming quiz content (initialization logs filtered)")
                
                # Stream content if we've started
                if started_streaming and last_sent_index < len(current_output):
                    new_content = current_output[last_sent_index:]
                    
                    # Check for end patterns
                    should_stop = False
                    for pattern in garbage_patterns:
                        if pattern in new_content:
                            pattern_index = new_content.find(pattern)
                            new_content = new_content[:pattern_index]
                            should_stop = True
                            print(f"\n[Detected end pattern '{pattern}', stopping stream]")
                            break
                    
                    # Send character by character
                    for char in new_content:
                        try:
                            await websocket.send_json({
                                "type": "token",
                                "content": char
                            })
                            chars_sent += 1
                        except Exception as e:
                            print(f"Error sending character: {e}")
                            break
                    
                    last_sent_index += len(new_content)
                    
                    if should_stop:
                        break
                
                await asyncio.sleep(0.01)
            
            print(f"\n✓ Sent {chars_sent} characters to frontend")
            
            # Clean up process
            process.terminate()
            time.sleep(0.5)
            if process.poll() is None:
                process.kill()
            
            stderr_thread.join(timeout=2)
            stdout_thread.join(timeout=2)
            
            full_output = ''.join(all_output)
            
            print(f"\n{'='*60}")
            print(f"Total output length: {len(full_output)} characters")
            print(f"{'='*60}\n")
            
            # Clean the response - remove ALL initialization logs
            response_text = full_output
            
            # Extract only content after assistant header
            if "<|start_header_id|>assistant<|end_header_id|>" in response_text:
                response_text = response_text.split("<|start_header_id|>assistant<|end_header_id|>", 1)[1]
            
            # Remove all initialization markers
            for marker in init_markers:
                if marker in response_text:
                    # For init markers, take everything after (they appear at the start)
                    parts = response_text.split(marker, 1)
                    if len(parts) > 1:
                        response_text = parts[1]
            
            # Remove end markers
            for marker in garbage_patterns + ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"]:
                if marker in response_text:
                    response_text = response_text.split(marker)[0]
            
            response_text = response_text.strip()
            
            # Send final response
            try:
                await websocket.send_json({"type": "done", "full_response": response_text})
                print("✓ Sent done message")
            except Exception as e:
                print(f"Could not send done message: {e}")

            print(f"\n{'='*60}")
            print(f"Quiz generation complete - {len(response_text)} chars")
            print(f"{'='*60}\n")
                        
    except WebSocketDisconnect:
        print("Quiz WebSocket disconnected")
    except Exception as e:
        print(f"Quiz WebSocket error: {str(e)}")
        import traceback
        traceback.print_exc()
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
        except:
            pass
        
        
@app.websocket("/ws/rubric")
async def rubric_websocket(websocket: WebSocket):
    await websocket.accept()
    print("Rubric WebSocket connection accepted")
    
    try:
        while True:
            data = await websocket.receive_json()
            prompt = data.get("prompt", "")
            print(f"Received rubric prompt: {prompt[:100]}...")
            
            system_prompt = "You are an expert educational assessment designer. Create detailed, fair, and comprehensive grading rubrics that clearly define performance criteria at each level."
            
            full_prompt = "<|begin_of_text|>"
            full_prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
            full_prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>"
            full_prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"
            
            cmd = [
                LLAMA_CLI_PATH,
                "-m", MODEL_PATH,
                "-p", full_prompt,
                "-n", str(LLAMA_PARAMS["max_tokens"])
            ]
            
            print(f"\n{'='*60}")
            print(f"Rubric Generation Request")
            print(f"{'='*60}\n")
            
            process = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
            )
            
            process.stdin.close()
            
            all_output = []
            generation_started = {'value': False}
            
            garbage_patterns = [
                'llama_perf', '> EOF', 'Interrupted by user', 'llama_sampler',
                'llama_print', '> llama', 'sampler_', 'l>a m',
            ]
            
            def read_stream(stream, output_list):
                while True:
                    char = stream.read(1)
                    if not char:
                        break
                    output_list.append(char)
                    
                    current_text = ''.join(output_list)
                    if not generation_started['value'] and "Not using system message" in current_text:
                        generation_started['value'] = True
                        print(f"\n{'='*60}\n📋 GENERATING RUBRIC:\n{'='*60}\n")
                    
                    if generation_started['value']:
                        sys.stdout.write(char)
                        sys.stdout.flush()
            
            stderr_thread = threading.Thread(target=read_stream, args=(process.stderr, all_output))
            stdout_thread = threading.Thread(target=read_stream, args=(process.stdout, all_output))
            stderr_thread.daemon = True
            stdout_thread.daemon = True
            stderr_thread.start()
            stdout_thread.start()
            
            start_time = time.time()
            timeout_seconds = LLAMA_PARAMS["timeout"]
            last_streamed_index = 0
            found_assistant_start = False
            skip_initial_garbage = False
            should_stop_streaming = False
            
            while time.time() - start_time < timeout_seconds:
                if process.poll() is not None:
                    break
                
                current_output = ''.join(all_output)
                
                if not should_stop_streaming:
                    for pattern in garbage_patterns:
                        if pattern in current_output[last_streamed_index:]:
                            should_stop_streaming = True
                            print("\n[Detected end pattern, stopping stream]")
                            break
                
                if should_stop_streaming:
                    break
                
                if not found_assistant_start and "<|start_header_id|>assistant<|end_header_id|>" in current_output:
                    found_assistant_start = True
                    assistant_index = current_output.find("<|start_header_id|>assistant<|end_header_id|>")
                    if assistant_index != -1:
                        last_streamed_index = assistant_index + len("<|start_header_id|>assistant<|end_header_id|>")
                        while last_streamed_index < len(current_output) and current_output[last_streamed_index] in ['\n', '\r', ' ']:
                            last_streamed_index += 1
                
                if found_assistant_start and not skip_initial_garbage:
                    remaining = current_output[last_streamed_index:]
                    if "To change it, set a different value via -sys PROMPT" in remaining:
                        skip_index = remaining.find("To change it, set a different value via -sys PROMPT")
                        if skip_index != -1:
                            last_streamed_index += skip_index + len("To change it, set a different value via -sys PROMPT")
                            while last_streamed_index < len(current_output) and current_output[last_streamed_index] in ['\n', '\r']:
                                last_streamed_index += 1
                            skip_initial_garbage = True
                
                if found_assistant_start and skip_initial_garbage and last_streamed_index < len(current_output):
                    new_content = current_output[last_streamed_index:]
                    
                    should_break = False
                    for pattern in ["<|", *garbage_patterns]:
                        if pattern in new_content:
                            pattern_index = new_content.find(pattern)
                            new_content = new_content[:pattern_index]
                            should_break = True
                            break
                    
                    for char in new_content:
                        try:
                            await websocket.send_json({
                                "type": "token",
                                "content": char
                            })
                        except:
                            break
                    
                    last_streamed_index += len(new_content)
                    
                    if should_break:
                        break
                
                await asyncio.sleep(0.05)
            
            process.terminate()
            time.sleep(0.5)
            if process.poll() is None:
                process.kill()
            
            stderr_thread.join(timeout=2)
            stdout_thread.join(timeout=2)
            
            full_output = ''.join(all_output)
            
            response_text = full_output
            
            if "<|start_header_id|>assistant<|end_header_id|>" in response_text:
                response_text = response_text.split("<|start_header_id|>assistant<|end_header_id|>", 1)[1]
            
            for marker in garbage_patterns + ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"]:
                if marker in response_text:
                    response_text = response_text.split(marker)[0]
            
            if "To change it, set a different value via -sys PROMPT" in response_text:
                response_text = response_text.split("To change it, set a different value via -sys PROMPT", 1)[1]
            
            response_text = response_text.strip()
            
            try:
                await websocket.send_json({"type": "done", "full_response": response_text})
            except Exception as e:
                print(f"Could not send done message: {e}")

            print(f"\n{'='*60}")
            print(f"Rubric generation complete - {len(response_text)} chars")
            print(f"{'='*60}\n")
                        
    except WebSocketDisconnect:
        print("Rubric WebSocket disconnected")
    except Exception as e:
        print(f"Rubric WebSocket error: {str(e)}")
        import traceback
        traceback.print_exc()


@app.websocket("/ws/kindergarten")
async def kindergarten_websocket(websocket: WebSocket):
    await websocket.accept()
    print("Kindergarten WebSocket connection accepted")
    
    try:
        while True:
            data = await websocket.receive_json()
            prompt = data.get("prompt", "")
            print(f"Received kindergarten prompt: {prompt[:100]}...")
            
            system_prompt = "You are an expert early childhood educator specializing in kindergarten education. Create developmentally appropriate, engaging, and playful lesson plans that foster learning through exploration and hands-on activities."
            
            full_prompt = "<|begin_of_text|>"
            full_prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
            full_prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>"
            full_prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"
            
            cmd = [
                LLAMA_CLI_PATH,
                "-m", MODEL_PATH,
                "-p", full_prompt,
                "-n", str(LLAMA_PARAMS["max_tokens"])
            ]
            
            print(f"\n{'='*60}")
            print(f"Kindergarten Plan Generation Request")
            print(f"{'='*60}\n")
            
            process = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
            )
            
            process.stdin.close()
            
            all_output = []
            generation_started = {'value': False}
            
            garbage_patterns = [
                'llama_perf', '> EOF', 'Interrupted by user', 'llama_sampler',
                'llama_print', '> llama', 'sampler_', 'l>a m',
            ]
            
            def read_stream(stream, output_list):
                while True:
                    char = stream.read(1)
                    if not char:
                        break
                    output_list.append(char)
                    
                    current_text = ''.join(output_list)
                    if not generation_started['value'] and "Not using system message" in current_text:
                        generation_started['value'] = True
                        print(f"\n{'='*60}\n🎨 GENERATING KINDERGARTEN PLAN:\n{'='*60}\n")
                    
                    if generation_started['value']:
                        sys.stdout.write(char)
                        sys.stdout.flush()
            
            stderr_thread = threading.Thread(target=read_stream, args=(process.stderr, all_output))
            stdout_thread = threading.Thread(target=read_stream, args=(process.stdout, all_output))
            stderr_thread.daemon = True
            stdout_thread.daemon = True
            stderr_thread.start()
            stdout_thread.start()
            
            start_time = time.time()
            timeout_seconds = LLAMA_PARAMS["timeout"]
            last_streamed_index = 0
            found_assistant_start = False
            skip_initial_garbage = False
            should_stop_streaming = False
            
            while time.time() - start_time < timeout_seconds:
                if process.poll() is not None:
                    break
                
                current_output = ''.join(all_output)
                
                if not should_stop_streaming:
                    for pattern in garbage_patterns:
                        if pattern in current_output[last_streamed_index:]:
                            should_stop_streaming = True
                            print("\n[Detected end pattern, stopping stream]")
                            break
                
                if should_stop_streaming:
                    break
                
                if not found_assistant_start and "<|start_header_id|>assistant<|end_header_id|>" in current_output:
                    found_assistant_start = True
                    assistant_index = current_output.find("<|start_header_id|>assistant<|end_header_id|>")
                    if assistant_index != -1:
                        last_streamed_index = assistant_index + len("<|start_header_id|>assistant<|end_header_id|>")
                        while last_streamed_index < len(current_output) and current_output[last_streamed_index] in ['\n', '\r', ' ']:
                            last_streamed_index += 1
                
                if found_assistant_start and not skip_initial_garbage:
                    remaining = current_output[last_streamed_index:]
                    if "To change it, set a different value via -sys PROMPT" in remaining:
                        skip_index = remaining.find("To change it, set a different value via -sys PROMPT")
                        if skip_index != -1:
                            last_streamed_index += skip_index + len("To change it, set a different value via -sys PROMPT")
                            while last_streamed_index < len(current_output) and current_output[last_streamed_index] in ['\n', '\r']:
                                last_streamed_index += 1
                            skip_initial_garbage = True
                
                if found_assistant_start and skip_initial_garbage and last_streamed_index < len(current_output):
                    new_content = current_output[last_streamed_index:]
                    
                    should_break = False
                    for pattern in ["<|", *garbage_patterns]:
                        if pattern in new_content:
                            pattern_index = new_content.find(pattern)
                            new_content = new_content[:pattern_index]
                            should_break = True
                            break
                    
                    for char in new_content:
                        try:
                            await websocket.send_json({
                                "type": "token",
                                "content": char
                            })
                        except:
                            break
                    
                    last_streamed_index += len(new_content)
                    
                    if should_break:
                        break
                
                await asyncio.sleep(0.05)
            
            process.terminate()
            time.sleep(0.5)
            if process.poll() is None:
                process.kill()
            
            stderr_thread.join(timeout=2)
            stdout_thread.join(timeout=2)
            
            full_output = ''.join(all_output)
            
            response_text = full_output
            
            if "<|start_header_id|>assistant<|end_header_id|>" in response_text:
                response_text = response_text.split("<|start_header_id|>assistant<|end_header_id|>", 1)[1]
            
            for marker in garbage_patterns + ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"]:
                if marker in response_text:
                    response_text = response_text.split(marker)[0]
            
            if "To change it, set a different value via -sys PROMPT" in response_text:
                response_text = response_text.split("To change it, set a different value via -sys PROMPT", 1)[1]
            
            response_text = response_text.strip()
            
            try:
                await websocket.send_json({"type": "done", "full_response": response_text})
            except Exception as e:
                print(f"Could not send done message: {e}")

            print(f"\n{'='*60}")
            print(f"Kindergarten plan generation complete - {len(response_text)} chars")
            print(f"{'='*60}\n")
                        
    except WebSocketDisconnect:
        print("Kindergarten WebSocket disconnected")
    except Exception as e:
        print(f"Kindergarten WebSocket error: {str(e)}")
        import traceback
        traceback.print_exc()


@app.websocket("/ws/multigrade")
async def multigrade_websocket(websocket: WebSocket):
    await websocket.accept()
    print("Multigrade WebSocket connection accepted")
    
    try:
        while True:
            data = await websocket.receive_json()
            prompt = data.get("prompt", "")
            print(f"Received multigrade prompt: {prompt[:100]}...")
            
            system_prompt = "You are an expert educator specializing in multigrade and multi-age classroom instruction. Create comprehensive lesson plans that address multiple grade levels simultaneously with differentiated activities and flexible grouping strategies."
            
            full_prompt = "<|begin_of_text|>"
            full_prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
            full_prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>"
            full_prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"
            
            cmd = [
                LLAMA_CLI_PATH,
                "-m", MODEL_PATH,
                "-p", full_prompt,
                "-n", str(LLAMA_PARAMS["max_tokens"])
            ]
            
            print(f"\n{'='*60}")
            print(f"Multigrade Plan Generation Request")
            print(f"{'='*60}\n")
            
            process = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
            )
            
            process.stdin.close()
            
            all_output = []
            generation_started = {'value': False}
            
            garbage_patterns = [
                'llama_perf', '> EOF', 'Interrupted by user', 'llama_sampler',
                'llama_print', '> llama', 'sampler_', 'l>a m',
            ]
            
            def read_stream(stream, output_list):
                while True:
                    char = stream.read(1)
                    if not char:
                        break
                    output_list.append(char)
                    
                    current_text = ''.join(output_list)
                    if not generation_started['value'] and "Not using system message" in current_text:
                        generation_started['value'] = True
                        print(f"\n{'='*60}\n👥 GENERATING MULTIGRADE PLAN:\n{'='*60}\n")
                    
                    if generation_started['value']:
                        sys.stdout.write(char)
                        sys.stdout.flush()
            
            stderr_thread = threading.Thread(target=read_stream, args=(process.stderr, all_output))
            stdout_thread = threading.Thread(target=read_stream, args=(process.stdout, all_output))
            stderr_thread.daemon = True
            stdout_thread.daemon = True
            stderr_thread.start()
            stdout_thread.start()
            
            start_time = time.time()
            timeout_seconds = LLAMA_PARAMS["timeout"]
            last_streamed_index = 0
            found_assistant_start = False
            skip_initial_garbage = False
            should_stop_streaming = False
            
            while time.time() - start_time < timeout_seconds:
                if process.poll() is not None:
                    break
                
                current_output = ''.join(all_output)
                
                if not should_stop_streaming:
                    for pattern in garbage_patterns:
                        if pattern in current_output[last_streamed_index:]:
                            should_stop_streaming = True
                            print("\n[Detected end pattern, stopping stream]")
                            break
                
                if should_stop_streaming:
                    break
                
                if not found_assistant_start and "<|start_header_id|>assistant<|end_header_id|>" in current_output:
                    found_assistant_start = True
                    assistant_index = current_output.find("<|start_header_id|>assistant<|end_header_id|>")
                    if assistant_index != -1:
                        last_streamed_index = assistant_index + len("<|start_header_id|>assistant<|end_header_id|>")
                        while last_streamed_index < len(current_output) and current_output[last_streamed_index] in ['\n', '\r', ' ']:
                            last_streamed_index += 1
                
                if found_assistant_start and not skip_initial_garbage:
                    remaining = current_output[last_streamed_index:]
                    if "To change it, set a different value via -sys PROMPT" in remaining:
                        skip_index = remaining.find("To change it, set a different value via -sys PROMPT")
                        if skip_index != -1:
                            last_streamed_index += skip_index + len("To change it, set a different value via -sys PROMPT")
                            while last_streamed_index < len(current_output) and current_output[last_streamed_index] in ['\n', '\r']:
                                last_streamed_index += 1
                            skip_initial_garbage = True
                
                if found_assistant_start and skip_initial_garbage and last_streamed_index < len(current_output):
                    new_content = current_output[last_streamed_index:]
                    
                    should_break = False
                    for pattern in ["<|", *garbage_patterns]:
                        if pattern in new_content:
                            pattern_index = new_content.find(pattern)
                            new_content = new_content[:pattern_index]
                            should_break = True
                            break
                    
                    for char in new_content:
                        try:
                            await websocket.send_json({
                                "type": "token",
                                "content": char
                            })
                        except:
                            break
                    
                    last_streamed_index += len(new_content)
                    
                    if should_break:
                        break
                
                await asyncio.sleep(0.05)
            
            process.terminate()
            time.sleep(0.5)
            if process.poll() is None:
                process.kill()
            
            stderr_thread.join(timeout=2)
            stdout_thread.join(timeout=2)
            
            full_output = ''.join(all_output)
            
            response_text = full_output
            
            if "<|start_header_id|>assistant<|end_header_id|>" in response_text:
                response_text = response_text.split("<|start_header_id|>assistant<|end_header_id|>", 1)[1]
            
            for marker in garbage_patterns + ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"]:
                if marker in response_text:
                    response_text = response_text.split(marker)[0]
            
            if "To change it, set a different value via -sys PROMPT" in response_text:
                response_text = response_text.split("To change it, set a different value via -sys PROMPT", 1)[1]
            
            response_text = response_text.strip()
            
            try:
                await websocket.send_json({"type": "done", "full_response": response_text})
            except Exception as e:
                print(f"Could not send done message: {e}")

            print(f"\n{'='*60}")
            print(f"Multigrade plan generation complete - {len(response_text)} chars")
            print(f"{'='*60}\n")
                        
    except WebSocketDisconnect:
        print("Multigrade WebSocket disconnected")
    except Exception as e:
        print(f"Multigrade WebSocket error: {str(e)}")
        import traceback
        traceback.print_exc()


@app.websocket("/ws/cross-curricular")
async def cross_curricular_websocket(websocket: WebSocket):
    await websocket.accept()
    print("Cross-curricular WebSocket connection accepted")
    
    try:
        while True:
            data = await websocket.receive_json()
            prompt = data.get("prompt", "")
            print(f"Received cross-curricular prompt: {prompt[:100]}...")
            
            system_prompt = "You are an expert educational consultant specializing in integrated and cross-curricular lesson planning. Create comprehensive lesson plans that meaningfully connect multiple subject areas and demonstrate authentic interdisciplinary learning."
            
            full_prompt = "<|begin_of_text|>"
            full_prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|>"
            full_prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>"
            full_prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"
            
            cmd = [
                LLAMA_CLI_PATH,
                "-m", MODEL_PATH,
                "-p", full_prompt,
                "-n", str(LLAMA_PARAMS["max_tokens"])
            ]
            
            print(f"\n{'='*60}")
            print(f"Cross-Curricular Plan Generation Request")
            print(f"{'='*60}\n")
            
            process = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
            )
            
            process.stdin.close()
            
            all_output = []
            generation_started = {'value': False}
            
            garbage_patterns = [
                'llama_perf', '> EOF', 'Interrupted by user', 'llama_sampler',
                'llama_print', '> llama', 'sampler_', 'l>a m',
            ]
            
            def read_stream(stream, output_list):
                while True:
                    char = stream.read(1)
                    if not char:
                        break
                    output_list.append(char)
                    
                    current_text = ''.join(output_list)
                    if not generation_started['value'] and "Not using system message" in current_text:
                        generation_started['value'] = True
                        print(f"\n{'='*60}\n🔗 GENERATING CROSS-CURRICULAR PLAN:\n{'='*60}\n")
                    
                    if generation_started['value']:
                        sys.stdout.write(char)
                        sys.stdout.flush()
            
            stderr_thread = threading.Thread(target=read_stream, args=(process.stderr, all_output))
            stdout_thread = threading.Thread(target=read_stream, args=(process.stdout, all_output))
            stderr_thread.daemon = True
            stdout_thread.daemon = True
            stderr_thread.start()
            stdout_thread.start()
            
            start_time = time.time()
            timeout_seconds = LLAMA_PARAMS["timeout"]
            last_streamed_index = 0
            found_assistant_start = False
            skip_initial_garbage = False
            should_stop_streaming = False
            
            while time.time() - start_time < timeout_seconds:
                if process.poll() is not None:
                    break
                
                current_output = ''.join(all_output)
                
                if not should_stop_streaming:
                    for pattern in garbage_patterns:
                        if pattern in current_output[last_streamed_index:]:
                            should_stop_streaming = True
                            print("\n[Detected end pattern, stopping stream]")
                            break
                
                if should_stop_streaming:
                    break
                
                if not found_assistant_start and "<|start_header_id|>assistant<|end_header_id|>" in current_output:
                    found_assistant_start = True
                    assistant_index = current_output.find("<|start_header_id|>assistant<|end_header_id|>")
                    if assistant_index != -1:
                        last_streamed_index = assistant_index + len("<|start_header_id|>assistant<|end_header_id|>")
                        while last_streamed_index < len(current_output) and current_output[last_streamed_index] in ['\n', '\r', ' ']:
                            last_streamed_index += 1
                
                if found_assistant_start and not skip_initial_garbage:
                    remaining = current_output[last_streamed_index:]
                    if "To change it, set a different value via -sys PROMPT" in remaining:
                        skip_index = remaining.find("To change it, set a different value via -sys PROMPT")
                        if skip_index != -1:
                            last_streamed_index += skip_index + len("To change it, set a different value via -sys PROMPT")
                            while last_streamed_index < len(current_output) and current_output[last_streamed_index] in ['\n', '\r']:
                                last_streamed_index += 1
                            skip_initial_garbage = True
                
                if found_assistant_start and skip_initial_garbage and last_streamed_index < len(current_output):
                    new_content = current_output[last_streamed_index:]
                    
                    should_break = False
                    for pattern in ["<|", *garbage_patterns]:
                        if pattern in new_content:
                            pattern_index = new_content.find(pattern)
                            new_content = new_content[:pattern_index]
                            should_break = True
                            break
                    
                    for char in new_content:
                        try:
                            await websocket.send_json({
                                "type": "token",
                                "content": char
                            })
                        except:
                            break
                    
                    last_streamed_index += len(new_content)
                    
                    if should_break:
                        break
                
                await asyncio.sleep(0.05)
            
            process.terminate()
            time.sleep(0.5)
            if process.poll() is None:
                process.kill()
            
            stderr_thread.join(timeout=2)
            stdout_thread.join(timeout=2)
            
            full_output = ''.join(all_output)
            
            response_text = full_output
            
            if "<|start_header_id|>assistant<|end_header_id|>" in response_text:
                response_text = response_text.split("<|start_header_id|>assistant<|end_header_id|>", 1)[1]
            
            for marker in garbage_patterns + ["<|eot_id|>", "<|end_of_text|>", "<|begin_of_text|>"]:
                if marker in response_text:
                    response_text = response_text.split(marker)[0]
            
            if "To change it, set a different value via -sys PROMPT" in response_text:
                response_text = response_text.split("To change it, set a different value via -sys PROMPT", 1)[1]
            
            response_text = response_text.strip()
            
            try:
                await websocket.send_json({"type": "done", "full_response": response_text})
            except Exception as e:
                print(f"Could not send done message: {e}")

            print(f"\n{'='*60}")
            print(f"Cross-curricular plan generation complete - {len(response_text)} chars")
            print(f"{'='*60}\n")
                        
    except WebSocketDisconnect:
        print("Cross-curricular WebSocket disconnected")
    except Exception as e:
        print(f"Cross-curricular WebSocket error: {str(e)}")
        import traceback
        traceback.print_exc()

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


@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "model_found": os.path.exists(MODEL_PATH),
        "llama_cli_found": os.path.exists(LLAMA_CLI_PATH),
        "chat_history_file": os.path.exists(CHAT_HISTORY_FILE)
    }