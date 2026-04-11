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
import { parsePartialJsonWithProgress } from "../utils/partialJsonParse";

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
  throttleMs = 30,
}: Options): {
  lesson: Partial<OhpcLessonPlan> | null;
  isComplete: boolean;
  /**
   * JSON path of the field currently being typed by the model (e.g.
   * ["general_objective"] or ["ksv", "knowledge", 2]). null after stream
   * completion or between fields.
   */
  inProgressPath: (string | number)[] | null;
  /** Partial text being typed into the in-progress field. null if none. */
  inProgressValue: string | null;
} {
  const [parsed, setParsed] = useState<Partial<OhpcLessonPlan> | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [inProgressPath, setInProgressPath] = useState<(string | number)[] | null>(null);
  const [inProgressValue, setInProgressValue] = useState<string | null>(null);
  const lastParseAt = useRef(0);
  const pendingRaf = useRef<number | null>(null);
  // [PARSE-TRACE] lightweight per-parse trace
  const traceT0 = useRef<number>(0);
  const traceLastRawLen = useRef<number>(0);
  const traceLastPath = useRef<string>("");

  useEffect(() => {
    if (!rawText) {
      setParsed(null);
      setIsComplete(false);
      setInProgressPath(null);
      setInProgressValue(null);
      traceT0.current = 0;
      traceLastRawLen.current = 0;
      traceLastPath.current = "";
      return;
    }

    const runParse = () => {
      pendingRaf.current = null;
      lastParseAt.current = performance.now();
      if (traceT0.current === 0) traceT0.current = performance.now();
      const result = parsePartialJsonWithProgress<OhpcLessonPlan>(rawText);
      const next = result.data;

      // [PARSE-TRACE] Log when rawText grows — shows how many chars the
      // backend delivered per parse cycle and whether the parser could
      // extract an in-progress path/value from the new bytes.
      const rawDelta = rawText.length - traceLastRawLen.current;
      const pathStr = result.inProgressPath ? result.inProgressPath.join(".") : "(none)";
      const pathChanged = pathStr !== traceLastPath.current;
      if (rawDelta > 0 || pathChanged) {
        const elapsed = Math.round(performance.now() - traceT0.current);
        console.log(
          `[PARSE-TRACE] t=+${elapsed}ms raw+${rawDelta} (total=${rawText.length}) ` +
          `path=${pathStr}${pathChanged ? " (NEW)" : ""} ` +
          `valLen=${result.inProgressValue?.length ?? 0} ` +
          `valTail=${JSON.stringify((result.inProgressValue || "").slice(-20))}`
        );
        traceLastRawLen.current = rawText.length;
        traceLastPath.current = pathStr;
      }

      if (next) setParsed(next);
      setInProgressPath(result.inProgressPath);
      setInProgressValue(result.inProgressValue);
      // Try strict parse to detect completion.
      if (!isStreaming) {
        try {
          const strict = JSON.parse(rawText.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, ""));
          setParsed(strict);
          setIsComplete(true);
          setInProgressPath(null);
          setInProgressValue(null);
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

  return useMemo(
    () => ({ lesson: parsed, isComplete, inProgressPath, inProgressValue }),
    [parsed, isComplete, inProgressPath, inProgressValue]
  );
}
