import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSettings } from './SettingsContext';
import { useNotification } from './NotificationContext';
import { API_CONFIG } from '../config/api.config';

interface DueReminder {
  event_id: string;
  title: string;
  event_type: string;
  event_date: string;
  offset_minutes: number;
  trigger_label: string;
}

interface ReminderContextValue {
  pendingCount: number;
}

const ReminderContext = createContext<ReminderContextValue>({ pendingCount: 0 });

const SHOWN_KEY = 'olh_shown_reminders';
const POLL_INTERVAL_MS = 60_000;

function isInQuietHours(start: string, end: string): boolean {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const current = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  if (start > end) {
    // Overnight range e.g. 22:00 → 07:00
    return current >= start || current < end;
  }
  // Same-day range
  return current >= start && current < end;
}

function getShownSet(): Set<string> {
  try {
    const raw = localStorage.getItem(SHOWN_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function addShown(key: string) {
  const set = getShownSet();
  set.add(key);
  // Keep last 500 entries to prevent unbounded growth
  const arr = Array.from(set).slice(-500);
  localStorage.setItem(SHOWN_KEY, JSON.stringify(arr));
}

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const { notify, toastOnly } = useNotification();
  const [pendingCount, setPendingCount] = useState(0);
  const pendingRef = useRef<DueReminder[]>([]);

  const fireReminder = (reminder: DueReminder) => {
    const notifPrefs = settings.notifications;
    const message = `${reminder.title} — ${reminder.trigger_label}`;

    if (notifPrefs?.desktopEnabled) {
      (window as any).electronAPI?.showNotification?.(
        `Reminder: ${reminder.title}`,
        reminder.trigger_label.charAt(0).toUpperCase() + reminder.trigger_label.slice(1)
      );
    }

    if (notifPrefs?.inAppEnabled) {
      if (notifPrefs?.persistentDesktop) {
        // duration 0 = no auto-dismiss
        toastOnly(message, 'info', 0);
      } else {
        notify(message, 'info');
      }
    }
  };

  const pollReminders = async () => {
    const teacherId = settings.profile?.displayName;
    if (!teacherId) return;

    const notifPrefs = settings.notifications;
    if (!notifPrefs?.desktopEnabled && !notifPrefs?.inAppEnabled) return;

    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/school-year/reminders/due?teacher_id=${encodeURIComponent(teacherId)}`
      );
      if (!res.ok) return;

      const { reminders }: { reminders: DueReminder[] } = await res.json();
      const shown = getShownSet();

      for (const reminder of reminders) {
        const key = `${reminder.event_id}:${reminder.offset_minutes}`;
        if (shown.has(key)) continue;

        // Check event type filter
        const typeEnabled =
          notifPrefs?.enabledEventTypes?.[reminder.event_type as keyof typeof notifPrefs.enabledEventTypes] ?? true;
        if (!typeEnabled) continue;

        // Check quiet hours
        if (
          notifPrefs?.quietHoursEnabled &&
          isInQuietHours(notifPrefs.quietHoursStart ?? '22:00', notifPrefs.quietHoursEnd ?? '07:00')
        ) {
          // Queue for later
          if (!pendingRef.current.find((r) => `${r.event_id}:${r.offset_minutes}` === key)) {
            pendingRef.current = [...pendingRef.current, reminder];
            setPendingCount((c) => c + 1);
          }
          continue;
        }

        fireReminder(reminder);
        addShown(key);
      }
    } catch {
      // Silently ignore network errors (backend may not be ready)
    }
  };

  // Drain pending reminders when quiet hours end
  const drainPending = () => {
    const notifPrefs = settings.notifications;
    if (!notifPrefs?.quietHoursEnabled) return;
    if (
      isInQuietHours(notifPrefs.quietHoursStart ?? '22:00', notifPrefs.quietHoursEnd ?? '07:00')
    ) return;

    const pending = [...pendingRef.current];
    pendingRef.current = [];
    setPendingCount(0);

    for (const reminder of pending) {
      const key = `${reminder.event_id}:${reminder.offset_minutes}`;
      const shown = getShownSet();
      if (shown.has(key)) continue;
      fireReminder(reminder);
      addShown(key);
    }
  };

  useEffect(() => {
    pollReminders();
    const poll = setInterval(() => {
      drainPending();
      pollReminders();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(poll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.profile?.displayName, settings.notifications]);

  return (
    <ReminderContext.Provider value={{ pendingCount }}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => useContext(ReminderContext);
