/**
 * Shared image generation pipeline for storybook (and presentation) illustration.
 *
 * Strategy:
 *  - Backgrounds: one AI image per unique sceneId (deduped across pages), landscape 1024×576.
 *  - Characters:  one AI image per page, 512×512 on white bg, then auto-remove background.
 *    The first character image is saved as a "reference" and reused as an init_image
 *    (img2img) for all subsequent pages so the character looks visually consistent
 *    while allowing pose/action changes.
 *  - Narrator-only: no character overlays — subject descriptions are folded into
 *    background prompts so the subject appears naturally in the scene.
 */

import { imageApi } from '../lib/imageApi';
import type { ParsedStorybook, StoryPage } from '../types/storybook';
import { API_CONFIG } from '../config/api.config';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ImagePipelineOptions {
  /** Called after each image completes (for progress bar) */
  onProgress?: (current: number, total: number, stage: 'character' | 'background') => void;
  /** Called after each page's images are ready — use for incremental rendering */
  onPageResult?: (result: PageImageResult) => void;
  /** Called when an individual image fails (for error toasts) */
  onError?: (message: string) => void;
  /** Re-use a previously captured character seed for consistency */
  characterSeed?: number;
  /** Pre-existing character reference images (from a prior run) */
  characterReferenceImages?: Record<string, string>;
  /** Skip background generation (e.g. when regenerating characters only) */
  skipBackgrounds?: boolean;
  /** Skip character generation (e.g. when regenerating backgrounds only) */
  skipCharacters?: boolean;
  /** Narrator-only mode: fold character descriptions into backgrounds, skip character overlays */
  narratorOnly?: boolean;
  /** AbortSignal to cancel mid-pipeline */
  signal?: AbortSignal;
}

export interface PageImageResult {
  pageIndex: number;
  characterImageData?: string;
  characterSeed?: number;
  characterImageData2?: string;
  characterSeed2?: number;
  backgroundImageData?: string;
}

export interface PipelineResult {
  pages: PageImageResult[];
  /** The character seed that was used (useful to persist for later regeneration) */
  characterSeed?: number;
  /** Reference images generated per character (reuse for future regeneration) */
  characterReferenceImages?: Record<string, string>;
}

// ─── Prompt builders ────────────────────────────────────────────────────────

const DEFAULT_NEGATIVE =
  'text, words, letters, numbers, watermark, signature, deformed, distorted, blurry, ' +
  'extra fingers, mutated hands, poorly drawn hands, bad anatomy, extra limbs, ugly, low quality';

/** Extra prompt terms that help rembg cleanly separate the character from the background. */
const CHARACTER_ISOLATION =
  'solid pure white background, clean sharp outline, full body, single character isolated on white, ' +
  'no background elements, no shadows on background, studio lighting, high contrast edges';

/** Negative prompt specifically for character images — adds bg/scenery suppression. */
const CHARACTER_NEGATIVE =
  DEFAULT_NEGATIVE + ', background, scenery, landscape, gradient background, colored background, shadow on floor';

function buildCharacterPrompt(
  characterDescriptions: Record<string, string>,
  characterScene: string,
  styleSuffix: string,
): string {
  // Combine all character descriptions (usually 1-2 characters per story)
  const descParts = Object.values(characterDescriptions);
  const descBlock = descParts.length > 0 ? descParts.join(', ') + ', ' : '';
  return `${descBlock}${characterScene}, ${styleSuffix}, ${CHARACTER_ISOLATION}`;
}

/** Build a prompt for a single named character (not all characters merged). */
function buildCharacterPromptForOne(
  characterDesc: string,
  characterScene: string,
  styleSuffix: string,
): string {
  return `${characterDesc}, ${characterScene}, ${styleSuffix}, ${CHARACTER_ISOLATION}`;
}

function buildBackgroundPrompt(
  sceneDescription: string,
  styleSuffix: string,
  /** For narrator-only mode: fold character/subject descriptions into the scene */
  subjectDescriptions?: Record<string, string>,
): string {
  if (subjectDescriptions && Object.keys(subjectDescriptions).length > 0) {
    const subjectBlock = Object.values(subjectDescriptions).join(', ');
    return `${sceneDescription}, featuring ${subjectBlock}, ${styleSuffix}, wide landscape scene, no text`;
  }
  return `${sceneDescription}, ${styleSuffix}, wide landscape scene, no characters, no people, no text`;
}

// ─── Single-image helpers ───────────────────────────────────────────────────

/** Generate a single character image (with optional seed for consistency). */
export async function generateCharacterImage(
  characterDescriptions: Record<string, string>,
  characterScene: string,
  styleSuffix: string,
  seed?: number,
): Promise<{ imageData: string; seed: number }> {
  const prompt = buildCharacterPrompt(characterDescriptions, characterScene, styleSuffix);

  if (seed != null) {
    // Use seed-pinned generation for consistency
    const res = await imageApi.generateImageFromSeed({
      prompt,
      negativePrompt: CHARACTER_NEGATIVE,
      width: 512,
      height: 512,
      seed,
    });
    return { imageData: res.imageData, seed: res.seed };
  }

  // First character — let the backend pick a random seed
  const res = await imageApi.generateBatchImagesBase64({
    prompt,
    negativePrompt: CHARACTER_NEGATIVE,
    width: 512,
    height: 512,
    numImages: 1,
  });
  const img = res.images[0];
  return { imageData: img.imageData, seed: img.seed };
}

/**
 * Generate a character image using a reference image (img2img).
 * Preserves the character's look from the reference while adapting
 * to the new scene/pose described in characterScene.
 */
export async function generateCharacterFromReference(
  characterDescriptions: Record<string, string>,
  characterScene: string,
  styleSuffix: string,
  seed: number,
  referenceImage: string,
  strength: number = 0.55,
): Promise<{ imageData: string; seed: number }> {
  const prompt = buildCharacterPrompt(characterDescriptions, characterScene, styleSuffix);
  const res = await imageApi.generateImageFromSeed({
    prompt,
    negativePrompt: CHARACTER_NEGATIVE,
    width: 512,
    height: 512,
    seed,
    initImage: referenceImage,
    strength,
  });
  return { imageData: res.imageData, seed: res.seed };
}

/** Generate a single background image for a scene. */
export async function generateBackgroundImage(
  sceneDescription: string,
  styleSuffix: string,
  subjectDescriptions?: Record<string, string>,
): Promise<string> {
  const prompt = buildBackgroundPrompt(sceneDescription, styleSuffix, subjectDescriptions);
  const res = await imageApi.generateImageBase64({
    prompt,
    negativePrompt: DEFAULT_NEGATIVE,
    width: 1024,
    height: 576,
  });
  return res.imageData;
}

/** Remove the background from a character image and return transparent PNG data URI. */
export async function removeCharacterBg(imageData: string): Promise<string> {
  const base64 = imageData.includes(',') ? imageData.split(',')[1] : imageData;
  console.log(`[StoryImagePipeline] removeCharacterBg: sending ${Math.round(base64.length / 1024)}KB to /api/remove-background-base64`);
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/remove-background-base64`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64 }),
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    console.error(`[StoryImagePipeline] removeCharacterBg: HTTP ${res.status} - ${errorText}`);
    throw new Error(`Background removal failed: HTTP ${res.status}`);
  }
  const data = await res.json();
  const resultImage = data.image || data.imageData;
  if (!resultImage) {
    console.error('[StoryImagePipeline] removeCharacterBg: response has no image/imageData field. Keys:', Object.keys(data));
    throw new Error('Background removal returned no image data');
  }
  console.log(`[StoryImagePipeline] removeCharacterBg: success, got ${Math.round(resultImage.length / 1024)}KB result`);
  // Backend may already return a full data URI — avoid doubling the prefix
  if (resultImage.startsWith('data:')) {
    return resultImage;
  }
  return `data:image/png;base64,${resultImage}`;
}

// ─── Batch pipeline ─────────────────────────────────────────────────────────

/**
 * Generate all images for a storybook.
 *
 * Flow:
 *  1. Dedupe scenes → generate one background per unique sceneId
 *     - Narrator-only: fold character/subject descriptions into background prompts
 *     - Emit results incrementally via onPageResult after each background
 *  2. For each page with imagePlacement !== 'none' (skipped in narrator-only mode):
 *     a. First page: generate character image → save as reference
 *     b. Subsequent pages: img2img from reference for pose variation
 *     c. Auto-remove background
 *     d. Emit result incrementally via onPageResult
 *  3. Return aggregated results + reference images for future use
 */
export async function generateAllPageImages(
  book: ParsedStorybook,
  options: ImagePipelineOptions = {},
): Promise<PipelineResult> {
  const {
    onProgress,
    onPageResult,
    onError,
    characterSeed: initialSeed,
    characterReferenceImages: existingRefs,
    skipBackgrounds = false,
    skipCharacters = false,
    narratorOnly = false,
    signal,
  } = options;

  const styleSuffix = book.styleSuffix || "flat vector illustration, children's book style, bold outlines, pastel colors, bright and cheerful, simple shapes, no text";
  const charDescs = book.characterDescriptions || {};

  // Build scene description map
  const sceneMap = new Map<string, string>();
  for (const scene of book.scenes) {
    sceneMap.set(scene.id, scene.description);
  }

  // ── Step 1: Backgrounds (deduplicated by sceneId) ──────────────────────────
  const bgCache = new Map<string, string>(); // sceneId → imageData

  if (!skipBackgrounds) {
    const uniqueSceneIds = [...new Set(book.pages.map(p => p.sceneId))];
    let bgDone = 0;
    const bgTotal = uniqueSceneIds.length;

    for (const sceneId of uniqueSceneIds) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

      const desc = sceneMap.get(sceneId);
      if (!desc) continue;

      try {
        // Narrator-only: include subject/character in the background itself
        const subjectDescs = narratorOnly ? charDescs : undefined;
        const imgData = await generateBackgroundImage(desc, styleSuffix, subjectDescs);
        bgCache.set(sceneId, imgData);
      } catch (e) {
        console.error(`[StoryImagePipeline] Failed to generate background for scene "${sceneId}":`, e);
        onError?.(`Background failed for scene "${sceneId}"`);
        // Continue — page will fall back to bundled SVG
      }

      bgDone++;
      onProgress?.(bgDone, bgTotal, 'background');

      // ── Incremental: emit background results for all pages sharing this scene ──
      if (bgCache.has(sceneId)) {
        for (let i = 0; i < book.pages.length; i++) {
          if (book.pages[i].sceneId === sceneId) {
            onPageResult?.({ pageIndex: i, backgroundImageData: bgCache.get(sceneId) });
          }
        }
      }
    }
  }

  // ── Step 2: Character images (per page, per character) ─────────────────────
  const results: PageImageResult[] = [];
  // Per-character seed and reference tracking (keyed by character name)
  const charSeeds: Record<string, number> = {};
  const charRefs: Record<string, string> = { ...(existingRefs || {}) };

  // Seed initial values from existing refs
  if (initialSeed != null) {
    const firstName = Object.keys(charDescs)[0];
    if (firstName) charSeeds[firstName] = initialSeed;
  }

  // In narrator-only mode, skip all character generation — backgrounds already include the subject
  if (narratorOnly) {
    // Collect background-only results
    for (let i = 0; i < book.pages.length; i++) {
      const bg = bgCache.get(book.pages[i].sceneId);
      if (bg) {
        results.push({ pageIndex: i, backgroundImageData: bg });
      }
    }
    return { pages: results, characterSeed: Object.values(charSeeds)[0], characterReferenceImages: charRefs };
  }

  // Pages that need character generation (either char 1 or char 2)
  const charPages = skipCharacters
    ? []
    : book.pages
        .map((p, i) => ({ page: p, index: i }))
        .filter(({ page }) => page.characterScene && page.imagePlacement !== 'none');

  // Count total character images to generate (char1 + char2 where applicable)
  let charTotal = 0;
  for (const { page } of charPages) {
    charTotal++; // character 1
    if (page.characterScene2 && page.characterName2) charTotal++; // character 2
  }
  let charDone = 0;

  /** Generate a single character image with per-character seed/ref tracking. */
  async function generateOneCharacter(
    charName: string,
    scene: string,
  ): Promise<{ imageData: string; seed: number }> {
    const charDesc = charDescs[charName];
    const ref = charRefs[charName];
    const seed = charSeeds[charName];

    let rawChar: string;
    let resultSeed: number;

    if (ref && seed != null) {
      // img2img from per-character reference for pose variation
      // Vary the seed per call so the noise pattern differs — otherwise
      // same seed + same ref = identical pose regardless of prompt.
      const variedSeed = seed + Math.floor(Math.random() * 10000);
      const singleDesc = charDesc ? { [charName]: charDesc } : charDescs;
      const result = await generateCharacterFromReference(
        singleDesc,
        scene,
        styleSuffix,
        variedSeed,
        ref,
        0.75,
      );
      rawChar = result.imageData;
      resultSeed = result.seed;
    } else if (charDesc) {
      // First generation for this character — use only their description
      const prompt = buildCharacterPromptForOne(charDesc, scene, styleSuffix);
      const res = seed != null
        ? await imageApi.generateImageFromSeed({ prompt, negativePrompt: CHARACTER_NEGATIVE, width: 512, height: 512, seed })
        : await imageApi.generateBatchImagesBase64({ prompt, negativePrompt: CHARACTER_NEGATIVE, width: 512, height: 512, numImages: 1 });

      if ('images' in res) {
        rawChar = res.images[0].imageData;
        resultSeed = res.images[0].seed;
      } else {
        rawChar = res.imageData;
        resultSeed = res.seed;
      }

      // Save as reference for future pages
      charSeeds[charName] = resultSeed;
      charRefs[charName] = rawChar;
    } else {
      // Fallback: use all descriptions merged (legacy behavior)
      const result = await generateCharacterImage(charDescs, scene, styleSuffix, seed);
      rawChar = result.imageData;
      resultSeed = result.seed;
      charSeeds[charName] = resultSeed;
      charRefs[charName] = rawChar;
    }

    // Remove background
    let finalChar: string;
    try {
      finalChar = await removeCharacterBg(rawChar);
    } catch (bgErr) {
      console.error(`[StoryImagePipeline] BG removal failed for ${charName}, using raw image:`, bgErr);
      finalChar = rawChar;
    }

    return { imageData: finalChar, seed: resultSeed };
  }

  for (const { page, index } of charPages) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    const pageResult: PageImageResult = {
      pageIndex: index,
      backgroundImageData: bgCache.get(page.sceneId),
    };

    // ── Character 1 ──
    const char1Name = page.characterName || Object.keys(charDescs)[0] || 'default';
    try {
      const char1 = await generateOneCharacter(char1Name, page.characterScene!);
      pageResult.characterImageData = char1.imageData;
      pageResult.characterSeed = char1.seed;
    } catch (e) {
      console.error(`[StoryImagePipeline] Failed to generate ${char1Name} for page ${index + 1}:`, e);
      onError?.(`Character image failed for ${char1Name} on page ${index + 1}`);
    }

    charDone++;
    onProgress?.(charDone, charTotal, 'character');

    // ── Character 2 (if present) ──
    if (page.characterScene2 && page.characterName2) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

      try {
        const char2 = await generateOneCharacter(page.characterName2, page.characterScene2);
        pageResult.characterImageData2 = char2.imageData;
        pageResult.characterSeed2 = char2.seed;
      } catch (e) {
        console.error(`[StoryImagePipeline] Failed to generate ${page.characterName2} for page ${index + 1}:`, e);
        onError?.(`Character image failed for ${page.characterName2} on page ${index + 1}`);
      }

      charDone++;
      onProgress?.(charDone, charTotal, 'character');
    }

    results.push(pageResult);
    onPageResult?.(pageResult);
  }

  // For pages that didn't need characters but still need backgrounds
  if (!skipBackgrounds) {
    const coveredIndices = new Set(results.map(r => r.pageIndex));
    for (let i = 0; i < book.pages.length; i++) {
      if (!coveredIndices.has(i)) {
        const bg = bgCache.get(book.pages[i].sceneId);
        if (bg) {
          results.push({ pageIndex: i, backgroundImageData: bg });
        }
      }
    }
  }

  return { pages: results, characterSeed: Object.values(charSeeds)[0], characterReferenceImages: charRefs };
}
