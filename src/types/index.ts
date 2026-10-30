export type ViewMode =
  | 'overview'
  | 'my-assessment'
  | 'skill-gap-analysis'
  | 'career-company-matches'
  | 'preparation-roadmap'
  | 'progress-analytics'
  | 'what-if-simulator'
  | 'reports'
  | 'settings'
  | 'admin-cohort'
  | 'admin-dataset-ml';

export type UserRole = 'student' | 'placement_officer' | 'system_admin';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  degree: string;
  branch: string;
  batch: string;
  graduationYear: number;
  cgpa: number;
  backlogs: number;
  targetRole: string;
  targetTier: string;
  readinessScore: number;
  medianBatchPaceDelta: number;
  assessmentCoverage: number;
  verifiedModulesCount: number;
  totalModulesCount: number;
  strongestCompetency: string;
  strongestScore: number;
  priorityGap: string;
  priorityGapScore: number;
  targetGapThreshold: number;
  impactedCompaniesCount: number;
  lastEvaluated: string;
  balanceQuotient: number;
  asymmetryRisk: string;
  completedTasksCount: number;
  totalTasksCount: number;
  weeklyTargetHours: number;
  weeklyHoursLogged: number;
  streakDays: number;
  daysToTargetDrive: number;
  targetDriveCompany: string;
  targetDriveDate: string;
}

export type CompetencyCategory = 'dsa' | 'core-cs' | 'databases' | 'system-design' | 'aptitude' | 'soft-skills' | 'projects';

export interface CompetencyDiagnostic {
  id: string;
  title: string;
  subtitle: string;
  category: CompetencyCategory;
  studentScore: number;
  targetScore: number;
  gapPercent: number; // e.g. -32 or +9
  weight: number; // percentage
  status: 'at-risk' | 'needs-focus' | 'ready';
  priority: 'Critical Priority' | 'High Priority' | 'Medium Priority' | 'Low Priority' | 'Target Surpassed' | 'Benchmark Met';
  assessedVia: string;
  assessedDate: string;
  aiDiagnosticAnalysis: string;
  recommendationAction: string;
}

export interface AssessmentModule {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  questionsCount: number;
  description: string;
  previousScore?: number;
  validatedScore?: number;
  status: 'completed' | 'in_progress' | 'needs_retake' | 'unattempted';
  statusLabel: string;
  attemptsRemaining?: number;
  highlightText: string;
  progressPercent: number;
  icon: string;
  colorTone: 'error' | 'secondary' | 'primary' | 'neutral';
}

export interface QuestionOption {
  id: string;
  label: string;
  note?: string;
  isCorrect: boolean;
}

export interface ExamQuestion {
  id: string;
  number: number;
  section: string;
  category: string;
  type: 'single_mcq' | 'code_review' | 'case_study';
  markingScheme: string; // e.g. "+4 / -1 Mark"
  title: string;
  codeSnippet?: string;
  explanation: string;
  options: QuestionOption[];
  selectedOptionId?: string;
  isFlagged: boolean;
  isAnswered: boolean;
  status: 'answered' | 'not_answered' | 'not_visited' | 'active';
}

export interface RoadmapTask {
  id: string;
  week: number;
  weekTitle: string;
  weekBadge?: string;
  title: string;
  description: string;
  category: 'dsa' | 'core' | 'interview' | 'company-oa';
  domainLabel: string;
  tags: string[];
  dueNotice?: string;
  isCompleted: boolean;
  loggedHours?: number;
  estimatedHours: number;
  detailsData: {
    category: string;
    description: string;
    benchmarkNote: string;
    actionLabel: string;
  };
}

export interface CompanyMatch {
  id: string;
  name: string;
  logoInitial: string;
  logoBg: string;
  role: string;
  tier: 'Tier-1 Tech' | 'Tier-1 Fintech' | 'High-Growth Tech' | 'Mass Premier';
  packageLpa: string;
  location: string;
  minCgpa: number;
  maxBacklogsAllowed: number;
  matchScore: number;
  isEligible: boolean;
  driveDate: string;
  assessmentPlatform: string;
  requiredSkills: { name: string; requiredScore: number; studentScore: number; matched: boolean }[];
  missingCritical: string[];
  isBookmarked: boolean;
}

export interface ScoringWeightsConfig {
  version: string;
  lastUpdated: string;
  updatedBy: string;
  dsaWeight: number; // 25
  coreCsWeight: number; // 15
  sqlDbWeight: number; // 15
  aptitudeWeight: number; // 15
  systemDesignWeight: number; // 15
  academicWeight: number; // 10
  resumeSoftSkillsWeight: number; // 5
  minimumCoverageThreshold: number; // 80%
}

export interface CohortStudent {
  id: string;
  name: string;
  branch: string;
  cgpa: number;
  readinessScore: number;
  status: 'Ready' | 'Needs Focus' | 'At Risk';
  dsaScore: number;
  coreScore: number;
  aptitudeScore: number;
  targetRole: string;
  coverage: number;
}

export interface MLModelBenchmark {
  modelName: string;
  algorithm: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  prAuc: number;
  rocAuc: number;
  isBaseline: boolean;
  statusNote: string;
  featureImportance: {
    feature: string;
    shapImportance: number;
    direction: 'positive' | 'negative';
    coefficient?: number;
  }[];
}
