import type { StorybookFormData } from '../types/storybook';
import type { ImageMode } from '../types';

// ─── Grade Specs ─────────────────────────────────────────────────────────────

const GRADE_SPECS = {
  K: {
    name: 'Kindergarten',
    age: '5-6 years',
    sentences: '2-3 simple sentences per page',
    sentenceLength: '3-5 words each',
    vocabulary: 'Sight words only (e.g., the, is, a, and, big, little, run, play)',
    dialogue: 'Very short — 3-5 words max per line (e.g., "Come play with me!")',
    style: 'Repetitive patterns, rhyming encouraged, single clear idea per page',
  },
  '1': {
    name: 'Grade 1',
    age: '6-7 years',
    sentences: '3-4 sentences per page',
    sentenceLength: '5-8 words each',
    vocabulary: 'Basic academic vocabulary, simple descriptive words, common verbs',
    dialogue: 'Short sentences — up to 8 words (e.g., "I want to find the lost ball.")',
    style: 'Simple plot with clear cause-and-effect, some repetition, friendly tone',
  },
  '2': {
    name: 'Grade 2',
    age: '7-8 years',
    sentences: '4-5 sentences per page',
    sentenceLength: '6-10 words, some compound sentences',
    vocabulary: 'Grade 2 academic words, descriptive adjectives, simple adverbs',
    dialogue: 'Full sentences — up to 12 words with emotion/expression cues',
    style: 'Clear story arc (beginning/middle/end), characters show feelings, some problem-solving',
  },
};

// ─── Style Suffix ─────────────────────────────────────────────────────────────

/** Used for ALL AI image generation in storybook — must match bundled SVG backgrounds */
export const STORYBOOK_STYLE_SUFFIX =
  'flat vector illustration, children\'s book style, bold outlines, pastel colors, bright and cheerful, simple shapes, no text';

// ─── Image Mode Instructions ──────────────────────────────────────────────────

function buildImageInstructions(imageMode: ImageMode): string {
  switch (imageMode) {
    case 'ai':
      return `For each page, provide:
- "characterScene": a short 8-15 word image prompt describing the character(s) action/pose (e.g., "a golden puppy jumping joyfully in green grass"). This will be sent to an AI image generator.
- "imagePlacement": either "left" or "right" — alternate between pages for visual variety.
- "characterAnimation": one of slideInLeft, slideInRight, bounceIn, fadeIn, zoomIn (match direction with imagePlacement).`;

    case 'suggested':
      return `For each page, provide:
- "characterScene": a 15-25 word description of what image would best illustrate this page (e.g., "A small golden puppy with a red collar looking up at a tall tree, surprised expression, outdoor setting"). This guides the teacher in finding or creating an image.
- "imagePlacement": either "left" or "right" — alternate between pages.
- "characterAnimation": one of slideInLeft, slideInRight, bounceIn, fadeIn, zoomIn.`;

    case 'my-images':
      return `For each page, provide:
- "characterScene": a brief description of what kind of image the teacher should place here (e.g., "Teacher image: character exploring the park").
- "imagePlacement": either "left" or "right" — alternate between pages.
- "characterAnimation": one of slideInLeft, slideInRight, bounceIn, fadeIn, zoomIn.`;

    case 'none':
    default:
      return `For each page, provide:
- "characterScene": a very brief scene note for context only (e.g., "Park scene — no image needed").
- "imagePlacement": "none".
- "characterAnimation": "fadeIn".`;
  }
}

// ─── Main Builder ─────────────────────────────────────────────────────────────

// ─── Curriculum Block Builder ─────────────────────────────────────────────────

function buildCurriculumBlock(formData: StorybookFormData): string {
  const hasCurriculum = formData.useCurriculum && formData.strand;
  if (!hasCurriculum && !formData.subject) return '';

  const lines: string[] = [];
  lines.push('CURRICULUM ALIGNMENT:');
  if (formData.subject) lines.push(`Subject: ${formData.subject}`);
  if (formData.strand) lines.push(`Strand: ${formData.strand}`);
  if (formData.essentialOutcomes) lines.push(`Essential Learning Outcome: ${formData.essentialOutcomes}`);
  if (formData.specificOutcomes) {
    const scos = formData.specificOutcomes.split('\n').filter(s => s.trim());
    if (scos.length > 0) {
      lines.push('Specific Curriculum Outcomes:');
      scos.forEach(sco => lines.push(`  - ${sco}`));
    }
  }

  lines.push('');
  lines.push('Use the curriculum information above to shape the story\'s core message and learning moments:');
  lines.push('- The story should naturally teach or reinforce the SCOs through its narrative');
  lines.push('- Do NOT lecture — embed the learning in the characters\' actions, discoveries, or dialogue');
  lines.push('- Keep the story fun and engaging; the curriculum is the invisible backbone, not a lesson plan');
  lines.push('- Generate "learningObjectiveSummary": one sentence summarising what students will have learned by the end');
  lines.push('- Generate "comprehensionQuestions": 4-6 questions teachers can ask after reading');
  lines.push('  - Mix literal recall, inferential, and connection-to-classwork question types');
  lines.push('  - Include a brief expected answer/discussion point for each');
  lines.push('  - For curriculum-aligned questions, include an "outcomeRef" matching the SCO it targets');

  return lines.join('\n');
}

// ─── Main Builder ─────────────────────────────────────────────────────────────

export function buildStorybookPrompt(formData: StorybookFormData): string {
  const grade = formData.gradeLevel;
  const spec = GRADE_SPECS[grade];
  const hasMultipleSpeakers = formData.speakerCount > 1;

  // Build speaker config description
  const speakerLines = formData.speakers.map(s => {
    const name = s.characterName ? `"${s.characterName}"` : s.role;
    return `  - ${s.role === 'narrator' ? 'Narrator' : name} (voice: ${s.voice})`;
  }).join('\n');

  const speakerInstruction = hasMultipleSpeakers
    ? `SPEAKERS (${formData.speakerCount} total):
${speakerLines}
Tag every text segment with the correct speaker name. Narrator reads scene/action text. Characters only speak in dialogue.`
    : `SPEAKER: Single narrator only. All text uses speaker: "narrator".`;

  const imageInstructions = buildImageInstructions(formData.imageMode);
  const curriculumBlock = buildCurriculumBlock(formData);
  const hasCurriculum = formData.useCurriculum && formData.strand;

  return `You are a children's storybook author specializing in ${spec.name} (${spec.age}) literacy.

TASK: Write a complete illustrated storybook based on the teacher's description below.

STORY REQUEST:
Title: "${formData.title}"
Description: ${formData.description}
Grade Level: ${spec.name} (${spec.age})${formData.subject ? `\nSubject: ${formData.subject}` : ''}
Total Pages: ${formData.pageCount}

${curriculumBlock ? curriculumBlock + '\n\n' : ''}WRITING RULES:
- ${spec.sentences}
- Sentence length: ${spec.sentenceLength}
- Vocabulary: ${spec.vocabulary}
- Dialogue style: ${spec.dialogue}
- Story style: ${spec.style}
- Keep language warm, positive, and encouraging
- Each page must have ONE clear moment or action — do not pack too much into a page
- Introduce characters naturally on early pages
- Build to a simple, satisfying conclusion

${speakerInstruction}

SCENE GROUPING:
- Identify 2-5 unique locations/settings in the story
- Assign each a short sceneId (e.g., "park", "home", "school")
- Multiple pages that take place in the same location must share the same sceneId
- Provide a brief "description" for each scene (15-20 words) that describes the setting visually

IMAGE INSTRUCTIONS:
${imageInstructions}
- textAnimation: always "fadeIn"

CHARACTER DESCRIPTIONS (for image consistency):
For each named character, provide a "characterDescriptions" object with a hyper-detailed visual description (20-30 words) that will be prepended to every image prompt to maintain consistency across pages. Example: "a small golden retriever puppy with floppy ears, round dark eyes, red collar with a silver bell, fluffy tail".

STYLE SUFFIX (include in output):
"styleSuffix": "${STORYBOOK_STYLE_SUFFIX}"

OUTPUT FORMAT — return ONLY valid JSON, no markdown, no explanation:

{
  "title": "string",
  "gradeLevel": "${grade}",
  "learningObjectiveSummary": ${hasCurriculum ? '"one sentence — what students learn from this story"' : 'null'},
  "characters": ["name1", "name2"],
  "characterDescriptions": {
    "CharacterName": "detailed visual description..."
  },
  "voiceAssignments": {
    "narrator": "lessac",
    "CharacterName": "ryan"
  },
  "styleSuffix": "${STORYBOOK_STYLE_SUFFIX}",
  "scenes": [
    { "id": "park", "description": "a sunny green park with tall oak trees and a wooden bench" }
  ],
  "pages": [
    {
      "pageNumber": 1,
      "textSegments": [
        { "speaker": "narrator", "text": "One sunny morning, Max woke up early." },
        { "speaker": "Max", "text": "Today is a great day!" }
      ],
      "sceneId": "park",
      "characterScene": "a golden puppy stretching and yawning near a bright window",
      "imagePlacement": "right",
      "characterAnimation": "slideInRight",
      "textAnimation": "fadeIn"
    }
  ],
  "comprehensionQuestions": ${hasCurriculum ? `[
    {
      "question": "What did the character do when...?",
      "answer": "Expected answer or discussion points for the teacher",
      "outcomeRef": "SCO text it targets"
    }
  ]` : '[]'}
}

Generate all ${formData.pageCount} pages. Every page must have at least one textSegment. Return ONLY the JSON object.`;
}
