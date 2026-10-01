import React, { useState } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { FileText, Copy, Check } from 'lucide-react';

export const GSTCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'gst')!;

  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [amount, setAmount] = useState('10000');
  const [taxRate, setTaxRate] = useState('18');
  const [taxType, setTaxType] = useState<'intra' | 'inter'>('intra'); // intra: CGST+SGST, inter: IGST
  const [copied, setCopied] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const rate = parseFloat(taxRate) || 0;

  let netPrice = 0;
  let gstAmount = 0;
  let grossPrice = 0;

  if (mode === 'exclusive') {
    // Add GST
    netPrice = numAmount;
    gstAmount = (netPrice * rate) / 100;
    grossPrice = netPrice + gstAmount;
  } else {
    // Remove GST (Reverse calculation)
    grossPrice = numAmount;
    netPrice = grossPrice / (1 + rate / 100);
    gstAmount = grossPrice - netPrice;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  const igst = gstAmount;

  const slabs = [3, 5, 12, 18, 28];

  const handleCopyReceipt = () => {
    const text = `
=== GST INVOICE SUMMARY ===
Base / Net Amount: ₹${netPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
GST Rate: ${rate}%
${taxType === 'intra' ? `CGST (${(rate / 2).toFixed(1)}%): ₹${cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nSGST (${(rate / 2).toFixed(1)}%): ₹${sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `IGST (${rate}%): ₹${igst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
Total GST Amount: ₹${gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Total Gross Amount: ₹${grossPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
===========================
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-8">
        
        {/* Mode Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
          <button
            onClick={() => setMode('exclusive')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              mode === 'exclusive'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            GST Exclusive (Add Tax)
          </button>
          <button
            onClick={() => setMode('inclusive')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              mode === 'inclusive'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            GST Inclusive (Reverse / Extract Tax)
          </button>
        </div>

        {/* Inputs Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Amount */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {mode === 'exclusive' ? 'Base / Net Amount (₹)' : 'Total Inclusive Amount (₹)'}
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* GST Rate */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                GST Rate (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Tax Jurisdiction */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Supply Type
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTaxType('intra')}
                  className={`py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    taxType === 'intra'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Intra-State (CGST+SGST)
                </button>
                <button
                  type="button"
                  onClick={() => setTaxType('inter')}
                  className={`py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    taxType === 'inter'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Inter-State (IGST)
                </button>
              </div>
            </div>

          </div>

          {/* Standard GST Slabs */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
              Standard GST Slabs:
            </span>
            {slabs.map((rateOption) => (
              <button
                key={rateOption}
                onClick={() => setTaxRate(String(rateOption))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  taxRate === String(rateOption)
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {rateOption}% Slab
              </button>
            ))}
          </div>
        </div>

        {/* Results Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Gross Price */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Total Gross Amount (Final)
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono">
              ₹{grossPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-emerald-100 pt-2 border-t border-white/20">
              Inclusive of all taxes & levies
            </div>
          </div>

          {/* Total GST Component */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total GST Amount ({rate}%)
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              ₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              Base Net Amount: ₹{netPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Tax Slabs Breakdown Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Tax Component Split
                </h4>
                <button
                  onClick={handleCopyReceipt}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied Receipt' : 'Copy Invoice'}
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {taxType === 'intra' ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-400">CGST ({(rate / 2).toFixed(1)}%):</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-400">SGST ({(rate / 2).toFixed(1)}%):</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                    <span className="text-slate-400">IGST ({rate}%):</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{igst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Total Tax Paid:</span>
                  <span>₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center gap-1">
              <FileText className="w-3 h-3 text-emerald-500" />
              <span>Compliant with standard GST calculation models</span>
            </div>
          </div>

        </div>

      </div>
    </CalculatorLayout>
  );
};
