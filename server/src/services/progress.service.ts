import { User, type IUser } from '../models/User.model.js';
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

    await user.save();
    return { user, unlockedAchievements };
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
  static async completeResource(user: IUser, resourceId: string): Promise<{ user: IUser; unlockedAchievements: string[] }> {
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
