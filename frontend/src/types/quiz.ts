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

// Parser utility
export function parseQuizFromAI(aiResponse: string): ParsedQuiz | null {
  try {
    // First, try to extract JSON from markdown code blocks
    const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
    
    // Parse JSON
    const parsed = JSON.parse(jsonString);
    
    // Validate structure
    if (!parsed.metadata || !parsed.questions || !Array.isArray(parsed.questions)) {
      console.error('Invalid quiz structure');
      return null;
    }
    
    // Add IDs if missing
    parsed.questions = parsed.questions.map((q: any, index: number) => ({
      ...q,
      id: q.id || `q_${Date.now()}_${index}`
    }));
    
    return parsed as ParsedQuiz;
  } catch (error) {
    console.error('Failed to parse quiz JSON:', error);
    return null;
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