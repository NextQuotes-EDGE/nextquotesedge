import React from 'react';
import WhatsAppButton from './WhatsAppButton.tsx';
import { useSiteConfig } from '../lib/config.ts';

export default function CTA() {
  const { config } = useSiteConfig();
  return (
    <section className="py-20 bg-brand/5 border-y border-white/5" id="cta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Scale Your Infrastructure?</h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          {config.hero.subtext}
        </p>
        <WhatsAppButton 
          message={`Hi! I saw your portfolio and would like to discuss a system engineering project with you.`}
          className="px-12 py-4 text-lg"
        />
      </div>
    </section>
  );
}
