import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { WowPanel } from './WowPanel';

export function WowButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-primary/30 bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/15 transition-all duration-200"
        title="WOW — Latest domain news"
      >
        <Sparkles size={15} />
        <span className="hidden sm:inline">WOW</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && <WowPanel onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
