import JsBarcode from 'jsbarcode';
import { jsPDF } from 'jspdf';
import { BarcodeFormValues } from '../types/barcode';
import { exportSvgFile, svgToPngBlob } from './qrRenderer';

export function renderBarcodeSvg(form: BarcodeFormValues): { svgString: string; error?: string } {
  try {
    if (!form.value || form.value.trim() === '') {
      return { svgString: '', error: 'Please enter a barcode value' };
    }

    // Format validation checks for common retail formats
    if (form.format === 'EAN13') {
      const clean = form.value.replace(/[^0-9]/g, '');
      if (clean.length !== 12 && clean.length !== 13) {
        return {
          svgString: '',
          error: 'EAN-13 requires exactly 12 or 13 digits (e.g., 9780201379624)',
        };
      }
    } else if (form.format === 'UPC') {
      const clean = form.value.replace(/[^0-9]/g, '');
      if (clean.length !== 11 && clean.length !== 12) {
        return {
          svgString: '',
          error: 'UPC-A requires exactly 11 or 12 digits (e.g., 123456789012)',
        };
      }
    }

    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    JsBarcode(svgElement, form.value, {
      format: form.format,
      width: form.width,
      height: form.height,
      displayValue: form.displayValue,
      font: form.font,
      fontSize: form.fontSize,
      textMargin: form.textMargin,
      textAlign: form.textAlign,
      textPosition: form.textPosition,
      lineColor: form.lineColor,
      background: form.transparentBackground ? 'none' : form.background,
      margin: form.margin,
    });

    return { svgString: svgElement.outerHTML };
  } catch (err: any) {
    return {
      svgString: '',
      error: err.message || 'Invalid barcode input for selected format',
    };
  }
}

// Export Barcode as PNG
export async function exportBarcodePng(svgString: string, filename = 'barcode.png') {
  const blob = await svgToPngBlob(svgString, 1200);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export Barcode as PDF
export async function exportBarcodePdf(
  svgString: string,
  title = 'Barcode Label',
  filename = 'barcode.pdf'
) {
  const pngBlob = await svgToPngBlob(svgString, 1600);
  const reader = new FileReader();

  return new Promise<void>((resolve) => {
    reader.onload = () => {
      const base64Data = reader.result as string;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a6',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(15, 23, 42);
      pdf.text(title, pageWidth / 2, 18, { align: 'center' });

      const imgWidth = 110;
      const imgHeight = 55;
      const x = (pageWidth - imgWidth) / 2;
      const y = 28;

      pdf.addImage(base64Data, 'PNG', x, y, imgWidth, imgHeight);

      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184);
      pdf.text('QR Studio Pro • Vector Barcode Engine', pageWidth / 2, pageHeight - 8, {
        align: 'center',
      });

      pdf.save(filename);
      resolve();
    };
    reader.readAsDataURL(pngBlob);
  });
}
