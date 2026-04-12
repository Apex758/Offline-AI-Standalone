import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { API_CONFIG } from '../config/api.config';
import type { SchoolYearConfig, AcademicPhase } from '../types/insights';

interface Props {
  teacherId: string;
  onClose: () => void;
  onSaved: (config: SchoolYearConfig, phases: AcademicPhase[]) => void;
}

interface CaribbeanDates {
  year_start: string;
  sem1_end: string;
  break_end: string;
  year_end: string;
  midterm1_start: string;
  midterm1_end: string;
  midterm2_start: string;
  midterm2_end: string;
  final_exam_start: string;
  final_exam_end: string;
}

const defaultDates: CaribbeanDates = {
  year_start: '',
  sem1_end: '',
  break_end: '',
  year_end: '',
  midterm1_start: '',
  midterm1_end: '',
  midterm2_start: '',
  midterm2_end: '',
  final_exam_start: '',
  final_exam_end: '',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid var(--dash-border)',
  backgroundColor: 'var(--dash-bg)',
  color: 'var(--dash-text)',
  fontSize: 13,
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--dash-text-sub)',
  marginBottom: 4,
  display: 'block',
};

const SchoolYearSetupModal: React.FC<Props> = ({ teacherId, onClose, onSaved }) => {
  const { t } = useTranslation();
  const STEPS = [t('calendar.structure'), t('calendar.keyDates'), t('calendar.midterms'), t('calendar.finalExams'), t('calendar.preview')];
  const [step, setStep] = useState(0);
  const [structureType, setStructureType] = useState<'caribbean_three_term' | 'generic'>('caribbean_three_term');
  const [label, setLabel] = useState('');
  const [dates, setDates] = useState<CaribbeanDates>(defaultDates);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setDate = (key: keyof CaribbeanDates, value: string) =>
    setDates(prev => ({ ...prev, [key]: value }));

  const canProceed = (): boolean => {
    if (step === 0) return structureType === 'caribbean_three_term' || structureType === 'generic';
    if (step === 1) return !!(label && dates.year_start && dates.sem1_end && dates.break_end && dates.year_end);
    if (step === 2) return !!(dates.midterm1_start && dates.midterm1_end && dates.midterm2_start && dates.midterm2_end);
    if (step === 3) return !!(dates.final_exam_start && dates.final_exam_end);
    return true;
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await axios.post(`${API_CONFIG.BASE_URL}/api/teacher-metrics/setup-caribbean-year`, {
        teacher_id: teacherId,
        label,
        structure_type: structureType,
        dates,
      });
      onSaved(res.data.config, res.data.phases);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to save school year. Please check the dates and try again.');
    } finally {
      setSaving(false);
    }
  };

  // Phase preview computed from dates
  const previewPhases = (): { label: string; start: string; end: string; semester: string | null }[] => {
    if (!dates.year_start || !dates.sem1_end || !dates.break_end || !dates.year_end) return [];
    try {
      const d = (s: string) => new Date(s);
      const addDays = (s: string, n: number) => {
        const dt = new Date(s);
        dt.setDate(dt.getDate() + n);
        return dt.toISOString().split('T')[0];
      };
      const fmt = (s: string) => {
        try { return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); } catch { return s; }
      };
      const mt1PrepStart = dates.midterm1_start ? addDays(dates.midterm1_start, -7) : '';
      const mt2PrepStart = dates.midterm2_start ? addDays(dates.midterm2_start, -7) : '';
      const sem2Start = dates.break_end ? addDays(dates.break_end, 1) : '';

      const phases = [
        { label: 'Semester 1 — Early',   start: dates.year_start,        end: mt1PrepStart ? addDays(mt1PrepStart, -1) : dates.sem1_end, semester: 'Semester 1' },
        { label: 'Mid-Term 1 Prep',       start: mt1PrepStart,            end: dates.midterm1_start ? addDays(dates.midterm1_start, -1) : '',  semester: 'Semester 1' },
        { label: 'Mid-Term 1',            start: dates.midterm1_start,    end: dates.midterm1_end,    semester: 'Semester 1' },
        { label: 'Semester 1 — Late',     start: dates.midterm1_end ? addDays(dates.midterm1_end, 1) : '', end: dates.sem1_end, semester: 'Semester 1' },
        { label: 'Inter-Semester Break',  start: addDays(dates.sem1_end, 1), end: dates.break_end,  semester: null },
        { label: 'Semester 2 — Early',    start: sem2Start,               end: mt2PrepStart ? addDays(mt2PrepStart, -1) : dates.year_end, semester: 'Semester 2' },
        { label: 'Mid-Term 2 Prep',       start: mt2PrepStart,            end: dates.midterm2_start ? addDays(dates.midterm2_start, -1) : '', semester: 'Semester 2' },
        { label: 'Mid-Term 2',            start: dates.midterm2_start,    end: dates.midterm2_end,    semester: 'Semester 2' },
        { label: 'Semester 2 — Late',     start: dates.midterm2_end ? addDays(dates.midterm2_end, 1) : '', end: dates.final_exam_start ? addDays(dates.final_exam_start, -1) : dates.year_end, semester: 'Semester 2' },
        { label: 'End-of-Year Exams',     start: dates.final_exam_start,  end: dates.final_exam_end || dates.year_end, semester: 'Semester 2' },
      ];
      return phases.filter(p => p.start && p.end).map(p => ({
        ...p,
        start: fmt(p.start),
        end: fmt(p.end),
      }));
    } catch {
      return [];
    }
  };

  const SEMESTER_COLORS: Record<string, string> = {
    'Semester 1': '#3b82f6',
    'Semester 2': '#22c55e',
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          backgroundColor: 'var(--dash-card-bg)',
          borderRadius: 16,
          padding: 28,
          width: 540,
          maxHeight: '88vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          border: '1px solid var(--dash-border)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--dash-text-sub)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            School Year Setup
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dash-text)', margin: 0 }}>
            {structureType === 'caribbean_three_term' ? t('calendar.caribbeanCalendar') : t('calendar.customSchoolYear')}
          </h2>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1 }}>
              <div style={{
                height: 3, borderRadius: 2,
                backgroundColor: i <= step ? '#3b82f6' : 'var(--dash-border)',
                transition: 'background 0.2s',
              }} />
              <span style={{ fontSize: 10, color: i === step ? '#3b82f6' : 'var(--dash-text-sub)', fontWeight: i === step ? 700 : 400, display: 'block', textAlign: 'center', marginTop: 4 }}>
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Step 0: Structure */}
        {step === 0 && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--dash-text-sub)', marginBottom: 16 }}>
              Choose the academic structure that matches your school system.
            </p>
            {[
              { type: 'caribbean_three_term', title: 'Caribbean (3 Terms)', desc: 'Term 1 → Christmas Break → Term 2 → Easter Break → Term 3 → End-of-Year Exams' },
              { type: 'generic', title: 'Generic (Custom)', desc: 'Standard school year without predefined semester structure.' },
            ].map(opt => (
              <div
                key={opt.type}
                onClick={() => setStructureType(opt.type as any)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: `2px solid ${structureType === opt.type ? '#3b82f6' : 'var(--dash-border)'}`,
                  cursor: 'pointer',
                  marginBottom: 10,
                  backgroundColor: structureType === opt.type ? 'rgba(59,130,246,0.06)' : 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 600, color: structureType === opt.type ? '#3b82f6' : 'var(--dash-text)', margin: '0 0 4px' }}>{opt.title}</p>
                <p style={{ fontSize: 12, color: 'var(--dash-text-sub)', margin: 0 }}>{opt.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Key Dates */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>School Year Label</label>
              <input style={inputStyle} value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. 2025–2026" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { key: 'year_start',  label: t('calendar.schoolYearStart') },
                { key: 'sem1_end',    label: 'Semester 1 End' },
                { key: 'break_end',   label: 'Break Ends (Semester 2 starts next day)' },
                { key: 'year_end',    label: t('calendar.schoolYearEnd') },
              ].map(f => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input
                    type="date"
                    style={inputStyle}
                    value={dates[f.key as keyof CaribbeanDates]}
                    onChange={e => setDate(f.key as keyof CaribbeanDates, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Midterms */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 10 }}>Semester 1 — Mid-Term</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Mid-Term 1 Start</label>
                  <input type="date" style={inputStyle} value={dates.midterm1_start} onChange={e => setDate('midterm1_start', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Mid-Term 1 End</label>
                  <input type="date" style={inputStyle} value={dates.midterm1_end} onChange={e => setDate('midterm1_end', e.target.value)} />
                </div>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', marginBottom: 10 }}>Semester 2 — Mid-Term</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Mid-Term 2 Start</label>
                  <input type="date" style={inputStyle} value={dates.midterm2_start} onChange={e => setDate('midterm2_start', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Mid-Term 2 End</label>
                  <input type="date" style={inputStyle} value={dates.midterm2_end} onChange={e => setDate('midterm2_end', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Final Exams */}
        {step === 3 && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--dash-text-sub)', marginBottom: 14 }}>
              Enter the end-of-year examination window. The system will automatically mark the period before it as "Semester 2 — Late."
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Final Exam Start</label>
                <input type="date" style={inputStyle} value={dates.final_exam_start} onChange={e => setDate('final_exam_start', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Final Exam End</label>
                <input type="date" style={inputStyle} value={dates.final_exam_end} onChange={e => setDate('final_exam_end', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {step === 4 && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--dash-text-sub)', marginBottom: 14 }}>
              Your academic calendar will be divided into these phases:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {previewPhases().map((p, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 8,
                  backgroundColor: 'var(--dash-bg)',
                  border: '1px solid var(--dash-border)',
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    backgroundColor: p.semester ? SEMESTER_COLORS[p.semester] || '#6b7280' : '#eab308',
                  }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text)' }}>{p.label}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--dash-text-sub)' }}>{p.start} → {p.end}</span>
                </div>
              ))}
            </div>
            {error && (
              <p style={{ fontSize: 12, color: '#ef4444', marginTop: 12 }}>{error}</p>
            )}
          </div>
        )}

        {/* Footer buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 10 }}>
          <button
            onClick={step === 0 ? onClose : () => setStep(s => s - 1)}
            style={{
              padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              border: '1px solid var(--dash-border)', backgroundColor: 'transparent',
              color: 'var(--dash-text-sub)', cursor: 'pointer',
            }}
          >
            {step === 0 ? t('common.cancel') : t('common.back')}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              style={{
                padding: '9px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                backgroundColor: canProceed() ? '#3b82f6' : 'var(--dash-border)',
                color: canProceed() ? 'white' : 'var(--dash-text-sub)',
                border: 'none', cursor: canProceed() ? 'pointer' : 'not-allowed',
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '9px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                backgroundColor: '#3b82f6', color: 'white',
                border: 'none', cursor: saving ? 'wait' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? t('common.saving') : t('calendar.saveSchoolYear')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolYearSetupModal;
