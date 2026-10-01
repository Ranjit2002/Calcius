import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Shield } from 'lucide-react';
import { CALCULATORS } from '../../data/calculators';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white shadow-md">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Calcius
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your comprehensive smart calculation workstation. Featuring 18+ ultra-precise calculators, converters, and financial planning suites.
            </p>
          </div>

          {/* Quick Calculators 1 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Essential Tools
            </h4>
            <ul className="space-y-2 text-xs">
              {CALCULATORS.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link 
                    to={c.path}
                    className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-between"
                  >
                    <span>{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Calculators 2 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Measurements & Tech
            </h4>
            <ul className="space-y-2 text-xs">
              {CALCULATORS.slice(6, 12).map((c) => (
                <li key={c.id}>
                  <Link 
                    to={c.path}
                    className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Calculators 3 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Finance & Slabs
            </h4>
            <ul className="space-y-2 text-xs">
              {CALCULATORS.slice(12).map((c) => (
                <li key={c.id}>
                  <Link 
                    to={c.path}
                    className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Calcius Calculator Suite. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Zero server latency <Shield className="w-3.5 h-3.5 text-emerald-500 ml-1" /> Client-side private
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
