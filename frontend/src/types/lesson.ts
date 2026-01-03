// Types for lesson plan structure
export interface LessonSection {
  id: string;
  name: string;
  content: string;
}

export interface LessonMetadata {
  title: string;
  subject: string;
  gradeLevel: string;
  strand: string;
  topic: string;
  duration: string;
  studentCount: string;
  date?: string;
}

export interface ParsedLesson {
  metadata: LessonMetadata;
  learningObjectives: string[];
  materials: string[];
  sections: LessonSection[];
  assessmentMethods: string[];
  pedagogicalStrategies?: string[];
  learningStyles?: string[];
  prerequisites?: string;
  specialNeeds?: string;
  additionalNotes?: string;
  curriculumReferences?: any[];
}

// Curriculum reference interface
interface CurriculumReference {
  id: string;
  displayName: string;
  grade: string;
  subject: string;
  strand: string;
  route: string;
  keywords?: string[];
  essentialOutcomes?: string[];
  specificOutcomes?: string[];
}

// Form data interface for parsing context
interface LessonFormData {
  topic: string;
  subject: string;
  gradeLevel: string;
  strand: string;
  duration: string;
  studentCount: string;
  specificOutcomes?: string;
  materials?: string;
  prerequisiteSkills?: string;
  specialNeeds?: boolean;
  specialNeedsDetails?: string;
  additionalInstructions?: string;
  pedagogicalStrategies?: string[];
  learningStyles?: string[];
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Clean initialization messages from AI output
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
  
  return cleanText;
}

/**
 * Extract section content using a regex pattern
 */
function extractSection(text: string, sectionName: string): string {
  // Try multiple patterns to catch variations
  const patterns = [
    new RegExp(`\\*\\*${sectionName}:?\\*\\*([\\s\\S]*?)(?=\\*\\*[A-Z]|$)`, 'i'),
    new RegExp(`${sectionName}:?\\s*\\(.*?\\)([\\s\\S]*?)(?=\\n\\n[A-Z]|$)`, 'i'),
    new RegExp(`${sectionName}([\\s\\S]*?)(?=\\n\\n[A-Z]|$)`, 'i')
  ];
  
  for (const regex of patterns) {
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return '';
}

/**
 * Extract bullet list items from section content
 */
function extractBulletList(sectionContent: string): string[] {
  if (!sectionContent) return [];
  const items: string[] = [];
  const lines = sectionContent.split('\n');
  
  lines.forEach(line => {
    const trimmed = line.trim();
    const bulletMatch = trimmed.match(/^[\*\-•]\s+(.+)/);
    if (bulletMatch) {
      items.push(bulletMatch[1].trim());
    }
  });
  
  return items;
}

/**
 * Extract numbered list items from section content
 */
function extractNumberedList(sectionContent: string): string[] {
  if (!sectionContent) return [];
  const items: string[] = [];
  const lines = sectionContent.split('\n');
  
  lines.forEach(line => {
    const trimmed = line.trim();
    const numberedMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (numberedMatch) {
      items.push(numberedMatch[1].trim());
    }
  });
  
  return items;
}

// ============================================================================
// Main Parsing Function
// ============================================================================

/**
 * Parse lesson plan text content into structured ParsedLesson format
 */
export function parseLessonFromAI(
  text: string, 
  formData: LessonFormData, 
  curriculumRefs: CurriculumReference[] = []
): ParsedLesson | null {
  if (!text) return null;

  try {
    const cleanText = cleanAIOutput(text);

    // Extract metadata
    const gradeMatch = cleanText.match(/\*\*Grade Level:\*\*\s*(.+?)(?:\n|$)/i);
    const subjectMatch = cleanText.match(/\*\*Subject:\*\*\s*(.+?)(?:\n|$)/i);
    const strandMatch = cleanText.match(/\*\*Strand:\*\*\s*(.+?)(?:\n|$)/i);
    const topicMatch = cleanText.match(/\*\*Topic:\*\*\s*(.+?)(?:\n|$)/i);
    const durationMatch = cleanText.match(/\*\*Duration:\*\*\s*(.+?)(?:\n|$)/i);
    const dateMatch = cleanText.match(/\*\*Date:\*\*\s*(.+?)(?:\n|$)/i);

    const metadata: LessonMetadata = {
      title: topicMatch ? topicMatch[1].trim() : formData.topic,
      subject: subjectMatch ? subjectMatch[1].trim() : formData.subject,
      gradeLevel: gradeMatch ? gradeMatch[1].trim() : formData.gradeLevel,
      strand: strandMatch ? strandMatch[1].trim() : formData.strand,
      topic: topicMatch ? topicMatch[1].trim() : formData.topic,
      duration: durationMatch ? durationMatch[1].replace(/[^\d]/g, '').trim() : formData.duration,
      studentCount: formData.studentCount,
      date: dateMatch ? dateMatch[1].trim() : new Date().toLocaleDateString()
    };

    // Extract learning objectives
    const objectivesContent = extractSection(cleanText, 'Learning Objectives');
    let learningObjectives = extractBulletList(objectivesContent);
    
    if (learningObjectives.length === 0 && formData.specificOutcomes) {
      learningObjectives = formData.specificOutcomes
        .split('\n')
        .filter(line => line.trim().length > 0);
    }
    if (learningObjectives.length === 0) {
      learningObjectives = ['No objectives specified'];
    }

    // Extract materials
    const materialsContent = extractSection(cleanText, 'Materials');
    let materials = extractBulletList(materialsContent);
    
    if (materials.length === 0 && formData.materials) {
      materials = formData.materials
        .split('\n')
        .filter(line => line.trim().length > 0);
    }
    if (materials.length === 0) {
      materials = ['No materials specified'];
    }

    // Extract lesson sections - CRITICAL PART FOR SECTION RECOGNITION
    const sections: LessonSection[] = [];
    
    // Define all possible section names with their variations
    const sectionDefinitions = [
      { names: ['Introduction/Hook', 'Introduction', 'Hook', 'Warm-up', 'Engagement'], displayName: 'Introduction/Hook' },
      { names: ['Direct Instruction', 'Instruction', 'Teaching', 'Presentation'], displayName: 'Direct Instruction' },
      { names: ['Guided Practice', 'Guided Learning', 'Practice'], displayName: 'Guided Practice' },
      { names: ['Independent Practice', 'Independent Practice/Application', 'Independent Work', 'Application'], displayName: 'Independent Practice' },
      { names: ['Closure', 'Conclusion', 'Wrap-up', 'Summary'], displayName: 'Closure' },
      { names: ['Development', 'Main Activity'], displayName: 'Development' },
      { names: ['Extension Activities', 'Extensions', 'Enrichment'], displayName: 'Extension Activities' },
      { names: ['Differentiation', 'Accommodations'], displayName: 'Differentiation' }
    ];

    sectionDefinitions.forEach((sectionDef, index) => {
      let content = '';
      
      // Try each variation of the section name
      for (const name of sectionDef.names) {
        content = extractSection(cleanText, name);
        if (content && content.length > 0) {
          break; // Found it!
        }
      }
      
      if (content && content.length > 0) {
        // Clean any remaining ** markers from content
        const cleanContent = content.replace(/\*\*/g, '').trim();
        
        sections.push({
          id: `section_${index}`,
          name: sectionDef.displayName,
          content: cleanContent
        });
      }
    });

    // Fallback: if no sections found, create one generic section
    if (sections.length === 0) {
      console.warn('No lesson sections found - creating fallback section');
      sections.push({
        id: 'section_0',
        name: 'Lesson Content',
        content: cleanText.substring(0, 1000) + '...'
      });
    }

    console.log(`Parsed ${sections.length} lesson sections:`, sections.map(s => s.name));

    // Extract assessment methods
    const assessmentContent = extractSection(cleanText, 'Assessment');
    let assessmentMethods = extractBulletList(assessmentContent);
    
    if (assessmentMethods.length === 0 && assessmentContent) {
      assessmentMethods = [assessmentContent];
    }
    if (assessmentMethods.length === 0) {
      assessmentMethods = ['Observation', 'Student work samples', 'Exit ticket'];
    }

    // Extract optional fields
    const prerequisites = extractSection(cleanText, 'Prerequisites') || formData.prerequisiteSkills || undefined;
    const specialNeeds = formData.specialNeeds && formData.specialNeedsDetails
      ? formData.specialNeedsDetails
      : extractSection(cleanText, 'Special Needs Accommodations') || undefined;
    const additionalNotes = formData.additionalInstructions || extractSection(cleanText, 'Additional Notes') || undefined;

    const pedagogicalStrategies = formData.pedagogicalStrategies && formData.pedagogicalStrategies.length > 0
      ? formData.pedagogicalStrategies
      : undefined;
    
    const learningStyles = formData.learningStyles && formData.learningStyles.length > 0
      ? formData.learningStyles
      : undefined;

    return {
      metadata,
      learningObjectives,
      materials,
      sections,
      assessmentMethods,
      pedagogicalStrategies,
      learningStyles,
      prerequisites,
      specialNeeds,
      additionalNotes,
      curriculumReferences: curriculumRefs.length > 0 ? curriculumRefs : undefined
    };
  } catch (error) {
    console.error('Failed to parse lesson plan:', error);
    return null;
  }
}

// ============================================================================
// Display Conversion Functions
// ============================================================================

/**
 * Convert ParsedLesson back to display text format
 */
export function lessonToDisplayText(lesson: ParsedLesson): string {
  let output = '';
  
  // Add metadata header
  output += `**Lesson Plan: ${lesson.metadata.title}**\n\n`;
  output += `**Grade Level:** ${lesson.metadata.gradeLevel}\n`;
  output += `**Subject:** ${lesson.metadata.subject}\n`;
  output += `**Strand:** ${lesson.metadata.strand}\n`;
  output += `**Topic:** ${lesson.metadata.topic}\n`;
  output += `**Duration:** ${lesson.metadata.duration} minutes\n`;
  output += `**Date:** ${lesson.metadata.date}\n\n`;
  
  // Learning Objectives
  output += `**Learning Objectives:**\n`;
  lesson.learningObjectives.forEach(obj => {
    output += `* ${obj}\n`;
  });
  output += '\n';
  
  // Materials
  output += `**Materials Needed:**\n`;
  lesson.materials.forEach(mat => {
    output += `* ${mat}\n`;
  });
  output += '\n';
  
  // Prerequisites if present
  if (lesson.prerequisites) {
    output += `**Prerequisites:**\n${lesson.prerequisites}\n\n`;
  }
  
  // Lesson Sections
  lesson.sections.forEach(section => {
    output += `**${section.name}:**\n`;
    output += `${section.content}\n\n`;
  });
  
  // Assessment Methods
  if (lesson.assessmentMethods.length > 0) {
    output += `**Assessment:**\n`;
    lesson.assessmentMethods.forEach(method => {
      output += `* ${method}\n`;
    });
    output += '\n';
  }
  
  // Pedagogical Strategies if present
  if (lesson.pedagogicalStrategies && lesson.pedagogicalStrategies.length > 0) {
    output += `**Pedagogical Strategies:**\n`;
    output += lesson.pedagogicalStrategies.join(', ') + '\n\n';
  }
  
  // Learning Styles if present
  if (lesson.learningStyles && lesson.learningStyles.length > 0) {
    output += `**Learning Styles:**\n`;
    output += lesson.learningStyles.join(', ') + '\n\n';
  }
  
  // Special Needs if present
  if (lesson.specialNeeds) {
    output += `**Special Needs Accommodations:**\n${lesson.specialNeeds}\n\n`;
  }
  
  // Additional Notes if present
  if (lesson.additionalNotes) {
    output += `**Additional Notes:**\n${lesson.additionalNotes}\n`;
  }
  
  return output;
}

/**
 * Create fallback ParsedLesson from raw text (legacy support)
 */
export function displayTextToLesson(text: string, metadata: LessonMetadata): ParsedLesson {
  return {
    metadata,
    learningObjectives: ['See lesson content'],
    materials: ['See lesson content'],
    sections: [{
      id: `legacy_${Date.now()}`,
      name: 'Lesson Content',
      content: text
    }],
    assessmentMethods: ['See lesson content']
  };
}