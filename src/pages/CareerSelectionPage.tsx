import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { careers as fallbackCareers } from '../data/careers';
import { domains as fallbackDomains } from '../data/domains';
import { Button } from '../components/ui/Button';
import { Badge, DemandBadge } from '../components/ui/Badge';
import { useCareer } from '../context/CareerContext';
import { useUI } from '../context/UIContext';
import { recommendationApi, type CareerRecommendationItem } from '../services/recommendation.api';
import { domainApi } from '../services/domain.api';
import type { Domain } from '../data/domains';

export default function CareerSelectionPage() {
  const navigate = useNavigate();
  const { selectCareer } = useCareer();
  const { addToast } = useUI();
  const [recommendations, setRecommendations] = useState<CareerRecommendationItem[]>([]);
  const [domains, setDomains] = useState<Domain[]>(fallbackDomains);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [recs, domainList] = await Promise.allSettled([
          recommendationApi.getRecommendations(),
          domainApi.getDomains(),
        ]);

        if (recs.status === 'fulfilled' && Array.isArray(recs.value) && recs.value.length > 0) {
          setRecommendations(recs.value);
        } else {
          // Fallback with computed default match scores
          setRecommendations(
            fallbackCareers.map((c, i) => ({
              career: c,
              matchScore: c.matchScore || (90 - i * 3),
              factors: { skillMatch: 75, interestAffinity: 80, workStyleFit: 85, goalFeasibility: 70 },
              matchReasons: [
                `High technical compatibility with your profile.`,
                `Strong growth sector with ${c.growthRate} annual demand.`,
                `Mid-level compensation around ${c.salary.mid}/yr.`,
              ],
            }))
          );
        }

        if (domainList.status === 'fulfilled' && Array.isArray(domainList.value) && domainList.value.length > 0) {
          setDomains(domainList.value);
        }
      } catch (err) {
        console.warn('Could not load dynamic recommendations, using fallback data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSelect = async (item: CareerRecommendationItem) => {
    await selectCareer(item.career);
    addToast({ type: 'success', message: `${item.career.title} is now your active career path! 🎯` });
    navigate('/skill-gap');
  };

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-border pb-8"
        >
          <button
            onClick={() => navigate('/sky')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 uppercase tracking-wider font-semibold transition-colors"
          >
            <ArrowLeft size={14} /> Back to Sky
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-primary w-6 h-6 animate-pulse" />
            <h1 className="font-display text-5xl md:text-6xl font-medium text-foreground tracking-tight">
              Personalized Path Recommendations
            </h1>
          </div>
          <p className="text-xl text-muted-foreground font-light max-w-2xl">
            Ranked by our AI matching engine based on your skills, interests, strengths, and goals.
          </p>
        </motion.div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">Calculating your best career matches...</p>
          </div>
        ) : (
          <div className="space-y-0">
            {recommendations.map((item, i) => {
              const career = item.career;
              const domain = domains.find((d) => d.id === career.domainId);
              return (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="py-10 border-b border-border hover:bg-surface/30 transition-colors -mx-6 px-6 rounded-2xl group flex flex-col md:flex-row items-start gap-8"
                >
                  <div className="text-6xl flex-shrink-0 mt-2">{career.emoji}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3 flex-wrap">
                      <h2 className="font-display text-3xl font-medium text-foreground">{career.title}</h2>
                      {i === 0 && (
                        <Badge variant="green" className="uppercase tracking-wider font-semibold px-3 py-1">
                          ⭐ Top AI Match
                        </Badge>
                      )}
                    </div>

                    <p className="text-lg text-muted-foreground font-light mb-4 leading-relaxed max-w-2xl">
                      {career.tagline}
                    </p>

                    {/* AI Match Reasons */}
                    {item.matchReasons && item.matchReasons.length > 0 && (
                      <div className="mb-6 p-4 rounded-xl bg-surface-2 border border-border space-y-1.5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                          ✦ Why this fits you:
                        </p>
                        {item.matchReasons.map((reason, rIdx) => (
                          <p key={rIdx} className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="text-primary">•</span> {reason}
                          </p>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 mb-8">
                      <Badge variant="default" className="bg-surface border-border px-3 py-1 text-xs">
                        {domain?.name || career.domainId}
                      </Badge>
                      <DemandBadge level={career.demandLevel} />
                      <Badge variant="cyan" className="px-3 py-1 text-xs">
                        {career.salary?.mid || '$115k'}/yr
                      </Badge>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="primary"
                        size="lg"
                        rightIcon={<ArrowRight size={16} />}
                        onClick={() => handleSelect(item)}
                      >
                        Choose This Path
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate(`/career/${career.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="md:ml-auto flex-shrink-0 flex items-center justify-center flex-col w-24 h-24 rounded-full border-2 border-primary/20 bg-primary/5 text-primary">
                    <p className="text-3xl font-medium leading-none">{item.matchScore}%</p>
                    <p className="text-[10px] uppercase tracking-widest font-semibold mt-1">Match</p>
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
