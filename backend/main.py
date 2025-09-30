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
    print("Server ready!")

class LoginRequest(BaseModel):
    username: str
    password: str

class ChatMessage(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str
    timestamp: str

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
            response_started = {'value': False}
            
            def read_stream(stream, output_list):
                """Read from stream character by character"""
                while True:
                    char = stream.read(1)
                    if not char:
                        break
                    output_list.append(char)
                    
                    # Check if we've hit the generation phase
                    current_text = ''.join(output_list)
                    if not generation_started['value'] and "Not using system message" in current_text:
                        generation_started['value'] = True
                        print(f"\n{'='*60}\n🤖 AI RESPONSE:\n{'='*60}\n")
                    
                    # Only print to terminal after generation starts
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
            
            while time.time() - start_time < timeout_seconds:
                if process.poll() is not None:
                    break
                
                current_output = ''.join(all_output)
                
                # Check for completion
                if "llama_perf_sampler_print:" in current_output:
                    time.sleep(1)
                    break
                
                # Find where assistant response actually starts
                if not found_assistant_start and "<|start_header_id|>assistant<|end_header_id|>" in current_output:
                    found_assistant_start = True
                    # Find the index right after the assistant header
                    assistant_index = current_output.find("<|start_header_id|>assistant<|end_header_id|>")
                    if assistant_index != -1:
                        last_streamed_index = assistant_index + len("<|start_header_id|>assistant<|end_header_id|>")
                        # Skip any newlines and the garbage prompt message
                        while last_streamed_index < len(current_output) and current_output[last_streamed_index] in ['\n', '\r', ' ']:
                            last_streamed_index += 1
                
                # Check if we need to skip the "To change it" message
                if found_assistant_start and not skip_initial_garbage:
                    remaining = current_output[last_streamed_index:]
                    if "To change it, set a different value via -sys PROMPT" in remaining:
                        skip_index = remaining.find("To change it, set a different value via -sys PROMPT")
                        if skip_index != -1:
                            last_streamed_index += skip_index + len("To change it, set a different value via -sys PROMPT")
                            # Skip newlines after
                            while last_streamed_index < len(current_output) and current_output[last_streamed_index] in ['\n', '\r']:
                                last_streamed_index += 1
                            skip_initial_garbage = True
                
                # Stream new content
                if found_assistant_start and skip_initial_garbage and last_streamed_index < len(current_output):
                    # Get new characters to stream
                    new_content = current_output[last_streamed_index:]
                    
                    # Don't stream if we hit special tokens or end markers
                    if "<|" in new_content or "llama_perf" in new_content or "> EOF" in new_content:
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
                    
                    last_streamed_index = len(current_output)
                
                await asyncio.sleep(0.05)  # Check more frequently for smoother streaming
            
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
            
            for marker in ["llama_perf_", "> EOF by user", "Interrupted by user"]:
                if marker in response_text:
                    response_text = response_text.split(marker)[0]
            
            response_text = response_text.replace("<|eot_id|>", "")
            response_text = response_text.replace("<|end_of_text|>", "")
            response_text = response_text.replace("<|begin_of_text|>", "")
            
            if "To change it, set a different value via -sys PROMPT" in response_text:
                response_text = response_text.split("To change it, set a different value via -sys PROMPT", 1)[1]
            
            response_text = response_text.strip()
            
            # Send completion
            await websocket.send_json({"type": "done", "full_response": response_text})
            
            print(f"\n{'='*60}")
            print(f"Response complete - {len(response_text)} chars")
            print(f"{'='*60}\n")
            
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        import traceback
        traceback.print_exc()

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "model_found": os.path.exists(MODEL_PATH),
        "llama_cli_found": os.path.exists(LLAMA_CLI_PATH)
    }