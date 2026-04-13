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

function buildCharacterPrompt(
  characterDescriptions: Record<string, string>,
  characterScene: string,
  styleSuffix: string,
): string {
  // Combine all character descriptions (usually 1-2 characters per story)
  const descParts = Object.values(characterDescriptions);
  const descBlock = descParts.length > 0 ? descParts.join(', ') + ', ' : '';
  return `${descBlock}${characterScene}, ${styleSuffix}, white background, centered`;
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
      negativePrompt: DEFAULT_NEGATIVE,
      width: 512,
      height: 512,
      seed,
    });
    return { imageData: res.imageData, seed: res.seed };
  }

  // First character — let the backend pick a random seed
  const res = await imageApi.generateBatchImagesBase64({
    prompt,
    negativePrompt: DEFAULT_NEGATIVE,
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
    negativePrompt: DEFAULT_NEGATIVE,
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
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/remove-background-base64`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64 }),
  });
  if (!res.ok) throw new Error('Background removal failed');
  const data = await res.json();
  if (!data.image) throw new Error('Background removal returned no image data');
  return `data:image/png;base64,${data.image}`;
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

  // ── Step 2: Character images (per page) ────────────────────────────────────
  const results: PageImageResult[] = [];
  let currentSeed = initialSeed;
  let referenceImage: string | undefined = existingRefs ? Object.values(existingRefs)[0] : undefined;
  const charRefs: Record<string, string> = { ...(existingRefs || {}) };

  // In narrator-only mode, skip all character generation — backgrounds already include the subject
  if (narratorOnly) {
    // Collect background-only results
    for (let i = 0; i < book.pages.length; i++) {
      const bg = bgCache.get(book.pages[i].sceneId);
      if (bg) {
        results.push({ pageIndex: i, backgroundImageData: bg });
      }
    }
    return { pages: results, characterSeed: currentSeed, characterReferenceImages: charRefs };
  }

  // Pages that need character generation
  const charPages = skipCharacters
    ? []
    : book.pages
        .map((p, i) => ({ page: p, index: i }))
        .filter(({ page }) => page.characterScene && page.imagePlacement !== 'none');

  let charDone = 0;
  const charTotal = charPages.length;

  for (const { page, index } of charPages) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    try {
      let rawChar: string;
      let seed: number;

      if (referenceImage && currentSeed != null) {
        // ── Subsequent pages: img2img from reference for pose variation ──
        const result = await generateCharacterFromReference(
          charDescs,
          page.characterScene!,
          styleSuffix,
          currentSeed,
          referenceImage,
          0.55,
        );
        rawChar = result.imageData;
        seed = result.seed;
      } else {
        // ── First character: generate fresh, capture as reference ──
        const result = await generateCharacterImage(
          charDescs,
          page.characterScene!,
          styleSuffix,
          currentSeed,
        );
        rawChar = result.imageData;
        seed = result.seed;

        // Pin seed and save reference for subsequent pages
        currentSeed = seed;
        referenceImage = rawChar;
        const charName = Object.keys(charDescs)[0] || 'default';
        charRefs[charName] = rawChar;
      }

      // Remove background
      let finalChar: string;
      try {
        finalChar = await removeCharacterBg(rawChar);
      } catch {
        // If bg removal fails, use raw image
        finalChar = rawChar;
      }

      const pageResult: PageImageResult = {
        pageIndex: index,
        characterImageData: finalChar,
        characterSeed: seed,
        backgroundImageData: bgCache.get(page.sceneId),
      };
      results.push(pageResult);
      onPageResult?.(pageResult);
    } catch (e) {
      console.error(`[StoryImagePipeline] Failed to generate character for page ${index + 1}:`, e);
      onError?.(`Character image failed for page ${index + 1}`);
      // Still attach background if available
      const pageResult: PageImageResult = {
        pageIndex: index,
        backgroundImageData: bgCache.get(page.sceneId),
      };
      results.push(pageResult);
      onPageResult?.(pageResult);
    }

    charDone++;
    onProgress?.(charDone, charTotal, 'character');
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

  return { pages: results, characterSeed: currentSeed, characterReferenceImages: charRefs };
}
