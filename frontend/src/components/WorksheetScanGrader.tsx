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
import { useTranslation } from 'react-i18next';
import { useCapabilities } from '../contexts/CapabilitiesContext';
import axios from 'axios';
import { useTabProcessing } from '../contexts/TabBusyContext';
import { useTabId } from '../contexts/TabIdContext';
import { useQueue } from '../contexts/QueueContext';

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

interface WorksheetScanGraderProps {
  worksheetId?: string;
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

type Phase = 'worksheet-id' | 'upload-scans' | 'grading' | 'review' | 'confirmed';

const WorksheetScanGrader: React.FC<WorksheetScanGraderProps> = ({ worksheetId: initialWorksheetId, onClose }) => {
  const { t } = useTranslation();
  const { hasOcr } = useCapabilities();
  const [phase, setPhase] = useState<Phase>(initialWorksheetId ? 'upload-scans' : 'worksheet-id');
  const [worksheetId, setWorksheetId] = useState(initialWorksheetId || '');
  const [worksheetInfo, setWorksheetInfo] = useState<{ worksheet_title: string; subject: string } | null>(null);
  const [worksheetIdError, setWorksheetIdError] = useState('');
  const [lookingUp, setLookingUp] = useState(false);

  // Teacher file upload for worksheet ID extraction
  const [extractingId, setExtractingId] = useState(false);
  const teacherFileRef = useRef<HTMLInputElement>(null);

  // Student scan files
  const [scanFiles, setScanFiles] = useState<File[]>([]);
  const scanFileRef = useRef<HTMLInputElement>(null);

  // Grading state
  const [grading, setGrading] = useState(false);
  const setTabProcessing = useTabProcessing('worksheet-scan-grade');
  useEffect(() => { setTabProcessing(grading); }, [grading, setTabProcessing]);
  const tabId = useTabId();
  const { addExternalItem, completeExternalItem } = useQueue();
  const gradeAbortRef = useRef<AbortController | null>(null);
  const gradeQueueIdRef = useRef<string | null>(null);
  const [gradingProgress, setGradingProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<ScanGradeResult[]>([]);
  const [expandedResult, setExpandedResult] = useState<number | null>(null);
  const [gradingSummary, setGradingSummary] = useState<{ qr_graded: number; ocr_graded: number; failed: number; total: number } | null>(null);
  const [editedScores, setEditedScores] = useState<Record<number, Record<string, number>>>({});
  const [confirming, setConfirming] = useState(false);
  const [confirmResult, setConfirmResult] = useState<{ saved: number; failed: number; errors: string[] } | null>(null);

  // If initialWorksheetId provided, look it up immediately
  useEffect(() => {
    if (initialWorksheetId) {
      lookupWorksheetId(initialWorksheetId);
    }
  }, [initialWorksheetId]);

  const lookupWorksheetId = async (id: string) => {
    setLookingUp(true);
    setWorksheetIdError('');
    try {
      const res = await axios.get(`${API_BASE}/api/worksheet/answer-key/${id}`);
      setWorksheetInfo({ worksheet_title: res.data.worksheet_title, subject: res.data.subject });
      setWorksheetId(id);
      setPhase('upload-scans');
    } catch {
      setWorksheetIdError('Worksheet ID not found. Make sure the worksheet was saved after generation.');
    } finally {
      setLookingUp(false);
    }
  };

  const handleTeacherFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtractingId(true);
    setWorksheetIdError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_BASE}/api/worksheet/extract-worksheet-id`, formData);
      if (res.data.found) {
        setWorksheetId(res.data.worksheet_id);
        setWorksheetInfo({ worksheet_title: res.data.worksheet_title, subject: res.data.subject });
        setPhase('upload-scans');
      } else {
        setWorksheetIdError(`Found worksheet ID "${res.data.worksheet_id}" but no answer key exists for it.`);
      }
    } catch (err: any) {
      setWorksheetIdError(err?.response?.data?.detail || 'Could not extract worksheet ID from file');
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
    if (!worksheetId || scanFiles.length === 0) return;

    setGrading(true);
    setPhase('grading');
    setResults([]);
    setGradingProgress({ current: 0, total: scanFiles.length });

    // Set up cancellation + queue panel entry first so we have queueId for FormData
    const abortController = new AbortController();
    gradeAbortRef.current = abortController;
    const queueId = addExternalItem({
      label: `Worksheet Scans: ${scanFiles.length} file${scanFiles.length === 1 ? '' : 's'}`,
      toolType: 'Worksheet Scan Grading',
      tabId: tabId || 'worksheet-scan-grader',
      onCancel: () => {
        try { abortController.abort(); } catch { /* ignore */ }
        // Tell the backend to stop processing remaining scan files.
        fetch(`${API_BASE}/api/cancel/${encodeURIComponent(queueId)}`, { method: 'POST' })
          .catch(() => { /* fire and forget */ });
      },
    });
    gradeQueueIdRef.current = queueId;

    const formData = new FormData();
    formData.append('doc_id', worksheetId);
    formData.append('doc_type', 'worksheet');
    formData.append('job_id', queueId);
    scanFiles.forEach(f => formData.append('student_files', f));

    try {
      const response = await fetch(`${API_BASE}/api/smart-grade-stream`, {
        method: 'POST',
        body: formData,
        signal: abortController.signal,
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
                if (event.event === 'complete') {
                  setGradingSummary(event.summary);
                } else if (event.result) {
                  setResults(prev => [...prev, event.result]);
                  setGradingProgress({ current: event.index + 1, total: event.total });
                }
              } catch { /* skip malformed events */ }
            }
          }
        }
      }

      setPhase('review');
      if (gradeQueueIdRef.current) {
        completeExternalItem(gradeQueueIdRef.current, 'completed');
      }
    } catch (err: any) {
      if (abortController.signal.aborted || err?.name === 'AbortError') {
        setPhase('upload-scans');
        // Queue entry was already marked cancelled by cancelGenerating.
      } else {
        setWorksheetIdError(err?.message || 'Grading failed');
        setPhase('upload-scans');
        if (gradeQueueIdRef.current) {
          completeExternalItem(gradeQueueIdRef.current, 'error', err?.message || 'Grading failed');
        }
      }
    } finally {
      setGrading(false);
      gradeAbortRef.current = null;
      gradeQueueIdRef.current = null;
    }
  };

  const classAverage = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length)
    : 0;

  // Get the effective earned score for a question (edited or original)
  const getEarnedScore = (studentIdx: number, qKey: string, originalEarned: number) => {
    return editedScores[studentIdx]?.[qKey] ?? originalEarned;
  };

  // Calculate effective totals for a student (accounting for edits)
  const getEffectiveTotals = (studentIdx: number, r: ScanGradeResult) => {
    let totalEarned = 0;
    let totalMax = 0;
    for (const [qKey, detail] of Object.entries(r.details)) {
      totalEarned += getEarnedScore(studentIdx, qKey, detail.earned);
      totalMax += detail.max;
    }
    const percentage = totalMax > 0 ? Math.round((totalEarned / totalMax) * 1000) / 10 : 0;
    const letterGrade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';
    return { score: totalEarned, totalPoints: totalMax, percentage, letterGrade };
  };

  // Handle score edit for a specific question
  const handleScoreEdit = (studentIdx: number, qKey: string, newEarned: number, maxPts: number) => {
    const clamped = Math.max(0, Math.min(newEarned, maxPts));
    setEditedScores(prev => ({
      ...prev,
      [studentIdx]: {
        ...(prev[studentIdx] || {}),
        [qKey]: clamped
      }
    }));
  };

  // Confirm and save all grades
  const handleConfirmGrades = async () => {
    setConfirming(true);
    try {
      const grades = results.filter(r => !r.error && r.student_id).map((r, idx) => {
        const effective = getEffectiveTotals(idx, r);
        return {
          student_id: r.student_id,
          student_name: r.student_name,
          score: effective.score,
          total_points: effective.totalPoints,
          percentage: effective.percentage,
          letter_grade: effective.letterGrade,
          details: Object.fromEntries(
            Object.entries(r.details).map(([qKey, detail]) => [
              qKey,
              { ...detail, earned: getEarnedScore(results.indexOf(r), qKey, detail.earned) }
            ])
          ),
          instance_id: (r as any).instance_id,
          edited: !!editedScores[results.indexOf(r)],
        };
      });

      const res = await axios.post(`${API_BASE}/api/confirm-grades`, {
        doc_type: 'worksheet',
        doc_id: worksheetId,
        grades
      });
      setConfirmResult(res.data);
      setPhase('confirmed');
    } catch (err: any) {
      alert('Failed to save grades: ' + (err?.message || 'Unknown error'));
    } finally {
      setConfirming(false);
    }
  };

  if (!hasOcr) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <Icon icon={SquareLock01IconData} className="w-7 h-7" style={{ color: '#3b82f6' }} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{t('bulkGrader.ocrUnavailable')}</h3>
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
          <h2 className="text-lg font-semibold text-theme-title">Grade Scanned Worksheets</h2>
          {worksheetInfo && (
            <p className="text-sm text-theme-muted">{worksheetInfo.worksheet_title} - {worksheetInfo.subject}</p>
          )}
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-theme-hover">
          <X className="w-5 h-5 text-theme-muted" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Phase 1: Worksheet ID */}
        {phase === 'worksheet-id' && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <SearchIcon className="w-12 h-12 text-theme-muted mx-auto mb-3" />
              <h3 className="text-lg font-medium text-theme-title">{t('bulkGrader.findAnswerKey')}</h3>
              <p className="text-sm text-theme-muted mt-1">Upload the teacher version or enter the Worksheet ID</p>
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
                    <HeartbeatLoader className="w-4 h-4" /> Extracting Worksheet ID...
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

            {/* Option 2: Manual worksheet ID input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={worksheetId}
                onChange={(e) => setWorksheetId(e.target.value)}
                placeholder="Enter Worksheet ID (e.g. worksheet_1234567890)"
                className="flex-1 px-3 py-2 border border-theme-strong rounded-lg bg-theme-surface text-theme-label text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => lookupWorksheetId(worksheetId)}
                disabled={!worksheetId || lookingUp}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {lookingUp ? <HeartbeatLoader className="w-4 h-4" /> : 'Look Up'}
              </button>
            </div>

            {worksheetIdError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                {worksheetIdError}
              </div>
            )}
          </div>
        )}

        {/* Phase 2: Upload student scans */}
        {phase === 'upload-scans' && (
          <div className="space-y-4">
            {worksheetInfo && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm">
                <span className="font-medium text-blue-800">Answer key loaded:</span>{' '}
                <span className="text-blue-700">{worksheetInfo.worksheet_title}</span>
                <span className="text-blue-500 ml-2 font-mono text-xs">({worksheetId})</span>
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
                Upload photos/scans of student worksheet papers (JPG, PNG)
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
              onClick={() => { setPhase('worksheet-id'); setWorksheetInfo(null); setWorksheetId(''); }}
              className="text-sm text-blue-600 hover:underline"
            >
              Use a different worksheet
            </button>
          </div>
        )}

        {/* Phase 3: Grading in progress */}
        {phase === 'grading' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <HeartbeatLoader className="w-8 h-8 text-blue-600" />
            <p className="text-theme-label font-medium">{t('bulkGrader.gradingScans')}</p>
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

        {/* Phase 4: Review */}
        {phase === 'review' && results.length > 0 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-center">
                <p className="text-2xl font-bold text-blue-700">{results.length}</p>
                <p className="text-xs text-blue-600">Graded</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-center">
                <p className="text-2xl font-bold text-green-700">{classAverage}%</p>
                <p className="text-xs text-green-600">{t('photoTransfer.classAverage')}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-center">
                <p className="text-2xl font-bold text-amber-700">{results.filter(r => !r.error).length}</p>
                <p className="text-xs text-amber-600">Pending Review</p>
              </div>
            </div>

            {gradingSummary && (
              <div className="flex gap-3 text-xs">
                {gradingSummary.qr_graded > 0 && (
                  <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                    {gradingSummary.qr_graded} via QR (instant)
                  </span>
                )}
                {gradingSummary.ocr_graded > 0 && (
                  <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {gradingSummary.ocr_graded} via OCR
                  </span>
                )}
                {gradingSummary.failed > 0 && (
                  <span className="px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                    {gradingSummary.failed} failed
                  </span>
                )}
              </div>
            )}

            <p className="text-sm text-theme-muted">
              Review grades below. Edit scores if needed, then confirm to save to student records.
            </p>

            {/* Individual review cards */}
            {results.map((r, idx) => {
              const effective = getEffectiveTotals(idx, r);
              const isEdited = !!editedScores[idx];
              return (
                <div key={idx} className={`border rounded-lg overflow-hidden ${isEdited ? 'border-amber-400' : 'border-theme-strong'}`}>
                  <button
                    onClick={() => setExpandedResult(expandedResult === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-3 hover:bg-theme-subtle"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-sm font-bold rounded border ${letterColor(effective.letterGrade)}`}>
                        {effective.letterGrade}
                      </span>
                      <div className="text-left">
                        <p className="text-sm font-medium text-theme-label">
                          {r.student_name || r.file_name}
                        </p>
                        {r.student_id && (
                          <p className="text-xs text-theme-hint">
                            ID: {r.student_id}
                            {isEdited && <span className="ml-1 text-amber-600">(edited)</span>}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-theme-label">
                        {effective.score}/{effective.totalPoints} ({effective.percentage}%)
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
                      {(r as any).qr_doc_id_warning && (
                        <div className="p-2 rounded bg-amber-50 border border-amber-200 text-xs text-amber-700 mb-2">
                          {(r as any).qr_doc_id_warning}
                        </div>
                      )}
                      {Object.entries(r.details).map(([qNum, detail]) => {
                        const editedEarned = getEarnedScore(idx, qNum, detail.earned);
                        const isQEdited = editedScores[idx]?.[qNum] !== undefined;
                        return (
                          <div key={qNum} className="flex items-start justify-between text-sm">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {editedEarned === detail.max ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                ) : editedEarned > 0 ? (
                                  <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                )}
                                <span className="text-theme-label">Q{qNum}: {detail.answer || '[no answer]'}</span>
                              </div>
                              {detail.feedback && (
                                <p className="text-xs text-theme-hint ml-6 mt-0.5">{detail.feedback}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleScoreEdit(idx, qNum, editedEarned - 1, detail.max); }}
                                className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-100 text-red-500 text-xs font-bold"
                              >-</button>
                              <span className={`text-xs font-medium min-w-[2.5rem] text-center ${isQEdited ? 'text-amber-600' : 'text-theme-hint'}`}>
                                {editedEarned}/{detail.max}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleScoreEdit(idx, qNum, editedEarned + 1, detail.max); }}
                                className="w-5 h-5 flex items-center justify-center rounded hover:bg-green-100 text-green-500 text-xs font-bold"
                              >+</button>
                            </div>
                          </div>
                        );
                      })}
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
              );
            })}

            <div className="flex gap-2">
              <button
                onClick={() => { setPhase('upload-scans'); setScanFiles([]); setResults([]); setEditedScores({}); }}
                className="flex-1 px-4 py-2 border border-theme-strong rounded-lg text-sm hover:bg-theme-subtle"
              >
                Grade More Scans
              </button>
              <button
                onClick={handleConfirmGrades}
                disabled={confirming || results.filter(r => !r.error && r.student_id).length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-400"
              >
                {confirming ? 'Saving...' : `Confirm & Save ${results.filter(r => !r.error && r.student_id).length} Grades`}
              </button>
            </div>
          </div>
        )}

        {/* Phase 5: Confirmed */}
        {phase === 'confirmed' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <h3 className="text-lg font-semibold text-theme-title">Grades Saved</h3>
            {confirmResult && (
              <div className="text-center space-y-1">
                <p className="text-sm text-theme-label">{confirmResult.saved} grades saved to student records</p>
                {confirmResult.failed > 0 && (
                  <p className="text-sm text-red-600">{confirmResult.failed} failed to save</p>
                )}
                {confirmResult.errors.length > 0 && (
                  <div className="mt-2 text-xs text-red-500 space-y-0.5">
                    {confirmResult.errors.map((e, i) => <p key={i}>{e}</p>)}
                  </div>
                )}
              </div>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorksheetScanGrader;
