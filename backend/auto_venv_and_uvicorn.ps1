# auto_venv_and_uvicorn.ps1
# Place this in your backend directory

# ============================================
# DEFAULT: Only activate venv
# ============================================
Start-Backend

# ============================================
# OPTIONAL: Uncomment to auto-start Uvicorn
# ============================================
# Start-Backend -StartUvicorn

# ============================================
# CUSTOM: Uncomment and modify as needed
# ============================================
# Start-Backend -StartUvicorn -Port 8080
# Start-Backend -StartUvicorn -Port 8000 -AppModule "api.main:app"