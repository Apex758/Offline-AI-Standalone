import React, { useState } from 'react';
import { FeatureModuleId } from '../../types/feature-disclosure';
import { useSettings, UserProfile } from '../../contexts/SettingsContext';
import { GradeSubjectMapping } from '../../data/teacherConstants';
import WelcomeStep from './WelcomeStep';
import ProfileStep from './ProfileStep';
import FeaturePickerStep from './FeaturePickerStep';
import CompletionStep from './CompletionStep';

const STEPS = ['welcome', 'profile', 'features', 'complete'] as const;
type Step = typeof STEPS[number];

const SetupWizard: React.FC = () => {
  const { settings, completeSetup } = useSettings();

  const [step, setStep] = useState<Step>('welcome');
  const stepIndex = STEPS.indexOf(step);

  // Profile state
  const [name, setName] = useState(settings.profile.displayName || '');
  const [school, setSchool] = useState(settings.profile.school || '');
  const [selectedGrades, setSelectedGrades] = useState<string[]>(
    Object.keys(settings.profile.gradeSubjects || {})
  );
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(() => {
    const gs = settings.profile.gradeSubjects || {};
    const all = new Set<string>();
    Object.values(gs).forEach(subs => subs.forEach(s => all.add(s)));
    return Array.from(all);
  });

  // Feature selection state
  const [selectedModules, setSelectedModules] = useState<FeatureModuleId[]>([]);

  const toggleGrade = (g: string) => {
    setSelectedGrades(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const toggleSubject = (s: string) => {
    setSelectedSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
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

  const handleFinish = () => {
    // Build grade-subject mapping
    const gradeSubjects: GradeSubjectMapping = {};
    for (const g of selectedGrades) {
      gradeSubjects[g] = [...selectedSubjects];
    }

    const profileUpdate: Partial<UserProfile> = {
      displayName: name,
      school,
      gradeSubjects,
      filterContentByProfile: selectedGrades.length > 0 && selectedSubjects.length > 0,
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
        {step === 'welcome' && <WelcomeStep onNext={goNext} />}
        {step === 'profile' && (
          <ProfileStep
            name={name}
            school={school}
            selectedGrades={selectedGrades}
            selectedSubjects={selectedSubjects}
            onNameChange={setName}
            onSchoolChange={setSchool}
            onGradeToggle={toggleGrade}
            onSubjectToggle={toggleSubject}
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
