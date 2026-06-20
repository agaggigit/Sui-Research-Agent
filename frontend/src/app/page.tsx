"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import LandingNavbar from "@/components/LandingNavbar";
import GrassHillBg from "@/components/GrassHillBg";

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0",
        position: "relative",
        overflow: "hidden",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {/* Sky + Glass Portal + Grass Hill */}
      <GrassHillBg />

      {/* Navbar */}
      <LandingNavbar />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          padding: "2rem",
          paddingBottom: "25vh",
          position: "relative",
          zIndex: 5,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: 800,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.4rem 1rem",
              background: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              borderRadius: "999px",
              marginBottom: "1.5rem",
              fontSize: "0.85rem",
              color: "#0f766e",
              fontWeight: 600,
            }}
          >
            🌊 Secured by Walrus Protocol
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#1e293b",
              lineHeight: 1.2,
              marginBottom: "1.5rem",
              textShadow: "0 4px 12px rgba(255,255,255,0.5)",
            }}
          >
            Sebuah Ingatan yang Berjalan Bersamamu.
            <br />
            Di Mana Pun Kamu Melangkah.
          </h1>

          {/* Sub-headline */}
          <p
            style={{
              fontSize: "1.1rem",
              color: "#334155",
              maxWidth: 640,
              lineHeight: 1.6,
              marginBottom: "3rem",
            }}
          >
            AURA adalah teman digital yang mengunci memori Anda secara aman di jaringan
            Walrus. Ia tidak akan melupakan cerita Anda, dan selalu hadir dalam bentuk yang
            Anda butuhkan di setiap aplikasi.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Link href="/demo" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "1rem 2.5rem",
                  background: "#0f172a",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "999px",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.3)",
                }}
              >
                Try the Interactive Demo ➔
              </motion.button>
            </Link>
            <Link
              href="#"
              style={{
                color: "#475569",
                fontSize: "0.95rem",
                textDecoration: "underline",
                fontWeight: 500,
              }}
            >
              See How It Works
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
