import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

type BadgeVariant = 'primary' | 'cyan' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  green: 'bg-success/15 text-emerald-300 border-emerald-500/30',
  orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  red: 'bg-red-500/20 text-red-300 border-red-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  default: 'bg-surface-2 text-muted-foreground border-border',
};

export function Badge({ variant = 'default', children, className, icon }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border',
        variantClasses[variant],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

// Demand level badge
interface DemandBadgeProps {
  level: 'explosive' | 'high' | 'moderate' | 'stable';
}

const demandConfig = {
  explosive: { variant: 'green' as BadgeVariant, label: '🚀 Explosive Growth', pulse: true },
  high: { variant: 'cyan' as BadgeVariant, label: '📈 High Demand', pulse: false },
  moderate: { variant: 'yellow' as BadgeVariant, label: '📊 Moderate Demand', pulse: false },
  stable: { variant: 'default' as BadgeVariant, label: '📌 Stable Demand', pulse: false },
};

export function DemandBadge({ level }: DemandBadgeProps) {
  const config = demandConfig[level];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border', variantClasses[config.variant])}>
      {config.pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      )}
      {config.label}
    </span>
  );
}

// Work style badge
interface WorkStyleBadgeProps {
  style: 'remote-first' | 'hybrid' | 'onsite';
}

const workStyleConfig = {
  'remote-first': { variant: 'purple' as BadgeVariant, label: '🌍 Remote-First' },
  'hybrid': { variant: 'cyan' as BadgeVariant, label: '🏢 Hybrid' },
  'onsite': { variant: 'orange' as BadgeVariant, label: '🏙️ Onsite' },
};

export function WorkStyleBadge({ style }: WorkStyleBadgeProps) {
  const config = workStyleConfig[style];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border', variantClasses[config.variant])}>
      {config.label}
    </span>
  );
}
