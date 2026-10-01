import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { CalculatorMeta } from '../../types/calculator';
import { DynamicIcon } from '../common/DynamicIcon';

interface CalculatorCardProps {
  calc: CalculatorMeta;
  index: number;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ calc }) => {
  return (
    <Link
      to={calc.path}
      className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Background Subtle Gradient Glow on Hover */}
      <div 
        className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${calc.gradient} opacity-0 group-hover:opacity-15 dark:group-hover:opacity-20 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none`} 
      />

      <div>
        {/* Top bar: Icon & Badges */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${calc.gradient} flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300`}>
            <DynamicIcon name={calc.iconName} className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1.5">
            {calc.badge ? (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {calc.badge}
              </span>
            ) : (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {calc.category}
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
          {calc.name}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {calc.description}
        </p>
      </div>

      {/* Footer Info & CTA */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[170px] sm:max-w-[190px]">
          {calc.quickInfo}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
          Calculate <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
};
