import { buildCurriculumPromptSection } from './curriculumPromptSection';
import { getLanguageInstruction } from './languageInstruction';

interface QuizFormData {
  subject: string;
  gradeLevel: string;
  learningOutcomes: string;
  questionTypes: string[];
  cognitiveLevels: string[];
  numberOfQuestions: string;
  timeLimitPerQuestion?: string;
  strand: string;
  essentialOutcomes: string;
  specificOutcomes: string;
}

export interface QuizPromptParts {
  systemPrompt: string;
  userPrompt: string;
}

// Grade-specific pedagogical guidance (unified format)
const GRADE_SPECS = {
  'K': {
    name: 'Kindergarten',
    ageRange: '5-6 years',
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
    ageRange: '6-7 years',
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
    ageRange: '7-8 years',
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
    ageRange: '8-9 years',
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
    ageRange: '9-10 years',
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
    ageRange: '10-11 years',
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
    ageRange: '11-12 years',
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

function buildFormatInstructions(questionTypes: string[]): string {
  const hasMultipleChoice = questionTypes.includes('Multiple Choice');
  const hasTrueFalse = questionTypes.includes('True/False');
  const hasFillBlank = questionTypes.includes('Fill-in-the-Blank');
  const hasOpenEnded = questionTypes.includes('Open-Ended');

  if (!hasMultipleChoice && !hasTrueFalse && !hasFillBlank && !hasOpenEnded) return '';

  let formatInstructions = 'FORMAT EACH QUESTION EXACTLY BASED ON ITS TYPE:\n\n';

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
Question X: [Statement only — do NOT prefix with "True or False:"]
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

  return formatInstructions;
}

function buildDistributionInstruction(numberOfQuestions: string, questionTypes: string[]): string {
  const total = parseInt(numberOfQuestions) || 10;
  if (questionTypes.length <= 1) return '';

  const base = Math.floor(total / questionTypes.length);
  const remainder = total % questionTypes.length;
  const parts = questionTypes.map((type, i) => {
    const count = base + (i < remainder ? 1 : 0);
    return `${count} ${type}`;
  });

  return `- Distribute the ${total} questions across types: ${parts.join(', ')}. The total must be exactly ${total}.`;
}

export function buildQuizPrompt(formData: QuizFormData, lessonPlanText?: string, language?: string): QuizPromptParts {
  const gradeSpec = GRADE_SPECS[formData.gradeLevel as keyof typeof GRADE_SPECS];
  const formatInstructions = buildFormatInstructions(formData.questionTypes);

  if (lessonPlanText) {
    // Lesson-plan-based quiz: system prompt carries the pedagogical guidance
    const systemPrompt = `You are an expert educational assessment designer. Create comprehensive, well-structured quizzes that accurately assess student learning.

TARGET STUDENTS: Grade ${formData.gradeLevel} (${gradeSpec.name}), typically aged ${gradeSpec.ageRange}

GRADE LEVEL REQUIREMENTS:
- Pedagogical Approach: ${gradeSpec.pedagogicalApproach}
- Learning Objective Depth: ${gradeSpec.learningObjectiveDepth}
- Reading Level: ${gradeSpec.readingLevel}
- Vocabulary: ${gradeSpec.vocabulary}

${formatInstructions}
RULES:
- Generate EXACTLY ${formData.numberOfQuestions} questions numbered 1 to ${formData.numberOfQuestions}.
- Stop after Question ${formData.numberOfQuestions}. Do not add extra questions.
${buildDistributionInstruction(formData.numberOfQuestions, formData.questionTypes)}
- Include correct answer and explanation for each question.
- Align questions to these cognitive levels: ${formData.cognitiveLevels.join(', ')}.
- For True/False questions, write the statement directly. Do NOT prefix with "True or False:".
- Do NOT repeat or echo these instructions in your output. Output ONLY the quiz questions.`;

    const userPrompt = `Generate a ${formData.numberOfQuestions}-question quiz based on the following lesson plan. Questions must assess what was taught in the lesson.

LESSON PLAN:
${lessonPlanText}

QUESTION TYPES: ${formData.questionTypes.join(', ')}

Begin with Question 1:`;

    return { systemPrompt: systemPrompt + getLanguageInstruction(language), userPrompt };
  }

  // Standard quiz: system prompt carries all instructional context
  const curriculumSection = buildCurriculumPromptSection(
    formData.essentialOutcomes || '',
    formData.specificOutcomes || '',
    'quiz'
  );

  const systemPrompt = `You are an expert educational assessment designer. Create comprehensive, well-structured quizzes that accurately assess student learning and align with curriculum standards.

SUBJECT: ${formData.subject}
GRADE: ${formData.gradeLevel}
TARGET STUDENTS: Typically aged ${gradeSpec.ageRange}
STRAND: ${formData.strand}
${curriculumSection}
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
RULES:
- Generate EXACTLY ${formData.numberOfQuestions} questions numbered 1 to ${formData.numberOfQuestions}.
- Stop after Question ${formData.numberOfQuestions}. Do not add extra questions.
${buildDistributionInstruction(formData.numberOfQuestions, formData.questionTypes)}
- Include correct answer and explanation for each question.
- Align questions to these cognitive levels: ${formData.cognitiveLevels.join(', ')}.
- For True/False questions, write the statement directly. Do NOT prefix with "True or False:".
- Do NOT repeat or echo these instructions in your output. Output ONLY the quiz questions.`;

  const userPrompt = `Create a ${formData.numberOfQuestions}-question ${formData.questionTypes.join(' and ')} quiz for Grade ${formData.gradeLevel} ${formData.subject} students on ${formData.strand}, focusing on: ${formData.learningOutcomes || formData.specificOutcomes || formData.essentialOutcomes}.

Begin with Question 1:`;

  return { systemPrompt: systemPrompt + getLanguageInstruction(language), userPrompt };
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
