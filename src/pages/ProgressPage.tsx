import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Progress, CircularProgress } from '../components/ui/Progress';
import { useCareer } from '../context/CareerContext';
import { careers } from '../data/careers';

export default function ProgressPage() {
  const { user, selectedCareer } = useCareer();
  const { progress, stats } = user;
  const career = selectedCareer || careers[0];

  const weeklyPercent = Math.round((progress.hoursThisWeek / progress.weeklyGoalHours) * 100);

  const activityData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.5 },
    { day: 'Wed', hours: 3 },
    { day: 'Thu', hours: 0.5 },
    { day: 'Fri', hours: 2 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 2 },
  ];
  const maxHours = Math.max(...activityData.map(d => d.hours), 1);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 border-b border-border pb-8">
          <h1 className="font-display text-5xl md:text-6xl font-medium text-foreground tracking-tight mb-4">Progress</h1>
          <p className="text-xl text-muted-foreground font-light">Your learning journey at a glance.</p>
        </motion.div>

        {/* Top stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { label: 'Day Streak', value: progress.streak, suffix: '🔥', color: 'text-accent' },
            { label: 'Hours Learned', value: stats.totalHoursLearned, suffix: 'h', color: 'text-info' },
            { label: 'Skills Acquired', value: stats.skillsAcquired, suffix: '⚡', color: 'text-yellow-400' },
            { label: 'Projects Done', value: stats.projectsCompleted, suffix: '🚀', color: 'text-success' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="border-l border-border pl-6"
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-semibold">{stat.label}</p>
              <p className={`font-display text-4xl font-medium ${stat.color} flex items-end gap-1`}>
                {stat.value}<span className="text-xl mb-1 text-muted-foreground">{stat.suffix}</span>
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16 border-t border-border pt-12">
          {/* Career Readiness */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center relative"
          >
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold absolute top-0 left-0">Career Readiness</h2>
            <div className="mt-8">
              <CircularProgress
                value={stats.careerReadinessScore}
                size={200}
                strokeWidth={8}
                label={`${stats.careerReadinessScore}%`}
                sublabel="readiness"
                color="#6366f1"
              />
            </div>
            <p className="text-base text-muted-foreground font-light mt-8 text-center max-w-xs">
              Keep learning to reach 100% readiness for <span className="text-foreground font-medium">{career.title}</span>
            </p>
          </motion.div>

          {/* Weekly goal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Weekly Goal</h2>
              <span className="flex items-center gap-1.5 text-accent text-xs font-bold uppercase tracking-wider">
                <Flame size={14} /> {progress.streak} day streak
              </span>
            </div>
            
            <div className="mb-10">
              <div className="flex justify-between text-base mb-3">
                <span className="text-muted-foreground font-light">{progress.hoursThisWeek}h / {progress.weeklyGoalHours}h this week</span>
                <span className="font-medium text-foreground">{weeklyPercent}%</span>
              </div>
              <Progress value={weeklyPercent} variant="green" size="md" />
            </div>

            {/* Daily chart */}
            <div className="flex items-end gap-3 h-32 mt-auto border-b border-border pb-1">
              {activityData.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    className="w-full bg-surface-2 group-hover:bg-primary/50 transition-all duration-300 relative"
                    style={{ height: `${(day.hours / maxHours) * 100}px` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs font-semibold text-primary transition-opacity">
                      {day.hours}h
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{day.day}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Overall roadmap progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border-t border-border pt-12"
        >
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-8">Roadmap Progress</h2>
          <div className="space-y-6 max-w-2xl">
            {[
              { label: 'Foundation', value: 100, phase: 1 },
              { label: 'Core Skills', value: 45, phase: 2 },
              { label: 'Advanced', value: 0, phase: 3 },
              { label: 'Launch Ready', value: 0, phase: 4 },
            ].map((phase) => (
              <div key={phase.label}>
                <div className="flex justify-between text-base mb-2 font-light">
                  <span className="text-muted-foreground">Phase {phase.phase} <span className="mx-2 text-border">/</span> {phase.label}</span>
                  <span className="font-medium text-foreground">{phase.value}%</span>
                </div>
                <Progress value={phase.value} variant={phase.value === 100 ? 'green' : 'primary'} size="sm" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
