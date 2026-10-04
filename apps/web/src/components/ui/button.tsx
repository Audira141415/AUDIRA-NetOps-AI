import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'cyber';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-sm',
      destructive: 'bg-rose-600 text-white hover:bg-rose-500 shadow-sm',
      outline: 'border border-noc-border bg-transparent hover:bg-noc-surface text-slate-200',
      secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
      ghost: 'hover:bg-noc-surface hover:text-slate-100 text-slate-400',
      link: 'text-cyan-400 underline-offset-4 hover:underline',
      cyber: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 shadow-cyan-500/10',
    };

    const sizeStyles = {
      default: 'h-8 px-3 text-xs',
      sm: 'h-7 rounded px-2 text-[11px]',
      lg: 'h-10 rounded-md px-6 text-sm',
      icon: 'h-8 w-8',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-mono font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
