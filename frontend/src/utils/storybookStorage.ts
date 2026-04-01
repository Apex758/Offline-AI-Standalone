import type { SavedStorybook, StorybookFormData, ParsedStorybook, StorybookExportSettings } from '../types/storybook';
import { saveStorybookImages, deleteStorybookAssets } from './storybookIndexedDB';

const STORAGE_KEY = 'storybook_history';
const EXPORT_SETTINGS_KEY = 'storybook_export_settings';

export interface SaveOptions {
  includeImages?: boolean;
  includeAudio?: boolean;
}

// ─── Saved Storybooks ────────────────────────────────────────────────────────

export function getSavedStorybooks(): SavedStorybook[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(items: SavedStorybook[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function saveStorybook(
  formData: StorybookFormData,
  parsedBook: ParsedStorybook | null,
  existingId?: string,
  options?: SaveOptions,
): SavedStorybook {
  const items = getSavedStorybooks();
  const status = parsedBook && parsedBook.pages.length > 0 ? 'completed' : 'draft';
  const includeImages = options?.includeImages ?? true;

  // Strip heavy image data for localStorage to avoid quota issues
  const lightBook = parsedBook ? stripImageData(parsedBook) : null;

  // Check if any images exist to save
  const anyImages = parsedBook?.pages.some(p => p.characterImageData || p.backgroundImageData) ?? false;
  const hasImages = includeImages && anyImages;

  if (existingId) {
    const idx = items.findIndex(s => s.id === existingId);
    if (idx !== -1) {
      items[idx] = {
        ...items[idx],
        savedAt: new Date().toISOString(),
        status,
        formData,
        parsedBook: lightBook,
        hasImages: hasImages || items[idx].hasImages,
        hasAudio: options?.includeAudio || items[idx].hasAudio,
      };
      persist(items);
      // Save images to IndexedDB (async, fire-and-forget for the sync return)
      if (hasImages && parsedBook) {
        saveStorybookImages(existingId, parsedBook.pages).catch(e =>
          console.error('[StorybookStorage] Failed to save images to IndexedDB:', e)
        );
      }
      return items[idx];
    }
  }

  const entry: SavedStorybook = {
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
    status,
    formData,
    parsedBook: lightBook,
    hasImages,
    hasAudio: options?.includeAudio ?? false,
  };
  items.unshift(entry); // newest first

  // Keep max 30 entries
  if (items.length > 30) {
    // Clean up IndexedDB assets for evicted entries
    for (const evicted of items.slice(30)) {
      deleteStorybookAssets(evicted.id).catch(() => {});
    }
    items.length = 30;
  }

  persist(items);

  // Save images to IndexedDB
  if (hasImages && parsedBook) {
    saveStorybookImages(entry.id, parsedBook.pages).catch(e =>
      console.error('[StorybookStorage] Failed to save images to IndexedDB:', e)
    );
  }

  return entry;
}

export function deleteSavedStorybook(id: string) {
  const items = getSavedStorybooks().filter(s => s.id !== id);
  persist(items);
  // Clean up IndexedDB assets
  deleteStorybookAssets(id).catch(e =>
    console.error('[StorybookStorage] Failed to delete IndexedDB assets:', e)
  );
}

export function getSavedStorybook(id: string): SavedStorybook | undefined {
  return getSavedStorybooks().find(s => s.id === id);
}

/** Strip base64 image data to keep localStorage small */
function stripImageData(book: ParsedStorybook): ParsedStorybook {
  return {
    ...book,
    pages: book.pages.map(p => ({
      ...p,
      characterImageData: undefined,
      backgroundImageData: undefined,
    })),
  };
}

// ─── Export Settings ─────────────────────────────────────────────────────────

export const DEFAULT_EXPORT_SETTINGS: StorybookExportSettings = {
  defaultFormat: 'html',
  includeAudioInHTML: true,
  includeComprehensionQuestions: true,
};

export function getExportSettings(): StorybookExportSettings {
  try {
    const raw = localStorage.getItem(EXPORT_SETTINGS_KEY);
    if (!raw) return DEFAULT_EXPORT_SETTINGS;
    return { ...DEFAULT_EXPORT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_EXPORT_SETTINGS;
  }
}

export function setExportSettings(settings: StorybookExportSettings) {
  localStorage.setItem(EXPORT_SETTINGS_KEY, JSON.stringify(settings));
}
