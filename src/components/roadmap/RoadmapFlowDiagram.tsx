import { motion } from 'framer-motion';
import { X, CheckCircle2, Zap, ArrowRight, Lock, Compass, Target } from 'lucide-react';
import type { Roadmap, RoadmapNodeStatus } from '../../data/roadmap';

interface RoadmapFlowDiagramProps {
  roadmap: Roadmap;
  activeNodeId?: string | null;
  onSelectNode: (nodeId: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export function RoadmapFlowDiagram({
  roadmap,
  activeNodeId,
  onSelectNode,
  onClose,
  isModal = true,
}: RoadmapFlowDiagramProps) {
  const getNodeStatusColor = (status: RoadmapNodeStatus) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/20';
      case 'in-progress':
        return 'border-amber-500/70 bg-amber-500/15 text-amber-300 shadow-amber-500/30 animate-pulse';
      case 'available':
        return 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300 shadow-cyan-500/20 hover:border-cyan-400';
      case 'locked':
      default:
        return 'border-slate-800 bg-slate-900/50 text-slate-500 opacity-60';
    }
  };

  const getNodeIcon = (status: RoadmapNodeStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={13} className="text-emerald-400" />;
      case 'in-progress':
        return <Zap size={13} className="text-amber-400" />;
      case 'available':
        return <ArrowRight size={13} className="text-cyan-400" />;
      case 'locked':
      default:
        return <Lock size={12} className="text-slate-500" />;
    }
  };

  const content = (
    <div className="w-full space-y-6">
      {/* Flow Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Compass size={18} />
            </span>
            <h3 className="font-display font-bold text-lg text-white">
              Roadmap Flow: {roadmap.title}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic learning pathway with prerequisite dependencies across {roadmap.phases.length} phases
          </p>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-white/5">
        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Legend:</span>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-emerald-400" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap size={12} className="text-amber-400" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ArrowRight size={12} className="text-cyan-400" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock size={12} className="text-slate-500" />
          <span>Locked</span>
        </div>
      </div>

      {/* Horizontal / Grid Flow Tree */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex items-stretch gap-6 min-w-[760px]">
          {roadmap.phases.map((phase, idx) => {
            const phaseNodes = roadmap.nodes.filter((n) => n.phase === phase.id);

            return (
              <div key={phase.id} className="flex-1 flex flex-col items-center relative">
                {/* Connecting Phase Arrow */}
                {idx < roadmap.phases.length - 1 && (
                  <div className="hidden lg:block absolute top-7 -right-4 text-slate-600 z-10">
                    <ArrowRight size={16} />
                  </div>
                )}

                {/* Phase Badge */}
                <div
                  className="w-full text-center py-2 px-3 rounded-xl mb-4 border font-medium text-xs shadow-md"
                  style={{
                    backgroundColor: `${phase.color}15`,
                    borderColor: `${phase.color}40`,
                    color: phase.color,
                  }}
                >
                  <div className="font-bold">Phase {phase.id}: {phase.name}</div>
                  <div className="text-[10px] opacity-75 font-normal">{phase.duration}</div>
                </div>

                {/* Node Nodes Column */}
                <div className="w-full space-y-2.5 flex-1">
                  {phaseNodes.map((node) => {
                    const isSelected = activeNodeId === node.id;

                    return (
                      <motion.div
                        key={node.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectNode(node.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 shadow-sm ${getNodeStatusColor(
                          node.status
                        )} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-xs leading-snug line-clamp-2">
                            {node.title}
                          </span>
                          <span className="mt-0.5">{getNodeIcon(node.status)}</span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] opacity-70 mt-2">
                          <span>{node.duration}</span>
                          <span className="capitalize">{node.type}</span>
                        </div>

                        {node.prerequisites && node.prerequisites.length > 0 && (
                          <div className="text-[9px] opacity-50 mt-1 truncate">
                            Req: {node.prerequisites.join(', ')}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Milestone */}
      <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/20 text-xs text-blue-200">
        <Target size={15} className="text-cyan-400" />
        <span className="font-semibold">Career Readiness Target:</span> Complete all {roadmap.nodes.length} nodes to unlock industry capstone and certification.
      </div>
    </div>
  );

  if (!isModal) {
    return <div className="p-6 bg-slate-900/50 rounded-2xl border border-border">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-950/95 border border-white/10 rounded-3xl p-6 shadow-2xl custom-scrollbar"
      >
        {content}
      </motion.div>
    </div>
  );
}
