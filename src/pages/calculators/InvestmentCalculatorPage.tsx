import React, { useState } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { TrendingUp } from 'lucide-react';

export const InvestmentCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'investment')!;

  const [mode, setMode] = useState<'sip' | 'lumpsum'>('sip');
  
  // SIP
  const [monthlyDeposit, setMonthlyDeposit] = useState('500');
  const [sipReturnRate, setSipReturnRate] = useState('12');
  const [sipYears, setSipYears] = useState('10');

  // Lumpsum
  const [initialAmount, setInitialAmount] = useState('10000');
  const [lumpReturnRate, setLumpReturnRate] = useState('10');
  const [lumpYears, setLumpYears] = useState('10');
  const [compoundFreq, setCompoundFreq] = useState('12'); // 12=monthly, 4=quarterly, 1=annually

  let totalInvested = 0;
  let maturityValue = 0;
  let totalReturns = 0;

  // Year by year breakdown array
  const growthSchedule: Array<{ year: number; invested: number; value: number }> = [];

  if (mode === 'sip') {
    const P = parseFloat(monthlyDeposit) || 0;
    const r = (parseFloat(sipReturnRate) || 0) / 100 / 12; // monthly interest rate
    const n = (parseFloat(sipYears) || 0) * 12; // total months

    totalInvested = P * n;

    if (r > 0) {
      maturityValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    } else {
      maturityValue = totalInvested;
    }
    totalReturns = Math.max(maturityValue - totalInvested, 0);

    // Compute for years
    const yrs = parseInt(sipYears, 10) || 1;
    for (let y = 1; y <= yrs; y++) {
      const m = y * 12;
      const inv = P * m;
      const val = r > 0 ? P * ((Math.pow(1 + r, m) - 1) / r) * (1 + r) : inv;
      growthSchedule.push({ year: y, invested: Math.round(inv), value: Math.round(val) });
    }
  } else {
    // Lumpsum
    const P = parseFloat(initialAmount) || 0;
    const r = (parseFloat(lumpReturnRate) || 0) / 100;
    const n = parseFloat(compoundFreq) || 12;
    const t = parseFloat(lumpYears) || 0;

    totalInvested = P;
    maturityValue = P * Math.pow(1 + r / n, n * t);
    totalReturns = Math.max(maturityValue - totalInvested, 0);

    const yrs = parseInt(lumpYears, 10) || 1;
    for (let y = 1; y <= yrs; y++) {
      const val = P * Math.pow(1 + r / n, n * y);
      growthSchedule.push({ year: y, invested: Math.round(P), value: Math.round(val) });
    }
  }

  const investedPercent = maturityValue > 0 ? (totalInvested / maturityValue) * 100 : 50;
  const returnsPercent = maturityValue > 0 ? (totalReturns / maturityValue) * 100 : 50;

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-8">
        
        {/* Mode Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
          <button
            onClick={() => setMode('sip')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              mode === 'sip'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            SIP (Monthly Investment)
          </button>
          <button
            onClick={() => setMode('lumpsum')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              mode === 'lumpsum'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Lumpsum (One-Time / Compound Interest)
          </button>
        </div>

        {/* Inputs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {mode === 'sip' ? (
              <>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Monthly Investment (₹)
                  </label>
                  <input
                    type="number"
                    value={monthlyDeposit}
                    onChange={(e) => setMonthlyDeposit(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Expected Return Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    value={sipReturnRate}
                    onChange={(e) => setSipReturnRate(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Time Period (Years)
                  </label>
                  <input
                    type="number"
                    value={sipYears}
                    onChange={(e) => setSipYears(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Total Investment (₹)
                  </label>
                  <input
                    type="number"
                    value={initialAmount}
                    onChange={(e) => setInitialAmount(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Expected Return Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    value={lumpReturnRate}
                    onChange={(e) => setLumpReturnRate(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Time Period (Years)
                  </label>
                  <input
                    type="number"
                    value={lumpYears}
                    onChange={(e) => setLumpYears(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Compounding Frequency
                  </label>
                  <select
                    value={compoundFreq}
                    onChange={(e) => setCompoundFreq(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="12">Compounded Monthly (12 times/year)</option>
                    <option value="4">Compounded Quarterly (4 times/year)</option>
                    <option value="2">Compounded Semi-Annually (2 times/year)</option>
                    <option value="1">Compounded Annually (Once/year)</option>
                  </select>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Results Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Maturity Value */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 text-white shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Total Expected Value
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono">
              ₹{Math.round(maturityValue).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-indigo-100 pt-2 border-t border-white/20">
              Wealth Gain: +₹{Math.round(totalReturns).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Invested Amount */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Invested Amount
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono text-slate-900 dark:text-white">
              ₹{Math.round(totalInvested).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              Principal capital out of pocket
            </div>
          </div>

          {/* Wealth Gained Ratio */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Capital Distribution
            </span>
            
            <div className="h-4 rounded-full overflow-hidden flex shadow-inner">
              <div 
                className="bg-indigo-600" 
                style={{ width: `${investedPercent}%` }} 
                title={`Invested: ${investedPercent.toFixed(1)}%`}
              />
              <div 
                className="bg-pink-500" 
                style={{ width: `${returnsPercent}%` }} 
                title={`Returns: ${returnsPercent.toFixed(1)}%`}
              />
            </div>

            <div className="flex justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                Invested ({investedPercent.toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1.5 text-pink-500 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                Returns ({returnsPercent.toFixed(1)}%)
              </span>
            </div>
          </div>

        </div>

        {/* Year-by-year Growth Schedule */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span>Yearly Growth Projection</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-sans">
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3">Invested Capital</th>
                  <th className="py-2.5 px-3">Estimated Wealth Gain</th>
                  <th className="py-2.5 px-3 text-right">Total Future Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {growthSchedule.slice(0, 15).map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">Year {row.year}</td>
                    <td className="py-2.5 px-3 text-slate-500">₹{row.invested.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-pink-500 font-semibold">+₹{(row.value - row.invested).toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-indigo-600 dark:text-indigo-400">
                      ₹{row.value.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </CalculatorLayout>
  );
};
