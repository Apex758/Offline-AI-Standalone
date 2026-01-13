// utils/rubricHtmlRenderer.ts
/**
 * HTML renderer for rubric content
 * Generates styled HTML for PDF/DOCX export
 */

interface RenderOptions {
  accentColor: string;
  formData: {
    assignmentTitle: string;
    assignmentType: string;
    subject: string;
    gradeLevel: string;
    performanceLevels: string;
    includePointValues: boolean;
  };
}

/**
 * Parse markdown table to structured data
 */
function parseMarkdownTable(text: string): { headers: string[], rows: string[][] } | null {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  
  // Find table start (line with |)
  const tableStart = lines.findIndex(line => line.startsWith('|'));
  if (tableStart === -1) return null;
  
  // Extract header
  const headerLine = lines[tableStart];
  const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);
  
  // Skip separator line (| --- | --- |)
  const dataStart = tableStart + 2;
  
  // Extract data rows
  const rows: string[][] = [];
  for (let i = dataStart; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith('|')) break;
    
    const cells = line.split('|').map(c => c.trim()).filter(c => c);
    if (cells.length > 0) rows.push(cells);
  }
  
  return { headers, rows };
}

/**
 * Generate formatted HTML from rubric text
 */
export function generateRubricHTML(text: string, options: RenderOptions): string {
  if (!text) return '';

  const { accentColor, formData } = options;

  // Clean the text
  let cleanText = text;
  if (cleanText.includes("To change it, set a different value via -sys PROMPT")) {
    cleanText = cleanText.split("To change it, set a different value via -sys PROMPT")[1] || cleanText;
  }

  // Remove AI preambles
  cleanText = cleanText.replace(/^Here is (?:the |a )?(?:complete |detailed )?rubric.*?:\s*/i, '');
  cleanText = cleanText.replace(/^Below is (?:the |a )?rubric.*?:\s*/i, '');

  // Extract title
  let rubricTitle = formData.assignmentTitle || 'Assessment Rubric';
  const titleMatch = cleanText.match(/^\*\*(.+?)\*\*$/m);
  if (titleMatch && titleMatch[1]) {
    rubricTitle = titleMatch[1].trim();
  }

  // Parse the markdown table
  const tableData = parseMarkdownTable(cleanText);
  
  let tableHTML = '';
  if (tableData) {
    const { headers, rows } = tableData;
    
    // Generate table HTML
    tableHTML = `
      <table style="
        width: 100%;
        border-collapse: collapse;
        margin: 2rem 0;
        border: 2px solid ${accentColor}33;
      ">
        <thead>
          <tr style="background: linear-gradient(135deg, ${accentColor}dd, ${accentColor}bb);">
            ${headers.map((header, idx) => `
              <th style="
                padding: 1rem;
                text-align: left;
                color: white;
                font-weight: 600;
                border: 1px solid rgba(255, 255, 255, 0.2);
                ${idx === 0 ? 'width: 20%;' : `width: ${80 / (headers.length - 1)}%;`}
              ">${header}</th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, rowIdx) => `
            <tr style="${rowIdx % 2 === 0 ? `background-color: ${accentColor}05;` : 'background-color: white;'}">
              ${row.map((cell, cellIdx) => `
                <td style="
                  padding: 1rem;
                  border: 1px solid ${accentColor}22;
                  vertical-align: top;
                  line-height: 1.6;
                  ${cellIdx === 0 ? `font-weight: 600; color: ${accentColor}dd; background-color: ${accentColor}0d;` : 'color: #374151;'}
                ">${cell}</td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // Extract scoring summary
  let scoringSummary = '';
  const summaryMatch = cleanText.match(/\*\*Scoring Summary\*\*\s*[\s\S]*$/);
  if (summaryMatch) {
    const summaryText = summaryMatch[0].replace(/^\*\*Scoring Summary\*\*\s*/, '');
    const summaryLines = summaryText.split('\n').filter(l => l.trim());
    
    scoringSummary = `
      <div style="
        margin-top: 2rem;
        padding: 1.5rem;
        border-radius: 0.5rem;
        background-color: ${accentColor}0d;
        border: 1px solid ${accentColor}33;
      ">
        <h3 style="
          font-size: 1.125rem;
          font-weight: 700;
          color: ${accentColor}dd;
          margin-bottom: 1rem;
        ">Scoring Summary</h3>
        ${summaryLines.map(line => {
          const trimmed = line.trim();
          if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
            const content = trimmed.replace(/^[\*\-]\s*/, '');
            return `
              <div style="
                margin-bottom: 0.5rem;
                display: flex;
                align-items: flex-start;
              ">
                <span style="
                  margin-right: 0.75rem;
                  margin-top: 0.375rem;
                  font-weight: 700;
                  color: ${accentColor}99;
                ">•</span>
                <span style="color: #374151; line-height: 1.625;">${content}</span>
              </div>
            `;
          }
          return `<p style="color: #374151; line-height: 1.625; margin-bottom: 0.5rem;">${trimmed}</p>`;
        }).join('')}
      </div>
    `;
  }

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
      ">${formData.subject} • ${formData.assignmentType}</span>
    </div>
    
    <h1 style="
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin: 0.5rem 0;
      line-height: 1.2;
    ">${rubricTitle}</h1>
    
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
        <span style="font-size: 0.875rem;">${formData.gradeLevel}</span>
      </div>
      <div style="display: flex; align-items: center;">
        <div style="
          width: 0.5rem;
          height: 0.5rem;
          background-color: rgba(165, 243, 252, 1);
          border-radius: 9999px;
          margin-right: 0.5rem;
        "></div>
        <span style="font-size: 0.875rem;">${formData.performanceLevels} Performance Levels</span>
      </div>
      ${formData.includePointValues ? `
        <div style="display: flex; align-items: center;">
          <div style="
            width: 0.5rem;
            height: 0.5rem;
            background-color: rgba(165, 243, 252, 1);
            border-radius: 9999px;
            margin-right: 0.5rem;
          "></div>
          <span style="font-size: 0.875rem;">With Point Values</span>
        </div>
      ` : ''}
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
    ${tableHTML}
    ${scoringSummary}
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
export function prepareRubricForExport(
  text: string, 
  formData: any, 
  accentColor: string
) {
  const html = generateRubricHTML(text, {
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