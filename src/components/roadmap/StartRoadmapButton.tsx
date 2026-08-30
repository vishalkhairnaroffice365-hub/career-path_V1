import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

interface StartRoadmapButtonProps {
  onStart: () => void;
}

export function StartRoadmapButton({ onStart }: StartRoadmapButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-2xl bg-surface/60 backdrop-blur-sm mb-12"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
        <Rocket size={28} className="text-primary" />
      </div>
      <h3 className="font-display text-2xl font-medium text-foreground mb-2">Ready to begin?</h3>
      <p className="text-muted-foreground font-light mb-8 text-center max-w-sm">
        Start your roadmap to begin structured learning with courses, assessments, and projects.
      </p>
      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-primary text-primary-foreground rounded-2xl font-semibold text-sm tracking-wide hover:opacity-90 transition-all duration-200 shadow-editorial"
      >
        <Rocket size={18} />
        Start Roadmap
      </motion.button>
    </motion.div>
  );
}
