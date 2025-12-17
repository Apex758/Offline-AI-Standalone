import sys
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
python_libs = os.path.join(script_dir, 'python_libs')
sys.path.insert(0, python_libs)
sys.path.insert(0, script_dir)

print("Starting backend server...")
print(f"Python: {sys.executable}")

try:
    import uvicorn
    from main import app
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    input("Press Enter to exit...")
    sys.exit(1)
