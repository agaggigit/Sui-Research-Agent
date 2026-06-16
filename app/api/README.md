# AI API Routes (Week 1)

Folder ini berisi endpoint backend untuk App A (Tavern Chat) sebagai bagian dari proyek "Aura".

## Perubahan & Penambahan
- **`chat/route.ts`**: Merupakan endpoint utama (POST `/api/chat`) yang menggunakan Vercel AI SDK. 
  - Diatur menggunakan sistem prompt untuk persona Aldric (penjaga kedai).
  - Menggunakan model utama **Gemini 2.5 Flash**.
  - Terdapat mekanisme *fallback* otomatis ke **Groq (llama-3.3-70b-versatile)** apabila pemanggilan Gemini mengalami kegagalan.
  - Memanggil fungsi ekstrasi memori secara *background* di fungsi `onFinish` agar tidak menghambat aliran *stream* ke pengguna.
