import { useEffect, useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCareer } from '../context/CareerContext';

const ANALYSIS_STEPS = [
  { id: 1, text: 'Understanding your interests...', emoji: '💡', color: '#6366f1', duration: 2200 },
  { id: 2, text: 'Mapping your strengths...', emoji: '💪', color: '#8b5cf6', duration: 2000 },
  { id: 3, text: 'Connecting your skills...', emoji: '⚡', color: '#06b6d4', duration: 1800 },
  { id: 4, text: 'Exploring career possibilities...', emoji: '🚀', color: '#10b981', duration: 2400 },
  { id: 5, text: 'Personalizing your Career Sky...', emoji: '🌌', color: '#a855f7', duration: 2000 },
  { id: 6, text: 'Ready', emoji: '✨', color: '#fbbf24', duration: 1000 },
];

export default function AnalysisPage() {
  const navigate = useNavigate();
  const { completeOnboarding } = useCareer();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let totalDelay = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    ANALYSIS_STEPS.forEach((step, i) => {
      const timer = setTimeout(() => {
        setCurrentStep(i);
        if (i === ANALYSIS_STEPS.length - 1) {
          setIsComplete(true);
        }
      }, totalDelay);
      timers.push(timer);
      totalDelay += step.duration;
    });

    // Navigate after all steps
    const navTimer = setTimeout(() => {
      completeOnboarding({ onboardingCompleted: true });
      navigate('/sky');
    }, totalDelay + 800);

    timers.push(navTimer);

    return () => timers.forEach((t) => clearTimeout(t));
  }, [navigate, completeOnboarding]);

  const step = ANALYSIS_STEPS[currentStep];
  const progress = ((currentStep + 1) / ANALYSIS_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Dynamic background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: isComplete 
            ? '#020817' // Career Sky base color
            : 'var(--color-background)',
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(ellipse at 50% 50%, ${step?.color}15 0%, transparent 70%)`
        }}
        transition={{ duration: 1 }}
      />

      {/* Orbiting particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: `${50 + 40 * Math.cos((i / 24) * 2 * Math.PI)}%`,
              top: `${50 + 40 * Math.sin((i / 24) * 2 * Math.PI)}%`,
              background: step?.color || '#6366f1',
              opacity: i % 3 === 0 ? 0.8 : 0.3,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [i % 3 === 0 ? 0.8 : 0.3, 0.1, i % 3 === 0 ? 0.8 : 0.3],
            }}
            transition={{
              duration: 2 + i * 0.1,
              repeat: Infinity,
              delay: i * 0.08,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-md w-full px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 flex items-center justify-center gap-2"
        >
          <span className="text-2xl">✦</span>
          <span className="font-display font-bold text-lg">CareerPath</span>
        </motion.div>

        {/* Animated emoji orb */}
        <motion.div
          className="relative w-28 h-28 mx-auto mb-10"
          animate={{ rotate: isComplete ? 0 : 360 }}
          transition={{ duration: 8, repeat: isComplete ? 0 : Infinity, ease: 'linear' }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${step?.color} ${progress}%, rgba(255,255,255,0.05) ${progress}%)`,
            }}
          />
          <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStep}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl"
              >
                {step?.emoji}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Step text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45 }}
          >
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              {step?.text}
            </h1>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 space-y-4">
          {ANALYSIS_STEPS.slice(0, currentStep + 1).map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-center gap-4 text-base ${i === currentStep ? (isComplete ? 'text-white' : 'text-primary') : 'text-muted-foreground'}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-500`}
                style={{ 
                  background: i === currentStep ? s.color : 'currentColor',
                  boxShadow: i === currentStep ? `0 0 10px ${s.color}` : 'none'
                }}
              />
              <span className="font-medium tracking-tight">{s.text}</span>
            </motion.div>
          ))}
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <p className="text-muted-foreground text-sm animate-pulse">
              Entering your Career Sky...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
