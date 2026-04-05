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
import { useQueue } from '../contexts/QueueContext';
import { useQueueCancellation } from '../hooks/useQueueCancellation';
import { useSettings } from '../contexts/SettingsContext';
import { useCapabilities } from '../contexts/CapabilitiesContext';
import { useTTS, useSTT } from '../hooks/useVoice';
import { useOfflineGuard } from '../hooks/useOfflineGuard';
import { useHistoryMatching } from '../hooks/useHistoryMatching';
import ImageModeSelector from './ui/ImageModeSelector';
import CurriculumAlignmentFields from './ui/CurriculumAlignmentFields';
import KidsStorybookSkeletonDay from './KidsStorybookSkeletonDay';
import KidsStorybookSkeletonNight from './KidsStorybookSkeletonNight';
import SmartInput from './SmartInput';
import SmartTextArea from './SmartTextArea';
import { filterSubjects, filterGrades } from '../data/teacherConstants';
import { buildStorybookPrompt, buildNarrativePrompt, buildStructurePromptTemplate } from '../utils/storybookPromptBuilder';
import { BUNDLED_SCENES, findBestScene, getScenesByCategory, SCENE_CATEGORY_LABELS } from '../data/storybookScenes';
import { compressImage, compressTransparentImage } from '../utils/imageCompression';
import {
  generateAllPageImages,
  generateCharacterImage,
  generateCharacterFromReference,
  removeCharacterBg,
  generateBackgroundImage,
} from '../utils/storyImagePipeline';
import {
  exportStorybookPDF,
  exportStorybookPPTX,
  exportAnimatedHTML,
  fetchTTSBlob,
  type AnimatedHTMLProgress,
} from '../utils/storybookExportUtils';
import {
  saveStorybookImages,
  loadStorybookImages,
  saveStorybookAudio,
  loadStorybookAudio,
  type AudioEntry,
} from '../utils/storybookIndexedDB';
import type {
  StorybookFormData, ParsedStorybook, StoryPage, SpeakerConfig,
  VoiceName, SpeakerRole, ComprehensionQuestion, BundledScene,
  SavedStorybook, StorybookExportSettings, CoverPage,
} from '../types/storybook';
import type { ImageMode } from '../types';
import {
  getSavedStorybooks, saveStorybook, deleteSavedStorybook,
  getExportSettings, setExportSettings, DEFAULT_EXPORT_SETTINGS,
} from '../utils/storybookStorage';
import {
  buildSpeechBubbleSVG, shouldUseBubble, getTailDirection,
} from '../utils/speechBubble';

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
  authorName: '',
  pageCount: 8,
  imageMode: 'none',
  backgroundCount: 'auto',
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
  // Strip markdown fences if present (```json ... ``` or ``` ... ```)
  let cleaned = raw;
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch) cleaned = fenceMatch[1];

  const end = cleaned.lastIndexOf('}');
  if (end === -1) {
    console.error('[StoryBook] tryParseFullBook: no closing brace found. Content preview:', raw.substring(0, 200));
    return null;
  }

  // Try parsing from each '{' position — the model sometimes echoes the prompt
  // (which contains a JSON template), so the first '{' may not be the response.
  let searchFrom = 0;
  while (searchFrom < cleaned.length) {
    const start = cleaned.indexOf('{', searchFrom);
    if (start === -1 || start >= end) break;

    try {
      const json = cleaned.substring(start, end + 1);
      const parsed = JSON.parse(json);
      if (parsed.pages && Array.isArray(parsed.pages)) return parsed as ParsedStorybook;
      console.error('[StoryBook] tryParseFullBook: parsed JSON has no pages array. Keys:', Object.keys(parsed));
    } catch {
      // This '{' didn't yield valid JSON — try the next one
    }
    searchFrom = start + 1;
  }

  console.error('[StoryBook] tryParseFullBook: no valid storybook JSON found. Content preview:', raw.substring(0, 300));
  return null;
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

// ─── History Side Panel ─────────────────────────────────────────────────────

function HistorySidePanel({
  open,
  onLoad,
  onClose,
  accentColor,
  currentDraftId,
  formData: parentFormData,
  onMatchCount,
}: {
  open: boolean;
  onLoad: (saved: SavedStorybook) => void;
  onClose: () => void;
  accentColor: string;
  currentDraftId: string | null;
  formData?: Record<string, any>;
  onMatchCount?: (count: number) => void;
}) {
  const [items, setItems] = React.useState<SavedStorybook[]>(() => getSavedStorybooks());
  const [draftsExpanded, setDraftsExpanded] = React.useState(true);

  // Refresh items when panel opens
  React.useEffect(() => {
    if (open) setItems(getSavedStorybooks());
  }, [open]);

  // History matching
  const itemsWithTimestamp = React.useMemo(
    () => items.map(i => ({ ...i, timestamp: i.savedAt })),
    [items]
  );
  const { matchCount, matchedHistories, sortedHistories } = useHistoryMatching(
    parentFormData || {},
    itemsWithTimestamp
  );

  React.useEffect(() => {
    onMatchCount?.(matchCount);
  }, [matchCount, onMatchCount]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSavedStorybook(id);
    setItems(getSavedStorybooks());
  };

  const drafts = items.filter(i => i.status === 'draft');
  const completedSorted = sortedHistories.filter(i => i.status === 'completed');
  const matchedCompletedIds = new Set(matchedHistories.filter(i => i.status === 'completed').map(i => i.id));

  return (
    <div
      className={`border-l border-theme bg-theme-secondary transition-all duration-300 overflow-hidden ${
        open ? 'w-80' : 'w-0'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="h-full flex flex-col p-4 w-80">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-theme-heading">Saved Storybooks</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-theme-hover transition"
          >
            <Icon icon={Cancel01IconData} className="w-5 text-theme-muted" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
          {/* Drafts section */}
          {drafts.length > 0 && (
            <>
              <div
                className="flex items-center gap-1 cursor-pointer select-none py-1"
                onClick={() => setDraftsExpanded(!draftsExpanded)}
              >
                <span className="text-xs text-theme-muted transition-transform" style={{ display: 'inline-block', transform: draftsExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>&#9654;</span>
                <span className="text-sm font-medium text-amber-500">Drafts ({drafts.length})</span>
              </div>
              {draftsExpanded && (
                <div className="space-y-2">
                  {drafts.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onLoad(item)}
                      className={`p-3 rounded-lg cursor-pointer transition group hover:bg-theme-subtle ${
                        currentDraftId === item.id ? 'bg-theme-surface shadow-sm' : 'bg-theme-tertiary'
                      }`}
                      style={{ border: '1px dashed rgb(217 119 6 / 0.5)' }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 uppercase tracking-wide">Draft</span>
                            <p className="text-sm font-medium text-theme-heading line-clamp-2">{item.formData.title || 'Untitled'}</p>
                          </div>
                          <p className="text-xs text-theme-hint mt-1">
                            {item.formData.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${item.formData.gradeLevel}`}
                            {item.formData.subject && ` · ${item.formData.subject}`}
                            {' · '}{new Date(item.savedAt).toLocaleDateString()} {new Date(item.savedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                          title="Delete draft"
                        >
                          <Icon icon={Delete02IconData} className="w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-b border-theme my-2"></div>
            </>
          )}

          {/* Completed / Saved section */}
          {drafts.length === 0 && completedSorted.length === 0 ? (
            <div className="text-center text-theme-hint mt-8">
              <Icon icon={BookOpen01IconData} className="w-12 mx-auto mb-2 text-theme-hint" />
              <p className="text-sm">No saved storybooks yet</p>
            </div>
          ) : (
            <>
              {matchCount > 0 && completedSorted.some(i => matchedCompletedIds.has(i.id)) && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-blue-400">Matching ({matchedCompletedIds.size})</span>
                </div>
              )}
              {completedSorted.map((item, idx) => (
                <React.Fragment key={item.id}>
                  {matchCount > 0 && idx > 0 && matchedCompletedIds.has(completedSorted[idx - 1].id) && !matchedCompletedIds.has(item.id) && (
                    <div className="border-b border-theme my-3">
                      <span className="text-xs text-theme-muted">Other</span>
                    </div>
                  )}
                  <div
                    onClick={() => onLoad(item)}
                    className={`p-3 rounded-lg cursor-pointer transition group hover:bg-theme-subtle ${
                      currentDraftId === item.id ? 'bg-theme-surface shadow-sm' : 'bg-theme-tertiary'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium text-theme-heading line-clamp-2">
                            {item.formData.title || 'Untitled'}
                          </p>
                          {item.hasImages && (
                            <span title="Images saved" className="shrink-0 text-green-500"><Icon icon={Image01IconData} className="w-3.5" /></span>
                          )}
                          {item.hasAudio && (
                            <span title="Audio saved" className="shrink-0 text-blue-500"><Icon icon={Mic01IconData} className="w-3.5" /></span>
                          )}
                        </div>
                        <p className="text-xs text-theme-hint mt-1">
                          {item.formData.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${item.formData.gradeLevel}`}
                          {item.formData.subject && ` · ${item.formData.subject}`}
                          {item.parsedBook && ` · ${item.parsedBook.pages.length} pages`}
                          {' · '}{new Date(item.savedAt).toLocaleDateString()} {new Date(item.savedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                        title="Delete storybook"
                      >
                        <Icon icon={Delete02IconData} className="w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </>
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

function FlashcardSlide({
  question,
  showAnswer,
  questionNumber,
  totalQuestions,
  accentColor,
}: {
  question: ComprehensionQuestion;
  showAnswer: boolean;
  questionNumber: number;
  totalQuestions: number;
  accentColor: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-8" style={{ perspective: '1200px' }}>
      <div className="text-white/40 text-sm mb-4 font-sans">
        Question {questionNumber} of {totalQuestions}
      </div>
      <div
        className="relative w-full max-w-xl"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s ease',
          transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front — Question */}
        <div
          className="rounded-2xl p-10 text-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <div className="text-sm font-sans font-semibold mb-4" style={{ color: accentColor }}>QUESTION</div>
          <p className="text-2xl text-white leading-relaxed">{question.question}</p>
          <div className="mt-6 text-white/30 text-sm font-sans">Press → to reveal answer</div>
        </div>
        {/* Back — Answer */}
        <div
          className="absolute inset-0 rounded-2xl p-10 text-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <div className="text-white/40 text-sm font-sans mb-2">{question.question}</div>
          <div className="mx-auto my-4" style={{ width: 60, height: 2, background: accentColor }} />
          <div className="text-sm font-sans font-semibold mb-3" style={{ color: accentColor }}>ANSWER</div>
          <p className="text-xl text-white leading-relaxed">{question.answer}</p>
          {question.outcomeRef && (
            <div className="mt-4 text-white/25 text-xs font-sans">Outcome: {question.outcomeRef}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlaybackView({
  book,
  onClose,
  accentColor,
  cachedAudio,
}: {
  book: ParsedStorybook;
  onClose: () => void;
  accentColor: string;
  cachedAudio?: Map<string, Blob> | null;
}) {
  const [pageIdx, setPageIdx] = useState(0);
  const [phase, setPhase] = useState<'bg' | 'char' | 'text' | 'done'>('bg');
  const [segmentIdx, setSegmentIdx] = useState(0);
  const { speak, stop, isSpeaking } = useTTS();
  const [autoPlay, setAutoPlay] = useState(true);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cachedAudioRef = useRef<HTMLAudioElement | null>(null);

  const totalPages = book.pages.length;
  const questions = book.comprehensionQuestions ?? [];
  const questionSlideCount = questions.length * 2;
  const totalSlides = totalPages + questionSlideCount;

  // Derived: is this a question slide?
  const isQuestionSlide = pageIdx >= totalPages;
  const questionDataIdx = isQuestionSlide ? Math.floor((pageIdx - totalPages) / 2) : -1;
  const isAnswerFace = isQuestionSlide ? (pageIdx - totalPages) % 2 === 1 : false;
  const currentQuestion = isQuestionSlide ? questions[questionDataIdx] : null;

  const page = isQuestionSlide ? null : book.pages[pageIdx];

  const clearTimer = () => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
  };

  const speakSegment = useCallback((idx: number) => {
    if (!page || idx >= page.textSegments.length) {
      setPhase('done');
      return;
    }

    // Check for cached audio first
    const cacheKey = `${pageIdx}:${idx}`;
    const cachedBlob = cachedAudio?.get(cacheKey);

    if (cachedBlob) {
      // Play from cache
      const url = URL.createObjectURL(cachedBlob);
      const audio = new Audio(url);
      cachedAudioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        cachedAudioRef.current = null;
        setSegmentIdx(idx + 1);
        speakSegment(idx + 1);
      };
      audio.play().catch(() => {
        URL.revokeObjectURL(url);
        // Fallback to live TTS if cached playback fails
        const seg = page.textSegments[idx];
        const voice = book.voiceAssignments?.[seg.speaker] || 'lessac';
        speak(seg.text, () => {
          setSegmentIdx(idx + 1);
          speakSegment(idx + 1);
        }, voice, settings.language);
      });
      return;
    }

    // Fall back to live TTS
    const seg = page.textSegments[idx];
    const voice = book.voiceAssignments?.[seg.speaker] || 'lessac';
    speak(seg.text, () => {
      setSegmentIdx(idx + 1);
      speakSegment(idx + 1);
    }, voice, settings.language);
  }, [page, pageIdx, book.voiceAssignments, speak, cachedAudio]);

  const stopAll = useCallback(() => {
    stop();
    if (cachedAudioRef.current) {
      cachedAudioRef.current.pause();
      cachedAudioRef.current = null;
    }
  }, [stop]);

  // Animate phases: bg → char (500ms) → text (800ms) → TTS
  // Skip phase animation for question slides
  useEffect(() => {
    if (isQuestionSlide) {
      setPhase('done');
      setSegmentIdx(0);
      stopAll();
      clearTimer();
      return;
    }
    setPhase('bg');
    setSegmentIdx(0);
    stopAll();
    clearTimer();
    phaseTimerRef.current = setTimeout(() => setPhase('char'), 400);
    return clearTimer;
  }, [pageIdx]);

  useEffect(() => {
    if (isQuestionSlide) return;
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
    stopAll();
    if (pageIdx < totalSlides - 1) setPageIdx(p => p + 1);
  }, [pageIdx, totalSlides, stopAll]);

  const prevPage = useCallback(() => {
    stopAll();
    setPageIdx(p => Math.max(0, p - 1));
  }, [stopAll]);

  // Auto-advance after TTS finishes on last segment
  // Do NOT auto-advance on question slides — teacher controls the pace
  useEffect(() => {
    if (phase === 'done' && autoPlay && !isQuestionSlide && pageIdx < totalSlides - 1) {
      phaseTimerRef.current = setTimeout(nextPage, 1500);
    }
    return clearTimer;
  }, [phase, autoPlay, pageIdx, totalSlides, nextPage, isQuestionSlide]);

  const charAnim = page?.characterAnimation || 'fadeIn';
  const hasChar = page && (page.characterImageData || page.characterScene) && page.imagePlacement !== 'none';

  // Page label
  const pageLabel = isQuestionSlide
    ? `Question ${questionDataIdx + 1} of ${questions.length}${isAnswerFace ? ' (Answer)' : ''}`
    : `${pageIdx + 1} / ${totalPages}`;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/80">
        <button onClick={() => { stopAll(); onClose(); }} className="text-white/70 hover:text-white flex items-center gap-1 text-sm">
          <Icon icon={Cancel01IconData} className="w-4" /> Exit
        </button>
        <div className="text-white/60 text-sm">{pageLabel}</div>
        <div className="flex items-center gap-3">
          {!isQuestionSlide && (
          <>
          <button
            onClick={() => setAutoPlay(a => !a)}
            className="text-white/60 hover:text-white text-xs flex items-center gap-1"
          >
            {autoPlay ? <Icon icon={PauseIconData} className="w-4" /> : <Icon icon={PlayIconData} className="w-4" />}
            {autoPlay ? 'Pause Auto' : 'Auto Play'}
          </button>
          <button onClick={() => { stopAll(); speakSegment(0); }} className="text-white/60 hover:text-white">
            <Icon icon={RefreshIconData} className="w-4" />
          </button>
          </>
          )}
        </div>
      </div>

      {/* Page */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {/* Background */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${phase !== 'bg' || isQuestionSlide ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: isQuestionSlide
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
              : page?.bundledSceneId
                ? `${SCENE_BG_COLORS[(BUNDLED_SCENES.find(s => s.id === page.bundledSceneId)?.category) || 'outdoors']}cc`
                : '#1a1a2e',
          }}
        >
          {!isQuestionSlide && page?.backgroundImageData && (
            <img src={page.backgroundImageData} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Page content */}
        {isQuestionSlide && currentQuestion ? (
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <FlashcardSlide
              question={currentQuestion}
              showAnswer={isAnswerFace}
              questionNumber={questionDataIdx + 1}
              totalQuestions={questions.length}
              accentColor={accentColor}
            />
          </div>
        ) : (
        <div className="relative z-10 w-full max-w-4xl mx-auto px-8 py-6 flex items-center gap-8 min-h-[60vh]">
          {/* Character */}
          {hasChar && page!.imagePlacement === 'left' && (
            <div className={`flex-shrink-0 w-48 animate__animated animate__${charAnim} ${phase === 'char' || phase === 'text' || phase === 'done' ? '' : 'invisible'}`}>
              {page!.characterImageData
                ? <img src={page!.characterImageData} alt="character" className="w-full drop-shadow-2xl" />
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
          {hasChar && page!.imagePlacement === 'right' && (
            <div className={`flex-shrink-0 w-48 animate__animated animate__${charAnim} ${phase === 'char' || phase === 'text' || phase === 'done' ? '' : 'invisible'}`}>
              {page!.characterImageData
                ? <img src={page!.characterImageData} alt="character" className="w-full drop-shadow-2xl" />
                : <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center"><Icon icon={UserIconData} className="w-16" style={{ color: 'rgba(255,255,255,0.5)' }} /></div>
              }
            </div>
          )}
        </div>
        )}

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
          disabled={pageIdx === totalSlides - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white disabled:opacity-20 transition-opacity"
        >
          <Icon icon={ArrowRight01IconData} className="w-8" />
        </button>
      </div>

      {/* Page dots */}
      <div className="flex justify-center gap-1.5 py-3">
        {Array.from({ length: totalSlides }, (_, i) => {
          const isQDot = i >= totalPages;
          return (
            <button
              key={i}
              onClick={() => { stopAll(); setPageIdx(i); }}
              className={`w-2 h-2 transition-all ${isQDot ? 'rounded-sm' : 'rounded-full'}`}
              style={{ background: i === pageIdx ? accentColor : isQDot ? 'rgba(255,200,100,0.25)' : 'rgba(255,255,255,0.3)' }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Streaming Page Preview (real-time text streaming in editor) ─────────────

function StreamingPagePreview({
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

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-theme shadow-sm"
      style={{ background: bgColor, aspectRatio: '297 / 210', fontFamily: 'Georgia, serif' }}
    >
      <div className="relative z-10 p-6">
        <div className="space-y-2">
          {page.textSegments.map((seg, i) => (
            <p
              key={i}
              className={`leading-relaxed text-gray-800 ${seg.speaker === 'narrator' ? 'italic text-base' : 'font-semibold text-base'}`}
              style={{
                animation: 'streamFadeIn 0.3s ease both',
                animationDelay: `${i * 0.05}s`,
              }}
            >
              {seg.speaker !== 'narrator' && (
                <span className="text-xs font-bold text-purple-600 not-italic block">{seg.speaker}:</span>
              )}
              {seg.speaker !== 'narrator' ? `"${seg.text}"` : seg.text}
            </p>
          ))}
          {/* Typing indicator */}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
      {/* Writing badge */}
      <div className="absolute bottom-2 right-2 text-xs bg-black/20 text-white px-2 py-0.5 rounded-full flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        Writing…
      </div>
      <style>{`
        @keyframes streamFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Skeleton Page Placeholder (ungenerated pages in editor) ─────────────────

function SkeletonPagePreview() {
  return (
    <div
      className="relative rounded-xl overflow-hidden border border-theme shadow-sm"
      style={{ background: '#f3f4f6', aspectRatio: '297 / 210' }}
    >
      <div className="relative z-10 p-6 space-y-4">
        {/* Skeleton text lines */}
        {[85, 100, 92, 70, 100, 55].map((w, i) => (
          <div
            key={i}
            className="rounded"
            style={{
              width: `${w}%`,
              height: i === 0 ? 14 : 10,
              background: 'linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 40%, #fafafa 50%, #f3f4f6 60%, #e5e7eb 100%)',
              backgroundSize: '400px 100%',
              animation: 'skeletonShimmer 1.8s ease-in-out infinite',
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-gray-400 px-2 py-0.5">
        Waiting…
      </div>
      <style>{`
        @keyframes skeletonShimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Cover Page Preview ──────────────────────────────────────────────────────

function CoverPagePreview({
  coverPage,
  accentColor,
}: {
  coverPage: CoverPage;
  accentColor: string;
}) {
  return (
    <div
      className="relative rounded-xl overflow-hidden border border-theme shadow-sm flex flex-col items-center justify-center text-center"
      style={{
        aspectRatio: '297 / 210',
        background: coverPage.coverImageData
          ? undefined
          : `linear-gradient(135deg, ${accentColor}22, ${accentColor}08)`,
        fontFamily: 'Georgia, serif',
      }}
    >
      {/* Cover image as background */}
      {coverPage.coverImageData && (
        <>
          <img
            src={coverPage.coverImageData}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        </>
      )}
      <div className="relative z-10 flex flex-col items-center justify-center gap-3 p-8 max-w-md">
        {/* Book icon */}
        {!coverPage.coverImageData && (
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2"
            style={{ background: `${accentColor}22` }}
          >
            <Icon icon={BookOpen01IconData} className="w-7" style={{ color: accentColor }} />
          </div>
        )}
        <h1
          className="text-2xl font-bold leading-tight"
          style={{ color: coverPage.coverImageData ? '#fff' : '#1f2937' }}
        >
          {coverPage.title || 'Untitled Story'}
        </h1>
        {coverPage.subtitle && (
          <p
            className="text-sm"
            style={{ color: coverPage.coverImageData ? 'rgba(255,255,255,0.7)' : '#6b7280' }}
          >
            {coverPage.subtitle}
          </p>
        )}
        {coverPage.authorName && (
          <p
            className="text-sm mt-1"
            style={{ color: coverPage.coverImageData ? 'rgba(255,255,255,0.8)' : accentColor }}
          >
            by {coverPage.authorName}
          </p>
        )}
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

  // Separate narrator vs character segments for bubble rendering
  const narratorSegments = page.textSegments.filter(seg => !shouldUseBubble(seg, page));
  const characterSegments = page.textSegments.filter(seg => shouldUseBubble(seg, page));
  // Show the last character speech bubble (static preview shows most recent)
  const activeBubbleSeg = characterSegments.length > 0 ? characterSegments[characterSegments.length - 1] : null;
  const tailDir = getTailDirection(page);

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-theme shadow-sm"
      style={{ background: bgColor, aspectRatio: '297 / 210', fontFamily: 'Georgia, serif' }}
    >
      {page.backgroundImageData && (
        <img src={page.backgroundImageData} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      )}
      <div className="relative z-10 p-6">
        {/* Character + speech bubble layout */}
        {hasChar && (
          <div
            className={`${page.imagePlacement === 'left' ? 'float-left mr-4' : 'float-right ml-4'} mb-2`}
            style={{ position: 'relative', width: 120 }}
          >
            <img
              src={page.characterImageData!}
              alt="character"
              className="rounded-lg shadow-md"
              style={{ width: 120, shapeOutside: `url(${page.characterImageData})`, shapeMargin: '12px' }}
            />
            {activeBubbleSeg && (
              <div
                style={{
                  position: 'absolute',
                  top: -8,
                  [page.imagePlacement === 'left' ? 'left' : 'right']: '100%',
                  marginLeft: page.imagePlacement === 'left' ? 4 : undefined,
                  marginRight: page.imagePlacement === 'right' ? 4 : undefined,
                  zIndex: 20,
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))',
                }}
                dangerouslySetInnerHTML={{
                  __html: buildSpeechBubbleSVG({
                    text: activeBubbleSeg.text,
                    tailDirection: tailDir,
                    context: 'editor',
                  }),
                }}
              />
            )}
          </div>
        )}
        <div className="space-y-2">
          {narratorSegments.map((seg, i) => (
            <p key={i} className="leading-relaxed text-gray-800 italic text-base">
              {seg.text}
            </p>
          ))}
          {/* Fallback: character dialogue without image rendered as text */}
          {!hasChar && page.textSegments.filter(s => s.speaker !== 'narrator').map((seg, i) => (
            <p key={`char-${i}`} className="leading-relaxed text-gray-800 font-semibold text-base">
              <span className="text-xs font-bold text-purple-600 not-italic block">{seg.speaker}:</span>
              {`"${seg.text}"`}
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
  isActive?: boolean;
}

type View = 'input' | 'streaming' | 'editor' | 'playing' | 'history';

// ─── Resource Image Picker (for importing backgrounds) ─────────────────────

function ResourceImagePicker({ onSelect, onClose, accentColor }: {
  onSelect: (imageData: string) => void;
  onClose: () => void;
  accentColor: string;
}) {
  const [images, setImages] = useState<{ id: string; title: string; imageUrl: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/images-history')
      .then(r => r.json())
      .then((data: any[]) => {
        setImages(data.filter(d => d.imageUrl).map(d => ({ id: d.id, title: d.title || 'Untitled', imageUrl: d.imageUrl })));
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[70vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-theme">
          <h3 className="font-semibold text-theme-heading">Choose Background Image</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-theme-hover">
            <Icon icon={Cancel01IconData} className="w-5 text-theme-muted" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icon icon={Loading03IconData} className="w-6 animate-spin" style={{ color: accentColor }} />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-theme-muted">
              <Icon icon={Image01IconData} className="w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No saved images found.</p>
              <p className="text-xs mt-1">Generate images in the Image Generator to see them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {images.map(img => (
                <button
                  key={img.id}
                  onClick={() => onSelect(img.imageUrl)}
                  className="rounded-lg overflow-hidden border-2 border-transparent hover:border-current transition-all group"
                  style={{ color: accentColor }}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-20 object-cover group-hover:scale-105 transition-transform"
                  />
                  <p className="text-[10px] text-theme-muted truncate px-1 py-0.5">{img.title}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StoryBookCreator({ tabId, savedData, onDataChange }: StoryBookCreatorProps) {
  const { settings } = useSettings();
  const { hasDiffusion, hasVision, tier } = useCapabilities();
  const { getConnection, getStreamingContent, getIsStreaming, clearStreaming } = useWebSocket();
  const { enqueue, queueEnabled } = useQueue();
  const { speak, stop: stopTTS, isSpeaking } = useTTS();
  const { guardOffline } = useOfflineGuard();

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
  const [narrativePreview, setNarrativePreview] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<AnimatedHTMLProgress | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [storyMatchCount, setStoryMatchCount] = useState(0);
  const [showExportSettings, setShowExportSettings] = useState(false);
  const [exportSettings, setExportSettingsState] = useState<StorybookExportSettings>(() => getExportSettings());
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  // Image generation pipeline state
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [imageGenProgress, setImageGenProgress] = useState<{ current: number; total: number; stage: 'character' | 'background' } | null>(null);
  const imageGenAbortRef = useRef<AbortController | null>(null);
  // Save dialog state
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveIncludeImages, setSaveIncludeImages] = useState(true);
  const [saveIncludeAudio, setSaveIncludeAudio] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState<{ current: number; total: number } | null>(null);
  // Cached audio for playback (loaded from IndexedDB)
  const cachedAudioRef = useRef<Map<string, Blob> | null>(null);
  const [isRestoringImages, setIsRestoringImages] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadPageIdxRef = useRef<number>(0);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const bgUploadPageIdxRef = useRef<number>(0);
  const [showBgImportMenu, setShowBgImportMenu] = useState<number | null>(null);
  const [showResourcePicker, setShowResourcePicker] = useState(false);

  // ── Restore saved data ─────────────────────────────────────────────────────
  useEffect(() => {
    if (savedData) {
      const fd = savedData.formData ? { ...DEFAULT_FORM, ...savedData.formData } : DEFAULT_FORM;
      if (savedData.formData) setFormData(fd);
      if (savedData.parsedBook) {
        let book = savedData.parsedBook as ParsedStorybook;
        // Backward compat: build coverPage if missing
        if (!book.coverPage) {
          const gl = fd.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${fd.gradeLevel}`;
          book = {
            ...book,
            coverPage: {
              title: book.title,
              subtitle: `${gl}${fd.subject ? ' • ' + fd.subject : ''}`,
              authorName: fd.authorName || undefined,
            },
          };
        }
        setParsedBook(book);
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
    settings.language
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
    if (guardOffline()) return;
    if (!validate()) return;
    clearStreaming(tabId, WS_ENDPOINT);
    setLivePages([]);
    setGenerationPhase('idle');
    setView('streaming');

    if (queueEnabled) {
      const prompt = buildStorybookPrompt(formData, settings.language);
      enqueue({
        label: `Storybook - ${formData.title.slice(0, 40)}`,
        toolType: 'Storybook',
        tabId,
        endpoint: WS_ENDPOINT,
        prompt,
        generationMode: 'queued',
        extraMessageData: { grade: formData.gradeLevel },
      });
      return;
    }

    const ws = getConnection(tabId, WS_ENDPOINT);
    wsRef.current = ws;

    // Single-pass for all tiers — the single-pass prompt already produces the
    // full JSON structure.  Two-pass doubled generation time with no quality gain.
    const useTwoPass = false;

    if (useTwoPass) {
      // Listen for two-pass status messages and narrative preview tokens
      setNarrativePreview('');
      const statusHandler = (event: MessageEvent) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'status') {
            if (msg.status === 'writing_story') setGenerationPhase('writing_story');
            else if (msg.status === 'formatting_pages') {
              setGenerationPhase('formatting_pages');
              setNarrativePreview('');  // clear preview when moving to Pass 2
            }
          } else if (msg.type === 'narrative_token' && msg.content) {
            setNarrativePreview(prev => prev + msg.content);
          }
        } catch { /* ignore non-JSON */ }
      };
      ws.addEventListener('message', statusHandler);
    }

    const prompt = buildStorybookPrompt(formData, settings.language);
    const payload: Record<string, unknown> = { prompt, grade: formData.gradeLevel };

    if (useTwoPass) {
      payload.twoPass = true;
      payload.narrativePrompt = buildNarrativePrompt(formData);
      payload.structurePromptTemplate = buildStructurePromptTemplate(formData);
    }

    const send = () => ws.send(JSON.stringify(payload));
    if (ws.readyState === WebSocket.OPEN) send();
    else ws.addEventListener('open', send, { once: true });

    // Preload diffusion pipeline during story generation so images are ready when needed
    if (formData.imageMode !== 'none' && hasDiffusion) {
      fetch('http://localhost:8000/api/image-service/preload', { method: 'POST' }).catch(() => {});
    }
  }, [guardOffline, formData, tabId, tier, hasDiffusion, getConnection, clearStreaming]);

  // ── Watch streaming content ────────────────────────────────────────────────
  const isStreaming = getIsStreaming(tabId, WS_ENDPOINT);
  const streamingContent = getStreamingContent(tabId, WS_ENDPOINT);

  // Track which page the AI is currently streaming (for auto-advance in editor)
  const prevLivePagesCountRef = useRef(0);

  useEffect(() => {
    if (!streamingContent) return;
    const partial = tryParsePartialPages(streamingContent);
    if (partial.length > 0) {
      setLivePages(partial);

      // Transition from skeleton to editor as soon as first page arrives
      if (view === 'streaming' && partial.length >= 1) {
        // Build a temporary parsedBook with completed pages + placeholders for remaining
        const completedPages: StoryPage[] = partial.map(p => ({
          ...p,
          bundledSceneId: findBestScene(p.sceneId).id,
        }));
        // Create placeholder pages for ones not yet generated
        const totalExpected = formData.pageCount;
        const placeholders: StoryPage[] = [];
        for (let i = completedPages.length; i < totalExpected; i++) {
          placeholders.push({
            pageNumber: i + 1,
            textSegments: [],
            sceneId: 'default',
            imagePlacement: 'none',
            characterAnimation: 'fadeIn',
            textAnimation: 'fadeIn',
          });
        }
        const allPages = [...completedPages, ...placeholders];
        setParsedBook(prev => {
          // Preserve any top-level fields if we already have a partial book
          const base = prev || { title: formData.title || 'Generating...', gradeLevel: formData.gradeLevel, pages: [], scenes: [], styleSuffix: '' };
          // Build cover page if not already present
          const gl = formData.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${formData.gradeLevel}`;
          const coverPage = base.coverPage || {
            title: formData.title || 'Generating...',
            subtitle: `${gl}${formData.subject ? ' • ' + formData.subject : ''}`,
            authorName: formData.authorName || undefined,
          };
          return { ...base, pages: allPages, coverPage };
        });
        setCurrentPageIdx(0);
        setView('editor');
      } else if (view === 'editor' && isStreaming) {
        // Update in-progress pages in the editor as more content streams in
        setParsedBook(prev => {
          if (!prev) return prev;
          const updatedPages = [...prev.pages];
          for (const lp of partial) {
            const idx = lp.pageNumber - 1;
            if (idx >= 0 && idx < updatedPages.length) {
              updatedPages[idx] = {
                ...updatedPages[idx],
                ...lp,
                bundledSceneId: updatedPages[idx].bundledSceneId || findBestScene(lp.sceneId).id,
              };
            }
          }
          return { ...prev, pages: updatedPages };
        });

        // Auto-advance to the page currently being written
        if (partial.length > prevLivePagesCountRef.current) {
          // A new page just started — navigate to it
          setCurrentPageIdx(partial.length - 1);
        }
      }
      prevLivePagesCountRef.current = partial.length;
    }

    if (!isStreaming && streamingContent) {
      // Streaming finished — parse full book
      setGenerationPhase('idle');
      setLivePages([]);
      prevLivePagesCountRef.current = 0;
      console.log('[StoryBook] Streaming done. Content length:', streamingContent.length, 'Preview:', streamingContent.substring(0, 200));
      const full = tryParseFullBook(streamingContent);
      console.log('[StoryBook] Parse result:', full ? `${full.pages.length} pages` : 'FAILED (null)');
      if (full && full.pages.length > 0) {
        // Auto-match bundled scenes
        const pages = full.pages.map(p => ({
          ...p,
          bundledSceneId: findBestScene(p.sceneId).id,
        }));
        // Validate speakers match form config
        const validated = validateSpeakers({ ...full, pages }, formData);
        // Build cover page
        const gradeLabel = formData.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${formData.gradeLevel}`;
        const coverPage: CoverPage = {
          title: validated.title || formData.title,
          subtitle: `${gradeLabel}${formData.subject ? ' • ' + formData.subject : ''}`,
          authorName: formData.authorName || undefined,
        };
        setParsedBook({ ...validated, coverPage });
        setCurrentPageIdx(-1);
        setView('editor');
        // Auto-save completed storybook
        const saved = saveStorybook(formData, validated, currentDraftId || undefined);
        setCurrentDraftId(saved.id);
        // User can click "Generate Images" or generate per-page individually
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

  // ── Background image upload ────────────────────────────────────────────────
  const handleBgUpload = (pageIdx: number) => {
    bgUploadPageIdxRef.current = pageIdx;
    bgFileInputRef.current?.click();
  };

  const onBgFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUri = ev.target?.result as string;
      const compressed = await compressImage(dataUri, { maxWidth: 1024, maxHeight: 576, format: 'webp' });
      updatePage(bgUploadPageIdxRef.current, { backgroundImageData: compressed });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResourceImageSelect = (imageData: string) => {
    compressImage(imageData, { maxWidth: 1024, maxHeight: 576, format: 'webp' }).then(compressed => {
      updatePage(currentPageIdx, { backgroundImageData: compressed });
    });
    setShowResourcePicker(false);
  };

  // ── AI Image Generation Pipeline ──────────────────────────────────────────

  /** Generate all images for the current book (backgrounds + characters). */
  const handleGenerateAllImages = useCallback(async (book?: ParsedStorybook) => {
    if (guardOffline()) return;
    const target = book || parsedBook;
    if (!target || isGeneratingImages) return;

    const abort = new AbortController();
    imageGenAbortRef.current = abort;
    setIsGeneratingImages(true);
    setImageGenProgress(null);

    // Detect narrator-only: speakerCount === 1 means no character speakers
    const isNarratorOnly = formData.speakerCount === 1;

    try {
      const result = await generateAllPageImages(target, {
        onProgress: (current, total, stage) => {
          setImageGenProgress({ current, total, stage });
        },
        // Incremental rendering: apply each image as soon as it's ready
        onPageResult: (pageResult) => {
          setParsedBook(prev => {
            if (!prev) return prev;
            const page = prev.pages[pageResult.pageIndex];
            if (!page) return prev;
            const updatedPages = [...prev.pages];
            updatedPages[pageResult.pageIndex] = {
              ...page,
              ...(pageResult.characterImageData && { characterImageData: pageResult.characterImageData }),
              ...(pageResult.characterSeed != null && { characterSeed: pageResult.characterSeed }),
              ...(pageResult.backgroundImageData && { backgroundImageData: pageResult.backgroundImageData }),
            };
            return { ...prev, pages: updatedPages };
          });
        },
        onError: (msg) => {
          setSaveToast(msg);
          setTimeout(() => setSaveToast(null), 3000);
        },
        characterSeed: target.pages.find(p => p.characterSeed)?.characterSeed,
        characterReferenceImages: target.characterReferenceImages,
        narratorOnly: isNarratorOnly,
        signal: abort.signal,
      });

      // Store character reference images for future regeneration
      if (result.characterReferenceImages && Object.keys(result.characterReferenceImages).length > 0) {
        setParsedBook(prev => {
          if (!prev) return prev;
          return { ...prev, characterReferenceImages: result.characterReferenceImages };
        });
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error('[StoryBook] Image generation pipeline failed:', e);
        setSaveToast('Image generation failed — check console');
        setTimeout(() => setSaveToast(null), 3000);
      }
    } finally {
      setIsGeneratingImages(false);
      setImageGenProgress(null);
      imageGenAbortRef.current = null;
    }
  }, [guardOffline, parsedBook, isGeneratingImages, formData.speakerCount]);

  /** Generate a single page's character image. */
  const handleGeneratePageImage = useCallback(async (pageIdx: number) => {
    if (guardOffline()) return;
    if (!parsedBook) return;
    const page = parsedBook.pages[pageIdx];
    if (!page?.characterScene) return;

    setIsRemovingBg(pageIdx); // reuse spinner state

    const styleSuffix = parsedBook.styleSuffix || "flat vector illustration, children's book style, bold outlines, pastel colors, bright and cheerful, simple shapes, no text";
    const charDescs = parsedBook.characterDescriptions || {};

    // Try to reuse seed and reference image from prior generation for consistency
    const existingSeed = parsedBook.pages.find(p => p.characterSeed)?.characterSeed;
    const existingRef = parsedBook.characterReferenceImages
      ? Object.values(parsedBook.characterReferenceImages)[0]
      : undefined;

    try {
      let rawChar: string;
      let seed: number;

      if (existingRef && existingSeed != null) {
        // Use img2img from reference for consistent character with new pose
        const result = await generateCharacterFromReference(
          charDescs, page.characterScene, styleSuffix, existingSeed, existingRef, 0.55,
        );
        rawChar = result.imageData;
        seed = result.seed;
      } else {
        // First character generation — create fresh and save as reference
        const result = await generateCharacterImage(
          charDescs, page.characterScene, styleSuffix, existingSeed,
        );
        rawChar = result.imageData;
        seed = result.seed;

        // Store as reference for future generations
        const charName = Object.keys(charDescs)[0] || 'default';
        setParsedBook(prev => {
          if (!prev) return prev;
          return { ...prev, characterReferenceImages: { ...prev.characterReferenceImages, [charName]: rawChar } };
        });
      }

      let finalChar: string;
      try {
        finalChar = await removeCharacterBg(rawChar);
      } catch {
        finalChar = rawChar;
      }
      updatePage(pageIdx, {
        characterImageData: finalChar,
        characterSeed: seed,
        imagePlacement: page.imagePlacement === 'none' ? 'right' : page.imagePlacement,
      });
    } catch (e) {
      console.error(`[StoryBook] Failed to generate image for page ${pageIdx + 1}:`, e);
      setSaveToast(`Character image failed for page ${pageIdx + 1}`);
      setTimeout(() => setSaveToast(null), 3000);
    } finally {
      setIsRemovingBg(null);
    }
  }, [guardOffline, parsedBook]);

  /** Generate a single page's background image. */
  const handleGeneratePageBackground = useCallback(async (pageIdx: number) => {
    if (!parsedBook) return;
    const page = parsedBook.pages[pageIdx];
    const scene = parsedBook.scenes.find(s => s.id === page.sceneId);
    if (!scene) return;

    setIsRemovingBg(pageIdx); // reuse spinner state

    const styleSuffix = parsedBook.styleSuffix || "flat vector illustration, children's book style, bold outlines, pastel colors, bright and cheerful, simple shapes, no text";

    // Narrator-only: fold character/subject descriptions into the background
    const isNarratorOnly = formData.speakerCount === 1;
    const subjectDescs = isNarratorOnly ? (parsedBook.characterDescriptions || undefined) : undefined;

    try {
      const imgData = await generateBackgroundImage(scene.description, styleSuffix, subjectDescs);
      // Apply to ALL pages sharing the same sceneId
      const targetSceneId = page.sceneId;
      setParsedBook(prev => {
        if (!prev) return prev;
        const pages = prev.pages.map(p =>
          p.sceneId === targetSceneId ? { ...p, backgroundImageData: imgData } : p
        );
        return { ...prev, pages };
      });
    } catch (e) {
      console.error(`[StoryBook] Failed to generate background for page ${pageIdx + 1}:`, e);
    } finally {
      setIsRemovingBg(null);
    }
  }, [parsedBook]);

  /** Cancel an in-progress image generation pipeline. */
  const handleCancelImageGen = useCallback(() => {
    imageGenAbortRef.current?.abort();
  }, []);

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
    // If no parsed book yet (draft), save immediately without dialog
    if (!parsedBook) {
      const saved = saveStorybook(formData, null, currentDraftId || undefined);
      setCurrentDraftId(saved.id);
      setSaveToast('Draft saved!');
      setTimeout(() => setSaveToast(null), 2000);
      return;
    }
    // Show save options dialog for completed storybooks
    setSaveIncludeImages(true);
    setSaveIncludeAudio(false);
    setShowSaveDialog(true);
  }, [formData, parsedBook, currentDraftId]);

  const handleConfirmSave = useCallback(async () => {
    setIsSaving(true);
    setSaveProgress(null);
    try {
      const saved = saveStorybook(formData, parsedBook, currentDraftId || undefined, {
        includeImages: saveIncludeImages,
        includeAudio: saveIncludeAudio,
      });
      setCurrentDraftId(saved.id);

      // Pre-generate and save audio if requested
      if (saveIncludeAudio && parsedBook) {
        const entries: AudioEntry[] = [];
        const totalSegs = parsedBook.pages.reduce((sum, p) => sum + p.textSegments.length, 0);
        let done = 0;

        for (let pi = 0; pi < parsedBook.pages.length; pi++) {
          const page = parsedBook.pages[pi];
          for (let si = 0; si < page.textSegments.length; si++) {
            const seg = page.textSegments[si];
            const voice = parsedBook.voiceAssignments?.[seg.speaker] || 'lessac';
            setSaveProgress({ current: done, total: totalSegs });
            try {
              const blob = await fetchTTSBlob(seg.text, voice);
              entries.push({ pageIndex: pi, segmentIndex: si, blob });
            } catch {
              // Skip failed segments
            }
            done++;
          }
        }
        setSaveProgress({ current: totalSegs, total: totalSegs });
        await saveStorybookAudio(saved.id, entries);

        // Update the localStorage entry to mark hasAudio
        const items = getSavedStorybooks();
        const idx = items.findIndex(s => s.id === saved.id);
        if (idx !== -1) {
          items[idx].hasAudio = true;
          localStorage.setItem('storybook_history', JSON.stringify(items));
        }
      }

      setShowSaveDialog(false);
      setSaveToast('Storybook saved!');
      setTimeout(() => setSaveToast(null), 2000);
    } catch (e) {
      console.error('[StoryBook] Save failed:', e);
      setSaveToast('Save failed');
      setTimeout(() => setSaveToast(null), 2000);
    } finally {
      setIsSaving(false);
      setSaveProgress(null);
    }
  }, [formData, parsedBook, currentDraftId, saveIncludeImages, saveIncludeAudio]);

  const handleLoadSaved = useCallback(async (saved: SavedStorybook) => {
    setFormData({ ...DEFAULT_FORM, ...saved.formData });
    setCurrentDraftId(saved.id);
    if (saved.parsedBook && saved.parsedBook.pages.length > 0) {
      // Backward compatibility: build coverPage if missing
      let book = saved.parsedBook;
      if (!book.coverPage) {
        const gl = saved.formData.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${saved.formData.gradeLevel}`;
        book = {
          ...book,
          coverPage: {
            title: book.title,
            subtitle: `${gl}${saved.formData.subject ? ' • ' + saved.formData.subject : ''}`,
            authorName: saved.formData.authorName || undefined,
          },
        };
      }
      setParsedBook(book);
      setView('editor');

      // Restore images from IndexedDB if available
      if (saved.hasImages) {
        setIsRestoringImages(true);
        try {
          const imageMap = await loadStorybookImages(saved.id);
          if (imageMap.size > 0) {
            setParsedBook(prev => {
              if (!prev) return prev;
              // Restore cover image
              const coverImageData = imageMap.get(`-1:cover`);
              const coverPage = prev.coverPage
                ? { ...prev.coverPage, coverImageData: coverImageData ?? prev.coverPage.coverImageData }
                : prev.coverPage;
              return {
                ...prev,
                coverPage,
                pages: prev.pages.map((p, i) => ({
                  ...p,
                  characterImageData: imageMap.get(`${i}:character`) ?? p.characterImageData,
                  backgroundImageData: imageMap.get(`${i}:background`) ?? p.backgroundImageData,
                })),
              };
            });
          }
        } catch (e) {
          console.error('[StoryBook] Failed to restore images from IndexedDB:', e);
        } finally {
          setIsRestoringImages(false);
        }
      }

      // Load cached audio if available
      if (saved.hasAudio) {
        try {
          const audioMap = await loadStorybookAudio(saved.id);
          cachedAudioRef.current = audioMap.size > 0 ? audioMap : null;
        } catch (e) {
          console.error('[StoryBook] Failed to load cached audio:', e);
          cachedAudioRef.current = null;
        }
      } else {
        cachedAudioRef.current = null;
      }
    } else {
      setParsedBook(null);
      setView('input');
      cachedAudioRef.current = null;
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
      <div className="flex h-full">
      <div className="flex-1 h-full overflow-y-auto">
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
            <button
              onClick={() => setShowHistory(prev => !prev)}
              className="relative p-2 rounded-lg hover:bg-theme-hover transition"
              title="Storybook History"
            >
              <Icon icon={Clock01IconData} className="w-5 text-theme-muted" />
              {storyMatchCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold leading-none px-1">{storyMatchCount}</span>
              )}
            </button>
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

          {/* Author Name */}
          <div>
            <label className="block text-sm font-medium text-theme-label mb-1.5">
              Author Name
            </label>
            <SmartInput
              value={formData.authorName}
              onChange={v => updateForm('authorName', v)}
              placeholder="e.g. Ms. Johnson"
              className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent"
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

          {/* Background Count — only when AI image mode */}
          {formData.imageMode === 'ai' && (
            <div>
              <label className="block text-sm font-medium text-theme-label mb-2">
                Backgrounds
                <span className="ml-1.5 text-xs font-normal text-theme-muted">
                  (suggested max: {Math.ceil(formData.pageCount / 2)})
                </span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateForm('backgroundCount', 'auto')}
                  className="px-3 py-1.5 rounded-lg text-sm border-2 transition-all"
                  style={{
                    borderColor: formData.backgroundCount === 'auto' ? accentColor : 'transparent',
                    background: formData.backgroundCount === 'auto' ? `${accentColor}18` : 'var(--bg-secondary)',
                    color: formData.backgroundCount === 'auto' ? accentColor : undefined,
                  }}
                >
                  Auto
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const current = typeof formData.backgroundCount === 'number' ? formData.backgroundCount : Math.ceil(formData.pageCount / 2);
                      updateForm('backgroundCount', Math.max(1, current - 1));
                    }}
                    className="w-7 h-7 rounded-lg border border-theme-strong hover:bg-theme-secondary flex items-center justify-center text-theme-muted text-sm"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={formData.pageCount}
                    value={typeof formData.backgroundCount === 'number' ? formData.backgroundCount : Math.ceil(formData.pageCount / 2)}
                    onChange={e => {
                      const v = Math.min(formData.pageCount, Math.max(1, Number(e.target.value) || 1));
                      updateForm('backgroundCount', v);
                    }}
                    onFocus={() => {
                      if (formData.backgroundCount === 'auto') updateForm('backgroundCount', Math.ceil(formData.pageCount / 2));
                    }}
                    className="w-12 text-center py-1 text-sm border border-theme-strong rounded-lg focus:ring-1 bg-theme"
                    style={{
                      '--tw-ring-color': accentColor,
                      borderColor: typeof formData.backgroundCount === 'number' ? accentColor : undefined,
                    } as React.CSSProperties}
                  />
                  <button
                    onClick={() => {
                      const current = typeof formData.backgroundCount === 'number' ? formData.backgroundCount : Math.ceil(formData.pageCount / 2);
                      updateForm('backgroundCount', Math.min(formData.pageCount, current + 1));
                    }}
                    className="w-7 h-7 rounded-lg border border-theme-strong hover:bg-theme-secondary flex items-center justify-center text-theme-muted text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-xs text-theme-muted mt-1.5">
                {formData.backgroundCount === 'auto'
                  ? 'The AI will decide how many unique backgrounds to use.'
                  : `The story will use exactly ${formData.backgroundCount} unique background${formData.backgroundCount === 1 ? '' : 's'}.`}
              </p>
            </div>
          )}

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

        {/* Save toast */}
        {saveToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm shadow-lg flex items-center gap-2 animate-fade-in">
            <Icon icon={Tick01IconData} className="w-4" style={{ color: '#4ade80' }} />
            {saveToast}
          </div>
        )}
      </div>
      <HistorySidePanel
        open={showHistory}
        onLoad={handleLoadSaved}
        onClose={() => setShowHistory(false)}
        accentColor={accentColor}
        currentDraftId={currentDraftId}
        formData={formData as unknown as Record<string, any>}
        onMatchCount={setStoryMatchCount}
      />
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
        {isDark
          ? <KidsStorybookSkeletonNight livePages={[]} />
          : <KidsStorybookSkeletonDay livePages={[]} />}
        {/* Cancel button overlaid on bottom-right */}
        <button
          onClick={() => { clearStreaming(tabId, WS_ENDPOINT); setView('input'); setNarrativePreview(''); setLivePages([]); }}
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
        cachedAudio={cachedAudioRef.current}
      />
    );
  }

  // ─── Render: Editor view ───────────────────────────────────────────────────
  if (!parsedBook) return null;

  const isCoverSelected = currentPageIdx === -1;
  const currentPage = isCoverSelected ? null : parsedBook.pages[currentPageIdx];

  return (
    <div className="flex h-full">
    <div className="flex-1 h-full flex flex-col overflow-hidden">
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
            {isStreaming ? (
              <>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1 align-middle" />
                Writing page {livePages.length} of {formData.pageCount}…
              </>
            ) : (
              <>
                {parsedBook.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${parsedBook.gradeLevel}`}
                {formData.subject && ` • ${formData.subject}`}
                {' • '}{parsedBook.pages.length} pages
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Cancel streaming */}
          {isStreaming && (
            <button
              onClick={() => { clearStreaming(tabId, WS_ENDPOINT); setLivePages([]); setView('input'); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Cancel
            </button>
          )}
          {/* Save */}
          {!isStreaming && <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm border border-theme-strong hover:bg-theme-secondary text-theme-muted hover:text-theme-heading"
            title="Save storybook"
          >
            <Icon icon={FloppyDiskIconData} className="w-4" />
          </button>}
          {/* History */}
          {!isStreaming && <button
            onClick={() => setShowHistory(prev => !prev)}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm border border-theme-strong hover:bg-theme-secondary text-theme-muted hover:text-theme-heading"
            title="Storybook history"
          >
            <Icon icon={Clock01IconData} className="w-4" />
            {storyMatchCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold leading-none px-1">{storyMatchCount}</span>
            )}
          </button>}
          {/* Generate All Images */}
          {!isStreaming && hasDiffusion && formData.imageMode === 'ai' && (
            isGeneratingImages ? (
              <button
                onClick={handleCancelImageGen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                <Icon icon={Loading03IconData} className="w-4 animate-spin" />
                {imageGenProgress
                  ? `${imageGenProgress.stage === 'background' ? 'Backgrounds' : 'Characters'} ${imageGenProgress.current}/${imageGenProgress.total}`
                  : 'Generating…'}
              </button>
            ) : (
              <button
                onClick={() => handleGenerateAllImages()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-theme-strong hover:bg-theme-secondary text-theme-heading"
              >
                <Icon icon={Image01IconData} className="w-4" style={{ color: accentColor }} />
                Generate Images
              </button>
            )
          )}
          {!isStreaming && (
          <>
          <button
            onClick={() => {
              if (parsedBook) {
                const missing = parsedBook.pages.some(p => !p.backgroundImageData || (!p.characterImageData && p.characterScene && p.imagePlacement !== 'none'));
                if (missing) {
                  setSaveToast('Some pages are missing images');
                  setTimeout(() => setSaveToast(null), 3000);
                }
              }
              setView('playing');
            }}
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
          </>
          )}
        </div>
      </div>

      {/* Image generation progress bar */}
      {/* Streaming progress bar */}
      {isStreaming && (
        <div className="shrink-0 px-4 py-2 bg-theme-secondary border-b border-theme">
          <div className="flex items-center gap-3">
            <Icon icon={Loading03IconData} className="w-4 animate-spin" style={{ color: accentColor }} />
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-theme-heading font-medium">Writing story…</span>
                <span className="text-theme-muted">
                  {livePages.length} / {formData.pageCount} pages
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(livePages.length / formData.pageCount) * 100}%`,
                    background: accentColor,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {isGeneratingImages && imageGenProgress && (
        <div className="shrink-0 px-4 py-2 bg-theme-secondary border-b border-theme">
          <div className="flex items-center gap-3">
            <Icon icon={Loading03IconData} className="w-4 animate-spin" style={{ color: accentColor }} />
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-theme-heading font-medium">
                  {imageGenProgress.stage === 'background' ? 'Generating backgrounds…' : 'Generating characters…'}
                </span>
                <span className="text-theme-muted">
                  {imageGenProgress.current} / {imageGenProgress.total}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(imageGenProgress.current / imageGenProgress.total) * 100}%`,
                    background: accentColor,
                  }}
                />
              </div>
            </div>
            <button
              onClick={handleCancelImageGen}
              className="text-theme-muted hover:text-red-500 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Editor tabs (Story / Questions / Export) — hidden during streaming */}
      {!isStreaming && (
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
      )}

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
          <div className="w-32 shrink-0 border-r border-theme overflow-y-auto p-2 space-y-2 bg-theme-secondary">
            {/* Cover page thumbnail */}
            {parsedBook.coverPage && (
              <button
                onClick={() => setCurrentPageIdx(-1)}
                className="w-full rounded-lg overflow-hidden border-2 transition-all text-left"
                style={{ borderColor: isCoverSelected ? accentColor : 'transparent' }}
              >
                <div
                  className="relative overflow-hidden flex items-center justify-center"
                  style={{
                    aspectRatio: '297 / 210',
                    background: parsedBook.coverPage.coverImageData
                      ? undefined
                      : `linear-gradient(135deg, ${accentColor}22, ${accentColor}08)`,
                  }}
                >
                  {parsedBook.coverPage.coverImageData ? (
                    <>
                      <img src={parsedBook.coverPage.coverImageData} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30" />
                    </>
                  ) : null}
                  <div className="relative z-10 text-center p-1">
                    <p className="text-[6px] font-bold leading-tight truncate" style={{ color: parsedBook.coverPage.coverImageData ? '#fff' : '#1f2937' }}>
                      {parsedBook.coverPage.title || 'Cover'}
                    </p>
                  </div>
                </div>
                <div className="px-1.5 py-0.5" style={{ background: isCoverSelected ? `${accentColor}10` : undefined }}>
                  <p className="text-[10px] font-semibold" style={{ color: isCoverSelected ? accentColor : undefined }}>
                    Cover
                  </p>
                </div>
              </button>
            )}
            {parsedBook.pages.map((page, i) => {
              const isActive = i === currentPageIdx;
              const isPageEmpty = page.textSegments.length === 0;
              const completedCount = livePages.length;
              const isThumbStreaming = isStreaming && i === completedCount - 1 && !isPageEmpty;
              const isThumbSkeleton = isStreaming && isPageEmpty;
              const bgScene = page.bundledSceneId
                ? BUNDLED_SCENES.find(s => s.id === page.bundledSceneId)
                : null;
              const bgColor = bgScene ? SCENE_BG_COLORS[bgScene.category] : '#f3f4f6';
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPageIdx(i)}
                  className="w-full rounded-lg overflow-hidden border-2 transition-all text-left"
                  style={{ borderColor: isActive ? accentColor : 'transparent' }}
                >
                  {/* Mini page preview */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      aspectRatio: '297 / 210',
                      background: isThumbSkeleton
                        ? 'linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%)'
                        : bgColor,
                      ...(isThumbSkeleton ? { backgroundSize: '400px 100%', animation: 'skeletonShimmer 1.8s ease-in-out infinite' } : {}),
                    }}
                  >
                    {/* Background image */}
                    {!isThumbSkeleton && page.backgroundImageData && (
                      <img src={page.backgroundImageData} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    )}
                    {/* Mini content */}
                    {isThumbStreaming ? (
                      <div className="relative z-10 p-1.5 h-full flex flex-col justify-center">
                        {page.textSegments.slice(0, 3).map((seg, j) => (
                          <p key={j} className="text-[5px] leading-[7px] text-gray-700 truncate" style={{ opacity: 0.8 }}>
                            {seg.speaker !== 'narrator' ? `${seg.speaker}: ` : ''}{seg.text}
                          </p>
                        ))}
                        <div className="flex items-center gap-0.5 mt-0.5">
                          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[5px] text-green-600">Writing…</span>
                        </div>
                      </div>
                    ) : isThumbSkeleton ? (
                      <div className="relative z-10 p-1.5 h-full flex flex-col justify-center gap-1">
                        {[70, 90, 60].map((w, j) => (
                          <div key={j} className="rounded-sm" style={{ width: `${w}%`, height: 3, background: 'rgba(0,0,0,0.08)' }} />
                        ))}
                      </div>
                    ) : (
                      <div className="relative z-10 p-1.5 h-full flex">
                        {/* Character image mini */}
                        {page.characterImageData && page.imagePlacement !== 'none' && (
                          <img
                            src={page.characterImageData}
                            alt=""
                            className="h-full max-w-[35%] object-contain flex-shrink-0"
                            style={{ opacity: 0.8, [page.imagePlacement === 'right' ? 'order' : 'order']: page.imagePlacement === 'right' ? 1 : 0 }}
                          />
                        )}
                        {/* Text content mini */}
                        <div className="flex-1 flex flex-col justify-center overflow-hidden" style={{ padding: '0 2px' }}>
                          {page.textSegments.slice(0, 4).map((seg, j) => (
                            <p key={j} className="text-[5px] leading-[7px] text-gray-700 truncate" style={{ opacity: 0.7 }}>
                              {seg.speaker !== 'narrator' ? `${seg.speaker}: ` : ''}{seg.text}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Page label */}
                  <div className="px-1.5 py-0.5" style={{ background: isActive ? `${accentColor}10` : undefined }}>
                    <p className="text-[10px] font-semibold" style={{ color: isActive ? accentColor : undefined }}>
                      P{page.pageNumber}
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
                  disabled={isCoverSelected ? !parsedBook.coverPage : currentPageIdx === 0}
                  onClick={() => setCurrentPageIdx(p => p === 0 && parsedBook.coverPage ? -1 : p - 1)}
                  className="text-theme-muted hover:text-theme-heading disabled:opacity-30"
                >
                  <Icon icon={ArrowLeft01IconData} className="w-5" />
                </button>
                <span className="text-sm text-theme-muted">
                  {isCoverSelected ? 'Cover Page' : `Page ${currentPageIdx + 1} of ${parsedBook.pages.length}`}
                </span>
                <button
                  disabled={currentPageIdx === parsedBook.pages.length - 1}
                  onClick={() => setCurrentPageIdx(p => p + 1)}
                  className="text-theme-muted hover:text-theme-heading disabled:opacity-30"
                >
                  <Icon icon={ArrowRight01IconData} className="w-5" />
                </button>
              </div>

              {isCoverSelected && parsedBook.coverPage ? (
                <CoverPagePreview coverPage={parsedBook.coverPage} accentColor={accentColor} />
              ) : currentPage ? (() => {
                const isPageEmpty = currentPage.textSegments.length === 0;
                const completedCount = livePages.length;
                const isCurrentlyStreaming = isStreaming && currentPageIdx === completedCount - 1 && !isPageEmpty;
                const isSkeletonPage = isStreaming && isPageEmpty;

                if (isSkeletonPage) {
                  return <SkeletonPagePreview />;
                } else if (isCurrentlyStreaming) {
                  return <StreamingPagePreview page={currentPage} accentColor={accentColor} />;
                } else {
                  return <PagePreview page={currentPage} accentColor={accentColor} />;
                }
              })() : null}

              {/* Image guidance note (suggested mode) */}
              {!isCoverSelected && currentPage && formData.imageMode === 'suggested' && currentPage.characterScene && (
                <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-3">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-0.5">Image Guidance</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">{currentPage.characterScene}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Edit panel (hidden during streaming) */}
          <div className={`w-72 shrink-0 border-l border-theme overflow-y-auto p-4 space-y-5 ${isStreaming ? 'hidden' : ''}`}>
            {isCoverSelected && parsedBook.coverPage ? (
              /* ── Cover Page Edit Panel ─────────────────────────────── */
              <>
                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">Cover Title</label>
                  <input
                    value={parsedBook.coverPage.title}
                    onChange={e => setParsedBook(prev => prev ? { ...prev, coverPage: { ...prev.coverPage!, title: e.target.value } } : prev)}
                    className="w-full px-3 py-2 text-sm border border-theme-strong rounded-lg bg-theme"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">Subtitle</label>
                  <input
                    value={parsedBook.coverPage.subtitle || ''}
                    onChange={e => setParsedBook(prev => prev ? { ...prev, coverPage: { ...prev.coverPage!, subtitle: e.target.value } } : prev)}
                    className="w-full px-3 py-2 text-sm border border-theme-strong rounded-lg bg-theme"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">Author Name</label>
                  <input
                    value={parsedBook.coverPage.authorName || ''}
                    onChange={e => setParsedBook(prev => prev ? { ...prev, coverPage: { ...prev.coverPage!, authorName: e.target.value } } : prev)}
                    className="w-full px-3 py-2 text-sm border border-theme-strong rounded-lg bg-theme"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">Cover Image</label>
                  <div className="space-y-2">
                    {parsedBook.coverPage.coverImageData && (
                      <div className="relative">
                        <img
                          src={parsedBook.coverPage.coverImageData}
                          alt="cover"
                          className="w-full h-32 object-cover rounded-lg border border-theme"
                        />
                        <button
                          onClick={() => setParsedBook(prev => prev ? { ...prev, coverPage: { ...prev.coverPage!, coverImageData: undefined } } : prev)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          <Icon icon={Cancel01IconData} className="w-3" />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async () => {
                          const file = input.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            const dataUrl = reader.result as string;
                            setParsedBook(prev => prev ? { ...prev, coverPage: { ...prev.coverPage!, coverImageData: dataUrl } } : prev);
                          };
                          reader.readAsDataURL(file);
                        };
                        input.click();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-theme-strong hover:bg-theme-secondary text-sm text-theme-muted"
                    >
                      <Icon icon={Upload01IconData} className="w-4" />
                      Upload cover image
                    </button>
                    {hasDiffusion && (
                      <button
                        onClick={async () => {
                          try {
                            const prompt = `Children's book cover illustration for "${parsedBook.title}", ${parsedBook.styleSuffix || 'colorful cartoon style, vibrant and playful'}`;
                            const res = await fetch('http://localhost:8000/api/generate-image', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ prompt, width: 768, height: 512 }),
                            });
                            if (!res.ok) throw new Error('Failed');
                            const data = await res.json();
                            if (data.image) {
                              const imageData = data.image.startsWith('data:') ? data.image : `data:image/png;base64,${data.image}`;
                              setParsedBook(prev => prev ? { ...prev, coverPage: { ...prev.coverPage!, coverImageData: imageData } } : prev);
                            }
                          } catch (e) {
                            console.error('[StoryBook] Cover image generation failed:', e);
                          }
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-theme-strong hover:bg-theme-secondary text-sm"
                        style={{ color: accentColor }}
                      >
                        <Icon icon={Image01IconData} className="w-4" />
                        Generate AI Cover
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : currentPage ? (
              /* ── Content Page Edit Panel ────────────────────────────── */
              <>
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
              {/* AI background generation */}
              {hasDiffusion && (
                <button
                  onClick={() => handleGeneratePageBackground(currentPageIdx)}
                  disabled={isRemovingBg === currentPageIdx || isGeneratingImages}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-theme-strong hover:bg-theme-secondary text-sm text-theme-muted disabled:opacity-60 mt-2"
                >
                  {isRemovingBg === currentPageIdx
                    ? <Icon icon={Loading03IconData} className="w-4 animate-spin" />
                    : <Icon icon={Image01IconData} className="w-4" style={{ color: accentColor }} />}
                  Generate AI Background
                </button>
              )}
              {/* Import background */}
              <div className="relative mt-2">
                <button
                  onClick={() => setShowBgImportMenu(prev => prev === currentPageIdx ? null : currentPageIdx)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-theme-strong hover:bg-theme-secondary text-sm text-theme-muted"
                >
                  <Icon icon={Upload01IconData} className="w-4" />
                  Import Background
                </button>
                {showBgImportMenu === currentPageIdx && (
                  <div className="absolute left-0 top-full mt-1 w-full bg-white dark:bg-gray-900 rounded-xl border border-theme shadow-lg z-20">
                    <button
                      onClick={() => {
                        setShowBgImportMenu(null);
                        handleBgUpload(currentPageIdx);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-theme-heading hover:bg-theme-secondary rounded-t-xl"
                    >
                      <Icon icon={Upload01IconData} className="w-4" />
                      Upload from computer
                    </button>
                    <button
                      onClick={() => {
                        setShowBgImportMenu(null);
                        setShowResourcePicker(true);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-theme-heading hover:bg-theme-secondary rounded-b-xl"
                    >
                      <Icon icon={Image01IconData} className="w-4" />
                      Browse saved images
                    </button>
                  </div>
                )}
              </div>
              {currentPage.backgroundImageData && (
                <div className="relative mt-2">
                  <img
                    src={currentPage.backgroundImageData}
                    alt="background"
                    className="w-full h-16 object-cover rounded-lg border border-theme"
                  />
                  <button
                    onClick={() => updatePage(currentPageIdx, { backgroundImageData: undefined })}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <Icon icon={Cancel01IconData} className="w-3" />
                  </button>
                </div>
              )}
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
                {/* AI character generation */}
                {hasDiffusion && currentPage.characterScene && (
                  <button
                    onClick={() => handleGeneratePageImage(currentPageIdx)}
                    disabled={isRemovingBg === currentPageIdx || isGeneratingImages}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-theme-strong hover:bg-theme-secondary text-sm disabled:opacity-60"
                    style={{ color: accentColor }}
                  >
                    {isRemovingBg === currentPageIdx
                      ? <Icon icon={Loading03IconData} className="w-4 animate-spin" />
                      : <Icon icon={Image01IconData} className="w-4" />}
                    Generate AI Character
                  </button>
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
                      textSegments: [...currentPage!.textSegments, { speaker: 'narrator', text: '' }],
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
                      speak(seg.text, readNext, voice, settings.language);
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
              </>
            ) : null}
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

      {/* Hidden file input (character) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileSelected}
      />
      {/* Hidden file input (background) */}
      <input
        ref={bgFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onBgFileSelected}
      />

      {/* Resource image picker modal */}
      {showResourcePicker && (
        <ResourceImagePicker
          onSelect={handleResourceImageSelect}
          onClose={() => setShowResourcePicker(false)}
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

      {/* Save dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-4 border-b border-theme">
              <h3 className="font-semibold text-theme-heading">Save Storybook</h3>
              <button onClick={() => !isSaving && setShowSaveDialog(false)} className="p-1 rounded hover:bg-theme-hover">
                <Icon icon={Cancel01IconData} className="w-5 text-theme-muted" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Include images */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveIncludeImages}
                  onChange={e => setSaveIncludeImages(e.target.checked)}
                  disabled={isSaving || !parsedBook?.pages.some(p => p.characterImageData || p.backgroundImageData)}
                  className="w-4 h-4 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-theme-heading flex items-center gap-1.5">
                    <Icon icon={Image01IconData} className="w-4" style={{ color: accentColor }} />
                    Save images
                  </p>
                  <p className="text-xs text-theme-muted">Preserves character and background images</p>
                </div>
              </label>

              {/* Include audio */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveIncludeAudio}
                  onChange={e => setSaveIncludeAudio(e.target.checked)}
                  disabled={isSaving}
                  className="w-4 h-4 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-theme-heading flex items-center gap-1.5">
                    <Icon icon={Mic01IconData} className="w-4" style={{ color: accentColor }} />
                    Save narration audio
                  </p>
                  <p className="text-xs text-theme-muted">Pre-generates all speech (uses more storage but enables instant playback)</p>
                </div>
              </label>

              {/* Progress bar */}
              {isSaving && saveProgress && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-theme-muted">
                    <Icon icon={Loading03IconData} className="w-3 animate-spin" />
                    Generating audio... {saveProgress.current}/{saveProgress.total}
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(saveProgress.current / saveProgress.total) * 100}%`, background: accentColor }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-theme">
              <button
                onClick={() => setShowSaveDialog(false)}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg text-sm text-theme-muted hover:bg-theme-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ background: accentColor }}
              >
                {isSaving ? (
                  <span className="flex items-center gap-1.5">
                    <Icon icon={Loading03IconData} className="w-3 animate-spin" />
                    Saving...
                  </span>
                ) : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restoring images overlay */}
      {isRestoringImages && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm shadow-lg flex items-center gap-2">
          <Icon icon={Loading03IconData} className="w-4 animate-spin" style={{ color: accentColor }} />
          Restoring images...
        </div>
      )}

      {/* Save toast */}
      {saveToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm shadow-lg flex items-center gap-2">
          <Icon icon={Tick01IconData} className="w-4" style={{ color: '#4ade80' }} />
          {saveToast}
        </div>
      )}
    </div>
    <HistorySidePanel
      open={showHistory}
      onLoad={handleLoadSaved}
      onClose={() => setShowHistory(false)}
      accentColor={accentColor}
      currentDraftId={currentDraftId}
      formData={formData as unknown as Record<string, any>}
      onMatchCount={setStoryMatchCount}
    />
    </div>
  );
}
