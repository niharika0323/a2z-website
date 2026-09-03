"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* High-Quality Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 1
        }}
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-network-of-lines-and-dots-12962-large.mp4" type="video/mp4" />
      </video>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(162, 140, 219, 0.45) 0%, rgba(244, 241, 237, 1) 100%)', zIndex: 1 }}></div>

      <div style={{ maxWidth: '1050px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10, padding: '0 1.5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              padding: '0.45rem 1.4rem', 
              backgroundColor: 'rgba(255,255,255,0.85)', 
              border: '1px solid rgba(180, 151, 214, 0.4)', 
              borderRadius: '50px', 
              color: 'var(--lilac-dark)', 
              fontWeight: 800, 
              marginBottom: '1.8rem', 
              letterSpacing: '2px', 
              textTransform: 'uppercase', 
              fontSize: '0.82rem',
              boxShadow: '0 6px 20px rgba(122, 91, 156, 0.15)'
            }}
          >
            <ShieldCheck size={18} color="var(--lilac-dark)" />
            Enterprise BGV & Risk Intelligence
          </motion.div>
          
          <motion.h1 
            style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.18, marginBottom: '1.2rem', letterSpacing: '-0.025em', textShadow: '0 4px 20px rgba(255,255,255,0.8)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Next-Generation <br />
            <span style={{ color: 'var(--lilac-dark)', display: 'inline-block', textShadow: '0 4px 30px rgba(162, 140, 219, 0.4)' }}>
              Background Verification
            </span>
          </motion.h1>
          
          <motion.p 
            style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 0 auto', lineHeight: 1.7, fontWeight: 500, textShadow: '0 2px 10px rgba(255,255,255,0.9)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            An enterprise-grade BGV suite engineered for automated court record searches across 10,000+ district courts, instant biometric KYC, direct university degree verification, and real-time workforce compliance.
          </motion.p>

        {/* 4 Feature Badges Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{
            marginTop: '2.5rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '2.5rem',
            flexWrap: 'wrap',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--text-primary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="var(--lilac-dark)" />
            <span>10,000+ Courts Covered</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="var(--lilac-dark)" />
            <span>24-48h Guaranteed TAT</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="var(--lilac-dark)" />
            <span>ISO 27001 & SOC-2 Certified</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="var(--lilac-dark)" />
            <span>99.4% Forensic Accuracy</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Animated Geometric Elements for "More Life" */}
      <motion.div
        animate={{ y: [-20, 20, -20], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', top: '20%', left: '10%', width: '150px', height: '150px', background: 'linear-gradient(135deg, var(--lilac-light), transparent)', borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)', zIndex: 5, opacity: 0.8 }}
      />
      <motion.div
        animate={{ y: [20, -20, 20], rotate: [0, -15, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ position: 'absolute', bottom: '15%', right: '15%', width: '200px', height: '200px', background: 'linear-gradient(135deg, rgba(255,255,255,0.4), var(--lilac-base))', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.6)', zIndex: 5, opacity: 0.6 }}
      />
    </section>
  );
}
