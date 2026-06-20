# Aura Identity - Session Keys & Architecture Notes

## Konsep Session Keys di Sui
Secara umum, *Session Keys* di ekosistem Sui adalah cara untuk menghindari prompt tanda tangan dompet (wallet signature prompt) yang berulang-ulang bagi pengguna ketika mereka berinteraksi dengan sebuah dApp.

Cara kerjanya:
1. **Frontend (Browser):** Menghasilkan sebuah *ephemeral keypair* (kunci rahasia sementara yang disimpan di memori browser).
2. **Otorisasi (Authorization):** Pengguna menandatangani satu transaksi menggunakan dompet utama mereka. Transaksi ini mendaftarkan *public address* dari *ephemeral keypair* ke dalam *Smart Contract* dengan batas waktu tertentu (expiry).
3. **Penggunaan (Execution):** Aplikasi dapat menggunakan *ephemeral keypair* tersebut di balik layar untuk menandatangani transaksi atas nama pengguna, selama sesi masih berlaku. Pengguna tidak perlu lagi melakukan persetujuan (approve) secara manual.

## Implementasi di Aura
Dalam proyek Aura, kita memodifikasi pola ini untuk mendukung *cross-app identity*:
* Smart Contract `AuraIdentity` memiliki fungsi `authorize_session`.
* Saat pengguna masuk ke App A (misal: plugin chat), App A membuat *ephemeral keypair* dan memanggil `authorize_session`.
* Kunci sesi yang baru ini dapat memanggil fungsi `attest_memory` untuk merekam fakta dan mengikatnya ke `AuraIdentity` pengguna tanpa mengganggu pengguna dengan prompt berulang.
* Semua *Blob Walrus* yang dihasilkan akan ditandai dengan Hash Data yang disahkan oleh kunci sesi.

## Arsitektur Key
* **Main Wallet:** Hanya digunakan untuk `mint_identity` dan `authorize_session`.
* **Session Key (Ephemeral):** Digunakan untuk operasi frekuensi tinggi seperti `attest_memory`.
