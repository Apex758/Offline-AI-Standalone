import { getLogoFooterHTML } from './logoBase64';

// utils/quizHtmlRenderer.ts
/**
 * Unified HTML renderer for quiz content with conditional rendering
 * Supports toggling answer keys, explanations, and correct answer highlighting
 */

interface RenderOptions {
  accentColor: string;
  formData: {
    subject: string;
    gradeLevel: string;
    numberOfQuestions: string;
    questionTypes: string[];
    strand?: string;
  };
  showAnswerKey?: boolean;
  showExplanations?: boolean;
  boldCorrectAnswers?: boolean;
  studentInfo?: { name: string; id: string };
  quizId?: string;
  /** When true, renders scan-friendly fillable bubbles for MC and TF questions */
  scanMode?: boolean;
  /** Base64-encoded QR code PNG to embed in the page header */
  qrCodeBase64?: string;
}

interface ParsedQuiz {
  questions: QuizQuestion[];
  answerKey: AnswerKeyEntry[];
}

interface QuizQuestion {
  number: number;
  text: string;
  options: QuizOption[];
}

interface QuizOption {
  letter: string;
  text: string;
}

interface AnswerKeyEntry {
  questionNumber: number;
  correctAnswer: string;
  explanation: string[];
}

/**
 * Phase 1: Parse quiz content into structured data
 * Handles INLINE format where answers appear immediately after questions
 */
function parseQuizContent(text: string): ParsedQuiz {
  // Clean the text
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
  const questions: QuizQuestion[] = [];
  const answerKey: AnswerKeyEntry[] = [];
  
  let currentQuestion: QuizQuestion | null = null;
  let currentAnswerEntry: AnswerKeyEntry | null = null;
  let parsingOptions = false;
  let parsingAnswer = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    
    if (!trimmed) continue;

    // New question - starts with "Question N:"
    if (trimmed.match(/^Question (\d+):/)) {
      // Save previous question and answer
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      if (currentAnswerEntry) {
        answerKey.push(currentAnswerEntry);
      }

      // Start new question
      const num = parseInt(trimmed.match(/^Question (\d+):/)?.[1] || '0');
      let questionText = trimmed.replace(/^Question \d+:\s*/, '');

      // Strip "(Sample Answer)" and any trailing example text from open-ended questions
      questionText = questionText
        .replace(/\s*\(Sample\s*Answer\).*$/i, '')
        .replace(/\s*Example of a good response:.*$/i, '')
        .trim();
      
      currentQuestion = { 
        number: num, 
        text: questionText, 
        options: [] 
      };
      
      currentAnswerEntry = { 
        questionNumber: num, 
        correctAnswer: '', 
        explanation: [] 
      };
      
      parsingOptions = questionText.length > 0; // If question text exists, next lines might be options
      parsingAnswer = false;
      continue;
    }

    // Answer options - A), B), C), D)
    if (trimmed.match(/^[A-D]\)/) && currentQuestion) {
      const letter = trimmed.substring(0, 1);
      const text = trimmed.substring(2).trim();
      currentQuestion.options.push({ letter, text });
      parsingOptions = true;
      continue;
    }

    // Correct Answer
    if (trimmed.match(/^Correct Answer:\s*([A-D]|True|False)/i) && currentAnswerEntry) {
      const answerMatch = trimmed.match(/^Correct Answer:\s*([A-D]|True|False)/i);
      if (answerMatch) {
        currentAnswerEntry.correctAnswer = answerMatch[1];
      }
      parsingOptions = false;
      parsingAnswer = true;
      continue;
    }

    // Sample Answer (for open-ended)
    if (trimmed.match(/^Sample Answer:/i)) {
      parsingOptions = false;
      parsingAnswer = true;
      continue;
    }

    // Answer (for fill-in-blank)
    if (trimmed.match(/^Answer:/i) && !trimmed.match(/^Correct Answer:/i) && currentAnswerEntry) {
      const answerText = trimmed.replace(/^Answer:\s*/i, '');
      if (answerText) {
        currentAnswerEntry.correctAnswer = answerText;
      }
      parsingAnswer = true;
      continue;
    }

    // Explanation
    if (trimmed.match(/^Explanation:/i) && currentAnswerEntry) {
      const explanationText = trimmed.replace(/^Explanation:\s*/i, '');
      if (explanationText) {
        currentAnswerEntry.explanation.push(explanationText);
      }
      parsingAnswer = true;
      continue;
    }

    // Key Points
    if (trimmed.match(/^Key Points:/i)) {
      parsingAnswer = true;
      continue;
    }

    // Points (metadata - skip)
    if (trimmed.match(/^Points:/i)) {
      continue;
    }

    // Continuation of question text (before options start)
    if (currentQuestion && !parsingOptions && !parsingAnswer && currentQuestion.options.length === 0) {
      currentQuestion.text += ' ' + trimmed;
    }
    
    // Continuation of explanation or answer content
    if (parsingAnswer && currentAnswerEntry && trimmed) {
      currentAnswerEntry.explanation.push(trimmed);
    }
  }

  // Push last items
  if (currentQuestion) {
    questions.push(currentQuestion);
  }
  if (currentAnswerEntry) {
    answerKey.push(currentAnswerEntry);
  }

  return { questions, answerKey };
}

/**
 * Phase 2: Render HTML with conditional options
 */
export function generateQuizHTML(text: string, options: RenderOptions): string {
  if (!text) return '';

  const {
    accentColor,
    formData,
    showAnswerKey = true,
    showExplanations = true,
    boldCorrectAnswers = false,
    studentInfo,
    quizId,
    scanMode = false,
    qrCodeBase64
  } = options;

  // Parse the quiz
  const parsed = parseQuizContent(text);
  
  // Create correct answer lookup map
  const correctAnswersMap = new Map<number, string>();
  parsed.answerKey.forEach(entry => {
    correctAnswersMap.set(entry.questionNumber, entry.correctAnswer);
  });

  let htmlContent = '';

  // Render Questions Section
  htmlContent += `
    <h2 style="
      font-size: 1.25rem;
      font-weight: 700;
      margin-top: 2rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      color: ${accentColor}dd;
      border-bottom: 2px solid ${accentColor}33;
    ">Questions</h2>
  `;

  parsed.questions.forEach(question => {
    const correctLetter = correctAnswersMap.get(question.number);
    
    // Question heading
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
      ">Question ${question.number}:</h3>
    `;

    // Question text
    if (question.text) {
      htmlContent += `
        <p style="
          color: #374151;
          line-height: 1.625;
          margin-bottom: 0.75rem;
          margin-left: 1.5rem;
        ">${question.text}</p>
      `;
    }

    // Options
    if (scanMode && question.options.length > 0) {
      // Scan-friendly mode: render fillable bubbles
      // Check if this looks like True/False (2 options with True/False text)
      const isTrueFalse = question.options.length === 2 &&
        question.options.some(o => /^true$/i.test(o.text.trim())) &&
        question.options.some(o => /^false$/i.test(o.text.trim()));

      if (isTrueFalse) {
        htmlContent += `
          <div style="
            margin-left: 1.5rem;
            margin-bottom: 0.75rem;
            margin-top: 0.5rem;
            display: flex;
            align-items: center;
            gap: 2rem;
          ">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <div style="
                width: 1.25rem; height: 1.25rem;
                border: 2px solid #374151;
                border-radius: 3px;
                display: inline-block;
              "></div>
              <span style="font-size: 0.95rem; color: #374151; font-weight: 500;">True</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <div style="
                width: 1.25rem; height: 1.25rem;
                border: 2px solid #374151;
                border-radius: 3px;
                display: inline-block;
              "></div>
              <span style="font-size: 0.95rem; color: #374151; font-weight: 500;">False</span>
            </div>
          </div>
        `;
      } else {
        // Multiple choice: render as bubble row
        htmlContent += `
          <div style="
            margin-left: 1.5rem;
            margin-bottom: 0.75rem;
            margin-top: 0.5rem;
            display: flex;
            flex-wrap: wrap;
            gap: 1.25rem;
          ">
        `;
        question.options.forEach(option => {
          htmlContent += `
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <div style="
                width: 1.25rem; height: 1.25rem;
                border: 2px solid #374151;
                border-radius: 50%;
                display: inline-block;
              "></div>
              <span style="font-size: 0.95rem; color: #374151; font-weight: 500;">${option.letter})</span>
              <span style="font-size: 0.95rem; color: #374151;">${option.text}</span>
            </div>
          `;
        });
        htmlContent += `</div>`;
      }
    } else {
      // Standard rendering (teacher/preview mode)
      question.options.forEach(option => {
        const isCorrect = boldCorrectAnswers && option.letter === correctLetter;

        htmlContent += `
          <div style="
            margin-left: 1.5rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: flex-start;
          ">
            <span style="
              margin-right: 0.75rem;
              font-weight: ${isCorrect ? '700' : '600'};
              color: ${isCorrect ? accentColor : accentColor + 'cc'};
              ${isCorrect ? `background-color: ${accentColor}15; padding: 0.25rem 0.5rem; border-radius: 0.25rem;` : ''}
            ">${option.letter})</span>
            <span style="
              color: #374151;
              font-weight: ${isCorrect ? '600' : 'normal'};
            ">${option.text}</span>
          </div>
        `;
      });
    }

    // Inline: Correct Answer + Explanation (Teacher Version)
    if (showAnswerKey) {
      const answerEntry = parsed.answerKey.find(a => a.questionNumber === question.number);
      if (answerEntry && answerEntry.correctAnswer) {
        htmlContent += `
          <div style="
            margin-left: 1.5rem;
            margin-top: 0.75rem;
            margin-bottom: 0.25rem;
          ">
            <span style="font-weight: 600; color: #374151;">Correct Answer: </span>
            <span style="font-weight: 700; color: ${accentColor};">${answerEntry.correctAnswer}</span>
          </div>
        `;
      }
      if (showExplanations && answerEntry && answerEntry.explanation.length > 0) {
        htmlContent += `
          <div style="
            margin-left: 1.5rem;
            margin-top: 0.5rem;
            margin-bottom: 1rem;
            background-color: ${accentColor}0d;
            border-left: 3px solid ${accentColor}66;
            padding: 0.625rem 0.75rem;
            border-radius: 0 0.375rem 0.375rem 0;
          ">
            <span style="font-weight: 600; color: ${accentColor};">Explanation: </span>
            <span style="color: #374151; line-height: 1.625;">${answerEntry.explanation.join(' ')}</span>
          </div>
        `;
      }
    }
  });

  // Standalone Answer Key section removed — answers now render inline above.
  if (false) {
    htmlContent += `
      <div style="height: 24px;"></div>
      <h2 style="
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        color: ${accentColor}dd;
        border-bottom: 2px solid ${accentColor}33;
      ">Answer Key</h2>
    `;

    parsed.answerKey.forEach(entry => {
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
        ">Question ${entry.questionNumber}:</h3>
      `;

      // Correct answer
      htmlContent += `
        <div style="
          margin-left: 1.5rem;
          margin-bottom: 0.75rem;
        ">
          <span style="font-weight: 600; color: ${accentColor};">Correct Answer: </span>
          <span style="
            font-weight: 700;
            color: ${accentColor};
            background-color: ${accentColor}15;
            padding: 0.25rem 0.75rem;
            border-radius: 0.25rem;
          ">${entry.correctAnswer}</span>
        </div>
      `;

      // Explanation (if enabled)
      if (showExplanations && entry.explanation.length > 0) {
        entry.explanation.forEach(line => {
          htmlContent += `
            <p style="
              color: #374151;
              line-height: 1.625;
              margin-bottom: 0.5rem;
              margin-left: 1.5rem;
            ">${line}</p>
          `;
        });
      }
    });
  }

  // Build complete HTML document
  const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 1.5cm;
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      color: #374151;
      margin: 0;
      padding: 0;
    }
    ${scanMode ? `
    .alignment-marker {
      position: fixed;
      width: 5mm;
      height: 5mm;
      background-color: black;
      z-index: 9999;
    }
    .marker-top-left { top: 5mm; left: 5mm; }
    .marker-bottom-left { bottom: 5mm; left: 5mm; }
    .marker-bottom-right { bottom: 5mm; right: 5mm; }
    .scan-qr-code {
      position: fixed;
      top: 5mm;
      right: 5mm;
      width: 20mm;
      height: 20mm;
      z-index: 9999;
    }
    ` : ''}
  </style>
</head>
<body>
  ${scanMode ? `
  <div class="alignment-marker marker-top-left"></div>
  <div class="alignment-marker marker-bottom-left"></div>
  <div class="alignment-marker marker-bottom-right"></div>
  ${qrCodeBase64 ? `<img class="scan-qr-code" src="data:image/png;base64,${qrCodeBase64}" />` : ''}
  ` : ''}
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
      ">${formData.subject}</span>
    </div>

    <h1 style="
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin: 0.5rem 0;
      line-height: 1.2;
    ">${formData.subject}${formData.strand ? ` — ${formData.strand}` : ''} Quiz</h1>

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
      // margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      color: rgba(207, 250, 254, 1);
      font-size: 0.875rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
      <span><span style="opacity: 0.75;">Generated on</span> ${new Date().toLocaleDateString()}</span>
      ${showAnswerKey && quizId ? `<span style="
        background-color: rgba(255, 255, 255, 0.2);
        padding: 0.25rem 0.75rem;
        border-radius: 0.25rem;
        font-family: monospace;
        font-size: 0.8rem;
        letter-spacing: 0.025em;
      ">Quiz ID: ${quizId}</span>` : ''}
    </div>
  </div>

  ${studentInfo ? `
  <!-- Student Info -->
  <div style="
    margin-top: 1.5rem;
    padding: 1rem 1.5rem;
    border: 2px solid ${accentColor}44;
    border-radius: 0.5rem;
    background-color: ${accentColor}08;
    display: flex;
    align-items: center;
    gap: 1rem;
  ">
    ${qrCodeBase64 ? `
    <img src="data:image/png;base64,${qrCodeBase64}" style="
      width: 4rem;
      height: 4rem;
      image-rendering: pixelated;
    " />
    ` : `
    <div style="
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background-color: ${accentColor};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.125rem;
    ">${studentInfo.name.charAt(0)}</div>
    `}
    <div>
      <div style="font-weight: 600; color: #1f2937; font-size: 1rem;">${studentInfo.name}</div>
      ${qrCodeBase64 ? `
      <div style="color: #6b7280; font-size: 0.75rem;">Scan QR to identify student &amp; ${quizId ? 'quiz' : 'document'}</div>
      ` : `
      <div style="color: #6b7280; font-size: 0.875rem;">Student ID: ${studentInfo.id}</div>
      `}
    </div>
  </div>
  ` : ''}

  <!-- Content -->
  <div style="margin-top: 2rem;">
    ${htmlContent}
  </div>

  ${getLogoFooterHTML(
    `${showAnswerKey && !showExplanations ? ' • Answer Key Only' : ''}${showAnswerKey && showExplanations ? ' • Full Answer Key with Explanations' : ''}`
  )}
</body>
</html>
  `;

  return fullHTML;
}

// Export function to use with backend
export function prepareQuizForExport(
  text: string,
  formData: any,
  accentColor: string,
  exportOptions: {
    showAnswerKey?: boolean;
    showExplanations?: boolean;
    boldCorrectAnswers?: boolean;
    scanMode?: boolean;
    qrCodeBase64?: string;
  } = {},
  studentInfo?: { name: string; id: string },
  quizId?: string
) {
  const html = generateQuizHTML(text, {
    accentColor,
    formData,
    ...exportOptions,
    studentInfo,
    quizId
  });

  return {
    rawHtml: html,
    content: text,
    formData: formData,
    accentColor: accentColor,
    exportOptions: exportOptions
  };
}