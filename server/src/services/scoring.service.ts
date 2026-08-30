import type { ICareer } from '../models/Career.model.js';
import type { IUser, IOnboardingData } from '../models/User.model.js';
import { Skill } from '../models/Skill.model.js';
import { Roadmap } from '../models/Roadmap.model.js';
import { AIRecommendationService } from './aiRecommendation.service.js';

export class ScoringService {
  /**
   * Calculates a personalized 0-100 match score for a career based on onboarding data.
   */
  static calculateCareerMatchScore(career: ICareer, onboarding?: IOnboardingData): number {
    if (!onboarding || Object.keys(onboarding).length === 0) {
      return career.defaultMatchScore || 75;
    }

    const mockUser: any = { onboardingData: onboarding };
    const recs = AIRecommendationService.computeRecommendations(mockUser, [career]);
    return recs[0]?.matchScore || career.defaultMatchScore || 75;
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
    const readinessPercent =
      allSkills.length > 0 ? Math.round((acquiredCount / allSkills.length) * 100) : 0;

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
   * Recalculates user's total Career Readiness Score (0-100) combining nodes, assessments, code, and projects.
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

    // 1. Roadmap nodes progress (weight: 35%)
    const roadmapScore = nodeRatio * 35;

    // 2. Projects completed (weight: 25%, max 3 projects)
    const projectsCompleted = user.progress.completedProjectIds.length;
    const projectScore = Math.min(projectsCompleted / 3, 1) * 25;

    // 3. Assessments passed (weight: 20%, max 3 passed assessments)
    const passedAssessments = user.learning?.assessmentScores
      ? Object.values(user.learning.assessmentScores).filter((s) => s.passed).length
      : 0;
    const assessmentScore = Math.min(passedAssessments / 3, 1) * 20;

    // 4. Coding challenges passed (weight: 10%, max 3 passed challenges with >= 70%)
    const passedCoding = user.learning?.codingScores
      ? Object.values(user.learning.codingScores).filter((score) => score >= 70).length
      : 0;
    const codingScore = Math.min(passedCoding / 3, 1) * 10;

    // 5. Resources consumed (weight: 5%, max 4 resources)
    const resourcesConsumed = user.progress.completedResourceIds.length;
    const resourceScore = Math.min(resourcesConsumed / 4, 1) * 5;

    // 6. Streak consistency (weight: 5%, max 14 days)
    const streak = user.progress.streak || 0;
    const streakScore = Math.min(streak / 14, 1) * 5;

    const totalReadiness = Math.round(
      roadmapScore + projectScore + assessmentScore + codingScore + resourceScore + streakScore
    );

    return Math.min(Math.max(totalReadiness, 0), 100);
  }
}
