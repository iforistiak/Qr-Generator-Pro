import React, { useState, useEffect, useRef } from 'react';
import {
  Paintbrush,
  QrCode,
  ShieldCheck,
  Frame,
  Sliders,
  Sparkles,
  Layers,
  BookmarkCheck,
  Eye,
  Settings2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

import { QRFormValues, QRType, SavedQRCode } from './types/qr';
import { DEFAULT_FORM_VALUES, DesignPreset } from './utils/presets';
import { generateBaseQrSvg, assembleFramedSvg } from './utils/qrRenderer';
import { Header, AppTab } from './components/Header';
import { AnimatedBackground } from './components/AnimatedBackground';
import { TypeSelector } from './components/TypeSelector';
import { TypeInputs } from './components/TypeInputs';
import { AccordionSection } from './components/AccordionSection';
import { ColorsSection } from './components/ColorsSection';
import { DesignSection } from './components/DesignSection';
import { LogoSection } from './components/LogoSection';
import { FrameSection } from './components/FrameSection';
import { OptionsSection } from './components/OptionsSection';
import { QRPreview } from './components/QRPreview';
import { RealTimeAnalysis } from './components/RealTimeAnalysis';
import { BarcodeStudio } from './components/BarcodeStudio';
import { BatchProcessor } from './components/BatchProcessor';
import { SavedDashboard } from './components/SavedDashboard';
import { PresetModal } from './components/PresetModal';
import { PresetBar } from './components/PresetBar';
import { Footer } from './components/Footer';

const LOCAL_STORAGE_KEY = 'qr_studio_pro_saved_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('generator');
  const [mobileSubTab, setMobileSubTab] = useState<'editor' | 'preview'>('editor');
  const [form, setForm] = useState<QRFormValues>(() => {
    try {
      const savedDraft = localStorage.getItem('qr_studio_draft_v2');
      if (savedDraft) {
        return { ...DEFAULT_FORM_VALUES, ...JSON.parse(savedDraft) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_FORM_VALUES;
  });

  const [svgContent, setSvgContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [openSection, setOpenSection] = useState<string | null>('colors');
  const [savedCodes, setSavedCodes] = useState<SavedQRCode[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync draft to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('qr_studio_draft_v2', JSON.stringify(form));
    } catch {
      // ignore
    }
  }, [form]);

  // Sync saved items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedCodes));
    } catch {
      // ignore
    }
  }, [savedCodes]);

  // Render QR Code SVG whenever form updates
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsGenerating(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const rawSvg = await generateBaseQrSvg(form, 360);
        const completeSvg = assembleFramedSvg(rawSvg, form);
        setSvgContent(completeSvg);
      } catch (err) {
        console.error('QR Generation error:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 100);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [form]);

  const updateForm = (updates: Partial<QRFormValues>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const handleSaveToLibrary = () => {
    let title = form.frameLabel || 'My QR Code';
    if (form.type === 'link' && form.url) {
      try {
        const parsed = new URL(form.url.startsWith('http') ? form.url : `https://${form.url}`);
        title = parsed.hostname || form.url;
      } catch {
        title = form.url;
      }
    } else if (form.type === 'wifi' && form.wifi.ssid) {
      title = `WiFi: ${form.wifi.ssid}`;
    } else if (form.type === 'vcard' && (form.vcard.firstName || form.vcard.lastName)) {
      title = `${form.vcard.firstName} ${form.vcard.lastName}`.trim();
    }

    const newCode: SavedQRCode = {
      id: `qr-${Date.now()}`,
      title: title || 'Custom QR Code',
      type: form.type,
      createdAt: Date.now(),
      previewSvg: svgContent,
      config: { ...form },
    };

    setSavedCodes((prev) => [newCode, ...prev]);
  };

  const handleSaveBarcodeToLibrary = (item: {
    title: string;
    type: any;
    previewSvg: string;
    config: any;
  }) => {
    const newCode: SavedQRCode = {
      id: `barcode-${Date.now()}`,
      title: item.title,
      type: item.type,
      createdAt: Date.now(),
      previewSvg: item.previewSvg,
      config: item.config,
    };
    setSavedCodes((prev) => [newCode, ...prev]);
  };

  const handleDeleteCode = (id: string) => {
    setSavedCodes((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearAllCodes = () => {
    setSavedCodes([]);
  };

  const handleLoadConfig = (config: QRFormValues) => {
    setForm(config);
    setActiveTab('generator');
  };

  const handleSelectPreset = (preset: DesignPreset) => {
    setForm((prev) => ({
      ...prev,
      ...preset.values,
    }));
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 relative">
      {/* Animated Floating Glass Background */}
      <AnimatedBackground />

      {/* Responsive Top Glass Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openPresets={() => setIsPresetModalOpen(true)}
        savedCount={savedCodes.length}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10 overflow-x-hidden">
        {/* QR STUDIO MODE */}
        {activeTab === 'generator' && (
          <div className="w-full max-w-full overflow-x-hidden">
            {/* Quick Preset Theme Bar */}
            <PresetBar
              onSelectPreset={handleSelectPreset}
              onOpenAllModal={() => setIsPresetModalOpen(true)}
            />

            {/* Mobile View Switcher (Visible only on mobile screen < lg) */}
            <div className="lg:hidden flex items-center p-1 bg-slate-200/80 rounded-xl mb-4 border border-slate-300/70 shadow-xs">
              <button
                type="button"
                onClick={() => setMobileSubTab('editor')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileSubTab === 'editor'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>1. Customize QR</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileSubTab('preview')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                  mobileSubTab === 'preview'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>2. Live Preview & Export</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full max-w-full">
              {/* Left Column: Form & Accordion Settings */}
              <div
                className={`lg:col-span-7 bg-white/85 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/70 p-4 sm:p-7 shadow-lg shadow-slate-200/30 w-full max-w-full ${
                  mobileSubTab === 'preview' ? 'hidden lg:block' : 'block'
                }`}
              >
                {/* 14 Data Type Pills */}
                <TypeSelector
                  currentType={form.type}
                  onChangeType={(type: QRType) => updateForm({ type })}
                />

                {/* Dynamic Type Inputs */}
                <TypeInputs form={form} onChange={updateForm} />

                {/* Accordion 1: Colors */}
                <AccordionSection
                  id="colors"
                  title="Colors"
                  icon={Paintbrush}
                  isOpen={openSection === 'colors'}
                  onToggle={() => toggleSection('colors')}
                >
                  <ColorsSection form={form} onChange={updateForm} />
                </AccordionSection>

                {/* Accordion 2: Design */}
                <AccordionSection
                  id="design"
                  title="Design"
                  icon={QrCode}
                  isOpen={openSection === 'design'}
                  onToggle={() => toggleSection('design')}
                >
                  <DesignSection form={form} onChange={updateForm} />
                </AccordionSection>

                {/* Accordion 3: Logo */}
                <AccordionSection
                  id="logo"
                  title="Logo"
                  icon={ShieldCheck}
                  isOpen={openSection === 'logo'}
                  onToggle={() => toggleSection('logo')}
                >
                  <LogoSection form={form} onChange={updateForm} />
                </AccordionSection>

                {/* Accordion 4: Frame */}
                <AccordionSection
                  id="frame"
                  title="Frame"
                  icon={Frame}
                  isOpen={openSection === 'frame'}
                  onToggle={() => toggleSection('frame')}
                >
                  <FrameSection form={form} onChange={updateForm} />
                </AccordionSection>

                {/* Accordion 5: Options */}
                <AccordionSection
                  id="options"
                  title="Options"
                  icon={Sliders}
                  isOpen={openSection === 'options'}
                  onToggle={() => toggleSection('options')}
                >
                  <OptionsSection form={form} onChange={updateForm} />
                </AccordionSection>

                {/* Mobile Floating Action Button to Jump to Preview */}
                <div className="lg:hidden mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileSubTab('preview');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform"
                  >
                    <span>View Live Preview & Download</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Live Sticky Preview & Stylish Exports + Real-Time Analysis */}
              <div
                className={`lg:col-span-5 space-y-5 w-full max-w-full ${
                  mobileSubTab === 'editor' ? 'hidden lg:block' : 'block'
                }`}
              >
                {/* Mobile Back to Editor Button */}
                <div className="lg:hidden mb-2">
                  <button
                    type="button"
                    onClick={() => setMobileSubTab('editor')}
                    className="w-full py-2.5 px-3 bg-white text-slate-700 hover:text-blue-600 border border-slate-200/90 font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Customize QR Design</span>
                  </button>
                </div>

                <QRPreview
                  form={form}
                  svgContent={svgContent}
                  isGenerating={isGenerating}
                  onSaveToLibrary={handleSaveToLibrary}
                />

                {/* Real-Time Optical Scannability & Contrast Analysis */}
                <RealTimeAnalysis form={form} />
              </div>
            </div>
          </div>
        )}

        {/* BARCODE STUDIO MODE */}
        {activeTab === 'barcode' && (
          <BarcodeStudio onSaveToLibrary={handleSaveBarcodeToLibrary} />
        )}

        {/* BATCH PROCESSOR MODE */}
        {activeTab === 'batch' && <BatchProcessor currentForm={form} />}

        {/* SAVED LIBRARY DASHBOARD MODE */}
        {activeTab === 'library' && (
          <SavedDashboard
            savedCodes={savedCodes}
            onLoadConfig={handleLoadConfig}
            onDeleteCode={handleDeleteCode}
            onClearAll={handleClearAllCodes}
          />
        )}
      </main>

      {/* Preset Modal */}
      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelectPreset={handleSelectPreset}
        currentForm={form}
      />

      {/* Clean Minimal Footer (Exact user specifications: main line + copyright only) */}
      <Footer />
    </div>
  );
}
