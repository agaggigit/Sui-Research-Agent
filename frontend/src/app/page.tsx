"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "var(--void)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient bg */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 70%, rgba(196,121,58,0.07) 0%, transparent 55%),
            radial-gradient(ellipse at 70% 30%, rgba(0,196,180,0.05) 0%, transparent 55%)
          `,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", maxWidth: 640, position: "relative" }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.3rem 0.9rem",
            background: "var(--walrus-teal-dim)",
            border: "1px solid var(--walrus-teal)",
            borderRadius: "2px",
            marginBottom: "1.5rem",
            fontSize: "0.78rem",
            color: "var(--walrus-teal)",
            fontFamily: '"Inter", sans-serif',
            letterSpacing: "0.06em",
          }}
        >
          🌊 Sui Overflow 2026 · Walrus Track
        </motion.div>

        <h1
          className="animate-flicker"
          style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
            color: "var(--gold)",
            letterSpacing: "0.08em",
            marginBottom: "0.75rem",
            lineHeight: 1.2,
          }}
        >
          AURA
        </h1>
        <p
          style={{
            fontFamily: '"Crimson Text", serif',
            fontSize: "1.15rem",
            color: "var(--bone)",
            marginBottom: "0.5rem",
            fontStyle: "italic",
          }}
        >
          The Portable AI Soul
        </p>
        <p
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: "0.88rem",
            color: "var(--ash)",
            marginBottom: "3rem",
            lineHeight: 1.7,
            maxWidth: 480,
            margin: "0 auto 3rem",
          }}
        >
          Memori AI yang tidak terikat pada satu aplikasi. Simpan ke Walrus, bawa ke mana saja.
        </p>

        {/* App cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {/* Tavern */}
          <Link href="/tavern" style={{ textDecoration: "none" }}>
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: "var(--shadow-ember)" }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: "1.75rem 1.25rem",
                background: "var(--void-card)",
                border: "1px solid var(--void-border)",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "var(--ember-dim)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "var(--void-border)")
              }
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🍺</div>
              <h2
                style={{
                  fontFamily: '"Cinzel", serif',
                  color: "var(--gold)",
                  fontSize: "1rem",
                  letterSpacing: "0.08em",
                  marginBottom: "0.5rem",
                }}
              >
                Tavern Chat
              </h2>
              <p
                style={{
                  fontFamily: '"Inter", sans-serif',
                  color: "var(--ash)",
                  fontSize: "0.8rem",
                  lineHeight: 1.6,
                }}
              >
                App A · Ingestion Engine
                <br />
                Bicara, dan AI akan menyimpan memorimu ke Walrus
              </p>
            </motion.div>
          </Link>

          {/* Zen Board */}
          <Link href="/zenboard" style={{ textDecoration: "none" }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: "1.75rem 1.25rem",
                background: "var(--zen-surface)",
                border: "1px solid var(--zen-border)",
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🪴</div>
              <h2
                style={{
                  fontFamily: '"Inter", sans-serif',
                  color: "var(--zen-text)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                Zen Board
              </h2>
              <p
                style={{
                  fontFamily: '"Inter", sans-serif',
                  color: "var(--zen-muted)",
                  fontSize: "0.8rem",
                  lineHeight: 1.6,
                }}
              >
                App B · Cross-Agent Recall
                <br />
                Tarik memori dari Walrus, dapatkan pengalaman personal
              </p>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
