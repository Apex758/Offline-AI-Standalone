/**
 * Client-side image compression using the browser Canvas API.
 * Converts uploaded images to WebP (or PNG for transparency) and resizes
 * if they exceed the max dimensions. No external library needed.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  /** 'webp' for photos/scenes, 'png' to preserve transparency */
  format?: 'webp' | 'png';
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85,
  format: 'webp',
};

/**
 * Compress an image dataUri using canvas.
 * Returns a compressed base64 dataUri.
 * If the image has transparency (PNG alpha), falls back to 'png' format.
 */
export async function compressImage(
  dataUri: string,
  options: CompressionOptions = {}
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Scale down if needed, preserving aspect ratio
      if (width > opts.maxWidth || height > opts.maxHeight) {
        const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUri); // fallback: return original
        return;
      }

      // For WebP output, fill background white (WebP doesn't support transparency well in all cases)
      // For PNG output, keep transparency
      if (opts.format === 'webp') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = opts.format === 'png' ? 'image/png' : 'image/webp';
      const compressed = canvas.toDataURL(mimeType, opts.quality);

      // Only use compressed version if it's actually smaller
      if (compressed.length < dataUri.length) {
        resolve(compressed);
      } else {
        resolve(dataUri);
      }
    };

    img.onerror = () => {
      resolve(dataUri); // fallback: return original on error
    };

    img.src = dataUri;
  });
}

/**
 * Compress an image while preserving transparency (for character PNGs after bg removal).
 */
export async function compressTransparentImage(
  dataUri: string,
  options: Omit<CompressionOptions, 'format'> = {}
): Promise<string> {
  return compressImage(dataUri, { ...options, format: 'png', quality: 0.9 });
}

/**
 * Get the approximate file size of a base64 dataUri in bytes.
 */
export function getDataUriSize(dataUri: string): number {
  const base64 = dataUri.split(',')[1] ?? '';
  return Math.round((base64.length * 3) / 4);
}

/**
 * Format bytes as a human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
