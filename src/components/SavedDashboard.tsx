import React, { useState } from 'react';
import {
  Search,
  Trash2,
  Edit3,
  Download,
  FileCode,
  FileImage,
  FileText,
  Calendar,
  Layers,
  Inbox,
} from 'lucide-react';
import { SavedQRCode, QRFormValues } from '../types/qr';
import { exportSvgFile, exportPngFile, exportPdfFile } from '../utils/qrRenderer';

interface SavedDashboardProps {
  savedCodes: SavedQRCode[];
  onLoadConfig: (config: QRFormValues) => void;
  onDeleteCode: (id: string) => void;
  onClearAll: () => void;
}

export const SavedDashboard: React.FC<SavedDashboardProps> = ({
  savedCodes,
  onLoadConfig,
  onDeleteCode,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredCodes = savedCodes.filter((code) => {
    const matchesSearch =
      code.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || code.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Dashboard Top bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Saved QR Code Library</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage your saved designs, quick download vector files, or re-open them in the studio.
            </p>
          </div>

          {savedCodes.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to delete all saved QR codes?')) {
                  onClearAll();
                }
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors self-start sm:self-auto cursor-pointer"
            >
              Clear All Library
            </button>
          )}
        </div>

        {/* Search & Filter */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or type..."
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Data Types</option>
            <option value="link">Link</option>
            <option value="text">Text</option>
            <option value="wifi">Wi-Fi</option>
            <option value="vcard">V-Card</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="location">Location</option>
            <option value="event">Event</option>
          </select>
        </div>
      </div>

      {/* Grid of Saved Codes */}
      {filteredCodes.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Saved QR Codes Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Create and customize a QR code in the Generator tab, then click the <strong>Save</strong> button to preserve it here for easy repeat downloads.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCodes.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/60 rounded">
                    {item.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteCode(item.id)}
                    title="Delete item"
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-slate-900 truncate mb-1" title={item.title}>
                  {item.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Thumbnail Preview */}
                <div className="w-full aspect-square max-w-[200px] mx-auto bg-slate-50 rounded-xl border border-slate-200/80 p-3 flex items-center justify-center overflow-hidden mb-4 shadow-2xs">
                  <div
                    className="w-full h-full flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: item.previewSvg }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onLoadConfig(item.config)}
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100/80 text-blue-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Open in Generator</span>
                </button>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      exportSvgFile(item.previewSvg, `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.svg`)
                    }
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title="Vector SVG"
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-600" />
                    <span>SVG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      exportPngFile(
                        item.previewSvg,
                        item.config.size || 1000,
                        `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`
                      )
                    }
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title="High-Res PNG"
                  >
                    <FileImage className="w-3.5 h-3.5 text-blue-600" />
                    <span>PNG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      exportPdfFile(
                        item.previewSvg,
                        item.title,
                        `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`
                      )
                    }
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title="Print PDF"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
