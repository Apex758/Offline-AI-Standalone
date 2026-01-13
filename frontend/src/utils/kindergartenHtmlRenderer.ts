// utils/kindergartenHtmlRenderer.ts
/**
 * HTML renderer for kindergarten plan content
 * Generates styled HTML for PDF/DOCX export
 */

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
}

/**
 * Generate formatted HTML from kindergarten plan text
 */
export function generateKindergartenHTML(text: string, options: RenderOptions): string {
  if (!text) return '';

  const { accentColor, formData } = options;

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
      <span style="opacity: 0.75;">Generated on</span> ${new Date().toLocaleDateString()}
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
  accentColor: string
) {
  const html = generateKindergartenHTML(text, {
    accentColor,
    formData
  });

  return {
    rawHtml: html,
    content: text,
    formData: formData,
    accentColor: accentColor
  };
}