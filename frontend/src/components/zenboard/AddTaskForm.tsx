"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TAG_OPTIONS } from "@/types/zenboard";

interface AddTaskFormProps {
  visible: boolean;
  title: string;
  tag: string;
  onTitleChange: (v: string) => void;
  onTagChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function AddTaskForm({
  visible,
  title,
  tag,
  onTitleChange,
  onTagChange,
  onSave,
  onCancel,
}: AddTaskFormProps) {
  return (
    <AnimatePresence>
      {visible && (
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
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSave();
                if (e.key === "Escape") onCancel();
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
              value={tag}
              onChange={(e) => onTagChange(e.target.value)}
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
              {TAG_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button
              onClick={onSave}
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
              onClick={onCancel}
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
  );
}
