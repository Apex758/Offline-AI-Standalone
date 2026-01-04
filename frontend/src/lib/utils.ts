export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Converts a hex color to HSL format
 */
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove the hash if present
  hex = hex.replace(/^#/, '');

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Converts HSL to hex color
 */
function hslToHex(h: number, s: number, l: number): string {
  s = s / 100;
  l = l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generates color variants for tab styling based on a base hex color
 * @param baseColor - Hex color string (e.g., "#3b82f6")
 * @returns Object with border, bg, and activeBg color values
 */
export function generateColorVariants(baseColor: string): {
  border: string;
  bg: string;
  activeBg: string;
} {
  const hsl = hexToHSL(baseColor);

  // Create a richer background color with canvas-like texture
  // Increase saturation slightly and adjust lightness more subtly for vibrancy
  const bgSaturation = Math.min(100, hsl.s + 10); // Boost saturation for richness
  const bgLightness = Math.min(92, hsl.l + 25); // More subtle lightness increase for depth
  const bgColor = hslToHex(hsl.h, bgSaturation, bgLightness);

  // Create a slightly darker, more saturated active color for pop
  const activeSaturation = Math.min(100, hsl.s + 15);
  const activeLightness = Math.max(15, hsl.l - 8); // Slightly darker for contrast
  const activeColor = hslToHex(hsl.h, activeSaturation, activeLightness);

  return {
    border: activeColor,   // Use enhanced active color for border
    bg: bgColor,           // Richer background with canvas-like depth
    activeBg: activeColor  // More vibrant active state
  };
}

/**
 * Determines if a hex color is dark or light based on relative luminance
 * @param hexColor - Hex color string (e.g., "#1e293b")
 * @returns true if the color is dark, false if light
 */
export function isColorDark(hexColor: string): boolean {
  // Remove the hash if present
  const hex = hexColor.replace(/^#/, '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate relative luminance using the formula from WCAG
  // https://www.w3.org/TR/WCAG20/#relativeluminancedef
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // If luminance is less than 0.5, the color is dark
  return luminance < 0.5;
}

/**
 * Downloads data as a JSON file
 * @param data - The data to export as JSON
 * @param filename - The name of the file to download
 */
export function downloadJSON(data: unknown, filename: string): void {
  // Format the JSON nicely with 2-space indentation
  const jsonString = JSON.stringify(data, null, 2);
  
  // Create a Blob from the JSON string
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  // Create a download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Trigger the download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}