import { useOnboarding } from '../../../context/OnboardingContext';
import { Check } from 'lucide-react';

const STRENGTH_OPTIONS = [
  { id: 'logical-thinking', label: 'Logical Thinking', emoji: '🧠', description: 'Breaking down complex problems' },
  { id: 'creativity', label: 'Creativity', emoji: '🎨', description: 'Coming up with original ideas' },
  { id: 'attention-to-detail', label: 'Attention to Detail', emoji: '🔍', description: 'Noticing the small things' },
  { id: 'communication', label: 'Communication', emoji: '💬', description: 'Explaining ideas clearly' },
  { id: 'persistence', label: 'Persistence', emoji: '🏔️', description: 'Sticking with hard problems' },
  { id: 'fast-learner', label: 'Fast Learner', emoji: '⚡', description: 'Picking up new concepts quickly' },
  { id: 'teamwork', label: 'Teamwork', emoji: '🤝', description: 'Collaborating and supporting others' },
  { id: 'leadership', label: 'Leadership', emoji: '👑', description: 'Guiding and inspiring others' },
  { id: 'curiosity', label: 'Curiosity', emoji: '🔬', description: 'Always asking "how" and "why"' },
  { id: 'organization', label: 'Organization', emoji: '📋', description: 'Keeping things structured' },
  { id: 'empathy', label: 'Empathy', emoji: '❤️', description: 'Understanding people\'s feelings' },
  { id: 'independence', label: 'Independence', emoji: '🦅', description: 'Working well autonomously' },
];

export function StepStrengths() {
  const { state, updateData } = useOnboarding();
  const selected = state.data.strengths || [];

  const toggle = (id: string) => {
    const current = state.data.strengths || [];
    if (current.includes(id)) {
      updateData({ strengths: current.filter((s) => s !== id) });
    } else if (current.length < 5) {
      updateData({ strengths: [...current, id] });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Pick your top <span className="text-primary font-semibold">3–5 strengths</span> — the ones that describe you naturally.
        <span className="ml-2 text-xs">({selected.length}/5 selected)</span>
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {STRENGTH_OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const isDisabled = !isSelected && selected.length >= 5;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              disabled={isDisabled}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 border ${
                isSelected
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-200'
                  : isDisabled
                  ? 'bg-white/3 border-white/5 text-muted-foreground/50 cursor-not-allowed'
                  : 'bg-surface-2 border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground hover:border-border/80'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                  <Check size={11} className="text-white" />
                </div>
              )}
              <span className="text-3xl">{opt.emoji}</span>
              <p className={`text-sm font-semibold text-center ${isSelected ? 'text-violet-300' : ''}`}>{opt.label}</p>
              <p className="text-xs text-muted-foreground text-center leading-relaxed hidden sm:block">{opt.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
