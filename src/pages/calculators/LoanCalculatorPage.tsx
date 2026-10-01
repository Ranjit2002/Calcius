import React, { useState } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { FileSpreadsheet } from 'lucide-react';

export const LoanCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'loan')!;

  const [principal, setPrincipal] = useState('50000');
  const [interestRate, setInterestRate] = useState('7.5');
  const [tenureYears, setTenureYears] = useState('5');
  const [scheduleView, setScheduleView] = useState<'yearly' | 'monthly'>('yearly');

  const P = parseFloat(principal) || 0;
  const annualR = parseFloat(interestRate) || 0;
  const monthlyR = annualR / 12 / 100;
  const totalMonths = (parseFloat(tenureYears) || 0) * 12;

  // Monthly EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
  let emi = 0;
  if (monthlyR > 0 && totalMonths > 0) {
    const pow = Math.pow(1 + monthlyR, totalMonths);
    emi = (P * monthlyR * pow) / (pow - 1);
  } else if (totalMonths > 0) {
    emi = P / totalMonths;
  }

  const totalAmount = emi * totalMonths;
  const totalInterest = Math.max(totalAmount - P, 0);

  const principalPercent = totalAmount > 0 ? (P / totalAmount) * 100 : 50;
  const interestPercent = totalAmount > 0 ? (totalInterest / totalAmount) * 100 : 50;

  // Generate Amortization Schedule
  const amortizationData: Array<{
    period: number;
    principalPaid: number;
    interestPaid: number;
    balance: number;
  }> = [];

  let currentBalance = P;
  if (scheduleView === 'yearly') {
    const numYears = Math.ceil(totalMonths / 12);
    for (let y = 1; y <= numYears; y++) {
      let yearPrincipal = 0;
      let yearInterest = 0;

      for (let m = 1; m <= 12; m++) {
        if (currentBalance <= 0) break;
        const interestForMonth = currentBalance * monthlyR;
        const principalForMonth = Math.min(emi - interestForMonth, currentBalance);
        yearInterest += interestForMonth;
        yearPrincipal += principalForMonth;
        currentBalance -= principalForMonth;
      }

      amortizationData.push({
        period: y,
        principalPaid: Math.round(yearPrincipal),
        interestPaid: Math.round(yearInterest),
        balance: Math.max(Math.round(currentBalance), 0),
      });
    }
  } else {
    // Monthly (first 24 months preview)
    for (let m = 1; m <= Math.min(totalMonths, 36); m++) {
      const interestForMonth = currentBalance * monthlyR;
      const principalForMonth = Math.min(emi - interestForMonth, currentBalance);
      currentBalance -= principalForMonth;
      amortizationData.push({
        period: m,
        principalPaid: Math.round(principalForMonth),
        interestPaid: Math.round(interestForMonth),
        balance: Math.max(Math.round(currentBalance), 0),
      });
    }
  }

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-8">
        
        {/* Main Inputs Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Principal Amount */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Interest Rate (% p.a.)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Loan Tenure */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Loan Term (Years)
              </label>
              <input
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

          </div>
        </div>

        {/* Results Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Monthly EMI */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Monthly Loan EMI
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono">
              ₹{Math.round(emi).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-amber-100 pt-2 border-t border-white/20">
              Per month for {totalMonths} months
            </div>
          </div>

          {/* Total Interest Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Interest Payable
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono text-amber-600 dark:text-amber-400">
              ₹{Math.round(totalInterest).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              Total payment: ₹{Math.round(totalAmount).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Visual Ratio breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Breakdown of Total Payment
            </span>

            <div className="h-4 rounded-full overflow-hidden flex shadow-inner">
              <div 
                className="bg-indigo-600" 
                style={{ width: `${principalPercent}%` }} 
                title={`Principal: ${principalPercent.toFixed(1)}%`}
              />
              <div 
                className="bg-amber-500" 
                style={{ width: `${interestPercent}%` }} 
                title={`Interest: ${interestPercent.toFixed(1)}%`}
              />
            </div>

            <div className="flex justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                Principal ({principalPercent.toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1.5 text-amber-500 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Interest ({interestPercent.toFixed(1)}%)
              </span>
            </div>
          </div>

        </div>

        {/* Amortization Schedule */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-500" />
              <span>Amortization Schedule</span>
            </h3>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              <button
                onClick={() => setScheduleView('yearly')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  scheduleView === 'yearly'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Yearly
              </button>
              <button
                onClick={() => setScheduleView('monthly')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  scheduleView === 'monthly'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-sans">
                  <th className="py-2.5 px-3">{scheduleView === 'yearly' ? 'Year' : 'Month'}</th>
                  <th className="py-2.5 px-3">Principal Paid</th>
                  <th className="py-2.5 px-3">Interest Paid</th>
                  <th className="py-2.5 px-3 text-right">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {amortizationData.map((row) => (
                  <tr key={row.period} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                      {scheduleView === 'yearly' ? `Year ${row.period}` : `Month ${row.period}`}
                    </td>
                    <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">
                      ₹{row.principalPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">
                      ₹{row.interestPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                      ₹{row.balance.toLocaleString('en-IN')}
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
