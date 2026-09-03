"use client";

import { motion } from "framer-motion";
import { Code, Smartphone, Terminal, ShieldCheck, Wrench, Network } from "lucide-react";

const services = [
  { icon: Terminal, title: "Custom Software Development", desc: "We believe every business deserves a solution as unique as it is. Whether you need an CRM/ERP, enterprise level system or an operational portal, we architect bespoke software that aligns to your specific workflow and needs, not just for today..." },
  { icon: Code, title: "Web Application Development", desc: "From beautiful corporate websites to powerful web-based apps, we build custom web applications. We use technologies like React, Angular, Node.js, Next.js, Python for secure fast user-friendly platforms and dynamic web experiences that turn visitors into customers." },
  { icon: Smartphone, title: "Mobile App Development", desc: "Delivering end-to-end mobile app development for iOS and Android, we transform your ideas into reality. We make cross-platform frameworks and native app development focusing on seamless user experiences." },
  { icon: ShieldCheck, title: "Quality Assurance & Testing", desc: "We don't compromise on quality. Our rigorous QA process involves manual and automated testing of performance, usability, security and compatibility — making sure your software is flawless." },
  { icon: Wrench, title: "Maintenance & Support", desc: "Technology moves fast, and we make sure you stay ahead. We offer ongoing maintenance, troubleshooting, and updates to keep your systems secure and running smoothly at peak performance." },
  { icon: Network, title: "API Design & Integration", desc: "Seamless integration across your systems. We build secure, reliable APIs to connect your software with 3rd-party services — payment gateways, CRMs, ERPs or internal systems. We streamline workflows and connect apps to scale effortlessly." }
];

export default function Services() {
  return (
    <section id="services" className="section" style={{ background: 'transparent' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <motion.h2 
          style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Softwares Services
        </motion.h2>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {services.map((svc, i) => (
          <motion.div 
            key={i} 
            className="glass-card"
            style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            animate={{ y: [0, -10, 0] }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              duration: 0.6, 
              delay: (i % 3) * 0.1,
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }
            }}
          >
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '18px', 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 30px var(--accent-glow)'
            }}>
              <svc.icon size={28} color="var(--lilac-dark)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{svc.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{svc.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
