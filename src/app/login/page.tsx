"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, ArrowRight, AlertCircle, ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent, customUser?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setError("");

    const targetUsername = customUser !== undefined ? customUser : username;
    const targetPassword = customPass !== undefined ? customPass : password;

    if (!targetUsername || !targetPassword) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: targetUsername, password: targetPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Please check credentials.");
        setLoading(false);
        return;
      }

      // Store authenticated user session
      localStorage.setItem("a2z_user", JSON.stringify(data.user));
      document.cookie = `a2z_role=${data.user.role}; path=/; max-age=86400`;

      // Unified Login: Route to distinct pages based on role
      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/employee");
      }
    } catch (err: unknown) {
      setError("Network or server error occurred. Please retry.");
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      position: 'relative',
      zIndex: 10,
      backgroundColor: '#070a10',
      backgroundImage: `
        radial-gradient(circle at 20% 20%, rgba(0, 245, 212, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.08) 0%, transparent 40%)
      `
    }}>
      {/* Top Navigation / Home Link */}
      <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <motion.button 
            whileHover={{ x: -4, borderColor: '#00f5d4' }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'rgba(16, 24, 40, 0.85)', 
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '0.6rem 1.2rem',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
          >
            <ArrowLeft size={16} color="#00f5d4" /> Back to Home
          </motion.button>
        </Link>
      </div>

      {/* Transparent Dark Glassmorphism Login Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ 
          width: '100%', 
          maxWidth: '460px', 
          padding: '2.8rem 2.4rem',
          background: 'rgba(16, 24, 40, 0.72)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 245, 212, 0.12)',
          boxSizing: 'border-box'
        }}
      >
        {/* Brand & Security Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1.2rem', display: 'flex', justifyContent: 'center' }}>
            <Logo size="md" showTagline={true} />
          </div>

          <div style={{ 
            display: 'inline-block', 
            padding: '0.35rem 0.95rem', 
            background: 'rgba(56, 189, 248, 0.12)', 
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '20px', 
            color: '#38bdf8', 
            fontSize: '0.74rem', 
            fontWeight: 800, 
            letterSpacing: '1px',
            textTransform: 'uppercase', 
            marginBottom: '0.8rem'
          }}>
            Authorized Personnel Portal
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 0.4rem 0' }}>
            Unified Corporate Login
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
            Access your role-specific dashboard (Admin or Employee)
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              background: 'rgba(239, 68, 68, 0.15)', 
              border: '1px solid rgba(239, 68, 68, 0.4)', 
              color: '#f87171', 
              padding: '0.8rem 1rem', 
              borderRadius: '10px', 
              fontSize: '0.85rem', 
              marginBottom: '1.5rem' 
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0' }}>
              Username or Corporate Email
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#00f5d4" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }} />
              <input 
                type="text" 
                value={username}
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.85rem 1rem 0.85rem 2.8rem', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(56, 189, 248, 0.25)', 
                  background: 'rgba(7, 10, 16, 0.65)', 
                  color: '#ffffff', 
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }} 
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#00f5d4';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 245, 212, 0.25)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0' }}>
              Security Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} color="#00f5d4" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }} />
              <input 
                type="password" 
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.85rem 1rem 0.85rem 2.8rem', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(56, 189, 248, 0.25)', 
                  background: 'rgba(7, 10, 16, 0.65)', 
                  color: '#ffffff', 
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }} 
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#00f5d4';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 245, 212, 0.25)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <motion.button 
            type="submit" 
            disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: '0 6px 25px rgba(0, 245, 212, 0.45)' }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              width: '100%', 
              padding: '0.95rem', 
              marginTop: '0.8rem', 
              fontSize: '0.95rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)',
              color: '#070a10',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0, 245, 212, 0.35)',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? "Authenticating..." : (
              <>
                Sign In to Dashboard <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
