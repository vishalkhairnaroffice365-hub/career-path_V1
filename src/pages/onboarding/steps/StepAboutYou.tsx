import { useOnboarding } from '../../../context/OnboardingContext';
import { Input } from '../../../components/ui/Input';

const AGE_RANGES = ['Under 18', '18–22', '23–27', '28–35', '36–45', '45+'];
const EDUCATION_LEVELS = ['High School', 'Some College', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Self-taught / Bootcamp'];
const CURRENT_ROLES = ['Student', 'Fresh Graduate', 'Working Professional', 'Career Changer', 'Entrepreneur', 'Other'];

export function StepAboutYou() {
  const { state, updateData } = useOnboarding();
  const data = state.data;

  return (
    <div className="space-y-6">
      <Input
        label="Your Name"
        placeholder="What's your name?"
        value={data.name || ''}
        onChange={(e) => updateData({ name: e.target.value })}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">Age Range</label>
        <div className="grid grid-cols-3 gap-2">
          {AGE_RANGES.map((age) => (
            <button
              key={age}
              type="button"
              onClick={() => updateData({ age })}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                data.age === age
                  ? 'bg-primary/15 border-primary/40 text-primary'
                  : 'bg-surface-2 border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground'
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">Current Situation</label>
        <div className="grid grid-cols-2 gap-2">
          {CURRENT_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => updateData({ currentRole: role })}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                data.currentRole === role
                  ? 'bg-primary/15 border-primary/40 text-primary'
                  : 'bg-surface-2 border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">Education Level</label>
        <div className="grid grid-cols-2 gap-2">
          {EDUCATION_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => updateData({ educationLevel: level })}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                data.educationLevel === level
                  ? 'bg-primary/15 border-primary/40 text-primary'
                  : 'bg-surface-2 border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
