import { useState  } from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { projects } from '../data/projects';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useUI } from '../context/UIContext';

const DIFFICULTY_CONFIG = {
  starter: { variant: 'green', label: '🌱 Starter' },
  intermediate: { variant: 'cyan', label: '⚡ Intermediate' },
  advanced: { variant: 'purple', label: '🔥 Advanced' },
  capstone: { variant: 'orange', label: '🏆 Capstone' },
} as const;

const STATUS_CONFIG = {
  'not-started': { label: 'Not Started', color: 'text-muted-foreground' },
  'in-progress': { label: '⚡ In Progress', color: 'text-yellow-400' },
  'completed': { label: '✅ Completed', color: 'text-success' },
  'published': { label: '🌍 Published', color: 'text-primary' },
};

export default function ProjectsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { addToast } = useUI();

  const portfolio = projects.filter(p => p.isPortfolioWorthy);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-display-sm font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Hands-on projects that build real skills and fill your portfolio.
          </p>
        </motion.div>

        {/* Portfolio summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 pb-8 border-b border-border"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Portfolio Progress</h2>
              <p className="font-display text-3xl font-medium text-foreground">
                {projects.filter(p => p.status === 'completed').length} <span className="text-muted-foreground text-xl">/ {portfolio.length}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              {[...portfolio].slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    p.status === 'completed' ? 'bg-success/15 border border-success/30' : 'bg-surface border border-border opacity-50 grayscale'
                  }`}
                >
                  {p.emoji}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Project list */}
        <div className="space-y-0">
          {projects.map((project, i) => {
            const isExpanded = expanded === project.id;
            const diffConfig = DIFFICULTY_CONFIG[project.difficulty];
            const statusConfig = STATUS_CONFIG[project.status];

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-border last:border-0"
              >
                {/* Header */}
                <button
                  className="w-full flex items-start md:items-center gap-6 py-6 text-left hover:bg-surface/30 transition-colors px-4 -mx-4 rounded-2xl"
                  onClick={() => setExpanded(isExpanded ? null : project.id)}
                >
                  <span className="text-4xl mt-1 md:mt-0">{project.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <span className="font-display text-xl font-medium text-foreground">{project.title}</span>
                      {project.isPortfolioWorthy && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-yellow-400 uppercase tracking-wider bg-yellow-400/10 px-2 py-0.5 rounded-full">
                          <Star size={10} className="fill-yellow-400" /> Portfolio
                        </span>
                      )}
                    </div>
                    <p className="text-base text-muted-foreground font-light mb-3">{project.description}</p>
                    <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
                      <span className={statusConfig.color}>{statusConfig.label}</span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock size={14} /> {project.estimatedTime}
                      </span>
                      <span className="text-muted-foreground">{diffConfig.label}</span>
                    </div>
                  </div>
                  <div className="ml-4 mt-2 md:mt-0">
                    {isExpanded ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="pl-[72px] pr-4 pb-8">
                    <div className="space-y-8">
                      <p className="text-lg text-muted-foreground leading-relaxed font-light max-w-3xl">{project.longDescription}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Objectives</p>
                          <ul className="space-y-3">
                            {project.objectives.map((obj) => (
                              <li key={obj} className="flex items-start gap-3 text-base text-foreground/80 font-light">
                                <span className="text-primary mt-1 flex-shrink-0">—</span>
                                {obj}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Tech Stack</p>
                          <div className="flex flex-wrap gap-2">
                            {project.techStack.map(t => <Badge key={t} variant="default" className="text-xs px-3 py-1 bg-surface border-border">{t}</Badge>)}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => addToast({ type: 'success', message: `Started "${project.title}"! Let's build it! 🚀` })}
                        >
                          Start Project
                        </Button>
                        {project.githubUrl && (
                          <Button variant="outline" size="lg" leftIcon={<Globe size={18} />}>
                            View Code
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
