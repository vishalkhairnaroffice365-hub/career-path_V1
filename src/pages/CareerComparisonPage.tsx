import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge, DemandBadge, WorkStyleBadge } from '../components/ui/Badge';
import { useCareer } from '../context/CareerContext';
import { useUI } from '../context/UIContext';

const COMPARE_ROWS = [
  { label: 'Match Score', key: 'matchScore', render: (v: any) => v ? `${v}%` : '—' },
  { label: 'Entry Salary', key: 'salary.entry', render: (c: any) => c.salary?.entry || '—' },
  { label: 'Mid Salary', key: 'salary.mid', render: (c: any) => c.salary?.mid || '—' },
  { label: 'Senior Salary', key: 'salary.senior', render: (c: any) => c.salary?.senior || '—' },
  { label: 'Growth Rate', key: 'growthRate', render: (c: any) => c.growthRate },
  { label: 'Time to Ready', key: 'timeToReady', render: (c: any) => c.timeToReady },
  { label: 'Work Style', key: 'workStyle', render: (c: any) => <WorkStyleBadge style={c.workStyle} /> },
  { label: 'Demand', key: 'demandLevel', render: (c: any) => <DemandBadge level={c.demandLevel} /> },
];

export default function CareerComparisonPage() {
  const navigate = useNavigate();
  const { comparedCareers, removeFromCompare, selectCareer } = useCareer();
  const { addToast } = useUI();

  const isEmpty = comparedCareers.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-background pt-28 flex flex-col items-center justify-center px-4">
        <span className="text-6xl mb-4">⚖️</span>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Nothing to compare yet</h1>
        <p className="text-muted-foreground mb-8">Add careers from the Career Sky to compare them side-by-side.</p>
        <Button variant="primary" onClick={() => navigate('/sky')}>
          Go to Career Sky
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button
            onClick={() => navigate('/sky')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4"
          >
            <ArrowLeft size={14} /> Back to Sky
          </button>
          <h1 className="font-display text-display-sm font-bold text-foreground">Career Comparison</h1>
          <p className="text-muted-foreground mt-2">
            Compare up to 3 careers side by side. Which one is right for you?
          </p>
        </motion.div>

        {/* Comparison grid */}
        <div className="overflow-hidden">
          {/* Career headers */}
          <div
            className="grid gap-0 border-b border-border"
            style={{ gridTemplateColumns: `200px repeat(${comparedCareers.length}, 1fr)` }}
          >
            <div className="p-5 bg-white/3">
              <p className="text-xs font-semibold text-muted-foreground">CAREER</p>
            </div>
            {comparedCareers.map((career) => (
              <div key={career.id} className="p-5 border-l border-border relative">
                <button
                  onClick={() => removeFromCompare(career.id)}
                  className="absolute top-3 right-3 p-1 rounded-lg text-muted-foreground hover:text-danger hover:bg-red-500/10 transition-all duration-200"
                >
                  <X size={14} />
                </button>
                <p className="text-2xl mb-2">{career.emoji}</p>
                <p className="font-display font-bold text-foreground text-sm">{career.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{career.tagline}</p>
              </div>
            ))}
          </div>

          {/* Comparison rows */}
          {COMPARE_ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`grid gap-0 border-b border-border last:border-0 ${i % 2 === 0 ? 'bg-white/2' : ''}`}
              style={{ gridTemplateColumns: `200px repeat(${comparedCareers.length}, 1fr)` }}
            >
              <div className="p-4 flex items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{row.label}</span>
              </div>
              {comparedCareers.map((career) => (
                <div key={career.id} className="p-4 border-l border-border flex items-center">
                  <span className="text-sm text-foreground">
                    {typeof row.render === 'function' ? row.render(career) : '—'}
                  </span>
                </div>
              ))}
            </div>
          ))}

          {/* Key skills row */}
          <div
            className="grid gap-0 border-t border-border"
            style={{ gridTemplateColumns: `200px repeat(${comparedCareers.length}, 1fr)` }}
          >
            <div className="p-4 flex items-start">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">Key Skills</span>
            </div>
            {comparedCareers.map((career) => (
              <div key={career.id} className="p-4 border-l border-border">
                <div className="flex flex-wrap gap-1.5">
                  {career.keySkills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="default">{skill}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div
            className="grid gap-0 border-t border-border mt-8 pt-8"
            style={{ gridTemplateColumns: `200px repeat(${comparedCareers.length}, 1fr)` }}
          >
            <div className="p-4" />
            {comparedCareers.map((career) => (
              <div key={career.id} className="p-4 border-l border-border space-y-2">
                <Button
                  variant="gradient"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    selectCareer(career);
                    addToast({ type: 'success', message: `${career.title} selected!` });
                    navigate('/skill-gap');
                  }}
                >
                  Choose This
                </Button>
                <Button variant="ghost" size="sm" fullWidth onClick={() => navigate(`/career/${career.id}`)}>
                  Details
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Add more careers */}
        {comparedCareers.length < 3 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <Button variant="secondary" onClick={() => navigate('/sky')} leftIcon={<Plus size={16} />}>
              Add Another Career to Compare
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
