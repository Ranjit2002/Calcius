import React, { useState } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { Thermometer, ArrowRightLeft, Copy, Check } from 'lucide-react';

type TempUnit = 'C' | 'F' | 'K' | 'R';

export const TemperatureCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'temperature')!;

  const [val, setVal] = useState('37');
  const [fromUnit, setFromUnit] = useState<TempUnit>('C');
  const [toUnit, setToUnit] = useState<TempUnit>('F');
  const [copied, setCopied] = useState(false);

  // Convert to Celsius first
  const inputNum = parseFloat(val) || 0;
  let inCelsius = 0;
  switch (fromUnit) {
    case 'C':
      inCelsius = inputNum;
      break;
    case 'F':
      inCelsius = ((inputNum - 32) * 5) / 9;
      break;
    case 'K':
      inCelsius = inputNum - 273.15;
      break;
    case 'R':
      inCelsius = ((inputNum - 491.67) * 5) / 9;
      break;
  }

  // Convert from Celsius to Target
  let converted = 0;
  switch (toUnit) {
    case 'C':
      converted = inCelsius;
      break;
    case 'F':
      converted = (inCelsius * 9) / 5 + 32;
      break;
    case 'K':
      converted = inCelsius + 273.15;
      break;
    case 'R':
      converted = ((inCelsius + 273.15) * 9) / 5;
      break;
  }

  // Simultaneous values
  const allValues = {
    C: inCelsius,
    F: (inCelsius * 9) / 5 + 32,
    K: inCelsius + 273.15,
    R: ((inCelsius + 273.15) * 9) / 5,
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Thermometer percentage (-20°C to 120°C range)
  const thermoPercent = Math.min(Math.max(((inCelsius - -20) / (120 - -20)) * 100, 0), 100);

  const referencePoints = [
    { name: 'Absolute Zero', c: -273.15, f: -459.67, desc: 'Theoretical lowest temperature' },
    { name: 'Water Freezes', c: 0, f: 32, desc: 'Solidification of liquid water' },
    { name: 'Room Temperature', c: 20, f: 68, desc: 'Comfortable living conditions' },
    { name: 'Human Body', c: 37, f: 98.6, desc: 'Normal internal body temperature' },
    { name: 'Water Boils', c: 100, f: 212, desc: 'Boiling at sea level (1 atm)' },
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
                Input Temperature
              </label>
              <input
                type="number"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as TempUnit)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer"
              >
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
                <option value="K">Kelvin (K)</option>
                <option value="R">Rankine (°R)</option>
              </select>
            </div>

            {/* Swap */}
            <div className="md:col-span-1 flex justify-center py-2">
              <button
                onClick={swap}
                className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:scale-110 active:rotate-180 transition-all cursor-pointer shadow-xs border border-orange-500/20"
                title="Swap Units"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            {/* To */}
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Converted Temperature
                </label>
                <button
                  onClick={() => handleCopy(String(converted.toFixed(2)))}
                  className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="w-full px-4 py-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-500/30 text-orange-700 dark:text-orange-400 font-mono font-bold text-xl truncate">
                {converted.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value as TempUnit)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer"
              >
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
                <option value="K">Kelvin (K)</option>
                <option value="R">Rankine (°R)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Visual Thermal Gauge */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <span>Thermal Level Visualizer</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              {inCelsius.toFixed(1)}°C / {allValues.F.toFixed(1)}°F
            </span>
          </div>

          <div className="relative h-4 rounded-full bg-gradient-to-r from-blue-500 via-emerald-400 via-amber-400 to-rose-600 shadow-inner" />

          {/* Indicator arrow */}
          <div className="relative h-6">
            <div 
              className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
              style={{ left: `${thermoPercent}%` }}
            >
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-orange-600 dark:border-b-orange-400" />
              <span className="text-[11px] font-bold font-mono text-orange-600 dark:text-orange-400">
                {inCelsius.toFixed(1)}°C
              </span>
            </div>
          </div>
        </div>

        {/* Simultaneous Scales */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Celsius', val: allValues.C, sym: '°C' },
            { label: 'Fahrenheit', val: allValues.F, sym: '°F' },
            { label: 'Kelvin', val: allValues.K, sym: 'K' },
            { label: 'Rankine', val: allValues.R, sym: '°R' },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-center"
            >
              <div className="text-xs text-slate-400 font-semibold">{item.label}</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1 truncate">
                {item.val.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                <span className="text-sm text-orange-500 ml-1 font-sans">{item.sym}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Reference Benchmarks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
            Key Physical Temperature Points
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {referencePoints.map((pt) => (
              <div
                key={pt.name}
                onClick={() => {
                  setVal(String(pt.c));
                  setFromUnit('C');
                }}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-slate-200/50 dark:border-slate-800 transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-500">
                  {pt.name}
                </div>
                <div className="text-sm font-mono font-bold text-orange-600 dark:text-orange-400 mt-1">
                  {pt.c}°C ({pt.f}°F)
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{pt.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </CalculatorLayout>
  );
};
