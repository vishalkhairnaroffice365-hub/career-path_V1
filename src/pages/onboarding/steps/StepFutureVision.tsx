import { useOnboarding } from '../../../context/OnboardingContext';
import { Check } from 'lucide-react';

const FIVE_YEAR_VISIONS = [
  { id: 'senior-engineer', label: 'Senior Engineer', emoji: '⚙️', description: 'Deep technical mastery at a great company' },
  { id: 'tech-lead', label: 'Tech Lead / Architect', emoji: '🏗️', description: 'Leading technical decisions for a team' },
  { id: 'founder', label: 'Founder / CTO', emoji: '🚀', description: 'Running my own tech company' },
  { id: 'researcher', label: 'Researcher / Scientist', emoji: '🔬', description: 'Pushing boundaries of knowledge' },
  { id: 'freelancer', label: 'Independent Freelancer', emoji: '🌍', description: 'Freedom to work on what I choose' },
  { id: 'product-leader', label: 'Product Leader', emoji: '🎯', description: 'Shaping products used by millions' },
];

const IMPACT_AREAS = [
  { id: 'healthcare', label: 'Healthcare', emoji: '🏥' },
  { id: 'education', label: 'Education', emoji: '📚' },
  { id: 'climate', label: 'Climate & Sustainability', emoji: '🌱' },
  { id: 'entertainment', label: 'Entertainment & Games', emoji: '🎮' },
  { id: 'finance', label: 'Finance & FinTech', emoji: '💰' },
  { id: 'security', label: 'Security & Privacy', emoji: '🛡️' },
  { id: 'social', label: 'Social Impact', emoji: '❤️' },
  { id: 'ai-future', label: 'AI & Future of Work', emoji: '🤖' },
];

const MOTIVATIONS = [
  { id: 'impact', label: 'Making Impact', emoji: '💥' },
  { id: 'money', label: 'Financial Freedom', emoji: '💰' },
  { id: 'creativity', label: 'Creative Expression', emoji: '🎨' },
  { id: 'challenge', label: 'Intellectual Challenge', emoji: '🧩' },
  { id: 'recognition', label: 'Recognition', emoji: '🏆' },
  { id: 'stability', label: 'Stability & Security', emoji: '⚓' },
];

export function StepFutureVision() {
  const { state, updateData } = useOnboarding();
  const data = state.data;
  const motivations = data.motivations || [];

  const toggleMotivation = (id: string) => {
    if (motivations.includes(id)) {
      updateData({ motivations: motivations.filter((m) => m !== id) });
    } else if (motivations.length < 3) {
      updateData({ motivations: [...motivations, id] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-foreground/80 mb-3">Where do you see yourself in 5 years?</p>
        <div className="grid grid-cols-2 gap-3">
          {FIVE_YEAR_VISIONS.map((vision) => (
            <button
              key={vision.id}
              type="button"
              onClick={() => updateData({ fiveYearVision: vision.id })}
              className={`flex items-start gap-3 p-4 rounded-2xl text-left transition-all duration-200 border ${
                data.fiveYearVision === vision.id
                  ? 'bg-violet-500/20 border-violet-500/50'
                  : 'bg-surface-2 border-border hover:bg-surface-2 hover:border-border/80'
              }`}
            >
              <span className="text-xl">{vision.emoji}</span>
              <div>
                <p className={`text-sm font-semibold ${data.fiveYearVision === vision.id ? 'text-violet-300' : 'text-foreground'}`}>
                  {vision.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{vision.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground/80 mb-3">Which industry do you want to impact?</p>
        <div className="grid grid-cols-4 gap-2">
          {IMPACT_AREAS.map((area) => (
            <button
              key={area.id}
              type="button"
              onClick={() => updateData({ impactArea: area.id })}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 border ${
                data.impactArea === area.id
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                  : 'bg-surface-2 border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground'
              }`}
            >
              <span className="text-xl">{area.emoji}</span>
              <span className="text-xs font-medium text-center leading-tight">{area.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground/80 mb-1">
          What motivates you most? <span className="text-xs text-muted-foreground">({motivations.length}/3)</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          {MOTIVATIONS.map((m) => {
            const isSelected = motivations.includes(m.id);
            const isDisabled = !isSelected && motivations.length >= 3;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleMotivation(m.id)}
                disabled={isDisabled}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 border ${
                  isSelected
                    ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                    : isDisabled
                    ? 'bg-white/3 border-white/5 text-muted-foreground/50 cursor-not-allowed'
                    : 'bg-surface-2 border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                    <Check size={9} className="text-white" />
                  </div>
                )}
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-xs font-semibold text-center">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
