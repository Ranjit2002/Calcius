import React, { useState } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { Gauge, ArrowRightLeft, Copy, Check, Zap } from 'lucide-react';

const SPEED_UNITS: Record<string, { name: string; toMps: number; symbol: string }> = {
  kmh: { name: 'Kilometer per hour', toMps: 0.277778, symbol: 'km/h' },
  mph: { name: 'Miles per hour', toMps: 0.44704, symbol: 'mph' },
  mps: { name: 'Meters per second', toMps: 1, symbol: 'm/s' },
  knot: { name: 'Knot (Nautical)', toMps: 0.514444, symbol: 'kn' },
  fps: { name: 'Feet per second', toMps: 0.3048, symbol: 'ft/s' },
  mach: { name: 'Mach (Sound at 20°C)', toMps: 343, symbol: 'Ma' },
  c: { name: 'Speed of Light', toMps: 299792458, symbol: 'c' },
};

export const SpeedCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'speed')!;

  const [val, setVal] = useState('100');
  const [fromUnit, setFromUnit] = useState('kmh');
  const [toUnit, setToUnit] = useState('mph');
  const [copied, setCopied] = useState(false);

  const numVal = parseFloat(val) || 0;
  const inMps = numVal * (SPEED_UNITS[fromUnit]?.toMps || 1);
  const result = inMps / (SPEED_UNITS[toUnit]?.toMps || 1);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fun benchmarks in km/h
  const inKmh = inMps / 0.277778;

  const benchmarks = [
    { label: 'Human Walking', kmh: 5, icon: '🚶' },
    { label: 'Cheetah Sprint', kmh: 110, icon: '🐆' },
    { label: 'High Speed Train', kmh: 320, icon: '🚄' },
    { label: 'Commercial Jet', kmh: 900, icon: '✈️' },
    { label: 'Speed of Sound', kmh: 1235, icon: '🔊' },
    { label: 'ISS Space Station Orbit', kmh: 27600, icon: '🛰️' },
  ];

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-8">
        
        {/* Converter Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            
            {/* From */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Speed Value
              </label>
              <input
                type="number"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer"
              >
                {Object.entries(SPEED_UNITS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.name} ({item.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap */}
            <div className="md:col-span-1 flex justify-center py-2">
              <button
                onClick={swap}
                className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:scale-110 active:rotate-180 transition-all cursor-pointer shadow-xs border border-rose-500/20"
                title="Swap Units"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            {/* To */}
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Converted Velocity
                </label>
                <button
                  onClick={() => handleCopy(String(result))}
                  className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="w-full px-4 py-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-500/30 text-rose-700 dark:text-rose-400 font-mono font-bold text-xl truncate">
                {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer"
              >
                {Object.entries(SPEED_UNITS).map(([key, item]) => (
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
            <Gauge className="w-4 h-4 text-rose-500" />
            <span>Simultaneous Speed Conversions</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(SPEED_UNITS).map(([k, item]) => {
              const res = inMps / item.toMps;
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
                    className="text-slate-400 hover:text-rose-500 p-1 shrink-0"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-World Velocity Benchmarks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Speed Benchmark Comparisons</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {benchmarks.map((b) => {
              const ratio = inKmh > 0 ? (inKmh / b.kmh).toFixed(2) : '0';
              return (
                <div 
                  key={b.label}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center"
                >
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {b.label}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {b.kmh} km/h
                  </div>
                  <div className="mt-2 text-[10px] font-semibold text-rose-500 bg-rose-500/10 rounded-full py-0.5">
                    {ratio}× this speed
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </CalculatorLayout>
  );
};
