"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, ArrowRight, Mail } from "lucide-react";
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
        backgroundColor: '#070a10',
        paddingTop: '6.5rem',
        paddingBottom: '4.5rem'
      }}
    >
      {/* Real Animated Pinterest Video with Blue Cyber Grading */}
      <TechBackground />

      {/* Embedded CSS Animations for Adjusted Cyan & Blue Heading Motion */}
      <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes textAuraGlowBlue {
          0%, 100% {
            filter: drop-shadow(0 0 16px rgba(0, 245, 212, 0.5)) drop-shadow(0 4px 25px rgba(0, 0, 0, 0.95));
          }
          50% {
            filter: drop-shadow(0 0 28px rgba(56, 189, 248, 0.75)) drop-shadow(0 4px 25px rgba(0, 0, 0, 0.95));
          }
        }
        @keyframes cyberLinePulseBlue {
          0%, 100% {
            width: 120px;
            opacity: 0.65;
            box-shadow: 0 0 10px #00f5d4;
          }
          50% {
            width: 220px;
            opacity: 1;
            box-shadow: 0 0 24px #38bdf8;
          }
        }
        .animated-heading-gradient-blue {
          background: linear-gradient(90deg, #00f5d4 0%, #38bdf8 30%, #60a5fa 60%, #0284c7 85%, #00f5d4 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientFlow 5s linear infinite;
          display: inline-block;
        }
      `}</style>

      <div style={{ 
        maxWidth: '1120px', 
        margin: '0 auto', 
        position: 'relative', 
        zIndex: 10, 
        padding: '0 1.5rem', 
        width: '100%',
        textAlign: 'center'
      }}>
        
        {/* Top High-Tech Pill Badge (Centered) */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          whileHover={{ scale: 1.04, borderColor: "#00f5d4" }}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            padding: '0.42rem 1.3rem', 
            backgroundColor: 'rgba(16, 24, 40, 0.85)', 
            backdropFilter: 'blur(16px)', 
            border: '1px solid rgba(56, 189, 248, 0.4)', 
            borderRadius: '50px', 
            color: '#38bdf8', 
            fontWeight: 800, 
            marginBottom: '1.4rem', 
            letterSpacing: '1.6px', 
            textTransform: 'uppercase', 
            fontSize: '0.73rem',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.25)',
            cursor: 'default'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f5d4', display: 'inline-block', boxShadow: '0 0 10px #00f5d4' }} />
          <ShieldCheck size={15} color="#38bdf8" />
          Enterprise Web & Application Development Studio
        </motion.div>
        
        {/* Dynamic Animated Heading with Adjusted Electric Cyan & Sapphire Blue Palette */}
        <motion.div
          initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
          animate={{ 
            opacity: 1, 
            y: [0, -5, 0],
            filter: 'blur(0px)'
          }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.25 },
            filter: { duration: 0.8, delay: 0.25 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          whileHover={{ scale: 1.02 }}
          style={{ marginBottom: '1.3rem' }}
        >
          <h1 
            style={{ 
              fontSize: 'clamp(1.65rem, 3.1vw, 2.45rem)', 
              fontWeight: 800, 
              color: '#ffffff', 
              lineHeight: 1.25, 
              letterSpacing: '-0.025em', 
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.95)',
              textAlign: 'center',
              margin: 0
            }}
          >
            <span style={{ display: 'block', textShadow: '0 0 25px rgba(56, 189, 248, 0.5), 0 4px 20px rgba(0, 0, 0, 0.95)' }}>
              Architecting High-Performance
            </span>
            <span 
              className="animated-heading-gradient-blue"
              style={{ 
                animation: "gradientFlow 4.5s linear infinite, textAuraGlowBlue 4s ease-in-out infinite"
              }}
            >
              Websites & Scalable Applications
            </span>
          </h1>

          {/* Adjusted Glowing Cyber Blue Accent Bar Under Heading */}
          <div 
            style={{
              height: '3px',
              margin: '0.9rem auto 0 auto',
              background: 'linear-gradient(90deg, transparent, #00f5d4, #38bdf8, #0284c7, transparent)',
              borderRadius: '3px',
              animation: 'cyberLinePulseBlue 4s ease-in-out infinite'
            }}
          />
        </motion.div>
        
        {/* Clean, Focused Description (Centered) */}
        <motion.p 
          style={{ 
            fontSize: '1rem', 
            color: '#cbd5e1', 
            maxWidth: '670px', 
            margin: '0 auto 2rem auto', 
            lineHeight: 1.7, 
            fontWeight: 400, 
            textShadow: '0 2px 12px rgba(0,0,0,0.95)',
            textAlign: 'center'
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          We build robust, scalable digital products — from custom web applications and enterprise portals to native iOS and Android mobile solutions with seamless cloud architecture.
        </motion.p>

        {/* 2 Clean Action Buttons (Centered) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '1.1rem', 
            flexWrap: 'wrap', 
            marginBottom: '2.2rem' 
          }}
        >
          <a href="#services" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.05, y: -2, boxShadow: '0 6px 25px rgba(0, 245, 212, 0.55)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.8rem 1.85rem',
                background: 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)',
                color: '#070a10',
                fontWeight: 800,
                fontSize: '0.88rem',
                borderRadius: '10px',
                border: '1px solid rgba(0, 245, 212, 0.8)',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 245, 212, 0.4)'
              }}
            >
              Explore Services <ArrowRight size={15} />
            </motion.button>
          </a>

          <a href="#contact" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.05, y: -2, borderColor: '#00f5d4', boxShadow: '0 4px 20px rgba(0, 245, 212, 0.25)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.8rem 1.75rem',
                background: 'rgba(16, 24, 40, 0.85)',
                backdropFilter: 'blur(12px)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.5)'
              }}
            >
              <Mail size={15} color="#00f5d4" /> Contact Us
            </motion.button>
          </a>
        </motion.div>

        {/* 4 Feature Badges Bar (Strictly 1 Row) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.65rem',
            flexWrap: 'nowrap',
            fontSize: 'clamp(0.72rem, 0.9vw, 0.8rem)',
            fontWeight: 700,
            color: '#f8fafc',
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            padding: '0.25rem 0.5rem',
            scrollbarWidth: 'none',
            maxWidth: '100%'
          }}
        >
          {[
            { label: "Custom Web & Mobile Apps", color: "#00f5d4" },
            { label: "Full-Stack Cloud Architecture", color: "#38bdf8" },
            { label: "Agile Rapid Sprint Delivery", color: "#60a5fa" },
            { label: "100+ Shipped Digital Products", color: "#00f5d4" }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ 
                scale: 1.05, 
                y: -3, 
                borderColor: item.color,
                boxShadow: `0 6px 20px ${item.color}33`
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.45rem', 
                background: 'rgba(16, 24, 40, 0.85)', 
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(255, 255, 255, 0.15)', 
                padding: '0.45rem 0.85rem', 
                borderRadius: '9999px',
                boxShadow: '0 4px 18px rgba(0,0,0,0.4)',
                cursor: 'pointer',
                transition: 'border-color 0.25s ease',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
            >
              <CheckCircle2 size={14} color={item.color} />
              <span>{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
