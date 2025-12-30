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