import React, { useState } from 'react';
import { UserSession } from '../types';
import { authenticateKey, saveActiveSession } from '../auth';
import { sound } from '../audio';
import { APP_CONFIG } from '../config';

interface AuthScreenProps {
  onLoginSuccess: (session: UserSession) => void;
  expiredAlertMessage?: string | null;
}

const LOCAL_AVATAR = '/logo.avif';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, expiredAlertMessage }) => {
  const [accessKey, setAccessKey] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [showKeyText, setShowKeyText] = useState<boolean>(true);

  const ambientParticles = Array.from({ length: 16 }).map((_, i) => ({
    id: i,
    left: (i * 23) % 94,
    top: (i * 37) % 92,
    delay: (i * 0.4) % 3,
    duration: 3 + (i % 4),
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setErrorMessage('');
    setSuccessMessage('');

    const clean = accessKey.trim();
    if (!clean) {
      setErrorMessage('Please enter your VIP Password / Key.');
      sound.playWarning();
      return;
    }

    setIsVerifying(true);
    sound.playScan();

    try {
      const res = await authenticateKey(clean);
      setIsVerifying(false);

      if (res.valid) {
        sound.playJackpot();
        setSuccessMessage(`Access Granted! Redirecting to Telegram...`);
        const sess: UserSession = {
          isAuthenticated: true,
          activeKey: clean,
          expiresAt: res.record?.expiresAt || Date.now() + 30 * 86400000,
          durationDays: res.record?.durationDays || 30,
          activatedAt: res.record?.activatedAt || Date.now(),
          isAdmin: false,
        };
        saveActiveSession(sess);

        setTimeout(() => {
          onLoginSuccess(sess);
          // Redirect to Telegram channel
          try {
            const a = document.createElement('a');
            a.href = APP_CONFIG.telegram;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } catch {}
          try {
            window.location.assign(APP_CONFIG.telegram);
          } catch {}
        }, 700);
      } else {
        sound.playWarning();
        setErrorMessage(res.message || 'Wrong password');
      }
    } catch {
      setIsVerifying(false);
      sound.playWarning();
      setErrorMessage('Cannot reach the PassGate server. Is the app published?');
    }
  };

  return (
    <div
      id="pg-gate"
      className="relative min-h-screen w-full bg-[#05010b] text-white flex items-center justify-center p-4 overflow-hidden select-none font-sans text-left"
    >
      {/* Background radial gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/40 via-[#070212] to-[#020005] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Floating Particles */}
      {ambientParticles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#c084fc]/50 pointer-events-none animate-ping"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-purple-500/70 via-fuchsia-500/40 to-purple-950/60 shadow-2xl shadow-purple-950/90 backdrop-blur-3xl">
          <div className="relative rounded-3xl bg-[#0c031c]/95 p-6 sm:p-8 backdrop-blur-2xl overflow-hidden border border-purple-500/30">
            {/* Top Laser Accent */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#c084fc] to-transparent shadow-[0_0_20px_#c084fc]" />

            {/* Logo and Titles */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative group mb-3.5">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-violet-600 rounded-full blur-md opacity-60 group-hover:opacity-90 transition duration-500 animate-pulse" />
                <div className="relative size-24 rounded-full border-2 border-purple-400/80 bg-black/95 p-1 shadow-[0_0_25px_rgba(168,85,247,0.6)] flex items-center justify-center overflow-visible">
                  <div className="size-full rounded-full overflow-hidden flex items-center justify-center bg-black">
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
                  <span className="pointer-events-none absolute inset-[-4px] rounded-full border border-dashed border-purple-400/70 animate-spin-slow" />
                  <span className="pointer-events-none absolute inset-[-8px] rounded-full border border-fuchsia-400/30 animate-pulse-ring" />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-fuchsia-100 to-purple-300 uppercase">
                {APP_CONFIG.name} VIP
              </h1>
              <p className="text-xs text-purple-300/80 tracking-widest mt-1 uppercase font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] inline-block animate-ping" />
                Dark Purple Quantum AI • 99.4% Accuracy
              </p>

              <div className="flex items-center gap-2 mt-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20 flex items-center gap-1">
                  <span>🔒</span> PASSGATE SECURE
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/40 shadow-sm shadow-fuchsia-500/20 flex items-center gap-1">
                  <span>⚡</span> LIVE CLOUD AUTH
                </span>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-gray-200 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="text-[#c084fc] text-sm">🔑</span> Enter VIP Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setShowKeyText(!showKeyText);
                    }}
                    className="text-[11px] text-[#c084fc] hover:text-purple-300 font-semibold px-2 py-0.5 rounded-md hover:bg-purple-950/40 transition-colors cursor-pointer"
                  >
                    {showKeyText ? 'Hide Key' : 'Show Key'}
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="pg-pass"
                    type={showKeyText ? 'text' : 'password'}
                    value={accessKey}
                    onChange={(e) => {
                      setAccessKey(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Enter password..."
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full px-4 py-3.5 rounded-2xl bg-black/80 border border-purple-500/40 text-purple-200 placeholder-zinc-500 font-mono text-sm tracking-widest focus:outline-none focus:border-[#c084fc] focus:ring-2 focus:ring-purple-400/30 transition-all shadow-inner"
                  />
                  {accessKey && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAccessKey('')}
                        className="w-6 h-6 rounded-full bg-zinc-800 text-gray-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {expiredAlertMessage && !errorMessage && (
                <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs flex items-center gap-2 shadow-lg">
                  <span className="text-base shrink-0">⏳</span>
                  <span className="font-semibold">{expiredAlertMessage}</span>
                </div>
              )}

              {/* Status / Error Message */}
              <div
                id="pg-msg"
                className={`text-xs transition-all ${
                  errorMessage
                    ? 'p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 flex items-center gap-2 shadow-lg font-semibold'
                    : successMessage
                    ? 'p-3 rounded-xl bg-purple-950/80 border border-purple-400/70 text-purple-200 flex items-center gap-2 shadow-lg font-bold'
                    : isVerifying
                    ? 'text-purple-300 py-1'
                    : 'empty:hidden'
                }`}
              >
                {errorMessage && <span>⚠️ {errorMessage}</span>}
                {successMessage && <span>✓ {successMessage}</span>}
                {isVerifying && !errorMessage && !successMessage && <span>Checking…</span>}
              </div>

              <button
                id="pg-btn"
                type="submit"
                disabled={isVerifying}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 hover:brightness-110 transition-all shadow-xl shadow-purple-900/60 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-purple-400/40 ${
                  isVerifying ? 'opacity-70 cursor-wait' : ''
                }`}
              >
                {isVerifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>CHECKING PASSWORD...</span>
                  </>
                ) : (
                  <>
                    <span>UNLOCK VIP PREDICTION TOOL</span>
                    <span className="text-base">➔</span>
                  </>
                )}
              </button>

              {/* Telegram Channel Link */}
              <div className="pt-1">
                <a
                  href={APP_CONFIG.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-sky-200 bg-sky-950/60 hover:bg-sky-900/80 border border-sky-400/40 hover:border-sky-300 transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-sky-950/50 group cursor-pointer"
                >
                  <svg className="size-4.5 fill-sky-400 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                  <span>JOIN TELEGRAM CHANNEL</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 font-extrabold">
                    GET VIP KEY
                  </span>
                </a>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-purple-900/40 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#c084fc] inline-block animate-pulse" />
                PassGate Protected
              </span>
              <span className="font-mono text-purple-400/60">ADVANCE 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
