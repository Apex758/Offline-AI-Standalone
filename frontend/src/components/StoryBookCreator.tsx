// @refresh reset
import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Loading03IconData from '@hugeicons/core-free-icons/Loading03Icon';
import ArrowLeft01IconData from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Tick01IconData from '@hugeicons/core-free-icons/Tick01Icon';
import Delete02IconData from '@hugeicons/core-free-icons/Delete02Icon';
import Add01IconData from '@hugeicons/core-free-icons/Add01Icon';
import PlayIconData from '@hugeicons/core-free-icons/PlayIcon';
import PauseIconData from '@hugeicons/core-free-icons/PauseIcon';
import Download01IconData from '@hugeicons/core-free-icons/Download01Icon';
import Mic01IconData from '@hugeicons/core-free-icons/Mic01Icon';
import Upload01IconData from '@hugeicons/core-free-icons/Upload01Icon';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';
import RefreshIconData from '@hugeicons/core-free-icons/RefreshIcon';
import Image01IconData from '@hugeicons/core-free-icons/Image01Icon';
import Settings01IconData from '@hugeicons/core-free-icons/Settings01Icon';
import QuestionIconData from '@hugeicons/core-free-icons/QuestionIcon';
import EyeIconData from '@hugeicons/core-free-icons/EyeIcon';
import CheckmarkSquare02IconData from '@hugeicons/core-free-icons/CheckmarkSquare02Icon';
import UserIconData from '@hugeicons/core-free-icons/UserIcon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import Presentation01IconData from '@hugeicons/core-free-icons/Presentation01Icon';
import Video01IconData from '@hugeicons/core-free-icons/Video01Icon';
import FileSpreadsheetIconData from '@hugeicons/core-free-icons/FileSpreadsheetIcon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import FloppyDiskIconData from '@hugeicons/core-free-icons/FloppyDiskIcon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

import { useWebSocket } from '../contexts/WebSocketContext';
import { useSettings } from '../contexts/SettingsContext';
import { useCapabilities } from '../contexts/CapabilitiesContext';
import { useTTS, useSTT } from '../hooks/useVoice';
import ImageModeSelector from './ui/ImageModeSelector';
import CurriculumAlignmentFields from './ui/CurriculumAlignmentFields';
import KidsStorybookSkeletonDay from './KidsStorybookSkeletonDay';
import KidsStorybookSkeletonNight from './KidsStorybookSkeletonNight';
import SmartInput from './SmartInput';
import SmartTextArea from './SmartTextArea';
import { filterSubjects, filterGrades } from '../data/teacherConstants';
import { buildStorybookPrompt, buildNarrativePrompt, buildStructurePromptTemplate } from '../utils/storybookPromptBuilder';
import { BUNDLED_SCENES, findBestScene, getScenesByCategory, SCENE_CATEGORY_LABELS } from '../data/storybookScenes';
import { compressTransparentImage } from '../utils/imageCompression';
import {
  exportStorybookPDF,
  exportStorybookPPTX,
  exportAnimatedHTML,
  type AnimatedHTMLProgress,
} from '../utils/storybookExportUtils';
import type {
  StorybookFormData, ParsedStorybook, StoryPage, SpeakerConfig,
  VoiceName, SpeakerRole, ComprehensionQuestion, BundledScene,
  SavedStorybook, StorybookExportSettings,
} from '../types/storybook';
import type { ImageMode } from '../types';
import {
  getSavedStorybooks, saveStorybook, deleteSavedStorybook,
  getExportSettings, setExportSettings, DEFAULT_EXPORT_SETTINGS,
} from '../utils/storybookStorage';

// ─── Constants ────────────────────────────────────────────────────────────────

const WS_ENDPOINT = '/ws/storybook';

const VOICE_LABELS: Record<VoiceName, string> = {
  lessac: 'Lessac (Female)',
  ryan:   'Ryan (Male)',
  amy:    'Amy (Female)',
};

const DEFAULT_SPEAKERS: SpeakerConfig[] = [
  { role: 'narrator', voice: 'lessac' },
];

const DEFAULT_FORM: StorybookFormData = {
  title: '',
  description: '',
  gradeLevel: 'K',
  subject: '',
  pageCount: 8,
  imageMode: 'none',
  speakerCount: 1,
  speakers: DEFAULT_SPEAKERS,
  useCurriculum: true,
  strand: '',
  essentialOutcomes: '',
  specificOutcomes: '',
};

// ─── Progressive JSON Parser ──────────────────────────────────────────────────

function tryParsePartialPages(raw: string): StoryPage[] {
  const pages: StoryPage[] = [];
  const arrStart = raw.indexOf('"pages"');
  if (arrStart === -1) return pages;
  const bracketStart = raw.indexOf('[', arrStart);
  if (bracketStart === -1) return pages;

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
          if (obj.pageNumber && Array.isArray(obj.textSegments)) {
            pages.push({
              pageNumber: obj.pageNumber,
              textSegments: obj.textSegments,
              sceneId: obj.sceneId || 'default',
              characterScene: obj.characterScene,
              imagePlacement: obj.imagePlacement || 'none',
              characterAnimation: obj.characterAnimation || 'fadeIn',
              textAnimation: obj.textAnimation || 'fadeIn',
            });
          }
        } catch { /* incomplete JSON — skip */ }
        objStart = -1;
      }
    }
  }
  return pages;
}

function tryParseFullBook(raw: string): ParsedStorybook | null {
  try {
    // Find JSON boundaries
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    const json = raw.substring(start, end + 1);
    const parsed = JSON.parse(json);
    if (parsed.pages && Array.isArray(parsed.pages)) return parsed as ParsedStorybook;
    return null;
  } catch {
    return null;
  }
}

// ─── Speaker Validation ──────────────────────────────────────────────────────

/**
 * Validate and fix the generated book to ensure it respects the speaker config.
 * - Removes dialogue from speakers that don't exist in the config
 * - Reassigns unknown speaker names to narrator
 * - Ensures voiceAssignments match the form's speaker setup
 */
function validateSpeakers(book: ParsedStorybook, formData: StorybookFormData): ParsedStorybook {
  const allowedSpeakers = new Set<string>(['narrator']);
  const voiceAssignments: Record<string, VoiceName> = { narrator: formData.speakers[0]?.voice || 'lessac' };

  for (const sp of formData.speakers) {
    if (sp.role !== 'narrator' && sp.characterName) {
      allowedSpeakers.add(sp.characterName);
      voiceAssignments[sp.characterName] = sp.voice;
    }
  }

  // If only narrator (speakerCount === 1), collapse all dialogue to narrator
  const narratorOnly = formData.speakerCount === 1;

  const pages = book.pages.map(page => ({
    ...page,
    textSegments: page.textSegments.map(seg => {
      if (narratorOnly) {
        return { ...seg, speaker: 'narrator' };
      }
      if (!allowedSpeakers.has(seg.speaker)) {
        // Try case-insensitive match
        const match = [...allowedSpeakers].find(
          s => s.toLowerCase() === seg.speaker.toLowerCase()
        );
        return { ...seg, speaker: match || 'narrator' };
      }
      return seg;
    }),
  }));

  // Fix characters array to match allowed speakers
  const characters = [...allowedSpeakers].filter(s => s !== 'narrator');

  return {
    ...book,
    pages,
    characters: characters.length > 0 ? characters : book.characters,
    voiceAssignments,
  };
}

// ─── History Panel ───────────────────────────────────────────────────────────

function HistoryPanel({
  onLoad,
  onClose,
  accentColor,
}: {
  onLoad: (saved: SavedStorybook) => void;
  onClose: () => void;
  accentColor: string;
}) {
  const [items, setItems] = React.useState<SavedStorybook[]>(() => getSavedStorybooks());

  const handleDelete = (id: string) => {
    deleteSavedStorybook(id);
    setItems(getSavedStorybooks());
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      + ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-theme">
          <h3 className="font-semibold text-theme-heading flex items-center gap-2">
            <Icon icon={Clock01IconData} className="w-5" style={{ color: accentColor }} />
            Storybook History
          </h3>
          <button onClick={onClose} className="text-theme-muted hover:text-theme-heading">
            <Icon icon={Cancel01IconData} className="w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-theme-muted">
              <Icon icon={BookOpen01IconData} className="w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No saved storybooks yet.</p>
              <p className="text-xs mt-1">Save a draft or complete a storybook to see it here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-theme hover:bg-theme-secondary transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-theme-heading truncate">
                        {item.formData.title || 'Untitled'}
                      </p>
                      <span
                        className="shrink-0 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full"
                        style={{
                          background: item.status === 'completed' ? '#dcfce7' : '#fef3c7',
                          color: item.status === 'completed' ? '#166534' : '#92400e',
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-theme-muted mt-0.5">
                      {item.formData.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${item.formData.gradeLevel}`}
                      {item.formData.subject && ` · ${item.formData.subject}`}
                      {item.parsedBook && ` · ${item.parsedBook.pages.length} pages`}
                      {' · '}{formatDate(item.savedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onLoad(item)}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg text-white"
                      style={{ background: accentColor }}
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Icon icon={Delete02IconData} className="w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Export Settings Panel ────────────────────────────────────────────────────

function ExportSettingsPanel({
  settings,
  onChange,
  onClose,
  accentColor,
}: {
  settings: StorybookExportSettings;
  onChange: (s: StorybookExportSettings) => void;
  onClose: () => void;
  accentColor: string;
}) {
  const update = <K extends keyof StorybookExportSettings>(key: K, val: StorybookExportSettings[K]) => {
    const next = { ...settings, [key]: val };
    onChange(next);
    setExportSettings(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-theme">
          <h3 className="font-semibold text-theme-heading flex items-center gap-2">
            <Icon icon={Settings01IconData} className="w-5" style={{ color: accentColor }} />
            Export Settings
          </h3>
          <button onClick={onClose} className="text-theme-muted hover:text-theme-heading">
            <Icon icon={Cancel01IconData} className="w-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {/* Default format */}
          <div>
            <label className="block text-sm font-medium text-theme-label mb-1.5">Default Export Format</label>
            <select
              value={settings.defaultFormat}
              onChange={e => update('defaultFormat', e.target.value as 'pdf' | 'pptx' | 'html')}
              className="w-full px-3 py-2 border border-theme-strong rounded-lg text-sm bg-theme"
            >
              <option value="html">Animated HTML</option>
              <option value="pdf">PDF</option>
              <option value="pptx">PowerPoint (PPTX)</option>
            </select>
          </div>

          {/* Include audio */}
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-theme-label">Include Audio in HTML</p>
              <p className="text-xs text-theme-muted">Embed TTS audio in interactive HTML exports</p>
            </div>
            <div
              onClick={() => update('includeAudioInHTML', !settings.includeAudioInHTML)}
              className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${settings.includeAudioInHTML ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${settings.includeAudioInHTML ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
            </div>
          </label>

          {/* Include comprehension questions */}
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-theme-label">Comprehension Questions</p>
              <p className="text-xs text-theme-muted">Include questions page in PDF/PPTX exports</p>
            </div>
            <div
              onClick={() => update('includeComprehensionQuestions', !settings.includeComprehensionQuestions)}
              className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${settings.includeComprehensionQuestions ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${settings.includeComprehensionQuestions ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
            </div>
          </label>
        </div>
        <div className="p-4 border-t border-theme">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: accentColor }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Scene Picker Modal ───────────────────────────────────────────────────────

function ScenePickerModal({
  current, onSelect, onClose, accentColor,
}: {
  current?: string;
  onSelect: (scene: BundledScene) => void;
  onClose: () => void;
  accentColor: string;
}) {
  const byCategory = getScenesByCategory();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-theme">
          <h3 className="font-semibold text-theme-heading">Choose Background Scene</h3>
          <button onClick={onClose} className="text-theme-muted hover:text-theme-heading">
            <Icon icon={Cancel01IconData} className="w-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-4 space-y-5">
          {Object.entries(byCategory).map(([cat, scenes]) => (
            <div key={cat}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-theme-muted mb-2">
                {SCENE_CATEGORY_LABELS[cat]}
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {scenes.map(scene => {
                  const isActive = scene.id === current;
                  return (
                    <button
                      key={scene.id}
                      onClick={() => onSelect(scene)}
                      className="rounded-lg border-2 overflow-hidden text-left transition-all hover:scale-105"
                      style={{ borderColor: isActive ? accentColor : 'transparent' }}
                    >
                      {/* Scene preview — colored placeholder until SVG assets exist */}
                      <div
                        className="h-16 flex items-center justify-center"
                        style={{ background: SCENE_BG_COLORS[cat] || '#e5e7eb' }}
                      >
                        <Icon icon={Image01IconData} className="w-5 opacity-40" />
                      </div>
                      <div className="px-2 py-1">
                        <p className="text-xs font-medium text-theme-heading truncate">{scene.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const SCENE_BG_COLORS: Record<string, string> = {
  outdoors: '#d1fae5',
  indoors: '#fef3c7',
  fantasy: '#ede9fe',
  weather: '#dbeafe',
};

/** Scene category icons using HugeIcons */
function SceneCategoryIcon({ category, className }: { category: string; className?: string }) {
  return <Icon icon={Image01IconData} className={className || 'w-4'} />;
}

// ─── Playback View ────────────────────────────────────────────────────────────

function PlaybackView({
  book,
  onClose,
  accentColor,
}: {
  book: ParsedStorybook;
  onClose: () => void;
  accentColor: string;
}) {
  const [pageIdx, setPageIdx] = useState(0);
  const [phase, setPhase] = useState<'bg' | 'char' | 'text' | 'done'>('bg');
  const [segmentIdx, setSegmentIdx] = useState(0);
  const { speak, stop, isSpeaking } = useTTS();
  const [autoPlay, setAutoPlay] = useState(true);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const page = book.pages[pageIdx];
  const totalPages = book.pages.length;

  const clearTimer = () => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
  };

  const speakSegment = useCallback((idx: number) => {
    if (!page || idx >= page.textSegments.length) {
      setPhase('done');
      return;
    }
    const seg = page.textSegments[idx];
    const voice = book.voiceAssignments?.[seg.speaker] || 'lessac';
    speak(seg.text, () => {
      setSegmentIdx(idx + 1);
      speakSegment(idx + 1);
    }, voice);
  }, [page, book.voiceAssignments, speak]);

  // Animate phases: bg → char (500ms) → text (800ms) → TTS
  useEffect(() => {
    setPhase('bg');
    setSegmentIdx(0);
    stop();
    clearTimer();
    phaseTimerRef.current = setTimeout(() => setPhase('char'), 400);
    return clearTimer;
  }, [pageIdx]);

  useEffect(() => {
    if (phase === 'char') {
      phaseTimerRef.current = setTimeout(() => setPhase('text'), 600);
    } else if (phase === 'text') {
      phaseTimerRef.current = setTimeout(() => {
        setSegmentIdx(0);
        speakSegment(0);
      }, 400);
    }
    return clearTimer;
  }, [phase]);

  const nextPage = useCallback(() => {
    stop();
    if (pageIdx < totalPages - 1) setPageIdx(p => p + 1);
  }, [pageIdx, totalPages, stop]);

  const prevPage = useCallback(() => {
    stop();
    setPageIdx(p => Math.max(0, p - 1));
  }, [stop]);

  // Auto-advance after TTS finishes on last segment
  useEffect(() => {
    if (phase === 'done' && autoPlay && pageIdx < totalPages - 1) {
      phaseTimerRef.current = setTimeout(nextPage, 1500);
    }
    return clearTimer;
  }, [phase, autoPlay, pageIdx, totalPages, nextPage]);

  const charAnim = page?.characterAnimation || 'fadeIn';
  const hasChar = page && (page.characterImageData || page.characterScene) && page.imagePlacement !== 'none';

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/80">
        <button onClick={() => { stop(); onClose(); }} className="text-white/70 hover:text-white flex items-center gap-1 text-sm">
          <Icon icon={Cancel01IconData} className="w-4" /> Exit
        </button>
        <div className="text-white/60 text-sm">{pageIdx + 1} / {totalPages}</div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoPlay(a => !a)}
            className="text-white/60 hover:text-white text-xs flex items-center gap-1"
          >
            {autoPlay ? <Icon icon={PauseIconData} className="w-4" /> : <Icon icon={PlayIconData} className="w-4" />}
            {autoPlay ? 'Pause Auto' : 'Auto Play'}
          </button>
          <button onClick={() => { stop(); speakSegment(0); }} className="text-white/60 hover:text-white">
            <Icon icon={RefreshIconData} className="w-4" />
          </button>
        </div>
      </div>

      {/* Page */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {/* Background */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${phase !== 'bg' ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: page?.bundledSceneId
              ? `${SCENE_BG_COLORS[(BUNDLED_SCENES.find(s => s.id === page.bundledSceneId)?.category) || 'outdoors']}cc`
              : '#1a1a2e',
          }}
        >
          {page?.backgroundImageData && (
            <img src={page.backgroundImageData} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Page content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-8 py-6 flex items-center gap-8 min-h-[60vh]">
          {/* Character */}
          {hasChar && page.imagePlacement === 'left' && (
            <div className={`flex-shrink-0 w-48 animate__animated animate__${charAnim} ${phase === 'char' || phase === 'text' || phase === 'done' ? '' : 'invisible'}`}>
              {page.characterImageData
                ? <img src={page.characterImageData} alt="character" className="w-full drop-shadow-2xl" />
                : <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center"><Icon icon={UserIconData} className="w-16" style={{ color: 'rgba(255,255,255,0.5)' }} /></div>
              }
            </div>
          )}

          {/* Text */}
          <div className={`flex-1 space-y-3 transition-opacity duration-700 ${phase === 'text' || phase === 'done' ? 'opacity-100' : 'opacity-0'}`}>
            {page?.textSegments.map((seg, i) => (
              <p
                key={i}
                className={`text-white leading-relaxed drop-shadow-lg transition-opacity duration-500 ${
                  i <= segmentIdx ? 'opacity-100' : 'opacity-30'
                } ${seg.speaker === 'narrator' ? 'text-xl italic' : 'text-xl font-semibold'}`}
              >
                {seg.speaker !== 'narrator' && (
                  <span className="text-sm font-normal text-yellow-300 not-italic block mb-0.5">{seg.speaker}</span>
                )}
                {seg.speaker !== 'narrator' ? `"${seg.text}"` : seg.text}
              </p>
            ))}
          </div>

          {/* Character right */}
          {hasChar && page.imagePlacement === 'right' && (
            <div className={`flex-shrink-0 w-48 animate__animated animate__${charAnim} ${phase === 'char' || phase === 'text' || phase === 'done' ? '' : 'invisible'}`}>
              {page.characterImageData
                ? <img src={page.characterImageData} alt="character" className="w-full drop-shadow-2xl" />
                : <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center"><Icon icon={UserIconData} className="w-16" style={{ color: 'rgba(255,255,255,0.5)' }} /></div>
              }
            </div>
          )}
        </div>

        {/* Nav arrows */}
        <button
          onClick={prevPage}
          disabled={pageIdx === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white disabled:opacity-20 transition-opacity"
        >
          <Icon icon={ArrowLeft01IconData} className="w-8" />
        </button>
        <button
          onClick={nextPage}
          disabled={pageIdx === totalPages - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white disabled:opacity-20 transition-opacity"
        >
          <Icon icon={ArrowRight01IconData} className="w-8" />
        </button>
      </div>

      {/* Page dots */}
      <div className="flex justify-center gap-1.5 py-3">
        {book.pages.map((_, i) => (
          <button
            key={i}
            onClick={() => { stop(); setPageIdx(i); }}
            className="w-2 h-2 rounded-full transition-all"
            style={{ background: i === pageIdx ? accentColor : 'rgba(255,255,255,0.3)' }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Page Preview ─────────────────────────────────────────────────────────────

function PagePreview({
  page,
  accentColor,
}: {
  page: StoryPage;
  accentColor: string;
}) {
  const bgScene = page.bundledSceneId
    ? BUNDLED_SCENES.find(s => s.id === page.bundledSceneId)
    : null;
  const bgColor = bgScene ? SCENE_BG_COLORS[bgScene.category] : '#f3f4f6';

  const hasChar = page.characterImageData && page.imagePlacement !== 'none';

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-theme shadow-sm"
      style={{ background: bgColor, aspectRatio: '297 / 210', fontFamily: 'Georgia, serif' }}
    >
      {page.backgroundImageData && (
        <img src={page.backgroundImageData} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      )}
      <div className="relative z-10 p-6">
        {/* Character + text layout using CSS float */}
        {hasChar && page.imagePlacement === 'left' && (
          <img
            src={page.characterImageData!}
            alt="character"
            className="float-left mr-4 mb-2 rounded-lg shadow-md"
            style={{ width: 120, shapeOutside: `url(${page.characterImageData})`, shapeMargin: '12px' }}
          />
        )}
        {hasChar && page.imagePlacement === 'right' && (
          <img
            src={page.characterImageData!}
            alt="character"
            className="float-right ml-4 mb-2 rounded-lg shadow-md"
            style={{ width: 120, shapeOutside: `url(${page.characterImageData})`, shapeMargin: '12px' }}
          />
        )}
        <div className="space-y-2">
          {page.textSegments.map((seg, i) => (
            <p key={i} className={`leading-relaxed text-gray-800 ${seg.speaker === 'narrator' ? 'italic text-base' : 'font-semibold text-base'}`}>
              {seg.speaker !== 'narrator' && (
                <span className="text-xs font-bold text-purple-600 not-italic block">{seg.speaker}:</span>
              )}
              {seg.speaker !== 'narrator' ? `"${seg.text}"` : seg.text}
            </p>
          ))}
        </div>
        <div style={{ clear: 'both' }} />
      </div>
      {/* Scene badge */}
      {bgScene && (
        <div className="absolute bottom-2 right-2 text-xs bg-black/20 text-white px-2 py-0.5 rounded-full">
          {bgScene.name}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface StoryBookCreatorProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

type View = 'input' | 'streaming' | 'editor' | 'playing' | 'history';

export default function StoryBookCreator({ tabId, savedData, onDataChange }: StoryBookCreatorProps) {
  const { settings } = useSettings();
  const { hasDiffusion, hasVision, tier } = useCapabilities();
  const { getConnection, getStreamingContent, getIsStreaming, clearStreaming } = useWebSocket();
  const { speak, stop: stopTTS, isSpeaking } = useTTS();

  const accentColor = (settings.tabColors as any)['storybook'] || '#a855f7';

  // ── Dark mode detection ───────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // ── State ──────────────────────────────────────────────────────────────────
  const [view, setView] = useState<View>('input');
  const [formData, setFormData] = useState<StorybookFormData>(DEFAULT_FORM);
  const [parsedBook, setParsedBook] = useState<ParsedStorybook | null>(null);
  const [livePages, setLivePages] = useState<StoryPage[]>([]);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [scenePicker, setScenePicker] = useState<number | null>(null); // page index
  const [isRemovingBg, setIsRemovingBg] = useState<number | null>(null); // page index
  const [activeTab, setActiveTab] = useState<'story' | 'questions' | 'settings'>('story');
  const [showImageGuidance, setShowImageGuidance] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<'idle' | 'writing_story' | 'formatting_pages'>('idle');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<AnimatedHTMLProgress | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showExportSettings, setShowExportSettings] = useState(false);
  const [exportSettings, setExportSettingsState] = useState<StorybookExportSettings>(() => getExportSettings());
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadPageIdxRef = useRef<number>(0);

  // ── Restore saved data ─────────────────────────────────────────────────────
  useEffect(() => {
    if (savedData) {
      if (savedData.formData) setFormData({ ...DEFAULT_FORM, ...savedData.formData });
      if (savedData.parsedBook) {
        setParsedBook(savedData.parsedBook);
        setView('editor');
      }
    }
  }, []);

  // ── Persist data ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (view === 'editor' && parsedBook) {
      onDataChange({ formData, parsedBook });
    }
  }, [parsedBook, formData, view]);

  // ── Form helpers ───────────────────────────────────────────────────────────
  const updateForm = useCallback(<K extends keyof StorybookFormData>(key: K, val: StorybookFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  }, []);

  const updatePage = useCallback((idx: number, updates: Partial<StoryPage>) => {
    setParsedBook(prev => {
      if (!prev) return prev;
      const pages = [...prev.pages];
      pages[idx] = { ...pages[idx], ...updates };
      return { ...prev, pages };
    });
  }, []);

  // ── Speaker config ─────────────────────────────────────────────────────────
  const setSpeakerCount = (count: 1 | 2 | 3) => {
    const speakers: SpeakerConfig[] = [];
    const roles: SpeakerRole[] = ['narrator', 'character1', 'character2'];
    const voices: VoiceName[] = ['lessac', 'ryan', 'amy'];
    for (let i = 0; i < count; i++) {
      speakers.push(formData.speakers[i] || { role: roles[i], voice: voices[i] });
    }
    setFormData(prev => ({ ...prev, speakerCount: count, speakers }));
  };

  const updateSpeaker = (i: number, updates: Partial<SpeakerConfig>) => {
    setFormData(prev => {
      const speakers = [...prev.speakers];
      speakers[i] = { ...speakers[i], ...updates };
      return { ...prev, speakers };
    });
  };

  // ── STT ────────────────────────────────────────────────────────────────────
  const { isListening, toggleListening } = useSTT(
    (text) => updateForm('description', formData.description ? formData.description + ' ' + text : text),
    (interim) => { /* show interim if desired */ },
  );

  // ── Validate & Generate ────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errors: Record<string, boolean> = {};
    if (!formData.title.trim()) errors.title = true;
    if (!formData.useCurriculum && !formData.description.trim()) errors.description = true;
    if (!formData.subject) errors.subject = true;
    if (!formData.gradeLevel) errors.gradeLevel = true;
    if (formData.useCurriculum) {
      if (!formData.strand) errors.strand = true;
      if (!formData.essentialOutcomes) errors.essentialOutcomes = true;
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerate = useCallback(() => {
    if (!validate()) return;
    clearStreaming(tabId, WS_ENDPOINT);
    setLivePages([]);
    setGenerationPhase('idle');
    setView('streaming');

    const ws = getConnection(tabId, WS_ENDPOINT);
    wsRef.current = ws;

    const useTwoPass = tier === 1;

    if (useTwoPass) {
      // Listen for two-pass status messages
      const statusHandler = (event: MessageEvent) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'status') {
            if (msg.status === 'writing_story') setGenerationPhase('writing_story');
            else if (msg.status === 'formatting_pages') setGenerationPhase('formatting_pages');
          }
        } catch { /* ignore non-JSON */ }
      };
      ws.addEventListener('message', statusHandler);
    }

    const prompt = buildStorybookPrompt(formData);
    const payload: Record<string, unknown> = { prompt, grade: formData.gradeLevel };

    if (useTwoPass) {
      payload.twoPass = true;
      payload.narrativePrompt = buildNarrativePrompt(formData);
      payload.structurePromptTemplate = buildStructurePromptTemplate(formData);
    }

    const send = () => ws.send(JSON.stringify(payload));
    if (ws.readyState === WebSocket.OPEN) send();
    else ws.addEventListener('open', send, { once: true });
  }, [formData, tabId, tier, getConnection, clearStreaming]);

  // ── Watch streaming content ────────────────────────────────────────────────
  const isStreaming = getIsStreaming(tabId, WS_ENDPOINT);
  const streamingContent = getStreamingContent(tabId, WS_ENDPOINT);

  useEffect(() => {
    if (!streamingContent) return;
    const partial = tryParsePartialPages(streamingContent);
    if (partial.length > 0) setLivePages(partial);

    if (!isStreaming && streamingContent) {
      // Streaming finished — parse full book
      setGenerationPhase('idle');
      const full = tryParseFullBook(streamingContent);
      if (full && full.pages.length > 0) {
        // Auto-match bundled scenes
        const pages = full.pages.map(p => ({
          ...p,
          bundledSceneId: findBestScene(p.sceneId).id,
        }));
        // Validate speakers match form config
        const validated = validateSpeakers({ ...full, pages }, formData);
        setParsedBook(validated);
        setCurrentPageIdx(0);
        setView('editor');
        // Auto-save completed storybook
        const saved = saveStorybook(formData, validated, currentDraftId || undefined);
        setCurrentDraftId(saved.id);
      } else {
        setView('input');
      }
    }
  }, [streamingContent, isStreaming]);

  // ── Background removal ─────────────────────────────────────────────────────
  const removeBackground = async (pageIdx: number, imageData: string) => {
    setIsRemovingBg(pageIdx);
    try {
      const base64 = imageData.includes(',') ? imageData.split(',')[1] : imageData;
      const res = await fetch('/api/remove-background-base64', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const result = `data:image/png;base64,${data.image}`;
      updatePage(pageIdx, { characterImageData: result });
    } catch (e) {
      console.error('[StoryBook] BG removal failed:', e);
    } finally {
      setIsRemovingBg(null);
    }
  };

  // ── Image upload ───────────────────────────────────────────────────────────
  const handleImageUpload = (pageIdx: number) => {
    uploadPageIdxRef.current = pageIdx;
    fileInputRef.current?.click();
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUri = ev.target?.result as string;
      const compressed = await compressTransparentImage(dataUri);
      updatePage(uploadPageIdxRef.current, { characterImageData: compressed });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = useCallback(async (format: 'pdf' | 'pptx' | 'html') => {
    if (!parsedBook) return;
    setShowExportMenu(false);
    setIsExporting(true);
    setExportProgress(null);
    try {
      if (format === 'pdf') {
        await exportStorybookPDF(parsedBook, formData, accentColor);
      } else if (format === 'pptx') {
        await exportStorybookPPTX(parsedBook, formData, accentColor);
      } else {
        await exportAnimatedHTML(parsedBook, formData, accentColor, (p) => setExportProgress(p));
      }
    } catch (e) {
      console.error('[StoryBook] Export failed:', e);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  }, [parsedBook, formData, accentColor]);

  // ── Save / Load Draft ──────────────────────────────────────────────────────
  const handleSaveDraft = useCallback(() => {
    const saved = saveStorybook(formData, parsedBook, currentDraftId || undefined);
    setCurrentDraftId(saved.id);
    setSaveToast(parsedBook ? 'Storybook saved!' : 'Draft saved!');
    setTimeout(() => setSaveToast(null), 2000);
  }, [formData, parsedBook, currentDraftId]);

  const handleLoadSaved = useCallback((saved: SavedStorybook) => {
    setFormData({ ...DEFAULT_FORM, ...saved.formData });
    setCurrentDraftId(saved.id);
    if (saved.parsedBook && saved.parsedBook.pages.length > 0) {
      setParsedBook(saved.parsedBook);
      setView('editor');
    } else {
      setParsedBook(null);
      setView('input');
    }
    setShowHistory(false);
  }, []);

  // ── Subjects / grades filtered by profile ─────────────────────────────────
  const allSubjects = ['Mathematics', 'Science', 'Language Arts', 'Social Studies'];
  const allGrades = ['K', '1', '2'];
  const gradeMapping = settings.profile?.gradeSubjects || {};
  const filterOn = settings.profile?.filterContentByProfile ?? false;

  const availableGrades = filterGrades(allGrades, gradeMapping, filterOn);
  const grades = Array.isArray(availableGrades) && availableGrades.length > 0 ? availableGrades : allGrades;
  const selectedGradeKey = formData.gradeLevel?.toLowerCase() || '';
  const filtered = filterSubjects(allSubjects, gradeMapping, filterOn, selectedGradeKey || undefined);
  const availableSubjects = Array.isArray(filtered) && filtered.length > 0 ? filtered : allSubjects;

  // Auto-select when only one option from profile filtering
  useEffect(() => {
    if (!filterOn) return;
    const updates: Partial<StorybookFormData> = {};
    if (grades.length === 1 && !formData.gradeLevel) updates.gradeLevel = grades[0] as 'K' | '1' | '2';
    if (availableSubjects.length === 1 && !formData.subject) updates.subject = availableSubjects[0];
    if (Object.keys(updates).length > 0) setFormData(prev => ({ ...prev, ...updates }));
  }, [availableSubjects, grades, filterOn]);

  // ─── Render: Input view ──────────────────────────────────────────────────────
  if (view === 'input') {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accentColor}22` }}>
              <Icon icon={BookOpen01IconData} className="w-5" style={{ color: accentColor }} />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-theme-heading">Storybook Creator</h1>
              <p className="text-sm text-theme-muted">Create illustrated stories for K-2 students</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-theme-strong hover:bg-theme-secondary text-theme-muted hover:text-theme-heading transition-colors"
                title="Save draft"
              >
                <Icon icon={FloppyDiskIconData} className="w-4" />
                Save
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-theme-strong hover:bg-theme-secondary text-theme-muted hover:text-theme-heading transition-colors"
                title="Open saved storybooks"
              >
                <Icon icon={Clock01IconData} className="w-4" />
                History
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-theme-label mb-1.5">
              Story Title <span className="text-red-500">*</span>
            </label>
            <SmartInput
              value={formData.title}
              onChange={v => updateForm('title', v)}
              placeholder="e.g. Max and the Magic Seed"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${validationErrors.title ? 'border-red-500' : 'border-theme-strong'}`}
              style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
            />
          </div>

          {/* Grade Level */}
          <div>
            <label className="block text-sm font-medium text-theme-label mb-1.5">
              Grade Level <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gradeLevel}
              onChange={e => {
                const newGrade = e.target.value as 'K' | '1' | '2';
                updateForm('gradeLevel', newGrade);
                updateForm('strand', '');
                updateForm('essentialOutcomes', '');
                updateForm('specificOutcomes', '');
                // Reset subject if it's not available for the new grade
                const newKey = newGrade.toLowerCase();
                const available = filterSubjects(allSubjects, gradeMapping, filterOn, newKey);
                if (formData.subject && !available.includes(formData.subject)) {
                  updateForm('subject', '');
                }
              }}
              data-validation-error={validationErrors.gradeLevel ? 'true' : undefined}
              className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent ${validationErrors.gradeLevel ? 'validation-error' : ''}`}
              style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
            >
              <option value="">Select a grade</option>
              {grades.map(g => (
                <option key={g} value={g}>{g === 'K' ? 'Kindergarten' : `Grade ${g}`}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-theme-label mb-1.5">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.subject}
              onChange={e => {
                updateForm('subject', e.target.value);
                updateForm('strand', '');
                updateForm('essentialOutcomes', '');
                updateForm('specificOutcomes', '');
              }}
              data-validation-error={validationErrors.subject ? 'true' : undefined}
              className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent ${validationErrors.subject ? 'validation-error' : ''}`}
              style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
            >
              <option value="">Select a subject</option>
              {availableSubjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Curriculum toggle + fields — directly after Grade + Subject */}
          {formData.subject && formData.gradeLevel && (
            <div>
              {/* Standalone toggle */}
              <button
                type="button"
                onClick={() => updateForm('useCurriculum', !formData.useCurriculum)}
                className="flex items-center gap-1.5 group mb-3"
                title={formData.useCurriculum ? 'Curriculum alignment enabled' : 'Curriculum alignment disabled'}
              >
                <span className="text-sm font-medium text-theme-label group-hover:text-theme-heading transition-colors">
                  Align to curriculum
                </span>
                <div className={`relative w-7 h-4 rounded-full transition-colors ${formData.useCurriculum ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${formData.useCurriculum ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                </div>
              </button>

              {/* Strand / ELO / SCO fields — only when curriculum is on */}
              {formData.useCurriculum && (
                <>
                  <CurriculumAlignmentFields
                    subject={formData.subject}
                    gradeLevel={formData.gradeLevel.toLowerCase() === 'k' ? 'k' : formData.gradeLevel}
                    strand={formData.strand}
                    essentialOutcomes={formData.essentialOutcomes}
                    specificOutcomes={formData.specificOutcomes}
                    useCurriculum={true}
                    onStrandChange={v => updateForm('strand', v)}
                    onELOChange={v => updateForm('essentialOutcomes', v)}
                    onSCOsChange={v => updateForm('specificOutcomes', v)}
                    onToggleCurriculum={() => {}}
                    accentColor={accentColor}
                    validationErrors={validationErrors}
                    hideToggle
                  />
                  {formData.strand && (
                    <p className="mt-2 text-xs text-theme-muted bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg px-3 py-2">
                      The AI will weave the curriculum outcomes naturally into the story and generate comprehension questions you can use with students.
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* Description + mic — only shown when NOT aligned to curriculum */}
          {!formData.useCurriculum && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-theme-label">
                  Story Description <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={toggleListening}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'text-theme-muted hover:text-theme-heading border border-theme-strong'
                  }`}
                >
                  <Icon icon={Mic01IconData} className="w-3.5" />
                  {isListening ? 'Listening...' : 'Speak'}
                </button>
              </div>
              <SmartTextArea
                value={formData.description}
                onChange={v => updateForm('description', v)}
                rows={4}
                placeholder="Describe the story you want — characters, setting, theme, and what happens. e.g. A curious rabbit named Pip discovers a magical garden that teaches about sharing..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent resize-none ${validationErrors.description ? 'border-red-500' : 'border-theme-strong'}`}
                style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
              />
              {validationErrors.description && (
                <p className="text-xs text-red-500 mt-1">Please describe the story</p>
              )}
            </div>
          )}

          {/* Page count */}
          <div>
            <label className="block text-sm font-medium text-theme-label mb-2">
              Pages: <span style={{ color: accentColor }}>{formData.pageCount}</span>
            </label>
            <input
              type="range"
              min={6}
              max={12}
              step={1}
              value={formData.pageCount}
              onChange={e => updateForm('pageCount', Number(e.target.value) as any)}
              className="w-full accent-purple-500"
              style={{ accentColor }}
            />
            <div className="flex justify-between text-xs text-theme-muted mt-0.5">
              <span>6 pages</span>
              <span>12 pages</span>
            </div>
          </div>

          {/* Image Mode */}
          <div>
            <label className="block text-sm font-medium text-theme-label mb-2">Images</label>
            <ImageModeSelector
              imageMode={formData.imageMode}
              onModeChange={m => updateForm('imageMode', m)}
              accentColor={accentColor}
              hasDiffusion={hasDiffusion}
              hasVision={hasVision}
              labels={{ none: 'Text Only', suggested: 'Image Guidance', myImages: 'My Images', ai: 'AI Generated' }}
              descs={{ none: 'Story text only', suggested: 'AI suggests what to add', myImages: 'Upload your images', ai: 'Generate with AI' }}
            />
          </div>

          {/* Speakers */}
          <div>
            <label className="block text-sm font-medium text-theme-label mb-2">Narrators & Voices</label>
            <div className="flex gap-2 mb-3">
              {([1, 2, 3] as const).map(n => {
                const active = formData.speakerCount === n;
                return (
                  <button
                    key={n}
                    onClick={() => setSpeakerCount(n)}
                    className="flex-1 py-1.5 rounded-lg text-sm border-2 transition-all"
                    style={{
                      borderColor: active ? accentColor : 'transparent',
                      background: active ? `${accentColor}18` : 'var(--bg-secondary)',
                      color: active ? accentColor : undefined,
                    }}
                  >
                    {n === 1 ? 'Narrator only' : n === 2 ? '1 character' : '2 characters'}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              {formData.speakers.map((sp, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-theme-secondary border border-theme">
                  <div className="text-lg">
                    {sp.role === 'narrator'
                      ? <Icon icon={BookOpen01IconData} className="w-5" style={{ color: accentColor }} />
                      : <Icon icon={UserIconData} className="w-5" style={{ color: accentColor }} />}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-theme-muted mb-1">{sp.role === 'narrator' ? 'Narrator' : `Character ${i}`}</p>
                      {sp.role !== 'narrator' && (
                        <input
                          type="text"
                          value={sp.characterName || ''}
                          onChange={e => updateSpeaker(i, { characterName: e.target.value })}
                          placeholder="Character name"
                          className="w-full px-2 py-1 text-sm border border-theme-strong rounded focus:ring-1 bg-theme"
                          style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-theme-muted mb-1">Voice</p>
                      <select
                        value={sp.voice}
                        onChange={e => updateSpeaker(i, { voice: e.target.value as VoiceName })}
                        className="w-full px-2 py-1 text-sm border border-theme-strong rounded focus:ring-1 bg-theme"
                        style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                      >
                        {Object.entries(VOICE_LABELS).map(([v, label]) => (
                          <option key={v} value={v}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: accentColor }}
          >
            Generate Storybook
          </button>
        </div>

        {/* History modal */}
        {showHistory && (
          <HistoryPanel
            onLoad={handleLoadSaved}
            onClose={() => setShowHistory(false)}
            accentColor={accentColor}
          />
        )}

        {/* Save toast */}
        {saveToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm shadow-lg flex items-center gap-2 animate-fade-in">
            <Icon icon={Tick01IconData} className="w-4" style={{ color: '#4ade80' }} />
            {saveToast}
          </div>
        )}
      </div>
    );
  }

  // ─── Render: Streaming view ────────────────────────────────────────────────
  if (view === 'streaming') {
    const phaseLabel = generationPhase === 'writing_story'
      ? 'Writing the story...'
      : generationPhase === 'formatting_pages'
        ? 'Formatting into pages...'
        : 'Writing your storybook...';
    const phaseDetail = generationPhase === 'writing_story'
      ? 'Creating a cohesive narrative first'
      : generationPhase === 'formatting_pages'
        ? livePages.length > 0
          ? `${livePages.length} of ${formData.pageCount} pages ready`
          : 'Breaking the story into illustrated pages'
        : livePages.length > 0
          ? `${livePages.length} of ${formData.pageCount} pages ready`
          : 'Crafting characters and scenes';

    return (
      <div className="h-full relative overflow-hidden">
        {isDark ? <KidsStorybookSkeletonNight /> : <KidsStorybookSkeletonDay />}
        {/* Cancel button overlaid on bottom-right */}
        <button
          onClick={() => { clearStreaming(tabId, WS_ENDPOINT); setView('input'); }}
          className="absolute bottom-4 right-4 z-10 text-sm px-3 py-1.5 rounded-lg bg-black/20 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/30 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  // ─── Render: Playing view ──────────────────────────────────────────────────
  if (view === 'playing' && parsedBook) {
    return (
      <PlaybackView
        book={parsedBook}
        onClose={() => setView('editor')}
        accentColor={accentColor}
      />
    );
  }

  // ─── Render: Editor view ───────────────────────────────────────────────────
  if (!parsedBook) return null;

  const currentPage = parsedBook.pages[currentPageIdx];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 border-b border-theme px-4 py-2 flex items-center gap-3" style={{ borderBottomColor: `${accentColor}33` }}>
        <button
          onClick={() => setView('input')}
          className="text-theme-muted hover:text-theme-heading flex items-center gap-1 text-sm"
        >
          <Icon icon={ArrowLeft01IconData} className="w-4" /> Edit Form
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-semibold text-theme-heading text-sm truncate">{parsedBook.title}</h2>
          <p className="text-xs text-theme-muted">
            {parsedBook.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${parsedBook.gradeLevel}`}
            {formData.subject && ` • ${formData.subject}`}
            {' • '}{parsedBook.pages.length} pages
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Save */}
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm border border-theme-strong hover:bg-theme-secondary text-theme-muted hover:text-theme-heading"
            title="Save storybook"
          >
            <Icon icon={FloppyDiskIconData} className="w-4" />
          </button>
          {/* History */}
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm border border-theme-strong hover:bg-theme-secondary text-theme-muted hover:text-theme-heading"
            title="Storybook history"
          >
            <Icon icon={Clock01IconData} className="w-4" />
          </button>
          <button
            onClick={() => setView('playing')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white"
            style={{ background: accentColor }}
          >
            <Icon icon={PlayIconData} className="w-4" /> Play
          </button>
          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(m => !m)}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-theme-strong hover:bg-theme-secondary disabled:opacity-50"
            >
              {isExporting
                ? <Icon icon={Loading03IconData} className="w-4 animate-spin" />
                : <Icon icon={Download01IconData} className="w-4" />
              }
              {exportProgress ? exportProgress.label : 'Export'}
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 rounded-xl border border-theme shadow-lg z-20">
                {[
                  { fmt: 'pdf' as const,  label: 'PDF',                iconData: File01IconData },
                  { fmt: 'pptx' as const, label: 'PowerPoint (PPTX)',   iconData: Presentation01IconData },
                  { fmt: 'html' as const, label: 'Animated HTML',       iconData: Video01IconData },
                ].map(({ fmt, label, iconData }) => (
                  <button
                    key={fmt}
                    onClick={() => handleExport(fmt)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-theme-heading hover:bg-theme-secondary first:rounded-t-xl last:rounded-b-xl"
                  >
                    <Icon icon={iconData} className="w-4" />{label}
                  </button>
                ))}
                <div className="border-t border-theme">
                  <button
                    onClick={() => { setShowExportMenu(false); setShowExportSettings(true); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-theme-muted hover:bg-theme-secondary rounded-b-xl"
                  >
                    <Icon icon={Settings01IconData} className="w-4" /> Export Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor tabs (Story / Questions / Export) */}
      <div className="shrink-0 flex border-b border-theme px-4">
        {(['story', 'questions'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
            style={{
              borderBottomColor: activeTab === tab ? accentColor : 'transparent',
              color: activeTab === tab ? accentColor : undefined,
            }}
          >
            {tab === 'story' ? 'Story Pages' : `Questions${parsedBook.comprehensionQuestions?.length ? ` (${parsedBook.comprehensionQuestions.length})` : ''}`}
          </button>
        ))}
      </div>

      {activeTab === 'questions' ? (
        // ── Comprehension Questions Panel ──────────────────────────────────
        <div className="flex-1 overflow-y-auto p-6">
          {parsedBook.learningObjectiveSummary && (
            <div className="mb-4 p-3 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-0.5">Learning Objective</p>
              <p className="text-sm text-theme-heading">{parsedBook.learningObjectiveSummary}</p>
            </div>
          )}
          {(!parsedBook.comprehensionQuestions || parsedBook.comprehensionQuestions.length === 0) ? (
            <div className="text-center py-12 text-theme-muted">
              <Icon icon={QuestionIconData} className="w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No comprehension questions generated.</p>
              <p className="text-xs mt-1">Enable curriculum alignment and regenerate to get questions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-theme-muted">
                Use these questions after reading to check understanding and connect to classwork.
              </p>
              {parsedBook.comprehensionQuestions.map((q, i) => (
                <div key={i} className="rounded-xl border border-theme p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <span
                      className="shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white"
                      style={{ background: accentColor }}
                    >
                      {i + 1}
                    </span>
                    <p className="font-medium text-theme-heading text-sm">{q.question}</p>
                  </div>
                  <div className="ml-8 p-2 rounded-lg bg-theme-secondary">
                    <p className="text-xs text-theme-muted font-semibold mb-0.5">Expected Answer / Discussion Points</p>
                    <p className="text-sm text-theme-heading">{q.answer}</p>
                    {q.outcomeRef && (
                      <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        {q.outcomeRef.length > 80 ? q.outcomeRef.slice(0, 80) + '...' : q.outcomeRef}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // ── Story Pages Editor ──────────────────────────────────────────────
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Thumbnail strip */}
          <div className="w-28 shrink-0 border-r border-theme overflow-y-auto p-2 space-y-2 bg-theme-secondary">
            {parsedBook.pages.map((page, i) => {
              const isActive = i === currentPageIdx;
              const bgScene = page.bundledSceneId
                ? BUNDLED_SCENES.find(s => s.id === page.bundledSceneId)
                : null;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPageIdx(i)}
                  className="w-full rounded-lg overflow-hidden border-2 transition-all text-left"
                  style={{ borderColor: isActive ? accentColor : 'transparent' }}
                >
                  <div
                    className="h-14 flex items-center justify-center text-xl"
                    style={{ background: bgScene ? SCENE_BG_COLORS[bgScene.category] : '#f3f4f6' }}
                  >
                    <Icon icon={Image01IconData} className="w-4 opacity-40" />
                    {page.characterImageData && (
                      <img src={page.characterImageData} alt="" className="h-10 absolute" style={{ opacity: 0.7 }} />
                    )}
                  </div>
                  <div className="px-1.5 py-1">
                    <p className="text-[10px] font-semibold" style={{ color: isActive ? accentColor : undefined }}>
                      P{page.pageNumber}
                    </p>
                    <p className="text-[9px] text-theme-muted truncate leading-tight">
                      {page.textSegments[0]?.text}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Center: Page preview */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Page nav */}
              <div className="flex items-center justify-between">
                <button
                  disabled={currentPageIdx === 0}
                  onClick={() => setCurrentPageIdx(p => p - 1)}
                  className="text-theme-muted hover:text-theme-heading disabled:opacity-30"
                >
                  <Icon icon={ArrowLeft01IconData} className="w-5" />
                </button>
                <span className="text-sm text-theme-muted">
                  Page {currentPageIdx + 1} of {parsedBook.pages.length}
                </span>
                <button
                  disabled={currentPageIdx === parsedBook.pages.length - 1}
                  onClick={() => setCurrentPageIdx(p => p + 1)}
                  className="text-theme-muted hover:text-theme-heading disabled:opacity-30"
                >
                  <Icon icon={ArrowRight01IconData} className="w-5" />
                </button>
              </div>

              <PagePreview page={currentPage} accentColor={accentColor} />

              {/* Image guidance note (suggested mode) */}
              {formData.imageMode === 'suggested' && currentPage.characterScene && (
                <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-3">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-0.5">Image Guidance</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">{currentPage.characterScene}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Edit panel */}
          <div className="w-72 shrink-0 border-l border-theme overflow-y-auto p-4 space-y-5">
            {/* Scene picker */}
            <div>
              <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">Background Scene</label>
              <button
                onClick={() => setScenePicker(currentPageIdx)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-theme-strong hover:bg-theme-secondary text-sm"
              >
                <Icon icon={Image01IconData} className="w-4" style={{ color: accentColor }} />
                <span className="flex-1 text-left truncate text-theme-heading">
                  {BUNDLED_SCENES.find(s => s.id === currentPage.bundledSceneId)?.name || 'Choose scene'}
                </span>
              </button>
            </div>

            {/* Character image */}
            <div>
              <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">Character Image</label>
              <div className="space-y-2">
                {currentPage.characterImageData && (
                  <div className="relative">
                    <img
                      src={currentPage.characterImageData}
                      alt="character"
                      className="w-full max-h-32 object-contain rounded-lg border border-theme"
                    />
                    <button
                      onClick={() => updatePage(currentPageIdx, { characterImageData: undefined })}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <Icon icon={Cancel01IconData} className="w-3" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => handleImageUpload(currentPageIdx)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-theme-strong hover:bg-theme-secondary text-sm text-theme-muted"
                >
                  <Icon icon={Upload01IconData} className="w-4" />
                  Upload image
                </button>
                {currentPage.characterImageData && (
                  <button
                    onClick={() => removeBackground(currentPageIdx, currentPage.characterImageData!)}
                    disabled={isRemovingBg === currentPageIdx}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-theme-strong hover:bg-theme-secondary text-sm text-theme-muted disabled:opacity-60"
                  >
                    {isRemovingBg === currentPageIdx
                      ? <Icon icon={Loading03IconData} className="w-4 animate-spin" />
                      : <Icon icon={Image01IconData} className="w-4" />}
                    Remove background
                  </button>
                )}
                {/* Image placement */}
                <div className="flex gap-1">
                  {(['left', 'right', 'none'] as const).map(pos => {
                    const active = currentPage.imagePlacement === pos;
                    return (
                      <button
                        key={pos}
                        onClick={() => updatePage(currentPageIdx, { imagePlacement: pos })}
                        className="flex-1 py-1 text-xs rounded border transition-all capitalize"
                        style={{
                          borderColor: active ? accentColor : 'var(--border-color)',
                          color: active ? accentColor : undefined,
                          background: active ? `${accentColor}15` : undefined,
                        }}
                      >
                        {pos}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Text segments editor */}
            <div>
              <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">Text</label>
              <div className="space-y-3">
                {currentPage.textSegments.map((seg, si) => (
                  <div key={si} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <select
                        value={seg.speaker}
                        onChange={e => {
                          const segs = [...currentPage.textSegments];
                          segs[si] = { ...segs[si], speaker: e.target.value };
                          updatePage(currentPageIdx, { textSegments: segs });
                        }}
                        className="text-xs px-2 py-0.5 border border-theme-strong rounded bg-theme"
                      >
                        <option value="narrator">Narrator</option>
                        {parsedBook.characters?.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      {currentPage.textSegments.length > 1 && (
                        <button
                          onClick={() => {
                            const segs = currentPage.textSegments.filter((_, j) => j !== si);
                            updatePage(currentPageIdx, { textSegments: segs });
                          }}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Icon icon={Delete02IconData} className="w-3.5" />
                        </button>
                      )}
                    </div>
                    <textarea
                      value={seg.text}
                      onChange={e => {
                        const segs = [...currentPage.textSegments];
                        segs[si] = { ...segs[si], text: e.target.value };
                        updatePage(currentPageIdx, { textSegments: segs });
                      }}
                      rows={2}
                      className="w-full px-2 py-1.5 text-sm border border-theme-strong rounded-lg focus:ring-1 resize-none bg-theme"
                      style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    updatePage(currentPageIdx, {
                      textSegments: [...currentPage.textSegments, { speaker: 'narrator', text: '' }],
                    });
                  }}
                  className="w-full flex items-center gap-1 px-2 py-1.5 text-xs text-theme-muted hover:text-theme-heading border border-dashed border-theme-strong rounded-lg"
                >
                  <Icon icon={Add01IconData} className="w-3.5" /> Add line
                </button>
              </div>
            </div>

            {/* Read aloud page */}
            <div>
              <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">Listen</label>
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopTTS();
                  } else {
                    // Read each segment in sequence with correct voice
                    const segments = currentPage.textSegments;
                    let i = 0;
                    const readNext = () => {
                      if (i >= segments.length) return;
                      const seg = segments[i++];
                      const voice = parsedBook.voiceAssignments?.[seg.speaker] || 'lessac';
                      speak(seg.text, readNext, voice);
                    };
                    readNext();
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-theme-strong hover:bg-theme-secondary text-sm"
              >
                {isSpeaking
                  ? <><Icon icon={PauseIconData} className="w-4" /> Stop</>
                  : <><Icon icon={PlayIconData} className="w-4" /> Read this page</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scene picker modal */}
      {scenePicker !== null && (
        <ScenePickerModal
          current={parsedBook.pages[scenePicker]?.bundledSceneId}
          onSelect={scene => {
            updatePage(scenePicker, { bundledSceneId: scene.id });
            setScenePicker(null);
          }}
          onClose={() => setScenePicker(null)}
          accentColor={accentColor}
        />
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileSelected}
      />

      {/* History modal */}
      {showHistory && (
        <HistoryPanel
          onLoad={handleLoadSaved}
          onClose={() => setShowHistory(false)}
          accentColor={accentColor}
        />
      )}

      {/* Export settings modal */}
      {showExportSettings && (
        <ExportSettingsPanel
          settings={exportSettings}
          onChange={setExportSettingsState}
          onClose={() => setShowExportSettings(false)}
          accentColor={accentColor}
        />
      )}

      {/* Save toast */}
      {saveToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm shadow-lg flex items-center gap-2">
          <Icon icon={Tick01IconData} className="w-4" style={{ color: '#4ade80' }} />
          {saveToast}
        </div>
      )}
    </div>
  );
}
