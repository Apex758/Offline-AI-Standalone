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
// Chunker — splits text into TTS-friendly chunks for fluid speech
// ========================================
const MAX_CHUNK_CHARS = 400; // sweet spot for Piper: fast synthesis, natural flow

function chunkTextForTTS(text: string): string[] {
  // Split on paragraph boundaries (double newline was already converted to ". ")
  // and on sentence endings, keeping chunks under the limit
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim());
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    // If a single sentence exceeds the limit, push it as its own chunk
    if (sentence.length > MAX_CHUNK_CHARS) {
      if (current.trim()) {
        chunks.push(current.trim());
        current = '';
      }
      chunks.push(sentence.trim());
      continue;
    }

    const candidate = current ? current + ' ' + sentence : sentence;
    if (candidate.length > MAX_CHUNK_CHARS && current.trim()) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = candidate;
    }
  }
  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

// ========================================
// TTS Hook — uses Piper TTS backend (fully offline, natural voice)
// Chunks text and pre-fetches next audio for seamless playback
// ========================================
export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const onEndCallbackRef = useRef<(() => void) | null>(null);
  const cancelledRef = useRef(false);

  const stopAudio = useCallback(() => {
    cancelledRef.current = true;
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

  const fetchChunkAudio = useCallback(async (
    text: string,
    signal: AbortSignal
  ): Promise<string> => {
    const response = await fetch('http://localhost:8000/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal,
    });
    if (!response.ok) throw new Error('TTS request failed');
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }, []);

  const speak = useCallback(async (text: string, onEnd?: () => void) => {
    const cleaned = cleanTextForTTS(text);
    if (!cleaned) return;

    stopAudio();
    cancelledRef.current = false;
    onEndCallbackRef.current = onEnd || null;
    setIsSpeaking(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const chunks = chunkTextForTTS(cleaned);
    const objectUrls: string[] = [];

    try {
      // Pre-fetch first chunk immediately
      let nextAudioPromise: Promise<string> | null =
        chunks.length > 0 ? fetchChunkAudio(chunks[0], controller.signal) : null;

      for (let i = 0; i < chunks.length; i++) {
        if (cancelledRef.current) break;

        // Await the current chunk's audio
        const url = await nextAudioPromise!;
        objectUrls.push(url);

        // Start pre-fetching the next chunk while this one plays
        if (i + 1 < chunks.length) {
          nextAudioPromise = fetchChunkAudio(chunks[i + 1], controller.signal);
        } else {
          nextAudioPromise = null;
        }

        if (cancelledRef.current) break;

        // Play the current chunk
        await new Promise<void>((resolve, reject) => {
          const audio = new Audio(url);
          audioRef.current = audio;

          audio.onended = () => {
            audioRef.current = null;
            resolve();
          };
          audio.onerror = () => {
            audioRef.current = null;
            reject(new Error('Audio playback error'));
          };

          audio.play().catch(reject);
        });
      }

      // All chunks finished
      if (!cancelledRef.current) {
        setIsSpeaking(false);
        onEndCallbackRef.current?.();
        onEndCallbackRef.current = null;
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error('[TTS] Piper error:', e);
      }
      setIsSpeaking(false);
      onEndCallbackRef.current = null;
    } finally {
      // Clean up all object URLs
      for (const url of objectUrls) {
        URL.revokeObjectURL(url);
      }
    }
  }, [stopAudio, fetchChunkAudio]);

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
export function useSTT(onResult: (text: string) => void, onInterim?: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(onResult);
  const onInterimRef = useRef(onInterim);
  const accumulatedRef = useRef('');
  const isListeningRef = useRef(false);

  useEffect(() => { onResultRef.current = onResult; }, [onResult]);
  useEffect(() => { onInterimRef.current = onInterim; }, [onInterim]);
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);

  const finalize = useCallback(() => {
    const text = accumulatedRef.current.trim();
    if (text) {
      onResultRef.current(text);
    }
    accumulatedRef.current = '';
    if (recognitionRef.current && isListeningRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
    setIsListening(false);
  }, []);

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

      if (finalTranscript) {
        accumulatedRef.current += (accumulatedRef.current ? ' ' : '') + finalTranscript;
        if (onInterimRef.current) {
          onInterimRef.current(accumulatedRef.current);
        }
      } else if (interimTranscript && onInterimRef.current) {
        const preview = accumulatedRef.current
          ? accumulatedRef.current + ' ' + interimTranscript
          : interimTranscript;
        onInterimRef.current(preview);
      }
    };

    recognition.onerror = () => {
      accumulatedRef.current = '';
      setIsListening(false);
    };

    recognition.onend = () => {
      // Browser may stop continuous recognition on its own — restart if still listening
      if (isListeningRef.current) {
        try { recognition.start(); } catch { /* ignore */ }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        accumulatedRef.current = '';
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // Already started
      }
    }
  }, [isListening]);

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
