import React, { useEffect, useState, useCallback } from 'react';

/**
 * Feature 3B: Scheduled Task settings UI.
 *
 * Embedded inside Settings.tsx under a "Background Schedule" card.
 * Lets the teacher pick day + time, choose which tasks run, toggle the
 * schedule on/off, and manually trigger a run for testing.
 */

type TaskType = 'elo_breakdown' | 'attendance_summary' | 'progress_report';

interface ScheduleConfig {
  teacher_id: string;
  schedule_day: string;
  schedule_time: string;
  reminder_offset_min: number;
  tasks_enabled: TaskType[];
  is_active: boolean;
}

interface Props {
  teacherId: string;
}

const DAYS: Array<{ value: string; label: string }> = [
  { value: 'monday',    label: 'Monday' },
  { value: 'tuesday',   label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday',  label: 'Thursday' },
  { value: 'friday',    label: 'Friday' },
  { value: 'saturday',  label: 'Saturday' },
  { value: 'sunday',    label: 'Sunday' },
];

const REMINDER_OFFSETS: Array<{ value: number; label: string }> = [
  { value: 0,   label: 'None' },
  { value: 15,  label: '15 minutes before' },
  { value: 30,  label: '30 minutes before' },
  { value: 60,  label: '1 hour before' },
  { value: 120, label: '2 hours before' },
  { value: 1440, label: '1 day before' },
];

const TASKS: Array<{ id: TaskType; label: string; desc: string }> = [
  {
    id: 'elo_breakdown',
    label: 'Weekly ELO Breakdown',
    desc: 'Assign pending ELOs to specific periods for the upcoming week based on your timetable.',
  },
  {
    id: 'attendance_summary',
    label: 'Attendance Summary',
    desc: 'Weekly attendance patterns, flagged students, and follow-up suggestions.',
  },
  {
    id: 'progress_report',
    label: 'Progress Report',
    desc: 'Student progress snapshot with grade trends and class-level observations.',
  },
];

const API_BASE = 'http://127.0.0.1:8000';

const ScheduledTaskSettings: React.FC<Props> = ({ teacherId }) => {
  const [config, setConfig] = useState<ScheduleConfig>({
    teacher_id: teacherId,
    schedule_day: 'sunday',
    schedule_time: '18:00',
    reminder_offset_min: 60,
    tasks_enabled: ['elo_breakdown'],
    is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [message, setMessage] = useState<{ text: string; kind: 'ok' | 'error' } | null>(null);

  // Load existing config on mount / teacher id change
  useEffect(() => {
    if (!teacherId) return;
    let cancelled = false;
    setLoading(true);
    fetch(`${API_BASE}/api/scheduled/config/${encodeURIComponent(teacherId)}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (data?.config) {
          setConfig({
            teacher_id: teacherId,
            schedule_day: data.config.schedule_day || 'sunday',
            schedule_time: data.config.schedule_time || '18:00',
            reminder_offset_min: data.config.reminder_offset_min ?? 60,
            tasks_enabled: data.config.tasks_enabled || ['elo_breakdown'],
            is_active: !!data.config.is_active,
          });
        }
      })
      .catch(e => console.error('[ScheduledTaskSettings] load failed', e))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [teacherId]);

  const toggleTask = useCallback((task: TaskType) => {
    setConfig(prev => {
      const has = prev.tasks_enabled.includes(task);
      let next = has
        ? prev.tasks_enabled.filter(t => t !== task)
        : [...prev.tasks_enabled, task];
      if (next.length === 0) next = ['elo_breakdown'];
      return { ...prev, tasks_enabled: next };
    });
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/scheduled/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail || `HTTP ${res.status}`);
      }
      setMessage({ text: 'Schedule saved.', kind: 'ok' });
    } catch (e: any) {
      setMessage({ text: `Save failed: ${e.message}`, kind: 'error' });
    } finally {
      setSaving(false);
    }
  }, [config]);

  const handleManualTrigger = useCallback(async () => {
    if (!confirm('Run all enabled tasks now? This will take a minute or two while the model generates results.')) return;
    setTriggering(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/scheduled/trigger/${encodeURIComponent(teacherId)}`, {
        method: 'POST',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const ranCount = data?.ran?.length || 0;
      const errCount = data?.errors?.length || 0;
      setMessage({
        text: `Triggered: ${ranCount} task(s) ran, ${errCount} error(s). Check scheduled results.`,
        kind: errCount > 0 ? 'error' : 'ok',
      });
    } catch (e: any) {
      setMessage({ text: `Trigger failed: ${e.message}`, kind: 'error' });
    } finally {
      setTriggering(false);
    }
  }, [teacherId]);

  const handleDisable = useCallback(async () => {
    if (!confirm('Delete the schedule and stop all background tasks?')) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/scheduled/config/${encodeURIComponent(teacherId)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMessage({ text: 'Schedule removed.', kind: 'ok' });
      setConfig({
        teacher_id: teacherId,
        schedule_day: 'sunday',
        schedule_time: '18:00',
        reminder_offset_min: 60,
        tasks_enabled: ['elo_breakdown'],
        is_active: false,
      });
    } catch (e: any) {
      setMessage({ text: `Remove failed: ${e.message}`, kind: 'error' });
    } finally {
      setSaving(false);
    }
  }, [teacherId]);

  if (loading) {
    return <p className="text-xs text-theme-hint">Loading schedule...</p>;
  }

  return (
    <div className="space-y-4">
      {/* Active toggle */}
      <div className="flex items-center justify-between">
        <div className="pr-4">
          <p className="text-sm font-medium text-theme-heading">Background schedule</p>
          <p className="text-xs text-theme-hint mt-0.5">
            When enabled, selected tasks run automatically on your chosen day and time.
          </p>
        </div>
        <button
          onClick={() => setConfig(prev => ({ ...prev, is_active: !prev.is_active }))}
          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
            config.is_active ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          aria-label="Toggle background schedule"
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            config.is_active ? 'translate-x-5' : ''
          }`} />
        </button>
      </div>

      {/* Day / time / reminder row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-theme-heading mb-1">Day</label>
          <select
            value={config.schedule_day}
            onChange={(e) => setConfig(prev => ({ ...prev, schedule_day: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-theme-strong rounded-md bg-theme-surface text-theme-label focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!config.is_active}
          >
            {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-theme-heading mb-1">Time</label>
          <input
            type="time"
            value={config.schedule_time}
            onChange={(e) => setConfig(prev => ({ ...prev, schedule_time: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-theme-strong rounded-md bg-theme-surface text-theme-label focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!config.is_active}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-theme-heading mb-1">Reminder</label>
          <select
            value={config.reminder_offset_min}
            onChange={(e) => setConfig(prev => ({ ...prev, reminder_offset_min: parseInt(e.target.value, 10) }))}
            className="w-full px-3 py-2 text-sm border border-theme-strong rounded-md bg-theme-surface text-theme-label focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!config.is_active}
          >
            {REMINDER_OFFSETS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
      </div>

      {/* Task checkboxes */}
      <div>
        <p className="text-xs font-medium text-theme-heading mb-2">Tasks to run</p>
        <div className="space-y-2">
          {TASKS.map(task => {
            const checked = config.tasks_enabled.includes(task.id);
            return (
              <label
                key={task.id}
                className={`flex items-start gap-3 p-2 rounded-md cursor-pointer transition ${
                  checked ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-theme-hover'
                } ${!config.is_active ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleTask(task.id)}
                  className="mt-0.5 w-4 h-4 rounded border-theme-strong text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-theme-heading">{task.label}</p>
                  <p className="text-xs text-theme-hint mt-0.5">{task.desc}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Schedule'}
        </button>
        <button
          onClick={handleManualTrigger}
          disabled={triggering || !config.is_active}
          className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Run all enabled tasks now (for testing)"
        >
          {triggering ? 'Running...' : 'Run Now'}
        </button>
        <button
          onClick={handleDisable}
          disabled={saving || triggering}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition disabled:opacity-50"
        >
          Remove Schedule
        </button>
      </div>

      {message && (
        <p className={`text-xs ${message.kind === 'ok' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default ScheduledTaskSettings;
