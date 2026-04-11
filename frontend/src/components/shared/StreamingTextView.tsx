/**
 * StreamingTextView
 *
 * Displays a growing raw-text stream (Quiz, Rubric, Worksheet, etc.)
 * with the same visual feel as the lesson planner's live typing:
 *
 *  - Clean Georgia-serif typography (inherited from GeneratorShell)
 *  - Lightweight markdown-ish formatting from useStreamingRenderer
 *  - Smooth character reveal on the trailing edge (~80 chars) so the
 *    most recently received tokens type in smoothly instead of
 *    snapping atomically
 *  - Blinking caret at the very end while streaming
 *
 * Unlike `LiveScalarCell` in the lesson table — which animates individual
 * cells because the lesson stream uses grammar-constrained JSON and we
 * know the exact field path — this component works on any raw text
 * stream and smooths only the last N characters. That's enough to get
 * 90% of the perceptual benefit without requiring a backend schema.
 *
 * Fallback: when `isStreaming` is false (e.g. after done, or when
 * displaying a cached generation for an inactive tab), renders the text
 * statically with no animation.
 */
import React, { useEffect, useRef, useState } from "react";

interface Props {
  /** The growing raw text from the WebSocket stream. */
  text: string;
  /** True while tokens are still arriving. */
  isStreaming: boolean;
  /** Tab accent color — used for the trailing caret. */
  accentColor: string;
  /**
   * Optional child renderer for the formatted static view. Called with
   * the full committed text. If omitted, the raw text is rendered as a
   * <pre> block.
   */
  renderFormatted?: (text: string) => React.ReactNode;
  /**
   * Number of trailing characters to animate with smooth-reveal. Default
   * 60 keeps the animation localized and cheap. Too large and the
   * animation becomes expensive; too small and the "smoothness" is
   * barely noticeable.
   */
  tailSize?: number;
}

export const StreamingTextView: React.FC<Props> = ({
  text,
  isStreaming,
  accentColor,
  renderFormatted,
  tailSize = 60,
}) => {
  // Delayed "shown" length — catches up to `text.length` over ~180ms
  // whenever the backend delivers a new chunk. Only the gap between
  // shown.length and text.length is animated, so the already-committed
  // head of the document stays stable across frames.
  const [shownLen, setShownLen] = useState(text.length);
  const shownLenRef = useRef(shownLen);
  const targetRef = useRef(text.length);
  shownLenRef.current = shownLen;
  targetRef.current = text.length;

  // Snap when not streaming (or when text is reset, e.g. tab switch).
  useEffect(() => {
    if (!isStreaming) {
      setShownLen(text.length);
      shownLenRef.current = text.length;
    } else if (text.length < shownLenRef.current) {
      // text shrank — reset
      setShownLen(text.length);
      shownLenRef.current = text.length;
    }
  }, [text, isStreaming]);

  // RAF loop: advance shownLen toward targetLen over a fixed 180ms horizon.
  useEffect(() => {
    if (!isStreaming) return;
    let raf = 0;
    let last = performance.now();
    const HORIZON_MS = 180;

    const tick = (now: number) => {
      const dt = Math.max(1, now - last);
      last = now;
      const target = targetRef.current;
      const shown = shownLenRef.current;
      if (shown !== target) {
        const remaining = target - shown;
        if (remaining < 0) {
          shownLenRef.current = target;
          setShownLen(target);
        } else {
          const add = Math.max(1, Math.ceil((dt / HORIZON_MS) * remaining));
          const next = Math.min(target, shown + add);
          shownLenRef.current = next;
          setShownLen(next);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isStreaming]);

  // The visible text is the committed prefix plus an animated tail.
  // When not streaming, just use the full text.
  const visibleText = isStreaming ? text.slice(0, shownLen) : text;

  // We split the visible text into a "head" (stable committed portion)
  // and a "tail" (the last tailSize chars) so we can emphasize the tail
  // with a subtle active-field shimmer underlay during streaming.
  const tailStart = Math.max(0, visibleText.length - tailSize);
  const head = visibleText.slice(0, tailStart);
  const tail = visibleText.slice(tailStart);

  return (
    <div className="streaming-text-view">
      {renderFormatted ? (
        <>
          {/* Formatted rich rendering of head + tail together.
              We render the full visibleText once — splitting head/tail
              would fragment markdown blocks (e.g. a half-written bullet).
              The trailing caret is appended inside the wrapper. */}
          <div className="relative">
            {renderFormatted(visibleText)}
            {isStreaming && (
              <span className="inline-flex items-center ml-1 align-middle">
                <span className="ohpc-caret" />
              </span>
            )}
          </div>
        </>
      ) : (
        <pre
          className="whitespace-pre-wrap leading-relaxed text-theme-primary"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {head}
          <span className={isStreaming ? "ohpc-active-field" : ""}>{tail}</span>
          {isStreaming && <span className="ohpc-caret" />}
        </pre>
      )}
    </div>
  );
};

export default StreamingTextView;
