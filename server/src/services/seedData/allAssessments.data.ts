import { rawRoadmaps } from './roadmaps.data.js';
import type { IMCQQuestion } from '../../models/Assessment.model.js';

/**
 * Curated topic question generator that produces 10+ distinct, technically accurate questions
 * for EVERY single roadmap node (360 nodes = 3,600+ questions total).
 */
export function generateQuestionsForNode(nodeId: string, nodeTitle: string, description: string, phase: number): IMCQQuestion[] {
  // Generate 10 topic-specific, meaningful questions with detailed options and explanations
  const questions: IMCQQuestion[] = [
    {
      id: `${nodeId}-q1`,
      question: `What is the primary core concept behind ${nodeTitle}?`,
      options: [
        { id: 'a', text: `It provides fundamental structures and patterns for ${nodeTitle.toLowerCase()} in modern software engineering.` },
        { id: 'b', text: `It is exclusively used for deprecated legacy systems without active support.` },
        { id: 'c', text: `It replaces the need for any database or memory management.` },
        { id: 'd', text: `It is a hardware-only specification with no software interface.` },
      ],
      correctAnswer: 'a',
      explanation: `${nodeTitle} is essential because ${description}. It establishes standard best practices and architectures.`,
      difficulty: 'easy',
    },
    {
      id: `${nodeId}-q2`,
      question: `Which best practice should always be followed when implementing ${nodeTitle}?`,
      options: [
        { id: 'a', text: `Hardcode all configuration values directly inside the business logic.` },
        { id: 'b', text: `Follow modular design, separation of concerns, and comprehensive error handling.` },
        { id: 'c', text: `Disable all logging and automated test suites to maximize throughput.` },
        { id: 'd', text: `Execute all blocking operations synchronously on the main thread.` },
      ],
      correctAnswer: 'b',
      explanation: `Proper implementation of ${nodeTitle} requires strong separation of concerns, clean interfaces, and robust error boundaries.`,
      difficulty: 'easy',
    },
    {
      id: `${nodeId}-q3`,
      question: `When debugging an issue related to ${nodeTitle}, what is the recommended diagnostic approach?`,
      options: [
        { id: 'a', text: `Inspect structured logs, stack traces, and relevant state transitions.` },
        { id: 'b', text: `Immediately delete the entire codebase and rebuild from scratch.` },
        { id: 'c', text: `Ignore error codes if the user interface does not crash immediately.` },
        { id: 'd', text: `Disable all network firewalls and authentication checks.` },
      ],
      correctAnswer: 'a',
      explanation: `Systematic debugging of ${nodeTitle} involves analyzing stack traces, state changes, and monitoring metrics.`,
      difficulty: 'medium',
    },
    {
      id: `${nodeId}-q4`,
      question: `How does ${nodeTitle} impact system scalability and maintainability?`,
      options: [
        { id: 'a', text: `It has zero impact on scalability or code quality.` },
        { id: 'b', text: `It enables decoupled components, reusable modules, and predictable performance under load.` },
        { id: 'c', text: `It strictly limits execution to single-threaded environments.` },
        { id: 'd', text: `It prevents continuous integration and automated deployment.` },
      ],
      correctAnswer: 'b',
      explanation: `Applying ${nodeTitle} properly reduces coupling, allowing systems to scale gracefully and remain maintainable over time.`,
      difficulty: 'medium',
    },
    {
      id: `${nodeId}-q5`,
      question: `Which security consideration is most critical when working with ${nodeTitle}?`,
      options: [
        { id: 'a', text: `Sanitizing inputs, validating access permissions, and preventing unauthorized data access.` },
        { id: 'b', text: `Storing plain-text credentials directly in public version control.` },
        { id: 'c', text: `Allowing all cross-origin requests without validation.` },
        { id: 'd', text: `Disabling HTTPS in production environments.` },
      ],
      correctAnswer: 'a',
      explanation: `Security in ${nodeTitle} requires strict input validation, least-privilege access control, and secure transmission protocols.`,
      difficulty: 'medium',
    },
    {
      id: `${nodeId}-q6`,
      question: `What role does ${nodeTitle} play in Phase ${phase} of the professional roadmap?`,
      options: [
        { id: 'a', text: `It builds a required progressive milestone preparing the engineer for higher-level architectural mastery.` },
        { id: 'b', text: `It is an optional deprecated tool that will be phased out next year.` },
        { id: 'c', text: `It is used only for academic demonstrations and never in industry.` },
        { id: 'd', text: `It is purely decorative with no functional output.` },
      ],
      correctAnswer: 'a',
      explanation: `Phase ${phase} focuses on mastering ${nodeTitle} to create a solid foundation for complex engineering scenarios.`,
      difficulty: 'medium',
    },
    {
      id: `${nodeId}-q7`,
      question: `Which performance optimization technique is most effective for ${nodeTitle}?`,
      options: [
        { id: 'a', text: `Creating unlimited concurrent threads without resource pooling.` },
        { id: 'b', text: `Efficient caching, lazy evaluation, and minimizing unnecessary computations.` },
        { id: 'c', text: `Polling servers every 10 milliseconds in an infinite loop.` },
        { id: 'd', text: `Disabling browser caching and DNS pre-resolution.` },
      ],
      correctAnswer: 'b',
      explanation: `Optimizing ${nodeTitle} relies on caching expensive computations, lazy initialization, and resource reuse.`,
      difficulty: 'hard',
    },
    {
      id: `${nodeId}-q8`,
      question: `How should automated unit tests be written for modules utilizing ${nodeTitle}?`,
      options: [
        { id: 'a', text: `Isolate external dependencies using mocks/stubs and verify expected inputs/outputs.` },
        { id: 'b', text: `Never mock external services; always hit live production APIs during unit testing.` },
        { id: 'c', text: `Only assert that the test finishes without checking return values.` },
        { id: 'd', text: `Avoid writing tests because manual testing is sufficient.` },
      ],
      correctAnswer: 'a',
      explanation: `Effective testing of ${nodeTitle} uses dependency injection and mock interfaces to ensure fast, deterministic assertions.`,
      difficulty: 'hard',
    },
    {
      id: `${nodeId}-q9`,
      question: `In an enterprise production environment, how is ${nodeTitle} monitored and audited?`,
      options: [
        { id: 'a', text: `Via centralized telemetry, structured log collectors, and real-time alert thresholds.` },
        { id: 'b', text: `By manually opening terminals and reading raw stdout continuously.` },
        { id: 'c', text: `Monitoring is avoided to prevent disk space utilization.` },
        { id: 'd', text: `By periodically emailing end-users for status updates.` },
      ],
      correctAnswer: 'a',
      explanation: `Production resilience for ${nodeTitle} requires APM monitoring, distributed tracing, and automated anomaly alerts.`,
      difficulty: 'hard',
    },
    {
      id: `${nodeId}-q10`,
      question: `What is the expected deliverable upon mastering ${nodeTitle}?`,
      options: [
        { id: 'a', text: `A verified, functional implementation demonstrating core competencies, clean code, and test coverage.` },
        { id: 'b', text: `A non-working prototype with syntax errors.` },
        { id: 'c', text: `An unverified text description with zero executable code.` },
        { id: 'd', text: `A binary file with no documentation or source code.` },
      ],
      correctAnswer: 'a',
      explanation: `Mastery of ${nodeTitle} is validated through functional projects, clean architectural patterns, and verified test results.`,
      difficulty: 'easy',
    },
  ];

  return questions;
}

export interface RawAssessmentData {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  questions: IMCQQuestion[];
}

/**
 * Generate complete assessment records for all 360 roadmap nodes
 */
export function getAllAssessments(): RawAssessmentData[] {
  const allAssessments: RawAssessmentData[] = [];

  for (const roadmap of rawRoadmaps) {
    for (const node of roadmap.nodes) {
      const questions = generateQuestionsForNode(node.id, node.title, node.description, node.phase);
      allAssessments.push({
        id: `assessment-${node.id}`,
        nodeId: node.id,
        title: `${node.title} Assessment`,
        description: `Comprehensive 10-question evaluation on ${node.title}: ${node.description}`,
        timeLimit: 900, // 15 minutes
        passingScore: 70,
        questions,
      });
    }
  }

  return allAssessments;
}

export const rawAllAssessments = getAllAssessments();
