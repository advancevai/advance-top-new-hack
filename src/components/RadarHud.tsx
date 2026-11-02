import React from 'react';
import { Zap, Crosshair, Lock, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { BallIcon } from './BallIcon';
import { BetSize, ColorType, TitaniumCombo, TitaniumComboineSignal } from '../types';
import { formatTime } from '../data';

interface RadarHudProps {
  prediction: BetSize;
  confidence: number;
  digit: number;
  colorType: ColorType;
  secondsLeft: number;
  totalSeconds?: number;
  signalStrength: number;
  accuracyLevel: number;
  isScanning: boolean;
  targetPeriodId?: string;
  isLocked?: boolean;
  titaniumCombo?: TitaniumCombo;
  titaniumComboineSignal?: TitaniumComboineSignal;
  glowEnabled?: boolean;
}

export const RadarHud: React.FC<RadarHudProps> = ({
  prediction,
  confidence,
  digit,
  colorType,
  secondsLeft,
  totalSeconds = 60,
  signalStrength,
  accuracyLevel,
  isScanning,
  targetPeriodId,
  titaniumCombo,
  titaniumComboineSignal,
  glowEnabled = true,
}) => {
  const circumference = 2 * Math.PI * 26;
  const progressRatio = Math.max(0, Math.min(1, secondsLeft / totalSeconds));
  const isLockPeriod = secondsLeft <= 5;

  return (
    <section className="relative overflow-hidden rounded-3xl p-3.5 border border-purple-500/35 bg-gradient-to-b from-[#130728]/90 via-[#0a0318]/95 to-[#05010b]/98 shadow-[0_16px_50px_-10px_rgba(168,85,247,0.35),0_0_20px_rgba(0,0,0,0.95)] animate-rise text-left">
      {/* Top glowing laser line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#c084fc] to-transparent shadow-[0_0_12px_#c084fc]" />

      {/* Floating Side Auras */}
      <div
        className="pointer-events-none absolute -left-8 top-1/2 -translate-y-1/2 w-20 h-48 rounded-full blur-2xl opacity-75 animate-side-aura-left"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.7) 0%, rgba(126, 34, 206, 0.2) 70%, transparent 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 w-20 h-48 rounded-full blur-2xl opacity-75 animate-side-aura-right"
        style={{
          background: 'radial-gradient(circle, rgba(192, 132, 252, 0.7) 0%, rgba(147, 51, 234, 0.2) 70%, transparent 100%)',
        }}
      />

      {/* Top Signal & Circular Timer info */}
      <div className="flex items-start justify-between relative z-20">
        <div className="rounded-xl px-3 py-2 text-left w-[118px] border border-purple-500/30 bg-black/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <p className="hud-label leading-tight text-[#c4b5fd]">SIGNAL STRENGTH</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <p className="digital glow-purple text-xl font-black text-[#c084fc]">{signalStrength}%</p>
            <span className="text-[7.5px] font-bold text-emerald-400">OPTIMAL</span>
          </div>
          <svg viewBox="0 0 90 18" className="mt-1 h-3.5 w-full">
            <polyline
              points="0,14 12,16 24,8 36,12 48,4 60,10 72,2 84,8 90,6"
              fill="none"
              stroke="#c084fc"
              strokeWidth="1.8"
              strokeOpacity="0.95"
            />
          </svg>
        </div>

        {/* Circular Countdown Ring */}
        <div className="relative size-[76px]">
          <svg viewBox="0 0 64 64" className="size-full -rotate-90">
            <circle cx="32" cy="32" r={26} fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="4" />
            <circle
              cx="32"
              cy="32"
              r={26}
              fill="none"
              stroke={isLockPeriod ? '#f43f5e' : '#c084fc'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progressRatio)}
              style={{
                filter: glowEnabled ? `drop-shadow(0 0 10px ${isLockPeriod ? '#f43f5e' : '#c084fc'})` : 'none',
                transition: 'stroke-dashoffset 0.9s linear',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Zap className={`size-3 ${isLockPeriod ? 'text-rose-400 animate-ping' : 'text-[#c084fc] animate-bounce'}`} />
            <span
              className={`digital text-[13px] font-black leading-none ${
                isLockPeriod ? 'text-rose-400 glow-danger' : 'text-[#c084fc] glow-purple'
              }`}
            >
              {formatTime(secondsLeft)}
            </span>
            <span className="hud-label text-[6.5px] text-[#c4b5fd] mt-0.5 font-bold">
              {isLockPeriod ? 'LOCK 5S' : '60S WINGO'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Square Holographic Radar HUD */}
      <div className="mt-2 relative mx-auto aspect-square w-full max-w-[325px] rounded-2xl border-2 border-purple-500/40 bg-gradient-to-b from-[#100522]/95 via-[#080214]/98 to-[#04000a] p-3 shadow-[inset_0_0_35px_rgba(168,85,247,0.25),0_0_35px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Corner Reticles */}
        <div className="pointer-events-none absolute top-1.5 left-1.5 size-5 border-t-2 border-l-2 border-[#c084fc] shadow-[0_0_10px_#c084fc] animate-corner-pulse z-20" />
        <div className="pointer-events-none absolute top-1.5 right-1.5 size-5 border-t-2 border-r-2 border-[#c084fc] shadow-[0_0_10px_#c084fc] animate-corner-pulse z-20" />
        <div className="pointer-events-none absolute bottom-1.5 left-1.5 size-5 border-b-2 border-l-2 border-[#c084fc] shadow-[0_0_10px_#c084fc] animate-corner-pulse z-20" />
        <div className="pointer-events-none absolute bottom-1.5 right-1.5 size-5 border-b-2 border-r-2 border-[#c084fc] shadow-[0_0_10px_#c084fc] animate-corner-pulse z-20" />

        {/* Center Top Label */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-purple-950/80 border-b border-x border-purple-500/40 rounded-b text-[7px] font-mono text-[#c084fc] tracking-widest z-20">
          [TARGET RADAR HUD]
        </div>

        {/* Square Laser Scan */}
        <div className="pointer-events-none absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-[#e879f9] to-transparent shadow-[0_0_16px_#c084fc,0_0_30px_#a855f7] animate-square-scan z-10" />

        {/* Geometric Vector Background */}
        <svg viewBox="0 0 280 280" className="absolute inset-0 size-full pointer-events-none select-none z-0">
          <defs>
            <linearGradient id="purpleSquareGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.85" />
            </linearGradient>
            <pattern id="squareGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="rgba(168,85,247,0.08)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect x="10" y="10" width="260" height="260" fill="url(#squareGrid)" />
          <rect x="16" y="16" width="248" height="248" rx="12" fill="none" stroke="url(#purpleSquareGrad)" strokeWidth="1.2" strokeDasharray="14 8" />
          <rect x="36" y="36" width="208" height="208" rx="8" fill="none" stroke="#a855f7" strokeOpacity="0.22" strokeWidth="1" />
          <rect x="64" y="64" width="152" height="152" rx="6" fill="none" stroke="#c084fc" strokeOpacity="0.25" strokeDasharray="6 6" strokeWidth="1" />
          <line x1="8" y1="140" x2="52" y2="140" stroke="#c084fc" strokeOpacity="0.5" strokeWidth="1.5" />
          <line x1="228" y1="140" x2="272" y2="140" stroke="#c084fc" strokeOpacity="0.5" strokeWidth="1.5" />
          <line x1="140" y1="8" x2="140" y2="52" stroke="#c084fc" strokeOpacity="0.5" strokeWidth="1.5" />
          <line x1="140" y1="228" x2="140" y2="272" stroke="#c084fc" strokeOpacity="0.5" strokeWidth="1.5" />
          <g className="animate-spin-slow" style={{ transformOrigin: '140px 140px' }}>
            <rect x="80" y="80" width="120" height="120" rx="4" fill="none" stroke="#e879f9" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="20 40" />
          </g>
        </svg>

        {/* Foreground Content */}
        <div className="relative z-20 flex size-full flex-col items-center justify-between text-center py-2 px-1">
          {/* Locked Period Tag */}
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-purple-400/50 bg-[#16062d]/90 shadow-[0_0_12px_rgba(168,85,247,0.35)] shrink-0">
            {isScanning ? (
              <span className="text-[#e879f9] text-[8.5px] font-black animate-pulse flex items-center gap-1">
                <Crosshair className="size-2.5 animate-spin" />
                ANALYZING 1K DRAWS...
              </span>
            ) : (
              <span className="text-zinc-200 text-[8.5px] font-bold flex items-center gap-1">
                <Lock className="size-2.5 text-[#c084fc]" />
                LOCKED TARGET #{targetPeriodId?.slice(-5) || 'ISSUE'}
              </span>
            )}
          </div>

          {/* Big / Small Primary Prediction Display */}
          <div className="mt-1 flex flex-col items-center shrink-0">
            <p
              className={`digital font-black tracking-wider transition-all duration-300 text-4xl sm:text-5xl leading-none ${
                prediction === 'BIG' ? 'text-[#c084fc] glow-purple' : 'text-[#e879f9] glow-purple'
              } ${isScanning ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}
              style={{
                textShadow: glowEnabled
                  ? '0 0 16px rgba(192, 132, 252, 0.9), 0 0 35px rgba(168, 85, 247, 0.7)'
                  : 'none',
              }}
            >
              {prediction}
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <span className="digital glow-gold text-lg sm:text-xl font-black text-[#facc15]">{confidence}%</span>
              <span className="hud-label text-[7.5px] text-[#c4b5fd]">CONFIDENCE</span>
            </div>
          </div>

          {/* Target Digit 3D Ball */}
          <div className="my-1 flex flex-col items-center justify-center shrink-0">
            <div className="relative group">
              <div className="pointer-events-none absolute -inset-2 rounded-full blur-md bg-purple-500/40 animate-pulse" />
              <div className="pointer-events-none absolute -inset-1 rounded-full border border-dashed border-[#c084fc]/70 animate-spin-slow" />
              <div className="relative p-1 rounded-full bg-black/90 border-2 border-purple-400 shadow-[0_0_24px_rgba(168,85,247,0.7)] flex items-center justify-center">
                <BallIcon digit={digit} size="xl" className="drop-shadow-[0_0_12px_#c084fc] hover:scale-110 transition-transform" />
              </div>
            </div>

            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="digital text-[11px] font-black text-[#fbbf24] tracking-wider px-2 py-0.5 rounded-full bg-black/85 border border-yellow-400/50 shadow-sm flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-yellow-400 animate-ping inline-block" />
                TARGET: {digit}
              </span>
              <span
                className="text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm"
                style={{
                  borderColor: colorType === 'GREEN' ? '#22c55e' : colorType === 'RED' ? '#ef4444' : '#c084fc',
                  color: colorType === 'GREEN' ? '#86efac' : colorType === 'RED' ? '#fca5a5' : '#e9d5ff',
                  background:
                    colorType === 'GREEN'
                      ? 'rgba(34,197,94,0.25)'
                      : colorType === 'RED'
                      ? 'rgba(239,68,68,0.25)'
                      : 'rgba(168,85,247,0.25)',
                }}
              >
                {colorType}
              </span>
            </div>
          </div>

          {/* Titanium Cluster Target Bar */}
          <div className="w-full flex items-center justify-between gap-2 rounded-xl border border-purple-500/35 bg-black/80 px-2.5 py-1.5 shadow-[0_0_18px_rgba(0,0,0,0.85)] shrink-0">
            <div className="flex items-center gap-1.5 text-left leading-tight">
              <Sparkles className="size-3 text-yellow-300 animate-spin-slow shrink-0" />
              <div>
                <span className="hud-label text-[6.5px] text-[#c4b5fd] block">CLUSTER TARGET</span>
                <span className="digital text-[9.5px] font-black text-purple-200">
                  [{titaniumComboineSignal?.targetNumberCluster?.join(', ') || `${digit}, 7, 5`}]
                </span>
              </div>
            </div>
            <div className="text-right">
              <span
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow border border-purple-400/50"
                style={{
                  background:
                    titaniumComboineSignal?.hexGradient ||
                    titaniumCombo?.hexGradient ||
                    'linear-gradient(135deg, #1e1035 0%, #3b185f 50%, #7e22ce 100%)',
                  boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)',
                }}
              >
                <span>{titaniumComboineSignal?.combinationType || titaniumCombo?.comboLabel || `TITANIUM + ${colorType}`}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Consensus & Accuracy Summary Footer */}
      <div className="mt-2.5 flex items-center justify-between relative z-20 text-[9px]">
        <div className="rounded-xl px-2.5 py-1 border border-purple-500/25 bg-black/60 flex items-center gap-1.5 text-zinc-300">
          <Activity className="size-3 text-[#c084fc] animate-pulse" />
          <span className="hud-label text-[7.5px] text-[#c4b5fd]">CONSENSUS:</span>
          <span className="digital font-black text-purple-300">7/7 MODELS ALIGNED</span>
        </div>

        <div className="rounded-xl px-2.5 py-1 border border-purple-500/25 bg-black/60 flex items-center gap-1.5 text-zinc-300">
          <ShieldCheck className="size-3 text-emerald-400" />
          <span className="hud-label text-[7.5px] text-[#c4b5fd]">ACCURACY:</span>
          <span className="digital font-black text-[#c084fc]">{accuracyLevel}%</span>
        </div>
      </div>
    </section>
  );
};
