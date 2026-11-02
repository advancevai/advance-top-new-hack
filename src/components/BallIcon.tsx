import React, { useState } from 'react';

const BALL_IMAGES: Record<number, string> = {
  0: 'https://i.ibb.co/WvTR3Jrx/num0.png',
  1: 'https://i.ibb.co/yFQwGPZv/num1.png',
  2: 'https://i.ibb.co/XZNjXwjq/num2.png',
  3: 'https://i.ibb.co/233fFQqz/num3.png',
  4: 'https://i.ibb.co/mVsBYfQR/num4.png',
  5: 'https://i.ibb.co/Dg5kjr9L/num5.png',
  6: 'https://i.ibb.co/Z1HMQSPM/num6.png',
  7: 'https://i.ibb.co/0y8yYzDH/num7.png',
  8: 'https://i.ibb.co/dsRvZmSf/num8.png',
  9: 'https://i.ibb.co/prMV31Ng/num9.png',
};

interface BallIconProps {
  digit: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BallIcon: React.FC<BallIconProps> = ({ digit, size = 'md', className = '' }) => {
  const [hasError, setHasError] = useState(false);
  const cleanDigit = Math.max(0, Math.min(9, Math.floor(Number(digit) || 0)));
  const imgUrl = BALL_IMAGES[cleanDigit] || BALL_IMAGES[0];

  const sizeClasses = {
    xs: 'size-5 text-[9px]',
    sm: 'size-6 text-xs',
    md: 'size-8 text-sm',
    lg: 'size-11 text-base',
    xl: 'size-14 text-xl',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  if (hasError) {
    const getBgGradient = (d: number) => {
      if (d === 0) return 'linear-gradient(135deg, #ef4444 50%, #a855f7 50%)';
      if (d === 5) return 'linear-gradient(135deg, #10b981 50%, #a855f7 50%)';
      return [1, 3, 7, 9].includes(d) ? '#10b981' : '#ef4444';
    };

    return (
      <div
        className={`inline-grid place-items-center rounded-full font-black digital shadow text-white shrink-0 ${currentSizeClass} ${className}`}
        style={{ background: getBgGradient(cleanDigit) }}
      >
        {cleanDigit}
      </div>
    );
  }

  return (
    <img
      src={imgUrl}
      alt={`Ball ${cleanDigit}`}
      loading="lazy"
      onError={() => setHasError(true)}
      className={`inline-block object-contain shrink-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] select-none pointer-events-none transition-transform ${currentSizeClass} ${className}`}
    />
  );
};
