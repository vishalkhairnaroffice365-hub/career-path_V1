import { useOnboarding } from '../../../context/OnboardingContext';
import { Check } from 'lucide-react';

const INTEREST_OPTIONS = [
  { id: 'building-apps', label: 'Building Apps', emoji: '📱', description: 'Creating mobile & web applications' },
  { id: 'solving-problems', label: 'Problem Solving', emoji: '🧩', description: 'Puzzles, logic, and algorithms' },
  { id: 'art-design', label: 'Art & Design', emoji: '🎨', description: 'Visual aesthetics and creativity' },
  { id: 'data-numbers', label: 'Data & Numbers', emoji: '📊', description: 'Statistics, patterns, and analysis' },
  { id: 'games', label: 'Video Games', emoji: '🎮', description: 'Playing and creating game worlds' },
  { id: 'security', label: 'Security & Hacking', emoji: '🛡️', description: 'Protecting systems and ethical hacking' },
  { id: 'ai-robotics', label: 'AI & Robotics', emoji: '🤖', description: 'Machine intelligence and automation' },
  { id: 'teaching', label: 'Teaching & Mentoring', emoji: '📚', description: 'Sharing knowledge with others' },
  { id: 'entrepreneurship', label: 'Starting Something', emoji: '🚀', description: 'Building and launching products' },
  { id: 'science', label: 'Science & Research', emoji: '🔬', description: 'Discovery and experimentation' },
  { id: 'music', label: 'Music & Audio', emoji: '🎵', description: 'Sound, music production, audio tech' },
  { id: 'writing', label: 'Writing & Content', emoji: '✍️', description: 'Communication and storytelling' },
];

export function StepInterests() {
  const { state, updateData } = useOnboarding();
  const selected = state.data.interests || [];

  const toggle = (id: string) => {
    const current = state.data.interests || [];
    if (current.includes(id)) {
      updateData({ interests: current.filter((i) => i !== id) });
    } else if (current.length < 6) {
      updateData({ interests: [...current, id] });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select up to <span className="text-primary font-semibold">6 interests</span> that genuinely excite you.
        <span className="ml-2 text-xs">({selected.length}/6 selected)</span>
      </p>

      <div className="grid grid-cols-2 gap-3">
        {INTEREST_OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const isDisabled = !isSelected && selected.length >= 6;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              disabled={isDisabled}
              className={`relative flex items-start gap-3 p-5 rounded-3xl text-left transition-all duration-300 border ${
                isSelected
                  ? 'bg-surface border-primary text-foreground shadow-editorial-lg -translate-y-1'
                  : isDisabled
                  ? 'bg-transparent border-transparent opacity-40 cursor-not-allowed'
                  : 'bg-surface border-border/50 text-muted-foreground hover:bg-surface hover:text-foreground hover:border-border hover:shadow-editorial'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check size={11} className="text-white" />
                </div>
              )}
              <span className="text-2xl flex-shrink-0 mt-0.5">{opt.emoji}</span>
              <div>
                <p className={`text-sm font-semibold ${isSelected ? 'text-primary' : ''}`}>{opt.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{opt.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
