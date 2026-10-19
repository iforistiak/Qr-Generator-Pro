import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Upload,
  FileSpreadsheet,
  Layers,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileCode,
  FileImage,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { BatchItem, QRFormValues } from '../types/qr';
import {
  generateBaseQrSvg,
  assembleFramedSvg,
  exportSvgFile,
  exportPngFile,
  svgToPngBlob,
} from '../utils/qrRenderer';

interface BatchProcessorProps {
  currentForm: QRFormValues;
}

const SAMPLE_BATCH = [
  'https://company.com/product-a, Product A - Launch Page',
  'https://company.com/product-b, Product B - Tech Specs',
  'https://company.com/menu, Restaurant Digital Menu',
  'https://company.com/wifi, Guest WiFi Access Portal',
  'https://company.com/support, 24/7 Customer Support',
];

export const BatchProcessor: React.FC<BatchProcessorProps> = ({ currentForm }) => {
  const [inputText, setInputText] = useState<string>(SAMPLE_BATCH.join('\n'));
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState<'svg' | 'png'>('svg');
  const [zipDownloading, setZipDownloading] = useState(false);

  // Parse input lines or CSV
  const handleParse = () => {
    const lines = inputText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const parsed: BatchItem[] = lines.map((line, idx) => {
      // Check if CSV format: url, title or title, url
      let content = line;
      let title = `Item #${idx + 1}`;

      if (line.includes(',')) {
        const parts = line.split(',');
        const first = parts[0].trim();
        const second = parts.slice(1).join(',').trim();
        if (/^https?:\/\//i.test(first) || !/^https?:\/\//i.test(second)) {
          content = first;
          title = second || title;
        } else {
          content = second;
          title = first || title;
        }
      }

      return {
        id: `batch-${Date.now()}-${idx}`,
        title,
        content,
        status: 'pending',
      };
    });

    setItems(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setInputText(text);
    };
    reader.readAsText(file);
  };

  // Generate QR codes for all items in batch
  const handleGenerateBatch = async () => {
    let currentItems = items;
    if (currentItems.length === 0) {
      handleParse();
      // Wait for state or use parsed
      const lines = inputText
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      currentItems = lines.map((line, idx) => ({
        id: `batch-${Date.now()}-${idx}`,
        title: line.includes(',') ? line.split(',')[1].trim() : `QR Code #${idx + 1}`,
        content: line.includes(',') ? line.split(',')[0].trim() : line,
        status: 'pending',
      }));
      setItems(currentItems);
    }

    setIsProcessing(true);
    setProgress(0);

    const updated = [...currentItems];

    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      try {
        // Construct form values for this item
        const itemForm: QRFormValues = {
          ...currentForm,
          type: 'link',
          url: item.content,
          frameLabel: item.title.slice(0, 24) || currentForm.frameLabel,
        };

        const rawSvg = await generateBaseQrSvg(itemForm, 360);
        const framedSvg = assembleFramedSvg(rawSvg, itemForm);

        item.svgData = framedSvg;
        item.status = 'ready';
      } catch (err: any) {
        console.error(err);
        item.status = 'error';
        item.error = err.message || 'Generation failed';
      }

      setProgress(Math.round(((i + 1) / updated.length) * 100));
      setItems([...updated]);
    }

    setIsProcessing(false);
  };

  // Bulk ZIP Download
  const handleDownloadZip = async () => {
    const readyItems = items.filter((i) => i.status === 'ready' && i.svgData);
    if (readyItems.length === 0) return;

    try {
      setZipDownloading(true);
      const zip = new JSZip();
      const folderName = `QR-Studio-Batch-${Date.now()}`;
      const folder = zip.folder(folderName) || zip;

      for (let i = 0; i < readyItems.length; i++) {
        const item = readyItems[i];
        const safeTitle = item.title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .slice(0, 30);
        const fileName = `${String(i + 1).padStart(2, '0')}-${safeTitle || 'qr-code'}`;

        if (exportFormat === 'svg') {
          folder.file(`${fileName}.svg`, item.svgData!);
        } else {
          // PNG Blob
          const pngBlob = await svgToPngBlob(item.svgData!, currentForm.size || 1000);
          folder.file(`${fileName}.png`, pngBlob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error creating ZIP archive');
    } finally {
      setZipDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Batch Header & Controls */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Batch QR Code Processor</h2>
              <span className="px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                Vector SVG & PNG
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Generate dozens or hundreds of customized QR codes at once with current design styling.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs">
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>Import CSV File</span>
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              type="button"
              onClick={() => setInputText(SAMPLE_BATCH.join('\n'))}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs font-semibold text-slate-600 cursor-pointer transition-colors"
            >
              Load Sample Data
            </button>
          </div>
        </div>

        {/* Textarea Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Enter URLs or Content (One per line, optional comma followed by title):
          </label>
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="https://example.com/item1, Product 1&#10;https://example.com/item2, Product 2"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
          />
        </div>

        {/* Action Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGenerateBatch}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-[#1877F2] hover:bg-blue-600 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Generate All Batch QRs</span>
                </>
              )}
            </button>
          </div>

          {/* Download format selector & ZIP download button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setExportFormat('svg')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  exportFormat === 'svg' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600'
                }`}
              >
                SVG
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('png')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  exportFormat === 'png' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600'
                }`}
              >
                PNG
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={zipDownloading || items.filter((i) => i.status === 'ready').length === 0}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-40 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{zipDownloading ? 'Compressing...' : `Download All as ZIP (${exportFormat.toUpperCase()})`}</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {isProcessing && (
          <div className="mt-4">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Dashboard Grid */}
      {items.length > 0 && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-800">
                Batch Items ({items.filter((i) => i.status === 'ready').length} / {items.length} Ready)
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      #{index + 1}
                    </span>
                    {item.status === 'ready' && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    )}
                    {item.status === 'pending' && (
                      <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        Queued
                      </span>
                    )}
                    {item.status === 'error' && (
                      <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        Error
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 truncate mb-1" title={item.title}>
                    {item.title}
                  </h4>
                  <p className="text-xs font-mono text-slate-500 truncate mb-3" title={item.content}>
                    {item.content}
                  </p>

                  {/* Thumbnail */}
                  <div className="w-full aspect-square max-w-[180px] mx-auto bg-slate-50 rounded-lg border border-slate-200/60 p-2 flex items-center justify-center overflow-hidden mb-3">
                    {item.svgData ? (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: item.svgData }}
                      />
                    ) : (
                      <div className="text-center text-slate-400 text-xs">
                        {item.status === 'error' ? 'Failed' : 'Pending Generation'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Individual Export Actions */}
                {item.status === 'ready' && item.svgData && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() =>
                        exportSvgFile(item.svgData!, `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.svg`)
                      }
                      className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>SVG</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        exportPngFile(
                          item.svgData!,
                          currentForm.size,
                          `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`
                        )
                      }
                      className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <FileImage className="w-3.5 h-3.5" />
                      <span>PNG</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
