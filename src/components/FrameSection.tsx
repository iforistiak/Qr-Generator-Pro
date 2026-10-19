import React from 'react';
import { X } from 'lucide-react';
import { QRFormValues, FrameType } from '../types/qr';

interface FrameSectionProps {
  form: QRFormValues;
  onChange: (updates: Partial<QRFormValues>) => void;
}

interface FrameOption {
  id: FrameType;
  name: string;
  renderThumbnail: () => React.ReactNode;
}

const FRAMES: FrameOption[] = [
  {
    id: 'none',
    name: 'No Frame',
    renderThumbnail: () => (
      <div className="w-9 h-11 border border-slate-300 rounded flex items-center justify-center text-slate-400">
        <X className="w-5 h-5" />
      </div>
    ),
  },
  {
    id: 'bottom-banner',
    name: 'Bottom Banner',
    renderThumbnail: () => (
      <div className="w-9 h-11 border border-slate-700 rounded bg-white p-1 flex flex-col justify-between">
        <div className="w-full flex-1 border border-dashed border-slate-300 rounded-xs mb-1" />
        <div className="w-full h-2.5 bg-slate-900 rounded-xs" />
      </div>
    ),
  },
  {
    id: 'top-banner',
    name: 'Top Banner',
    renderThumbnail: () => (
      <div className="w-9 h-11 border border-slate-700 rounded bg-white p-1 flex flex-col justify-between">
        <div className="w-full h-2.5 bg-slate-900 rounded-xs mb-1" />
        <div className="w-full flex-1 border border-dashed border-slate-300 rounded-xs" />
      </div>
    ),
  },
  {
    id: 'ribbon',
    name: 'Ribbon',
    renderThumbnail: () => (
      <div className="w-9 h-11 border-2 border-slate-700 rounded-md bg-white p-1 flex flex-col justify-between relative">
        <div className="w-full flex-1 border border-dashed border-slate-300 rounded-xs mb-1" />
        <div className="w-full h-2 bg-slate-900 rounded-xs shadow-xs" />
      </div>
    ),
  },
  {
    id: 'phone',
    name: 'Smartphone',
    renderThumbnail: () => (
      <div className="w-9 h-11 border-2 border-slate-900 rounded-lg bg-white p-1 flex flex-col items-center justify-between">
        <div className="w-2.5 h-0.5 bg-slate-900 rounded-full" />
        <div className="w-full flex-1 border border-dashed border-slate-300 rounded-xs my-0.5" />
        <div className="w-3 h-0.5 bg-slate-400 rounded-full" />
      </div>
    ),
  },
  {
    id: 'ticket',
    name: 'Ticket / Pass',
    renderThumbnail: () => (
      <div className="w-9 h-11 border border-slate-800 rounded-xs bg-white p-1 flex flex-col justify-between relative">
        <div className="w-full h-1 bg-slate-800 mb-1" />
        <div className="w-full flex-1 border border-dashed border-slate-300 rounded-xs" />
      </div>
    ),
  },
  {
    id: 'badge',
    name: 'ID Badge',
    renderThumbnail: () => (
      <div className="w-9 h-11 border border-slate-600 rounded bg-white p-1 flex flex-col items-center justify-between">
        <div className="w-3 h-1 border border-slate-400 rounded-full mb-0.5" />
        <div className="w-full h-1.5 bg-slate-900 mb-1" />
        <div className="w-full flex-1 border border-dashed border-slate-300 rounded-xs" />
      </div>
    ),
  },
  {
    id: 'pill',
    name: 'Rounded Pill',
    renderThumbnail: () => (
      <div className="w-9 h-11 border-2 border-slate-700 rounded-xl bg-white p-1 flex flex-col justify-between">
        <div className="w-full flex-1 border border-dashed border-slate-300 rounded-lg mb-1" />
        <div className="w-5/6 mx-auto h-2 bg-slate-900 rounded-full" />
      </div>
    ),
  },
];

const FONTS = [
  { id: "'Inter', sans-serif", label: 'Inter' },
  { id: "'Abril Fatface', cursive", label: 'AbrilFatface' },
  { id: "'Montserrat', sans-serif", label: 'Montserrat' },
  { id: "'Oswald', sans-serif", label: 'Oswald' },
  { id: "'Playfair Display', serif", label: 'Playfair Display' },
  { id: 'sans-serif', label: 'Default Sans' },
];

export const FrameSection: React.FC<FrameSectionProps> = ({ form, onChange }) => {
  return (
    <div className="space-y-4 py-1">
      {/* Frame thumbnail selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">Frame Style</label>
        <div className="flex flex-wrap items-center gap-2.5 p-2 bg-slate-50/70 border border-slate-200/80 rounded-xl">
          {FRAMES.map((f) => {
            const isSelected = form.frame === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onChange({ frame: f.id })}
                title={f.name}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-blue-600 bg-blue-50/90 shadow-xs'
                    : 'hover:bg-slate-100 bg-white'
                }`}
              >
                {f.renderThumbnail()}
              </button>
            );
          })}
        </div>
      </div>

      {form.frame !== 'none' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Frame label</label>
              <input
                type="text"
                value={form.frameLabel}
                onChange={(e) => onChange({ frameLabel: e.target.value })}
                placeholder="SCAN ME"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Label font</label>
              <select
                value={form.frameFont}
                onChange={(e) => onChange({ frameFont: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              >
                {FONTS.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <span>Text size: {form.frameTextSize}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="140"
              step="5"
              value={form.frameTextSize}
              onChange={(e) => onChange({ frameTextSize: parseInt(e.target.value, 10) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Custom frame color toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 select-none">
              <input
                type="checkbox"
                checked={form.customFrameColor}
                onChange={(e) => onChange({ customFrameColor: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>Custom frame color</span>
            </label>

            {form.customFrameColor && (
              <div className="mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Banner / Border Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.frameColor}
                      onChange={(e) => onChange({ frameColor: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.frameColor}
                      onChange={(e) => onChange({ frameColor: e.target.value })}
                      className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Label Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.frameTextColor}
                      onChange={(e) => onChange({ frameTextColor: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.frameTextColor}
                      onChange={(e) => onChange({ frameTextColor: e.target.value })}
                      className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
