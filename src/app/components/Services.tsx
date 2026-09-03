"use client";

import { motion } from "framer-motion";
import { Code, Smartphone, Terminal, ShieldCheck, Wrench, Network, Cpu } from "lucide-react";

const services = [
  { 
    icon: Terminal, 
    title: "Custom Software Development", 
    desc: "Architecting bespoke enterprise software, CRMs, and operational portals aligned precisely to your workflow and scalability goals." 
  },
  { 
    icon: Code, 
    title: "Web Application Development", 
    desc: "High-throughput web applications engineered with Next.js, React, Node, and Python for robust, dynamic, and secure user experiences." 
  },
  { 
    icon: Smartphone, 
    title: "Mobile App Development", 
    desc: "End-to-end native & cross-platform iOS and Android applications with optimized performance and fluid touch interactions." 
  },
  { 
    icon: ShieldCheck, 
    title: "Quality Assurance & Testing", 
    desc: "Rigorous manual and automated testing covering security, load resilience, API integrity, and cross-browser reliability." 
  },
  { 
    icon: Wrench, 
    title: "Maintenance & DevOps Support", 
    desc: "24/7 ongoing systems monitoring, security patching, database optimization, and cloud infrastructure management." 
  },
  { 
    icon: Network, 
    title: "API Design & Systems Integration", 
    desc: "High-concurrency REST & GraphQL APIs connecting payment gateways, ERPs, and internal microservices seamlessly." 
  }
];

export default function Services() {
  return (
    <section id="services" className="section" style={{ background: 'transparent', padding: '5rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.4rem 1.2rem', 
            backgroundColor: 'rgba(16, 24, 40, 0.75)', 
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(56, 189, 248, 0.4)', 
            borderRadius: '50px', 
            color: '#38bdf8', 
            fontWeight: 800, 
            letterSpacing: '1.5px', 
            textTransform: 'uppercase', 
            fontSize: '0.78rem',
            marginBottom: '1rem',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
          }}
        >
          <Cpu size={14} color="#38bdf8" /> Engineering Capabilities
        </motion.div>

        <motion.h2 
          style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em' }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Our Software <span className="text-gradient">Services</span>
        </motion.h2>

        <motion.p
          style={{ maxWidth: '620px', margin: '0.6rem auto 0 auto', color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.6 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          End-to-end digital engineering and enterprise architecture designed to accelerate operational velocity.
        </motion.p>
      </div>
      
      {/* Compact 3-Column Grid with Smaller Refined Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.1rem', maxWidth: '1050px', margin: '0 auto' }}>
        {services.map((svc, i) => (
          <motion.div 
            key={i} 
            className="glass-card"
            style={{ 
              padding: '1.3rem 1.25rem', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              textAlign: 'left', 
              gap: '0.75rem',
              borderRadius: '16px'
            }}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ 
              duration: 0.5, 
              delay: (i % 3) * 0.08
            }}
          >
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(168, 85, 247, 0.2))',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              backdropFilter: 'blur(10px)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(56, 189, 248, 0.2)',
              flexShrink: 0
            }}>
              <svc.icon size={22} color="#38bdf8" />
            </div>

            <div>
              <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                {svc.title}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.84rem', lineHeight: 1.55 }}>
                {svc.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
