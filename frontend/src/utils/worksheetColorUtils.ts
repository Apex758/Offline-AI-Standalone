/**
 * Derive a full color palette from a single accent hex color.
 * Used by all worksheet templates to support custom color theming.
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function mix(color: { r: number; g: number; b: number }, target: { r: number; g: number; b: number }, amount: number) {
  return {
    r: color.r + (target.r - color.r) * amount,
    g: color.g + (target.g - color.g) * amount,
    b: color.b + (target.b - color.b) * amount,
  };
}

export interface WorksheetPalette {
  accent: string;
  accentLight: string;    // very light bg (10% opacity feel)
  accentLighter: string;  // even lighter bg
  accentBorder: string;   // medium border
  accentText: string;     // darkened for text on white bg
  accentDark: string;     // darker variant (for secondary elements)
  accentMuted: string;    // subtle/muted shade
}

export function deriveWorksheetPalette(accent: string): WorksheetPalette {
  const rgb = hexToRgb(accent);
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };

  const light = mix(rgb, white, 0.9);
  const lighter = mix(rgb, white, 0.95);
  const border = mix(rgb, white, 0.65);
  const dark = mix(rgb, black, 0.2);
  const text = mix(rgb, black, 0.3);
  const muted = mix(rgb, white, 0.5);

  return {
    accent,
    accentLight: rgbToHex(light.r, light.g, light.b),
    accentLighter: rgbToHex(lighter.r, lighter.g, lighter.b),
    accentBorder: rgbToHex(border.r, border.g, border.b),
    accentText: rgbToHex(text.r, text.g, text.b),
    accentDark: rgbToHex(dark.r, dark.g, dark.b),
    accentMuted: rgbToHex(muted.r, muted.g, muted.b),
  };
}
