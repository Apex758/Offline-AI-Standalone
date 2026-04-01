/**
 * Shared image generation pipeline for storybook (and presentation) illustration.
 *
 * Strategy:
 *  - Backgrounds: one AI image per unique sceneId (deduped across pages), landscape 1024×576.
 *  - Characters:  one AI image per page, 512×512 on white bg, then auto-remove background.
 *    The first character image captures a seed that is reused for all subsequent pages
 *    so the character looks visually consistent.
 */

import { imageApi } from '../lib/imageApi';
import type { ParsedStorybook, StoryPage } from '../types/storybook';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ImagePipelineOptions {
  /** Called after each image completes */
  onProgress?: (current: number, total: number, stage: 'character' | 'background') => void;
  /** Re-use a previously captured character seed for consistency */
  characterSeed?: number;
  /** Skip background generation (e.g. when regenerating characters only) */
  skipBackgrounds?: boolean;
  /** Skip character generation (e.g. when regenerating backgrounds only) */
  skipCharacters?: boolean;
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
  return `${descBlock}${characterScene}, ${styleSuffix}, white background, centered, single character`;
}

function buildBackgroundPrompt(
  sceneDescription: string,
  styleSuffix: string,
): string {
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

/** Generate a single background image for a scene. */
export async function generateBackgroundImage(
  sceneDescription: string,
  styleSuffix: string,
): Promise<string> {
  const prompt = buildBackgroundPrompt(sceneDescription, styleSuffix);
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
  const res = await fetch('/api/remove-background-base64', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64 }),
  });
  if (!res.ok) throw new Error('Background removal failed');
  const data = await res.json();
  return `data:image/png;base64,${data.image}`;
}

// ─── Batch pipeline ─────────────────────────────────────────────────────────

/**
 * Generate all images for a storybook.
 *
 * Flow:
 *  1. Dedupe scenes → generate one background per unique sceneId
 *  2. For each page with imagePlacement !== 'none':
 *     a. Generate character image (seed-pinned after first)
 *     b. Auto-remove background
 *  3. Return per-page results
 */
export async function generateAllPageImages(
  book: ParsedStorybook,
  options: ImagePipelineOptions = {},
): Promise<PipelineResult> {
  const {
    onProgress,
    characterSeed: initialSeed,
    skipBackgrounds = false,
    skipCharacters = false,
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
        const imgData = await generateBackgroundImage(desc, styleSuffix);
        bgCache.set(sceneId, imgData);
      } catch (e) {
        console.error(`[StoryImagePipeline] Failed to generate background for scene "${sceneId}":`, e);
        // Continue — page will fall back to bundled SVG
      }

      bgDone++;
      onProgress?.(bgDone, bgTotal, 'background');
    }
  }

  // ── Step 2: Character images (per page) ────────────────────────────────────
  const results: PageImageResult[] = [];
  let currentSeed = initialSeed;

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
      // Generate character
      const { imageData: rawChar, seed } = await generateCharacterImage(
        charDescs,
        page.characterScene!,
        styleSuffix,
        currentSeed,
      );

      // Pin seed after first successful generation
      if (currentSeed == null) currentSeed = seed;

      // Remove background
      let finalChar: string;
      try {
        finalChar = await removeCharacterBg(rawChar);
      } catch {
        // If bg removal fails, use raw image
        finalChar = rawChar;
      }

      results.push({
        pageIndex: index,
        characterImageData: finalChar,
        characterSeed: seed,
        backgroundImageData: bgCache.get(page.sceneId),
      });
    } catch (e) {
      console.error(`[StoryImagePipeline] Failed to generate character for page ${index + 1}:`, e);
      // Still attach background if available
      results.push({
        pageIndex: index,
        backgroundImageData: bgCache.get(page.sceneId),
      });
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

  return { pages: results, characterSeed: currentSeed };
}
