interface RubricFormData {
  assignmentType: string;
  subject: string;
  gradeLevel: string;
  performanceLevels: string;
  includePointValues: boolean;
}

// Map number of levels to standard descriptive names
const PERFORMANCE_LEVEL_NAMES: { [key: string]: string[] } = {
  '3': ['Excellent', 'Proficient', 'Beginning'],
  '4': ['Excellent', 'Proficient', 'Developing', 'Beginning'],
  '5': ['Excellent', 'Proficient', 'Developing', 'Emerging', 'Beginning'],
  '6': ['Advanced', 'Excellent', 'Proficient', 'Developing', 'Emerging', 'Beginning']
};

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
  
  // Get descriptive performance level names based on count
  const levelCount = formData.performanceLevels || '4';
  const levels = PERFORMANCE_LEVEL_NAMES[levelCount] || PERFORMANCE_LEVEL_NAMES['4'];
  
  // Build example table header
  const tableHeader = `| Criteria | ${levels.join(' | ')} |`;
  const tableSeparator = `| --- | ${levels.map(() => '---').join(' | ')} |`;
  
  const prompt = `Create an assessment rubric for ${formData.gradeLevel} students.

ASSIGNMENT DETAILS:
- Title: ${formData.assignmentTitle}
- Type: ${formData.assignmentType}
- Subject: ${formData.subject}
- Learning Objectives: ${formData.learningObjectives}
${formData.specificRequirements ? `- Requirements: ${formData.specificRequirements}` : ''}
${formData.focusAreas.length > 0 ? `- Focus Areas: ${formData.focusAreas.join(', ')}` : ''}

RUBRIC REQUIREMENTS:
- Number of Criteria: ${gradeSpec.criteriaCount}
- Performance Levels: ${levels.join(', ')}
- Descriptors: ${gradeSpec.performanceDescriptors}
${formData.includePointValues ? `- Point System: ${gradeSpec.pointSystem}\n- Points decrease from left (highest) to right (lowest)` : '- Do NOT include point values'}

**CRITICAL OUTPUT FORMAT - FOLLOW EXACTLY:**

1. Start with a title line: "**${formData.assignmentTitle} - Assessment Rubric**"

2. Then create a clean markdown table with this EXACT structure:
${tableHeader}
${tableSeparator}

3. For each criterion row:
   - First column: Criterion name ONLY (no points)
   - Each following column: Clear descriptor${formData.includePointValues ? ' with point value in parentheses at the END (e.g., "Description here (25 pts)")' : ''}
   - Descriptors MUST show clear progression from ${levels[0]} (highest) to ${levels[levels.length - 1]} (lowest)
   ${formData.includePointValues ? `- Point values MUST decrease from left to right (e.g., 25 pts, 20 pts, 15 pts, 10 pts)` : ''}

4. After the table, add a "**Scoring Summary**" section:
${formData.includePointValues ? `   - Total possible points (sum of highest points per criterion)
   - Grading scale with letter grades` : `   - Overall success criteria`}

**EXAMPLE TABLE ROW (${formData.includePointValues ? 'WITH' : 'WITHOUT'} POINTS):**
${formData.includePointValues 
  ? '| Content Knowledge | Demonstrates comprehensive understanding of all key concepts with accurate details (25 pts) | Demonstrates good understanding of most key concepts with minor gaps (20 pts) | Shows basic understanding but with some misconceptions or gaps (15 pts) | Shows limited understanding with significant gaps or misconceptions (10 pts) |'
  : '| Content Knowledge | Demonstrates comprehensive understanding of all key concepts with accurate details | Demonstrates good understanding of most key concepts with minor gaps | Shows basic understanding but with some misconceptions or gaps | Shows limited understanding with significant gaps or misconceptions |'
}

Generate the complete rubric now. Start directly with the title - no preamble or explanation.`;

  return prompt;
}

export default buildRubricPrompt;