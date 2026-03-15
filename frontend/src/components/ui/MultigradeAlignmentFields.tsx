import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { getStrands, getELOs, getSCOs } from '../../utils/curriculumHelpers';

interface MultigradeAlignmentFieldsProps {
  subject: string;
  gradeLevels: string[];
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

export default function MultigradeAlignmentFields({
  subject,
  gradeLevels,
  strand,
  essentialOutcomes,
  specificOutcomes,
  useCurriculum,
  onStrandChange,
  onELOChange,
  onSCOsChange,
  onToggleCurriculum,
  accentColor,
}: MultigradeAlignmentFieldsProps) {
  const [eloDropdownOpen, setEloDropdownOpen] = useState(false);
  const [scoDropdownOpen, setScoDropdownOpen] = useState(false);
  const eloDropdownRef = useRef<HTMLDivElement>(null);
  const scoDropdownRef = useRef<HTMLDivElement>(null);

  const selectedELOs: string[] = essentialOutcomes
    ? essentialOutcomes.split('\n').filter(s => s.trim())
    : [];

  const selectedSCOs: string[] = specificOutcomes
    ? specificOutcomes.split('\n').filter(s => s.trim())
    : [];

  const toggleELO = (elo: string) => {
    let updated: string[];
    if (selectedELOs.includes(elo)) {
      updated = selectedELOs.filter(e => e !== elo);
      // Also remove SCOs that belong to this ELO
      const scosBelongingToElo = new Set<string>();
      gradeLevels.forEach(g => {
        getSCOs(subject, g, strand, elo).forEach(s => scosBelongingToElo.add(s));
      });
      const remainingSCOs = selectedSCOs.filter(s => !scosBelongingToElo.has(s));
      onSCOsChange(remainingSCOs.join('\n'));
    } else {
      updated = [...selectedELOs, elo];
    }
    onELOChange(updated.join('\n'));
  };

  const toggleSCO = (sco: string) => {
    let updated: string[];
    if (selectedSCOs.includes(sco)) {
      updated = selectedSCOs.filter(s => s !== sco);
    } else {
      updated = [...selectedSCOs, sco];
    }
    onSCOsChange(updated.join('\n'));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (eloDropdownRef.current && !eloDropdownRef.current.contains(e.target as Node)) {
        setEloDropdownOpen(false);
      }
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

  if (!subject || gradeLevels.length === 0) return null;

  // Get strands from ALL grade levels (union)
  const allStrands = Array.from(
    new Set(gradeLevels.flatMap(g => getStrands(subject, g)))
  );

  // Get ELOs from ALL grade levels, grouped by grade
  const elosByGrade: { grade: string; elos: string[] }[] = strand
    ? gradeLevels
        .map(g => ({ grade: g, elos: getELOs(subject, g, strand) }))
        .filter(g => g.elos.length > 0)
    : [];
  const allELOs = elosByGrade.flatMap(g => g.elos);

  // Get SCOs from ALL selected ELOs across ALL grade levels
  const allSCOs: string[] = [];
  const seenSCOs = new Set<string>();
  selectedELOs.forEach(elo => {
    gradeLevels.forEach(g => {
      getSCOs(subject, g, strand, elo).forEach(sco => {
        if (!seenSCOs.has(sco)) {
          seenSCOs.add(sco);
          allSCOs.push(sco);
        }
      });
    });
  });

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
          {allStrands.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Curriculum-aligned mode: ELO multi-select + SCO multi-select */}
      {strand && useCurriculum && (
        <div ref={eloDropdownRef}>
          <label className="block text-sm font-medium text-theme-label mb-2">
            Essential Learning Outcomes <span className="text-red-500">*</span>
            <span className="text-[11px] text-theme-hint ml-2 font-normal">
              (select from each grade)
            </span>
          </label>
          {allELOs.length > 0 ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setEloDropdownOpen(!eloDropdownOpen)}
                className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent text-left flex items-center justify-between bg-white dark:bg-gray-800"
                style={ringStyle}
              >
                <span className={selectedELOs.length === 0 ? 'text-gray-400' : 'text-theme-heading'}>
                  {selectedELOs.length === 0
                    ? 'Select Essential Learning Outcomes'
                    : `${selectedELOs.length} outcome${selectedELOs.length > 1 ? 's' : ''} selected`}
                </span>
                <svg className={`w-4 h-4 transition-transform ${eloDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {eloDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 border border-theme-strong rounded-lg bg-white dark:bg-gray-800 shadow-lg max-h-80 overflow-y-auto">
                  <div className="p-2 border-b border-theme flex justify-between items-center">
                    <span className="text-xs text-theme-muted font-medium">
                      {selectedELOs.length} of {allELOs.length} selected
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedELOs.length === allELOs.length) {
                          onELOChange('');
                          onSCOsChange('');
                        } else {
                          onELOChange(allELOs.join('\n'));
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {selectedELOs.length === allELOs.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  {elosByGrade.map(({ grade, elos }) => (
                    <div key={grade}>
                      <div className="px-3 py-1.5 bg-theme-secondary/60 text-xs font-semibold text-theme-muted uppercase tracking-wider border-b border-theme">
                        Grade {grade}
                      </div>
                      {elos.map((elo, idx) => (
                        <label
                          key={`${grade}-${idx}`}
                          className="flex items-start gap-2 px-3 py-2 hover:bg-theme-secondary cursor-pointer border-b border-theme last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedELOs.includes(elo)}
                            onChange={() => toggleELO(elo)}
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                          />
                          <span className="text-sm text-theme-heading">
                            {elo.length > 120 ? elo.substring(0, 120) + '...' : elo}
                          </span>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-theme-hint italic px-4 py-2">
              No ELOs found for the selected strand
            </p>
          )}
          {selectedELOs.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedELOs.map((elo, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-full"
                >
                  <span className="max-w-[200px] truncate">{elo}</span>
                  <button
                    type="button"
                    onClick={() => toggleELO(elo)}
                    className="hover:text-indigo-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedELOs.length > 0 && useCurriculum && (
        <div ref={scoDropdownRef}>
          <label className="block text-sm font-medium text-theme-label mb-2">
            Specific Curriculum Outcomes <span className="text-red-500">*</span>
          </label>
          {allSCOs.length > 0 ? (
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
                      {selectedSCOs.length} of {allSCOs.length} selected
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedSCOs.length === allSCOs.length) {
                          onSCOsChange('');
                        } else {
                          onSCOsChange(allSCOs.join('\n'));
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {selectedSCOs.length === allSCOs.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  {allSCOs.map((sco, idx) => (
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
              No SCOs found for the selected ELOs
            </p>
          )}
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
              Essential Learning Outcomes <span className="text-red-500">*</span>
            </label>
            <textarea
              value={essentialOutcomes}
              onChange={(e) => onELOChange(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent"
              style={ringStyle}
              placeholder="Enter outcomes for each grade level (one per line)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-label mb-2">
              Specific Curriculum Outcomes <span className="text-red-500">*</span>
            </label>
            <textarea
              value={specificOutcomes}
              onChange={(e) => onSCOsChange(e.target.value)}
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
