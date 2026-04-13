/**
 * IndexedDB storage for storybook binary assets (images + audio).
 *
 * localStorage holds lightweight metadata; this module handles the heavy
 * base64 images and WAV audio blobs that would exceed localStorage quotas.
 */

import type { StoryPage, CoverPage } from '../types/storybook';

const DB_NAME = 'StorybookAssetsDB';
const DB_VERSION = 1;
const IMAGES_STORE = 'images';
const AUDIO_STORE = 'audio';

// ─── DB singleton ───────────────────────────────────────────────────────────

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE, { keyPath: ['storybookId', 'pageIndex', 'type'] });
      }
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE, { keyPath: ['storybookId', 'pageIndex', 'segmentIndex'] });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbPromise = null;
      reject(req.error);
    };
  });
  return dbPromise;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Convert a base64 data URI (data:image/png;base64,...) to a Blob */
function dataURItoBlob(dataURI: string): Blob {
  const [header, b64] = dataURI.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
  const bytes = atob(b64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

/** Convert a Blob back to a base64 data URI */
function blobToDataURI(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ─── Images ─────────────────────────────────────────────────────────────────

export async function saveStorybookImages(storybookId: string, pages: StoryPage[], coverPage?: CoverPage): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(IMAGES_STORE, 'readwrite');
  const store = tx.objectStore(IMAGES_STORE);

  // Save cover image at pageIndex -1
  if (coverPage?.coverImageData) {
    store.put({
      storybookId,
      pageIndex: -1,
      type: 'cover',
      blob: dataURItoBlob(coverPage.coverImageData),
    });
  }

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (page.characterImageData) {
      store.put({
        storybookId,
        pageIndex: i,
        type: 'character',
        blob: dataURItoBlob(page.characterImageData),
      });
    }
    if (page.characterImageData2) {
      store.put({
        storybookId,
        pageIndex: i,
        type: 'character2',
        blob: dataURItoBlob(page.characterImageData2),
      });
    }
    if (page.backgroundImageData) {
      store.put({
        storybookId,
        pageIndex: i,
        type: 'background',
        blob: dataURItoBlob(page.backgroundImageData),
      });
    }
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Returns a map of "pageIndex:type" → data URI string */
export async function loadStorybookImages(storybookId: string): Promise<Map<string, string>> {
  const db = await openDB();
  const tx = db.transaction(IMAGES_STORE, 'readonly');
  const store = tx.objectStore(IMAGES_STORE);

  return new Promise((resolve, reject) => {
    const results = new Map<string, string>();
    const req = store.openCursor();

    req.onsuccess = async () => {
      const cursor = req.result;
      if (cursor) {
        const rec = cursor.value as { storybookId: string; pageIndex: number; type: string; blob: Blob };
        if (rec.storybookId === storybookId) {
          const dataURI = await blobToDataURI(rec.blob);
          results.set(`${rec.pageIndex}:${rec.type}`, dataURI);
        }
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function hasStorybookImages(storybookId: string): Promise<boolean> {
  const db = await openDB();
  const tx = db.transaction(IMAGES_STORE, 'readonly');
  const store = tx.objectStore(IMAGES_STORE);

  return new Promise((resolve, reject) => {
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) { resolve(false); return; }
      if ((cursor.value as any).storybookId === storybookId) {
        resolve(true);
      } else {
        cursor.continue();
      }
    };
    req.onerror = () => reject(req.error);
  });
}

// ─── Audio ──────────────────────────────────────────────────────────────────

export interface AudioEntry {
  pageIndex: number;
  segmentIndex: number;
  blob: Blob;
}

export async function saveStorybookAudio(storybookId: string, entries: AudioEntry[]): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(AUDIO_STORE, 'readwrite');
  const store = tx.objectStore(AUDIO_STORE);

  for (const entry of entries) {
    store.put({
      storybookId,
      pageIndex: entry.pageIndex,
      segmentIndex: entry.segmentIndex,
      blob: entry.blob,
    });
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Returns a map of "pageIndex:segmentIndex" → WAV Blob */
export async function loadStorybookAudio(storybookId: string): Promise<Map<string, Blob>> {
  const db = await openDB();
  const tx = db.transaction(AUDIO_STORE, 'readonly');
  const store = tx.objectStore(AUDIO_STORE);

  return new Promise((resolve, reject) => {
    const results = new Map<string, Blob>();
    const req = store.openCursor();

    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        const rec = cursor.value as { storybookId: string; pageIndex: number; segmentIndex: number; blob: Blob };
        if (rec.storybookId === storybookId) {
          results.set(`${rec.pageIndex}:${rec.segmentIndex}`, rec.blob);
        }
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function hasStorybookAudio(storybookId: string): Promise<boolean> {
  const db = await openDB();
  const tx = db.transaction(AUDIO_STORE, 'readonly');
  const store = tx.objectStore(AUDIO_STORE);

  return new Promise((resolve, reject) => {
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) { resolve(false); return; }
      if ((cursor.value as any).storybookId === storybookId) {
        resolve(true);
      } else {
        cursor.continue();
      }
    };
    req.onerror = () => reject(req.error);
  });
}

// ─── Cleanup ────────────────────────────────────────────────────────────────

export async function deleteStorybookAssets(storybookId: string): Promise<void> {
  const db = await openDB();

  async function clearStore(storeName: string) {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.openCursor();

    return new Promise<void>((resolve, reject) => {
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          if ((cursor.value as any).storybookId === storybookId) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      req.onerror = () => reject(req.error);
    });
  }

  await clearStore(IMAGES_STORE);
  await clearStore(AUDIO_STORE);
}

// ─── Size estimation ────────────────────────────────────────────────────────

export async function getStorybookAssetSize(storybookId: string): Promise<{ images: number; audio: number }> {
  const db = await openDB();
  let images = 0;
  let audio = 0;

  async function sumStore(storeName: string): Promise<number> {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    let total = 0;

    return new Promise((resolve, reject) => {
      const req = store.openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          const rec = cursor.value as any;
          if (rec.storybookId === storybookId && rec.blob instanceof Blob) {
            total += rec.blob.size;
          }
          cursor.continue();
        } else {
          resolve(total);
        }
      };
      req.onerror = () => reject(req.error);
    });
  }

  images = await sumStore(IMAGES_STORE);
  audio = await sumStore(AUDIO_STORE);
  return { images, audio };
}
