import { useRef, useEffect, useMemo } from 'react';

/**
 * Global cache: base64 data URI → blob URL.
 * Prevents re-creating blob URLs for the same image data across components/renders.
 * Uses a ref-count so we only revoke when no component needs it.
 */
const blobCache = new Map<string, { url: string; refCount: number }>();

function getOrCreateBlobUrl(dataUri: string): string {
  const existing = blobCache.get(dataUri);
  if (existing) {
    existing.refCount++;
    return existing.url;
  }

  try {
    // Convert base64 data URI to blob
    const [header, ...rest] = dataUri.split(',');
    const base64 = rest.join(',').replace(/\s/g, ''); // strip whitespace/newlines
    const mimeMatch = header.match(/data:([^;]+)/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: mime });
    const url = URL.createObjectURL(blob);
    blobCache.set(dataUri, { url, refCount: 1 });
    return url;
  } catch {
    // If decoding fails, fall back to the raw data URI
    return dataUri;
  }
}

function releaseBlobUrl(dataUri: string): void {
  const entry = blobCache.get(dataUri);
  if (!entry) return;
  entry.refCount--;
  if (entry.refCount <= 0) {
    // Only revoke if it's a blob URL (not a fallback data URI)
    if (entry.url.startsWith('blob:')) {
      URL.revokeObjectURL(entry.url);
    }
    blobCache.delete(dataUri);
  }
}

/**
 * Convert a base64 data URI to a blob URL for efficient rendering.
 * The blob URL is cached globally and only revoked when no component uses it.
 * Returns undefined if the input is falsy.
 */
export function useBlobUrl(dataUri: string | undefined): string | undefined {
  const prevDataUri = useRef<string | undefined>(undefined);

  const blobUrl = useMemo(() => {
    if (!dataUri || !dataUri.startsWith('data:')) return dataUri;
    return getOrCreateBlobUrl(dataUri);
  }, [dataUri]);

  useEffect(() => {
    const prev = prevDataUri.current;
    prevDataUri.current = dataUri;

    // Release old blob on data change
    if (prev && prev !== dataUri && prev.startsWith('data:')) {
      releaseBlobUrl(prev);
    }

    // Cleanup on unmount
    return () => {
      if (dataUri && dataUri.startsWith('data:')) {
        releaseBlobUrl(dataUri);
      }
    };
  }, [dataUri]);

  return blobUrl;
}
