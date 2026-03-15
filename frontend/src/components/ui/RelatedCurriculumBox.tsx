import React, { useState, useEffect } from 'react';
import { getCurriculumMatches } from '../../utils/curriculumHelpers';

interface CurriculumMatch {
  id: string;
  displayName: string;
  grade: string;
  strand: string;
  route: string;
  essentialOutcomes?: string[];
  summary?: string;
  [key: string]: unknown;
}

interface RelatedCurriculumBoxProps {
  subject: string;
  gradeLevel: string;
  strand: string;
  useCurriculum: boolean;
  essentialOutcomes?: string;
  onOpenCurriculum?: (route: string) => void;
}

export default function RelatedCurriculumBox({
  subject,
  gradeLevel,
  strand,
  useCurriculum,
  essentialOutcomes,
  onOpenCurriculum,
}: RelatedCurriculumBoxProps) {
  const [matches, setMatches] = useState<CurriculumMatch[]>([]);

  useEffect(() => {
    if (!subject || !gradeLevel || !strand) {
      setMatches([]);
      return;
    }
    const results = getCurriculumMatches(subject, gradeLevel, strand);
    setMatches(results.slice(0, 10));
  }, [subject, gradeLevel, strand]);

  const selectedELOs: string[] = essentialOutcomes
    ? essentialOutcomes.split('\n').filter(s => s.trim())
    : [];

  if (!useCurriculum) {
    return (
      <div className="rounded-xl border border-dashed border-theme/40 p-5 bg-theme-surface/30 flex flex-col items-center justify-center text-center h-full">
        <div className="w-8 h-8 rounded-full bg-theme-secondary flex items-center justify-center mb-3">
          <svg className="w-4 h-4 text-theme-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <p className="text-xs text-theme-hint">Curriculum alignment disabled</p>
        <p className="text-[10px] text-theme-hint mt-1">Toggle on to align with curriculum outcomes</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-theme/60 p-5 bg-theme-surface/50 backdrop-blur-sm max-h-56 overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-theme-muted">
          Related Curriculum
        </h4>
        {matches.length > 0 && (
          <span className="text-[10px] font-medium text-theme-hint bg-theme-secondary px-2 py-0.5 rounded-full">
            {matches.length} found
          </span>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5">
        {/* Selected ELO summaries */}
        {selectedELOs.length > 0 && (
          <div className="space-y-2 mb-3">
            {selectedELOs.map((elo, idx) => (
              <div key={idx} className="px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/40">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-1">
                  ELO {selectedELOs.length > 1 ? idx + 1 : ''}
                </p>
                <p className="text-[11px] text-theme-heading leading-relaxed">{elo}</p>
              </div>
            ))}
          </div>
        )}

        {!subject || !gradeLevel || !strand ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-8 h-8 rounded-full bg-theme-secondary flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-theme-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-xs text-theme-hint">
              Select subject, grade, and strand
            </p>
          </div>
        ) : matches.length === 0 && selectedELOs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-xs text-theme-hint">
              No matching curriculum found
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {matches.map((curriculum) => (
              <div
                key={curriculum.id}
                className="group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-theme-secondary/80 cursor-pointer transition-colors"
                tabIndex={0}
                role="button"
                onClick={() => onOpenCurriculum?.(curriculum.route)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') onOpenCurriculum?.(curriculum.route);
                }}
                style={{ outline: 'none' }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-theme-title truncate">
                    {curriculum.displayName}
                  </p>
                  <p className="text-[10px] text-theme-hint mt-1">
                    Grade {curriculum.grade} &middot; {curriculum.strand}
                  </p>
                </div>
                <svg className="w-4 h-4 text-theme-hint opacity-0 group-hover:opacity-100 transition-opacity shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
