"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  BarChart3, 
  FileCheck, 
  Sparkles,
  ArrowRight,
  Clock3,
  Cpu,
  Lock,
  Activity,
  Zap,
  TrendingUp
} from "lucide-react";

// Dynamic Smooth Number Counter Component
function AnimatedCounter({ 
  target, 
  suffix = "", 
  prefix = "", 
  duration = 1.6,
  inView = true 
}: { 
  target: number; 
  suffix?: string; 
  prefix?: string; 
  duration?: number;
  inView?: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }

    let startTime: number | null = null;
    let animId: number;

    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = (now - startTime) / (duration * 1000);
      const progress = Math.min(elapsed, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [inView, target, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function Product() {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(dashboardRef, { once: false, amount: 0.25 });

  const monthlyData = [
    { month: "Jan", heightPct: 25, amount: "2,400 cases" },
    { month: "Feb", heightPct: 40, amount: "4,100 cases" },
    { month: "Mar", heightPct: 58, amount: "6,200 cases" },
    { month: "Apr", heightPct: 70, amount: "7,800 cases" },
    { month: "May", heightPct: 92, amount: "10,250 cases" },
    { month: "Jun", heightPct: 84, amount: "9,100 cases" },
    { month: "Jul", heightPct: 65, amount: "7,400 cases" },
    { month: "Aug", heightPct: 78, amount: "8,600 cases" },
    { month: "Sep", heightPct: 88, amount: "9,800 cases" },
    { month: "Oct", heightPct: 95, amount: "11,200 cases" },
    { month: "Nov", heightPct: 80, amount: "9,000 cases" },
    { month: "Dec", heightPct: 90, amount: "10,500 cases" },
  ];

  const productPillars = [
    {
      icon: Zap,
      title: "Automated Verification Engine",
      desc: "Instant multi-point checks spanning identity documents, court record databases, academic registries, and employment histories with algorithmic accuracy."
    },
    {
      icon: Activity,
      title: "Real-Time SLA & Workload Orchestration",
      desc: "Intelligent queue distribution assigning verification cases to available analysts based on priority deadlines, skill specializations, and real-time caseload."
    },
    {
      icon: Lock,
      title: "Zero-Trust Forensic Auditability",
      desc: "Every record mutation, analyst review note, and status change is cryptographically timestamped for compliance with global privacy regulations."
    },
    {
      icon: BarChart3,
      title: "Enterprise Throughput Analytics",
      desc: "Live visibility into turn-around times (TAT), daily verification rates, discrepancy flags, and team productivity through an intuitive command center."
    }
  ];

  return (
    <section id="product" className="section" style={{ background: 'transparent', padding: '6rem 1.5rem', position: 'relative' }}>
      
      {/* Section Header: Flagship Product Presentation */}
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
            border: '1px solid rgba(56, 189, 248, 0.4)', 
            borderRadius: '50px', 
            color: '#38bdf8', 
            fontWeight: 800, 
            letterSpacing: '1.8px', 
            textTransform: 'uppercase', 
            fontSize: '0.82rem',
            marginBottom: '1rem',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.25)'
          }}
        >
          <Sparkles size={15} color="#38bdf8" /> Flagship Proprietary Product
        </motion.div>
        
        <motion.h2 
          style={{ fontSize: 'clamp(2.25rem, 4.4vw, 3.5rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em', lineHeight: 1.2 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          A2Z Enterprise Suite: <span className="text-gradient">BGV Operations Platform</span>
        </motion.h2>

        <motion.p
          style={{ maxWidth: '780px', margin: '0.8rem auto 0 auto', color: '#94a3b8', fontSize: '1.14rem', lineHeight: 1.75 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Our proprietary enterprise-grade Background Verification (BGV) and operations workflow management platform — designed to automate document scrutiny, orchestrate complex verification pipelines, and enforce strict SLA compliance.
        </motion.p>
      </div>

      {/* Interactive Live Product Dashboard Console */}
      <motion.div 
        ref={dashboardRef}
        className="glass-card"
        style={{ 
          maxWidth: '1080px', 
          margin: '0 auto 4.5rem auto', 
          padding: '1.2rem',
          background: 'rgba(11, 16, 26, 0.85)',
          backdropFilter: 'blur(32px)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.15)',
          borderRadius: '20px'
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.7 }}
      >
        {/* Console Top Window Frame */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0.5rem 0.8rem 1rem 0.8rem', 
          borderBottom: '1px solid rgba(255,255,255,0.08)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ marginLeft: '0.8rem', fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.4px' }}>
              A2Z BGV Operations Console &bull; Live Preview
            </span>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            fontSize: '0.74rem', 
            fontWeight: 700, 
            color: '#00f5d4', 
            background: 'rgba(0, 245, 212, 0.12)', 
            border: '1px solid rgba(0, 245, 212, 0.3)', 
            padding: '0.25rem 0.85rem', 
            borderRadius: '20px' 
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00f5d4', boxShadow: '0 0 8px #00f5d4' }} />
            Engine Operational
          </div>
        </div>

        {/* 4 Quick Stat Summary Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', 
          gap: '0.85rem', 
          margin: '1.2rem 0' 
        }}>
          {[
            { label: "Total Cases Processed", value: 98450, prefix: "", suffix: "+", change: "+18% MoM", color: "#38bdf8" },
            { label: "Average SLA Turnaround", value: 1.6, prefix: "", suffix: "h", change: "99.8% On-Time", color: "#00f5d4" },
            { label: "Algorithmic Match Rate", value: 99.4, prefix: "", suffix: "%", change: "Bank Standard", color: "#a855f7" },
            { label: "Active Operations Queue", value: 142, prefix: "", suffix: "", change: "All SLA Green", color: "#34d399" }
          ].map((stat, idx) => (
            <div 
              key={idx}
              style={{
                background: 'rgba(16, 24, 40, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '0.9rem 1.1rem'
              }}
            >
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>{stat.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color, margin: '0.2rem 0' }}>
                {typeof stat.value === 'number' && Number.isInteger(stat.value) ? (
                  <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} inView={isInView} />
                ) : (
                  `${stat.prefix}${stat.value}${stat.suffix}`
                )}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 600 }}>{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Live Monthly Throughput Chart */}
        <div style={{
          background: 'rgba(16, 24, 40, 0.55)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '1.4rem',
          marginBottom: '1.2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                Verification Volume Throughput
              </h4>
              <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
                Automated monthly case processing volume
              </p>
            </div>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#38bdf8' }}>
              Fiscal Year 2026
            </div>
          </div>

          {/* Bar Chart Container */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'space-between', 
            height: '160px', 
            paddingTop: '1.5rem',
            gap: '0.5rem'
          }}>
            {monthlyData.map((item, i) => (
              <div 
                key={i} 
                style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  height: '100%', 
                  justifyContent: 'flex-end',
                  position: 'relative'
                }}
                onMouseEnter={() => setHoveredMonth(item.month)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {/* Tooltip on hover */}
                {hoveredMonth === item.month && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: -5 }}
                    style={{
                      position: 'absolute',
                      bottom: `${item.heightPct + 10}%`,
                      background: 'rgba(9, 13, 22, 0.95)',
                      border: '1px solid #00f5d4',
                      borderRadius: '6px',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#00f5d4',
                      whiteSpace: 'nowrap',
                      zIndex: 10,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                    }}
                  >
                    {item.amount}
                  </motion.div>
                )}

                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isInView ? `${item.heightPct}%` : '4%' }}
                  transition={{ duration: 0.8, delay: i * 0.04, ease: "easeOut" }}
                  style={{
                    width: '70%',
                    maxWidth: '36px',
                    borderRadius: '6px 6px 2px 2px',
                    background: hoveredMonth === item.month 
                      ? 'linear-gradient(180deg, #00f5d4 0%, #0284c7 100%)' 
                      : 'linear-gradient(180deg, #38bdf8 0%, #1e3a8a 100%)',
                    cursor: 'pointer',
                    boxShadow: hoveredMonth === item.month ? '0 0 15px rgba(0, 245, 212, 0.6)' : 'none',
                    transition: 'box-shadow 0.2s, background 0.2s'
                  }}
                />
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.6rem', fontWeight: 600 }}>
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Live Verification Queue Rows */}
        <div style={{
          background: 'rgba(16, 24, 40, 0.55)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '1.2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>
              Real-Time Verification Pipeline
            </span>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Auto-refreshed via WebSockets
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[
              { id: "BGV-9401", type: "Identity & Criminal Record Scrutiny", priority: "Urgent", sla: "1h 15m left", status: "In Progress", statusColor: "#38bdf8" },
              { id: "BGV-9402", type: "Forensic Education & Degree Verification", priority: "Normal", sla: "SLA Compliant", status: "Verified", statusColor: "#34d399" },
              { id: "BGV-9403", type: "Past Employment & Regulatory Check", priority: "High", sla: "Under Review", status: "Review", statusColor: "#f59e0b" },
              { id: "BGV-9404", type: "Global Sanction & PEP Database Check", priority: "Normal", sla: "Passed Automated Match", status: "Verified", statusColor: "#34d399" }
            ].map((row, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(9, 13, 22, 0.65)',
                  padding: '0.65rem 0.95rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.8rem',
                  gap: '0.75rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontWeight: 800, color: '#00f5d4' }}>{row.id}</span>
                  <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{row.type}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.74rem' }}>{row.sla}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    color: row.statusColor,
                    background: `${row.statusColor}18`,
                    border: `1px solid ${row.statusColor}44`
                  }}>
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 4 Architectural Product Capabilities */}
      <div style={{ 
        maxWidth: '1080px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.2rem' 
      }}>
        {productPillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              style={{
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Icon size={22} color="#38bdf8" />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
                {item.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
