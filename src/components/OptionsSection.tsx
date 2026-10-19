import React from 'react';
import { QRFormValues, ErrorCorrectionLevel } from '../types/qr';

interface OptionsSectionProps {
  form: QRFormValues;
  onChange: (updates: Partial<QRFormValues>) => void;
}

const SIZES = [300, 500, 700, 1000, 1500, 2000];

const PRECISION_OPTIONS: { id: ErrorCorrectionLevel; label: string; desc: string }[] = [
  { id: 'L', label: 'L - Low', desc: 'Recovers up to 7% damage' },
  { id: 'M', label: 'M - Medium', desc: 'Recovers up to 15% damage (Standard)' },
  { id: 'Q', label: 'Q - High', desc: 'Recovers up to 25% damage (Recommended with logo)' },
  { id: 'H', label: 'H - Best', desc: 'Recovers up to 30% damage (Heavy duty)' },
];

export const OptionsSection: React.FC<OptionsSectionProps> = ({ form, onChange }) => {
  return (
    <div className="space-y-4 py-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Size dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">size (px)</label>
          <select
            value={form.size}
            onChange={(e) => onChange({ size: parseInt(e.target.value, 10) })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s} px
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400 mt-1">Output raster export dimension</p>
        </div>

        {/* Precision dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Precision</label>
          <select
            value={form.precision}
            onChange={(e) => onChange({ precision: e.target.value as ErrorCorrectionLevel })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          >
            {PRECISION_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400 mt-1">
            {PRECISION_OPTIONS.find((p) => p.id === form.precision)?.desc}
          </p>
        </div>
      </div>

      {/* Margin / Quiet zone */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
          <span>Quiet Zone / Margin</span>
          <span>{form.margin} px</span>
        </div>
        <input
          type="range"
          min="0"
          max="30"
          step="2"
          value={form.margin}
          onChange={(e) => onChange({ margin: parseInt(e.target.value, 10) })}
          className="w-full accent-blue-600 cursor-pointer"
        />
      </div>
    </div>
  );
};
