import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Edit2 } from 'lucide-react';
import { useOnboarding } from '../context/OnboardingContext';
import { useCareer } from '../context/CareerContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08 },
  }),
};

const INTEREST_LABELS: Record<string, string> = {
  'building-apps': 'Building Apps',
  'solving-problems': 'Problem Solving',
  'art-design': 'Art & Design',
  'data-numbers': 'Data & Numbers',
  'games': 'Video Games',
  'security': 'Security',
  'ai-robotics': 'AI & Robotics',
  'teaching': 'Teaching',
  'entrepreneurship': 'Entrepreneurship',
  'science': 'Science',
  'music': 'Music',
  'writing': 'Writing',
};

const STRENGTH_LABELS: Record<string, string> = {
  'logical-thinking': 'Logical Thinking',
  'creativity': 'Creativity',
  'attention-to-detail': 'Detail Oriented',
  'communication': 'Communication',
  'persistence': 'Persistence',
  'fast-learner': 'Fast Learner',
  'teamwork': 'Teamwork',
  'leadership': 'Leadership',
  'curiosity': 'Curiosity',
  'organization': 'Organization',
  'empathy': 'Empathy',
  'independence': 'Independence',
};

export default function ProfileReflectionPage() {
  const navigate = useNavigate();
  const { state: onboarding } = useOnboarding();
  const { user } = useCareer();
  const data = onboarding.data;

  const handleContinue = () => {
    navigate('/analysis');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle organic background */}
      <div
        className="fixed inset-0 pointer-events-none bg-surface-2"
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center mb-10"
        >
          <span className="text-6xl block mb-4">🌟</span>
          <h1 className="font-display text-display-sm font-bold text-foreground mb-3">
            Here's what we know about you
          </h1>
          <p className="text-muted-foreground text-lg">
            Take a moment to review your profile before we build your personalized Career Sky.
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* Identity */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-primary">About You</h2>
              <button
                onClick={() => navigate('/onboarding')}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
              >
                <Edit2 size={12} />
                Edit Profile
              </button>
            </div>
            <div className="editorial-divider my-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Name', value: data.name || user.name || 'You' },
                { label: 'Age', value: data.age || '—' },
                { label: 'Current Role', value: data.currentRole || '—' },
                { label: 'Education', value: data.educationLevel || '—' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">{item.label}</p>
                  <p className="text-base font-medium text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Interests */}
          {(data.interests?.length ?? 0) > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
              <h2 className="font-display text-lg font-semibold text-primary mb-4">Interests</h2>
              <div className="flex flex-wrap gap-3">
                {(data.interests || []).map((id) => (
                  <span key={id} className="px-4 py-2 rounded-full border border-border bg-surface text-sm text-foreground shadow-sm">
                    {INTEREST_LABELS[id] || id}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Strengths */}
          {(data.strengths?.length ?? 0) > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
              <h2 className="font-display text-lg font-semibold text-primary mb-4">Strengths</h2>
              <div className="flex flex-wrap gap-3">
                {(data.strengths || []).map((id) => (
                  <span key={id} className="px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary shadow-sm">
                    {STRENGTH_LABELS[id] || id}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Goals */}
          {data.primaryGoal && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
              <h2 className="font-display text-lg font-semibold text-primary mb-4">Career Vision</h2>
              <div className="editorial-surface p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: 'Primary Goal', value: data.primaryGoal?.replace(/-/g, ' ') },
                    { label: 'Timeline', value: data.timeHorizon?.replace(/-/g, ' ') || '—' },
                    { label: 'Salary Target', value: data.salaryExpectation?.replace(/-/g, ' ') || '—' },
                    { label: '5-Year Vision', value: data.fiveYearVision?.replace(/-/g, ' ') || '—' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">{item.label}</p>
                      <p className="text-lg font-medium text-foreground capitalize leading-snug">{item.value || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="mt-10 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Looks good? Let's discover your career universe.
          </p>
          <Button
            variant="gradient"
            size="xl"
            rightIcon={<ArrowRight size={20} />}
            onClick={handleContinue}
          >
            Analyze My Profile
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
