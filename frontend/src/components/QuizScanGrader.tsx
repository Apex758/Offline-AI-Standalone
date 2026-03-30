import React, { useState, useRef, useCallback, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Upload01IconData from '@hugeicons/core-free-icons/Upload01Icon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import CheckmarkCircle01IconData from '@hugeicons/core-free-icons/CheckmarkCircle01Icon';
import CancelCircleIconData from '@hugeicons/core-free-icons/CancelCircleIcon';
import AlertCircleIconData from '@hugeicons/core-free-icons/AlertCircleIcon';
import Award01IconData from '@hugeicons/core-free-icons/Award01Icon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import ArrowUp01IconData from '@hugeicons/core-free-icons/ArrowUp01Icon';
import Delete02IconData from '@hugeicons/core-free-icons/Delete02Icon';
import Search01IconData from '@hugeicons/core-free-icons/Search01Icon';
import Loading03IconData from '@hugeicons/core-free-icons/Loading03Icon';
import SquareLock01IconData from '@hugeicons/core-free-icons/SquareLock01Icon';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import { useCapabilities } from '../contexts/CapabilitiesContext';
import axios from 'axios';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
const Upload: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Upload01IconData} {...p} />;
const FileText: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={File01IconData} {...p} />;
const CheckCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CheckmarkCircle01IconData} {...p} />;
const XCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CancelCircleIconData} {...p} />;
const AlertCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={AlertCircleIconData} {...p} />;
const Award: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Award01IconData} {...p} />;
const ChevronDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowDown01IconData} {...p} />;
const ChevronUp: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowUp01IconData} {...p} />;
const Trash2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Delete02IconData} {...p} />;
const SearchIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Search01IconData} {...p} />;
const Loader2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Loading03IconData} {...p} />;

const API_BASE = 'http://localhost:8000';

interface ScanGradeResult {
  file_name: string;
  student_name: string | null;
  student_id: string | null;
  error: string | null;
  score: number;
  total_points: number;
  percentage: number;
  letter_grade: string;
  details: Record<string, { answer: string; earned: number; max: number; feedback?: string }>;
  unclear: number[];
  saved: boolean;
}

interface QuizScanGraderProps {
  quizId?: string;
  onClose: () => void;
}

function letterColor(g: string) {
  const m: Record<string, string> = {
    A: 'text-green-600 bg-green-50 border-green-200',
    B: 'text-blue-600 bg-blue-50 border-blue-200',
    C: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    D: 'text-orange-600 bg-orange-50 border-orange-200',
    F: 'text-red-600 bg-red-50 border-red-200',
  };
  return m[g] || 'text-gray-600 bg-gray-50 border-gray-200';
}

type Phase = 'quiz-id' | 'upload-scans' | 'grading' | 'results';

const QuizScanGrader: React.FC<QuizScanGraderProps> = ({ quizId: initialQuizId, onClose }) => {
  const { hasOcr } = useCapabilities();
  const [phase, setPhase] = useState<Phase>(initialQuizId ? 'upload-scans' : 'quiz-id');
  const [quizId, setQuizId] = useState(initialQuizId || '');
  const [quizInfo, setQuizInfo] = useState<{ quiz_title: string; subject: string } | null>(null);
  const [quizIdError, setQuizIdError] = useState('');
  const [lookingUp, setLookingUp] = useState(false);

  // Teacher file upload for quiz ID extraction
  const [extractingId, setExtractingId] = useState(false);
  const teacherFileRef = useRef<HTMLInputElement>(null);

  // Student scan files
  const [scanFiles, setScanFiles] = useState<File[]>([]);
  const scanFileRef = useRef<HTMLInputElement>(null);

  // Grading state
  const [grading, setGrading] = useState(false);
  const [gradingProgress, setGradingProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<ScanGradeResult[]>([]);
  const [expandedResult, setExpandedResult] = useState<number | null>(null);

  // If initialQuizId provided, look it up immediately
  useEffect(() => {
    if (initialQuizId) {
      lookupQuizId(initialQuizId);
    }
  }, [initialQuizId]);

  const lookupQuizId = async (id: string) => {
    setLookingUp(true);
    setQuizIdError('');
    try {
      const res = await axios.get(`${API_BASE}/api/quiz/answer-key/${id}`);
      setQuizInfo({ quiz_title: res.data.quiz_title, subject: res.data.subject });
      setQuizId(id);
      setPhase('upload-scans');
    } catch {
      setQuizIdError('Quiz ID not found. Make sure the quiz was saved after generation.');
    } finally {
      setLookingUp(false);
    }
  };

  const handleTeacherFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtractingId(true);
    setQuizIdError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_BASE}/api/quiz/extract-quiz-id`, formData);
      if (res.data.found) {
        setQuizId(res.data.quiz_id);
        setQuizInfo({ quiz_title: res.data.quiz_title, subject: res.data.subject });
        setPhase('upload-scans');
      } else {
        setQuizIdError(`Found quiz ID "${res.data.quiz_id}" but no answer key exists for it.`);
      }
    } catch (err: any) {
      setQuizIdError(err?.response?.data?.detail || 'Could not extract quiz ID from file');
    } finally {
      setExtractingId(false);
      if (teacherFileRef.current) teacherFileRef.current.value = '';
    }
  };

  const handleScanFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setScanFiles(prev => [...prev, ...files]);
    if (scanFileRef.current) scanFileRef.current.value = '';
  };

  const removeScanFile = (index: number) => {
    setScanFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleGrade = async () => {
    if (!quizId || scanFiles.length === 0) return;

    setGrading(true);
    setPhase('grading');
    setResults([]);
    setGradingProgress({ current: 0, total: scanFiles.length });

    const formData = new FormData();
    formData.append('quiz_id', quizId);
    scanFiles.forEach(f => formData.append('student_files', f));

    try {
      // Use streaming endpoint for progress
      const response = await fetch(`${API_BASE}/api/quiz/grade-scans-stream`, {
        method: 'POST',
        body: formData,
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const event = JSON.parse(line.slice(6));
                setResults(prev => [...prev, event.result]);
                setGradingProgress({ current: event.index + 1, total: event.total });
              } catch { /* skip malformed events */ }
            }
          }
        }
      }

      setPhase('results');
    } catch (err: any) {
      setQuizIdError(err?.message || 'Grading failed');
      setPhase('upload-scans');
    } finally {
      setGrading(false);
    }
  };

  const classAverage = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length)
    : 0;

  if (!hasOcr) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <Icon icon={SquareLock01IconData} className="w-7 h-7" style={{ color: '#3b82f6' }} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">OCR Scan Grading Unavailable</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Scan grading requires OCR (Tier 2). Enable OCR in Settings to grade student papers by scanning.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-theme-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-theme-strong">
        <div>
          <h2 className="text-lg font-semibold text-theme-title">Grade Scanned Quizzes</h2>
          {quizInfo && (
            <p className="text-sm text-theme-muted">{quizInfo.quiz_title} - {quizInfo.subject}</p>
          )}
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-theme-hover">
          <X className="w-5 h-5 text-theme-muted" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Phase 1: Quiz ID */}
        {phase === 'quiz-id' && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <SearchIcon className="w-12 h-12 text-theme-muted mx-auto mb-3" />
              <h3 className="text-lg font-medium text-theme-title">Find Answer Key</h3>
              <p className="text-sm text-theme-muted mt-1">Upload the teacher version or enter the Quiz ID</p>
            </div>

            {/* Option 1: Upload teacher version */}
            <div className="border-2 border-dashed border-theme-strong rounded-lg p-6 text-center">
              <input
                ref={teacherFileRef}
                type="file"
                accept=".pdf,.html,.htm,.jpg,.jpeg,.png"
                onChange={handleTeacherFileUpload}
                className="hidden"
              />
              <button
                onClick={() => teacherFileRef.current?.click()}
                disabled={extractingId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {extractingId ? (
                  <span className="flex items-center gap-2">
                    <HeartbeatLoader className="w-4 h-4" /> Extracting Quiz ID...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Upload Teacher Version
                  </span>
                )}
              </button>
              <p className="text-xs text-theme-hint mt-2">PDF, HTML, or image of the teacher version</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-theme-strong" />
              <span className="text-xs text-theme-muted font-medium">OR</span>
              <div className="flex-1 h-px bg-theme-strong" />
            </div>

            {/* Option 2: Manual quiz ID input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={quizId}
                onChange={(e) => setQuizId(e.target.value)}
                placeholder="Enter Quiz ID (e.g. quiz_1234567890)"
                className="flex-1 px-3 py-2 border border-theme-strong rounded-lg bg-theme-surface text-theme-label text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => lookupQuizId(quizId)}
                disabled={!quizId || lookingUp}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {lookingUp ? <HeartbeatLoader className="w-4 h-4" /> : 'Look Up'}
              </button>
            </div>

            {quizIdError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                {quizIdError}
              </div>
            )}
          </div>
        )}

        {/* Phase 2: Upload student scans */}
        {phase === 'upload-scans' && (
          <div className="space-y-4">
            {quizInfo && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm">
                <span className="font-medium text-blue-800">Answer key loaded:</span>{' '}
                <span className="text-blue-700">{quizInfo.quiz_title}</span>
                <span className="text-blue-500 ml-2 font-mono text-xs">({quizId})</span>
              </div>
            )}

            <div className="border-2 border-dashed border-theme-strong rounded-lg p-6 text-center">
              <input
                ref={scanFileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleScanFilesSelected}
                className="hidden"
              />
              <Upload className="w-10 h-10 text-theme-muted mx-auto mb-2" />
              <button
                onClick={() => scanFileRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Upload Student Scans
              </button>
              <p className="text-xs text-theme-hint mt-2">
                Upload photos/scans of student quiz papers (JPG, PNG)
              </p>
            </div>

            {scanFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-theme-label">
                  {scanFiles.length} file{scanFiles.length !== 1 ? 's' : ''} selected
                </h4>
                {scanFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-theme-surface border border-theme-strong">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-theme-muted" />
                      <span className="text-sm text-theme-label truncate max-w-[200px]">{f.name}</span>
                      <span className="text-xs text-theme-hint">{(f.size / 1024).toFixed(0)} KB</span>
                    </div>
                    <button onClick={() => removeScanFile(i)} className="p-1 hover:bg-red-50 rounded">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={handleGrade}
                  disabled={scanFiles.length === 0}
                  className="w-full mt-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                >
                  Grade {scanFiles.length} Scan{scanFiles.length !== 1 ? 's' : ''}
                </button>
              </div>
            )}

            <button
              onClick={() => { setPhase('quiz-id'); setQuizInfo(null); setQuizId(''); }}
              className="text-sm text-blue-600 hover:underline"
            >
              Use a different quiz
            </button>
          </div>
        )}

        {/* Phase 3: Grading in progress */}
        {phase === 'grading' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <HeartbeatLoader className="w-8 h-8 text-blue-600" />
            <p className="text-theme-label font-medium">Grading scans...</p>
            <p className="text-sm text-theme-muted">
              {gradingProgress.current} of {gradingProgress.total} complete
            </p>
            <div className="w-64 h-2 bg-theme-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${gradingProgress.total ? (gradingProgress.current / gradingProgress.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Phase 4: Results */}
        {phase === 'results' && results.length > 0 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-center">
                <p className="text-2xl font-bold text-blue-700">{results.length}</p>
                <p className="text-xs text-blue-600">Graded</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-center">
                <p className="text-2xl font-bold text-green-700">{classAverage}%</p>
                <p className="text-xs text-green-600">Class Average</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-center">
                <p className="text-2xl font-bold text-purple-700">{results.filter(r => r.saved).length}</p>
                <p className="text-xs text-purple-600">Auto-saved</p>
              </div>
            </div>

            {/* Individual results */}
            {results.map((r, idx) => (
              <div key={idx} className="border border-theme-strong rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedResult(expandedResult === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-3 hover:bg-theme-subtle"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-sm font-bold rounded border ${letterColor(r.letter_grade)}`}>
                      {r.letter_grade}
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-theme-label">
                        {r.student_name || r.file_name}
                      </p>
                      {r.student_id && (
                        <p className="text-xs text-theme-hint">ID: {r.student_id} {r.saved && '(saved)'}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-theme-label">
                      {r.score}/{r.total_points} ({r.percentage}%)
                    </span>
                    {r.error ? (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      expandedResult === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {expandedResult === idx && !r.error && (
                  <div className="border-t border-theme-strong p-3 space-y-2 bg-theme-surface">
                    {Object.entries(r.details).map(([qNum, detail]) => (
                      <div key={qNum} className="flex items-start justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {detail.earned === detail.max ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : detail.earned > 0 ? (
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-theme-label">Q{qNum}: {detail.answer || '[no answer]'}</span>
                        </div>
                        <span className="text-theme-hint">{detail.earned}/{detail.max}</span>
                      </div>
                    ))}
                    {r.unclear.length > 0 && (
                      <p className="text-xs text-amber-600 mt-1">
                        Unclear questions: {r.unclear.join(', ')}
                      </p>
                    )}
                  </div>
                )}

                {r.error && expandedResult === idx && (
                  <div className="border-t border-red-200 p-3 bg-red-50 text-sm text-red-700">
                    {r.error}
                  </div>
                )}
              </div>
            ))}

            <div className="flex gap-2">
              <button
                onClick={() => { setPhase('upload-scans'); setScanFiles([]); setResults([]); }}
                className="flex-1 px-4 py-2 border border-theme-strong rounded-lg text-sm hover:bg-theme-subtle"
              >
                Grade More Scans
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizScanGrader;
