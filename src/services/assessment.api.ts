import { api } from './api';
import type { Assessment } from '../data/assessments';
import type { UserProfile } from '../data/user';
import type { AssessmentScore } from '../context/CareerContext';

export interface AssessmentSubmissionResult {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  breakdown: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  user: UserProfile;
  unlockedAchievements: string[];
}

export const assessmentApi = {
  async getAssessmentByNodeId(
    nodeId: string
  ): Promise<Assessment & { previousResult: AssessmentScore | null }> {
    const res = await api.get<{
      success: boolean;
      data: Assessment & { previousResult: AssessmentScore | null };
    }>(`/assessments/${nodeId}`);
    return res.data.data;
  },

  async submitAssessment(
    nodeId: string,
    answers: Record<string, string>
  ): Promise<AssessmentSubmissionResult> {
    const res = await api.post<{
      success: boolean;
      data: AssessmentSubmissionResult;
    }>(`/assessments/${nodeId}/submit`, { answers });
    return res.data.data;
  },
};
