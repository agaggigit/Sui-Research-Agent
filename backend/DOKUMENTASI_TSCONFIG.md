# 🧩 Dokumentasi Konfigurasi TypeScript (Perbaikan Error ESM)

Dokumen ini menjelaskan perubahan krusial di level konfigurasi *Compiler* (`tsconfig.json`) untuk mengakomodasi SDK modern dari Web3.

## 🚀 Masalah yang Terjadi
Saat kita mengimpor `@aura-identity/sdk` dan `@mysten/sui` ke dalam file `extract.ts`, IDE seperti VSCode atau *linter* akan memunculkan garis merah dengan pesan *error*:
> *"The current file is a CommonJS module... the referenced file is an ECMAScript module and cannot be imported with 'require'."*

Ini karena SDK Web3 modern ditulis dalam format ECMAScript Module (ESM), sementara konfigurasi proyek bawaan *backend* kita adalah CommonJS dengan sistem resolusi `node` lawas.

## 🛠️ Solusi: Module Resolution "Bundler"
Untuk memperbaiki hal tersebut tanpa harus membongkar seluruh proyek menjadi `"type": "module"`, kita mengubah `tsconfig.json` menjadi:
```json
"module": "ESNext",
"moduleResolution": "bundler"
```
**Mengapa ini berfungsi?**
Karena kita menggunakan `tsx` (yang ditenagai oleh `esbuild`) untuk menjalankan server `express` kita. Mode `"bundler"` memberi tahu TypeScript: *"Jangan panik melihat impor ESM di dalam file CommonJS, karena alat _bundler_ kitalah yang akan menyatukannya nanti secara otomatis."*

Hasilnya: Kode menjadi bersih dari garis merah, dan siap berinteraksi langsung dengan ekosistem blockchain modern!
