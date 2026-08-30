import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button } from '../../components/ui/Button';
import { StepAboutYou } from './steps/StepAboutYou';
import { StepInterests } from './steps/StepInterests';
import { StepSkills } from './steps/StepSkills';
import { StepStrengths } from './steps/StepStrengths';
import { StepWorkStyle } from './steps/StepWorkStyle';
import { StepCareerGoals } from './steps/StepCareerGoals';
import { StepFutureVision } from './steps/StepFutureVision';

const STEP_META = [
  { label: 'About You', emoji: '👋', description: 'Tell us who you are' },
  { label: 'Interests', emoji: '💡', description: 'What excites you?' },
  { label: 'Skills', emoji: '⚡', description: 'Where do you stand?' },
  { label: 'Strengths', emoji: '💪', description: 'What are you best at?' },
  { label: 'Work Style', emoji: '🎯', description: 'How do you thrive?' },
  { label: 'Career Goals', emoji: '🚀', description: 'Where are you headed?' },
  { label: 'Future Vision', emoji: '🌟', description: 'What does success look like?' },
];

const stepComponents = [
  StepAboutYou,
  StepInterests,
  StepSkills,
  StepStrengths,
  StepWorkStyle,
  StepCareerGoals,
  StepFutureVision,
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

import { userApi } from '../../services/user.api';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { currentStepIndex, progress, nextStep, prevStep, isFirstStep, isLastStep, state } = useOnboarding();
  const totalSteps = STEP_META.length;
  const [direction, setDirection] = React.useState(1);

  const CurrentStep = stepComponents[currentStepIndex];
  const meta = STEP_META[currentStepIndex];

  const handleNext = async () => {
    // Sync onboarding data to backend
    if (state.data && Object.keys(state.data).length > 0) {
      try {
        await userApi.saveOnboarding(state.data);
      } catch (err) {
        console.warn('Could not save onboarding data to backend:', err);
      }
    }

    if (isLastStep) {
      navigate('/profile-reflection');
    } else {
      setDirection(1);
      nextStep();
    }
  };

  const handleBack = () => {
    if (isFirstStep) {
      navigate('/');
    } else {
      setDirection(-1);
      prevStep();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none bg-surface-2"
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          {isFirstStep ? 'Home' : 'Back'}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg">✦</span>
          <span className="font-display font-bold text-sm">CareerPath</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {currentStepIndex + 1} / {totalSteps}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 px-6">
        <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between mt-3">
          {STEP_META.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 ${
                i < currentStepIndex
                  ? 'bg-indigo-500 text-white'
                  : i === currentStepIndex
                  ? 'bg-primary/20 border-2 border-primary text-primary'
                  : 'bg-surface-2 border border-border text-muted-foreground'
              }`}
            >
              {i < currentStepIndex ? <Check size={12} /> : <span className="text-[10px]">{s.emoji}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Step header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`header-${currentStepIndex}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-8"
            >
              <span className="text-5xl block mb-3">{meta.emoji}</span>
              <h1 className="font-display text-display-sm font-bold text-foreground mb-2">{meta.label}</h1>
              <p className="text-muted-foreground text-lg">{meta.description}</p>
            </motion.div>
          </AnimatePresence>

          {/* Step body */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStepIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="editorial-surface rounded-3xl p-8 lg:p-12"
            >
              <CurrentStep />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer / Navigation */}
      <div className="relative z-10 px-6 py-5 flex justify-between items-center">
        <Button variant="ghost" size="md" onClick={handleBack} leftIcon={<ArrowLeft size={16} />}>
          {isFirstStep ? 'Exit' : 'Back'}
        </Button>
        <Button
          variant="gradient"
          size="lg"
          onClick={handleNext}
          rightIcon={isLastStep ? <Check size={18} /> : <ArrowRight size={18} />}
        >
          {isLastStep ? 'See My Profile' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
