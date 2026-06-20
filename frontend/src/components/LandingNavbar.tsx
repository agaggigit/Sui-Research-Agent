"use client";

export default function LandingNavbar() {
  return (
    <header
      style={{
        width: "100%",
        padding: "1.5rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 800,
          fontSize: "1.5rem",
          color: "#1e293b",
        }}
      >
        AURA
      </div>

      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.6rem 1.2rem",
          background: "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          borderRadius: "999px",
          color: "#1e293b",
          fontSize: "0.9rem",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          transition: "all 0.2s",
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#3b82f6",
          }}
        />
        Connect Wallet
      </button>
    </header>
  );
}
