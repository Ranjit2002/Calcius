import React, { useState } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { Ruler, ArrowRightLeft, Copy, Check } from 'lucide-react';

const LENGTH_UNITS: Record<string, { name: string; toMeter: number; symbol: string }> = {
  mm: { name: 'Millimeter', toMeter: 0.001, symbol: 'mm' },
  cm: { name: 'Centimeter', toMeter: 0.01, symbol: 'cm' },
  m: { name: 'Meter', toMeter: 1, symbol: 'm' },
  km: { name: 'Kilometer', toMeter: 1000, symbol: 'km' },
  in: { name: 'Inch', toMeter: 0.0254, symbol: 'in' },
  ft: { name: 'Foot', toMeter: 0.3048, symbol: 'ft' },
  yd: { name: 'Yard', toMeter: 0.9144, symbol: 'yd' },
  mi: { name: 'Mile', toMeter: 1609.344, symbol: 'mi' },
  nm: { name: 'Nautical Mile', toMeter: 1852, symbol: 'NM' },
  ly: { name: 'Light Year', toMeter: 9.4607304725808e15, symbol: 'ly' },
};

export const LengthCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'length')!;

  const [val, setVal] = useState('10');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [copied, setCopied] = useState(false);

  const numVal = parseFloat(val) || 0;
  const inMeters = numVal * (LENGTH_UNITS[fromUnit]?.toMeter || 1);
  const result = inMeters / (LENGTH_UNITS[toUnit]?.toMeter || 1);

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
        
        {/* Interactive Converter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            
            {/* From */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Input Length
              </label>
              <input
                type="number"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer"
              >
                {Object.entries(LENGTH_UNITS).map(([key, item]) => (
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
                className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 hover:scale-110 active:rotate-180 transition-all cursor-pointer shadow-xs border border-teal-500/20"
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
                  className="text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="w-full px-4 py-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/20 border border-teal-500/30 text-teal-700 dark:text-teal-400 font-mono font-bold text-xl truncate">
                {result.toLocaleString(undefined, { maximumFractionDigits: 8 })}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer"
              >
                {Object.entries(LENGTH_UNITS).map(([key, item]) => (
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
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-teal-500" />
            <span>Simultaneous Output in All 10 Units for {val} {LENGTH_UNITS[fromUnit]?.symbol}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(LENGTH_UNITS).map(([k, item]) => {
              const res = inMeters / item.toMeter;
              return (
                <div
                  key={k}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs text-slate-400">{item.name}</div>
                    <div className="font-mono font-bold text-sm text-slate-900 dark:text-white truncate">
                      {res.toLocaleString(undefined, { maximumFractionDigits: 6 })} {item.symbol}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(String(res))}
                    className="text-slate-400 hover:text-teal-500 p-1 shrink-0"
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
