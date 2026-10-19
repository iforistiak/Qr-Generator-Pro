import React from 'react';
import { QRFormValues, QRType } from '../types/qr';

interface TypeInputsProps {
  form: QRFormValues;
  onChange: (updates: Partial<QRFormValues>) => void;
}

export const TypeInputs: React.FC<TypeInputsProps> = ({ form, onChange }) => {
  const updateNested = <K extends keyof QRFormValues>(
    key: K,
    nestedUpdates: Partial<QRFormValues[K]>
  ) => {
    onChange({
      [key]: {
        ...(form[key] as any),
        ...nestedUpdates,
      },
    } as any);
  };

  switch (form.type) {
    case 'link':
      return (
        <div className="mb-6 space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Link</h2>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">URL</label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => onChange({ url: e.target.value })}
              placeholder="https://"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-2xs"
            />
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="mb-6 space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Plain Text</h2>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Text Content</label>
            <textarea
              rows={4}
              value={form.text}
              onChange={(e) => onChange({ text: e.target.value })}
              placeholder="Type or paste any text or note..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-2xs resize-y"
            />
          </div>
        </div>
      );

    case 'email':
      return (
        <div className="mb-6 space-y-3">
          <h2 className="text-xl font-bold text-slate-800">E-mail</h2>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Recipient Email</label>
            <input
              type="email"
              value={form.email.address}
              onChange={(e) => updateNested('email', { address: e.target.value })}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Subject</label>
              <input
                type="text"
                value={form.email.subject}
                onChange={(e) => updateNested('email', { subject: e.target.value })}
                placeholder="Inquiry / Feedback"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Message Body</label>
              <input
                type="text"
                value={form.email.body}
                onChange={(e) => updateNested('email', { body: e.target.value })}
                placeholder="Message template..."
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      );

    case 'location':
      return (
        <div className="mb-6 space-y-3">
          <h2 className="text-xl font-bold text-slate-800">Location</h2>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Search Address or Place</label>
            <input
              type="text"
              value={form.location.address}
              onChange={(e) => updateNested('location', { address: e.target.value })}
              placeholder="e.g. 1600 Amphitheatre Pkwy, Mountain View, CA"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Latitude</label>
              <input
                type="text"
                value={form.location.latitude}
                onChange={(e) => updateNested('location', { latitude: e.target.value })}
                placeholder="37.422"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Longitude</label>
              <input
                type="text"
                value={form.location.longitude}
                onChange={(e) => updateNested('location', { longitude: e.target.value })}
                placeholder="-122.084"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      );

    case 'phone':
      return (
        <div className="mb-6 space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Phone</h2>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      );

    case 'sms':
      return (
        <div className="mb-6 space-y-3">
          <h2 className="text-xl font-bold text-slate-800">SMS</h2>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
            <input
              type="tel"
              value={form.sms.number}
              onChange={(e) => updateNested('sms', { number: e.target.value })}
              placeholder="+1555000000"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Message</label>
            <textarea
              rows={2}
              value={form.sms.message}
              onChange={(e) => updateNested('sms', { message: e.target.value })}
              placeholder="Pre-composed SMS text..."
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      );

    case 'whatsapp':
      return (
        <div className="mb-6 space-y-3">
          <h2 className="text-xl font-bold text-slate-800">WhatsApp</h2>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              WhatsApp Number (with country code, e.g. +1...)
            </label>
            <input
              type="tel"
              value={form.whatsapp.number}
              onChange={(e) => updateNested('whatsapp', { number: e.target.value })}
              placeholder="+1234567890"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Pre-filled Message</label>
            <input
              type="text"
              value={form.whatsapp.message}
              onChange={(e) => updateNested('whatsapp', { message: e.target.value })}
              placeholder="Hi, I'd like to get in touch!"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      );

    case 'skype':
      return (
        <div className="mb-6 space-y-3">
          <h2 className="text-xl font-bold text-slate-800">Skype</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Skype Username</label>
              <input
                type="text"
                value={form.skype.username}
                onChange={(e) => updateNested('skype', { username: e.target.value })}
                placeholder="echo123"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Action</label>
              <select
                value={form.skype.action}
                onChange={(e) => updateNested('skype', { action: e.target.value as any })}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="call">Voice / Video Call</option>
                <option value="chat">Direct Chat</option>
              </select>
            </div>
          </div>
        </div>
      );

    case 'zoom':
      return (
        <div className="mb-6 space-y-3">
          <h2 className="text-xl font-bold text-slate-800">Zoom Meeting</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Meeting ID</label>
              <input
                type="text"
                value={form.zoom.meetingId}
                onChange={(e) => updateNested('zoom', { meetingId: e.target.value })}
                placeholder="829 4719 284"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Passcode (optional)</label>
              <input
                type="text"
                value={form.zoom.password}
                onChange={(e) => updateNested('zoom', { password: e.target.value })}
                placeholder="Passcode"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      );

    case 'wifi':
      return (
        <div className="mb-6 space-y-3">
          <h2 className="text-xl font-bold text-slate-800">Wi-Fi Network</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Network Name (SSID)</label>
              <input
                type="text"
                value={form.wifi.ssid}
                onChange={(e) => updateNested('wifi', { ssid: e.target.value })}
                placeholder="MyOffice_WiFi"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
              <input
                type="text"
                value={form.wifi.password}
                onChange={(e) => updateNested('wifi', { password: e.target.value })}
                placeholder="WiFi password"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-600">Encryption:</label>
              <select
                value={form.wifi.encryption}
                onChange={(e) => updateNested('wifi', { encryption: e.target.value as any })}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open)</option>
              </select>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.wifi.hidden}
                onChange={(e) => updateNested('wifi', { hidden: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              Hidden Network
            </label>
          </div>
        </div>
      );

    case 'vcard':
      return (
        <div className="mb-6 space-y-3">
          <h2 className="text-xl font-bold text-slate-800">V-Card Contact</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">First Name</label>
              <input
                type="text"
                value={form.vcard.firstName}
                onChange={(e) => updateNested('vcard', { firstName: e.target.value })}
                placeholder="John"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Last Name</label>
              <input
                type="text"
                value={form.vcard.lastName}
                onChange={(e) => updateNested('vcard', { lastName: e.target.value })}
                placeholder="Doe"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Organization</label>
              <input
                type="text"
                value={form.vcard.organization}
                onChange={(e) => updateNested('vcard', { organization: e.target.value })}
                placeholder="Acme Corp"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Job Title</label>
              <input
                type="text"
                value={form.vcard.title}
                onChange={(e) => updateNested('vcard', { title: e.target.value })}
                placeholder="CEO / Designer"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
              <input
                type="tel"
                value={form.vcard.phone}
                onChange={(e) => updateNested('vcard', { phone: e.target.value })}
                placeholder="+1 555-0100"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
              <input
                type="email"
                value={form.vcard.email}
                onChange={(e) => updateNested('vcard', { email: e.target.value })}
                placeholder="john@acme.com"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Website URL</label>
            <input
              type="url"
              value={form.vcard.url}
              onChange={(e) => updateNested('vcard', { url: e.target.value })}
              placeholder="https://acme.com"
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      );

    case 'event':
      return (
        <div className="mb-6 space-y-3">
          <h2 className="text-xl font-bold text-slate-800">Event / Calendar</h2>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Event Title</label>
            <input
              type="text"
              value={form.event.title}
              onChange={(e) => updateNested('event', { title: e.target.value })}
              placeholder="Product Launch Keynote"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Location / Venue</label>
            <input
              type="text"
              value={form.event.location}
              onChange={(e) => updateNested('event', { location: e.target.value })}
              placeholder="Moscone Center / Online"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Start Time</label>
              <input
                type="datetime-local"
                value={form.event.startTime}
                onChange={(e) => updateNested('event', { startTime: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">End Time</label>
              <input
                type="datetime-local"
                value={form.event.endTime}
                onChange={(e) => updateNested('event', { endTime: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      );

    case 'paypal':
      return (
        <div className="mb-6 space-y-3">
          <h2 className="text-xl font-bold text-slate-800">PayPal Payment</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                PayPal.Me Username or Email
              </label>
              <input
                type="text"
                value={form.paypal.account}
                onChange={(e) => updateNested('paypal', { account: e.target.value })}
                placeholder="yourusername"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Item / Description</label>
              <input
                type="text"
                value={form.paypal.itemName}
                onChange={(e) => updateNested('paypal', { itemName: e.target.value })}
                placeholder="Service or Product name"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                value={form.paypal.amount}
                onChange={(e) => updateNested('paypal', { amount: e.target.value })}
                placeholder="25.00"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Currency</label>
              <select
                value={form.paypal.currency}
                onChange={(e) => updateNested('paypal', { currency: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>
        </div>
      );

    case 'bitcoin':
      return (
        <div className="mb-6 space-y-3">
          <h2 className="text-xl font-bold text-slate-800">BitCoin Payment</h2>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">BTC Wallet Address</label>
            <input
              type="text"
              value={form.bitcoin.address}
              onChange={(e) => updateNested('bitcoin', { address: e.target.value })}
              placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (BTC)</label>
              <input
                type="number"
                step="0.0001"
                value={form.bitcoin.amount}
                onChange={(e) => updateNested('bitcoin', { amount: e.target.value })}
                placeholder="0.005"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Message / Note</label>
              <input
                type="text"
                value={form.bitcoin.message}
                onChange={(e) => updateNested('bitcoin', { message: e.target.value })}
                placeholder="Invoice #1024"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
