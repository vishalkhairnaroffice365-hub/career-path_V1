import type { ICareer } from '../models/Career.model.js';
import type { IUser, IOnboardingData } from '../models/User.model.js';
import { Skill } from '../models/Skill.model.js';
import { Roadmap } from '../models/Roadmap.model.js';

export class ScoringService {
  /**
   * Calculates a personalized 0-100 match score for a career based on onboarding data.
   */
  static calculateCareerMatchScore(career: ICareer, onboarding?: IOnboardingData): number {
    if (!onboarding || Object.keys(onboarding).length === 0) {
      return career.defaultMatchScore || 75;
    }

    let score = 50; // Base score

    // 1. Skill overlap (up to +25 points)
    const userSkills = onboarding.currentSkills || [];
    const requiredSkills = career.requiredSkillIds || [];
    if (requiredSkills.length > 0) {
      const matchCount = requiredSkills.filter((s) => userSkills.includes(s)).length;
      const skillRatio = matchCount / requiredSkills.length;
      score += Math.round(skillRatio * 25);
    } else {
      score += 15;
    }

    // 2. Interest alignment (up to +15 points)
    const interests = onboarding.interests || [];
    if (interests.includes('building-apps') && career.domainId === 'app-development') score += 15;
    else if (interests.includes('ai-robotics') && career.domainId === 'ai-ml') score += 15;
    else if (interests.includes('security') && career.domainId === 'cyber-security') score += 15;
    else if (interests.includes('art-design') && (career.domainId === 'ui-ux' || career.subDomainId === 'frontend')) score += 15;
    else if (interests.includes('games') && career.domainId === 'game-development') score += 15;
    else if (interests.includes('data-numbers') && (career.domainId === 'ai-ml' || career.domainId === 'data-engineering')) score += 15;
    else if (interests.length > 0) score += 8;

    // 3. Work style / environment preference (up to +10 points)
    if (onboarding.preferredEnvironment) {
      if (onboarding.preferredEnvironment.includes('remote') && career.workStyle === 'remote-first') {
        score += 10;
      } else if (onboarding.preferredEnvironment.includes('hybrid') && career.workStyle === 'hybrid') {
        score += 10;
      } else {
        score += 5;
      }
    } else {
      score += 5;
    }

    // Clamp score between 40 and 99
    return Math.min(Math.max(score, 40), 99);
  }

  /**
   * Computes the skill gap breakdown (acquired, learning, missing) for a career.
   */
  static async calculateSkillGap(user: IUser, career: ICareer) {
    const allSkills = await Skill.find({ id: { $in: career.requiredSkillIds } });
    const knownSkills = user.onboardingData?.currentSkills || [];
    const completedNodeIds = user.progress.completedNodeIds || [];
    const inProgressNodeIds = user.progress.inProgressNodeIds || [];

    const breakdown = allSkills.map((skill) => {
      let status: 'acquired' | 'learning' | 'missing' = 'missing';

      // Check if skill was selected in onboarding or marked in completed nodes
      if (knownSkills.includes(skill.id) || completedNodeIds.includes(skill.id)) {
        status = 'acquired';
      } else if (inProgressNodeIds.includes(skill.id)) {
        status = 'learning';
      }

      return {
        skill,
        status,
      };
    });

    const acquiredCount = breakdown.filter((b) => b.status === 'acquired').length;
    const learningCount = breakdown.filter((b) => b.status === 'learning').length;
    const missingCount = breakdown.filter((b) => b.status === 'missing').length;
    const readinessPercent = allSkills.length > 0 ? Math.round((acquiredCount / allSkills.length) * 100) : 0;

    return {
      careerId: career.id,
      careerTitle: career.title,
      overallReadiness: readinessPercent,
      counts: {
        acquired: acquiredCount,
        learning: learningCount,
        missing: missingCount,
        total: allSkills.length,
      },
      skills: breakdown,
    };
  }

  /**
   * Recalculates user's total Career Readiness Score (0-100).
   */
  static async calculateCareerReadinessScore(user: IUser): Promise<number> {
    const careerId = user.selectedCareerId;
    if (!careerId) {
      return user.stats.careerReadinessScore || 0;
    }

    const roadmap = await Roadmap.findOne({ careerId });
    const totalNodes = roadmap?.nodes.length || 10;
    const completedNodes = user.progress.completedNodeIds.length;
    const nodeRatio = Math.min(completedNodes / Math.max(totalNodes, 1), 1);

    // 1. Roadmap nodes progress (weight: 40%)
    const roadmapScore = nodeRatio * 40;

    // 2. Projects completed (weight: 30%, max 3 projects for 100%)
    const projectsCompleted = user.progress.completedProjectIds.length;
    const projectScore = Math.min(projectsCompleted / 3, 1) * 30;

    // 3. Resources consumed (weight: 15%, max 4 resources)
    const resourcesConsumed = user.progress.completedResourceIds.length;
    const resourceScore = Math.min(resourcesConsumed / 4, 1) * 15;

    // 4. Streak consistency (weight: 15%, max 14 days)
    const streak = user.progress.streak || 0;
    const streakScore = Math.min(streak / 14, 1) * 15;

    const totalReadiness = Math.round(roadmapScore + projectScore + resourceScore + streakScore);
    return Math.min(Math.max(totalReadiness, 0), 100);
  }
}
