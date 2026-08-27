import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Map, User, BookOpen, Trophy, Compass, Target, Layers, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Sky', to: '/sky', icon: <Compass size={18} />, requiresAuth: true },
  { label: 'Roadmap', to: '/roadmap', icon: <Map size={18} />, requiresAuth: true },
  { label: 'Resources', to: '/resources', icon: <BookOpen size={18} />, requiresAuth: true },
  { label: 'Projects', to: '/projects', icon: <Layers size={18} />, requiresAuth: true },
  { label: 'Progress', to: '/progress', icon: <Target size={18} />, requiresAuth: true },
  { label: 'Achievements', to: '/achievements', icon: <Trophy size={18} />, requiresAuth: true },
  { label: 'Profile', to: '/profile', icon: <User size={18} />, requiresAuth: true },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useCareer();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(to + '/');

  // Hide navbar on landing/auth pages
  const hiddenRoutes = ['/', '/login', '/signup', '/onboarding', '/analysis'];
  if (hiddenRoutes.some((r) => location.pathname === r || location.pathname.startsWith('/onboarding'))) {
    return null;
  }

  const visibleItems = navItems.filter((item) => !item.requiresAuth || isAuthenticated);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 hidden md:flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8 bg-surface/80 backdrop-blur-xl border border-border rounded-2xl px-6 py-3 shadow-editorial">
          {/* Logo */}
          <Link
            to={isAuthenticated ? '/sky' : '/'}
            className="flex items-center gap-2.5 text-foreground hover:text-primary transition-colors"
          >
            <span className="text-xl">✦</span>
            <span className="font-display font-bold text-base">CareerPath</span>
          </Link>

          {/* Nav items */}
          <div className="flex items-center gap-1">
            {visibleItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive(item.to)
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side: User avatar */}
        {isAuthenticated && (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 bg-surface/80 backdrop-blur-xl border border-border rounded-2xl px-4 py-3 hover:border-border/80 transition-all duration-200 shadow-editorial"
          >
            <span className="text-xl">{user.avatar}</span>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{user.progress.streak} day streak 🔥</p>
            </div>
          </button>
        )}
      </nav>

      {/* Mobile Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 md:hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-surface/90 backdrop-blur-xl border-b border-border">
          <Link to={isAuthenticated ? '/sky' : '/'} className="flex items-center gap-2">
            <span className="text-lg">✦</span>
            <span className="font-display font-bold text-sm">CareerPath</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-surface/95 backdrop-blur-xl border-b border-border py-2"
          >
            {visibleItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-200',
                  isActive(item.to)
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </nav>
    </>
  );
}
