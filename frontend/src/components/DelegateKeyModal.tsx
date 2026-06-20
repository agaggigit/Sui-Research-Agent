"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DelegateKeyModalProps {
  theme: "dark" | "light";
  onConnect: (key: string) => void;
  /** Judul yang muncul di atas modal */
  title?: string;
  /** Subtitle / deskripsi */
  description?: string;
  /** Label tombol submit */
  submitLabel?: string;
  /** Ikon yang tampil di atas modal */
  icon?: string;
}

export default function DelegateKeyModal({
  theme,
  onConnect,
  title = "Masukkan Kunci Identitas",
  description = "Wallet Delegate Key diperlukan untuk mengakses aplikasi dan menyimpan memorimu ke jaringan Walrus.",
  submitLabel = "Sambungkan",
  icon = "🔑",
}: DelegateKeyModalProps) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isDark = theme === "dark";

  const handleConnect = async () => {
    if (key.trim().length < 8) {
      setError("Kunci terlalu pendek. Masukkan Delegate Key yang valid.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onConnect(key.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: isDark ? "rgba(10,8,6,0.92)" : "rgba(248,247,244,0.97)",
        backdropFilter: "blur(8px)",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", damping: 20 }}
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "2.5rem",
          borderRadius: isDark ? 0 : 12,
          background: isDark ? "var(--void-card, #1a1512)" : "#ffffff",
          border: isDark
            ? "1px solid var(--void-border, rgba(255,255,255,0.08))"
            : "1px solid #e5e2db",
          boxShadow: isDark
            ? "0 16px 48px rgba(0,0,0,0.6)"
            : "0 8px 48px rgba(0,0,0,0.08)",
          color: isDark ? "#e8e0cc" : "#2c2c2c",
        }}
      >
        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              height: 60,
              borderRadius: isDark ? "50%" : 12,
              background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,196,180,0.1)",
              border: isDark
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(0,196,180,0.25)",
              fontSize: "1.6rem",
              marginBottom: "1rem",
            }}
          >
            {icon}
          </div>

          <h2
            style={{
              fontFamily: isDark ? '"Cinzel", serif' : '"Inter", sans-serif',
              fontWeight: isDark ? 400 : 600,
              fontSize: "1.2rem",
              color: isDark ? "var(--gold, #d4a853)" : "#2c2c2c",
              letterSpacing: isDark ? "0.1em" : 0,
              marginBottom: "0.4rem",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: isDark ? "var(--ash, #9d8f7a)" : "#8a8680",
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        </div>

        {/* Input */}
        <input
          type="text"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleConnect()}
          placeholder="0x... atau paste Delegate Key-mu"
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            background: isDark ? "rgba(255,255,255,0.04)" : "#f8f7f4",
            border: `1.5px solid ${
              error
                ? "#e57373"
                : isDark
                ? "rgba(255,255,255,0.1)"
                : "#c5c0b8"
            }`,
            borderRadius: isDark ? 0 : 8,
            color: isDark ? "#e8e0cc" : "#2c2c2c",
            fontSize: "0.9rem",
            outline: "none",
            marginBottom: error ? "0.5rem" : "1.25rem",
            transition: "border-color 0.2s",
            boxSizing: "border-box",
          }}
        />

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ color: "#e57373", fontSize: "0.82rem", marginBottom: "1rem" }}
            >
              ⚠ {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Button */}
        <button
          onClick={handleConnect}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.85rem",
            background: loading
              ? isDark
                ? "rgba(255,255,255,0.08)"
                : "#c5c0b8"
              : isDark
              ? "linear-gradient(135deg, var(--ember, #c4793a), var(--ember-bright, #e8943f))"
              : "#4a7c6f",
            border: "none",
            borderRadius: isDark ? 0 : 8,
            color: "#fff",
            fontFamily: isDark ? '"Cinzel", serif' : '"Inter", sans-serif',
            fontWeight: isDark ? 400 : 600,
            fontSize: "0.9rem",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            boxShadow: loading ? "none" : isDark ? "0 4px 16px rgba(196,121,58,0.4)" : "none",
          }}
        >
          {loading ? "Memverifikasi..." : submitLabel}
        </button>
      </motion.div>
    </motion.div>
  );
}
