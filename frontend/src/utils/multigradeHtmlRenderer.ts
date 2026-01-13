// utils/multigradeHtmlRenderer.ts
/**
 * HTML renderer for multigrade lesson plan content
 * Generates styled HTML for PDF/DOCX export
 */

interface RenderOptions {
  accentColor: string;
  formData: {
    topic: string;
    subject: string;
    gradeLevels: string[];
    duration: string;
    totalStudents: string;
  };
}

/**
 * Generate formatted HTML from multigrade lesson plan text
 */
export function generateMultigradeHTML(text: string, options: RenderOptions): string {
  if (!text) return '';

  const { accentColor, formData } = options;

  // Clean the text
  let cleanText = text;
  if (cleanText.includes("To change it, set a different value via -sys PROMPT")) {
    cleanText = cleanText.split("To change it, set a different value via -sys PROMPT")[1] || cleanText;
  }

  // Remove AI preambles
  cleanText = cleanText.replace(/^Here is (?:the |a )?(?:complete |detailed )?(?:multigrade )?lesson plan.*?:\s*/i, '');
  cleanText = cleanText.replace(/^Below is (?:the |a )?(?:multigrade )?lesson plan.*?:\s*/i, '');

  const lines = cleanText.split('\n');
  let htmlContent = '';
  let currentIndex = 0;

  lines.forEach((line) => {
    const trimmed = line.trim();
    
    if (!trimmed) {
      htmlContent += '<div style="height: 12px;"></div>';
      return;
    }

    // Main numbered sections (1. SHARED LEARNING OBJECTIVES, etc.)
    if (trimmed.match(/^\d+\.\s+[A-Z\s]+$/)) {
      const title = trimmed.replace(/^\d+\.\s+/, '');
      htmlContent += `
        <h2 style="
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          border-radius: 0.5rem;
          color: white;
          background: linear-gradient(135deg, ${accentColor}dd, ${accentColor}bb);
        ">${trimmed}</h2>
      `;
      return;
    }

    // Subsection headings (A. Opening, B. Direct Instruction, etc.)
    if (trimmed.match(/^[A-Z]\.\s+(.+?)(\s*-\s*[A-Z\s]+)?(\s*\(\d+.*?\))?$/)) {
      htmlContent += `
        <h3 style="
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          padding: 0.875rem;
          border-left: 4px solid ${accentColor};
          border-radius: 0.375rem;
          color: ${accentColor}dd;
          background-color: ${accentColor}0d;
        ">${trimmed}</h3>
      `;
      return;
    }

    // Grade-specific sections (Grade K:, Grade 1:, etc.)
    if (trimmed.match(/^Grade\s+[K0-9]:/i)) {
      htmlContent += `
        <div style="
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          background-color: ${accentColor}08;
          border-left: 3px solid ${accentColor}99;
        ">
          <h4 style="
            font-size: 1rem;
            font-weight: 600;
            color: ${accentColor}dd;
            margin: 0;
          ">${trimmed}</h4>
        </div>
      `;
      return;
    }

    // Sub-bullets with + or - prefix (nested items)
    if (trimmed.match(/^\s*[\+\-]\s+/)) {
      const content = trimmed.replace(/^\s*[\+\-]\s+/, '');
      htmlContent += `
        <div style="
          margin-bottom: 0.5rem;
          display: flex;
          align-items: flex-start;
          margin-left: 2.5rem;
        ">
          <span style="
            margin-right: 0.75rem;
            margin-top: 0.375rem;
            font-weight: 600;
            font-size: 0.75rem;
            color: ${accentColor}77;
          ">▸</span>
          <span style="
            color: #4B5563;
            line-height: 1.625;
            font-size: 0.95rem;
          ">${content}</span>
        </div>
      `;
      return;
    }

    // Bullet points with * prefix
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

    // Bold section labels (e.g., **Materials:**, **Objectives:**)
    if (trimmed.match(/^\*\*[^*]+:\*\*/) || trimmed.match(/^\*\*[^*]+:$/)) {
      const title = trimmed.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/:$/, '');
      htmlContent += `
        <h4 style="
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          color: ${accentColor}cc;
        ">${title}:</h4>
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
      ">${formData.subject} • Multigrade</span>
    </div>
    
    <h1 style="
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin: 0.5rem 0;
      line-height: 1.2;
    ">${formData.topic || 'Multigrade Lesson Plan'}</h1>
    
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
        <span style="font-size: 0.875rem;">Grades ${formData.gradeLevels.join(', ')}</span>
      </div>
      <div style="display: flex; align-items: center;">
        <div style="
          width: 0.5rem;
          height: 0.5rem;
          background-color: rgba(165, 243, 252, 1);
          border-radius: 9999px;
          margin-right: 0.5rem;
        "></div>
        <span style="font-size: 0.875rem;">${formData.duration}</span>
      </div>
      <div style="display: flex; align-items: center;">
        <div style="
          width: 0.5rem;
          height: 0.5rem;
          background-color: rgba(165, 243, 252, 1);
          border-radius: 9999px;
          margin-right: 0.5rem;
        "></div>
        <span style="font-size: 0.875rem;">${formData.totalStudents} students</span>
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
export function prepareMultigradeForExport(
  text: string, 
  formData: any, 
  accentColor: string
) {
  const html = generateMultigradeHTML(text, {
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