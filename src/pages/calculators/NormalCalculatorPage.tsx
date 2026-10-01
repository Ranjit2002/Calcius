import React, { useState, useEffect, useCallback } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { 
  Delete, 
  RotateCcw, 
  Copy, 
  Check, 
  History, 
  Trash2
} from 'lucide-react';

const SCI_BUTTONS = [
  { id: 'sin', label: 'sin', title: 'Sine' },
  { id: 'cos', label: 'cos', title: 'Cosine' },
  { id: 'tan', label: 'tan', title: 'Tangent' },
  { id: 'sin_inv', label: 'sin⁻¹', title: 'Inverse Sine (arcsin)' },
  { id: 'cos_inv', label: 'cos⁻¹', title: 'Inverse Cosine (arccos)' },
  { id: 'tan_inv', label: 'tan⁻¹', title: 'Inverse Tangent (arctan)' },
  { id: '1/x', label: '1/x', title: 'Reciprocal (1/x)' },
  { id: 'sqrt', label: '√x', title: 'Square Root' },
  { id: 'sqr', label: 'x²', title: 'Square (x²)' },
  { id: 'cube', label: 'x³', title: 'Cube (x³)' },
  { id: 'log', label: 'log', title: 'Logarithm (base 10)' },
  { id: 'ln', label: 'ln', title: 'Natural Logarithm (ln)' },
  { id: 'pi', label: 'π', title: 'Pi (3.14159...)' },
  { id: 'e', label: 'e', title: 'Euler Number (2.71828...)' },
];

export const NormalCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'normal')!;
  
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<Array<{ eq: string; res: string; time: string }>>(() => {
    const saved = localStorage.getItem('calcius_calc_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [isScientific, setIsScientific] = useState(false);
  const [isRad, setIsRad] = useState(true);
  const [memory, setMemory] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('calcius_calc_history', JSON.stringify(history));
  }, [history]);

  const handleDigit = (digit: string) => {
    setDisplay((prev) => {
      if (prev === '0' || prev === 'Error') return digit;
      return prev + digit;
    });
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    setEquation((prev) => `${prev} ${display} ${op}`);
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    setDisplay((prev) => {
      if (prev.length <= 1 || prev === 'Error') return '0';
      return prev.slice(0, -1);
    });
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay((prev) => prev + '.');
    }
  };

  const handleToggleSign = () => {
    if (display === '0' || display === 'Error') return;
    setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
  };

  const handlePercent = () => {
    try {
      const val = parseFloat(display);
      if (!isNaN(val)) {
        setDisplay(String(val / 100));
      }
    } catch {
      setDisplay('Error');
    }
  };

  const calculateResult = useCallback(() => {
    try {
      const fullExpr = `${equation} ${display}`.trim();
      if (!fullExpr) return;

      // Safe evaluation parser
      // Convert display symbols to JS math
      let expr = fullExpr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');

      // Sanitize
      const sanitized = expr.replace(/[^0-9+\-*/().eE]/g, '');
      if (!sanitized) return;

      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      
      if (typeof result === 'number' && !isNaN(result)) {
        const formatted = Number.isInteger(result) ? String(result) : String(Number(result.toFixed(8)));
        setHistory((prev) => [
          { eq: fullExpr, res: formatted, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ...prev.slice(0, 19)
        ]);
        setDisplay(formatted);
        setEquation('');
      } else {
        setDisplay('Error');
      }
    } catch {
      setDisplay('Error');
    }
  }, [equation, display]);

  // Scientific functions
  const handleSciFunction = (func: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = 0;
    const labelMap: Record<string, string> = {
      sin: `sin(${val})`,
      cos: `cos(${val})`,
      tan: `tan(${val})`,
      sin_inv: `sin⁻¹(${val})`,
      cos_inv: `cos⁻¹(${val})`,
      tan_inv: `tan⁻¹(${val})`,
      sqrt: `√(${val})`,
      sqr: `(${val})²`,
      cube: `(${val})³`,
      log: `log(${val})`,
      ln: `ln(${val})`,
      '1/x': `1/(${val})`,
      pi: 'π',
      e: 'e'
    };

    switch (func) {
      case 'sin':
        res = Math.sin(isRad ? val : (val * Math.PI) / 180);
        break;
      case 'cos':
        res = Math.cos(isRad ? val : (val * Math.PI) / 180);
        break;
      case 'tan':
        res = Math.tan(isRad ? val : (val * Math.PI) / 180);
        break;
      case 'sin_inv':
      case 'asin':
        if (val < -1 || val > 1) {
          res = NaN;
        } else {
          const rad = Math.asin(val);
          res = isRad ? rad : (rad * 180) / Math.PI;
        }
        break;
      case 'cos_inv':
      case 'acos':
        if (val < -1 || val > 1) {
          res = NaN;
        } else {
          const rad = Math.acos(val);
          res = isRad ? rad : (rad * 180) / Math.PI;
        }
        break;
      case 'tan_inv':
      case 'atan':
        {
          const rad = Math.atan(val);
          res = isRad ? rad : (rad * 180) / Math.PI;
        }
        break;
      case 'sqrt':
        res = val >= 0 ? Math.sqrt(val) : NaN;
        break;
      case 'sqr':
        res = Math.pow(val, 2);
        break;
      case 'cube':
        res = Math.pow(val, 3);
        break;
      case 'log':
        res = val > 0 ? Math.log10(val) : NaN;
        break;
      case 'ln':
        res = val > 0 ? Math.log(val) : NaN;
        break;
      case '1/x':
        res = val !== 0 ? 1 / val : NaN;
        break;
      case 'pi':
        res = Math.PI;
        break;
      case 'e':
        res = Math.E;
        break;
      default:
        return;
    }

    if (isNaN(res)) {
      setDisplay('Error');
    } else {
      const formatted = Number.isInteger(res) ? String(res) : String(Number(res.toFixed(8)));
      setDisplay(formatted);
      const label = labelMap[func] || `${func}(${val})`;
      setEquation(`${label} =`);
      setHistory((prev) => [
        { eq: label, res: formatted, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ...prev.slice(0, 19)
      ]);
    }
  };

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is focused elsewhere
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('-');
      } else if (e.key === '*') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculateResult();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [calculateResult]);

  const copyResult = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorLayout calc={meta}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Calculator Body */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          
          {/* Top Options Bar */}
          <div className="flex items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsScientific(!isScientific)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isScientific 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isScientific ? 'Scientific: ON' : 'Scientific: OFF'}
              </button>

              {isScientific && (
                <button
                  onClick={() => setIsRad(!isRad)}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  {isRad ? 'RAD' : 'DEG'}
                </button>
              )}
            </div>

            {/* Memory indicators */}
            <div className="flex items-center gap-1 text-[11px] font-mono font-semibold">
              <button
                onClick={() => setMemory(0)}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-500 cursor-pointer"
                title="Clear Memory (MC)"
              >
                MC
              </button>
              <button
                onClick={() => setDisplay(String(memory))}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-500 cursor-pointer"
                title="Recall Memory (MR)"
              >
                MR ({memory})
              </button>
              <button
                onClick={() => setMemory((m) => m + (parseFloat(display) || 0))}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-500 cursor-pointer"
                title="Add to Memory (M+)"
              >
                M+
              </button>
            </div>
          </div>

          {/* Calculator Screen Display */}
          <div className="relative mb-6 p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-right font-mono overflow-hidden">
            <div className="h-6 text-xs text-slate-400 dark:text-slate-500 truncate mb-1">
              {equation || '\u00A0'}
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight break-all">
              {display}
            </div>
            
            <button
              onClick={copyResult}
              className="absolute top-3 left-3 p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="Copy result"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Keypad */}
          <div className="space-y-3">
            {/* Scientific Extra Row */}
            {isScientific && (
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 animate-in fade-in duration-200">
                {SCI_BUTTONS.map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => handleSciFunction(btn.id)}
                    title={btn.title}
                    className={`p-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                      btn.id === 'sin_inv' || btn.id === 'cos_inv'
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}

            {/* Standard Keypad Grid */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {/* Row 1 */}
              <button
                onClick={handleClear}
                className="p-3.5 sm:p-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-base sm:text-lg transition-all active:scale-95 cursor-pointer"
              >
                AC
              </button>
              <button
                onClick={handleBackspace}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-base sm:text-lg transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                title="Backspace"
              >
                <Delete className="w-5 h-5" />
              </button>
              <button
                onClick={handlePercent}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-base sm:text-lg transition-all active:scale-95 cursor-pointer"
              >
                %
              </button>
              <button
                onClick={() => handleOperator('÷')}
                className="p-3.5 sm:p-4 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xl transition-all active:scale-95 cursor-pointer"
              >
                ÷
              </button>

              {/* Row 2 */}
              {['7', '8', '9'].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDigit(d)}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-lg sm:text-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => handleOperator('×')}
                className="p-3.5 sm:p-4 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xl transition-all active:scale-95 cursor-pointer"
              >
                ×
              </button>

              {/* Row 3 */}
              {['4', '5', '6'].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDigit(d)}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-lg sm:text-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => handleOperator('−')}
                className="p-3.5 sm:p-4 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xl transition-all active:scale-95 cursor-pointer"
              >
                −
              </button>

              {/* Row 4 */}
              {['1', '2', '3'].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDigit(d)}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-lg sm:text-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => handleOperator('+')}
                className="p-3.5 sm:p-4 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xl transition-all active:scale-95 cursor-pointer"
              >
                +
              </button>

              {/* Row 5 */}
              <button
                onClick={handleToggleSign}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold text-base sm:text-lg border border-slate-200/50 dark:border-slate-700/50 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                ±
              </button>
              <button
                onClick={() => handleDigit('0')}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-lg sm:text-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                0
              </button>
              <button
                onClick={handleDecimal}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-lg sm:text-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                .
              </button>
              <button
                onClick={calculateResult}
                className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-2xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
              >
                =
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-slate-400">
            Keyboard supported: Type 0-9, +, -, *, /, Enter, Backspace, Esc
          </div>

        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">History</h3>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                title="Clear history"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {history.length > 0 ? (
              history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setDisplay(item.res)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/50 dark:border-slate-800 transition-all cursor-pointer group text-right font-mono"
                >
                  <div className="text-[11px] text-slate-400 group-hover:text-indigo-400 flex items-center justify-between">
                    <span>{item.time}</span>
                    <span className="truncate max-w-[150px]">{item.eq}</span>
                  </div>
                  <div className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    = {item.res}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-4">
                <RotateCcw className="w-8 h-8 opacity-40 mb-2" />
                <p className="text-xs">No calculations yet.</p>
                <p className="text-[11px] opacity-60">Results will appear here automatically.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </CalculatorLayout>
  );
};
