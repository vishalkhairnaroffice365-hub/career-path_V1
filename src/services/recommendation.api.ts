import { api } from './api';
import type { Career } from '../data/careers';
import type { Skill } from '../data/skills';

export interface FactorBreakdown {
  skillMatch: number;
  interestAffinity: number;
  workStyleFit: number;
  goalFeasibility: number;
}

export interface CareerRecommendationItem {
  career: Career;
  matchScore: number;
  factors: FactorBreakdown;
  matchReasons: string[];
}

export interface CareerFitExplanation {
  careerId: string;
  careerTitle: string;
  matchScore: number;
  factors: FactorBreakdown;
  matchReasons: string[];
  skills: {
    skill: Skill;
    status: 'acquired' | 'learning' | 'missing';
    difficulty: string;
    learningTime: string;
  }[];
}

export const recommendationApi = {
  async getRecommendations(): Promise<CareerRecommendationItem[]> {
    const res = await api.get<{ success: boolean; data: CareerRecommendationItem[] }>(
      '/recommendations'
    );
    return res.data.data;
  },

  async explainCareer(careerId: string): Promise<CareerFitExplanation> {
    const res = await api.get<{ success: boolean; data: CareerFitExplanation }>(
      `/recommendations/explain/${careerId}`
    );
    return res.data.data;
  },
};
