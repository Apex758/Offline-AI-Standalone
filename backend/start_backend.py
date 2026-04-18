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
        if hasattr(os, "add_dll_directory"):
            os.add_dll_directory(gtk_bin)
        os.environ["PATH"] = gtk_bin + os.pathsep + os.environ.get("PATH", "")
        os.environ.setdefault("GTK_BASEPATH", script_dir)
        os.environ.setdefault("GTK_DATA_PREFIX", script_dir)

print("Starting backend server...")
print(f"Python: {sys.executable}")
print(f"Backend dir: {script_dir}")

# Lower backend priority so UI (Electron) preempts during generation.
# BELOW_NORMAL on Windows, nice=10 on POSIX. Safe no-op if psutil missing.
try:
    import psutil
    proc = psutil.Process(os.getpid())
    if sys.platform == "win32":
        proc.nice(psutil.BELOW_NORMAL_PRIORITY_CLASS)
    else:
        proc.nice(10)
    print(f"Backend priority lowered: {proc.nice()}")
except Exception as e:
    print(f"Priority adjust skipped: {e}")

try:
    import uvicorn
    from main import app
    extra_kwargs = {}
    if sys.platform != "win32":
        extra_kwargs["loop"] = "uvloop"
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info",
                http="httptools", **extra_kwargs)
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    input("Press Enter to exit...")
    sys.exit(1)
