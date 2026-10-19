import { QRFormValues } from '../types/qr';

export function generateQRPayload(form: QRFormValues): string {
  switch (form.type) {
    case 'link': {
      let url = form.url.trim();
      if (!url) return 'https://example.com';
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      return url;
    }

    case 'text': {
      return form.text || 'Welcome to QR Studio Pro';
    }

    case 'email': {
      const email = form.email.address.trim();
      if (!email) return 'mailto:info@example.com';
      const params = new URLSearchParams();
      if (form.email.subject) params.append('subject', form.email.subject);
      if (form.email.body) params.append('body', form.email.body);
      const query = params.toString();
      return `mailto:${email}${query ? `?${query}` : ''}`;
    }

    case 'location': {
      const lat = form.location.latitude.trim();
      const lng = form.location.longitude.trim();
      if (lat && lng) {
        return `https://maps.google.com/local?q=${lat},${lng}`;
      }
      if (form.location.address) {
        return `https://maps.google.com/local?q=${encodeURIComponent(form.location.address.trim())}`;
      }
      return 'https://maps.google.com';
    }

    case 'phone': {
      const phone = form.phone.trim();
      return phone ? `tel:${phone}` : 'tel:+1234567890';
    }

    case 'sms': {
      const num = form.sms.number.trim();
      const msg = form.sms.message;
      return `smsto:${num || '+1234567890'}:${msg || ''}`;
    }

    case 'whatsapp': {
      const cleanNum = form.whatsapp.number.replace(/[^0-9]/g, '');
      const text = encodeURIComponent(form.whatsapp.message || '');
      return cleanNum
        ? `https://wa.me/${cleanNum}${text ? `?text=${text}` : ''}`
        : 'https://wa.me/';
    }

    case 'skype': {
      const username = form.skype.username.trim() || 'echo123';
      return `skype:${username}?${form.skype.action || 'call'}`;
    }

    case 'zoom': {
      const id = form.zoom.meetingId.replace(/[^0-9]/g, '');
      const pwd = encodeURIComponent(form.zoom.password || '');
      return `https://zoom.us/j/${id || '1234567890'}${pwd ? `?pwd=${pwd}` : ''}`;
    }

    case 'wifi': {
      const ssid = form.wifi.ssid.replace(/([\\;,:"])/g, '\\$1');
      const pass = form.wifi.password.replace(/([\\;,:"])/g, '\\$1');
      const auth = form.wifi.encryption || 'WPA';
      const hidden = form.wifi.hidden ? 'true' : 'false';
      return `WIFI:T:${auth};S:${ssid};P:${pass};H:${hidden};;`;
    }

    case 'vcard': {
      const { firstName, lastName, organization, title, phone, email, url, street, city, country } =
        form.vcard;
      const fn = `${firstName} ${lastName}`.trim() || 'John Doe';
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${lastName || ''};${firstName || ''};;;`,
        `FN:${fn}`,
        organization ? `ORG:${organization}` : '',
        title ? `TITLE:${title}` : '',
        phone ? `TEL;TYPE=CELL:${phone}` : '',
        email ? `EMAIL;TYPE=INTERNET:${email}` : '',
        url ? `URL:${url}` : '',
        street || city || country ? `ADR;TYPE=WORK:;;${street || ''};${city || ''};;${country || ''}` : '',
        'END:VCARD',
      ]
        .filter(Boolean)
        .join('\n');
    }

    case 'event': {
      const { title, location, startTime, endTime, description } = form.event;
      const formatDT = (dtStr: string) => {
        if (!dtStr) return '';
        const d = new Date(dtStr);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const dtStart = formatDT(startTime) || '20261020T100000Z';
      const dtEnd = formatDT(endTime) || '20261020T110000Z';

      return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//QR Studio Pro//EN',
        'BEGIN:VEVENT',
        `SUMMARY:${title || 'Important Meeting'}`,
        location ? `LOCATION:${location}` : '',
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        description ? `DESCRIPTION:${description}` : '',
        'END:VEVENT',
        'END:VCALENDAR',
      ]
        .filter(Boolean)
        .join('\n');
    }

    case 'paypal': {
      const acc = form.paypal.account.trim() || 'user';
      const amt = form.paypal.amount.trim();
      const curr = form.paypal.currency || 'USD';
      if (acc.includes('@')) {
        // Paypal webscr
        return `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(
          acc
        )}&amount=${encodeURIComponent(amt || '10.00')}&currency_code=${curr}&item_name=${encodeURIComponent(
          form.paypal.itemName || 'Payment'
        )}`;
      }
      return `https://www.paypal.me/${acc}${amt ? `/${amt}${curr}` : ''}`;
    }

    case 'bitcoin': {
      const addr = form.bitcoin.address.trim() || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
      const amt = form.bitcoin.amount.trim();
      const msg = form.bitcoin.message.trim();
      const params = new URLSearchParams();
      if (amt) params.append('amount', amt);
      if (msg) params.append('message', msg);
      const query = params.toString();
      return `bitcoin:${addr}${query ? `?${query}` : ''}`;
    }

    default:
      return 'https://example.com';
  }
}
