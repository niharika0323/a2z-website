"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" style={{ padding: '4rem 2rem', position: 'relative', zIndex: 10, background: 'transparent' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ display: 'inline-block', color: 'var(--lilac-dark)', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', fontSize: '0.9rem' }}
          >
            Get In Touch
          </motion.div>
          <motion.h2 
            style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Start Your Project
          </motion.h2>
          <motion.p 
            style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Let's discuss how we can scale your software infrastructure.
          </motion.p>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
          
          {/* Left Card: Text & Lottie & Details */}
          <motion.div 
            className="glass-card"
            style={{ flex: '1 1 300px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Ready to turn your vision into reality? Our experts are here to provide the perfect software solution.
            </p>



            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📧</span> a2zsoftwaressolutions@gmail.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📞</span> +91 90158 21469
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📍</span> Gurugram, Haryana
              </div>
            </div>
          </motion.div>

          {/* Right Card: Form */}
          <motion.div 
            className="glass-card"
            style={{ flex: '1 1 360px', padding: '2.2rem', borderRadius: '18px' }}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.3px' }}>First Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rahul"
                    className="contact-input"
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 0.9rem', 
                      borderRadius: '10px', 
                      border: '1px solid rgba(255,255,255,0.16)', 
                      outline: 'none', 
                      backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                      color: '#ffffff',
                      fontSize: '0.88rem', 
                      backdropFilter: 'blur(10px)',
                      transition: 'border-color 0.25s, box-shadow 0.25s'
                    }} 
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00f5d4';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 245, 212, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.3px' }}>Last Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sharma"
                    className="contact-input"
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 0.9rem', 
                      borderRadius: '10px', 
                      border: '1px solid rgba(255,255,255,0.16)', 
                      outline: 'none', 
                      backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                      color: '#ffffff',
                      fontSize: '0.88rem', 
                      backdropFilter: 'blur(10px)',
                      transition: 'border-color 0.25s, box-shadow 0.25s'
                    }} 
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00f5d4';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 245, 212, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.3px' }}>Corporate Email</label>
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  className="contact-input"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 0.9rem', 
                    borderRadius: '10px', 
                    border: '1px solid rgba(255,255,255,0.16)', 
                    outline: 'none', 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                    color: '#ffffff',
                    fontSize: '0.88rem', 
                    backdropFilter: 'blur(10px)',
                    transition: 'border-color 0.25s, box-shadow 0.25s'
                  }} 
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#00f5d4';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 245, 212, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.3px' }}>Project Details</label>
                <textarea 
                  rows={4}
                  placeholder="Tell us about your verification or software project requirements..."
                  className="contact-input"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 0.9rem', 
                    borderRadius: '10px', 
                    border: '1px solid rgba(255,255,255,0.16)', 
                    outline: 'none', 
                    resize: 'vertical', 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                    color: '#ffffff',
                    fontSize: '0.88rem', 
                    backdropFilter: 'blur(10px)',
                    lineHeight: 1.6,
                    transition: 'border-color 0.25s, box-shadow 0.25s'
                  }} 
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#00f5d4';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 245, 212, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                ></textarea>
              </div>

              {/* High-Tech Cyan & Emerald Glowing Action Button */}
              <button 
                type="button" 
                style={{ 
                  width: '100%', 
                  marginTop: '0.4rem', 
                  padding: '0.88rem', 
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 245, 212, 0.6)',
                  background: 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)',
                  color: '#070a10',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0, 245, 212, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 245, 212, 0.6)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #38bdf8 0%, #00f5d4 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 245, 212, 0.4)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)';
                }}
              >
                Submit Inquiry
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Professional Multi-Column Footer in Dark Theme */}
      <footer style={{ marginTop: '5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2.5rem', paddingBottom: '1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', padding: '0 1rem', marginBottom: '2rem' }}>
          
          {/* Brand Column */}
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
              A2Z <span style={{ color: '#38bdf8' }}>Solutions</span>
            </div>
          </div>

          {/* Company Links (Horizontal) */}
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1.5rem', fontWeight: 600, alignItems: 'center' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>Company</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>Career</span>
            <a href="/login" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>Portal Login</a>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>Privacy Policy</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>Terms of Service</span>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem 1rem 0 1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontWeight: 500, color: '#64748b', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} A2Z Software Solutions. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 600, color: '#94a3b8' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>LinkedIn</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>Twitter</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>GitHub</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
