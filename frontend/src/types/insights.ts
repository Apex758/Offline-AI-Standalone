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

export interface InsightsData {
  curriculum: CurriculumSummary;
  performance: PerformanceSummary;
  content: ContentSummary;
  attendance: AttendanceSummary;
}

export interface InsightsPassResult {
  key: string;
  name: string;
  output: string;
}

export interface InsightsReport {
  id: string;
  generated_at: string;
  passes: InsightsPassResult[];
  synthesis: string;
}
