import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useNotification } from '../contexts/NotificationContext';
import type { Task } from '../types/task';

export interface TestReminder {
  id: string;
  title: string;
  test_date: string;
  test_time?: string | null;
  type: string;
  subject?: string;
  grade_level?: string;
}

/**
 * Fires notifications for overdue, due-today, and due-tomorrow tasks and test reminders.
 * Runs once when items first load and then every 5 minutes.
 * Tracks already-sent alerts per session so the same item isn't spammed.
 */
export function useTaskNotifications(tasks: Task[], reminders: TestReminder[] = []) {
  const { notify } = useNotification();
  const notifiedRef = useRef<Set<string>>(new Set());
  const hasLoadedRef = useRef(false);

  const checkItems = (taskList: Task[], reminderList: TestReminder[]) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const tomorrow = format(
      new Date(Date.now() + 24 * 60 * 60 * 1000),
      'yyyy-MM-dd'
    );

    const overdueBatch: string[] = [];
    const todayBatch: string[] = [];
    const tomorrowBatch: string[] = [];

    taskList.forEach(task => {
      if (task.completed) return;

      const key_overdue = `${task.id}:overdue`;
      const key_today = `${task.id}:today`;
      const key_tomorrow = `${task.id}:tomorrow`;

      if (task.date < today && !notifiedRef.current.has(key_overdue)) {
        overdueBatch.push(task.title);
        notifiedRef.current.add(key_overdue);
      } else if (task.date === today && !notifiedRef.current.has(key_today)) {
        todayBatch.push(task.title);
        notifiedRef.current.add(key_today);
      } else if (task.date === tomorrow && !notifiedRef.current.has(key_tomorrow)) {
        tomorrowBatch.push(task.title);
        notifiedRef.current.add(key_tomorrow);
      }
    });

    // Check test reminders the same way
    reminderList.forEach(r => {
      const key_overdue = `reminder-${r.id}:overdue`;
      const key_today = `reminder-${r.id}:today`;
      const key_tomorrow = `reminder-${r.id}:tomorrow`;

      if (r.test_date < today && !notifiedRef.current.has(key_overdue)) {
        overdueBatch.push(`${r.type === 'quiz' ? 'Quiz' : 'Worksheet'}: ${r.title}`);
        notifiedRef.current.add(key_overdue);
      } else if (r.test_date === today && !notifiedRef.current.has(key_today)) {
        todayBatch.push(`${r.type === 'quiz' ? 'Quiz' : 'Worksheet'}: ${r.title}`);
        notifiedRef.current.add(key_today);
      } else if (r.test_date === tomorrow && !notifiedRef.current.has(key_tomorrow)) {
        tomorrowBatch.push(`${r.type === 'quiz' ? 'Quiz' : 'Worksheet'}: ${r.title}`);
        notifiedRef.current.add(key_tomorrow);
      }
    });

    // Fire grouped notifications
    if (overdueBatch.length === 1) {
      notify(`Overdue: "${overdueBatch[0]}"`, 'error');
    } else if (overdueBatch.length > 1) {
      notify(`${overdueBatch.length} items are overdue and need attention`, 'error');
    }

    if (todayBatch.length === 1) {
      notify(`Due today: "${todayBatch[0]}"`, 'success');
    } else if (todayBatch.length > 1) {
      notify(`${todayBatch.length} items are due today`, 'success');
    }

    if (tomorrowBatch.length === 1) {
      notify(`Upcoming tomorrow: "${tomorrowBatch[0]}"`, 'success');
    } else if (tomorrowBatch.length > 1) {
      notify(`${tomorrowBatch.length} items are due tomorrow`, 'success');
    }
  };

  const itemCount = tasks.length + reminders.length;

  // Run once when items are first loaded (non-empty)
  useEffect(() => {
    if (itemCount === 0 || hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    checkItems(tasks, reminders);
  }, [itemCount]);

  // Re-check every 5 minutes to catch newly overdue items as time passes
  useEffect(() => {
    if (itemCount === 0) return;
    const interval = setInterval(() => checkItems(tasks, reminders), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks, reminders]);
}
