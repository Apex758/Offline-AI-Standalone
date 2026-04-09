import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api';

export interface TimetableSlot {
  id: string;
  teacher_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  subject: string;
  grade_level: string;
  class_name: string | null;
  notes?: string;
}

interface LookupResult {
  className: string;
  durationMinutes: number;
}

interface TimetableContextValue {
  slots: TimetableSlot[];
  loading: boolean;
  lookupSlot: (gradeLevel: string, subject: string) => LookupResult | null;
  refresh: () => void;
}

const TimetableContext = createContext<TimetableContextValue>({
  slots: [],
  loading: false,
  lookupSlot: () => null,
  refresh: () => {},
});

function getTeacherId(): string {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.username || 'admin';
  } catch {
    return 'admin';
  }
}

function calcDurationMins(start: string, end: string): number {
  try {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    return (eh * 60 + em) - (sh * 60 + sm);
  } catch {
    return 0;
  }
}

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSlots = useCallback(() => {
    const teacherId = getTeacherId();
    setLoading(true);
    axios.get(`${API}/school-year/timetable/${encodeURIComponent(teacherId)}`)
      .then(res => setSlots(res.data?.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const lookupSlot = useCallback((gradeLevel: string, subject: string): LookupResult | null => {
    if (!gradeLevel || !subject) return null;
    const match = slots.find(
      s => s.grade_level === gradeLevel && s.subject === subject
    );
    if (!match) return null;
    return {
      className: match.class_name || '',
      durationMinutes: calcDurationMins(match.start_time, match.end_time),
    };
  }, [slots]);

  return (
    <TimetableContext.Provider value={{ slots, loading, lookupSlot, refresh: fetchSlots }}>
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => useContext(TimetableContext);
