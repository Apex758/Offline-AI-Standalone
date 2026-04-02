"""
Metrics Service — Tracks AI model performance for benchmarking and documentation.

Records per-generation metrics (tokens/sec, latency, resource usage) in SQLite.
Provides aggregation and export for performance documentation.
"""

import sqlite3
import json
import logging
import time
import platform
import os
import subprocess
from datetime import datetime
from typing import Optional, Dict, Any, List
from pathlib import Path

logger = logging.getLogger(__name__)


def _get_db_path() -> Path:
    if os.name == 'nt':
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Learning Hub' / 'data'
    else:
        data_dir = Path.home() / '.olh_ai_education' / 'data'
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir / 'metrics.db'


def _get_cpu_name() -> str:
    """Get the actual CPU brand name on Windows."""
    try:
        if platform.system() == "Windows":
            import subprocess
            result = subprocess.run(
                ["wmic", "cpu", "get", "Name"],
                capture_output=True, text=True, timeout=5,
                creationflags=0x08000000,  # CREATE_NO_WINDOW
            )
            lines = [l.strip() for l in result.stdout.strip().splitlines() if l.strip() and l.strip() != "Name"]
            if lines:
                return lines[0]
    except Exception:
        pass
    return platform.processor()


def _get_os_name() -> str:
    """Get proper OS name (e.g. Windows 11 instead of Windows 10)."""
    try:
        if platform.system() == "Windows":
            ver = platform.version()  # e.g. "10.0.22631" or "10.0.26200"
            build = int(ver.split(".")[-1]) if ver else 0
            # Windows 11 starts at build 22000
            win_ver = "11" if build >= 22000 else "10"
            return f"Windows {win_ver}"
    except Exception:
        pass
    return f"{platform.system()} {platform.release()}"


def _detect_gpu() -> Optional[Dict[str, Any]]:
    """Detect NVIDIA GPU via nvidia-smi. Returns None if no GPU found."""
    try:
        flags = 0x08000000 if os.name == "nt" else 0  # CREATE_NO_WINDOW on Windows
        result = subprocess.run(
            [
                "nvidia-smi",
                "--query-gpu=name,memory.total,driver_version,gpu_uuid",
                "--format=csv,noheader,nounits",
            ],
            capture_output=True, text=True, timeout=5,
            creationflags=flags,
        )
        if result.returncode == 0 and result.stdout.strip():
            line = result.stdout.strip().splitlines()[0]
            parts = [p.strip() for p in line.split(",")]
            if len(parts) >= 3:
                return {
                    "name": parts[0],
                    "vram_total_mb": int(float(parts[1])),
                    "driver_version": parts[2],
                }
    except (FileNotFoundError, subprocess.TimeoutExpired, Exception):
        pass
    return None


def _get_gpu_live_stats() -> Optional[Dict[str, Any]]:
    """Get real-time GPU utilization and VRAM usage via nvidia-smi."""
    try:
        flags = 0x08000000 if os.name == "nt" else 0
        result = subprocess.run(
            [
                "nvidia-smi",
                "--query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu,power.draw",
                "--format=csv,noheader,nounits",
            ],
            capture_output=True, text=True, timeout=5,
            creationflags=flags,
        )
        if result.returncode == 0 and result.stdout.strip():
            line = result.stdout.strip().splitlines()[0]
            parts = [p.strip() for p in line.split(",")]
            if len(parts) >= 4:
                stats: Dict[str, Any] = {
                    "gpu_utilization": float(parts[0]),
                    "vram_used_mb": int(float(parts[1])),
                    "vram_total_mb": int(float(parts[2])),
                    "vram_percent": round(float(parts[1]) / float(parts[2]) * 100, 1) if float(parts[2]) > 0 else 0,
                    "temperature_c": int(float(parts[3])),
                }
                # power.draw may return [N/A] on some GPUs
                if len(parts) >= 5:
                    try:
                        stats["power_watts"] = round(float(parts[4]), 1)
                    except (ValueError, TypeError):
                        stats["power_watts"] = None
                return stats
    except (FileNotFoundError, subprocess.TimeoutExpired, Exception):
        pass
    return None


def _get_system_specs() -> Dict[str, Any]:
    """Collect system hardware/software specs (cached after first call)."""
    specs = {
        "os": _get_os_name(),
        "os_version": platform.version(),
        "architecture": platform.machine(),
        "processor": _get_cpu_name(),
        "python_version": platform.python_version(),
        "cpu_count_logical": os.cpu_count(),
    }

    try:
        import psutil
        mem = psutil.virtual_memory()
        specs["ram_total_gb"] = round(mem.total / (1024 ** 3), 2)
        specs["ram_available_gb"] = round(mem.available / (1024 ** 3), 2)
    except ImportError:
        pass

    # GPU detection (graceful — None if no NVIDIA GPU)
    gpu = _detect_gpu()
    if gpu:
        specs["gpu_name"] = gpu["name"]
        specs["gpu_vram_total_mb"] = gpu["vram_total_mb"]
        specs["gpu_driver_version"] = gpu["driver_version"]
    specs["has_gpu"] = gpu is not None

    return specs


class MetricsCollector:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self.db_path = str(_get_db_path())
        self._init_db()
        self._system_specs = _get_system_specs()
        self._initialized = True
        # Prime psutil CPU counters so the first real call returns non-zero
        try:
            import psutil
            psutil.cpu_percent(interval=None)
            psutil.Process(os.getpid()).cpu_percent(interval=None)
        except Exception:
            pass
        logger.info(f"MetricsCollector initialized, db: {self.db_path}")

    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute("PRAGMA journal_mode=WAL")
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS inference_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                model_name TEXT NOT NULL,
                task_type TEXT NOT NULL,
                prompt_tokens INTEGER DEFAULT 0,
                completion_tokens INTEGER DEFAULT 0,
                total_tokens INTEGER DEFAULT 0,
                ttft_ms REAL DEFAULT 0,
                total_time_ms REAL DEFAULT 0,
                tokens_per_second REAL DEFAULT 0,
                cpu_percent REAL DEFAULT 0,
                ram_usage_mb REAL DEFAULT 0,
                extra_data TEXT DEFAULT '{}'
            );

            CREATE TABLE IF NOT EXISTS image_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                model_name TEXT NOT NULL,
                backend TEXT NOT NULL,
                width INTEGER DEFAULT 0,
                height INTEGER DEFAULT 0,
                steps INTEGER DEFAULT 0,
                total_time_ms REAL DEFAULT 0,
                steps_per_second REAL DEFAULT 0,
                cpu_percent REAL DEFAULT 0,
                ram_usage_mb REAL DEFAULT 0,
                extra_data TEXT DEFAULT '{}'
            );
        """)
        conn.close()

    def get_system_specs(self) -> Dict[str, Any]:
        try:
            import psutil
            mem = psutil.virtual_memory()
            self._system_specs["ram_available_gb"] = round(mem.available / (1024 ** 3), 2)
        except ImportError:
            pass
        return self._system_specs

    def get_live_stats(self) -> Dict[str, Any]:
        """Get real-time system resource usage. Called by polling endpoint."""
        stats: Dict[str, Any] = {
            "cpu_percent_system": 0.0,
            "cpu_percent_per_core": [],
            "ram_total_gb": 0.0,
            "ram_used_gb": 0.0,
            "ram_available_gb": 0.0,
            "ram_percent": 0.0,
            "app_cpu_percent": 0.0,
            "app_ram_mb": 0.0,
            "gpu": None,
        }
        try:
            import psutil
            # System-wide
            stats["cpu_percent_system"] = psutil.cpu_percent(interval=None)
            stats["cpu_percent_per_core"] = psutil.cpu_percent(interval=None, percpu=True)
            mem = psutil.virtual_memory()
            stats["ram_total_gb"] = round(mem.total / (1024 ** 3), 2)
            stats["ram_used_gb"] = round(mem.used / (1024 ** 3), 2)
            stats["ram_available_gb"] = round(mem.available / (1024 ** 3), 2)
            stats["ram_percent"] = mem.percent
            # App process
            proc = psutil.Process(os.getpid())
            stats["app_cpu_percent"] = proc.cpu_percent(interval=None)
            stats["app_ram_mb"] = round(proc.memory_info().rss / (1024 * 1024), 2)
        except ImportError:
            pass
        # GPU stats (None if no NVIDIA GPU detected)
        if self._system_specs.get("has_gpu"):
            stats["gpu"] = _get_gpu_live_stats()
        return stats

    def _get_resource_snapshot(self) -> Dict[str, float]:
        """Quick CPU + RAM snapshot."""
        snapshot = {"cpu_percent": 0.0, "ram_usage_mb": 0.0}
        try:
            import psutil
            proc = psutil.Process(os.getpid())
            snapshot["cpu_percent"] = proc.cpu_percent(interval=None)
            snapshot["ram_usage_mb"] = round(proc.memory_info().rss / (1024 * 1024), 2)
        except ImportError:
            pass
        return snapshot

    def record_inference(
        self,
        model_name: str,
        task_type: str,
        prompt_tokens: int = 0,
        completion_tokens: int = 0,
        ttft_ms: float = 0,
        total_time_ms: float = 0,
        extra_data: Optional[Dict] = None,
        cpu_percent: Optional[float] = None,
        ram_usage_mb: Optional[float] = None,
    ):
        """Record a text generation metric."""
        tps = 0.0
        if total_time_ms > 0 and completion_tokens > 0:
            tps = round(completion_tokens / (total_time_ms / 1000), 2)

        # Use caller-supplied snapshot if available, otherwise take one now
        if cpu_percent is not None and ram_usage_mb is not None:
            resources = {"cpu_percent": cpu_percent, "ram_usage_mb": ram_usage_mb}
        else:
            resources = self._get_resource_snapshot()

        try:
            conn = sqlite3.connect(self.db_path)
            conn.execute(
                """INSERT INTO inference_metrics
                   (timestamp, model_name, task_type, prompt_tokens, completion_tokens,
                    total_tokens, ttft_ms, total_time_ms, tokens_per_second,
                    cpu_percent, ram_usage_mb, extra_data)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    datetime.utcnow().isoformat(),
                    model_name,
                    task_type,
                    prompt_tokens,
                    completion_tokens,
                    prompt_tokens + completion_tokens,
                    round(ttft_ms, 2),
                    round(total_time_ms, 2),
                    tps,
                    resources["cpu_percent"],
                    resources["ram_usage_mb"],
                    json.dumps(extra_data or {}),
                ),
            )
            conn.commit()
            conn.close()
            logger.debug(f"Recorded inference metric: {task_type} {tps:.1f} tok/s")
        except Exception as e:
            logger.error(f"Failed to record inference metric: {e}")

    def record_image_generation(
        self,
        model_name: str,
        backend: str,
        width: int,
        height: int,
        steps: int,
        total_time_ms: float,
        extra_data: Optional[Dict] = None,
        cpu_percent: Optional[float] = None,
        ram_usage_mb: Optional[float] = None,
    ):
        """Record an image generation metric."""
        sps = 0.0
        if total_time_ms > 0 and steps > 0:
            sps = round(steps / (total_time_ms / 1000), 2)

        # Use caller-supplied snapshot if available, otherwise take one now
        if cpu_percent is not None and ram_usage_mb is not None:
            resources = {"cpu_percent": cpu_percent, "ram_usage_mb": ram_usage_mb}
        else:
            resources = self._get_resource_snapshot()

        try:
            conn = sqlite3.connect(self.db_path)
            conn.execute(
                """INSERT INTO image_metrics
                   (timestamp, model_name, backend, width, height, steps,
                    total_time_ms, steps_per_second, cpu_percent, ram_usage_mb, extra_data)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    datetime.utcnow().isoformat(),
                    model_name,
                    backend,
                    width,
                    height,
                    steps,
                    round(total_time_ms, 2),
                    sps,
                    resources["cpu_percent"],
                    resources["ram_usage_mb"],
                    json.dumps(extra_data or {}),
                ),
            )
            conn.commit()
            conn.close()
            logger.debug(f"Recorded image metric: {model_name} {sps:.2f} steps/s")
        except Exception as e:
            logger.error(f"Failed to record image metric: {e}")

    def get_inference_history(self, limit: int = 100, task_type: Optional[str] = None) -> List[Dict]:
        """Get recent inference metrics."""
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            if task_type:
                rows = conn.execute(
                    "SELECT * FROM inference_metrics WHERE task_type = ? ORDER BY id DESC LIMIT ?",
                    (task_type, limit),
                ).fetchall()
            else:
                rows = conn.execute(
                    "SELECT * FROM inference_metrics ORDER BY id DESC LIMIT ?",
                    (limit,),
                ).fetchall()
            conn.close()
            return [dict(r) for r in rows]
        except Exception as e:
            logger.error(f"Failed to get inference history: {e}")
            return []

    def get_image_history(self, limit: int = 100) -> List[Dict]:
        """Get recent image generation metrics."""
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                "SELECT * FROM image_metrics ORDER BY id DESC LIMIT ?",
                (limit,),
            ).fetchall()
            conn.close()
            return [dict(r) for r in rows]
        except Exception as e:
            logger.error(f"Failed to get image history: {e}")
            return []

    def get_summary(self) -> Dict[str, Any]:
        """Get aggregated performance summary."""
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row

            # Text generation summary per model
            # Only include ttft_ms > 0 in the average (non-streaming records store 0)
            text_rows = conn.execute("""
                SELECT
                    model_name,
                    task_type,
                    COUNT(*) as count,
                    ROUND(AVG(tokens_per_second), 2) as avg_tps,
                    ROUND(MIN(tokens_per_second), 2) as min_tps,
                    ROUND(MAX(tokens_per_second), 2) as max_tps,
                    ROUND(AVG(CASE WHEN ttft_ms > 0 THEN ttft_ms END), 0) as avg_ttft_ms,
                    ROUND(AVG(total_time_ms), 0) as avg_total_ms,
                    ROUND(AVG(completion_tokens), 0) as avg_completion_tokens,
                    ROUND(AVG(ram_usage_mb), 0) as avg_ram_mb
                FROM inference_metrics
                GROUP BY model_name, task_type
                ORDER BY model_name, count DESC
            """).fetchall()

            # Image generation summary per model
            image_rows = conn.execute("""
                SELECT
                    model_name,
                    backend,
                    COUNT(*) as count,
                    ROUND(AVG(total_time_ms), 0) as avg_total_ms,
                    ROUND(MIN(total_time_ms), 0) as min_total_ms,
                    ROUND(MAX(total_time_ms), 0) as max_total_ms,
                    ROUND(AVG(steps_per_second), 2) as avg_sps,
                    ROUND(AVG(ram_usage_mb), 0) as avg_ram_mb
                FROM image_metrics
                GROUP BY model_name, backend
                ORDER BY count DESC
            """).fetchall()

            # Total counts
            total_text = conn.execute("SELECT COUNT(*) FROM inference_metrics").fetchone()[0]
            total_image = conn.execute("SELECT COUNT(*) FROM image_metrics").fetchone()[0]

            conn.close()

            return {
                "total_text_generations": total_text,
                "total_image_generations": total_image,
                "text_summary": [dict(r) for r in text_rows],
                "image_summary": [dict(r) for r in image_rows],
                "system_specs": self.get_system_specs(),
            }
        except Exception as e:
            logger.error(f"Failed to get summary: {e}")
            return {
                "total_text_generations": 0,
                "total_image_generations": 0,
                "text_summary": [],
                "image_summary": [],
                "system_specs": self.get_system_specs(),
            }

    def export_report(self) -> Dict[str, Any]:
        """Export a full performance report for documentation."""
        summary = self.get_summary()
        recent_text = self.get_inference_history(limit=50)
        recent_images = self.get_image_history(limit=50)

        return {
            "report_generated": datetime.utcnow().isoformat(),
            "system_specs": self.get_system_specs(),
            "summary": summary,
            "recent_text_generations": recent_text,
            "recent_image_generations": recent_images,
        }

    def clear_metrics(self):
        """Clear all metrics data."""
        try:
            conn = sqlite3.connect(self.db_path)
            conn.execute("DELETE FROM inference_metrics")
            conn.execute("DELETE FROM image_metrics")
            conn.commit()
            conn.close()
            logger.info("All metrics cleared")
        except Exception as e:
            logger.error(f"Failed to clear metrics: {e}")


def get_metrics_collector() -> MetricsCollector:
    return MetricsCollector()
