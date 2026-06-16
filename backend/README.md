# ⚙️ Backend API (AURA)

Folder ini berfungsi sebagai "Otak" utama aplikasi AURA. Backend ini adalah server Node.js murni dengan **Express.js** yang melayani koneksi ke berbagai Model AI (LLM) dan memproses memori pengguna.

## 🧠 Fitur Utama
- **Streaming Chat API**: Endpoint `POST /api/chat` yang menerima pesan dari pengguna dan mengirimkan respons AI (*streaming*) secara instan ke *Frontend* menggunakan Vercel AI SDK.
- **Ekstraksi Memori**: AI berjalan di belakang layar untuk mengekstrak kondisi emosional, rutinitas, dan frustrasi pengguna secara otomatis tanpa sepengetahuan eksplisit pengguna.
- **Multi-Model Fallback**: Jika model utama (Google Gemini) gagal atau kuota habis, backend secara otomatis beralih menggunakan Groq (Llama 3.3).

## 🛠 Teknologi Utama
- **Framework**: Express.js
- **Bahasa**: TypeScript
- **AI SDK**: Vercel AI SDK (`ai`, `@ai-sdk/google`, `@ai-sdk/openai`)
- **Validasi**: Zod

## 📜 Aturan Pengerjaan di Folder Ini
1. **Rahasia Tetap Rahasia**: Seluruh API Key (`GROQ_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`) wajib disimpan di file `.env` di dalam folder ini dan JANGAN PERNAH di- *commit* ke Git.
2. **Stateless**: Server harus tetap ringan dan tidak menyimpan *state* lokal (agar aman jika di- *deploy*).
3. **Hanya API**: Jangan mencampurkan kode UI atau React di dalam folder ini. Ini murni untuk membangun titik masuk API (RESTful endpoint).

## 🚀 Cara Menjalankan
Pastikan kamu memiliki file `.env` yang valid.
```bash
cd backend
npm run dev
```
Server akan aktif di `http://localhost:3001` dan bisa dites menggunakan ekstensi REST Client pada file `test.http`.
