import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getPhaseAbbreviation } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import Calendar01IconData from '@hugeicons/core-free-icons/Calendar01Icon';
import AlertCircleIconData from '@hugeicons/core-free-icons/AlertCircleIcon';
import CheckmarkCircle01IconData from '@hugeicons/core-free-icons/CheckmarkCircle01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import { milestoneApi } from '../lib/milestoneApi';
import { useCurrentPhase, type CurrentPhaseInfo } from '../hooks/useCurrentPhase';
import type { Milestone } from '../types/milestone';
import type { AcademicPhase } from '../types/insights';
import { format, parseISO } from 'date-fns';
import { useSettings } from '../contexts/SettingsContext';
import { getTeacherGrades, GRADE_VALUE_MAP } from '../data/teacherConstants';
import { TreeBrowserSkeleton } from './ui/TreeBrowserSkeleton';

const Icon: React.FC<{ icon: any; size?: number; style?: React.CSSProperties }> = ({ icon, size = 16, style }) => (
  <HugeiconsIcon icon={icon} size={size} style={style} />
);

// Phase color map (matches PhaseHistoryNav)
const PHASE_COLORS: Record<string, string> = {
  term_1_early: '#3b82f6',
  term_1_midterm_prep: '#f97316',
  term_1_midterm: '#ef4444',
  term_1_late: '#6366f1',
  christmas_break: '#eab308',
  term_2_early: '#22c55e',
  term_2_midterm_prep: '#f97316',
  term_2_midterm: '#ef4444',
  term_2_late: '#14b8a6',
  easter_break: '#a855f7',
  term_3_early: '#06b6d4',
  term_3_late: '#0ea5e9',
  end_of_year_exam: '#ef4444',
  summer_vacation: '#84cc16',
};
const SEMESTER_COLORS: Record<string, string> = { 'Semester 1': '#3b82f6', 'Semester 2': '#22c55e' };
function getPhaseColor(key: string, semester: string | null): string {
  return PHASE_COLORS[key] || (semester ? SEMESTER_COLORS[semester] || '#6b7280' : '#6b7280');
}

interface CurriculumPlanProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  isActive?: boolean;
  onHeaderActions?: (actions: React.ReactNode) => void;
}

const CurriculumPlan: React.FC<CurriculumPlanProps> = ({ tabId, savedData, onDataChange, isActive, onHeaderActions }) => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const accentColor = settings.tabColors['curriculum-plan'] ?? '#3b82f6';

  const teacherId = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) { const u = JSON.parse(raw); return u.username || 'default_teacher'; }
    } catch {}
    return 'default_teacher';
  }, []);

  const { currentPhase, allPhases, loading: phasesLoading } = useCurrentPhase(teacherId);

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [activeEloId, setActiveEloId] = useState<string | null>(null);
  const [expandedGrades, setExpandedGrades] = useState<Set<string>>(new Set());

  const loadMilestones = useCallback(async () => {
    setLoading(true);
    try {
      await milestoneApi.initialize(teacherId);
      const data = await milestoneApi.getMilestones(teacherId);
      setMilestones(data);
    } catch (err) {
      console.error('Failed to load milestones:', err);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => { loadMilestones(); }, [loadMilestones]);

  // Filter milestones to only grades/subjects configured in settings (mirrors CurriculumTracker logic)
  const filteredMilestones = useMemo(() => {
    const gradeMapping = settings.profile.gradeSubjects || {};
    const filterOn = settings.profile.filterContentByProfile;
    if (!filterOn) return milestones;
    const tGrades = getTeacherGrades(gradeMapping);
    if (tGrades.length === 0) return milestones;
    return milestones.filter(m => {
      const gradeKey = (GRADE_VALUE_MAP[m.grade] || m.grade).toLowerCase();
      if (!tGrades.includes(gradeKey)) return false;
      if (gradeKey === 'k') return true; // Kindergarten uses "Unknown" subject — pass through
      const gradeSubjectList = gradeMapping[gradeKey] || [];
      return gradeSubjectList.length === 0 || gradeSubjectList.includes(m.subject);
    });
  }, [milestones, settings.profile.gradeSubjects, settings.profile.filterContentByProfile]);

  // Group milestones by grade → subject
  const grouped = useMemo(() => {
    const map = new Map<string, Map<string, Milestone[]>>();
    for (const m of filteredMilestones) {
      if (!map.has(m.grade)) map.set(m.grade, new Map());
      const subMap = map.get(m.grade)!;
      if (!subMap.has(m.subject)) subMap.set(m.subject, []);
      subMap.get(m.subject)!.push(m);
    }
    return map;
  }, [filteredMilestones]);

  // Count milestones per phase
  const phaseCountMap = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of filteredMilestones) {
      const key = m.phase_id || '__unassigned__';
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, [filteredMilestones]);

  const unassignedCount = phaseCountMap['__unassigned__'] || 0;

  useEffect(() => {
    if (!onHeaderActions) return;
    onHeaderActions(
      unassignedCount > 0 ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 8,
          background: 'rgba(245,158,11,0.15)', fontSize: 13, fontWeight: 600,
          color: '#f59e0b',
        }}>
          <HugeiconsIcon icon={AlertCircleIconData} size={16} style={{ color: '#fbbf24' }} />
          {unassignedCount} Unassigned ELO{unassignedCount !== 1 ? 's' : ''}
        </div>
      ) : null
    );
  }, [unassignedCount, onHeaderActions]);

  useEffect(() => {
    return () => { onHeaderActions?.(null); };
  }, [onHeaderActions]);

  // Assign a single ELO to a phase
  const handleAssignSingle = async (eloId: string, phaseId: string | null) => {
    try {
      await milestoneApi.bulkAssignPhase([eloId], phaseId);
      setActiveEloId(null);
      await loadMilestones();
    } catch (err) {
      console.error('Failed to assign phase:', err);
    }
  };

  const toggleGrade = (grade: string) => {
    setExpandedGrades(prev => {
      const next = new Set(prev);
      next.has(grade) ? next.delete(grade) : next.add(grade);
      return next;
    });
  };

  const getPhaseBadge = (phaseId: string | null) => {
    if (!phaseId) return null;
    const phase = allPhases.find(p => p.id === phaseId);
    if (!phase) return null;
    const color = getPhaseColor(phase.phase_key, phase.semester);
    const short = getPhaseAbbreviation(phase.phase_key, phase.phase_label);
    return (
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          padding: '1px 6px',
          borderRadius: 4,
          background: `${color}20`,
          color: color,
          border: `1px solid ${color}40`,
          whiteSpace: 'nowrap',
        }}
        title={phase.phase_label}
      >
        {short}
      </span>
    );
  };

  if (phasesLoading || loading) {
    return <TreeBrowserSkeleton accentColor={accentColor} />;
  }

  if (allPhases.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
        <Icon icon={Calendar01IconData} size={40} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No school year phases configured.</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Set up your school year in Educator Insights to assign milestones to phases.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Main content: phases sidebar + milestones */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: Phase list */}
        <div style={{
          width: 220, flexShrink: 0,
          borderRight: '1px solid var(--border-default)',
          overflowY: 'auto', padding: '12px 0',
          background: 'var(--bg-secondary)',
        }}>
          <div style={{ padding: '0 12px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Phases
          </div>
          {allPhases.map(p => {
            const color = getPhaseColor(p.phase_key, p.semester);
            const count = phaseCountMap[p.id] || 0;
            const isCurrent = currentPhase?.id === p.id;
            const isSelected = selectedPhaseId === p.id;
            // When an ELO is active, find its current phase for pre-checking
            const activeEloPhaseId = activeEloId
              ? filteredMilestones.find(m => m.id === activeEloId)?.phase_id ?? null
              : null;
            const isChecked = activeEloId !== null && activeEloPhaseId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => activeEloId ? handleAssignSingle(activeEloId, p.id) : setSelectedPhaseId(isSelected ? null : p.id)}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  borderLeft: `3px solid ${isSelected ? color : 'transparent'}`,
                  background: isSelected ? `${color}10` : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {getPhaseBadge(p.id)}
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{p.phase_label}</span>
                  {isCurrent && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}` }} />
                  )}
                  {/* Radio-style checkbox when an ELO is active */}
                  {activeEloId !== null && (
                    <input
                      type="radio"
                      readOnly
                      checked={isChecked}
                      style={{ accentColor: color, flexShrink: 0, pointerEvents: 'none' }}
                    />
                  )}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {format(parseISO(p.start_date), 'MMM d')} &ndash; {format(parseISO(p.end_date), 'MMM d')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {count} ELO{count !== 1 ? 's' : ''}
                </div>
              </div>
            );
          })}
          {/* Unassigned section */}
          <div
            onClick={() => activeEloId ? handleAssignSingle(activeEloId, null) : setSelectedPhaseId(selectedPhaseId === '__unassigned__' ? null : '__unassigned__')}
            style={{
              padding: '10px 14px',
              cursor: 'pointer',
              borderLeft: `3px solid ${selectedPhaseId === '__unassigned__' ? '#f59e0b' : 'transparent'}`,
              background: selectedPhaseId === '__unassigned__' ? '#f59e0b10' : 'transparent',
              borderTop: '1px solid var(--border-default)',
              marginTop: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon icon={AlertCircleIconData} size={14} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: unassignedCount > 0 ? '#f59e0b' : 'var(--text-muted)', flex: 1 }}>
                Unassigned
              </span>
              {activeEloId !== null && (
                <input
                  type="radio"
                  readOnly
                  checked={filteredMilestones.find(m => m.id === activeEloId)?.phase_id == null}
                  style={{ accentColor: '#f59e0b', flexShrink: 0, pointerEvents: 'none' }}
                />
              )}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {unassignedCount} ELO{unassignedCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Right: Milestones grouped by grade/subject */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {/* Phase filter label */}
          {selectedPhaseId && selectedPhaseId !== '__unassigned__' && (() => {
            const phase = allPhases.find(p => p.id === selectedPhaseId);
            if (!phase) return null;
            const color = getPhaseColor(phase.phase_key, phase.semester);
            return (
              <div style={{
                marginBottom: 12, padding: '8px 14px', borderRadius: 8,
                background: `${color}10`, border: `1px solid ${color}30`,
                fontSize: 12, color, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                Showing milestones for: {phase.phase_label}
                <button
                  onClick={() => setSelectedPhaseId(null)}
                  style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Show all
                </button>
              </div>
            );
          })()}
          {selectedPhaseId === '__unassigned__' && (
            <div style={{
              marginBottom: 12, padding: '8px 14px', borderRadius: 8,
              background: '#f59e0b10', border: '1px solid #f59e0b30',
              fontSize: 12, color: '#f59e0b', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              Showing unassigned milestones only
              <button
                onClick={() => setSelectedPhaseId(null)}
                style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Show all
              </button>
            </div>
          )}

          {Array.from(grouped.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([grade, subjects]) => {
              // Filter milestones by selected phase
              const filteredSubjects = new Map<string, Milestone[]>();
              for (const [subj, ms] of subjects) {
                const filtered = ms.filter(m => {
                  if (!selectedPhaseId) return true;
                  if (selectedPhaseId === '__unassigned__') return !m.phase_id;
                  return m.phase_id === selectedPhaseId;
                });
                if (filtered.length > 0) filteredSubjects.set(subj, filtered);
              }
              if (filteredSubjects.size === 0) return null;

              const isExpanded = expandedGrades.has(grade);
              return (
                <div key={grade} style={{ marginBottom: 12 }}>
                  <div
                    onClick={() => toggleGrade(grade)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 0', cursor: 'pointer', userSelect: 'none',
                    }}
                  >
                    <HugeiconsIcon icon={isExpanded ? ArrowDown01IconData : ArrowRight01IconData} size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {grade === 'K' ? 'Kindergarten' : grade.startsWith('Grade') ? grade : `Grade ${grade}`}
                    </span>
                  </div>
                  {isExpanded && Array.from(filteredSubjects.entries())
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([subject, ms]) => (
                      <div key={subject} style={{ marginLeft: 20, marginBottom: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                          {subject}
                        </div>
                        {ms.map(m => {
                          const isActive = activeEloId === m.id;
                          return (
                            <div
                              key={m.id}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '6px 10px', marginBottom: 2,
                                borderRadius: 6,
                                background: isActive ? `${accentColor}18` : 'transparent',
                                border: isActive ? `1px solid ${accentColor}40` : '1px solid transparent',
                                cursor: 'pointer',
                                transition: 'background 0.1s ease',
                              }}
                              onClick={() => setActiveEloId(isActive ? null : m.id)}
                            >
                              {m.status === 'completed' && (
                                <Icon icon={CheckmarkCircle01IconData} size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
                              )}
                              <span style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>
                                {m.topic_title}
                              </span>
                              {getPhaseBadge(m.phase_id)}
                              {!m.phase_id && (
                                <span style={{
                                  fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 4,
                                  background: '#f59e0b18', color: '#f59e0b', border: '1px solid #f59e0b30',
                                }}>
                                  unassigned
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))
                  }
                </div>
              );
            })}

          {filteredMilestones.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 14 }}>
              No milestones found. Initialize your curriculum in the Progress Tracker first.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default CurriculumPlan;
