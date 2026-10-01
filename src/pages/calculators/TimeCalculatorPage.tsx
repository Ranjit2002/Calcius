import React, { useState } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { Clock, ArrowRightLeft, Calendar, Plus, Minus, Copy, Check } from 'lucide-react';

const TIME_UNITS: Record<string, { name: string; toSeconds: number; symbol: string }> = {
  ms: { name: 'Millisecond', toSeconds: 0.001, symbol: 'ms' },
  s: { name: 'Second', toSeconds: 1, symbol: 's' },
  min: { name: 'Minute', toSeconds: 60, symbol: 'min' },
  hr: { name: 'Hour', toSeconds: 3600, symbol: 'hr' },
  day: { name: 'Day', toSeconds: 86400, symbol: 'd' },
  wk: { name: 'Week', toSeconds: 604800, symbol: 'wk' },
  mo: { name: 'Month (Avg 30.44d)', toSeconds: 2629800, symbol: 'mo' },
  yr: { name: 'Year (365.25d)', toSeconds: 31557600, symbol: 'yr' },
};

export const TimeCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'time')!;

  const [activeTab, setActiveTab] = useState<'units' | 'duration' | 'adjust'>('units');

  // Unit Converter
  const [val, setVal] = useState('72');
  const [fromUnit, setFromUnit] = useState('hr');
  const [toUnit, setToUnit] = useState('day');
  const [copied, setCopied] = useState(false);

  // Duration between dates
  const now = new Date();
  const nextMonth = new Date(now.getTime() + 30 * 24 * 3600 * 1000);
  const [startDate, setStartDate] = useState(now.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(nextMonth.toISOString().split('T')[0]);

  // Adjust date
  const [baseDate, setBaseDate] = useState(now.toISOString().split('T')[0]);
  const [adjustDays, setAdjustDays] = useState('45');
  const [adjustOp, setAdjustOp] = useState<'add' | 'sub'>('add');

  // Unit conversion
  const numVal = parseFloat(val) || 0;
  const inSeconds = numVal * (TIME_UNITS[fromUnit]?.toSeconds || 1);
  const result = inSeconds / (TIME_UNITS[toUnit]?.toSeconds || 1);

  // Duration result
  const sDate = new Date(startDate);
  const eDate = new Date(endDate);
  const durationMs = Math.abs(eDate.getTime() - sDate.getTime());
  const diffTotalDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffTotalDays / 7);
  const diffRemainingDays = diffTotalDays % 7;
  const diffHours = diffTotalDays * 24;

  // Adjusted date
  const bDate = new Date(baseDate);
  const addDayNum = parseInt(adjustDays, 10) || 0;
  const adjustedTime = new Date(
    bDate.getTime() + (adjustOp === 'add' ? 1 : -1) * addDayNum * 24 * 3600 * 1000
  );
  const adjustedStr = isNaN(adjustedTime.getTime()) ? '' : adjustedTime.toDateString();

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-8">
        
        {/* Tab selection */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit flex-wrap">
          <button
            onClick={() => setActiveTab('units')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'units'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Time Units</span>
          </button>
          <button
            onClick={() => setActiveTab('duration')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'duration'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Duration Between Dates</span>
          </button>
          <button
            onClick={() => setActiveTab('adjust')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'adjust'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Add / Subtract Days</span>
          </button>
        </div>

        {activeTab === 'units' && (
          <div className="space-y-6">
            
            {/* 2-Way Converter */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                
                <div className="md:col-span-5 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Input Value
                  </label>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer"
                  >
                    {Object.entries(TIME_UNITS).map(([k, item]) => (
                      <option key={k} value={k}>
                        {item.name} ({item.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-1 flex justify-center py-2">
                  <button
                    onClick={() => {
                      setFromUnit(toUnit);
                      setToUnit(fromUnit);
                    }}
                    className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:scale-110 active:rotate-180 transition-all cursor-pointer shadow-xs border border-blue-500/20"
                    title="Swap"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                  </button>
                </div>

                <div className="md:col-span-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Converted Result
                    </label>
                    <button
                      onClick={() => handleCopy(String(result))}
                      className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="w-full px-4 py-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-500/30 text-blue-700 dark:text-blue-400 font-mono font-bold text-xl truncate">
                    {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </div>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer"
                  >
                    {Object.entries(TIME_UNITS).map(([k, item]) => (
                      <option key={k} value={k}>
                        {item.name} ({item.symbol})
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* Simultaneous Matrix */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                Simultaneous Conversions for {val} {TIME_UNITS[fromUnit]?.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(TIME_UNITS).map(([k, item]) => {
                  const res = inSeconds / item.toSeconds;
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
                        className="text-slate-400 hover:text-blue-500 p-1 shrink-0"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'duration' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>Exact Difference Between Two Dates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            {/* Results */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase font-bold text-blue-200">Total Difference</div>
                <div className="text-4xl sm:text-5xl font-black font-mono mt-1">
                  {diffTotalDays} <span className="text-xl font-normal">Days</span>
                </div>
                <div className="text-xs text-blue-100 mt-2">
                  Equivalent to {diffWeeks} weeks & {diffRemainingDays} days ({diffHours.toLocaleString()} hours)
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'adjust' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>Add or Subtract Days from a Date</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Starting Date
                </label>
                <input
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="w-full mt-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Operation
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAdjustOp('add')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      adjustOp === 'add' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                  <button
                    onClick={() => setAdjustOp('sub')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      adjustOp === 'sub' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" /> Subtract
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Number of Days
                </label>
                <input
                  type="number"
                  value={adjustDays}
                  onChange={(e) => setAdjustDays(e.target.value)}
                  className="w-full mt-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
              <div className="text-xs uppercase font-bold text-blue-200">Target Resulting Date</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono mt-1">
                {adjustedStr}
              </div>
            </div>
          </div>
        )}

      </div>
    </CalculatorLayout>
  );
};
