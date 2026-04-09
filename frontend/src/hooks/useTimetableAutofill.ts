import { useState, useEffect, useRef } from 'react';
import { useTimetable } from '../contexts/TimetableContext';
import axios from 'axios';

const API = 'http://localhost:8000/api';

interface AutofillResult {
  studentCount: string;
  duration: string;
  className: string;
  isLoading: boolean;
}

export function useTimetableAutofill(gradeLevel: string, subject: string): AutofillResult {
  const { lookupSlot } = useTimetable();
  const [studentCount, setStudentCount] = useState('');
  const [duration, setDuration] = useState('');
  const [className, setClassName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const prevKeyRef = useRef('');

  useEffect(() => {
    const key = `${gradeLevel}||${subject}`;
    if (key === prevKeyRef.current) return;
    prevKeyRef.current = key;

    if (!gradeLevel || !subject) {
      setStudentCount('');
      setDuration('');
      setClassName('');
      return;
    }

    const result = lookupSlot(gradeLevel, subject);
    if (!result) {
      setStudentCount('');
      setDuration('');
      setClassName('');
      return;
    }

    setDuration(result.durationMinutes > 0 ? String(result.durationMinutes) : '');
    setClassName(result.className);

    // Fetch student count from class roster
    if (result.className) {
      setIsLoading(true);
      axios.get(`${API}/students`, { params: { class_name: result.className } })
        .then(res => {
          const students = Array.isArray(res.data) ? res.data : [];
          setStudentCount(students.length > 0 ? String(students.length) : '');
        })
        .catch(() => setStudentCount(''))
        .finally(() => setIsLoading(false));
    } else {
      setStudentCount('');
    }
  }, [gradeLevel, subject, lookupSlot]);

  return { studentCount, duration, className, isLoading };
}
