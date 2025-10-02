from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import subprocess
import os
import sys
import threading
import time
import json
import asyncio
from config import MODEL_PATH, LLAMA_CLI_PATH, LLAMA_PARAMS, CORS_ORIGINS

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
        print(f"⚠️  Warning: Model file not found at {MODEL_PATH}")
    else:
        print(f"✓ Model file found: {MODEL_PATH}")
    
    if not os.path.exists(LLAMA_CLI_PATH):
        print(f"⚠️  Warning: llama-cli.exe not found at {LLAMA_CLI_PATH}")
    else:
        print(f"✓ llama-cli.exe found: {LLAMA_CLI_PATH}")
    
    # Initialize chat history file if it doesn't exist
    if not os.path.exists(CHAT_HISTORY_FILE):
        with open(CHAT_HISTORY_FILE, 'w') as f:
            json.dump([], f)
        print(f"✓ Created chat history file: {CHAT_HISTORY_FILE}")
    else:
        print(f"✓ Chat history file found: {CHAT_HISTORY_FILE}")
    
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
async def login(request: LoginRequest):
    if request.username and request.password:
        return {
            "success": True,
            "user": {
                "id": "1",
                "username": request.username,
                "name": request.username.title()
            },
            "token": "demo_token_123"
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

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
        print(f"⚠️  Warning: Model file not found at {MODEL_PATH}")
    else:
        print(f"✓ Model file found: {MODEL_PATH}")
    
    if not os.path.exists(LLAMA_CLI_PATH):
        print(f"⚠️  Warning: llama-cli.exe not found at {LLAMA_CLI_PATH}")
    else:
        print(f"✓ llama-cli.exe found: {LLAMA_CLI_PATH}")
    
    # Initialize chat history file if it doesn't exist
    if not os.path.exists(CHAT_HISTORY_FILE):
        with open(CHAT_HISTORY_FILE, 'w') as f:
            json.dump([], f)
        print(f"✓ Created chat history file: {CHAT_HISTORY_FILE}")
    else:
        print(f"✓ Chat history file found: {CHAT_HISTORY_FILE}")
    
    # Initialize lesson plan history file if it doesn't exist
    if not os.path.exists(LESSON_PLAN_HISTORY_FILE):
        with open(LESSON_PLAN_HISTORY_FILE, 'w') as f:
            json.dump([], f)
        print(f"✓ Created lesson plan history file: {LESSON_PLAN_HISTORY_FILE}")
    else:
        print(f"✓ Lesson plan history file found: {LESSON_PLAN_HISTORY_FILE}")
    
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
        
@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "model_found": os.path.exists(MODEL_PATH),
        "llama_cli_found": os.path.exists(LLAMA_CLI_PATH),
        "chat_history_file": os.path.exists(CHAT_HISTORY_FILE)
    }