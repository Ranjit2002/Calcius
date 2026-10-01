import React, { useState } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { Activity, Heart } from 'lucide-react';

export const BMICalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'bmi')!;

  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  
  // Metric inputs
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('70');

  // Imperial inputs
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('9');
  const [weightLbs, setWeightLbs] = useState('155');

  // Age & Gender
  const [age, setAge] = useState('28');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // Calculations
  let hMeter = 0;
  let wKg = 0;

  if (unitSystem === 'metric') {
    hMeter = (parseFloat(heightCm) || 0) / 100;
    wKg = parseFloat(weightKg) || 0;
  } else {
    const totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
    hMeter = totalInches * 0.0254;
    wKg = (parseFloat(weightLbs) || 0) * 0.45359237;
  }

  const bmi = hMeter > 0 ? wKg / (hMeter * hMeter) : 0;
  const bmiFormatted = bmi > 0 ? Number(bmi.toFixed(1)) : 0;

  // Ideal weight range for height (BMI 18.5 - 24.9)
  const minIdealKg = hMeter > 0 ? 18.5 * (hMeter * hMeter) : 0;
  const maxIdealKg = hMeter > 0 ? 24.9 * (hMeter * hMeter) : 0;

  let category = 'Normal Weight';
  let bgBadge = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  let healthTip = 'You are in a healthy weight range! Maintain your balanced diet and physical activity.';

  if (bmiFormatted < 18.5) {
    category = 'Underweight';
    bgBadge = 'bg-sky-500/10 text-sky-500 border-sky-500/20';
    healthTip = 'You may need to gain some weight in a healthy way with nutrient-rich foods and strength exercises.';
  } else if (bmiFormatted >= 25 && bmiFormatted < 30) {
    category = 'Overweight';
    bgBadge = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    healthTip = 'Consider moderate aerobic exercise, portion moderation, and consulting a nutritionist.';
  } else if (bmiFormatted >= 30) {
    category = 'Obesity';
    bgBadge = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    healthTip = 'We recommend discussing structured lifestyle adjustments and regular exercise with your healthcare provider.';
  }

  // Calculate percentage pointer along scale (15 to 40)
  const pointerPercent = Math.min(Math.max(((bmiFormatted - 15) / (40 - 15)) * 100, 0), 100);

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-8">
        
        {/* Unit Toggle & Inputs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              <span>Your Body Metrics</span>
            </h2>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              <button
                onClick={() => setUnitSystem('metric')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  unitSystem === 'metric'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Metric (cm / kg)
              </button>
              <button
                onClick={() => setUnitSystem('imperial')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  unitSystem === 'imperial'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Imperial (ft+in / lbs)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Gender */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Gender
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    gender === 'male'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Male ♂
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    gender === 'female'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Female ♀
                </button>
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full mt-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>

            {/* Height */}
            {unitSystem === 'metric' ? (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full mt-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Height (ft & in)
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={heightFt}
                    placeholder="Feet"
                    onChange={(e) => setHeightFt(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  />
                  <input
                    type="number"
                    value={heightIn}
                    placeholder="Inches"
                    onChange={(e) => setHeightIn(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>
            )}

            {/* Weight */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                value={unitSystem === 'metric' ? weightKg : weightLbs}
                onChange={(e) => {
                  if (unitSystem === 'metric') {
                    setWeightKg(e.target.value);
                  } else {
                    setWeightLbs(e.target.value);
                  }
                }}
                className="w-full mt-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Results Banner & Visual Gauge */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Calculated Body Mass Index
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white font-mono">
                  {bmiFormatted}
                </span>
                <span className={`text-base font-bold px-3 py-1 rounded-full border ${bgBadge}`}>
                  {category}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="text-xs text-slate-400 font-medium">Healthy Weight Range for your height</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                {unitSystem === 'metric' 
                  ? `${minIdealKg.toFixed(1)} kg - ${maxIdealKg.toFixed(1)} kg`
                  : `${(minIdealKg * 2.20462).toFixed(1)} lbs - ${(maxIdealKg * 2.20462).toFixed(1)} lbs`
                }
              </div>
            </div>
          </div>

          {/* Interactive Multi-color Gradient Scale */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>Underweight (&lt;18.5)</span>
              <span>Normal (18.5 - 24.9)</span>
              <span>Overweight (25 - 29.9)</span>
              <span>Obese (30+)</span>
            </div>

            <div className="relative h-5 rounded-full overflow-hidden flex shadow-inner">
              <div className="w-[14%] bg-sky-400" title="Underweight" />
              <div className="w-[26%] bg-emerald-500" title="Normal" />
              <div className="w-[20%] bg-amber-400" title="Overweight" />
              <div className="w-[40%] bg-rose-500" title="Obese" />
            </div>

            {/* Slider pointer indicator */}
            <div className="relative h-6">
              <div 
                className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
                style={{ left: `${pointerPercent}%` }}
              >
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-purple-600 dark:border-b-purple-400" />
                <span className="text-[11px] font-extrabold font-mono text-purple-600 dark:text-purple-400">
                  {bmiFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Health Recommendation Box */}
          <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/50 flex items-start gap-3.5">
            <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300">
                Health Insights
              </h4>
              <p className="text-xs text-purple-800 dark:text-purple-200 mt-1 leading-relaxed">
                {healthTip}
              </p>
            </div>
          </div>

        </div>

      </div>
    </CalculatorLayout>
  );
};
