import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Globe, Search, X, FolderGit2 } from 'lucide-react';
import { projects as fallbackProjects, type Project } from '../data/projects';
import { careers } from '../data/careers';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useUI } from '../context/UIContext';
import { projectApi } from '../services/project.api';
import { useCareer } from '../context/CareerContext';

const DIFFICULTY_CONFIG = {
  starter: { variant: 'green', label: '🌱 Starter' },
  intermediate: { variant: 'cyan', label: '⚡ Intermediate' },
  advanced: { variant: 'purple', label: '🔥 Advanced' },
  capstone: { variant: 'orange', label: '🏆 Capstone' },
} as const;

const STATUS_CONFIG = {
  'not-started': { label: 'Not Started', color: 'text-muted-foreground' },
  'in-progress': { label: '⚡ In Progress', color: 'text-yellow-400' },
  completed: { label: '✅ Completed', color: 'text-success' },
  published: { label: '🌍 Published', color: 'text-primary' },
};

export default function ProjectsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [projectList, setProjectList] = useState<Project[]>(fallbackProjects);
  const { addToast } = useUI();
  const { user, selectedCareer } = useCareer();

  const [careerFilter, setCareerFilter] = useState<string>(selectedCareer?.id || user.selectedCareerId || 'all');

  useEffect(() => {
    if (selectedCareer?.id && careerFilter === 'all') {
      setCareerFilter(selectedCareer.id);
    }
  }, [selectedCareer]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const query: any = {};
        if (careerFilter !== 'all') query.careerId = careerFilter;
        if (difficultyFilter !== 'all') query.difficulty = difficultyFilter;
        if (searchQuery.trim()) query.search = searchQuery.trim();

        const data = await projectApi.getProjects(query);
        if (Array.isArray(data) && data.length > 0) {
          setProjectList(data);
        } else if (careerFilter !== 'all') {
          const filtered = fallbackProjects.filter((p) => p.careerIds.includes(careerFilter));
          setProjectList(filtered.length > 0 ? filtered : fallbackProjects);
        } else {
          setProjectList(fallbackProjects);
        }
      } catch (err) {
        console.warn('Could not load projects from API, using fallback:', err);
        if (careerFilter !== 'all') {
          const filtered = fallbackProjects.filter((p) => p.careerIds.includes(careerFilter));
          setProjectList(filtered.length > 0 ? filtered : fallbackProjects);
        } else {
          setProjectList(fallbackProjects);
        }
      }
    }
    loadProjects();
  }, [careerFilter, difficultyFilter, searchQuery]);

  const handleStartProject = async (project: Project) => {
    try {
      await projectApi.updateStatus(project.id, 'in-progress');
      setProjectList((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, status: 'in-progress' } : p))
      );
      addToast({ type: 'success', message: `Started "${project.title}"! Let's build it! 🚀` });
    } catch (err) {
      console.warn('Could not update project status via API:', err);
      addToast({ type: 'success', message: `Started "${project.title}"! Let's build it! 🚀` });
    }
  };

  const filtered = useMemo(() => {
    let list = projectList;
    if (difficultyFilter !== 'all') {
      list = list.filter((p) => p.difficulty === difficultyFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.longDescription && p.longDescription.toLowerCase().includes(q)) ||
          (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(q))) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
          (p.careerIds && p.careerIds.some((c) => c.toLowerCase().includes(q)))
      );
    }
    return list;
  }, [projectList, difficultyFilter, searchQuery]);

  const portfolio = projectList.filter((p) => p.isPortfolioWorthy);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-display-sm font-bold text-foreground">Projects & Portfolio</h1>
          <p className="text-muted-foreground mt-2">
            Hands-on projects tailored to your chosen career path to build real skills and showcase in your portfolio.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-muted-foreground" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, tech stack, skill, or career (e.g. Kotlin, React, PyTorch, Docker, Spring)..."
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
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 px-1">
            <span>
              Showing {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap mb-6">
          {/* Career filter selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar flex-1 min-w-[280px]">
            <button
              onClick={() => setCareerFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                careerFilter === 'all'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-surface border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              All Careers
            </button>
            {careers.slice(0, 8).map((c) => (
              <button
                key={c.id}
                onClick={() => setCareerFilter(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  careerFilter === c.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-surface border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{c.emoji}</span>
                <span>{c.title}</span>
              </button>
            ))}
          </div>

          {/* Difficulty filter selector */}
          <div className="flex items-center gap-1.5 bg-surface border border-border p-1 rounded-xl text-xs">
            {['all', 'starter', 'intermediate', 'advanced', 'capstone'].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-all ${
                  difficultyFilter === diff
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 pb-6 border-b border-border"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1 flex items-center gap-1.5">
                <FolderGit2 size={13} className="text-primary" /> Portfolio Milestones
              </h2>
              <p className="font-display text-2xl font-medium text-foreground">
                {projectList.filter((p) => p.status === 'completed' || user.progress?.completedProjectIds?.includes(p.id)).length}{' '}
                <span className="text-muted-foreground text-lg">/ {portfolio.length} Ready</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-light">
                {projectList.filter((p) => p.status === 'in-progress').length} In Progress
              </span>
            </div>
          </div>
        </motion.div>

        {/* Projects list */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-surface/20">
            <p className="text-base text-foreground font-medium mb-1">No matching projects found</p>
            <p className="text-xs text-muted-foreground mb-4">
              Try adjusting your search query or switching the difficulty/career filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setDifficultyFilter('all');
                setCareerFilter('all');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((project, i) => {
              const diffConfig =
                DIFFICULTY_CONFIG[project.difficulty] || DIFFICULTY_CONFIG.intermediate;
              const isCompleted =
                project.status === 'completed' || user.progress?.completedProjectIds?.includes(project.id);
              const statusConfig = STATUS_CONFIG[isCompleted ? 'completed' : project.status] || STATUS_CONFIG['not-started'];
              const isExpanded = expanded === project.id;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className={`border transition-all duration-200 rounded-2xl ${
                    isExpanded ? 'border-primary/50 bg-surface/80 shadow-lg' : 'border-border bg-surface/30 hover:border-foreground/20'
                  }`}
                >
                  <div
                    onClick={() => setExpanded(isExpanded ? null : project.id)}
                    className="flex items-center justify-between p-5 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                      <span className="text-2xl flex-shrink-0">{project.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-base font-medium text-foreground truncate">
                            {project.title}
                          </h3>
                          <Badge variant={diffConfig.variant as any} className="text-xs">
                            {diffConfig.label}
                          </Badge>
                          {project.isPortfolioWorthy && (
                            <Badge variant="purple" className="text-xs">
                              ⭐ Portfolio Piece
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className={`text-xs font-medium ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      <div className="text-muted-foreground">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 pt-2 border-t border-border/50 text-sm space-y-4"
                    >
                      <p className="text-muted-foreground leading-relaxed">
                        {project.longDescription}
                      </p>

                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Key Objectives
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {(project.objectives || []).map((obj, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/30 flex-wrap gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground font-medium">Tech:</span>
                          {(project.techStack || []).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md bg-surface-2 border border-border text-[11px] font-mono text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => window.open(project.githubUrl || 'https://github.com', '_blank')}
                            className="flex items-center gap-1 text-xs"
                          >
                            <Globe size={12} />
                            Repo Template
                          </Button>
                          {!isCompleted && project.status !== 'in-progress' && (
                            <Button
                              size="xs"
                              variant="primary"
                              onClick={() => handleStartProject(project)}
                              className="text-xs"
                            >
                              Start Building ⚡
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
