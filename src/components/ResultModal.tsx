import React from 'react';
import { ArrowRight, Trophy, Crown, XCircle } from 'lucide-react';
import { BallIcon } from './BallIcon';
import { BetSize, ColorType, OutcomeType, TitaniumCombo } from '../types';

interface ResultModalProps {
  data: {
    type: OutcomeType;
    issueNumber: string;
    predictedSize: BetSize;
    predictedDigit: number;
    actualDigit: number;
    actualColor: string;
    actualSize: BetSize;
    titaniumCombo?: TitaniumCombo;
  } | null;
  onClose: () => void;
}

const CyberTiger: React.FC<{ outcome: OutcomeType }> = ({ outcome }) => {
  const isJackpot = outcome === 'JACKPOT';
  const isWin = outcome === 'WIN';

  const primaryColor = isJackpot ? '#fbbf24' : isWin ? '#c084fc' : '#f43f5e';
  const secondaryColor = isJackpot ? '#f59e0b' : isWin ? '#a855f7' : '#e11d48';
  const glowEye = isJackpot ? '#fef08a' : isWin ? '#f0abfc' : '#fda4af';
  const pupilColor = isJackpot || isWin ? '#ffffff' : '#ffe4e6';

  return (
    <div className="relative inline-flex items-center justify-center select-none">
      <div
        className="pointer-events-none absolute -inset-6 rounded-full blur-2xl opacity-80 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${primaryColor}88 0%, ${secondaryColor}33 60%, transparent 80%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-2 rounded-full border border-dashed animate-spin-slow opacity-60"
        style={{ borderColor: primaryColor }}
      />
      <svg
        viewBox="0 0 200 200"
        className="relative size-24 sm:size-28 drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:scale-105"
        style={{ filter: `drop-shadow(0 0 16px ${primaryColor}aa)` }}
      >
        <defs>
          <linearGradient id="tigerMetallicBase" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e0b36" />
            <stop offset="45%" stopColor="#0c0217" />
            <stop offset="100%" stopColor="#05010b" />
          </linearGradient>
          <linearGradient id="tigerPlatesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isJackpot ? '#f59e0b' : isWin ? '#c084fc' : '#f43f5e'} />
            <stop offset="50%" stopColor={isJackpot ? '#b45309' : isWin ? '#7e22ce' : '#9f1239'} />
            <stop offset="100%" stopColor="#0a0212" />
          </linearGradient>
          <linearGradient id="tigerGoldTrim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={isJackpot ? '#fef08a' : isWin ? '#e879f9' : '#fda4af'} />
            <stop offset="50%" stopColor={isJackpot ? '#eab308' : isWin ? '#a855f7' : '#e11d48'} />
            <stop offset="100%" stopColor={isJackpot ? '#78350f' : isWin ? '#581c87' : '#881337'} />
          </linearGradient>
          <linearGradient id="tigerFangGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={pupilColor} />
            <stop offset="40%" stopColor={glowEye} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ears */}
        <polygon points="25,35 65,15 75,55" fill="url(#tigerMetallicBase)" stroke="url(#tigerGoldTrim)" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="35,38 60,25 68,52" fill={primaryColor} fillOpacity="0.25" />
        <line x1="28" y1="30" x2="33" y2="28" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="33" y1="24" x2="38" y2="22" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

        <polygon points="175,35 135,15 125,55" fill="url(#tigerMetallicBase)" stroke="url(#tigerGoldTrim)" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="165,38 140,25 132,52" fill={primaryColor} fillOpacity="0.25" />
        <line x1="172" y1="30" x2="167" y2="28" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="167" y1="24" x2="162" y2="22" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

        {/* Head Shell */}
        <polygon points="100,25 140,45 160,85 175,125 145,155 100,185 55,155 25,125 40,85 60,45" fill="url(#tigerMetallicBase)" stroke="url(#tigerGoldTrim)" strokeWidth="2" strokeLinejoin="round" />

        {/* Forehead crest */}
        <polygon points="100,20 108,55 100,70 92,55" fill="url(#tigerGoldTrim)" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.8" />
        <polygon points="78,35 92,52 82,60 70,45" fill="url(#tigerPlatesGrad)" />
        <polygon points="122,35 108,52 118,60 130,45" fill="url(#tigerPlatesGrad)" />

        {/* Cyber Eyes & Brows */}
        <polyline points="48,82 75,76 100,90 125,76 152,82" fill="none" stroke="url(#tigerGoldTrim)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="56,86 86,83 78,98 52,94" fill="#000000" stroke={primaryColor} strokeWidth="1.5" />
        <ellipse cx="68" cy="90" rx="9" ry="5" fill="url(#eyeGlow)" className="animate-pulse" />
        <line x1="68" y1="84" x2="68" y2="95" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

        <polygon points="144,86 114,83 122,98 148,94" fill="#000000" stroke={primaryColor} strokeWidth="1.5" />
        <ellipse cx="132" cy="90" rx="9" ry="5" fill="url(#eyeGlow)" className="animate-pulse" />
        <line x1="132" y1="84" x2="132" y2="95" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

        {/* Snout & Fangs */}
        <polygon points="100,90 88,125 100,135 112,125" fill="url(#tigerMetallicBase)" stroke="url(#tigerGoldTrim)" strokeWidth="1.5" />
        <polygon points="100,126 90,138 100,144 110,138" fill={primaryColor} stroke="#ffffff" strokeWidth="1.2" />
        <polygon points="75,142 100,146 125,142 135,155 100,165 65,155" fill="#05010b" stroke="url(#tigerGoldTrim)" strokeWidth="1.8" />
        <polygon points="76,145 84,145 80,166" fill="url(#tigerFangGrad)" stroke="#ffffff" strokeWidth="1" />
        <polygon points="124,145 116,145 120,166" fill="url(#tigerFangGrad)" stroke="#ffffff" strokeWidth="1" />
        <polygon points="88,166 100,188 112,166 100,174" fill="url(#tigerGoldTrim)" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

export const ResultModal: React.FC<ResultModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  const isWin = data.type === 'WIN';
  const isJackpot = data.type === 'JACKPOT';
  const isLoss = data.type === 'LOSS';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-rise"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl p-6 text-center overflow-hidden border transition-all duration-500 shadow-[0_0_60px_rgba(0,0,0,0.95)]"
        style={{
          background: isJackpot
            ? 'radial-gradient(circle at 50% 20%, #2a1804 0%, #0c0514 100%)'
            : isWin
            ? 'radial-gradient(circle at 50% 20%, #21083d 0%, #0a0316 100%)'
            : 'radial-gradient(circle at 50% 20%, #2a0512 0%, #0d0208 100%)',
          borderColor: isJackpot ? '#fbbf24' : isWin ? '#c084fc' : '#f43f5e',
          boxShadow: isJackpot
            ? '0 0 50px rgba(251, 191, 36, 0.45), inset 0 0 30px rgba(251, 191, 36, 0.25)'
            : isWin
            ? '0 0 50px rgba(192, 132, 252, 0.45), inset 0 0 30px rgba(168, 85, 247, 0.25)'
            : '0 0 40px rgba(244, 63, 94, 0.35), inset 0 0 25px rgba(244, 63, 94, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background light */}
        <div
          className="pointer-events-none absolute -inset-x-20 top-0 h-40 opacity-40 blur-3xl animate-pulse"
          style={{ background: isJackpot ? '#fbbf24' : isWin ? '#c084fc' : '#f43f5e' }}
        />

        {/* 3D Cyber Tiger Centerpiece */}
        <div className="relative mx-auto flex flex-col items-center justify-center mb-4">
          <CyberTiger outcome={data.type} />
          <div
            className="mt-1 px-3 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5"
            style={{
              background: isJackpot
                ? 'linear-gradient(135deg, #78350f, #fbbf24)'
                : isWin
                ? 'linear-gradient(135deg, #581c87, #c084fc)'
                : 'linear-gradient(135deg, #881337, #f43f5e)',
              borderColor: '#ffffff',
              color: '#ffffff',
            }}
          >
            {isJackpot && <Crown className="size-3 text-white animate-bounce" />}
            {isWin && <Trophy className="size-3 text-white animate-bounce" />}
            {isLoss && <XCircle className="size-3 text-white" />}
            <span>{isJackpot ? '3D STREET TIGER • JACKPOT' : isWin ? '3D STREET TIGER • WIN' : '3D STREET TIGER • RETRY'}</span>
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="space-y-1 relative z-10">
          <p className="hud-label text-[9px] tracking-[0.25em] text-[#c4b5fd]">
            ROUND #{data.issueNumber.slice(-5)} CONCLUDED
          </p>
          <h2
            className="digital text-4xl font-black tracking-wider uppercase"
            style={{
              color: isJackpot ? '#fbbf24' : isWin ? '#c084fc' : '#fb7185',
              textShadow: isJackpot
                ? '0 0 20px #fbbf24, 0 0 40px rgba(251,191,36,0.6)'
                : isWin
                ? '0 0 20px #c084fc, 0 0 40px rgba(192,132,252,0.6)'
                : '0 0 20px #f43f5e',
            }}
          >
            {isJackpot ? 'JACKPOT HIT!' : isWin ? 'PREDICTION WIN!' : 'ROUND MISSED'}
          </h2>
          <p className="text-xs font-semibold text-zinc-300">
            {isJackpot
              ? 'Exact Number + Color Lock Alignment!'
              : isWin
              ? 'ANSH AI Neural Signal 100% Accurate!'
              : 'Market anomaly detected. V12 Zero-Loss reversing next round.'}
          </p>
        </div>

        {/* Outcome Comparison Box */}
        <div className="mt-5 rounded-2xl bg-black/70 border border-purple-500/30 p-3.5 space-y-2.5 relative z-10 text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">PREDICTED PICK:</span>
            <div className="flex items-center gap-1.5">
              <span className="digital font-black text-[#c084fc] bg-purple-900/40 px-2 py-0.5 rounded border border-purple-400/40">
                {data.predictedSize}
              </span>
              <BallIcon digit={data.predictedDigit} size="sm" />
              <span className="digital font-bold text-zinc-300">[{data.predictedDigit}]</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-purple-500/20">
            <span className="text-zinc-400">ACTUAL DRAW:</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`digital font-black px-2 py-0.5 rounded border ${
                  data.actualSize === data.predictedSize
                    ? 'border-[#c084fc] bg-purple-900/50 text-[#c084fc]'
                    : 'border-zinc-600 bg-zinc-800 text-zinc-300'
                }`}
              >
                {data.actualSize}
              </span>
              <BallIcon digit={data.actualDigit} size="sm" />
              <span
                className="text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded border"
                style={{
                  borderColor: data.actualColor.includes('green')
                    ? '#22c55e'
                    : data.actualColor.includes('violet')
                    ? '#c084fc'
                    : '#f43f5e',
                  color: data.actualColor.includes('green')
                    ? '#4ade80'
                    : data.actualColor.includes('violet')
                    ? '#c084fc'
                    : '#fb7185',
                }}
              >
                {data.actualColor}
              </span>
            </div>
          </div>
        </div>

        {/* Continue Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-2xl font-black digital text-xs tracking-wider uppercase transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-xl cursor-pointer"
          style={{
            background: isJackpot
              ? 'linear-gradient(to right, #fbbf24, #f59e0b)'
              : isWin
              ? 'linear-gradient(to right, #a855f7, #c084fc)'
              : 'linear-gradient(to right, #e11d48, #f43f5e)',
            color: '#ffffff',
            boxShadow: isJackpot
              ? '0 0 20px rgba(251, 191, 36, 0.5)'
              : isWin
              ? '0 0 20px rgba(192, 132, 252, 0.5)'
              : '0 0 20px rgba(244, 63, 94, 0.5)',
          }}
        >
          <span>CONTINUE TO NEXT ROUND</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
};
