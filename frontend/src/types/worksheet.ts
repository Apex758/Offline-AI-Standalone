export interface WorksheetQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer' | 'matching' | 'comprehension' | 'word-bank';
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
  wordBank?: string[]; // For word bank worksheets - the list of available words
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

// Helper function to parse word bank questions (fill-in-blank with word bank)
function parseWordBankQuestion(questionText: string, index: number): WorksheetQuestion | null {
  return {
    id: `q_${Date.now()}_${index}`,
    type: 'word-bank',
    question: questionText,
    correctAnswer: '', // The blank to fill
    points: 1
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

// Add this helper function before parseMatchingWorksheet
function calculateMathExpression(expr: string): number | null {
  try {
    // Extract the math expression (e.g., "945 - 279 =" -> "945 - 279")
    const cleanExpr = expr.replace(/=/g, '').trim();
    
    // Simple regex to extract numbers and operator
    const match = cleanExpr.match(/(\d+)\s*([+\-×÷*/])\s*(\d+)/);
    if (!match) return null;
    
    const num1 = parseInt(match[1]);
    const operator = match[2];
    const num2 = parseInt(match[3]);
    
    switch (operator) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '×':
      case '*': return num1 * num2;
      case '÷':
      case '/': return Math.floor(num1 / num2);
      default: return null;
    }
  } catch {
    return null;
  }
}

// Parse matching worksheet - IMPROVED VERSION
function parseMatchingWorksheet(text: string): ParsedWorksheet | null {
  try {
    console.log('=== PARSING MATCHING WORKSHEET ===');
    
    // Extract title - handle both markdown and plain text
    const titleMatch = text.match(/\*\*Title:\*\*\s*(.+?)(?=\n|$)/i) ||
                       text.match(/Title:\s*(.+?)(?=\n|$)/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Matching Worksheet';

    // Extract instructions - handle both markdown and plain text
    const instructionsMatch = text.match(/\*\*Instructions?:\*\*\s*(.+?)(?=\n\n|$)/is) ||
                              text.match(/Instructions?:\s*(.+?)(?=\n\n|$)/is);
    const instructions = instructionsMatch ? instructionsMatch[1].trim() : undefined;

    // Extract Column A - handle both markdown (**Column A:**) and plain text (Column A:)
    // Also handle optional descriptive text after the colon (e.g., "**Column A:** Math problems")
    let columnAMatch = text.match(/\*\*Column A:\*\*[^\n]*\n((?:\d+\.\s*[^\n]+\n?)+)/i);
    if (!columnAMatch) {
      columnAMatch = text.match(/Column A:[^\n]*\n((?:\d+\.\s*[^\n]+\n?)+)/i);
    }
    
    const columnA = columnAMatch ? columnAMatch[1].split('\n').map(line => {
      const match = line.match(/\d+\.\s*(.+)/);
      return match ? match[1].trim() : '';
    }).filter(item => item) : [];

    // Calculate correct answers if Column A contains math problems
    const calculatedAnswers = columnA.map(item => calculateMathExpression(item));
    const hasMathProblems = calculatedAnswers.some(ans => ans !== null);

    // Extract Column B - handle both markdown (**Column B:**) and plain text (Column B:)
    // Also handle optional descriptive text after the colon (e.g., "**Column B:** Numerical answers")
    let columnBMatch = text.match(/\*\*Column B:\*\*[^\n]*\n((?:[A-Z]\.\s*[^\n]+\n?)+)/i);
    if (!columnBMatch) {
      columnBMatch = text.match(/Column B:[^\n]*\n((?:[A-Z]\.\s*[^\n]+\n?)+)/i);
    }

    let columnB = columnBMatch ? columnBMatch[1].split('\n').map(line => {
      const match = line.match(/[A-Z]\.\s*(.+)/);
      return match ? match[1].trim() : '';
    }).filter(item => item) : [];

    // If we detected math problems and calculated answers, replace Column B
    if (hasMathProblems && calculatedAnswers.every(ans => ans !== null)) {
      console.log('✅ Replacing AI-generated answers with calculated correct answers');
      columnB = calculatedAnswers.map(ans => ans!.toString());
      // Shuffle to make it a challenge
      columnB = columnB.sort(() => Math.random() - 0.5);
    }

    console.log(`Found ${columnA.length} items in Column A, ${columnB.length} items in Column B`);

    if (columnA.length === 0 || columnB.length === 0) {
      console.error('❌ Matching columns not found');
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
    console.error('❌ Failed to parse matching worksheet:', error);
    return null;
  }
}

function parseComprehensionWorksheet(text: string): ParsedWorksheet | null {
  try {
    console.log('=== PARSING COMPREHENSION WORKSHEET ===');
    
    // Extract passage - handle markdown **Passage:**
    let passageMatch = text.match(/\*\*Passage:\*\*\s*\n+([\s\S]+?)(?=\n+\*\*Questions?:\*\*)/i);
    if (!passageMatch) {
      passageMatch = text.match(/PASSAGE:\s*\n+([\s\S]+?)(?=\n+QUESTIONS?:)/i);
    }
    const passage = passageMatch ? passageMatch[1].trim() : '';

    console.log('✅ Passage found:', passage ? 'YES' : 'NO');

    if (!passage) {
      console.error('❌ No passage found');
      return null;
    }

    // Extract questions by splitting on **1.**, **2.**, etc.
    const questions: WorksheetQuestion[] = [];
    const questionBlocks = text.split(/\*\*(\d+)\.\*\*/g).slice(1);
    
    console.log('Question blocks:', questionBlocks.length / 2);
    
    for (let i = 0; i < questionBlocks.length; i += 2) {
      const questionNumber = questionBlocks[i];
      const questionContent = questionBlocks[i + 1];
      
      if (!questionContent) continue;
      
      // Extract question text (after "Instructions:" and before "[Answer format:")
      let questionText = questionContent;
      
      // Remove Instructions line
      questionText = questionText.replace(/^\s*Instructions?:\s*[^\n]+\n+/i, '');
      
      // Remove Answer format hint
      questionText = questionText.replace(/\[Answer [Ff]ormat:?[^\]]+\]/g, '');
      
      // Clean up whitespace
      questionText = questionText.trim();
      
      if (questionText) {
        console.log(`✅ Question ${questionNumber}:`, questionText.substring(0, 50) + '...');
        
        questions.push({
          id: `q_${Date.now()}_${parseInt(questionNumber) - 1}`,
          type: 'comprehension',
          question: questionText,
          correctAnswer: '',
          points: 1,
          passage
        });
      }
    }

    console.log(`✅ SUCCESS: Parsed ${questions.length} questions`);

    if (questions.length === 0) {
      console.error('❌ No questions parsed');
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
    console.error('❌ Parser error:', error);
    return null;
  }
}

// NEW: Parse Word Bank worksheet
function parseWordBankWorksheet(text: string): ParsedWorksheet | null {
  try {
    console.log('=== PARSING WORD BANK WORKSHEET ===');
    
    // Extract title - handle both markdown and plain text
    const titleMatch = text.match(/\*\*(.+?)\s+Worksheet\*\*/i) || 
                       text.match(/^(.+?)(?=\n|$)/m);
    const title = titleMatch ? titleMatch[1].trim() + ' Worksheet' : 'Word Bank Worksheet';

    // Extract word bank - handle both markdown (**Word Bank:**) and plain text (Word Bank:)
    const wordBankMatch = text.match(/\*\*Word Bank:\*\*\s*(.+?)(?=\n\n|\*\*Question)/is) ||
                          text.match(/Word Bank:\s*(.+?)(?=\n\n|Question)/is);
    
    if (!wordBankMatch) {
      console.error('❌ No word bank found');
      return null;
    }

    // Split word bank - handle BOTH comma-separated AND bullet-point formats
    let wordBank: string[];
    const rawWordBank = wordBankMatch[1].trim();
    
    if (rawWordBank.includes('*') || rawWordBank.includes('-')) {
      // Bullet-point format: "* add\n* subtract\n* sum"
      console.log('📝 Detected bullet-point word bank format');
      wordBank = rawWordBank
        .split('\n')
        .map(line => line.replace(/^[\s\*\-]+/, '').trim()) // Remove bullets and whitespace
        .filter(word => word.length > 0);
    } else {
      // Comma-separated format: "add, subtract, sum, difference"
      console.log('📝 Detected comma-separated word bank format');
      wordBank = rawWordBank
        .split(',')
        .map(word => word.trim())
        .filter(word => word.length > 0);
    }

    console.log(`✅ Found word bank with ${wordBank.length} words:`, wordBank);

    // Extract questions - look for patterns like:
    // **Question 1:** sentence with ___
    // Question 1: sentence with ___
    const questions: WorksheetQuestion[] = [];
    
    // Match both markdown and plain text question formats
    const questionRegex = /\*\*Question\s+\d+:\*\*\s*(.+?)(?=\*\*Question\s+\d+:|$)/gis;
    const plainQuestionRegex = /Question\s+\d+:\s*(.+?)(?=Question\s+\d+:|$)/gis;
    
    let matches = [...text.matchAll(questionRegex)];
    if (matches.length === 0) {
      matches = [...text.matchAll(plainQuestionRegex)];
    }

    console.log(`Found ${matches.length} question matches`);

    matches.forEach((match, index) => {
      const questionText = match[1].trim();
      
      // Skip if this looks like it's part of the word bank definition
      if (questionText.toLowerCase().includes('word bank') || 
          questionText.toLowerCase().includes('fill-in-the-blank')) {
        return;
      }

      // Only include if it contains a blank (_____)
      if (questionText.includes('___')) {
        console.log(`✅ Question ${index + 1}:`, questionText.substring(0, 50) + '...');
        questions.push(parseWordBankQuestion(questionText, index)!);
      }
    });

    console.log(`✅ SUCCESS: Parsed ${questions.length} questions`);

    if (questions.length === 0) {
      console.error('❌ No valid questions found');
      return null;
    }

    return {
      metadata: {
        title,
        subject: 'Various',
        gradeLevel: 'Multiple',
        totalQuestions: questions.length,
        template: 'list-based',
        instructions: 'Use the words from the word bank to fill in the blanks.'
      },
      questions,
      wordBank
    };
  } catch (error) {
    console.error('❌ Failed to parse word bank worksheet:', error);
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

    // Check for Word Bank format FIRST (most specific)
    if ((cleanText.includes('**Word Bank:**') || cleanText.includes('Word Bank:')) &&
        cleanText.includes('___')) {
      console.log('✅ Detected Word Bank format');
      return parseWordBankWorksheet(cleanText);
    }

    // Check for matching format
    if (cleanText.includes('Column A:') && cleanText.includes('Column B:')) {
      return parseMatchingWorksheet(cleanText);
    }

    // Check for comprehension format
    if ((cleanText.includes('**Passage:**') || cleanText.includes('PASSAGE:')) && 
        (cleanText.includes('**Questions:**') || cleanText.includes('QUESTIONS:'))) {
      return parseComprehensionWorksheet(cleanText);
    }

    // Match questions
    // Match both formats: "Question 1: Type" and "**Question 1**"
    const questionRegex = /(?:\*\*Question\s+(\d+)\*\*|Question\s+(\d+):\s*([^\n]*))\s*\n([^]*?)(?=(?:\*\*Question\s+\d+\*\*|Question\s+\d+:)|$)/gi;
    const matches = [...cleanText.matchAll(questionRegex)];

    if (matches.length === 0) {
      console.error('No questions found in text format');
      return null;
    }

    console.log(`Found ${matches.length} questions in text format`);

    matches.forEach((match) => {
      const questionNumber = match[1] || match[2];
      const firstLine = (match[3] || '').trim();
      const questionContent = (match[4] || '').trim();

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
      } else if (/Word\s*Bank/i.test(firstLine)) {
        questionType = 'word-bank';
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
        } else if (/^Word\s*Bank\**/i.test(cleanedContent)) {
          questionType = 'word-bank';
          cleanedContent = cleanedContent.replace(/^Word\s*Bank\**\s*/i, '');
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
        .replace(/^Word\s*Bank\**\s*/i, '')
        .replace(/\*\*/g, '')
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
        case 'word-bank':
          parsedQuestion = parseWordBankQuestion(questionText, index);
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

  if (worksheet.wordBank) {
    text += `## Word Bank\n\n`;
    text += worksheet.wordBank.join(', ') + '\n\n';
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
      } else if (q.type === 'fill-blank' || q.type === 'word-bank') {
        text += `Answer: ${q.correctAnswer || '[Student fills in]'}\n`;
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