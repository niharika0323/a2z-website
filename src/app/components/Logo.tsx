"use client";

import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export default function Logo({ size = "md", showTagline = false }: LogoProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const iconSize = isSm ? 28 : isLg ? 44 : 36;
  const mainFontSize = isSm ? "1.15rem" : isLg ? "1.85rem" : "1.45rem";

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: isSm ? "0.6rem" : "0.8rem", textDecoration: "none" }}>
      {/* Sleek Gradient Hex-Shield Icon Mark */}
      <div
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          borderRadius: isSm ? "8px" : "12px",
          background: "linear-gradient(135deg, #7A5B9C 0%, #9b72cf 50%, #B497D6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 18px rgba(122, 91, 156, 0.35)",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Subtle glossy sheen */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "45%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
            borderRadius: "inherit"
          }}
        />
        {/* Geometric Shield & Verification Node SVG */}
        <svg
          width={iconSize * 0.58}
          height={iconSize * 0.58}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
          <span
            style={{
              fontSize: mainFontSize,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #7A5B9C, #9b72cf)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            A2Z
          </span>
          <span
            style={{
              fontSize: mainFontSize,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)"
            }}
          >
            Solutions
          </span>
        </div>

        {showTagline && (
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "var(--lilac-dark)",
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginTop: "-2px"
            }}
          >
            Enterprise BGV Platform
          </span>
        )}
      </div>
    </div>
  );
}
