import { api } from './api';
import type { UserProfile } from '../data/user';

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export const authApi = {
  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data);
    if (res.data.data?.token) {
      localStorage.setItem('career_path_token', res.data.data.token);
    }
    return res.data.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', data);
    if (res.data.data?.token) {
      localStorage.setItem('career_path_token', res.data.data.token);
    }
    return res.data.data;
  },

  async getMe(): Promise<UserProfile> {
    const res = await api.get<{ success: boolean; data: UserProfile }>('/auth/me');
    return res.data.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('career_path_token');
    }
  },
};
