import { BASE_GRADE_SPECS, getSubjectGuidance } from './gradeSpecs';
import { buildCurriculumPromptSection } from './curriculumPromptSection';
import { getLanguageInstruction } from './languageInstruction';

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
  
  let prompt = `Create a complete, detailed lesson plan for Grade ${formData.gradeLevel} students (${gradeSpec.name}, typically aged ${gradeSpec.ageRange}) following this criteria:


SUBJECT: ${formData.subject}
TOPIC: ${formData.topic}
STRAND: ${formData.strand}
DURATION: ${formData.duration}
CLASS SIZE: ${formData.studentCount} students
${buildCurriculumPromptSection(formData.essentialOutcomes || '', formData.specificOutcomes || '', 'lesson')}
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

  prompt += `
GRADE LEVEL REQUIREMENTS:
- Pedagogical Approach: ${gradeSpec.pedagogicalApproach}
- Activity Types: ${gradeSpec.activityTypes}
- Assessment Methods: ${gradeSpec.assessmentMethods}
- Materials: ${gradeSpec.materialComplexity}
- Learning Objectives: ${gradeSpec.learningObjectiveDepth}
- Instructions: ${gradeSpec.instructionalLanguage}

SUBJECT-SPECIFIC GUIDANCE:
${getSubjectGuidance(formData.subject)}

REQUIRED LESSON PLAN STRUCTURE:

1. LEARNING OBJECTIVES
   - Write 2-3 clear, measurable objectives aligned with ${gradeSpec.learningObjectiveDepth}
   - Use action verbs appropriate for Grade ${formData.gradeLevel}
   ${formData.essentialOutcomes ? `- Objectives MUST align with the Essential Learning Outcome and selected Specific Curriculum Outcomes provided above` : ''}

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

  prompt += getLanguageInstruction(language);
  return prompt;
}

export default buildLessonPrompt;