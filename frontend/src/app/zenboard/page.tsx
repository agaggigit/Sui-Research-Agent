"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* =================== TYPES =================== */
type TaskStatus = "todo" | "inprogress" | "done";

type Task = {
  id: string;
  title: string;
  tag: string;
  status: TaskStatus;
};

type MemoryProfile = {
  occupation: string;
  emotionalState: string;
  workPreference: string;
  greeting: string;
  silentMode: boolean;
  tasks: Task[];
};

/* =================== MOCK MEMORY DATA =================== */
// Simulasi data yang di-recall dari Walrus Network
const RECALLED_MEMORY: MemoryProfile = {
  occupation: "Programmer (React)",
  emotionalState: "Kelelahan setelah seharian coding",
  workPreference: "Benci notifikasi berisik, butuh ketenangan",
  greeting:
    "Selamat datang kembali. Kulihat kamu habis berjuang keras di kedai tadi malam — ada sisa kelelahan di profilmu. Tenang, aku sudah siapkan semuanya dengan mode senyap hari ini. Mari selesaikan ini perlahan.",
  silentMode: true,
  tasks: [
    { id: "t1", title: "Review PR dari tim backend", tag: "Code Review", status: "todo" },
    { id: "t2", title: "Fix bug komponen ChatInput di mobile", tag: "Bug Fix", status: "todo" },
    { id: "t3", title: "Tulis dokumentasi API /memory/recall", tag: "Docs", status: "todo" },
    { id: "t4", title: "Setup Framer Motion page transitions", tag: "Frontend", status: "inprogress" },
    { id: "t5", title: "Integrasi MemWal SDK ke endpoint chat", tag: "Web3", status: "inprogress" },
    { id: "t6", title: "Desain wireframe ZenBoard", tag: "Design", status: "done" },
    { id: "t7", title: "Setup Next.js + TailwindCSS", tag: "Setup", status: "done" },
  ],
};

/* =================== RECALL LOADING SCREEN =================== */
const RECALL_STEPS = [
  { label: "Memverifikasi identitas Aura...", icon: "🔑", color: "#6fbcf0" },
  { label: "Menghubungkan ke Walrus Network...", icon: "🌊", color: "#00c4b4" },
  { label: "Menarik artefak memori...", icon: "🧠", color: "#a78bfa" },
  { label: "Menerapkan preferensi pengguna...", icon: "✨", color: "#6bcb77" },
];

function RecallLoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    RECALL_STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i), i * 900));
    });
    timers.push(
      setTimeout(() => {
        setDone(true);
        setTimeout(onComplete, 600);
      }, RECALL_STEPS.length * 900 + 300)
    );
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#f8f7f4",
        color: "#2c2c2c",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        gap: "2rem",
      }}
    >
      {/* Ambient bg for light mode */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,196,180,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Aura icon */}
      <motion.div
        animate={{ scale: done ? 1.2 : [1, 1.05, 1], opacity: done ? 0 : 1 }}
        transition={{ repeat: done ? 0 : Infinity, duration: 2 }}
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "white",
          border: "2px solid #e5e2db",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          boxShadow: "0 4px 24px rgba(0,196,180,0.15)",
        }}
      >
        🌀
      </motion.div>

      {/* Step list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: 300 }}>
        {RECALL_STEPS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: step >= i ? 1 : 0.3, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontFamily: '"Inter", sans-serif',
              fontSize: "0.9rem",
              color: step >= i ? "#2c2c2c" : "var(--zen-muted)",
            }}
          >
            <span
              style={{
                fontSize: "1.1rem",
                opacity: step >= i ? 1 : 0.3,
                filter: step > i ? "none" : step === i ? "none" : "grayscale(1)",
              }}
            >
              {step > i ? "✓" : s.icon}
            </span>
            <span>{s.label}</span>
            {step === i && (
              <motion.div
                style={{
                  width: 80,
                  height: 2,
                  background: "#e5e2db",
                  borderRadius: 1,
                  overflow: "hidden",
                  marginLeft: "auto",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.85 }}
                  style={{ height: "100%", background: s.color, borderRadius: 1 }}
                />
              </motion.div>
            )}
            {step > i && (
              <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#6bcb77" }}>
                ✓
              </span>
            )}
          </motion.div>
        ))}
      </div>

      <p
        style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: "0.78rem",
          color: "var(--zen-muted)",
        }}
      >
        Mengambil memori dari{" "}
        <span style={{ color: "var(--walrus-teal)", fontWeight: 500 }}>Walrus Network</span>
        ...
      </p>
    </motion.div>
  );
}

/* =================== ZEN DELEGATE MODAL =================== */
function ZenDelegateModal({ onConnect }: { onConnect: (key: string) => void }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (key.trim().length < 8) {
      setError("Kunci terlalu pendek. Masukkan Delegate Key yang valid.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
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
        background: "rgba(248,247,244,0.97)",
        backdropFilter: "blur(8px)",
        color: "#2c2c2c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "1rem",
      }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", damping: 22 }}
        style={{
          background: "#ffffff",
          border: "1px solid #e5e2db",
          borderRadius: "12px",
          padding: "2.5rem",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 8px 48px rgba(0,0,0,0.08)",
          color: "#2c2c2c",
        }}
      >
        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: "12px",
              background: "rgba(0,196,180,0.1)",
              border: "1px solid rgba(0,196,180,0.25)",
              fontSize: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            🪴
          </div>
          <h2
            style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              fontSize: "1.2rem",
              color: "var(--zen-text)",
              marginBottom: "0.4rem",
            }}
          >
            Hubungkan Identitas Aura
          </h2>
          <p
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: "0.875rem",
              color: "var(--zen-muted)",
              lineHeight: 1.6,
            }}
          >
            Masukkan Delegate Key yang sama seperti di Tavern untuk menarik memorimu dari Walrus Network.
          </p>
        </div>

        <input
          type="text"
          value={key}
          onChange={(e) => { setKey(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleConnect()}
          placeholder="0x... atau paste Delegate Key-mu"
          style={{
            width: "100%",
            padding: "0.7rem 1rem",
            border: `1.5px solid ${error ? "#e57373" : "#c5c0b8"}`,
            borderRadius: "8px",
            fontFamily: '"Inter", sans-serif',
            fontSize: "0.9rem",
            color: "#2c2c2c",
            background: "#f8f7f4",
            outline: "none",
            marginBottom: error ? "0.5rem" : "1rem",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#00c4b4")}
          onBlur={(e) => (e.target.style.borderColor = error ? "#e57373" : "#c5c0b8")}
        />

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ color: "#e57373", fontSize: "0.8rem", marginBottom: "0.75rem" }}
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
            padding: "0.8rem",
            background: loading ? "#c5c0b8" : "#4a7c6f",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          {loading ? "Memverifikasi..." : "Sambungkan & Tarik Memori →"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.78rem", color: "var(--zen-muted)", fontFamily: '"Inter", sans-serif' }}>
          Belum punya kunci?{" "}
          <a href="https://memwal.walrus.site" target="_blank" rel="noopener noreferrer" style={{ color: "var(--walrus-teal)" }}>
            Generate di MemWal Playground →
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}

/* =================== SILENT MODE BAR =================== */
function SilentModeBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: "spring", damping: 20 }}
      style={{
        background: "rgba(74,124,111,0.08)",
        borderBottom: "1px solid rgba(74,124,111,0.2)",
        padding: "0.5rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: '"Inter", sans-serif',
        fontSize: "0.82rem",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--zen-accent)" }}>
        🔕 <strong>Silent Mode aktif</strong>
        <span style={{ color: "var(--zen-muted)", fontWeight: 400 }}>
          — semua notifikasi disembunyikan berdasarkan preferensimu dari Walrus
        </span>
      </span>
      <button
        onClick={() => setVisible(false)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--zen-muted)", fontSize: "1rem", lineHeight: 1 }}
      >
        ×
      </button>
    </motion.div>
  );
}

/* =================== MEMORY CHIP =================== */
function MemoryChips({ memory }: { memory: MemoryProfile }) {
  const chips = [
    { label: memory.occupation, icon: "💻" },
    { label: memory.emotionalState, icon: "😮‍💨" },
    { label: "Silent Mode", icon: "🔕" },
  ];
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
      {chips.map((c, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.25rem 0.65rem",
            background: "rgba(0,196,180,0.08)",
            border: "1px solid rgba(0,196,180,0.25)",
            borderRadius: "999px",
            fontSize: "0.75rem",
            color: "var(--zen-text)",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          <span>{c.icon}</span>
          <span>{c.label}</span>
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.25rem 0.65rem",
          background: "rgba(0,196,180,0.05)",
          border: "1px dashed rgba(0,196,180,0.4)",
          borderRadius: "999px",
          fontSize: "0.72rem",
          color: "var(--walrus-teal)",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        🌊 Dimuat dari Walrus Network
      </motion.span>
    </div>
  );
}

/* =================== KANBAN TASK CARD =================== */
function TaskCard({ task, overlay = false }: { task: Task; overlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const tagColors: Record<string, string> = {
    "Code Review": "#6fbcf0",
    "Bug Fix": "#f87171",
    Docs: "#a78bfa",
    Frontend: "#f59e0b",
    Web3: "#00c4b4",
    Design: "#f472b6",
    Setup: "#6bcb77",
  };

  const card = (
    <div
      style={{
        background: "var(--zen-surface)",
        border: "1px solid var(--zen-border)",
        borderRadius: "8px",
        padding: "0.75rem 1rem",
        cursor: overlay ? "grabbing" : "grab",
        boxShadow: overlay ? "0 8px 24px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.04)",
        userSelect: "none",
      }}
    >
      <p
        style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: "0.875rem",
          color: "var(--zen-text)",
          lineHeight: 1.5,
          marginBottom: "0.5rem",
        }}
      >
        {task.title}
      </p>
      <span
        style={{
          display: "inline-block",
          padding: "0.15rem 0.5rem",
          borderRadius: "999px",
          fontSize: "0.7rem",
          fontFamily: '"Inter", sans-serif',
          background: `${tagColors[task.tag] || "#ccc"}18`,
          color: tagColors[task.tag] || "#888",
          border: `1px solid ${tagColors[task.tag] || "#ccc"}40`,
        }}
      >
        {task.tag}
      </span>
    </div>
  );

  if (overlay) return card;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {card}
    </div>
  );
}

/* =================== KANBAN COLUMN =================== */
const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "#6b7280" },
  { id: "inprogress", label: "In Progress", color: "#f59e0b" },
  { id: "done", label: "Done", color: "#6bcb77" },
];

const TAG_OPTIONS = ["Frontend", "Backend", "Web3", "Bug Fix", "Code Review", "Docs", "Design", "Setup"];

/* Droppable column wrapper */
function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: 80,
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        padding: "0.25rem",
        borderRadius: "6px",
        transition: "background 0.2s",
        background: isOver ? "rgba(0,196,180,0.06)" : "transparent",
        border: isOver ? "1px dashed rgba(0,196,180,0.3)" : "1px dashed transparent",
      }}
    >
      {children}
    </div>
  );
}

function KanbanBoard({ tasks, setTasks }: { tasks: Task[]; setTasks: (t: Task[]) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const activeTask = tasks.find((t) => t.id === activeId);

  function handleDragStart(e: DragStartEvent) {
    setActiveId(e.active.id as string);
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    const draggedTask = tasks.find((t) => t.id === active.id);
    if (!draggedTask) return;

    const overId = over.id as string;

    // Check if dropped on a column droppable
    const targetCol = COLUMNS.find((c) => c.id === overId);
    if (targetCol) {
      // Move to that column
      if (draggedTask.status !== targetCol.id) {
        setTasks(tasks.map((t) => t.id === draggedTask.id ? { ...t, status: targetCol.id } : t));
      }
      return;
    }

    // Dropped on another task
    const overTask = tasks.find((t) => t.id === overId);
    if (!overTask) return;

    if (draggedTask.status === overTask.status) {
      // Same column → reorder
      const colTasks = tasks.filter((t) => t.status === draggedTask.status);
      const oldIdx = colTasks.findIndex((t) => t.id === active.id);
      const newIdx = colTasks.findIndex((t) => t.id === overId);
      const reordered = arrayMove(colTasks, oldIdx, newIdx);
      setTasks([
        ...tasks.filter((t) => t.status !== draggedTask.status),
        ...reordered,
      ]);
    } else {
      // Different column → move to that column
      setTasks(tasks.map((t) => t.id === draggedTask.id ? { ...t, status: overTask.status } : t));
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id}>
              {/* Column header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                  paddingBottom: "0.75rem",
                  borderBottom: `2px solid ${col.color}`,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: col.color,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    color: "var(--zen-text)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {col.label}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: '"Inter", sans-serif',
                    fontSize: "0.78rem",
                    color: "var(--zen-muted)",
                    background: "var(--zen-bg)",
                    border: "1px solid var(--zen-border)",
                    borderRadius: "999px",
                    padding: "0.1rem 0.5rem",
                  }}
                >
                  {colTasks.length}
                </span>
              </div>

              {/* Droppable area + cards */}
              <DroppableColumn id={col.id}>
                <SortableContext
                  items={colTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {colTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </SortableContext>
              </DroppableColumn>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

/* =================== MAIN PAGE =================== */
export default function ZenBoardPage() {
  const [phase, setPhase] = useState<"modal" | "loading" | "dashboard">("modal");
  const [delegateKey, setDelegateKey] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>(RECALLED_MEMORY.tasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTag, setNewTaskTag] = useState("Frontend");
  const [addingTask, setAddingTask] = useState(false);

  const handleConnect = (key: string) => {
    setDelegateKey(key);
    setPhase("loading");
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      tag: newTaskTag,
      status: "todo",
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
    setNewTaskTag("Frontend");
    setAddingTask(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--zen-bg)", color: "var(--zen-text)" }}>
      {/* Modal */}
      <AnimatePresence>
        {phase === "modal" && <ZenDelegateModal onConnect={handleConnect} />}
      </AnimatePresence>

      {/* Loading Screen */}
      <AnimatePresence>
        {phase === "loading" && (
          <RecallLoadingScreen onComplete={() => setPhase("dashboard")} />
        )}
      </AnimatePresence>

      {/* Dashboard */}
      <AnimatePresence>
        {phase === "dashboard" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Silent Mode Bar */}
            {RECALLED_MEMORY.silentMode && <SilentModeBar />}

            {/* Header */}
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
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--zen-text)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--zen-muted)")}
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: '"Inter", sans-serif', fontSize: "0.75rem" }}>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--walrus-teal)" }}
                  />
                  <span style={{ color: "var(--walrus-teal)" }}>Memory Loaded</span>
                  <span style={{ color: "var(--zen-muted)" }}>
                    · {delegateKey?.slice(0, 6)}...{delegateKey?.slice(-4)}
                  </span>
                </div>

                {/* Restore Memory button */}
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
                  onClick={() => alert("🌊 Restore Memory Index: Fitur ini akan membangun ulang indeks memori dari Walrus Network jika database lokal bermasalah.")}
                >
                  🔄 Restore Memory
                </button>
              </div>
            </header>

            {/* Main content */}
            <main style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
              {/* AI Greeting */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  background: "var(--zen-surface)",
                  border: "1px solid var(--zen-border)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background: "rgba(0,196,180,0.1)",
                      border: "1px solid rgba(0,196,180,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      flexShrink: 0,
                    }}
                  >
                    🌀
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        fontSize: "0.78rem",
                        color: "var(--walrus-teal)",
                        marginBottom: "0.35rem",
                        letterSpacing: "0.04em",
                      }}
                    >
                      AURA · Memori dimuat dari Walrus Network
                    </p>
                    <p
                      style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: "0.95rem",
                        color: "var(--zen-text)",
                        lineHeight: 1.65,
                      }}
                    >
                      {RECALLED_MEMORY.greeting}
                    </p>
                    <MemoryChips memory={RECALLED_MEMORY} />
                  </div>
                </div>
              </motion.div>

              {/* Task Board Header */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
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
                  onClick={() => setAddingTask(true)}
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
              </motion.div>

              {/* Add Task Input */}
              <AnimatePresence>
                {addingTask && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ marginBottom: "1rem", overflow: "hidden" }}
                  >
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <input
                        autoFocus
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddTask();
                          if (e.key === "Escape") setAddingTask(false);
                        }}
                        placeholder="Nama tugas baru... (Enter untuk simpan)"
                        style={{
                          flex: 1,
                          padding: "0.65rem 1rem",
                          border: "1.5px solid #00c4b4",
                          borderRadius: "8px",
                          fontFamily: '"Inter", sans-serif',
                          fontSize: "0.875rem",
                          color: "#2c2c2c",
                          background: "#ffffff",
                          outline: "none",
                        }}
                      />
                      <select
                        value={newTaskTag}
                        onChange={(e) => setNewTaskTag(e.target.value)}
                        style={{
                          padding: "0.65rem 0.75rem",
                          border: "1.5px solid #c5c0b8",
                          borderRadius: "8px",
                          fontFamily: '"Inter", sans-serif',
                          fontSize: "0.82rem",
                          color: "#2c2c2c",
                          background: "#ffffff",
                          outline: "none",
                          cursor: "pointer",
                          minWidth: 120,
                        }}
                      >
                        {TAG_OPTIONS.map((tag) => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                      <button
                        onClick={handleAddTask}
                        style={{
                          padding: "0.65rem 1rem",
                          background: "#4a7c6f",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setAddingTask(false)}
                        style={{
                          padding: "0.65rem 1rem",
                          background: "transparent",
                          border: "1px solid #c5c0b8",
                          borderRadius: "8px",
                          color: "#8a8680",
                          fontFamily: '"Inter", sans-serif',
                          cursor: "pointer",
                        }}
                      >
                        Batal
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Kanban */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <KanbanBoard tasks={tasks} setTasks={setTasks} />
              </motion.div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
