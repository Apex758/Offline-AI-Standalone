import subprocess
import re
import os
import sys
sys.stdout.reconfigure(encoding='utf-8')



def run_llama(prompt: str) -> str:
    """
    Executes llama.cpp (llama-cli) with a given prompt
    and filters out system log noise to return only model output.

    All llama loader / metadata / system logs are redirected to a file (logs/llama.log)
    while the cleaned natural language response is returned to the caller.
    """
    os.makedirs("logs", exist_ok=True)
    log_file = open(os.path.join("logs", "llama.log"), "a", encoding="utf-8")

    process = subprocess.Popen(
        [
            "llama-cli",
            "--model",
            __import__("backend.config", fromlist=["MODEL_NAME"]).MODEL_NAME,
            "--prompt",
            prompt,
        ],
        stdout=subprocess.PIPE,
        stderr=log_file,
        text=True,
    )

    raw_output, _ = process.communicate()

    # Filter out unwanted system lines
    clean_output = "\n".join(
        line
        for line in raw_output.splitlines()
        if not re.match(r"^(llama_model_loader|print_info|main:|load:|build:)", line)
    )

    result = clean_output.strip()

    log_file.close()
    return result