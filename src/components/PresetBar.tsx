import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { DESIGN_PRESETS, DesignPreset } from '../utils/presets';

interface PresetBarProps {
  onSelectPreset: (preset: DesignPreset) => void;
  onOpenAllModal: () => void;
}

export const PresetBar: React.FC<PresetBarProps> = ({ onSelectPreset, onOpenAllModal }) => {
  return (
    <div className="mb-4 sm:mb-6 bg-white/75 backdrop-blur-xl rounded-2xl border border-white/70 p-3 sm:p-3.5 shadow-xs w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>Quick Designer Themes</span>
        </div>
        <button
          type="button"
          onClick={onOpenAllModal}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition-colors cursor-pointer"
        >
          <span>View All ({DESIGN_PRESETS.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal scrolling preset cards */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {DESIGN_PRESETS.slice(0, 8).map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset)}
            className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-blue-400 rounded-xl text-xs font-semibold text-slate-700 transition-all shadow-2xs hover:shadow-xs hover:-translate-y-0.5 cursor-pointer group"
          >
            <span
              className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${preset.gradientBadge} shadow-2xs`}
            />
            <span className="group-hover:text-blue-600 transition-colors whitespace-nowrap">
              {preset.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
