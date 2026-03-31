import type { TrophyType } from '../assets/trophyImages';

/**
 * Maps achievement IDs to their trophy type.
 * Based on plans/trophy-image-prompts.md mapping table.
 */
const ACHIEVEMENT_TROPHY_MAP: Record<string, TrophyType> = {
  // Scroll — Content Creation
  first_lesson: 'scroll',
  worksheet_first: 'scroll',
  rubric_first: 'scroll',
  presentation_first: 'scroll',
  lesson_veteran: 'scroll',
  quiz_prolific: 'scroll',
  content_50: 'scroll',
  content_100: 'scroll',

  // Quill & Inkwell — Quiz/Writing
  quiz_creator: 'quill',
  answer_key_master: 'quill',

  // Mortarboard — Student Management
  first_student: 'mortarboard',
  class_builder: 'mortarboard',
  full_house: 'mortarboard',
  multi_class: 'mortarboard',

  // Scale — Assessment & Grading
  first_grade: 'scale',
  first_scan_grade: 'scale',
  grading_streak: 'scale',
  worksheet_grader: 'scale',
  scan_grader_20: 'scale',

  // Clipboard — Attendance
  first_attendance: 'clipboard',
  attendance_week: 'clipboard',
  attendance_month: 'clipboard',
  engagement_tracker: 'clipboard',

  // Milestone/Path — Curriculum Progress
  first_milestone: 'milestone',
  milestone_10: 'milestone',
  milestone_50: 'milestone',
  subject_mastery: 'milestone',

  // Compass — Exploration (images not yet available)
  explorer: 'compass',
  kindergarten_pioneer: 'compass',
  multigrade_first: 'compass',
  trailblazer: 'compass',
  cross_curricular: 'compass',
  multigrade_5: 'compass',
  resource_saver_25: 'compass',

  // Flame — Streaks & Daily Use
  streak_3: 'flame',
  streak_7: 'flame',
  streak_30: 'flame',
  active_days_50: 'flame',
  active_days_100: 'flame',

  // Chat Bubble — Ask PEARL (images not yet available)
  first_chat: 'chat-bubble',
  chat_regular: 'chat-bubble',
  chat_messages_50: 'chat-bubble',
  chat_messages_200: 'chat-bubble',

  // Brain — Brain Dump
  first_brain_dump: 'brain',
  brain_dump_10: 'brain',
  brain_dump_actions: 'brain',

  // Bar Chart — Analytics & Image Studio
  first_analytics: 'bar-chart',
  analytics_100: 'bar-chart',
  analytics_500: 'bar-chart',
  image_gen_first: 'bar-chart',
  image_creator: 'bar-chart',
  image_gen_25: 'bar-chart',

  // Owl — Secret
  night_owl: 'owl',
  early_bird: 'owl',

  // Lightning Bolt — Secret (images not yet available)
  marathon_planner: 'lightning',
  variety_pack: 'lightning',
  perfectionist: 'lightning',
  century: 'lightning',
  half_thousand: 'lightning',
};

/**
 * Returns the trophy type for a given achievement ID, or null if unmapped.
 */
export function getTrophyType(achievementId: string): TrophyType | null {
  return ACHIEVEMENT_TROPHY_MAP[achievementId] ?? null;
}
