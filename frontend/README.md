# 🎨 Frontend UI (AURA)

Folder ini memuat seluruh antarmuka pengguna (User Interface) aplikasi AURA. Dibangun menggunakan **Next.js (App Router)** dan **React**.

## 🌟 Konsep Halaman Utama

Aplikasi ini memiliki dualitas visual yang ekstrem:
1. **`/tavern` (Kedai Jiwa)**: Tema gelap, *rustic*, dan ala abad pertengahan (Dark Souls). Digunakan untuk *chat* santai dengan AI (Aldric) yang akan memprofiling memori pengguna secara diam-diam.
2. **`/zenboard` (Papan Fokus)**: Tema terang, minimalis, dan sangat bersih ala kalender produktivitas modern. Digunakan untuk manajemen tugas (Kanban Board) dan merefleksikan kembali memori kerja yang diekstrak di kedai.

## 🛠 Teknologi Utama
- **Framework**: Next.js 16 + React 19
- **Styling**: Vanilla CSS (CSS Variables) + TailwindCSS v4
- **Animasi**: Framer Motion
- **Drag & Drop**: `@dnd-kit/core`

## 📜 Aturan Pengerjaan di Folder Ini
1. **Murni UI Saja**: Jangan melakukan panggilan langsung ke library AI (seperti mengimpor model Gemini) dari sini. *Frontend* HANYA boleh melakukan pemanggilan (Fetch API) ke *Backend*.
2. **Aesthetics are King**: Desain harus selalu terasa premium. Gunakan micro-animations, efek *hover*, transisi halus, dan hierarki tipografi yang ketat.
3. **No Heavy Logic**: Jika ada pemrosesan teks, komputasi yang berat, atau logika AI, pindahkan ke `backend/`.

## 🚀 Cara Menjalankan
```bash
cd frontend
npm run dev
```
Buka browser dan arahkan ke `http://localhost:3000`. (Pastikan backend juga menyala agar API chat dapat berfungsi).
