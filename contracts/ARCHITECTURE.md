# Arsitektur Aura: Cross-App Identity & Memory Sharing

Dokumen ini menjelaskan bagaimana ekosistem Aura menghubungkan berbagai aplikasi terdesentralisasi (App A, App B) menggunakan infrastruktur Sui dan Walrus, khususnya dengan pola **Session Keys**.

## Permasalahan Awal (Delegate Key)
Pada rancangan v1, pengguna diminta membuat *Delegate Key* di App A, menyalinnya secara manual (copy-paste), lalu memasukkannya di App B.
- **Kelemahan:** Mengorbankan UX, terasa seperti Web2, dan rentan terhadap kesalahan manusia (kehilangan kunci).

## Solusi v2: Session Keys & AuraIdentity NFT
Dengan pola baru ini, identitas utama pengguna diikat pada sebuah NFT (`AuraIdentity`) di jaringan Sui. NFT ini bersifat *Shared Object* (Objek Berbagi).

### Alur Kerja (Workflow)
1. **Inisialisasi (Hanya Sekali):**
   - Pengguna menghubungkan dompet (wallet) Sui utama mereka ke platform pusat Aura.
   - Dompet memanggil fungsi `mint_identity`. NFT `AuraIdentity` terbuat.

2. **Berinteraksi dengan App A (Contoh: Plugin Chat):**
   - Pengguna membuka App A dan menekan "Connect Wallet".
   - Browser/App A secara otomatis (di latar belakang) menghasilkan *ephemeral keypair* (kunci sesi).
   - Dompet Sui pengguna meminta satu kali persetujuan untuk transaksi `authorize_session`.
   - Setelah disetujui, App A memiliki *Session Key* yang diakui oleh `AuraIdentity`.
   - App A dapat bebas membaca/menulis ke Walrus dan memanggil `attest_memory` untuk mencatat aktivitas pengguna **tanpa meminta approval dompet lagi**.

3. **Berinteraksi dengan App B (Contoh: Zen Board):**
   - Pengguna membuka App B dan melakukan hal yang sama ("Connect Wallet").
   - App B menghasilkan *Session Key* miliknya sendiri dan meminta otorisasi dari dompet utama pengguna.
   - Setelah diotorisasi, App B memiliki akses langsung ke `AuraIdentity` milik pengguna.
   - App B dapat melakukan *query* ke Sui untuk mencari seluruh event `MemoryAttested` yang dikaitkan dengan `AuraIdentity` tersebut.
   - App B dapat menarik (recall) data dari Walrus, memverifikasi Hash, dan menampilkannya kepada pengguna.

### Keuntungan Arsitektur Ini:
* **True Web3 UX:** Tidak ada copy-paste. Pengguna cukup terhubung menggunakan dompet standar mereka.
* **Granular Revocation:** Jika App A disusupi atau tidak digunakan lagi, pengguna dapat memanggil `revoke_session` melalui dompet utama untuk memblokir App A tanpa memengaruhi App B.
* **Verifiable Data (Attestation):** App B tidak perlu memercayai "siapa pun" (bahkan server Aura). App B cukup membaca Hash dari blockchain dan mencocokkannya dengan Blob dari Walrus.
