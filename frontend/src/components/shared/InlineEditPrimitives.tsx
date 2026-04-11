/**
 * InlineEditPrimitives
 *
 * Small contentEditable-based primitives used across all generator tables
 * (lesson plan, quiz, rubric, worksheet, etc.) so every generator shares
 * the same click-to-edit UX: no "Edit" button, no modal — the rendered
 * output IS the editor.
 *
 * Extracted from OhpcLessonTable so every generator stays visually and
 * behaviorally consistent.
 */
import React, { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// useSmoothReveal — client-side typing smoother for streaming text
// ---------------------------------------------------------------------------
// The backend emits one LLM token at a time (3-12 chars per WebSocket
// message, ~200ms between messages on CPU inference). Rendering these
// atomically looks like mid-word "chunks". This hook takes a jumpy target
// string and returns a displayed substring that slides up to the target
// over a fixed horizon, using requestAnimationFrame for 60fps smoothness.
//
// When `active` is false, the hook passes `target` through unchanged.
// When `active` is true, characters are revealed over ~180ms so the user
// sees continuous typing instead of discrete token jumps.

export function useSmoothReveal(target: string, active: boolean): string {
  const [shown, setShown] = useState<string>(active ? "" : target);
  const targetRef = useRef(target);
  const shownRef = useRef(shown);
  const activeRef = useRef(active);
  targetRef.current = target;
  shownRef.current = shown;

  // Handle active transitions and target resets (e.g. when the streaming
  // path moves to a new field and the target string is no longer a
  // continuation of what's currently shown).
  useEffect(() => {
    if (!active) {
      shownRef.current = target;
      setShown(target);
      activeRef.current = false;
      return;
    }
    if (!activeRef.current) {
      // Entering active mode: start from empty so we type in.
      shownRef.current = "";
      setShown("");
      activeRef.current = true;
      return;
    }
    // Still active but target no longer starts with shown → reset.
    if (!target.startsWith(shownRef.current)) {
      shownRef.current = "";
      setShown("");
    }
  }, [active, target]);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    // Catch-up horizon: any gap between shown and target is closed over
    // ~180ms. Small token jumps reveal slowly (smooth), large jumps reveal
    // faster but never instantly.
    const HORIZON_MS = 180;
    const MIN_CHARS_PER_FRAME = 1;

    const tick = (now: number) => {
      const dt = Math.max(1, now - last);
      last = now;
      const tgt = targetRef.current;
      const cur = shownRef.current;
      if (cur !== tgt) {
        if (!tgt.startsWith(cur)) {
          shownRef.current = tgt;
          setShown(tgt);
        } else {
          const remaining = tgt.length - cur.length;
          const add = Math.max(
            MIN_CHARS_PER_FRAME,
            Math.ceil((dt / HORIZON_MS) * remaining)
          );
          const next = tgt.slice(0, cur.length + add);
          shownRef.current = next;
          setShown(next);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return shown;
}

// ---------------------------------------------------------------------------
// InlineText — click-to-edit single line or multiline string
// ---------------------------------------------------------------------------

export function InlineText({
  value,
  placeholder,
  editable,
  multiline,
  onChange,
  className,
}: {
  value: string;
  placeholder: string;
  editable: boolean;
  multiline?: boolean;
  onChange: (v: string) => void;
  className?: string;
}) {
  const base =
    "outline-none w-full rounded px-1 py-0.5 transition " +
    (editable ? "focus:bg-theme-hover hover:bg-theme-hover/50 cursor-text" : "cursor-default");
  const empty = !value || !value.trim();
  if (!editable) {
    return (
      <span className={`${className || ""} ${empty ? "text-theme-muted italic" : ""}`}>
        {empty ? placeholder : value}
      </span>
    );
  }
  if (multiline) {
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        className={`${base} ${className || ""} ${empty ? "text-theme-muted italic" : ""} whitespace-pre-wrap`}
        onBlur={(e) => onChange(e.currentTarget.textContent || "")}
      >
        {empty ? placeholder : value}
      </div>
    );
  }
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      className={`${base} ${className || ""} ${empty ? "text-theme-muted italic" : ""}`}
      onBlur={(e) => onChange(e.currentTarget.textContent || "")}
    >
      {empty ? placeholder : value}
    </span>
  );
}

// ---------------------------------------------------------------------------
// StreamingBulletRow — smoothed trailing <li> for BulletList during streaming
// ---------------------------------------------------------------------------

function StreamingBulletRow({
  value,
  accentColor,
}: {
  value: string;
  accentColor: string;
}) {
  const revealed = useSmoothReveal(value, true);
  return (
    <li className="flex items-start gap-2 ohpc-active-field">
      <span
        className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
        style={{ backgroundColor: accentColor }}
      />
      <span className="flex-1 text-sm leading-relaxed whitespace-pre-wrap">
        {revealed}
        <span
          className="inline-block w-[2px] h-[0.9em] ml-[1px] align-middle animate-pulse"
          style={{ backgroundColor: accentColor }}
        />
      </span>
    </li>
  );
}

// ---------------------------------------------------------------------------
// BulletList — click-to-edit array of strings with add/remove
// ---------------------------------------------------------------------------

export function BulletList({
  items,
  editable,
  accentColor,
  placeholder,
  onChange,
  streamingItem,
  isStreaming,
}: {
  items: string[] | undefined;
  editable: boolean;
  accentColor: string;
  placeholder: string;
  onChange: (next: string[]) => void;
  /**
   * When set, renders an additional "live" bullet at the given index with
   * the given in-progress text + caret + shimmer. This is used during
   * AI streaming so users see the next item being typed even before it
   * is committed to the underlying array.
   */
  streamingItem?: { index: number; value: string } | null;
  /**
   * True while the overall generation is still streaming. When the list
   * is empty, has no streaming item, and isStreaming is true, we render
   * placeholder skeleton rows so pending sections show constant motion
   * instead of looking frozen between field transitions.
   */
  isStreaming?: boolean;
}) {
  const list = items || [];
  const updateAt = (idx: number, v: string) => {
    const next = [...list];
    next[idx] = v;
    onChange(next);
  };
  const removeAt = (idx: number) => {
    const next = list.filter((_, i) => i !== idx);
    onChange(next);
  };
  const addItem = () => onChange([...list, ""]);

  const hasStreamingTrailer =
    !!streamingItem && streamingItem.index >= list.length;

  // Empty + streaming + no active item → render skeleton rows so the
  // user sees pending sections shimmering while other fields finish.
  if (list.length === 0 && !hasStreamingTrailer && isStreaming) {
    return (
      <ul className="space-y-1 list-none m-0 p-0" aria-label={placeholder}>
        {[0, 1, 2].map((i) => (
          <li key={i} className="flex items-start gap-2">
            <span
              className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-40"
              style={{ backgroundColor: accentColor }}
            />
            <span
              className={`ohpc-skeleton ${i === 0 ? "ohpc-skeleton-wide" : ""}`}
              style={{ width: i === 0 ? "85%" : i === 1 ? "70%" : "55%" }}
            />
          </li>
        ))}
      </ul>
    );
  }

  if (list.length === 0 && !editable && !hasStreamingTrailer) {
    return <span className="text-theme-muted italic">{placeholder}</span>;
  }
  return (
    <ul className="space-y-1 list-none m-0 p-0">
      {list.map((it, i) => (
        <li key={i} className="flex items-start gap-2 group">
          <span
            className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          />
          <InlineText
            value={it}
            placeholder="..."
            editable={editable}
            onChange={(v) => updateAt(i, v)}
            className="flex-1 text-sm leading-relaxed"
          />
          {editable && (
            <button
              onClick={() => removeAt(i)}
              className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:text-red-700 px-1"
              title="Remove"
              type="button"
            >
              x
            </button>
          )}
        </li>
      ))}
      {hasStreamingTrailer && streamingItem && (
        <StreamingBulletRow
          key={`streaming-${streamingItem.index}`}
          value={streamingItem.value}
          accentColor={accentColor}
        />
      )}
      {editable && (
        <li>
          <button
            onClick={addItem}
            className="text-xs px-2 py-0.5 rounded border border-dashed opacity-60 hover:opacity-100 transition"
            style={{ borderColor: `${accentColor}66`, color: `${accentColor}cc` }}
            type="button"
          >
            + add
          </button>
        </li>
      )}
    </ul>
  );
}
