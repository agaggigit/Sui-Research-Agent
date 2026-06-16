# ⛓️ Smart Contracts (Sui/Move)

Folder ini berfungsi sebagai rumah bagi kode *Smart Contract* jaringan Sui. Proyek AURA mengandalkan blockchain Sui untuk identitas terdesentralisasi dan penyimpanan jaringan (melalui Walrus Protocol).

## 🎯 Tujuan Folder Ini
Seluruh fungsionalitas yang berjalan langsung di atas *ledger* (seperti pengaturan hak delegasi *wallet*, validasi identitas kunci, atau logika kontrak khusus AURA) akan ditulis dalam bahasa **Move**.

## 📜 Aturan Pengerjaan di Folder Ini
1. **Isolasi Kode**: Folder ini tidak boleh bergantung atau mengimpor kode apapun dari `frontend/` maupun `backend/`.
2. **Lingkungan Move**: Untuk mengerjakan file di dalam folder ini, pastikan mesin komputermu sudah ter- *install* Sui CLI secara lokal.
3. **Dokumentasi Kontrak**: Setiap fungsi atau modul publik (*public functions*) di dalam kontrak wajib didokumentasikan agar tim Frontend/Backend tahu cara memanggilnya dari SDK.