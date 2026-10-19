import React from 'react';
import { QRFormValues } from '../types/qr';

interface ColorsSectionProps {
  form: QRFormValues;
  onChange: (updates: Partial<QRFormValues>) => void;
}

export const ColorsSection: React.FC<ColorsSectionProps> = ({ form, onChange }) => {
  return (
    <div className="space-y-5 py-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Background Column */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-800">Background</label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="color"
                disabled={form.transparentBackground}
                value={form.backgroundColor.startsWith('#') ? form.backgroundColor : '#ffffff'}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer disabled:opacity-40"
              />
            </div>
            <input
              type="text"
              disabled={form.transparentBackground}
              value={form.transparentBackground ? 'transparent' : form.backgroundColor}
              onChange={(e) => onChange({ backgroundColor: e.target.value })}
              className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded text-sm font-mono text-slate-800 focus:outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>

          {/* Toggles under Background */}
          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 select-none">
              <input
                type="checkbox"
                checked={form.transparentBackground}
                onChange={(e) => onChange({ transparentBackground: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>Transparent background</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 select-none">
              <input
                type="checkbox"
                checked={form.enableBackgroundImage}
                onChange={(e) => onChange({ enableBackgroundImage: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>Background image</span>
            </label>

            {form.enableBackgroundImage && (
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 space-y-2 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Image URL / Data</label>
                  <input
                    type="text"
                    value={form.backgroundImageUrl}
                    onChange={(e) => onChange({ backgroundImageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-medium text-slate-700 mb-1">
                    <span>Opacity</span>
                    <span>{Math.round(form.backgroundImageOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={form.backgroundImageOpacity}
                    onChange={(e) => onChange({ backgroundImageOpacity: parseFloat(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Foreground Column */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-800">Foreground</label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="color"
                value={form.foregroundColor.startsWith('#') ? form.foregroundColor : '#000000'}
                onChange={(e) => onChange({ foregroundColor: e.target.value })}
                className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
              />
            </div>
            <input
              type="text"
              value={form.foregroundColor}
              onChange={(e) => onChange({ foregroundColor: e.target.value })}
              className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded text-sm font-mono text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Gradient Toggle */}
          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 select-none">
              <input
                type="checkbox"
                checked={form.enableGradient}
                onChange={(e) => onChange({ enableGradient: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>Gradient</span>
            </label>

            {form.enableGradient && (
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Type:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onChange({ gradientType: 'linear' })}
                      className={`px-2.5 py-1 rounded text-xs font-semibold ${
                        form.gradientType === 'linear'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      Linear
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ gradientType: 'radial' })}
                      className={`px-2.5 py-1 rounded text-xs font-semibold ${
                        form.gradientType === 'radial'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      Radial
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Gradient End Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.gradientColor2}
                      onChange={(e) => onChange({ gradientColor2: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.gradientColor2}
                      onChange={(e) => onChange({ gradientColor2: e.target.value })}
                      className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {form.gradientType === 'linear' && (
                  <div>
                    <div className="flex justify-between font-medium text-slate-700 mb-1">
                      <span>Angle</span>
                      <span>{form.gradientAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="5"
                      value={form.gradientAngle}
                      onChange={(e) => onChange({ gradientAngle: parseInt(e.target.value, 10) })}
                      className="w-full accent-blue-600"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
