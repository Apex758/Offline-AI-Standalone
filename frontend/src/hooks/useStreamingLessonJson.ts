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
  throttleMs = 80,
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
  // [DIAG] incremental parse instrumentation
  const diagT0 = useRef<number>(0);
  const diagParseCount = useRef<number>(0);
  const diagLastFieldsSeen = useRef<string>("");

  useEffect(() => {
    if (!rawText) {
      setParsed(null);
      setIsComplete(false);
      setInProgressPath(null);
      setInProgressValue(null);
      // [DIAG] reset per-stream counters
      diagT0.current = 0;
      diagParseCount.current = 0;
      diagLastFieldsSeen.current = "";
      return;
    }

    const runParse = () => {
      pendingRaf.current = null;
      lastParseAt.current = performance.now();
      // [DIAG]
      if (diagT0.current === 0) diagT0.current = performance.now();
      diagParseCount.current++;
      const t0 = performance.now();
      const result = parsePartialJsonWithProgress<OhpcLessonPlan>(rawText);
      const next = result.data;
      const parseMs = performance.now() - t0;
      const elapsedMs = Math.round(performance.now() - diagT0.current);
      const fieldsSeen = next ? Object.keys(next).sort().join(",") : "(none)";
      const fieldsChanged = fieldsSeen !== diagLastFieldsSeen.current;
      if (fieldsChanged || diagParseCount.current <= 3 || diagParseCount.current % 10 === 0) {
        console.log(
          `[DIAG parseLesson] PARSE t=+${elapsedMs}ms n=${diagParseCount.current} ` +
          `parse_cost=${parseMs.toFixed(1)}ms raw_len=${rawText.length} ` +
          `${fieldsChanged ? "NEW_FIELDS" : "same"} fields=[${fieldsSeen}] ` +
          `inProgress=${result.inProgressPath ? result.inProgressPath.join(".") : "none"}`
        );
        diagLastFieldsSeen.current = fieldsSeen;
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
          console.log(
            `[DIAG parseLesson] STREAM_COMPLETE t=+${elapsedMs}ms total_parses=${diagParseCount.current}`
          );
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
