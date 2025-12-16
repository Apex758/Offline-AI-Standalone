import asyncio
import time
from typing import Optional, Dict, Any

# Hard limit for "simultaneous"
# You can tune later, but keep low.
_SIMULTANEOUS_LIMIT = 2

_queue_lock = asyncio.Lock()
_parallel_sem = asyncio.Semaphore(_SIMULTANEOUS_LIMIT)

async def acquire_generation_slot(
    websocket,
    mode: str,
    job_id: str,
) -> str:
    """
    Returns "queued" or "started".
    Sends websocket status messages while waiting.
    """
    mode = (mode or "queued").lower()

    if mode == "simultaneous":
        # Wait for a semaphore permit, send heartbeats while waiting
        start = time.time()
        sent_queued = False
        while True:
            if _parallel_sem.locked():
                # Non-blocking check is awkward; we just try acquire with timeout.
                pass
            try:
                await asyncio.wait_for(_parallel_sem.acquire(), timeout=0.25)
                break
            except asyncio.TimeoutError:
                if not sent_queued:
                    await websocket.send_json({"type": "status", "status": "queued", "jobId": job_id})
                    sent_queued = True
                await websocket.send_json({
                    "type": "heartbeat",
                    "jobId": job_id,
                    "waiting": True,
                    "secondsWaiting": int(time.time() - start),
                })
                await asyncio.sleep(0)

        await websocket.send_json({"type": "status", "status": "started", "jobId": job_id})
        return "simultaneous"

    # Default: queued
    start = time.time()
    sent_queued = False
    while True:
        if _queue_lock.locked():
            if not sent_queued:
                await websocket.send_json({"type": "status", "status": "queued", "jobId": job_id})
                sent_queued = True
            await websocket.send_json({
                "type": "heartbeat",
                "jobId": job_id,
                "waiting": True,
                "secondsWaiting": int(time.time() - start),
            })
            await asyncio.sleep(0)
            await asyncio.sleep(0.25)
            continue

        await _queue_lock.acquire()
        break

    await websocket.send_json({"type": "status", "status": "started", "jobId": job_id})
    return "queued"

def release_generation_slot(mode: str):
    mode = (mode or "queued").lower()
    if mode == "simultaneous":
        _parallel_sem.release()
        return
    if _queue_lock.locked():
        _queue_lock.release()
