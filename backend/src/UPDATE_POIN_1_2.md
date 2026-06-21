# 🚀 Update: Tugas Poin 1 & Poin 2 (Setup API & System Prompt)

Dokumen ini menjelaskan perubahan yang telah dilakukan di level _router/server_ utama pada folder `backend/src/` untuk mendukung integrasi AI dan Walrus.

## File yang Diubah: `server.ts`

### 1. Setup Environment Variables untuk Integrasi AI
- **Tujuan:** Memastikan AI SDK (Google Gemini / Groq) dan MemWal SDK bisa membaca _API Keys_ dan _Secret Keys_ dengan benar.
- **Perubahan Kode:**
  - Memodifikasi inisialisasi `dotenv`. Sebelumnya hanya menggunakan `dotenv.config()`, sekarang menggunakan `dotenv.config({ path: path.resolve(process.cwd(), "../.env.local") })`.
  - Ini memastikan bahwa saat server dijalankan (baik lewat `tsx` maupun di _production_), ia akan selalu mencari file `.env.local` yang berada di _root folder_ utama proyek (satu tingkat di atas folder `backend`).

### 2. Poin 1: Penyesuaian Persona AI (System Prompt)
- **Tujuan:** Mengarahkan "otak" AI agar bertingkah layaknya Aldric sang penjaga kedai yang ahli memancing informasi dari pengguna.
- **Perubahan Kode:**
  - Mengubah variabel `systemPrompt` menjadi lebih spesifik.
  - AI sekarang diberi "tugas rahasia" (*hidden task*) untuk menggali preferensi pengguna, kondisi emosional, kebiasaan kerja, dan ketakutan dari obrolan kasual, tanpa membuat pengguna sadar bahwa mereka sedang diprofilkan.

### 📝 Catatan Penting untuk Tim Frontend:
Untuk saat ini, fitur **Tugas 3 (Pengiriman Status Loading/Streaming)** BELUM diimplementasikan karena kode `server.ts` dikembalikan ke mode `pipeTextStreamToResponse` standar. Saat tim _Frontend_ sudah siap menyambungkan UI dengan _Backend_ asli (lepas dari _Mock Data_), koordinasikan kembali dengan tim _Backend_ untuk mengubah cara respons API ini dikirimkan.

---
## Update Terbaru: 21 Juni 2026
### 3. Migrasi Fallback LLM (Groq ke OpenRouter)
- Mengganti logika `catch` *fallback* saat kuota Gemini API habis.
- Membuang provider Groq karena ketidakcocokan dalam merender *JSON Schema* secara disiplin.
- Memasangkan `@openrouter/ai-sdk-provider` dengan model `nex-agi/nex-n2-pro:free` untuk mengambil alih _streaming chat_ jika model utama gagal.
