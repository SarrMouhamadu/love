import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
  }[size];

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size];

  const badgeSizes = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Emblem SVG: Modern Interconnected Rings / Shield-Heart in White & Electric Blue */}
      <div
        className={`${iconDimensions} relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/25 ring-1 ring-white/20`}
      >
        <div className="w-full h-full rounded-[14px] bg-[#07090E]/90 flex items-center justify-center overflow-hidden relative">
          {/* Subtle luminous blue glow behind */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-sky-400/20 pointer-events-none" />

          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3/5 h-3/5 relative z-10"
          >
            {/* Left loop in pure crisp white */}
            <path
              d="M13.5 10C9.91 10 7 12.91 7 16.5C7 21.5 13.5 26 18 27.5C14.5 25 10 21 10 16.5C10 14.57 11.57 13 13.5 13C15.43 13 17 14.57 17 16.5H20C20 12.91 17.09 10 13.5 10Z"
              fill="#FFFFFF"
            />
            {/* Right loop in electric cyan/blue */}
            <path
              d="M22.5 10C26.09 10 29 12.91 29 16.5C29 21.5 22.5 26 18 27.5C21.5 25 26 21 26 16.5C26 14.57 24.43 13 22.5 13C20.57 13 19 14.57 19 16.5H16C16 12.91 18.91 10 22.5 10Z"
              fill="#38BDF8"
            />
            {/* Center spark node connecting both in white */}
            <circle cx="18" cy="18" r="2.2" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex items-center gap-1.5 font-sans">
          <span className={`${textSizes} font-extrabold tracking-tight text-white`}>
            ANONYME
          </span>
          <span
            className={`${badgeSizes} font-black tracking-wider uppercase rounded-lg bg-blue-500/15 text-blue-400 border border-blue-400/30 shadow-xs`}
          >
            PRO
          </span>
        </div>
      )}
    </div>
  );
};
