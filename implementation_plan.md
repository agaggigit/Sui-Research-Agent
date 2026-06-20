# Implementation Plan: Integrasi Aura Identity ke Frontend & Backend

## Latar Belakang

Smart Contract `aura_identity` sudah di-deploy ke Sui Testnet. PoC Scripts sudah terbukti berjalan.
Kini saatnya mengintegrasikan semua logika blockchain/Walrus ke dalam aplikasi nyata.

Struktur kode yang sudah ada:
- **Backend:** Express.js server (`server.ts`) + `extractAndSaveMemory()` dengan placeholder `// TODO Week 2: replace console.log with memwal.remember()`
- **Frontend:** Next.js dengan 3 route: `/` (Home), `/tavern` (App A), `/zenboard` (App B)

---

## Bagian 1: BACKEND

### Apa yang Perlu Ditambahkan

Backend bertugas sebagai "otak" yang menghubungkan AI dengan blockchain/Walrus.
Saat ini `extractAndSaveMemory()` hanya melakukan `console.log`. Kita perlu mengganti ini dengan logika nyata.

---

### [MODIFY] `backend/src/memory/extract.ts`

**Perubahan:** Ganti `console.log` dengan pemanggilan fungsi `memwal.remember()` yang sesungguhnya.

```typescript
// SEBELUM:
if (object.hasExtractedMemory) {
  console.log("[MEMORY EXTRACTED]", object.memory);
  // TODO Week 2: replace console.log with memwal.remember()
}

// SESUDAH:
if (object.hasExtractedMemory && object.memory) {
  const result = await attestMemory({
    identityId: process.env.AURA_IDENTITY_ID!,
    privateKey: process.env.SUI_PRIVATE_KEY!,
    memory: {
      type: object.memory.type,
      value: object.memory.value,
      confidence: object.memory.confidence,
      source_app: "tavern_chat",
      confirmed_by_user: false,
      timestamp: new Date().toISOString(),
    }
  });
  console.log("[MEMORY ATTESTED ON-CHAIN]", result.txDigest);
}
```

---

### [NEW] `backend/src/memory/walrus.ts`

Modul baru untuk semua operasi Walrus (upload + download).

**Fungsi yang perlu dibuat:**
- `uploadToWalrus(data: object): Promise<string>` → returns Blob ID
- `downloadFromWalrus(blobId: string): Promise<string>` → returns raw JSON string

**Kode referensi:** Sudah ada di `contracts/scripts/poc_remember_attest.ts` (fungsi `uploadToWalrus`)

**Config yang dibutuhkan di `.env` Backend:**
```env
WALRUS_PUBLISHER_URL="https://publisher.walrus-testnet.walrus.space"
WALRUS_AGGREGATOR_URL="https://aggregator.walrus-testnet.walrus.space"
```

---

### [NEW] `backend/src/memory/attest.ts`

Modul baru untuk semua operasi blockchain Sui (attest + query events).

**Fungsi yang perlu dibuat:**
- `attestMemory({ identityId, privateKey, memory }): Promise<{ txDigest, blobId, hash }>` → upload ke Walrus + attest ke Sui sekaligus
- `queryMemoryEvents(identityId: string): Promise<MemoryAttestedEvent[]>` → ambil semua event dari Sui

**Kode referensi:** Sudah ada di `contracts/scripts/poc_remember_attest.ts` (fungsi `main()`)

**Config yang dibutuhkan di `.env` Backend:**
```env
NEXT_PUBLIC_AURA_PACKAGE_ID="0x71cedc5e4d24054f8b2fbfdefa12ed54cfe58f71c7a6348ba9caa2c2625f0bb9"
AURA_IDENTITY_ID="0x50f8eed3fbf070c54a5858f1987d1ea2272697dad8271339a1efad9f19a4e760"
SUI_PRIVATE_KEY="suiprivkey..."
```

---

### [NEW] Route API Baru di `backend/src/server.ts`

**Tambahkan 2 endpoint baru:**

#### `GET /api/memories`
Mengambil seluruh daftar memori yang sudah ter-attest dari Sui Events + mengunduh isinya dari Walrus.
Digunakan oleh Zen Board untuk menampilkan "Memory Graph" dan daftar memori.

**Response:**
```json
[
  {
    "blobId": "rVmc9ek...",
    "hash": "1cd7811c...",
    "timestamp": "2026-06-20T...",
    "data": { "type": "work_pref", "value": "hates loud notifications", ... }
  }
]
```

#### `GET /api/session-status`
Mengecek apakah Session Key saat ini masih valid (belum kadaluarsa).
Digunakan oleh Frontend untuk menampilkan status "Connected" / "Reconnect Wallet".

**Response:**
```json
{ "isValid": true, "expiresAtEpoch": 349181900 }
```

---

### Urutan Pengerjaan Backend

1. Buat `backend/src/memory/walrus.ts`
2. Buat `backend/src/memory/attest.ts`
3. Install dependencies: `npm install @mysten/sui`
4. Modifikasi `backend/src/memory/extract.ts`
5. Tambahkan endpoint baru di `backend/src/server.ts`
6. Tambahkan variabel env ke `backend/.env`

---

## Bagian 2: FRONTEND

### Kondisi Saat Ini

Frontend sudah memiliki 3 halaman:
- `/` → Landing page (sudah ada, perlu penambahan tombol "Connect Wallet")
- `/tavern` → App A, chat dengan Aldric (sudah ada)
- `/zenboard` → App B (belum diketahui isinya, perlu dicek)

### Halaman yang Dibutuhkan

**Total: 3 halaman (sudah ada strukturnya, perlu penyempurnaan konten & integrasi)**

---

### Halaman 1: `/` — Landing Page (HOME)

**Tujuan:** Pintu masuk utama. Pengguna pertama kali mendarat di sini.

**Konten yang wajib ada:**
- Logo / judul **AURA** (sudah ada ✅)
- Tagline: *"The Portable AI Soul"* (sudah ada ✅)
- Penjelasan singkat: AI memory yang tersimpan di Walrus, bisa dibawa ke mana saja (sudah ada ✅)
- **[BARU] Status Wallet Bar** di pojok kanan atas
- **[BARU] Tombol "Connect Wallet"** — menggunakan Sui dApp Kit
- **[BARU] Badge status Identity** — setelah wallet terhubung, tampilkan:
  - Alamat wallet yang terpotong (misal: `0xda9f...4b0a`)
  - Status Identity: `✅ Identity Found` atau `⚠️ No Identity — Mint Now`
  
**Tombol yang perlu ada:**
| Tombol | Fungsi | Kondisi Tampil |
|--------|--------|----------------|
| `Connect Wallet` | Hubungkan dompet Sui | Wallet belum terhubung |
| `Mint Aura Identity` | Panggil `mint_identity` on-chain | Wallet terhubung, belum punya identity |
| `→ Open Tavern` | Navigasi ke `/tavern` | Selalu tampil |
| `→ Open Zen Board` | Navigasi ke `/zenboard` | Selalu tampil |

---

### Halaman 2: `/tavern` — Tavern Chat (App A / Ingestion Engine)

**Tujuan:** Pengguna ngobrol dengan Aldric (AI). Di balik layar, setiap percakapan mengekstrak memori dan menyimpannya ke Walrus + Sui.

**Konten yang wajib ada:**
- Antarmuka chat (sudah ada ✅)
- Avatar Aldric + nama
- Input pesan + tombol kirim

**[BARU] Yang perlu ditambahkan:**
- **Memory Indicator** — notifikasi kecil di pojok yang berkedip ketika memori baru berhasil disimpan, contoh: `🧠 Memory saved to Walrus`
- **Link ke Bukti** — setelah memori tersimpan, tampilkan hyperlink kecil: `View on Suiscan ↗` yang mengarah ke transaction digest
- **Status Bar Kecil** di bawah input:
  - `🔐 Session Key: Active` (hijau) atau `⚠️ Session Expired — Reconnect` (kuning)
  
**Tombol yang perlu ada:**
| Tombol | Fungsi |
|--------|--------|
| `Send` / `Enter` | Kirim pesan ke AI |
| `← Back` | Kembali ke landing page |
| `Authorize Session` | Munculkan modal untuk mengotorisasi Session Key baru (jika kadaluarsa) |

---

### Halaman 3: `/zenboard` — Zen Board (App B / Cross-Agent Recall)

**Tujuan:** Dashboard pengguna. Menampilkan semua memori yang sudah disimpan dari berbagai aplikasi, lengkap dengan status verifikasi.

**Konten yang wajib ada:**

**Panel Kiri — Memory Graph (Visualisasi)**
- Tampilkan memori sebagai node-node yang terhubung
- Warna node berdasarkan `type` (work_pref = biru, emotional_state = merah, dll)
- Klik node untuk melihat detail

**Panel Kanan — Memory List**
- Daftar kartu memori yang sudah ter-attest
- Setiap kartu menampilkan:
  - Badge tipe memori (`work_pref`, `emotional_state`, dsb.)
  - Isi nilai memori
  - Tanggal & waktu attestasi
  - Badge `✅ Verified` (jika hash cocok) atau `⚠️ Unverified`
  - Tombol `View on Walrus ↗` dan `View on Sui ↗`
- Search / filter bar untuk mencari memori berdasarkan kata kunci atau tipe

**Tombol yang perlu ada:**
| Tombol | Fungsi |
|--------|--------|
| `Refresh Memories` | Panggil ulang `GET /api/memories` dari backend |
| `Search` / Filter | Filter daftar memori |
| `View on Walrus ↗` | Buka Walruscan di tab baru |
| `View on Sui ↗` | Buka Suiscan di tab baru |
| `Restore from Chain` | Panggil endpoint disaster recovery |
| `← Back` | Kembali ke landing page |

---

## Urutan Pengerjaan yang Direkomendasikan

```
1. [Backend] Buat walrus.ts dan attest.ts
2. [Backend] Modifikasi extract.ts
3. [Backend] Tambah endpoint GET /api/memories
4. [Frontend] Tambahkan Connect Wallet di Landing Page
5. [Frontend] Tambahkan Memory Indicator di Tavern Chat
6. [Frontend] Buat/lengkapi Zen Board dengan Memory List + verifikasi
7. [OPTIONAL] Tambahkan Memory Graph visualization di Zen Board
```

---

## Dependencies yang Perlu Diinstall

**Backend:**
```bash
npm install @mysten/sui crypto
```

**Frontend:**
```bash
npm install @mysten/dapp-kit @mysten/sui @tanstack/react-query
```

---

## Catatan Penting untuk Juri Hackathon

Integrasi ini menunjukkan **genuine Web3 UX** karena:
1. Pengguna hanya perlu "Connect Wallet" **sekali** — Session Key mengurus sisanya secara otomatis.
2. Setiap memori yang tersimpan bisa **diverifikasi kebenarannya** oleh aplikasi manapun di seluruh ekosistem Sui.
3. Pengguna **tidak pernah kehilangan data** meski ganti perangkat, karena selalu bisa restore dari blockchain.
