import { ZKMemoryProof } from './types';
import * as crypto from 'crypto';

// Implementasi ZK-Proof sederhana berbasis Merkle Tree untuk Hackathon
// Pada produksi, ini akan diganti dengan Groth16/PLONK circuit on-chain

function computeSha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

export function generateMemoryProof(dataJson: string, fieldToReveal: string): ZKMemoryProof {
    const data = JSON.parse(dataJson);
    
    // Hash individual fields (leaf nodes)
    const leaves = Object.keys(data).sort().map(key => {
        const value = typeof data[key] === 'object' ? JSON.stringify(data[key]) : String(data[key]);
        return computeSha256(`${key}:${value}`);
    });

    // Dummy merkle root generation for PoC
    // In real app, we build a proper Merkle Tree
    const merkleRoot = computeSha256(dataJson); 
    
    if (!(fieldToReveal in data)) {
        throw new Error(`Field ${fieldToReveal} not found in data`);
    }

    const revealedValue = String(data[fieldToReveal]);
    const revealedLeafHash = computeSha256(`${fieldToReveal}:${revealedValue}`);

    return {
        merkleRoot,
        revealedField: fieldToReveal,
        revealedValue: revealedValue,
        revealedLeafHash,
        merklePath: ["dummy_path_1", "dummy_path_2"], // Dummy for PoC
        pathIndices: [0, 1]
    };
}

export function verifyMemoryProof(
    proof: ZKMemoryProof,
    expectedHash: string,
    expectedCategory: string
): boolean {
    // 1. Cek apakah merkle root cocok dengan hash yang ada di on-chain
    if (proof.merkleRoot !== expectedHash) return false;
    
    // 2. Cek apakah nilai field yang direveal sesuai dengan yang diharapkan
    if (proof.revealedValue !== expectedCategory) return false;

    // 3. Verifikasi konsistensi leaf hash
    const computedLeaf = computeSha256(`${proof.revealedField}:${proof.revealedValue}`);
    if (computedLeaf !== proof.revealedLeafHash) return false;

    // 4. Verifikasi merkle path (Diabaikan di PoC ini)
    
    return true;
}
