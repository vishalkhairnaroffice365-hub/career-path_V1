export interface DomainTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  cloudStyle: 'cumulus' | 'stratus' | 'cirrus' | 'cumulonimbus';
  particleStyle: 'dots' | 'lines' | 'stars' | 'hexagons' | 'nodes';
  lightingStyle: 'warm' | 'cool' | 'electric' | 'neon' | 'soft';
  atmosphere: string;
  objectType: string;
  fogColor: string;
  emissiveColor: string;
}

export interface SubDomain {
  id: string;
  domainId: string;
  name: string;
  icon: string;
  description: string;
  careerIds: string[];
  position: [number, number, number];
  scale: number;
}

export interface Domain {
  id: string;
  name: string;
  icon: string;
  description: string;
  tagline: string;
  careerCount: number;
  avgSalary: string;
  growthRate: string;
  theme: DomainTheme;
  subDomains: SubDomain[];
  position: [number, number, number];
  scale: number;
}

import { rawDomains } from '../../server/src/services/seedData/domains.data';

export const domains: Domain[] = rawDomains as Domain[];
