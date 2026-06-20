# Bukti Integrasi Sui & Walrus (Aura Project)

Dokumen ini berisi bukti visual (screenshot) eksekusi Smart Contract dan penyimpanan terdesentralisasi Walrus di jaringan Testnet untuk ditunjukkan kepada Juri Hackathon.

## 1. Smart Contract Deployment (Sui Testnet)
* **Package ID:** `0x71cedc5e4d24054f8b2fbfdefa12ed54cfe58f71c7a6348ba9caa2c2625f0bb9`
* **Suiscan Link:** [Aura Identity Package](https://suiscan.xyz/testnet/object/0x71cedc5e4d24054f8b2fbfdefa12ed54cfe58f71c7a6348ba9caa2c2625f0bb9/contracts)

*(Sisipkan screenshot halaman Package di Suiscan di sini)*

## 2. Inisialisasi Aura Identity (NFT)
* **Contoh AuraIdentity Object ID:** `(Isi dengan Object ID hasil eksekusi mint_identity)`
* **Suiscan Link:** `(Isi dengan link Object ID)`

*(Sisipkan screenshot AuraIdentity object detail di Suiscan)*

## 3. Penyimpanan Memori ke Walrus
Hasil pengujian dari `scripts/poc_remember_attest.ts`:
* **Blob ID:** `(Isi dengan Blob ID yang dihasilkan script)`
* **Walruscan Link:** `(Isi dengan link https://walruscan.com/testnet/blob/<Blob_ID>)`

*(Sisipkan screenshot halaman Walrus Explorer yang menampilkan Blob data Anda)*

## 4. Memory Attestation (On-Chain Verification)
Pembuktian bahwa memori tersebut disahkan di blockchain oleh aplikasi.
* **Transaction Digest:** `(Isi dengan Tx Digest)`
* **Event Data Hash:** `(Isi dengan data_hash dari event)`

*(Sisipkan screenshot halaman Transaction Events di Suiscan yang menunjukkan event `MemoryAttested` berhasil di-emit)*
