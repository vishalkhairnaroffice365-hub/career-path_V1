import { useOnboarding } from '../../../context/OnboardingContext';

const ENVIRONMENTS = [
  { id: 'remote', label: 'Fully Remote', emoji: '🌍', description: 'Work from anywhere in the world' },
  { id: 'hybrid', label: 'Hybrid', emoji: '🏢', description: 'Best of both worlds' },
  { id: 'office', label: 'In-Office', emoji: '🏙️', description: 'Energy and collaboration of an office' },
  { id: 'flexible', label: 'Flexible / Freelance', emoji: '🦅', description: 'My own schedule, my own terms' },
];

const COLLABORATION_STYLES = [
  { id: 'solo', label: 'Solo', emoji: '🧘', description: 'Deep focus, own terms' },
  { id: 'small-team', label: 'Small Team', emoji: '👥', description: '3–8 people, tight-knit' },
  { id: 'large-team', label: 'Large Team', emoji: '🌐', description: 'Complex org, diverse voices' },
  { id: 'client-facing', label: 'Client Facing', emoji: '🤝', description: 'Working directly with clients' },
];

const LEARNING_STYLES = [
  { id: 'videos', label: 'Video Courses', emoji: '🎬' },
  { id: 'reading', label: 'Books & Articles', emoji: '📚' },
  { id: 'projects', label: 'Building Projects', emoji: '🔨' },
  { id: 'interactive', label: 'Interactive Exercises', emoji: '🎮' },
  { id: 'mentorship', label: 'Mentorship & Coaching', emoji: '🎓' },
  { id: 'community', label: 'Community Learning', emoji: '🤝' },
];

export function StepWorkStyle() {
  const { state, updateData } = useOnboarding();
  const data = state.data;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-foreground/80 mb-3">Where do you work best?</p>
        <div className="grid grid-cols-2 gap-3">
          {ENVIRONMENTS.map((env) => (
            <button
              key={env.id}
              type="button"
              onClick={() => updateData({ preferredEnvironment: env.id })}
              className={`flex items-start gap-3 p-4 rounded-2xl text-left transition-all duration-200 border ${
                data.preferredEnvironment === env.id
                  ? 'bg-cyan-500/20 border-cyan-500/50'
                  : 'bg-surface-2 border-border hover:bg-surface-2 hover:border-border/80'
              }`}
            >
              <span className="text-xl">{env.emoji}</span>
              <div>
                <p className={`text-sm font-semibold ${data.preferredEnvironment === env.id ? 'text-cyan-300' : 'text-foreground'}`}>
                  {env.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{env.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground/80 mb-3">How do you prefer to collaborate?</p>
        <div className="grid grid-cols-2 gap-3">
          {COLLABORATION_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => updateData({ collaboration: style.id })}
              className={`flex items-start gap-3 p-4 rounded-2xl text-left transition-all duration-200 border ${
                data.collaboration === style.id
                  ? 'bg-cyan-500/20 border-cyan-500/50'
                  : 'bg-surface-2 border-border hover:bg-surface-2 hover:border-border/80'
              }`}
            >
              <span className="text-xl">{style.emoji}</span>
              <div>
                <p className={`text-sm font-semibold ${data.collaboration === style.id ? 'text-cyan-300' : 'text-foreground'}`}>
                  {style.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{style.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground/80 mb-3">How do you learn best?</p>
        <div className="grid grid-cols-3 gap-2">
          {LEARNING_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => updateData({ learningStyle: style.id })}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 border ${
                data.learningStyle === style.id
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                  : 'bg-surface-2 border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground'
              }`}
            >
              <span className="text-xl">{style.emoji}</span>
              <span className="text-xs font-medium text-center leading-tight">{style.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
