# 🏗️ Dokumentasi Frontend: Tavern Chat (Tugas 3)

Dokumen ini menjelaskan perubahan drastis yang telah dilakukan pada antarmuka pengguna di file `page.tsx` untuk mewujudkan pengalaman _Real-Time Loading Status_ tanpa _mockup_.

## 🚀 Apa yang Berubah di `page.tsx`?
1. **Pengiriman `identityId` ke Backend:**
   - Karena backend kini menggunakan `@aura-identity/sdk`, *Frontend* sekarang menangkap *Delegate Key* yang dimasukkan pengguna di awal dan meneruskannya sebagai `identityId` ke dalam _payload_ permintaan API ke `/api/chat`.
2. **Penerimaan Streaming Data Asli:**
   - Aplikasi tidak lagi menggunakan _timer_ `setTimeout` palsu untuk memicu animasi status Walrus ("Menganalisis memori...", "Mengenkripsi...", dll).
   - Seluruh animasi kini dikendalikan secara mutlak oleh _Backend_ melalui protokol aliran data (_streaming_).
2. **Pendeteksian Sinyal `__STATUS__`:**
   - Saat teks balasan AI mengalir dari server, _Frontend_ menggunakan _Regular Expression_ (`Regex`) untuk mengintip apakah ada teks berformat `__STATUS__<nama_status>__ENDSTATUS__`.
   - Jika sinyal itu ditemukan, _Frontend_ akan menghapus teks jelek itu agar tidak terlihat oleh *User*, dan menggunakannya untuk mengubah status (warna dan teks) pada animasi *pop-up* di pojok kanan bawah.
3. **Pendeteksian Sinyal `__MEMORY__`:**
   - Saat proses Walrus selesai di _backend_, server akan mengirimkan objek JSON utuh yang diawali dengan token `__MEMORY__`.
   - _Frontend_ secara otomatis mem-parsing JSON tersebut dan menampilkannya sebagai "Badge Memori" cantik di bagian bawah gelembung obrolan (Chat Bubble).

## 🛠️ Cara Kerja UI Sekarang
_User_ mengetik pesan -> _Frontend_ menembak `/api/chat` -> Teks AI mengalir pelan-pelan ke layar -> Tiba-tiba _pop-up_ hijau muncul bergerak dari "Menganalisis" ke "Tersimpan" sesuai perintah jarak jauh dari _Backend_. Semuanya 100% responsif!
