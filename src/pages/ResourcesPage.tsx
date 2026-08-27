import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, Clock, DollarSign } from 'lucide-react';
import { resources, type ResourceType } from '../data/resources';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useUI } from '../context/UIContext';

const TYPE_FILTERS: { label: string; value: ResourceType | 'all' }[] = [
  { label: '🗂️ All', value: 'all' },
  { label: '🎓 Courses', value: 'course' },
  { label: '📚 Books', value: 'book' },
  { label: '🎮 Practice', value: 'practice' },
  { label: '📄 Docs', value: 'documentation' },
  { label: '🎬 Video', value: 'video' },
];

const LEVEL_COLORS = { beginner: 'green', intermediate: 'cyan', advanced: 'purple' } as const;

export default function ResourcesPage() {
  const [filter, setFilter] = useState<ResourceType | 'all'>('all');
  const { addToast } = useUI();

  const filtered = filter === 'all' ? resources : resources.filter(r => r.type === filter);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-display-sm font-bold text-foreground">Learning Resources</h1>
          <p className="text-muted-foreground mt-2">Curated courses, books, and practice platforms to accelerate your learning.</p>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-12 border-b border-border pb-px overflow-x-auto hide-scrollbar">
          {TYPE_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`pb-4 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
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
        <div className="space-y-0">
          {filtered.map((resource, i) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="py-8 border-b border-border flex flex-col md:flex-row gap-6 hover:bg-surface/50 transition-colors px-4 -mx-4 rounded-2xl"
            >
              <div className="md:w-1/4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{resource.emoji}</span>
                  <div className="flex items-center gap-1.5 text-yellow-400 md:hidden">
                    <Star size={14} className="fill-yellow-400" />
                    <span className="text-sm font-bold text-foreground">{resource.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={LEVEL_COLORS[resource.level]} className="uppercase tracking-wider text-[10px]">{resource.level}</Badge>
                  <Badge variant="default" className="uppercase tracking-wider text-[10px]">{resource.type}</Badge>
                </div>
              </div>

              <div className="md:w-1/2">
                <h3 className="font-display text-xl font-medium text-foreground mb-3">{resource.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed font-light mb-4">{resource.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {resource.duration}</span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign size={14} />
                    {resource.isFree ? <span className="text-success font-bold">Free</span> : resource.price}
                  </span>
                  <span className="hidden md:flex items-center gap-1 text-yellow-400 normal-case font-medium text-sm ml-2">
                    <Star size={14} className="fill-yellow-400" /> <span className="text-foreground">{resource.rating}</span>
                  </span>
                </div>
              </div>

              <div className="md:w-1/4 flex items-center md:justify-end mt-4 md:mt-0">
                <Button
                  variant="outline"
                  size="md"
                  rightIcon={<ExternalLink size={16} />}
                  onClick={() => {
                    window.open(resource.url, '_blank', 'noopener noreferrer');
                    addToast({ type: 'info', message: `Opening ${resource.title}...` });
                  }}
                  className="w-full md:w-auto"
                >
                  Start Learning
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
