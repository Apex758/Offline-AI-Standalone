// utils/scanTemplateRenderer.ts
// Deterministic scan-mode HTML renderer with embedded position data.
// Uses fixed-height question slots so bubble/answer positions are known at render time.
// All dimensions in CSS pt (matches WeasyPrint's rendering unit).

// -- A4 Layout Constants (in pt) ----------------------------------------------
const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 56.7;        // 1.5cm
const USABLE_W = 481.6;     // PAGE_W - 2 * MARGIN
const USABLE_H = 728.6;     // PAGE_H - 2 * MARGIN

const HEADER_H_PAGE1 = 90;       // Full header: name, date, subject, QR placeholder
const HEADER_H_SUBSEQUENT = 30;  // Subsequent pages: QR placeholder only

const MARKER_SIZE = 14.2;   // 5mm
const MARKER_MARGIN = 14.2; // 5mm from page edge

// Bubble/checkbox dimensions
const BUBBLE_D = 14;        // diameter in pt
const BUBBLE_GAP = 115;     // horizontal distance between bubble centers
const BUBBLE_START_X = 32;  // first bubble X offset from slot left
const BUBBLE_ROW_Y = 58;    // Y offset from slot top to bubble center

// TF checkbox dimensions
const TF_START_X = 32;
const TF_GAP = 100;
const TF_ROW_Y = 40;

// -- Slot Heights Per Question Type -------------------------------------------
const SLOT_HEIGHTS: Record<string, number> = {
  'multiple-choice': 110,
  'true-false': 70,
  'fill-blank': 70,
  'fill-in-blank': 70,
  'short-answer': 130,
  'open-ended': 160,
  'essay': 160,
  'comprehension': 130,
  'word-bank': 70,
};

function getSlotHeight(type: string, matchingItemCount?: number): number {
  const t = type.toLowerCase();
  if (t === 'matching' || t.includes('match')) {
    const n = matchingItemCount || 6;
    return Math.min(30 + n * 22, 400); // cap at 400pt
  }
  return SLOT_HEIGHTS[t] || 110; // default to MC height
}

// -- Region Types -------------------------------------------------------------
export interface ScanBubble {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ScanRegion {
  bubbles?: ScanBubble[];
  checkboxes?: ScanBubble[];
  text_box?: { x: number; y: number; w: number; h: number };
}

export interface ScanSlotMeta {
  questionIndex: number;
  type: string;
  pageNumber: number;
  slotTopY: number;    // absolute Y from top of usable area on that page
  slotHeight: number;
  region: ScanRegion;
}

export interface ScanTemplateResult {
  html: string;
  slots: ScanSlotMeta[];
  pageCount: number;
}

// -- Helpers ------------------------------------------------------------------

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.substring(0, maxChars - 3) + '...';
}

function computeMcRegion(options: Array<{ label?: string; text?: string }> | string[]): ScanRegion {
  const bubbles: ScanBubble[] = [];
  const labels = ['A', 'B', 'C', 'D', 'E'];
  const count = Math.min(options.length, 5);

  // Layout: 2 columns, max 3 rows
  const COL_W = Math.floor(USABLE_W / 2);
  for (let i = 0; i < count; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    bubbles.push({
      label: labels[i],
      x: BUBBLE_START_X + col * COL_W,
      y: BUBBLE_ROW_Y + row * 22,
      w: BUBBLE_D,
      h: BUBBLE_D,
    });
  }
  return { bubbles };
}

function computeTfRegion(): ScanRegion {
  return {
    checkboxes: [
      { label: 'T', x: TF_START_X, y: TF_ROW_Y, w: BUBBLE_D, h: BUBBLE_D },
      { label: 'F', x: TF_START_X + TF_GAP, y: TF_ROW_Y, w: BUBBLE_D, h: BUBBLE_D },
    ],
  };
}

function computeTextBoxRegion(slotHeight: number, type: string): ScanRegion {
  const yStart = 35; // below question text
  return {
    text_box: {
      x: 10,
      y: yStart,
      w: USABLE_W - 20,
      h: slotHeight - yStart - 10,
    },
  };
}

// -- CSS Styles ---------------------------------------------------------------
const SCAN_CSS = `
@page {
  size: A4;
  margin: ${MARGIN}pt;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; color: #000; }
.scan-page { position: relative; width: ${USABLE_W}pt; }
.scan-header { border-bottom: 1pt solid #000; padding-bottom: 8pt; margin-bottom: 8pt; }
.scan-header-subsequent { height: ${HEADER_H_SUBSEQUENT}pt; }
.scan-slot { position: relative; border-bottom: 0.5pt solid #ccc; overflow: hidden; }
.scan-q-num { position: absolute; left: 0; top: 6pt; font-weight: 700; font-size: 11pt; width: 22pt; }
.scan-q-text { margin-left: 24pt; margin-right: 4pt; font-size: 10pt; line-height: 1.4; overflow: hidden; }
.scan-bubble-circle {
  width: ${BUBBLE_D}pt; height: ${BUBBLE_D}pt;
  border: 1.5pt solid #000; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 7pt; font-weight: 700;
}
.scan-checkbox {
  width: ${BUBBLE_D}pt; height: ${BUBBLE_D}pt;
  border: 1.5pt solid #000; border-radius: 2pt;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 7pt; font-weight: 700;
}
.scan-option-row { position: absolute; left: 0; width: 100%; }
.scan-option-item { position: absolute; display: flex; align-items: center; gap: 4pt; font-size: 9pt; }
.scan-ruled-line { border-bottom: 1pt solid #999; height: 24pt; margin: 4pt 24pt 0 24pt; }
.alignment-marker { position: fixed; width: ${MARKER_SIZE}pt; height: ${MARKER_SIZE}pt; background: #000; z-index: 9999; }
.marker-tl { top: ${MARKER_MARGIN}pt; left: ${MARKER_MARGIN}pt; }
.marker-bl { bottom: ${MARKER_MARGIN}pt; left: ${MARKER_MARGIN}pt; }
.marker-br { bottom: ${MARKER_MARGIN}pt; right: ${MARKER_MARGIN}pt; }
.scan-qr { position: fixed; top: ${MARKER_MARGIN}pt; right: ${MARKER_MARGIN}pt; width: 56pt; height: 56pt; z-index: 9998; }
`;

// -- Slot Renderers -----------------------------------------------------------

function renderMcSlot(
  idx: number, q: any, slotH: number, region: ScanRegion
): string {
  const options = q.options || [];
  const labels = ['A', 'B', 'C', 'D', 'E'];
  const bubbles = region.bubbles || [];

  let optionsHtml = '';
  for (let i = 0; i < bubbles.length; i++) {
    const b = bubbles[i];
    const optText = typeof options[i] === 'string' ? options[i] : (options[i]?.text || options[i]?.label || '');
    optionsHtml += `<div class="scan-option-item" style="left:${b.x}pt; top:${b.y}pt;">
      <span class="scan-bubble-circle">${labels[i]}</span>
      <span>${escapeHtml(truncate(optText, 40))}</span>
    </div>`;
  }

  return `<div class="scan-q-num">${idx + 1}.</div>
    <div class="scan-q-text" style="max-height:40pt;">${escapeHtml(truncate(q.question || '', 150))}</div>
    <div class="scan-option-row" style="top:0;">${optionsHtml}</div>`;
}

function renderTfSlot(
  idx: number, q: any, slotH: number, region: ScanRegion
): string {
  const checks = region.checkboxes || [];
  let checksHtml = '';
  for (const c of checks) {
    const label = c.label === 'T' ? 'True' : 'False';
    checksHtml += `<div class="scan-option-item" style="left:${c.x}pt; top:${c.y}pt;">
      <span class="scan-checkbox">${c.label}</span>
      <span>${label}</span>
    </div>`;
  }

  return `<div class="scan-q-num">${idx + 1}.</div>
    <div class="scan-q-text" style="max-height:28pt;">${escapeHtml(truncate(q.question || '', 120))}</div>
    <div class="scan-option-row" style="top:0;">${checksHtml}</div>`;
}

function renderTextSlot(
  idx: number, q: any, slotH: number, lineCount: number
): string {
  let lines = '';
  for (let i = 0; i < lineCount; i++) {
    lines += `<div class="scan-ruled-line"></div>`;
  }
  return `<div class="scan-q-num">${idx + 1}.</div>
    <div class="scan-q-text" style="max-height:28pt;">${escapeHtml(truncate(q.question || '', 120))}</div>
    <div style="margin-top: 4pt;">${lines}</div>`;
}

function renderMatchingSlot(
  idx: number, q: any, slotH: number
): string {
  const items = q.matchingItems?.columnA || q.options || [];
  const colB = q.matchingItems?.columnB || [];
  let html = `<div class="scan-q-num">${idx + 1}.</div>
    <div class="scan-q-text" style="max-height:20pt;">${escapeHtml(truncate(q.question || 'Match the following', 80))}</div>
    <div style="margin-top:4pt; margin-left:24pt; display:flex; gap:20pt;">
      <div style="flex:1;">`;

  for (let i = 0; i < items.length; i++) {
    const item = typeof items[i] === 'string' ? items[i] : (items[i]?.text || '');
    html += `<div style="display:flex; justify-content:space-between; height:20pt; align-items:center; border-bottom:0.5pt solid #ddd;">
      <span style="font-size:9pt;">${escapeHtml(truncate(item, 30))}</span>
      <span style="border-bottom:1pt solid #000; width:30pt;"></span>
    </div>`;
  }

  html += `</div><div style="flex:1;">`;
  for (let i = 0; i < colB.length; i++) {
    const item = typeof colB[i] === 'string' ? colB[i] : (colB[i]?.text || '');
    html += `<div style="height:20pt; display:flex; align-items:center; font-size:9pt;">
      ${String.fromCharCode(65 + i)}) ${escapeHtml(truncate(item, 30))}
    </div>`;
  }
  html += `</div></div>`;
  return html;
}

// -- Main Generator -----------------------------------------------------------

export function generateScanTemplate(
  questions: Array<any>,
  docMeta: { title: string; subject: string; gradeLevel: string; docId: string },
  qrCodeBase64?: string
): ScanTemplateResult {
  const slots: ScanSlotMeta[] = [];
  let pageNumber = 1;
  let currentY = 0;
  const availableH = (page: number) =>
    page === 1 ? (USABLE_H - HEADER_H_PAGE1) : (USABLE_H - HEADER_H_SUBSEQUENT);

  // Start building HTML
  let html = `<!DOCTYPE html><html><head><style>${SCAN_CSS}</style></head><body>`;

  // Alignment markers (fixed position -- appear on every page)
  html += `<div class="alignment-marker marker-tl"></div>`;
  html += `<div class="alignment-marker marker-bl"></div>`;
  html += `<div class="alignment-marker marker-br"></div>`;

  // QR code (fixed position -- appears on every page)
  if (qrCodeBase64) {
    html += `<img class="scan-qr" src="data:image/png;base64,${qrCodeBase64}" />`;
  } else {
    // QR placeholder -- will be injected server-side per student
    html += `<div class="scan-qr" style="border:1pt dashed #ccc;"></div>`;
  }

  // Start first page
  html += `<div class="scan-page" data-page="1">`;

  // Page 1 header: student info
  html += `<div class="scan-header" style="height:${HEADER_H_PAGE1}pt;">
    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div>
        <div style="font-size:13pt; font-weight:700; margin-bottom:6pt;">${escapeHtml(docMeta.title || docMeta.subject)}</div>
        <div style="font-size:9pt; color:#555;">Grade ${escapeHtml(docMeta.gradeLevel)} | ${escapeHtml(docMeta.subject)}</div>
      </div>
    </div>
    <div style="display:flex; gap:20pt; margin-top:10pt;">
      <div style="flex:1; border-bottom:1pt solid #000; padding-bottom:2pt; font-size:9pt;">Name: </div>
      <div style="width:100pt; border-bottom:1pt solid #000; padding-bottom:2pt; font-size:9pt;">Date: </div>
    </div>
  </div>`;

  currentY = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const qType = (q.type || 'multiple-choice').toLowerCase();
    const matchCount = q.matchingItems?.columnA?.length || q.options?.length;
    const slotH = getSlotHeight(qType, matchCount);

    // Check if we need a new page
    if (currentY + slotH > availableH(pageNumber)) {
      html += `</div>`; // close current page
      pageNumber++;
      currentY = 0;

      // Open new page
      html += `<div class="scan-page" data-page="${pageNumber}" style="page-break-before:always;">`;
      // Subsequent page: just a small spacer for the QR area
      html += `<div class="scan-header-subsequent"></div>`;
    }

    // Compute region for this question type
    let region: ScanRegion = {};
    let slotContent = '';

    if (qType === 'multiple-choice' || qType === 'mc') {
      region = computeMcRegion(q.options || ['', '', '', '']);
      slotContent = renderMcSlot(i, q, slotH, region);
    } else if (qType === 'true-false' || qType === 'true_false' || qType === 'tf') {
      region = computeTfRegion();
      slotContent = renderTfSlot(i, q, slotH, region);
    } else if (qType === 'fill-blank' || qType === 'fill-in-blank' || qType === 'word-bank') {
      region = computeTextBoxRegion(slotH, qType);
      slotContent = renderTextSlot(i, q, slotH, 1);
    } else if (qType === 'short-answer' || qType === 'comprehension') {
      region = computeTextBoxRegion(slotH, qType);
      slotContent = renderTextSlot(i, q, slotH, 3);
    } else if (qType === 'open-ended' || qType === 'essay') {
      region = computeTextBoxRegion(slotH, qType);
      slotContent = renderTextSlot(i, q, slotH, 4);
    } else if (qType === 'matching' || qType.includes('match')) {
      region = computeTextBoxRegion(slotH, qType);
      slotContent = renderMatchingSlot(i, q, slotH);
    } else {
      // Unknown type -- treat as short answer
      region = computeTextBoxRegion(slotH, qType);
      slotContent = renderTextSlot(i, q, slotH, 2);
    }

    // Record slot metadata
    slots.push({
      questionIndex: i,
      type: qType,
      pageNumber,
      slotTopY: currentY,
      slotHeight: slotH,
      region,
    });

    // Render slot div with data attributes
    html += `<div class="scan-slot" data-q="${i}" data-type="${qType}" data-slot-height="${slotH}" data-region='${JSON.stringify(region).replace(/'/g, "&#39;")}' style="height:${slotH}pt;">`;
    html += slotContent;
    html += `</div>`;

    currentY += slotH;
  }

  // Close last page
  html += `</div>`;
  html += `</body></html>`;

  return { html, slots, pageCount: pageNumber };
}

/**
 * Build an AnswerRegionTemplate from slots (for sending to backend).
 * Converts relative slot coordinates to absolute page coordinates.
 */
export function buildTemplateFromSlots(
  slots: ScanSlotMeta[],
  docId: string,
  docType: 'quiz' | 'worksheet'
): {
  doc_id: string;
  doc_type: string;
  page_size: string;
  regions: Array<any>;
  alignment_markers: Array<any>;
  qr_position: any;
  slots_json: string;
} {
  const regions: Array<any> = [];

  // Group slots by page to compute absolute Y
  const pageSlots = new Map<number, ScanSlotMeta[]>();
  for (const s of slots) {
    const arr = pageSlots.get(s.pageNumber) || [];
    arr.push(s);
    pageSlots.set(s.pageNumber, arr);
  }

  for (const [pageNum, pageSlotsArr] of pageSlots) {
    const headerH = pageNum === 1 ? HEADER_H_PAGE1 : HEADER_H_SUBSEQUENT;

    for (const slot of pageSlotsArr) {
      const absY = MARGIN + headerH + slot.slotTopY;
      const absX = MARGIN;

      const r = slot.region;
      const regionEntry: any = {
        question_index: slot.questionIndex,
        type: slot.type === 'true-false' || slot.type === 'tf' ? 'true-false' :
              slot.type === 'multiple-choice' || slot.type === 'mc' ? 'multiple-choice' :
              slot.type.includes('fill') || slot.type === 'word-bank' ? 'fill-blank' : 'open-answer',
        page: pageNum,
      };

      if (r.bubbles) {
        regionEntry.bubbles = r.bubbles.map(b => ({
          label: b.label,
          x: Math.round(absX + b.x),
          y: Math.round(absY + b.y),
          w: b.w,
          h: b.h,
        }));
      } else if (r.checkboxes) {
        regionEntry.checkboxes = r.checkboxes.map(c => ({
          label: c.label,
          x: Math.round(absX + c.x),
          y: Math.round(absY + c.y),
          w: c.w,
          h: c.h,
        }));
      } else if (r.text_box) {
        regionEntry.text_box = {
          x: Math.round(absX + r.text_box.x),
          y: Math.round(absY + r.text_box.y),
          w: r.text_box.w,
          h: r.text_box.h,
        };
      }

      regions.push(regionEntry);
    }
  }

  return {
    doc_id: docId,
    doc_type: docType,
    page_size: 'a4',
    regions,
    alignment_markers: [
      { position: 'top-left', x: MARKER_MARGIN, y: MARKER_MARGIN, w: MARKER_SIZE, h: MARKER_SIZE },
      { position: 'bottom-left', x: MARKER_MARGIN, y: PAGE_H - MARKER_MARGIN - MARKER_SIZE, w: MARKER_SIZE, h: MARKER_SIZE },
      { position: 'bottom-right', x: PAGE_W - MARKER_MARGIN - MARKER_SIZE, y: PAGE_H - MARKER_MARGIN - MARKER_SIZE, w: MARKER_SIZE, h: MARKER_SIZE },
    ],
    qr_position: { x: PAGE_W - MARGIN - 56, y: MARKER_MARGIN, w: 56, h: 56 },
    slots_json: JSON.stringify(slots),
  };
}
