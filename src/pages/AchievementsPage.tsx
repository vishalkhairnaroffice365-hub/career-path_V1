import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useCareer } from '../context/CareerContext';

export default function AchievementsPage() {
  const { user } = useCareer();
  const earned = user.achievements.filter(a => a.isEarned);
  const locked = user.achievements.filter(a => !a.isEarned);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 border-b border-border pb-8">
          <h1 className="font-display text-5xl md:text-6xl font-medium text-foreground tracking-tight mb-4">Achievements</h1>
          <p className="text-xl text-muted-foreground font-light">
            {earned.length} <span className="text-muted-foreground/60">of {user.achievements.length}</span> unlocked.
          </p>
        </motion.div>

        {/* Earned */}
        {earned.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-6 flex items-center gap-2 border-b border-border pb-2">
              Unlocked <span className="font-normal text-muted-foreground/60 ml-1">({earned.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8">
              {earned.map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex flex-col items-start border-l border-border pl-6"
                >
                  <span className="text-5xl block mb-4">{achievement.emoji}</span>
                  <p className="font-display font-medium text-xl text-foreground mb-2">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light mb-4">{achievement.description}</p>
                  {achievement.earnedAt && (
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-auto">
                      Earned {new Date(achievement.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-6 flex items-center gap-2 border-b border-border pb-2">
              Locked <span className="font-normal text-muted-foreground/60 ml-1">({locked.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8">
              {locked.map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className="flex flex-col items-start border-l border-border pl-6 opacity-40 grayscale"
                >
                  <div className="relative inline-block mb-4">
                    <span className="text-5xl block">{achievement.emoji}</span>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-background rounded-full flex items-center justify-center border border-border">
                      <Lock size={12} className="text-muted-foreground" />
                    </div>
                  </div>
                  <p className="font-display font-medium text-xl text-foreground mb-2">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
