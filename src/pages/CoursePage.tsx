import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Circle, Clock, BookOpen, ChevronRight, Play, Award } from 'lucide-react';
import { getCourseByNodeId } from '../data/courses';
import { useCareer } from '../context/CareerContext';
import type { CourseProgress } from '../context/CareerContext';
import { Progress } from '../components/ui/Progress';

export default function CoursePage() {
  const { nodeId } = useParams<{ nodeId: string }>();
  const navigate = useNavigate();
  const { learning, updateCourseProgress, completeNode } = useCareer();

  const course = useMemo(() => (nodeId ? getCourseByNodeId(nodeId) : undefined), [nodeId]);

  const existing = nodeId ? learning.courseProgress[nodeId] : undefined;

  const [completedLessons, setCompletedLessons] = useState<string[]>(existing?.lessonsCompleted ?? []);
  const [courseCompleted, setCourseCompleted] = useState(existing?.completed ?? false);

  if (!course || !nodeId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="font-display text-2xl font-medium text-foreground mb-2">Content Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find this learning content.</p>
          <button onClick={() => navigate('/roadmap')} className="text-primary font-medium hover:underline">
            ← Back to Roadmap
          </button>
        </div>
      </div>
    );
  }

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const totalLessons = allLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  const toggleLesson = (lessonId: string) => {
    if (courseCompleted) return;
    setCompletedLessons((prev) => {
      const next = prev.includes(lessonId) ? prev.filter((l) => l !== lessonId) : [...prev, lessonId];
      const progress: CourseProgress = {
        nodeId,
        lessonsCompleted: next,
        totalLessons,
        completed: false,
        startedAt: existing?.startedAt ?? new Date().toISOString(),
      };
      updateCourseProgress(progress);
      return next;
    });
  };

  const handleCompleteCourse = () => {
    if (courseCompleted) return;
    const allLessonIds = allLessons.map((l) => l.id);
    setCourseCompleted(true);
    setCompletedLessons(allLessonIds);
    const progress: CourseProgress = {
      nodeId,
      lessonsCompleted: allLessonIds,
      totalLessons,
      completed: true,
      startedAt: existing?.startedAt ?? new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    updateCourseProgress(progress);
    completeNode(nodeId);
  };

  const difficultyColor: Record<string, string> = {
    beginner: 'text-success',
    intermediate: 'text-warning',
    advanced: 'text-danger',
  };

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back nav */}
        <button
          onClick={() => navigate('/roadmap')}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Roadmap
        </button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`text-xs uppercase tracking-widest font-bold ${difficultyColor[course.difficulty]}`}>
              {course.difficulty}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={12} /> {course.estimatedTime}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen size={12} /> {totalLessons} lessons
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground tracking-tight mb-3">{course.title}</h1>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">{course.description}</p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Course Progress</span>
            <span className="font-display text-2xl font-medium text-foreground">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} variant={courseCompleted ? 'green' : 'primary'} size="md" />
          <p className="text-xs text-muted-foreground mt-2">{completedLessons.length} of {totalLessons} lessons completed</p>
        </motion.div>

        {/* Completion banner */}
        <AnimatePresence>
          {courseCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 rounded-2xl border border-success/30 bg-success/8 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                <Award size={24} className="text-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-medium text-foreground">Course Completed ✓</h3>
                <p className="text-muted-foreground text-sm">Great work! Assessment is now available.</p>
              </div>
              {course.hasAssessment && (
                <motion.button
                  onClick={() => navigate(`/roadmap/assessment/${nodeId}`)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all whitespace-nowrap"
                >
                  Take Assessment <ChevronRight size={15} />
                </motion.button>
              )}
              {course.hasPracticalTask && !course.hasAssessment && (
                <motion.button
                  onClick={() => navigate(`/roadmap/task/${nodeId}`)}
                  whileHover={{ scale: 1.03 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all whitespace-nowrap"
                >
                  Start Task <ChevronRight size={15} />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Objectives */}
        {course.objectives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-10 p-6 rounded-2xl border border-border bg-surface"
          >
            <h3 className="font-display text-lg font-medium text-foreground mb-4">What you'll learn</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={15} className="text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{obj}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Modules & Lessons */}
        <div className="space-y-8 mb-12">
          {course.modules.map((module, mi) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + mi * 0.05 }}
            >
              <h3 className="font-display text-xl font-medium text-foreground mb-4 pb-3 border-b border-border">
                {module.title}
              </h3>
              <div className="space-y-3">
                {module.lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const typeIcon = lesson.type === 'video' ? '▶' : lesson.type === 'reading' ? '📖' : lesson.type === 'exercise' ? '✏️' : '❓';
                  return (
                    <motion.button
                      key={lesson.id}
                      onClick={() => toggleLesson(lesson.id)}
                      disabled={courseCompleted}
                      whileHover={courseCompleted ? {} : { x: 4 }}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-200 text-left ${
                        isCompleted
                          ? 'border-success/20 bg-success/5'
                          : 'border-border bg-surface hover:border-primary/30 hover:bg-surface-2'
                      } ${courseCompleted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {isCompleted ? (
                        <CheckCircle size={18} className="text-success flex-shrink-0" />
                      ) : (
                        <Circle size={18} className="text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-base">{typeIcon}</span>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-medium ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {lesson.title}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{lesson.duration}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Complete Course button */}
        {!courseCompleted && (
          <div className="flex justify-center">
            <motion.button
              onClick={handleCompleteCourse}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-base hover:opacity-90 transition-all shadow-editorial"
            >
              <Play size={18} />
              {progressPercent > 0 ? 'Complete Course' : 'Start Learning'}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
