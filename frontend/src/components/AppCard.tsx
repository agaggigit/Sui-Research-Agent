"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import GlassSurface from "@/components/GlassSurface-reactbits/GlassSurface";

interface AppCardProps {
  href: string;
  icon: string;
  title: string;
  badge: string;
  description: string;
  ctaLabel: string;
  ctaColor: string;
  titleColor: string;
  /** GlassSurface brightness (dark = ~40, light = ~120) */
  brightness?: number;
  /** GlassSurface opacity */
  opacity?: number;
}

export default function AppCard({
  href,
  icon,
  title,
  badge,
  description,
  ctaLabel,
  ctaColor,
  titleColor,
  brightness = 40,
  opacity = 0.9,
}: AppCardProps) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        style={{
          position: "relative",
          padding: "2rem",
          borderRadius: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={24}
          borderWidth={0.1}
          brightness={brightness}
          opacity={opacity}
          blur={20}
          distortionScale={0}
          backgroundOpacity={0.15}
          saturation={1.2}
          style={{ position: "absolute", inset: 0, transition: "all 0.3s" }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{icon}</div>
          <h2
            style={{
              fontFamily: '"Cinzel", serif',
              color: titleColor,
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              letterSpacing: "0.05em",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              color: "#cbd5e1",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              marginBottom: "1rem",
            }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <div
            style={{
              fontSize: "0.75rem",
              color: ctaColor,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {ctaLabel}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
