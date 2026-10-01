import React, { useState } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { Binary, Copy, Check, Cpu, Type } from 'lucide-react';

export const NumeralCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'numeral')!;

  // Values in string representation
  const [decVal, setDecVal] = useState('255');
  const [binVal, setBinVal] = useState('11111111');
  const [octVal, setOctVal] = useState('377');
  const [hexVal, setHexVal] = useState('FF');
  const [activeTab, setActiveTab] = useState<'bases' | 'ascii'>('bases');

  // ASCII tab
  const [textInput, setTextInput] = useState('Hello');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const updateFromDecimal = (val: string) => {
    setDecVal(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      setBinVal(num.toString(2));
      setOctVal(num.toString(8));
      setHexVal(num.toString(16).toUpperCase());
    } else if (val === '') {
      setBinVal('');
      setOctVal('');
      setHexVal('');
    }
  };

  const updateFromBinary = (val: string) => {
    // only allow 0 and 1
    const clean = val.replace(/[^01]/g, '');
    setBinVal(clean);
    if (clean) {
      const num = parseInt(clean, 2);
      setDecVal(num.toString(10));
      setOctVal(num.toString(8));
      setHexVal(num.toString(16).toUpperCase());
    } else {
      setDecVal('');
      setOctVal('');
      setHexVal('');
    }
  };

  const updateFromOctal = (val: string) => {
    const clean = val.replace(/[^0-7]/g, '');
    setOctVal(clean);
    if (clean) {
      const num = parseInt(clean, 8);
      setDecVal(num.toString(10));
      setBinVal(num.toString(2));
      setHexVal(num.toString(16).toUpperCase());
    } else {
      setDecVal('');
      setBinVal('');
      setHexVal('');
    }
  };

  const updateFromHex = (val: string) => {
    const clean = val.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
    setHexVal(clean);
    if (clean) {
      const num = parseInt(clean, 16);
      setDecVal(num.toString(10));
      setBinVal(num.toString(2));
      setOctVal(num.toString(8));
    } else {
      setDecVal('');
      setBinVal('');
      setOctVal('');
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ASCII to Binary & Hex
  const asciiToBinary = textInput
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');

  const asciiToHex = textInput
    .split('')
    .map((char) => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'))
    .join(' ');

  // 16-bit formatted binary
  const numDec = parseInt(decVal, 10) || 0;
  const binary16 = (numDec >>> 0).toString(2).padStart(16, '0');
  const binary16Grouped = binary16.match(/.{1,4}/g)?.join(' ') || binary16;

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-8">
        
        {/* Tab switch */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
          <button
            onClick={() => setActiveTab('bases')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'bases'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Binary className="w-4 h-4" />
            <span>Numeral Bases (Live Sync)</span>
          </button>
          <button
            onClick={() => setActiveTab('ascii')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'ascii'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Text to Binary / Hex</span>
          </button>
        </div>

        {activeTab === 'bases' ? (
          <div className="space-y-6">
            
            {/* Live Synchronized Editor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Decimal */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Decimal (Base 10)
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy('dec', decVal)}
                    className="text-xs text-slate-400 hover:text-purple-500 flex items-center gap-1"
                  >
                    {copiedKey === 'dec' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'dec' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <input
                  type="number"
                  value={decVal}
                  onChange={(e) => updateFromDecimal(e.target.value)}
                  placeholder="e.g. 255"
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-[11px] text-slate-400">Standard digits 0-9</span>
              </div>

              {/* Binary */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Binary (Base 2)
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy('bin', binVal)}
                    className="text-xs text-slate-400 hover:text-purple-500 flex items-center gap-1"
                  >
                    {copiedKey === 'bin' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'bin' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <input
                  type="text"
                  value={binVal}
                  onChange={(e) => updateFromBinary(e.target.value)}
                  placeholder="e.g. 11111111"
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-[11px] text-slate-400">Bits: 0 and 1</span>
              </div>

              {/* Hexadecimal */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Hexadecimal (Base 16)
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy('hex', hexVal)}
                    className="text-xs text-slate-400 hover:text-purple-500 flex items-center gap-1"
                  >
                    {copiedKey === 'hex' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'hex' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <input
                  type="text"
                  value={hexVal}
                  onChange={(e) => updateFromHex(e.target.value)}
                  placeholder="e.g. FF"
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-[11px] text-slate-400">0-9, A-F (Prefix 0x{hexVal})</span>
              </div>

              {/* Octal */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Octal (Base 8)
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy('oct', octVal)}
                    className="text-xs text-slate-400 hover:text-purple-500 flex items-center gap-1"
                  >
                    {copiedKey === 'oct' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'oct' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <input
                  type="text"
                  value={octVal}
                  onChange={(e) => updateFromOctal(e.target.value)}
                  placeholder="e.g. 377"
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-[11px] text-slate-400">Octal digits 0-7</span>
              </div>

            </div>

            {/* 16-Bit Word Visualizer */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                <Cpu className="w-4 h-4" />
                <span>16-Bit Padded Representation</span>
              </div>
              <div className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-emerald-400 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {binary16Grouped}
              </div>
            </div>

          </div>
        ) : (
          /* Text to Binary / Hex */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Input Text / String
              </label>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type anything..."
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase">Binary Representation</span>
                  <button
                    onClick={() => handleCopy('txtBin', asciiToBinary)}
                    className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 font-semibold"
                  >
                    {copiedKey === 'txtBin' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Binary
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-emerald-400 break-all">
                  {asciiToBinary || '(empty)'}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase">Hexadecimal Representation</span>
                  <button
                    onClick={() => handleCopy('txtHex', asciiToHex)}
                    className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 font-semibold"
                  >
                    {copiedKey === 'txtHex' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Hex
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-purple-400 break-all">
                  {asciiToHex || '(empty)'}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </CalculatorLayout>
  );
};
