import React from 'react';
import {
  QrCode,
  Barcode,
  Layers,
  BookmarkCheck,
  Sparkles,
} from 'lucide-react';

export type AppTab = 'generator' | 'barcode' | 'batch' | 'library';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  openPresets: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openPresets,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/80 border-b border-slate-200/70 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Desktop Single-Row Layout (md and up) */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                QR Studio<span className="text-blue-600">Pro</span>
              </span>
            </div>
          </div>

          {/* Navigation Tabs Desktop */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/70 shadow-inner">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'generator'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('barcode')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer relative ${
                activeTab === 'barcode'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Barcode className="w-3.5 h-3.5" />
              <span>Barcode</span>
            </button>

            <button
              onClick={() => setActiveTab('batch')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'batch'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Batch Processor</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-blue-100 text-blue-700 rounded-full font-bold">
                  {savedCount}
                </span>
              )}
            </button>
          </div>

          {/* Presets Action button */}
          <div className="flex items-center gap-2">
            <button
              onClick={openPresets}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Themes</span>
            </button>
          </div>
        </div>

        {/* Mobile Two-Row Header Layout (Screen < md) */}
        <div className="md:hidden py-2.5 space-y-2">
          {/* Mobile Top Row: Logo + Presets Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <QrCode className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-black tracking-tight text-slate-900">
                QR Studio<span className="text-blue-600">Pro</span>
              </span>
            </div>

            <button
              onClick={openPresets}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-2xs cursor-pointer active:scale-95 transition-transform"
            >
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
              <span>Presets</span>
            </button>
          </div>

          {/* Mobile Bottom Row: Full-Width 4-Grid Segmented Tabs */}
          <nav className="grid grid-cols-4 gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 w-full" aria-label="Main Navigation">
            {/* QR Studio */}
            <button
              type="button"
              onClick={() => setActiveTab('generator')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeTab === 'generator'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">QR Code</span>
            </button>

            {/* Barcode */}
            <button
              type="button"
              onClick={() => setActiveTab('barcode')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeTab === 'barcode'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Barcode className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Barcode</span>
            </button>

            {/* Batch */}
            <button
              type="button"
              onClick={() => setActiveTab('batch')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeTab === 'batch'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Batch</span>
            </button>

            {/* Saved Library */}
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer relative ${
                activeTab === 'library'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="relative flex items-center">
                <BookmarkCheck className="w-3.5 h-3.5 shrink-0" />
                {savedCount > 0 && (
                  <span className="sm:hidden absolute -top-1 -right-2 px-1 py-0.2 text-[8px] bg-blue-600 text-white rounded-full font-black leading-none">
                    {savedCount}
                  </span>
                )}
              </div>
              <span className="truncate">Saved</span>
              {savedCount > 0 && (
                <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] bg-blue-100 text-blue-700 rounded-full font-bold ml-0.5">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
