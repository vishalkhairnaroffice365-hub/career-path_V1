import { api } from './api';
import type { Resource, ResourceType } from '../data/resources';
import type { UserProfile } from '../data/user';

export const resourceApi = {
  async getResources(params?: {
    type?: ResourceType | 'all';
    level?: string;
    isFree?: boolean;
    careerId?: string;
    skillId?: string;
  }): Promise<Resource[]> {
    const res = await api.get<{ success: boolean; data: Resource[] }>('/resources', { params });
    return res.data.data;
  },

  async completeResource(
    resourceId: string
  ): Promise<{ resource: Resource; user: UserProfile; unlockedAchievements: string[] }> {
    const res = await api.post<{
      success: boolean;
      data: { resource: Resource; user: UserProfile; unlockedAchievements: string[] };
    }>(`/resources/${resourceId}/complete`);
    return res.data.data;
  },
};
