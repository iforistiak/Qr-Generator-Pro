import React, { useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { QRFormValues } from '../types/qr';
import { WATERMARK_PRESETS } from '../utils/watermarks';

interface LogoSectionProps {
  form: QRFormValues;
  onChange: (updates: Partial<QRFormValues>) => void;
}

export const LogoSection: React.FC<LogoSectionProps> = ({ form, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onChange({
        logoUrl: result,
        // When logo is uploaded, error correction should be high to ensure scanability
        precision: 'Q',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleClearLogo = () => {
    onChange({ logoUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 py-1">
      <p className="text-xs sm:text-sm text-slate-700 font-medium">
        Upload your logo or select a watermark
      </p>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Upload Button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#1877F2] hover:bg-blue-600 active:scale-[0.99] text-white rounded-md font-semibold text-sm transition-all shadow-xs cursor-pointer"
      >
        <Upload className="w-5 h-5" />
        <span>Choose Custom Image / SVG</span>
      </button>

      {/* Watermarks Preset Row */}
      <div className="pt-1">
        <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50/70 border border-slate-200/80 rounded-xl">
          {/* None / Clear Button */}
          <button
            type="button"
            onClick={handleClearLogo}
            title="No Logo"
            className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
              !form.logoUrl
                ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>

          {WATERMARK_PRESETS.map((preset) => {
            const isSelected = form.logoUrl === preset.svgDataUri;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  onChange({
                    logoUrl: preset.svgDataUri,
                    precision: 'Q',
                  })
                }
                title={preset.name}
                className={`relative w-9 h-9 rounded-lg p-0.5 border transition-all cursor-pointer flex items-center justify-center ${
                  isSelected
                    ? 'ring-2 ring-blue-500 border-transparent shadow-xs scale-105'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:scale-105'
                }`}
              >
                <img
                  src={preset.svgDataUri}
                  alt={preset.name}
                  className="w-full h-full object-contain pointer-events-none"
                />
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[9px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Remove background behind logo */}
      <div className="pt-2">
        <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 select-none">
          <input
            type="checkbox"
            checked={form.removeLogoBackground}
            onChange={(e) => onChange({ removeLogoBackground: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <span>Remove background behind Logo (Clean Cutout)</span>
        </label>
      </div>

      {/* Logo size slider */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
          <span>Logo size: {form.logoSize}%</span>
          <span className="text-[11px] text-slate-400">Scan-safe range: 10% - 35%</span>
        </div>
        <input
          type="range"
          min="10"
          max="35"
          step="1"
          value={form.logoSize}
          onChange={(e) => onChange({ logoSize: parseInt(e.target.value, 10) })}
          className="w-full accent-blue-600 cursor-pointer"
        />
      </div>

      {form.logoUrl && (
        <div className="flex items-center justify-between p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-lg text-xs text-blue-800">
          <div className="flex items-center gap-2 truncate">
            <img src={form.logoUrl} alt="Active Logo" className="w-6 h-6 object-contain rounded" />
            <span className="truncate">Active Logo Loaded</span>
          </div>
          <button
            type="button"
            onClick={handleClearLogo}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};
