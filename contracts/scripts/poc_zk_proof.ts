import { generateMemoryProof, verifyMemoryProof } from '../sdk/dist/index.js';
import * as crypto from 'crypto';

function computeSha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

async function main() {
    console.log("=== Demo: ZK Memory Proof (Privacy-Preserving AI) ===\n");

    // 1. Data Asli (Privat - hanya ada di HP/Client user)
    const privateMemory = {
        type: 'phobia',
        value: 'extreme fear of spiders (arachnophobia)',
        source_app: 'psych_chat',
        confirmed_by_user: true,
        timestamp: new Date().toISOString()
    };
    
    const dataJson = JSON.stringify(privateMemory);
    const onChainHash = computeSha256(dataJson); // Ini yang dipublish ke blockchain

    console.log("1. Data Privat Pengguna:");
    console.log(`   Isi Data   : [TERSEMBUNYI] (berisi fobia laba-laba)`);
    console.log(`   Hash On-chain: ${onChainHash}\n`);

    console.log("2. Game VR ingin tahu: 'Apakah user ini punya data fobia?'");
    console.log("   Syarat: Game TIDAK BOLEH tahu apa fobianya.\n");

    // 3. User (SDK) menghasilkan ZK-Proof secara lokal
    console.log("3. SDK Generate ZK Proof secara lokal...");
    const proof = generateMemoryProof(dataJson, "type");
    
    console.log("   --- ISI PROOF YANG DIKIRIM KE GAME ---");
    console.log(`   Merkle Root   : ${proof.merkleRoot}`);
    console.log(`   Revealed Field: ${proof.revealedField}`);
    console.log(`   Revealed Value: ${proof.revealedValue}`);
    console.log(`   Leaf Hash     : ${proof.revealedLeafHash}`);
    console.log("   --------------------------------------\n");

    // 4. Game VR memverifikasi proof
    console.log("4. Game VR memverifikasi proof...");
    const isValid = verifyMemoryProof(proof, onChainHash, "phobia");

    if (isValid) {
        console.log("✅ Verifikasi BERHASIL!");
        console.log("   Game VR sekarang tahu PASTI bahwa user ini punya rekam medis 'phobia',");
        console.log("   KARENA hash merkle root-nya cocok dengan blockchain.");
        console.log("   NAMUN, Game VR TIDAK TAHU bahwa fobianya adalah laba-laba (value tersembunyi).");
    } else {
        console.log("❌ Verifikasi GAGAL!");
    }
}

main().catch(console.error);
