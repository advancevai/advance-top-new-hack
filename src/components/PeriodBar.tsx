import React from 'react';
import { Copy, RefreshCw, Clock, Radio } from 'lucide-react';
import { BallIcon } from './BallIcon';
import { WinGoResult } from '../types';
import { formatTime } from '../data';

interface PeriodBarProps {
  periodId: string;
  onRefresh?: () => void;
  isSyncing?: boolean;
  secondsRemaining?: number;
  lastResult?: WinGoResult | null;
  onCopyPeriod?: () => void;
}

export const PeriodBar: React.FC<PeriodBarProps> = ({
  periodId,
  onRefresh,
  isSyncing = false,
  secondsRemaining = 60,
  lastResult,
  onCopyPeriod,
}) => {
  const isLockPeriod = secondsRemaining <= 5;

  return (
    <section className="relative overflow-hidden rounded-2xl px-3.5 py-2.5 border border-purple-500/35 bg-gradient-to-r from-[#120524]/90 via-[#0a0316]/95 to-[#120524]/90 shadow-[0_4px_25px_rgba(0,0,0,0.85),0_0_15px_rgba(168,85,247,0.15)] animate-rise text-left">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c084fc] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#c084fc]" />
            </span>
            <p className="digital truncate text-[15px] font-black text-[#fbbf24] glow-warn tracking-wider">
              <span className="text-[#c4b5fd] font-normal">#</span> {periodId}
            </p>
          </div>
          <p className="hud-label mt-0.5 text-[#c4b5fd] flex items-center gap-1.5">
            <Radio className="size-2 text-[#c084fc]" />
            <span>ACTIVE PERIOD • LIVE 60S WINGO STREAM</span>
          </p>
        </div>

        <div
          className={`px-3 py-1 rounded-xl border flex items-center gap-1.5 digital font-black text-xs ${
            isLockPeriod
              ? 'border-rose-500/50 bg-rose-500/20 text-rose-300 glow-danger'
              : 'border-purple-400/50 bg-purple-950/60 text-[#c084fc] glow-purple'
          }`}
        >
          <Clock className={`size-3.5 ${isLockPeriod ? 'animate-ping' : ''}`} />
          <span>{formatTime(secondsRemaining)}</span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              aria-label="Resync API"
              title="Resync with Live API"
              className="grid size-8 place-items-center rounded-xl border border-purple-500/40 bg-purple-950/50 text-[#c084fc] transition-transform active:scale-95 hover:border-purple-400 hover:shadow-[0_0_12px_rgba(168,85,247,0.4)] cursor-pointer"
            >
              <RefreshCw className={`size-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          )}

          {onCopyPeriod && (
            <button
              type="button"
              onClick={onCopyPeriod}
              aria-label="Copy period ID"
              title="Copy Period ID"
              className="grid size-8 place-items-center rounded-xl border border-purple-500/40 bg-purple-950/50 text-[#c084fc] transition-transform active:scale-95 hover:border-purple-400 hover:shadow-[0_0_12px_rgba(168,85,247,0.4)] cursor-pointer"
            >
              <Copy className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {lastResult && (
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-purple-500/20 text-[10px]">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="hud-label text-[7.5px] text-[#c4b5fd]">LAST DRAW:</span>
            <span className="digital font-bold text-white">#{lastResult.issueNumber.slice(-5)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 text-[8px]">RESULT:</span>
            <BallIcon digit={lastResult.number} size="xs" />
            <span
              className={`font-black px-1.5 py-0.5 rounded text-[8.5px] ${
                lastResult.size === 'BIG'
                  ? 'bg-purple-900/60 text-[#c084fc] border border-purple-400/50'
                  : 'bg-fuchsia-900/60 text-[#e879f9] border border-fuchsia-400/50'
              }`}
            >
              {lastResult.size}
            </span>
            <span
              className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border"
              style={{
                borderColor: lastResult.color.includes('green')
                  ? '#22c55e'
                  : lastResult.color.includes('violet')
                  ? '#c084fc'
                  : '#f43f5e',
                color: lastResult.color.includes('green')
                  ? '#4ade80'
                  : lastResult.color.includes('violet')
                  ? '#c084fc'
                  : '#fb7185',
                backgroundColor: 'rgba(0,0,0,0.6)',
              }}
            >
              {lastResult.color}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
