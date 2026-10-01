import React, { useState } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { Scale, ArrowRightLeft, Copy, Check } from 'lucide-react';

const MASS_UNITS: Record<string, { name: string; toKg: number; symbol: string }> = {
  mg: { name: 'Milligram', toKg: 0.000001, symbol: 'mg' },
  g: { name: 'Gram', toKg: 0.001, symbol: 'g' },
  kg: { name: 'Kilogram', toKg: 1, symbol: 'kg' },
  ton: { name: 'Metric Ton', toKg: 1000, symbol: 't' },
  oz: { name: 'Ounce', toKg: 0.0283495, symbol: 'oz' },
  lb: { name: 'Pound', toKg: 0.453592, symbol: 'lb' },
  st: { name: 'Stone', toKg: 6.35029, symbol: 'st' },
  ct: { name: 'Carat (Jewelry)', toKg: 0.0002, symbol: 'ct' },
};

export const MassCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'mass')!;

  const [val, setVal] = useState('75');
  const [fromUnit, setFromUnit] = useState('kg');
  const [toUnit, setToUnit] = useState('lb');
  const [copied, setCopied] = useState(false);

  const numVal = parseFloat(val) || 0;
  const inKg = numVal * (MASS_UNITS[fromUnit]?.toKg || 1);
  const result = inKg / (MASS_UNITS[toUnit]?.toKg || 1);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Stone + lb breakdown for body weight
  const totalLbs = inKg / 0.453592;
  const stones = Math.floor(totalLbs / 14);
  const remainingLbs = (totalLbs % 14).toFixed(1);

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-8">
        
        {/* Converter Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            
            {/* From */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Input Mass
              </label>
              <input
                type="number"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer"
              >
                {Object.entries(MASS_UNITS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.name} ({item.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center py-2">
              <button
                onClick={swap}
                className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 hover:scale-110 active:rotate-180 transition-all cursor-pointer shadow-xs border border-cyan-500/20"
                title="Swap Units"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            {/* To */}
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Converted Result
                </label>
                <button
                  onClick={() => handleCopy(String(result))}
                  className="text-xs text-cyan-600 dark:text-cyan-400 flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="w-full px-4 py-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400 font-mono font-bold text-xl truncate">
                {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer"
              >
                {Object.entries(MASS_UNITS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.name} ({item.symbol})
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Simultaneous Conversion Matrix */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-500" />
              <span>Simultaneous Values in All Units</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              = {stones} st {remainingLbs} lbs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(MASS_UNITS).map(([k, item]) => {
              const res = inKg / item.toKg;
              return (
                <div
                  key={k}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs text-slate-400">{item.name}</div>
                    <div className="font-mono font-bold text-sm text-slate-900 dark:text-white truncate">
                      {res.toLocaleString(undefined, { maximumFractionDigits: 5 })} {item.symbol}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(String(res))}
                    className="text-slate-400 hover:text-cyan-500 p-1 shrink-0"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </CalculatorLayout>
  );
};
