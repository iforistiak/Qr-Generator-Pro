export type BarcodeFormat =
  | 'CODE128'
  | 'EAN13'
  | 'UPC'
  | 'CODE39'
  | 'ITF14'
  | 'MSI'
  | 'pharmacode'
  | 'codabar';

export interface BarcodeFormValues {
  format: BarcodeFormat;
  value: string;
  width: number; // bar width 1 - 4
  height: number; // bar height 40 - 160
  displayValue: boolean;
  font: string;
  fontSize: number;
  textMargin: number;
  textAlign: 'center' | 'left' | 'right';
  textPosition: 'bottom' | 'top';
  lineColor: string;
  background: string;
  transparentBackground: boolean;
  margin: number;
}

export const DEFAULT_BARCODE_VALUES: BarcodeFormValues = {
  format: 'CODE128',
  value: 'QR-PRO-98241',
  width: 2,
  height: 80,
  displayValue: true,
  font: 'monospace',
  fontSize: 16,
  textMargin: 4,
  textAlign: 'center',
  textPosition: 'bottom',
  lineColor: '#0f172a',
  background: '#ffffff',
  transparentBackground: false,
  margin: 14,
};
