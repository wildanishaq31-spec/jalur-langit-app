'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Copy, Check, BookOpen, Heart, Zap, Star } from 'lucide-react';
import { InspirationalQuoteItem, QuoteCategory } from '@/types';

interface QuoteSliderCardProps {
  quotes: InspirationalQuoteItem[];
  autoPlayInterval?: number; // ms, default 8000
  className?: string;
}

const CATEGORY_CONFIG: Record<QuoteCategory, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  nasehat: {
    label: 'Nasehat Ulama',
    icon: <BookOpen className="w-3 h-3" />,
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    border: 'border-amber-300 dark:border-amber-700/50',
  },
  doa: {
    label: 'Doa',
    icon: <Heart className="w-3 h-3" />,
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    border: 'border-emerald-300 dark:border-emerald-700/50',
  },
  motivasi: {
    label: 'Motivasi',
    icon: <Star className="w-3 h-3" />,
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    border: 'border-blue-300 dark:border-blue-700/50',
  },
  penyemangat: {
    label: 'Penyemangat',
    icon: <Zap className="w-3 h-3" />,
    color: 'text-purple-700 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/40',
    border: 'border-purple-300 dark:border-purple-700/50',
  },
};

export const QuoteSliderCard: React.FC<QuoteSliderCardProps> = ({
  quotes,
  autoPlayInterval = 8000,
  className = '',
}) => {
  const activeQuotes = quotes.filter((q) => q.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);

  const safeIndex = activeQuotes.length > 0 ? currentIndex % activeQuotes.length : 0;
  const currentQuote = activeQuotes[safeIndex];

  const goToSlide = useCallback(
    (newIndex: number, dir: 'left' | 'right') => {
      if (isAnimating || activeQuotes.length <= 1) return;
      setDirection(dir);
      setIsAnimating(true);
      setProgress(0);
      setTimeout(() => {
        setCurrentIndex(newIndex);
        setIsAnimating(false);
      }, 320);
    },
    [isAnimating, activeQuotes.length]
  );

  const goNext = useCallback(() => {
    const next = (safeIndex + 1) % activeQuotes.length;
    goToSlide(next, 'right');
  }, [safeIndex, activeQuotes.length, goToSlide]);

  const goPrev = useCallback(() => {
    const prev = (safeIndex - 1 + activeQuotes.length) % activeQuotes.length;
    goToSlide(prev, 'left');
  }, [safeIndex, activeQuotes.length, goToSlide]);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || activeQuotes.length <= 1) return;

    setProgress(0);
    const startTime = Date.now();

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min((elapsed / autoPlayInterval) * 100, 100));
    }, 50);

    timerRef.current = setTimeout(() => {
      goNext();
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [currentIndex, isPaused, activeQuotes.length, autoPlayInterval, goNext]);

  // Touch gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const handleCopy = async () => {
    if (!currentQuote) return;
    const text = `"${currentQuote.text}"\n— ${currentQuote.author}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (!currentQuote || activeQuotes.length === 0) return null;

  const catConfig = CATEGORY_CONFIG[currentQuote.category] || CATEGORY_CONFIG.nasehat;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${catConfig.border} bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-emerald-950/40 dark:to-teal-950/30 shadow-sm transition-all duration-500 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      {activeQuotes.length > 1 && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400/60 dark:bg-amber-500/50 transition-none rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="p-5 pt-6">
        {/* Header row: category badge + action buttons */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${catConfig.bg} ${catConfig.color} ${catConfig.border}`}
          >
            {catConfig.icon}
            {catConfig.label}
          </span>

          <div className="flex items-center gap-1">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-xl text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 transition-all duration-200"
              title="Salin kutipan"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Quote content with slide animation */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isAnimating
              ? direction === 'right'
                ? 'opacity-0 translate-x-4'
                : 'opacity-0 -translate-x-4'
              : 'opacity-100 translate-x-0'
          }`}
        >
          <div className="flex gap-3">
            <div className="text-amber-400/60 dark:text-amber-500/50 text-4xl font-serif leading-none select-none mt-1 shrink-0">
              "
            </div>
            <div className="space-y-3 min-h-[72px]">
              <p className="text-sm italic font-serif text-stone-700 dark:text-stone-200 leading-relaxed whitespace-pre-line">
                {currentQuote.text}
              </p>
              <div className={`text-xs font-semibold ${catConfig.color}`}>
                — {currentQuote.author}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation dots + prev/next */}
        {activeQuotes.length > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5 dark:border-white/5">
            {/* Prev */}
            <button
              onClick={goPrev}
              className="p-1.5 rounded-xl text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 transition-all duration-200 disabled:opacity-30"
              disabled={isAnimating}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {activeQuotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i, i > safeIndex ? 'right' : 'left')}
                  className={`rounded-full transition-all duration-300 ${
                    i === safeIndex
                      ? `w-5 h-1.5 ${catConfig.bg} border ${catConfig.border}`
                      : 'w-1.5 h-1.5 bg-stone-300 dark:bg-stone-600 hover:bg-stone-400 dark:hover:bg-stone-500'
                  }`}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={goNext}
              className="p-1.5 rounded-xl text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 transition-all duration-200 disabled:opacity-30"
              disabled={isAnimating}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteSliderCard;
