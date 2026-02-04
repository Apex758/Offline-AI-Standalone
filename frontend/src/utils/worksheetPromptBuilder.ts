interface WorksheetFormData {
  subject: string;
  gradeLevel: string;
  strand: string;
  topic: string;
  studentCount: string;
  questionCount: string;
  questionType: string;
  selectedTemplate: string;
  worksheetTitle: string;
  includeImages: boolean;
  imageStyle: string;
  imageMode: string;
  imagePlacement: string;
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
Subject-Specific Guidance for Mathematics Worksheets (Grades K-6):
- Focus Areas: Number sense, operations, problem-solving, geometry, measurement, data analysis
- Worksheet Types: Computation practice, word problems, number puzzles, pattern recognition, graphing
- Pedagogical Approaches: Concrete-pictorial-abstract progression, scaffolding from simple to complex, multiple representations
- Grade Progression:
  * K-1: Counting, number recognition, basic shapes, simple addition/subtraction with visuals
  * 2-3: Place value, multi-digit operations, time/money, measurement, introductory fractions
  * 4-5: Multi-digit multiplication/division, fraction/decimal operations, area/perimeter, data analysis
  * 6: Ratio/proportion, algebraic expressions, geometry, statistics, pre-algebra concepts
- Format Tips: Include workspace for showing work, number lines, graph paper for geometry, visual models
- Common Pitfalls to Avoid: Too many problems causing fatigue, lack of visual support, rote drill without understanding
`,
    'Language Arts': `
Subject-Specific Guidance for Language Arts Worksheets (Grades K-6):
- Focus Areas: Reading comprehension, vocabulary, grammar, writing, spelling, phonics
- Worksheet Types: Comprehension questions, vocabulary matching, grammar exercises, writing prompts, phonics practice
- Pedagogical Approaches: Balanced literacy, gradual release, authentic contexts, multisensory activities
- Grade Progression:
  * K-1: Letter recognition, phonics, sight words, simple sentence writing, picture comprehension
  * 2-3: Reading passages, vocabulary in context, paragraph writing, basic grammar, story elements
  * 4-5: Complex texts, figurative language, essay planning, research skills, editing/revising
  * 6: Literary analysis, argument writing, research documentation, advanced grammar, synthesis
- Format Tips: Include graphic organizers, space for writing, word banks for support, clear rubrics
- Common Pitfalls to Avoid: Isolated grammar drills, comprehension questions answerable without reading, insufficient writing space
`,
    'Science': `
Subject-Specific Guidance for Science Worksheets (Grades K-6):
- Focus Areas: Scientific concepts, inquiry skills, vocabulary, data analysis, diagrams/labeling
- Worksheet Types: Observation recording, diagram labeling, experiment planning, data tables, concept mapping
- Pedagogical Approaches: Inquiry-based, hands-on connections, real-world applications, visual learning
- Grade Progression:
  * K-1: Observing/describing, living/non-living, five senses, basic needs, simple classifications
  * 2-3: Life cycles, matter states, weather patterns, simple investigations, data collection basics
  * 4-5: Ecosystems, earth systems, forces/motion, controlled experiments, graphing data
  * 6: Scientific method, variables, energy transfer, human body systems, independent inquiry
- Format Tips: Include diagrams to label, data tables, observation charts, prediction spaces, conclusion sections
- Common Pitfalls to Avoid: Memorization-focused questions, lack of connection to phenomena, no space for observations
`,
    'Social Studies': `
Subject-Specific Guidance for Social Studies Worksheets (Grades K-6):
- Focus Areas: History, geography, civics, economics, culture, map skills, timelines
- Worksheet Types: Map activities, timeline creation, document analysis, comparison charts, research organizers
- Pedagogical Approaches: Inquiry-based, multiple perspectives, primary source analysis, connections to self
- Grade Progression:
  * K-1: Family trees, community maps, basic timeline, goods/services, rules/responsibilities
  * 2-3: Neighborhood maps, local history research, cultural comparisons, government basics, simple economics
  * 4-5: State/regional studies, historical event analysis, constitution basics, economic systems, document analysis
  * 6: Ancient civilizations, world geography, U.S. history research, comparative government, current events
- Format Tips: Include maps, timelines, graphic organizers, primary source excerpts, comparison charts
- Common Pitfalls to Avoid: Focus on memorizing dates/facts, single perspectives, lack of primary sources
`
  };

  return guidance[subject] || '';
}

export function buildWorksheetPrompt(formData: WorksheetFormData): string {
  const gradeSpec = GRADE_SPECS[formData.gradeLevel as keyof typeof GRADE_SPECS];

  // Build template-specific instructions
  let templateInstructions = '';
  const questionCount = parseInt(formData.questionCount) || 10;

  if (formData.selectedTemplate === 'multiple-choice') {
    templateInstructions = `MULTIPLE CHOICE FORMAT:
For each question, use this exact format:

Question X: [question text]
A) [option]
B) [option]
C) [option]
D) [option]
Correct Answer: A

`;
  } else if (formData.selectedTemplate === 'comprehension') {
    // UPDATED - More explicit format instructions
    templateInstructions = `COMPREHENSION FORMAT - FOLLOW EXACTLY:

Step 1: Write the passage header and passage
**Passage:**

[Write a ${gradeSpec.readingLevel} reading passage here - 2-3 paragraphs about ${formData.topic}]

Step 2: Write the questions header
**Questions:**

Step 3: Write each question in this EXACT format:

**1.**

Instructions: [Brief instruction telling students what to do - e.g., "Read the passage carefully and answer the question."]

[The actual question text]

[Answer format: Describe how students should format their answer - e.g., "Write your answer in complete sentences."]

**2.**

Instructions: [Different instruction for this question]

[The actual question text for question 2]

[Answer format: ...]

CRITICAL FORMATTING RULES:
- Use **1.**, **2.**, etc. for question numbers (with double asterisks)
- Each question MUST have "Instructions:" on its own line
- Each question MUST have the actual question text on a separate line after Instructions
- Each question SHOULD have an [Answer format: ...] hint
- Generate EXACTLY ${questionCount} questions
- Use blank lines between sections
- Do NOT add extra headers or explanations

`;
  } else if (formData.selectedTemplate === 'matching') {
    // UPDATED - Topic-specific matching guidance
    const isMathTopic = formData.subject.toLowerCase().includes('math');

    const matchingGuidance = isMathTopic ? `
FOR MATH TOPICS:
- Column A: Math problems (e.g., "457 + 325 = ?", "18 × 3 = ?", "144 ÷ 12 = ?")
- Column B: Numerical answers (e.g., "782", "54", "12")
- SHUFFLE Column B so answers don't match the order in Column A
` : `
FOR NON-MATH TOPICS:
- Column A: Terms, concepts, or items to define/identify
- Column B: Definitions, descriptions, or matching items
- SHUFFLE Column B so matches don't align with Column A order
`;

    templateInstructions = `MATCHING FORMAT - FOLLOW EXACTLY:

**Title:** [Creative title related to ${formData.topic}]

**Instructions:** Draw lines to match the items in Column A with the correct items in Column B.

${matchingGuidance}

**Column A:**
1. [First item]
2. [Second item]
${questionCount > 2 ? `3. [Third item]\n...` : ''}
${questionCount}. [Last item]

**Column B:**
A. [First matching item]
B. [Second matching item]
${questionCount > 2 ? `C. [Third matching item]\n...` : ''}
${String.fromCharCode(64 + questionCount)}. [Last matching item]

CRITICAL REQUIREMENTS:
- Use **Column A:** and **Column B:** (with double asterisks)
- Number Column A items as: 1. 2. 3. etc.
- Letter Column B items as: A. B. C. etc.
- Generate EXACTLY ${questionCount} pairs (not ${questionCount + 1}, not ${questionCount - 1}, EXACTLY ${questionCount})
- Items in Column B must be SHUFFLED/randomized so they don't match the order of Column A
- For math: Column A = problems, Column B = answers

`;
  } else if (formData.selectedTemplate === 'list-based') {
    // Question-type-specific instructions
    let listFormat = '';

    if (formData.questionType === 'Word Bank') {
      // UPDATED: Smarter handling for math vs non-math topics
      const isMathSubject = formData.subject.toLowerCase().includes('math');

      const wordBankGuidance = isMathSubject ? `
FOR MATHEMATICS TOPICS:
- Create a word bank with 6-8 MATH VOCABULARY words (not numbers!)
- Examples: add, subtract, sum, difference, total, equals, plus, minus, multiply, divide, ones, tens, hundreds
- Sentences should test UNDERSTANDING of math concepts, not pure arithmetic
- Each sentence should use a vocabulary word from the bank in context

EXAMPLE for "multi digit operations":
**Word Bank:** add, subtract, sum, difference, equals, total

**Question 1:** When we _______ two numbers, we find how much they are together.
**Question 2:** To find the _______ between 50 and 30, we use subtraction.
**Question 3:** The answer to an addition problem is called the _______.

DO NOT create pure arithmetic like "457 + 275 = _______" - focus on VOCABULARY!
` : `
FOR NON-MATH TOPICS:
- Create a word bank with 6-8 topic-specific vocabulary words
- Choose key terms students need to learn about ${formData.topic}
- Each sentence should use one word from the bank in a meaningful way
`;

      listFormat = `WORD BANK FORMAT - FOLLOW EXACTLY:

Step 1: Create the worksheet title
**${formData.topic} Worksheet**

Step 2: Create the word bank with 6-8 words
${wordBankGuidance}

**Word Bank:** [word1], [word2], [word3], [word4], [word5], [word6]

IMPORTANT: The word bank MUST be on a SINGLE LINE with words separated by commas!
Example: **Word Bank:** add, subtract, sum, difference, equals, total

Step 3: Create ${questionCount} fill-in-the-blank sentences (NOT question prompts!)

${Array.from({ length: Math.min(questionCount, 3) }, (_, i) =>
  `**Question ${i + 1}:** [Complete sentence about ${formData.topic} with ONE blank shown as _______]`
).join('\n\n')}

${questionCount > 3 ? `... continue the pattern ...\n\n**Question ${questionCount}:** [Complete sentence about ${formData.topic} with ONE blank shown as _______]` : ''}

CRITICAL RULES - READ CAREFULLY:
1. DO NOT write instructions like "Write a sentence" or "Fill in the blank"
2. Each question must be a COMPLETE SENTENCE with ONE word missing (shown as _______)
3. The missing word MUST be from the word bank
4. Use **Question 1:**, **Question 2:** format (with double asterisks and colon)
5. All sentences MUST be directly about "${formData.topic}"
6. Generate EXACTLY ${questionCount} sentences
7. The word bank should appear ONCE at the top, NOT with each question
8. Each sentence should make sense when completed with a word from the bank
${isMathSubject ? '9. For math topics: Focus on VOCABULARY and CONCEPTS, not arithmetic calculations!' : ''}
`;

    } else if (formData.questionType === 'True / False') {
      listFormat = `TRUE/FALSE FORMAT - FOLLOW EXACTLY:

Create ${questionCount} true/false statements about "${formData.topic}" for ${formData.subject}.

${Array.from({ length: Math.min(questionCount, 2) }, (_, i) =>
  `Question ${i + 1}: True / False\n[Write a ${i === 0 ? '' : 'different '}true or false statement about ${formData.topic}]`
).join('\n\n')}

${questionCount > 2 ? `... continue the pattern ...\n\nQuestion ${questionCount}: True / False\n[Write another true or false statement about ${formData.topic}]` : ''}

CRITICAL RULES:
- Format: "Question X: True / False" followed by statement
- Generate EXACTLY ${questionCount} questions (count them!)
- Mix true and false statements roughly equally
- All statements must be about "${formData.topic}"`;

    } else if (formData.questionType === 'Fill in the Blank') {
      listFormat = `FILL IN THE BLANK FORMAT - FOLLOW EXACTLY:

Create ${questionCount} fill-in-the-blank questions about "${formData.topic}" for ${formData.subject}.

${Array.from({ length: Math.min(questionCount, 2) }, (_, i) =>
  `Question ${i + 1}: Fill in the Blank\n[Write a ${i === 0 ? '' : 'different '}sentence about ${formData.topic} with ONE blank using _______]`
).join('\n\n')}

${questionCount > 2 ? `... continue the pattern ...\n\nQuestion ${questionCount}: Fill in the Blank\n[Write another sentence about ${formData.topic} with ONE blank using _______]` : ''}

CRITICAL RULES:
- Format: "Question X: Fill in the Blank" followed by sentence
- Generate EXACTLY ${questionCount} questions (count them!)
- Each sentence has ONE blank using _______
- All questions must be about "${formData.topic}"`;

    } else if (formData.questionType === 'Short Answer') {
      listFormat = `SHORT ANSWER FORMAT - FOLLOW EXACTLY:

Create ${questionCount} short answer questions about "${formData.topic}" for ${formData.subject}.

${Array.from({ length: Math.min(questionCount, 2) }, (_, i) =>
  `Question ${i + 1}: Short Answer\n[Write a ${i === 0 ? '' : 'different '}question about ${formData.topic} requiring 2-4 sentences]`
).join('\n\n')}

${questionCount > 2 ? `... continue the pattern ...\n\nQuestion ${questionCount}: Short Answer\n[Write another question about ${formData.topic} requiring 2-4 sentences]` : ''}

CRITICAL RULES:
- Format: "Question X: Short Answer" followed by question
- Generate EXACTLY ${questionCount} questions (count them!)
- Questions require 2-4 sentence responses
- All questions must be about "${formData.topic}"`;

    } else {
      listFormat = `Generate exactly ${questionCount} questions in this format:

Question 1: ${formData.questionType}
[Question text]

Question 2: ${formData.questionType}
[Question text]`;
    }

    templateInstructions = `LIST-BASED TEMPLATE:

${listFormat}

CRITICAL: Follow the EXACT format above for ${formData.questionType} questions.
Generate EXACTLY ${questionCount} questions.

`;
  }

  // Image instructions
  const imageInstructions = formData.includeImages ? `

IMAGE INSTRUCTIONS:
- Include relevant images to enhance understanding
- Image Style: ${formData.imageStyle}
- Image Mode: ${formData.imageMode}
- Image Placement: ${formData.imagePlacement}
- Generate descriptive image prompts or placeholders where images should appear

` : '';

  const prompt = `You are creating an educational worksheet for Grade ${formData.gradeLevel} students.

CURRICULUM CONTEXT:
- Subject: ${formData.subject}
- Strand: ${formData.strand}
- Topic: ${formData.topic}

GRADE LEVEL REQUIREMENTS:
- Pedagogical Approach: ${gradeSpec.pedagogicalApproach}
- Activity Types: ${gradeSpec.activityTypes}
- Assessment Methods: ${gradeSpec.assessmentMethods}
- Material Complexity: ${gradeSpec.materialComplexity}
- Learning Objective Depth: ${gradeSpec.learningObjectiveDepth}
- Instructional Language: ${gradeSpec.instructionalLanguage}
- Reading Level: ${gradeSpec.readingLevel}
- Sentence Structure: ${gradeSpec.sentenceStructure}
- Vocabulary: ${gradeSpec.vocabulary}
- Focus Areas: ${gradeSpec.examples}
- Question Complexity: ${gradeSpec.questionComplexity}
- Cognitive Depth: ${gradeSpec.cognitiveDepth}

SUBJECT-SPECIFIC GUIDANCE:
${getSubjectGuidance(formData.subject)}

WORKSHEET DETAILS:
- Title: ${formData.worksheetTitle || formData.topic + ' Worksheet'}
- Question Type: ${formData.questionType}
- Number of Questions: ${questionCount}
- Template: ${formData.selectedTemplate}

${templateInstructions}${imageInstructions}

ABSOLUTE REQUIREMENTS:
1. Generate EXACTLY ${questionCount} questions - no more, no less
2. Content must be age-appropriate for Grade ${formData.gradeLevel}
3. Follow the format EXACTLY as shown above
4. Use the specified markdown formatting (**text:** for headers)
5. Align all content with curriculum strand: ${formData.strand}
6. Make questions engaging and educational
7. Do NOT add extra explanations or preambles
8. Do NOT deviate from the specified format

⚠️ CRITICAL: You MUST generate ${questionCount} questions. Not ${questionCount - 1}, not ${questionCount + 1}, EXACTLY ${questionCount}. Count your questions before finishing! ⚠️

Begin generating the worksheet now:`;

  return prompt;
}
