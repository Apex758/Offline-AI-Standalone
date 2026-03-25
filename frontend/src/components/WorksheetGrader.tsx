import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import CheckmarkCircle01IconData from '@hugeicons/core-free-icons/CheckmarkCircle01Icon';
import CancelCircleIconData from '@hugeicons/core-free-icons/CancelCircleIcon';
import Award01IconData from '@hugeicons/core-free-icons/Award01Icon';
import ReloadIconData from '@hugeicons/core-free-icons/ReloadIcon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import ArrowUp01IconData from '@hugeicons/core-free-icons/ArrowUp01Icon';
import Upload01IconData from '@hugeicons/core-free-icons/Upload01Icon';
import Loading03IconData from '@hugeicons/core-free-icons/Loading03Icon';
import CheckListIconData from '@hugeicons/core-free-icons/CheckListIcon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import Delete02IconData from '@hugeicons/core-free-icons/Delete02Icon';
import AlertCircleIconData from '@hugeicons/core-free-icons/AlertCircleIcon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import { ParsedWorksheet } from '../types/worksheet';
import { useSettings } from '../contexts/SettingsContext';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

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
const ChevronDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowDown01IconData} {...p} />;
const ChevronUp: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowUp01IconData} {...p} />;
const Upload: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Upload01IconData} {...p} />;
const Loader2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Loading03IconData} {...p} />;
const ClipboardCheck: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CheckListIconData} {...p} />;
const FileText: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={File01IconData} {...p} />;
const Trash2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Delete02IconData} {...p} />;
const AlertCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={AlertCircleIconData} {...p} />;
const History: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Clock01IconData} {...p} />;

interface PackageSummary {
  id: string;
  worksheet_title: string;
  subject: string;
  grade_level: string;
  class_name: string;
  randomized: number;
  created_at: string;
  graded: number;
}

interface WorksheetHistoryItem {
  id: string;
  title: string;
  timestamp: string;
  formData: { subject: string; gradeLevel: string; strand?: string; topic?: string };
  parsedWorksheet: ParsedWorksheet | null;
}

interface GradedResult {
  file_name: string;
  student_name: string | null;
  student_id: string | null;
  error: string | null;
  score: number;
  total_points: number;
  percentage: number;
  letter_grade: string;
  details: Record<string, { answer: any; earned: number; max: number; feedback?: string }>;
  unclear: number[];
  saved: boolean;
}

interface WorksheetGraderProps {
  worksheet: ParsedWorksheet | null;
  onClose: () => void;
}

function gradeColorBg(g: string) {
  const m: Record<string, string> = { A: '#059669', B: '#2563eb', C: '#d97706', D: '#ea580c', F: '#dc2626' };
  return m[g] || '#6b7280';
}

type Phase = 'select-source' | 'upload' | 'grading' | 'results';
type SourceType = 'package' | 'history' | 'upload';

const WorksheetGrader: React.FC<WorksheetGraderProps> = ({ worksheet, onClose }) => {
  const { settings } = useSettings();
  const accentColor = settings.tabColors['worksheet-generator'] ?? '#3b82f6';

  const [phase, setPhase] = useState<Phase>('select-source');
  const [packages, setPackages] = useState<PackageSummary[]>([]);
  const [histories, setHistories] = useState<WorksheetHistoryItem[]>([]);

  // Selected answer key source
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [selectedWorksheet, setSelectedWorksheet] = useState<ParsedWorksheet | null>(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Teacher file upload
  const [teacherFile, setTeacherFile] = useState<File | null>(null);
  const [teacherDragging, setTeacherDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const teacherFileRef = useRef<HTMLInputElement>(null);

  // Student files
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [grading, setGrading] = useState(false);
  const [results, setResults] = useState<GradedResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Active tab in source selection
  const [sourceTab, setSourceTab] = useState<SourceType>('package');

  useEffect(() => {
    loadPackages();
    loadHistories();
  }, []);

  const loadPackages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/worksheet-packages`);
      setPackages(res.data);
    } catch (err) {
      console.error('Failed to load packages:', err);
    }
  };

  const loadHistories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/worksheet-history`);
      setHistories(res.data);
    } catch (err) {
      console.error('Failed to load histories:', err);
    }
  };

  // Select from packages (class mode)
  const handleSelectPackage = (pkg: PackageSummary) => {
    setSelectedPackageId(pkg.id);
    setSelectedWorksheet(null);
    setSelectedTitle(pkg.worksheet_title);
    setSelectedSubject(pkg.subject);
    setPhase('upload');
  };

  // Select from history
  const handleSelectHistory = (h: WorksheetHistoryItem) => {
    if (!h.parsedWorksheet) return;
    setSelectedPackageId(null);
    setSelectedWorksheet(h.parsedWorksheet);
    setSelectedTitle(h.title);
    setSelectedSubject(h.formData?.subject || 'General');
    setPhase('upload');
  };

  // Teacher file upload + parse
  const handleTeacherDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setTeacherDragging(false);
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
      // The parse endpoint returns a ParsedQuiz-like structure, adapt it
      const parsed = res.data;
      setSelectedPackageId(null);
      setSelectedWorksheet({
        metadata: parsed.metadata || { title: 'Uploaded Worksheet', subject: 'General', gradeLevel: '', totalQuestions: 0, template: '' },
        questions: parsed.questions || [],
        passage: parsed.passage,
        matchingItems: parsed.matchingItems,
        wordBank: parsed.wordBank,
      });
      setSelectedTitle(parsed.metadata?.title || teacherFile.name);
      setSelectedSubject(parsed.metadata?.subject || 'General');
      setPhase('upload');
    } catch (err: any) {
      setParseError(err?.response?.data?.detail ?? 'Could not parse file. Try an HTML or PDF exported from this app.');
    } finally {
      setParsing(false);
    }
  };

  // Student file handling
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f =>
      f.type.startsWith('image/') || f.type === 'application/pdf'
    );
    setFiles(prev => [...prev, ...dropped]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(f =>
        f.type.startsWith('image/') || f.type === 'application/pdf'
      );
      setFiles(prev => [...prev, ...selected]);
    }
    if (e.target) e.target.value = '';
  };

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  // Grade
  const handleGrade = async () => {
    if (files.length === 0 || (!selectedPackageId && !selectedWorksheet)) return;

    setGrading(true);
    setPhase('grading');
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append('student_files', f));

      if (selectedPackageId) {
        formData.append('package_id', selectedPackageId);
      } else if (selectedWorksheet) {
        formData.append('worksheet_json', JSON.stringify(selectedWorksheet));
        formData.append('worksheet_title', selectedTitle);
        formData.append('worksheet_subject', selectedSubject);
      }

      const res = await axios.post(`${API_BASE}/api/grade-scanned-worksheets`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 600000,
      });

      setResults(res.data);
      setPhase('results');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Grading failed');
      setPhase('upload');
    } finally {
      setGrading(false);
    }
  };

  const successCount = results.filter(r => r.saved).length;
  const errorCount = results.filter(r => r.error).length;

  const resetAll = () => {
    setPhase('select-source');
    setSelectedPackageId(null);
    setSelectedWorksheet(null);
    setSelectedTitle('');
    setSelectedSubject('');
    setFiles([]);
    setResults([]);
    setError(null);
    setTeacherFile(null);
    setParseError(null);
  };

  return (
    <div className="flex flex-col h-full bg-theme-surface">

      {/* Header */}
      <div className="border-b border-theme px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottomColor: `${accentColor}33` }}>
        <div>
          <h2 className="text-xl font-semibold text-theme-heading">Grade Worksheets</h2>
          <p className="text-sm text-theme-hint">
            {phase === 'select-source' && 'Select a worksheet or upload a teacher version'}
            {phase === 'upload' && `Upload scanned papers for: ${selectedTitle}`}
            {phase === 'grading' && 'AI is reading and grading papers...'}
            {phase === 'results' && `${successCount} of ${results.length} graded & saved`}
          </p>
        </div>
        <button onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-theme-hover transition text-theme-muted text-sm font-medium border border-theme">
          <RotateCcw className="w-4 h-4" />
          Back to Worksheet
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {/* ── Phase 1: Select Source ── */}
        {phase === 'select-source' && (
          <div className="max-w-2xl mx-auto">
            {/* Tabs */}
            <div className="flex border-b border-theme mb-4">
              {([
                ['package', ClipboardCheck, 'Class Worksheets'] as const,
                ['history', History, 'Worksheet History'] as const,
                ['upload', Upload, 'Upload Teacher Version'] as const,
              ]).map(([tab, TabIcon, label]) => (
                <button
                  key={tab}
                  onClick={() => setSourceTab(tab)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition ${
                    sourceTab === tab ? 'border-current' : 'border-transparent text-theme-muted hover:text-theme-label'
                  }`}
                  style={sourceTab === tab ? { borderBottomColor: accentColor, color: accentColor } : {}}
                >
                  <TabIcon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Class Worksheets (packages) */}
            {sourceTab === 'package' && (
              <div className="space-y-3">
                {packages.length === 0 ? (
                  <div className="text-center py-10 text-theme-hint">
                    <ClipboardCheck className="w-10 h-10 mx-auto mb-3" style={{ opacity: 0.3 }} />
                    <p className="text-sm">No class worksheet packages yet.</p>
                    <p className="text-xs mt-1">Generate a worksheet using Class Mode to create packages.</p>
                    <p className="text-xs mt-3">Try the <strong>Worksheet History</strong> or <strong>Upload</strong> tab instead.</p>
                  </div>
                ) : (
                  packages.map(pkg => (
                    <button
                      key={pkg.id}
                      onClick={() => handleSelectPackage(pkg)}
                      className="w-full text-left p-4 rounded-xl border border-theme hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-theme-heading group-hover:text-blue-600 transition-colors">{pkg.worksheet_title}</h4>
                          <p className="text-xs text-theme-hint mt-0.5">
                            {pkg.subject} · Grade {pkg.grade_level} · {pkg.class_name}
                            {pkg.randomized ? ' · Randomized' : ''}
                          </p>
                          <p className="text-xs text-theme-hint mt-0.5">
                            {new Date(pkg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        {pkg.graded ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">Graded</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">Ungraded</span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Worksheet History */}
            {sourceTab === 'history' && (
              <div className="space-y-3">
                {histories.length === 0 ? (
                  <div className="text-center py-10 text-theme-hint">
                    <History className="w-10 h-10 mx-auto mb-3" style={{ opacity: 0.3 }} />
                    <p className="text-sm">No saved worksheets found.</p>
                    <p className="text-xs mt-1">Generate and save a worksheet first.</p>
                  </div>
                ) : (
                  histories.filter(h => h.parsedWorksheet).map(h => (
                    <button
                      key={h.id}
                      onClick={() => handleSelectHistory(h)}
                      className="w-full text-left p-4 rounded-xl border border-theme hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-theme-heading group-hover:text-blue-600 transition-colors">{h.title}</h4>
                          <p className="text-xs text-theme-hint mt-0.5">
                            {h.formData?.subject || 'General'} · Grade {h.formData?.gradeLevel || '—'}
                            {h.formData?.topic ? ` · ${h.formData.topic}` : ''}
                          </p>
                          <p className="text-xs text-theme-hint mt-0.5">
                            {new Date(h.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <span className="text-xs text-theme-hint">
                          {h.parsedWorksheet?.questions?.length || 0} questions
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Upload Teacher Version */}
            {sourceTab === 'upload' && (
              <div className="space-y-4">
                <div
                  onDrop={handleTeacherDrop}
                  onDragOver={e => { e.preventDefault(); setTeacherDragging(true); }}
                  onDragLeave={() => setTeacherDragging(false)}
                  onClick={() => teacherFileRef.current?.click()}
                  className="rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors"
                  style={teacherDragging ? { borderColor: accentColor, backgroundColor: `${accentColor}10` } : {}}
                >
                  <Upload className="w-8 h-8 mx-auto mb-3 text-theme-muted" />
                  {teacherFile ? (
                    <div>
                      <p className="text-sm font-medium text-theme-label">{teacherFile.name}</p>
                      <p className="text-xs text-theme-muted mt-1">{(teacherFile.size / 1024).toFixed(1)} KB · click to change</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-theme-label">Drop teacher worksheet here</p>
                      <p className="text-xs text-theme-muted mt-1">HTML or PDF exported from this app</p>
                    </div>
                  )}
                  <input
                    ref={teacherFileRef}
                    type="file"
                    accept=".html,.htm,.pdf,.txt"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) { setTeacherFile(f); setParseError(null); } if (e.target) e.target.value = ''; }}
                  />
                </div>

                {parseError && (
                  <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">{parseError}</div>
                )}

                <button
                  onClick={handleParseTeacherFile}
                  disabled={!teacherFile || parsing}
                  className="w-full py-3 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: accentColor }}
                >
                  {parsing ? <><HeartbeatLoader className="w-4 h-4" />Parsing answer key...</> : 'Load Answer Key'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Phase 2: Upload Student Scans ── */}
        {phase === 'upload' && (
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Source indicator */}
            <div className="p-3 rounded-lg bg-theme-secondary text-sm flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4" style={{ color: accentColor }} />
              <span className="text-theme-body">
                Grading: <strong>{selectedTitle}</strong> · {selectedSubject}
                {selectedPackageId && ' · Class Package'}
              </span>
            </div>

            {/* Drop zone */}
            <div
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onClick={() => fileRef.current?.click()}
              className="rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors"
              style={dragging ? { borderColor: accentColor, backgroundColor: `${accentColor}10` } : {}}
            >
              <Upload className="w-8 h-8 mx-auto mb-3 text-theme-muted" />
              <p className="text-sm font-medium text-theme-label">Drop scanned student papers here</p>
              <p className="text-xs text-theme-muted mt-1">JPG, PNG, or PDF — one file per student</p>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-theme-heading">{files.length} file{files.length !== 1 ? 's' : ''}</span>
                  <button onClick={() => setFiles([])} className="text-xs text-red-500 hover:text-red-600">Clear all</button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-theme-secondary text-sm">
                      <FileText className="w-4 h-4 text-theme-muted shrink-0" />
                      <span className="flex-1 truncate text-theme-body">{f.name}</span>
                      <span className="text-xs text-theme-hint shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                      <button onClick={() => removeFile(i)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded shrink-0">
                        <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={resetAll}
                className="px-4 py-3 rounded-lg border border-theme text-sm font-medium text-theme-body hover:bg-theme-secondary transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleGrade}
                disabled={files.length === 0}
                className="flex-1 py-3 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: accentColor }}
              >
                Grade {files.length} Paper{files.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        {/* ── Phase 3: Grading ── */}
        {phase === 'grading' && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="mb-6">
              <HeartbeatLoader className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-theme-heading mb-2">Reading & Grading Papers</h3>
            <p className="text-sm text-theme-hint">
              The vision model is scanning {files.length} paper{files.length !== 1 ? 's' : ''}.
              This takes ~30 seconds per paper.
            </p>
          </div>
        )}

        {/* ── Phase 4: Results ── */}
        {phase === 'results' && (
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-theme-secondary text-center">
                <div className="text-2xl font-bold text-theme-heading">{results.length}</div>
                <div className="text-xs text-theme-hint">Papers</div>
              </div>
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/10 text-center">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-xs text-green-600">Saved</div>
              </div>
              {errorCount > 0 && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-center">
                  <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                  <div className="text-xs text-red-600">Errors</div>
                </div>
              )}
              <div className="p-3 rounded-xl bg-theme-secondary text-center">
                <div className="text-2xl font-bold text-theme-heading">
                  {results.filter(r => !r.error).length > 0
                    ? Math.round(results.filter(r => !r.error).reduce((s, r) => s + r.percentage, 0) / results.filter(r => !r.error).length)
                    : 0}%
                </div>
                <div className="text-xs text-theme-hint">Class Avg</div>
              </div>
            </div>

            {/* Results table */}
            <div className="border border-theme rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-theme-secondary text-left text-xs uppercase tracking-wider">
                    <th className="px-4 py-2.5 font-semibold text-theme-hint">Student</th>
                    <th className="px-4 py-2.5 font-semibold text-theme-hint">Score</th>
                    <th className="px-4 py-2.5 font-semibold text-theme-hint">%</th>
                    <th className="px-4 py-2.5 font-semibold text-theme-hint">Grade</th>
                    <th className="px-4 py-2.5 font-semibold text-theme-hint">Status</th>
                    <th className="px-4 py-2.5 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <React.Fragment key={i}>
                      <tr
                        className={`border-t border-theme hover:bg-theme-secondary/50 cursor-pointer transition-colors ${r.error ? 'bg-red-50/30 dark:bg-red-900/5' : ''}`}
                        onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-theme-heading">{r.student_name || r.file_name}</div>
                          {r.student_id && <div className="text-xs text-theme-hint">{r.student_id}</div>}
                        </td>
                        <td className="px-4 py-3 text-theme-body">{r.error ? '—' : `${r.score}/${r.total_points}`}</td>
                        <td className="px-4 py-3 text-theme-body">{r.error ? '—' : `${r.percentage}%`}</td>
                        <td className="px-4 py-3">
                          {!r.error && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: gradeColorBg(r.letter_grade) }}>
                              {r.letter_grade}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {r.error ? (
                            <XCircle className="w-4 h-4" style={{ color: '#dc2626' }} />
                          ) : r.saved ? (
                            <CheckCircle className="w-4 h-4" style={{ color: '#059669' }} />
                          ) : (
                            <AlertCircle className="w-4 h-4" style={{ color: '#d97706' }} />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {expandedIdx === i ? <ChevronUp className="w-4 h-4 text-theme-muted" /> : <ChevronDown className="w-4 h-4 text-theme-muted" />}
                        </td>
                      </tr>

                      {expandedIdx === i && (
                        <tr>
                          <td colSpan={6} className="px-4 py-3 bg-theme-secondary/20">
                            {r.error ? (
                              <div className="text-sm text-red-600 dark:text-red-400 p-2">{r.error}</div>
                            ) : (
                              <div className="space-y-1.5">
                                {Object.entries(r.details).map(([qNum, d]) => {
                                  const isUnclear = r.unclear?.includes(Number(qNum));
                                  return (
                                    <div
                                      key={qNum}
                                      className={`flex items-start gap-3 p-2.5 rounded-lg text-xs ${
                                        isUnclear
                                          ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800'
                                          : d.earned === d.max
                                          ? 'bg-green-50 dark:bg-green-900/10'
                                          : d.earned > 0
                                          ? 'bg-amber-50/50 dark:bg-amber-900/5'
                                          : 'bg-red-50 dark:bg-red-900/10'
                                      }`}
                                    >
                                      <span className="font-bold text-theme-heading w-8 shrink-0">Q{qNum}</span>
                                      <span className="flex-1 text-theme-body break-words">
                                        {typeof d.answer === 'object' ? JSON.stringify(d.answer) : String(d.answer ?? '—')}
                                      </span>
                                      <span className={`font-bold shrink-0 ${d.earned === d.max ? 'text-green-600' : d.earned > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                                        {d.earned}/{d.max}
                                      </span>
                                      {isUnclear && <span className="text-amber-600 font-medium shrink-0">Unclear</span>}
                                    </div>
                                  );
                                })}
                                {Object.entries(r.details).some(([, d]) => d.feedback) && (
                                  <div className="mt-2 pt-2 border-t border-theme space-y-1">
                                    <p className="text-xs font-semibold text-theme-hint uppercase tracking-wider">AI Feedback</p>
                                    {Object.entries(r.details)
                                      .filter(([, d]) => d.feedback)
                                      .map(([qNum, d]) => (
                                        <p key={qNum} className="text-xs text-theme-hint">
                                          <span className="font-semibold">Q{qNum}:</span> {d.feedback}
                                        </p>
                                      ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setPhase('upload'); setFiles([]); setResults([]); setError(null); }}
                className="px-4 py-2.5 rounded-lg border border-theme text-sm font-medium text-theme-body hover:bg-theme-secondary transition-colors"
              >
                Grade More Papers
              </button>
              <button
                onClick={resetAll}
                className="px-4 py-2.5 rounded-lg border border-theme text-sm font-medium text-theme-body hover:bg-theme-secondary transition-colors"
              >
                Different Worksheet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorksheetGrader;
