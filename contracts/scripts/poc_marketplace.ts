import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { AuraClient } from '../sdk/dist/index.js';
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

async function main() {
    console.log("=== Demo: Aura Memory Marketplace ===\n");

    const privKey = process.env.SUI_PRIVATE_KEY;
    const packageId = process.env.NEXT_PUBLIC_AURA_PACKAGE_ID;
    const identityId = process.env.AURA_IDENTITY_ID;

    if (!privKey || !packageId || !identityId) {
        console.error("❌ Environment variables belum lengkap!");
        return;
    }

    const client = new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl('testnet'), network: 'testnet' });
    
    // Anggap 'signer' adalah Pemilik (Alice)
    const ownerSigner = Ed25519Keypair.fromSecretKey(privKey);
    
    // Untuk menghindari delay faucet, kita gunakan ownerSigner sebagai pembeli
    const buyerSigner = ownerSigner;

    const aura = new AuraClient({
        network: 'testnet',
        packageId: packageId,
    });

    // 1. Owner mengatur harga
    console.log("\n1. Pemilik (Alice) menyalakan monetisasi...");
    const priceMist = 10000000; // 0.01 SUI
    const durationEpochs = 5;
    
    console.log(`   - Harga: 0.01 SUI`);
    console.log(`   - Durasi akses: ${durationEpochs} epoch`);
    
    const configDigest = await aura.configureMarketplace(ownerSigner, identityId, {
        price: priceMist,
        durationEpochs: durationEpochs,
        isForSale: true
    });
    console.log(`✅ Marketplace dikonfigurasi! Tx: https://suiscan.xyz/testnet/tx/${configDigest}`);
    console.log(`   Menunggu konfirmasi blockchain...`);
    await client.waitForTransaction({ digest: configDigest });
    console.log(`   Blockchain tersinkronisasi.\n`);

    // 2. Buyer membeli akses
    console.log("2. Pembeli (Bob) membayar 0.01 SUI untuk akses 'full'...");
    try {
        const purchaseDigest = await aura.purchaseAccess(buyerSigner, identityId, priceMist, "full");
        console.log(`✅ Pembelian Sukses! SUI langsung ditransfer ke Alice.`);
        console.log(`   NFT MemoryAccessPass telah dicetak untuk Bob.`);
        console.log(`   Tx: https://suiscan.xyz/testnet/tx/${purchaseDigest}\n`);
    } catch (e: any) {
        console.log(`❌ Gagal membeli (mungkin Faucet delay/error): ${e.message}\n`);
    }

    console.log("=== Demo Selesai ===");
}

main().catch(console.error);
