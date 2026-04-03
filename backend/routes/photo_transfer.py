"""
Photo Transfer — Local WiFi photo upload from phone to PC.

Teachers scan a QR code displayed in the Electron app, which opens a
lightweight camera page in their phone browser.  Photos are POSTed over
the local network and saved to organised session folders.  The React
frontend receives real-time updates via Server-Sent Events (SSE).
"""

from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse, FileResponse
from typing import Optional
import asyncio
import json
import logging
import os
import re
import socket
import time
import uuid
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/photo-transfer", tags=["photo-transfer"])

# ── Storage ──────────────────────────────────────────────────────────────────

def _get_photos_dir() -> Path:
    """Return the root photos directory (inside APPDATA on Windows)."""
    if os.name == "nt":
        app_data = os.environ.get("APPDATA", os.path.expanduser("~"))
        base = Path(app_data) / "OECS Learning Hub" / "photo-transfer"
    else:
        base = Path.home() / ".olh_ai_education" / "photo-transfer"
    base.mkdir(parents=True, exist_ok=True)
    return base


# ── SSE (Server-Sent Events) ────────────────────────────────────────────────

_sse_subscribers: list[asyncio.Queue] = []


async def _broadcast(event: str, data: dict):
    """Push an SSE event to every connected React client."""
    payload = json.dumps(data, default=str)
    dead: list[asyncio.Queue] = []
    for q in _sse_subscribers:
        try:
            q.put_nowait((event, payload))
        except asyncio.QueueFull:
            dead.append(q)
    for q in dead:
        _sse_subscribers.remove(q)


@router.get("/stream")
async def photo_stream(request: Request):
    """SSE endpoint — React frontend connects here for live updates."""
    queue: asyncio.Queue = asyncio.Queue(maxsize=256)
    _sse_subscribers.append(queue)

    async def _generate():
        try:
            # Send initial heartbeat
            yield "event: connected\ndata: {}\n\n"
            while True:
                try:
                    event, payload = await asyncio.wait_for(queue.get(), timeout=15)
                    yield f"event: {event}\ndata: {payload}\n\n"
                except asyncio.TimeoutError:
                    # Keep-alive ping
                    yield ": ping\n\n"
                # Check if client disconnected
                if await request.is_disconnected():
                    break
        finally:
            if queue in _sse_subscribers:
                _sse_subscribers.remove(queue)

    return StreamingResponse(
        _generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ── Sessions ─────────────────────────────────────────────────────────────────

_sessions: dict[str, dict] = {}


@router.post("/sessions")
async def create_session(request: Request):
    """Create a new photo-capture session (class name + optional date)."""
    body = await request.json()
    class_name = body.get("class_name", "").strip() or "Unnamed Class"
    date_str = body.get("date", datetime.now().strftime("%Y-%m-%d"))
    session_id = str(uuid.uuid4())[:8]

    # Sanitise for folder name
    safe_class = re.sub(r'[^\w\s-]', '', class_name).strip().replace(' ', '_')
    folder_name = f"{safe_class}_{date_str}_{session_id}"

    session_dir = _get_photos_dir() / folder_name
    session_dir.mkdir(parents=True, exist_ok=True)

    session = {
        "id": session_id,
        "class_name": class_name,
        "date": date_str,
        "folder_name": folder_name,
        "folder_path": str(session_dir),
        "created_at": datetime.now().isoformat(),
        "photo_count": 0,
        "photos": [],
    }
    _sessions[session_id] = session
    logger.info(f"Photo session created: {folder_name}")

    await _broadcast("session_created", session)
    return session


@router.get("/sessions")
async def list_sessions():
    """Return all active sessions."""
    return list(_sessions.values())


@router.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """Return a single session with its photos."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(404, "Session not found")
    return session


# ── Upload ───────────────────────────────────────────────────────────────────

@router.post("/upload")
async def upload_photo(
    file: UploadFile = File(...),
    session_id: str = Form(...),
    student_name: str = Form(""),
):
    """Receive a photo from the phone PWA and save it to the session folder."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(404, "Session not found — start a session first")

    session_dir = Path(session["folder_path"])

    # Build filename
    idx = session["photo_count"] + 1
    safe_name = ""
    if student_name.strip():
        safe_name = re.sub(r'[^\w\s-]', '', student_name.strip()).replace(' ', '_') + "_"

    ext = Path(file.filename or "photo.jpg").suffix or ".jpg"
    filename = f"{safe_name}{idx:03d}{ext}"
    file_path = session_dir / filename

    # Save file
    contents = await file.read()
    file_path.write_bytes(contents)

    photo_entry = {
        "id": str(uuid.uuid4())[:8],
        "filename": filename,
        "student_name": student_name.strip(),
        "index": idx,
        "size_bytes": len(contents),
        "uploaded_at": datetime.now().isoformat(),
        "path": str(file_path),
    }

    session["photo_count"] = idx
    session["photos"].append(photo_entry)

    logger.info(f"Photo uploaded: {filename} ({len(contents)} bytes) → session {session_id}")

    # Broadcast to React frontend
    await _broadcast("photo_uploaded", {
        "session_id": session_id,
        "photo": photo_entry,
        "total_count": idx,
    })

    return {"ok": True, "photo": photo_entry, "total_count": idx}


# ── Serve photo images ──────────────────────────────────────────────────────

@router.get("/photos/{session_id}/{filename}")
async def serve_photo(session_id: str, filename: str):
    """Serve an uploaded photo image (used by React frontend grid)."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(404, "Session not found")
    file_path = Path(session["folder_path"]) / filename
    if not file_path.exists():
        raise HTTPException(404, "Photo not found")
    return FileResponse(file_path)


# ── PDF Export ───────────────────────────────────────────────────────────────

@router.get("/export-pdf/{session_id}")
async def export_pdf(session_id: str):
    """Generate a PDF with one photo per page for the session."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(404, "Session not found")

    if not session["photos"]:
        raise HTTPException(400, "No photos in this session")

    try:
        from PIL import Image
        import io

        # A4 dimensions in points (72 dpi)
        A4_W, A4_H = 595.28, 841.89

        # We'll build a simple PDF manually (minimal spec) to avoid extra deps
        # Actually, let's use Pillow to create image pages and concatenate
        pages: list[Image.Image] = []
        for photo in session["photos"]:
            fpath = Path(photo["path"])
            if fpath.exists():
                img = Image.open(fpath)
                # Convert to RGB if needed
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                pages.append(img)

        if not pages:
            raise HTTPException(400, "No valid photos found")

        # Save as multi-page PDF using Pillow
        pdf_buffer = io.BytesIO()
        pages[0].save(
            pdf_buffer,
            format="PDF",
            save_all=True,
            append_images=pages[1:] if len(pages) > 1 else [],
            resolution=150,
        )
        pdf_buffer.seek(0)

        safe_class = session["class_name"].replace(" ", "_")
        pdf_name = f"{safe_class}_{session['date']}.pdf"

        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{pdf_name}"'},
        )
    except ImportError:
        raise HTTPException(500, "Pillow not available for PDF export")


# ── Network info ─────────────────────────────────────────────────────────────

def get_local_ip() -> str:
    """Detect the local network IP address of this machine."""
    try:
        # Connect to a non-routable address to find the preferred local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.5)
        s.connect(("10.254.254.254", 1))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def _get_all_local_ips() -> list[str]:
    """Return all non-loopback IPv4 addresses on this machine."""
    import socket as _sock
    ips = []
    try:
        for info in _sock.getaddrinfo(_sock.gethostname(), None, _sock.AF_INET):
            ip = info[4][0]
            if not ip.startswith("127."):
                ips.append(ip)
    except Exception:
        pass
    # Also try the UDP trick
    primary = get_local_ip()
    if primary != "127.0.0.1" and primary not in ips:
        ips.insert(0, primary)
    return ips or ["127.0.0.1"]


# ── SSL cert state ───────────────────────────────────────────────────────────
_ssl_enabled = False
_ssl_port: int | None = None


def get_ssl_status() -> dict:
    return {"enabled": _ssl_enabled, "port": _ssl_port}


def set_ssl_status(enabled: bool, port: int | None = None):
    global _ssl_enabled, _ssl_port
    _ssl_enabled = enabled
    _ssl_port = port


@router.get("/network-info")
async def network_info():
    """Return the local IP and port for QR code generation."""
    ip = get_local_ip()
    all_ips = _get_all_local_ips()
    ssl = get_ssl_status()

    # Always use HTTP as primary — <input type="file" capture> works over HTTP
    # on local network. HTTPS with self-signed certs shows scary warnings.
    phone_url = f"http://{ip}:8000/phone"

    return {
        "ip": ip,
        "all_ips": all_ips,
        "port": 8000,
        "ssl_port": ssl["port"],
        "ssl_enabled": ssl["enabled"],
        "phone_url": phone_url,
        "phone_url_http": f"http://{ip}:8000/phone",
        "phone_url_https": f"https://{ip}:{ssl['port']}/phone" if ssl["enabled"] else None,
    }


# ── Delete photo ─────────────────────────────────────────────────────────────

@router.delete("/photos/{session_id}/{photo_id}")
async def delete_photo(session_id: str, photo_id: str):
    """Delete a photo from a session (retake flow)."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(404, "Session not found")

    photo = next((p for p in session["photos"] if p["id"] == photo_id), None)
    if not photo:
        raise HTTPException(404, "Photo not found")

    # Remove file
    fpath = Path(photo["path"])
    if fpath.exists():
        fpath.unlink()

    session["photos"].remove(photo)

    await _broadcast("photo_deleted", {
        "session_id": session_id,
        "photo_id": photo_id,
    })

    return {"ok": True}


# ── HTTPS management ─────────────────────────────────────────────────────────

@router.post("/enable-https")
async def enable_https():
    """Generate a self-signed cert and start the HTTPS server for iOS support."""
    try:
        import photo_transfer_ssl
        ok = photo_transfer_ssl.start_https_server()
        if ok:
            return {"ok": True, "port": photo_transfer_ssl.HTTPS_PORT}
        return JSONResponse(status_code=500, content={"ok": False, "error": "Could not start HTTPS"})
    except Exception as e:
        logger.error(f"Failed to enable HTTPS: {e}")
        return JSONResponse(status_code=500, content={"ok": False, "error": str(e)})


# ── Hotspot management (Windows) ─────────────────────────────────────────────

@router.post("/hotspot/start")
async def start_hotspot(request: Request):
    """Start Windows Mobile Hotspot via netsh."""
    body = await request.json()
    ssid = body.get("ssid", "OECS-PhotoTransfer")
    password = body.get("password", "oecs1234")

    if os.name != "nt":
        return JSONResponse(status_code=400, content={"ok": False, "error": "Hotspot only supported on Windows"})

    try:
        import subprocess

        # Configure the hosted network
        subprocess.run(
            ["netsh", "wlan", "set", "hostednetwork",
             "mode=allow", f"ssid={ssid}", f"key={password}"],
            capture_output=True, text=True, check=True,
        )

        # Start it
        result = subprocess.run(
            ["netsh", "wlan", "start", "hostednetwork"],
            capture_output=True, text=True,
        )

        if result.returncode != 0:
            # Fallback: try Windows Mobile Hotspot via PowerShell
            ps_start = subprocess.run(
                ["powershell", "-Command",
                 "[Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager,"
                 "Windows.Networking.NetworkOperators,ContentType=WindowsRuntime];"
                 "$tm = [Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager]::CreateFromConnectionProfile("
                 "[Windows.Networking.Connectivity.NetworkInformation,Windows.Networking.Connectivity,ContentType=WindowsRuntime]"
                 "::GetInternetConnectionProfile());"
                 "$tm.StartTetheringAsync().GetResults()"],
                capture_output=True, text=True, timeout=15,
            )
            if "Successful" not in ps_start.stdout and ps_start.returncode != 0:
                return JSONResponse(status_code=500, content={
                    "ok": False,
                    "error": "Could not start hotspot. Try enabling Mobile Hotspot in Windows Settings manually.",
                    "detail": result.stderr or ps_start.stderr,
                })

        # Wait a moment then detect the new IP
        import time
        time.sleep(2)
        ip = get_local_ip()

        logger.info(f"Hotspot started — SSID: {ssid}, IP: {ip}")
        return {
            "ok": True,
            "ssid": ssid,
            "password": password,
            "ip": ip,
            "phone_url": f"http://{ip}:8000/phone",
        }
    except subprocess.TimeoutExpired:
        return JSONResponse(status_code=500, content={"ok": False, "error": "Hotspot start timed out"})
    except Exception as e:
        logger.error(f"Hotspot start failed: {e}")
        return JSONResponse(status_code=500, content={"ok": False, "error": str(e)})


@router.post("/hotspot/stop")
async def stop_hotspot():
    """Stop Windows Mobile Hotspot."""
    if os.name != "nt":
        return {"ok": True}

    try:
        import subprocess

        result = subprocess.run(
            ["netsh", "wlan", "stop", "hostednetwork"],
            capture_output=True, text=True,
        )

        if result.returncode != 0:
            # Try PowerShell approach
            subprocess.run(
                ["powershell", "-Command",
                 "[Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager,"
                 "Windows.Networking.NetworkOperators,ContentType=WindowsRuntime];"
                 "$tm = [Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager]::CreateFromConnectionProfile("
                 "[Windows.Networking.Connectivity.NetworkInformation,Windows.Networking.Connectivity,ContentType=WindowsRuntime]"
                 "::GetInternetConnectionProfile());"
                 "$tm.StopTetheringAsync().GetResults()"],
                capture_output=True, text=True, timeout=15,
            )

        logger.info("Hotspot stopped")
        return {"ok": True}
    except Exception as e:
        logger.error(f"Hotspot stop failed: {e}")
        return JSONResponse(status_code=500, content={"ok": False, "error": str(e)})


@router.get("/hotspot/status")
async def hotspot_status():
    """Check if a Windows hotspot is currently active."""
    if os.name != "nt":
        return {"active": False, "supported": False}

    try:
        import subprocess
        result = subprocess.run(
            ["netsh", "wlan", "show", "hostednetwork"],
            capture_output=True, text=True, timeout=5,
        )
        active = "Started" in result.stdout
        return {"active": active, "supported": True, "detail": result.stdout}
    except Exception:
        return {"active": False, "supported": True}
