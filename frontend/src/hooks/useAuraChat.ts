"use client";

import { useState } from "react";
import { Message, MemoryStatus } from "@/components/AuraWidget";

export function useAuraChat(delegateKey: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [memoryStatus, setMemoryStatus] = useState<MemoryStatus>("idle");

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
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

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identityId: delegateKey,
          messages: messages.concat(userMsg).map((m) => ({
            role: m.role === "ai" ? "assistant" : m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiResponseText = "";
      const aiMsgId = (Date.now() + 1).toString();

      setMessages((prev) => [
        ...prev,
        { id: aiMsgId, role: "ai", content: "", timestamp: new Date() },
      ]);
      setIsTyping(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        aiResponseText += chunk;

        let statusMatch;
        while ((statusMatch = aiResponseText.match(/__STATUS__(.*?)__ENDSTATUS__/)) !== null) {
          const statusStr = statusMatch[1];
          setMemoryStatus(statusStr as MemoryStatus);
          aiResponseText = aiResponseText.replace(statusMatch[0], "");
        }

        if (aiResponseText.includes("__MEMORY__")) {
          const parts = aiResponseText.split("__MEMORY__");
          const actualText = parts[0];
          try {
            const memData = JSON.parse(parts[1]);
            setMemoryStatus("saved");
            setTimeout(() => setMemoryStatus("idle"), 2500);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aiMsgId ? { ...m, content: actualText, memoryExtracted: memData } : m
              )
            );
            aiResponseText = actualText;
            continue;
          } catch (e) {
            console.error("Failed parsing memory JSON:", e);
          }
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, content: aiResponseText } : m))
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "ai",
          content: "Maaf, koneksi ke asisten terputus. Pastikan server backend menyala.",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }
  };

  return { messages, setMessages, input, setInput, isTyping, memoryStatus, sendMessage };
}
