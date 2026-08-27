import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

interface ProgressProps {
  value: number; // 0-100
  label?: string;
  showValue?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'green' | 'orange' | 'rainbow';
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

const variantClasses = {
  primary: 'bg-gradient-to-r from-indigo-500 to-violet-500',
  green: 'bg-gradient-to-r from-emerald-500 to-teal-500',
  orange: 'bg-gradient-to-r from-orange-500 to-amber-500',
  rainbow: 'bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500',
};

export function Progress({
  value,
  label,
  showValue = false,
  size = 'md',
  variant = 'primary',
  className,
  animated = true,
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-muted-foreground">{label}</span>}
          {showValue && (
            <span className="text-sm font-semibold text-foreground">{Math.round(clampedValue)}%</span>
          )}
        </div>
      )}
      <div className={cn('bg-surface-2 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn(
            'h-full rounded-full',
            variantClasses[variant],
            animated && 'transition-all duration-700 ease-out'
          )}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

// Circular progress
interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
  color = '#6366f1',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <span className="text-2xl font-bold font-display text-foreground">{label}</span>}
        {sublabel && <span className="text-xs text-muted-foreground mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
}
