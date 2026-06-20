"use client";

import { motion } from "framer-motion";
import GlassSurface from "@/components/GlassSurface-reactbits/GlassSurface";
import Image from "next/image";

export default function GrassHillBg() {
  return (
    <>
      {/* Sky Gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #38bdf8 0%, #e0f2fe 50%, #ffedd5 80%, #fed7aa 100%)",
          zIndex: -3,
        }}
      />

      {/* Glass Companion Portal */}
      <motion.div
        initial={{ opacity: 0, y: 100, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        transition={{ delay: 0.4, duration: 1 }}
        style={{
          position: "absolute",
          bottom: "15vh",
          left: "50%",
          width: "90%",
          maxWidth: 600,
          height: 350,
          zIndex: 2,
        }}
      >
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={32}
          borderWidth={0.1}
          brightness={120}
          opacity={0.4}
          blur={24}
          distortionScale={0}
          backgroundOpacity={0.1}
          saturation={1.2}
          style={{ position: "absolute", inset: 0 }}
        />
        {/* Ember Glow inside the portal */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 250,
            height: 250,
            background: "radial-gradient(circle, rgba(196,121,58,0.8) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(20px)",
            mixBlendMode: "overlay",
          }}
        />
        {/* AURA Avatar */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/aura.png"
              alt="AURA"
              width={50}
              height={50}
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Lush Grass Hill */}
      <div
        style={{
          position: "absolute",
          bottom: "-40vh",
          left: 0,
          width: "100vw",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <img
          src="/grass_hill.png"
          alt="Grass Hill"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    </>
  );
}
