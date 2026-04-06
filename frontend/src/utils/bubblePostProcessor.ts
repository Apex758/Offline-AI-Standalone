// utils/bubblePostProcessor.ts
// Post-processes quiz/worksheet HTML to replace text MC options with scannable bubble circles

export interface BubbleRegion {
  questionIndex: number;
  optionLabel: string;
  // CSS class-based identifier for this bubble
  bubbleId: string;
}

export interface BubblePostProcessResult {
  html: string;
  regions: BubbleRegion[];
}

// Inline styles for bubble circles — must be inline for PDF export compatibility
const BUBBLE_STYLES = `
.scan-bubble-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 6px 0;
  align-items: center;
}
.scan-bubble-option {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: default;
}
.scan-bubble {
  width: 18px;
  height: 18px;
  border: 2px solid #000;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  font-family: Arial, sans-serif;
  color: #000;
  background: #fff;
  flex-shrink: 0;
  box-sizing: border-box;
}
.scan-bubble-text {
  font-size: 13px;
  line-height: 1.3;
}
`;

/**
 * Creates a bubble HTML element for a single option
 */
function createBubbleOption(label: string, text: string, questionIndex: number): string {
  const bubbleId = `bubble-q${questionIndex}-${label.toLowerCase()}`;
  return `<span class="scan-bubble-option" data-question="${questionIndex}" data-option="${label}">` +
    `<span class="scan-bubble" id="${bubbleId}">${label}</span>` +
    `<span class="scan-bubble-text">${text}</span>` +
    `</span>`;
}

/**
 * Injects the bubble CSS styles into the HTML <head> or before </head>
 */
function injectBubbleStyles(html: string): string {
  const styleTag = `<style class="scan-bubble-styles">${BUBBLE_STYLES}</style>`;

  // Try inserting before </head>
  if (html.includes('</head>')) {
    return html.replace('</head>', `${styleTag}</head>`);
  }
  // Fallback: insert at beginning of <body> or just prepend
  if (html.includes('<body')) {
    return html.replace(/<body([^>]*)>/, `<body$1>${styleTag}`);
  }
  return styleTag + html;
}

/**
 * Regex patterns to match common MC option formats in rendered HTML.
 * These match the output of quizHtmlRenderer and worksheetHtmlRenderer.
 */

// Pattern: matches a block of MC options (A through D/E)
// Handles formats like: A) text, A. text, (A) text
const MC_OPTION_LINE_REGEX = /^([A-E])[).]\s*(.+)$/;

// Pattern for True/False options
const TF_OPTION_REGEX = /^(True|False|T|F)[).]?\s*$/i;

/**
 * Post-process a single question's options HTML to use bubbles.
 *
 * Takes the inner HTML of an options container and returns bubble-ified version.
 */
function processOptionsBlock(optionsHtml: string, questionIndex: number): { html: string; regions: BubbleRegion[] } {
  const regions: BubbleRegion[] = [];

  // Check if this contains MC-style options by looking for option patterns
  // Split by common delimiters: <br>, <div>, <p>, newlines
  const lines = optionsHtml
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(div|p|li)[^>]*>/gi, '\n')
    .split('\n')
    .map(l => l.replace(/<[^>]+>/g, '').trim())
    .filter(l => l.length > 0);

  const mcOptions: Array<{ label: string; text: string }> = [];
  const tfOptions: Array<{ label: string; text: string }> = [];

  for (const line of lines) {
    const mcMatch = line.match(MC_OPTION_LINE_REGEX);
    if (mcMatch) {
      mcOptions.push({ label: mcMatch[1], text: mcMatch[2] });
      continue;
    }
    const tfMatch = line.match(TF_OPTION_REGEX);
    if (tfMatch) {
      const label = tfMatch[1][0].toUpperCase(); // T or F
      tfOptions.push({ label, text: tfMatch[1].length === 1 ? (label === 'T' ? 'True' : 'False') : tfMatch[1] });
    }
  }

  // If we found MC options, replace with bubbles
  if (mcOptions.length >= 2) {
    const bubbleHtml = '<div class="scan-bubble-row">' +
      mcOptions.map(opt => {
        regions.push({
          questionIndex,
          optionLabel: opt.label,
          bubbleId: `bubble-q${questionIndex}-${opt.label.toLowerCase()}`
        });
        return createBubbleOption(opt.label, opt.text, questionIndex);
      }).join('') +
      '</div>';
    return { html: bubbleHtml, regions };
  }

  // If we found T/F options, replace with bubbles
  if (tfOptions.length === 2) {
    const bubbleHtml = '<div class="scan-bubble-row">' +
      tfOptions.map(opt => {
        regions.push({
          questionIndex,
          optionLabel: opt.label,
          bubbleId: `bubble-q${questionIndex}-${opt.label.toLowerCase()}`
        });
        return createBubbleOption(opt.label, opt.text, questionIndex);
      }).join('') +
      '</div>';
    return { html: bubbleHtml, regions };
  }

  // Not MC/TF — return unchanged (fill-in-blank, short answer, etc.)
  return { html: optionsHtml, regions: [] };
}

/**
 * Main entry point: post-process rendered HTML to add scannable bubbles.
 *
 * Looks for option containers in the HTML and replaces MC/TF options with bubbles.
 * Returns the modified HTML and a list of bubble regions for template generation.
 */
export function addBubblesToHtml(html: string): BubblePostProcessResult {
  const allRegions: BubbleRegion[] = [];
  let processedHtml = html;

  // Strategy: Find option containers by common patterns in the rendered HTML.
  // The quiz renderer uses div.quiz-options or similar containers.
  // We look for blocks that contain sequential A), B), C), D) patterns.

  // Pattern 1: Find divs/spans that contain "A)" through "D)" option text
  // This regex finds blocks between question text and the next question
  const questionBlockRegex = /(<div[^>]*class="[^"]*(?:quiz-options|options|question-options|mc-options)[^"]*"[^>]*>)([\s\S]*?)(<\/div>)/gi;

  let match;
  let offset = 0;
  const tempHtml = processedHtml;

  // First pass: try to find option containers by class name
  let questionIndex = 0;
  while ((match = questionBlockRegex.exec(tempHtml)) !== null) {
    const fullMatch = match[0];
    const openTag = match[1];
    const innerHtml = match[2];
    const closeTag = match[3];

    const { html: newInner, regions } = processOptionsBlock(innerHtml, questionIndex);

    if (regions.length > 0) {
      const replacement = openTag + newInner + closeTag;
      const matchStart = match.index + offset;
      processedHtml = processedHtml.substring(0, matchStart) + replacement + processedHtml.substring(matchStart + fullMatch.length);
      offset += replacement.length - fullMatch.length;
      allRegions.push(...regions);
    }
    questionIndex++;
  }

  // Second pass: if no option containers found by class, try a more general approach
  // Look for consecutive lines matching "A) ... B) ... C) ... D) ..." patterns
  if (allRegions.length === 0) {
    // Find sequences of option lines: A) text<br>B) text<br>C) text<br>D) text
    const generalOptionRegex = /(?:<(?:p|div|span)[^>]*>)?\s*([A-E])[).]\s*([^<\n]+?)(?:<\/(?:p|div|span)>|<br\s*\/?>|\n)/gi;

    let currentQ = -1;
    let optionBuffer: Array<{ label: string; text: string; fullMatch: string; index: number }> = [];
    let lastLabel = '';

    const flushBuffer = () => {
      if (optionBuffer.length >= 2) {
        // We have a valid set of options — this is an MC question
        const qIdx = ++currentQ;

        // Build bubble HTML
        const bubbleHtml = '<div class="scan-bubble-row">' +
          optionBuffer.map(opt => {
            allRegions.push({
              questionIndex: qIdx,
              optionLabel: opt.label,
              bubbleId: `bubble-q${qIdx}-${opt.label.toLowerCase()}`
            });
            return createBubbleOption(opt.label, opt.text, qIdx);
          }).join('') +
          '</div>';

        // Replace the original option lines with the bubble row
        // We replace from the first option to the last
        const firstIdx = optionBuffer[0].index;
        const lastOpt = optionBuffer[optionBuffer.length - 1];
        const lastIdx = lastOpt.index + lastOpt.fullMatch.length;

        const before = processedHtml.substring(0, firstIdx);
        const after = processedHtml.substring(lastIdx);
        processedHtml = before + bubbleHtml + after;

        // Adjust offset for subsequent replacements
        // Note: this approach processes in-order, so offsets accumulate
      }
      optionBuffer = [];
    };

    generalOptionRegex.lastIndex = 0;
    let gMatch;
    while ((gMatch = generalOptionRegex.exec(processedHtml)) !== null) {
      const label = gMatch[1].toUpperCase();
      const text = gMatch[2].trim();

      // Check if this continues a sequence
      const expectedNext = lastLabel ? String.fromCharCode(lastLabel.charCodeAt(0) + 1) : 'A';

      if (label === 'A') {
        flushBuffer();
        optionBuffer = [{ label, text, fullMatch: gMatch[0], index: gMatch.index }];
        lastLabel = label;
      } else if (label === expectedNext && optionBuffer.length > 0) {
        optionBuffer.push({ label, text, fullMatch: gMatch[0], index: gMatch.index });
        lastLabel = label;
      } else {
        flushBuffer();
        lastLabel = '';
      }
    }
    flushBuffer();
  }

  // Inject bubble CSS styles if we made any replacements
  if (allRegions.length > 0) {
    processedHtml = injectBubbleStyles(processedHtml);
  }

  return {
    html: processedHtml,
    regions: allRegions
  };
}

/**
 * Check if an HTML document already has bubble post-processing applied.
 */
export function hasBubbles(html: string): boolean {
  return html.includes('scan-bubble-styles') || html.includes('scan-bubble-row');
}
