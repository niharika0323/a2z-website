"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Zap, Globe, Cpu, Layers } from "lucide-react";

export default function About() {
  const pillars = [
    {
      icon: CloudIcon,
      title: "Cloud Agility & Scalability",
      desc: "Architected on modern cloud infrastructure with automated elasticity, zero-downtime CI/CD, and multi-region deployment."
    },
    {
      icon: Zap,
      title: "High-Throughput Engineering",
      desc: "Sub-second database transactions, optimized Next.js server-side rendering, and low-latency microservices."
    },
    {
      icon: ShieldCheck,
      title: "Zero-Trust Security Architecture",
      desc: "Rigorous encryption at rest and in transit, multi-factor authentication, granular RBAC, and SOC 2 readiness."
    },
    {
      icon: Globe,
      title: "Global Delivery Excellence",
      desc: "Agile 2-week development sprints, transparent engineering velocity, and enterprise-grade SLA backing."
    }
  ];

  return (
    <section id="about" className="section" style={{ background: 'transparent', padding: '6rem 1.5rem' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.4rem 1.3rem', 
              backgroundColor: 'rgba(12, 16, 23, 0.85)', 
              border: '1px solid rgba(56, 189, 248, 0.35)', 
              borderRadius: '50px', 
              color: '#38bdf8', 
              fontWeight: 800, 
              marginBottom: '1rem', 
              fontSize: '0.82rem', 
              letterSpacing: '1.8px', 
              textTransform: 'uppercase' 
            }}
          >
            <Cpu size={15} color="#38bdf8" /> Who We Are &bull; Digital Transformation
          </motion.div>

          <motion.h2 
            style={{ 
              fontSize: 'clamp(2.25rem, 4.2vw, 3.4rem)', 
              fontWeight: 800, 
              color: '#ffffff', 
              lineHeight: 1.2, 
              letterSpacing: '-0.025em' 
            }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Pioneering Enterprise Software & <br />
            <span className="text-gradient">Next-Gen Digital Infrastructure</span>
          </motion.h2>

          <motion.p
            style={{ maxWidth: '750px', margin: '0.8rem auto 0 auto', color: '#94a3b8', fontSize: '1.12rem', lineHeight: 1.75 }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A2Z Software Solutions is an elite technology engineering agency. We bridge the gap between ambitious business vision and bulletproof digital reality through modern architecture, full-stack precision, and automated operations.
          </motion.p>
        </div>

        {/* 2-Column Content Showcase */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', alignItems: 'stretch', marginBottom: '3.5rem' }}>
          
          {/* Left Column: Visual Card with Live Operational Stat */}
          <motion.div 
            className="glass-card"
            style={{ 
              position: 'relative', 
              borderRadius: '20px', 
              overflow: 'hidden', 
              border: '1px solid rgba(56, 189, 248, 0.25)',
              minHeight: '380px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '2.4rem'
            }}
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ 
                display: 'inline-block', 
                padding: '0.35rem 0.9rem', 
                background: 'rgba(0, 245, 212, 0.12)', 
                border: '1px solid rgba(0, 245, 212, 0.35)', 
                borderRadius: '20px', 
                color: '#00f5d4', 
                fontSize: '0.78rem', 
                fontWeight: 800, 
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '1rem'
              }}>
                Engineering Discipline
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.3, marginBottom: '1rem' }}>
                Built for Scale. <br />Engineered for Reliability.
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: 1.7 }}>
                Our cross-functional teams engineer end-to-end applications designed to withstand demanding enterprise loads, safeguard critical operations, and deliver seamless digital experiences.
              </p>
            </div>

            {/* Metric Strip in Left Card */}
            <div style={{ 
              position: 'relative', 
              zIndex: 2, 
              marginTop: '2rem',
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#00f5d4', lineHeight: 1 }}>
                  100+
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.35rem', fontWeight: 600 }}>
                  Shipped Software Releases
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8', lineHeight: 1 }}>
                  99.98%
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.35rem', fontWeight: 600 }}>
                  Deployment Accuracy
                </div>
              </div>
            </div>
          </motion.div>
        
          {/* Right Column: 4 Strategic Enterprise Pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  className="glass-card"
                  initial={{ opacity: 0, x: 25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  style={{
                    padding: '1.45rem 1.6rem',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.2rem',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={22} color="#38bdf8" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.14rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
                      {pillar.title}
                    </h4>
                    <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                      {pillar.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mission & Vision Enterprise Banner */}
        <motion.div
          className="glass-card"
          style={{ 
            padding: '2.8rem 3.2rem', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2.5rem', 
            borderRadius: '20px',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f5d4' }} />
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Our Enterprise Mission</h3>
            </div>
            <p style={{ fontSize: '0.98rem', lineHeight: '1.75', color: '#94a3b8', margin: 0 }}>
              To engineer mission-critical digital systems and bespoke software architectures that accelerate organizational speed, protect business integrity, and deliver sustainable competitive advantage.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Our Technological Vision</h3>
            </div>
            <p style={{ fontSize: '0.98rem', lineHeight: '1.75', color: '#94a3b8', margin: 0 }}>
              To stand at the forefront of cloud-native development, algorithmic workflow automation, and verification technology — recognized for engineering perfection and uninterrupted business continuity.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function CloudIcon(props: { size?: number; color?: string }) {
  return <Layers size={props.size || 20} color={props.color || "#38bdf8"} />;
}
