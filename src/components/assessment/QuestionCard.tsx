import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MCQQuestion } from '../../data/assessments';

interface QuestionCardProps {
  question: MCQQuestion;
  index: number;
  total: number;
  selectedAnswer: string | undefined;
  onAnswer: (optionId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function QuestionCard({
  question,
  index,
  total,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: QuestionCardProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {/* Question number + text */}
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
            Question {index + 1} of {total}
          </p>
          <h3 className="font-display text-2xl font-medium text-foreground leading-snug">
            {question.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            return (
              <motion.button
                key={option.id}
                onClick={() => onAnswer(option.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-surface hover:border-primary/40 hover:bg-surface-2 text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                    isSelected ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                  </div>
                  <span className="text-sm font-medium">{option.text}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={onPrev}
            disabled={isFirst}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          {!isLast && (
            <button
              onClick={onNext}
              disabled={!selectedAnswer}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
