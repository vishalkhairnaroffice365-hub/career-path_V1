export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'milestone' | 'skill' | 'streak' | 'social' | 'special';
}

export const SYSTEM_ACHIEVEMENTS: AchievementDefinition[] = [
  { id: 'first-step', title: 'First Step', description: 'Completed your first learning node', emoji: '👣', category: 'milestone' },
  { id: 'week-streak', title: 'Week Warrior', description: 'Maintained a 7-day learning streak', emoji: '🔥', category: 'streak' },
  { id: 'first-project', title: 'Builder', description: 'Completed your first project', emoji: '🏗️', category: 'skill' },
  { id: 'sky-explorer', title: 'Sky Explorer', description: 'Explored career domains in Career Sky', emoji: '☁️', category: 'milestone' },
  { id: 'career-chosen', title: 'Decided', description: 'Selected your career path', emoji: '🎯', category: 'milestone' },
  { id: 'month-streak', title: 'Dedicated', description: 'Maintained a 30-day learning streak', emoji: '💎', category: 'streak' },
  { id: 'social-butterfly', title: 'Connected', description: 'Joined community discussions', emoji: '🦋', category: 'social' },
  { id: 'first-phase', title: 'Phase Complete', description: 'Finished your first roadmap phase', emoji: '🏁', category: 'milestone' },
  { id: 'resource-reader', title: 'Curious Mind', description: 'Completed 5 learning resources', emoji: '📚', category: 'skill' },
  { id: 'portfolio-ready', title: 'Portfolio Ready', description: 'Completed 3 portfolio-worthy projects', emoji: '✨', category: 'special' },
];
