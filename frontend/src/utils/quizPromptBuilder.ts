// utils/quizPromptBuilder.ts - Add to frontend/src/utils/

interface QuizFormData {
  subject: string;
  gradeLevel: string;
  learningOutcomes: string;
  questionTypes: string[];
  cognitiveLevels: string[];
  numberOfQuestions: string;
  timeLimitPerQuestion?: string;
}

// Grade-specific vocabulary and complexity guidance
const GRADE_SPECS = {
  'K': {
    name: 'Kindergarten',
    readingLevel: '50-100 words per question',
    sentenceStructure: 'Simple 3-5 word sentences',
    vocabulary: 'Use only basic sight words and common nouns',
    concepts: 'Focus on concrete, observable things children can see, touch, or experience directly',
    questionComplexity: 'Single-step thinking, yes/no or one-word answers preferred',
    examples: 'Use familiar items: toys, colors, animals, family, home, school',
    cognitiveDepth: 'Recognition and recall only'
  },
  '1': {
    name: 'Grade 1',
    readingLevel: '100-150 words per question',
    sentenceStructure: 'Simple sentences with basic conjunctions',
    vocabulary: 'Basic academic vocabulary, simple descriptive words',
    concepts: 'Concrete concepts with some simple comparisons',
    questionComplexity: '1-2 step thinking, short answer responses',
    examples: 'Use school and home contexts, seasons, basic emotions',
    cognitiveDepth: 'Recognition, recall, and simple application'
  },
  '2': {
    name: 'Grade 2',
    readingLevel: '150-200 words per question',
    sentenceStructure: 'Compound sentences, basic transitions',
    vocabulary: 'Age-appropriate academic terms, more descriptive language',
    concepts: 'Observable patterns, simple cause-effect, basic categorization',
    questionComplexity: '2-3 step thinking, paragraph responses emerging',
    examples: 'Community helpers, simple scientific processes, story sequences',
    cognitiveDepth: 'Recall, comprehension, and basic analysis'
  },
  '3': {
    name: 'Grade 3',
    readingLevel: '200-250 words per question',
    sentenceStructure: 'Mix of simple and complex sentences',
    vocabulary: 'Subject-specific terms introduced with context',
    concepts: 'More abstract ideas, multiple-step processes, comparisons',
    questionComplexity: '3-4 step thinking, detailed explanations',
    examples: 'Historical events, scientific experiments, problem-solving scenarios',
    cognitiveDepth: 'Comprehension, application, beginning analysis'
  },
  '4': {
    name: 'Grade 4',
    readingLevel: '250-300 words per question',
    sentenceStructure: 'Complex sentences with multiple clauses',
    vocabulary: 'Academic vocabulary with technical terms',
    concepts: 'Abstract concepts, systems thinking, cause-effect chains',
    questionComplexity: '4-5 step thinking, multi-paragraph responses',
    examples: 'Complex systems (ecosystems, government), data interpretation',
    cognitiveDepth: 'Application, analysis, beginning synthesis'
  },
  '5': {
    name: 'Grade 5',
    readingLevel: '300-400 words per question',
    sentenceStructure: 'Sophisticated sentence structures',
    vocabulary: 'Subject-specific terminology, nuanced language',
    concepts: 'Complex systems, relationships between concepts, evaluation',
    questionComplexity: '5-6 step thinking, well-developed arguments',
    examples: 'Scientific investigations, historical analysis, literary analysis',
    cognitiveDepth: 'Analysis, synthesis, beginning evaluation'
  },
  '6': {
    name: 'Grade 6',
    readingLevel: '400+ words per question',
    sentenceStructure: 'Advanced academic writing structures',
    vocabulary: 'Advanced academic and technical terminology',
    concepts: 'Abstract reasoning, critical thinking, evidence-based conclusions',
    questionComplexity: 'Multi-step reasoning, extended response with evidence',
    examples: 'Complex problem-solving, critical analysis, research-based responses',
    cognitiveDepth: 'Analysis, synthesis, evaluation'
  }
};

export function buildQuizPrompt(formData: QuizFormData): string {
  const gradeSpec = GRADE_SPECS[formData.gradeLevel as keyof typeof GRADE_SPECS];
  
  const prompt = `Create a complete ${formData.numberOfQuestions}-question quiz for Grade ${formData.gradeLevel} students. YOU MUST GENERATE ALL ${formData.numberOfQuestions} QUESTIONS.

SUBJECT: ${formData.subject}

LEARNING OUTCOMES:
${formData.learningOutcomes}

QUESTION TYPES: Use ${formData.questionTypes.join(', ')}

GRADE LEVEL REQUIREMENTS:
- Use ${gradeSpec.vocabulary}
- ${gradeSpec.sentenceStructure}
- Focus on: ${gradeSpec.examples}

FORMAT EACH QUESTION EXACTLY LIKE THIS:

Question 1: [question text]
A) [option]
B) [option]
C) [option]
D) [option]
Correct Answer: A
Explanation: [explanation]

IMPORTANT:
- Generate ALL ${formData.numberOfQuestions} questions
- Each question must have all 4 options (A, B, C, D)
- Include the correct answer for each
- Add an explanation for each answer

Start generating all ${formData.numberOfQuestions} questions now:`;

  return prompt;
}

// Helper to map frontend question types to backend format
export function mapQuestionType(frontendType: string): string {
  const mapping: Record<string, string> = {
    'Multiple Choice': 'multiple-choice',
    'True/False': 'true-false',
    'Fill-in-the-Blank': 'fill-blank',
    'Open-Ended': 'open-ended'
  };
  return mapping[frontendType] || frontendType.toLowerCase().replace(/\s+/g, '-');
}