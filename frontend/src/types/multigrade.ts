// Types for multigrade lesson plan structure
export interface MultigradeSection {
  id: string;
  name: string;
  content: string;
  gradeSpecific?: {
    grade: string;
    content: string;
  }[];
}

export interface MultigradeMetadata {
  title: string;
  topic: string;
  subject: string;
  gradeLevels: string[];
  duration: string;
  totalStudents: string;
  date?: string;
}

export interface ParsedMultigrade {
  metadata: MultigradeMetadata;
  sharedObjectives: {
    common: string;
    gradeSpecific: { grade: string; objective: string }[];
  };
  materials: {
    shared: string[];
    differentiated: { grade: string; materials: string[] }[];
  };
  sections: MultigradeSection[];
  assessmentStrategies: {
    common: string[];
    gradeSpecific: { grade: string; criteria: string }[];
  };
  differentiationNotes: { grade: string; notes: string }[];
  classroomManagement?: string;
  extensionsAndModifications?: string;
}

// Form data interface
interface MultigradeFormData {
  topic: string;
  subject: string;
  gradeLevels: string[];
  duration: string;
  totalStudents: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Clean AI initialization messages
 */
function cleanAIOutput(text: string): string {
  let cleanText = text;
  const initPatterns = [
    /llama_model_loader[^\n]*/g,
    /llm_load_print_meta[^\n]*/g,
    /system_info[^\n]*/g,
    /Not using system message[^\n]*/g,
    /To change it, set a different value via -sys PROMPT[^\n]*/g,
  ];
  
  initPatterns.forEach(pattern => {
    cleanText = cleanText.replace(pattern, '');
  });
  
  // Remove common AI preambles
  cleanText = cleanText.replace(/^Here is (?:the |a )?(?:complete |detailed )?(?:multigrade )?lesson plan.*?:\s*/i, '');
  cleanText = cleanText.replace(/^Below is (?:the |a )?(?:multigrade )?lesson plan.*?:\s*/i, '');
  
  return cleanText.trim();
}

/**
 * Extract numbered section (e.g., "1. SHARED LEARNING OBJECTIVES")
 */
function extractNumberedSection(text: string, sectionNumber: number): string {
  const regex = new RegExp(`${sectionNumber}\\.\\s+[A-Z\\s]+([\\s\\S]*?)(?=${sectionNumber + 1}\\.|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * Extract subsection (e.g., "A. Opening - WHOLE CLASS")
 */
function extractSubsection(text: string, letter: string): string {
  const regex = new RegExp(`${letter}\\.\\s+([^\\n]+)([\\s\\S]*?)(?=[A-E]\\.|\\d+\\.|$)`, 'i');
  const match = text.match(regex);
  if (match) {
    return `${match[1]}\n${match[2]}`.trim();
  }
  return '';
}

/**
 * Extract grade-specific content (e.g., "Grade 1: [content]")
 */
function extractGradeSpecific(text: string, grades: string[]): { grade: string; content: string }[] {
  const results: { grade: string; content: string }[] = [];
  
  grades.forEach(grade => {
    const patterns = [
      new RegExp(`Grade\\s+${grade}:\\s*([^\\n]+(?:\\n(?!Grade\\s+[K0-9]:)[^\\n]+)*)`, 'gi'),
      new RegExp(`\\*\\s*Grade\\s+${grade}:\\s*([^\\n]+(?:\\n(?!\\*\\s*Grade)[^\\n]+)*)`, 'gi')
    ];
    
    patterns.forEach(regex => {
      const matches = text.matchAll(regex);
      for (const match of matches) {
        if (match[1]) {
          const content = match[1].trim();
          if (content && !results.some(r => r.grade === grade)) {
            results.push({ grade, content });
          }
        }
      }
    });
  });
  
  return results;
}

/**
 * Extract bullet list items
 */
function extractBulletList(text: string): string[] {
  if (!text) return [];
  const items: string[] = [];
  const lines = text.split('\n');
  
  lines.forEach(line => {
    const trimmed = line.trim();
    const bulletMatch = trimmed.match(/^[\*\-•]\s+(.+)/);
    if (bulletMatch) {
      items.push(bulletMatch[1].trim());
    }
  });
  
  return items;
}

// ============================================================================
// Main Parsing Function
// ============================================================================

/**
 * Parse multigrade lesson plan text into structured format
 */
export function parseMultigradeFromAI(
  text: string,
  formData: MultigradeFormData
): ParsedMultigrade | null {
  if (!text) return null;

  try {
    console.log('Starting multigrade parsing...');
    const cleanText = cleanAIOutput(text);
    
    // Extract metadata
    const metadata: MultigradeMetadata = {
      title: formData.topic || 'Multigrade Lesson Plan',
      topic: formData.topic,
      subject: formData.subject,
      gradeLevels: formData.gradeLevels,
      duration: formData.duration,
      totalStudents: formData.totalStudents,
      date: new Date().toLocaleDateString()
    };

    // Extract Section 1: SHARED LEARNING OBJECTIVES
    const objectivesSection = extractNumberedSection(cleanText, 1);
    const commonObjectiveMatch = objectivesSection.match(/[Cc]ommon.*?understanding.*?:([^\n]+(?:\n(?!Grade)[^\n]+)*)/s);
    const commonObjective = commonObjectiveMatch ? commonObjectiveMatch[1].trim() : 'Understanding the topic across all grade levels';
    
    const gradeObjectives = extractGradeSpecific(objectivesSection, formData.gradeLevels);
    
    const sharedObjectives = {
      common: commonObjective,
      gradeSpecific: gradeObjectives.map(go => ({
        grade: go.grade,
        objective: go.content
      }))
    };

    // Extract Section 2: MATERIALS AND RESOURCES
    const materialsSection = extractNumberedSection(cleanText, 2);
    const sharedMaterialsMatch = materialsSection.match(/[Ss]hared materials?.*?:([^\n]+(?:\n(?!Differentiated|Grade)[^\n]+)*)/s);
    const sharedMaterialsList = sharedMaterialsMatch ? extractBulletList(sharedMaterialsMatch[1]) : [];
    
    const differentiatedMaterialsContent = materialsSection.match(/[Dd]ifferentiated materials?.*?:([\\s\\S]*?)(?=\\d+\\.|$)/i);
    const gradeMaterials = differentiatedMaterialsContent 
      ? extractGradeSpecific(differentiatedMaterialsContent[1], formData.gradeLevels)
      : [];
    
    const materials = {
      shared: sharedMaterialsList.length > 0 ? sharedMaterialsList : ['Whiteboard', 'Markers', 'Student materials'],
      differentiated: gradeMaterials.map(gm => ({
        grade: gm.grade,
        materials: extractBulletList(gm.content)
      }))
    };

    // Extract Section 3: LESSON PROCEDURES
    const proceduresSection = extractNumberedSection(cleanText, 3);
    const sections: MultigradeSection[] = [];
    
    const procedureSubsections = ['A', 'B', 'C', 'D'];
    const subsectionNames = ['Opening', 'Direct Instruction', 'Differentiated Activities', 'Synthesis'];
    
    procedureSubsections.forEach((letter, index) => {
      const subsectionContent = extractSubsection(proceduresSection, letter);
      if (subsectionContent && subsectionContent.length > 10) {
        const gradeSpecificContent = extractGradeSpecific(subsectionContent, formData.gradeLevels);
        
        sections.push({
          id: `section_${letter}`,
          name: subsectionNames[index] || `Activity ${letter}`,
          content: subsectionContent,
          gradeSpecific: gradeSpecificContent.length > 0 ? gradeSpecificContent : undefined
        });
      }
    });

    console.log(`Parsed ${sections.length} procedure sections`);

    // Extract Section 4: ASSESSMENT STRATEGIES
    const assessmentSection = extractNumberedSection(cleanText, 4);
    const commonAssessmentMatch = assessmentSection.match(/[Cc]ommon.*?assessment.*?:([^\n]+(?:\n(?!Grade)[^\n]+)*)/s);
    const commonAssessments = commonAssessmentMatch ? extractBulletList(commonAssessmentMatch[1]) : ['Observation', 'Student work samples'];
    
    const gradeAssessments = extractGradeSpecific(assessmentSection, formData.gradeLevels);
    
    const assessmentStrategies = {
      common: commonAssessments,
      gradeSpecific: gradeAssessments.map(ga => ({
        grade: ga.grade,
        criteria: ga.content
      }))
    };

    // Extract Section 5: DIFFERENTIATION ACROSS GRADES
    const differentiationSection = extractNumberedSection(cleanText, 5);
    const differentiationNotes = extractGradeSpecific(differentiationSection, formData.gradeLevels)
      .map(gd => ({
        grade: gd.grade,
        notes: gd.content
      }));

    // Extract Section 6: CLASSROOM MANAGEMENT STRATEGIES
    const managementSection = extractNumberedSection(cleanText, 6);
    const classroomManagement = managementSection || undefined;

    // Extract Section 7: EXTENSIONS AND MODIFICATIONS
    const extensionsSection = extractNumberedSection(cleanText, 7);
    const extensionsAndModifications = extensionsSection || undefined;

    const parsedPlan: ParsedMultigrade = {
      metadata,
      sharedObjectives,
      materials,
      sections,
      assessmentStrategies,
      differentiationNotes,
      classroomManagement,
      extensionsAndModifications
    };

    console.log('Multigrade parsing complete:', {
      sectionsCount: sections.length,
      gradesCount: formData.gradeLevels.length
    });

    return parsedPlan;
  } catch (error) {
    console.error('Failed to parse multigrade plan:', error);
    return null;
  }
}

// ============================================================================
// Display Conversion Functions
// ============================================================================

/**
 * Convert ParsedMultigrade back to display text
 */
export function multigradeToDisplayText(plan: ParsedMultigrade): string {
  let output = '';
  
  // Title
  output += `# ${plan.metadata.title}\n\n`;
  output += `**Subject:** ${plan.metadata.subject} | `;
  output += `**Grades:** ${plan.metadata.gradeLevels.join(', ')} | `;
  output += `**Duration:** ${plan.metadata.duration} | `;
  output += `**Students:** ${plan.metadata.totalStudents}\n\n`;
  output += `---\n\n`;
  
  // 1. Shared Learning Objectives
  output += `## 1. SHARED LEARNING OBJECTIVES\n\n`;
  output += `**Common Understanding:** ${plan.sharedObjectives.common}\n\n`;
  output += `**Grade-Specific Objectives:**\n`;
  plan.sharedObjectives.gradeSpecific.forEach(gs => {
    output += `* **Grade ${gs.grade}:** ${gs.objective}\n`;
  });
  output += '\n';
  
  // 2. Materials and Resources
  output += `## 2. MATERIALS AND RESOURCES\n\n`;
  output += `**Shared Materials:**\n`;
  plan.materials.shared.forEach(mat => {
    output += `* ${mat}\n`;
  });
  output += '\n';
  
  if (plan.materials.differentiated.length > 0) {
    output += `**Differentiated Materials:**\n`;
    plan.materials.differentiated.forEach(dm => {
      output += `* **Grade ${dm.grade}:**\n`;
      dm.materials.forEach(mat => {
        output += `  - ${mat}\n`;
      });
    });
    output += '\n';
  }
  
  // 3. Lesson Procedures
  output += `## 3. LESSON PROCEDURES\n\n`;
  plan.sections.forEach((section, index) => {
    const letter = String.fromCharCode(65 + index); // A, B, C, D
    output += `### ${letter}. ${section.name}\n\n`;
    output += `${section.content}\n\n`;
    
    if (section.gradeSpecific && section.gradeSpecific.length > 0) {
      output += `**Grade-Specific Activities:**\n`;
      section.gradeSpecific.forEach(gs => {
        output += `* **Grade ${gs.grade}:** ${gs.content}\n`;
      });
      output += '\n';
    }
  });
  
  // 4. Assessment Strategies
  output += `## 4. ASSESSMENT STRATEGIES\n\n`;
  output += `**Common Assessment:**\n`;
  plan.assessmentStrategies.common.forEach(assess => {
    output += `* ${assess}\n`;
  });
  output += '\n';
  
  if (plan.assessmentStrategies.gradeSpecific.length > 0) {
    output += `**Grade-Specific Success Criteria:**\n`;
    plan.assessmentStrategies.gradeSpecific.forEach(gs => {
      output += `* **Grade ${gs.grade}:** ${gs.criteria}\n`;
    });
    output += '\n';
  }
  
  // 5. Differentiation Across Grades
  if (plan.differentiationNotes.length > 0) {
    output += `## 5. DIFFERENTIATION ACROSS GRADES\n\n`;
    plan.differentiationNotes.forEach(dn => {
      output += `### Grade ${dn.grade}\n\n${dn.notes}\n\n`;
    });
  }
  
  // 6. Classroom Management
  if (plan.classroomManagement) {
    output += `## 6. CLASSROOM MANAGEMENT STRATEGIES\n\n`;
    output += `${plan.classroomManagement}\n\n`;
  }
  
  // 7. Extensions and Modifications
  if (plan.extensionsAndModifications) {
    output += `## 7. EXTENSIONS AND MODIFICATIONS\n\n`;
    output += `${plan.extensionsAndModifications}\n\n`;
  }
  
  return output;
}

/**
 * Create fallback ParsedMultigrade from raw text
 */
export function displayTextToMultigrade(
  text: string, 
  metadata: MultigradeMetadata
): ParsedMultigrade {
  return {
    metadata,
    sharedObjectives: {
      common: 'See lesson content',
      gradeSpecific: metadata.gradeLevels.map(grade => ({
        grade,
        objective: 'See lesson content'
      }))
    },
    materials: {
      shared: ['See lesson content'],
      differentiated: []
    },
    sections: [{
      id: `legacy_${Date.now()}`,
      name: 'Lesson Content',
      content: text
    }],
    assessmentStrategies: {
      common: ['See lesson content'],
      gradeSpecific: []
    },
    differentiationNotes: []
  };
}