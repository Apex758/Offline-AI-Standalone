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

  const charSide = page.imagePlacement === 'left' ? 'float:left;margin-right:16px;' :
                   page.imagePlacement === 'right' ? 'float:right;margin-left:16px;' : '';
  const charHtml = (page.characterImageData && page.imagePlacement !== 'none')
    ? `<img src="${page.characterImageData}" style="width:140px;${charSide}shape-outside:url(${page.characterImageData});shape-margin:12px;border-radius:8px;" />`
    : '';

  const textHtml = page.textSegments.map(seg => {
    const isNarrator = seg.speaker === 'narrator';
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

  const coverHtml = `
    <div style="page-break-after:always;min-height:350px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,${accentColor}22,${accentColor}08);padding:60px 40px;text-align:center;">
      <div style="width:64px;height:64px;margin:0 auto 16px;border-radius:16px;background:${accentColor}22;display:flex;align-items:center;justify-content:center;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${accentColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      </div>
      <h1 style="font-family:Georgia,serif;font-size:28pt;font-weight:bold;color:#1f2937;margin:0 0 8px 0;">${book.title}</h1>
      <p style="font-family:sans-serif;font-size:11pt;color:#6b7280;margin:0;">${gradeLabel}${subjectLine}</p>
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
  const cover = pptx.addSlide();
  cover.background = { color: 'F9F5FF' };
  cover.addText(book.title, {
    x: 1, y: 2, w: '80%', h: 1.2,
    fontSize: 32, bold: true, align: 'center',
    fontFace: 'Georgia',
    color: hexColor,
  });
  const gradeLabel = formData.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${formData.gradeLevel}`;
  cover.addText(gradeLabel + (formData.subject ? ` • ${formData.subject}` : ''), {
    x: 1, y: 3.4, w: '80%', h: 0.5,
    fontSize: 14, align: 'center', color: '6B7280',
  });

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

    // Character image
    if (page.characterImageData && page.imagePlacement !== 'none') {
      const imgX = page.imagePlacement === 'right' ? 7.2 : 0.2;
      slide.addImage({ data: page.characterImageData, x: imgX, y: 0.5, w: 2.2, h: 3.5 });
    }

    // Text
    const textX = page.characterImageData && page.imagePlacement === 'left' ? 2.8 : 0.4;
    const textW = page.characterImageData && page.imagePlacement !== 'none' ? 6.4 : 9.2;

    const textContent = page.textSegments.map(seg => {
      const isNarrator = seg.speaker === 'narrator';
      return isNarrator ? seg.text : `${seg.speaker}: "${seg.text}"`;
    }).join('\n\n');

    slide.addText(textContent, {
      x: textX, y: 0.6, w: textW, h: 4,
      fontSize: 18, fontFace: 'Georgia',
      italic: page.textSegments[0]?.speaker === 'narrator',
      valign: 'middle',
      color: '1F2937',
      wrap: true,
    });

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
export async function fetchTTSBlob(text: string, voice: string): Promise<Blob> {
  const isElectron = typeof window !== 'undefined' && 'electronAPI' in window;
  const apiBase = isElectron ? 'http://127.0.0.1:8000' : 'http://localhost:8000';

  const res = await fetch(`${apiBase}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice }),
  });
  if (!res.ok) throw new Error('TTS failed');
  return res.blob();
}

async function fetchAudioBase64(text: string, voice: string): Promise<string> {
  const blob = await fetchTTSBlob(text, voice);
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
        const b64 = await fetchAudioBase64(seg.text, voice);
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
#char-wrap { flex-shrink: 0; width: 180px; }
#char-wrap img { width: 100%; filter: drop-shadow(0 8px 24px rgba(0,0,0,0.5)); }
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
#overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 100; font-family: sans-serif; }
#overlay h1 { font-family: Georgia, serif; font-size: 36px; color: #fff; margin-bottom: 8px; text-align: center; }
#overlay p { color: rgba(255,255,255,0.6); margin-bottom: 32px; }
#play-btn { background: ${accentColor}; color: #fff; border: none; padding: 14px 36px; border-radius: 100px; font-size: 18px; cursor: pointer; transition: opacity 0.2s; }
#play-btn:hover { opacity: 0.9; }
</style>
</head>
<body>
<div id="overlay">
  <h1>${book.title}</h1>
  <p>${gradeLabel}${formData.subject ? ' • ' + formData.subject : ''} • ${book.pages.length} pages</p>
  <button id="play-btn" onclick="startStory()">▶ Read Story</button>
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
      <div id="char-wrap" style="display:none"></div>
      <div id="text-wrap"></div>
    </div>
    <button id="nav-left" onclick="prevPage()">&#8592;</button>
    <button id="nav-right" onclick="nextPage()">&#8594;</button>
  </div>
  <div id="dots"></div>
</div>
<script>
const PAGES = ${JSON.stringify(pagesData)};
let pageIdx = 0, segIdx = 0, autoPlay = true, currentAudio = null, done = false;

function startStory() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('player').style.display = 'flex';
  buildDots();
  showPage(0);
}

function buildDots() {
  const d = document.getElementById('dots');
  d.innerHTML = PAGES.map((_, i) => \`<button class="dot\${i===0?' active':''}" onclick="goPage(\${i})"></button>\`).join('');
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
  const page = PAGES[idx];
  document.getElementById('page-label').textContent = \`\${idx+1} / \${PAGES.length}\`;
  document.getElementById('nav-left').disabled = idx === 0;
  document.getElementById('nav-right').disabled = idx === PAGES.length-1;
  updateDots();

  // Background
  const bg = document.getElementById('bg');
  bg.innerHTML = page.bgImage
    ? \`<img src="\${page.bgImage}">\`
    : \`<div style="position:absolute;inset:0;background:\${page.bgColor}"></div>\`;

  // Character
  const cw = document.getElementById('char-wrap');
  if (page.charImage && page.charSide !== 'none') {
    cw.style.display = 'block';
    cw.style.order = page.charSide === 'right' ? '2' : '0';
    cw.innerHTML = \`<img class="animate__animated animate__\${page.charAnim}" src="\${page.charImage}">\`;
  } else {
    cw.style.display = 'none';
    cw.innerHTML = '';
  }

  // Text
  const tw = document.getElementById('text-wrap');
  tw.innerHTML = page.segments.map((s,i) => \`
    <div class="seg \${s.isNarrator?'narrator':''} \${i>0?'dim':''}" id="seg-\${i}">
      \${!s.isNarrator?'<span class=\\"seg-speaker\\">'+s.speaker+'</span>':''}
      \${s.isNarrator ? s.text : '&ldquo;'+s.text+'&rdquo;'}
    </div>\`).join('');

  playSegment(0);
}

function playSegment(i) {
  segIdx = i;
  const page = PAGES[pageIdx];
  // Highlight current segment
  page.segments.forEach((_,j) => {
    const el = document.getElementById('seg-'+j);
    if (el) el.classList.toggle('dim', j > i);
  });
  if (i >= page.segments.length) { done = true; if (autoPlay && pageIdx < PAGES.length-1) setTimeout(() => showPage(pageIdx+1), 1800); return; }
  const seg = page.segments[i];
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
  else if (e.key === ' ') { e.preventDefault(); stopAudio(); playSegment(segIdx); }
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
