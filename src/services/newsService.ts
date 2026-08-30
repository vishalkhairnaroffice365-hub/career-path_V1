import { newsApi, formatNewsDate } from './news.api';
import type { NewsItem } from '../data/news';

export type NewsLoadState = 'idle' | 'loading' | 'success' | 'error';

export async function fetchNewsByCareer(careerId: string | undefined): Promise<NewsItem[]> {
  try {
    return await newsApi.getNews(careerId);
  } catch (error) {
    console.error('Failed to fetch news from backend API:', error);
    return [];
  }
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  try {
    return await newsApi.getNews();
  } catch (error) {
    console.error('Failed to fetch all news from backend API:', error);
    return [];
  }
}

export { formatNewsDate };
