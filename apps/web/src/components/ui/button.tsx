import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'cyber';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-teal-500 text-white hover:brightness-110 shadow-[0_0_15px_rgba(236,72,153,0.35)] border border-white/20',
      destructive: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:brightness-110 shadow-[0_0_15px_rgba(244,63,94,0.35)]',
      outline: 'border border-purple-500/40 bg-[#1E1045]/60 hover:bg-[#28155A] text-purple-200 hover:text-white shadow-sm',
      secondary: 'bg-[#1E1045] text-purple-200 hover:bg-[#28155A] border border-purple-500/30',
      ghost: 'hover:bg-[#1E1045] hover:text-white text-purple-300/80',
      link: 'text-fuchsia-400 underline-offset-4 hover:underline',
      cyber: 'bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/40 hover:bg-fuchsia-500/20 shadow-[0_0_15px_rgba(236,72,153,0.25)]',
    };

    const sizeStyles = {
      default: 'h-8 px-3 text-xs',
      sm: 'h-7 rounded-lg px-2 text-[11px]',
      lg: 'h-10 rounded-xl px-6 text-sm',
      icon: 'h-8 w-8',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-mono font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fuchsia-400 disabled:pointer-events-none disabled:opacity-50',
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
