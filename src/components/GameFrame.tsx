import React, { useState, useRef } from 'react';
import { ExternalLink, RefreshCw, Copy, Check, Gamepad2, ShieldCheck, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '../config';
import { sound } from '../audio';

interface GameFrameProps {
  className?: string;
  isStandaloneTab?: boolean;
}

export const GameFrame: React.FC<GameFrameProps> = ({ className = '', isStandaloneTab = false }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleCopyInvite = () => {
    sound.playClick();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(APP_CONFIG.invitationCode);
      } else {
        const ta = document.createElement('textarea');
        ta.value = APP_CONFIG.invitationCode;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {}
  };

  const handleReload = () => {
    sound.playClick();
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-purple-500/40 bg-gradient-to-b from-[#130728]/95 via-[#090317]/95 to-[#04010b] shadow-[0_12px_45px_-8px_rgba(168,85,247,0.35)] animate-rise text-left ${className}`}
    >
      {/* Top glowing laser accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#c084fc] to-transparent shadow-[0_0_15px_#c084fc]" />

      {/* Game Header Bar */}
      <div className="flex items-center justify-between p-3 sm:p-3.5 border-b border-purple-500/30 bg-[#0e0420]/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-purple-500/20 border border-purple-400/50 text-[#c084fc] shadow-[0_0_12px_rgba(168,85,247,0.4)]">
            <Gamepad2 className="size-4.5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="digital text-[13px] font-black tracking-wider text-white">
                <span className="text-[#c084fc] glow-purple">DKWIN</span> GAME FRAME
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 border border-emerald-400/50 px-2 py-0.5 text-[7.5px] font-black text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>
            <p className="hud-label text-[7.5px] text-[#c4b5fd] mt-0.5 flex items-center gap-1">
              <ShieldCheck className="size-2.5 text-[#c084fc]" />
              OFFICIAL WINGO 1M PORTAL
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleCopyInvite}
            title="Copy Invitation Code"
            className="flex items-center gap-1 rounded-xl border border-purple-400/40 bg-purple-950/60 px-2.5 py-1.5 text-[9px] font-black text-[#c084fc] hover:bg-purple-900/40 transition-all cursor-pointer shadow-sm"
          >
            {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
            <span className="hidden sm:inline font-mono">CODE:</span>
            <span className="font-mono text-purple-200">{copied ? 'COPIED!' : APP_CONFIG.invitationCode}</span>
          </button>

          <button
            type="button"
            onClick={handleReload}
            title="Reload Game Frame"
            className="grid size-8 place-items-center rounded-xl border border-purple-500/35 bg-purple-950/50 text-[#c084fc] hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <a
            href={APP_CONFIG.gameUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Game in Full Screen / New Tab"
            className="grid size-8 place-items-center rounded-xl border border-sky-400/50 bg-sky-950/60 text-sky-300 hover:text-white hover:border-sky-300 transition-all cursor-pointer shadow-[0_0_10px_rgba(56,189,248,0.3)]"
          >
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      {/* Quick Launch Banner (For direct access and maximum reliability) */}
      <div className="px-3.5 py-2 bg-gradient-to-r from-purple-950/70 via-black to-[#130728]/80 border-b border-purple-500/20 flex items-center justify-between gap-2 text-[10px]">
        <div className="flex items-center gap-1.5 text-zinc-300 truncate">
          <Sparkles className="size-3 text-yellow-400 shrink-0 animate-spin-slow" />
          <span className="truncate">Invite Code Applied: <strong className="text-yellow-300 font-mono">{APP_CONFIG.invitationCode}</strong></span>
        </div>
        <a
          href={APP_CONFIG.gameUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:brightness-110 text-white font-black text-[9px] tracking-wider transition-all border border-purple-300/40 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
        >
          PLAY FULLSCREEN ➔
        </a>
      </div>

      {/* Embedded Iframe Container */}
      <div className="relative w-full bg-black flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#080214]/90 backdrop-blur-sm pointer-events-none">
            <div className="size-10 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
            <p className="digital text-[11px] font-black text-[#c084fc] glow-purple tracking-widest">
              LOADING DKWIN GAME FRAME...
            </p>
          </div>
        )}

        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={APP_CONFIG.gameUrl}
          title="DKWIN Game Portal"
          className={`w-full border-0 transition-opacity duration-300 ${
            isStandaloneTab ? 'h-[75vh] min-h-[600px]' : 'h-[640px]'
          }`}
          onLoad={() => setIsLoading(false)}
          allow="camera; microphone; geolocation; fullscreen; payment"
          loading="lazy"
        />
      </div>

      {/* Frame Bottom Fallback Bar */}
      <div className="p-3 bg-[#0a0318] border-t border-purple-500/25 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <span className="text-[10px] text-[#c4b5fd]">
          Having trouble viewing inside the frame?
        </span>
        <a
          href={APP_CONFIG.gameUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-400/40 bg-sky-950/50 text-sky-300 hover:text-white text-[10px] font-bold transition-all"
        >
          <ExternalLink className="size-3" />
          <span>Launch DKWin Game in Direct Window</span>
        </a>
      </div>
    </section>
  );
};
