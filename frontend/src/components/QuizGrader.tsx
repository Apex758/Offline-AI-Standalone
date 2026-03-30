import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import CheckmarkCircle01IconData from '@hugeicons/core-free-icons/CheckmarkCircle01Icon';
import CancelCircleIconData from '@hugeicons/core-free-icons/CancelCircleIcon';
import Award01IconData from '@hugeicons/core-free-icons/Award01Icon';
import ReloadIconData from '@hugeicons/core-free-icons/ReloadIcon';
import SaveIconData from '@hugeicons/core-free-icons/SaveIcon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import UserIconData from '@hugeicons/core-free-icons/UserIcon';
import Upload01IconData from '@hugeicons/core-free-icons/Upload01Icon';
import Loading03IconData from '@hugeicons/core-free-icons/Loading03Icon';
import CheckListIconData from '@hugeicons/core-free-icons/CheckListIcon';
import UserGroupIconData from '@hugeicons/core-free-icons/UserGroupIcon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import { ParsedQuiz, QuizQuestion } from '../types/quiz';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
const CheckCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CheckmarkCircle01IconData} {...p} />;
const XCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CancelCircleIconData} {...p} />;
const Award: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Award01IconData} {...p} />;
const RotateCcw: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ReloadIconData} {...p} />;
const Save: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SaveIconData} {...p} />;
const ChevronDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowDown01IconData} {...p} />;
const User: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UserIconData} {...p} />;
const Upload: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Upload01IconData} {...p} />;
const Loader2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Loading03IconData} {...p} />;
const ClipboardCheck: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CheckListIconData} {...p} />;
const Users: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UserGroupIconData} {...p} />;
const FileText: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={File01IconData} {...p} />;
import { useSettings } from '../contexts/SettingsContext';
import axios from 'axios';
import BulkGrader from './BulkGrader';
import QuizScanGrader from './QuizScanGrader';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import SmartInput from './SmartInput';

const API_BASE = 'http://localhost:8000';

interface Student {
  id: string;
  full_name: string;
  class_name?: string;
  grade_level?: string;
}

interface QuizGraderProps {
  quiz: ParsedQuiz | null;
  onClose: () => void;
}

type GraderTab = 'single' | 'bulk' | 'scan';
type SinglePhase = 'select-student' | 'answer' | 'results';

interface StudentAnswer {
  questionId: string;
  value: string | number | null;
}

interface QuestionResult {
  question: QuizQuestion;
  studentAnswer: string | number | null;
  correct: boolean;
  pointsEarned: number;
}

function isGradeable(q: QuizQuestion): boolean {
  return q.type === 'multiple-choice' || q.type === 'true-false' || q.type === 'fill-blank';
}

function gradeAnswer(question: QuizQuestion, studentAnswer: string | number | null): boolean {
  if (studentAnswer === null || studentAnswer === undefined) return false;
  if (question.type === 'multiple-choice') return Number(studentAnswer) === Number(question.correctAnswer);
  if (question.type === 'true-false') return String(studentAnswer).toLowerCase().trim() === String(question.correctAnswer).toLowerCase().trim();
  if (question.type === 'fill-blank') {
    const student = String(studentAnswer).trim().toLowerCase();
    const accepted = String(question.correctAnswer ?? '').split(/[,/]/).map(a => a.trim().toLowerCase());
    return accepted.some(a => a === student);
  }
  return false;
}

function getLetterGrade(pct: number): string {
  if (pct >= 90) return 'A';
  if (pct >= 80) return 'B';
  if (pct >= 70) return 'C';
  if (pct >= 60) return 'D';
  return 'F';
}

function letterGradeColor(grade: string): string {
  const m: Record<string, string> = {
    A: 'text-green-600 bg-green-50 border-green-200',
    B: 'text-blue-600 bg-blue-50 border-blue-200',
    C: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    D: 'text-orange-600 bg-orange-50 border-orange-200',
  };
  return m[grade] ?? 'text-red-600 bg-red-50 border-red-200';
}

const QuizGrader: React.FC<QuizGraderProps> = ({ quiz: quizProp, onClose }) => {
  const { settings } = useSettings();
  const accentColor = settings.tabColors['quiz-generator'] ?? '#3b82f6';

  // The working quiz — starts from prop, can be set via teacher file upload
  const [activeQuiz, setActiveQuiz] = useState<ParsedQuiz | null>(quizProp);
  const [activeTab, setActiveTab] = useState<GraderTab>('single');

  // Teacher file upload (when no quiz prop)
  const [teacherFile, setTeacherFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const teacherFileRef = useRef<HTMLInputElement>(null);

  // Single-student state
  const [phase, setPhase] = useState<SinglePhase>('select-student');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Keep answers in sync when activeQuiz changes
  useEffect(() => {
    if (activeQuiz) {
      setAnswers(activeQuiz.questions.filter(isGradeable).map(q => ({ questionId: q.id, value: null })));
    }
  }, [activeQuiz]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/students`).then(r => setStudents(r.data)).catch(() => {});
  }, []);

  const gradeableQuestions = activeQuiz?.questions.filter(isGradeable) ?? [];
  const filteredStudents = students.filter(s => s.full_name.toLowerCase().includes(studentSearch.toLowerCase()));

  // ── Teacher file upload ───────────────────────────────────────────────────

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) { setTeacherFile(file); setParseError(null); }
  }, []);

  const handleParseTeacherFile = async () => {
    if (!teacherFile) return;
    setParsing(true);
    setParseError(null);
    try {
      const form = new FormData();
      form.append('teacher_file', teacherFile);
      const res = await axios.post(`${API_BASE}/api/parse-teacher-quiz`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setActiveQuiz(res.data);
    } catch (err: any) {
      setParseError(err?.response?.data?.detail ?? 'Could not parse the teacher version. Try an HTML or PDF file exported from the app.');
    } finally {
      setParsing(false);
    }
  };

  // ── Single-student grading ────────────────────────────────────────────────

  const setAnswer = (questionId: string, value: string | number | null) => {
    setAnswers(prev => prev.map(a => a.questionId === questionId ? { ...a, value } : a));
  };

  const handleGrade = () => {
    const questionResults: QuestionResult[] = gradeableQuestions.map(q => {
      const ans = answers.find(a => a.questionId === q.id);
      const correct = gradeAnswer(q, ans?.value ?? null);
      return { question: q, studentAnswer: ans?.value ?? null, correct, pointsEarned: correct ? (q.points ?? 1) : 0 };
    });
    setResults(questionResults);
    setPhase('results');
  };

  const totalPoints = gradeableQuestions.reduce((sum, q) => sum + (q.points ?? 1), 0);
  const earnedPoints = results.reduce((sum, r) => sum + r.pointsEarned, 0);
  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const letterGrade = getLetterGrade(percentage);
  const allAnswered = gradeableQuestions.every(q => answers.find(a => a.questionId === q.id)?.value !== null);

  const handleSave = async () => {
    if (!selectedStudent || !activeQuiz) return;
    setSaveStatus('saving');
    try {
      const answerMap: Record<string, any> = {};
      results.forEach(r => {
        answerMap[r.question.id] = { question: r.question.question, studentAnswer: r.studentAnswer, correct: r.correct, pointsEarned: r.pointsEarned };
      });
      await axios.post(`${API_BASE}/api/quiz-grades`, {
        student_id: selectedStudent.id,
        quiz_title: activeQuiz.metadata.title,
        subject: activeQuiz.metadata.subject,
        score: earnedPoints,
        total_points: totalPoints,
        percentage,
        letter_grade: letterGrade,
        answers: answerMap,
      });
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-theme-surface">

      {/* ── Header ── */}
      <div className="border-b border-theme px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottomColor: `${accentColor}33` }}>
        <div>
          <h2 className="text-xl font-semibold text-theme-heading">Grade Quiz</h2>
          {activeQuiz ? (
            <p className="text-sm text-theme-hint">
              {activeQuiz.metadata.subject} · Grade {activeQuiz.metadata.gradeLevel} · {gradeableQuestions.length} gradeable · {activeQuiz.questions.length - gradeableQuestions.length} open-ended skipped
            </p>
          ) : (
            <p className="text-sm text-theme-hint">Upload the teacher version to get started</p>
          )}
        </div>
        <button onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-theme-hover transition text-theme-muted text-sm font-medium border border-theme">
          <RotateCcw className="w-4 h-4" />
          Back to Quiz
        </button>
      </div>

      {/* ── Teacher upload phase (no quiz loaded) ── */}
      {!activeQuiz ? (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-lg mx-auto space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: `${accentColor}15` }}>
                <FileText className="w-8 h-8" style={{ color: accentColor }} />
              </div>
              <h3 className="text-lg font-semibold text-theme-heading">Upload Teacher Version</h3>
              <p className="text-sm text-theme-hint mt-1">
                Drop the teacher version of the quiz (HTML or PDF exported from this app) to load the answer key.
              </p>
            </div>

            {/* Drop zone */}
            <div
              onDrop={onDrop}
              onDragOver={e => e.preventDefault()}
              onDragEnter={() => setDragging(true)}
              onDragLeave={() => setDragging(false)}
              onClick={() => teacherFileRef.current?.click()}
              className="rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors"
              style={dragging ? { borderColor: accentColor, backgroundColor: `${accentColor}10` } : {}}
            >
              <Upload className="w-8 h-8 mx-auto mb-3 text-theme-muted" />
              {teacherFile ? (
                <div>
                  <p className="text-sm font-medium text-theme-label">{teacherFile.name}</p>
                  <p className="text-xs text-theme-muted mt-1">{(teacherFile.size / 1024).toFixed(1)} KB · click to change</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-theme-label">Drop teacher quiz file here</p>
                  <p className="text-xs text-theme-muted mt-1">or click to browse · HTML or PDF</p>
                </div>
              )}
              <input
                ref={teacherFileRef}
                type="file"
                accept=".html,.htm,.pdf,.txt"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) { setTeacherFile(f); setParseError(null); } e.target.value = ''; }}
              />
            </div>

            {parseError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{parseError}</div>
            )}

            <button
              onClick={handleParseTeacherFile}
              disabled={!teacherFile || parsing}
              className="w-full py-3 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: accentColor }}
            >
              {parsing ? <><HeartbeatLoader className="w-4 h-4" />Parsing answer key...</> : <>Load Answer Key</>}
            </button>
          </div>
        </div>

      ) : (
        <>
          {/* ── Tabs ── */}
          <div className="flex border-b border-theme flex-shrink-0">
            {([['single', ClipboardCheck, 'Single Student'], ['bulk', Users, 'Bulk Grade'], ['scan', FileText, 'Scan Grade']] as const).map(([tab, Icon, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab ? 'border-current' : 'border-transparent text-theme-muted hover:text-theme-label'
                }`}
                style={activeTab === tab ? { borderBottomColor: accentColor, color: accentColor } : {}}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <div className="flex-1 overflow-y-auto">

            {/* ── Single Student Tab ── */}
            {activeTab === 'single' && (
              <div className="p-6 space-y-6">

                {/* Select Student */}
                {phase === 'select-student' && (
                  <div className="max-w-lg mx-auto space-y-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: `${accentColor}15` }}>
                        <User className="w-8 h-8" style={{ color: accentColor }} />
                      </div>
                      <h3 className="text-lg font-semibold text-theme-heading">Select Student</h3>
                      <p className="text-sm text-theme-hint mt-1">Choose the student you are grading this quiz for.</p>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search student name..."
                        value={studentSearch}
                        onChange={e => { setStudentSearch(e.target.value); setShowDropdown(true); }}
                        onFocus={() => setShowDropdown(true)}
                        className="w-full px-4 py-3 rounded-lg border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2 pr-10"
                        style={{ '--tw-ring-color': accentColor } as any}
                      />
                      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-theme-muted pointer-events-none" />
                      {showDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                          <div className="absolute top-full mt-1 left-0 right-0 bg-theme-surface border border-theme rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                            {filteredStudents.length === 0 ? (
                              <div className="px-4 py-3 text-sm text-theme-muted">
                                {students.length === 0 ? 'No students found. Add students in Class Management.' : 'No matches.'}
                              </div>
                            ) : filteredStudents.map(s => (
                              <button key={s.id} onClick={() => { setSelectedStudent(s); setStudentSearch(s.full_name); setShowDropdown(false); }} className="w-full text-left px-4 py-3 hover:bg-theme-hover transition flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0" style={{ backgroundColor: accentColor }}>
                                  {s.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-theme-label">{s.full_name}</div>
                                  {s.class_name && <div className="text-xs text-theme-muted">{s.class_name}</div>}
                                </div>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {selectedStudent && (
                      <div className="rounded-lg border border-theme p-4 flex items-center gap-3 bg-theme-subtle">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: accentColor }}>
                          {selectedStudent.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-theme-label">{selectedStudent.full_name}</div>
                          <div className="text-xs text-theme-muted">{selectedStudent.class_name ?? 'No class assigned'}</div>
                        </div>
                      </div>
                    )}

                    <button onClick={() => setPhase('answer')} disabled={!selectedStudent} className="w-full py-3 rounded-lg text-white font-medium transition disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor: selectedStudent ? accentColor : '#9ca3af' }}>
                      Continue to Questions
                    </button>
                    <button onClick={() => setPhase('answer')} className="w-full py-2 text-sm text-theme-muted hover:text-theme-label transition">
                      Skip student selection
                    </button>
                  </div>
                )}

                {/* Answer Questions */}
                {phase === 'answer' && (
                  <div className="max-w-2xl mx-auto space-y-6">
                    {selectedStudent && (
                      <div className="flex items-center gap-2 text-sm text-theme-hint">
                        <User className="w-4 h-4" />
                        Grading for: <span className="font-medium text-theme-label">{selectedStudent.full_name}</span>
                      </div>
                    )}

                    {gradeableQuestions.map((q, idx) => {
                      const ans = answers.find(a => a.questionId === q.id);
                      return (
                        <div key={q.id} className="rounded-xl border border-theme bg-theme-card p-5 space-y-4">
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: accentColor }}>{idx + 1}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                                  {q.type === 'multiple-choice' ? 'Multiple Choice' : q.type === 'true-false' ? 'True / False' : 'Fill in the Blank'}
                                </span>
                                <span className="text-xs text-theme-muted">{q.points ?? 1} pt{(q.points ?? 1) !== 1 ? 's' : ''}</span>
                              </div>
                              <p className="text-theme-label font-medium leading-relaxed">{q.question}</p>
                            </div>
                          </div>

                          {q.type === 'multiple-choice' && q.options && (
                            <div className="space-y-2 ml-10">
                              {q.options.map((opt, i) => (
                                <label key={i} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${ans?.value === i ? 'border-current' : 'border-theme hover:bg-theme-hover'}`} style={ans?.value === i ? { borderColor: accentColor, backgroundColor: `${accentColor}10` } : {}}>
                                  <input type="radio" name={`q_${q.id}`} checked={ans?.value === i} onChange={() => setAnswer(q.id, i)} className="sr-only" />
                                  <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold transition" style={ans?.value === i ? { borderColor: accentColor, backgroundColor: accentColor, color: 'white' } : { borderColor: '#d1d5db' }}>
                                    {String.fromCharCode(65 + i)}
                                  </span>
                                  <span className="text-sm text-theme-label">{opt}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          {q.type === 'true-false' && (
                            <div className="flex gap-3 ml-10">
                              {['true', 'false'].map(val => (
                                <label key={val} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition font-medium capitalize ${ans?.value === val ? 'text-white' : 'border-theme hover:bg-theme-hover text-theme-label'}`} style={ans?.value === val ? { borderColor: accentColor, backgroundColor: accentColor } : {}}>
                                  <input type="radio" name={`q_${q.id}`} checked={ans?.value === val} onChange={() => setAnswer(q.id, val)} className="sr-only" />
                                  {val}
                                </label>
                              ))}
                            </div>
                          )}

                          {q.type === 'fill-blank' && (
                            <div className="ml-10">
                              <SmartInput placeholder="Enter student's answer..." value={ans?.value as string ?? ''} onChange={val => setAnswer(q.id, val)} className="w-full px-4 py-2.5 rounded-lg border border-theme bg-theme-input text-theme-label focus:outline-none focus:ring-2 text-sm" style={{ '--tw-ring-color': accentColor } as any} />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setPhase('select-student')} className="px-4 py-2 rounded-lg border border-theme text-theme-label hover:bg-theme-hover transition text-sm">Back</button>
                      <button onClick={handleGrade} disabled={!allAnswered} className="flex-1 py-3 rounded-lg text-white font-medium transition disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor: allAnswered ? accentColor : '#9ca3af' }}>
                        {allAnswered ? 'Grade Quiz' : `Answer all questions (${answers.filter(a => a.value !== null).length}/${gradeableQuestions.length})`}
                      </button>
                    </div>
                  </div>
                )}

                {/* Results */}
                {phase === 'results' && (
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="rounded-xl overflow-hidden shadow-lg">
                      <div className="p-6 text-white" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}>
                        <div className="flex items-center justify-between">
                          <div>
                            {selectedStudent && <div className="flex items-center gap-2 mb-2 text-white/80 text-sm"><User className="w-4 h-4" />{selectedStudent.full_name}</div>}
                            <h3 className="text-2xl font-bold">{earnedPoints} / {totalPoints} points</h3>
                            <p className="text-white/80 mt-1">{activeQuiz?.metadata.subject} · {activeQuiz?.metadata.title}</p>
                          </div>
                          <div className={`text-5xl font-bold px-5 py-3 rounded-xl border-2 ${letterGradeColor(letterGrade)}`}>{letterGrade}</div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-white/80 mb-1">
                            <span>{percentage}%</span>
                            <span>{results.filter(r => r.correct).length}/{gradeableQuestions.length} correct</span>
                          </div>
                          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      </div>
                      <div className="bg-theme-card px-6 py-4 flex items-center justify-between">
                        <div className="flex gap-4 text-sm">
                          <span className="flex items-center gap-1.5 text-green-600"><CheckCircle className="w-4 h-4" />{results.filter(r => r.correct).length} correct</span>
                          <span className="flex items-center gap-1.5 text-red-500"><XCircle className="w-4 h-4" />{results.filter(r => !r.correct).length} incorrect</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setPhase('answer'); setSaveStatus('idle'); setResults([]); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-theme text-theme-label hover:bg-theme-hover transition text-sm">
                            <RotateCcw className="w-4 h-4" />Re-grade
                          </button>
                          {selectedStudent && (
                            <button onClick={handleSave} disabled={saveStatus === 'saving' || saveStatus === 'saved'} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm transition ${saveStatus === 'saved' ? 'bg-green-600' : saveStatus === 'error' ? 'bg-red-500' : 'hover:opacity-90'}`} style={saveStatus === 'idle' || saveStatus === 'saving' ? { backgroundColor: accentColor } : {}}>
                              <Save className="w-4 h-4" />
                              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error – Retry' : 'Save to Profile'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-theme-hint uppercase tracking-wider">Question Breakdown</h4>
                      {results.map((r, idx) => {
                        const correctLabel = r.question.type === 'multiple-choice'
                          ? `${String.fromCharCode(65 + Number(r.question.correctAnswer))} – ${r.question.options?.[Number(r.question.correctAnswer)] ?? ''}`
                          : String(r.question.correctAnswer ?? '');
                        const studentLabel = r.studentAnswer === null ? 'Not answered'
                          : r.question.type === 'multiple-choice'
                          ? `${String.fromCharCode(65 + Number(r.studentAnswer))} – ${r.question.options?.[Number(r.studentAnswer)] ?? ''}`
                          : String(r.studentAnswer);

                        return (
                          <div key={r.question.id} className={`rounded-xl border p-4 ${r.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                            <div className="flex items-start gap-3">
                              {r.correct ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="text-xs font-medium text-theme-muted">Q{idx + 1}</span>
                                  <span className={`text-xs font-semibold ${r.correct ? 'text-green-700' : 'text-red-600'}`}>{r.pointsEarned}/{r.question.points ?? 1} pts</span>
                                </div>
                                <p className="text-sm font-medium text-theme-label mb-2 leading-relaxed">{r.question.question}</p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className={`rounded px-2 py-1 ${r.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                                    <span className="font-semibold">Student: </span>{studentLabel}
                                  </div>
                                  {!r.correct && (
                                    <div className="rounded px-2 py-1 bg-green-100 text-green-800">
                                      <span className="font-semibold">Correct: </span>{correctLabel}
                                    </div>
                                  )}
                                </div>
                                {!r.correct && r.question.explanation && (
                                  <p className="mt-2 text-xs text-theme-muted italic border-l-2 border-theme pl-2">{r.question.explanation}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Bulk Grade Tab ── */}
            {activeTab === 'bulk' && (
              <BulkGrader quiz={activeQuiz} onClose={onClose} embedded />
            )}

            {/* ── Scan Grade Tab (HunyuanOCR) ── */}
            {activeTab === 'scan' && (
              <QuizScanGrader onClose={onClose} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizGrader;
