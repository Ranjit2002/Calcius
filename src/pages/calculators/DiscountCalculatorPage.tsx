import React, { useState } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { Sparkles } from 'lucide-react';

export const DiscountCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'discount')!;

  const [price, setPrice] = useState('120');
  const [discountPercent, setDiscountPercent] = useState('25');
  const [extraPercent, setExtraPercent] = useState('10');
  const [taxPercent, setTaxPercent] = useState('8');

  const p = parseFloat(price) || 0;
  const d1 = parseFloat(discountPercent) || 0;
  const d2 = parseFloat(extraPercent) || 0;
  const taxRate = parseFloat(taxPercent) || 0;

  // After first discount
  const afterFirstDiscount = p * (1 - d1 / 100);
  // After second discount (stacked)
  const afterSecondDiscount = afterFirstDiscount * (1 - d2 / 100);
  // Tax
  const taxAmount = afterSecondDiscount * (taxRate / 100);
  // Final Price
  const finalPrice = afterSecondDiscount + taxAmount;
  // Total Savings
  const totalSavings = p - afterSecondDiscount;
  const overallDiscountPercent = p > 0 ? (totalSavings / p) * 100 : 0;

  const presets = [10, 15, 20, 25, 30, 40, 50, 70];

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-8">
        
        {/* Main Inputs Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Original Price */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Discount % */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Primary Discount (%)
              </label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Additional Coupon % */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Extra Coupon (%)
              </label>
              <input
                type="number"
                value={extraPercent}
                onChange={(e) => setExtraPercent(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Sales Tax % */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Sales Tax (%)
              </label>
              <input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

          </div>

          {/* Quick Presets */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
              Quick Discounts:
            </span>
            {presets.map((rate) => (
              <button
                key={rate}
                onClick={() => setDiscountPercent(String(rate))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  discountPercent === String(rate)
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {rate}% OFF
              </button>
            ))}
          </div>
        </div>

        {/* Results Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Final Price Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              Final You Pay
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono">
              ₹{finalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-amber-100/90 pt-2 border-t border-white/20 flex justify-between">
              <span>Incl. Tax (₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span>
              <span>Total {overallDiscountPercent.toFixed(1)}% OFF</span>
            </div>
          </div>

          {/* Total Savings Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-600 text-white shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Total Money Saved
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono">
              ₹{totalSavings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-emerald-100 pt-2 border-t border-white/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              You saved {overallDiscountPercent.toFixed(0)}% off original price
            </div>
          </div>

          {/* Breakdown summary */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 font-mono text-xs">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase font-sans">
              Price Breakdown
            </h4>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Original Price:</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">₹{p.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-emerald-600 dark:text-emerald-400">
              <span>Primary Discount ({d1}%):</span>
              <span>-₹{(p * (d1 / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            {d2 > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-emerald-600 dark:text-emerald-400">
                <span>Extra Coupon ({d2}%):</span>
                <span>-₹{(afterFirstDiscount * (d2 / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-500">
              <span>Sales Tax ({taxRate}%):</span>
              <span>+₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

        </div>

      </div>
    </CalculatorLayout>
  );
};
