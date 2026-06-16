# 🤖 AI Agents & Scripts

Folder ini didedikasikan untuk AI Agents (Pekerja Cerdas) mandiri dan berbagai *scripts* pengujian yang tidak tergabung secara langsung ke dalam alur UI/API utama.

## 🎯 Tujuan Folder Ini
Aplikasi riset AURA di masa depan akan memiliki banyak pekerja asinkron (misalnya *agent* yang berjalan di *background* untuk menganalisis data, merangkum PDF, atau berinteraksi secara otonom di blockchain). Seluruh logika agen otonom ini ditempatkan di sini agar tidak membebani API Web (Backend).

## 📂 Struktur Saat Ini
- `/scripts/`: Memuat file uji coba dan eksperimentasi, contohnya `test-chat.ts` (menguji LLM secara Command Line) dan `test-memwal.ts` (eksperimen awal untuk menghubungkan ke Walrus Protocol).

## 📜 Aturan Pengerjaan di Folder Ini
1. **Script Mandiri**: File yang dibuat di sini harus bisa dijalankan secara independen melalui Command Line (contoh: `node agent.js` atau `python agent.py`).
2. **Fleksibilitas Bahasa**: Karena sifatnya yang independen, folder ini mengizinkan penggunaan bahasa selain TypeScript (seperti Python) jika dirasa lebih kuat untuk kebutuhan riset/AI tertentu.
3. **Eksperimentasi Bebas**: Ini adalah *sandbox* utama. Bebas berekspresimen dengan *library* baru di sini sebelum memindahkannya ke sistem *Backend* produksi.
