import { User, type IUser } from '../models/User.model.js';
import { ScoringService } from './scoring.service.js';
import { ApiError } from '../utils/apiError.js';

export class ProgressService {
  /**
   * Ensures learning sub-document initialized
   */
  private static ensureLearning(user: IUser): void {
    if (!user.learning) {
      user.learning = {
        courseProgress: {},
        assessmentScores: {},
        codingScores: {},
        taskSubmissions: {},
      };
    }
    if (!user.learning.courseProgress) user.learning.courseProgress = {};
    if (!user.learning.assessmentScores) user.learning.assessmentScores = {};
    if (!user.learning.codingScores) user.learning.codingScores = {};
    if (!user.learning.taskSubmissions) user.learning.taskSubmissions = {};
  }

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
   * Marks a roadmap node as completed.
   */
  static async completeRoadmapNode(user: IUser, nodeId: string): Promise<{ user: IUser; unlockedAchievements: string[] }> {
    if (!user.progress.completedNodeIds.includes(nodeId)) {
      user.progress.completedNodeIds.push(nodeId);
    }

    // Remove from in-progress if present
    user.progress.inProgressNodeIds = user.progress.inProgressNodeIds.filter((id) => id !== nodeId);

    // Update stats
    user.stats.totalHoursLearned += 4;
    user.stats.skillsAcquired += 1;
    user.progress.hoursThisWeek = Math.min(user.progress.hoursThisWeek + 4, 40);

    this.updateStreak(user);

    // Recalculate readiness
    user.stats.careerReadinessScore = await ScoringService.calculateCareerReadinessScore(user);

    const unlockedAchievements = this.checkAchievements(user);

    user.markModified('progress');
    user.markModified('stats');
    user.markModified('achievements');
    await user.save();
    return { user, unlockedAchievements };
  }

  /**
   * Records assessment score for a node
   */
  static async recordAssessmentScore(
    user: IUser,
    nodeId: string,
    score: number,
    passed: boolean
  ): Promise<{ user: IUser; unlockedAchievements: string[] }> {
    this.ensureLearning(user);
    user.learning!.assessmentScores![nodeId] = score;

    this.updateStreak(user);
    if (passed) {
      user.stats.totalHoursLearned += 2;
    }

    user.stats.careerReadinessScore = await ScoringService.calculateCareerReadinessScore(user);
    const unlockedAchievements = this.checkAchievements(user);

    user.markModified('learning');
    user.markModified('stats');
    await user.save();
    return { user, unlockedAchievements };
  }

  /**
   * Records coding challenge score for a node
   */
  static async recordCodingScore(
    user: IUser,
    nodeId: string,
    score: number
  ): Promise<{ user: IUser; unlockedAchievements: string[] }> {
    this.ensureLearning(user);
    user.learning!.codingScores![nodeId] = score;

    this.updateStreak(user);
    user.stats.totalHoursLearned += 2;
    user.stats.careerReadinessScore = await ScoringService.calculateCareerReadinessScore(user);
    const unlockedAchievements = this.checkAchievements(user);

    user.markModified('learning');
    user.markModified('stats');
    await user.save();
    return { user, unlockedAchievements };
  }

  /**
   * Updates lesson completion within a course
   */
  static async updateLessonProgress(
    user: IUser,
    nodeId: string,
    lessonId: string,
    completed: boolean
  ): Promise<{ user: IUser; courseProgress: any; unlockedAchievements: string[] }> {
    this.ensureLearning(user);
    if (!user.learning!.courseProgress![nodeId]) {
      user.learning!.courseProgress![nodeId] = { completedLessons: [], isCompleted: false };
    }

    const currentLessons = user.learning!.courseProgress![nodeId].completedLessons || [];
    if (completed && !currentLessons.includes(lessonId)) {
      currentLessons.push(lessonId);
    } else if (!completed) {
      const idx = currentLessons.indexOf(lessonId);
      if (idx > -1) currentLessons.splice(idx, 1);
    }

    user.learning!.courseProgress![nodeId].completedLessons = currentLessons;
    this.updateStreak(user);
    const unlockedAchievements = this.checkAchievements(user);

    user.markModified('learning');
    await user.save();
    return { user, courseProgress: user.learning!.courseProgress![nodeId], unlockedAchievements };
  }

  /**
   * Completes an entire course module
   */
  static async completeCourse(
    user: IUser,
    nodeId: string
  ): Promise<{ user: IUser; unlockedAchievements: string[] }> {
    this.ensureLearning(user);
    if (!user.learning!.courseProgress![nodeId]) {
      user.learning!.courseProgress![nodeId] = { completedLessons: [], isCompleted: true };
    } else {
      user.learning!.courseProgress![nodeId].isCompleted = true;
    }

    return this.completeRoadmapNode(user, nodeId);
  }

  /**
   * Starts a practical task
   */
  static async startTask(
    user: IUser,
    nodeId: string,
    _durationHours?: number
  ): Promise<{ user: IUser; taskSubmission: any }> {
    this.ensureLearning(user);
    const taskSubmission = {
      status: 'in-progress',
      startedAt: new Date(),
    };
    user.learning!.taskSubmissions![nodeId] = taskSubmission;
    this.updateStreak(user);

    user.markModified('learning');
    await user.save();
    return { user, taskSubmission };
  }

  /**
   * Submits a milestone project task
   */
  static async submitTask(
    user: IUser,
    nodeId: string,
    githubUrl: string,
    liveUrl?: string
  ): Promise<{ user: IUser; taskSubmission: any; unlockedAchievements: string[] }> {
    this.ensureLearning(user);
    const taskSubmission = {
      status: 'submitted',
      githubUrl,
      liveUrl: liveUrl || '',
      submittedAt: new Date(),
    };
    user.learning!.taskSubmissions![nodeId] = taskSubmission;

    user.stats.totalHoursLearned += 5;
    this.updateStreak(user);
    user.stats.careerReadinessScore = await ScoringService.calculateCareerReadinessScore(user);
    const unlockedAchievements = this.checkAchievements(user);

    user.markModified('learning');
    user.markModified('stats');
    await user.save();
    return { user, taskSubmission, unlockedAchievements };
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

    user.markModified('progress');
    user.markModified('stats');
    await user.save();
    return { user, unlockedAchievements };
  }

  /**
   * Marks a resource as completed.
   */
  static async completeResource(user: IUser, resourceId: string): Promise<{ user: IUser; unlockedAchievements: string[] }> {
    if (!user.progress.completedResourceIds.includes(resourceId)) {
      user.progress.completedResourceIds.push(resourceId);
      user.stats.resourcesConsumed += 1;
      user.stats.totalHoursLearned += 2;
    }

    this.updateStreak(user);
    user.stats.careerReadinessScore = await ScoringService.calculateCareerReadinessScore(user);
    const unlockedAchievements = this.checkAchievements(user);

    user.markModified('progress');
    user.markModified('stats');
    await user.save();
    return { user, unlockedAchievements };
  }
}
