interface RubricFormData {
  assignmentType: string;
  subject: string;
  gradeLevel: string;
  performanceLevels: string;
  includePointValues: boolean;
}

// Grade-specific rubric complexity guidance
const GRADE_SPECS = {
  'K': {
    name: 'Kindergarten',
    criteriaCount: '2-3 simple criteria',
    performanceDescriptors: 'Picture-based or emoji indicators (😊 😐 😟)',
    criteriaComplexity: 'Observable behaviors only (e.g., "Uses colors", "Shares materials")',
    languageLevel: 'Very simple phrases, 2-4 words per descriptor',
    assessmentFocus: 'Process over product, effort and participation',
    pointSystem: 'Avoid numerical points; use smiley faces or stickers'
  },
  '1': {
    name: 'Grade 1',
    criteriaCount: '3-4 basic criteria',
    performanceDescriptors: 'Simple words with visual supports (Great, Good, Keep Trying)',
    criteriaComplexity: 'Basic observable skills (e.g., "Writes name", "Follows directions")',
    languageLevel: 'Simple sentences, clear and concrete',
    assessmentFocus: 'Completion, basic quality, following instructions',
    pointSystem: 'Simple points (1-3) or stars if using point values'
  },
  '2': {
    name: 'Grade 2',
    criteriaCount: '4-5 criteria',
    performanceDescriptors: 'Clear descriptive levels (Excellent, Good, Fair, Needs Work)',
    criteriaComplexity: 'Specific skills with basic quality indicators',
    languageLevel: 'Complete sentences, descriptive but concrete',
    assessmentFocus: 'Quality of work, accuracy, organization',
    pointSystem: '1-4 point scale per criterion if using point values'
  },
  '3': {
    name: 'Grade 3',
    criteriaCount: '4-6 criteria',
    performanceDescriptors: 'Detailed performance levels with specific examples',
    criteriaComplexity: 'Multiple aspects per criterion, beginning to assess depth',
    languageLevel: 'Detailed descriptors with examples',
    assessmentFocus: 'Content understanding, skill application, presentation',
    pointSystem: '1-5 point scale or percentage ranges if using point values'
  },
  '4': {
    name: 'Grade 4',
    criteriaCount: '5-7 criteria',
    performanceDescriptors: 'Comprehensive levels showing progression of mastery',
    criteriaComplexity: 'Multiple dimensions per criterion (content, skill, presentation)',
    languageLevel: 'Specific, measurable descriptors',
    assessmentFocus: 'Depth of understanding, critical thinking, organization',
    pointSystem: '1-5 point scale with weighted criteria if using point values'
  },
  '5': {
    name: 'Grade 5',
    criteriaCount: '6-8 criteria',
    performanceDescriptors: 'Detailed analytical rubric with clear distinctions',
    criteriaComplexity: 'Complex multi-dimensional criteria (content, analysis, synthesis, communication)',
    languageLevel: 'Academic language with precise descriptors',
    assessmentFocus: 'Critical thinking, analysis, evidence-based conclusions, creativity',
    pointSystem: '1-10 point scale or percentage ranges with weighted categories'
  },
  '6': {
    name: 'Grade 6',
    criteriaCount: '6-10 criteria',
    performanceDescriptors: 'Sophisticated analytical rubric with nuanced distinctions',
    criteriaComplexity: 'Advanced multi-faceted criteria including metacognitive elements',
    languageLevel: 'Advanced academic vocabulary, precise technical language',
    assessmentFocus: 'Depth of analysis, synthesis, evaluation, originality, scholarly presentation',
    pointSystem: 'Weighted scale with detailed point allocations (e.g., 1-20 per criterion)'
  }
};

export function buildRubricPrompt(formData: RubricFormData): string {
  const gradeSpec = GRADE_SPECS[formData.gradeLevel as keyof typeof GRADE_SPECS];
  
  const prompt = `Create a comprehensive assessment rubric for Grade ${formData.gradeLevel} students.

ASSIGNMENT TYPE: ${formData.assignmentType}
SUBJECT: ${formData.subject}
PERFORMANCE LEVELS: ${formData.performanceLevels}
${formData.includePointValues ? 'INCLUDE POINT VALUES: Yes\n' : 'INCLUDE POINT VALUES: No\n'}
GRADE LEVEL REQUIREMENTS:
- Number of Criteria: ${gradeSpec.criteriaCount}
- Performance Descriptors: ${gradeSpec.performanceDescriptors}
- Criteria Complexity: ${gradeSpec.criteriaComplexity}
- Language Level: ${gradeSpec.languageLevel}
- Assessment Focus: ${gradeSpec.assessmentFocus}
${formData.includePointValues ? `- Point System: ${gradeSpec.pointSystem}\n` : ''}
REQUIRED RUBRIC STRUCTURE:

1. TITLE AND OVERVIEW
   - Assignment title
   - Brief description of what is being assessed
   - Grade level and subject

2. CRITERIA AND PERFORMANCE LEVELS
   Create ${gradeSpec.criteriaCount} with the following structure:
   
   For each criterion:
   - Criterion Name (e.g., Content Accuracy, Organization, Creativity)
   - Description of what this criterion measures
   ${formData.includePointValues ? `- Points possible (following ${gradeSpec.pointSystem})\n` : ''}
   Performance Levels (${formData.performanceLevels}):
   ${formData.performanceLevels.split(',').map(level => `   * ${level.trim()}: [Clear descriptor of performance at this level${formData.includePointValues ? ', points awarded' : ''}]`).join('\n')}

3. ASSESSMENT GUIDELINES
   - Total points possible (if applicable)
   - Scoring instructions
   - Success criteria for assignment
   - ${gradeSpec.assessmentFocus}

4. STUDENT-FRIENDLY VERSION (Optional)
   - Simplified language for student self-assessment
   - Clear "I can" statements for each criterion
   - Visual supports if appropriate for Grade ${formData.gradeLevel}

FORMATTING REQUIREMENTS:
- Use ${gradeSpec.languageLevel}
- Ensure ${gradeSpec.performanceDescriptors}
- Make criteria ${gradeSpec.criteriaComplexity}
- Each performance level must have clear, distinct descriptors
- Performance descriptors should show clear progression from lowest to highest level
${formData.includePointValues ? `- Point values must align with ${gradeSpec.pointSystem}\n` : ''}
Generate the complete rubric now:`;

  return prompt;
}

export default buildRubricPrompt;