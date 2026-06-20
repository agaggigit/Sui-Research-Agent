"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SilentModeBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: "spring", damping: 20 }}
      style={{
        background: "rgba(74,124,111,0.08)",
        borderBottom: "1px solid rgba(74,124,111,0.2)",
        padding: "0.5rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: '"Inter", sans-serif',
        fontSize: "0.82rem",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--zen-accent)",
        }}
      >
        🔕 <strong>Silent Mode aktif</strong>
        <span style={{ color: "var(--zen-muted)", fontWeight: 400 }}>
          — semua notifikasi disembunyikan berdasarkan preferensimu dari Walrus
        </span>
      </span>
      <button
        onClick={() => setVisible(false)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--zen-muted)",
          fontSize: "1rem",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </motion.div>
  );
}
