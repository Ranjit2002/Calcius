import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Sparkles, 
  Zap, 
  Search, 
  ArrowRight
} from 'lucide-react';
import { CALCULATORS, CATEGORIES } from '../../data/calculators';
import type { CalculatorCategory } from '../../types/calculator';

interface HeroSectionProps {
  selectedCategory: CalculatorCategory;
  onSelectCategory: (cat: CalculatorCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  // Mini quick calculator state inside hero for instant utility!
  const [miniInput, setMiniInput] = useState('1250 * 1.18');
  const [miniResult, setMiniResult] = useState('1475');

  const evalMini = (expr: string) => {
    try {
      // Safe quick evaluation for basic math
      const sanitized = expr.replace(/[^0-9+\-*/().]/g, '');
      if (sanitized) {
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${sanitized})`)();
        if (typeof res === 'number' && !isNaN(res)) {
          setMiniResult(String(Number(res.toFixed(6))));
        }
      }
    } catch {
      // keep previous
    }
  };

  return (
    <div className="relative pt-6 pb-12 sm:pb-16 overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Badge Banner */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>17 Precision Tools • Zero Latency • Dark Mode First</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Every calculation tool you need, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              in one smart suite.
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From everyday normal calculations and EMI loans to numeral systems, speed, BMI, and currency exchange. Instant, accurate, and completely client-side.
          </p>
        </div>

        {/* Featured Normal Calculator Quick Launcher Container */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 text-white shadow-2xl shadow-indigo-950/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Promotion of Normal Calculator */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
                    Primary Engine
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant Execution
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Normal & Scientific Calculator
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Perform daily arithmetic, percentages, trigonometric functions, powers, and view full calculation history with copy support.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    to="/normal"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-105"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Launch Normal Calculator</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/loan"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold backdrop-blur-md transition-colors"
                  >
                    <span>EMI Loan</span>
                  </Link>

                  <Link
                    to="/gst"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold backdrop-blur-md transition-colors"
                  >
                    <span>GST Tax</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Quick Interactive Widget */}
              <div className="md:col-span-5 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Quick Scratchpad</span>
                  <span className="text-cyan-400">Live</span>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={miniInput}
                      onChange={(e) => {
                        setMiniInput(e.target.value);
                        evalMini(e.target.value);
                      }}
                      placeholder="e.g. 500 * 12 or (45 + 15) * 3"
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 flex items-center justify-between font-mono">
                    <span className="text-xs text-slate-400">Result:</span>
                    <span className="text-lg font-bold text-cyan-400">{miniResult}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 pt-1 text-xs">
                    {['250 * 4', '5000 * 0.18', '120 / 4', '2^8'].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => {
                          const expr = preset.replace('^', '**');
                          setMiniInput(expr);
                          evalMini(expr);
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-indigo-900/50 text-slate-400 hover:text-white border border-slate-800 text-center transition-colors font-mono text-[11px]"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Search & Category Filter Navigation */}
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Main Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, unit, or formula (e.g., 'speed', 'loan emi', 'binary', 'celsius', 'discount')..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm sm:text-base transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const count = cat.id === 'all' 
                ? CALCULATORS.length 
                : CALCULATORS.filter(c => c.category === cat.id).length;
              
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id as CalculatorCategory)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
