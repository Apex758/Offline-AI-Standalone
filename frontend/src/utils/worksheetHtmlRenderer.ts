// utils/worksheetHtmlRenderer.ts
/**
 * Unified HTML renderer for worksheet content
 * Generates HTML that matches the frontend template display exactly
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
    selectedTemplate?: string;
    worksheetTitle?: string;
    topic?: string;
    includeImages?: boolean;
    imageMode?: string;
    imagePlacement?: string;
  };
  generatedImages?: string[];
}

export function generateWorksheetHTML(worksheet: ParsedWorksheet, options: RenderOptions): string {
  if (!worksheet) return '';

  const { formData, generatedImages = [] } = options;
  const selectedTemplate = formData.selectedTemplate || 'list-based';
  const worksheetTitle = formData.worksheetTitle || worksheet.metadata.title;
  const generatedImage = generatedImages.length > 0 ? generatedImages[0] : null;

  // Build HTML content based on selected template
  let contentHTML = '';

  // Template-specific rendering to match preview exactly
  if (selectedTemplate === 'multiple-choice') {
    contentHTML = generateMultipleChoiceHTML(worksheet, formData, worksheetTitle, generatedImage);
  } else if (selectedTemplate === 'comprehension') {
    contentHTML = generateComprehensionHTML(worksheet, formData, worksheetTitle, generatedImage);
  } else if (selectedTemplate === 'matching') {
    contentHTML = generateMatchingHTML(worksheet, formData, worksheetTitle);
  } else if (selectedTemplate === 'list-based') {
    contentHTML = generateListBasedHTML(worksheet, formData, worksheetTitle, generatedImage);
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
  ${contentHTML}
</body>
</html>
  `;

  return fullHTML;
}

// Template-specific HTML generators matching the React components exactly
function generateMultipleChoiceHTML(worksheet: ParsedWorksheet, formData: any, worksheetTitle: string, generatedImage: string | null): string {
  const includeImages = formData.includeImages || false;
  const imageMode = formData.imageMode || 'one-per-question';
  
  return `
    <div style="background-color: white; padding: 1.5rem; max-width: 56rem; margin: 0 auto; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 0.875rem;">
      <!-- Header -->
      <div style="border-bottom: 2px solid #1f2937; padding-bottom: 1rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h1 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem;">${worksheetTitle}</h1>
            <p style="color: #4b5563; margin: 0.25rem 0;">
              <strong>Subject:</strong> ${formData.subject} | <strong>Grade:</strong> ${formData.gradeLevel}
            </p>
            <p style="color: #4b5563; margin: 0.25rem 0;">
              <strong>Topic:</strong> ${formData.topic || 'N/A'}
            </p>
          </div>
          <div style="text-align: right;">
            <p style="color: #4b5563; margin: 0.25rem 0;">Name: ____________________</p>
            <p style="color: #4b5563; margin: 0.25rem 0;">Date: ____________________</p>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div style="margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.125rem; font-weight: 600; color: #1f2937; margin-bottom: 0.5rem;">Instructions:</h2>
        <p style="color: #374151; margin: 0;">
          Read each question and circle the correct answer (A, B, C, or D).
        </p>
      </div>

      <!-- Shared Image -->
      ${includeImages && imageMode === 'shared' && generatedImage ? `
        <div style="margin-bottom: 1.5rem; text-align: center;">
          <img src="${generatedImage}" alt="Generated worksheet image" style="width: 12rem; height: 8rem; object-fit: contain; border: 1px solid #d1d5db; border-radius: 0.25rem; display: block; margin: 0 auto;" />
        </div>
      ` : ''}

      <!-- Questions -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${worksheet.questions.map((q, i) => `
          <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem;">
            <div style="display: flex; align-items: flex-start; gap: 1rem;">
              <div style="flex-shrink: 0; width: 2rem; height: 2rem; background-color: #dbeafe; border-radius: 9999px; display: flex; align-items: center; justify-content: center; color: #1d4ed8; font-weight: 600;">
                ${i + 1}
              </div>
              <div style="flex: 1;">
                <div style="margin-bottom: 0.75rem;">
                  <p style="color: #1f2937; font-weight: 500; margin: 0 0 0.5rem 0;">
                    ${q.question}
                  </p>
                  ${includeImages && imageMode === 'one-per-question' && generatedImage ? `
                    <div style="margin-top: 0.5rem; margin-bottom: 0.5rem;">
                      <img src="${generatedImage}" alt="Question image" style="width: 8rem; height: 5rem; object-fit: contain; border: 1px solid #d1d5db; border-radius: 0.25rem;" />
                    </div>
                  ` : ''}
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">
                  ${(q.options || []).map((option, optIndex) => `
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <div style="width: 1.5rem; height: 1.5rem; border: 2px solid #d1d5db; border-radius: 9999px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 0.75rem; font-weight: 600;">${String.fromCharCode(65 + optIndex)}</span>
                      </div>
                      <span style="color: #374151;">${option}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Footer -->
      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #d1d5db;">
        <p style="text-align: center; color: #9ca3af; font-size: 0.75rem; margin: 0;">
          Worksheet generated for educational purposes
        </p>
      </div>
    </div>
  `;
}

function generateComprehensionHTML(worksheet: ParsedWorksheet, formData: any, worksheetTitle: string, generatedImage: string | null): string {
  const includeImages = formData.includeImages || false;
  const imagePlacement = formData.imagePlacement || 'large-centered';
  
  return `
    <div style="background-color: white; padding: 1.5rem; max-width: 56rem; margin: 0 auto; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 0.875rem;">
      <!-- Header -->
      <div style="border-bottom: 2px solid #1f2937; padding-bottom: 1rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h1 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem;">${worksheetTitle}</h1>
            <p style="color: #4b5563; margin: 0.25rem 0;">
              <strong>Subject:</strong> ${formData.subject} | <strong>Grade:</strong> ${formData.gradeLevel}
            </p>
            <p style="color: #4b5563; margin: 0.25rem 0;">
              <strong>Topic:</strong> ${formData.topic || 'N/A'}
            </p>
          </div>
          <div style="text-align: right;">
            <p style="color: #4b5563; margin: 0.25rem 0;">Name: ____________________</p>
            <p style="color: #4b5563; margin: 0.25rem 0;">Date: ____________________</p>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div style="margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.125rem; font-weight: 600; color: #1f2937; margin-bottom: 0.5rem;">Instructions:</h2>
        <p style="color: #374151; margin: 0;">
          Read the passage carefully and answer the questions that follow.
        </p>
      </div>

      <!-- Reading Passage -->
      ${worksheet.passage ? `
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.125rem; font-weight: 600; color: #1f2937; margin-bottom: 1rem;">Reading Passage</h3>
          ${includeImages && imagePlacement === 'large-centered' && generatedImage ? `
            <div style="text-align: center; margin-bottom: 1rem;">
              <img src="${generatedImage}" alt="Passage illustration" style="width: 16rem; height: 12rem; object-fit: contain; border: 1px solid #d1d5db; border-radius: 0.25rem; display: block; margin: 0 auto;" />
            </div>
          ` : ''}
          <div style="color: #374151; line-height: 1.7; font-size: 1rem;">
            ${worksheet.passage.replace(/\n/g, '<br>')}
          </div>
        </div>
      ` : ''}

      <!-- Questions -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${worksheet.questions.map((q, i) => `
          <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem;">
            <div style="display: flex; align-items: flex-start; gap: 1rem;">
              <div style="flex-shrink: 0; width: 2rem; height: 2rem; background-color: #dbeafe; border-radius: 9999px; display: flex; align-items: center; justify-content: center; color: #1d4ed8; font-weight: 600;">
                ${i + 1}
              </div>
              <div style="flex: 1;">
                <p style="color: #1f2937; font-weight: 500; margin: 0 0 0.5rem 0;">
                  ${q.question}
                </p>
                ${q.options ? `
                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-top: 0.75rem;">
                    ${q.options.map((option, optIndex) => `
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 1.5rem; height: 1.5rem; border: 2px solid #d1d5db; border-radius: 9999px; display: flex; align-items: center; justify-content: center;">
                          <span style="font-size: 0.75rem; font-weight: 600;">${String.fromCharCode(65 + optIndex)}</span>
                        </div>
                        <span style="color: #374151;">${option}</span>
                      </div>
                    `).join('')}
                  </div>
                ` : `
                  <div style="margin-top: 0.5rem; padding: 0.5rem; border-bottom: 1px solid #d1d5db;">
                    <span style="color: #9ca3af;">Answer: _______________________________________________</span>
                  </div>
                `}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Footer -->
      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #d1d5db;">
        <p style="text-align: center; color: #9ca3af; font-size: 0.75rem; margin: 0;">
          Worksheet generated for educational purposes
        </p>
      </div>
    </div>
  `;
}

function generateMatchingHTML(worksheet: ParsedWorksheet, formData: any, worksheetTitle: string): string {
  return `
    <div style="background-color: white; padding: 1.5rem; max-width: 56rem; margin: 0 auto; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 0.875rem;">
      <!-- Header -->
      <div style="border-bottom: 2px solid #1f2937; padding-bottom: 1rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h1 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem;">${worksheetTitle}</h1>
            <p style="color: #4b5563; margin: 0.25rem 0;">
              <strong>Subject:</strong> ${formData.subject} | <strong>Grade:</strong> ${formData.gradeLevel}
            </p>
            <p style="color: #4b5563; margin: 0.25rem 0;">
              <strong>Topic:</strong> ${formData.topic || 'N/A'}
            </p>
          </div>
          <div style="text-align: right;">
            <p style="color: #4b5563; margin: 0.25rem 0;">Name: ____________________</p>
            <p style="color: #4b5563; margin: 0.25rem 0;">Date: ____________________</p>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div style="margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.125rem; font-weight: 600; color: #1f2937; margin-bottom: 0.5rem;">Instructions:</h2>
        <p style="color: #374151; margin: 0;">
          Match each item in Column A with the correct item in Column B. Write the letter of your answer in the space provided.
        </p>
      </div>

      <!-- Matching Columns -->
      ${worksheet.matchingItems ? `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          <!-- Column A -->
          <div>
            <h3 style="font-size: 1.125rem; font-weight: 600; color: #1f2937; margin-bottom: 1rem; text-align: center; background-color: #dbeafe; padding: 0.5rem; border-radius: 0.25rem;">Column A</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${worksheet.matchingItems.columnA.map((item, i) => `
                <div style="display: flex; align-items: center; padding: 0.75rem; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.25rem;">
                  <span style="font-weight: 600; color: #1d4ed8; margin-right: 0.75rem; min-width: 2rem;">${i + 1}.</span>
                  <span style="color: #374151; flex: 1;">${item}</span>
                  <span style="color: #9ca3af; margin-left: 0.5rem;">____</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Column B -->
          <div>
            <h3 style="font-size: 1.125rem; font-weight: 600; color: #1f2937; margin-bottom: 1rem; text-align: center; background-color: #dbeafe; padding: 0.5rem; border-radius: 0.25rem;">Column B</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${worksheet.matchingItems.columnB.map((item, i) => `
                <div style="display: flex; align-items: center; padding: 0.75rem; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.25rem;">
                  <span style="font-weight: 600; color: #1d4ed8; margin-right: 0.75rem; min-width: 2rem;">${String.fromCharCode(65 + i)}.</span>
                  <span style="color: #374151;">${item}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #d1d5db;">
        <p style="text-align: center; color: #9ca3af; font-size: 0.75rem; margin: 0;">
          Worksheet generated for educational purposes
        </p>
      </div>
    </div>
  `;
}

function generateListBasedHTML(worksheet: ParsedWorksheet, formData: any, worksheetTitle: string, generatedImage: string | null): string {
  const includeImages = formData.includeImages || false;
  const imageMode = formData.imageMode || 'one-per-question';
  const questionType = formData.questionType || '';
  
  return `
    <div style="width: 100%; max-width: 56rem; margin: 0 auto; background-color: white; padding: 2rem; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;">
      <!-- Header -->
      <div style="border-bottom: 2px solid #1f2937; padding-bottom: 1rem; margin-bottom: 1.5rem;">
        <h1 style="font-size: 1.5rem; font-weight: 700; text-align: center; margin-bottom: 0.5rem;">${worksheetTitle}</h1>
        <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: #4b5563;">
          <span>Subject: ${formData.subject}</span>
          <span>Grade: ${formData.gradeLevel}</span>
          <span>Name: _________________</span>
        </div>
      </div>

      <!-- Word Bank -->
      ${worksheet.wordBank && worksheet.wordBank.length > 0 ? `
        <div style="margin-bottom: 2rem; padding: 1rem; border: 2px solid #9ca3af; border-radius: 0.5rem; background-color: #f9fafb;">
          <h3 style="font-weight: 700; font-size: 1.125rem; margin-bottom: 0.5rem;">Word Bank</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
            ${worksheet.wordBank.map(word => `
              <span style="padding: 0.25rem 0.75rem; background-color: white; border: 1px solid #d1d5db; border-radius: 0.25rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">${word}</span>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Instructions -->
      <div style="margin-bottom: 1.5rem; padding: 0.75rem; background-color: #eff6ff; border-left: 4px solid #3b82f6;">
        <p style="font-size: 0.875rem; margin: 0;">
          ${questionType === 'Word Bank'
            ? 'Use the words from the word bank above to fill in the blanks in each sentence.'
            : questionType === 'True / False'
            ? 'Read each statement carefully and circle True or False.'
            : questionType === 'Fill in the Blank'
            ? 'Complete each sentence by filling in the blank with the correct word or phrase.'
            : questionType === 'Short Answer'
            ? 'Answer each question in 2-4 complete sentences.'
            : 'Answer the following questions.'}
        </p>
      </div>

      <!-- Shared Image -->
      ${includeImages && imageMode === 'shared' && generatedImage ? `
        <div style="margin-bottom: 1.5rem; display: flex; justify-content: center;">
          <img src="${generatedImage}" alt="Worksheet illustration" style="max-width: 28rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
        </div>
      ` : ''}

      <!-- Questions -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${worksheet.questions.map((q, i) => `
          <div style="border-bottom: 1px solid #d1d5db; padding-bottom: 1rem;">
            <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
              <span style="font-weight: 700;">${i + 1}.</span>
              <div style="flex: 1;">
                <p style="color: #1f2937; line-height: 1.6; margin: 0 0 0.5rem 0;">
                  ${q.question}
                </p>
                ${includeImages && imageMode === 'one-per-question' && i === 0 && generatedImage ? `
                  <div style="margin-top: 0.75rem; margin-bottom: 0.5rem;">
                    <img src="${generatedImage}" alt="Question illustration" style="max-width: 20rem; border-radius: 0.25rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);" />
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Footer -->
      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #d1d5db; text-align: center; font-size: 0.75rem; color: #9ca3af;">
        <p style="margin: 0;">Generated for educational purposes</p>
      </div>
    </div>
  `;
}

// Export function to use with backend
export function prepareWorksheetForExport(content: string, parsedWorksheet: ParsedWorksheet | null, formData: any, accentColor: string, generatedImages?: string[]) {
  // Use parsedWorksheet if available, otherwise we can't export (need structured data)
  if (!parsedWorksheet) {
    throw new Error('Parsed worksheet required for export');
  }

  const html = generateWorksheetHTML(parsedWorksheet, {
    accentColor,
    formData,
    generatedImages
  });

  return {
    rawHtml: html,
    content: content,
    parsedWorksheet: parsedWorksheet,
    formData: formData,
    accentColor: accentColor
  };
}
