"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface ZenHeaderProps {
  delegateKey: string;
  onAddTask: () => void;
}

export default function ZenHeader({ delegateKey, onAddTask }: ZenHeaderProps) {
  return (
    <>
      <header
        style={{
          padding: "1rem 2rem",
          borderBottom: "1px solid var(--zen-border)",
          background: "var(--zen-surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            href="/"
            style={{
              color: "var(--zen-muted)",
              textDecoration: "none",
              fontSize: "0.8rem",
              fontFamily: '"Inter", sans-serif',
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--zen-text)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--zen-muted)")
            }
          >
            ← Kembali
          </Link>
          <div style={{ width: 1, height: 16, background: "var(--zen-border)" }} />
          <span
            style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "var(--zen-text)",
            }}
          >
            🪴 Zen Board
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Walrus status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: '"Inter", sans-serif',
              fontSize: "0.75rem",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--walrus-teal)",
              }}
            />
            <span style={{ color: "var(--walrus-teal)" }}>Memory Loaded</span>
            <span style={{ color: "var(--zen-muted)" }}>
              · {delegateKey.slice(0, 6)}...{delegateKey.slice(-4)}
            </span>
          </div>

          <button
            title="Restore Memory Index dari Walrus"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.4rem 0.8rem",
              background: "transparent",
              border: "1px solid var(--zen-border)",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: '"Inter", sans-serif',
              fontSize: "0.75rem",
              color: "var(--zen-muted)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--walrus-teal)";
              (e.currentTarget as HTMLElement).style.color = "var(--walrus-teal)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--zen-border)";
              (e.currentTarget as HTMLElement).style.color = "var(--zen-muted)";
            }}
            onClick={() =>
              alert(
                "🌊 Restore Memory Index: Fitur ini akan membangun ulang indeks memori dari Walrus Network jika database lokal bermasalah."
              )
            }
          >
            🔄 Restore Memory
          </button>
        </div>
      </header>

      {/* Task Board sub-header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
        }}
      >
        <h2
          style={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            fontSize: "1rem",
            color: "var(--zen-text)",
          }}
        >
          Task Board
        </h2>
        <button
          onClick={onAddTask}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.45rem 0.9rem",
            background: "var(--zen-accent)",
            border: "none",
            borderRadius: "6px",
            color: "white",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            fontSize: "0.82rem",
            cursor: "pointer",
          }}
        >
          + Tambah Tugas
        </button>
      </div>
    </>
  );
}
