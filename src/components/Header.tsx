import React from 'react';
import { Volume2, VolumeX, LogOut, Radio } from 'lucide-react';
import { UserSession } from '../types';
import { formatTimeRemaining } from '../auth';
import { APP_CONFIG } from '../config';

interface HeaderProps {
  session?: UserSession | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogout?: () => void;
}

const LOCAL_AVATAR = '/logo.avif';

export const Header: React.FC<HeaderProps> = ({
  session,
  soundEnabled,
  onToggleSound,
  onLogout,
}) => {
  return (
    <header className="relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl px-3.5 py-2.5 border border-purple-500/35 bg-[#120626]/90 shadow-[0_6px_25px_rgba(0,0,0,0.85),0_0_15px_rgba(168,85,247,0.15)] backdrop-blur-md">
      {/* Top glowing laser line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#c084fc] to-transparent shadow-[0_0_10px_#c084fc]" />

      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative size-11 shrink-0 rounded-full border border-purple-400/60 bg-[#0c031c] p-0.5 shadow-[0_0_18px_rgba(168,85,247,0.45)] flex items-center justify-center overflow-visible">
          <div className="size-full rounded-full overflow-hidden flex items-center justify-center bg-black/80">
            <img
              src={APP_CONFIG.profileImage}
              alt={APP_CONFIG.name}
              className="size-full object-cover rounded-full"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== LOCAL_AVATAR) target.src = LOCAL_AVATAR;
              }}
            />
          </div>
          <span className="pointer-events-none absolute inset-[-3.5px] rounded-full border border-dashed border-purple-400/60 animate-spin-slow" />
          <span className="pointer-events-none absolute inset-[-7px] rounded-full border border-[#c084fc]/25 animate-pulse-ring" />
        </div>

        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="digital truncate text-[16px] font-black leading-none tracking-wider text-white flex items-center gap-1.5">
              <span className="text-[#c084fc] glow-purple">{APP_CONFIG.name}</span>
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/70 bg-purple-950/70 px-2 py-0.5 text-[8px] font-black text-[#e879f9] tracking-wider shadow-[0_0_12px_rgba(168,85,247,0.4)]">
              <span className="size-1.5 rounded-full bg-[#c084fc] animate-ping" />
              FULL ACTIVE
            </span>
          </div>
          <p className="hud-label mt-1 truncate text-[#c4b5fd] flex items-center gap-1 text-[7.5px]">
            <Radio className="size-2 text-[#c084fc] inline animate-pulse" />
            DARK PURPLE ENGINE • 99.4% ACCURACY
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {session && (
          <div className="hidden xs:flex flex-col items-end">
            <span className="digital text-[9px] font-black tracking-wider text-purple-300">
              {formatTimeRemaining(session.expiresAt)}
            </span>
            <span className="mono text-[7px] text-zinc-400">
              VIP SECURE
            </span>
          </div>
        )}

        <a
          href={APP_CONFIG.telegram}
          target="_blank"
          rel="noopener noreferrer"
          title="Join Telegram Community"
          className="grid size-8 place-items-center rounded-xl border border-sky-400/50 bg-sky-950/50 text-sky-400 transition-transform active:scale-95 hover:border-sky-300 hover:shadow-[0_0_12px_rgba(56,189,248,0.5)] cursor-pointer"
        >
          <svg className="size-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
        </a>

        <button
          type="button"
          onClick={onToggleSound}
          aria-label="Toggle Sound Effects"
          className="grid size-8 place-items-center rounded-xl border border-purple-500/40 bg-purple-950/40 text-[#c084fc] transition-transform active:scale-95 hover:border-purple-400 hover:shadow-[0_0_10px_rgba(168,85,247,0.3)] cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5 text-zinc-500" />}
        </button>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title="Sign out & lock tool"
            className="grid size-8 place-items-center rounded-xl border border-rose-500/40 bg-rose-950/40 text-rose-300 transition-transform active:scale-95 hover:border-rose-400 hover:bg-rose-900/40 cursor-pointer"
          >
            <LogOut className="size-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};

