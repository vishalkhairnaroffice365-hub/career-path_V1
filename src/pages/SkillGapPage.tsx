import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Lock, AlertCircle } from 'lucide-react';
import { skills as fallbackSkills } from '../data/skills';
import { careers as fallbackCareers } from '../data/careers';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { useCareer } from '../context/CareerContext';
import { skillApi, type SkillGapAnalysis } from '../services/skill.api';

const STATUS_CONFIG = {
  acquired: {
    icon: <CheckCircle size={16} className="text-success" />,
    label: 'Acquired',
    color: 'text-success',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  learning: {
    icon: <AlertCircle size={16} className="text-yellow-400" />,
    label: 'Learning',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
  },
  missing: {
    icon: <Lock size={16} className="text-danger" />,
    label: 'Missing',
    color: 'text-danger',
    bg: 'bg-red-500/10 border-red-500/20',
  },
};

export default function SkillGapPage() {
  const navigate = useNavigate();
  const { selectedCareer, user } = useCareer();

  const career = selectedCareer || fallbackCareers[0];
  const [gapData, setGapData] = useState<SkillGapAnalysis | null>(null);

  useEffect(() => {
    async function loadSkillGap() {
      if (!career) return;
      try {
        const data = await skillApi.getSkillGap(career.id);
        if (data) {
          setGapData(data);
        }
      } catch (err) {
        console.warn('Could not fetch live skill gap analysis, calculating locally:', err);
      }
    }

    loadSkillGap();
  }, [career]);

  const requiredSkills = career.requiredSkillIds
    .map((id) => fallbackSkills.find((s) => s.id === id))
    .filter(Boolean);
  const knownSkillIds = user.onboardingData?.currentSkills || ['html-css', 'javascript', 'git'];

  const getStatus = (skillId: string) => {
    if (gapData) {
      const match = gapData.skills.find((s) => s.skill.id === skillId);
      if (match) return match.status;
    }
    if (knownSkillIds.includes(skillId) || user.progress.completedNodeIds.includes(skillId))
      return 'acquired';
    if (user.progress.inProgressNodeIds.includes(skillId)) return 'learning';
    return 'missing';
  };

  const acquiredCount =
    gapData?.counts.acquired ??
    requiredSkills.filter((s) => s && getStatus(s.id) === 'acquired').length;
  const learningCount =
    gapData?.counts.learning ??
    requiredSkills.filter((s) => s && getStatus(s.id) === 'learning').length;
  const missingCount =
    gapData?.counts.missing ??
    requiredSkills.filter((s) => s && getStatus(s.id) === 'missing').length;
  const totalCount = gapData?.counts.total ?? Math.max(requiredSkills.length, 1);
  const gapPercent = gapData?.overallReadiness ?? Math.round((acquiredCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-border pb-8"
        >
          <h1 className="font-display text-5xl md:text-6xl font-medium text-foreground tracking-tight mb-4">
            Skill Gap Analysis
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Mapping your path to becoming a{' '}
            <span className="text-foreground font-medium">{career.title}</span>.
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
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Overall Readiness
            </h2>
            <span className="font-display text-2xl font-medium text-primary">{gapPercent}%</span>
          </div>
          <Progress value={gapPercent} variant="primary" size="md" />

          <div className="grid grid-cols-3 gap-8 mt-10 border-t border-border pt-10">
            {[
              { label: 'Acquired', count: acquiredCount, color: 'text-success' },
              { label: 'Learning', count: learningCount, color: 'text-yellow-400' },
              { label: 'Missing', count: missingCount, color: 'text-danger' },
            ].map((s) => (
              <div key={s.label} className="border-l border-border pl-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  {s.label}
                </p>
                <p className={`font-display text-3xl font-medium ${s.color}`}>{s.count}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills list */}
        <div className="space-y-4 mb-12">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-6">
            Required Competencies
          </h2>
          {requiredSkills.map((skill, i) => {
            if (!skill) return null;
            const status = getStatus(skill.id);
            const cfg = STATUS_CONFIG[status];

            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-5 border border-border rounded-2xl flex items-center justify-between hover:bg-surface/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-surface rounded-xl border border-border">{cfg.icon}</div>
                  <div>
                    <h3 className="font-display font-medium text-foreground text-lg">{skill.name}</h3>
                    <p className="text-sm text-muted-foreground font-light">{skill.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="default" className="text-xs bg-surface border-border">
                    {skill.category}
                  </Badge>
                  <span
                    className={`text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}
                  >
                    {cfg.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-end pt-8 border-t border-border">
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight size={18} />}
            onClick={() => navigate('/roadmap')}
          >
            Start Learning Roadmap
          </Button>
        </div>
      </div>
    </div>
  );
}
