"""
Piper TTS Service — fully offline, natural-sounding text-to-speech.

Uses piper-tts with ONNX voice models (~60 MB).
Voice model is auto-downloaded on first use.
"""

import io
import os
import wave
import logging
import threading
from pathlib import Path

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Model config
# ---------------------------------------------------------------------------
# Default voice: en_US-lessac-high (female, highest quality, ~100 MB)
DEFAULT_VOICE = "en_US-lessac-high"

def _get_voices_dir() -> Path:
    """Get the directory where Piper voice models are stored."""
    # Check environment override first
    if os.environ.get("MODELS_DIR"):
        base = Path(os.environ["MODELS_DIR"])
    else:
        base = Path(__file__).parent.parent / "models"
    voices_dir = base / "tts_voices"
    voices_dir.mkdir(parents=True, exist_ok=True)
    return voices_dir


def _find_voice_model(voice_name: str) -> tuple[Path | None, Path | None]:
    """Find .onnx and .onnx.json for a voice in the voices directory."""
    voices_dir = _get_voices_dir()
    onnx_path = voices_dir / f"{voice_name}.onnx"
    json_path = voices_dir / f"{voice_name}.onnx.json"
    if onnx_path.exists() and json_path.exists():
        return onnx_path, json_path
    return None, None


def _download_voice(voice_name: str) -> tuple[Path, Path]:
    """Download a Piper voice model from Hugging Face."""
    import urllib.request

    voices_dir = _get_voices_dir()
    onnx_path = voices_dir / f"{voice_name}.onnx"
    json_path = voices_dir / f"{voice_name}.onnx.json"

    if onnx_path.exists() and json_path.exists():
        return onnx_path, json_path

    # Parse voice name: en_US-amy-medium → en/en_US/amy/medium/
    parts = voice_name.split("-")
    lang_code = parts[0]           # en_US
    lang_family = lang_code[:2]    # en
    speaker = parts[1]             # amy
    quality = parts[2]             # medium

    base_url = (
        f"https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/"
        f"{lang_family}/{lang_code}/{speaker}/{quality}/"
    )

    for filename, target in [(f"{voice_name}.onnx", onnx_path), (f"{voice_name}.onnx.json", json_path)]:
        url = base_url + filename
        logger.info(f"Downloading Piper voice: {url}")
        print(f"v [TTS] Downloading {filename}...", flush=True)
        try:
            urllib.request.urlretrieve(url, str(target))
            print(f"[OK] [TTS] Downloaded {filename} ({target.stat().st_size / 1024 / 1024:.1f} MB)", flush=True)
        except Exception as e:
            logger.error(f"Failed to download {url}: {e}")
            # Clean up partial downloads
            if target.exists():
                target.unlink()
            raise RuntimeError(f"Failed to download TTS voice model: {e}")

    return onnx_path, json_path


# ---------------------------------------------------------------------------
# Singleton service
# ---------------------------------------------------------------------------
class TTSService:
    """Lazy-loading Piper TTS singleton."""

    def __init__(self):
        self._voice = None
        self._voice_name = DEFAULT_VOICE
        self._lock = threading.Lock()
        self._loaded = False

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    def _ensure_loaded(self):
        """Load the voice model if not already loaded."""
        if self._loaded:
            return
        with self._lock:
            if self._loaded:
                return
            try:
                from piper import PiperVoice

                onnx_path, json_path = _find_voice_model(self._voice_name)
                if onnx_path is None:
                    print(f"v [TTS] Voice model not found locally, downloading {self._voice_name}...", flush=True)
                    onnx_path, json_path = _download_voice(self._voice_name)

                print(f"[OK] [TTS] Loading voice model: {onnx_path}", flush=True)
                self._voice = PiperVoice.load(str(onnx_path), config_path=str(json_path))
                self._loaded = True
                print(f"[OK] [TTS] Voice loaded successfully ({self._voice_name})", flush=True)
                logger.info(f"TTS voice loaded: {self._voice_name}")
            except Exception as e:
                logger.error(f"Failed to load TTS voice: {e}")
                print(f"[ERR] [TTS] Failed to load voice: {e}", flush=True)
                raise

    def synthesize(self, text: str, speed: float = 1.0) -> bytes:
        """Synthesize text to WAV bytes."""
        self._ensure_loaded()
        from piper.config import SynthesisConfig

        config = SynthesisConfig()
        # Slightly slower pace for natural flow (1.05 = ~5% slower)
        config.length_scale = 1.05 / speed
        # Voice variation — adds warmth and natural inflection
        config.noise_scale = 0.667
        # Phoneme duration variation — prevents robotic monotone rhythm
        config.noise_w_scale = 0.8

        # Break long text into sentences for more natural pauses
        sentences = self._split_sentences(text)

        buf = io.BytesIO()
        with wave.open(buf, "wb") as wav_file:
            for i, sentence in enumerate(sentences):
                sentence = sentence.strip()
                if not sentence:
                    continue
                self._voice.synthesize_wav(sentence, wav_file, syn_config=config,
                                           set_wav_format=(i == 0))
                # Insert a natural pause between sentences (~250ms of silence)
                if i < len(sentences) - 1:
                    sample_rate = self._voice.config.sample_rate
                    silence_samples = int(sample_rate * 0.25)
                    wav_file.writeframes(b'\x00\x00' * silence_samples)
        return buf.getvalue()

    @staticmethod
    def _split_sentences(text: str) -> list[str]:
        """Split text into sentences for natural pauses."""
        import re
        # Split on sentence-ending punctuation followed by space or end
        parts = re.split(r'(?<=[.!?])\s+', text)
        return [p for p in parts if p.strip()]

    def get_voice_info(self) -> dict:
        """Return info about the current voice."""
        return {
            "voice_name": self._voice_name,
            "loaded": self._loaded,
            "model_dir": str(_get_voices_dir()),
        }

    def cleanup(self):
        """Release resources."""
        self._voice = None
        self._loaded = False


# ---------------------------------------------------------------------------
# Module-level singleton
# ---------------------------------------------------------------------------
_instance: TTSService | None = None

def get_tts_service() -> TTSService:
    global _instance
    if _instance is None:
        _instance = TTSService()
    return _instance
