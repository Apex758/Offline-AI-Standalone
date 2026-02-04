interface MultigradeFormData {
  topic: string;
  subject: string;
  gradeLevels: string[];
  duration: string;
  totalStudents: string;
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

// Grade range differentiation specifications (retained for multigrade-specific logic)
const GRADE_RANGE_SPECS = {
  'K-1': {
    name: 'Kindergarten to Grade 1',
    ageRange: '5-7 years',
    differentiationStrategy: 'Parallel tasks with shared theme, different complexity levels',
    groupingApproach: 'Flexible small groups, partner work across grades, independent centers',
    sharedActivities: 'Opening circle, songs, stories, closing reflection',
    separatedActivities: 'Writing tasks, reading levels, math manipulatives',
    assessmentMethods: 'Observation, oral responses, simple work samples',
    materialAdaptations: 'Same materials with different expectations (e.g., K draws, G1 writes)',
    instructionalLanguage: 'Simple clear directions for all, visual supports essential',
    scaffoldingNeeds: 'High support for K, moderate for G1; peer modeling encouraged'
  },
  '1-2': {
    name: 'Grade 1 to Grade 2',
    ageRange: '6-8 years',
    differentiationStrategy: 'Tiered activities with common learning goals',
    groupingApproach: 'Mixed-ability groups, grade-level groups for skill practice',
    sharedActivities: 'Introduction, discussions, investigations, presentations',
    separatedActivities: 'Reading complexity, writing length, math problem difficulty',
    assessmentMethods: 'Work samples, exit tickets, simple rubrics, peer assessment',
    materialAdaptations: 'Varied text levels, graphic organizers with more/less support',
    instructionalLanguage: 'Clear step-by-step with demonstrations',
    scaffoldingNeeds: 'More modeling for G1, more independence for G2'
  },
  '2-3': {
    name: 'Grade 2 to Grade 3',
    ageRange: '7-9 years',
    differentiationStrategy: 'Learning stations with choice and complexity variations',
    groupingApproach: 'Interest groups, skill-based groups, collaborative teams',
    sharedActivities: 'Inquiry investigations, collaborative projects, group discussions',
    separatedActivities: 'Research depth, analysis complexity, writing sophistication',
    assessmentMethods: 'Rubrics, self-assessment, project-based, portfolios',
    materialAdaptations: 'Leveled texts, tiered tasks, choice boards',
    instructionalLanguage: 'Detailed instructions with options for student choice',
    scaffoldingNeeds: 'Guided practice for G2, semi-independent for G3'
  },
  '3-4': {
    name: 'Grade 3 to Grade 4',
    ageRange: '8-10 years',
    differentiationStrategy: 'Challenge-based learning with multiple entry points',
    groupingApproach: 'Collaborative teams, expert groups, peer teaching',
    sharedActivities: 'Research projects, experiments, debates, presentations',
    separatedActivities: 'Analysis depth, synthesis complexity, evaluation rigor',
    assessmentMethods: 'Performance tasks, essays, presentations, peer review',
    materialAdaptations: 'Multiple sources at different levels, choice in demonstration',
    instructionalLanguage: 'Complex instructions with metacognitive prompts',
    scaffoldingNeeds: 'Scaffolded independence for G3, student-directed for G4'
  },
  '4-5': {
    name: 'Grade 4 to Grade 5',
    ageRange: '9-11 years',
    differentiationStrategy: 'Project-based learning with differentiated outcomes',
    groupingApproach: 'Expert groups, research teams, cross-grade mentoring',
    sharedActivities: 'Extended projects, investigations, collaborative research',
    separatedActivities: 'Critical analysis depth, research scope, presentation complexity',
    assessmentMethods: 'Authentic assessments, portfolios, exhibitions, self-evaluation',
    materialAdaptations: 'Primary sources at varied reading levels, technology integration',
    instructionalLanguage: 'Academic language with student choice in approach',
    scaffoldingNeeds: 'Guided inquiry for G4, independent research for G5'
  },
  '5-6': {
    name: 'Grade 5 to Grade 6',
    ageRange: '10-12 years',
    differentiationStrategy: 'Independent inquiry with tiered complexity',
    groupingApproach: 'Research teams, peer teaching, collaborative inquiry',
    sharedActivities: 'Seminars, debates, collaborative research, peer review',
    separatedActivities: 'Synthesis depth, evaluation complexity, creative application',
    assessmentMethods: 'Advanced portfolios, capstone projects, expert presentations',
    materialAdaptations: 'Academic texts with varied scaffolding, professional tools',
    instructionalLanguage: 'Advanced academic discourse with student autonomy',
    scaffoldingNeeds: 'Collaborative support for G5, independent mastery for G6'
  },
  'K-2': {
    name: 'Kindergarten to Grade 2',
    ageRange: '5-8 years',
    differentiationStrategy: 'Multi-level centers and stations approach',
    groupingApproach: 'Rotating centers, buddy systems, small group instruction',
    sharedActivities: 'Stories, songs, circle time, whole-class demonstrations',
    separatedActivities: 'Reading levels, writing complexity, math concepts',
    assessmentMethods: 'Observation checklists, anecdotal notes, simple rubrics',
    materialAdaptations: 'Same themes, three levels of materials and expectations',
    instructionalLanguage: 'Visual supports, demonstrations, repeated directions',
    scaffoldingNeeds: 'High support for K, moderate for G1, guided independence for G2'
  },
  '3-5': {
    name: 'Grade 3 to Grade 5',
    ageRange: '8-11 years',
    differentiationStrategy: 'Inquiry-based with multiple pathways to mastery',
    groupingApproach: 'Flexible grouping, expert rotations, collaborative projects',
    sharedActivities: 'Investigations, debates, collaborative research, presentations',
    separatedActivities: 'Research depth, analysis complexity, synthesis requirements',
    assessmentMethods: 'Performance tasks, portfolios, peer assessment, self-reflection',
    materialAdaptations: 'Leveled texts, tiered assignments, choice in final products',
    instructionalLanguage: 'Clear expectations with options for student autonomy',
    scaffoldingNeeds: 'Scaffolded for G3, semi-independent for G4, independent for G5'
  },
  'K-6': {
    name: 'Kindergarten to Grade 6 (All Grades)',
    ageRange: '5-12 years',
    differentiationStrategy: 'Multi-age learning communities with peer mentoring',
    groupingApproach: 'Cross-age buddy systems, multi-level centers, interest groups',
    sharedActivities: 'Community meetings, collaborative projects, presentations',
    separatedActivities: 'All skill-based work differentiated by developmental level',
    assessmentMethods: 'Portfolios, demonstrations, self-assessment, peer feedback',
    materialAdaptations: 'Wide range of materials for all developmental stages',
    instructionalLanguage: 'Tiered instructions, visual supports, peer teaching',
    scaffoldingNeeds: 'Extensive differentiation across all cognitive and skill levels'
  }
};

// Helper function to determine grade range key
function getGradeRangeKey(gradeLevels: string[]): string {
  const sorted = [...gradeLevels].sort();

  // Handle specific ranges
  if (sorted.length === 2) {
    const key = `${sorted[0]}-${sorted[1]}`;
    if (GRADE_RANGE_SPECS[key as keyof typeof GRADE_RANGE_SPECS]) {
      return key;
    }
  }

  // Handle broader ranges
  if (sorted.includes('K') && sorted.includes('2') && sorted.length <= 3) {
    return 'K-2';
  }
  if (sorted.includes('3') && sorted.includes('5') && sorted.length <= 3) {
    return '3-5';
  }

  // Default to widest range if all grades
  if (sorted.length >= 6) {
    return 'K-6';
  }

  // Fallback to first-last range
  return `${sorted[0]}-${sorted[sorted.length - 1]}`;
}

function getSubjectGuidance(subject: string): string {
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

export function buildMultigradePrompt(formData: MultigradeFormData): string {
  const rangeKey = getGradeRangeKey(formData.gradeLevels);
  const rangeSpec = GRADE_RANGE_SPECS[rangeKey as keyof typeof GRADE_RANGE_SPECS] || GRADE_RANGE_SPECS['K-6'];

  const prompt = `Create a comprehensive multigrade lesson plan for ${formData.gradeLevels.join(', ')} students learning together.

TOPIC: ${formData.topic}
SUBJECT: ${formData.subject}
GRADE LEVELS: ${formData.gradeLevels.join(', ')} (${rangeSpec.name})
DURATION: ${formData.duration}
TOTAL STUDENTS: ${formData.totalStudents}

MULTIGRADE TEACHING REQUIREMENTS:
- Age Range: ${rangeSpec.ageRange}
- Differentiation Strategy: ${rangeSpec.differentiationStrategy}
- Grouping Approach: ${rangeSpec.groupingApproach}
- Shared Activities: ${rangeSpec.sharedActivities}
- Separated Activities: ${rangeSpec.separatedActivities}
- Assessment Methods: ${rangeSpec.assessmentMethods}
- Material Adaptations: ${rangeSpec.materialAdaptations}
- Instructional Language: ${rangeSpec.instructionalLanguage}
- Scaffolding Needs: ${rangeSpec.scaffoldingNeeds}

GRADE-SPECIFIC REQUIREMENTS BY LEVEL:
${formData.gradeLevels.map(grade => {
  const gradeSpec = GRADE_SPECS[grade as keyof typeof GRADE_SPECS];
  return gradeSpec ? `
Grade ${grade} (${gradeSpec.name}):
- Pedagogical Approach: ${gradeSpec.pedagogicalApproach}
- Activity Types: ${gradeSpec.activityTypes}
- Assessment Methods: ${gradeSpec.assessmentMethods}
- Material Complexity: ${gradeSpec.materialComplexity}
- Learning Objective Depth: ${gradeSpec.learningObjectiveDepth}
- Instructional Language: ${gradeSpec.instructionalLanguage}` : '';
}).join('\n')}

SUBJECT-SPECIFIC GUIDANCE:
${getSubjectGuidance(formData.subject)}

REQUIRED MULTIGRADE LESSON STRUCTURE:

1. SHARED LEARNING OBJECTIVES
   - Common conceptual understanding for all grades
   - Grade-specific skill objectives for each level:
${formData.gradeLevels.map(grade => `     * Grade ${grade}: [specific measurable objective]`).join('\n')}

2. MATERIALS AND RESOURCES
   - Shared materials for whole-class activities
   - Differentiated materials for each grade level (${rangeSpec.materialAdaptations})

3. LESSON PROCEDURES

   A. Opening - WHOLE CLASS (${formData.duration === '60 minutes' ? '10 minutes' : formData.duration === '90 minutes' ? '15 minutes' : '5-7 minutes'})
      - Shared hook/engagement activity
      - ${rangeSpec.sharedActivities}
      - Introduce common theme and grade-specific goals

   B. Direct Instruction - TIERED (${formData.duration === '60 minutes' ? '15 minutes' : formData.duration === '90 minutes' ? '20 minutes' : '10 minutes'})
      - Common concept introduction
      - Grade-specific mini-lessons:
${formData.gradeLevels.map(grade => `        * Grade ${grade}: [specific instruction focus]`).join('\n')}
      - ${rangeSpec.instructionalLanguage}

   C. Differentiated Activities - SMALL GROUPS/STATIONS (${formData.duration === '60 minutes' ? '25 minutes' : formData.duration === '90 minutes' ? '40 minutes' : '15 minutes'})
      - ${rangeSpec.groupingApproach}
      - ${rangeSpec.differentiationStrategy}
      
      Station/Activity Options:
${formData.gradeLevels.map(grade => `      * Grade ${grade} Focus: [specific activity with appropriate complexity]`).join('\n')}
      
      - Include peer teaching opportunities
      - ${rangeSpec.scaffoldingNeeds}

   D. Synthesis - WHOLE CLASS (${formData.duration === '60 minutes' ? '10 minutes' : formData.duration === '90 minutes' ? '15 minutes' : '5 minutes'})
      - Students share learning across grades
      - Connect individual work to common concept
      - Celebrate different approaches and outcomes

4. ASSESSMENT STRATEGIES
   - Common formative assessment for whole class
   - Grade-specific success criteria:
${formData.gradeLevels.map(grade => `     * Grade ${grade}: [specific criteria]`).join('\n')}
   - ${rangeSpec.assessmentMethods}
   - Peer and self-assessment opportunities

5. DIFFERENTIATION ACROSS GRADES
   For each grade level, specify:
${formData.gradeLevels.map(grade => `
   Grade ${grade}:
   - Content complexity: [how content is adapted]
   - Process support: [scaffolding and support provided]
   - Product expectations: [what students will produce]
   - Assessment criteria: [how mastery is measured]`).join('\n')}

6. CLASSROOM MANAGEMENT STRATEGIES
   - Grouping configurations and transitions
   - Peer support and buddy systems
   - Independent work expectations
   - Behavior management across age groups

7. EXTENSIONS AND MODIFICATIONS
   - Support for struggling learners at each grade
   - Enrichment for advanced students at each grade
   - Cross-grade collaboration opportunities
   - Flexible pacing options

IMPORTANT: Do not include any introductory text, headers, or explanations before the lesson plan. Start directly with the lesson plan content.

Generate the complete multigrade lesson plan now:`;

  return prompt;
}

export default buildMultigradePrompt;
