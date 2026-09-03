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
            style={{ flex: '1 1 350px', padding: '2rem' }}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>First Name</label>
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.6)', outline: 'none', backgroundColor: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', backdropFilter: 'blur(10px)' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Last Name</label>
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.6)', outline: 'none', backgroundColor: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', backdropFilter: 'blur(10px)' }} 
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Corporate Email</label>
                <input 
                  type="email" 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.6)', outline: 'none', backgroundColor: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', backdropFilter: 'blur(10px)' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Project Details</label>
                <textarea 
                  rows={4}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.6)', outline: 'none', resize: 'vertical', backgroundColor: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', backdropFilter: 'blur(10px)' }} 
                ></textarea>
              </div>
              <button className="btn-primary" type="button" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem', fontSize: '0.95rem' }}>Submit Inquiry</button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Professional Multi-Column Footer */}
      <footer style={{ marginTop: '4rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2rem', paddingBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', padding: '0 2rem', marginBottom: '2rem' }}>
          
          {/* Brand Column */}
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              A2Z <span style={{ color: 'var(--lilac-dark)' }}>Solutions</span>
            </div>
          </div>

          {/* Company Links (Horizontal) */}
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1.5rem', fontWeight: 600, alignItems: 'center' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--lilac-dark)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Company</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--lilac-dark)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Career</span>
            <a href="/login" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--lilac-dark)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Portal Login</a>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--lilac-dark)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Privacy Policy</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--lilac-dark)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Terms of Service</span>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem 2rem 0 2rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontWeight: 500 }}>
            © {new Date().getFullYear()} A2Z Software Solutions. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 600 }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--lilac-dark)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>LinkedIn</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--lilac-dark)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Twitter</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--lilac-dark)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>GitHub</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
