@echo off
REM Rebuild stable-diffusion-cpp-python as a pure CPU build (no Vulkan).
REM Use this on machines with no discrete GPU — Intel Iris Xe via Vulkan is
REM slower than CPU for SDXL-class diffusion. Takes ~5-10 min to compile.
REM Backend must be stopped before running (DLLs are locked while loaded).

call "C:\Program Files (x86)\Microsoft Visual Studio\18\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
if errorlevel 1 exit /b 1
cd /d "C:\Users\LG\Desktop\Projects\Offline AI Standalone\backend"
call venv\Scripts\activate.bat

REM Clear any previous CMAKE_ARGS from env (prev Vulkan build)
set CMAKE_ARGS=
set FORCE_CMAKE=1

pip uninstall -y stable-diffusion-cpp-python
pip install stable-diffusion-cpp-python==0.4.6 --no-cache-dir --verbose
