import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-6 border-t border-slate-200/60 bg-white/60 backdrop-blur-md relative z-10 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-1.5">
        <p className="text-xs sm:text-sm font-semibold text-slate-800">
          Develop and Deployed by <span className="text-blue-600 font-bold">MD ISTIAK ISLAM</span>.
        </p>
        <p className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} QR Studio Pro. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
