import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import PlusSignIconData from '@hugeicons/core-free-icons/PlusSignIcon';
import Delete02IconData from '@hugeicons/core-free-icons/Delete02Icon';
import PencilEdit01IconData from '@hugeicons/core-free-icons/PencilEdit01Icon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import CheckmarkCircle01IconData from '@hugeicons/core-free-icons/CheckmarkCircle01Icon';
import Settings01IconData from '@hugeicons/core-free-icons/Settings01Icon';
import { filterSubjects, filterGrades, SUBJECTS } from '../data/teacherConstants';
import { useSettings } from '../contexts/SettingsContext';
import { useTimetable, TimetableSlot } from '../contexts/TimetableContext';

// ── Constants ──

const API = 'http://localhost:8000/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const ALL_GRADES = [
  'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
];

const ALL_SUBJECTS = ['Mathematics', 'Language Arts', 'Science', 'Social Studies'];

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Mathematics':    { bg: 'rgba(59,130,246,0.15)',  text: 'rgb(37,99,235)',   border: 'rgba(59,130,246,0.3)' },
  'Language Arts':  { bg: 'rgba(239,68,68,0.15)',   text: 'rgb(220,38,38)',   border: 'rgba(239,68,68,0.3)' },
  'Science':        { bg: 'rgba(34,197,94,0.15)',   text: 'rgb(22,163,74)',   border: 'rgba(34,197,94,0.3)' },
  'Social Studies': { bg: 'rgba(168,85,247,0.15)',  text: 'rgb(147,51,234)',  border: 'rgba(168,85,247,0.3)' },
};

const DEFAULT_COLOR = { bg: 'rgba(107,114,128,0.15)', text: 'rgb(75,85,99)', border: 'rgba(107,114,128,0.3)' };

const DEFAULT_TIME_BLOCKS: TimeBlock[] = [
  { id: '1',  start: '08:00', end: '08:30' },
  { id: '2',  start: '08:30', end: '09:00' },
  { id: '3',  start: '09:00', end: '09:30' },
  { id: '4',  start: '09:30', end: '10:00' },
  { id: '5',  start: '10:00', end: '10:30' },
  { id: '6',  start: '10:30', end: '11:00' },
  { id: '7',  start: '11:00', end: '11:30' },
  { id: '8',  start: '11:30', end: '12:00' },
  { id: '9',  start: '12:00', end: '12:30' },
  { id: '10', start: '12:30', end: '13:00' },
  { id: '11', start: '13:00', end: '13:30' },
  { id: '12', start: '13:30', end: '14:00' },
  { id: '13', start: '14:00', end: '14:30' },
  { id: '14', start: '14:30', end: '15:00' },
];

// ── Types ──

interface TimeBlock {
  id: string;
  start: string;
  end: string;
}

interface TimetableProps {
  tabId: string;
  savedData?: any;
  onDataChange?: (data: any) => void;
  isActive?: boolean;
  teacherId: string;
}

interface SlotFormState {
  subject: string;
  grade_level: string;
  class_name: string;
  notes: string;
}

interface CellTarget {
  day: string;
  timeBlock: TimeBlock;
  existingSlot: TimetableSlot | null;
}

// ── Icon helper ──

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

// ── Helpers ──

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

function getSubjectColor(subject: string) {
  return SUBJECT_COLORS[subject] || DEFAULT_COLOR;
}

function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ── Main Component ──

const Timetable: React.FC<TimetableProps> = ({ tabId, savedData, onDataChange, isActive, teacherId }) => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const timetableCtx = useTimetable();

  const gradeSubjects = settings?.profile?.gradeSubjects ?? {};
  const filterEnabled = settings?.profile?.filterContentByProfile ?? false;

  // ── Time blocks state ──
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(() => {
    if (savedData?.timeBlocks && Array.isArray(savedData.timeBlocks) && savedData.timeBlocks.length > 0) {
      return savedData.timeBlocks;
    }
    return DEFAULT_TIME_BLOCKS;
  });

  const [showConfig, setShowConfig] = useState(false);

  // ── Slots state ──
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  // ── Modal state ──
  const [cellTarget, setCellTarget] = useState<CellTarget | null>(null);
  const [form, setForm] = useState<SlotFormState>({ subject: '', grade_level: '', class_name: '', notes: '' });
  const [classes, setClasses] = useState<string[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ── Derived filtered lists ──
  const filteredSubjects = filterSubjects(ALL_SUBJECTS, gradeSubjects, filterEnabled);
  const filteredGrades = filterGrades(ALL_GRADES, gradeSubjects, filterEnabled);

  // ── Fetch slots ──
  const fetchSlots = useCallback(() => {
    if (!teacherId) return;
    setLoadingSlots(true);
    setSlotError(null);
    axios.get(`${API}/school-year/timetable/${encodeURIComponent(teacherId)}`)
      .then(res => setSlots(res.data?.slots || []))
      .catch(() => setSlotError('Failed to load timetable data.'))
      .finally(() => setLoadingSlots(false));
  }, [teacherId]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // ── Persist time blocks to savedData ──
  useEffect(() => {
    onDataChange?.({ ...(savedData || {}), timeBlocks });
  }, [timeBlocks]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch classes when grade changes ──
  useEffect(() => {
    if (!form.grade_level) {
      setClasses([]);
      return;
    }
    setLoadingClasses(true);
    axios.get(`${API}/classes?grade_level=${encodeURIComponent(form.grade_level)}`)
      .then(res => {
        const list: string[] = (res.data || []).map((c: any) => c.class_name || c.name || c);
        setClasses(list);
        if (list.length === 1) {
          setForm(prev => ({ ...prev, class_name: list[0] }));
        }
      })
      .catch(() => setClasses([]))
      .finally(() => setLoadingClasses(false));
  }, [form.grade_level]);

  // ── Lookup slot for cell ──
  const getSlotForCell = useCallback((day: string, block: TimeBlock): TimetableSlot | null => {
    return slots.find(
      s => s.day_of_week === day && s.start_time === block.start && s.end_time === block.end
    ) || null;
  }, [slots]);

  // ── Open modal ──
  const openModal = useCallback((day: string, block: TimeBlock) => {
    const existing = getSlotForCell(day, block);
    setCellTarget({ day, timeBlock: block, existingSlot: existing });
    if (existing) {
      setForm({
        subject: existing.subject,
        grade_level: existing.grade_level,
        class_name: existing.class_name || '',
        notes: existing.notes || '',
      });
    } else {
      setForm({ subject: '', grade_level: '', class_name: '', notes: '' });
    }
    setFormError(null);
  }, [getSlotForCell]);

  const closeModal = useCallback(() => {
    setCellTarget(null);
    setForm({ subject: '', grade_level: '', class_name: '', notes: '' });
    setClasses([]);
    setFormError(null);
  }, []);

  // ── Save slot ──
  const handleSave = useCallback(async () => {
    if (!cellTarget) return;
    if (!form.subject) { setFormError('Subject is required.'); return; }
    if (!form.grade_level) { setFormError('Grade level is required.'); return; }

    setSaving(true);
    setFormError(null);
    try {
      if (cellTarget.existingSlot) {
        // Delete old then create new (no PUT endpoint assumed)
        await axios.delete(`${API}/school-year/timetable/${cellTarget.existingSlot.id}`);
      }
      await axios.post(`${API}/school-year/timetable`, {
        teacher_id: teacherId,
        day_of_week: cellTarget.day,
        start_time: cellTarget.timeBlock.start,
        end_time: cellTarget.timeBlock.end,
        subject: form.subject,
        grade_level: form.grade_level,
        class_name: form.class_name || null,
        notes: form.notes || null,
      });
      fetchSlots();
      timetableCtx.refresh();
      closeModal();
    } catch {
      setFormError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [cellTarget, form, teacherId, fetchSlots, timetableCtx, closeModal]);

  // ── Delete slot ──
  const handleDelete = useCallback(async () => {
    if (!cellTarget?.existingSlot) return;
    setDeleting(true);
    setFormError(null);
    try {
      await axios.delete(`${API}/school-year/timetable/${cellTarget.existingSlot.id}`);
      fetchSlots();
      timetableCtx.refresh();
      closeModal();
    } catch {
      setFormError('Failed to delete. Please try again.');
    } finally {
      setDeleting(false);
    }
  }, [cellTarget, fetchSlots, timetableCtx, closeModal]);

  // ── Time block config handlers ──
  const addTimeBlock = useCallback(() => {
    const last = timeBlocks[timeBlocks.length - 1];
    let newStart = '15:00';
    let newEnd = '15:30';
    if (last) {
      newStart = last.end;
      const [h, m] = last.end.split(':').map(Number);
      const totalMins = h * 60 + m + 30;
      const nh = Math.floor(totalMins / 60);
      const nm = totalMins % 60;
      newEnd = `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
    }
    setTimeBlocks(prev => [...prev, { id: generateBlockId(), start: newStart, end: newEnd }]);
  }, [timeBlocks]);

  const removeTimeBlock = useCallback((id: string) => {
    setTimeBlocks(prev => prev.filter(b => b.id !== id));
  }, []);

  const updateTimeBlock = useCallback((id: string, field: 'start' | 'end', value: string) => {
    setTimeBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  }, []);

  // ── Render ──

  return (
    <div className="flex flex-col gap-4 p-4 h-full" style={{ color: 'var(--text-primary)' }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon={Clock01IconData} className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t('timetable.title', 'Weekly Timetable')}
          </h2>
        </div>
        <button
          onClick={() => setShowConfig(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: showConfig ? 'var(--bg-secondary)' : 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <Icon icon={Settings01IconData} className="w-4 h-4" />
          {t('timetable.configureBlocks', 'Configure Time Blocks')}
        </button>
      </div>

      {/* Time block config panel */}
      {showConfig && (
        <div
          className="rounded-xl p-4 flex flex-col gap-3"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {t('timetable.timeBlocks', 'Time Blocks')}
            </span>
            <button
              onClick={addTimeBlock}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
            >
              <Icon icon={PlusSignIconData} className="w-3.5 h-3.5" />
              {t('timetable.addBlock', 'Add Time Block')}
            </button>
          </div>

          <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
            {timeBlocks.map((block, idx) => (
              <div
                key={block.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}
              >
                <span className="text-xs w-5 text-right" style={{ color: 'var(--text-muted)' }}>
                  {idx + 1}
                </span>
                <input
                  type="time"
                  value={block.start}
                  onChange={e => updateTimeBlock(block.id, 'start', e.target.value)}
                  className="text-xs rounded px-1.5 py-0.5 w-24"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>to</span>
                <input
                  type="time"
                  value={block.end}
                  onChange={e => updateTimeBlock(block.id, 'end', e.target.value)}
                  className="text-xs rounded px-1.5 py-0.5 w-24"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
                <button
                  onClick={() => removeTimeBlock(block.id)}
                  className="ml-auto p-1 rounded hover:bg-red-100 transition-colors"
                  title="Remove time block"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Icon icon={Delete02IconData} className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error banner */}
      {slotError && (
        <div className="rounded-lg px-4 py-2 text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'rgb(220,38,38)', border: '1px solid rgba(239,68,68,0.2)' }}>
          {slotError}
        </div>
      )}

      {/* Timetable grid */}
      <div className="overflow-auto flex-1 rounded-xl" style={{ border: '1px solid var(--border-primary)' }}>
        {loadingSlots ? (
          <div className="flex items-center justify-center h-40" style={{ color: 'var(--text-muted)' }}>
            <span className="text-sm">Loading timetable...</span>
          </div>
        ) : (
          <table className="w-full border-collapse text-sm" style={{ minWidth: '700px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th
                  className="text-left px-3 py-2.5 text-xs font-semibold sticky left-0 z-10"
                  style={{
                    width: '110px',
                    minWidth: '110px',
                    color: 'var(--text-muted)',
                    borderRight: '1px solid var(--border-primary)',
                    borderBottom: '1px solid var(--border-primary)',
                    background: 'var(--bg-secondary)',
                  }}
                >
                  Time
                </th>
                {DAYS.map(day => (
                  <th
                    key={day}
                    className="text-center px-2 py-2.5 text-xs font-semibold"
                    style={{
                      color: 'var(--text-primary)',
                      borderRight: '1px solid var(--border-primary)',
                      borderBottom: '1px solid var(--border-primary)',
                    }}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeBlocks.map((block, idx) => (
                <tr
                  key={block.id}
                  style={{
                    background: idx % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                  }}
                >
                  {/* Time column */}
                  <td
                    className="px-3 py-2 text-xs font-medium sticky left-0 z-10"
                    style={{
                      color: 'var(--text-muted)',
                      borderRight: '1px solid var(--border-primary)',
                      borderBottom: '1px solid var(--border-primary)',
                      background: idx % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span className="block">{formatTime(block.start)}</span>
                    <span className="block opacity-60">{formatTime(block.end)}</span>
                  </td>

                  {/* Day cells */}
                  {DAYS.map(day => {
                    const slot = getSlotForCell(day, block);
                    const color = slot ? getSubjectColor(slot.subject) : null;
                    return (
                      <TimetableCell
                        key={day}
                        slot={slot}
                        color={color}
                        onClick={() => openModal(day, block)}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-1">
        {ALL_SUBJECTS.map(subj => {
          const col = getSubjectColor(subj);
          return (
            <div key={subj} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ background: col.bg, border: `1px solid ${col.border}` }}
              />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{subj}</span>
            </div>
          );
        })}
      </div>

      {/* Slot editor modal */}
      {cellTarget && (
        <SlotModal
          target={cellTarget}
          form={form}
          setForm={setForm}
          classes={classes}
          loadingClasses={loadingClasses}
          saving={saving}
          deleting={deleting}
          formError={formError}
          filteredSubjects={filteredSubjects}
          filteredGrades={filteredGrades}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// ── TimetableCell sub-component ──

interface TimetableCellProps {
  slot: TimetableSlot | null;
  color: { bg: string; text: string; border: string } | null;
  onClick: () => void;
}

const TimetableCell: React.FC<TimetableCellProps> = ({ slot, color, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <td
      className="p-1 cursor-pointer transition-all"
      style={{
        borderRight: '1px solid var(--border-primary)',
        borderBottom: '1px solid var(--border-primary)',
        minWidth: '120px',
        height: '60px',
        verticalAlign: 'top',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {slot && color ? (
        <div
          className="h-full rounded-md px-2 py-1 flex flex-col justify-between relative overflow-hidden transition-all"
          style={{
            background: color.bg,
            border: `1px solid ${color.border}`,
            minHeight: '52px',
          }}
        >
          <div className="flex items-start justify-between gap-1">
            <span className="text-xs font-semibold leading-tight" style={{ color: color.text }}>
              {slot.subject}
            </span>
            {hovered && (
              <div className="flex gap-0.5 shrink-0">
                <span
                  className="p-0.5 rounded hover:bg-white/30 transition-colors"
                  style={{ color: color.text }}
                  title="Edit slot"
                >
                  <HugeiconsIcon icon={PencilEdit01IconData} size={11} />
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs" style={{ color: color.text, opacity: 0.8 }}>
              {slot.grade_level}
            </span>
            {slot.class_name && (
              <span className="text-xs" style={{ color: color.text, opacity: 0.65 }}>
                {slot.class_name}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div
          className="h-full rounded-md flex items-center justify-center transition-all"
          style={{
            minHeight: '52px',
            background: hovered ? 'var(--bg-secondary)' : 'transparent',
            border: hovered ? '1px dashed var(--border-primary)' : '1px dashed transparent',
          }}
        >
          {hovered && (
            <HugeiconsIcon
              icon={PlusSignIconData}
              size={16}
              style={{ color: 'var(--text-muted)', opacity: 0.5 }}
            />
          )}
        </div>
      )}
    </td>
  );
};

// ── SlotModal sub-component ──

interface SlotModalProps {
  target: CellTarget;
  form: SlotFormState;
  setForm: React.Dispatch<React.SetStateAction<SlotFormState>>;
  classes: string[];
  loadingClasses: boolean;
  saving: boolean;
  deleting: boolean;
  formError: string | null;
  filteredSubjects: string[];
  filteredGrades: string[];
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const SlotModal: React.FC<SlotModalProps> = ({
  target,
  form,
  setForm,
  classes,
  loadingClasses,
  saving,
  deleting,
  formError,
  filteredSubjects,
  filteredGrades,
  onSave,
  onDelete,
  onClose,
}) => {
  const { t } = useTranslation();
  const overlayRef = useRef<HTMLDivElement>(null);

  const isEditing = !!target.existingSlot;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
      onClick={handleOverlayClick}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4 p-6"
        style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              {isEditing
                ? t('timetable.editSlot', 'Edit Slot')
                : t('timetable.addSlot', 'Add Slot')}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {target.day} &bull; {formatTime(target.timeBlock.start)} - {formatTime(target.timeBlock.end)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <Icon icon={Cancel01IconData} className="w-4 h-4" />
          </button>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-3">

          {/* Subject */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {t('timetable.subject', 'Subject')} <span style={{ color: 'rgb(220,38,38)' }}>*</span>
            </label>
            <select
              value={form.subject}
              onChange={e => setForm(prev => ({ ...prev, subject: e.target.value, class_name: '' }))}
              className="rounded-lg px-3 py-2 text-sm w-full"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
            >
              <option value="">Select subject...</option>
              {filteredSubjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Grade level */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {t('timetable.gradeLevel', 'Grade Level')} <span style={{ color: 'rgb(220,38,38)' }}>*</span>
            </label>
            <select
              value={form.grade_level}
              onChange={e => setForm(prev => ({ ...prev, grade_level: e.target.value, class_name: '' }))}
              className="rounded-lg px-3 py-2 text-sm w-full"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
            >
              <option value="">Select grade...</option>
              {filteredGrades.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Class name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {t('timetable.className', 'Class')}
              {loadingClasses && <span className="ml-1 opacity-60">(loading...)</span>}
            </label>
            {classes.length > 0 ? (
              <select
                value={form.class_name}
                onChange={e => setForm(prev => ({ ...prev, class_name: e.target.value }))}
                className="rounded-lg px-3 py-2 text-sm w-full"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
              >
                <option value="">Select class...</option>
                {classes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={form.class_name}
                onChange={e => setForm(prev => ({ ...prev, class_name: e.target.value }))}
                placeholder={form.grade_level ? 'Enter class name (optional)' : 'Select a grade first'}
                disabled={!form.grade_level}
                className="rounded-lg px-3 py-2 text-sm w-full"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
              />
            )}
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {t('timetable.notes', 'Notes')} <span className="opacity-60">(optional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any notes for this slot..."
              rows={2}
              className="rounded-lg px-3 py-2 text-sm w-full resize-none"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* Error */}
        {formError && (
          <div className="rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(239,68,68,0.1)', color: 'rgb(220,38,38)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {formError}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1">
          {isEditing && (
            <button
              onClick={onDelete}
              disabled={deleting || saving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: 'rgba(239,68,68,0.1)',
                color: 'rgb(220,38,38)',
                border: '1px solid rgba(239,68,68,0.2)',
                opacity: deleting ? 0.7 : 1,
              }}
            >
              <Icon icon={Delete02IconData} className="w-4 h-4" />
              {deleting ? 'Deleting...' : t('timetable.delete', 'Delete')}
            </button>
          )}

          <div className="flex-1" />

          <button
            onClick={onClose}
            disabled={saving || deleting}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
          >
            {t('common.cancel', 'Cancel')}
          </button>

          <button
            onClick={onSave}
            disabled={saving || deleting || !form.subject || !form.grade_level}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: (!form.subject || !form.grade_level || saving || deleting)
                ? 'rgba(59,130,246,0.4)'
                : 'rgb(37,99,235)',
              color: 'white',
              cursor: (!form.subject || !form.grade_level || saving || deleting) ? 'not-allowed' : 'pointer',
            }}
          >
            <Icon icon={CheckmarkCircle01IconData} className="w-4 h-4" />
            {saving ? 'Saving...' : t('common.save', 'Save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
