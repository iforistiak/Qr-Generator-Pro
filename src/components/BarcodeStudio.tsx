import React, { useState, useEffect } from 'react';
import {
  Barcode,
  Download,
  Printer,
  Copy,
  FileCode,
  FileImage,
  FileText,
  Check,
  AlertTriangle,
  Sliders,
  Paintbrush,
  Sparkles,
} from 'lucide-react';
import { BarcodeFormat, BarcodeFormValues, DEFAULT_BARCODE_VALUES } from '../types/barcode';
import {
  renderBarcodeSvg,
  exportBarcodePng,
  exportBarcodePdf,
} from '../utils/barcodeRenderer';
import { exportSvgFile, printQrCode, copySvgCode } from '../utils/qrRenderer';

interface BarcodeStudioProps {
  onSaveToLibrary: (item: { title: string; type: any; previewSvg: string; config: any }) => void;
  onDownloadSuccess?: (data: { filename: string; format: 'SVG' | 'PNG' | 'PDF'; resolution?: string }) => void;
}

const BARCODE_FORMATS: { id: BarcodeFormat; name: string; example: string; desc: string }[] = [
  { id: 'CODE128', name: 'Code 128', example: 'PRO-98241', desc: 'Universal alphanumeric, logistics & tracking' },
  { id: 'EAN13', name: 'EAN-13', example: '9780201379624', desc: 'Standard 13-digit retail barcode worldwide' },
  { id: 'UPC', name: 'UPC-A', example: '123456789012', desc: 'Standard 12-digit North American retail barcode' },
  { id: 'CODE39', name: 'Code 39', example: 'INVENTORY-42', desc: 'Industrial & automotive uppercase alphanumeric' },
  { id: 'ITF14', name: 'ITF-14', example: '10012345678902', desc: 'Shipping container & master packaging (14 digits)' },
  { id: 'pharmacode', name: 'Pharmacode', example: '12345', desc: 'Pharmaceutical packaging control (numbers 3 - 131070)' },
  { id: 'codabar', name: 'Codabar', example: 'A1234567B', desc: 'Blood banks, libraries & FedEx airbills' },
  { id: 'MSI', name: 'MSI Plessey', example: '123456', desc: 'Storage shelves & inventory control' },
];

export const BarcodeStudio: React.FC<BarcodeStudioProps> = ({ onSaveToLibrary, onDownloadSuccess }) => {
  const [form, setForm] = useState<BarcodeFormValues>(DEFAULT_BARCODE_VALUES);
  const [svgContent, setSvgContent] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Update SVG whenever form changes
  useEffect(() => {
    const { svgString, error } = renderBarcodeSvg(form);
    if (error) {
      setErrorMessage(error);
      setSvgContent('');
    } else {
      setErrorMessage(null);
      setSvgContent(svgString);
    }
  }, [form]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFormatChange = (fmt: BarcodeFormat) => {
    const selected = BARCODE_FORMATS.find((f) => f.id === fmt);
    setForm((prev) => ({
      ...prev,
      format: fmt,
      value: selected ? selected.example : prev.value,
    }));
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const filename = `barcode-${form.format.toLowerCase()}-${form.value}.svg`;
    exportSvgFile(svgContent, filename);
    showToast('Barcode SVG downloaded!');
    onDownloadSuccess?.({
      filename,
      format: 'SVG',
      resolution: 'Scalable Vector Barcode',
    });
  };

  const handleDownloadPng = async () => {
    if (!svgContent) return;
    const filename = `barcode-${form.format.toLowerCase()}-${form.value}.png`;
    await exportBarcodePng(svgContent, filename);
    showToast('Barcode PNG downloaded!');
    onDownloadSuccess?.({
      filename,
      format: 'PNG',
      resolution: '1200 px High-Res',
    });
  };

  const handleDownloadPdf = async () => {
    if (!svgContent) return;
    const filename = `barcode-${form.format.toLowerCase()}.pdf`;
    await exportBarcodePdf(
      svgContent,
      `${form.format} Barcode: ${form.value}`,
      filename
    );
    showToast('Print-ready PDF exported!');
    onDownloadSuccess?.({
      filename,
      format: 'PDF',
      resolution: 'A6 Press Sheet (300 DPI)',
    });
  };

  const handlePrint = () => {
    if (!svgContent) return;
    printQrCode(svgContent, `Barcode ${form.format} - ${form.value}`);
  };

  const handleCopySvg = async () => {
    if (!svgContent) return;
    const ok = await copySvgCode(svgContent);
    if (ok) showToast('SVG XML copied to clipboard!');
  };

  const handleSave = () => {
    if (!svgContent) return;
    onSaveToLibrary({
      title: `${form.format}: ${form.value}`,
      type: 'text' as any,
      previewSvg: svgContent,
      config: form as any,
    });
    setSavedSuccess(true);
    showToast('Saved to Library!');
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full max-w-full">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 px-3.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Column: Barcode Configuration */}
      <div className="lg:col-span-7 space-y-6 w-full max-w-full">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-sm w-full max-w-full">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">1D & 2D Barcode Generator</h2>
              <p className="text-xs text-slate-500">
                Industry-standard retail, logistics, inventory and pharmaceutical barcodes
              </p>
            </div>
          </div>

          {/* Format Selector Pills */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-700 mb-2">Barcode Symbology</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BARCODE_FORMATS.map((fmt) => {
                const isSelected = form.format === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => handleFormatChange(fmt.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-600 text-blue-700 shadow-2xs ring-1 ring-blue-500/30'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="block text-xs font-bold">{fmt.name}</span>
                    <span className="block text-[10px] text-slate-500 truncate mt-0.5">
                      {fmt.desc.split(',')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Barcode Value Input */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Barcode Data / Value</label>
              <span className="text-[11px] text-slate-400">
                Format: {BARCODE_FORMATS.find((f) => f.id === form.format)?.desc}
              </span>
            </div>
            <input
              type="text"
              value={form.value}
              onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))}
              placeholder="Enter value..."
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Customization Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
            {/* Dimensions */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                <span>Dimensions</span>
              </div>

              <div>
                <div className="flex justify-between font-medium text-slate-600 mb-1">
                  <span>Bar Width</span>
                  <span>{form.width} px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.5"
                  value={form.width}
                  onChange={(e) => setForm((prev) => ({ ...prev, width: parseFloat(e.target.value) }))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-medium text-slate-600 mb-1">
                  <span>Bar Height</span>
                  <span>{form.height} px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  step="5"
                  value={form.height}
                  onChange={(e) => setForm((prev) => ({ ...prev, height: parseInt(e.target.value, 10) }))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-medium text-slate-600 mb-1">
                  <span>Quiet Margin</span>
                  <span>{form.margin} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="2"
                  value={form.margin}
                  onChange={(e) => setForm((prev) => ({ ...prev, margin: parseInt(e.target.value, 10) }))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Colors & Text */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Paintbrush className="w-3.5 h-3.5 text-blue-600" />
                <span>Colors & Text</span>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Bar Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.lineColor}
                    onChange={(e) => setForm((prev) => ({ ...prev, lineColor: e.target.value }))}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.lineColor}
                    onChange={(e) => setForm((prev) => ({ ...prev, lineColor: e.target.value }))}
                    className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    disabled={form.transparentBackground}
                    value={form.background}
                    onChange={(e) => setForm((prev) => ({ ...prev, background: e.target.value }))}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer disabled:opacity-40"
                  />
                  <input
                    type="text"
                    disabled={form.transparentBackground}
                    value={form.transparentBackground ? 'transparent' : form.background}
                    onChange={(e) => setForm((prev) => ({ ...prev, background: e.target.value }))}
                    className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-xs focus:outline-none focus:border-blue-500 disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="pt-1 flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.transparentBackground}
                    onChange={(e) => setForm((prev) => ({ ...prev, transparentBackground: e.target.checked }))}
                    className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300"
                  />
                  <span>Transparent background</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.displayValue}
                    onChange={(e) => setForm((prev) => ({ ...prev, displayValue: e.target.checked }))}
                    className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300"
                  />
                  <span>Show text value label</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Live Barcode Preview & Stylish Exports */}
      <div className="lg:col-span-5 w-full max-w-full">
        <div className="sticky top-20 bg-white/85 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-lg p-4 sm:p-6 w-full max-w-full">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Live Barcode Preview</h3>

          {/* Barcode Render Area */}
          <div className="min-h-[160px] sm:min-h-[180px] p-3 sm:p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-center overflow-x-auto shadow-inner w-full max-w-full">
            {errorMessage ? (
              <div className="text-center p-3 text-rose-600">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
                <p className="text-xs font-semibold">{errorMessage}</p>
              </div>
            ) : svgContent ? (
              <div
                className="w-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:h-auto overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : null}
          </div>

          {/* Save Button */}
          <div className="mt-5">
            <button
              type="button"
              onClick={handleSave}
              disabled={!!errorMessage || !svgContent}
              className={`w-full py-2.5 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-40 ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{savedSuccess ? 'Saved to Library' : 'Save Barcode'}</span>
            </button>
          </div>

          {/* Stylish Export Cards */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Vector & Print Export Formats
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {/* SVG */}
              <button
                type="button"
                onClick={handleDownloadSvg}
                disabled={!svgContent}
                className="p-3 bg-gradient-to-b from-white to-slate-50/80 hover:to-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                  <FileCode className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-800 group-hover:text-blue-600">
                    SVG Vector
                  </span>
                  <span className="block text-[10px] text-slate-500">Pure Scalable</span>
                </div>
              </button>

              {/* PNG */}
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={!svgContent}
                className="p-3 bg-gradient-to-b from-white to-slate-50/80 hover:to-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                  <FileImage className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-800 group-hover:text-blue-600">
                    PNG Raster
                  </span>
                  <span className="block text-[10px] text-slate-500">High-Res 1200px</span>
                </div>
              </button>

              {/* PDF */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={!svgContent}
                className="p-3 bg-gradient-to-b from-white to-slate-50/80 hover:to-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-800 group-hover:text-blue-600">
                    PDF Label
                  </span>
                  <span className="block text-[10px] text-slate-500">A6 Press Sheet</span>
                </div>
              </button>

              {/* Print */}
              <button
                type="button"
                onClick={handlePrint}
                disabled={!svgContent}
                className="p-3 bg-gradient-to-b from-white to-slate-50/80 hover:to-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                  <Printer className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-800 group-hover:text-blue-600">
                    Direct Print
                  </span>
                  <span className="block text-[10px] text-slate-500">Instant Preview</span>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopySvg}
              disabled={!svgContent}
              className="w-full mt-3 py-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Barcode SVG to clipboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
