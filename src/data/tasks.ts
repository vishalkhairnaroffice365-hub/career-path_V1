export interface TaskRequirement {
  id: string;
  text: string;
  isRequired: boolean;
}

export interface PracticalTask {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationHours: number;
  requirements: TaskRequirement[];
  technologies: string[];
  deliverables: string[];
  githubRequired: boolean;
  liveUrlRequired: boolean;
  evaluationCriteria: string[];
  resources: { title: string; url: string }[];
}

import { rawAllTasks } from '../../server/src/services/seedData/allTasks.data';

export const practicalTasks: PracticalTask[] = rawAllTasks as PracticalTask[];

export function getTaskByNodeId(nodeId: string): PracticalTask | undefined {
  return practicalTasks.find((t) => t.nodeId === nodeId);
}
