export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'open-ended';
  question: string;
  options?: string[]; // For multiple choice and true/false
  correctAnswer?: string | number; // Index for MC, "true"/"false" for T/F, text for fill-blank
  explanation?: string;
  cognitiveLevel?: string;
  points?: number;
}

export interface QuizMetadata {
  title: string;
  subject: string;
  gradeLevel: string;
  totalQuestions: number;
  totalPoints?: number;
  timeLimit?: number;
  instructions?: string;
}

export interface ParsedQuiz {
  metadata: QuizMetadata;
  questions: QuizQuestion[];
}

// Helper function to parse multiple choice questions
function parseMultipleChoiceQuestion(questionText: string, questionBody: string, index: number): QuizQuestion | null {
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
    .map(([_, text]) => text);
  
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
function parseTrueFalseQuestion(questionText: string, questionBody: string, index: number): QuizQuestion | null {
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
function parseFillBlankQuestion(questionText: string, questionBody: string, index: number): QuizQuestion | null {
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

// Helper function to parse open-ended questions
function parseOpenEndedQuestion(questionText: string, questionBody: string, index: number): QuizQuestion | null {
  // Extract sample answer - look for "Sample Answer:"
  let correctAnswer = '';
  const sampleAnswerMatch = questionBody.match(/Sample\s+Answer:\s*(.+?)(?=\n(?:Key Points:|Explanation:)|\n\n|$)/is);
  if (sampleAnswerMatch) {
    correctAnswer = sampleAnswerMatch[1].trim();
  }
  
  // Extract key points if present and append to correct answer
  const keyPointsMatch = questionBody.match(/Key\s+Points:\s*(.+?)(?=\nExplanation:|\n\n|$)/is);
  if (keyPointsMatch) {
    const keyPoints = keyPointsMatch[1].trim();
    correctAnswer = correctAnswer ? `${correctAnswer}\n\nKey Points:\n${keyPoints}` : keyPoints;
  }
  
  // Extract explanation (handle multi-line explanations)
  const explanationMatch = questionBody.match(/Explanation:\s*(.+?)(?=\n\n|$)/is);
  const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;
  
  // Extract points if specified
  const pointsMatch = questionBody.match(/Points:\s*(\d+)/i);
  const points = pointsMatch ? parseInt(pointsMatch[1]) : 1;
  
  return {
    id: `q_${Date.now()}_${index}`,
    type: 'open-ended',
    question: questionText,
    correctAnswer,
    explanation,
    points
  };
}

// Detect question type based on content structure
function detectQuestionType(questionBody: string): 'multiple-choice' | 'true-false' | 'fill-blank' | 'open-ended' {
  // Check for True/False format
  if (/Correct\s+Answer:\s*(True|False)/i.test(questionBody)) {
    return 'true-false';
  }
  
  // Check for Multiple Choice format (has options A) and B))
  if (/[A-D]\)\s*[^\n]+/.test(questionBody) && /[A-D]\)\s*[^\n]+.*[A-D]\)\s*[^\n]+/s.test(questionBody)) {
    return 'multiple-choice';
  }
  
  // Check for Fill-in-Blank format (has "Answer:" but not "Correct Answer:")
  if (/(?<!Correct\s)Answer:\s*[^\n]+/i.test(questionBody)) {
    return 'fill-blank';
  }
  
  // Check for Open-Ended format (has "Sample Answer:" or "Key Points:")
  if (/Sample\s+Answer:|Key\s+Points:/i.test(questionBody)) {
    return 'open-ended';
  }
  
  // Default to open-ended if unclear
  return 'open-ended';
}

// Parse text-based quiz format
function parseTextBasedQuiz(text: string): ParsedQuiz | null {
  try {
    const questions: QuizQuestion[] = [];
    
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
      let questionType: QuizQuestion['type'];
      let cleanedContent = questionContent;
      
      if (/Multiple\s*Choice/i.test(firstLine)) {
        questionType = 'multiple-choice';
      } else if (/True\s*\/\s*False/i.test(firstLine)) {
        questionType = 'true-false';
      } else if (/Fill-in-the-Blank/i.test(firstLine)) {
        questionType = 'fill-blank';
      } else if (/Open-Ended/i.test(firstLine)) {
        questionType = 'open-ended';
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
        } else if (/^Open-Ended\**/i.test(cleanedContent)) {
          questionType = 'open-ended';
          cleanedContent = cleanedContent.replace(/^Open-Ended\**\s*/i, '');
        } else {
          // Fallback to content detection
          questionType = detectQuestionType(cleanedContent);
        }
      }
      
      // Extract clean question text (first line before options/answers)
      const questionTextMatch = cleanedContent.match(/^(.+?)(?=\n(?:A\)|Correct Answer:|Answer:|Sample Answer:|Key Points:))/s);
      let questionText = questionTextMatch ? questionTextMatch[1].trim() : cleanedContent.split('\n')[0].trim();
      
      // CRITICAL: Remove any remaining type labels from question text
      questionText = questionText
        .replace(/^Multiple\s*Choice\**\s*/i, '')
        .replace(/^True\s*\/\s*False\**\s*/i, '')
        .replace(/^Fill-in-the-Blank\**\s*/i, '')
        .replace(/^Open-Ended\**\s*/i, '')
        .trim();

      // Strip "(Sample Answer)" and any trailing example text the LLM appends to open-ended questions
      questionText = questionText
        .replace(/\s*\(Sample\s*Answer\).*$/i, '')
        .replace(/\s*Example of a good response:.*$/i, '')
        .trim();
      
      const index = parseInt(questionNumber) - 1;
      let parsedQuestion: QuizQuestion | null = null;
      
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
        case 'open-ended':
          parsedQuestion = parseOpenEndedQuestion(questionText, cleanedContent, index);
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
        title: 'Generated Quiz',
        subject: 'Various',
        gradeLevel: 'Multiple',
        totalQuestions: questions.length
      },
      questions
    };
  } catch (error) {
    console.error('Failed to parse text-based quiz:', error);
    return null;
  }
}

// Parser utility - handles both JSON and text-based quiz formats
export function parseQuizFromAI(aiResponse: string): ParsedQuiz | null {
  try {
    // First, try to extract JSON from markdown code blocks
    const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
    
    // Try parsing as JSON first
    const parsed = JSON.parse(jsonString);
    
    // Validate structure
    if (!parsed.metadata || !parsed.questions || !Array.isArray(parsed.questions)) {
      console.error('Invalid quiz structure');
      return null;
    }
    
    // Add IDs if missing
    parsed.questions = parsed.questions.map((q: QuizQuestion, index: number) => ({
      ...q,
      id: q.id || `q_${Date.now()}_${index}`
    }));
    
    return parsed as ParsedQuiz;
  } catch {
    // If JSON parsing fails, try to parse text-based format
    console.log('JSON parsing failed, attempting text-based parsing...');
    return parseTextBasedQuiz(aiResponse);
  }
}

// Convert ParsedQuiz to display text (parser-compatible format)
export function quizToDisplayText(quiz: ParsedQuiz): string {
  let text = `# Generated Quiz\n\n`;
  text += `**Subject:** ${quiz.metadata.subject} | `;
  text += `**Grade:** ${quiz.metadata.gradeLevel} | `;
  text += `**Questions:** ${quiz.metadata.totalQuestions}\n\n`;
  
  if (quiz.metadata.instructions) {
    text += `${quiz.metadata.instructions}\n\n`;
  }
  
  text += `## Questions\n\n`;
  
  quiz.questions.forEach((q, index) => {
    // Use format that parser expects: "Question X: ..."
    text += `Question ${index + 1}: ${q.question}\n`;
    
    if (q.type === 'multiple-choice' && q.options && q.options.length > 0) {
      q.options.forEach((option, i) => {
        const letter = String.fromCharCode(65 + i); // A, B, C, D
        text += `${letter}) ${option}\n`;
      });
      
      // Add correct answer in expected format
      const correctLetter = String.fromCharCode(65 + (q.correctAnswer as number));
      text += `Correct Answer: ${correctLetter}\n`;
      
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
    } else if (q.type === 'open-ended') {
      text += `Sample Answer: ${q.correctAnswer}\n`;
      if (q.explanation) {
        text += `Explanation: ${q.explanation}\n`;
      }
      text += '\n';
    }
  });
  
  return text;
}

// Convert display text back to ParsedQuiz (for backward compatibility)
export function displayTextToQuiz(text: string, metadata: QuizMetadata): ParsedQuiz {
  // This is a fallback for legacy text-based quizzes
  // Just wrap the text into a single open-ended question for now
  return {
    metadata,
    questions: [{
      id: `legacy_${Date.now()}`,
      type: 'open-ended',
      question: 'Quiz Content',
      correctAnswer: text
    }]
  };
}