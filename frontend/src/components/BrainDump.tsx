import React, { useState, useEffect, useRef, useCallback } from 'react';
import AIDisclaimer from './AIDisclaimer';
import { HugeiconsIcon } from '@hugeicons/react';
import BrainIconData from '@hugeicons/core-free-icons/BrainIcon';
import Mic01IconData from '@hugeicons/core-free-icons/Mic01Icon';
import MicOff01IconData from '@hugeicons/core-free-icons/MicOff01Icon';
import FlashIconData from '@hugeicons/core-free-icons/FlashIcon';
import Tick01IconData from '@hugeicons/core-free-icons/Tick01Icon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import ReloadIconData from '@hugeicons/core-free-icons/ReloadIcon';
import BookBookmark01IconData from '@hugeicons/core-free-icons/BookBookmark01Icon';
import PenTool01IconData from '@hugeicons/core-free-icons/PenTool01Icon';
import CheckListIconData from '@hugeicons/core-free-icons/CheckListIcon';
import FileSpreadsheetIconData from '@hugeicons/core-free-icons/FileSpreadsheetIcon';
import CalendarAdd01IconData from '@hugeicons/core-free-icons/CalendarAdd01Icon';
import Baby01IconData from '@hugeicons/core-free-icons/Baby01Icon';
import Layers01IconData from '@hugeicons/core-free-icons/Layers01Icon';
import GitMergeIconData from '@hugeicons/core-free-icons/GitMergeIcon';
import ColorsIconData from '@hugeicons/core-free-icons/ColorsIcon';
import Loading03IconData from '@hugeicons/core-free-icons/Loading03Icon';
import StickyNote01IconData from '@hugeicons/core-free-icons/StickyNote01Icon';
import Delete02IconData from '@hugeicons/core-free-icons/Delete02Icon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import ArrowUp01IconData from '@hugeicons/core-free-icons/ArrowUp01Icon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import CalculatorIconData from '@hugeicons/core-free-icons/CalculatorIcon';
import Timer01IconData from '@hugeicons/core-free-icons/Timer01Icon';
import PlayIconData from '@hugeicons/core-free-icons/PlayIcon';
import PauseIconData from '@hugeicons/core-free-icons/PauseIcon';
import StopIconData from '@hugeicons/core-free-icons/StopIcon';
import SquareArrowUpRightIconData from '@hugeicons/core-free-icons/SquareArrowUpRightIcon';
import SaveIconData from '@hugeicons/core-free-icons/SaveIcon';
import ArrowLeft01IconData from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import PencilEdit01IconData from '@hugeicons/core-free-icons/PencilEdit01Icon';
import Delete01IconData from '@hugeicons/core-free-icons/Delete01Icon';
import PercentIconData from '@hugeicons/core-free-icons/PercentIcon';
import DivideSignIconData from '@hugeicons/core-free-icons/DivideSignIcon';
import PlusSignIconData from '@hugeicons/core-free-icons/PlusSignIcon';
import MinusSignIconData from '@hugeicons/core-free-icons/MinusSignIcon';
import EqualSignIconData from '@hugeicons/core-free-icons/EqualSignIcon';
import TextBoldIconData from '@hugeicons/core-free-icons/TextBoldIcon';
import TextItalicIconData from '@hugeicons/core-free-icons/TextItalicIcon';
import TextUnderlineIconData from '@hugeicons/core-free-icons/TextUnderlineIcon';
import TextStrikethroughIconData from '@hugeicons/core-free-icons/TextStrikethroughIcon';
import Heading01IconData from '@hugeicons/core-free-icons/Heading01Icon';
import Heading02IconData from '@hugeicons/core-free-icons/Heading02Icon';
import LeftToRightListBulletIconData from '@hugeicons/core-free-icons/LeftToRightListBulletIcon';
import LeftToRightListNumberIconData from '@hugeicons/core-free-icons/LeftToRightListNumberIcon';
import QuoteDownIconData from '@hugeicons/core-free-icons/QuoteDownIcon';
import Link01IconData from '@hugeicons/core-free-icons/Link01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import TextFontIconData from '@hugeicons/core-free-icons/TextFontIcon';
import StopWatchIconData from '@hugeicons/core-free-icons/StopWatchIcon';
import Presentation01IconData from '@hugeicons/core-free-icons/Presentation01Icon';
import UserGroupIconData from '@hugeicons/core-free-icons/UserGroupIcon';
import Search01IconData from '@hugeicons/core-free-icons/Search01Icon';
import Target01IconData from '@hugeicons/core-free-icons/Target01Icon';
import Task01IconData from '@hugeicons/core-free-icons/Task01Icon';
import HelpCircleIconData from '@hugeicons/core-free-icons/HelpCircleIcon';
import { useSTT } from '../hooks/useVoice';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from 'react-i18next';
import { useQueue } from '../contexts/QueueContext';
import { useCapabilities } from '../contexts/CapabilitiesContext';
import { useQueueCancellation } from '../hooks/useQueueCancellation';
import { useOfflineGuard } from '../hooks/useOfflineGuard';
import type { BrainDumpAction, BrainDumpEntry, BrainDumpActionType, BrainDumpSuggestion } from '../types/brainDump';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import { Skeleton } from './ui/skeleton';
import { ShimmerBar } from './ui/ShimmerBar';

// Wrapper to make HugeiconsIcon work like lucide-react components
const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties; strokeWidth?: number }> = ({ icon, className = '', style, strokeWidth }) => {
  // Extract size from className (w-N h-N pattern)
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={strokeWidth} className={className} style={style} />;
};

// Named icon components for use in ACTION_META and toolbar
const Brain: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BrainIconData} {...p} />;
const Mic: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Mic01IconData} {...p} />;
const MicOff: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={MicOff01IconData} {...p} />;
const Zap: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FlashIconData} {...p} />;
const Check: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Tick01IconData} {...p} />;
const XIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
const RotateCcw: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ReloadIconData} {...p} />;
const BookMarked: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BookBookmark01IconData} {...p} />;
const PenTool: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PenTool01IconData} {...p} />;
const ClipboardList: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CheckListIconData} {...p} />;
const FileSpreadsheet: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FileSpreadsheetIconData} {...p} />;
const CalendarPlus: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CalendarAdd01IconData} {...p} />;
const Baby: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Baby01IconData} {...p} />;
const Layers: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Layers01IconData} {...p} />;
const Merge: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={GitMergeIconData} {...p} />;
const Palette: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ColorsIconData} {...p} />;
const Loader2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Loading03IconData} {...p} />;
const StickyNote: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={StickyNote01IconData} {...p} />;
const Trash2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Delete02IconData} {...p} />;
const ChevronDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowDown01IconData} {...p} />;
const ChevronUp: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowUp01IconData} {...p} />;
const Clock: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Clock01IconData} {...p} />;
const Calculator: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CalculatorIconData} {...p} />;
const Timer: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Timer01IconData} {...p} />;
const Play: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PlayIconData} {...p} />;
const Pause: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PauseIconData} {...p} />;
const Square: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={StopIconData} {...p} />;
const ExternalLink: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SquareArrowUpRightIconData} {...p} />;
const Save: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SaveIconData} {...p} />;
const ArrowLeft: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowLeft01IconData} {...p} />;
const Pencil: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PencilEdit01IconData} {...p} />;
const Delete: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Delete01IconData} {...p} />;
const Percent: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PercentIconData} {...p} />;
const Divide: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={DivideSignIconData} {...p} />;
const PlusIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PlusSignIconData} {...p} />;
const MinusIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={MinusSignIconData} {...p} />;
const Equal: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={EqualSignIconData} {...p} />;
const ChevronRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowRight01IconData} {...p} />;
const Type: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={TextFontIconData} {...p} />;
const Bold: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={TextBoldIconData} {...p} />;
const Italic: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={TextItalicIconData} {...p} />;
const Underline: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={TextUnderlineIconData} {...p} />;
const Strikethrough: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={TextStrikethroughIconData} {...p} />;
const Heading1: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Heading01IconData} {...p} />;
const Heading2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Heading02IconData} {...p} />;
const List: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={LeftToRightListBulletIconData} {...p} />;
const ListOrdered: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={LeftToRightListNumberIconData} {...p} />;
const Quote: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={QuoteDownIconData} {...p} />;
const Link: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Link01IconData} {...p} />;
const HrIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={MinusSignIconData} {...p} />;
const StopWatch: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={StopWatchIconData} {...p} />;
const HelpCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={HelpCircleIconData} {...p} />;
const Presentation: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Presentation01IconData} {...p} />;
const UserGroup: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UserGroupIconData} {...p} />;
const SearchIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Search01IconData} {...p} />;
const Target: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Target01IconData} {...p} />;
const TaskIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Task01IconData} {...p} />;

interface BrainDumpProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  onCreateTab?: (type: string, data?: any) => void;
  isActive?: boolean;
}

const ACTION_META: Record<BrainDumpActionType, { icon: React.ElementType; label: string; color: string }> = {
  'lesson-plan':          { icon: BookMarked,      label: 'Lesson Plan',          color: 'blue' },
  'quiz':                 { icon: PenTool,          label: 'Quiz',                 color: 'purple' },
  'rubric':               { icon: ClipboardList,    label: 'Rubric',               color: 'teal' },
  'worksheet':            { icon: FileSpreadsheet,  label: 'Worksheet',            color: 'green' },
  'calendar-task':        { icon: CalendarPlus,     label: 'Calendar Task',        color: 'orange' },
  'kindergarten-plan':    { icon: Baby,             label: 'Early Childhood Plan', color: 'pink' },
  'multigrade-plan':      { icon: Layers,           label: 'Multi-Level Plan',     color: 'indigo' },
  'cross-curricular-plan':{ icon: Merge,            label: 'Integrated Lesson',    color: 'cyan' },
  'image-studio':         { icon: Palette,          label: 'Image Studio',         color: 'rose' },
  'presentation':         { icon: Presentation,     label: 'Slide Deck',           color: 'violet' },
  'grade-quiz':           { icon: PenTool,          label: 'Grade Quiz',           color: 'amber' },
  'grade-worksheet':      { icon: FileSpreadsheet,  label: 'Grade Worksheet',      color: 'lime' },
  'curriculum-tracker':   { icon: Target,           label: 'Track Progress',       color: 'emerald' },
  'curriculum-browse':    { icon: SearchIcon,       label: 'Browse Curriculum',    color: 'sky' },
  'class-management':     { icon: UserGroup,        label: 'Class Management',     color: 'slate' },
  'attendance':           { icon: TaskIcon,         label: 'Attendance',           color: 'yellow' },
};

const ACTION_TO_TAB: Record<BrainDumpActionType, string> = {
  'lesson-plan': 'lesson-planner',
  'quiz': 'quiz-generator',
  'rubric': 'rubric-generator',
  'worksheet': 'worksheet-generator',
  'calendar-task': 'analytics',
  'kindergarten-plan': 'kindergarten-planner',
  'multigrade-plan': 'multigrade-planner',
  'cross-curricular-plan': 'cross-curricular-planner',
  'image-studio': 'image-studio',
  'presentation': 'presentation-builder',
  'grade-quiz': 'quiz-generator',
  'grade-worksheet': 'worksheet-generator',
  'curriculum-tracker': 'curriculum-tracker',
  'curriculum-browse': 'curriculum',
  'class-management': 'class-management',
  'attendance': 'class-management',
};

const STORAGE_KEY = 'brain-dump-entries';

function loadEntries(): BrainDumpEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveEntries(entries: BrainDumpEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// ─── Task Sets: Auto-splitting by tier ──────────────────────────
const TASK_SET_CHAR_LIMITS: Record<number, number> = {
  1: 3000,   // ~750 tokens — small models, CPU-first, faster per batch
  2: 6000,   // ~1,500 tokens — larger model, still CPU-friendly
  3: 8000,   // ~2,000 tokens — full capability, more headroom
};

function getTaskSetCharLimit(tier: number): number {
  return TASK_SET_CHAR_LIMITS[tier] ?? TASK_SET_CHAR_LIMITS[2];
}

/** Split text into sentences at . ! ? boundaries followed by whitespace or end-of-string. */
function splitIntoSentences(text: string): string[] {
  const sentences = text.match(/[^.!?\n]*[.!?]+[\s]*/g) || [];
  const joined = sentences.join('');
  const remainder = text.slice(joined.length).trim();
  if (remainder) sentences.push(remainder);
  return sentences.map(s => s.trim()).filter(s => s.length > 0);
}

/** Group sentences into sets that stay under the character limit. */
function groupSentencesIntoSets(sentences: string[], limit: number = TASK_SET_CHAR_LIMITS[1]): string[][] {
  const sets: string[][] = [];
  let currentSet: string[] = [];
  let currentLength = 0;

  for (const sentence of sentences) {
    const sentenceLen = sentence.length;
    if (currentLength + sentenceLen > limit && currentSet.length > 0) {
      sets.push(currentSet);
      currentSet = [sentence];
      currentLength = sentenceLen;
    } else {
      currentSet.push(sentence);
      currentLength += sentenceLen;
    }
  }
  if (currentSet.length > 0) sets.push(currentSet);
  return sets;
}

// ─── Utility: Modern Calculator ─────────────────────────────────
const MiniCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [prevResult, setPrevResult] = useState<string | null>(null);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInput = useCallback((val: string) => {
    if (val === 'AC') {
      setDisplay('0'); setExpression(''); setPrevResult(null); setJustEvaluated(false);
      return;
    }
    if (val === 'DEL') {
      setJustEvaluated(prev => {
        if (prev) return prev;
        setExpression(expr => { const n = expr.slice(0, -1) || '0'; setDisplay(n); return n; });
        return prev;
      });
      return;
    }
    if (val === '%') {
      setExpression(expr => {
        try {
          const sanitized = expr.replace(/[^0-9+\-*/.() ]/g, '');
          const result = new Function(`return (${sanitized})`)() / 100;
          const str = String(Number(result.toFixed(10)));
          setDisplay(str); setPrevResult(str); setJustEvaluated(true);
          return str;
        } catch { return expr; }
      });
      return;
    }
    if (val === '=') {
      setExpression(expr => {
        try {
          const sanitized = expr.replace(/[^0-9+\-*/.() ]/g, '');
          const result = new Function(`return (${sanitized})`)();
          const str = String(Number(result.toFixed(10)));
          setPrevResult(expr); setDisplay(str); setJustEvaluated(true);
          return str;
        } catch { setDisplay('Error'); setJustEvaluated(false); return ''; }
      });
      return;
    }

    setJustEvaluated(prev => {
      if (prev && !'+-*/'.includes(val)) {
        setExpression(val); setDisplay(val); setPrevResult(null);
        return false;
      }
      setExpression(expr => {
        const newExpr = expr === '0' && val !== '.' && !'+-*/'.includes(val) ? val : expr + val;
        setDisplay(newExpr);
        return newExpr;
      });
      return false;
    });
  }, []);

  // Keyboard support
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: KeyboardEvent) => {
      // Don't capture if user is typing in a textarea/input elsewhere
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      const key = e.key;
      if (/^[0-9]$/.test(key)) { e.preventDefault(); handleInput(key); }
      else if (key === '.' || key === ',') { e.preventDefault(); handleInput('.'); }
      else if (key === '+') { e.preventDefault(); handleInput('+'); }
      else if (key === '-') { e.preventDefault(); handleInput('-'); }
      else if (key === '*') { e.preventDefault(); handleInput('*'); }
      else if (key === '/') { e.preventDefault(); handleInput('/'); }
      else if (key === '%') { e.preventDefault(); handleInput('%'); }
      else if (key === 'Enter' || key === '=') { e.preventDefault(); handleInput('='); }
      else if (key === 'Backspace') { e.preventDefault(); handleInput('DEL'); }
      else if (key === 'Escape' || key === 'Delete') { e.preventDefault(); handleInput('AC'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleInput]);

  type BtnDef = { label: string; value: string; icon?: React.ElementType; span?: number; style: 'num' | 'op' | 'fn' | 'eq' };
  const buttons: BtnDef[] = [
    { label: 'AC',  value: 'AC',  style: 'fn' },
    { label: 'DEL', value: 'DEL', icon: Delete, style: 'fn' },
    { label: '%',   value: '%',   icon: Percent, style: 'fn' },
    { label: '/',   value: '/',   icon: Divide, style: 'op' },
    { label: '7',   value: '7',   style: 'num' },
    { label: '8',   value: '8',   style: 'num' },
    { label: '9',   value: '9',   style: 'num' },
    { label: '*',   value: '*',   style: 'op' },
    { label: '4',   value: '4',   style: 'num' },
    { label: '5',   value: '5',   style: 'num' },
    { label: '6',   value: '6',   style: 'num' },
    { label: '-',   value: '-',   icon: MinusIcon, style: 'op' },
    { label: '1',   value: '1',   style: 'num' },
    { label: '2',   value: '2',   style: 'num' },
    { label: '3',   value: '3',   style: 'num' },
    { label: '+',   value: '+',   icon: PlusIcon, style: 'op' },
    { label: '0',   value: '0',   span: 2, style: 'num' },
    { label: '.',   value: '.',   style: 'num' },
    { label: '=',   value: '=',   icon: Equal, style: 'eq' },
  ];

  const btnStyles: Record<string, string> = {
    num: 'bg-theme-surface text-theme-heading hover:bg-theme-hover ring-1 ring-black/[0.04] dark:ring-white/[0.06]',
    op:  'bg-purple-500/15 text-purple-600 dark:text-purple-400 hover:bg-purple-500/25',
    fn:  'bg-theme-tertiary text-theme-muted hover:bg-theme-hover',
    eq:  'bg-gradient-to-br from-purple-500 to-violet-600 text-white hover:from-purple-400 hover:to-violet-500 shadow-lg shadow-purple-500/20',
  };

  return (
    <div ref={containerRef} className="space-y-3">
      {/* Display */}
      <div className="rounded-2xl p-4 min-h-[5rem] flex flex-col justify-end"
        style={{ background: 'var(--bg-tertiary)' }}>
        {prevResult && (
          <p className="text-xs text-theme-hint text-right font-mono truncate mb-1">{prevResult}</p>
        )}
        <p className="text-right font-mono text-2xl font-light tracking-wide text-theme-heading truncate">
          {display}
        </p>
      </div>
      <p className="text-[10px] text-theme-hint text-center">Use your keyboard to type numbers and operators</p>
      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {buttons.map(b => {
          const Icon = b.icon;
          return (
            <button
              key={b.value + b.label}
              onClick={() => handleInput(b.value)}
              tabIndex={-1}
              className={`rounded-2xl py-3.5 text-sm font-semibold transition-all active:scale-[0.92] ${btnStyles[b.style]} ${b.span === 2 ? 'col-span-2' : ''}`}
            >
              {Icon ? <Icon className="w-4 h-4 mx-auto" /> : b.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Utility: Stopwatch ─────────────────────────────────────────
const MiniStopwatch: React.FC = () => {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 10), 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const fmt = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  const handleLap = () => { if (running) setLaps(prev => [elapsed, ...prev]); };
  const handleReset = () => { setRunning(false); setElapsed(0); setLaps([]); };

  return (
    <div className="space-y-4">
      {/* Display */}
      <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--bg-tertiary)' }}>
        <p className="font-mono text-4xl font-light tracking-wider text-theme-heading">{fmt(elapsed)}</p>
      </div>
      {/* Controls */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold bg-red-500/12 text-red-500 hover:bg-red-500/20 transition-all active:scale-[0.92]"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={() => setRunning(!running)}
          className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-[0.92] ${
            running
              ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
              : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20'
          }`}
        >
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start'}
        </button>
        <button
          onClick={handleLap}
          disabled={!running}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold bg-purple-500/12 text-purple-500 hover:bg-purple-500/20 transition-all active:scale-[0.92] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Clock className="w-4 h-4" />
          Lap
        </button>
      </div>
      {/* Laps */}
      {laps.length > 0 && (
        <div className="rounded-2xl ring-1 ring-theme overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
          <div className="max-h-[120px] overflow-y-auto">
            {laps.map((lap, i) => {
              const diff = i < laps.length - 1 ? lap - laps[i + 1] : lap;
              return (
                <div key={i} className="flex items-center justify-between px-4 py-2 text-xs border-b border-theme/30 last:border-0">
                  <span className="font-semibold text-theme-muted">Lap {laps.length - i}</span>
                  <span className="font-mono text-theme-heading">{fmt(lap)}</span>
                  <span className="font-mono text-purple-500">+{fmt(diff)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Utility: Countdown Timer ───────────────────────────────────
const MiniTimer: React.FC = () => {
  const [totalSec, setTotalSec] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const [customMin, setCustomMin] = useState('');
  const [customSec, setCustomSec] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) { setRunning(false); return 0; }
          return r - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, remaining]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const progress = totalSec > 0 ? ((totalSec - remaining) / totalSec) * 100 : 0;
  const isFinished = remaining === 0 && totalSec > 0;
  const presets = [
    { label: '1m', sec: 60 },
    { label: '5m', sec: 300 },
    { label: '10m', sec: 600 },
    { label: '15m', sec: 900 },
    { label: '30m', sec: 1800 },
  ];

  const applyCustom = () => {
    const m = parseInt(customMin) || 0;
    const s = parseInt(customSec) || 0;
    const total = m * 60 + s;
    if (total > 0) {
      setTotalSec(total);
      setRemaining(total);
      setRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Display with progress ring */}
      <div className={`rounded-2xl p-5 text-center relative overflow-hidden ${isFinished ? 'animate-pulse' : ''}`} style={{ background: 'var(--bg-tertiary)' }}>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 transition-all duration-1000 rounded-full"
          style={{ width: `${progress}%`, background: isFinished ? '#ef4444' : 'linear-gradient(to right, #a855f7, #7c3aed)' }} />
        <p className={`font-mono text-4xl font-light tracking-wider ${isFinished ? 'text-red-500' : 'text-theme-heading'}`}>
          {fmt(remaining)}
        </p>
        {isFinished && <p className="text-xs font-semibold text-red-500 mt-1">Time's up!</p>}
      </div>
      {/* Presets */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {presets.map(p => (
          <button
            key={p.sec}
            onClick={() => { setTotalSec(p.sec); setRemaining(p.sec); setRunning(false); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
              totalSec === p.sec && !running
                ? 'bg-purple-500/20 text-purple-500 ring-1 ring-purple-500/30'
                : 'bg-theme-surface text-theme-muted hover:bg-theme-hover ring-1 ring-black/[0.04] dark:ring-white/[0.06]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {/* Custom input */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min"
          value={customMin}
          onChange={(e) => setCustomMin(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl text-xs text-center bg-theme-surface ring-1 ring-black/[0.04] dark:ring-white/[0.06] text-theme-heading placeholder:text-theme-hint focus:outline-none focus:ring-2 focus:ring-purple-400/40"
          min="0"
          max="999"
        />
        <span className="text-theme-hint text-xs font-bold">:</span>
        <input
          type="number"
          placeholder="Sec"
          value={customSec}
          onChange={(e) => setCustomSec(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl text-xs text-center bg-theme-surface ring-1 ring-black/[0.04] dark:ring-white/[0.06] text-theme-heading placeholder:text-theme-hint focus:outline-none focus:ring-2 focus:ring-purple-400/40"
          min="0"
          max="59"
        />
        <button
          onClick={applyCustom}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-500/12 text-purple-500 hover:bg-purple-500/20 transition-all active:scale-95"
        >
          Set
        </button>
      </div>
      {/* Controls */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setRunning(!running)}
          disabled={remaining === 0 && !running}
          className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-[0.92] disabled:opacity-30 ${
            running
              ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
              : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20'
          }`}
        >
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? 'Pause' : remaining < totalSec && remaining > 0 ? 'Resume' : 'Start'}
        </button>
        <button
          onClick={() => { setRunning(false); setRemaining(totalSec); }}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold bg-theme-surface text-theme-muted hover:bg-theme-hover ring-1 ring-black/[0.04] dark:ring-white/[0.06] transition-all active:scale-[0.92]"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
};

// ─── Review Sets Panel (Tier 1 splitting) ───────────────────────
const ReviewSetsPanel: React.FC<{
  taskSets: string[][];
  onUpdateSets: (sets: string[][]) => void;
  onConfirm: () => void;
  onCancel: () => void;
  accentColor: string;
}> = ({ taskSets, onUpdateSets, onConfirm, onCancel, accentColor }) => {

  const moveSentence = (fromSet: number, sentenceIdx: number, toSet: number) => {
    const newSets = taskSets.map(s => [...s]);
    const [sentence] = newSets[fromSet].splice(sentenceIdx, 1);
    if (toSet >= newSets.length) {
      // Create new set
      newSets.push([sentence]);
    } else {
      // Add to start if moving down, end if moving up
      if (toSet > fromSet) {
        newSets[toSet].unshift(sentence);
      } else {
        newSets[toSet].push(sentence);
      }
    }
    // Remove empty sets
    onUpdateSets(newSets.filter(s => s.length > 0));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="p-1.5 rounded-xl bg-theme-tertiary text-theme-muted hover:text-theme-label transition-all active:scale-90"
          >
            <Icon icon={ArrowLeft01IconData} className="w-4 h-4" />
          </button>
          <h3 className="text-sm font-bold text-theme-heading flex items-center gap-2">
            <Layers className="w-4 h-4" style={{ color: accentColor }} />
            Review Task Sets
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${accentColor}20`, color: accentColor }}>
              {taskSets.length} sets
            </span>
          </h3>
        </div>
      </div>

      <p className="text-xs text-theme-muted leading-relaxed">
        Your input has been split into manageable sets for better accuracy. Review the sets below and move sentences between them if needed.
      </p>

      {/* Sets */}
      <div className="space-y-3">
        {taskSets.map((sentences, setIdx) => {
          const setCharCount = sentences.join(' ').length;
          const isOverLimit = setCharCount > TASK_SET_CHAR_LIMIT;

          return (
            <div
              key={setIdx}
              className={`rounded-2xl ring-1 overflow-hidden transition-all ${
                isOverLimit
                  ? 'ring-amber-500/30 bg-amber-500/5'
                  : 'ring-theme bg-theme-surface'
              }`}
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              {/* Set header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-theme"
                style={{ background: `${accentColor}08` }}>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                  Set {setIdx + 1}
                </span>
                <span className={`text-[10px] font-mono ${isOverLimit ? 'text-amber-500 font-semibold' : 'text-theme-muted'}`}>
                  {setCharCount.toLocaleString()} chars
                  {isOverLimit && ' ⚠'}
                </span>
              </div>

              {/* Sentences */}
              <div className="divide-y divide-theme">
                {sentences.map((sentence, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2 px-4 py-2.5 group hover:bg-theme-tertiary/50 transition-colors">
                    <p className="flex-1 text-sm text-theme-label leading-relaxed min-w-0">
                      {sentence}
                    </p>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Move up (to previous set) */}
                      {setIdx > 0 && (
                        <button
                          onClick={() => moveSentence(setIdx, sIdx, setIdx - 1)}
                          className="p-1 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all active:scale-90"
                          title={`Move to Set ${setIdx}`}
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {/* Move down (to next set) */}
                      {setIdx < taskSets.length - 1 && (
                        <button
                          onClick={() => moveSentence(setIdx, sIdx, setIdx + 1)}
                          className="p-1 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all active:scale-90"
                          title={`Move to Set ${setIdx + 2}`}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 shadow-lg shadow-purple-500/20"
        >
          <Zap className="w-4 h-4" />
          Generate All {taskSets.length} Sets
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] bg-theme-tertiary text-theme-muted hover:text-theme-label ring-1 ring-theme"
        >
          Back
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────
const BrainDump: React.FC<BrainDumpProps> = ({ tabId, savedData, onDataChange, onCreateTab }) => {
  const [flipped, setFlipped] = useState(false);
  const [dumpText, setDumpText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [actions, setActions] = useState<BrainDumpAction[]>([]);
  const [entries, setEntries] = useState<BrainDumpEntry[]>(loadEntries);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [activeTool, setActiveTool] = useState<'calculator' | 'stopwatch' | 'timer' | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [skeletonExpanded, setSkeletonExpanded] = useState(false);
  const [revealActions, setRevealActions] = useState(false);
  const [visibleActionCount, setVisibleActionCount] = useState(0);
  const [suggestions, setSuggestions] = useState<BrainDumpSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  // ── Task Sets state (Tier 1 auto-splitting) ──
  const [taskSets, setTaskSets] = useState<string[][]>([]);
  const [showReviewSets, setShowReviewSets] = useState(false);
  const [setResults, setSetResults] = useState<Map<number, BrainDumpAction[]>>(new Map());
  const [currentSetProcessing, setCurrentSetProcessing] = useState(-1);
  const [totalSetsToGenerate, setTotalSetsToGenerate] = useState(0);

  const editorRef = useRef<HTMLDivElement>(null);
  const editEditorRef = useRef<HTMLDivElement>(null);
  const accumulatedRef = useRef('');
  const suggestAccumulatedRef = useRef('');
  const actionAccumulatedRef = useRef('');

  const { settings } = useSettings();
  const { t } = useTranslation();
  const accentColor = settings.tabColors['brain-dump'] ?? '#a855f7';

  const { tier } = useCapabilities();
  const { getConnection, getStreamingContent, getIsStreaming, clearStreaming } = useWebSocket();
  const { enqueue, queueEnabled } = useQueue();
  const { guardOffline } = useOfflineGuard();
  const [localLoadingMap, setLocalLoadingMap] = useState<{ [tabId: string]: boolean }>({});
  const WS_ENDPOINT = '/ws/brain-dump';
  useQueueCancellation(tabId, WS_ENDPOINT, setLocalLoadingMap);

  // STT integration
  const { isListening, toggleListening } = useSTT(
    (finalText) => {
      if (editorRef.current) {
        // Insert spoken text at cursor or append
        editorRef.current.focus();
        document.execCommand('insertText', false, (editorRef.current.textContent ? ' ' : '') + finalText);
        setDumpText(editorRef.current.innerHTML);
      }
      setInterimText('');
    },
    (interim) => setInterimText(interim),
    settings.language
  );

  // Helper to get plain text from editor
  const getPlainText = useCallback(() => {
    if (!editorRef.current) return '';
    return editorRef.current.innerText.trim();
  }, []);

  // Check if the current selection is inside a specific block tag
  const isInsideBlock = useCallback((tag: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    let node: Node | null = sel.anchorNode;
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === tag.toUpperCase()) return true;
      node = node.parentNode;
    }
    return false;
  }, []);

  // Exec command helper for toolbar — with toggle support for block formats
  const execFormat = useCallback((command: string, value?: string) => {
    const sel = window.getSelection();
    const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    editorRef.current?.focus();
    if (range) { sel!.removeAllRanges(); sel!.addRange(range); }

    // Toggle: if formatBlock is already the same tag, revert to <div> (normal paragraph)
    if (command === 'formatBlock' && value) {
      const tag = value.replace(/[<>]/g, '');
      if (isInsideBlock(tag)) {
        document.execCommand('formatBlock', false, '<div>');
        if (editorRef.current) setDumpText(editorRef.current.innerHTML);
        return;
      }
    }

    document.execCommand(command, false, value);
    if (editorRef.current) setDumpText(editorRef.current.innerHTML);
  }, [isInsideBlock]);

  // Check if the current selection is inside a specific block tag (edit editor)
  const isInsideBlockEdit = useCallback((tag: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    let node: Node | null = sel.anchorNode;
    while (node && node !== editEditorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === tag.toUpperCase()) return true;
      node = node.parentNode;
    }
    return false;
  }, []);

  // Exec command helper for edit toolbar — with toggle support
  const execEditFormat = useCallback((command: string, value?: string) => {
    const sel = window.getSelection();
    const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    editEditorRef.current?.focus();
    if (range) { sel!.removeAllRanges(); sel!.addRange(range); }

    if (command === 'formatBlock' && value) {
      const tag = value.replace(/[<>]/g, '');
      if (isInsideBlockEdit(tag)) {
        document.execCommand('formatBlock', false, '<div>');
        if (editEditorRef.current) setEditText(editEditorRef.current.innerHTML);
        return;
      }
    }

    document.execCommand(command, false, value);
    if (editEditorRef.current) setEditText(editEditorRef.current.innerHTML);
  }, [isInsideBlockEdit]);

  // Parse the AI response into actions + unmatched text
  const parseActions = useCallback((raw: string): { actions: BrainDumpAction[]; unmatched: string[] } => {
    const mapActions = (arr: any[]): BrainDumpAction[] =>
      arr.filter((a: any) => a && typeof a === 'object' && a.type)
        .map((a: any, i: number) => ({
          id: `action-${Date.now()}-${i}`,
          type: a.type || 'calendar-task',
          title: a.title || 'Untitled Task',
          description: a.description || '',
          details: a.details || a.suggestedData || {},
          status: 'pending' as const,
          priority: a.priority || 'normal',
        }));

    const tryParseResult = (parsed: any): { actions: BrainDumpAction[]; unmatched: string[] } | null => {
      if (parsed && !Array.isArray(parsed) && parsed.actions) {
        return {
          actions: mapActions(Array.isArray(parsed.actions) ? parsed.actions : []),
          unmatched: Array.isArray(parsed.unmatched) ? parsed.unmatched : [],
        };
      }
      if (Array.isArray(parsed)) {
        const mapped = mapActions(parsed);
        if (mapped.length > 0) return { actions: mapped, unmatched: [] };
      }
      if (parsed && !Array.isArray(parsed) && parsed.items) {
        const mapped = mapActions(parsed.items);
        if (mapped.length > 0) return { actions: mapped, unmatched: [] };
      }
      return null;
    };

    // Attempt to repair truncated JSON by closing open brackets/braces
    const tryRepairTruncatedJson = (text: string): any | null => {
      // Find the start of JSON
      const jsonStart = text.search(/[\[{]/);
      if (jsonStart === -1) return null;
      let jsonStr = text.slice(jsonStart);

      // Smart bracket-counting repair: figure out what's unclosed
      const buildCloser = (s: string): string => {
        const stack: string[] = [];
        let inString = false;
        let escape = false;
        for (const ch of s) {
          if (escape) { escape = false; continue; }
          if (ch === '\\') { escape = true; continue; }
          if (ch === '"') { inString = !inString; continue; }
          if (inString) continue;
          if (ch === '{') stack.push('}');
          else if (ch === '[') stack.push(']');
          else if (ch === '}' || ch === ']') stack.pop();
        }
        // If we're inside a string, close it first
        if (inString) return '"' + stack.reverse().join('');
        return stack.reverse().join('');
      };

      // Try smart closer first
      const smartCloser = buildCloser(jsonStr);
      if (smartCloser) {
        try {
          return JSON.parse(jsonStr + smartCloser);
        } catch { /* fall through */ }
        // Try trimming back to last complete value before closing
        const lastComma = jsonStr.lastIndexOf(',');
        if (lastComma > jsonStr.length * 0.3) {
          const trimmed = jsonStr.slice(0, lastComma);
          const trimmedCloser = buildCloser(trimmed);
          try {
            return JSON.parse(trimmed + trimmedCloser);
          } catch { /* fall through */ }
        }
      }

      // Try progressively aggressive repairs
      const closers = [']}', '"}]}', '""}}]}', '""}]}'];
      for (const closer of closers) {
        try {
          return JSON.parse(jsonStr + closer);
        } catch { /* try next */ }
      }

      // Last resort: extract individual complete action objects via regex
      const actionRegex = /\{[^{}]*"type"\s*:\s*"[^"]+"[^{}]*\}/g;
      const matches = jsonStr.match(actionRegex);
      if (matches && matches.length > 0) {
        const actions: any[] = [];
        for (const m of matches) {
          try {
            actions.push(JSON.parse(m));
          } catch { /* skip malformed */ }
        }
        if (actions.length > 0) return { actions, unmatched: [] };
      }
      return null;
    };

    // Step 1: Direct parse
    try {
      const parsed = JSON.parse(raw);
      const result = tryParseResult(parsed);
      if (result && result.actions.length > 0) return result;
    } catch { /* fall through */ }

    // Step 2: Extract from markdown code blocks
    const codeBlockMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      try {
        const parsed = JSON.parse(codeBlockMatch[1]);
        const result = tryParseResult(parsed);
        if (result && result.actions.length > 0) return result;
      } catch { /* fall through */ }
    }

    // Step 3: Extract JSON-like region
    const jsonRegionMatch = raw.match(/[\[{][\s\S]*[\]}]/);
    if (jsonRegionMatch) {
      try {
        const parsed = JSON.parse(jsonRegionMatch[0]);
        const result = tryParseResult(parsed);
        if (result && result.actions.length > 0) return result;
      } catch { /* fall through */ }
    }

    // Step 4: Repair truncated JSON (key fix for tier-1 token cutoff)
    const repaired = tryRepairTruncatedJson(raw);
    if (repaired) {
      const result = tryParseResult(repaired);
      if (result && result.actions.length > 0) return result;
    }

    return { actions: [], unmatched: [] };
  }, []);

  // Handle queue-based streaming completion
  const streamingContent = getStreamingContent(tabId, WS_ENDPOINT);
  const isStreaming = getIsStreaming(tabId, WS_ENDPOINT);
  const loading = !!localLoadingMap[tabId] || isStreaming || isAnalyzing;

  // Track completed sets in queue mode
  const queueSetsCompletedRef = useRef(0);

  useEffect(() => {
    if (localLoadingMap[tabId] && streamingContent && !isStreaming) {
      // Queue-based generation finished — parse the result
      const { actions: parsed, unmatched: unmatchedRaw } = parseActions(streamingContent);
      let unmatched = unmatchedRaw;
      clearStreaming(tabId, WS_ENDPOINT);

      // Multi-set queue mode: accumulate results across set completions
      if (totalSetsToGenerate > 1) {
        const completedIdx = queueSetsCompletedRef.current;
        setSetResults(prev => {
          const updated = new Map(prev);
          updated.set(completedIdx, parsed);
          return updated;
        });
        setActions(prev => [...prev, ...parsed]);
        setCurrentSetProcessing(completedIdx + 1);
        queueSetsCompletedRef.current = completedIdx + 1;

        // Check if all sets are done
        if (completedIdx + 1 >= totalSetsToGenerate) {
          setLocalLoadingMap(prev => ({ ...prev, [tabId]: false }));
          setCurrentSetProcessing(-1);
          queueSetsCompletedRef.current = 0;
        }
        // Otherwise keep localLoadingMap true — more queue items incoming
        return;
      }

      // Single-set (normal) mode
      // If AI returned nothing at all, treat entire input as unmatched for follow-up
      if (parsed.length === 0 && unmatched.length === 0) {
        const inputText = getPlainText();
        if (inputText) {
          unmatched = [inputText];
        } else {
          setAnalysisError('Could not extract actions. Try being more specific about what you need (e.g., "make a quiz on fractions for grade 3").');
        }
      }
      setActions(parsed);
      setLocalLoadingMap(prev => ({ ...prev, [tabId]: false }));
      // Trigger suggestion flow for unmatched text
      if (unmatched.length > 0) {
        const ws = getConnection(tabId, WS_ENDPOINT);
        const delay = Math.max(parsed.length * 120 + 500, 800);
        setTimeout(() => {
          if (ws.readyState === WebSocket.OPEN) {
            suggestAccumulatedRef.current = '';
            setIsSuggestLoading(true);
            ws.send(JSON.stringify({
              type: 'suggest',
              unmatchedText: unmatched.join('. '),
              jobId: `brain-dump-suggest-${Date.now()}`,
              generationMode: settings.generationMode,
            }));
          }
        }, delay);
      }
    }
  }, [streamingContent, isStreaming, localLoadingMap, tabId, parseActions, clearStreaming, getConnection, settings.generationMode, totalSetsToGenerate, getPlainText]);

  // Skeleton loading lifecycle
  const prevLoadingRef = useRef(false);
  useEffect(() => {
    const wasLoading = prevLoadingRef.current;
    prevLoadingRef.current = loading;

    // Started loading
    if (loading && !wasLoading) {
      setShowSkeleton(true);
      setSkeletonExpanded(false);
      setRevealActions(false);
      setVisibleActionCount(0);
    }

    // Finished loading
    if (!loading && wasLoading) {
      // Expand skeleton to cover tools area
      setSkeletonExpanded(true);
      // After expansion, fade out skeleton and start revealing actions
      const fadeTimer = setTimeout(() => {
        setShowSkeleton(false);
        setSkeletonExpanded(false);
        if (actions.length > 0) {
          setRevealActions(true);
        }
      }, 500);
      return () => clearTimeout(fadeTimer);
    }
  }, [loading, actions.length]);

  // Stagger reveal action cards one by one
  useEffect(() => {
    if (!revealActions || actions.length === 0) return;
    setVisibleActionCount(0);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleActionCount(count);
      if (count >= actions.length) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, [revealActions, actions.length]);

  // Analyze brain dump via WebSocket
  const handleAnalyze = useCallback(() => {
    if (guardOffline()) return;
    const text = getPlainText();
    if (!text || loading) return;

    // Check if text needs splitting into sets (tier-aware limits)
    const charLimit = getTaskSetCharLimit(tier);
    if (text.length > charLimit) {
      const sentences = splitIntoSentences(text);
      const sets = groupSentencesIntoSets(sentences, charLimit);
      if (sets.length > 1) {
        setTaskSets(sets);
        setShowReviewSets(true);
        return; // Show review UI instead of generating immediately
      }
    }

    setActions([]);
    setSuggestions([]);
    setShowSuggestions(false);
    setRevealActions(false);
    setVisibleActionCount(0);
    setAnalysisError(null);
    setSetResults(new Map());
    setCurrentSetProcessing(-1);
    setTotalSetsToGenerate(0);
    accumulatedRef.current = '';
    suggestAccumulatedRef.current = '';

    // Queue path: enqueue and let QueueContext handle sending
    if (queueEnabled) {
      enqueue({
        label: `Brain Dump Analysis`,
        toolType: 'Brain Dump',
        tabId,
        endpoint: WS_ENDPOINT,
        prompt: '',
        generationMode: settings.generationMode,
        extraMessageData: { text, jobId: `brain-dump-${Date.now()}` },
      });
      setLocalLoadingMap(prev => ({ ...prev, [tabId]: true }));
      return;
    }

    // Direct path: send via WebSocket manually
    setIsAnalyzing(true);

    const ws = getConnection(tabId, WS_ENDPOINT);

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        // ── Primary analysis tokens ──
        if (data.type === 'token') {
          accumulatedRef.current += data.content;
        } else if (data.type === 'done') {
          const { actions: parsed, unmatched: unmatchedRaw } = parseActions(accumulatedRef.current);
          // If AI returned nothing at all, treat entire input as unmatched for follow-up
          let unmatched = unmatchedRaw;
          if (parsed.length === 0 && unmatched.length === 0) {
            const inputText = getPlainText();
            if (inputText) {
              unmatched = [inputText];
            } else {
              setAnalysisError('Could not extract actions. Try being more specific about what you need (e.g., "make a quiz on fractions for grade 3").');
            }
          }
          setActions(parsed);
          setIsAnalyzing(false);
          // Trigger suggestion flow for unmatched text (after action reveal animation)
          if (unmatched.length > 0) {
            const delay = Math.max(parsed.length * 120 + 500, 800);
            setTimeout(() => {
              if (ws.readyState === WebSocket.OPEN) {
                suggestAccumulatedRef.current = '';
                setIsSuggestLoading(true);
                ws.send(JSON.stringify({
                  type: 'suggest',
                  unmatchedText: unmatched.join('. '),
                  jobId: `brain-dump-suggest-${Date.now()}`,
                  generationMode: settings.generationMode,
                }));
              }
            }, delay);
          } else {
            ws.removeEventListener('message', handleMessage);
          }

        // ── Suggestion tokens ──
        } else if (data.type === 'suggestion_token') {
          suggestAccumulatedRef.current += data.content;
        } else if (data.type === 'suggestions_done') {
          setIsSuggestLoading(false);
          try {
            let raw = suggestAccumulatedRef.current.trim();
            // Try to extract JSON — handle both wrapped {suggestions: [...]} and bare array formats
            let parsed = JSON.parse(raw);
            // Unwrap {suggestions: [...]} if present
            if (parsed && !Array.isArray(parsed) && Array.isArray(parsed.suggestions)) {
              parsed = parsed.suggestions;
            }
            if (!Array.isArray(parsed)) {
              const match = raw.match(/\[[\s\S]*\]/);
              parsed = match ? JSON.parse(match[0]) : [];
            }
            const mapped: BrainDumpSuggestion[] = parsed
              .filter((s: any) => s.suggestedTypes?.length > 0)
              .map((s: any, i: number) => ({
                id: `suggest-${Date.now()}-${i}`,
                text: s.text || '',
                suggestedTypes: s.suggestedTypes || [],
                confidence: s.confidence || 'low',
                status: 'pending' as const,
              }));
            if (mapped.length > 0) {
              setSuggestions(mapped);
              setShowSuggestions(true);
            }
          } catch { /* ignore parse errors */ }
          // Don't remove listener yet — we still need it for generate-action

        // ── Single action generation tokens ──
        } else if (data.type === 'action_token') {
          actionAccumulatedRef.current += data.content;
        } else if (data.type === 'action_done') {
          try {
            let raw = actionAccumulatedRef.current.trim();
            let parsed = JSON.parse(raw);
            if (!parsed.type) {
              const match = raw.match(/\{[\s\S]*\}/);
              if (match) parsed = JSON.parse(match[0]);
            }
            const newAction: BrainDumpAction = {
              id: `action-${Date.now()}`,
              type: parsed.type || 'calendar-task',
              title: parsed.title || 'Untitled Task',
              description: parsed.description || '',
              details: parsed.details || {},
              status: 'pending' as const,
            };
            setActions(prev => [...prev, newAction]);
            // Update the suggestion that triggered this
            setSuggestions(prev => prev.map(s =>
              s.status === 'generating' ? { ...s, status: 'generated', generatedAction: newAction } : s
            ));
          } catch { /* ignore */ }
          actionAccumulatedRef.current = '';

        } else if (data.type === 'error') {
          setAnalysisError(data.message || 'Analysis failed. Please try again.');
          setIsAnalyzing(false);
          setIsSuggestLoading(false);
          ws.removeEventListener('message', handleMessage);
        }
      } catch { /* ignore parse errors on individual messages */ }
    };

    ws.addEventListener('message', handleMessage);

    const sendPayload = () => {
      ws.send(JSON.stringify({
        text,
        jobId: `brain-dump-${Date.now()}`,
        generationMode: settings.generationMode,
      }));
    };

    if (ws.readyState === WebSocket.OPEN) {
      sendPayload();
    } else {
      ws.addEventListener('open', sendPayload, { once: true });
    }
  }, [guardOffline, getPlainText, loading, tabId, getConnection, parseActions, queueEnabled, enqueue, settings.generationMode, tier]);

  // ── Generate all task sets sequentially (Tier 1) ──
  const handleGenerateAllSets = useCallback(() => {
    if (guardOffline()) return;
    setShowReviewSets(false);
    setActions([]);
    setSuggestions([]);
    setShowSuggestions(false);
    setRevealActions(false);
    setVisibleActionCount(0);
    setAnalysisError(null);
    setSetResults(new Map());
    setTotalSetsToGenerate(taskSets.length);
    setCurrentSetProcessing(0);
    accumulatedRef.current = '';
    suggestAccumulatedRef.current = '';

    if (queueEnabled) {
      // Queue each set as a separate queue item
      taskSets.forEach((set, index) => {
        enqueue({
          label: `Brain Dump — Set ${index + 1}/${taskSets.length}`,
          toolType: 'Brain Dump',
          tabId,
          endpoint: WS_ENDPOINT,
          prompt: '',
          generationMode: settings.generationMode,
          extraMessageData: {
            text: set.join(' '),
            jobId: `brain-dump-set-${index}-${Date.now()}`,
            setIndex: index,
            totalSets: taskSets.length,
          },
        });
      });
      setLocalLoadingMap(prev => ({ ...prev, [tabId]: true }));
      return;
    }

    // Direct WebSocket path: send sets sequentially
    setIsAnalyzing(true);
    const ws = getConnection(tabId, WS_ENDPOINT);

    const sendSet = (setIndex: number) => {
      if (setIndex >= taskSets.length) {
        // All sets done — merge results into actions
        setIsAnalyzing(false);
        setCurrentSetProcessing(-1);
        const allActions: BrainDumpAction[] = [];
        const sortedResults = new Map([...setResults.entries()].sort((a, b) => a[0] - b[0]));
        sortedResults.forEach(acts => allActions.push(...acts));
        setActions(allActions);
        return;
      }

      setCurrentSetProcessing(setIndex);
      accumulatedRef.current = '';
      const text = taskSets[setIndex].join(' ');

      const handleSetMessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'token') {
            accumulatedRef.current += data.content;
          } else if (data.type === 'done') {
            const { actions: parsed } = parseActions(accumulatedRef.current);
            setSetResults(prev => {
              const updated = new Map(prev);
              updated.set(setIndex, parsed);
              return updated;
            });
            // Also add to actions incrementally so skeleton can transition
            setActions(prev => [...prev, ...parsed]);

            ws.removeEventListener('message', handleSetMessage);
            // Send next set after a short delay
            setTimeout(() => sendSet(setIndex + 1), 300);
          } else if (data.type === 'error') {
            setAnalysisError(data.message || `Set ${setIndex + 1} failed.`);
            ws.removeEventListener('message', handleSetMessage);
            setIsAnalyzing(false);
            setCurrentSetProcessing(-1);
          }
        } catch { /* ignore */ }
      };

      ws.addEventListener('message', handleSetMessage);

      const payload = JSON.stringify({
        text,
        jobId: `brain-dump-set-${setIndex}-${Date.now()}`,
        generationMode: settings.generationMode,
      });

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      } else {
        ws.addEventListener('open', () => ws.send(payload), { once: true });
      }
    };

    if (ws.readyState === WebSocket.OPEN) {
      sendSet(0);
    } else {
      ws.addEventListener('open', () => sendSet(0), { once: true });
    }
  }, [guardOffline, taskSets, queueEnabled, enqueue, tabId, settings.generationMode, getConnection, parseActions, setResults]);

  // Accept an action
  const handleAccept = useCallback((actionId: string) => {
    setActions(prev => prev.map(a => a.id === actionId ? { ...a, status: 'accepted' } : a));
    const action = actions.find(a => a.id === actionId);
    if (!action) return;

    if (action.type === 'calendar-task') {
      try {
        const existing = JSON.parse(localStorage.getItem('dashboard-tasks') || '[]');
        const newTask = {
          id: `task-${Date.now()}`,
          text: action.title,
          description: action.description,
          completed: false,
          dueDate: action.details.date || new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('dashboard-tasks', JSON.stringify([...existing, newTask]));
      } catch { /* ignore */ }
    } else {
      const tabType = ACTION_TO_TAB[action.type];
      if (tabType && onCreateTab) {
        onCreateTab(tabType, action.details);
      }
    }
  }, [actions, onCreateTab]);

  // Deny an action
  const handleDeny = useCallback((actionId: string) => {
    setActions(prev => prev.map(a => a.id === actionId ? { ...a, status: 'denied' } : a));
  }, []);

  // Handle selecting a suggested action type
  const handleSuggestionSelect = useCallback((suggestionId: string, actionType: BrainDumpActionType) => {
    setSuggestions(prev => prev.map(s =>
      s.id === suggestionId ? { ...s, status: 'generating', selectedType: actionType } : s
    ));
    actionAccumulatedRef.current = '';
    const ws = getConnection(tabId, WS_ENDPOINT);
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({
      type: 'generate-action',
      actionType,
      text: suggestion.text,
      jobId: `brain-dump-action-${Date.now()}`,
      generationMode: settings.generationMode,
    }));
  }, [getConnection, tabId, suggestions, settings.generationMode]);

  // Dismiss a suggestion
  const handleSuggestionDismiss = useCallback((suggestionId: string) => {
    setSuggestions(prev => prev.map(s =>
      s.id === suggestionId ? { ...s, status: 'dismissed' } : s
    ));
  }, []);

  // Save current brain dump to notes
  const handleSaveToNotes = useCallback(() => {
    const html = dumpText.trim();
    const plain = getPlainText();
    if (!plain && actions.length === 0) return;
    const entry: BrainDumpEntry = {
      id: `entry-${Date.now()}`,
      text: html || plain,
      timestamp: new Date().toISOString(),
      actions: [...actions],
    };
    const updated = [entry, ...entries].slice(0, 50);
    setEntries(updated);
    saveEntries(updated);
    setDumpText('');
    if (editorRef.current) editorRef.current.innerHTML = '';
    setActions([]);
    setAnalysisError(null);
  }, [dumpText, actions, entries, getPlainText]);

  // Save just the text as a note (no analysis needed)
  const handleSaveTextAsNote = useCallback(() => {
    const html = dumpText.trim();
    const plain = getPlainText();
    if (!plain) return;
    const entry: BrainDumpEntry = {
      id: `entry-${Date.now()}`,
      text: html || plain,
      timestamp: new Date().toISOString(),
      actions: [],
    };
    const updated = [entry, ...entries].slice(0, 50);
    setEntries(updated);
    saveEntries(updated);
    setDumpText('');
    if (editorRef.current) editorRef.current.innerHTML = '';
    setActions([]);
    setAnalysisError(null);
  }, [dumpText, entries, getPlainText]);

  // Delete a saved entry
  const handleDeleteEntry = useCallback((entryId: string) => {
    const updated = entries.filter(e => e.id !== entryId);
    setEntries(updated);
    saveEntries(updated);
    if (editingEntry === entryId) setEditingEntry(null);
  }, [entries, editingEntry]);

  // Start editing a note
  const handleStartEdit = useCallback((entry: BrainDumpEntry) => {
    setEditingEntry(entry.id);
    setEditText(entry.text);
    // Set content after render
    requestAnimationFrame(() => {
      if (editEditorRef.current) {
        editEditorRef.current.innerHTML = entry.text;
        editEditorRef.current.focus();
      }
    });
  }, []);

  // Save edited note
  const handleSaveEdit = useCallback((entryId: string) => {
    const html = editEditorRef.current?.innerHTML?.trim() || editText.trim();
    if (!html) return;
    const updated = entries.map(e => e.id === entryId ? { ...e, text: html } : e);
    setEntries(updated);
    saveEntries(updated);
    setEditingEntry(null);
    setEditText('');
  }, [entries, editText]);

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setEditingEntry(null);
    setEditText('');
  }, []);

  const hasContent = getPlainText().length > 0;
  const charCount = getPlainText().length;
  const tierCharLimit = getTaskSetCharLimit(tier);
  const needsSplitting = charCount > tierCharLimit;
  const estimatedSets = needsSplitting ? groupSentencesIntoSets(splitIntoSentences(getPlainText()), tierCharLimit).length : 1;

  // Strip HTML for preview text
  const stripHtml = useCallback((html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }, []);

  const quickTools = [
    { id: 'calculator' as const, icon: Calculator, label: 'Calculator', color: 'text-blue-500', bg: 'bg-blue-500/12 hover:bg-blue-500/20' },
    { id: 'stopwatch' as const, icon: Clock, label: 'Stopwatch', color: 'text-amber-500', bg: 'bg-amber-500/12 hover:bg-amber-500/20' },
    { id: 'timer' as const, icon: Timer, label: 'Timer', color: 'text-green-500', bg: 'bg-green-500/12 hover:bg-green-500/20' },
  ];

  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => { setInitialLoad(false); }, []);

  if (initialLoad) {
    return (
      <div className="h-full overflow-hidden p-4 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-lg" />
            <div className="space-y-1">
              <ShimmerBar accentColor={accentColor} className="h-6 w-32" />
              <ShimmerBar accentColor={accentColor} className="h-3 w-20" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        </div>
        {/* Editor area */}
        <div className="rounded-2xl bg-theme-surface ring-1 ring-theme-border overflow-hidden">
          {/* Toolbar */}
          <div className="border-b border-theme px-4 py-2 flex gap-1">
            {Array(8).fill(0).map((_, i) => (
              <Skeleton key={i} className="w-8 h-8 rounded" />
            ))}
          </div>
          {/* Editor body */}
          <div className="p-6 space-y-3 min-h-[400px]">
            <ShimmerBar accentColor={accentColor} className="h-4 w-4/5" />
            <ShimmerBar accentColor={accentColor} className="h-4 w-3/5" />
            <ShimmerBar accentColor={accentColor} className="h-4 w-full" />
            <ShimmerBar accentColor={accentColor} className="h-4 w-2/5" />
            <ShimmerBar accentColor={accentColor} className="h-4 w-3/4" />
            <ShimmerBar accentColor={accentColor} className="h-4 w-1/2" />
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Card flip container */}
      <div className="image-studio-flip-container flex-1 min-h-0">
        <div className={`image-studio-flip-inner h-full ${flipped ? 'flipped' : ''}`}>

          {/* ═══════ FRONT: Brain Dump Input ═══════ */}
          <div className="image-studio-flip-front p-4 md:p-6 space-y-5 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl" style={{ background: `${accentColor}20`, boxShadow: `inset 0 0 0 1px ${accentColor}33` }}>
                  <Brain className="w-5 h-5" style={{ color: accentColor }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-theme-heading tracking-tight">Brain Dump</h2>
                  <p className="text-xs text-theme-muted">Type or speak your thoughts, turn them into actions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className={`p-2 rounded-2xl text-xs transition-all active:scale-90 ring-1 ${
                    showHelp
                      ? 'text-purple-500 bg-purple-500/15 ring-purple-500/25'
                      : 'text-theme-muted bg-theme-surface ring-theme hover:text-purple-500 hover:bg-purple-500/10 hover:ring-purple-500/20'
                  }`}
                  title="What can Brain Dump do?"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setFlipped(true)}
                  className="group flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all active:scale-95 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 ring-1 ring-amber-500/15 hover:ring-amber-500/30"
                >
                  <StickyNote className="w-3.5 h-3.5" />
                  Saved Notes
                  {entries.length > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20">
                      {entries.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* ─── Help Panel (floating overlay) ─── */}
            {showHelp && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-40" onClick={() => setShowHelp(false)} />
                <div
                  className="absolute left-4 right-4 md:left-6 md:right-6 z-50 rounded-2xl bg-theme-surface ring-1 ring-purple-500/20 overflow-y-auto max-h-[70vh]"
                  style={{
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                    animation: 'helpPanelIn 250ms ease both',
                  }}
                >
                  <style>{`@keyframes helpPanelIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                  {/* Sticky header */}
                  <div className="sticky top-0 z-10 bg-theme-surface border-b border-theme rounded-t-2xl">
                    <div className="flex items-center justify-between px-5 pt-4 pb-2">
                      <h3 className="text-sm font-bold text-theme-heading flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-purple-500" />
                        What can Brain Dump do?
                      </h3>
                      <button
                        onClick={() => setShowHelp(false)}
                        className="p-1.5 rounded-xl text-theme-muted hover:text-theme-label hover:bg-theme-tertiary transition-all active:scale-90"
                      >
                        <XIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="px-5 pb-3 text-xs text-theme-muted leading-relaxed">
                      Type or speak anything — Brain Dump will extract actions and open the right tool with your details pre-filled.
                    </p>
                  </div>
                  {/* Action list */}
                  <div className="px-4 py-3 grid grid-cols-1 gap-1.5">
                    {([
                      { type: 'lesson-plan' as BrainDumpActionType, example: '"Plan a lesson on fractions for grade 4"' },
                      { type: 'quiz' as BrainDumpActionType, example: '"Make a 10-question quiz on volcanoes for grade 6"' },
                      { type: 'rubric' as BrainDumpActionType, example: '"Create a rubric for the science fair project"' },
                      { type: 'worksheet' as BrainDumpActionType, example: '"Make a multiplication worksheet for grade 3"' },
                      { type: 'kindergarten-plan' as BrainDumpActionType, example: '"Plan a shapes lesson for kindergarten"' },
                      { type: 'multigrade-plan' as BrainDumpActionType, example: '"I teach grades 3 & 4 together, need a math lesson"' },
                      { type: 'cross-curricular-plan' as BrainDumpActionType, example: '"Combine science and art for a water cycle lesson"' },
                      { type: 'presentation' as BrainDumpActionType, example: '"Make a slideshow about the solar system"' },
                      { type: 'image-studio' as BrainDumpActionType, example: '"Generate a picture of a volcano for my lesson"' },
                      { type: 'calendar-task' as BrainDumpActionType, example: '"Remind me to submit report cards by Friday"' },
                      { type: 'grade-quiz' as BrainDumpActionType, example: '"I need to grade the grade 4 math quiz"' },
                      { type: 'grade-worksheet' as BrainDumpActionType, example: '"Grade the spelling worksheets from today"' },
                      { type: 'curriculum-browse' as BrainDumpActionType, example: '"Show me the grade 3 science standards"' },
                      { type: 'curriculum-tracker' as BrainDumpActionType, example: '"Mark fractions as completed for grade 5"' },
                      { type: 'class-management' as BrainDumpActionType, example: '"Add a new student named John to grade 4"' },
                      { type: 'attendance' as BrainDumpActionType, example: '"Take attendance for grade 2 today"' },
                    ] as { type: BrainDumpActionType; example: string }[]).map((item, i) => {
                      const meta = ACTION_META[item.type] || ACTION_META['calendar-task'];
                      const MetaIcon = meta.icon;
                      return (
                        <div
                          key={item.type}
                          className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-theme-tertiary/60 transition-all"
                          style={{
                            animation: `helpItemIn 300ms ease ${i * 30}ms both`,
                          }}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 bg-${meta.color}-500/12`}>
                            <MetaIcon className={`w-3.5 h-3.5 text-${meta.color}-500`} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-theme-heading">{meta.label}</span>
                            <p className="text-[11px] text-theme-muted leading-relaxed mt-0.5 italic">{item.example}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Tip */}
                  <div className="sticky bottom-0 px-5 py-3 border-t border-theme text-[11px] text-theme-muted bg-purple-500/[0.03] rounded-b-2xl">
                    <strong className="text-purple-500">Tip:</strong> You can mention multiple things at once and Brain Dump will split them into separate action cards.
                  </div>
                  <style>{`@keyframes helpItemIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                </div>
              </>
            )}

            {/* Main content area */}
            <div className="space-y-4 pb-4">

              {/* ─── Input Mode: show text editor + buttons when no actions yet ─── */}
              {actions.length === 0 && (
                <>
                  {/* Skeleton Loading State */}
                  {showSkeleton ? (
                    <div
                      className="rounded-2xl bg-theme-surface ring-1 ring-black/[0.04] dark:ring-white/[0.06] overflow-hidden transition-all duration-500 ease-in-out"
                      style={{
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        maxHeight: skeletonExpanded ? '720px' : '560px',
                        opacity: 1,
                      }}
                    >
                      <div className="p-6 space-y-5">
                        {/* Skeleton header bar */}
                        <div className="flex items-center gap-3">
                          <ShimmerBar accentColor={accentColor} className="w-10 h-10 rounded-xl" />
                          <div className="space-y-2 flex-1">
                            <ShimmerBar accentColor={accentColor} className="h-4 w-2/5" />
                            <ShimmerBar accentColor={accentColor} className="h-3 w-1/4" animationDelay="150ms" />
                          </div>
                        </div>
                        {/* Skeleton text lines */}
                        <div className="space-y-3">
                          <ShimmerBar accentColor={accentColor} className="h-3 w-full" animationDelay="100ms" />
                          <ShimmerBar accentColor={accentColor} className="h-3 w-11/12" animationDelay="200ms" />
                          <ShimmerBar accentColor={accentColor} className="h-3 w-4/5" animationDelay="300ms" />
                          <ShimmerBar accentColor={accentColor} className="h-3 w-9/12" animationDelay="400ms" />
                          <ShimmerBar accentColor={accentColor} className="h-3 w-full" animationDelay="500ms" />
                          <ShimmerBar accentColor={accentColor} className="h-3 w-3/5" animationDelay="600ms" />
                        </div>
                        {/* Skeleton action cards */}
                        <div className="space-y-3 pt-2">
                          {[0, 1, 2].map(i => (
                            <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl" style={{ background: `${accentColor}08` }}>
                              <ShimmerBar accentColor={accentColor} className="w-9 h-9 rounded-xl" />
                              <div className="flex-1 space-y-2">
                                <ShimmerBar accentColor={accentColor} className="h-3 w-1/3" />
                                <ShimmerBar accentColor={accentColor} className="h-2.5 w-2/3" />
                              </div>
                              <div className="flex gap-1.5">
                                <ShimmerBar accentColor={accentColor} className="w-8 h-8 rounded-xl" />
                                <ShimmerBar accentColor={accentColor} className="w-8 h-8 rounded-xl" />
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Extra skeleton rows when expanded to cover tools area */}
                        <div
                          className="space-y-3 overflow-hidden transition-all duration-500 ease-in-out"
                          style={{ maxHeight: skeletonExpanded ? '200px' : '0px', opacity: skeletonExpanded ? 1 : 0 }}
                        >
                          {[3, 4].map(i => (
                            <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl" style={{ background: `${accentColor}08` }}>
                              <ShimmerBar accentColor={accentColor} className="w-9 h-9 rounded-xl" />
                              <div className="flex-1 space-y-2">
                                <ShimmerBar accentColor={accentColor} className="h-3 w-2/5" />
                                <ShimmerBar accentColor={accentColor} className="h-2.5 w-1/2" />
                              </div>
                              <div className="flex gap-1.5">
                                <ShimmerBar accentColor={accentColor} className="w-8 h-8 rounded-xl" />
                                <ShimmerBar accentColor={accentColor} className="w-8 h-8 rounded-xl" />
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Analyzing status */}
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <HeartbeatLoader className="w-5 h-5" />
                          <span className="text-xs font-semibold text-theme-muted">
                            {localLoadingMap[tabId] && !isStreaming ? 'Queued — waiting...' : t('brainDump.processing')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : showReviewSets ? (
                    <ReviewSetsPanel
                      taskSets={taskSets}
                      onUpdateSets={setTaskSets}
                      onConfirm={handleGenerateAllSets}
                      onCancel={() => setShowReviewSets(false)}
                      accentColor={accentColor}
                    />
                  ) : (
                    <>
                      {/* Text Input Area with Rich Text Toolbar */}
                      <div className={`flex rounded-2xl bg-theme-surface ring-1 ring-black/[0.04] dark:ring-white/[0.06] overflow-hidden transition-all ${activeTool ? 'max-h-[60px]' : ''}`}
                        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                        {/* Content-editable editor */}
                        <div className="flex-1 relative">
                          <div
                            ref={editorRef}
                            contentEditable={!loading}
                            suppressContentEditableWarning
                            onInput={() => { if (editorRef.current) setDumpText(editorRef.current.innerHTML); }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
                              document.execCommand('insertHTML', false, text);
                              if (editorRef.current) setDumpText(editorRef.current.innerHTML);
                            }}
                            data-placeholder={t('brainDump.placeholder')}
                            className={`rich-text w-full h-full bg-transparent p-4 text-sm text-theme-label focus:outline-none transition-all overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-theme-hint empty:before:pointer-events-none ${activeTool ? 'min-h-[60px] max-h-[60px]' : 'min-h-[480px]'}`}
                            style={{ wordBreak: 'break-word' }}
                          />
                          {/* Live transcript overlay */}
                          {isListening && interimText && (
                            <div className="absolute bottom-16 left-3 right-3 pointer-events-none">
                              <div className="bg-theme-bg-secondary/90 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-red-500/20 shadow-lg">
                                <p className="text-sm text-theme-label/80 italic leading-relaxed">
                                  {interimText}
                                  <span className="inline-block w-0.5 h-4 bg-red-500 ml-0.5 align-middle animate-pulse" />
                                </p>
                              </div>
                            </div>
                          )}
                          {/* Mic button */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                            <button
                              onClick={toggleListening}
                              className={`p-3.5 rounded-2xl transition-all active:scale-90 ${
                                isListening
                                  ? 'bg-red-500/20 text-red-500 ring-2 ring-red-500/40 animate-pulse shadow-lg shadow-red-500/20'
                                  : 'bg-red-500/12 text-red-500 hover:bg-red-500/20 ring-1 ring-red-500/20 hover:ring-red-500/30'
                              }`}
                              title={isListening ? 'Stop listening' : 'Start voice input'}
                            >
                              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                          </div>
                          {/* Character count badge */}
                          {charCount > 0 && (
                            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium transition-all ${
                              needsSplitting
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20'
                                : charCount > tierCharLimit * 0.8
                                ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                : 'bg-theme-tertiary text-theme-muted'
                            }`}>
                              {charCount.toLocaleString()} / {tierCharLimit.toLocaleString()}
                              {needsSplitting && (
                                <span className="ml-1.5 text-amber-500">
                                  · {estimatedSets} sets
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {/* Rich Text Toolbar — expandable right panel */}
                        {!activeTool && (
                          <div className="flex">
                            {/* Toggle strip */}
                            <button
                              onClick={() => setShowToolbar(!showToolbar)}
                              className="flex items-center justify-center w-8 border-l transition-all"
                              style={{
                                borderColor: showToolbar ? `${accentColor}33` : undefined,
                                background: showToolbar ? `${accentColor}0d` : undefined,
                              }}
                              title={showToolbar ? 'Hide formatting' : 'Show formatting'}
                            >
                              {showToolbar ? (
                                <ChevronRight className="w-4 h-4" style={{ color: accentColor }} />
                              ) : (
                                <Type className="w-4 h-4 text-theme-hint" />
                              )}
                            </button>
                            {/* Toolbar icons */}
                            {showToolbar && (
                              <div
                                className="flex flex-col items-center gap-1 p-2 border-l overflow-y-auto"
                                style={{ borderColor: `${accentColor}26`, background: `${accentColor}0a` }}
                              >
                                {([
                                  { iconData: TextBoldIconData,          tip: 'Bold',          cmd: 'bold' },
                                  { iconData: TextItalicIconData,        tip: 'Italic',        cmd: 'italic' },
                                  { iconData: TextUnderlineIconData,     tip: 'Underline',     cmd: 'underline' },
                                  { iconData: TextStrikethroughIconData, tip: 'Strikethrough', cmd: 'strikeThrough' },
                                  { divider: true },
                                  { iconData: Heading01IconData,      tip: 'Heading 1',     cmd: 'formatBlock', value: '<h1>' },
                                  { iconData: Heading02IconData,      tip: 'Heading 2',     cmd: 'formatBlock', value: '<h2>' },
                                  { divider: true },
                                  { iconData: LeftToRightListBulletIconData, tip: 'Bullet list',   cmd: 'insertUnorderedList' },
                                  { iconData: LeftToRightListNumberIconData, tip: 'Numbered list', cmd: 'insertOrderedList' },
                                  { iconData: QuoteDownIconData,         tip: 'Quote',         cmd: 'formatBlock', value: '<blockquote>' },
                                  { divider: true },
                                  { iconData: Link01IconData,          tip: 'Link',          cmd: 'createLink', prompt: true },
                                  { iconData: MinusSignIconData,       tip: 'Divider',       cmd: 'insertHorizontalRule' },
                                ] as Array<{ iconData?: any; tip?: string; cmd?: string; value?: string; prompt?: boolean; divider?: boolean }>).map((item, i) => {
                                  if (item.divider) {
                                    return <div key={`d-${i}`} className="w-7 h-px my-0.5" style={{ background: `${accentColor}1a` }} />;
                                  }
                                  return (
                                    <button
                                      key={item.tip}
                                      title={item.tip}
                                      tabIndex={-1}
                                      onMouseDown={(e) => e.preventDefault()}
                                      onClick={() => {
                                        if (item.prompt) {
                                          const url = window.prompt('Enter URL:');
                                          if (url) execFormat(item.cmd!, url);
                                        } else {
                                          execFormat(item.cmd!, item.value);
                                        }
                                      }}
                                      className="p-2 rounded-xl text-theme-muted transition-all active:scale-90 hover:shadow-sm"
                                      onMouseEnter={(e) => { e.currentTarget.style.color = accentColor; e.currentTarget.style.background = `${accentColor}1f`; }}
                                      onMouseLeave={(e) => { e.currentTarget.style.color = ''; e.currentTarget.style.background = ''; }}
                                    >
                                      <HugeiconsIcon icon={item.iconData!} size={18} strokeWidth={2} />
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons Row */}
                      <div className="flex gap-2">
                        <button
                          onClick={handleAnalyze}
                          disabled={!hasContent || loading}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                        >
                          {needsSplitting ? <Layers className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                          {needsSplitting ? `Review ${estimatedSets} Sets` : t('brainDump.turnIntoActions')}
                        </button>
                        <button
                          onClick={handleSaveTextAsNote}
                          disabled={!hasContent || loading}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed bg-amber-500/12 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 ring-1 ring-amber-500/20 hover:ring-amber-500/35"
                          title="Save as note without analyzing"
                        >
                          <Save className="w-4 h-4" />
                          {t('common.save')}
                        </button>
                      </div>

                      {/* Error message */}
                      {analysisError && (
                        <div className="p-3.5 rounded-2xl bg-red-500/8 ring-1 ring-red-500/15 text-red-600 dark:text-red-400 text-sm">
                          {analysisError}
                        </div>
                      )}
                    </>
                  )}

                  {/* ─── Quick Tools ─── */}
                  <div className={`pt-2 transition-all duration-500 ease-in-out ${skeletonExpanded ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-[500px] opacity-100'}`}>
                    <h3 className="text-[11px] font-bold text-theme-hint uppercase tracking-widest mb-3">Quick Tools</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {quickTools.map(tool => {
                        const isActive = activeTool === tool.id;
                        return (
                          <button
                            key={tool.id}
                            onClick={() => setActiveTool(isActive ? null : tool.id)}
                            className={`group flex flex-col items-center gap-2 p-3.5 rounded-2xl text-xs font-semibold transition-all active:scale-95 ${
                              isActive
                                ? 'bg-purple-500/15 text-purple-500 ring-1 ring-purple-500/25 shadow-lg shadow-purple-500/10'
                                : `${tool.bg} ${tool.color} ring-1 ring-transparent hover:ring-current/10`
                            }`}
                          >
                            <tool.icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                            {tool.label}
                          </button>
                        );
                      })}
                    </div>
                    {activeTool && (
                      <div className="mt-3 p-5 rounded-2xl bg-theme-surface ring-1 ring-theme" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                        {activeTool === 'calculator' && <MiniCalculator />}
                        {activeTool === 'stopwatch' && <MiniStopwatch />}
                        {activeTool === 'timer' && <MiniTimer />}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ─── Results Mode: show suggested actions when generated ─── */}
              {actions.length > 0 && !showSkeleton && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-theme-heading flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-purple-500" />
                      Suggested Actions
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-500">
                        {actions.length}
                      </span>
                    </h3>
                    <div className="flex items-center gap-2">
                      {(hasContent || actions.some(a => a.status !== 'pending')) && (
                        <button
                          onClick={handleSaveToNotes}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 ring-1 ring-amber-500/15 transition-all active:scale-95"
                        >
                          <StickyNote className="w-3 h-3" />
                          Save All to Notes
                        </button>
                      )}
                      <button
                        onClick={() => { setActions([]); setSuggestions([]); setShowSuggestions(false); setRevealActions(false); setVisibleActionCount(0); setSetResults(new Map()); setTaskSets([]); setTotalSetsToGenerate(0); setCurrentSetProcessing(-1); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 ring-1 ring-purple-500/15 transition-all active:scale-95"
                      >
                        <Brain className="w-3 h-3" />
                        New Dump
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Multi-set mode: render with set dividers */}
                    {setResults.size > 1 ? (
                      <>
                        {Array.from(setResults.entries())
                          .sort(([a], [b]) => a - b)
                          .map(([setIdx, setActions]) => (
                          <React.Fragment key={`set-${setIdx}`}>
                            {/* Set divider header */}
                            <div className="flex items-center gap-2 pt-2 pb-1">
                              <div className="flex-1 h-px" style={{ background: `${accentColor}25` }} />
                              <span className="text-[10px] font-bold uppercase tracking-widest px-2" style={{ color: accentColor }}>
                                Set {setIdx + 1}
                              </span>
                              <div className="flex-1 h-px" style={{ background: `${accentColor}25` }} />
                            </div>
                            {/* Actions for this set */}
                            {setActions.map((action) => {
                              const meta = ACTION_META[action.type] || ACTION_META['calendar-task'];
                              const ActionIcon = meta.icon;
                              const isAccepted = action.status === 'accepted';
                              const isDenied = action.status === 'denied';
                              return (
                                <div
                                  key={action.id}
                                  className={`flex items-start gap-3 p-3.5 rounded-2xl ${
                                    isAccepted ? 'bg-green-500/8 ring-1 ring-green-500/20' :
                                    isDenied ? 'bg-theme-tertiary opacity-50 ring-1 ring-transparent' :
                                    'bg-theme-surface ring-1 ring-theme hover:ring-purple-400/30'
                                  }`}
                                  style={!isAccepted && !isDenied ? { boxShadow: '0 2px 8px rgba(0,0,0,0.03)' } : {}}
                                >
                                  <div className={`p-2 rounded-xl shrink-0 bg-${meta.color}-500/12`}>
                                    <ActionIcon className={`w-4 h-4 text-${meta.color}-500`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">{meta.label}</span>
                                      {action.priority === 'urgent' && <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-full">🔴 URGENT</span>}
                                      {action.priority === 'high' && <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full">🟡 High</span>}
                                      {isAccepted && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full"><Check className="w-2.5 h-2.5" /> Done</span>}
                                      {isDenied && <span className="text-[10px] text-theme-hint line-through">Declined</span>}
                                    </div>
                                    <p className="text-sm font-semibold text-theme-heading mt-1">{action.title}</p>
                                    {action.description && <p className="text-xs text-theme-muted mt-0.5 leading-relaxed">{action.description}</p>}
                                    {action.details && Object.keys(action.details).length > 0 && (
                                      <div className="flex flex-wrap gap-1.5 mt-2">
                                        {Object.entries(action.details).map(([key, val]) => (
                                          <span key={key} className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-medium bg-theme-tertiary text-theme-muted">{key}: {String(val)}</span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  {action.status === 'pending' && (
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button onClick={() => handleAccept(action.id)} className="p-2 rounded-xl bg-green-500/12 text-green-500 hover:bg-green-500/25 transition-all active:scale-90" title="Accept"><Check className="w-4 h-4" /></button>
                                      <button onClick={() => handleDeny(action.id)} className="p-2 rounded-xl bg-red-500/12 text-red-500 hover:bg-red-500/25 transition-all active:scale-90" title="Decline"><XIcon className="w-4 h-4" /></button>
                                    </div>
                                  )}
                                  {isAccepted && action.type !== 'calendar-task' && (
                                    <button onClick={() => { const tabType = ACTION_TO_TAB[action.type]; if (tabType && onCreateTab) onCreateTab(tabType, action.details); }} className="p-2 rounded-xl bg-blue-500/12 text-blue-500 hover:bg-blue-500/25 transition-all active:scale-90 shrink-0" title="Open tool"><ExternalLink className="w-4 h-4" /></button>
                                  )}
                                </div>
                              );
                            })}
                          </React.Fragment>
                        ))}
                        {/* Show progress indicator if still generating sets */}
                        {currentSetProcessing >= 0 && currentSetProcessing < totalSetsToGenerate && (
                          <div className="flex items-center gap-2 py-2 text-xs" style={{ color: accentColor }}>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Processing Set {currentSetProcessing + 1} of {totalSetsToGenerate}...
                          </div>
                        )}
                      </>
                    ) : (
                      /* Single-set (normal) mode */
                      actions.map((action, actionIndex) => {
                        const meta = ACTION_META[action.type] || ACTION_META['calendar-task'];
                        const ActionIcon = meta.icon;
                        const isAccepted = action.status === 'accepted';
                        const isDenied = action.status === 'denied';
                        const isVisible = !revealActions || actionIndex < visibleActionCount;

                        return (
                          <div
                            key={action.id}
                            className={`flex items-start gap-3 p-3.5 rounded-2xl ${
                              isAccepted ? 'bg-green-500/8 ring-1 ring-green-500/20' :
                              isDenied ? 'bg-theme-tertiary opacity-50 ring-1 ring-transparent' :
                              'bg-theme-surface ring-1 ring-theme hover:ring-purple-400/30'
                            }`}
                            style={{
                              ...(!isAccepted && !isDenied ? { boxShadow: '0 2px 8px rgba(0,0,0,0.03)' } : {}),
                              opacity: isVisible ? 1 : 0,
                              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                              transition: 'opacity 300ms ease, transform 300ms ease, background-color 200ms ease, box-shadow 200ms ease',
                            }}
                          >
                            <div className={`p-2 rounded-xl shrink-0 bg-${meta.color}-500/12`}>
                              <ActionIcon className={`w-4 h-4 text-${meta.color}-500`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">{meta.label}</span>
                                {action.priority === 'urgent' && <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-full">🔴 URGENT</span>}
                                {action.priority === 'high' && <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full">🟡 High</span>}
                                {isAccepted && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full"><Check className="w-2.5 h-2.5" /> Done</span>}
                                {isDenied && <span className="text-[10px] text-theme-hint line-through">Declined</span>}
                              </div>
                              <p className="text-sm font-semibold text-theme-heading mt-1">{action.title}</p>
                              {action.description && <p className="text-xs text-theme-muted mt-0.5 leading-relaxed">{action.description}</p>}
                              {action.details && Object.keys(action.details).length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {Object.entries(action.details).map(([key, val]) => (
                                    <span key={key} className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-medium bg-theme-tertiary text-theme-muted">{key}: {String(val)}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            {action.status === 'pending' && (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button onClick={() => handleAccept(action.id)} className="p-2 rounded-xl bg-green-500/12 text-green-500 hover:bg-green-500/25 transition-all active:scale-90" title="Accept"><Check className="w-4 h-4" /></button>
                                <button onClick={() => handleDeny(action.id)} className="p-2 rounded-xl bg-red-500/12 text-red-500 hover:bg-red-500/25 transition-all active:scale-90" title="Decline"><XIcon className="w-4 h-4" /></button>
                              </div>
                            )}
                            {isAccepted && action.type !== 'calendar-task' && (
                              <button onClick={() => { const tabType = ACTION_TO_TAB[action.type]; if (tabType && onCreateTab) onCreateTab(tabType, action.details); }} className="p-2 rounded-xl bg-blue-500/12 text-blue-500 hover:bg-blue-500/25 transition-all active:scale-90 shrink-0" title="Open tool"><ExternalLink className="w-4 h-4" /></button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* ─── Follow-Up: conversational clarification for unmatched text ─── */}
                  {showSuggestions && suggestions.filter(s => s.status !== 'dismissed').length > 0 && (
                    <div className="mt-4 space-y-3">
                      {/* Conversational header — adapts based on whether any actions were found */}
                      <div className="p-3 rounded-2xl bg-amber-500/8 ring-1 ring-amber-500/15">
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 rounded-xl bg-amber-500/15 shrink-0 mt-0.5">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                              {actions.length === 0
                                ? "I had trouble understanding your notes. Can you help me figure these out?"
                                : "I wasn't sure about a few things — did you mean one of these?"}
                            </p>
                            <p className="text-[10px] text-theme-muted mt-0.5">
                              Pick the action that best matches what you meant, or skip if it's not a task.
                            </p>
                          </div>
                        </div>
                      </div>

                      {suggestions.filter(s => s.status !== 'dismissed').map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className={`rounded-2xl ring-1 overflow-hidden transition-all ${
                            suggestion.status === 'generated'
                              ? 'bg-green-500/8 ring-green-500/20'
                              : suggestion.status === 'generating'
                              ? 'bg-amber-500/8 ring-amber-500/20'
                              : 'bg-theme-surface ring-theme hover:ring-amber-400/30'
                          }`}
                          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
                        >
                          {/* The unmatched text quote */}
                          <div className="px-4 pt-3 pb-2">
                            <p className="text-xs text-theme-muted italic leading-relaxed">"{suggestion.text}"</p>
                          </div>

                          {suggestion.status === 'generating' && (
                            <div className="flex items-center gap-2 px-4 pb-3 text-xs text-amber-500">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Creating action...
                            </div>
                          )}

                          {suggestion.status === 'generated' && (
                            <div className="flex items-center gap-2 px-4 pb-3 text-xs text-green-500">
                              <Check className="w-3 h-3" />
                              Action added above
                            </div>
                          )}

                          {suggestion.status === 'pending' && (
                            <div className="border-t border-theme">
                              <p className="px-4 pt-2.5 pb-1.5 text-[10px] font-semibold text-theme-hint uppercase tracking-widest">
                                Did you mean...
                              </p>
                              <div className="px-2 pb-2 space-y-1">
                                {suggestion.suggestedTypes.map((actionType) => {
                                  const meta = ACTION_META[actionType] || ACTION_META['calendar-task'];
                                  const TypeIcon = meta.icon;
                                  return (
                                    <button
                                      key={actionType}
                                      onClick={() => handleSuggestionSelect(suggestion.id, actionType)}
                                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all active:scale-[0.98] hover:bg-${meta.color}-500/8 group`}
                                    >
                                      <div className={`p-1.5 rounded-lg bg-${meta.color}-500/12 shrink-0`}>
                                        <TypeIcon className={`w-3.5 h-3.5 text-${meta.color}-500`} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <span className={`text-xs font-semibold text-${meta.color}-600 dark:text-${meta.color}-400`}>
                                          {meta.label}
                                        </span>
                                      </div>
                                      <span className="text-[10px] text-theme-hint group-hover:text-theme-muted transition-colors">
                                        Yes, this one
                                      </span>
                                    </button>
                                  );
                                })}
                                {/* Skip option */}
                                <button
                                  onClick={() => handleSuggestionDismiss(suggestion.id)}
                                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all active:scale-[0.98] hover:bg-theme-tertiary group"
                                >
                                  <div className="p-1.5 rounded-lg bg-theme-tertiary shrink-0">
                                    <XIcon className="w-3.5 h-3.5 text-theme-hint" />
                                  </div>
                                  <span className="text-xs text-theme-hint group-hover:text-theme-muted">
                                    Skip — not a task
                                  </span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {isSuggestLoading && (
                        <div className="flex items-center gap-2 p-3 text-xs text-theme-muted">
                          <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                          Figuring out what you meant...
                        </div>
                      )}
                    </div>
                  )}

                  {isSuggestLoading && !showSuggestions && (
                    <div className="mt-4 flex items-center gap-2 p-3.5 rounded-2xl bg-amber-500/8 ring-1 ring-amber-500/15 text-xs text-amber-600 dark:text-amber-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      {actions.length === 0 ? 'Trying to understand your notes...' : 'Checking for anything I missed...'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ═══════ BACK: Saved Notes ═══════ */}
          <div className="image-studio-flip-back p-4 md:p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 ring-1 ring-amber-500/20">
                  <StickyNote className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-theme-heading tracking-tight">Saved Notes</h2>
                  <p className="text-xs text-theme-muted">
                    {entries.length} saved note{entries.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFlipped(false)}
                className="group flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all active:scale-95 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 ring-1 ring-purple-500/15 hover:ring-purple-500/30"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                Brain Dump
              </button>
            </div>

            {/* Notes list */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pb-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-theme-hint">
                  <div className="p-4 rounded-3xl bg-amber-500/8 mb-4">
                    <StickyNote className="w-10 h-10 text-amber-400/50" />
                  </div>
                  <p className="text-sm font-medium">No saved notes yet</p>
                  <p className="text-xs mt-1 text-theme-hint">Brain dump something and save it to see it here</p>
                </div>
              ) : (
                entries.map(entry => {
                  const isExpanded = expandedEntry === entry.id;
                  return (
                    <div
                      key={entry.id}
                      className={`rounded-2xl bg-theme-surface ring-1 overflow-hidden transition-all ${
                        isExpanded ? 'ring-purple-400/30 shadow-lg shadow-purple-500/5' : 'ring-theme hover:ring-theme'
                      }`}
                      style={!isExpanded ? { boxShadow: '0 2px 8px rgba(0,0,0,0.03)' } : undefined}
                    >
                      <div
                        onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                        className="w-full flex items-center justify-between p-3.5 text-left hover:bg-theme-hover/50 transition-colors cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedEntry(isExpanded ? null : entry.id); } }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-theme-heading truncate">
                            {(() => { const plain = stripHtml(entry.text); return plain.slice(0, 100) + (plain.length > 100 ? '...' : ''); })()}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-theme-hint font-medium">
                              {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {entry.actions.length > 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/12 text-purple-500">
                                {entry.actions.length} action{entry.actions.length !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteEntry(entry.id); }}
                            className="p-1.5 rounded-xl text-theme-hint hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className={`p-1 rounded-lg transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown className="w-4 h-4 text-theme-hint" />
                          </div>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-3 border-t border-theme/50">
                          {/* Note text — editable or read-only */}
                          {editingEntry === entry.id ? (
                            <div className="mt-3 space-y-2">
                              {/* Edit toolbar */}
                              <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl" style={{ background: `${accentColor}0a` }}>
                                {([
                                  { iconData: TextBoldIconData,          tip: 'Bold',          cmd: 'bold' },
                                  { iconData: TextItalicIconData,        tip: 'Italic',        cmd: 'italic' },
                                  { iconData: TextUnderlineIconData,     tip: 'Underline',     cmd: 'underline' },
                                  { iconData: TextStrikethroughIconData, tip: 'Strikethrough', cmd: 'strikeThrough' },
                                  { divider: true },
                                  { iconData: Heading01IconData,      tip: 'Heading 1',     cmd: 'formatBlock', value: '<h1>' },
                                  { iconData: Heading02IconData,      tip: 'Heading 2',     cmd: 'formatBlock', value: '<h2>' },
                                  { divider: true },
                                  { iconData: LeftToRightListBulletIconData, tip: 'Bullet list',   cmd: 'insertUnorderedList' },
                                  { iconData: LeftToRightListNumberIconData, tip: 'Numbered list', cmd: 'insertOrderedList' },
                                  { iconData: QuoteDownIconData,         tip: 'Quote',         cmd: 'formatBlock', value: '<blockquote>' },
                                  { divider: true },
                                  { iconData: Link01IconData,          tip: 'Link',          cmd: 'createLink', prompt: true },
                                  { iconData: MinusSignIconData,       tip: 'Divider',       cmd: 'insertHorizontalRule' },
                                ] as Array<{ iconData?: any; tip?: string; cmd?: string; value?: string; prompt?: boolean; divider?: boolean }>).map((item, i) => {
                                  if (item.divider) {
                                    return <div key={`ed-${i}`} className="w-px h-5 mx-0.5" style={{ background: `${accentColor}20` }} />;
                                  }
                                  return (
                                    <button
                                      key={item.tip}
                                      title={item.tip}
                                      tabIndex={-1}
                                      onMouseDown={(e) => e.preventDefault()}
                                      onClick={() => {
                                        if (item.prompt) {
                                          const url = window.prompt('Enter URL:');
                                          if (url) execEditFormat(item.cmd!, url);
                                        } else {
                                          execEditFormat(item.cmd!, item.value);
                                        }
                                      }}
                                      className="p-1.5 rounded-lg text-theme-muted transition-all active:scale-90"
                                      onMouseEnter={(e) => { e.currentTarget.style.color = accentColor; e.currentTarget.style.background = `${accentColor}1f`; }}
                                      onMouseLeave={(e) => { e.currentTarget.style.color = ''; e.currentTarget.style.background = ''; }}
                                    >
                                      <HugeiconsIcon icon={item.iconData!} size={14} strokeWidth={2} />
                                    </button>
                                  );
                                })}
                              </div>
                              {/* Edit contentEditable */}
                              <div
                                ref={editEditorRef}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={() => { if (editEditorRef.current) setEditText(editEditorRef.current.innerHTML); }}
                                className="rich-text w-full rounded-xl border-2 bg-theme-surface p-3 text-sm text-theme-label focus:outline-none transition-all min-h-[80px]"
                                style={{ borderColor: `${accentColor}66` }}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveEdit(entry.id)}
                                  disabled={!editText.trim()}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-green-500/12 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-all active:scale-95 disabled:opacity-40"
                                >
                                  <Check className="w-3 h-3" />
                                  {t('common.save')}
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-theme-tertiary text-theme-muted hover:bg-theme-hover transition-all active:scale-95"
                                >
                                  <XIcon className="w-3 h-3" />
                                  {t('common.cancel')}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="rich-text text-sm text-theme-label mt-3 leading-relaxed max-w-none"
                              dangerouslySetInnerHTML={{ __html: entry.text }}
                            />
                          )}
                          {entry.actions.length > 0 && (
                            <div className="space-y-1.5 mt-3">
                              <p className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">Actions</p>
                              {entry.actions.map(action => {
                                const meta = ACTION_META[action.type] || ACTION_META['calendar-task'];
                                return (
                                  <div key={action.id} className="flex items-center gap-2.5 py-1.5 text-xs text-theme-muted">
                                    <span className={`w-2 h-2 rounded-full ring-2 ${
                                      action.status === 'accepted' ? 'bg-green-500 ring-green-500/20' :
                                      action.status === 'denied' ? 'bg-red-400 ring-red-400/20' : 'bg-amber-400 ring-amber-400/20'
                                    }`} />
                                    <span className="font-semibold">{meta.label}:</span>
                                    <span className="flex-1">{action.title}</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize ${
                                      action.status === 'accepted' ? 'bg-green-500/10 text-green-500' :
                                      action.status === 'denied' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                      {action.status}
                                    </span>
                                    {action.status !== 'denied' && action.type !== 'calendar-task' && (
                                      <button
                                        onClick={() => {
                                          const tabType = ACTION_TO_TAB[action.type];
                                          if (tabType && onCreateTab) onCreateTab(tabType, action.details);
                                        }}
                                        className="p-1.5 rounded-lg bg-blue-500/12 text-blue-500 hover:bg-blue-500/25 transition-all active:scale-90 shrink-0"
                                        title="Open tool"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {/* Action buttons */}
                          <div className="flex gap-2 mt-2">
                            {editingEntry !== entry.id && (
                              <button
                                onClick={() => handleStartEdit(entry)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-500/12 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all active:scale-95"
                              >
                                <Pencil className="w-3 h-3" />
                                Edit
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setDumpText(entry.text);
                                if (editorRef.current) editorRef.current.innerHTML = entry.text;
                                setFlipped(false);
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-500/12 text-purple-500 hover:bg-purple-500/20 transition-all active:scale-95"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Re-analyze
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
      <AIDisclaimer />
    </div>
  );
};

export default BrainDump;
