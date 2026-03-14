import React, { useState, useRef, useCallback } from 'react';
import {
  X, Upload, FileText, CheckCircle, XCircle, AlertCircle,
  Award, ChevronDown, ChevronUp, Save, Users, Trash2
} from 'lucide-react';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import axios from 'axios';
import { ParsedQuiz } from '../types/quiz';
import { useSettings } from '../contexts/SettingsContext';

const API_BASE = 'http://localhost:8000';

interface Student {
  id: string;
  full_name: string;
  class_name?: string;
}

interface GradeDetail {
  question_number: number;
  question: string;
  type: string;
  student_answer: string | null;
  correct_answer: any;
  correct: boolean;
  points_earned: number;
  points_possible: number;
}

interface FileGradeResult {
  file_name: string;
  student_name: string | null;
  error: string | null;
  score: number;
  total_points: number;
  percentage: number;
  letter_grade: string;
  details: GradeDetail[];
}

interface BulkGraderProps {
  quiz: ParsedQuiz;
  onClose: () => void;
  embedded?: boolean; // when true, hides the header (QuizGrader provides it)
}

function letterColor(g: string) {
  const m: Record<string, string> = {
    A: 'text-green-600 bg-green-50 border-green-200',
    B: 'text-blue-600 bg-blue-50 border-blue-200',
    C: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    D: 'text-orange-600 bg-orange-50 border-orange-200',
    F: 'text-red-600 bg-red-50 border-red-200',
  };
  return m[g] ?? 'text-gray-600 bg-gray-50 border-gray-200';
}

function fileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return '📄';
  if (ext === 'html' || ext === 'htm') return '🌐';
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext ?? '')) return '🖼️';
  return '📝';
}

const BulkGrader: React.FC<BulkGraderProps> = ({ quiz, onClose, embedded = false }) => {
  const { settings } = useSettings();
  const accentColor = settings.tabColors['quiz-generator'] ?? '#3b82f6';

  const gradeableCount = quiz.questions.filter(q => q.type !== 'open-ended').length;

  const [studentFiles, setStudentFiles] = useState<File[]>([]);
  const [draggingStudents, setDraggingStudents] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<FileGradeResult[] | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // Per-result: selected student for saving
  const [students, setStudents] = useState<Student[]>([]);
  const [saveTargets, setSaveTargets] = useState<Record<number, string>>({});
  const [saveStatuses, setSaveStatuses] = useState<Record<number, 'idle' | 'saving' | 'saved' | 'error'>>({});

  const studentFileInputRef = useRef<HTMLInputElement>(null);

  // Load students on mount
  React.useEffect(() => {
    axios.get(`${API_BASE}/api/students`).then(r => setStudents(r.data)).catch(() => {});
  }, []);

  // ── Drag and Drop ─────────────────────────────────────────────────────────

  const onDrop = useCallback((e: React.DragEvent, target: 'students') => {
    e.preventDefault();
    setDraggingStudents(false);
    const files = Array.from(e.dataTransfer.files);
    if (target === 'students') setStudentFiles(prev => [...prev, ...files]);
  }, []);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); };

  const removeStudentFile = (idx: number) => {
    setStudentFiles(prev => prev.filter((_, i) => i !== idx));
    setResults(null);
  };

  // ── Grading ───────────────────────────────────────────────────────────────

  const handleGradeAll = async () => {
    if (studentFiles.length === 0) return;
    setProcessing(true);
    setResults(null);
    setSaveTargets({});
    setSaveStatuses({});

    try {
      const form = new FormData();
      form.append('quiz_json', JSON.stringify(quiz));
      studentFiles.forEach(f => form.append('student_files', f));

      const response = await axios.post(`${API_BASE}/api/bulk-grade`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResults(response.data);
    } catch (err: any) {
      setResults([{
        file_name: 'Error',
        student_name: null,
        error: err?.response?.data?.detail ?? 'Server error during bulk grading.',
        score: 0, total_points: 0, percentage: 0, letter_grade: 'F', details: [],
      }]);
    } finally {
      setProcessing(false);
    }
  };

  const handleSave = async (resultIdx: number, result: FileGradeResult) => {
    const studentId = saveTargets[resultIdx];
    if (!studentId) return;
    setSaveStatuses(prev => ({ ...prev, [resultIdx]: 'saving' }));

    try {
      const answerMap: Record<string, any> = {};
      result.details.forEach(d => {
        answerMap[d.question_number] = {
          question: d.question,
          studentAnswer: d.student_answer,
          correct: d.correct,
          pointsEarned: d.points_earned,
        };
      });
      await axios.post(`${API_BASE}/api/quiz-grades`, {
        student_id: studentId,
        quiz_title: quiz.metadata.title,
        subject: quiz.metadata.subject,
        score: result.score,
        total_points: result.total_points,
        percentage: result.percentage,
        letter_grade: result.letter_grade,
        answers: answerMap,
      });
      setSaveStatuses(prev => ({ ...prev, [resultIdx]: 'saved' }));
    } catch {
      setSaveStatuses(prev => ({ ...prev, [resultIdx]: 'error' }));
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={`flex flex-col ${embedded ? 'h-full' : 'h-full bg-theme-surface'}`}>
      {/* Header — only shown when not embedded */}
      {!embedded && (
        <div className="border-b border-theme px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-theme-heading">Bulk Auto-Grade</h2>
            <p className="text-sm text-theme-hint">
              {quiz.metadata.subject} · {quiz.metadata.title} · {gradeableCount} gradeable question{gradeableCount !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-theme-hover transition text-theme-muted">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Quiz info banner */}
        <div className="rounded-xl p-4 flex items-center gap-3 border" style={{ borderColor: `${accentColor}33`, backgroundColor: `${accentColor}08` }}>
          <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }} />
          <div>
            <p className="text-sm font-medium text-theme-label">Answer key loaded from current quiz</p>
            <p className="text-xs text-theme-muted">{quiz.questions.length} total questions · {gradeableCount} auto-gradeable · {quiz.questions.length - gradeableCount} open-ended (skipped)</p>
          </div>
        </div>

        {/* Student files drop zone */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-theme-label">Student Quiz Files</h3>
            <span className="text-xs text-theme-muted">HTML, PDF, or TXT</span>
          </div>

          <div
            onDrop={e => onDrop(e, 'students')}
            onDragOver={onDragOver}
            onDragEnter={() => setDraggingStudents(true)}
            onDragLeave={() => setDraggingStudents(false)}
            onClick={() => studentFileInputRef.current?.click()}
            className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
              draggingStudents ? 'border-current bg-opacity-10' : 'border-theme hover:border-current hover:bg-opacity-5'
            }`}
            style={draggingStudents ? { borderColor: accentColor, backgroundColor: `${accentColor}10` } : {}}
          >
            <Upload className="w-8 h-8 mx-auto mb-3 text-theme-muted" />
            <p className="text-sm font-medium text-theme-label">Drop student quiz files here</p>
            <p className="text-xs text-theme-muted mt-1">or click to browse · multiple files supported</p>
            <input
              ref={studentFileInputRef}
              type="file"
              multiple
              accept=".html,.htm,.pdf,.txt,.md"
              className="hidden"
              onChange={e => {
                const files = Array.from(e.target.files ?? []);
                setStudentFiles(prev => [...prev, ...files]);
                setResults(null);
                e.target.value = '';
              }}
            />
          </div>

          {/* File list */}
          {studentFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {studentFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-theme-subtle border border-theme">
                  <span className="text-lg">{fileIcon(f.name)}</span>
                  <span className="flex-1 text-sm text-theme-label truncate">{f.name}</span>
                  <span className="text-xs text-theme-muted flex-shrink-0">{(f.size / 1024).toFixed(1)} KB</span>
                  <button
                    onClick={() => removeStudentFile(i)}
                    className="p-1 rounded hover:bg-theme-hover transition text-theme-muted hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grade button */}
        <button
          onClick={handleGradeAll}
          disabled={studentFiles.length === 0 || processing}
          className="w-full py-3 rounded-xl text-white font-semibold transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: accentColor }}
        >
          {processing ? (
            <>
              <HeartbeatLoader className="w-5 h-5" />
              Processing {studentFiles.length} file{studentFiles.length !== 1 ? 's' : ''}...
            </>
          ) : (
            <>
              <Award className="w-5 h-5" />
              Grade All {studentFiles.length > 0 ? `(${studentFiles.length} student${studentFiles.length !== 1 ? 's' : ''})` : ''}
            </>
          )}
        </button>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-theme-hint uppercase tracking-wider">Results</h3>
              <div className="text-xs text-theme-muted">
                {results.filter(r => !r.error).length} graded · {results.filter(r => !!r.error).length} failed
              </div>
            </div>

            {/* Summary row */}
            {results.filter(r => !r.error).length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {['A', 'B', 'C', 'D', 'F'].filter(g => results.some(r => r.letter_grade === g && !r.error)).map(grade => {
                  const count = results.filter(r => r.letter_grade === grade && !r.error).length;
                  return (
                    <div key={grade} className={`rounded-xl border p-3 text-center ${letterColor(grade)}`}>
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-xs font-medium">Grade {grade}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Per-file result rows */}
            <div className="space-y-3">
              {results.map((result, idx) => (
                <div key={idx} className={`rounded-xl border overflow-hidden ${result.error ? 'border-red-200' : 'border-theme'}`}>
                  {/* Row header */}
                  <div
                    className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-theme-hover transition ${result.error ? 'bg-red-50' : 'bg-theme-card'}`}
                    onClick={() => !result.error && setExpandedRow(expandedRow === idx ? null : idx)}
                  >
                    <span className="text-xl">{fileIcon(result.file_name)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-theme-label truncate">
                        {result.student_name ?? result.file_name.replace(/\.[^.]+$/, '')}
                      </p>
                      {result.student_name && (
                        <p className="text-xs text-theme-muted truncate">{result.file_name}</p>
                      )}
                    </div>

                    {result.error ? (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {result.error}
                      </div>
                    ) : (
                      <>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-theme-label">{result.score}/{result.total_points} pts</p>
                          <p className="text-xs text-theme-muted">{result.percentage}%</p>
                        </div>
                        <span className={`text-xl font-bold px-3 py-1 rounded-lg border flex-shrink-0 ${letterColor(result.letter_grade)}`}>
                          {result.letter_grade}
                        </span>

                        {/* Save to profile */}
                        <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                          <select
                            value={saveTargets[idx] ?? ''}
                            onChange={e => setSaveTargets(prev => ({ ...prev, [idx]: e.target.value }))}
                            className="text-xs px-2 py-1.5 rounded-lg border border-theme bg-theme-input text-theme-label focus:outline-none w-36"
                          >
                            <option value="">Select student...</option>
                            {students.map(s => (
                              <option key={s.id} value={s.id}>{s.full_name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleSave(idx, result)}
                            disabled={!saveTargets[idx] || saveStatuses[idx] === 'saving' || saveStatuses[idx] === 'saved'}
                            className={`p-1.5 rounded-lg text-white text-xs transition flex items-center gap-1 disabled:opacity-50 ${
                              saveStatuses[idx] === 'saved' ? 'bg-green-600' : saveStatuses[idx] === 'error' ? 'bg-red-500' : ''
                            }`}
                            style={!saveStatuses[idx] || saveStatuses[idx] === 'idle' ? { backgroundColor: accentColor } : {}}
                            title="Save to student profile"
                          >
                            <Save className="w-3.5 h-3.5" />
                            {saveStatuses[idx] === 'saving' ? '...' : saveStatuses[idx] === 'saved' ? '✓' : saveStatuses[idx] === 'error' ? '!' : ''}
                          </button>
                        </div>

                        {expandedRow === idx
                          ? <ChevronUp className="w-4 h-4 text-theme-muted flex-shrink-0" />
                          : <ChevronDown className="w-4 h-4 text-theme-muted flex-shrink-0" />
                        }
                      </>
                    )}
                  </div>

                  {/* Expanded details */}
                  {expandedRow === idx && !result.error && result.details.length > 0 && (
                    <div className="border-t border-theme divide-y divide-theme">
                      {result.details.map((d, di) => {
                        const correctLabel =
                          d.type === 'multiple-choice'
                            ? `${String.fromCharCode(65 + Number(d.correct_answer))}`
                            : String(d.correct_answer ?? '');
                        const studentLabel =
                          d.student_answer === null ? 'No answer'
                          : d.type === 'multiple-choice'
                          ? String.fromCharCode(65 + (typeof d.student_answer === 'string' ? d.student_answer.toUpperCase().charCodeAt(0) - 65 : 0))
                          : String(d.student_answer);

                        return (
                          <div key={di} className={`px-5 py-3 flex items-center gap-4 text-sm ${d.correct ? 'bg-green-50' : 'bg-red-50'}`}>
                            {d.correct
                              ? <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                              : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            }
                            <span className="text-xs text-theme-muted w-6 flex-shrink-0">Q{d.question_number}</span>
                            <span className="flex-1 text-theme-label truncate">{d.question}</span>
                            <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${d.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {studentLabel}
                            </span>
                            {!d.correct && (
                              <span className="text-xs px-2 py-0.5 rounded font-medium bg-green-100 text-green-700 flex-shrink-0">
                                ✓ {correctLabel}
                              </span>
                            )}
                            <span className="text-xs text-theme-muted flex-shrink-0">{d.points_earned}/{d.points_possible}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkGrader;
