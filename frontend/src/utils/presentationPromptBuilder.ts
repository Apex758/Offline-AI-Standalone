import { buildCurriculumPromptSection } from './curriculumPromptSection';
import { GRADE_AGE_MAP } from './gradeSpecs';
import { getLanguageInstruction } from './languageInstruction';

export interface PresentationFormData {
  subject: string;
  gradeLevel: string;
  topic: string;
  strand: string;
  essentialOutcomes: string;
  specificOutcomes: string;
  duration: string;
  studentCount: string;
  additionalInstructions: string;
}

export interface ParsedLessonInput {
  metadata?: {
    title?: string;
    subject?: string;
    grade?: string;
    strand?: string;
    topic?: string;
    duration?: string;
  };
  learningObjectives?: string[];
  materials?: string[];
  sections?: Array<{ id?: string; name?: string; content?: string }>;
  assessmentMethods?: string[];
  curriculumReferences?: Array<{
    id?: string;
    displayName?: string;
    essentialOutcomes?: Array<string | { id: string; text: string }>;
    specificOutcomes?: Array<string | { id: string; text: string; eloRef?: string }>;
  }>;
}

/**
 * Build a prompt for generating presentation slides from form data (scratch mode).
 */
export function buildPresentationPromptFromForm(formData: PresentationFormData, includeImages?: boolean, slideCount?: number, presentationMode?: 'kids' | 'professional', imageMode?: string, language?: string): string {
  const sc = slideCount || 8;
  const isKids = presentationMode === 'kids';
  const curriculumSection = buildCurriculumPromptSection(
    formData.essentialOutcomes || '',
    formData.specificOutcomes || '',
    'lesson'
  );

  const ageRange = GRADE_AGE_MAP[formData.gradeLevel] || '';

  const prompt = `Convert the following lesson information into a structured presentation slide deck.
Return ONLY valid JSON — no markdown, no code fences, no explanation.

LESSON DETAILS:
Subject: ${formData.subject}
Grade Level: ${formData.gradeLevel}${ageRange ? ` (students typically aged ${ageRange})` : ''}
Topic: ${formData.topic}
Strand: ${formData.strand}
Duration: ${formData.duration} minutes
Class Size: ${formData.studentCount} students
${curriculumSection}
${formData.additionalInstructions ? `ADDITIONAL INSTRUCTIONS: ${formData.additionalInstructions}\n` : ''}
JSON SCHEMA:
{"slides":[{"id":"s1","layout":"title|objectives|hook|instruction|activity|assessment|closing","content":{"headline":"string","subtitle":"string","badge":"string","body":"string","bullets":["string"]${includeImages ? ',"imagePlacement":"right|left|top|half|background|bottom-right|none","imageScene":"string (optional, short scene description for image)"' : ''}}}]}

RULES:
- headline: max 7 words, clear and engaging
- bullets: max 12 words each, max 3-4 bullets per slide
- Generate exactly ${sc} slides
- Slide order: title (1) → objectives (1) → hook (1) → ${Math.max(1, sc - 6)} instruction slide(s) → activity (1) → assessment (1) → closing (1)${sc <= 6 ? '\n- With fewer slides, combine assessment into closing slide' : ''}${sc >= 12 ? '\n- With more slides, add more instruction sub-topics and consider splitting activity into guided + independent practice' : ''}
- Title slide: headline = topic, subtitle = "Grade ${formData.gradeLevel} · ${formData.subject}", badge = "Grade ${formData.gradeLevel} · ${formData.subject}"
- Objectives slide: 2-3 clear learning objectives as bullets
- Hook slide: an engaging question or scenario as headline, body text for context
- Instruction slides: break key concepts into digestible chunks with bullets
- Activity slide: student activity description with steps as bullets
- Assessment slide: assessment method with criteria as bullets
- Closing slide: summary and takeaway as headline, review points as bullets
- Make content grade-appropriate for Grade ${formData.gradeLevel} students
- Keep language clear and educational${isKids ? `
- IMPORTANT: This presentation is FOR STUDENTS (typically aged ${ageRange || formData.gradeLevel}) to view in the classroom. Write as if you are TEACHING the students directly.
- Use simple, age-appropriate language that Grade ${formData.gradeLevel} students can understand
- Include interactive prompts like "Can you think of...?", "Let's try...", "Turn to your partner and...", "What do you notice?"
- Make hook slides genuinely engaging with fun questions or surprising facts
- Activity slides should have clear, step-by-step student instructions
- Use encouraging, warm tone throughout — make learning feel exciting` : `
- This is a PROFESSIONAL teacher reference presentation for students aged ${ageRange || formData.gradeLevel} — formal, structured, and information-dense
- Use precise academic language and proper terminology
- Focus on clear delivery of content, key concepts, and curriculum alignment
- Keep tone neutral and professional — suitable for staff meetings or parent presentations
- Include data points, standards references, and measurable outcomes where relevant`}${includeImages && imageMode === 'suggested' ? `
- imageScene: Include on about HALF the slides. Write a DESCRIPTIVE image suggestion (15-25 words) that a teacher could use to find or create an appropriate image. Example: "A colorful diagram showing the water cycle with arrows indicating evaporation, condensation, and precipitation". Include imageScene on: title slide, hook slide, and 1-2 instruction slides. Do NOT include imageScene on: objectives slide, closing slide, or text-heavy assessment slides. Slides WITHOUT imageScene should NOT have imagePlacement.
- imagePlacement: ONLY set on slides that HAVE imageScene. RANDOMLY pick positions each time — do NOT always use the same pattern. Options: "background" or "half" for title slides (pick randomly), "right"/"left"/"top" for content slides (pick randomly but no same position consecutively), "bottom-right" for activity slides. Each generation should feel different.` : includeImages ? `
- imageScene: ONLY include on about HALF the slides. Write a SHORT scene description (8-15 words) for what the image should depict, e.g. "cartoon boy looking through magnifying glass at colorful flower". Include imageScene on: title slide, hook slide, and 1-2 instruction slides. Do NOT include imageScene on: objectives slide, closing slide, or text-heavy assessment slides. Slides WITHOUT imageScene should NOT have imagePlacement.
- imagePlacement: ONLY set on slides that HAVE imageScene. RANDOMLY pick positions each time — do NOT always use the same pattern. Options: "background" or "half" for title slides (pick randomly), "right"/"left"/"top" for content slides (pick randomly but no same position consecutively), "bottom-right" for activity slides. Each generation should feel different.` : ''}`;

  return prompt + getLanguageInstruction(language);
}

/**
 * Build a prompt for generating presentation slides from a free-form user prompt.
 * Not tied to curriculum structure — allows any topic or purpose.
 */
export function buildPresentationPromptFromFreeInput(
  freePrompt: string,
  includeImages?: boolean,
  slideCount?: number,
  presentationMode?: 'kids' | 'professional',
  imageMode?: string,
  language?: string
): string {
  const sc = slideCount || 8;
  const isKids = presentationMode === 'kids';

  const prompt = `Create a structured presentation slide deck based on the following request.
Return ONLY valid JSON — no markdown, no code fences, no explanation.

USER REQUEST:
${freePrompt}

JSON SCHEMA:
{"slides":[{"id":"s1","layout":"title|objectives|hook|instruction|activity|assessment|closing","content":{"headline":"string","subtitle":"string","badge":"string","body":"string","bullets":["string"]${includeImages ? ',"imagePlacement":"right|left|top|half|background|bottom-right|none","imageScene":"string (optional, short scene description for image)"' : ''}}}]}

RULES:
- headline: max 7 words, clear and engaging
- bullets: max 12 words each, max 3-4 bullets per slide
- Generate exactly ${sc} slides
- First slide must be layout "title" with a strong headline and descriptive subtitle
- Last slide must be layout "closing" with a summary or call-to-action
- Middle slides: choose the BEST layout for each piece of content. Use "instruction" for informational content, "hook" for engaging questions, "objectives" for goals/key points, "activity" for interactive elements, "assessment" for evaluation criteria. Mix layouts for variety.
- badge: a short label for the presentation topic (e.g. "Marketing", "Science", "Team Update")
- Organize content logically — build a narrative arc from introduction to conclusion${isKids ? `
- Use fun, engaging, age-appropriate language
- Include interactive prompts like "Can you think of...?", "Let's try...", "What do you notice?"
- Make it colorful and exciting in tone — keep learning playful` : `
- Use clear, professional language
- Keep tone polished and structured
- Focus on delivering key information concisely`}${includeImages && imageMode === 'suggested' ? `
- imageScene: Include on about HALF the slides. Write a DESCRIPTIVE image suggestion (15-25 words) for a relevant visual. Include imageScene on: title slide and 2-3 content slides. Do NOT include imageScene on text-heavy or closing slides. Slides WITHOUT imageScene should NOT have imagePlacement.
- imagePlacement: ONLY set on slides that HAVE imageScene. RANDOMLY pick positions — do NOT repeat the same position consecutively. Options: "background" or "half" for title slides, "right"/"left"/"top" for content slides, "bottom-right" for smaller accent images.` : includeImages ? `
- imageScene: ONLY include on about HALF the slides. Write a SHORT scene description (8-15 words) for what the image should depict. Include imageScene on: title slide and 2-3 content slides. Do NOT include imageScene on text-heavy or closing slides. Slides WITHOUT imageScene should NOT have imagePlacement.
- imagePlacement: ONLY set on slides that HAVE imageScene. RANDOMLY pick positions — do NOT repeat the same position consecutively. Options: "background" or "half" for title slides, "right"/"left"/"top" for content slides, "bottom-right" for smaller accent images.` : ''}`;

  return prompt + getLanguageInstruction(language);
}

/**
 * Build a prompt for generating presentation slides from an existing parsed lesson plan.
 */
export function buildPresentationPromptFromLesson(lesson: ParsedLessonInput, rawContent?: string, formFallback?: Partial<PresentationFormData>, includeImages?: boolean, slideCount?: number, presentationMode?: 'kids' | 'professional', imageMode?: string, language?: string): string {
  const sc = slideCount || 8;
  const isKids = presentationMode === 'kids';
  const fb = formFallback || {};
  const meta = {
    ...(lesson.metadata || {}),
    subject: lesson.metadata?.subject || fb.subject || 'General',
    grade: lesson.metadata?.grade || fb.gradeLevel || 'K-6',
    topic: lesson.metadata?.topic || fb.topic || 'Lesson',
  };
  const objectives = (lesson.learningObjectives || []).join('\n- ');
  const sections = (lesson.sections || [])
    .map(s => `${s.name || 'Section'}:\n${s.content || ''}`)
    .join('\n\n');
  const assessments = (lesson.assessmentMethods || []).join(', ');

  let curriculumRef = '';
  if (lesson.curriculumReferences && lesson.curriculumReferences.length > 0) {
    const ref = lesson.curriculumReferences[0];
    const elo = ref.essentialOutcomes?.[0];
    curriculumRef = `\nCurriculum Reference: ${ref.displayName || ''}`;
    if (elo) {
      curriculumRef += `\nEssential Outcome: ${typeof elo === 'string' ? elo : elo.text}`;
    }
  }

  const lessonAgeRange = GRADE_AGE_MAP[meta.grade] || GRADE_AGE_MAP[fb.gradeLevel || ''] || '';

  const prompt = `Convert this complete lesson plan into a structured presentation slide deck.
Return ONLY valid JSON — no markdown, no code fences, no explanation.

LESSON PLAN:
Title: ${meta.title || meta.topic || 'Lesson'}
Subject: ${meta.subject}
Grade: ${meta.grade}${lessonAgeRange ? ` (students typically aged ${lessonAgeRange})` : ''}
Strand: ${meta.strand || ''}
Topic: ${meta.topic}
Duration: ${meta.duration || ''}
${curriculumRef}

LEARNING OBJECTIVES:
- ${objectives || 'Not specified'}

LESSON CONTENT:
${rawContent ? rawContent.slice(0, 3000) : sections.slice(0, 3000)}

ASSESSMENT:
${assessments || 'Not specified'}

JSON SCHEMA:
{"slides":[{"id":"s1","layout":"title|objectives|hook|instruction|activity|assessment|closing","content":{"headline":"string","subtitle":"string","badge":"string","body":"string","bullets":["string"]${includeImages ? ',"imagePlacement":"right|left|top|half|background|bottom-right|none","imageScene":"string (optional, short scene description for image)"' : ''}}}]}

RULES:
- headline: max 7 words, clear and engaging
- bullets: max 12 words each, max 3-4 bullets per slide
- Generate exactly ${sc} slides
- Slide order: title (1) → objectives (1) → hook (1) → ${Math.max(1, sc - 6)} instruction slide(s) → activity (1) → assessment (1) → closing (1)${sc <= 6 ? '\n- With fewer slides, combine assessment into closing slide' : ''}${sc >= 12 ? '\n- With more slides, add more instruction sub-topics and consider splitting activity into guided + independent practice' : ''}
- Title slide: headline = topic, subtitle = "Grade ${meta.grade || 'K-6'} · ${meta.subject || 'General'}", badge = "Grade ${meta.grade || 'K-6'} · ${meta.subject || 'General'}"
- Objectives slide: use the actual learning objectives from the lesson plan as bullets
- Hook slide: extract the hook/introduction from the lesson as an engaging question
- Instruction slides: break the direct instruction content into digestible chunks with bullets
- Activity slide: use the guided/independent practice activities with steps as bullets
- Assessment slide: use the actual assessment methods from the lesson plan
- Closing slide: summary and review points from the lesson closure
- Make content grade-appropriate for Grade ${meta.grade || 'K-6'} students
- Keep language clear and educational
- Use the ACTUAL content from the lesson plan — do not make up new content${isKids ? `
- IMPORTANT: This presentation is FOR STUDENTS (typically aged ${lessonAgeRange || meta.grade || 'K-6'}) to view in the classroom. Write as if you are TEACHING the students directly.
- Use simple, age-appropriate language that Grade ${meta.grade || 'K-6'} students can understand
- Include interactive prompts like "Can you think of...?", "Let's try...", "Turn to your partner and...", "What do you notice?"
- Make hook slides genuinely engaging with fun questions or surprising facts
- Activity slides should have clear, step-by-step student instructions
- Use encouraging, warm tone throughout — make learning feel exciting` : `
- This is a PROFESSIONAL teacher reference presentation for students aged ${lessonAgeRange || meta.grade || 'K-6'} — formal, structured, and information-dense
- Use precise academic language and proper terminology
- Focus on clear delivery of content, key concepts, and curriculum alignment
- Keep tone neutral and professional — suitable for staff meetings or parent presentations
- Include data points, standards references, and measurable outcomes where relevant`}${includeImages && imageMode === 'suggested' ? `
- imageScene: Include on about HALF the slides. Write a DESCRIPTIVE image suggestion (15-25 words) that a teacher could use to find or create an appropriate image. Example: "A colorful diagram showing the water cycle with arrows indicating evaporation, condensation, and precipitation". Include imageScene on: title slide, hook slide, and 1-2 instruction slides. Do NOT include imageScene on: objectives slide, closing slide, or text-heavy assessment slides. Slides WITHOUT imageScene should NOT have imagePlacement.
- imagePlacement: ONLY set on slides that HAVE imageScene. RANDOMLY pick positions each time — do NOT always use the same pattern. Options: "background" or "half" for title slides (pick randomly), "right"/"left"/"top" for content slides (pick randomly but no same position consecutively), "bottom-right" for activity slides. Each generation should feel different.` : includeImages ? `
- imageScene: ONLY include on about HALF the slides. Write a SHORT scene description (8-15 words) for what the image should depict, e.g. "cartoon boy looking through magnifying glass at colorful flower". Include imageScene on: title slide, hook slide, and 1-2 instruction slides. Do NOT include imageScene on: objectives slide, closing slide, or text-heavy assessment slides. Slides WITHOUT imageScene should NOT have imagePlacement.
- imagePlacement: ONLY set on slides that HAVE imageScene. RANDOMLY pick positions each time — do NOT always use the same pattern. Options: "background" or "half" for title slides (pick randomly), "right"/"left"/"top" for content slides (pick randomly but no same position consecutively), "bottom-right" for activity slides. Each generation should feel different.` : ''}`;

  return prompt + getLanguageInstruction(language);
}
