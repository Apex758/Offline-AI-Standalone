/**
 * Speech Bubble SVG generator for storybook character dialogue.
 *
 * Produces a rounded-rectangle bubble with a triangular tail pointing
 * toward the character image. Two text variants are provided:
 *   - foreignObject (HTML/interactive) — auto-wraps text
 *   - <text>/<tspan> (PDF/WeasyPrint) — manual line-breaking
 */

import type { StoryPage, TextSegment } from '../types/storybook';

// ─── Types ───────────────────────────────────────────────────────────────────

export type BubbleContext = 'editor' | 'pdf' | 'html';
export type TailDirection = 'left' | 'right';

export interface SpeechBubbleOptions {
  text: string;
  /** Which side the tail points toward (i.e. where the character is) */
  tailDirection: TailDirection;
  context: BubbleContext;
}

// ─── Context-specific presets ────────────────────────────────────────────────

interface BubblePreset {
  fontSize: number;
  maxWidth: number;
  maxLines: number;
  charsPerLine: number;
  padding: { x: number; y: number };
  lineHeight: number;
  tailWidth: number;
  tailHeight: number;
  borderRadius: number;
}

const PRESETS: Record<BubbleContext, BubblePreset> = {
  editor: {
    fontSize: 11,
    maxWidth: 180,
    maxLines: 5,
    charsPerLine: 20,
    padding: { x: 12, y: 10 },
    lineHeight: 1.45,
    tailWidth: 12,
    tailHeight: 10,
    borderRadius: 10,
  },
  pdf: {
    fontSize: 11,
    maxWidth: 180,
    maxLines: 5,
    charsPerLine: 18,
    padding: { x: 14, y: 12 },
    lineHeight: 1.5,
    tailWidth: 14,
    tailHeight: 12,
    borderRadius: 12,
  },
  html: {
    fontSize: 18,
    maxWidth: 280,
    maxLines: 5,
    charsPerLine: 22,
    padding: { x: 18, y: 14 },
    lineHeight: 1.5,
    tailWidth: 16,
    tailHeight: 14,
    borderRadius: 14,
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Word-wrap text into lines of approximately `maxChars` characters. */
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (current && (current.length + 1 + word.length) > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Escape text for safe SVG/HTML embedding. */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ─── SVG Builders ────────────────────────────────────────────────────────────

/**
 * Build a speech bubble SVG string using foreignObject for text.
 * Works in browsers and the interactive HTML export.
 */
export function buildSpeechBubbleSVG(options: SpeechBubbleOptions): string {
  const p = PRESETS[options.context];
  let { fontSize } = p;
  const lines = wrapText(options.text, p.charsPerLine);

  // If text is too long, reduce font slightly (one step only)
  let lineCount = Math.min(lines.length, p.maxLines);
  if (lines.length > p.maxLines) {
    fontSize = Math.max(fontSize - 2, 9);
    const rewrapped = wrapText(options.text, p.charsPerLine + 3);
    lineCount = Math.min(rewrapped.length, p.maxLines + 1);
  }

  const textHeight = lineCount * fontSize * p.lineHeight;
  const bodyW = p.maxWidth;
  const bodyH = textHeight + p.padding.y * 2;
  const totalH = bodyH + p.tailHeight;
  const totalW = bodyW + p.tailWidth;

  // Tail anchored at ~35% down the bubble body, pointing toward character
  const tailTopY = bodyH * 0.30;
  const tailBottomY = tailTopY + p.tailWidth;

  let tailPoints: string;
  let svgWidth: number;
  let bodyX: number;

  if (options.tailDirection === 'left') {
    // Tail on the left side, body shifts right
    bodyX = p.tailWidth;
    svgWidth = totalW;
    tailPoints = `${bodyX},${tailTopY} 0,${tailTopY + p.tailWidth * 0.4} ${bodyX},${tailBottomY}`;
  } else {
    // Tail on the right side, body stays at x=0
    bodyX = 0;
    svgWidth = totalW;
    tailPoints = `${bodyW},${tailTopY} ${bodyW + p.tailWidth},${tailTopY + p.tailWidth * 0.4} ${bodyW},${tailBottomY}`;
  }

  const truncatedText = lines.length > p.maxLines
    ? lines.slice(0, p.maxLines).join(' ').slice(0, -3) + '…'
    : options.text;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${bodyH}" viewBox="0 0 ${svgWidth} ${bodyH}" style="overflow:visible;">
  <rect x="${bodyX}" y="0" width="${bodyW}" height="${bodyH}" rx="${p.borderRadius}" ry="${p.borderRadius}" fill="white" stroke="#d1d5db" stroke-width="1.5"/>
  <polygon points="${tailPoints}" fill="white" stroke="#d1d5db" stroke-width="1.5"/>
  <rect x="${bodyX + (options.tailDirection === 'left' ? 0 : bodyW - 8)}" y="${tailTopY - 1}" width="10" height="${tailBottomY - tailTopY + 2}" fill="white"/>
  <foreignObject x="${bodyX + p.padding.x}" y="${p.padding.y}" width="${bodyW - p.padding.x * 2}" height="${bodyH - p.padding.y * 2}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Georgia,serif;font-size:${fontSize}px;line-height:${p.lineHeight};color:#1f2937;overflow:hidden;">
      ${escapeXml(truncatedText)}
    </div>
  </foreignObject>
</svg>`;
}

/**
 * Build a speech bubble SVG using <text>/<tspan> elements (no foreignObject).
 * Safe for WeasyPrint PDF rendering.
 */
export function buildSpeechBubbleSVGText(options: SpeechBubbleOptions): string {
  const p = PRESETS[options.context];
  let { fontSize } = p;
  let lines = wrapText(options.text, p.charsPerLine);

  if (lines.length > p.maxLines) {
    fontSize = Math.max(fontSize - 2, 9);
    lines = wrapText(options.text, p.charsPerLine + 3);
  }
  if (lines.length > p.maxLines) {
    lines = lines.slice(0, p.maxLines);
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = last.slice(0, -3) + '…';
  }

  const textHeight = lines.length * fontSize * p.lineHeight;
  const bodyW = p.maxWidth;
  const bodyH = textHeight + p.padding.y * 2;
  const totalW = bodyW + p.tailWidth;

  const tailTopY = bodyH * 0.30;
  const tailBottomY = tailTopY + p.tailWidth;

  let tailPoints: string;
  let bodyX: number;

  if (options.tailDirection === 'left') {
    bodyX = p.tailWidth;
    tailPoints = `${bodyX},${tailTopY} 0,${tailTopY + p.tailWidth * 0.4} ${bodyX},${tailBottomY}`;
  } else {
    bodyX = 0;
    tailPoints = `${bodyW},${tailTopY} ${bodyW + p.tailWidth},${tailTopY + p.tailWidth * 0.4} ${bodyW},${tailBottomY}`;
  }

  const tspans = lines.map((line, i) => {
    const y = p.padding.y + fontSize + i * fontSize * p.lineHeight;
    return `<tspan x="${bodyX + p.padding.x}" y="${y}">${escapeXml(line)}</tspan>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${bodyH}" viewBox="0 0 ${totalW} ${bodyH}" style="overflow:visible;">
  <rect x="${bodyX}" y="0" width="${bodyW}" height="${bodyH}" rx="${p.borderRadius}" ry="${p.borderRadius}" fill="white" stroke="#d1d5db" stroke-width="1.5"/>
  <polygon points="${tailPoints}" fill="white" stroke="#d1d5db" stroke-width="1.5"/>
  <rect x="${bodyX + (options.tailDirection === 'left' ? 0 : bodyW - 8)}" y="${tailTopY - 1}" width="10" height="${tailBottomY - tailTopY + 2}" fill="white"/>
  <text font-family="Georgia, serif" font-size="${fontSize}" fill="#1f2937">${tspans}</text>
</svg>`;
}

// ─── Decision helper ─────────────────────────────────────────────────────────

/** Returns true when this segment should render inside a speech bubble. */
export function shouldUseBubble(seg: TextSegment, page: StoryPage): boolean {
  return (
    seg.speaker !== 'narrator' &&
    page.imagePlacement !== 'none' &&
    !!page.characterImageData
  );
}

/** Determine tail direction from character placement. Tail points toward character. */
export function getTailDirection(page: StoryPage): TailDirection {
  return page.imagePlacement === 'right' ? 'right' : 'left';
}

/**
 * Estimate the rendered height of a speech bubble in pixels (for layout).
 */
export function estimateBubbleHeight(text: string, context: BubbleContext): number {
  const p = PRESETS[context];
  const lines = wrapText(text, p.charsPerLine);
  const lineCount = Math.min(lines.length, p.maxLines);
  return lineCount * p.fontSize * p.lineHeight + p.padding.y * 2;
}
