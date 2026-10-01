import React, { useState } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { Shapes, ArrowRightLeft, Copy, Check } from 'lucide-react';

const AREA_UNITS: Record<string, { name: string; toSqMeter: number; symbol: string }> = {
  sq_m: { name: 'Square Meter', toSqMeter: 1, symbol: 'm²' },
  sq_km: { name: 'Square Kilometer', toSqMeter: 1000000, symbol: 'km²' },
  sq_cm: { name: 'Square Centimeter', toSqMeter: 0.0001, symbol: 'cm²' },
  sq_mm: { name: 'Square Millimeter', toSqMeter: 0.000001, symbol: 'mm²' },
  sq_ft: { name: 'Square Foot', toSqMeter: 0.092903, symbol: 'ft²' },
  sq_yd: { name: 'Square Yard', toSqMeter: 0.836127, symbol: 'yd²' },
  sq_mi: { name: 'Square Mile', toSqMeter: 2589988.11, symbol: 'mi²' },
  acre: { name: 'Acre', toSqMeter: 4046.85642, symbol: 'ac' },
  hectare: { name: 'Hectare', toSqMeter: 10000, symbol: 'ha' },
  bigha: { name: 'Bigha (Standard)', toSqMeter: 2529.29, symbol: 'bigha' },
  guntha: { name: 'Guntha', toSqMeter: 101.17, symbol: 'guntha' },
};

type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'trapezoid' | 'square';

export const AreaCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'area')!;

  const [activeTab, setActiveTab] = useState<'converter' | 'shapes'>('converter');
  
  // Converter state
  const [val, setVal] = useState('100');
  const [fromUnit, setFromUnit] = useState('sq_m');
  const [toUnit, setToUnit] = useState('sq_ft');
  const [copied, setCopied] = useState(false);

  // Shape state
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rectangle');
  const [rectWidth, setRectWidth] = useState('10');
  const [rectLength, setRectLength] = useState('15');
  const [circleRadius, setCircleRadius] = useState('5');
  const [triBase, setTriBase] = useState('8');
  const [triHeight, setTriHeight] = useState('12');
  const [trapA, setTrapA] = useState('6');
  const [trapB, setTrapB] = useState('10');
  const [trapH, setTrapH] = useState('5');
  const [squareSide, setSquareSide] = useState('8');

  // Convert
  const numVal = parseFloat(val) || 0;
  const inSqMeters = numVal * (AREA_UNITS[fromUnit]?.toSqMeter || 1);
  const convertedResult = inSqMeters / (AREA_UNITS[toUnit]?.toSqMeter || 1);

  // Shape Calculation
  let shapeAreaSqM = 0;
  let shapeFormula = '';
  switch (selectedShape) {
    case 'rectangle':
      shapeAreaSqM = (parseFloat(rectWidth) || 0) * (parseFloat(rectLength) || 0);
      shapeFormula = 'Area = Length × Width';
      break;
    case 'square':
      shapeAreaSqM = Math.pow(parseFloat(squareSide) || 0, 2);
      shapeFormula = 'Area = Side²';
      break;
    case 'circle':
      shapeAreaSqM = Math.PI * Math.pow(parseFloat(circleRadius) || 0, 2);
      shapeFormula = 'Area = π × r²';
      break;
    case 'triangle':
      shapeAreaSqM = 0.5 * (parseFloat(triBase) || 0) * (parseFloat(triHeight) || 0);
      shapeFormula = 'Area = ½ × Base × Height';
      break;
    case 'trapezoid':
      shapeAreaSqM = 0.5 * ((parseFloat(trapA) || 0) + (parseFloat(trapB) || 0)) * (parseFloat(trapH) || 0);
      shapeFormula = 'Area = ½ × (Base A + Base B) × Height';
      break;
  }

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-8">
        
        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
          <button
            onClick={() => setActiveTab('converter')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'converter'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Unit Converter</span>
          </button>
          <button
            onClick={() => setActiveTab('shapes')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'shapes'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shapes className="w-4 h-4" />
            <span>Geometric Shapes</span>
          </button>
        </div>

        {activeTab === 'converter' ? (
          <div className="space-y-6">
            
            {/* Interactive Converter Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                
                {/* From Input */}
                <div className="md:col-span-5 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    From Value
                  </label>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer"
                  >
                    {Object.entries(AREA_UNITS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.name} ({item.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <div className="md:col-span-1 flex justify-center py-2">
                  <button
                    onClick={swapUnits}
                    className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:scale-110 active:rotate-180 transition-all cursor-pointer shadow-xs border border-emerald-500/20"
                    title="Swap Units"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                  </button>
                </div>

                {/* To Output */}
                <div className="md:col-span-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Converted Result
                    </label>
                    <button
                      onClick={() => handleCopy(String(convertedResult))}
                      className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  
                  <div className="w-full px-4 py-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xl truncate">
                    {convertedResult.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </div>

                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer"
                  >
                    {Object.entries(AREA_UNITS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.name} ({item.symbol})
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* Simultaneous Multi-Unit Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                Simultaneous Conversions for {val} {AREA_UNITS[fromUnit]?.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(AREA_UNITS).map(([key, item]) => {
                  const res = inSqMeters / item.toSqMeter;
                  return (
                    <div 
                      key={key} 
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs text-slate-400">{item.name}</div>
                        <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                          {res.toLocaleString(undefined, { maximumFractionDigits: 4 })} {item.symbol}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(String(res))}
                        className="text-slate-400 hover:text-emerald-500 p-1"
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          /* Geometric Shapes Solver */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Shapes selection list */}
            <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xl space-y-1.5">
              {[
                { id: 'rectangle', name: 'Rectangle', desc: 'Length × Width' },
                { id: 'square', name: 'Square', desc: 'Side²' },
                { id: 'circle', name: 'Circle', desc: 'π × Radius²' },
                { id: 'triangle', name: 'Triangle', desc: '½ × Base × Height' },
                { id: 'trapezoid', name: 'Trapezoid', desc: '½ × (A + B) × Height' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedShape(s.id as ShapeType)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer ${
                    selectedShape === s.id
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/25'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className={`text-xs ${selectedShape === s.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {s.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Inputs & Calculation for selected shape */}
            <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                  {shapeFormula}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white capitalize mt-1">
                  {selectedShape} Area Calculator
                </h3>
              </div>

              {/* Dynamic Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedShape === 'rectangle' && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-slate-400">Length (units)</label>
                      <input
                        type="number"
                        value={rectLength}
                        onChange={(e) => setRectLength(e.target.value)}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400">Width (units)</label>
                      <input
                        type="number"
                        value={rectWidth}
                        onChange={(e) => setRectWidth(e.target.value)}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </>
                )}

                {selectedShape === 'square' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Side Length (units)</label>
                    <input
                      type="number"
                      value={squareSide}
                      onChange={(e) => setSquareSide(e.target.value)}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                {selectedShape === 'circle' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Radius (r)</label>
                    <input
                      type="number"
                      value={circleRadius}
                      onChange={(e) => setCircleRadius(e.target.value)}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                {selectedShape === 'triangle' && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-slate-400">Base</label>
                      <input
                        type="number"
                        value={triBase}
                        onChange={(e) => setTriBase(e.target.value)}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400">Height</label>
                      <input
                        type="number"
                        value={triHeight}
                        onChange={(e) => setTriHeight(e.target.value)}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </>
                )}

                {selectedShape === 'trapezoid' && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-slate-400">Parallel Base A</label>
                      <input
                        type="number"
                        value={trapA}
                        onChange={(e) => setTrapA(e.target.value)}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400">Parallel Base B</label>
                      <input
                        type="number"
                        value={trapB}
                        onChange={(e) => setTrapB(e.target.value)}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400">Height (h)</label>
                      <input
                        type="number"
                        value={trapH}
                        onChange={(e) => setTrapH(e.target.value)}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Result Container */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase font-bold text-emerald-200">Total Calculated Area</div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono mt-1">
                    {shapeAreaSqM.toLocaleString(undefined, { maximumFractionDigits: 4 })} <span className="text-lg font-normal">sq units</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(String(shapeAreaSqM))}
                  className="px-4 py-2 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </CalculatorLayout>
  );
};
