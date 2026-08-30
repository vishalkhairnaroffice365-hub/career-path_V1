import { api } from './api';
import type { Achievement } from '../data/user';

export const achievementApi = {
  async getAchievements(): Promise<Achievement[]> {
    const res = await api.get<{ success: boolean; data: Achievement[] }>('/achievements');
    return res.data.data;
  },
};
