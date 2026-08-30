export interface Career {
  id: string;
  subDomainId: string;
  domainId: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  matchScore?: number; // 0-100, set after onboarding
  salary: {
    entry: string;
    mid: string;
    senior: string;
  };
  growthRate: string;
  demandLevel: 'explosive' | 'high' | 'moderate' | 'stable';
  workStyle: 'remote-first' | 'hybrid' | 'onsite';
  timeToReady: string;
  keySkills: string[];
  dayInLife: string[];
  pros: string[];
  cons: string[];
  companies: string[];
  requiredSkillIds: string[];
  roadmapId: string;
  isSelected?: boolean;
}

import { rawCareers } from '../../server/src/services/seedData/careers.data';

export const careers: Career[] = rawCareers as Career[];
