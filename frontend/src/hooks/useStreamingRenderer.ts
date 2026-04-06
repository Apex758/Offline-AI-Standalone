import { useMemo, useRef } from 'react';
import React from 'react';

/**
 * Lightweight streaming text renderer.
 * During streaming: uses a fast formatter (simple string checks, no heavy regex).
 * After streaming completes: runs the full rich formatter once.
 * This prevents expensive re-parsing of the entire growing string 60x/second.
 */

interface StreamingRendererOptions {
  text: string;
  isStreaming: boolean;
  fullFormatter: () => React.ReactNode;
  accentColor?: string;
}

export function useStreamingRenderer({
  text,
  isStreaming,
  fullFormatter,
  accentColor,
}: StreamingRendererOptions): React.ReactNode {
  // Cache the final formatted output so it only runs once after streaming ends
  const finalContentRef = useRef<{ text: string; content: React.ReactNode } | null>(null);

  return useMemo(() => {
    if (!text) return null;

    if (isStreaming) {
      // Reset final cache during streaming
      finalContentRef.current = null;
      return lightweightFormat(text, accentColor);
    }

    // After streaming: run full formatter once, cache it
    if (finalContentRef.current && finalContentRef.current.text === text) {
      return finalContentRef.current.content;
    }
    const content = fullFormatter();
    finalContentRef.current = { text, content };
    return content;
  }, [text, isStreaming]);
}

/**
 * Fast markdown-lite formatter for streaming display.
 * Uses simple startsWith/includes checks instead of regex.
 * Handles: headers, bold labels, bullets, numbered items, paragraphs.
 */
function lightweightFormat(text: string, accentColor?: string): React.ReactElement {
  const color = accentColor || '#3b82f6';
  const lines = text.split('\n');
  const elements: React.ReactElement[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(React.createElement('div', { key: i, className: 'h-3' }));
      continue;
    }

    // Section heading: **Title**
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
      const title = trimmed.slice(2, -2);
      elements.push(
        React.createElement('h2', {
          key: i,
          className: 'text-xl font-bold mt-6 mb-3 pb-2',
          style: { color: `${color}dd`, borderBottom: `2px solid ${color}33` },
        }, title)
      );
      continue;
    }

    // Field label: **Label:** or **Label:****
    if (trimmed.startsWith('**') && (trimmed.includes(':**') || trimmed.endsWith(':'))) {
      const title = trimmed.replace(/\*\*/g, '').replace(/:$/, '');
      // Check if it's a key:value pair like **Grade Level: 5**
      const colonIdx = title.indexOf(':');
      if (colonIdx > 0 && colonIdx < title.length - 1) {
        const label = title.slice(0, colonIdx).trim();
        const value = title.slice(colonIdx + 1).trim();
        elements.push(
          React.createElement('div', { key: i, className: 'mb-2 text-sm' },
            React.createElement('span', { className: 'font-semibold text-theme-muted' }, label + ':'),
            React.createElement('span', { className: 'ml-2 text-theme-heading' }, value)
          )
        );
      } else {
        elements.push(
          React.createElement('h3', {
            key: i,
            className: 'text-lg font-semibold mt-5 mb-2',
            style: { color: `${color}cc` },
          }, title + ':')
        );
      }
      continue;
    }

    // Nested bullet: + item or - item (indented)
    if (trimmed.startsWith('+ ') || (line.startsWith('  ') && trimmed.startsWith('- '))) {
      const content = trimmed.replace(/^[+\-]\s+/, '');
      elements.push(
        React.createElement('div', { key: i, className: 'ml-8 mb-1.5 flex items-start' },
          React.createElement('span', {
            className: 'mr-2 mt-1.5 text-xs',
            style: { color: `${color}66` },
          }, '\u25B8'),
          React.createElement('span', { className: 'text-theme-muted leading-relaxed text-sm' }, content)
        )
      );
      continue;
    }

    // Regular bullet: * item
    if ((trimmed.startsWith('* ') || trimmed.startsWith('- ')) && !trimmed.startsWith('**')) {
      const content = trimmed.replace(/^[*\-]\s+/, '');
      elements.push(
        React.createElement('div', { key: i, className: 'mb-1.5 flex items-start' },
          React.createElement('span', {
            className: 'mr-3 mt-1.5 font-bold text-sm',
            style: { color: `${color}99` },
          }, '\u2022'),
          React.createElement('span', { className: 'text-theme-label leading-relaxed' }, content)
        )
      );
      continue;
    }

    // Numbered item: 1. item
    if (trimmed.length > 2 && trimmed[0] >= '0' && trimmed[0] <= '9') {
      const dotIdx = trimmed.indexOf('. ');
      if (dotIdx > 0 && dotIdx <= 3) {
        const number = trimmed.slice(0, dotIdx + 1);
        const content = trimmed.slice(dotIdx + 2);
        elements.push(
          React.createElement('div', { key: i, className: 'mb-2 flex items-start' },
            React.createElement('span', {
              className: 'mr-3 font-semibold min-w-[2rem] rounded px-2 py-0.5 text-sm',
              style: { color: `${color}cc`, backgroundColor: `${color}0d` },
            }, number),
            React.createElement('span', { className: 'text-theme-label leading-relaxed pt-0.5' }, content)
          )
        );
        continue;
      }
    }

    // Answer option: A) B) C) D)
    if (trimmed.length > 2 && 'ABCD'.includes(trimmed[0]) && trimmed[1] === ')') {
      elements.push(
        React.createElement('div', { key: i, className: 'ml-4 mb-1 flex items-start' },
          React.createElement('span', {
            className: 'mr-2 font-semibold text-sm min-w-[1.5rem]',
            style: { color: `${color}bb` },
          }, trimmed.slice(0, 2)),
          React.createElement('span', { className: 'text-theme-label' }, trimmed.slice(2).trim())
        )
      );
      continue;
    }

    // Table row (contains |)
    if (trimmed.includes('|') && !trimmed.includes('---')) {
      const cells = trimmed.split('|').filter(c => c.trim());
      elements.push(
        React.createElement('div', { key: i, className: 'flex gap-4 mb-1 text-sm' },
          ...cells.map((cell, ci) =>
            React.createElement('span', {
              key: ci,
              className: 'flex-1 text-theme-label',
            }, cell.trim())
          )
        )
      );
      continue;
    }

    // Regular paragraph - apply inline bold
    elements.push(
      React.createElement('p', {
        key: i,
        className: 'text-theme-label leading-relaxed mb-2',
      }, applyInlineBold(trimmed))
    );
  }

  return React.createElement('div', { className: 'streaming-content' }, ...elements);
}

/**
 * Apply inline **bold** formatting within a string.
 * Returns string or array of React elements.
 */
function applyInlineBold(text: string): React.ReactNode {
  if (!text.includes('**')) return text;

  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.includes('**')) {
    const start = remaining.indexOf('**');
    const end = remaining.indexOf('**', start + 2);
    if (end === -1) break;

    if (start > 0) {
      parts.push(remaining.slice(0, start));
    }
    parts.push(
      React.createElement('strong', { key: key++, className: 'font-semibold' },
        remaining.slice(start + 2, end))
    );
    remaining = remaining.slice(end + 2);
  }

  if (remaining) parts.push(remaining);
  return parts.length === 1 ? parts[0] : parts;
}
