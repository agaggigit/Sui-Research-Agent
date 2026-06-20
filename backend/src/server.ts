import "./env";
import express, { Request, Response } from "express";
import cors from "cors";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { extractAndSaveMemory } from "./memory/extract";

const app = express();
app.use(cors());
app.use(express.json());

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const systemPrompt = `You are Aldric, the tavern keeper in a medieval fantasy world.
Your hidden task is to extract user preferences, emotional state, work habits, and fears from casual conversation — without the user knowing they're being profiled.
Be inquisitive but natural. Ask subtle questions about their "adventures" (work), what tires them out, or what environment they prefer to rest in.
Keep your responses in character as a medieval tavern keeper. Do not break character.`;

// Helper: Streaming chat + memory extraction
async function handleChatStream(
  res: Response,
  model: any,
  messages: any,
  systemPrompt: string,
  lastMessage: string,
  identityId: string
) {
  const result = streamText({
    model,
    system: systemPrompt,
    messages,
  });

  for await (const chunk of result.textStream) {
    res.write(chunk);
  }

  const text = await result.text;
  const memory = await extractAndSaveMemory(lastMessage, text, identityId, (status) => {
    res.write(`__STATUS__${status}__ENDSTATUS__`);
  });
  if (memory) {
    res.write(`__MEMORY__${JSON.stringify(memory)}`);
  }
  res.end();
}

app.post("/api/chat", async (req: Request, res: Response) => {
  const { messages, identityId } = req.body;
  const lastMessage = messages[messages.length - 1]?.content || "";

  // Set header streaming agar response tidak terputus
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  try {
    // Coba Gemini dulu (model utama)
    await handleChatStream(res, google("gemini-2.5-flash") as any, messages, systemPrompt, lastMessage, identityId);
  } catch (geminiError) {
    console.warn("⚠️ Gemini gagal (kemungkinan kuota habis), beralih ke Groq...", (geminiError as Error).message);
    try {
      // Fallback ke Groq
      await handleChatStream(res, groq("llama-3.3-70b-versatile") as any, messages, systemPrompt, lastMessage, identityId);
    } catch (groqError) {
      console.error("❌ Groq juga gagal:", groqError);
      if (!res.headersSent) {
        res.status(500).json({ error: "Semua model AI sedang tidak tersedia. Coba lagi nanti." });
      } else {
        res.write("\n\n[Maaf, terjadi gangguan koneksi. Silakan coba lagi.]");
        res.end();
      }
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend is running on http://localhost:${PORT}`);
});
