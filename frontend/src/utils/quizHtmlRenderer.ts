// utils/quizHtmlRenderer.ts
/**
 * Unified HTML renderer for quiz content
 * Generates HTML that matches the frontend display exactly
 * Used for both screen display and PDF/DOCX export
 */

interface RenderOptions {
  accentColor: string;
  formData: {
    subject: string;
    gradeLevel: string;
    numberOfQuestions: string;
    questionTypes: string[];
  };
}

export function generateQuizHTML(text: string, options: RenderOptions): string {
  if (!text) return '';

  const { accentColor, formData } = options;

  // Clean the text (remove system prompts, etc.)
  let cleanText = text;
  if (cleanText.includes("To change it, set a different value via -sys PROMPT")) {
    cleanText = cleanText.split("To change it, set a different value via -sys PROMPT")[1] || cleanText;
  }

  // Remove AI preambles
  cleanText = cleanText.replace(/^Here are (?:the )?\d+ questions? for (?:the )?.*?:\s*/i, '');
  cleanText = cleanText.replace(/^Below (?:is|are) (?:the )?\d+ questions? for (?:the )?.*?:\s*/i, '');
  cleanText = cleanText.replace(/^Here (?:is|are) (?:the )?\d+ questions? for (?:the )?.*?:\s*/i, '');
  cleanText = cleanText.replace(/^The following (?:is|are|questions? )?.*?:\s*/i, '');

  const lines = cleanText.split('\n');
  let htmlContent = '';

  lines.forEach((line) => {
    const trimmed = line.trim();
    
    if (!trimmed) {
      htmlContent += '<div style="height: 12px;"></div>';
      return;
    }

    // Main section headings (e.g., **Questions**, **Answer Key**)
    if (trimmed.match(/^\*\*(.+)\*\*$/)) {
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

    // Question numbers (e.g., Question 1:)
    if (trimmed.match(/^Question \d+:/)) {
      htmlContent += `
        <h3 style="
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          color: ${accentColor}cc;
          background-color: ${accentColor}0d;
        ">${trimmed}</h3>
      `;
      return;
    }

    // Answer options (A), B), C), D))
    if (trimmed.match(/^[A-D]\)/)) {
      const letter = trimmed.substring(0, 2);
      const content = trimmed.substring(2).trim();
      htmlContent += `
        <div style="
          margin-left: 1.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: flex-start;
        ">
          <span style="
            margin-right: 0.75rem;
            font-weight: 600;
            color: ${accentColor}cc;
          ">${letter}</span>
          <span style="color: #374151;">${content}</span>
        </div>
      `;
      return;
    }

    // Bullet points (not bold)
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

  // Build complete HTML document with header
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
  ">
    <div style="
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom right, ${accentColor}, ${accentColor}dd, ${accentColor}bb);
    "></div>
    
    <div style="
      position: relative;
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
        ">${formData.subject}</span>
      </div>
      
      <h1 style="
        font-size: 2rem;
        font-weight: 700;
        color: white;
        margin: 0.5rem 0;
        line-height: 1.2;
      ">${formData.numberOfQuestions}-Question Assessment</h1>
      
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
          <span style="font-size: 0.875rem;">Grade ${formData.gradeLevel}</span>
        </div>
        <div style="display: flex; align-items: center;">
          <div style="
            width: 0.5rem;
            height: 0.5rem;
            background-color: rgba(165, 243, 252, 1);
            border-radius: 9999px;
            margin-right: 0.5rem;
          "></div>
          <span style="font-size: 0.875rem;">${formData.questionTypes.join(', ')}</span>
        </div>
      </div>
      
      <div style="
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
      ">
        <div style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        ">
          <div style="
            color: rgba(207, 250, 254, 1);
            font-size: 0.875rem;
          ">
            <span style="opacity: 0.75;">Generated on</span> ${new Date().toLocaleDateString()}
          </div>
          <div style="
            display: flex;
            align-items: center;
            color: rgba(167, 243, 208, 1);
            font-size: 0.875rem;
          ">
            <div style="
              width: 0.5rem;
              height: 0.5rem;
              background-color: rgba(134, 239, 172, 1);
              border-radius: 9999px;
              margin-right: 0.5rem;
            "></div>
            <span>Generation Complete</span>
          </div>
        </div>
      </div>
    </div>
    
    <div style="
      position: absolute;
      top: 0;
      right: 0;
      width: 8rem;
      height: 8rem;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 9999px;
      transform: translate(50%, -50%);
    "></div>
    <div style="
      position: absolute;
      bottom: 0;
      left: 0;
      width: 6rem;
      height: 6rem;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 9999px;
      transform: translate(-50%, 50%);
    "></div>
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
export function prepareQuizForExport(text: string, formData: any, accentColor: string) {
  const html = generateQuizHTML(text, {
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