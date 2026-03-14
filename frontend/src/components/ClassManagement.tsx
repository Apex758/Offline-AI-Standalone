import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Users, Plus, Trash2, Edit, ChevronLeft, Search, X, Save,
  Award, BookOpen, Calendar, Phone, User, GraduationCap, AlertCircle,
  Upload, Download, FileSpreadsheet, CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { useSettings } from '../contexts/SettingsContext';

const API_BASE = 'http://localhost:8000';

interface Student {
  id: string;
  full_name: string;
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
  full_name: string;
  date_of_birth: string;
  class_name: string;
  grade_level: string;
  gender: string;
  contact_info: string;
}

const EMPTY_FORM: StudentFormData = {
  full_name: '',
  date_of_birth: '',
  class_name: '',
  grade_level: '',
  gender: '',
  contact_info: '',
};

const GRADE_LEVELS = ['K', '1', '2', '3', '4', '5', '6'];
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

function letterGradeBadge(grade: string) {
  const map: Record<string, string> = {
    A: 'bg-green-100 text-green-700',
    B: 'bg-blue-100 text-blue-700',
    C: 'bg-yellow-100 text-yellow-700',
    D: 'bg-orange-100 text-orange-700',
    F: 'bg-red-100 text-red-700',
  };
  return map[grade] ?? 'bg-gray-100 text-gray-600';
}

interface ClassManagementProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

const ClassManagement: React.FC<ClassManagementProps> = ({ tabId, savedData, onDataChange }) => {
  const { settings } = useSettings();
  const accentColor = settings.tabColors['quiz-generator'] ?? '#3b82f6';

  const [view, setView] = useState<'roster' | 'profile' | 'add'>('roster');
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state (add / edit)
  const [form, setForm] = useState<StudentFormData>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Import state
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ created: number; updated: number; skipped: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // ── Data fetching ─────────────────────────────────────────────────────────

  const fetchClasses = async () => {
    try {
      const r = await axios.get(`${API_BASE}/api/classes`);
      setClasses(r.data);
    } catch {
      setClasses([]);
    }
  };

  const fetchStudents = async (className?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = className ? { class_name: className } : {};
      const r = await axios.get(`${API_BASE}/api/students`, { params });
      setStudents(r.data);
    } catch {
      setError('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudent = async (id: string) => {
    setLoading(true);
    try {
      const r = await axios.get(`${API_BASE}/api/students/${id}`);
      setActiveStudent(r.data);
    } catch {
      setError('Failed to load student profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleClassChange = (cls: string) => {
    setSelectedClass(cls);
    fetchStudents(cls || undefined);
  };

  const openProfile = (student: Student) => {
    fetchStudent(student.id);
    setView('profile');
  };

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, class_name: selectedClass });
    setEditingId(null);
    setView('add');
  };

  const openEdit = (student: Student) => {
    setForm({
      full_name: student.full_name ?? '',
      date_of_birth: student.date_of_birth ?? '',
      class_name: student.class_name ?? '',
      grade_level: student.grade_level ?? '',
      gender: student.gender ?? '',
      contact_info: student.contact_info ?? '',
    });
    setEditingId(student.id);
    setView('add');
  };

  const handleSave = async () => {
    if (!form.full_name.trim()) return;
    setFormSaving(true);
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/api/students/${editingId}`, form);
      } else {
        await axios.post(`${API_BASE}/api/students`, form);
      }
      await fetchClasses();
      await fetchStudents(selectedClass || undefined);
      setView('roster');
    } catch {
      setError('Failed to save student.');
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/api/students/${id}`);
      await fetchClasses();
      await fetchStudents(selectedClass || undefined);
      if (view === 'profile') setView('roster');
      setConfirmDelete(null);
    } catch {
      setError('Failed to delete student.');
    }
  };

  // ── Import handlers ──────────────────────────────────────────────────────

  const handleImportFile = useCallback(async (file: File) => {
    const ext = file.name.toLowerCase().split('.').pop();
    if (!['xlsx', 'xls', 'csv'].includes(ext || '')) {
      setError('Please upload an Excel (.xlsx, .xls) or CSV file.');
      return;
    }
    setImporting(true);
    setError(null);
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const r = await axios.post(`${API_BASE}/api/students/import-excel`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImportResult(r.data);
      await fetchClasses();
      await fetchStudents(selectedClass || undefined);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to import file.');
    } finally {
      setImporting(false);
    }
  }, [selectedClass]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    dragCounter.current = 0;
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImportFile(files[0]);
    }
  }, [handleImportFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImportFile(files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [handleImportFile]);

  const downloadSample = useCallback(async () => {
    try {
      const r = await axios.get(`${API_BASE}/api/students/sample-excel`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample_class_list.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Failed to download sample file.');
    }
  }, []);

  const filteredStudents = students.filter(s =>
    s.full_name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Render ────────────────────────────────────────────────────────────────

  const renderRoster = () => (
    <div
      className="flex flex-col h-full relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="border-b border-theme px-6 py-4 flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" style={{ color: accentColor }} />
          <h2 className="text-xl font-semibold text-theme-heading">Class Management</h2>
        </div>
        <div className="flex-1" />

        {/* Class filter */}
        <select
          value={selectedClass}
          onChange={e => handleClassChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-theme bg-theme-input text-theme-label text-sm focus:outline-none"
        >
          <option value="">All Classes</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-theme-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 rounded-lg border border-theme bg-theme-input text-theme-label text-sm focus:outline-none w-48"
          />
        </div>

        {/* Download sample */}
        <button
          onClick={downloadSample}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-theme text-theme-label hover:bg-theme-hover transition text-sm"
          title="Download sample Excel template"
        >
          <Download className="w-4 h-4" />
          Sample
        </button>

        {/* Import button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-theme text-theme-label hover:bg-theme-hover transition text-sm"
          title="Import class list from Excel or CSV"
        >
          <Upload className="w-4 h-4" />
          Import
        </button>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition hover:opacity-90"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Import result banner */}
      {importResult && (
        <div className="mx-6 mt-4 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            Import complete: <strong>{importResult.created}</strong> added, <strong>{importResult.updated}</strong> updated
            {importResult.skipped > 0 && <>, <strong>{importResult.skipped}</strong> skipped</>}
          </span>
          <button onClick={() => setImportResult(null)} className="ml-auto text-green-500 hover:text-green-700"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Drag-and-drop overlay */}
      {dragging && (
        <div className="absolute inset-0 z-40 bg-blue-50/90 dark:bg-blue-900/80 border-4 border-dashed rounded-xl flex flex-col items-center justify-center pointer-events-none"
          style={{ borderColor: accentColor }}
        >
          <FileSpreadsheet className="w-16 h-16 mb-4" style={{ color: accentColor }} />
          <p className="text-xl font-semibold" style={{ color: accentColor }}>Drop Excel or CSV file here</p>
          <p className="text-sm text-theme-muted mt-2">Supported: .xlsx, .xls, .csv</p>
        </div>
      )}

      {/* Importing spinner */}
      {importing && (
        <div className="mx-6 mt-4 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Importing students...
        </div>
      )}

      {/* Student grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-theme-muted text-sm">Loading...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 text-theme-muted gap-3">
            {students.length === 0 ? (
              <>
                <div
                  className="w-full max-w-md border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-400 transition-colors"
                  style={{ borderColor: `${accentColor}66` }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileSpreadsheet className="w-12 h-12 opacity-50" style={{ color: accentColor }} />
                  <p className="text-sm font-medium text-theme-label">Drag & drop an Excel or CSV file here</p>
                  <p className="text-xs text-theme-muted">or click to browse</p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={downloadSample} className="flex items-center gap-1.5 text-xs hover:underline" style={{ color: accentColor }}>
                    <Download className="w-3.5 h-3.5" />
                    Download sample template
                  </button>
                  <span className="text-xs text-theme-muted">or</span>
                  <button onClick={openAdd} className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: accentColor }}>
                    Add Student Manually
                  </button>
                </div>
              </>
            ) : (
              <>
                <Users className="w-12 h-12 opacity-30" />
                <p className="text-sm">No students match your search.</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStudents.map(student => (
              <div
                key={student.id}
                className="rounded-xl border border-theme bg-theme-card hover:shadow-md transition-shadow cursor-pointer group overflow-hidden"
                onClick={() => openProfile(student)}
              >
                <div className="h-2" style={{ backgroundColor: accentColor }} />
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0" style={{ backgroundColor: accentColor }}>
                      {student.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => { e.stopPropagation(); openEdit(student); }}
                        className="p-1.5 rounded-lg hover:bg-theme-hover transition text-theme-muted"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setConfirmDelete(student.id); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="font-semibold text-theme-heading truncate">{student.full_name}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {student.class_name && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-theme-subtle text-theme-muted">{student.class_name}</span>
                      )}
                      {student.grade_level && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-theme-subtle text-theme-muted">Grade {student.grade_level}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary bar */}
      <div className="border-t border-theme px-6 py-3 flex items-center gap-4 text-sm text-theme-muted flex-shrink-0">
        <span>{filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}{selectedClass ? ` in ${selectedClass}` : ''}</span>
        {classes.length > 0 && <span>· {classes.length} class{classes.length !== 1 ? 'es' : ''}</span>}
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-theme-surface rounded-xl border border-theme shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-theme-heading mb-2">Delete Student?</h3>
            <p className="text-sm text-theme-muted mb-6">This will permanently delete the student and all their quiz grades. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 rounded-lg border border-theme text-theme-label hover:bg-theme-hover transition text-sm">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProfile = () => {
    if (!activeStudent) return null;
    const grades = activeStudent.quiz_grades ?? [];
    const avgPct = grades.length > 0 ? Math.round(grades.reduce((s, g) => s + g.percentage, 0) / grades.length) : null;

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-theme px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setView('roster')} className="flex items-center gap-1.5 text-sm text-theme-muted hover:text-theme-label transition">
            <ChevronLeft className="w-4 h-4" />
            Back to Roster
          </button>
          <div className="flex-1" />
          <button onClick={() => openEdit(activeStudent)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-theme text-theme-label hover:bg-theme-hover transition text-sm">
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button onClick={() => setConfirmDelete(activeStudent.id)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition text-sm">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Profile card */}
          <div className="rounded-xl border border-theme overflow-hidden">
            <div className="h-24 relative" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}>
              <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-full border-4 border-white bg-white flex items-center justify-center text-2xl font-bold" style={{ color: accentColor }}>
                {activeStudent.full_name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="pt-12 pb-6 px-6">
              <h2 className="text-2xl font-bold text-theme-heading">{activeStudent.full_name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {activeStudent.class_name && <span className="text-xs px-2 py-1 rounded-full bg-theme-subtle text-theme-muted">{activeStudent.class_name}</span>}
                {activeStudent.grade_level && <span className="text-xs px-2 py-1 rounded-full bg-theme-subtle text-theme-muted">Grade {activeStudent.grade_level}</span>}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {activeStudent.date_of_birth && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-theme-muted mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-theme-muted">Date of Birth</p>
                      <p className="text-sm font-medium text-theme-label">{activeStudent.date_of_birth}</p>
                    </div>
                  </div>
                )}
                {activeStudent.gender && (
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-theme-muted mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-theme-muted">Gender</p>
                      <p className="text-sm font-medium text-theme-label">{activeStudent.gender}</p>
                    </div>
                  </div>
                )}
                {activeStudent.contact_info && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-theme-muted mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-theme-muted">Contact</p>
                      <p className="text-sm font-medium text-theme-label">{activeStudent.contact_info}</p>
                    </div>
                  </div>
                )}
                {avgPct !== null && (
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-theme-muted mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-theme-muted">Quiz Average</p>
                      <p className="text-sm font-bold" style={{ color: accentColor }}>{avgPct}%</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quiz grades */}
          <div>
            <h3 className="text-sm font-semibold text-theme-hint uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Quiz Results ({grades.length})
            </h3>
            {grades.length === 0 ? (
              <div className="rounded-xl border border-theme p-8 text-center text-theme-muted text-sm">
                No quiz results yet. Grade a quiz in the Quiz Generator to see results here.
              </div>
            ) : (
              <div className="space-y-3">
                {grades.map(g => (
                  <div key={g.id} className="rounded-xl border border-theme bg-theme-card p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-theme-label truncate">{g.quiz_title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-theme-muted">
                        <span>{g.subject}</span>
                        <span>·</span>
                        <span>{new Date(g.graded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-theme-label">{g.score}/{g.total_points} pts</p>
                        <p className="text-xs text-theme-muted">{g.percentage}%</p>
                      </div>
                      <span className={`text-lg font-bold px-3 py-1 rounded-lg border ${letterGradeBadge(g.letter_grade)}`}>
                        {g.letter_grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete confirmation */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-theme-surface rounded-xl border border-theme shadow-2xl p-6 max-w-sm w-full">
              <h3 className="font-semibold text-theme-heading mb-2">Delete Student?</h3>
              <p className="text-sm text-theme-muted mb-6">This will permanently delete {activeStudent.full_name} and all their quiz grades.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 rounded-lg border border-theme text-theme-label hover:bg-theme-hover transition text-sm">Cancel</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-medium">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderForm = () => (
    <div className="flex flex-col h-full">
      <div className="border-b border-theme px-6 py-4 flex items-center gap-4 flex-shrink-0">
        <button onClick={() => setView(editingId ? 'profile' : 'roster')} className="flex items-center gap-1.5 text-sm text-theme-muted hover:text-theme-label transition">
          <ChevronLeft className="w-4 h-4" />
          Cancel
        </button>
        <h2 className="text-lg font-semibold text-theme-heading">{editingId ? 'Edit Student' : 'Add Student'}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg mx-auto space-y-5">
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-theme-label mb-1.5">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2"
              placeholder="e.g. Jane Smith"
              style={{ '--tw-ring-color': accentColor } as any}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-label mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={form.date_of_birth}
                onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': accentColor } as any}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-label mb-1.5">Gender</label>
              <select
                value={form.gender}
                onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': accentColor } as any}
              >
                <option value="">Select...</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-label mb-1.5">Class</label>
              <input
                type="text"
                value={form.class_name}
                onChange={e => setForm(f => ({ ...f, class_name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2"
                placeholder="e.g. A, B, C, D"
                list="class-suggestions"
                style={{ '--tw-ring-color': accentColor } as any}
              />
              <datalist id="class-suggestions">
                {classes.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-label mb-1.5">Grade Level</label>
              <select
                value={form.grade_level}
                onChange={e => setForm(f => ({ ...f, grade_level: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': accentColor } as any}
              >
                <option value="">Select...</option>
                {GRADE_LEVELS.map(g => <option key={g} value={g}>{g === 'K' ? 'Kindergarten' : `Grade ${g}`}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-label mb-1.5">Contact Info</label>
            <input
              type="text"
              value={form.contact_info}
              onChange={e => setForm(f => ({ ...f, contact_info: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2"
              placeholder="Parent phone / email"
              style={{ '--tw-ring-color': accentColor } as any}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!form.full_name.trim() || formSaving}
            className="w-full py-3 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: accentColor }}
          >
            <Save className="w-4 h-4" />
            {formSaving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-theme-surface">
      {view === 'roster' && renderRoster()}
      {view === 'profile' && renderProfile()}
      {view === 'add' && renderForm()}
    </div>
  );
};

export default ClassManagement;
