import os
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
python_libs = os.path.join(script_dir, 'python_libs')
sys.path.insert(0, python_libs)
sys.path.insert(0, script_dir)

#  CRITICAL: Force Python to use bundled GTK DLLs BEFORE imports
if sys.platform == "win32":
    gtk_bin = os.path.join(script_dir, "bin")
    if os.path.isdir(gtk_bin):
        # Set WeasyPrint DLL directory FIRST to override system paths
        os.environ["WEASYPRINT_DLL_DIRECTORIES"] = gtk_bin
        
        if hasattr(os, "add_dll_directory"):
            os.add_dll_directory(gtk_bin)
        
        # Prepend to PATH to ensure bundled DLLs are found first
        os.environ["PATH"] = gtk_bin + os.pathsep + os.environ.get("PATH", "")
        os.environ.setdefault("GTK_BASEPATH", script_dir)
        os.environ.setdefault("GTK_DATA_PREFIX", script_dir)

print("Starting backend server...")
print(f"Python: {sys.executable}")
print(f"Backend dir: {script_dir}")

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
