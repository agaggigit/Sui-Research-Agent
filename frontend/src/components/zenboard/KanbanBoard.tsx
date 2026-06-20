"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
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
import { Task, TaskStatus, KANBAN_COLUMNS, TAG_COLORS } from "@/types/zenboard";

/* ---- Task Card ---- */
function TaskCard({ task, overlay = false }: { task: Task; overlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
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
          background: `${TAG_COLORS[task.tag] || "#ccc"}18`,
          color: TAG_COLORS[task.tag] || "#888",
          border: `1px solid ${TAG_COLORS[task.tag] || "#ccc"}40`,
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

/* ---- Droppable Column Wrapper ---- */
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

/* ---- Main Kanban Board ---- */
export default function KanbanBoard({
  tasks,
  setTasks,
}: {
  tasks: Task[];
  setTasks: (t: Task[]) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
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
    const targetCol = KANBAN_COLUMNS.find((c) => c.id === overId);

    if (targetCol) {
      if (draggedTask.status !== targetCol.id) {
        setTasks(
          tasks.map((t) => (t.id === draggedTask.id ? { ...t, status: targetCol.id } : t))
        );
      }
      return;
    }

    const overTask = tasks.find((t) => t.id === overId);
    if (!overTask) return;

    if (draggedTask.status === overTask.status) {
      const colTasks = tasks.filter((t) => t.status === draggedTask.status);
      const oldIdx = colTasks.findIndex((t) => t.id === active.id);
      const newIdx = colTasks.findIndex((t) => t.id === overId);
      const reordered = arrayMove(colTasks, oldIdx, newIdx);
      setTasks([...tasks.filter((t) => t.status !== draggedTask.status), ...reordered]);
    } else {
      setTasks(
        tasks.map((t) => (t.id === draggedTask.id ? { ...t, status: overTask.status as TaskStatus } : t))
      );
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
        {KANBAN_COLUMNS.map((col) => {
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

              {/* Cards */}
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
