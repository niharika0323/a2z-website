"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="section" style={{ background: 'transparent' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Headings positioned above the columns */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', padding: '0.4rem 1.2rem', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '50px', color: 'var(--lilac-dark)', fontWeight: 700, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            WHO WE ARE
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            About <span className="text-gradient">A2Z Softwares Solutions</span>
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '4rem', alignItems: 'stretch', flexWrap: 'wrap' }}>
          
          <motion.div 
            style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto 0 0' }}>
              <div dangerouslySetInnerHTML={{ __html: '<lottie-player src="https://assets3.lottiefiles.com/packages/lf20_qp1q7mct.json" background="transparent" speed="1" style="width: 100%; height: 300px;" loop autoplay></lottie-player>' }} />
            </div>

            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--text-secondary)', margin: 0 }}>
              From concept to execution, our team of passionate professionals delivers customized software, web, and mobile solutions tailored to meet unique business needs. We blend creativity with cutting-edge technology to build solutions that are scalable, secure, and future-ready.
            </p>
          </motion.div>
        
        <motion.div 
          className="glass-card"
          style={{ 
            flex: '1 1 400px', 
            padding: '2.5rem', 
            position: 'relative'
          }}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--text-primary)' }}>Why Choose Us?</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
            {[
              { title: "Complete Solutions", desc: "From initial strategy to final deployment and support." },
              { title: "Innovation First", desc: "Implementing the latest technology to keep you ahead." },
              { title: "Customer-Centric Approach", desc: "Your goals guide our solutions." },
              { title: "Quality & Reliability", desc: "Delivering robust, secure, performant, and safe solutions." }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <CheckCircle2 size={24} color="var(--lilac-dark)" style={{ flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>{item.title}</span>
                  <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      </div>

      {/* Centered Mission and Vision Card */}
      <motion.div
        className="glass-card"
        style={{ maxWidth: '1000px', margin: '5rem auto 0 auto', padding: '3rem 4rem', display: 'flex', gap: '4rem', flexWrap: 'wrap', textAlign: 'center' }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>Our Mission</h3>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            To empower businesses with intelligent, affordable, and innovative software that streamlines operations, enhances productivity and boosts their ROI.
          </p>
        </div>
        
        <div style={{ width: '1px', background: 'rgba(0,0,0,0.1)', display: 'block' }}></div>

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
