import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle, Circle, Globe, Zap } from 'lucide-react';
import { getTaskByNodeId } from '../data/tasks';
import { useCareer } from '../context/CareerContext';
import { TaskTimer } from '../components/assessment/TestTimer';
import { GitHubSubmission } from '../components/tasks/GitHubSubmission';
import type { TaskSubmission } from '../context/CareerContext';

import { taskApi } from '../services/task.api';

export default function TaskPage() {
  const { nodeId } = useParams<{ nodeId: string }>();
  const navigate = useNavigate();
  const { learning, updateTaskSubmission } = useCareer();

  const task = useMemo(() => (nodeId ? getTaskByNodeId(nodeId) : undefined), [nodeId]);

  if (!task || !nodeId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔨</div>
          <h2 className="font-display text-2xl font-medium text-foreground mb-2">Content Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find this learning content.</p>
          <button onClick={() => navigate('/roadmap')} className="text-primary font-medium hover:underline">
            ← Back to Roadmap
          </button>
        </div>
      </div>
    );
  }

  const existing: TaskSubmission = learning.taskSubmissions[nodeId] ?? {
    nodeId,
    status: 'not-started',
  };

  const hasStarted = existing.taskStartTime !== undefined;
  const deadline = existing.taskDeadline;

  const handleStartTask = async () => {
    const startTime = Date.now();
    const deadlineTime = startTime + task.durationHours * 60 * 60 * 1000;
    updateTaskSubmission({
      ...existing,
      nodeId,
      status: 'in-progress',
      taskStartTime: startTime,
      taskDeadline: deadlineTime,
    });

    try {
      await taskApi.startTask(nodeId);
    } catch (err) {
      console.warn('Backend task start sync failed:', err);
    }
  };

  const handleSubmit = async ({ githubUrl, liveUrl }: { githubUrl: string; liveUrl?: string }) => {
    updateTaskSubmission({
      ...existing,
      nodeId,
      status: 'submitted',
      githubUrl,
      liveUrl,
      submittedAt: new Date().toISOString(),
    });

    try {
      await taskApi.submitTask(nodeId, { githubUrl, liveUrl });
    } catch (err) {
      console.warn('Backend task submission sync failed:', err);
    }
  };

  const difficultyColor: Record<string, string> = {
    beginner: 'text-success',
    intermediate: 'text-warning',
    advanced: 'text-danger',
  };

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-24">
      {/* Sticky top bar with timer */}
      <div className="fixed top-16 md:top-20 left-0 right-0 z-30 bg-background/90 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/roadmap')}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} /> Roadmap
            </button>
            <span className="text-border">·</span>
            <span className="text-xs font-semibold text-foreground">{task.title}</span>
          </div>
          {hasStarted && deadline && (
            <TaskTimer deadline={deadline} />
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-14">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`text-xs uppercase tracking-widest font-bold ${difficultyColor[task.difficulty]}`}>
              {task.difficulty}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={12} /> {task.durationHours}h deadline
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {task.technologies.slice(0, 3).join(', ')}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground tracking-tight mb-3">{task.title}</h1>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">{task.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left — Task details */}
          <div className="md:col-span-2 space-y-8">
            {/* Start Task CTA */}
            {!hasStarted && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-2xl border border-dashed border-primary/40 bg-primary/5 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Zap size={26} className="text-primary" />
                </div>
                <h3 className="font-display text-xl font-medium text-foreground mb-2">Ready to start?</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Starting the task will begin a <strong>{task.durationHours}-hour</strong> countdown timer. Make sure you're ready.
                </p>
                <motion.button
                  onClick={handleStartTask}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-2xl font-semibold text-sm hover:opacity-90 transition-all shadow-editorial"
                >
                  <Zap size={16} /> Start Task
                </motion.button>
              </motion.div>
            )}

            {/* Requirements */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h3 className="font-display text-xl font-medium text-foreground mb-4 pb-3 border-b border-border">Requirements</h3>
              <div className="space-y-3">
                {task.requirements.map((req) => (
                  <div key={req.id} className="flex items-start gap-3">
                    {req.isRequired ? (
                      <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <span className="text-sm text-foreground">{req.text}</span>
                      {!req.isRequired && <span className="ml-2 text-xs text-muted-foreground">(optional)</span>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Deliverables */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="font-display text-xl font-medium text-foreground mb-4 pb-3 border-b border-border">Deliverables</h3>
              <div className="space-y-2">
                {task.deliverables.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-primary">→</span> {d}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Evaluation criteria */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <h3 className="font-display text-xl font-medium text-foreground mb-4 pb-3 border-b border-border">Evaluation Criteria</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {task.evaluationCriteria.map((criterion, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {criterion}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Submission */}
          <div className="space-y-6">
            {/* Technologies */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-2xl border border-border bg-surface"
            >
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {task.technologies.map((tech) => (
                  <span key={tech} className="px-3 py-1 border border-border rounded-full text-xs font-medium text-foreground bg-surface-2">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Submission form */}
            {hasStarted && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-5 rounded-2xl border border-border bg-surface"
              >
                <h4 className="font-display text-lg font-medium text-foreground mb-5">Submit Your Work</h4>
                <GitHubSubmission
                  nodeId={nodeId}
                  submission={existing}
                  onSubmit={handleSubmit}
                  githubRequired={task.githubRequired}
                  liveUrlRequired={task.liveUrlRequired}
                />
              </motion.div>
            )}

            {/* Resources */}
            {task.resources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-2xl border border-border bg-surface"
              >
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">Resources</h4>
                <div className="space-y-2">
                  {task.resources.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Globe size={13} /> {r.title}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
