import React, { useState, useEffect, useMemo } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { 
  Calendar, 
  Gift, 
  Clock, 
  Star, 
  PartyPopper,
  Hourglass,
  CalendarDays,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AgeCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'age')!;

  // Default Date of Birth: 01 / 01 / 2000
  const [birthDay, setBirthDay] = useState('01');
  const [birthMonth, setBirthMonth] = useState('01');
  const [birthYear, setBirthYear] = useState('2000');

  const today = useMemo(() => new Date(), []);
  const [targetDay, setTargetDay] = useState(String(today.getDate()).padStart(2, '0'));
  const [targetMonth, setTargetMonth] = useState(String(today.getMonth() + 1).padStart(2, '0'));
  const [targetYear, setTargetYear] = useState(String(today.getFullYear()));

  // Live seconds ticker for precision countdown
  const [currentSec, setCurrentSec] = useState(new Date().getSeconds());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSec(new Date().getSeconds());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger flower/confetti animation strictly ONE TIME when user visits the page
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const [ageStats, setAgeStats] = useState({
    years: 0,
    months: 0,
    days: 0,
    totalMonths: 0,
    totalWeeks: 0,
    totalDays: 0,
    totalHours: 0,
    totalMinutes: 0,
    totalSeconds: 0,
    nextBirthdayMonthsRem: 0,
    nextBirthdayDaysRem: 0,
    nextBirthdayDayOfWeek: '',
    nextBirthdayFormattedDate: '',
    nextBirthdayTotalDays: 0,
    nextBirthdayTotalHours: 0,
    nextBirthdayTotalMinutes: 0,
    nextBirthdayTotalSeconds: 0,
    birthDayOfWeek: '',
    birthFormattedDate: '',
    zodiacSign: '',
    chineseZodiac: '',
    isBirthdayToday: false,
    isValid: true
  });

  // Bulletproof Western Zodiac sign calculation
  const getZodiac = (day: number, month: number): string => {
    if (isNaN(day) || isNaN(month) || month < 1 || month > 12 || day < 1 || day > 31) {
      return '—';
    }
    const signs = [
      { name: 'Capricorn ♑', endDay: 19 }, // Jan (1)
      { name: 'Aquarius ♒', endDay: 18 },  // Feb (2)
      { name: 'Pisces ♓', endDay: 20 },    // Mar (3)
      { name: 'Aries ♈', endDay: 19 },     // Apr (4)
      { name: 'Taurus ♉', endDay: 20 },    // May (5)
      { name: 'Gemini ♊', endDay: 20 },    // Jun (6)
      { name: 'Cancer ♋', endDay: 22 },    // Jul (7)
      { name: 'Leo ♌', endDay: 22 },       // Aug (8)
      { name: 'Virgo ♍', endDay: 22 },     // Sep (9)
      { name: 'Libra ♎', endDay: 22 },     // Oct (10)
      { name: 'Scorpio ♏', endDay: 21 },   // Nov (11)
      { name: 'Sagittarius ♐', endDay: 21 } // Dec (12)
    ];

    const idx = month - 1;
    const currentSign = signs[idx];
    if (!currentSign) return '—';

    if (day <= currentSign.endDay) {
      return currentSign.name;
    }
    const nextSign = signs[(idx + 1) % 12];
    return nextSign ? nextSign.name : '—';
  };

  // Bulletproof Chinese Zodiac calculation with positive modulo
  const getChineseZodiac = (year: number): string => {
    if (isNaN(year) || year < 1) return '—';
    const animals = ['Rat 🐀', 'Ox 🐂', 'Tiger 🐅', 'Rabbit 🐇', 'Dragon 🐉', 'Snake 🐍', 'Horse 🐎', 'Goat 🐐', 'Monkey 🐒', 'Rooster 🐓', 'Dog 🐕', 'Pig 🐖'];
    const index = ((year - 4) % 12 + 12) % 12;
    return animals[index] || '—';
  };

  // Safe calculation effect that never crashes on partial/intermediate inputs
  useEffect(() => {
    const bD = parseInt(birthDay, 10);
    const bM = parseInt(birthMonth, 10); // 1-12
    const bY = parseInt(birthYear, 10);

    const tD = parseInt(targetDay, 10);
    const tM = parseInt(targetMonth, 10);
    const tY = parseInt(targetYear, 10);

    // If input is currently incomplete, out of bounds, or NaN, skip calculation safely without throwing
    if (
      isNaN(bD) || isNaN(bM) || isNaN(bY) ||
      isNaN(tD) || isNaN(tM) || isNaN(tY) ||
      bD < 1 || bD > 31 ||
      bM < 1 || bM > 12 ||
      bY < 1850 || bY > 2150 ||
      tD < 1 || tD > 31 ||
      tM < 1 || tM > 12 ||
      tY < 1850 || tY > 2150
    ) {
      return;
    }

    // Construct dates using 0-indexed month
    const birth = new Date(bY, bM - 1, bD);
    const target = new Date(tY, tM - 1, tD);

    // Check calendar validity (e.g. Feb 31 or invalid date rollover) and date order
    if (
      isNaN(birth.getTime()) ||
      isNaN(target.getTime()) ||
      birth.getFullYear() !== bY ||
      birth.getMonth() !== (bM - 1) ||
      birth.getDate() !== bD ||
      target.getFullYear() !== tY ||
      target.getMonth() !== (tM - 1) ||
      target.getDate() !== tD ||
      target < birth
    ) {
      return;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Next Birthday calculation
    const currentYear = target.getFullYear();
    let nextBday = new Date(currentYear, bM - 1, bD);
    if (nextBday < target) {
      nextBday = new Date(currentYear + 1, bM - 1, bD);
    }

    const isBirthdayToday = (bM - 1 === target.getMonth() && bD === target.getDate());

    let remMonths = nextBday.getMonth() - target.getMonth();
    let remDays = nextBday.getDate() - target.getDate();

    if (remDays < 0) {
      remMonths--;
      const prevMonth = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0);
      remDays += prevMonth.getDate();
    }
    if (remMonths < 0) {
      remMonths += 12;
    }

    const bdayDiffMs = Math.max(nextBday.getTime() - target.getTime(), 0);
    const nextBdayTotalDays = Math.ceil(bdayDiffMs / (1000 * 60 * 60 * 24));
    const nextBdayTotalHours = nextBdayTotalDays * 24;
    const nextBdayTotalMinutes = nextBdayTotalHours * 60;
    const nextBdayTotalSeconds = nextBdayTotalMinutes * 60;

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const birthDayOfWeek = daysOfWeek[birth.getDay()] || '';
    const nextBirthdayDayOfWeek = daysOfWeek[nextBday.getDay()] || '';

    const birthFormattedDate = `${String(bD).padStart(2, '0')}/${String(bM).padStart(2, '0')}/${bY}`;
    const nextBirthdayFormattedDate = `${String(bD).padStart(2, '0')}/${String(bM).padStart(2, '0')}/${nextBday.getFullYear()}`;

    setAgeStats({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      nextBirthdayMonthsRem: isBirthdayToday ? 0 : remMonths,
      nextBirthdayDaysRem: isBirthdayToday ? 0 : remDays,
      nextBirthdayDayOfWeek,
      nextBirthdayFormattedDate,
      nextBirthdayTotalDays: isBirthdayToday ? 0 : nextBdayTotalDays,
      nextBirthdayTotalHours: isBirthdayToday ? 0 : nextBdayTotalHours,
      nextBirthdayTotalMinutes: isBirthdayToday ? 0 : nextBdayTotalMinutes,
      nextBirthdayTotalSeconds: isBirthdayToday ? 0 : nextBdayTotalSeconds,
      birthDayOfWeek,
      birthFormattedDate,
      zodiacSign: getZodiac(bD, bM),
      chineseZodiac: getChineseZodiac(bY),
      isBirthdayToday,
      isValid: true
    });
  }, [birthDay, birthMonth, birthYear, targetDay, targetMonth, targetYear, currentSec]);

  const triggerCelebrate = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  // Mobile-friendly input handlers:
  // - onChange extracts only numeric digits without premature padding (prevents "00" bug on backspace)
  // - onBlur normalizes with leading zero and clamps values safely
  const handleDayChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, '').slice(0, 2);
      setter(val);
    };

  const handleMonthChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, '').slice(0, 2);
      setter(val);
    };

  const handleYearChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
      setter(val);
    };

  const handleBlurDay = (val: string, setter: React.Dispatch<React.SetStateAction<string>>, fallback: string) => () => {
    const num = parseInt(val, 10);
    if (!val || isNaN(num) || num < 1) {
      setter(fallback);
    } else if (num > 31) {
      setter('31');
    } else {
      setter(String(num).padStart(2, '0'));
    }
  };

  const handleBlurMonth = (val: string, setter: React.Dispatch<React.SetStateAction<string>>, fallback: string) => () => {
    const num = parseInt(val, 10);
    if (!val || isNaN(num) || num < 1) {
      setter(fallback);
    } else if (num > 12) {
      setter('12');
    } else {
      setter(String(num).padStart(2, '0'));
    }
  };

  const handleBlurYear = (val: string, setter: React.Dispatch<React.SetStateAction<string>>, fallback: string) => () => {
    const num = parseInt(val, 10);
    if (!val || isNaN(num) || num < 1900) {
      setter(fallback);
    } else if (num > 2100) {
      setter('2100');
    } else {
      setter(String(num));
    }
  };

  // Safe date string for native date picker (YYYY-MM-DD)
  const safeBirthDateValue = useMemo(() => {
    const y = parseInt(birthYear, 10);
    const m = parseInt(birthMonth, 10);
    const d = parseInt(birthDay, 10);
    if (birthYear.length === 4 && y >= 1900 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
    }
    return '';
  }, [birthYear, birthMonth, birthDay]);

  const safeTargetDateValue = useMemo(() => {
    const y = parseInt(targetYear, 10);
    const m = parseInt(targetMonth, 10);
    const d = parseInt(targetDay, 10);
    if (targetYear.length === 4 && y >= 1900 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${targetYear}-${targetMonth.padStart(2, '0')}-${targetDay.padStart(2, '0')}`;
    }
    return '';
  }, [targetYear, targetMonth, targetDay]);

  const handleNativeDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // YYYY-MM-DD
    if (val) {
      const parts = val.split('-');
      if (parts.length === 3) {
        setBirthYear(parts[0]);
        setBirthMonth(parts[1]);
        setBirthDay(parts[2]);
      }
    }
  };

  const handleNativeTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      const parts = val.split('-');
      if (parts.length === 3) {
        setTargetYear(parts[0]);
        setTargetMonth(parts[1]);
        setTargetDay(parts[2]);
      }
    }
  };

  const resetToDefault = () => {
    setBirthDay('01');
    setBirthMonth('01');
    setBirthYear('2000');
    const now = new Date();
    setTargetDay(String(now.getDate()).padStart(2, '0'));
    setTargetMonth(String(now.getMonth() + 1).padStart(2, '0'));
    setTargetYear(String(now.getFullYear()));
  };

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
        
        {/* Date Pickers Card (DD/MM/YYYY) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-500 shrink-0" />
              <span>Select Dates (DD / MM / YYYY)</span>
            </h2>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] sm:text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                Format: DD/MM/YYYY
              </span>
              <button
                onClick={resetToDefault}
                className="text-[11px] sm:text-xs font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                title="Reset to 01/01/2000"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Reset</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Date of Birth Inputs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Date of Birth (DD / MM / YYYY)
                </label>
                <span className="text-xs text-slate-400 font-mono font-semibold">
                  {birthDay.padStart(2, '0')}/{birthMonth.padStart(2, '0')}/{birthYear}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block font-semibold">Day (DD)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    maxLength={2}
                    value={birthDay}
                    onChange={handleDayChange(setBirthDay)}
                    onBlur={handleBlurDay(birthDay, setBirthDay, '01')}
                    className="w-full px-2 sm:px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-base sm:text-lg text-center focus:ring-2 focus:ring-pink-500 focus:outline-none transition-colors"
                    placeholder="DD"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block font-semibold">Month (MM)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    maxLength={2}
                    value={birthMonth}
                    onChange={handleMonthChange(setBirthMonth)}
                    onBlur={handleBlurMonth(birthMonth, setBirthMonth, '01')}
                    className="w-full px-2 sm:px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-base sm:text-lg text-center focus:ring-2 focus:ring-pink-500 focus:outline-none transition-colors"
                    placeholder="MM"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block font-semibold">Year (YYYY)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    maxLength={4}
                    value={birthYear}
                    onChange={handleYearChange(setBirthYear)}
                    onBlur={handleBlurYear(birthYear, setBirthYear, '2000')}
                    className="w-full px-2 sm:px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-base sm:text-lg text-center focus:ring-2 focus:ring-pink-500 focus:outline-none transition-colors"
                    placeholder="YYYY"
                  />
                </div>
              </div>

              {/* Native Date Picker alternative */}
              <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span>Or pick from calendar:</span>
                <input
                  type="date"
                  value={safeBirthDateValue}
                  onChange={handleNativeDobChange}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 cursor-pointer"
                />
              </div>
            </div>

            {/* Target Date Inputs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Calculate Age As Of (DD / MM / YYYY)
                </label>
                <span className="text-xs text-slate-400 font-mono font-semibold">
                  {targetDay.padStart(2, '0')}/{targetMonth.padStart(2, '0')}/{targetYear}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block font-semibold">Day (DD)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    maxLength={2}
                    value={targetDay}
                    onChange={handleDayChange(setTargetDay)}
                    onBlur={handleBlurDay(targetDay, setTargetDay, String(today.getDate()).padStart(2, '0'))}
                    className="w-full px-2 sm:px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-base sm:text-lg text-center focus:ring-2 focus:ring-pink-500 focus:outline-none transition-colors"
                    placeholder="DD"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block font-semibold">Month (MM)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    maxLength={2}
                    value={targetMonth}
                    onChange={handleMonthChange(setTargetMonth)}
                    onBlur={handleBlurMonth(targetMonth, setTargetMonth, String(today.getMonth() + 1).padStart(2, '0'))}
                    className="w-full px-2 sm:px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-base sm:text-lg text-center focus:ring-2 focus:ring-pink-500 focus:outline-none transition-colors"
                    placeholder="MM"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block font-semibold">Year (YYYY)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    maxLength={4}
                    value={targetYear}
                    onChange={handleYearChange(setTargetYear)}
                    onBlur={handleBlurYear(targetYear, setTargetYear, String(today.getFullYear()))}
                    className="w-full px-2 sm:px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-base sm:text-lg text-center focus:ring-2 focus:ring-pink-500 focus:outline-none transition-colors"
                    placeholder="YYYY"
                  />
                </div>
              </div>

              {/* Native Date Picker alternative */}
              <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span>Or pick from calendar:</span>
                <input
                  type="date"
                  value={safeTargetDateValue}
                  onChange={handleNativeTargetChange}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 cursor-pointer"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Primary Age Highlight */}
        <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 bg-gradient-to-br from-pink-600 via-rose-600 to-amber-600 text-white shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-pink-200">
                  Exact Chronological Age
                </span>
                <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-white/20 font-mono font-semibold">
                  Born: {ageStats.birthFormattedDate}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-baseline gap-3 sm:gap-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-black">{ageStats.years}</span>
                  <span className="text-xs sm:text-base font-bold text-pink-100 uppercase">Years</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold">{ageStats.months}</span>
                  <span className="text-xs sm:text-base font-bold text-pink-100 uppercase">Months</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold">{ageStats.days}</span>
                  <span className="text-xs sm:text-base font-bold text-pink-100 uppercase">Days</span>
                </div>
              </div>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-pink-100/90 font-medium">
                Born on a <strong className="text-white underline">{ageStats.birthDayOfWeek}</strong> ({ageStats.birthFormattedDate}).
              </p>
            </div>

            <button
              onClick={triggerCelebrate}
              className="w-full sm:w-auto justify-center px-5 py-3 rounded-2xl bg-white text-rose-600 hover:bg-pink-50 active:scale-95 font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <PartyPopper className="w-5 h-5 text-pink-500" />
              <span>Celebrate! 🎉</span>
            </button>
          </div>
        </div>

        {/* Next Birthday & Astrological Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Next Birthday Card */}
          <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Next Birthday</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono">
                {ageStats.nextBirthdayFormattedDate}
              </span>
            </div>

            {ageStats.isBirthdayToday ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white text-center font-bold text-lg sm:text-xl animate-pulse shadow-lg">
                🎂 Happy Birthday! Today is your special day! 🎉
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                  
                  {/* Remaining Months */}
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/40">
                    <div className="text-2xl sm:text-4xl font-black text-rose-600 dark:text-rose-400 font-mono">
                      {ageStats.nextBirthdayMonthsRem}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                      Months Left
                    </div>
                  </div>

                  {/* Remaining Days */}
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-pink-50/60 dark:bg-pink-950/20 border border-pink-200/50 dark:border-pink-900/40">
                    <div className="text-2xl sm:text-4xl font-black text-pink-600 dark:text-pink-400 font-mono">
                      {ageStats.nextBirthdayDaysRem}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                      Days Left
                    </div>
                  </div>

                  {/* Day of Week */}
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 flex flex-col justify-center">
                    <div className="text-xs sm:text-base lg:text-lg font-black text-amber-600 dark:text-amber-400 truncate">
                      {ageStats.nextBirthdayDayOfWeek}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                      Day of Week
                    </div>
                  </div>

                </div>

                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center justify-between gap-1.5">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CalendarDays className="w-4 h-4 text-rose-500 shrink-0" />
                    Next Birthday falls on:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {ageStats.nextBirthdayDayOfWeek}, {ageStats.nextBirthdayFormattedDate}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Zodiac & Astrological Card */}
          <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Zodiac & Astrological</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Celestial signs</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-xs text-slate-400 font-semibold mb-1">Western Sun Sign</div>
                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                  {ageStats.zodiacSign}
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-xs text-slate-400 font-semibold mb-1">Chinese Zodiac</div>
                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                  {ageStats.chineseZodiac}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Astrological profile computed from your exact birth date.</span>
            </div>
          </div>

        </div>

        {/* Detailed Countdown Clock */}
        <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Hourglass className="w-5 h-5 text-indigo-500 shrink-0" />
              <span>Next Birthday Detailed Countdown Clock</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Live Real-Time Units
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-center">
            
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                {ageStats.nextBirthdayTotalDays}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                Total Days
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                {ageStats.nextBirthdayTotalHours}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                Total Hours
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono truncate px-1">
                {ageStats.nextBirthdayTotalMinutes.toLocaleString()}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                Total Minutes
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-rose-500 font-mono truncate px-1">
                {ageStats.nextBirthdayTotalSeconds.toLocaleString()}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                Total Seconds
              </div>
            </div>

          </div>
        </div>

        {/* Life Milestones Breakdown Grid */}
        <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-pink-500 shrink-0" />
            <span>Total Life Milestones Lived</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {[
              { label: 'Months', value: ageStats.totalMonths.toLocaleString() },
              { label: 'Weeks', value: ageStats.totalWeeks.toLocaleString() },
              { label: 'Days', value: ageStats.totalDays.toLocaleString() },
              { label: 'Hours', value: ageStats.totalHours.toLocaleString() },
              { label: 'Minutes', value: ageStats.totalMinutes.toLocaleString() },
              { label: 'Seconds', value: ageStats.totalSeconds.toLocaleString() },
            ].map((stat) => (
              <div 
                key={stat.label}
                className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center"
              >
                <div className="text-sm xs:text-base sm:text-lg font-extrabold text-pink-600 dark:text-pink-400 font-mono truncate px-0.5">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Total {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </CalculatorLayout>
  );
};
