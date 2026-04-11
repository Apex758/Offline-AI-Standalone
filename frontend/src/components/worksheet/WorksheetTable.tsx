/**
 * WorksheetTable
 *
 * Renders a ParsedWorksheet as inline-editable content (no Edit button, no
 * modal). Matches the UX of OhpcLessonTable / QuizTable / RubricTable.
 *
 * Handles all worksheet question types:
 *   - multiple-choice
 *   - true-false
 *   - fill-blank
 *   - short-answer
 *   - matching (uses top-level matchingItems)
 *   - comprehension (uses top-level passage)
 *   - word-bank (uses top-level wordBank)
 *
 * Add / remove questions inline. Show answers only in teacher view.
 */
import React, { useCallback } from "react";
import type { ParsedWorksheet, WorksheetQuestion } from "../../types/worksheet";
import { InlineText, BulletList } from "../shared/InlineEditPrimitives";

interface Props {
  worksheet: ParsedWorksheet;
  accentColor: string;
  editable?: boolean;
  viewMode?: "teacher" | "student";
  onChange?: (next: ParsedWorksheet) => void;
}

export default function WorksheetTable({
  worksheet,
  accentColor,
  editable = true,
  viewMode = "teacher",
  onChange,
}: Props) {
  const tableBorder = `1px solid ${accentColor}44`;
  const headerBg = `${accentColor}14`;
  const headerText = `${accentColor}dd`;
  const subtleBg = `${accentColor}08`;
  const isTeacher = viewMode === "teacher";

  const patchMetadata = useCallback(
    (update: Partial<ParsedWorksheet["metadata"]>) => {
      if (!onChange) return;
      onChange({ ...worksheet, metadata: { ...worksheet.metadata, ...update } });
    },
    [worksheet, onChange]
  );

  const patchQuestion = useCallback(
    (idx: number, update: Partial<WorksheetQuestion>) => {
      if (!onChange) return;
      const nextQuestions = worksheet.questions.map((q, i) =>
        i === idx ? { ...q, ...update } : q
      );
      onChange({ ...worksheet, questions: nextQuestions });
    },
    [worksheet, onChange]
  );

  const removeQuestion = useCallback(
    (idx: number) => {
      if (!onChange) return;
      const nextQuestions = worksheet.questions.filter((_, i) => i !== idx);
      onChange({
        ...worksheet,
        questions: nextQuestions,
        metadata: { ...worksheet.metadata, totalQuestions: nextQuestions.length },
      });
    },
    [worksheet, onChange]
  );

  const addQuestion = useCallback(() => {
    if (!onChange) return;
    const newQ: WorksheetQuestion = {
      id: `q_${Date.now()}_${worksheet.questions.length}`,
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1,
    };
    const nextQuestions = [...worksheet.questions, newQ];
    onChange({
      ...worksheet,
      questions: nextQuestions,
      metadata: { ...worksheet.metadata, totalQuestions: nextQuestions.length },
    });
  }, [worksheet, onChange]);

  const patchPassage = useCallback(
    (v: string) => {
      if (!onChange) return;
      onChange({ ...worksheet, passage: v });
    },
    [worksheet, onChange]
  );

  const patchMatchingColumn = useCallback(
    (col: "columnA" | "columnB", next: string[]) => {
      if (!onChange) return;
      const current = worksheet.matchingItems || { columnA: [], columnB: [] };
      onChange({
        ...worksheet,
        matchingItems: { ...current, [col]: next },
      });
    },
    [worksheet, onChange]
  );

  const patchWordBank = useCallback(
    (next: string[]) => {
      if (!onChange) return;
      onChange({ ...worksheet, wordBank: next });
    },
    [worksheet, onChange]
  );

  const hasPassage = worksheet.passage !== undefined || editable;
  const hasMatching = worksheet.matchingItems !== undefined || editable;
  const hasWordBank = worksheet.wordBank !== undefined || editable;

  return (
    <div
      id="worksheet-html-export"
      className="space-y-6 text-theme-primary"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* Title */}
      <h1
        className="text-2xl font-bold text-center mb-2"
        style={{ color: headerText }}
      >
        <InlineText
          value={worksheet.metadata.title || ""}
          placeholder="(worksheet title)"
          editable={editable}
          onChange={(v) => patchMetadata({ title: v })}
        />
      </h1>

      {/* Header / metadata table */}
      <table
        className="w-full border-collapse text-sm"
        style={{ border: tableBorder }}
      >
        <tbody>
          <tr>
            <LabelCell accent={accentColor} label="Subject:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={worksheet.metadata.subject || ""}
                placeholder="(subject)"
                editable={editable}
                onChange={(v) => patchMetadata({ subject: v })}
              />
            </td>
            <LabelCell accent={accentColor} label="Grade:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              <InlineText
                value={worksheet.metadata.gradeLevel || ""}
                placeholder="(grade)"
                editable={editable}
                onChange={(v) => patchMetadata({ gradeLevel: v })}
              />
            </td>
            <LabelCell accent={accentColor} label="Questions:" />
            <td style={{ border: tableBorder, padding: "0.5rem 0.75rem" }}>
              {worksheet.questions.length}
            </td>
          </tr>
          {(worksheet.metadata.instructions || editable) && (
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
                  Instructions:
                </div>
                <InlineText
                  value={worksheet.metadata.instructions || ""}
                  placeholder="(instructions for students)"
                  editable={editable}
                  multiline
                  onChange={(v) => patchMetadata({ instructions: v })}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Comprehension passage */}
      {hasPassage && (worksheet.passage !== undefined || editable) && (
        <div
          className="rounded-lg p-4"
          style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
        >
          <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
            Reading Passage
          </div>
          <InlineText
            value={worksheet.passage || ""}
            placeholder="(passage text — appears above questions)"
            editable={editable}
            multiline
            onChange={patchPassage}
            className="whitespace-pre-wrap leading-relaxed block"
          />
        </div>
      )}

      {/* Word bank */}
      {hasWordBank && (worksheet.wordBank !== undefined || editable) && (
        <div
          className="rounded-lg p-4"
          style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
        >
          <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
            Word Bank
          </div>
          <BulletList
            items={worksheet.wordBank}
            editable={editable}
            accentColor={accentColor}
            placeholder="(word bank items)"
            onChange={patchWordBank}
          />
        </div>
      )}

      {/* Matching items */}
      {hasMatching && (worksheet.matchingItems !== undefined || editable) && (
        <div
          className="rounded-lg p-4"
          style={{ border: `1px solid ${accentColor}33`, background: subtleBg }}
        >
          <div className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: headerText }}>
            Matching Items
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold mb-1" style={{ color: headerText }}>
                Column A
              </div>
              <BulletList
                items={worksheet.matchingItems?.columnA}
                editable={editable}
                accentColor={accentColor}
                placeholder="(column A items)"
                onChange={(next) => patchMatchingColumn("columnA", next)}
              />
            </div>
            <div>
              <div className="text-sm font-semibold mb-1" style={{ color: headerText }}>
                Column B
              </div>
              <BulletList
                items={worksheet.matchingItems?.columnB}
                editable={editable}
                accentColor={accentColor}
                placeholder="(column B items)"
                onChange={(next) => patchMatchingColumn("columnB", next)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {worksheet.questions.map((question, qIndex) => {
          const correctIdx = question.correctAnswer as number;
          const correctLetter =
            question.type === "multiple-choice" && typeof correctIdx === "number"
              ? String.fromCharCode(65 + correctIdx)
              : null;

          return (
            <div key={question.id} className="space-y-3 group relative">
              {/* Question stem */}
              <div
                className="flex items-start gap-2 text-base font-semibold p-3 rounded-lg"
                style={{ color: headerText, backgroundColor: subtleBg }}
              >
                <span className="flex-shrink-0">Question {qIndex + 1}:</span>
                <InlineText
                  value={question.question}
                  placeholder="(question text)"
                  editable={editable}
                  multiline
                  onChange={(v) => patchQuestion(qIndex, { question: v })}
                  className="flex-1"
                />
                {editable && (
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:text-red-700 px-2 flex-shrink-0"
                    title="Remove question"
                    type="button"
                  >
                    remove
                  </button>
                )}
              </div>

              {/* Type picker (editable) */}
              {editable && (
                <div className="ml-6 flex items-center gap-2 text-xs text-theme-muted">
                  <span>Type:</span>
                  <select
                    value={question.type}
                    onChange={(e) => {
                      const newType = e.target.value as WorksheetQuestion["type"];
                      const update: Partial<WorksheetQuestion> = { type: newType };
                      if (newType === "multiple-choice") {
                        update.options = question.options && question.options.length >= 2
                          ? question.options
                          : ["", "", "", ""];
                        update.correctAnswer =
                          typeof question.correctAnswer === "number"
                            ? question.correctAnswer
                            : 0;
                      } else if (newType === "true-false") {
                        update.options = ["True", "False"];
                        update.correctAnswer =
                          question.correctAnswer === "false" ? "false" : "true";
                      } else {
                        update.options = undefined;
                        update.correctAnswer =
                          typeof question.correctAnswer === "string"
                            ? question.correctAnswer
                            : "";
                      }
                      patchQuestion(qIndex, update);
                    }}
                    className="text-xs px-2 py-0.5 bg-theme-hover rounded border border-theme"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True / False</option>
                    <option value="fill-blank">Fill in the Blank</option>
                    <option value="short-answer">Short Answer</option>
                    <option value="matching">Matching</option>
                    <option value="comprehension">Comprehension</option>
                    <option value="word-bank">Word Bank</option>
                  </select>
                </div>
              )}

              {/* Multiple Choice */}
              {question.type === "multiple-choice" && (
                <div className="ml-6 space-y-2">
                  {(question.options || []).map((option, oIndex) => {
                    const letter = String.fromCharCode(65 + oIndex);
                    const isCorrect = isTeacher && correctIdx === oIndex;
                    return (
                      <div key={oIndex} className="flex items-start gap-2 group/opt">
                        <span
                          className={`font-semibold ${isCorrect ? "px-2 py-0.5 rounded" : ""}`}
                          style={{
                            color: isCorrect ? accentColor : `${accentColor}cc`,
                            backgroundColor: isCorrect ? `${accentColor}15` : "transparent",
                            fontWeight: isCorrect ? 700 : 600,
                          }}
                        >
                          {letter})
                        </span>
                        <InlineText
                          value={option}
                          placeholder="(option)"
                          editable={editable}
                          onChange={(v) => {
                            const nextOpts = [...(question.options || [])];
                            nextOpts[oIndex] = v;
                            patchQuestion(qIndex, { options: nextOpts });
                          }}
                          className={`flex-1 text-theme-label ${isCorrect ? "font-medium" : ""}`}
                        />
                        {editable && (
                          <>
                            <button
                              onClick={() => patchQuestion(qIndex, { correctAnswer: oIndex })}
                              className="opacity-0 group-hover/opt:opacity-100 text-xs px-1 text-green-600 hover:text-green-800"
                              title="Mark as correct answer"
                              type="button"
                            >
                              {correctIdx === oIndex ? "✓" : "mark"}
                            </button>
                            <button
                              onClick={() => {
                                const nextOpts = (question.options || []).filter(
                                  (_, i) => i !== oIndex
                                );
                                const nextCorrect =
                                  correctIdx === oIndex
                                    ? 0
                                    : correctIdx > oIndex
                                    ? correctIdx - 1
                                    : correctIdx;
                                patchQuestion(qIndex, {
                                  options: nextOpts,
                                  correctAnswer: nextCorrect,
                                });
                              }}
                              className="opacity-0 group-hover/opt:opacity-100 text-xs text-red-500 hover:text-red-700 px-1"
                              title="Remove option"
                              type="button"
                            >
                              x
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                  {editable && (
                    <button
                      onClick={() => {
                        const nextOpts = [...(question.options || []), ""];
                        patchQuestion(qIndex, { options: nextOpts });
                      }}
                      className="text-xs px-2 py-0.5 rounded border border-dashed opacity-60 hover:opacity-100 transition"
                      style={{ borderColor: `${accentColor}66`, color: `${accentColor}cc` }}
                      type="button"
                    >
                      + add option
                    </button>
                  )}
                  {isTeacher && correctLetter && (
                    <div className="mt-3 text-sm">
                      <span className="font-semibold text-green-700">
                        Correct Answer: {correctLetter}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* True / False */}
              {question.type === "true-false" && (
                <div className="ml-6 space-y-2">
                  {["true", "false"].map((val, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const isCorrect = isTeacher && question.correctAnswer === val;
                    return (
                      <div key={val} className="flex items-start gap-2">
                        <span
                          className={`font-semibold ${isCorrect ? "px-2 py-0.5 rounded" : ""}`}
                          style={{
                            color: isCorrect ? accentColor : `${accentColor}cc`,
                            backgroundColor: isCorrect ? `${accentColor}15` : "transparent",
                          }}
                        >
                          {letter})
                        </span>
                        <span className={`text-theme-label ${isCorrect ? "font-medium" : ""}`}>
                          {val === "true" ? "True" : "False"}
                        </span>
                        {editable && (
                          <button
                            onClick={() => patchQuestion(qIndex, { correctAnswer: val })}
                            className="text-xs px-1 text-green-600 hover:text-green-800"
                            title="Mark as correct answer"
                            type="button"
                          >
                            {question.correctAnswer === val ? "✓" : "mark"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Fill in the Blank */}
              {question.type === "fill-blank" && isTeacher && (
                <div className="ml-6 space-y-2">
                  <div className="text-sm flex items-start gap-2">
                    <span className="font-semibold text-green-700 flex-shrink-0">
                      Answer:
                    </span>
                    <InlineText
                      value={(question.correctAnswer as string) || ""}
                      placeholder="(expected answer)"
                      editable={editable}
                      onChange={(v) => patchQuestion(qIndex, { correctAnswer: v })}
                      className="flex-1"
                    />
                  </div>
                </div>
              )}

              {/* Short Answer */}
              {question.type === "short-answer" && isTeacher && (
                <div className="ml-6 space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold text-theme-label">Sample Answer:</span>
                    <InlineText
                      value={(question.correctAnswer as string) || ""}
                      placeholder="(sample answer)"
                      editable={editable}
                      multiline
                      onChange={(v) => patchQuestion(qIndex, { correctAnswer: v })}
                      className="text-theme-muted mt-1 whitespace-pre-wrap block"
                    />
                  </div>
                </div>
              )}

              {/* Explanation (teacher only) */}
              {isTeacher && (question.explanation || editable) && (
                <div className="ml-6 mt-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-semibold text-blue-900">Explanation: </span>
                  <InlineText
                    value={question.explanation || ""}
                    placeholder="(optional explanation)"
                    editable={editable}
                    multiline
                    onChange={(v) => patchQuestion(qIndex, { explanation: v })}
                    className="text-sm text-blue-800"
                  />
                </div>
              )}

              {/* Points (teacher only) */}
              {isTeacher && (question.points !== undefined || editable) && (
                <div className="ml-6 mt-2 flex gap-4 text-xs text-theme-hint items-center">
                  <span className="flex items-center gap-1">
                    Points:
                    {editable ? (
                      <input
                        type="number"
                        min={0}
                        value={question.points ?? ""}
                        onChange={(e) =>
                          patchQuestion(qIndex, {
                            points: Number(e.target.value) || 0,
                          })
                        }
                        className="w-12 text-xs px-1 py-0.5 bg-theme-hover rounded border border-theme"
                      />
                    ) : (
                      <span>{question.points}</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add question button */}
      {editable && (
        <div className="flex justify-center pt-2">
          <button
            onClick={addQuestion}
            className="text-sm px-4 py-2 rounded-lg border border-dashed transition hover:bg-theme-hover"
            style={{ borderColor: `${accentColor}66`, color: `${accentColor}cc` }}
            type="button"
          >
            + add question
          </button>
        </div>
      )}
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
