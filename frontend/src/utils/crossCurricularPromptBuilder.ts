interface CrossCurricularFormData {
  theme: string;
  primarySubject: string;
  integrationSubjects: string[];
  gradeLevel: string;
  duration: string;
  integrationModel: string;
}

// Grade-specific integration complexity guidance
const GRADE_SPECS = {
  'K': {
    name: 'Kindergarten',
    integrationDepth: 'Simple thematic connections through play and exploration',
    integrationStrategy: 'Shared theme explored through different sensory and play experiences',
    connectionComplexity: 'Surface-level connections (e.g., "Bears" in stories, counting, and art)',
    subjectBlending: 'Seamless blending - children don\'t distinguish between subjects',
    learningActivities: 'Centers, dramatic play, songs, stories, art, movement',
    assessmentApproach: 'Observation of engagement and participation across activities',
    cognitiveIntegration: 'Concrete experiences, no abstract connections required',
    realWorldLinks: 'Immediate environment, family, familiar experiences'
  },
  '1': {
    name: 'Grade 1',
    integrationDepth: 'Clear thematic links with explicit subject connections',
    integrationStrategy: 'Theme explored through related activities in different subjects',
    connectionComplexity: 'Direct, obvious connections between subjects (e.g., "Ocean" - read ocean books, count shells, paint ocean scenes)',
    subjectBlending: 'Beginning to recognize different subjects while seeing connections',
    learningActivities: 'Integrated center work, shared reading, hands-on projects',
    assessmentApproach: 'Simple checklists showing skills across subjects',
    cognitiveIntegration: 'Concrete connections, beginning pattern recognition',
    realWorldLinks: 'School and neighborhood community experiences'
  },
  '2': {
    name: 'Grade 2',
    integrationDepth: 'Meaningful connections with skill reinforcement across subjects',
    integrationStrategy: 'Common learning goals supported through multiple subject lenses',
    connectionComplexity: 'Clear cause-effect and skill transfer between subjects',
    subjectBlending: 'Understanding how subjects support each other',
    learningActivities: 'Collaborative projects, integrated investigations, multimedia presentations',
    assessmentApproach: 'Rubrics addressing skills from multiple subjects',
    cognitiveIntegration: 'Beginning transfer of skills between contexts',
    realWorldLinks: 'Local community and basic environmental connections'
  },
  '3': {
    name: 'Grade 3',
    integrationDepth: 'Purposeful integration with skill application across disciplines',
    integrationStrategy: 'Essential questions answered through multiple subject perspectives',
    connectionComplexity: 'Students explain how subjects connect and complement each other',
    subjectBlending: 'Explicit discussion of interdisciplinary connections',
    learningActivities: 'Research projects, experiments with multiple variables, cross-curricular presentations',
    assessmentApproach: 'Performance tasks assessing multiple subjects simultaneously',
    cognitiveIntegration: 'Analytical thinking about how knowledge connects',
    realWorldLinks: 'Regional issues, historical context, scientific processes'
  },
  '4': {
    name: 'Grade 4',
    integrationDepth: 'Complex integration with synthesis of concepts across subjects',
    integrationStrategy: 'Big ideas explored through integrated disciplinary approaches',
    connectionComplexity: 'Students create connections and apply knowledge in new contexts',
    subjectBlending: 'Sophisticated understanding of interdisciplinary learning',
    learningActivities: 'Extended research, design challenges, multimedia projects, debates',
    assessmentApproach: 'Authentic assessments with multiple subject competencies',
    cognitiveIntegration: 'Synthesis of concepts, creative application across subjects',
    realWorldLinks: 'National and global issues, complex systems'
  },
  '5': {
    name: 'Grade 5',
    integrationDepth: 'Advanced integration with critical analysis across disciplines',
    integrationStrategy: 'Complex problems requiring integrated disciplinary thinking',
    connectionComplexity: 'Students evaluate the value of different subject perspectives',
    subjectBlending: 'Deep understanding of how disciplines inform each other',
    learningActivities: 'Independent research, community projects, expert presentations, scholarly work',
    assessmentApproach: 'Portfolio-based with evidence from multiple disciplines',
    cognitiveIntegration: 'Critical evaluation, sophisticated synthesis, creative problem-solving',
    realWorldLinks: 'Global issues, complex societal problems, future implications'
  },
  '6': {
    name: 'Grade 6',
    integrationDepth: 'Sophisticated integration mirroring real-world interdisciplinary work',
    integrationStrategy: 'Authentic problems requiring seamless integration of multiple disciplines',
    connectionComplexity: 'Students independently identify and leverage interdisciplinary connections',
    subjectBlending: 'Advanced scholarly integration of disciplines',
    learningActivities: 'Capstone projects, community partnerships, academic research, exhibitions',
    assessmentApproach: 'Authentic demonstrations of integrated learning and expertise',
    cognitiveIntegration: 'Advanced synthesis, original creation, expert-level evaluation',
    realWorldLinks: 'Complex global systems, ethical considerations, future-focused thinking'
  }
};

export function buildCrossCurricularPrompt(formData: CrossCurricularFormData): string {
  const gradeSpec = GRADE_SPECS[formData.gradeLevel as keyof typeof GRADE_SPECS];
  
  const prompt = `Create a comprehensive cross-curricular lesson plan for Grade ${formData.gradeLevel} students.

THEME: ${formData.theme}
PRIMARY SUBJECT: ${formData.primarySubject}
INTEGRATION SUBJECTS: ${formData.integrationSubjects.join(', ')}
DURATION: ${formData.duration}
INTEGRATION MODEL: ${formData.integrationModel}

GRADE LEVEL INTEGRATION REQUIREMENTS:
- Integration Depth: ${gradeSpec.integrationDepth}
- Integration Strategy: ${gradeSpec.integrationStrategy}
- Connection Complexity: ${gradeSpec.connectionComplexity}
- Subject Blending: ${gradeSpec.subjectBlending}
- Learning Activities: ${gradeSpec.learningActivities}
- Assessment Approach: ${gradeSpec.assessmentApproach}
- Cognitive Integration: ${gradeSpec.cognitiveIntegration}
- Real-World Links: ${gradeSpec.realWorldLinks}

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
   - Subject-specific materials
   - Technology and multimedia resources
   - Community resources or expert connections (if applicable)

4. CROSS-CURRICULAR LESSON PROCEDURES

   A. Introduction - INTEGRATED HOOK (${formData.duration === '90 minutes' ? '15 minutes' : formData.duration === '120 minutes' ? '20 minutes' : '10 minutes'})
      - Engaging opening that touches on all subjects
      - ${gradeSpec.learningActivities}
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
      - ${gradeSpec.learningActivities}
      - Students demonstrate ${gradeSpec.cognitiveIntegration}

   C. Synthesis and Reflection (${formData.duration === '90 minutes' ? '15 minutes' : formData.duration === '120 minutes' ? '20 minutes' : '10 minutes'})
      - Review learning from all subject perspectives
      - Make explicit connections between subjects
      - Demonstrate ${gradeSpec.subjectBlending}
      - Connect to real-world applications

5. CROSS-CURRICULAR ASSESSMENT
   
   Integrated Assessment Methods:
   - ${gradeSpec.assessmentApproach}
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

Generate the complete cross-curricular lesson plan now:`;

  return prompt;
}

export default buildCrossCurricularPrompt;