import React from 'react';
import { useTranslation } from 'react-i18next';
import { GRADE_LEVELS, SUBJECTS, GradeSubjectMapping } from '../../data/teacherConstants';
import { useSettings } from '../../contexts/SettingsContext';

interface ProfileStepProps {
  name: string;
  gradeSubjects: GradeSubjectMapping;
  mode: 'oak' | 'manual';
  onNameChange: (name: string) => void;
  onGradeToggle: (grade: string) => void;
  onSubjectToggle: (grade: string, subject: string) => void;
  onApplyToAll: (sourceGrade: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const ProfileStep: React.FC<ProfileStepProps> = ({
  name, gradeSubjects, mode,
  onNameChange, onGradeToggle, onSubjectToggle, onApplyToAll,
  onNext, onBack,
}) => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const selectedGrades = Object.keys(gradeSubjects);

  // For the OAK path, the bridge has already populated these from validate_oak.
  const oakSchool = settings.profile.school;
  const oakTerritory = settings.profile.territory;

  return (
    <div className="px-8 py-6">
      <h2 className="text-2xl font-bold mb-1" style={{ color: '#F8E59D' }}>{t('setupWizard.tellAboutYourself')}</h2>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>{t('setupWizard.tailorContent')}</p>

      <div className="space-y-5 max-w-lg mx-auto">
        {/* OAK verified banner - only shown if user activated OAK */}
        {mode === 'oak' && oakSchool && (
          <div
            className="rounded-lg p-3 flex items-start gap-3"
            style={{
              backgroundColor: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.35)',
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(16,185,129,0.25)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#6ee7b7" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-semibold" style={{ color: '#6ee7b7' }}>
                Verified via OAK
              </p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {oakSchool}
                {oakTerritory ? ` - ${oakTerritory}` : ''}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Locked - managed by your license
              </p>
            </div>
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('setupWizard.yourName')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={t('setupWizard.namePlaceholder')}
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-shadow focus:ring-2"
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
            }}
          />
        </div>

        {/* Grade Levels */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('setupWizard.gradeLevels')}</label>
          <div className="flex flex-wrap gap-2">
            {GRADE_LEVELS.map((g) => {
              const selected = selectedGrades.includes(g.value);
              return (
                <button
                  key={g.value}
                  onClick={() => onGradeToggle(g.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: selected ? 'rgba(242,166,49,0.2)' : 'rgba(255,255,255,0.06)',
                    border: `1.5px solid ${selected ? '#F2A631' : 'rgba(255,255,255,0.12)'}`,
                    color: selected ? '#F2A631' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Per-Grade Subject Selection */}
        {selectedGrades.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Subjects per Grade
            </label>
            <div className="space-y-3">
              {GRADE_LEVELS
                .filter(g => selectedGrades.includes(g.value))
                .map((g, idx) => {
                  const subjects = gradeSubjects[g.value] || [];
                  return (
                    <div
                      key={g.value}
                      className="rounded-lg p-3"
                      style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold" style={{ color: '#F2A631' }}>
                          {g.label}
                        </span>
                        {idx === 0 && selectedGrades.length > 1 && (
                          <button
                            onClick={() => onApplyToAll(g.value)}
                            className="text-[10px] px-2 py-0.5 rounded-md transition-all hover:opacity-80"
                            style={{
                              backgroundColor: 'rgba(242,166,49,0.15)',
                              color: '#F2A631',
                              border: '1px solid rgba(242,166,49,0.3)',
                            }}
                          >
                            Apply to all grades
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {SUBJECTS.map((s) => {
                          const active = subjects.includes(s);
                          return (
                            <button
                              key={s}
                              onClick={() => onSubjectToggle(g.value, s)}
                              className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
                              style={{
                                backgroundColor: active ? 'rgba(242,166,49,0.18)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${active ? 'rgba(242,166,49,0.5)' : 'rgba(255,255,255,0.1)'}`,
                                color: active ? '#F8E59D' : 'rgba(255,255,255,0.4)',
                              }}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ color: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: '#F2A631',
            color: '#1D362D',
            boxShadow: '0 4px 16px rgba(242,166,49,0.3)',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProfileStep;
