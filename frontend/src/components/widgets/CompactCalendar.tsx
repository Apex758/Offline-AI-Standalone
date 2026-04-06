import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  isSameMonth
} from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import ArrowLeft01IconData from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import Maximize02IconData from '@hugeicons/core-free-icons/Maximize02Icon';
import RefreshIconData from '@hugeicons/core-free-icons/ReloadIcon';
import Settings01IconData from '@hugeicons/core-free-icons/Settings01Icon';
import Bulb01IconData from '@hugeicons/core-free-icons/BulbIcon';
import ArrowUp01IconData from '@hugeicons/core-free-icons/ArrowUp01Icon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import ExternalLinkIconData from '@hugeicons/core-free-icons/Link01Icon';
import CalendarCheckIconData from '@hugeicons/core-free-icons/CalendarCheckIn01Icon';
import ArrowLeft02IconData from '@hugeicons/core-free-icons/ArrowLeft02Icon';
import ClockIconData from '@hugeicons/core-free-icons/Clock01Icon';
import type { InsightsReport } from '../../types/insights';
import { NeuroSwitch } from '../ui/NeuroSwitch';

const IconW: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const ChevronLeft   = (p: any) => <IconW icon={ArrowLeft01IconData} {...p} />;
const ChevronRight  = (p: any) => <IconW icon={ArrowRight01IconData} {...p} />;
const Maximize2     = (p: any) => <IconW icon={Maximize02IconData} {...p} />;
const RefreshIcon   = (p: any) => <IconW icon={RefreshIconData} {...p} />;
const SettingsIcon  = (p: any) => <IconW icon={Settings01IconData} {...p} />;
const BulbIcon      = (p: any) => <IconW icon={Bulb01IconData} {...p} />;
const ArrowUp       = (p: any) => <IconW icon={ArrowUp01IconData} {...p} />;
const ArrowDown     = (p: any) => <IconW icon={ArrowDown01IconData} {...p} />;
const ExternalLink  = (p: any) => <IconW icon={ExternalLinkIconData} {...p} />;
const BackArrow     = (p: any) => <IconW icon={ArrowLeft02IconData} {...p} />;
const ClockIcon     = (p: any) => <IconW icon={ClockIconData} {...p} />;
const CalCheck      = (p: any) => <IconW icon={CalendarCheckIconData} {...p} />;

// ─── Default section prefs ────────────────────────────────────────────────────
const DEFAULT_PREFS = { recommendations: true, synthesis: true, trends: true, timestamp: true };
const PREFS_KEY = 'insights-card-prefs';

function loadPrefs(): typeof DEFAULT_PREFS {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_PREFS };
}

function savePrefs(prefs: typeof DEFAULT_PREFS) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch {}
}

// ─── Parse recommendation text into bullet points ────────────────────────────
function parsePoints(text: string): string[] {
  if (!text) return [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const points: string[] = [];
  for (const line of lines) {
    // Strip leading bullet chars / numbers
    const clean = line.replace(/^(\d+[.)]\s*|[-•*]\s*)/, '').trim();
    if (clean) points.push(clean);
  }
  return points.length > 0 ? points : [text.trim()];
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface CompactCalendarProps {
  resourcesByDate: { [date: string]: any[] };
  tasksByDate?: { [date: string]: any[] };
  milestonesByDate?: { [date: string]: any[] };
  activityByDate?: { [date: string]: number };
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
  onExpandClick: () => void;
  // Insights props (all optional — backwards compatible)
  insightsReport?: InsightsReport | null;
  onViewFullReport?: () => void;
  onRegenerateInsights?: () => void;
}

const ITEMS_PER_PAGE = 4; // recommendation bullet points per page

const CompactCalendar: React.FC<CompactCalendarProps> = ({
  resourcesByDate,
  tasksByDate = {},
  milestonesByDate = {},
  activityByDate = {},
  onDateSelect,
  selectedDate,
  onExpandClick,
  insightsReport,
  onViewFullReport,
  onRegenerateInsights,
}) => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  // Flip state
  const [flipped, setFlipped] = useState(false);

  // Settings / schedule panel
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  // Section prefs
  const [prefs, setPrefs] = useState<typeof DEFAULT_PREFS>(loadPrefs);

  // Recommendation pagination
  const [recPage, setRecPage] = useState(0);
  const [recSlide, setRecSlide] = useState<'enter-right' | 'active' | 'exit-left'>('active');

  // Schedule form state
  const [schedMode, setSchedMode] = useState<'manual' | 'daily' | 'interval'>('manual');
  const [schedTime, setSchedTime] = useState('08:00');
  const [schedDays, setSchedDays] = useState(1);
  const [schedSaved, setSchedSaved] = useState(false);
  const [schedLoading, setSchedLoading] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);

  // Load current schedule on open
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

  // Reset rec page when report changes
  useEffect(() => { setRecPage(0); }, [insightsReport]);

  // Close settings dropdown on outside click
  useEffect(() => {
    if (!settingsOpen && !scheduleOpen) return;
    const handler = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
        setScheduleOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [settingsOpen, scheduleOpen]);

  const updatePref = useCallback((key: keyof typeof DEFAULT_PREFS, val: boolean) => {
    const next = { ...prefs, [key]: val };
    setPrefs(next);
    savePrefs(next);
  }, [prefs]);

  // ── Calendar helpers ──────────────────────────────────────────────────────
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  useEffect(() => {
    if (!isSameMonth(currentMonth, selectedDate)) setCurrentMonth(selectedDate);
  }, [selectedDate]);

  const getActivityIndicator = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return {
      resourceCount: resourcesByDate[dateKey]?.length || 0,
      taskCount: tasksByDate[dateKey]?.length || 0,
      milestoneCount: milestonesByDate[dateKey]?.length || 0,
    };
  };

  // ── Insights data helpers ─────────────────────────────────────────────────
  const recPoints = useMemo(() => {
    if (!insightsReport?.passes) return [];
    // Gather points from recommendations pass, falling back to synthesis, then all passes
    const recPass = insightsReport.passes.find(p => p.key === 'recommendations');
    if (recPass?.output) {
      const pts = parsePoints(recPass.output);
      if (pts.length > 0) return pts;
    }
    // Fallback: gather non-empty pass outputs (skip "no data" messages)
    const allPoints: string[] = [];
    for (const p of insightsReport.passes) {
      if (p.key === 'synthesis') continue;
      if (!p.output || (p.output.toLowerCase().includes('no ') && p.output.toLowerCase().includes('data available')) || p.output.toLowerCase().startsWith('no new ')) continue;
      const pts = parsePoints(p.output);
      allPoints.push(...pts);
    }
    return allPoints;
  }, [insightsReport]);

  const totalRecPages = Math.max(1, Math.ceil(recPoints.length / ITEMS_PER_PAGE));
  const currentRecItems = recPoints.slice(recPage * ITEMS_PER_PAGE, (recPage + 1) * ITEMS_PER_PAGE);

  const navigatePage = (dir: 1 | -1) => {
    const next = recPage + dir;
    if (next < 0 || next >= totalRecPages) return;
    setRecSlide(dir === 1 ? 'exit-left' : 'enter-right');
    setTimeout(() => {
      setRecPage(next);
      setRecSlide(dir === 1 ? 'enter-right' : 'exit-left');
      setTimeout(() => setRecSlide('active'), 30);
    }, 200);
  };

  const formattedDate = insightsReport?.generated_at
    ? new Date(insightsReport.generated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null;

  const allSectionsHidden = !prefs.recommendations && !prefs.synthesis && !prefs.trends && !prefs.timestamp;

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

  const hasInsights = !!insightsReport;

  return (
    <div className="cc-flip-container" style={{ perspective: '1000px' }}>
      <div className={`cc-flip-inner${flipped ? ' cc-flipped' : ''}`}>

        {/* ══ FRONT — Calendar ══ */}
        <div className="cc-flip-front cc-widget" data-tutorial="analytics-calendar-widget">
          {/* Header */}
          <div className="cc-header" data-tutorial="analytics-calendar-navigation">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="cc-nav-btn">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="cc-title">{format(currentMonth, 'MMM yyyy')}</h3>
            <div className="cc-header-actions">
              {hasInsights && (
                <button
                  onClick={() => setFlipped(true)}
                  className="cc-expand-btn cc-insights-flip-btn"
                  title="View insights"
                >
                  <BulbIcon className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={onExpandClick} className="cc-expand-btn" title="Expand calendar">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="cc-nav-btn">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="cc-body">
            <div className="cc-weekday-row">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <div key={idx} className="cc-weekday">{day}</div>
              ))}
            </div>
            <div className="cc-days-grid">
              {monthDays.map((day, idx) => {
                const { resourceCount, taskCount, milestoneCount } = getActivityIndicator(day);
                const isSelected = isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const hasActivity = resourceCount > 0 || taskCount > 0 || milestoneCount > 0;
                return (
                  <button
                    key={idx}
                    onClick={() => isCurrentMonth && onDateSelect(day)}
                    disabled={!isCurrentMonth}
                    className={`cc-day${isSelected ? ' cc-day-selected' : ''}${isTodayDate && !isSelected ? ' cc-day-today' : ''}${!isCurrentMonth ? ' cc-day-outside' : ''}`}
                  >
                    <span className="cc-day-num">{format(day, 'd')}</span>
                    {hasActivity && isCurrentMonth && (
                      <div className="cc-dots">
                        {resourceCount > 0 && <div className={`cc-dot ${isSelected ? 'cc-dot-selected' : 'cc-dot-resource'}`} />}
                        {taskCount > 0 && <div className={`cc-dot ${isSelected ? 'cc-dot-selected' : 'cc-dot-task'}`} />}
                        {milestoneCount > 0 && <div className={`cc-dot ${isSelected ? 'cc-dot-selected' : 'cc-dot-milestone'}`} />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="cc-legend" data-tutorial="analytics-calendar-legend">
              <div className="cc-legend-item"><div className="cc-legend-dot cc-dot-resource" /><span>{t('widgets.resources')}</span></div>
              <div className="cc-legend-item"><div className="cc-legend-dot cc-dot-task" /><span>{t('widgets.tasks')}</span></div>
              <div className="cc-legend-item"><div className="cc-legend-dot cc-dot-milestone" /><span>{t('widgets.milestones')}</span></div>
            </div>
          </div>
        </div>

        {/* ══ BACK — Insights ══ */}
        <div className="cc-flip-back cc-widget">
          {/* Back Header */}
          <div className="cc-header">
            <button onClick={() => { setFlipped(false); setSettingsOpen(false); setScheduleOpen(false); }} className="cc-nav-btn" title="Back to calendar">
              <BackArrow className="w-4 h-4" />
            </button>
            <h3 className="cc-title">
              <BulbIcon className="w-3.5 h-3.5" style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              Insights
              {insightsReport?.reminders && insightsReport.reminders.length > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  marginLeft: 6, fontSize: '0.6rem', fontWeight: 700,
                  background: 'var(--dash-orange, #f59e0b)', color: '#fff',
                  borderRadius: '9999px', minWidth: 16, height: 16, padding: '0 4px',
                }} title={`${insightsReport.reminders.length} area${insightsReport.reminders.length > 1 ? 's' : ''} need attention`}>
                  {insightsReport.reminders.length}
                </span>
              )}
            </h3>
            <div className="cc-header-actions" ref={settingsRef} style={{ position: 'relative' }}>
              {onRegenerateInsights && (
                <button onClick={onRegenerateInsights} className="cc-expand-btn" title="Regenerate insights">
                  <RefreshIcon className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => { setSettingsOpen(o => !o); setScheduleOpen(false); }}
                className="cc-expand-btn"
                title="Settings"
              >
                <SettingsIcon className="w-3.5 h-3.5" />
              </button>

              {/* Settings dropdown */}
              {settingsOpen && !scheduleOpen && (
                <div className="cc-settings-dropdown">
                  <p className="cc-dropdown-label">Show on card</p>
                  {([
                    ['recommendations', 'Recommendations'],
                    ['synthesis', 'Summary'],
                    ['trends', 'Trends'],
                    ['timestamp', 'Last generated'],
                  ] as [keyof typeof DEFAULT_PREFS, string][]).map(([key, label]) => (
                    <label key={key} className="cc-toggle-row">
                      <span className="cc-toggle-label">{label}</span>
                      <NeuroSwitch
                        checked={prefs[key]}
                        onChange={(v) => updatePref(key, v)}
                        size="sm"
                        aria-label={label}
                      />
                    </label>
                  ))}
                  <div className="cc-dropdown-divider" />
                  <button className="cc-dropdown-action" onClick={() => { setScheduleOpen(true); setSettingsOpen(false); }}>
                    <CalCheck className="w-3 h-3" style={{ marginRight: 5 }} />
                    Schedule Insights
                  </button>
                </div>
              )}

              {/* Schedule panel */}
              {scheduleOpen && (
                <div className="cc-settings-dropdown cc-schedule-panel">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <button className="cc-sched-back" onClick={() => { setScheduleOpen(false); setSettingsOpen(true); }}>
                      <BackArrow className="w-3 h-3" />
                    </button>
                    <p className="cc-dropdown-label" style={{ margin: 0 }}>Schedule Insights</p>
                  </div>

                  {(['manual', 'daily', 'interval'] as const).map(m => (
                    <label key={m} className={`cc-sched-option${schedMode === m ? ' cc-sched-selected' : ''}`}>
                      <input type="radio" name="schedMode" value={m} checked={schedMode === m} onChange={() => setSchedMode(m)} style={{ display: 'none' }} />
                      <span className="cc-sched-dot" />
                      <span className="cc-sched-option-label">
                        {m === 'manual' ? 'Manual only' : m === 'daily' ? 'Daily' : 'Every N days'}
                      </span>
                    </label>
                  ))}

                  {(schedMode === 'daily' || schedMode === 'interval') && (
                    <div className="cc-sched-fields">
                      {schedMode === 'interval' && (
                        <div className="cc-sched-field">
                          <label className="cc-sched-field-label">Every</label>
                          <input
                            type="number" min={1} max={14} value={schedDays}
                            onChange={e => setSchedDays(Math.max(1, Math.min(14, Number(e.target.value))))}
                            className="cc-sched-input cc-sched-input-sm"
                          />
                          <span className="cc-sched-field-label">day(s)</span>
                        </div>
                      )}
                      <div className="cc-sched-field">
                        <label className="cc-sched-field-label"><ClockIcon className="w-3 h-3" /></label>
                        <input
                          type="time" value={schedTime}
                          onChange={e => setSchedTime(e.target.value)}
                          className="cc-sched-input"
                        />
                      </div>
                    </div>
                  )}

                  <button className="cc-sched-save" onClick={saveSchedule} disabled={schedLoading}>
                    {schedSaved ? '✓ Saved' : schedLoading ? 'Saving…' : 'Save Schedule'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Back Body */}
          <div className="cc-back-body">
            {!insightsReport ? (
              <div className="cc-empty-state">
                <BulbIcon className="w-6 h-6" style={{ opacity: 0.35, marginBottom: 8 }} />
                <p className="cc-empty-title">{t('widgets.noInsightsYet')}</p>
                <p className="cc-empty-sub">Open Educator Insights to generate your first report.</p>
                {onViewFullReport && (
                  <button className="cc-view-btn" style={{ marginTop: 10 }} onClick={onViewFullReport}>
                    Open Insights <ExternalLink className="w-3 h-3" style={{ marginLeft: 4 }} />
                  </button>
                )}
              </div>
            ) : allSectionsHidden ? (
              <div className="cc-empty-state">
                <SettingsIcon className="w-6 h-6" style={{ opacity: 0.35, marginBottom: 8 }} />
                <p className="cc-empty-title">{t('widgets.nothingToShow')}</p>
                <p className="cc-empty-sub">Use the ⚙ menu to choose what to display.</p>
              </div>
            ) : (
              <>
                {/* Recommendations — paginated */}
                {prefs.recommendations && recPoints.length > 0 && (
                  <div className="cc-rec-container">
                    <div className="cc-rec-header">
                      <BulbIcon className="w-3 h-3" style={{ color: 'var(--dash-orange)', flexShrink: 0 }} />
                      <span className="cc-section-title">{t('widgets.recommendations')}</span>
                    </div>
                    <div className="cc-rec-items">
                      {currentRecItems.map((item, i) => (
                        <div key={`${recPage}-${i}`} className="cc-rec-item">
                          <span className="cc-rec-bullet">•</span>
                          <span className="cc-rec-text">{item}</span>
                        </div>
                      ))}
                    </div>
                    {totalRecPages > 1 && (
                      <div className="cc-rec-nav">
                        <button className="cc-rec-nav-btn" onClick={() => navigatePage(-1)} disabled={recPage === 0}>
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        <span className="cc-rec-page-indicator">{recPage + 1} / {totalRecPages}</span>
                        <button className="cc-rec-nav-btn" onClick={() => navigatePage(1)} disabled={recPage >= totalRecPages - 1}>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Reminders */}
                {insightsReport?.reminders && insightsReport.reminders.length > 0 && (
                  <div className="cc-section">
                    <div className="cc-rec-header">
                      <span style={{ fontSize: '0.7rem' }}>💡</span>
                      <span className="cc-section-title">Reminders</span>
                    </div>
                    <div className="cc-rec-items">
                      {insightsReport.reminders.map((r, i) => (
                        <div key={i} className="cc-rec-item">
                          <span className="cc-rec-bullet" style={{ color: 'var(--dash-orange, #f59e0b)' }}>•</span>
                          <span className="cc-rec-text">{r.suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Synthesis */}
                {prefs.synthesis && (() => {
                  const synthText = insightsReport.synthesis
                    || insightsReport.passes?.find(p => p.key === 'synthesis')?.output
                    || '';
                  if (!synthText) return null;
                  // Strip markdown headers for compact display
                  const cleanText = synthText.replace(/^#+\s+/gm, '').trim();
                  return (
                    <div className="cc-section">
                      <div className="cc-section-header">
                        <ArrowUp className="w-3 h-3" style={{ color: 'var(--dash-primary)', flexShrink: 0 }} />
                        <span className="cc-section-title">Summary</span>
                      </div>
                      <p className="cc-synthesis-text">{cleanText}</p>
                    </div>
                  );
                })()}

                {/* Timestamp + actions */}
                {prefs.timestamp && formattedDate && (
                  <div className="cc-section cc-timestamp-row">
                    <ClockIcon className="w-3 h-3" style={{ opacity: 0.5, flexShrink: 0 }} />
                    <span className="cc-timestamp-text">{formattedDate}</span>
                    {onViewFullReport && (
                      <button className="cc-view-btn cc-view-btn-sm" onClick={onViewFullReport} title="View full report">
                        Full report <ExternalLink className="w-2.5 h-2.5" style={{ marginLeft: 3 }} />
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* ════════════════════════════════════════════════
           Compact Calendar — Flip Card + Insights Back
           ════════════════════════════════════════════════ */

        /* ── Flip container ── */
        .cc-flip-container {
          perspective: 1000px;
        }
        .cc-flip-inner {
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cc-flip-inner.cc-flipped {
          transform: rotateY(180deg);
        }
        .cc-flip-front {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .cc-flip-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: rotateY(180deg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* ── Shared widget shell ── */
        .cc-widget {
          border-radius: 1rem;
          overflow: hidden;
          background: var(--dash-card-bg, white);
          border: 1px solid var(--dash-border, #E8E8E0);
          box-shadow: 0 1px 3px var(--dash-card-shadow, rgba(0,0,0,0.04));
        }

        /* ── Header ── */
        .cc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 0.75rem;
          background: var(--dash-primary, #1D362D);
          flex-shrink: 0;
        }
        .cc-nav-btn {
          display: flex; align-items: center; justify-content: center;
          width: 1.625rem; height: 1.625rem;
          border-radius: 0.375rem; border: none;
          background: transparent;
          color: var(--dash-primary-fg, #F8E59D);
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .cc-nav-btn:hover { background: rgba(255,255,255,0.12); }
        .cc-title {
          font-size: 0.875rem; font-weight: 700;
          color: var(--dash-primary-fg, #F8E59D);
          letter-spacing: -0.01em;
          display: flex; align-items: center;
        }
        .cc-header-actions { display: flex; align-items: center; gap: 0.25rem; }
        .cc-expand-btn {
          display: flex; align-items: center; justify-content: center;
          width: 1.625rem; height: 1.625rem;
          border-radius: 0.375rem; border: none;
          background: transparent;
          color: var(--dash-primary-fg, #F8E59D);
          cursor: pointer; opacity: 0.7;
          transition: all 0.15s ease;
        }
        .cc-expand-btn:hover { opacity: 1; background: rgba(255,255,255,0.12); }
        .cc-insights-flip-btn { opacity: 0.85; }
        .cc-insights-flip-btn:hover { opacity: 1; }

        /* ── Calendar body ── */
        .cc-body { padding: 0.75rem; background: var(--dash-card-bg, white); }
        .cc-weekday-row {
          display: grid; grid-template-columns: repeat(7,1fr);
          gap: 1px; margin-bottom: 0.375rem;
        }
        .cc-weekday {
          text-align: center; font-size: 0.75rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.05em;
          color: var(--dash-text-sub, #94A3B8); padding-bottom: 0.25rem;
        }
        .cc-days-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 2px; }
        .cc-day {
          position: relative; aspect-ratio: 1;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          border-radius: 0.375rem; border: none; background: transparent;
          cursor: pointer; transition: all 0.12s ease; padding: 0;
        }
        .cc-day:hover:not(:disabled):not(.cc-day-selected) { background: var(--dash-gold-a25, #F5F5F0); }
        .cc-day:disabled { cursor: default; }
        .cc-day-num {
          font-size: 0.875rem; font-weight: 500;
          color: var(--dash-text, #374151); line-height: 1;
          position: relative; z-index: 1; transition: color 0.12s ease;
        }
        .cc-day-outside { opacity: 0.25; }
        .cc-day-outside .cc-day-num { color: var(--dash-text-faint, #9ca3af); }
        .cc-day-selected {
          background: var(--dash-primary, #1D362D) !important;
          box-shadow: 0 2px 6px var(--dash-primary-a25, rgba(29,54,45,0.2));
        }
        .cc-day-selected .cc-day-num { color: var(--dash-primary-fg, #F8E59D); font-weight: 700; }
        .cc-day-today { background: transparent; box-shadow: inset 0 0 0 1.5px var(--dash-orange, #F2A631); }
        .cc-day-today .cc-day-num { color: var(--dash-orange, #F2A631); font-weight: 700; }
        .cc-dots {
          display: flex; gap: 1.5px;
          position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%);
        }
        .cc-dot { width: 3px; height: 3px; border-radius: 50%; }
        .cc-dot-resource  { background: var(--dash-primary, #1D362D); }
        .cc-dot-task      { background: var(--dash-orange, #F2A631); }
        .cc-dot-milestone { background: var(--dash-text-sub, #94A3B8); }
        .cc-dot-selected  { background: var(--dash-primary-fg, #F8E59D) !important; }
        .cc-legend {
          display: flex; align-items: center; justify-content: center;
          gap: 0.75rem; margin-top: 0.625rem; padding-top: 0.5rem;
          border-top: 1px solid var(--dash-border, #E8E8E0);
        }
        .cc-legend-item {
          display: flex; align-items: center; gap: 0.25rem;
          font-size: 0.625rem; color: var(--dash-text-sub, #94A3B8);
        }
        .cc-legend-dot { width: 5px; height: 5px; border-radius: 50%; }

        /* ── Insights back body ── */
        .cc-back-body {
          flex: 1; min-height: 0; overflow: hidden;
          padding: 0.625rem 0.75rem;
          display: flex; flex-direction: column; gap: 0.5rem;
        }

        /* ── Empty states ── */
        .cc-empty-state {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
          padding: 1rem; color: var(--dash-text-sub, #94A3B8);
        }
        .cc-empty-title { font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem; color: var(--dash-text, #374151); }
        .cc-empty-sub { font-size: 0.7rem; line-height: 1.4; }

        /* ── Section shared ── */
        .cc-section { display: flex; flex-direction: column; gap: 0.25rem; }
        .cc-section-header { display: flex; align-items: center; gap: 0.3rem; }
        .cc-section-title { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--dash-text-sub, #94A3B8); }

        /* ── Recommendations ── */
        .cc-rec-container {
          display: flex; flex-direction: column; gap: 0.25rem;
          flex: 1; min-height: 0; overflow: hidden;
        }
        .cc-rec-header { display: flex; align-items: center; gap: 0.3rem; flex-shrink: 0; }
        .cc-rec-items {
          display: flex; flex-direction: column; gap: 0.3rem;
          flex: 1; min-height: 0; overflow-y: auto;
        }
        .cc-rec-item { display: flex; align-items: flex-start; gap: 0.3rem; }
        .cc-rec-bullet { color: var(--dash-orange, #F2A631); font-size: 0.75rem; flex-shrink: 0; line-height: 1.5; }
        .cc-rec-text { font-size: 0.7rem; color: var(--dash-text, #374151); line-height: 1.5; }
        .cc-rec-nav {
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          padding-top: 0.2rem; border-top: 1px solid var(--dash-border, #E8E8E0);
        }
        .cc-rec-nav-btn {
          display: flex; align-items: center; justify-content: center;
          width: 1.25rem; height: 1.25rem; border-radius: 0.25rem; border: none;
          background: transparent; color: var(--dash-text-sub, #94A3B8);
          cursor: pointer; transition: all 0.12s ease;
        }
        .cc-rec-nav-btn:hover:not(:disabled) { background: var(--dash-gold-a25, #F5F5F0); color: var(--dash-text, #374151); }
        .cc-rec-nav-btn:disabled { opacity: 0.3; cursor: default; }
        .cc-rec-page-indicator { font-size: 0.625rem; color: var(--dash-text-sub, #94A3B8); min-width: 2.5rem; text-align: center; }

        /* ── Synthesis ── */
        .cc-synthesis-text { font-size: 0.7rem; color: var(--dash-text, #374151); line-height: 1.5; }

        /* ── Timestamp row ── */
        .cc-timestamp-row {
          flex-direction: row; align-items: center; gap: 0.3rem;
          flex-shrink: 0; padding-top: 0.25rem;
          border-top: 1px solid var(--dash-border, #E8E8E0);
        }
        .cc-timestamp-text { font-size: 0.625rem; color: var(--dash-text-sub, #94A3B8); flex: 1; }

        /* ── View / action buttons ── */
        .cc-view-btn {
          display: inline-flex; align-items: center;
          font-size: 0.675rem; font-weight: 600;
          color: var(--dash-primary, #1D362D);
          background: var(--dash-gold-a25, #F5F5F0);
          border: 1px solid var(--dash-border, #E8E8E0);
          border-radius: 0.375rem; padding: 0.25rem 0.5rem;
          cursor: pointer; transition: all 0.15s ease; white-space: nowrap;
        }
        .cc-view-btn:hover { background: var(--dash-border, #E8E8E0); }
        .cc-view-btn-sm { font-size: 0.6rem; padding: 0.15rem 0.375rem; }

        /* ── Settings dropdown ── */
        .cc-settings-dropdown {
          position: absolute; top: calc(100% + 6px); right: 0; z-index: 50;
          background: var(--dash-card-bg, white);
          border: 1px solid var(--dash-border, #E8E8E0);
          border-radius: 0.625rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          padding: 0.625rem;
          min-width: 180px;
          display: flex; flex-direction: column; gap: 0.35rem;
        }
        .cc-dropdown-label { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--dash-text-sub, #94A3B8); margin-bottom: 0.15rem; }
        .cc-toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding: 0.2rem 0; }
        .cc-toggle-label { font-size: 0.7rem; color: var(--dash-text, #374151); }
        .cc-dropdown-divider { height: 1px; background: var(--dash-border, #E8E8E0); margin: 0.15rem 0; }
        .cc-dropdown-action {
          display: flex; align-items: center;
          font-size: 0.7rem; color: var(--dash-primary, #1D362D); font-weight: 600;
          background: none; border: none; cursor: pointer; padding: 0.2rem 0;
          transition: opacity 0.15s;
        }
        .cc-dropdown-action:hover { opacity: 0.75; }

        /* ── Schedule panel ── */
        .cc-schedule-panel { min-width: 200px; }
        .cc-sched-back {
          display: flex; align-items: center; justify-content: center;
          width: 18px; height: 18px; border-radius: 4px; border: none;
          background: var(--dash-gold-a25, #F5F5F0); color: var(--dash-text, #374151);
          cursor: pointer;
        }
        .cc-sched-option {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.3rem 0.4rem; border-radius: 0.375rem;
          cursor: pointer; transition: background 0.12s ease;
        }
        .cc-sched-option:hover { background: var(--dash-gold-a25, #F5F5F0); }
        .cc-sched-selected { background: var(--dash-gold-a25, #F5F5F0); }
        .cc-sched-dot {
          width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
          border: 2px solid var(--dash-border, #E8E8E0);
          transition: border-color 0.15s, background 0.15s;
        }
        .cc-sched-selected .cc-sched-dot { border-color: var(--dash-primary, #1D362D); background: var(--dash-primary, #1D362D); }
        .cc-sched-option-label { font-size: 0.7rem; color: var(--dash-text, #374151); }
        .cc-sched-fields { display: flex; flex-direction: column; gap: 0.35rem; padding: 0.35rem 0 0.1rem; }
        .cc-sched-field { display: flex; align-items: center; gap: 0.4rem; }
        .cc-sched-field-label { font-size: 0.625rem; color: var(--dash-text-sub, #94A3B8); display: flex; align-items: center; }
        .cc-sched-input {
          flex: 1; font-size: 0.7rem; padding: 0.2rem 0.4rem;
          border: 1px solid var(--dash-border, #E8E8E0); border-radius: 0.375rem;
          background: var(--dash-card-bg, white); color: var(--dash-text, #374151);
          outline: none;
        }
        .cc-sched-input:focus { border-color: var(--dash-primary, #1D362D); }
        .cc-sched-input-sm { max-width: 52px; }
        .cc-sched-save {
          margin-top: 0.5rem;
          width: 100%; padding: 0.35rem; border-radius: 0.375rem; border: none;
          background: var(--dash-primary, #1D362D); color: var(--dash-primary-fg, #F8E59D);
          font-size: 0.7rem; font-weight: 600; cursor: pointer;
          transition: opacity 0.15s;
        }
        .cc-sched-save:hover:not(:disabled) { opacity: 0.85; }
        .cc-sched-save:disabled { opacity: 0.6; cursor: default; }
      `}</style>
    </div>
  );
};

export default CompactCalendar;
