import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'critical' | 'cyan';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps): React.JSX.Element {
  const variantStyles = {
    default: 'border-transparent bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.35)]',
    secondary: 'bg-[#1E1045] text-purple-200 border-purple-500/30',
    destructive: 'bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
    outline: 'text-purple-200 border-purple-500/30',
    success: 'bg-emerald-950/80 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.3)]',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.3)]',
    critical: 'bg-rose-950 text-rose-200 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse',
    cyan: 'bg-teal-950/80 text-teal-300 border-teal-400/40 shadow-[0_0_10px_rgba(45,212,191,0.3)]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
