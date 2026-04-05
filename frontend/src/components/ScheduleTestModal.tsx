import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Calendar01IconData from '@hugeicons/core-free-icons/Calendar01Icon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import CheckmarkCircle01IconData from '@hugeicons/core-free-icons/CheckmarkCircle01Icon';
import axios from 'axios';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
const CalendarIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Calendar01IconData} {...p} />;
const ClockIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Clock01IconData} {...p} />;
const CheckCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CheckmarkCircle01IconData} {...p} />;

const API_BASE = 'http://localhost:8000';

interface ScheduleTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  testInfo: {
    title: string;
    type: 'quiz' | 'worksheet';
    referenceId: string;
    subject: string;
    gradeLevel: string;
  };
  accentColor?: string;
}

const ScheduleTestModal: React.FC<ScheduleTestModalProps> = ({
  isOpen,
  onClose,
  testInfo,
  accentColor = '#3b82f6',
}) => {
  const { t } = useTranslation();
  const [testDate, setTestDate] = useState('');
  const [testTime, setTestTime] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSchedule = async () => {
    if (!testDate) return;
    setSaving(true);
    try {
      await axios.post(`${API_BASE}/api/reminders`, {
        title: testInfo.title,
        description: `Scheduled ${testInfo.type === 'quiz' ? 'quiz' : 'worksheet'} for Grade ${testInfo.gradeLevel}`,
        test_date: testDate,
        test_time: testTime || null,
        type: testInfo.type,
        reference_id: testInfo.referenceId,
        subject: testInfo.subject,
        grade_level: testInfo.gradeLevel,
      });
      setSaved(true);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error('Failed to save reminder:', err);
    } finally {
      setSaving(false);
    }
  };

  // Get tomorrow's date as min value
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-theme-surface rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-theme">
        {/* Header */}
        <div className="px-6 py-4 border-b border-theme flex items-center justify-between" style={{ backgroundColor: `${accentColor}08` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}15` }}>
              <CalendarIcon className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-theme-heading">Schedule {testInfo.type === 'quiz' ? 'Quiz' : 'Worksheet'} Date</h3>
              <p className="text-xs text-theme-hint">When will students take this {testInfo.type}?</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-theme-hover transition">
            <X className="w-4 h-4 text-theme-muted" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {saved ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-semibold text-theme-heading">{t('schedule.reminderSet')}</p>
              <p className="text-sm text-theme-muted mt-1">
                You'll be reminded about this {testInfo.type} on {new Date(testDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ) : (
            <>
              {/* Test info summary */}
              <div className="p-3 rounded-lg bg-theme-secondary text-sm">
                <p className="font-medium text-theme-label">{testInfo.title}</p>
                <p className="text-xs text-theme-hint mt-0.5">
                  {testInfo.subject} - Grade {testInfo.gradeLevel} - {testInfo.type === 'quiz' ? 'Quiz' : 'Worksheet'}
                </p>
              </div>

              {/* Date picker */}
              <div>
                <label className="block text-sm font-medium text-theme-label mb-1.5">
                  <CalendarIcon className="w-4 h-4 inline mr-1.5" style={{ color: accentColor }} />
                  {testInfo.type === 'quiz' ? 'Quiz' : 'Worksheet'} Date
                </label>
                <input
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  min={minDate}
                  className="w-full px-3 py-2.5 border border-theme-strong rounded-lg bg-theme-bg text-theme-label text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Time picker (optional) */}
              <div>
                <label className="block text-sm font-medium text-theme-label mb-1.5">
                  <ClockIcon className="w-4 h-4 inline mr-1.5" style={{ color: accentColor }} />
                  Time (optional)
                </label>
                <input
                  type="time"
                  value={testTime}
                  onChange={(e) => setTestTime(e.target.value)}
                  className="w-full px-3 py-2.5 border border-theme-strong rounded-lg bg-theme-bg text-theme-label text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!saved && (
          <div className="px-6 py-4 border-t border-theme flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-theme text-sm font-medium text-theme-body hover:bg-theme-hover transition"
            >
              {t('schedule.skip')}
            </button>
            <button
              onClick={handleSchedule}
              disabled={!testDate || saving}
              className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition disabled:opacity-40"
              style={{ backgroundColor: accentColor }}
            >
              {saving ? t('common.saving') : t('schedule.setReminder')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleTestModal;
