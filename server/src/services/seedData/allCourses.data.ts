import { rawRoadmaps } from './roadmaps.data.js';

export interface RawCourseLesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'exercise' | 'quiz';
  duration: string;
  content: string;
}

export interface RawCourseModule {
  id: string;
  title: string;
  lessons: RawCourseLesson[];
}

export interface RawCourseData {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  domain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  objectives: string[];
  modules: RawCourseModule[];
  hasAssessment: boolean;
  hasCodingChallenge: boolean;
  hasPracticalTask: boolean;
}

export function getAllCourses(): RawCourseData[] {
  const allCourses: RawCourseData[] = [];

  for (const roadmap of rawRoadmaps) {
    for (const node of roadmap.nodes) {
      const difficulty =
        node.phase === 1 ? 'beginner' : node.phase === 2 ? 'intermediate' : 'advanced';

      allCourses.push({
        id: `course-${node.id}`,
        nodeId: node.id,
        title: `Mastering ${node.title}`,
        description: `Comprehensive interactive curriculum covering ${node.title}: ${node.description}`,
        domain: roadmap.careerId,
        difficulty,
        estimatedTime: node.duration,
        objectives: [
          `Understand fundamental architectural concepts of ${node.title}`,
          `Implement production-grade solutions using ${node.title} best practices`,
          `Debug and optimize performance in real-world scenarios`,
          `Write automated test suites and verify edge cases for ${node.title}`,
        ],
        modules: [
          {
            id: `mod-${node.id}-1`,
            title: `Module 1: Core Fundamentals & Setup`,
            lessons: [
              {
                id: `les-${node.id}-1-1`,
                title: `Introduction to ${node.title}`,
                type: 'reading',
                duration: '15 min',
                content: `Overview and primary mental models for ${node.title}. Why it matters in modern tech stacks.`,
              },
              {
                id: `les-${node.id}-1-2`,
                title: `Environment & Tooling Walkthrough`,
                type: 'video',
                duration: '25 min',
                content: `Step-by-step developer setup and configuration for ${node.title}.`,
              },
              {
                id: `les-${node.id}-1-3`,
                title: `First Hands-on Implementation`,
                type: 'exercise',
                duration: '45 min',
                content: `Writing your first functional code snippet utilizing ${node.title}.`,
              },
            ],
          },
          {
            id: `mod-${node.id}-2`,
            title: `Module 2: Advanced Techniques & Optimization`,
            lessons: [
              {
                id: `les-${node.id}-2-1`,
                title: `Design Patterns & Architecture`,
                type: 'reading',
                duration: '30 min',
                content: `Scalable design patterns, separation of concerns, and clean abstractions for ${node.title}.`,
              },
              {
                id: `les-${node.id}-2-2`,
                title: `Performance Benchmarking & Profiling`,
                type: 'exercise',
                duration: '40 min',
                content: `Measuring latency, memory footprint, and optimizing bottlenecks in ${node.title}.`,
              },
              {
                id: `les-${node.id}-2-3`,
                title: `Production Deployment & Case Studies`,
                type: 'reading',
                duration: '20 min',
                content: `Real-world case studies of enterprise scale deployment and monitoring.`,
              },
            ],
          },
        ],
        hasAssessment: true,
        hasCodingChallenge: true,
        hasPracticalTask: true,
      });
    }
  }

  return allCourses;
}

export const rawAllCourses = getAllCourses();
