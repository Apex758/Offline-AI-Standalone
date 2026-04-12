/**
 * QuizTable
 *
 * Renders a ParsedQuiz as inline-editable content (no Edit button, no modal).
 * Matches the UX of OhpcLessonTable: every string is click-to-edit via
 * contentEditable, option lists use BulletList with add/remove affordances,
 * and changes propagate via onChange to the parent (which persists to
 * localStorage).
 *
 * Visual layout mirrors the previous read-only quiz rendering in
 * QuizGenerator — themed question headers, option letters, teacher-only
 * answer keys and explanations — so users get a consistent WYSIWYG surface.
 */
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { ParsedQuiz, QuizQuestion } from "../../types/quiz";
import { InlineText, BulletList } from "../shared/InlineEditPrimitives";

interface Props {
  quiz: ParsedQuiz;
  accentColor: string;
  editable?: boolean;
  effectiveVersion?: "teacher" | "student";
  onChange?: (next: ParsedQuiz) => void;
  studentInfo?: { name: string; id: string };
}

export default function QuizTable({
  quiz,
  accentColor,
  editable = true,
  effectiveVersion = "teacher",
  onChange,
  studentInfo,
}: Props) {
  const { t } = useTranslation();

  const patchQuestion = useCallback(
    (idx: number, update: Partial<QuizQuestion>) => {
      if (!onChange) return;
      const nextQuestions = quiz.questions.map((q, i) =>
        i === idx ? { ...q, ...update } : q
      );
      onChange({ ...quiz, questions: nextQuestions });
    },
    [quiz, onChange]
  );

  const removeQuestion = useCallback(
    (idx: number) => {
      if (!onChange) return;
      const nextQuestions = quiz.questions.filter((_, i) => i !== idx);
      onChange({
        ...quiz,
        questions: nextQuestions,
        metadata: { ...quiz.metadata, totalQuestions: nextQuestions.length },
      });
    },
    [quiz, onChange]
  );

  const addQuestion = useCallback(() => {
    if (!onChange) return;
    const newQ: QuizQuestion = {
      id: `q_${Date.now()}_${quiz.questions.length}`,
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1,
    };
    const nextQuestions = [...quiz.questions, newQ];
    onChange({
      ...quiz,
      questions: nextQuestions,
      metadata: { ...quiz.metadata, totalQuestions: nextQuestions.length },
    });
  }, [quiz, onChange]);

  const headerText = `${accentColor}cc`;
  const subtleBg = `${accentColor}0d`;
  const isTeacher = effectiveVersion === "teacher";

  return (
    <div
      id="quiz-html-export"
      className="space-y-6 text-theme-primary"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* Header - matches PDF export layout */}
      <div className="mb-6">
        {/* Title centered */}
        <div className="text-center pb-3 mb-4" style={{ borderBottom: `2px solid ${accentColor}` }}>
          <InlineText
            value={quiz.metadata.title || ""}
            placeholder="(quiz title)"
            editable={editable}
            onChange={(v) =>
              onChange && onChange({ ...quiz, metadata: { ...quiz.metadata, title: v } })
            }
            className="text-xl font-bold text-theme-primary inline-block"
          />
        </div>

        {/* Instructions (left) + Student info (right) row */}
        <div className="flex gap-6 items-start mb-4">
          <div className="flex-1">
            {(quiz.metadata.instructions || editable) && (
              <InlineText
                value={quiz.metadata.instructions || ""}
                placeholder="(instructions for students)"
                editable={editable}
                multiline
                onChange={(v) =>
                  onChange &&
                  onChange({ ...quiz, metadata: { ...quiz.metadata, instructions: v } })
                }
                className="text-sm text-theme-muted"
              />
            )}
          </div>
          {studentInfo && (
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold text-sm text-theme-primary">{studentInfo.name}</div>
                <div className="text-xs text-theme-muted">ID: {studentInfo.id}</div>
              </div>
              <div
                className="w-10 h-10 rounded flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              >
                {studentInfo.name.charAt(0)}
              </div>
            </div>
          )}
        </div>

        {/* Name / Date fields */}
        <div className="flex gap-8 pb-3 border-b border-gray-300 dark:border-gray-600">
          <div className="text-sm text-theme-primary">
            Name: <span className="inline-block w-48 border-b border-gray-400 dark:border-gray-500">&nbsp;</span>
          </div>
          <div className="text-sm text-theme-primary">
            Date: <span className="inline-block w-32 border-b border-gray-400 dark:border-gray-500">&nbsp;</span>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {quiz.questions.map((question, qIndex) => {
          const correctIdx = question.correctAnswer as number;
          const correctLetter =
            question.type === "multiple-choice" && typeof correctIdx === "number"
              ? String.fromCharCode(65 + correctIdx)
              : null;

          return (
            <div key={question.id} className="space-y-3 group relative">
              {/* Question header (stem) */}
              <div
                className="flex items-start gap-2 text-base font-semibold pt-2"
                style={{ color: '#374151' }}
              >
                <span className="flex-shrink-0">
                  {t("quiz.questionPrefix", { number: qIndex + 1 })}:
                </span>
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

              {/* Question-type picker (editable mode only) */}
              {editable && (
                <div className="ml-6 flex items-center gap-2 text-xs text-theme-muted">
                  <span>Type:</span>
                  <select
                    value={question.type}
                    onChange={(e) => {
                      const newType = e.target.value as QuizQuestion["type"];
                      const update: Partial<QuizQuestion> = { type: newType };
                      // Normalize fields for the new type
                      if (newType === "multiple-choice") {
                        update.options = question.options && question.options.length >= 2
                          ? question.options
                          : ["", "", "", ""];
                        update.correctAnswer = typeof question.correctAnswer === "number"
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
                    <option value="open-ended">Open-Ended</option>
                  </select>
                </div>
              )}

              {/* Multiple Choice */}
              {question.type === "multiple-choice" && (
                <div className="ml-6">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {(question.options || []).map((option, oIndex) => {
                      const letter = String.fromCharCode(65 + oIndex);
                      const isCorrect = isTeacher && correctIdx === oIndex;
                      return (
                        <div key={oIndex} className="flex items-center gap-2 group/opt">
                          <span
                            className="flex-shrink-0 inline-flex items-center justify-center rounded-full border-2 text-xs font-semibold"
                            style={{
                              width: "1.5rem",
                              height: "1.5rem",
                              borderColor: isCorrect ? accentColor : "#9ca3af",
                              color: isCorrect ? "white" : "#374151",
                              backgroundColor: isCorrect ? accentColor : "transparent",
                            }}
                          >
                            {letter}
                          </span>
                          <InlineText
                            value={option}
                            placeholder="(option text)"
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
                                {correctIdx === oIndex ? "\u2713" : "mark"}
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
                  </div>
                  {editable && (
                    <button
                      onClick={() => {
                        const nextOpts = [...(question.options || []), ""];
                        patchQuestion(qIndex, { options: nextOpts });
                      }}
                      className="text-xs px-2 py-0.5 mt-2 rounded border border-dashed opacity-60 hover:opacity-100 transition"
                      style={{ borderColor: `${accentColor}66`, color: `${accentColor}cc` }}
                      type="button"
                    >
                      + add option
                    </button>
                  )}
                  {isTeacher && correctLetter && (
                    <div className="mt-3 text-sm">
                      <span className="font-semibold text-green-700">
                        {t("quiz.correctAnswer")}: {correctLetter}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* True / False */}
              {question.type === "true-false" && (
                <div className="ml-6">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {["true", "false"].map((val, i) => {
                      const isCorrect = isTeacher && question.correctAnswer === val;
                      return (
                        <div key={val} className="flex items-center gap-2">
                          <span
                            className="flex-shrink-0 inline-flex items-center justify-center rounded-full border-2 text-xs font-semibold"
                            style={{
                              width: "1.5rem",
                              height: "1.5rem",
                              borderColor: isCorrect ? accentColor : "#9ca3af",
                              color: isCorrect ? "white" : "#374151",
                              backgroundColor: isCorrect ? accentColor : "transparent",
                            }}
                          >
                            {val === "true" ? "T" : "F"}
                          </span>
                          <span className={`text-theme-label ${isCorrect ? "font-medium" : ""}`}>
                            {val === "true" ? t("quiz.true") : t("quiz.false")}
                          </span>
                          {editable && (
                            <button
                              onClick={() => patchQuestion(qIndex, { correctAnswer: val })}
                              className="text-xs px-1 text-green-600 hover:text-green-800"
                              title="Mark as correct answer"
                              type="button"
                            >
                              {question.correctAnswer === val ? "\u2713" : "mark"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {isTeacher && (
                    <div className="mt-3 text-sm">
                      <span className="font-semibold text-green-700">
                        {t("quiz.correctAnswer")}:{" "}
                        {question.correctAnswer === "true" ? t("quiz.true") : t("quiz.false")}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Fill in the Blank */}
              {question.type === "fill-blank" && isTeacher && (
                <div className="ml-6 space-y-2">
                  <div className="text-sm flex items-start gap-2">
                    <span className="font-semibold text-green-700 flex-shrink-0">
                      {t("quiz.correctAnswer")}:
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

              {/* Open-Ended */}
              {question.type === "open-ended" && isTeacher && (
                <div className="ml-6 space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold text-theme-label">
                      {t("quiz.sampleAnswer")}
                    </span>
                    <InlineText
                      value={(question.correctAnswer as string) || ""}
                      placeholder="(sample answer / key points)"
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
                  <span className="text-sm font-semibold text-blue-900">
                    {t("quiz.explanation")}:{" "}
                  </span>
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

              {/* Cognitive level / points */}
              {isTeacher && (question.cognitiveLevel || question.points || editable) && (
                <div className="ml-6 mt-2 flex gap-4 text-xs text-theme-hint items-center">
                  <span className="flex items-center gap-1">
                    {t("quiz.cognitiveLevel")}
                    <InlineText
                      value={question.cognitiveLevel || ""}
                      placeholder="(level)"
                      editable={editable}
                      onChange={(v) => patchQuestion(qIndex, { cognitiveLevel: v })}
                    />
                  </span>
                  <span className="flex items-center gap-1">
                    {t("quiz.points")}
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
