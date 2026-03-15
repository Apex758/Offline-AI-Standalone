import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { getStrands, getELOs, getSCOs } from '../../utils/curriculumHelpers';
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
}

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
}: CurriculumAlignmentFieldsProps) {
  const [scoDropdownOpen, setScoDropdownOpen] = useState(false);
  const scoDropdownRef = useRef<HTMLDivElement>(null);

  const selectedSCOs: string[] = specificOutcomes
    ? specificOutcomes.split('\n').filter(s => s.trim())
    : [];

  const toggleSCO = (sco: string) => {
    const current = selectedSCOs;
    let updated: string[];
    if (current.includes(sco)) {
      updated = current.filter(s => s !== sco);
    } else {
      updated = [...current, sco];
    }
    onSCOsChange(updated.join('\n'));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (scoDropdownRef.current && !scoDropdownRef.current.contains(e.target as Node)) {
        setScoDropdownOpen(false);
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
        </div>
        <select
          value={strand}
          onChange={(e) => {
            onStrandChange(e.target.value);
            onELOChange('');
            onSCOsChange('');
          }}
          className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent"
          style={ringStyle}
        >
          <option value="">Select a strand</option>
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
            const elos = getELOs(subject, gradeLevel, strand);
            return elos.length > 0 ? (
              <select
                value={essentialOutcomes}
                onChange={(e) => {
                  onELOChange(e.target.value);
                  onSCOsChange('');
                }}
                className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent"
                style={ringStyle}
              >
                <option value="">Select an Essential Learning Outcome</option>
                {elos.map((elo, idx) => (
                  <option key={idx} value={elo} title={elo}>
                    {elo.length > 120 ? elo.substring(0, 120) + '...' : elo}
                  </option>
                ))}
              </select>
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
            const scos = getSCOs(subject, gradeLevel, strand, essentialOutcomes);
            return scos.length > 0 ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setScoDropdownOpen(!scoDropdownOpen)}
                  className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent text-left flex items-center justify-between bg-white dark:bg-gray-800"
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
                        {selectedSCOs.length} of {scos.length} selected
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedSCOs.length === scos.length) {
                            onSCOsChange('');
                          } else {
                            onSCOsChange(scos.join('\n'));
                          }
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {selectedSCOs.length === scos.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    {scos.map((sco, idx) => (
                      <label
                        key={idx}
                        className="flex items-start gap-2 px-3 py-2 hover:bg-theme-secondary cursor-pointer border-b border-theme last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSCOs.includes(sco)}
                          onChange={() => toggleSCO(sco)}
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                        />
                        <span className="text-sm text-theme-heading">{sco}</span>
                      </label>
                    ))}
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
              {selectedSCOs.map((sco, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  <span className="max-w-[200px] truncate">{sco}</span>
                  <button
                    type="button"
                    onClick={() => toggleSCO(sco)}
                    className="hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
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
              className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent"
              style={ringStyle}
              placeholder="Enter specific outcomes (one per line)"
            />
          </div>
        </>
      )}
    </div>
  );
}
