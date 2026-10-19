import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionSectionProps {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  id,
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="mb-4">
      {/* Pill header button */}
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 py-2.5 rounded-full font-medium text-sm sm:text-base transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'bg-[#1877F2] text-white shadow-md shadow-blue-500/20'
            : 'bg-white hover:bg-blue-50/60 text-[#1877F2] border border-[#1877F2]/80'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4" />
          <span>{title}</span>
        </div>
        <div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-white/90" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#1877F2]" />
          )}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="mt-4 px-2 sm:px-4 py-3 bg-white/70 backdrop-blur-xs rounded-2xl border border-slate-200/70 shadow-xs animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
};
