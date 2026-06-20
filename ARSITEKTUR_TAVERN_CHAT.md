# ⚔️ CARA KERJA SISTEM "AURA: TAVERN CHAT" SAAT INI (MVP LENGKAP)

Ini adalah ringkasan raksasa (Grand Overview) tentang bagaimana aplikasi _Tavern Chat_ berfungsi setelah perombakan besar di _Frontend_ dan _Backend_. Gunakan dokumen ini sebagai panduan serah terima kepada tim proyekmu.

---

## 1. Fase Interaksi (Frontend Asli)
Ketika pengguna masuk ke aplikasi web dan mulai mengobrol dengan sang penjaga kedai (Aldric), antarmuka web tidak menggunakan _timer_ buatan atau jawaban _template_ palsu.
Setiap huruf yang kamu ketik dan kirim akan dikemas ke dalam sebuah HTTP POST Request menuju API *Backend* di alamat `http://localhost:3001/api/chat`.

## 2. Fase Otak Berpikir (AI Streaming via Backend)
Begitu *Backend* menerima pesanmu:
1. *Backend* akan meneruskan riwayat percakapan itu ke otak besar **Google Gemini 2.5 Flash** (melalui _Vercel AI SDK_).
2. Gemini membaca aturan rahasianya (*System Prompt*), di mana ia diinstruksikan untuk bertingkah seperti penjaga kedai dari dunia fantasi yang diam-diam memata-matai pikiran dan keluhan penggunanya.
3. Jawaban Gemini tidak dikirim sekaligus, melainkan dialirkan secara *Real-Time* (kata demi kata) kembali ke *Frontend*. Oleh karena itu, kamu melihat efek ketikan mesin tik (Typewriter Effect) yang natural di layar webmu.

## 3. Fase Mata-Mata & Ekstraksi Data (AI + Zod Schema)
Begitu Aldric selesai mengucapkan kata terakhirnya, proses rahasia dimulai di _Backend_:
1. *Backend* meminta bantuan AI (sekali lagi) untuk melihat kembali percakapan barusan, tetapi kali ini dalam mode analitis.
2. AI menggunakan pola **Zod Schema** untuk mengekstrak data persisten: *"Apakah *User* baru saja mengungkapkan ketakutan, preferensi kerja, atau status emosinya?"*
3. Jika ya, AI akan membentuk struktur data JSON yang rapi dan memuat deskripsi mendetail untuk kebutuhan mesin pencari AI (*Semantic Search*).
4. Sembari AI melakukan ekstraksi ini, _Backend_ diam-diam menyisipkan sinyal tulisan `__STATUS__extracting__ENDSTATUS__` ke jalur koneksi yang masih terbuka dengan _Frontend_.

## 4. Fase Visualisasi (UI Bereaksi)
Di sisi _Frontend_, sistem selalu memantau jika ada kata-kata aneh (`__STATUS__...`) yang dikirim oleh _Backend_. 
Begitu _Frontend_ menangkap kode rahasia tersebut, ia langsung menyembunyikannya dari layar, dan seketika menyalakan indikator "Menganalisis memori..." berwarna hijau yang menyala-nyala di pojok kanan bawah.

## 5. Fase Persistensi (Blockchain & Walrus via Aura Identity SDK)
Jika JSON memori berhasil terbentuk:
1. _Backend_ akan memanggil SDK kustom buatan tim Web3, yaitu `@aura-identity/sdk` (Fungsi `aura.remember`).
2. SDK ini menggabungkan identitas dompet server (`AURA_SERVER_SECRET`) dengan identitas dompet/NFT pengguna (`identityId` yang dikirim dari Frontend) untuk merangkai relasi data.
3. Selama proses penyimpanan ke jaringan _Walrus_ / _Sui Testnet_ ini berlangsung, _Backend_ terus mengirimkan kode-kode status secara *live* ke _Frontend_ (mengubah animasi menjadi "Mengenkripsi via Seal..." lalu "Mengunggah ke Walrus...").
4. Saat data resmi mendarat di *blockchain*, _Backend_ mengirimkan satu kode terakhir berisi hasil JSON (`__MEMORY__...`), lalu menutup koneksi jaringan.
5. _Frontend_ merespons kode terakhir tersebut dengan menampilkan lencana (Badge) "🌊 Memori Tersimpan" dengan elegan di dalam gelembung percakapan.

---

**Hasil Akhirnya:** Kamu mendapatkan sebuah asisten AI yang tidak hanya jago ber-RPG, tetapi secara aktif mengekstrak, mengenkripsi, dan membungkus ingatanmu ke dalam *blockchain*, disajikan dengan *User Experience* yang mulus tanpa hambatan.

Proyek "Aplikasi A" sudah siap tempur! 🔥
