import { api } from './api';
import type { NewsItem } from '../data/news';

export const newsApi = {
  async getNews(careerId?: string): Promise<NewsItem[]> {
    const res = await api.get<{ success: boolean; data: NewsItem[] }>('/news', {
      params: { careerId },
    });
    return res.data.data;
  },
};

export function formatNewsDate(isoDate: string | Date): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 60) return `${Math.max(diffMins, 1)}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
