import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React from 'react';
import { Loader2 } from 'lucide-react';

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'gradient';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-foreground hover:bg-foreground/90 text-background border border-transparent shadow-editorial',
  secondary: 'bg-surface-2 hover:bg-border text-foreground border border-border shadow-sm',
  ghost: 'text-muted-foreground hover:text-foreground hover:bg-surface-2',
  danger: 'bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20',
  outline: 'bg-transparent border border-primary/30 text-primary hover:bg-primary/5',
  gradient: 'bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-editorial',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
  sm: 'text-sm px-4 py-2 rounded-xl gap-2',
  md: 'text-sm px-5 py-2.5 rounded-xl gap-2',
  lg: 'text-base px-6 py-3 rounded-xl gap-2.5',
  xl: 'text-lg px-8 py-4 rounded-2xl gap-3',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-200',
          'hover:scale-[1.02] active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
