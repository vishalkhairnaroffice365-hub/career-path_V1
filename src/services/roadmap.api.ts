import { api } from './api';
import type { Roadmap } from '../data/roadmap';
import type { UserProfile } from '../data/user';

export const roadmapApi = {
  async getRoadmapByCareerId(careerId: string): Promise<Roadmap> {
    const res = await api.get<{ success: boolean; data: Roadmap }>(`/roadmaps/${careerId}`);
    return res.data.data;
  },

  async getCurrentUserRoadmap(): Promise<Roadmap> {
    const res = await api.get<{ success: boolean; data: Roadmap }>('/roadmaps/user/current');
    return res.data.data;
  },

  async completeNode(nodeId: string): Promise<{ nodeId: string; user: UserProfile; unlockedAchievements: string[] }> {
    const res = await api.post<{
      success: boolean;
      data: { nodeId: string; user: UserProfile; unlockedAchievements: string[] };
    }>(`/roadmaps/nodes/${nodeId}/complete`);
    return res.data.data;
  },
};
