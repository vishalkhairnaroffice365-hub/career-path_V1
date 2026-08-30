import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { getAssessmentByNodeId } from '../data/assessments';
import { useCareer } from '../context/CareerContext';
import { QuestionCard } from '../components/assessment/QuestionCard';
import { TestTimer } from '../components/assessment/TestTimer';
import { TestResult } from '../components/assessment/TestResult';

type TestPhase = 'intro' | 'test' | 'result';

export default function AssessmentPage() {
  const { nodeId } = useParams<{ nodeId: string }>();
  const navigate = useNavigate();
  const { saveAssessmentScore, learning } = useCareer();

  const assessment = useMemo(() => (nodeId ? getAssessmentByNodeId(nodeId) : undefined), [nodeId]);

  const [phase, setPhase] = useState<TestPhase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timerKey, setTimerKey] = useState(0); // increment to reset timer on retry

  const existingScore = nodeId ? learning.assessmentScores[nodeId] : undefined;

  if (!assessment || !nodeId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="font-display text-2xl font-medium text-foreground mb-2">Content Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find this learning content.</p>
          <button onClick={() => navigate('/roadmap')} className="text-primary font-medium hover:underline">
            ← Back to Roadmap
          </button>
        </div>
      </div>
    );
  }

  const questions = assessment.questions;
  const currentQuestion = questions[currentIndex];
  const allAnswered = Object.keys(answers).length === questions.length;

  const submitTest = (_expired = false) => {
    const correct = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= assessment.passingScore;
    saveAssessmentScore({
      nodeId,
      score,
      passed,
      attempts: 1,
      lastAttemptAt: new Date().toISOString(),
    });
    setPhase('result');
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setTimerKey((k) => k + 1);
    setPhase('test');
  };

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back */}
        <button
          onClick={() => navigate('/roadmap')}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Roadmap
        </button>

        {/* ── INTRO ───────────────────────────────────────────────── */}
        {phase === 'intro' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                <Shield size={28} className="text-primary" />
              </div>
              <h1 className="font-display text-4xl font-medium text-foreground mb-3">{assessment.title}</h1>
              <p className="text-lg text-muted-foreground font-light">{assessment.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
                { label: 'Questions', value: questions.length },
                { label: 'Time Limit', value: `${Math.round(assessment.timeLimit / 60)} min` },
                { label: 'Passing Score', value: `${assessment.passingScore}%` },
              ].map((item) => (
                <div key={item.label} className="p-5 rounded-2xl border border-border bg-surface text-center">
                  <p className="font-display text-2xl font-medium text-foreground mb-1">{item.value}</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{item.label}</p>
                </div>
              ))}
            </div>

            {existingScore && (
              <div className={`p-4 rounded-xl border mb-6 ${existingScore.passed ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}`}>
                <p className="text-sm text-muted-foreground">
                  Previous attempt: <span className="font-semibold text-foreground">{existingScore.score}%</span>
                  {existingScore.passed ? ' — Passed ✓' : ' — Try again to improve'}
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <motion.button
                onClick={() => setPhase('test')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-base hover:opacity-90 transition-all shadow-editorial"
              >
                <Shield size={18} /> Start Assessment
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── TEST ────────────────────────────────────────────────── */}
        {phase === 'test' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header row */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-xl font-medium text-foreground">{assessment.title}</h2>
                <div className="flex gap-1.5 mt-2">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        answers[questions[i].id] ? 'bg-primary' : i === currentIndex ? 'bg-primary/40' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <TestTimer key={timerKey} totalSeconds={assessment.timeLimit} onExpire={() => submitTest(true)} />
            </div>

            <div className="p-8 rounded-2xl border border-border bg-surface mb-6">
              <QuestionCard
                question={currentQuestion}
                index={currentIndex}
                total={questions.length}
                selectedAnswer={answers[currentQuestion.id]}
                onAnswer={(optionId) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))}
                onNext={() => setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))}
                onPrev={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                isFirst={currentIndex === 0}
                isLast={currentIndex === questions.length - 1}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <motion.button
                onClick={() => submitTest(false)}
                disabled={!allAnswered}
                whileHover={allAnswered ? { scale: 1.02 } : {}}
                className="inline-flex items-center gap-2 px-8 py-3 bg-success text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Submit Test ({Object.keys(answers).length}/{questions.length} answered)
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── RESULT ──────────────────────────────────────────────── */}
        {phase === 'result' && (
          <TestResult
            questions={questions}
            answers={answers}
            passingScore={assessment.passingScore}
            nodeTitle={assessment.title}
            onContinue={() => navigate('/roadmap')}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
}
