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
  };
  showAnswerKey?: boolean;
  showExplanations?: boolean;
  boldCorrectAnswers?: boolean;
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
      const questionText = trimmed.replace(/^Question \d+:\s*/, '');
      
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
    boldCorrectAnswers = false
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
  });

  // Render Answer Key Section (if enabled)
  if (showAnswerKey && parsed.answerKey.length > 0) {
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
      ">${formData.subject}</span>
    </div>

    <h1 style="
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin: 0.5rem 0;
      line-height: 1.2;
    ">${formData.numberOfQuestions}-Question Assessment${!showAnswerKey ? ' (Student Version)' : ''}</h1>

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
    ${!showAnswerKey ? ' • Student Version (No Answers)' : ''}
    ${showAnswerKey && !showExplanations ? ' • Answer Key Only' : ''}
    ${showAnswerKey && showExplanations ? ' • Full Answer Key with Explanations' : ''}
  </div>
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
  } = {}
) {
  const html = generateQuizHTML(text, {
    accentColor,
    formData,
    ...exportOptions
  });

  return {
    rawHtml: html,
    content: text,
    formData: formData,
    accentColor: accentColor,
    exportOptions: exportOptions
  };
}