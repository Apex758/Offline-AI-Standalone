import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import { getCurriculumMatches } from '../../utils/curriculumHelpers';

interface CurriculumMatch {
  id: string;
  displayName: string;
  grade: string;
  subject?: string;
  strand: string;
  route: string;
  essentialOutcomes?: (string | { id: string; text: string })[];
  specificOutcomes?: (string | { id: string; text: string; eloRef?: string })[];
  summary?: string;
  [key: string]: unknown;
}

interface RelatedCurriculumBoxProps {
  subject: string;
  gradeLevel: string;
  strand: string;
  useCurriculum: boolean;
  essentialOutcomes?: string;
  specificOutcomes?: string;
  onOpenCurriculum?: (route: string) => void;
  accentColor?: string;
}

function getOutcomeText(o: string | { text: string; [k: string]: any }): string {
  return typeof o === 'string' ? o : o.text;
}

export default function RelatedCurriculumBox({
  subject,
  gradeLevel,
  strand,
  useCurriculum,
  essentialOutcomes,
  specificOutcomes,
  onOpenCurriculum,
  accentColor,
}: RelatedCurriculumBoxProps) {
  const { t } = useTranslation();
  const [matches, setMatches] = useState<CurriculumMatch[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

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

  const selectedSCOSet = new Set(
    specificOutcomes ? specificOutcomes.split('\n').filter(s => s.trim()) : []
  );

  const accent = accentColor || 'var(--text-accent, #6366f1)';

  if (!useCurriculum) {
    return (
      <div className="rounded-xl border border-dashed border-theme/40 p-5 bg-theme-surface/30 flex flex-col items-center justify-center text-center h-full">
        <div className="w-8 h-8 rounded-full bg-theme-secondary flex items-center justify-center mb-3">
          <svg className="w-4 h-4 text-theme-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <p className="text-xs text-theme-hint">{t('curriculum.alignmentDisabled')}</p>
        <p className="text-[10px] text-theme-hint mt-1">{t('curriculum.toggleAlign')}</p>
      </div>
    );
  }

  if (!subject || !gradeLevel || !strand) {
    return (
      <div className="rounded-xl border border-theme/40 p-5 bg-theme-surface/30 flex flex-col items-center justify-center text-center h-full">
        <div className="w-8 h-8 rounded-full bg-theme-secondary flex items-center justify-center mb-3">
          <svg className="w-4 h-4 text-theme-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p className="text-xs text-theme-hint">{t('curriculum.selectSubjectGradeStrand')}</p>
      </div>
    );
  }

  if (matches.length === 0 && selectedELOs.length === 0) {
    return (
      <div className="rounded-xl border border-theme/40 p-5 bg-theme-surface/30 flex flex-col items-center justify-center text-center h-full">
        <p className="text-xs text-theme-hint">{t('curriculum.noMatchingCurriculum')}</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col h-full"
      style={{
        background: 'var(--bg-secondary, var(--bg-surface))',
        border: `1px solid ${accent}30`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
        style={{
          background: `${accent}10`,
          borderBottom: `1px solid ${accent}25`,
        }}
      >
        <HugeiconsIcon icon={BookOpen01IconData} size={14} style={{ color: accent }} />
        <span
          className="text-xs font-semibold uppercase flex-1"
          style={{ color: accent, letterSpacing: '0.08em' }}
        >
          Curriculum Reference
        </span>
        {matches.length > 0 && (
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: `${accent}15`, color: accent }}
          >
            {matches.length}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-1.5">
        {/* Selected ELO summaries */}
        {selectedELOs.length > 0 && (
          <div className="space-y-1.5 mb-2">
            {selectedELOs.map((elo, idx) => (
              <div
                key={idx}
                className="px-2.5 py-1.5 rounded-lg"
                style={{ background: `${accent}08`, border: `1px solid ${accent}20` }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: accent }}>
                  ELO {selectedELOs.length > 1 ? idx + 1 : ''}
                </p>
                <p className="text-[11px] text-theme-heading leading-relaxed">{elo}</p>
              </div>
            ))}
          </div>
        )}

        {/* Expandable curriculum entries */}
        {matches.map((ref) => {
          const isExpanded = expanded === ref.id;
          const elos = ref.essentialOutcomes || [];
          const allScos = ref.specificOutcomes || [];
          // Only show SCOs that the user has selected, or all if none selected
          const scos = selectedSCOSet.size > 0
            ? allScos.filter(o => selectedSCOSet.has(getOutcomeText(o)))
            : allScos;

          return (
            <div key={ref.id}>
              <button
                onClick={() => setExpanded(isExpanded ? null : ref.id)}
                className="w-full flex items-start gap-2 text-left group rounded-lg px-2 py-1.5 hover:bg-theme-hover transition-colors"
              >
                <HugeiconsIcon
                  icon={isExpanded ? ArrowDown01IconData : ArrowRight01IconData}
                  size={12}
                  className="mt-0.5 flex-shrink-0 text-theme-hint"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                      style={{ background: `${accent}12`, color: accent }}
                    >
                      {ref.grade === 'K' ? 'K' : `G${ref.grade}`}
                    </span>
                    <span className="text-xs font-medium text-theme-title">
                      {ref.subject || subject}
                    </span>
                    <span className="text-[11px] text-theme-muted truncate">
                      {ref.displayName}
                    </span>
                  </div>
                </div>
                {onOpenCurriculum && (
                  <svg
                    className="w-3.5 h-3.5 text-theme-hint opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    onClick={(e) => { e.stopPropagation(); onOpenCurriculum(ref.route); }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </button>

              {isExpanded && (
                <div className="ml-5 mt-1 space-y-1.5 mb-1">
                  {/* Essential Outcome */}
                  {elos.length > 0 && elos[0] && (
                    <p className="text-[11px] leading-relaxed text-theme-label">
                      {getOutcomeText(elos[0])}
                    </p>
                  )}

                  {/* Specific Outcomes */}
                  {scos.length > 0 && (
                    <div className="space-y-0.5">
                      <p
                        className="text-[10px] font-semibold uppercase"
                        style={{ color: `${accent}90`, letterSpacing: '0.06em' }}
                      >
                        Specific Outcomes
                      </p>
                      {scos.slice(0, 5).map((o, i) => (
                        <p
                          key={i}
                          className="text-[11px] leading-relaxed pl-2 text-theme-label"
                          style={{ borderLeft: `2px solid ${accent}35` }}
                        >
                          {getOutcomeText(o)}
                        </p>
                      ))}
                      {scos.length > 5 && (
                        <p className="text-[10px] italic text-theme-hint pl-2">
                          + {scos.length - 5} more outcomes
                        </p>
                      )}
                    </div>
                  )}

                  {/* Open link */}
                  {onOpenCurriculum && (
                    <button
                      className="text-[10px] font-medium mt-1 hover:underline"
                      style={{ color: accent }}
                      onClick={() => onOpenCurriculum(ref.route)}
                    >
                      View full curriculum page
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
