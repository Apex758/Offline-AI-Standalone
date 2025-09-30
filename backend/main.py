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
        # Build the prompt using Llama 3.2 Instruct format
        # Format: <|begin_of_text|><|start_header_id|>system<|end_header_id|>...<|start_header_id|>user<|end_header_id|>...
        
        prompt = "<|begin_of_text|>"
        
        # Add system message
        prompt += "<|start_header_id|>system<|end_header_id|>\n\nYou are a helpful AI assistant for education.<|eot_id|>"
        
        # Add conversation history (last 3 messages for context)
        history_length = min(3, LLAMA_PARAMS["conversation_history_length"])
        for msg in message.conversation_history[-history_length:]:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            prompt += f"<|start_header_id|>{role}<|end_header_id|>\n\n{content}<|eot_id|>"
        
        # Add current user message
        prompt += f"<|start_header_id|>user<|end_header_id|>\n\n{message.message}<|eot_id|>"
        
        # Add assistant header to prompt response
        prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"
        
        # Prepare the command for llama-cli with optimized parameters
        cmd = [
            LLAMA_CLI_PATH,
            "-m", MODEL_PATH,
            "-p", prompt,
            "-n", str(LLAMA_PARAMS["max_tokens"]),
            "-t", str(LLAMA_PARAMS["threads"]),
            "--temp", str(LLAMA_PARAMS["temperature"]),
            "--top-p", str(LLAMA_PARAMS["top_p"]),
            "-c", str(LLAMA_PARAMS["context_size"]),
            "--no-display-prompt"  # Don't echo the prompt back
        ]
        
        # Execute llama-cli
        print(f"Executing llama-cli with prompt length: {len(prompt)} characters")
        print(f"User message: {message.message[:100]}...")
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=LLAMA_PARAMS["timeout"],
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0  # Hide console window on Windows
        )
        
        if result.returncode != 0:
            print(f"Error from llama-cli (return code {result.returncode}): {result.stderr}")
            raise HTTPException(status_code=500, detail=f"llama-cli error: {result.stderr}")
        
        # Parse the output
        output = result.stdout.strip()
        
        # The output should just be the assistant's response now
        response_text = output
        
        # Clean up any remaining special tokens
        response_text = response_text.replace("<|eot_id|>", "").strip()
        response_text = response_text.replace("<|end_of_text|>", "").strip()
        
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