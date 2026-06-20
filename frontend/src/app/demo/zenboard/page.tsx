"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuraWidget from "@/components/AuraWidget";
import DelegateKeyModal from "@/components/DelegateKeyModal";
import SilentModeBar from "@/components/zenboard/SilentModeBar";
import MemoryChips from "@/components/zenboard/MemoryChips";
import KanbanBoard from "@/components/zenboard/KanbanBoard";
import AddTaskForm from "@/components/zenboard/AddTaskForm";
import ZenHeader from "@/components/zenboard/ZenHeader";
import { useAuraChat } from "@/hooks/useAuraChat";
import { RECALLED_MEMORY, Task } from "@/types/zenboard";

export default function ZenBoardPage() {
  const [phase, setPhase] = useState<"modal" | "dashboard">("modal");
  const [delegateKey, setDelegateKey] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>(RECALLED_MEMORY.tasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTag, setNewTaskTag] = useState("Frontend");
  const [addingTask, setAddingTask] = useState(false);

  const { messages, setMessages, input, setInput, memoryStatus, sendMessage } =
    useAuraChat(delegateKey);

  // Set welcome message on first connect
  const handleConnect = (key: string) => {
    setDelegateKey(key);
    setMessages([
      {
        id: "welcome",
        role: "ai",
        content: RECALLED_MEMORY.greeting,
        timestamp: new Date(),
      },
    ]);
    setPhase("dashboard");
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
      {/* Delegate Key Modal */}
      <AnimatePresence>
        {phase === "modal" && (
          <DelegateKeyModal
            theme="light"
            onConnect={handleConnect}
            title="Hubungkan Identitas Aura"
            description="Masukkan Delegate Key yang sama seperti di Tavern untuk menarik memorimu dari Walrus Network."
            submitLabel="Sambungkan & Tarik Memori →"
            icon="🪴"
          />
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
            {RECALLED_MEMORY.silentMode && <SilentModeBar />}

            <ZenHeader
              delegateKey={delegateKey!}
              onAddTask={() => setAddingTask(true)}
            />

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

              {/* Add Task Form */}
              <AddTaskForm
                visible={addingTask}
                title={newTaskTitle}
                tag={newTaskTag}
                onTitleChange={setNewTaskTitle}
                onTagChange={setNewTaskTag}
                onSave={handleAddTask}
                onCancel={() => setAddingTask(false)}
              />

              {/* Kanban Board */}
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

      {/* AuraWidget Light Mode */}
      {phase === "dashboard" && delegateKey && (
        <AuraWidget
          theme="light"
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
