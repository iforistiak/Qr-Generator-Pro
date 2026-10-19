# QR Studio Pro 🚀
### Custom & Batch Vector QR Code & Barcode Generation Suite

> **Develop and Deployed by MD ISTIAK ISLAM**  
> *Developer Email: [iforistiak@gmail.com](mailto:iforistiak@gmail.com)*

[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
[![Vector Support](https://img.shields.io/badge/Vector-SVG%20%7C%20PDF%20%7C%20PNG-emerald.svg)](#features)

---

## 🌟 Overview

**QR Studio Pro** is an open-source, client-side web application designed for professionals, graphic designers, marketers, and developers who need precision-crafted QR codes and 1D/2D barcodes.

It combines an **animated glassmorphic UI**, **real-time optical scannability analysis**, **vector frame wrappers**, **batch CSV processing**, and **direct vector SVG / print-ready PDF export** for seamless integration into Adobe Illustrator, Figma, laser engravers, and industrial printing workflows.

---

## ✨ Key Features

### 1. 14 QR Code Data Payload Types
- **Website Link**: Clean HTTP / HTTPS URL format.
- **Plain Text**: Formatted multi-line text notes.
- **E-mail**: Direct `mailto:` with pre-filled subject and message body.
- **Location**: Latitude/longitude coordinates and Google Maps addresses.
- **Phone Call**: Direct click-to-dial `tel:` link.
- **SMS**: Phone number and pre-composed SMS text.
- **WhatsApp**: International direct WhatsApp chat link (`wa.me`).
- **Skype**: One-click audio/video call or chat link.
- **Zoom**: Direct meeting ID and passcode integration.
- **Wi-Fi**: Automatic connection string (`WPA`, `WEP`, or Open; hidden network support).
- **V-Card (vCard 3.0)**: Complete digital contact card with name, org, title, phone, email, address, and website.
- **Event (iCalendar / VEVENT)**: Calendar appointment with title, location, start/end dates, and description.
- **PayPal**: Direct PayPal.Me link or automated payment gateway.
- **BitCoin**: Direct crypto payment URI with wallet address, BTC amount, and invoice note.

### 2. 🔬 Real-Time Optical Analysis & Scannability Scoring
- **Scannability Index (0–100%)**: Instant composite score based on optical contrast, error correction redundancy, and logo obstruction.
- **WCAG Contrast Ratio**: Real-time luminance formula calculation (`(L1 + 0.05) / (L2 + 0.05)`) with AAA/AA optical verification.
- **Matrix Complexity & Grid Estimation**: Calculates module dimensions (e.g. 25×25 v2 to 45×45 v7) and character byte density.
- **Camera Scan Distance Advisor**: Recommends minimum print size in centimeters and maximum scan range in meters using the optical 10:1 ratio.
- **Diagnostic Feedback**: Instant checklist ensuring compliance with ISO/IEC 18004 standards.

### 3. 🎨 Vector Styling & Designer Presets
- **Body Patterns**: Squares, Rounded dots, Circular dots, Extra-Rounded, Classy, and Classy-Rounded.
- **Marker Eye Borders**: Square, Extra-Rounded, and Circle.
- **Marker Eye Centers**: Square and Dot.
- **Dual Gradients**: Linear (0–360° angle slider) and Radial color transitions.
- **Custom Marker Colors**: Independent styling for eye borders and eye centers.
- **12+ 1-Click Curated Themes**: Royal Blue Banner, Cyberpunk Neon, Luxury Noir Gold, Sunset Horizon, Tokyo Lavender, Emerald Botanic, Smartphone Bezel, VIP Event Pass, Retro Arcade, Ocean Turquoise, and Cinema Ticket.

### 4. 🏷️ Vector Frames with Custom Typography
- **Frame Templates**: None, Classic Bottom Banner ("SCAN ME"), Top Banner, Ribbon, Smartphone Bezel, Ticket Pass, ID Badge, and Rounded Pill.
- **Google Fonts Support**: *Abril Fatface*, *Inter*, *Montserrat*, *Oswald*, *Playfair Display*.
- **Scalable Frame Labels**: Frame text is embedded as pure scalable `<text>` elements in the exported SVG.

### 5. 🖼️ Custom Logos & Watermark Badges
- Upload your own logo (PNG, SVG, JPG, WebP).
- Preset watermark badges: Link, Email, Location Pin, WhatsApp, Skype, Zoom, Wi-Fi, V-Card, Event, PayPal, Bitcoin.
- **Clean Cutout Padding**: Automatically clears background dots behind the logo so the QR code matrix remains 100% scannable.
- **Automatic Error Correction Elevation**: Automatically bumps precision to Level Q (25%) or H (30%) when a logo is applied.

### 6. 📊 1D & 2D Barcode Studio
- Full-featured barcode engine powered by standard symbologies:
  - **Code 128**: Universal alphanumeric, shipping, and logistics.
  - **EAN-13**: Worldwide 13-digit retail barcode with check digit validation.
  - **UPC-A**: North American 12-digit retail product barcode.
  - **Code 39**: Industrial, aerospace, and defense inventory.
  - **ITF-14**: Master container and outer carton shipping.
  - **Pharmacode**: Pharmaceutical packaging control.
  - **Codabar**: Libraries, blood banks, and FedEx shipping.
  - **MSI Plessey**: Storage racking and inventory control.
- Bar width, height, margin, and human-readable text position/font controls.
- Vector SVG, PNG, and PDF label export for all barcodes.

### 7. ⚡ Batch Processing & ZIP Export
- Import `.csv` or paste multi-line content.
- Generates dozens or hundreds of styled QR codes in seconds.
- **1-Click Download All as ZIP**: Packages all files as cleanly named `.svg` or `.png` assets.
- Live progress bar and individual download cards.

### 8. 💾 Saved QR Library Dashboard
- Persistent client-side storage (`localStorage`).
- Instant search by title or data payload.
- Filter by type (Link, Wi-Fi, vCard, etc.).
- One-click re-open in studio for further edits and quick repeat exports.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **QR Engine**: [qr-code-styling](https://github.com/kozakdenys/qr-code-styling)
- **Barcode Engine**: [JsBarcode](https://github.com/lindell/JsBarcode)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **ZIP Packaging**: [JSZip](https://github.com/Stuk/jszip)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/qr-studio-pro.git
   cd qr-studio-pro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready static assets will be in the `dist` folder.

---

## 📂 Project Structure

```
├── index.html                   # HTML entry point with fonts & metadata
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Root app component & state management
│   ├── index.css                # Tailwind CSS v4 & custom glass animations
│   ├── types/
│   │   ├── qr.ts                # QR code types, presets, and form interfaces
│   │   └── barcode.ts           # Barcode symbologies and configuration types
│   ├── utils/
│   │   ├── qrPayload.ts         # Encoders for 14 QR data types
│   │   ├── qrRenderer.ts        # QR SVG assembly, frames, PNG, PDF & print
│   │   ├── barcodeRenderer.ts   # JsBarcode SVG renderer & PDF label exporter
│   │   ├── presets.ts           # 12+ curated designer presets
│   │   └── watermarks.ts        # Built-in SVG watermark badges
│   └── components/
│       ├── Header.tsx           # Glassmorphic header with navigation tabs
│       ├── AnimatedBackground.tsx # Floating glass orbs & aurora ambient mesh
│       ├── RealTimeAnalysis.tsx # Optical contrast & matrix diagnostics
│       ├── TypeSelector.tsx     # 14 data type selector pills
│       ├── TypeInputs.tsx       # Dynamic input forms for each payload
│       ├── AccordionSection.tsx # Accordion pill container
│       ├── ColorsSection.tsx    # Colors, gradients, background controls
│       ├── DesignSection.tsx    # Patterns, marker borders & centers
│       ├── LogoSection.tsx      # Custom logo upload & watermark badges
│       ├── FrameSection.tsx     # Frame templates, labels & font selector
│       ├── OptionsSection.tsx   # Resolution & precision controls
│       ├── QRPreview.tsx        # Live preview, stylish export tiles & save
│       ├── BarcodeStudio.tsx    # 1D/2D Barcode Generator studio
│       ├── BatchProcessor.tsx   # CSV import, batch generation & ZIP download
│       ├── SavedDashboard.tsx   # Library manager with search & re-edit
│       ├── PresetBar.tsx        # Fast horizontal preset switcher
│       ├── PresetModal.tsx      # Curated preset theme gallery
│       └── Footer.tsx           # Developer credits & system status
```

---

## 👨‍💻 Developer & Author

**Develop and Deployed by MD ISTIAK ISLAM**  
- **Email**: [iforistiak@gmail.com](mailto:iforistiak@gmail.com)  
- **Project**: QR Studio Pro  

---

## 📄 License

This project is licensed under the **Apache-2.0 License**. See the LICENSE file for details.
