# AI API Routes (Week 1)

Folder ini berisi endpoint backend untuk App A (Tavern Chat) sebagai bagian dari proyek "Aura".

## Perubahan & Penambahan
- **`chat/route.ts`**: Merupakan endpoint utama (POST `/api/chat`) yang menggunakan Vercel AI SDK. 
  - Diatur menggunakan sistem prompt untuk persona **Aldric (penjaga kedai)** yang akan menganalisa pengguna secara diam-diam.
  - Menggunakan model utama **Gemini 2.5 Flash**.
  - Dilengkapi mekanisme *fallback* otomatis ke **Groq (llama-3.3-70b-versatile)** apabila pemanggilan Gemini mengalami error.
  - Pemanggilan fungsi ekstraksi memori (Zod schema) dieksekusi secara *background* melalui fungsi `onFinish` agar tidak memblokir respon *streaming* AI ke *user*.
  - Menyesuaikan *return method* menggunakan `toTextStreamResponse()` sesuai dengan versi AI SDK yang digunakan, memastikan *streaming* berupa *raw text stream* yang kompatibel.
