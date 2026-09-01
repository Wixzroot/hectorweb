import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 36 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Silver Metallic Gradient */}
        <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#E2E8F0" />
          <stop offset="70%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* Electric Purple Gradient */}
        <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="50%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>

        {/* Glow Filter for Purple Infinity */}
        <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <path
        d="M 28 65 
           C 18 65, 10 57, 10 47 
           C 10 38, 16 31, 25 30 
           C 28 20, 37 12, 49 12 
           C 62 12, 73 21, 76 33 
           C 84 34, 90 41, 90 50 
           C 90 53, 89 56, 87 59"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="text-foreground"
      />

      {/* Vibrant Electric Purple Infinity Loop */}
      <path
        d="M 45 72 
           C 37 63, 37 53, 46 47 
           C 54 42, 64 53, 72 63 
           C 80 73, 90 68, 92 60 
           C 94 51, 85 44, 76 49 
           C 67 54, 55 68, 45 72 Z"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="text-accent"
      />
    </svg>
  );
};
