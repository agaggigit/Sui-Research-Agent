# 🔄 Migrasi Fallback LLM: Groq → OpenRouter

## Latar Belakang Masalah
Groq API **tidak mendukung `json_schema`** (structured output) secara konsisten di model gratisnya. Fitur ini krusial karena dipakai oleh `generateObject()` dari Vercel AI SDK di file `extract.ts` untuk memaksa AI menghasilkan JSON terstruktur saat mengekstrak memori pengguna.

Dampaknya: Saat Gemini kena limit dan fallback ke Groq, proses **ekstraksi memori ke Walrus gagal total** karena output AI tidak bisa divalidasi terhadap Zod Schema.

## Solusi
Mengganti **Groq** dengan **OpenRouter** sebagai fallback LLM provider. Model yang dipilih:

| Penggunaan | Model | Alasan |
|---|---|---|
| **Chat Streaming** (fallback) | `google/gemma-4-26b-a4b-it:free` | Gratis, 262K context, MoE 26B param |
| **Memory Extraction** (fallback) | `google/gemma-4-26b-a4b-it:free` | ✅ Mendukung **structured output / json_schema** |

## File yang Diubah

### 1. `src/server.ts`
- **Import:** `@ai-sdk/groq` → `@openrouter/ai-sdk-provider`
- **Inisialisasi:** `createGroq({...})` → `createOpenRouter({...})`
- **Env var:** `GROQ_API_KEY` → `OPENROUTER_API_KEY`
- **Model fallback chat:** `groq("llama-3.3-70b-versatile")` → `openrouter("google/gemma-4-26b-a4b-it:free")`
- **Gemini TIDAK diubah** — tetap `google("gemini-2.5-flash")` sebagai model utama.

### 2. `src/memory/extract.ts`
- **Import:** `@ai-sdk/groq` → `@openrouter/ai-sdk-provider`
- **Factory:** `getGroqExtract()` → `getOpenRouterExtract()`
- **Model fallback ekstraksi:** `getGroqExtract()('llama-3.1-8b-instant')` → `getOpenRouterExtract()('google/gemma-4-26b-a4b-it:free')`
- **Gemini TIDAK diubah** — tetap `google('gemini-2.5-flash')` sebagai model utama.

### 3. `.env.local`
- **Dihapus:** `GROQ_API_KEY=...`
- **Ditambah:** `OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY_HERE`

### 4. `package.json`
- **Dihapus:** `@ai-sdk/groq`
- **Ditambah:** `@openrouter/ai-sdk-provider`

## Cara Setup
1. Buat akun di [OpenRouter](https://openrouter.ai/)
2. Generate API Key di dashboard
3. Isi `OPENROUTER_API_KEY` di file `backend/.env.local`
4. Jalankan `npm run dev` di folder `backend/`

## Alur Kerja (Tidak Berubah)
```
Gemini (utama) → gagal? → OpenRouter Gemma 4 26B (fallback) → gagal? → Error 500
```
