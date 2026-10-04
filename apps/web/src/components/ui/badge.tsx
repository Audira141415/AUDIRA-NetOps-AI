import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'critical' | 'cyan';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps): React.JSX.Element {
  const variantStyles = {
    default: 'border-transparent bg-cyan-600 text-white',
    secondary: 'border-transparent bg-slate-800 text-slate-300',
    destructive: 'border-transparent bg-rose-600 text-white',
    outline: 'text-slate-300 border-noc-border',
    success: 'bg-emerald-950/60 text-emerald-400 border-emerald-800',
    warning: 'bg-amber-950/60 text-amber-400 border-amber-800',
    critical: 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse',
    cyan: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-mono font-semibold transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
