export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: MCQOption[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Assessment {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  questions: MCQQuestion[];
}

import { rawAllAssessments } from '../../server/src/services/seedData/allAssessments.data';

export const assessments: Assessment[] = rawAllAssessments as Assessment[];

export function getAssessmentByNodeId(nodeId: string): Assessment | undefined {
  return assessments.find((a) => a.nodeId === nodeId);
}
