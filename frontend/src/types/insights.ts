export interface CurriculumSummary {
  total: number;
  completed: number;
  pct: number;
  gaps: string[];
  has_data: boolean;
  breakdown?: { grade: string; subject: string; total: number; completed: number; in_progress: number }[];
}

export interface PerformanceSummary {
  avgScore: number;
  totalStudents: number;
  distribution: Record<string, number>;
  has_data: boolean;
  bySubject?: { subject: string; avg: number; count: number }[];
}

export interface ContentSummary {
  totalResources: number;
  byType: Record<string, number>;
  topType: string;
  has_data: boolean;
  subjectDistribution?: Record<string, number>;
  recent7d?: number;
  recent30d?: number;
}

export interface AttendanceSummary {
  avgRate: number;
  atRiskCount: number;
  engagementDistribution?: Record<string, number>;
  has_data: boolean;
  byClass?: Record<string, number>;
}

export interface AchievementSummary {
  totalEarned: number;
  totalAvailable: number;
  totalPoints: number;
  rank: { level: number; title: string; next_title?: string; achievements_for_next?: number } | null;
  streakDays: number;
  totalActiveDays: number;
  has_data: boolean;
  byCategory?: Record<string, { earned: number; total: number }>;
}

export interface InsightsData {
  curriculum: CurriculumSummary;
  performance: PerformanceSummary;
  content: ContentSummary;
  attendance: AttendanceSummary;
  achievements: AchievementSummary;
}

export interface InsightsPassResult {
  key: string;
  name: string;
  output: string;
}

export interface InsightsReminder {
  dimension: string;
  issue: string;
  streak_count: number;
  suggestion: string;
}

export interface InsightsReport {
  id: string;
  generated_at: string;
  from_date?: string;
  to_date?: string;
  previous_report_id?: string;
  passes: InsightsPassResult[];
  synthesis: string;
  reminders?: InsightsReminder[];
  metrics?: TeacherMetrics;
  academic_phase_key?: string;
  academic_phase_label?: string;
  semester_label?: string;
}

// ── Teacher Performance Metrics ──────────────────────────────────────────────

export type SchoolPhase =
  // Generic phases
  | 'start_of_year' | 'early_year' | 'mid_year' | 'pre_exam'
  | 'exam_period' | 'post_exam' | 'vacation' | 'reopening'
  // Caribbean two-semester phases
  | 'semester_1_early' | 'midterm_1_prep' | 'midterm_1' | 'semester_1_late'
  | 'inter_semester_break'
  | 'semester_2_early' | 'midterm_2_prep' | 'midterm_2' | 'semester_2_late'
  | 'end_of_year_exam';

export interface DimensionMetric {
  score: number;
  grade: string;
  weight: number;
  weighted_score: number;
  description: string;
  components: { label: string; value: number; max: number }[];
  tips: string[];
  trend?: 'up' | 'down' | 'neutral';
}

export interface TeacherMetrics {
  composite_score: number;
  composite_grade: string;
  phase: {
    phase: SchoolPhase;
    phase_label: string;
    semester: string | null;
    next_event: string | null;
    days_until: number | null;
    academic_phase_id: string | null;
    academic_phase_key: string;
  };
  dimensions: Record<'curriculum' | 'performance' | 'content' | 'attendance' | 'achievements', DimensionMetric>;
  computed_at: string;
}

export interface MetricSnapshot {
  id: string;
  computed_at: string;
  phase: SchoolPhase;
  phase_label: string;
  composite_score: number;
  composite_grade: string;
  curriculum_score: number;
  performance_score: number;
  content_score: number;
  attendance_score: number;
  achievements_score: number;
  weights_json?: string;
  academic_phase_id?: string | null;
  academic_phase_key?: string | null;
  semester_label?: string | null;
}

export interface AcademicPhase {
  id: string;
  config_id: string;
  teacher_id: string;
  phase_key: string;
  phase_label: string;
  semester: string | null;
  start_date: string;
  end_date: string;
  phase_order: number;
}

export interface AcademicPhaseSummary {
  id: string;
  config_id: string;
  teacher_id: string;
  phase_key: string;
  phase_label: string;
  semester: string | null;
  start_date: string;
  end_date: string;
  avg_composite: number;
  peak_composite: number;
  low_composite: number;
  snapshot_count: number;
  dimension_deltas: Record<string, number>;
  narrative?: string;
  generated_at: string;
}

export interface PhaseHistoryEntry {
  phase_key: string;
  phase_label: string;
  semester: string | null;
  start_date: string;
  end_date: string;
  phase_order: number;
  snapshots: MetricSnapshot[];
  phase_summary: AcademicPhaseSummary | null;
}

export interface SchoolYearConfig {
  id: string;
  teacher_id: string;
  label: string;
  start_date: string;
  end_date: string;
  is_active: number;
  structure_type: 'generic' | 'caribbean_two_semester';
}

// ── Educator Coach ───────────────────────────────────────────────────────────

export interface ConsultantConversation {
  id: string;
  teacher_id: string;
  title: string | null;
  dimension_focus: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConsultantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
