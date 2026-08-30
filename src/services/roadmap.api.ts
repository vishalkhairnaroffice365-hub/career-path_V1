import { api } from './api';
import type { CareerRoadmap } from '../data/roadmap';
import type { UserProfile } from '../data/user';

export const roadmapApi = {
  async getCurrentRoadmap(): Promise<CareerRoadmap> {
    const res = await api.get<{ success: boolean; data: CareerRoadmap }>('/roadmaps/user/current');
    return res.data.data;
  },

  async getRoadmapByCareerId(careerId: string): Promise<CareerRoadmap> {
    const res = await api.get<{ success: boolean; data: CareerRoadmap }>(`/roadmaps/${careerId}`);
    return res.data.data;
  },

  async startRoadmap(): Promise<{ user: UserProfile; unlockedAchievements: string[] }> {
    const res = await api.post<{
      success: boolean;
      data: { user: UserProfile; unlockedAchievements: string[] };
    }>('/roadmaps/start');
    return res.data.data;
  },

  async completeNode(
    nodeId: string
  ): Promise<{ nodeId: string; user: UserProfile; unlockedAchievements: string[] }> {
    const res = await api.post<{
      success: boolean;
      data: { nodeId: string; user: UserProfile; unlockedAchievements: string[] };
    }>(`/roadmaps/nodes/${nodeId}/complete`);
    return res.data.data;
  },
};
