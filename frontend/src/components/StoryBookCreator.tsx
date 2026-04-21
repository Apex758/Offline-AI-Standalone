// @refresh reset
import React, {
  useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import AIDisclaimer from './AIDisclaimer';
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
import { useStreamingJson } from '../hooks/useStreamingJson';
import { useSmoothReveal } from './shared/InlineEditPrimitives';
import { useQueue } from '../contexts/QueueContext';
import { useQueueCancellation } from '../hooks/useQueueCancellation';
import { useSettings } from '../contexts/SettingsContext';
import { useCapabilities } from '../contexts/CapabilitiesContext';
import { useAchievementTrigger } from '../contexts/AchievementContext';
import { useTTS, useSTT } from '../hooks/useVoice';
import { useOfflineGuard } from '../hooks/useOfflineGuard';
import { useHistoryMatching } from '../hooks/useHistoryMatching';
import ImageModeSelector from './ui/ImageModeSelector';
import { NeuroSegment } from './ui/NeuroSegment';
import CurriculumAlignmentFields from './ui/CurriculumAlignmentFields';
import KidsStorybookSkeletonDay from './KidsStorybookSkeletonDay';
import KidsStorybookSkeletonNight from './KidsStorybookSkeletonNight';
import SmartInput from './SmartInput';
import SmartTextArea from './SmartTextArea';
import { filterSubjects, filterGrades } from '../data/teacherConstants';
import { buildStorybookPrompt, buildNarrativePrompt, buildStructurePromptTemplate, buildCurriculumInfo, STORYBOOK_STYLE_SUFFIX } from '../utils/storybookPromptBuilder';
import { STYLE_PRESETS, STYLE_SUFFIXES, type StylePresetId } from '../utils/imageStylePresets';
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
  SavedStorybook, StorybookExportSettings, CoverPage, IntroductionPage,
} from '../types/storybook';
import type { ImageMode } from '../types';
import {
  getSavedStorybooks, saveStorybook, deleteSavedStorybook,
  getExportSettings, setExportSettings, DEFAULT_EXPORT_SETTINGS,
} from '../utils/storybookStorage';
import {
  buildSpeechBubbleSVG, shouldUseBubble, getTailDirection,
} from '../utils/speechBubble';
import { NeuroSwitch } from './ui/NeuroSwitch';
import { useNotification } from '../contexts/NotificationContext';

// ─── Constants ────────────────────────────────────────────────────────────────

const WS_ENDPOINT = '/ws/storybook';

const VOICE_LABELS: Record<VoiceName, string> = {
  // English — US
  lessac:   'Lessac (F, US)',
  ryan:     'Ryan (M, US)',
  amy:      'Amy (F, US)',
  joe:      'Joe (M, US)',
  danny:    'Danny (M, US)',
  kusal:    'Kusal (M, US)',
  // English — GB
  jenny:    'Jenny (F, British)',
  alan:     'Alan (M, British)',
  alba:     'Alba (F, Scottish)',
  cori:     'Cori (F, British)',
  northern: 'Northern (M, British)',
  southern: 'Southern (F, British)',
  // French
  siwis:    'Siwis (F, French)',
  gilles:   'Gilles (M, French)',
  // Spanish
  sharvard: 'Sharvard (F, Spanish)',
  carlfm:   'Carlfm (M, Spanish)',
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
  stylePreset: 'cartoon_3d',
  backgroundCount: 'auto',
  speakerCount: 1,
  speakers: DEFAULT_SPEAKERS,
  useCurriculum: true,
  strand: '',
  essentialOutcomes: '',
  specificOutcomes: '',
};

// ─── Progressive JSON Parser ──────────────────────────────────────────────────

function tryParsePartialPages(raw: string, scanFrom: number = 0): { pages: StoryPage[], nextScanFrom: number } {
  const pages: StoryPage[] = [];
  let startIdx: number;

  if (scanFrom > 0) {
    startIdx = scanFrom;
  } else {
    const arrStart = raw.indexOf('"pages"');
    if (arrStart === -1) return { pages, nextScanFrom: 0 };
    const bracketStart = raw.indexOf('[', arrStart);
    if (bracketStart === -1) return { pages, nextScanFrom: 0 };
    startIdx = bracketStart + 1;
  }

  let depth = 0;
  let objStart = -1;
  let lastObjEnd = startIdx;
  for (let i = startIdx; i < raw.length; i++) {
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
           // Compute client-side defaults for fields no longer generated by the model
           const placement = obj.imagePlacement || 'none';
           const charAnim = obj.characterAnimation || (placement === 'left' ? 'slideInLeft' : placement === 'right' ? 'slideInRight' : 'fadeIn');
           pages.push({
             pageNumber: obj.pageNumber,
             textSegments: obj.textSegments,
             sceneId: obj.sceneId || 'default',
             characterScene: obj.characterScene,
             characterName: obj.characterName,
             characterScene2: obj.characterScene2,
             characterName2: obj.characterName2,
             imagePlacement: placement,
             characterAnimation: charAnim,
             textAnimation: 'fadeIn',
           });
          }
          lastObjEnd = i + 1;
        } catch { /* incomplete JSON -- skip */ }
        objStart = -1;
      }
    }
  }
  return { pages, nextScanFrom: lastObjEnd };
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
  const { t } = useTranslation();
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
          <h3 className="text-lg font-semibold text-theme-heading">{t('storybook.savedStorybooks')}</h3>
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
                <span className="text-sm font-medium text-amber-500">{t('storybook.draftsCount', { count: drafts.length })}</span>
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
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 uppercase tracking-wide">{t('dashboard.draft')}</span>
                            <p className="text-sm font-medium text-theme-heading line-clamp-2">{item.formData.title || t('storybook.untitled')}</p>
                          </div>
                          <p className="text-xs text-theme-hint mt-1">
                            {item.formData.gradeLevel === 'K' ? t('storybook.kindergarten') : t('storybook.gradeN', { n: item.formData.gradeLevel })}
                            {item.formData.subject && ` · ${item.formData.subject}`}
                            {' · '}{new Date(item.savedAt).toLocaleDateString()} {new Date(item.savedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                          title={t('storybook.deleteDraft')}
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
              <p className="text-sm">{t('storybook.noSavedStorybooks')}</p>
            </div>
          ) : (
            <>
              {matchCount > 0 && completedSorted.some(i => matchedCompletedIds.has(i.id)) && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-blue-400">{t('storybook.matchingCount', { count: matchedCompletedIds.size })}</span>
                </div>
              )}
              {completedSorted.map((item, idx) => (
                <React.Fragment key={item.id}>
                  {matchCount > 0 && idx > 0 && matchedCompletedIds.has(completedSorted[idx - 1].id) && !matchedCompletedIds.has(item.id) && (
                    <div className="border-b border-theme my-3">
                      <span className="text-xs text-theme-muted">{t('storybook.otherSection')}</span>
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
                            {item.formData.title || t('storybook.untitled')}
                          </p>
                          {item.hasImages && (
                            <span title={t('storybook.imagesSaved')} className="shrink-0 text-green-500"><Icon icon={Image01IconData} className="w-3.5" /></span>
                          )}
                          {item.hasAudio && (
                            <span title={t('storybook.audioSaved')} className="shrink-0 text-blue-500"><Icon icon={Mic01IconData} className="w-3.5" /></span>
                          )}
                        </div>
                        <p className="text-xs text-theme-hint mt-1">
                          {item.formData.gradeLevel === 'K' ? t('storybook.kindergarten') : t('storybook.gradeN', { n: item.formData.gradeLevel })}
                          {item.formData.subject && ` · ${item.formData.subject}`}
                          {item.parsedBook && ` · ${t('storybook.nPages', { count: item.parsedBook.pages.length })}`}
                          {' · '}{new Date(item.savedAt).toLocaleDateString()} {new Date(item.savedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                        title={t('storybook.deleteStorybook')}
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
  const { t } = useTranslation();
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
            {t('storybook.exportSettings')}
          </h3>
          <button onClick={onClose} className="text-theme-muted hover:text-theme-heading">
            <Icon icon={Cancel01IconData} className="w-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {/* Default format */}
          <div>
            <label className="block text-sm font-medium text-theme-label mb-1.5">{t('storybook.defaultFormat')}</label>
            <select
              value={settings.defaultFormat}
              onChange={e => update('defaultFormat', e.target.value as 'pdf' | 'pptx' | 'html')}
              className="w-full px-3 py-2 border border-theme-strong rounded-lg text-sm bg-theme"
            >
              <option value="html">{t('storybook.formatAnimatedHTML')}</option>
              <option value="pdf">{t('storybook.formatPDF')}</option>
              <option value="pptx">{t('storybook.formatPPTX')}</option>
            </select>
          </div>

          {/* Include audio */}
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-theme-label">{t('storybook.includeAudio')}</p>
              <p className="text-xs text-theme-muted">{t('storybook.includeAudioDesc')}</p>
            </div>
            <NeuroSwitch
              checked={settings.includeAudioInHTML}
              onChange={(v) => update('includeAudioInHTML', v)}
              size="md"
              aria-label={t('storybook.includeAudio')}
            />
          </label>

          {/* Include comprehension questions */}
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-theme-label">{t('storybook.comprehensionQuestions')}</p>
              <p className="text-xs text-theme-muted">{t('storybook.comprehensionDesc')}</p>
            </div>
            <NeuroSwitch
              checked={settings.includeComprehensionQuestions}
              onChange={(v) => update('includeComprehensionQuestions', v)}
              size="md"
              aria-label={t('storybook.comprehensionQuestions')}
            />
          </label>
        </div>
        <div className="p-4 border-t border-theme">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: accentColor }}
          >
            {t('common.done')}
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
  const { t } = useTranslation();
  const byCategory = getScenesByCategory();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-theme">
          <h3 className="font-semibold text-theme-heading">{t('storybook.chooseScene')}</h3>
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

const SCENE_BG_COLORS_DARK: Record<string, string> = {
  outdoors: '#1a2e23',
  indoors:  '#2a2517',
  fantasy:  '#1f1a2e',
  weather:  '#172033',
};

const DARK_PAGE_FALLBACK = '#1e1e1e';

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
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-8" style={{ perspective: '1200px' }}>
      <div className="text-white/40 text-sm mb-4 font-sans">
        {t('storybook.questionNofM', { n: questionNumber, m: totalQuestions })}
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
          <div className="text-sm font-sans font-semibold mb-4" style={{ color: accentColor }}>{t('storybook.flashcardQuestion')}</div>
          <p className="text-2xl text-white leading-relaxed">{question.question}</p>
          <div className="mt-6 text-white/30 text-sm font-sans">{t('storybook.pressToReveal')}</div>
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
          <div className="text-sm font-sans font-semibold mb-3" style={{ color: accentColor }}>{t('storybook.flashcardAnswer')}</div>
          <p className="text-xl text-white leading-relaxed">{question.answer}</p>
          {question.outcomeRef && (
            <div className="mt-4 text-white/25 text-xs font-sans">{t('storybook.outcome')}: {question.outcomeRef}</div>
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
  const { t } = useTranslation();
  const [pageIdx, setPageIdx] = useState(0);
  const [phase, setPhase] = useState<'bg' | 'char' | 'text' | 'done'>('bg');
  const [segmentIdx, setSegmentIdx] = useState(0);
  const { speak, stop, isSpeaking } = useTTS();
  const { settings } = useSettings();
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
  const charAnim2 = page?.imagePlacement === 'left' ? 'slideInRight' : 'slideInLeft';
  const hasChar = page && (page.characterImageData || page.characterScene) && page.imagePlacement !== 'none';
  const hasChar2 = page && page.characterImageData2 && page.imagePlacement !== 'none';

  // Page label
  const pageLabel = isQuestionSlide
    ? `${t('storybook.questionNofM', { n: questionDataIdx + 1, m: questions.length })}${isAnswerFace ? ` (${t('storybook.flashcardAnswer')})` : ''}`
    : `${pageIdx + 1} / ${totalPages}`;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/80">
        <button onClick={() => { stopAll(); onClose(); }} className="text-white/70 hover:text-white flex items-center gap-1 text-sm">
          <Icon icon={Cancel01IconData} className="w-4" /> {t('storybook.exit')}
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
            {autoPlay ? t('storybook.pauseAuto') : t('storybook.autoPlay')}
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
          {/* Character left slot */}
          {hasChar && page!.imagePlacement === 'left' && (
            <div className={`flex-shrink-0 w-48 animate__animated animate__${charAnim} ${phase === 'char' || phase === 'text' || phase === 'done' ? '' : 'invisible'}`}>
              {page!.characterImageData
                ? <img src={page!.characterImageData} alt={page!.characterName || 'character'} className="w-full drop-shadow-2xl" />
                : <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center"><Icon icon={UserIconData} className="w-16" style={{ color: 'rgba(255,255,255,0.5)' }} /></div>
              }
            </div>
          )}
          {/* Character 2 on left (when char 1 is right) */}
          {hasChar2 && page!.imagePlacement === 'right' && (
            <div className={`flex-shrink-0 w-48 animate__animated animate__${charAnim2} ${phase === 'char' || phase === 'text' || phase === 'done' ? '' : 'invisible'}`}>
              <img src={page!.characterImageData2!} alt={page!.characterName2 || 'character 2'} className="w-full drop-shadow-2xl" />
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

          {/* Character 2 on right (when char 1 is left) */}
          {hasChar2 && page!.imagePlacement === 'left' && (
            <div className={`flex-shrink-0 w-48 animate__animated animate__${charAnim2} ${phase === 'char' || phase === 'text' || phase === 'done' ? '' : 'invisible'}`}>
              <img src={page!.characterImageData2!} alt={page!.characterName2 || 'character 2'} className="w-full drop-shadow-2xl" />
            </div>
          )}
          {/* Character right */}
          {hasChar && page!.imagePlacement === 'right' && (
            <div className={`flex-shrink-0 w-48 animate__animated animate__${charAnim} ${phase === 'char' || phase === 'text' || phase === 'done' ? '' : 'invisible'}`}>
              {page!.characterImageData
                ? <img src={page!.characterImageData} alt={page!.characterName || 'character'} className="w-full drop-shadow-2xl" />
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
  liveSegment,
  isDark = false,
}: {
  page: StoryPage;
  accentColor: string;
  /**
   * Optional "currently being typed" text segment. When present, renders
   * an extra paragraph after the committed textSegments with a caret,
   * shimmer, and smooth character reveal. The speaker is inferred from
   * the current page's speakers (or defaults to narrator).
   */
  liveSegment?: {
    text: string;
    speaker?: string;
  } | null;
  isDark?: boolean;
}) {
  const { t } = useTranslation();
  const bgScene = page.bundledSceneId
    ? BUNDLED_SCENES.find(s => s.id === page.bundledSceneId)
    : null;
  const colorMap = isDark ? SCENE_BG_COLORS_DARK : SCENE_BG_COLORS;
  const bgColor = bgScene ? colorMap[bgScene.category] : (isDark ? DARK_PAGE_FALLBACK : '#f3f4f6');
  const lastIdx = page.textSegments.length - 1;
  // Smoothly reveal the in-progress segment so multi-char token jumps
  // type in character-by-character instead of snapping 4-12 chars at a time.
  const liveText = liveSegment?.text || '';
  const revealedLiveText = useSmoothReveal(liveText, !!liveSegment);
  const liveSpeaker = liveSegment?.speaker || 'narrator';

  return (
    <div
      className="relative rounded-xl overflow-hidden border shadow-sm sb-streaming-wrap"
      style={{
        background: bgColor,
        aspectRatio: '297 / 210',
        fontFamily: "Georgia, 'Times New Roman', serif",
        borderColor: `${accentColor}55`,
        boxShadow: `0 0 0 2px ${accentColor}33, 0 0 24px ${accentColor}22`,
        animation: 'sbStreamPulse 1.8s ease-in-out infinite',
      }}
    >
      <div className="relative z-10 p-6">
        <div className="space-y-2">
          {page.textSegments.map((seg, i) => {
            // When a liveSegment is present, the caret + shimmer belong on
            // the live paragraph (below), not the committed ones.
            const isLastCommitted = i === lastIdx;
            const shouldDecorate = isLastCommitted && !liveSegment;
            return (
              <p
                key={i}
                className={`leading-relaxed text-gray-800 dark:text-gray-200 ${seg.speaker === 'narrator' ? 'italic text-base' : 'font-semibold text-base'} ${shouldDecorate ? 'sb-active-segment' : ''}`}
                style={{
                  animation: 'streamFadeIn 0.3s ease both',
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                {seg.speaker !== 'narrator' && (
                  <span className="text-xs font-bold text-purple-600 not-italic block">{seg.speaker}:</span>
                )}
                {seg.speaker !== 'narrator' ? `"${seg.text}"` : seg.text}
                {shouldDecorate && <span className="sb-caret" aria-hidden="true" />}
              </p>
            );
          })}
          {/* Live in-progress segment — rendered while the model is
              mid-way through typing the next segment. Shows the partial
              text with smooth-reveal animation, active shimmer, and the
              typing caret. Disappears the moment the parser commits this
              segment to page.textSegments above. */}
          {liveSegment && (
            <p
              key="live-segment"
              className={`leading-relaxed text-gray-800 dark:text-gray-200 sb-active-segment ${liveSpeaker === 'narrator' ? 'italic text-base' : 'font-semibold text-base'}`}
            >
              {liveSpeaker !== 'narrator' && (
                <span className="text-xs font-bold text-purple-600 not-italic block">{liveSpeaker}:</span>
              )}
              {liveSpeaker !== 'narrator' ? `"${revealedLiveText}` : revealedLiveText}
              <span className="sb-caret" aria-hidden="true" />
              {liveSpeaker !== 'narrator' && !revealedLiveText.endsWith('"') && ''}
            </p>
          )}
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
        {t('storybook.writingBadge')}
      </div>
      <style>{`
        @keyframes streamFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sbStreamPulse {
          0%, 100% { box-shadow: 0 0 0 2px ${accentColor}33, 0 0 24px ${accentColor}22; }
          50%      { box-shadow: 0 0 0 2px ${accentColor}66, 0 0 32px ${accentColor}44; }
        }
        /* Per-segment shimmer — highlights the text segment currently being typed.
           Scoped to .sb-streaming-wrap so it can't bleed into other components. */
        .sb-streaming-wrap .sb-active-segment {
          display: inline-block;
          padding: 0 0.25rem;
          border-radius: 4px;
          background: linear-gradient(
            90deg,
            ${accentColor}11 0%,
            ${accentColor}33 50%,
            ${accentColor}11 100%
          );
          background-size: 200% 100%;
          animation: sbActiveShimmer 1.4s linear infinite;
          box-shadow: 0 0 0 1px ${accentColor}55;
        }
        @keyframes sbActiveShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .sb-streaming-wrap .sb-caret {
          display: inline-block;
          width: 2px;
          height: 0.9em;
          margin-left: 2px;
          vertical-align: middle;
          background-color: ${accentColor};
          animation: sbCaretBlink 1s steps(2, start) infinite;
        }
        @keyframes sbCaretBlink {
          to { visibility: hidden; }
        }
      `}</style>
    </div>
  );
}

// ─── Skeleton Page Placeholder (ungenerated pages in editor) ─────────────────

function SkeletonPagePreview({ isDark = false }: { isDark?: boolean }) {
  const { t } = useTranslation();
  return (
    <div
      className="relative rounded-xl overflow-hidden border border-theme shadow-sm"
      style={{ background: isDark ? DARK_PAGE_FALLBACK : '#f3f4f6', aspectRatio: '297 / 210' }}
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
              background: isDark
                ? 'linear-gradient(90deg, #333 0%, #444 40%, #555 50%, #444 60%, #333 100%)'
                : 'linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 40%, #fafafa 50%, #f3f4f6 60%, #e5e7eb 100%)',
              backgroundSize: '400px 100%',
              animation: 'skeletonShimmer 1.8s ease-in-out infinite',
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-gray-400 px-2 py-0.5">
        {t('storybook.waitingBadge')}
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
  isDark = false,
}: {
  coverPage: CoverPage;
  accentColor: string;
  isDark?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div
      className="relative rounded-xl overflow-hidden border border-theme shadow-sm flex flex-col items-center justify-center text-center"
      style={{
        aspectRatio: '297 / 210',
        background: coverPage.coverImageData
          ? undefined
          : isDark
            ? `linear-gradient(135deg, ${accentColor}18, ${DARK_PAGE_FALLBACK})`
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
          style={{ color: coverPage.coverImageData ? '#fff' : isDark ? '#e5e7eb' : '#1f2937' }}
        >
          {coverPage.title || t('storybook.untitledStory')}
        </h1>
        {coverPage.subtitle && (
          <p
            className="text-sm"
            style={{ color: coverPage.coverImageData ? 'rgba(255,255,255,0.7)' : isDark ? '#9ca3af' : '#6b7280' }}
          >
            {coverPage.subtitle}
          </p>
        )}
        {coverPage.authorName && (
          <p
            className="text-sm mt-1"
            style={{ color: coverPage.coverImageData ? 'rgba(255,255,255,0.8)' : accentColor }}
          >
            {t('storybook.byAuthor', { name: coverPage.authorName })}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Introduction Page Preview ───────────────────────────────────────────────

/**
 * Renders the opening mood-setting page between cover and page 1.
 * Shows the moodText as centered serif prose over the chosen scene
 * background. When `liveText` is provided, renders partial text with a
 * caret and smooth reveal — used during streaming.
 */
function IntroductionPagePreview({
  intro,
  accentColor,
  liveText,
  isStreaming,
  isDark = false,
}: {
  intro: IntroductionPage;
  accentColor: string;
  /** When set, render this partial text with caret + smooth reveal. */
  liveText?: string | null;
  isStreaming?: boolean;
  isDark?: boolean;
}) {
  const bgScene = intro.bundledSceneId
    ? BUNDLED_SCENES.find(s => s.id === intro.bundledSceneId)
    : null;
  const colorMap = isDark ? SCENE_BG_COLORS_DARK : SCENE_BG_COLORS;
  const bgColor = bgScene ? colorMap[bgScene.category] : (isDark ? DARK_PAGE_FALLBACK : '#f3f4f6');

  // Smooth-reveal the live text so multi-char token jumps type in smoothly.
  const revealed = useSmoothReveal(liveText || '', !!liveText);
  const displayText = liveText != null ? revealed : intro.moodText;

  return (
    <div
      className={`relative rounded-xl overflow-hidden border shadow-sm intro-streaming-wrap ${isStreaming ? 'is-streaming' : ''}`}
      style={{
        background: bgColor,
        aspectRatio: '297 / 210',
        fontFamily: "Georgia, 'Times New Roman', serif",
        borderColor: `${accentColor}55`,
        ...(isStreaming
          ? {
              boxShadow: `0 0 0 2px ${accentColor}33, 0 0 24px ${accentColor}22`,
              animation: 'introStreamPulse 1.8s ease-in-out infinite',
            }
          : {}),
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <p
          className={`text-center italic text-gray-800 dark:text-gray-200 leading-relaxed text-lg max-w-[85%] ${liveText != null ? 'intro-active-text' : ''}`}
        >
          {displayText}
          {liveText != null && <span className="intro-caret" aria-hidden="true" />}
        </p>
      </div>
      {/* Subtle "Introduction" badge top-left */}
      <div
        className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
        style={{ background: `${accentColor}22`, color: accentColor }}
      >
        Introduction
      </div>
      <style>{`
        @keyframes introStreamPulse {
          0%, 100% { box-shadow: 0 0 0 2px ${accentColor}33, 0 0 24px ${accentColor}22; }
          50%      { box-shadow: 0 0 0 2px ${accentColor}66, 0 0 32px ${accentColor}44; }
        }
        .intro-streaming-wrap .intro-active-text {
          display: inline-block;
          padding: 0 0.5rem;
          border-radius: 6px;
          background: linear-gradient(
            90deg,
            ${accentColor}11 0%,
            ${accentColor}33 50%,
            ${accentColor}11 100%
          );
          background-size: 200% 100%;
          animation: introActiveShimmer 1.4s linear infinite;
          box-shadow: 0 0 0 1px ${accentColor}55;
        }
        @keyframes introActiveShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .intro-streaming-wrap .intro-caret {
          display: inline-block;
          width: 2px;
          height: 0.9em;
          margin-left: 2px;
          vertical-align: middle;
          background-color: ${accentColor};
          animation: introCaretBlink 1s steps(2, start) infinite;
        }
        @keyframes introCaretBlink {
          to { visibility: hidden; }
        }
      `}</style>
    </div>
  );
}

// ─── Page Preview ─────────────────────────────────────────────────────────────

function PagePreview({
  page,
  accentColor,
  isDark = false,
}: {
  page: StoryPage;
  accentColor: string;
  isDark?: boolean;
}) {
  const bgScene = page.bundledSceneId
    ? BUNDLED_SCENES.find(s => s.id === page.bundledSceneId)
    : null;
  const colorMap = isDark ? SCENE_BG_COLORS_DARK : SCENE_BG_COLORS;
  const bgColor = bgScene ? colorMap[bgScene.category] : (isDark ? DARK_PAGE_FALLBACK : '#f3f4f6');

  const hasChar = page.characterImageData && page.imagePlacement !== 'none';
  const hasChar2 = page.characterImageData2 && page.imagePlacement !== 'none';
  const char2Placement = page.imagePlacement === 'left' ? 'right' : 'left';

  // Separate narrator vs character segments for bubble rendering
  const anyCharImage = hasChar || hasChar2;
  const narratorSegments = anyCharImage
    ? page.textSegments.filter(seg => seg.speaker === 'narrator')
    : page.textSegments.filter(seg => seg.speaker === 'narrator');
  // Character 1 bubble: last dialogue segment matching characterName (or any non-narrator if no name set)
  const char1Segments = page.textSegments.filter(seg =>
    seg.speaker !== 'narrator' && hasChar &&
    (!page.characterName || seg.speaker === page.characterName)
  );
  const activeBubbleSeg = char1Segments.length > 0 ? char1Segments[char1Segments.length - 1] : null;
  const tailDir = getTailDirection(page);
  // Character 2 bubble: last dialogue segment matching characterName2
  const char2Segments = page.textSegments.filter(seg =>
    seg.speaker !== 'narrator' && hasChar2 && page.characterName2 && seg.speaker === page.characterName2
  );
  const activeBubbleSeg2 = char2Segments.length > 0 ? char2Segments[char2Segments.length - 1] : null;
  const tailDir2: 'left' | 'right' = char2Placement === 'left' ? 'right' : 'left';

  // Character segments that don't have an image (rendered as text fallback)
  const unimaginedCharSegments = page.textSegments.filter(seg => {
    if (seg.speaker === 'narrator') return false;
    if (hasChar && (!page.characterName || seg.speaker === page.characterName)) return false;
    if (hasChar2 && page.characterName2 && seg.speaker === page.characterName2) return false;
    return true;
  });

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-theme shadow-sm"
      style={{ background: bgColor, aspectRatio: '297 / 210', fontFamily: 'Georgia, serif' }}
    >
      {page.backgroundImageData && (
        <img src={page.backgroundImageData} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      )}
      <div className="relative z-10 p-6">
        {/* Character 1 + speech bubble */}
        {hasChar && (
          <div
            className={`${page.imagePlacement === 'left' ? 'float-left mr-4' : 'float-right ml-4'} mb-2`}
            style={{ position: 'relative', width: 120 }}
          >
            <img
              src={page.characterImageData!}
              alt={page.characterName || 'character'}
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
        {/* Character 2 + speech bubble (opposite side) */}
        {hasChar2 && (
          <div
            className={`${char2Placement === 'left' ? 'float-left mr-4' : 'float-right ml-4'} mb-2`}
            style={{ position: 'relative', width: 120 }}
          >
            <img
              src={page.characterImageData2!}
              alt={page.characterName2 || 'character 2'}
              className="rounded-lg shadow-md"
              style={{ width: 120, shapeOutside: `url(${page.characterImageData2})`, shapeMargin: '12px' }}
            />
            {activeBubbleSeg2 && (
              <div
                style={{
                  position: 'absolute',
                  top: -8,
                  [char2Placement === 'left' ? 'left' : 'right']: '100%',
                  marginLeft: char2Placement === 'left' ? 4 : undefined,
                  marginRight: char2Placement === 'right' ? 4 : undefined,
                  zIndex: 20,
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))',
                }}
                dangerouslySetInnerHTML={{
                  __html: buildSpeechBubbleSVG({
                    text: activeBubbleSeg2.text,
                    tailDirection: tailDir2,
                    context: 'editor',
                  }),
                }}
              />
            )}
          </div>
        )}
        <div className="space-y-2">
          {narratorSegments.map((seg, i) => (
            <p key={i} className="leading-relaxed text-gray-800 dark:text-gray-200 italic text-base">
              {seg.text}
            </p>
          ))}
          {/* Fallback: character dialogue without image rendered as text */}
          {unimaginedCharSegments.map((seg, i) => (
            <p key={`char-${i}`} className="leading-relaxed text-gray-800 dark:text-gray-200 font-semibold text-base">
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
  const { t } = useTranslation();
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
          <h3 className="font-semibold text-theme-heading">{t('storybook.chooseBackgroundImage')}</h3>
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
              <p className="text-sm">{t('storybook.noSavedImages')}</p>
              <p className="text-xs mt-1">{t('storybook.noSavedImagesHint')}</p>
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
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { hasDiffusion, hasVision, tier } = useCapabilities();
  const { getConnection, getStreamingContent, getIsStreaming, clearStreaming, subscribe } = useWebSocket();
  const { enqueue, queueEnabled } = useQueue();
  const { speak, stop: stopTTS, isSpeaking } = useTTS();
  const { guardOffline } = useOfflineGuard();
  const triggerCheck = useAchievementTrigger();

  const accentColor = (settings.tabColors as any)['storybook'] || '#a855f7';

  // ── Dark mode detection ───────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // ── TTS voice availability ────────────────────────────────────────────────
  const { toastOnly } = useNotification();
  const [voiceAvailability, setVoiceAvailability] = useState<Record<string, boolean>>({});
  useEffect(() => {
    fetch('http://localhost:8000/api/tts/voices')
      .then(r => r.json())
      .then((data: { voices: { key: string; available: boolean }[] }) => {
        const map: Record<string, boolean> = {};
        data.voices.forEach(v => { map[v.key] = v.available; });
        setVoiceAvailability(map);
      })
      .catch(() => {});
  }, []);
  // Listen for voice-not-downloaded events from the TTS hook
  useEffect(() => {
    const handler = () => toastOnly('This voice is not downloaded. Connect to the internet to download it.', 'error', 5000);
    window.addEventListener('tts-voice-not-downloaded', handler);
    return () => window.removeEventListener('tts-voice-not-downloaded', handler);
  }, [toastOnly]);

  // ── State ──────────────────────────────────────────────────────────────────
  const [view, setViewState] = useState<View>('input');
  const viewRef = useRef<View>('input');
  const setView = (v: View) => { viewRef.current = v; setViewState(v); };
  const [formData, setFormData] = useState<StorybookFormData>(DEFAULT_FORM);
  // Visual style pill
  const sbVsContainerRef = useRef<HTMLDivElement>(null);
  const sbVsBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [sbVsPill, setSbVsPill] = useState<{ left: number; width: number } | null>(null);
  const updateSbVsPill = useCallback(() => {
    const activeIdx = STYLE_PRESETS.findIndex(p => p.id === formData.stylePreset);
    if (activeIdx === -1) return;
    const btn = sbVsBtnRefs.current[activeIdx];
    const container = sbVsContainerRef.current;
    if (!btn || !container) return;
    const cr = container.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setSbVsPill({ left: br.left - cr.left, width: br.width });
  }, [formData.stylePreset]); // eslint-disable-line react-hooks/exhaustive-deps
  useLayoutEffect(() => { updateSbVsPill(); }, [updateSbVsPill]);
  useEffect(() => {
    const t = setTimeout(updateSbVsPill, 0);
    return () => clearTimeout(t);
  }, [updateSbVsPill]);
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
  const [streamingUpdate, setStreamingUpdate] = useState(0);

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
    const voices: VoiceName[] = ['lessac', 'ryan', 'amy', 'joe', 'jenny', 'alan'];
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
    if (!formData.useCurriculum && !formData.description.trim()) errors.description = true;
    if (!formData.subject) errors.subject = true;
    if (!formData.gradeLevel) errors.gradeLevel = true;
    if (formData.useCurriculum) {
      if (!formData.strand) errors.strand = true;
      if (!formData.essentialOutcomes) errors.essentialOutcomes = true;
    }
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      setTimeout(() => {
        const firstError = document.querySelector('[data-validation-error="true"]');
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return false;
    }
    return true;
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

    // Listen for comprehension questions from the separate backend pass
    const compHandler = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'comprehension' && msg.content) {
          const compData = typeof msg.content === 'string' ? JSON.parse(msg.content) : msg.content;
          const questions = compData.questions || compData.comprehensionQuestions || [];
          if (questions.length > 0) {
            setParsedBook(prev => prev ? { ...prev, comprehensionQuestions: questions } : prev);
          }
        }
      } catch { /* ignore non-JSON */ }
    };
    ws.addEventListener('message', compHandler);

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

    // Pass curriculum info for the separate comprehension questions pass
    const curriculumInfo = buildCurriculumInfo(formData);
    if (curriculumInfo) payload.curriculumInfo = curriculumInfo;

    if (useTwoPass) {
      payload.twoPass = true;
      payload.narrativePrompt = buildNarrativePrompt(formData);
      payload.structurePromptTemplate = buildStructurePromptTemplate(formData);
    }

    const send = () => ws.send(JSON.stringify(payload));
    if (ws.readyState === WebSocket.OPEN) send();
    else ws.addEventListener('open', send, { once: true });

    // Smart diffusion lifecycle: unload to free RAM for LLM streaming,
    // then preload again ~2 pages before the end (see useEffect below).
    // For short books (< 4 pages), keep the old preload behavior since
    // the unload/reload cycle isn't worth it for brief generations.
    if (hasDiffusion && formData.pageCount >= 4) {
      fetch('http://localhost:8000/api/image-service/unload', { method: 'POST' }).catch(() => {});
    } else if (formData.imageMode !== 'none' && hasDiffusion) {
      fetch('http://localhost:8000/api/image-service/preload', { method: 'POST' }).catch(() => {});
    }
  }, [guardOffline, formData, tabId, tier, hasDiffusion, getConnection, clearStreaming]);

  // Pre-create the connection on mount so the subscribe below finds it immediately
  useEffect(() => {
    getConnection(tabId, WS_ENDPOINT);
  }, [tabId]);

  // Subscribe to streaming updates so the component re-renders on every token batch (60fps)
  useEffect(() => {
    const unsubscribe = subscribe(tabId, WS_ENDPOINT, () => {
      setStreamingUpdate((prev) => prev + 1);
    });
    return unsubscribe;
  }, [tabId, subscribe, setStreamingUpdate]);

  // ── Watch streaming content ────────────────────────────────────────────────
  const isStreaming = getIsStreaming(tabId, WS_ENDPOINT);
  const streamingContent = getStreamingContent(tabId, WS_ENDPOINT);

  // ── Per-field live streaming (lesson-planner pattern) ─────────────────────
  // The coarse `tryParsePartialPages` parser below only commits a page once
  // its closing '}' arrives — so the UI appears to "pop in" entire pages
  // even though tokens are flowing in smoothly. `useStreamingJson` parses
  // the same buffer and also reports which string field is currently being
  // typed (e.g. `["pages", 2, "textSegments", 0, "text"]`). We use that to
  // render the partial text live on the correct page, mid-type, with a
  // caret and the same smooth-reveal animation the lesson planner uses.
  //
  // The existing page-level parser is unchanged: it still handles the
  // commit-on-close logic that populates the post-generation editor.
  const {
    data: sbStreamingData,
    inProgressPath: sbInProgressPath,
    inProgressValue: sbInProgressValue,
  } = useStreamingJson<any>({
    rawText: streamingContent || '',
    isStreaming,
    throttleMs: 30,
  });

  // Decode the in-progress path into structured "what page is being typed?"
  // and "what is the partial text?" so StreamingPagePreview can render it.
  // Path shape during active string generation:
  //   ["pages", <pageIdx>, "textSegments", <segIdx>, "text"]
  //   ["pages", <pageIdx>, "textSegments", <segIdx>, "speaker"]
  //   ["pages", <pageIdx>, "characterScene"]
  //   ["pages", <pageIdx>, "sceneId"]
  //   ["introductionPage", "moodText"]
  //   ["title"]  etc.
  // We only light up the text field case, because that's the lion's share
  // of wall-clock time during generation.
  const sbLiveTyping: {
    pageIdx: number;
    segIdx: number;
    partialText: string;
  } | null = (() => {
    if (!isStreaming || !sbInProgressPath || sbInProgressValue == null) return null;
    const p = sbInProgressPath;
    if (
      p.length === 5 &&
      p[0] === 'pages' &&
      typeof p[1] === 'number' &&
      p[2] === 'textSegments' &&
      typeof p[3] === 'number' &&
      p[4] === 'text'
    ) {
      return {
        pageIdx: p[1] as number,
        segIdx: p[3] as number,
        partialText: sbInProgressValue,
      };
    }
    return null;
  })();

  // Separate detection for the introduction page's moodText so the intro
  // view can type in live with the same caret + shimmer effect.
  const sbIntroLiveText: string | null = (() => {
    if (!isStreaming || !sbInProgressPath || sbInProgressValue == null) return null;
    const p = sbInProgressPath;
    if (p.length === 2 && p[0] === 'introductionPage' && p[1] === 'moodText') {
      return sbInProgressValue;
    }
    return null;
  })();

  // Track which page the AI is currently streaming (for auto-advance in editor)
  const prevLivePagesCountRef = useRef(0);
  const pageScanOffsetRef = useRef(0);
  const cachedParsedPagesRef = useRef<StoryPage[]>([]);

  // Auto-advance to the page the live-typing path points at, so the user
  // is always looking at the page the model is actually writing. Only
  // fires when in the editor view and streaming.
  const prevLivePageIdxRef = useRef<number>(-1);
  useEffect(() => {
    if (!sbLiveTyping) return;
    if (prevLivePageIdxRef.current === sbLiveTyping.pageIdx) return;
    prevLivePageIdxRef.current = sbLiveTyping.pageIdx;
    if (viewRef.current === 'editor' && isStreaming) {
      setCurrentPageIdx(sbLiveTyping.pageIdx);
    }
  }, [sbLiveTyping, isStreaming]);

  // Auto-advance to the intro view when the model starts typing the
  // introductionPage.moodText. Fires once per stream.
  const hasShownIntroRef = useRef(false);
  useEffect(() => {
    if (!isStreaming) {
      hasShownIntroRef.current = false;
      return;
    }
    if (sbIntroLiveText != null && !hasShownIntroRef.current) {
      hasShownIntroRef.current = true;
      if (viewRef.current === 'editor') {
        setCurrentPageIdx(-2);
      }
    }
  }, [sbIntroLiveText, isStreaming]);

  // Preload diffusion pipeline ~2 pages before the end of story generation.
  // Uses both the fine parser (sbLiveTyping.pageIdx) and the coarse parser
  // (livePages.length) as dual triggers so null gaps don't cause a miss.
  const hasTriggeredPreloadRef = useRef(false);
  useEffect(() => {
    if (!isStreaming) {
      hasTriggeredPreloadRef.current = false;
      return;
    }
    if (hasTriggeredPreloadRef.current) return;
    if (formData.pageCount < 4 || !hasDiffusion) return;

    const triggerIdx = formData.pageCount - 3; // 0-indexed: 2 pages before the last
    const fineReached = sbLiveTyping && sbLiveTyping.pageIdx >= triggerIdx;
    const coarseReached = livePages.length >= triggerIdx;

    if (fineReached || coarseReached) {
      hasTriggeredPreloadRef.current = true;
      fetch('http://localhost:8000/api/image-service/preload', { method: 'POST' }).catch(() => {});
    }
  }, [isStreaming, sbLiveTyping, livePages.length, formData.pageCount, hasDiffusion]);

  // Sync the fine-parsed introductionPage.moodText into parsedBook
  // during streaming, so:
  //   - the thumbnail on the left shows the growing intro text preview
  //   - the save/draft state captures the latest snapshot
  //   - navigating away and back shows what's been typed so far
  useEffect(() => {
    if (!isStreaming) return;
    const streamedIntro = sbStreamingData && (sbStreamingData as any).introductionPage;
    if (!streamedIntro || typeof streamedIntro.moodText !== 'string') return;
    setParsedBook(prev => {
      if (!prev) return prev;
      const prevIntro = prev.introductionPage;
      // Avoid needless state updates if nothing changed
      if (
        prevIntro &&
        prevIntro.moodText === streamedIntro.moodText &&
        prevIntro.sceneId === (streamedIntro.sceneId || '')
      ) {
        return prev;
      }
      return {
        ...prev,
        introductionPage: {
          moodText: streamedIntro.moodText,
          sceneId: streamedIntro.sceneId || prevIntro?.sceneId || 'default',
          bundledSceneId: prevIntro?.bundledSceneId,
        },
      };
    });
  }, [isStreaming, sbStreamingData]);

  // ── Early editor-view transition ──────────────────────────────────────────
  // The coarse `tryParsePartialPages` only commits a page when its closing
  // '}' arrives, which means the old transition-to-editor logic waited an
  // entire page (30-60 seconds) before switching off the skeleton view.
  // During that wait, page 1 is already streaming live via the fine parser
  // but the user can't see it because we're still in the generic skeleton.
  //
  // This effect watches the fine parser (useStreamingJson) and enters the
  // editor view as soon as ANY streaming content arrives for the intro or
  // any story page — typically within seconds of the stream starting. Then
  // the live-typing auto-advance takes over for subsequent pages.
  const hasTransitionedToEditorRef = useRef(false);
  useEffect(() => {
    if (!isStreaming) {
      hasTransitionedToEditorRef.current = false;
      return;
    }
    if (hasTransitionedToEditorRef.current) return;
    if (viewRef.current !== 'streaming') return;

    const hasIntroContent = !!(sbStreamingData && (sbStreamingData as any).introductionPage);
    const hasPageContent = !!(
      sbStreamingData &&
      Array.isArray((sbStreamingData as any).pages) &&
      (sbStreamingData as any).pages.length > 0
    );
    const hasLiveTyping = !!sbLiveTyping || sbIntroLiveText != null;

    if (!hasIntroContent && !hasPageContent && !hasLiveTyping) return;

    // Build a placeholder parsedBook so the editor has something to render.
    const totalExpected = formData.pageCount;
    const placeholderPages: StoryPage[] = [];
    for (let i = 0; i < totalExpected; i++) {
      placeholderPages.push({
        pageNumber: i + 1,
        textSegments: [],
        sceneId: 'default',
        imagePlacement: 'none',
        characterAnimation: 'fadeIn',
        textAnimation: 'fadeIn',
      });
    }
    const gl = formData.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${formData.gradeLevel}`;
    const placeholderCover: CoverPage = {
      title: formData.title || 'Generating...',
      subtitle: `${gl}${formData.subject ? ' • ' + formData.subject : ''}`,
      authorName: formData.authorName || undefined,
    };
    const placeholderIntro: IntroductionPage = {
      moodText: '',
      sceneId: 'default',
    };

    setParsedBook(prev => {
      // Preserve any existing parsed book (e.g. from localStorage restore)
      const base = prev || {
        title: formData.title || 'Generating...',
        gradeLevel: formData.gradeLevel,
        pages: placeholderPages,
        scenes: [],
        styleSuffix: '',
      };
      return {
        ...base,
        pages: base.pages && base.pages.length > 0 ? base.pages : placeholderPages,
        coverPage: base.coverPage || placeholderCover,
        introductionPage: base.introductionPage || placeholderIntro,
      };
    });

    // Navigate to whatever is currently streaming
    if (sbIntroLiveText != null || hasIntroContent) {
      setCurrentPageIdx(-2);
    } else if (sbLiveTyping) {
      setCurrentPageIdx(sbLiveTyping.pageIdx);
    } else {
      setCurrentPageIdx(0);
    }
    setView('editor');
    hasTransitionedToEditorRef.current = true;
  }, [isStreaming, sbStreamingData, sbLiveTyping, sbIntroLiveText, formData]);

  useEffect(() => {
    if (!streamingContent) {
      pageScanOffsetRef.current = 0;
      cachedParsedPagesRef.current = [];
      return;
    }
    const { pages: newPages, nextScanFrom } = tryParsePartialPages(streamingContent, pageScanOffsetRef.current);
    if (newPages.length > 0) {
      const allPages = [...cachedParsedPagesRef.current, ...newPages];
      cachedParsedPagesRef.current = allPages;
      pageScanOffsetRef.current = nextScanFrom;
      setLivePages(allPages);

      // Transition from skeleton to editor as soon as first page arrives
      if (viewRef.current === 'streaming' && allPages.length >= 1) {
        // Build a temporary parsedBook with completed pages + placeholders for remaining
        const completedPages: StoryPage[] = allPages.map(p => ({
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
        const combinedPages = [...completedPages, ...placeholders];
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
          return { ...base, pages: combinedPages, coverPage };
        });
        setCurrentPageIdx(0);
        setView('editor');
      } else if (viewRef.current === 'editor' && isStreaming) {
        // Update in-progress pages in the editor as more content streams in
        setParsedBook(prev => {
          if (!prev) return prev;
          const updatedPages = [...prev.pages];
          for (const lp of allPages) {
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
        if (allPages.length > prevLivePagesCountRef.current) {
          // A new page just started — navigate to it
          setCurrentPageIdx(allPages.length - 1);
        }
      }
      prevLivePagesCountRef.current = allPages.length;
    }

    if (!isStreaming && streamingContent) {
      // Fallback: ensure diffusion is preloaded when streaming ends (if not already triggered)
      if (!hasTriggeredPreloadRef.current && hasDiffusion) {
        hasTriggeredPreloadRef.current = true;
        fetch('http://localhost:8000/api/image-service/preload', { method: 'POST' }).catch(() => {});
      }
      // Streaming finished — parse full book
      setGenerationPhase('idle');
      setLivePages([]);
      prevLivePagesCountRef.current = 0;
      console.log('[StoryBook] Streaming done. Content length:', streamingContent.length, 'Preview:', streamingContent.substring(0, 200));
      const full = tryParseFullBook(streamingContent);
      console.log('[StoryBook] Parse result:', full ? `${full.pages.length} pages` : 'FAILED (null)');
      if (full && full.pages.length > 0) {
        // Auto-match bundled scenes + compute client-side defaults for removed fields
        const pages = full.pages.map((p, i) => {
          const placement = p.imagePlacement || (i % 2 === 0 ? 'right' : 'left');
          return {
            ...p,
            bundledSceneId: findBestScene(p.sceneId).id,
            imagePlacement: placement,
            characterAnimation: p.characterAnimation || (placement === 'left' ? 'slideInLeft' : placement === 'right' ? 'slideInRight' : 'fadeIn'),
            textAnimation: p.textAnimation || 'fadeIn',
          };
        });
        // Inject constant styleSuffix client-side
        const withStyle = { ...full, pages, styleSuffix: full.styleSuffix || STYLE_SUFFIXES[formData.stylePreset || 'cartoon_3d'] || STORYBOOK_STYLE_SUFFIX };
        // Match bundled scene for the introduction page (same treatment
        // as story pages). Safe no-op on older saves without intro.
        if (withStyle.introductionPage && withStyle.introductionPage.sceneId) {
          withStyle.introductionPage = {
            ...withStyle.introductionPage,
            bundledSceneId: findBestScene(withStyle.introductionPage.sceneId).id,
          };
        }
        // Validate speakers match form config
        const validated = validateSpeakers(withStyle, formData);
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
        triggerCheck();
        // User can click "Generate Images" or generate per-page individually
      } else {
        // Full parse failed (e.g. generation timed out mid-JSON).
        // Fall back to whatever pages were already parsed incrementally during streaming.
        const cachedPages = cachedParsedPagesRef.current;
        if (cachedPages.length > 0) {
          console.log('[StoryBook] Full parse failed — recovering', cachedPages.length, 'incrementally-parsed pages');
          const pages = cachedPages.map(p => ({
            ...p,
            bundledSceneId: findBestScene(p.sceneId).id,
          }));
          const gradeLabel = formData.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${formData.gradeLevel}`;
          const coverPage: CoverPage = {
            title: formData.title || 'Untitled',
            subtitle: `${gradeLabel}${formData.subject ? ' • ' + formData.subject : ''}`,
            authorName: formData.authorName || undefined,
          };
          const recovered: ParsedStorybook = {
            title: formData.title || 'Untitled',
            gradeLevel: formData.gradeLevel,
            pages,
            scenes: [],
            characters: formData.speakers?.filter(s => s.characterName).map(s => s.characterName!) || [],
            characterDescriptions: {},
            voiceAssignments: {},
            styleSuffix: '',
            coverPage,
          };
          const validated = validateSpeakers(recovered, formData);
          setParsedBook({ ...validated, coverPage });
          setCurrentPageIdx(-1);
          setView('editor');
          const saved = saveStorybook(formData, validated, currentDraftId || undefined);
          setCurrentDraftId(saved.id);
        } else {
          setView('input');
        }
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
      if (!data.image) throw new Error('BG removal returned no image data');
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
  const handleGenerateAllImages = useCallback(async (
    book?: ParsedStorybook,
    opts?: { skipBackgrounds?: boolean; skipCharacters?: boolean },
  ) => {
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
              ...(pageResult.characterImageData2 && { characterImageData2: pageResult.characterImageData2 }),
              ...(pageResult.characterSeed2 != null && { characterSeed2: pageResult.characterSeed2 }),
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
        skipBackgrounds: opts?.skipBackgrounds,
        skipCharacters: opts?.skipCharacters,
        signal: abort.signal,
        generationMode: settings.generationMode,
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

  /** Generate a single page's character image. Pass which=2 for 2nd character. */
  const handleGeneratePageImage = useCallback(async (pageIdx: number, which: 1 | 2 = 1) => {
    if (guardOffline()) return;
    if (!parsedBook) return;
    const page = parsedBook.pages[pageIdx];

    // Determine which character scene + name to use
    const scene = which === 2 ? page?.characterScene2 : page?.characterScene;
    const charName = which === 2 ? (page?.characterName2 || '') : (page?.characterName || Object.keys(parsedBook.characterDescriptions || {})[0] || 'default');
    if (!scene) return;

    setIsRemovingBg(pageIdx); // reuse spinner state

    const styleSuffix = parsedBook.styleSuffix || STYLE_SUFFIXES[formData.stylePreset || 'cartoon_3d'] || STORYBOOK_STYLE_SUFFIX;
    const charDescs = parsedBook.characterDescriptions || {};

    // Per-character seed and reference
    const existingSeed = which === 2
      ? parsedBook.pages.find(p => p.characterSeed2)?.characterSeed2
      : parsedBook.pages.find(p => p.characterSeed)?.characterSeed;
    const existingRef = parsedBook.characterReferenceImages?.[charName]
      || (which === 1 ? Object.values(parsedBook.characterReferenceImages || {})[0] : undefined);

    try {
      let rawChar: string;
      let seed: number;

      if (existingRef && existingSeed != null) {
        // Use img2img from reference for consistent character with new pose
        const singleDesc = charDescs[charName] ? { [charName]: charDescs[charName] } : charDescs;
        const result = await generateCharacterFromReference(
          singleDesc, scene, styleSuffix, existingSeed, existingRef, 0.55,
        );
        rawChar = result.imageData;
        seed = result.seed;
      } else {
        // First character generation — create fresh and save as reference
        const singleDesc = charDescs[charName] ? { [charName]: charDescs[charName] } : charDescs;
        const result = await generateCharacterImage(
          singleDesc, scene, styleSuffix, existingSeed,
        );
        rawChar = result.imageData;
        seed = result.seed;

        // Store as reference for future generations
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

      if (which === 2) {
        updatePage(pageIdx, {
          characterImageData2: finalChar,
          characterSeed2: seed,
        });
      } else {
        updatePage(pageIdx, {
          characterImageData: finalChar,
          characterSeed: seed,
          imagePlacement: page.imagePlacement === 'none' ? 'right' : page.imagePlacement,
        });
      }
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

    const styleSuffix = parsedBook.styleSuffix || STYLE_SUFFIXES[formData.stylePreset || 'cartoon_3d'] || STORYBOOK_STYLE_SUFFIX;

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
        await exportAnimatedHTML(parsedBook, formData, accentColor, (p) => setExportProgress(p), settings.language);
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
      triggerCheck();
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
              const blob = await fetchTTSBlob(seg.text, voice, settings.language);
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
      triggerCheck();
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
              // Validate data URIs — reject corrupted entries like "data:image/png;base64,undefined"
              const validDataUri = (uri: string | undefined) =>
                uri && uri.startsWith('data:image/') && !uri.endsWith(',undefined') ? uri : undefined;
              return {
                ...prev,
                coverPage,
                pages: prev.pages.map((p, i) => ({
                  ...p,
                  characterImageData: validDataUri(imageMap.get(`${i}:character`)) ?? p.characterImageData,
                  characterImageData2: validDataUri(imageMap.get(`${i}:character2`)) ?? p.characterImageData2,
                  backgroundImageData: validDataUri(imageMap.get(`${i}:background`)) ?? p.backgroundImageData,
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
      <div className="flex h-full" style={{ '--ng-accent': accentColor } as React.CSSProperties}>
      <div className="flex-1 h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accentColor}22` }}>
              <Icon icon={BookOpen01IconData} className="w-5" style={{ color: accentColor }} />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-theme-heading">{t('storybook.title')}</h1>
              <p className="text-sm text-theme-muted">{t('storybook.subtitle')}</p>
            </div>
            <button
              onClick={() => setShowHistory(prev => !prev)}
              className="relative p-2 rounded-lg hover:bg-theme-hover transition"
              title={t('storybook.storybookHistory')}
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
              {t('storybook.storyTitle')} <span className="text-xs" style={{ color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <SmartInput
              value={formData.title}
              onChange={v => updateForm('title', v)}
              placeholder={t('storybook.titlePlaceholder')}
              className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
            />
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-sm font-medium text-theme-label mb-1.5">
              {t('storybook.authorName')}
            </label>
            <SmartInput
              value={formData.authorName}
              onChange={v => updateForm('authorName', v)}
              placeholder={t('storybook.authorPlaceholder')}
              className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
            />
          </div>

          {/* Grade Level */}
          <div>
            <label className="block text-sm font-medium text-theme-label mb-1.5">
              {t('forms.gradeLevel')} <span className="text-red-500">*</span>
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
              <option value="">{t('forms.selectGrade')}</option>
              {grades.map(g => (
                <option key={g} value={g}>{g === 'K' ? t('storybook.kindergarten') : t('storybook.gradeN', { n: g })}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-theme-label mb-1.5">
              {t('forms.subject')} <span className="text-red-500">*</span>
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
              <option value="">{t('forms.selectSubject')}</option>
              {availableSubjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Curriculum toggle + fields — directly after Grade + Subject */}
          {formData.subject && formData.gradeLevel && (
            <div>
              {/* Standalone toggle */}
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-sm font-medium text-theme-label">
                  {t('storybook.alignCurriculum')}
                </span>
                <NeuroSwitch
                  checked={formData.useCurriculum}
                  onChange={(v) => updateForm('useCurriculum', v)}
                  size="sm"
                  aria-label={t('storybook.alignCurriculum')}
                />
              </div>

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
                      {t('storybook.curriculumNote')}
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
                  {t('storybook.storyDescription')} <span className="text-red-500">*</span>
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
                  {isListening ? t('storybook.listening') : t('storybook.speak')}
                </button>
              </div>
              <SmartTextArea
                value={formData.description}
                onChange={v => updateForm('description', v)}
                rows={4}
                placeholder={t('storybook.descriptionPlaceholder')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent resize-none ${validationErrors.description ? 'border-red-500 validation-error' : 'border-theme-strong'}`}
                data-validation-error={validationErrors.description ? 'true' : undefined}
                style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
              />
              {validationErrors.description && (
                <p className="text-xs text-red-500 mt-1">{t('storybook.describeStory')}</p>
              )}
            </div>
          )}

          {/* Page count */}
          <div>
            <label className="block text-sm font-medium text-theme-label mb-2">
              {t('storybook.pages')} <span style={{ color: accentColor }}>{formData.pageCount}</span>
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
              <span>{t('storybook.nPages', { count: 6 })}</span>
              <span>{t('storybook.nPages', { count: 12 })}</span>
            </div>
          </div>

          {/* Image Mode */}
          <div>
            <label className="block text-sm font-medium text-theme-label mb-2">{t('presentation.images')}</label>
            <ImageModeSelector
              imageMode={formData.imageMode}
              onModeChange={m => updateForm('imageMode', m)}
              accentColor={accentColor}
              hasDiffusion={hasDiffusion}
              hasVision={hasVision}
              labels={{ none: t('storybook.imageModeNone'), suggested: t('storybook.imageModeGuidance'), myImages: t('storybook.imageModeMyImages'), ai: t('storybook.imageModeAI') }}
              descs={{ none: t('storybook.imageModeNoneDesc'), suggested: t('storybook.imageModeGuidanceDesc'), myImages: t('storybook.imageModeMyImagesDesc'), ai: t('storybook.imageModeAIDesc') }}
            />
          </div>

          {/* Style Preset -- only when AI image mode */}
          {formData.imageMode === 'ai' && (
            <div>
              <label className="block text-sm font-medium text-theme-label mb-2">Visual Style</label>
              <div
                ref={sbVsContainerRef}
                className="ng-segment ng-rect w-full"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${STYLE_PRESETS.length}, 1fr)`,
                  '--ng-accent': accentColor,
                } as React.CSSProperties}
              >
                {sbVsPill && (
                  <div className="ng-segment-pill" style={{ left: sbVsPill.left, width: sbVsPill.width }} aria-hidden="true" />
                )}
                {STYLE_PRESETS.map((preset, idx) => {
                  const active = formData.stylePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      ref={el => { sbVsBtnRefs.current[idx] = el; }}
                      type="button"
                      onClick={() => updateForm('stylePreset', preset.id)}
                      className={`ng-segment-btn flex-col gap-0.5 py-2.5${active ? ' ng-seg-active' : ''}`}
                      style={{ height: 'auto', borderRadius: '5px' }}
                    >
                      <span className="text-xs font-semibold leading-tight">{preset.label}</span>
                      {active && <span className="text-[10px] leading-tight" style={{ opacity: 0.7 }}>{preset.hint}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Background Count — only when AI image mode */}
          {formData.imageMode === 'ai' && (
            <div>
              <label className="block text-sm font-medium text-theme-label mb-2">
                {t('storybook.backgrounds')}
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
                  {t('storybook.auto')}
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
                  ? t('storybook.bgCountAutoDesc')
                  : t('storybook.bgCountExactDesc', { count: formData.backgroundCount })}
              </p>
            </div>
          )}

          {/* Speakers */}
          <div>
            <label className="block text-sm font-medium text-theme-label mb-2">{t('storybook.narratorsVoices')}</label>
            <div className="mb-3" style={{ '--ng-accent': accentColor } as React.CSSProperties}>
              <NeuroSegment
                options={[
                  { value: '1', label: t('storybook.narratorOnly') },
                  { value: '2', label: t('storybook.oneCharacter') },
                  { value: '3', label: t('storybook.twoCharacters') },
                ]}
                value={String(formData.speakerCount)}
                onChange={(v) => setSpeakerCount(Number(v) as 1 | 2 | 3)}
                size="sm"
                shape="rect"
                className="w-full"
              />
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
                      <p className="text-xs text-theme-muted mb-1">{sp.role === 'narrator' ? t('storybook.narrator') : `${t('storybook.character')} ${i}`}</p>
                      {sp.role !== 'narrator' && (
                        <input
                          type="text"
                          value={sp.characterName || ''}
                          onChange={e => updateSpeaker(i, { characterName: e.target.value })}
                          placeholder={t('storybook.characterName')}
                          className="w-full px-2 py-1 text-sm border border-theme-strong rounded focus:ring-1 bg-theme"
                          style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-theme-muted mb-1">{t('storybook.voice')}</p>
                      <select
                        value={sp.voice}
                        onChange={e => {
                          const newVoice = e.target.value as VoiceName;
                          updateSpeaker(i, { voice: newVoice });
                          if (voiceAvailability[newVoice] === false) {
                            toastOnly('This voice is not downloaded yet. Connect to the internet to download it.', 'info', 5000);
                          }
                        }}
                        className="w-full px-2 py-1 text-sm border border-theme-strong rounded focus:ring-1 bg-theme"
                        style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                      >
                        {Object.entries(VOICE_LABELS).map(([v, label]) => (
                          <option key={v} value={v}>{`${voiceAvailability[v] === false ? '\u25CB' : '\u25CF'} ${label}`}</option>
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
            className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
            style={{ background: accentColor }}
          >
            <Icon icon={BookOpen01IconData} className="w-5 h-5" />
            {t('generators.generateStory')}
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
      ? t('storybook.writingStory')
      : generationPhase === 'formatting_pages'
        ? t('storybook.formattingPages')
        : t('storybook.writingStory');
    const phaseDetail = generationPhase === 'writing_story'
      ? t('storybook.phaseNarrativeFirst')
      : generationPhase === 'formatting_pages'
        ? livePages.length > 0
          ? t('storybook.phaseNofMPagesReady', { n: livePages.length, m: formData.pageCount })
          : t('storybook.phaseBreakingStory')
        : livePages.length > 0
          ? t('storybook.phaseNofMPagesReady', { n: livePages.length, m: formData.pageCount })
          : t('storybook.phaseCraftingCharacters');

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
          {t('common.cancel')}
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
  const isIntroSelected = currentPageIdx === -2;
  const currentPage = isCoverSelected || isIntroSelected ? null : parsedBook.pages[currentPageIdx];

  return (
    <div className="flex h-full" style={{ '--ng-accent': accentColor } as React.CSSProperties}>
    <div className="flex-1 h-full flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 border-b border-theme px-4 py-2 flex items-center gap-3" style={{ borderBottomColor: `${accentColor}33` }}>
        <button
          onClick={() => setView('input')}
          className="text-theme-muted hover:text-theme-heading flex items-center gap-1 text-sm"
        >
          <Icon icon={ArrowLeft01IconData} className="w-4" /> {t('storybook.editForm')}
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-semibold text-theme-heading text-sm truncate">{parsedBook.title}</h2>
          <p className="text-xs text-theme-muted">
            {isStreaming ? (
              <>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1 align-middle" />
                {t('storybook.writingPageNofM', { n: livePages.length, m: formData.pageCount })}
              </>
            ) : (
              <>
                {parsedBook.gradeLevel === 'K' ? t('storybook.kindergarten') : t('storybook.gradeN', { n: parsedBook.gradeLevel })}
                {formData.subject && ` • ${formData.subject}`}
                {' • '}{t('storybook.nPages', { count: parsedBook.pages.length })}
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
              {t('common.cancel')}
            </button>
          )}
          {/* Save */}
          {!isStreaming && <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm border border-theme-strong hover:bg-theme-secondary text-theme-muted hover:text-theme-heading"
            title={t('storybook.saveStorybook')}
          >
            <Icon icon={FloppyDiskIconData} className="w-4" />
          </button>}
          {/* History */}
          {!isStreaming && <button
            onClick={() => setShowHistory(prev => !prev)}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm border border-theme-strong hover:bg-theme-secondary text-theme-muted hover:text-theme-heading"
            title={t('storybook.storybookHistory')}
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
                  ? `${imageGenProgress.stage === 'background' ? t('storybook.genProgressBackgrounds') : t('storybook.genProgressCharacters')} ${imageGenProgress.current}/${imageGenProgress.total}`
                  : t('storybook.generating')}
              </button>
            ) : (
              <button
                onClick={() => handleGenerateAllImages()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-theme-strong hover:bg-theme-secondary text-theme-heading"
              >
                <Icon icon={Image01IconData} className="w-4" style={{ color: accentColor }} />
                {t('storybook.generateImages')}
              </button>
            )
          )}
          {!isStreaming && (
          <>
          <button
            onClick={() => {
              if (parsedBook) {
                const missing = parsedBook.pages.some(p => !p.backgroundImageData || (!p.characterImageData && p.characterScene && p.imagePlacement !== 'none') || (!p.characterImageData2 && p.characterScene2 && p.imagePlacement !== 'none'));
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
            <Icon icon={PlayIconData} className="w-4" /> {t('storybook.play')}
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
              {exportProgress ? exportProgress.label : t('common.export')}
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 rounded-xl border border-theme shadow-lg z-20">
                {[
                  { fmt: 'pdf' as const,  label: t('storybook.formatPDF'),          iconData: File01IconData },
                  { fmt: 'pptx' as const, label: t('storybook.formatPPTX'),         iconData: Presentation01IconData },
                  { fmt: 'html' as const, label: t('storybook.formatAnimatedHTML'), iconData: Video01IconData },
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
                    <Icon icon={Settings01IconData} className="w-4" /> {t('storybook.exportSettings')}
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
                <span className="text-theme-heading font-medium">{t('storybook.writingStoryEllipsis')}</span>
                <span className="text-theme-muted">
                  {t('storybook.nofMPages', { n: livePages.length, m: formData.pageCount })}
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
                  {imageGenProgress.stage === 'background' ? t('storybook.generatingBackgrounds') : t('storybook.generatingCharacters')}
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
              {t('common.cancel')}
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
            {tab === 'story' ? t('storybook.storyPages') : `Questions${parsedBook.comprehensionQuestions?.length ? ` (${parsedBook.comprehensionQuestions.length})` : ''}`}
          </button>
        ))}
      </div>
      )}

      {activeTab === 'questions' ? (
        // ── Comprehension Questions Panel ──────────────────────────────────
        <div className="flex-1 overflow-y-auto p-6">
          {parsedBook.learningObjectiveSummary && (
            <div className="mb-4 p-3 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-0.5">{t('storybook.learningObjective')}</p>
              <p className="text-sm text-theme-heading">{parsedBook.learningObjectiveSummary}</p>
            </div>
          )}
          {(!parsedBook.comprehensionQuestions || parsedBook.comprehensionQuestions.length === 0) ? (
            <div className="text-center py-12 text-theme-muted">
              <Icon icon={QuestionIconData} className="w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{t('storybook.noQuestionsGenerated')}</p>
              <p className="text-xs mt-1">{t('storybook.enableCurriculumToGetQuestions')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-theme-muted">
                {t('storybook.questionsAfterReading')}
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
                    <p className="text-xs text-theme-muted font-semibold mb-0.5">{t('storybook.expectedAnswer')}</p>
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
                    {t('storybook.coverPage')}
                  </p>
                </div>
              </button>
            )}
            {/* Introduction page thumbnail — sits between cover and P1 */}
            {parsedBook.introductionPage && (
              <button
                onClick={() => setCurrentPageIdx(-2)}
                className="w-full rounded-lg overflow-hidden border-2 transition-all text-left"
                style={{ borderColor: isIntroSelected ? accentColor : 'transparent' }}
              >
                <div
                  className="relative overflow-hidden flex items-center justify-center"
                  style={{
                    aspectRatio: '297 / 210',
                    background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}05)`,
                  }}
                >
                  <div className="relative z-10 text-center p-1">
                    <p className="text-[5px] italic leading-[7px] text-gray-700 dark:text-gray-300 line-clamp-4" style={{ opacity: 0.8 }}>
                      {parsedBook.introductionPage.moodText || 'Introduction...'}
                    </p>
                  </div>
                </div>
                <div className="px-1.5 py-0.5" style={{ background: isIntroSelected ? `${accentColor}10` : undefined }}>
                  <p className="text-[10px] font-semibold" style={{ color: isIntroSelected ? accentColor : undefined }}>
                    Intro
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
              const thumbColorMap = isDark ? SCENE_BG_COLORS_DARK : SCENE_BG_COLORS;
              const bgColor = bgScene ? thumbColorMap[bgScene.category] : (isDark ? DARK_PAGE_FALLBACK : '#f3f4f6');
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
                        ? isDark
                          ? 'linear-gradient(90deg, #333 0%, #444 50%, #333 100%)'
                          : 'linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%)'
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
                          <p key={j} className="text-[5px] leading-[7px] text-gray-700 dark:text-gray-300 truncate" style={{ opacity: 0.8 }}>
                            {seg.speaker !== 'narrator' ? `${seg.speaker}: ` : ''}{seg.text}
                          </p>
                        ))}
                        <div className="flex items-center gap-0.5 mt-0.5">
                          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[5px] text-green-600">{t('storybook.writingBadge')}</span>
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
                            <p key={j} className="text-[5px] leading-[7px] text-gray-700 dark:text-gray-300 truncate" style={{ opacity: 0.7 }}>
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
                  disabled={
                    isCoverSelected ||
                    (isIntroSelected && !parsedBook.coverPage) ||
                    (currentPageIdx === 0 && !parsedBook.introductionPage && !parsedBook.coverPage)
                  }
                  onClick={() => setCurrentPageIdx(p => {
                    // 0 → (intro if present) → (cover if present)
                    if (p === 0) {
                      if (parsedBook.introductionPage) return -2;
                      if (parsedBook.coverPage) return -1;
                      return p;
                    }
                    // -2 (intro) → -1 (cover)
                    if (p === -2) return parsedBook.coverPage ? -1 : p;
                    return p - 1;
                  })}
                  className="text-theme-muted hover:text-theme-heading disabled:opacity-30"
                >
                  <Icon icon={ArrowLeft01IconData} className="w-5" />
                </button>
                <span className="text-sm text-theme-muted">
                  {isCoverSelected
                    ? t('storybook.coverPage')
                    : isIntroSelected
                      ? 'Introduction'
                      : t('storybook.pageNofM', { n: currentPageIdx + 1, m: parsedBook.pages.length })}
                </span>
                <button
                  disabled={currentPageIdx === parsedBook.pages.length - 1}
                  onClick={() => setCurrentPageIdx(p => {
                    // -1 (cover) → -2 (intro if present) → 0
                    if (p === -1) return parsedBook.introductionPage ? -2 : 0;
                    // -2 (intro) → 0
                    if (p === -2) return 0;
                    return p + 1;
                  })}
                  className="text-theme-muted hover:text-theme-heading disabled:opacity-30"
                >
                  <Icon icon={ArrowRight01IconData} className="w-5" />
                </button>
              </div>

              {isCoverSelected && parsedBook.coverPage ? (
                <CoverPagePreview coverPage={parsedBook.coverPage} accentColor={accentColor} isDark={isDark} />
              ) : isIntroSelected ? (() => {
                // Intro view. Source of truth:
                //  - Live: during streaming, pull moodText from sbStreamingData.
                //    While the string is open, sbIntroLiveText has the partial
                //    text and we render it with caret + smooth reveal. When
                //    the string closes, it shows as fully committed text.
                //  - Static: otherwise render parsedBook.introductionPage.
                const streamingIntro = isStreaming
                  ? sbStreamingData?.introductionPage
                  : null;
                const effectiveIntro: IntroductionPage | null =
                  streamingIntro && typeof streamingIntro.moodText === 'string'
                    ? {
                        moodText: streamingIntro.moodText,
                        sceneId: streamingIntro.sceneId || '',
                        bundledSceneId: parsedBook.introductionPage?.bundledSceneId,
                      }
                    : parsedBook.introductionPage || null;

                // If streaming but moodText hasn't opened yet, show a
                // skeleton-like placeholder with the same pulse glow.
                if (isStreaming && !effectiveIntro && sbIntroLiveText == null) {
                  return (
                    <IntroductionPagePreview
                      intro={{ moodText: '', sceneId: '' }}
                      accentColor={accentColor}
                      liveText={''}
                      isStreaming
                      isDark={isDark}
                    />
                  );
                }

                if (!effectiveIntro) {
                  // Genuine absence (e.g. old saved story without intro)
                  // — fall through to showing nothing useful; this
                  // button should not have been clickable in that case.
                  return null;
                }
                return (
                  <IntroductionPagePreview
                    intro={effectiveIntro}
                    accentColor={accentColor}
                    liveText={sbIntroLiveText}
                    isStreaming={isStreaming}
                    isDark={isDark}
                  />
                );
              })() : currentPage ? (() => {
                // Does the live-typing path point at THIS page?
                const liveMatches = !!(sbLiveTyping && sbLiveTyping.pageIdx === currentPageIdx);

                // Fine-grained source of truth for segments on the active
                // page. `sbStreamingData.pages[N].textSegments` grows as
                // each segment's string closes — well ahead of the coarse
                // `tryParsePartialPages` parser which only emits on the
                // whole page's closing '}'.
                const streamingSegments: Array<{ speaker: string; text?: string }> | null =
                  isStreaming && sbStreamingData?.pages?.[currentPageIdx]?.textSegments
                    ? sbStreamingData.pages[currentPageIdx].textSegments
                    : null;

                // Filter out ghost segments — the partial-JSON repair
                // briefly emits `{speaker: "Alice"}` with text=undefined
                // while the speaker string has closed but the text string
                // hasn't opened yet. Rendering those would show literal
                // "undefined" text rows. The live overlay below handles
                // the currently-typing segment separately.
                const committedStreamingSegments = streamingSegments
                  ? streamingSegments.filter(
                      (s: any) => s && typeof s.text === 'string' && s.text.length > 0
                    )
                  : null;

                // Effective segments = fine-parsed if streaming, else the
                // coarse/committed parsedBook version for non-streaming pages.
                const effectiveSegments = committedStreamingSegments ?? currentPage.textSegments;

                // Live overlay: render the partial text being typed.
                // Speaker inference reads from the UNFILTERED streaming
                // segments array, because the speaker field was
                // committed before we filtered the ghost row out.
                const liveSegProp = (() => {
                  if (!liveMatches || !sbLiveTyping) return null;
                  const segAtUnfiltered = streamingSegments?.[sbLiveTyping.segIdx];
                  if (
                    segAtUnfiltered &&
                    typeof segAtUnfiltered.text === 'string' &&
                    segAtUnfiltered.text.length >= sbLiveTyping.partialText.length
                  ) {
                    return null;
                  }
                  const inferredSpeaker = segAtUnfiltered?.speaker || 'narrator';
                  return {
                    text: sbLiveTyping.partialText,
                    speaker: inferredSpeaker,
                  };
                })();

                // Render decision — fixed to rely on the fine parser's
                // segments and the live overlay, NOT the coarse livePages
                // count. Previously the render fell through to an empty
                // PagePreview during the ~200ms gap between "segment text
                // closed" and "next segment text opened" on the same page,
                // causing visible text to disappear between segments.
                const hasAnyStreamingContent =
                  effectiveSegments.length > 0 || liveMatches;
                const showStreamingView = isStreaming && hasAnyStreamingContent;
                const isSkeletonPage = isStreaming && !hasAnyStreamingContent;

                if (isSkeletonPage) {
                  return <SkeletonPagePreview isDark={isDark} />;
                } else if (showStreamingView) {
                  // Build a synthetic "page" with the effective segments
                  // so StreamingPagePreview renders all segments already
                  // committed by the fine parser, plus any live overlay.
                  const liveRenderPage: StoryPage = {
                    ...currentPage,
                    textSegments: effectiveSegments,
                  };
                  return (
                    <StreamingPagePreview
                      page={liveRenderPage}
                      accentColor={accentColor}
                      liveSegment={liveSegProp}
                      isDark={isDark}
                    />
                  );
                } else {
                  return <PagePreview page={currentPage} accentColor={accentColor} isDark={isDark} />;
                }
              })() : null}

              {/* Image guidance note (suggested mode) */}
              {!isCoverSelected && currentPage && formData.imageMode === 'suggested' && currentPage.characterScene && (
                <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-3">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-0.5">{t('storybook.imageGuidance')}</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">{currentPage.characterScene}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Edit panel (hidden during streaming) */}
          <div className={`w-72 shrink-0 border-l border-theme overflow-y-auto p-4 space-y-5 ${isStreaming ? 'hidden' : ''}`}>
            {isIntroSelected && parsedBook.introductionPage ? (
              /* ── Introduction Page Edit Panel ──────────────────────── */
              <>
                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">Introduction (Mood Text)</label>
                  <p className="text-[11px] text-theme-muted mb-2 italic">3-5 narrator-only sentences that set the atmosphere before the story begins.</p>
                  <textarea
                    value={parsedBook.introductionPage.moodText}
                    onChange={e => setParsedBook(prev => prev ? {
                      ...prev,
                      introductionPage: { ...prev.introductionPage!, moodText: e.target.value },
                    } : prev)}
                    rows={8}
                    className="w-full px-3 py-2 text-sm border border-theme-strong rounded-lg bg-theme leading-relaxed"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">Scene ID</label>
                  <input
                    value={parsedBook.introductionPage.sceneId}
                    onChange={e => setParsedBook(prev => prev ? {
                      ...prev,
                      introductionPage: { ...prev.introductionPage!, sceneId: e.target.value },
                    } : prev)}
                    className="w-full px-3 py-2 text-sm border border-theme-strong rounded-lg bg-theme"
                    placeholder="e.g. park, bedroom, forest"
                  />
                </div>
              </>
            ) : isCoverSelected && parsedBook.coverPage ? (
              /* ── Cover Page Edit Panel ─────────────────────────────── */
              <>
                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">{t('storybook.editCoverTitle')}</label>
                  <input
                    value={parsedBook.coverPage.title}
                    onChange={e => setParsedBook(prev => prev ? { ...prev, coverPage: { ...prev.coverPage!, title: e.target.value } } : prev)}
                    className="w-full px-3 py-2 text-sm border border-theme-strong rounded-lg bg-theme"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">{t('storybook.editSubtitle')}</label>
                  <input
                    value={parsedBook.coverPage.subtitle || ''}
                    onChange={e => setParsedBook(prev => prev ? { ...prev, coverPage: { ...prev.coverPage!, subtitle: e.target.value } } : prev)}
                    className="w-full px-3 py-2 text-sm border border-theme-strong rounded-lg bg-theme"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">{t('storybook.authorName')}</label>
                  <input
                    value={parsedBook.coverPage.authorName || ''}
                    onChange={e => setParsedBook(prev => prev ? { ...prev, coverPage: { ...prev.coverPage!, authorName: e.target.value } } : prev)}
                    className="w-full px-3 py-2 text-sm border border-theme-strong rounded-lg bg-theme"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">{t('storybook.editCoverImage')}</label>
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
                      {t('storybook.uploadCoverImage')}
                    </button>
                    {hasDiffusion && (
                      <button
                        onClick={async () => {
                          try {
                            const prompt = `Children's book cover illustration for "${parsedBook.title}", ${parsedBook.styleSuffix || 'colorful cartoon style, vibrant and playful'}`;
                            const res = await fetch('http://localhost:8000/api/generate-image-base64', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ prompt, width: 768, height: 512 }),
                            });
                            if (!res.ok) throw new Error('Failed');
                            const data = await res.json();
                            if (data.imageData) {
                              const imageData = data.imageData;
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
                        {t('storybook.generateAICover')}
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
              <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">{t('storybook.backgroundScene')}</label>
              <button
                onClick={() => setScenePicker(currentPageIdx)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-theme-strong hover:bg-theme-secondary text-sm"
              >
                <Icon icon={Image01IconData} className="w-4" style={{ color: accentColor }} />
                <span className="flex-1 text-left truncate text-theme-heading">
                  {BUNDLED_SCENES.find(s => s.id === currentPage.bundledSceneId)?.name || t('storybook.chooseScene')}
                </span>
              </button>
              {/* AI background generation */}
              {hasDiffusion && (
                <>
                <button
                  onClick={() => handleGeneratePageBackground(currentPageIdx)}
                  disabled={isRemovingBg === currentPageIdx || isGeneratingImages}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-theme-strong hover:bg-theme-secondary text-sm text-theme-muted disabled:opacity-60 mt-2"
                >
                  {isRemovingBg === currentPageIdx
                    ? <Icon icon={Loading03IconData} className="w-4 animate-spin" />
                    : <Icon icon={Image01IconData} className="w-4" style={{ color: accentColor }} />}
                  {t('storybook.generateAIBackground')}
                </button>
                <button
                  onClick={() => handleGenerateAllImages(undefined, { skipCharacters: true })}
                  disabled={isGeneratingImages}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-theme-strong hover:bg-theme-secondary text-sm disabled:opacity-60 mt-1"
                  style={{ color: accentColor }}
                >
                  {isGeneratingImages && imageGenProgress?.stage === 'background'
                    ? <Icon icon={Loading03IconData} className="w-4 animate-spin" />
                    : <Icon icon={Image01IconData} className="w-4" />}
                  Generate All Backgrounds
                </button>
                </>
              )}
              {/* Import background */}
              <div className="relative mt-2">
                <button
                  onClick={() => setShowBgImportMenu(prev => prev === currentPageIdx ? null : currentPageIdx)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-theme-strong hover:bg-theme-secondary text-sm text-theme-muted"
                >
                  <Icon icon={Upload01IconData} className="w-4" />
                  {t('storybook.importBackground')}
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
                      {t('storybook.uploadFromComputer')}
                    </button>
                    <button
                      onClick={() => {
                        setShowBgImportMenu(null);
                        setShowResourcePicker(true);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-theme-heading hover:bg-theme-secondary rounded-b-xl"
                    >
                      <Icon icon={Image01IconData} className="w-4" />
                      {t('storybook.browseSavedImages')}
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
              <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">
                {t('storybook.characterImage')}{currentPage.characterName ? ` - ${currentPage.characterName}` : ''}
              </label>
              <div className="space-y-2">
                {currentPage.characterImageData && (
                  <div className="relative">
                    <img
                      src={currentPage.characterImageData}
                      alt={currentPage.characterName || 'character'}
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
                    {t('storybook.generateAICharacter')}
                  </button>
                )}
                <button
                  onClick={() => handleImageUpload(currentPageIdx)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-theme-strong hover:bg-theme-secondary text-sm text-theme-muted"
                >
                  <Icon icon={Upload01IconData} className="w-4" />
                  {t('storybook.uploadImage')}
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
                    {t('storybook.removeBackground')}
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

            {/* Character 2 image (when page has a second character) */}
            {currentPage.characterScene2 && currentPage.characterName2 && (
            <div>
              <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">
                {t('storybook.characterImage')} - {currentPage.characterName2}
              </label>
              <div className="space-y-2">
                {currentPage.characterImageData2 && (
                  <div className="relative">
                    <img
                      src={currentPage.characterImageData2}
                      alt={currentPage.characterName2}
                      className="w-full max-h-32 object-contain rounded-lg border border-theme"
                    />
                    <button
                      onClick={() => updatePage(currentPageIdx, { characterImageData2: undefined })}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <Icon icon={Cancel01IconData} className="w-3" />
                    </button>
                  </div>
                )}
                {hasDiffusion && (
                  <button
                    onClick={() => handleGeneratePageImage(currentPageIdx, 2)}
                    disabled={isRemovingBg === currentPageIdx || isGeneratingImages}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-theme-strong hover:bg-theme-secondary text-sm disabled:opacity-60"
                    style={{ color: accentColor }}
                  >
                    {isRemovingBg === currentPageIdx
                      ? <Icon icon={Loading03IconData} className="w-4 animate-spin" />
                      : <Icon icon={Image01IconData} className="w-4" />}
                    {t('storybook.generateAICharacter')} - {currentPage.characterName2}
                  </button>
                )}
              </div>
            </div>
            )}

            {/* Generate All Characters batch button */}
            {hasDiffusion && (
            <button
              onClick={() => handleGenerateAllImages(undefined, { skipBackgrounds: true })}
              disabled={isGeneratingImages}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-theme-strong hover:bg-theme-secondary text-sm disabled:opacity-60"
              style={{ color: accentColor }}
            >
              {isGeneratingImages && imageGenProgress?.stage === 'character'
                ? <Icon icon={Loading03IconData} className="w-4 animate-spin" />
                : <Icon icon={Image01IconData} className="w-4" />}
              Generate All Characters
            </button>
            )}

            {/* Text segments editor */}
            <div>
              <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">{t('storybook.editText')}</label>
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
                  <Icon icon={Add01IconData} className="w-3.5" /> {t('storybook.addLine')}
                </button>
              </div>
            </div>

            {/* Read aloud page */}
            <div>
              <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-2">{t('storybook.listenLabel')}</label>
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
                  ? <><Icon icon={PauseIconData} className="w-4" /> {t('storybook.stop')}</>
                  : <><Icon icon={PlayIconData} className="w-4" /> {t('storybook.readThisPage')}</>
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
              <h3 className="font-semibold text-theme-heading">{t('storybook.saveStorybook')}</h3>
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
                    {t('storybook.saveImages')}
                  </p>
                  <p className="text-xs text-theme-muted">{t('storybook.saveImagesDesc')}</p>
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
                    {t('storybook.saveNarrationAudio')}
                  </p>
                  <p className="text-xs text-theme-muted">{t('storybook.saveNarrationAudioDesc')}</p>
                </div>
              </label>

              {/* Progress bar */}
              {isSaving && saveProgress && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-theme-muted">
                    <Icon icon={Loading03IconData} className="w-3 animate-spin" />
                    {t('storybook.generatingAudio', { current: saveProgress.current, total: saveProgress.total })}
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
                {t('common.cancel')}
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
                    {t('common.saving')}
                  </span>
                ) : t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restoring images overlay */}
      {isRestoringImages && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm shadow-lg flex items-center gap-2">
          <Icon icon={Loading03IconData} className="w-4 animate-spin" style={{ color: accentColor }} />
          {t('storybook.restoringImages')}
        </div>
      )}

      {/* Save toast */}
      {saveToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm shadow-lg flex items-center gap-2">
          <Icon icon={Tick01IconData} className="w-4" style={{ color: '#4ade80' }} />
          {saveToast}
        </div>
      )}
      <AIDisclaimer />
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
