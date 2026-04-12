/**
 * Storybook export utilities — PDF, PPTX, and Animated HTML
 *
 * PDF:           HTML → /api/export (WeasyPrint backend)
 * PPTX:          pptxgenjs, each page = one slide
 * Animated HTML: Self-contained file with embedded base64 images + WAV audio
 *                + CSS animations + JS player. No internet required.
 */

import type { ParsedStorybook, StoryPage, StorybookFormData } from '../types/storybook';
import { BUNDLED_SCENES } from '../data/storybookScenes';
import { buildSpeechBubbleSVGText, shouldUseBubble, getTailDirection } from './speechBubble';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const SCENE_BG_COLORS: Record<string, string> = {
  outdoors: '#d1fae5',
  indoors:  '#fef3c7',
  fantasy:  '#ede9fe',
  weather:  '#dbeafe',
};

function getPageBgColor(page: StoryPage): string {
  if (page.bundledSceneId) {
    const scene = BUNDLED_SCENES.find(s => s.id === page.bundledSceneId);
    return scene ? SCENE_BG_COLORS[scene.category] || '#f3f4f6' : '#f3f4f6';
  }
  return '#f9fafb';
}

function buildPageHtml(page: StoryPage, accentColor = '#a855f7'): string {
  const bgColor = getPageBgColor(page);
  const hasChar = page.characterImageData && page.imagePlacement !== 'none';

  const charSide = page.imagePlacement === 'left' ? 'float:left;margin-right:16px;' :
                   page.imagePlacement === 'right' ? 'float:right;margin-left:16px;' : '';

  // Build character image + speech bubble as a positioned block
  let charHtml = '';
  if (hasChar) {
    const tailDir = getTailDirection(page);
    // Find last character dialogue for the static PDF bubble
    const charSegs = page.textSegments.filter(s => shouldUseBubble(s, page));
    const bubbleSeg = charSegs.length > 0 ? charSegs[charSegs.length - 1] : null;
    const bubbleSvg = bubbleSeg
      ? `<div style="margin-bottom:4px;">${buildSpeechBubbleSVGText({ text: bubbleSeg.text, tailDirection: tailDir, context: 'pdf' })}</div>`
      : '';
    charHtml = `<div style="${charSide}width:180px;">
      ${bubbleSvg}
      <img src="${page.characterImageData}" style="width:140px;border-radius:8px;" />
    </div>`;
  }

  // Narrator text (and fallback character text when no image)
  const textHtml = page.textSegments.map(seg => {
    const isNarrator = seg.speaker === 'narrator';
    const isBubbled = shouldUseBubble(seg, page);
    // Skip character segments that are rendered as bubbles
    if (isBubbled) return '';
    return `<p style="font-family:Georgia,serif;font-size:14pt;line-height:1.7;margin:0 0 8px 0;${isNarrator ? 'font-style:italic;' : 'font-weight:600;'}">
      ${isNarrator ? '' : `<span style="display:block;font-size:9pt;font-weight:bold;color:${accentColor};font-style:normal;">${seg.speaker}:</span>`}
      ${isNarrator ? seg.text : `&ldquo;${seg.text}&rdquo;`}
    </p>`;
  }).join('');

  const bgImageStyle = page.backgroundImageData
    ? `background-image:url(${page.backgroundImageData});background-size:cover;background-position:center;`
    : `background-color:${bgColor};`;

  return `
    <div style="page-break-after:always;min-height:280px;padding:32px 40px;${bgImageStyle}border-radius:0;position:relative;">
      ${page.backgroundImageData ? `<div style="position:absolute;inset:0;background:rgba(255,255,255,0.55);border-radius:inherit;"></div>` : ''}
      <div style="position:relative;z-index:1;">
        ${charHtml}
        <div style="overflow:hidden;">${textHtml}</div>
        <div style="clear:both;"></div>
        <div style="margin-top:12px;text-align:right;font-size:8pt;color:#9ca3af;">${page.pageNumber}</div>
      </div>
    </div>`;
}

// ─── PDF Export ───────────────────────────────────────────────────────────────

export async function exportStorybookPDF(
  book: ParsedStorybook,
  formData: StorybookFormData,
  accentColor = '#a855f7',
): Promise<void> {
  const gradeLabel = formData.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${formData.gradeLevel}`;
  const subjectLine = formData.subject ? ` • ${formData.subject}` : '';

  const cover = book.coverPage;
  const coverTitle = cover?.title || book.title;
  const coverSubtitle = cover?.subtitle || `${gradeLabel}${subjectLine}`;
  const coverAuthor = cover?.authorName ? `<p style="font-family:Georgia,serif;font-size:13pt;color:${cover.coverImageData ? 'rgba(255,255,255,0.85)' : accentColor};margin:12px 0 0 0;">by ${cover.authorName}</p>` : '';
  const coverBgStyle = cover?.coverImageData
    ? `background-image:url(${cover.coverImageData});background-size:cover;background-position:center;`
    : `background:linear-gradient(135deg,${accentColor}22,${accentColor}08);`;
  const coverOverlay = cover?.coverImageData
    ? `<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.65),rgba(0,0,0,0.2));"></div>`
    : '';
  const coverTextColor = cover?.coverImageData ? '#ffffff' : '#1f2937';
  const coverSubColor = cover?.coverImageData ? 'rgba(255,255,255,0.7)' : '#6b7280';

  const coverHtml = `
    <div style="page-break-after:always;min-height:350px;display:flex;flex-direction:column;align-items:center;justify-content:center;${coverBgStyle}padding:60px 40px;text-align:center;position:relative;">
      ${coverOverlay}
      <div style="position:relative;z-index:1;">
        ${!cover?.coverImageData ? `<div style="width:64px;height:64px;margin:0 auto 16px;border-radius:16px;background:${accentColor}22;display:flex;align-items:center;justify-content:center;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${accentColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>` : ''}
        <h1 style="font-family:Georgia,serif;font-size:28pt;font-weight:bold;color:${coverTextColor};margin:0 0 8px 0;">${coverTitle}</h1>
        <p style="font-family:sans-serif;font-size:11pt;color:${coverSubColor};margin:0;">${coverSubtitle}</p>
        ${coverAuthor}
      </div>
    </div>`;

  const pagesHtml = book.pages.map(p => buildPageHtml(p, accentColor)).join('');

  // Comprehension questions page
  let questionsHtml = '';
  if (book.comprehensionQuestions && book.comprehensionQuestions.length > 0) {
    const qItems = book.comprehensionQuestions.map((q, i) => `
      <div style="margin-bottom:16px;">
        <p style="font-weight:bold;margin:0 0 4px 0;">${i + 1}. ${q.question}</p>
        <p style="color:#6b7280;margin:0 0 4px 0;font-size:10pt;font-style:italic;">Expected: ${q.answer}</p>
      </div>`).join('');
    questionsHtml = `
      <div style="page-break-before:always;padding:40px;">
        <h2 style="font-family:Georgia,serif;font-size:18pt;color:${accentColor};margin-bottom:24px;">Comprehension Questions</h2>
        ${book.learningObjectiveSummary ? `<p style="background:${accentColor}18;border-left:3px solid ${accentColor};padding:8px 12px;margin-bottom:24px;font-size:10pt;">${book.learningObjectiveSummary}</p>` : ''}
        ${qItems}
      </div>`;
  }

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>body{margin:0;padding:0;}@page{margin:0;size:A5 landscape;}</style>
</head><body>${coverHtml}${pagesHtml}${questionsHtml}</body></html>`;

  const isElectron = typeof window !== 'undefined' && 'electronAPI' in window;
  const apiBase = isElectron ? 'http://127.0.0.1:8000' : 'http://localhost:8000';

  const res = await fetch(`${apiBase}/api/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, title: book.title, format: 'pdf' }),
  });
  if (!res.ok) throw new Error('PDF export failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(book.title)}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── PPTX Export ──────────────────────────────────────────────────────────────

export async function exportStorybookPPTX(
  book: ParsedStorybook,
  formData: StorybookFormData,
  accentColor = '#a855f7',
): Promise<void> {
  const pptxgen = (await import('pptxgenjs')).default;
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  const hexColor = accentColor.replace('#', '');

  // Cover slide
  const coverSlide = pptx.addSlide();
  const coverData = book.coverPage;
  if (coverData?.coverImageData) {
    coverSlide.addImage({ data: coverData.coverImageData, x: 0, y: 0, w: '100%', h: '100%' });
    // Dark overlay for text readability
    coverSlide.addShape('rect' as any, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: '000000', transparency: 50 } });
  } else {
    coverSlide.background = { color: 'F9F5FF' };
  }
  const coverTitleColor = coverData?.coverImageData ? 'FFFFFF' : hexColor;
  const coverSubColor = coverData?.coverImageData ? 'CCCCCC' : '6B7280';
  coverSlide.addText(coverData?.title || book.title, {
    x: 1, y: 1.8, w: '80%', h: 1.2,
    fontSize: 32, bold: true, align: 'center',
    fontFace: 'Georgia',
    color: coverTitleColor,
  });
  const gradeLabel = formData.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${formData.gradeLevel}`;
  coverSlide.addText(coverData?.subtitle || (gradeLabel + (formData.subject ? ` • ${formData.subject}` : '')), {
    x: 1, y: 3.2, w: '80%', h: 0.5,
    fontSize: 14, align: 'center', color: coverSubColor,
  });
  if (coverData?.authorName) {
    coverSlide.addText(`by ${coverData.authorName}`, {
      x: 1, y: 3.8, w: '80%', h: 0.5,
      fontSize: 13, align: 'center', color: coverData.coverImageData ? 'DDDDDD' : hexColor,
      fontFace: 'Georgia', italic: true,
    });
  }

  // Story slides
  for (const page of book.pages) {
    const slide = pptx.addSlide();

    // Background color
    const bgColor = getPageBgColor(page).replace('#', '');
    slide.background = { color: bgColor.padEnd(6, '0').slice(0, 6) };

    // Background image overlay
    if (page.backgroundImageData) {
      slide.addImage({ data: page.backgroundImageData, x: 0, y: 0, w: '100%', h: '100%', transparency: 50 });
    }

    // Character image + speech bubble
    const hasCharPptx = page.characterImageData && page.imagePlacement !== 'none';
    if (hasCharPptx) {
      const imgX = page.imagePlacement === 'right' ? 7.2 : 0.2;
      slide.addImage({ data: page.characterImageData, x: imgX, y: 0.5, w: 2.2, h: 3.5 });

      // Speech bubble for last character dialogue
      const charSegsPptx = page.textSegments.filter(s => shouldUseBubble(s, page));
      if (charSegsPptx.length > 0) {
        const bubbleSeg = charSegsPptx[charSegsPptx.length - 1];
        const bubbleX = page.imagePlacement === 'left' ? 2.5 : 4.5;
        const bubbleW = 3.2;
        const bubbleH = Math.min(1.8, 0.5 + bubbleSeg.text.length * 0.012);
        slide.addShape('roundRect' as any, {
          x: bubbleX, y: 0.3, w: bubbleW, h: bubbleH,
          fill: { color: 'FFFFFF' },
          line: { color: 'D1D5DB', width: 1 },
          rectRadius: 0.15,
          shadow: { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.15 },
        });
        slide.addText(bubbleSeg.text, {
          x: bubbleX + 0.15, y: 0.4, w: bubbleW - 0.3, h: bubbleH - 0.2,
          fontSize: 13, fontFace: 'Georgia',
          color: '1F2937', wrap: true, valign: 'middle',
        });
      }
    }

    // Text — narrator segments + fallback character text (when no char image)
    const textX = hasCharPptx && page.imagePlacement === 'left' ? 2.8 : 0.4;
    const textW = hasCharPptx ? 6.4 : 9.2;

    const textContent = page.textSegments
      .filter(seg => !shouldUseBubble(seg, page))
      .map(seg => {
        const isNarrator = seg.speaker === 'narrator';
        return isNarrator ? seg.text : `${seg.speaker}: "${seg.text}"`;
      }).join('\n\n');

    if (textContent.trim()) {
      slide.addText(textContent, {
        x: textX, y: 0.6, w: textW, h: 4,
        fontSize: 18, fontFace: 'Georgia',
        italic: page.textSegments.filter(s => !shouldUseBubble(s, page))[0]?.speaker === 'narrator',
        valign: 'middle',
        color: '1F2937',
        wrap: true,
      });
    }

    // Page number
    slide.addText(`${page.pageNumber}`, {
      x: 8.8, y: 4.8, w: 0.8, h: 0.3,
      fontSize: 9, color: '9CA3AF', align: 'right',
    });
  }

  // Comprehension questions slide
  if (book.comprehensionQuestions && book.comprehensionQuestions.length > 0) {
    const qSlide = pptx.addSlide();
    qSlide.background = { color: 'FAFAFA' };
    qSlide.addText('Comprehension Questions', {
      x: 0.5, y: 0.3, w: 9, h: 0.7,
      fontSize: 22, bold: true, color: hexColor, fontFace: 'Georgia',
    });
    const qLines = book.comprehensionQuestions.map((q, i) => `${i + 1}. ${q.question}`).join('\n');
    qSlide.addText(qLines, {
      x: 0.5, y: 1.2, w: 9, h: 4,
      fontSize: 13, color: '374151', wrap: true, valign: 'top',
      bullet: false,
    });
  }

  await pptx.writeFile({ fileName: `${slugify(book.title)}.pptx` });
}

// ─── TTS Audio Pre-generation ──────────────────────────────────────────────────

/** Fetch TTS audio as a raw Blob (WAV). Shared by save, export, and playback. */
export async function fetchTTSBlob(text: string, voice: string, language?: string): Promise<Blob> {
  const isElectron = typeof window !== 'undefined' && 'electronAPI' in window;
  const apiBase = isElectron ? 'http://127.0.0.1:8000' : 'http://localhost:8000';

  const res = await fetch(`${apiBase}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice, ...(language ? { language } : {}) }),
  });
  if (!res.ok) throw new Error('TTS failed');
  return res.blob();
}

async function fetchAudioBase64(text: string, voice: string, language?: string): Promise<string> {
  const blob = await fetchTTSBlob(text, voice, language);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export interface AnimatedHTMLProgress {
  current: number;
  total: number;
  label: string;
}

// ─── Animated HTML Export ─────────────────────────────────────────────────────

export async function exportAnimatedHTML(
  book: ParsedStorybook,
  formData: StorybookFormData,
  accentColor = '#a855f7',
  onProgress?: (p: AnimatedHTMLProgress) => void,
  language?: string,
): Promise<void> {
  const totalSegments = book.pages.reduce((sum, p) => sum + p.textSegments.length, 0);
  let processed = 0;

  // Pre-generate all audio segments
  interface PageAudio { pageIdx: number; segIdx: number; base64: string; }
  const audioData: PageAudio[] = [];

  for (let pi = 0; pi < book.pages.length; pi++) {
    const page = book.pages[pi];
    for (let si = 0; si < page.textSegments.length; si++) {
      const seg = page.textSegments[si];
      const voice = book.voiceAssignments?.[seg.speaker] || 'lessac';
      onProgress?.({ current: processed, total: totalSegments, label: `Generating audio (page ${pi + 1})...` });
      try {
        const b64 = await fetchAudioBase64(seg.text, voice, language);
        audioData.push({ pageIdx: pi, segIdx: si, base64: b64 });
      } catch {
        // TTS failed for this segment — skip audio
      }
      processed++;
    }
  }

  onProgress?.({ current: totalSegments, total: totalSegments, label: 'Building HTML...' });

  // Build page data JSON (embedded in HTML)
  const pagesData = book.pages.map((page, pi) => ({
    pageNumber: page.pageNumber,
    bgColor: getPageBgColor(page),
    bgImage: page.backgroundImageData || null,
    charImage: (page.characterImageData && page.imagePlacement !== 'none') ? page.characterImageData : null,
    charSide: page.imagePlacement,
    charAnim: page.characterAnimation || 'fadeIn',
    segments: page.textSegments.map((seg, si) => ({
      speaker: seg.speaker,
      text: seg.text,
      isNarrator: seg.speaker === 'narrator',
      audio: audioData.find(a => a.pageIdx === pi && a.segIdx === si)?.base64 || null,
    })),
  }));

  const gradeLabel = formData.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${formData.gradeLevel}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${book.title}</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Georgia, serif; background: #111; color: #fff; overflow: hidden; height: 100vh; }
#player { width: 100vw; height: 100vh; display: flex; flex-direction: column; }
#top-bar { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: rgba(0,0,0,0.7); font-family: sans-serif; font-size: 13px; }
#top-bar button { background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer; font-size: 13px; padding: 4px 8px; border-radius: 4px; }
#top-bar button:hover { color: #fff; background: rgba(255,255,255,0.1); }
#stage { flex: 1; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
#bg { position: absolute; inset: 0; transition: opacity 0.6s; }
#bg img { width: 100%; height: 100%; object-fit: cover; }
#content { position: relative; z-index: 1; width: 100%; max-width: 900px; padding: 32px 48px; display: flex; align-items: center; gap: 32px; min-height: 60vh; }
#char-wrap { flex-shrink: 0; width: 180px; position: relative; }
#char-wrap img { width: 100%; filter: drop-shadow(0 8px 24px rgba(0,0,0,0.5)); }
#bubble-wrap { position: absolute; top: -10px; z-index: 5; pointer-events: none; transition: opacity 0.3s; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3)); }
#bubble-wrap.bubble-left { left: 100%; margin-left: 8px; }
#bubble-wrap.bubble-right { right: 100%; margin-right: 8px; }
#text-wrap { flex: 1; }
.seg { font-size: 20px; line-height: 1.7; margin-bottom: 12px; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.8); transition: opacity 0.4s; }
.seg.dim { opacity: 0.3; }
.seg.narrator { font-style: italic; }
.seg-speaker { display: block; font-size: 12px; font-weight: bold; color: #fde68a; font-style: normal; margin-bottom: 2px; }
#nav-left, #nav-right { position: absolute; top: 50%; transform: translateY(-50%); background: none; border: none; color: rgba(255,255,255,0.6); cursor: pointer; font-size: 36px; padding: 8px; z-index: 10; transition: color 0.2s; }
#nav-left:hover, #nav-right:hover { color: #fff; }
#nav-left { left: 12px; } #nav-right { right: 12px; }
#nav-left:disabled, #nav-right:disabled { opacity: 0.2; cursor: default; }
#dots { display: flex; justify-content: center; gap: 6px; padding: 12px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.3); border: none; cursor: pointer; transition: background 0.3s; }
.dot.active { background: ${accentColor}; }
.dot.q-dot { border-radius: 2px; background: rgba(255,200,100,0.25); }
.dot.q-dot.active { background: ${accentColor}; }
.flashcard { perspective: 1200px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width: 100%; padding: 32px; }
.flashcard-inner { position: relative; width: 100%; max-width: 560px; transition: transform 0.6s ease; transform-style: preserve-3d; }
.flashcard-inner.flipped { transform: rotateY(180deg); }
.flashcard-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 16px; padding: 48px 32px; text-align: center; }
.flashcard-front { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
.flashcard-back { position: absolute; inset: 0; transform: rotateY(180deg); background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
#overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 100; font-family: sans-serif; }
#overlay h1 { font-family: Georgia, serif; font-size: 36px; color: #fff; margin-bottom: 8px; text-align: center; }
#overlay p { color: rgba(255,255,255,0.6); margin-bottom: 32px; }
#play-btn { background: ${accentColor}; color: #fff; border: none; padding: 14px 36px; border-radius: 100px; font-size: 18px; cursor: pointer; transition: opacity 0.2s; }
#play-btn:hover { opacity: 0.9; }
</style>
</head>
<body>
<div id="overlay"${book.coverPage?.coverImageData ? ` style="background-image:url(${book.coverPage.coverImageData});background-size:cover;background-position:center;"` : ''}>
  ${book.coverPage?.coverImageData ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.6);"></div>' : ''}
  <div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <h1>${book.coverPage?.title || book.title}</h1>
    <p>${book.coverPage?.subtitle || (gradeLabel + (formData.subject ? ' • ' + formData.subject : ''))} • ${book.pages.length} pages${(book.comprehensionQuestions?.length || 0) > 0 ? ` + ${book.comprehensionQuestions!.length} questions` : ''}</p>
    ${book.coverPage?.authorName ? `<p style="color:rgba(255,255,255,0.7);margin-bottom:24px;font-size:15px;font-family:Georgia,serif;font-style:italic;">by ${book.coverPage.authorName}</p>` : ''}
    <button id="play-btn" onclick="startStory()">▶ Read Story</button>
  </div>
</div>
<div id="player" style="display:none">
  <div id="top-bar">
    <button onclick="prevPage()">◀ Back</button>
    <span id="page-label" style="color:rgba(255,255,255,0.5)"></span>
    <button onclick="toggleAuto()" id="auto-btn">⏸ Auto</button>
  </div>
  <div id="stage">
    <div id="bg"></div>
    <div id="content">
      <div id="char-wrap" style="display:none">
        <div id="bubble-wrap" style="display:none"></div>
      </div>
      <div id="text-wrap"></div>
    </div>
    <button id="nav-left" onclick="prevPage()">&#8592;</button>
    <button id="nav-right" onclick="nextPage()">&#8594;</button>
  </div>
  <div id="dots"></div>
</div>
<script>
const STORY_PAGES = ${JSON.stringify(pagesData)};
const QUESTIONS = ${JSON.stringify((book.comprehensionQuestions ?? []).map(q => ({ question: q.question, answer: q.answer, outcomeRef: q.outcomeRef || null })))};
const PAGES = [...STORY_PAGES];
QUESTIONS.forEach((q, i) => {
  PAGES.push({ type: 'question', questionIdx: i, face: 'front', data: q });
  PAGES.push({ type: 'question', questionIdx: i, face: 'back', data: q });
});
const STORY_COUNT = STORY_PAGES.length;
let pageIdx = 0, segIdx = 0, autoPlay = true, currentAudio = null, done = false;

function escXml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function wrapLines(t,mc){var w=t.split(/\\s+/),l=[],c='';for(var i=0;i<w.length;i++){if(c&&(c.length+1+w[i].length)>mc){l.push(c);c=w[i];}else{c=c?c+' '+w[i]:w[i];}}if(c)l.push(c);return l;}
function buildBubble(text,tailDir){
  var fs=18,mw=280,ml=5,cpl=22,px=18,py=14,lh=1.5,tw=16,br=14;
  var lines=wrapLines(text,cpl);
  if(lines.length>ml){fs=Math.max(fs-2,12);lines=wrapLines(text,cpl+3);}
  if(lines.length>ml){lines=lines.slice(0,ml);lines[ml-1]=lines[ml-1].slice(0,-3)+'\\u2026';}
  var th=lines.length*fs*lh, bw=mw, bh=th+py*2, ttY=bh*0.3, tbY=ttY+tw;
  var tp,bx;
  if(tailDir==='left'){bx=tw;tp=bx+','+ttY+' 0,'+(ttY+tw*0.4)+' '+bx+','+tbY;}
  else{bx=0;tp=bw+','+ttY+' '+(bw+tw)+','+(ttY+tw*0.4)+' '+bw+','+tbY;}
  var cx=bx+(tailDir==='left'?0:bw-8);
  var fo='<foreignObject x=\"'+(bx+px)+'\" y=\"'+py+'\" width=\"'+(bw-px*2)+'\" height=\"'+(bh-py*2)+'\"><div xmlns=\"http://www.w3.org/1999/xhtml\" style=\"font-family:Georgia,serif;font-size:'+fs+'px;line-height:'+lh+';color:#1f2937;overflow:hidden;\">'+escXml(lines.join(' '))+'</div></foreignObject>';
  return '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"'+(bw+tw)+'\" height=\"'+bh+'\" viewBox=\"0 0 '+(bw+tw)+' '+bh+'\" style=\"overflow:visible;\"><rect x=\"'+bx+'\" y=\"0\" width=\"'+bw+'\" height=\"'+bh+'\" rx=\"'+br+'\" ry=\"'+br+'\" fill=\"white\" stroke=\"#d1d5db\" stroke-width=\"1.5\"/><polygon points=\"'+tp+'\" fill=\"white\" stroke=\"#d1d5db\" stroke-width=\"1.5\"/><rect x=\"'+cx+'\" y=\"'+(ttY-1)+'\" width=\"10\" height=\"'+(tbY-ttY+2)+'\" fill=\"white\"/>'+fo+'</svg>';
}

function startStory() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('player').style.display = 'flex';
  buildDots();
  showPage(0);
}

function buildDots() {
  const d = document.getElementById('dots');
  d.innerHTML = PAGES.map((p, i) => {
    const isQ = !!p.type;
    return \`<button class="dot\${i===0?' active':''}\${isQ?' q-dot':''}" onclick="goPage(\${i})"></button>\`;
  }).join('');
}

function updateDots() {
  document.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('active', i===pageIdx));
}

function stopAudio() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
}

function showPage(idx) {
  stopAudio();
  pageIdx = idx; segIdx = 0; done = false;
  const item = PAGES[idx];
  document.getElementById('nav-left').disabled = idx === 0;
  document.getElementById('nav-right').disabled = idx === PAGES.length-1;
  updateDots();

  if (item.type === 'question') {
    showQuestionSlide(item);
    return;
  }

  const page = item;
  document.getElementById('page-label').textContent = \`\${idx+1} / \${STORY_COUNT}\`;

  // Background
  const bg = document.getElementById('bg');
  bg.innerHTML = page.bgImage
    ? \`<img src="\${page.bgImage}">\`
    : \`<div style="position:absolute;inset:0;background:\${page.bgColor}"></div>\`;

  // Character
  const cw = document.getElementById('char-wrap');
  const bw = document.getElementById('bubble-wrap');
  if (page.charImage && page.charSide !== 'none') {
    cw.style.display = 'block';
    cw.style.order = page.charSide === 'right' ? '2' : '0';
    cw.innerHTML = \`<img class="animate__animated animate__\${page.charAnim}" src="\${page.charImage}"><div id="bubble-wrap" style="display:none"></div>\`;
    // Position bubble on opposite side of character
    const bw2 = document.getElementById('bubble-wrap');
    if (bw2) {
      bw2.className = page.charSide === 'left' ? 'bubble-left' : 'bubble-right';
      bw2.style.position = 'absolute';
      bw2.style.top = '-10px';
      bw2.style.zIndex = '5';
      bw2.style.pointerEvents = 'none';
      bw2.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))';
    }
  } else {
    cw.style.display = 'none';
    cw.innerHTML = '<div id="bubble-wrap" style="display:none"></div>';
  }

  // Determine tail direction (tail points toward character)
  const tailDir = page.charSide === 'right' ? 'right' : 'left';
  window._bubbleTailDir = tailDir;
  window._hasCharBubble = !!(page.charImage && page.charSide !== 'none');

  // Text — narrator segments always in text-wrap, character segments only as fallback when no char image
  const tw = document.getElementById('text-wrap');
  tw.innerHTML = page.segments.map((s,i) => \`
    <div class="seg \${s.isNarrator?'narrator':''} \${i>0?'dim':''}" id="seg-\${i}" data-is-narrator="\${s.isNarrator}" data-text="\${escXml(s.text)}" data-speaker="\${escXml(s.speaker)}">
      \${!s.isNarrator?'<span class=\\"seg-speaker\\">'+s.speaker+'</span>':''}
      \${s.isNarrator ? s.text : '&ldquo;'+s.text+'&rdquo;'}
    </div>\`).join('');

  playSegment(0);
}

function showQuestionSlide(item) {
  const q = item.data;
  const qNum = item.questionIdx + 1;
  const isBack = item.face === 'back';
  document.getElementById('page-label').textContent = 'Question ' + qNum + ' of ' + QUESTIONS.length + (isBack ? ' (Answer)' : '');

  // Dark gradient background
  const bg = document.getElementById('bg');
  bg.innerHTML = '<div style="position:absolute;inset:0;background:linear-gradient(135deg,#1a1a2e,#16213e)"></div>';

  // Hide character
  const cw = document.getElementById('char-wrap');
  cw.style.display = 'none';
  cw.innerHTML = '';

  // Flashcard content
  const tw = document.getElementById('text-wrap');
  tw.innerHTML = \`
    <div class="flashcard">
      <div style="color:rgba(255,255,255,0.4);font-size:13px;margin-bottom:16px;font-family:sans-serif;">
        Question \${qNum} of \${QUESTIONS.length}
      </div>
      <div class="flashcard-inner\${isBack ? ' flipped' : ''}">
        <div class="flashcard-face flashcard-front">
          <div style="font-size:14px;color:${accentColor};margin-bottom:16px;font-family:sans-serif;font-weight:600;">QUESTION</div>
          <div style="font-size:24px;line-height:1.5;color:#fff;">\${q.question}</div>
          <div style="margin-top:24px;font-size:13px;color:rgba(255,255,255,0.3);font-family:sans-serif;">Press → to reveal answer</div>
        </div>
        <div class="flashcard-face flashcard-back">
          <div style="color:rgba(255,255,255,0.4);font-size:13px;margin-bottom:8px;font-family:sans-serif;">\${q.question}</div>
          <div style="width:60px;height:2px;background:${accentColor};margin:16px auto;"></div>
          <div style="font-size:14px;color:${accentColor};margin-bottom:12px;font-family:sans-serif;font-weight:600;">ANSWER</div>
          <div style="font-size:22px;line-height:1.5;color:#fff;">\${q.answer}</div>
          \${q.outcomeRef ? '<div style="margin-top:16px;font-size:11px;color:rgba(255,255,255,0.25);font-family:sans-serif;">Outcome: '+q.outcomeRef+'</div>' : ''}
        </div>
      </div>
    </div>\`;
  done = true; // No auto-advance on question slides
}

function playSegment(i) {
  segIdx = i;
  const page = PAGES[pageIdx];
  // Highlight current segment
  page.segments.forEach((_,j) => {
    const el = document.getElementById('seg-'+j);
    if (el) el.classList.toggle('dim', j > i);
  });
  if (i >= page.segments.length) {
    // Hide bubble when page finishes
    const bw = document.getElementById('bubble-wrap');
    if (bw) { bw.style.display = 'none'; bw.innerHTML = ''; }
    done = true; if (autoPlay && pageIdx < PAGES.length-1) setTimeout(() => showPage(pageIdx+1), 1800); return;
  }
  const seg = page.segments[i];

  // Speech bubble: show for character segments, hide for narrator
  const bw = document.getElementById('bubble-wrap');
  if (bw && window._hasCharBubble) {
    if (!seg.isNarrator) {
      bw.style.display = 'block';
      bw.style.opacity = '0';
      bw.innerHTML = buildBubble(seg.text, window._bubbleTailDir);
      // Trigger fade-in
      requestAnimationFrame(() => { bw.style.transition = 'opacity 0.3s'; bw.style.opacity = '1'; });
      // Dim the text-wrap version for character segments
      const segEl = document.getElementById('seg-'+i);
      if (segEl) segEl.style.opacity = '0.3';
    } else {
      bw.style.opacity = '0';
      setTimeout(() => { bw.style.display = 'none'; bw.innerHTML = ''; }, 300);
    }
  }

  if (seg.audio) {
    const a = new Audio('data:audio/wav;base64,' + seg.audio);
    currentAudio = a;
    a.onended = () => playSegment(i+1);
    a.onerror = () => playSegment(i+1);
    a.play().catch(() => playSegment(i+1));
  } else {
    setTimeout(() => playSegment(i+1), 600 + seg.text.length * 40);
  }
}

function nextPage() { if (pageIdx < PAGES.length-1) showPage(pageIdx+1); }
function prevPage() { if (pageIdx > 0) showPage(pageIdx-1); }
function goPage(i) { showPage(i); }
function toggleAuto() {
  autoPlay = !autoPlay;
  document.getElementById('auto-btn').textContent = autoPlay ? '⏸ Auto' : '▶ Auto';
}
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextPage();
  else if (e.key === 'ArrowLeft') prevPage();
  else if (e.key === ' ') {
    e.preventDefault();
    if (PAGES[pageIdx] && PAGES[pageIdx].type === 'question') { nextPage(); }
    else { stopAudio(); playSegment(segIdx); }
  }
});
</script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(book.title)}-interactive.html`;
  a.click();
  URL.revokeObjectURL(url);
}
