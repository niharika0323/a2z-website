"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  GraduationCap, 
  Scale, 
  MapPin, 
  CheckCircle2, 
  Layers, 
  BarChart3, 
  UserPlus, 
  FileCheck, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Sparkles,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

export default function Portfolio() {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  // Exact Month-wise Business Calculation ($) sample data matching user's dashboard
  const yAxisTicks = ["120,000", "100,000", "80,000", "60,000", "40,000", "20,000", "0"];

  const monthlyData = [
    { month: "Jan", heightPct: 2, amount: "$1,800" },
    { month: "Feb", heightPct: 24, amount: "$29,000" },
    { month: "Mar", heightPct: 18, amount: "$21,500" },
    { month: "Apr", heightPct: 43, amount: "$52,000" },
    { month: "May", heightPct: 85, amount: "$102,600" },
    { month: "Jun", heightPct: 72, amount: "$86,400" },
    { month: "Jul", heightPct: 35, amount: "$42,100" },
    { month: "Aug", heightPct: 32, amount: "$38,000" },
    { month: "Sep", heightPct: 3, amount: "$2,400" },
    { month: "Oct", heightPct: 0, amount: "$0" },
    { month: "Nov", heightPct: 0, amount: "$0" },
    { month: "Dec", heightPct: 0, amount: "$0" },
  ];

  const bgvPillars = [
    {
      id: "identity",
      icon: UserCheck,
      title: "Identity & Biometric KYC",
      desc: "Instant API queries across Aadhaar (UIDAI), PAN (NSDL), Passport, and Voter ID with AI facial liveness detection.",
      metric: "99.8% Accuracy"
    },
    {
      id: "criminal",
      icon: Scale,
      title: "Criminal & Court Records",
      desc: "Forensic cross-referencing across 10,000+ District Courts, High Courts, and Supreme Court e-Courts registries.",
      metric: "750+ Districts"
    },
    {
      id: "employment",
      icon: Building2,
      title: "Employment & EPF Forensics",
      desc: "Direct EPFO / UAN database records verifying service periods, active employers, and salary slip integrity.",
      metric: "EPFO Cross-Check"
    },
    {
      id: "education",
      icon: GraduationCap,
      title: "Academic & Degree Validation",
      desc: "Roll-number and credential authentication across 1,200+ universities, state boards, and diploma blacklist repositories.",
      metric: "1,200+ Universities"
    },
    {
      id: "address",
      icon: MapPin,
      title: "Geo-Tagged Address Check",
      desc: "Digital GPS geo-fencing combined with ground officers capturing timestamped photographic proof of residency.",
      metric: "GPS Lat/Long Stamped"
    },
    {
      id: "sanctions",
      icon: ShieldCheck,
      title: "Global AML & Sanctions",
      desc: "Screening against Interpol Red Notices, OFAC, UN Sanctions, RBI Defaulters, and PEP registers.",
      metric: "50+ Watchlists"
    }
  ];

  return (
    <section id="portfolio" className="section" style={{ background: 'transparent', padding: '4rem 1.5rem' }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem',
            padding: '0.35rem 1.1rem', 
            backgroundColor: 'rgba(255,255,255,0.85)', 
            border: '1px solid rgba(180, 151, 214, 0.4)', 
            borderRadius: '50px', 
            color: 'var(--lilac-dark)', 
            fontWeight: 800, 
            letterSpacing: '1.2px', 
            textTransform: 'uppercase', 
            fontSize: '0.75rem',
            marginBottom: '0.8rem',
            boxShadow: '0 4px 15px rgba(180, 151, 214, 0.15)'
          }}
        >
          <Sparkles size={14} /> Product Console
        </motion.div>
        
        <motion.h2 
          style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.8rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', lineHeight: 1.2 }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Enterprise <span className="text-gradient">BGV Operations Platform</span>
        </motion.h2>

        <motion.p
          style={{ maxWidth: '640px', margin: '0.6rem auto 0 auto', color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6 }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          High-security background verification and forensic investigation suite with real-time turnaround monitoring and automated e-Courts checks.
        </motion.p>
      </div>

      {/* COMPACT DASHBOARD CARD (Scaled Down for Clean Layout) */}
      <motion.div 
        className="glass-card"
        style={{ 
          maxWidth: '960px', 
          margin: '0 auto 3.5rem auto', 
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.88)',
          border: '1px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 20px 50px rgba(122, 91, 156, 0.18)',
          borderRadius: '18px'
        }}
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.6 }}
      >
        {/* Window Top Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.8rem 0.7rem 0.8rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
            <span style={{ marginLeft: '0.6rem', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              A2Z BGV Operations Console
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontWeight: 700, color: '#1e7e34', background: '#e8f7ee', padding: '0.2rem 0.65rem', borderRadius: '20px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#28a745' }} />
            Engine Active
          </div>
        </div>

        {/* Dashboard Canvas: Left Sidebar + Main Area */}
        <div style={{ display: 'flex', marginTop: '0.8rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
          
          {/* Left Purple Sidebar (Compact) */}
          <div style={{ 
            width: '190px', 
            background: 'linear-gradient(180deg, #583d80 0%, #3a225c 100%)', 
            color: '#ffffff', 
            padding: '1.2rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <div>
              {/* Logo with Text in Sidebar */}
              <div style={{ padding: '0.3rem 0.5rem', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'linear-gradient(135deg, #B497D6, #ffffff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={16} color="#583d80" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '0.98rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
                      A2Z <span style={{ color: '#d8c4ee' }}>BGV</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Menu */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {[
                  { name: "Dashboard", icon: BarChart3, active: true },
                  { name: "BGV Team", icon: UserCheck, active: false },
                  { name: "Managers", icon: UserPlus, active: false },
                  { name: "Role Access", icon: ShieldCheck, active: false },
                  { name: "Checklists", icon: FileCheck, active: false },
                  { name: "Documents", icon: Layers, active: false },
                  { name: "Reports", icon: TrendingUp, active: false },
                  { name: "Settings", icon: Settings, active: false }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        padding: '0.5rem 0.7rem',
                        borderRadius: '8px',
                        fontSize: '0.74rem',
                        fontWeight: item.active ? 800 : 600,
                        background: item.active ? 'rgba(255,255,255,0.22)' : 'transparent',
                        color: item.active ? '#ffffff' : '#c8b4df',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon size={14} />
                      <span>{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c8b4df', fontSize: '0.72rem', fontWeight: 600 }}>
              <LogOut size={13} />
              <span>Sign Out</span>
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ flex: 1, background: '#f8fafc', padding: '1.2rem', overflowX: 'auto' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                  Admin Dashboard
                </h3>
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', background: '#fff', padding: '0.25rem 0.7rem', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                Admin Portal
              </div>
            </div>

            {/* Top 3 Cards Row (Compact) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.9rem', marginBottom: '1.2rem' }}>
              
              {/* Overall Checks Status */}
              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '0.9rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.6rem' }}>
                  Overall Checks Status
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '0.6rem' }}>
                  <div style={{ width: '70px', height: '70px' }}>
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#facc15" strokeWidth="8" strokeDasharray="68 32" strokeDashoffset="0" />
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#fb923c" strokeWidth="8" strokeDasharray="24 76" strokeDashoffset="-68" />
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f472b6" strokeWidth="8" strokeDasharray="8 92" strokeDashoffset="-92" />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.68rem', fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#854d0e' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#facc15' }} /> Checks Closed (68%)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#9a3412' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#fb923c' }} /> In-Progress (24%)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#9d174d' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#f472b6' }} /> Insufficiency (8%)
                    </div>
                  </div>
                </div>
              </div>

              {/* Turn-Around Time (TAT) Status */}
              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '0.9rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.6rem' }}>
                  Turn-Around Time (TAT) Status
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '0.6rem' }}>
                  <div style={{ width: '70px', height: '70px', position: 'relative' }}>
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#1e3a8a" strokeWidth="6" strokeDasharray="18 82" strokeDashoffset="0" />
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#38bdf8" strokeWidth="6" strokeDasharray="82 18" strokeDashoffset="-18" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, color: '#1e3a8a' }}>
                      82%
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.68rem', fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#0369a1' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#38bdf8' }} /> In-TAT (82%)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#1e3a8a' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#1e3a8a' }} /> Out-TAT (18%)
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '0.9rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.4rem' }}>
                  Quick Actions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <button style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0.45rem 0.7rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                    <UserPlus size={12} /> Invite BGV Team Member
                  </button>
                  <button style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '0.45rem 0.7rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                    <UserCheck size={12} /> Invite New Manager
                  </button>
                </div>
              </div>

            </div>

            {/* Month-wise Business Calculation ($) - Exact Graph Sample matching User Screenshot */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.2rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1e293b' }}>
                  Month-wise Business Calculation ($)
                </div>
                {hoveredMonth && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284c7', background: '#f0f9ff', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                    {hoveredMonth}: {monthlyData.find(m => m.month === hoveredMonth)?.amount}
                  </span>
                )}
              </div>

              {/* Exact Chart with Y-Axis Values and Horizontal Gridlines */}
              <div style={{ display: 'flex', height: '160px', position: 'relative' }}>
                {/* Left Y-Axis Values */}
                <div style={{ 
                  width: '52px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-end', 
                  paddingRight: '8px', 
                  fontSize: '0.66rem', 
                  color: '#94a3b8', 
                  fontWeight: 600,
                  userSelect: 'none'
                }}>
                  {yAxisTicks.map((tick, i) => (
                    <span key={i} style={{ lineHeight: 1 }}>{tick}</span>
                  ))}
                </div>

                {/* Chart Grid & Bars Area */}
                <div style={{ flex: 1, position: 'relative', borderLeft: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                  
                  {/* 6 Horizontal Gridlines */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} style={{ borderTop: '1px solid #f1f5f9', width: '100%', height: 0 }} />
                    ))}
                  </div>

                  {/* Monthly Bars matching user sample */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '0 4px' }}>
                    {monthlyData.map((d) => {
                      const isHovered = hoveredMonth === d.month;
                      return (
                        <div
                          key={d.month}
                          onMouseEnter={() => setHoveredMonth(d.month)}
                          onMouseLeave={() => setHoveredMonth(null)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            height: '100%',
                            justifyContent: 'flex-end',
                            flex: 1,
                            cursor: 'pointer'
                          }}
                        >
                          <div
                            style={{
                              width: '55%',
                              maxWidth: '32px',
                              height: `${d.heightPct}%`,
                              minHeight: d.heightPct > 0 ? '4px' : '0px',
                              background: isHovered ? '#0284c7' : '#60a5fa',
                              borderRadius: '4px 4px 0 0',
                              transition: 'all 0.2s ease'
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* X-Axis Month Labels */}
              <div style={{ display: 'flex', paddingLeft: '52px', marginTop: '6px' }}>
                {monthlyData.map((d) => (
                  <div 
                    key={d.month} 
                    style={{ 
                      flex: 1, 
                      textAlign: 'center', 
                      fontSize: '0.68rem', 
                      color: hoveredMonth === d.month ? '#0284c7' : '#64748b', 
                      fontWeight: hoveredMonth === d.month ? 800 : 600 
                    }}
                  >
                    {d.month}
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* Portal Access Link (No Demo Button!) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.2rem' }}>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.6rem', fontSize: '0.86rem' }}>
              Access Operational Portal <ExternalLink size={15} />
            </button>
          </Link>
        </div>
      </motion.div>

      {/* COMPACT BELOW CARDS (6 Forensic Verification Engines) */}
      <div style={{ maxWidth: '960px', margin: '0 auto 2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Core Verification Engines
          </h3>
        </div>

        {/* Compact 3-column / responsive grid with smaller cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {bgvPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="glass-card"
                style={{
                  padding: '1.1rem 1.2rem',
                  background: 'rgba(255,255,255,0.72)',
                  border: '1px solid rgba(255,255,255,0.95)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.6rem',
                  borderRadius: '14px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--lilac-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={17} color="var(--lilac-dark)" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                        {pillar.title}
                      </h4>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--lilac-dark)' }}>
                        {pillar.metric}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {pillar.desc}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  <CheckCircle2 size={13} color="var(--lilac-dark)" />
                  <span>Primary API Query</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
