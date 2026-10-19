export type QRType =
  | 'link'
  | 'text'
  | 'email'
  | 'location'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'skype'
  | 'zoom'
  | 'wifi'
  | 'vcard'
  | 'event'
  | 'paypal'
  | 'bitcoin';

export type PatternType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
export type MarkerBorderType = 'square' | 'extra-rounded' | 'dot';
export type MarkerCenterType = 'square' | 'dot';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type FrameType =
  | 'none'
  | 'bottom-banner'
  | 'top-banner'
  | 'ribbon'
  | 'phone'
  | 'ticket'
  | 'badge'
  | 'pill';

export interface QRFormValues {
  // Type
  type: QRType;
  
  // Type-specific values
  url: string;
  text: string;
  email: {
    address: string;
    subject: string;
    body: string;
  };
  location: {
    latitude: string;
    longitude: string;
    address: string;
  };
  phone: string;
  sms: {
    number: string;
    message: string;
  };
  whatsapp: {
    number: string;
    message: string;
  };
  skype: {
    username: string;
    action: 'call' | 'chat';
  };
  zoom: {
    meetingId: string;
    password: string;
  };
  wifi: {
    ssid: string;
    password: string;
    encryption: 'WPA' | 'WEP' | 'nopass';
    hidden: boolean;
  };
  vcard: {
    firstName: string;
    lastName: string;
    organization: string;
    title: string;
    phone: string;
    email: string;
    url: string;
    street: string;
    city: string;
    country: string;
  };
  event: {
    title: string;
    location: string;
    startTime: string;
    endTime: string;
    description: string;
  };
  paypal: {
    account: string;
    amount: string;
    currency: string;
    itemName: string;
  };
  bitcoin: {
    address: string;
    amount: string;
    message: string;
  };

  // Colors
  backgroundColor: string;
  foregroundColor: string;
  transparentBackground: boolean;
  enableGradient: boolean;
  gradientType: 'linear' | 'radial';
  gradientColor2: string;
  gradientAngle: number;
  enableBackgroundImage: boolean;
  backgroundImageUrl: string;
  backgroundImageOpacity: number;

  // Design
  pattern: PatternType;
  markerBorder: MarkerBorderType;
  markerCenter: MarkerCenterType;
  customMarkerColor: boolean;
  markerBorderColor: string;
  markerCenterColor: string;

  // Logo
  logoUrl: string;
  removeLogoBackground: boolean;
  logoSize: number; // percentage 10 - 35
  logoPadding: number;

  // Frame
  frame: FrameType;
  frameLabel: string;
  frameFont: string;
  frameTextSize: number; // 80 - 140 %
  customFrameColor: boolean;
  frameColor: string;
  frameTextColor: string;

  // Options
  size: number; // 300, 500, 700, 1000, 1500, 2000
  precision: ErrorCorrectionLevel;
  margin: number;
}

export interface SavedQRCode {
  id: string;
  title: string;
  type: QRType;
  createdAt: number;
  previewSvg: string;
  config: QRFormValues;
}

export interface BatchItem {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'ready' | 'error';
  svgData?: string;
  pngBlobUrl?: string;
  error?: string;
}
