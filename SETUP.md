# Complete Guide: React.js + Python to Executable Package

## **Prerequisites**
- Node.js and npm installed
- Python 3.9+ installed
- Git LFS installed (for large model files)

---

## **Step-by-Step Packaging Process**

### **Step 1: Prepare Backend**
Package your Python backend with all dependencies:

```powershell
python build-scripts/package-backend.py
```

This creates a `backend-bundle` folder with:
- Python scripts
- LLM model file
- llama-cli executables
- Python dependencies

### **Step 2: Build Frontend**
Build your React frontend for production:

```powershell
npm run build:frontend
```

This creates optimized files in `frontend/dist`

### **Step 3: Build Electron Package**
Create the Windows installer:

```powershell
npm run electron:build:win
```

Or for portable version:
```powershell
npm run electron:build:portable
```

### **Step 4: Find Your Installer**
The executable will be in:
```
dist-electron/OLH AI Education Suite Setup 1.0.0.exe
```

---

## **Quick Command (PowerShell)**
```powershell
python build-scripts/package-backend.py ; npm run electron:build:win
```

---

## **What Gets Packaged**
✅ React frontend (HTML/CSS/JS)  
✅ Python backend + dependencies  
✅ LLM model (900MB+)  
✅ llama-cli executable  
✅ Electron wrapper  
✅ All required DLLs  

---

## **Project Structure Overview**

```
Your Project/
├── frontend/              # React app
│   ├── src/
│   └── dist/             # Built files (after npm run build:frontend)
├── backend/              # Python FastAPI
│   ├── main.py
│   ├── llama model.gguf
│   └── bin/Release/      # llama-cli.exe
├── backend-bundle/       # Packaged backend (after Step 1)
├── electron/             # Electron main process
│   ├── main.js
│   └── preload.js
├── build-scripts/        # Packaging scripts
└── dist-electron/        # Final installer (after Step 3)
```

---

## **Testing Before Packaging**

Test everything works first:

```powershell
# Terminal 1: Start backend
cd backend
python -m uvicorn main:app --reload

# Terminal 2: Start frontend
cd frontend
npm run dev

# Terminal 3: Start Electron (optional)
npm run electron:dev
```

---

## **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| Model file missing | Run `git lfs pull` |
| Python not found | Add Python to PATH |
| llama-cli.exe missing | Build llama.cpp or download binary |
| Build fails | Delete `node_modules`, run `npm install` |
| Large file size | Normal - includes 900MB model |

---

## **Distribution**

Once packaged, you get a **single installer** that:
- ✅ Installs everything automatically
- ✅ Creates desktop shortcut
- ✅ Runs completely offline
- ✅ No Python/Node.js required on target machine
- ✅ Works on any Windows 10/11 PC

**File size**: ~1-1.5 GB (includes everything)

---

## **Version Updates**

To create a new version:
1. Update `version` in `package.json`
2. Run packaging steps again
3. New installer will have updated version number

That's it! 🎉