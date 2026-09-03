"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import TechBackground from "./TechBackground";

export default function Hero() {
  return (
    <section 
      id="home" 
      className="section" 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'relative', 
        overflow: 'hidden',
        backgroundColor: '#0b0f19'
      }}
    >
      {/* Futuristic 4K High-Tech Stock Footage & Isometric Circuit Background */}
      <TechBackground />

      <div style={{ maxWidth: '1050px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10, padding: '0 1.5rem' }}>
        
        {/* Top High-Tech Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            padding: '0.45rem 1.4rem', 
            backgroundColor: 'rgba(16, 24, 40, 0.85)', 
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(56, 189, 248, 0.4)', 
            borderRadius: '50px', 
            color: '#38bdf8', 
            fontWeight: 800, 
            marginBottom: '1.8rem', 
            letterSpacing: '2px', 
            textTransform: 'uppercase', 
            fontSize: '0.78rem',
            boxShadow: '0 0 24px rgba(56, 189, 248, 0.25)'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f5d4', display: 'inline-block', boxShadow: '0 0 10px #00f5d4' }} />
          <ShieldCheck size={16} color="#38bdf8" />
          Enterprise BGV & Risk Intelligence Platform
        </motion.div>
        
        {/* Futuristic High-Contrast Hero Headline */}
        <motion.h1 
          style={{ 
            fontSize: 'clamp(2.3rem, 5vw, 4rem)', 
            fontWeight: 800, 
            color: '#ffffff', 
            lineHeight: 1.14, 
            marginBottom: '1.2rem', 
            letterSpacing: '-0.03em', 
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.9)' 
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Next-Generation <br />
          <span style={{ 
            background: 'linear-gradient(135deg, #00f5d4 0%, #38bdf8 50%, #d946ef 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            filter: 'drop-shadow(0 4px 30px rgba(56, 189, 248, 0.4))'
          }}>
            Background Verification
          </span>
        </motion.h1>
        
        {/* Technical Sub-description */}
        <motion.p 
          style={{ 
            fontSize: '1.15rem', 
            color: '#cbd5e1', 
            maxWidth: '760px', 
            margin: '0 auto 0 auto', 
            lineHeight: 1.75, 
            fontWeight: 400, 
            textShadow: '0 2px 12px rgba(0,0,0,0.85)' 
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          An enterprise-grade BGV suite engineered for automated court record searches across 10,000+ district courts, instant biometric KYC, direct university degree verification, and real-time workforce compliance.
        </motion.p>

        {/* 4 High-Tech Feature Badges Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{
            marginTop: '2.5rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '1.2rem',
            flexWrap: 'wrap',
            fontSize: '0.86rem',
            fontWeight: 700,
            color: '#f8fafc'
          }}
        >
          {[
            { label: "10,000+ Courts Covered", color: "#00f5d4" },
            { label: "24-48h Guaranteed TAT", color: "#38bdf8" },
            { label: "ISO 27001 & SOC-2 Certified", color: "#d946ef" },
            { label: "99.4% Forensic Accuracy", color: "#a855f7" }
          ].map((item, idx) => (
            <div 
              key={idx}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                background: 'rgba(16, 24, 40, 0.75)', 
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.12)', 
                padding: '0.55rem 1rem', 
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
              }}
            >
              <CheckCircle2 size={16} color={item.color} />
              <span>{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
