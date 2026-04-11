/**
 * KindergartenTable
 *
 * Renders a ParsedKindergartenPlan as inline-editable content (no Edit
 * button, no modal). Matches the UX of OhpcLessonTable — click any cell
 * to edit, + / x buttons to add and remove rows in arrays.
 */
import React, { useCallback } from "react";
import type {
  ParsedKindergartenPlan,
  KindergartenActivity,
  KindergartenMaterial,
} from "../../types/kindergarten";
import {
  DEVELOPMENTAL_DOMAINS,
  ACTIVITY_TYPE_OPTIONS,
} from "../../types/kindergarten";
import { InlineText, BulletList } from "../shared/InlineEditPrimitives";

interface Props {
  plan: ParsedKindergartenPlan;
  accentColor: string;
  editable?: boolean;
  onChange?: (next: ParsedKindergartenPlan) => void;
}

export default function KindergartenTable({
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
    (update: Partial<ParsedKindergartenPlan["metadata"]>) => {
      if (!onChange) return;
      onChange({ ...plan, metadata: { ...plan.metadata, ...update } });
    },
    [plan, onChange]
  );

  const patchTop = useCallback(
    (update: Partial<ParsedKindergartenPlan>) => {
      if (!onChange) return;
      onChange({ ...plan, ...update });
    },
    [plan, onChange]
  );

  const patchActivity = useCallback(
    (idx: number, update: Partial<KindergartenActivity>) => {
      if (!onChange) return;
      const nextActivities = plan.activities.map((a, i) =>
        i === idx ? { ...a, ...update } : a
      );
      onChange({ ...plan, activities: nextActivities });
    },
    [plan, onChange]
  );

  const addActivity = useCallback(() => {
    if (!onChange) return;
    const newA: KindergartenActivity = {
      id: `a_${Date.now()}_${plan.activities.length}`,
      type: "circle-time",
      name: "",
      description: "",
    };
    onChange({ ...plan, activities: [...plan.activities, newA] });
  }, [plan, onChange]);

  const removeActivity = useCallback(
    (idx: number) => {
      if (!onChange) return;
      onChange({
        ...plan,
        activities: plan.activities.filter((_, i) => i !== idx),
      });
    },
    [plan, onChange]
  );

  const patchMaterial = useCallback(
    (idx: number, update: Partial<KindergartenMaterial>) => {
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
    const newM: KindergartenMaterial = {
      id: `m_${Date.now()}_${plan.materials.length}`,
      name: "",
      ageAppropriate: true,
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

  const toggleDomain = useCallback(
    (domain: string) => {
      if (!onChange) return;
      const active = plan.developmentalDomains.includes(domain);
      const next = active
        ? plan.developmentalDomains.filter((d) => d !== domain)
        : [...plan.developmentalDomains, domain];
      onChange({ ...plan, developmentalDomains: next });
    },
    [plan, onChange]
  );

  return (
    <div
      id="kindergarten-html-export"
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
            <LabelCell accent={accentColor} label="Theme:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.theme || ""}
                placeholder="(lesson theme / topic)"
                editable={editable}
                onChange={(v) => patchMetadata({ theme: v })}
              />
            </td>
            <LabelCell accent={accentColor} label="Curriculum Unit:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.curriculumUnit || ""}
                placeholder="(unit)"
                editable={editable}
                onChange={(v) => patchMetadata({ curriculumUnit: v })}
              />
            </td>
          </tr>
          <tr>
            <LabelCell accent={accentColor} label="Week:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.week || ""}
                placeholder="(week)"
                editable={editable}
                onChange={(v) => patchMetadata({ week: v })}
              />
            </td>
            <LabelCell accent={accentColor} label="Day:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.dayOfWeek || ""}
                placeholder="(day)"
                editable={editable}
                onChange={(v) => patchMetadata({ dayOfWeek: v })}
              />
            </td>
          </tr>
          <tr>
            <LabelCell accent={accentColor} label="Age Group:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.ageGroup || ""}
                placeholder="(age group)"
                editable={editable}
                onChange={(v) => patchMetadata({ ageGroup: v })}
              />
            </td>
            <LabelCell accent={accentColor} label="Students:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.students || ""}
                placeholder="(# students)"
                editable={editable}
                onChange={(v) => patchMetadata({ students: v })}
              />
            </td>
          </tr>
          <tr>
            <LabelCell accent={accentColor} label="Duration:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={plan.metadata.duration || ""}
                placeholder="(minutes)"
                editable={editable}
                onChange={(v) => patchMetadata({ duration: v })}
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

      {/* Learning Objectives */}
      <section
        className="rounded-lg p-4"
        style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
      >
        <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
          Learning Objectives
        </div>
        <BulletList
          items={plan.learningObjectives}
          editable={editable}
          accentColor={accentColor}
          placeholder="(learning objectives)"
          onChange={(next) => patchTop({ learningObjectives: next })}
        />
      </section>

      {/* Developmental Domains */}
      <section
        className="rounded-lg p-4"
        style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
      >
        <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
          Developmental Domains
        </div>
        <div className="flex flex-wrap gap-2">
          {DEVELOPMENTAL_DOMAINS.map((domain) => {
            const active = plan.developmentalDomains.includes(domain);
            return (
              <button
                key={domain}
                type="button"
                onClick={() => editable && toggleDomain(domain)}
                disabled={!editable}
                className="px-3 py-1 rounded-full text-xs font-medium transition"
                style={{
                  background: active ? accentColor : `${accentColor}14`,
                  color: active ? "#fff" : headerText,
                  border: `1px solid ${accentColor}66`,
                  cursor: editable ? "pointer" : "default",
                }}
              >
                {domain}
              </button>
            );
          })}
        </div>
      </section>

      {/* Activities */}
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
              Activities
            </th>
          </tr>
        </thead>
        <tbody>
          {plan.activities.map((activity, aIdx) => (
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
                {editable ? (
                  <select
                    value={activity.type}
                    onChange={(e) => patchActivity(aIdx, { type: e.target.value })}
                    className="mt-2 w-full text-xs px-2 py-0.5 bg-theme-hover rounded border border-theme"
                  >
                    {ACTIVITY_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                ) : (
                  <div className="mt-2 text-xs text-theme-muted">
                    {ACTIVITY_TYPE_OPTIONS.find((o) => o.id === activity.type)?.name || activity.type}
                  </div>
                )}
                {(activity.duration || editable) && (
                  <div className="mt-2 text-xs text-theme-muted flex items-center gap-1">
                    <span>Duration:</span>
                    <InlineText
                      value={activity.duration || ""}
                      placeholder="(e.g. 15 min)"
                      editable={editable}
                      onChange={(v) => patchActivity(aIdx, { duration: v })}
                    />
                  </div>
                )}
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
                  placeholder="(what children will do)"
                  editable={editable}
                  multiline
                  onChange={(v) => patchActivity(aIdx, { description: v })}
                  className="block"
                />
                {(activity.learningGoals || editable) && (
                  <>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1 mt-3" style={{ color: `${accentColor}aa` }}>
                      Learning Goals
                    </div>
                    <InlineText
                      value={activity.learningGoals || ""}
                      placeholder="(what children will learn)"
                      editable={editable}
                      multiline
                      onChange={(v) => patchActivity(aIdx, { learningGoals: v })}
                      className="block"
                    />
                  </>
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
              style={{ border: tableBorder, color: headerText, width: "20%" }}
            >
              Age-Appropriate
            </th>
            <th
              className="text-left px-3 py-2 font-semibold"
              style={{ border: tableBorder, color: headerText }}
            >
              Safety Notes
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
                {editable ? (
                  <label className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={material.ageAppropriate}
                      onChange={(e) => patchMaterial(mIdx, { ageAppropriate: e.target.checked })}
                      className="w-3.5 h-3.5"
                      style={{ accentColor }}
                    />
                    <span>{material.ageAppropriate ? "Yes" : "No"}</span>
                  </label>
                ) : (
                  <span className="text-xs">{material.ageAppropriate ? "Yes" : "No"}</span>
                )}
              </td>
              <td style={{ border: tableBorder, padding: "0.75rem", verticalAlign: "top" }}>
                <InlineText
                  value={material.safetyNotes || ""}
                  placeholder="(safety notes)"
                  editable={editable}
                  multiline
                  onChange={(v) => patchMaterial(mIdx, { safetyNotes: v })}
                />
              </td>
            </tr>
          ))}
          {editable && (
            <tr>
              <td
                colSpan={3}
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

      {/* Assessment Observations */}
      <section
        className="rounded-lg p-4"
        style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
      >
        <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
          Assessment Observations
        </div>
        <BulletList
          items={plan.assessmentObservations}
          editable={editable}
          accentColor={accentColor}
          placeholder="(what to observe during activities)"
          onChange={(next) => patchTop({ assessmentObservations: next })}
        />
      </section>

      {/* Differentiation (optional) */}
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
            placeholder="(how to support different learners)"
            editable={editable}
            multiline
            onChange={(v) => patchTop({ differentiationNotes: v })}
            className="block"
          />
        </section>
      )}

      {/* Prerequisites (optional) */}
      {(plan.prerequisites || editable) && (
        <section
          className="rounded-lg p-4"
          style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
        >
          <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
            Prerequisites
          </div>
          <InlineText
            value={plan.prerequisites || ""}
            placeholder="(what children should already know)"
            editable={editable}
            multiline
            onChange={(v) => patchTop({ prerequisites: v })}
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
