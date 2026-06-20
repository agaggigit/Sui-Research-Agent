# Panduan Integrasi Backend & Frontend (Aura)

Dokumen ini ditujukan untuk tim Frontend (FE) dan Backend (BE) guna mengimplementasikan pola arsitektur Session Keys dan membaca data terverifikasi (attested) dari blockchain Sui & Walrus.

## 1. Integrasi Frontend: Menghasilkan Session Keys
Ketika pengguna pertama kali melakukan instalasi ekstensi (App A) atau masuk ke Zen Board (App B), Frontend harus melakukan langkah berikut:

```typescript
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// 1. Generate Keypair di background (Browser)
const sessionKeypair = new Ed25519Keypair();
const sessionAddress = sessionKeypair.getPublicKey().toSuiAddress();

// 2. Simpan secret key ke IndexedDB / LocalStorage dengan aman
localStorage.setItem("AURA_SESSION_SECRET", Buffer.from(sessionKeypair.getSecretKey()).toString('hex'));

// 3. Minta dompet pengguna menyetujui transaksi 'authorize_session'
// Memanggil target: `[PACKAGE_ID]::aura_identity::authorize_session`
// Argument: [Identity_ID, sessionAddress, 7] // 7 epoch = ~7 hari
```

## 2. Integrasi Backend: Endpoint `/api/board-init` (Zen Board)
Saat pengguna membuka dashboard Zen Board, halaman harus memuat (recall) seluruh memori. Backend bertanggung jawab melakukan agregasi dan verifikasi data:

**Alur Kerja Endpoint `/api/board-init`:**
1. Menerima request yang berisi `AuraIdentity ID` milik pengguna.
2. Melakukan *RPC Call* ke Sui Testnet: `suix_queryEvents` untuk `MemoryAttested`.
3. Menarik (fetch) isi blob dari Walrus Aggregator URL.
4. Menghitung `SHA-256` dari isi blob dan membandingkannya dengan `data_hash` yang ada di event blockchain.
5. Memfilter hanya data yang **Cocok (Verified)**.
6. Mereturn JSON Array memori (dengan relasi/tags) kembali ke Frontend untuk di-render menjadi *Memory Graph*.

**Catatan Keamanan:**
Jika Hash tidak cocok, Backend HARUS mengabaikan/menolak Blob tersebut untuk mencegah *Data Tampering* (Manipulasi Data).

## 3. Integrasi Backend: Endpoint Menambahkan Fakta (`remember`)
Jika ekstensi Browser (App A) menangkap sebuah fakta:
1. App A mengirim fakta ke Backend.
2. Backend mengunggah fakta tersebut ke Walrus (`publisher-testnet`).
3. Backend mendapatkan `Blob ID` dan menghitung `SHA-256 Hash`.
4. Backend/App A menandatangani transaksi `attest_memory` menggunakan *Session Secret Key* yang tersimpan di LocalStorage.
5. Fakta kini tercatat aman di blockchain.
