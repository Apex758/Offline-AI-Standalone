/**
 * RubricTable
 *
 * Renders a ParsedRubric as an inline-editable criteria x performance-levels
 * grid. Matches the click-to-edit UX of OhpcLessonTable and QuizTable — no
 * "Edit" button, no modal, every string is a contentEditable field.
 *
 * Features:
 *   - Inline-edit rubric title / objectives / requirements (header card)
 *   - Inline-edit each performance level name (column headers)
 *   - Inline-edit each criterion label (row headers)
 *   - Inline-edit every cell description
 *   - Add / remove criteria (rows) and performance levels (columns)
 *   - Optional point values per cell when metadata.includePointValues is true
 */
import React, { useCallback } from "react";
import type { ParsedRubric, CriteriaRow } from "../../types/rubric";
import { InlineText } from "../shared/InlineEditPrimitives";

interface Props {
  rubric: ParsedRubric;
  accentColor: string;
  editable?: boolean;
  onChange?: (next: ParsedRubric) => void;
}

export default function RubricTable({
  rubric,
  accentColor,
  editable = true,
  onChange,
}: Props) {
  const tableBorder = `1px solid ${accentColor}44`;
  const headerBg = `${accentColor}14`;
  const headerText = `${accentColor}dd`;
  const subtleBg = `${accentColor}08`;

  const patchMetadata = useCallback(
    (update: Partial<ParsedRubric["metadata"]>) => {
      if (!onChange) return;
      onChange({ ...rubric, metadata: { ...rubric.metadata, ...update } });
    },
    [rubric, onChange]
  );

  const patchCriterion = useCallback(
    (idx: number, update: Partial<CriteriaRow>) => {
      if (!onChange) return;
      const nextCriteria = rubric.criteria.map((c, i) =>
        i === idx ? { ...c, ...update } : c
      );
      onChange({ ...rubric, criteria: nextCriteria });
    },
    [rubric, onChange]
  );

  const patchCell = useCallback(
    (criterionIdx: number, levelName: string, value: string) => {
      if (!onChange) return;
      const nextCriteria = rubric.criteria.map((c, i) =>
        i === criterionIdx
          ? { ...c, levels: { ...c.levels, [levelName]: value } }
          : c
      );
      onChange({ ...rubric, criteria: nextCriteria });
    },
    [rubric, onChange]
  );

  const patchCellPoints = useCallback(
    (criterionIdx: number, levelName: string, value: number) => {
      if (!onChange) return;
      const nextCriteria = rubric.criteria.map((c, i) =>
        i === criterionIdx
          ? { ...c, points: { ...(c.points || {}), [levelName]: value } }
          : c
      );
      onChange({ ...rubric, criteria: nextCriteria });
    },
    [rubric, onChange]
  );

  const renamePerformanceLevel = useCallback(
    (oldName: string, newName: string) => {
      if (!onChange || oldName === newName) return;
      const nextLevels = rubric.performanceLevels.map((l) =>
        l === oldName ? newName : l
      );
      const nextCriteria = rubric.criteria.map((c) => {
        const nextL: { [k: string]: string } = {};
        const nextP: { [k: string]: number } = {};
        Object.entries(c.levels).forEach(([k, v]) => {
          nextL[k === oldName ? newName : k] = v;
        });
        if (c.points) {
          Object.entries(c.points).forEach(([k, v]) => {
            nextP[k === oldName ? newName : k] = v;
          });
        }
        return { ...c, levels: nextL, points: c.points ? nextP : undefined };
      });
      onChange({ ...rubric, performanceLevels: nextLevels, criteria: nextCriteria });
    },
    [rubric, onChange]
  );

  const addPerformanceLevel = useCallback(() => {
    if (!onChange) return;
    const base = "New Level";
    let name = base;
    let i = 2;
    while (rubric.performanceLevels.includes(name)) {
      name = `${base} ${i++}`;
    }
    const nextCriteria = rubric.criteria.map((c) => ({
      ...c,
      levels: { ...c.levels, [name]: "" },
      points: c.points ? { ...c.points, [name]: 0 } : c.points,
    }));
    onChange({
      ...rubric,
      performanceLevels: [...rubric.performanceLevels, name],
      criteria: nextCriteria,
    });
  }, [rubric, onChange]);

  const removePerformanceLevel = useCallback(
    (name: string) => {
      if (!onChange) return;
      const nextLevels = rubric.performanceLevels.filter((l) => l !== name);
      const nextCriteria = rubric.criteria.map((c) => {
        const nextL = { ...c.levels };
        delete nextL[name];
        let nextP = c.points;
        if (nextP) {
          nextP = { ...nextP };
          delete nextP[name];
        }
        return { ...c, levels: nextL, points: nextP };
      });
      onChange({
        ...rubric,
        performanceLevels: nextLevels,
        criteria: nextCriteria,
      });
    },
    [rubric, onChange]
  );

  const addCriterion = useCallback(() => {
    if (!onChange) return;
    const levels: { [k: string]: string } = {};
    const points: { [k: string]: number } = {};
    rubric.performanceLevels.forEach((l) => {
      levels[l] = "";
      points[l] = 0;
    });
    const newRow: CriteriaRow = {
      id: `c_${Date.now()}_${rubric.criteria.length}`,
      criterion: "",
      levels,
      points: rubric.metadata.includePointValues ? points : undefined,
    };
    onChange({ ...rubric, criteria: [...rubric.criteria, newRow] });
  }, [rubric, onChange]);

  const removeCriterion = useCallback(
    (idx: number) => {
      if (!onChange) return;
      onChange({
        ...rubric,
        criteria: rubric.criteria.filter((_, i) => i !== idx),
      });
    },
    [rubric, onChange]
  );

  const showPoints = rubric.metadata.includePointValues;

  return (
    <div
      id="rubric-html-export"
      className="space-y-6 text-theme-primary"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* Title */}
      <h1
        className="text-2xl font-bold text-center mb-2"
        style={{ color: headerText }}
      >
        <InlineText
          value={rubric.metadata.title || ""}
          placeholder="(rubric title)"
          editable={editable}
          onChange={(v) => patchMetadata({ title: v })}
        />
      </h1>

      {/* Header / metadata card */}
      <table
        className="w-full border-collapse text-sm"
        style={{ border: tableBorder }}
      >
        <tbody>
          <tr>
            <LabelCell accent={accentColor} label="Assignment:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={rubric.metadata.assignmentType || ""}
                placeholder="(assignment type)"
                editable={editable}
                onChange={(v) => patchMetadata({ assignmentType: v })}
              />
            </td>
            <LabelCell accent={accentColor} label="Subject:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={rubric.metadata.subject || ""}
                placeholder="(subject)"
                editable={editable}
                onChange={(v) => patchMetadata({ subject: v })}
              />
            </td>
            <LabelCell accent={accentColor} label="Grade:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={rubric.metadata.gradeLevel || ""}
                placeholder="(grade)"
                editable={editable}
                onChange={(v) => patchMetadata({ gradeLevel: v })}
              />
            </td>
          </tr>
          {(rubric.metadata.learningObjectives || editable) && (
            <tr>
              <td
                colSpan={6}
                style={{
                  border: tableBorder,
                  padding: "0.5rem 0.75rem",
                  background: headerBg,
                }}
              >
                <div className="font-semibold mb-1" style={{ color: headerText }}>
                  Learning Objectives:
                </div>
                <InlineText
                  value={rubric.metadata.learningObjectives || ""}
                  placeholder="(learning objectives)"
                  editable={editable}
                  multiline
                  onChange={(v) => patchMetadata({ learningObjectives: v })}
                />
              </td>
            </tr>
          )}
          {(rubric.metadata.specificRequirements || editable) && (
            <tr>
              <td
                colSpan={6}
                style={{
                  border: tableBorder,
                  padding: "0.5rem 0.75rem",
                  background: headerBg,
                }}
              >
                <div className="font-semibold mb-1" style={{ color: headerText }}>
                  Specific Requirements:
                </div>
                <InlineText
                  value={rubric.metadata.specificRequirements || ""}
                  placeholder="(specific requirements)"
                  editable={editable}
                  multiline
                  onChange={(v) => patchMetadata({ specificRequirements: v })}
                />
              </td>
            </tr>
          )}
          {editable && (
            <tr>
              <td
                colSpan={6}
                style={{
                  border: tableBorder,
                  padding: "0.5rem 0.75rem",
                  background: subtleBg,
                }}
              >
                <label className="flex items-center gap-2 text-xs text-theme-muted">
                  <input
                    type="checkbox"
                    checked={showPoints}
                    onChange={(e) =>
                      patchMetadata({ includePointValues: e.target.checked })
                    }
                    className="w-3.5 h-3.5"
                    style={{ accentColor }}
                  />
                  Include point values
                </label>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Criteria x Performance Levels grid */}
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse text-sm"
          style={{ border: tableBorder }}
        >
          <thead>
            <tr style={{ background: headerBg }}>
              <th
                className="text-left px-3 py-2 font-semibold"
                style={{
                  border: tableBorder,
                  color: headerText,
                  width: "18%",
                  minWidth: 140,
                }}
              >
                Criteria
              </th>
              {rubric.performanceLevels.map((level) => (
                <th
                  key={level}
                  className="text-left px-3 py-2 font-semibold group"
                  style={{ border: tableBorder, color: headerText }}
                >
                  <div className="flex items-center gap-2">
                    <InlineText
                      value={level}
                      placeholder="(level name)"
                      editable={editable}
                      onChange={(v) => renamePerformanceLevel(level, v)}
                      className="flex-1"
                    />
                    {editable && rubric.performanceLevels.length > 1 && (
                      <button
                        onClick={() => removePerformanceLevel(level)}
                        className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:text-red-700 px-1"
                        title="Remove level"
                        type="button"
                      >
                        x
                      </button>
                    )}
                  </div>
                </th>
              ))}
              {editable && (
                <th
                  style={{ border: tableBorder, background: subtleBg, width: "5%" }}
                >
                  <button
                    onClick={addPerformanceLevel}
                    className="text-xs px-2 py-0.5 rounded border border-dashed opacity-60 hover:opacity-100 transition whitespace-nowrap"
                    style={{
                      borderColor: `${accentColor}66`,
                      color: `${accentColor}cc`,
                    }}
                    type="button"
                    title="Add performance level"
                  >
                    + col
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rubric.criteria.map((criterion, cIdx) => (
              <tr key={criterion.id} className="group">
                <td
                  style={{
                    border: tableBorder,
                    padding: "0.75rem",
                    verticalAlign: "top",
                    background: subtleBg,
                  }}
                >
                  <div className="flex items-start gap-2">
                    <InlineText
                      value={criterion.criterion}
                      placeholder="(criterion)"
                      editable={editable}
                      multiline
                      onChange={(v) => patchCriterion(cIdx, { criterion: v })}
                      className="flex-1 font-semibold"
                    />
                    {editable && (
                      <button
                        onClick={() => removeCriterion(cIdx)}
                        className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:text-red-700 px-1"
                        title="Remove criterion"
                        type="button"
                      >
                        x
                      </button>
                    )}
                  </div>
                </td>
                {rubric.performanceLevels.map((level) => (
                  <td
                    key={level}
                    style={{
                      border: tableBorder,
                      padding: "0.75rem",
                      verticalAlign: "top",
                    }}
                  >
                    <InlineText
                      value={criterion.levels[level] || ""}
                      placeholder="(description)"
                      editable={editable}
                      multiline
                      onChange={(v) => patchCell(cIdx, level, v)}
                    />
                    {showPoints && (
                      <div className="mt-2 text-xs text-theme-muted flex items-center gap-1">
                        <span>Points:</span>
                        {editable ? (
                          <input
                            type="number"
                            min={0}
                            value={criterion.points?.[level] ?? 0}
                            onChange={(e) =>
                              patchCellPoints(cIdx, level, Number(e.target.value) || 0)
                            }
                            className="w-12 text-xs px-1 py-0.5 bg-theme-hover rounded border border-theme"
                          />
                        ) : (
                          <span>{criterion.points?.[level] ?? 0}</span>
                        )}
                      </div>
                    )}
                  </td>
                ))}
                {editable && <td style={{ border: tableBorder, background: subtleBg }} />}
              </tr>
            ))}
            {editable && (
              <tr>
                <td
                  colSpan={rubric.performanceLevels.length + 2}
                  style={{
                    border: tableBorder,
                    padding: "0.5rem 0.75rem",
                    background: subtleBg,
                  }}
                >
                  <button
                    onClick={addCriterion}
                    className="text-xs px-3 py-1 rounded border border-dashed opacity-60 hover:opacity-100 transition"
                    style={{
                      borderColor: `${accentColor}66`,
                      color: `${accentColor}cc`,
                    }}
                    type="button"
                  >
                    + add criterion
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cell primitives
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
