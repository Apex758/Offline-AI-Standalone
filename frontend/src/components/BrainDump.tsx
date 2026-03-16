import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import BrainIconData from '@hugeicons/core-free-icons/BrainIcon';
import Mic01IconData from '@hugeicons/core-free-icons/Mic01Icon';
import MicOff01IconData from '@hugeicons/core-free-icons/MicOff01Icon';
import SparklesIconData from '@hugeicons/core-free-icons/SparklesIcon';
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
import { useSTT } from '../hooks/useVoice';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useSettings } from '../contexts/SettingsContext';
import type { BrainDumpAction, BrainDumpEntry, BrainDumpActionType } from '../types/brainDump';

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
const Sparkles: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SparklesIconData} {...p} />;
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

interface BrainDumpProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  onCreateTab?: (type: string, data?: any) => void;
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
  const editorRef = useRef<HTMLDivElement>(null);
  const editEditorRef = useRef<HTMLDivElement>(null);
  const accumulatedRef = useRef('');

  const { settings } = useSettings();
  const accentColor = settings.tabColors['brain-dump'] ?? '#a855f7';

  const { getConnection } = useWebSocket();
  const WS_ENDPOINT = '/ws/brain-dump';

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
    (interim) => setInterimText(interim)
  );

  // Helper to get plain text from editor
  const getPlainText = useCallback(() => {
    if (!editorRef.current) return '';
    return editorRef.current.innerText.trim();
  }, []);

  // Exec command helper for toolbar
  const execFormat = useCallback((command: string, value?: string) => {
    // Restore focus without losing selection (onMouseDown preventDefault keeps it)
    const sel = window.getSelection();
    const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    editorRef.current?.focus();
    if (range) { sel!.removeAllRanges(); sel!.addRange(range); }
    document.execCommand(command, false, value);
    if (editorRef.current) setDumpText(editorRef.current.innerHTML);
  }, []);

  // Exec command helper for edit toolbar
  const execEditFormat = useCallback((command: string, value?: string) => {
    const sel = window.getSelection();
    const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    editEditorRef.current?.focus();
    if (range) { sel!.removeAllRanges(); sel!.addRange(range); }
    document.execCommand(command, false, value);
    if (editEditorRef.current) setEditText(editEditorRef.current.innerHTML);
  }, []);

  // Parse the AI response into actions
  const parseActions = useCallback((raw: string): BrainDumpAction[] => {
    try {
      let parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) parsed = parsed.actions || parsed.items || [parsed];
      return parsed.map((a: any, i: number) => ({
        id: `action-${Date.now()}-${i}`,
        type: a.type || 'calendar-task',
        title: a.title || 'Untitled Task',
        description: a.description || '',
        details: a.details || a.suggestedData || {},
        status: 'pending' as const,
      }));
    } catch {
      const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || raw.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const extracted = jsonMatch[1] || jsonMatch[0];
          let parsed = JSON.parse(extracted);
          if (!Array.isArray(parsed)) parsed = [parsed];
          return parsed.map((a: any, i: number) => ({
            id: `action-${Date.now()}-${i}`,
            type: a.type || 'calendar-task',
            title: a.title || 'Untitled Task',
            description: a.description || '',
            details: a.details || a.suggestedData || {},
            status: 'pending' as const,
          }));
        } catch { /* fall through */ }
      }
      return [];
    }
  }, []);

  // Analyze brain dump via WebSocket
  const handleAnalyze = useCallback(() => {
    const text = getPlainText();
    if (!text || isAnalyzing) return;

    setIsAnalyzing(true);
    setActions([]);
    setAnalysisError(null);
    accumulatedRef.current = '';

    const ws = getConnection(tabId, WS_ENDPOINT);

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'token') {
          accumulatedRef.current += data.content;
        } else if (data.type === 'done') {
          const parsed = parseActions(accumulatedRef.current);
          if (parsed.length === 0) {
            setAnalysisError('Could not extract actions. Try being more specific about what you need (e.g., "make a quiz on fractions for grade 3").');
          }
          setActions(parsed);
          setIsAnalyzing(false);
          ws.removeEventListener('message', handleMessage);
        } else if (data.type === 'error') {
          setAnalysisError(data.message || 'Analysis failed. Please try again.');
          setIsAnalyzing(false);
          ws.removeEventListener('message', handleMessage);
        }
      } catch { /* ignore parse errors on individual messages */ }
    };

    ws.addEventListener('message', handleMessage);
    ws.send(JSON.stringify({
      text,
      jobId: `brain-dump-${Date.now()}`,
      generationMode: 'queued',
    }));
  }, [getPlainText, isAnalyzing, tabId, getConnection, parseActions]);

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

  return (
    <div className="h-full overflow-hidden">
      {/* Card flip container */}
      <div className="image-studio-flip-container h-full">
        <div className={`image-studio-flip-inner h-full ${flipped ? 'flipped' : ''}`}>

          {/* ═══════ FRONT: Brain Dump Input ═══════ */}
          <div className="image-studio-flip-front p-4 md:p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl" style={{ background: `${accentColor}20`, boxShadow: `inset 0 0 0 1px ${accentColor}33` }}>
                  <Brain className="w-5 h-5" style={{ color: accentColor }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-theme-heading tracking-tight">Brain Dump</h2>
                  <p className="text-xs text-theme-muted">Type or speak your thoughts, let AI turn them into actions</p>
                </div>
              </div>
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

            {/* Main content area - scrollable */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {/* Text Input Area with Rich Text Toolbar */}
              <div className={`flex rounded-2xl bg-theme-surface ring-1 ring-black/[0.04] dark:ring-white/[0.06] overflow-hidden transition-all ${activeTool ? 'max-h-[60px]' : ''}`}
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                {/* Content-editable editor */}
                <div className="flex-1 relative">
                  <div
                    ref={editorRef}
                    contentEditable={!isAnalyzing}
                    suppressContentEditableWarning
                    onInput={() => { if (editorRef.current) setDumpText(editorRef.current.innerHTML); }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
                      document.execCommand('insertHTML', false, text);
                      if (editorRef.current) setDumpText(editorRef.current.innerHTML);
                    }}
                    data-placeholder="What's on your mind? Type your thoughts, ideas, tasks, plans... anything!"
                    className={`w-full h-full bg-transparent p-4 text-sm text-theme-label focus:outline-none transition-all overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-theme-hint empty:before:pointer-events-none ${activeTool ? 'min-h-[60px] max-h-[60px]' : 'min-h-[480px]'}`}
                    style={{ wordBreak: 'break-word' }}
                  />
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
                  disabled={!hasContent || isAnalyzing}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze & Organize
                    </>
                  )}
                </button>
                <button
                  onClick={handleSaveTextAsNote}
                  disabled={!hasContent || isAnalyzing}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed bg-amber-500/12 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 ring-1 ring-amber-500/20 hover:ring-amber-500/35"
                  title="Save as note without analyzing"
                >
                  <Save className="w-4 h-4" />
                  Save Note
                </button>
              </div>

              {/* Error message */}
              {analysisError && (
                <div className="p-3.5 rounded-2xl bg-red-500/8 ring-1 ring-red-500/15 text-red-600 dark:text-red-400 text-sm">
                  {analysisError}
                </div>
              )}

              {/* Action List */}
              {actions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-theme-heading flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      Suggested Actions
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-500">
                        {actions.length}
                      </span>
                    </h3>
                    {(actions.length > 0 && (hasContent || actions.some(a => a.status !== 'pending'))) && (
                      <button
                        onClick={handleSaveToNotes}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 ring-1 ring-amber-500/15 transition-all active:scale-95"
                      >
                        <StickyNote className="w-3 h-3" />
                        Save All to Notes
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {actions.map(action => {
                      const meta = ACTION_META[action.type] || ACTION_META['calendar-task'];
                      const Icon = meta.icon;
                      const isAccepted = action.status === 'accepted';
                      const isDenied = action.status === 'denied';

                      return (
                        <div
                          key={action.id}
                          className={`flex items-start gap-3 p-3.5 rounded-2xl transition-all ${
                            isAccepted ? 'bg-green-500/8 ring-1 ring-green-500/20' :
                            isDenied ? 'bg-theme-tertiary opacity-50 ring-1 ring-transparent' :
                            'bg-theme-surface ring-1 ring-theme hover:ring-purple-400/30'
                          }`}
                          style={!isAccepted && !isDenied ? { boxShadow: '0 2px 8px rgba(0,0,0,0.03)' } : undefined}
                        >
                          <div className={`p-2 rounded-xl shrink-0 bg-${meta.color}-500/12`}>
                            <Icon className={`w-4 h-4 text-${meta.color}-500`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">
                                {meta.label}
                              </span>
                              {isAccepted && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                                  <Check className="w-2.5 h-2.5" /> Done
                                </span>
                              )}
                              {isDenied && <span className="text-[10px] text-theme-hint line-through">Declined</span>}
                            </div>
                            <p className="text-sm font-semibold text-theme-heading mt-1">{action.title}</p>
                            {action.description && (
                              <p className="text-xs text-theme-muted mt-0.5 leading-relaxed">{action.description}</p>
                            )}
                            {action.details && Object.keys(action.details).length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {Object.entries(action.details).map(([key, val]) => (
                                  <span key={key} className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-medium bg-theme-tertiary text-theme-muted">
                                    {key}: {String(val)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {action.status === 'pending' && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleAccept(action.id)}
                                className="p-2 rounded-xl bg-green-500/12 text-green-500 hover:bg-green-500/25 transition-all active:scale-90"
                                title="Accept"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeny(action.id)}
                                className="p-2 rounded-xl bg-red-500/12 text-red-500 hover:bg-red-500/25 transition-all active:scale-90"
                                title="Decline"
                              >
                                <XIcon className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {isAccepted && action.type !== 'calendar-task' && (
                            <button
                              onClick={() => {
                                const tabType = ACTION_TO_TAB[action.type];
                                if (tabType && onCreateTab) onCreateTab(tabType, action.details);
                              }}
                              className="p-2 rounded-xl bg-blue-500/12 text-blue-500 hover:bg-blue-500/25 transition-all active:scale-90 shrink-0"
                              title="Open tool"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ─── Quick Tools ─── */}
              <div className="pt-2">
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
                      <button
                        onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                        className="w-full flex items-center justify-between p-3.5 text-left hover:bg-theme-hover/50 transition-colors"
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
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-3 border-t border-theme/50">
                          {/* Note text — editable or read-only */}
                          {editingEntry === entry.id ? (
                            <div className="mt-3 space-y-2">
                              {/* Edit toolbar */}
                              <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl" style={{ background: `${accentColor}0a` }}>
                                {([
                                  { icon: Bold,          tip: 'Bold',          cmd: 'bold' },
                                  { icon: Italic,        tip: 'Italic',        cmd: 'italic' },
                                  { icon: Underline,     tip: 'Underline',     cmd: 'underline' },
                                  { icon: Strikethrough, tip: 'Strikethrough', cmd: 'strikeThrough' },
                                  { divider: true },
                                  { icon: Heading1,      tip: 'Heading 1',     cmd: 'formatBlock', value: '<h1>' },
                                  { icon: Heading2,      tip: 'Heading 2',     cmd: 'formatBlock', value: '<h2>' },
                                  { divider: true },
                                  { icon: List,          tip: 'Bullet list',   cmd: 'insertUnorderedList' },
                                  { icon: ListOrdered,   tip: 'Numbered list', cmd: 'insertOrderedList' },
                                  { icon: Quote,         tip: 'Quote',         cmd: 'formatBlock', value: '<blockquote>' },
                                  { divider: true },
                                  { icon: Link,          tip: 'Link',          cmd: 'createLink', prompt: true },
                                  { icon: HrIcon,        tip: 'Divider',       cmd: 'insertHorizontalRule' },
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
                                className="w-full rounded-xl border-2 bg-theme-surface p-3 text-sm text-theme-label focus:outline-none transition-all min-h-[80px]"
                                style={{ borderColor: `${accentColor}66` }}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveEdit(entry.id)}
                                  disabled={!editText.trim()}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-green-500/12 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-all active:scale-95 disabled:opacity-40"
                                >
                                  <Check className="w-3 h-3" />
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-theme-tertiary text-theme-muted hover:bg-theme-hover transition-all active:scale-95"
                                >
                                  <XIcon className="w-3 h-3" />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="text-sm text-theme-label mt-3 leading-relaxed prose prose-sm dark:prose-invert max-w-none"
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
    </div>
  );
};

export default BrainDump;
