interface RubricFormData {
  assignmentType: string;
  subject: string;
  gradeLevel: string;
  performanceLevels: string;
  includePointValues: boolean;
}

// Grade-specific rubric specifications (optimized - only 3 critical specs)
const GRADE_SPECS = {
  'K': {
    name: 'Kindergarten',
    criteriaCount: '2-3 simple criteria',
    performanceDescriptors: 'Picture-based or emoji indicators (😊 😐 😟)',
    pointSystem: 'Avoid numerical points; use smiley faces or stickers'
  },
  '1': {
    name: 'Grade 1',
    criteriaCount: '3-4 basic criteria',
    performanceDescriptors: 'Simple words with visual supports (Great, Good, Keep Trying)',
    pointSystem: 'Simple points (1-3) or stars if using point values'
  },
  '2': {
    name: 'Grade 2',
    criteriaCount: '4-5 criteria',
    performanceDescriptors: 'Clear descriptive levels (Excellent, Good, Fair, Needs Work)',
    pointSystem: '1-4 point scale per criterion if using point values'
  },
  '3': {
    name: 'Grade 3',
    criteriaCount: '4-6 criteria',
    performanceDescriptors: 'Detailed performance levels with specific examples',
    pointSystem: '1-5 point scale or percentage ranges if using point values'
  },
  '4': {
    name: 'Grade 4',
    criteriaCount: '5-7 criteria',
    performanceDescriptors: 'Comprehensive levels showing progression of mastery',
    pointSystem: '1-5 point scale with weighted criteria if using point values'
  },
  '5': {
    name: 'Grade 5',
    criteriaCount: '6-8 criteria',
    performanceDescriptors: 'Detailed analytical rubric with clear distinctions',
    pointSystem: '1-10 point scale or percentage ranges with weighted categories'
  },
  '6': {
    name: 'Grade 6',
    criteriaCount: '6-10 criteria',
    performanceDescriptors: 'Sophisticated analytical rubric with nuanced distinctions',
    pointSystem: 'Weighted scale with detailed point allocations (e.g., 1-20 per criterion)'
  }
};

// Helper function to normalize grade level format
function normalizeGradeLevel(gradeLevel: string): keyof typeof GRADE_SPECS {
  // Remove "Grade " prefix if present
  const normalized = gradeLevel.replace(/^Grade\s*/i, '').trim();
  
  // Handle Kindergarten
  if (normalized.toLowerCase().startsWith('k')) {
    return 'K';
  }
  
  // Return the number as string
  return normalized as keyof typeof GRADE_SPECS;
}

export function buildRubricPrompt(formData: RubricFormData): string {
  const gradeKey = normalizeGradeLevel(formData.gradeLevel);
  const gradeSpec = GRADE_SPECS[gradeKey];
  
  // Parse performance levels
  const levels = formData.performanceLevels.split(',').map(l => l.trim());
  
  // Build example table header
  const tableHeader = `| Criteria | ${levels.join(' | ')} |`;
  const tableSeparator = `| --- | ${levels.map(() => '---').join(' | ')} |`;
  
  const prompt = `Create an assessment rubric for Grade ${formData.gradeLevel} students.

ASSIGNMENT: ${formData.assignmentType}
SUBJECT: ${formData.subject}
PERFORMANCE LEVELS: ${formData.performanceLevels}
${formData.includePointValues ? 'INCLUDE POINT VALUES: Yes' : 'INCLUDE POINT VALUES: No'}

GRADE LEVEL REQUIREMENTS:
- Criteria Count: ${gradeSpec.criteriaCount}
- Performance Descriptors: ${gradeSpec.performanceDescriptors}
${formData.includePointValues ? `- Point System: ${gradeSpec.pointSystem}` : ''}

**CRITICAL: OUTPUT FORMAT**

You MUST create a markdown table using the pipe character (|). This format is REQUIRED and NON-NEGOTIABLE.

Example table structure:
${tableHeader}
${tableSeparator}
| [Criterion Name]${formData.includePointValues ? ' (X pts)' : ''} | [descriptor] | [descriptor] | [descriptor] | ${levels.length > 3 ? '[descriptor] |' : ''}

RUBRIC STRUCTURE:

1. **Title and Overview**
   - Assignment title and brief description
   - Grade level: ${formData.gradeLevel}, Subject: ${formData.subject}

2. **Criteria Table** (${gradeSpec.criteriaCount})
   Create a markdown table with ${levels.length} performance levels: ${levels.join(', ')}
   
   For each criterion row:
   - First column: Criterion name${formData.includePointValues ? ' with points (e.g., "Organization (5 pts)")' : ''}
   - Following columns: Clear performance descriptor for each level
   - Descriptors must show clear progression from lowest to highest
   ${formData.includePointValues ? `- Point values follow ${gradeSpec.pointSystem}` : ''}

3. **Scoring Summary**
   ${formData.includePointValues ? '- Total points possible\n   - Grading scale (optional)' : '- Success criteria for the assignment'}

Generate the complete rubric using the markdown table format described above:`;

  return prompt;
}

export default buildRubricPrompt;