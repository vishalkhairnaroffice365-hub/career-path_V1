import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useCareer } from '../../context/CareerContext';
import { useUI } from '../../context/UIContext';
import { authApi } from '../../services/auth.api';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useCareer();
  const { addToast } = useUI();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem('career_path_token', res.token);
      login(res.user);
      addToast({ type: 'success', message: "Welcome back! Let's explore your possibilities." });
      navigate(res.user.onboardingCompleted ? '/sky' : '/onboarding');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative overflow-hidden selection:bg-primary/10 selection:text-primary">
      {/* Decorative left panel for editorial feel */}
      <div className="hidden md:flex md:w-5/12 bg-surface-2 p-12 flex-col justify-between border-r border-border">
        <Link to="/" className="inline-flex items-center gap-3 text-foreground">
          <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
            <span className="text-background text-sm leading-none">✦</span>
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">CareerPath</span>
        </Link>

        <div>
          <h2 className="font-display text-4xl font-medium leading-tight mb-4 text-foreground">
            Continue your <br />
            <span className="text-primary italic font-serif">exploration.</span>
          </h2>
          <p className="text-muted-foreground">Your career universe is waiting.</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm"
        >
          {/* Mobile Logo */}
          <div className="md:hidden mb-12 flex justify-center">
            <Link to="/" className="inline-flex items-center gap-2.5 text-foreground">
              <span className="text-2xl">✦</span>
              <span className="font-display font-bold text-xl">CareerPath</span>
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="font-display text-3xl font-medium text-foreground mb-2 tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to continue discovering your path.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Your password"
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

          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-foreground hover:text-primary font-medium transition-colors border-b border-transparent hover:border-primary pb-0.5"
              >
                Create one free
              </Link>
            </p>
          </div>

          {/* Demo hint */}
          <div className="mt-8 p-4 rounded-xl bg-surface-2 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              💡 Demo: Enter any email and password to explore the app
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
