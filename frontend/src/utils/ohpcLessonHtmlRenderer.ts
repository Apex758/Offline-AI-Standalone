/**
 * OHPC Lesson Plan HTML renderer for export (PDF / DOCX / print).
 *
 * Produces a self-contained HTML document that mirrors the on-screen
 * OhpcLessonTable layout, but with print-safe inline CSS so the export
 * pipeline (which strips <style> tags in some paths) renders correctly.
 *
 * Takes a structured OhpcLessonPlan object (not markdown) and the
 * teacher's reflections. Call prepareOhpcLessonForExport() from the
 * ExportButton to produce the payload expected by the backend.
 */
import type {
  OhpcLessonPlan,
  TeacherReflections,
  LessonComponent,
} from "../types/ohpcLesson";
import {
  LESSON_COMPONENT_SLOTS,
  TEACHER_REFLECTION_PROMPTS,
} from "../types/ohpcLesson";
import { getLogoFooterHTML } from "./logoBase64";

interface OhpcExportOptions {
  accentColor: string;
  formData?: {
    subject?: string;
    gradeLevel?: string;
    topic?: string;
    [k: string]: unknown;
  };
  curriculumReferences?: any[];
}

// ---- tiny helpers ---------------------------------------------------------

const esc = (s: unknown): string =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const bullets = (items: string[] | undefined, accent: string): string => {
  if (!items || items.length === 0) {
    return `<div style="color:#888;font-style:italic;">(none)</div>`;
  }
  return `<ul style="margin:0;padding:0;list-style:none;">${items
    .map(
      (it) =>
        `<li style="display:flex;align-items:flex-start;gap:8px;margin:4px 0;line-height:1.5;">
          <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${accent};margin-top:8px;flex-shrink:0;"></span>
          <span style="flex:1;">${esc(it)}</span>
        </li>`
    )
    .join("")}</ul>`;
};

const cellBorder = (accent: string) => `1px solid ${accent}44`;

// ---- component cell -------------------------------------------------------

function componentCell(comp: LessonComponent | undefined, accent: string): string {
  if (!comp) {
    return `<div style="color:#888;font-style:italic;">(not filled)</div>`;
  }
  const section = (label: string, items: string[] | undefined) =>
    items && items.length > 0
      ? `<div style="margin-bottom:8px;">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:${accent}aa;margin-bottom:4px;">${esc(label)}</div>
          ${bullets(items, accent)}
        </div>`
      : "";
  return `
    ${section("Teacher", comp.teacher_actions)}
    ${section("Students", comp.student_actions)}
    ${section("Talking Points", comp.talking_points)}
  `;
}

// ---- main renderer --------------------------------------------------------

export function renderOhpcLessonHtml(
  lesson: Partial<OhpcLessonPlan>,
  reflections: TeacherReflections,
  options: OhpcExportOptions
): string {
  const { accentColor, curriculumReferences } = options;
  const accent = accentColor || "#2563eb";
  const headerBg = `${accent}14`;
  const headerText = `${accent}dd`;
  const labelBg = `${accent}14`;
  const altRowBg = `${accent}08`;
  const border = cellBorder(accent);

  const tableStyle = `width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;`;
  const cellStyle = `border:${border};padding:10px 12px;vertical-align:top;`;
  const labelCell = `${cellStyle}background:${labelBg};color:${headerText};font-weight:600;white-space:nowrap;`;
  const headerCell = `${cellStyle}background:${headerBg};color:${headerText};font-weight:700;text-align:left;`;

  // ---- TABLE 1 : Header / Outcomes ----
  const table1 = `
    <table style="${tableStyle}">
      <tbody>
        <tr>
          <td style="${labelCell}">Subject:</td>
          <td style="${cellStyle}">${esc(lesson.subject)}</td>
          <td style="${labelCell}">Grade:</td>
          <td style="${cellStyle}">${esc(lesson.grade)}</td>
          <td style="${labelCell}">Duration:</td>
          <td style="${cellStyle}">${esc(lesson.duration)}</td>
        </tr>
        <tr>
          <td style="${labelCell}">Strand:</td>
          <td style="${cellStyle}">${esc(lesson.strand)}</td>
          <td style="${labelCell}">Essential Learning Outcome:</td>
          <td style="${cellStyle}" colspan="3">${esc(lesson.essential_learning_outcome)}</td>
        </tr>
        <tr>
          <td style="${cellStyle}background:${headerBg};" colspan="6">
            <div style="font-weight:700;color:${headerText};margin-bottom:4px;">General Objective of the Lesson:</div>
            <div>${esc(lesson.general_objective)}</div>
          </td>
        </tr>
        <tr>
          <td style="${cellStyle}background:${headerBg};" colspan="6">
            <div style="font-weight:700;color:${headerText};margin-bottom:4px;">Specific Curriculum Outcomes:</div>
            ${bullets(lesson.specific_curriculum_outcomes, accent)}
            ${
              lesson.focus_question
                ? `<div style="margin-top:6px;font-size:11px;font-style:italic;">Focus question: ${esc(lesson.focus_question)}</div>`
                : ""
            }
          </td>
        </tr>
        <tr>
          <td style="${headerCell}" colspan="2">Knowledge</td>
          <td style="${headerCell}" colspan="2">Skills</td>
          <td style="${headerCell}" colspan="2">Values</td>
        </tr>
        <tr>
          <td style="${cellStyle}" colspan="2">${bullets(lesson.ksv?.knowledge, accent)}</td>
          <td style="${cellStyle}" colspan="2">${bullets(lesson.ksv?.skills, accent)}</td>
          <td style="${cellStyle}" colspan="2">${bullets(lesson.ksv?.values, accent)}</td>
        </tr>
      </tbody>
    </table>
  `;

  // ---- TABLE 2 : Components of the Lesson ----
  const componentRows = LESSON_COMPONENT_SLOTS.map(({ key, label, expectedRange }) => {
    const comp = lesson[key] as LessonComponent | undefined;
    const minsLabel = comp?.duration_minutes ? `${comp.duration_minutes} min` : expectedRange;
    return `
      <tr>
        <td style="${cellStyle}background:${altRowBg};width:28%;">
          <div style="font-weight:700;color:${headerText};">${esc(label)}</div>
          <div style="font-size:11px;color:#888;margin-top:2px;">(${esc(minsLabel)})</div>
        </td>
        <td style="${cellStyle}">${componentCell(comp, accent)}</td>
      </tr>
    `;
  }).join("");

  const assessment = lesson.assessment;
  const assessmentRow = `
    <tr>
      <td style="${cellStyle}background:${altRowBg};">
        <div style="font-weight:700;color:${headerText};">Assessment</div>
        <div style="font-size:11px;color:#888;margin-top:2px;">Conversation / Observation / Product</div>
      </td>
      <td style="${cellStyle}">
        ${
          assessment
            ? `
          <div style="margin-bottom:6px;"><span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:${accent}aa;">Strategy:</span> ${esc(assessment.strategy)}</div>
          <div style="margin-bottom:8px;">${esc(assessment.description)}</div>
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:${accent}aa;margin-bottom:4px;">Success Criteria</div>
          ${bullets(assessment.success_criteria, accent)}
        `
            : `<div style="color:#888;font-style:italic;">(not filled)</div>`
        }
      </td>
    </tr>
  `;

  const diff = lesson.differentiation;
  const diffRow = `
    <tr>
      <td style="${cellStyle}background:${altRowBg};">
        <div style="font-weight:700;color:${headerText};">Differentiation</div>
      </td>
      <td style="${cellStyle}">
        ${
          diff
            ? `
          <div style="margin-bottom:8px;">
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:${accent}aa;margin-bottom:4px;">Support</div>
            ${bullets(diff.support, accent)}
          </div>
          <div style="margin-bottom:8px;">
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:${accent}aa;margin-bottom:4px;">Extension</div>
            ${bullets(diff.extension, accent)}
          </div>
          ${
            diff.accommodations && diff.accommodations.length > 0
              ? `<div>
                  <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:${accent}aa;margin-bottom:4px;">Accommodations</div>
                  ${bullets(diff.accommodations, accent)}
                </div>`
              : ""
          }
        `
            : `<div style="color:#888;font-style:italic;">(not filled)</div>`
        }
      </td>
    </tr>
  `;

  const integrationRow = `
    <tr>
      <td style="${cellStyle}background:${altRowBg};">
        <div style="font-weight:700;color:${headerText};">Subject Integration</div>
      </td>
      <td style="${cellStyle}">${bullets(lesson.subject_integration, accent)}</td>
    </tr>
  `;

  const resourcesRow = `
    <tr>
      <td style="${cellStyle}background:${altRowBg};">
        <div style="font-weight:700;color:${headerText};">Resources</div>
      </td>
      <td style="${cellStyle}">${bullets(lesson.resources, accent)}</td>
    </tr>
  `;

  const table2 = `
    <table style="${tableStyle}">
      <thead>
        <tr>
          <th style="${headerCell}width:28%;">Components of the Lesson</th>
          <th style="${headerCell}">Lesson Plan</th>
        </tr>
      </thead>
      <tbody>
        ${componentRows}
        ${assessmentRow}
        ${diffRow}
        ${integrationRow}
        ${resourcesRow}
      </tbody>
    </table>
  `;

  // ---- TABLE 3 : Teacher's Reflections (blank / filled by teacher) ----
  const reflectionRows = TEACHER_REFLECTION_PROMPTS.map(({ key, label }) => {
    const val = reflections?.[key] || "";
    return `
      <tr>
        <td style="${cellStyle}background:${altRowBg};width:38%;">${esc(label)}</td>
        <td style="${cellStyle}min-height:32px;">
          ${val ? esc(val) : `<span style="color:#bbb;font-style:italic;">(to be completed after lesson)</span>`}
        </td>
      </tr>
    `;
  }).join("");

  const table3 = `
    <table style="${tableStyle}">
      <thead>
        <tr>
          <th style="${headerCell}" colspan="2">
            Teacher's Reflections
            <span style="font-size:10px;font-weight:400;color:#888;font-style:italic;margin-left:8px;">(fill in after teaching)</span>
          </th>
        </tr>
      </thead>
      <tbody>${reflectionRows}</tbody>
    </table>
  `;

  // ---- Curriculum references (optional) ----
  const refs = curriculumReferences && curriculumReferences.length > 0
    ? `
      <div style="margin-top:24px;padding:12px;border:${border};border-radius:6px;background:${altRowBg};">
        <div style="font-weight:700;color:${headerText};margin-bottom:6px;">Curriculum References</div>
        <ul style="margin:0;padding-left:20px;font-size:12px;">
          ${curriculumReferences
            .map(
              (r: any) =>
                `<li>${esc(r.displayName || r.id || "reference")}${
                  r.grade ? ` &mdash; Grade ${esc(r.grade)}` : ""
                }${r.subject ? `, ${esc(r.subject)}` : ""}</li>`
            )
            .join("")}
        </ul>
      </div>
    `
    : "";

  // ---- Wrap everything in a document shell ----
  const fullHTML = `
    <div id="lesson-plan-html-export" style="font-family:Georgia,'Times New Roman',serif;color:#222;max-width:900px;margin:0 auto;padding:24px;">
      <h1 style="text-align:center;color:${headerText};font-size:22px;margin:0 0 16px 0;">Lesson Plan</h1>
      ${table1}
      ${table2}
      ${table3}
      ${refs}
      ${getLogoFooterHTML ? getLogoFooterHTML() : ""}
    </div>
  `;

  return fullHTML;
}

// ---- Export payload helper -------------------------------------------------

export function prepareOhpcLessonForExport(
  lesson: Partial<OhpcLessonPlan>,
  reflections: TeacherReflections,
  formData: any,
  accentColor: string,
  curriculumReferences?: any[]
) {
  const html = renderOhpcLessonHtml(lesson, reflections, {
    accentColor,
    formData,
    curriculumReferences,
  });

  // `content` preserved for downstream pipelines that expect a text fallback;
  // we serialise the JSON so saved records still round-trip.
  return {
    rawHtml: html,
    content: JSON.stringify({ lesson, reflections }, null, 2),
    formData,
    accentColor,
  };
}
