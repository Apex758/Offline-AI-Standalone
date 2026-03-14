import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Users, Plus, Trash2, Edit, Search, X, Save,
  ChevronRight, Award, BookOpen, Calendar, Phone,
  User, AlertCircle, Upload, Download, FileSpreadsheet,
  CheckCircle, GraduationCap, BarChart2, ClipboardCheck, Zap
} from 'lucide-react';
import axios from 'axios';
import { useSettings } from '../contexts/SettingsContext';

const API_BASE = 'http://localhost:8000';

interface Student {
  id: string;
  full_name: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  date_of_birth?: string;
  class_name?: string;
  grade_level?: string;
  gender?: string;
  contact_info?: string;
  created_at?: string;
  quiz_grades?: QuizGrade[];
}

interface QuizGrade {
  id: string;
  quiz_title: string;
  subject: string;
  score: number;
  total_points: number;
  percentage: number;
  letter_grade: string;
  graded_at: string;
}

interface StudentFormData {
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  class_name: string;
  grade_level: string;
  gender: string;
  contact_info: string;
}

const EMPTY_FORM: StudentFormData = {
  first_name: '', middle_name: '', last_name: '',
  date_of_birth: '', class_name: '', grade_level: '', gender: '', contact_info: '',
};

const GRADE_LEVELS = ['K', '1', '2', '3', '4', '5', '6'];
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

const ATTENDANCE_STATUSES = ['Present', 'Absent', 'Late', 'Excused'] as const;
type AttendanceStatus = typeof ATTENDANCE_STATUSES[number];
const ENGAGEMENT_LEVELS = ['Highly Engaged', 'Engaged', 'Partially Engaged', 'Disengaged'] as const;
type EngagementLevel = typeof ENGAGEMENT_LEVELS[number];

interface AttendanceRecord {
  student_id: string;
  full_name: string;
  status: AttendanceStatus;
  engagement_level: EngagementLevel;
  notes: string;
}

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  Present: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700',
  Absent: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700',
  Late: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700',
  Excused: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700',
};

const ENGAGEMENT_MAP: Record<EngagementLevel, number> = {
  'Highly Engaged': 4,
  'Engaged': 3,
  'Partially Engaged': 2,
  'Disengaged': 1,
};

type RightView =
  | { type: 'empty' }
  | { type: 'grade'; grade: string }
  | { type: 'class'; grade: string; cls: string }
  | { type: 'student' }
  | { type: 'add' };

function gradeBadgeColor(grade: string) {
  const map: Record<string, string> = {
    A: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    B: 'bg-blue-100 text-blue-700 border-blue-200',
    C: 'bg-amber-100 text-amber-700 border-amber-200',
    D: 'bg-orange-100 text-orange-700 border-orange-200',
    F: 'bg-red-100 text-red-700 border-red-200',
  };
  return map[grade] ?? 'bg-gray-100 text-gray-600 border-gray-200';
}

function gradeLabel(g: string) {
  return g === 'K' ? 'Kindergarten' : `Grade ${g}`;
}

interface ClassManagementProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

const ClassManagement: React.FC<ClassManagementProps> = ({ tabId, savedData, onDataChange }) => {
  const { settings } = useSettings();
  const accentColor = settings.tabColors['quiz-generator'] ?? '#3b82f6';

  const [rightView, setRightView] = useState<RightView>({ type: 'empty' });
  const [students, setStudents] = useState<Student[]>([]);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [search, setSearch] = useState('');
  const [expandedGrades, setExpandedGrades] = useState<Set<string>>(new Set());
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set());

  const [form, setForm] = useState<StudentFormData>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceSaving, setAttendanceSaving] = useState(false);
  const [attendanceDirty, setAttendanceDirty] = useState(false);
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ created: number; updated: number; skipped: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // ── Data ──────────────────────────────────────────────────────────────────

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await axios.get(`${API_BASE}/api/students`);
      setStudents(r.data);
    } catch {
      setError('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudent = async (id: string) => {
    try {
      const r = await axios.get(`${API_BASE}/api/students/${id}`);
      setActiveStudent(r.data);
    } catch {
      setError('Failed to load student profile.');
    }
  };

  const fetchAttendance = async (className: string, date: string, classStudents: Student[]) => {
    setAttendanceLoading(true);
    setAttendanceSaved(false);
    let savedMap: Record<string, any> = {};
    try {
      const r = await axios.get(`${API_BASE}/api/attendance`, { params: { class_name: className, date } });
      for (const rec of r.data) {
        savedMap[rec.student_id] = rec;
      }
    } catch {
      // API may not be available yet — still show defaults
    }
    const records: AttendanceRecord[] = classStudents.map(s => {
      const existing = savedMap[s.id];
      return {
        student_id: s.id,
        full_name: s.full_name,
        status: existing?.status ?? 'Present',
        engagement_level: existing?.engagement_level ?? 'Engaged',
        notes: existing?.notes ?? '',
      };
    });
    setAttendanceRecords(records);
    setAttendanceDirty(false);
    setAttendanceLoading(false);
  };

  const saveAttendance = async (className: string, date: string) => {
    setAttendanceSaving(true);
    try {
      await axios.post(`${API_BASE}/api/attendance`, {
        records: attendanceRecords.map(r => ({
          student_id: r.student_id,
          class_name: className,
          date,
          status: r.status,
          engagement_level: r.engagement_level,
          notes: r.notes,
        })),
      });
      setAttendanceDirty(false);
      setAttendanceSaved(true);
      setTimeout(() => setAttendanceSaved(false), 2000);
    } catch {
      setError('Failed to save attendance.');
    } finally {
      setAttendanceSaving(false);
    }
  };

  const updateAttendanceField = (studentId: string, field: 'status' | 'engagement_level' | 'notes', value: string) => {
    setAttendanceRecords(prev => prev.map(r => r.student_id === studentId ? { ...r, [field]: value } : r));
    setAttendanceDirty(true);
    setAttendanceSaved(false);
  };

  const markAllPresent = () => {
    setAttendanceRecords(prev => prev.map(r => ({ ...r, status: 'Present' as AttendanceStatus })));
    setAttendanceDirty(true);
  };

  useEffect(() => { fetchStudents(); }, []);

  // Load attendance when viewing a class and date changes
  useEffect(() => {
    if (rightView.type === 'class' && students.length > 0) {
      const gradeNode = tree.find(g => g.grade === rightView.grade);
      const classNode = gradeNode?.classes.find(c => c.cls === rightView.cls);
      if (classNode) {
        fetchAttendance(rightView.cls, attendanceDate, classNode.students);
      }
    }
  }, [rightView, attendanceDate, students]);

  // ── Tree structure ────────────────────────────────────────────────────────

  const tree = useMemo(() => {
    const gradeMap = new Map<string, Map<string, Student[]>>();
    for (const s of students) {
      const g = s.grade_level || '—';
      const c = s.class_name || '—';
      if (!gradeMap.has(g)) gradeMap.set(g, new Map());
      if (!gradeMap.get(g)!.has(c)) gradeMap.get(g)!.set(c, []);
      gradeMap.get(g)!.get(c)!.push(s);
    }
    const order = (g: string) => g === 'K' ? -1 : g === '—' ? 999 : Number(g);
    return [...gradeMap.entries()]
      .sort((a, b) => order(a[0]) - order(b[0]))
      .map(([grade, classMap]) => ({
        grade,
        classes: [...classMap.entries()]
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([cls, studs]) => ({
            cls,
            students: studs.sort((a, b) => a.full_name.localeCompare(b.full_name)),
          })),
      }));
  }, [students]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return students.filter(s => s.full_name.toLowerCase().includes(q));
  }, [students, search]);

  // ── Selection helpers ─────────────────────────────────────────────────────

  const isGradeSelected = (g: string) => rightView.type === 'grade' && rightView.grade === g;
  const isClassSelected = (g: string, c: string) =>
    rightView.type === 'class' && rightView.grade === g && rightView.cls === c;
  const isStudentSelected = (id: string) =>
    rightView.type === 'student' && activeStudent?.id === id;

  const selectGrade = (grade: string) => {
    setRightView({ type: 'grade', grade });
    setExpandedGrades(prev => {
      const next = new Set(prev);
      if (next.has(grade)) next.delete(grade); else next.add(grade);
      return next;
    });
  };

  const selectClass = (grade: string, cls: string) => {
    setRightView({ type: 'class', grade, cls });
    setExpandedGrades(prev => new Set([...prev, grade]));
    const key = `${grade}|${cls}`;
    setExpandedClasses(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const selectStudent = (student: Student) => {
    fetchStudent(student.id);
    setRightView({ type: 'student' });
    if (student.grade_level) setExpandedGrades(prev => new Set([...prev, student.grade_level!]));
    if (student.grade_level && student.class_name)
      setExpandedClasses(prev => new Set([...prev, `${student.grade_level}|${student.class_name}`]));
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const openAdd = (grade?: string, cls?: string) => {
    setForm({ ...EMPTY_FORM, grade_level: grade || '', class_name: cls || '' });
    setEditingId(null);
    setRightView({ type: 'add' });
  };

  const openEdit = (student: Student) => {
    // Fall back to splitting full_name if separate fields aren't stored yet
    const parts = (student.full_name ?? '').trim().split(/\s+/);
    setForm({
      first_name: student.first_name ?? parts[0] ?? '',
      middle_name: student.middle_name ?? (parts.length > 2 ? parts.slice(1, -1).join(' ') : ''),
      last_name: student.last_name ?? (parts.length > 1 ? parts[parts.length - 1] : ''),
      date_of_birth: student.date_of_birth ?? '',
      class_name: student.class_name ?? '',
      grade_level: student.grade_level ?? '',
      gender: student.gender ?? '',
      contact_info: student.contact_info ?? '',
    });
    setEditingId(student.id);
    setRightView({ type: 'add' });
  };

  const handleSave = async () => {
    if (!form.first_name.trim()) return;
    setFormSaving(true);
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/api/students/${editingId}`, form);
        await fetchStudent(editingId);
        setRightView({ type: 'student' });
      } else {
        await axios.post(`${API_BASE}/api/students`, form);
        setRightView({ type: 'empty' });
      }
      await fetchStudents();
    } catch {
      setError('Failed to save student.');
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/api/students/${id}`);
      await fetchStudents();
      setActiveStudent(null);
      setRightView({ type: 'empty' });
    } catch {
      setError('Failed to delete student.');
    } finally {
      setConfirmDelete(null);
    }
  };

  // ── Import ────────────────────────────────────────────────────────────────

  const handleImportFile = useCallback(async (file: File) => {
    const ext = file.name.toLowerCase().split('.').pop();
    if (!['xlsx', 'xls', 'csv'].includes(ext || '')) {
      setError('Please upload an Excel (.xlsx, .xls) or CSV file.');
      return;
    }
    setImporting(true); setError(null); setImportResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await axios.post(`${API_BASE}/api/students/import-excel`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImportResult(r.data);
      await fetchStudents();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to import file.');
    } finally {
      setImporting(false);
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragCounter.current++; setDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragging(false);
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragging(false); dragCounter.current = 0;
    if (e.dataTransfer.files.length > 0) handleImportFile(e.dataTransfer.files[0]);
  }, [handleImportFile]);

  const downloadSample = useCallback(async () => {
    try {
      const r = await axios.get(`${API_BASE}/api/students/sample-excel`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement('a'); a.href = url;
      a.download = 'sample_class_list.xlsx'; a.click();
      window.URL.revokeObjectURL(url);
    } catch { setError('Failed to download sample file.'); }
  }, []);

  // ── LEFT SIDEBAR ──────────────────────────────────────────────────────────

  const renderSidebar = () => (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="px-4 py-4 flex-shrink-0" style={{ background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentColor }}>
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm text-theme-heading">Classes</span>
          </div>
          <button
            onClick={() => openAdd()}
            title="Add student"
            className="w-6 h-6 rounded-md flex items-center justify-center text-white transition hover:opacity-80"
            style={{ backgroundColor: accentColor }}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-theme-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-7 pr-7 py-1.5 rounded-lg border border-theme bg-theme-input text-theme-label text-xs focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1.5 text-theme-muted hover:text-theme-label">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tree / Search results */}
      <div className="flex-1 overflow-y-auto py-1">
        {loading ? (
          <div className="px-4 py-6 text-center text-xs text-theme-muted">Loading...</div>
        ) : students.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-20 text-theme-muted" />
            <p className="text-xs text-theme-muted">No students yet</p>
          </div>
        ) : search.trim() ? (
          /* ── Flat search results ── */
          searchResults.length === 0 ? (
            <div className="px-4 py-4 text-xs text-theme-muted text-center">No matches</div>
          ) : (
            searchResults.map(s => (
              <SidebarStudentRow
                key={s.id}
                student={s}
                active={isStudentSelected(s.id)}
                accentColor={accentColor}
                onClick={() => selectStudent(s)}
              />
            ))
          )
        ) : (
          /* ── Hierarchy tree ── */
          tree.map(({ grade, classes }) => {
            const expanded = expandedGrades.has(grade);
            const totalStudents = classes.reduce((n, c) => n + c.students.length, 0);
            const gradeActive = isGradeSelected(grade);
            return (
              <div key={grade}>
                {/* Grade row */}
                <button
                  onClick={() => selectGrade(grade)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left transition group ${
                    gradeActive ? 'bg-theme-subtle' : 'hover:bg-theme-hover'
                  }`}
                >
                  <div
                    className={`w-4 h-4 flex-shrink-0 flex items-center justify-center transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-theme-muted" />
                  </div>
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: gradeActive ? accentColor : `${accentColor}30` }}
                  >
                    <GraduationCap className="w-3 h-3" style={{ color: gradeActive ? 'white' : accentColor }} />
                  </div>
                  <span className={`flex-1 text-xs font-semibold truncate ${gradeActive ? 'text-theme-heading' : 'text-theme-label'}`}>
                    {gradeLabel(grade)}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
                    style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
                    {totalStudents}
                  </span>
                </button>

                {/* Classes */}
                {expanded && classes.map(({ cls, students: classStudents }) => {
                  const clsKey = `${grade}|${cls}`;
                  const clsExpanded = expandedClasses.has(clsKey);
                  const clsActive = isClassSelected(grade, cls);
                  return (
                    <div key={cls}>
                      {/* Class row */}
                      <button
                        onClick={() => selectClass(grade, cls)}
                        className={`w-full flex items-center gap-2 pl-8 pr-3 py-1.5 text-left transition ${
                          clsActive ? 'bg-theme-subtle' : 'hover:bg-theme-hover'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center transition-transform duration-200 ${clsExpanded ? 'rotate-90' : ''}`}>
                          <ChevronRight className="w-3 h-3 text-theme-muted" />
                        </div>
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                          style={{
                            backgroundColor: clsActive ? accentColor : `${accentColor}20`,
                            color: clsActive ? 'white' : accentColor,
                          }}
                        >
                          {cls}
                        </div>
                        <span className={`flex-1 text-xs truncate ${clsActive ? 'text-theme-heading font-medium' : 'text-theme-label'}`}>
                          Class {cls}
                        </span>
                        <span className="text-[10px] text-theme-muted flex-shrink-0">{classStudents.length}</span>
                      </button>

                      {/* Students */}
                      {clsExpanded && classStudents.map(s => (
                        <SidebarStudentRow
                          key={s.id}
                          student={s}
                          active={isStudentSelected(s.id)}
                          accentColor={accentColor}
                          onClick={() => selectStudent(s)}
                          indent
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-theme px-2 py-2 flex gap-1 flex-shrink-0">
        <button onClick={downloadSample} title="Download sample template"
          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-theme-muted hover:text-theme-label hover:bg-theme-hover transition text-[11px]">
          <Download className="w-3 h-3" /> Sample
        </button>
        <button onClick={() => fileInputRef.current?.click()} title="Import from Excel or CSV"
          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-theme-muted hover:text-theme-label hover:bg-theme-hover transition text-[11px]">
          <Upload className="w-3 h-3" /> Import
        </button>
      </div>
    </div>
  );

  // ── RIGHT: EMPTY ──────────────────────────────────────────────────────────

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center h-full gap-5 p-10 text-center">
      {students.length === 0 ? (
        <>
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-2"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <GraduationCap className="w-10 h-10" style={{ color: accentColor }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-theme-heading mb-1">No students yet</h3>
            <p className="text-sm text-theme-muted max-w-xs">Import a class list or add students manually to get started.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              <Upload className="w-4 h-4" /> Import Class List
            </button>
            <button
              onClick={() => openAdd()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-theme text-theme-label hover:bg-theme-hover transition text-sm"
            >
              <Plus className="w-4 h-4" /> Add Manually
            </button>
          </div>
          <button onClick={downloadSample} className="flex items-center gap-1.5 text-xs hover:underline" style={{ color: accentColor }}>
            <Download className="w-3.5 h-3.5" /> Download sample template
          </button>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}15` }}>
            <Users className="w-8 h-8 opacity-40" style={{ color: accentColor }} />
          </div>
          <p className="text-sm text-theme-muted">Select a grade, class, or student on the left</p>
        </>
      )}
    </div>
  );

  // ── RIGHT: GRADE VIEW ─────────────────────────────────────────────────────

  const renderGradeView = (grade: string) => {
    const gradeNode = tree.find(g => g.grade === grade);
    if (!gradeNode) return null;
    const allStudents = gradeNode.classes.flatMap(c => c.students);
    const male = allStudents.filter(s => s.gender === 'Male').length;
    const female = allStudents.filter(s => s.gender === 'Female').length;

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Hero */}
        <div
          className="flex-shrink-0 px-8 py-8 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}
        >
          <div className="absolute right-6 top-4 opacity-10">
            <GraduationCap className="w-24 h-24 text-white" />
          </div>
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-1">Overview</p>
          <h1 className="text-3xl font-bold text-white mb-1">{gradeLabel(grade)}</h1>
          <p className="text-white/70 text-sm">
            {allStudents.length} student{allStudents.length !== 1 ? 's' : ''} · {gradeNode.classes.length} class{gradeNode.classes.length !== 1 ? 'es' : ''}
          </p>
          <button
            onClick={() => openAdd(grade)}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition backdrop-blur-sm"
          >
            <Plus className="w-4 h-4" /> Add Student to {gradeLabel(grade)}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon={<Users className="w-5 h-5" />} label="Total Students" value={allStudents.length} color={accentColor} />
            <StatCard icon={<BookOpen className="w-5 h-5" />} label="Classes" value={gradeNode.classes.length} color={accentColor} />
            <StatCard
              icon={<BarChart2 className="w-5 h-5" />}
              label="Gender Split"
              value={`${male}M / ${female}F`}
              color={accentColor}
              small
            />
          </div>

          {/* Classes */}
          <div>
            <h2 className="text-sm font-semibold text-theme-hint uppercase tracking-wider mb-3">Classes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {gradeNode.classes.map(({ cls, students: cs }) => (
                <button
                  key={cls}
                  onClick={() => selectClass(grade, cls)}
                  className="rounded-xl p-4 text-left widget-glass hover:shadow-md transition-all group"
                  style={{ '--tw-border-opacity': 1 } as any}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold mb-3 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                  >
                    {cls}
                  </div>
                  <p className="font-semibold text-theme-heading text-sm">Class {cls}</p>
                  <p className="text-xs text-theme-muted mt-0.5">{cs.length} student{cs.length !== 1 ? 's' : ''}</p>
                </button>
              ))}
              <button
                onClick={() => openAdd(grade)}
                className="rounded-xl border-2 border-dashed border-theme p-4 text-center hover:border-current transition-colors flex flex-col items-center justify-center gap-2 group"
                style={{ '--tw-border-opacity': 0.5 } as any}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accentColor}12` }}>
                  <Plus className="w-4 h-4" style={{ color: accentColor }} />
                </div>
                <p className="text-xs text-theme-muted group-hover:text-theme-label transition">Add student</p>
              </button>
            </div>
          </div>

          {/* All students in grade */}
          <div>
            <h2 className="text-sm font-semibold text-theme-hint uppercase tracking-wider mb-3">
              All Students ({allStudents.length})
            </h2>
            <div className="space-y-1.5">
              {allStudents.map(s => (
                <StudentRow key={s.id} student={s} accentColor={accentColor}
                  onClick={() => selectStudent(s)}
                  onEdit={() => openEdit(s)}
                  onDelete={() => setConfirmDelete(s.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── RIGHT: CLASS VIEW ─────────────────────────────────────────────────────

  const renderClassView = (grade: string, cls: string) => {
    const gradeNode = tree.find(g => g.grade === grade);
    const classNode = gradeNode?.classes.find(c => c.cls === cls);
    if (!classNode) return null;
    const { students: cs } = classNode;
    const male = cs.filter(s => s.gender === 'Male').length;
    const female = cs.filter(s => s.gender === 'Female').length;

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Hero */}
        <div
          className="flex-shrink-0 px-8 py-8 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${accentColor}ee, ${accentColor}88)` }}
        >
          <div className="absolute right-4 top-3 opacity-10 text-white font-black text-[7rem] leading-none select-none">
            {cls}
          </div>
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-1">
            {gradeLabel(grade)}
          </p>
          <h1 className="text-3xl font-bold text-white mb-1">Class {cls}</h1>
          <p className="text-white/70 text-sm">
            {cs.length} student{cs.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => openAdd(grade, cls)}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition"
          >
            <Plus className="w-4 h-4" /> Add Student to Class {cls}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon={<Users className="w-5 h-5" />} label="Students" value={cs.length} color={accentColor} />
            <StatCard icon={<User className="w-5 h-5" />} label="Male" value={male} color={accentColor} />
            <StatCard icon={<User className="w-5 h-5" />} label="Female" value={female} color={accentColor} />
          </div>

          {/* Attendance & Engagement */}
          {cs.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-theme-hint uppercase tracking-wider mb-3 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" /> Attendance & Engagement
              </h2>

              {/* Controls */}
              <div className="rounded-xl p-4 widget-glass mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-theme-muted" />
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={e => setAttendanceDate(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-theme-strong bg-theme-surface text-theme-label text-sm focus:outline-none focus:ring-2"
                      style={{ '--tw-ring-color': accentColor } as any}
                    />
                  </div>
                  <button
                    onClick={markAllPresent}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition hover:opacity-90 text-white"
                    style={{ backgroundColor: '#10b981' }}
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Mark All Present
                  </button>
                  <div className="flex-1" />
                  {attendanceSaved && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Saved
                    </span>
                  )}
                  <button
                    onClick={() => saveAttendance(cls, attendanceDate)}
                    disabled={!attendanceDirty || attendanceSaving}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: accentColor }}
                  >
                    {attendanceSaving ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    {attendanceSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Summary Stats */}
              {(() => {
                const present = attendanceRecords.filter(r => r.status === 'Present').length;
                const absent = attendanceRecords.filter(r => r.status === 'Absent').length;
                const late = attendanceRecords.filter(r => r.status === 'Late').length;
                const avgEng = attendanceRecords.length > 0
                  ? (attendanceRecords.reduce((sum, r) => sum + ENGAGEMENT_MAP[r.engagement_level], 0) / attendanceRecords.length).toFixed(1)
                  : '—';
                const engLabel = Number(avgEng) >= 3.5 ? 'High' : Number(avgEng) >= 2.5 ? 'Moderate' : Number(avgEng) >= 1.5 ? 'Low' : typeof avgEng === 'string' ? '—' : 'Very Low';

                return (
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="rounded-xl p-3 widget-glass text-center">
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{present}</p>
                      <p className="text-[11px] text-theme-muted">Present</p>
                    </div>
                    <div className="rounded-xl p-3 widget-glass text-center">
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">{absent}</p>
                      <p className="text-[11px] text-theme-muted">Absent</p>
                    </div>
                    <div className="rounded-xl p-3 widget-glass text-center">
                      <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{late}</p>
                      <p className="text-[11px] text-theme-muted">Late</p>
                    </div>
                    <div className="rounded-xl p-3 widget-glass text-center">
                      <p className="text-lg font-bold" style={{ color: accentColor }}>{avgEng}</p>
                      <p className="text-[11px] text-theme-muted">Avg Engagement ({engLabel})</p>
                    </div>
                  </div>
                );
              })()}

              {/* Attendance Table */}
              {attendanceLoading ? (
                <div className="text-center py-8 text-theme-muted text-sm">Loading attendance...</div>
              ) : (
                <div className="space-y-1.5">
                  {attendanceRecords.map(rec => (
                    <div
                      key={rec.student_id}
                      className="rounded-xl px-4 py-3 flex items-center gap-4 widget-glass"
                    >
                      {/* Avatar */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: accentColor }}
                      >
                        {rec.full_name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name */}
                      <span className="text-sm font-semibold text-theme-heading flex-shrink-0 w-36 truncate" title={rec.full_name}>
                        {rec.full_name}
                      </span>

                      {/* Status buttons */}
                      <div className="flex gap-1">
                        {ATTENDANCE_STATUSES.map(st => (
                          <button
                            key={st}
                            onClick={() => updateAttendanceField(rec.student_id, 'status', st)}
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                              rec.status === st
                                ? STATUS_COLORS[st]
                                : 'border-transparent text-theme-hint hover:bg-theme-hover'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      {/* Engagement dropdown */}
                      <div className="flex items-center gap-1.5 ml-auto">
                        <Zap className="w-3.5 h-3.5 text-theme-muted flex-shrink-0" />
                        <select
                          value={rec.engagement_level}
                          onChange={e => updateAttendanceField(rec.student_id, 'engagement_level', e.target.value)}
                          className="px-2 py-1 rounded-lg border border-theme-strong bg-theme-surface text-theme-label text-xs focus:outline-none focus:ring-1"
                          style={{ '--tw-ring-color': accentColor } as any}
                        >
                          {ENGAGEMENT_LEVELS.map(lvl => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Student list */}
          <div>
            <h2 className="text-sm font-semibold text-theme-hint uppercase tracking-wider mb-3">
              Students
            </h2>
            {cs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-theme p-8 text-center text-theme-muted text-sm">
                No students in this class yet.
              </div>
            ) : (
              <div className="space-y-1.5">
                {cs.map(s => (
                  <StudentRow key={s.id} student={s} accentColor={accentColor}
                    onClick={() => selectStudent(s)}
                    onEdit={() => openEdit(s)}
                    onDelete={() => setConfirmDelete(s.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── RIGHT: STUDENT PROFILE ────────────────────────────────────────────────

  const renderStudentView = () => {
    if (!activeStudent) return (
      <div className="flex items-center justify-center h-full text-theme-muted text-sm">Loading...</div>
    );
    const grades = activeStudent.quiz_grades ?? [];
    const avgPct = grades.length > 0
      ? Math.round(grades.reduce((s, g) => s + g.percentage, 0) / grades.length) : null;

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Hero */}
        <div
          className="flex-shrink-0 px-8 py-6 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)` }}
        >
          <div className="absolute right-4 -bottom-4 opacity-10 pointer-events-none">
            <User className="w-28 h-28 text-white" />
          </div>
          <div className="flex items-end gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30 flex-shrink-0">
              {activeStudent.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <h1 className="text-2xl font-bold text-white truncate">{activeStudent.full_name}</h1>
              <p className="text-white/60 text-xs font-mono mt-0.5">ID: {activeStudent.id}</p>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {activeStudent.class_name && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white/90">Class {activeStudent.class_name}</span>
                )}
                {activeStudent.grade_level && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white/90">{gradeLabel(activeStudent.grade_level)}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 pb-1">
              <button onClick={() => openEdit(activeStudent)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm transition">
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => setConfirmDelete(activeStudent.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-white text-sm transition">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Name breakdown */}
          {(activeStudent.first_name || activeStudent.last_name) && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'First Name', value: activeStudent.first_name },
                { label: 'Middle Name', value: activeStudent.middle_name || '—' },
                { label: 'Last Name', value: activeStudent.last_name },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl px-4 py-3 widget-glass">
                  <p className="text-[11px] text-theme-muted uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-theme-label mt-0.5">{value || '—'}</p>
                </div>
              ))}
            </div>
          )}

          {/* Info cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeStudent.date_of_birth && (
              <div className="rounded-xl p-4 flex items-start gap-3 widget-glass">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accentColor}15` }}>
                  <Calendar className="w-4 h-4" style={{ color: accentColor }} />
                </div>
                <div>
                  <p className="text-[11px] text-theme-muted uppercase tracking-wide">Date of Birth</p>
                  <p className="text-sm font-semibold text-theme-label mt-0.5">{activeStudent.date_of_birth}</p>
                </div>
              </div>
            )}
            {activeStudent.gender && (
              <div className="rounded-xl p-4 flex items-start gap-3 widget-glass">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accentColor}15` }}>
                  <User className="w-4 h-4" style={{ color: accentColor }} />
                </div>
                <div>
                  <p className="text-[11px] text-theme-muted uppercase tracking-wide">Gender</p>
                  <p className="text-sm font-semibold text-theme-label mt-0.5">{activeStudent.gender}</p>
                </div>
              </div>
            )}
            {activeStudent.contact_info && (
              <div className="rounded-xl p-4 flex items-start gap-3 widget-glass">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accentColor}15` }}>
                  <Phone className="w-4 h-4" style={{ color: accentColor }} />
                </div>
                <div>
                  <p className="text-[11px] text-theme-muted uppercase tracking-wide">Contact</p>
                  <p className="text-sm font-semibold text-theme-label mt-0.5 break-all">{activeStudent.contact_info}</p>
                </div>
              </div>
            )}
            {avgPct !== null && (
              <div className="rounded-xl p-4 flex items-start gap-3 widget-glass">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accentColor}15` }}>
                  <Award className="w-4 h-4" style={{ color: accentColor }} />
                </div>
                <div>
                  <p className="text-[11px] text-theme-muted uppercase tracking-wide">Quiz Avg</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: accentColor }}>{avgPct}%</p>
                </div>
              </div>
            )}
          </div>

          {/* Quiz results */}
          <div>
            <h2 className="text-sm font-semibold text-theme-hint uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Quiz Results ({grades.length})
            </h2>
            {grades.length === 0 ? (
              <div className="rounded-xl border border-dashed border-theme p-8 text-center text-sm text-theme-muted">
                No quiz results yet. Grade a quiz in the Quiz Generator to see results here.
              </div>
            ) : (
              <div className="space-y-2">
                {grades.map(g => (
                  <div key={g.id} className="rounded-xl px-4 py-3 flex items-center gap-4 widget-glass">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-theme-label text-sm truncate">{g.quiz_title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-theme-muted">
                        <span>{g.subject}</span>
                        <span>·</span>
                        <span>{new Date(g.graded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-theme-label">{g.score}/{g.total_points}</p>
                        <p className="text-xs text-theme-muted">{g.percentage}%</p>
                      </div>
                      <span className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold border ${gradeBadgeColor(g.letter_grade)}`}>
                        {g.letter_grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    );
  };

  // ── RIGHT: ADD / EDIT FORM ────────────────────────────────────────────────

  const renderForm = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="border-b border-theme px-6 py-4 flex items-center gap-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-theme-heading">{editingId ? 'Edit Student' : 'Add Student'}</h2>
        <div className="flex-1" />
        <button
          onClick={() => setRightView(editingId ? { type: 'student' } : { type: 'empty' })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-label hover:bg-theme-hover transition text-sm"
        >
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg mx-auto space-y-5">
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-theme-label mb-1.5">First Name <span className="text-red-500">*</span></label>
              <input type="text" value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2"
                placeholder="e.g. Jane"
                style={{ '--tw-ring-color': accentColor } as any} />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-label mb-1.5">Middle Name</label>
              <input type="text" value={form.middle_name}
                onChange={e => setForm(f => ({ ...f, middle_name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2"
                placeholder="e.g. Marie"
                style={{ '--tw-ring-color': accentColor } as any} />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-label mb-1.5">Last Name</label>
              <input type="text" value={form.last_name}
                onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2"
                placeholder="e.g. Smith"
                style={{ '--tw-ring-color': accentColor } as any} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-label mb-1.5">Date of Birth</label>
              <input type="date" value={form.date_of_birth}
                onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': accentColor } as any} />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-label mb-1.5">Gender</label>
              <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': accentColor } as any}>
                <option value="">Select...</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-label mb-1.5">Grade Level</label>
              <select value={form.grade_level} onChange={e => setForm(f => ({ ...f, grade_level: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': accentColor } as any}>
                <option value="">Select...</option>
                {GRADE_LEVELS.map(g => <option key={g} value={g}>{g === 'K' ? 'Kindergarten' : `Grade ${g}`}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-label mb-1.5">Class</label>
              <input type="text" value={form.class_name}
                onChange={e => setForm(f => ({ ...f, class_name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2"
                placeholder="e.g. A, B, C, D"
                list="class-suggestions"
                style={{ '--tw-ring-color': accentColor } as any} />
              <datalist id="class-suggestions">
                {[...new Set(students.map(s => s.class_name).filter(Boolean))].map(c => <option key={c} value={c!} />)}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-label mb-1.5">Contact Info</label>
            <input type="text" value={form.contact_info}
              onChange={e => setForm(f => ({ ...f, contact_info: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2"
              placeholder="Parent phone / email"
              style={{ '--tw-ring-color': accentColor } as any} />
          </div>

          <button onClick={handleSave} disabled={!form.first_name.trim() || formSaving}
            className="w-full py-3 rounded-xl text-white font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: accentColor }}>
            <Save className="w-4 h-4" />
            {formSaving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  );

  // ── ROOT ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="h-full bg-theme-surface flex overflow-hidden relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv"
        onChange={e => { if (e.target.files?.[0]) handleImportFile(e.target.files[0]); if (fileInputRef.current) fileInputRef.current.value = ''; }}
        className="hidden" />

      {/* Left sidebar */}
      <div className="w-[22%] min-w-[170px] max-w-[260px] border-r border-theme flex-shrink-0 overflow-hidden">
        {renderSidebar()}
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Banners */}
        {(error || importResult || importing) && (
          <div className="px-6 pt-4 space-y-2 flex-shrink-0">
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4" /></button>
              </div>
            )}
            {importResult && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                Import complete: <strong>{importResult.created}</strong> added, <strong>{importResult.updated}</strong> updated
                {importResult.skipped > 0 && <>, <strong>{importResult.skipped}</strong> skipped</>}
                <button onClick={() => setImportResult(null)} className="ml-auto text-green-500 hover:text-green-700"><X className="w-4 h-4" /></button>
              </div>
            )}
            {importing && (
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Importing students...
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          {rightView.type === 'empty' && renderEmpty()}
          {rightView.type === 'grade' && renderGradeView(rightView.grade)}
          {rightView.type === 'class' && renderClassView(rightView.grade, rightView.cls)}
          {rightView.type === 'student' && renderStudentView()}
          {rightView.type === 'add' && renderForm()}
        </div>
      </div>

      {/* Drag overlay */}
      {dragging && (
        <div className="absolute inset-0 z-40 bg-blue-50/90 border-4 border-dashed rounded-xl flex flex-col items-center justify-center pointer-events-none"
          style={{ borderColor: accentColor }}>
          <FileSpreadsheet className="w-16 h-16 mb-4" style={{ color: accentColor }} />
          <p className="text-xl font-semibold" style={{ color: accentColor }}>Drop Excel or CSV file here</p>
          <p className="text-sm text-theme-muted mt-2">Supported: .xlsx, .xls, .csv</p>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl p-6 max-w-sm w-full widget-glass">
            <h3 className="font-semibold text-theme-heading mb-2">Delete Student?</h3>
            <p className="text-sm text-theme-muted mb-6">
              This will permanently delete{activeStudent ? <> <strong>{activeStudent.full_name}</strong> and</> : null} all their quiz grades. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 rounded-xl border border-theme text-theme-label hover:bg-theme-hover transition text-sm">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete!)} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  small?: boolean;
}> = ({ icon, label, value, color, small }) => (
  <div className="rounded-xl p-4 flex items-center gap-3 widget-glass">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15`, color }}>
      {icon}
    </div>
    <div>
      <p className={`font-bold text-theme-heading ${small ? 'text-lg' : 'text-2xl'}`}>{value}</p>
      <p className="text-xs text-theme-muted">{label}</p>
    </div>
  </div>
);

const StudentRow: React.FC<{
  student: Student;
  accentColor: string;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ student, accentColor, onClick, onEdit, onDelete }) => (
  <div
    className="flex items-center gap-3 px-4 py-3 rounded-xl widget-glass hover:shadow-sm transition-all cursor-pointer group"
    onClick={onClick}
  >
    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
      style={{ backgroundColor: accentColor }}>
      {student.full_name.charAt(0).toUpperCase()}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-theme-heading truncate">{student.full_name}</p>
      <p className="text-xs text-theme-muted truncate">
        {[student.gender, student.date_of_birth].filter(Boolean).join(' · ')}
      </p>
    </div>
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
      <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-theme-hover transition text-theme-muted hover:text-theme-label">
        <Edit className="w-3.5 h-3.5" />
      </button>
      <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 transition text-red-400 hover:text-red-600">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const SidebarStudentRow: React.FC<{
  student: Student;
  active: boolean;
  accentColor: string;
  onClick: () => void;
  indent?: boolean;
}> = ({ student, active, accentColor, onClick, indent }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 py-1.5 text-left transition border-l-2 ${
      indent ? 'pl-12 pr-3' : 'pl-3 pr-3'
    } ${active ? 'bg-theme-subtle border-l-current' : 'border-l-transparent hover:bg-theme-hover'}`}
    style={active ? { borderLeftColor: accentColor } : {}}
  >
    <div
      className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
      style={{ backgroundColor: active ? accentColor : `${accentColor}55` }}
    >
      {student.full_name.charAt(0).toUpperCase()}
    </div>
    <span className={`text-xs truncate ${active ? 'font-medium text-theme-heading' : 'text-theme-label'}`}>
      {student.full_name}
    </span>
  </button>
);

export default ClassManagement;
