interface KindergartenFormData {
  theme: string;
  curriculumUnit: string;
  week: string;
  day: string;
  date: string;
  ageGroup: string;
  students: string;
  duration: string;
  learningDomains: string[];
}

// Kindergarten-specific developmental and pedagogical specifications
const KINDERGARTEN_SPECS = {
  developmentalStage: '5-6 years, pre-operational (Piaget)',
  attentionSpan: '10-15 min per activity, frequent transitions',
  pedagogicalApproach: 'Play-based, hands-on, multi-sensory exploration',
  instructionalLanguage: 'Simple 3-5 word directions with visual cues',
  assessmentMethods: 'Observation, anecdotal notes, visual indicators',
  materialTypes: 'Large manipulatives, sensory materials, dramatic play props',
  activityTypes: 'Centers, circle time, outdoor play, music/movement, art',
  transitionStrategies: 'Songs, chants, visual timers, movement',
  differentiation: 'Varied materials, flexible grouping, scaffolding'
};

function getSubjectGuidance(subject: string): string {
  const guidance: Record<string, string> = {
    'Mathematics': `
Subject-Specific Guidance for Mathematics (Kindergarten):
- Focus Areas: Number sense (1-20), counting, basic shapes, patterns, comparing quantities
- Resource Types: Large manipulatives, counting bears, pattern blocks, number lines, ten frames
- Pedagogical Approaches: Concrete learning through play, real-world counting experiences, hands-on exploration
- Assessment Best Practices: Observation during play, one-on-one counting assessments, portfolio samples
- Key Concepts: Rote counting, one-to-one correspondence, recognizing numerals, simple patterns, 2D/3D shapes
- Common Pitfalls to Avoid: Abstract symbols without concrete objects, worksheets over manipulatives, rushing to formal algorithms
`,
    'Language Arts': `
Subject-Specific Guidance for Language Arts (Kindergarten):
- Focus Areas: Phonemic awareness, letter recognition, emergent writing, vocabulary development, listening skills
- Resource Types: Big books, alphabet charts, word walls, story props, writing centers with varied materials
- Pedagogical Approaches: Interactive read-alouds, shared writing, phonics through songs/games, environmental print exploration
- Assessment Best Practices: Running records (emergent), letter recognition checks, writing sample portfolios, oral language observations
- Key Concepts: Letter-sound correspondence, rhyming, syllables, sight words, "reading" familiar texts, drawing/writing connection
- Common Pitfalls to Avoid: Isolated phonics drills, forcing standard spelling, too much seatwork, neglecting oral language development
`,
    'Science': `
Subject-Specific Guidance for Science (Kindergarten):
- Focus Areas: Observing, questioning, describing properties, living vs non-living, five senses, weather, plants/animals
- Resource Types: Magnifying glasses, nature collections, observation journals (drawing), simple measurement tools, living things (plants/pets)
- Pedagogical Approaches: Hands-on exploration, outdoor discovery, questioning and predicting, using senses to investigate
- Assessment Best Practices: Science talk discussions, observation of exploration behaviors, drawing/writing about observations
- Key Concepts: Properties of objects, living things grow/need food, weather patterns, pushing/pulling, sorting by attributes
- Common Pitfalls to Avoid: Too much teacher talk, worksheets about science rather than doing science, vocabulary without experience
`,
    'Social Studies': `
Subject-Specific Guidance for Social Studies (Kindergarten):
- Focus Areas: Families, communities, basic geography, holidays/traditions, rules/responsibilities, self-awareness
- Resource Types: Maps (simple), family photos, community helper props, cultural artifacts, classroom job charts
- Pedagogical Approaches: Role-play and dramatic play, sharing personal experiences, community walks, celebration of diversity
- Assessment Best Practices: Discussions about self/family, drawing community maps, role-play observations, sharing traditions
- Key Concepts: My place in family/classroom, community helpers and their roles, basic map concepts, respecting differences, taking turns/sharing
- Common Pitfalls to Avoid: Abstract concepts without personal connection, single-family narratives, too much seatwork, ignoring students' own experiences
`
  };

  return guidance[subject] || '';
}

export function buildKindergartenPrompt(formData: KindergartenFormData): string {
  const specs = KINDERGARTEN_SPECS;
  const domains = formData.learningDomains.join(', ');
  
  const prompt = `Create a kindergarten daily lesson plan using play-based, developmentally appropriate practices.

THEME: ${formData.theme}
CURRICULUM UNIT: ${formData.curriculumUnit}
WEEK: ${formData.week} | DAY: ${formData.day} | DATE: ${formData.date}
AGE GROUP: ${formData.ageGroup} | STUDENTS: ${formData.students} | DURATION: ${formData.duration}
LEARNING DOMAINS: ${domains}

KINDERGARTEN REQUIREMENTS:
- Stage: ${specs.developmentalStage}
- Attention: ${specs.attentionSpan}
- Approach: ${specs.pedagogicalApproach}
- Instructions: ${specs.instructionalLanguage}
- Activities: ${specs.activityTypes}
- Materials: ${specs.materialTypes}
- Assessment: ${specs.assessmentMethods}

LESSON PLAN STRUCTURE:

1. THEME & OBJECTIVES
   - Daily theme connection to "${formData.theme}" (Week ${formData.week}, Day ${formData.day})
   - Child-friendly essential question
   - 2-3 clear learning objectives with "Child can..." statements

2. MATERIALS & RESOURCES
   - List key materials (${specs.materialTypes})
   - Include sensory items, manipulatives, books, props
   - Technology/outdoor materials if applicable

3. DAILY SCHEDULE

   A. Morning Routine (15-20 min)
      - Greeting, self-registration, free choice centers

   B. Circle Time (15-20 min)
      - Welcome song, calendar/weather, theme intro, sharing, movement

   C. Focused Learning (30-40 min)
      - Whole group (10-15 min): Story/demo using ${specs.instructionalLanguage}
      - Learning Centers (max 4): Create play-based centers addressing selected domains
        * Each center: Activity, materials, teacher support, objective

   D. Snack/Social (15-20 min)
      - Self-help practice, conversation prompts, cleanup

   E. Outdoor/Gross Motor (30-45 min)
      - Free play, structured movement, nature exploration

   F. Rest/Quiet (20-30 min)
      - Rest, story time, quiet activities

   G. Afternoon Activities (20-30 min)
      - Creative arts, dramatic play, music/movement, choice time

   H. Closing Circle (10-15 min)
      - Review learning, share favorites, preview tomorrow, closing song

4. ASSESSMENT & DIFFERENTIATION
   - Observation focus areas using ${specs.assessmentMethods}
   - "I can..." success criteria for each domain
   - Support strategies: ${specs.differentiation}
   - Extensions for advanced learners
   - ELL accommodations (visual supports, bilingual materials)

5. CLASSROOM MANAGEMENT
   - Transitions using ${specs.transitionStrategies}
   - Visual schedule, positive reinforcement, movement breaks

6. HOME CONNECTION
   - Family communication, take-home activity, "We learned about..." message

KINDERGARTEN ESSENTIALS:
- Activities under ${specs.attentionSpan}
- Concrete, hands-on learning with frequent movement
- Simple language, lots of modeling
- Play-based approach with child choice
- Process over product, celebrate effort

IMPORTANT: Do not include any introductory text, headers, or explanations before the lesson plan. Start directly with the lesson plan content.

Generate the complete plan now:`;

  return prompt;
}

export default buildKindergartenPrompt;