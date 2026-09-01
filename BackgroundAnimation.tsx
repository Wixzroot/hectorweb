import React from 'react';

export const BackgroundAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Subtle ambient purple glow top right */}
      <div className="absolute -top-40 right-0 w-[650px] h-[650px] bg-purple-600/10 rounded-full blur-[150px]" />
      {/* Subtle silver glow top left */}
      <div className="absolute -top-30 -left-20 w-[450px] h-[450px] bg-slate-300/5 rounded-full blur-[120px]" />
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(226,232,240,0.8) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};
