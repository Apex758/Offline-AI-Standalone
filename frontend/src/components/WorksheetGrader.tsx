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
import { ParsedWorksheet, WorksheetQuestion } from '../types/worksheet';

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
import WorksheetBulkGrader from './WorksheetBulkGrader';
import { HeartbeatLoader } from './ui/HeartbeatLoader';

const API_BASE = 'http://localhost:8000';

interface Student {
  id: string;
  full_name: string;
  class_name?: string;
  grade_level?: string;
}

interface WorksheetGraderProps {
  worksheet: ParsedWorksheet | null;
  onClose: () => void;
}

type GraderTab = 'single' | 'bulk';
type SinglePhase = 'select-student' | 'answer' | 'results';

interface StudentAnswer {
  questionId: string;
  value: string | number | null;
}

interface QuestionResult {
  question: WorksheetQuestion;
  studentAnswer: string | number | null;
  correct: boolean;
  pointsEarned: number;
}

function isGradeable(q: WorksheetQuestion): boolean {
  return q.type === 'multiple-choice' || q.type === 'true-false' || q.type === 'fill-blank' || q.type === 'word-bank';
}

function gradeAnswer(question: WorksheetQuestion, studentAnswer: string | number | null): boolean {
  if (studentAnswer === null || studentAnswer === undefined) return false;
  if (question.type === 'multiple-choice') return Number(studentAnswer) === Number(question.correctAnswer);
  if (question.type === 'true-false') return String(studentAnswer).toLowerCase().trim() === String(question.correctAnswer).toLowerCase().trim();
  if (question.type === 'fill-blank' || question.type === 'word-bank') {
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

const WorksheetGrader: React.FC<WorksheetGraderProps> = ({ worksheet: worksheetProp, onClose }) => {
  const { settings } = useSettings();
  const accentColor = settings.tabColors['worksheet-generator'] ?? '#3b82f6';

  const [activeWorksheet, setActiveWorksheet] = useState<ParsedWorksheet | null>(worksheetProp);
  const [activeTab, setActiveTab] = useState<GraderTab>('single');

  // Single-student state
  const [phase, setPhase] = useState<SinglePhase>('select-student');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (activeWorksheet) {
      setAnswers(activeWorksheet.questions.filter(isGradeable).map(q => ({ questionId: q.id, value: null })));
    }
  }, [activeWorksheet]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/students`).then(r => setStudents(r.data)).catch(() => {});
  }, []);

  const gradeableQuestions = activeWorksheet?.questions.filter(isGradeable) ?? [];
  const filteredStudents = students.filter(s => s.full_name.toLowerCase().includes(studentSearch.toLowerCase()));

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
    if (!selectedStudent || !activeWorksheet) return;
    setSaveStatus('saving');
    try {
      const answerMap: Record<string, any> = {};
      results.forEach(r => {
        answerMap[r.question.id] = { question: r.question.question, studentAnswer: r.studentAnswer, correct: r.correct, pointsEarned: r.pointsEarned };
      });
      await axios.post(`${API_BASE}/api/worksheet-grades`, {
        student_id: selectedStudent.id,
        worksheet_title: activeWorksheet.metadata.title,
        subject: activeWorksheet.metadata.subject,
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

  const handleReset = () => {
    setPhase('select-student');
    setSelectedStudent(null);
    setStudentSearch('');
    setAnswers(activeWorksheet?.questions.filter(isGradeable).map(q => ({ questionId: q.id, value: null })) ?? []);
    setResults([]);
    setSaveStatus('idle');
  };

  return (
    <div className="flex flex-col h-full bg-theme-surface">

      {/* Header */}
      <div className="border-b border-theme px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottomColor: `${accentColor}33` }}>
        <div>
          <h2 className="text-xl font-semibold text-theme-heading">Grade Worksheet</h2>
          {activeWorksheet ? (
            <p className="text-sm text-theme-hint">
              {activeWorksheet.metadata.subject} · {activeWorksheet.metadata.gradeLevel} · {gradeableQuestions.length} gradeable questions
            </p>
          ) : (
            <p className="text-sm text-theme-hint">Select a worksheet to grade</p>
          )}
        </div>
        <button onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-theme-hover transition text-theme-muted text-sm font-medium border border-theme">
          <RotateCcw className="w-4 h-4" />
          Back to Worksheet
        </button>
      </div>

      {/* Tabs */}
      {activeWorksheet && (
        <div className="flex border-b border-theme px-6 flex-shrink-0">
          {(['single', 'bulk'] as GraderTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-theme-muted hover:text-theme-label'
              }`}
            >
              {tab === 'single' ? 'Single Student' : 'Bulk Grade'}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {!activeWorksheet ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-theme-hint" />
            <h3 className="text-lg font-semibold text-theme-heading">No Worksheet Loaded</h3>
            <p className="text-sm text-theme-hint mt-2">Generate a worksheet first, then click "Grade Worksheets"</p>
          </div>
        </div>
      ) : activeTab === 'bulk' ? (
        <WorksheetBulkGrader worksheet={activeWorksheet} onClose={onClose} embedded />
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">

            {/* Select Student */}
            {phase === 'select-student' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3" style={{ backgroundColor: `${accentColor}15` }}>
                    <User className="w-7 h-7" style={{ color: accentColor }} />
                  </div>
                  <h3 className="text-lg font-semibold text-theme-heading">Select Student</h3>
                  <p className="text-sm text-theme-hint">Choose the student whose worksheet you're grading</p>
                </div>

                <div className="relative">
                  <input
                    value={studentSearch}
                    onChange={(e) => { setStudentSearch(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search by name..."
                    className="w-full px-4 py-3 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {showDropdown && filteredStudents.length > 0 && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1 bg-theme-surface border border-theme rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                        {filteredStudents.map(s => (
                          <button
                            key={s.id}
                            onClick={() => {
                              setSelectedStudent(s);
                              setStudentSearch(s.full_name);
                              setShowDropdown(false);
                              setPhase('answer');
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-theme-subtle flex items-center justify-between"
                          >
                            <span className="text-sm font-medium text-theme-heading">{s.full_name}</span>
                            <span className="text-xs text-theme-hint font-mono">{s.id}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Answer Entry */}
            {phase === 'answer' && selectedStudent && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-theme-secondary rounded-lg border border-theme">
                  <div>
                    <span className="text-sm font-semibold text-theme-heading">{selectedStudent.full_name}</span>
                    <span className="text-xs text-theme-hint ml-2 font-mono">{selectedStudent.id}</span>
                  </div>
                  <button onClick={handleReset} className="text-xs text-blue-600 hover:underline">Change student</button>
                </div>

                {gradeableQuestions.map((q, i) => (
                  <div key={q.id} className="p-4 border border-theme rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: accentColor }}>{i + 1}</span>
                      <p className="text-sm font-medium text-theme-heading flex-1">{q.question}</p>
                    </div>

                    {q.type === 'multiple-choice' && q.options && (
                      <div className="grid grid-cols-2 gap-2 ml-10">
                        {q.options.map((opt, oi) => (
                          <button
                            key={oi}
                            onClick={() => setAnswer(q.id, oi)}
                            className={`text-left px-3 py-2 rounded-lg border text-sm transition ${
                              answers.find(a => a.questionId === q.id)?.value === oi
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-theme hover:bg-theme-subtle text-theme-label'
                            }`}
                          >
                            <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type === 'true-false' && (
                      <div className="flex gap-3 ml-10">
                        {['True', 'False'].map(val => (
                          <button
                            key={val}
                            onClick={() => setAnswer(q.id, val)}
                            className={`px-6 py-2 rounded-lg border text-sm font-medium transition ${
                              answers.find(a => a.questionId === q.id)?.value === val
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-theme hover:bg-theme-subtle text-theme-label'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    )}

                    {(q.type === 'fill-blank' || q.type === 'word-bank') && (
                      <div className="ml-10">
                        <input
                          value={String(answers.find(a => a.questionId === q.id)?.value ?? '')}
                          onChange={(e) => setAnswer(q.id, e.target.value)}
                          placeholder="Student's answer..."
                          className="w-full px-3 py-2 border border-theme-strong rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                ))}

                <button
                  onClick={handleGrade}
                  disabled={!allAnswered}
                  className="w-full py-3 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 disabled:opacity-40"
                  style={{ backgroundColor: accentColor }}
                >
                  <ClipboardCheck className="w-5 h-5" />
                  Grade Worksheet
                </button>
              </div>
            )}

            {/* Results */}
            {phase === 'results' && selectedStudent && (
              <div className="space-y-4">
                {/* Score card */}
                <div className="text-center p-6 rounded-xl border-2" style={{ borderColor: `${accentColor}40`, background: `${accentColor}08` }}>
                  <Award className="w-10 h-10 mx-auto mb-2" style={{ color: accentColor }} />
                  <div className="text-4xl font-black text-theme-heading">{earnedPoints} / {totalPoints}</div>
                  <div className="text-lg text-theme-hint mt-1">{percentage}%</div>
                  <div className={`inline-block mt-2 px-4 py-1 rounded-full border text-sm font-bold ${letterGradeColor(letterGrade)}`}>
                    {letterGrade}
                  </div>
                  <div className="text-sm text-theme-hint mt-2">{selectedStudent.full_name} · {selectedStudent.id}</div>
                </div>

                {/* Per-question breakdown */}
                {results.map((r, i) => (
                  <div key={r.question.id} className={`flex items-start gap-3 p-3 rounded-lg border ${r.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    {r.correct
                      ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    }
                    <div className="flex-1">
                      <p className="text-sm font-medium text-theme-heading">{i + 1}. {r.question.question}</p>
                      <p className="text-xs mt-1">
                        <span className={r.correct ? 'text-green-700' : 'text-red-700'}>
                          Answer: {String(r.studentAnswer)}
                        </span>
                        {!r.correct && r.question.correctAnswer !== undefined && (
                          <span className="text-green-700 ml-2">
                            (Correct: {String(r.question.correctAnswer)})
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="text-xs font-bold">{r.pointsEarned}/{r.question.points ?? 1}</span>
                  </div>
                ))}

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                    className="flex-1 py-3 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ backgroundColor: saveStatus === 'saved' ? '#16a34a' : accentColor }}
                  >
                    <Save className="w-5 h-5" />
                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved to Profile!' : saveStatus === 'error' ? 'Error — Retry' : 'Save Grade'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-lg border border-theme text-theme-label font-medium hover:bg-theme-hover transition"
                  >
                    Grade Another
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default WorksheetGrader;
