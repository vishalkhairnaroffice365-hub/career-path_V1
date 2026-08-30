import { useState, Suspense  } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, TrendingUp, Star } from 'lucide-react';
import { domains, type Domain, type SubDomain } from '../../data/domains';
import { careers } from '../../data/careers';
import { SkyScene, type CameraView } from '../../components/sky/SkyScene';
import { Button } from '../../components/ui/Button';
import { DemandBadge } from '../../components/ui/Badge';
import { useCareer } from '../../context/CareerContext';
import { useUI } from '../../context/UIContext';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DOMAIN INFO PANEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function DomainInfoPanel({ domain, onBack }: { domain: Domain; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute left-6 top-1/2 -translate-y-1/2 w-80 bg-black/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 text-white shadow-2xl"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-5"
      >
        <ArrowLeft size={14} />
        Back to Sky
      </button>

      <div className="mb-5">
        <span className="text-4xl block mb-2">{domain.icon}</span>
        <h2 className="font-display text-xl font-bold text-white">{domain.name}</h2>
        <p className="text-white/60 text-sm mt-1 leading-relaxed">{domain.tagline}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Avg Salary', value: domain.avgSalary },
          { label: 'Growth Rate', value: domain.growthRate },
          { label: 'Careers', value: `${domain.careerCount}` },
          { label: 'Sub-domains', value: `${domain.subDomains.length}` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <p className="text-xs text-white/50 mb-1">{stat.label}</p>
            <p className="font-display font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <p className="text-white/70 text-sm leading-relaxed mb-5">{domain.description}</p>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-white/40 mb-2 uppercase tracking-wider">Click a cloud to explore</p>
        {domain.subDomains.map((sub) => (
          <div key={sub.id} className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <span>{sub.icon}</span>
            <span className="text-sm text-white/90 font-medium">{sub.name}</span>
            <ChevronRight size={12} className="ml-auto text-white/40" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CAREER CARDS PANEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function CareerCardsPanel({
  subDomain,
  domain,
  onBack,
}: {
  subDomain: SubDomain;
  domain: Domain;
  onBack: () => void;
}) {
  const navigate = useNavigate();
  const { addToCompare, comparedCareers } = useCareer();
  const { addToast } = useUI();
  const subCareers = careers.filter((c) => subDomain.careerIds.includes(c.id));

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 32 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-6 top-1/2 -translate-y-1/2 w-80 space-y-4"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft size={14} />
        Back to {domain.name}
      </button>

      <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-4 border border-white/10 text-white">
        <p className="text-xs font-semibold text-white/50 mb-1 uppercase tracking-wider">{domain.name}</p>
        <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
          <span>{subDomain.icon}</span> {subDomain.name}
        </h2>
        <p className="text-sm text-white/70 mt-1">{subDomain.description}</p>
      </div>

      <div className="space-y-3 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {subCareers.map((career) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-2xl rounded-3xl p-5 border border-white/10 hover:border-white/30 transition-all duration-200 cursor-pointer group text-white"
            onClick={() => navigate(`/career/${career.id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-display font-bold text-white group-hover:text-primary transition-colors">
                  {career.title}
                </p>
                <p className="text-xs text-white/60 mt-0.5">{career.salary.mid}/yr · mid-level</p>
              </div>
              {career.matchScore && (
                <div className="flex items-center gap-1.5 bg-primary/20 border border-primary/30 rounded-full px-2.5 py-1">
                  <Star size={11} className="text-primary fill-primary" />
                  <span className="text-xs font-bold text-primary">{career.matchScore}%</span>
                </div>
              )}
            </div>

            <p className="text-xs text-white/70 leading-relaxed mb-3 line-clamp-2">
              {career.tagline}
            </p>

            <div className="flex items-center gap-2">
              <DemandBadge level={career.demandLevel} />
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <TrendingUp size={10} />
                {career.growthRate}
              </span>
            </div>

            <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="primary"
                size="xs"
                className="bg-white text-black hover:bg-white/90 border-0"
                onClick={() => navigate(`/career/${career.id}`)}
              >
                Explore
              </Button>
              <Button
                variant="outline"
                size="xs"
                className="text-white border-white/20 hover:bg-white/10"
                onClick={() => {
                  if (comparedCareers.length < 3) {
                    addToCompare(career);
                    addToast({ type: 'success', message: `${career.title} added to compare` });
                  } else {
                    addToast({ type: 'warning', message: 'You can compare up to 3 careers' });
                  }
                }}
              >
                Compare
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SKY HEADER HUD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function SkyHUD({ view }: { view: CameraView }) {
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
      <div className="bg-black/40 backdrop-blur-2xl rounded-2xl px-5 py-2.5 border border-white/10 flex items-center gap-4 text-white shadow-lg">
        <span className="text-sm font-medium text-white">
          {view === 'SKY_VIEW' ? '🌌 Career Sky' : view === 'DOMAIN_VIEW' ? '🔍 Exploring Domain' : '💫 Career View'}
        </span>
        <div className="w-px h-4 bg-white/20" />
        <span className="text-xs text-white/60 tracking-wider uppercase">{domains.length} domains · click a cloud to explore</span>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPARE BAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function CompareBar() {
  const { comparedCareers, clearCompare } = useCareer();
  const navigate = useNavigate();

  if (comparedCareers.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      exit={{ y: 80 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
    >
      <div className="bg-black/40 backdrop-blur-2xl rounded-2xl px-5 py-3 border border-white/10 flex items-center gap-4 text-white shadow-lg">
        <span className="text-sm text-white/60">Comparing:</span>
        {comparedCareers.map((c) => (
          <span key={c.id} className="text-sm font-medium text-white">{c.title}</span>
        ))}
        <Button size="xs" variant="primary" className="bg-white text-black hover:bg-white/90 border-0" onClick={() => navigate('/compare')}>
          Compare Now
        </Button>
        <Button size="xs" variant="outline" className="text-white border-white/20 hover:bg-white/10" onClick={clearCompare}>
          Clear
        </Button>
      </div>
    </motion.div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CAREER SKY PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function CareerSkyPage() {
  const [cameraView, setCameraView] = useState<CameraView>('SKY_VIEW');
  const [activeDomainId, setActiveDomainId] = useState<string | null>(null);
  const [activeSubDomainId, setActiveSubDomainId] = useState<string | null>(null);
  const { selectCareer } = useCareer();
  const navigate = useNavigate();

  const activeDomain = domains.find((d) => d.id === activeDomainId) || null;
  const activeSubDomain = activeDomain?.subDomains.find((s) => s.id === activeSubDomainId) || null;

  const handleDomainClick = (domain: Domain) => {
    setActiveDomainId(domain.id);
    setActiveSubDomainId(null);
    setCameraView('DOMAIN_VIEW');
  };

  const handleSubDomainClick = (subDomain: SubDomain, _domain: Domain) => {
    setActiveSubDomainId(subDomain.id);
    
    // Select the first career in this sub-domain for the roadmap
    if (subDomain.careerIds.length > 0) {
      const careerToSelect = careers.find(c => c.id === subDomain.careerIds[0]);
      if (careerToSelect) {
        selectCareer(careerToSelect);
      }
    }
    
    navigate('/roadmap');
  };

  const handleExitToSky = () => {
    setActiveDomainId(null);
    setActiveSubDomainId(null);
    setCameraView('SKY_VIEW');
  };

  const handleExitToDomain = () => {
    setActiveSubDomainId(null);
    setCameraView('DOMAIN_VIEW');
  };

  // Dynamic sky background
  const skyBg = activeDomain
    ? activeDomain.theme.atmosphere
    : 'radial-gradient(ellipse at top, #0a1020 0%, #020817 70%)';

  return (
    <div className="w-full h-screen overflow-hidden relative" style={{ background: skyBg }}>
      {/* 3D Canvas */}
      <Canvas
        shadows={false}
        gl={{ antialias: true, alpha: false }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          <SkyScene
            domains={domains}
            cameraView={cameraView}
            activeDomainId={activeDomainId}
            onDomainClick={handleDomainClick}
            onSubDomainClick={handleSubDomainClick}
          />
        </Suspense>
      </Canvas>

      {/* HUD overlay */}
      <SkyHUD view={cameraView} />

      {/* Domain Info Panel */}
      <AnimatePresence>
        {cameraView === 'DOMAIN_VIEW' && activeDomain && !activeSubDomain && (
          <DomainInfoPanel key="domain-panel" domain={activeDomain} onBack={handleExitToSky} />
        )}
      </AnimatePresence>

      {/* Career Cards Panel */}
      <AnimatePresence>
        {cameraView === 'CAREER_VIEW' && activeSubDomain && activeDomain && (
          <CareerCardsPanel
            key="career-panel"
            subDomain={activeSubDomain}
            domain={activeDomain}
            onBack={handleExitToDomain}
          />
        )}
      </AnimatePresence>

      {/* Compare bar */}
      <AnimatePresence>
        <CompareBar />
      </AnimatePresence>

      {/* Touch overlay hint for mobile */}
      {cameraView === 'SKY_VIEW' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/60 pointer-events-none">
          Tap a cloud to explore
        </div>
      )}
    </div>
  );
}
