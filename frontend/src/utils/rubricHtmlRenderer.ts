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
 * Parse plain text rubric (line-by-line format)
 */
function parseLinewiseRubric(text: string): {
  title: string;
  headers: string[];
  criteria: Array<{ name: string; levels: string[] }>;
  scoringSummary: string;
} | null {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  
  let title = '';
  let headers: string[] = [];
  let criteria: Array<{ name: string; levels: string[] }> = [];
  let scoringSummary = '';
  let inScoring = false;
  
  // Find title (first line with "Rubric" or "Assessment")
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    if (lines[i].toLowerCase().includes('rubric') || lines[i].toLowerCase().includes('assessment')) {
      title = lines[i].replace(/^\*\*|\*\*$/g, '');
      break;
    }
  }
  
  // Find headers (Criteria, Excellent, Proficient, etc.)
  let headerStartIdx = -1;
  
  // First, try to detect markdown table format (lines with |)
  const tableLines = lines.filter(line => line.includes('|'));
  if (tableLines.length > 0) {
    // Parse markdown table header
    const headerLine = tableLines[0];
    const headerCells = headerLine.split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0 && !cell.match(/^-+$/));
    
    if (headerCells.length > 1) {
      headerStartIdx = lines.indexOf(headerLine);
      headers.push(...headerCells);
    }
  }
  
  // Fallback: try line-by-line format
  if (headerStartIdx === -1) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase() === 'criteria') {
        headerStartIdx = i;
        headers.push('Criteria');
        
        // Next few lines should be performance levels
        for (let j = i + 1; j < Math.min(i + 7, lines.length); j++) {
          const line = lines[j];
          // Stop if we hit a long line (likely a descriptor)
          if (line.length > 30 || line.includes('(') || line.includes('pts')) break;
          // Performance level names are short and capitalized
          if (line.match(/^[A-Z][a-z]+$/) || line.match(/^(Excellent|Proficient|Developing|Beginning|Advanced|Good|Fair)$/i)) {
            headers.push(line);
          }
        }
        break;
      }
    }
  }
  
  // If no header row found, we can't parse the rubric
  if (headerStartIdx === -1) {
    return null;
  }
  
  // Parse criteria rows
  let currentCriterion: { name: string; levels: string[] } | null = null;
  
  // If we detected a markdown table, parse table rows
  if (tableLines.length > 0 && headers.length > 0) {
    // Skip header row and separator row (---)
    const dataRows = tableLines.slice(1).filter(line => !line.includes('---'));
    
    for (const row of dataRows) {
      const cells = row.split('|')
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0);
      
      if (cells.length > 1) {
        const criterionName = cells[0];
        const levels = cells.slice(1);
        
        criteria.push({
          name: criterionName,
          levels: levels
        });
      }
    }
  } else {
    // Parse line-by-line format
    for (let i = headerStartIdx + headers.length; i < lines.length; i++) {
      const line = lines[i];
      
      // Defensive: skip undefined lines
      if (line === undefined || line === null) {
        continue;
      }
      
      // Check for scoring summary
      if (line.toLowerCase().includes('scoring summary')) {
        inScoring = true;
        // Save current criterion if any
        if (currentCriterion && currentCriterion.levels.length > 0) {
          criteria.push(currentCriterion);
          currentCriterion = null;
        }
        continue;
      }
      
      if (inScoring) {
        scoringSummary += line + '\n';
        continue;
      }
      
      // Detect criterion name (short line, no parentheses, no "pts")
      if (line.length < 50 && !line.includes('(') && !line.toLowerCase().includes('pts') &&
          line.match(/^[A-Z]/) && !headers.includes(line)) {
        // Save previous criterion
        if (currentCriterion && currentCriterion.levels.length > 0) {
          criteria.push(currentCriterion);
        }
        currentCriterion = { name: line, levels: [] };
      } else if (currentCriterion && line.length > 20) {
        // This is a level descriptor
        currentCriterion.levels.push(line);
      }
    }
    
    // Save last criterion
    if (currentCriterion && currentCriterion.levels.length > 0) {
      criteria.push(currentCriterion);
    }
  }
  
  return { title, headers, criteria, scoringSummary };
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

  // Parse the rubric
  const rubricData = parseLinewiseRubric(cleanText);
  
  if (!rubricData || rubricData.criteria.length === 0) {
    return '<p style="color: red;">Failed to parse rubric. Please check the format.</p>';
  }
  
  const { title, headers, criteria, scoringSummary } = rubricData;
  
  // Generate table HTML
  const tableHTML = `
    <table style="
      width: 100%;
      border-collapse: collapse;
      margin: 2rem 0;
      border: 2px solid ${accentColor}33;
      font-size: 0.85rem;
    ">
      <thead>
        <tr style="background: linear-gradient(135deg, ${accentColor}dd, ${accentColor}bb);">
          ${headers.map((header, idx) => `
            <th style="
              padding: 1rem;
              text-align: left;
              color: white;
              font-weight: 600;
              font-size: 0.9rem;
              border: 1px solid rgba(255, 255, 255, 0.2);
              ${idx === 0 ? 'width: 15%;' : `width: ${85 / (headers.length - 1)}%;`}
            ">${header}</th>
          `).join('')}
        </tr>
      </thead>
      <tbody>
        ${criteria.map((criterion, rowIdx) => `
          <tr style="${rowIdx % 2 === 0 ? `background-color: ${accentColor}05;` : 'background-color: white;'}">
            <td style="
              padding: 1rem;
              border: 1px solid ${accentColor}22;
              vertical-align: top;
              font-weight: 700;
              font-size: 0.9rem;
              color: ${accentColor}dd;
              background-color: ${accentColor}0d;
            ">${criterion.name}</td>
            ${criterion.levels.map(level => `
              <td style="
                padding: 0.875rem;
                border: 1px solid ${accentColor}22;
                vertical-align: top;
                line-height: 1.5;
                color: #374151;
              ">${level}</td>
            `).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  // Generate scoring summary HTML
  let scoringSummaryHTML = '';
  if (scoringSummary.trim()) {
    const summaryLines = scoringSummary.split('\n').filter(l => l.trim());
    
    scoringSummaryHTML = `
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
          if (!trimmed) return '';
          return `<p style="color: #374151; line-height: 1.625; margin-bottom: 0.5rem; font-size: 0.95rem;">${trimmed}</p>`;
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
      size: A4 landscape;
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
    ">${title || formData.assignmentTitle}</h1>
    
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
        <span style="font-size: 0.875rem;">${headers.length - 1} Performance Levels</span>
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
      // <span style="opacity: 0.75;">Generated on</span> ${new Date().toLocaleDateString()}
    </div>
  </div>

  <!-- Content -->
  <div style="margin-top: 2rem;">
    ${tableHTML}
    ${scoringSummaryHTML}
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