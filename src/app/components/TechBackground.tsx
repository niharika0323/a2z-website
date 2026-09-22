"use client";

import { useEffect, useRef } from "react";

export default function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle system for subtle floating cyber energy motes
    const particleCount = 35;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.6 + 0.25,
      hue: Math.random() > 0.4 ? 172 : 198 // Cyan (172) & Electric Sky (198)
    }));

    let t = 0;

    const render = () => {
      t += 0.025;
      ctx.clearRect(0, 0, width, height);

      // 1. Floating Cyber Spark Particles (Soft & Subdued)
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${p.opacity * (0.5 + 0.3 * Math.sin(t + i))})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `hsl(${p.hue}, 100%, 50%)`;
        ctx.fill();
      }

      // 2. Live Oscillating Sine Waves on Holographic Panel (Soft & Subtle)
      const waveStartX = width * 0.08;
      const waveStartY = height * 0.68;
      const waveWidth = Math.min(width * 0.25, 340);

      if (waveWidth > 80) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#00f5d4";

        // Primary Wave
        ctx.beginPath();
        for (let x = 0; x < waveWidth; x += 3) {
          const y = Math.sin(x * 0.035 + t * 1.5) * 14 + Math.cos(x * 0.015 - t) * 6;
          if (x === 0) ctx.moveTo(waveStartX + x, waveStartY + y);
          else ctx.lineTo(waveStartX + x, waveStartY + y);
        }
        ctx.strokeStyle = "rgba(0, 245, 212, 0.45)";
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Secondary Harmonic Wave (Sky Blue)
        ctx.beginPath();
        for (let x = 0; x < waveWidth; x += 3) {
          const y = Math.sin(x * 0.05 - t * 2) * 10 + Math.cos(x * 0.02 + t) * 5;
          if (x === 0) ctx.moveTo(waveStartX + x, waveStartY + y);
          else ctx.lineTo(waveStartX + x, waveStartY + y);
        }
        ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 3. Rotating Circular Radar Sweep HUD (Subtle)
      const radarCenterX = width * 0.24;
      const radarCenterY = height * 0.82;
      const radarRadius = Math.min(width * 0.06, 65);

      if (radarRadius > 30) {
        ctx.save();
        ctx.translate(radarCenterX, radarCenterY);

        // Outer Ring
        ctx.beginPath();
        ctx.arc(0, 0, radarRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Rotating Sweep Line
        const sweepAngle = t * 1.8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(sweepAngle) * radarRadius, Math.sin(sweepAngle) * radarRadius);
        ctx.strokeStyle = "rgba(0, 245, 212, 0.55)";
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#00f5d4";
        ctx.stroke();

        ctx.restore();
      }

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        backgroundColor: "#070a10"
      }}
    >
      <style>{`
        @keyframes laserHoloScan {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          15% {
            opacity: 0.45;
          }
          85% {
            opacity: 0.45;
          }
          100% {
            transform: translateY(1100px);
            opacity: 0;
          }
        }
      `}</style>

      {/* 1. Main HTML5 Background Video (Replaces previous background) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/bit_bg_poster.jpg"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: 0.75,
          zIndex: 0,
          filter: "contrast(1.2) brightness(1.08)"
        }}
      >
        <source src="/bit_bg.webm" type="video/webm" />
        <source src="/bit_bg.mp4" type="video/mp4" />
      </video>

      {/* 2. Real-Time High-DPI 60fps Animation Canvas (Oscillating Waves & Subtle Sparks) */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.7,
          zIndex: 1,
          pointerEvents: "none"
        }}
      />

      {/* 3. Sweeping Laser Hologram Scanline */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1.5px",
          background: "linear-gradient(90deg, transparent, #00f5d4 30%, #38bdf8 70%, transparent)",
          boxShadow: "0 0 12px #00f5d4",
          animation: "laserHoloScan 8.5s ease-in-out infinite",
          zIndex: 2,
          pointerEvents: "none"
        }}
      />

      {/* 4. Atmospheric Dark Cyber Vignette to ensure text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(7, 10, 16, 0.3) 0%, rgba(7, 10, 16, 0.7) 75%, #070a10 100%),
            linear-gradient(to bottom, rgba(7, 10, 16, 0.5) 0%, transparent 20%, transparent 80%, #070a10 100%)
          `,
          zIndex: 3,
          pointerEvents: "none"
        }}
      />
    </div>
  );
}
