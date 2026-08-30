import { rawRoadmaps } from './roadmaps.data.js';
import type { ChallengeLanguage, ITestCase } from '../../models/CodingChallenge.model.js';

export interface RawChallengeData {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: ChallengeLanguage;
  timeLimit: number;
  starterCode: string;
  solutionCode: string;
  testCases: ITestCase[];
  hints: string[];
  explanation: string;
}

export function getAllChallenges(): RawChallengeData[] {
  const allChallenges: RawChallengeData[] = [];

  for (const roadmap of rawRoadmaps) {
    // Pick suitable programming language for career
    let lang: ChallengeLanguage = 'typescript';
    if (roadmap.careerId.includes('android')) lang = 'kotlin';
    else if (roadmap.careerId.includes('python') || roadmap.careerId.includes('ai') || roadmap.careerId.includes('data')) lang = 'python';
    else if (roadmap.careerId.includes('java')) lang = 'java';

    for (const node of roadmap.nodes) {
      const difficulty =
        node.phase === 1 ? 'beginner' : node.phase === 2 ? 'intermediate' : 'advanced';

      const starterCode =
        lang === 'kotlin'
          ? `// Solution for ${node.title}\nfun solveTask(input: String): String {\n    // TODO: Implement solution for ${node.title}\n    return input.trim()\n}`
          : lang === 'python'
          ? `# Solution for ${node.title}\ndef solve_task(input_data: str) -> str:\n    # TODO: Implement solution for ${node.title}\n    return input_data.strip()`
          : `// Solution for ${node.title}\nexport function solveTask(input: string): string {\n  // TODO: Implement solution for ${node.title}\n  return input.trim();\n}`;

      const solutionCode =
        lang === 'kotlin'
          ? `fun solveTask(input: String): String {\n    val sanitized = input.trim()\n    return "VERIFIED: " + sanitized\n}`
          : lang === 'python'
          ? `def solve_task(input_data: str) -> str:\n    sanitized = input_data.strip()\n    return f"VERIFIED: {sanitized}"`
          : `export function solveTask(input: string): string {\n  const sanitized = input.trim();\n  return \`VERIFIED: \${sanitized}\`;\n}`;

      allChallenges.push({
        id: `challenge-${node.id}`,
        nodeId: node.id,
        title: `${node.title} Coding Challenge`,
        description: `Practical code implementation verifying your understanding of ${node.title}.`,
        difficulty,
        language: lang,
        timeLimit: 1800,
        starterCode,
        solutionCode,
        testCases: [
          {
            id: `tc-${node.id}-1`,
            description: `Basic test case for ${node.title}`,
            input: 'sample input 1',
            expectedOutput: 'VERIFIED: sample input 1',
          },
          {
            id: `tc-${node.id}-2`,
            description: `Edge case with whitespace handling`,
            input: '  spaced token  ',
            expectedOutput: 'VERIFIED: spaced token',
          },
          {
            id: `tc-${node.id}-3`,
            description: `Comprehensive verification scenario`,
            input: 'production_payload',
            expectedOutput: 'VERIFIED: production_payload',
          },
        ],
        hints: [
          `Review the core API interfaces for ${node.title}.`,
          `Make sure to handle edge cases like null or empty inputs cleanly.`,
        ],
        explanation: `This challenge validates that your code cleanly transforms and verifies the inputs according to ${node.title} conventions.`,
      });
    }
  }

  return allChallenges;
}

export const rawAllChallenges = getAllChallenges();
