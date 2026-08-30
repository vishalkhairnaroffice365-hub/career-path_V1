// TODO: Connect to backend API — replace getNews() with a real API call

import { mockNews, getNewsByCareer, type NewsItem } from '../data/news';

export type NewsLoadState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Simulates fetching news for a given career.
 * Returns a promise to be API-ready when a real endpoint is available.
 */
export async function fetchNewsByCareer(careerId: string | undefined): Promise<NewsItem[]> {
  // TODO: Connect to backend API: GET /api/v1/news?careerId={careerId}
  // Simulated network delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 800));
  return getNewsByCareer(careerId);
}

/**
 * Get all available news (for fallback/general view).
 */
export async function fetchAllNews(): Promise<NewsItem[]> {
  // TODO: Connect to backend API: GET /api/v1/news
  await new Promise((resolve) => setTimeout(resolve, 600));
  return mockNews;
}

/**
 * Format a published date to a relative time string.
 */
export function formatNewsDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
