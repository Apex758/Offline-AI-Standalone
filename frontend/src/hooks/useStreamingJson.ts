/**
 * useStreamingJson<T>
 *
 * Generic version of the lesson plan's live-streaming JSON hook. Works for
 * any generator whose backend uses grammar-constrained JSON decoding so
 * that `rawText` is guaranteed to be a prefix of a valid JSON object
 * matching some schema.
 *
 * Returns:
 *  - `data` — growing Partial<T> as fields commit
 *  - `isComplete` — true after stream ends AND a strict parse succeeds
 *  - `inProgressPath` — JSON path of the string currently being typed
 *  - `inProgressValue` — partial text of that string
 *
 * The `inProgressPath`/`inProgressValue` pair is what drives per-field
 * live rendering (LiveScalarCell, BulletList streaming items, etc.)
 *
 * This is a direct generalization of `useStreamingLessonJson` — the old
 * hook is now a type-specialized wrapper around this one.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { parsePartialJsonWithProgress } from "../utils/partialJsonParse";

interface Options {
  /** Raw accumulated text from the stream. */
  rawText: string;
  /** Whether the stream is still running (used to skip re-parses after done). */
  isStreaming: boolean;
  /** Min ms between re-parses while streaming. Default 30 (feels live). */
  throttleMs?: number;
}

export interface StreamingJsonResult<T> {
  data: Partial<T> | null;
  isComplete: boolean;
  /**
   * JSON path of the field currently being typed by the model (e.g.
   * ["general_objective"] or ["questions", 2, "prompt"]). null when no
   * string value is currently open.
   */
  inProgressPath: (string | number)[] | null;
  /** Partial text being typed into the in-progress field. null if none. */
  inProgressValue: string | null;
}

export function useStreamingJson<T>({
  rawText,
  isStreaming,
  throttleMs = 30,
}: Options): StreamingJsonResult<T> {
  const [parsed, setParsed] = useState<Partial<T> | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [inProgressPath, setInProgressPath] = useState<(string | number)[] | null>(null);
  const [inProgressValue, setInProgressValue] = useState<string | null>(null);
  const lastParseAt = useRef(0);
  const pendingRaf = useRef<number | null>(null);

  useEffect(() => {
    if (!rawText) {
      setParsed(null);
      setIsComplete(false);
      setInProgressPath(null);
      setInProgressValue(null);
      return;
    }

    const runParse = () => {
      pendingRaf.current = null;
      lastParseAt.current = performance.now();
      const result = parsePartialJsonWithProgress<T>(rawText);
      const next = result.data;
      if (next) setParsed(next);
      setInProgressPath(result.inProgressPath);
      setInProgressValue(result.inProgressValue);
      if (!isStreaming) {
        try {
          const strict = JSON.parse(
            rawText.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "")
          );
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
    () => ({ data: parsed, isComplete, inProgressPath, inProgressValue }),
    [parsed, isComplete, inProgressPath, inProgressValue]
  );
}
