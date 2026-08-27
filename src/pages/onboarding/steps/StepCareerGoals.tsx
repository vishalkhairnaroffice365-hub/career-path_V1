import { useOnboarding } from '../../../context/OnboardingContext';

const PRIMARY_GOALS = [
  { id: 'land-first-job', label: 'Land My First Tech Job', emoji: '🎯', description: 'Break into the industry' },
  { id: 'career-switch', label: 'Switch Careers', emoji: '🔄', description: 'Transition from another field' },
  { id: 'level-up', label: 'Level Up My Skills', emoji: '⬆️', description: 'Advance in my current tech role' },
  { id: 'freelance', label: 'Freelance / Consulting', emoji: '💼', description: 'Work for myself with clients' },
  { id: 'startup', label: 'Build My Own Product', emoji: '🚀', description: 'Launch a startup or side project' },
  { id: 'explore', label: 'Just Exploring', emoji: '🗺️', description: 'Curious about possibilities' },
];

const TIME_HORIZONS = [
  { id: '3months', label: '3 Months', emoji: '⚡', description: 'Intense sprint' },
  { id: '6months', label: '6 Months', emoji: '🎯', description: 'Dedicated focus' },
  { id: '1year', label: '1 Year', emoji: '📅', description: 'Steady progress' },
  { id: '2years', label: '2+ Years', emoji: '🌱', description: 'Long-term growth' },
];

const SALARY_RANGES = [
  { id: 'under-50k', label: 'Under $50K', description: 'Entry level' },
  { id: '50k-80k', label: '$50K – $80K', description: 'Junior' },
  { id: '80k-120k', label: '$80K – $120K', description: 'Mid-level' },
  { id: '120k-150k', label: '$120K – $150K', description: 'Senior' },
  { id: '150k+', label: '$150K+', description: 'Principal / Staff' },
  { id: 'not-sure', label: 'Not Sure Yet', description: 'I\'ll figure it out' },
];

export function StepCareerGoals() {
  const { state, updateData } = useOnboarding();
  const data = state.data;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-foreground/80 mb-3">What is your primary goal?</p>
        <div className="grid grid-cols-2 gap-3">
          {PRIMARY_GOALS.map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => updateData({ primaryGoal: goal.id })}
              className={`flex items-start gap-3 p-4 rounded-2xl text-left transition-all duration-200 border ${
                data.primaryGoal === goal.id
                  ? 'bg-orange-500/20 border-orange-500/50'
                  : 'bg-surface-2 border-border hover:bg-surface-2 hover:border-border/80'
              }`}
            >
              <span className="text-xl">{goal.emoji}</span>
              <div>
                <p className={`text-sm font-semibold ${data.primaryGoal === goal.id ? 'text-orange-300' : 'text-foreground'}`}>
                  {goal.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground/80 mb-3">How much time do you have?</p>
        <div className="grid grid-cols-4 gap-2">
          {TIME_HORIZONS.map((horizon) => (
            <button
              key={horizon.id}
              type="button"
              onClick={() => updateData({ timeHorizon: horizon.id })}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 border ${
                data.timeHorizon === horizon.id
                  ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                  : 'bg-surface-2 border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground'
              }`}
            >
              <span className="text-xl">{horizon.emoji}</span>
              <span className="text-sm font-semibold">{horizon.label}</span>
              <span className="text-xs text-muted-foreground">{horizon.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground/80 mb-3">Salary expectation?</p>
        <div className="grid grid-cols-3 gap-2">
          {SALARY_RANGES.map((range) => (
            <button
              key={range.id}
              type="button"
              onClick={() => updateData({ salaryExpectation: range.id })}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 border ${
                data.salaryExpectation === range.id
                  ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                  : 'bg-surface-2 border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground'
              }`}
            >
              <span className="text-sm font-bold">{range.label}</span>
              <span className="text-xs text-muted-foreground">{range.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
