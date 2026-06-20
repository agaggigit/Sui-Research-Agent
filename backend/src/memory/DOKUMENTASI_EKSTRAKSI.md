# 🧠 Dokumentasi Memory Extraction & Integrasi SDK Web3

Dokumen ini menjelaskan integrasi Walrus di file `extract.ts`.

## 🚀 Fitur Baru 1: Migrasi ke Universal AI Passport SDK (@aura-identity/sdk)
Kita telah meninggalkan SDK bawaan `MemWal` dan bermigrasi sepenuhnya ke **Aura Identity SDK** kustom buatan tim *Smart Contract*. 
- Fungsi `extractAndSaveMemory` sekarang menerima parameter tambahan `identityId` yang merupakan identitas pengguna (dari NFT/Delegate Key).
- Penulisan ke blockchain kini memanggil `aura.remember(signer, identityId, data)` menggunakan konfigurasi *Signer* (`Ed25519Keypair`) secara langsung.

## 🚀 Fitur Baru 2: `onStatus` Callback
Agar *Frontend* tidak perlu menebak-nebak (menggunakan timer palsu) kapan AI selesai mengekstrak memori, kita telah mengubah desain arsitektur fungsi `extractAndSaveMemory()`.

1. **Parameter Tambahan:** Fungsi ini sekarang menerima parameter `onStatus?: (status: string) => void`.
2. **Emisi Sinyal:** 
   - Tepat sebelum AI `generateObject` bekerja, fungsi akan berteriak: `onStatus("extracting")`.
   - Jika memori ditemukan dan siap dikirim, ia berteriak: `onStatus("encrypting")`.
   - Tepat saat memanggil SDK `aura.remember`, ia berteriak: `onStatus("uploading")`.
3. **Hasil:** Sistem ekstraksi kita kini bersifat sangat komunikatif (*event-driven*), memungkinkan _Router_ utama untuk mengirim peringatan ini langsung ke layar pengguna.
