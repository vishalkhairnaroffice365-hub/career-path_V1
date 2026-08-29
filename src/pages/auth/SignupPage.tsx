import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useCareer } from '../../context/CareerContext';
import { authApi } from '../../services/auth.api';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useCareer();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.register(name, email, password);
      localStorage.setItem('career_path_token', res.token);
      login(res.user);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden selection:bg-primary/10 selection:text-primary">
      {/* Left panel — Editorial Info */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 bg-surface-2 border-r border-border p-12">
        <Link to="/" className="inline-flex items-center gap-3 text-foreground">
          <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
            <span className="text-background text-sm leading-none">✦</span>
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">CareerPath</span>
        </Link>

        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl lg:text-5xl font-medium text-foreground mb-6 leading-[1.1] tracking-tight"
          >
            Find the work <br/>
            <span className="text-primary italic font-serif">you were meant to do.</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-4 text-muted-foreground text-sm lg:text-base border-l border-border pl-6 ml-2"
          >
            <p>Understand your unique strengths.</p>
            <p>Explore an interactive universe of careers.</p>
            <p>Build a clear roadmap to your future.</p>
          </motion.div>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10 bg-background">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-12 flex justify-center">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="text-2xl">✦</span>
              <span className="font-display font-bold text-xl">CareerPath</span>
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="font-display text-3xl font-medium text-foreground mb-2 tracking-tight">Create account</h1>
            <p className="text-muted-foreground text-sm">Let's discover your path together.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Your Name"
              type="text"
              placeholder="What should we call you?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User size={16} />}
              required
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              required
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              required
            />

            {error && (
              <p className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight size={18} />}
              className="mt-2"
            >
              Let's Begin
            </Button>
          </form>

          <p className="mt-8 text-center text-muted-foreground text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-foreground hover:text-primary font-medium transition-colors border-b border-transparent hover:border-primary pb-0.5">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
