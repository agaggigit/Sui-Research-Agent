# 📡 Dokumentasi API Router: Server.ts (Tugas 3)

Dokumen ini merangkum teknik injeksi _stream_ yang kita terapkan di file utama `server.ts` untuk menyelesaikan **Tugas Ketiga (Streaming Response)**.

## 🚀 Kenapa `pipeTextStreamToResponse` Dihapus?
Pada awalnya, kita menggunakan fungsi `result.pipeTextStreamToResponse(res)` bawaan Vercel AI SDK. Fungsi ini sangat bagus dan mudah, tetapi ia bersifat kaku: _"Setelah teks obrolan AI selesai, koneksi langsung diputus secara paksa oleh SDK"_.

Padahal, kita butuh koneksi itu **tetap terbuka** agar kita bisa menyisipkan status memori (seperti *"Sedang menyimpan ke Walrus..."*) dan hasil JSON memori di akhir percakapan!

## 🛠️ Solusi: Manipulasi Stream Manual (Manual Iteration)
1. Kita mengganti kode otomatis itu dengan _looping_ manual:
   ```typescript
   for await (const chunk of result.textStream) {
     res.write(chunk);
   }
   ```
2. Setelah AI selesai berbicara (looping selesai), koneksi belum kita putus! Kita memanggil fungsi `extractAndSaveMemory` dengan meneruskan parameter `identityId` (dari payload *Frontend*) dan memberikan _callback_ khusus.
3. Setiap kali fungsi ekstraksi mengirimkan status pembaruan, server kita akan menuliskannya ke _stream_ menggunakan token khusus: `res.write('__STATUS__...__ENDSTATUS__')`.
4. Jika ekstraksi sukses, barulah server menulis `__MEMORY__{...JSON...}` dan akhirnya menutup koneksi dengan `res.end()`.
