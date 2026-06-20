"use client";

import { motion } from "framer-motion";
import GlassSurface from "@/components/GlassSurface-reactbits/GlassSurface";
import AppCard from "@/components/AppCard";

export default function DemoPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #064e3b 100%)",
          zIndex: -2,
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="fixed pointer-events-none"
        style={{
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%)",
          top: "-20%",
          left: "-10%",
          zIndex: -1,
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="fixed pointer-events-none"
        style={{
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)",
          bottom: "-10%",
          right: "-10%",
          zIndex: -1,
        }}
      />

      {/* Main Glass Panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 900,
          borderRadius: 32,
          padding: "4rem 3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={32}
          borderWidth={0.1}
          brightness={30}
          opacity={0.8}
          blur={32}
          distortionScale={-80}
          backgroundOpacity={0.05}
          saturation={1.5}
          style={{ position: "absolute", inset: 0 }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1rem",
              background: "rgba(45,212,191,0.1)",
              border: "1px solid rgba(45,212,191,0.3)",
              borderRadius: "999px",
              marginBottom: "2rem",
              fontSize: "0.85rem",
              color: "#2dd4bf",
              letterSpacing: "0.05em",
              fontWeight: 500,
            }}
          >
            🌊 Sui Overflow 2026 · Walrus Track
          </motion.div>

          <h1
            style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(3rem, 8vw, 5rem)",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "0.05em",
              marginBottom: "1rem",
              lineHeight: 1.1,
              textShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}
          >
            AURA
          </h1>
          <p
            style={{
              fontFamily: '"Crimson Text", serif',
              fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
              color: "#cbd5e1",
              marginBottom: "1.5rem",
              fontStyle: "italic",
              letterSpacing: "0.02em",
            }}
          >
            The Portable AI Soul
          </p>
          <p
            style={{
              fontSize: "1rem",
              color: "#94a3b8",
              marginBottom: "4rem",
              lineHeight: 1.7,
              maxWidth: 540,
            }}
          >
            Memori AI yang tidak terikat pada satu aplikasi. Simpan profil, emosi, dan
            preferensi AI-mu ke Walrus Network, bawa melintasi berbagai dApp.
          </p>

          {/* App Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              width: "100%",
            }}
          >
            <AppCard
              href="/demo/tavern"
              icon="🍺"
              title="Tavern Chat"
              badge="App A · Ingestion Engine"
              description="<strong style='color:#fef3c7'>App A · Ingestion Engine</strong><br/>Bicara bebas dengan AURA di kedai. Ia akan mempelajari preferensimu dan menyimpannya secara desentralisasi ke Walrus."
              ctaLabel="Enter Tavern →"
              ctaColor="#fbbf24"
              titleColor="#fcd34d"
              brightness={40}
              opacity={0.9}
            />
            <AppCard
              href="/demo/zenboard"
              icon="🪴"
              title="Zen Board"
              badge="App B · Cross-Agent Recall"
              description="<strong style='color:#f0fdfa'>App B · Cross-Agent Recall</strong><br/>Tarik memori dari Walrus di dApp yang berbeda. AURA akan beradaptasi dan membantumu fokus mengelola tugas."
              ctaLabel="Open Zenboard →"
              ctaColor="#5eead4"
              titleColor="#2dd4bf"
              brightness={120}
              opacity={0.3}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
