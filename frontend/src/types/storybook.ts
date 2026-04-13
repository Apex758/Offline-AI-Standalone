import type { ImageMode } from './index';

// ─── Speaker / Voice ────────────────────────────────────────────────────────

export type VoiceName =
  | 'lessac' | 'ryan' | 'amy' | 'joe' | 'danny' | 'kusal'
  | 'jenny' | 'alan' | 'alba' | 'cori' | 'northern' | 'southern'
  | 'siwis' | 'gilles'
  | 'sharvard' | 'carlfm';
export type SpeakerRole = 'narrator' | 'character1' | 'character2';

export interface SpeakerConfig {
  role: SpeakerRole;
  voice: VoiceName;
  /** The character's name as it will appear in dialogue tags (e.g., "Max", "Luna") */
  characterName?: string;
}

// ─── Story Content ───────────────────────────────────────────────────────────

export interface TextSegment {
  /** Either 'narrator' or a character name matching a SpeakerConfig.characterName */
  speaker: string;
  text: string;
}

export interface StoryPage {
  pageNumber: number;
  /** All text segments on this page, tagged by speaker */
  textSegments: TextSegment[];
  /** References a scene in ParsedStorybook.scenes[].id */
  sceneId: string;
  /** Short diffusion prompt for character image (when imageMode === 'ai') */
  characterScene?: string;
  /** Bundled scene key — set after matching sceneId to bundled library */
  bundledSceneId?: string;
  /** base64 PNG of the character with background removed */
  characterImageData?: string;
  /** Seed used for character image generation — reuse across pages for visual consistency */
  characterSeed?: number;
  /** base64 of the background scene (custom-generated or uploaded) */
  backgroundImageData?: string;
  /** Which side the character floats to for CSS shape-outside layout */
  imagePlacement: 'left' | 'right' | 'none';
  /** animate.css class hint for character entrance */
  characterAnimation?: 'slideInLeft' | 'slideInRight' | 'bounceIn' | 'fadeIn' | 'zoomIn';
  /** animate.css class hint for text entrance */
  textAnimation?: 'fadeIn' | 'slideInUp';
  /** Name of the character whose image is in characterImageData */
  characterName?: string;
  /** Short diffusion prompt for the 2nd character (when two characters on page) */
  characterScene2?: string;
  /** base64 PNG of the 2nd character with background removed */
  characterImageData2?: string;
  /** Seed used for 2nd character image generation */
  characterSeed2?: number;
  /** Name of the 2nd character (e.g., "Alice") */
  characterName2?: string;
}

export interface StoryScene {
  id: string;
  /** Description used to fuzzy-match against bundled scene names */
  description: string;
}

// ─── Introduction Page ───────────────────────────────────────────────────────

/**
 * Opening mood-setting page that sits between the cover and page 1.
 * 3-5 narrator-only sentences that introduce the atmosphere/setting
 * before the story action begins. Mandatory for new stories; optional
 * in the type for backwards compatibility with saved stories that
 * pre-date this field.
 */
export interface IntroductionPage {
  /** 3-5 narrator-only sentences setting the mood and place. */
  moodText: string;
  /** References a scene in ParsedStorybook.scenes[].id */
  sceneId: string;
  /** Bundled scene id after fuzzy matching (set client-side). */
  bundledSceneId?: string;
  /** Optional background image data (custom-generated or uploaded). */
  backgroundImageData?: string;
}

export interface ParsedStorybook {
  title: string;
  gradeLevel: 'K' | '1' | '2';
  /** Character names in the story */
  characters?: string[];
  /**
   * Hyper-detailed visual descriptions per character for prompt anchoring.
   * Key = character name, value = detailed visual description.
   */
  characterDescriptions?: Record<string, string>;
  /**
   * Maps speaker role/name → voice name.
   * Built from teacher's SpeakerConfig, injected into LLM prompt.
   */
  voiceAssignments?: Record<string, VoiceName>;
  /** Locked style suffix for all AI image generation */
  styleSuffix?: string;
  /** Unique scene locations — pages reference these by id */
  scenes: StoryScene[];
  pages: StoryPage[];
  /**
   * Comprehension questions + discussion prompts generated alongside the story.
   * Used by teachers to check understanding and connect to classwork.
   */
  comprehensionQuestions?: ComprehensionQuestion[];
  /** One-sentence summary of the curriculum learning objective embedded in the story */
  learningObjectiveSummary?: string;
  /**
   * Reference images per character for img2img consistency.
   * Key = character name (or 'default'), value = base64 image data.
   * Generated on first character image, reused as init_image for subsequent pages.
   */
  characterReferenceImages?: Record<string, string>;
  /** Optional cover page data (title, author, cover image) */
  coverPage?: CoverPage;
  /**
   * Opening mood-setting page between cover and page 1. Optional in the
   * type so older saved stories without it still load; new stories
   * always have it (enforced by the grammar-constrained JSON schema).
   */
  introductionPage?: IntroductionPage;
}

// ─── Cover Page ─────────────────────────────────────────────────────────────

export interface CoverPage {
  title: string;
  subtitle?: string;
  authorName?: string;
  /** base64 image data for the cover illustration */
  coverImageData?: string;
  /** Accent color override for the cover (defaults to tab accent) */
  accentColor?: string;
}

// ─── Comprehension ───────────────────────────────────────────────────────────

export interface ComprehensionQuestion {
  question: string;
  /** Expected answer or discussion points for the teacher */
  answer: string;
  /** Which SCO/ELO this question targets */
  outcomeRef?: string;
}

// ─── Form Data ───────────────────────────────────────────────────────────────

export interface StorybookFormData {
  title: string;
  description: string;
  gradeLevel: 'K' | '1' | '2';
  subject: string;
  /** Optional author/teacher name displayed on the cover page */
  authorName: string;
  pageCount: number;
  imageMode: ImageMode;
  /** Visual style preset for AI image generation */
  stylePreset: 'cartoon_3d' | 'line_art_bw' | 'illustrated_painting' | 'realistic';
  /** Number of unique backgrounds to generate, or 'auto' to let the AI decide */
  backgroundCount: number | 'auto';
  speakerCount: 1 | 2 | 3;
  speakers: SpeakerConfig[];
  // Curriculum alignment
  useCurriculum: boolean;
  strand: string;
  essentialOutcomes: string;
  specificOutcomes: string;
}

// ─── Bundled Scene Library ───────────────────────────────────────────────────

export type SceneCategory = 'outdoors' | 'indoors' | 'fantasy' | 'weather';

export interface BundledScene {
  id: string;
  name: string;
  category: SceneCategory;
  /** Path relative to assets/storybook-scenes/ */
  file: string;
  /** Keywords for fuzzy matching against LLM sceneId */
  keywords: string[];
}

// ─── Export / Playback ───────────────────────────────────────────────────────

export interface StorybookAudioData {
  /** pageIndex → array of base64 WAV strings (one per text segment) */
  pageAudio: Record<number, string[]>;
}

// ─── Export Settings ─────────────────────────────────────────────────────────

export interface StorybookExportSettings {
  /** Default export format when clicking the export button */
  defaultFormat: 'pdf' | 'pptx' | 'html';
  /** Whether to include TTS audio in the interactive HTML export */
  includeAudioInHTML: boolean;
  /** Whether to append comprehension questions page in PDF/PPTX exports */
  includeComprehensionQuestions: boolean;
}

// ─── Saved Drafts / History ──────────────────────────────────────────────────

export interface SavedStorybook {
  /** Unique identifier */
  id: string;
  /** When this was saved */
  savedAt: string;
  /** Whether this is a completed storybook or a work-in-progress draft */
  status: 'draft' | 'completed';
  /** The form data at time of save */
  formData: StorybookFormData;
  /** The parsed book data (null if draft saved before generation) */
  parsedBook: ParsedStorybook | null;
  /** Whether images were saved to IndexedDB */
  hasImages?: boolean;
  /** Whether TTS audio was saved to IndexedDB */
  hasAudio?: boolean;
}
