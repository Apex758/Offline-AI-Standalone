@echo off
REM Rebuild stable-diffusion-cpp-python from git main branch (PyPI 0.4.6
REM sdist ships broken — libwebm submodule missing). Vulkan backend.

call "C:\Program Files (x86)\Microsoft Visual Studio\18\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
if errorlevel 1 exit /b 1
cd /d "C:\Users\LG\Desktop\Projects\Offline AI Standalone\backend"
call venv\Scripts\activate.bat
set CMAKE_ARGS=-DSD_VULKAN=ON
set FORCE_CMAKE=1
pip uninstall -y stable-diffusion-cpp-python
pip install git+https://github.com/william-murray1204/stable-diffusion-cpp-python.git --no-cache-dir --verbose
