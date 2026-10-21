import React from 'react';
import {
  CheckCircle2,
  Download,
  X,
  Sparkles,
  Printer,
  FileCheck,
  Share2,
} from 'lucide-react';

export interface DownloadModalData {
  filename: string;
  format: 'SVG' | 'PNG' | 'PDF' | 'ZIP';
  resolution?: string;
}

interface DownloadSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DownloadModalData | null;
}

export const DownloadSuccessModal: React.FC<DownloadSuccessModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/80 p-6 sm:p-7 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Ambient celebration glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-blue-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr from-amber-400/20 to-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4 animate-bounce">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-700 mb-2">
            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
            <span>🎉 Congratulations!</span>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Your file is downloading!
          </h3>

          <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
            Your high-precision asset has been compiled and saved to your device.
          </p>
        </div>

        {/* File Detail Card */}
        <div className="mt-5 p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">File Format:</span>
            <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200/80 shadow-2xs">
              {data.format} {data.format === 'SVG' ? '• Scalable Vector' : '• High-Definition'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Filename:</span>
            <span className="font-mono text-[11px] font-bold text-blue-600 truncate max-w-[200px]" title={data.filename}>
              {data.filename}
            </span>
          </div>

          {data.resolution && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Resolution:</span>
              <span className="text-slate-700 font-semibold">{data.resolution}</span>
            </div>
          )}
        </div>

        {/* Optical Guarantee */}
        <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl flex items-center gap-2.5 text-xs text-blue-900">
          <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-[11px] leading-snug">
            <strong>Ready for production:</strong> Tested for instant camera recognition and commercial print standards.
          </span>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-98"
          >
            Done & Continue Editing
          </button>
        </div>
      </div>
    </div>
  );
};
