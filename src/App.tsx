import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BackToTopButton } from './components/common/BackToTopButton';
import { HomePage } from './pages/HomePage';

// 17 Calculators
import { NormalCalculatorPage } from './pages/calculators/NormalCalculatorPage';
import { AgeCalculatorPage } from './pages/calculators/AgeCalculatorPage';
import { AreaCalculatorPage } from './pages/calculators/AreaCalculatorPage';
import { BMICalculatorPage } from './pages/calculators/BMICalculatorPage';
import { DataCalculatorPage } from './pages/calculators/DataCalculatorPage';
import { DiscountCalculatorPage } from './pages/calculators/DiscountCalculatorPage';
import { LengthCalculatorPage } from './pages/calculators/LengthCalculatorPage';
import { MassCalculatorPage } from './pages/calculators/MassCalculatorPage';
import { NumeralCalculatorPage } from './pages/calculators/NumeralCalculatorPage';
import { SpeedCalculatorPage } from './pages/calculators/SpeedCalculatorPage';
import { TemperatureCalculatorPage } from './pages/calculators/TemperatureCalculatorPage';
import { TimeCalculatorPage } from './pages/calculators/TimeCalculatorPage';
import { VolumeCalculatorPage } from './pages/calculators/VolumeCalculatorPage';
import { GSTCalculatorPage } from './pages/calculators/GSTCalculatorPage';
import { CurrencyCalculatorPage } from './pages/calculators/CurrencyCalculatorPage';
import { InvestmentCalculatorPage } from './pages/calculators/InvestmentCalculatorPage';
import { LoanCalculatorPage } from './pages/calculators/LoanCalculatorPage';
import { FuelCalculatorPage } from './pages/calculators/FuelCalculatorPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <Navbar />
          
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/normal" element={<NormalCalculatorPage />} />
              <Route path="/age" element={<AgeCalculatorPage />} />
              <Route path="/area" element={<AreaCalculatorPage />} />
              <Route path="/bmi" element={<BMICalculatorPage />} />
              <Route path="/data" element={<DataCalculatorPage />} />
              <Route path="/discount" element={<DiscountCalculatorPage />} />
              <Route path="/length" element={<LengthCalculatorPage />} />
              <Route path="/mass" element={<MassCalculatorPage />} />
              <Route path="/numeral" element={<NumeralCalculatorPage />} />
              <Route path="/speed" element={<SpeedCalculatorPage />} />
              <Route path="/temperature" element={<TemperatureCalculatorPage />} />
              <Route path="/time" element={<TimeCalculatorPage />} />
              <Route path="/volume" element={<VolumeCalculatorPage />} />
              <Route path="/gst" element={<GSTCalculatorPage />} />
              <Route path="/currency" element={<CurrencyCalculatorPage />} />
              <Route path="/investment" element={<InvestmentCalculatorPage />} />
              <Route path="/loan" element={<LoanCalculatorPage />} />
              <Route path="/fuel" element={<FuelCalculatorPage />} />
              {/* Fallback to Home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>

          <Footer />
          <BackToTopButton />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
