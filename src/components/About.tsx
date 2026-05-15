import React from 'react';
import { motion } from 'motion/react';
import { FileText, Download } from 'lucide-react';
import { useSiteConfig } from '../lib/config.ts';

export default function About() {
  const { config } = useSiteConfig();
  const engineeringPhilosophy = config.about.philosophy;

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="about">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 border border-white/10">
            <img 
              src={config.about.portraitUrl} 
              alt="Professional Portrait" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 glass p-8 rounded-2xl hidden md:block">
            <p className="text-brand font-bold text-lg tracking-tighter">{config.brandName}</p>
            <p className="text-white/60 text-xs font-mono uppercase tracking-widest">{config.role}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-mono mb-6 uppercase tracking-widest">
            Engineering Strategy
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">{config.about.title}</h2>
          <div className="space-y-8 mb-12">
            {engineeringPhilosophy.map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group border-l-2 border-white/10 hover:border-brand pl-6 py-2 transition-colors"
              >
                <h3 className="font-bold text-white mb-2 group-hover:text-brand transition-colors">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed font-sans">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-8">
            <a
              href="/resume.pdf"
              target="_blank"
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand text-white rounded-md font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(108,92,231,0.2)]"
              id="download-resume"
            >
              <FileText className="w-5 h-5" /> Download Resume
            </a>
            <div className="flex gap-6 items-center">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1">Portfolio</span>
                <span className="text-white font-mono text-sm">2024 Edition</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1">Presence</span>
                <span className="text-white font-mono text-sm underline decoration-brand underline-offset-4">{config.about.presence}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
