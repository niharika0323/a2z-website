"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setVisible(false); // scrolling down
      } else {
        setVisible(true);  // scrolling up
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        top: '1.2rem',
        left: 0,
        right: 0,
        margin: '0 auto',
        maxWidth: '1020px',
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
          borderRadius: '9999px', // Cylindrical / Capsule shape!
          background: scrolled 
            ? 'rgba(15, 23, 42, 0.65)' 
            : 'rgba(255, 255, 255, 0.12)', // Fully transparent glassmorphism
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: scrolled 
            ? '0 12px 35px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)' 
            : '0 8px 30px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'auto'
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Logo size="sm" showTagline={false} />
        </Link>

        <ul style={{
          display: 'flex',
          gap: '2rem',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          alignItems: 'center'
        }}>
          {[
            { href: "/#home", label: "Home" },
            { href: "/#about", label: "About" },
            { href: "/#services", label: "Services" },
            { href: "/#portfolio", label: "Case Studies" },
            { href: "/#contact", label: "Contact" }
          ].map(item => (
            <li key={item.label}>
              <a 
                href={item.href}
                style={{
                  textDecoration: 'none',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.3px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                  transition: 'color 0.2s ease',
                  padding: '0.3rem 0.5rem'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'}
                onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button 
              style={{ 
                padding: '0.5rem 1.4rem', 
                fontSize: '0.84rem', 
                fontWeight: 700,
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.45rem',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, var(--lilac-dark, #7A5B9C), #38bdf8)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 15px rgba(56, 189, 248, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.25s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <User size={15} /> Portal Login
            </button>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
