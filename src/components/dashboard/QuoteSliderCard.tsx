'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Copy, Check, BookOpen, Heart, Zap, Star } from 'lucide-react';
import { InspirationalQuoteItem, QuoteCategory } from '@/types';

interface QuoteSliderCardProps {
  quotes: InspirationalQuoteItem[];
  autoPlayInterval?: number; // ms, default 5000 (5 detik)
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
  autoPlayInterval = 5000,
  className = '',
}) => {
  const activeQuotes = quotes.filter((q) => q.isActive);
  const total = activeQuotes.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [copied, setCopied] = useState(false);

  // Pause ref: temporary pause on manual user interaction (resume automatically after 4s)
  const pauseUntilRef = useRef<number>(0);
  const touchStartX = useRef<number | null>(null);

  const safeIndex = total > 0 ? currentIndex % total : 0;
  const currentQuote = activeQuotes[safeIndex];

  // Manual slide transition helper
  const changeSlide = useCallback((newIndex: number, dir: 'left' | 'right', pauseDurationMs = 4000) => {
    if (total <= 1) return;
    pauseUntilRef.current = Date.now() + pauseDurationMs;
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 280);
  }, [total]);

  const goNext = useCallback(() => {
    changeSlide((safeIndex + 1) % total, 'right');
  }, [changeSlide, safeIndex, total]);

  const goPrev = useCallback(() => {
    changeSlide((safeIndex - 1 + total) % total, 'left');
  }, [changeSlide, safeIndex, total]);

  // Bulletproof auto-play interval
  useEffect(() => {
    if (total <= 1) return;

    const intervalId = setInterval(() => {
      // If user recently interacted (clicked or swiped), temporarily skip auto-advance
      if (Date.now() < pauseUntilRef.current) return;

      setDirection('right');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % total);
        setIsAnimating(false);
      }, 280);
    }, autoPlayInterval);

    return () => clearInterval(intervalId);
  }, [total, autoPlayInterval]);

  // Touch gesture support (swipe on mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
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
      pauseUntilRef.current = Date.now() + 2000;
    } catch {}
  };

  if (!currentQuote || total === 0) return null;

  const catConfig = CATEGORY_CONFIG[currentQuote.category] || CATEGORY_CONFIG.nasehat;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${catConfig.border} bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-emerald-950/40 dark:to-teal-950/30 shadow-sm transition-all duration-500 ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Hardware-Accelerated Continuous Progress Bar */}
      {total > 1 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5 overflow-hidden">
          <div
            key={currentIndex}
            style={{
              width: '100%',
              transformOrigin: 'left',
              animation: `quoteSlideProgress ${autoPlayInterval}ms linear forwards`,
            }}
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
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

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-stone-400 dark:text-stone-500">
              {safeIndex + 1}/{total}
            </span>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-xl text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 transition-all duration-200 cursor-pointer"
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

        {/* Quote content with slide & fade animation */}
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
        {total > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5 dark:border-white/5">
            {/* Prev */}
            <button
              onClick={goPrev}
              className="p-1.5 rounded-xl text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 transition-all duration-200 disabled:opacity-30 cursor-pointer"
              disabled={isAnimating}
              title="Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {activeQuotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => changeSlide(i, i > safeIndex ? 'right' : 'left')}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === safeIndex
                      ? `w-5 h-1.5 ${catConfig.bg} border ${catConfig.border}`
                      : 'w-1.5 h-1.5 bg-stone-300 dark:bg-stone-600 hover:bg-stone-400 dark:hover:bg-stone-500'
                  }`}
                  title={`Slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={goNext}
              className="p-1.5 rounded-xl text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 transition-all duration-200 disabled:opacity-30 cursor-pointer"
              disabled={isAnimating}
              title="Selanjutnya"
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
