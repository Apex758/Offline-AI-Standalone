#!/usr/bin/env python3
"""
Backend Packaging Script for OLH AI Education Suite
This script packages the Python backend for distribution with Electron.
"""

import os
import shutil
import subprocess
import sys
import json
from pathlib import Path

def print_header(message):
    """Print a formatted header."""
    print(f"\n{'='*60}")
    print(f"  {message}")
    print(f"{'='*60}\n")

def print_step(message):
    """Print a step message."""
    print(f"📦 {message}")

def print_success(message):
    """Print a success message."""
    print(f"✅ {message}")

def print_warning(message):
    """Print a warning message."""
    print(f"⚠️  {message}")

def print_error(message):
    """Print an error message."""
    print(f"❌ {message}")

def clean_bundle_directory(bundle_dir):
    """Remove existing bundle directory if it exists."""
    if os.path.exists(bundle_dir):
        print_step(f"Cleaning existing bundle directory: {bundle_dir}")
        shutil.rmtree(bundle_dir)
        print_success("Bundle directory cleaned")
    
    os.makedirs(bundle_dir, exist_ok=True)
    print_success(f"Created bundle directory: {bundle_dir}")

def copy_backend_files(bundle_dir):
    """Copy necessary backend files to bundle."""
    print_step("Copying backend files...")
    
    backend_dir = "backend"
    
    # Files to copy
    files_to_copy = [
        "main.py",
        "config.py",
        "chat_history.json",
        "lesson_plan_history.json",
    ]
    
    for file in files_to_copy:
        src = os.path.join(backend_dir, file)
        dest = os.path.join(bundle_dir, file)
        
        if os.path.exists(src):
            shutil.copy2(src, dest)
            print_success(f"Copied {file}")
        else:
            # Create empty files for history if they don't exist
            if file.endswith('.json'):
                with open(dest, 'w') as f:
                    json.dump([], f)
                print_success(f"Created empty {file}")
            else:
                print_warning(f"File not found: {file}")

def copy_model_file(bundle_dir):
    """Copy the LLM model file to bundle."""
    print_step("Checking for model file...")
    
    from backend.config import MODEL_NAME
    
    model_file = os.path.join("backend", MODEL_NAME)
    
    if os.path.exists(model_file):
        file_size = os.path.getsize(model_file) / (1024 * 1024)  # Size in MB
        print_step(f"Copying model file ({file_size:.1f} MB)... This may take a while...")
        
        dest = os.path.join(bundle_dir, MODEL_NAME)
        shutil.copy2(model_file, dest)
        print_success("Model file copied successfully")
    else:
        print_error("Model file not found!")
        print_warning("The application will not work without the model file.")
        print_warning("Please ensure the model file is downloaded using Git LFS:")
        print_warning("  git lfs install")
        print_warning("  git lfs pull")

def copy_llama_cli(bundle_dir):
    """Copy llama-cli executables to bundle."""
    print_step("Copying llama-cli executables...")
    
    llama_cli_dir = os.path.join("backend", "bin", "Release")
    
    if os.path.exists(llama_cli_dir):
        dest_dir = os.path.join(bundle_dir, "bin", "Release")
        os.makedirs(dest_dir, exist_ok=True)
        
        files_copied = 0
        for file in os.listdir(llama_cli_dir):
            if file.endswith(('.exe', '.dll')):
                src = os.path.join(llama_cli_dir, file)
                dest = os.path.join(dest_dir, file)
                shutil.copy2(src, dest)
                files_copied += 1
        
        if files_copied > 0:
            print_success(f"Copied {files_copied} llama-cli file(s)")
        else:
            print_warning("No llama-cli executables found")
    else:
        print_error("llama-cli directory not found!")
        print_warning("Please ensure llama-cli is built and located in backend/bin/Release/")

def install_python_dependencies(bundle_dir):
    """Install Python dependencies to bundle."""
    print_step("Installing Python dependencies...")
    
    requirements_file = "requirements.txt"
    
    if not os.path.exists(requirements_file):
        print_error("requirements.txt not found!")
        return False
    
    python_libs_dir = os.path.join(bundle_dir, "python_libs")
    os.makedirs(python_libs_dir, exist_ok=True)
    
    try:
        # Install dependencies
        subprocess.run([
            sys.executable, "-m", "pip", "install",
            "-r", requirements_file,
            "--target", python_libs_dir,
            "--upgrade"
        ], check=True, capture_output=True, text=True)
        
        # Also install for embedded Python if it exists
        embedded_python = os.path.join("python-embed", "python.exe")
        if os.path.exists(embedded_python):
            print_step("Installing dependencies for embedded Python...")
            subprocess.run([
                embedded_python, "-m", "pip", "install",
                "-r", requirements_file,
                "--target", python_libs_dir,
                "--upgrade"
            ], check=True, capture_output=True, text=True)
            print_success("Embedded Python dependencies installed")
        
        print_success("Python dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print_error("Failed to install Python dependencies")
        print_error(f"Error: {e.stderr}")
        return False

def create_startup_script(bundle_dir):
    """Create a startup script for the backend."""
    print_step("Creating startup script...")
    
    # Create Python startup script (for production)
    startup_script_py = os.path.join(bundle_dir, "start_backend.py")
    
    with open(startup_script_py, 'w', encoding='utf-8') as f:  # Add encoding='utf-8'
        f.write('import sys\n')
        f.write('import os\n')
        f.write('\n')
        f.write('# Get the directory where this script is located\n')
        f.write('script_dir = os.path.dirname(os.path.abspath(__file__))\n')
        f.write('\n')
        f.write('# Add both the script directory and python_libs to path\n')
        f.write('sys.path.insert(0, script_dir)  # For main.py and config.py\n')
        f.write('sys.path.insert(0, os.path.join(script_dir, "python_libs"))  # For dependencies\n')
        f.write('os.environ["PYTHONPATH"] = script_dir\n')
        f.write('\n')
        f.write('print("Starting backend server...")\n')
        f.write('print(f"Python: {sys.executable}")\n')
        f.write('print(f"Script dir: {script_dir}")\n')
        f.write('print(f"Working dir: {os.getcwd()}")\n')
        f.write('print(f"sys.path: {sys.path[:3]}")  # Show first 3 paths\n')
        f.write('\n')
        f.write('# Verify main.py exists\n')
        f.write('main_path = os.path.join(script_dir, "main.py")\n')
        f.write('if os.path.exists(main_path):\n')
        f.write('    print(f"[OK] Found main.py at: {main_path}")\n')  # Changed ✓ to [OK]
        f.write('else:\n')
        f.write('    print(f"[ERROR] main.py NOT FOUND at: {main_path}")\n')  # Changed ✗ to [ERROR]
        f.write('    print(f"Files in directory: {os.listdir(script_dir)}")\n')
        f.write('    sys.exit(1)\n')
        f.write('\n')
        f.write('try:\n')
        f.write('    import uvicorn\n')
        f.write('    print("[OK] Uvicorn imported successfully")\n')  # Changed ✓ to [OK]
        f.write('    from main import app\n')
        f.write('    print("[OK] Main app imported successfully")\n')  # Changed ✓ to [OK]
        f.write('    \n')
        f.write('    print("Starting Uvicorn server on http://127.0.0.1:8000")\n')
        f.write('    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")\n')
        f.write('except Exception as e:\n')
        f.write('    print(f"Error starting server: {e}")\n')
        f.write('    import traceback\n')
        f.write('    traceback.print_exc()\n')
        f.write('    sys.exit(1)\n')
    
    print_success("Python startup script created")
    
    # Also create BAT file for manual testing
    startup_script_bat = os.path.join(bundle_dir, "start_backend.bat")
    
    with open(startup_script_bat, 'w', encoding='utf-8') as f:  # Add encoding='utf-8'
        f.write('@echo off\n')
        f.write('echo Starting OLH AI Education Suite Backend...\n')
        f.write('set PYTHONPATH=%~dp0\n')
        f.write('python -m uvicorn main:app --host 127.0.0.1 --port 8000\n')
        f.write('pause\n')
    
    print_success("BAT startup script created")

def verify_bundle(bundle_dir):
    """Verify that the bundle is complete."""
    print_header("Verifying Bundle")
    
    critical_files = [
        "main.py",
        "config.py",
        MODEL_NAME,
        os.path.join("bin", "Release", "llama-cli.exe"),
        "python_libs"
    ]
    
    all_present = True
    for file in critical_files:
        file_path = os.path.join(bundle_dir, file)
        if os.path.exists(file_path):
            if os.path.isdir(file_path):
                print_success(f"Directory present: {file}/")
            else:
                size = os.path.getsize(file_path) / (1024 * 1024)
                print_success(f"File present: {file} ({size:.1f} MB)")
        else:
            print_error(f"Missing: {file}")
            all_present = False
    
    return all_present

def calculate_bundle_size(bundle_dir):
    """Calculate total size of the bundle."""
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(bundle_dir):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            if os.path.exists(filepath):
                total_size += os.path.getsize(filepath)
    
    return total_size / (1024 * 1024)  # Size in MB

def copy_python_embed(bundle_dir):
    """Copy embedded Python to bundle."""
    print_step("Copying embedded Python...")
    
    # Check if python-embed exists in backend folder
    python_embed_src = os.path.join("backend", "python-embed")
    
    if os.path.exists(python_embed_src):
        python_embed_dest = os.path.join(bundle_dir, "python-embed")
        shutil.copytree(python_embed_src, python_embed_dest)
        print_success("Embedded Python copied successfully")
    else:
        print_warning("python-embed not found in backend folder")
        print_warning("Please ensure python-embed is in the backend folder")

def main():
    """Main packaging function."""
    print_header("OLH AI Education Suite - Backend Packaging")
    
    bundle_dir = "backend-bundle"
    
    try:
        # Step 1: Clean and create bundle directory
        clean_bundle_directory(bundle_dir)
        
        # Step 2: Copy backend files
        copy_backend_files(bundle_dir)
        
        # Step 3: Copy model file
        copy_model_file(bundle_dir)
        
        # Step 4: Copy llama-cli
        copy_llama_cli(bundle_dir)
        
        # Step 4.5: Copy embedded Python
        copy_python_embed(bundle_dir)
        
        # Step 5: Install Python dependencies
        if not install_python_dependencies(bundle_dir):
            print_warning("Continuing despite dependency installation issues...")
        
        # Step 6: Create startup script
        create_startup_script(bundle_dir)
        
        # Step 7: Verify bundle
        if verify_bundle(bundle_dir):
            print_header("Backend Packaging Complete!")
            
            bundle_size = calculate_bundle_size(bundle_dir)
            print_success(f"Bundle size: {bundle_size:.1f} MB")
            print_success(f"Bundle location: {os.path.abspath(bundle_dir)}")
            
            print("\nNext steps:")
            print("  1. Run: npm run build:frontend")
            print("  2. Run: npm run electron:build:win")
            print("  3. Find installer in: dist/")
            
            return 0
        else:
            print_error("Bundle verification failed!")
            print_warning("Some critical files are missing.")
            return 1
            
    except Exception as e:
        print_error(f"Packaging failed with error: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())