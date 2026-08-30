import { rawRoadmaps } from '../../server/src/services/seedData/roadmaps.data';

export type RoadmapNodeStatus = 'completed' | 'in-progress' | 'available' | 'locked';

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  type: 'milestone' | 'skill' | 'project' | 'checkpoint' | 'certification';
  duration: string;
  skillIds: string[];
  resourceIds: string[];
  projectIds: string[];
  prerequisites: string[];
  status: RoadmapNodeStatus;
  position: { x: number; y: number };
  phase: number; // 1 = foundation, 2 = core, 3 = advanced, 4 = launch
}

export interface RoadmapPhase {
  id: number;
  name: string;
  description: string;
  color: string;
  duration: string;
}

export interface Roadmap {
  id: string;
  careerId: string;
  title: string;
  description: string;
  totalDuration: string;
  phases: RoadmapPhase[];
  nodes: RoadmapNode[];
}

export type CareerRoadmap = Roadmap;

export const roadmaps: Roadmap[] = rawRoadmaps.map((r) => ({
  ...r,
  nodes: r.nodes.map((n) => ({
    ...n,
    type: (n.type || 'skill') as any,
    status: n.defaultStatus as RoadmapNodeStatus,
  })),
}));
