interface CrossCurricularFormData {
  theme: string;
  primarySubject: string;
  integrationSubjects: string[];
  gradeLevel: string;
  duration: string;
  integrationModel: string;
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
    integrationDepth: 'Simple thematic connections through play and exploration',
    integrationStrategy: 'Shared theme explored through different sensory and play experiences',
    connectionComplexity: 'Surface-level connections (e.g., "Bears" in stories, counting, and art)',
    subjectBlending: 'Seamless blending - children don\'t distinguish between subjects',
    cognitiveIntegration: 'Concrete experiences, no abstract connections required',
    realWorldLinks: 'Immediate environment, family, familiar experiences'
  },
  '1': {
    name: 'Grade 1',
    pedagogicalApproach: 'Concrete experiences with guided practice and modeling',
    activityTypes: 'Center activities, partner work, simple experiments, craft projects',
    assessmentMethods: 'Exit tickets, work samples, simple rubrics, oral responses',
    materialComplexity: 'Manipulatives, pictures with words, simple worksheets',
    learningObjectiveDepth: 'Recall, basic application, simple comparisons (Bloom: Remember, Understand)',
    instructionalLanguage: 'Clear step-by-step directions with demonstrations',
    integrationDepth: 'Clear thematic links with explicit subject connections',
    integrationStrategy: 'Theme explored through related activities in different subjects',
    connectionComplexity: 'Direct, obvious connections between subjects (e.g., "Ocean" - read ocean books, count shells, paint ocean scenes)',
    subjectBlending: 'Beginning to recognize different subjects while seeing connections',
    cognitiveIntegration: 'Concrete connections, beginning pattern recognition',
    realWorldLinks: 'School and neighborhood community experiences'
  },
  '2': {
    name: 'Grade 2',
    pedagogicalApproach: 'Guided discovery with structured collaboration',
    activityTypes: 'Small group projects, hands-on investigations, role-play, journals',
    assessmentMethods: 'Rubrics, peer assessment, self-reflection, portfolios',
    materialComplexity: 'Graphic organizers, simple texts, basic tools and instruments',
    learningObjectiveDepth: 'Comprehension, application, basic analysis (Bloom: Understand, Apply)',
    instructionalLanguage: 'Multi-step instructions with visual supports',
    integrationDepth: 'Meaningful connections with skill reinforcement across subjects',
    integrationStrategy: 'Common learning goals supported through multiple subject lenses',
    connectionComplexity: 'Clear cause-effect and skill transfer between subjects',
    subjectBlending: 'Understanding how subjects support each other',
    cognitiveIntegration: 'Beginning transfer of skills between contexts',
    realWorldLinks: 'Local community and basic environmental connections'
  },
  '3': {
    name: 'Grade 3',
    pedagogicalApproach: 'Inquiry-based with scaffolded independence',
    activityTypes: 'Research projects, experiments, presentations, collaborative tasks',
    assessmentMethods: 'Performance tasks, written responses, project rubrics, quizzes',
    materialComplexity: 'Reference materials, detailed diagrams, age-appropriate tech tools',
    learningObjectiveDepth: 'Application, analysis, beginning synthesis (Bloom: Apply, Analyze)',
    instructionalLanguage: 'Detailed written and verbal instructions',
    integrationDepth: 'Purposeful integration with skill application across disciplines',
    integrationStrategy: 'Essential questions answered through multiple subject perspectives',
    connectionComplexity: 'Students explain how subjects connect and complement each other',
    subjectBlending: 'Explicit discussion of interdisciplinary connections',
    cognitiveIntegration: 'Analytical thinking about how knowledge connects',
    realWorldLinks: 'Regional issues, historical context, scientific processes'
  },
  '4': {
    name: 'Grade 4',
    pedagogicalApproach: 'Student-centered inquiry with differentiation',
    activityTypes: 'Independent research, debates, design challenges, multimedia projects',
    assessmentMethods: 'Essays, presentations, self-assessment, peer review, tests',
    materialComplexity: 'Multiple sources, technical tools, complex models and diagrams',
    learningObjectiveDepth: 'Analysis, synthesis, evaluation (Bloom: Analyze, Evaluate)',
    instructionalLanguage: 'Complex instructions with options for student choice',
    integrationDepth: 'Complex integration with synthesis of concepts across subjects',
    integrationStrategy: 'Big ideas explored through integrated disciplinary approaches',
    connectionComplexity: 'Students create connections and apply knowledge in new contexts',
    subjectBlending: 'Sophisticated understanding of interdisciplinary learning',
    cognitiveIntegration: 'Synthesis of concepts, creative application across subjects',
    realWorldLinks: 'National and global issues, complex systems'
  },
  '5': {
    name: 'Grade 5',
    pedagogicalApproach: 'Collaborative inquiry with critical thinking emphasis',
    activityTypes: 'Extended projects, scientific investigations, literary analysis, debates',
    assessmentMethods: 'Research papers, oral presentations, portfolios, authentic assessments',
    materialComplexity: 'Primary sources, advanced technology, specialized equipment',
    learningObjectiveDepth: 'Synthesis, evaluation, creation (Bloom: Evaluate, Create)',
    instructionalLanguage: 'Sophisticated directions with metacognitive prompts',
    integrationDepth: 'Advanced integration with critical analysis across disciplines',
    integrationStrategy: 'Complex problems requiring integrated disciplinary thinking',
    connectionComplexity: 'Students evaluate the value of different subject perspectives',
    subjectBlending: 'Deep understanding of how disciplines inform each other',
    cognitiveIntegration: 'Critical evaluation, sophisticated synthesis, creative problem-solving',
    realWorldLinks: 'Global issues, complex societal problems, future implications'
  },
  '6': {
    name: 'Grade 6',
    pedagogicalApproach: 'Independent inquiry with real-world connections',
    activityTypes: 'Capstone projects, expert presentations, community partnerships, research',
    assessmentMethods: 'Authentic assessments, portfolios, peer and expert feedback, exhibitions',
    materialComplexity: 'Academic texts, professional tools, complex digital resources',
    learningObjectiveDepth: 'Advanced evaluation and creation (Bloom: Evaluate, Create)',
    instructionalLanguage: 'Academic language with student-driven modifications',
    integrationDepth: 'Sophisticated integration mirroring real-world interdisciplinary work',
    integrationStrategy: 'Authentic problems requiring seamless integration of multiple disciplines',
    connectionComplexity: 'Students independently identify and leverage interdisciplinary connections',
    subjectBlending: 'Advanced scholarly integration of disciplines',
    cognitiveIntegration: 'Advanced synthesis, original creation, expert-level evaluation',
    realWorldLinks: 'Complex global systems, ethical considerations, future-focused thinking'
  }
};

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

export function buildCrossCurricularPrompt(formData: CrossCurricularFormData): string {
  const gradeSpec = GRADE_SPECS[formData.gradeLevel as keyof typeof GRADE_SPECS];

  const prompt = `Create a comprehensive cross-curricular lesson plan for Grade ${formData.gradeLevel} students.

THEME: ${formData.theme}
PRIMARY SUBJECT: ${formData.primarySubject}
INTEGRATION SUBJECTS: ${formData.integrationSubjects.join(', ')}
DURATION: ${formData.duration}
INTEGRATION MODEL: ${formData.integrationModel}

GRADE LEVEL REQUIREMENTS:
- Pedagogical Approach: ${gradeSpec.pedagogicalApproach}
- Activity Types: ${gradeSpec.activityTypes}
- Assessment Methods: ${gradeSpec.assessmentMethods}
- Material Complexity: ${gradeSpec.materialComplexity}
- Learning Objective Depth: ${gradeSpec.learningObjectiveDepth}
- Instructional Language: ${gradeSpec.instructionalLanguage}

INTEGRATION-SPECIFIC REQUIREMENTS:
- Integration Depth: ${gradeSpec.integrationDepth}
- Integration Strategy: ${gradeSpec.integrationStrategy}
- Connection Complexity: ${gradeSpec.connectionComplexity}
- Subject Blending: ${gradeSpec.subjectBlending}
- Cognitive Integration: ${gradeSpec.cognitiveIntegration}
- Real-World Links: ${gradeSpec.realWorldLinks}

SUBJECT-SPECIFIC GUIDANCE:

Primary Subject (${formData.primarySubject}):
${getSubjectGuidance(formData.primarySubject)}

Integration Subjects:
${formData.integrationSubjects.map(subject => `
${subject}:
${getSubjectGuidance(subject)}`).join('\n')}

REQUIRED CROSS-CURRICULAR LESSON STRUCTURE:

1. INTEGRATED THEME OVERVIEW
   - Central theme/big idea that connects all subjects
   - Essential question(s) driving the integrated learning
   - Real-world relevance (${gradeSpec.realWorldLinks})
   - Connection to ${gradeSpec.integrationDepth}

2. SUBJECT-SPECIFIC LEARNING OBJECTIVES

   PRIMARY SUBJECT (${formData.primarySubject}):
   - 2-3 core objectives aligned with curriculum standards
   - Skills and concepts to be developed

   INTEGRATION SUBJECTS:
${formData.integrationSubjects.map(subject => `   
   ${subject}:
   - Specific objectives showing how this subject enhances understanding
   - Skills naturally integrated with the theme`).join('\n')}

3. INTEGRATED MATERIALS AND RESOURCES
   - Shared resources used across multiple subjects
   - Subject-specific materials (${gradeSpec.materialComplexity})
   - Technology and multimedia resources
   - Community resources or expert connections (if applicable)

4. CROSS-CURRICULAR LESSON PROCEDURES

   A. Introduction - INTEGRATED HOOK (${formData.duration === '90 minutes' ? '15 minutes' : formData.duration === '120 minutes' ? '20 minutes' : '10 minutes'})
      - Engaging opening that touches on all subjects
      - ${gradeSpec.activityTypes}
      - Make connections explicit: ${gradeSpec.connectionComplexity}
      - Present essential question(s)

   B. Subject Integration Activities (${formData.duration === '90 minutes' ? '50 minutes' : formData.duration === '120 minutes' ? '70 minutes' : '30 minutes'})
   
      Based on ${formData.integrationModel} model:
      
      ${formData.primarySubject} Foundation:
      - Core content and skills from primary subject
      - Explicit connections to theme
      
${formData.integrationSubjects.map(subject => `      ${subject} Integration:
      - How ${subject} enhances understanding of the theme
      - Activities that naturally blend ${subject} with ${formData.primarySubject}
      - ${gradeSpec.integrationStrategy}`).join('\n\n')}
      
      Integrated Application:
      - Activity/project requiring all subjects working together
      - ${gradeSpec.activityTypes}
      - Students demonstrate ${gradeSpec.cognitiveIntegration}

   C. Synthesis and Reflection (${formData.duration === '90 minutes' ? '15 minutes' : formData.duration === '120 minutes' ? '20 minutes' : '10 minutes'})
      - Review learning from all subject perspectives
      - Make explicit connections between subjects
      - Demonstrate ${gradeSpec.subjectBlending}
      - Connect to real-world applications

5. CROSS-CURRICULAR ASSESSMENT
   
   Integrated Assessment Methods:
   - ${gradeSpec.assessmentMethods}
   - Success criteria for each subject area
   - How subjects combine to show deep understanding
   
   Assessment Components:
${formData.integrationSubjects.concat([formData.primarySubject]).map(subject => `   - ${subject} competencies and how they're measured`).join('\n')}
   
   Integration Quality Criteria:
   - How well student work shows connections between subjects
   - Evidence of ${gradeSpec.cognitiveIntegration}
   - Application of integrated knowledge to ${gradeSpec.realWorldLinks}

6. DIFFERENTIATION ACROSS SUBJECTS
   - Support for students struggling in specific subject areas
   - Extensions for students excelling in particular subjects
   - Multiple ways to demonstrate integrated understanding
   - Flexible grouping based on subject strengths

7. INTEGRATION STRATEGIES SPECIFIC TO GRADE ${formData.gradeLevel}
   - How to make connections age-appropriate (${gradeSpec.connectionComplexity})
   - Scaffolding for ${gradeSpec.cognitiveIntegration}
   - Ensuring ${gradeSpec.subjectBlending}
   - Real-world connections appropriate for this age (${gradeSpec.realWorldLinks})

8. EXTENSION OPPORTUNITIES
   - Ways to deepen integration beyond this lesson
   - Connections to other subjects not yet included
   - Long-term project possibilities
   - Community or family involvement opportunities

INTEGRATION AUTHENTICITY:
- Ensure connections are meaningful, not forced
- Each subject should genuinely enhance understanding
- Avoid surface-level "theme days" - create true integration
- Build on ${gradeSpec.integrationStrategy}

Do not include any introductory text, explanations, or meta-comments. Start directly with the cross-curricular lesson plan content.

Generate the complete cross-curricular lesson plan now:`;

  return prompt;
}

export default buildCrossCurricularPrompt;
