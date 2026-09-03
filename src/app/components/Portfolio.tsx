"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
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
      // easeOutExpo for natural smooth finish
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

export default function Portfolio() {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(dashboardRef, { once: false, amount: 0.25 });

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
    <section id="portfolio" className="section" style={{ background: 'transparent', padding: '5rem 1.5rem', position: 'relative' }}>
      
      {/* Section Header */}
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
            padding: '0.4rem 1.3rem', 
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
          <Sparkles size={14} color="#38bdf8" /> Product Console
        </motion.div>
        
        <motion.h2 
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em', lineHeight: 1.2 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Enterprise <span className="text-gradient">BGV Operations Platform</span>
        </motion.h2>

        <motion.p
          style={{ maxWidth: '680px', margin: '0.8rem auto 0 auto', color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.7 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          High-security background verification and forensic investigation suite with real-time turnaround monitoring and automated e-Courts checks.
        </motion.p>
      </div>

      {/* COMPACT DASHBOARD CARD (Dynamic Animations on Scroll) */}
      <motion.div 
        ref={dashboardRef}
        className="glass-card"
        style={{ 
          maxWidth: '980px', 
          margin: '0 auto 4rem auto', 
          padding: '1rem',
          background: 'rgba(16, 24, 40, 0.82)',
          backdropFilter: 'blur(32px)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65), 0 0 35px rgba(56, 189, 248, 0.15)',
          borderRadius: '20px'
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.7 }}
      >
        {/* Window Top Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.8rem 0.8rem 0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f56', boxShadow: '0 0 6px #ff5f56' }} />
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ffbd2e', boxShadow: '0 0 6px #ffbd2e' }} />
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#27c93f', boxShadow: '0 0 6px #27c93f' }} />
            <span style={{ marginLeft: '0.7rem', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.3px' }}>
              A2Z BGV Operations Console
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.74rem', fontWeight: 700, color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.75rem', borderRadius: '20px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            Engine Active
          </div>
        </div>

        {/* Dashboard Canvas: Left Sidebar + Main Area */}
        <div style={{ display: 'flex', marginTop: '0.8rem', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
          
          {/* Left Purple Sidebar (Compact) */}
          <div style={{ 
            width: '195px', 
            background: 'linear-gradient(180deg, #583d80 0%, #321c52 100%)', 
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
                  <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #B497D6, #ffffff)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                    <ShieldCheck size={17} color="#583d80" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
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
                        cursor: 'pointer',
                        transition: 'background 0.2s'
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
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', background: '#fff', padding: '0.25rem 0.7rem', borderRadius: '15px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                Admin Portal
              </div>
            </div>

            {/* Top 3 Cards Row (Compact with Dynamic Animations) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.9rem', marginBottom: '1.2rem' }}>
              
              {/* Overall Checks Status with Dynamic Donut & Counter */}
              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '0.9rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.6rem' }}>
                  Overall Checks Status
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '0.6rem' }}>
                  <div style={{ width: '72px', height: '72px' }}>
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      {/* Checks Closed 68% */}
                      <motion.circle 
                        cx="18" cy="18" r="15.915" 
                        fill="transparent" 
                        stroke="#facc15" 
                        strokeWidth="8" 
                        strokeDasharray="68 32" 
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: isInView ? 0 : 100 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                      {/* In-Progress 24% */}
                      <motion.circle 
                        cx="18" cy="18" r="15.915" 
                        fill="transparent" 
                        stroke="#fb923c" 
                        strokeWidth="8" 
                        strokeDasharray="24 76" 
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: isInView ? -68 : 100 }}
                        transition={{ duration: 1.2, delay: 0.15, ease: "easeOut" }}
                      />
                      {/* Insufficiency 8% */}
                      <motion.circle 
                        cx="18" cy="18" r="15.915" 
                        fill="transparent" 
                        stroke="#f472b6" 
                        strokeWidth="8" 
                        strokeDasharray="8 92" 
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: isInView ? -92 : 100 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                      />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.68rem', fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#854d0e' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#facc15' }} /> 
                      Checks Closed (<AnimatedCounter target={68} suffix="%" inView={isInView} />)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#9a3412' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#fb923c' }} /> 
                      In-Progress (<AnimatedCounter target={24} suffix="%" inView={isInView} />)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#9d174d' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#f472b6' }} /> 
                      Insufficiency (<AnimatedCounter target={8} suffix="%" inView={isInView} />)
                    </div>
                  </div>
                </div>
              </div>

              {/* Turn-Around Time (TAT) Status with Animated Ring & Center Count */}
              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '0.9rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.6rem' }}>
                  Turn-Around Time (TAT) Status
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '0.6rem' }}>
                  <div style={{ width: '72px', height: '72px', position: 'relative' }}>
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#1e3a8a" strokeWidth="6" strokeDasharray="18 82" strokeDashoffset="0" />
                      <motion.circle 
                        cx="18" cy="18" r="14" 
                        fill="transparent" 
                        stroke="#38bdf8" 
                        strokeWidth="6" 
                        strokeDasharray="82 18" 
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: isInView ? -18 : 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, color: '#1e3a8a' }}>
                      <AnimatedCounter target={82} suffix="%" inView={isInView} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.68rem', fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#0369a1' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#38bdf8' }} /> 
                      In-TAT (<AnimatedCounter target={82} suffix="%" inView={isInView} />)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#1e3a8a' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#1e3a8a' }} /> 
                      Out-TAT (<AnimatedCounter target={18} suffix="%" inView={isInView} />)
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '0.9rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.4rem' }}>
                  Quick Actions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <button style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '0.45rem 0.7rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', cursor: 'pointer', boxShadow: '0 2px 5px rgba(22, 163, 74, 0.3)' }}>
                    <UserPlus size={12} /> Invite BGV Team Member
                  </button>
                  <button style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '0.45rem 0.7rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', cursor: 'pointer', boxShadow: '0 2px 5px rgba(2, 132, 199, 0.3)' }}>
                    <UserCheck size={12} /> Invite New Manager
                  </button>
                </div>
              </div>

            </div>

            {/* Month-wise Business Calculation ($) - Dynamic Animated Rising Bars */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.2rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1e293b' }}>
                  Month-wise Business Calculation ($)
                </div>
                {hoveredMonth && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284c7', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                    {hoveredMonth}: {monthlyData.find(m => m.month === hoveredMonth)?.amount}
                  </span>
                )}
              </div>

              {/* Exact Chart with Y-Axis Values, Horizontal Gridlines, and Rising Animated Bars */}
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

                {/* Chart Grid & Dynamic Rising Bars */}
                <div style={{ flex: 1, position: 'relative', borderLeft: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                  
                  {/* 6 Horizontal Gridlines */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} style={{ borderTop: '1px solid #f1f5f9', width: '100%', height: 0 }} />
                    ))}
                  </div>

                  {/* Monthly Bars Growing Smoothly When In View */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '0 4px' }}>
                    {monthlyData.map((d, idx) => {
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
                            cursor: 'pointer',
                            position: 'relative'
                          }}
                        >
                          <motion.div
                            initial={{ height: "0%" }}
                            animate={{ height: isInView ? `${d.heightPct}%` : "0%" }}
                            transition={{ 
                              duration: 0.85, 
                              delay: idx * 0.05, 
                              ease: [0.16, 1, 0.3, 1] 
                            }}
                            style={{
                              width: '55%',
                              maxWidth: '32px',
                              minHeight: d.heightPct > 0 ? '4px' : '0px',
                              background: isHovered 
                                ? '#0284c7' 
                                : 'linear-gradient(180deg, #38bdf8 0%, #60a5fa 100%)',
                              borderRadius: '4px 4px 0 0',
                              boxShadow: isHovered 
                                ? '0 0 12px rgba(2, 132, 199, 0.7)' 
                                : '0 2px 6px rgba(96, 165, 250, 0.3)',
                              transition: 'background 0.2s ease, box-shadow 0.2s ease'
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
                      fontWeight: hoveredMonth === d.month ? 800 : 600,
                      transition: 'color 0.2s'
                    }}
                  >
                    {d.month}
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* Portal Access Link */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.4rem' }}>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.8rem', fontSize: '0.88rem' }}>
              Access Operational Portal <ExternalLink size={15} />
            </button>
          </Link>
        </div>
      </motion.div>

      {/* COMPACT BELOW CARDS (6 Forensic Verification Engines in Dark Glassmorphism) */}
      <div style={{ maxWidth: '980px', margin: '0 auto 2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Core Verification Engines
          </h3>
        </div>

        {/* Compact 3-column / responsive grid with dark futuristic cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
          {bgvPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="glass-card"
                style={{
                  padding: '1.3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.8rem',
                  borderRadius: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.6rem' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '10px', 
                      background: 'rgba(56, 189, 248, 0.15)', 
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}>
                      <Icon size={18} color="#38bdf8" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                        {pillar.title}
                      </h4>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8' }}>
                        {pillar.metric}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.6 }}>
                    {pillar.desc}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>
                  <CheckCircle2 size={14} color="#00f5d4" />
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
