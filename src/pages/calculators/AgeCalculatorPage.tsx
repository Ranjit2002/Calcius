import React, { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AgeCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'age')!;

  // Default Date of Birth: 01 / 01 / 2000
  const [birthDay, setBirthDay] = useState('01');
  const [birthMonth, setBirthMonth] = useState('01');
  const [birthYear, setBirthYear] = useState('2000');

  const today = new Date();
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
    // Next birthday - months & days & day
    nextBirthdayMonthsRem: 0,
    nextBirthdayDaysRem: 0,
    nextBirthdayDayOfWeek: '',
    nextBirthdayFormattedDate: '',
    // Detailed countdown
    nextBirthdayTotalDays: 0,
    nextBirthdayTotalHours: 0,
    nextBirthdayTotalMinutes: 0,
    nextBirthdayTotalSeconds: 0,
    birthDayOfWeek: '',
    birthFormattedDate: '',
    zodiacSign: '',
    chineseZodiac: '',
    isBirthdayToday: false
  });

  const getZodiac = (day: number, month: number) => {
    const signs = [
      { name: 'Capricorn ♑', endDay: 19 },
      { name: 'Aquarius ♒', endDay: 18 },
      { name: 'Pisces ♓', endDay: 20 },
      { name: 'Aries ♈', endDay: 19 },
      { name: 'Taurus ♉', endDay: 20 },
      { name: 'Gemini ♊', endDay: 20 },
      { name: 'Cancer ♋', endDay: 22 },
      { name: 'Leo ♌', endDay: 22 },
      { name: 'Virgo ♍', endDay: 22 },
      { name: 'Libra ♎', endDay: 22 },
      { name: 'Scorpio ♏', endDay: 21 },
      { name: 'Sagittarius ♐', endDay: 21 },
      { name: 'Capricorn ♑', endDay: 31 }
    ];
    return day <= signs[month - 1].endDay ? signs[month - 1].name : signs[month].name;
  };

  const getChineseZodiac = (year: number) => {
    const animals = ['Rat 🐀', 'Ox 🐂', 'Tiger 🐅', 'Rabbit 🐇', 'Dragon 🐉', 'Snake 🐍', 'Horse 🐎', 'Goat 🐐', 'Monkey 🐒', 'Rooster 🐓', 'Dog 🐕', 'Pig 🐖'];
    return animals[(year - 4) % 12];
  };

  useEffect(() => {
    const bD = parseInt(birthDay, 10);
    const bM = parseInt(birthMonth, 10) - 1; // 0-indexed
    const bY = parseInt(birthYear, 10);

    const tD = parseInt(targetDay, 10);
    const tM = parseInt(targetMonth, 10) - 1;
    const tY = parseInt(targetYear, 10);

    if (isNaN(bD) || isNaN(bM) || isNaN(bY) || isNaN(tD) || isNaN(tM) || isNaN(tY)) return;

    const birth = new Date(bY, bM, bD);
    const target = new Date(tY, tM, tD);

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || target < birth) return;

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
    let nextBday = new Date(currentYear, bM, bD);
    if (nextBday < target) {
      nextBday = new Date(currentYear + 1, bM, bD);
    }

    const isBirthdayToday = (bM === target.getMonth() && bD === target.getDate());

    // Calculate months and days remaining for next birthday
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

    // Total days/hours/minutes for detailed clock container
    const bdayDiffMs = Math.max(nextBday.getTime() - target.getTime(), 0);
    const nextBdayTotalDays = Math.ceil(bdayDiffMs / (1000 * 60 * 60 * 24));
    const nextBdayTotalHours = nextBdayTotalDays * 24;
    const nextBdayTotalMinutes = nextBdayTotalHours * 60;
    const nextBdayTotalSeconds = nextBdayTotalMinutes * 60;

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const birthDayOfWeek = daysOfWeek[birth.getDay()];
    const nextBirthdayDayOfWeek = daysOfWeek[nextBday.getDay()];

    const birthFormattedDate = `${String(bD).padStart(2, '0')}/${String(bM + 1).padStart(2, '0')}/${bY}`;
    const nextBirthdayFormattedDate = `${String(bD).padStart(2, '0')}/${String(bM + 1).padStart(2, '0')}/${nextBday.getFullYear()}`;

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
      zodiacSign: getZodiac(bD, bM + 1),
      chineseZodiac: getChineseZodiac(bY),
      isBirthdayToday
    });
  }, [birthDay, birthMonth, birthYear, targetDay, targetMonth, targetYear, currentSec]);

  const triggerCelebrate = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  // Helper to handle native date picker change and map to DD/MM/YYYY
  const handleNativeDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // YYYY-MM-DD
    if (val) {
      const [y, m, d] = val.split('-');
      setBirthYear(y);
      setBirthMonth(m);
      setBirthDay(d);
    }
  };

  const handleNativeTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      const [y, m, d] = val.split('-');
      setTargetYear(y);
      setTargetMonth(m);
      setTargetDay(d);
    }
  };

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-8">
        
        {/* Date Pickers Card (DD/MM/YYYY) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-500" />
              <span>Select Dates (DD / MM / YYYY)</span>
            </h2>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
              Format: DD/MM/YYYY
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Date of Birth Inputs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Date of Birth (DD / MM / YYYY)
                </label>
                <span className="text-xs text-slate-400 font-mono">
                  {birthDay}/{birthMonth}/{birthYear}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block font-semibold">Day (DD)</span>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value.padStart(2, '0').slice(-2))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-lg text-center focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    placeholder="DD"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block font-semibold">Month (MM)</span>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value.padStart(2, '0').slice(-2))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-lg text-center focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    placeholder="MM"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block font-semibold">Year (YYYY)</span>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-lg text-center focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    placeholder="YYYY"
                  />
                </div>
              </div>

              {/* Native Date Picker alternative */}
              <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
                <span>Or pick from calendar:</span>
                <input
                  type="date"
                  value={`${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`}
                  onChange={handleNativeDobChange}
                  className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                />
              </div>
            </div>

            {/* Target Date Inputs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Calculate Age As Of (DD / MM / YYYY)
                </label>
                <span className="text-xs text-slate-400 font-mono">
                  {targetDay}/{targetMonth}/{targetYear}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block font-semibold">Day (DD)</span>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={targetDay}
                    onChange={(e) => setTargetDay(e.target.value.padStart(2, '0').slice(-2))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-lg text-center focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    placeholder="DD"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block font-semibold">Month (MM)</span>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={targetMonth}
                    onChange={(e) => setTargetMonth(e.target.value.padStart(2, '0').slice(-2))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-lg text-center focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    placeholder="MM"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 mb-1 block font-semibold">Year (YYYY)</span>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-lg text-center focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    placeholder="YYYY"
                  />
                </div>
              </div>

              {/* Native Date Picker alternative */}
              <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
                <span>Or pick from calendar:</span>
                <input
                  type="date"
                  value={`${targetYear}-${targetMonth.padStart(2, '0')}-${targetDay.padStart(2, '0')}`}
                  onChange={handleNativeTargetChange}
                  className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Primary Age Highlight */}
        <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-pink-600 via-rose-600 to-amber-600 text-white shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-pink-200">
                  Exact Chronological Age
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-mono">
                  Born: {ageStats.birthFormattedDate}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-baseline gap-4 sm:gap-6">
                <div>
                  <span className="text-5xl sm:text-7xl font-black">{ageStats.years}</span>
                  <span className="ml-1 text-sm sm:text-base font-bold text-pink-100 uppercase">Years</span>
                </div>
                <div>
                  <span className="text-4xl sm:text-6xl font-bold">{ageStats.months}</span>
                  <span className="ml-1 text-sm sm:text-base font-bold text-pink-100 uppercase">Months</span>
                </div>
                <div>
                  <span className="text-4xl sm:text-6xl font-bold">{ageStats.days}</span>
                  <span className="ml-1 text-sm sm:text-base font-bold text-pink-100 uppercase">Days</span>
                </div>
              </div>
              <p className="mt-4 text-xs sm:text-sm text-pink-100/90 font-medium">
                Born on a <strong className="text-white underline">{ageStats.birthDayOfWeek}</strong> ({ageStats.birthFormattedDate}).
              </p>
            </div>

            <button
              onClick={triggerCelebrate}
              className="px-5 py-3 rounded-2xl bg-white text-rose-600 hover:bg-pink-50 font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <PartyPopper className="w-5 h-5 text-pink-500" />
              <span>Celebrate! 🎉</span>
            </button>
          </div>
        </div>

        {/* Next Birthday & Astrological Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Next Birthday Card: Displays Remaining Months, Remaining Days, and Day of Week */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Next Birthday</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono">
                {ageStats.nextBirthdayFormattedDate}
              </span>
            </div>

            {ageStats.isBirthdayToday ? (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white text-center font-bold text-xl animate-pulse shadow-lg">
                🎂 Happy Birthday! Today is your special day! 🎉
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  
                  {/* Remaining Months */}
                  <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/40">
                    <div className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400 font-mono">
                      {ageStats.nextBirthdayMonthsRem}
                    </div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                      Months Left
                    </div>
                  </div>

                  {/* Remaining Days */}
                  <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/20 border border-pink-200/50 dark:border-pink-900/40">
                    <div className="text-3xl sm:text-4xl font-black text-pink-600 dark:text-pink-400 font-mono">
                      {ageStats.nextBirthdayDaysRem}
                    </div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                      Days Left
                    </div>
                  </div>

                  {/* Day of Week */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 flex flex-col justify-center">
                    <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 truncate">
                      {ageStats.nextBirthdayDayOfWeek}
                    </div>
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                      Day of Week
                    </div>
                  </div>

                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CalendarDays className="w-4 h-4 text-rose-500" />
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
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Zodiac & Astrological</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Celestial signs</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-xs text-slate-400 font-semibold mb-1">Western Sun Sign</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {ageStats.zodiacSign}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-xs text-slate-400 font-semibold mb-1">Chinese Zodiac</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
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

        {/* NEW CONTAINER: Next Birthday Detailed Precision Clock (Hours, Minutes, Total Days) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Hourglass className="w-5 h-5 text-indigo-500" />
              <span>Next Birthday Detailed Countdown Clock</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Live Real-Time Units
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                {ageStats.nextBirthdayTotalDays}
              </div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                Total Days
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                {ageStats.nextBirthdayTotalHours}
              </div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                Total Hours
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                {ageStats.nextBirthdayTotalMinutes.toLocaleString()}
              </div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                Total Minutes
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-500 font-mono">
                {ageStats.nextBirthdayTotalSeconds.toLocaleString()}
              </div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                Total Seconds
              </div>
            </div>

          </div>
        </div>

        {/* Life Milestones Breakdown Grid */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-pink-500" />
            <span>Total Life Milestones Lived</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center"
              >
                <div className="text-lg font-extrabold text-pink-600 dark:text-pink-400 font-mono truncate">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
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
