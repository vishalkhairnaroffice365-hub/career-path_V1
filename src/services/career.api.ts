import { api } from './api';
import type { Career } from '../data/careers';
import type { UserProfile } from '../data/user';

export const careerApi = {
  async getCareers(params?: { domainId?: string; subDomainId?: string }): Promise<Career[]> {
    const res = await api.get<{ success: boolean; data: Career[] }>('/careers', { params });
    return res.data.data;
  },

  async getCareerById(id: string): Promise<Career> {
    const res = await api.get<{ success: boolean; data: Career }>(`/careers/${id}`);
    return res.data.data;
  },

  async selectCareer(
    careerId: string
  ): Promise<{ selectedCareer: Career; user: UserProfile; unlockedAchievements: string[] }> {
    const res = await api.post<{
      success: boolean;
      data: { selectedCareer: Career; user: UserProfile; unlockedAchievements: string[] };
    }>('/careers/select', { careerId });
    return res.data.data;
  },

  async deselectCareer(): Promise<UserProfile> {
    const res = await api.post<{ success: boolean; data: UserProfile }>('/careers/deselect');
    return res.data.data;
  },

  async getComparedCareers(): Promise<Career[]> {
    const res = await api.get<{ success: boolean; data: Career[] }>('/careers/compare');
    return res.data.data;
  },

  async addToCompare(careerId: string): Promise<Career[]> {
    const res = await api.post<{ success: boolean; data: Career[] }>('/careers/compare', {
      careerId,
    });
    return res.data.data;
  },

  async removeFromCompare(careerId: string): Promise<Career[]> {
    const res = await api.delete<{ success: boolean; data: Career[] }>(
      `/careers/compare/${careerId}`
    );
    return res.data.data;
  },

  async clearCompare(): Promise<Career[]> {
    const res = await api.delete<{ success: boolean; data: Career[] }>('/careers/compare');
    return res.data.data;
  },
};
