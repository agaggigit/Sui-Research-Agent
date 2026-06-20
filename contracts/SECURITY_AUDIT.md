# Audit Keamanan Smart Contract (Aura Identity)

Dokumen ini merangkum pertimbangan keamanan utama dan hasil audit mandiri dari implementasi `aura_identity.move` serta arsitektur integrasi *Session Key*.

## 1. Verifikasi Akses Session Key (LULUS)
**Risiko:** Pengguna yang tidak sah (hacker) dapat mendaftarkan *session key* milik mereka sendiri ke identitas orang lain.
**Mitigasi:** Fungsi `authorize_session` secara ketat memverifikasi bahwa `tx_context::sender(ctx) == identity.owner`. Hanya pemilik NFT (wallet asli) yang dapat memberikan akses *Session Key*.
**Unit Test:** Dicover oleh `test_session_auth_and_attest`.

## 2. Batas Waktu Kadaluwarsa / Session Expiry (LULUS)
**Risiko:** *Session Key* yang dicuri dapat digunakan selamanya jika tidak ada mekanisme waktu kedaluwarsa.
**Mitigasi:** `AuraIdentity` menggunakan variabel `session_expires_at` berbasis Sui Epochs. Saat `tx_context::epoch(ctx)` melebihi waktu tersebut, akses `attest_memory` secara otomatis ditolak karena fungsi pembantu `is_session_valid` akan mengembalikan nilai `false`.
**Unit Test:** Dicover oleh `test_session_expiry` (PASS).

## 3. Pencabutan Sesi Paksa / Session Revocation (LULUS)
**Risiko:** Pengguna mengetahui bahwa App A disusupi dan ingin mencabut akses *sebelum* kedaluwarsa, tetapi tidak bisa.
**Mitigasi:** Fungsi `revoke_session` disediakan. Pengguna dapat memanggil fungsi ini menggunakan dompet utama untuk mengosongkan `active_session_key` secara instan.
**Unit Test:** Dicover oleh `test_revoke_session` (PASS).

## 4. Ketahanan Data (Tamper-proof Attestation) (LULUS)
**Risiko:** App pihak ketiga memanipulasi Blob di Walrus, atau menyodorkan data palsu (halusinasi AI) seakan-akan itu fakta yang diakui pengguna.
**Mitigasi:** Setiap memori memiliki `data_hash` (SHA-256) yang direkam (di-attest) on-chain dan ditandatangani menggunakan *Session Key*. App B memverifikasi hash Blob Walrus terhadap hash di blockchain Sui. Ketidakcocokan satu bit pun akan langsung terdeteksi.

## 5. Optimasi Gas (LULUS)
**Pertimbangan:** Biaya penyimpanan data besar di blockchain terlalu mahal.
**Mitigasi:** 
* Penyimpanan file/data dialihkan 100% ke protokol Walrus yang dioptimalkan untuk data BLOB.
* Smart contract Sui hanya menangani pointer (`blob_id`) dan bukti (event). Menggunakan *Sui Events* (`event::emit`) sangat menghemat gas karena tidak mengonsumsi *on-chain storage* secara permanen (hanya diindeks di fullnode). Biaya gas diestimasikan kurang dari 0.002 SUI per pencatatan memori.
