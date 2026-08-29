import { api } from './api';
import type { Skill } from '../data/skills';

export interface SkillGapAnalysis {
  careerId: string;
  careerTitle: string;
  overallReadiness: number;
  counts: {
    acquired: number;
    learning: number;
    missing: number;
    total: number;
  };
  skills: Array<{
    skill: Skill;
    status: 'acquired' | 'learning' | 'missing';
  }>;
}

export const skillApi = {
  async getSkills(params?: { category?: string }): Promise<Skill[]> {
    const res = await api.get<{ success: boolean; data: Skill[] }>('/skills', { params });
    return res.data.data;
  },

  async getSkillGap(careerId: string): Promise<SkillGapAnalysis> {
    const res = await api.get<{ success: boolean; data: SkillGapAnalysis }>(`/skills/gap/${careerId}`);
    return res.data.data;
  },
};
