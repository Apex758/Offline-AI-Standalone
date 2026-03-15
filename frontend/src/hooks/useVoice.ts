import { useState, useEffect, useRef, useCallback } from 'react';

// ========================================
// Text Cleaner — strips markdown, URLs, emoji for clean TTS
// ========================================
function cleanTextForTTS(text: string): string {
  return text
    // Remove markdown headers
    .replace(/#{1,6}\s+/g, '')
    // Remove bold/italic markers
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove URLs
    .replace(/https?:\/\/[^\s)]+/g, '')
    // Remove markdown links [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove bullet markers
    .replace(/^[\s]*[•\-\*]\s+/gm, '')
    // Remove numbered list markers but keep the text
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove emoji (basic range)
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    // Collapse multiple whitespace/newlines
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ========================================
// TTS Hook — uses Piper TTS backend (fully offline, natural voice)
// ========================================
export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const onEndCallbackRef = useRef<(() => void) | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const speak = useCallback(async (text: string, onEnd?: () => void) => {
    const cleaned = cleanTextForTTS(text);
    if (!cleaned) return;

    stopAudio();
    onEndCallbackRef.current = onEnd || null;
    setIsSpeaking(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('http://localhost:8000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleaned }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error('TTS request failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        setIsSpeaking(false);
        onEndCallbackRef.current?.();
        onEndCallbackRef.current = null;
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        setIsSpeaking(false);
        onEndCallbackRef.current = null;
      };

      await audio.play();
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error('[TTS] Piper error:', e);
        setIsSpeaking(false);
        onEndCallbackRef.current = null;
      }
    }
  }, [stopAudio]);

  const stop = useCallback(() => {
    onEndCallbackRef.current = null;
    stopAudio();
    setIsSpeaking(false);
  }, [stopAudio]);

  const toggle = useCallback((text: string) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  }, [isSpeaking, speak, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return { isSpeaking, speak, stop, toggle };
}

// ========================================
// STT Hook — uses refs for callbacks to avoid re-creating recognition
// Uses continuous mode with a silence timeout so the mic stays on longer
// ========================================
const SILENCE_TIMEOUT_MS = 5000; // 5 seconds of silence before auto-stopping

export function useSTT(onResult: (text: string) => void, onInterim?: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(onResult);
  const onInterimRef = useRef(onInterim);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accumulatedRef = useRef('');
  const isListeningRef = useRef(false);

  useEffect(() => { onResultRef.current = onResult; }, [onResult]);
  useEffect(() => { onInterimRef.current = onInterim; }, [onInterim]);
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const finalize = useCallback(() => {
    clearSilenceTimer();
    const text = accumulatedRef.current.trim();
    if (text) {
      onResultRef.current(text);
    }
    accumulatedRef.current = '';
    if (recognitionRef.current && isListeningRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
    setIsListening(false);
  }, [clearSilenceTimer]);

  const resetSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(finalize, SILENCE_TIMEOUT_MS);
  }, [clearSilenceTimer, finalize]);

  // Create recognition once on mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Accumulate final segments
      if (finalTranscript) {
        accumulatedRef.current += (accumulatedRef.current ? ' ' : '') + finalTranscript;
        // Show accumulated + any interim in the input
        if (onInterimRef.current) {
          onInterimRef.current(accumulatedRef.current);
        }
      } else if (interimTranscript && onInterimRef.current) {
        // Show accumulated so far + current interim
        const preview = accumulatedRef.current
          ? accumulatedRef.current + ' ' + interimTranscript
          : interimTranscript;
        onInterimRef.current(preview);
      }

      // Reset silence timer on any speech activity
      if (isListeningRef.current) {
        resetSilenceTimer();
      }
    };

    recognition.onerror = () => {
      clearSilenceTimer();
      accumulatedRef.current = '';
      setIsListening(false);
    };

    recognition.onend = () => {
      // In continuous mode, the browser may stop on its own (e.g., network issue)
      // If we're still supposed to be listening, finalize what we have
      if (isListeningRef.current) {
        finalize();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      clearSilenceTimer();
      recognition.abort();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        accumulatedRef.current = '';
        recognitionRef.current.start();
        setIsListening(true);
        // Start silence timer — if no speech at all within timeout, stop
        resetSilenceTimer();
      } catch {
        // Already started
      }
    }
  }, [isListening, resetSilenceTimer]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      finalize();
    }
  }, [isListening, finalize]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return { isListening, startListening, stopListening, toggleListening };
}
