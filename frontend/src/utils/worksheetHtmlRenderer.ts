// utils/worksheetHtmlRenderer.ts
/**
 * Unified HTML renderer for worksheet content
 * Generates HTML that matches the frontend display exactly
 * Used for both screen display and PDF/DOCX export
 */

import { ParsedWorksheet } from '../types/worksheet';

interface RenderOptions {
  accentColor: string;
  formData: {
    subject: string;
    gradeLevel: string;
    questionCount: string;
    questionType: string;
  };
}

export function generateWorksheetHTML(worksheet: ParsedWorksheet, options: RenderOptions): string {
  if (!worksheet) return '';

  const { accentColor, formData } = options;

  // Build HTML content based on worksheet type
  let contentHTML = '';

  // Header with metadata
  contentHTML += `
    <h1 style="
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: ${accentColor}cc;
      text-align: center;
    ">${worksheet.metadata.title}</h1>

    <div style="
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 2rem;
      font-size: 0.875rem;
      color: #6b7280;
    ">
      <div><strong>Subject:</strong> ${worksheet.metadata.subject}</div>
      <div><strong>Grade:</strong> ${worksheet.metadata.gradeLevel}</div>
      <div><strong>Questions:</strong> ${worksheet.metadata.totalQuestions}</div>
    </div>
  `;

  // Instructions
  if (worksheet.metadata.instructions) {
    contentHTML += `
      <div style="
        background-color: ${accentColor}0d;
        border-left: 4px solid ${accentColor}cc;
        padding: 1rem;
        margin-bottom: 2rem;
      ">
        <h3 style="
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: ${accentColor}cc;
        ">Instructions</h3>
        <p style="color: #374151; line-height: 1.6;">${worksheet.metadata.instructions}</p>
      </div>
    `;
  }

  // Word Bank (if present)
  if (worksheet.wordBank && worksheet.wordBank.length > 0) {
    contentHTML += `
      <div style="
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-bottom: 2rem;
      ">
        <h3 style="
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: ${accentColor}cc;
        ">Word Bank</h3>
        <div style="
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        ">
          ${worksheet.wordBank.map(word => `
            <span style="
              background-color: ${accentColor}1a;
              color: ${accentColor}cc;
              padding: 0.25rem 0.75rem;
              border-radius: 9999px;
              font-size: 0.875rem;
              font-weight: 500;
            ">${word}</span>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Passage (for comprehension worksheets)
  if (worksheet.passage) {
    contentHTML += `
      <div style="
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-bottom: 2rem;
      ">
        <h3 style="
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: ${accentColor}cc;
        ">Reading Passage</h3>
        <div style="
          color: #374151;
          line-height: 1.7;
          font-size: 1rem;
        ">${worksheet.passage.replace(/\n/g, '<br>')}</div>
      </div>
    `;
  }

  // Matching Items
  if (worksheet.matchingItems) {
    contentHTML += `
      <div style="margin-bottom: 2rem;">
        <h3 style="
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: ${accentColor}cc;
        ">Matching Exercise</h3>

        <div style="display: flex; gap: 2rem;">
          <div style="flex: 1;">
            <h4 style="
              font-size: 1rem;
              font-weight: 600;
              margin-bottom: 0.5rem;
              color: ${accentColor}cc;
            ">Column A</h4>
            <div style="space-y: 0.5rem;">
              ${worksheet.matchingItems.columnA.map((item, i) => `
                <div style="
                  display: flex;
                  align-items: center;
                  padding: 0.5rem;
                  background-color: ${accentColor}0d;
                  border-radius: 0.25rem;
                ">
                  <span style="
                    font-weight: 600;
                    color: ${accentColor}cc;
                    margin-right: 0.75rem;
                    min-width: 1.5rem;
                  ">${i + 1}.</span>
                  <span style="color: #374151;">${item}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="flex: 1;">
            <h4 style="
              font-size: 1rem;
              font-weight: 600;
              margin-bottom: 0.5rem;
              color: ${accentColor}cc;
            ">Column B</h4>
            <div style="space-y: 0.5rem;">
              ${worksheet.matchingItems.columnB.map((item, i) => `
                <div style="
                  display: flex;
                  align-items: center;
                  padding: 0.5rem;
                  background-color: ${accentColor}0d;
                  border-radius: 0.25rem;
                ">
                  <span style="
                    font-weight: 600;
                    color: ${accentColor}cc;
                    margin-right: 0.75rem;
                    min-width: 1.5rem;
                  ">${String.fromCharCode(65 + i)}.</span>
                  <span style="color: #374151;">${item}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // Regular Questions
    contentHTML += `
      <div>
        <h3 style="
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: ${accentColor}cc;
        ">Questions</h3>

        <div style="space-y: 1.5rem;">
          ${worksheet.questions.map((question, index) => {
            let questionHTML = `
              <div style="margin-bottom: 1.5rem;">
                <h4 style="
                  font-size: 1.125rem;
                  font-weight: 600;
                  margin-bottom: 0.75rem;
                  color: ${accentColor}cc;
                ">Question ${index + 1}</h4>
                <p style="
                  color: #374151;
                  line-height: 1.6;
                  margin-bottom: 0.75rem;
                  font-size: 1rem;
                ">${question.question}</p>
            `;

            // Handle different question types
            if (question.type === 'multiple-choice' && question.options) {
              questionHTML += `
                <div style="margin-left: 1rem; margin-bottom: 1rem;">
                  ${question.options.map((option, i) => `
                    <div style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 0.5rem;
                    ">
                      <span style="
                        font-weight: 600;
                        color: ${accentColor}cc;
                        margin-right: 0.75rem;
                        min-width: 1.5rem;
                      ">${String.fromCharCode(65 + i)})</span>
                      <span style="color: #374151;">${option}</span>
                    </div>
                  `).join('')}
                </div>
              `;
            } else if (question.type === 'true-false') {
              questionHTML += `
                <div style="margin-left: 1rem; margin-bottom: 1rem;">
                  <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-weight: 600; color: ${accentColor}cc; margin-right: 0.75rem; min-width: 1.5rem;">A)</span>
                    <span style="color: #374151;">True</span>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span style="font-weight: 600; color: ${accentColor}cc; margin-right: 0.75rem; min-width: 1.5rem;">B)</span>
                    <span style="color: #374151;">False</span>
                  </div>
                </div>
              `;
            }

            // Answer section for teacher reference
            if (question.correctAnswer !== undefined && question.correctAnswer !== null && question.correctAnswer !== '') {
              let answerText = '';
              if (question.type === 'multiple-choice' && typeof question.correctAnswer === 'number') {
                answerText = `${String.fromCharCode(65 + question.correctAnswer)}) ${question.options?.[question.correctAnswer] || 'N/A'}`;
              } else if (question.type === 'true-false') {
                answerText = question.correctAnswer === 'true' ? 'True' : 'False';
              } else {
                answerText = String(question.correctAnswer);
              }

              questionHTML += `
                <div style="
                  background-color: #f0f9ff;
                  border: 1px solid #0ea5e9;
                  border-radius: 0.25rem;
                  padding: 0.75rem;
                  margin-top: 0.75rem;
                ">
                  <strong style="color: #0ea5e9;">Answer:</strong> ${answerText}
                  ${question.explanation ? `<br><strong style="color: #0ea5e9;">Explanation:</strong> ${question.explanation}` : ''}
                </div>
              `;
            }

            questionHTML += '</div>';
            return questionHTML;
          }).join('')}
        </div>
      </div>
    `;
  }

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
      ">${worksheet.metadata.title}</h1>

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
          <span style="font-size: 0.875rem;">${formData.questionType}</span>
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

  return fullHTML;
}

// Export function to use with backend
export function prepareWorksheetForExport(content: string, parsedWorksheet: ParsedWorksheet | null, formData: any, accentColor: string) {
  // Use parsedWorksheet if available, otherwise we can't export (need structured data)
  if (!parsedWorksheet) {
    throw new Error('Parsed worksheet required for export');
  }

  const html = generateWorksheetHTML(parsedWorksheet, {
    accentColor,
    formData
  });

  return {
    rawHtml: html,
    content: content,
    parsedWorksheet: parsedWorksheet,
    formData: formData,
    accentColor: accentColor
  };
}