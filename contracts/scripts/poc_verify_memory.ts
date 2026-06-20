import { getJsonRpcFullnodeUrl, SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

// Load environment variables
dotenv.config({ path: './.env.local' });

const AURA_PACKAGE_ID = process.env.NEXT_PUBLIC_AURA_PACKAGE_ID;
const IDENTITY_ID = process.env.AURA_IDENTITY_ID;
const WALRUS_AGGREGATOR_URL = process.env.WALRUS_AGGREGATOR_URL || "https://aggregator.walrus-testnet.walrus.space";

if (!AURA_PACKAGE_ID || !IDENTITY_ID) {
    console.error("Missing NEXT_PUBLIC_AURA_PACKAGE_ID or AURA_IDENTITY_ID in .env.local");
    process.exit(1);
}

// Helper to compute SHA-256
function computeSha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

async function fetchBlobFromWalrus(blobId: string): Promise<string> {
    console.log(`[Walrus] Mengunduh Blob: ${blobId}...`);
    const response = await fetch(`${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobId}`);

    if (!response.ok) {
        throw new Error(`Failed to download blob from Walrus: ${response.statusText}`);
    }

    const textData = await response.text();
    return textData;
}

async function main() {
    const client = new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl('testnet'), network: 'testnet' });

    console.log(`=== Memverifikasi Memori untuk Identity: ${IDENTITY_ID} ===\n`);
    console.log("1. Mencari Event 'MemoryAttested' di Blockchain Sui...");

    let events;
    try {
        const queryResult = await client.queryEvents({
            query: {
                MoveEventType: `${AURA_PACKAGE_ID}::aura_identity::MemoryAttested`
            },
            order: "descending" // Dapatkan yang paling baru
        });
        events = queryResult.data;
    } catch (e) {
        console.error("Gagal query event:", e);
        return;
    }

    // Filter event agar hanya milik IDENTITY_ID yang kita mau
    const userEvents = events.filter((e: any) => e.parsedJson.identity_id === IDENTITY_ID);

    if (userEvents.length === 0) {
        console.log("Tidak ada memori yang di-attest untuk Identity ini.");
        return;
    }

    console.log(`Ditemukan ${userEvents.length} catatan memori yang disahkan.\n`);

    // Ambil contoh dari event terbaru
    const latestEvent = userEvents[0].parsedJson as any;
    const { blob_id, data_hash, attester, timestamp } = latestEvent;

    console.log("=== 2. Memverifikasi Event Terbaru ===");
    console.log(`Waktu Attestasi : ${new Date(Number(timestamp)).toISOString()}`);
    console.log(`Attester Wallet : ${attester}`);
    console.log(`Blob ID         : ${blob_id}`);
    console.log(`Hash Asli       : ${data_hash}\n`);

    console.log("3. Mengunduh data aktual dari jaringan Walrus...");
    try {
        const actualData = await fetchBlobFromWalrus(blob_id);
        console.log("\nIsi Memori (Data):");
        console.log(actualData);

        console.log("\n4. Mencocokkan Hash Kriptografis...");
        const computedHash = computeSha256(actualData);
        console.log(`Computed Hash : ${computedHash}`);
        
        if (computedHash === data_hash) {
            console.log("\n✅ VERIFIKASI BERHASIL: Memori ini terbukti ASLI dan TIDAK DIMANIPULASI!");
            console.log("App B (contoh: Zen Board) dapat mempercayai bahwa data ini benar-benar disetujui pengguna di App A.");
        } else {
            console.log("\n❌ VERIFIKASI GAGAL: Hash data tidak cocok. Data mungkin telah dimanipulasi!");
        }
    } catch (err) {
        console.error("Gagal memverifikasi:", err);
    }
}

main();
