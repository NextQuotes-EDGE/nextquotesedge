import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteConfig } from '../lib/config.ts';
import { useContactModal } from '../lib/ContactModalContext.tsx';

export default function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { config } = useSiteConfig();
  const { isOpen, open } = useContactModal();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, location.hash]);

  const navLinks = [
    { name: 'Home', path: '/', hash: undefined },
    { name: 'Projects', path: '/projects', hash: undefined },
    { name: 'About', path: '/#about', hash: '#about' },
  ];

  const isActive = (link: { name: string; path: string; hash?: string }) => {
    if (link.hash) return location.hash === link.hash;
    if (link.path === '/') return location.pathname === '/' && !location.hash;
    return location.pathname === link.path;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 pt-[max(0.75rem,env(safe-area-inset-top))]' : 'py-5 pt-[max(1.25rem,env(safe-area-inset-top))]'
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
                  isActive(link) ? 'text-brand' : 'text-gray-400'
                }`}
                id={`nav-link-${link.name.toLowerCase()}`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 w-0 h-px bg-brand transition-all group-hover:w-full ${
                  isActive(link) ? 'w-full' : ''
                }`} />
              </Link>
            ))}
            <button
              onClick={open}
              className={`text-xs font-mono uppercase tracking-[0.2em] transition-all hover:text-brand relative group ${
                isOpen ? 'text-brand' : 'text-gray-400'
              }`}
              id="nav-link-contact"
            >
              Contact
              <span className={`absolute -bottom-2 left-0 h-px bg-brand transition-all group-hover:w-full ${
                isOpen ? 'w-full' : 'w-0'
              }`} />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-3 -mr-2 text-white active:scale-95 transition-transform"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 md:hidden bg-bg-dark/95 backdrop-blur-md"
            onClick={closeMobileMenu}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full flex-col justify-center px-8 pt-24 pb-[max(2.5rem,env(safe-area-inset-bottom))] overflow-y-auto"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMobileMenu}
                    className={`text-3xl font-bold py-3 transition-colors ${
                      isActive(link) ? 'text-brand' : 'text-white hover:text-brand'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    closeMobileMenu();
                    open();
                  }}
                  className={`text-left text-3xl font-bold py-3 transition-colors ${
                    isOpen ? 'text-brand' : 'text-white hover:text-brand'
                  }`}
                >
                  Contact
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
