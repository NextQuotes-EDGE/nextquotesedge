import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, Code2, Cpu, Zap, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton.tsx';
import { useSiteConfig } from '../lib/config.ts';

export default function Hero() {
  const { config } = useSiteConfig();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

  const rotateX = useTransform(dy, [-300, 300], [10, -10]);
  const rotateY = useTransform(dx, [-300, 300], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-bg-dark" id="hero">
      {/* Dynamic Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ x: dx, y: dy }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          style={{ x: useSpring(useTransform(dx, d => -d * 0.5)), y: useSpring(useTransform(dy, d => -d * 0.5)) }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-mono mb-6"
            >
              <Zap className="w-3 h-3" /> {config.role}
            </motion.div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight" id="hero-title">
              {config.hero.titlePrefix} <span className="text-brand">{config.hero.titleHighlight}</span> <br /> 
              <span className="text-white/40">{config.hero.titleSuffix}</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl" id="hero-subtext">
              {config.hero.subtext}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4" id="hero-actions">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-bg-dark rounded-md font-bold hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                id="hero-projects-link"
              >
                {config.hero.ctaText} <ArrowRight className="w-5 h-5" />
              </Link>
              <WhatsAppButton 
                message="Hi! We're interested in working with you on a system development project."
                variant="outline"
              />
            </div>
          </motion.div>

          {/* Abstract Tech Stack Vis */}
          <motion.div 
            style={{ rotateX, rotateY, perspective: 1000 }}
            className="hidden lg:flex justify-center relative"
          >
            <div className="relative w-[400px] h-[400px]">
              {/* Central Core */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1], rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-brand/30 rounded-2xl flex items-center justify-center bg-brand/5 backdrop-blur-sm"
              >
                <Cpu className="w-12 h-12 text-brand drop-shadow-[0_0_8px_rgba(108,92,231,0.5)]" />
              </motion.div>

              {/* Floating Nodes */}
              {[
                { Icon: Database, delay: 0, top: '10%', left: '20%' },
                { Icon: Code2, delay: 1, top: '20%', left: '80%' },
                { Icon: Zap, delay: 2, top: '70%', left: '15%' },
                { Icon: Zap, delay: 3, top: '80%', left: '75%' },
              ].map((node, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, delay: node.delay, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl"
                  style={{ top: node.top, left: node.left }}
                >
                  <node.Icon className="w-6 h-6 text-white/60" />
                </motion.div>
              ))}

              {/* Connecting Lines (Decorative SVG) */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                <motion.circle 
                  cx="50%" cy="50%" r="45%" 
                  fill="none" stroke="white" strokeWidth="1" strokeDasharray="10 20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
