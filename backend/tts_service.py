"""
Piper TTS Service — fully offline, natural-sounding text-to-speech.

Supports multiple named voices for storybook multi-character narration.
Voice models are auto-downloaded on first use (~60-100 MB each).
"""

import io
import os
import wave
import struct
import logging
import threading
from pathlib import Path

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Voice registry — 3 named voices for storybook multi-character support
# ---------------------------------------------------------------------------

DEFAULT_VOICE = "en_US-lessac-high"

VOICE_REGISTRY: dict[str, str] = {
    # English — US
    "lessac":  "en_US-lessac-high",     # Female narrator (pre-installed)
    "ryan":    "en_US-ryan-high",       # Male character voice
    "amy":     "en_US-amy-medium",      # Female character voice (different tone)
    "joe":     "en_US-joe-medium",      # Male, warm/deep
    "danny":   "en_US-danny-low",       # Male, low pitch
    "kusal":   "en_US-kusal-medium",    # Male, clear/bright
    # English — GB
    "jenny":   "en_GB-jenny_dioco-medium",  # British female, clear
    "alan":    "en_GB-alan-medium",         # British male, calm
    "alba":    "en_GB-alba-medium",         # Scottish female
    "cori":    "en_GB-cori-medium",         # British female, young
    "northern":"en_GB-northern_english_male-medium",   # Northern English male
    "southern":"en_GB-southern_english_female-medium",  # Southern English female
    # French
    "siwis":   "fr_FR-siwis-medium",    # French female narrator
    "gilles":  "fr_FR-gilles-low",      # French male voice
    # Spanish
    "sharvard":"es_ES-sharvard-medium",  # Spanish female narrator
    "carlfm":  "es_ES-carlfm-x_low",    # Spanish male voice
}

LANGUAGE_DEFAULT_VOICE: dict[str, str] = {
    "en": "en_US-lessac-high",
    "fr": "fr_FR-siwis-medium",
    "es": "es_ES-sharvard-medium",
}

def resolve_voice_model_name(voice_key: str) -> str:
    """Resolve a short voice key (e.g. 'ryan') to its full Piper model name."""
    return VOICE_REGISTRY.get(voice_key.lower(), voice_key)


def get_default_voice_for_language(lang: str) -> str:
    """Return the default voice model name for a language code (en, fr, es)."""
    return LANGUAGE_DEFAULT_VOICE.get(lang, DEFAULT_VOICE)


def _get_voices_dir() -> Path:
    """Get the directory where Piper voice models are stored."""
    if os.environ.get("TTS_VOICES_DIR"):
        voices_dir = Path(os.environ["TTS_VOICES_DIR"])
    elif os.environ.get("MODELS_DIR"):
        voices_dir = Path(os.environ["MODELS_DIR"]) / "tts_voices"
    else:
        voices_dir = Path(__file__).parent.parent / "models" / "tts_voices"
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
            if target.exists():
                target.unlink()
            raise RuntimeError(f"Failed to download TTS voice model: {e}")

    return onnx_path, json_path


def is_voice_available(voice_key: str) -> bool:
    """Check if a voice model is downloaded and available."""
    model_name = resolve_voice_model_name(voice_key)
    onnx, _ = _find_voice_model(model_name)
    return onnx is not None


# ---------------------------------------------------------------------------
# Per-voice loader — each voice gets its own lazy-loaded instance
# ---------------------------------------------------------------------------

class _VoiceInstance:
    """Lazy-loading wrapper for a single Piper voice model."""

    def __init__(self, voice_name: str):
        self._voice_name = voice_name
        self._voice = None
        self._lock = threading.Lock()
        self._loaded = False

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    def ensure_loaded(self):
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
                print(f"[OK] [TTS] Voice loaded: {self._voice_name}", flush=True)
                logger.info(f"TTS voice loaded: {self._voice_name}")
            except Exception as e:
                logger.error(f"Failed to load TTS voice {self._voice_name}: {e}")
                print(f"[ERR] [TTS] Failed to load voice {self._voice_name}: {e}", flush=True)
                raise

    def synthesize(self, text: str, speed: float = 1.0, lang: str = 'en') -> bytes:
        self.ensure_loaded()
        from piper.config import SynthesisConfig
        from tts_preprocessor import preprocess_for_tts, smart_split_sentences

        # Preprocess text for more natural speech (number expansion, abbreviations, etc.)
        text = preprocess_for_tts(text, lang=lang)

        config = SynthesisConfig()
        config.length_scale = 1.05 / speed
        config.noise_scale = 0.667
        config.noise_w_scale = 0.8

        sentences = smart_split_sentences(text, lang=lang)
        buf = io.BytesIO()
        with wave.open(buf, "wb") as wav_file:
            for i, sentence in enumerate(sentences):
                sentence = sentence.strip()
                if not sentence:
                    continue
                self._voice.synthesize_wav(sentence, wav_file, syn_config=config,
                                           set_wav_format=(i == 0))
                if i < len(sentences) - 1:
                    sample_rate = self._voice.config.sample_rate
                    silence_samples = int(sample_rate * 0.25)
                    wav_file.writeframes(b'\x00\x00' * silence_samples)

        # Post-process: normalize loudness and remove artifacts
        return _post_process_audio(buf.getvalue())

    def get_sample_rate(self) -> int:
        self.ensure_loaded()
        return self._voice.config.sample_rate


def _split_sentences(text: str) -> list[str]:
    import re
    parts = re.split(r'(?<=[.!?])\s+', text)
    return [p for p in parts if p.strip()]


def _post_process_audio(wav_bytes: bytes) -> bytes:
    """
    Post-process synthesized WAV audio for consistent, professional quality.

    - Loudness normalization (peak normalization to -1 dB headroom)
    - Simple noise gate to remove faint synthesis artifacts

    Uses only stdlib (struct/wave) -- no heavy dependencies required.
    Falls back to returning original audio if anything goes wrong.
    """
    try:
        # Read WAV data
        with wave.open(io.BytesIO(wav_bytes), 'rb') as wav_in:
            n_channels = wav_in.getnchannels()
            sampwidth = wav_in.getsampwidth()
            framerate = wav_in.getframerate()
            n_frames = wav_in.getnframes()
            raw_data = wav_in.readframes(n_frames)

        if sampwidth != 2 or n_frames == 0:
            return wav_bytes  # Only handle 16-bit PCM

        # Unpack samples
        fmt = f'<{n_frames * n_channels}h'
        samples = list(struct.unpack(fmt, raw_data))

        # Find peak amplitude
        peak = max(abs(s) for s in samples) if samples else 0
        if peak == 0:
            return wav_bytes

        # Noise gate: silence samples below 2% of peak
        threshold = peak * 0.02
        samples = [s if abs(s) >= threshold else 0 for s in samples]

        # Peak normalize to -1 dB headroom (target ~29180 out of 32767)
        target_peak = 29180
        if peak > 0 and peak != target_peak:
            scale = target_peak / peak
            # Clamp to int16 range
            samples = [max(-32768, min(32767, int(s * scale))) for s in samples]

        # Re-pack and write WAV
        packed = struct.pack(fmt, *samples)
        out_buf = io.BytesIO()
        with wave.open(out_buf, 'wb') as wav_out:
            wav_out.setnchannels(n_channels)
            wav_out.setsampwidth(sampwidth)
            wav_out.setframerate(framerate)
            wav_out.writeframes(packed)

        return out_buf.getvalue()

    except Exception as e:
        logger.warning(f"Audio post-processing failed, returning raw audio: {e}")
        return wav_bytes


# ---------------------------------------------------------------------------
# TTSService — multi-voice facade
# ---------------------------------------------------------------------------

class TTSService:
    """
    Multi-voice TTS service.

    Supports 3 named voices: lessac (default), ryan, amy.
    Each voice model is lazy-loaded on first use and kept in memory.
    """

    def __init__(self):
        self._voices: dict[str, _VoiceInstance] = {}
        self._lock = threading.Lock()

    def _get_voice_instance(self, voice_key: str) -> _VoiceInstance:
        model_name = resolve_voice_model_name(voice_key)
        with self._lock:
            if model_name not in self._voices:
                self._voices[model_name] = _VoiceInstance(model_name)
        return self._voices[model_name]

    @property
    def is_loaded(self) -> bool:
        """True if the default voice is loaded."""
        default_model = resolve_voice_model_name("lessac")
        return default_model in self._voices and self._voices[default_model].is_loaded

    def synthesize(self, text: str, speed: float = 1.0, voice: str = "lessac", lang: str = "en") -> bytes:
        """
        Synthesize text to WAV bytes.

        Args:
            text: Text to synthesize.
            speed: Playback speed multiplier (1.0 = normal).
            voice: Voice key — 'lessac' (default), 'ryan', or 'amy'.
            lang: Language code for text preprocessing ('en', 'fr', 'es').
        """
        instance = self._get_voice_instance(voice)
        return instance.synthesize(text, speed=speed, lang=lang)

    def get_voice_info(self) -> dict:
        """Return info about available voices."""
        voices_dir = _get_voices_dir()
        available = {}
        for key, model_name in VOICE_REGISTRY.items():
            onnx, _ = _find_voice_model(model_name)
            available[key] = {
                "model_name": model_name,
                "downloaded": onnx is not None,
                "loaded": (
                    model_name in self._voices and
                    self._voices[model_name].is_loaded
                ),
            }
        return {
            "default_voice": "lessac",
            "voices": available,
            "model_dir": str(voices_dir),
        }

    def cleanup(self):
        """Release all loaded voice models."""
        with self._lock:
            self._voices.clear()


# ---------------------------------------------------------------------------
# Module-level singleton
# ---------------------------------------------------------------------------
_instance: TTSService | None = None

def get_tts_service() -> TTSService:
    global _instance
    if _instance is None:
        _instance = TTSService()
    return _instance
