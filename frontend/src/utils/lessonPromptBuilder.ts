interface LessonFormData {
  topic: string;
  subject: string;
  gradeLevel: string;
  strand: string;
  duration: string;
  studentCount: string;
  learningStyles?: string;
  specialNeeds?: string;
}

interface CurriculumReference {
  id: string;
  displayName: string;
  grade: string;
  subject: string;
  strand: string;
  route: string;
  keywords: string[];
  essentialOutcomes: string[];
  specificOutcomes: string[];
}


// Grade-specific pedagogical guidance
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


export function buildLessonPrompt(formData: any, curriculumRefs?: CurriculumReference[]): string {
  const gradeSpec = GRADE_SPECS[formData.gradeLevel as keyof typeof GRADE_SPECS];
  
  let prompt = `Create a complete, detailed lesson plan for Grade ${formData.gradeLevel} students following this criteria:


SUBJECT: ${formData.subject}
TOPIC: ${formData.topic}
STRAND: ${formData.strand}
DURATION: ${formData.duration}
CLASS SIZE: ${formData.studentCount} students
${formData.learningStyles ? `LEARNING STYLES: ${formData.learningStyles}\n` : ''}${formData.specialNeeds ? `SPECIAL NEEDS/ACCOMMODATIONS: ${formData.specialNeeds}\n` : ''}`;


  if (curriculumRefs && curriculumRefs.length > 0) {
    prompt += `\nCURRICULUM REFERENCES TO USE (IMPORTANT - USE ONLY THESE):
`;
    curriculumRefs.forEach((ref, index) => {
      prompt += `${index + 1}. ${ref.displayName}
   Grade: ${ref.grade} | Subject: ${ref.subject} | Strand: ${ref.strand}
`;
      if (ref.essentialOutcomes && ref.essentialOutcomes.length > 0) {
        prompt += `   Essential Outcome: ${ref.essentialOutcomes[0]}
`;
      }
    });
    prompt += `
CRITICAL: In the "Curriculum References" section at the end, list ONLY these ${curriculumRefs.length} curriculum reference(s). Do NOT add any other curriculum standards, frameworks, or references.
`;
  }

  prompt += `
GRADE LEVEL REQUIREMENTS:
- Pedagogical Approach: ${gradeSpec.pedagogicalApproach}
- Activity Types: ${gradeSpec.activityTypes}
- Assessment Methods: ${gradeSpec.assessmentMethods}
- Materials: ${gradeSpec.materialComplexity}
- Learning Objectives: ${gradeSpec.learningObjectiveDepth}
- Instructions: ${gradeSpec.instructionalLanguage}

REQUIRED LESSON PLAN STRUCTURE:

1. LEARNING OBJECTIVES
   - Write 2-3 clear, measurable objectives aligned with ${gradeSpec.learningObjectiveDepth}
   - Use action verbs appropriate for Grade ${formData.gradeLevel}

2. MATERIALS AND RESOURCES
   - List all materials needed (${gradeSpec.materialComplexity})
   - Include technology, handouts, manipulatives, visual aids

3. LESSON PROCEDURES
   
   A. Introduction/Hook (${formData.duration === '30 minutes' ? '5 minutes' : formData.duration === '45 minutes' ? '5-7 minutes' : '10 minutes'})
      - Engaging opening activity
      - Connect to prior knowledge
      - State learning objectives
   
   B. Direct Instruction (${formData.duration === '30 minutes' ? '10 minutes' : formData.duration === '45 minutes' ? '15 minutes' : '20 minutes'})
      - Clear explanation of new content
      - Use ${gradeSpec.instructionalLanguage}
      - Include modeling/demonstrations
   
   C. Guided Practice (${formData.duration === '30 minutes' ? '10 minutes' : formData.duration === '45 minutes' ? '15 minutes' : '20 minutes'})
      - ${gradeSpec.activityTypes}
      - Teacher circulates and provides support
      - Check for understanding
   
   D. Independent Practice/Application (${formData.duration === '30 minutes' ? '5 minutes' : formData.duration === '45 minutes' ? '10 minutes' : '15 minutes'})
      - Students work individually or in small groups
      - Differentiation options provided
   
   E. Closure (${formData.duration === '30 minutes' ? '3-5 minutes' : formData.duration === '45 minutes' ? '5 minutes' : '5-7 minutes'})
      - Review key concepts
      - Exit ticket or formative assessment

4. ASSESSMENT
   - Formative assessment strategies: ${gradeSpec.assessmentMethods}
   - Success criteria clearly defined
   - Differentiation for various learning levels

5. DIFFERENTIATION
   - Support for struggling learners
   - Extensions for advanced students
   - Accommodations for special needs
   ${formData.learningStyles ? `- Adaptations for ${formData.learningStyles}\n` : ''}
6. REFLECTION
   - Teacher reflection prompts
   - Modifications for next time

7. CURRICULUM REFERENCES
   - DO NOT write a "Curriculum References" section in the lesson plan text
   - The curriculum references will be displayed automatically from the data you were provided
   ${curriculumRefs && curriculumRefs.length > 0 ? `- The ${curriculumRefs.length} curriculum reference(s) provided will be shown as clickable links` : ''}

IMPORTANT: Do not include any introductory text, headers, or explanations before the lesson plan. Start directly with the lesson plan content.

Generate the complete lesson plan now. Remember: Do NOT include a "Curriculum References" section in your output - it will be added automatically.`;

  return prompt;
}

export default buildLessonPrompt;