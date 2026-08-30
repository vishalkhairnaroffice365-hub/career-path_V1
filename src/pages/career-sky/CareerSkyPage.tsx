import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Sparkles, Compass } from 'lucide-react';
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
function DomainInfoPanel({
  domain,
  onBack,
  onSelectSubDomain,
}: {
  domain: Domain;
  onBack: () => void;
  onSelectSubDomain: (sub: SubDomain) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute left-6 top-1/2 -translate-y-1/2 w-84 max-h-[85vh] overflow-y-auto bg-black/65 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 text-white shadow-2xl z-30 custom-scrollbar"
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
            <p className="font-display font-bold text-white text-sm">{stat.value}</p>
          </div>
        ))}
      </div>

      <p className="text-white/70 text-xs leading-relaxed mb-5">{domain.description}</p>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-white/40 mb-2 uppercase tracking-wider">Sub-Domains</p>
        {domain.subDomains.map((sub) => (
          <div
            key={sub.id}
            onClick={() => onSelectSubDomain(sub)}
            className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/15 hover:border-white/20 transition-all cursor-pointer group"
          >
            <span>{sub.icon}</span>
            <span className="text-sm text-white/90 font-medium group-hover:text-white">{sub.name}</span>
            <ChevronRight size={14} className="ml-auto text-white/40 group-hover:text-white transition-colors" />
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
  const { addToCompare, selectCareer } = useCareer();
  const { addToast } = useUI();
  const subCareers = careers.filter((c) => subDomain.careerIds.includes(c.id));

  const handleSelect = async (career: any) => {
    await selectCareer(career);
    addToast({ type: 'success', message: `${career.title} chosen as active path! 🎯` });
    navigate('/skill-gap');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 32 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-6 top-1/2 -translate-y-1/2 w-92 max-h-[85vh] overflow-y-auto space-y-4 z-30 p-1 custom-scrollbar"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-2"
      >
        <ArrowLeft size={14} />
        Back to {domain.name}
      </button>

      <div className="bg-black/65 backdrop-blur-2xl rounded-3xl p-5 border border-white/10 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{subDomain.icon}</span>
          <div>
            <h3 className="font-display font-bold text-white text-lg">{subDomain.name}</h3>
            <p className="text-xs text-white/60">{subCareers.length} career paths available</p>
          </div>
        </div>
        <p className="text-xs text-white/70 mt-2">{subDomain.description}</p>
      </div>

      <div className="space-y-3">
        {subCareers.map((career) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/70 backdrop-blur-2xl rounded-2xl p-4 border border-white/10 text-white space-y-3 hover:border-white/20 transition-colors shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{career.emoji}</span>
                <div>
                  <h4 className="font-display font-semibold text-white text-sm">{career.title}</h4>
                  <p className="text-xs text-white/50">{career.salary.mid}/yr avg · {career.growthRate}</p>
                </div>
              </div>
              <DemandBadge demand={career.demandLevel || (career as any).demand} />
            </div>

            <p className="text-xs text-white/70 line-clamp-2">{career.description}</p>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <Button
                size="xs"
                variant="primary"
                onClick={() => handleSelect(career)}
                className="flex-1 bg-white text-black hover:bg-white/90 font-medium text-xs"
              >
                Choose Path
              </Button>
              <Button
                size="xs"
                variant="outline"
                onClick={() => navigate(`/roadmap?careerId=${career.id}`)}
                className="text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/10 text-xs"
              >
                Roadmap
              </Button>
              <Button
                size="xs"
                variant="outline"
                onClick={() => {
                  addToCompare(career);
                  addToast({ type: 'info', message: `Added ${career.title} to comparison` });
                }}
                className="text-white border-white/20 hover:bg-white/10 text-xs"
              >
                Compare
              </Button>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => navigate(`/career/${career.id}`)}
                className="text-white/70 hover:text-white text-xs"
              >
                Details
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
  const navigate = useNavigate();

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
      <div className="bg-black/60 backdrop-blur-2xl rounded-2xl px-5 py-2.5 border border-white/10 flex items-center gap-4 text-white shadow-xl">
        <span className="text-sm font-medium text-white flex items-center gap-1.5">
          <Compass size={16} className="text-cyan-400" />
          {view === 'SKY_VIEW' ? '🌌 Career Sky' : view === 'DOMAIN_VIEW' ? '🔍 Exploring Domain' : '💫 Career View'}
        </span>
        <div className="w-px h-4 bg-white/20" />
        <span className="text-xs text-white/60 tracking-wider uppercase hidden sm:inline">
          {domains.length} domains · Drag to rotate · Click cloud to explore
        </span>
        <Button
          size="xs"
          variant="primary"
          onClick={() => navigate('/select-career')}
          className="ml-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600 border-0 flex items-center gap-1.5"
        >
          <Sparkles size={12} />
          Choose Path
        </Button>
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
      className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-2xl rounded-2xl px-5 py-3 border border-white/10 flex items-center gap-4 text-white z-30 shadow-2xl"
    >
      <div className="flex items-center gap-2">
        {comparedCareers.map((c) => (
          <span key={c.id} className="text-lg" title={c.title}>
            {c.emoji}
          </span>
        ))}
      </div>
      <span className="text-sm text-white/70 font-medium">
        {comparedCareers.length} career{comparedCareers.length > 1 ? 's' : ''} in comparison
      </span>
      <div className="flex items-center gap-2">
        <Button
          size="xs"
          variant="primary"
          onClick={() => navigate('/compare')}
          className="bg-white text-black hover:bg-white/90"
        >
          Compare Now
        </Button>
        <button
          onClick={clearCompare}
          className="text-xs text-white/40 hover:text-white/70 transition-colors px-2 py-1"
        >
          Clear
        </button>
      </div>
    </motion.div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN CAREER SKY PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function CareerSkyPage() {
  const [cameraView, setCameraView] = useState<CameraView>('SKY_VIEW');
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);
  const [activeSubDomain, setActiveSubDomain] = useState<SubDomain | null>(null);

  const handleDomainClick = (domain: Domain) => {
    setActiveDomain(domain);
    setActiveSubDomain(null);
    setCameraView('DOMAIN_VIEW');
  };

  const handleSubDomainClick = (subDomain: SubDomain, domain: Domain) => {
    setActiveDomain(domain);
    setActiveSubDomain(subDomain);
  };

  const handleBackToSky = () => {
    setActiveDomain(null);
    setActiveSubDomain(null);
    setCameraView('SKY_VIEW');
  };

  const handleBackToDomain = () => {
    setActiveSubDomain(null);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-[#020817] overflow-hidden select-none">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 3, 22], fov: 50, near: 0.1, far: 1000 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'default',
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.warn('WebGL context lost, restoring...');
          });
          gl.domElement.addEventListener('webglcontextrestored', () => {
            console.log('WebGL context restored successfully.');
          });
        }}
      >
        <Suspense fallback={null}>
          <SkyScene
            domains={domains}
            cameraView={cameraView}
            activeDomainId={activeDomain?.id || null}
            onDomainClick={handleDomainClick}
            onSubDomainClick={handleSubDomainClick}
          />
        </Suspense>
      </Canvas>

      {/* Top HUD */}
      <SkyHUD view={cameraView} />

      {/* Domain Info Panel (Left) */}
      <AnimatePresence>
        {cameraView === 'DOMAIN_VIEW' && activeDomain && !activeSubDomain && (
          <DomainInfoPanel
            domain={activeDomain}
            onBack={handleBackToSky}
            onSelectSubDomain={(sub) => setActiveSubDomain(sub)}
          />
        )}
      </AnimatePresence>

      {/* Career Cards Panel (Right) */}
      <AnimatePresence>
        {activeSubDomain && activeDomain && (
          <CareerCardsPanel
            subDomain={activeSubDomain}
            domain={activeDomain}
            onBack={handleBackToDomain}
          />
        )}
      </AnimatePresence>

      {/* Compare Bar */}
      <AnimatePresence>
        <CompareBar />
      </AnimatePresence>
    </div>
  );
}
