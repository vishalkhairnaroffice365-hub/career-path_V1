import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, Clock, CheckCircle, Search, X } from 'lucide-react';
import { resources as fallbackResources, type Resource, type ResourceType } from '../data/resources';
import { careers } from '../data/careers';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useUI } from '../context/UIContext';
import { resourceApi } from '../services/resource.api';
import { useCareer } from '../context/CareerContext';

const TYPE_FILTERS: { label: string; value: ResourceType | 'all' }[] = [
  { label: '🗂️ All Types', value: 'all' },
  { label: '🎓 Courses', value: 'course' },
  { label: '📚 Books', value: 'book' },
  { label: '🎮 Practice', value: 'practice' },
  { label: '📄 Docs', value: 'documentation' },
  { label: '🎬 Video', value: 'video' },
  { label: '💡 Articles', value: 'article' },
];

const LEVEL_COLORS = { beginner: 'green', intermediate: 'cyan', advanced: 'purple' } as const;

export default function ResourcesPage() {
  const [filter, setFilter] = useState<ResourceType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceList, setResourceList] = useState<Resource[]>(fallbackResources);
  const { addToast } = useUI();
  const { user, selectedCareer } = useCareer();

  const [careerFilter, setCareerFilter] = useState<string>(selectedCareer?.id || user.selectedCareerId || 'all');

  useEffect(() => {
    if (selectedCareer?.id && careerFilter === 'all') {
      setCareerFilter(selectedCareer.id);
    }
  }, [selectedCareer]);

  useEffect(() => {
    async function loadResources() {
      try {
        const query: any = {};
        if (filter !== 'all') query.type = filter;
        if (careerFilter !== 'all') query.careerId = careerFilter;
        if (searchQuery.trim()) query.search = searchQuery.trim();

        const data = await resourceApi.getResources(query);
        if (Array.isArray(data) && data.length > 0) {
          setResourceList(data);
        } else if (careerFilter !== 'all') {
          const filtered = fallbackResources.filter((r) => r.careerIds.includes(careerFilter));
          setResourceList(filtered.length > 0 ? filtered : fallbackResources);
        } else {
          setResourceList(fallbackResources);
        }
      } catch (err) {
        console.warn('Could not load resources from API, using fallback:', err);
        if (careerFilter !== 'all') {
          const filtered = fallbackResources.filter((r) => r.careerIds.includes(careerFilter));
          setResourceList(filtered.length > 0 ? filtered : fallbackResources);
        } else {
          setResourceList(fallbackResources);
        }
      }
    }
    loadResources();
  }, [filter, careerFilter, searchQuery]);

  const handleCompleteResource = async (resource: Resource) => {
    try {
      await resourceApi.completeResource(resource.id);
      addToast({ type: 'success', message: `Marked "${resource.title}" as completed! 🎉` });
    } catch (err) {
      console.warn('Could not sync resource completion to API:', err);
      addToast({ type: 'success', message: `Marked "${resource.title}" as completed! 🎉` });
    }
  };

  const filtered = useMemo(() => {
    let list = resourceList;
    if (filter !== 'all') {
      list = list.filter((r) => r.type === filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.provider.toLowerCase().includes(q) ||
          r.level.toLowerCase().includes(q) ||
          (r.skillIds && r.skillIds.some((s) => s.toLowerCase().includes(q))) ||
          (r.careerIds && r.careerIds.some((c) => c.toLowerCase().includes(q)))
      );
    }
    return list;
  }, [resourceList, filter, searchQuery]);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-display-sm font-bold text-foreground">
            Learning Resources
          </h1>
          <p className="text-muted-foreground mt-2">
            Curated courses, books, documentation, and practice platforms tailored to your career path.
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
              placeholder="Search resources by title, topic, skill, provider, or career (e.g. Java, Docker, React, AWS)..."
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
              Showing {filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </span>
          </div>
        </div>

        {/* Career selection filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
          <button
            onClick={() => setCareerFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              careerFilter === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-surface border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            All Careers ({fallbackResources.length})
          </button>
          {careers.slice(0, 10).map((c) => (
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

        {/* Type Filters */}
        <div className="flex items-center gap-4 mb-8 border-b border-border pb-px overflow-x-auto hide-scrollbar">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`pb-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                filter === f.value
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Resources grid */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-surface/20">
            <p className="text-base text-foreground font-medium mb-1">No matching resources found</p>
            <p className="text-xs text-muted-foreground mb-4">
              Try adjusting your search query or switching the category filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
                setCareerFilter('all');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((resource, i) => {
              const isCompleted = user.progress?.completedResourceIds?.includes(resource.id) || resource.isCompleted;

              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isCompleted
                      ? 'border-success/30 bg-success/5'
                      : 'border-border bg-surface/30 hover:border-foreground/20'
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{resource.emoji || '📚'}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-medium text-foreground truncate">
                          {resource.title}
                        </h3>
                        <Badge
                          variant={(LEVEL_COLORS[resource.level] || 'cyan') as any}
                          className="text-[11px] capitalize"
                        >
                          {resource.level}
                        </Badge>
                        {resource.isFree ? (
                          <Badge variant="green" className="text-[11px]">
                            Free
                          </Badge>
                        ) : (
                          <Badge variant="purple" className="text-[11px]">
                            {resource.price || 'Paid'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span className="font-medium text-foreground">{resource.provider}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {resource.duration}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star size={12} className="fill-amber-400" /> {resource.rating}
                        </span>
                        {resource.skillIds && resource.skillIds.length > 0 && (
                          <>
                            <span>·</span>
                            <span className="text-primary font-mono text-[11px]">
                              {resource.skillIds.join(', ')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
                    <Button
                      size="xs"
                      variant={isCompleted ? 'secondary' : 'outline'}
                      onClick={() => handleCompleteResource(resource)}
                      className="flex items-center gap-1 text-xs"
                    >
                      <CheckCircle size={13} className={isCompleted ? 'text-success' : ''} />
                      {isCompleted ? 'Completed' : 'Mark Done'}
                    </Button>
                    <Button
                      size="xs"
                      variant="primary"
                      onClick={() => window.open(resource.url, '_blank')}
                      className="flex items-center gap-1 text-xs"
                    >
                      Open Resource
                      <ExternalLink size={12} />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
