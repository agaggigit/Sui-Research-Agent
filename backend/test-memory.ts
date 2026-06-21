import dotenv from "dotenv";
import path from "path";

// Memuat .env.local dari root folder
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { extractAndSaveMemory } from "./src/memory/extract";

async function runTest() {
  console.log("==========================================");
  console.log("🧪 MEMULAI TES TUGAS 2: INTEGRASI WALRUS");
  console.log("==========================================\n");

  const percakapanUser = "Aduh Aldric, hari ini ngoding React capek banget. Aku benci banget kalau teman guild-ku berisik kirim notifikasi terus.";
  const balasanAI = "Ah, petualangan di dunia kode memang melelahkan, pengembara. Duduklah di perapianku. Ketenangan adalah sihir terbaik untuk jiwa yang penat.";

  console.log("👤 User :", percakapanUser);
  console.log("🤖 Aldric :", balasanAI);
  console.log("\n⏳ Memanggil AI untuk mengekstrak memori dan menyimpannya ke blockchain...");

  // Menjalankan fungsi yang baru saja kita edit di Tugas 2 menggunakan Identity ID yang valid
  const identityId = "0x0000000000000000000000000000000000000000000000000000000000000000";
  await extractAndSaveMemory(percakapanUser, balasanAI, identityId);

  console.log("\n✅ Simulasi eksekusi Tugas 2 selesai.");
}

runTest();
