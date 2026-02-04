interface QuizFormData {
  subject: string;
  gradeLevel: string;
  learningOutcomes: string;
  questionTypes: string[];
  cognitiveLevels: string[];
  numberOfQuestions: string;
  timeLimitPerQuestion?: string;
}

// Grade-specific pedagogical guidance (unified format)
const GRADE_SPECS = {
  'K': {
    name: 'Kindergarten',
    pedagogicalApproach: 'Play-based, hands-on learning with frequent transitions',
    activityTypes: 'Sensory play, movement, songs, stories, dramatic play, art',
    assessmentMethods: 'Observation checklists, anecdotal notes, thumbs up/down',
    materialComplexity: 'Large manipulatives, bright visuals, real objects',
    learningObjectiveDepth: 'Recognition, identification, basic motor skills (Bloom: Remember)',
    instructionalLanguage: 'Simple 3-5 word instructions, visual cues required',
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
    pedagogicalApproach: 'Concrete experiences with guided practice and modeling',
    activityTypes: 'Center activities, partner work, simple experiments, craft projects',
    assessmentMethods: 'Exit tickets, work samples, simple rubrics, oral responses',
    materialComplexity: 'Manipulatives, pictures with words, simple worksheets',
    learningObjectiveDepth: 'Recall, basic application, simple comparisons (Bloom: Remember, Understand)',
    instructionalLanguage: 'Clear step-by-step directions with demonstrations',
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
    pedagogicalApproach: 'Guided discovery with structured collaboration',
    activityTypes: 'Small group projects, hands-on investigations, role-play, journals',
    assessmentMethods: 'Rubrics, peer assessment, self-reflection, portfolios',
    materialComplexity: 'Graphic organizers, simple texts, basic tools and instruments',
    learningObjectiveDepth: 'Comprehension, application, basic analysis (Bloom: Understand, Apply)',
    instructionalLanguage: 'Multi-step instructions with visual supports',
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
    pedagogicalApproach: 'Inquiry-based with scaffolded independence',
    activityTypes: 'Research projects, experiments, presentations, collaborative tasks',
    assessmentMethods: 'Performance tasks, written responses, project rubrics, quizzes',
    materialComplexity: 'Reference materials, detailed diagrams, age-appropriate tech tools',
    learningObjectiveDepth: 'Application, analysis, beginning synthesis (Bloom: Apply, Analyze)',
    instructionalLanguage: 'Detailed written and verbal instructions',
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
    pedagogicalApproach: 'Student-centered inquiry with differentiation',
    activityTypes: 'Independent research, debates, design challenges, multimedia projects',
    assessmentMethods: 'Essays, presentations, self-assessment, peer review, tests',
    materialComplexity: 'Multiple sources, technical tools, complex models and diagrams',
    learningObjectiveDepth: 'Analysis, synthesis, evaluation (Bloom: Analyze, Evaluate)',
    instructionalLanguage: 'Complex instructions with options for student choice',
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
    pedagogicalApproach: 'Collaborative inquiry with critical thinking emphasis',
    activityTypes: 'Extended projects, scientific investigations, literary analysis, debates',
    assessmentMethods: 'Research papers, oral presentations, portfolios, authentic assessments',
    materialComplexity: 'Primary sources, advanced technology, specialized equipment',
    learningObjectiveDepth: 'Synthesis, evaluation, creation (Bloom: Evaluate, Create)',
    instructionalLanguage: 'Sophisticated directions with metacognitive prompts',
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
    pedagogicalApproach: 'Independent inquiry with real-world connections',
    activityTypes: 'Capstone projects, expert presentations, community partnerships, research',
    assessmentMethods: 'Authentic assessments, portfolios, peer and expert feedback, exhibitions',
    materialComplexity: 'Academic texts, professional tools, complex digital resources',
    learningObjectiveDepth: 'Advanced evaluation and creation (Bloom: Evaluate, Create)',
    instructionalLanguage: 'Academic language with student-driven modifications',
    readingLevel: '400+ words per question',
    sentenceStructure: 'Advanced academic writing structures',
    vocabulary: 'Advanced academic and technical terminology',
    concepts: 'Abstract reasoning, critical thinking, evidence-based conclusions',
    questionComplexity: 'Multi-step reasoning, extended response with evidence',
    examples: 'Complex problem-solving, critical analysis, research-based responses',
    cognitiveDepth: 'Analysis, synthesis, evaluation'
  }
};

function getSubjectGuidance(subject: string): string {
  const guidance: Record<string, string> = {
    'Mathematics': `
Subject-Specific Guidance for Mathematics (Grades K-6):
- Focus Areas: Problem-solving, conceptual understanding, procedural fluency, mathematical reasoning
- Assessment Types: Computational problems, word problems, problem-solving tasks, error analysis
- Question Strategies: Include visual representations, multi-step problems, real-world contexts
- Grade Progression:
  * K-1: Counting, basic shapes, simple addition/subtraction with visuals
  * 2-3: Multi-digit operations, place value, introductory fractions, measurement
  * 4-5: Multiplicative reasoning, fraction/decimal operations, geometry, data analysis
  * 6: Ratio/proportional reasoning, algebraic expressions, statistical thinking
- Common Pitfalls to Avoid: Questions that test only memorization, lack of visual support for younger grades, overly abstract problems without context
`,
    'Language Arts': `
Subject-Specific Guidance for Language Arts (Grades K-6):
- Focus Areas: Reading comprehension, vocabulary, grammar, writing skills, literary analysis
- Assessment Types: Comprehension questions, vocabulary in context, grammar application, writing prompts
- Question Strategies: Use authentic texts, include inference questions, test vocabulary in context
- Grade Progression:
  * K-1: Letter recognition, phonics, sight words, simple comprehension
  * 2-3: Reading fluency, vocabulary, narrative elements, paragraph writing
  * 4-5: Critical reading, main idea/supporting details, genre analysis, expository writing
  * 6: Literary analysis, argumentation, research skills, synthesis of texts
- Common Pitfalls to Avoid: Isolated grammar drills without context, comprehension questions that can be answered without reading
`,
    'Science': `
Subject-Specific Guidance for Science (Grades K-6):
- Focus Areas: Scientific inquiry, concepts, process skills, evidence-based reasoning
- Assessment Types: Conceptual questions, scientific method application, data interpretation, scenario-based problems
- Question Strategies: Include diagrams/charts, experimental scenarios, application to real phenomena
- Grade Progression:
  * K-1: Observing, describing properties, living vs non-living, basic needs
  * 2-3: Life cycles, matter states, weather, simple investigations, data collection
  * 4-5: Ecosystems, earth systems, forces/motion, controlled experiments, variables
  * 6: Scientific method, energy transfer, human body systems, independent inquiry
- Common Pitfalls to Avoid: Questions testing memorization only, "gotcha" questions, lack of connection to phenomena
`,
    'Social Studies': `
Subject-Specific Guidance for Social Studies (Grades K-6):
- Focus Areas: Historical thinking, geographic reasoning, civics, economics, culture
- Assessment Types: Document-based questions, map skills, cause-effect analysis, perspective-taking
- Question Strategies: Use primary sources, include maps/timelines, connect to current events
- Grade Progression:
  * K-1: Families, communities, basic map skills, holidays, rules
  * 2-3: Neighborhoods, local history, cultures, goods/services, government basics
  * 4-5: Regions, indigenous peoples, historical events, government functions, economics
  * 6: Ancient civilizations, world geography, U.S. history, comparative government
- Common Pitfalls to Avoid: Questions focused only on dates/facts, single perspectives, lack of primary source engagement
`
  };

  return guidance[subject] || '';
}

export function buildQuizPrompt(formData: QuizFormData): string {
  const gradeSpec = GRADE_SPECS[formData.gradeLevel as keyof typeof GRADE_SPECS];

  // Build format instructions based on selected question types
  let formatInstructions = '';
  const hasMultipleChoice = formData.questionTypes.includes('Multiple Choice');
  const hasTrueFalse = formData.questionTypes.includes('True/False');
  const hasFillBlank = formData.questionTypes.includes('Fill-in-the-Blank');
  const hasOpenEnded = formData.questionTypes.includes('Open-Ended');

  if (hasMultipleChoice || hasTrueFalse || hasFillBlank || hasOpenEnded) {
    formatInstructions = 'FORMAT EACH QUESTION EXACTLY BASED ON ITS TYPE:\n\n';

    if (hasMultipleChoice) {
      formatInstructions += `MULTIPLE CHOICE FORMAT:
Question X: [question text]
A) [option]
B) [option]
C) [option]
D) [option]
Correct Answer: A
Explanation: [explanation]

`;
    }

    if (hasTrueFalse) {
      formatInstructions += `TRUE/FALSE FORMAT:
Question X: [True or False statement]
A) True
B) False
Correct Answer: True
Explanation: [Why this is true/false]

`;
    }

    if (hasFillBlank) {
      formatInstructions += `FILL-IN-THE-BLANK FORMAT:
Question X: [Question text with _____ for the blank]
Answer: [correct word/phrase]
Explanation: [Why this is the answer]

`;
    }

    if (hasOpenEnded) {
      formatInstructions += `OPEN-ENDED FORMAT:
Question X: [Write ONLY the question here. Do NOT append "(Sample Answer)" or any example text to this line]
Sample Answer: [Example of a good response — on its own line, NOT part of the question above]
Key Points: [Bullet points of what should be included]
Explanation: [Additional context or rubric guidance]

`;
    }
  }


  const prompt = `Create a complete ${formData.numberOfQuestions}-question quiz for Grade ${formData.gradeLevel} students, specifically focusing on these learning outcomes: ${formData.learningOutcomes}.

SUBJECT: ${formData.subject}

QUESTION TYPES: Use ${formData.questionTypes.join(', ')}

GRADE LEVEL REQUIREMENTS:
- Pedagogical Approach: ${gradeSpec.pedagogicalApproach}
- Assessment Methods: ${gradeSpec.assessmentMethods}
- Learning Objective Depth: ${gradeSpec.learningObjectiveDepth}
- Instructional Language: ${gradeSpec.instructionalLanguage}
- Reading Level: ${gradeSpec.readingLevel}
- Sentence Structure: ${gradeSpec.sentenceStructure}
- Vocabulary: ${gradeSpec.vocabulary}
- Focus Areas: ${gradeSpec.examples}

SUBJECT-SPECIFIC ASSESSMENT GUIDANCE:
${getSubjectGuidance(formData.subject)}

${formatInstructions}

CRITICAL REQUIREMENTS:
- Generate EXACTLY ${formData.numberOfQuestions} questions
- Number questions from 1 to ${formData.numberOfQuestions}
- Stop after Question ${formData.numberOfQuestions}
- Include correct answer and explanation for each question
- Do not add extra questions beyond ${formData.numberOfQuestions}
- Align questions to: ${formData.cognitiveLevels.join(', ')}

Generate questions 1-${formData.numberOfQuestions} now:`;

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
