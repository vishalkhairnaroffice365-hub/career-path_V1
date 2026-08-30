import { api } from './api';
import type { PracticalTask } from '../data/tasks';
import type { TaskSubmission, UserProfile } from '../context/CareerContext';

export const taskApi = {
  async getTaskByNodeId(
    nodeId: string
  ): Promise<{ task: PracticalTask; submission: TaskSubmission }> {
    const res = await api.get<{
      success: boolean;
      data: { task: PracticalTask; submission: TaskSubmission };
    }>(`/tasks/${nodeId}`);
    return res.data.data;
  },

  async startTask(
    nodeId: string
  ): Promise<{ user: UserProfile; submission: TaskSubmission }> {
    const res = await api.post<{
      success: boolean;
      data: { user: UserProfile; submission: TaskSubmission };
    }>(`/tasks/${nodeId}/start`);
    return res.data.data;
  },

  async submitTask(
    nodeId: string,
    data: { githubUrl: string; liveUrl?: string }
  ): Promise<{ user: UserProfile; submission: TaskSubmission; unlockedAchievements: string[] }> {
    const res = await api.post<{
      success: boolean;
      data: { user: UserProfile; submission: TaskSubmission; unlockedAchievements: string[] };
    }>(`/tasks/${nodeId}/submit`, data);
    return res.data.data;
  },
};
