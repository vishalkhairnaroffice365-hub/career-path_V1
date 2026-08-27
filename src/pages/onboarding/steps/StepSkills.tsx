import { useOnboarding } from '../../../context/OnboardingContext';
import { Check } from 'lucide-react';

const EXPERIENCE_LEVELS = [
  { id: 'complete-beginner', emoji: '🌱', label: 'Complete Beginner', description: 'I haven\'t written any code yet' },
  { id: 'some-experience', emoji: '🌿', label: 'Some Experience', description: 'I\'ve tried a tutorial or two' },
  { id: 'intermediate', emoji: '🌳', label: 'Intermediate', description: 'I can build small projects' },
  { id: 'advanced', emoji: '🎯', label: 'Advanced', description: 'I have professional experience' },
];

const SKILL_OPTIONS = [
  { id: 'html-css', label: 'HTML & CSS', emoji: '🌈' },
  { id: 'javascript', label: 'JavaScript', emoji: '🟨' },
  { id: 'python', label: 'Python', emoji: '🐍' },
  { id: 'react', label: 'React', emoji: '⚛️' },
  { id: 'java', label: 'Java', emoji: '☕' },
  { id: 'kotlin', label: 'Kotlin', emoji: '🎯' },
  { id: 'swift', label: 'Swift', emoji: '🐦' },
  { id: 'cpp', label: 'C / C++', emoji: '#️⃣' },
  { id: 'sql', label: 'SQL', emoji: '🗃️' },
  { id: 'git', label: 'Git', emoji: '🔀' },
  { id: 'linux', label: 'Linux', emoji: '🐧' },
  { id: 'docker', label: 'Docker', emoji: '🐳' },
  { id: 'design', label: 'UI Design', emoji: '🎨' },
  { id: 'data-analysis', label: 'Data Analysis', emoji: '📊' },
  { id: 'ml-basics', label: 'ML Basics', emoji: '🤖' },
  { id: 'none', label: 'None yet', emoji: '🌱' },
];

export function StepSkills() {
  const { state, updateData } = useOnboarding();
  const currentSkills = state.data.currentSkills || [];
  const experienceLevel = state.data.experienceLevel;

  const toggleSkill = (id: string) => {
    if (id === 'none') {
      updateData({ currentSkills: ['none'] });
      return;
    }
    const filtered = currentSkills.filter((s) => s !== 'none');
    if (filtered.includes(id)) {
      updateData({ currentSkills: filtered.filter((s) => s !== id) });
    } else {
      updateData({ currentSkills: [...filtered, id] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Experience level */}
      <div>
        <p className="text-sm font-medium text-foreground/80 mb-3">How would you describe your tech experience?</p>
        <div className="grid grid-cols-2 gap-3">
          {EXPERIENCE_LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => updateData({ experienceLevel: level.id as any })}
              className={`flex items-start gap-3 p-4 rounded-2xl text-left transition-all duration-200 border ${
                experienceLevel === level.id
                  ? 'bg-primary/10 border-primary/40'
                  : 'bg-surface-2 border-border hover:bg-surface-2 hover:border-border/80'
              }`}
            >
              <span className="text-2xl">{level.emoji}</span>
              <div>
                <p className={`text-sm font-semibold ${experienceLevel === level.id ? 'text-primary' : 'text-foreground'}`}>
                  {level.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{level.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Skills known */}
      <div>
        <p className="text-sm font-medium text-foreground/80 mb-3">Which skills do you already know? (Select all that apply)</p>
        <div className="grid grid-cols-4 gap-2">
          {SKILL_OPTIONS.map((skill) => {
            const isSelected = currentSkills.includes(skill.id);
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggleSkill(skill.id)}
                className={`relative flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 border ${
                  isSelected
                    ? 'bg-primary/10 border-primary/40 text-primary'
                    : 'bg-surface-2 border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Check size={9} className="text-white" />
                  </div>
                )}
                <span className="text-lg">{skill.emoji}</span>
                <span className="text-xs font-medium text-center leading-tight">{skill.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
