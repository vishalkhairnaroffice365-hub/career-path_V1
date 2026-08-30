export type ChallengeLanguage = 'kotlin' | 'python' | 'javascript' | 'typescript' | 'java';

export interface TestCase {
  id: string;
  description: string;
  input: string;
  expectedOutput: string;
  isPassing?: boolean;
}

export interface CodingChallenge {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: ChallengeLanguage;
  timeLimit: number;
  starterCode: string;
  solutionCode?: string;
  testCases: TestCase[];
  hints: string[];
  explanation: string;
}

import { rawAllChallenges } from '../../server/src/services/seedData/allChallenges.data';

export const codingChallenges: CodingChallenge[] = rawAllChallenges as CodingChallenge[];

export function getChallengeByNodeId(nodeId: string): CodingChallenge | undefined {
  return codingChallenges.find((c) => c.nodeId === nodeId);
}
