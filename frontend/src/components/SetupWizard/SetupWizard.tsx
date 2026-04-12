import React, { useState } from 'react';
import { FeatureModuleId } from '../../types/feature-disclosure';
import { useSettings, UserProfile } from '../../contexts/SettingsContext';
import { GradeSubjectMapping, SUBJECTS } from '../../data/teacherConstants';
import WelcomeStep from './WelcomeStep';
import ProfileStep from './ProfileStep';
import FeaturePickerStep from './FeaturePickerStep';
import CompletionStep from './CompletionStep';

const STEPS = ['welcome', 'profile', 'features', 'complete'] as const;
type Step = typeof STEPS[number];
type SetupMode = 'oak' | 'manual';

const SetupWizard: React.FC = () => {
  const { settings, completeSetup } = useSettings();

  const [step, setStep] = useState<Step>('welcome');
  const [mode, setMode] = useState<SetupMode>('manual');
  const stepIndex = STEPS.indexOf(step);

  // Profile state -- school/territory are NOT collected here anymore.
  // OAK path: LicenseSettingsBridge writes school + territory into settings.profile
  //           automatically after a successful activation.
  // Manual path: school + territory stay blank.
  const [name, setName] = useState(settings.profile.displayName || '');
  const [gradeSubjects, setGradeSubjects] = useState<GradeSubjectMapping>(
    () => settings.profile.gradeSubjects || {}
  );

  // Feature selection state
  const [selectedModules, setSelectedModules] = useState<FeatureModuleId[]>([]);

  const selectedGrades = Object.keys(gradeSubjects);

  const toggleGrade = (g: string) => {
    setGradeSubjects(prev => {
      if (prev[g]) {
        const next = { ...prev };
        delete next[g];
        return next;
      }
      return { ...prev, [g]: [...SUBJECTS] };
    });
  };

  const toggleSubjectForGrade = (grade: string, subject: string) => {
    setGradeSubjects(prev => {
      const current = prev[grade] || [];
      const next = current.includes(subject)
        ? current.filter(s => s !== subject)
        : [...current, subject];
      return { ...prev, [grade]: next };
    });
  };

  const applySubjectsToAll = (sourceGrade: string) => {
    setGradeSubjects(prev => {
      const sourceSubjects = prev[sourceGrade] || [];
      const next = { ...prev };
      for (const g of Object.keys(next)) {
        next[g] = [...sourceSubjects];
      }
      return next;
    });
  };

  const toggleModule = (id: FeatureModuleId) => {
    setSelectedModules(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const applyPreset = (modules: FeatureModuleId[]) => {
    setSelectedModules([...modules]);
  };

  const goNext = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const handleChooseManual = () => {
    setMode('manual');
    goNext();
  };

  const handleOakActivated = () => {
    setMode('oak');
    // LicenseSettingsBridge has already written school + territory into settings.
    goNext();
  };

  const handleFinish = () => {
    const hasAnySubjects = Object.values(gradeSubjects).some(subs => subs.length > 0);

    // Only write the fields this wizard is responsible for. Do NOT touch
    // school/territory/schoolSource -- OAK path already set them via the bridge,
    // manual path leaves them null.
    const profileUpdate: Partial<UserProfile> = {
      displayName: name,
      gradeSubjects,
      filterContentByProfile: selectedGrades.length > 0 && hasAnySubjects,
      setupMode: mode,
    };

    completeSetup(selectedModules, profileUpdate);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} />

      {/* Card */}
      <div
        className="relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#1D362D',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        {/* Step indicator */}
        <div className="flex justify-center gap-2 pt-6 pb-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === stepIndex ? '32px' : '12px',
                backgroundColor: i <= stepIndex ? '#F2A631' : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>

        {/* Step content */}
        {step === 'welcome' && (
          <WelcomeStep
            onChooseManual={handleChooseManual}
            onOakActivated={handleOakActivated}
          />
        )}
        {step === 'profile' && (
          <ProfileStep
            name={name}
            gradeSubjects={gradeSubjects}
            mode={mode}
            onNameChange={setName}
            onGradeToggle={toggleGrade}
            onSubjectToggle={toggleSubjectForGrade}
            onApplyToAll={applySubjectsToAll}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {step === 'features' && (
          <FeaturePickerStep
            selectedModules={selectedModules}
            onToggleModule={toggleModule}
            onApplyPreset={applyPreset}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {step === 'complete' && (
          <CompletionStep
            selectedModules={selectedModules}
            teacherName={name}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
};

export default SetupWizard;
