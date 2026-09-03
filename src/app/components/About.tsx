"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="section" style={{ background: 'transparent' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Headings positioned above the columns */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', padding: '0.4rem 1.3rem', backgroundColor: 'rgba(16, 24, 40, 0.75)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '50px', color: '#38bdf8', fontWeight: 800, marginBottom: '1.2rem', fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            WHO WE ARE // ABOUT A2Z
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.7rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            The Leading Web & App Solutions Company & <br />
            <span className="text-gradient">Your Partner for Digital Innovation</span>
          </h2>
        </div>

        {/* Compact Two-Card Grid (Same Size, Reduced Width) */}
        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.4rem', alignItems: 'stretch' }}>
          
          {/* Left Column: High-Tech Photorealistic Team Image (Reduced Width) */}
          <motion.div 
            style={{ 
              position: 'relative', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              border: '1px solid rgba(56, 189, 248, 0.35)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 189, 248, 0.12)',
              minHeight: '340px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              boxSizing: 'border-box'
            }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <img 
              src="/about-team.jpg" 
              alt="A2Z Software Engineering Team" 
              style={{ 
                position: 'absolute',
                inset: 0,
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                objectPosition: 'center center',
                display: 'block', 
                filter: 'brightness(0.95) contrast(1.1)'
              }} 
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,10,16,0.92) 0%, rgba(7,10,16,0.2) 50%, transparent 100%)' }} />
            
            {/* Compact Floating Stat Badge */}
            <motion.div 
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: 'relative',
                zIndex: 2,
                margin: '0.85rem',
                background: 'rgba(16, 24, 40, 0.92)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(0, 245, 212, 0.4)',
                borderRadius: '10px',
                padding: '0.65rem 0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.7rem',
                boxShadow: '0 8px 20px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f5d4', display: 'inline-block', boxShadow: '0 0 8px #00f5d4' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff' }}>100+ Enterprise Products Shipped</div>
                  <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Web, Mobile & Cloud Systems</div>
                </div>
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#00f5d4' }}>99.8%</div>
            </motion.div>
          </motion.div>
        
          {/* Right Column: Why Choose Us & Advantages (Reduced Width) */}
          <motion.div 
            className="glass-card"
            style={{ 
              padding: '1.5rem 1.7rem', 
              borderRadius: '16px',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 189, 248, 0.12)',
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxSizing: 'border-box'
            }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.65rem', color: '#ffffff' }}>
              Why Global Businesses Choose A2Z
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.84rem', lineHeight: 1.55, marginBottom: '1rem' }}>
              From architectural strategy to production deployment, we engineer bespoke digital products that accelerate business growth and scale reliably.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { title: "Complete End-to-End Solutions", desc: "Full-stack development, mobile apps, database schemas, and DevOps." },
                { title: "Cutting-Edge Tech Stack", desc: "Next.js Turbopack, React Native, TypeScript, Tailwind, and AWS cloud." },
                { title: "Rapid Agile Delivery", desc: "Fast-paced bi-weekly sprints with transparent milestones." },
                { title: "Enterprise-Grade Reliability", desc: "99.9% uptime SLAs, SOC-2 security, and automated CI/CD." }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer' }}
                >
                  <CheckCircle2 size={16} color="#00f5d4" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700, display: 'block', marginBottom: '0.1rem' }}>{item.title}</span>
                    <span style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.4 }}>{item.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>

      {/* Centered Mission and Vision Card with Dynamic Hover */}
      <motion.div
        className="glass-card"
        style={{ maxWidth: '1000px', margin: '5rem auto 0 auto', padding: '3rem 3.5rem', display: 'flex', gap: '3.5rem', flexWrap: 'wrap', textAlign: 'center', cursor: 'default' }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ 
          y: -4, 
          borderColor: 'rgba(56, 189, 248, 0.35)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 189, 248, 0.15)'
        }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.8rem', color: '#ffffff' }}>Our Mission</h3>
          <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#94a3b8' }}>
            To empower forward-thinking businesses with scalable, high-performance web and mobile software that streamlines operations, elevates user experiences, and maximizes ROI.
          </p>
        </div>
        
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.12)', display: 'block' }}></div>

        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>Our Vision</h3>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            To be a trusted global software partner recognized for excellence, innovation, and trust – delivering value and transforming businesses across the globe.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
