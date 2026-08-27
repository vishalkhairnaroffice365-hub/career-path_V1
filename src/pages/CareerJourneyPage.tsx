import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { useCareer } from '../context/CareerContext';
import { careers } from '../data/careers';

const JOURNEY_STEPS = [
  { id: 'onboarding', label: 'Profile Created', description: 'You told us about yourself', icon: '✋', route: '/onboarding' },
  { id: 'sky', label: 'Sky Explored', description: 'Discovered your career universe', icon: '🌌', route: '/sky' },
  { id: 'career', label: 'Career Chosen', description: 'Found your path', icon: '🎯', route: '/select' },
  { id: 'skill-gap', label: 'Gap Analyzed', description: 'Knew where to start', icon: '⚡', route: '/skill-gap' },
  { id: 'roadmap', label: 'Roadmap Built', description: 'Clear path ahead', icon: '🗺️', route: '/roadmap' },
  { id: 'learning', label: 'Learning Started', description: 'First steps taken', icon: '📚', route: '/resources' },
  { id: 'projects', label: 'Projects Shipped', description: 'Portfolio growing', icon: '🚀', route: '/projects' },
  { id: 'ready', label: 'Career Ready', description: 'Ready to apply', icon: '✨', route: '/readiness' },
];

export default function CareerJourneyPage() {
  const navigate = useNavigate();
  const { selectedCareer } = useCareer();
  const career = selectedCareer || careers[0];

  const completedSteps = ['onboarding', 'sky', 'career', 'skill-gap', 'roadmap', 'learning'];
  const currentStepIndex = JOURNEY_STEPS.findIndex(s => !completedSteps.includes(s.id));
  const progress = Math.round((completedSteps.length / JOURNEY_STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 border-b border-border pb-8">
          <h1 className="font-display text-5xl md:text-6xl font-medium text-foreground tracking-tight mb-4">Your Career Journey</h1>
          <p className="text-xl text-muted-foreground font-light">
            On your way to becoming a <span className="text-foreground font-medium">{career.title}</span>.
          </p>
        </motion.div>

        {/* Progress overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex justify-between items-end mb-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Journey Progress</span>
            <span className="font-display font-medium text-3xl text-foreground leading-none">{progress}%</span>
          </div>
          <Progress value={progress} variant="primary" size="md" />
          <p className="text-sm text-muted-foreground mt-4 font-medium tracking-wide">
            {completedSteps.length} of {JOURNEY_STEPS.length} milestones reached
          </p>
        </motion.div>

        {/* Journey timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-surface-2" />

          <div className="space-y-0">
            {JOURNEY_STEPS.map((step, i) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = i === currentStepIndex;
              const isLocked = !isCompleted && !isCurrent;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="relative flex gap-5 pb-8 last:pb-0"
                >
                  {/* Step icon */}
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-success/10 text-success'
                        : isCurrent
                        ? 'bg-primary border border-primary text-background'
                        : 'bg-surface border border-border'
                    }`}
                  >
                    <span className={`text-xl ${isLocked ? 'opacity-30 grayscale' : ''}`}>{step.icon}</span>
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 py-1 border-b transition-all duration-300 ${
                      isCompleted
                        ? 'border-border'
                        : isCurrent
                        ? 'border-primary'
                        : 'border-border/50 opacity-40'
                    }`}
                    onClick={() => !isLocked && navigate(step.route)}
                    style={{ cursor: isLocked ? 'default' : 'pointer' }}
                  >
                    <div className="flex items-center justify-between pb-4">
                      <div>
                        <p className={`font-display text-lg ${isCurrent ? 'font-medium text-primary' : 'text-foreground'}`}>{step.label}</p>
                        <p className="text-sm text-muted-foreground font-light mt-1">{step.description}</p>
                      </div>
                      {isCurrent && (
                        <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />} onClick={() => navigate(step.route)}>
                          Continue
                        </Button>
                      )}
                      {isLocked && <Lock size={16} className="text-muted-foreground" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
