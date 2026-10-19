import React, { useMemo } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  Maximize2,
  Eye,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { QRFormValues } from '../types/qr';
import { generateQRPayload } from '../utils/qrPayload';

interface RealTimeAnalysisProps {
  form: QRFormValues;
}

// Helper to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Calculate relative luminance for contrast ratio
function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export const RealTimeAnalysis: React.FC<RealTimeAnalysisProps> = ({ form }) => {
  const payload = useMemo(() => generateQRPayload(form), [form]);

  const analysis = useMemo(() => {
    // 1. Calculate color contrast
    const bg = form.transparentBackground
      ? { r: 255, g: 255, b: 255 }
      : hexToRgb(form.backgroundColor);
    const fg = hexToRgb(form.foregroundColor);

    const lumBg = getLuminance(bg.r, bg.g, bg.b);
    const lumFg = getLuminance(fg.r, fg.g, fg.b);

    const lighter = Math.max(lumBg, lumFg);
    const darker = Math.min(lumBg, lumFg);
    const contrastRatio = (lighter + 0.05) / (darker + 0.05);

    // 2. Data payload density & estimated version
    const charCount = payload.length;
    const byteLength = new TextEncoder().encode(payload).length;

    let estimatedModules = 21;
    let qrVersion = 1;
    if (charCount > 34) {
      estimatedModules = 25;
      qrVersion = 2;
    }
    if (charCount > 60) {
      estimatedModules = 29;
      qrVersion = 3;
    }
    if (charCount > 100) {
      estimatedModules = 33;
      qrVersion = 4;
    }
    if (charCount > 150) {
      estimatedModules = 37;
      qrVersion = 5;
    }
    if (charCount > 250) {
      estimatedModules = 45;
      qrVersion = 7;
    }

    // 3. Error correction recovery potential
    const eccMap: Record<string, { recovery: number; name: string }> = {
      L: { recovery: 7, name: 'Low (7%)' },
      M: { recovery: 15, name: 'Medium (15%)' },
      Q: { recovery: 25, name: 'High (25%)' },
      H: { recovery: 30, name: 'Maximum (30%)' },
    };
    const effectiveEcc = form.logoUrl ? 'Q' : form.precision;
    const eccInfo = eccMap[effectiveEcc] || eccMap.M;

    // 4. Logo safety analysis
    const hasLogo = Boolean(form.logoUrl);
    const logoAreaFraction = hasLogo ? (form.logoSize / 100) ** 2 : 0;
    const logoAreaPercent = Math.round(logoAreaFraction * 100);
    const logoSafe = !hasLogo || logoAreaPercent <= eccInfo.recovery * 0.8;

    // 5. Overall Scannability Score Calculation (out of 100)
    let score = 100;
    const issues: string[] = [];
    const passes: string[] = [];

    // Contrast evaluation
    if (contrastRatio >= 7.0) {
      passes.push(`Optical contrast is stellar (${contrastRatio.toFixed(1)}:1)`);
    } else if (contrastRatio >= 4.5) {
      passes.push(`Good contrast ratio (${contrastRatio.toFixed(1)}:1)`);
      score -= 5;
    } else if (contrastRatio >= 3.0) {
      issues.push(`Sub-optimal contrast (${contrastRatio.toFixed(1)}:1). Consider darker foreground.`);
      score -= 20;
    } else {
      issues.push(`Low contrast (${contrastRatio.toFixed(1)}:1)! Some phone cameras may struggle.`);
      score -= 40;
    }

    // Margin evaluation
    if (form.margin >= 10) {
      passes.push(`Quiet zone (${form.margin}px) satisfies ISO/IEC 18004 standards`);
    } else if (form.margin >= 4) {
      passes.push(`Acceptable quiet zone (${form.margin}px)`);
      score -= 4;
    } else {
      issues.push(`Quiet zone is very small (${form.margin}px). Add margin for better edge detection.`);
      score -= 10;
    }

    // Logo evaluation
    if (hasLogo) {
      if (logoSafe) {
        passes.push(`Logo coverage (${logoAreaPercent}%) is safe with Level ${effectiveEcc} redundancy`);
      } else {
        issues.push(`Logo size might obscure data modules. Consider reducing size to under 25%.`);
        score -= 15;
      }
    } else {
      passes.push('Unobstructed matrix — 100% data cells visible');
    }

    // Gradient check
    if (form.enableGradient) {
      const grad2 = hexToRgb(form.gradientColor2);
      const lumGrad2 = getLuminance(grad2.r, grad2.g, grad2.b);
      const gradContrast = (Math.max(lumBg, lumGrad2) + 0.05) / (Math.min(lumBg, lumGrad2) + 0.05);
      if (gradContrast < 3.5) {
        issues.push(`Gradient secondary color has low contrast against background.`);
        score -= 12;
      }
    }

    score = Math.max(20, Math.min(100, score));

    // Distance estimation
    const minPrintCm = Math.max(2, Math.round(estimatedModules * 0.12));
    const maxReadDistM = (minPrintCm * 10) / 100; // 10:1 optical rule

    return {
      score,
      contrastRatio: contrastRatio.toFixed(1),
      charCount,
      byteLength,
      qrVersion,
      estimatedModules,
      eccInfo,
      effectiveEcc,
      hasLogo,
      logoAreaPercent,
      logoSafe,
      passes,
      issues,
      minPrintCm,
      maxReadDistM,
    };
  }, [form, payload]);

  // Color badge for scannability score
  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: 'Optimal Scannability', bg: 'bg-emerald-500', color: 'text-emerald-700', border: 'border-emerald-200' };
    if (score >= 75) return { text: 'Good Readability', bg: 'bg-blue-500', color: 'text-blue-700', border: 'border-blue-200' };
    if (score >= 60) return { text: 'Moderate Scannability', bg: 'bg-amber-500', color: 'text-amber-700', border: 'border-amber-200' };
    return { text: 'Low Contrast Warning', bg: 'bg-rose-500', color: 'text-rose-700', border: 'border-rose-200' };
  };

  const badge = getScoreBadge(analysis.score);

  return (
    <div className="mt-4 sm:mt-5 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/80 p-3.5 sm:p-5 shadow-sm transition-all w-full max-w-full">
      {/* Analysis Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Real-Time Optical Analysis
            </h4>
            <span className="text-[10px] text-slate-400">Live Scannability & Matrix Diagnostics</span>
          </div>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-sm font-black text-slate-900 block leading-tight">
              {analysis.score}%
            </span>
            <span className="text-[9px] font-semibold text-slate-400 block leading-tight">
              Quality Index
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center relative overflow-hidden border border-slate-200/80">
            <div
              className={`absolute bottom-0 left-0 right-0 ${badge.bg} transition-all duration-500`}
              style={{ height: `${analysis.score}%` }}
            />
            <Zap className="w-4 h-4 text-white relative z-10 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3.5">
        {/* Contrast Ratio */}
        <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            Contrast Ratio
          </span>
          <span className="text-sm font-extrabold text-slate-800 block mt-0.5">
            {analysis.contrastRatio} : 1
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block truncate">
            {parseFloat(analysis.contrastRatio) >= 7 ? 'WCAG AAA Max' : 'Standard'}
          </span>
        </div>

        {/* Matrix Complexity */}
        <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            Matrix Grid
          </span>
          <span className="text-sm font-extrabold text-slate-800 block mt-0.5">
            {analysis.estimatedModules}×{analysis.estimatedModules}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block truncate">
            v{analysis.qrVersion} ({analysis.charCount} chars)
          </span>
        </div>

        {/* Error Correction Recovery */}
        <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            Error Recovery
          </span>
          <span className="text-sm font-extrabold text-slate-800 block mt-0.5">
            Level {analysis.effectiveEcc}
          </span>
          <span className="text-[10px] text-blue-600 font-semibold block truncate">
            {analysis.eccInfo.name}
          </span>
        </div>

        {/* Scan Distance Recommendation */}
        <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            Scan Distance
          </span>
          <span className="text-sm font-extrabold text-slate-800 block mt-0.5">
            Up to {analysis.maxReadDistM}m
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block truncate">
            Min size {analysis.minPrintCm}cm
          </span>
        </div>
      </div>

      {/* Diagnostics Feedback Checklist */}
      <div className="space-y-1.5 pt-1">
        {analysis.passes.map((pass, i) => (
          <div key={`pass-${i}`} className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{pass}</span>
          </div>
        ))}

        {analysis.issues.map((issue, i) => (
          <div
            key={`issue-${i}`}
            className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50/80 p-1.5 rounded-lg border border-amber-200/70"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-medium">{issue}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
