# **🚀 Proposal & Panduan Teknis Tim: Sui Overflow 2026 (Walrus Track)**

## **1\. Konsep Ide: "Aura \- The Portable AI Soul" (The 2-Room Demo)**

**Latar Belakang Masalah:** Saat ini, agen AI bersifat terisolasi (*siloed*). Memori dan konteks pengguna hilang setiap kali berpindah aplikasi atau jika *server* aplikasi ditutup.

**Solusi:** Membangun "Aura", sebuah agen AI pendamping yang memorinya bersifat *Portable by Design*. Memori ini dienkripsi dan disimpan di [Walrus](https://docs.wal.app/docs/getting-started), sehingga pengguna memegang kendali penuh. AI ini tidak hanya mengingat teks, tetapi juga mampu mengekstrak profil data terstruktur untuk dibawa melintasi berbagai aplikasi yang berbeda.

**Bentuk MVP (Standar Tinggi):** Sebuah ekosistem web dengan dua antarmuka (UI) berbeda yang menyimulasikan *cross-tool memory sharing*:

1. **Aplikasi A (Tavern Chat \- Data Ingestion):** Simulasi *game* RPG teks interaktif. AI bertindak sebagai karakter *game* yang secara cerdas mengekstrak profil pengguna, ketakutan, dan preferensi gaya kerja, lalu menyimpannya sebagai memori terstruktur ke Walrus.  
2. **Aplikasi B (Zen Board \- Cross-Agent Recall):** Simulasi *dashboard* produktivitas. Saat *Delegate Key* dimasukkan, AI asisten kerja secara otomatis memuat artefak memori dari *game* sebelumnya dan menyusun ulang jadwal atau sapaan berdasarkan konteks tersebut.

---

## **2\. Persyaratan Lomba & Strategi Penilaian**

Proyek ini dirancang secara khusus untuk mendominasi **Walrus Specialized Track** pada [Sui Overflow 2026](https://mystenlabs.notion.site/overflow-2026-handbook).

* **Target Utama Track:** Mendemonstrasikan memori persisten (*long-term memory*) dan alur kerja berbasis artefak lintas agen (*cross-tool memory sharing*).  
* **Kriteria Penilaian Juri:**  
  * **50% Real-World Application:** Menunjukkan transisi dari AI yang "lupa ingatan" menjadi asisten abadi lintas platform yang dimiliki secara mandiri oleh pengguna.  
  * **20% Technical Implementation:** Menggunakan @mysten-incubation/memwal SDK secara mendalam, termasuk implementasi fungsi Restore dari jaringan Sui Testnet untuk membuktikan ketahanan data.  
  * **20% Product & UX:** Tampilan antarmuka kelas industri. Kontras visual ekstrem antara tema *game* dan *dashboard* kerja dengan animasi "penarikan memori" (*recall state*) yang mulus.  
  * **10% Presentation & Vision:** Video presentasi konseptual maksimal 5 menit dengan *storytelling* yang emosional dan teknis yang solid.

---

## **3\. Alur Pengguna (User Flow)**

1. **Koneksi (App A):** Pengguna masuk ke **Aplikasi A (Tavern Chat)** dan menghubungkan *wallet* Sui atau men-*generate* *Delegate Key* di [MemWal Playground](https://docs.wal.app/walrus-memory/getting-started/what-is-walrus-memory).  
2. **Ingestion:** Pengguna bermain dan berinteraksi. Pengguna bercerita tentang kelelahannya dalam bekerja atau preferensinya (misal: benci notifikasi berisik).  
3. **Verifiable Storage:** Di balik layar, AI tidak sekadar menyimpan teks mentah, tetapi menyimpannya sebagai *metadata* terstruktur (contoh tipe memori: work\_preference: silent). Data ini dienkripsi dan didorong ke Walrus.  
4. **Berpindah Ekosistem:** Pengguna berpindah ke **Aplikasi B (Zen Board)**.  
5. **Cross-App Recall:** Pengguna memasukkan otorisasi *Delegate Key* yang sama.  
6. **Momen Wow (Adaptive UX):** Aplikasi B langsung beradaptasi. AI sapaan di *dashboard* mengenali pengguna, secara otomatis mengubah mode aplikasi ke mode "Fokus/Bisu" (*silent notification*), dan merujuk pada obrolan santai di *game* sebelumnya.

---

## **4\. Alur Teknis End-to-End (Technical Flow)**

* **Tech Stack:** Next.js (App Router), TailwindCSS, Vercel AI SDK, dan @mysten-incubation/memwal TypeScript SDK.  
* **Flow Penulisan (Ingestion \- App A):** Input User \-\> LLM (OpenAI/Anthropic) mengekstrak *JSON facts* \-\> API Route memanggil memwal.remember(facts) \-\> Relayer Walrus membuat *vector embedding*, mengenkripsi via Seal, dan mengunggahnya ke Sui Testnet.  
* **Flow Pembacaan (Recall \- App B):** Aplikasi dimuat \-\> Klien memvalidasi *Delegate Key* \-\> API Route memanggil memwal.recall(query) spesifik (misal mencari work\_preference) \-\> LLM mengonsumsi konteks tersebut untuk merender UI yang dipersonalisasi.  
* **Flow Pemulihan (Disaster Recovery):** Tim akan mengimplementasikan fungsi UI Restore untuk mendemonstrasikan bahwa jika *database* lokal dihapus, indeks memori dapat ditarik kembali utuh dari Walrus.

---

## **5\. Pembagian Peran Tim**

* **🎨 Frontend / UI Engineer (FE):**  
  * Membangun UI/UX level industri. Membuat dua tema yang sangat kontras (Tavern vs Zen Board).  
  * Mengelola transisi *loading state* saat membaca dari *blockchain*.  
* **🧠 AI & Backend Engineer (BE):**  
  * Mengelola Vercel AI SDK dan *System Prompting*.  
  * Membangun arsitektur agar agen AI menghasilkan ekstraksi data yang persisten (tidak halusinasi) sebelum dilempar ke Walrus.  
* **🔗 Web3 & Infrastructure Engineer (Web3):**  
  * Mengonfigurasi integrasi [MemWal](https://github.com/MystenLabs/MemWal) secara penuh.  
  * Mengelola *Delegate Keys*, izin (*Permissions*) *Smart Contract*, dan memastikan eksekusi *Restore Indexing* berjalan lancar di jaringan Testnet Sui.

---

## **6\. Flow Development (Timeline 1 Bulan / 4 Minggu)**

* **Minggu 1: Arsitektur & Proof of Concept (PoC)**  
  * Inisiasi repositori Github.  
  * Web3 & BE menjalankan PoC dengan mengonfigurasi Walrus Client dan memastikan integrasi API remember/recall berhasil di *terminal* (tanpa UI).  
  * FE membangun *wireframe* dan *component library* dasar.  
* **Minggu 2: Pengembangan Aplikasi A (The Ingestion Engine)**  
  * FE menyelesaikan UI *chat* interaktif untuk Tavern.  
  * BE menyambungkan AI *prompt* dan logika ekstraksi data terstruktur.  
  * Web3 memastikan *Delegate Access* tersimpan dan berfungsi sempurna untuk penulisan data ke Testnet.  
* **Minggu 3: Pengembangan Aplikasi B (The Cross-Agent Recall)**  
  * FE membangun UI *dashboard* kerja yang dinamis.  
  * BE & Web3 mengintegrasikan pembacaan memori. AI dirancang untuk memuat informasi memori pengguna sebelum *rendering* halaman selesai.  
  * Pengujian fitur *Restore* secara *end-to-end*.  
* **Minggu 4: Polish, Edge Cases & Presentasi Final**  
  * *Debugging* massal, menangani *error state* (misal jika Testnet lambat).  
  * Memoles animasi UI untuk mendramatisir perpindahan "jiwa" AI.  
  * Merekam dan mengedit video demo 5 menit yang berfokus pada masalah, solusi teknis, dan demonstrasi aplikasi.  
  * *Deployment* ke produksi (Vercel).

---

## **7\. Checklist Pengumpulan (Submission Checklist)**

* \[ \] Nama & Deskripsi Proyek yang konkrit.  
* \[ \] Logo Proyek (1:1 JPG/PNG).  
* \[ \] Link GitHub Repository (Wajib di-*set* ke *Public*).  
* \[ \] Link Video Demo (YouTube, Maksimal 5 Menit).  
* \[ \] Link URL Live Application (Berjalan di versi *Production* Vercel/Netlify).  
* \[ \] Aplikasi terbukti membaca/menulis memori ke jaringan Walrus Testnet.

**CHEATCHEET FRONT END**

---

### **🛠️ Tech Stack yang Direkomendasikan**

* **Framework:** Next.js (App Router) untuk kemudahan integrasi API dan *routing*.  
* **Styling:** TailwindCSS dipadukan dengan komponen siap pakai (seperti Shadcn UI atau Chakra UI) untuk mempercepat *development*.  
* **Animasi:** Framer Motion (untuk efek transisi memori yang dramatis).  
* **Web3 UI:** @mysten/dapp-kit (jika menggunakan *login wallet*) atau form UI sederhana untuk *input Delegate Key*.  
* **AI UI:** ai/react (bagian dari *Vercel AI SDK*) untuk komponen *chat*.

---

### **🗓️ Workflow 4 Minggu untuk Frontend Engineer**

#### **Minggu 1: Fondasi, Desain, & Setup Proyek**

**Fokus:** Membangun kerangka dasar agar Backend (BE) dan Web3 Engineer punya tempat untuk menguji API mereka.

* **Desain UI (Wireframing):** Buat desain kasar (bisa di Figma atau di atas kertas). Fokus pada **kontras visual**:  
  * **App A (Tavern Chat):** Tema gelap (*dark mode*), *font pixel/retro*, *background* kedai fantasi.  
  * **App B (Zen Board):** Tema terang (*light mode*), minimalis, bersih, mirip antarmuka Notion atau Linear.  
* **Setup Proyek:** Inisialisasi *repository* Next.js, instal TailwindCSS, dan atur struktur folder.  
* **Routing Dasar:** Buat halaman /tavern dan /zenboard.  
* **UI Autentikasi:** Buat komponen modal/halaman *login* di mana pengguna bisa menghubungkan *wallet* atau memasukkan *Delegate Key* dari [MemWal Playground](https://docs.wal.app/walrus-memory/getting-started/what-is-walrus-memory).

#### **Minggu 2: Membangun Aplikasi A (The Ingestion Engine)**

**Fokus:** Membuat antarmuka *chat* yang responsif dan menghubungkannya dengan API penulis data (*remember*).

* **Membangun Chat Interface:** Buat UI untuk Tavern Chat. Harus ada area pesan, input teks, dan tombol kirim. Gunakan useChat dari *Vercel AI SDK* agar pesan muncul secara *streaming* (*typewriter effect*).  
* **Visualisasi Proses (Loading State):** Ini bagian penting\! Saat pengguna mengetik sesuatu yang penting (misal: "Aku benci notifikasi"), buat indikator visual kecil (seperti ikon *loading* atau *toast notification*) yang bertuliskan: *"Mengekstrak memori ke [Walrus](https://docs.wal.app/docs/getting-started)..."*  
* **Integrasi API:** Sambungkan komponen *chat* dengan *endpoint* API yang dibuat oleh BE untuk memicu fungsi memwal.remember.  
* **Feedback Sukses:** Tampilkan animasi centang hijau saat memori berhasil terenkripsi di *blockchain*.

#### **Minggu 3: Membangun Aplikasi B (The Cross-Agent Recall)**

**Fokus:** Menciptakan "Momen Wow" saat data ditarik melintasi aplikasi.

* **Membangun Dashboard Interface:** Buat UI Zen Board yang berisi *To-Do list*, kalender, atau sekadar teks sapaan asisten kerja.  
* **The "Recall" Animation (Penting\!):** Saat pengguna pertama kali membuka /zenboard dan memasukkan *Delegate Key*, **jangan langsung tampilkan halaman secara instan**.  
  * Buat layar *loading* transisi (misalnya animasi sinkronisasi data).  
  * Tambahkan teks dinamis: *"Menghubungkan identitas Aura... Menarik memori dari Walrus Network... Menerapkan preferensi..."*  
* **Integrasi Data:** Sambungkan UI dengan *endpoint* memwal.recall milik BE. Saat data memori masuk, *render* UI sesuai data tersebut (misalnya, secara otomatis mengubah tema ke *silent mode* atau menampilkan tugas yang relevan).  
* **UI Restore (Disaster Recovery):** Sediakan satu tombol khusus *"Restore Memory Index"* di menu pengaturan, yang terhubung ke fungsi Restore dari [MemWal Github Repo](https://github.com/MystenLabs/MemWal).

#### **Minggu 4: Polishing, Edge Cases, & Produksi**

**Fokus:** Merapikan *bug* visual, menangani *error*, dan memastikan demo siap direkam.

* **Error Handling (UX yang baik):** \* Bagaimana jika Testnet Sui sedang *down*? Buat pesan *error* yang ramah (contoh: *"Koneksi ke jaringan Walrus terputus, mencoba kembali..."*).  
  * Bagaimana jika pengguna tidak memiliki *Delegate Key* yang valid? Tampilkan peringatan dengan desain yang baik.  
* **Responsivitas (Mobile & Desktop):** Pastikan kedua aplikasi terlihat bagus baik saat dibuka di laptop maupun di layar *smartphone*.  
* **Bantu Pembuatan Video Demo:** Saat *Storyteller* merekam layar, pastikan FE membantu melakukan "koreografi" klik agar transisi dari App A ke App B terlihat selancar mungkin.  
* **Deployment Final:** Bantu tim memverifikasi bahwa versi *build* di Vercel/Netlify berjalan sama baiknya dengan *localhost*.

---

### **💡 Tips Khusus untuk Frontend Engineer di Hackathon Ini**

Juri pada *track* ini sangat mementingkan **"Portable by Design"**. Sebagai FE, tugasmu adalah membuat perpindahan data ini terasa sangat nyata bagi pengguna awam.

Jangan biarkan proses transfer data ke *blockchain* terjadi secara diam-diam tanpa umpan balik visual. Gunakan notifikasi (*toast*), *spinner*, dan teks status (*"Encrypting to Seal...", "Uploading to Walrus..."*) untuk terus mengingatkan juri bahwa aplikasi ini tidak menggunakan *database* biasa, melainkan menyimpan memori secara terdesentralisasi.

**CHEATSHEET BACKEND DAN AI ENGINEER**

---

### **🛠️ Tech Stack yang Direkomendasikan**

* **Framework:** Next.js (App Router) untuk membangun API Routes (/api/chat, /api/memory).  
* **AI Engine:** *Vercel AI SDK* (ai dan @ai-sdk/openai atau Anthropic) untuk mengelola *streaming* teks dan *tool calling*.  
* **Memory SDK:** @mysten-incubation/memwal (TypeScript SDK resmi dari [MemWal Github Repo](https://github.com/MystenLabs/MemWal)).  
* **Validation:** Zod (untuk memastikan AI selalu menghasilkan output JSON yang terstruktur saat mengekstrak memori).

---

### **🗓️ Workflow 4 Minggu untuk AI & Backend Engineer**

#### **Minggu 1: Setup "Otak" AI & Prompt Engineering**

**Fokus:** Membangun fondasi agen AI dan memastikan AI bisa mengekstrak informasi penting dari obrolan secara terstruktur (bukan cuma teks mentah).

* **Setup API Dasar:** Buat *endpoint* /api/chat menggunakan Next.js dan Vercel AI SDK. Pastikan kamu bisa melakukan obrolan dasar (*streaming chat*).  
* **System Prompting (Tavern Chat):** Rancang *prompt* sistem yang kuat untuk Aplikasi A.  
  * *Contoh instruksi AI:* "Kamu adalah penjaga kedai fantasi. Tugas utamamu adalah memancing pengguna bercerita tentang pekerjaan dan keluhan mereka, lalu merangkum preferensi mereka."  
* **Structured Output (JSON):** Gunakan fitur generateObject atau *tool calling* dari Vercel AI SDK dipadukan dengan Zod. Pastikan setiap kali pengguna selesai bercerita, AI menghasilkan JSON seperti: { "tipe": "preferensi\_kerja", "nilai": "benci notifikasi berisik" }.  
* **Uji Coba SDK Manual:** Buat skrip Node.js sederhana (tanpa UI) untuk menguji fungsi memwal.remember dan memwal.recall menggunakan *Delegate Key* percobaanmu sendiri di Testnet.

#### **Minggu 2: Membangun Ingestion Engine (Fase Tulis)**

**Fokus:** Menghubungkan logika AI di Aplikasi A dengan *blockchain* menggunakan [Walrus Memory](https://docs.wal.app/walrus-memory/getting-started/what-is-walrus-memory).

* **Integrasi MemWal (Remember):** Modifikasi /api/chat agar setiap kali AI berhasil mengekstrak JSON dari obrolan, *endpoint* ini otomatis memanggil fungsi memwal.remember(fakta).  
* **Metadata & Indexing:** Pastikan data yang disimpan ke Walrus memiliki konteks yang cukup. Jangan hanya menyimpan "User benci notifikasi", tapi simpan sebagai: *"Pengguna (Programmer React) memiliki preferensi gaya kerja: benci notifikasi berisik, butuh lingkungan tenang."* (Relayer Walrus akan mengubah ini menjadi *vector embedding* agar mudah dicari nanti).  
* **Kolaborasi dengan FE:** Berikan *response status* yang jelas ke Frontend (misal: status: "extracting", status: "saving\_to\_walrus") agar FE bisa memicu animasi *loading*.

#### **Minggu 3: Membangun Cross-Agent Recall (Fase Baca)**

**Fokus:** Menciptakan "Momen Wow" di mana Aplikasi B (Zen Board) menarik memori masa lalu dan menyuntikkannya ke dalam konteks AI.

* **Integrasi MemWal (Recall):** Buat *endpoint* /api/board-init. Saat Aplikasi B pertama kali dimuat dengan *Delegate Key*, *endpoint* ini harus memanggil memwal.recall({ query: "preferensi kerja dan status emosi terakhir pengguna" }).  
* **Context Injection:** Setelah data ditarik dari Walrus, suntikkan data tersebut secara tersembunyi ke dalam *System Prompt* asisten kerja di Aplikasi B.  
  * *Contoh injeksi:* "Konteks pengguna dari memori: \[Pengguna sedang lelah coding React, benci notifikasi berisik\]. Sapa pengguna berdasarkan konteks ini."  
* **Koordinasi dengan Web3 Engineer:** Pastikan *Delegate Key* yang diteruskan dari Frontend (*wallet auth*) diteruskan dengan aman ke MemWal SDK di Backend.

#### **Minggu 4: Optimasi, Edge Cases, & Disaster Recovery**

**Fokus:** Membuat sistem kebal dari *error* dan mengoptimalkan kecepatan respons.

* **Latency Optimization:** Menarik data dari *blockchain* atau relayer bisa memakan waktu beberapa detik. Pastikan fungsi recall berjalan seefisien mungkin dan tidak memblokir render halaman utama terlalu lama.  
* **Error Handling (Sangat Krusial):** \* Apa yang terjadi jika API Walrus Testnet *timeout*? Buat mekanisme *retry* (coba ulang otomatis) di Backend.  
  * Apa yang terjadi jika pengguna baru (belum punya memori sama sekali) masuk ke Aplikasi B? Pastikan AI tidak berhalusinasi, melainkan memberikan sapaan *default* (misal: *"Halo\! Sepertinya kita baru pertama kali bertemu."*).  
* **Pengujian Restore:** Bersama Web3 Engineer, uji coba fungsi memwal.restore untuk memastikan indeks memori bisa dibangun ulang jika terjadi masalah server.

---

### **💡 Tips Khusus untuk AI & Backend Engineer**

Kunci kemenangan teknis di *track* ini ada pada **Semantic Search** yang disediakan oleh Walrus Memory.

Jangan menyuruh fungsi memwal.recall mencari kata kunci persis (*exact match*). Walrus menggunakan *vector embeddings*, yang artinya dia paham **makna**. Jika pengguna mengetik *"Aku capek ngoding"*, pastikan *query recall* kamu di Aplikasi B cukup dinamis seperti *"kondisi mental dan aktivitas pengguna saat ini"*. Semakin natural AI menyambungkan konteks antar-aplikasi, semakin juri akan terkesan dengan eksekusi teknismu\!

**CHEATSHEET SMARTCONTRACT**

---

### **🛠️ Tech Stack yang Direkomendasikan**

* **Smart Contract:** Bahasa Sui Move (untuk membuat logika *ownership* kustom atau NFT Identitas).  
* **Infrastruktur Data:** Walrus CLI & Walrus Client (untuk mengelola *blob storage* di Testnet/Mainnet).  
* **Privacy Layer:** [Seal](https://mystenlabs.notion.site/walrus-track-problem-statement) (untuk memastikan enkripsi *end-to-end* sebelum data masuk ke Walrus).  
* **Memory SDK:** Pemahaman mendalam tentang arsitektur @mysten-incubation/memwal (terutama fungsi *Delegate Keys* dan *Restore*).

---

### **🗓️ Workflow 4 Minggu untuk Web3 & SC Engineer**

#### **Minggu 1: Setup Infrastruktur Dasar & Kustomisasi Move**

**Fokus:** Membangun jembatan antara aplikasi lokal tim dengan jaringan Sui dan Walrus.

* **Setup Wallet & Faucet:** Menginstal *suiup* dan *walrus CLI*. Membuat *wallet* khusus *development*, lalu mengklaim token SUI dan WAL dari Testnet Faucet.  
* **Eksplorasi Delegate Key:** Mempelajari cara kerja *Delegate Access* di MemWal. Men-generate kunci delegasi awal yang akan digunakan oleh Backend Engineer (BE) untuk pengujian.  
* **Menulis Custom Smart Contract (Sui Move):** *Ini nilai plus besar untuk standar MVP tinggi\!* Buat *smart contract* sederhana yang mencetak (minting) "Identitas Aura" sebagai sebuah NFT (*Non-Fungible Token*) di *wallet* pengguna. NFT ini akan bertindak sebagai "paspor" yang menyimpan referensi ke *Namespace* Walrus Memory milik pengguna.

#### **Minggu 2: Keamanan Data & Fase Ingestion**

**Fokus:** Memastikan data yang ditulis oleh Aplikasi A ke [Walrus Memory](https://docs.wal.app/walrus-memory/getting-started/what-is-walrus-memory) terenkripsi dan sah secara kriptografis.

* **Integrasi Enkripsi (Seal):** Pastikan jalur data dari pengguna menuju *relayer* MemWal sudah melewati lapisan privasi Seal. Juri sangat kritis terhadap privasi data AI; buktikan bahwa meskipun data bersifat publik di Walrus, tidak ada yang bisa membacanya kecuali pemilik *Delegate Key*.  
* **Manajemen Otorisasi:** Pastikan *Smart Contract* atau konfigurasi *wallet* kalian dapat memberikan izin (*Programmable Permissions*) dengan batas waktu tertentu atau batas lingkup (*scoped access*) kepada Aplikasi A untuk menulis data.  
* **Monitoring Transaksi:** Gunakan *Sui Explorer* dan *Walrus Explorer* untuk memantau apakah *blob* memori dari Aplikasi A benar-benar masuk ke *blockchain* dan berapa estimasi *gas fee*\-nya.

#### **Minggu 3: Cross-Agent Access & Disaster Recovery**

**Fokus:** Mengatur izin baca lintas aplikasi dan membuktikan ketahanan data.

* **Akses Lintas Aplikasi (Cross-App Permission):** Mengatur logika *on-chain* atau memvalidasi *Delegate Key* agar Aplikasi B (Zen Board) memiliki hak akses baca (*read-only*) terhadap memori yang ditulis oleh Aplikasi A.  
* **Sistem Pemulihan (Restore Mechanism):** Ini adalah **tugas wajib** untuk SC/Web3 Engineer di *track* ini. Simulasikan skenario di mana *database* lokal/indexer mati. Gunakan fungsi memwal.restore untuk membangun ulang indeks memori secara keseluruhan dari jaringan Walrus ke aplikasi lokal, membuktikan bahwa data pengguna tidak akan pernah hilang.

#### **Minggu 4: Audit, Optimasi, & Persiapan Deployment**

**Fokus:** Mengamankan *smart contract*, mengoptimalkan biaya, dan persiapan peluncuran.

* **Audit & Pengujian Move:** Lakukan *unit testing* pada *smart contract* Sui Move yang kamu tulis. Pastikan tidak ada celah keamanan yang membuat pihak lain bisa mencuri *Delegate Key* atau menghapus identitas AI pengguna.  
* **Optimasi Storage (Epochs):** Atur parameter penahanan *blob* (misalnya menggunakan *flag* \--epochs) agar memori AI tidak kadaluarsa terlalu cepat selama masa penjurian.  
* **Deployment ke Mainnet (Opsional tapi Menguntungkan):** Siapkan skrip *deployment*. Jika sistem sudah stabil di Testnet, pertimbangkan untuk men-*deploy* *smart contract* ke Sui Mainnet.

---

### **💡 Tips Khusus untuk Web3 / SC Engineer**

Sesuai dengan aturan di [Sui Overflow 2026 Handbook](https://mystenlabs.notion.site/overflow-2026-handbook), hadiah untuk proyek pemenang menggunakan sistem distribusi **50% saat pengumuman dan 50% setelah Mainnet Deployment**. Jika proyek kalian sudah *live* di Mainnet saat pengumuman pemenang di bulan Agustus, kalian langsung mendapatkan **100% hadiah penuh di awal**.

Mengingat kalian sekarang punya waktu 1 bulan penuh dengan standar MVP tinggi, apakah tim kalian berencana menargetkan *deployment* langsung ke Mainnet untuk mengamankan peluang hadiah 100% tersebut?

