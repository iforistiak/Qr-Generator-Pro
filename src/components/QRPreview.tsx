import React, { useState } from 'react';
import {
  Check,
  Printer,
  Copy,
  FileCode,
  FileImage,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowDownToLine,
  Eye,
} from 'lucide-react';
import { QRFormValues } from '../types/qr';
import {
  exportSvgFile,
  exportPngFile,
  exportPdfFile,
  printQrCode,
  copySvgCode,
} from '../utils/qrRenderer';

interface QRPreviewProps {
  form: QRFormValues;
  svgContent: string;
  isGenerating: boolean;
  onSaveToLibrary: () => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  form,
  svgContent,
  isGenerating,
  onSaveToLibrary,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadPng = async () => {
    try {
      setDownloadingFormat('png');
      await exportPngFile(svgContent, form.size, `qrcode-${form.type}-${Date.now()}.png`);
      showToast(`PNG exported at ${form.size}×${form.size}px!`);
    } catch (err) {
      console.error(err);
      showToast('Error exporting PNG');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleDownloadSvg = () => {
    try {
      setDownloadingFormat('svg');
      exportSvgFile(svgContent, `qrcode-${form.type}-${Date.now()}.svg`);
      showToast('Vector SVG downloaded!');
    } catch (err) {
      console.error(err);
      showToast('Error exporting SVG');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadingFormat('pdf');
      await exportPdfFile(
        svgContent,
        `QR Code - ${form.type.toUpperCase()}`,
        `qrcode-${form.type}-${Date.now()}.pdf`
      );
      showToast('Press-ready PDF generated!');
    } catch (err) {
      console.error(err);
      showToast('Error exporting PDF');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handlePrint = () => {
    try {
      printQrCode(svgContent, `QR Code - ${form.type.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      showToast('Error opening print preview');
    }
  };

  const handleCopySvg = async () => {
    const success = await copySvgCode(svgContent);
    if (success) {
      setCopiedSuccess(true);
      showToast('Vector SVG code copied to clipboard!');
      setTimeout(() => setCopiedSuccess(false), 2000);
    } else {
      showToast('Failed to copy to clipboard');
    }
  };

  const handleSaveClick = () => {
    onSaveToLibrary();
    setSavedSuccess(true);
    showToast('Saved to your Library!');
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="sticky top-20 bg-white/85 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/70 shadow-lg shadow-slate-200/40 p-4 sm:p-6 transition-all relative overflow-hidden w-full max-w-full">
      {/* Decorative ambient glass glow inside preview */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200 z-50 border border-slate-700/50">
          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Preview Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Vector Studio Preview
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">{form.size}px</span>
      </div>

      {/* Artwork Canvas Container */}
      <div className="relative aspect-square max-w-[320px] sm:max-w-[350px] w-full mx-auto bg-gradient-to-b from-white/90 to-slate-50/70 rounded-xl sm:rounded-2xl border border-slate-200/80 p-3 sm:p-4 flex items-center justify-center shadow-inner overflow-hidden group">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />

        {isGenerating ? (
          <div className="flex flex-col items-center gap-2 text-blue-600">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium text-slate-500">Generating vector...</span>
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-[1.015] [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:object-contain"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>

      {/* Primary Action Button: Save */}
      <div className="mt-5">
        <button
          type="button"
          onClick={handleSaveClick}
          disabled={isGenerating}
          className={`w-full py-3 rounded-full font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99] ${
            savedSuccess
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25'
          }`}
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{savedSuccess ? 'Saved to Library' : 'Save to Library'}</span>
        </button>
      </div>

      {/* Stylish Export Grid */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Download Formats
          </span>
          <span className="text-[10px] text-blue-600 font-semibold">Print & Web Ready</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* PNG Export Tile */}
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isGenerating || downloadingFormat === 'png'}
            className="p-3 bg-white/70 hover:bg-white border border-slate-200/90 hover:border-blue-400/80 rounded-2xl flex items-center gap-3 transition-all duration-200 cursor-pointer group shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <FileImage className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left overflow-hidden">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  PNG
                </span>
                <span className="text-[9px] font-extrabold uppercase bg-blue-50 text-blue-700 px-1 py-0.2 rounded">
                  HD
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                {form.size}×{form.size}px
              </span>
            </div>
          </button>

          {/* SVG Export Tile */}
          <button
            type="button"
            onClick={handleDownloadSvg}
            disabled={isGenerating || downloadingFormat === 'svg'}
            className="p-3 bg-white/70 hover:bg-white border border-slate-200/90 hover:border-emerald-400/80 rounded-2xl flex items-center gap-3 transition-all duration-200 cursor-pointer group shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <FileCode className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left overflow-hidden">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  SVG
                </span>
                <span className="text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded">
                  Vector
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                Figma & Plotter
              </span>
            </div>
          </button>

          {/* PDF Export Tile */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGenerating || downloadingFormat === 'pdf'}
            className="p-3 bg-white/70 hover:bg-white border border-slate-200/90 hover:border-rose-400/80 rounded-2xl flex items-center gap-3 transition-all duration-200 cursor-pointer group shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left overflow-hidden">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                  PDF
                </span>
                <span className="text-[9px] font-extrabold uppercase bg-rose-50 text-rose-700 px-1 py-0.2 rounded">
                  Print
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                A4 Document
              </span>
            </div>
          </button>

          {/* Print Tile */}
          <button
            type="button"
            onClick={handlePrint}
            disabled={isGenerating}
            className="p-3 bg-white/70 hover:bg-white border border-slate-200/90 hover:border-purple-400/80 rounded-2xl flex items-center gap-3 transition-all duration-200 cursor-pointer group shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Printer className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left overflow-hidden">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                  Print
                </span>
                <span className="text-[9px] font-extrabold uppercase bg-purple-50 text-purple-700 px-1 py-0.2 rounded">
                  Direct
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                Sheet Preview
              </span>
            </div>
          </button>
        </div>

        {/* Quick Copy Action */}
        <div className="mt-3 flex items-center justify-center">
          <button
            type="button"
            onClick={handleCopySvg}
            className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied Vector Code!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy SVG XML Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Static Guarantee Badge */}
      <div className="mt-4 p-3 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-200/70 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-950 block">Permanent Static Matrix</span>
          <p className="text-[11px] text-amber-800 leading-tight mt-0.5">
            Never expires or relies on external redirects. Scans directly and works offline forever.
          </p>
        </div>
      </div>
    </div>
  );
};
