import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
import { getStrands, getELOs, getSCOs, getELOsStructured, getSCOsStructured, type OutcomeEntry } from '../../utils/curriculumHelpers';
import { useCurriculum as useCurriculumLoader } from '../../data/curriculumLoader';
import SmartTextArea from '../SmartTextArea';

interface CurriculumAlignmentFieldsProps {
  subject: string;
  gradeLevel: string;
  strand: string;
  essentialOutcomes: string;
  specificOutcomes: string;
  useCurriculum: boolean;
  onStrandChange: (strand: string) => void;
  onELOChange: (elo: string) => void;
  onSCOsChange: (scos: string) => void;
  onToggleCurriculum: () => void;
  accentColor?: string;
  validationErrors?: Record<string, boolean>;
  /** Hide the built-in toggle (when the parent manages it externally) */
  hideToggle?: boolean;
  /** Phase 6: normalized outcome strings that have already been covered in a
   *  taught/saved lesson plan. Matching entries get a "Completed" tag. */
  completedELOs?: Set<string>;
  completedSCOs?: Set<string>;
}

// Normalize outcome text the same way the backend does, for tag matching.
function normalizeOutcome(text: string): string {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

const CompletedBadge: React.FC<{ small?: boolean }> = ({ small }) => (
  <span
    className={`inline-flex items-center gap-0.5 font-semibold rounded ${small ? 'text-[9px] px-1 py-0' : 'text-[10px] px-1.5 py-0.5'} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 ml-1.5 shrink-0`}
    title="You've already covered this outcome in a saved lesson"
  >
    <svg className={`${small ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
    Completed
  </span>
);

export default function CurriculumAlignmentFields({
  subject,
  gradeLevel,
  strand,
  essentialOutcomes,
  specificOutcomes,
  useCurriculum,
  onStrandChange,
  onELOChange,
  onSCOsChange,
  onToggleCurriculum,
  accentColor,
  validationErrors = {},
  hideToggle = false,
  completedELOs,
  completedSCOs,
}: CurriculumAlignmentFieldsProps) {
  const { t } = useTranslation();
  // Load curriculum data for the selected grade + subject
  useCurriculumLoader(gradeLevel, subject);

  const [scoDropdownOpen, setScoDropdownOpen] = useState(false);
  const scoDropdownRef = useRef<HTMLDivElement>(null);
  const [eloDropdownOpen, setEloDropdownOpen] = useState(false);
  const eloDropdownRef = useRef<HTMLDivElement>(null);

  // Use a unique delimiter to separate SCOs, since individual SCO texts may contain newlines
  const SCO_DELIM = '\n---SCO---\n';

  const selectedSCOs: string[] = specificOutcomes
    ? (specificOutcomes.includes(SCO_DELIM)
        ? specificOutcomes.split(SCO_DELIM).filter(s => s.trim())
        : specificOutcomes.split('\n').filter(s => s.trim()))
    : [];

  const scosStructuredAll = getSCOsStructured(subject, gradeLevel, strand, essentialOutcomes);
  const scoIdMap = new Map(scosStructuredAll.map(s => [s.text, s.id]));

  const toggleSCO = (sco: string) => {
    const current = selectedSCOs;
    let updated: string[];
    if (current.includes(sco)) {
      updated = current.filter(s => s !== sco);
    } else {
      updated = [...current, sco];
    }
    onSCOsChange(updated.join(SCO_DELIM));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (scoDropdownRef.current && !scoDropdownRef.current.contains(e.target as Node)) {
        setScoDropdownOpen(false);
      }
      if (eloDropdownRef.current && !eloDropdownRef.current.contains(e.target as Node)) {
        setEloDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ringStyle = accentColor
    ? { '--tw-ring-color': accentColor } as React.CSSProperties
    : undefined;

  if (!subject || !gradeLevel) return null;

  return (
    <div className="space-y-4">
      {/* Strand dropdown with toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-theme-label">
            Strand <span className="text-red-500">*</span>
          </label>
          {!hideToggle && (
            <button
              type="button"
              onClick={onToggleCurriculum}
              className="flex items-center gap-1.5 group"
              title={useCurriculum ? 'Curriculum alignment enabled — click to disable' : 'Curriculum alignment disabled — click to enable'}
            >
              <span className="text-[11px] text-theme-hint group-hover:text-theme-muted transition-colors">
                Align to curriculum
              </span>
              <div className={`relative w-7 h-4 rounded-full transition-colors ${useCurriculum ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${useCurriculum ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
              </div>
            </button>
          )}
        </div>
        <select
          value={strand}
          onChange={(e) => {
            onStrandChange(e.target.value);
            onELOChange('');
            onSCOsChange('');
          }}
          data-validation-error={validationErrors.strand ? 'true' : undefined}
          className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent ${validationErrors.strand ? 'validation-error' : ''}`}
          style={ringStyle}
        >
          <option value="">{t('curriculum.selectStrand')}</option>
          {getStrands(subject, gradeLevel).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Curriculum-aligned mode: ELO dropdown + SCO multi-select */}
      {strand && useCurriculum && (
        <div>
          <label className="block text-sm font-medium text-theme-label mb-2">
            Essential Learning Outcome <span className="text-red-500">*</span>
          </label>
          {(() => {
            const elosStructured = getELOsStructured(subject, gradeLevel, strand);
            return elosStructured.length > 0 ? (
              <div ref={eloDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setEloDropdownOpen(!eloDropdownOpen)}
                  data-validation-error={validationErrors.essentialOutcomes ? 'true' : undefined}
                  className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent text-left flex items-center justify-between bg-white dark:bg-gray-800 ${validationErrors.essentialOutcomes ? 'validation-error' : ''}`}
                  style={ringStyle}
                >
                  <span className={`min-w-0 overflow-hidden ${!essentialOutcomes ? 'text-gray-400' : 'text-theme-heading'}`}>
                    {!essentialOutcomes ? t('curriculum.selectELO') : (() => {
                      const selected = elosStructured.find(e => e.text === essentialOutcomes);
                      return selected ? (
                        <span className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                          {selected.id && <span className="inline-block shrink-0 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{selected.id}</span>}
                          <span className="truncate">{selected.text}</span>
                        </span>
                      ) : essentialOutcomes;
                    })()}
                  </span>
                  <svg className={`w-4 h-4 shrink-0 transition-transform ${eloDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {eloDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 border border-theme-strong rounded-lg bg-white dark:bg-gray-800 shadow-lg max-h-80 overflow-y-auto">
                    <label
                      className="flex items-start gap-2 px-3 py-2 hover:bg-theme-secondary cursor-pointer border-b border-theme"
                      onClick={() => { onELOChange(''); onSCOsChange(''); setEloDropdownOpen(false); }}
                    >
                      <span className="text-sm text-gray-400">{t('curriculum.selectELO')}</span>
                    </label>
                    {elosStructured.map((elo, idx) => {
                      const isDone = completedELOs?.has(normalizeOutcome(elo.text)) ?? false;
                      return (
                        <label
                          key={idx}
                          className="flex items-start gap-2 px-3 py-2 hover:bg-theme-secondary cursor-pointer border-b border-theme last:border-b-0"
                          onClick={() => { onELOChange(elo.text); onSCOsChange(''); setEloDropdownOpen(false); }}
                        >
                          <span className="text-sm text-theme-heading flex-1">
                            {elo.id && <span className="inline-block text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mr-1.5">{elo.id}</span>}
                            {elo.text}
                            {isDone && <CompletedBadge />}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-theme-hint italic px-4 py-2">
                No ELOs found for the selected strand
              </p>
            );
          })()}
        </div>
      )}

      {essentialOutcomes && useCurriculum && (
        <div ref={scoDropdownRef}>
          <label className="block text-sm font-medium text-theme-label mb-2">
            Specific Curriculum Outcomes <span className="text-red-500">*</span>
          </label>
          {(() => {
            const scosStructured = scosStructuredAll;
            const scoTexts = scosStructured.map(s => s.text);
            return scosStructured.length > 0 ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setScoDropdownOpen(!scoDropdownOpen)}
                  data-validation-error={validationErrors.specificOutcomes ? 'true' : undefined}
                  className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent text-left flex items-center justify-between bg-white dark:bg-gray-800 ${validationErrors.specificOutcomes ? 'validation-error' : ''}`}
                  style={ringStyle}
                >
                  <span className={selectedSCOs.length === 0 ? 'text-gray-400' : 'text-theme-heading'}>
                    {selectedSCOs.length === 0
                      ? 'Select Specific Curriculum Outcomes'
                      : `${selectedSCOs.length} outcome${selectedSCOs.length > 1 ? 's' : ''} selected`}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${scoDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {scoDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 border border-theme-strong rounded-lg bg-white dark:bg-gray-800 shadow-lg max-h-80 overflow-y-auto">
                    <div className="p-2 border-b border-theme flex justify-between items-center">
                      <span className="text-xs text-theme-muted font-medium">
                        {selectedSCOs.length} of {scosStructured.length} selected
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedSCOs.length === scosStructured.length) {
                            onSCOsChange('');
                          } else {
                            onSCOsChange(scoTexts.join(SCO_DELIM));
                          }
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {selectedSCOs.length === scosStructured.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    {scosStructured.map((sco, idx) => {
                      const isDone = completedSCOs?.has(normalizeOutcome(sco.text)) ?? false;
                      return (
                        <label
                          key={idx}
                          className="flex items-start gap-2 px-3 py-2 hover:bg-theme-secondary cursor-pointer border-b border-theme last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSCOs.includes(sco.text)}
                            onChange={() => toggleSCO(sco.text)}
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                          />
                          <span className="text-sm text-theme-heading flex-1">
                            {sco.id && <span className="inline-block text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mr-1.5">{sco.id}</span>}
                            {sco.text}
                            {isDone && <CompletedBadge small />}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-theme-hint italic px-4 py-2">
                No SCOs found for the selected ELO
              </p>
            );
          })()}
          {selectedSCOs.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedSCOs.map((sco, idx) => {
                const scoId = scoIdMap?.get(sco);
                return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full"
                >
                  {scoId && <span className="font-mono font-semibold text-[10px] opacity-80">{scoId}</span>}
                  <span className="max-w-[200px] truncate">{sco}</span>
                  <button
                    type="button"
                    onClick={() => toggleSCO(sco)}
                    className="hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Manual mode: plain textareas */}
      {!useCurriculum && (
        <>
          <div>
            <label className="block text-sm font-medium text-theme-label mb-2">
              Essential Learning Outcome <span className="text-red-500">*</span>
            </label>
            <SmartTextArea
              value={essentialOutcomes}
              onChange={(val) => onELOChange(val)}
              rows={4}
              data-validation-error={validationErrors.essentialOutcomes ? 'true' : undefined}
              className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent ${validationErrors.essentialOutcomes ? 'validation-error' : ''}`}
              style={ringStyle}
              placeholder="Enter the broad, overarching learning outcome"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-label mb-2">
              Specific Curriculum Outcomes <span className="text-red-500">*</span>
            </label>
            <SmartTextArea
              value={specificOutcomes}
              onChange={(val) => onSCOsChange(val)}
              rows={5}
              data-validation-error={validationErrors.specificOutcomes ? 'true' : undefined}
              className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent ${validationErrors.specificOutcomes ? 'validation-error' : ''}`}
              style={ringStyle}
              placeholder="Enter specific outcomes (one per line)"
            />
          </div>
        </>
      )}
    </div>
  );
}
