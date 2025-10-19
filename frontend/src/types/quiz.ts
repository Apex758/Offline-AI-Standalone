// types/quiz.ts - Add to frontend/src/types/quiz.ts

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

// Parse text-based quiz format
function parseTextBasedQuiz(text: string): ParsedQuiz | null {
  try {
    const questions: QuizQuestion[] = [];
    
    // Match questions in format: Question 1: ... A) ... B) ... C) ... D) ... Correct Answer: A
    const questionRegex = /Question\s+(\d+):\s*([^\n]+)\n([^]*?)(?=Question\s+\d+:|$)/gi;
    const matches = [...text.matchAll(questionRegex)];
    
    if (matches.length === 0) {
      console.error('No questions found in text format');
      return null;
    }
    
    matches.forEach((match, index) => {
      const questionText = match[2].trim();
      const questionBody = match[3];
      
      // Extract options (A), B), C), D))
      const optionRegex = /([A-D])\)\s*([^\n]+)/g;
      const options: string[] = [];
      let optionMatch;
      
      while ((optionMatch = optionRegex.exec(questionBody)) !== null) {
        options.push(optionMatch[2].trim());
      }
      
      // Extract correct answer
      const answerMatch = questionBody.match(/Correct\s+Answer:\s*([A-D])/i);
      const correctAnswer = answerMatch ? answerMatch[1].charCodeAt(0) - 65 : 0; // Convert A=0, B=1, etc.
      
      // Extract explanation
      const explanationMatch = questionBody.match(/Explanation:\s*([^\n]+)/i);
      const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;
      
      questions.push({
        id: `q_${Date.now()}_${index}`,
        type: 'multiple-choice',
        question: questionText,
        options: options.length > 0 ? options : undefined,
        correctAnswer,
        explanation
      });
    });
    
    if (questions.length === 0) {
      return null;
    }
    
    // Create metadata from parsed questions
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

// Convert ParsedQuiz to display text
export function quizToDisplayText(quiz: ParsedQuiz): string {
  let text = `# ${quiz.metadata.title}\n\n`;
  text += `**Subject:** ${quiz.metadata.subject} | `;
  text += `**Grade:** ${quiz.metadata.gradeLevel} | `;
  text += `**Questions:** ${quiz.metadata.totalQuestions}\n\n`;
  
  if (quiz.metadata.instructions) {
    text += `## Instructions\n${quiz.metadata.instructions}\n\n`;
  }
  
  text += `## Questions\n\n`;
  
  quiz.questions.forEach((q, index) => {
    text += `### Question ${index + 1}\n`;
    text += `**Type:** ${q.type}\n\n`;
    text += `${q.question}\n\n`;
    
    if (q.options && q.options.length > 0) {
      q.options.forEach((option, i) => {
        const letter = String.fromCharCode(65 + i); // A, B, C, D
        text += `${letter}) ${option}\n`;
      });
      text += '\n';
    }
    
    if (q.explanation) {
      text += `*Explanation:* ${q.explanation}\n\n`;
    }
  });
  
  // Answer Key
  text += `## Answer Key\n\n`;
  quiz.questions.forEach((q, index) => {
    let answer = '';
    if (q.type === 'multiple-choice' && typeof q.correctAnswer === 'number') {
      answer = String.fromCharCode(65 + q.correctAnswer);
    } else if (q.type === 'true-false') {
      answer = q.correctAnswer === 'true' ? 'True' : 'False';
    } else {
      answer = String(q.correctAnswer || '');
    }
    text += `${index + 1}. ${answer}\n`;
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