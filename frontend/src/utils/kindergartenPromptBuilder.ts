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
  developmentalStage: '5-6 years old, pre-operational stage (Piaget)',
  attentionSpan: '10-15 minutes per activity, frequent transitions needed',
  pedagogicalApproach: 'Play-based, hands-on, multi-sensory learning through exploration',
  learningStyle: 'Concrete, experiential learning; cannot yet think abstractly',
  socialEmotional: 'Learning to share, take turns, express feelings, build friendships',
  physicalDevelopment: 'Developing fine and gross motor skills, need for movement',
  cognitiveAbilities: 'Beginning logical thinking, categorizing, pattern recognition',
  languageDevelopment: 'Expanding vocabulary, learning to express ideas, beginning reading readiness',
  instructionalLanguage: 'Simple 3-5 word directions, visual cues essential, lots of modeling',
  assessmentMethods: 'Observation, anecdotal notes, photos, thumbs up/down, smiley faces',
  classroomManagement: 'Consistent routines, visual schedules, positive reinforcement, redirect behavior',
  materialTypes: 'Large manipulatives, sensory materials, dramatic play props, art supplies',
  activityTypes: 'Centers, circle time, outdoor play, music/movement, art, stories, dramatic play',
  learningDomains: {
    'Social-Emotional': 'Relationships, self-regulation, emotional expression, cooperation',
    'Physical': 'Gross motor (running, jumping), fine motor (cutting, writing), self-care',
    'Language & Literacy': 'Listening, speaking, early writing, phonemic awareness, book awareness',
    'Cognitive': 'Problem-solving, memory, attention, symbolic thinking, cause-effect',
    'Mathematics': 'Counting, number recognition, shapes, patterns, measurement, data',
    'Science': 'Observation, exploration, questioning, simple experiments, nature study',
    'Creative Arts': 'Art, music, dance, dramatic play, imagination, self-expression',
    'Social Studies': 'Family, community, cultures, roles, rules, belonging'
  },
  dailyScheduleComponents: {
    arrival: 'Greeting, self-registration, free choice centers',
    morningMeeting: 'Calendar, weather, songs, sharing, community building',
    focusedLearning: 'Thematic instruction, skill development, guided activities',
    centers: 'Rotating through learning centers with teacher guidance',
    snackTime: 'Social skills, self-help, healthy habits',
    outdoorPlay: 'Gross motor development, exploration, social play',
    restTime: 'Quiet activities, rest, listening to stories',
    closingCircle: 'Review day, share learning, prepare for dismissal'
  },
  transitionStrategies: 'Songs, chants, visual timers, cleanup songs, movement activities',
  differentiation: 'Varied materials, flexible grouping, scaffolding, extensions, peer support',
  familyEngagement: 'Home connections, parent communication, family celebrations, shared learning'
};

export function buildKindergartenPrompt(formData: KindergartenFormData): string {
  const specs = KINDERGARTEN_SPECS;
  
  // Get domain descriptions for selected domains
  const selectedDomainDescriptions = formData.learningDomains
    .map(domain => `   - ${domain}: ${specs.learningDomains[domain as keyof typeof specs.learningDomains] || 'Core kindergarten learning'}`)
    .join('\n');
  
  const prompt = `Create a comprehensive kindergarten daily lesson plan following play-based, developmentally appropriate practices.

THEME: ${formData.theme}
CURRICULUM UNIT: ${formData.curriculumUnit}
WEEK: ${formData.week}
DAY: ${formData.day}
DATE: ${formData.date}
AGE GROUP: ${formData.ageGroup}
NUMBER OF STUDENTS: ${formData.students}
DURATION: ${formData.duration}

LEARNING DOMAINS ADDRESSED:
${selectedDomainDescriptions}

KINDERGARTEN DEVELOPMENTAL REQUIREMENTS:
- Developmental Stage: ${specs.developmentalStage}
- Attention Span: ${specs.attentionSpan}
- Pedagogical Approach: ${specs.pedagogicalApproach}
- Learning Style: ${specs.learningStyle}
- Instructional Language: ${specs.instructionalLanguage}
- Activity Types: ${specs.activityTypes}
- Materials: ${specs.materialTypes}
- Assessment: ${specs.assessmentMethods}

REQUIRED KINDERGARTEN LESSON PLAN STRUCTURE:

1. DAILY THEME CONNECTION
   - How today's activities connect to "${formData.theme}"
   - Week ${formData.week}, Day ${formData.day} focus
   - Essential question for the day (child-friendly)

2. LEARNING OBJECTIVES (Across All Domains)
   
${formData.learningDomains.map(domain => `   ${domain}:
   - Specific, observable objective for this domain
   - Success looks like: "Child can..." statement`).join('\n\n')}

3. MATERIALS AND RESOURCES
   - Listed by activity/center
   - All materials should be: ${specs.materialTypes}
   - Include sensory materials, manipulatives, books, props
   - Technology (if appropriate): simple apps, interactive whiteboard
   - Nature/outdoor materials

4. DAILY SCHEDULE AND ACTIVITIES

   A. ARRIVAL AND MORNING ROUTINE (15-20 minutes)
      - Greeting ritual
      - Self-registration activity (name tag, attendance board)
      - Free choice centers or morning work
      - Transition to morning meeting

   B. MORNING MEETING/CIRCLE TIME (15-20 minutes)
      - Welcome song
      - Calendar and weather (interactive)
      - Theme introduction for the day
      - Sharing time (connected to theme)
      - Movement/brain break
      - Transition to focused learning

   C. FOCUSED LEARNING ACTIVITIES (30-40 minutes)
      
      Whole Group Instruction (10-15 minutes):
      - Introduction to main concept
      - Story, demonstration, or exploration
      - Use ${specs.instructionalLanguage}
      - Interactive and engaging
      
      Small Group/Center Rotations:
      Create 4-6 centers addressing different domains:
      
      ${formData.learningDomains.slice(0, 4).map(domain => `Center ${formData.learningDomains.indexOf(domain) + 1} - ${domain}:
      - Activity description (play-based, hands-on)
      - Materials needed
      - Teacher support/guidance
      - Learning objective addressed`).join('\n\n      ')}
      
      ${formData.learningDomains.length > 4 ? `Additional Centers:
      ${formData.learningDomains.slice(4).map(domain => `- ${domain}: [Brief activity description]`).join('\n      ')}` : ''}

   D. SNACK AND SOCIAL TIME (15-20 minutes)
      - Self-help skills practice
      - Conversation prompts related to theme
      - Clean-up routine
      - Transition activity

   E. OUTDOOR PLAY/GROSS MOTOR (30-45 minutes)
      - Free exploration
      - Structured movement activity connected to theme
      - Nature observation/collection (if applicable)
      - Social skill building through play

   F. REST/QUIET TIME (20-30 minutes)
      - Rest on mats with soft music
      - Story time (connected to theme)
      - Quiet independent activities (puzzles, books, drawing)

   G. AFTERNOON ACTIVITIES (20-30 minutes)
      - Creative arts activity related to theme
      - Dramatic play or building/construction
      - Music and movement
      - Choice time

   H. CLOSING CIRCLE (10-15 minutes)
      - Review what we learned today
      - Share favorite parts of the day
      - Preview tomorrow
      - Closing song
      - Dismissal routine

5. ASSESSMENT AND OBSERVATION
   
   Formative Assessment Throughout Day:
   - Observation focus areas for each domain
   - Anecdotal note prompts
   - Photo documentation opportunities
   - What to look for: ${specs.assessmentMethods}
   
   Success Criteria (Child-Friendly):
${formData.learningDomains.map(domain => `   - ${domain}: "I can..." statement children can understand`).join('\n')}

6. DIFFERENTIATION AND SUPPORT
   
   For Children Needing Extra Support:
   - Scaffolding strategies
   - Peer buddy system
   - Modified materials
   - Additional visual supports
   - One-on-one teacher time
   
   For Advanced Learners:
   - Extension activities
   - Leadership opportunities
   - More complex challenges
   - Independent exploration options
   
   For English Language Learners:
   - Visual supports and gestures
   - Bilingual books/materials
   - Peer language models
   - Extra processing time

7. CLASSROOM MANAGEMENT STRATEGIES
   - Attention-getting signals
   - Transition songs/activities: ${specs.transitionStrategies}
   - Positive behavior support
   - Visual schedule for the day
   - Cleanup routines
   - Movement breaks between activities

8. HOME-SCHOOL CONNECTION
   - Family communication for the day
   - Take-home activity or conversation starter
   - "We learned about..." message
   - Materials needed from home (if any)
   - ${specs.familyEngagement}

9. TEACHER REFLECTION PROMPTS
   - What worked well today?
   - Which children need additional support?
   - What should be modified for tomorrow?
   - Observations to document
   - Follow-up activities needed

10. INTEGRATION OF PLAY-BASED LEARNING
    - How is learning embedded in play throughout the day?
    - Opportunities for child choice and initiative
    - Balance of teacher-directed and child-initiated activities
    - Ensuring ${specs.pedagogicalApproach}

SPECIAL CONSIDERATIONS FOR KINDERGARTEN:
- Keep activities SHORT (${specs.attentionSpan})
- Use LOTS of transitions: ${specs.transitionStrategies}
- Make learning CONCRETE and HANDS-ON
- Include MOVEMENT throughout the day
- Use SIMPLE language: ${specs.instructionalLanguage}
- Emphasize SOCIAL-EMOTIONAL learning: ${specs.socialEmotional}
- Build in FLEXIBILITY for children's interests and energy levels
- Focus on PROCESS over product
- Celebrate EFFORT and progress, not just achievement

Generate the complete kindergarten daily plan now:`;

  return prompt;
}

export default buildKindergartenPrompt;