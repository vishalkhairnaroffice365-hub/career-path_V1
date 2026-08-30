import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  CheckCircle,
  Clock,
  ChevronRight,
  Zap,
  BookOpen,
  Shield,
  Code2,
  Wrench,
  GitFork,
  Search,
  X,
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { roadmaps as fallbackRoadmaps } from '../data/roadmap';
import { careers } from '../data/careers';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Button } from '../components/ui/Button';
import { useCareer } from '../context/CareerContext';
import { useUI } from '../context/UIContext';
import { StartRoadmapButton } from '../components/roadmap/StartRoadmapButton';
import { RoadmapFlowDiagram } from '../components/roadmap/RoadmapFlowDiagram';
import { getCourseByNodeId } from '../data/courses';
import type { RoadmapNode, Roadmap as CareerRoadmap } from '../data/roadmap';
import { roadmapApi } from '../services/roadmap.api';

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
  const { selectedCareer, user, completeNode, learning, startRoadmap, selectCareer } = useCareer();
  const { addToast } = useUI();
  const navigate = useNavigate();
  const { careerId: routeCareerId } = useParams();
  const [searchParams] = useSearchParams();
  const queryCareerId = searchParams.get('careerId');

  // Determine active career ID dynamically
  const activeCareerId =
    routeCareerId ||
    queryCareerId ||
    selectedCareer?.id ||
    user.selectedCareerId ||
    'android-developer';

  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [showFlowDiagram, setShowFlowDiagram] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Pick best local fallback matching activeCareerId
  const initialRoadmap =
    fallbackRoadmaps.find(
      (r) => r.careerId === activeCareerId || r.id === activeCareerId || r.id === `${activeCareerId}-roadmap`
    ) || fallbackRoadmaps[0];

  const [roadmap, setRoadmap] = useState<CareerRoadmap>(initialRoadmap);

  // Sync selected career in context if navigating with a different careerId
  useEffect(() => {
    if (activeCareerId && (!selectedCareer || selectedCareer.id !== activeCareerId)) {
      const foundCareer = careers.find((c) => c.id === activeCareerId);
      if (foundCareer) {
        selectCareer(foundCareer);
      }
    }
  }, [activeCareerId, selectedCareer, selectCareer]);

  // Fetch roadmap dynamically whenever activeCareerId changes
  useEffect(() => {
    let isMounted = true;
    setExpandedNode(null);

    async function fetchRoadmap() {
      try {
        const data = await roadmapApi.getRoadmapByCareerId(activeCareerId);
        if (isMounted && data && Array.isArray(data.nodes) && data.nodes.length > 0) {
          setRoadmap(data);
        } else if (isMounted) {
          const fallback =
            fallbackRoadmaps.find(
              (r) =>
                r.careerId === activeCareerId ||
                r.id === activeCareerId ||
                r.id === `${activeCareerId}-roadmap`
            ) || fallbackRoadmaps[0];
          setRoadmap(fallback);
        }
      } catch (err) {
        console.warn(`Could not load dynamic roadmap for ${activeCareerId}, using fallback:`, err);
        if (isMounted) {
          const fallback =
            fallbackRoadmaps.find(
              (r) =>
                r.careerId === activeCareerId ||
                r.id === activeCareerId ||
                r.id === `${activeCareerId}-roadmap`
            ) || fallbackRoadmaps[0];
          setRoadmap(fallback);
        }
      }
    }

    fetchRoadmap();

    return () => {
      isMounted = false;
    };
  }, [activeCareerId]);

  const activeCareerObj = careers.find((c) => c.id === activeCareerId) || selectedCareer;

  // Calculate dynamic progress directly from user completed nodes
  const completedCount = roadmap.nodes.filter((n) => user.progress.completedNodeIds.includes(n.id)).length;
  const totalProgress = roadmap.nodes.length > 0
    ? Math.round((completedCount / roadmap.nodes.length) * 100)
    : 0;

  const getNodeStatus = (node: RoadmapNode): RoadmapNode['status'] => {
    if (user.progress.completedNodeIds.includes(node.id)) return 'completed';
    if (user.progress.inProgressNodeIds.includes(node.id)) return 'in-progress';
    if (node.prerequisites.length === 0 || node.prerequisites.every((p) => user.progress.completedNodeIds.includes(p))) {
      return 'available';
    }
    return 'locked';
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
    if (status === 'locked') {
      addToast({ type: 'warning', message: 'Complete preceding prerequisite nodes first! 🔒' });
      return;
    }
    setExpandedNode(expandedNode === node.id ? null : node.id);
  };

  const handleStartCourse = async (node: RoadmapNode) => {
    const course = getCourseByNodeId(node.id);
    if (course) {
      navigate(`/roadmap/course/${node.id}`);
    } else {
      await completeNode(node.id);
      addToast({ type: 'success', message: `✅ "${node.title}" marked complete!` });
    }
  };

  const handleStartAssessment = (nodeId: string) => navigate(`/roadmap/assessment/${nodeId}`);
  const handleStartChallenge = (nodeId: string) => navigate(`/roadmap/challenge/${nodeId}`);
  const handleStartTask = (nodeId: string) => navigate(`/roadmap/task/${nodeId}`);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-border pb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            {activeCareerObj?.emoji && <span className="text-3xl">{activeCareerObj.emoji}</span>}
            <Badge variant="primary" className="text-xs uppercase tracking-wider">
              {activeCareerObj?.title || 'Personalized Path'}
            </Badge>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-medium text-foreground tracking-tight mb-4">
            {roadmap.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
            {roadmap.description}
          </p>
          <div className="flex items-center justify-between gap-4 mt-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium tracking-wide text-foreground uppercase">
                {roadmap.totalDuration} · {roadmap.nodes.length} Learning Steps
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFlowDiagram(true)}
              className="flex items-center gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 shadow-sm"
            >
              <GitFork size={14} />
              View Roadmap Flow Diagram
            </Button>
          </div>
        </motion.div>

        {/* Start Roadmap CTA */}
        {!learning.roadmapStarted && (
          <StartRoadmapButton
            onStart={() => {
              startRoadmap();
              addToast({ type: 'success', message: '🚀 Roadmap started! Begin with your first course.' });
            }}
          />
        )}

        {/* Progress overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16 border-b border-border pb-12"
        >
          <div className="flex justify-between items-baseline mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Overall Progress
              </p>
              <p className="font-display text-3xl font-medium text-foreground mt-1">
                {totalProgress}% Complete
              </p>
            </div>
            <span className="text-sm text-muted-foreground font-light">
              {completedCount} of {roadmap.nodes.length} steps completed
            </span>
          </div>
          <Progress value={totalProgress} variant="primary" size="md" />
        </motion.div>

        {/* Roadmap Topic Search */}
        <div className="relative mb-12">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-muted-foreground" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roadmap topics or skills (e.g. Kotlin, Docker, React, Testing, SQL)..."
              className="w-full pl-11 pr-24 py-3 bg-surface border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground bg-surface-2 rounded-lg flex items-center gap-1 transition-colors"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-muted-foreground mt-2 px-1">
              Filtering topics matching "{searchQuery}"
            </p>
          )}
        </div>

        {/* Phases & Nodes */}
        <div className="space-y-16">
          {roadmap.phases.map((phase) => {
            const phaseNodes = roadmap.nodes.filter((n) => {
              if (n.phase !== phase.id) return false;
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase().trim();
              return (
                n.title.toLowerCase().includes(q) ||
                n.description.toLowerCase().includes(q) ||
                (n.skillIds && n.skillIds.some((s) => s.toLowerCase().includes(q)))
              );
            });
            if (phaseNodes.length === 0) return null;

            return (
              <section key={phase.id} className="relative">
                {/* Phase header */}
                <div className="flex items-center gap-4 mb-8 border-b border-border pb-3">
                  <span
                    className="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-white"
                    style={{ backgroundColor: phase.color }}
                  >
                    {phase.id}
                  </span>
                  <div>
                    <h2 className="font-display font-medium text-xl text-foreground">
                      {phase.name}
                    </h2>
                    <p className="text-xs text-muted-foreground font-light">
                      {phase.description} · {phase.duration}
                    </p>
                  </div>
                </div>

                {/* Node list */}
                <div className="space-y-3">
                  {phaseNodes.map((node) => {
                    const status = getNodeStatus(node);
                    const isExpanded = expandedNode === node.id;
                    const { course, assessment, coding, task } = getNodeLearningStatus(node.id);
                    const hasCourse = !!getCourseByNodeId(node.id);

                    return (
                      <div
                        key={node.id}
                        id={`node-${node.id}`}
                        className={`border transition-all duration-200 rounded-2xl ${
                          isExpanded
                            ? 'border-primary/50 bg-surface/80 shadow-lg'
                            : status === 'available'
                            ? 'border-border hover:border-foreground/30 bg-surface/30'
                            : status === 'completed'
                            ? 'border-success/30 bg-success/5'
                            : 'border-border/50 bg-surface-2/20 opacity-70'
                        }`}
                      >
                        {/* Node main row */}
                        <div
                          onClick={() => handleNodeClick(node)}
                          className="flex items-center justify-between p-5 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                            <div className="flex-shrink-0">
                              <NodeStatusIcon status={status} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <h3
                                  className={`text-base font-medium truncate ${statusConfig[status]}`}
                                >
                                  {node.title}
                                </h3>
                                <Badge
                                  variant={
                                    status === 'completed'
                                      ? 'green'
                                      : status === 'in-progress'
                                      ? 'orange'
                                      : status === 'available'
                                      ? 'cyan'
                                      : 'default'
                                  }
                                  className="text-[10px] uppercase tracking-wider px-2 py-0.5"
                                >
                                  {status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground font-light truncate mt-1">
                                {node.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-xs text-muted-foreground font-light hidden sm:inline">
                              {node.duration}
                            </span>
                            {status !== 'locked' && (
                              <ChevronRight
                                size={16}
                                className={`text-muted-foreground transition-transform duration-200 ${
                                  isExpanded ? 'rotate-90 text-primary' : ''
                                }`}
                              />
                            )}
                          </div>
                        </div>

                        {/* Expanded detail & interactive learning modules */}
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-5 pb-6 pt-2 border-t border-border/50 space-y-4"
                          >
                            <p className="text-sm text-foreground/80 leading-relaxed font-light">
                              {node.description}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                              {/* 1. Course Module */}
                              <div className="p-4 rounded-xl border border-border bg-surface flex flex-col justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2 text-primary font-medium text-xs mb-1">
                                    <BookOpen size={14} /> Course
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {hasCourse ? 'Interactive lessons & notes' : 'Standard curriculum'}
                                  </p>
                                </div>
                                <Button
                                  size="xs"
                                  variant={course?.completed ? 'secondary' : 'primary'}
                                  onClick={() => handleStartCourse(node)}
                                  className="w-full"
                                >
                                  {course?.completed ? 'Review Course' : 'Start Course'}
                                </Button>
                              </div>

                              {/* 2. Assessment Module */}
                              <div className="p-4 rounded-xl border border-border bg-surface flex flex-col justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2 text-indigo-400 font-medium text-xs mb-1">
                                    <Shield size={14} /> Quiz Assessment
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {assessment?.passed
                                      ? `Passed (${assessment.score}%)`
                                      : 'Timed MCQ verification'}
                                  </p>
                                </div>
                                <Button
                                  size="xs"
                                  variant={assessment?.passed ? 'secondary' : 'outline'}
                                  onClick={() => handleStartAssessment(node.id)}
                                  className="w-full"
                                >
                                  {assessment?.passed ? 'Retake Quiz' : 'Take Quiz'}
                                </Button>
                              </div>

                              {/* 3. Coding Challenge */}
                              <div className="p-4 rounded-xl border border-border bg-surface flex flex-col justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2 text-cyan-400 font-medium text-xs mb-1">
                                    <Code2 size={14} /> Coding Challenge
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {coding !== undefined
                                      ? `Score: ${coding}/100`
                                      : 'Hands-on live code test'}
                                  </p>
                                </div>
                                <Button
                                  size="xs"
                                  variant={coding && coding >= 70 ? 'secondary' : 'outline'}
                                  onClick={() => handleStartChallenge(node.id)}
                                  className="w-full"
                                >
                                  {coding && coding >= 70 ? 'Review Code' : 'Solve Code'}
                                </Button>
                              </div>

                              {/* 4. Practical Task */}
                              <div className="p-4 rounded-xl border border-border bg-surface flex flex-col justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2 text-emerald-400 font-medium text-xs mb-1">
                                    <Wrench size={14} /> Practical Task
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {task?.status === 'submitted'
                                      ? 'Submitted for Review'
                                      : 'Real milestone project'}
                                  </p>
                                </div>
                                <Button
                                  size="xs"
                                  variant={task?.status === 'submitted' ? 'secondary' : 'outline'}
                                  onClick={() => handleStartTask(node.id)}
                                  className="w-full"
                                >
                                  {task?.status === 'submitted' ? 'View Submission' : 'Start Task'}
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Roadmap Flow Diagram Modal */}
        {showFlowDiagram && (
          <RoadmapFlowDiagram
            roadmap={roadmap}
            activeNodeId={expandedNode}
            onSelectNode={(nodeId) => {
              setExpandedNode(nodeId);
              setShowFlowDiagram(false);
              setTimeout(() => {
                const el = document.getElementById(`node-${nodeId}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 100);
            }}
            onClose={() => setShowFlowDiagram(false)}
          />
        )}
      </div>
    </div>
  );
}
