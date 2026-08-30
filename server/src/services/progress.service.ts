import { User, type IUser } from '../models/User.model.js';
import { Course } from '../models/Course.model.js';
import { ScoringService } from './scoring.service.js';
import { ApiError } from '../utils/apiError.js';

export class ProgressService {
  /**
   * Updates user streak based on last active timestamp.
   */
  static updateStreak(user: IUser): void {
    const now = new Date();
    const lastActive = new Date(user.progress.lastActiveDate);

    const diffTime = Math.abs(now.getTime() - lastActive.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      user.progress.streak += 1;
      if (user.progress.streak > user.progress.longestStreak) {
        user.progress.longestStreak = user.progress.streak;
      }
    } else if (diffDays > 1) {
      user.progress.streak = 1;
    } else if (user.progress.streak === 0) {
      user.progress.streak = 1;
    }

    user.progress.lastActiveDate = now;
  }

  /**
   * Evaluates and unlocks achievements dynamically based on user progress.
   */
  static checkAchievements(user: IUser): string[] {
    const newlyUnlocked: string[] = [];

    const unlock = (id: string) => {
      const achievement = user.achievements.find((a) => a.id === id);
      if (achievement && !achievement.isEarned) {
        achievement.isEarned = true;
        achievement.earnedAt = new Date();
        newlyUnlocked.push(achievement.title);
      }
    };

    // First node completed
    if (user.progress.completedNodeIds.length >= 1) unlock('first-step');

    // 7-day streak
    if (user.progress.streak >= 7) unlock('week-streak');

    // 30-day streak
    if (user.progress.streak >= 30) unlock('month-streak');

    // First project completed
    if (user.progress.completedProjectIds.length >= 1) unlock('first-project');

    // 3 portfolio projects
    if (user.progress.completedProjectIds.length >= 3) unlock('portfolio-ready');

    // 5 resources completed
    if (user.progress.completedResourceIds.length >= 5) unlock('resource-reader');

    // Career selected
    if (user.selectedCareerId) unlock('career-chosen');

    return newlyUnlocked;
  }

  /**
   * Starts user's active roadmap.
   */
  static async startRoadmap(user: IUser): Promise<{ user: IUser; unlockedAchievements: string[] }> {
    if (!user.learning) {
      user.learning = {
        roadmapStarted: true,
        courseProgress: {},
        assessmentScores: {},
        codingScores: {},
        taskSubmissions: {},
      };
    } else {
      user.learning.roadmapStarted = true;
    }
    user.markModified('learning');

    this.updateStreak(user);
    const unlockedAchievements = this.checkAchievements(user);
    await user.save();
    return { user, unlockedAchievements };
  }

  /**
   * Marks a roadmap node as completed.
   */
  static async completeRoadmapNode(
    user: IUser,
    nodeId: string
  ): Promise<{ user: IUser; unlockedAchievements: string[] }> {
    if (!user.progress.completedNodeIds.includes(nodeId)) {
      user.progress.completedNodeIds.push(nodeId);
    }

    user.progress.inProgressNodeIds = user.progress.inProgressNodeIds.filter((id) => id !== nodeId);

    // Update stats
    user.stats.totalHoursLearned += 4;
    user.stats.skillsAcquired += 1;
    user.progress.hoursThisWeek = Math.min(user.progress.hoursThisWeek + 4, 40);

    this.updateStreak(user);
    user.stats.careerReadinessScore = await ScoringService.calculateCareerReadinessScore(user);
    const unlockedAchievements = this.checkAchievements(user);

    await user.save();
    return { user, unlockedAchievements };
  }

  /**
   * Updates lesson-level progress for a course node.
   */
  static async updateLessonProgress(
    user: IUser,
    nodeId: string,
    lessonId: string,
    completed: boolean
  ): Promise<{ user: IUser; courseProgress: any; unlockedAchievements: string[] }> {
    const course = await Course.findOne({ nodeId });
    const allLessons = course ? course.modules.flatMap((m) => m.lessons) : [];
    const totalLessons = allLessons.length || 6;

    if (!user.learning) {
      user.learning = {
        roadmapStarted: true,
        courseProgress: {},
        assessmentScores: {},
        codingScores: {},
        taskSubmissions: {},
      };
    }

    const currentProgress = user.learning.courseProgress[nodeId] || {
      nodeId,
      lessonsCompleted: [],
      totalLessons,
      completed: false,
      startedAt: new Date(),
    };

    if (completed) {
      if (!currentProgress.lessonsCompleted.includes(lessonId)) {
        currentProgress.lessonsCompleted.push(lessonId);
        user.stats.totalHoursLearned += 1;
      }
    } else {
      currentProgress.lessonsCompleted = currentProgress.lessonsCompleted.filter((id) => id !== lessonId);
    }

    currentProgress.completed = currentProgress.lessonsCompleted.length >= totalLessons;
    if (currentProgress.completed && !currentProgress.completedAt) {
      currentProgress.completedAt = new Date();
      if (!user.progress.completedNodeIds.includes(nodeId)) {
        user.progress.completedNodeIds.push(nodeId);
      }
    }

    user.learning.courseProgress[nodeId] = currentProgress;
    user.markModified('learning');

    this.updateStreak(user);
    user.stats.careerReadinessScore = await ScoringService.calculateCareerReadinessScore(user);
    const unlockedAchievements = this.checkAchievements(user);

    await user.save();
    return { user, courseProgress: currentProgress, unlockedAchievements };
  }

  /**
   * Marks full course complete.
   */
  static async completeCourse(
    user: IUser,
    nodeId: string
  ): Promise<{ user: IUser; unlockedAchievements: string[] }> {
    const course = await Course.findOne({ nodeId });
    const allLessons = course ? course.modules.flatMap((m) => m.lessons) : [];
    const lessonIds = allLessons.map((l) => l.id);

    if (!user.learning) {
      user.learning = {
        roadmapStarted: true,
        courseProgress: {},
        assessmentScores: {},
        codingScores: {},
        taskSubmissions: {},
      };
    }

    user.learning.courseProgress[nodeId] = {
      nodeId,
      lessonsCompleted: lessonIds,
      totalLessons: lessonIds.length,
      completed: true,
      startedAt: user.learning.courseProgress[nodeId]?.startedAt || new Date(),
      completedAt: new Date(),
    };
    user.markModified('learning');

    if (!user.progress.completedNodeIds.includes(nodeId)) {
      user.progress.completedNodeIds.push(nodeId);
      user.stats.skillsAcquired += 1;
      user.stats.totalHoursLearned += 3;
    }

    this.updateStreak(user);
    user.stats.careerReadinessScore = await ScoringService.calculateCareerReadinessScore(user);
    const unlockedAchievements = this.checkAchievements(user);

    await user.save();
    return { user, unlockedAchievements };
  }

  /**
   * Records MCQ assessment submission & score.
   */
  static async recordAssessmentScore(
    user: IUser,
    nodeId: string,
    score: number,
    passed: boolean
  ): Promise<{ user: IUser; unlockedAchievements: string[] }> {
    if (!user.learning) {
      user.learning = {
        roadmapStarted: true,
        courseProgress: {},
        assessmentScores: {},
        codingScores: {},
        taskSubmissions: {},
      };
    }

    const prev = user.learning.assessmentScores[nodeId];
    user.learning.assessmentScores[nodeId] = {
      nodeId,
      score,
      passed,
      attempts: (prev?.attempts || 0) + 1,
      lastAttemptAt: new Date(),
    };
    user.markModified('learning');

    if (passed) {
      user.stats.totalHoursLearned += 2;
    }

    this.updateStreak(user);
    user.stats.careerReadinessScore = await ScoringService.calculateCareerReadinessScore(user);
    const unlockedAchievements = this.checkAchievements(user);

    await user.save();
    return { user, unlockedAchievements };
  }

  /**
   * Records coding challenge completion & score.
   */
  static async recordCodingScore(
    user: IUser,
    nodeId: string,
    score: number
  ): Promise<{ user: IUser; unlockedAchievements: string[] }> {
    if (!user.learning) {
      user.learning = {
        roadmapStarted: true,
        courseProgress: {},
        assessmentScores: {},
        codingScores: {},
        taskSubmissions: {},
      };
    }

    user.learning.codingScores[nodeId] = score;
    user.markModified('learning');

    if (score >= 70) {
      user.stats.totalHoursLearned += 3;
    }

    this.updateStreak(user);
    user.stats.careerReadinessScore = await ScoringService.calculateCareerReadinessScore(user);
    const unlockedAchievements = this.checkAchievements(user);

    await user.save();
    return { user, unlockedAchievements };
  }

  /**
   * Starts a practical task and sets deadline timestamp.
   */
  static async startTask(
    user: IUser,
    nodeId: string,
    durationHours: number
  ): Promise<{ user: IUser; taskSubmission: any }> {
    const startTime = Date.now();
    const deadline = startTime + durationHours * 3600 * 1000;

    if (!user.learning) {
      user.learning = {
        roadmapStarted: true,
        courseProgress: {},
        assessmentScores: {},
        codingScores: {},
        taskSubmissions: {},
      };
    }

    const submission = {
      nodeId,
      status: 'in-progress' as const,
      taskStartTime: startTime,
      taskDeadline: deadline,
    };

    user.learning.taskSubmissions[nodeId] = submission;
    user.markModified('learning');

    this.updateStreak(user);
    await user.save();
    return { user, taskSubmission: submission };
  }

  /**
   * Submits a practical task milestone with GitHub and live URLs.
   */
  static async submitTask(
    user: IUser,
    nodeId: string,
    githubUrl: string,
    liveUrl?: string
  ): Promise<{ user: IUser; taskSubmission: any; unlockedAchievements: string[] }> {
    if (!user.learning) {
      user.learning = {
        roadmapStarted: true,
        courseProgress: {},
        assessmentScores: {},
        codingScores: {},
        taskSubmissions: {},
      };
    }

    const prev = user.learning.taskSubmissions[nodeId] || {};
    const submission = {
      ...prev,
      nodeId,
      status: 'submitted' as const,
      githubUrl,
      liveUrl,
      submittedAt: new Date(),
    };

    user.learning.taskSubmissions[nodeId] = submission;
    user.markModified('learning');

    if (!user.progress.completedProjectIds.includes(nodeId)) {
      user.progress.completedProjectIds.push(nodeId);
      user.stats.projectsCompleted += 1;
      user.stats.totalHoursLearned += 12;
    }

    this.updateStreak(user);
    user.stats.careerReadinessScore = await ScoringService.calculateCareerReadinessScore(user);
    const unlockedAchievements = this.checkAchievements(user);

    await user.save();
    return { user, taskSubmission: submission, unlockedAchievements };
  }

  /**
   * Updates project completion state.
   */
  static async updateProjectStatus(
    user: IUser,
    projectId: string,
    status: 'not-started' | 'in-progress' | 'completed' | 'published'
  ): Promise<{ user: IUser; unlockedAchievements: string[] }> {
    if (status === 'completed' || status === 'published') {
      if (!user.progress.completedProjectIds.includes(projectId)) {
        user.progress.completedProjectIds.push(projectId);
        user.stats.projectsCompleted += 1;
        user.stats.totalHoursLearned += 10;
      }
    } else {
      user.progress.completedProjectIds = user.progress.completedProjectIds.filter((id) => id !== projectId);
      user.stats.projectsCompleted = user.progress.completedProjectIds.length;
    }

    this.updateStreak(user);
    user.stats.careerReadinessScore = await ScoringService.calculateCareerReadinessScore(user);
    const unlockedAchievements = this.checkAchievements(user);

    await user.save();
    return { user, unlockedAchievements };
  }

  /**
   * Marks a resource as completed.
   */
  static async completeResource(
    user: IUser,
    resourceId: string
  ): Promise<{ user: IUser; unlockedAchievements: string[] }> {
    if (!user.progress.completedResourceIds.includes(resourceId)) {
      user.progress.completedResourceIds.push(resourceId);
      user.stats.resourcesConsumed += 1;
      user.stats.totalHoursLearned += 2;
    }

    this.updateStreak(user);
    user.stats.careerReadinessScore = await ScoringService.calculateCareerReadinessScore(user);
    const unlockedAchievements = this.checkAchievements(user);

    await user.save();
    return { user, unlockedAchievements };
  }
}
