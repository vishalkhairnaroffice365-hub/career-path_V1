import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Progress } from '../components/ui/Progress';
import { useCareer } from '../context/CareerContext';
import { courses } from '../data/courses';
import { assessments } from '../data/assessments';
import { codingChallenges } from '../data/codingChallenges';
import { practicalTasks } from '../data/tasks';
import { computeProgressBreakdown } from '../utils/progressCalculator';

export default function ProgressPage() {
  const { user, learning } = useCareer();
  const { stats, progress } = user;

  // Calculate real progress from learning state
  const breakdown = useMemo(() => {
    const careerCourses = courses.filter(c => c.domain !== 'default');
    const totalCourses = careerCourses.length;
    const completedCourses = Object.values(learning.courseProgress).filter(cp => cp.completed).length;

    const totalAssessments = assessments.length;
    const passedAssessments = Object.values(learning.assessmentScores).filter(s => s.passed).length;

    const totalChallenges = codingChallenges.length;
    const passedChallenges = Object.entries(learning.codingScores).filter(([, score]) => score >= 70).length;

    const totalProjects = practicalTasks.length;
    const completedProjects = Object.values(learning.taskSubmissions)
      .filter(t => t.status === 'submitted' || t.status === 'passed').length;

    return computeProgressBreakdown({
      coursesCompleted: completedCourses,
      totalCourses,
      assessmentsPassed: passedAssessments,
      totalAssessments,
      challengesCompleted: passedChallenges,
      totalChallenges,
      projectsCompleted: completedProjects,
      totalProjects,
    });
  }, [learning]);

  const getCurrentStage = () => {
    if (!learning.roadmapStarted) return 'Not Started';
    
    // Check states in reverse to find the most advanced stage started
    if (Object.keys(learning.taskSubmissions).length > 0) return 'Practical Project';
    if (Object.keys(learning.codingScores).length > 0) return 'Coding Challenge';
    if (Object.keys(learning.assessmentScores).length > 0) return 'Assessment';
    if (Object.keys(learning.courseProgress).length > 0) return 'Course';
    
    return 'Roadmap Started';
  };

  const recentActivities = useMemo(() => {
    const activities: { text: string; icon: string; time: number }[] = [];
    
    Object.values(learning.courseProgress).forEach(c => {
      if (c.completed && c.completedAt) activities.push({ text: 'Course completed', icon: '✓', time: new Date(c.completedAt).getTime() });
      else if (c.startedAt) activities.push({ text: 'Course in progress', icon: '→', time: new Date(c.startedAt).getTime() });
    });
    
    Object.values(learning.assessmentScores).forEach(a => {
      if (a.passed) activities.push({ text: 'Assessment passed', icon: '✓', time: new Date(a.lastAttemptAt).getTime() });
      else activities.push({ text: 'Assessment attempted', icon: '→', time: new Date(a.lastAttemptAt).getTime() });
    });
    
    // codingScores doesn't have timestamp, we'll give it a generic high timestamp so it shows up recently if it exists
    if (Object.keys(learning.codingScores).length > 0) {
       const passed = Object.values(learning.codingScores).some(s => s >= 70);
       activities.push({ text: passed ? 'Coding challenge completed' : 'Coding challenge in progress', icon: passed ? '✓' : '→', time: Date.now() - 1000 });
    }
    
    Object.values(learning.taskSubmissions).forEach(t => {
      if (t.submittedAt) activities.push({ text: 'Project submitted', icon: '✓', time: new Date(t.submittedAt).getTime() });
      else if (t.taskStartTime) activities.push({ text: 'Project in progress', icon: '→', time: t.taskStartTime });
    });
    
    return activities.sort((a, b) => b.time - a.time).slice(0, 5);
  }, [learning]);

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

        {/* ── Overall Progress & Category Breakdown ────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 border-t border-border pt-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp size={20} className="text-primary" />
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Learning Progress Breakdown</h2>
          </div>

          {/* Overall weighted progress */}
          <div className="flex flex-col items-center justify-center mb-16">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-6">Your Career Progress</h2>
            <div className="text-7xl font-display font-medium text-primary mb-6">
              {breakdown.overall}%
            </div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Overall Progress</p>
          </div>
          
          <div className="mb-12">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-8 border-b border-border pb-4">Category Breakdown</h2>
            <div className="space-y-6">
              {[
                { label: 'Course', val: breakdown.course, color: 'bg-info' },
                { label: 'Assessment', val: breakdown.assessment, color: 'bg-warning' },
                { label: 'Coding', val: breakdown.coding, color: 'bg-accent' },
                { label: 'Project', val: breakdown.project, color: 'bg-success' }
              ].map(cat => (
                <div key={cat.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-foreground w-24">{cat.label}</span>
                    <span className="font-semibold text-foreground">{cat.val}%</span>
                  </div>
                  <Progress value={cat.val} variant={cat.label === 'Course' ? 'primary' : cat.label === 'Project' ? 'green' : 'orange'} size="md" />
                </div>
              ))}
            </div>
          </div>

        </motion.div>

        {/* Current Learning Stage */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-8 border-b border-border pb-4">Current Learning Stage</h2>
          <div className="text-2xl font-display font-medium text-foreground pl-4 border-l-2 border-primary">
            {getCurrentStage()}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-12"
        >
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-8 border-b border-border pb-4">Recent Activity</h2>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-center gap-3 text-base">
                  <span className={act.icon === '✓' ? 'text-success' : 'text-primary'}>{act.icon}</span>
                  <span className="text-foreground">{act.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              <p className="mb-2">No recent activity yet.</p>
              <p>Start your roadmap to begin tracking your progress.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
