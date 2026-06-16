"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* =================== TYPES =================== */
type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  memoryExtracted?: MemoryFact | null;
};

type MemoryFact = {
  type: string;
  value: string;
};

type MemoryStatus =
  | "idle"
  | "extracting"
  | "encrypting"
  | "uploading"
  | "saved";

/* =================== MOCK AI ENGINE =================== */
const BARTENDER_RESPONSES = [
  {
    trigger: ["capek", "lelah", "tired", "exhausted", "penat"],
    response:
      "Ah, aku bisa lihat itu dari matamu, pengembara. Beristirahatlah sejenak di sini. Ceritakan apa yang membebanimu hari ini...",
    memory: { type: "emotional_state", value: "kelelahan, butuh istirahat" },
  },
  {
    trigger: ["coding", "kode", "programmer", "develop", "react", "javascript"],
    response:
      "Seorang penyihir kode, eh? Jiwa-jiwa sepertimu selalu datang ke kedai ini setelah berperang dengan bug-bug terkutuk. Sihir apa yang sedang kau pelajari?",
    memory: {
      type: "occupation",
      value: "developer/programmer, bekerja dengan kode",
    },
  },
  {
    trigger: ["benci", "hate", "tidak suka", "ga suka", "males"],
    response:
      "Dendam yang dalam... aku mengerti. Musuh terkuat seringkali bukan monster di luar, tapi gangguan kecil yang mencuri fokusmu. Apa yang paling mengganggumu?",
    memory: { type: "frustration", value: "sesuatu yang sangat tidak disukai" },
  },
  {
    trigger: ["notifikasi", "notification", "berisik", "noise", "ramai"],
    response:
      "Ketenangan adalah harta paling langka di era ini. Aku punya ruang khusus di belakang kedai, bebas dari kebisingan. Kau tampaknya butuh suasana seperti itu untuk bekerja.",
    memory: {
      type: "work_preference",
      value: "benci notifikasi berisik, butuh ketenangan",
    },
  },
  {
    trigger: ["senang", "suka", "love", "happy", "bagus", "keren"],
    response:
      "Ah, ada percikan api di matamu! Ceritakan lebih lanjut — apa yang membuatmu bersemangat hari ini?",
    memory: null,
  },
];

const DEFAULT_RESPONSES = [
  "Kedai ini sudah berdiri sejak berabad-abad, menyaksikan ribuan pengembara datang dan pergi. Ceritakan kisahmu, aku punya waktu.",
  "Hmm... kata-katamu menarik. Teruskan, aku mendengarkan dengan seksama.",
  "Asap perapian membawa cerita ke seluruh penjuru ruangan ini. Tiap tamu punya rahasia. Apa rahasiamu?",
  "Di luar badai mengamuk, tapi di sini kita aman. Minumlah dulu, lalu ceritakan apa yang ada di pikiranmu.",
  "Setiap jiwa yang masuk ke sini meninggalkan jejak. Dan jejakmu... terasa berbeda dari yang lain.",
];

function getMockAIResponse(input: string): {
  response: string;
  memory: MemoryFact | null;
} {
  const lower = input.toLowerCase();
  for (const item of BARTENDER_RESPONSES) {
    if (item.trigger.some((t) => lower.includes(t))) {
      return { response: item.response, memory: item.memory };
    }
  }
  const random =
    DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
  return { response: random, memory: null };
}

/* =================== DELEGATE KEY MODAL =================== */
function DelegateKeyModal({
  onConnect,
}: {
  onConnect: (key: string) => void;
}) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (key.trim().length < 8) {
      setError("Kunci terlalu pendek. Masukkan Delegate Key yang valid.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500)); // simulate validation
    setLoading(false);
    onConnect(key.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,8,6,0.92)", backdropFilter: "blur(8px)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(196,121,58,0.08) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", damping: 20 }}
        className="relative w-full max-w-md"
        style={{
          background: "var(--void-card)",
          border: "1px solid var(--void-border)",
          borderRadius: "2px",
          boxShadow: "var(--shadow-deep), var(--shadow-ember)",
        }}
      >
        {/* Top ornament line */}
        <div
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, var(--ember), var(--gold), var(--ember), transparent)",
          }}
        />

        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="animate-ember-pulse"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--mist)",
                border: "1px solid var(--ember-dim)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              🔑
            </div>
          </div>

          <h2
            style={{
              fontFamily: '"Cinzel", serif',
              color: "var(--gold)",
              textAlign: "center",
              fontSize: "1.25rem",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}
          >
            Masukkan Kunci Identitas
          </h2>
          <p
            style={{
              color: "var(--ash)",
              textAlign: "center",
              fontSize: "0.9rem",
              marginBottom: "2rem",
              lineHeight: 1.6,
            }}
          >
            Wallet Delegate Key dari MemWal Playground diperlukan untuk
            mengakses kedai dan menyimpan memorimu ke jaringan Walrus.
          </p>

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
              background: "var(--void-surface)",
              border: `1px solid ${error ? "var(--blood)" : "var(--void-border)"}`,
              borderRadius: "2px",
              color: "var(--bone)",
              fontFamily: '"Crimson Text", serif',
              fontSize: "0.95rem",
              outline: "none",
              marginBottom: error ? "0.5rem" : "1.25rem",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--ember-dim)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = error
                ? "var(--blood)"
                : "var(--void-border)")
            }
          />

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  color: "#e57373",
                  fontSize: "0.82rem",
                  marginBottom: "1rem",
                }}
              >
                ⚠ {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={handleConnect}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.85rem",
              background: loading
                ? "var(--ember-dim)"
                : "linear-gradient(135deg, var(--ember), var(--ember-bright))",
              border: "none",
              borderRadius: "2px",
              color: "#fff",
              fontFamily: '"Cinzel", serif',
              fontSize: "0.9rem",
              letterSpacing: "0.08em",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              boxShadow: loading ? "none" : "var(--shadow-ember)",
            }}
          >
            {loading ? "Memvalidasi Kunci..." : "Buka Pintu Kedai ⚔"}
          </button>

          <p
            style={{
              color: "var(--ash)",
              fontSize: "0.78rem",
              textAlign: "center",
              marginTop: "1.25rem",
              lineHeight: 1.5,
            }}
          >
            Belum punya kunci?{" "}
            <a
              href="https://memwal.walrus.site"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--walrus-teal)", textDecoration: "none" }}
            >
              Generate di MemWal Playground →
            </a>
          </p>
        </div>

        {/* Bottom ornament */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, var(--ember-dim), transparent)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* =================== MEMORY STATUS TOAST =================== */
const STATUS_STEPS: Record<
  Exclude<MemoryStatus, "idle">,
  { label: string; color: string; icon: string }
> = {
  extracting: {
    label: "Menganalisis memori...",
    color: "var(--gold)",
    icon: "🧠",
  },
  encrypting: {
    label: "Mengenkripsi via Seal...",
    color: "var(--sui-blue)",
    icon: "🔐",
  },
  uploading: {
    label: "Mengunggah ke Walrus...",
    color: "var(--walrus-teal)",
    icon: "🌊",
  },
  saved: { label: "Memori tersimpan!", color: "#6bcb77", icon: "✓" },
};

function MemoryStatusToast({ status }: { status: MemoryStatus }) {
  if (status === "idle") return null;
  const step = STATUS_STEPS[status];
  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      style={{
        position: "fixed",
        bottom: "5rem",
        right: "1.5rem",
        background: "var(--void-card)",
        border: `1px solid ${step.color}`,
        borderRadius: "2px",
        padding: "0.6rem 1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        boxShadow: `0 0 16px ${step.color}40`,
        zIndex: 100,
        minWidth: 220,
      }}
    >
      <span style={{ fontSize: "1rem" }}>{step.icon}</span>
      <div>
        <p
          style={{
            color: step.color,
            fontSize: "0.78rem",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
          }}
        >
          {step.label}
        </p>
        {status !== "saved" && (
          <div
            style={{
              marginTop: "0.3rem",
              height: 2,
              background: "var(--void-border)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{ height: "100%", background: step.color, borderRadius: 1 }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* =================== CHAT BUBBLE =================== */
function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        marginBottom: "1.25rem",
        gap: "0.35rem",
      }}
    >
      {/* Role label */}
      <span
        style={{
          fontSize: "0.72rem",
          color: "var(--ash)",
          fontFamily: '"Inter", sans-serif',
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {isUser ? "Kamu" : "🍺 Si Penjaga Kedai"}
      </span>

      {/* Bubble */}
      <div
        style={{
          maxWidth: "75%",
          padding: "0.75rem 1.1rem",
          borderRadius: "2px",
          fontSize: "1rem",
          lineHeight: 1.7,
          ...(isUser
            ? {
                background: "var(--void-surface)",
                border: "1px solid var(--void-border)",
                color: "var(--bone)",
              }
            : {
                background: "var(--void-card)",
                border: "1px solid var(--ember-dim)",
                color: "var(--bone)",
                boxShadow: "var(--shadow-ember)",
              }),
        }}
      >
        {message.content}
      </div>

      {/* Memory badge */}
      <AnimatePresence>
        {message.memoryExtracted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.2rem 0.6rem",
              background: "var(--walrus-teal-dim)",
              border: "1px solid var(--walrus-teal)",
              borderRadius: "2px",
              fontSize: "0.72rem",
              color: "var(--walrus-teal)",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            <span>🌊</span>
            <span>
              Memori tersimpan:{" "}
              <em style={{ color: "var(--bone)" }}>
                {message.memoryExtracted.value}
              </em>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* =================== TYPING INDICATOR =================== */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem" }}
    >
      <span style={{ fontSize: "0.72rem", color: "var(--ash)", fontFamily: '"Inter", sans-serif' }}>
        🍺 Si Penjaga Kedai sedang menjawab
      </span>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
          style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "var(--ember)" }}
        />
      ))}
    </motion.div>
  );
}

/* =================== MAIN PAGE =================== */
export default function TavernPage() {
  const [delegateKey, setDelegateKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Selamat datang di Kedai Jiwa yang Tersesat. Aku adalah penjaga di sini, sudah lama melayani para pengembara yang datang dengan beban di hati. Ceritakan kisahmu — aku akan mengingatnya, bahkan ketika dunia melupakanmu.",
      timestamp: new Date(),
      memoryExtracted: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [memoryStatus, setMemoryStatus] = useState<MemoryStatus>("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const triggerMemoryFlow = async (fact: MemoryFact) => {
    setMemoryStatus("extracting");
    await new Promise((r) => setTimeout(r, 1200));
    setMemoryStatus("encrypting");
    await new Promise((r) => setTimeout(r, 1000));
    setMemoryStatus("uploading");
    await new Promise((r) => setTimeout(r, 1300));
    setMemoryStatus("saved");
    await new Promise((r) => setTimeout(r, 1800));
    setMemoryStatus("idle");
    return fact;
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const { response, memory } = getMockAIResponse(userMsg.content);

    // Simulate AI thinking delay
    await new Promise((r) =>
      setTimeout(r, 800 + Math.random() * 600)
    );

    let savedMemory: MemoryFact | null = null;
    if (memory) {
      savedMemory = await triggerMemoryFlow(memory);
    }

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: response,
      timestamp: new Date(),
      memoryExtracted: savedMemory,
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Delegate Key Modal */}
      <AnimatePresence>
        {!delegateKey && (
          <DelegateKeyModal onConnect={(k) => setDelegateKey(k)} />
        )}
      </AnimatePresence>

      {/* Memory Status Toast */}
      <AnimatePresence>
        {memoryStatus !== "idle" && (
          <MemoryStatusToast status={memoryStatus} />
        )}
      </AnimatePresence>

      {/* Full page layout */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--void)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient background gradients */}
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 80%, rgba(196,121,58,0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(106,31,31,0.08) 0%, transparent 50%)
            `,
          }}
        />

        {/* ====== HEADER ====== */}
        <header
          style={{
            padding: "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--void-border)",
            background: "var(--void-mid)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link
              href="/"
              style={{
                color: "var(--ash)",
                textDecoration: "none",
                fontSize: "0.8rem",
                fontFamily: '"Inter", sans-serif',
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "var(--bone)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--ash)")
              }
            >
              ← Kembali
            </Link>
            <div
              style={{
                width: 1,
                height: 16,
                background: "var(--void-border)",
              }}
            />
            <h1
              className="animate-flicker"
              style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "1rem",
                color: "var(--gold)",
                letterSpacing: "0.12em",
              }}
            >
              ⚔ Kedai Jiwa yang Tersesat
            </h1>
          </div>

          {/* Connection status */}
          {delegateKey && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: '"Inter", sans-serif',
                fontSize: "0.75rem",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--walrus-teal)",
                }}
              />
              <span style={{ color: "var(--walrus-teal)" }}>
                Walrus Testnet
              </span>
              <span style={{ color: "var(--ash)" }}>
                · {delegateKey.slice(0, 6)}...{delegateKey.slice(-4)}
              </span>
            </div>
          )}
        </header>

        {/* ====== CHAT AREA ====== */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "2rem 1rem",
            maxWidth: 760,
            width: "100%",
            margin: "0 auto",
          }}
        >
          <AnimatePresence>
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </main>

        {/* ====== INPUT AREA ====== */}
        <div
          style={{
            borderTop: "1px solid var(--void-border)",
            background: "var(--void-mid)",
            padding: "1rem 1.5rem",
            position: "sticky",
            bottom: 0,
          }}
        >
          <div
            style={{
              maxWidth: 760,
              margin: "0 auto",
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-end",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ceritakan sesuatu kepada penjaga kedai... (Enter untuk kirim)"
              rows={1}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                background: "var(--void-surface)",
                border: "1px solid var(--void-border)",
                borderRadius: "2px",
                color: "var(--bone)",
                fontFamily: '"Crimson Text", serif',
                fontSize: "1rem",
                resize: "none",
                outline: "none",
                lineHeight: 1.6,
                overflowY: "auto",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--ember-dim)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--void-border)")
              }
              disabled={!delegateKey}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping || !delegateKey}
              style={{
                padding: "0.75rem 1.25rem",
                background:
                  !input.trim() || isTyping || !delegateKey
                    ? "var(--void-surface)"
                    : "linear-gradient(135deg, var(--ember), var(--ember-bright))",
                border: "1px solid var(--void-border)",
                borderRadius: "2px",
                color:
                  !input.trim() || isTyping || !delegateKey
                    ? "var(--ash)"
                    : "#fff",
                cursor:
                  !input.trim() || isTyping || !delegateKey
                    ? "not-allowed"
                    : "pointer",
                fontSize: "1.1rem",
                transition: "all 0.2s",
                flexShrink: 0,
                boxShadow:
                  input.trim() && !isTyping
                    ? "var(--shadow-ember)"
                    : "none",
              }}
            >
              ⚔
            </button>
          </div>
          <p
            style={{
              textAlign: "center",
              marginTop: "0.6rem",
              fontSize: "0.72rem",
              color: "var(--ash)",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            Percakapanmu dianalisis & memorinya disimpan ke{" "}
            <span style={{ color: "var(--walrus-teal)" }}>
              Walrus Network
            </span>{" "}
            secara terenkripsi
          </p>
        </div>
      </div>
    </>
  );
}
