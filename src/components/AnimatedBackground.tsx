import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full max-w-full pointer-events-none overflow-hidden z-0 select-none">
      {/* Dynamic Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100/60 to-blue-50/40" />

      {/* Floating Glass Orb 1 - Sapphire Cyan */}
      <div
        className="absolute -top-16 -left-16 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full animate-float-slow opacity-50 sm:opacity-60 mix-blend-multiply will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(37, 99, 235, 0.2) 50%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Floating Glass Orb 2 - Electric Indigo */}
      <div
        className="absolute top-1/4 -right-16 w-80 sm:w-[550px] h-80 sm:h-[550px] rounded-full animate-float-reverse opacity-45 sm:opacity-55 mix-blend-multiply will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.35) 0%, rgba(99, 102, 241, 0.2) 50%, transparent 70%)',
          filter: 'blur(45px)',
        }}
      />

      {/* Floating Glass Orb 3 - Soft Emerald Cyan */}
      <div
        className="absolute -bottom-24 left-1/4 w-80 sm:w-[600px] h-80 sm:h-[600px] rounded-full animate-float-slow opacity-40 sm:opacity-50 mix-blend-multiply will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(45, 212, 191, 0.3) 0%, rgba(14, 165, 233, 0.15) 50%, transparent 70%)',
          filter: 'blur(50px)',
          animationDelay: '-6s',
        }}
      />

      {/* Glass Frost Refraction Rings (Only on larger screens for zero mobile lag) */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full border border-white/40 bg-white/5 backdrop-blur-2xl shadow-xl shadow-blue-500/5 animate-float-gentle hidden lg:block" />
      <div
        className="absolute bottom-28 right-16 w-96 h-96 rounded-full border border-white/50 bg-white/5 backdrop-blur-2xl shadow-2xl shadow-indigo-500/5 animate-float-gentle hidden lg:block"
        style={{ animationDelay: '-3s' }}
      />

      {/* High-Tech Technical Dot Matrix Grid */}
      <div
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: 'radial-gradient(rgba(100, 116, 139, 0.35) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
