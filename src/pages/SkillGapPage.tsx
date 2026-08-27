import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Lock, AlertCircle } from 'lucide-react';
import { skills } from '../data/skills';
import { careers } from '../data/careers';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { useCareer } from '../context/CareerContext';

const STATUS_CONFIG = {
  acquired: { icon: <CheckCircle size={16} className="text-success" />, label: 'Acquired', color: 'text-success', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  learning: { icon: <AlertCircle size={16} className="text-yellow-400" />, label: 'Learning', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  missing: { icon: <Lock size={16} className="text-danger" />, label: 'Missing', color: 'text-danger', bg: 'bg-red-500/10 border-red-500/20' },
};

export default function SkillGapPage() {
  const navigate = useNavigate();
  const { selectedCareer, user } = useCareer();

  const career = selectedCareer || careers[0];
  const requiredSkills = career.requiredSkillIds.map(id => skills.find(s => s.id === id)).filter(Boolean);
  const knownSkillIds = user.onboardingData?.currentSkills || ['html-css', 'javascript', 'git'];

  const getStatus = (skillId: string) => {
    if (knownSkillIds.includes(skillId)) return 'acquired';
    if (user.progress.inProgressNodeIds.length > 0) return 'learning';
    return 'missing';
  };

  const acquired = requiredSkills.filter(s => s && getStatus(s.id) === 'acquired').length;
  const gapPercent = Math.round((acquired / Math.max(requiredSkills.length, 1)) * 100);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 border-b border-border pb-8">
          <h1 className="font-display text-5xl md:text-6xl font-medium text-foreground tracking-tight mb-4">Skill Gap Analysis</h1>
          <p className="text-xl text-muted-foreground font-light">
            Mapping your path to becoming a <span className="text-foreground font-medium">{career.title}</span>.
          </p>
        </motion.div>

        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Overall Readiness</h2>
            <span className="font-display text-2xl font-medium text-primary">{gapPercent}%</span>
          </div>
          <Progress value={gapPercent} variant="primary" size="md" />
          
          <div className="grid grid-cols-3 gap-8 mt-10 border-t border-border pt-10">
            {[
              { label: 'Acquired', count: requiredSkills.filter(s => s && getStatus(s.id) === 'acquired').length, color: 'text-success' },
              { label: 'Learning', count: 0, color: 'text-yellow-400' },
              { label: 'Missing', count: requiredSkills.filter(s => s && getStatus(s.id) === 'missing').length, color: 'text-danger' },
            ].map(s => (
              <div key={s.label} className="border-l border-border pl-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{s.label}</p>
                <p className={`font-display text-3xl font-medium ${s.color}`}>{s.count}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skill list */}
        <div className="space-y-0 mb-16 border-t border-border">
          {requiredSkills.map((skill, i) => {
            if (!skill) return null;
            const status = getStatus(skill.id);
            const config = STATUS_CONFIG[status];
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
                className="flex flex-col md:flex-row md:items-center gap-4 py-6 border-b border-border"
              >
                <div className="flex items-center gap-4 md:w-1/3">
                  <span className="text-2xl">{skill.icon}</span>
                  <div>
                    <p className="font-medium text-foreground">{skill.name}</p>
                    <Badge variant={status === 'acquired' ? 'green' : status === 'learning' ? 'yellow' : 'default'} className="mt-1">
                      {config.label}
                    </Badge>
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">{skill.description}</p>
                </div>

                <div className="md:w-1/6 flex items-center justify-end gap-2 text-right">
                  {config.icon}
                  <p className="text-sm text-muted-foreground">{skill.learningTime}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <Button variant="gradient" size="xl" rightIcon={<ArrowRight size={18} />} onClick={() => navigate('/roadmap')}>
            Build My Learning Roadmap
          </Button>
        </div>
      </div>
    </div>
  );
}
