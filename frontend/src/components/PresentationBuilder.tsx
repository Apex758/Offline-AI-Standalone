import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useQueue } from '../contexts/QueueContext';
import { useSettings } from '../contexts/SettingsContext';
import { HugeiconsIcon } from '@hugeicons/react';
import Loading02Icon from '@hugeicons/core-free-icons/Loading02Icon';
import ArrowLeft01Icon from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';
import Download01Icon from '@hugeicons/core-free-icons/Download01Icon';
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon';
import Clock01Icon from '@hugeicons/core-free-icons/Clock01Icon';
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon';
import Image01Icon from '@hugeicons/core-free-icons/Image01Icon';
import Presentation01Icon from '@hugeicons/core-free-icons/Presentation01Icon';
import PlusSignIcon from '@hugeicons/core-free-icons/PlusSignIcon';
import SaveIcon from '@hugeicons/core-free-icons/SaveIcon';
import FolderOpenIcon from '@hugeicons/core-free-icons/FolderOpenIcon';
import CurriculumAlignmentFields from './ui/CurriculumAlignmentFields';
import SmartTextArea from './SmartTextArea';
import SmartInput from './SmartInput';
import { imageApi } from '../lib/imageApi';
import { buildPresentationPromptFromForm, buildPresentationPromptFromLesson } from '../utils/presentationPromptBuilder';
import type { PresentationFormData, ParsedLessonInput } from '../utils/presentationPromptBuilder';
import { useQueueCancellation } from '../hooks/useQueueCancellation';
import axios from 'axios';
import pptxgen from 'pptxgenjs';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

/* ═══════════════════════════════════════
   TYPES
═══════════════════════════════════════ */

interface PresentationBuilderProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

interface SlideContent {
  headline?: string;
  subtitle?: string;
  badge?: string;
  body?: string;
  bullets?: string[];
  image?: string; // base64 data URI
}

interface Slide {
  id: string;
  layout: string;
  content: SlideContent;
}

interface LessonPlanRecord {
  id: string;
  title: string;
  timestamp: string;
  formData: any;
  generatedPlan: string;
  parsedLesson?: ParsedLessonInput;
}

type InputMode = 'scratch' | 'lesson';
type RightTab = 'color' | 'edit';

const SLIDE_LAYOUTS = ['title', 'objectives', 'hook', 'instruction', 'activity', 'assessment', 'closing'];

const ALL_STYLES = [
  { id: 'dark', label: 'Dark Glow', tag: 'PRO', desc: 'Moody dark with glowing accents' },
  { id: 'split', label: 'Split Panel', tag: 'PRO', desc: 'Sidebar + light content panel' },
  { id: 'editorial', label: 'Editorial', tag: 'PRO', desc: 'Newspaper-inspired serif' },
  { id: 'cards', label: 'Card Grid', tag: 'PRO', desc: 'Content as floating cards' },
  { id: 'typographic', label: 'Bold Type', tag: 'PRO', desc: 'High-contrast impact typography' },
  { id: 'glassmorphism', label: 'Glassmorphism', tag: 'PRO', desc: 'Frosted glass panels, soft blur' },
  { id: 'gradient-mesh', label: 'Gradient Mesh', tag: 'PRO', desc: 'Flowing colorful mesh gradients' },
  { id: 'minimalist', label: 'Minimalist', tag: 'PRO', desc: 'Ultra-clean whitespace & thin lines' },
  { id: 'duotone', label: 'Duotone', tag: 'PRO', desc: 'Two-tone bold color blocking' },
  { id: 'neon-line', label: 'Neon Line', tag: 'PRO', desc: 'Dark base with neon glowing lines' },
  { id: 'blueprint', label: 'Blueprint', tag: 'PRO', desc: 'Technical drawing on grid paper' },
  { id: 'magazine', label: 'Magazine', tag: 'PRO', desc: 'Glossy pull-quote editorial layout' },
  { id: 'corporate', label: 'Corporate', tag: 'PRO', desc: 'Clean geometric business style' },
  { id: 'watercolor', label: 'Watercolor', tag: 'PRO', desc: 'Soft painted washes & strokes' },
  { id: 'monochrome', label: 'Monochrome', tag: 'PRO', desc: 'B&W elegance with one pop color' },
  { id: 'bubbly', label: 'Bubbly', tag: 'KIDS', desc: 'Big shapes, playful & bouncy' },
  { id: 'chalkboard', label: 'Chalkboard', tag: 'KIDS', desc: 'Chalk-on-board classroom feel' },
  { id: 'storybook', label: 'Storybook', tag: 'KIDS', desc: 'Warm, illustrated, story-like' },
  { id: 'comic', label: 'Comic Book', tag: 'KIDS', desc: 'Bold outlines, POW energy' },
  { id: 'scrapbook', label: 'Scrapbook', tag: 'KIDS', desc: 'Crafty, cut-out, handmade look' },
  { id: 'space', label: 'Space Explorer', tag: 'KIDS', desc: 'Stars, planets & cosmic vibes' },
  { id: 'candy', label: 'Candy Shop', tag: 'KIDS', desc: 'Sweet pastels, sprinkles & treats' },
  { id: 'underwater', label: 'Underwater', tag: 'KIDS', desc: 'Ocean waves, bubbles & sea life' },
  { id: 'jungle', label: 'Jungle Safari', tag: 'KIDS', desc: 'Tropical leaves & animal prints' },
  { id: 'pixel', label: 'Pixel Art', tag: 'KIDS', desc: '8-bit retro game style' },
  { id: 'rainbow', label: 'Rainbow Pop', tag: 'KIDS', desc: 'Colorful stripes & gradient joy' },
  { id: 'crayon', label: 'Crayon Box', tag: 'KIDS', desc: 'Hand-drawn crayon sketch style' },
  { id: 'origami', label: 'Origami', tag: 'KIDS', desc: 'Folded paper geometric shapes' },
  { id: 'treehouse', label: 'Treehouse', tag: 'KIDS', desc: 'Wooden planks & leafy nature' },
  { id: 'superhero', label: 'Superhero', tag: 'KIDS', desc: 'Cape & mask action hero energy' },
];

/* ═══════════════════════════════════════
   COLOR UTILITIES
═══════════════════════════════════════ */

interface ThemeColors {
  primary: string;
  bg: string;
  text: string;
  textMuted: string;
  surface: string;
  surfaceAlt: string;
  isDark: boolean;
}

function hexLum(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toL = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toL(r) + 0.7152 * toL(g) + 0.0722 * toL(b);
}

function blend(hex1: string, hex2: string, t: number): string {
  const p = (h: string, i: number) => parseInt(h.slice(i, i + 2), 16);
  const r = Math.round(p(hex1, 1) * (1 - t) + p(hex2, 1) * t);
  const g = Math.round(p(hex1, 3) * (1 - t) + p(hex2, 3) * t);
  const b = Math.round(p(hex1, 5) * (1 - t) + p(hex2, 5) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function lighten(hex: string, amt: number) { return blend(hex, '#ffffff', amt); }
function darken(hex: string, amt: number) { return blend(hex, '#000000', amt); }

function deriveTheme(primary: string, bg: string): ThemeColors {
  const lum = hexLum(bg);
  const text = lum > 0.4 ? '#111111' : lum > 0.18 ? '#1a1a2e' : '#f0f4ff';
  const textMuted = lum > 0.4 ? '#555555' : lum > 0.18 ? '#3a4a62' : '#8899aa';
  const surface = lum > 0.4 ? blend(bg, '#ffffff', 0.5) : blend(bg, '#ffffff', 0.08);
  const surfaceAlt = lum > 0.4 ? blend(bg, '#000000', 0.06) : blend(bg, '#ffffff', 0.04);
  const isDark = lum < 0.3;
  return { primary, bg, text, textMuted, surface, surfaceAlt, isDark };
}

/* ═══════════════════════════════════════
   SLIDE RENDERERS — PRO STYLES
═══════════════════════════════════════ */

interface SlideRendererProps {
  slide: Slide;
  t: ThemeColors;
  w: number;
}

function DarkGlowSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary, pad = 50 * sc;
  const base: React.CSSProperties = { width: w, height: H, background: t.bg, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 };
  const TopBar = () => <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3 * sc, background: `linear-gradient(90deg,${p},${p}44)` }} />;
  const Glow = () => <div style={{ position: 'absolute', bottom: -50 * sc, right: -50 * sc, width: 160 * sc, height: 160 * sc, borderRadius: '50%', background: `${p}12`, border: `1px solid ${p}20`, pointerEvents: 'none' }} />;
  if (L === 'title') return (
    <div style={base}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 20% 50%,${p}16 0%,transparent 65%)` }} />
      <TopBar />
      {c.image && <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${c.image})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />}
      <div style={{ position: 'absolute', top: 56 * sc, left: pad, right: pad }}>
        {c.badge && <div style={{ display: 'inline-block', padding: `${4 * sc}px ${12 * sc}px`, background: `${p}1a`, border: `1px solid ${p}35`, borderRadius: 20 * sc, color: p, fontSize: 10 * sc, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 * sc }}>{c.badge}</div>}
        <div style={{ fontSize: 36 * sc, fontWeight: 800, color: t.text, lineHeight: 1.1, marginBottom: 14 * sc, fontFamily: 'Georgia,serif' }}>{c.headline}</div>
        {c.subtitle && <div style={{ fontSize: 15 * sc, color: `${t.text}70` }}>{c.subtitle}</div>}
      </div><Glow />
    </div>
  );
  return (
    <div style={base}><TopBar />
      {c.image && <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '35%', backgroundImage: `url(${c.image})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2, maskImage: 'linear-gradient(to right, transparent, black)' }} />}
      <div style={{ position: 'absolute', top: 26 * sc, left: pad, right: pad }}>
        {c.badge && <div style={{ display: 'inline-block', padding: `${3 * sc}px ${9 * sc}px`, background: `${p}1a`, borderRadius: 4 * sc, color: p, fontSize: 9 * sc, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 * sc }}>{c.badge}</div>}
        <div style={{ fontSize: L === 'hook' ? 21 * sc : 22 * sc, fontWeight: 700, color: t.text, marginBottom: 16 * sc, lineHeight: 1.2, fontFamily: 'Georgia,serif' }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
        {c.body && <div style={{ fontSize: 13 * sc, color: `${t.text}80`, lineHeight: 1.6, marginBottom: 14 * sc }}>{c.body}</div>}
        {(c.bullets || []).map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 * sc, marginBottom: 9 * sc }}>
            <div style={{ width: 5 * sc, height: 5 * sc, borderRadius: '50%', background: p, marginTop: 5 * sc, flexShrink: 0 }} />
            <span style={{ fontSize: 12 * sc, color: `${t.text}bb`, lineHeight: 1.5 }}>{b}</span>
          </div>
        ))}
      </div><Glow />
    </div>
  );
}

function SplitPanelSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const panelW = L === 'title' ? 0.44 : 0.30;
  const leftBg = t.isDark ? `linear-gradient(160deg,${darken(t.bg, 0.3)} 0%,${t.bg} 100%)` : 'linear-gradient(160deg,#1a1a2e 0%,#16213e 100%)';
  const base: React.CSSProperties = { width: w, height: H, background: t.isDark ? t.surface : '#f4f6fa', position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: "'Trebuchet MS',system-ui,sans-serif", flexShrink: 0, display: 'flex' };
  const symMap: Record<string, string> = { hook: '?', objectives: '◎', assessment: '✓', activity: '⏳', closing: '★', instruction: '✦', title: '◆' };
  if (L === 'title') return (
    <div style={base}>
      <div style={{ width: `${panelW * 100}%`, background: c.image ? `url(${c.image})` : leftBg, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${30 * sc}px ${26 * sc}px`, flexShrink: 0, position: 'relative' }}>
        {c.image && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 9 * sc, fontWeight: 800, color: `${p}cc`, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 * sc }}>{c.badge || 'Lesson'}</div>
          <div style={{ fontSize: 26 * sc, fontWeight: 900, color: '#ffffff', lineHeight: 1.1, fontFamily: 'Georgia,serif', marginBottom: 10 * sc }}>{c.headline}</div>
          <div style={{ width: 34 * sc, height: 2.5 * sc, background: p, borderRadius: 2 * sc }} />
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${30 * sc}px`, background: t.isDark ? t.surface : '#f4f6fa' }}>
        {c.subtitle && <div style={{ fontSize: 14 * sc, color: t.text, fontWeight: 600, marginBottom: 10 * sc }}>{c.subtitle}</div>}
        {(c.bullets || []).map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 * sc, marginBottom: 7 * sc }}>
            <div style={{ width: 3 * sc, height: 3 * sc, borderRadius: '50%', background: p, flexShrink: 0 }} />
            <span style={{ fontSize: 11 * sc, color: t.text, fontWeight: 700 }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div style={base}>
      <div style={{ width: `${panelW * 100}%`, background: leftBg, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: `${20 * sc}px ${12 * sc}px`, flexShrink: 0, position: 'relative' }}>
        <div style={{ fontSize: 9 * sc, fontWeight: 800, color: `${p}88`, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 * sc, textAlign: 'center' }}>{c.badge || L}</div>
        <div style={{ fontSize: 36 * sc, fontWeight: 900, color: p, lineHeight: 1 }}>{symMap[L] || '◆'}</div>
      </div>
      <div style={{ flex: 1, padding: `${20 * sc}px ${26 * sc}px`, background: t.isDark ? t.surface : '#f4f6fa', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 17 * sc, fontWeight: 800, color: t.text, lineHeight: 1.2, marginBottom: 12 * sc, fontFamily: 'Georgia,serif' }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
        {c.body && <div style={{ fontSize: 11 * sc, color: t.textMuted, lineHeight: 1.6, marginBottom: 10 * sc, padding: `${9 * sc}px ${11 * sc}px`, background: t.surfaceAlt, borderRadius: 5 * sc }}>{c.body}</div>}
        {(c.bullets || []).map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 * sc, marginBottom: 7 * sc }}>
            <span style={{ fontSize: 10 * sc, fontWeight: 800, color: p, minWidth: 16 * sc, flexShrink: 0 }}>{'① ②③④⑤'[i] || '•'}</span>
            <span style={{ fontSize: 11 * sc, color: t.text, lineHeight: 1.5 }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditorialSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const decoMap: Record<string, string> = { title: 'LIGHT', hook: '???', objectives: 'OBJ', instruction: 'KEY', activity: 'DO', assessment: 'EVL', closing: 'END' };
  const bg = t.isDark ? t.bg : '#fafaf8';
  const ink = t.isDark ? t.text : '#1a1a1a';
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: 'Georgia,serif', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: -8 * sc, right: 8 * sc, fontSize: 88 * sc, fontWeight: 900, color: `${p}0d`, lineHeight: 1, letterSpacing: '-0.04em', userSelect: 'none', fontFamily: 'system-ui,sans-serif' }}>{decoMap[L] || '◆'}</div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4 * sc, background: ink }} />
      <div style={{ position: 'absolute', top: 14 * sc, left: 30 * sc, right: 30 * sc, height: 1 * sc, background: ink }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${50 * sc}px ${38 * sc}px` }}>
          <div style={{ fontSize: 9 * sc, fontWeight: 700, letterSpacing: '0.22em', color: ink, textTransform: 'uppercase', marginBottom: 14 * sc, fontFamily: 'system-ui,sans-serif' }}>{c.badge || 'Lesson Plan'}</div>
          <div style={{ fontSize: 38 * sc, fontWeight: 900, color: ink, lineHeight: 0.98, letterSpacing: '-0.02em', marginBottom: 16 * sc }}>{c.headline}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 * sc }}>
            <div style={{ height: 2 * sc, width: 28 * sc, background: p }} />
            <span style={{ fontSize: 12 * sc, color: t.textMuted, fontFamily: 'system-ui,sans-serif', fontStyle: 'italic' }}>{c.subtitle}</span>
          </div>
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 28 * sc, left: 30 * sc, right: 30 * sc, bottom: 18 * sc }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 * sc, marginBottom: 6 * sc }}>
            <div style={{ width: 20 * sc, height: 20 * sc, background: p, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 10 * sc, fontWeight: 900, color: '#000', fontFamily: 'system-ui,sans-serif' }}>{SLIDE_LAYOUTS.indexOf(L) + 1}</span>
            </div>
            <div style={{ fontSize: 9 * sc, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.16em', fontFamily: 'system-ui,sans-serif', fontWeight: 700 }}>{c.badge || L}</div>
          </div>
          <div style={{ fontSize: L === 'hook' ? 18 * sc : 19 * sc, fontWeight: 700, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          <div style={{ borderTop: `1px solid ${t.isDark ? '#ffffff18' : '#e0e0e0'}`, paddingTop: 11 * sc }}>
            {c.body && <p style={{ fontSize: 12 * sc, color: t.textMuted, lineHeight: 1.7, marginBottom: 11 * sc, fontStyle: 'italic' }}>{c.body}</p>}
            {(c.bullets || []).map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 * sc, marginBottom: 8 * sc, paddingBottom: 8 * sc, borderBottom: i < (c.bullets || []).length - 1 ? `0.5px solid ${t.isDark ? '#ffffff14' : '#e8e8e0'}` : 'none' }}>
                <span style={{ fontSize: 11 * sc, color: p, fontWeight: 900, fontFamily: 'system-ui,sans-serif', minWidth: 16 * sc }}>{i + 1}.</span>
                <span style={{ fontSize: 12 * sc, color: t.isDark ? t.text : '#333', lineHeight: 1.55 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 10 * sc, left: 30 * sc, right: 30 * sc, height: 0.5 * sc, background: ink }} />
    </div>
  );
}

function CardGridSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bullets = c.bullets || [];
  if (L === 'title') return (
    <div style={{ width: w, height: H, background: t.surface, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${p}20 0%,transparent 55%)` }} />
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 6 * sc, background: p }} />
      <div style={{ position: 'absolute', top: 0, left: 6 * sc, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${36 * sc}px ${42 * sc}px` }}>
        <div style={{ display: 'inline-flex', padding: `${5 * sc}px ${11 * sc}px`, background: `${p}20`, borderRadius: 4 * sc, marginBottom: 14 * sc, alignSelf: 'flex-start' }}><span style={{ fontSize: 9 * sc, fontWeight: 800, color: p, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{c.badge || 'Lesson'}</span></div>
        <div style={{ fontSize: 33 * sc, fontWeight: 900, color: t.text, lineHeight: 1.1, fontFamily: 'Georgia,serif', marginBottom: 14 * sc }}>{c.headline}</div>
        {c.subtitle && <div style={{ fontSize: 13 * sc, color: t.textMuted }}>{c.subtitle}</div>}
      </div>
    </div>
  );
  return (
    <div style={{ width: w, height: H, background: t.surface, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3 * sc, background: `linear-gradient(90deg,${p},${p}55,transparent)` }} />
      <div style={{ position: 'absolute', top: 14 * sc, left: 20 * sc, right: 20 * sc }}>
        {c.badge && <span style={{ fontSize: 9 * sc, fontWeight: 800, color: p, letterSpacing: '0.1em', textTransform: 'uppercase', padding: `${3 * sc}px ${8 * sc}px`, background: `${p}18`, borderRadius: 3 * sc }}>{c.badge}</span>}
        <div style={{ fontSize: 17 * sc, fontWeight: 800, color: t.text, lineHeight: 1.2, marginTop: 7 * sc, marginBottom: 12 * sc, fontFamily: 'Georgia,serif' }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
      </div>
      {bullets.length > 0 ? (
        <div style={{ position: 'absolute', top: 76 * sc, left: 20 * sc, right: 20 * sc, bottom: 12 * sc, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: bullets.length >= 3 ? '1fr 1fr' : '1fr', gap: 7 * sc }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ padding: `${11 * sc}px ${13 * sc}px`, background: `${p}${['18', '11', '0d', '09'][i]}`, border: `1px solid ${p}${['40', '28', '22', '18'][i]}`, borderRadius: 7 * sc, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 10 * sc, fontWeight: 800, color: p, marginBottom: 5 * sc }}>0{i + 1}</div>
              <div style={{ fontSize: 11 * sc, color: t.text, lineHeight: 1.4 }}>{b}</div>
            </div>
          ))}
        </div>
      ) : c.body && (
        <div style={{ position: 'absolute', top: 76 * sc, left: 20 * sc, right: 20 * sc, padding: `${14 * sc}px`, background: `${p}14`, border: `1px solid ${p}30`, borderRadius: 8 * sc }}>
          <div style={{ fontSize: 12 * sc, color: t.text, lineHeight: 1.65 }}>{c.body}</div>
        </div>
      )}
    </div>
  );
}

function BoldTypeSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const tagMap: Record<string, string> = { title: '01', objectives: '02', hook: '03', instruction: '04', activity: '05', assessment: '06', closing: '07' };
  const tag = tagMap[L] || '--';
  const bg = t.isDark ? t.bg : '#ffffff';
  const ink = t.isDark ? t.text : '#111';
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: "'Arial Black','Impact',sans-serif", flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 0, right: 0, fontSize: 80 * sc, fontWeight: 900, color: `${p}08`, lineHeight: 0.85, letterSpacing: '-0.05em', userSelect: 'none' }}>{tag}</div>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 5 * sc, height: '100%', background: p }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', top: 28 * sc, left: 22 * sc, right: 22 * sc }}>
          <div style={{ fontSize: 9 * sc, fontWeight: 700, color: t.textMuted, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 14 * sc, fontFamily: 'Arial,sans-serif' }}>{c.badge || 'Lesson Plan'}</div>
          <div style={{ fontSize: 37 * sc, fontWeight: 900, color: ink, lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: 16 * sc, textTransform: 'uppercase' }}>{c.headline}</div>
          <div style={{ height: 4 * sc, width: 58 * sc, background: p, marginBottom: 12 * sc }} />
          <div style={{ fontSize: 13 * sc, color: t.textMuted, fontFamily: 'Arial,sans-serif', fontWeight: 400 }}>{c.subtitle}</div>
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 18 * sc, left: 18 * sc, right: 18 * sc, bottom: 14 * sc }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 10 * sc }}>
            <span style={{ fontSize: 20 * sc, fontWeight: 900, color: p, letterSpacing: '-0.03em' }}>{tag}</span>
            <span style={{ fontSize: 8 * sc, fontWeight: 700, color: t.textMuted, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'Arial,sans-serif' }}>{c.badge || L}</span>
          </div>
          <div style={{ fontSize: L === 'hook' ? 16 * sc : 18 * sc, fontWeight: 900, color: ink, lineHeight: 1.1, marginBottom: 14 * sc, textTransform: L === 'hook' ? 'none' : 'uppercase', letterSpacing: '-0.01em' }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: t.textMuted, lineHeight: 1.6, marginBottom: 11 * sc, fontFamily: 'Arial,sans-serif', fontWeight: 400, padding: `${9 * sc}px ${11 * sc}px`, borderLeft: `3px solid ${p}` }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 5 * sc, padding: `${6 * sc}px 0`, borderBottom: `1px solid ${t.isDark ? '#ffffff10' : '#f0f0f0'}` }}>
              <span style={{ width: 15 * sc, height: 15 * sc, background: p, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 7 * sc, color: hexLum(p) > 0.5 ? '#000' : '#fff', fontWeight: 900, fontFamily: 'Arial,sans-serif' }}>{i + 1}</span></span>
              <span style={{ fontSize: 11 * sc, color: t.isDark ? t.text : '#222', lineHeight: 1.4, fontFamily: 'Arial,sans-serif', fontWeight: 700 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SLIDE RENDERERS — KIDS STYLES
═══════════════════════════════════════ */

function BubblySlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : lighten(p, 0.88);
  const ink = t.isDark ? t.text : darken(p, 0.55);
  const blob1 = lighten(p, 0.65), blob2 = lighten(p, 0.75);
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 16 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: -40 * sc, right: -40 * sc, width: 160 * sc, height: 160 * sc, borderRadius: '50%', background: blob1, opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: -30 * sc, left: -30 * sc, width: 120 * sc, height: 120 * sc, borderRadius: '50%', background: blob2, opacity: 0.4 }} />
      <div style={{ position: 'absolute', top: 40 * sc, right: 60 * sc, width: 40 * sc, height: 40 * sc, borderRadius: '50%', background: p, opacity: 0.15 }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${40 * sc}px ${50 * sc}px` }}>
          {c.badge && <div style={{ padding: `${6 * sc}px ${16 * sc}px`, background: p, borderRadius: 24 * sc, color: hexLum(p) > 0.5 ? '#000' : '#fff', fontSize: 10 * sc, fontWeight: 800, letterSpacing: '0.06em', marginBottom: 18 * sc, boxShadow: `0 ${4 * sc}px 0 ${darken(p, 0.2)}` }}>{c.badge}</div>}
          <div style={{ fontSize: 38 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 14 * sc, color: darken(p, 0.2), fontWeight: 600, background: `${p}20`, padding: `${6 * sc}px ${14 * sc}px`, borderRadius: 12 * sc }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 28 * sc, right: 28 * sc, bottom: 16 * sc }}>
          <div style={{ display: 'inline-flex', padding: `${5 * sc}px ${14 * sc}px`, background: p, borderRadius: 20 * sc, marginBottom: 10 * sc, boxShadow: `0 ${3 * sc}px 0 ${darken(p, 0.2)}` }}>
            <span style={{ fontSize: 9 * sc, fontWeight: 800, color: hexLum(p) > 0.5 ? '#000' : '#fff', letterSpacing: '0.08em' }}>{c.badge || L.toUpperCase()}</span>
          </div>
          <div style={{ fontSize: L === 'hook' ? 20 * sc : 22 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 14 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 12 * sc, color: darken(p, 0.3), lineHeight: 1.6, marginBottom: 12 * sc, padding: `${10 * sc}px ${14 * sc}px`, background: `${p}1a`, borderRadius: 10 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 8 * sc, padding: `${7 * sc}px ${12 * sc}px`, background: `${p}${['18', '12', '0d'][i % 3]}`, borderRadius: 10 * sc }}>
              <div style={{ width: 20 * sc, height: 20 * sc, borderRadius: '50%', background: p, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 ${2 * sc}px 0 ${darken(p, 0.2)}` }}><span style={{ fontSize: 9 * sc, fontWeight: 900, color: hexLum(p) > 0.5 ? '#000' : '#fff' }}>{i + 1}</span></div>
              <span style={{ fontSize: 12 * sc, color: ink, lineHeight: 1.4, fontWeight: 600 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChalkboardSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const boardBg = t.isDark ? t.bg : '#2d4a2d';
  const chalk = '#f5f5ef', chalkMuted = '#c8c8b8';
  return (
    <div style={{ width: w, height: H, background: boardBg, position: 'relative', overflow: 'hidden', borderRadius: 6 * sc, fontFamily: "'Courier New',monospace", flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent ${2 * sc}px,${chalk} ${2 * sc}px,${chalk} ${3 * sc}px)`, backgroundSize: `${2 * sc}px ${3 * sc}px` }} />
      <div style={{ position: 'absolute', inset: 0, border: `${3 * sc}px dashed ${chalk}30`, borderRadius: 6 * sc, pointerEvents: 'none' }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${40 * sc}px` }}>
          {c.badge && <div style={{ border: `${2 * sc}px dashed ${p}`, borderRadius: 4 * sc, padding: `${4 * sc}px ${14 * sc}px`, color: p, fontSize: 9 * sc, fontWeight: 700, letterSpacing: '0.18em', marginBottom: 18 * sc, textTransform: 'uppercase' }}>{c.badge}</div>}
          <div style={{ fontSize: 34 * sc, fontWeight: 700, color: chalk, lineHeight: 1.15, marginBottom: 12 * sc, textShadow: `${1 * sc}px ${1 * sc}px 0 ${chalk}22` }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: p, fontWeight: 600, borderBottom: `${2 * sc}px solid ${p}`, paddingBottom: 4 * sc, letterSpacing: '0.06em' }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 26 * sc, left: 28 * sc, right: 28 * sc, bottom: 20 * sc }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 * sc, marginBottom: 10 * sc }}>
            <div style={{ width: 18 * sc, height: 18 * sc, border: `${2 * sc}px solid ${p}`, borderRadius: 3 * sc, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: p }}>{SLIDE_LAYOUTS.indexOf(L) + 1}</span></div>
            <span style={{ fontSize: 9 * sc, color: p, letterSpacing: '0.16em', fontWeight: 700, textTransform: 'uppercase' }}>{c.badge || L}</span>
          </div>
          <div style={{ fontSize: L === 'hook' ? 19 * sc : 20 * sc, fontWeight: 700, color: chalk, lineHeight: 1.2, marginBottom: 14 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: chalkMuted, lineHeight: 1.7, marginBottom: 12 * sc, borderLeft: `${2 * sc}px solid ${p}`, paddingLeft: 10 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 * sc, marginBottom: 7 * sc }}>
              <span style={{ fontSize: 11 * sc, color: p, fontWeight: 700, minWidth: 14 * sc }}>✦</span>
              <span style={{ fontSize: 12 * sc, color: chalkMuted, lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StorybookSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const warmBg = t.isDark ? t.bg : '#fdf8f0';
  const ink = t.isDark ? t.text : '#3d2b1a';
  const accentWarm = t.isDark ? p : darken(p, 0.05);
  const borderColor = t.isDark ? `${p}30` : '#e8d5b7';
  return (
    <div style={{ width: w, height: H, background: warmBg, position: 'relative', overflow: 'hidden', borderRadius: 10 * sc, fontFamily: 'Georgia,serif', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: `${18 * sc}px`, border: `1px solid ${borderColor}`, borderRadius: 6 * sc, pointerEvents: 'none' }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${50 * sc}px ${55 * sc}px` }}>
          {c.badge && <div style={{ fontSize: 9 * sc, color: accentWarm, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 * sc, fontFamily: 'system-ui,sans-serif' }}>{c.badge}</div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 900, color: ink, lineHeight: 1.1, marginBottom: 16 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ display: 'flex', alignItems: 'center', gap: 10 * sc }}>
            <div style={{ height: 1 * sc, width: 24 * sc, background: accentWarm }} />
            <span style={{ fontSize: 13 * sc, color: t.textMuted, fontStyle: 'italic' }}>{c.subtitle}</span>
            <div style={{ height: 1 * sc, width: 24 * sc, background: accentWarm }} />
          </div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 30 * sc, left: 38 * sc, right: 38 * sc, bottom: 24 * sc }}>
          <div style={{ fontSize: 9 * sc, color: accentWarm, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 * sc, fontFamily: 'system-ui,sans-serif' }}>{c.badge || L}</div>
          <div style={{ fontSize: L === 'hook' ? 20 * sc : 21 * sc, fontWeight: 700, color: ink, lineHeight: 1.25, marginBottom: 14 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          <div style={{ width: 38 * sc, height: 1.5 * sc, background: accentWarm, marginBottom: 12 * sc, opacity: 0.6 }} />
          {c.body && <p style={{ fontSize: 12 * sc, color: t.textMuted, lineHeight: 1.75, marginBottom: 12 * sc, fontStyle: 'italic' }}>{c.body}</p>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 10 * sc, marginBottom: 8 * sc, paddingLeft: 4 * sc }}>
              <span style={{ fontSize: 14 * sc, color: accentWarm, lineHeight: 1.3, marginTop: -1 * sc }}>✦</span>
              <span style={{ fontSize: 12 * sc, color: ink, lineHeight: 1.55 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ComicSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#fffde8';
  const ink = t.isDark ? t.text : '#111';
  const tagWords: Record<string, string> = { title: 'POW!', hook: 'HMM!', objectives: 'ZOOM!', instruction: 'BAM!', activity: 'GO!', assessment: 'WIN!', closing: 'YAY!' };
  const tagWord = tagWords[L] || 'WHAM!';
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: "'Arial Black','Impact',sans-serif", flexShrink: 0, outline: `${3 * sc}px solid ${ink}` }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: `radial-gradient(circle,${ink} ${1 * sc}px,transparent ${1 * sc}px)`, backgroundSize: `${10 * sc}px ${10 * sc}px` }} />
      <div style={{ position: 'absolute', top: -20 * sc, right: -20 * sc, width: 140 * sc, height: 140 * sc, background: `conic-gradient(${p}22 0deg 10deg,transparent 10deg 20deg,${p}18 20deg 30deg,transparent 30deg 40deg,${p}14 40deg 50deg,transparent 50deg 360deg)`, borderRadius: '50%' }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${30 * sc}px ${36 * sc}px` }}>
          <div style={{ display: 'inline-flex', marginBottom: 14 * sc, alignSelf: 'flex-start', position: 'relative' }}>
            <div style={{ padding: `${8 * sc}px ${18 * sc}px`, background: p, border: `${3 * sc}px solid ${ink}`, borderRadius: 4 * sc, transform: 'rotate(-2deg)', boxShadow: `${4 * sc}px ${4 * sc}px 0 ${ink}` }}>
              <span style={{ fontSize: 22 * sc, fontWeight: 900, color: hexLum(p) > 0.5 ? '#000' : '#fff', letterSpacing: '0.04em' }}>{tagWord}</span>
            </div>
          </div>
          <div style={{ fontSize: 34 * sc, fontWeight: 900, color: ink, lineHeight: 0.95, letterSpacing: '-0.02em', textTransform: 'uppercase', textShadow: `${2 * sc}px ${2 * sc}px 0 ${p}`, marginBottom: 12 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: p, fontWeight: 800, borderTop: `${2 * sc}px solid ${ink}`, paddingTop: 9 * sc, fontFamily: 'system-ui,sans-serif' }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: p, borderBottom: `${3 * sc}px solid ${ink}`, padding: `${6 * sc}px ${18 * sc}px`, display: 'flex', alignItems: 'center', gap: 12 * sc }}>
            <span style={{ fontSize: 12 * sc, fontWeight: 900, color: hexLum(p) > 0.5 ? '#000' : '#fff' }}>{tagWord}</span>
            <span style={{ fontSize: 9 * sc, fontWeight: 700, color: hexLum(p) > 0.5 ? '#000000aa' : '#ffffffaa', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{c.badge || L}</span>
          </div>
          <div style={{ flex: 1, padding: `${14 * sc}px ${20 * sc}px` }}>
            {L === 'hook' ? (
              <div style={{ position: 'relative', padding: `${14 * sc}px ${18 * sc}px`, background: 'white', border: `${3 * sc}px solid ${ink}`, borderRadius: `0 ${14 * sc}px ${14 * sc}px ${14 * sc}px`, marginBottom: 8 * sc, boxShadow: `${3 * sc}px ${3 * sc}px 0 ${ink}` }}>
                <div style={{ fontSize: 16 * sc, fontWeight: 900, color: ink, lineHeight: 1.25, fontStyle: 'italic' }}>{c.headline}</div>
              </div>
            ) : (
              <div style={{ fontSize: 18 * sc, fontWeight: 900, color: ink, lineHeight: 1.1, marginBottom: 12 * sc, textTransform: 'uppercase' }}>{c.headline}</div>
            )}
            {c.body && <div style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.6, marginBottom: 10 * sc, fontFamily: 'system-ui,sans-serif' }}>{c.body}</div>}
            {(c.bullets || []).map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 * sc, marginBottom: 6 * sc, padding: `${5 * sc}px ${9 * sc}px`, background: i % 2 === 0 ? `${p}15` : 'transparent', border: `${1.5 * sc}px solid ${ink}`, borderRadius: 3 * sc }}>
                <span style={{ width: 16 * sc, height: 16 * sc, background: p, border: `${2 * sc}px solid ${ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'system-ui,sans-serif' }}><span style={{ fontSize: 7 * sc, fontWeight: 900, color: hexLum(p) > 0.5 ? '#000' : '#fff' }}>{i + 1}</span></span>
                <span style={{ fontSize: 11 * sc, color: ink, fontWeight: 700, lineHeight: 1.35, fontFamily: 'system-ui,sans-serif' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ScrapbookSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#f5f0e8';
  const ink = t.isDark ? t.text : '#2a1f0a';
  const tapeColor = lighten(p, 0.55);
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 6 * sc, fontFamily: 'Georgia,serif', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(transparent,transparent ${22 * sc}px,${t.isDark ? p + '06' : '#c8b89033'} ${22 * sc}px,${t.isDark ? p + '06' : '#c8b89033'} ${23 * sc}px)`, pointerEvents: 'none' }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, padding: `${36 * sc}px ${40 * sc}px` }}>
          <div style={{ position: 'absolute', top: 10 * sc, left: '30%', width: '40%', height: 14 * sc, background: tapeColor, opacity: 0.6, borderRadius: 1 * sc, transform: 'rotate(-1.5deg)' }} />
          <div style={{ marginTop: 20 * sc }}>
            <div style={{ fontSize: 9 * sc, fontWeight: 700, color: p, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 * sc, fontFamily: 'system-ui,sans-serif' }}>{c.badge || 'Lesson'}</div>
            <div style={{ fontSize: 36 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc, transform: 'rotate(-0.5deg)' }}>{c.headline}</div>
            {c.subtitle && (
              <div style={{ display: 'inline-block', background: p, padding: `${4 * sc}px ${14 * sc}px`, transform: 'rotate(0.8deg)', boxShadow: `${2 * sc}px ${2 * sc}px ${6 * sc}px rgba(0,0,0,0.15)` }}>
                <span style={{ fontSize: 11 * sc, fontWeight: 700, color: hexLum(p) > 0.5 ? '#111' : '#fff' }}>{c.subtitle}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 18 * sc, left: 22 * sc, right: 22 * sc, bottom: 14 * sc }}>
          <div style={{ position: 'absolute', top: -4 * sc, left: 8 * sc, width: 48 * sc, height: 12 * sc, background: tapeColor, opacity: 0.55, borderRadius: 1 * sc, transform: 'rotate(-1deg)' }} />
          <div style={{ fontSize: 9 * sc, fontWeight: 700, color: p, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 * sc, marginTop: 10 * sc, fontFamily: 'system-ui,sans-serif' }}>{c.badge || L}</div>
          <div style={{ fontSize: L === 'hook' ? 19 * sc : 21 * sc, fontWeight: 700, color: ink, lineHeight: 1.2, marginBottom: 12 * sc, transform: 'rotate(-0.3deg)' }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: t.textMuted, lineHeight: 1.7, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: t.isDark ? `${p}12` : '#fff8ee', border: `1px solid ${t.isDark ? p + '22' : '#e8d5b0'}`, borderRadius: 3 * sc, transform: 'rotate(0.2deg)' }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 9 * sc, marginBottom: 7 * sc, padding: `${6 * sc}px ${10 * sc}px`, background: i % 2 === 0 ? (t.isDark ? `${p}10` : '#fff8f0') : 'transparent', borderBottom: `1px dashed ${t.isDark ? p + '30' : '#c8b890'}` }}>
              <span style={{ fontSize: 13 * sc, color: p, marginTop: -1 * sc }}>✿</span>
              <span style={{ fontSize: 12 * sc, color: ink, lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SLIDE RENDERERS — NEW PRO STYLES
═══════════════════════════════════════ */

function GlassmorphismSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#e8eaf6';
  const glass = t.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)';
  const glassBorder = t.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.7)';
  const ink = t.isDark ? t.text : '#1a1a2e';
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 10 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: -60 * sc, left: -40 * sc, width: 200 * sc, height: 200 * sc, borderRadius: '50%', background: `${p}40`, filter: `blur(${50 * sc}px)` }} />
      <div style={{ position: 'absolute', bottom: -40 * sc, right: -30 * sc, width: 180 * sc, height: 180 * sc, borderRadius: '50%', background: `${lighten(p, 0.3)}50`, filter: `blur(${40 * sc}px)` }} />
      <div style={{ position: 'absolute', top: 50 * sc, right: 80 * sc, width: 80 * sc, height: 80 * sc, borderRadius: '50%', background: `${darken(p, 0.2)}30`, filter: `blur(${30 * sc}px)` }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: `${30 * sc}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${30 * sc}px ${40 * sc}px`, background: glass, border: `1px solid ${glassBorder}`, borderRadius: 16 * sc, backdropFilter: `blur(${10 * sc}px)` }}>
          {c.badge && <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${14 * sc}px`, background: `${p}25`, borderRadius: 20 * sc, marginBottom: 14 * sc, alignSelf: 'flex-start', border: `1px solid ${p}40` }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: p, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 800, color: ink, lineHeight: 1.1, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 14 * sc, color: t.textMuted, fontWeight: 500 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 20 * sc, left: 20 * sc, right: 20 * sc, bottom: 16 * sc, background: glass, border: `1px solid ${glassBorder}`, borderRadius: 14 * sc, backdropFilter: `blur(${10 * sc}px)`, padding: `${20 * sc}px ${26 * sc}px` }}>
          {c.badge && <div style={{ display: 'inline-flex', padding: `${3 * sc}px ${10 * sc}px`, background: `${p}20`, borderRadius: 12 * sc, marginBottom: 8 * sc, border: `1px solid ${p}30` }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: p, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 20 * sc, fontWeight: 700, color: ink, lineHeight: 1.2, marginBottom: 14 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: t.textMuted, lineHeight: 1.6, marginBottom: 12 * sc, padding: `${10 * sc}px`, background: `${glass}`, borderRadius: 8 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc, padding: `${6 * sc}px ${10 * sc}px`, background: i % 2 === 0 ? `${p}0d` : 'transparent', borderRadius: 8 * sc }}>
              <div style={{ width: 6 * sc, height: 6 * sc, borderRadius: '50%', background: p, boxShadow: `0 0 ${6 * sc}px ${p}60`, flexShrink: 0 }} />
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GradientMeshSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const p2 = lighten(p, 0.25), p3 = darken(p, 0.2);
  const ink = '#ffffff';
  return (
    <div style={{ width: w, height: H, background: `linear-gradient(135deg, ${p3} 0%, ${p} 35%, ${p2} 65%, ${lighten(p, 0.45)} 100%)`, position: 'relative', overflow: 'hidden', borderRadius: 10 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: -30 * sc, right: -50 * sc, width: 220 * sc, height: 220 * sc, borderRadius: '50%', background: `${lighten(p, 0.5)}44`, filter: `blur(${40 * sc}px)` }} />
      <div style={{ position: 'absolute', bottom: -20 * sc, left: 30 * sc, width: 150 * sc, height: 150 * sc, borderRadius: '50%', background: `${darken(p, 0.3)}55`, filter: `blur(${35 * sc}px)` }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${44 * sc}px ${46 * sc}px` }}>
          {c.badge && <div style={{ display: 'inline-flex', padding: `${5 * sc}px ${14 * sc}px`, background: 'rgba(255,255,255,0.18)', borderRadius: 20 * sc, marginBottom: 16 * sc, alignSelf: 'flex-start' }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: ink, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 38 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc, textShadow: `0 ${2 * sc}px ${8 * sc}px rgba(0,0,0,0.25)` }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 14 * sc, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 28 * sc, right: 28 * sc, bottom: 16 * sc }}>
          {c.badge && <div style={{ display: 'inline-flex', padding: `${3 * sc}px ${10 * sc}px`, background: 'rgba(255,255,255,0.15)', borderRadius: 14 * sc, marginBottom: 8 * sc }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: ink, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 21 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 14 * sc, textShadow: `0 ${1 * sc}px ${4 * sc}px rgba(0,0,0,0.2)` }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 12 * sc, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 12 * sc, padding: `${10 * sc}px ${12 * sc}px`, background: 'rgba(255,255,255,0.1)', borderRadius: 8 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 18 * sc, height: 18 * sc, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 8 * sc, fontWeight: 800, color: ink }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: 'rgba(255,255,255,0.9)', lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MinimalistSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#ffffff';
  const ink = t.isDark ? t.text : '#222222';
  const muted = t.isDark ? t.textMuted : '#999999';
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", flexShrink: 0 }}>
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: `${50 * sc}px ${48 * sc}px` }}>
          {c.badge && <div style={{ fontSize: 8 * sc, fontWeight: 500, color: muted, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 12 * sc }}>{c.badge}</div>}
          <div style={{ fontSize: 40 * sc, fontWeight: 300, color: ink, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 18 * sc }}>{c.headline}</div>
          <div style={{ width: 30 * sc, height: 1 * sc, background: p, marginBottom: 12 * sc }} />
          {c.subtitle && <div style={{ fontSize: 12 * sc, color: muted, fontWeight: 400, letterSpacing: '0.02em' }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 36 * sc, left: 48 * sc, right: 48 * sc, bottom: 30 * sc }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 6 * sc }}>
            <div style={{ width: 16 * sc, height: 1 * sc, background: p }} />
            <span style={{ fontSize: 8 * sc, color: muted, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}>{c.badge || L}</span>
          </div>
          <div style={{ fontSize: 22 * sc, fontWeight: 300, color: ink, lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: 18 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: muted, lineHeight: 1.75, marginBottom: 14 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 * sc, marginBottom: 10 * sc, paddingBottom: 10 * sc, borderBottom: `0.5px solid ${t.isDark ? '#ffffff0d' : '#eee'}` }}>
              <span style={{ fontSize: 9 * sc, color: p, fontWeight: 500, minWidth: 12 * sc }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.55, fontWeight: 400 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DuotoneSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const dark = darken(p, 0.55);
  const light = lighten(p, 0.85);
  const mid = lighten(p, 0.4);
  return (
    <div style={{ width: w, height: H, background: t.isDark ? t.bg : dark, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      {L === 'title' ? (
        <>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: p }} />
          {c.image && <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', backgroundImage: `url(${c.image})`, backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'luminosity', opacity: 0.4 }} />}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${30 * sc}px ${36 * sc}px` }}>
            {c.badge && <div style={{ fontSize: 9 * sc, fontWeight: 700, color: mid, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14 * sc }}>{c.badge}</div>}
            <div style={{ fontSize: 32 * sc, fontWeight: 900, color: '#ffffff', lineHeight: 1.05, marginBottom: 12 * sc }}>{c.headline}</div>
            {c.subtitle && <div style={{ fontSize: 12 * sc, color: mid, fontWeight: 500 }}>{c.subtitle}</div>}
          </div>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', display: 'flex', alignItems: 'flex-end', padding: `${24 * sc}px` }}>
            {c.subtitle && <div style={{ fontSize: 11 * sc, color: hexLum(p) > 0.5 ? dark : 'rgba(255,255,255,0.7)', fontWeight: 600, textAlign: 'right' }}>{c.subtitle}</div>}
          </div>
        </>
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
          <div style={{ width: 6 * sc, background: p, flexShrink: 0 }} />
          <div style={{ flex: 1, padding: `${22 * sc}px ${28 * sc}px` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 * sc, marginBottom: 8 * sc }}>
              <div style={{ padding: `${3 * sc}px ${10 * sc}px`, background: p, borderRadius: 2 * sc }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: hexLum(p) > 0.5 ? dark : '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge || L}</span></div>
            </div>
            <div style={{ fontSize: 21 * sc, fontWeight: 800, color: '#ffffff', lineHeight: 1.15, marginBottom: 14 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
            {c.body && <div style={{ fontSize: 11 * sc, color: mid, lineHeight: 1.65, marginBottom: 12 * sc }}>{c.body}</div>}
            {(c.bullets || []).map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
                <div style={{ width: 4 * sc, height: 4 * sc, background: p, flexShrink: 0 }} />
                <span style={{ fontSize: 11 * sc, color: light, lineHeight: 1.45 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NeonLineSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#0a0a1a';
  const neon = p, neonGlow = `${p}80`;
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2 * sc, background: neon, boxShadow: `0 0 ${10 * sc}px ${neonGlow}, 0 0 ${20 * sc}px ${neonGlow}` }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 * sc, background: neon, boxShadow: `0 0 ${10 * sc}px ${neonGlow}` }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: 2 * sc, height: '100%', background: neon, boxShadow: `0 0 ${8 * sc}px ${neonGlow}` }} />
      <div style={{ position: 'absolute', top: '20%', right: 30 * sc, width: 80 * sc, height: 80 * sc, border: `1px solid ${neon}40`, borderRadius: '50%', boxShadow: `0 0 ${15 * sc}px ${neonGlow}33` }} />
      <div style={{ position: 'absolute', bottom: '15%', right: 80 * sc, width: 40 * sc, height: 40 * sc, border: `1px solid ${neon}30`, transform: 'rotate(45deg)' }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${40 * sc}px ${44 * sc}px` }}>
          {c.badge && <div style={{ fontSize: 9 * sc, fontWeight: 700, color: neon, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 * sc, textShadow: `0 0 ${8 * sc}px ${neonGlow}` }}>{c.badge}</div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 800, color: '#ffffff', lineHeight: 1.05, marginBottom: 14 * sc }}>{c.headline}</div>
          <div style={{ width: 50 * sc, height: 2 * sc, background: neon, boxShadow: `0 0 ${8 * sc}px ${neonGlow}`, marginBottom: 12 * sc }} />
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: '#888899' }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 24 * sc, right: 24 * sc, bottom: 16 * sc }}>
          <div style={{ display: 'inline-flex', padding: `${3 * sc}px ${10 * sc}px`, border: `1px solid ${neon}60`, borderRadius: 3 * sc, marginBottom: 8 * sc, boxShadow: `0 0 ${6 * sc}px ${neonGlow}33` }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: neon, letterSpacing: '0.12em', textTransform: 'uppercase', textShadow: `0 0 ${5 * sc}px ${neonGlow}` }}>{c.badge || L}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 700, color: '#ffffff', lineHeight: 1.2, marginBottom: 14 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: '#aaaabb', lineHeight: 1.6, marginBottom: 12 * sc, borderLeft: `2px solid ${neon}`, paddingLeft: 12 * sc, boxShadow: `-2px 0 ${6 * sc}px ${neonGlow}33` }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 8 * sc, height: 8 * sc, border: `1px solid ${neon}`, boxShadow: `0 0 ${4 * sc}px ${neonGlow}`, flexShrink: 0 }} />
              <span style={{ fontSize: 11 * sc, color: '#ccccdd', lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BlueprintSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#1a3a5c';
  const gridColor = t.isDark ? `${p}12` : 'rgba(255,255,255,0.08)';
  const ink = '#ffffff';
  const muted = 'rgba(255,255,255,0.55)';
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 6 * sc, fontFamily: "'Courier New',monospace", flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${gridColor} 1px,transparent 1px),linear-gradient(90deg,${gridColor} 1px,transparent 1px)`, backgroundSize: `${20 * sc}px ${20 * sc}px` }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${gridColor} 1px,transparent 1px),linear-gradient(90deg,${gridColor} 1px,transparent 1px)`, backgroundSize: `${100 * sc}px ${100 * sc}px`, opacity: 2 }} />
      <div style={{ position: 'absolute', top: 8 * sc, right: 12 * sc, fontSize: 7 * sc, color: muted, letterSpacing: '0.1em' }}>DWG-{SLIDE_LAYOUTS.indexOf(L) + 1}</div>
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${40 * sc}px ${44 * sc}px` }}>
          {c.badge && <div style={{ fontSize: 9 * sc, fontWeight: 600, color: p, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 * sc, borderBottom: `1px dashed ${p}60`, paddingBottom: 6 * sc, display: 'inline-block' }}>{c.badge}</div>}
          <div style={{ fontSize: 32 * sc, fontWeight: 700, color: ink, lineHeight: 1.1, marginBottom: 14 * sc, letterSpacing: '-0.01em' }}>{c.headline}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 * sc }}>
            <div style={{ width: 8 * sc, height: 8 * sc, border: `1px solid ${p}`, transform: 'rotate(45deg)' }} />
            {c.subtitle && <span style={{ fontSize: 11 * sc, color: muted }}>{c.subtitle}</span>}
          </div>
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 24 * sc, right: 24 * sc, bottom: 14 * sc }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 * sc, marginBottom: 8 * sc }}>
            <div style={{ width: 12 * sc, height: 12 * sc, border: `1.5px solid ${p}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 7 * sc, fontWeight: 700, color: p }}>{SLIDE_LAYOUTS.indexOf(L) + 1}</span></div>
            <span style={{ fontSize: 8 * sc, color: p, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{c.badge || L}</span>
            <div style={{ flex: 1, height: 0.5 * sc, background: `${p}40` }} />
          </div>
          <div style={{ fontSize: 18 * sc, fontWeight: 700, color: ink, lineHeight: 1.2, marginBottom: 14 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 10 * sc, color: muted, lineHeight: 1.65, marginBottom: 12 * sc, padding: `${8 * sc}px ${10 * sc}px`, border: `1px dashed ${p}40`, borderRadius: 2 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 * sc, marginBottom: 6 * sc }}>
              <span style={{ fontSize: 9 * sc, color: p, fontWeight: 700, minWidth: 20 * sc }}>{'>'} {i + 1}</span>
              <span style={{ fontSize: 10 * sc, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MagazineSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#fafafa';
  const ink = t.isDark ? t.text : '#111';
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: 'Georgia,serif', flexShrink: 0 }}>
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
          <div style={{ width: '55%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${28 * sc}px ${32 * sc}px` }}>
            {c.badge && <div style={{ fontSize: 8 * sc, fontWeight: 700, color: p, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 * sc, fontFamily: 'system-ui,sans-serif' }}>{c.badge}</div>}
            <div style={{ fontSize: 34 * sc, fontWeight: 900, color: ink, lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: 14 * sc }}>{c.headline}</div>
            <div style={{ width: 26 * sc, height: 3 * sc, background: p, marginBottom: 10 * sc }} />
            {c.subtitle && <div style={{ fontSize: 13 * sc, color: t.textMuted, fontStyle: 'italic', lineHeight: 1.5 }}>{c.subtitle}</div>}
          </div>
          <div style={{ width: '45%', background: c.image ? `url(${c.image})` : `linear-gradient(135deg, ${p}22, ${p}44)`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 4 * sc, height: '100%', background: p }} />
          </div>
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: `${10 * sc}px ${28 * sc}px`, borderBottom: `1px solid ${t.isDark ? '#ffffff14' : '#e0e0e0'}` }}>
            <span style={{ fontSize: 8 * sc, fontWeight: 700, color: p, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'system-ui,sans-serif' }}>{c.badge || L}</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 7 * sc, color: t.textMuted, fontFamily: 'system-ui,sans-serif' }}>Section {SLIDE_LAYOUTS.indexOf(L) + 1}</span>
          </div>
          <div style={{ flex: 1, padding: `${16 * sc}px ${28 * sc}px`, display: 'flex', gap: 20 * sc }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22 * sc, fontWeight: 800, color: ink, lineHeight: 1.15, marginBottom: 14 * sc }}>{L === 'hook' ? (
                <><span style={{ fontSize: 40 * sc, color: p, fontWeight: 900, lineHeight: 0.8 }}>"</span>{c.headline}</>
              ) : c.headline}</div>
              {c.body && <div style={{ fontSize: 11 * sc, color: t.textMuted, lineHeight: 1.7, marginBottom: 10 * sc, fontStyle: 'italic' }}>{c.body}</div>}
            </div>
            {(c.bullets || []).length > 0 && (
              <div style={{ width: '42%', borderLeft: `2px solid ${p}`, paddingLeft: 14 * sc }}>
                {(c.bullets || []).map((b, i) => (
                  <div key={i} style={{ marginBottom: 8 * sc, paddingBottom: 8 * sc, borderBottom: `0.5px solid ${t.isDark ? '#ffffff10' : '#eee'}` }}>
                    <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.5, fontFamily: 'system-ui,sans-serif' }}>{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CorporateSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#ffffff';
  const ink = t.isDark ? t.text : '#1e293b';
  const muted = t.isDark ? t.textMuted : '#64748b';
  const stripe = t.isDark ? `${p}18` : lighten(p, 0.9);
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: "'Segoe UI',system-ui,sans-serif", flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4 * sc, background: `linear-gradient(90deg, ${p}, ${lighten(p, 0.3)})` }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '35%', height: '100%', background: stripe, clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${40 * sc}px ${44 * sc}px` }}>
          <div style={{ width: 40 * sc, height: 3 * sc, background: p, marginBottom: 18 * sc }} />
          {c.badge && <div style={{ fontSize: 9 * sc, fontWeight: 600, color: p, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 * sc }}>{c.badge}</div>}
          <div style={{ fontSize: 34 * sc, fontWeight: 700, color: ink, lineHeight: 1.1, marginBottom: 12 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: muted, fontWeight: 400 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 20 * sc, left: 30 * sc, right: 30 * sc, bottom: 16 * sc }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 10 * sc }}>
            <div style={{ width: 3 * sc, height: 16 * sc, background: p, borderRadius: 2 * sc }} />
            <span style={{ fontSize: 9 * sc, fontWeight: 600, color: p, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{c.badge || L}</span>
          </div>
          <div style={{ fontSize: 20 * sc, fontWeight: 700, color: ink, lineHeight: 1.2, marginBottom: 14 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: muted, lineHeight: 1.65, marginBottom: 12 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 20 * sc, height: 20 * sc, background: `${p}15`, border: `1px solid ${p}30`, borderRadius: 4 * sc, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: p }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WatercolorSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#fefdfb';
  const ink = t.isDark ? t.text : '#2d2926';
  const wash1 = `${p}18`, wash2 = `${lighten(p, 0.3)}22`, wash3 = `${darken(p, 0.1)}15`;
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 10 * sc, fontFamily: 'Georgia,serif', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: -20 * sc, right: -40 * sc, width: 240 * sc, height: 180 * sc, background: `radial-gradient(ellipse, ${wash1} 0%, transparent 70%)`, transform: 'rotate(-15deg)' }} />
      <div style={{ position: 'absolute', bottom: -30 * sc, left: -20 * sc, width: 200 * sc, height: 160 * sc, background: `radial-gradient(ellipse, ${wash2} 0%, transparent 70%)`, transform: 'rotate(10deg)' }} />
      <div style={{ position: 'absolute', top: '30%', left: '40%', width: 140 * sc, height: 100 * sc, background: `radial-gradient(ellipse, ${wash3} 0%, transparent 65%)` }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${44 * sc}px ${50 * sc}px` }}>
          {c.badge && <div style={{ fontSize: 9 * sc, fontWeight: 600, color: p, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 14 * sc, fontFamily: 'system-ui,sans-serif' }}>{c.badge}</div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 700, color: ink, lineHeight: 1.1, marginBottom: 16 * sc, fontStyle: 'italic' }}>{c.headline}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 * sc }}>
            <div style={{ width: 30 * sc, height: 2 * sc, background: `linear-gradient(90deg, transparent, ${p}, transparent)`, borderRadius: 2 * sc }} />
            {c.subtitle && <span style={{ fontSize: 12 * sc, color: t.textMuted, fontStyle: 'italic' }}>{c.subtitle}</span>}
            <div style={{ width: 30 * sc, height: 2 * sc, background: `linear-gradient(90deg, transparent, ${p}, transparent)`, borderRadius: 2 * sc }} />
          </div>
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 28 * sc, left: 36 * sc, right: 36 * sc, bottom: 20 * sc }}>
          <div style={{ fontSize: 9 * sc, fontWeight: 600, color: p, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 * sc, fontFamily: 'system-ui,sans-serif' }}>{c.badge || L}</div>
          <div style={{ fontSize: 21 * sc, fontWeight: 700, color: ink, lineHeight: 1.2, marginBottom: 14 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          <div style={{ width: 40 * sc, height: 2 * sc, background: `linear-gradient(90deg, ${p}, transparent)`, borderRadius: 2 * sc, marginBottom: 12 * sc }} />
          {c.body && <div style={{ fontSize: 11 * sc, color: t.textMuted, lineHeight: 1.7, marginBottom: 12 * sc, fontStyle: 'italic' }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 * sc, marginBottom: 8 * sc }}>
              <div style={{ width: 8 * sc, height: 8 * sc, borderRadius: '50%', background: `${p}40`, border: `1px solid ${p}60`, flexShrink: 0, marginTop: 3 * sc }} />
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.55 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MonochromeSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#111111';
  const ink = '#ffffff';
  const muted = '#888888';
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", flexShrink: 0 }}>
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${44 * sc}px ${48 * sc}px` }}>
          {c.badge && <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: p, marginBottom: 16 * sc, alignSelf: 'flex-start' }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: hexLum(p) > 0.5 ? '#000' : '#fff', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 40 * sc, fontWeight: 900, color: ink, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 16 * sc }}>{c.headline}</div>
          <div style={{ height: 1 * sc, width: '100%', background: '#333', marginBottom: 12 * sc }} />
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: muted, fontWeight: 300 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 24 * sc, left: 36 * sc, right: 36 * sc, bottom: 18 * sc }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 * sc, marginBottom: 10 * sc }}>
            <div style={{ width: 12 * sc, height: 12 * sc, background: p }} />
            <span style={{ fontSize: 8 * sc, fontWeight: 600, color: muted, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{c.badge || L}</span>
          </div>
          <div style={{ fontSize: 22 * sc, fontWeight: 800, color: ink, lineHeight: 1.15, marginBottom: 16 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: muted, lineHeight: 1.65, marginBottom: 14 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 * sc, marginBottom: 7 * sc, paddingBottom: 7 * sc, borderBottom: `0.5px solid #222` }}>
              <span style={{ fontSize: 9 * sc, color: p, fontWeight: 700, minWidth: 14 * sc }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 11 * sc, color: '#cccccc', lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SLIDE RENDERERS — NEW KIDS STYLES
═══════════════════════════════════════ */

function SpaceSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#0b0d2e';
  const starColor = '#ffffff';
  return (
    <div style={{ width: w, height: H, background: `radial-gradient(ellipse at 30% 40%, #1a1a4e 0%, ${bg} 70%)`, position: 'relative', overflow: 'hidden', borderRadius: 10 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      {[...Array(12)].map((_, i) => <div key={i} style={{ position: 'absolute', width: (1 + (i % 3)) * sc, height: (1 + (i % 3)) * sc, borderRadius: '50%', background: starColor, opacity: 0.3 + (i % 4) * 0.15, top: `${(i * 17 + 5) % 90}%`, left: `${(i * 23 + 8) % 95}%` }} />)}
      <div style={{ position: 'absolute', bottom: -30 * sc, right: 30 * sc, width: 60 * sc, height: 60 * sc, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, #ffd700 0%, ${p} 50%, transparent 60%)`, boxShadow: `0 0 ${20 * sc}px ${p}44`, opacity: 0.7 }} />
      <div style={{ position: 'absolute', top: 20 * sc, right: 60 * sc, width: 30 * sc, height: 30 * sc, borderRadius: '50%', background: `radial-gradient(circle at 40% 40%, #888 0%, #444 70%)`, boxShadow: `inset -${3 * sc}px -${3 * sc}px ${5 * sc}px rgba(0,0,0,0.5)`, opacity: 0.5 }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${40 * sc}px` }}>
          {c.badge && <div style={{ padding: `${5 * sc}px ${16 * sc}px`, background: `${p}30`, border: `1px solid ${p}60`, borderRadius: 20 * sc, marginBottom: 16 * sc }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: p, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 900, color: '#ffffff', lineHeight: 1.05, marginBottom: 14 * sc, textShadow: `0 0 ${12 * sc}px ${p}66` }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: '#8888cc' }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `${p}25`, borderRadius: 14 * sc, marginBottom: 8 * sc, border: `1px solid ${p}50` }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: p, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{'🚀'} {c.badge || L}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: '#aaaadd', lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: 'rgba(255,255,255,0.05)', borderRadius: 8 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 18 * sc, height: 18 * sc, borderRadius: '50%', background: `${p}30`, border: `1px solid ${p}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 8 * sc, fontWeight: 800, color: '#fff' }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: '#ccccee', lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CandySlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#fff5f9';
  const ink = t.isDark ? t.text : '#4a1942';
  const pastel1 = lighten(p, 0.7), pastel2 = lighten(p, 0.8);
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 16 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6 * sc, background: `repeating-linear-gradient(90deg, ${p} 0px, ${p} ${10 * sc}px, ${pastel1} ${10 * sc}px, ${pastel1} ${20 * sc}px, ${pastel2} ${20 * sc}px, ${pastel2} ${30 * sc}px)` }} />
      {[...Array(6)].map((_, i) => <div key={i} style={{ position: 'absolute', width: (3 + i % 3) * sc, height: (3 + i % 3) * sc, borderRadius: '50%', background: i % 2 === 0 ? p : pastel1, opacity: 0.3, top: `${15 + (i * 19) % 70}%`, left: `${8 + (i * 27) % 85}%` }} />)}
      <div style={{ position: 'absolute', top: -20 * sc, right: -20 * sc, width: 100 * sc, height: 100 * sc, borderRadius: '50%', background: `${pastel1}66` }} />
      <div style={{ position: 'absolute', bottom: -15 * sc, left: -15 * sc, width: 80 * sc, height: 80 * sc, borderRadius: '50%', background: `${pastel2}55` }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${40 * sc}px` }}>
          {c.badge && <div style={{ padding: `${6 * sc}px ${18 * sc}px`, background: `linear-gradient(135deg, ${p}, ${lighten(p, 0.3)})`, borderRadius: 24 * sc, color: '#fff', fontSize: 10 * sc, fontWeight: 800, marginBottom: 16 * sc, boxShadow: `0 ${3 * sc}px 0 ${darken(p, 0.15)}` }}>{c.badge}</div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: darken(p, 0.1), fontWeight: 600, padding: `${5 * sc}px ${14 * sc}px`, background: `${p}15`, borderRadius: 14 * sc }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc }}>
          <div style={{ display: 'inline-flex', padding: `${5 * sc}px ${14 * sc}px`, background: `linear-gradient(135deg, ${p}, ${lighten(p, 0.2)})`, borderRadius: 20 * sc, marginBottom: 10 * sc, boxShadow: `0 ${2 * sc}px 0 ${darken(p, 0.15)}` }}><span style={{ fontSize: 9 * sc, fontWeight: 800, color: '#fff', letterSpacing: '0.06em' }}>{'🍬'} {c.badge || L.toUpperCase()}</span></div>
          <div style={{ fontSize: 21 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: darken(p, 0.3), lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: `${p}12`, borderRadius: 10 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc, padding: `${6 * sc}px ${10 * sc}px`, background: i % 2 === 0 ? `${pastel1}55` : `${pastel2}44`, borderRadius: 10 * sc }}>
              <div style={{ width: 18 * sc, height: 18 * sc, borderRadius: '50%', background: `linear-gradient(135deg, ${p}, ${lighten(p, 0.25)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 8 * sc, fontWeight: 900, color: '#fff' }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.4, fontWeight: 600 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UnderwaterSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#0a2f4e';
  const wave = lighten(p, 0.3);
  return (
    <div style={{ width: w, height: H, background: `linear-gradient(180deg, ${lighten(bg, 0.15)} 0%, ${bg} 50%, ${darken(bg, 0.2)} 100%)`, position: 'relative', overflow: 'hidden', borderRadius: 12 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      {[...Array(8)].map((_, i) => <div key={i} style={{ position: 'absolute', width: (4 + i % 4) * sc, height: (4 + i % 4) * sc, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', top: `${10 + (i * 13) % 75}%`, left: `${5 + (i * 19) % 88}%` }} />)}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} viewBox="0 0 640 60" preserveAspectRatio="none">
        <path d={`M0,30 Q80,10 160,30 T320,30 T480,30 T640,30 L640,60 L0,60 Z`} fill={`${wave}15`} />
        <path d={`M0,40 Q80,25 160,40 T320,40 T480,40 T640,40 L640,60 L0,60 Z`} fill={`${wave}10`} />
      </svg>
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${36 * sc}px` }}>
          {c.badge && <div style={{ padding: `${5 * sc}px ${16 * sc}px`, background: `${p}30`, borderRadius: 20 * sc, marginBottom: 16 * sc, border: `1px solid ${p}50` }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: wave, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{'🐠'} {c.badge}</span></div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 900, color: '#ffffff', lineHeight: 1.05, marginBottom: 14 * sc, textShadow: `0 ${2 * sc}px ${6 * sc}px rgba(0,0,0,0.3)` }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: wave }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 20 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `${p}25`, borderRadius: 14 * sc, marginBottom: 8 * sc }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: wave, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{'🫧'} {c.badge || L}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: 'rgba(255,255,255,0.06)', borderRadius: 8 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 16 * sc, height: 16 * sc, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: `1px solid ${wave}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: wave }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: 'rgba(255,255,255,0.85)', lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function JungleSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#1a3c1a';
  const leaf = lighten(p, 0.2);
  const ink = '#f5f0e0';
  const earthy = '#c8a96e';
  return (
    <div style={{ width: w, height: H, background: `linear-gradient(160deg, ${darken(bg, 0.15)} 0%, ${bg} 50%, ${lighten(bg, 0.1)} 100%)`, position: 'relative', overflow: 'hidden', borderRadius: 10 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: -30 * sc, left: -20 * sc, width: 120 * sc, height: 120 * sc, background: `${leaf}18`, borderRadius: '60% 40% 50% 50%', transform: 'rotate(-30deg)' }} />
      <div style={{ position: 'absolute', bottom: -20 * sc, right: -30 * sc, width: 140 * sc, height: 100 * sc, background: `${leaf}14`, borderRadius: '50% 60% 40% 50%', transform: 'rotate(15deg)' }} />
      <div style={{ position: 'absolute', top: 10 * sc, right: 40 * sc, width: 50 * sc, height: 80 * sc, background: `${leaf}10`, borderRadius: '50% 50% 50% 50%', transform: 'rotate(20deg)' }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${36 * sc}px ${40 * sc}px` }}>
          {c.badge && <div style={{ display: 'inline-flex', padding: `${5 * sc}px ${14 * sc}px`, background: earthy, borderRadius: 4 * sc, marginBottom: 14 * sc, alignSelf: 'flex-start' }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: '#1a1a0a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{'🌿'} {c.badge}</span></div>}
          <div style={{ fontSize: 34 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc, textShadow: `0 ${2 * sc}px ${4 * sc}px rgba(0,0,0,0.3)` }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: earthy, fontWeight: 600 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `${earthy}33`, borderRadius: 4 * sc, marginBottom: 8 * sc, border: `1px solid ${earthy}55` }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: earthy, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge || L}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: 'rgba(255,255,240,0.7)', lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: 'rgba(255,255,255,0.05)', borderRadius: 6 * sc, borderLeft: `3px solid ${earthy}` }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <span style={{ fontSize: 12 * sc, flexShrink: 0 }}>{'🌱🍃🌿🌴🌳'[i % 5]}</span>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.45, fontWeight: 500 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PixelSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#1a1a2e';
  const ink = '#00ff41';
  const dim = '#00cc33';
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 4 * sc, fontFamily: "'Courier New',monospace", flexShrink: 0, imageRendering: 'pixelated' as any }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(0,255,65,0.03) 1px,transparent 1px)`, backgroundSize: `100% ${4 * sc}px`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 14 * sc, background: `${p}`, display: 'flex', alignItems: 'center', padding: `0 ${8 * sc}px`, gap: 4 * sc }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => <div key={i} style={{ width: 6 * sc, height: 6 * sc, borderRadius: '50%', background: c }} />)}
        <span style={{ fontSize: 7 * sc, color: hexLum(p) > 0.5 ? '#000' : '#fff', fontWeight: 700, marginLeft: 6 * sc }}>PIXEL_DECK.exe</span>
      </div>
      {L === 'title' ? (
        <div style={{ position: 'absolute', top: 24 * sc, left: 20 * sc, right: 20 * sc, bottom: 12 * sc, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {c.badge && <div style={{ fontSize: 9 * sc, color: p, marginBottom: 10 * sc }}>{'>'} {c.badge}</div>}
          <div style={{ fontSize: 28 * sc, fontWeight: 700, color: ink, lineHeight: 1.1, marginBottom: 12 * sc, textShadow: `0 0 ${6 * sc}px ${ink}44` }}>{'> '}{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 11 * sc, color: dim, marginTop: 4 * sc }}>{'// '}{c.subtitle}</div>}
          <div style={{ fontSize: 10 * sc, color: `${ink}55`, marginTop: 16 * sc }}>{'█'.repeat(20)} LOADING... 100%</div>
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 24 * sc, left: 16 * sc, right: 16 * sc, bottom: 12 * sc }}>
          <div style={{ fontSize: 9 * sc, color: p, marginBottom: 6 * sc }}>{'['}STAGE {SLIDE_LAYOUTS.indexOf(L) + 1}{'] '}{(c.badge || L).toUpperCase()}</div>
          <div style={{ fontSize: 16 * sc, fontWeight: 700, color: ink, lineHeight: 1.2, marginBottom: 10 * sc, textShadow: `0 0 ${4 * sc}px ${ink}33` }}>{L === 'hook' ? `"${c.headline}"` : `> ${c.headline}`}</div>
          {c.body && <div style={{ fontSize: 10 * sc, color: dim, lineHeight: 1.6, marginBottom: 8 * sc, padding: `${6 * sc}px ${8 * sc}px`, border: `1px solid ${ink}33`, borderRadius: 0 }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 * sc, marginBottom: 5 * sc }}>
              <span style={{ fontSize: 10 * sc, color: p, fontWeight: 700, minWidth: 20 * sc }}>[{i + 1}]</span>
              <span style={{ fontSize: 10 * sc, color: dim, lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RainbowSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#ffffff';
  const ink = t.isDark ? t.text : '#333333';
  const rainbow = ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7', '#9775fa', '#f783ac'];
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 14 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5 * sc, background: `linear-gradient(90deg, ${rainbow.join(',')})` }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5 * sc, background: `linear-gradient(90deg, ${rainbow.join(',')})` }} />
      <div style={{ position: 'absolute', top: -60 * sc, right: -60 * sc, width: 180 * sc, height: 180 * sc, borderRadius: '50%', background: 'transparent', border: `${12 * sc}px solid transparent`, borderTopColor: rainbow[0], borderRightColor: rainbow[2], borderBottomColor: rainbow[4], borderLeftColor: rainbow[6], opacity: 0.15 }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${40 * sc}px` }}>
          {c.badge && <div style={{ padding: `${5 * sc}px ${16 * sc}px`, background: `linear-gradient(90deg, ${rainbow[0]}22, ${rainbow[3]}22, ${rainbow[6]}22)`, borderRadius: 20 * sc, marginBottom: 16 * sc }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: p, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 38 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: t.textMuted, fontWeight: 600 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 20 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `linear-gradient(90deg, ${rainbow[0]}18, ${rainbow[3]}18)`, borderRadius: 14 * sc, marginBottom: 8 * sc }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: p, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{'🌈'} {c.badge || L}</span></div>
          <div style={{ fontSize: 21 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: t.textMuted, lineHeight: 1.6, marginBottom: 10 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc, padding: `${6 * sc}px ${10 * sc}px`, borderLeft: `3px solid ${rainbow[i % rainbow.length]}`, borderRadius: `0 8px 8px 0`, background: `${rainbow[i % rainbow.length]}0d` }}>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.4, fontWeight: 600 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CrayonSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#fdf6e3';
  const ink = t.isDark ? t.text : '#3c2415';
  const crayonColors = [p, '#e74c3c', '#3498db', '#2ecc71', '#f39c12'];
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: "'Comic Sans MS','Segoe UI',cursive,sans-serif", flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.8' type='fractalNoise'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E")`, opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: 6 * sc, left: 6 * sc, right: 6 * sc, bottom: 6 * sc, border: `${3 * sc}px solid ${p}30`, borderRadius: 6 * sc, pointerEvents: 'none' }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${36 * sc}px` }}>
          {c.badge && <div style={{ fontSize: 10 * sc, fontWeight: 700, color: p, marginBottom: 12 * sc, padding: `${4 * sc}px ${14 * sc}px`, background: `${p}15`, borderRadius: 8 * sc, transform: 'rotate(-1deg)' }}>{'✏️'} {c.badge}</div>}
          <div style={{ fontSize: 34 * sc, fontWeight: 700, color: ink, lineHeight: 1.1, marginBottom: 14 * sc, textDecoration: `underline wavy ${p}`, textDecorationThickness: `${2 * sc}px`, textUnderlineOffset: `${6 * sc}px` }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: darken(p, 0.2), fontWeight: 600 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 20 * sc, left: 24 * sc, right: 24 * sc, bottom: 14 * sc }}>
          <div style={{ fontSize: 10 * sc, fontWeight: 700, color: p, marginBottom: 8 * sc, transform: 'rotate(-0.5deg)' }}>{'✏️'} {c.badge || L.toUpperCase()}</div>
          <div style={{ fontSize: 20 * sc, fontWeight: 700, color: ink, lineHeight: 1.2, marginBottom: 12 * sc, transform: 'rotate(0.3deg)' }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: t.textMuted, lineHeight: 1.65, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: `${p}0d`, borderRadius: 6 * sc, transform: 'rotate(-0.3deg)' }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc, transform: `rotate(${(i % 2 === 0 ? -0.5 : 0.5)}deg)` }}>
              <div style={{ width: 22 * sc, height: 6 * sc, background: crayonColors[i % crayonColors.length], borderRadius: `${3 * sc}px`, flexShrink: 0, opacity: 0.7 }} />
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.45, fontWeight: 600 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrigamiSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#f0ece4';
  const ink = t.isDark ? t.text : '#2d2926';
  const fold = lighten(p, 0.6);
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: -20 * sc, right: -20 * sc, width: 100 * sc, height: 100 * sc, background: `linear-gradient(135deg, ${fold} 50%, transparent 50%)`, opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: -10 * sc, left: -10 * sc, width: 60 * sc, height: 60 * sc, background: `linear-gradient(315deg, ${p}22 50%, transparent 50%)` }} />
      <div style={{ position: 'absolute', top: '40%', right: 50 * sc, width: 40 * sc, height: 40 * sc, background: p, transform: 'rotate(45deg)', opacity: 0.1 }} />
      <div style={{ position: 'absolute', top: 20 * sc, left: 30 * sc, width: 20 * sc, height: 20 * sc, background: `linear-gradient(135deg, ${fold}80 50%, ${fold}40 50%)`, transform: 'rotate(45deg)' }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${40 * sc}px ${44 * sc}px` }}>
          {c.badge && <div style={{ display: 'inline-flex', padding: `${5 * sc}px ${14 * sc}px`, background: p, color: hexLum(p) > 0.5 ? '#000' : '#fff', fontSize: 9 * sc, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 * sc, clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)' }}>{c.badge}</div>}
          <div style={{ fontSize: 34 * sc, fontWeight: 800, color: ink, lineHeight: 1.1, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: t.textMuted, fontWeight: 500 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 * sc, marginBottom: 8 * sc }}>
            <div style={{ width: 16 * sc, height: 16 * sc, background: p, transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 7 * sc, fontWeight: 700, color: hexLum(p) > 0.5 ? '#000' : '#fff', transform: 'rotate(-45deg)' }}>{SLIDE_LAYOUTS.indexOf(L) + 1}</span></div>
            <span style={{ fontSize: 8 * sc, fontWeight: 700, color: p, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{c.badge || L}</span>
          </div>
          <div style={{ fontSize: 20 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 14 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: t.textMuted, lineHeight: 1.6, marginBottom: 10 * sc, padding: `${10 * sc}px ${12 * sc}px`, background: `${p}0d`, borderLeft: `3px solid ${p}40` }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 10 * sc, height: 10 * sc, background: `linear-gradient(135deg, ${p}66 50%, ${p}33 50%)`, flexShrink: 0 }} />
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TreehouseSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#f5e6c8';
  const ink = t.isDark ? t.text : '#3e2723';
  const wood = '#8d6e47';
  const leafGreen = '#4caf50';
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: "'Trebuchet MS',system-ui,sans-serif", flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent ${8 * sc}px, ${wood}08 ${8 * sc}px, ${wood}08 ${9 * sc}px)` }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 10 * sc, background: `linear-gradient(180deg, ${leafGreen}25 0%, transparent 100%)` }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 8 * sc, background: wood, opacity: 0.3 }} />
      <div style={{ position: 'absolute', top: -10 * sc, left: -10 * sc, width: 50 * sc, height: 50 * sc, background: `${leafGreen}18`, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: -5 * sc, left: 20 * sc, width: 30 * sc, height: 30 * sc, background: `${leafGreen}14`, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: -8 * sc, right: -10 * sc, width: 40 * sc, height: 40 * sc, background: `${leafGreen}16`, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: 0 * sc, right: 20 * sc, width: 25 * sc, height: 25 * sc, background: `${leafGreen}12`, borderRadius: '50%' }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: `${16 * sc}px`, background: `${bg}cc`, border: `${2 * sc}px solid ${wood}44`, borderRadius: 6 * sc, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${30 * sc}px ${36 * sc}px` }}>
          {c.badge && <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `${wood}22`, borderRadius: 4 * sc, marginBottom: 12 * sc, alignSelf: 'flex-start', border: `1px solid ${wood}44` }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: wood, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{'🌳'} {c.badge}</span></div>}
          <div style={{ fontSize: 34 * sc, fontWeight: 800, color: ink, lineHeight: 1.1, marginBottom: 12 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: wood, fontWeight: 600 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 18 * sc, left: 22 * sc, right: 22 * sc, bottom: 14 * sc }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `${wood}22`, borderRadius: 4 * sc, marginBottom: 8 * sc, border: `1px solid ${wood}33` }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: wood, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{'🍂'} {c.badge || L}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: t.textMuted, lineHeight: 1.65, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: `${wood}0d`, borderRadius: 4 * sc, border: `1px solid ${wood}22` }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <span style={{ fontSize: 12 * sc, flexShrink: 0 }}>{'🍃🌻🌼🍄🐿️'[i % 5]}</span>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.45, fontWeight: 500 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SuperheroSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#1a1a3e';
  const accent = lighten(p, 0.2);
  const gold = '#ffd700';
  return (
    <div style={{ width: w, height: H, background: `radial-gradient(ellipse at 50% 110%, ${p}33 0%, ${bg} 60%)`, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: "'Arial Black','Impact',sans-serif", flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5 * sc, background: `linear-gradient(90deg, ${p}, ${gold}, ${p})` }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: 300 * sc, height: 300 * sc, transform: 'translate(-50%,-50%)', background: `conic-gradient(from 0deg, transparent 0deg 30deg, ${p}08 30deg 60deg, transparent 60deg 90deg, ${p}05 90deg 120deg, transparent 120deg 150deg, ${p}08 150deg 180deg, transparent 180deg 360deg)`, borderRadius: '50%' }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${36 * sc}px` }}>
          {c.badge && <div style={{ padding: `${6 * sc}px ${20 * sc}px`, background: p, clipPath: 'polygon(8% 0, 92% 0, 100% 50%, 92% 100%, 8% 100%, 0 50%)', marginBottom: 16 * sc }}><span style={{ fontSize: 10 * sc, fontWeight: 900, color: hexLum(p) > 0.5 ? '#000' : '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{'⚡'} {c.badge}</span></div>}
          <div style={{ fontSize: 38 * sc, fontWeight: 900, color: '#ffffff', lineHeight: 1.0, textTransform: 'uppercase', letterSpacing: '-0.02em', textShadow: `${2 * sc}px ${2 * sc}px 0 ${p}, ${4 * sc}px ${4 * sc}px 0 rgba(0,0,0,0.3)`, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 12 * sc, color: gold, fontWeight: 700, fontFamily: 'system-ui,sans-serif', letterSpacing: '0.08em' }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: `linear-gradient(90deg, ${p}, ${darken(p, 0.2)})`, padding: `${7 * sc}px ${18 * sc}px`, display: 'flex', alignItems: 'center', gap: 10 * sc }}>
            <span style={{ fontSize: 12 * sc, fontWeight: 900, color: gold }}>{'⚡'}</span>
            <span style={{ fontSize: 10 * sc, fontWeight: 900, color: hexLum(p) > 0.5 ? '#000' : '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge || L}</span>
          </div>
          <div style={{ flex: 1, padding: `${14 * sc}px ${20 * sc}px` }}>
            <div style={{ fontSize: 20 * sc, fontWeight: 900, color: '#ffffff', lineHeight: 1.1, textTransform: 'uppercase', marginBottom: 12 * sc, textShadow: `${1 * sc}px ${1 * sc}px 0 ${p}88` }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
            {c.body && <div style={{ fontSize: 11 * sc, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 10 * sc, fontFamily: 'system-ui,sans-serif', fontWeight: 400 }}>{c.body}</div>}
            {(c.bullets || []).map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 6 * sc, padding: `${5 * sc}px ${10 * sc}px`, background: `${p}18`, borderLeft: `3px solid ${gold}`, borderRadius: `0 4px 4px 0` }}>
                <div style={{ width: 18 * sc, height: 18 * sc, background: p, clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 7 * sc, fontWeight: 900, color: hexLum(p) > 0.5 ? '#000' : '#fff' }}>{i + 1}</span></div>
                <span style={{ fontSize: 11 * sc, color: '#ffffff', fontWeight: 700, lineHeight: 1.35, fontFamily: 'system-ui,sans-serif' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SLIDE CANVAS ROUTER
═══════════════════════════════════════ */

function SlideCanvas({ slide, theme, width = 640, styleId = 'dark' }: { slide: Slide; theme: ThemeColors; width?: number; styleId?: string }) {
  if (!slide) return null;
  const p = { slide, t: theme, w: width };
  const renderers: Record<string, React.FC<SlideRendererProps>> = {
    split: SplitPanelSlide, editorial: EditorialSlide, cards: CardGridSlide, typographic: BoldTypeSlide,
    bubbly: BubblySlide, chalkboard: ChalkboardSlide, storybook: StorybookSlide, comic: ComicSlide, scrapbook: ScrapbookSlide,
    glassmorphism: GlassmorphismSlide, 'gradient-mesh': GradientMeshSlide, minimalist: MinimalistSlide,
    duotone: DuotoneSlide, 'neon-line': NeonLineSlide, blueprint: BlueprintSlide, magazine: MagazineSlide,
    corporate: CorporateSlide, watercolor: WatercolorSlide, monochrome: MonochromeSlide,
    space: SpaceSlide, candy: CandySlide, underwater: UnderwaterSlide, jungle: JungleSlide,
    pixel: PixelSlide, rainbow: RainbowSlide, crayon: CrayonSlide, origami: OrigamiSlide,
    treehouse: TreehouseSlide, superhero: SuperheroSlide,
  };
  const Renderer = renderers[styleId] || DarkGlowSlide;
  return <Renderer {...p} />;
}

/* ═══════════════════════════════════════
   THUMBNAIL
═══════════════════════════════════════ */

function Thumbnail({ slide, theme, selected, onClick, index, styleId }: { slide: Slide; theme: ThemeColors; selected: boolean; onClick: () => void; index: number; styleId: string }) {
  const W = 144, scale = W / 640;
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', borderRadius: 5, overflow: 'hidden', border: `2px solid ${selected ? theme.primary : 'transparent'}`, width: W, height: 82, position: 'relative', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
        <SlideCanvas slide={slide} theme={theme} width={640} styleId={styleId} />
      </div>
      <div style={{ position: 'absolute', bottom: 3, left: 4, fontSize: 9, fontWeight: 700, color: selected ? theme.primary : '#475569', background: '#000000aa', padding: '1px 4px', borderRadius: 3 }}>{index + 1}</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   COLOR PICKER
═══════════════════════════════════════ */

function ColorPicker({ primary, bg, onPrimary, onBg, theme, styleId }: { primary: string; bg: string; onPrimary: (c: string) => void; onBg: (c: string) => void; theme: ThemeColors; styleId: string }) {
  const previewSlide: Slide = { id: 'pv', layout: 'title', content: { headline: 'Preview Slide', subtitle: 'Your presentation', badge: 'Preview' } };
  const swatches = {
    accent: ['#38bdf8', '#34d399', '#fbbf24', '#a78bfa', '#fb7185', '#f97316', '#22d3ee', '#4ade80', '#e879f9', '#facc15'],
    bg: ['#020617', '#021210', '#0c0900', '#050214', '#0c0208', '#ffffff', '#f4f6fa', '#fafaf8', '#fdf8f0', '#fffde8']
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <SlideCanvas slide={previewSlide} theme={theme} width={230} styleId={styleId} />
      </div>
      <div>
        <div className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mb-2">Accent Colour</div>
        <div className="flex items-center gap-2.5 mb-2.5">
          <label className="relative cursor-pointer">
            <div className="w-9 h-9 rounded-lg border-2 border-white/15" style={{ background: primary, boxShadow: `0 0 0 3px ${primary}40` }} />
            <input type="color" value={primary} onChange={e => onPrimary(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
          </label>
          <div className="flex-1">
            <div className="text-[11px] text-theme-muted">Click swatch to pick</div>
            <div className="text-xs font-bold text-theme-secondary tracking-wide">{primary.toUpperCase()}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {swatches.accent.map(s => (
            <button key={s} onClick={() => onPrimary(s)} className="w-5 h-5 rounded-[5px] border-2 p-0 cursor-pointer transition-transform" style={{ background: s, borderColor: primary === s ? 'white' : 'transparent', transform: primary === s ? 'scale(1.2)' : 'scale(1)' }} />
          ))}
        </div>
      </div>
      <div>
        <div className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mb-2">Background</div>
        <div className="flex items-center gap-2.5 mb-2.5">
          <label className="relative cursor-pointer">
            <div className="w-9 h-9 rounded-lg border-2 border-white/15" style={{ background: bg, boxShadow: `0 0 0 3px ${primary}40` }} />
            <input type="color" value={bg} onChange={e => onBg(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
          </label>
          <div className="flex-1">
            <div className="text-[11px] text-theme-muted">{theme.isDark ? 'Dark background' : 'Light background'}</div>
            <div className="text-xs font-bold text-theme-secondary tracking-wide">{bg.toUpperCase()}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {swatches.bg.map(s => (
            <button key={s} onClick={() => onBg(s)} className="w-5 h-5 rounded-[5px] border-2 p-0 cursor-pointer transition-transform" style={{ background: s, borderColor: bg === s ? 'white' : 'rgba(255,255,255,0.12)', transform: bg === s ? 'scale(1.2)' : 'scale(1)' }} />
          ))}
        </div>
      </div>
      <div className="p-2.5 bg-theme-secondary rounded-lg border border-theme-border">
        <div className="text-[10px] text-theme-muted mb-2 font-semibold uppercase tracking-wide">Auto-derived</div>
        <div className="flex gap-1.5">
          {[{ l: 'Text', c: theme.text }, { l: 'Muted', c: theme.textMuted }, { l: 'Surface', c: theme.surface }].map(x => (
            <div key={x.l} className="flex-1 text-center">
              <div className="w-full h-3.5 rounded border border-white/10 mb-1" style={{ background: x.c }} />
              <div className="text-[9px] text-theme-muted">{x.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SLIDE SKELETON (loading placeholder)
═══════════════════════════════════════ */

function SlideSkeleton({ index, primaryColor }: { index: number; primaryColor: string }) {
  const delay = index * 150;
  return (
    <div
      className="rounded-lg overflow-hidden flex-shrink-0"
      style={{ width: 160, height: 90, background: 'var(--bg-secondary, #1e1e1e)', border: '1px solid var(--border-color, #333)', position: 'relative' }}
    >
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${primaryColor}12 50%, transparent 100%)`,
          animation: `shimmer 1.8s ease-in-out infinite`,
          animationDelay: `${delay}ms`,
        }}
      />
      {/* Fake content lines */}
      <div className="p-2.5 space-y-1.5">
        <div className="rounded" style={{ width: '65%', height: 8, background: `${primaryColor}30`, animation: `pulse 1.5s ease-in-out infinite`, animationDelay: `${delay}ms` }} />
        <div className="rounded" style={{ width: '45%', height: 5, background: `${primaryColor}18`, animation: `pulse 1.5s ease-in-out infinite`, animationDelay: `${delay + 100}ms` }} />
        <div className="mt-2 space-y-1">
          <div className="rounded" style={{ width: '90%', height: 4, background: `${primaryColor}12`, animation: `pulse 1.5s ease-in-out infinite`, animationDelay: `${delay + 200}ms` }} />
          <div className="rounded" style={{ width: '70%', height: 4, background: `${primaryColor}12`, animation: `pulse 1.5s ease-in-out infinite`, animationDelay: `${delay + 300}ms` }} />
          <div className="rounded" style={{ width: '80%', height: 4, background: `${primaryColor}12`, animation: `pulse 1.5s ease-in-out infinite`, animationDelay: `${delay + 400}ms` }} />
        </div>
      </div>
      {/* Slide number */}
      <div className="absolute bottom-1 right-2 text-[8px] font-bold" style={{ color: `${primaryColor}50` }}>{index + 1}</div>
    </div>
  );
}

function SkeletonStage({ primaryColor, streamingText, parsedCount }: { primaryColor: string; streamingText: string; parsedCount: number }) {
  const EXPECTED_SLIDES = 8;
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[700px]">
      {/* Main skeleton slide (large) */}
      <div
        className="rounded-lg overflow-hidden relative"
        style={{ width: 480, height: 270, background: 'var(--bg-secondary, #1e1e1e)', border: '1px solid var(--border-color, #333)', boxShadow: `0 4px 32px ${primaryColor}18` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${primaryColor}12 50%, transparent 100%)`,
            animation: 'shimmer 1.8s ease-in-out infinite',
          }}
        />
        <div className="p-6 space-y-3">
          <div className="rounded" style={{ width: '55%', height: 16, background: `${primaryColor}30`, animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div className="rounded" style={{ width: '35%', height: 10, background: `${primaryColor}18`, animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '150ms' }} />
          <div className="mt-4 space-y-2">
            <div className="rounded" style={{ width: '90%', height: 8, background: `${primaryColor}12`, animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '300ms' }} />
            <div className="rounded" style={{ width: '75%', height: 8, background: `${primaryColor}12`, animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '450ms' }} />
            <div className="rounded" style={{ width: '82%', height: 8, background: `${primaryColor}12`, animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '600ms' }} />
            <div className="rounded" style={{ width: '60%', height: 8, background: `${primaryColor}12`, animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '750ms' }} />
          </div>
        </div>
        {/* Progress badge */}
        <div className="absolute bottom-3 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: `${primaryColor}20` }}>
          <Icon icon={Loading02Icon} className="w-3 animate-spin" style={{ color: primaryColor }} />
          <span className="text-[10px] font-bold" style={{ color: primaryColor }}>
            {parsedCount > 0 ? `${parsedCount} / ~${EXPECTED_SLIDES} slides` : 'Generating...'}
          </span>
        </div>
      </div>

      {/* Thumbnail skeleton strip */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {Array.from({ length: EXPECTED_SLIDES }).map((_, i) => (
          <div key={i} className="relative">
            {i < parsedCount ? (
              <div className="rounded-lg overflow-hidden flex-shrink-0 ring-2" style={{ width: 160, height: 90, ringColor: `${primaryColor}60` }}>
                <div className="w-full h-full flex items-center justify-center" style={{ background: `${primaryColor}10` }}>
                  <span className="text-[10px] font-bold" style={{ color: primaryColor }}>Slide {i + 1} ✓</span>
                </div>
              </div>
            ) : (
              <SlideSkeleton index={i} primaryColor={primaryColor} />
            )}
          </div>
        ))}
      </div>

      {/* Streaming text preview */}
      {streamingText && (
        <div className="w-full max-w-[480px] max-h-[80px] overflow-hidden rounded-lg border border-theme-border bg-theme-secondary px-3 py-2">
          <div className="text-[10px] font-bold text-theme-muted uppercase tracking-wide mb-1">Live Stream</div>
          <div className="text-xs text-theme-muted font-mono leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {streamingText.slice(-200)}
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════
   PROGRESSIVE JSON PARSING
═══════════════════════════════════════ */

function tryParsePartialSlides(raw: string): Slide[] {
  // Try to extract fully-formed slide objects from partial JSON stream
  const slides: Slide[] = [];
  // Find the slides array start
  const arrStart = raw.indexOf('"slides"');
  if (arrStart === -1) return slides;
  const bracketStart = raw.indexOf('[', arrStart);
  if (bracketStart === -1) return slides;

  // Walk through looking for complete {...} objects at the top array level
  let depth = 0;
  let objStart = -1;
  for (let i = bracketStart + 1; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === '{') {
      if (depth === 0) objStart = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && objStart !== -1) {
        try {
          const obj = JSON.parse(raw.substring(objStart, i + 1));
          if (obj.id || obj.layout || obj.content) {
            slides.push({
              id: obj.id || `slide-${slides.length}`,
              layout: obj.layout || 'instruction',
              content: obj.content || {},
            });
          }
        } catch { /* incomplete JSON object, skip */ }
        objStart = -1;
      }
    }
  }
  return slides;
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */

export default function PresentationBuilder({ tabId, savedData, onDataChange }: PresentationBuilderProps) {
  // Input mode
  const [inputMode, setInputMode] = useState<InputMode>(savedData?.inputMode || 'scratch');

  // Form data (scratch mode)
  const [formData, setFormData] = useState<PresentationFormData>(savedData?.formData || {
    subject: '', gradeLevel: '', topic: '', strand: '',
    essentialOutcomes: '', specificOutcomes: '',
    duration: '50', studentCount: '30', additionalInstructions: '',
  });
  const [useCurriculum, setUseCurriculum] = useState(savedData?.useCurriculum ?? true);

  // Lesson plan selection (lesson mode)
  const [lessonPlans, setLessonPlans] = useState<LessonPlanRecord[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(savedData?.selectedPlanId || null);
  const [lessonSearchQuery, setLessonSearchQuery] = useState('');

  // Slides & editor
  const [slides, setSlides] = useState<Slide[]>(savedData?.slides || []);
  const [sel, setSel] = useState(0);
  const [primaryColor, setPrimaryColor] = useState(savedData?.primaryColor || '#38bdf8');
  const [bgColor, setBgColor] = useState(savedData?.bgColor || '#020617');
  const [styleId, setStyleId] = useState(savedData?.styleId || 'dark');
  const [rightTab, setRightTab] = useState<RightTab>('color');

  // Generation state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image generation state
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});

  // Save/History state
  const [currentPresentationId, setCurrentPresentationId] = useState<string | null>(savedData?.currentPresentationId || null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showHistory, setShowHistory] = useState(false);
  const [presentationHistory, setPresentationHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Streaming state for progressive rendering
  const [streamingSlides, setStreamingSlides] = useState<Slide[]>([]);
  const [streamTick, setStreamTick] = useState(0);

  // View state: 'input' | 'editor'
  const [view, setView] = useState<'input' | 'editor'>(savedData?.slides?.length > 0 ? 'editor' : 'input');

  const { settings } = useSettings();
  const tabColor = settings.tabColors['presentation-builder' as keyof typeof settings.tabColors] || '#f97316';
  const ENDPOINT = '/ws/presentation';
  const { getConnection, getStreamingContent, getIsStreaming, clearStreaming, subscribe } = useWebSocket();
  const { enqueue, queueEnabled } = useQueue();

  const theme = deriveTheme(primaryColor, bgColor);

  // Persist state
  useEffect(() => {
    onDataChange({
      inputMode, formData, useCurriculum, selectedPlanId,
      slides, primaryColor, bgColor, styleId, currentPresentationId,
    });
  }, [inputMode, formData, useCurriculum, selectedPlanId, slides, primaryColor, bgColor, styleId, currentPresentationId]);

  // Load lesson plan history
  useEffect(() => {
    if (inputMode === 'lesson') {
      loadLessonPlans();
    }
  }, [inputMode]);

  // Connect WebSocket
  useEffect(() => {
    getConnection(tabId, ENDPOINT);
  }, [tabId]);

  // Subscribe to streaming — force re-renders on each token for live display
  useEffect(() => {
    const unsub = subscribe(tabId, ENDPOINT, () => {
      setStreamTick(t => t + 1);
    });
    return unsub;
  }, [tabId]);

  // Watch for streaming content — progressive parsing
  const streamingContent = getStreamingContent(tabId, ENDPOINT);
  const isStreaming = getIsStreaming(tabId, ENDPOINT);
  const prevIsStreamingRef = useRef(false);

  // Progressive slide parsing during streaming
  useEffect(() => {
    if (isStreaming && streamingContent) {
      const parsed = tryParsePartialSlides(streamingContent);
      if (parsed.length > streamingSlides.length) {
        setStreamingSlides(parsed);
      }
      // Switch to editor view as soon as streaming starts
      if (view !== 'editor') {
        setView('editor');
      }
    }
  }, [streamTick, isStreaming, streamingContent]);

  // Watch for streaming completion
  useEffect(() => {
    if (prevIsStreamingRef.current && !isStreaming && streamingContent) {
      // Streaming just finished — final parse
      try {
        const m = streamingContent.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(m ? m[0] : streamingContent.trim());
        const newSlides = parsed.slides || [];
        setSlides(newSlides);
        setSel(0);
        setView('editor');
        setRightTab('edit');
        setError(null);
      } catch (e: any) {
        setError('Failed to parse slide data: ' + e.message);
      }
      setLoading(false);
      setStreamingSlides([]);
      clearStreaming(tabId, ENDPOINT);
    }
    prevIsStreamingRef.current = isStreaming;
  }, [isStreaming, streamingContent]);

  const loadLessonPlans = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/lesson-plan-history');
      setLessonPlans(response.data || []);
    } catch (e) {
      console.error('Failed to load lesson plans:', e);
    }
  };

  const loadPresentationHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/presentation-history');
      setPresentationHistory(response.data || []);
    } catch (e) {
      console.error('Failed to load presentation history:', e);
    }
    setHistoryLoading(false);
  };

  const savePresentation = async () => {
    if (slides.length === 0) return;
    setSaveStatus('saving');
    try {
      const id = currentPresentationId || `pres_${Date.now()}`;
      const title = formData.topic
        ? `${formData.subject || 'General'} - ${formData.topic} (Grade ${formData.gradeLevel || '?'})`
        : `Presentation - ${new Date().toLocaleDateString()}`;
      const data = {
        id,
        title,
        timestamp: new Date().toISOString(),
        type: 'presentation',
        formData,
        slides,
        styleId,
        primaryColor,
        bgColor,
        slideCount: slides.length,
      };
      await axios.post('http://localhost:8000/api/presentation-history', data);
      setCurrentPresentationId(id);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      console.error('Failed to save presentation:', e);
      setSaveStatus('idle');
    }
  };

  const loadPresentation = (pres: any) => {
    setSlides(pres.slides || []);
    setStyleId(pres.styleId || 'dark');
    setPrimaryColor(pres.primaryColor || '#38bdf8');
    setBgColor(pres.bgColor || '#020617');
    setCurrentPresentationId(pres.id);
    if (pres.formData) {
      setFormData(pres.formData);
    }
    setSel(0);
    setView('editor');
    setShowHistory(false);
  };

  const deletePresentation = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/presentation-history/${id}`);
      setPresentationHistory(prev => prev.filter(p => p.id !== id));
      if (currentPresentationId === id) setCurrentPresentationId(null);
    } catch (e) {
      console.error('Failed to delete presentation:', e);
    }
  };

  const updateField = (field: keyof PresentationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    setError(null);
    let prompt: string;

    if (inputMode === 'lesson') {
      const plan = lessonPlans.find(p => p.id === selectedPlanId);
      if (!plan) { setError('Please select a lesson plan first.'); return; }
      prompt = buildPresentationPromptFromLesson(plan.parsedLesson || {}, plan.generatedPlan);
    } else {
      if (!formData.subject || !formData.gradeLevel || !formData.topic) {
        setError('Please fill in Subject, Grade Level, and Topic.');
        return;
      }
      prompt = buildPresentationPromptFromForm(formData);
    }

    setLoading(true);

    if (queueEnabled) {
      enqueue({
        label: `Presentation - ${formData.topic || 'Lesson'}`,
        toolType: 'Presentation',
        tabId,
        endpoint: ENDPOINT,
        prompt,
        generationMode: settings.generationMode,
      });
      return;
    }

    const ws = getConnection(tabId, ENDPOINT);
    if (ws.readyState !== WebSocket.OPEN) {
      setError('Connection not ready. Please wait and try again.');
      setLoading(false);
      return;
    }

    try {
      ws.send(JSON.stringify({ prompt, generationMode: settings.generationMode }));
    } catch (e: any) {
      setError('Failed to send request: ' + e.message);
      setLoading(false);
    }
  };

  // Slide editing helpers
  const cur = slides[sel];
  const updateSlide = (field: string, value: any) => setSlides(p => p.map((s, i) => i === sel ? { ...s, content: { ...s.content, [field]: value } } : s));
  const updateBullet = (idx: number, value: string) => {
    const b = [...(cur?.content?.bullets || [])];
    b[idx] = value;
    updateSlide('bullets', b);
  };
  const addBullet = () => updateSlide('bullets', [...(cur?.content?.bullets || []), '']);
  const removeBullet = (idx: number) => updateSlide('bullets', (cur?.content?.bullets || []).filter((_, j) => j !== idx));
  const moveSlide = (dir: number) => {
    const ni = sel + dir;
    if (ni < 0 || ni >= slides.length) return;
    const ns = [...slides];
    [ns[sel], ns[ni]] = [ns[ni], ns[sel]];
    setSlides(ns);
    setSel(ni);
  };

  const hasBullets = cur && (['objectives', 'instruction', 'assessment'].includes(cur.layout) || (cur.content?.bullets?.length || 0) > 0);
  const hasBody = cur && (['hook', 'activity', 'closing'].includes(cur.layout) || cur.content?.body !== undefined);

  // Image generation for a slide
  const generateSlideImage = async (slideIdx: number) => {
    const s = slides[slideIdx];
    if (!s) return;
    setImageLoading(prev => ({ ...prev, [slideIdx]: true }));
    try {
      // Build context-aware prompt
      const styleHint = ALL_STYLES.find(st => st.id === styleId);
      const isKids = styleHint?.tag === 'KIDS';
      const promptRes = await imageApi.generatePrompt({
        subject: formData.subject || 'Education',
        grade: formData.gradeLevel || '4',
        topic: s.content.headline || formData.topic || 'Lesson',
        additionalContext: `This is a presentation slide image. Style: ${styleHint?.label || 'professional'}. ${isKids ? 'Cartoon/illustration style suitable for young children.' : 'Clean, professional educational illustration.'} The slide is about: ${s.content.body || s.content.bullets?.join(', ') || s.content.headline || ''}`,
      });
      const imgRes = await imageApi.generateImageBase64({
        prompt: promptRes.prompt,
        negativePrompt: promptRes.negativePrompt,
        width: 1024,
        height: 576,
        numInferenceSteps: 4,
      });
      if (imgRes.success && imgRes.imageData) {
        setSlides(prev => prev.map((sl, i) => i === slideIdx ? { ...sl, content: { ...sl.content, image: imgRes.imageData } } : sl));
      }
    } catch (e: any) {
      console.error('Image generation failed:', e);
    }
    setImageLoading(prev => ({ ...prev, [slideIdx]: false }));
  };

  // PPTX Export
  const exportPPTX = () => {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_WIDE';
    slides.forEach(slide => {
      const s = pptx.addSlide();
      const c = slide.content || {};
      const bgHex = theme.bg.replace('#', '');
      const tc = theme.text.replace('#', '');
      const pc = theme.primary.replace('#', '');
      s.background = { color: bgHex };
      s.addShape('rect' as any, { x: 0, y: 0, w: '100%', h: 0.04, fill: { color: pc } });

      if (c.image) {
        s.addImage({ data: c.image, x: 0, y: 0, w: '100%', h: '100%', sizing: { type: 'cover', w: 13.33, h: 7.5 } });
        s.addShape('rect' as any, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: bgHex, transparency: 60 } });
      }

      if (slide.layout === 'title') {
        if (c.badge) s.addText(c.badge, { x: 0.5, y: 0.65, w: 5, h: 0.25, fontSize: 9, color: pc, bold: true, charSpacing: 2 });
        s.addText(c.headline || '', { x: 0.5, y: 1.05, w: 9.5, h: 1.5, fontSize: 34, bold: true, color: tc, fontFace: 'Georgia' });
        if (c.subtitle) s.addText(c.subtitle, { x: 0.5, y: 2.7, w: 9, h: 0.4, fontSize: 13, color: '777777' });
      } else {
        if (c.badge) s.addText(c.badge, { x: 0.5, y: 0.38, w: 4, h: 0.22, fontSize: 9, color: pc, bold: true });
        s.addText(c.headline || '', { x: 0.5, y: c.badge ? 0.68 : 0.48, w: 9.5, h: 0.85, fontSize: 20, bold: true, color: tc, fontFace: 'Georgia' });
        if (c.body) s.addText(c.body, { x: 0.5, y: 1.65, w: 9, h: 1.5, fontSize: 13, color: tc, wrap: true } as any);
        (c.bullets || []).forEach((b, i) => s.addText(`•  ${b}`, { x: 0.7, y: 1.62 + i * 0.52, w: 8.8, h: 0.48, fontSize: 12, color: tc, wrap: true } as any));
      }
    });
    const topicSlug = (formData.topic || 'presentation').replace(/\s+/g, '_');
    pptx.writeFile({ fileName: `${topicSlug}.pptx` });
  };

  // Subject options (matching LessonPlanner)
  const subjects = ['Language Arts', 'Mathematics', 'Science', 'Social Studies', 'Physical Education', 'Health & Family Life Education', 'Agriculture', 'Spanish', 'French', 'Information Technology', 'TVET', 'Visual & Performing Arts', 'Music', 'Religious Education'];
  const grades = ['K', '1', '2', '3', '4', '5', '6'];

  const selectedPlan = lessonPlans.find(p => p.id === selectedPlanId);
  const filteredPlans = lessonPlans.filter(p => {
    if (!lessonSearchQuery) return true;
    const q = lessonSearchQuery.toLowerCase();
    return p.title?.toLowerCase().includes(q) || p.formData?.subject?.toLowerCase().includes(q) || p.formData?.topic?.toLowerCase().includes(q);
  });

  /* ═══════════════════════════════════════
     INPUT VIEW
  ═══════════════════════════════════════ */
  if (view === 'input') {
    return (
      <div className="h-full flex bg-theme-primary">
        <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-theme-border px-6 py-4">
          <div className="flex items-center gap-3">
            <Icon icon={Presentation01Icon} className="w-6" style={{ color: tabColor }} />
            <div className="flex-1">
              <h1 className="text-lg font-bold text-theme-heading">Presentation Builder</h1>
              <p className="text-xs text-theme-muted">Create slide decks from scratch or from existing lesson plans</p>
            </div>
            <button
              onClick={() => { setShowHistory(!showHistory); if (!showHistory) loadPresentationHistory(); }}
              className="p-2 rounded-lg hover:bg-theme-hover transition"
              title="Presentation History"
            >
              <Icon icon={Clock01Icon} className="w-5" style={{ color: 'var(--sidebar-text-muted)' }} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
            {/* Mode toggle */}
            <div className="flex rounded-lg border border-theme-border overflow-hidden">
              {(['scratch', 'lesson'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setInputMode(mode)}
                  className={`flex-1 px-4 py-2.5 text-sm font-semibold transition-all ${inputMode === mode
                    ? 'text-white'
                    : 'bg-theme-secondary text-theme-muted hover:text-theme-heading'
                  }`}
                  style={inputMode === mode ? { background: tabColor } : undefined}
                >
                  {mode === 'scratch' ? 'From Scratch' : 'From Lesson Plan'}
                </button>
              ))}
            </div>

            {inputMode === 'scratch' ? (
              /* ── SCRATCH MODE FORM ── */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-theme-heading mb-1">Subject *</label>
                    <select
                      value={formData.subject}
                      onChange={e => updateField('subject', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-theme-secondary border border-theme-border text-theme-heading text-sm focus:ring-2 focus:outline-none"
                      style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    >
                      <option value="">Select subject...</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-theme-heading mb-1">Grade Level *</label>
                    <select
                      value={formData.gradeLevel}
                      onChange={e => updateField('gradeLevel', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-theme-secondary border border-theme-border text-theme-heading text-sm focus:ring-2 focus:outline-none"
                      style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    >
                      <option value="">Select grade...</option>
                      {grades.map(g => <option key={g} value={g}>{g === 'K' ? 'Kindergarten' : `Grade ${g}`}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-theme-heading mb-1">Topic *</label>
                  <SmartInput
                    value={formData.topic}
                    onChange={e => updateField('topic', e.target.value)}
                    placeholder="e.g. Light Interactions, Fractions, Community Helpers..."
                    className="w-full px-3 py-2 rounded-lg bg-theme-secondary border border-theme-border text-theme-heading text-sm focus:ring-2 focus:outline-none"
                  />
                </div>

                {/* Curriculum alignment fields */}
                <CurriculumAlignmentFields
                  subject={formData.subject}
                  gradeLevel={formData.gradeLevel}
                  strand={formData.strand}
                  essentialOutcomes={formData.essentialOutcomes}
                  specificOutcomes={formData.specificOutcomes}
                  useCurriculum={useCurriculum}
                  onStrandChange={v => updateField('strand', v)}
                  onELOChange={v => updateField('essentialOutcomes', v)}
                  onSCOsChange={v => updateField('specificOutcomes', v)}
                  onToggleCurriculum={() => setUseCurriculum(p => !p)}
                  accentColor={tabColor}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-theme-heading mb-1">Duration (minutes)</label>
                    <select
                      value={formData.duration}
                      onChange={e => updateField('duration', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-theme-secondary border border-theme-border text-theme-heading text-sm"
                    >
                      {['30', '45', '50', '60', '90'].map(d => <option key={d} value={d}>{d} min</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-theme-heading mb-1">Class Size</label>
                    <input
                      type="number"
                      value={formData.studentCount}
                      onChange={e => updateField('studentCount', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-theme-secondary border border-theme-border text-theme-heading text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-theme-heading mb-1">Additional Instructions</label>
                  <SmartTextArea
                    value={formData.additionalInstructions}
                    onChange={e => updateField('additionalInstructions', e.target.value)}
                    placeholder="Any special focus areas, activities to include, etc."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-theme-secondary border border-theme-border text-theme-heading text-sm resize-none"
                  />
                </div>
              </div>
            ) : (
              /* ── LESSON PLAN MODE ── */
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={lessonSearchQuery}
                    onChange={e => setLessonSearchQuery(e.target.value)}
                    placeholder="Search lesson plans by subject, topic, or title..."
                    className="w-full px-3 py-2 rounded-lg bg-theme-secondary border border-theme-border text-theme-heading text-sm focus:ring-2 focus:outline-none"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                  />
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {filteredPlans.length === 0 ? (
                    <div className="text-center py-8 text-theme-muted text-sm">
                      {lessonPlans.length === 0 ? 'No lesson plans found. Create some in the Lesson Planner first.' : 'No matching lesson plans.'}
                    </div>
                  ) : filteredPlans.map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => {
                        setSelectedPlanId(plan.id);
                        // Pre-fill form data from lesson plan
                        if (plan.formData) {
                          setFormData(prev => ({
                            ...prev,
                            subject: plan.formData.subject || prev.subject,
                            gradeLevel: plan.formData.gradeLevel || prev.gradeLevel,
                            topic: plan.formData.topic || prev.topic,
                            strand: plan.formData.strand || prev.strand,
                            essentialOutcomes: plan.formData.essentialOutcomes || prev.essentialOutcomes,
                            specificOutcomes: plan.formData.specificOutcomes || prev.specificOutcomes,
                            duration: plan.formData.duration || prev.duration,
                            studentCount: plan.formData.studentCount || prev.studentCount,
                          }));
                        }
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${selectedPlanId === plan.id
                        ? 'border-2 bg-theme-secondary'
                        : 'border-theme-border bg-theme-primary hover:bg-theme-secondary'
                      }`}
                      style={selectedPlanId === plan.id ? { borderColor: tabColor } : undefined}
                    >
                      <div className="font-semibold text-sm text-theme-heading truncate">{plan.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-theme-muted">{plan.formData?.subject}</span>
                        <span className="text-xs text-theme-muted">·</span>
                        <span className="text-xs text-theme-muted">Grade {plan.formData?.gradeLevel}</span>
                        <span className="text-xs text-theme-muted">·</span>
                        <span className="text-xs text-theme-muted">{new Date(plan.timestamp).toLocaleDateString()}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedPlan && (
                  <div className="p-3 rounded-lg border border-theme-border bg-theme-secondary">
                    <div className="text-xs font-semibold text-theme-muted uppercase tracking-wide mb-1">Selected</div>
                    <div className="text-sm font-bold text-theme-heading">{selectedPlan.title}</div>
                    <div className="text-xs text-theme-muted mt-1">{selectedPlan.formData?.topic} — {selectedPlan.formData?.subject}, Grade {selectedPlan.formData?.gradeLevel}</div>
                  </div>
                )}
              </div>
            )}

            {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: tabColor, color: hexLum(tabColor) > 0.5 ? '#000' : '#fff' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon icon={Loading02Icon} className="w-4 animate-spin" /> Generating Slides...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Icon icon={Presentation01Icon} className="w-4" /> Generate Presentation
                </span>
              )}
            </button>

            {/* Streaming progress in input view */}
            {loading && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-theme-muted">
                  <Icon icon={Loading02Icon} className="w-3.5 animate-spin" style={{ color: tabColor }} />
                  <span>
                    {streamingSlides.length > 0
                      ? `${streamingSlides.length} slide${streamingSlides.length > 1 ? 's' : ''} parsed so far...`
                      : 'Waiting for response...'}
                  </span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SlideSkeleton key={i} index={i} primaryColor={tabColor} />
                  ))}
                </div>
                {streamingContent && (
                  <div className="rounded-lg border border-theme-border bg-theme-secondary px-3 py-2 max-h-[60px] overflow-hidden">
                    <div className="text-xs text-theme-muted font-mono leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {streamingContent.slice(-150)}
                    </div>
                  </div>
                )}
                <style>{`
                  @keyframes shimmer {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                  }
                  @keyframes pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 1; }
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>
        </div>

        {/* History Side Panel */}
        <div
          className={`border-l border-theme bg-theme-secondary transition-all duration-300 overflow-hidden ${
            showHistory ? 'w-80' : 'w-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col p-4 w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-heading">Saved Presentations</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 rounded hover:bg-theme-hover transition"
              >
                <Icon icon={Cancel01Icon} className="w-5" style={{ color: 'var(--sidebar-text-muted)' }} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
              {historyLoading ? (
                <div className="text-center py-8 text-theme-muted text-sm">
                  <Icon icon={Loading02Icon} className="w-5 inline animate-spin" /> Loading...
                </div>
              ) : presentationHistory.length === 0 ? (
                <div className="text-center text-theme-muted mt-8">
                  <Icon icon={Presentation01Icon} className="w-12 mx-auto mb-2" style={{ color: 'var(--sidebar-text-muted)' }} />
                  <p className="text-sm">No saved presentations yet</p>
                </div>
              ) : (
                [...presentationHistory].reverse().map(pres => (
                  <div
                    key={pres.id}
                    onClick={() => loadPresentation(pres)}
                    className={`p-3 rounded-lg cursor-pointer transition group hover:bg-theme-subtle ${
                      currentPresentationId === pres.id ? 'bg-theme-surface shadow-sm' : 'bg-theme-tertiary'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-theme-heading line-clamp-2">
                          {pres.title}
                        </p>
                        <p className="text-xs text-theme-muted mt-1">
                          {pres.slideCount || pres.slides?.length || '?'} slides · {new Date(pres.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); deletePresentation(pres.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 transition"
                        title="Delete"
                      >
                        <Icon icon={Delete02Icon} className="w-4" style={{ color: '#ef4444' }} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     EDITOR VIEW
  ═══════════════════════════════════════ */
  return (
    <div className="h-full flex bg-theme-primary">
      <div className="flex-1 flex flex-col min-w-0 relative">
      {/* Top bar */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-theme-border flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setView('input')}
          className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-theme-secondary border border-theme-border text-theme-muted hover:text-theme-heading transition-colors"
        >
          <Icon icon={ArrowLeft01Icon} className="w-3.5 inline mr-1" /> Back
        </button>
        <div className="flex-1 min-w-[120px]">
          <div className="text-xs text-theme-muted">
            {formData.subject && `Grade ${formData.gradeLevel} · ${formData.subject} · ${formData.duration} min`}
          </div>
          <div className="text-sm font-bold text-theme-heading truncate">{formData.topic || 'Presentation'}</div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-theme-secondary border rounded-lg" style={{ borderColor: `${primaryColor}33` }}>
            <div className="w-2 h-2 rounded-full" style={{ background: primaryColor }} />
            <span className="text-xs font-semibold" style={{ color: primaryColor }}>{ALL_STYLES.find(s => s.id === styleId)?.label}</span>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-1.5 rounded-lg font-bold text-sm disabled:opacity-50"
            style={{ background: primaryColor, color: hexLum(primaryColor) > 0.5 ? '#000' : '#fff' }}
          >
            {loading ? 'Generating...' : 'Regenerate'}
          </button>
          {slides.length > 0 && (
            <>
              <button
                onClick={savePresentation}
                disabled={saveStatus === 'saving'}
                className="px-3 py-1.5 rounded-lg font-semibold text-sm border transition-all"
                style={{
                  color: saveStatus === 'saved' ? '#22c55e' : primaryColor,
                  borderColor: saveStatus === 'saved' ? '#22c55e44' : `${primaryColor}44`,
                }}
              >
                <Icon icon={SaveIcon} className="w-3.5 inline mr-1" />
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={exportPPTX}
                className="px-3 py-1.5 rounded-lg font-semibold text-sm border"
                style={{ color: primaryColor, borderColor: `${primaryColor}44` }}
              >
                <Icon icon={Download01Icon} className="w-3.5 inline mr-1" /> PPTX
              </button>
            </>
          )}
          <button
            onClick={() => { setShowHistory(!showHistory); if (!showHistory) loadPresentationHistory(); }}
            className="p-2 rounded-lg hover:bg-theme-hover transition"
            title="Presentation History"
          >
            <Icon icon={Clock01Icon} className="w-5" style={{ color: 'var(--sidebar-text-muted)' }} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Style list */}
        <div className="w-[170px] flex-shrink-0 border-r border-theme-border bg-theme-secondary overflow-y-auto flex flex-col">
          <div className="px-2.5 pt-2.5 pb-1 text-[9px] font-extrabold text-theme-muted uppercase tracking-wider">Professional</div>
          {ALL_STYLES.filter(s => s.tag === 'PRO').map(s => {
            const active = styleId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStyleId(s.id)}
                className="px-2.5 py-2 text-left flex flex-col gap-0.5 border-l-[3px] transition-all"
                style={{
                  background: active ? `${primaryColor}14` : 'transparent',
                  borderLeftColor: active ? primaryColor : 'transparent',
                }}
              >
                <span className="text-xs font-bold" style={{ color: active ? primaryColor : undefined }}>{s.label}</span>
                <span className="text-[10px] text-theme-muted leading-tight">{s.desc}</span>
              </button>
            );
          })}
          <div className="px-2.5 pt-3 pb-1 text-[9px] font-extrabold text-theme-muted uppercase tracking-wider mt-1 border-t border-theme-border">For Kids</div>
          {ALL_STYLES.filter(s => s.tag === 'KIDS').map(s => {
            const active = styleId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStyleId(s.id)}
                className="px-2.5 py-2 text-left flex flex-col gap-0.5 border-l-[3px] transition-all"
                style={{
                  background: active ? `${primaryColor}14` : 'transparent',
                  borderLeftColor: active ? primaryColor : 'transparent',
                }}
              >
                <span className="text-xs font-bold" style={{ color: active ? primaryColor : undefined }}>{s.label}</span>
                <span className="text-[10px] text-theme-muted leading-tight">{s.desc}</span>
              </button>
            );
          })}
        </div>

        {/* CENTER: Main stage */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-5 overflow-hidden">
          {loading && slides.length === 0 ? (
            /* Skeleton loading with progressive streaming */
            <SkeletonStage
              primaryColor={primaryColor}
              streamingText={streamingContent || ''}
              parsedCount={streamingSlides.length}
            />
          ) : slides.length === 0 ? (
            <div className="flex flex-col items-center gap-3">
              <div className="text-theme-muted text-sm">No slides generated yet</div>
              <button onClick={handleGenerate} disabled={loading} className="px-6 py-2 rounded-lg font-bold text-sm" style={{ background: primaryColor, color: hexLum(primaryColor) > 0.5 ? '#000' : '#fff' }}>
                Generate Slides
              </button>
            </div>
          ) : (
            <>
              {cur && (
                <div className="rounded-lg overflow-hidden" style={{ boxShadow: `0 4px 32px ${primaryColor}18` }}>
                  <SlideCanvas slide={cur} theme={theme} width={640} styleId={styleId} />
                </div>
              )}
              {/* Slide strip */}
              <div className="flex gap-1.5 overflow-x-auto max-w-[700px] pb-1">
                {slides.map((slide, i) => (
                  <Thumbnail key={slide.id || i} slide={slide} theme={theme} selected={i === sel} onClick={() => { setSel(i); setRightTab('edit'); }} index={i} styleId={styleId} />
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={() => moveSlide(-1)} disabled={sel === 0} className="px-3 py-1 rounded text-xs font-semibold bg-theme-secondary border border-theme-border text-theme-muted disabled:opacity-30">
                  <Icon icon={ArrowLeft01Icon} className="w-3 inline" /> Move
                </button>
                <span className="text-xs text-theme-muted min-w-[52px] text-center">{sel + 1} / {slides.length}</span>
                <button onClick={() => moveSlide(1)} disabled={sel >= slides.length - 1} className="px-3 py-1 rounded text-xs font-semibold bg-theme-secondary border border-theme-border text-theme-muted disabled:opacity-30">
                  Move <Icon icon={ArrowRight01Icon} className="w-3 inline" />
                </button>
              </div>
            </>
          )}
          {error && <div className="text-red-400 text-sm max-w-[340px] text-center">{error}</div>}
        </div>

        {/* RIGHT: Tabs (Color | Edit) */}
        <div className="w-[258px] flex-shrink-0 border-l border-theme-border bg-theme-secondary flex flex-col">
          {/* Tab switcher */}
          <div className="flex border-b border-theme-border flex-shrink-0">
            {(['color', 'edit'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wide transition-all border-b-2 ${rightTab === tab ? '' : 'border-transparent text-theme-muted'}`}
                style={rightTab === tab ? { color: primaryColor, borderBottomColor: primaryColor, background: `${primaryColor}12` } : undefined}
              >
                {tab === 'color' ? 'Colours' : 'Edit Slide'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3.5">
            {rightTab === 'color' && (
              <ColorPicker primary={primaryColor} bg={bgColor} onPrimary={setPrimaryColor} onBg={setBgColor} theme={theme} styleId={styleId} />
            )}
            {rightTab === 'edit' && cur && (
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-theme-border">
                  <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wide">Slide {sel + 1}</span>
                  <select
                    value={cur.layout}
                    onChange={e => setSlides(p => p.map((s, i) => i === sel ? { ...s, layout: e.target.value } : s))}
                    className="px-1.5 py-0.5 bg-theme-primary border border-theme-border rounded text-xs text-theme-muted"
                  >
                    {SLIDE_LAYOUTS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <label className="block text-[10px] font-bold text-theme-muted uppercase tracking-wide mt-3 mb-1">Headline</label>
                <textarea rows={2} value={cur.content.headline || ''} onChange={e => updateSlide('headline', e.target.value)}
                  className="w-full px-2 py-1.5 rounded bg-theme-primary border border-theme-border text-theme-heading text-xs resize-y outline-none" />

                {cur.layout === 'title' && (
                  <>
                    <label className="block text-[10px] font-bold text-theme-muted uppercase tracking-wide mt-3 mb-1">Subtitle</label>
                    <input value={cur.content.subtitle || ''} onChange={e => updateSlide('subtitle', e.target.value)}
                      className="w-full px-2 py-1.5 rounded bg-theme-primary border border-theme-border text-theme-heading text-xs outline-none" />
                  </>
                )}

                {hasBody && (
                  <>
                    <label className="block text-[10px] font-bold text-theme-muted uppercase tracking-wide mt-3 mb-1">Body Text</label>
                    <textarea rows={3} value={cur.content.body || ''} onChange={e => updateSlide('body', e.target.value)}
                      className="w-full px-2 py-1.5 rounded bg-theme-primary border border-theme-border text-theme-heading text-xs resize-y outline-none" />
                  </>
                )}

                <label className="block text-[10px] font-bold text-theme-muted uppercase tracking-wide mt-3 mb-1">Badge / Tag</label>
                <input value={cur.content.badge || ''} onChange={e => updateSlide('badge', e.target.value)} placeholder={cur.layout === 'activity' ? 'e.g. 20 min' : 'e.g. Key Concept'}
                  className="w-full px-2 py-1.5 rounded bg-theme-primary border border-theme-border text-theme-heading text-xs outline-none" />

                {hasBullets && (
                  <>
                    <label className="block text-[10px] font-bold text-theme-muted uppercase tracking-wide mt-3 mb-1">Bullet Points</label>
                    {(cur.content.bullets || []).map((b, i) => (
                      <div key={i} className="flex gap-1 mb-1.5">
                        <textarea rows={2} value={b} onChange={e => updateBullet(i, e.target.value)}
                          className="flex-1 px-2 py-1.5 rounded bg-theme-primary border border-theme-border text-theme-heading text-xs resize-y outline-none" />
                        <button onClick={() => removeBullet(i)} className="px-1.5 py-0.5 rounded bg-theme-primary border border-theme-border text-red-400 text-xs self-start">
                          <Icon icon={Delete02Icon} className="w-3" />
                        </button>
                      </div>
                    ))}
                    {(cur.content.bullets || []).length < 4 && (
                      <button onClick={addBullet} className="w-full px-2 py-1.5 rounded text-xs font-semibold border mt-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}28`, background: `${primaryColor}14` }}>
                        <Icon icon={PlusSignIcon} className="w-3 inline mr-1" /> Add bullet
                      </button>
                    )}
                  </>
                )}

                {/* Image generation */}
                <div className="mt-4 pt-3.5 border-t border-theme-border">
                  <label className="block text-[10px] font-bold text-theme-muted uppercase tracking-wide mb-1.5">Slide Image</label>
                  {cur.content.image ? (
                    <div className="space-y-2">
                      <img src={cur.content.image} alt="Slide" className="w-full rounded border border-theme-border" />
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => generateSlideImage(sel)}
                          disabled={imageLoading[sel]}
                          className="flex-1 px-2 py-1.5 rounded text-xs font-semibold border"
                          style={{ color: primaryColor, borderColor: `${primaryColor}28`, background: `${primaryColor}14` }}
                        >
                          {imageLoading[sel] ? <><Icon icon={Loading02Icon} className="w-3 inline animate-spin mr-1" /> Regenerating...</> : 'Regenerate'}
                        </button>
                        <button
                          onClick={() => updateSlide('image', undefined)}
                          className="px-2 py-1.5 rounded text-xs bg-theme-primary border border-theme-border text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => generateSlideImage(sel)}
                      disabled={imageLoading[sel]}
                      className="w-full px-3 py-2 rounded-lg text-xs font-semibold border transition-all"
                      style={{ color: primaryColor, borderColor: `${primaryColor}28`, background: `${primaryColor}14` }}
                    >
                      {imageLoading[sel] ? (
                        <><Icon icon={Loading02Icon} className="w-3.5 inline animate-spin mr-1" /> Generating Image...</>
                      ) : (
                        <><Icon icon={Image01Icon} className="w-3.5 inline mr-1" /> Generate Image</>
                      )}
                    </button>
                  )}
                  <div className="text-[10px] text-theme-muted mt-1.5">Uses your local SDXL image generator</div>
                </div>
              </div>
            )}
            {rightTab === 'edit' && !cur && (
              <div className="text-center text-theme-muted text-sm py-8">Generate slides first to edit them</div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* History Side Panel */}
      <div
        className={`border-l border-theme bg-theme-secondary transition-all duration-300 overflow-hidden ${
          showHistory ? 'w-80' : 'w-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-theme-heading">Saved Presentations</h3>
            <button
              onClick={() => setShowHistory(false)}
              className="p-1 rounded hover:bg-theme-hover transition"
            >
              <Icon icon={Cancel01Icon} className="w-5" style={{ color: 'var(--sidebar-text-muted)' }} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {historyLoading ? (
              <div className="text-center py-8 text-theme-muted text-sm">
                <Icon icon={Loading02Icon} className="w-5 inline animate-spin" /> Loading...
              </div>
            ) : presentationHistory.length === 0 ? (
              <div className="text-center text-theme-muted mt-8">
                <Icon icon={Presentation01Icon} className="w-12 mx-auto mb-2" style={{ color: 'var(--sidebar-text-muted)' }} />
                <p className="text-sm">No saved presentations yet</p>
              </div>
            ) : (
              [...presentationHistory].reverse().map(pres => (
                <div
                  key={pres.id}
                  onClick={() => loadPresentation(pres)}
                  className={`p-3 rounded-lg cursor-pointer transition group hover:bg-theme-subtle ${
                    currentPresentationId === pres.id ? 'bg-theme-surface shadow-sm' : 'bg-theme-tertiary'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-theme-heading line-clamp-2">
                        {pres.title}
                      </p>
                      <p className="text-xs text-theme-muted mt-1">
                        {pres.slideCount || pres.slides?.length || '?'} slides · {new Date(pres.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deletePresentation(pres.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 transition"
                      title="Delete"
                    >
                      <Icon icon={Delete02Icon} className="w-4" style={{ color: '#ef4444' }} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
