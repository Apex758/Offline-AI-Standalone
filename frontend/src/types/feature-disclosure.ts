// Feature Disclosure System Types

export type FeatureModuleId =
  | 'lesson-planning'
  | 'curriculum-resources'
  | 'assessment-tools'
  | 'student-management'
  | 'ai-assistant'
  | 'creative-studio';

export interface FeatureModule {
  id: FeatureModuleId;
  name: string;
  description: string;
  icon: string;           // Key into Dashboard's iconMap
  sidebarItems: string[]; // Sidebar item IDs this module controls
  tools: string[];        // Human-readable tool names for display
}

export interface PersonaPreset {
  id: string;
  label: string;
  description: string;
  modules: FeatureModuleId[];
}

export interface NudgeRule {
  /** Tab type the teacher is currently viewing */
  triggerTabType: string;
  /** Module that must be disabled for the nudge to fire */
  disabledModule: FeatureModuleId;
  /** Message shown in the nudge toast */
  message: string;
  /** CTA label on the enable button */
  ctaLabel: string;
  /** Tab type to navigate to after enabling */
  navigateToTab?: string;
}

export interface NudgeState {
  /** Nudge IDs the teacher has permanently dismissed */
  dismissedNudges: string[];
  /** Map of nudge ID → timestamp of last dismissal (for cooldown) */
  nudgeCooldowns: Record<string, number>;
}
