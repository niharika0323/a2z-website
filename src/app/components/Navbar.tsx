"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { User, Menu, X, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide when scrolling fast down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About Us" },
    { href: "#services", label: "Services" },
    { href: "#product", label: "Product" },
    { href: "#contact", label: "Contact" }
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ 
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: '1rem',
        left: 0,
        right: 0,
        margin: '0 auto',
        maxWidth: '1180px',
        width: 'calc(100% - 2rem)',
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    >
      <nav 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.65rem 1.6rem',
          borderRadius: '9999px',
          background: scrolled 
            ? 'rgba(9, 13, 22, 0.82)' 
            : 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: scrolled 
            ? '0 15px 40px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.15)' 
            : '0 8px 30px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'auto'
        }}
      >
        {/* Brand Logo */}
        <Link href="#home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Logo size="sm" showTagline={false} />
        </Link>

        {/* Desktop Navigation Links */}
        <ul style={{
          display: 'flex',
          gap: '1.8rem',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          alignItems: 'center'
        }} className="desktop-nav">
          {navLinks.map((item) => (
            <li key={item.label}>
              <a 
                href={item.href}
                style={{
                  textDecoration: 'none',
                  color: '#e2e8f0',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px',
                  transition: 'all 0.2s ease',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#38bdf8';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#e2e8f0';
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Action Button: Enterprise Portal Login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <motion.button 
              whileHover={{ scale: 1.04, boxShadow: '0 0 25px rgba(56, 189, 248, 0.45)' }}
              whileTap={{ scale: 0.97 }}
              style={{ 
                padding: '0.52rem 1.35rem', 
                fontSize: '0.88rem', 
                fontWeight: 700,
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.45rem',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #0284c7 0%, #00f5d4 100%)',
                color: '#06080e',
                border: 'none',
                boxShadow: '0 4px 18px rgba(0, 245, 212, 0.3)',
                cursor: 'pointer',
                letterSpacing: '0.2px'
              }}
            >
              <User size={14} strokeWidth={2.5} /> Portal Login
            </motion.button>
          </Link>

          {/* Mobile hamburger toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            aria-label="Toggle menu"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              marginTop: '0.5rem',
              background: 'rgba(9, 13, 22, 0.95)',
              backdropFilter: 'blur(24px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '1.2rem',
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem'
            }}
          >
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textDecoration: 'none',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  fontWeight: 600,
                  padding: '0.5rem 0.8rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {item.label}
                <ArrowUpRight size={16} color="#38bdf8" />
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </motion.header>
  );
}
