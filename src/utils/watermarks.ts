// Preset SVG watermarks with clean vector artwork

export interface WatermarkPreset {
  id: string;
  name: string;
  category: string;
  svgDataUri: string;
}

const createSvgDataUri = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
};

export const WATERMARK_PRESETS: WatermarkPreset[] = [
  {
    id: 'link',
    name: 'Link',
    category: 'General',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#7C3AED" />
        <path d="M42 58a12 12 0 0 0 17 0l10-10a12 12 0 0 0-17-17l-5 5" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M58 42a12 12 0 0 0-17 0l-10 10a12 12 0 0 0 17 17l5-5" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },
  {
    id: 'link-alt',
    name: 'Link Modern',
    category: 'General',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="24" fill="#6366F1" />
        <path d="M40 60a12 12 0 0 0 17 0l10-10a12 12 0 0 0-17-17l-5 5" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>
        <path d="M60 40a12 12 0 0 0-17 0l-10 10a12 12 0 0 0 17 17l5-5" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },
  {
    id: 'email',
    name: 'Email Yellow',
    category: 'Communication',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#F59E0B" />
        <rect x="22" y="30" width="56" height="40" rx="8" fill="#FFFFFF"/>
        <path d="M26 34 L50 54 L74 34" stroke="#F59E0B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    `),
  },
  {
    id: 'email-alt',
    name: 'Email Gold',
    category: 'Communication',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="20" fill="#EAB308" />
        <rect x="20" y="28" width="60" height="44" rx="8" fill="#FFFFFF"/>
        <path d="M24 32 L50 53 L76 32" stroke="#EAB308" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    `),
  },
  {
    id: 'location',
    name: 'Location Pin',
    category: 'General',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#EF4444" />
        <path d="M50 22 C37 22 26 33 26 46 C26 62 46 76 50 78 C54 76 74 62 74 46 C74 33 63 22 50 22 Z" fill="#FFFFFF"/>
        <circle cx="50" cy="44" r="10" fill="#EF4444" />
      </svg>
    `),
  },
  {
    id: 'location-alt',
    name: 'Map Pin Square',
    category: 'General',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="20" fill="#DC2626" />
        <path d="M50 22 C37 22 26 33 26 46 C26 62 46 76 50 78 C54 76 74 62 74 46 C74 33 63 22 50 22 Z" fill="#FFFFFF"/>
        <circle cx="50" cy="44" r="10" fill="#DC2626" />
      </svg>
    `),
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'Social',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#25D366" />
        <path d="M50 20 A30 30 0 0 0 24 65 L20 80 L36 76 A30 30 0 1 0 50 20 Z" fill="#FFFFFF"/>
        <path d="M40 34 C38 34 36 36 36 39 C36 47 48 59 56 61 C60 62 64 59 64 56 C64 54 59 51 57 51 C55 51 54 52 53 54 C51 53 47 49 46 47 C48 46 49 45 49 43 C49 41 46 36 44 34 C42 34 41 34 40 34 Z" fill="#25D366"/>
      </svg>
    `),
  },
  {
    id: 'skype',
    name: 'Skype',
    category: 'Communication',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#00AFF0" />
        <path d="M50 22 C34.5 22 22 34.5 22 50 C22 54.3 22.9 58.4 24.6 62.1 C23.6 65.5 23.6 69.1 24.9 72.3 C26.2 75.5 28.7 78 31.9 79.3 C35.1 80.6 38.7 80.6 42.1 79.6 C44.6 80.5 47.3 81 50 81 C65.5 81 78 68.5 78 53 C78 48.7 77.1 44.6 75.4 40.9 C76.4 37.5 76.4 33.9 75.1 30.7 C73.8 27.5 71.3 25 68.1 23.7 C64.9 22.4 61.3 22.4 57.9 23.4 C55.4 22.5 52.7 22 50 22 Z" fill="#FFFFFF"/>
        <path d="M59 39 C57 37 53.5 36.5 50 36.5 C43 36.5 38 40 38 44.5 C38 48.5 41 50.5 47 52 C53 53.5 55 55 55 58 C55 61.5 51 63 47.5 63 C42 63 39 59.5 38 56.5 M62 44.5" stroke="#00AFF0" stroke-width="7" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },
  {
    id: 'zoom',
    name: 'Zoom',
    category: 'Communication',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="20" fill="#2D8CFF" />
        <rect x="22" y="32" width="38" height="36" rx="6" fill="#FFFFFF"/>
        <polygon points="63,44 78,33 78,67 63,56" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: 'wifi',
    name: 'Wi-Fi Round',
    category: 'Technology',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#0284C7" />
        <path d="M22 36 A40 40 0 0 1 78 36" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>
        <path d="M32 48 A26 26 0 0 1 68 48" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>
        <path d="M42 60 A12 12 0 0 1 58 60" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>
        <circle cx="50" cy="72" r="5" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: 'wifi-square',
    name: 'Wi-Fi Square',
    category: 'Technology',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="20" fill="#0EA5E9" />
        <path d="M22 36 A40 40 0 0 1 78 36" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>
        <path d="M32 48 A26 26 0 0 1 68 48" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>
        <path d="M42 60 A12 12 0 0 1 58 60" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>
        <circle cx="50" cy="72" r="5" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: 'vcard',
    name: 'V-Card Contact',
    category: 'Contact',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="20" fill="#0369A1" />
        <rect x="20" y="24" width="60" height="52" rx="6" fill="#FFFFFF" />
        <circle cx="36" cy="42" r="8" fill="#0369A1" />
        <path d="M26 60 C26 53 32 50 36 50 C40 50 46 53 46 60" fill="#0369A1"/>
        <line x1="52" y1="38" x2="72" y2="38" stroke="#0369A1" stroke-width="4" stroke-linecap="round"/>
        <line x1="52" y1="48" x2="68" y2="48" stroke="#0369A1" stroke-width="4" stroke-linecap="round"/>
        <line x1="52" y1="58" x2="72" y2="58" stroke="#0369A1" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'event',
    name: 'Event Calendar',
    category: 'General',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#B91C1C" />
        <rect x="22" y="28" width="56" height="48" rx="8" fill="#FFFFFF"/>
        <path d="M22 40 H78" stroke="#B91C1C" stroke-width="4"/>
        <path d="M34 22 V30 M66 22 V30" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
        <circle cx="36" cy="52" r="3" fill="#B91C1C"/>
        <circle cx="50" cy="52" r="3" fill="#B91C1C"/>
        <circle cx="64" cy="52" r="3" fill="#B91C1C"/>
        <circle cx="36" cy="62" r="3" fill="#B91C1C"/>
        <circle cx="50" cy="62" r="3" fill="#B91C1C"/>
      </svg>
    `),
  },
  {
    id: 'event-square',
    name: 'Event Square',
    category: 'General',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="20" fill="#991B1B" />
        <rect x="22" y="28" width="56" height="48" rx="8" fill="#FFFFFF"/>
        <path d="M22 40 H78" stroke="#991B1B" stroke-width="4"/>
        <path d="M34 22 V30 M66 22 V30" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
        <path d="M40 56 L47 62 L62 48" stroke="#991B1B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    `),
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'Finance',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="20" fill="#003087" />
        <path d="M40 24 H56 C63 24 67 27 66 33 C65 40 60 45 53 45 H44 L40 70 H32 L40 24 Z" fill="#0079C1" />
        <path d="M48 35 H62 C68 35 72 38 71 44 C70 51 65 57 58 57 H49 L46 76 H38 L48 35 Z" fill="#00457C" opacity="0.9" />
        <path d="M48 35 H62 C68 35 71 38 70 44 C69 50 65 55 58 55 H50 L48 70 H43 L48 35 Z" fill="#0079C1" />
      </svg>
    `),
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    category: 'Finance',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#F7931A" />
        <text x="50" y="68" font-family="Arial, sans-serif" font-size="52" font-weight="bold" fill="#FFFFFF" text-anchor="middle">₿</text>
      </svg>
    `),
  },
  {
    id: 'bitcoin-square',
    name: 'Bitcoin Square',
    category: 'Finance',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="20" fill="#F7931A" />
        <text x="50" y="68" font-family="Arial, sans-serif" font-size="52" font-weight="bold" fill="#FFFFFF" text-anchor="middle">₿</text>
      </svg>
    `),
  },
];
