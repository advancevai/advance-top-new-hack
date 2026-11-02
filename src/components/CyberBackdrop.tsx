import React from 'react';

interface CyberBackdropProps {
  glow?: boolean;
  scanlines?: boolean;
}

export const CyberBackdrop: React.FC<CyberBackdropProps> = ({ glow = true, scanlines = true }) => {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none bg-[#05010b]">
      {/* Dark Ambient Aura */}
      <div
        className="absolute inset-0 transition-opacity duration-700 animate-dark-aura"
        style={{
          background: `
            radial-gradient(120% 70% at 50% 0%, rgba(168, 85, 247, 0.22), transparent 70%),
            radial-gradient(90% 60% at 85% 90%, rgba(147, 51, 234, 0.20), transparent 70%),
            radial-gradient(80% 50% at 15% 80%, rgba(192, 132, 252, 0.15), transparent 65%)
          `,
        }}
      />

      {/* Floating Side Aura Orbs */}
      <div
        className="absolute -left-20 top-1/4 h-[520px] w-48 rounded-full blur-3xl opacity-60 animate-side-aura-left pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(126, 34, 206, 0.2) 60%, transparent 80%)',
        }}
      />
      <div
        className="absolute -right-20 top-1/3 h-[520px] w-48 rounded-full blur-3xl opacity-60 animate-side-aura-right pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(192, 132, 252, 0.45) 0%, rgba(147, 51, 234, 0.2) 60%, transparent 80%)',
        }}
      />

      {/* Futuristic Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(168, 85, 247, 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(168, 85, 247, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '34px 34px',
          maskImage: 'radial-gradient(100% 75% at 50% 30%, black 20%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(100% 75% at 50% 30%, black 20%, transparent 90%)',
        }}
      />

      {/* Optional CRT Scanlines */}
      {scanlines && <div className="scanlines-overlay absolute inset-0 opacity-30 mix-blend-overlay" />}

      {/* Ambient Floating Dust Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#c084fc]"
            style={{
              width: i % 3 === 0 ? '4px' : '2.5px',
              height: i % 3 === 0 ? '4px' : '2.5px',
              left: `${(i * 37) % 96}%`,
              top: `${12 + ((i * 51) % 78)}%`,
              animation: `floatUp ${7 + (i % 5) * 2.2}s linear ${(i * 0.7) % 5}s infinite`,
              boxShadow: glow ? '0 0 10px #c084fc, 0 0 20px rgba(168, 85, 247, 0.6)' : 'none',
              opacity: 0.45 + (i % 4) * 0.12,
            }}
          />
        ))}
      </div>
    </div>
  );
};
