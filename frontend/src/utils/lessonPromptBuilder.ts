import { BASE_GRADE_SPECS, getSubjectGuidance, getGrade6ExamPrepNote } from './gradeSpecs';
import { buildCurriculumPromptSection } from './curriculumPromptSection';
import { getLanguageInstruction } from './languageInstruction';
import { buildTitleGenerationInstruction } from './titleExtractor';

interface CurriculumReference {
  id: string;
  displayName: string;
  grade: string;
  subject: string;
  strand: string;
  route: string;
  keywords: string[];
  essentialOutcomes: (string | { id: string; text: string })[];
  specificOutcomes: (string | { id: string; text: string; eloRef?: string })[];
}

const GRADE_SPECS = BASE_GRADE_SPECS;

export function buildLessonPrompt(formData: any, curriculumRefs?: CurriculumReference[], language?: string): string {
  const gradeSpec = GRADE_SPECS[formData.gradeLevel as keyof typeof GRADE_SPECS];

  const DURATION_MAP: Record<string, { intro: string; direct: string; guided: string; independent: string; closure: string }> = {
    '30 minutes': { intro: '5 minutes', direct: '10 minutes', guided: '10 minutes', independent: '5 minutes', closure: '3-5 minutes' },
    '45 minutes': { intro: '5-7 minutes', direct: '15 minutes', guided: '15 minutes', independent: '10 minutes', closure: '5 minutes' },
    '60 minutes': { intro: '10 minutes', direct: '20 minutes', guided: '20 minutes', independent: '15 minutes', closure: '5-7 minutes' },
  };
  const timings = DURATION_MAP[formData.duration] ?? DURATION_MAP['60 minutes'];

  let prompt = `Create a complete, detailed lesson plan for Grade ${formData.gradeLevel} students (${gradeSpec.name}, typically aged ${gradeSpec.ageRange}) following this criteria:


SUBJECT: ${formData.subject}
TOPIC: ${formData.topic || '[Generate an appropriate lesson topic based on the subject, grade level, strand, and learning outcomes provided.]'}
STRAND: ${formData.strand}
DURATION: ${formData.duration}
CLASS SIZE: ${formData.studentCount} students
${formData.materials ? `AVAILABLE MATERIALS: ${formData.materials}\n` : 'AVAILABLE MATERIALS: Whiteboard only\n'}${buildCurriculumPromptSection(formData.essentialOutcomes || '', formData.specificOutcomes || '', 'lesson')}
${formData.learningStyles ? `LEARNING STYLES: ${formData.learningStyles}\n` : ''}${formData.specialNeeds ? `SPECIAL NEEDS/ACCOMMODATIONS: ${formData.specialNeeds}\n` : ''}`;


  if (curriculumRefs && curriculumRefs.length > 0) {
    prompt += `\nCURRICULUM REFERENCES TO USE (IMPORTANT - USE ONLY THESE):
`;
    curriculumRefs.forEach((ref, index) => {
      prompt += `${index + 1}. ${ref.displayName}
   Grade: ${ref.grade} | Subject: ${ref.subject} | Strand: ${ref.strand}
`;
      if (ref.essentialOutcomes && ref.essentialOutcomes.length > 0) {
        const elo = ref.essentialOutcomes[0];
        prompt += `   Essential Outcome: ${typeof elo === 'string' ? elo : elo.text}
`;
      }
    });
    prompt += `
CRITICAL: In the "Curriculum References" section at the end, list ONLY these ${curriculumRefs.length} curriculum reference(s). Do NOT add any other curriculum standards, frameworks, or references.
`;
  }

  prompt += getGrade6ExamPrepNote(formData.gradeLevel);

  prompt += `
GRADE LEVEL REQUIREMENTS:
- Pedagogical Approach: ${gradeSpec.pedagogicalApproach}
- Activity Types: ${gradeSpec.activityTypes}
- Assessment Methods: ${gradeSpec.assessmentMethods}

SUBJECT-SPECIFIC GUIDANCE:
${getSubjectGuidance(formData.subject)}

REQUIRED LESSON PLAN STRUCTURE:

1. LEARNING OBJECTIVES
   - Write 2-3 clear, measurable objectives aligned with ${gradeSpec.learningObjectiveDepth}
   - Use action verbs appropriate for Grade ${formData.gradeLevel}
   ${formData.essentialOutcomes ? `- Objectives MUST align with the Essential Learning Outcome and selected Specific Curriculum Outcomes provided above` : ''}

2. MATERIALS AND RESOURCES
   - List materials from AVAILABLE MATERIALS above only. Do not add materials not listed.
   - Include technology, handouts, manipulatives, visual aids

3. LESSON PROCEDURES
   
   A. Introduction/Hook (${timings.intro})
      - Engaging opening activity
      - Connect to prior knowledge
      - State learning objectives
   
   B. Direct Instruction (${timings.direct})
      - Clear explanation of new content
      - Use ${gradeSpec.instructionalLanguage}
      - Include modeling/demonstrations
   
   C. Guided Practice (${timings.guided})
      - ${gradeSpec.activityTypes}
      - Teacher circulates and provides support
      - Check for understanding
   
   D. Independent Practice/Application (${timings.independent})
      - Students work individually or in small groups
      - Differentiation options provided
   
   E. Closure (${timings.closure})
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

Generate the complete lesson plan now.`;

  prompt += getLanguageInstruction(language);

  if (!formData.topic?.trim()) {
    prompt += buildTitleGenerationInstruction('lesson plan', 'based on the subject, grade level, strand, and learning outcomes');
  }

  return prompt;
}

export default buildLessonPrompt;