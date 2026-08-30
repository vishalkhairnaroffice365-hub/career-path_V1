import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Code2, Play, CheckCircle, XCircle, ChevronRight, Lightbulb } from 'lucide-react';
import { getChallengeByNodeId } from '../data/codingChallenges';
import { useCareer } from '../context/CareerContext';
import { TestTimer } from '../components/assessment/TestTimer';
import type { TestCase } from '../data/codingChallenges';

type ChallengePhase = 'challenge' | 'result';

export default function CodingChallengePage() {
  const { nodeId } = useParams<{ nodeId: string }>();
  const navigate = useNavigate();
  const { saveCodingScore } = useCareer();

  const challenge = useMemo(() => (nodeId ? getChallengeByNodeId(nodeId) : undefined), [nodeId]);

  const [code, setCode] = useState(challenge?.starterCode ?? '');
  const [phase, setPhase] = useState<ChallengePhase>('challenge');
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [score, setScore] = useState(0);

  if (!challenge || !nodeId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">💻</div>
          <h2 className="font-display text-2xl font-medium text-foreground mb-2">Content Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find this learning content.</p>
          <button onClick={() => navigate('/roadmap')} className="text-primary font-medium hover:underline">
            ← Back to Roadmap
          </button>
        </div>
      </div>
    );
  }

  // Mock evaluation — randomly passes most test cases if code is longer than starter
  // TODO: Connect to backend API for real code execution
  const runMockEvaluation = () => {
    const codeLength = code.trim().length;
    const starterLength = challenge.starterCode.trim().length;
    const hasAddedCode = codeLength > starterLength + 50;

    return challenge.testCases.map((tc, i) => ({
      ...tc,
      // Pass most cases if user added substantial code, else fail
      isPassing: hasAddedCode ? (i < challenge.testCases.length - 1 || Math.random() > 0.3) : false,
    }));
  };

  const handleRun = () => {
    const results = runMockEvaluation();
    setTestResults(results);
  };

  const handleSubmit = () => {
    // TODO: Connect to backend API for actual code submission & evaluation
    const results = runMockEvaluation();
    setTestResults(results);
    const passed = results.filter((r) => r.isPassing).length;
    const calculatedScore = Math.round((passed / results.length) * 100);
    setScore(calculatedScore);
    saveCodingScore(nodeId, calculatedScore);
    setPhase('result');
  };

  const difficultyColor: Record<string, string> = {
    beginner: 'text-success',
    intermediate: 'text-warning',
    advanced: 'text-danger',
  };

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-4">
        <button
          onClick={() => navigate('/roadmap')}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Roadmap
        </button>

        {phase === 'challenge' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left — Problem */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Code2 size={20} className="text-primary" />
                  </div>
                  <span className={`text-xs uppercase tracking-widest font-bold ${difficultyColor[challenge.difficulty]}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <h1 className="font-display text-3xl font-medium text-foreground mb-3">{challenge.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <TestTimer totalSeconds={challenge.timeLimit} onExpire={handleSubmit} />
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="p-5 rounded-xl border border-border bg-surface text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {challenge.description}
                  </div>
                </div>
              </div>

              {/* Test cases */}
              {testResults.length > 0 && (
                <div>
                  <h3 className="font-display text-base font-medium text-foreground mb-3">Test Cases</h3>
                  <div className="space-y-2">
                    {testResults.map((tc) => (
                      <div
                        key={tc.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
                          tc.isPassing ? 'border-success/20 bg-success/5' : 'border-danger/20 bg-danger/5'
                        }`}
                      >
                        {tc.isPassing ? (
                          <CheckCircle size={15} className="text-success" />
                        ) : (
                          <XCircle size={15} className="text-danger" />
                        )}
                        <span className={tc.isPassing ? 'text-foreground' : 'text-muted-foreground'}>
                          {tc.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hints */}
              {challenge.hints.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
                  >
                    <Lightbulb size={14} />
                    {showHint ? 'Hide' : 'Show'} Hint {hintIndex + 1}/{challenge.hints.length}
                  </button>
                  {showHint && (
                    <div className="mt-2 p-4 rounded-xl border border-warning/20 bg-warning/5 text-sm text-foreground">
                      {challenge.hints[hintIndex]}
                      {hintIndex < challenge.hints.length - 1 && (
                        <button
                          onClick={() => setHintIndex((i) => i + 1)}
                          className="ml-3 text-xs text-primary font-medium hover:underline"
                        >
                          Next hint →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Right — Code Editor */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  {challenge.language}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleRun}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-border rounded-xl text-xs font-semibold text-foreground hover:bg-surface-2 transition-all"
                  >
                    <Play size={12} /> Run
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-all"
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Styled textarea code editor */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 min-h-[420px] w-full p-5 bg-surface border border-border rounded-2xl font-mono text-sm text-foreground resize-none focus:outline-none focus:border-primary/50 transition-all leading-relaxed"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              />
              {/* TODO: Connect to backend API for real code execution */}
              <p className="text-xs text-muted-foreground">
                Note: Code evaluation is simulated. Real execution will be available when backend is connected.
              </p>
            </motion.div>
          </div>
        )}

        {phase === 'result' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className={`p-10 rounded-2xl border mb-8 ${score >= 70 ? 'border-success/30 bg-success/5' : 'border-danger/30 bg-danger/5'}`}>
              <div className="text-6xl mb-4">{score >= 70 ? '🎉' : '🔁'}</div>
              <h2 className="font-display text-4xl font-medium text-foreground mb-2">
                Score: {score}%
              </h2>
              <p className={`text-xl font-semibold ${score >= 70 ? 'text-success' : 'text-danger'}`}>
                {score >= 70 ? '✓ Passed' : '✗ Keep Practicing'}
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                {testResults.filter((t) => t.isPassing).length} / {testResults.length} test cases passed
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => { setPhase('challenge'); setCode(challenge.starterCode); setTestResults([]); }}
                className="px-6 py-3 border border-border rounded-xl text-sm font-medium hover:bg-surface-2 transition-all"
              >
                Try Again
              </button>
              <motion.button
                onClick={() => navigate('/roadmap')}
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              >
                Continue Roadmap <ChevronRight size={15} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
