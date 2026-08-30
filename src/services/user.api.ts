import { api } from './api';
import type { UserProfile, OnboardingData, UserProgress } from '../data/user';

export const userApi = {
  async getProfile(): Promise<UserProfile> {
    const res = await api.get<{ success: boolean; data: UserProfile }>('/users/me');
    return res.data.data;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const res = await api.put<{ success: boolean; data: UserProfile }>('/users/me', data);
    return res.data.data;
  },

  async saveOnboarding(data: Partial<OnboardingData>): Promise<UserProfile> {
    const res = await api.post<{ success: boolean; data: UserProfile }>('/users/onboarding', data);
    return res.data.data;
  },

  async completeOnboarding(profileData?: Partial<UserProfile>): Promise<UserProfile> {
    const res = await api.post<{ success: boolean; data: UserProfile }>(
      '/users/onboarding/complete',
      profileData || {}
    );
    return res.data.data;
  },

  async getProgress(): Promise<{ progress: UserProgress; stats: any; achievements: any[] }> {
    const res = await api.get<{
      success: boolean;
      data: { progress: UserProgress; stats: any; achievements: any[] };
    }>('/users/progress');
    return res.data.data;
  },
};
