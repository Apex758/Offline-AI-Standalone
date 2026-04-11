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
import React from "react";

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
// BulletList — click-to-edit array of strings with add/remove
// ---------------------------------------------------------------------------

export function BulletList({
  items,
  editable,
  accentColor,
  placeholder,
  onChange,
  streamingItem,
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
        <li key={`streaming-${streamingItem.index}`} className="flex items-start gap-2 ohpc-active-field">
          <span
            className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
          <span className="flex-1 text-sm leading-relaxed whitespace-pre-wrap">
            {streamingItem.value}
            <span
              className="inline-block w-[2px] h-[0.9em] ml-[1px] align-middle animate-pulse"
              style={{ backgroundColor: accentColor }}
            />
          </span>
        </li>
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
