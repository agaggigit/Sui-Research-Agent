# Testing Scripts (Week 1)

Folder ini berisi sekumpulan script CLI untuk mengetes backend tanpa perlu integrasi dari sisi frontend.

## Perubahan & Penambahan
- **`test-chat.ts`**: Script tes manual (simulasi) untuk mencoba fungsionalitas chat secara keseluruhan.
  - Mengirim pesan *hardcoded* seorang *programmer* yang kelelahan (dalam bahasa Indonesia).
  - Mengonsumsi dan menampilkan format *Data Stream* SSE balasan dari endpoint `/api/chat`.
  - Dapat dijalankan dengan command `npx tsx scripts/test-chat.ts`.
- **`test-memwal.ts`**: *Placeholder* untuk mengetes integrasi `memwal` di Sui Blockchain.
  - Disiapkan untuk pengerjaan tahap selanjutnya (Minggu Ke-2).
  - Berisi catatan/TODO yang menyatakan bahwa script ini masih menunggu `DELEGATE_KEY`, versi SDK, dan testnet endpoint dari Web3 Engineer.
