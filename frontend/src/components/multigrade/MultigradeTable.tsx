/**
 * MultigradeTable
 *
 * Renders a ParsedMultigrade plan as inline-editable content (no Edit
 * button, no modal). Matches the UX of OhpcLessonTable / QuizTable /
 * KindergartenTable.
 *
 * Layout:
 *   - Header metadata (title, subject, topic, grades, duration, students)
 *   - Shared objectives (common + grade-specific cards)
 *   - Materials (shared + differentiated-per-grade cards)
 *   - Sections table (each section with common content + grade-specific)
 *   - Assessment strategies (common bullets + grade-specific criteria)
 *   - Differentiation notes (per grade)
 *   - Classroom management (optional)
 *   - Extensions and modifications (optional)
 */
import React, { useCallback } from "react";
import type {
  ParsedMultigrade,
  MultigradeSection,
} from "../../types/multigrade";
import { InlineText, BulletList } from "../shared/InlineEditPrimitives";

interface Props {
  plan: ParsedMultigrade;
  accentColor: string;
  editable?: boolean;
  onChange?: (next: ParsedMultigrade) => void;
}

export default function MultigradeTable({
  plan,
  accentColor,
  editable = true,
  onChange,
}: Props) {
  const tableBorder = `1px solid ${accentColor}44`;
  const headerBg = `${accentColor}14`;
  const headerText = `${accentColor}dd`;
  const subtleBg = `${accentColor}08`;

  const patchMetadata = useCallback(
    (update: Partial<ParsedMultigrade["metadata"]>) => {
      if (!onChange) return;
      onChange({ ...plan, metadata: { ...plan.metadata, ...update } });
    },
    [plan, onChange]
  );

  const patchTop = useCallback(
    (update: Partial<ParsedMultigrade>) => {
      if (!onChange) return;
      onChange({ ...plan, ...update });
    },
    [plan, onChange]
  );

  const patchSection = useCallback(
    (idx: number, update: Partial<MultigradeSection>) => {
      if (!onChange) return;
      const nextSections = plan.sections.map((s, i) =>
        i === idx ? { ...s, ...update } : s
      );
      onChange({ ...plan, sections: nextSections });
    },
    [plan, onChange]
  );

  const addSection = useCallback(() => {
    if (!onChange) return;
    const newSection: MultigradeSection = {
      id: `s_${Date.now()}_${plan.sections.length}`,
      name: "",
      content: "",
      gradeSpecific: plan.metadata.gradeLevels.map((g) => ({ grade: g, content: "" })),
    };
    onChange({ ...plan, sections: [...plan.sections, newSection] });
  }, [plan, onChange]);

  const removeSection = useCallback(
    (idx: number) => {
      if (!onChange) return;
      onChange({
        ...plan,
        sections: plan.sections.filter((_, i) => i !== idx),
      });
    },
    [plan, onChange]
  );

  const patchSectionGradeSpecific = useCallback(
    (sectionIdx: number, grade: string, content: string) => {
      if (!onChange) return;
      const section = plan.sections[sectionIdx];
      const existing = section.gradeSpecific || [];
      const found = existing.find((g) => g.grade === grade);
      const nextGS = found
        ? existing.map((g) => (g.grade === grade ? { ...g, content } : g))
        : [...existing, { grade, content }];
      patchSection(sectionIdx, { gradeSpecific: nextGS });
    },
    [plan, patchSection]
  );

  const patchSharedObjectivesCommon = useCallback(
    (v: string) => {
      if (!onChange) return;
      onChange({
        ...plan,
        sharedObjectives: { ...plan.sharedObjectives, common: v },
      });
    },
    [plan, onChange]
  );

  const patchGradeObjective = useCallback(
    (grade: string, objective: string) => {
      if (!onChange) return;
      const existing = plan.sharedObjectives.gradeSpecific || [];
      const found = existing.find((g) => g.grade === grade);
      const nextGS = found
        ? existing.map((g) => (g.grade === grade ? { ...g, objective } : g))
        : [...existing, { grade, objective }];
      onChange({
        ...plan,
        sharedObjectives: { ...plan.sharedObjectives, gradeSpecific: nextGS },
      });
    },
    [plan, onChange]
  );

  const patchSharedMaterials = useCallback(
    (next: string[]) => {
      if (!onChange) return;
      onChange({
        ...plan,
        materials: { ...plan.materials, shared: next },
      });
    },
    [plan, onChange]
  );

  const patchGradeMaterials = useCallback(
    (grade: string, next: string[]) => {
      if (!onChange) return;
      const existing = plan.materials.differentiated || [];
      const found = existing.find((g) => g.grade === grade);
      const nextDiff = found
        ? existing.map((g) => (g.grade === grade ? { ...g, materials: next } : g))
        : [...existing, { grade, materials: next }];
      onChange({
        ...plan,
        materials: { ...plan.materials, differentiated: nextDiff },
      });
    },
    [plan, onChange]
  );

  const patchAssessmentCommon = useCallback(
    (next: string[]) => {
      if (!onChange) return;
      onChange({
        ...plan,
        assessmentStrategies: { ...plan.assessmentStrategies, common: next },
      });
    },
    [plan, onChange]
  );

  const patchGradeAssessment = useCallback(
    (grade: string, criteria: string) => {
      if (!onChange) return;
      const existing = plan.assessmentStrategies.gradeSpecific || [];
      const found = existing.find((g) => g.grade === grade);
      const nextGS = found
        ? existing.map((g) => (g.grade === grade ? { ...g, criteria } : g))
        : [...existing, { grade, criteria }];
      onChange({
        ...plan,
        assessmentStrategies: { ...plan.assessmentStrategies, gradeSpecific: nextGS },
      });
    },
    [plan, onChange]
  );

  const patchGradeDifferentiation = useCallback(
    (grade: string, notes: string) => {
      if (!onChange) return;
      const existing = plan.differentiationNotes || [];
      const found = existing.find((g) => g.grade === grade);
      const next = found
        ? existing.map((g) => (g.grade === grade ? { ...g, notes } : g))
        : [...existing, { grade, notes }];
      onChange({ ...plan, differentiationNotes: next });
    },
    [plan, onChange]
  );

  const gradeLevels = plan.metadata.gradeLevels;

  const getGradeObjective = (grade: string) =>
    plan.sharedObjectives.gradeSpecific?.find((g) => g.grade === grade)?.objective || "";
  const getGradeMaterials = (grade: string) =>
    plan.materials.differentiated?.find((g) => g.grade === grade)?.materials;
  const getGradeAssessment = (grade: string) =>
    plan.assessmentStrategies.gradeSpecific?.find((g) => g.grade === grade)?.criteria || "";
  const getGradeDifferentiation = (grade: string) =>
    plan.differentiationNotes?.find((g) => g.grade === grade)?.notes || "";
  const getSectionGradeContent = (section: MultigradeSection, grade: string) =>
    section.gradeSpecific?.find((g) => g.grade === grade)?.content || "";

  return (
    <div
      id="multigrade-html-export"
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
            <LabelCell accent={accentColor} label="Topic:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.topic || ""}
                placeholder="(topic)"
                editable={editable}
                onChange={(v) => patchMetadata({ topic: v })}
              />
            </td>
            <LabelCell accent={accentColor} label="Subject:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.subject || ""}
                placeholder="(subject)"
                editable={editable}
                onChange={(v) => patchMetadata({ subject: v })}
              />
            </td>
          </tr>
          <tr>
            <LabelCell accent={accentColor} label="Grades:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.gradeLevels.join(", ")}
                placeholder="(grade levels, comma separated)"
                editable={editable}
                onChange={(v) =>
                  patchMetadata({
                    gradeLevels: v
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
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
          <tr>
            <LabelCell accent={accentColor} label="Students:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.totalStudents || ""}
                placeholder="(# students)"
                editable={editable}
                onChange={(v) => patchMetadata({ totalStudents: v })}
              />
            </td>
            <LabelCell accent={accentColor} label="Date:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.date || ""}
                placeholder="(date)"
                editable={editable}
                onChange={(v) => patchMetadata({ date: v })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Shared Objectives */}
      <section
        className="rounded-lg p-4"
        style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
      >
        <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
          Shared Learning Objectives
        </div>
        <div className="mb-3">
          <div className="text-xs font-semibold mb-1" style={{ color: `${accentColor}aa` }}>
            Common
          </div>
          <InlineText
            value={plan.sharedObjectives.common || ""}
            placeholder="(what all grades share)"
            editable={editable}
            multiline
            onChange={patchSharedObjectivesCommon}
          />
        </div>
        {gradeLevels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gradeLevels.map((grade) => (
              <div key={grade} className="rounded p-2" style={{ background: `${accentColor}0a` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: `${accentColor}aa` }}>
                  Grade {grade}
                </div>
                <InlineText
                  value={getGradeObjective(grade)}
                  placeholder="(grade-specific objective)"
                  editable={editable}
                  multiline
                  onChange={(v) => patchGradeObjective(grade, v)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Materials */}
      <section
        className="rounded-lg p-4"
        style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
      >
        <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
          Materials
        </div>
        <div className="mb-3">
          <div className="text-xs font-semibold mb-1" style={{ color: `${accentColor}aa` }}>
            Shared
          </div>
          <BulletList
            items={plan.materials.shared}
            editable={editable}
            accentColor={accentColor}
            placeholder="(materials shared across grades)"
            onChange={patchSharedMaterials}
          />
        </div>
        {gradeLevels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gradeLevels.map((grade) => (
              <div key={grade} className="rounded p-2" style={{ background: `${accentColor}0a` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: `${accentColor}aa` }}>
                  Grade {grade}
                </div>
                <BulletList
                  items={getGradeMaterials(grade)}
                  editable={editable}
                  accentColor={accentColor}
                  placeholder="(grade-specific materials)"
                  onChange={(next) => patchGradeMaterials(grade, next)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sections */}
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
              Lesson Sections
            </th>
          </tr>
        </thead>
        <tbody>
          {plan.sections.map((section, sIdx) => (
            <tr key={section.id} className="group">
              <td
                style={{
                  border: tableBorder,
                  padding: "0.75rem",
                  verticalAlign: "top",
                  background: subtleBg,
                  width: "24%",
                }}
              >
                <div className="flex items-start gap-2">
                  <InlineText
                    value={section.name}
                    placeholder="(section name)"
                    editable={editable}
                    onChange={(v) => patchSection(sIdx, { name: v })}
                    className="flex-1 font-semibold"
                  />
                  {editable && (
                    <button
                      onClick={() => removeSection(sIdx)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:text-red-700 px-1 flex-shrink-0"
                      title="Remove section"
                      type="button"
                    >
                      x
                    </button>
                  )}
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
                  Common Content
                </div>
                <InlineText
                  value={section.content}
                  placeholder="(content for all grades)"
                  editable={editable}
                  multiline
                  onChange={(v) => patchSection(sIdx, { content: v })}
                  className="block mb-3"
                />
                {gradeLevels.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {gradeLevels.map((grade) => (
                      <div key={grade} className="rounded p-2" style={{ background: `${accentColor}0a` }}>
                        <div className="text-xs font-semibold mb-1" style={{ color: `${accentColor}aa` }}>
                          Grade {grade}
                        </div>
                        <InlineText
                          value={getSectionGradeContent(section, grade)}
                          placeholder="(grade-specific content)"
                          editable={editable}
                          multiline
                          onChange={(v) => patchSectionGradeSpecific(sIdx, grade, v)}
                        />
                      </div>
                    ))}
                  </div>
                )}
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
                  onClick={addSection}
                  className="text-xs px-3 py-1 rounded border border-dashed opacity-60 hover:opacity-100 transition"
                  style={{ borderColor: `${accentColor}66`, color: `${accentColor}cc` }}
                  type="button"
                >
                  + add section
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
        <div className="mb-3">
          <div className="text-xs font-semibold mb-1" style={{ color: `${accentColor}aa` }}>
            Common
          </div>
          <BulletList
            items={plan.assessmentStrategies.common}
            editable={editable}
            accentColor={accentColor}
            placeholder="(common assessment strategies)"
            onChange={patchAssessmentCommon}
          />
        </div>
        {gradeLevels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gradeLevels.map((grade) => (
              <div key={grade} className="rounded p-2" style={{ background: `${accentColor}0a` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: `${accentColor}aa` }}>
                  Grade {grade} Criteria
                </div>
                <InlineText
                  value={getGradeAssessment(grade)}
                  placeholder="(grade-specific assessment criteria)"
                  editable={editable}
                  multiline
                  onChange={(v) => patchGradeAssessment(grade, v)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Differentiation Notes */}
      {gradeLevels.length > 0 && (
        <section
          className="rounded-lg p-4"
          style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
        >
          <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
            Differentiation Notes
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gradeLevels.map((grade) => (
              <div key={grade} className="rounded p-2" style={{ background: `${accentColor}0a` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: `${accentColor}aa` }}>
                  Grade {grade}
                </div>
                <InlineText
                  value={getGradeDifferentiation(grade)}
                  placeholder="(how to adapt for this grade)"
                  editable={editable}
                  multiline
                  onChange={(v) => patchGradeDifferentiation(grade, v)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Classroom Management (optional) */}
      {(plan.classroomManagement || editable) && (
        <section
          className="rounded-lg p-4"
          style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
        >
          <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
            Classroom Management
          </div>
          <InlineText
            value={plan.classroomManagement || ""}
            placeholder="(grouping, transitions, monitoring)"
            editable={editable}
            multiline
            onChange={(v) => patchTop({ classroomManagement: v })}
            className="block"
          />
        </section>
      )}

      {/* Extensions and Modifications (optional) */}
      {(plan.extensionsAndModifications || editable) && (
        <section
          className="rounded-lg p-4"
          style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
        >
          <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
            Extensions &amp; Modifications
          </div>
          <InlineText
            value={plan.extensionsAndModifications || ""}
            placeholder="(extensions for fast finishers, modifications for struggling learners)"
            editable={editable}
            multiline
            onChange={(v) => patchTop({ extensionsAndModifications: v })}
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
