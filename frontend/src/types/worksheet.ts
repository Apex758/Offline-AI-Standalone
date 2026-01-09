export interface WorksheetQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer' | 'matching' | 'comprehension';
  question: string;
  options?: string[]; // For multiple choice and matching
  correctAnswer?: string | number; // Index for MC, text for others
  explanation?: string;
  points?: number;
  passage?: string; // For comprehension questions
}

export interface WorksheetMetadata {
  title: string;
  subject: string;
  gradeLevel: string;
  totalQuestions: number;
  template: string;
  instructions?: string;
}

export interface ParsedWorksheet {
  metadata: WorksheetMetadata;
  questions: WorksheetQuestion[];
  passage?: string; // For comprehension worksheets
  matchingItems?: { columnA: string[]; columnB: string[] }; // For matching worksheets
}

// Helper function to parse multiple choice questions
function parseMultipleChoiceQuestion(questionText: string, questionBody: string, index: number): WorksheetQuestion | null {
  // Extract options with deduplication
  const optionRegex = /([A-E])\)\s*([^\n]+)/g;
  const optionsMap = new Map<number, string>();
  let optionMatch;

  while ((optionMatch = optionRegex.exec(questionBody)) !== null) {
    const letter = optionMatch[1];
    const optionIndex = letter.charCodeAt(0) - 65;
    const optionText = optionMatch[2].trim();

    // Only keep first occurrence (ignore duplicates)
    if (!optionsMap.has(optionIndex) && optionIndex < 4) { // Only A-D
      optionsMap.set(optionIndex, optionText);
    }
  }

  const options = Array.from(optionsMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([, text]) => text);

  // Extract correct answer
  const answerMatch = questionBody.match(/Correct\s+Answer:\s*([A-D])\)|Correct\s+Answer:\s*([A-D])/i);
  const correctAnswer = answerMatch ? (answerMatch[1] || answerMatch[2]).charCodeAt(0) - 65 : 0;

  // Extract explanation
  const explanationMatch = questionBody.match(/Explanation:\s*(.+?)(?=\n\n|$)/is);
  const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;

  // Extract points
  const pointsMatch = questionBody.match(/Points:\s*(\d+)/i);
  const points = pointsMatch ? parseInt(pointsMatch[1]) : 1;

  if (options.length >= 2) {
    return {
      id: `q_${Date.now()}_${index}`,
      type: 'multiple-choice',
      question: questionText,
      options,
      correctAnswer,
      explanation,
      points
    };
  }

  console.warn(`Multiple choice question ${index + 1} has ${options.length} options (expected at least 2)`);
  return null;
}

// Helper function to parse true/false questions
function parseTrueFalseQuestion(questionText: string, questionBody: string, index: number): WorksheetQuestion | null {
  // Extract correct answer - look for "Correct Answer: True" or "Correct Answer: False"
  const answerMatch = questionBody.match(/Correct\s+Answer:\s*(True|False)/i);
  const correctAnswer = answerMatch ? answerMatch[1].toLowerCase() : 'true';

  // Extract explanation (handle multi-line explanations)
  const explanationMatch = questionBody.match(/Explanation:\s*(.+?)(?=\n\n|$)/is);
  const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;

  // Extract points if specified
  const pointsMatch = questionBody.match(/Points:\s*(\d+)/i);
  const points = pointsMatch ? parseInt(pointsMatch[1]) : 1;

  return {
    id: `q_${Date.now()}_${index}`,
    type: 'true-false',
    question: questionText,
    options: ['True', 'False'],
    correctAnswer,
    explanation,
    points
  };
}

// Helper function to parse fill-in-the-blank questions
function parseFillBlankQuestion(questionText: string, questionBody: string, index: number): WorksheetQuestion | null {
  // Extract answer - look for "Answer: [text]" but not "Correct Answer:"
  const answerMatch = questionBody.match(/(?<!Correct\s)Answer:\s*(.+?)(?=\n|$)/i);
  const correctAnswer = answerMatch ? answerMatch[1].trim() : '';

  // Extract explanation (handle multi-line explanations)
  const explanationMatch = questionBody.match(/Explanation:\s*(.+?)(?=\n\n|$)/is);
  const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;

  // Extract points if specified
  const pointsMatch = questionBody.match(/Points:\s*(\d+)/i);
  const points = pointsMatch ? parseInt(pointsMatch[1]) : 1;

  return {
    id: `q_${Date.now()}_${index}`,
    type: 'fill-blank',
    question: questionText,
    correctAnswer,
    explanation,
    points
  };
}

// Helper function to parse short answer questions
function parseShortAnswerQuestion(questionText: string, questionBody: string, index: number): WorksheetQuestion | null {
  // Extract sample answer
  let correctAnswer = '';
  const sampleAnswerMatch = questionBody.match(/Sample\s+Answer:\s*(.+?)(?=\n(?:Key Points:|Explanation:)|\n\n|$)/is);
  if (sampleAnswerMatch) {
    correctAnswer = sampleAnswerMatch[1].trim();
  }

  // Extract key points if present
  const keyPointsMatch = questionBody.match(/Key\s+Points:\s*(.+?)(?=\nExplanation:|\n\n|$)/is);
  if (keyPointsMatch) {
    const keyPoints = keyPointsMatch[1].trim();
    correctAnswer = correctAnswer ? `${correctAnswer}\n\nKey Points:\n${keyPoints}` : keyPoints;
  }

  // Extract explanation
  const explanationMatch = questionBody.match(/Explanation:\s*(.+?)(?=\n\n|$)/is);
  const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;

  // Extract points if specified
  const pointsMatch = questionBody.match(/Points:\s*(\d+)/i);
  const points = pointsMatch ? parseInt(pointsMatch[1]) : 1;

  return {
    id: `q_${Date.now()}_${index}`,
    type: 'short-answer',
    question: questionText,
    correctAnswer,
    explanation,
    points
  };
}

// Helper function to parse comprehension questions
function parseComprehensionQuestion(questionText: string, questionBody: string, index: number, passage?: string): WorksheetQuestion | null {
  // For comprehension, the question might be part of a larger passage
  // Extract sample answer or just treat as short answer
  let correctAnswer = '';
  const sampleAnswerMatch = questionBody.match(/Sample\s+Answer:\s*(.+?)(?=\n(?:Key Points:|Explanation:)|\n\n|$)/is);
  if (sampleAnswerMatch) {
    correctAnswer = sampleAnswerMatch[1].trim();
  }

  const explanationMatch = questionBody.match(/Explanation:\s*(.+?)(?=\n\n|$)/is);
  const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;

  const pointsMatch = questionBody.match(/Points:\s*(\d+)/i);
  const points = pointsMatch ? parseInt(pointsMatch[1]) : 1;

  return {
    id: `q_${Date.now()}_${index}`,
    type: 'comprehension',
    question: questionText,
    correctAnswer,
    explanation,
    points,
    passage
  };
}

// Parse matching worksheet
function parseMatchingWorksheet(text: string): ParsedWorksheet | null {
  try {
    // Extract title
    const titleMatch = text.match(/Title:\s*(.+?)(?=\n|$)/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Matching Worksheet';

    // Extract instructions
    const instructionsMatch = text.match(/Instructions?:\s*(.+?)(?=\n\n|$)/is);
    const instructions = instructionsMatch ? instructionsMatch[1].trim() : undefined;

    // Extract Column A
    const columnAMatch = text.match(/Column A:\s*\n((?:\d+\.\s*[^\n]+\n?)+)/i);
    const columnA = columnAMatch ? columnAMatch[1].split('\n').map(line => {
      const match = line.match(/\d+\.\s*(.+)/);
      return match ? match[1].trim() : '';
    }).filter(item => item) : [];

    // Extract Column B
    const columnBMatch = text.match(/Column B:\s*\n((?:[A-Z]\.\s*[^\n]+\n?)+)/i);
    const columnB = columnBMatch ? columnBMatch[1].split('\n').map(line => {
      const match = line.match(/[A-Z]\.\s*(.+)/);
      return match ? match[1].trim() : '';
    }).filter(item => item) : [];

    if (columnA.length === 0 || columnB.length === 0) {
      return null;
    }

    return {
      metadata: {
        title,
        subject: 'Various',
        gradeLevel: 'Multiple',
        totalQuestions: columnA.length,
        template: 'matching',
        instructions
      },
      questions: [], // Matching doesn't have individual questions
      matchingItems: { columnA, columnB }
    };
  } catch (error) {
    console.error('Failed to parse matching worksheet:', error);
    return null;
  }
}

// Parse comprehension worksheet
function parseComprehensionWorksheet(text: string): ParsedWorksheet | null {
  try {
    // Extract passage
    const passageMatch = text.match(/PASSAGE:\s*\n(.+?)(?=\n\nQUESTIONS:|\n\n\d+\.|$)/is);
    const passage = passageMatch ? passageMatch[1].trim() : '';

    // Extract questions
    const questions: WorksheetQuestion[] = [];
    const questionRegex = /(\d+)\.\s*([^\n]+)\n([^]*?)(?=\n\d+\.|$)/g;
    let match;

    while ((match = questionRegex.exec(text)) !== null) {
      const questionNumber = match[1];
      const questionText = match[2].trim();
      const questionBody = match[3].trim();

      const parsedQuestion = parseComprehensionQuestion(questionText, questionBody, parseInt(questionNumber) - 1, passage);
      if (parsedQuestion) {
        questions.push(parsedQuestion);
      }
    }

    if (questions.length === 0) {
      return null;
    }

    return {
      metadata: {
        title: 'Reading Comprehension Worksheet',
        subject: 'Language Arts',
        gradeLevel: 'Multiple',
        totalQuestions: questions.length,
        template: 'comprehension',
        instructions: 'Read the passage and answer the questions.'
      },
      questions,
      passage
    };
  } catch (error) {
    console.error('Failed to parse comprehension worksheet:', error);
    return null;
  }
}

// Parse text-based worksheet format
function parseTextBasedWorksheet(text: string): ParsedWorksheet | null {
  try {
    const questions: WorksheetQuestion[] = [];

    // Clean the text first
    let cleanText = text;
    const initPatterns = [
      /llama_model_loader[^\n]*/g,
      /llm_load_print_meta[^\n]*/g,
      /system_info[^\n]*/g,
      /Not using system message[^\n]*/g,
      /To change it, set a different value via -sys PROMPT[^\n]*/g,
    ];

    initPatterns.forEach(pattern => {
      cleanText = cleanText.replace(pattern, '');
    });

    // Check for matching format
    if (cleanText.includes('Column A:') && cleanText.includes('Column B:')) {
      return parseMatchingWorksheet(cleanText);
    }

    // Check for comprehension format
    if (cleanText.includes('PASSAGE:') && cleanText.includes('QUESTIONS:')) {
      return parseComprehensionWorksheet(cleanText);
    }

    // Match questions
    const questionRegex = /Question\s+(\d+):\s*([^\n]*)\n([^]*?)(?=Question\s+\d+:|$)/gi;
    const matches = [...cleanText.matchAll(questionRegex)];

    if (matches.length === 0) {
      console.error('No questions found in text format');
      return null;
    }

    console.log(`Found ${matches.length} questions in text format`);

    matches.forEach((match) => {
      const questionNumber = match[1];
      const firstLine = match[2].trim();
      const questionContent = match[3].trim();

      // Detect type from first line
      let questionType: WorksheetQuestion['type'];
      let cleanedContent = questionContent;

      if (/Multiple\s*Choice/i.test(firstLine)) {
        questionType = 'multiple-choice';
      } else if (/True\s*\/\s*False/i.test(firstLine)) {
        questionType = 'true-false';
      } else if (/Fill-in-the-Blank/i.test(firstLine)) {
        questionType = 'fill-blank';
      } else if (/Short\s*Answer/i.test(firstLine)) {
        questionType = 'short-answer';
      } else if (/Comprehension/i.test(firstLine)) {
        questionType = 'comprehension';
      } else {
        // Type label might be at start of questionContent
        cleanedContent = firstLine + '\n' + questionContent;

        // Check for type labels at start of content
        if (/^Multiple\s*Choice\**/i.test(cleanedContent)) {
          questionType = 'multiple-choice';
          cleanedContent = cleanedContent.replace(/^Multiple\s*Choice\**\s*/i, '');
        } else if (/^True\s*\/\s*False\**/i.test(cleanedContent)) {
          questionType = 'true-false';
          cleanedContent = cleanedContent.replace(/^True\s*\/\s*False\**\s*/i, '');
        } else if (/^Fill-in-the-Blank\**/i.test(cleanedContent)) {
          questionType = 'fill-blank';
          cleanedContent = cleanedContent.replace(/^Fill-in-the-Blank\**\s*/i, '');
        } else if (/^Short\s*Answer\**/i.test(cleanedContent)) {
          questionType = 'short-answer';
          cleanedContent = cleanedContent.replace(/^Short\s*Answer\**\s*/i, '');
        } else if (/^Comprehension\**/i.test(cleanedContent)) {
          questionType = 'comprehension';
          cleanedContent = cleanedContent.replace(/^Comprehension\**\s*/i, '');
        } else {
          // Fallback to content detection
          if (/[A-D]\)\s*[^\n]+.*[A-D]\)\s*[^\n]+/s.test(cleanedContent)) {
            questionType = 'multiple-choice';
          } else if (/Correct\s+Answer:\s*(True|False)/i.test(cleanedContent)) {
            questionType = 'true-false';
          } else if (/(?<!Correct\s)Answer:\s*[^\n]+/i.test(cleanedContent)) {
            questionType = 'fill-blank';
          } else if (/Sample\s+Answer:|Key\s+Points:/i.test(cleanedContent)) {
            questionType = 'short-answer';
          } else {
            questionType = 'short-answer';
          }
        }
      }

      // Extract clean question text
      const questionTextMatch = cleanedContent.match(/^(.+?)(?=\n(?:A\)|Correct Answer:|Answer:|Sample Answer:|Key Points:))/s);
      let questionText = questionTextMatch ? questionTextMatch[1].trim() : cleanedContent.split('\n')[0].trim();

      // Remove type labels from question text
      questionText = questionText
        .replace(/^Multiple\s*Choice\**\s*/i, '')
        .replace(/^True\s*\/\s*False\**\s*/i, '')
        .replace(/^Fill-in-the-Blank\**\s*/i, '')
        .replace(/^Short\s*Answer\**\s*/i, '')
        .replace(/^Comprehension\**\s*/i, '')
        .trim();

      const index = parseInt(questionNumber) - 1;
      let parsedQuestion: WorksheetQuestion | null = null;

      switch (questionType) {
        case 'multiple-choice':
          parsedQuestion = parseMultipleChoiceQuestion(questionText, cleanedContent, index);
          break;
        case 'true-false':
          parsedQuestion = parseTrueFalseQuestion(questionText, cleanedContent, index);
          break;
        case 'fill-blank':
          parsedQuestion = parseFillBlankQuestion(questionText, cleanedContent, index);
          break;
        case 'short-answer':
          parsedQuestion = parseShortAnswerQuestion(questionText, cleanedContent, index);
          break;
        case 'comprehension':
          parsedQuestion = parseComprehensionQuestion(questionText, cleanedContent, index);
          break;
      }

      if (parsedQuestion) {
        questions.push(parsedQuestion);
      } else {
        console.warn(`Failed to parse question ${questionNumber} of type ${questionType}`);
      }
    });

    if (questions.length === 0) {
      console.error('No valid questions parsed');
      return null;
    }

    console.log(`Successfully parsed ${questions.length} questions`);

    return {
      metadata: {
        title: 'Generated Worksheet',
        subject: 'Various',
        gradeLevel: 'Multiple',
        totalQuestions: questions.length,
        template: 'list-based'
      },
      questions
    };
  } catch (error) {
    console.error('Failed to parse text-based worksheet:', error);
    return null;
  }
}

// Parser utility - handles both JSON and text-based worksheet formats
export function parseWorksheetFromAI(aiResponse: string): ParsedWorksheet | null {
  try {
    // First, try to extract JSON from markdown code blocks
    const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;

    // Try parsing as JSON first
    const parsed = JSON.parse(jsonString);

    // Validate structure
    if (!parsed.metadata || !parsed.questions || !Array.isArray(parsed.questions)) {
      console.error('Invalid worksheet structure');
      return null;
    }

    // Add IDs if missing
    parsed.questions = parsed.questions.map((q: WorksheetQuestion, index: number) => ({
      ...q,
      id: q.id || `q_${Date.now()}_${index}`
    }));

    return parsed as ParsedWorksheet;
  } catch {
    // If JSON parsing fails, try to parse text-based format
    console.log('JSON parsing failed, attempting text-based parsing...');
    return parseTextBasedWorksheet(aiResponse);
  }
}

// Convert ParsedWorksheet to display text
export function worksheetToDisplayText(worksheet: ParsedWorksheet): string {
  let text = `# ${worksheet.metadata.title}\n\n`;
  text += `**Subject:** ${worksheet.metadata.subject} | `;
  text += `**Grade:** ${worksheet.metadata.gradeLevel} | `;
  text += `**Questions:** ${worksheet.metadata.totalQuestions}\n\n`;

  if (worksheet.metadata.instructions) {
    text += `${worksheet.metadata.instructions}\n\n`;
  }

  if (worksheet.passage) {
    text += `## Passage\n\n${worksheet.passage}\n\n`;
  }

  if (worksheet.matchingItems) {
    text += `## Matching Exercise\n\n`;
    text += `**Column A:**\n`;
    worksheet.matchingItems.columnA.forEach((item, i) => {
      text += `${i + 1}. ${item}\n`;
    });
    text += `\n**Column B:**\n`;
    worksheet.matchingItems.columnB.forEach((item, i) => {
      text += `${String.fromCharCode(65 + i)}. ${item}\n`;
    });
    text += `\n`;
  } else {
    text += `## Questions\n\n`;

    worksheet.questions.forEach((q, index) => {
      text += `Question ${index + 1}: ${q.question}\n`;

      if (q.type === 'multiple-choice' && q.options && q.options.length > 0) {
        q.options.forEach((option, i) => {
          const letter = String.fromCharCode(65 + i);
          text += `${letter}) ${option}\n`;
        });

        if (q.correctAnswer !== undefined) {
          const correctLetter = String.fromCharCode(65 + (q.correctAnswer as number));
          text += `Correct Answer: ${correctLetter}\n`;
        }

        if (q.explanation) {
          text += `Explanation: ${q.explanation}\n`;
        }
        text += '\n';
      } else if (q.type === 'true-false') {
        text += `A) True\n`;
        text += `B) False\n`;
        text += `Correct Answer: ${q.correctAnswer === 'true' ? 'True' : 'False'}\n`;
        if (q.explanation) {
          text += `Explanation: ${q.explanation}\n`;
        }
        text += '\n';
      } else if (q.type === 'fill-blank') {
        text += `Answer: ${q.correctAnswer}\n`;
        if (q.explanation) {
          text += `Explanation: ${q.explanation}\n`;
        }
        text += '\n';
      } else if (q.type === 'short-answer' || q.type === 'comprehension') {
        if (q.correctAnswer) {
          text += `Sample Answer: ${q.correctAnswer}\n`;
        }
        if (q.explanation) {
          text += `Explanation: ${q.explanation}\n`;
        }
        text += '\n';
      }
    });
  }

  return text;
}