import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, TrendingUp, DollarSign, Clock, Globe, Star, CheckCircle, XCircle, Plus, ChevronRight
} from 'lucide-react';
import { careers } from '../data/careers';
import { domains } from '../data/domains';
import { Button } from '../components/ui/Button';
import { Badge, DemandBadge, WorkStyleBadge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { useCareer } from '../context/CareerContext';
import { useUI } from '../context/UIContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

export default function CareerDetailsPage() {
  const { careerId } = useParams<{ careerId: string }>();
  const navigate = useNavigate();
  const { selectCareer, addToCompare, comparedCareers } = useCareer();
  const { addToast } = useUI();
  const [activeTab, setActiveTab] = useState<'overview' | 'dayinlife' | 'skills'>('overview');

  const career = careers.find((c) => c.id === careerId);
  const domain = career ? domains.find((d) => d.id === career.domainId) : null;

  if (!career || !domain) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl block mb-4">🔍</span>
          <h1 className="text-xl font-bold text-foreground mb-2">Career not found</h1>
          <Button variant="primary" onClick={() => navigate('/sky')}>Back to Sky</Button>
        </div>
      </div>
    );
  }

  const handleSelect = () => {
    selectCareer(career);
    addToast({ type: 'success', message: `${career.title} selected as your career path!` });
    navigate('/skill-gap');
  };

  const handleCompare = () => {
    if (comparedCareers.length >= 3) {
      addToast({ type: 'warning', message: 'You can compare up to 3 careers' });
      return;
    }
    addToCompare(career);
    addToast({ type: 'info', message: `${career.title} added to comparison` });
  };

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28">
      {/* Hero */}
      <div className="relative py-24 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto relative z-10">
          <button
            onClick={() => navigate('/sky')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-12 uppercase tracking-wider font-semibold"
          >
            <ArrowLeft size={14} /> Back to Career Sky
          </button>

          <div className="flex flex-col md:flex-row md:items-start gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-primary font-medium tracking-wide uppercase text-sm border-b border-primary/30 pb-1">{domain.name}</span>
                <DemandBadge level={career.demandLevel} />
              </div>

              <h1 className="font-display text-5xl md:text-7xl font-medium text-foreground mb-6 tracking-tight leading-none">
                {career.title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed font-light">{career.tagline}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <WorkStyleBadge style={career.workStyle} />
                <span className="flex items-center gap-2">
                  <Clock size={16} /> Ready in {career.timeToReady}
                </span>
                <span className="flex items-center gap-2 text-foreground">
                  <TrendingUp size={16} /> {career.growthRate} growth
                </span>
              </div>
            </div>

            {/* CTA Column */}
            <div className="md:w-72 space-y-4">
              {career.matchScore && (
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Match Score</p>
                  <p className="text-5xl font-display font-medium text-primary">{career.matchScore}%</p>
                </div>
              )}

              <Button variant="primary" size="lg" fullWidth onClick={handleSelect}>
                Choose This Path
              </Button>
              <Button variant="outline" size="lg" fullWidth onClick={handleCompare} leftIcon={<Plus size={16} />}>
                Add to Compare
              </Button>
              <Button variant="ghost" size="lg" fullWidth onClick={() => navigate('/compare')}>
                View Comparison
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-16">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-6 flex items-center gap-2">
            <DollarSign size={16} /> Salary Range
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Entry Level', value: career.salary.entry },
              { label: 'Mid Level', value: career.salary.mid },
              { label: 'Senior Level', value: career.salary.senior },
            ].map((s) => (
              <div key={s.label} className="border-l border-border pl-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{s.label}</p>
                <p className="font-display text-3xl font-medium text-foreground">{s.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-8 mb-12 border-b border-border pb-px">
          {(['overview', 'dayinlife', 'skills'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'overview' ? 'Overview' : tab === 'dayinlife' ? 'Day in the Life' : 'Key Skills'}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-16">
            <div>
              <h3 className="text-2xl font-display font-medium text-foreground mb-6">About this career</h3>
              <p className="text-lg text-muted-foreground leading-relaxed font-light">{career.description}</p>
            </div>
            
            <div className="editorial-divider" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h3 className="text-lg font-display font-medium text-foreground mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">✓</span> 
                  Pros
                </h3>
                <ul className="space-y-4">
                  {career.pros.map((pro) => (
                    <li key={pro} className="text-muted-foreground leading-relaxed">{pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-display font-medium text-foreground mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-surface-2 text-muted-foreground flex items-center justify-center">×</span> 
                  Challenges
                </h3>
                <ul className="space-y-4">
                  {career.cons.map((con) => (
                    <li key={con} className="text-muted-foreground leading-relaxed">{con}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="editorial-divider" />
            
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-6 flex items-center gap-2">
                <Globe size={16} /> Companies Hiring
              </h3>
              <div className="flex flex-wrap gap-3">
                {career.companies.map((c) => (
                  <span key={c} className="px-4 py-2 border border-border rounded-full text-sm text-foreground bg-surface">{c}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'dayinlife' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <h3 className="text-2xl font-display font-medium text-foreground mb-10">A typical day as a {career.title}</h3>
            <div className="relative pl-8 md:pl-12 border-l border-border space-y-10">
              {career.dayInLife.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[37px] md:-left-[53px] w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                  <p className="text-lg text-muted-foreground leading-relaxed font-light">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'skills' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <h3 className="text-2xl font-display font-medium text-foreground mb-10">Key Skills to Master</h3>
            <div className="space-y-8 max-w-2xl">
              {career.keySkills.map((skill, i) => (
                <div key={skill}>
                  <div className="flex justify-between text-base mb-3">
                    <span className="text-foreground font-medium">{skill}</span>
                    <span className="text-muted-foreground uppercase text-xs tracking-wider font-semibold">{['Critical', 'Important', 'Helpful'][i % 3]}</span>
                  </div>
                  <Progress value={100 - i * 8} variant={i === 0 ? 'primary' : 'default'} size="sm" />
                </div>
              ))}
            </div>
            <div className="mt-12">
              <Button
                variant="outline"
                size="lg"
                rightIcon={<ChevronRight size={16} />}
                onClick={() => navigate('/skill-gap')}
              >
                See My Skill Gap
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
