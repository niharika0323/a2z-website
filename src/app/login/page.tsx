"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Shield, User, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
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

      // Unified Login: Route to distinct pages based on role!
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

  const quickLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    handleLogin(undefined, user, pass);
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
      zIndex: 10
    }}>
      {/* Top Navigation / Home Link */}
      <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <motion.button 
            whileHover={{ x: -4 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'rgba(255,255,255,0.7)', 
              border: '1px solid rgba(0,0,0,0.08)',
              padding: '0.6rem 1.2rem',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Back to Home
          </motion.button>
        </Link>
      </div>

      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ 
          width: '100%', 
          maxWidth: '480px', 
          padding: '3rem 2.5rem',
          background: 'rgba(255,255,255,0.65)',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 25px 60px rgba(122, 91, 156, 0.18)'
        }}
      >
        {/* Brand & Security Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1.2rem', display: 'flex', justifyContent: 'center' }}>
            <Logo size="md" showTagline={true} />
          </div>

          <div style={{ 
            display: 'inline-block', 
            padding: '0.3rem 0.9rem', 
            background: 'rgba(180, 151, 214, 0.2)', 
            borderRadius: '20px', 
            color: 'var(--lilac-dark)', 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '0.6rem'
          }}>
            Authorized Personnel Portal
          </div>

          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Unified Corporate Login
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
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
              background: '#fde8e8', 
              border: '1px solid #f8b4b4', 
              color: '#c81e1e', 
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
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Username or Corporate Email
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--lilac-dark)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }} />
              <input 
                type="text" 
                value={username}
                placeholder="e.g. admin or alok"
                onChange={(e) => setUsername(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.9rem 1rem 0.9rem 2.8rem', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(0,0,0,0.1)', 
                  background: 'rgba(255,255,255,0.85)', 
                  color: 'var(--text-primary)', 
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Security Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} color="var(--lilac-dark)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }} />
              <input 
                type="password" 
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.9rem 1rem 0.9rem 2.8rem', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(0,0,0,0.1)', 
                  background: 'rgba(255,255,255,0.85)', 
                  color: 'var(--text-primary)', 
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ 
              width: '100%', 
              padding: '1rem', 
              marginTop: '0.8rem', 
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Authenticating..." : (
              <>
                Sign In to Dashboard <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Admin Credential Notice */}
        <div style={{ marginTop: '2rem', paddingTop: '1.4rem', borderTop: '1px solid rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(244, 238, 248, 0.85)', border: '1px solid rgba(180, 151, 214, 0.4)', padding: '0.45rem 1.1rem', borderRadius: '25px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 800, color: 'var(--lilac-dark)' }}>Admin Access:</span>
            <span>user: <strong style={{ color: 'var(--text-primary)' }}>admin</strong></span>
            <span>•</span>
            <span>pass: <strong style={{ color: 'var(--text-primary)' }}>admin</strong></span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
