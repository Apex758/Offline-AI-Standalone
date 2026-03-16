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
  ExternalLink
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
        // Safe evaluation using Function constructor (no eval)
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
      <div className="bg-theme-tertiary rounded-lg px-3 py-2 text-right font-mono text-lg text-theme-heading truncate min-h-[2.5rem]">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1">
        {buttons.map(b => (
          <button
            key={b}
            onClick={() => handleInput(b)}
            className={`rounded-lg py-2 text-sm font-medium transition-colors ${
              b === 'C' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 col-span-4' :
              '+-*/'.includes(b) ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              b === '=' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
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
    <div className="text-center space-y-3">
      <div className="font-mono text-3xl text-theme-heading">{fmt(elapsed)}</div>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setRunning(!running)}
          className={`p-2 rounded-full ${running ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}
        >
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={() => { setRunning(false); setElapsed(0); }}
          className="p-2 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        >
          <Square className="w-4 h-4" />
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
    <div className="space-y-3">
      <div className="font-mono text-3xl text-center text-theme-heading">{fmt(remaining)}</div>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {presets.map(p => (
          <button
            key={p}
            onClick={() => { setTotalSec(p); setRemaining(p); setRunning(false); }}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              totalSec === p ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-theme-tertiary text-theme-muted hover:bg-theme-hover'
            }`}
          >
            {p >= 60 ? `${p / 60}m` : `${p}s`}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setRunning(!running)}
          className={`p-2 rounded-full ${running ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}
        >
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={() => { setRunning(false); setRemaining(totalSec); }}
          className="p-2 rounded-full bg-theme-tertiary text-theme-muted hover:bg-theme-hover"
        >
          <RotateCcw className="w-4 h-4" />
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
      // Try direct JSON parse
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
      // Try extracting JSON from markdown code blocks
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
      // Save task to localStorage (same pattern as AnalyticsDashboard)
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
      // Open the corresponding tool tab
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
    const updated = [entry, ...entries].slice(0, 50); // Keep max 50 entries
    setEntries(updated);
    saveEntries(updated);
    // Clear
    setDumpText('');
    setActions([]);
    setAnalysisError(null);
  }, [dumpText, actions, entries]);

  // Delete a saved entry
  const handleDeleteEntry = useCallback((entryId: string) => {
    const updated = entries.filter(e => e.id !== entryId);
    setEntries(updated);
    saveEntries(updated);
  }, [entries]);

  const hasContent = dumpText.trim().length > 0;
  const hasPendingActions = actions.some(a => a.status === 'pending');

  return (
    <div className="h-full overflow-hidden">
      {/* Card flip container */}
      <div className="image-studio-flip-container h-full">
        <div className={`image-studio-flip-inner h-full ${flipped ? 'flipped' : ''}`}>

          {/* ═══════ FRONT: Brain Dump Input ═══════ */}
          <div className="image-studio-flip-front p-4 md:p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-theme-heading">Brain Dump</h2>
                  <p className="text-xs text-theme-muted">Type or speak your thoughts, then let AI organize them into actions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFlipped(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-theme-tertiary text-theme-muted hover:bg-theme-hover transition-colors"
                >
                  <StickyNote className="w-3.5 h-3.5" />
                  Saved Notes ({entries.length})
                </button>
              </div>
            </div>

            {/* Main content area - scrollable */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {/* Text Input Area */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={isListening && interimText ? interimText : dumpText}
                  onChange={(e) => { if (!isListening) setDumpText(e.target.value); }}
                  placeholder="What's on your mind? Type your thoughts, ideas, tasks, plans... anything! You can also use the microphone to speak."
                  className="w-full rounded-xl border border-theme bg-theme-surface p-4 pr-24 text-sm text-theme-label placeholder:text-theme-hint resize-none focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all min-h-[120px]"
                  rows={4}
                  disabled={isAnalyzing}
                />
                {/* Mic + Analyze buttons */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    onClick={toggleListening}
                    className={`p-2 rounded-full transition-all ${
                      isListening
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 animate-pulse'
                        : 'bg-theme-tertiary text-theme-muted hover:bg-theme-hover'
                    }`}
                    title={isListening ? 'Stop listening' : 'Start voice input'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!hasContent || isAnalyzing}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-purple-600 text-white hover:bg-purple-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing your thoughts...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze & Organize
                  </>
                )}
              </button>

              {/* Error message */}
              {analysisError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm">
                  {analysisError}
                </div>
              )}

              {/* Action List */}
              {actions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-theme-heading">
                      Suggested Actions ({actions.length})
                    </h3>
                    {(actions.length > 0 && (hasContent || actions.some(a => a.status !== 'pending'))) && (
                      <button
                        onClick={handleSaveToNotes}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-theme-tertiary text-theme-muted hover:bg-theme-hover transition-colors"
                      >
                        <StickyNote className="w-3 h-3" />
                        Save to Notes
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
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                            isAccepted ? 'bg-green-50 dark:bg-green-900/15 border-green-200 dark:border-green-800/40' :
                            isDenied ? 'bg-theme-tertiary border-theme opacity-50' :
                            'bg-theme-surface border-theme hover:border-purple-300 dark:hover:border-purple-700'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 bg-${meta.color}-100 dark:bg-${meta.color}-900/30`}>
                            <Icon className={`w-4 h-4 text-${meta.color}-600 dark:text-${meta.color}-400`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-theme-muted uppercase tracking-wider">
                                {meta.label}
                              </span>
                              {isAccepted && <span className="text-xs text-green-600 dark:text-green-400 font-medium">Accepted</span>}
                              {isDenied && <span className="text-xs text-theme-hint line-through">Declined</span>}
                            </div>
                            <p className="text-sm font-medium text-theme-heading mt-0.5">{action.title}</p>
                            {action.description && (
                              <p className="text-xs text-theme-muted mt-0.5">{action.description}</p>
                            )}
                            {action.details && Object.keys(action.details).length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {Object.entries(action.details).map(([key, val]) => (
                                  <span key={key} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-theme-tertiary text-theme-muted">
                                    {key}: {String(val)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {action.status === 'pending' && (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleAccept(action.id)}
                                className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
                                title="Accept"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeny(action.id)}
                                className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
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
                              className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors shrink-0"
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
              <div className="border-t border-theme pt-4">
                <h3 className="text-xs font-semibold text-theme-hint uppercase tracking-wider mb-2">Quick Tools</h3>
                <div className="flex gap-2">
                  {([
                    { id: 'calculator' as const, icon: Calculator, label: 'Calculator' },
                    { id: 'stopwatch' as const, icon: Clock, label: 'Stopwatch' },
                    { id: 'timer' as const, icon: Timer, label: 'Timer' },
                  ]).map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        activeTool === tool.id
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-theme-tertiary text-theme-muted hover:bg-theme-hover'
                      }`}
                    >
                      <tool.icon className="w-3.5 h-3.5" />
                      {tool.label}
                    </button>
                  ))}
                </div>
                {activeTool && (
                  <div className="mt-3 p-4 rounded-xl border border-theme bg-theme-surface">
                    {activeTool === 'calculator' && <MiniCalculator />}
                    {activeTool === 'stopwatch' && <MiniStopwatch />}
                    {activeTool === 'timer' && <MiniTimer />}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ═══════ BACK: Saved Notes ═══════ */}
          <div className="image-studio-flip-back p-4 md:p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                  <StickyNote className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-theme-heading">Saved Notes</h2>
                  <p className="text-xs text-theme-muted">{entries.length} saved brain dump{entries.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={() => setFlipped(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-theme-tertiary text-theme-muted hover:bg-theme-hover transition-colors"
              >
                <Brain className="w-3.5 h-3.5" />
                Brain Dump
              </button>
            </div>

            {/* Notes list */}
            <div className="flex-1 overflow-y-auto space-y-2 pb-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-theme-hint">
                  <StickyNote className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm">No saved notes yet</p>
                  <p className="text-xs mt-1">Brain dump something and save it to see it here</p>
                </div>
              ) : (
                entries.map(entry => (
                  <div key={entry.id} className="rounded-xl border border-theme bg-theme-surface overflow-hidden">
                    <button
                      onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-theme-hover transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-theme-heading truncate">{entry.text.slice(0, 100)}{entry.text.length > 100 ? '...' : ''}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-theme-hint">
                            {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {entry.actions.length > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                              {entry.actions.length} action{entry.actions.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteEntry(entry.id); }}
                          className="p-1 rounded-lg text-theme-hint hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {expandedEntry === entry.id ? <ChevronUp className="w-4 h-4 text-theme-hint" /> : <ChevronDown className="w-4 h-4 text-theme-hint" />}
                      </div>
                    </button>
                    {expandedEntry === entry.id && (
                      <div className="px-3 pb-3 space-y-2 border-t border-theme">
                        <p className="text-sm text-theme-label whitespace-pre-wrap mt-2">{entry.text}</p>
                        {entry.actions.length > 0 && (
                          <div className="space-y-1.5 mt-2">
                            <p className="text-xs font-medium text-theme-muted">Actions:</p>
                            {entry.actions.map(action => {
                              const meta = ACTION_META[action.type] || ACTION_META['calendar-task'];
                              return (
                                <div key={action.id} className="flex items-center gap-2 text-xs text-theme-muted">
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    action.status === 'accepted' ? 'bg-green-500' :
                                    action.status === 'denied' ? 'bg-red-400' : 'bg-yellow-400'
                                  }`} />
                                  <span className="font-medium">{meta.label}:</span>
                                  <span>{action.title}</span>
                                  <span className="text-[10px] text-theme-hint capitalize">({action.status})</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {/* Re-use button */}
                        <button
                          onClick={() => {
                            setDumpText(entry.text);
                            setFlipped(false);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors mt-2"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Re-analyze
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BrainDump;
