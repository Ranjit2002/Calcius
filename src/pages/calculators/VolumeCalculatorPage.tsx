import React, { useState } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { Beaker, ArrowRightLeft, Copy, Check, Utensils } from 'lucide-react';

const VOLUME_UNITS: Record<string, { name: string; toLiter: number; symbol: string }> = {
  ml: { name: 'Milliliter', toLiter: 0.001, symbol: 'mL' },
  l: { name: 'Liter', toLiter: 1, symbol: 'L' },
  m3: { name: 'Cubic Meter', toLiter: 1000, symbol: 'm³' },
  cm3: { name: 'Cubic Centimeter', toLiter: 0.001, symbol: 'cm³' },
  us_gal: { name: 'US Gallon', toLiter: 3.78541, symbol: 'gal' },
  uk_gal: { name: 'UK Gallon (Imperial)', toLiter: 4.54609, symbol: 'imp gal' },
  fl_oz: { name: 'Fluid Ounce (US)', toLiter: 0.0295735, symbol: 'fl oz' },
  cup: { name: 'Cup (US Standard)', toLiter: 0.236588, symbol: 'cup' },
  tbsp: { name: 'Tablespoon (US)', toLiter: 0.0147868, symbol: 'tbsp' },
  tsp: { name: 'Teaspoon (US)', toLiter: 0.00492892, symbol: 'tsp' },
  cu_ft: { name: 'Cubic Foot', toLiter: 28.3168, symbol: 'ft³' },
  cu_in: { name: 'Cubic Inch', toLiter: 0.0163871, symbol: 'in³' },
};

export const VolumeCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'volume')!;

  const [val, setVal] = useState('5');
  const [fromUnit, setFromUnit] = useState('l');
  const [toUnit, setToUnit] = useState('us_gal');
  const [copied, setCopied] = useState(false);

  const numVal = parseFloat(val) || 0;
  const inLiters = numVal * (VOLUME_UNITS[fromUnit]?.toLiter || 1);
  const result = inLiters / (VOLUME_UNITS[toUnit]?.toLiter || 1);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-8">
        
        {/* Converter Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            
            {/* From */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Input Volume
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
                {Object.entries(VOLUME_UNITS).map(([key, item]) => (
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
                  Converted Volume
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
                {Object.entries(VOLUME_UNITS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.name} ({item.symbol})
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Simultaneous Conversion Grid */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
            <Beaker className="w-4 h-4 text-cyan-500" />
            <span>Simultaneous Capacity in All Units for {val} {VOLUME_UNITS[fromUnit]?.name}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(VOLUME_UNITS).map(([k, item]) => {
              const res = inLiters / item.toLiter;
              return (
                <div
                  key={k}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs text-slate-400">{item.name}</div>
                    <div className="font-mono font-bold text-sm text-slate-900 dark:text-white truncate">
                      {res.toLocaleString(undefined, { maximumFractionDigits: 4 })} {item.symbol}
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

        {/* Culinary Cooking Quick Presets */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Utensils className="w-4 h-4" />
            <span>Kitchen & Recipe Equivalents</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">1 US Cup =</span>
              <div className="font-bold text-cyan-400 font-mono mt-0.5">16 Tablespoons (237 mL)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">1 Tablespoon =</span>
              <div className="font-bold text-cyan-400 font-mono mt-0.5">3 Teaspoons (14.8 mL)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">1 US Gallon =</span>
              <div className="font-bold text-cyan-400 font-mono mt-0.5">128 Fluid Ounces (3.785 L)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">1 Liter =</span>
              <div className="font-bold text-cyan-400 font-mono mt-0.5">4.22 US Cups (33.8 fl oz)</div>
            </div>
          </div>
        </div>

      </div>
    </CalculatorLayout>
  );
};
