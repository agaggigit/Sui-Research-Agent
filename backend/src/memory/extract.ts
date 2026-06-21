import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { AuraClient } from '@aura-identity/sdk';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Model khusus untuk ekstraksi memori (terpisah dari model chat)
// nex-agi/nex-n2-pro:free dipilih karena mendukung structured output (json_schema) di OpenRouter
// Ref: https://openrouter.ai/models/nex-agi/nex-n2-pro:free
const getOpenRouterExtract = () => createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY || "" });

const getAura = () => new AuraClient({
  network: 'testnet',
  packageId: '0xa06895fe1ff9c0301aaadad6c2c1c5e9e02c28e40f4e055a487d65de079ff88a'
});
const getSigner = () => {
  if (process.env.AURA_SERVER_SECRET) {
    return Ed25519Keypair.fromSecretKey(process.env.AURA_SERVER_SECRET);
  }
  return null;
};

const memorySchema = z.object({
  hasExtractedMemory: z.boolean(),
  memory: z.object({
    type: z.enum(["work_pref", "personal_info", "hobby", "emotional_state", "fear", "other"]),
    value: z.string().describe("A rich, detailed sentence explaining the full context. E.g., 'The user is a React programmer who hates loud notifications because they ruin focus.'"),
    tags: z.array(z.string()).describe("General labels for semantic search, e.g., ['work', 'focus', 'environment']"),
    related_to: z.array(z.string()).describe("Keys for building Visual Memory Graph relationships, e.g., ['stress', 'deep_work']"),
    confidence: z.number().min(0).max(1),
  }).nullable(),
});

const extractionPrompt = `Analyze the conversation and extract the user's hidden preferences, state, or work habits.
CRITICAL: Generate rich contextual metadata designed for Walrus semantic search (vector embeddings).
Do NOT just output short keywords for 'value'. Explain the context, the "why", and the "who".

Return JSON. If no distinct trait is found, set hasExtractedMemory to false and memory to null.`;

export async function extractAndSaveMemory(
  userMessage: string,
  aiResponse: string,
  identityId: string = "0x00",
  onStatus?: (status: string) => void,
) {
  try {
    if (onStatus) onStatus("extracting");
    
    let object;
    try {
      // 1. Coba Gemini dulu (lebih murah & cepat untuk ekstraksi)
      const result = await generateObject({
        model: google('gemini-2.5-flash'),
        schema: memorySchema,
        prompt: extractionPrompt + `\n\nUser: ${userMessage}\nAI: ${aiResponse}`,
      });
      object = result.object;
    } catch {
      console.warn("⚠️ Gemini gagal ekstraksi memori. Beralih ke OpenRouter (Nex-N2-Pro)...");
      try {
        // 2. Fallback ke Nex-N2-Pro via OpenRouter yang MEMANG support structured output (json_schema)
        const result = await generateObject({
          model: getOpenRouterExtract()('nex-agi/nex-n2-pro:free'),
          schema: memorySchema,
          prompt: extractionPrompt + `\n\nUser: ${userMessage}\nAI: ${aiResponse}`,
        });
        object = result.object;
      } catch (openRouterError) {
        console.error("❌ OpenRouter Extract Error (Timeout / Rate Limit):", openRouterError);
        return null; // Gagal total di kedua provider
      }
    }
    
    console.log("🧩 [DEBUG] Hasil ekstraksi AI:", JSON.stringify(object, null, 2));

    if (object.hasExtractedMemory && object.memory) {
      console.log("[MEMORY EXTRACTED]", object.memory);
      
      try {
        if (onStatus) onStatus("encrypting");
        console.log("🔗 Mengirim data ke Walrus Network via Aura Identity SDK...");
        if (onStatus) onStatus("uploading");
        
        const signer = getSigner();
        const aura = getAura();
        
        if (signer) {
          const txResult = await aura.remember(signer, identityId, {
            type: object.memory.type,
            value: object.memory.value,
            source_app: 'tavern_chat',
            confirmed_by_user: true,
            timestamp: new Date().toISOString()
          });
          console.log("✅ Berhasil tersimpan di Walrus Blockchain!", txResult);
        } else {
          // Mock delay for testing without keys
          await new Promise(r => setTimeout(r, 1000));
          console.warn("MOCK: Saved to Walrus (Signer not configured)");
        }
      } catch (walrusError) {
        console.error("❌ Gagal menyimpan ke Walrus:", walrusError);
      }
      return object.memory;
    }
    return null;
  } catch (error) {
    console.error("Failed to extract memory:", error);
    if (onStatus) onStatus("idle");
    return null;
  }
}
