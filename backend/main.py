from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import subprocess
import os
import re
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
    # Simple authentication - you can enhance this later
    if request.username and request.password:
        # For now, accept any non-empty credentials
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

@app.post("/api/chat")
async def chat(message: ChatMessage):
    if not os.path.exists(LLAMA_CLI_PATH):
        raise HTTPException(status_code=503, detail="llama-cli.exe not found")
    
    if not os.path.exists(MODEL_PATH):
        raise HTTPException(status_code=503, detail="Model file not found")
    
    try:
        # ============================================================
        # SIMPLE PROMPTING METHOD (Currently Active)
        # ============================================================
        # This is the straightforward method - just pass the user's message directly
        prompt = message.message
        
        
        # ============================================================
        # ADVANCED PROMPTING METHOD (Commented Out)
        # ============================================================
        # Uncomment this section if you want to use system messages and constraints
        # This uses the Llama 3.2 Instruct format with special tokens
        # 
        # prompt = "<|begin_of_text|>"
        # 
        # # Add system message to set behavior and constraints
        # system_message = "You are a helpful AI assistant for education. Keep responses concise and age-appropriate."
        # prompt += f"<|start_header_id|>system<|end_header_id|>\n\n{system_message}<|eot_id|>"
        # 
        # # Add conversation history (last N messages for context)
        # history_length = min(3, LLAMA_PARAMS["conversation_history_length"])
        # for msg in message.conversation_history[-history_length:]:
        #     role = msg.get("role", "user")
        #     content = msg.get("content", "")
        #     prompt += f"<|start_header_id|>{role}<|end_header_id|>\n\n{content}<|eot_id|>"
        # 
        # # Add current user message
        # prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{message.message}<|eot_id|>"
        # 
        # # Add assistant header to prompt response
        # prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"
        
        
        # Prepare the command - EXACTLY as manual execution
        cmd = [
            LLAMA_CLI_PATH,
            "-m", MODEL_PATH,
            "-p", prompt,
            "-n", str(LLAMA_PARAMS["max_tokens"])
        ]
        
        # Execute llama-cli
        print(f"Executing llama-cli with prompt length: {len(prompt)} characters")
        print(f"User message: {message.message[:100]}...")
        
        # Run the process
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
        )
        
        # Close stdin immediately
        process.stdin.close()
        
        # Wait for a reasonable time for generation to complete
        # Based on your logs, generation takes about 30-35 seconds
        import time
        generation_time = 45  # Give it 45 seconds to generate
        
        time.sleep(generation_time)
        
        # Kill the process after generation time
        process.terminate()
        time.sleep(1)
        
        # Force kill if still running
        if process.poll() is None:
            process.kill()
        
        # Get all output
        stdout, stderr = process.communicate()
        
        # Combine both - llama-cli outputs to stderr!
        output = stdout + stderr
        
        print(f"Raw output length: {len(output)}")
        print(f"First 500 chars: {output[:500]}")
        
        # Parse the output - extract only the generated text
        response_text = ""
        
        # Find the assistant response
        if "assistant" in output:
            # Split on "assistant" and get everything after
            parts = output.split("assistant", 1)
            if len(parts) > 1:
                response_text = parts[1]
                
                # Remove performance stats and everything after them
                for marker in ["llama_perf_", "llama_print_timings", "system_info:", "== Running"]:
                    if marker in response_text:
                        response_text = response_text.split(marker)[0]
                
                response_text = response_text.strip()
        
        # If we still have no response, try finding it between "user" markers
        if not response_text and "user" in output:
            # Sometimes the output is: user\n\n<prompt>assistant\n\n<response>\n\nuser (waiting for next input)
            parts = output.split("user")
            if len(parts) > 1:
                # Get the part after the first "user"
                middle = parts[1]
                if "assistant" in middle:
                    response_text = middle.split("assistant", 1)[1]
                    # Clean it up
                    for marker in ["llama_perf_", "system_info:", "=="]:
                        if marker in response_text:
                            response_text = response_text.split(marker)[0]
                    response_text = response_text.strip()
        
        # If we STILL have no response, something went wrong
        if not response_text:
            print(f"ERROR: Could not parse response")
            print(f"Output contains 'assistant': {'assistant' in output}")
            print(f"Output contains 'user': {'user' in output}")
            raise HTTPException(status_code=500, detail="Could not parse model response")
        
        # Clean up any special tokens (in case the model generates them)
        response_text = response_text.replace("<|eot_id|>", "").strip()
        response_text = response_text.replace("<|end_of_text|>", "").strip()
        response_text = response_text.replace("<|begin_of_text|>", "").strip()
        
        # Remove any trailing special headers
        if "<|start_header_id|>" in response_text:
            response_text = response_text.split("<|start_header_id|>")[0].strip()
        
        print(f"Generated response length: {len(response_text)} characters")
        
        from datetime import datetime
        return ChatResponse(
            response=response_text,
            timestamp=datetime.now().isoformat()
        )
    except subprocess.TimeoutExpired:
        print(f"Timeout occurred after {LLAMA_PARAMS['timeout']} seconds")
        raise HTTPException(status_code=504, detail="Request timeout - model took too long to respond")
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "model_found": os.path.exists(MODEL_PATH),
        "llama_cli_found": os.path.exists(LLAMA_CLI_PATH)
    }