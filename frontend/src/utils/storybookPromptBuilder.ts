import type { StorybookFormData } from '../types/storybook';
import type { ImageMode } from '../types';
import { getLanguageInstruction } from './languageInstruction';

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
    introExample: 'It was a hot day. Mia and Ben went to the park. They wanted to play on the swings.',
  },
  '1': {
    name: 'Grade 1',
    age: '6-7 years',
    sentences: '3-4 sentences per page',
    sentenceLength: '5-8 words each',
    vocabulary: 'Basic academic vocabulary, simple descriptive words, common verbs',
    dialogue: 'Short sentences — up to 8 words (e.g., "I want to find the lost ball.")',
    style: 'Simple plot with clear cause-and-effect, some repetition, friendly tone',
    introExample: 'It was a bright and sunny day. Mia and Ben walked to the park together. They wanted to play on the new swings. Mia had her water bottle. Ben brought a small ball.',
  },
  '2': {
    name: 'Grade 2',
    age: '7-8 years',
    sentences: '4-5 sentences per page',
    sentenceLength: '6-10 words, some compound sentences',
    vocabulary: 'Grade 2 academic words, descriptive adjectives, simple adverbs',
    dialogue: 'Full sentences — up to 12 words with emotion/expression cues',
    style: 'Clear story arc (beginning/middle/end), characters show feelings, some problem-solving',
    introExample: 'It was a warm Saturday morning at the beach. Mia and Ben had just finished their breakfast at home. Today they were going to look for pretty seashells by the water. Their teacher wanted shells for a class project. Mia put on her hat, and Ben grabbed a small bucket.',
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
- "characterName": the name of the primary character on this page (must match a key in characterDescriptions).
- "characterScene": a short 8-15 word image prompt describing that character's action/pose (e.g., "a golden puppy jumping joyfully in green grass"). This will be sent to an AI image generator. Describe ONLY this one character.
- "imagePlacement": either "left" or "right" — alternate between pages for visual variety.
- "characterAnimation": one of slideInLeft, slideInRight, bounceIn, fadeIn, zoomIn (match direction with imagePlacement).
- If a SECOND character also appears and has dialogue or action on this page, ALSO include:
  - "characterName2": the name of the second character.
  - "characterScene2": a short 8-15 word image prompt for the second character's action/pose. The second character will be placed on the OPPOSITE side of the first character automatically.
- If only one character is active on the page, omit characterName2 and characterScene2.
- If a character is narrator-only on the page (no dialogue, not the subject of action), do NOT include them.`;

    case 'suggested':
      return `For each page, provide:
- "characterName": the name of the primary character on this page.
- "characterScene": a 15-25 word description of what image would best illustrate this character (e.g., "A small golden puppy with a red collar looking up at a tall tree, surprised expression, outdoor setting"). This guides the teacher in finding or creating an image.
- "imagePlacement": either "left" or "right" — alternate between pages.
- "characterAnimation": one of slideInLeft, slideInRight, bounceIn, fadeIn, zoomIn.
- If a SECOND character also appears on this page, include "characterName2" and "characterScene2" with the same format.`;

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

// ─── Pacing Guide Builder ─────────────────────────────────────────────────────

function buildPacingGuide(pageCount: number): string {
  if (pageCount <= 4) {
    return `STORY STRUCTURE (${pageCount} pages):
- Page 1: Introduce the main character doing something — show them in their world
- Page 2: A small problem, question, or want appears
- Page ${pageCount - 1}: The character tries to solve it — something surprising or funny happens
- Page ${pageCount}: Resolution — the character succeeds or finds an answer through action`;
  }

  // For longer stories, compute approximate page ranges
  const intro = Math.max(1, Math.floor(pageCount * 0.2));       // ~20% intro
  const problemStart = intro + 1;
  const midEnd = Math.floor(pageCount * 0.7);                    // ~70% through
  const climax = midEnd + 1;
  const resolution = pageCount;

  const introRange = intro === 1 ? 'Page 1' : `Pages 1-${intro}`;
  const problemRange = problemStart === midEnd ? `Page ${problemStart}` : `Pages ${problemStart}-${midEnd}`;
  const climaxRange = climax === resolution - 1 ? `Page ${climax}` : `Pages ${climax}-${resolution - 1}`;

  return `STORY STRUCTURE (distribute across ${pageCount} pages):
- ${introRange}: Introduce the main character DOING something — show their world through action, not description
- ${problemRange}: A small problem, want, or question drives the story forward — include a setback or surprise
- ${climaxRange}: The character tries to solve the problem — build to the most exciting moment
- Page ${resolution}: Resolution — the character succeeds or learns something through their own actions (NOT a lecture)`;
}

// ─── Dynamic Example JSON Builder ─────────────────────────────────────────────

/**
 * Build the example JSON block dynamically using actual character names from formData.
 * This prevents name contamination — the model only sees the user's chosen names.
 */
function buildExampleJSON(formData: StorybookFormData, hasCurriculum: boolean): string {
  const grade = formData.gradeLevel;
  const hasMultipleSpeakers = formData.speakerCount > 1;

  // Get actual character names from speaker config, with fallbacks
  const charNames: string[] = formData.speakers
    .filter(s => s.role !== 'narrator' && s.characterName)
    .map(s => s.characterName!);

  // Build characters array and characterDescriptions example
  let charactersExample: string;
  let charDescExample: string;
  let voiceExample: string;
  let textSegmentsExample: string;

  if (!hasMultipleSpeakers || charNames.length === 0) {
    // Narrator-only mode
    charactersExample = '[]';
    charDescExample = '{}';
    voiceExample = `{
    "narrator": "${formData.speakers[0]?.voice || 'lessac'}"
  }`;
    textSegmentsExample = `[
        { "speaker": "narrator", "text": "The little bird hopped along the branch." },
        { "speaker": "narrator", "text": "It looked down at the pond below." }
      ]`;
  } else if (charNames.length === 1) {
    // Narrator + 1 character
    const name = charNames[0];
    const voice = formData.speakers.find(s => s.characterName === name)?.voice || 'ryan';
    charactersExample = `["${name}"]`;
    charDescExample = `{
    "${name}": "detailed visual description for ${name}..."
  }`;
    voiceExample = `{
    "narrator": "${formData.speakers[0]?.voice || 'lessac'}",
    "${name}": "${voice}"
  }`;
    textSegmentsExample = `[
        { "speaker": "narrator", "text": "The garden was full of bright flowers." },
        { "speaker": "${name}", "text": "Look at all the colors! I want to pick the red one." },
        { "speaker": "narrator", "text": "${name} bent down and reached for the flower." }
      ]`;
  } else {
    // Narrator + 2 characters
    const name1 = charNames[0];
    const name2 = charNames[1];
    const voice1 = formData.speakers.find(s => s.characterName === name1)?.voice || 'ryan';
    const voice2 = formData.speakers.find(s => s.characterName === name2)?.voice || 'amy';
    charactersExample = `["${name1}", "${name2}"]`;
    charDescExample = `{
    "${name1}": "detailed visual description for ${name1}...",
    "${name2}": "detailed visual description for ${name2}..."
  }`;
    voiceExample = `{
    "narrator": "${formData.speakers[0]?.voice || 'lessac'}",
    "${name1}": "${voice1}",
    "${name2}": "${voice2}"
  }`;
    textSegmentsExample = `[
        { "speaker": "narrator", "text": "${name1} and ${name2} stopped near a big tree." },
        { "speaker": "${name1}", "text": "Look over there! I think I can see something moving." },
        { "speaker": "${name2}", "text": "Really? Let me see too. Where is it?" },
        { "speaker": "narrator", "text": "They both walked closer to get a better look." },
        { "speaker": "${name1}", "text": "It is a small frog! It is sitting on a leaf." }
      ]`;
  }

  return `{
  "title": "string",
  "gradeLevel": "${grade}",
  "learningObjectiveSummary": ${hasCurriculum ? '"one sentence — what students learn from this story"' : 'null'},
  "characters": ${charactersExample},
  "characterDescriptions": ${charDescExample},
  "voiceAssignments": ${voiceExample},
  "scenes": [
    { "id": "park", "description": "a sunny green park with tall oak trees and a wooden bench" }
  ],
  "introductionPage": {
    "moodText": "3 to 5 simple narrator-only sentences. Open with setting (weather/place/time), name the main characters, and state where they are and what they are about to do. Plain concrete language, no metaphors, no personification. Must flow directly into page 1. See the example above for the exact tone.",
    "sceneId": "park"
  },
  "pages": [
    {
      "pageNumber": 1,
      "textSegments": ${textSegmentsExample},
      "sceneId": "park",
      "characterName": ${charNames.length > 0 ? `"${charNames[0]}"` : '"character"'},
      "characterScene": "8-15 word image prompt describing the character action",
      "imagePlacement": "right"${charNames.length >= 2 ? `,
      "characterName2": "${charNames[1]}",
      "characterScene2": "8-15 word image prompt for second character action"` : ''}
    }
  ]
}`;
}

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

  return lines.join('\n');
}

// ─── Main Builder ─────────────────────────────────────────────────────────────

export function buildStorybookPrompt(formData: StorybookFormData, language?: string): string {
  const grade = formData.gradeLevel;
  const spec = GRADE_SPECS[grade];
  const hasMultipleSpeakers = formData.speakerCount > 1;

  // Build speaker config description
  const speakerLines = formData.speakers.map(s => {
    const name = s.characterName ? `"${s.characterName}"` : s.role;
    return `  - ${s.role === 'narrator' ? 'Narrator' : name} (voice: ${s.voice})`;
  }).join('\n');

  const speakerInstruction = hasMultipleSpeakers
    ? `SPEAKERS (exactly ${formData.speakerCount} total — no more, no fewer):
${speakerLines}
IMPORTANT: Use ONLY these ${formData.speakerCount} speakers. Do NOT invent additional characters — no extra friends, siblings, classmates, pets, or side characters. The ONLY named characters in the entire story are the ones listed above. Do NOT rename these characters. Tag every text segment with the correct speaker name exactly as listed above. Narrator reads scene/action text. Characters only speak in dialogue. The "voiceAssignments" object must contain exactly these speakers and no others.`
    : `SPEAKER: Single narrator only. All text uses speaker: "narrator". Do NOT create any speaking characters. The entire story must be narrated in third person by the narrator. The "voiceAssignments" object must contain only: {"narrator": "${formData.speakers[0]?.voice || 'lessac'}"}.`;

  const imageInstructions = buildImageInstructions(formData.imageMode);
  const curriculumBlock = buildCurriculumBlock(formData);
  const hasCurriculum = formData.useCurriculum && formData.strand;
  const pacingGuide = buildPacingGuide(formData.pageCount);
  const exampleJSON = buildExampleJSON(formData, !!hasCurriculum);

  const prompt = `You are a children's storybook author specializing in ${spec.name} (${spec.age}) literacy.

TASK: Write a complete illustrated storybook based on the teacher's description below.

STORY REQUEST:
Title: "${formData.title || '[Generate a creative, engaging story title based on the description, subject, and grade level]'}"
Description: ${formData.description}
Grade Level: ${spec.name} (${spec.age})${formData.subject ? `\nSubject: ${formData.subject}` : ''}
Story Pages: ${formData.pageCount} (this count is the body of the story ONLY — the cover and the introductionPage are SEPARATE and do NOT count toward this total)

${pacingGuide}

${curriculumBlock ? curriculumBlock + '\n\n' : ''}INTRODUCTION PAGE (MANDATORY):
Every storybook must begin with an introductionPage — a simple, natural opening that sets the scene and introduces the characters BEFORE the main action begins. Think of it as the "once upon a time" opening, not a poetic mood piece.
- Exactly 3 to 5 sentences, narrator voice only, NO dialogue
- Use the SAME vocabulary and sentence rules as the story pages below (grade ${spec.name}, ${spec.sentenceLength})
- Use plain concrete language — NO poetic metaphors, NO personification (do NOT write things like "the wind whispered secrets" or "the air smelled of adventure")
- Open with a simple setting line (weather, place, time of day — e.g. "It was a warm sunny day.")
- Name the main character(s) and state WHERE they are and WHAT they are about to do (e.g. "${hasMultipleSpeakers && formData.speakers.filter(s => s.characterName).length >= 2 ? formData.speakers.filter(s => s.characterName).slice(0, 2).map(s => s.characterName).join(' and ') : 'Mia'} went to the beach to look for seashells.")
- Do NOT introduce conflict, mystery, or foreshadow a problem — the intro is just "here's who they are and what they're about to do"
- Page 1 of the story must flow NATURALLY from the intro — it picks up exactly where the intro left off and starts the actual action. The intro is a lead-in, not a separate disconnected scene.

EXAMPLE INTRODUCTION (for ${spec.name}, matching the required style and length):
"${spec.introExample}"

(Notice: simple words, names the characters, says what they are doing, no poetic language, no foreshadowing of problems. Your introduction should match this tone exactly.)

WRITING RULES:
- ${spec.sentences}
- Sentence length: ${spec.sentenceLength}
- Vocabulary: ${spec.vocabulary}
- Dialogue style: ${spec.dialogue}
- Story style: ${spec.style}
- Show emotions through actions and dialogue, not narration (write "she jumped up and clapped" not "she was happy")
- Each page must have ONE clear moment or action — do not pack too much into a page
- Page 1 is the first STORY page (after the introductionPage) — it must pick up DIRECTLY from what the introduction set up. If the intro says the characters went to the beach to look for shells, page 1 starts with them actually looking at / picking up / talking about a shell — not a new scene or time jump.
- The final page must resolve the setup from the intro — if they went to look for shells, the final page shows them having found what they set out for (or learning something in the process).
- Introduce the main character DOING something on an early page — not through description
- Include at least one moment of humor, surprise, or wonder
- Vary sentence beginnings — never start 3+ consecutive sentences with the same word
- Use sensory details — colors, sounds, textures — that young readers can picture
- Do NOT end with a moral lesson or summary paragraph (no "And so they learned that...")
- Characters should solve problems with creativity, humor, or kindness — not be told the answer
- NARRATOR vs CHARACTER RULE: the narrator ONLY describes actions and the scene (e.g. "They walked to the tree."). The narrator NEVER speaks dialogue or asks questions that a character would say. If a character says "What is that?" it goes ONLY in that character's segment, NEVER as a narrator segment. Do NOT duplicate lines — each sentence appears exactly once.
- Characters should speak in 1-2 sentences per turn, not just single short phrases. Give them something real to say — an observation, a question, a reaction, or a suggestion. Vary the length across pages.
- Do NOT copy the example JSON text. The example shows the FORMAT only. Write completely fresh story text.
${hasMultipleSpeakers ? '- Give each character a distinct speaking style — one might ask questions, another uses exclamations' : ''}

${speakerInstruction}

SCENE GROUPING:
- ${typeof formData.backgroundCount === 'number' ? `Use EXACTLY ${formData.backgroundCount} unique scene${formData.backgroundCount === 1 ? '' : 's'}/background${formData.backgroundCount === 1 ? '' : 's'} across all pages` : 'Identify 2-5 unique locations/settings in the story'}
- Assign each a short sceneId (e.g., "park", "home", "school")
- Multiple pages that take place in the same location must share the same sceneId
- Provide a brief "description" for each scene (15-20 words) that describes the setting visually

IMAGE INSTRUCTIONS:
${imageInstructions}

CHARACTER DESCRIPTIONS (for image consistency):
For each named character, provide a "characterDescriptions" object with a hyper-detailed visual description (20-30 words) that will be prepended to every image prompt to maintain consistency across pages. Example: "a small golden retriever puppy with floppy ears, round dark eyes, red collar with a silver bell, fluffy tail".

OUTPUT FORMAT — return ONLY valid JSON, no markdown, no explanation:

${exampleJSON}

Generate exactly ${formData.pageCount} story pages in the "pages" array (NOT counting the introductionPage, which is a separate top-level field). Every page must have at least one textSegment. Return ONLY the JSON object.`;

  return prompt + getLanguageInstruction(language);
}

// ─── Two-Pass Builders (for smaller models) ──────────────────────────────────

/**
 * Pass 1: Generate the full story as plain narrative text.
 * Smaller models produce more coherent stories when not juggling JSON structure.
 */
export function buildNarrativePrompt(formData: StorybookFormData): string {
  const grade = formData.gradeLevel;
  const spec = GRADE_SPECS[grade];
  const hasMultipleSpeakers = formData.speakerCount > 1;
  const curriculumBlock = buildCurriculumBlock(formData);
  const pacingGuide = buildPacingGuide(formData.pageCount);

  const speakerNames = formData.speakers
    .filter(s => s.role !== 'narrator' && s.characterName)
    .map(s => s.characterName);
  const characterNote = speakerNames.length > 0
    ? `Use ONLY these characters: ${speakerNames.join(', ')}. Do NOT rename them or add ANY new characters — no extra friends, siblings, classmates, pets, or side characters. The ONLY named characters in the entire story are the ones listed here.`
    : 'Create 1-2 named characters for the story.';

  // Build dialogue example using actual character names (not hardcoded names)
  const dialogueExample = speakerNames.length > 0
    ? `- Write dialogue with the character name before each line, like:\n  Narrator: The garden was full of bright flowers.\n  ${speakerNames[0]}: "Look at all the colors!"`
    : '- Write dialogue with the character name before each line, like:\n  Narrator: The garden was full of bright flowers.\n  Character: "Look at all the colors!"';

  return `You are a children's storybook author for ${spec.name} (${spec.age}).

Write a complete children's story as plain text. Your output must have TWO parts:
1. First, an INTRODUCTION section (3-5 narrator-only sentences, no dialogue) that sets the mood, place, and atmosphere before the story action begins. Mark it with "---INTRODUCTION---" before and "---INTRO END---" after. This section is IN ADDITION TO the story pages — it does not count as a page.
2. Then, exactly ${formData.pageCount} story pages separated by "---PAGE BREAK---". These are the body pages of the story, not counting the introduction.

STORY REQUEST:
Title: "${formData.title || '[Generate a creative, engaging story title based on the description, subject, and grade level]'}"
Description: ${formData.description}
Grade Level: ${spec.name} (${spec.age})${formData.subject ? `\nSubject: ${formData.subject}` : ''}

${pacingGuide}

${curriculumBlock ? curriculumBlock + '\n\n' : ''}INTRODUCTION RULES (for the opening paragraph):
- 3 to 5 sentences, narrator voice ONLY, NO dialogue, NO character speech
- SAME vocabulary and sentence rules as the story pages (${spec.name}, ${spec.sentenceLength})
- Plain concrete language — NO poetic metaphors, NO personification
- Open with a simple setting line (weather/place/time)
- Name the main characters and state what they are about to do — like a "once upon a time" opening, not a mood piece
- Do NOT introduce conflict, mystery, or foreshadow a problem
- Page 1 of the story must pick up DIRECTLY from where the intro leaves off

EXAMPLE INTRODUCTION (${spec.name}):
"${spec.introExample}"

STORY PAGE RULES:
- ${spec.sentences}
- Sentence length: ${spec.sentenceLength}
- Vocabulary: ${spec.vocabulary}
- Dialogue style: ${spec.dialogue}
- Story style: ${spec.style}
- Show emotions through actions and dialogue, not narration
- Each page should have ONE clear moment or action
- Introduce the main character DOING something on the first page
- Include at least one moment of humor, surprise, or wonder
- Vary sentence beginnings — never start 3+ consecutive sentences with the same word
- Do NOT end with a moral lesson or summary paragraph
- ${characterNote}
${hasMultipleSpeakers ? dialogueExample : '- Write in third person narrative voice.'}

IMPORTANT: The story must flow naturally from page to page. Each page should connect to the next. The story needs a clear beginning, middle, and end.

Output format:
---INTRODUCTION---
(3-5 sentence mood-setting paragraph here)
---INTRO END---
(page 1 text)
---PAGE BREAK---
(page 2 text)
---PAGE BREAK---
... and so on for ${formData.pageCount} pages.

Start writing now:`;
}

/**
 * Pass 2: Build a template for converting narrative to structured JSON.
 * Returns a prompt with {{NARRATIVE}} placeholder that the backend replaces
 * with the actual story text from pass 1.
 */
export function buildStructurePromptTemplate(formData: StorybookFormData): string {
  const imageInstructions = buildImageInstructions(formData.imageMode);
  const hasCurriculum = formData.useCurriculum && formData.strand;

  const speakerLines = formData.speakers.map(s => {
    const name = s.characterName ? `"${s.characterName}"` : s.role;
    return `  - ${s.role === 'narrator' ? 'Narrator' : name} (voice: ${s.voice})`;
  }).join('\n');

  const exampleJSON = buildExampleJSON(formData, !!hasCurriculum);

  return `Convert the following children's story into structured JSON format.

THE STORY:
{{NARRATIVE}}

SPEAKERS (use these EXACT names — do not rename or add characters):
${speakerLines}

SCENE GROUPING:
- Identify 2-5 unique locations/settings in the story
- Assign each a short sceneId (e.g., "park", "home", "school")
- Pages in the same location share the same sceneId

IMAGE INSTRUCTIONS:
${imageInstructions}

CHARACTER DESCRIPTIONS (for image consistency):
For each named character, provide a "characterDescriptions" object with a detailed visual description (20-30 words).

INTRODUCTION PAGE:
The story above has an introduction section between "---INTRODUCTION---" and "---INTRO END---". Put that text verbatim in the "introductionPage.moodText" field. Do NOT split it into dialogue segments — it is narrator-only. Pick the sceneId that best matches where the story opens.

OUTPUT FORMAT — return ONLY valid JSON, no markdown, no explanation:

${exampleJSON}

IMPORTANT: Preserve the story text exactly as written above. Put the introduction between ---INTRODUCTION--- and ---INTRO END--- into introductionPage.moodText. Split everything AFTER ---INTRO END--- into pages matching the ---PAGE BREAK--- markers. Tag each sentence with the correct speaker using the EXACT names from the SPEAKERS list. Return ONLY the JSON object.`;
}

// ─── V2 payload builder (two-pass backend pipeline) ──────────────────────────
//
// Backend owns all prompting in v2 — frontend only bundles user inputs into
// the websocket payload. Keep this alongside the v1 builders during
// incremental migration; the v1 functions above will be deleted once the
// component flips to v2-only.

/** Map v1 gradeLevel ("K"|"1"|"2") to the v2 target age tier. */
function gradeToTargetAge(grade: 'K' | '1' | '2'): '3-5' | '6-8' | '9-12' {
  if (grade === 'K') return '3-5';
  if (grade === '1' || grade === '2') return '6-8';
  return '6-8';
}

export interface StorybookV2Payload {
  brief: string;
  pageCount: number;
  targetAge: '3-5' | '6-8' | '9-12';
  curriculumInfo: string;
}

/** Bundle the teacher's form into the /ws/storybook v2 payload. */
export function buildStorybookV2Payload(
  formData: StorybookFormData,
): StorybookV2Payload {
  // Compose a brief that folds in everything the bible-writer needs — the LLM
  // owns the remaining prompt shaping on the backend.
  const parts: string[] = [];
  if (formData.title) parts.push(`Title: "${formData.title}"`);
  parts.push(`Description: ${formData.description}`);
  if (formData.subject) parts.push(`Subject: ${formData.subject}`);
  if (formData.authorName) parts.push(`Author: ${formData.authorName}`);

  // Pull speaker names into the brief so the bible keeps the teacher's
  // intended cast (backend does not know form types).
  const speakerNames = formData.speakers
    .filter(s => s.role !== 'narrator' && s.characterName)
    .map(s => s.characterName!);
  if (speakerNames.length > 0) {
    parts.push(
      `Required characters: ${speakerNames.join(', ')}. Do not add any other named characters.`,
    );
  }
  if (formData.stylePreset) parts.push(`Style preset: ${formData.stylePreset}`);

  return {
    brief: parts.join('\n'),
    pageCount: formData.pageCount,
    targetAge: gradeToTargetAge(formData.gradeLevel),
    curriculumInfo: buildCurriculumInfo(formData),
  };
}

// ─── Curriculum Info Builder (for comprehension questions pass) ────────────────

/**
 * Build a compact curriculum info string to send to the backend for the
 * separate comprehension questions generation pass.
 * Returns empty string if no curriculum is configured.
 */
export function buildCurriculumInfo(formData: StorybookFormData): string {
  if (!formData.useCurriculum || !formData.strand) return '';

  const parts: string[] = [];
  if (formData.subject) parts.push(`Subject: ${formData.subject}`);
  if (formData.strand) parts.push(`Strand: ${formData.strand}`);
  if (formData.essentialOutcomes) parts.push(`ELO: ${formData.essentialOutcomes}`);
  if (formData.specificOutcomes) {
    const scos = formData.specificOutcomes.split('\n').filter(s => s.trim());
    if (scos.length > 0) parts.push(`SCOs: ${scos.join('; ')}`);
  }
  return parts.join('\n');
}
