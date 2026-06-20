# Skema Data Memori (Aura)

Setiap fakta atau memori yang disimpan ke dalam sistem penyimpanan terdesentralisasi Walrus **harus** mengikuti format JSON berikut. Skema ini dirancang untuk mendukung pembuatan *Memory Graph* (Saran Juri 3) dan persetujuan pengguna (Saran Juri 4).

```json
{
  "type": "work_pref",
  "value": "hates loud notifications",
  "tags": ["work", "focus", "environment"],
  "related_to": ["stress", "deep_work"],
  "source_app": "tavern_chat",
  "confirmed_by_user": true,
  "timestamp": "2026-06-20T10:00:00.000Z"
}
```

### Penjelasan Atribut
1. `type` *(string)*: Kategori dari memori (contoh: `work_pref`, `personal_info`, `hobby`).
2. `value` *(string)*: Fakta aktual yang diekstrak oleh AI.
3. `tags` *(array of strings)*: Label umum untuk pencarian (search).
4. `related_to` *(array of strings)*: Kunci penting untuk membangun **Visual Memory Graph**. Frontend dapat merender node dan edge berdasarkan relasi ini.
5. `source_app` *(string)*: Nama aplikasi asal yang menangkap memori ini (contoh: `tavern_chat`, `zen_board`).
6. `confirmed_by_user` *(boolean)*: **WAJIB `true`** sebelum data di-commit ke Walrus. Menandakan bahwa pengguna secara eksplisit mengizinkan AI untuk menyimpan fakta ini (Memenuhi standar Web3 data sovereignty).
7. `timestamp` *(string)*: Waktu perekaman dalam format ISO 8601.
