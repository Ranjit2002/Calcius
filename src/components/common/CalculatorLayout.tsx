import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronRight, 
  Layers, 
  Share2, 
  Check, 
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { CALCULATORS } from '../../data/calculators';
import type { CalculatorMeta } from '../../types/calculator';
import { DynamicIcon } from './DynamicIcon';

interface CalculatorLayoutProps {
  calc: CalculatorMeta;
  children: React.ReactNode;
}

export const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({ calc, children }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  // Close switcher on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // fallback
    }
  };

  // Find 3 other related calculators from same or other categories
  const relatedCalculators = CALCULATORS
    .filter((c) => c.id !== calc.id)
    .sort((a, _b) => (a.category === calc.category ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Navigation Bar / Breadcrumb & Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          
          {/* Left Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-900 transition-all font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Calculators</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${calc.gradient}`} />
              {calc.name}
            </span>
          </div>

          {/* Right Controls: Quick Switcher + Share */}
          <div className="flex items-center gap-2">
            
            {/* Quick Switcher */}
            <div className="relative" ref={switcherRef}>
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 shadow-xs transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>Switch Tool</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${switcherOpen ? 'rotate-180' : ''}`} />
              </button>

              {switcherOpen && (
                <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Jump to Calculator
                  </div>
                  <div className="space-y-0.5">
                    {CALCULATORS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSwitcherOpen(false);
                          navigate(item.path);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-left transition-all ${
                          item.id === calc.id
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className={`p-1 rounded-md bg-gradient-to-br ${item.gradient} text-white`}>
                          <DynamicIcon name={item.iconName} className="w-3 h-3" />
                        </div>
                        <span className="truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Share / Copy link */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs transition-all cursor-pointer"
              title="Copy shareable link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Calculator Title Header */}
        <div className="relative mb-8 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white shadow-xl overflow-hidden border border-slate-800">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${calc.gradient} flex items-center justify-center text-white shadow-lg shrink-0`}>
                <DynamicIcon name={calc.iconName} className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {calc.name}
                  </h1>
                  {calc.badge && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                      {calc.badge}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                  {calc.description}
                </p>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-end gap-1 text-right text-xs text-slate-400 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md">
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Live Instant Solver
              </span>
              <span>{calc.quickInfo}</span>
            </div>
          </div>
        </div>

        {/* Main Calculator Content */}
        <div className="transition-all duration-300">
          {children}
        </div>

        {/* Related Calculators Strip */}
        <div className="mt-14 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Explore More Calculators
            </h3>
            <Link 
              to="/" 
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View all 17 tools <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedCalculators.map((rel) => (
              <Link
                key={rel.id}
                to={rel.path}
                className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 hover:shadow-lg transition-all duration-200 flex items-center gap-3.5"
              >
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${rel.gradient} text-white shadow-xs group-hover:scale-110 transition-transform`}>
                  <DynamicIcon name={rel.iconName} className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {rel.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {rel.quickInfo}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};
