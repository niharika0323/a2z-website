"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, ArrowRight, Layers, Sparkles, Cpu, Award } from "lucide-react";
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
        backgroundColor: '#06080e',
        paddingTop: '7.5rem',
        paddingBottom: '5rem'
      }}
    >
      {/* Background Animated Canvas */}
      <TechBackground />

      <style>{`
        @keyframes enterpriseGradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes subtleGlow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(56, 189, 248, 0.45));
          }
          50% {
            filter: drop-shadow(0 0 35px rgba(0, 245, 212, 0.65));
          }
        }
        .enterprise-heading-gradient {
          background: linear-gradient(90deg, #00f5d4 0%, #38bdf8 35%, #818cf8 70%, #00f5d4 100%);
          background-size: 260% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: enterpriseGradientFlow 6s linear infinite;
          display: inline-block;
        }
      `}</style>

      <div style={{ 
        maxWidth: '1160px', 
        margin: '0 auto', 
        position: 'relative', 
        zIndex: 10, 
        padding: '0 1.5rem', 
        width: '100%',
        textAlign: 'center'
      }}>
        
        {/* Enterprise Strategic Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            padding: '0.42rem 1.4rem', 
            backgroundColor: 'rgba(12, 16, 23, 0.88)', 
            backdropFilter: 'blur(20px)', 
            border: '1px solid rgba(56, 189, 248, 0.35)', 
            borderRadius: '50px', 
            color: '#38bdf8', 
            fontWeight: 800, 
            marginBottom: '1.4rem', 
            letterSpacing: '1.8px', 
            textTransform: 'uppercase', 
            fontSize: '0.82rem',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.2)'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f5d4', display: 'inline-block', boxShadow: '0 0 10px #00f5d4' }} />
          <Cpu size={15} color="#38bdf8" />
          Enterprise Digital Transformation & Engineering
        </motion.div>
        
        {/* Main Enterprise Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ marginBottom: '1.4rem' }}
        >
          <h1 
            style={{ 
              fontSize: 'clamp(2.3rem, 4.8vw, 4.2rem)', 
              fontWeight: 800, 
              color: '#ffffff', 
              lineHeight: 1.15, 
              letterSpacing: '-0.03em', 
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.9)',
              margin: 0
            }}
          >
            Engineering The Next Generation of <br />
            <span 
              className="enterprise-heading-gradient"
              style={{ animation: 'enterpriseGradientFlow 6s linear infinite, subtleGlow 4s ease-in-out infinite' }}
            >
              Digital Enterprise Solutions
            </span>
          </h1>

          <div 
            style={{
              height: '3px',
              maxWidth: '320px',
              margin: '1.2rem auto 0 auto',
              background: 'linear-gradient(90deg, transparent, #00f5d4, #38bdf8, #818cf8, transparent)',
              borderRadius: '9999px'
            }}
          />
        </motion.div>
        
        {/* Value Proposition Description */}
        <motion.p 
          style={{ 
            fontSize: 'clamp(1.08rem, 1.35vw, 1.25rem)', 
            color: '#cbd5e1', 
            maxWidth: '780px', 
            margin: '0 auto 2.4rem auto', 
            lineHeight: 1.75, 
            fontWeight: 400, 
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          A2Z Software Solutions architects high-concurrency cloud systems, bespoke web and mobile platforms, and automated enterprise verification suites engineered for agility, security, and exponential scale.
        </motion.p>

        {/* 3 Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '1rem', 
            flexWrap: 'wrap', 
            marginBottom: '3.2rem' 
          }}
        >
          <a href="#services" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.04, y: -2, boxShadow: '0 8px 30px rgba(0, 245, 212, 0.45)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.9rem 2.1rem',
                background: 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)',
                color: '#06080e',
                fontWeight: 800,
                fontSize: '0.98rem',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 245, 212, 0.35)',
                letterSpacing: '0.2px'
              }}
            >
              Explore Capabilities <ArrowRight size={17} />
            </motion.button>
          </a>

          <a href="#product" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.04, y: -2, borderColor: '#38bdf8', boxShadow: '0 8px 25px rgba(56, 189, 248, 0.25)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.9rem 2rem',
                background: 'rgba(12, 16, 23, 0.85)',
                backdropFilter: 'blur(16px)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.98rem',
                borderRadius: '10px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4)'
              }}
            >
              <Sparkles size={17} color="#38bdf8" /> Discover Flagship Product
            </motion.button>
          </a>
        </motion.div>

        {/* Enterprise Metrics Ribbon (Accenture/Inspira Style) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1rem',
            maxWidth: '1060px',
            margin: '0 auto'
          }}
        >
          {[
            { metric: "99.99%", title: "Cloud High Availability", subtitle: "Mission-critical SLA uptime" },
            { metric: "50M+", title: "Operations Processed", subtitle: "High-throughput data engines" },
            { metric: "10x", title: "Deployment Velocity", subtitle: "Automated CI/CD & microservices" },
            { metric: "Zero-Trust", title: "Enterprise Security", subtitle: "Bank-grade encryption & audits" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, borderColor: 'rgba(56, 189, 248, 0.5)' }}
              style={{
                background: 'rgba(12, 16, 23, 0.75)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '14px',
                padding: '1.25rem 1.15rem',
                textAlign: 'left',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{ fontSize: '1.95rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {item.metric}
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#ffffff', marginTop: '0.45rem' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                {item.subtitle}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
