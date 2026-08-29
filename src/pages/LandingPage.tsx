import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden selection:bg-primary/10 selection:text-primary">
      {/* Soft warm abstract background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex items-center gap-3 text-foreground"
        >
          <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
            <span className="text-background text-sm leading-none">✦</span>
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">CareerPath</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex items-center gap-6"
        >
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </button>
          <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
            Begin Journey
          </Button>
        </motion.div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-surface text-muted-foreground text-xs font-medium tracking-wide uppercase">
              <Sparkles size={14} className="text-accent" />
              <span>A new way to explore</span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-display text-display-xl lg:text-display-2xl font-medium text-foreground mb-8 leading-[1.05] tracking-tight"
          >
            Your future isn't <br className="hidden sm:block" />
            <span className="italic text-primary font-serif pr-2">one path.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-14 leading-relaxed font-light"
          >
            Discover who you are and where you belong. Not through a dashboard of metrics, 
            but through an immersive journey into your possible futures.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row gap-6 items-center justify-center"
          >
            <Button
              variant="primary"
              size="xl"
              onClick={() => navigate('/signup')}
              className="px-10 py-5 rounded-full"
            >
              Discover My Path
            </Button>
            <button
              onClick={() => navigate('/login')}
              className="group flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
            >
              <span>Explore Possibilities</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </main>

      {/* Editorial Feature Section */}
      <section className="relative z-10 py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-4xl lg:text-5xl font-medium text-foreground mb-8 leading-tight">
                Before we find your path, <br/>
                <span className="text-muted-foreground italic font-serif">we understand you.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md">
                A career isn't just about what you know. It's about how you work, what naturally pulls your attention, and what you want your life to become.
              </p>
              <Button variant="outline" size="lg" className="rounded-full" onClick={() => navigate('/signup')}>
                Let's Begin
              </Button>
            </motion.div>

            {/* Abstract visual representation instead of a "dashboard screenshot" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] bg-surface-2 overflow-hidden border border-border flex items-center justify-center"
            >
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-border/50 to-transparent opacity-50" />
               <div className="relative z-10 w-48 h-64 rounded-full bg-white shadow-editorial-lg flex flex-col items-center justify-center border border-border p-8 text-center rotate-[-6deg] hover:rotate-0 transition-transform duration-700">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <span className="text-primary text-xl">✦</span>
                  </div>
                  <h3 className="font-display font-medium text-xl text-foreground mb-2">Curious</h3>
                  <p className="text-xs text-muted-foreground">Natural problem solver drawn to complex systems.</p>
               </div>
               
               <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-accent/10 blur-[60px]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-background py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-60">
            <span className="text-lg leading-none">✦</span>
            <span className="font-display font-medium tracking-tight">CareerPath</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} CareerPath. Explore your possibilities.
          </p>
        </div>
      </footer>
    </div>
  );
}
