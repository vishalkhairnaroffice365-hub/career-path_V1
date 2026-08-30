export type ResourceType = 'course' | 'book' | 'video' | 'article' | 'documentation' | 'practice' | 'community';
export type ResourceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  level: ResourceLevel;
  url: string;
  provider: string;
  duration: string;
  isFree: boolean;
  price?: string;
  rating: number;
  skillIds: string[];
  careerIds: string[];
  tags: string[];
  emoji: string;
  isCompleted?: boolean;
}

import { rawResources } from '../../server/src/services/seedData/resources.data';

export const resources: Resource[] = rawResources as Resource[];
