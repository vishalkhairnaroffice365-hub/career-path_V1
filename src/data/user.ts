export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  earnedAt?: string; // ISO date string
  isEarned: boolean;
  category: 'milestone' | 'skill' | 'streak' | 'social' | 'special';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string; // emoji or initials
  joinedAt: string;
  selectedCareerId?: string;
  onboardingCompleted: boolean;
  onboardingData?: OnboardingData;
  progress: UserProgress;
  achievements: Achievement[];
  stats: UserStats;
}

export interface OnboardingData {
  // Step 1: About You
  name: string;
  age?: string;
  location?: string;
  currentRole?: string;
  educationLevel?: string;
  // Step 2: Interests
  interests: string[];
  hobbies: string[];
  // Step 3: Skills
  currentSkills: string[];
  experienceLevel: 'complete-beginner' | 'some-experience' | 'intermediate' | 'advanced';
  // Step 4: Strengths
  strengths: string[];
  workStyle: string[];
  // Step 5: Work Style
  preferredEnvironment: string;
  collaboration: string;
  learningStyle: string;
  // Step 6: Career Goals
  primaryGoal: string;
  timeHorizon: string;
  salaryExpectation: string;
  // Step 7: Future Vision
  fiveYearVision: string;
  impactArea: string;
  motivations: string[];
}

export interface UserProgress {
  completedNodeIds: string[];
  inProgressNodeIds: string[];
  completedProjectIds: string[];
  completedResourceIds: string[];
  currentPhase: number;
  totalProgress: number; // 0-100
  weeklyGoalHours: number;
  hoursThisWeek: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
}

export interface UserStats {
  totalHoursLearned: number;
  skillsAcquired: number;
  projectsCompleted: number;
  resourcesConsumed: number;
  careerReadinessScore: number; // 0-100
}

export const defaultUser: UserProfile = {
  id: 'user-1',
  name: 'Alex',
  email: 'alex@example.com',
  avatar: '🧑‍💻',
  joinedAt: '2025-01-15T10:00:00Z',
  selectedCareerId: undefined,
  onboardingCompleted: false,
  progress: {
    completedNodeIds: ['kotlin-basics', 'android-setup', 'git-basics', 'python-ml', 'math-ml', 'html-css-basics', 'js-basics'],
    inProgressNodeIds: ['android-ui', 'ml-fundamentals', 'typescript-intro'],
    completedProjectIds: ['hello-android', 'titanic-kaggle', 'landing-page'],
    completedResourceIds: ['android-dev-course', 'kotlin-koans'],
    currentPhase: 2,
    totalProgress: 28,
    weeklyGoalHours: 15,
    hoursThisWeek: 9,
    streak: 12,
    longestStreak: 21,
    lastActiveDate: new Date().toISOString(),
  },
  achievements: [
    { id: 'first-step', title: 'First Step', description: 'Completed your first learning node', emoji: '👣', isEarned: true, earnedAt: '2025-01-16T10:00:00Z', category: 'milestone' },
    { id: 'week-streak', title: 'Week Warrior', description: 'Maintained a 7-day learning streak', emoji: '🔥', isEarned: true, earnedAt: '2025-01-23T10:00:00Z', category: 'streak' },
    { id: 'first-project', title: 'Builder', description: 'Completed your first project', emoji: '🏗️', isEarned: true, earnedAt: '2025-01-20T10:00:00Z', category: 'skill' },
    { id: 'sky-explorer', title: 'Sky Explorer', description: 'Explored all career domains in Career Sky', emoji: '☁️', isEarned: false, category: 'milestone' },
    { id: 'career-chosen', title: 'Decided', description: 'Selected your career path', emoji: '🎯', isEarned: false, category: 'milestone' },
    { id: 'month-streak', title: 'Dedicated', description: 'Maintained a 30-day learning streak', emoji: '💎', isEarned: false, category: 'streak' },
    { id: 'social-butterfly', title: 'Connected', description: 'Joined 3 community discussions', emoji: '🦋', isEarned: false, category: 'social' },
    { id: 'first-phase', title: 'Phase Complete', description: 'Finished your first roadmap phase', emoji: '🏁', isEarned: false, category: 'milestone' },
    { id: 'resource-reader', title: 'Curious Mind', description: 'Completed 5 learning resources', emoji: '📚', isEarned: false, category: 'skill' },
    { id: 'portfolio-ready', title: 'Portfolio Ready', description: 'Completed 3 portfolio-worthy projects', emoji: '✨', isEarned: false, category: 'special' },
  ],
  stats: {
    totalHoursLearned: 68,
    skillsAcquired: 5,
    projectsCompleted: 3,
    resourcesConsumed: 2,
    careerReadinessScore: 28,
  },
};
