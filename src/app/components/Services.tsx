"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  Smartphone, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  Server, 
  Layers, 
  ArrowRight,
  Database,
  CheckCircle2,
  Workflow
} from "lucide-react";

interface ServiceItem {
  id: string;
  icon: any;
  category: string;
  title: string;
  description: string;
  capabilities: string[];
  techStack: string[];
  impactMetric: string;
}

const enterpriseServices: ServiceItem[] = [
  {
    id: "web-engineering",
    icon: Globe,
    category: "Full-Stack Platforms",
    title: "Enterprise Web Applications",
    description: "Architecting high-throughput web systems, customer portals, and internal enterprise platforms engineered for lightning speed, resilience, and conversion.",
    capabilities: ["Serverless Next.js Architecture", "High-Concurrency UI/UX", "Enterprise Portals & CRMs", "Global CDN Distribution"],
    techStack: ["Next.js 16", "React 19", "TypeScript", "Node.js"],
    impactMetric: "Sub-Second Latency"
  },
  {
    id: "cloud-devops",
    icon: Server,
    category: "Infrastructure & SRE",
    title: "Cloud Engineering & DevOps",
    description: "Automated multi-cloud orchestration, containerization, and zero-downtime CI/CD deployment pipelines engineered to ensure uninterrupted uptime.",
    capabilities: ["Automated CI/CD Pipelines", "Container Orchestration", "24/7 SRE Monitoring", "Multi-Region Cloud Redundancy"],
    techStack: ["AWS", "Docker", "Kubernetes", "Terraform"],
    impactMetric: "99.99% Uptime SLA"
  },
  {
    id: "mobile-engineering",
    icon: Smartphone,
    category: "Mobile Solutions",
    title: "Mobile App Development",
    description: "End-to-end native and cross-platform iOS and Android mobile experiences featuring hardware-accelerated fluid touch interactions and offline data synchronization.",
    capabilities: ["Native iOS & Android Apps", "Biometric Authentication", "Offline-First Local Sync", "Real-Time Push Streams"],
    techStack: ["React Native", "Flutter", "Swift", "Kotlin"],
    impactMetric: "Cross-Platform Sync"
  },
  {
    id: "automation-ai",
    icon: Workflow,
    category: "Cognitive Systems",
    title: "AI & Workflow Automation",
    description: "Implementing algorithmic pipelines, automated document parsing, anomaly detection, and intelligent task routing that eliminate operational bottlenecks.",
    capabilities: ["Intelligent Document Parsing", "Cognitive Rule Engines", "Predictive Analytics", "Process Automation"],
    techStack: ["Python", "FastAPI", "Vector DBs", "OpenAI/LangChain"],
    impactMetric: "10x Operational Speed"
  },
  {
    id: "microservices-apis",
    icon: Terminal,
    category: "Backend & Systems",
    title: "High-Concurrency APIs",
    description: "Distributed microservice architectures and secure REST/GraphQL gateways connecting external payment providers, ERP systems, and internal data nodes seamlessly.",
    capabilities: ["Event-Driven Microservices", "OAuth2 & JWT Security Gateways", "Rate Limiting & Caching", "Webhook Management"],
    techStack: ["Node.js", "Go", "PostgreSQL", "Redis"],
    impactMetric: "Zero-Latency Message Queues"
  },
  {
    id: "security-bgv",
    icon: ShieldCheck,
    category: "Security & Compliance",
    title: "Quality & Verification Tech",
    description: "Enterprise software testing, automated regression suites, vulnerability penetration audits, and customized digital background verification (BGV) systems.",
    capabilities: ["Automated QA Pipelines", "Bank-Grade Encryption", "Role-Based Access Control", "Full Forensic Audit Trails"],
    techStack: ["Playwright", "Jest", "SQLite/LibSQL", "SOC 2 Protocols"],
    impactMetric: "Bank-Grade Security"
  }
];

export default function Services() {
  const [activeFilter, setActiveFilter] = useState("ALL");

  return (
    <section id="services" className="section" style={{ background: 'transparent', padding: '6rem 1.5rem' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
              backdropFilter: 'blur(16px)', 
              border: '1px solid rgba(56, 189, 248, 0.35)', 
              borderRadius: '50px', 
              color: '#38bdf8', 
              fontWeight: 800, 
              letterSpacing: '1.8px', 
              textTransform: 'uppercase', 
              fontSize: '0.82rem',
              marginBottom: '1rem'
            }}
          >
            <Cpu size={15} color="#38bdf8" /> Enterprise Technology Capabilities
          </motion.div>

          <motion.h2 
            style={{ 
              fontSize: 'clamp(2.25rem, 4.2vw, 3.4rem)', 
              fontWeight: 800, 
              color: '#ffffff', 
              letterSpacing: '-0.025em',
              lineHeight: 1.2
            }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Comprehensive Digital & <span className="text-gradient">Software Services</span>
          </motion.h2>

          <motion.p
            style={{ maxWidth: '720px', margin: '0.7rem auto 0 auto', color: '#94a3b8', fontSize: '1.12rem', lineHeight: 1.75 }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We engineer end-to-end digital solutions tailored to complex business challenges, accelerating modernization from concept to enterprise scale.
          </motion.p>
        </div>
        
        {/* 6-Card Enterprise Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {enterpriseServices.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div 
                key={svc.id} 
                className="glass-card"
                style={{ 
                  padding: '1.9rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div>
                  {/* Category Pill & Impact Metric */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={24} color="#38bdf8" />
                    </div>

                    <span style={{ 
                      fontSize: '0.78rem', 
                      fontWeight: 800, 
                      color: '#00f5d4', 
                      background: 'rgba(0, 245, 212, 0.1)', 
                      border: '1px solid rgba(0, 245, 212, 0.3)', 
                      padding: '0.28rem 0.85rem', 
                      borderRadius: '20px',
                      letterSpacing: '0.3px'
                    }}>
                      {svc.impactMetric}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.35rem' }}>
                    {svc.category}
                  </div>

                  <h3 style={{ fontSize: '1.38rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.85rem', lineHeight: 1.3 }}>
                    {svc.title}
                  </h3>

                  <p style={{ color: '#94a3b8', fontSize: '0.96rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                    {svc.description}
                  </p>

                  {/* Core Capabilities Checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.5rem' }}>
                    {svc.capabilities.map((cap, capIdx) => (
                      <div key={capIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <CheckCircle2 size={15} color="#00f5d4" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 500 }}>
                          {cap}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Chips at bottom of card */}
                <div style={{ 
                  paddingTop: '1.1rem', 
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.6rem'
                }}>
                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                    {svc.techStack.map((tech, techIdx) => (
                      <span 
                        key={techIdx}
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: '#cbd5e1',
                          background: 'rgba(255, 255, 255, 0.06)',
                          padding: '0.22rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <a 
                    href="#contact" 
                    style={{ 
                      textDecoration: 'none', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.35rem', 
                      color: '#38bdf8', 
                      fontSize: '0.88rem', 
                      fontWeight: 700 
                    }}
                  >
                    Consult <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
