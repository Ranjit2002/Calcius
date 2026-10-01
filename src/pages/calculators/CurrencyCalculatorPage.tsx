import React, { useState, useEffect, useCallback } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import {
  DollarSign,
  ArrowRightLeft,
  RefreshCw,
  Copy,
  Check,
  TrendingUp,
  Clock
} from 'lucide-react';

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  fallbackRate: number; // rate per 1 USD
}

const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', name: 'United States Dollar', symbol: '$', flag: '🇺🇸', fallbackRate: 1 },
  INR: { code: 'INR', name: 'Indian National Rupee', symbol: '₹', flag: '🇮🇳', fallbackRate: 85.5 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', fallbackRate: 0.92 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', fallbackRate: 0.78 },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', fallbackRate: 3.67 },
  SAR: { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦', fallbackRate: 3.75 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', fallbackRate: 155.0 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: '$', flag: '🇨🇦', fallbackRate: 1.38 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: '$', flag: '🇦🇺', fallbackRate: 1.54 },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', fallbackRate: 0.91 },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', fallbackRate: 7.25 },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: '$', flag: '🇸🇬', fallbackRate: 1.35 },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: '$', flag: '🇳🇿', fallbackRate: 1.69 },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', fallbackRate: 5.40 },
  KRW: { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', fallbackRate: 1380.0 },
  SEK: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', fallbackRate: 10.60 },
  MXN: { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽', fallbackRate: 18.20 },
  RUB: { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺', fallbackRate: 92.0 },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', fallbackRate: 18.50 },
  TRY: { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', fallbackRate: 33.0 },
  THB: { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', fallbackRate: 36.5 },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', fallbackRate: 4.72 },
  IDR: { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', fallbackRate: 16250.0 },
  KWD: { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼', fallbackRate: 0.31 },
  QAR: { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', flag: '🇶🇦', fallbackRate: 3.64 },
  OMR: { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.', flag: '🇴🇲', fallbackRate: 0.38 },
  BHD: { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب', flag: '🇧🇭', fallbackRate: 0.38 },
  PKR: { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', flag: '🇵🇰', fallbackRate: 278.0 },
  BDT: { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩', fallbackRate: 117.5 },
  NPR: { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs', flag: '🇳🇵', fallbackRate: 136.8 },
  LKR: { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', flag: '🇱🇰', fallbackRate: 302.0 }
};

export const CurrencyCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'currency')!;

  const [amount, setAmount] = useState('100');
  const [fromCode, setFromCode] = useState('USD');
  const [toCode, setToCode] = useState('INR');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Live rates state
  const [liveRates, setLiveRates] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    Object.values(CURRENCIES).forEach((c) => {
      initial[c.code] = c.fallbackRate;
    });
    return initial;
  });
  const [lastUpdated, setLastUpdated] = useState<string>('Live (updating...)');
  const [isLiveSuccess, setIsLiveSuccess] = useState<boolean>(false);

  // Fetch real-time market rates
  const fetchLiveRates = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates) {
          setLiveRates((prev) => ({
            ...prev,
            ...data.rates
          }));
          const dateStr = data.time_last_update_utc
            ? new Date(data.time_last_update_utc).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
            : new Date().toLocaleTimeString();
          setLastUpdated(dateStr);
          setIsLiveSuccess(true);
        }
      }
    } catch (err) {
      console.warn('Using baseline exchange rates:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveRates();
  }, [fetchLiveRates]);

  const numAmount = parseFloat(amount) || 0;
  const fromInfo = CURRENCIES[fromCode] || CURRENCIES.USD;
  const toInfo = CURRENCIES[toCode] || CURRENCIES.INR;

  const fromRatePerUsd = liveRates[fromCode] || fromInfo.fallbackRate || 1;
  const toRatePerUsd = liveRates[toCode] || toInfo.fallbackRate || 1;

  // Convert via base USD
  const inUsd = numAmount / fromRatePerUsd;
  const convertedResult = inUsd * toRatePerUsd;

  const rate1FromTo = toRatePerUsd / fromRatePerUsd;
  const rate1ToFrom = fromRatePerUsd / toRatePerUsd;

  const swap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const multiAmounts = [1, 5, 10, 25, 50, 100, 500, 1000];

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-8">

        {/* Converter Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Live Currency Exchange</span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${isLiveSuccess
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    {isLiveSuccess ? 'Live Market Feed' : 'Cached Feed'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  Rates updated: <strong className="text-slate-600 dark:text-slate-300 font-mono">{lastUpdated}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={fetchLiveRates}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-all shadow-xs active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
              <span>{isRefreshing ? 'Fetching Rates...' : 'Refresh Live Rates'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">

            {/* From */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                You Send ({fromInfo.code})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center py-2">
              <button
                onClick={swap}
                className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:scale-110 active:rotate-180 transition-all cursor-pointer shadow-xs border border-emerald-500/20"
                title="Swap Currencies"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            {/* To */}
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Recipient Gets ({toInfo.code})
                </label>
                <button
                  onClick={() => handleCopy(String(convertedResult.toFixed(2)))}
                  className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="w-full px-4 py-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xl truncate">
                {toInfo.symbol} {convertedResult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </div>

              <select
                value={toCode}
                onChange={(e) => setToCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}({c.symbol})
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Rates banner */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <span className="text-slate-600 dark:text-slate-300">
              1 {fromInfo.code} = <strong className="text-emerald-600 dark:text-emerald-400 text-sm">{rate1FromTo.toFixed(4)} {toInfo.code}</strong>
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              1 {toInfo.code} = {rate1ToFrom.toFixed(4)} {fromInfo.code}
            </span>
          </div>
        </div>

        {/* Popular amounts conversion table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Live Conversion Matrix ({fromInfo.code} to {toInfo.code})</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Live mid-market rate
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            {multiAmounts.map((amt) => {
              const res = amt * rate1FromTo;
              return (
                <div
                  key={amt}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 flex justify-between items-center text-xs"
                >
                  <span className="text-slate-500">{amt} {fromInfo.code}</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {toInfo.symbol}{res.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </CalculatorLayout>
  );
};
