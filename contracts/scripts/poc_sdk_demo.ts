import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { AuraClient } from '../sdk/dist/index.js';

async function main() {
    console.log("=== Demo: Menggunakan Universal AI Passport SDK ===\n");

    const privKey = process.env.SUI_PRIVATE_KEY;
    const packageId = process.env.NEXT_PUBLIC_AURA_PACKAGE_ID;
    const identityId = process.env.AURA_IDENTITY_ID;

    if (!privKey || !packageId || !identityId) {
        console.error("❌ Environment variables belum lengkap!");
        return;
    }

    // 1. Inisialisasi SDK (Sangat mudah!)
    console.log("1. Menginisialisasi Aura SDK...");
    const signer = Ed25519Keypair.fromSecretKey(privKey);
    
    const aura = new AuraClient({
        network: 'testnet',
        packageId: packageId,
        walrusPublisherUrl: process.env.WALRUS_PUBLISHER_URL,
        walrusAggregatorUrl: process.env.WALRUS_AGGREGATOR_URL
    });
    console.log("✅ SDK Siap digunakan.\n");

    // 2. Menyimpan Memori (App A)
    console.log("2. Menyimpan preferensi 'suka kopi hitam' menggunakan SDK...");
    const memoryFact = {
        type: 'beverage_pref',
        value: 'loves black coffee without sugar',
        source_app: 'Coffee_Chatbot_App',
        confirmed_by_user: true,
        timestamp: new Date().toISOString()
    };

    const result = await aura.remember(signer, identityId, memoryFact);
    console.log("✅ Memori berhasil disimpan & di-attest!");
    console.log(`   - Blob ID : ${result.blobId}`);
    console.log(`   - Sui Tx  : ${result.suiscanUrl}\n`);

    // 3. Memverifikasi Memori (App B)
    console.log("3. App Lain (App B) memverifikasi memori...");
    console.log(`   Mendownload dari Walrus & mengecek hash di Sui (Blob: ${result.blobId})...`);
    
    const verifyResult = await aura.verify(identityId, result.blobId);
    
    if (verifyResult.verified && verifyResult.data) {
        console.log("✅ VERIFIKASI BERHASIL! Data terbukti asli dan belum diubah.");
        console.log("   Isi Memori:", verifyResult.data);
    } else {
        console.log("❌ VERIFIKASI GAGAL!");
    }
}

main().catch(console.error);
