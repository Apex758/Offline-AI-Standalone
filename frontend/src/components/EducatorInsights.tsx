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
import Settings01IconData from '@hugeicons/core-free-icons/Settings01Icon';
import CalendarCheckIn01IconData from '@hugeicons/core-free-icons/CalendarCheckIn01Icon';
import ArrowLeft02IconData from '@hugeicons/core-free-icons/ArrowLeft02Icon';
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

  // Settings panel state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const settingsBtnRef = useRef<HTMLDivElement>(null);

  // Pass toggles — which passes to run during generation
  const PASS_TOGGLES_KEY = 'insights-pass-toggles';
  const DEFAULT_PASS_TOGGLES: Record<string, boolean> = {
    curriculum: true, performance: true, content: true,
    attendance: true, achievements: true,
    recommendations: true, synthesis: true,
  };
  const [passToggles, setPassToggles] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(PASS_TOGGLES_KEY);
      if (raw) return { ...DEFAULT_PASS_TOGGLES, ...JSON.parse(raw) };
    } catch {}
    return { ...DEFAULT_PASS_TOGGLES };
  });

  // Schedule form state
  const [schedMode, setSchedMode] = useState<'manual' | 'daily' | 'interval'>('manual');
  const [schedTime, setSchedTime] = useState('08:00');
  const [schedDays, setSchedDays] = useState(1);
  const [schedSaved, setSchedSaved] = useState(false);
  const [schedLoading, setSchedLoading] = useState(false);

  // Pass dependency enforcement
  const PASS_DEPS: Record<string, string[]> = {
    recommendations: ['curriculum', 'performance', 'content', 'attendance', 'achievements'],
    synthesis: ['recommendations'],
  };
  const handlePassToggle = useCallback((key: string, val: boolean) => {
    const next = { ...passToggles, [key]: val };
    if (!val) {
      // If turning off a pass, also turn off anything that depends on it
      for (const [depKey, deps] of Object.entries(PASS_DEPS)) {
        if (deps.includes(key)) {
          next[depKey] = false;
          // Cascade: if recommendations turned off, synthesis too
          if (depKey === 'recommendations') next['synthesis'] = false;
        }
      }
    }
    if (val && key === 'recommendations') {
      // Turning on recommendations — need at least the base passes that have data
      // Don't force-enable them, but synthesis can now be re-enabled
    }
    if (val && key === 'synthesis') {
      // Turning on synthesis requires recommendations
      next['recommendations'] = true;
    }
    setPassToggles(next);
    try { localStorage.setItem(PASS_TOGGLES_KEY, JSON.stringify(next)); } catch {}
  }, [passToggles]);

  // Load schedule on panel open
  useEffect(() => {
    if (scheduleOpen) {
      fetch('/api/insights/schedule')
        .then(r => r.json())
        .then(d => {
          setSchedMode(d.mode || 'manual');
          setSchedTime(d.time || '08:00');
          setSchedDays(d.every_days || 1);
        })
        .catch(() => {});
    }
  }, [scheduleOpen]);

  // Close settings on outside click
  useEffect(() => {
    if (!settingsOpen && !scheduleOpen) return;
    const handler = (e: MouseEvent) => {
      if (settingsBtnRef.current && !settingsBtnRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
        setScheduleOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [settingsOpen, scheduleOpen]);

  const saveSchedule = async () => {
    setSchedLoading(true);
    try {
      await fetch('/api/insights/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: schedMode, time: schedTime, every_days: schedDays }),
      });
      setSchedSaved(true);
      setTimeout(() => { setSchedSaved(false); setScheduleOpen(false); setSettingsOpen(false); }, 1200);
    } catch {}
    setSchedLoading(false);
  };

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
      <style>{`
        .ei-settings-dropdown {
          position: absolute; top: calc(100% + 6px); right: 0; z-index: 50;
          background: var(--dash-card-bg, white); border: 1px solid var(--dash-border, #E8E8E0);
          border-radius: 0.75rem; box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          padding: 0.75rem; min-width: 220px;
          display: flex; flex-direction: column; gap: 0.35rem;
        }
        .dark .ei-settings-dropdown { background: #1e293b; border-color: #334155; }
        .ei-dropdown-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--dash-text-sub, #94A3B8); margin-bottom: 0.15rem; }
        .ei-toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; cursor: pointer; padding: 0.25rem 0; }
        .ei-toggle-label { font-size: 0.75rem; color: var(--dash-text, #374151); }
        .dark .ei-toggle-label { color: #e2e8f0; }
        .ei-toggle-switch {
          width: 30px; height: 17px; border-radius: 9px;
          background: var(--dash-border, #E8E8E0); position: relative;
          cursor: pointer; flex-shrink: 0; transition: background 0.2s ease;
        }
        .ei-toggle-switch.ei-toggle-on { background: #d97706; }
        .ei-toggle-thumb {
          position: absolute; top: 2px; left: 2px;
          width: 13px; height: 13px; border-radius: 50%;
          background: white; transition: transform 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .ei-toggle-on .ei-toggle-thumb { transform: translateX(13px); }
        .ei-dep-hint { font-size: 0.6rem; color: var(--dash-text-sub, #94A3B8); line-height: 1.4; margin-top: 0.15rem; font-style: italic; }
        .ei-dropdown-divider { height: 1px; background: var(--dash-border, #E8E8E0); margin: 0.2rem 0; }
        .dark .ei-dropdown-divider { background: #334155; }
        .ei-dropdown-action {
          display: flex; align-items: center;
          font-size: 0.75rem; color: #d97706; font-weight: 600;
          background: none; border: none; cursor: pointer; padding: 0.25rem 0;
          transition: opacity 0.15s;
        }
        .ei-dropdown-action:hover { opacity: 0.75; }
        .ei-schedule-panel { min-width: 230px; }
        .ei-sched-back {
          display: flex; align-items: center; justify-content: center;
          width: 22px; height: 22px; border-radius: 5px; border: none;
          background: var(--dash-gold-a25, #F5F5F0); color: var(--dash-text, #374151);
          cursor: pointer;
        }
        .dark .ei-sched-back { background: #334155; color: #e2e8f0; }
        .ei-sched-option {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.35rem 0.5rem; border-radius: 0.375rem;
          cursor: pointer; transition: background 0.12s ease;
        }
        .ei-sched-option:hover { background: var(--dash-gold-a25, #F5F5F0); }
        .dark .ei-sched-option:hover { background: #334155; }
        .ei-sched-selected { background: var(--dash-gold-a25, #F5F5F0); }
        .dark .ei-sched-selected { background: #334155; }
        .ei-sched-dot {
          width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
          border: 2px solid var(--dash-border, #E8E8E0);
          transition: border-color 0.15s, background 0.15s;
        }
        .ei-sched-selected .ei-sched-dot { border-color: #d97706; background: #d97706; }
        .ei-sched-option-label { font-size: 0.75rem; color: var(--dash-text, #374151); }
        .dark .ei-sched-option-label { color: #e2e8f0; }
        .ei-sched-fields { display: flex; flex-direction: column; gap: 0.4rem; padding: 0.4rem 0 0.15rem; }
        .ei-sched-field { display: flex; align-items: center; gap: 0.4rem; }
        .ei-sched-field-label { font-size: 0.675rem; color: var(--dash-text-sub, #94A3B8); display: flex; align-items: center; }
        .ei-sched-input {
          flex: 1; font-size: 0.75rem; padding: 0.25rem 0.5rem;
          border: 1px solid var(--dash-border, #E8E8E0); border-radius: 0.375rem;
          background: var(--dash-card-bg, white); color: var(--dash-text, #374151); outline: none;
        }
        .dark .ei-sched-input { background: #1e293b; border-color: #334155; color: #e2e8f0; }
        .ei-sched-input:focus { border-color: #d97706; }
        .ei-sched-input-sm { max-width: 56px; }
        .ei-sched-save {
          margin-top: 0.5rem; width: 100%; padding: 0.4rem; border-radius: 0.375rem; border: none;
          background: #d97706; color: white;
          font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s;
        }
        .ei-sched-save:hover:not(:disabled) { opacity: 0.85; }
        .ei-sched-save:disabled { opacity: 0.6; cursor: default; }
      `}</style>
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
              {/* Settings dropdown container */}
              <div ref={settingsBtnRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => { setSettingsOpen(o => !o); setScheduleOpen(false); }}
                  className={`p-2 rounded-lg transition-colors ${
                    settingsOpen || scheduleOpen
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      : 'hover:bg-theme-bg-tertiary text-theme-muted hover:text-theme-primary'
                  }`}
                  title="Settings & Schedule"
                >
                  <Icon icon={Settings01IconData} className="w-5" />
                </button>

                {/* Settings panel */}
                {settingsOpen && !scheduleOpen && (
                  <div className="ei-settings-dropdown">
                    <p className="ei-dropdown-label">Passes to run</p>
                    {PASS_NAMES.map(({ key, name }) => {
                      const isDisabledByDep = (
                        (key === 'recommendations' && !['curriculum','performance','content','attendance','achievements'].some(k => passToggles[k])) ||
                        (key === 'synthesis' && !passToggles.recommendations)
                      );
                      return (
                        <label key={key} className="ei-toggle-row" style={{ opacity: isDisabledByDep && !passToggles[key] ? 0.5 : 1 }}>
                          <span className="ei-toggle-label">{name}</span>
                          <span
                            className={`ei-toggle-switch${passToggles[key] ? ' ei-toggle-on' : ''}`}
                            onClick={(e) => { e.preventDefault(); if (!isDisabledByDep || passToggles[key]) handlePassToggle(key, !passToggles[key]); }}
                          >
                            <span className="ei-toggle-thumb" />
                          </span>
                        </label>
                      );
                    })}
                    {/* Dependency hint */}
                    <p className="ei-dep-hint">Recommendations requires at least one base pass. Summary requires Recommendations.</p>
                    <div className="ei-dropdown-divider" />
                    <button className="ei-dropdown-action" onClick={() => { setScheduleOpen(true); setSettingsOpen(false); }}>
                      <Icon icon={CalendarCheckIn01IconData} className="w-4" style={{ marginRight: 5 }} />
                      Schedule Insights
                    </button>
                  </div>
                )}

                {/* Schedule panel */}
                {scheduleOpen && (
                  <div className="ei-settings-dropdown ei-schedule-panel">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <button className="ei-sched-back" onClick={() => { setScheduleOpen(false); setSettingsOpen(true); }}>
                        <Icon icon={ArrowLeft02IconData} className="w-3.5" />
                      </button>
                      <p className="ei-dropdown-label" style={{ margin: 0 }}>Schedule Insights</p>
                    </div>

                    {(['manual', 'daily', 'interval'] as const).map(m => (
                      <label key={m} className={`ei-sched-option${schedMode === m ? ' ei-sched-selected' : ''}`}>
                        <input type="radio" name="eiSchedMode" value={m} checked={schedMode === m} onChange={() => setSchedMode(m)} style={{ display: 'none' }} />
                        <span className="ei-sched-dot" />
                        <span className="ei-sched-option-label">
                          {m === 'manual' ? 'Manual only' : m === 'daily' ? 'Daily' : 'Every N days'}
                        </span>
                      </label>
                    ))}

                    {(schedMode === 'daily' || schedMode === 'interval') && (
                      <div className="ei-sched-fields">
                        {schedMode === 'interval' && (
                          <div className="ei-sched-field">
                            <label className="ei-sched-field-label">Every</label>
                            <input
                              type="number" min={1} max={14} value={schedDays}
                              onChange={e => setSchedDays(Math.max(1, Math.min(14, Number(e.target.value))))}
                              className="ei-sched-input ei-sched-input-sm"
                            />
                            <span className="ei-sched-field-label">day(s)</span>
                          </div>
                        )}
                        <div className="ei-sched-field">
                          <label className="ei-sched-field-label">
                            <Icon icon={Clock01IconData} className="w-3.5" />
                          </label>
                          <input
                            type="time" value={schedTime}
                            onChange={e => setSchedTime(e.target.value)}
                            className="ei-sched-input"
                          />
                        </div>
                      </div>
                    )}

                    <button className="ei-sched-save" onClick={saveSchedule} disabled={schedLoading}>
                      {schedSaved ? '✓ Saved' : schedLoading ? 'Saving…' : 'Save Schedule'}
                    </button>
                  </div>
                )}
              </div>

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
              content={stripSynthesisHeader(passResults.synthesis.output)}
              streaming={stripSynthesisHeader(passResults.synthesis.streaming)}
              isActive={streamingPassRef.current === 'synthesis'}
              color="amber"
              prominent
            />
          )}

          {/* Progressive insight sections - always show all passes during/after generation */}
          {PASS_NAMES.slice(0, 6).map((pass, idx) => {
            const result = passResults[pass.key];
            const isCurrentlyStreaming = isGenerating && streamingPassRef.current === pass.key;
            // Pass numbers from backend are 1-indexed, array is 0-indexed
            // isPending if: generating AND no result yet AND this pass hasn't been reached yet
            const isPending = isGenerating && !result && currentPass <= idx;
            const isSkipped = result?.skipped;

            // Show section if: has result OR is generating (even without result) OR has report
            const shouldShow = result || isGenerating || report;
            if (!shouldShow) return null;

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
              streaming={stripSynthesisHeader(passResults.synthesis.streaming)}
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

function stripSynthesisHeader(text: string): string {
  // Remove leading "## Executive Summary" or similar headers that would duplicate the section title
  return text.replace(/^#+\s*(Executive Summary|Insights Summary|Summary)[\s\n]*/i, '').trim();
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
