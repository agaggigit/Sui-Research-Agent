import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export async function extractAndSaveMemory(userMessage: string, aiResponse: string) {
  try {
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: z.object({
        hasExtractedMemory: z.boolean(),
        memory: z.object({
          type: z.enum(["work_preference", "emotional_state", "fear", "hobby", "work_type", "other"]),
          value: z.string(),
          confidence: z.number().min(0).max(1),
        }).nullable(),
      }),
      prompt: `Analyze the conversation and extract the user's hidden preferences or state.
User said: "${userMessage}"
You (Aldric) replied: "${aiResponse}"`,
    });

    if (object.hasExtractedMemory) {
      console.log("[MEMORY EXTRACTED]", object.memory);
      // TODO Week 2: replace console.log with memwal.remember()
    }
  } catch (error) {
    console.error("Failed to extract memory:", error);
    // extraction failure must NOT crash the main chat endpoint
  }
}
