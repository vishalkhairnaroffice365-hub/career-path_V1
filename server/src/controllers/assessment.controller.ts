import type { Request, Response, NextFunction } from 'express';
import { Assessment } from '../models/Assessment.model.js';
import { ProgressService } from '../services/progress.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export class AssessmentController {
  static async getAssessmentByNodeId(req: Request, res: Response, next: NextFunction) {
    try {
      const { nodeId } = req.params;
      const assessment = await Assessment.findOne({ nodeId });

      if (!assessment) {
        throw ApiError.notFound(`Assessment not found for node ID: ${nodeId}`);
      }

      const user = req.user;
      const prevScore = user?.learning?.assessmentScores?.[nodeId] || null;

      // Don't expose correct answers and explanations during initial test attempt
      const safeQuestions = assessment.questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        difficulty: q.difficulty,
      }));

      return ApiResponse.success(
        res,
        {
          id: assessment.id,
          nodeId: assessment.nodeId,
          title: assessment.title,
          description: assessment.description,
          timeLimit: assessment.timeLimit,
          passingScore: assessment.passingScore,
          questions: safeQuestions,
          previousResult: prevScore,
        },
        'Assessment loaded successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async submitAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { nodeId } = req.params;
      const { answers } = req.body; // Record<string, string> (questionId -> optionId)

      if (!answers || typeof answers !== 'object') {
        throw ApiError.badRequest('Answers object is required');
      }

      const assessment = await Assessment.findOne({ nodeId });
      if (!assessment) {
        throw ApiError.notFound(`Assessment not found for node ID: ${nodeId}`);
      }

      // Server-side grading
      let correctCount = 0;
      const breakdown = assessment.questions.map((q) => {
        const userAnswer = answers[q.id];
        const isCorrect = userAnswer === q.correctAnswer;
        if (isCorrect) correctCount++;

        return {
          questionId: q.id,
          question: q.question,
          userAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect,
          explanation: q.explanation,
        };
      });

      const totalQuestions = assessment.questions.length || 1;
      const score = Math.round((correctCount / totalQuestions) * 100);
      const passed = score >= assessment.passingScore;

      const { user: updatedUser, unlockedAchievements } =
        await ProgressService.recordAssessmentScore(user, nodeId, score, passed);

      return ApiResponse.success(
        res,
        {
          score,
          passed,
          correctCount,
          totalQuestions,
          breakdown,
          user: updatedUser,
          unlockedAchievements,
        },
        passed
          ? `🎉 Congratulations! You passed with ${score}%.`
          : `You scored ${score}%. Minimum passing score is ${assessment.passingScore}%.`
      );
    } catch (error) {
      next(error);
    }
  }
}
