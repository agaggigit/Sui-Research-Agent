# 📝 Backend Changelog (Log Perubahan)

Dokumen ini adalah rangkuman utama (*master log*) dari semua perubahan yang telah kita lakukan di bagian Backend proyek ini. Poin-poin di bawah ini akan terus ditambahkan setiap kali kita melakukan modifikasi baru.

## [21 Juni 2026] - Implementasi Cross-Agent Recall (Minggu 3)
- **Modul Penarik Memori (Backend)**:
  - Membuat `src/memory/recall.ts` untuk memanggil Sui RPC, melacak `MemoryAttested` *events*, membuang memori yang sudah di-`Revoke`, dan mengunduh data *blob* asli dari Walrus Network menggunakan `@aura-identity/sdk`.
- **API Endpoint Baru (Backend)**:
  - Menambahkan rute `POST /api/recall` di `src/server.ts`. Rute ini menyuntikkan (inject) memori mentah pengguna dari Walrus langsung ke dalam instruksi *system prompt* Nex-N2-Pro (OpenRouter).
  - AI akan memproses memori mentah dan menghasilkan profil dinamis untuk disajikan ke *Dashboard*, mencakup: sapaan personal, kondisi emosi, dan penentuan aktivasi *Silent Mode*.
- **Integrasi Zen Board (Frontend)**:
  - Merombak halaman `frontend/src/app/demo/zenboard/page.tsx` dengan membuang penggunaan data *dummy/hardcode*.
  - Menambahkan *Loading State* dinamis saat proses pengambilan memori dari Web3 berlangsung.
  - Memastikan *Dashboard* dirender menggunakan data AI asli yang diperoleh dari fungsi *Recall*.

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
