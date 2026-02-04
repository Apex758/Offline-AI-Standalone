interface RubricFormData {
  assignmentType: string;
  subject: string;
  gradeLevel: string;
  performanceLevels: string;
  includePointValues: boolean;
  assignmentTitle?: string;
  learningObjectives?: string;
  specificRequirements?: string;
  focusAreas?: string[];
}

// Map number of levels to standard descriptive names
const PERFORMANCE_LEVEL_NAMES: { [key: string]: string[] } = {
  '3': ['Excellent', 'Proficient', 'Beginning'],
  '4': ['Excellent', 'Proficient', 'Developing', 'Beginning'],
  '5': ['Excellent', 'Proficient', 'Developing', 'Emerging', 'Beginning'],
  '6': ['Advanced', 'Excellent', 'Proficient', 'Developing', 'Emerging', 'Beginning']
};

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
    criteriaCount: '2-3 simple criteria',
    performanceDescriptors: 'Picture-based or emoji indicators (😊 😐 😟)',
    pointSystem: 'Avoid numerical points; use smiley faces or stickers'
  },
  '1': {
    name: 'Grade 1',
    pedagogicalApproach: 'Concrete experiences with guided practice and modeling',
    activityTypes: 'Center activities, partner work, simple experiments, craft projects',
    assessmentMethods: 'Exit tickets, work samples, simple rubrics, oral responses',
    materialComplexity: 'Manipulatives, pictures with words, simple worksheets',
    learningObjectiveDepth: 'Recall, basic application, simple comparisons (Bloom: Remember, Understand)',
    instructionalLanguage: 'Clear step-by-step directions with demonstrations',
    criteriaCount: '3-4 basic criteria',
    performanceDescriptors: 'Simple words with visual supports (Great, Good, Keep Trying)',
    pointSystem: 'Simple points (1-3) or stars if using point values'
  },
  '2': {
    name: 'Grade 2',
    pedagogicalApproach: 'Guided discovery with structured collaboration',
    activityTypes: 'Small group projects, hands-on investigations, role-play, journals',
    assessmentMethods: 'Rubrics, peer assessment, self-reflection, portfolios',
    materialComplexity: 'Graphic organizers, simple texts, basic tools and instruments',
    learningObjectiveDepth: 'Comprehension, application, basic analysis (Bloom: Understand, Apply)',
    instructionalLanguage: 'Multi-step instructions with visual supports',
    criteriaCount: '4-5 criteria',
    performanceDescriptors: 'Clear descriptive levels (Excellent, Good, Fair, Needs Work)',
    pointSystem: '1-4 point scale per criterion if using point values'
  },
  '3': {
    name: 'Grade 3',
    pedagogicalApproach: 'Inquiry-based with scaffolded independence',
    activityTypes: 'Research projects, experiments, presentations, collaborative tasks',
    assessmentMethods: 'Performance tasks, written responses, project rubrics, quizzes',
    materialComplexity: 'Reference materials, detailed diagrams, age-appropriate tech tools',
    learningObjectiveDepth: 'Application, analysis, beginning synthesis (Bloom: Apply, Analyze)',
    instructionalLanguage: 'Detailed written and verbal instructions',
    criteriaCount: '4-6 criteria',
    performanceDescriptors: 'Detailed performance levels with specific examples',
    pointSystem: '1-5 point scale or percentage ranges if using point values'
  },
  '4': {
    name: 'Grade 4',
    pedagogicalApproach: 'Student-centered inquiry with differentiation',
    activityTypes: 'Independent research, debates, design challenges, multimedia projects',
    assessmentMethods: 'Essays, presentations, self-assessment, peer review, tests',
    materialComplexity: 'Multiple sources, technical tools, complex models and diagrams',
    learningObjectiveDepth: 'Analysis, synthesis, evaluation (Bloom: Analyze, Evaluate)',
    instructionalLanguage: 'Complex instructions with options for student choice',
    criteriaCount: '5-7 criteria',
    performanceDescriptors: 'Comprehensive levels showing progression of mastery',
    pointSystem: '1-5 point scale with weighted criteria if using point values'
  },
  '5': {
    name: 'Grade 5',
    pedagogicalApproach: 'Collaborative inquiry with critical thinking emphasis',
    activityTypes: 'Extended projects, scientific investigations, literary analysis, debates',
    assessmentMethods: 'Research papers, oral presentations, portfolios, authentic assessments',
    materialComplexity: 'Primary sources, advanced technology, specialized equipment',
    learningObjectiveDepth: 'Synthesis, evaluation, creation (Bloom: Evaluate, Create)',
    instructionalLanguage: 'Sophisticated directions with metacognitive prompts',
    criteriaCount: '6-8 criteria',
    performanceDescriptors: 'Detailed analytical rubric with clear distinctions',
    pointSystem: '1-10 point scale or percentage ranges with weighted categories'
  },
  '6': {
    name: 'Grade 6',
    pedagogicalApproach: 'Independent inquiry with real-world connections',
    activityTypes: 'Capstone projects, expert presentations, community partnerships, research',
    assessmentMethods: 'Authentic assessments, portfolios, peer and expert feedback, exhibitions',
    materialComplexity: 'Academic texts, professional tools, complex digital resources',
    learningObjectiveDepth: 'Advanced evaluation and creation (Bloom: Evaluate, Create)',
    instructionalLanguage: 'Academic language with student-driven modifications',
    criteriaCount: '6-10 criteria',
    performanceDescriptors: 'Sophisticated analytical rubric with nuanced distinctions',
    pointSystem: 'Weighted scale with detailed point allocations (e.g., 1-20 per criterion)'
  }
};

// Helper function to normalize grade level format
function normalizeGradeLevel(gradeLevel: string): keyof typeof GRADE_SPECS {
  // Remove "Grade " prefix if present
  const normalized = gradeLevel.replace(/^Grade\s*/i, '').trim();

  // Handle Kindergarten
  if (normalized.toLowerCase().startsWith('k')) {
    return 'K';
  }

  // Return the number as string
  return normalized as keyof typeof GRADE_SPECS;
}

function getSubjectGuidance(subject: string): string {
  const guidance: Record<string, string> = {
    'Mathematics': `
Subject-Specific Rubric Guidance for Mathematics (Grades K-6):
- Focus Areas: Problem-solving process, mathematical reasoning, computational accuracy, conceptual understanding, communication
- Criteria to Consider: Work shown, strategy selection, answer accuracy, mathematical vocabulary use, organization
- Grade-Appropriate Expectations:
  * K-1: Use of manipulatives, counting accuracy, basic shape recognition, following steps
  * 2-3: Showing work, explaining thinking, using math vocabulary, computational fluency
  * 4-5: Multiple strategies, error analysis, justification of answers, abstract representations
  * 6: Algebraic reasoning, proof-like explanations, precise mathematical language, connections between concepts
- Common Pitfalls to Avoid: Rubrics that only value correct answers, neglecting process and reasoning, inconsistent criteria weighting
`,
    'Language Arts': `
Subject-Specific Rubric Guidance for Language Arts (Grades K-6):
- Focus Areas: Ideas/content, organization, voice, word choice, sentence fluency, conventions
- Criteria to Consider: Thesis/main idea, text evidence, structure, creativity, vocabulary, grammar/spelling
- Grade-Appropriate Expectations:
  * K-1: Drawing with labels, emergent writing, letter formation, basic story elements
  * 2-3: Complete sentences, paragraph structure, beginning/middle/end, simple transitions
  * 4-5: Multiple paragraphs, thesis statements, text evidence, varied sentence structure, voice
  * 6: Sophisticated organization, nuanced analysis, figurative language, research integration, editing
- Common Pitfalls to Avoid: Overweighting conventions over content, unclear voice descriptors, not using trait-based language
`,
    'Science': `
Subject-Specific Rubric Guidance for Science (Grades K-6):
- Focus Areas: Hypothesis formation, experimental design, data collection, analysis, conclusions, scientific communication
- Criteria to Consider: Question clarity, variables identification, measurement accuracy, graphing, evidence-based conclusions
- Grade-Appropriate Expectations:
  * K-1: Observing and describing, sorting/classifying, simple predictions, recording with pictures
  * 2-3: Question formulation, basic variables, data recording, simple conclusions, labeled drawings
  * 4-5: Testable hypotheses, controlled variables, multiple trials, data analysis, scientific explanations
  * 6: Independent experimental design, complex variables, statistical thinking, research integration, error analysis
- Common Pitfalls to Avoid: Rubrics focused only on results, neglecting scientific process, unclear safety expectations
`,
    'Social Studies': `
Subject-Specific Rubric Guidance for Social Studies (Grades K-6):
- Focus Areas: Historical thinking, argumentation, use of evidence, perspective-taking, research skills, civic reasoning
- Criteria to Consider: Thesis/claim, primary/secondary source use, context, multiple perspectives, organization, citations
- Grade-Appropriate Expectations:
  * K-1: Personal connections, basic sequencing, recognizing differences, simple maps, family/community understanding
  * 2-3: Timeline creation, comparing past/present, basic research, simple arguments, map skills
  * 4-5: Cause and effect analysis, using evidence, recognizing bias, research with multiple sources, structured arguments
  * 6: Complex causation, historiographical thinking, sophisticated thesis, primary source analysis, research synthesis
- Common Pitfalls to Avoid: Rubrics valuing memorization over thinking, neglecting multiple perspectives, insufficient focus on evidence
`
  };

  return guidance[subject] || '';
}

export function buildRubricPrompt(formData: RubricFormData): string {
  const gradeKey = normalizeGradeLevel(formData.gradeLevel);
  const gradeSpec = GRADE_SPECS[gradeKey];

  // Get descriptive performance level names based on count
  const levelCount = formData.performanceLevels || '4';
  const levels = PERFORMANCE_LEVEL_NAMES[levelCount] || PERFORMANCE_LEVEL_NAMES['4'];

  // Build example table header
  const tableHeader = `| Criteria | ${levels.join(' | ')} |`;
  const tableSeparator = `| --- | ${levels.map(() => '---').join(' | ')} |`;

  const prompt = `Create an assessment rubric for ${formData.gradeLevel} students.

ASSIGNMENT DETAILS:
- Title: ${formData.assignmentTitle || formData.assignmentType}
- Type: ${formData.assignmentType}
- Subject: ${formData.subject}
- Learning Objectives: ${formData.learningObjectives || 'Aligned to grade-level standards'}
${formData.specificRequirements ? `- Requirements: ${formData.specificRequirements}` : ''}
${formData.focusAreas && formData.focusAreas.length > 0 ? `- Focus Areas: ${formData.focusAreas.join(', ')}` : ''}

GRADE LEVEL REQUIREMENTS:
- Pedagogical Approach: ${gradeSpec.pedagogicalApproach}
- Assessment Methods: ${gradeSpec.assessmentMethods}
- Learning Objective Depth: ${gradeSpec.learningObjectiveDepth}
- Instructional Language: ${gradeSpec.instructionalLanguage}

RUBRIC SPECIFICATIONS:
- Number of Criteria: ${gradeSpec.criteriaCount}
- Performance Levels: ${levels.join(', ')}
- Descriptors: ${gradeSpec.performanceDescriptors}
${formData.includePointValues ? `- Point System: ${gradeSpec.pointSystem}\n- Points decrease from left (highest) to right (lowest)` : '- Do NOT include point values'}

SUBJECT-SPECIFIC CRITERIA GUIDANCE:
${getSubjectGuidance(formData.subject)}

**CRITICAL OUTPUT FORMAT - FOLLOW EXACTLY:**

1. Start with a title line: "**${formData.assignmentTitle || formData.assignmentType + ' Rubric'} - Assessment Rubric**"

2. Then create a clean markdown table with this EXACT structure:
${tableHeader}
${tableSeparator}

3. For each criterion row:
   - First column: Criterion name ONLY (no points)
   - Each following column: Clear descriptor${formData.includePointValues ? ' with point value in parentheses at the END (e.g., "Description here (25 pts)")' : ''}
   - Descriptors MUST show clear progression from ${levels[0]} (highest) to ${levels[levels.length - 1]} (lowest)
   ${formData.includePointValues ? `- Point values MUST decrease from left to right (e.g., 25 pts, 20 pts, 15 pts, 10 pts)` : ''}

4. After the table, add a "**Scoring Summary**" section:
${formData.includePointValues ? `   - Total possible points (sum of highest points per criterion)
   - Grading scale with letter grades` : `   - Overall success criteria`}

**EXAMPLE TABLE ROW (${formData.includePointValues ? 'WITH' : 'WITHOUT'} POINTS):**
${formData.includePointValues
  ? '| Content Knowledge | Demonstrates comprehensive understanding of all key concepts with accurate details (25 pts) | Demonstrates good understanding of most key concepts with minor gaps (20 pts) | Shows basic understanding but with some misconceptions or gaps (15 pts) | Shows limited understanding with significant gaps or misconceptions (10 pts) |'
  : '| Content Knowledge | Demonstrates comprehensive understanding of all key concepts with accurate details | Demonstrates good understanding of most key concepts with minor gaps | Shows basic understanding but with some misconceptions or gaps | Shows limited understanding with significant gaps or misconceptions |'
}

Generate the complete rubric now. Start directly with the title - no preamble or explanation.`;

  return prompt;
}

export default buildRubricPrompt;
