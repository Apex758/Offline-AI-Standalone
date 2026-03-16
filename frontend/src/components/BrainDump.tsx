import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Brain,
  Mic,
  MicOff,
  Sparkles,
  Check,
  X,
  RotateCcw,
  BookMarked,
  PenTool,
  ClipboardList,
  FileSpreadsheet,
  CalendarPlus,
  Baby,
  Layers,
  Merge,
  Palette,
  Loader2,
  StickyNote,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Calculator,
  Timer,
  Play,
  Pause,
  Square,
  ExternalLink,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useSTT } from '../hooks/useVoice';
import { useWebSocket } from '../contexts/WebSocketContext';
import type { BrainDumpAction, BrainDumpEntry, BrainDumpActionType } from '../types/brainDump';

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

// ─── Utility: Simple Calculator ─────────────────────────────────
const MiniCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  const handleInput = (val: string) => {
    if (val === 'C') { setDisplay('0'); setExpression(''); return; }
    if (val === '=') {
      try {
        const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, '');
        const result = new Function(`return (${sanitized})`)();
        setDisplay(String(Number(result.toFixed(10))));
        setExpression(String(Number(result.toFixed(10))));
      } catch { setDisplay('Error'); setExpression(''); }
      return;
    }
    const newExpr = expression === '0' && !'.+-*/'.includes(val) ? val : expression + val;
    setExpression(newExpr);
    setDisplay(newExpr);
  };

  const buttons = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+','C'];

  return (
    <div className="space-y-2">
      <div className="rounded-lg px-3 py-2 text-right font-mono text-lg truncate min-h-[2.5rem]"
        style={{ background: 'var(--color-surface-tertiary)', color: 'var(--color-text-heading)' }}>
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {buttons.map(b => (
          <button
            key={b}
            onClick={() => handleInput(b)}
            className={`rounded-xl py-2.5 text-sm font-semibold transition-all active:scale-95 ${
              b === 'C' ? 'col-span-4 bg-red-500/15 text-red-500 hover:bg-red-500/25' :
              '+-*/'.includes(b) ? 'bg-purple-500/15 text-purple-500 hover:bg-purple-500/25' :
              b === '=' ? 'bg-green-500/15 text-green-500 hover:bg-green-500/25' :
              'bg-theme-tertiary text-theme-heading hover:bg-theme-hover'
            }`}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Utility: Stopwatch ─────────────────────────────────────────
const MiniStopwatch: React.FC = () => {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 100), 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${tenths}`;
  };

  return (
    <div className="text-center space-y-4">
      <div className="font-mono text-4xl font-light tracking-wider" style={{ color: 'var(--color-text-heading)' }}>{fmt(elapsed)}</div>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setRunning(!running)}
          className={`p-3 rounded-2xl transition-all active:scale-95 ${running ? 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25' : 'bg-green-500/15 text-green-500 hover:bg-green-500/25'}`}
        >
          {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={() => { setRunning(false); setElapsed(0); }}
          className="p-3 rounded-2xl bg-red-500/15 text-red-500 hover:bg-red-500/25 transition-all active:scale-95"
        >
          <Square className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// ─── Utility: Countdown Timer ───────────────────────────────────
const MiniTimer: React.FC = () => {
  const [totalSec, setTotalSec] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
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
  const presets = [60, 300, 600, 900, 1800];

  return (
    <div className="space-y-4">
      <div className="font-mono text-4xl text-center font-light tracking-wider" style={{ color: 'var(--color-text-heading)' }}>{fmt(remaining)}</div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {presets.map(p => (
          <button
            key={p}
            onClick={() => { setTotalSec(p); setRemaining(p); setRunning(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
              totalSec === p ? 'bg-purple-500/20 text-purple-500 ring-1 ring-purple-500/30' : 'bg-theme-tertiary text-theme-muted hover:bg-theme-hover'
            }`}
          >
            {p >= 60 ? `${p / 60}m` : `${p}s`}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setRunning(!running)}
          className={`p-3 rounded-2xl transition-all active:scale-95 ${running ? 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25' : 'bg-green-500/15 text-green-500 hover:bg-green-500/25'}`}
        >
          {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={() => { setRunning(false); setRemaining(totalSec); }}
          className="p-3 rounded-2xl bg-theme-tertiary text-theme-muted hover:bg-theme-hover transition-all active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
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
  const [activeTool, setActiveTool] = useState<'calculator' | 'stopwatch' | 'timer' | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const accumulatedRef = useRef('');

  const { getConnection } = useWebSocket();
  const WS_ENDPOINT = '/ws/brain-dump';

  // STT integration
  const { isListening, toggleListening } = useSTT(
    (finalText) => {
      setDumpText(prev => prev ? prev + ' ' + finalText : finalText);
      setInterimText('');
    },
    (interim) => setInterimText(interim)
  );

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 300) + 'px';
    }
  }, [dumpText, interimText]);

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
    const text = dumpText.trim();
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
  }, [dumpText, isAnalyzing, tabId, getConnection, parseActions]);

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
    if (!dumpText.trim() && actions.length === 0) return;
    const entry: BrainDumpEntry = {
      id: `entry-${Date.now()}`,
      text: dumpText.trim(),
      timestamp: new Date().toISOString(),
      actions: [...actions],
    };
    const updated = [entry, ...entries].slice(0, 50);
    setEntries(updated);
    saveEntries(updated);
    setDumpText('');
    setActions([]);
    setAnalysisError(null);
  }, [dumpText, actions, entries]);

  // Save just the text as a note (no analysis needed)
  const handleSaveTextAsNote = useCallback(() => {
    if (!dumpText.trim()) return;
    const entry: BrainDumpEntry = {
      id: `entry-${Date.now()}`,
      text: dumpText.trim(),
      timestamp: new Date().toISOString(),
      actions: [],
    };
    const updated = [entry, ...entries].slice(0, 50);
    setEntries(updated);
    saveEntries(updated);
    setDumpText('');
    setActions([]);
    setAnalysisError(null);
  }, [dumpText, entries]);

  // Delete a saved entry
  const handleDeleteEntry = useCallback((entryId: string) => {
    const updated = entries.filter(e => e.id !== entryId);
    setEntries(updated);
    saveEntries(updated);
  }, [entries]);

  const hasContent = dumpText.trim().length > 0;

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
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/10 ring-1 ring-purple-500/20">
                  <Brain className="w-5 h-5 text-purple-500" />
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
              {/* Text Input Area */}
              <div className="relative group">
                <textarea
                  ref={textareaRef}
                  value={isListening && interimText ? interimText : dumpText}
                  onChange={(e) => { if (!isListening) setDumpText(e.target.value); }}
                  placeholder="What's on your mind? Type your thoughts, ideas, tasks, plans... anything! You can also use the microphone to speak."
                  className="w-full rounded-2xl border-2 border-transparent bg-theme-surface p-4 pr-14 text-sm text-theme-label placeholder:text-theme-hint resize-none focus:outline-none focus:border-purple-400/50 focus:shadow-[0_0_0_4px_rgba(168,85,247,0.08)] transition-all min-h-[120px]"
                  style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                  rows={4}
                  disabled={isAnalyzing}
                />
                {/* Mic button */}
                <div className="absolute bottom-3 right-3">
                  <button
                    onClick={toggleListening}
                    className={`p-2.5 rounded-xl transition-all active:scale-90 ${
                      isListening
                        ? 'bg-red-500/15 text-red-500 ring-2 ring-red-500/30 animate-pulse'
                        : 'bg-theme-tertiary text-theme-muted hover:bg-purple-500/15 hover:text-purple-500'
                    }`}
                    title={isListening ? 'Stop listening' : 'Start voice input'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
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
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed bg-amber-500/12 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 ring-1 ring-amber-500/20 hover:ring-amber-500/35"
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
                                <X className="w-4 h-4" />
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
                            {entry.text.slice(0, 100)}{entry.text.length > 100 ? '...' : ''}
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
                          <p className="text-sm text-theme-label whitespace-pre-wrap mt-3 leading-relaxed">{entry.text}</p>
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
                          <button
                            onClick={() => {
                              setDumpText(entry.text);
                              setFlipped(false);
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-500/12 text-purple-500 hover:bg-purple-500/20 transition-all active:scale-95 mt-2"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Re-analyze
                          </button>
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
