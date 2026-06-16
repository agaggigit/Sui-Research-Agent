# Memory Extraction Helpers (Week 1)

Folder ini berisi modul-modul utilitas untuk memproses memori AI.

## Perubahan & Penambahan
- **`extract.ts`**: Berisi fungsi `extractAndSaveMemory` yang bertanggung jawab mengekstrak data preferensi dari interaksi *user* dan *AI*.
  - Menggunakan fungsi `generateObject` dari AI SDK yang dipadukan dengan **Zod**.
  - Mengekstrak memori terstruktur berdasarkan enum spesifik (`work_preference`, `emotional_state`, `fear`, dll).
  - Dibungkus dengan `try/catch` berlapis sehingga bila proses ekstraksi gagal, aplikasi chat (endpoint utama) tidak ikut *crash*.
  - Menempatkan *TODO* untuk integrasi `memwal.remember()` pada Minggu ke-2.
