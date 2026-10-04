import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, activeTab, onChange, className }) => {
  return (
    <div className={cn('flex items-center space-x-1 border-b border-noc-border pb-2', className)}>
      {items.map(item => {
        const isActive = item.id === activeTab;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              'flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-mono transition-colors',
              isActive
                ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-noc-surface'
            )}
          >
            {item.icon && <span className="w-3.5 h-3.5">{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
