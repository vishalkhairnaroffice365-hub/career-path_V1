import { rawRoadmaps } from './roadmaps.data.js';

export interface RawTaskData {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationHours: number;
  requirements: Array<{ id: string; text: string; isRequired: boolean }>;
  technologies: string[];
  deliverables: string[];
  githubRequired: boolean;
  liveUrlRequired: boolean;
  evaluationCriteria: string[];
  resources: Array<{ title: string; url: string }>;
}

export function getAllTasks(): RawTaskData[] {
  const allTasks: RawTaskData[] = [];

  for (const roadmap of rawRoadmaps) {
    for (const node of roadmap.nodes) {
      const difficulty =
        node.phase === 1 ? 'beginner' : node.phase === 2 ? 'intermediate' : 'advanced';

      allTasks.push({
        id: `task-${node.id}`,
        nodeId: node.id,
        title: `${node.title} Milestone Task`,
        description: `Build a production-quality milestone project demonstrating hands-on expertise in ${node.title}.`,
        difficulty,
        durationHours: node.phase === 1 ? 24 : node.phase === 2 ? 48 : 72,
        requirements: [
          { id: `req-${node.id}-1`, text: `Implement full functional logic for ${node.title}`, isRequired: true },
          { id: `req-${node.id}-2`, text: `Write clean, documented code following architecture guidelines`, isRequired: true },
          { id: `req-${node.id}-3`, text: `Include unit tests verifying core logic and edge cases`, isRequired: true },
        ],
        technologies: [roadmap.careerId, node.title],
        deliverables: [
          'GitHub repository with complete source code',
          'README.md with setup instructions and architecture diagram',
          'Automated test suite output with passing assertions',
        ],
        githubRequired: true,
        liveUrlRequired: false,
        evaluationCriteria: [
          'Correctness of implementation',
          'Code readability and modular structure',
          'Test coverage and documentation clarity',
        ],
        resources: [
          { title: `${node.title} Official Documentation`, url: 'https://docs.github.com' },
          { title: 'Project Template Repository', url: 'https://github.com' },
        ],
      });
    }
  }

  return allTasks;
}

export const rawAllTasks = getAllTasks();
