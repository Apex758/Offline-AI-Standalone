import { useEffect, useRef } from 'react';
import { format, isToday, isTomorrow, isPast, parseISO, startOfDay } from 'date-fns';
import { useNotification } from '../contexts/NotificationContext';
import type { Task } from '../types/task';

/**
 * Fires notifications for overdue, due-today, and due-tomorrow tasks.
 * Runs once when tasks first load and then every 5 minutes.
 * Tracks already-sent alerts per session so the same task isn't spammed.
 */
export function useTaskNotifications(tasks: Task[]) {
  const { notify } = useNotification();
  // Key format: "<taskId>:<type>" where type is "overdue" | "today" | "tomorrow"
  const notifiedRef = useRef<Set<string>>(new Set());
  const hasLoadedRef = useRef(false);

  const checkTasks = (taskList: Task[]) => {
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

    // Fire grouped notifications
    if (overdueBatch.length === 1) {
      notify(`Overdue task: "${overdueBatch[0]}"`, 'error');
    } else if (overdueBatch.length > 1) {
      notify(`${overdueBatch.length} tasks are overdue and need attention`, 'error');
    }

    if (todayBatch.length === 1) {
      notify(`Task due today: "${todayBatch[0]}"`, 'success');
    } else if (todayBatch.length > 1) {
      notify(`${todayBatch.length} tasks are due today`, 'success');
    }

    if (tomorrowBatch.length === 1) {
      notify(`Upcoming tomorrow: "${tomorrowBatch[0]}"`, 'success');
    } else if (tomorrowBatch.length > 1) {
      notify(`${tomorrowBatch.length} tasks are due tomorrow`, 'success');
    }
  };

  // Run once when tasks are first loaded (non-empty)
  useEffect(() => {
    if (tasks.length === 0 || hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    checkTasks(tasks);
  }, [tasks]);

  // Re-check every 5 minutes to catch newly overdue tasks as time passes
  useEffect(() => {
    if (tasks.length === 0) return;
    const interval = setInterval(() => checkTasks(tasks), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks]);
}
