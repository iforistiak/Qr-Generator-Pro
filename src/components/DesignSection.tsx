import React from 'react';
import { QRFormValues, PatternType, MarkerBorderType, MarkerCenterType } from '../types/qr';

interface DesignSectionProps {
  form: QRFormValues;
  onChange: (updates: Partial<QRFormValues>) => void;
}

interface PatternOption {
  id: PatternType;
  name: string;
  renderIcon: () => React.ReactNode;
}

interface MarkerBorderOption {
  id: MarkerBorderType;
  name: string;
  renderIcon: () => React.ReactNode;
}

interface MarkerCenterOption {
  id: MarkerCenterType;
  name: string;
  renderIcon: () => React.ReactNode;
}

const PATTERNS: PatternOption[] = [
  {
    id: 'square',
    name: 'Square',
    renderIcon: () => (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="currentColor">
        <rect x="2" y="2" width="7" height="7" />
        <rect x="13" y="2" width="7" height="7" />
        <rect x="23" y="2" width="7" height="7" />
        <rect x="2" y="13" width="7" height="7" />
        <rect x="13" y="13" width="7" height="7" />
        <rect x="23" y="13" width="7" height="7" />
        <rect x="2" y="23" width="7" height="7" />
        <rect x="13" y="23" width="7" height="7" />
        <rect x="23" y="23" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'dots',
    name: 'Dots',
    renderIcon: () => (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="currentColor">
        <circle cx="5.5" cy="5.5" r="4" />
        <circle cx="16" cy="5.5" r="4" />
        <circle cx="26.5" cy="5.5" r="4" />
        <circle cx="5.5" cy="16" r="4" />
        <circle cx="16" cy="16" r="4" />
        <circle cx="26.5" cy="16" r="4" />
        <circle cx="5.5" cy="26.5" r="4" />
        <circle cx="16" cy="26.5" r="4" />
        <circle cx="26.5" cy="26.5" r="4" />
      </svg>
    ),
  },
  {
    id: 'rounded',
    name: 'Rounded',
    renderIcon: () => (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="currentColor">
        <rect x="2" y="2" width="7" height="7" rx="2" />
        <rect x="13" y="2" width="7" height="7" rx="2" />
        <rect x="23" y="2" width="7" height="7" rx="2" />
        <rect x="2" y="13" width="7" height="7" rx="2" />
        <rect x="13" y="13" width="7" height="7" rx="2" />
        <rect x="23" y="13" width="7" height="7" rx="2" />
        <rect x="2" y="23" width="7" height="7" rx="2" />
        <rect x="13" y="23" width="7" height="7" rx="2" />
        <rect x="23" y="23" width="7" height="7" rx="2" />
      </svg>
    ),
  },
  {
    id: 'extra-rounded',
    name: 'Extra Rounded',
    renderIcon: () => (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="currentColor">
        <rect x="2" y="2" width="7" height="7" rx="3.5" />
        <rect x="13" y="2" width="7" height="7" rx="3.5" />
        <rect x="23" y="2" width="7" height="7" rx="3.5" />
        <rect x="2" y="13" width="7" height="7" rx="3.5" />
        <rect x="13" y="13" width="7" height="7" rx="3.5" />
        <rect x="23" y="13" width="7" height="7" rx="3.5" />
        <rect x="2" y="23" width="7" height="7" rx="3.5" />
        <rect x="13" y="23" width="7" height="7" rx="3.5" />
        <rect x="23" y="23" width="7" height="7" rx="3.5" />
      </svg>
    ),
  },
  {
    id: 'classy',
    name: 'Classy',
    renderIcon: () => (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="currentColor">
        <path d="M 2 2 L 9 2 L 9 9 L 2 9 Z M 13 2 L 20 2 C 20 5.8 16.8 9 13 9 Z M 23 2 L 30 2 L 30 9 L 23 9 Z" />
        <path d="M 2 13 L 9 13 C 9 16.8 5.8 20 2 20 Z M 13 13 L 20 13 L 20 20 L 13 20 Z M 23 13 C 26.8 13 30 16.8 30 20 L 23 20 Z" />
        <path d="M 2 23 L 9 23 L 9 30 L 2 30 Z M 13 23 L 20 23 L 20 30 L 13 30 Z M 23 23 L 30 23 L 30 30 L 23 30 Z" />
      </svg>
    ),
  },
  {
    id: 'classy-rounded',
    name: 'Classy Rounded',
    renderIcon: () => (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="currentColor">
        <path d="M 2 6 C 2 3.8 3.8 2 6 2 L 9 2 L 9 9 L 2 9 Z M 13 2 L 20 2 C 20 5.8 16.8 9 13 9 Z M 23 2 L 26 2 C 28.2 2 30 3.8 30 6 L 30 9 L 23 9 Z" />
        <path d="M 2 13 L 9 13 C 9 16.8 5.8 20 2 20 Z M 13 13 L 20 13 L 20 20 L 13 20 Z M 23 13 C 26.8 13 30 16.8 30 20 L 23 20 Z" />
        <path d="M 2 23 L 9 23 L 9 30 L 6 30 C 3.8 30 2 28.2 2 26 Z M 13 23 L 20 23 L 20 30 L 13 30 Z M 23 23 L 30 23 L 30 26 C 30 28.2 28.2 30 26 30 L 23 30 Z" />
      </svg>
    ),
  },
];

const MARKER_BORDERS: MarkerBorderOption[] = [
  {
    id: 'square',
    name: 'Square',
    renderIcon: () => (
      <svg className="w-8 h-8" viewBox="0 0 32 32">
        <rect x="3" y="3" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
  },
  {
    id: 'extra-rounded',
    name: 'Rounded',
    renderIcon: () => (
      <svg className="w-8 h-8" viewBox="0 0 32 32">
        <rect x="3" y="3" width="26" height="26" rx="8" fill="none" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
  },
  {
    id: 'dot',
    name: 'Circle',
    renderIcon: () => (
      <svg className="w-8 h-8" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
  },
];

const MARKER_CENTERS: MarkerCenterOption[] = [
  {
    id: 'square',
    name: 'Square Center',
    renderIcon: () => (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="currentColor">
        <rect x="8" y="8" width="16" height="16" />
      </svg>
    ),
  },
  {
    id: 'dot',
    name: 'Dot Center',
    renderIcon: () => (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="currentColor">
        <circle cx="16" cy="16" r="8" />
      </svg>
    ),
  },
];

export const DesignSection: React.FC<DesignSectionProps> = ({ form, onChange }) => {
  return (
    <div className="space-y-5 py-1">
      {/* Pattern Row */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2.5">Pattern</label>
        <div className="flex flex-wrap gap-2.5">
          {PATTERNS.map((p) => {
            const isSelected = form.pattern === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange({ pattern: p.id })}
                title={p.name}
                className={`p-2 rounded-xl transition-all border cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-600 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                {p.renderIcon()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Marker Border Row */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2.5">Marker border</label>
        <div className="flex flex-wrap gap-2.5">
          {MARKER_BORDERS.map((b) => {
            const isSelected = form.markerBorder === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onChange({ markerBorder: b.id })}
                title={b.name}
                className={`p-2 rounded-xl transition-all border cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-600 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                {b.renderIcon()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Marker Center Row */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2.5">Marker center</label>
        <div className="flex flex-wrap gap-2.5">
          {MARKER_CENTERS.map((c) => {
            const isSelected = form.markerCenter === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onChange({ markerCenter: c.id })}
                title={c.name}
                className={`p-2 rounded-xl transition-all border cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-600 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                {c.renderIcon()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Marker Color Toggle */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 select-none">
          <input
            type="checkbox"
            checked={form.customMarkerColor}
            onChange={(e) => onChange({ customMarkerColor: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <span>Custom marker color</span>
        </label>

        {form.customMarkerColor && (
          <div className="mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Marker Border Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.markerBorderColor}
                  onChange={(e) => onChange({ markerBorderColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.markerBorderColor}
                  onChange={(e) => onChange({ markerBorderColor: e.target.value })}
                  className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Marker Center Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.markerCenterColor}
                  onChange={(e) => onChange({ markerCenterColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.markerCenterColor}
                  onChange={(e) => onChange({ markerCenterColor: e.target.value })}
                  className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
