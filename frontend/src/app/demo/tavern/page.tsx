"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import AuraWidget, { Message } from "@/components/AuraWidget";
import DelegateKeyModal from "@/components/DelegateKeyModal";
import { useAuraChat } from "@/hooks/useAuraChat";

export default function TavernPage() {
  const [delegateKey, setDelegateKey] = useState<string | null>(null);

  const { messages, setMessages, input, setInput, memoryStatus, sendMessage } =
    useAuraChat(delegateKey);

  const handleConnect = (key: string) => {
    setDelegateKey(key);
    // Set welcome message
    setMessages([
      {
        id: "welcome",
        role: "ai",
        content: "Hei, kamu kelihatan capek malam ini. Ada yang mau diceritain?",
        timestamp: new Date(),
      },
    ] as Message[]);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-pixel">
      {/* Delegate Key Modal */}
      <AnimatePresence>
        {!delegateKey && (
          <DelegateKeyModal
            theme="dark"
            onConnect={handleConnect}
            title="Masukkan Kunci Identitas"
            description="Wallet Delegate Key dari MemWal Playground diperlukan untuk mengakses kedai dan menyimpan memorimu ke jaringan Walrus."
            submitLabel="Buka Pintu Kedai ⚔"
            icon="🔑"
          />
        )}
      </AnimatePresence>

      {/* Tavern Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/tavern_bg.png"
          alt="Tavern Background"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Characters Layer */}
      {delegateKey && (
        <div className="absolute inset-0 z-10 flex flex-col justify-end items-center pb-32">
          <div className="flex items-end gap-12">
            {/* User Sprite */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <Image
                src="/user.png"
                alt="User"
                width={180}
                height={180}
                style={{ imageRendering: "pixelated" }}
              />
            </motion.div>

            {/* AURA Sprite */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0, y: [0, -15, 0] }}
              transition={{
                opacity: { duration: 1 },
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              }}
            >
              <Image
                src="/aura.png"
                alt="AURA"
                width={100}
                height={100}
                style={{ imageRendering: "pixelated" }}
                className="drop-shadow-[0_0_25px_rgba(0,196,180,0.8)]"
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* Back Navigation */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 text-white/70 hover:text-white transition-colors font-sans text-sm flex items-center gap-2"
      >
        <span className="text-xl">←</span> Kembali ke Menu
      </Link>

      {/* AURA Widget */}
      {delegateKey && (
        <AuraWidget
          theme="dark"
          messages={messages}
          input={input}
          handleInputChange={(e) => setInput(e.target.value)}
          handleSubmit={sendMessage}
          memoryStatus={memoryStatus}
        />
      )}
    </div>
  );
}
