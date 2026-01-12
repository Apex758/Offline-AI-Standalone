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
      listFormat = `WORD BANK FORMAT:

Step 1: Create a word bank with 6-8 words/terms related to "${formData.topic}".

**Word Bank:** [list the words separated by commas]

Step 2: Create ${questionCount} fill-in-the-blank sentences using this EXACT format:

Question 1: Word Bank
When we have 45 pencils and we add 27 more, we now have _______ pencils.

Question 2: Word Bank
If we have 54 crayons and we subtract 17, we have _______ crayons left.

Question 3: Word Bank
If we have 24 books and we multiply by 4, we have a total of _______ books.

CRITICAL FORMAT RULES:
- Line 1: "Question X: Word Bank" (NO question text on this line)
- Line 2: The actual sentence with _______ blank
- Use exactly ${questionCount} questions
- All questions about "${formData.topic}"
- DO NOT use **Question X:** format
- DO NOT put the sentence on the same line as "Question X:"`;

    } else if (formData.questionType === 'True / False') {
      listFormat = `TRUE/FALSE FORMAT - FOLLOW EXACTLY:

Create ${questionCount} true/false statements about "${formData.topic}" for ${formData.subject}.

Question 1: True / False
[Write a true or false statement about ${formData.topic}]

Question 2: True / False
[Write a different true or false statement about ${formData.topic}]

Continue for all ${questionCount} questions.

CRITICAL RULES:
- Format: "Question X: True / False" followed by statement
- Generate exactly ${questionCount} questions
- Mix true and false statements roughly equally
- All statements must be about "${formData.topic}"`;

    } else if (formData.questionType === 'Fill in the Blank') {
      listFormat = `FILL IN THE BLANK FORMAT - FOLLOW EXACTLY:

Create ${questionCount} fill-in-the-blank questions about "${formData.topic}" for ${formData.subject}.

Question 1: Fill in the Blank
[Write a sentence about ${formData.topic} with ONE blank using _______]

Question 2: Fill in the Blank
[Write a different sentence about ${formData.topic} with ONE blank using _______]

Continue for all ${questionCount} questions.

CRITICAL RULES:
- Format: "Question X: Fill in the Blank" followed by sentence
- Generate exactly ${questionCount} questions
- Each sentence has ONE blank using _______
- All questions must be about "${formData.topic}"`;

    } else if (formData.questionType === 'Short Answer') {
      listFormat = `SHORT ANSWER FORMAT - FOLLOW EXACTLY:

Create ${questionCount} short answer questions about "${formData.topic}" for ${formData.subject}.

Question 1: Short Answer
[Write a question about ${formData.topic} requiring 2-4 sentences]

Question 2: Short Answer
[Write a different question about ${formData.topic} requiring 2-4 sentences]

Continue for all ${questionCount} questions.

CRITICAL RULES:
- Format: "Question X: Short Answer" followed by question
- Generate exactly ${questionCount} questions
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

GRADE LEVEL REQUIREMENTS (CRITICAL):
Reading Level: ${gradeSpec.readingLevel}
Sentence Structure: ${gradeSpec.sentenceStructure}
Vocabulary: ${gradeSpec.vocabulary}
Focus Areas: ${gradeSpec.examples}
Question Complexity: ${gradeSpec.questionComplexity}
Cognitive Depth: ${gradeSpec.cognitiveDepth}

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

Begin generating the worksheet now:`;

  return prompt;
}