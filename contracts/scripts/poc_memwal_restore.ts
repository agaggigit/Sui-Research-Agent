import { getJsonRpcFullnodeUrl, SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: './.env.local' });

const AURA_PACKAGE_ID = process.env.NEXT_PUBLIC_AURA_PACKAGE_ID;
const IDENTITY_ID = process.env.AURA_IDENTITY_ID;
const WALRUS_AGGREGATOR_URL = process.env.WALRUS_AGGREGATOR_URL || "https://aggregator.walrus-testnet.walrus.space";

if (!AURA_PACKAGE_ID || !IDENTITY_ID) {
    console.error("Missing NEXT_PUBLIC_AURA_PACKAGE_ID or AURA_IDENTITY_ID in .env.local");
    process.exit(1);
}

function computeSha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

async function fetchBlobFromWalrus(blobId: string): Promise<string> {
    const response = await fetch(`${WALRUS_AGGREGATOR_URL}/v1/${blobId}`);
    if (!response.ok) {
        throw new Error(`Failed to download blob from Walrus: ${response.statusText}`);
    }
    return await response.text();
}

async function memwalRestore() {
    const client = new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl('testnet'), network: 'testnet' });

    console.log(`[Disaster Recovery] Memulai proses restore untuk Identity: ${IDENTITY_ID}...\n`);
    
    // 1. Ambil seluruh event dari Sui
    console.log("1. Mengunduh daftar memori dari jaringan Sui...");
    const queryResult = await client.queryEvents({
        query: { MoveEventType: `${AURA_PACKAGE_ID}::aura_identity::MemoryAttested` },
        order: "ascending" // Ambil dari yang paling lama ke yang terbaru untuk urutan historis
    });

    const userEvents = queryResult.data.filter((e: any) => e.parsedJson.identity_id === IDENTITY_ID);

    if (userEvents.length === 0) {
        console.log("Tidak ada memori yang ditemukan untuk direstore.");
        return;
    }
    console.log(`Menemukan ${userEvents.length} event memori.\n`);

    // 2. Unduh dan verifikasi
    console.log("2. Mengunduh isi data dari Walrus dan memverifikasi integritas (SHA-256)...");
    const restoredMemories = [];

    for (let i = 0; i < userEvents.length; i++) {
        const { blob_id, data_hash, timestamp } = userEvents[i].parsedJson as any;
        console.log(`   -> Mengunduh Blob ${blob_id}...`);
        try {
            const rawData = await fetchBlobFromWalrus(blob_id);
            const computedHash = computeSha256(rawData);
            
            if (computedHash === data_hash) {
                let parsedData;
                try {
                    parsedData = JSON.parse(rawData);
                } catch {
                    parsedData = { text: rawData };
                }
                restoredMemories.push({
                    blobId: blob_id,
                    timestamp: new Date(Number(timestamp)),
                    data: parsedData
                });
                console.log(`      ✅ Berhasil diverifikasi.`);
            } else {
                console.log(`      ❌ Gagal diverifikasi (Hash Mismatch)! Blob diabaikan.`);
            }
        } catch (e: any) {
             console.log(`      ⚠️ Gagal mengunduh Blob: ${e.message}`);
        }
    }

    // 3. Simpan ke database lokal (JSON File)
    console.log("\n3. Menyimpan data yang berhasil direstore ke index lokal...");
    const dbPath = path.join(__dirname, 'local_index.json');
    
    const localDatabase = {
        identityId: IDENTITY_ID,
        lastRestoredAt: new Date().toISOString(),
        totalMemories: restoredMemories.length,
        memories: restoredMemories
    };

    fs.writeFileSync(dbPath, JSON.stringify(localDatabase, null, 2));
    
    console.log(`✅ Proses Restore Selesai!`);
    console.log(`Database lokal berhasil dibangun ulang dan disimpan di: ${dbPath}`);
}

memwalRestore();
