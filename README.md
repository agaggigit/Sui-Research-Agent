# AURA: Sui-Based Research Agent

Selamat datang di repositori utama **AURA**. Proyek ini adalah sebuah aplikasi Web3 berbasis AI dan jaringan Sui yang dirancang untuk menjadi asisten produktivitas dan riset yang interaktif, memiliki memori jangka panjang (via Walrus), dan memiliki kepribadian (Tavern Keeper & Zen Mode).

## 🏗 Arsitektur Monorepo

Proyek ini menggunakan arsitektur pemisahan sistem (Microservices-style) untuk menjaga kode tetap bersih, mudah di- *scale*, dan mencegah bentrok konfigurasi.

Berikut adalah struktur utama direktori kita:

- 📂 **[`/frontend`](./frontend/)** - Aplikasi Web (UI) menggunakan Next.js. Di sinilah semua desain visual, komponen antarmuka, dan interaksi pengguna terjadi.
- 📂 **[`/backend`](./backend/)** - Server API menggunakan Node.js Express. Bertanggung jawab mengatur logika LLM (Vercel AI SDK), koneksi ke model AI (Gemini/Groq), dan ekstraksi memori.
- 📂 **[`/agents`](./agents/)** - Script terpisah, *worker*, atau AI Agent spesifik (bisa berupa Python/Node) yang berjalan independen di luar server API utama.
- 📂 **[`/contracts`](./contracts/)** - Kode Smart Contract untuk jaringan Sui (menggunakan bahasa pemrograman Move).

## 🚀 Cara Menjalankan Proyek Secara Lokal

Karena *Frontend* dan *Backend* dipisah, kamu perlu menjalankan dua proses secara bersamaan di terminal yang berbeda.

### Terminal 1: Backend
Masuk ke folder `backend`, lalu jalankan server API (secara *default* akan berjalan di `http://localhost:3001`):
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
Buka terminal baru, masuk ke folder `frontend`, lalu jalankan *server* Next.js (berjalan di `http://localhost:3000`):
```bash
cd frontend
npm run dev
```

## 📜 Aturan Umum Kontribusi
1. **Jangan gabungkan *dependencies*:** Pastikan instalasi library React hanya di dalam `frontend/package.json` dan library server di `backend/package.json`. Jangan meletakkan `package.json` di *root directory*.
2. **Perhatikan Port:** Selalu pastikan port 3000 dan 3001 kosong sebelum menjalankan *script* *development*.
3. **Penyimpanan `.env`:** Simpan API Key AI (Gemini/Groq) di dalam file `backend/.env`.