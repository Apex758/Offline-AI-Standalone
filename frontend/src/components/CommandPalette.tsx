import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Search01IconData from '@hugeicons/core-free-icons/Search01Icon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import BarChartIconData from '@hugeicons/core-free-icons/BarChartIcon';
import Message01IconData from '@hugeicons/core-free-icons/Message01Icon';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import GraduationScrollIconData from '@hugeicons/core-free-icons/GraduationScrollIcon';
import CheckListIconData from '@hugeicons/core-free-icons/CheckListIcon';
import BookBookmark01IconData from '@hugeicons/core-free-icons/BookBookmark01Icon';
import SchoolIconData from '@hugeicons/core-free-icons/SchoolIcon';
import UserGroupIconData from '@hugeicons/core-free-icons/UserGroupIcon';
import LibraryIconData from '@hugeicons/core-free-icons/LibraryIcon';
import Settings01IconData from '@hugeicons/core-free-icons/Settings01Icon';
import Target01IconData from '@hugeicons/core-free-icons/Target01Icon';
import FileSpreadsheetIconData from '@hugeicons/core-free-icons/FileSpreadsheetIcon';
import ColorsIconData from '@hugeicons/core-free-icons/ColorsIcon';
import Notification01IconData from '@hugeicons/core-free-icons/Notification01Icon';
import ColumnInsertIconData from '@hugeicons/core-free-icons/ColumnInsertIcon';
import CancelCircleIconData from '@hugeicons/core-free-icons/CancelCircleIcon';
import Sun01IconData from '@hugeicons/core-free-icons/Sun01Icon';
import HelpCircleIconData from '@hugeicons/core-free-icons/HelpCircleIcon';
import CpuIconData from '@hugeicons/core-free-icons/CpuIcon';
import Layers01IconData from '@hugeicons/core-free-icons/Layers01Icon';
import ToggleOffIconData from '@hugeicons/core-free-icons/ToggleOffIcon';
import ReloadIconData from '@hugeicons/core-free-icons/ReloadIcon';
import FileAddIconData from '@hugeicons/core-free-icons/FileAddIcon';
import Image01IconData from '@hugeicons/core-free-icons/Image01Icon';
import PaintBrush01IconData from '@hugeicons/core-free-icons/PaintBrush01Icon';
import ImageAdd01IconData from '@hugeicons/core-free-icons/ImageAdd01Icon';
import TextFontIconData from '@hugeicons/core-free-icons/TextFontIcon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import ArrowTurnDownIconData from '@hugeicons/core-free-icons/ArrowTurnDownIcon';
import BrainIconData from '@hugeicons/core-free-icons/BrainIcon';
import Activity01IconData from '@hugeicons/core-free-icons/Activity01Icon';
import Award01IconData from '@hugeicons/core-free-icons/Award01Icon';
import Mic01IconData from '@hugeicons/core-free-icons/Mic01Icon';
import MicOff01IconData from '@hugeicons/core-free-icons/MicOff01Icon';
import searchIndex, { SearchEntry } from '../data/searchIndex';
import { useSTT } from '../hooks/useVoice';
import { useStickyNotes, StickyChecklistItem } from '../contexts/StickyNoteContext';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';
import PencilEdit01IconData from '@hugeicons/core-free-icons/PencilEdit01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const Search: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Search01IconData} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
const BarChart3: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BarChartIconData} {...p} />;
const MessageSquare: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Message01IconData} {...p} />;
const BookOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BookOpen01IconData} {...p} />;
const FileText: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={File01IconData} {...p} />;
const GraduationCap: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={GraduationScrollIconData} {...p} />;
const ListChecks: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CheckListIconData} {...p} />;
const BookMarked: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BookBookmark01IconData} {...p} />;
const School: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SchoolIconData} {...p} />;
const Users: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UserGroupIconData} {...p} />;
const Library: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={LibraryIconData} {...p} />;
const Settings: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Settings01IconData} {...p} />;
const Target: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Target01IconData} {...p} />;
const FileSpreadsheet: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FileSpreadsheetIconData} {...p} />;
const Palette: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ColorsIconData} {...p} />;
const Bell: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Notification01IconData} {...p} />;
const Columns: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ColumnInsertIconData} {...p} />;
const XCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CancelCircleIconData} {...p} />;
const Sun: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Sun01IconData} {...p} />;
const HelpCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={HelpCircleIconData} {...p} />;
const Cpu: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CpuIconData} {...p} />;
const Layers: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Layers01IconData} {...p} />;
const ToggleLeft: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ToggleOffIconData} {...p} />;
const RotateCcw: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ReloadIconData} {...p} />;
const FilePlus: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FileAddIconData} {...p} />;
const Image: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Image01IconData} {...p} />;
const Paintbrush: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PaintBrush01IconData} {...p} />;
const ImagePlus: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ImageAdd01IconData} {...p} />;
const Type: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={TextFontIconData} {...p} />;
const ArrowRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowRight01IconData} {...p} />;
const CornerDownLeft: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowTurnDownIconData} {...p} />;
const Brain: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BrainIconData} {...p} />;
const Speedometer: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Activity01IconData} {...p} />;
const Trophy: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Award01IconData} {...p} />;
const Mic: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Mic01IconData} {...p} />;
const MicOff: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={MicOff01IconData} {...p} />;
const PencilEdit: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PencilEdit01IconData} {...p} />;

// Check if SpeechRecognition is available
const HAS_STT = typeof window !== 'undefined' && !!(
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
);

// AI Smart Search response type
interface SmartSearchResponse {
  intent: 'navigation' | 'generation' | 'settings' | 'info';
  summary: string;
  steps: string[];
  action?: { toolType?: string; actionName?: string; prefill?: Record<string, any>; settingsSection?: string };
  confidence: number;
}

const iconMap: Record<string, React.ElementType> = {
  BarChart3, MessageSquare, BookOpen, FileText, GraduationCap, ListChecks,
  BookMarked, School, Users, Library, Settings, Target, FileSpreadsheet,
  Palette, Bell, Columns, XCircle, Sun, HelpCircle, Cpu, Layers,
  ToggleLeft, RotateCcw, FilePlus, Image, Paintbrush, ImagePlus, Type, ArrowRight,
  Brain, Speedometer, Trophy,
};

// categoryLabels is resolved at render time via getCategoryLabel(t, category)
function getCategoryLabel(t: (key: string) => string, category: string): string {
  const map: Record<string, string> = {
    tool: t('commandPalette.tools'),
    setting: t('commandPalette.settings'),
    feature: t('commandPalette.features'),
    action: t('commandPalette.actions'),
    resource: t('commandPalette.resources'),
  };
  return map[category] || category;
}

const categoryOrder = ['action', 'tool', 'setting', 'resource'];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (entry: SearchEntry, prefill?: Record<string, any>) => void;
}

// ── Natural language search engine ──

const STOP_WORDS = new Set([
  'i', 'me', 'my', 'we', 'our', 'you', 'your',
  'a', 'an', 'the', 'this', 'that', 'these', 'those',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might',
  'have', 'has', 'had', 'having',
  'to', 'of', 'in', 'on', 'at', 'for', 'with', 'from', 'by', 'about', 'into',
  'it', 'its', 'what', 'which', 'who', 'whom', 'how',
  'and', 'or', 'but', 'not', 'so', 'if', 'then',
  'want', 'wanna', 'gonna', 'need', 'like', 'please', 'just', 'also',
  'go', 'get', 'let', 'make', 'take', 'give', 'show', 'tell', 'see', 'look', 'find',
  'where', 'when', 'there', 'here', 'some', 'any', 'all', 'each', 'every',
  'up', 'out', 'off', 'over', 'able', 'way',
]);

// Maps natural-language synonyms/phrases → canonical keywords that appear in the search index
const SYNONYM_MAP: Record<string, string[]> = {
  // theme / appearance
  'darker': ['dark', 'theme'], 'lighter': ['light', 'theme'],
  'night': ['dark', 'theme'], 'day': ['light', 'theme'],
  'color': ['theme', 'colors', 'tab'], 'colours': ['colors', 'tab', 'theme'],
  'appearance': ['theme'], 'bright': ['light', 'theme'],

  // font / text
  'bigger': ['font', 'size', 'large'], 'smaller': ['font', 'size', 'small'],
  'text': ['font', 'size'], 'enlarge': ['font', 'size', 'bigger'],
  'readability': ['font', 'size'], 'readable': ['font', 'size'],
  'zoom': ['font', 'size'],

  // model / AI
  'switch': ['change', 'model', 'select'], 'swap': ['change', 'model'],
  'llm': ['ai', 'model'], 'language': ['ai', 'model'],
  'gguf': ['ai', 'model'],

  // lesson / plan
  'lesson': ['lesson', 'planner', 'plan'],
  'teach': ['lesson', 'planner'], 'teaching': ['lesson', 'planner'],
  'plan': ['lesson', 'planner', 'plan'],

  // quiz / test
  'test': ['quiz', 'assessment'], 'exam': ['quiz', 'assessment'],
  'questions': ['quiz'],

  // grades / students
  'grades': ['class', 'management', 'grading', 'students'],
  'students': ['class', 'management', 'students', 'roster'],
  'pupils': ['class', 'management', 'students'],
  'marks': ['class', 'management', 'grading'],
  'score': ['rubric', 'grading'],
  'scoring': ['rubric', 'grading'],

  // resources / saved
  'saved': ['resource', 'saved', 'my'], 'history': ['resource', 'saved'],
  'previous': ['resource', 'saved'], 'old': ['resource', 'saved'],
  'browse': ['resource', 'browse', 'curriculum'],

  // image
  'picture': ['image', 'studio'], 'photo': ['image', 'studio'],
  'illustration': ['image', 'studio'], 'draw': ['image', 'studio'],
  'art': ['image', 'studio'], 'generate': ['image', 'create', 'generate'],

  // worksheet
  'handout': ['worksheet'], 'printable': ['worksheet', 'printable'],
  'exercise': ['worksheet'], 'activity': ['worksheet'],

  // notifications / queue
  'alerts': ['notifications'], 'bell': ['notifications'],
  'pending': ['queue', 'notifications'], 'progress': ['queue', 'notifications', 'curriculum'],

  // general actions
  'open': ['open'], 'close': ['close'], 'new': ['create', 'new'],
  'create': ['create', 'new'], 'start': ['create', 'new'],
  'add': ['create', 'new'], 'write': ['create', 'new'],
  'change': ['change', 'switch', 'select'],
  'edit': ['edit', 'manage'], 'manage': ['manage', 'management'],
  'reset': ['reset', 'default', 'restore'],
  'turn': ['enable', 'disable', 'toggle'],
  'enable': ['enable', 'toggle'], 'disable': ['disable', 'toggle'],

  // kindergarten
  'kinder': ['kindergarten'], 'pre-school': ['kindergarten'],
  'preschool': ['kindergarten'], 'early': ['kindergarten', 'early childhood'],

  // split view
  'side': ['split', 'side by side'], 'dual': ['split', 'dual'],
  'two': ['split'], 'compare': ['split', 'side by side'],

  // curriculum
  'syllabus': ['curriculum'], 'course': ['curriculum'],
  'standard': ['curriculum', 'standards'], 'oecs': ['curriculum', 'oecs'],
  'subject': ['curriculum', 'subjects'],

  // chat
  'ask': ['chat', 'pearl', 'ai'], 'talk': ['chat', 'pearl'],
  'help': ['chat', 'pearl', 'tutorial'], 'pearl': ['chat', 'pearl'],
  'assistant': ['chat', 'ai', 'assistant'],

  // storybook
  'story': ['storybook', 'story', 'book'], 'storybook': ['storybook', 'story'],
  'book': ['storybook', 'book'], 'illustrated': ['storybook', 'image'],
  'narration': ['storybook', 'tts'], 'read aloud': ['storybook', 'tts'],
  'kids': ['storybook', 'kindergarten'], 'children': ['storybook', 'kindergarten'],
  'fun': ['storybook', 'image', 'activity'],
};

/** Extract meaningful search terms from a natural-language sentence */
function extractTerms(raw: string): string[] {
  const words = raw.toLowerCase().replace(/[^\w\s-]/g, '').split(/\s+/).filter(Boolean);
  const terms: string[] = [];

  for (const word of words) {
    // expand synonyms
    const synonyms = SYNONYM_MAP[word];
    if (synonyms) {
      terms.push(...synonyms);
    }
    // keep the word itself if it's not a stop word (or is very short but meaningful)
    if (!STOP_WORDS.has(word)) {
      terms.push(word);
    }
  }

  // deduplicate
  return [...new Set(terms)];
}

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

function scoreMatch(query: string, entry: SearchEntry): number {
  const q = query.toLowerCase().trim();
  const title = entry.title.toLowerCase();
  const desc = entry.description.toLowerCase();
  const keywordsJoined = entry.keywords.join(' ');
  const allText = `${title} ${desc} ${keywordsJoined}`;

  // ── Fast path: short queries (1-2 words, likely a direct search) ──
  if (q.split(/\s+/).length <= 2) {
    if (title.startsWith(q)) return 100;
    if (title.includes(q)) return 85;
    if (entry.keywords.some(k => k === q)) return 75;
    if (entry.keywords.some(k => k.startsWith(q))) return 65;
    if (entry.keywords.some(k => k.includes(q))) return 55;
    if (desc.includes(q)) return 35;
    if (fuzzyMatch(q, title)) return 25;

    // Also try individual words for 2-word queries
    const words = q.split(/\s+/);
    if (words.length === 2 && words.every(w => allText.includes(w))) return 45;
  }

  // ── Sentence / multi-word path: extract intent ──
  const terms = extractTerms(q);
  if (terms.length === 0) return 0;

  let score = 0;
  let titleHits = 0;
  let keywordHits = 0;
  let descHits = 0;

  for (const term of terms) {
    if (title.includes(term)) {
      titleHits++;
      score += 12;
    }
    // check each keyword individually for better precision
    if (entry.keywords.some(k => k.includes(term) || term.includes(k))) {
      keywordHits++;
      score += 8;
    }
    if (desc.includes(term)) {
      descHits++;
      score += 4;
    }
  }

  const totalHits = titleHits + keywordHits + descHits;
  if (totalHits === 0) return 0;

  // Coverage bonus: what fraction of extracted terms matched something?
  const coverage = totalHits / terms.length;
  score += Math.round(coverage * 30);

  // Title-heavy bonus: if most terms hit the title, it's very likely the right result
  if (titleHits >= 2) score += 15;

  // Keyword density bonus
  if (keywordHits >= 3) score += 10;

  return Math.min(score, 100);
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [aiMode, setAiMode] = useState(false);
  const [aiResponse, setAiResponse] = useState<SmartSearchResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const aiAbortRef = useRef<AbortController | null>(null);
  const { createNote } = useStickyNotes();
  const { settings } = useSettings();
  const { t } = useTranslation();

  // Speech-to-text
  const sttIsListeningRef = useRef(false);
  const stt = useSTT(
    // onResult — final transcript sets the query
    (finalText) => {
      setQuery(finalText);
      sttIsListeningRef.current = false;
    },
    // onInterim — live preview in the input
    (partialText) => {
      setQuery(partialText);
    },
    settings.language
  );

  // Keep ref in sync
  useEffect(() => {
    sttIsListeningRef.current = stt.isListening;
  }, [stt.isListening]);

  // AI smart search
  const [aiError, setAiError] = useState<string | null>(null);
  const fetchAiSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    aiAbortRef.current?.abort();
    const controller = new AbortController();
    aiAbortRef.current = controller;
    setAiLoading(true);
    setAiResponse(null);
    setAiError(null);
    try {
      const res = await fetch('http://localhost:8000/api/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Smart search failed (${res.status})`);
      const data: SmartSearchResponse = await res.json();
      if (data.summary || (data.steps && data.steps.length > 0)) {
        setAiResponse(data);
      } else {
        setAiError('No guidance found for that query. Try rephrasing.');
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error('[SmartSearch] Error:', e);
        setAiError('Could not reach AI. Make sure the backend is running.');
      }
    } finally {
      setAiLoading(false);
    }
  }, []);

  // Filter and score results
  const results = useMemo(() => {
    if (!query.trim()) {
      // Show all entries grouped by category when no query
      return [...searchIndex].sort((a, b) => {
        const catDiff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
        if (catDiff !== 0) return catDiff;
        return a.title.localeCompare(b.title);
      });
    }

    return searchIndex
      .map(entry => ({ entry, score: scoreMatch(query, entry) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ entry }) => entry);
  }, [query]);

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups: { category: string; items: SearchEntry[] }[] = [];
    const seen = new Set<string>();

    for (const entry of results) {
      if (!seen.has(entry.category)) {
        seen.add(entry.category);
        groups.push({ category: entry.category, items: [] });
      }
      groups.find(g => g.category === entry.category)!.items.push(entry);
    }

    return groups;
  }, [results]);

  // Flat list for keyboard navigation
  const flatResults = useMemo(() => results, [results]);

  // Reset on open / cleanup on close
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setAiResponse(null);
      setAiLoading(false);
      setAiError(null);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      // Stop STT when palette closes
      if (stt.isListening) stt.stopListening();
      aiAbortRef.current?.abort();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    const el = itemRefs.current[selectedIndex];
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const handleSelect = useCallback((entry: SearchEntry, prefill?: Record<string, any>) => {
    onNavigate(entry, prefill);
    onClose();
  }, [onNavigate, onClose]);

  // Handle clicking the AI suggestion "Go" action
  const handleAiAction = useCallback(() => {
    if (!aiResponse?.action) return;
    const syntheticEntry: SearchEntry = {
      id: 'ai-suggestion',
      title: aiResponse.summary,
      description: aiResponse.steps.join(' -> '),
      keywords: [],
      category: 'action',
      icon: 'ArrowRight',
      toolType: aiResponse.action.toolType,
      settingsSection: aiResponse.action.settingsSection,
      action: aiResponse.action.actionName,
    };
    onNavigate(syntheticEntry, aiResponse.action.prefill);
    onClose();
  }, [aiResponse, onNavigate, onClose]);

  // Total selectable items: AI card (if present) + flat results
  const aiCardOffset = aiResponse ? 1 : 0;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const totalItems = flatResults.length + aiCardOffset;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, totalItems - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        // Stop STT if listening
        if (stt.isListening) stt.stopListening();
        // If AI mode is on and no specific item selected (or at AI card), trigger AI search
        if (aiMode && selectedIndex === 0 && !aiResponse && query.trim()) {
          fetchAiSearch(query);
        } else if (aiResponse && selectedIndex === 0) {
          // Selecting the AI card
          if (aiResponse.action) {
            handleAiAction();
          }
        } else {
          const resultIndex = selectedIndex - aiCardOffset;
          if (flatResults[resultIndex]) {
            handleSelect(flatResults[resultIndex]);
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [flatResults, selectedIndex, handleSelect, onClose, aiMode, aiResponse, aiCardOffset, query, fetchAiSearch, handleAiAction]);

  if (!isOpen) return null;

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-start justify-center pt-[12vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-full max-w-[580px] mx-4 rounded-xl overflow-hidden shadow-2xl"
        style={{
          background: 'var(--bg-surface, #ffffff)',
          border: '1px solid var(--border-default, #e5e7eb)',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.35)',
        }}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border-default, #e5e7eb)' }}>
          {/* Brain toggle (left) */}
          <button
            onClick={() => setAiMode(prev => !prev)}
            className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
              aiMode
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            style={aiMode ? {
              boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)',
            } : undefined}
            title={aiMode ? 'AI search active — press Enter to search with AI' : 'Enable AI-powered search'}
          >
            <Brain
              className="w-5 h-5"
              style={{ color: aiMode ? '#22c55e' : 'var(--text-hint, #6b7280)' }}
            />
          </button>

          {/* Vertical divider */}
          <div className="w-px h-5 flex-shrink-0" style={{ background: 'var(--border-default, #e5e7eb)' }} />

          <Search className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-hint, #6b7280)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={stt.isListening ? 'Listening...' : aiMode ? 'Ask anything... (Enter to search with AI)' : 'Search tools, settings, resources...'}
            className="flex-1 bg-transparent border-none outline-none text-[15px]"
            style={{ color: 'var(--text-title, #111827)' }}
            autoComplete="off"
            spellCheck={false}
          />

          {/* Mic / Clear button (right) — mutually exclusive */}
          {stt.isListening ? (
            // Actively listening — show pulsing mic-off to stop
            <button
              onClick={stt.stopListening}
              className="p-1.5 rounded-lg bg-red-500 text-white animate-pulse transition flex-shrink-0"
              title={t('commandPalette.stopListening')}
            >
              <MicOff className="w-4 h-4" />
            </button>
          ) : query ? (
            // Has text — show clear button
            <button
              onClick={() => { setQuery(''); setAiResponse(null); setAiError(null); inputRef.current?.focus(); }}
              className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition flex-shrink-0"
              title={t('commandPalette.clearSearch')}
            >
              <X className="w-4 h-4" style={{ color: 'var(--text-hint, #6b7280)' }} />
            </button>
          ) : HAS_STT ? (
            // Empty input + STT available — show mic
            <button
              onClick={stt.startListening}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition flex-shrink-0"
              title={t('commandPalette.voiceSearch')}
            >
              <Mic className="w-4 h-4" style={{ color: 'var(--text-hint, #6b7280)' }} />
            </button>
          ) : null}
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="overflow-y-auto"
          style={{ maxHeight: '55vh' }}
        >
          {/* AI Suggestion Card */}
          {aiLoading && (
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-default, #e5e7eb)', background: 'var(--bg-secondary, #f9fafb)' }}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium" style={{ color: 'var(--text-hint, #6b7280)' }}>
                  Searching with AI...
                </span>
              </div>
            </div>
          )}
          {aiError && !aiLoading && (
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-default, #e5e7eb)', background: 'rgba(239,68,68,0.05)' }}>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" style={{ color: '#ef4444' }} />
                <span className="text-xs" style={{ color: '#ef4444' }}>{aiError}</span>
              </div>
            </div>
          )}
          {aiResponse && !aiLoading && (
            <div
              className="px-4 py-3 cursor-pointer transition-colors"
              style={{
                borderBottom: '1px solid var(--border-default, #e5e7eb)',
                background: selectedIndex === 0
                  ? 'var(--bg-hover, #f3f4f6)'
                  : 'linear-gradient(135deg, rgba(34,197,94,0.05), rgba(34,197,94,0.02))',
              }}
              onMouseEnter={() => setSelectedIndex(0)}
              onClick={() => aiResponse.action ? handleAiAction() : undefined}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100 dark:bg-green-900/30">
                  <Brain className="w-4 h-4" style={{ color: '#22c55e' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-title, #111827)' }}>
                    {aiResponse.summary}
                  </p>
                  <ol className="mt-1.5 space-y-0.5">
                    {aiResponse.steps.map((step, i) => (
                      <li key={i} className="text-xs flex gap-1.5" style={{ color: 'var(--text-muted, #4b5563)' }}>
                        <span className="font-semibold text-green-600 dark:text-green-400 flex-shrink-0">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <div className="flex gap-2 mt-2">
                    {aiResponse.action && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAiAction(); }}
                        className="px-3 py-1 rounded-md text-xs font-medium text-white transition-colors"
                        style={{ background: '#22c55e' }}
                      >
                        {aiResponse.action.toolType
                          ? `Go to ${aiResponse.action.toolType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} →`
                          : aiResponse.action.actionName
                            ? aiResponse.action.actionName.replace(/([A-Z])/g, ' $1').trim() + ' →'
                            : 'Do it →'
                        }
                      </button>
                    )}
                    {aiResponse.steps.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const checklist: StickyChecklistItem[] = aiResponse.steps.map((step, i) => ({
                            id: `step_${Date.now()}_${i}`,
                            text: step,
                            completed: false,
                            action: aiResponse.action ? { toolType: aiResponse.action.toolType, settingsSection: aiResponse.action.settingsSection } : undefined,
                          }));
                          createNote({
                            title: aiResponse.summary || query,
                            checklist,
                            pinned: true,
                            color: '#bbf7d0',
                          });
                          onClose();
                        }}
                        className="px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                        style={{ background: 'rgba(234,179,8,0.15)', color: '#b45309', border: '1px solid rgba(234,179,8,0.3)' }}
                      >
                        <PencilEdit className="w-3 h-3" /> Sticky Note
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setAiResponse(null); }}
                  className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 flex-shrink-0"
                >
                  <X className="w-3 h-3" style={{ color: 'var(--text-hint, #6b7280)' }} />
                </button>
              </div>
            </div>
          )}

          {flatResults.length === 0 && !aiResponse && !aiLoading ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm" style={{ color: 'var(--text-hint, #6b7280)' }}>
                No results for "<span className="font-medium" style={{ color: 'var(--text-label, #374151)' }}>{query}</span>"
                {aiMode && (
                  <span className="block mt-1 text-xs">Press Enter to search with AI</span>
                )}
              </p>
            </div>
          ) : (
            groupedResults.map(group => (
              <div key={group.category}>
                {/* Category header */}
                <div
                  className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider sticky top-0"
                  style={{
                    color: 'var(--text-hint, #6b7280)',
                    background: 'var(--bg-secondary, #f9fafb)',
                    borderBottom: '1px solid var(--border-default, #e5e7eb)',
                  }}
                >
                  {getCategoryLabel(t, group.category)}
                </div>

                {/* Items */}
                {group.items.map(entry => {
                  flatIndex++;
                  const idx = flatIndex + aiCardOffset;
                  const isSelected = idx === selectedIndex;
                  const IconComponent = iconMap[entry.icon] || ArrowRight;

                  return (
                    <button
                      key={entry.id}
                      ref={el => { itemRefs.current[idx] = el; }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                      style={{
                        background: isSelected ? 'var(--bg-hover, #f3f4f6)' : 'transparent',
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => handleSelect(entry)}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: isSelected ? 'var(--bg-tertiary, #e5e7eb)' : 'var(--bg-tertiary, #f3f4f6)',
                        }}
                      >
                        <IconComponent
                          className="w-4 h-4"
                          style={{ color: 'var(--text-muted, #4b5563)' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: 'var(--text-title, #111827)' }}
                        >
                          {entry.title}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: 'var(--text-hint, #6b7280)' }}
                        >
                          {entry.description}
                        </p>
                      </div>
                      {isSelected && (
                        <CornerDownLeft
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: 'var(--text-hint, #6b7280)' }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2 text-[11px]"
          style={{
            borderTop: '1px solid var(--border-default, #e5e7eb)',
            color: 'var(--text-hint, #6b7280)',
            background: 'var(--bg-secondary, #f9fafb)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded font-medium" style={{ background: 'var(--bg-tertiary, #f3f4f6)', border: '1px solid var(--border-default, #e5e7eb)' }}>↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded font-medium" style={{ background: 'var(--bg-tertiary, #f3f4f6)', border: '1px solid var(--border-default, #e5e7eb)' }}>↵</kbd>
              {aiMode ? 'open / AI search' : 'open'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {aiMode && (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                <Brain className="w-3 h-3" style={{ color: '#22c55e' }} />
                AI
              </span>
            )}
            <span>{flatResults.length} result{flatResults.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
