"use client";

import { motion } from "framer-motion";
import { MemoryProfile } from "@/types/zenboard";

export default function MemoryChips({ memory }: { memory: MemoryProfile }) {
  const chips = [
    { label: memory.occupation, icon: "💻" },
    { label: memory.emotionalState, icon: "😮‍💨" },
    { label: "Silent Mode", icon: "🔕" },
  ];

  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
      {chips.map((c, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.25rem 0.65rem",
            background: "rgba(0,196,180,0.08)",
            border: "1px solid rgba(0,196,180,0.25)",
            borderRadius: "999px",
            fontSize: "0.75rem",
            color: "var(--zen-text)",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          <span>{c.icon}</span>
          <span>{c.label}</span>
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.25rem 0.65rem",
          background: "rgba(0,196,180,0.05)",
          border: "1px dashed rgba(0,196,180,0.4)",
          borderRadius: "999px",
          fontSize: "0.72rem",
          color: "var(--walrus-teal)",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        🌊 Dimuat dari Walrus Network
      </motion.span>
    </div>
  );
}
