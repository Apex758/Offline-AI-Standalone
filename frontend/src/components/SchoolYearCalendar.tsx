import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ResourceGridSkeleton } from './ui/ResourceGridSkeleton';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  isSameMonth,
  parseISO,
  isWithinInterval,
  isBefore,
} from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import Calendar01IconData from '@hugeicons/core-free-icons/Calendar01Icon';
import Add01IconData from '@hugeicons/core-free-icons/Add01Icon';
import Delete02IconData from '@hugeicons/core-free-icons/Delete02Icon';
import PencilEdit01IconData from '@hugeicons/core-free-icons/PencilEdit01Icon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Tick01IconData from '@hugeicons/core-free-icons/Tick01Icon';
import axios from 'axios';
import { useCurrentPhase } from '../hooks/useCurrentPhase';
import { useTranslation } from 'react-i18next';

// ── Types ──

interface SchoolYearConfig {
  id: string;
  teacher_id: string;
  label: string;
  start_date: string;
  end_date: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface SchoolYearEvent {
  id: string;
  config_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  event_type: string;
  color: string | null;
  subject: string | null;
  grade_level: string | null;
  all_day: number;
  reminders_enabled: number;
  reminder_offsets: string;
  blocks_classes?: number;
  created_at: string;
}

interface SchoolYearCalendarProps {
  tabId: string;
  savedData?: any;
  onDataChange?: (data: any) => void;
  isActive?: boolean;
}

// ── Constants ──

const EVENT_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  holiday: { label: 'Holiday', color: '#DC2626' },
  project: { label: 'Project', color: '#3B82F6' },
  quiz: { label: 'Quiz', color: '#F59E0B' },
  assignment: { label: 'Assignment', color: '#8B5CF6' },
  grading_deadline: { label: 'Grading Deadline', color: '#F2A631' },
  report_card: { label: 'Report Card', color: '#E53E3E' },
  custom: { label: 'Custom', color: '#0D9488' },
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ── Helpers ──

function getMonthDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  return eachDayOfInterval({ start, end });
}

function getTeacherId(): string {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.username || 'admin';
  } catch {
    return 'admin';
  }
}

// ── Component ──

const SchoolYearCalendar: React.FC<SchoolYearCalendarProps> = ({ tabId, savedData, onDataChange, isActive }) => {
  const { t } = useTranslation();
  const teacherId = getTeacherId();
  const { currentPhase, allPhases: calPhases } = useCurrentPhase(teacherId);

  // Phase progress data for completion rings
  const [phaseProgress, setPhaseProgress] = useState<Record<string, number>>({});
  useEffect(() => {
    if (calPhases.length === 0) return;
    // Fetch progress for each phase
    Promise.all(
      calPhases.map(p =>
        axios.get(`http://localhost:8000/api/milestones/${teacherId}/phase-progress?phase_id=${encodeURIComponent(p.id)}`)
          .then(res => ({ id: p.id, pct: res.data.sco_pct || 0 }))
          .catch(() => ({ id: p.id, pct: 0 }))
      )
    ).then(results => {
      const map: Record<string, number> = {};
      for (const r of results) map[r.id] = r.pct;
      setPhaseProgress(map);
    });
  }, [calPhases, teacherId]);

  // Single config state
  const [config, setConfig] = useState<SchoolYearConfig | null>(null);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [setupStep, setSetupStep] = useState(0);
  const [structureType, setStructureType] = useState<'caribbean_three_term' | 'generic'>('caribbean_three_term');
  const [setupLabel, setSetupLabel] = useState('');
  const [setupDates, setSetupDates] = useState({
    year_start: '', sem1_end: '', break_end: '', year_end: '',
    midterm1_start: '', midterm1_end: '',
    midterm2_start: '', midterm2_end: '',
    final_exam_start: '', final_exam_end: '',
  });
  const [setupSaving, setSetupSaving] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  // Smart date helpers for academic year setup
  const computeDefaultDates = useCallback((yearStart: string) => {
    if (!yearStart) return null;
    const d = new Date(yearStart);
    const y = d.getFullYear();
    const m = d.getMonth(); // 0-indexed
    // Determine if the year rolls over (start in Jul-Dec means next calendar year for Term 2+)
    const nextYear = m >= 6 ? y + 1 : y;
    const startYear = m >= 6 ? y : y - 1; // for label
    const pad = (n: number) => String(n).padStart(2, '0');
    const toISO = (yr: number, mo: number, day: number) => `${yr}-${pad(mo)}-${pad(day)}`;

    return {
      sem1_end: toISO(m >= 6 ? y : y, 12, 13),
      break_end: toISO(nextYear, 1, 6),
      year_end: toISO(nextYear, 6, 27),
      midterm1_start: toISO(m >= 6 ? y : y, 10, 20),
      midterm1_end: toISO(m >= 6 ? y : y, 10, 24),
      midterm2_start: toISO(nextYear, 2, 17),
      midterm2_end: toISO(nextYear, 2, 21),
      final_exam_start: toISO(nextYear, 5, 26),
      final_exam_end: toISO(nextYear, 6, 20),
      label: `${m >= 6 ? y : y - 1}-${nextYear}`,
    };
  }, []);

  const handleYearStartChange = useCallback((value: string) => {
    const defaults = computeDefaultDates(value);
    if (defaults) {
      setSetupDates({
        year_start: value,
        sem1_end: defaults.sem1_end,
        break_end: defaults.break_end,
        year_end: defaults.year_end,
        midterm1_start: defaults.midterm1_start,
        midterm1_end: defaults.midterm1_end,
        midterm2_start: defaults.midterm2_start,
        midterm2_end: defaults.midterm2_end,
        final_exam_start: defaults.final_exam_start,
        final_exam_end: defaults.final_exam_end,
      });
      setSetupLabel(defaults.label);
    } else {
      setSetupDates(prev => ({ ...prev, year_start: value }));
    }
  }, [computeDefaultDates]);

  // Event state
  const [events, setEvents] = useState<SchoolYearEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SchoolYearEvent | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    end_date: '',
    event_type: 'custom',
    subject: '',
    grade_level: '',
    reminders_enabled: 0,
    reminder_offsets: '[]',
    blocks_classes: 0,
  });

  // Calendar file import state
  const [isDragOver, setIsDragOver] = useState(false);
  const [importPreview, setImportPreview] = useState<any[] | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const dragCounter = React.useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items?.length) setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    if (!files?.length) return;

    const file = files[0];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'ics' && ext !== 'csv') {
      alert('Unsupported file type. Please drop a .ics or .csv file.');
      return;
    }

    setImportLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('teacher_id', teacherId);
      const res = await axios.post('/api/teacher-metrics/calendar-import', formData);
      const parsed = res.data.events || [];
      if (parsed.length === 0) {
        alert('No events found in the file.');
      } else {
        setImportPreview(parsed);
      }
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to parse calendar file.');
    } finally {
      setImportLoading(false);
    }
  }, [teacherId]);

  const loadEvents = useCallback(async (configId: string) => {
    try {
      const res = await axios.get(`/api/school-year/events/${configId}`);
      setEvents(res.data.events || []);
    } catch (e) {
      console.error('Failed to load events:', e);
    }
  }, []);

  const confirmImport = useCallback(async () => {
    if (!importPreview || !config) return;
    setImportLoading(true);
    try {
      const eventsToSave = importPreview.map(evt => ({
        config_id: config.id,
        teacher_id: teacherId,
        title: evt.title,
        description: evt.description || null,
        event_date: evt.event_date,
        end_date: evt.end_date || null,
        event_type: evt.event_type || 'custom',
        all_day: 1,
      }));
      await axios.post('/api/school-year/events/bulk', { events: eventsToSave });
      setImportPreview(null);
      loadEvents(config.id);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to save imported events.');
    } finally {
      setImportLoading(false);
    }
  }, [importPreview, config, teacherId, loadEvents]);

  // ── Data Loading ──

  const loadConfig = useCallback(async () => {
    try {
      const res = await axios.get(`/api/school-year/config/${teacherId}/active`);
      const cfg = res.data.config;
      if (cfg) {
        setConfig(cfg);
      } else {
        // No config yet — check if any exist at all (use the first one)
        const listRes = await axios.get(`/api/school-year/config/${teacherId}`);
        const configs = listRes.data.configs || [];
        if (configs.length > 0) {
          setConfig(configs[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load school year config:', e);
    }
  }, [teacherId]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    if (config) {
      loadEvents(config.id);
    }
  }, [config, loadEvents]);

  // ── Events grouped by date ──

  const eventsByDate = useMemo(() => {
    const map: Record<string, SchoolYearEvent[]> = {};
    for (const event of events) {
      const key = event.event_date;
      if (!map[key]) map[key] = [];
      map[key].push(event);
      if (event.end_date && event.end_date !== event.event_date) {
        try {
          const start = parseISO(event.event_date);
          const end = parseISO(event.end_date);
          const days = eachDayOfInterval({ start, end });
          for (const day of days) {
            const dk = format(day, 'yyyy-MM-dd');
            if (dk !== event.event_date) {
              if (!map[dk]) map[dk] = [];
              map[dk].push(event);
            }
          }
        } catch { /* ignore invalid date ranges */ }
      }
    }
    return map;
  }, [events]);

  // ── Months to display ──

  const months = useMemo(() => {
    if (config) {
      const startMonth = startOfMonth(parseISO(config.start_date));
      const endMonth = startOfMonth(parseISO(config.end_date));
      const result: Date[] = [];
      let current = startMonth;
      while (isBefore(current, addMonths(endMonth, 1))) {
        result.push(current);
        current = addMonths(current, 1);
      }
      return result;
    }
    // Default: show current calendar year
    const year = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  }, [config]);

  // Events for selected date
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateEvents = eventsByDate[selectedDateKey] || [];

  // Is a date within the school year?
  const isInSchoolYear = useCallback((date: Date): boolean => {
    if (!config) return true;
    try {
      const start = parseISO(config.start_date);
      const end = parseISO(config.end_date);
      return isWithinInterval(date, { start, end });
    } catch {
      return true;
    }
  }, [config]);

  // ── Config Actions ──

  const setupCanProceed = (): boolean => {
    if (setupStep === 0) return true;
    if (setupStep === 1) return !!(setupLabel && setupDates.year_start && setupDates.sem1_end && setupDates.break_end && setupDates.year_end);
    if (setupStep === 2) return !!(setupDates.midterm1_start && setupDates.midterm1_end && setupDates.midterm2_start && setupDates.midterm2_end);
    if (setupStep === 3) return !!(setupDates.final_exam_start && setupDates.final_exam_end);
    return true;
  };

  const handleSaveConfig = async () => {
    setSetupSaving(true);
    setSetupError(null);
    try {
      const res = await axios.post('/api/teacher-metrics/setup-caribbean-year', {
        teacher_id: teacherId,
        label: setupLabel,
        structure_type: structureType,
        dates: setupDates,
      });
      setConfig(res.data.config);
      setShowConfigForm(false);
      setSetupStep(0);
      setSetupLabel('');
      setSetupDates({
        year_start: '', sem1_end: '', break_end: '', year_end: '',
        midterm1_start: '', midterm1_end: '',
        midterm2_start: '', midterm2_end: '',
        final_exam_start: '', final_exam_end: '',
      });
    } catch (e: any) {
      setSetupError(e?.response?.data?.detail || 'Failed to save school year. Please check the dates and try again.');
    } finally {
      setSetupSaving(false);
    }
  };

  const previewPhases = (): { label: string; start: string; end: string; semester: string | null }[] => {
    if (!setupDates.year_start || !setupDates.sem1_end || !setupDates.break_end || !setupDates.year_end) return [];
    try {
      const addDays = (s: string, n: number) => {
        const dt = new Date(s);
        dt.setDate(dt.getDate() + n);
        return dt.toISOString().split('T')[0];
      };
      const fmt = (s: string) => {
        try { return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); } catch { return s; }
      };
      const mt1PrepStart = setupDates.midterm1_start ? addDays(setupDates.midterm1_start, -7) : '';
      const mt2PrepStart = setupDates.midterm2_start ? addDays(setupDates.midterm2_start, -7) : '';
      const sem2Start = setupDates.break_end ? addDays(setupDates.break_end, 1) : '';

      const phases = [
        { label: 'Semester 1 -- Early',   start: setupDates.year_start,        end: mt1PrepStart ? addDays(mt1PrepStart, -1) : setupDates.sem1_end, semester: 'Semester 1' },
        { label: 'Mid-Term 1 Prep',       start: mt1PrepStart,            end: setupDates.midterm1_start ? addDays(setupDates.midterm1_start, -1) : '',  semester: 'Semester 1' },
        { label: 'Mid-Term 1',            start: setupDates.midterm1_start,    end: setupDates.midterm1_end,    semester: 'Semester 1' },
        { label: 'Semester 1 -- Late',     start: setupDates.midterm1_end ? addDays(setupDates.midterm1_end, 1) : '', end: setupDates.sem1_end, semester: 'Semester 1' },
        { label: 'Inter-Semester Break',  start: addDays(setupDates.sem1_end, 1), end: setupDates.break_end,  semester: null },
        { label: 'Semester 2 -- Early',    start: sem2Start,               end: mt2PrepStart ? addDays(mt2PrepStart, -1) : setupDates.year_end, semester: 'Semester 2' },
        { label: 'Mid-Term 2 Prep',       start: mt2PrepStart,            end: setupDates.midterm2_start ? addDays(setupDates.midterm2_start, -1) : '', semester: 'Semester 2' },
        { label: 'Mid-Term 2',            start: setupDates.midterm2_start,    end: setupDates.midterm2_end,    semester: 'Semester 2' },
        { label: 'Semester 2 -- Late',     start: setupDates.midterm2_end ? addDays(setupDates.midterm2_end, 1) : '', end: setupDates.final_exam_start ? addDays(setupDates.final_exam_start, -1) : setupDates.year_end, semester: 'Semester 2' },
        { label: 'End-of-Year Exams',     start: setupDates.final_exam_start,  end: setupDates.final_exam_end || setupDates.year_end, semester: 'Semester 2' },
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

  // ── Event Actions ──

  const openEventForm = (type?: string) => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      event_date: format(selectedDate, 'yyyy-MM-dd'),
      end_date: '',
      event_type: type || 'custom',
      subject: '',
      grade_level: '',
      reminders_enabled: 0,
      reminder_offsets: '[]',
      // Holidays default to blocking classes; other types don't.
      blocks_classes: type === 'holiday' ? 1 : 0,
    });
    setShowEventForm(true);
  };

  const openEditEvent = (event: SchoolYearEvent) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date,
      end_date: event.end_date || '',
      event_type: event.event_type,
      subject: event.subject || '',
      grade_level: event.grade_level || '',
      reminders_enabled: event.reminders_enabled ?? 0,
      reminder_offsets: event.reminder_offsets ?? '[]',
      blocks_classes: event.blocks_classes ?? 0,
    });
    setShowEventForm(true);
  };

  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.event_date || !config) return;
    try {
      const payload: any = {
        config_id: config.id,
        teacher_id: teacherId,
        title: eventForm.title,
        description: eventForm.description || null,
        event_date: eventForm.event_date,
        end_date: eventForm.end_date || null,
        event_type: eventForm.event_type,
        subject: eventForm.subject || null,
        grade_level: eventForm.grade_level || null,
        reminders_enabled: eventForm.reminders_enabled,
        reminder_offsets: eventForm.reminder_offsets,
        blocks_classes: eventForm.event_type === 'holiday' ? (eventForm.blocks_classes ? 1 : 0) : 0,
      };
      if (editingEvent) {
        payload.id = editingEvent.id;
      }
      await axios.post('/api/school-year/events', payload);
      setShowEventForm(false);
      setEditingEvent(null);
      loadEvents(config.id);
    } catch (e) {
      console.error('Failed to save event:', e);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!config) return;
    try {
      await axios.delete(`/api/school-year/events/${eventId}`);
      loadEvents(config.id);
    } catch (e) {
      console.error('Failed to delete event:', e);
    }
  };

  // ── Event stats ──

  const eventStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of events) {
      counts[e.event_type] = (counts[e.event_type] || 0) + 1;
    }
    return counts;
  }, [events]);

  const [initialLoad, setInitialLoad] = React.useState(true);
  React.useEffect(() => { setInitialLoad(false); }, []);

  // ── Render ──

  if (initialLoad) return <ResourceGridSkeleton variant="calendar" />;

  return (
    <div
      className="syc-container"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ position: 'relative' }}
    >
      {/* Drag-and-drop overlay */}
      {isDragOver && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 50,
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          border: '3px dashed #3b82f6',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#3b82f6' }}>Drop school calendar file here</p>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>.ics or .csv</p>
          </div>
        </div>
      )}

      {/* Import preview modal */}
      {importPreview && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: 'var(--theme-bg, #fff)',
            borderRadius: 12, padding: 24, maxWidth: 500, width: '90%',
            maxHeight: '70vh', display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
              Import {importPreview.length} events
            </h3>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
              {importPreview.map((evt, i) => (
                <div key={i} style={{
                  padding: '8px 0', borderBottom: '1px solid var(--theme-border, #e5e7eb)',
                  fontSize: 13,
                }}>
                  <span style={{ fontWeight: 500 }}>{evt.title}</span>
                  <span style={{ color: '#6b7280', marginLeft: 8 }}>
                    {evt.event_date}{evt.end_date ? ` → ${evt.end_date}` : ''}
                  </span>
                  <span style={{
                    marginLeft: 8, fontSize: 11, padding: '2px 6px',
                    borderRadius: 4, backgroundColor: '#f3f4f6',
                  }}>
                    {evt.event_type}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setImportPreview(null)}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: '1px solid var(--theme-border, #d1d5db)',
                  background: 'transparent', cursor: 'pointer', fontSize: 13,
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmImport}
                disabled={importLoading || !config}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: 'none',
                  background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: 13,
                  opacity: importLoading || !config ? 0.5 : 1,
                }}
              >
                {importLoading ? 'Importing...' : !config ? 'Set up school year first' : 'Confirm Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="syc-header">
        <div className="syc-header-left">
          <div className="syc-header-icon">
            <HugeiconsIcon icon={Calendar01IconData} size={20} />
          </div>
          <div>
            <div className="syc-header-title">School Year Calendar</div>
            <div className="syc-header-subtitle">
              {config ? config.label : 'No school year configured'}
            </div>
          </div>
        </div>
        <div className="syc-header-right">
          {currentPhase && (
            <div
              className="syc-phase-badge"
              style={{
                background: `${currentPhase.color}20`,
                borderColor: `${currentPhase.color}60`,
                color: currentPhase.color,
              }}
            >
              <span className="syc-phase-dot" style={{ background: currentPhase.color }} />
              {currentPhase.phase_label}
              <span className="syc-phase-sep">&bull;</span>
              {format(parseISO(currentPhase.start_date), 'MMM d')} &ndash; {format(parseISO(currentPhase.end_date), 'MMM d')}
              <span className="syc-phase-sep">&bull;</span>
              {currentPhase.days_remaining}d left
            </div>
          )}
          <div className="syc-header-actions">
            <button className="syc-today-btn" onClick={() => setSelectedDate(new Date())}>
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      {config && events.length > 0 && (
        <div className="syc-stats-strip">
          <span className="syc-stat-item">
            <strong>{events.length}</strong> events total
          </span>
          <span className="syc-stat-divider" />
          {Object.entries(eventStats).map(([type, count]) => (
            <span key={type} className="syc-stat-badge" style={{ background: `${EVENT_TYPE_CONFIG[type]?.color}18`, color: EVENT_TYPE_CONFIG[type]?.color }}>
              {count} {EVENT_TYPE_CONFIG[type]?.label || type}
            </span>
          ))}
        </div>
      )}

      {/* Phase completion rings */}
      {calPhases.length > 0 && Object.keys(phaseProgress).length > 0 && (
        <div className="syc-phase-rings">
          {calPhases.map(p => {
            const pct = phaseProgress[p.id] || 0;
            const PHASE_COLORS_MAP: Record<string, string> = {
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
            const SEM_COLORS: Record<string, string> = { 'Semester 1': '#3b82f6', 'Semester 2': '#22c55e' };
            const color = PHASE_COLORS_MAP[p.phase_key] || (p.semester ? SEM_COLORS[p.semester] || '#6b7280' : '#6b7280');
            const r = 14; // ring radius
            const circumference = 2 * Math.PI * r;
            const offset = circumference * (1 - pct / 100);
            return (
              <div key={p.id} className="syc-ring-item" style={{ color }}>
                <svg width="36" height="36" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r={r} fill="none" stroke={`${color}25`} strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round" transform="rotate(-90 18 18)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <span className="syc-ring-label">{p.phase_label.split(' ').map(w => w[0]).join('').slice(0, 3)}</span>
                <span className="syc-ring-pct">{Math.round(pct)}%</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Body */}
      <div className="syc-body">
        {/* Left Panel */}
        <div className="syc-left-panel">
          {/* School Year Config */}
          <div className="syc-panel-section">
            <div className="syc-section-title">School Year</div>
            {config && !showConfigForm ? (
              <div className="syc-active-config">
                <div className="syc-config-label">{config.label}</div>
                <div className="syc-config-dates">
                  {format(parseISO(config.start_date), 'MMM d, yyyy')} &mdash; {format(parseISO(config.end_date), 'MMM d, yyyy')}
                </div>
                <div className="syc-config-actions">
                  <button className="syc-config-btn" onClick={() => {
                    setShowConfigForm(true);
                    setSetupStep(0);
                  }}>
                    <HugeiconsIcon icon={PencilEdit01IconData} size={14} /> Edit
                  </button>
                </div>
              </div>
            ) : !showConfigForm ? (
              <button className="syc-add-config-btn" onClick={() => {
                setShowConfigForm(true);
                setSetupStep(0);
              }}>
                <HugeiconsIcon icon={Add01IconData} size={16} />
                Set Up School Year
              </button>
            ) : null}

            {showConfigForm && (
              <div className="syc-config-form">
                {/* Step indicator */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {['Structure', 'Key Dates', 'Midterms', 'Finals', 'Preview'].map((s, i) => (
                    <div key={s} style={{ flex: 1 }}>
                      <div style={{
                        height: 3, borderRadius: 2,
                        backgroundColor: i <= setupStep ? '#3b82f6' : 'var(--theme-border, #e5e7eb)',
                        transition: 'background 0.2s',
                      }} />
                      <span style={{ fontSize: 9, color: i === setupStep ? '#3b82f6' : 'var(--theme-text-secondary, #6b7280)', fontWeight: i === setupStep ? 700 : 400, display: 'block', textAlign: 'center', marginTop: 3 }}>
                        {s}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Step 0: Structure */}
                {setupStep === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { type: 'caribbean_three_term', title: 'Caribbean (3 Terms)', desc: 'Term 1 -> Christmas Break -> Term 2 -> Easter Break -> Term 3 -> End-of-Year Exams' },
                      { type: 'generic', title: 'Generic (Custom)', desc: 'Standard school year without predefined semester structure.' },
                    ].map(opt => (
                      <div
                        key={opt.type}
                        onClick={() => setStructureType(opt.type as any)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: `2px solid ${structureType === opt.type ? '#3b82f6' : 'var(--theme-border, #e5e7eb)'}`,
                          cursor: 'pointer',
                          backgroundColor: structureType === opt.type ? 'rgba(59,130,246,0.06)' : 'transparent',
                          transition: 'all 0.15s',
                        }}
                      >
                        <p style={{ fontSize: 13, fontWeight: 600, color: structureType === opt.type ? '#3b82f6' : 'var(--theme-text, #111)', margin: '0 0 2px' }}>{opt.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--theme-text-secondary, #6b7280)', margin: 0 }}>{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 1: Key Dates */}
                {setupStep === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label className="syc-form-label">
                      School Year Label
                      <input className="syc-form-input" value={setupLabel} onChange={e => setSetupLabel(e.target.value)} placeholder="e.g. 2025-2026" />
                    </label>
                    <label className="syc-form-label">
                      School Year Start
                      <input type="date" className="syc-form-input" value={setupDates.year_start} onChange={e => handleYearStartChange(e.target.value)} />
                    </label>
                    <label className="syc-form-label">
                      Semester 1 End
                      <input type="date" className="syc-form-input" value={setupDates.sem1_end} min={setupDates.year_start || undefined} onChange={e => setSetupDates(d => ({ ...d, sem1_end: e.target.value }))} />
                    </label>
                    <label className="syc-form-label">
                      Break Ends (Sem 2 starts next day)
                      <input type="date" className="syc-form-input" value={setupDates.break_end} min={setupDates.sem1_end || undefined} onChange={e => setSetupDates(d => ({ ...d, break_end: e.target.value }))} />
                    </label>
                    <label className="syc-form-label">
                      School Year End
                      <input type="date" className="syc-form-input" value={setupDates.year_end} min={setupDates.break_end || undefined} onChange={e => setSetupDates(d => ({ ...d, year_end: e.target.value }))} />
                    </label>
                  </div>
                )}

                {/* Step 2: Midterms */}
                {setupStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', margin: 0 }}>Semester 1 -- Mid-Term</p>
                    <label className="syc-form-label">
                      Mid-Term 1 Start
                      <input type="date" className="syc-form-input" value={setupDates.midterm1_start} min={setupDates.year_start || undefined} max={setupDates.sem1_end || undefined} onChange={e => setSetupDates(d => ({ ...d, midterm1_start: e.target.value }))} />
                    </label>
                    <label className="syc-form-label">
                      Mid-Term 1 End
                      <input type="date" className="syc-form-input" value={setupDates.midterm1_end} min={setupDates.midterm1_start || undefined} max={setupDates.sem1_end || undefined} onChange={e => setSetupDates(d => ({ ...d, midterm1_end: e.target.value }))} />
                    </label>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#22c55e', margin: 0 }}>Semester 2 -- Mid-Term</p>
                    <label className="syc-form-label">
                      Mid-Term 2 Start
                      <input type="date" className="syc-form-input" value={setupDates.midterm2_start} min={setupDates.break_end || undefined} max={setupDates.year_end || undefined} onChange={e => setSetupDates(d => ({ ...d, midterm2_start: e.target.value }))} />
                    </label>
                    <label className="syc-form-label">
                      Mid-Term 2 End
                      <input type="date" className="syc-form-input" value={setupDates.midterm2_end} min={setupDates.midterm2_start || undefined} max={setupDates.year_end || undefined} onChange={e => setSetupDates(d => ({ ...d, midterm2_end: e.target.value }))} />
                    </label>
                  </div>
                )}

                {/* Step 3: Final Exams */}
                {setupStep === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ fontSize: 11, color: 'var(--theme-text-secondary, #6b7280)', margin: 0 }}>
                      Enter the end-of-year examination window.
                    </p>
                    <label className="syc-form-label">
                      Final Exam Start
                      <input type="date" className="syc-form-input" value={setupDates.final_exam_start} min={setupDates.midterm2_end || setupDates.break_end || undefined} max={setupDates.year_end || undefined} onChange={e => setSetupDates(d => ({ ...d, final_exam_start: e.target.value }))} />
                    </label>
                    <label className="syc-form-label">
                      Final Exam End
                      <input type="date" className="syc-form-input" value={setupDates.final_exam_end} min={setupDates.final_exam_start || undefined} max={setupDates.year_end || undefined} onChange={e => setSetupDates(d => ({ ...d, final_exam_end: e.target.value }))} />
                    </label>
                  </div>
                )}

                {/* Step 4: Preview */}
                {setupStep === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <p style={{ fontSize: 11, color: 'var(--theme-text-secondary, #6b7280)', margin: '0 0 8px' }}>
                      Your academic calendar phases:
                    </p>
                    {previewPhases().map((p, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 10px', borderRadius: 6,
                        backgroundColor: 'var(--theme-bg-secondary, #f9fafb)',
                        border: '1px solid var(--theme-border, #e5e7eb)',
                      }}>
                        <span style={{
                          width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                          backgroundColor: p.semester === 'Semester 1' ? '#3b82f6' : p.semester === 'Semester 2' ? '#22c55e' : '#eab308',
                        }} />
                        <span style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{p.label}</span>
                        <span style={{ fontSize: 10, color: 'var(--theme-text-secondary, #6b7280)' }}>{p.start} - {p.end}</span>
                      </div>
                    ))}
                    {setupError && (
                      <p style={{ fontSize: 11, color: '#ef4444', marginTop: 8 }}>{setupError}</p>
                    )}
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="syc-form-actions" style={{ marginTop: 16 }}>
                  <button className="syc-btn-secondary" onClick={() => {
                    if (setupStep === 0) {
                      setShowConfigForm(false);
                    } else {
                      setSetupStep(s => s - 1);
                    }
                  }}>
                    {setupStep === 0 ? t('common.cancel') : 'Back'}
                  </button>
                  {setupStep < 4 ? (
                    <button
                      className="syc-btn-primary"
                      disabled={!setupCanProceed()}
                      onClick={() => setSetupStep(s => s + 1)}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      className="syc-btn-primary"
                      disabled={setupSaving}
                      onClick={handleSaveConfig}
                    >
                      {setupSaving ? 'Saving...' : 'Save School Year'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Add */}
          {config && (
            <div className="syc-panel-section">
              <div className="syc-section-title">{t('schoolCalendar.quickAdd')}</div>
              <div className="syc-quick-add-grid">
                {Object.entries(EVENT_TYPE_CONFIG).map(([type, cfg]) => (
                  <button
                    key={type}
                    className="syc-quick-add-btn"
                    style={{ borderColor: cfg.color, color: cfg.color }}
                    onClick={() => openEventForm(type)}
                  >
                    <span className="syc-quick-dot" style={{ background: cfg.color }} />
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Center Panel - Year Calendar Grid */}
        <div className="syc-center-panel">
          {!config ? (
            <div className="syc-empty-state">
              <div className="syc-empty-icon">
                <HugeiconsIcon icon={Calendar01IconData} size={48} color="#94A3B8" />
              </div>
              <h3 className="syc-empty-title">{t('schoolCalendar.noSchoolYear')}</h3>
              <p className="syc-empty-desc">
                Set up your school year to start planning your academic calendar with exams, midterms, grading deadlines, and more.
              </p>
              <button className="syc-btn-primary" onClick={() => {
                setShowConfigForm(true);
                setSetupStep(0);
              }}>
                <HugeiconsIcon icon={Add01IconData} size={16} /> Set Up School Year
              </button>
            </div>
          ) : (
            <div className="syc-year-grid">
              {months.map((month, mi) => {
                const days = getMonthDays(month);
                return (
                  <div key={mi} className="syc-mini-month">
                    <div className="syc-mini-month-label">{format(month, 'MMMM yyyy')}</div>
                    <div className="syc-mini-weekday-header">
                      {WEEKDAYS.map((d) => (
                        <div key={d} className="syc-mini-weekday">{d[0]}</div>
                      ))}
                    </div>
                    <div className="syc-mini-days-grid">
                      {days.map((day, di) => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const dayEvents = eventsByDate[dateKey] || [];
                        const isSelected = isSameDay(day, selectedDate);
                        const isTodayDate = isToday(day);
                        const isCurrentMonth = isSameMonth(day, month);
                        const inSchoolYear = isInSchoolYear(day);
                        const eventTypes = [...new Set(dayEvents.map((e) => e.event_type))];

                        return (
                          <button
                            key={di}
                            className={`syc-mini-day ${isSelected ? 'syc-mini-day-selected' : ''} ${isTodayDate && !isSelected ? 'syc-mini-day-today' : ''} ${!isCurrentMonth ? 'syc-mini-day-outside' : ''} ${!inSchoolYear && isCurrentMonth ? 'syc-mini-day-dimmed' : ''}`}
                            disabled={!isCurrentMonth}
                            onClick={() => setSelectedDate(day)}
                          >
                            <span className="syc-mini-day-number">{format(day, 'd')}</span>
                            {isCurrentMonth && eventTypes.length > 0 && (
                              <div className="syc-mini-indicators">
                                {eventTypes.slice(0, 3).map((type) => (
                                  <div
                                    key={type}
                                    className={`syc-mini-dot ${isSelected ? 'syc-mini-dot-selected' : ''}`}
                                    style={{ background: isSelected ? '#F8E59D' : (EVENT_TYPE_CONFIG[type]?.color || '#94A3B8') }}
                                  />
                                ))}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Panel - Detail */}
        <div className="syc-right-panel">
          {/* Selected Date Display */}
          <div className="syc-date-display">
            <div className="syc-date-day">{format(selectedDate, 'd')}</div>
            <div className="syc-date-info">
              <div className="syc-date-weekday">{format(selectedDate, 'EEEE')}</div>
              <div className="syc-date-month">{format(selectedDate, 'MMMM yyyy')}</div>
            </div>
            {selectedDateEvents.length > 0 && (
              <span className="syc-date-count">{selectedDateEvents.length}</span>
            )}
          </div>

          {/* Event Form */}
          {showEventForm && (
            <div className="syc-event-form">
              <div className="syc-event-form-header">
                <span className="syc-section-title">{editingEvent ? 'Edit Event' : 'New Event'}</span>
                <button className="syc-icon-btn" onClick={() => { setShowEventForm(false); setEditingEvent(null); }}>
                  <HugeiconsIcon icon={Cancel01IconData} size={16} />
                </button>
              </div>
              <label className="syc-form-label">
                Title
                <input
                  type="text"
                  className="syc-form-input"
                  placeholder="Event title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                />
              </label>
              <label className="syc-form-label">
                Type
                <select
                  className="syc-form-input"
                  value={eventForm.event_type}
                  onChange={(e) => {
                    const nextType = e.target.value;
                    setEventForm(prev => ({
                      ...prev,
                      event_type: nextType,
                      // When switching to holiday, default to blocking classes.
                      // When switching away, clear the flag.
                      blocks_classes: nextType === 'holiday'
                        ? (prev.event_type === 'holiday' ? prev.blocks_classes : 1)
                        : 0,
                    }));
                  }}
                >
                  {Object.entries(EVENT_TYPE_CONFIG).map(([type, cfg]) => (
                    <option key={type} value={type}>{cfg.label}</option>
                  ))}
                </select>
              </label>
              {eventForm.event_type === 'holiday' && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', padding: '6px 0' }}>
                  <input
                    type="checkbox"
                    checked={eventForm.blocks_classes === 1}
                    onChange={(e) => setEventForm({ ...eventForm, blocks_classes: e.target.checked ? 1 : 0 })}
                  />
                  <span>Block classes on this day</span>
                  <span style={{ fontSize: '11px', opacity: 0.6, fontWeight: 'normal' }}>
                    (timetable slots will be hidden for this date)
                  </span>
                </label>
              )}
              <label className="syc-form-label">
                Date
                <input
                  type="date"
                  className="syc-form-input"
                  value={eventForm.event_date}
                  onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                />
              </label>
              <label className="syc-form-label">
                End Date <span className="syc-form-hint">(optional, for multi-day)</span>
                <input
                  type="date"
                  className="syc-form-input"
                  value={eventForm.end_date}
                  onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })}
                />
              </label>
              <label className="syc-form-label">
                Description <span className="syc-form-hint">(optional)</span>
                <textarea
                  className="syc-form-input syc-form-textarea"
                  placeholder="Add details..."
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  rows={3}
                />
              </label>
              <label className="syc-form-label">
                Subject <span className="syc-form-hint">(optional)</span>
                <input
                  type="text"
                  className="syc-form-input"
                  placeholder="e.g. Mathematics"
                  value={eventForm.subject}
                  onChange={(e) => setEventForm({ ...eventForm, subject: e.target.value })}
                />
              </label>
              <label className="syc-form-label">
                Grade Level <span className="syc-form-hint">(optional)</span>
                <input
                  type="text"
                  className="syc-form-input"
                  placeholder="e.g. Grade 5"
                  value={eventForm.grade_level}
                  onChange={(e) => setEventForm({ ...eventForm, grade_level: e.target.value })}
                />
              </label>
              {/* Reminders */}
              <div className="syc-form-label">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Reminders</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={eventForm.reminders_enabled === 1}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, reminders_enabled: e.target.checked ? 1 : 0, reminder_offsets: e.target.checked ? eventForm.reminder_offsets : '[]' })
                      }
                    />
                    <span style={{ fontSize: '12px', fontWeight: 'normal' }}>{t('schoolCalendar.enable')}</span>
                  </label>
                </div>
                {eventForm.reminders_enabled === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '4px' }}>
                    {([
                      { label: 'At event time', value: 0 },
                      { label: '30 minutes before', value: 30 },
                      { label: '1 hour before', value: 60 },
                      { label: '1 day before', value: 1440 },
                      { label: '1 week before', value: 10080 },
                    ] as const).map(({ label, value }) => {
                      const offsets: number[] = JSON.parse(eventForm.reminder_offsets || '[]');
                      const checked = offsets.includes(value);
                      return (
                        <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? [...offsets, value]
                                : offsets.filter((o) => o !== value);
                              setEventForm({ ...eventForm, reminder_offsets: JSON.stringify(next) });
                            }}
                          />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="syc-form-actions">
                <button className="syc-btn-primary" onClick={handleSaveEvent}>
                  <HugeiconsIcon icon={Tick01IconData} size={14} />
                  {editingEvent ? 'Update' : 'Add Event'}
                </button>
                <button className="syc-btn-secondary" onClick={() => { setShowEventForm(false); setEditingEvent(null); }}>
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          )}

          {/* Events List */}
          <div className="syc-events-section">
            <div className="syc-events-header">
              <span className="syc-section-title">{t('schoolCalendar.events')}</span>
              {config && !showEventForm && (
                <button className="syc-icon-btn syc-add-event-btn" onClick={() => openEventForm()}>
                  <HugeiconsIcon icon={Add01IconData} size={16} />
                </button>
              )}
            </div>

            {selectedDateEvents.length === 0 ? (
              <div className="syc-no-events">
                <p>{t('schoolCalendar.noEvents')}</p>
                {config && !showEventForm && (
                  <button className="syc-add-event-link" onClick={() => openEventForm()}>
                    + Add an event
                  </button>
                )}
              </div>
            ) : (
              <div className="syc-event-list">
                {selectedDateEvents.map((event) => {
                  const typeConfig = EVENT_TYPE_CONFIG[event.event_type] || EVENT_TYPE_CONFIG.custom;
                  return (
                    <div key={event.id} className="syc-event-card">
                      <div className="syc-event-card-left" style={{ background: typeConfig.color }} />
                      <div className="syc-event-card-content">
                        <div className="syc-event-card-header">
                          <span className="syc-event-type-badge" style={{ background: `${typeConfig.color}18`, color: typeConfig.color }}>
                            {typeConfig.label}
                          </span>
                          <div className="syc-event-card-actions">
                            <button className="syc-icon-btn-sm" onClick={() => openEditEvent(event)}>
                              <HugeiconsIcon icon={PencilEdit01IconData} size={12} />
                            </button>
                            <button className="syc-icon-btn-sm syc-icon-btn-danger" onClick={() => handleDeleteEvent(event.id)}>
                              <HugeiconsIcon icon={Delete02IconData} size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="syc-event-title">{event.title}</div>
                        {event.description && (
                          <div className="syc-event-desc">{event.description}</div>
                        )}
                        {(event.subject || event.grade_level) && (
                          <div className="syc-event-meta">
                            {event.subject && <span>{event.subject}</span>}
                            {event.subject && event.grade_level && <span>&middot;</span>}
                            {event.grade_level && <span>{event.grade_level}</span>}
                          </div>
                        )}
                        {event.end_date && event.end_date !== event.event_date && (
                          <div className="syc-event-meta">
                            Until {format(parseISO(event.end_date), 'MMM d, yyyy')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* ========== School Year Calendar ========== */

        .syc-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #FAFAF7;
          overflow: hidden;
        }

        /* ===== Header ===== */
        .syc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: #1D362D;
          flex-shrink: 0;
        }

        .syc-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .syc-header-icon {
          width: 2.25rem;
          height: 2.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.625rem;
          background: rgba(248, 229, 157, 0.15);
          color: #F8E59D;
        }

        .syc-header-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #F8E59D;
          line-height: 1.2;
        }

        .syc-header-subtitle {
          font-size: 0.75rem;
          color: rgba(248, 229, 157, 0.6);
          font-weight: 500;
        }

        .syc-phase-rings {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          overflow-x: auto;
          flex-shrink: 0;
        }
        .dark .syc-phase-rings {
          background: #1e1e1e;
          border-color: #333;
        }

        .syc-ring-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          white-space: nowrap;
        }

        .syc-ring-label {
          font-size: 0.7rem;
          font-weight: 600;
        }

        .syc-ring-pct {
          font-size: 0.65rem;
          font-weight: 700;
          opacity: 0.8;
        }

        .syc-header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .syc-phase-badge {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.3rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid;
          font-size: 0.7rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .syc-phase-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .syc-phase-sep {
          opacity: 0.5;
          margin: 0 0.1rem;
        }

        .syc-header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .syc-today-btn {
          padding: 0.375rem 0.875rem;
          border-radius: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #1D362D;
          background: #F8E59D;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .syc-today-btn:hover {
          background: #f5dc7a;
          transform: translateY(-1px);
        }

        /* ===== Stats Strip ===== */
        .syc-stats-strip {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 1.5rem;
          background: #F5F5F0;
          border-bottom: 1px solid #E8E8E0;
          flex-shrink: 0;
          font-size: 0.8125rem;
          color: #64748B;
          flex-wrap: wrap;
        }

        .syc-stat-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: #64748B;
        }

        .syc-stat-item strong {
          color: #1D362D;
          font-weight: 700;
        }

        .syc-stat-divider {
          width: 1px;
          height: 1rem;
          background: #D4D4CC;
        }

        .syc-stat-badge {
          padding: 0.2rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* ===== Body ===== */
        .syc-body {
          flex: 1;
          display: flex;
          overflow: hidden;
          min-height: 0;
        }

        /* ===== Left Panel ===== */
        .syc-left-panel {
          width: 260px;
          flex-shrink: 0;
          border-right: 1px solid #E8E8E0;
          background: #FAFAF7;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .syc-panel-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .syc-section-title {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94A3B8;
        }

        .syc-active-config {
          background: white;
          border: 1px solid #E8E8E0;
          border-radius: 0.75rem;
          padding: 0.875rem;
        }

        .syc-config-label {
          font-size: 1rem;
          font-weight: 700;
          color: #1D362D;
          margin-bottom: 0.25rem;
        }

        .syc-config-dates {
          font-size: 0.8125rem;
          color: #64748B;
          margin-bottom: 0.625rem;
        }

        .syc-config-actions {
          display: flex;
          gap: 0.375rem;
        }

        .syc-config-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.3rem 0.625rem;
          border: 1px solid #E8E8E0;
          border-radius: 0.375rem;
          background: white;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748B;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .syc-config-btn:hover {
          background: #F5F5F0;
          color: #1D362D;
        }

        .syc-add-config-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 2px dashed #D4D4CC;
          border-radius: 0.75rem;
          background: transparent;
          font-size: 0.875rem;
          font-weight: 600;
          color: #94A3B8;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .syc-add-config-btn:hover {
          border-color: #1D362D;
          color: #1D362D;
          background: #F5F5F0;
        }

        /* Config Form */
        .syc-config-form {
          background: white;
          border: 1px solid #E8E8E0;
          border-radius: 0.75rem;
          padding: 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .syc-form-label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748B;
        }

        .syc-form-input {
          padding: 0.5rem 0.625rem;
          border: 1px solid #E8E8E0;
          border-radius: 0.5rem;
          font-size: 0.8125rem;
          color: #1D362D;
          background: #FAFAF7;
          outline: none;
          transition: border-color 0.15s ease;
          font-family: inherit;
        }

        .syc-form-input:focus {
          border-color: #1D362D;
          background: white;
        }

        .syc-form-textarea {
          resize: vertical;
          min-height: 60px;
        }

        .syc-form-hint {
          font-weight: 400;
          color: #94A3B8;
          font-size: 0.6875rem;
        }

        .syc-form-actions {
          display: flex;
          gap: 0.375rem;
          margin-top: 0.25rem;
        }

        .syc-btn-primary {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.875rem;
          border: none;
          border-radius: 0.5rem;
          background: #1D362D;
          color: #F8E59D;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .syc-btn-primary:hover {
          background: #2a4f42;
        }

        .syc-btn-secondary {
          padding: 0.5rem 0.875rem;
          border: 1px solid #E8E8E0;
          border-radius: 0.5rem;
          background: white;
          color: #64748B;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .syc-btn-secondary:hover {
          background: #F5F5F0;
          color: #1D362D;
        }

        /* Quick Add */
        .syc-quick-add-grid {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .syc-quick-add-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.625rem;
          border: 1px solid;
          border-radius: 0.5rem;
          background: white;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .syc-quick-add-btn:hover {
          transform: translateX(2px);
        }

        .syc-quick-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* ===== Center Panel - Year Grid ===== */
        .syc-center-panel {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          min-width: 0;
        }

        .syc-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 0.75rem;
          text-align: center;
          padding: 2rem;
        }

        .syc-empty-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #F5F5F0;
          margin-bottom: 0.5rem;
        }

        .syc-empty-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1D362D;
          margin: 0;
        }

        .syc-empty-desc {
          font-size: 0.875rem;
          color: #64748B;
          max-width: 320px;
          line-height: 1.5;
          margin: 0;
        }

        /* Year Grid */
        .syc-year-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }

        @media (max-width: 1400px) {
          .syc-year-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 1100px) {
          .syc-year-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .syc-mini-month {
          background: white;
          border: 1px solid #E8E8E0;
          border-radius: 0.75rem;
          padding: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .syc-mini-month-label {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #1D362D;
          margin-bottom: 0.5rem;
          padding-bottom: 0.375rem;
          border-bottom: 1px solid #F0F0E8;
        }

        .syc-mini-weekday-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          margin-bottom: 2px;
        }

        .syc-mini-weekday {
          text-align: center;
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #94A3B8;
          padding: 2px 0;
        }

        .syc-mini-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
        }

        /* Mini Day Cell */
        .syc-mini-day {
          position: relative;
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1px;
          border: none;
          border-radius: 0.375rem;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .syc-mini-day:hover:not(:disabled):not(.syc-mini-day-selected) {
          background: #F5F5F0;
        }

        .syc-mini-day:disabled {
          cursor: default;
        }

        .syc-mini-day-outside {
          opacity: 0;
          pointer-events: none;
        }

        .syc-mini-day-dimmed {
          opacity: 0.3;
        }

        .syc-mini-day-number {
          font-size: 0.6875rem;
          font-weight: 600;
          color: #374151;
          line-height: 1;
        }

        .syc-mini-day-selected {
          background: #1D362D !important;
          border-radius: 0.375rem;
          box-shadow: 0 1px 4px rgba(29, 54, 45, 0.3);
        }

        .syc-mini-day-selected .syc-mini-day-number {
          color: #F8E59D;
        }

        .syc-mini-day-today {
          background: #FFF7ED;
          box-shadow: inset 0 0 0 1.5px #F2A631;
        }

        .syc-mini-day-today .syc-mini-day-number {
          color: #F2A631;
          font-weight: 800;
        }

        /* Mini Indicators */
        .syc-mini-indicators {
          display: flex;
          align-items: center;
          gap: 1px;
          margin-top: 1px;
        }

        .syc-mini-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .syc-mini-dot-selected {
          background: #F8E59D !important;
        }

        /* ===== Right Panel ===== */
        .syc-right-panel {
          width: 300px;
          flex-shrink: 0;
          border-left: 1px solid #E8E8E0;
          background: white;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .syc-date-display {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #E8E8E0;
          flex-shrink: 0;
        }

        .syc-date-day {
          font-size: 2.25rem;
          font-weight: 800;
          color: #1D362D;
          line-height: 1;
          min-width: 2.5rem;
        }

        .syc-date-info {
          flex: 1;
        }

        .syc-date-weekday {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1D362D;
        }

        .syc-date-month {
          font-size: 0.75rem;
          color: #64748B;
        }

        .syc-date-count {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 1.5rem;
          height: 1.5rem;
          border-radius: 999px;
          background: #1D362D;
          color: #F8E59D;
          font-size: 0.75rem;
          font-weight: 700;
        }

        /* Event Form in Right Panel */
        .syc-event-form {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #E8E8E0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: #FAFAF7;
        }

        .syc-event-form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .syc-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.75rem;
          height: 1.75rem;
          border: 1px solid #E8E8E0;
          border-radius: 0.375rem;
          background: white;
          color: #64748B;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .syc-icon-btn:hover {
          background: #F5F5F0;
          color: #1D362D;
        }

        .syc-add-event-btn:hover {
          background: #1D362D;
          color: #F8E59D;
          border-color: #1D362D;
        }

        /* Events Section */
        .syc-events-section {
          flex: 1;
          padding: 0.75rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-height: 0;
          overflow-y: auto;
        }

        .syc-events-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .syc-no-events {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 2rem 0;
          text-align: center;
        }

        .syc-no-events p {
          font-size: 0.8125rem;
          color: #94A3B8;
          margin: 0;
        }

        .syc-add-event-link {
          background: none;
          border: none;
          color: #1D362D;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .syc-add-event-link:hover {
          color: #F2A631;
        }

        /* Event Cards */
        .syc-event-list {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .syc-event-card {
          display: flex;
          border: 1px solid #E8E8E0;
          border-radius: 0.625rem;
          overflow: hidden;
          background: #FAFAF7;
          transition: all 0.15s ease;
        }

        .syc-event-card:hover {
          border-color: #D4D4CC;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
        }

        .syc-event-card-left {
          width: 4px;
          flex-shrink: 0;
        }

        .syc-event-card-content {
          flex: 1;
          padding: 0.625rem 0.75rem;
          min-width: 0;
        }

        .syc-event-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .syc-event-type-badge {
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
        }

        .syc-event-card-actions {
          display: flex;
          gap: 0.25rem;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .syc-event-card:hover .syc-event-card-actions {
          opacity: 1;
        }

        .syc-icon-btn-sm {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.25rem;
          height: 1.25rem;
          border: none;
          border-radius: 0.25rem;
          background: transparent;
          color: #94A3B8;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .syc-icon-btn-sm:hover {
          background: #E8E8E0;
          color: #1D362D;
        }

        .syc-icon-btn-danger:hover {
          background: #FEE2E2;
          color: #E53E3E;
        }

        .syc-event-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1D362D;
          line-height: 1.3;
        }

        .syc-event-desc {
          font-size: 0.75rem;
          color: #64748B;
          margin-top: 0.25rem;
          line-height: 1.4;
        }

        .syc-event-meta {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.6875rem;
          color: #94A3B8;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default SchoolYearCalendar;
