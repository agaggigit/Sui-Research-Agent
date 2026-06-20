import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { AuraClient } from '@aura-identity/sdk';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

const aura = new AuraClient({
  network: 'testnet',
  packageId: '0xc3427de7ebf039e490518bed162baf864bc2d15a09bd0636449129e1e71e5d14'
});

let signer: any = null;
try {
  if (process.env.AURA_SERVER_SECRET) {
    signer = Ed25519Keypair.fromSecretKey(process.env.AURA_SERVER_SECRET);
  }
} catch (e) {
  console.warn("Warning: Invalid or missing AURA_SERVER_SECRET. Walrus saving will run in mock mode.");
}

export async function extractAndSaveMemory(
  userMessage: string,
  aiResponse: string,
  identityId: string = "0x00",
  onStatus?: (status: string) => void
) {
  try {
    if (onStatus) onStatus("extracting");
    
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: z.object({
        hasExtractedMemory: z.boolean(),
        memory: z.object({
          type: z.enum(["work_pref", "personal_info", "hobby", "emotional_state", "fear", "other"]),
          value: z.string().describe("A rich, detailed sentence explaining the full context. E.g., 'The user is a React programmer who hates loud notifications because they ruin focus.'"),
          tags: z.array(z.string()).describe("General labels for semantic search, e.g., ['work', 'focus', 'environment']"),
          related_to: z.array(z.string()).describe("Keys for building Visual Memory Graph relationships, e.g., ['stress', 'deep_work']"),
          confidence: z.number().min(0).max(1),
        }).nullable(),
      }),
      prompt: `Analyze the conversation and extract the user's hidden preferences, state, or work habits.
CRITICAL: Generate rich contextual metadata designed for Walrus semantic search (vector embeddings).
Do NOT just output short keywords for 'value'. Explain the context, the "why", and the "who".

User said: "${userMessage}"
You (Aldric) replied: "${aiResponse}"`,
    });

    if (object.hasExtractedMemory && object.memory) {
      console.log("[MEMORY EXTRACTED]", object.memory);
      
      try {
        if (onStatus) onStatus("encrypting");
        console.log("🔗 Mengirim data ke Walrus Network via Aura Identity SDK...");
        if (onStatus) onStatus("uploading");
        
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
    return null;
  }
}
