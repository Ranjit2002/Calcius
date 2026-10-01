import React, { useState } from 'react';
import { CalculatorLayout } from '../../components/common/CalculatorLayout';
import { CALCULATORS } from '../../data/calculators';
import { Fuel, Users, Car, MapPin, Gauge, ShieldAlert, Sparkles, IndianRupee } from 'lucide-react';

export const FuelCalculatorPage: React.FC = () => {
  const meta = CALCULATORS.find((c) => c.id === 'fuel') || {
    id: 'fuel',
    name: 'Fuel & Trip Cost Calculator',
    shortName: 'Fuel & Trip',
    path: '/fuel',
    description: 'Calculate fuel consumption, total trip petrol/diesel expenses, cost split per passenger, and estimated carbon emissions.',
    category: 'measurement' as const,
    badge: 'Trip & Travel',
    iconName: 'Fuel',
    gradient: 'from-amber-500 via-orange-600 to-rose-600',
    accentColor: 'orange',
    quickInfo: 'Trip expense, km/L mileage & passenger split',
    keywords: ['fuel', 'petrol', 'diesel', 'trip', 'cost', 'mileage', 'gas', 'car', 'travel', 'commute']
  };

  // State
  const [distance, setDistance] = useState('250');
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [mileage, setMileage] = useState('16'); // km/L
  const [fuelPrice, setFuelPrice] = useState('96.50'); // ₹ per liter
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [passengers, setPassengers] = useState(1);
  const [tolls, setTolls] = useState('220'); // ₹
  const [parking, setParking] = useState('100'); // ₹

  // Calculations
  const distNum = parseFloat(distance) || 0;
  const effectiveDistanceKm = (distanceUnit === 'miles' ? distNum * 1.60934 : distNum) * (isRoundTrip ? 2 : 1);
  const mileageNum = parseFloat(mileage) || 1;
  const priceNum = parseFloat(fuelPrice) || 0;
  const tollsNum = parseFloat(tolls) || 0;
  const parkingNum = parseFloat(parking) || 0;

  // Liters needed
  const fuelLiters = mileageNum > 0 ? effectiveDistanceKm / mileageNum : 0;
  // Fuel cost
  const fuelCost = fuelLiters * priceNum;
  // Total trip cost
  const totalCost = fuelCost + tollsNum + parkingNum;
  // Cost per passenger
  const effectivePassengers = Math.max(1, passengers);
  const costPerPerson = totalCost / effectivePassengers;
  // Cost per km
  const costPerKm = effectiveDistanceKm > 0 ? totalCost / effectiveDistanceKm : 0;
  // Estimated CO2 emissions (~2.31 kg per Liter for petrol)
  const co2Kg = fuelLiters * 2.31;

  // Vehicle Presets
  const vehiclePresets = [
    { label: 'Motorcycle', icon: '🏍️', kmL: 45, desc: '45 km/L (High Efficiency)' },
    { label: 'Hatchback', icon: '🚗', kmL: 20, desc: '20 km/L (Compact City)' },
    { label: 'Sedan', icon: '🚙', kmL: 15, desc: '15 km/L (Midsize Petrol)' },
    { label: 'SUV', icon: '🚐', kmL: 11, desc: '11 km/L (Large Crossover)' },
    { label: 'Van / Bus', icon: '🚌', kmL: 7, desc: '7 km/L (Commercial Carrier)' },
  ];

  return (
    <CalculatorLayout calc={meta}>
      <div className="space-y-8">
        
        {/* Main Inputs Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Fuel className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Trip & Fuel Parameters</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">All prices and rates in Indian Rupees (₹)</p>
              </div>
            </div>

            {/* Round trip toggle */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsRoundTrip(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  !isRoundTrip
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                One-Way
              </button>
              <button
                type="button"
                onClick={() => setIsRoundTrip(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isRoundTrip
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Round-Trip (2×)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Trip Distance */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  Distance
                </label>
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px]">
                  <button
                    type="button"
                    onClick={() => setDistanceUnit('km')}
                    className={`px-1.5 py-0.5 rounded font-semibold transition-all ${
                      distanceUnit === 'km' ? 'bg-amber-500 text-white' : 'text-slate-500'
                    }`}
                  >
                    km
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistanceUnit('miles')}
                    className={`px-1.5 py-0.5 rounded font-semibold transition-all ${
                      distanceUnit === 'miles' ? 'bg-amber-500 text-white' : 'text-slate-500'
                    }`}
                  >
                    miles
                  </button>
                </div>
              </div>
              <input
                type="number"
                min="0"
                step="any"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                {isRoundTrip ? `Effective distance: ${(effectiveDistanceKm).toFixed(1)} km total` : `Single journey: ${(effectiveDistanceKm).toFixed(1)} km`}
              </p>
            </div>

            {/* Vehicle Mileage */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                <Gauge className="w-3.5 h-3.5 text-amber-500" />
                Mileage (km / Litre)
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Liters per 100km: {mileageNum > 0 ? (100 / mileageNum).toFixed(1) : '—'} L/100km
              </p>
            </div>

            {/* Fuel Price in Rupees */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                <IndianRupee className="w-3.5 h-3.5 text-amber-500" />
                Fuel Price (₹ / Litre)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Avg Indian metro price: ₹94 - ₹104/L
              </p>
            </div>

            {/* Passenger Count */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  Passengers Split
                </label>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {passengers} {passengers === 1 ? 'person' : 'people'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="font-mono font-bold text-base w-8 text-center text-slate-800 dark:text-slate-200">
                  {passengers}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Divide total cost among travelers</p>
            </div>

          </div>

          {/* Secondary Inputs: Tolls & Parking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Fastag / Highway Tolls (₹)
              </label>
              <input
                type="number"
                min="0"
                value={tolls}
                onChange={(e) => setTolls(e.target.value)}
                placeholder="0"
                className="w-full mt-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-semibold text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Parking & Other Trip Surcharges (₹)
              </label>
              <input
                type="number"
                min="0"
                value={parking}
                onChange={(e) => setParking(e.target.value)}
                placeholder="0"
                className="w-full mt-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-semibold text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Quick Vehicle Presets */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-amber-500" />
              Quick Vehicle Presets
            </p>
            <div className="flex flex-wrap gap-2.5">
              {vehiclePresets.map((vp) => (
                <button
                  key={vp.label}
                  type="button"
                  onClick={() => setMileage(vp.kmL.toString())}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 ${
                    parseFloat(mileage) === vp.kmL
                      ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/50'
                  }`}
                >
                  <span>{vp.icon}</span>
                  <span>{vp.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">({vp.kmL} km/L)</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Trip Cost in Rupees */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <p className="text-amber-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Total Trip Expense
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold font-mono mt-3 tracking-tight">
              ₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-amber-100/90 mt-2">
              Fuel ₹{fuelCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })} + Tolls/Misc ₹{(tollsNum + parkingNum).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>

          {/* Cost per Passenger */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-500" />
              Per Person Split
            </p>
            <p className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-3">
              ₹{costPerPerson.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Divided across {passengers} {passengers === 1 ? 'traveler' : 'travelers'}
            </p>
          </div>

          {/* Total Fuel Needed */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-amber-500" />
              Fuel Required
            </p>
            <p className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-3">
              {fuelLiters.toFixed(1)} <span className="text-lg font-normal text-slate-500">Liters</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              ≈ {(fuelLiters * 0.264172).toFixed(1)} US Gallons
            </p>
          </div>

          {/* Cost per km */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-amber-500" />
              Running Cost
            </p>
            <p className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-3">
              ₹{costPerKm.toFixed(2)} <span className="text-lg font-normal text-slate-500">/ km</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Fuel only: ₹{(fuelLiters > 0 && effectiveDistanceKm > 0 ? fuelCost / effectiveDistanceKm : 0).toFixed(2)}/km
            </p>
          </div>

        </div>

        {/* Detailed Breakdown & Environmental Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Detailed Expense Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
              <span>🧾</span> Detailed Expense Breakdown
            </h4>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 text-sm">
                <span className="text-slate-500 dark:text-slate-400">Total Distance Travelled:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {effectiveDistanceKm.toFixed(1)} km ({((effectiveDistanceKm) * 0.621371).toFixed(1)} miles)
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 text-sm">
                <span className="text-slate-500 dark:text-slate-400">Fuel Quantity:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {fuelLiters.toFixed(2)} L
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 text-sm">
                <span className="text-slate-500 dark:text-slate-400">Petrol / Diesel Expense:</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  ₹{fuelCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 text-sm">
                <span className="text-slate-500 dark:text-slate-400">Highway Toll Taxes:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ₹{tollsNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 text-sm">
                <span className="text-slate-500 dark:text-slate-400">Parking & Miscellaneous:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ₹{parkingNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 bg-amber-500/10 dark:bg-amber-500/15 rounded-xl px-4 text-base font-bold">
                <span className="text-amber-800 dark:text-amber-300">Net Overall Cost:</span>
                <span className="font-mono text-amber-700 dark:text-amber-400 text-lg">
                  ₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Environmental Carbon Footprint Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🌱</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Carbon Footprint & Eco Insight
                </h4>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 mb-4">
                <p className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                  Estimated CO₂ Emissions
                </p>
                <p className="text-3xl font-extrabold font-mono mt-1">
                  {co2Kg.toFixed(1)} <span className="text-sm font-semibold">kg CO₂</span>
                </p>
                <p className="text-xs mt-1 text-emerald-700 dark:text-emerald-400">
                  ≈ {(co2Kg / 22).toFixed(1)} mature trees needed for 1 year to absorb this trip's emissions.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Eco-driving tip:</strong> Maintaining steady speeds between 60–80 km/h and correct tire pressures can reduce fuel consumption by up to 15%.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Carpooling benefit:</strong> Sharing this ride with {passengers} people reduces each person's carbon footprint to {(co2Kg / effectivePassengers).toFixed(1)} kg CO₂!
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              Formula: Fuel Required = Distance ÷ Mileage. Fuel Cost = Fuel (L) × ₹/L. CO₂ ≈ 2.31 kg per Liter of petrol.
            </div>
          </div>

        </div>

      </div>
    </CalculatorLayout>
  );
};
