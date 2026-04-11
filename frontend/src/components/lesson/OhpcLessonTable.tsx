/**
 * OhpcLessonTable
 *
 * Renders an OhpcLessonPlan (partial during streaming, complete after) as
 * the three OHPC template tables:
 *   1. Header / Outcomes (Subject | Grade | Duration, Strand | ELO, etc.)
 *   2. Components of the Lesson (8 fixed slots)
 *   3. Teacher's Reflections (blank editable cells, not AI-generated)
 *
 * All cells are click-to-edit (string fields via inline edit, arrays via
 * add/remove bullet lists). Edits propagate via onChange so the parent
 * can persist to localStorage / history.
 *
 * Styling uses the app's theme tokens + an accent color override so the
 * table picks up the tab's theme color for headers and borders.
 */
import React, { useCallback } from "react";
import type {
  OhpcLessonPlan,
  TeacherReflections,
  LessonComponent,
  AssessmentBlock,
  DifferentiationBlock,
  KSVMatrix,
} from "../../types/ohpcLesson";
import {
  LESSON_COMPONENT_SLOTS,
  TEACHER_REFLECTION_PROMPTS,
  EMPTY_TEACHER_REFLECTIONS,
} from "../../types/ohpcLesson";

interface Props {
  lesson: Partial<OhpcLessonPlan> | null;
  reflections?: TeacherReflections;
  accentColor: string;
  editable?: boolean;
  isStreaming?: boolean;
  onChange?: (next: Partial<OhpcLessonPlan>) => void;
  onReflectionsChange?: (next: TeacherReflections) => void;
}

// ---------------------------------------------------------------------------
// Small inline-edit primitives
// ---------------------------------------------------------------------------

function InlineText({
  value,
  placeholder,
  editable,
  multiline,
  onChange,
  className,
}: {
  value: string;
  placeholder: string;
  editable: boolean;
  multiline?: boolean;
  onChange: (v: string) => void;
  className?: string;
}) {
  const base =
    "outline-none w-full rounded px-1 py-0.5 transition " +
    (editable ? "focus:bg-theme-hover hover:bg-theme-hover/50 cursor-text" : "cursor-default");
  const empty = !value || !value.trim();
  if (!editable) {
    return (
      <span className={`${className || ""} ${empty ? "text-theme-muted italic" : ""}`}>
        {empty ? placeholder : value}
      </span>
    );
  }
  if (multiline) {
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        className={`${base} ${className || ""} ${empty ? "text-theme-muted italic" : ""} whitespace-pre-wrap`}
        onBlur={(e) => onChange(e.currentTarget.textContent || "")}
      >
        {empty ? placeholder : value}
      </div>
    );
  }
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      className={`${base} ${className || ""} ${empty ? "text-theme-muted italic" : ""}`}
      onBlur={(e) => onChange(e.currentTarget.textContent || "")}
    >
      {empty ? placeholder : value}
    </span>
  );
}

function BulletList({
  items,
  editable,
  accentColor,
  placeholder,
  onChange,
}: {
  items: string[] | undefined;
  editable: boolean;
  accentColor: string;
  placeholder: string;
  onChange: (next: string[]) => void;
}) {
  const list = items || [];
  const updateAt = (idx: number, v: string) => {
    const next = [...list];
    next[idx] = v;
    onChange(next);
  };
  const removeAt = (idx: number) => {
    const next = list.filter((_, i) => i !== idx);
    onChange(next);
  };
  const addItem = () => onChange([...list, ""]);

  if (list.length === 0 && !editable) {
    return <span className="text-theme-muted italic">{placeholder}</span>;
  }
  return (
    <ul className="space-y-1 list-none m-0 p-0">
      {list.map((it, i) => (
        <li key={i} className="flex items-start gap-2 group">
          <span
            className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          />
          <InlineText
            value={it}
            placeholder="..."
            editable={editable}
            onChange={(v) => updateAt(i, v)}
            className="flex-1 text-sm leading-relaxed"
          />
          {editable && (
            <button
              onClick={() => removeAt(i)}
              className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:text-red-700 px-1"
              title="Remove"
              type="button"
            >
              x
            </button>
          )}
        </li>
      ))}
      {editable && (
        <li>
          <button
            onClick={addItem}
            className="text-xs px-2 py-0.5 rounded border border-dashed opacity-60 hover:opacity-100 transition"
            style={{ borderColor: `${accentColor}66`, color: `${accentColor}cc` }}
            type="button"
          >
            + add
          </button>
        </li>
      )}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function OhpcLessonTable({
  lesson,
  reflections,
  accentColor,
  editable = false,
  isStreaming = false,
  onChange,
  onReflectionsChange,
}: Props) {
  const l: Partial<OhpcLessonPlan> = lesson || {};
  const reflect = reflections || EMPTY_TEACHER_REFLECTIONS;

  const patch = useCallback(
    (update: Partial<OhpcLessonPlan>) => {
      if (!onChange) return;
      onChange({ ...l, ...update });
    },
    [l, onChange]
  );

  const patchComponent = useCallback(
    (key: keyof Pick<OhpcLessonPlan, "introduction_hook" | "time_to_teach" | "time_to_practise" | "time_to_reflect_and_share">, update: Partial<LessonComponent>) => {
      const current = (l[key] as LessonComponent | undefined) || {
        duration_minutes: 0,
        teacher_actions: [],
        student_actions: [],
        talking_points: [],
      };
      patch({ [key]: { ...current, ...update } } as Partial<OhpcLessonPlan>);
    },
    [l, patch]
  );

  const patchKsv = useCallback(
    (update: Partial<KSVMatrix>) => {
      const current: KSVMatrix = l.ksv || { knowledge: [], skills: [], values: [] };
      patch({ ksv: { ...current, ...update } });
    },
    [l, patch]
  );

  const patchAssessment = useCallback(
    (update: Partial<AssessmentBlock>) => {
      const current: AssessmentBlock = l.assessment || {
        strategy: "Observation",
        description: "",
        success_criteria: [],
      };
      patch({ assessment: { ...current, ...update } });
    },
    [l, patch]
  );

  const patchDifferentiation = useCallback(
    (update: Partial<DifferentiationBlock>) => {
      const current: DifferentiationBlock = l.differentiation || {
        support: [],
        extension: [],
        accommodations: [],
      };
      patch({ differentiation: { ...current, ...update } });
    },
    [l, patch]
  );

  const patchReflection = useCallback(
    (key: keyof TeacherReflections, v: string) => {
      if (!onReflectionsChange) return;
      onReflectionsChange({ ...reflect, [key]: v });
    },
    [reflect, onReflectionsChange]
  );

  // Shared table styles
  const tableBorder = `1px solid ${accentColor}44`;
  const headerBg = `${accentColor}14`;
  const headerText = `${accentColor}dd`;

  return (
    <div
      id="lesson-plan-html-export"
      className={`space-y-6 text-theme-primary relative transition-all ${isStreaming ? "ohpc-streaming" : ""}`}
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        ...(isStreaming
          ? {
              padding: "16px",
              borderRadius: "12px",
              boxShadow: `0 0 0 2px ${accentColor}33, 0 0 24px ${accentColor}22`,
              animation: "ohpcPulse 1.8s ease-in-out infinite",
            }
          : {}),
      }}
    >
      {/* Keyframes for streaming pulse (scoped inline via <style>) */}
      {isStreaming && (
        <style>{`
          @keyframes ohpcPulse {
            0%, 100% { box-shadow: 0 0 0 2px ${accentColor}33, 0 0 24px ${accentColor}22; }
            50%      { box-shadow: 0 0 0 2px ${accentColor}66, 0 0 32px ${accentColor}44; }
          }
          .ohpc-streaming td:empty::before,
          .ohpc-streaming td:has(> .text-theme-muted.italic)::after {
            content: '';
          }
          .ohpc-streaming .ohpc-cell-filling {
            background: linear-gradient(90deg, ${accentColor}11 0%, ${accentColor}22 50%, ${accentColor}11 100%);
            background-size: 200% 100%;
            animation: ohpcShimmer 1.4s linear infinite;
          }
          @keyframes ohpcShimmer {
            0%   { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      )}

      {/* Streaming banner */}
      {isStreaming && (
        <div
          className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium"
          style={{ background: `${accentColor}14`, color: headerText }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
          Generating lesson plan — watch the cells fill in as the AI writes...
        </div>
      )}

      {/* ============================================================
          Title
          ============================================================ */}
      <h1
        className="text-2xl font-bold text-center mb-2"
        style={{ color: headerText }}
      >
        Lesson Plan
      </h1>

      {/* ============================================================
          TABLE 1 - Header / Outcomes
          ============================================================ */}
      <table
        className="w-full border-collapse text-sm"
        style={{ border: tableBorder }}
      >
        <tbody>
          <tr>
            <LabelCell accent={accentColor} label="Subject:" />
            <ValueCell>
              <InlineText
                value={l.subject || ""}
                placeholder="(subject)"
                editable={editable}
                onChange={(v) => patch({ subject: v })}
              />
            </ValueCell>
            <LabelCell accent={accentColor} label="Grade:" />
            <ValueCell>
              <InlineText
                value={l.grade || ""}
                placeholder="(grade)"
                editable={editable}
                onChange={(v) => patch({ grade: v })}
              />
            </ValueCell>
            <LabelCell accent={accentColor} label="Duration of Lesson:" />
            <ValueCell>
              <InlineText
                value={l.duration || ""}
                placeholder="(duration)"
                editable={editable}
                onChange={(v) => patch({ duration: v })}
              />
            </ValueCell>
          </tr>
          <tr>
            <LabelCell accent={accentColor} label="Strand:" />
            <ValueCell>
              <InlineText
                value={l.strand || ""}
                placeholder="(strand)"
                editable={editable}
                onChange={(v) => patch({ strand: v })}
              />
            </ValueCell>
            <LabelCell accent={accentColor} label="Essential Learning Outcome:" />
            <td colSpan={3} style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={l.essential_learning_outcome || ""}
                placeholder="(ELO)"
                editable={editable}
                multiline
                onChange={(v) => patch({ essential_learning_outcome: v })}
              />
            </td>
          </tr>
          <tr>
            <td
              colSpan={6}
              style={{ border: tableBorder, padding: "0.5rem 0.75rem", background: headerBg }}
            >
              <div className="font-semibold mb-1" style={{ color: headerText }}>
                General Objective of the Lesson:
              </div>
              <InlineText
                value={l.general_objective || ""}
                placeholder="(general objective)"
                editable={editable}
                multiline
                onChange={(v) => patch({ general_objective: v })}
              />
            </td>
          </tr>
          <tr>
            <td
              colSpan={6}
              style={{ border: tableBorder, padding: "0.5rem 0.75rem", background: headerBg }}
            >
              <div className="font-semibold mb-1" style={{ color: headerText }}>
                Specific Curriculum Outcomes (and focus question, if applicable):
              </div>
              <BulletList
                items={l.specific_curriculum_outcomes}
                editable={editable}
                accentColor={accentColor}
                placeholder="(specific outcomes)"
                onChange={(next) => patch({ specific_curriculum_outcomes: next })}
              />
              {(l.focus_question || editable) && (
                <div className="mt-2 text-xs italic">
                  Focus question:{" "}
                  <InlineText
                    value={l.focus_question || ""}
                    placeholder="(optional focus question)"
                    editable={editable}
                    onChange={(v) => patch({ focus_question: v })}
                  />
                </div>
              )}
            </td>
          </tr>
          {/* K / S / V matrix */}
          <tr>
            <KsvHeader accent={accentColor} label="Knowledge" />
            <KsvHeader accent={accentColor} label="Skills" />
            <KsvHeader accent={accentColor} label="Values" />
          </tr>
          <tr>
            <KsvCell>
              <BulletList
                items={l.ksv?.knowledge}
                editable={editable}
                accentColor={accentColor}
                placeholder="(knowledge)"
                onChange={(next) => patchKsv({ knowledge: next })}
              />
            </KsvCell>
            <KsvCell>
              <BulletList
                items={l.ksv?.skills}
                editable={editable}
                accentColor={accentColor}
                placeholder="(skills)"
                onChange={(next) => patchKsv({ skills: next })}
              />
            </KsvCell>
            <KsvCell>
              <BulletList
                items={l.ksv?.values}
                editable={editable}
                accentColor={accentColor}
                placeholder="(values)"
                onChange={(next) => patchKsv({ values: next })}
              />
            </KsvCell>
          </tr>
        </tbody>
      </table>

      {/* ============================================================
          TABLE 2 - Components of the Lesson
          ============================================================ */}
      <table
        className="w-full border-collapse text-sm"
        style={{ border: tableBorder }}
      >
        <thead>
          <tr style={{ background: headerBg }}>
            <th
              className="text-left px-3 py-2 font-semibold"
              style={{ border: tableBorder, color: headerText, width: "28%" }}
            >
              Components of the Lesson
            </th>
            <th
              className="text-left px-3 py-2 font-semibold"
              style={{ border: tableBorder, color: headerText }}
            >
              Lesson Plan
            </th>
          </tr>
        </thead>
        <tbody>
          {LESSON_COMPONENT_SLOTS.map(({ key, label, expectedRange }) => {
            const comp = l[key] as LessonComponent | undefined;
            return (
              <tr key={key}>
                <td
                  style={{
                    border: tableBorder,
                    padding: "0.75rem",
                    verticalAlign: "top",
                    background: `${accentColor}08`,
                  }}
                >
                  <div className="font-semibold" style={{ color: headerText }}>
                    {label}
                  </div>
                  <div className="text-xs text-theme-muted mt-1">
                    ({comp?.duration_minutes ? `${comp.duration_minutes} min` : expectedRange})
                  </div>
                  {editable && (
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={comp?.duration_minutes ?? ""}
                      onChange={(e) =>
                        patchComponent(key, {
                          duration_minutes: Number(e.target.value) || 0,
                        })
                      }
                      className="mt-1 w-16 text-xs px-1 py-0.5 bg-theme-hover rounded border border-theme"
                      placeholder="min"
                    />
                  )}
                </td>
                <td style={{ border: tableBorder, padding: "0.75rem", verticalAlign: "top" }}>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: `${accentColor}aa` }}>
                        Teacher
                      </div>
                      <BulletList
                        items={comp?.teacher_actions}
                        editable={editable}
                        accentColor={accentColor}
                        placeholder="(teacher actions)"
                        onChange={(next) => patchComponent(key, { teacher_actions: next })}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: `${accentColor}aa` }}>
                        Students
                      </div>
                      <BulletList
                        items={comp?.student_actions}
                        editable={editable}
                        accentColor={accentColor}
                        placeholder="(student actions)"
                        onChange={(next) => patchComponent(key, { student_actions: next })}
                      />
                    </div>
                    {((comp?.talking_points?.length ?? 0) > 0 || editable) && (
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: `${accentColor}aa` }}>
                          Talking Points
                        </div>
                        <BulletList
                          items={comp?.talking_points}
                          editable={editable}
                          accentColor={accentColor}
                          placeholder="(talking points)"
                          onChange={(next) => patchComponent(key, { talking_points: next })}
                        />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}

          {/* Assessment */}
          <tr>
            <td style={{ border: tableBorder, padding: "0.75rem", verticalAlign: "top", background: `${accentColor}08` }}>
              <div className="font-semibold" style={{ color: headerText }}>Assessment</div>
              <div className="text-xs text-theme-muted mt-1">Conversation / Observation / Product</div>
            </td>
            <td style={{ border: tableBorder, padding: "0.75rem", verticalAlign: "top" }}>
              <div className="mb-2">
                <span className="text-xs font-semibold uppercase tracking-wide mr-2" style={{ color: `${accentColor}aa` }}>
                  Strategy:
                </span>
                {editable ? (
                  <select
                    value={l.assessment?.strategy || "Observation"}
                    onChange={(e) => patchAssessment({ strategy: e.target.value as AssessmentBlock["strategy"] })}
                    className="text-sm px-2 py-0.5 bg-theme-hover rounded border border-theme"
                  >
                    <option>Conversation</option>
                    <option>Observation</option>
                    <option>Product</option>
                    <option>Mixed</option>
                  </select>
                ) : (
                  <span>{l.assessment?.strategy || "(strategy)"}</span>
                )}
              </div>
              <InlineText
                value={l.assessment?.description || ""}
                placeholder="(assessment description)"
                editable={editable}
                multiline
                onChange={(v) => patchAssessment({ description: v })}
                className="block mb-2"
              />
              <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: `${accentColor}aa` }}>
                Success Criteria
              </div>
              <BulletList
                items={l.assessment?.success_criteria}
                editable={editable}
                accentColor={accentColor}
                placeholder="(success criteria)"
                onChange={(next) => patchAssessment({ success_criteria: next })}
              />
            </td>
          </tr>

          {/* Differentiation */}
          <tr>
            <td style={{ border: tableBorder, padding: "0.75rem", verticalAlign: "top", background: `${accentColor}08` }}>
              <div className="font-semibold" style={{ color: headerText }}>Differentiation</div>
            </td>
            <td style={{ border: tableBorder, padding: "0.75rem", verticalAlign: "top" }}>
              <div className="mb-2">
                <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: `${accentColor}aa` }}>
                  Support
                </div>
                <BulletList
                  items={l.differentiation?.support}
                  editable={editable}
                  accentColor={accentColor}
                  placeholder="(support strategies)"
                  onChange={(next) => patchDifferentiation({ support: next })}
                />
              </div>
              <div className="mb-2">
                <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: `${accentColor}aa` }}>
                  Extension
                </div>
                <BulletList
                  items={l.differentiation?.extension}
                  editable={editable}
                  accentColor={accentColor}
                  placeholder="(extension strategies)"
                  onChange={(next) => patchDifferentiation({ extension: next })}
                />
              </div>
              {((l.differentiation?.accommodations?.length ?? 0) > 0 || editable) && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: `${accentColor}aa` }}>
                    Accommodations
                  </div>
                  <BulletList
                    items={l.differentiation?.accommodations}
                    editable={editable}
                    accentColor={accentColor}
                    placeholder="(accommodations)"
                    onChange={(next) => patchDifferentiation({ accommodations: next })}
                  />
                </div>
              )}
            </td>
          </tr>

          {/* Subject Integration */}
          <tr>
            <td style={{ border: tableBorder, padding: "0.75rem", verticalAlign: "top", background: `${accentColor}08` }}>
              <div className="font-semibold" style={{ color: headerText }}>Subject Integration</div>
            </td>
            <td style={{ border: tableBorder, padding: "0.75rem", verticalAlign: "top" }}>
              <BulletList
                items={l.subject_integration}
                editable={editable}
                accentColor={accentColor}
                placeholder="(cross-curricular links)"
                onChange={(next) => patch({ subject_integration: next })}
              />
            </td>
          </tr>

          {/* Resources */}
          <tr>
            <td style={{ border: tableBorder, padding: "0.75rem", verticalAlign: "top", background: `${accentColor}08` }}>
              <div className="font-semibold" style={{ color: headerText }}>Resources</div>
            </td>
            <td style={{ border: tableBorder, padding: "0.75rem", verticalAlign: "top" }}>
              <BulletList
                items={l.resources}
                editable={editable}
                accentColor={accentColor}
                placeholder="(classroom materials)"
                onChange={(next) => patch({ resources: next })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* ============================================================
          TABLE 3 - Teacher's Reflections (NOT AI-generated)
          ============================================================ */}
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
              Teacher's Reflections
              <span className="ml-2 text-xs font-normal text-theme-muted italic">
                (fill in after teaching)
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {TEACHER_REFLECTION_PROMPTS.map(({ key, label }) => (
            <tr key={key}>
              <td
                style={{
                  border: tableBorder,
                  padding: "0.75rem",
                  verticalAlign: "top",
                  background: `${accentColor}08`,
                  width: "38%",
                }}
              >
                <div className="text-sm">{label}</div>
              </td>
              <td style={{ border: tableBorder, padding: "0.75rem", verticalAlign: "top" }}>
                <InlineText
                  value={reflect[key]}
                  placeholder="(to be completed after lesson)"
                  editable={editable}
                  multiline
                  onChange={(v) => patchReflection(key, v)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isStreaming && (
        <div className="flex items-center justify-center py-2">
          <span
            className="inline-block w-2 h-2 rounded-full animate-pulse mr-2"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-xs text-theme-muted italic">
            Generating lesson plan...
          </span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cell primitives (keep table markup readable)
// ---------------------------------------------------------------------------

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

function ValueCell({ children }: { children: React.ReactNode }) {
  return (
    <td
      style={{
        border: `1px solid currentColor`,
        borderColor: "rgba(0,0,0,0.1)",
        padding: "0.5rem 0.75rem",
      }}
    >
      {children}
    </td>
  );
}

function KsvHeader({ accent, label }: { accent: string; label: string }) {
  return (
    <th
      colSpan={2}
      style={{
        border: `1px solid ${accent}44`,
        background: `${accent}14`,
        color: `${accent}dd`,
        padding: "0.5rem 0.75rem",
        textAlign: "left",
      }}
    >
      {label}
    </th>
  );
}

function KsvCell({ children }: { children: React.ReactNode }) {
  return (
    <td
      colSpan={2}
      style={{
        border: `1px solid rgba(0,0,0,0.1)`,
        padding: "0.5rem 0.75rem",
        verticalAlign: "top",
      }}
    >
      {children}
    </td>
  );
}
