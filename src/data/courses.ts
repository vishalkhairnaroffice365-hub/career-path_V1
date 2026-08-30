export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'exercise' | 'quiz';
  duration: string;
  completed?: boolean;
  content?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: string;
  nodeId: string; // links to RoadmapNode.id
  title: string;
  description: string;
  domain: string;
  difficulty: CourseDifficulty;
  estimatedTime: string;
  objectives: string[];
  modules: CourseModule[];
  hasAssessment: boolean;
  hasCodingChallenge: boolean;
  hasPracticalTask: boolean;
}

import { rawAllCourses } from '../../server/src/services/seedData/allCourses.data';

export const courses: Course[] = rawAllCourses as Course[];

export function getCourseByNodeId(nodeId: string): Course | undefined {
  return courses.find((c) => c.nodeId === nodeId);
}
