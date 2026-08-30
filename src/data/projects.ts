export type ProjectStatus = 'not-started' | 'in-progress' | 'completed' | 'published';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  emoji: string;
  difficulty: 'starter' | 'intermediate' | 'advanced' | 'capstone';
  estimatedTime: string;
  skillIds: string[];
  careerIds: string[];
  tags: string[];
  objectives: string[];
  techStack: string[];
  status: ProjectStatus;
  githubUrl?: string;
  liveUrl?: string;
  isPortfolioWorthy: boolean;
  phase: number;
}

import { rawProjects } from '../../server/src/services/seedData/projects.data';

export const projects: Project[] = rawProjects as Project[];
