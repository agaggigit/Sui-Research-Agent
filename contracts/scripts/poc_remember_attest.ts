import { getJsonRpcFullnodeUrl, SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

// Load environment variables
dotenv.config({ path: './.env.local' });

const AURA_PACKAGE_ID = process.env.NEXT_PUBLIC_AURA_PACKAGE_ID;
const PRIVATE_KEY = process.env.SUI_PRIVATE_KEY;
const IDENTITY_ID = process.env.AURA_IDENTITY_ID;
const WALRUS_PUBLISHER_URL = process.env.WALRUS_PUBLISHER_URL || "https://publisher.walrus-testnet.walrus.space";

if (!AURA_PACKAGE_ID) {
    console.error("Missing NEXT_PUBLIC_AURA_PACKAGE_ID in .env.local");
    process.exit(1);
}

// Helper to compute SHA-256
function computeSha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

async function uploadToWalrus(dataStr: string): Promise<string> {
    // [OPTIMASI W4.3]: Di Testnet, kita menggunakan epochs=1 untuk testing yang murah dan cepat.
    // Namun untuk PRODUCTION (Mainnet), gunakan `epochs=53` (sekitar 1 tahun) agar data aman lebih lama.
    console.log(`[Walrus] Mengunggah data ke Walrus Testnet (epochs=1)...`);
    const response = await fetch(`${WALRUS_PUBLISHER_URL}/v1/store?epochs=1`, {
        method: 'PUT',
        body: dataStr
    });

    if (!response.ok) {
        throw new Error(`Walrus upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Walrus response depends on whether the blob is new or already exists
    let blobId = "";
    if (result.newlyCreated) {
        blobId = result.newlyCreated.blobObject.blobId;
    } else if (result.alreadyCertified) {
        blobId = result.alreadyCertified.blobId;
    } else {
        console.error("Unknown Walrus response format:", result);
        throw new Error("Failed to parse Blob ID from Walrus");
    }
    
    console.log(`[Walrus] Berhasil! Blob ID: ${blobId}`);
    return blobId;
}

async function main() {
    if (!PRIVATE_KEY || !IDENTITY_ID) {
        console.log("⚠️ PENTING: Untuk menjalankan script ini, lengkapi .env.local Anda dengan SUI_PRIVATE_KEY dan AURA_IDENTITY_ID.");
        return;
    }

    console.log("=== 1. Membuat Data Fakta / Memori ===");
    const memoryFact = {
        type: "work_pref",
        value: "hates loud notifications",
        tags: ["work", "focus", "environment"],
        related_to: ["stress", "deep_work"],
        source_app: "tavern_chat",
        confirmed_by_user: true,
        timestamp: new Date().toISOString()
    };

    const dataString = JSON.stringify(memoryFact, null, 2);
    console.log("Data:");
    console.log(dataString);
    
    const dataHash = computeSha256(dataString);
    console.log(`\nSHA-256 Hash: ${dataHash}\n`);

    console.log("=== 2. Menyimpan ke Walrus ===");
    const blobId = await uploadToWalrus(dataString);

    console.log("\n=== 3. Attestasi Memori ke Blockchain Sui ===");
    const client = new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl('testnet'), network: 'testnet' });
    
    // Di aplikasi nyata, kita akan menggunakan Session Key.
    // Di PoC ini, untuk kemudahan testing, kita bisa memakai Main Wallet (yang juga diizinkan oleh Smart Contract).
    const { secretKey } = decodeSuiPrivateKey(PRIVATE_KEY);
    const signerWallet = Ed25519Keypair.fromSecretKey(secretKey);

    console.log(`Menjalankan attest_memory untuk AuraIdentity: ${IDENTITY_ID}`);

    const tx = new Transaction();
    
    tx.moveCall({
        target: `${AURA_PACKAGE_ID}::aura_identity::attest_memory`,
        arguments: [
            tx.object(IDENTITY_ID),
            tx.pure.string(blobId),
            tx.pure.string(dataHash)
        ],
    });

    try {
        const result = await client.signAndExecuteTransaction({
            signer: signerWallet,
            transaction: tx,
            options: {
                showEffects: true,
                showEvents: true,
            },
        });

        console.log("\n✅ Memori Berhasil di-Attest (Disahkan) di Blockchain!");
        console.log(`Transaction Digest: ${result.digest}`);
        console.log(`Lihat Event di Suiscan: https://suiscan.xyz/testnet/tx/${result.digest}#events`);
        
        console.log("\n🔗 Rangkuman Bukti Eksekusi:");
        console.log(`1. Buka Explorer Walrus untuk melihat isi data : https://walruscan.com/testnet/blob/${blobId}`);
        console.log(`2. Buka Suiscan untuk melihat Event Attestasi: https://suiscan.xyz/testnet/tx/${result.digest}#events`);
    } catch (error) {
        console.error("\n❌ Gagal melakukan attest_memory:");
        console.error(error);
    }
}

main();
