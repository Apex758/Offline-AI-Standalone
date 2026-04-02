import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Bulb01IconData from '@hugeicons/core-free-icons/BulbIcon';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';
import UserIconData from '@hugeicons/core-free-icons/UserIcon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import Calendar01IconData from '@hugeicons/core-free-icons/Calendar01Icon';
import Award01IconData from '@hugeicons/core-free-icons/Award01Icon';
import Tick01IconData from '@hugeicons/core-free-icons/Tick01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import ReloadIconData from '@hugeicons/core-free-icons/ReloadIcon';
import Delete02IconData from '@hugeicons/core-free-icons/Delete02Icon';
import AlertCircleIconData from '@hugeicons/core-free-icons/AlertCircleIcon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import axios from 'axios';
import type { InsightsData, InsightsReport, InsightsPassResult } from '../types/insights';
import { useOfflineGuard } from '../hooks/useOfflineGuard';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

interface EducatorInsightsProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  isActive?: boolean;
}

const PASS_NAMES = [
  { key: 'curriculum', name: 'Curriculum Coverage', icon: BookOpen01IconData },
  { key: 'performance', name: 'Student Performance', icon: UserIconData },
  { key: 'content', name: 'Content Creation', icon: File01IconData },
  { key: 'attendance', name: 'Attendance & Engagement', icon: Calendar01IconData },
  { key: 'achievements', name: 'Achievements & Engagement', icon: Award01IconData },
  { key: 'recommendations', name: 'Teaching Recommendations', icon: ArrowRight01IconData },
  { key: 'synthesis', name: 'Executive Summary', icon: Bulb01IconData },
];

const EducatorInsights: React.FC<EducatorInsightsProps> = ({ tabId, savedData, onDataChange, isActive }) => {
  const { guardOffline } = useOfflineGuard();

  // Resolve teacher ID (username for milestones) and user ID (for achievements)
  const { teacherId, userId } = (() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          teacherId: parsed.username || 'default_teacher',
          userId: String(parsed.id || parsed.username || 'default_teacher'),
        };
      }
    } catch {}
    return { teacherId: 'default_teacher', userId: 'default_teacher' };
  })();
  // State
  const [insightsData, setInsightsData] = useState<InsightsData | null>(savedData?.insightsData || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPass, setCurrentPass] = useState(0);
  const [totalPasses, setTotalPasses] = useState(7);
  const [currentPassName, setCurrentPassName] = useState('');
  const [passResults, setPassResults] = useState<Record<string, { output: string; streaming: string; skipped?: boolean }>>(
    savedData?.passResults || {}
  );
  const [report, setReport] = useState<InsightsReport | null>(savedData?.report || null);
  const [reportHistory, setReportHistory] = useState<InsightsReport[]>(savedData?.reportHistory || []);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [error, setError] = useState('');
  const [dataLoading, setDataLoading] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const streamingPassRef = useRef<string>('');
  const accumulatedTokensRef = useRef<string>('');

  // Persist state to tab
  const persistState = useCallback((updates: any) => {
    onDataChange({
      insightsData,
      passResults,
      report,
      reportHistory,
      ...updates,
    });
  }, [onDataChange, insightsData, passResults, report, reportHistory]);

  // Ref to prevent setState during render
  const hasInitialized = useRef(false);

  // Load data summary on mount
  useEffect(() => {
    if (!insightsData && !dataLoading && !hasInitialized.current) {
      hasInitialized.current = true;
      setDataLoading(true);
      axios.get(`/api/insights/data?teacher_id=${encodeURIComponent(teacherId)}&user_id=${encodeURIComponent(userId)}`)
        .then(res => {
          setInsightsData(res.data);
          persistState({ insightsData: res.data });
        })
        .catch(() => {})
        .finally(() => setDataLoading(false));
    }
  }, []);

  // Load report history on mount
  useEffect(() => {
    if (reportHistory.length === 0) {
      axios.get('/api/insights/reports')
        .then(res => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setReportHistory(res.data);
            // If no current report, load the most recent
            if (!report && res.data.length > 0) {
              const latest = res.data[res.data.length - 1];
              setReport(latest);
              // Rebuild passResults from saved report
              const saved: Record<string, { output: string; streaming: string }> = {};
              for (const p of latest.passes || []) {
                saved[p.key] = { output: p.output, streaming: '' };
              }
              setPassResults(saved);
              persistState({ report: latest, reportHistory: res.data, passResults: saved });
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  // Generate insights via WebSocket
  const handleGenerate = useCallback(() => {
    if (guardOffline()) return;
    if (isGenerating) return;

    setIsGenerating(true);
    setError('');
    setPassResults({});
    setReport(null);
    setCurrentPass(0);
    accumulatedTokensRef.current = '';
    streamingPassRef.current = '';

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//localhost:8000/ws/educator-insights`);
    wsRef.current = ws;

    ws.onopen = () => {
      // Include registrationDate for first-report date context
      let registrationDate: string | null = null;
      try {
        const settingsRaw = localStorage.getItem('app-settings-main');
        if (settingsRaw) {
          const settingsParsed = JSON.parse(settingsRaw);
          registrationDate = settingsParsed?.profile?.registrationDate || null;
        }
      } catch {}
      ws.send(JSON.stringify({ action: 'generate', generationMode: 'queued', teacherId, userId, registrationDate }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'status' && msg.pass !== undefined) {
          setCurrentPass(msg.pass);
          setTotalPasses(msg.total);
          setCurrentPassName(msg.passName);
          // Start streaming for this pass
          const passKey = PASS_NAMES[msg.pass - 1]?.key || '';
          streamingPassRef.current = passKey;
          accumulatedTokensRef.current = '';
        }

        if (msg.type === 'token') {
          accumulatedTokensRef.current += msg.content;
          const passKey = streamingPassRef.current;
          if (passKey) {
            const currentText = accumulatedTokensRef.current;
            setPassResults(prev => ({
              ...prev,
              [passKey]: { output: '', streaming: currentText }
            }));
          }
        }

        if (msg.type === 'pass_complete') {
          const passKey = PASS_NAMES[msg.pass - 1]?.key || '';
          setPassResults(prev => ({
            ...prev,
            [passKey]: { output: msg.result, streaming: '', skipped: msg.skipped }
          }));
          accumulatedTokensRef.current = '';
          streamingPassRef.current = '';
        }

        if (msg.type === 'complete') {
          setReport(msg.report);
          setIsGenerating(false);
          // Update history
          setReportHistory(prev => {
            const updated = [...prev, msg.report];
            persistState({ report: msg.report, reportHistory: updated });
            return updated;
          });
          ws.close();
        }

        if (msg.type === 'error') {
          setError(msg.message);
          setIsGenerating(false);
          ws.close();
        }
      } catch (e) {
        // ignore parse errors
      }
    };

    ws.onerror = () => {
      setError('WebSocket connection failed. Is the backend running?');
      setIsGenerating(false);
    };

    ws.onclose = () => {
      setIsGenerating(false);
      wsRef.current = null;
    };
  }, [guardOffline, isGenerating, persistState]);

  // Delete a report from history
  const handleDeleteReport = useCallback((reportId: string) => {
    axios.delete(`/api/insights/reports/${reportId}`)
      .then(() => {
        setReportHistory(prev => prev.filter(r => r.id !== reportId));
        if (report?.id === reportId) {
          setReport(null);
          setPassResults({});
        }
      })
      .catch(() => {});
  }, [report]);

  // Load a historical report
  const handleLoadReport = useCallback((r: InsightsReport) => {
    setReport(r);
    const saved: Record<string, { output: string; streaming: string }> = {};
    for (const p of r.passes || []) {
      saved[p.key] = { output: p.output, streaming: '' };
    }
    setPassResults(saved);
    setHistoryOpen(false);
  }, []);

  // Refresh summary card data
  const handleRefreshData = useCallback(() => {
    setDataLoading(true);
    axios.get(`/api/insights/data?teacher_id=${encodeURIComponent(teacherId)}&user_id=${encodeURIComponent(userId)}`)
      .then(res => {
        setInsightsData(res.data);
        persistState({ insightsData: res.data });
      })
      .catch(() => {})
      .finally(() => setDataLoading(false));
  }, [teacherId, userId, persistState]);

  // Check if we have any data at all
  const hasAnyData = insightsData && (
    insightsData.curriculum?.has_data ||
    insightsData.performance?.has_data ||
    insightsData.content?.has_data ||
    insightsData.attendance?.has_data ||
    insightsData.achievements?.has_data
  );

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex-none px-6 py-4 border-b border-theme-border bg-theme-bg-secondary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Icon icon={Bulb01IconData} className="w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-theme-primary">Educator Insights</h1>
                <p className="text-sm text-theme-secondary">
                  AI-powered analysis of your teaching data
                  {report?.from_date && report?.to_date && (
                    <span className="ml-2 text-theme-muted">
                      ({report.from_date} to {report.to_date})
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {report && (
                <span className="text-xs text-theme-muted">
                  Last report: {new Date(report.generated_at).toLocaleDateString()}
                </span>
              )}
              <button
                onClick={handleRefreshData}
                disabled={dataLoading}
                className="p-2 rounded-lg hover:bg-theme-bg-tertiary text-theme-muted hover:text-theme-primary transition-colors"
                title="Refresh data"
              >
                <Icon icon={ReloadIconData} className={`w-5 ${dataLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  historyOpen
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                    : 'hover:bg-theme-bg-tertiary text-theme-muted hover:text-theme-primary'
                }`}
                title="Report History"
              >
                <Icon icon={Clock01IconData} className="w-5" />
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !hasAnyData}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  isGenerating
                    ? 'bg-theme-bg-tertiary text-theme-muted cursor-not-allowed'
                    : hasAnyData
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-theme-bg-tertiary text-theme-muted cursor-not-allowed'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-theme-muted border-t-transparent rounded-full animate-spin" />
                    Analyzing ({currentPass}/{totalPasses})...
                  </>
                ) : (
                  <>
                    <Icon icon={Bulb01IconData} className="w-4" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress bar during generation */}
          {isGenerating && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-theme-secondary mb-1">
                <span>Pass {currentPass}/{totalPasses}: {currentPassName}</span>
                <span>{Math.round((currentPass / totalPasses) * 100)}%</span>
              </div>
              <div className="w-full bg-theme-bg-tertiary rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentPass / totalPasses) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
              <Icon icon={AlertCircleIconData} className="w-4 flex-none" />
              {error}
            </div>
          )}

          {/* Data Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <SummaryCard
              icon={BookOpen01IconData}
              label="Curriculum"
              value={insightsData?.curriculum?.has_data ? `${insightsData.curriculum.pct}%` : '--'}
              sub={insightsData?.curriculum?.has_data ? `${insightsData.curriculum.completed}/${insightsData.curriculum.total} milestones` : 'No milestones tracked'}
              color="blue"
              loading={dataLoading}
            />
            <SummaryCard
              icon={UserIconData}
              label="Performance"
              value={insightsData?.performance?.has_data ? `${insightsData.performance.avgScore}%` : '--'}
              sub={insightsData?.performance?.has_data ? `${insightsData.performance.totalStudents} students tracked` : 'No grades recorded'}
              color="green"
              loading={dataLoading}
            />
            <SummaryCard
              icon={File01IconData}
              label="Content"
              value={insightsData?.content?.has_data ? `${insightsData.content.totalResources}` : '--'}
              sub={insightsData?.content?.has_data ? `Top: ${insightsData.content.topType}` : 'No content created'}
              color="purple"
              loading={dataLoading}
            />
            <SummaryCard
              icon={Calendar01IconData}
              label="Attendance"
              value={insightsData?.attendance?.has_data ? `${insightsData.attendance.avgRate}%` : '--'}
              sub={insightsData?.attendance?.has_data ? `${insightsData.attendance.atRiskCount} at-risk students` : 'No attendance recorded'}
              color="orange"
              loading={dataLoading}
            />
            <SummaryCard
              icon={Award01IconData}
              label="Achievements"
              value={insightsData?.achievements?.has_data ? `${insightsData.achievements.totalEarned}/${insightsData.achievements.totalAvailable}` : '--'}
              sub={insightsData?.achievements?.has_data ? `${insightsData.achievements.rank?.title || 'Newcomer'} · ${insightsData.achievements.streakDays}d streak` : 'No achievements yet'}
              color="yellow"
              loading={dataLoading}
            />
          </div>

          {/* No data prompt */}
          {!hasAnyData && !dataLoading && (
            <div className="text-center py-12 text-theme-secondary">
              <Icon icon={Bulb01IconData} className="w-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium mb-2">No teaching data found yet</p>
              <p className="text-sm max-w-md mx-auto">
                Start creating lesson plans, tracking milestones, recording grades, or taking attendance.
                Once you have data, Educator Insights will analyze it and provide personalized recommendations.
              </p>
            </div>
          )}

          {/* Synthesis at top (only when complete) */}
          {passResults.synthesis?.output && !passResults.synthesis.skipped && (
            <InsightSection
              icon={Bulb01IconData}
              name="Executive Summary"
              content={passResults.synthesis.output}
              streaming={passResults.synthesis.streaming}
              isActive={streamingPassRef.current === 'synthesis'}
              color="amber"
              prominent
            />
          )}

          {/* Progressive insight sections */}
          {PASS_NAMES.slice(0, 6).map((pass, idx) => {
            const result = passResults[pass.key];
            const isCurrentlyStreaming = isGenerating && streamingPassRef.current === pass.key;
            const isPending = isGenerating && !result && currentPass <= idx;
            const isSkipped = result?.skipped;

            if (!result && !isGenerating && !report) return null;

            return (
              <InsightSection
                key={pass.key}
                icon={pass.icon}
                name={pass.name}
                content={result?.output || ''}
                streaming={result?.streaming || ''}
                isActive={isCurrentlyStreaming}
                isPending={isPending}
                isSkipped={isSkipped}
                color={['blue', 'green', 'purple', 'orange', 'yellow', 'teal'][idx]}
              />
            );
          })}

          {/* Streaming synthesis while generating */}
          {isGenerating && streamingPassRef.current === 'synthesis' && passResults.synthesis?.streaming && (
            <InsightSection
              icon={Bulb01IconData}
              name="Executive Summary"
              content=""
              streaming={passResults.synthesis.streaming}
              isActive={true}
              color="amber"
              prominent
            />
          )}
        </div>
      </div>

      {/* History Sidebar Panel */}
      <div
        className={`border-l border-theme-border bg-theme-bg-secondary transition-all duration-300 overflow-hidden flex-shrink-0 ${
          historyOpen ? 'w-80' : 'w-0'
        }`}
      >
        <div className="h-full flex flex-col p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-theme-primary">Insight Reports</h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-1 rounded hover:bg-theme-bg-tertiary transition-colors"
            >
              <Icon icon={Cancel01IconData} className="w-5 text-theme-muted" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {reportHistory.length === 0 ? (
              <div className="text-center text-theme-muted mt-8">
                <Icon icon={Bulb01IconData} className="w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No reports generated yet</p>
                <p className="text-xs mt-1">Click "Generate Report" to create your first insight</p>
              </div>
            ) : (
              [...reportHistory].reverse().map(r => (
                <div
                  key={r.id}
                  onClick={() => handleLoadReport(r)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                    report?.id === r.id
                      ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-300 dark:border-amber-700 shadow-sm'
                      : 'bg-theme-bg-tertiary hover:bg-theme-bg-primary border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Icon icon={Bulb01IconData} className="w-4 text-amber-500 flex-shrink-0" />
                        <p className="text-sm font-medium text-theme-primary">
                          {new Date(r.generated_at).toLocaleDateString()}
                        </p>
                        {report?.id === r.id && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                            Current
                          </span>
                        )}
                      </div>
                      {r.from_date && r.to_date && (
                        <p className="text-xs text-theme-muted mt-0.5 ml-6">
                          {r.from_date} — {r.to_date}
                        </p>
                      )}
                      <p className="text-xs text-theme-muted mt-0.5 ml-6">
                        {new Date(r.generated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteReport(r.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                      title="Delete report"
                    >
                      <Icon icon={Delete02IconData} className="w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// ── Summary Card ──────────────────────────────────────────────────────────────

const CARD_COLORS: Record<string, string> = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
};

interface SummaryCardProps {
  icon: any;
  label: string;
  value: string;
  sub: string;
  color: string;
  loading?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, label, value, sub, color, loading }) => (
  <div className="p-4 rounded-xl border border-theme-border bg-theme-bg-secondary">
    <div className="flex items-center gap-2 mb-2">
      <div className={`p-1.5 rounded-lg ${CARD_COLORS[color] || CARD_COLORS.blue}`}>
        <Icon icon={icon} className="w-4" />
      </div>
      <span className="text-xs font-medium text-theme-secondary uppercase tracking-wide">{label}</span>
    </div>
    {loading ? (
      <div className="space-y-2">
        <div className="h-6 w-16 bg-theme-bg-tertiary rounded animate-pulse" />
        <div className="h-3 w-24 bg-theme-bg-tertiary rounded animate-pulse" />
      </div>
    ) : (
      <>
        <div className="text-2xl font-bold text-theme-primary">{value}</div>
        <div className="text-xs text-theme-muted mt-1">{sub}</div>
      </>
    )}
  </div>
);


// ── Insight Section ───────────────────────────────────────────────────────────

const SECTION_COLORS: Record<string, { border: string; bg: string; icon: string }> = {
  blue: { border: 'border-blue-200 dark:border-blue-800', bg: 'bg-blue-50/50 dark:bg-blue-900/10', icon: 'text-blue-500' },
  green: { border: 'border-green-200 dark:border-green-800', bg: 'bg-green-50/50 dark:bg-green-900/10', icon: 'text-green-500' },
  purple: { border: 'border-purple-200 dark:border-purple-800', bg: 'bg-purple-50/50 dark:bg-purple-900/10', icon: 'text-purple-500' },
  orange: { border: 'border-orange-200 dark:border-orange-800', bg: 'bg-orange-50/50 dark:bg-orange-900/10', icon: 'text-orange-500' },
  yellow: { border: 'border-yellow-200 dark:border-yellow-800', bg: 'bg-yellow-50/50 dark:bg-yellow-900/10', icon: 'text-yellow-500' },
  teal: { border: 'border-teal-200 dark:border-teal-800', bg: 'bg-teal-50/50 dark:bg-teal-900/10', icon: 'text-teal-500' },
  amber: { border: 'border-amber-200 dark:border-amber-800', bg: 'bg-amber-50/50 dark:bg-amber-900/10', icon: 'text-amber-500' },
};

interface InsightSectionProps {
  icon: any;
  name: string;
  content: string;
  streaming: string;
  isActive?: boolean;
  isPending?: boolean;
  isSkipped?: boolean;
  color: string;
  prominent?: boolean;
}

const InsightSection: React.FC<InsightSectionProps> = ({
  icon, name, content, streaming, isActive, isPending, isSkipped, color, prominent
}) => {
  const colors = SECTION_COLORS[color] || SECTION_COLORS.blue;
  const displayText = stripThinkTags(content || streaming);

  if (isPending) {
    return (
      <div className={`p-4 rounded-xl border border-theme-border bg-theme-bg-secondary opacity-40`}>
        <div className="flex items-center gap-2">
          <Icon icon={icon} className="w-5 text-theme-muted" />
          <span className="text-sm font-medium text-theme-muted">{name}</span>
          <span className="text-xs text-theme-muted ml-auto">Waiting...</span>
        </div>
      </div>
    );
  }

  if (isSkipped) {
    return (
      <div className={`p-4 rounded-xl border border-theme-border bg-theme-bg-secondary opacity-50`}>
        <div className="flex items-center gap-2">
          <Icon icon={icon} className="w-5 text-theme-muted" />
          <span className="text-sm font-medium text-theme-muted">{name}</span>
          <span className="text-xs text-theme-muted ml-auto">No data available</span>
        </div>
      </div>
    );
  }

  if (!displayText) return null;

  return (
    <div className={`p-4 rounded-xl border ${colors.border} ${prominent ? colors.bg : 'bg-theme-bg-secondary'} ${
      isActive ? 'ring-2 ring-amber-400/50' : ''
    } transition-all duration-300`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon icon={icon} className={`w-5 ${colors.icon}`} />
        <span className={`text-sm font-semibold ${prominent ? 'text-lg' : ''} text-theme-primary`}>{name}</span>
        {isActive && (
          <div className="ml-auto flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            Analyzing...
          </div>
        )}
      </div>
      <div className="text-sm text-theme-secondary leading-relaxed whitespace-pre-wrap">
        {renderMarkdown(displayText)}
      </div>
    </div>
  );
};


// ── Simple markdown renderer ──────────────────────────────────────────────────

function stripThinkTags(text: string): string {
  // Remove <think>...</think> blocks (including multiline)
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>\s*/g, '');
  // Remove unclosed <think> blocks (model didn't close the tag)
  cleaned = cleaned.replace(/<think>[\s\S]*$/g, '');
  return cleaned.trim();
}

function renderInlineMarkdown(text: string): React.ReactNode {
  // Handle **bold** syntax
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-theme-primary">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </>
  );
}

function renderMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Strip any <think> blocks that made it through
  text = stripThinkTags(text);
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headers
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={i} className="text-base font-semibold text-theme-primary mt-3 mb-1">
          {renderInlineMarkdown(line.replace('## ', ''))}
        </h3>
      );
      continue;
    }

    // Numbered lists
    const numMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      elements.push(
        <div key={i} className="flex gap-2 ml-1 my-0.5">
          <span className="text-theme-muted font-medium flex-none">{numMatch[1]}.</span>
          <span>{renderInlineMarkdown(numMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Bullet points
    if (line.startsWith('- ')) {
      elements.push(
        <div key={i} className="flex gap-2 ml-1 my-0.5">
          <span className="text-theme-muted flex-none mt-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-current" />
          </span>
          <span>{renderInlineMarkdown(line.replace('- ', ''))}</span>
        </div>
      );
      continue;
    }

    // Empty lines
    if (!line.trim()) {
      elements.push(<div key={i} className="h-2" />);
      continue;
    }

    // Regular text
    elements.push(<p key={i} className="my-0.5">{renderInlineMarkdown(line)}</p>);
  }

  return <>{elements}</>;
}


export default EducatorInsights;
