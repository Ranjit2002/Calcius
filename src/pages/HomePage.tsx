import React, { useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CalculatorCard } from '../components/home/CalculatorCard';
import { CALCULATORS } from '../data/calculators';
import type { CalculatorCategory } from '../types/calculator';
import { LayoutGrid, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CalculatorCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCalculators = CALCULATORS.filter((calc) => {
    const matchesCategory = selectedCategory === 'all' || calc.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      calc.name.toLowerCase().includes(q) ||
      calc.description.toLowerCase().includes(q) ||
      calc.keywords.some((k) => k.toLowerCase().includes(q))
    );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Hero Section */}
      <HeroSection
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Containers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 w-full">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {selectedCategory === 'all' ? 'All Calculation Systems' : `${selectedCategory.toUpperCase()} Tools`}
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {filteredCalculators.length}
            </span>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Click any container to open dedicated calculator
          </div>
        </div>

        {/* 17 Calculation Systems Grid */}
        {filteredCalculators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredCalculators.map((calc, idx) => (
              <CalculatorCard key={calc.id} calc={calc} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
              No calculators found matching your query.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Try searching for something else or resetting your filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              Show All Calculators
            </button>
          </div>
        )}

      </section>

    </div>
  );
};
