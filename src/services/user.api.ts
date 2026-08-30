import { api } from './api';
import type { UserProfile, OnboardingData } from '../data/user';

export const userApi = {
  async getProfile(): Promise<UserProfile> {
    const res = await api.get<{ success: boolean; data: UserProfile }>('/users/profile');
    return res.data.data;
  },

  async updateProfile(updates: { name?: string; avatar?: string }): Promise<UserProfile> {
    const res = await api.put<{ success: boolean; data: UserProfile }>('/users/profile', updates);
    return res.data.data;
  },

  async saveOnboarding(data: Partial<OnboardingData>): Promise<UserProfile> {
    const res = await api.post<{ success: boolean; data: UserProfile }>('/users/onboarding', data);
    return res.data.data;
  },

  async completeOnboarding(): Promise<UserProfile> {
    const res = await api.post<{ success: boolean; data: UserProfile }>('/users/onboarding/complete');
    return res.data.data;
  },
};
