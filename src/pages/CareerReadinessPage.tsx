import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Target } from 'lucide-react';
import { CircularProgress, Progress } from '../components/ui/Progress';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useCareer } from '../context/CareerContext';
import { careers } from '../data/careers';

export default function CareerReadinessPage() {
  const navigate = useNavigate();
  const { user, selectedCareer } = useCareer();
  const career = selectedCareer || careers[0];
  const score = user.stats?.careerReadinessScore || 0;

  // Calculate live dynamic factors
  const skillsPercent = Math.min(
    Math.round(((user.progress.completedNodeIds?.length || 0) / 10) * 100),
    100
  );
  const projectsPercent = Math.min(
    Math.round(((user.progress.completedProjectIds?.length || 0) / 3) * 100),
    100
  );
  const resourcesPercent = Math.min(
    Math.round(((user.progress.completedResourceIds?.length || 0) / 4) * 100),
    100
  );
  const streakPercent = Math.min(
    Math.round(((user.progress.streak || 0) / 14) * 100),
    100
  );

  const readinessFactors = [
    {
      label: 'Skills Acquired',
      value: skillsPercent,
      icon: '⚡',
      description: `${user.progress.completedNodeIds?.length || 0} nodes completed on roadmap`,
    },
    {
      label: 'Projects Built',
      value: projectsPercent,
      icon: '🚀',
      description: `${user.progress.completedProjectIds?.length || 0} portfolio projects submitted`,
    },
    {
      label: 'Resources Completed',
      value: resourcesPercent,
      icon: '📚',
      description: `${user.progress.completedResourceIds?.length || 0} courses and tutorials completed`,
    },
    {
      label: 'Consistency',
      value: streakPercent,
      icon: '🔥',
      description: `${user.progress.streak || 0}-day active learning streak`,
    },
  ];

  const nextActions = [
    { label: 'Complete 2 more roadmap nodes', to: '/roadmap', impact: '+8%' },
    { label: 'Finish a portfolio project milestone', to: '/projects', impact: '+12%' },
    { label: 'Complete 2 learning resources', to: '/resources', impact: '+6%' },
    { label: 'Maintain your learning streak', to: '/progress', impact: '+4%' },
  ];

  const getReadinessLabel = (s: number) => {
    if (s >= 80) return { label: 'Job Ready', color: 'text-success', emoji: '🎯' };
    if (s >= 60) return { label: 'Almost There', color: 'text-info', emoji: '⚡' };
    if (s >= 40) return { label: 'Making Progress', color: 'text-primary', emoji: '📈' };
    return { label: 'Just Getting Started', color: 'text-accent', emoji: '🌱' };
  };

  const readiness = getReadinessLabel(score);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-border pb-8"
        >
          <h1 className="font-display text-5xl md:text-6xl font-medium text-foreground tracking-tight mb-4">
            Career Readiness
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            How ready are you to land a job as a{' '}
            <span className="text-foreground font-medium">{career.title}</span>?
          </p>
        </motion.div>

        {/* Main score */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16 flex flex-col md:flex-row items-center gap-12 md:gap-24"
        >
          <div className="flex-shrink-0">
            <CircularProgress
              value={score}
              size={240}
              strokeWidth={10}
              label={`${score}%`}
              sublabel="readiness"
              color="#6366f1"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
              Current Status
            </h2>
            <p className={`font-display text-4xl md:text-5xl font-medium mb-4 ${readiness.color}`}>
              {readiness.emoji} {readiness.label}
            </p>
            <p className="text-xl text-muted-foreground font-light leading-relaxed mb-8 max-w-xl">
              You've made great progress! Keep completing roadmap nodes, projects, and resources to
              reach 100%.
            </p>
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
              onClick={() => navigate('/roadmap')}
            >
              Continue Learning
            </Button>
          </div>
        </motion.div>

        {/* Factor breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 pt-12 border-t border-border"
        >
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-8">
            Readiness Factors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {readinessFactors.map((factor) => (
              <div key={factor.label} className="border-l border-border pl-6">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-lg font-medium text-foreground flex items-center gap-3">
                    <span className="text-2xl">{factor.icon}</span> {factor.label}
                  </span>
                  <span className="font-display text-2xl text-foreground">{factor.value}%</span>
                </div>
                <Progress
                  value={factor.value}
                  size="md"
                  variant={factor.value > 70 ? 'green' : 'primary'}
                />
                <p className="text-sm text-muted-foreground font-light mt-3">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Next actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-12 border-t border-border"
        >
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-8 flex items-center gap-2">
            <Target size={16} className="text-primary" /> Next Actions to Boost Readiness
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.to)}
                className="w-full flex items-center justify-between py-5 px-6 rounded-none border border-border hover:bg-surface-2 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <ArrowRight size={16} className="text-primary flex-shrink-0" />
                  <span className="text-base text-foreground font-medium text-left">
                    {action.label}
                  </span>
                </div>
                <Badge variant="green" className="text-xs px-2 py-1">
                  {action.impact}
                </Badge>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
