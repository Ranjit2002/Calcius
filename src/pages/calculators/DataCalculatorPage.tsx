import React, { useState } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { HardDrive, ArrowRightLeft, Clock, Wifi, Film, Music, Image as ImageIcon } from 'lucide-react';

const DATA_UNITS: Record<string, { name: string; bytes: number; symbol: string }> = {
  b: { name: 'Bit', bytes: 0.125, symbol: 'b' },
  B: { name: 'Byte', bytes: 1, symbol: 'B' },
  KB: { name: 'Kilobyte (10³)', bytes: 1000, symbol: 'KB' },
  KiB: { name: 'Kibibyte (2¹⁰)', bytes: 1024, symbol: 'KiB' },
  MB: { name: 'Megabyte (10⁶)', bytes: 1000000, symbol: 'MB' },
  MiB: { name: 'Mebibyte (2²⁰)', bytes: 1048576, symbol: 'MiB' },
  GB: { name: 'Gigabyte (10⁹)', bytes: 1000000000, symbol: 'GB' },
  GiB: { name: 'Gibibyte (2³⁰)', bytes: 1073741824, symbol: 'GiB' },
  TB: { name: 'Terabyte (10¹²)', bytes: 1000000000000, symbol: 'TB' },
  TiB: { name: 'Tebibyte (2⁴⁰)', bytes: 1099511627776, symbol: 'TiB' },
  PB: { name: 'Petabyte (10¹⁵)', bytes: 1000000000000000, symbol: 'PB' },
};

export const DataCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'data')!;

  const [activeTab, setActiveTab] = useState<'converter' | 'transfer'>('converter');
  
  // Converter
  const [val, setVal] = useState('64');
  const [fromUnit, setFromUnit] = useState('GB');
  const [toUnit, setToUnit] = useState('MB');

  // Transfer Time
  const [fileSize, setFileSize] = useState('50');
  const [fileUnit, setFileUnit] = useState('GB');
  const [speedVal, setSpeedVal] = useState('100');
  const [speedUnit, setSpeedUnit] = useState('Mbps'); // Mbps, Gbps, MB/s

  const numVal = parseFloat(val) || 0;
  const inBytes = numVal * (DATA_UNITS[fromUnit]?.bytes || 1);
  const converted = inBytes / (DATA_UNITS[toUnit]?.bytes || 1);

  // Transfer duration calculation
  const fSizeNum = parseFloat(fileSize) || 0;
  const fileBytes = fSizeNum * (DATA_UNITS[fileUnit]?.bytes || 1);
  const fileBits = fileBytes * 8;

  let speedBitsPerSec = 1;
  const sNum = parseFloat(speedVal) || 1;
  if (speedUnit === 'Mbps') speedBitsPerSec = sNum * 1000000;
  else if (speedUnit === 'Gbps') speedBitsPerSec = sNum * 1000000000;
  else if (speedUnit === 'MB/s') speedBitsPerSec = sNum * 8000000;
  else if (speedUnit === 'Kbps') speedBitsPerSec = sNum * 1000;

  const totalSeconds = speedBitsPerSec > 0 ? fileBits / speedBitsPerSec : 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // Storage equivalents (based on GB)
  const inGB = inBytes / 1000000000;
  const photos = Math.floor(inGB * 250); // ~4MB photo
  const songs = Math.floor(inGB * 125); // ~8MB song
  const hdMovies = (inGB / 4).toFixed(1); // ~4GB movie

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-8">
        
        {/* Tab selection */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
          <button
            onClick={() => setActiveTab('converter')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'converter'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Storage Converter</span>
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'transfer'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span>Download Time Estimator</span>
          </button>
        </div>

        {activeTab === 'converter' ? (
          <div className="space-y-6">
            
            {/* 2-Way Box */}
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
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm"
                  >
                    {Object.entries(DATA_UNITS).map(([k, item]) => (
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
                    className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 hover:scale-110 active:rotate-180 transition-all cursor-pointer shadow-xs border border-sky-500/20"
                    title="Swap Units"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                  </button>
                </div>

                <div className="md:col-span-5 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Converted Result
                  </label>
                  <div className="w-full px-4 py-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-500/30 text-sky-700 dark:text-sky-400 font-mono font-bold text-xl truncate">
                    {converted.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </div>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm"
                  >
                    {Object.entries(DATA_UNITS).map(([k, item]) => (
                      <option key={k} value={k}>
                        {item.name} ({item.symbol})
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* Storage Capacity Visualizer */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                What fits in {val} {DATA_UNITS[fromUnit]?.name}?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                      ~{photos.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">High-Res Photos (12MP)</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                      ~{songs.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">Audio Tracks (320kbps)</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                      ~{hdMovies}
                    </div>
                    <div className="text-xs text-slate-400">Full HD Movies (1080p)</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Transfer Time Calculator */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-500" />
              <span>Download & Upload Time Calculator</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  File Size
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  />
                  <select
                    value={fileUnit}
                    onChange={(e) => setFileUnit(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
                  >
                    <option value="MB">MB</option>
                    <option value="GB">GB</option>
                    <option value="TB">TB</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Internet Speed / Bandwidth
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={speedVal}
                    onChange={(e) => setSpeedVal(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  />
                  <select
                    value={speedUnit}
                    onChange={(e) => setSpeedUnit(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
                  >
                    <option value="Mbps">Mbps (Megabits/sec)</option>
                    <option value="Gbps">Gbps (Gigabits/sec)</option>
                    <option value="MB/s">MB/s (Megabytes/sec)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Time Estimate Highlight */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase font-bold text-sky-200">Estimated Duration</div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono mt-1">
                  {hours > 0 && `${hours} hrs `}
                  {minutes > 0 && `${minutes} mins `}
                  {seconds} secs
                </div>
              </div>
              <div className="text-xs text-sky-100 bg-white/10 px-3 py-2 rounded-xl">
                Assuming uninterrupted network line
              </div>
            </div>

          </div>
        )}

      </div>
    </CalculatorLayout>
  );
};
