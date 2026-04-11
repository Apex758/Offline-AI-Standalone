/**
 * GeneratorShell
 *
 * Shared visual wrapper used by every generator's output view (Lesson,
 * Quiz, Rubric, Worksheet, Kindergarten, Multigrade, CrossCurricular).
 *
 * Provides:
 *  - Consistent Georgia-serif typography
 *  - Pulsing accent-color glow while streaming
 *  - Scoped CSS classes for per-field shimmer, skeleton loaders, and the
 *    typing caret, so every *Table component can use the same
 *    `.ohpc-active-field` / `.ohpc-skeleton` hooks without re-declaring
 *    the keyframes.
 *
 * Mount once per generator output. Safe to nest (the <style> tag is
 * idempotent at the class/keyframe level — duplicate mounts just re-
 * declare the same rules).
 */
import React from "react";

interface Props {
  /** Tab/theme accent color — used for pulse glow and shimmer tints. */
  accentColor: string;
  /** True while the generator is actively streaming tokens. */
  isStreaming?: boolean;
  /**
   * Optional id on the outer div, used by export code to grab the rendered
   * output (e.g. `lesson-plan-html-export`).
   */
  id?: string;
  /** Optional extra classes on the outer wrapper. */
  className?: string;
  children: React.ReactNode;
}

export const GeneratorShell: React.FC<Props> = ({
  accentColor,
  isStreaming = false,
  id,
  className = "",
  children,
}) => {
  return (
    <div
      id={id}
      className={`space-y-6 text-theme-primary relative transition-all ${
        isStreaming ? "ohpc-streaming" : ""
      } ${className}`}
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        ...(isStreaming
          ? {
              padding: "16px",
              borderRadius: "12px",
              boxShadow: `0 0 0 2px ${accentColor}33, 0 0 24px ${accentColor}22`,
              animation: "ohpcPulse 1.8s ease-in-out infinite",
            }
          : {}),
      }}
    >
      <style>{`
        @keyframes ohpcPulse {
          0%, 100% { box-shadow: 0 0 0 2px ${accentColor}33, 0 0 24px ${accentColor}22; }
          50%      { box-shadow: 0 0 0 2px ${accentColor}66, 0 0 32px ${accentColor}44; }
        }
        /* Per-field shimmer — highlights the cell currently being typed. */
        .ohpc-active-field {
          display: inline-block;
          padding: 0 0.25rem;
          border-radius: 4px;
          background: linear-gradient(
            90deg,
            ${accentColor}11 0%,
            ${accentColor}33 50%,
            ${accentColor}11 100%
          );
          background-size: 200% 100%;
          animation: ohpcActiveShimmer 1.4s linear infinite;
          box-shadow: 0 0 0 1px ${accentColor}55;
        }
        @keyframes ohpcActiveShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        /* Skeleton placeholder — for empty cells while streaming is active. */
        .ohpc-skeleton {
          display: inline-block;
          height: 0.9em;
          min-width: 40%;
          max-width: 80%;
          vertical-align: middle;
          border-radius: 4px;
          background: linear-gradient(
            90deg,
            ${accentColor}0a 0%,
            ${accentColor}1f 50%,
            ${accentColor}0a 100%
          );
          background-size: 200% 100%;
          animation: ohpcSkeletonShimmer 2.1s linear infinite;
        }
        .ohpc-skeleton-wide { min-width: 60%; max-width: 95%; }
        .ohpc-skeleton-bullet {
          display: block;
          height: 0.85em;
          margin: 0.35rem 0;
        }
        @keyframes ohpcSkeletonShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        /* Blinking typing caret. */
        .ohpc-caret {
          display: inline-block;
          width: 2px;
          height: 0.9em;
          margin-left: 1px;
          vertical-align: middle;
          background-color: ${accentColor};
          animation: ohpcCaretBlink 1s steps(2, start) infinite;
        }
        @keyframes ohpcCaretBlink {
          to { visibility: hidden; }
        }
      `}</style>
      {children}
    </div>
  );
};

export default GeneratorShell;
