import { api } from './api';
import type { CodingChallenge, TestCase } from '../data/codingChallenges';
import type { UserProfile } from '../data/user';

export interface RunCodeResult {
  testResults: (TestCase & { isPassing: boolean })[];
  passedCount: number;
  totalCount: number;
  allPassed: boolean;
}

export interface CodingSubmissionResult {
  score: number;
  passed: boolean;
  testResults: (TestCase & { isPassing: boolean })[];
  user: UserProfile;
  unlockedAchievements: string[];
}

export const codingApi = {
  async getChallengeByNodeId(
    nodeId: string
  ): Promise<{ challenge: CodingChallenge; previousScore: number | null }> {
    const res = await api.get<{
      success: boolean;
      data: { challenge: CodingChallenge; previousScore: number | null };
    }>(`/challenges/${nodeId}`);
    return res.data.data;
  },

  async runCode(nodeId: string, code: string): Promise<RunCodeResult> {
    const res = await api.post<{
      success: boolean;
      data: RunCodeResult;
    }>(`/challenges/${nodeId}/run`, { code });
    return res.data.data;
  },

  async submitSolution(nodeId: string, code: string): Promise<CodingSubmissionResult> {
    const res = await api.post<{
      success: boolean;
      data: CodingSubmissionResult;
    }>(`/challenges/${nodeId}/submit`, { code });
    return res.data.data;
  },
};
