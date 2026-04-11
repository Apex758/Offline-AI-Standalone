import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ClassConfig, fetchClassConfig, saveClassConfig } from '../lib/classConfig';

interface Props {
  className: string;
  gradeLevel?: string;
  accentColor?: string;
}

const LEARNING_STYLES = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'];
const LEARNING_PREFERENCES = ['Individual', 'Pair', 'Small group', 'Whole class', 'Hands-on', 'Discussion-based'];
const MULTIPLE_INTELLIGENCES = [
  'Linguistic', 'Logical-Mathematical', 'Spatial', 'Bodily-Kinesthetic',
  'Musical', 'Interpersonal', 'Intrapersonal', 'Naturalistic',
];
const PEDAGOGICAL_STRATEGIES = [
  'Direct instruction', 'Inquiry-based', 'Project-based', 'Differentiated',
  'Collaborative', 'Flipped classroom', 'Scaffolded', 'Gamified',
];
const QUESTION_TYPES = ['Multiple Choice', 'True/False', 'Short Answer', 'Fill-in-the-blank', 'Matching', 'Essay'];
const COGNITIVE_LEVELS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
const GRADING_FOCUS = ['Content accuracy', 'Creativity', 'Organization', 'Presentation', 'Critical thinking', 'Collaboration'];
const READING_LEVELS = ['Below grade', 'At grade', 'Above grade', 'Mixed'];
const ASSESSMENT_FORMATS = ['Multiple choice', 'Performance-based', 'Portfolio', 'Project', 'Oral', 'Mixed'];
const PERFORMANCE_LEVELS = ['4-point scale', '5-point scale', 'A-F', 'Pass/Fail', 'Standards-based'];
const DURATIONS = ['30 minutes', '45 minutes', '60 minutes', '75 minutes', '90 minutes', '120 minutes'];

const ClassConfigPanel: React.FC<Props> = ({ className, gradeLevel, accentColor = '#f97316' }) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<ClassConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchClassConfig(className, gradeLevel)
      .then(cfg => { if (!cancelled) setConfig(cfg || {}); })
      .catch(e => { if (!cancelled) setError(e?.message || 'Failed to load'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [className, gradeLevel]);

  const update = useCallback(<K extends keyof ClassConfig>(key: K, value: ClassConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const toggleInArray = useCallback((key: keyof ClassConfig, value: string) => {
    setConfig(prev => {
      const current = (prev[key] as string[] | undefined) || [];
      const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [key]: next as any };
    });
    setSaved(false);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await saveClassConfig(className, gradeLevel, config);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [className, gradeLevel, config]);

  const handleExport = useCallback(() => {
    const payload = {
      _meta: {
        exportedAt: new Date().toISOString(),
        sourceClass: className,
        sourceGrade: gradeLevel || null,
        formatVersion: 1,
      },
      config,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (className || 'class').replace(/[^a-z0-9_-]+/gi, '_');
    const safeGrade = gradeLevel ? `_grade${gradeLevel}` : '';
    a.download = `class-config_${safeName}${safeGrade}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [className, gradeLevel, config]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImportFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-importing the same file
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        // Accept either a raw ClassConfig or the wrapped { config, _meta } shape.
        const incoming: ClassConfig = parsed && typeof parsed === 'object'
          ? (parsed.config && typeof parsed.config === 'object' ? parsed.config : parsed)
          : {};
        if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
          throw new Error('File does not contain a valid class config object');
        }
        setConfig(incoming);
        setSaved(false);
        const sourceClass = parsed?._meta?.sourceClass;
        const sourceGrade = parsed?._meta?.sourceGrade;
        if (sourceClass) {
          const sourceLabel = sourceGrade ? `${sourceClass} (Grade ${sourceGrade})` : sourceClass;
          setImportNotice(t('classConfig.panel.messages.importedFrom', { source: sourceLabel }));
        } else {
          setImportNotice(t('classConfig.panel.messages.importedGeneric'));
        }
        setTimeout(() => setImportNotice(null), 6000);
      } catch (err: any) {
        setError(err?.message || 'Invalid JSON file');
      }
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  }, [t]);

  if (loading) {
    return <div className="text-theme-muted text-sm p-6">{t('classConfig.panel.messages.loading')}</div>;
  }

  const Section: React.FC<{ title: string; desc?: string; children: React.ReactNode }> = ({ title, desc, children }) => (
    <div className="rounded-xl widget-glass p-5">
      <h3 className="text-sm font-bold uppercase tracking-wider text-theme-heading mb-1" style={{ color: accentColor }}>
        {title}
      </h3>
      {desc && <p className="text-xs text-theme-muted mb-4">{desc}</p>}
      <div className="space-y-3">{children}</div>
    </div>
  );

  const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <label className="block text-xs font-semibold text-theme-label mb-1">{children}</label>
  );

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-theme-strong bg-theme-surface text-theme-label text-sm focus:outline-none focus:ring-2';
  const inputStyle = { '--tw-ring-color': accentColor } as any;

  const ChipGroup: React.FC<{ options: string[]; selected: string[]; onToggle: (v: string) => void }> = ({ options, selected, onToggle }) => (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const on = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition"
            style={on
              ? { backgroundColor: accentColor, borderColor: accentColor, color: 'white' }
              : { borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-5 pb-24">
      <div className="rounded-xl p-4 border border-dashed" style={{ borderColor: accentColor, backgroundColor: `${accentColor}10` }}>
        <p className="text-sm text-theme-label">
          {t('classConfig.panel.messages.applyPolicy')}
        </p>
      </div>

      <Section title={t('classConfig.panel.sections.curriculum')} desc={t('classConfig.panel.sections.curriculumDesc')}>
        <div>
          <Label>{t('classConfig.panel.fields.subject')}</Label>
          <input className={inputCls} style={inputStyle}
            value={config.subject || ''}
            onChange={e => update('subject', e.target.value)}
            placeholder={t('classConfig.panel.placeholders.subject')} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.strand')}</Label>
          <input className={inputCls} style={inputStyle}
            value={config.strand || ''}
            onChange={e => update('strand', e.target.value)}
            placeholder={t('classConfig.panel.placeholders.strand')} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.essentialOutcomes')}</Label>
          <textarea className={inputCls} style={inputStyle} rows={3}
            value={config.essentialOutcomes || ''}
            onChange={e => update('essentialOutcomes', e.target.value)} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.specificOutcomes')}</Label>
          <textarea className={inputCls} style={inputStyle} rows={3}
            value={config.specificOutcomes || ''}
            onChange={e => update('specificOutcomes', e.target.value)} />
        </div>
      </Section>

      <Section title={t('classConfig.panel.sections.composition')}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>{t('classConfig.panel.fields.studentCount')}</Label>
            <input type="number" min={0} className={inputCls} style={inputStyle}
              value={config.studentCount ?? ''}
              onChange={e => update('studentCount', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
          <div>
            <Label>{t('classConfig.panel.fields.studentsWithDisabilities')}</Label>
            <input type="number" min={0} className={inputCls} style={inputStyle}
              value={config.studentsWithDisabilitiesCount ?? ''}
              onChange={e => update('studentsWithDisabilitiesCount', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
        </div>
      </Section>

      <Section title={t('classConfig.panel.sections.learnerProfile')} desc={t('classConfig.panel.sections.learnerProfileDesc')}>
        <div>
          <Label>{t('classConfig.panel.fields.learningStyles')}</Label>
          <ChipGroup options={LEARNING_STYLES} selected={config.learningStyles || []} onToggle={v => toggleInArray('learningStyles', v)} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.learningPreferences')}</Label>
          <ChipGroup options={LEARNING_PREFERENCES} selected={config.learningPreferences || []} onToggle={v => toggleInArray('learningPreferences', v)} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.multipleIntelligences')}</Label>
          <ChipGroup options={MULTIPLE_INTELLIGENCES} selected={config.multipleIntelligences || []} onToggle={v => toggleInArray('multipleIntelligences', v)} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.pedagogicalStrategies')}</Label>
          <ChipGroup options={PEDAGOGICAL_STRATEGIES} selected={config.pedagogicalStrategies || []} onToggle={v => toggleInArray('pedagogicalStrategies', v)} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.teacherNotes')}</Label>
          <textarea className={inputCls} style={inputStyle} rows={2}
            value={config.customLearningStyles || ''}
            onChange={e => update('customLearningStyles', e.target.value)} />
        </div>
      </Section>

      <Section title={t('classConfig.panel.sections.specialNeeds')} desc={t('classConfig.panel.sections.specialNeedsDesc')}>
        <label className="flex items-center gap-2 text-sm text-theme-label">
          <input type="checkbox" checked={!!config.hasSpecialNeeds} onChange={e => update('hasSpecialNeeds', e.target.checked)} />
          {t('classConfig.panel.fields.hasSpecialNeeds')}
        </label>
        {config.hasSpecialNeeds && (
          <div>
            <Label>{t('classConfig.panel.fields.accommodationDetails')}</Label>
            <textarea className={inputCls} style={inputStyle} rows={3}
              value={config.specialNeedsDetails || ''}
              onChange={e => update('specialNeedsDetails', e.target.value)}
              placeholder={t('classConfig.panel.placeholders.accommodationDetails')} />
          </div>
        )}
        <div>
          <Label>{t('classConfig.panel.fields.culturallyResponsive')}</Label>
          <textarea className={inputCls} style={inputStyle} rows={2}
            value={config.culturallyResponsiveNotes || ''}
            onChange={e => update('culturallyResponsiveNotes', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm text-theme-label">
            <input type="checkbox" checked={!!config.hasELLStudents} onChange={e => update('hasELLStudents', e.target.checked)} />
            {t('classConfig.panel.fields.ellStudents')}
          </label>
          <label className="flex items-center gap-2 text-sm text-theme-label">
            <input type="checkbox" checked={!!config.hasAdvancedLearners} onChange={e => update('hasAdvancedLearners', e.target.checked)} />
            {t('classConfig.panel.fields.advancedLearners')}
          </label>
        </div>
        {config.hasELLStudents && (
          <div>
            <Label>{t('classConfig.panel.fields.ellPercentage')}</Label>
            <input type="number" min={0} max={100} className={inputCls} style={inputStyle}
              value={config.ellPercentage ?? ''}
              onChange={e => update('ellPercentage', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
        )}
        <div>
          <Label>{t('classConfig.panel.fields.behaviorSupport')}</Label>
          <input className={inputCls} style={inputStyle}
            value={config.behaviorSupportFocus || ''}
            onChange={e => update('behaviorSupportFocus', e.target.value)} />
        </div>
      </Section>

      <Section title={t('classConfig.panel.sections.readingLanguage')}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>{t('classConfig.panel.fields.readingLevel')}</Label>
            <select className={inputCls} style={inputStyle}
              value={config.readingLevel || ''}
              onChange={e => update('readingLevel', e.target.value || undefined)}>
              <option value="">—</option>
              {READING_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <Label>{t('classConfig.panel.fields.primaryLanguage')}</Label>
            <input className={inputCls} style={inputStyle}
              value={config.primaryLanguage || ''}
              onChange={e => update('primaryLanguage', e.target.value)}
              placeholder={t('classConfig.panel.placeholders.primaryLanguage')} />
          </div>
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.bilingualProgram')}</Label>
          <input className={inputCls} style={inputStyle}
            value={config.bilingualProgram || ''}
            onChange={e => update('bilingualProgram', e.target.value)}
            placeholder={t('classConfig.panel.placeholders.bilingualProgram')} />
        </div>
      </Section>

      <Section title={t('classConfig.panel.sections.assessmentPrefs')} desc={t('classConfig.panel.sections.assessmentPrefsDesc')}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>{t('classConfig.panel.fields.assessmentFormat')}</Label>
            <select className={inputCls} style={inputStyle}
              value={config.preferredAssessmentFormat || ''}
              onChange={e => update('preferredAssessmentFormat', e.target.value || undefined)}>
              <option value="">—</option>
              {ASSESSMENT_FORMATS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <Label>{t('classConfig.panel.fields.performanceLevels')}</Label>
            <select className={inputCls} style={inputStyle}
              value={config.performanceLevels || ''}
              onChange={e => update('performanceLevels', e.target.value || undefined)}>
              <option value="">—</option>
              {PERFORMANCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.questionTypes')}</Label>
          <ChipGroup options={QUESTION_TYPES} selected={config.defaultQuestionTypes || []} onToggle={v => toggleInArray('defaultQuestionTypes', v)} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.cognitiveLevels')}</Label>
          <ChipGroup options={COGNITIVE_LEVELS} selected={config.defaultCognitiveLevels || []} onToggle={v => toggleInArray('defaultCognitiveLevels', v)} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.gradingFocus')}</Label>
          <ChipGroup options={GRADING_FOCUS} selected={config.gradingFocusAreas || []} onToggle={v => toggleInArray('gradingFocusAreas', v)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm text-theme-label">
            <input type="checkbox" checked={!!config.includePointValues} onChange={e => update('includePointValues', e.target.checked)} />
            {t('classConfig.panel.fields.includePointValues')}
          </label>
          <div>
            <Label>{t('classConfig.panel.fields.timePerQuestion')}</Label>
            <input type="number" min={0} className={inputCls} style={inputStyle}
              value={config.defaultTimeLimitPerQuestion ?? ''}
              onChange={e => update('defaultTimeLimitPerQuestion', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
        </div>
      </Section>

      <Section title={t('classConfig.panel.sections.materials')}>
        <div>
          <Label>{t('classConfig.panel.fields.availableMaterials')}</Label>
          <textarea className={inputCls} style={inputStyle} rows={3}
            value={config.availableMaterials || ''}
            onChange={e => update('availableMaterials', e.target.value)}
            placeholder={t('classConfig.panel.placeholders.availableMaterials')} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.prerequisiteSkills')}</Label>
          <textarea className={inputCls} style={inputStyle} rows={3}
            value={config.prerequisiteSkills || ''}
            onChange={e => update('prerequisiteSkills', e.target.value)} />
        </div>
      </Section>

      <Section title={t('classConfig.panel.sections.pacing')}>
        <div>
          <Label>{t('classConfig.panel.fields.classDuration')}</Label>
          <select className={inputCls} style={inputStyle}
            value={config.classPeriodDuration || ''}
            onChange={e => update('classPeriodDuration', e.target.value || undefined)}>
            <option value="">—</option>
            {DURATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.additionalInstructions')}</Label>
          <textarea className={inputCls} style={inputStyle} rows={2}
            value={config.additionalInstructions || ''}
            onChange={e => update('additionalInstructions', e.target.value)}
            placeholder={t('classConfig.panel.placeholders.additionalInstructions')} />
        </div>
      </Section>

      {error && (
        <div className="rounded-lg p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}
      {importNotice && (
        <div className="rounded-lg p-3 border text-sm" style={{ borderColor: accentColor, backgroundColor: `${accentColor}10`, color: accentColor }}>
          {importNotice}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportFile}
      />

      <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-theme-bg/95 backdrop-blur border-t border-theme flex items-center gap-3 flex-wrap">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          {saving ? t('classConfig.panel.buttons.saving') : t('classConfig.panel.buttons.save')}
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-lg border text-sm font-semibold transition hover:bg-theme-hover"
          style={{ borderColor: accentColor, color: accentColor }}
          title="Download this class configuration as a JSON file"
        >
          {t('classConfig.panel.buttons.export')}
        </button>
        <button
          onClick={handleImportClick}
          className="px-4 py-2 rounded-lg border text-sm font-semibold transition hover:bg-theme-hover"
          style={{ borderColor: accentColor, color: accentColor }}
          title="Load a class configuration from a JSON file"
        >
          {t('classConfig.panel.buttons.import')}
        </button>
        {saved && <span className="text-emerald-600 text-sm font-medium">{t('classConfig.panel.buttons.saved')}</span>}
      </div>
    </div>
  );
};

export default ClassConfigPanel;
