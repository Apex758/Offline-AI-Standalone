// utils/answerRegionGenerator.ts
// Generates answer region templates from bubble post-processing results
// These templates tell the scanner exactly where bubbles are on the printed page

import type { BubbleRegion } from './bubblePostProcessor';

// Standard letter page at 96 DPI (used by HTML-to-PDF export)
const PAGE_WIDTH_PX = 612;
const PAGE_HEIGHT_PX = 792;

// Bubble dimensions (must match CSS in bubblePostProcessor.ts)
const BUBBLE_SIZE_PX = 18;

export interface AnswerRegionTemplate {
  doc_id: string;
  doc_type: 'quiz' | 'worksheet';
  page_size: string;
  regions: AnswerRegion[];
  alignment_markers: AlignmentMarker[];
  qr_position: { x: number; y: number; w: number; h: number };
}

export interface AnswerRegion {
  question_index: number;
  type: 'multiple-choice' | 'true-false' | 'open-answer' | 'fill-blank';
  bubbles?: Array<{ label: string; x: number; y: number; w: number; h: number }>;
  checkboxes?: Array<{ label: string; x: number; y: number; w: number; h: number }>;
  text_box?: { x: number; y: number; w: number; h: number };
}

export interface AlignmentMarker {
  position: 'top-left' | 'bottom-left' | 'bottom-right';
  x: number;
  y: number;
  w: number;
  h: number;
}

// Standard alignment marker positions (must match add_alignment_markers_to_html in export_utils.py)
// Markers are 5mm = ~19px squares positioned 5mm from edges
const ALIGNMENT_MARKERS: AlignmentMarker[] = [
  { position: 'top-left', x: 19, y: 19, w: 19, h: 19 },
  { position: 'bottom-left', x: 19, y: PAGE_HEIGHT_PX - 38, w: 19, h: 19 },
  { position: 'bottom-right', x: PAGE_WIDTH_PX - 38, y: PAGE_HEIGHT_PX - 38, w: 19, h: 19 },
];

// Standard QR position (top-right, 5mm from edge, 20mm = ~76px square)
const QR_POSITION = { x: PAGE_WIDTH_PX - 95, y: 19, w: 76, h: 76 };

function estimateQuestionHeight(
  q: { type?: string; question?: string; options?: unknown[] },
): number {
  const qType = (q.type || '').toLowerCase();
  const textLines = Math.ceil((q.question || '').length / 60);
  const textHeight = Math.max(30, textLines * 22);

  if (qType.includes('multiple-choice') || qType === 'mc') {
    return textHeight + 20 + ((q.options as any[])?.length || 4) * 28;
  } else if (qType.includes('true') || qType.includes('false')) {
    return textHeight + 40;
  } else if (qType.includes('fill') || qType.includes('blank')) {
    return textHeight + 40;
  } else if (qType.includes('short') || qType.includes('open') || qType.includes('essay')) {
    return textHeight + 80;
  } else if (qType.includes('match')) {
    return textHeight + 200;
  }
  return textHeight + 60;
}

/**
 * Generate answer region templates from bubble regions and question metadata.
 *
 * Since we can't measure actual pixel positions from the HTML rendering
 * (that happens server-side in the PDF exporter), we generate relative
 * positions based on the bubble IDs and standard page layout.
 *
 * For accurate positions, the backend PDF renderer should measure actual
 * element positions during export. This function provides a best-effort
 * estimate based on document structure.
 */
export function generateAnswerRegions(
  bubbleRegions: BubbleRegion[],
  questions: Array<{ type?: string; question?: string }>,
  docId: string,
  docType: 'quiz' | 'worksheet'
): AnswerRegionTemplate {
  const regions: AnswerRegion[] = [];

  // Group bubble regions by question index
  const bubblesByQuestion = new Map<number, BubbleRegion[]>();
  for (const br of bubbleRegions) {
    const existing = bubblesByQuestion.get(br.questionIndex) || [];
    existing.push(br);
    bubblesByQuestion.set(br.questionIndex, existing);
  }

  // Layout constants for estimating positions
  // These assume standard quiz layout: ~80px header, ~60px per question
  const CONTENT_TOP = 120; // below header + QR area
  const CONTENT_LEFT = 50; // left margin
  const OPTION_START_X = 70; // options indented from question
  const OPTION_SPACING_X = 130; // horizontal spacing between bubble options

  let questionY = CONTENT_TOP;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const qType = q.type?.toLowerCase() || '';
    const qBubbles = bubblesByQuestion.get(i);

    if (qBubbles && qBubbles.length > 0) {
      // This question has bubbles -- it's MC or TF
      const isTF = qBubbles.length === 2 &&
        qBubbles.some(b => b.optionLabel === 'T') &&
        qBubbles.some(b => b.optionLabel === 'F');

      if (isTF) {
        regions.push({
          question_index: i,
          type: 'true-false',
          checkboxes: qBubbles.map((b, j) => ({
            label: b.optionLabel,
            x: OPTION_START_X + j * OPTION_SPACING_X,
            y: questionY + 30, // options below question text
            w: BUBBLE_SIZE_PX,
            h: BUBBLE_SIZE_PX,
          })),
        });
      } else {
        regions.push({
          question_index: i,
          type: 'multiple-choice',
          bubbles: qBubbles.map((b, j) => ({
            label: b.optionLabel,
            x: OPTION_START_X + j * OPTION_SPACING_X,
            y: questionY + 30,
            w: BUBBLE_SIZE_PX,
            h: BUBBLE_SIZE_PX,
          })),
        });
      }
    } else if (qType.includes('fill') || qType.includes('blank')) {
      regions.push({
        question_index: i,
        type: 'fill-blank',
        text_box: {
          x: OPTION_START_X,
          y: questionY + 25,
          w: PAGE_WIDTH_PX - 2 * OPTION_START_X,
          h: 30,
        },
      });
    } else if (qType.includes('open') || qType.includes('short') || qType.includes('essay')) {
      regions.push({
        question_index: i,
        type: 'open-answer',
        text_box: {
          x: CONTENT_LEFT,
          y: questionY + 25,
          w: PAGE_WIDTH_PX - 2 * CONTENT_LEFT,
          h: 60,
        },
      });
    } else if (qType.includes('match')) {
      // Matching: emit as needs_ocr region covering the matching grid area
      const matchingItemCount = (q as any).matchingItems?.columnA?.length ??
                                 (q as any).options?.length ?? 8;
      const estimatedHeight = 40 + matchingItemCount * 48;
      regions.push({
        question_index: i,
        type: 'open-answer',
        text_box: {
          x: CONTENT_LEFT,
          y: questionY,
          w: Math.floor((PAGE_WIDTH_PX - 2 * CONTENT_LEFT) / 2),
          h: Math.min(estimatedHeight, PAGE_HEIGHT_PX - questionY - 40),
        },
      });
    } else if (qType.includes('word') || qType.includes('bank')) {
      // Word-bank: emit as fill-blank OCR region
      regions.push({
        question_index: i,
        type: 'fill-blank',
        text_box: {
          x: CONTENT_LEFT,
          y: questionY + 20,
          w: PAGE_WIDTH_PX - 2 * CONTENT_LEFT,
          h: 35,
        },
      });
    }
    questionY += estimateQuestionHeight(q);
  }

  return {
    doc_id: docId,
    doc_type: docType,
    page_size: 'letter',
    regions,
    alignment_markers: ALIGNMENT_MARKERS,
    qr_position: QR_POSITION,
  };
}
