import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw, ChevronRight, Trophy } from 'lucide-react';
import type { MCQQuestion } from '../../data/assessments';

interface TestResultProps {
  questions: MCQQuestion[];
  answers: Record<string, string>; // questionId → selectedOptionId
  passingScore: number;
  nodeTitle: string;
  onContinue: () => void;
  onRetry: () => void;
}

export function TestResult({ questions, answers, passingScore, nodeTitle, onContinue, onRetry }: TestResultProps) {
  const correct = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
  const total = questions.length;
  const percentage = Math.round((correct / total) * 100);
  const passed = percentage >= passingScore;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="max-w-2xl mx-auto"
    >
      {/* Result header */}
      <div className={`text-center p-10 rounded-2xl border mb-8 ${
        passed
          ? 'border-success/30 bg-success/5'
          : 'border-danger/30 bg-danger/5'
      }`}>
        {passed ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="w-20 h-20 rounded-full bg-success/15 border-2 border-success/30 flex items-center justify-center mx-auto mb-6"
          >
            <Trophy size={36} className="text-success" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="w-20 h-20 rounded-full bg-danger/15 border-2 border-danger/30 flex items-center justify-center mx-auto mb-6"
          >
            <XCircle size={36} className="text-danger" />
          </motion.div>
        )}

        <h2 className="font-display text-4xl font-medium text-foreground mb-2">
          {correct} / {total}
        </h2>
        <p className="font-display text-6xl font-bold mb-4" style={{ color: passed ? 'var(--color-success)' : 'var(--color-danger)' }}>
          {percentage}%
        </p>
        <p className={`text-xl font-semibold ${passed ? 'text-success' : 'text-danger'}`}>
          {passed ? '✓ Passed' : '✗ Assessment Failed'}
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Passing score: {passingScore}% &nbsp;|&nbsp; {nodeTitle}
        </p>
      </div>

      {/* Review answers */}
      <div className="space-y-4 mb-8">
        <h3 className="font-display text-xl font-medium text-foreground">Review</h3>
        {questions.map((q, i) => {
          const isCorrect = answers[q.id] === q.correctAnswer;
          const userAnswer = q.options.find((o) => o.id === answers[q.id]);
          const correctOption = q.options.find((o) => o.id === q.correctAnswer);
          return (
            <div key={q.id} className={`p-5 rounded-xl border ${isCorrect ? 'border-success/20 bg-success/5' : 'border-danger/20 bg-danger/5'}`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle size={18} className="text-success mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle size={18} className="text-danger mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-2">Q{i + 1}. {q.question}</p>
                  {!isCorrect && (
                    <div className="space-y-1 mb-2 text-xs">
                      <p className="text-danger">Your answer: {userAnswer?.text || 'Not answered'}</p>
                      <p className="text-success">Correct: {correctOption?.text}</p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground italic">{q.explanation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        {!passed && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-surface-2 transition-all"
          >
            <RotateCcw size={16} />
            Retry Test
          </button>
        )}
        {passed && (
          <motion.button
            onClick={onContinue}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
          >
            Continue Roadmap
            <ChevronRight size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
