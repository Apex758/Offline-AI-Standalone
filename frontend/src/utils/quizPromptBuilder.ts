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

// Question type specifications
const QUESTION_TYPE_SPECS = {
  'Multiple Choice': {
    jsonStructure: {
      type: 'multiple-choice',
      question: 'string',
      options: ['array of 4 options'],
      correctAnswer: 'number (0-3, index of correct option)',
      explanation: 'string (optional)'
    },
    instructions: `Create questions with exactly 4 options (A, B, C, D).
- The correct answer should be randomly positioned (not always A or D)
- Wrong options (distractors) should be plausible but clearly incorrect
- All options should be similar in length and complexity
- Avoid "all of the above" or "none of the above" options`
  },
  'True/False': {
    jsonStructure: {
      type: 'true-false',
      question: 'string (statement, not a question)',
      options: ['True', 'False'],
      correctAnswer: '"true" or "false" (string)',
      explanation: 'string (optional)'
    },
    instructions: `Create STATEMENTS that are definitively true or false.
- Write declarative statements, NOT questions
- Avoid absolute words like "always" or "never" unless factually accurate
- Make statements clear and unambiguous
- Balance true and false answers (not all true, not all false)
- Example: "Photosynthesis occurs in the chloroplasts of plant cells." (not "Does photosynthesis occur...")`
  },
  'Fill-in-the-Blank': {
    jsonStructure: {
      type: 'fill-blank',
      question: 'string (with _____ for blank)',
      correctAnswer: 'string (exact answer expected)',
      explanation: 'string (optional)'
    },
    instructions: `Create sentences with ONE blank using _____ 
- The blank should test a key vocabulary term or concept
- Provide enough context to determine the answer
- Accept reasonable synonyms in grading
- Example: "The process by which plants make food is called _____." (Answer: photosynthesis)`
  },
  'Open-Ended': {
    jsonStructure: {
      type: 'open-ended',
      question: 'string',
      correctAnswer: 'string (sample answer or rubric)',
      explanation: 'string (grading criteria)'
    },
    instructions: `Create questions requiring detailed written responses.
- Questions should require explanation, analysis, or synthesis
- Provide a sample answer or key points in correctAnswer field
- Include grading criteria in explanation field
- Match writing expectations to grade level`
  }
};

export function buildQuizPrompt(formData: QuizFormData): string {
  const gradeSpec = GRADE_SPECS[formData.gradeLevel as keyof typeof GRADE_SPECS];
  const questionTypes = formData.questionTypes;
  
  // Build question type instructions
  let typeInstructions = '';
  if (questionTypes.length === 1) {
    const type = questionTypes[0];
    const spec = QUESTION_TYPE_SPECS[type as keyof typeof QUESTION_TYPE_SPECS];
    typeInstructions = `
ALL ${formData.numberOfQuestions} QUESTIONS MUST BE ${type.toUpperCase()} FORMAT.

JSON Structure for each question:
${JSON.stringify(spec.jsonStructure, null, 2)}

${spec.instructions}

Grade ${formData.gradeLevel} ${type} Requirements:
- ${gradeSpec.questionComplexity}
- ${gradeSpec.sentenceStructure}
- ${gradeSpec.vocabulary}
`;
  } else {
    typeInstructions = `
Create a MIX of these question types: ${questionTypes.join(', ')}
Distribute evenly across all ${formData.numberOfQuestions} questions.

Each question type must follow its specific JSON structure:
${questionTypes.map(type => {
  const spec = QUESTION_TYPE_SPECS[type as keyof typeof QUESTION_TYPE_SPECS];
  return `\n${type}:\n${JSON.stringify(spec.jsonStructure, null, 2)}\n${spec.instructions}`;
}).join('\n')}
`;
  }

  const prompt = `Generate a quiz in VALID JSON format. Output ONLY the JSON, no other text.

CRITICAL: Your response must be VALID JSON that can be parsed by JSON.parse()

JSON Structure:
{
  "metadata": {
    "title": "string",
    "subject": "${formData.subject}",
    "gradeLevel": "Grade ${formData.gradeLevel}",
    "totalQuestions": ${formData.numberOfQuestions},
    "instructions": "string (appropriate instructions for ${gradeSpec.name} students)"
  },
  "questions": [
    // array of ${formData.numberOfQuestions} question objects
  ]
}

GRADE ${formData.gradeLevel} (${gradeSpec.name}) SPECIFICATIONS:
- Reading Level: ${gradeSpec.readingLevel}
- Sentence Structure: ${gradeSpec.sentenceStructure}
- Vocabulary: ${gradeSpec.vocabulary}
- Concepts: ${gradeSpec.concepts}
- Complexity: ${gradeSpec.questionComplexity}
- Cognitive Depth: ${gradeSpec.cognitiveDepth}
- Use these contexts: ${gradeSpec.examples}

SUBJECT: ${formData.subject}
Focus on ${formData.subject} concepts appropriate for ${gradeSpec.name}.

LEARNING OUTCOMES TO ASSESS:
${formData.learningOutcomes}

${typeInstructions}

COGNITIVE LEVELS TO TARGET:
${formData.cognitiveLevels.join(', ')} - appropriate for ${gradeSpec.name}

${formData.timeLimitPerQuestion ? `TIME CONSIDERATION: ${formData.timeLimitPerQuestion} seconds per question - keep questions concise` : ''}

CRITICAL REQUIREMENTS:
1. Create EXACTLY ${formData.numberOfQuestions} questions
2. Use ${gradeSpec.name}-appropriate vocabulary and concepts
3. Match ${gradeSpec.cognitiveDepth} cognitive level
4. Output ONLY valid JSON, no markdown, no explanations
5. Ensure all questions assess the learning outcomes
6. Make questions age-appropriate and engaging for ${gradeSpec.name} students

Start your response with { and end with }`;

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