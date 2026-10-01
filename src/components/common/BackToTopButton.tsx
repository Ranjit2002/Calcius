import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTopButton: React.FC = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Only activate when scrolled past 150px
    if (currentScrollY > 150) {
      setIsScrolling(true);

      // Reset the hide timer on every scroll tick
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      // Hide with animation after 1.4s of inactivity
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 1400);
    } else {
      // Near top of page, hide immediately
      setIsScrolling(false);
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const isVisible = isScrolling || isHovered;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-6 scale-90 pointer-events-none'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        id="back-to-top"
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top of page"
        className="group relative flex items-center justify-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white font-semibold text-xs tracking-wide shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:from-indigo-500 hover:to-violet-500 active:scale-95 border border-white/20 backdrop-blur-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      >
        {/* Glowing backdrop pulse */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-40 group-hover:opacity-75 blur-sm transition-opacity duration-300 -z-10" />

        {/* Upward Arrow (Always visible on mobile & desktop) */}
        <ArrowUp className="w-5 h-5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />

        {/* Text: Hidden on mobile devices, shown as 'Back to Top' on larger screens */}
        <span className="hidden sm:inline font-bold">
          Back to Top
        </span>
      </button>
    </div>
  );
};
