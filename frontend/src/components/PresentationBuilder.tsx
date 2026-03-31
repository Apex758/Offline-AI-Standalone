import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useQueue } from '../contexts/QueueContext';
import { useSettings } from '../contexts/SettingsContext';
import { useAchievementTrigger } from '../contexts/AchievementContext';
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
import ArrowDown01Icon from '@hugeicons/core-free-icons/ArrowDown01Icon';
import CurriculumAlignmentFields from './ui/CurriculumAlignmentFields';
import SmartTextArea from './SmartTextArea';
import SmartInput from './SmartInput';
import { imageApi } from '../lib/imageApi';
import { buildPresentationPromptFromForm, buildPresentationPromptFromLesson } from '../utils/presentationPromptBuilder';
import type { PresentationFormData, ParsedLessonInput } from '../utils/presentationPromptBuilder';
import { useQueueCancellation } from '../hooks/useQueueCancellation';
import axios from 'axios';
// Curriculum data is loaded on demand by CurriculumAlignmentFields
import { useCapabilities } from '../contexts/CapabilitiesContext';
// pptxgenjs is dynamically imported in exportPPTX() to avoid bundling upfront

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
  imagePlacement?: 'right' | 'left' | 'top' | 'half' | 'background' | 'bottom-right' | 'none';
  imageScene?: string; // scene description for AI image generation
  assignedImage?: number;
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

interface Draft {
  id: string;
  title: string;
  timestamp: string;
  plannerType: string;
  formData: any;
  step?: number;
  curriculumMatches?: any[];
}

type InputMode = 'scratch' | 'lesson';
type RightTab = 'color' | 'edit' | 'layouts';
type ImageMode = 'none' | 'ai' | 'my-images';

const SLIDE_LAYOUTS = ['title', 'objectives', 'hook', 'instruction', 'activity', 'assessment', 'closing'];

const ALL_STYLES = [
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
  { id: 'dinosaur', label: 'Dino Land', tag: 'KIDS', desc: 'Prehistoric fossils & volcanoes' },
  { id: 'pirate', label: 'Pirate Ship', tag: 'KIDS', desc: 'Treasure maps & ocean waves' },
  { id: 'fairy', label: 'Fairy Tale', tag: 'KIDS', desc: 'Castles, sparkles & magic wands' },
  { id: 'robot', label: 'Robot Lab', tag: 'KIDS', desc: 'Gears, circuits & cute bots' },
  { id: 'farm', label: 'Farm Fun', tag: 'KIDS', desc: 'Barns, animals & sunny fields' },
  { id: 'circus', label: 'Circus Party', tag: 'KIDS', desc: 'Tent stripes & balloon pops' },
  { id: 'ice-cream', label: 'Ice Cream Dream', tag: 'KIDS', desc: 'Scoops, cones & sprinkles' },
  { id: 'safari', label: 'Safari Park', tag: 'KIDS', desc: 'Animal spots & binoculars' },
  { id: 'music', label: 'Music Jam', tag: 'KIDS', desc: 'Notes, instruments & rhythms' },
  { id: 'blocks', label: 'Block Builder', tag: 'KIDS', desc: 'Colorful building block shapes' },
  // Professional themes
  { id: 'corporate-blue', label: 'Corporate Blue', tag: 'PRO', desc: 'Clean navy & white, boardroom ready' },
  { id: 'minimal-dark', label: 'Minimal Dark', tag: 'PRO', desc: 'Sleek dark with subtle accents' },
  { id: 'modern-gradient', label: 'Modern Gradient', tag: 'PRO', desc: 'Smooth gradients, contemporary feel' },
  { id: 'slate-gold', label: 'Slate & Gold', tag: 'PRO', desc: 'Elegant grey with gold accents' },
  { id: 'nordic-clean', label: 'Nordic Clean', tag: 'PRO', desc: 'Light, airy Scandinavian minimalism' },
  { id: 'monochrome', label: 'Monochrome', tag: 'PRO', desc: 'Black & white, strong typography' },
  { id: 'tech-modern', label: 'Tech Modern', tag: 'PRO', desc: 'Digital-inspired geometric shapes' },
  { id: 'earth-tones', label: 'Earth Tones', tag: 'PRO', desc: 'Warm naturals, sophisticated & grounded' },
  { id: 'coral-bloom', label: 'Coral Bloom', tag: 'PRO', desc: 'Soft coral & cream, elegant warmth' },
  { id: 'midnight-luxe', label: 'Midnight Luxe', tag: 'PRO', desc: 'Deep navy with metallic accents' },
];

type PresentationMode = 'kids' | 'professional';

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
   IMAGE ZONE COMPONENT
═══════════════════════════════════════ */

interface SlideRendererProps {
  slide: Slide;
  t: ThemeColors;
  w: number;
}

function defaultPlacementForLayout(layout: string, slideIndex?: number): string {
  if (layout === 'title') {
    const titleOptions = ['background', 'half'] as const;
    return titleOptions[Math.floor(Math.random() * titleOptions.length)];
  }
  if (layout === 'activity' || layout === 'assessment') return 'bottom-right';
  // Randomly pick from content placements for visual variety
  const contentPlacements = ['right', 'left', 'top'] as const;
  return contentPlacements[Math.floor(Math.random() * contentPlacements.length)];
}

function ImageZone({ image, placement, sc, theme }: { image?: string; placement?: string; sc: number; theme: ThemeColors }) {
  if (!placement || placement === 'none') return null;

  const positionStyles: Record<string, React.CSSProperties> = {
    right: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '35%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    left: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '35%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    top: { position: 'absolute', top: 0, left: 0, right: 0, height: '40%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    half: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    background: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    'bottom-right': { position: 'absolute', right: 12 * sc, bottom: 12 * sc, width: '25%', height: '40%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  };

  const style = positionStyles[placement] || positionStyles.right;

  if (image) {
    return (
      <div style={{ ...style, overflow: 'hidden', borderRadius: (placement === 'background' || placement === 'half') ? 0 : 10 * sc, zIndex: 0 }}>
        <img loading="lazy" src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {placement === 'background' && <div style={{ position: 'absolute', inset: 0, background: `${theme.bg}88` }} />}
      </div>
    );
  }

  // Placeholder
  return (
    <div style={{
      ...style,
      border: `${2 * sc}px dashed ${theme.primary}40`,
      borderRadius: (placement === 'background' || placement === 'half') ? 0 : 10 * sc,
      background: `${theme.primary}08`,
      flexDirection: 'column',
      gap: 4 * sc,
      opacity: 0.5,
      zIndex: 0,
    }}>
      <HugeiconsIcon icon={Image01Icon} size={24 * sc} style={{ color: theme.primary, opacity: 0.4 }} />
      <span style={{ fontSize: 8 * sc, color: theme.primary, opacity: 0.5, fontFamily: 'system-ui', fontWeight: 600 }}>Image</span>
    </div>
  );
}

function imageAwareInsets(placement: string | undefined, w: number): React.CSSProperties {
  if (!placement || placement === 'none') return {};
  if (placement === 'background') return { zIndex: 1 };
  const H = w * 0.5625;
  switch (placement) {
    case 'right': return { right: w * 0.37 };
    case 'left': return { left: w * 0.37 };
    case 'half': return { right: w * 0.52 };
    case 'top': return { top: H * 0.43 };
    default: return {};
  }
}

function imageDimensionsForPlacement(placement: string | undefined): { width: number; height: number } {
  switch (placement) {
    case 'background': return { width: 1024, height: 576 };
    case 'half': return { width: 512, height: 768 };
    case 'right': case 'left': return { width: 512, height: 768 };
    case 'top': return { width: 1024, height: 448 };
    case 'bottom-right': return { width: 576, height: 576 };
    default: return { width: 1024, height: 576 };
  }
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
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${40 * sc}px ${50 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ padding: `${6 * sc}px ${16 * sc}px`, background: p, borderRadius: 24 * sc, color: hexLum(p) > 0.5 ? '#000' : '#fff', fontSize: 10 * sc, fontWeight: 800, letterSpacing: '0.06em', marginBottom: 18 * sc, boxShadow: `0 ${4 * sc}px 0 ${darken(p, 0.2)}` }}>{c.badge}</div>}
          <div style={{ fontSize: 38 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 14 * sc, color: darken(p, 0.2), fontWeight: 600, background: `${p}20`, padding: `${6 * sc}px ${14 * sc}px`, borderRadius: 12 * sc }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 28 * sc, right: 28 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${5 * sc}px ${14 * sc}px`, background: p, borderRadius: 20 * sc, marginBottom: 10 * sc, boxShadow: `0 ${3 * sc}px 0 ${darken(p, 0.2)}` }}>
            <span style={{ fontSize: 9 * sc, fontWeight: 800, color: hexLum(p) > 0.5 ? '#000' : '#fff', letterSpacing: '0.08em' }}>{c.badge || L.toUpperCase()}</span>
          </div>
          <div style={{ fontSize: L === 'hook' ? 20 * sc : 22 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 14 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 12 * sc, color: darken(p, 0.3), lineHeight: 1.6, marginBottom: 12 * sc, padding: `${10 * sc}px ${14 * sc}px`, background: `${p}1a`, borderRadius: 10 * sc, backdropFilter: 'blur(8px)', boxShadow: `0 ${2 * sc}px ${8 * sc}px ${p}15` }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 8 * sc, padding: `${7 * sc}px ${12 * sc}px`, background: `${p}${['18', '12', '0d'][i % 3]}`, borderRadius: 10 * sc }}>
              <div style={{ width: 20 * sc, height: 20 * sc, borderRadius: '50%', background: p, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 ${2 * sc}px 0 ${darken(p, 0.2)}` }}><span style={{ fontSize: 9 * sc, fontWeight: 900, color: hexLum(p) > 0.5 ? '#000' : '#fff' }}>{i + 1}</span></div>
              <span style={{ fontSize: 12 * sc, color: ink, lineHeight: 1.4, fontWeight: 600 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
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
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${40 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ border: `${2 * sc}px dashed ${p}`, borderRadius: 4 * sc, padding: `${4 * sc}px ${14 * sc}px`, color: p, fontSize: 9 * sc, fontWeight: 700, letterSpacing: '0.18em', marginBottom: 18 * sc, textTransform: 'uppercase' }}>{c.badge}</div>}
          <div style={{ fontSize: 34 * sc, fontWeight: 700, color: chalk, lineHeight: 1.15, marginBottom: 12 * sc, textShadow: `${1 * sc}px ${1 * sc}px 0 ${chalk}22` }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: p, fontWeight: 600, borderBottom: `${2 * sc}px solid ${p}`, paddingBottom: 4 * sc, letterSpacing: '0.06em' }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 26 * sc, left: 28 * sc, right: 28 * sc, bottom: 20 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 * sc, marginBottom: 10 * sc }}>
            <div style={{ width: 18 * sc, height: 18 * sc, border: `${2 * sc}px solid ${p}`, borderRadius: 3 * sc, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: p }}>{SLIDE_LAYOUTS.indexOf(L) + 1}</span></div>
            <span style={{ fontSize: 9 * sc, color: p, letterSpacing: '0.16em', fontWeight: 700, textTransform: 'uppercase' }}>{c.badge || L}</span>
          </div>
          <div style={{ fontSize: L === 'hook' ? 19 * sc : 20 * sc, fontWeight: 700, color: chalk, lineHeight: 1.2, marginBottom: 14 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: chalkMuted, lineHeight: 1.7, marginBottom: 12 * sc, borderLeft: `${2 * sc}px solid ${p}`, paddingLeft: 10 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 * sc, marginBottom: 7 * sc }}>
              <span style={{ fontSize: 11 * sc, color: p, fontWeight: 700, minWidth: 14 * sc }}>&#10022;</span>
              <span style={{ fontSize: 12 * sc, color: chalkMuted, lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
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
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${50 * sc}px ${55 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ fontSize: 9 * sc, color: accentWarm, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 * sc, fontFamily: 'system-ui,sans-serif' }}>{c.badge}</div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 900, color: ink, lineHeight: 1.1, marginBottom: 16 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ display: 'flex', alignItems: 'center', gap: 10 * sc }}>
            <div style={{ height: 1 * sc, width: 24 * sc, background: accentWarm }} />
            <span style={{ fontSize: 13 * sc, color: t.textMuted, fontStyle: 'italic' }}>{c.subtitle}</span>
            <div style={{ height: 1 * sc, width: 24 * sc, background: accentWarm }} />
          </div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 30 * sc, left: 38 * sc, right: 38 * sc, bottom: 24 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ fontSize: 9 * sc, color: accentWarm, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 * sc, fontFamily: 'system-ui,sans-serif' }}>{c.badge || L}</div>
          <div style={{ fontSize: L === 'hook' ? 20 * sc : 21 * sc, fontWeight: 700, color: ink, lineHeight: 1.25, marginBottom: 14 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          <div style={{ width: 38 * sc, height: 1.5 * sc, background: accentWarm, marginBottom: 12 * sc, opacity: 0.6 }} />
          {c.body && <p style={{ fontSize: 12 * sc, color: t.textMuted, lineHeight: 1.75, marginBottom: 12 * sc, fontStyle: 'italic' }}>{c.body}</p>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 10 * sc, marginBottom: 8 * sc, paddingLeft: 4 * sc }}>
              <span style={{ fontSize: 14 * sc, color: accentWarm, lineHeight: 1.3, marginTop: -1 * sc }}>&#10022;</span>
              <span style={{ fontSize: 12 * sc, color: ink, lineHeight: 1.55 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
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
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${30 * sc}px ${36 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', marginBottom: 14 * sc, alignSelf: 'flex-start', position: 'relative' }}>
            <div style={{ padding: `${8 * sc}px ${18 * sc}px`, background: p, border: `${3 * sc}px solid ${ink}`, borderRadius: 4 * sc, transform: 'rotate(-2deg)', boxShadow: `${4 * sc}px ${4 * sc}px 0 ${ink}` }}>
              <span style={{ fontSize: 22 * sc, fontWeight: 900, color: hexLum(p) > 0.5 ? '#000' : '#fff', letterSpacing: '0.04em' }}>{tagWord}</span>
            </div>
          </div>
          <div style={{ fontSize: 34 * sc, fontWeight: 900, color: ink, lineHeight: 0.95, letterSpacing: '-0.02em', textTransform: 'uppercase', textShadow: `${2 * sc}px ${2 * sc}px 0 ${p}`, marginBottom: 12 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: p, fontWeight: 800, borderTop: `${2 * sc}px solid ${ink}`, paddingTop: 9 * sc, fontFamily: 'system-ui,sans-serif' }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', ...imageAwareInsets(c.imagePlacement, w) }}>
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
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
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
        <div style={{ position: 'absolute', inset: 0, padding: `${36 * sc}px ${40 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
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
        <div style={{ position: 'absolute', top: 18 * sc, left: 22 * sc, right: 22 * sc, bottom: 14 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ position: 'absolute', top: -4 * sc, left: 8 * sc, width: 48 * sc, height: 12 * sc, background: tapeColor, opacity: 0.55, borderRadius: 1 * sc, transform: 'rotate(-1deg)' }} />
          <div style={{ fontSize: 9 * sc, fontWeight: 700, color: p, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 * sc, marginTop: 10 * sc, fontFamily: 'system-ui,sans-serif' }}>{c.badge || L}</div>
          <div style={{ fontSize: L === 'hook' ? 19 * sc : 21 * sc, fontWeight: 700, color: ink, lineHeight: 1.2, marginBottom: 12 * sc, transform: 'rotate(-0.3deg)' }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: t.textMuted, lineHeight: 1.7, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: t.isDark ? `${p}12` : '#fff8ee', border: `1px solid ${t.isDark ? p + '22' : '#e8d5b0'}`, borderRadius: 3 * sc, transform: 'rotate(0.2deg)' }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 9 * sc, marginBottom: 7 * sc, padding: `${6 * sc}px ${10 * sc}px`, background: i % 2 === 0 ? (t.isDark ? `${p}10` : '#fff8f0') : 'transparent', borderBottom: `1px dashed ${t.isDark ? p + '30' : '#c8b890'}` }}>
              <span style={{ fontSize: 13 * sc, color: p, marginTop: -1 * sc }}>&#10047;</span>
              <span style={{ fontSize: 12 * sc, color: ink, lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
    </div>
  );
}

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
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${40 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ padding: `${5 * sc}px ${16 * sc}px`, background: `${p}30`, border: `1px solid ${p}60`, borderRadius: 20 * sc, marginBottom: 16 * sc }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: p, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 900, color: '#ffffff', lineHeight: 1.05, marginBottom: 14 * sc, textShadow: `0 0 ${12 * sc}px ${p}66` }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: '#8888cc' }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `${p}25`, borderRadius: 14 * sc, marginBottom: 8 * sc, border: `1px solid ${p}50` }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: p, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge || L}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: '#aaaadd', lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: 'rgba(255,255,255,0.05)', borderRadius: 8 * sc, backdropFilter: 'blur(8px)' }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 18 * sc, height: 18 * sc, borderRadius: '50%', background: `${p}30`, border: `1px solid ${p}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 8 * sc, fontWeight: 800, color: '#fff' }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: '#ccccee', lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
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
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${40 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ padding: `${6 * sc}px ${18 * sc}px`, background: `linear-gradient(135deg, ${p}, ${lighten(p, 0.3)})`, borderRadius: 24 * sc, color: '#fff', fontSize: 10 * sc, fontWeight: 800, marginBottom: 16 * sc, boxShadow: `0 ${3 * sc}px 0 ${darken(p, 0.15)}` }}>{c.badge}</div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: darken(p, 0.1), fontWeight: 600, padding: `${5 * sc}px ${14 * sc}px`, background: `${p}15`, borderRadius: 14 * sc }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${5 * sc}px ${14 * sc}px`, background: `linear-gradient(135deg, ${p}, ${lighten(p, 0.2)})`, borderRadius: 20 * sc, marginBottom: 10 * sc, boxShadow: `0 ${2 * sc}px 0 ${darken(p, 0.15)}` }}><span style={{ fontSize: 9 * sc, fontWeight: 800, color: '#fff', letterSpacing: '0.06em' }}>{c.badge || L.toUpperCase()}</span></div>
          <div style={{ fontSize: 21 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: darken(p, 0.3), lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: `${p}12`, borderRadius: 10 * sc, backdropFilter: 'blur(8px)' }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc, padding: `${6 * sc}px ${10 * sc}px`, background: i % 2 === 0 ? `${pastel1}55` : `${pastel2}44`, borderRadius: 10 * sc }}>
              <div style={{ width: 18 * sc, height: 18 * sc, borderRadius: '50%', background: `linear-gradient(135deg, ${p}, ${lighten(p, 0.25)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 8 * sc, fontWeight: 900, color: '#fff' }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.4, fontWeight: 600 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
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
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${36 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ padding: `${5 * sc}px ${16 * sc}px`, background: `${p}30`, borderRadius: 20 * sc, marginBottom: 16 * sc, border: `1px solid ${p}50` }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: wave, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 900, color: '#ffffff', lineHeight: 1.05, marginBottom: 14 * sc, textShadow: `0 ${2 * sc}px ${6 * sc}px rgba(0,0,0,0.3)` }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: wave }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 20 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `${p}25`, borderRadius: 14 * sc, marginBottom: 8 * sc }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: wave, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge || L}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: 'rgba(255,255,255,0.06)', borderRadius: 8 * sc, backdropFilter: 'blur(8px)' }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 16 * sc, height: 16 * sc, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: `1px solid ${wave}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: wave }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: 'rgba(255,255,255,0.85)', lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
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
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${36 * sc}px ${40 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ display: 'inline-flex', padding: `${5 * sc}px ${14 * sc}px`, background: earthy, borderRadius: 4 * sc, marginBottom: 14 * sc, alignSelf: 'flex-start' }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: '#1a1a0a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 34 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc, textShadow: `0 ${2 * sc}px ${4 * sc}px rgba(0,0,0,0.3)` }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: earthy, fontWeight: 600 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `${earthy}33`, borderRadius: 4 * sc, marginBottom: 8 * sc, border: `1px solid ${earthy}55` }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: earthy, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge || L}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: 'rgba(255,255,240,0.7)', lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: 'rgba(255,255,255,0.05)', borderRadius: 6 * sc, borderLeft: `3px solid ${earthy}`, backdropFilter: 'blur(8px)' }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 16 * sc, height: 16 * sc, borderRadius: '50%', background: `${earthy}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: earthy }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.45, fontWeight: 500 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
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
        <div style={{ position: 'absolute', top: 24 * sc, left: 20 * sc, right: 20 * sc, bottom: 12 * sc, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ fontSize: 9 * sc, color: p, marginBottom: 10 * sc }}>{'>'} {c.badge}</div>}
          <div style={{ fontSize: 28 * sc, fontWeight: 700, color: ink, lineHeight: 1.1, marginBottom: 12 * sc, textShadow: `0 0 ${6 * sc}px ${ink}44` }}>{'> '}{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 11 * sc, color: dim, marginTop: 4 * sc }}>{'// '}{c.subtitle}</div>}
          <div style={{ fontSize: 10 * sc, color: `${ink}55`, marginTop: 16 * sc }}>{'█'.repeat(20)} LOADING... 100%</div>
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 24 * sc, left: 16 * sc, right: 16 * sc, bottom: 12 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
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
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
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
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${40 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ padding: `${5 * sc}px ${16 * sc}px`, background: `linear-gradient(90deg, ${rainbow[0]}22, ${rainbow[3]}22, ${rainbow[6]}22)`, borderRadius: 20 * sc, marginBottom: 16 * sc }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: p, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 38 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: t.textMuted, fontWeight: 600 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 20 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `linear-gradient(90deg, ${rainbow[0]}18, ${rainbow[3]}18)`, borderRadius: 14 * sc, marginBottom: 8 * sc }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: p, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge || L}</span></div>
          <div style={{ fontSize: 21 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: t.textMuted, lineHeight: 1.6, marginBottom: 10 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc, padding: `${6 * sc}px ${10 * sc}px`, borderLeft: `3px solid ${rainbow[i % rainbow.length]}`, borderRadius: `0 8px 8px 0`, background: `${rainbow[i % rainbow.length]}0d` }}>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.4, fontWeight: 600 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
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
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${36 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ fontSize: 10 * sc, fontWeight: 700, color: p, marginBottom: 12 * sc, padding: `${4 * sc}px ${14 * sc}px`, background: `${p}15`, borderRadius: 8 * sc, transform: 'rotate(-1deg)' }}>{c.badge}</div>}
          <div style={{ fontSize: 34 * sc, fontWeight: 700, color: ink, lineHeight: 1.1, marginBottom: 14 * sc, textDecoration: `underline wavy ${p}`, textDecorationThickness: `${2 * sc}px`, textUnderlineOffset: `${6 * sc}px` }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: darken(p, 0.2), fontWeight: 600 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 20 * sc, left: 24 * sc, right: 24 * sc, bottom: 14 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ fontSize: 10 * sc, fontWeight: 700, color: p, marginBottom: 8 * sc, transform: 'rotate(-0.5deg)' }}>{c.badge || L.toUpperCase()}</div>
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
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
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
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${40 * sc}px ${44 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ display: 'inline-flex', padding: `${5 * sc}px ${14 * sc}px`, background: p, color: hexLum(p) > 0.5 ? '#000' : '#fff', fontSize: 9 * sc, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 * sc, clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)' }}>{c.badge}</div>}
          <div style={{ fontSize: 34 * sc, fontWeight: 800, color: ink, lineHeight: 1.1, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: t.textMuted, fontWeight: 500 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
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
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
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
        <div style={{ position: 'absolute', inset: `${16 * sc}px`, background: `${bg}cc`, border: `${2 * sc}px solid ${wood}44`, borderRadius: 6 * sc, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${30 * sc}px ${36 * sc}px`, backdropFilter: 'blur(8px)', ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `${wood}22`, borderRadius: 4 * sc, marginBottom: 12 * sc, alignSelf: 'flex-start', border: `1px solid ${wood}44` }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: wood, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 34 * sc, fontWeight: 800, color: ink, lineHeight: 1.1, marginBottom: 12 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: wood, fontWeight: 600 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 18 * sc, left: 22 * sc, right: 22 * sc, bottom: 14 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `${wood}22`, borderRadius: 4 * sc, marginBottom: 8 * sc, border: `1px solid ${wood}33` }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: wood, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge || L}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: t.textMuted, lineHeight: 1.65, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: `${wood}0d`, borderRadius: 4 * sc, border: `1px solid ${wood}22` }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 14 * sc, height: 14 * sc, borderRadius: '50%', background: `${leafGreen}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 7 * sc, fontWeight: 700, color: leafGreen }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.45, fontWeight: 500 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
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
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${36 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ padding: `${6 * sc}px ${20 * sc}px`, background: p, clipPath: 'polygon(8% 0, 92% 0, 100% 50%, 92% 100%, 8% 100%, 0 50%)', marginBottom: 16 * sc }}><span style={{ fontSize: 10 * sc, fontWeight: 900, color: hexLum(p) > 0.5 ? '#000' : '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 38 * sc, fontWeight: 900, color: '#ffffff', lineHeight: 1.0, textTransform: 'uppercase', letterSpacing: '-0.02em', textShadow: `${2 * sc}px ${2 * sc}px 0 ${p}, ${4 * sc}px ${4 * sc}px 0 rgba(0,0,0,0.3)`, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 12 * sc, color: gold, fontWeight: 700, fontFamily: 'system-ui,sans-serif', letterSpacing: '0.08em' }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ background: `linear-gradient(90deg, ${p}, ${darken(p, 0.2)})`, padding: `${7 * sc}px ${18 * sc}px`, display: 'flex', alignItems: 'center', gap: 10 * sc }}>
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
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
    </div>
  );
}

/* ═══════════════════════════════════════
   SLIDE RENDERERS — NEW KIDS STYLES
═══════════════════════════════════════ */

function DinosaurSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#3d2b1f';
  const ink = '#f5e6c8', lava = '#ff6b35', fossil = '#c8a96e';
  return (
    <div style={{ width: w, height: H, background: `linear-gradient(170deg, ${darken(bg, 0.1)} 0%, ${bg} 60%, ${lava}22 100%)`, position: 'relative', overflow: 'hidden', borderRadius: 12 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      {/* Mountains */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 0, height: 0, borderLeft: `${120 * sc}px solid transparent`, borderRight: `${80 * sc}px solid transparent`, borderBottom: `${100 * sc}px solid ${lava}15` }} />
      <div style={{ position: 'absolute', bottom: 0, right: 20 * sc, width: 0, height: 0, borderLeft: `${100 * sc}px solid transparent`, borderRight: `${60 * sc}px solid transparent`, borderBottom: `${80 * sc}px solid ${lava}12` }} />
      {/* Fossil dots */}
      {[...Array(6)].map((_, i) => <div key={i} style={{ position: 'absolute', width: (3 + i % 3) * sc, height: (3 + i % 3) * sc, borderRadius: '50%', background: fossil, opacity: 0.15, top: `${12 + (i * 18) % 70}%`, left: `${10 + (i * 23) % 80}%` }} />)}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4 * sc, background: `linear-gradient(90deg, ${lava}44, ${lava}88, ${lava}44)` }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${36 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ padding: `${5 * sc}px ${16 * sc}px`, background: `${lava}33`, border: `1px solid ${lava}66`, borderRadius: 20 * sc, marginBottom: 16 * sc }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: lava, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc, textShadow: `0 ${2 * sc}px ${6 * sc}px rgba(0,0,0,0.4)` }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: fossil, fontWeight: 600 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `${lava}25`, borderRadius: 14 * sc, marginBottom: 8 * sc, border: `1px solid ${lava}50` }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: lava, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge || L}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: `${ink}bb`, lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: 'rgba(255,255,255,0.05)', borderRadius: 8 * sc, backdropFilter: 'blur(8px)', boxShadow: `0 ${2 * sc}px ${8 * sc}px rgba(0,0,0,0.2)` }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 16 * sc, height: 16 * sc, borderRadius: '50%', background: `${lava}33`, border: `1px solid ${lava}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 8 * sc, fontWeight: 800, color: lava }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
    </div>
  );
}

function PirateSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#0d2847';
  const gold = '#ffd700', ink = '#f0e6d2', rope = '#c8a96e';
  return (
    <div style={{ width: w, height: H, background: `linear-gradient(180deg, ${bg} 0%, #0a1e3a 60%, #1a3a5c 100%)`, position: 'relative', overflow: 'hidden', borderRadius: 10 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      {/* Waves */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40 * sc }} viewBox="0 0 640 40" preserveAspectRatio="none">
        <path d="M0,20 Q40,8 80,20 T160,20 T240,20 T320,20 T400,20 T480,20 T560,20 T640,20 L640,40 L0,40 Z" fill={`${p}18`} />
      </svg>
      {/* Rope border */}
      <div style={{ position: 'absolute', inset: `${6 * sc}px`, border: `${2 * sc}px dashed ${rope}55`, borderRadius: 8 * sc, pointerEvents: 'none' }} />
      {/* Compass */}
      <div style={{ position: 'absolute', top: 15 * sc, right: 15 * sc, width: 24 * sc, height: 24 * sc, borderRadius: '50%', border: `1px solid ${gold}55`, opacity: 0.4 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 1 * sc, height: 10 * sc, background: gold, transform: 'translate(-50%,-100%) rotate(30deg)', transformOrigin: 'bottom center' }} />
      </div>
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${36 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ padding: `${5 * sc}px ${16 * sc}px`, background: gold, borderRadius: 4 * sc, marginBottom: 16 * sc, boxShadow: `0 ${3 * sc}px 0 ${darken('#ffd700', 0.3)}` }}><span style={{ fontSize: 9 * sc, fontWeight: 800, color: '#1a1a0a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc, textShadow: `0 ${2 * sc}px ${6 * sc}px rgba(0,0,0,0.4)` }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: gold, fontWeight: 600 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `${gold}22`, borderRadius: 4 * sc, marginBottom: 8 * sc, border: `1px solid ${gold}55` }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: gold, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge || L}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: `${ink}bb`, lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: 'rgba(255,255,255,0.06)', borderRadius: 8 * sc, backdropFilter: 'blur(8px)' }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 16 * sc, height: 16 * sc, borderRadius: 3 * sc, background: `${gold}33`, border: `1px solid ${gold}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 8 * sc, fontWeight: 800, color: gold }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
    </div>
  );
}

function FairySlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#f8f0ff';
  const ink = t.isDark ? t.text : '#3d1f5c';
  const sparkle = '#e8b4f8', castle = lighten(p, 0.5);
  return (
    <div style={{ width: w, height: H, background: `linear-gradient(160deg, ${bg} 0%, ${lighten(bg, 0.05)} 50%, #f0e4ff 100%)`, position: 'relative', overflow: 'hidden', borderRadius: 14 * sc, fontFamily: 'Georgia,serif', flexShrink: 0 }}>
      {/* Sparkle dots */}
      {[...Array(10)].map((_, i) => <div key={i} style={{ position: 'absolute', width: (2 + i % 3) * sc, height: (2 + i % 3) * sc, borderRadius: '50%', background: sparkle, opacity: 0.3 + (i % 4) * 0.1, top: `${5 + (i * 13) % 85}%`, left: `${3 + (i * 17) % 90}%`, boxShadow: `0 0 ${3 * sc}px ${sparkle}` }} />)}
      {/* Castle turret silhouette */}
      <div style={{ position: 'absolute', bottom: 0, right: 20 * sc, width: 50 * sc, height: 70 * sc, background: `${castle}22`, borderRadius: `${6 * sc}px ${6 * sc}px 0 0`, opacity: 0.4 }}>
        <div style={{ position: 'absolute', top: -10 * sc, left: 5 * sc, width: 10 * sc, height: 20 * sc, background: `${castle}22`, borderRadius: `${4 * sc}px ${4 * sc}px 0 0` }} />
        <div style={{ position: 'absolute', top: -10 * sc, right: 5 * sc, width: 10 * sc, height: 20 * sc, background: `${castle}22`, borderRadius: `${4 * sc}px ${4 * sc}px 0 0` }} />
      </div>
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${40 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ padding: `${5 * sc}px ${18 * sc}px`, background: `linear-gradient(135deg, ${p}44, ${sparkle}66)`, borderRadius: 24 * sc, marginBottom: 16 * sc, backdropFilter: 'blur(8px)', boxShadow: `0 ${3 * sc}px ${10 * sc}px ${sparkle}33` }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: ink, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 800, color: ink, lineHeight: 1.05, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: darken(sparkle, 0.3), fontWeight: 600, fontStyle: 'italic' }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 28 * sc, right: 28 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${14 * sc}px`, background: `${sparkle}33`, borderRadius: 16 * sc, marginBottom: 8 * sc, border: `1px solid ${sparkle}55` }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: ink, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge || L}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 700, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: darken(sparkle, 0.5), lineHeight: 1.65, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: `${sparkle}15`, borderRadius: 10 * sc, backdropFilter: 'blur(8px)' }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 14 * sc, height: 14 * sc, borderRadius: '50%', background: `${sparkle}44`, border: `1px solid ${sparkle}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 ${4 * sc}px ${sparkle}44` }}><span style={{ fontSize: 7 * sc, fontWeight: 700, color: ink }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
    </div>
  );
}

function RobotSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#1a2035';
  const ink = '#e0e8f0', silver = '#8899aa', led = '#00e5ff';
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 8 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      {/* Circuit grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${led}08 1px,transparent 1px),linear-gradient(90deg,${led}08 1px,transparent 1px)`, backgroundSize: `${30 * sc}px ${30 * sc}px` }} />
      {/* Circuit traces */}
      <div style={{ position: 'absolute', top: 30 * sc, right: 0, width: 80 * sc, height: 2 * sc, background: `${led}22` }} />
      <div style={{ position: 'absolute', top: 30 * sc, right: 80 * sc, width: 2 * sc, height: 60 * sc, background: `${led}22` }} />
      {/* Gear */}
      <div style={{ position: 'absolute', bottom: -20 * sc, left: -20 * sc, width: 80 * sc, height: 80 * sc, borderRadius: '50%', border: `${3 * sc}px solid ${silver}22` }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 20 * sc, height: 20 * sc, borderRadius: '50%', background: `${silver}15`, transform: 'translate(-50%,-50%)' }} />
      </div>
      {/* LED dots */}
      {[...Array(4)].map((_, i) => <div key={i} style={{ position: 'absolute', width: 4 * sc, height: 4 * sc, borderRadius: '50%', background: led, opacity: 0.3, top: `${20 + i * 20}%`, right: 10 * sc, boxShadow: `0 0 ${4 * sc}px ${led}` }} />)}
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${36 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ padding: `${5 * sc}px ${16 * sc}px`, background: `${led}22`, border: `1px solid ${led}55`, borderRadius: 4 * sc, marginBottom: 16 * sc }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: led, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: silver }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `${led}15`, border: `1px solid ${led}40`, borderRadius: 4 * sc, marginBottom: 8 * sc }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: led, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge || L}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: silver, lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: `${led}08`, border: `1px solid ${led}22`, borderRadius: 6 * sc, backdropFilter: 'blur(8px)' }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 16 * sc, height: 16 * sc, background: `${led}22`, border: `1px solid ${led}55`, borderRadius: 3 * sc, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: led }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
    </div>
  );
}

function FarmSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const sky = t.isDark ? t.bg : '#87ceeb', grass = '#4caf50', sun = '#ffd700', barn = '#8b4513';
  const ink = t.isDark ? t.text : '#2d1810';
  return (
    <div style={{ width: w, height: H, background: `linear-gradient(180deg, ${sky} 0%, ${lighten(sky, 0.2)} 55%, ${grass}44 55%, ${grass}66 100%)`, position: 'relative', overflow: 'hidden', borderRadius: 12 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      {/* Sun */}
      <div style={{ position: 'absolute', top: 8 * sc, right: 20 * sc, width: 30 * sc, height: 30 * sc, borderRadius: '50%', background: sun, opacity: 0.5, boxShadow: `0 0 ${15 * sc}px ${sun}66` }} />
      {/* Clouds */}
      <div style={{ position: 'absolute', top: 12 * sc, left: 40 * sc, width: 50 * sc, height: 16 * sc, background: 'rgba(255,255,255,0.6)', borderRadius: 20 * sc }} />
      <div style={{ position: 'absolute', top: 8 * sc, left: 55 * sc, width: 30 * sc, height: 12 * sc, background: 'rgba(255,255,255,0.5)', borderRadius: 20 * sc }} />
      {/* Fence */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 12 * sc, display: 'flex', alignItems: 'flex-end', gap: 14 * sc, padding: `0 ${10 * sc}px` }}>
        {[...Array(Math.ceil(w / (14 * sc)))].map((_, i) => <div key={i} style={{ width: 3 * sc, height: 12 * sc, background: `${barn}44`, borderRadius: `${1 * sc}px ${1 * sc}px 0 0`, flexShrink: 0 }} />)}
      </div>
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: `${20 * sc}px`, background: 'rgba(255,255,255,0.75)', borderRadius: 14 * sc, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${30 * sc}px`, backdropFilter: 'blur(8px)', boxShadow: `0 ${4 * sc}px ${16 * sc}px rgba(0,0,0,0.1)`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ padding: `${5 * sc}px ${16 * sc}px`, background: grass, borderRadius: 20 * sc, marginBottom: 16 * sc, boxShadow: `0 ${3 * sc}px 0 ${darken(grass, 0.2)}` }}><span style={{ fontSize: 9 * sc, fontWeight: 800, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: darken(grass, 0.2), fontWeight: 600 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 14 * sc, left: 20 * sc, right: 20 * sc, bottom: 18 * sc, ...imageAwareInsets(c.imagePlacement, w), background: 'rgba(255,255,255,0.7)', borderRadius: 12 * sc, padding: `${14 * sc}px ${18 * sc}px`, backdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: grass, borderRadius: 14 * sc, marginBottom: 8 * sc }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: '#fff', letterSpacing: '0.08em' }}>{c.badge || L.toUpperCase()}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 10 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: '#555', lineHeight: 1.6, marginBottom: 10 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 16 * sc, height: 16 * sc, borderRadius: '50%', background: [grass, sun, barn, '#e74c3c'][i % 4], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 7 * sc, fontWeight: 900, color: '#fff' }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.45, fontWeight: 500 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
    </div>
  );
}

function CircusSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const red = '#e74c3c', yellow = '#f1c40f', ink = t.isDark ? t.text : '#2c1810';
  const bg = t.isDark ? t.bg : '#fffdf0';
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 12 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      {/* Tent stripes */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8 * sc, background: `repeating-linear-gradient(90deg, ${red} 0px, ${red} ${15 * sc}px, ${bg} ${15 * sc}px, ${bg} ${30 * sc}px)` }} />
      {/* Bunting triangles */}
      <div style={{ position: 'absolute', top: 8 * sc, left: 0, right: 0, height: 14 * sc, display: 'flex', justifyContent: 'center' }}>
        {[...Array(12)].map((_, i) => <div key={i} style={{ width: 0, height: 0, borderLeft: `${8 * sc}px solid transparent`, borderRight: `${8 * sc}px solid transparent`, borderTop: `${12 * sc}px solid ${[red, yellow, p, '#3498db'][i % 4]}`, opacity: 0.7 }} />)}
      </div>
      {/* Star bursts */}
      {[...Array(5)].map((_, i) => <div key={i} style={{ position: 'absolute', width: 6 * sc, height: 6 * sc, background: yellow, clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', opacity: 0.25, top: `${25 + (i * 17) % 60}%`, left: `${5 + (i * 22) % 85}%` }} />)}
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${40 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ padding: `${6 * sc}px ${18 * sc}px`, background: red, borderRadius: 24 * sc, marginBottom: 16 * sc, boxShadow: `0 ${3 * sc}px 0 ${darken(red, 0.2)}` }}><span style={{ fontSize: 10 * sc, fontWeight: 800, color: '#fff', letterSpacing: '0.08em' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 38 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: red, fontWeight: 700 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 28 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${5 * sc}px ${14 * sc}px`, background: red, borderRadius: 20 * sc, marginBottom: 10 * sc, boxShadow: `0 ${2 * sc}px 0 ${darken(red, 0.2)}` }}><span style={{ fontSize: 9 * sc, fontWeight: 800, color: '#fff' }}>{c.badge || L.toUpperCase()}</span></div>
          <div style={{ fontSize: 21 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: '#555', lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: `${yellow}18`, borderRadius: 10 * sc }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc, padding: `${6 * sc}px ${10 * sc}px`, background: `${[red, yellow, p][i % 3]}12`, borderRadius: 8 * sc }}>
              <div style={{ width: 18 * sc, height: 18 * sc, borderRadius: '50%', background: [red, yellow, p, '#3498db'][i % 4], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 ${2 * sc}px 0 rgba(0,0,0,0.2)` }}><span style={{ fontSize: 8 * sc, fontWeight: 900, color: '#fff' }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.4, fontWeight: 600 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
    </div>
  );
}

function IceCreamSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#fff5f7';
  const ink = t.isDark ? t.text : '#4a1535';
  const mint = '#a8e6cf', pink = '#ffb7c5', cream = '#ffefd5';
  return (
    <div style={{ width: w, height: H, background: `linear-gradient(160deg, ${bg} 0%, ${cream} 100%)`, position: 'relative', overflow: 'hidden', borderRadius: 16 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      {/* Waffle pattern */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: `linear-gradient(45deg, #8B4513 25%, transparent 25%), linear-gradient(-45deg, #8B4513 25%, transparent 25%)`, backgroundSize: `${20 * sc}px ${20 * sc}px` }} />
      {/* Scoop circles */}
      <div style={{ position: 'absolute', top: -30 * sc, right: -20 * sc, width: 100 * sc, height: 100 * sc, borderRadius: '50%', background: `${pink}44` }} />
      <div style={{ position: 'absolute', top: -10 * sc, right: 30 * sc, width: 70 * sc, height: 70 * sc, borderRadius: '50%', background: `${mint}33` }} />
      <div style={{ position: 'absolute', bottom: -20 * sc, left: -10 * sc, width: 80 * sc, height: 80 * sc, borderRadius: '50%', background: `${cream}88` }} />
      {/* Sprinkle dots */}
      {[...Array(8)].map((_, i) => <div key={i} style={{ position: 'absolute', width: 3 * sc, height: 6 * sc, borderRadius: 3 * sc, background: [pink, mint, '#ffd700', p, '#ff6b6b'][i % 5], opacity: 0.3, top: `${15 + (i * 14) % 65}%`, left: `${8 + (i * 19) % 80}%`, transform: `rotate(${i * 45}deg)` }} />)}
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${40 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ padding: `${5 * sc}px ${18 * sc}px`, background: `linear-gradient(135deg, ${pink}, ${mint})`, borderRadius: 24 * sc, marginBottom: 16 * sc, boxShadow: `0 ${3 * sc}px ${8 * sc}px ${pink}44` }}><span style={{ fontSize: 9 * sc, fontWeight: 800, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: darken(pink, 0.3), fontWeight: 600 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${5 * sc}px ${14 * sc}px`, background: `linear-gradient(135deg, ${pink}88, ${mint}88)`, borderRadius: 20 * sc, marginBottom: 10 * sc }}><span style={{ fontSize: 9 * sc, fontWeight: 800, color: '#fff' }}>{c.badge || L.toUpperCase()}</span></div>
          <div style={{ fontSize: 21 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: darken(pink, 0.5), lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: 'rgba(255,255,255,0.6)', borderRadius: 10 * sc, backdropFilter: 'blur(8px)' }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc, padding: `${6 * sc}px ${10 * sc}px`, background: `${[pink, mint, cream][i % 3]}44`, borderRadius: 10 * sc }}>
              <div style={{ width: 18 * sc, height: 18 * sc, borderRadius: '50%', background: [pink, mint, '#ffd700'][i % 3], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 8 * sc, fontWeight: 900, color: '#fff' }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.4, fontWeight: 600 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
    </div>
  );
}

function SafariSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#2d1f0e';
  const ink = '#f5e6c8', tan = '#d4a76a', orange = '#e8742a';
  return (
    <div style={{ width: w, height: H, background: `linear-gradient(180deg, ${orange}33 0%, ${bg} 40%, ${darken(bg, 0.1)} 100%)`, position: 'relative', overflow: 'hidden', borderRadius: 10 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      {/* Savanna silhouette */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30 * sc, background: `${darken(bg, 0.3)}`, borderRadius: `${60 * sc}px ${60 * sc}px 0 0` }} />
      {/* Animal spots */}
      {[...Array(8)].map((_, i) => <div key={i} style={{ position: 'absolute', width: (6 + i % 4) * sc, height: (4 + i % 3) * sc, borderRadius: '50%', background: `${tan}15`, top: `${10 + (i * 15) % 70}%`, left: `${5 + (i * 21) % 85}%` }} />)}
      {/* Binocular shape */}
      <div style={{ position: 'absolute', top: 10 * sc, right: 12 * sc, display: 'flex', gap: 2 * sc, opacity: 0.2 }}>
        <div style={{ width: 14 * sc, height: 14 * sc, borderRadius: '50%', border: `2px solid ${tan}` }} />
        <div style={{ width: 14 * sc, height: 14 * sc, borderRadius: '50%', border: `2px solid ${tan}` }} />
      </div>
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${36 * sc}px ${40 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ display: 'inline-flex', padding: `${5 * sc}px ${14 * sc}px`, background: orange, borderRadius: 4 * sc, marginBottom: 14 * sc, alignSelf: 'flex-start', boxShadow: `0 ${3 * sc}px 0 ${darken(orange, 0.2)}` }}><span style={{ fontSize: 9 * sc, fontWeight: 800, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc, textShadow: `0 ${2 * sc}px ${6 * sc}px rgba(0,0,0,0.4)` }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: tan, fontWeight: 600 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `${orange}33`, borderRadius: 4 * sc, marginBottom: 8 * sc, border: `1px solid ${orange}55` }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: orange, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge || L}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: `${ink}bb`, lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: 'rgba(255,255,255,0.06)', borderRadius: 8 * sc, backdropFilter: 'blur(8px)' }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 16 * sc, height: 16 * sc, borderRadius: '50%', background: `${orange}33`, border: `1px solid ${orange}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 8 * sc, fontWeight: 800, color: orange }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
    </div>
  );
}

function MusicSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#1a0a2e';
  const ink = '#f0e6ff', gold = '#ffd700', purple = '#9b59b6';
  return (
    <div style={{ width: w, height: H, background: `linear-gradient(160deg, ${bg} 0%, #2d1854 50%, ${darken(bg, 0.1)} 100%)`, position: 'relative', overflow: 'hidden', borderRadius: 10 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      {/* Sound wave bars */}
      <div style={{ position: 'absolute', bottom: 8 * sc, left: 10 * sc, display: 'flex', gap: 3 * sc, alignItems: 'flex-end', opacity: 0.15 }}>
        {[...Array(20)].map((_, i) => <div key={i} style={{ width: 3 * sc, height: (6 + Math.sin(i * 0.8) * 12 + 6) * sc, background: `linear-gradient(180deg, ${gold}, ${purple})`, borderRadius: 2 * sc }} />)}
      </div>
      {/* Music note shapes */}
      <div style={{ position: 'absolute', top: 15 * sc, right: 30 * sc, fontSize: 20 * sc, color: `${gold}22`, fontWeight: 900, transform: 'rotate(15deg)' }}>&#9835;</div>
      <div style={{ position: 'absolute', top: 40 * sc, right: 70 * sc, fontSize: 14 * sc, color: `${purple}25`, fontWeight: 900, transform: 'rotate(-10deg)' }}>&#9834;</div>
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${36 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ padding: `${5 * sc}px ${16 * sc}px`, background: `${gold}22`, border: `1px solid ${gold}55`, borderRadius: 20 * sc, marginBottom: 16 * sc }}><span style={{ fontSize: 9 * sc, fontWeight: 700, color: gold, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 36 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc, textShadow: `0 0 ${12 * sc}px ${purple}66` }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: gold, fontWeight: 600 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${4 * sc}px ${12 * sc}px`, background: `${purple}33`, borderRadius: 14 * sc, marginBottom: 8 * sc, border: `1px solid ${purple}55` }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: gold, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.badge || L}</span></div>
          <div style={{ fontSize: 20 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: `${ink}bb`, lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: 'rgba(255,255,255,0.05)', borderRadius: 8 * sc, backdropFilter: 'blur(8px)' }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc }}>
              <div style={{ width: 16 * sc, height: 16 * sc, borderRadius: '50%', background: `${[purple, gold, '#3498db'][i % 3]}44`, border: `1px solid ${[purple, gold, '#3498db'][i % 3]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 8 * sc, fontWeight: 700, color: gold }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
    </div>
  );
}

function BlocksSlide({ slide, t, w }: SlideRendererProps) {
  const { layout: L, content: c = {} } = slide;
  const H = Math.round(w * 0.5625), sc = w / 640, p = t.primary;
  const bg = t.isDark ? t.bg : '#f0f0f0';
  const ink = t.isDark ? t.text : '#222';
  const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71'];
  return (
    <div style={{ width: w, height: H, background: bg, position: 'relative', overflow: 'hidden', borderRadius: 10 * sc, fontFamily: 'system-ui,sans-serif', flexShrink: 0 }}>
      {/* Grid pattern */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)`, backgroundSize: `${20 * sc}px ${20 * sc}px` }} />
      {/* Interlocking blocks */}
      <div style={{ position: 'absolute', top: -10 * sc, right: -10 * sc, width: 60 * sc, height: 30 * sc, background: colors[0], borderRadius: 4 * sc, opacity: 0.3 }}>
        {[0, 1].map(i => <div key={i} style={{ position: 'absolute', top: -6 * sc, left: 10 * sc + i * 20 * sc, width: 10 * sc, height: 10 * sc, borderRadius: '50%', background: colors[0] }} />)}
      </div>
      <div style={{ position: 'absolute', bottom: -5 * sc, left: 20 * sc, width: 50 * sc, height: 25 * sc, background: colors[1], borderRadius: 4 * sc, opacity: 0.2 }}>
        {[0, 1].map(i => <div key={i} style={{ position: 'absolute', top: -6 * sc, left: 8 * sc + i * 18 * sc, width: 8 * sc, height: 8 * sc, borderRadius: '50%', background: colors[1] }} />)}
      </div>
      <div style={{ position: 'absolute', top: '40%', left: -15 * sc, width: 40 * sc, height: 20 * sc, background: colors[2], borderRadius: 4 * sc, opacity: 0.2 }} />
      {L === 'title' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: `${40 * sc}px`, ...imageAwareInsets(c.imagePlacement, w) }}>
          {c.badge && <div style={{ padding: `${5 * sc}px ${18 * sc}px`, background: colors[0], borderRadius: 6 * sc, marginBottom: 16 * sc, boxShadow: `0 ${3 * sc}px 0 ${darken(colors[0], 0.2)}` }}><span style={{ fontSize: 10 * sc, fontWeight: 800, color: '#fff', letterSpacing: '0.08em' }}>{c.badge}</span></div>}
          <div style={{ fontSize: 38 * sc, fontWeight: 900, color: ink, lineHeight: 1.05, marginBottom: 14 * sc }}>{c.headline}</div>
          {c.subtitle && <div style={{ fontSize: 13 * sc, color: '#666', fontWeight: 600 }}>{c.subtitle}</div>}
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 22 * sc, left: 26 * sc, right: 26 * sc, bottom: 16 * sc, ...imageAwareInsets(c.imagePlacement, w) }}>
          <div style={{ display: 'inline-flex', padding: `${5 * sc}px ${14 * sc}px`, background: colors[1], borderRadius: 6 * sc, marginBottom: 10 * sc, boxShadow: `0 ${2 * sc}px 0 ${darken(colors[1], 0.2)}` }}><span style={{ fontSize: 9 * sc, fontWeight: 800, color: '#fff' }}>{c.badge || L.toUpperCase()}</span></div>
          <div style={{ fontSize: 22 * sc, fontWeight: 800, color: ink, lineHeight: 1.2, marginBottom: 12 * sc }}>{L === 'hook' ? `"${c.headline}"` : c.headline}</div>
          {c.body && <div style={{ fontSize: 11 * sc, color: '#555', lineHeight: 1.6, marginBottom: 10 * sc, padding: `${8 * sc}px ${12 * sc}px`, background: 'rgba(255,255,255,0.7)', borderRadius: 8 * sc, backdropFilter: 'blur(8px)', boxShadow: `0 ${2 * sc}px ${8 * sc}px rgba(0,0,0,0.08)` }}>{c.body}</div>}
          {(c.bullets || []).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * sc, marginBottom: 7 * sc, padding: `${6 * sc}px ${10 * sc}px`, background: `${colors[i % 4]}12`, borderRadius: 8 * sc, borderLeft: `3px solid ${colors[i % 4]}` }}>
              <div style={{ width: 18 * sc, height: 18 * sc, borderRadius: 4 * sc, background: colors[i % 4], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 ${2 * sc}px 0 rgba(0,0,0,0.15)` }}><span style={{ fontSize: 8 * sc, fontWeight: 900, color: '#fff' }}>{i + 1}</span></div>
              <span style={{ fontSize: 11 * sc, color: ink, lineHeight: 1.4, fontWeight: 600 }}>{b}</span>
            </div>
          ))}
        </div>
      )}
      <ImageZone image={c.image} placement={c.imagePlacement} sc={sc} theme={t} />
    </div>
  );
}

/* ═══════════════════════════════════════
   SLIDE CANVAS ROUTER
═══════════════════════════════════════ */

function SlideCanvas({ slide, theme, width = 640, styleId = 'bubbly', imageMode, slideIndex = 0 }: { slide: Slide; theme: ThemeColors; width?: number; styleId?: string; imageMode?: string; slideIndex?: number }) {
  if (!slide) return null;
  // When imageMode is 'ai', ensure every slide has a default imagePlacement so placeholders show
  const effectiveSlide = imageMode === 'ai' && slide.content.imageScene && !slide.content.imagePlacement
    ? { ...slide, content: { ...slide.content, imagePlacement: defaultPlacementForLayout(slide.layout, slideIndex) as any } }
    : slide;
  const p = { slide: effectiveSlide, t: theme, w: width };
  const renderers: Record<string, React.FC<SlideRendererProps>> = {
    bubbly: BubblySlide, chalkboard: ChalkboardSlide, storybook: StorybookSlide, comic: ComicSlide, scrapbook: ScrapbookSlide,
    space: SpaceSlide, candy: CandySlide, underwater: UnderwaterSlide, jungle: JungleSlide,
    pixel: PixelSlide, rainbow: RainbowSlide, crayon: CrayonSlide, origami: OrigamiSlide,
    treehouse: TreehouseSlide, superhero: SuperheroSlide,
    dinosaur: DinosaurSlide, pirate: PirateSlide, fairy: FairySlide, robot: RobotSlide,
    farm: FarmSlide, circus: CircusSlide, 'ice-cream': IceCreamSlide, safari: SafariSlide,
    music: MusicSlide, blocks: BlocksSlide,
  };
  const Renderer = renderers[styleId] || BubblySlide;
  return <Renderer {...p} />;
}

/* ═══════════════════════════════════════
   THUMBNAIL
═══════════════════════════════════════ */

function Thumbnail({ slide, theme, selected, onClick, index, styleId, imageMode }: { slide: Slide; theme: ThemeColors; selected: boolean; onClick: () => void; index: number; styleId: string; imageMode?: string }) {
  const W = 144, scale = W / 640;
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', borderRadius: 5, overflow: 'hidden', border: `2px solid ${selected ? theme.primary : 'transparent'}`, width: W, height: 82, position: 'relative', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
        <SlideCanvas slide={slide} theme={theme} width={640} styleId={styleId} imageMode={imageMode} slideIndex={index} />
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
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${primaryColor}12 50%, transparent 100%)`,
          animation: `shimmer 1.8s ease-in-out infinite`,
          animationDelay: `${delay}ms`,
        }}
      />
      <div className="p-2.5 space-y-1.5">
        <div className="rounded" style={{ width: '65%', height: 8, background: `${primaryColor}30`, animation: `pulse 1.5s ease-in-out infinite`, animationDelay: `${delay}ms` }} />
        <div className="rounded" style={{ width: '45%', height: 5, background: `${primaryColor}18`, animation: `pulse 1.5s ease-in-out infinite`, animationDelay: `${delay + 100}ms` }} />
        <div className="mt-2 space-y-1">
          <div className="rounded" style={{ width: '90%', height: 4, background: `${primaryColor}12`, animation: `pulse 1.5s ease-in-out infinite`, animationDelay: `${delay + 200}ms` }} />
          <div className="rounded" style={{ width: '70%', height: 4, background: `${primaryColor}12`, animation: `pulse 1.5s ease-in-out infinite`, animationDelay: `${delay + 300}ms` }} />
          <div className="rounded" style={{ width: '80%', height: 4, background: `${primaryColor}12`, animation: `pulse 1.5s ease-in-out infinite`, animationDelay: `${delay + 400}ms` }} />
        </div>
      </div>
      <div className="absolute bottom-1 right-2 text-[8px] font-bold" style={{ color: `${primaryColor}50` }}>{index + 1}</div>
    </div>
  );
}

function SkeletonStage({ primaryColor, streamingText, parsedCount, stageWidth, expectedSlides = 8 }: { primaryColor: string; streamingText: string; parsedCount: number; stageWidth: number; expectedSlides?: number }) {
  const slideHeight = Math.round(stageWidth * 0.5625);
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        className="rounded-lg overflow-hidden relative"
        style={{ width: stageWidth, height: slideHeight, background: 'var(--bg-secondary, #1e1e1e)', border: '1px solid var(--border-color, #333)', boxShadow: `0 4px 32px ${primaryColor}18` }}
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
        <div className="absolute bottom-3 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: `${primaryColor}20` }}>
          <Icon icon={Loading02Icon} className="w-3 animate-spin" style={{ color: primaryColor }} />
          <span className="text-[10px] font-bold" style={{ color: primaryColor }}>
            {parsedCount > 0 ? `${parsedCount} / ~${expectedSlides} slides` : 'Generating...'}
          </span>
        </div>
      </div>

      <div className="w-full rounded-lg border border-theme bg-theme-secondary px-4 py-3" style={{ maxWidth: stageWidth }}>
        <div className="flex items-center gap-2 mb-2">
          <Icon icon={Loading02Icon} className="w-3.5 animate-spin" style={{ color: primaryColor }} />
          <span className="text-xs font-semibold text-theme-heading">
            {parsedCount > 0
              ? `Building slide ${parsedCount + 1} of ~${expectedSlides}...`
              : 'Preparing slides...'}
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: expectedSlides }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all duration-500"
              style={{ background: i < parsedCount ? primaryColor : `${primaryColor}22` }}
            />
          ))}
        </div>
      </div>

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
  const slides: Slide[] = [];
  const arrStart = raw.indexOf('"slides"');
  if (arrStart === -1) return slides;
  const bracketStart = raw.indexOf('[', arrStart);
  if (bracketStart === -1) return slides;

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
  const triggerCheck = useAchievementTrigger();
  const { hasDiffusion } = useCapabilities();
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
  const [styleId, setStyleId] = useState(savedData?.styleId || 'bubbly');
  const [rightTab, setRightTab] = useState<RightTab>('color');
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(800);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width - 24;
        const h = entry.contentRect.height - 24;
        const maxW = Math.min(w, h / 0.5625);
        setStageWidth(Math.max(400, Math.floor(maxW)));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Generation state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image generation state
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});
  const [imageMode, setImageMode] = useState<ImageMode>(() => {
    const saved = savedData?.imageMode || 'none';
    // Don't restore 'ai' mode if diffusion is unavailable
    return saved === 'ai' && !hasDiffusion ? 'none' : saved;
  });
  const [slideCount, setSlideCount] = useState<number>(savedData?.slideCount ?? 8);
  const [presentationMode, setPresentationMode] = useState<PresentationMode>(savedData?.presentationMode || 'kids');
  const [maxImages, setMaxImages] = useState<number>(savedData?.maxImages ?? 0); // 0 = auto (AI decides)
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; dataUri: string; filename: string }>>(savedData?.uploadedImages || []);
  const [generationPhase, setGenerationPhase] = useState<'idle' | 'analyzing' | 'generating'>('idle');
  const [dragOver, setDragOver] = useState(false);
  const [batchImageProgress, setBatchImageProgress] = useState<{ current: number; total: number; generating: boolean }>({ current: 0, total: 0, generating: false });

  // Save/History state
  const [currentPresentationId, setCurrentPresentationId] = useState<string | null>(savedData?.currentPresentationId || null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showHistory, setShowHistory] = useState(false);
  const [presentationHistory, setPresentationHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftsExpanded, setDraftsExpanded] = useState(true);

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

  // Auto-switch theme when presentation mode changes
  useEffect(() => {
    const currentTheme = ALL_STYLES.find(s => s.id === styleId);
    if (presentationMode === 'professional' && currentTheme?.tag === 'KIDS') {
      setStyleId('corporate-blue');
      setPrimaryColor('#2563eb');
      setBgColor('#ffffff');
    } else if (presentationMode === 'kids' && currentTheme?.tag === 'PRO') {
      setStyleId('bubbly');
      setPrimaryColor('#38bdf8');
      setBgColor('#020617');
    }
  }, [presentationMode]);

  // Filtered styles based on mode
  const filteredStyles = ALL_STYLES.filter(s =>
    presentationMode === 'professional' ? s.tag === 'PRO' : s.tag === 'KIDS'
  );

  // Persist state
  useEffect(() => {
    onDataChange({
      inputMode, formData, useCurriculum, selectedPlanId,
      slides, primaryColor, bgColor, styleId, currentPresentationId, imageMode, slideCount,
      presentationMode, maxImages,
    });
  }, [inputMode, formData, useCurriculum, selectedPlanId, slides, primaryColor, bgColor, styleId, currentPresentationId, imageMode, slideCount]);

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

  // Subscribe to streaming
  useEffect(() => {
    const unsub = subscribe(tabId, ENDPOINT, () => {
      setStreamTick(t => t + 1);
    });
    return unsub;
  }, [tabId]);

  // Watch for streaming content
  const streamingContent = getStreamingContent(tabId, ENDPOINT);
  const isStreaming = getIsStreaming(tabId, ENDPOINT);
  const prevIsStreamingRef = useRef(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Progressive slide parsing during streaming
  useEffect(() => {
    if (isStreaming && streamingContent) {
      const parsed = tryParsePartialSlides(streamingContent);
      if (parsed.length > streamingSlides.length) {
        setStreamingSlides(parsed);
        setSlides(parsed);
        if (parsed.length > 0) {
          setSel(parsed.length - 1);
        }
      }
      if (view !== 'editor') {
        setView('editor');
      }
    }
  }, [streamTick, isStreaming, streamingContent]);

  // Watch for streaming completion
  useEffect(() => {
    if (prevIsStreamingRef.current && !isStreaming && streamingContent) {
      try {
        const m = streamingContent.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(m ? m[0] : streamingContent.trim());
        const newSlides = parsed.slides || [];
        setSlides(newSlides);
        // Assign uploaded images to slides
        if (imageMode === 'my-images' && uploadedImages.length > 0) {
          const finalSlides = newSlides.map((slide: Slide) => {
            const assignedIdx = (slide.content as any).assignedImage;
            if (assignedIdx && uploadedImages[assignedIdx - 1]) {
              return { ...slide, content: { ...slide.content, image: uploadedImages[assignedIdx - 1].dataUri } };
            }
            return slide;
          });
          setSlides(finalSlides);
        }
        setSel(0);
        setView('editor');
        setRightTab('edit');
        setError(null);
      } catch (e: any) {
        setError('Failed to parse slide data: ' + e.message);
      }
      setLoading(false);
      setGenerationPhase('idle');
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
        presentationMode,
      };
      await axios.post('http://localhost:8000/api/presentation-history', data);
      setCurrentPresentationId(id);
      setSaveStatus('saved');
      triggerCheck();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      console.error('Failed to save presentation:', e);
      setSaveStatus('idle');
    }
  };

  const loadPresentation = (pres: any) => {
    setSlides(pres.slides || []);
    setPresentationMode(pres.presentationMode || 'kids');
    setStyleId(pres.styleId || 'bubbly');
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

  const loadDrafts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/lesson-drafts?plannerType=presentation');
      setDrafts(response.data || []);
    } catch (e) {
      console.error('Failed to load drafts:', e);
    }
  };

  const loadDraft = async (draft: Draft) => {
    if (draft.formData) {
      setFormData(draft.formData);
    }
    setSlides([]);
    setCurrentPresentationId(null);
    setShowHistory(false);
    setView('input');
    try {
      await axios.delete(`http://localhost:8000/api/lesson-drafts/${draft.id}`);
      loadDrafts();
    } catch (e) {
      console.error('Failed to delete draft after loading:', e);
    }
  };

  const deleteDraft = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/lesson-drafts/${id}`);
      setDrafts(prev => prev.filter(d => d.id !== id));
    } catch (e) {
      console.error('Failed to delete draft:', e);
    }
  };

  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const updateField = (field: keyof PresentationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    setGenerationPhase('idle');

    try {
      let imageContext = '';

      // Pass 1: Analyze uploaded images (only for 'my-images' mode)
      if (imageMode === 'my-images' && uploadedImages.length > 0) {
        setGenerationPhase('analyzing');
        try {
          const analysisRes = await axios.post('http://localhost:8000/api/analyze-presentation-images', {
            images: uploadedImages.map(img => ({ dataUri: img.dataUri, filename: img.filename })),
            subject: formData.subject || 'General',
            grade: formData.gradeLevel || '4',
            topic: formData.topic || 'Lesson',
            slideCount,
          });

          if (analysisRes.data.success) {
            const analyses = analysisRes.data.analyses;
            imageContext = '\n\nTEACHER-PROVIDED IMAGES:\n' +
              analyses.map((a: any, i: number) => `Image ${i + 1} ("${a.filename}"): ${a.description}`).join('\n') +
              '\n\nIMPORTANT: Assign each teacher-provided image to the most relevant slide by setting imagePlacement to "right", "left", "top", "half", or "background" and adding "assignedImage" field with the image number (1-indexed). VARY the placement across slides — do NOT use the same position for every slide. Not every slide needs an image. Only assign images where they genuinely enhance understanding.';
          }
        } catch (e: any) {
          console.error('Image analysis failed:', e);
          // Continue without image context — don't block generation
        }
      }

      // Pass 2: Generate slides
      setGenerationPhase('generating');
      const includeImagePlacement = imageMode !== 'none';
      let prompt: string;

      if (inputMode === 'lesson') {
        const plan = lessonPlans.find(p => p.id === selectedPlanId);
        if (!plan) { setError('Please select a lesson plan first.'); setLoading(false); return; }
        prompt = buildPresentationPromptFromLesson(plan.parsedLesson || {}, plan.generatedPlan, formData, includeImagePlacement, slideCount, presentationMode) + imageContext;
      } else {
        const errors: Record<string, boolean> = {};
        if (!formData.subject) errors.subject = true;
        if (!formData.gradeLevel) errors.gradeLevel = true;
        if (!formData.topic) errors.topic = true;
        if (Object.keys(errors).length > 0) {
          setValidationErrors(errors);
          setLoading(false);
          setTimeout(() => {
            const firstError = document.querySelector('[data-validation-error="true"]');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 50);
          return;
        }
        prompt = buildPresentationPromptFromForm(formData, includeImagePlacement, slideCount, presentationMode) + imageContext;
      }

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
    } catch (e: any) {
      setError('Generation failed: ' + e.message);
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
  const removeBullet = (idx: number) => updateSlide('bullets', (cur?.content?.bullets || []).filter((_: any, j: number) => j !== idx));
  const moveSlide = (dir: number) => {
    const ni = sel + dir;
    if (ni < 0 || ni >= slides.length) return;
    const ns = [...slides];
    [ns[sel], ns[ni]] = [ns[ni], ns[sel]];
    setSlides(ns);
    setSel(ni);
  };

  // Image upload handlers
  const handleImageFiles = (files: FileList) => {
    const maxImages = 10;
    const remaining = maxImages - uploadedImages.length;
    const filesToProcess = Array.from(files).slice(0, remaining);
    filesToProcess.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImages(prev => [...prev, {
          id: `img_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          dataUri: reader.result as string,
          filename: file.name,
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleImageFiles(e.dataTransfer.files);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleImageFiles(e.target.files);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const removeUploadedImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const hasBullets = cur && (['objectives', 'instruction', 'assessment'].includes(cur.layout) || (cur.content?.bullets?.length || 0) > 0);
  const hasBody = cur && (['hook', 'activity', 'closing'].includes(cur.layout) || cur.content?.body !== undefined);

  // Image generation for a slide
  const generateSlideImage = async (slideIdx: number) => {
    const s = slides[slideIdx];
    if (!s) return;
    setImageLoading(prev => ({ ...prev, [slideIdx]: true }));
    try {
      const styleHint = ALL_STYLES.find(st => st.id === styleId);
      const styleName = styleHint?.label || 'fun';
      const sceneDesc = s.content.imageScene || s.content.body || s.content.bullets?.join(', ') || s.content.headline || '';
      const prompt = `${styleName} style illustration for children: ${sceneDesc}. Cartoon, colorful, kid-friendly, educational, no text, no words, no letters`;
      const negativePrompt = 'text, words, letters, numbers, writing, labels, captions, watermark, signature, adult content, scary, violent, realistic photo';
      const placement = s.content.imagePlacement && s.content.imagePlacement !== 'none'
        ? s.content.imagePlacement
        : defaultPlacementForLayout(s.layout, slideIdx);
      const dims = imageDimensionsForPlacement(placement);
      const imgRes = await imageApi.generateImageBase64({
        prompt,
        negativePrompt,
        width: dims.width,
        height: dims.height,
      });
      if (imgRes.success && imgRes.imageData) {
        setSlides(prev => prev.map((sl, i) => i === slideIdx ? { ...sl, content: { ...sl.content, image: imgRes.imageData, imagePlacement: placement } } : sl));
      }
    } catch (e: any) {
      console.error('Image generation failed:', e);
    }
    setImageLoading(prev => ({ ...prev, [slideIdx]: false }));
  };

  // Batch image generation — only for slides with imageScene descriptions
  const generateAllImages = async () => {
    // Determine which slides need images:
    // 1. Slides with imageScene (LLM followed the prompt)
    // 2. Fallback: slides with imagePlacement set and not 'none' (LLM set placement but not scene)
    // 3. Legacy: if neither field exists, generate for ~half the slides
    const hasScenes = slides.some(s => s.content.imageScene);
    const hasPlacements = slides.some(s => s.content.imagePlacement && s.content.imagePlacement !== 'none');

    let slidesNeedingImages: Array<{ slide: Slide; index: number }>;

    if (hasScenes) {
      slidesNeedingImages = slides
        .map((s, i) => ({ slide: s, index: i }))
        .filter(({ slide }) => slide.content.imageScene && !slide.content.image);

      if (slidesNeedingImages.length === 0) {
        slidesNeedingImages = slides
          .map((s, i) => ({ slide: s, index: i }))
          .filter(({ slide }) => slide.content.imageScene);
      }
    } else if (hasPlacements) {
      // LLM set imagePlacement but not imageScene — use placement as proxy
      slidesNeedingImages = slides
        .map((s, i) => ({ slide: s, index: i }))
        .filter(({ slide }) => slide.content.imagePlacement && slide.content.imagePlacement !== 'none' && !slide.content.image);

      if (slidesNeedingImages.length === 0) {
        slidesNeedingImages = slides
          .map((s, i) => ({ slide: s, index: i }))
          .filter(({ slide }) => slide.content.imagePlacement && slide.content.imagePlacement !== 'none');
      }
    } else {
      // Legacy: no imageScene or imagePlacement — generate for ~half (skip objectives, closing)
      const skipLayouts = ['objectives', 'closing'];
      slidesNeedingImages = slides
        .map((s, i) => ({ slide: s, index: i }))
        .filter(({ slide }) => !skipLayouts.includes(slide.layout) && !slide.content.image);

      if (slidesNeedingImages.length === 0) {
        slidesNeedingImages = slides
          .map((s, i) => ({ slide: s, index: i }))
          .filter(({ slide }) => !skipLayouts.includes(slide.layout));
      }
    }

    if (slidesNeedingImages.length === 0) return;

    // Apply max images cap
    if (maxImages > 0 && slidesNeedingImages.length > maxImages) {
      slidesNeedingImages = slidesNeedingImages.slice(0, maxImages);
    }

    setBatchImageProgress({ current: 0, total: slidesNeedingImages.length, generating: true });

    const styleHint = ALL_STYLES.find(st => st.id === styleId);
    const styleName = styleHint?.label || 'fun';

    for (let i = 0; i < slidesNeedingImages.length; i++) {
      const { slide, index } = slidesNeedingImages[i];
      setBatchImageProgress(prev => ({ ...prev, current: i + 1 }));

      try {
        // Use imageScene directly — no separate LLM prompt-generation call needed
        const sceneDesc = slide.content.imageScene || slide.content.body || slide.content.bullets?.join(', ') || slide.content.headline || '';
        const prompt = presentationMode === 'professional'
          ? `${styleName} style professional illustration: ${sceneDesc}. Clean, modern, minimalist, corporate, high quality, no text, no words, no letters`
          : `${styleName} style illustration for children: ${sceneDesc}. Cartoon, colorful, kid-friendly, educational, no text, no words, no letters`;
        const negativePrompt = presentationMode === 'professional'
          ? 'text, words, letters, numbers, writing, labels, captions, watermark, signature, childish, cartoon, clipart, low quality'
          : 'text, words, letters, numbers, writing, labels, captions, watermark, signature, adult content, scary, violent, realistic photo';
        const placement = slide.content.imagePlacement && slide.content.imagePlacement !== 'none'
          ? slide.content.imagePlacement
          : defaultPlacementForLayout(slide.layout, index);
        const dims = imageDimensionsForPlacement(placement);
        const imgRes = await imageApi.generateImageBase64({
          prompt,
          negativePrompt,
          width: dims.width,
          height: dims.height,
        });
        if (imgRes.success && imgRes.imageData) {
          setSlides(prev => prev.map((sl, idx) => idx === index ? { ...sl, content: { ...sl.content, image: imgRes.imageData, imagePlacement: placement } } : sl));
        }
      } catch (e: any) {
        console.error('Batch image generation failed for slide:', index, e);
      }
    }

    setBatchImageProgress({ current: 0, total: 0, generating: false });
  };

  // PPTX Export
  const exportPPTX = async () => {
    const pptxgen = (await import('pptxgenjs')).default;
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
        const placement = c.imagePlacement || 'background';
        if (placement === 'background') {
          s.addImage({ data: c.image, x: 0, y: 0, w: '100%', h: '100%', sizing: { type: 'cover', w: 13.33, h: 7.5 } });
          s.addShape('rect' as any, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: bgHex, transparency: 60 } });
        } else if (placement === 'half') {
          s.addImage({ data: c.image, x: 6.67, y: 0, w: 6.66, h: 7.5, sizing: { type: 'cover', w: 6.66, h: 7.5 } });
        } else if (placement === 'right') {
          s.addImage({ data: c.image, x: 8.66, y: 0, w: 4.67, h: 7.5, sizing: { type: 'cover', w: 4.67, h: 7.5 } });
        } else if (placement === 'left') {
          s.addImage({ data: c.image, x: 0, y: 0, w: 4.67, h: 7.5, sizing: { type: 'cover', w: 4.67, h: 7.5 } });
        } else if (placement === 'top') {
          s.addImage({ data: c.image, x: 0, y: 0, w: 13.33, h: 3.0, sizing: { type: 'cover', w: 13.33, h: 3.0 } });
        } else if (placement === 'bottom-right') {
          s.addImage({ data: c.image, x: 9.33, y: 4.5, w: 3.5, h: 3, sizing: { type: 'cover', w: 3.5, h: 3 } });
        }
      }

      // Adjust text bounds based on image placement to prevent overlap
      const pl = c.imagePlacement || '';
      const txOff = pl === 'left' ? 4.8 : 0;
      const txBase = 0.5 + txOff;
      const txW = pl === 'right' ? 7.5 : pl === 'half' ? 5.5 : pl === 'left' ? 7.5 : 9.5;
      const tyOff = pl === 'top' ? 3.2 : 0;

      if (slide.layout === 'title') {
        if (c.badge) s.addText(c.badge, { x: txBase, y: 0.65 + tyOff, w: Math.min(5, txW), h: 0.25, fontSize: 9, color: pc, bold: true, charSpacing: 2 });
        s.addText(c.headline || '', { x: txBase, y: 1.05 + tyOff, w: txW, h: 1.5, fontSize: 34, bold: true, color: tc, fontFace: 'Georgia' });
        if (c.subtitle) s.addText(c.subtitle, { x: txBase, y: 2.7 + tyOff, w: Math.min(9, txW), h: 0.4, fontSize: 13, color: '777777' });
      } else {
        if (c.badge) s.addText(c.badge, { x: txBase, y: 0.38 + tyOff, w: Math.min(4, txW), h: 0.22, fontSize: 9, color: pc, bold: true });
        s.addText(c.headline || '', { x: txBase, y: (c.badge ? 0.68 : 0.48) + tyOff, w: txW, h: 0.85, fontSize: 20, bold: true, color: tc, fontFace: 'Georgia' });
        if (c.body) s.addText(c.body, { x: txBase, y: 1.65 + tyOff, w: Math.min(9, txW), h: 1.5, fontSize: 13, color: tc, wrap: true } as any);
        (c.bullets || []).forEach((b, i) => s.addText(`•  ${b}`, { x: txBase + 0.2, y: 1.62 + tyOff + i * 0.52, w: Math.min(8.8, txW - 0.2), h: 0.48, fontSize: 12, color: tc, wrap: true } as any));
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
        <div className="border-b border-theme p-4 flex items-center justify-between" style={{ borderBottomColor: `${tabColor}33` }}>
          <div>
            <h2 className="text-xl font-semibold text-theme-heading flex items-center">
              <Icon icon={Presentation01Icon} className="w-5 inline mr-2" style={{ color: tabColor }} />
              Presentation Builder
            </h2>
            <p className="text-sm text-theme-hint mt-0.5">Create slide decks from scratch or from existing lesson plans</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowHistory(!showHistory); if (!showHistory) { loadPresentationHistory(); loadDrafts(); } }}
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
                      data-validation-error={validationErrors.subject ? 'true' : undefined}
                      className={`w-full px-3 py-2 rounded-lg bg-theme-secondary border border-theme-border text-theme-heading text-sm focus:ring-2 focus:outline-none ${validationErrors.subject ? 'validation-error' : ''}`}
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
                      data-validation-error={validationErrors.gradeLevel ? 'true' : undefined}
                      className={`w-full px-3 py-2 rounded-lg bg-theme-secondary border border-theme-border text-theme-heading text-sm focus:ring-2 focus:outline-none ${validationErrors.gradeLevel ? 'validation-error' : ''}`}
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
                    onChange={v => updateField('topic', v)}
                    placeholder="e.g. Light Interactions, Fractions, Community Helpers..."
                    data-validation-error={validationErrors.topic ? 'true' : undefined}
                    className={`w-full px-3 py-2 rounded-lg bg-theme-secondary border border-theme-border text-theme-heading text-sm focus:ring-2 focus:outline-none ${validationErrors.topic ? 'validation-error' : ''}`}
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
                    onChange={v => updateField('additionalInstructions', v)}
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

            {/* Presentation Mode Toggle */}
            <div className="space-y-2 p-4 rounded-xl bg-theme-secondary border border-theme-border">
              <div className="text-sm font-semibold text-theme-heading flex items-center gap-2">
                <Icon icon={Presentation01Icon} className="w-4" style={{ color: tabColor }} />
                Presentation Style
              </div>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: 'kids' as PresentationMode, label: 'For Students', desc: 'Interactive, engaging, classroom-ready' },
                  { id: 'professional' as PresentationMode, label: 'Professional', desc: 'Formal, structured, information-dense' },
                ] as const).map(opt => {
                  const active = presentationMode === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setPresentationMode(opt.id)}
                      className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-lg border-2 transition-all text-center"
                      style={{
                        borderColor: active ? tabColor : 'var(--border-color, #333)',
                        background: active ? `${tabColor}14` : 'transparent',
                      }}
                    >
                      <span className="text-xs font-bold" style={{ color: active ? tabColor : undefined }}>{opt.label}</span>
                      <span className="text-[10px] text-theme-muted leading-tight">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image Mode + Slide Count */}
            <div className="space-y-4 p-4 rounded-xl bg-theme-secondary border border-theme-border">
              {/* Image mode selector */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-theme-heading flex items-center gap-2">
                  <Icon icon={Image01Icon} className="w-4" style={{ color: tabColor }} />
                  Images
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: 'none' as ImageMode, label: 'No Images', desc: 'Text only' },
                    { id: 'ai' as ImageMode, label: 'AI Generated', desc: hasDiffusion ? 'Auto-create images' : 'Tier 3 required' },
                    { id: 'my-images' as ImageMode, label: 'My Images', desc: 'Upload your own' },
                  ] as const).map(opt => {
                    const disabled = opt.id === 'ai' && !hasDiffusion;
                    const active = imageMode === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => !disabled && setImageMode(opt.id)}
                        disabled={disabled}
                        className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-lg border-2 transition-all text-center disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          borderColor: active ? tabColor : 'var(--border-color, #333)',
                          background: active ? `${tabColor}14` : 'transparent',
                        }}
                      >
                        <span className="text-xs font-bold" style={{ color: active ? tabColor : undefined }}>{opt.label}</span>
                        <span className="text-[10px] text-theme-muted leading-tight">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload area for my-images mode */}
              {imageMode === 'my-images' && (
                <div className="space-y-3">
                  <div
                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
                    onDragEnter={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleImageDrop}
                    onClick={() => imageInputRef.current?.click()}
                    className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all"
                    style={{
                      borderColor: dragOver ? tabColor : `${tabColor}40`,
                      background: dragOver ? `${tabColor}12` : 'transparent',
                    }}
                  >
                    <Icon icon={Image01Icon} className="w-7 mx-auto mb-1.5" style={{ color: `${tabColor}66` }} />
                    <div className="text-xs font-semibold text-theme-heading">Drop images here or click to browse</div>
                    <div className="text-[10px] text-theme-muted mt-0.5">PNG, JPG — up to 10 images</div>
                    <input ref={imageInputRef} type="file" accept="image/*" multiple hidden onChange={handleImageSelect} />
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {uploadedImages.map(img => (
                        <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-video border border-theme-border">
                          <img loading="lazy" src={img.dataUri} alt={img.filename} className="w-full h-full object-cover" />
                          <button
                            onClick={(e) => { e.stopPropagation(); removeUploadedImage(img.id); }}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            <Icon icon={Cancel01Icon} className="w-3" style={{ color: '#fff' }} />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 px-1.5 py-0.5 bg-black/50 text-[8px] text-white truncate">{img.filename}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Slide count slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-theme-heading">Slide Count</span>
                  <span className="text-sm font-bold" style={{ color: tabColor }}>{slideCount}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={15}
                  value={slideCount}
                  onChange={e => setSlideCount(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${tabColor} 0%, ${tabColor} ${((slideCount - 5) / 10) * 100}%, var(--bg-tertiary, #333) ${((slideCount - 5) / 10) * 100}%, var(--bg-tertiary, #333) 100%)`,
                  }}
                />
                <div className="flex justify-between text-[10px] text-theme-muted">
                  <span>5 slides</span>
                  <span>15 slides</span>
                </div>
              </div>

              {/* Max images control — only for AI image mode */}
              {imageMode === 'ai' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-theme-heading">Max Images</span>
                    <span className="text-sm font-bold" style={{ color: tabColor }}>
                      {maxImages === 0 ? 'Auto' : maxImages}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={slideCount}
                    value={maxImages}
                    onChange={e => setMaxImages(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${tabColor} 0%, ${tabColor} ${(maxImages / slideCount) * 100}%, var(--bg-tertiary, #333) ${(maxImages / slideCount) * 100}%, var(--bg-tertiary, #333) 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-[10px] text-theme-muted">
                    <span>Auto (AI decides)</span>
                    <span>{slideCount} (all slides)</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Icon icon={Loading02Icon} className="w-5 inline mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Icon icon={Presentation01Icon} className="w-5 inline mr-2" />
                    Generate Presentation
                  </>
                )}
              </button>
            </div>

            {/* Streaming progress in input view */}
            {loading && (
              <div className="space-y-3">
                <div className="rounded-lg border border-theme bg-theme-secondary px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon={Loading02Icon} className="w-3.5 animate-spin" style={{ color: tabColor }} />
                    <span className="text-sm font-semibold text-theme-heading">
                      {generationPhase === 'analyzing'
                        ? 'Analyzing your images...'
                        : streamingSlides.length > 0
                          ? `Building slide ${streamingSlides.length + 1} of ~${slideCount}...`
                          : 'Preparing your presentation...'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: slideCount }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-1.5 rounded-full transition-all duration-300"
                        style={{ background: i < streamingSlides.length ? tabColor : `${tabColor}22` }}
                      />
                    ))}
                  </div>
                </div>
                <style>{`
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
              ) : drafts.length === 0 && presentationHistory.length === 0 ? (
                <div className="text-center text-theme-muted mt-8">
                  <Icon icon={Presentation01Icon} className="w-12 mx-auto mb-2" style={{ color: 'var(--sidebar-text-muted)' }} />
                  <p className="text-sm">No saved presentations yet</p>
                </div>
              ) : (
                <>
                  {drafts.length > 0 && (
                    <>
                      <button
                        onClick={() => setDraftsExpanded(!draftsExpanded)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-theme-muted uppercase tracking-wider w-full text-left py-1 hover:text-theme-heading transition"
                      >
                        <span className="transition-transform" style={{ display: 'inline-block', transform: draftsExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>&#9654;</span>
                        Drafts ({drafts.length})
                      </button>
                      {draftsExpanded && drafts.map(draft => (
                        <div
                          key={draft.id}
                          onClick={() => loadDraft(draft)}
                          className="p-3 rounded-lg cursor-pointer transition group hover:bg-amber-500/10 bg-theme-tertiary border border-dashed border-amber-500/40"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500">Draft</span>
                              </div>
                              <p className="text-sm font-medium text-theme-heading line-clamp-2">
                                {draft.title}
                              </p>
                              <p className="text-xs text-theme-muted mt-1">
                                {new Date(draft.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={e => { e.stopPropagation(); deleteDraft(draft.id); }}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 transition"
                              title="Delete draft"
                            >
                              <Icon icon={Delete02Icon} className="w-4" style={{ color: '#ef4444' }} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {presentationHistory.length > 0 && (
                        <div className="border-t border-theme my-2" />
                      )}
                    </>
                  )}
                  {[...presentationHistory].reverse().map(pres => (
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
                  ))}
                </>
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
      <div className="flex-shrink-0 p-4 border-b border-theme">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setView('input')}
              className="flex items-center px-3.5 py-1.5 text-[13.5px] bg-theme-tertiary text-theme-label rounded-lg hover:bg-theme-hover transition border border-theme-strong"
            >
              <Icon icon={ArrowLeft01Icon} className="w-3.5 inline mr-1.5" /> Back
            </button>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-theme-heading flex items-center">
                <Icon icon={Presentation01Icon} className="w-5 inline mr-2" />
                Preview
              </h3>
              <div className="text-xs text-theme-muted truncate">
                {formData.topic || 'Presentation'}{formData.subject ? ` · Grade ${formData.gradeLevel} · ${formData.subject}` : ''}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowHistory(!showHistory); if (!showHistory) { loadPresentationHistory(); loadDrafts(); } }}
              className="p-2 rounded-lg hover:bg-theme-hover transition"
              title="Presentation History"
            >
              <Icon icon={Clock01Icon} className="w-5" style={{ color: 'var(--sidebar-text-muted)' }} />
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-theme-secondary border border-theme rounded-lg">
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{
                background: presentationMode === 'professional' ? '#6366f120' : `${tabColor}20`,
                color: presentationMode === 'professional' ? '#818cf8' : tabColor,
              }}>
                {presentationMode === 'professional' ? 'PRO' : 'KIDS'}
              </span>
              <div className="w-2 h-2 rounded-full" style={{ background: primaryColor }} />
              <span className="text-xs font-semibold" style={{ color: primaryColor }}>{ALL_STYLES.find(s => s.id === styleId)?.label}</span>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center px-3.5 py-1.5 text-[13.5px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Icon icon={Loading02Icon} className="w-3.5 inline mr-1.5" />
              {loading ? 'Generating...' : 'Regenerate'}
            </button>
            {slides.length > 0 && (
              <>
                <button
                  onClick={savePresentation}
                  disabled={saveStatus === 'saving'}
                  className="flex items-center px-3.5 py-1.5 text-[13.5px] bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  <Icon icon={SaveIcon} className="w-3.5 inline mr-1.5" />
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save'}
                </button>
                <button
                  onClick={exportPPTX}
                  className="flex items-center px-3.5 py-1.5 text-[13.5px] bg-theme-tertiary text-theme-label rounded-lg hover:bg-theme-hover transition border border-theme-strong"
                >
                  <Icon icon={Download01Icon} className="w-3.5 inline mr-1.5" /> PPTX
                </button>
                {imageMode === 'ai' && hasDiffusion && (
                  <button
                    onClick={generateAllImages}
                    disabled={batchImageProgress.generating}
                    className="flex items-center px-3.5 py-1.5 text-[13.5px] rounded-lg hover:opacity-90 transition disabled:opacity-50"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`, color: '#fff' }}
                  >
                    <Icon icon={Image01Icon} className="w-3.5 inline mr-1.5" />
                    {batchImageProgress.generating
                      ? `Images ${batchImageProgress.current}/${batchImageProgress.total}...`
                      : slides.every(s => s.content.image) ? 'Regenerate All Images' : 'Generate All Images'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Slide list */}
        <div className="w-[170px] flex-shrink-0 border-r border-theme bg-theme-secondary flex flex-col">
          <div className="px-2.5 pt-2.5 pb-1.5 text-[9px] font-extrabold text-theme-muted uppercase tracking-wider flex items-center justify-between">
            <span>Slides</span>
            {slides.length > 0 && <span style={{ color: primaryColor }}>{slides.length}</span>}
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1.5">
            {slides.map((slide, i) => (
              <Thumbnail key={slide.id || i} slide={slide} theme={theme} selected={i === sel} onClick={() => setSel(i)} index={i} styleId={styleId} imageMode={imageMode} />
            ))}
            {loading && Array.from({ length: Math.max(0, slideCount - slides.length) }).map((_, i) => (
              <div key={`skel-${i}`} className="rounded overflow-hidden" style={{ width: '100%', height: 82, background: 'var(--bg-secondary, #1e1e1e)', border: '1px solid var(--border-color, #333)' }}>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="rounded" style={{ width: '50%', height: 6, background: `${primaryColor}20`, animation: 'pulse 1.5s ease-in-out infinite' }} />
                </div>
              </div>
            ))}
          </div>
          {slides.length > 0 && !loading && (
            <div className="flex-shrink-0 px-2 py-2 border-t border-theme flex items-center justify-center gap-1.5">
              <button onClick={() => moveSlide(-1)} disabled={sel === 0} className="flex items-center px-2 py-1 text-[10px] rounded bg-theme-tertiary text-theme-label border border-theme-strong hover:bg-theme-hover transition disabled:opacity-30">
                <Icon icon={ArrowLeft01Icon} className="w-2.5 inline" />
              </button>
              <span className="text-[10px] text-theme-muted min-w-[36px] text-center font-medium">{sel + 1}/{slides.length}</span>
              <button onClick={() => moveSlide(1)} disabled={sel >= slides.length - 1} className="flex items-center px-2 py-1 text-[10px] rounded bg-theme-tertiary text-theme-label border border-theme-strong hover:bg-theme-hover transition disabled:opacity-30">
                <Icon icon={ArrowRight01Icon} className="w-2.5 inline" />
              </button>
            </div>
          )}
        </div>

        {/* CENTER: Main stage */}
        <div ref={stageRef} className="flex-1 flex flex-col items-center justify-center gap-2 p-3 overflow-hidden">
          {loading && slides.length === 0 ? (
            <SkeletonStage
              primaryColor={primaryColor}
              streamingText={streamingContent || ''}
              parsedCount={streamingSlides.length}
              stageWidth={stageWidth}
              expectedSlides={slideCount}
            />
          ) : slides.length === 0 ? (
            <div className="flex flex-col items-center gap-4">
              <Icon icon={Presentation01Icon} className="w-10" style={{ color: 'var(--sidebar-text-muted)', opacity: 0.4 }} />
              <div className="text-theme-muted text-sm">No slides generated yet</div>
              <button onClick={handleGenerate} disabled={loading} className="flex items-center px-5 py-2 text-[13.5px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                <Icon icon={Presentation01Icon} className="w-3.5 inline mr-1.5" />
                Generate Slides
              </button>
            </div>
          ) : (
            <>
              {cur && (
                <div className="rounded-lg overflow-hidden relative" style={{ boxShadow: `0 4px 32px ${primaryColor}18` }}>
                  <SlideCanvas slide={cur} theme={theme} width={stageWidth} styleId={styleId} imageMode={imageMode} slideIndex={sel} />
                  {loading && (
                    <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon icon={Loading02Icon} className="w-3 animate-spin" style={{ color: '#fff' }} />
                        <span className="text-[10px] font-bold text-white">
                          {generationPhase === 'analyzing'
                            ? 'Analyzing your images...'
                            : `Building slide ${slides.length + 1} of ~${slideCount}...`}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: slideCount }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 h-1.5 rounded-full transition-all duration-500"
                            style={{ background: i < slides.length ? '#fff' : 'rgba(255,255,255,0.25)' }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {batchImageProgress.generating && (
                    <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon icon={Loading02Icon} className="w-3 animate-spin" style={{ color: '#fff' }} />
                        <span className="text-[10px] font-bold text-white">
                          Generating image {batchImageProgress.current} of {batchImageProgress.total}...
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: batchImageProgress.total }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 h-1.5 rounded-full transition-all duration-500"
                            style={{ background: i < batchImageProgress.current ? '#fff' : 'rgba(255,255,255,0.25)' }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {error && <div className="text-red-400 text-sm max-w-[340px] text-center">{error}</div>}
        </div>

        {/* RIGHT: Tabs (Colours | Edit Slide | Layouts) */}
        <div className="w-[258px] flex-shrink-0 border-l border-theme bg-theme-secondary flex flex-col">
          {/* Tab switcher */}
          <div className="flex border-b border-theme flex-shrink-0">
            {(['color', 'edit', 'layouts'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wide transition-all border-b-2 ${rightTab === tab ? '' : 'border-transparent text-theme-muted'}`}
                style={rightTab === tab ? { color: primaryColor, borderBottomColor: primaryColor, background: `${primaryColor}12` } : undefined}
              >
                {tab === 'color' ? 'Colours' : tab === 'edit' ? 'Edit Slide' : 'Themes'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3.5">
            {rightTab === 'color' && (
              <ColorPicker primary={primaryColor} bg={bgColor} onPrimary={setPrimaryColor} onBg={setBgColor} theme={theme} styleId={styleId} />
            )}
            {rightTab === 'layouts' && (
              <div className="space-y-0.5">
                <div className="px-1 py-1.5">
                  <span className="text-[10px] font-extrabold text-theme-muted uppercase tracking-wider">
                    {presentationMode === 'professional' ? 'Professional Themes' : 'Kids Themes'}
                  </span>
                </div>
                {filteredStyles.map(s => {
                  const active = styleId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setStyleId(s.id)}
                      className="w-full px-2.5 py-2 text-left flex flex-col gap-0.5 border-l-[3px] rounded-r transition-all"
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

                {/* Slide image display */}
                {cur.content.image && (
                  <div className="mt-4 pt-3.5 border-t border-theme-border">
                    <label className="block text-[10px] font-bold text-theme-muted uppercase tracking-wide mb-1.5">Slide Image</label>
                    <div className="space-y-2">
                      <img loading="lazy" src={cur.content.image} alt="Slide" className="w-full rounded border border-theme-border" />
                      <button
                        onClick={() => updateSlide('image', undefined)}
                        className="px-2 py-1.5 rounded text-xs bg-theme-primary border border-theme-border text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
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
            ) : drafts.length === 0 && presentationHistory.length === 0 ? (
              <div className="text-center text-theme-muted mt-8">
                <Icon icon={Presentation01Icon} className="w-12 mx-auto mb-2" style={{ color: 'var(--sidebar-text-muted)' }} />
                <p className="text-sm">No saved presentations yet</p>
              </div>
            ) : (
              <>
                {drafts.length > 0 && (
                  <>
                    <button
                      onClick={() => setDraftsExpanded(!draftsExpanded)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-theme-muted uppercase tracking-wider w-full text-left py-1 hover:text-theme-heading transition"
                    >
                      <span className="transition-transform" style={{ display: 'inline-block', transform: draftsExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>&#9654;</span>
                      Drafts ({drafts.length})
                    </button>
                    {draftsExpanded && drafts.map(draft => (
                      <div
                        key={draft.id}
                        onClick={() => loadDraft(draft)}
                        className="p-3 rounded-lg cursor-pointer transition group hover:bg-amber-500/10 bg-theme-tertiary border border-dashed border-amber-500/40"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500">Draft</span>
                            </div>
                            <p className="text-sm font-medium text-theme-heading line-clamp-2">
                              {draft.title}
                            </p>
                            <p className="text-xs text-theme-muted mt-1">
                              {new Date(draft.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); deleteDraft(draft.id); }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 transition"
                            title="Delete draft"
                          >
                            <Icon icon={Delete02Icon} className="w-4" style={{ color: '#ef4444' }} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {presentationHistory.length > 0 && (
                      <div className="border-t border-theme my-2" />
                    )}
                  </>
                )}
                {[...presentationHistory].reverse().map(pres => (
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
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
