import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { careers } from '../data/careers';
import { domains } from '../data/domains';
import { Button } from '../components/ui/Button';
import { Badge, DemandBadge } from '../components/ui/Badge';
import { useCareer } from '../context/CareerContext';
import { useUI } from '../context/UIContext';

export default function CareerSelectionPage() {
  const navigate = useNavigate();
  const { selectCareer } = useCareer();
  const { addToast } = useUI();

  const topCareers = [...careers].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const handleSelect = (career: typeof careers[0]) => {
    selectCareer(career);
    addToast({ type: 'success', message: `${career.title} is now your career path! 🎯` });
    navigate('/skill-gap');
  };

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 border-b border-border pb-8">
          <button onClick={() => navigate('/sky')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 uppercase tracking-wider font-semibold transition-colors">
            <ArrowLeft size={14} /> Back to Sky
          </button>
          <h1 className="font-display text-5xl md:text-6xl font-medium text-foreground tracking-tight mb-4">Choose Your Path</h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl">These careers are ranked by how well they match your profile. Pick the one that excites you most.</p>
        </motion.div>

        <div className="space-y-0">
          {topCareers.map((career, i) => {
            const domain = domains.find(d => d.id === career.domainId);
            return (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="py-10 border-b border-border hover:bg-surface/30 transition-colors -mx-6 px-6 rounded-2xl group flex flex-col md:flex-row items-start gap-8"
              >
                <div className="text-6xl flex-shrink-0 mt-2">{career.emoji}</div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-3 flex-wrap">
                    <h2 className="font-display text-3xl font-medium text-foreground">{career.title}</h2>
                    {i === 0 && <Badge variant="green" className="uppercase tracking-wider font-semibold px-3 py-1">⭐ Best Match</Badge>}
                  </div>
                  
                  <p className="text-lg text-muted-foreground font-light mb-6 leading-relaxed max-w-2xl">{career.tagline}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-8">
                    <Badge variant="default" className="bg-surface border-border px-3 py-1 text-xs">{domain?.name}</Badge>
                    <DemandBadge level={career.demandLevel} />
                    <Badge variant="cyan" className="px-3 py-1 text-xs">{career.salary.mid}/yr</Badge>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />} onClick={() => handleSelect(career)}>
                      Choose This Path
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => navigate(`/career/${career.id}`)}>
                      View Details
                    </Button>
                  </div>
                </div>

                {career.matchScore && (
                  <div className="md:ml-auto flex-shrink-0 flex items-center justify-center flex-col w-24 h-24 rounded-full border-2 border-primary/20 bg-primary/5 text-primary">
                    <p className="text-3xl font-medium leading-none">{career.matchScore}%</p>
                    <p className="text-[10px] uppercase tracking-widest font-semibold mt-1">Match</p>
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
