// Progress Calculator Utility
// Weights: Course 30% | Assessment 20% | Coding 20% | Project 30%

export interface ProgressBreakdown {
  course: number;      // 0-100
  assessment: number;  // 0-100
  coding: number;      // 0-100
  project: number;     // 0-100
  overall: number;     // 0-100 weighted
}

const WEIGHTS = {
  course: 0.30,
  assessment: 0.20,
  coding: 0.20,
  project: 0.30,
} as const;

/**
 * Calculate a single category's completion percentage.
 * @param completed - number of completed items
 * @param total - total items
 */
export function categoryProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round(Math.min((completed / total) * 100, 100));
}

/**
 * Calculate overall weighted progress from individual category scores.
 */
export function calculateOverallProgress(breakdown: Omit<ProgressBreakdown, 'overall'>): number {
  const overall =
    breakdown.course * WEIGHTS.course +
    breakdown.assessment * WEIGHTS.assessment +
    breakdown.coding * WEIGHTS.coding +
    breakdown.project * WEIGHTS.project;
  return Math.round(Math.min(overall, 100));
}

/**
 * Full progress breakdown given counts of completed items in each category.
 */
export function computeProgressBreakdown(params: {
  coursesCompleted: number;
  totalCourses: number;
  assessmentsPassed: number;
  totalAssessments: number;
  challengesCompleted: number;
  totalChallenges: number;
  projectsCompleted: number;
  totalProjects: number;
}): ProgressBreakdown {
  const course = categoryProgress(params.coursesCompleted, params.totalCourses);
  const assessment = categoryProgress(params.assessmentsPassed, params.totalAssessments);
  const coding = categoryProgress(params.challengesCompleted, params.totalChallenges);
  const project = categoryProgress(params.projectsCompleted, params.totalProjects);
  const overall = calculateOverallProgress({ course, assessment, coding, project });
  return { course, assessment, coding, project, overall };
}

/**
 * Average assessment score from an array of individual scores (0-100).
 */
export function averageScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
}

/**
 * Format a progress value as a percentage string.
 */
export function formatProgress(value: number): string {
  return `${Math.round(value)}%`;
}
