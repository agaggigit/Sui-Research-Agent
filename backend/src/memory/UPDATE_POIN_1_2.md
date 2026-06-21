# 🚀 Update: Tugas Poin 1 & 2 (Integrasi AI & Walrus)

Dokumen ini dibuat agar anggota tim dapat dengan mudah memahami apa saja yang telah dikerjakan pada folder `backend/src/memory/` untuk memenuhi target MVP (Minimum Viable Product).

## File yang Diubah: `extract.ts`

### 1. Poin 1: Memperkaya Metadata & Prompt (Zod Schema)
- **Tujuan:** Membuat AI mengekstrak data memori pengguna secara kaya (kontekstual), bukan sekadar kata kunci pendek, agar *Semantic Search* (Pencarian Vektor) di Walrus nanti bisa bekerja dengan maksimal.
- **Perubahan Kode:**
  - Menambahkan _tags_ (`z.array(z.string())`) untuk klasifikasi.
  - Menambahkan _related_to_ (`z.array(z.string())`) untuk relasi grafik memori.
  - Mengubah deskripsi _value_ agar AI wajib menjawab dengan "Kalimat lengkap dan deskriptif mengenai preferensi, kebiasaan, atau kondisi user."
  - Memperbarui `prompt` agar secara spesifik menginstruksikan AI untuk mencari "preferensi gaya kerja", "kondisi emosional", dan "ketakutan".

### 2. Poin 2: Integrasi Penulisan ke Blockchain (memwal.remember)
- **Tujuan:** Menghubungkan agen AI secara langsung ke jaringan *Sui Testnet* dan *Walrus Storage* menggunakan SDK resmi `@mysten-incubation/memwal`.
- **Perubahan Kode:**
  - Menggunakan **Dynamic Import** (`await import('@mysten-incubation/memwal')`) di dalam fungsi `extractAndSaveMemory` untuk menghindari masalah kompatibilitas ESM di lingkungan Node.js.
  - Menginisialisasi `MemWal` Client menggunakan kunci rahasia dari `process.env.AURA_SERVER_SECRET` dengan _fallback_ string palsu agar server tidak _crash_ jika _environment variable_ belum diatur.
  - Memanggil `memwal.remember(object.memory)` secara otomatis di dalam blok `if (object.hasExtractedMemory)` setiap kali AI mendeteksi adanya memori penting dari percakapan.
  - Menambahkan blok `try-catch` sehingga jika transaksi ke _blockchain_ gagal (misalnya karena kunci salah atau saldo koin Testnet habis), API Chat tidak akan _crash_ dan pengguna tetap bisa mengobrol.

### 📝 Catatan Penting untuk Tim Web3 / Backend:
Agar fitur ini benar-benar bisa menulis ke _blockchain_ (tidak berhenti di tahap _error_ "Uint8Array expected"), kalian **WAJIB** menambahkan variabel `AURA_SERVER_SECRET` di file `/.env.local` (di root proyek) yang berisi kunci rahasia (Private Key) Sui milik server. Kunci ini harus dalam format _byte array_ atau _hex_ yang sah sesuai standar `Ed25519` dari SDK `MemWal`.

---
## Update Terbaru: 21 Juni 2026
### 3. Migrasi LLM dan Sinkronisasi Kontrak Blockchain
- **OpenRouter Fallback**: Menyingkirkan Groq (yang bermasalah pada `json_schema`) dan menggantinya dengan `@openrouter/ai-sdk-provider` (Model `nex-agi/nex-n2-pro:free`) untuk `generateObject` ekstraksi memori.
- **Update Package ID**: Memperbarui variabel `packageId` menjadi `0xa06895fe1ff9c0301aaadad6c2c1c5e9e02c28e40f4e055a487d65de079ff88a` untuk menyinkronkan dengan *Smart Contract* Identity versi terbaru di Sui Testnet.
