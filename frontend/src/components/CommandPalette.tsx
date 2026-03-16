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
import searchIndex, { SearchEntry } from '../data/searchIndex';

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

const iconMap: Record<string, React.ElementType> = {
  BarChart3, MessageSquare, BookOpen, FileText, GraduationCap, ListChecks,
  BookMarked, School, Users, Library, Settings, Target, FileSpreadsheet,
  Palette, Bell, Columns, XCircle, Sun, HelpCircle, Cpu, Layers,
  ToggleLeft, RotateCcw, FilePlus, Image, Paintbrush, ImagePlus, Type, ArrowRight,
};

const categoryLabels: Record<string, string> = {
  tool: 'Tools',
  setting: 'Settings',
  feature: 'Features',
  action: 'Actions',
  resource: 'Resources',
};

const categoryOrder = ['action', 'tool', 'setting', 'resource'];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (entry: SearchEntry) => void;
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
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

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

  const handleSelect = useCallback((entry: SearchEntry) => {
    onNavigate(entry);
    onClose();
  }, [onNavigate, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, flatResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (flatResults[selectedIndex]) {
          handleSelect(flatResults[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [flatResults, selectedIndex, handleSelect, onClose]);

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
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border-default, #e5e7eb)' }}>
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-hint, #6b7280)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools, settings, resources..."
            className="flex-1 bg-transparent border-none outline-none text-[15px]"
            style={{ color: 'var(--text-title, #111827)' }}
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" style={{ color: 'var(--text-hint, #6b7280)' }} />
            </button>
          )}
          <kbd
            className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium"
            style={{
              background: 'var(--bg-tertiary, #f3f4f6)',
              color: 'var(--text-hint, #6b7280)',
              border: '1px solid var(--border-default, #e5e7eb)',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="overflow-y-auto"
          style={{ maxHeight: '55vh' }}
        >
          {flatResults.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm" style={{ color: 'var(--text-hint, #6b7280)' }}>
                No results for "<span className="font-medium" style={{ color: 'var(--text-label, #374151)' }}>{query}</span>"
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
                  {categoryLabels[group.category] || group.category}
                </div>

                {/* Items */}
                {group.items.map(entry => {
                  flatIndex++;
                  const idx = flatIndex;
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
              open
            </span>
          </div>
          <span>{flatResults.length} result{flatResults.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
