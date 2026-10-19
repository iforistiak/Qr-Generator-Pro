import QRCodeStyling, {
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel as QRErrorLevel,
} from 'qr-code-styling';
import { jsPDF } from 'jspdf';
import { QRFormValues, FrameType } from '../types/qr';
import { generateQRPayload } from './qrPayload';

// Generate raw SVG string from QRCodeStyling
export async function generateBaseQrSvg(form: QRFormValues, baseSize = 360): Promise<string> {
  const data = generateQRPayload(form);

  // Map pattern types
  const dotTypeMap: Record<string, DotType> = {
    square: 'square',
    dots: 'dots',
    rounded: 'rounded',
    'extra-rounded': 'extra-rounded',
    classy: 'classy',
    'classy-rounded': 'classy-rounded',
  };

  const cornerSquareMap: Record<string, CornerSquareType> = {
    square: 'square',
    dot: 'dot',
    'extra-rounded': 'extra-rounded',
  };

  const cornerDotMap: Record<string, CornerDotType> = {
    square: 'square',
    dot: 'dot',
  };

  const dotsOptions: any = {
    type: dotTypeMap[form.pattern] || 'square',
  };

  if (form.enableGradient) {
    dotsOptions.gradient = {
      type: form.gradientType,
      rotation: (form.gradientAngle * Math.PI) / 180,
      colorStops: [
        { offset: 0, color: form.foregroundColor },
        { offset: 1, color: form.gradientColor2 },
      ],
    };
  } else {
    dotsOptions.color = form.foregroundColor;
  }

  const cornersSquareOptions: any = {
    type: cornerSquareMap[form.markerBorder] || 'square',
    color: form.customMarkerColor ? form.markerBorderColor : form.foregroundColor,
  };

  const cornersDotOptions: any = {
    type: cornerDotMap[form.markerCenter] || 'square',
    color: form.customMarkerColor ? form.markerCenterColor : form.foregroundColor,
  };

  const backgroundOptions: any = {
    color: form.transparentBackground ? 'transparent' : form.backgroundColor,
  };

  // Safe logo sizing (max 0.35 to preserve scanability)
  const imageSize = Math.max(0.1, Math.min(0.35, form.logoSize / 100));

  const qrCode = new QRCodeStyling({
    width: baseSize,
    height: baseSize,
    type: 'svg',
    data,
    margin: form.margin,
    qrOptions: {
      errorCorrectionLevel: (form.logoUrl ? 'Q' : form.precision) as QRErrorLevel,
    },
    image: form.logoUrl || undefined,
    imageOptions: {
      hideBackgroundDots: form.removeLogoBackground,
      imageSize,
      margin: form.logoPadding,
      crossOrigin: 'anonymous',
    },
    dotsOptions,
    cornersSquareOptions,
    cornersDotOptions,
    backgroundOptions,
  });

  const raw = await qrCode.getRawData('svg');
  if (!raw) {
    throw new Error('Failed to generate QR Code SVG');
  }
  if (typeof (raw as any).text === 'function') {
    return await (raw as Blob).text();
  }
  return (raw as any).toString('utf-8');
}

// Strip outer <svg> and extract inner content with width & height preservation
function extractSvgInner(svgString: string): { inner: string; viewBox: string; width: number; height: number } {
  const vbMatch = svgString.match(/viewBox=["']([^"']+)["']/i);
  const wMatch = svgString.match(/width=["'](\d+)["']/i);
  const hMatch = svgString.match(/height=["'](\d+)["']/i);

  const width = wMatch ? parseInt(wMatch[1], 10) : 360;
  const height = hMatch ? parseInt(hMatch[1], 10) : 360;
  const viewBox = vbMatch ? vbMatch[1] : `0 0 ${width} ${height}`;

  // Extract everything inside <svg ...> ... </svg>
  const startIdx = svgString.indexOf('>');
  const endIdx = svgString.lastIndexOf('</svg>');
  const inner = startIdx !== -1 && endIdx !== -1 ? svgString.slice(startIdx + 1, endIdx) : svgString;

  return { inner, viewBox, width, height };
}

// Assemble full framed SVG with vector text and graphics
export function assembleFramedSvg(rawSvg: string, form: QRFormValues): string {
  if (form.frame === 'none') {
    return rawSvg;
  }

  const { inner } = extractSvgInner(rawSvg);
  const qrSize = 360;
  const label = form.frameLabel || 'SCAN ME';
  const font = form.frameFont || 'Inter, sans-serif';
  const frameColor = form.customFrameColor ? form.frameColor : '#2563EB';
  const textColor = form.customFrameColor ? form.frameTextColor : '#FFFFFF';
  const textScale = (form.frameTextSize || 100) / 100;

  switch (form.frame) {
    case 'bottom-banner': {
      const totalW = 440;
      const totalH = 550;
      const qrOffset = (totalW - qrSize) / 2;
      const bannerH = 68;
      const bannerY = 445;
      const fontSize = Math.round(22 * textScale);

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.08"/>
    </filter>
  </defs>
  <!-- Card Background -->
  <rect x="15" y="15" width="${totalW - 30}" height="${totalH - 30}" rx="24" fill="${form.transparentBackground ? 'none' : '#ffffff'}" stroke="#E2E8F0" stroke-width="2" filter="url(#shadow)"/>
  
  <!-- Embedded QR Code -->
  <g transform="translate(${qrOffset}, 45)">
    ${inner}
  </g>

  <!-- Bottom Banner Pill -->
  <rect x="40" y="${bannerY}" width="${totalW - 80}" height="${bannerH}" rx="16" fill="${frameColor}"/>
  
  <!-- Frame Label -->
  <text x="${totalW / 2}" y="${bannerY + bannerH / 2 + fontSize * 0.35}" font-family="${font}" font-size="${fontSize}" font-weight="700" fill="${textColor}" text-anchor="middle" letter-spacing="1.5">
    ${escapeXml(label)}
  </text>
</svg>`;
    }

    case 'top-banner': {
      const totalW = 440;
      const totalH = 550;
      const qrOffset = (totalW - qrSize) / 2;
      const bannerH = 68;
      const bannerY = 35;
      const fontSize = Math.round(22 * textScale);

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.08"/>
    </filter>
  </defs>
  <!-- Card Background -->
  <rect x="15" y="15" width="${totalW - 30}" height="${totalH - 30}" rx="24" fill="${form.transparentBackground ? 'none' : '#ffffff'}" stroke="#E2E8F0" stroke-width="2" filter="url(#shadow)"/>
  
  <!-- Top Banner Pill -->
  <rect x="40" y="${bannerY}" width="${totalW - 80}" height="${bannerH}" rx="16" fill="${frameColor}"/>
  
  <!-- Frame Label -->
  <text x="${totalW / 2}" y="${bannerY + bannerH / 2 + fontSize * 0.35}" font-family="${font}" font-size="${fontSize}" font-weight="700" fill="${textColor}" text-anchor="middle" letter-spacing="1.5">
    ${escapeXml(label)}
  </text>

  <!-- Embedded QR Code -->
  <g transform="translate(${qrOffset}, 130)">
    ${inner}
  </g>
</svg>`;
    }

    case 'ribbon': {
      const totalW = 440;
      const totalH = 560;
      const qrOffset = (totalW - qrSize) / 2;
      const fontSize = Math.round(20 * textScale);

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.1"/>
    </filter>
  </defs>
  <!-- Outer Frame -->
  <rect x="20" y="20" width="${totalW - 40}" height="${totalH - 40}" rx="28" fill="${form.transparentBackground ? 'none' : '#ffffff'}" stroke="${frameColor}" stroke-width="3" filter="url(#shadow)"/>
  
  <!-- Embedded QR Code -->
  <g transform="translate(${qrOffset}, 45)">
    ${inner}
  </g>

  <!-- Ribbon Badge -->
  <g transform="translate(0, 435)">
    <path d="M 50 15 L 70 0 L 70 30 Z" fill="${frameColor}" opacity="0.8"/>
    <path d="M 390 15 L 370 0 L 370 30 Z" fill="${frameColor}" opacity="0.8"/>
    <rect x="65" y="0" width="310" height="60" rx="8" fill="${frameColor}"/>
    <text x="${totalW / 2}" y="${30 + fontSize * 0.35}" font-family="${font}" font-size="${fontSize}" font-weight="800" fill="${textColor}" text-anchor="middle" letter-spacing="2">
      ${escapeXml(label)}
    </text>
  </g>
</svg>`;
    }

    case 'phone': {
      const totalW = 440;
      const totalH = 620;
      const qrOffset = (totalW - qrSize) / 2;
      const fontSize = Math.round(18 * textScale);

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <!-- Phone Outer Bezel -->
  <rect x="25" y="15" width="390" height="590" rx="42" fill="#0F172A" stroke="#334155" stroke-width="4"/>
  <!-- Phone Screen -->
  <rect x="37" y="32" width="366" height="556" rx="30" fill="${form.transparentBackground ? '#FFFFFF' : form.backgroundColor}"/>
  <!-- Camera Notch / Dynamic Island -->
  <rect x="170" y="42" width="100" height="24" rx="12" fill="#0F172A"/>
  <circle cx="250" cy="54" r="5" fill="#1E293B"/>

  <!-- Top Phone Label -->
  <text x="${totalW / 2}" y="100" font-family="${font}" font-size="${fontSize}" font-weight="700" fill="${frameColor}" text-anchor="middle" letter-spacing="1">
    ${escapeXml(label)}
  </text>

  <!-- Embedded QR Code -->
  <g transform="translate(${qrOffset}, 125)">
    ${inner}
  </g>

  <!-- Home Indicator Bar -->
  <rect x="150" y="565" width="140" height="5" rx="2.5" fill="#94A3B8"/>
</svg>`;
    }

    case 'ticket': {
      const totalW = 440;
      const totalH = 550;
      const qrOffset = (totalW - qrSize) / 2;
      const fontSize = Math.round(20 * textScale);

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <!-- Ticket Body with cutouts -->
  <path d="M 20 20 L 420 20 L 420 200 A 25 25 0 0 0 420 250 L 420 530 L 20 530 L 20 250 A 25 25 0 0 0 20 200 Z" fill="${form.transparentBackground ? 'none' : '#ffffff'}" stroke="${frameColor}" stroke-width="3"/>
  <!-- Perforation line -->
  <line x1="45" y1="225" x2="395" y2="225" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="8 6"/>

  <!-- Top Ticket Title -->
  <text x="${totalW / 2}" y="100" font-family="${font}" font-size="${fontSize * 1.2}" font-weight="800" fill="${frameColor}" text-anchor="middle" letter-spacing="2">
    ${escapeXml(label)}
  </text>
  <text x="${totalW / 2}" y="140" font-family="sans-serif" font-size="12" font-weight="500" fill="#64748B" text-anchor="middle" letter-spacing="1">
    ★ OFFICIAL ACCESS PASS ★
  </text>

  <!-- Embedded QR Code -->
  <g transform="translate(${qrOffset}, 160)">
    ${inner}
  </g>
</svg>`;
    }

    case 'badge': {
      const totalW = 440;
      const totalH = 560;
      const qrOffset = (totalW - qrSize) / 2;
      const fontSize = Math.round(20 * textScale);

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <!-- Lanyard Slot -->
  <rect x="180" y="15" width="80" height="14" rx="7" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
  
  <!-- Badge Card -->
  <rect x="25" y="38" width="390" height="505" rx="28" fill="${form.transparentBackground ? 'none' : '#ffffff'}" stroke="#E2E8F0" stroke-width="3"/>
  
  <!-- Badge Header Stripe -->
  <path d="M 25 66 C 25 50.5 37.5 38 53 38 L 387 38 C 402.5 38 415 50.5 415 66 L 415 110 L 25 110 Z" fill="${frameColor}"/>
  <text x="${totalW / 2}" y="82" font-family="${font}" font-size="${fontSize}" font-weight="700" fill="${textColor}" text-anchor="middle">
    ${escapeXml(label)}
  </text>

  <!-- Embedded QR Code -->
  <g transform="translate(${qrOffset}, 130)">
    ${inner}
  </g>

  <!-- Bottom Tag -->
  <text x="${totalW / 2}" y="525" font-family="sans-serif" font-size="12" font-weight="600" fill="#94A3B8" text-anchor="middle" letter-spacing="3">
    VERIFIED IDENTITY
  </text>
</svg>`;
    }

    case 'pill': {
      const totalW = 440;
      const totalH = 530;
      const qrOffset = (totalW - qrSize) / 2;
      const fontSize = Math.round(20 * textScale);

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <!-- Rounded Pill Container -->
  <rect x="20" y="20" width="${totalW - 40}" height="${totalH - 40}" rx="60" fill="${form.transparentBackground ? 'none' : '#ffffff'}" stroke="${frameColor}" stroke-width="4"/>
  
  <!-- Embedded QR Code -->
  <g transform="translate(${qrOffset}, 40)">
    ${inner}
  </g>

  <!-- Bottom Button -->
  <g transform="translate(0, 420)">
    <rect x="80" y="0" width="${totalW - 160}" height="56" rx="28" fill="${frameColor}"/>
    <text x="${totalW / 2}" y="${28 + fontSize * 0.35}" font-family="${font}" font-size="${fontSize}" font-weight="700" fill="${textColor}" text-anchor="middle" letter-spacing="1.5">
      ${escapeXml(label)}
    </text>
  </g>
</svg>`;
    }

    default:
      return rawSvg;
  }
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Export as SVG file
export function exportSvgFile(svgString: string, filename = 'qrcode.svg') {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Convert SVG string to PNG Blob and trigger download
export async function exportPngFile(
  svgString: string,
  targetSize = 1000,
  filename = 'qrcode.png'
): Promise<Blob> {
  const blob = await svgToPngBlob(svgString, targetSize);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return blob;
}

// Convert SVG to PNG Blob via high-res Canvas
export function svgToPngBlob(svgString: string, targetWidth = 1000): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const origW = img.naturalWidth || 440;
      const origH = img.naturalHeight || 550;
      const scale = targetWidth / origW;
      const canvasWidth = targetWidth;
      const canvasHeight = Math.round(origH * scale);

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas 2D context not supported'));
        return;
      }

      // Smooth rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      canvas.toBlob(
        (pngBlob) => {
          URL.revokeObjectURL(url);
          if (pngBlob) {
            resolve(pngBlob);
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        },
        'image/png',
        1.0
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

// Export as print-ready PDF
export async function exportPdfFile(
  svgString: string,
  title = 'QR Code Document',
  filename = 'qrcode.pdf'
) {
  const pngBlob = await svgToPngBlob(svgString, 1600);
  const reader = new FileReader();

  return new Promise<void>((resolve) => {
    reader.onload = () => {
      const base64Data = reader.result as string;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(30, 41, 59);
      pdf.text(title, pageWidth / 2, 25, { align: 'center' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Scan with your smartphone camera or QR reader', pageWidth / 2, 33, { align: 'center' });

      // Calculate image placement
      const imgWidth = 140; // mm
      const imgHeight = 160; // mm
      const x = (pageWidth - imgWidth) / 2;
      const y = 45;

      pdf.addImage(base64Data, 'PNG', x, y, imgWidth, imgHeight);

      // Footer
      pdf.setFontSize(9);
      pdf.setTextColor(148, 163, 184);
      pdf.text('Generated with QR Studio Pro - High Precision Vector Standards', pageWidth / 2, pageHeight - 15, {
        align: 'center',
      });

      pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
      resolve();
    };
    reader.readAsDataURL(pngBlob);
  });
}

// Print QR code directly
export async function printQrCode(svgString: string, title = 'Print QR Code') {
  const pngBlob = await svgToPngBlob(svgString, 1400);
  const blobUrl = URL.createObjectURL(pngBlob);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print your QR code.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${escapeXml(title)}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 20mm;
          }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            margin: 0;
            text-align: center;
            color: #0f172a;
          }
          h1 {
            font-size: 26px;
            margin-bottom: 6px;
            font-weight: 700;
          }
          p {
            font-size: 14px;
            color: #64748b;
            margin-top: 0;
            margin-bottom: 28px;
          }
          img {
            max-width: 480px;
            width: 80%;
            height: auto;
            border-radius: 12px;
          }
          .footer {
            margin-top: 36px;
            font-size: 11px;
            color: #94a3b8;
          }
        </style>
      </head>
      <body>
        <h1>${escapeXml(title)}</h1>
        <p>Point your smartphone camera to scan</p>
        <img src="${blobUrl}" onload="window.print();" />
        <div class="footer">QR Studio Pro • Vector Print Engine</div>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// Copy SVG code to clipboard
export async function copySvgCode(svgString: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(svgString);
    return true;
  } catch {
    return false;
  }
}
