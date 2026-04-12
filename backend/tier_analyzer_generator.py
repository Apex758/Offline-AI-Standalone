"""
Generates the OLH Tier Analyzer — a standalone executable teachers can run
on any PC to get a tier recommendation for the OECS Teacher Assistant.

build_analyzer() → tries PyInstaller first (produces .exe with OECS icon),
                   falls back to returning the raw .py script bytes.
"""

import os
import sys
import asyncio
import shutil
import subprocess
import tempfile
import textwrap
import logging
import importlib.util
from pathlib import Path

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent
ICON_PATH = BASE_DIR.parent / "build" / "OECS.ico"

# ---------------------------------------------------------------------------
# Standalone script template  (tkinter GUI, zero non-stdlib dependency)
# ---------------------------------------------------------------------------

SCRIPT_TEMPLATE = textwrap.dedent(r'''
import sys
import os
import platform
import subprocess
import tkinter as tk
from tkinter import ttk, font as tkfont

# ── Tier requirements ────────────────────────────────────────────────────────
TIER_REQUIREMENTS = {
    1: {
        "name": "Essentials",
        "description": "AI lesson planning, quizzes & worksheets",
        "ram_gb": 4,
        "cpu_cores": 4,
        "gpu_vram_gb": 0,
        "disk_free_gb": 5,
        "models": "Qwen 3.5 2B · Phi 4 Mini",
    },
    2: {
        "name": "Vision",
        "description": "Scan grading, image understanding & handwriting recognition",
        "ram_gb": 8,
        "cpu_cores": 6,
        "gpu_vram_gb": 0,
        "disk_free_gb": 8,
        "models": "Gemma 4 Vision 2B",
    },
    3: {
        "name": "Vision + Image Studio",
        "description": "All Vision features plus fast AI image generation",
        "ram_gb": 12,
        "cpu_cores": 8,
        "gpu_vram_gb": 4,
        "disk_free_gb": 20,
        "models": "Gemma 4 Vision · SDXL Turbo",
    },
    4: {
        "name": "Vision + Flux",
        "description": "All Vision features plus high-quality AI image generation",
        "ram_gb": 16,
        "cpu_cores": 8,
        "gpu_vram_gb": 8,
        "disk_free_gb": 40,
        "models": "Qwen 2.5 Vision 7B · Flux Schnell",
    },
}

# ── Hardware detection ───────────────────────────────────────────────────────

def _get_cpu_name():
    try:
        if platform.system() == "Windows":
            out = subprocess.check_output(
                ["wmic", "cpu", "get", "Name"],
                stderr=subprocess.DEVNULL, timeout=5
            ).decode(errors="replace")
            lines = [l.strip() for l in out.strip().splitlines()
                     if l.strip() and l.strip() != "Name"]
            return lines[0] if lines else platform.processor()
        elif platform.system() == "Darwin":
            return subprocess.check_output(
                ["sysctl", "-n", "machdep.cpu.brand_string"],
                stderr=subprocess.DEVNULL, timeout=5
            ).decode(errors="replace").strip()
        else:
            with open("/proc/cpuinfo") as f:
                for line in f:
                    if "model name" in line:
                        return line.split(":", 1)[1].strip()
    except Exception:
        pass
    return platform.processor() or "Unknown CPU"


def _get_gpu():
    try:
        out = subprocess.check_output(
            ["nvidia-smi", "--query-gpu=name,memory.total",
             "--format=csv,noheader,nounits"],
            stderr=subprocess.DEVNULL, timeout=8
        ).decode(errors="replace").strip()
        if out:
            parts = out.split(",")
            return parts[0].strip(), int(parts[1].strip()) if len(parts) > 1 else 0
    except Exception:
        pass
    return None, 0


def _os_name():
    if platform.system() == "Windows":
        try:
            build = int(platform.version().split(".")[-1])
            return "Windows 11" if build >= 22000 else "Windows 10"
        except Exception:
            return "Windows"
    elif platform.system() == "Darwin":
        return f"macOS {platform.mac_ver()[0]}"
    return f"Linux ({platform.version()[:30]})"


def _gather():
    try:
        import psutil
        vm = psutil.virtual_memory()
        ram_gb = round(vm.total / 1024**3, 1)
        cpu_logical = psutil.cpu_count(logical=True) or 1
        cpu_physical = psutil.cpu_count(logical=False) or cpu_logical
        disk_free = round(psutil.disk_usage(os.path.abspath(os.sep)).free / 1024**3, 1)
    except ImportError:
        import ctypes
        ram_gb = round(ctypes.c_ulonglong(0).value / 1024**3, 1) if False else _fallback_ram()
        cpu_logical = os.cpu_count() or 1
        cpu_physical = cpu_logical
        disk_free = _fallback_disk()

    gpu_name, gpu_vram_mb = _get_gpu()
    gpu_vram_gb = round(gpu_vram_mb / 1024, 1) if gpu_vram_mb else 0

    return {
        "os": _os_name(),
        "arch": platform.machine(),
        "cpu": _get_cpu_name(),
        "cpu_logical": cpu_logical,
        "cpu_physical": cpu_physical,
        "ram_gb": ram_gb,
        "gpu": gpu_name,
        "gpu_vram_mb": gpu_vram_mb,
        "gpu_vram_gb": gpu_vram_gb,
        "disk_free_gb": disk_free,
    }


def _fallback_ram():
    """RAM detection without psutil (Windows only fallback)."""
    try:
        out = subprocess.check_output(
            ["wmic", "ComputerSystem", "get", "TotalPhysicalMemory"],
            stderr=subprocess.DEVNULL, timeout=5
        ).decode(errors="replace")
        lines = [l.strip() for l in out.splitlines() if l.strip().isdigit()]
        return round(int(lines[0]) / 1024**3, 1) if lines else 0
    except Exception:
        return 0


def _fallback_disk():
    try:
        import ctypes
        free_bytes = ctypes.c_ulonglong(0)
        ctypes.windll.kernel32.GetDiskFreeSpaceExW(
            ctypes.c_wchar_p(os.path.abspath(os.sep)),
            None, None, ctypes.pointer(free_bytes)
        )
        return round(free_bytes.value / 1024**3, 1)
    except Exception:
        return 0


def _score(tier_num, specs):
    req = TIER_REQUIREMENTS[tier_num]
    checks, missing = [], []

    if specs["ram_gb"] >= req["ram_gb"]:
        checks.append(True)
    else:
        checks.append(False)
        missing.append(f"RAM: need {req['ram_gb']} GB (you have {specs['ram_gb']} GB)")

    if specs["cpu_logical"] >= req["cpu_cores"]:
        checks.append(True)
    else:
        checks.append(False)
        missing.append(f"CPU cores: need {req['cpu_cores']} (you have {specs['cpu_logical']})")

    if req["gpu_vram_gb"] > 0:
        if specs["gpu_vram_gb"] >= req["gpu_vram_gb"]:
            checks.append(True)
        else:
            checks.append(False)
            have = f"{specs['gpu_vram_gb']} GB" if specs["gpu_vram_gb"] > 0 else "none"
            missing.append(f"GPU VRAM: need {req['gpu_vram_gb']} GB (you have {have})")

    if specs["disk_free_gb"] >= req["disk_free_gb"]:
        checks.append(True)
    else:
        checks.append(False)
        missing.append(f"Free disk: need {req['disk_free_gb']} GB (you have {specs['disk_free_gb']} GB)")

    passed = all(checks)
    pct = round(sum(checks) / len(checks) * 100) if checks else 0
    return passed, pct, missing


# ── GUI ──────────────────────────────────────────────────────────────────────

# Palette — matches the app's warm dark theme
BG       = "#211f1d"
SURFACE  = "#2a2926"
SURFACE2 = "#2f2d2a"
BORDER   = "#3d3b37"
ACCENT   = "#63d72a"   # app green accent
GREEN    = "#63d72a"
RED      = "#ef4444"
YELLOW   = "#f59e0b"
MUTED    = "#8a8884"
TEXT     = "#f9f8f6"
TEXT_DIM = "#a8a6a2"
TEXT_SEC = "#d5d4d1"

TIER_COLORS = {1: "#63d72a", 2: "#3b82f6", 3: "#f59e0b", 4: "#8b5cf6"}


def _bar(pct, width=18):
    filled = round(pct / 100 * width)
    return "█" * filled + "░" * (width - filled)


def build_window(specs, results, best_tier):
    root = tk.Tk()
    root.title("OLH Tier Analyzer")
    root.configure(bg=BG)
    root.resizable(False, False)

    # ── Try to set window icon (bundled alongside exe) ───────────────────
    try:
        icon_path = os.path.join(os.path.dirname(sys.executable), "OECS.ico")
        if not os.path.exists(icon_path):
            icon_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "OECS.ico")
        if os.path.exists(icon_path):
            root.iconbitmap(icon_path)
    except Exception:
        pass

    # ── Fonts ────────────────────────────────────────────────────────────
    try:
        F_HEAD  = tkfont.Font(family="Segoe UI", size=14, weight="bold")
        F_SUB   = tkfont.Font(family="Segoe UI", size=9)
        F_LABEL = tkfont.Font(family="Segoe UI", size=9, weight="bold")
        F_MONO  = tkfont.Font(family="Consolas",  size=9)
        F_TIER  = tkfont.Font(family="Segoe UI", size=10, weight="bold")
        F_REC   = tkfont.Font(family="Segoe UI", size=13, weight="bold")
    except Exception:
        F_HEAD = F_SUB = F_LABEL = F_MONO = F_TIER = F_REC = None

    def lbl(parent, text, fg=TEXT, bg=BG, f=None, **kw):
        return tk.Label(parent, text=text, fg=fg, bg=bg, font=f, **kw)

    def frame(parent, bg=BG, pad=0):
        return tk.Frame(parent, bg=bg, padx=pad, pady=pad)

    # ── Outer wrapper ────────────────────────────────────────────────────
    wrap = frame(root, bg=BG, pad=0)
    wrap.pack(fill="both", expand=True)

    # ── Header ───────────────────────────────────────────────────────────
    hdr = frame(wrap, bg=SURFACE2, pad=0)
    hdr.pack(fill="x")
    tk.Frame(hdr, bg=ACCENT, height=3).pack(fill="x")   # green top stripe
    hdr_inner = frame(hdr, bg=SURFACE2, pad=0)
    hdr_inner.pack(padx=20, pady=12)
    lbl(hdr_inner, "OECS Teacher Assistant", fg=ACCENT, bg=SURFACE2, f=F_HEAD).pack(anchor="w")
    lbl(hdr_inner, "Tier Analyzer — System Compatibility Report", fg=TEXT_DIM, bg=SURFACE2, f=F_SUB).pack(anchor="w")

    content = frame(wrap, bg=BG, pad=0)
    content.pack(fill="both", expand=True, padx=20, pady=16)

    # ── System specs ─────────────────────────────────────────────────────
    spec_frame = tk.Frame(content, bg=SURFACE, highlightbackground=BORDER,
                          highlightthickness=1)
    spec_frame.pack(fill="x", pady=(0, 10))
    sf = frame(spec_frame, bg=SURFACE, pad=0)
    sf.pack(padx=14, pady=10, fill="x")

    lbl(sf, "SYSTEM SPECS", fg=MUTED, bg=SURFACE, f=F_LABEL).pack(anchor="w", pady=(0, 6))

    spec_grid = frame(sf, bg=SURFACE)
    spec_grid.pack(fill="x")

    def spec_row(parent, label, value):
        row = frame(parent, bg=SURFACE)
        row.pack(fill="x", pady=1)
        lbl(row, f"{label:<12}", fg=MUTED, bg=SURFACE, f=F_MONO).pack(side="left")
        lbl(row, value, fg=TEXT_SEC, bg=SURFACE, f=F_MONO).pack(side="left")

    spec_row(spec_grid, "OS",        f"{specs['os']} ({specs['arch']})")
    spec_row(spec_grid, "CPU",       specs["cpu"][:52])
    spec_row(spec_grid, "Cores",     f"{specs['cpu_physical']} physical / {specs['cpu_logical']} logical")
    spec_row(spec_grid, "RAM",       f"{specs['ram_gb']} GB")
    if specs["gpu"]:
        spec_row(spec_grid, "GPU",   specs["gpu"])
        spec_row(spec_grid, "VRAM",  f"{specs['gpu_vram_mb']} MB  ({specs['gpu_vram_gb']} GB)")
    else:
        spec_row(spec_grid, "GPU",   "None detected")
    spec_row(spec_grid, "Free Disk", f"{specs['disk_free_gb']} GB")

    # ── Tier results ─────────────────────────────────────────────────────
    tier_frame = tk.Frame(content, bg=SURFACE, highlightbackground=BORDER,
                          highlightthickness=1)
    tier_frame.pack(fill="x", pady=(0, 10))
    tf = frame(tier_frame, bg=SURFACE, pad=0)
    tf.pack(padx=14, pady=10, fill="x")

    lbl(tf, "TIER SCORES", fg=MUTED, bg=SURFACE, f=F_LABEL).pack(anchor="w", pady=(0, 8))

    for t in [1, 2, 3, 4]:
        passed, pct, missing = results[t]
        color = TIER_COLORS[t]
        t_row = frame(tf, bg=SURFACE)
        t_row.pack(fill="x", pady=3)

        # Tier label
        tag = f"T{t}"
        tag_lbl = tk.Label(t_row, text=tag, fg="white", bg=color,
                           font=F_LABEL, width=3, padx=4)
        tag_lbl.pack(side="left")

        # Name + description
        info = frame(t_row, bg=SURFACE)
        info.pack(side="left", padx=8, fill="x", expand=True)
        lbl(info, TIER_REQUIREMENTS[t]["name"], fg=TEXT, bg=SURFACE, f=F_TIER).pack(anchor="w")

        # Bar + pct
        right = frame(t_row, bg=SURFACE)
        right.pack(side="right")
        status_color = GREEN if passed else RED
        status_text = "PASS" if passed else "FAIL"
        bar_text = f"{_bar(pct, 14)}  {pct:3}%"
        lbl(right, bar_text, fg=color,         bg=SURFACE, f=F_MONO).pack(side="left", padx=(0, 8))
        lbl(right, status_text, fg=status_color, bg=SURFACE, f=F_LABEL).pack(side="left")

        # Missing items (collapsed under the row)
        if not passed and missing:
            for m in missing:
                miss_row = frame(tf, bg=SURFACE)
                miss_row.pack(fill="x", padx=28, pady=0)
                lbl(miss_row, f"↳ {m}", fg=YELLOW, bg=SURFACE, f=F_MONO).pack(anchor="w")

    # ── Recommendation ────────────────────────────────────────────────────
    rec_bg = SURFACE2
    rec_frame = tk.Frame(content, bg=rec_bg, highlightbackground=ACCENT,
                         highlightthickness=2)
    rec_frame.pack(fill="x", pady=(0, 16))
    rf = frame(rec_frame, bg=rec_bg, pad=0)
    rf.pack(padx=14, pady=12, fill="x")

    if best_tier == 0:
        lbl(rf, "✗  System below minimum requirements",
            fg=RED, bg=rec_bg, f=F_REC).pack(anchor="w")
        lbl(rf, f"You need at least {TIER_REQUIREMENTS[1]['ram_gb']} GB RAM and "
                f"{TIER_REQUIREMENTS[1]['cpu_cores']} CPU cores for Tier 1.",
            fg=TEXT_DIM, bg=rec_bg, f=F_SUB).pack(anchor="w", pady=(4, 0))
    else:
        tier_col = TIER_COLORS[best_tier]
        rec_line = frame(rf, bg=rec_bg)
        rec_line.pack(fill="x")
        lbl(rec_line, "★  Recommended Tier: ", fg=TEXT, bg=rec_bg, f=F_REC).pack(side="left")
        lbl(rec_line, f"Tier {best_tier} — {TIER_REQUIREMENTS[best_tier]['name']}",
            fg=tier_col, bg=rec_bg, f=F_REC).pack(side="left")

        lbl(rf, TIER_REQUIREMENTS[best_tier]["description"],
            fg=TEXT_DIM, bg=rec_bg, f=F_SUB).pack(anchor="w", pady=(4, 2))
        lbl(rf, f"Models: {TIER_REQUIREMENTS[best_tier]['models']}",
            fg=MUTED, bg=rec_bg, f=F_MONO).pack(anchor="w")

        if best_tier < 4:
            _, _, next_missing = results[best_tier + 1]
            if next_missing:
                lbl(rf, f"To reach Tier {best_tier + 1}:", fg=MUTED, bg=rec_bg, f=F_SUB).pack(
                    anchor="w", pady=(8, 2))
                for m in next_missing:
                    lbl(rf, f"  • {m}", fg=YELLOW, bg=rec_bg, f=F_MONO).pack(anchor="w")

    # ── Close button ─────────────────────────────────────────────────────
    btn_frame = frame(content, bg=BG)
    btn_frame.pack(fill="x")
    close_btn = tk.Button(
        btn_frame, text="Close",
        command=root.destroy,
        bg=ACCENT, fg="#1a1a1a", activebackground="#4fc31a",
        relief="flat", padx=24, pady=8, cursor="hand2",
        font=F_LABEL, bd=0,
    )
    close_btn.pack(side="right")

    # ── Centre on screen ─────────────────────────────────────────────────
    root.update_idletasks()
    w, h = root.winfo_width(), root.winfo_height()
    sw, sh = root.winfo_screenwidth(), root.winfo_screenheight()
    root.geometry(f"+{(sw - w) // 2}+{(sh - h) // 2}")

    root.mainloop()


def main():
    specs = _gather()
    results = {t: _score(t, specs) for t in [1, 2, 3, 4]}
    best_tier = next((t for t in [4, 3, 2, 1] if results[t][0]), 0)
    build_window(specs, results, best_tier)


if __name__ == "__main__":
    main()
''').lstrip()


# ---------------------------------------------------------------------------
# Build logic
# ---------------------------------------------------------------------------

async def build_analyzer() -> tuple[bytes, str]:
    """
    Build the OLH Tier Analyzer.
    Returns (file_bytes, filename).
    Tries PyInstaller → windowed .exe with OECS icon.
    Falls back to raw .py bytes if PyInstaller is unavailable or fails.
    """
    if importlib.util.find_spec("PyInstaller") is None:
        raise RuntimeError(
            "PyInstaller is not installed in the backend environment. "
            "Run: pip install pyinstaller  (with the backend venv active), then restart the server."
        )

    return await _build_exe()


async def _build_exe() -> tuple[bytes, str]:
    # Run the blocking PyInstaller call in a thread so it doesn't need
    # ProactorEventLoop (uvicorn on Windows uses SelectorEventLoop).
    return await asyncio.to_thread(_build_exe_sync)


def _build_exe_sync() -> tuple[bytes, str]:
    with tempfile.TemporaryDirectory(prefix="olh_analyzer_") as tmpdir:
        tmp = Path(tmpdir)
        script_path = tmp / "olh_tier_analyzer.py"
        script_path.write_text(SCRIPT_TEMPLATE, encoding="utf-8")

        icon_arg = None
        if ICON_PATH.exists():
            dest_icon = tmp / "OECS.ico"
            shutil.copy2(str(ICON_PATH), str(dest_icon))
            icon_arg = str(dest_icon)

        cmd = [
            sys.executable, "-m", "PyInstaller",
            "--onefile",
            "--noconsole",
            "--name", "OLH_Tier_Analyzer",
            "--distpath", str(tmp / "dist"),
            "--workpath", str(tmp / "build"),
            "--specpath", str(tmp),
            "--clean",
            "--noconfirm",
        ]
        if icon_arg:
            cmd += ["--icon", icon_arg]
            cmd += ["--add-data", f"{icon_arg}{os.pathsep}."]
        cmd.append(str(script_path))

        logger.info("Running PyInstaller: %s", " ".join(cmd))

        result = subprocess.run(
            cmd,
            capture_output=True,
            cwd=str(tmp),
            timeout=180,
        )

        if result.returncode != 0:
            err = result.stderr.decode(errors="replace")[-3000:]
            logger.error("PyInstaller stderr:\n%s", err)
            raise RuntimeError(f"PyInstaller failed (exit {result.returncode}): {err[-500:]}")

        exe_path = tmp / "dist" / "OLH_Tier_Analyzer.exe"
        if not exe_path.exists():
            raise RuntimeError(f"Expected output not found: {exe_path}")

        return exe_path.read_bytes(), "OLH_Tier_Analyzer.exe"
