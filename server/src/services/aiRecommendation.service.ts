import type { ICareer } from '../models/Career.model.js';
import type { IUser, IOnboardingData } from '../models/User.model.js';
import { Skill } from '../models/Skill.model.js';

export interface FactorBreakdown {
  skillMatch: number;
  interestAffinity: number;
  workStyleFit: number;
  goalFeasibility: number;
}

export interface CareerRecommendationResult {
  career: any;
  matchScore: number;
  factors: FactorBreakdown;
  matchReasons: string[];
}

export class AIRecommendationService {
  /**
   * Evaluates technical skill overlap between user's current skills and career's required skills.
   * Returns score between 0 and 100.
   */
  private static calculateSkillFactor(career: ICareer, onboarding?: IOnboardingData): number {
    if (!onboarding || !onboarding.currentSkills || onboarding.currentSkills.length === 0) {
      return 50; // Neutral baseline
    }

    const userSkills = onboarding.currentSkills;
    const requiredSkills = career.requiredSkillIds || [];

    if (requiredSkills.length === 0) return 70;

    const matched = requiredSkills.filter((s) => userSkills.includes(s)).length;
    const ratio = matched / requiredSkills.length;

    // Scale from 40% (baseline) to 100%
    return Math.round(40 + ratio * 60);
  }

  /**
   * Evaluates domain interest affinity based on user's selected interests.
   * Returns score between 0 and 100.
   */
  private static calculateInterestFactor(career: ICareer, onboarding?: IOnboardingData): number {
    if (!onboarding || !onboarding.interests || onboarding.interests.length === 0) {
      return 60;
    }

    const interests = onboarding.interests;
    let score = 50;

    const domainAffinityMap: Record<string, string[]> = {
      'app-development': ['building-apps', 'mobile-tech', 'creative-tech'],
      'ai-ml': ['ai-robotics', 'data-numbers', 'research-science'],
      'cyber-security': ['security', 'problem-solving', 'systems-networks'],
      'ui-ux': ['art-design', 'human-behavior', 'creative-tech'],
      'game-development': ['games', '3d-graphics', 'storytelling'],
      'web-development': ['building-apps', 'art-design', 'creative-tech'],
      'cloud-devops': ['systems-networks', 'automation', 'infrastructure'],
      'data-engineering': ['data-numbers', 'systems-networks', 'research-science'],
    };

    const targetKeywords = domainAffinityMap[career.domainId] || ['building-apps'];
    const matchedCount = interests.filter((i) => targetKeywords.includes(i)).length;

    if (matchedCount >= 2) score += 45;
    else if (matchedCount === 1) score += 30;
    else score += 10;

    return Math.min(Math.max(score, 45), 98);
  }

  /**
   * Evaluates work style and environment compatibility (remote, hybrid, onsite, collaborative).
   * Returns score between 0 and 100.
   */
  private static calculateWorkStyleFactor(career: ICareer, onboarding?: IOnboardingData): number {
    if (!onboarding) return 70;

    let score = 65;

    // Environment matching
    if (onboarding.preferredEnvironment) {
      const pref = onboarding.preferredEnvironment.toLowerCase();
      if (pref.includes('remote') && career.workStyle === 'remote-first') score += 20;
      else if (pref.includes('hybrid') && career.workStyle === 'hybrid') score += 20;
      else if (pref.includes('onsite') && career.workStyle === 'onsite') score += 20;
      else score += 5;
    }

    // Work style tags
    if (onboarding.workStyle && onboarding.workStyle.length > 0) {
      score += 10;
    }

    return Math.min(Math.max(score, 50), 98);
  }

  /**
   * Evaluates goal ambition vs career time-to-ready feasibility.
   * Returns score between 0 and 100.
   */
  private static calculateGoalFactor(career: ICareer, onboarding?: IOnboardingData): number {
    if (!onboarding) return 65;

    let score = 60;

    if (onboarding.experienceLevel) {
      if (onboarding.experienceLevel === 'advanced') score += 25;
      else if (onboarding.experienceLevel === 'intermediate') score += 20;
      else if (onboarding.experienceLevel === 'some-experience') score += 15;
      else score += 10;
    }

    if (career.demandLevel === 'explosive' || career.demandLevel === 'high') {
      score += 10;
    }

    return Math.min(Math.max(score, 50), 98);
  }

  /**
   * Generates tailored, natural language explanation reasons for why a career matches the user.
   */
  private static generateMatchReasons(
    career: ICareer,
    factors: FactorBreakdown,
    onboarding?: IOnboardingData
  ): string[] {
    const reasons: string[] = [];

    // Reason 1: Skills
    if (factors.skillMatch >= 75) {
      reasons.push(
        `High technical skill overlap with your background (${factors.skillMatch}% compatibility).`
      );
    } else if (factors.skillMatch >= 60) {
      reasons.push(`Solid foundation for required core skills, ready to accelerate learning.`);
    } else {
      reasons.push(`Clear, structured learning path available from beginner to job-ready.`);
    }

    // Reason 2: Domain & Interests
    if (factors.interestAffinity >= 80) {
      reasons.push(
        `Directly aligns with your stated passion for ${career.domainId.replace('-', ' ')}.`
      );
    } else if (onboarding?.interests && onboarding.interests.length > 0) {
      reasons.push(
        `Applies your creative and problem-solving interests in high-growth industry sectors.`
      );
    } else {
      reasons.push(`High industry demand (${career.growthRate} annual growth) with strong career trajectory.`);
    }

    // Reason 3: Work Style & Compensation
    if (factors.workStyleFit >= 80) {
      reasons.push(
        `Matches your preferred ${career.workStyle} work culture and average salary target of ${career.salary.mid}/yr.`
      );
    } else {
      reasons.push(
        `Provides high flexibility with mid-level compensation reaching ${career.salary.mid}/yr.`
      );
    }

    return reasons;
  }

  /**
   * Computes explainable personalized recommendations across all careers.
   */
  public static computeRecommendations(
    user: IUser,
    careers: ICareer[]
  ): CareerRecommendationResult[] {
    const onboarding = user.onboardingData;

    const scored = careers.map((career) => {
      const skillMatch = this.calculateSkillFactor(career, onboarding);
      const interestAffinity = this.calculateInterestFactor(career, onboarding);
      const workStyleFit = this.calculateWorkStyleFactor(career, onboarding);
      const goalFeasibility = this.calculateGoalFactor(career, onboarding);

      // Weighted Multi-Vector Calculation
      // Skills: 35%, Interests: 25%, WorkStyle: 20%, Goal: 20%
      const compositeScore = Math.round(
        skillMatch * 0.35 +
          interestAffinity * 0.25 +
          workStyleFit * 0.2 +
          goalFeasibility * 0.2
      );

      const factors: FactorBreakdown = {
        skillMatch,
        interestAffinity,
        workStyleFit,
        goalFeasibility,
      };

      const matchReasons = this.generateMatchReasons(career, factors, onboarding);

      const careerJson: any = career.toJSON ? career.toJSON() : career;
      careerJson.matchScore = compositeScore;

      return {
        career: careerJson,
        matchScore: compositeScore,
        factors,
        matchReasons,
      };
    });

    // Rank highest match first
    return scored.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Generates a single career's full AI explanation and fit breakdown.
   */
  public static async explainCareerFit(user: IUser, career: ICareer) {
    const onboarding = user.onboardingData;

    const skillMatch = this.calculateSkillFactor(career, onboarding);
    const interestAffinity = this.calculateInterestFactor(career, onboarding);
    const workStyleFit = this.calculateWorkStyleFactor(career, onboarding);
    const goalFeasibility = this.calculateGoalFactor(career, onboarding);

    const compositeScore = Math.round(
      skillMatch * 0.35 +
        interestAffinity * 0.25 +
        workStyleFit * 0.2 +
        goalFeasibility * 0.2
    );

    const factors: FactorBreakdown = {
      skillMatch,
      interestAffinity,
      workStyleFit,
      goalFeasibility,
    };

    const matchReasons = this.generateMatchReasons(career, factors, onboarding);

    // Retrieve skill gap breakdown
    const allSkills = await Skill.find({ id: { $in: career.requiredSkillIds } });
    const knownSkills = onboarding?.currentSkills || [];
    const completedNodeIds = user.progress.completedNodeIds || [];
    const inProgressNodeIds = user.progress.inProgressNodeIds || [];

    const categorizedSkills = allSkills.map((skill) => {
      let status: 'acquired' | 'learning' | 'missing' = 'missing';
      if (knownSkills.includes(skill.id) || completedNodeIds.includes(skill.id)) {
        status = 'acquired';
      } else if (inProgressNodeIds.includes(skill.id)) {
        status = 'learning';
      }

      return {
        skill,
        status,
        difficulty: skill.difficulty,
        learningTime: skill.learningTime,
      };
    });

    return {
      careerId: career.id,
      careerTitle: career.title,
      matchScore: compositeScore,
      factors,
      matchReasons,
      skills: categorizedSkills,
    };
  }
}
