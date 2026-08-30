import { api } from './api';
import type { Course } from '../data/courses';
import type { CourseProgress, UserProfile } from '../context/CareerContext';

export const courseApi = {
  async getCourses(domain?: string): Promise<Course[]> {
    const res = await api.get<{ success: boolean; data: Course[] }>('/courses', {
      params: { domain },
    });
    return res.data.data;
  },

  async getCourseByNodeId(
    nodeId: string
  ): Promise<{ course: Course; progress: CourseProgress | null }> {
    const res = await api.get<{
      success: boolean;
      data: { course: Course; progress: CourseProgress | null };
    }>(`/courses/${nodeId}`);
    return res.data.data;
  },

  async toggleLesson(
    nodeId: string,
    lessonId: string,
    completed: boolean
  ): Promise<{ user: UserProfile; courseProgress: CourseProgress; unlockedAchievements: string[] }> {
    const res = await api.post<{
      success: boolean;
      data: {
        user: UserProfile;
        courseProgress: CourseProgress;
        unlockedAchievements: string[];
      };
    }>(`/courses/${nodeId}/lessons/${lessonId}/toggle`, { completed });
    return res.data.data;
  },

  async completeCourse(
    nodeId: string
  ): Promise<{ user: UserProfile; unlockedAchievements: string[] }> {
    const res = await api.post<{
      success: boolean;
      data: { user: UserProfile; unlockedAchievements: string[] };
    }>(`/courses/${nodeId}/complete`);
    return res.data.data;
  },
};
