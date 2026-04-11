/**
 * useStreamingLessonJson
 *
 * Watches a streaming raw-text buffer (produced by the /ws/lesson-plan
 * WebSocket) and returns a Partial<OhpcLessonPlan> that grows as more
 * tokens arrive. Throttled to avoid flickering React re-renders.
 *
 * The backend uses grammar-constrained JSON decoding, so `rawText` is
 * always a prefix of a valid JSON object matching LESSON_PLAN_SCHEMA.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { OhpcLessonPlan } from "../types/ohpcLesson";
import { parsePartialJson } from "../utils/partialJsonParse";

interface Options {
  /** Raw accumulated text from the stream. */
  rawText: string;
  /** Whether the stream is still running (used to skip re-parses after done). */
  isStreaming: boolean;
  /** Min ms between re-parses while streaming. Default 80 (feels live). */
  throttleMs?: number;
}

export function useStreamingLessonJson({
  rawText,
  isStreaming,
  throttleMs = 80,
}: Options): {
  lesson: Partial<OhpcLessonPlan> | null;
  isComplete: boolean;
} {
  const [parsed, setParsed] = useState<Partial<OhpcLessonPlan> | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const lastParseAt = useRef(0);
  const pendingRaf = useRef<number | null>(null);

  useEffect(() => {
    if (!rawText) {
      setParsed(null);
      setIsComplete(false);
      return;
    }

    const runParse = () => {
      pendingRaf.current = null;
      lastParseAt.current = performance.now();
      const next = parsePartialJson<OhpcLessonPlan>(rawText);
      if (next) setParsed(next);
      // Try strict parse to detect completion.
      if (!isStreaming) {
        try {
          const strict = JSON.parse(rawText.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, ""));
          setParsed(strict);
          setIsComplete(true);
        } catch {
          // keep last parsed partial
        }
      }
    };

    if (!isStreaming) {
      runParse();
      return;
    }

    const now = performance.now();
    const since = now - lastParseAt.current;
    if (since >= throttleMs) {
      runParse();
    } else if (pendingRaf.current == null) {
      const delay = throttleMs - since;
      const handle = window.setTimeout(runParse, delay);
      pendingRaf.current = handle;
      return () => {
        window.clearTimeout(handle);
        pendingRaf.current = null;
      };
    }
  }, [rawText, isStreaming, throttleMs]);

  return useMemo(() => ({ lesson: parsed, isComplete }), [parsed, isComplete]);
}
