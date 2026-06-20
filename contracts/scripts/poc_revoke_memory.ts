import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { AuraClient } from '../sdk/dist/index.js';

async function main() {
    console.log("=== Demo: Revoke / Hapus Memori dari Aura Identity ===\n");

    const privKey = process.env.SUI_PRIVATE_KEY;
    const packageId = process.env.NEXT_PUBLIC_AURA_PACKAGE_ID;
    const identityId = process.env.AURA_IDENTITY_ID;

    if (!privKey || !packageId || !identityId) {
        console.error("❌ Environment variables belum lengkap!");
        return;
    }
    
    const signer = Ed25519Keypair.fromSecretKey(privKey);

    const aura = new AuraClient({
        network: 'testnet',
        packageId: packageId,
    });

    // 1. Simpan memori baru yang nanti akan kita hapus
    console.log("1. Menyimpan memori sementara (Attest)...");
    const result = await aura.remember(signer, identityId, {
        type: 'temporary_note',
        value: 'This note will be deleted soon',
        source_app: 'Aura Demo',
        confirmed_by_user: true,
        timestamp: new Date().toISOString()
    });
    
    console.log(`✅ Memori tersimpan! Blob ID: ${result.blobId}`);
    
    console.log("Menunggu 3 detik agar blockchain sinkronisasi data transaksi sebelumnya...");
    await new Promise(r => setTimeout(r, 3000));
    
    // 2. Hapus (Revoke) memori tersebut
    console.log("\n2. Mengirim perintah Hapus (Revoke) ke blockchain...");
    
    const revokeDigest = await aura.revoke(signer, identityId, result.blobId);
    
    console.log(`✅ Memori berhasil dihapus (ditarik hak aksesnya)!`);
    console.log(`   Tx Digest: https://suiscan.xyz/testnet/tx/${revokeDigest}`);
    console.log(`\nSekarang memori ini tidak akan muncul di halaman daftar memori.`);
}

main().catch(console.error);
