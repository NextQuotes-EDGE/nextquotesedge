import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useSiteConfig } from '../lib/config.ts';
import { useContactModal } from '../lib/ContactModalContext.tsx';

export default function CTA() {
  const { config } = useSiteConfig();
  const { open } = useContactModal();

  return (
    <section className="py-20 bg-brand/5 border-y border-white/5" id="cta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Scale Your Infrastructure?</h2>
        <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          {config.hero.subtext}
        </p>
        <button
          onClick={open}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-12 py-4 text-lg bg-brand text-white rounded-md font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(108,92,231,0.2)]"
          id="cta-contact-button"
        >
          <MessageSquare className="w-5 h-5" />
          Tell Us About Your Project
        </button>
      </div>
    </section>
  );
}
