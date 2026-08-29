import { api } from './api';
import type { Project, ProjectStatus } from '../data/projects';
import type { UserProfile } from '../data/user';

export const projectApi = {
  async getProjects(params?: { careerId?: string; difficulty?: string }): Promise<Project[]> {
    const res = await api.get<{ success: boolean; data: Project[] }>('/projects', { params });
    return res.data.data;
  },

  async updateStatus(
    projectId: string,
    status: ProjectStatus,
    githubUrl?: string,
    liveUrl?: string
  ): Promise<{ project: Project; user: UserProfile; unlockedAchievements: string[] }> {
    const res = await api.post<{
      success: boolean;
      data: { project: Project; user: UserProfile; unlockedAchievements: string[] };
    }>(`/projects/${projectId}/status`, { status, githubUrl, liveUrl });
    return res.data.data;
  },
};
