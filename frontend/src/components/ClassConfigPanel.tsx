import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ClassConfig, fetchClassConfig, saveClassConfig } from '../lib/classConfig';
import { useSettings } from '../contexts/SettingsContext';
import { useTimetable, TimetableSlot } from '../contexts/TimetableContext';
import { getSubjectsForGrade } from '../data/teacherConstants';

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

// ── Timetable-derived subject/duration helpers ───────────────────────────

function calcMinutes(start: string, end: string): number {
  try {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    return (eh * 60 + em) - (sh * 60 + sm);
  } catch {
    return 0;
  }
}

function normalizeGrade(g: string | undefined): string {
  if (!g) return '';
  return String(g).toLowerCase().replace(/^grade\s*/, '').trim();
}

/**
 * Given a className + gradeLevel, return the list of subjects that are valid
 * for this class. Precedence:
 *   1. Timetable wins: if the class has scheduled slots, use those subjects
 *      verbatim. The timetable reflects reality; onboarding was just a first-
 *      day guess and drifts.
 *   2. Onboarding fallback: if not scheduled yet, use the teacher's
 *      onboarding subjects for this grade.
 *   3. If neither is available, return an empty list.
 */
function deriveSubjectsForClass(
  className: string,
  gradeLevel: string | undefined,
  gradeSubjects: Record<string, string[]>,
  slots: TimetableSlot[],
): { subjects: string[]; source: 'timetable' | 'onboarding' | 'none'; slotsForClass: TimetableSlot[] } {
  const gradeKey = normalizeGrade(gradeLevel);

  const slotsForClass = slots.filter(s =>
    (s.class_name || '') === className &&
    (gradeLevel ? normalizeGrade(s.grade_level) === gradeKey : true)
  );
  const timetableSubjects = Array.from(new Set(slotsForClass.map(s => s.subject).filter(Boolean)));

  if (timetableSubjects.length > 0) {
    return { subjects: timetableSubjects, source: 'timetable', slotsForClass };
  }

  const onboardingForGrade = gradeKey ? getSubjectsForGrade(gradeSubjects, gradeKey) : [];
  if (onboardingForGrade.length > 0) {
    return { subjects: onboardingForGrade, source: 'onboarding', slotsForClass: [] };
  }

  return { subjects: [], source: 'none', slotsForClass: [] };
}

interface DerivedDayDuration {
  day: string;
  start: string;
  end: string;
  minutes: number;
  subject: string;
}

/**
 * From the filtered slots for a class (and optionally a subject), build the
 * per-day schedule and pick a "default" duration = most common minutes value.
 */
function deriveDurationsForClass(
  slotsForClass: TimetableSlot[],
  subject: string | undefined,
): { perDay: DerivedDayDuration[]; defaultMinutes: number | null; totalWeeklyMinutes: number } {
  const relevant = subject
    ? slotsForClass.filter(s => s.subject === subject)
    : slotsForClass;

  const perDay: DerivedDayDuration[] = relevant
    .map(s => ({
      day: s.day_of_week,
      start: s.start_time,
      end: s.end_time,
      minutes: calcMinutes(s.start_time, s.end_time),
      subject: s.subject,
    }))
    .filter(d => d.minutes > 0);

  const counts = new Map<number, number>();
  for (const d of perDay) counts.set(d.minutes, (counts.get(d.minutes) || 0) + 1);
  let defaultMinutes: number | null = null;
  let bestCount = -1;
  for (const [mins, n] of counts) {
    if (n > bestCount) { bestCount = n; defaultMinutes = mins; }
  }

  const totalWeeklyMinutes = perDay.reduce((sum, d) => sum + d.minutes, 0);
  return { perDay, defaultMinutes, totalWeeklyMinutes };
}

function minutesToDurationString(mins: number): string {
  return `${mins} minutes`;
}

function formatWeeklyTotal(mins: number): string {
  if (mins <= 0) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m/week`;
  if (m === 0) return `${h}h/week`;
  return `${h}h ${m}m/week`;
}

// ── Presentational subcomponents (module-scope) ──────────────────────────
// IMPORTANT: these MUST live outside ClassConfigPanel's render function.
// Defining them inside the render body creates a new component type on every
// render, causing React to unmount/remount the subtree — which kills input
// focus and scroll position on every keystroke.

const Section: React.FC<{
  title: string;
  desc?: string;
  accentColor: string;
  children: React.ReactNode;
}> = ({ title, desc, accentColor, children }) => (
  <div className="rounded-xl widget-glass p-5">
    <h3
      className="text-sm font-bold uppercase tracking-wider text-theme-heading mb-1"
      style={{ color: accentColor }}
    >
      {title}
    </h3>
    {desc && <p className="text-xs text-theme-muted mb-4">{desc}</p>}
    <div className="space-y-3">{children}</div>
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-xs font-semibold text-theme-label mb-1">{children}</label>
);

const ChipGroup: React.FC<{
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  accentColor: string;
}> = ({ options, selected, onToggle, accentColor }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => {
      const on = selected.includes(opt);
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className="px-3 py-1.5 rounded-full text-xs font-medium border transition"
          style={
            on
              ? { backgroundColor: accentColor, borderColor: accentColor, color: 'white' }
              : { borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }
          }
        >
          {opt}
        </button>
      );
    })}
  </div>
);

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

  // ── Timetable + onboarding derivation ──────────────────────────────
  const { settings } = useSettings();
  const { slots: allSlots } = useTimetable();
  const gradeSubjectsMapping = settings.profile.gradeSubjects || {};

  const { subjects: availableSubjects, source: subjectSource, slotsForClass } = useMemo(
    () => deriveSubjectsForClass(className, gradeLevel, gradeSubjectsMapping, allSlots),
    [className, gradeLevel, gradeSubjectsMapping, allSlots],
  );

  const { perDay, defaultMinutes, totalWeeklyMinutes } = useMemo(
    () => deriveDurationsForClass(slotsForClass, config.subject || undefined),
    [slotsForClass, config.subject],
  );

  // Auto-fill classPeriodDuration from the timetable on first load, if empty.
  const durationPrefillRef = useRef(false);
  useEffect(() => {
    if (loading) return;
    if (durationPrefillRef.current) return;
    if (config.classPeriodDuration) { durationPrefillRef.current = true; return; }
    if (defaultMinutes && defaultMinutes > 0) {
      setConfig(prev => ({ ...prev, classPeriodDuration: minutesToDurationString(defaultMinutes) }));
      durationPrefillRef.current = true;
    }
  }, [loading, defaultMinutes, config.classPeriodDuration]);

  // Changing the subject cascades: wipe strand + outcomes so teachers don't
  // end up with stale curriculum data from a different subject.
  const handleSubjectChange = useCallback((nextSubject: string) => {
    setConfig(prev => ({
      ...prev,
      subject: nextSubject || undefined,
      strand: undefined,
      essentialOutcomes: undefined,
      specificOutcomes: undefined,
    }));
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

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-theme-strong bg-theme-surface text-theme-label text-sm focus:outline-none focus:ring-2';
  const inputStyle = { '--tw-ring-color': accentColor } as any;

  return (
    <div className="space-y-5 pb-24">
      <div className="rounded-xl p-4 border border-dashed" style={{ borderColor: accentColor, backgroundColor: `${accentColor}10` }}>
        <p className="text-sm text-theme-label">
          {t('classConfig.panel.messages.applyPolicy')}
        </p>
      </div>

      {/* Timetable "Meets:" strip — read-only summary of when this class meets */}
      {perDay.length > 0 ? (
        <div className="rounded-xl p-4 border" style={{ borderColor: accentColor, backgroundColor: `${accentColor}08` }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
            Meets
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-theme-label">
            {perDay.map((d, i) => (
              <span key={i} className="px-2 py-1 rounded-md border border-theme-strong">
                {d.day} {d.start}–{d.end} <span className="text-theme-muted">({d.minutes}m)</span>
              </span>
            ))}
          </div>
          {totalWeeklyMinutes > 0 && (
            <div className="text-xs text-theme-muted mt-2">
              Total: {formatWeeklyTotal(totalWeeklyMinutes)}
              {defaultMinutes ? ` • Most common period: ${defaultMinutes}m` : ''}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl p-4 border border-dashed text-sm text-theme-muted" style={{ borderColor: 'var(--color-border)' }}>
          This class isn&apos;t scheduled in your timetable yet. Place it in the Timetable view to auto-derive duration and to scope the subject list.
        </div>
      )}

      <Section accentColor={accentColor} title={t('classConfig.panel.sections.curriculum')} desc={t('classConfig.panel.sections.curriculumDesc')}>
        <div>
          <Label>{t('classConfig.panel.fields.subject')}</Label>
          {availableSubjects.length > 0 ? (
            <>
              <select
                className={inputCls}
                style={inputStyle}
                value={config.subject || ''}
                onChange={e => handleSubjectChange(e.target.value)}
              >
                <option value="">— Select a subject —</option>
                {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <p className="text-[11px] text-theme-muted mt-1">
                {subjectSource === 'timetable'
                  ? 'Scoped to subjects you teach this class in your timetable.'
                  : 'From your onboarding profile. Place this class in the timetable to scope it further.'}
              </p>
            </>
          ) : (
            <>
              <input className={inputCls} style={inputStyle}
                value={config.subject || ''}
                onChange={e => handleSubjectChange(e.target.value)}
                placeholder={t('classConfig.panel.placeholders.subject')} />
              <p className="text-[11px] text-amber-600 mt-1">
                No subjects found for this grade in your onboarding profile or timetable. You can still type one manually.
              </p>
            </>
          )}
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

      <Section accentColor={accentColor} title={t('classConfig.panel.sections.composition')}>
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

      <Section accentColor={accentColor} title={t('classConfig.panel.sections.learnerProfile')} desc={t('classConfig.panel.sections.learnerProfileDesc')}>
        <div>
          <Label>{t('classConfig.panel.fields.learningStyles')}</Label>
          <ChipGroup accentColor={accentColor} options={LEARNING_STYLES} selected={config.learningStyles || []} onToggle={v => toggleInArray('learningStyles', v)} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.learningPreferences')}</Label>
          <ChipGroup accentColor={accentColor} options={LEARNING_PREFERENCES} selected={config.learningPreferences || []} onToggle={v => toggleInArray('learningPreferences', v)} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.multipleIntelligences')}</Label>
          <ChipGroup accentColor={accentColor} options={MULTIPLE_INTELLIGENCES} selected={config.multipleIntelligences || []} onToggle={v => toggleInArray('multipleIntelligences', v)} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.pedagogicalStrategies')}</Label>
          <ChipGroup accentColor={accentColor} options={PEDAGOGICAL_STRATEGIES} selected={config.pedagogicalStrategies || []} onToggle={v => toggleInArray('pedagogicalStrategies', v)} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.teacherNotes')}</Label>
          <textarea className={inputCls} style={inputStyle} rows={2}
            value={config.customLearningStyles || ''}
            onChange={e => update('customLearningStyles', e.target.value)} />
        </div>
      </Section>

      <Section accentColor={accentColor} title={t('classConfig.panel.sections.specialNeeds')} desc={t('classConfig.panel.sections.specialNeedsDesc')}>
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

      <Section accentColor={accentColor} title={t('classConfig.panel.sections.readingLanguage')}>
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

      <Section accentColor={accentColor} title={t('classConfig.panel.sections.assessmentPrefs')} desc={t('classConfig.panel.sections.assessmentPrefsDesc')}>
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
          <ChipGroup accentColor={accentColor} options={QUESTION_TYPES} selected={config.defaultQuestionTypes || []} onToggle={v => toggleInArray('defaultQuestionTypes', v)} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.cognitiveLevels')}</Label>
          <ChipGroup accentColor={accentColor} options={COGNITIVE_LEVELS} selected={config.defaultCognitiveLevels || []} onToggle={v => toggleInArray('defaultCognitiveLevels', v)} />
        </div>
        <div>
          <Label>{t('classConfig.panel.fields.gradingFocus')}</Label>
          <ChipGroup accentColor={accentColor} options={GRADING_FOCUS} selected={config.gradingFocusAreas || []} onToggle={v => toggleInArray('gradingFocusAreas', v)} />
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

      <Section accentColor={accentColor} title={t('classConfig.panel.sections.materials')}>
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

      <Section accentColor={accentColor} title={t('classConfig.panel.sections.pacing')}>
        <div>
          <Label>{t('classConfig.panel.fields.classDuration')}</Label>
          <select className={inputCls} style={inputStyle}
            value={config.classPeriodDuration || ''}
            onChange={e => update('classPeriodDuration', e.target.value || undefined)}>
            <option value="">—</option>
            {/* Ensure the derived default is always available, even if it's not in the static list */}
            {defaultMinutes && !DURATIONS.includes(minutesToDurationString(defaultMinutes)) && (
              <option value={minutesToDurationString(defaultMinutes)}>
                {minutesToDurationString(defaultMinutes)} (from timetable)
              </option>
            )}
            {DURATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          {defaultMinutes && (
            <p className="text-[11px] text-theme-muted mt-1">
              Auto-derived from timetable: <strong>{defaultMinutes} minutes</strong>
              {perDay.length > 1 && new Set(perDay.map(d => d.minutes)).size > 1
                ? ` (varies per day — showing most common)`
                : ''}
              . Override here to use a different default in generators.
            </p>
          )}
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
