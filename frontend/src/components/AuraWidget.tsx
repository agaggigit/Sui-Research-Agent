"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import GlassSurface from "@/components/GlassSurface-reactbits/GlassSurface";

export type MemoryStatus = "idle" | "extracting" | "encrypting" | "uploading" | "saved";

export type MemoryFact = {
  type: string;
  value: string;
};

export type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  memoryExtracted?: MemoryFact | null;
};

interface AuraWidgetProps {
  theme: "dark" | "light";
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  memoryStatus: MemoryStatus;
}

export default function AuraWidget({
  theme,
  messages,
  input,
  handleInputChange,
  handleSubmit,
  memoryStatus,
}: AuraWidgetProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);  // logo click: toggle semua
  const [isHovered, setIsHovered] = useState(false); // hover: hanya munculkan input
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(false);
    }, 400);
  };

  // Klik logo: toggle semua (termasuk bubbles)
  const handleLogoClick = () => {
    setIsVisible((prev) => !prev);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isDark = theme === "dark";
  const textColor = isDark ? "#e8e0cc" : "#2c2c2c";
  const mutedColor = isDark ? "#9d8f7a" : "#8a8680";
  const accentColor = isDark ? "#c4793a" : "#4a7c6f";

  const getStatusLabel = () => {
    switch (memoryStatus) {
      case "extracting": return "Analyzing...";
      case "encrypting": return "Encrypting...";
      case "uploading": return "Uploading...";
      case "saved": return "Saved! ✓";
      default: return "";
    }
  };

  const isActive = memoryStatus !== "idle";

  return (
    <div
      className="fixed top-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      {/* Top Section: Avatar & Status */}
      <div 
        className="flex items-center gap-3 pointer-events-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{
              padding: "6px 12px",
              background: `rgba(0,0,0,${isDark ? "0.4" : "0.1"})`,
              backdropFilter: "blur(8px)",
              borderRadius: 20,
              border: `1px solid rgba(255,255,255,${isDark ? "0.1" : "0.3"})`,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 11, color: mutedColor }}>{getStatusLabel()}</span>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: memoryStatus === "saved" ? "#00c4b4" : "#f59e0b",
                boxShadow: memoryStatus === "saved"
                  ? "0 0 6px rgba(0,196,180,0.8)"
                  : "0 0 6px rgba(245,158,11,0.8)",
                animation: memoryStatus !== "saved" ? "pulse 1.5s infinite" : "none",
              }}
            />
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogoClick}
          title={isVisible ? "Sembunyikan chat" : "Tampilkan chat"}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
            position: "relative",
            opacity: isVisible ? 1 : 0.55,
            transition: "opacity 0.2s",
          }}
        >
          <GlassSurface
            width={56}
            height={56}
            borderRadius={28}
            borderWidth={0.1}
            brightness={isDark ? 30 : 120}
            opacity={isDark ? 0.9 : 0.6}
            blur={isDark ? 10 : 16}
            distortionScale={isDark ? -120 : 0}
            backgroundOpacity={isDark ? 0.05 : 0.15}
            saturation={isDark ? 1.4 : 1.2}
            style={{ position: "absolute", inset: 0 }}
          />
          <Image
            src="/aura.png"
            alt="AURA"
            width={36}
            height={36}
            style={{ objectFit: "cover", position: "relative", zIndex: 1 }}
          />
        </motion.button>
      </div>

          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              width: 380,
              maxHeight: "50vh",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              // Bubbles fade in/out based on isVisible (logo toggle)
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              pointerEvents: isVisible ? "auto" : "none",
            } as React.CSSProperties}
          >
            {/* Floating Messages Area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                scrollbarWidth: "none",
                paddingRight: 4, // for slight scrollbar spacing if needed
                paddingBottom: 4,
              }}
            >
              {messages.length === 0 && (
                <div style={{ alignSelf: "flex-end", position: "relative", maxWidth: "85%" }}>
                   <GlassSurface
                      width="100%"
                      height="100%"
                      borderRadius={18}
                      borderWidth={0.08}
                      brightness={isDark ? 20 : 110}
                      opacity={isDark ? 0.82 : 0.4}
                      blur={isDark ? 12 : 16}
                      distortionScale={isDark ? -100 : 0}
                      backgroundOpacity={isDark ? 0.06 : 0.2}
                      saturation={isDark ? 1.5 : 1.0}
                      style={{ position: "absolute", inset: 0 }}
                    />
                    <div
                      style={{
                        position: "relative",
                        zIndex: 1,
                        padding: "10px 16px",
                        fontSize: 13,
                        color: mutedColor,
                        borderRadius: 18,
                        background: `rgba(255,255,255,${isDark ? "0.03" : "0.15"})`,
                        border: `1px solid rgba(255,255,255,${isDark ? "0.08" : "0.2"})`,
                      }}
                    >
                      AURA sedang menyimak...
                    </div>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end", // All bubbles right-aligned per wireframe
                    width: "100%",
                  }}
                >
                  {/* Floating Bubble */}
                  <div style={{ maxWidth: "85%", position: "relative" }}>
                    <GlassSurface
                      width="100%"
                      height="100%"
                      borderRadius={18}
                      borderWidth={0.08}
                      brightness={msg.role === "user" ? (isDark ? 35 : 120) : (isDark ? 25 : 120)}
                      opacity={msg.role === "user" ? (isDark ? 0.9 : 0.4) : (isDark ? 0.85 : 0.4)}
                      blur={isDark ? 14 : 20}
                      distortionScale={isDark ? -100 : 0}
                      backgroundOpacity={msg.role === "user" ? (isDark ? 0.12 : 0.2) : (isDark ? 0.08 : 0.2)}
                      saturation={isDark ? 1.5 : 1.2}
                      style={{ position: "absolute", inset: 0 }}
                    />
                    <div
                      style={{
                        position: "relative",
                        zIndex: 1,
                        padding: "12px 16px",
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: textColor,
                        borderRadius: 18,
                        background: msg.role === "user"
                          ? `rgba(${isDark ? "196,121,58" : "74,124,111"},${isDark ? "0.15" : "0.25"})`
                          : `rgba(255,255,255,${isDark ? "0.05" : "0.4"})`,
                        border: `1px solid ${msg.role === "user" 
                          ? `rgba(${isDark ? "196,121,58" : "74,124,111"},${isDark ? "0.1" : "0.3"})`
                          : `rgba(255,255,255,${isDark ? "0.1" : "0.6"})`}`,
                      }}
                    >
                      {msg.role === "ai" && <strong style={{color: accentColor, marginRight: 6}}>AURA:</strong>}
                      {msg.content}
                    </div>
                  </div>

                  {/* Walrus Memory Pill */}
                  {msg.memoryExtracted && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        marginTop: 6,
                        fontSize: 10,
                        color: "#00c4b4",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        border: "1px solid rgba(0,196,180,0.3)",
                        padding: "4px 12px",
                        borderRadius: 999,
                        background: "rgba(0,196,180,0.08)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <span>🌊</span>
                      <span>
                        <strong>Walrus:</strong> {msg.memoryExtracted.value}
                      </span>
                    </motion.div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Floating Input — selalu di DOM agar mengambil space tetap (mencegah bubble lompat) */}
            <div
              style={{
                position: "relative",
                width: "100%",
                marginTop: 4,
                flexShrink: 0,
                opacity: isVisible && isHovered ? 1 : 0,
                transform: isVisible && isHovered ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
                pointerEvents: isVisible && isHovered ? "auto" : "none",
              }}
            >
              <GlassSurface
                width="100%"
                height="100%"
                borderRadius={24}
                borderWidth={0.08}
                brightness={isDark ? 30 : 120}
                opacity={isDark ? 0.9 : 0.5}
                blur={isDark ? 16 : 24}
                distortionScale={isDark ? -120 : 0}
                backgroundOpacity={isDark ? 0.1 : 0.3}
                saturation={isDark ? 1.4 : 1.1}
                style={{ position: "absolute", inset: 0 }}
              />
              <form
                onSubmit={handleSubmit}
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  gap: 8,
                  padding: "8px 8px 8px 18px",
                  background: `rgba(255,255,255,${isDark ? "0.04" : "0.15"})`,
                  borderRadius: 24,
                  border: `1px solid rgba(255,255,255,${isDark ? "0.15" : "0.3"})`,
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ketik pesan..."
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    outline: "none",
                    fontSize: 14,
                    color: textColor,
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 18,
                    background: input.trim()
                      ? `linear-gradient(135deg, ${accentColor}, ${isDark ? "#e8943f" : "#386055"})`
                      : `rgba(255,255,255,${isDark ? "0.08" : "0.2"})`,
                    border: "none",
                    color: input.trim() ? "#fff" : mutedColor,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: input.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    boxShadow: input.trim() ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
                  }}
                >
                  Kirim
                </button>
              </form>
            </div>
          </div>
    </div>
  );
}
