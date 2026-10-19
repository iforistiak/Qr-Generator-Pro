import React from 'react';
import {
  ExternalLink,
  Type,
  Mail,
  Navigation,
  Phone,
  MessageSquareText,
  MessageCircle,
  Video,
  Wifi,
  Contact,
  Calendar,
  CreditCard,
  Coins,
  Send,
} from 'lucide-react';
import { QRType } from '../types/qr';

interface TypeSelectorProps {
  currentType: QRType;
  onChangeType: (type: QRType) => void;
}

interface TypeItem {
  id: QRType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TYPES: TypeItem[] = [
  { id: 'link', label: 'Link', icon: ExternalLink },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'email', label: 'E-mail', icon: Mail },
  { id: 'location', label: 'Location', icon: Navigation },
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'sms', label: 'SMS', icon: MessageSquareText },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'skype', label: 'Skype', icon: Send },
  { id: 'zoom', label: 'Zoom', icon: Video },
  { id: 'wifi', label: 'WI-FI', icon: Wifi },
  { id: 'vcard', label: 'V-card', icon: Contact },
  { id: 'event', label: 'Event', icon: Calendar },
  { id: 'paypal', label: 'PayPal', icon: CreditCard },
  { id: 'bitcoin', label: 'BitCoin', icon: Coins },
];

export const TypeSelector: React.FC<TypeSelectorProps> = ({ currentType, onChangeType }) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 w-full max-w-full">
      {TYPES.map((item) => {
        const Icon = item.icon;
        const isActive = currentType === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChangeType(item.id)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              isActive
                ? 'bg-[#1877F2] text-white shadow-sm shadow-blue-500/30'
                : 'text-[#1877F2] hover:bg-blue-50/80 bg-transparent'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
