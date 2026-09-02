import React from 'react';
import { MessageSquare } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSiteConfig } from '../lib/config';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WhatsAppButtonProps {
  message: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function WhatsAppButton({ message, className, variant = 'primary' }: WhatsAppButtonProps) {
  const { config } = useSiteConfig();
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${config.whatsappNumber.replace('+', '')}?text=${encodedMessage}`;

  const variants = {
    primary: "bg-brand text-white hover:bg-opacity-90",
    secondary: "bg-white text-bg-dark hover:bg-gray-100",
    outline: "border border-brand text-brand hover:bg-brand hover:text-white"
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all",
        variants[variant],
        className
      )}
      id="whatsapp-button"
    >
      <MessageSquare className="w-5 h-5" />
      Contact via WhatsApp
    </a>
  );
}
