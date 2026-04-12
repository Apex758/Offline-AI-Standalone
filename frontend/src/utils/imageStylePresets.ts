export type StylePresetId = "cartoon_3d" | "illustrated_painting" | "realistic";

export interface StylePreset {
  id: StylePresetId;
  label: string;
  hint: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "cartoon_3d",
    label: "Cartoon",
    hint: "Vibrant cartoon with bold colors and smooth shading",
  },
  {
    id: "illustrated_painting",
    label: "Painting",
    hint: "Rich oil painting with visible brushstrokes",
  },
  {
    id: "realistic",
    label: "Realistic",
    hint: "Professional photo with natural lighting",
  },
];

export const STYLE_SUFFIXES: Record<StylePresetId, string> = {
  cartoon_3d:
    ", cartoon illustration, flat vector art, soft gradient colors, correct anatomy, no text",
  illustrated_painting:
    ", oil painting, moody and atmospheric, rich deep colors, no text",
  realistic:
    ", hyper realistic, anatomically correct, no text",
};
