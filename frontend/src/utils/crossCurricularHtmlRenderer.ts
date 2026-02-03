// utils/crossCurricularHtmlRenderer.ts
/**
 * HTML renderer for cross-curricular plan content
 * Generates styled HTML for PDF/DOCX export
 */

import type { ParsedCrossCurricularPlan, SubjectObjective, CrossCurricularActivity } from '../components/CrossCurricularEditor';

interface RenderOptions {
  accentColor: string;
  formData: {
    lessonTitle: string;
    gradeLevel: string;
    duration: string;
    bigIdea: string;
    integrationModel: string;
    primarySubject: string;
    supportingSubjects: string;
  };
  parsedPlan?: ParsedCrossCurricularPlan;
}

// Subject color scheme for visual distinction
const SUBJECT_COLORS: { [key: string]: string } = {
  'Mathematics': '#3b82f6',
  'Language Arts': '#8b5cf6',
  'Science': '#10b981',
  'Social Studies': '#f59e0b',
  'Arts': '#ec4899',
  'Physical Education': '#06b6d4',
  'Technology': '#6366f1',
};

function getSubjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] || '#6b7280';
}

/**
 * Generate formatted HTML from cross-curricular plan text or parsed plan
 */
export function generateCrossCurricularHTML(text: string, options: RenderOptions): string {
  if (!text) return '';

  const { accentColor, formData, parsedPlan } = options;

  // Clean the text
  let cleanText = text;
  if (cleanText.includes("To change it, set a different value via -sys PROMPT")) {
    cleanText = cleanText.split("To change it, set a different value via -sys PROMPT")[1] || cleanText;
  }

  // Remove AI preambles
  cleanText = cleanText.replace(/^Here is (?:the |a )?(?:complete |detailed )?cross-curricular plan.*?:\s*/i, '');
  cleanText = cleanText.replace(/^Below is (?:the |a )?cross-curricular plan.*?:\s*/i, '');

  // Extract plan title
  let planTitle = formData.lessonTitle || 'Cross-Curricular Plan';

  // Integration model badge text
  const integrationModel = formData.integrationModel || 'Integrated Learning';

  // Parse content if we have plain text
  let htmlContent = '';

  if (parsedPlan) {
    // Use structured parsed plan for better rendering
    htmlContent = generateStructuredHTML(parsedPlan, accentColor);
  } else {
    // Fall back to text parsing
    htmlContent = generateTextBasedHTML(cleanText, accentColor);
  }

  // Build metadata display
  const allSubjects = [formData.primarySubject];
  if (formData.supportingSubjects) {
    const supporting = formData.supportingSubjects.split(',').map(s => s.trim()).filter(Boolean);
    allSubjects.push(...supporting);
  }

  const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 1.5cm;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #374151;
    }
  </style>
</head>
<body>
  <!-- Header with gradient background -->
  <div style="
    background: linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%);
    color: white;
    padding: 2rem;
    border-radius: 0.75rem;
    margin-bottom: 2rem;
  ">
    <div style="
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(4px);
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
    ">
      ${integrationModel}
    </div>

    <h1 style="
      font-size: 1.875rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: white;
    ">${planTitle}</h1>

    ${formData.bigIdea ? `
      <div style="
        font-size: 1rem;
        opacity: 0.9;
        margin-bottom: 1rem;
        font-style: italic;
      ">
        Big Idea: ${formData.bigIdea}
      </div>
    ` : ''}

    <div style="
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.3);
    ">
      <div>
        <div style="font-size: 0.75rem; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.05em;">Grade Level</div>
        <div style="font-weight: 600;">${formData.gradeLevel || 'N/A'}</div>
      </div>
      <div>
        <div style="font-size: 0.75rem; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.05em;">Duration</div>
        <div style="font-weight: 600;">${formData.duration || 'N/A'}</div>
      </div>
      <div>
        <div style="font-size: 0.75rem; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.05em;">Primary Subject</div>
        <div style="font-weight: 600;">${formData.primarySubject || 'N/A'}</div>
      </div>
    </div>

    <div style="
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    ">
      <div style="font-size: 0.75rem; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Integrated Subjects</div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${allSubjects.map(subject => `
          <span style="
            background: rgba(255, 255, 255, 0.2);
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
            border: 1px solid rgba(255, 255, 255, 0.3);
          ">${subject}</span>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- Content -->
  <div style="margin-top: 2rem;">
    ${htmlContent}
  </div>

  <!-- Footer -->
  <div style="
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
    color: #9ca3af;
    font-size: 0.75rem;
    text-align: center;
  ">
    Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
  </div>
</body>
</html>
  `;

  return fullHTML;
}

/**
 * Generate HTML from structured parsed plan data
 */
function generateStructuredHTML(plan: ParsedCrossCurricularPlan, accentColor: string): string {
  let html = '';

  // Learning Standards section
  if (plan.learningStandards) {
    html += `
      <h2 style="
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        color: ${accentColor}dd;
        border-bottom: 2px solid ${accentColor}33;
      ">Learning Standards</h2>
      <div style="line-height: 1.8;">${formatTextToHTML(plan.learningStandards)}</div>
    `;
  }

  // Subject Objectives section
  if (plan.subjectObjectives && plan.subjectObjectives.length > 0) {
    html += `
      <h2 style="
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        color: ${accentColor}dd;
        border-bottom: 2px solid ${accentColor}33;
      ">Subject Objectives</h2>
      <div style="display: grid; gap: 1rem;">
        ${plan.subjectObjectives.map(obj => {
          const subjectColor = getSubjectColor(obj.subject);
          return `
            <div style="
              padding: 1rem;
              border-radius: 0.5rem;
              border-left: 4px solid ${subjectColor};
              background-color: ${subjectColor}10;
            ">
              <div style="
                font-weight: 600;
                color: ${subjectColor};
                margin-bottom: 0.5rem;
                font-size: 0.875rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
              ">${obj.subject}</div>
              <div style="color: #374151;">${obj.objective}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Cross-Curricular Activities section
  if (plan.crossCurricularActivities && plan.crossCurricularActivities.length > 0) {
    html += `
      <h2 style="
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        color: ${accentColor}dd;
        border-bottom: 2px solid ${accentColor}33;
      ">Cross-Curricular Activities</h2>
      <div style="display: grid; gap: 1.5rem;">
        ${plan.crossCurricularActivities.map((activity, idx) => `
          <div style="
            padding: 1.5rem;
            border-radius: 0.75rem;
            border: 1px solid #e5e7eb;
            background-color: #fafafa;
          ">
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 0.75rem;
            ">
              <h3 style="
                font-size: 1.125rem;
                font-weight: 600;
                color: ${accentColor}cc;
                margin: 0;
              ">${idx + 1}. ${activity.name}</h3>
              ${activity.duration ? `
                <span style="
                  background: ${accentColor}20;
                  color: ${accentColor};
                  padding: 0.25rem 0.75rem;
                  border-radius: 9999px;
                  font-size: 0.875rem;
                  font-weight: 500;
                ">${activity.duration}</span>
              ` : ''}
            </div>
            <div style="color: #4b5563; line-height: 1.7; margin-bottom: 1rem;">
              ${activity.description}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${activity.subjects.map(subject => {
                const subjectColor = getSubjectColor(subject);
                return `
                  <span style="
                    background: ${subjectColor}20;
                    color: ${subjectColor};
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.375rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                  ">${subject}</span>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Materials section
  if (plan.materials && plan.materials.length > 0) {
    html += `
      <h2 style="
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        color: ${accentColor}dd;
        border-bottom: 2px solid ${accentColor}33;
      ">Materials Needed</h2>
      <div style="display: grid; gap: 0.5rem;">
        ${plan.materials.map(mat => `
          <div style="
            display: flex;
            align-items: center;
            padding: 0.75rem;
            background-color: #f9fafb;
            border-radius: 0.5rem;
          ">
            <span style="color: #374151;">${mat.name}</span>
            ${mat.subjects && mat.subjects.length > 0 ? `
              <div style="margin-left: auto; display: flex; gap: 0.25rem;">
                ${mat.subjects.map(subject => `
                  <span style="
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: ${getSubjectColor(subject)};
                    display: inline-block;
                  " title="${subject}"></span>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  // Assessment Strategies
  if (plan.assessmentStrategies && plan.assessmentStrategies.length > 0) {
    html += `
      <h2 style="
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        color: ${accentColor}dd;
        border-bottom: 2px solid ${accentColor}33;
      ">Assessment Strategies</h2>
      <ul style="list-style: none; padding: 0; margin: 0; display: grid; gap: 0.5rem;">
        ${plan.assessmentStrategies.map(strategy => `
          <li style="
            padding: 0.75rem;
            padding-left: 2rem;
            position: relative;
            background-color: #f9fafb;
            border-radius: 0.5rem;
          ">
            <span style="
              position: absolute;
              left: 0.75rem;
              color: ${accentColor};
              font-weight: bold;
            ">•</span>
            ${strategy}
          </li>
        `).join('')}
      </ul>
    `;
  }

  // Key Vocabulary
  if (plan.keyVocabulary) {
    html += `
      <h2 style="
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        color: ${accentColor}dd;
        border-bottom: 2px solid ${accentColor}33;
      ">Key Vocabulary</h2>
      <div style="
        padding: 1rem;
        background: linear-gradient(135deg, ${accentColor}10 0%, ${accentColor}05 100%);
        border-radius: 0.75rem;
        border: 1px solid ${accentColor}30;
      ">
        ${formatTextToHTML(plan.keyVocabulary)}
      </div>
    `;
  }

  // Differentiation Notes
  if (plan.differentiationNotes) {
    html += `
      <h2 style="
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        color: ${accentColor}dd;
        border-bottom: 2px solid ${accentColor}33;
      ">Differentiation</h2>
      <div style="line-height: 1.8;">${formatTextToHTML(plan.differentiationNotes)}</div>
    `;
  }

  // Reflection Prompts
  if (plan.reflectionPrompts) {
    html += `
      <h2 style="
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        color: ${accentColor}dd;
        border-bottom: 2px solid ${accentColor}33;
      ">Reflection Prompts</h2>
      <div style="
        padding: 1rem;
        background-color: #f3f4f6;
        border-radius: 0.5rem;
        border-left: 4px solid ${accentColor};
        font-style: italic;
        line-height: 1.7;
      ">
        ${formatTextToHTML(plan.reflectionPrompts)}
      </div>
    `;
  }

  return html;
}

/**
 * Generate HTML from plain text (fallback when parsed plan is not available)
 */
function generateTextBasedHTML(text: string, accentColor: string): string {
  const lines = text.split('\n');
  let htmlContent = '';

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      htmlContent += '<div style="height: 12px;"></div>';
      return;
    }

    // Main section headings (surrounded by **)
    if (trimmed.match(/^\*\*(.+?)\*\*$/)) {
      const title = trimmed.replace(/\*\*/g, '');
      htmlContent += `
        <h2 style="
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          color: ${accentColor}dd;
          border-bottom: 2px solid ${accentColor}33;
        ">${title}</h2>
      `;
      return;
    }

    // Field labels (start with ** but don't end with **)
    if (trimmed.match(/^\*\*[^*]+:\*\*/) || trimmed.match(/^\*\*[^*]+:$/)) {
      const title = trimmed.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/:$/, '');
      htmlContent += `
        <h3 style="
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border-left: 4px solid ${accentColor};
          color: ${accentColor}cc;
          background-color: ${accentColor}0d;
        ">${title}:</h3>
      `;
      return;
    }

    // Bullet points
    if (trimmed.match(/^[\*\-\•]\s+/)) {
      const content = trimmed.replace(/^[\*\-\•]\s+/, '');
      htmlContent += `
        <div style="
          display: flex;
          margin-bottom: 0.5rem;
          padding-left: 1rem;
        ">
          <span style="
            color: ${accentColor};
            margin-right: 0.5rem;
            font-weight: bold;
          ">•</span>
          <span>${formatInlineStyles(content)}</span>
        </div>
      `;
      return;
    }

    // Numbered lists
    if (trimmed.match(/^\d+\.\s+/)) {
      const content = trimmed.replace(/^\d+\.\s+/, '');
      const number = trimmed.match(/^(\d+)\./)?.[1] || '1';
      htmlContent += `
        <div style="
          display: flex;
          margin-bottom: 0.5rem;
          padding-left: 1rem;
        ">
          <span style="
            color: ${accentColor};
            margin-right: 0.5rem;
            font-weight: 600;
            min-width: 1.5rem;
          ">${number}.</span>
          <span>${formatInlineStyles(content)}</span>
        </div>
      `;
      return;
    }

    // Regular paragraph
    htmlContent += `<p style="margin-bottom: 0.75rem; line-height: 1.7;">${formatInlineStyles(trimmed)}</p>`;
  });

  return htmlContent;
}

/**
 * Format text to HTML with inline styles
 */
function formatTextToHTML(text: string): string {
  if (!text) return '';
  return text
    .split('\n')
    .map(line => formatInlineStyles(line.trim()))
    .filter(line => line)
    .map(line => `<p style="margin: 0.5rem 0;">${line}</p>`)
    .join('');
}

/**
 * Format inline markdown styles (bold, italic)
 */
function formatInlineStyles(text: string): string {
  // Bold: **text** or __text__
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/_(.+?)_/g, '<em>$1</em>');

  return text;
}

// Export function to use with backend
export function prepareCrossCurricularForExport(
  text: string,
  formData: any,
  accentColor: string,
  parsedPlan?: ParsedCrossCurricularPlan
) {
  const html = generateCrossCurricularHTML(text, {
    accentColor,
    formData,
    parsedPlan
  });

  return {
    rawHtml: html,
    content: text,
    formData: formData,
    accentColor: accentColor,
    parsedPlan: parsedPlan
  };
}
