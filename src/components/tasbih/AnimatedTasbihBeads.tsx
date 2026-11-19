'use client';

import React, { useRef, useState, useEffect } from 'react';

export type TasbihTheme = 'gold' | 'emerald' | 'sapphire' | 'amethyst' | 'rose';

export interface AnimatedTasbihBeadsProps {
  currentCount: number;
  targetCount: number;
  theme: TasbihTheme;
  stageIndex?: number;
  isPaketSholat?: boolean;
  isPressing: boolean;
  onTap: () => void;
}

// Precomputed 420 points along the path for instant 0ms mount (fallback & fast lookup)
// Path: Diagonal from top-right (370, 35) -> Focal ring (192, 144) -> Curve (165, 175) -> Vertical tail (165, 345)
const generateAnalyticalPoints = (): { x: number; y: number }[] => {
  const pts: { x: number; y: number }[] = [];
  // Segment 1: Diagonal line from (370, 35) to (210, 135)
  const dx1 = 210 - 370;
  const dy1 = 135 - 35;
  const l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  for (let i = 0; i < Math.floor(l1); i++) {
    const t = i / l1;
    pts.push({ x: 370 + dx1 * t, y: 35 + dy1 * t });
  }

  // Segment 2: Smooth curve around focal point (210, 135) -> (190, 145) -> (165, 175)
  const p0 = { x: 210, y: 135 };
  const p1 = { x: 188, y: 142 };
  const p2 = { x: 165, y: 175 };
  const steps2 = 60;
  for (let i = 0; i < steps2; i++) {
    const t = i / steps2;
    const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
    const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
    pts.push({ x, y });
  }

  // Segment 3: Vertical straight tail from (165, 175) down to (165, 355)
  for (let y = 175; y <= 355; y++) {
    pts.push({ x: 165, y });
  }

  return pts;
};

const DEFAULT_POINTS = generateAnalyticalPoints();
const FOCAL_INDEX = 211; // Index in DEFAULT_POINTS where the focal ring sits (192, 144)
const BEAD_SPACING = 27; // Spacing in px to provide a clean, distinct 8px gap between beads
const NORMAL_BEAD_RADIUS = 9.5; // Diameter 19px + 8px gap = 27px spacing

// Theme color definitions for glowing beads & rings
const THEME_CONFIG: Record<
  TasbihTheme,
  {
    ringStroke: string;
    ringGlow: string;
    beadGradId: string;
    beadColor: string;
    beadShadow: string;
    tasselGrad: string;
  }
> = {
  gold: {
    ringStroke: '#fbbf24',
    ringGlow: 'rgba(251, 191, 36, 0.45)',
    beadGradId: 'bead-grad-gold',
    beadColor: '#f59e0b',
    beadShadow: 'rgba(245, 158, 11, 0.4)',
    tasselGrad: '#d97706',
  },
  emerald: {
    ringStroke: '#34d399',
    ringGlow: 'rgba(52, 211, 153, 0.45)',
    beadGradId: 'bead-grad-emerald',
    beadColor: '#10b981',
    beadShadow: 'rgba(16, 185, 129, 0.4)',
    tasselGrad: '#059669',
  },
  sapphire: {
    ringStroke: '#60a5fa',
    ringGlow: 'rgba(96, 165, 250, 0.45)',
    beadGradId: 'bead-grad-sapphire',
    beadColor: '#3b82f6',
    beadShadow: 'rgba(59, 130, 246, 0.4)',
    tasselGrad: '#2563eb',
  },
  amethyst: {
    ringStroke: '#c084fc',
    ringGlow: 'rgba(192, 132, 252, 0.45)',
    beadGradId: 'bead-grad-amethyst',
    beadColor: '#a855f7',
    beadShadow: 'rgba(168, 85, 247, 0.4)',
    tasselGrad: '#9333ea',
  },
  rose: {
    ringStroke: '#fb7185',
    ringGlow: 'rgba(251, 113, 133, 0.45)',
    beadGradId: 'bead-grad-rose',
    beadColor: '#f43f5e',
    beadShadow: 'rgba(244, 63, 94, 0.4)',
    tasselGrad: '#e11d48',
  },
};

export const AnimatedTasbihBeads: React.FC<AnimatedTasbihBeadsProps> = ({
  currentCount,
  theme,
  stageIndex,
  isPaketSholat,
  isPressing,
  onTap,
}) => {
  const [slideOffset, setSlideOffset] = useState(0); // 0 -> 1 during tap animation
  const [rippleActive, setRippleActive] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const prevCountRef = useRef(currentCount);

  // Trigger smooth 60fps sliding transition whenever count increments
  useEffect(() => {
    if (currentCount !== prevCountRef.current) {
      prevCountRef.current = currentCount;
      setRippleActive(true);
      const rippleTimer = setTimeout(() => setRippleActive(false), 300);

      const startTime = performance.now();
      const duration = 210; // ms

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      const animateSlide = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Springy cubic ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        setSlideOffset(eased);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animateSlide);
        } else {
          setSlideOffset(0);
        }
      };

      animFrameRef.current = requestAnimationFrame(animateSlide);

      return () => {
        clearTimeout(rippleTimer);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    }
  }, [currentCount]);

  const cfg = THEME_CONFIG[theme] || THEME_CONFIG.gold;

  // We render visible beads along the string from i = -10 (bottom tail) up to i = 7 (incoming strand)
  // i = 0 is the bead in or passing through the focal ring.
  const BEAD_INDICES = Array.from({ length: 18 }, (_, idx) => idx - 10); // -10 to +7

  // Calculate absolute position on the continuous 99-bead string
  // 33 round beads (1..33) -> Separator 1 (pos 34) -> 33 round beads (35..67) -> Separator 2 (pos 68) -> 33 round beads (69..101)
  let globalOffset: number;
  if (isPaketSholat && stageIndex !== undefined) {
    if (stageIndex === 0) {
      globalOffset = currentCount;
    } else if (stageIndex === 1) {
      globalOffset = 34 + currentCount;
    } else {
      globalOffset = 68 + currentCount;
    }
  } else {
    // Non-paket sholat (e.g. 100x, 1000x): insert 1 separator every 33 round beads
    globalOffset = currentCount + Math.floor(currentCount / 33);
  }

  return (
    <div
      onClick={onTap}
      className="relative w-full max-w-sm mx-auto select-none cursor-pointer touch-manipulation active:scale-[0.99] transition-transform"
      style={{ touchAction: 'manipulation' }}
      title="Ketuk untuk berdzikir"
    >
      <svg
        viewBox="0 0 380 360"
        className="w-full h-auto drop-shadow-2xl overflow-visible"
      >
        <defs>
          {/* Natural Pendulum Sway Keyframes for Realistic Hanging Tasbih */}
          <style>{`
            @keyframes tasbihTailSway {
              0%, 100% {
                transform: rotate(0deg);
              }
              25% {
                transform: rotate(1.8deg);
              }
              75% {
                transform: rotate(-1.8deg);
              }
            }
            @keyframes tasbihBeadSway {
              0%, 100% {
                transform: translateX(0px);
              }
              25% {
                transform: translateX(var(--sway-px, 0px));
              }
              75% {
                transform: translateX(calc(var(--sway-px, 0px) * -1));
              }
            }
            @keyframes tasbihTasselSway {
              0%, 100% {
                transform: rotate(0deg);
              }
              25% {
                transform: rotate(2.8deg);
              }
              75% {
                transform: rotate(-2.8deg);
              }
            }
          `}</style>

          {/* Uncounted Polished Natural Walnut Wood Gradient */}
          <radialGradient id="bead-grad-wood" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#d59b71" />
            <stop offset="20%" stopColor="#965b35" />
            <stop offset="55%" stopColor="#5a331c" />
            <stop offset="85%" stopColor="#381e0f" />
            <stop offset="100%" stopColor="#221108" />
          </radialGradient>

          {/* Counted 3D Golden Amber Jewel Gradient (Subhanallah: 1st 33 beads) */}
          <radialGradient id="bead-grad-gold" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#fff9db" />
            <stop offset="22%" stopColor="#fde047" />
            <stop offset="55%" stopColor="#d97706" />
            <stop offset="85%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#451a03" />
          </radialGradient>

          {/* Counted 3D Radiant Emerald Jewel Gradient (Alhamdulillah: 2nd 33 beads) */}
          <radialGradient id="bead-grad-emerald" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#d1fae5" />
            <stop offset="22%" stopColor="#34d399" />
            <stop offset="55%" stopColor="#059669" />
            <stop offset="85%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#022c22" />
          </radialGradient>

          {/* Counted 3D Celestial Sapphire Jewel Gradient (Allahu Akbar: 3rd 33 beads) */}
          <radialGradient id="bead-grad-sapphire" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="22%" stopColor="#60a5fa" />
            <stop offset="55%" stopColor="#2563eb" />
            <stop offset="85%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>

          {/* Counted 3D Royal Amethyst Gradient */}
          <radialGradient id="bead-grad-amethyst" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#f3e8ff" />
            <stop offset="22%" stopColor="#c084fc" />
            <stop offset="55%" stopColor="#9333ea" />
            <stop offset="85%" stopColor="#6b21a8" />
            <stop offset="100%" stopColor="#3b0764" />
          </radialGradient>

          {/* Counted 3D Rose Quartz Gradient */}
          <radialGradient id="bead-grad-rose" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffe4e6" />
            <stop offset="22%" stopColor="#fb7185" />
            <stop offset="55%" stopColor="#e11d48" />
            <stop offset="85%" stopColor="#9f1239" />
            <stop offset="100%" stopColor="#4c0519" />
          </radialGradient>

          {/* Golden Tassel & Imam Bead Gradient */}
          <linearGradient id="tassel-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="80%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Soft Bottom Light Pedestal Glow */}
          <radialGradient id="pedestal-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          {/* Soft Filter for Glowing Focal Ring */}
          <filter id="focal-ring-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. SOFT BOTTOM PEDESTAL REFLECTION (Spotlight from prayer surface) */}
        <ellipse
          cx="190"
          cy="345"
          rx="140"
          ry="32"
          fill="url(#pedestal-glow)"
          className="pointer-events-none"
        />

        {/* 2. SILK CONNECTING STRING (Braided cord connecting all beads) */}
        {/* Upper diagonal & curve string (firm & anchored) */}
        <path
          d="M 370 35 L 210 135 Q 188 142 165 175"
          fill="none"
          stroke="#452c1a"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="opacity-75"
        />
        {/* Lower vertical hanging string (gently swaying left and right with natural pendulum physics) */}
        <path
          d="M 165 175 L 165 355"
          fill="none"
          stroke="#452c1a"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="opacity-75"
          style={{
            transformOrigin: '165px 175px',
            animation: 'tasbihTailSway 3.8s ease-in-out infinite',
          }}
        />

        {/* 3. THE 3D SLIDING BEADS STREAM WITH 8PX GAPS, SEPARATORS & SWAY ANIMATION */}
        {BEAD_INDICES.map((beadIdx) => {
          // Distance along the analytical path:
          const dist = FOCAL_INDEX - beadIdx * BEAD_SPACING + slideOffset * BEAD_SPACING;
          const clampedDist = Math.max(0, Math.min(DEFAULT_POINTS.length - 1, Math.round(dist)));
          const pt = DEFAULT_POINTS[clampedDist] || { x: 0, y: 0 };

          const isFocalBead = beadIdx === 0;

          // Item index along the continuous tasbih chain
          const itemPos = globalOffset + beadIdx;

          // Is this item a Separator / Pembatas (biji lonjong dengan rumbai emas)?
          // Located at pos 34 (after 33 Subhanallah), pos 68 (after 33 Alhamdulillah), pos 102...
          // or pos 0 at the very start of tasbih
          const isImamBead =
            (itemPos > 0 && itemPos % 34 === 0) ||
            (itemPos === 0 && (!isPaketSholat || stageIndex === 0) && currentCount === 0 && beadIdx === 0);

          // Has this bead reached or passed the focal ring?
          const isCounted = beadIdx <= 0;

          // Determine stage color for counted beads:
          // 33 Pertama (pos 1..33): ORANGE / GOLD (Subhanallah)
          // 33 Kedua (pos 35..67): HIJAU (Alhamdulillah)
          // 33 Ketiga (pos 69..101): BIRU (Allahu Akbar)
          let beadTheme: TasbihTheme = theme;
          if (isPaketSholat) {
            if (itemPos >= 1 && itemPos <= 33) {
              beadTheme = 'gold'; // orange / amber
            } else if (itemPos >= 35 && itemPos <= 67) {
              beadTheme = 'emerald'; // green
            } else if (itemPos >= 69 && itemPos <= 101) {
              beadTheme = 'sapphire'; // blue
            } else {
              beadTheme = theme;
            }
          } else {
            // General presets: cycle gold -> emerald -> sapphire every 33 beads
            const section = Math.floor(Math.max(0, itemPos - 1) / 34) % 3;
            if (section === 0) beadTheme = 'gold';
            else if (section === 1) beadTheme = 'emerald';
            else beadTheme = 'sapphire';
          }

          const activeCfg = THEME_CONFIG[beadTheme] || THEME_CONFIG.gold;
          const gradId = isCounted
            ? isImamBead
              ? 'bead-grad-wood'
              : activeCfg.beadGradId
            : 'bead-grad-wood';

          const beadRadius = isFocalBead ? 11.5 : NORMAL_BEAD_RADIUS;

          // Calculate horizontal sway offset for beads hanging along the vertical tail (y > 165)
          let swayPx = '0px';
          if (pt.y > 165) {
            const depthRatio = Math.min(1, Math.max(0, (pt.y - 165) / 180));
            swayPx = `${(depthRatio * 5.0).toFixed(2)}px`;
          }

          // Opacity fade at the far ends of the strand
          const opacity =
            beadIdx > 5
              ? Math.max(0, 1 - (beadIdx - 5) * 0.4)
              : beadIdx < -8
              ? Math.max(0, 1 - Math.abs(beadIdx + 8) * 0.4)
              : 1;

          return (
            <g
              key={beadIdx}
              transform={`translate(${pt.x}, ${pt.y})`}
              opacity={opacity}
              className="transition-transform duration-75"
            >
              {/* Inner container with realistic left-right pendulum sway */}
              <g
                style={
                  {
                    '--sway-px': swayPx,
                    animation: pt.y > 165 ? 'tasbihBeadSway 3.8s ease-in-out infinite' : undefined,
                  } as React.CSSProperties
                }
              >
                {/* Drop Shadow */}
                <ellipse
                  cx="1"
                  cy="3"
                  rx={isImamBead ? 10 : beadRadius}
                  ry={isImamBead ? 14 : beadRadius}
                  fill="rgba(0,0,0,0.38)"
                  filter="blur(2px)"
                />

                {/* Glowing Aura if Counted Round Bead */}
                {isCounted && !isImamBead && (
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={beadRadius + 2}
                    ry={beadRadius + 2}
                    fill="none"
                    stroke={activeCfg.ringStroke}
                    strokeWidth="1.5"
                    opacity={isFocalBead ? 0.8 : 0.25}
                  />
                )}

                {isImamBead ? (
                  /* === IMAM BEAD (OVAL PEMBATAS) + GOLDEN TASSEL (NOT COUNTED AS ONE OF THE 33) === */
                  <g>
                    {/* Elongated Oval Bead Body - Polished Natural Walnut Wood Separator */}
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="10"
                      ry="15"
                      fill="url(#bead-grad-wood)"
                    />

                    {/* Specular White Gloss Glint on Oval */}
                    <ellipse
                      cx="-3"
                      cy="-5"
                      rx="3.2"
                      ry="5"
                      fill="white"
                      opacity={0.65}
                      transform="rotate(-20, -3, -5)"
                    />

                    {/* Ambient Rim Light */}
                    <ellipse
                      cx="1.5"
                      cy="7"
                      rx="4"
                      ry="3"
                      fill="#d59b71"
                      opacity={0.25}
                    />

                    {/* Golden Connector Oval Cap (Directly attached to bottom of oval bead) */}
                    <ellipse
                      cx="0"
                      cy="18"
                      rx="5.5"
                      ry="7"
                      fill="url(#tassel-gold-grad)"
                      stroke="#78350f"
                      strokeWidth="0.5"
                    />
                    {/* Cap highlight */}
                    <ellipse
                      cx="-1.5"
                      cy="16"
                      rx="2"
                      ry="2.5"
                      fill="white"
                      opacity="0.75"
                    />

                    {/* Silken Golden Tassel Threads (Fanning Downwards with Gravity & Gentle Sway) */}
                    <g
                      className="pointer-events-none"
                      style={{
                        transformOrigin: '0px 24px',
                        animation: 'tasbihTasselSway 3.8s ease-in-out infinite',
                      }}
                    >
                      <path d="M 0 24 Q -4 44 -9 62" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
                      <path d="M 0 24 Q -2.5 45 -6 65" stroke="#fde047" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
                      <path d="M 0 24 Q -1 46 -2.5 67" stroke="#d97706" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M 0 24 L 0 68" stroke="#fde047" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M 0 24 Q 1 46 2.5 67" stroke="#d97706" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M 0 24 Q 2.5 45 6 65" stroke="#fde047" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
                      <path d="M 0 24 Q 4 44 9 62" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
                      {/* Inner fine threads */}
                      <path d="M 0 24 L -4 60" stroke="#fbbf24" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />
                      <path d="M 0 24 L 4 60" stroke="#fbbf24" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />
                      {/* Golden neck ring */}
                      <rect x="-3" y="24" width="6" height="2" rx="1" fill="#78350f" opacity="0.7" />
                    </g>
                  </g>
                ) : (
                  /* === REGULAR ROUND BEAD (WITH CLEAR 8PX AIRY GAP) === */
                  <g>
                    {/* 3D Shaded Bead Body */}
                    <circle
                      cx="0"
                      cy="0"
                      r={beadRadius}
                      fill={`url(#${gradId})`}
                    />

                    {/* Specular White Gloss Glint (Realistic 3D Reflection) */}
                    <ellipse
                      cx={-beadRadius * 0.3}
                      cy={-beadRadius * 0.32}
                      rx={beadRadius * 0.33}
                      ry={beadRadius * 0.2}
                      fill="white"
                      opacity={isCounted ? 0.75 : 0.55}
                      transform={`rotate(-28, ${-beadRadius * 0.3}, ${-beadRadius * 0.32})`}
                    />

                    {/* Ambient Rim Light at Bottom */}
                    <ellipse
                      cx={beadRadius * 0.15}
                      cy={beadRadius * 0.42}
                      rx={beadRadius * 0.4}
                      ry={beadRadius * 0.18}
                      fill={isCounted ? activeCfg.ringStroke : '#d59b71'}
                      opacity={isCounted ? 0.35 : 0.18}
                    />
                  </g>
                )}
              </g>
            </g>
          );
        })}

        {/* 4. THE GLOWING FOCAL RING RETICLE (Center Bead Target Indicator) */}
        {(() => {
          const focalPt = DEFAULT_POINTS[FOCAL_INDEX] || { x: 192, y: 144 };
          return (
            <g
              transform={`translate(${focalPt.x}, ${focalPt.y})`}
              className="pointer-events-none"
            >
              {/* Expanding Tap Ripple Wave */}
              {rippleActive && (
                <circle
                  cx="0"
                  cy="0"
                  r="24"
                  fill="none"
                  stroke={cfg.ringStroke}
                  strokeWidth="2"
                  className="animate-ping"
                  opacity="0.8"
                />
              )}

              {/* Outer Glowing Halo */}
              <circle
                cx="0"
                cy="0"
                r="18"
                fill="none"
                stroke={cfg.ringStroke}
                strokeWidth="4"
                opacity={isPressing ? 0.6 : 0.25}
                filter="url(#focal-ring-glow)"
              />

              {/* Main Reticle Ring */}
              <circle
                cx="0"
                cy="0"
                r="15.5"
                fill="none"
                stroke={cfg.ringStroke}
                strokeWidth={isPressing ? 3 : 2.5}
                className="transition-all duration-100"
              />

              {/* Left & Right Crosshair Alignment Ticks */}
              <line
                x1="-22"
                y1="0"
                x2="-16.5"
                y2="0"
                stroke={cfg.ringStroke}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="16.5"
                y1="0"
                x2="22"
                y2="0"
                stroke={cfg.ringStroke}
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Central Target Dot */}
              <circle
                cx="0"
                cy="0"
                r="1.5"
                fill={cfg.ringStroke}
                opacity="0.6"
              />
            </g>
          );
        })()}
      </svg>
    </div>
  );
};
