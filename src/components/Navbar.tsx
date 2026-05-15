import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteConfig } from '../lib/config.ts';

export default function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { config } = useSiteConfig();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/#about' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-4' : 'py-6'
      }`} 
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between px-6 rounded-2xl transition-all duration-300 ${
          isScrolled ? 'glass h-16 shadow-lg shadow-black/20' : 'h-20 bg-transparent'
        }`}>
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl group" id="logo">
            <div className="p-2 bg-brand/10 rounded-lg group-hover:bg-brand transition-colors">
              <Terminal className="w-5 h-5 text-brand group-hover:text-white transition-colors" />
            </div>
            <span className="tracking-tighter">{config.brandName}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-mono uppercase tracking-[0.2em] transition-all hover:text-brand relative group ${
                  location.pathname === link.path ? 'text-brand' : 'text-gray-400'
                }`}
                id={`nav-link-${link.name.toLowerCase()}`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 w-0 h-px bg-brand transition-all group-hover:w-full ${
                  location.pathname === link.path ? 'w-full' : ''
                }`} />
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden glass mt-24 mx-4 rounded-3xl h-fit overflow-hidden border border-white/10"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold text-white hover:text-brand transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
