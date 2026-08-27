import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Clock, ChevronRight, Zap } from 'lucide-react';
import { roadmaps } from '../data/roadmap';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { useCareer } from '../context/CareerContext';
import { useUI } from '../context/UIContext';
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
  const { selectedCareer, user, completeNode } = useCareer();
  const { addToast } = useUI();
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

  const handleNodeClick = (node: RoadmapNode) => {
    const status = getNodeStatus(node);
    if (status === 'locked') return;
    if (status === 'available' || status === 'in-progress') {
      completeNode(node.id);
      addToast({ type: 'success', message: `✅ "${node.title}" marked complete!` });
    }
    setExpandedNode(expandedNode === node.id ? null : node.id);
  };

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
                          
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-4"
                            >
                              <p className="text-base text-muted-foreground leading-relaxed font-light mb-4 max-w-2xl">{node.description}</p>
                              {node.skillIds.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {node.skillIds.map(id => (
                                    <span key={id} className="px-3 py-1 bg-surface border border-border text-xs text-foreground rounded-full">
                                      {id}
                                    </span>
                                  ))}
                                </div>
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
