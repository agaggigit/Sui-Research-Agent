# 📝 Backend Changelog (Log Perubahan)

Dokumen ini adalah rangkuman utama (*master log*) dari semua perubahan yang telah kita lakukan di bagian Backend proyek ini. Poin-poin di bawah ini akan terus ditambahkan setiap kali kita melakukan modifikasi baru.

## [21 Juni 2026] - Migrasi LLM OpenRouter & Update Contract ID
- **Migrasi Fallback LLM (Groq ke OpenRouter)**:
  - Mengganti *provider fallback* dari `@ai-sdk/groq` menjadi `@openrouter/ai-sdk-provider` karena model Llama di Groq bermasalah dalam menangani *Structured Output (JSON Schema)*.
  - Memperbarui file `src/server.ts` dan `src/memory/extract.ts` agar menggunakan model `nex-agi/nex-n2-pro:free` dari OpenRouter sebagai cadangan (jika Gemini API terkena limit).
  - Mengubah _Environment Variable_ di `.env.local` dari `GROQ_API_KEY` menjadi `OPENROUTER_API_KEY`.
- **Update Aura Identity Contract ID**:
  - Memperbarui parameter `packageId` di dalam `extract.ts` dan `test-aura.ts` menjadi `0xa06895fe1ff9c0301aaadad6c2c1c5e9e02c28e40f4e055a487d65de079ff88a`, menyesuaikan dengan *deployment Smart Contract* terbaru dari rekan Web3 di jaringan Sui Testnet.
- **Pengujian (Testing)**:
  - Melakukan uji coba aliran data secara *End-to-End* lewat skrip `test-memory.ts`. Berhasil membuktikan bahwa model Nex-N2-Pro via OpenRouter sanggup mengekstrak memori ke format JSON yang valid.

## [Sebelumnya] - Integrasi Walrus SDK & Prompting Gemini
- Mengubah alur inisialisasi `.env.local` agar bisa dibaca dari _root_ proyek utama.
- Menyuntikkan *System Prompt* (persona Aldric sang penjaga kedai) di `src/server.ts` untuk memancing preferensi *user*.
- Membuat *Zod Schema* kompleks (memuat `tags`, `related_to`, dsb) di `src/memory/extract.ts` untuk keperluan vektor *Semantic Search* Walrus.
- Mengimplementasikan pemanggilan fungsi Web3 `aura.remember` untuk mengamankan fakta yang terdeteksi AI secara langsung ke _blockchain_ Sui dan _storage_ Walrus.
- Membuat skrip *testing* independen (`test-memory.ts` dan `test-aura.ts`).
