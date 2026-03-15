/**
 * Shared grade-level pedagogical specifications used across all generators.
 * Each generator may extend these with tool-specific fields.
 */

export interface BaseGradeSpec {
  name: string;
  pedagogicalApproach: string;
  activityTypes: string;
  assessmentMethods: string;
  materialComplexity: string;
  learningObjectiveDepth: string;
  instructionalLanguage: string;
}

export const BASE_GRADE_SPECS: Record<string, BaseGradeSpec> = {
  'K': {
    name: 'Kindergarten',
    pedagogicalApproach: 'Play-based, hands-on learning with frequent transitions',
    activityTypes: 'Sensory play, movement, songs, stories, dramatic play, art',
    assessmentMethods: 'Observation checklists, anecdotal notes, thumbs up/down',
    materialComplexity: 'Large manipulatives, bright visuals, real objects',
    learningObjectiveDepth: 'Recognition, identification, basic motor skills (Bloom: Remember)',
    instructionalLanguage: 'Simple 3-5 word instructions, visual cues required'
  },
  '1': {
    name: 'Grade 1',
    pedagogicalApproach: 'Concrete experiences with guided practice and modeling',
    activityTypes: 'Center activities, partner work, simple experiments, craft projects',
    assessmentMethods: 'Exit tickets, work samples, simple rubrics, oral responses',
    materialComplexity: 'Manipulatives, pictures with words, simple worksheets',
    learningObjectiveDepth: 'Recall, basic application, simple comparisons (Bloom: Remember, Understand)',
    instructionalLanguage: 'Clear step-by-step directions with demonstrations'
  },
  '2': {
    name: 'Grade 2',
    pedagogicalApproach: 'Guided discovery with structured collaboration',
    activityTypes: 'Small group projects, hands-on investigations, role-play, journals',
    assessmentMethods: 'Rubrics, peer assessment, self-reflection, portfolios',
    materialComplexity: 'Graphic organizers, simple texts, basic tools and instruments',
    learningObjectiveDepth: 'Comprehension, application, basic analysis (Bloom: Understand, Apply)',
    instructionalLanguage: 'Multi-step instructions with visual supports'
  },
  '3': {
    name: 'Grade 3',
    pedagogicalApproach: 'Inquiry-based with scaffolded independence',
    activityTypes: 'Research projects, experiments, presentations, collaborative tasks',
    assessmentMethods: 'Performance tasks, written responses, project rubrics, quizzes',
    materialComplexity: 'Reference materials, detailed diagrams, age-appropriate tech tools',
    learningObjectiveDepth: 'Application, analysis, beginning synthesis (Bloom: Apply, Analyze)',
    instructionalLanguage: 'Detailed written and verbal instructions'
  },
  '4': {
    name: 'Grade 4',
    pedagogicalApproach: 'Student-centered inquiry with differentiation',
    activityTypes: 'Independent research, debates, design challenges, multimedia projects',
    assessmentMethods: 'Essays, presentations, self-assessment, peer review, tests',
    materialComplexity: 'Multiple sources, technical tools, complex models and diagrams',
    learningObjectiveDepth: 'Analysis, synthesis, evaluation (Bloom: Analyze, Evaluate)',
    instructionalLanguage: 'Complex instructions with options for student choice'
  },
  '5': {
    name: 'Grade 5',
    pedagogicalApproach: 'Collaborative inquiry with critical thinking emphasis',
    activityTypes: 'Extended projects, scientific investigations, literary analysis, debates',
    assessmentMethods: 'Research papers, oral presentations, portfolios, authentic assessments',
    materialComplexity: 'Primary sources, advanced technology, specialized equipment',
    learningObjectiveDepth: 'Synthesis, evaluation, creation (Bloom: Evaluate, Create)',
    instructionalLanguage: 'Sophisticated directions with metacognitive prompts'
  },
  '6': {
    name: 'Grade 6',
    pedagogicalApproach: 'Independent inquiry with real-world connections',
    activityTypes: 'Capstone projects, expert presentations, community partnerships, research',
    assessmentMethods: 'Authentic assessments, portfolios, peer and expert feedback, exhibitions',
    materialComplexity: 'Academic texts, professional tools, complex digital resources',
    learningObjectiveDepth: 'Advanced evaluation and creation (Bloom: Evaluate, Create)',
    instructionalLanguage: 'Academic language with student-driven modifications'
  }
};

/**
 * General subject guidance used by lesson planner, rubric, multigrade, and cross-curricular.
 * Worksheet and quiz have their own specialized versions.
 */
export function getSubjectGuidance(subject: string): string {
  const guidance: Record<string, string> = {
    'Mathematics': `
Subject-Specific Guidance for Mathematics (Grades K-6):
- Focus Areas: Problem-solving, conceptual understanding, procedural fluency, mathematical reasoning
- Resource Types: Manipulatives, number lines, graph paper, geometric tools, fraction bars, place value blocks
- Pedagogical Approaches: Concrete-pictorial-abstract progression, real-world problem contexts, multiple solution strategies
- Assessment Best Practices: Step-by-step problem solving, error analysis, math journals, performance tasks showing work
- Cognitive Levels by Grade:
  * K-1: Number sense, counting, basic operations with concrete materials
  * 2-3: Place value, multi-digit operations, introductory fractions, measurement
  * 4-5: Multiplicative reasoning, fraction/decimal operations, geometry, data analysis
  * 6: Ratio/proportional reasoning, algebraic expressions, statistical thinking
- Common Pitfalls to Avoid: Rote memorization without understanding, over-reliance on algorithms, lack of concrete representation
`,
    'Language Arts': `
Subject-Specific Guidance for Language Arts (Grades K-6):
- Focus Areas: Reading comprehension, writing craft, communication skills, vocabulary development
- Resource Types: Leveled texts, graphic organizers, writing prompts, word walls, anchor charts, mentor texts
- Pedagogical Approaches: Balanced literacy, writing workshop model, shared/guided/independent reading, close reading
- Assessment Best Practices: Running records, writing rubrics (ideas, organization, voice, word choice), comprehension checks, reading response journals
- Cognitive Levels by Grade:
  * K-1: Phonemic awareness, decoding, emergent writing, sight words
  * 2-3: Reading fluency, narrative writing, paragraph structure, basic research
  * 4-5: Critical reading, expository writing, genre analysis, summarizing
  * 6: Literary analysis, argument writing, research skills, synthesis of multiple sources
- Common Pitfalls to Avoid: Isolated grammar drills without context, single text perspectives, over-reliance on worksheets
`,
    'Science': `
Subject-Specific Guidance for Science (Grades K-6):
- Focus Areas: Scientific inquiry, investigation skills, evidence-based reasoning, nature of science
- Resource Types: Lab equipment, models, observation sheets, safety gear, measuring tools, science notebooks
- Pedagogical Approaches: Inquiry-based learning, 5E model (Engage, Explore, Explain, Elaborate, Evaluate), hands-on experiments
- Assessment Best Practices: Lab reports, science notebooks, hypothesis formulation, data analysis, scientific explanations with evidence
- Cognitive Levels by Grade:
  * K-1: Observing, questioning, describing properties, living vs non-living
  * 2-3: Simple investigations, plants/animals, matter states, weather patterns
  * 4-5: Controlled experiments, ecosystems, earth systems, forces/motion
  * 6: Independent investigations, scientific method, energy transfer, human body systems
- Common Pitfalls to Avoid: Memorization of facts without inquiry, "cookbook" labs without thinking, lack of connection to real phenomena
`,
    'Social Studies': `
Subject-Specific Guidance for Social Studies (Grades K-6):
- Focus Areas: Historical thinking, geographic reasoning, civic engagement, economic understanding, cultural awareness
- Resource Types: Maps, timelines, primary sources, artifacts, globes, atlases, historical documents, biographies
- Pedagogical Approaches: Project-based learning, document-based questions, inquiry into historical events, current events connections
- Assessment Best Practices: Research projects, document analysis, debates, presentations, reflective essays, civic action projects
- Cognitive Levels by Grade:
  * K-1: Families, communities, basic map skills, holidays and traditions
  * 2-3: Neighborhoods, local history, map reading, cultures, goods/services
  * 4-5: Regions, indigenous peoples, government basics, historical events and causes
  * 6: Ancient civilizations, world geography, U.S. history, government systems, economic principles
- Common Pitfalls to Avoid: Presenting single narratives, memorization of dates/facts without context, lack of diverse perspectives
`
  };

  return guidance[subject] || '';
}
