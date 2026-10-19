import React from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { DESIGN_PRESETS, DesignPreset } from '../utils/presets';
import { QRFormValues } from '../types/qr';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: DesignPreset) => void;
  currentForm: QRFormValues;
}

export const PresetModal: React.FC<PresetModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/80 shadow-2xl max-w-3xl w-full p-4 sm:p-7 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Curated Design Presets</h3>
              <p className="text-xs text-slate-500">
                1-click designer templates with pre-tuned patterns, eye markers, frames and color gradients
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
          {DESIGN_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="p-4 rounded-2xl border border-slate-200/90 bg-white/80 hover:bg-white hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full bg-gradient-to-tr ${preset.gradientBadge} shadow-xs`}
                    />
                    <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                      {preset.name}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {preset.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  {preset.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>Apply Preset</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
