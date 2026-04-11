/**
 * CrossCurricularTable
 *
 * Renders a ParsedCrossCurricularPlan as inline-editable content (no Edit
 * button, no modal). Matches the UX of the other *Table components.
 *
 * Layout:
 *   - Header metadata (title, theme, primary/integration subjects, grade,
 *     duration, integration model)
 *   - Learning Standards (single editable field)
 *   - Subject Objectives (grouped by subject — one card per subject with
 *     objectives as bullets; subject chips picked up via SUBJECT_COLORS)
 *   - Cross-Curricular Activities (add/remove cards with name, description,
 *     involved-subject chips, duration)
 *   - Materials (name + optional subject tags)
 *   - Assessment Strategies (bullets)
 *   - Differentiation Notes / Reflection Prompts / Key Vocabulary
 *     (optional single-line fields)
 */
import React, { useCallback } from "react";
import type {
  ParsedCrossCurricularPlan,
  SubjectObjective,
  CrossCurricularActivity,
  Material,
} from "../../types/crossCurricular";
import { SUBJECT_COLORS } from "../../types/crossCurricular";
import { InlineText, BulletList } from "../shared/InlineEditPrimitives";

interface Props {
  plan: ParsedCrossCurricularPlan;
  accentColor: string;
  editable?: boolean;
  onChange?: (next: ParsedCrossCurricularPlan) => void;
}

const subjectColor = (subject: string): string =>
  SUBJECT_COLORS[subject] || "#6b7280";

export default function CrossCurricularTable({
  plan,
  accentColor,
  editable = true,
  onChange,
}: Props) {
  const tableBorder = `1px solid ${accentColor}44`;
  const headerBg = `${accentColor}14`;
  const headerText = `${accentColor}dd`;
  const subtleBg = `${accentColor}08`;

  const allSubjects = [
    plan.metadata.primarySubject,
    ...plan.metadata.integrationSubjects,
  ].filter(Boolean);

  const patchMetadata = useCallback(
    (update: Partial<ParsedCrossCurricularPlan["metadata"]>) => {
      if (!onChange) return;
      onChange({ ...plan, metadata: { ...plan.metadata, ...update } });
    },
    [plan, onChange]
  );

  const patchTop = useCallback(
    (update: Partial<ParsedCrossCurricularPlan>) => {
      if (!onChange) return;
      onChange({ ...plan, ...update });
    },
    [plan, onChange]
  );

  // --- Subject objectives helpers ---
  const getObjectivesForSubject = (subject: string) =>
    plan.subjectObjectives
      .filter((o) => o.subject === subject)
      .map((o) => o.objective);

  const setObjectivesForSubject = (subject: string, next: string[]) => {
    if (!onChange) return;
    const others = plan.subjectObjectives.filter((o) => o.subject !== subject);
    const rebuilt: SubjectObjective[] = next.map((text, i) => ({
      id: `obj_${subject}_${Date.now()}_${i}`,
      subject,
      objective: text,
    }));
    onChange({ ...plan, subjectObjectives: [...others, ...rebuilt] });
  };

  // --- Activity helpers ---
  const patchActivity = useCallback(
    (idx: number, update: Partial<CrossCurricularActivity>) => {
      if (!onChange) return;
      const nextActivities = plan.crossCurricularActivities.map((a, i) =>
        i === idx ? { ...a, ...update } : a
      );
      onChange({ ...plan, crossCurricularActivities: nextActivities });
    },
    [plan, onChange]
  );

  const addActivity = useCallback(() => {
    if (!onChange) return;
    const newA: CrossCurricularActivity = {
      id: `act_${Date.now()}_${plan.crossCurricularActivities.length}`,
      name: "",
      description: "",
      subjects: [],
    };
    onChange({
      ...plan,
      crossCurricularActivities: [...plan.crossCurricularActivities, newA],
    });
  }, [plan, onChange]);

  const removeActivity = useCallback(
    (idx: number) => {
      if (!onChange) return;
      onChange({
        ...plan,
        crossCurricularActivities: plan.crossCurricularActivities.filter(
          (_, i) => i !== idx
        ),
      });
    },
    [plan, onChange]
  );

  const toggleActivitySubject = (idx: number, subject: string) => {
    const current = plan.crossCurricularActivities[idx].subjects;
    const next = current.includes(subject)
      ? current.filter((s) => s !== subject)
      : [...current, subject];
    patchActivity(idx, { subjects: next });
  };

  // --- Material helpers ---
  const patchMaterial = useCallback(
    (idx: number, update: Partial<Material>) => {
      if (!onChange) return;
      const nextMaterials = plan.materials.map((m, i) =>
        i === idx ? { ...m, ...update } : m
      );
      onChange({ ...plan, materials: nextMaterials });
    },
    [plan, onChange]
  );

  const addMaterial = useCallback(() => {
    if (!onChange) return;
    const newM: Material = {
      id: `mat_${Date.now()}_${plan.materials.length}`,
      name: "",
      subjects: [],
    };
    onChange({ ...plan, materials: [...plan.materials, newM] });
  }, [plan, onChange]);

  const removeMaterial = useCallback(
    (idx: number) => {
      if (!onChange) return;
      onChange({
        ...plan,
        materials: plan.materials.filter((_, i) => i !== idx),
      });
    },
    [plan, onChange]
  );

  const toggleMaterialSubject = (idx: number, subject: string) => {
    const current = plan.materials[idx].subjects || [];
    const next = current.includes(subject)
      ? current.filter((s) => s !== subject)
      : [...current, subject];
    patchMaterial(idx, { subjects: next });
  };

  return (
    <div
      id="cross-curricular-html-export"
      className="space-y-6 text-theme-primary"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* Title */}
      <h1
        className="text-2xl font-bold text-center mb-2"
        style={{ color: headerText }}
      >
        <InlineText
          value={plan.metadata.title || ""}
          placeholder="(plan title)"
          editable={editable}
          onChange={(v) => patchMetadata({ title: v })}
        />
      </h1>

      {/* Header metadata */}
      <table
        className="w-full border-collapse text-sm"
        style={{ border: tableBorder }}
      >
        <tbody>
          <tr>
            <LabelCell accent={accentColor} label="Theme / Big Idea:" />
            <td colSpan={3} style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.theme || ""}
                placeholder="(driving concept / big idea)"
                editable={editable}
                onChange={(v) => patchMetadata({ theme: v })}
              />
            </td>
          </tr>
          <tr>
            <LabelCell accent={accentColor} label="Primary Subject:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.primarySubject || ""}
                placeholder="(primary subject)"
                editable={editable}
                onChange={(v) => patchMetadata({ primarySubject: v })}
              />
            </td>
            <LabelCell accent={accentColor} label="Integration Model:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.integrationModel || ""}
                placeholder="(parallel / sequential / thematic / etc.)"
                editable={editable}
                onChange={(v) => patchMetadata({ integrationModel: v })}
              />
            </td>
          </tr>
          <tr>
            <LabelCell accent={accentColor} label="Integration Subjects:" />
            <td colSpan={3} style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.integrationSubjects.join(", ")}
                placeholder="(supporting subjects, comma separated)"
                editable={editable}
                onChange={(v) =>
                  patchMetadata({
                    integrationSubjects: v
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </td>
          </tr>
          <tr>
            <LabelCell accent={accentColor} label="Grade:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.gradeLevel || ""}
                placeholder="(grade)"
                editable={editable}
                onChange={(v) => patchMetadata({ gradeLevel: v })}
              />
            </td>
            <LabelCell accent={accentColor} label="Duration:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.duration || ""}
                placeholder="(duration)"
                editable={editable}
                onChange={(v) => patchMetadata({ duration: v })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Subject chip legend */}
      {allSubjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allSubjects.map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ background: subjectColor(s) }}
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Learning Standards */}
      {(plan.learningStandards || editable) && (
        <section
          className="rounded-lg p-4"
          style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
        >
          <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
            Learning Standards
          </div>
          <InlineText
            value={plan.learningStandards || ""}
            placeholder="(curriculum standards being addressed)"
            editable={editable}
            multiline
            onChange={(v) => patchTop({ learningStandards: v })}
            className="block"
          />
        </section>
      )}

      {/* Subject Objectives — grouped by subject */}
      <section
        className="rounded-lg p-4"
        style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
      >
        <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
          Subject Objectives
        </div>
        <div className="space-y-3">
          {allSubjects.map((subject) => (
            <div
              key={subject}
              className="rounded p-3"
              style={{
                background: `${subjectColor(subject)}0d`,
                borderLeft: `4px solid ${subjectColor(subject)}`,
              }}
            >
              <div
                className="text-sm font-semibold mb-2"
                style={{ color: subjectColor(subject) }}
              >
                {subject}
              </div>
              <BulletList
                items={getObjectivesForSubject(subject)}
                editable={editable}
                accentColor={subjectColor(subject)}
                placeholder="(objectives for this subject)"
                onChange={(next) => setObjectivesForSubject(subject, next)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Cross-Curricular Activities */}
      <table
        className="w-full border-collapse text-sm"
        style={{ border: tableBorder }}
      >
        <thead>
          <tr style={{ background: headerBg }}>
            <th
              colSpan={2}
              className="text-left px-3 py-2 font-semibold"
              style={{ border: tableBorder, color: headerText }}
            >
              Cross-Curricular Activities
            </th>
          </tr>
        </thead>
        <tbody>
          {plan.crossCurricularActivities.map((activity, aIdx) => (
            <tr key={activity.id} className="group">
              <td
                style={{
                  border: tableBorder,
                  padding: "0.75rem",
                  verticalAlign: "top",
                  background: subtleBg,
                  width: "28%",
                }}
              >
                <div className="flex items-start gap-2">
                  <InlineText
                    value={activity.name}
                    placeholder="(activity name)"
                    editable={editable}
                    onChange={(v) => patchActivity(aIdx, { name: v })}
                    className="flex-1 font-semibold"
                  />
                  {editable && (
                    <button
                      onClick={() => removeActivity(aIdx)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:text-red-700 px-1 flex-shrink-0"
                      title="Remove activity"
                      type="button"
                    >
                      x
                    </button>
                  )}
                </div>
                {(activity.duration || editable) && (
                  <div className="mt-2 text-xs text-theme-muted flex items-center gap-1">
                    <span>Duration:</span>
                    <InlineText
                      value={activity.duration || ""}
                      placeholder="(e.g. 30 min)"
                      editable={editable}
                      onChange={(v) => patchActivity(aIdx, { duration: v })}
                    />
                  </div>
                )}
                {/* Subject chips toggle */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {allSubjects.map((s) => {
                    const active = activity.subjects.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => editable && toggleActivitySubject(aIdx, s)}
                        disabled={!editable}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium transition"
                        style={{
                          background: active ? subjectColor(s) : `${subjectColor(s)}22`,
                          color: active ? "#fff" : subjectColor(s),
                          border: `1px solid ${subjectColor(s)}66`,
                          cursor: editable ? "pointer" : "default",
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </td>
              <td
                style={{
                  border: tableBorder,
                  padding: "0.75rem",
                  verticalAlign: "top",
                }}
              >
                <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: `${accentColor}aa` }}>
                  Description
                </div>
                <InlineText
                  value={activity.description}
                  placeholder="(what students will do)"
                  editable={editable}
                  multiline
                  onChange={(v) => patchActivity(aIdx, { description: v })}
                  className="block"
                />
              </td>
            </tr>
          ))}
          {editable && (
            <tr>
              <td
                colSpan={2}
                style={{
                  border: tableBorder,
                  padding: "0.5rem 0.75rem",
                  background: subtleBg,
                }}
              >
                <button
                  onClick={addActivity}
                  className="text-xs px-3 py-1 rounded border border-dashed opacity-60 hover:opacity-100 transition"
                  style={{
                    borderColor: `${accentColor}66`,
                    color: `${accentColor}cc`,
                  }}
                  type="button"
                >
                  + add activity
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Materials */}
      <table
        className="w-full border-collapse text-sm"
        style={{ border: tableBorder }}
      >
        <thead>
          <tr style={{ background: headerBg }}>
            <th
              className="text-left px-3 py-2 font-semibold"
              style={{ border: tableBorder, color: headerText }}
            >
              Material
            </th>
            <th
              className="text-left px-3 py-2 font-semibold"
              style={{ border: tableBorder, color: headerText }}
            >
              Subjects
            </th>
          </tr>
        </thead>
        <tbody>
          {plan.materials.map((material, mIdx) => (
            <tr key={material.id} className="group">
              <td
                style={{
                  border: tableBorder,
                  padding: "0.75rem",
                  verticalAlign: "top",
                }}
              >
                <div className="flex items-start gap-2">
                  <InlineText
                    value={material.name}
                    placeholder="(material)"
                    editable={editable}
                    onChange={(v) => patchMaterial(mIdx, { name: v })}
                    className="flex-1"
                  />
                  {editable && (
                    <button
                      onClick={() => removeMaterial(mIdx)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:text-red-700 px-1 flex-shrink-0"
                      title="Remove material"
                      type="button"
                    >
                      x
                    </button>
                  )}
                </div>
              </td>
              <td style={{ border: tableBorder, padding: "0.75rem", verticalAlign: "top" }}>
                <div className="flex flex-wrap gap-1">
                  {allSubjects.map((s) => {
                    const active = (material.subjects || []).includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => editable && toggleMaterialSubject(mIdx, s)}
                        disabled={!editable}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium transition"
                        style={{
                          background: active ? subjectColor(s) : `${subjectColor(s)}22`,
                          color: active ? "#fff" : subjectColor(s),
                          border: `1px solid ${subjectColor(s)}66`,
                          cursor: editable ? "pointer" : "default",
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </td>
            </tr>
          ))}
          {editable && (
            <tr>
              <td
                colSpan={2}
                style={{
                  border: tableBorder,
                  padding: "0.5rem 0.75rem",
                  background: subtleBg,
                }}
              >
                <button
                  onClick={addMaterial}
                  className="text-xs px-3 py-1 rounded border border-dashed opacity-60 hover:opacity-100 transition"
                  style={{
                    borderColor: `${accentColor}66`,
                    color: `${accentColor}cc`,
                  }}
                  type="button"
                >
                  + add material
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Assessment Strategies */}
      <section
        className="rounded-lg p-4"
        style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
      >
        <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
          Assessment Strategies
        </div>
        <BulletList
          items={plan.assessmentStrategies}
          editable={editable}
          accentColor={accentColor}
          placeholder="(how students will be assessed)"
          onChange={(next) => patchTop({ assessmentStrategies: next })}
        />
      </section>

      {/* Differentiation Notes (optional) */}
      {(plan.differentiationNotes || editable) && (
        <section
          className="rounded-lg p-4"
          style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
        >
          <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
            Differentiation Notes
          </div>
          <InlineText
            value={plan.differentiationNotes || ""}
            placeholder="(supports, extensions, accommodations)"
            editable={editable}
            multiline
            onChange={(v) => patchTop({ differentiationNotes: v })}
            className="block"
          />
        </section>
      )}

      {/* Reflection Prompts (optional) */}
      {(plan.reflectionPrompts || editable) && (
        <section
          className="rounded-lg p-4"
          style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
        >
          <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
            Reflection Prompts
          </div>
          <InlineText
            value={plan.reflectionPrompts || ""}
            placeholder="(questions for student reflection)"
            editable={editable}
            multiline
            onChange={(v) => patchTop({ reflectionPrompts: v })}
            className="block"
          />
        </section>
      )}

      {/* Key Vocabulary (optional) */}
      {(plan.keyVocabulary || editable) && (
        <section
          className="rounded-lg p-4"
          style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
        >
          <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
            Key Vocabulary
          </div>
          <InlineText
            value={plan.keyVocabulary || ""}
            placeholder="(terms students should learn)"
            editable={editable}
            multiline
            onChange={(v) => patchTop({ keyVocabulary: v })}
            className="block"
          />
        </section>
      )}
    </div>
  );
}

function LabelCell({ accent, label }: { accent: string; label: string }) {
  return (
    <td
      style={{
        border: `1px solid ${accent}44`,
        background: `${accent}14`,
        padding: "0.5rem 0.75rem",
        fontWeight: 600,
        color: `${accent}dd`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </td>
  );
}
