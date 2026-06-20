import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { AuraClient } from "@aura-identity/sdk";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

async function run() {
  const aura = new AuraClient({
    network: 'testnet',
    packageId: '0xc3427de7ebf039e490518bed162baf864bc2d15a09bd0636449129e1e71e5d14'
  });

  if (!process.env.AURA_SERVER_SECRET) {
    console.log("No secret key found");
    return;
  }

  const signer = Ed25519Keypair.fromSecretKey(process.env.AURA_SERVER_SECRET);
  console.log("Wallet server:", signer.toSuiAddress());

  // Gunakan identityId dari browser user jika ada, atau buat yang palsu
  const identityId = "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"; // Mock identity

  console.log("Menyimpan ke Walrus & Sui...");
  try {
    const result = await aura.remember(signer, identityId, {
      type: "work_pref",
      value: "Tester ini sangat ingin melihat bukti blockchain.",
      source_app: "test_script",
      confirmed_by_user: true,
      timestamp: new Date().toISOString()
    });
    console.log("TRANSACTION DIGEST:", result.txDigest);
    console.log("BLOB ID:", result.blobId);
  } catch (e) {
    console.error("Error:", e);
  }
}

run();
