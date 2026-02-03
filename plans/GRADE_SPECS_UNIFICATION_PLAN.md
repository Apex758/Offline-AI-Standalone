# Grade Specifications Unification Plan

## Objective

Update all prompt builder files to match the lesson planner's subject and grade specifics pattern for **Grades K-6** and **Core Subjects** (Mathematics, Language Arts, Science, Social Studies), with prompts specific to each resource type (planners vs generators) guided by input data.

---

## Scope

| Grade Levels        | Subjects                                            |
| ------------------- | --------------------------------------------------- |
| K, 1, 2, 3, 4, 5, 6 | Mathematics, Language Arts, Science, Social Studies |

| Resource Types | Description                                                                        |
| -------------- | ---------------------------------------------------------------------------------- |
| **Planners**   | Lesson Planner, Kindergarten Planner, Cross-Curricular Planner, Multigrade Planner |
| **Generators** | Quiz Generator, Worksheet Generator, Rubric Generator                              |

---

## Reference Pattern

The [`lessonPromptBuilder.ts`](../frontend/src/utils/lessonPromptBuilder.ts:26) uses this structure:

```typescript
const GRADE_SPECS = {
  K: {
    name: "Kindergarten",
    pedagogicalApproach:
      "Play-based, hands-on learning with frequent transitions",
    activityTypes: "Sensory play, movement, songs, stories, dramatic play, art",
    assessmentMethods:
      "Observation checklists, anecdotal notes, thumbs up/down",
    materialComplexity: "Large manipulatives, bright visuals, real objects",
    learningObjectiveDepth:
      "Recognition, identification, basic motor skills (Bloom: Remember)",
    instructionalLanguage: "Simple 3-5 word instructions, visual cues required",
  },
  "1": {
    name: "Grade 1",
    pedagogicalApproach:
      "Concrete experiences with guided practice and modeling",
    activityTypes:
      "Center activities, partner work, simple experiments, craft projects",
    assessmentMethods:
      "Exit tickets, work samples, simple rubrics, oral responses",
    materialComplexity: "Manipulatives, pictures with words, simple worksheets",
    learningObjectiveDepth:
      "Recall, basic application, simple comparisons (Bloom: Remember, Understand)",
    instructionalLanguage: "Clear step-by-step directions with demonstrations",
  },
  "2": {
    name: "Grade 2",
    pedagogicalApproach: "Guided discovery with structured collaboration",
    activityTypes:
      "Small group projects, hands-on investigations, role-play, journals",
    assessmentMethods: "Rubrics, peer assessment, self-reflection, portfolios",
    materialComplexity:
      "Graphic organizers, simple texts, basic tools and instruments",
    learningObjectiveDepth:
      "Comprehension, application, basic analysis (Bloom: Understand, Apply)",
    instructionalLanguage: "Multi-step instructions with visual supports",
  },
  "3": {
    name: "Grade 3",
    pedagogicalApproach: "Inquiry-based with scaffolded independence",
    activityTypes:
      "Research projects, experiments, presentations, collaborative tasks",
    assessmentMethods:
      "Performance tasks, written responses, project rubrics, quizzes",
    materialComplexity:
      "Reference materials, detailed diagrams, age-appropriate tech tools",
    learningObjectiveDepth:
      "Application, analysis, beginning synthesis (Bloom: Apply, Analyze)",
    instructionalLanguage: "Detailed written and verbal instructions",
  },
  "4": {
    name: "Grade 4",
    pedagogicalApproach: "Student-centered inquiry with differentiation",
    activityTypes:
      "Independent research, debates, design challenges, multimedia projects",
    assessmentMethods:
      "Essays, presentations, self-assessment, peer review, tests",
    materialComplexity:
      "Multiple sources, technical tools, complex models and diagrams",
    learningObjectiveDepth:
      "Analysis, synthesis, evaluation (Bloom: Analyze, Evaluate)",
    instructionalLanguage:
      "Complex instructions with options for student choice",
  },
  "5": {
    name: "Grade 5",
    pedagogicalApproach:
      "Collaborative inquiry with critical thinking emphasis",
    activityTypes:
      "Extended projects, scientific investigations, literary analysis, debates",
    assessmentMethods:
      "Research papers, oral presentations, portfolios, authentic assessments",
    materialComplexity:
      "Primary sources, advanced technology, specialized equipment",
    learningObjectiveDepth:
      "Synthesis, evaluation, creation (Bloom: Evaluate, Create)",
    instructionalLanguage:
      "Sophisticated directions with metacognitive prompts",
  },
  "6": {
    name: "Grade 6",
    pedagogicalApproach: "Independent inquiry with real-world connections",
    activityTypes:
      "Capstone projects, expert presentations, community partnerships, research",
    assessmentMethods:
      "Authentic assessments, portfolios, peer and expert feedback, exhibitions",
    materialComplexity:
      "Academic texts, professional tools, complex digital resources",
    learningObjectiveDepth:
      "Advanced evaluation and creation (Bloom: Evaluate, Create)",
    instructionalLanguage:
      "Academic language with student-driven modifications",
  },
};
```

---

## Resource Type Patterns

### Planners vs Generators

Each resource type has distinct requirements:

| Aspect          | Planners                                           | Generators                             |
| --------------- | -------------------------------------------------- | -------------------------------------- |
| **Output**      | Full instructional sequence                        | Assessment/support materials           |
| **Structure**   | Multi-section (objectives, procedures, assessment) | Focused format (questions, criteria)   |
| **Time Focus**  | Full lesson/day schedule                           | Specific activity or task              |
| **Grade Usage** | Guides instruction delivery                        | Measures learning or supports practice |

### Resource-Specific Prompt Patterns

#### 1. Lesson Planner Pattern

**Purpose:** Complete lesson plan with procedures, timing, differentiation
**Key Input Data:** topic, subject, grade, strand, duration, studentCount
**Prompt Structure:**

```
Create a complete lesson plan for [GRADE] [SUBJECT] on [TOPIC]

GRADE-SPECIFIC REQUIREMENTS:
- Pedagogical Approach: {gradeSpec.pedagogicalApproach}
- Activity Types: {gradeSpec.activityTypes}
- Assessment Methods: {gradeSpec.assessmentMethods}
- Material Complexity: {gradeSpec.materialComplexity}
- Learning Objective Depth: {gradeSpec.learningObjectiveDepth}
- Instructional Language: {gradeSpec.instructionalLanguage}

SUBJECT-SPECIFIC GUIDANCE:
{getSubjectGuidance(subject)}

REQUIRED LESSON STRUCTURE:
1. LEARNING OBJECTIVES (aligned to {gradeSpec.learningObjectiveDepth})
2. MATERIALS AND RESOURCES ({gradeSpec.materialComplexity})
3. LESSON PROCEDURES (using {gradeSpec.activityTypes})
   - Introduction/Hook
   - Direct Instruction ({gradeSpec.instructionalLanguage})
   - Guided Practice
   - Independent Practice
   - Closure
4. ASSESSMENT ({gradeSpec.assessmentMethods})
5. DIFFERENTIATION
6. CURRICULUM REFERENCES
```

#### 2. Kindergarten Planner Pattern

**Purpose:** Full-day play-based schedule
**Key Input Data:** theme, curriculumUnit, week, day, date, ageGroup, students, duration, learningDomains
**Prompt Structure:**

```
Create a kindergarten daily lesson plan using play-based practices.

THEME: {theme}
CURRICULUM UNIT: {curriculumUnit}
WEEK: {week} | DAY: {day}
LEARNING DOMAINS: {domains}

KINDERGARTEN REQUIREMENTS:
- Developmental Stage: 5-6 years, pre-operational
- Attention Span: 10-15 min per activity
- Approach: Play-based, hands-on, multi-sensory
- Activities: Centers, circle time, outdoor play, music/movement

REQUIRED SCHEDULE:
1. Morning Routine
2. Circle Time
3. Focused Learning (centers by domain)
4. Snack/Social
5. Outdoor/Gross Motor
6. Rest/Quiet
7. Afternoon Activities
8. Closing Circle

Each center activity must address: {learningDomains}
```

#### 3. Cross-Curricular Planner Pattern

**Purpose:** Integrated lesson across multiple subjects
**Key Input Data:** theme, primarySubject, integrationSubjects, gradeLevel, duration, integrationModel
**Prompt Structure:**

```
Create a cross-curricular lesson for [GRADE] integrating [SUBJECTS].

THEME: {theme}
PRIMARY SUBJECT: {primarySubject}
INTEGRATION SUBJECTS: {integrationSubjects}
INTEGRATION MODEL: {integrationModel}

GRADE REQUIREMENTS:
{gradeSpec.pedagogicalApproach}
{gradeSpec.activityTypes}

INTEGRATION REQUIREMENTS:
- Primary Subject ({primarySubject}): Core content and skills
- Integration Strategy: {integrationModel}

SUBJECT GUIDANCE:
{getSubjectGuidance(primarySubject)}
{integrationSubjects.map(s => getSubjectGuidance(s))}

REQUIRED STRUCTURE:
1. INTEGRATED THEME OVERVIEW
2. SUBJECT-SPECIFIC OBJECTIVES (by subject)
3. INTEGRATED MATERIALS
4. CROSS-CURRICULAR PROCEDURES
5. INTEGRATED ASSESSMENT
```

#### 4. Multigrade Planner Pattern

**Purpose:** Differentiated lesson for multiple grade levels
**Key Input Data:** topic, subject, gradeLevels, duration, totalStudents
**Prompt Structure:**

```
Create a multigrade lesson for grades {gradeLevels} learning together.

TOPIC: {topic}
SUBJECT: {subject}
GRADE LEVELS: {gradeLevels}

MULTIGRADE REQUIREMENTS:
- Differentiation Strategy: Parallel tasks with tiered complexity
- Grouping Approach: Flexible grouping, peer mentoring

GRADE-SPECIFIC REQUIREMENTS:
{gradeLevels.map(grade => GRADE_SPECS[grade])}

SUBJECT GUIDANCE:
{getSubjectGuidance(subject)}

REQUIRED STRUCTURE:
1. SHARED LEARNING OBJECTIVES (common concept)
2. GRADE-SPECIFIC OBJECTIVES (by grade)
3. DIFFERENTIATED MATERIALS
4. MULTIGRADE PROCEDURES
   - Whole class opening
   - Tiered instruction (by grade)
   - Differentiated activities
   - Whole class synthesis
5. ASSESSMENT BY GRADE LEVEL
```

#### 5. Quiz Generator Pattern

**Purpose:** Assessment questions for specific learning outcomes
**Key Input Data:** subject, gradeLevel, learningOutcomes, questionTypes, cognitiveLevels, numberOfQuestions
**Prompt Structure:**

```
Create a {numberOfQuestions}-question quiz for Grade {gradeLevel} {subject}.

LEARNING OUTCOMES: {learningOutcomes}
QUESTION TYPES: {questionTypes}
COGNITIVE LEVELS: {cognitiveLevels}

GRADE REQUIREMENTS:
- Pedagogical Approach: {gradeSpec.pedagogicalApproach}
- Assessment Methods: {gradeSpec.assessmentMethods}
- Learning Objective Depth: {gradeSpec.learningObjectiveDepth}
- Instructional Language: {gradeSpec.instructionalLanguage}

SUBJECT-SPECIFIC ASSESSMENT:
{getSubjectGuidance(subject)}
- Focus assessment on subject-specific skills
- Use grade-appropriate complexity

QUESTION REQUIREMENTS:
- Generate EXACTLY {numberOfQuestions} questions
- Types: {questionTypes}
- Cognitive levels: {cognitiveLevels}
- Aligned to: {learningOutcomes}

FORMAT BY TYPE:
[Format instructions for each selected question type]
```

#### 6. Worksheet Generator Pattern

**Purpose:** Practice materials for skill development
**Key Input Data:** subject, gradeLevel, strand, topic, questionCount, questionType, selectedTemplate
**Prompt Structure:**

```
Create a worksheet for Grade {gradeLevel} {subject} on {topic}.

STRAND: {strand}
TOPIC: {topic}
TEMPLATE: {selectedTemplate}
QUESTION TYPE: {questionType}

GRADE REQUIREMENTS:
- Material Complexity: {gradeSpec.materialComplexity}
- Activity Types: {gradeSpec.activityTypes}
- Instructional Language: {gradeSpec.instructionalLanguage}
- Learning Objective Depth: {gradeSpec.learningObjectiveDepth}

SUBJECT-SPECIFIC RESOURCES:
{getSubjectGuidance(subject)}
- Resources: [subject-specific materials]
- Focus: [subject-specific skills]

TEMPLATE-SPECIFIC INSTRUCTIONS:
{getTemplateInstructions(selectedTemplate)}

GENERATE EXACTLY {questionCount} QUESTIONS:
- Content: {topic}
- Strand alignment: {strand}
- Grade-appropriate: {gradeSpec.materialComplexity}
```

#### 7. Rubric Generator Pattern

**Purpose:** Assessment criteria for assignments
**Key Input Data:** assignmentType, subject, gradeLevel, performanceLevels, includePointValues
**Prompt Structure:**

```
Create a rubric for Grade {gradeLevel} {subject} {assignmentType}.

PERFORMANCE LEVELS: {performanceLevels}
INCLUDE POINTS: {includePointValues}

GRADE REQUIREMENTS:
- Assessment Methods: {gradeSpec.assessmentMethods}
- Learning Objective Depth: {gradeSpec.learningObjectiveDepth}

SUBJECT-SPECIFIC CRITERIA:
{getSubjectGuidance(subject)}
- Criteria focus areas for {assignmentType}
- Subject-specific performance descriptors

RUBRIC REQUIREMENTS:
- {gradeSpec.criteriaCount} criteria
- {performanceLevels} performance levels
- {gradeSpec.performanceDescriptors}

REQUIRED FORMAT:
| Criteria | Level 1 | Level 2 | Level 3 | Level 4 |
```

---

## Subject-Specific Adaptations (K-6, Core Subjects)

### Mathematics

**Resource Types:** Manipulatives, number lines, graph paper, calculators, geometric tools, fraction bars, place value blocks
**Pedagogical Focus:** Concrete-pictorial-abstract, problem-solving, mathematical reasoning
**Assessment Methods:** Problem sets, worked examples, error analysis, math journals, performance tasks
**Grade Progression:**

- K: Counting, basic shapes, number recognition
- 1-2: Addition/subtraction, place value, measurement
- 3-4: Multiplication/division, fractions, geometry
- 5-6: Decimals, ratios, algebraic thinking, statistics

### Language Arts

**Resource Types:** Texts (fiction/non-fiction), graphic organizers, writing prompts, dictionaries, word walls, anchor charts
**Pedagogical Focus:** Balanced literacy, writing workshop, reading comprehension, communication skills
**Assessment Methods:** Writing rubrics, comprehension checks, oral presentations, reading logs, running records
**Grade Progression:**

- K: Phonemic awareness, letter recognition, emergent writing
- 1-2: Decoding, fluency, sentence structure, narrative writing
- 3-4: Reading strategies, paragraph writing, genre study
- 5-6: Critical analysis, essay writing, research skills, literary devices

### Science

**Resource Types:** Lab equipment, models, observation sheets, safety gear, magnifying glasses, measuring tools
**Pedagogical Focus:** Inquiry-based learning, hands-on experimentation, scientific method, evidence-based reasoning
**Assessment Methods:** Lab reports, science notebooks, hypothesis testing, data analysis, project presentations
**Grade Progression:**

- K: Observing, questioning, properties of objects, living things
- 1-2: Plants/animals, matter, weather, simple investigations
- 3-4: Ecosystems, forces/motion, earth systems, data collection
- 5-6: Scientific method, variables, human body, energy, engineering design

### Social Studies

**Resource Types:** Maps, timelines, primary sources, artifacts, globes, atlases, historical documents
**Pedagogical Focus:** Project-based learning, critical thinking, historical analysis, civic engagement
**Assessment Methods:** Research projects, document analysis, presentations, debates, reflective essays
**Grade Progression:**

- K: Families, communities, basic geography, holidays
- 1-2: Neighborhoods, maps, local history, cultures, basic economics
- 3-4: Regions, indigenous peoples, government basics, historical events
- 5-6: Ancient civilizations, world geography, U.S. history, government systems, economics

---

## Subject Guidance Function

```typescript
function getSubjectGuidance(subject: string): string {
  const guidance: Record<string, string> = {
    Mathematics: `
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
    "Language Arts": `
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
    Science: `
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
    "Social Studies": `
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
`,
  };

  return (
    guidance[subject] ||
    `Adapt resources to ${subject} best practices and standards appropriate for the grade level.`
  );
}
```

---

## Files to Update

### Planners (4 files)

#### 1. Lesson Planner

**File:** [`frontend/src/utils/lessonPromptBuilder.ts`](../frontend/src/utils/lessonPromptBuilder.ts)

**Required Changes:**

1. Already has complete `GRADE_SPECS` for K-6
2. Add `getSubjectGuidance(subject)` function for 4 core subjects
3. Update prompt builder (lines 93+) to:
   - Reference subject guidance in materials and procedures sections
   - Tailor activities to subject-specific approaches
   - Use input data (topic, strand, duration) for dynamic content

#### 2. Kindergarten Planner

**File:** [`frontend/src/utils/kindergartenPromptBuilder.ts`](../frontend/src/utils/kindergartenPromptBuilder.ts)

**Required Changes:**

1. Already K-specific - keep distinct
2. Add subject guidance for early childhood adaptations of core subjects
3. Update to use learningDomains input for center activity generation

#### 3. Cross-Curricular Planner

**File:** [`frontend/src/utils/crossCurricularPromptBuilder.ts`](../frontend/src/utils/crossCurricularPromptBuilder.ts)

**Required Changes:**

1. Add 6 lesson planner fields alongside existing integration specs (K-6)
2. Add `getSubjectGuidance(subject)` function
3. Update prompt builder to:
   - Reference primarySubject and integrationSubjects guidance
   - Suggest integration patterns for core subject combinations
   - Use theme and integrationModel inputs for structure

#### 4. Multigrade Planner

**File:** [`frontend/src/utils/multigradePromptBuilder.ts`](../frontend/src/utils/multigradePromptBuilder.ts)

**Required Changes:**

1. Keep range-based specs
2. Add `GRADE_SPECS` for individual grades K-6
3. Add `getSubjectGuidance(subject)` function
4. Update prompt builder to:
   - Reference individual grade specs for each grade in gradeLevels
   - Suggest subject-appropriate tiered activities
   - Use topic and subject inputs for differentiation

### Generators (3 files)

#### 5. Quiz Generator

**File:** [`frontend/src/utils/quizPromptBuilder.ts`](../frontend/src/utils/quizPromptBuilder.ts)

**Required Changes:**

1. Add 6 lesson planner fields to `GRADE_SPECS` (K-6)
2. Keep existing quiz-specific fields
3. Add `getSubjectGuidance(subject)` function
4. Update prompt builder (lines 143-163) to:
   - Use grade spec assessment methods
   - Reference subject-specific assessment approaches
   - Tailor questions to learningOutcomes and questionTypes
   - Match cognitiveLevels to gradeSpec.learningObjectiveDepth

#### 6. Worksheet Generator

**File:** [`frontend/src/utils/worksheetPromptBuilder.ts`](../frontend/src/utils/worksheetPromptBuilder.ts)

**Required Changes:**

1. Add 6 lesson planner fields to `GRADE_SPECS` (K-6)
2. Add `getSubjectGuidance(subject)` function
3. Update template instructions to reference subject resources
4. Use strand and topic inputs for curriculum alignment

#### 7. Rubric Generator

**File:** [`frontend/src/utils/rubricPromptBuilder.ts`](../frontend/src/utils/rubricPromptBuilder.ts)

**Required Changes:**

1. Add 6 lesson planner fields alongside existing rubric fields (K-6)
2. Add `getSubjectGuidance(subject)` function
3. Update prompt builder (lines 77+) to:
   - Suggest subject-specific criteria based on assignmentType
   - Reference gradeSpec for descriptor complexity
   - Use subject and assignmentType for criteria generation

---

## Implementation Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    GRADE_SPECS (K-6)                            │
│  pedagogicalApproach, activityTypes, assessmentMethods, etc.    │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   PLANNERS    │     │  getSubject   │     │  GENERATORS   │
│               │     │   Guidance    │     │               │
│ • Lesson      │◄────┤ (4 subjects)  ├────►│ • Quiz        │
│ • Kindergarten│     │               │     │ • Worksheet   │
│ • Cross-Cur.  │     │ • Mathematics │     │ • Rubric      │
│ • Multigrade  │     │ • Language    │     │               │
│               │     │   Arts        │     │               │
│               │     │ • Science     │     │               │
│               │     │ • Social St.  │     │               │
└───────────────┘     └───────────────┘     └───────────────┘
        │                                           │
        │         Input Data (Form Fields)          │
        │    (subject, grade, topic, strand, etc.)  │
        └───────────────────┬───────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  Resource-Specific      │
              │  Prompt Generation      │
              │  (Planners vs Generators)│
              └─────────────────────────┘
```

---

## Implementation Checklist

### Phase 1: Setup

- [ ] Choose approach (inline vs shared utility)
- [ ] If shared utility: create `frontend/src/utils/gradeSpecs.ts` with K-6 specs

### Phase 2: Update GRADE_SPECS (K-6 only)

For each file, add 6 lesson planner fields:

- [ ] `pedagogicalApproach`
- [ ] `activityTypes`
- [ ] `assessmentMethods`
- [ ] `materialComplexity`
- [ ] `learningObjectiveDepth`
- [ ] `instructionalLanguage`

### Phase 3: Add Subject Guidance (4 core subjects)

- [ ] Create `getSubjectGuidance()` function in each prompt builder
- [ ] Add guidance for Mathematics
- [ ] Add guidance for Language Arts
- [ ] Add guidance for Science
- [ ] Add guidance for Social Studies

### Phase 4: Update Planners (Resource-Specific Prompts)

- [ ] **Lesson Planner**: Add subject guidance, tailor to lesson format
- [ ] **Kindergarten Planner**: Add subject guidance for K, use learningDomains
- [ ] **Cross-Curricular Planner**: Add grade specs + subject guidance for multiple subjects
- [ ] **Multigrade Planner**: Add grade specs + subject guidance for tiered instruction

### Phase 5: Update Generators (Resource-Specific Prompts)

- [ ] **Quiz Generator**: Add grade specs + subject guidance for assessment
- [ ] **Worksheet Generator**: Add grade specs + subject guidance for practice materials
- [ ] **Rubric Generator**: Add grade specs + subject guidance for criteria

### Phase 6: Testing (K-6, Core Subjects)

- [ ] Test each planner with different subjects
- [ ] Test each generator with different grades
- [ ] Verify prompts include resource-specific structure
- [ ] Verify subject-specific guidance appears
- [ ] Verify grade-specific specs appear
- [ ] Verify input data guides output

---

## Next Steps

1. **Review this plan** and confirm resource-type-specific patterns
2. **Choose approach** (inline vs shared utility)
3. **Switch to Code mode** to implement the changes
4. **Start with one file** (recommend quizPromptBuilder.ts) to establish pattern
5. **Test each generator/planner** after updates

---

_Updated: 2026-02-03_
_Scope: Grades K-6, Core Subjects (Mathematics, Language Arts, Science, Social Studies)_
_Resource Types: 4 Planners + 3 Generators_
_Status: Ready for implementation_
