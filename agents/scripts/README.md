# Testing Scripts (Week 1)

Folder ini berisi sekumpulan script CLI untuk mengetes backend tanpa perlu integrasi dari sisi frontend.

## Perubahan & Penambahan
- **`test-chat.ts`**: Script tes manual (simulasi) untuk mencoba fungsionalitas API chat secara keseluruhan.
  - Mengirim pesan *hardcoded* seorang *programmer* yang kelelahan (dalam bahasa Indonesia).
  - Melakukan inisiasi *fetch* lalu membaca *ReadableStream* yang dikembalikan oleh server.
  - Mengonsumsi format *raw text stream* (hasil dari `toTextStreamResponse`) kemudian mencetaknya kata demi kata (*streaming*) ke *console/terminal*.
  - Dapat dijalankan dengan command `npx tsx scripts/test-chat.ts`.
- **`test-memwal.ts`**: *Placeholder* untuk mengetes integrasi `memwal` (penyimpanan memori on-chain) di Sui Blockchain.
  - Disiapkan untuk pengerjaan tahap selanjutnya (Minggu Ke-2).
  - Berisi catatan *TODO* bahwa skrip ini masih menunggu `DELEGATE_KEY`, versi SDK `memwal`, dan testnet endpoint dari Web3 Engineer.
