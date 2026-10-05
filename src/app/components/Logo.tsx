"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export default function Logo({ size = "md", showTagline = false }: LogoProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const width = isSm ? 120 : isLg ? 200 : 160;
  const height = isSm ? 45 : isLg ? 75 : 60;

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", textDecoration: "none" }}>
      <Image
        src="/a2z_logo.webp"
        alt="A2Z Softwares Solutions"
        width={width}
        height={height}
        style={{ objectFit: "contain", flexShrink: 0 }}
        priority
      />
      {showTagline && (
        <span
          style={{
            fontSize: "0.68rem",
            fontWeight: 700,
            color: "#38bdf8",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginTop: "4px",
            paddingLeft: "4px"
          }}
        >
          Enterprise Solutions Platform
        </span>
      )}
    </div>
  );
}
