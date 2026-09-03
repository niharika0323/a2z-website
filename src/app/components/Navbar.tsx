"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, User } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <motion.nav 
      className="navbar glass"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Link href="/" style={{ textDecoration: 'none' }}>
        <Logo size="sm" showTagline={false} />
      </Link>

      <ul className="nav-links">
        <li><a href="/#home">Home</a></li>
        <li><a href="/#about">About</a></li>
        <li><a href="/#services">Services</a></li>
        <li><a href="/#portfolio">BGV Platform</a></li>
        <li><a href="/#contact">Contact</a></li>
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/login" style={{ textDecoration: 'none' }}>
          <button 
            className="btn-primary" 
            style={{ 
              padding: '0.55rem 1.6rem', 
              fontSize: '0.9rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              borderRadius: '50px'
            }}
          >
            <User size={16} /> Portal Login
          </button>
        </Link>
      </div>
    </motion.nav>
  );
}
