import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Clock, ChevronRight, Zap, BookOpen, Shield, Code2, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { roadmaps } from '../data/roadmap';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { useCareer } from '../context/CareerContext';
import { useUI } from '../context/UIContext';
import { StartRoadmapButton } from '../components/roadmap/StartRoadmapButton';
import { getCourseByNodeId } from '../data/courses';
import { getAssessmentByNodeId } from '../data/assessments';
import { getChallengeByNodeId } from '../data/codingChallenges';
import { getTaskByNodeId } from '../data/tasks';
import type { RoadmapNode } from '../data/roadmap';

function NodeStatusIcon({ status }: { status: RoadmapNode['status'] }) {
  if (status === 'completed') return <CheckCircle size={16} className="text-success" />;
  if (status === 'in-progress') return <Zap size={16} className="text-yellow-400 animate-pulse" />;
  if (status === 'available') return <ChevronRight size={16} className="text-primary" />;
  return <Lock size={14} className="text-muted-foreground" />;
}

const statusConfig = {
  completed: 'text-foreground',
  'in-progress': 'text-foreground',
  available: 'text-foreground cursor-pointer hover:text-primary transition-colors',
  locked: 'text-muted-foreground/60 cursor-not-allowed',
};

export default function RoadmapPage() {
  const { selectedCareer, user, completeNode, learning, startRoadmap } = useCareer();
  const { addToast } = useUI();
  const navigate = useNavigate();
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const roadmap = roadmaps.find(r => r.careerId === (selectedCareer?.id || 'android-developer'))
    || roadmaps[0];

  const completedCount = roadmap.nodes.filter(n =>
    user.progress.completedNodeIds.includes(n.id) || n.status === 'completed'
  ).length;
  const totalProgress = Math.round((completedCount / roadmap.nodes.length) * 100);

  const getNodeStatus = (node: RoadmapNode): RoadmapNode['status'] => {
    if (user.progress.completedNodeIds.includes(node.id)) return 'completed';
    if (user.progress.inProgressNodeIds.includes(node.id)) return 'in-progress';
    return node.status;
  };

  const getNodeLearningStatus = (nodeId: string) => {
    const course = learning.courseProgress[nodeId];
    const assessment = learning.assessmentScores[nodeId];
    const coding = learning.codingScores[nodeId];
    const task = learning.taskSubmissions[nodeId];
    return { course, assessment, coding, task };
  };

  const handleNodeClick = (node: RoadmapNode) => {
    const status = getNodeStatus(node);
    if (status === 'locked') return;
    setExpandedNode(expandedNode === node.id ? null : node.id);
  };

  const handleStartCourse = (node: RoadmapNode) => {
    const course = getCourseByNodeId(node.id);
    if (course) {
      navigate(`/roadmap/course/${node.id}`);
    } else {
      completeNode(node.id);
      addToast({ type: 'success', message: `✅ "${node.title}" marked complete!` });
    }
  };

  const handleStartAssessment = (nodeId: string) => navigate(`/roadmap/assessment/${nodeId}`);
  const handleStartChallenge = (nodeId: string) => navigate(`/roadmap/challenge/${nodeId}`);
  const handleStartTask = (nodeId: string) => navigate(`/roadmap/task/${nodeId}`);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 border-b border-border pb-8">
          <h1 className="font-display text-5xl md:text-6xl font-medium text-foreground tracking-tight mb-4">{roadmap.title}</h1>
          <p className="text-xl text-muted-foreground font-light">{roadmap.description}</p>
          <div className="flex items-center gap-4 mt-6">
            <Clock size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium tracking-wide text-foreground uppercase">{roadmap.totalDuration}</span>
          </div>
        </motion.div>

        {/* Start Roadmap CTA */}
        {!learning.roadmapStarted && (
          <StartRoadmapButton onStart={() => {
            startRoadmap();
            addToast({ type: 'success', message: '🚀 Roadmap started! Begin with your first course.' });
          }} />
        )}

        {/* Progress overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Overall Progress</span>
            <span className="font-display text-2xl font-medium text-foreground">{totalProgress}%</span>
          </div>
          <Progress value={totalProgress} variant="primary" size="md" />
          <div className="grid grid-cols-4 gap-6 mt-8">
            {roadmap.phases.map((phase) => (
              <div key={phase.id} className="border-t-2 pt-3" style={{ borderColor: phase.color }}>
                <p className="text-xs font-semibold text-foreground tracking-wide uppercase mb-1">{phase.name}</p>
                <p className="text-xs text-muted-foreground">{phase.duration}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Roadmap nodes grouped by phase */}
        <div className="space-y-16">
          {roadmap.phases.map((phase) => {
            const phaseNodes = roadmap.nodes.filter(n => n.phase === phase.id);
            return (
              <div key={phase.id}>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: phase.color }} />
                    <h2 className="font-display text-2xl font-medium text-foreground">Phase {phase.id}: {phase.name}</h2>
                  </div>
                  <Badge variant="default" className="text-xs uppercase tracking-wider">{phase.duration}</Badge>
                </div>

                <div className="space-y-8 pl-1.5 ml-2 border-l border-border relative">
                  {phaseNodes.map((node, i) => {
                    const status = getNodeStatus(node);
                    const isExpanded = expandedNode === node.id;
                    const ls = getNodeLearningStatus(node.id);
                    const hasCourse = !!getCourseByNodeId(node.id);
                    const hasAssessment = !!getAssessmentByNodeId(node.id);
                    const hasChallenge = !!getChallengeByNodeId(node.id);
                    const hasTask = !!getTaskByNodeId(node.id);
                    const courseCompleted = ls.course?.completed;
                    const assessmentPassed = ls.assessment?.passed;
                    const codingDone = ls.coding !== undefined && ls.coding >= 70;
                    const taskSubmitted = ls.task?.status === 'submitted' || ls.task?.status === 'passed';

                    const canTakeAssessment = !hasCourse || courseCompleted;
                    const canTakeChallenge = canTakeAssessment && (!hasAssessment || assessmentPassed);
                    const canTakeTask = canTakeChallenge && (!hasChallenge || codingDone);

                    return (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`relative pl-8 pb-4 ${statusConfig[status]}`}
                        onClick={() => handleNodeClick(node)}
                      >
                        {/* Timeline dot */}
                        <div className="absolute -left-[23px] top-1 w-11 h-11 flex items-center justify-center bg-background">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            status === 'completed' ? 'border-success bg-success/10 text-success' :
                            status === 'in-progress' ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' :
                            status === 'available' ? 'border-primary bg-primary/10 text-primary' :
                            'border-border bg-surface text-muted-foreground'
                          }`}>
                            <NodeStatusIcon status={status} />
                          </div>
                        </div>

                        <div className="flex flex-col pt-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-display text-xl font-medium">{node.title}</span>
                            <Badge variant={
                              node.type === 'milestone' ? 'orange' :
                              node.type === 'project' ? 'cyan' :
                              node.type === 'certification' ? 'purple' : 'default'
                            }>
                              {node.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground ml-auto">{node.duration}</span>
                          </div>

                          {/* Learning stage badges */}
                          {(status !== 'locked') && (hasCourse || hasAssessment || hasChallenge || hasTask) && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {hasCourse && (
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${courseCompleted ? 'border-success/30 bg-success/10 text-success' : 'border-border bg-surface-2 text-muted-foreground'}`}>
                                  <BookOpen size={11} /> Course {courseCompleted ? '✓' : ''}
                                </span>
                              )}
                              {hasAssessment && courseCompleted && (
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${assessmentPassed ? 'border-success/30 bg-success/10 text-success' : 'border-border bg-surface-2 text-muted-foreground'}`}>
                                  <Shield size={11} /> Assessment {assessmentPassed ? '✓' : ''}
                                </span>
                              )}
                              {hasChallenge && courseCompleted && (
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${codingDone ? 'border-success/30 bg-success/10 text-success' : 'border-border bg-surface-2 text-muted-foreground'}`}>
                                  <Code2 size={11} /> Challenge {codingDone ? '✓' : ''}
                                </span>
                              )}
                              {hasTask && (
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${taskSubmitted ? 'border-success/30 bg-success/10 text-success' : 'border-border bg-surface-2 text-muted-foreground'}`}>
                                  <Wrench size={11} /> Project {taskSubmitted ? '✓' : ''}
                                </span>
                              )}
                            </div>
                          )}

                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-4"
                            >
                              <p className="text-base text-muted-foreground leading-relaxed font-light mb-4 max-w-2xl">{node.description}</p>
                              {node.skillIds.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {node.skillIds.map(id => (
                                    <span key={id} className="px-3 py-1 bg-surface border border-border text-xs text-foreground rounded-full">
                                      {id}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Action buttons */}
                              {status !== 'locked' && learning.roadmapStarted && (
                                <div className="flex flex-wrap gap-3 mt-2" onClick={(e) => e.stopPropagation()}>
                                  {hasCourse && !courseCompleted && (
                                    <button
                                      onClick={() => handleStartCourse(node)}
                                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-all"
                                    >
                                      <BookOpen size={13} /> Start Course
                                    </button>
                                  )}
                                  {hasCourse && courseCompleted && (
                                    <button
                                      onClick={() => navigate(`/roadmap/course/${node.id}`)}
                                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-border rounded-xl text-xs font-medium hover:bg-surface-2 transition-all"
                                    >
                                      <BookOpen size={13} /> Review Course
                                    </button>
                                  )}
                                  {hasAssessment && canTakeAssessment && !assessmentPassed && (
                                    <button
                                      onClick={() => handleStartAssessment(node.id)}
                                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-all"
                                    >
                                      <Shield size={13} /> Take Assessment
                                    </button>
                                  )}
                                  {hasChallenge && canTakeChallenge && !codingDone && (
                                    <button
                                      onClick={() => handleStartChallenge(node.id)}
                                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-all"
                                    >
                                      <Code2 size={13} /> Coding Challenge
                                    </button>
                                  )}
                                  {hasTask && canTakeTask && !taskSubmitted && (
                                    <button
                                      onClick={() => handleStartTask(node.id)}
                                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-all"
                                    >
                                      <Wrench size={13} /> Start Project
                                    </button>
                                  )}
                                  {!hasCourse && status !== 'completed' && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); completeNode(node.id); addToast({ type: 'success', message: `✅ "${node.title}" complete!` }); }}
                                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-border rounded-xl text-xs font-medium hover:bg-surface-2 transition-all"
                                    >
                                      <CheckCircle size={13} /> Mark Complete
                                    </button>
                                  )}
                                </div>
                              )}

                              {!learning.roadmapStarted && status !== 'locked' && (
                                <p className="text-xs text-muted-foreground italic mt-2">Start your roadmap to begin learning.</p>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
