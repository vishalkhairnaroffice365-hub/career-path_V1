import { api } from './api';
import type { UserProfile } from '../data/user';

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export const authApi = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', {
      name,
      email,
      password,
    });
    return res.data.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', {
      email,
      password,
    });
    return res.data.data;
  },

  async getMe(): Promise<UserProfile> {
    const res = await api.get<{ success: boolean; data: UserProfile }>('/auth/me');
    return res.data.data;
  },
};
