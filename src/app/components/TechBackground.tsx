"use client";

import { useEffect, useRef } from "react";

export default function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Isometric 3D Projection Math
    const cos30 = Math.cos(Math.PI / 6); // 0.866
    const sin30 = Math.sin(Math.PI / 6); // 0.5

    const toScreen = (x: number, y: number, z: number, originX: number, originY: number) => {
      const sx = originX + (x - y) * cos30;
      const sy = originY + (x + y) * sin30 - z;
      return { x: sx, y: sy };
    };

    // Isometric Circuit Tracks
    interface IsoTrack {
      points: { x: number; y: number }[];
      color: string;
      pulse: number;
      pulseSpeed: number;
    }

    const tracks: IsoTrack[] = [];
    const colors = ["#00f5d4", "#38bdf8", "#d946ef", "#c084fc"];

    // Generate PCB traces in isometric grid
    const gridStep = 45;
    for (let i = 0; i < 35; i++) {
      let gx = (Math.random() - 0.5) * 22 * gridStep;
      let gy = (Math.random() - 0.5) * 22 * gridStep;
      const pts = [{ x: gx, y: gy }];
      const segments = 3 + Math.floor(Math.random() * 4);

      for (let s = 0; s < segments; s++) {
        const dir = Math.floor(Math.random() * 4);
        const len = (1 + Math.floor(Math.random() * 3)) * gridStep;
        if (dir === 0) gx += len;
        else if (dir === 1) gx -= len;
        else if (dir === 2) gy += len;
        else gy -= len;
        pts.push({ x: gx, y: gy });
      }

      tracks.push({
        points: pts,
        color: colors[i % colors.length],
        pulse: Math.random(),
        pulseSpeed: 0.003 + Math.random() * 0.004
      });
    }

    let time = 0;

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      // Deep obsidian futuristic backdrop
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        50,
        width * 0.5,
        height * 0.5,
        width * 0.85
      );
      bgGrad.addColorStop(0, "#131a29");
      bgGrad.addColorStop(0.5, "#0b0f19");
      bgGrad.addColorStop(1, "#070a10");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const originX = width * 0.48;
      const originY = height * 0.52;

      // 1. Draw Isometric PCB Circuit Grid Tracks
      for (const track of tracks) {
        ctx.beginPath();
        const p0 = toScreen(track.points[0].x, track.points[0].y, 0, originX, originY);
        ctx.moveTo(p0.x, p0.y);

        for (let i = 1; i < track.points.length; i++) {
          const pi = toScreen(track.points[i].x, track.points[i].y, 0, originX, originY);
          ctx.lineTo(pi.x, pi.y);
        }
        ctx.strokeStyle = "rgba(56, 189, 248, 0.14)";
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // Solder pad dots
        for (const pt of track.points) {
          const sp = toScreen(pt.x, pt.y, 0, originX, originY);
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(168, 85, 247, 0.35)";
          ctx.fill();
        }

        // Animated traveling electrical pulses
        track.pulse = (track.pulse + track.pulseSpeed) % 1;
        const totalSegs = track.points.length - 1;
        const progress = track.pulse * totalSegs;
        const segIdx = Math.floor(progress);
        const segT = progress - segIdx;

        if (track.points[segIdx] && track.points[segIdx + 1]) {
          const ptA = track.points[segIdx];
          const ptB = track.points[segIdx + 1];
          const curX = ptA.x + (ptB.x - ptA.x) * segT;
          const curY = ptA.y + (ptB.y - ptA.y) * segT;
          const pulseScr = toScreen(curX, curY, 0, originX, originY);

          ctx.beginPath();
          ctx.arc(pulseScr.x, pulseScr.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = track.color;
          ctx.shadowColor = track.color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Helper function to draw an isometric 3D box (chip or phone body)
      const drawIsoBox = (
        bx: number,
        by: number,
        bz: number,
        w: number,
        h: number,
        d: number,
        topColor: string,
        leftColor: string,
        rightColor: string,
        glowBorderColor?: string
      ) => {
        // Corners of top face
        const t1 = toScreen(bx, by, bz + d, originX, originY);
        const t2 = toScreen(bx + w, by, bz + d, originX, originY);
        const t3 = toScreen(bx + w, by + h, bz + d, originX, originY);
        const t4 = toScreen(bx, by + h, bz + d, originX, originY);

        // Bottom corners
        const b2 = toScreen(bx + w, by, bz, originX, originY);
        const b3 = toScreen(bx + w, by + h, bz, originX, originY);
        const b4 = toScreen(bx, by + h, bz, originX, originY);

        // Left Face
        ctx.beginPath();
        ctx.moveTo(t4.x, t4.y);
        ctx.lineTo(t3.x, t3.y);
        ctx.lineTo(b3.x, b3.y);
        ctx.lineTo(b4.x, b4.y);
        ctx.closePath();
        ctx.fillStyle = leftColor;
        ctx.fill();

        // Right Face
        ctx.beginPath();
        ctx.moveTo(t3.x, t3.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.lineTo(b2.x, b2.y);
        ctx.lineTo(b3.x, b3.y);
        ctx.closePath();
        ctx.fillStyle = rightColor;
        ctx.fill();

        // Top Face
        ctx.beginPath();
        ctx.moveTo(t1.x, t1.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.lineTo(t3.x, t3.y);
        ctx.lineTo(t4.x, t4.y);
        ctx.closePath();
        ctx.fillStyle = topColor;
        ctx.fill();

        if (glowBorderColor) {
          ctx.strokeStyle = glowBorderColor;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = glowBorderColor;
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        return { t1, t2, t3, t4 };
      };

      // 2. DEVICE 1: Isometric 3D Smartphone / Tablet (Center-Left)
      // Exactly matching the glowing cyan mobile device in user's image!
      const devX = -180;
      const devY = 40;
      const devW = 260;
      const devH = 150;
      const devThick = 24;

      // Outer phone chassis
      drawIsoBox(
        devX - 10,
        devY - 10,
        0,
        devW + 20,
        devH + 20,
        devThick,
        "#181829",
        "#111120",
        "#0c0c17",
        "#d946ef" // Magenta neon edge
      );

      // Glowing Cyan Screen
      const screenTop = drawIsoBox(
        devX,
        devY,
        devThick,
        devW,
        devH,
        4,
        "#00f5d4", // Electric cyan screen!
        "#00c4aa",
        "#00a892",
        "#00f5d4"
      );

      // Draw real-time UI data elements on phone screen
      // Animated pulse waveform line
      ctx.beginPath();
      const waveStart = toScreen(devX + 25, devY + devH * 0.65, devThick + 5, originX, originY);
      ctx.moveTo(waveStart.x, waveStart.y);
      for (let i = 1; i <= 8; i++) {
        const px = devX + 25 + i * 22;
        const waveOffset = Math.sin(time * 3 + i * 0.8) * 14;
        const py = devY + devH * 0.65 + waveOffset;
        const pScr = toScreen(px, py, devThick + 5, originX, originY);
        ctx.lineTo(pScr.x, pScr.y);
      }
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.2;
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Status indicator dots & mini circles on phone screen
      const dot1 = toScreen(devX + devW * 0.25, devY + devH * 0.35, devThick + 5, originX, originY);
      const dot2 = toScreen(devX + devW * 0.45, devY + devH * 0.35, devThick + 5, originX, originY);
      const dot3 = toScreen(devX + devW * 0.65, devY + devH * 0.35, devThick + 5, originX, originY);

      ctx.beginPath();
      ctx.arc(dot1.x, dot1.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#ff2a85"; // Magenta status dot
      ctx.fill();

      ctx.beginPath();
      ctx.arc(dot2.x, dot2.y, 9, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(dot2.x, dot2.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#38bdf8";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(dot3.x, dot3.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#a855f7";
      ctx.fill();

      // 3. DEVICE 2: Upright Holographic Glass HUD Screen Rising from Device
      // Exactly matching the holographic dashboard with bar charts in user's image!
      const hudBaseX = devX + 30;
      const hudBaseY = devY - 40;
      const hudW = 200;
      const hudH = 150;
      const hudElev = devThick + 25;

      // Bottom and top corners of upright holographic screen
      const hB1 = toScreen(hudBaseX, hudBaseY, hudElev, originX, originY);
      const hB2 = toScreen(hudBaseX + hudW, hudBaseY, hudElev, originX, originY);
      const hT2 = toScreen(hudBaseX + hudW, hudBaseY, hudElev + hudH, originX, originY);
      const hT1 = toScreen(hudBaseX, hudBaseY, hudElev + hudH, originX, originY);

      // Semi-transparent holographic glass surface
      ctx.beginPath();
      ctx.moveTo(hB1.x, hB1.y);
      ctx.lineTo(hB2.x, hB2.y);
      ctx.lineTo(hT2.x, hT2.y);
      ctx.lineTo(hT1.x, hT1.y);
      ctx.closePath();
      ctx.fillStyle = "rgba(12, 40, 60, 0.65)";
      ctx.fill();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Holographic Bar Chart Columns inside the upright HUD
      const barCount = 7;
      for (let b = 0; b < barCount; b++) {
        const barX = hudBaseX + 20 + b * 24;
        const baseBarH = [35, 65, 95, 45, 110, 80, 70][b];
        const barHeight = baseBarH + Math.sin(time * 2.5 + b) * 12;

        const pBot = toScreen(barX, hudBaseY, hudElev + 15, originX, originY);
        const pTop = toScreen(barX, hudBaseY, hudElev + 15 + barHeight, originX, originY);

        ctx.beginPath();
        ctx.moveTo(pBot.x, pBot.y);
        ctx.lineTo(pTop.x, pTop.y);
        ctx.strokeStyle = b % 2 === 0 ? "#00f5d4" : "#d946ef";
        ctx.lineWidth = 6;
        ctx.shadowColor = b % 2 === 0 ? "#00f5d4" : "#d946ef";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Circular Radar Dial in Holographic HUD
      const dialCenter = toScreen(hudBaseX + hudW - 35, hudBaseY, hudElev + hudH - 35, originX, originY);
      ctx.beginPath();
      ctx.arc(dialCenter.x, dialCenter.y, 14, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(217, 70, 239, 0.8)";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Rotating Radar Sweep Line
      const radarAngle = time * 3;
      ctx.beginPath();
      ctx.moveTo(dialCenter.x, dialCenter.y);
      ctx.lineTo(
        dialCenter.x + Math.cos(radarAngle) * 14,
        dialCenter.y + Math.sin(radarAngle) * 14
      );
      ctx.strokeStyle = "#00f5d4";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 4. DEVICE 3: Isometric Microprocessor Chip with Vertical Light Beam (Right side)
      // Exactly matching the glowing processor chip with light column in user's image!
      const chip1X = 140;
      const chip1Y = 30;
      const chipSize = 90;
      const chipThick = 20;

      // Base socket
      drawIsoBox(
        chip1X - 6,
        chip1Y - 6,
        0,
        chipSize + 12,
        chipSize + 12,
        chipThick,
        "#1a182e",
        "#121020",
        "#0c0a18",
        "#d946ef"
      );

      // Raised glowing CPU core
      drawIsoBox(
        chip1X,
        chip1Y,
        chipThick,
        chipSize,
        chipSize,
        6,
        "#8b5cf6",
        "#7c3aed",
        "#6d28d9",
        "#c084fc"
      );

      // Vertical Holographic Light Beam Column Shooting Upward from Chip
      const c1 = toScreen(chip1X + 10, chip1Y + 10, chipThick + 6, originX, originY);
      const c2 = toScreen(chip1X + chipSize - 10, chip1Y + 10, chipThick + 6, originX, originY);
      const c3 = toScreen(chip1X + chipSize - 10, chip1Y + chipSize - 10, chipThick + 6, originX, originY);
      const c4 = toScreen(chip1X + 10, chip1Y + chipSize - 10, chipThick + 6, originX, originY);

      const beamHeight = 160;
      const bT1 = toScreen(chip1X + 10, chip1Y + 10, chipThick + 6 + beamHeight, originX, originY);
      const bT2 = toScreen(chip1X + chipSize - 10, chip1Y + 10, chipThick + 6 + beamHeight, originX, originY);
      const bT3 = toScreen(chip1X + chipSize - 10, chip1Y + chipSize - 10, chipThick + 6 + beamHeight, originX, originY);
      const bT4 = toScreen(chip1X + 10, chip1Y + chipSize - 10, chipThick + 6 + beamHeight, originX, originY);

      // Translucent light pillar
      const beamGrad = ctx.createLinearGradient(c4.x, c4.y, bT4.x, bT4.y);
      beamGrad.addColorStop(0, "rgba(56, 189, 248, 0.35)");
      beamGrad.addColorStop(0.5, "rgba(217, 70, 239, 0.2)");
      beamGrad.addColorStop(1, "rgba(56, 189, 248, 0)");

      ctx.beginPath();
      ctx.moveTo(c1.x, c1.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.lineTo(bT2.x, bT2.y);
      ctx.lineTo(bT1.x, bT1.y);
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(c4.x, c4.y);
      ctx.lineTo(c3.x, c3.y);
      ctx.lineTo(bT3.x, bT3.y);
      ctx.lineTo(bT4.x, bT4.y);
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();

      // 5. DEVICE 4: Secondary Processor Module with Light Column (Top-Left)
      const chip2X = -320;
      const chip2Y = -120;
      const chip2Size = 80;
      const chip2Thick = 18;

      drawIsoBox(
        chip2X,
        chip2Y,
        0,
        chip2Size,
        chip2Size,
        chip2Thick,
        "#1e1b4b",
        "#17143b",
        "#0f0d2b",
        "#00f5d4"
      );

      drawIsoBox(
        chip2X + 6,
        chip2Y + 6,
        chip2Thick,
        chip2Size - 12,
        chip2Size - 12,
        5,
        "#0284c7",
        "#0369a1",
        "#075985",
        "#38bdf8"
      );

      // Top-left vertical beam
      const tb1 = toScreen(chip2X + 15, chip2Y + 15, chip2Thick + 5, originX, originY);
      const tb2 = toScreen(chip2X + chip2Size - 15, chip2Y + 15, chip2Thick + 5, originX, originY);
      const tbT2 = toScreen(chip2X + chip2Size - 15, chip2Y + 15, chip2Thick + 5 + 130, originX, originY);
      const tbT1 = toScreen(chip2X + 15, chip2Y + 15, chip2Thick + 5 + 130, originX, originY);

      const beamGrad2 = ctx.createLinearGradient(tb1.x, tb1.y, tbT1.x, tbT1.y);
      beamGrad2.addColorStop(0, "rgba(0, 245, 212, 0.35)");
      beamGrad2.addColorStop(1, "rgba(0, 245, 212, 0)");

      ctx.beginPath();
      ctx.moveTo(tb1.x, tb1.y);
      ctx.lineTo(tb2.x, tb2.y);
      ctx.lineTo(tbT2.x, tbT2.y);
      ctx.lineTo(tbT1.x, tbT1.y);
      ctx.closePath();
      ctx.fillStyle = beamGrad2;
      ctx.fill();

      // Ambient scanline overlay
      const scanY = ((time * 70) % (height + 100)) - 50;
      const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGrad.addColorStop(0, "rgba(0, 245, 212, 0)");
      scanGrad.addColorStop(0.5, "rgba(0, 245, 212, 0.08)");
      scanGrad.addColorStop(1, "rgba(0, 245, 212, 0)");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 30, width, 60);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
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
      {/* 100% Real-Time Isometric 3D Digital Technology Devices Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block"
        }}
      />

      {/* Cyber Contrast Gradient Vignette for Readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(9, 13, 22, 0.3) 0%, rgba(9, 13, 22, 0.75) 70%, #070a10 100%),
            linear-gradient(to bottom, rgba(9, 13, 22, 0.4) 0%, transparent 25%, rgba(9, 13, 22, 0.3) 65%, #070a10 98%)
          `,
          pointerEvents: "none"
        }}
      />
    </div>
  );
}
