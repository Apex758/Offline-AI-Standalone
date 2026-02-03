// utils/kindergartenHtmlRenderer.ts
/**
 * HTML renderer for kindergarten plan content
 * Generates styled HTML for PDF/DOCX export
 */

import type { ParsedKindergartenPlan } from '../components/KindergartenEditor';

interface RenderOptions {
  accentColor: string;
  formData: {
    lessonTopic: string;
    curriculumUnit: string;
    week: string;
    dayOfWeek: string;
    date: string;
    ageGroup: string;
    students: string;
    duration: string;
  };
  parsedPlan?: ParsedKindergartenPlan;
}

// Activity type colors for visual distinction
const ACTIVITY_TYPE_COLORS: { [key: string]: string } = {
  'circle-time': '#3b82f6',
  'centers': '#8b5cf6',
  'art': '#ec4899',
  'music': '#10b981',
  'story': '#f59e0b',
  'outdoor': '#06b6d4',
  'snack': '#ef4444',
};

function getActivityColor(typeId: string): string {
  return ACTIVITY_TYPE_COLORS[typeId] || '#6b7280';
}

/**
 * Generate HTML from structured parsed plan data
 */
function generateStructuredHTML(plan: ParsedKindergartenPlan, accentColor: string): string {
  const { metadata } = plan;

  // Build metadata display
  const metadataHTML = `
    <div style="
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
      color: rgba(207, 250, 254, 1);
      margin-top: 1rem;
    ">
      <div style="display: flex; align-items: center;">
        <div style="
          width: 0.5rem;
          height: 0.5rem;
          background-color: rgba(165, 243, 252, 1);
          border-radius: 9999px;
          margin-right: 0.5rem;
        "></div>
        <span style="font-size: 0.875rem;">${metadata.ageGroup}</span>
      </div>
      <div style="display: flex; align-items: center;">
        <div style="
          width: 0.5rem;
          height: 0.5rem;
          background-color: rgba(165, 243, 252, 1);
          border-radius: 9999px;
          margin-right: 0.5rem;
        "></div>
        <span style="font-size: 0.875rem;">Week ${metadata.week}, ${metadata.dayOfWeek}</span>
      </div>
      <div style="display: flex; align-items: center;">
        <div style="
          width: 0.5rem;
          height: 0.5rem;
          background-color: rgba(165, 243, 252, 1);
          border-radius: 9999px;
          margin-right: 0.5rem;
        "></div>
        <span style="font-size: 0.875rem;">${metadata.duration} minutes</span>
      </div>
      <div style="display: flex; align-items: center;">
        <div style="
          width: 0.5rem;
          height: 0.5rem;
          background-color: rgba(165, 243, 252, 1);
          border-radius: 9999px;
          margin-right: 0.5rem;
        "></div>
        <span style="font-size: 0.875rem;">${metadata.students} students</span>
      </div>
    </div>
  `;

  // Build content sections
  let contentHTML = '';

  // Learning Objectives section
  if (plan.learningObjectives && plan.learningObjectives.length > 0) {
    contentHTML += `
      <h2 style="
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        color: ${accentColor}dd;
        border-bottom: 2px solid ${accentColor}33;
      ">Learning Objectives</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${plan.learningObjectives.map(obj => `
          <li style="
            display: flex;
            align-items: flex-start;
            margin-bottom: 0.75rem;
            padding-left: 1.5rem;
            position: relative;
          ">
            <span style="
              position: absolute;
              left: 0;
              color: ${accentColor};
              font-weight: bold;
            ">•</span>
            <span style="color: #374151; line-height: 1.6;">${obj}</span>
          </li>
        `).join('')}
      </ul>
    `;
  }

  // Developmental Domains section
  if (plan.developmentalDomains && plan.developmentalDomains.length > 0) {
    contentHTML += `
      <h2 style="
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        color: ${accentColor}dd;
        border-bottom: 2px solid ${accentColor}33;
      ">Developmental Domains</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${plan.developmentalDomains.map(domain => `
          <span style="
            background: ${accentColor}15;
            color: ${accentColor}cc;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
            border: 1px solid ${accentColor}30;
          ">${domain}</span>
        `).join('')}
      </div>
    `;
  }

  // Activities section
  if (plan.activities && plan.activities.length > 0) {
    contentHTML += `
      <h2 style="
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        color: ${accentColor}dd;
        border-bottom: 2px solid ${accentColor}33;
      ">Activities</h2>
      <div style="display: grid; gap: 1rem;">
        ${plan.activities.map((activity, idx) => {
          const activityColor = getActivityColor(activity.type);
          return `
            <div style="
              padding: 1.25rem;
              border-radius: 0.75rem;
              border: 1px solid #e5e7eb;
              background-color: #fafafa;
              border-left: 4px solid ${activityColor};
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
                  color: ${activityColor};
                  margin: 0;
                ">${activity.name}</h3>
                ${activity.duration ? `
                  <span style="
                    background: ${activityColor}20;
                    color: ${activityColor};
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.875rem;
                    font-weight: 500;
                  ">${activity.duration}</span>
                ` : ''}
              </div>
              <p style="color: #4b5563; line-height: 1.7; margin: 0 0 0.5rem 0;">${activity.description}</p>
              ${activity.learningGoals ? `
                <div style="
                  margin-top: 0.75rem;
                  padding: 0.75rem;
                  background-color: ${activityColor}10;
                  border-radius: 0.5rem;
                  font-size: 0.875rem;
                  color: #374151;
                ">
                  <strong>Learning Goals:</strong> ${activity.learningGoals}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Materials section
  if (plan.materials && plan.materials.length > 0) {
    contentHTML += `
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
            justify-content: space-between;
            padding: 0.75rem;
            background-color: #f9fafb;
            border-radius: 0.5rem;
            border: 1px solid ${mat.ageAppropriate ? '#10b98130' : '#ef444430'};
          ">
            <span style="color: #374151;">${mat.name}</span>
            ${mat.ageAppropriate ? `
              <span style="
                background: #10b98120;
                color: #10b981;
                padding: 0.25rem 0.5rem;
                border-radius: 0.375rem;
                font-size: 0.75rem;
                font-weight: 600;
              ">Age-Appropriate</span>
            ` : ''}
          </div>
          ${mat.safetyNotes ? `
            <div style="
              margin-top: -0.25rem;
              margin-left: 0.5rem;
              padding: 0.5rem;
              font-size: 0.875rem;
              color: #ef4444;
              font-style: italic;
            ">⚠️ ${mat.safetyNotes}</div>
          ` : ''}
        `).join('')}
      </div>
    `;
  }

  // Assessment Observations section
  if (plan.assessmentObservations && plan.assessmentObservations.length > 0) {
    contentHTML += `
      <h2 style="
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        color: ${accentColor}dd;
        border-bottom: 2px solid ${accentColor}33;
      ">Assessment Observations</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${plan.assessmentObservations.map(obs => `
          <li style="
            display: flex;
            align-items: flex-start;
            margin-bottom: 0.75rem;
            padding-left: 1.5rem;
            position: relative;
          ">
            <span style="
              position: absolute;
              left: 0;
              color: ${accentColor};
              font-weight: bold;
            ">•</span>
            <span style="color: #374151; line-height: 1.6;">${obs}</span>
          </li>
        `).join('')}
      </ul>
    `;
  }

  // Differentiation Notes section
  if (plan.differentiationNotes) {
    contentHTML += `
      <h2 style="
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        color: ${accentColor}dd;
        border-bottom: 2px solid ${accentColor}33;
      ">Differentiation</h2>
      <div style="
        padding: 1rem;
        background-color: #f3f4f6;
        border-radius: 0.5rem;
        border-left: 4px solid ${accentColor};
        line-height: 1.7;
        color: #374151;
      ">${plan.differentiationNotes}</div>
    `;
  }

  // Prerequisites section
  if (plan.prerequisites) {
    contentHTML += `
      <h2 style="
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        color: ${accentColor}dd;
        border-bottom: 2px solid ${accentColor}33;
      ">Prerequisites</h2>
      <div style="line-height: 1.7; color: #374151;">${plan.prerequisites}</div>
    `;
  }

  // Build complete HTML document
  return `
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
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <!-- Header Section -->
  <div style="
    position: relative;
    overflow: hidden;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
    background: linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 50%, ${accentColor}bb 100%);
    padding: 2rem;
  ">
    <div style="
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background-color: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      margin-bottom: 1rem;
    ">
      <span style="
        color: white;
        font-size: 0.875rem;
        font-weight: 500;
      ">${metadata.curriculumUnit}</span>
    </div>

    <h1 style="
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin: 0.5rem 0;
      line-height: 1.2;
    ">${metadata.title}</h1>

    ${metadataHTML}

    <div style="
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      color: rgba(207, 250, 254, 1);
      font-size: 0.875rem;
    ">
      <span style="opacity: 0.75;">Generated on</span> ${new Date().toLocaleDateString()}
    </div>
  </div>

  <!-- Content -->
  <div style="margin-top: 2rem;">
    ${contentHTML}
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
}

/**
 * Generate formatted HTML from kindergarten plan text
 */
export function generateKindergartenHTML(text: string, options: RenderOptions): string {
  if (!text) return '';

  const { accentColor, formData, parsedPlan } = options;

  // If we have a parsed plan, use structured rendering
  if (parsedPlan) {
    return generateStructuredHTML(parsedPlan, accentColor);
  }

  // Clean the text
  let cleanText = text;
  if (cleanText.includes("To change it, set a different value via -sys PROMPT")) {
    cleanText = cleanText.split("To change it, set a different value via -sys PROMPT")[1] || cleanText;
  }

  // Remove AI preambles
  cleanText = cleanText.replace(/^Here is (?:the |a )?(?:complete |detailed )?kindergarten plan.*?:\s*/i, '');
  cleanText = cleanText.replace(/^Below is (?:the |a )?kindergarten plan.*?:\s*/i, '');

  // Extract the plan title
  let planTitle = formData.lessonTopic || 'Kindergarten Plan';

  // Always remove the "KINDERGARTEN LESSON PLAN" line from content if present
  cleanText = cleanText.replace(/^KINDERGARTEN LESSON PLAN\s*$/m, '').trim();

  const lines = cleanText.split('\n');
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

    // Activity items with special highlighting
    if (trimmed.match(/^(Circle Time|Art Activity|Story Time|Music|Outdoor Play|Learning Centers|Small Group|Snack Time).*:/i)) {
      htmlContent += `
        <div style="
          margin-top: 1rem;
          margin-bottom: 0.75rem;
        ">
          <div style="
            border-left: 4px solid ${accentColor}cc;
            padding: 1rem;
            border-radius: 0 0.5rem 0.5rem 0;
            background: linear-gradient(to right, ${accentColor}1a, ${accentColor}0d);
          ">
            <h4 style="
              font-weight: 700;
              font-size: 1.125rem;
              color: ${accentColor}dd;
            ">${trimmed}</h4>
          </div>
        </div>
      `;
      return;
    }

    // Bullet points
    if (trimmed.match(/^\s*\*\s+/) && !trimmed.startsWith('**')) {
      const content = trimmed.replace(/^\s*\*\s+/, '');
      htmlContent += `
        <div style="
          margin-bottom: 0.5rem;
          display: flex;
          align-items: flex-start;
          margin-left: 1rem;
        ">
          <span style="
            margin-right: 0.75rem;
            margin-top: 0.375rem;
            font-weight: 700;
            font-size: 0.875rem;
            color: ${accentColor}99;
          ">•</span>
          <span style="
            color: #374151;
            line-height: 1.625;
          ">${content}</span>
        </div>
      `;
      return;
    }

    // Numbered items
    if (trimmed.match(/^\d+\./)) {
      const number = trimmed.match(/^\d+\./)?.[0] || '';
      const content = trimmed.replace(/^\d+\.\s*/, '');
      htmlContent += `
        <div style="
          margin-bottom: 0.75rem;
          display: flex;
          align-items: flex-start;
          margin-left: 1rem;
        ">
          <span style="
            margin-right: 0.75rem;
            font-weight: 600;
            min-width: 2rem;
            border-radius: 0.25rem;
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
            color: ${accentColor}cc;
            background-color: ${accentColor}0d;
          ">${number}</span>
          <span style="
            color: #374151;
            line-height: 1.625;
            padding-top: 0.25rem;
          ">${content}</span>
        </div>
      `;
      return;
    }

    // Bold inline text
    if (trimmed.includes('**')) {
      const formatted = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong style="color: ' + accentColor + 'cc;">$1</strong>');
      htmlContent += `
        <p style="
          color: #374151;
          line-height: 1.625;
          margin-bottom: 0.75rem;
        ">${formatted}</p>
      `;
      return;
    }

    // Regular paragraphs
    if (trimmed.length > 0) {
      htmlContent += `
        <p style="
          color: #374151;
          line-height: 1.625;
          margin-bottom: 0.75rem;
        ">${trimmed}</p>
      `;
    }
  });

  // Build complete HTML document
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
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <!-- Header Section -->
  <div style="
    position: relative;
    overflow: hidden;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
    background: linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 50%, ${accentColor}bb 100%);
    padding: 2rem;
  ">
    <div style="
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background-color: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      margin-bottom: 1rem;
    ">
      <span style="
        color: white;
        font-size: 0.875rem;
        font-weight: 500;
      ">${formData.curriculumUnit}</span>
    </div>

    <h1 style="
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin: 0.5rem 0;
      line-height: 1.2;
    ">${planTitle}</h1>

    <div style="
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
      color: rgba(207, 250, 254, 1);
      margin-top: 1rem;
    ">
      <div style="display: flex; align-items: center;">
        <div style="
          width: 0.5rem;
          height: 0.5rem;
          background-color: rgba(165, 243, 252, 1);
          border-radius: 9999px;
          margin-right: 0.5rem;
        "></div>
        <span style="font-size: 0.875rem;">${formData.ageGroup}</span>
      </div>
      <div style="display: flex; align-items: center;">
        <div style="
          width: 0.5rem;
          height: 0.5rem;
          background-color: rgba(165, 243, 252, 1);
          border-radius: 9999px;
          margin-right: 0.5rem;
        "></div>
        <span style="font-size: 0.875rem;">Week ${formData.week}, ${formData.dayOfWeek}</span>
      </div>
      <div style="display: flex; align-items: center;">
        <div style="
          width: 0.5rem;
          height: 0.5rem;
          background-color: rgba(165, 243, 252, 1);
          border-radius: 9999px;
          margin-right: 0.5rem;
        "></div>
        <span style="font-size: 0.875rem;">${formData.duration} minutes</span>
      </div>
      <div style="display: flex; align-items: center;">
        <div style="
          width: 0.5rem;
          height: 0.5rem;
          background-color: rgba(165, 243, 252, 1);
          border-radius: 9999px;
          margin-right: 0.5rem;
        "></div>
        <span style="font-size: 0.875rem;">${formData.students} students</span>
      </div>
    </div>

    <div style="
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      color: rgba(207, 250, 254, 1);
      font-size: 0.875rem;
    ">
      // <span style="opacity: 0.75;">Generated on</span> ${new Date().toLocaleDateString()}
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

// Export function to use with backend
export function prepareKindergartenForExport(
  text: string,
  formData: any,
  accentColor: string,
  parsedPlan?: ParsedKindergartenPlan
) {
  const html = generateKindergartenHTML(text, {
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