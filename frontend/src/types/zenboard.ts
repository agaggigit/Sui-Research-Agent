// Tipe data untuk Zenboard

export type TaskStatus = "todo" | "inprogress" | "done";

export type Task = {
  id: string;
  title: string;
  tag: string;
  status: TaskStatus;
};

export type MemoryProfile = {
  occupation: string;
  emotionalState: string;
  workPreference: string;
  greeting: string;
  silentMode: boolean;
  tasks: Task[];
};

export const TAG_OPTIONS = [
  "Frontend",
  "Backend",
  "Web3",
  "Bug Fix",
  "Code Review",
  "Docs",
  "Design",
  "Setup",
];

export const TAG_COLORS: Record<string, string> = {
  "Code Review": "#6fbcf0",
  "Bug Fix": "#f87171",
  Docs: "#a78bfa",
  Frontend: "#f59e0b",
  Web3: "#00c4b4",
  Design: "#f472b6",
  Setup: "#6bcb77",
};

export const KANBAN_COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "#6b7280" },
  { id: "inprogress", label: "In Progress", color: "#f59e0b" },
  { id: "done", label: "Done", color: "#6bcb77" },
];

// Simulasi data yang di-recall dari Walrus Network
export const RECALLED_MEMORY: MemoryProfile = {
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
