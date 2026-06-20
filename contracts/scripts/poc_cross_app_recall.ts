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

function computeSha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

async function fetchBlobFromWalrus(blobId: string): Promise<string> {
    const response = await fetch(`${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobId}`);
    if (!response.ok) {
        throw new Error(`Failed to download blob from Walrus: ${response.statusText}`);
    }
    return await response.text();
}

/**
 * Mocking fungsi memwal.recall()
 * Di ekosistem asli, MemWal akan memiliki index lokal. Di PoC ini, kita meniru index
 * dengan me-load semuanya dari Walrus dan memfilternya (hanya untuk demonstrasi).
 */
async function memwalRecallAndVerify(query: string) {
    const client = new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl('testnet'), network: 'testnet' });

    console.log(`[MemWal SDK Mock] Recalling memories for query: "${query}"...\n`);
    
    // 1. Fetch all MemoryAttested events for this identity
    const queryResult = await client.queryEvents({
        query: { MoveEventType: `${AURA_PACKAGE_ID}::aura_identity::MemoryAttested` },
        order: "descending"
    });

    const userEvents = queryResult.data.filter((e: any) => e.parsedJson.identity_id === IDENTITY_ID);

    if (userEvents.length === 0) {
        console.log("No memories found for this identity on-chain.");
        return;
    }

    // 2. Download and verify all memories in parallel
    const recallResults = await Promise.all(userEvents.map(async (event) => {
        const { blob_id, data_hash, timestamp, attester } = event.parsedJson as any;
        
        try {
            const rawData = await fetchBlobFromWalrus(blob_id);
            const computedHash = computeSha256(rawData);
            const isVerified = (computedHash === data_hash);
            
            let parsedData;
            try {
                parsedData = JSON.parse(rawData);
            } catch {
                parsedData = { text: rawData }; // fallback jika bukan JSON
            }

            return {
                blob_id,
                timestamp: new Date(Number(timestamp)),
                attester,
                isVerified,
                data: parsedData
            };
        } catch (e: any) {
            return {
                blob_id,
                error: e.message,
                isVerified: false
            };
        }
    }));

    // 3. Filter by query (Simulation of vector search or keyword search)
    const matchedMemories = recallResults.filter(memory => {
        if (!memory.isVerified || memory.error) return false;
        
        const dataStr = JSON.stringify(memory.data).toLowerCase();
        return dataStr.includes(query.toLowerCase());
    });

    // 4. Output Results
    console.log(`=== HASIL PENCARIAN (Query: "${query}") ===`);
    console.log(`Total data terverifikasi dan cocok: ${matchedMemories.length}\n`);

    matchedMemories.forEach((mem, index) => {
        console.log(`[Hasil #${index + 1}]`);
        console.log(`- Attested By : ${mem.attester || 'Unknown'}`);
        console.log(`- Waktu       : ${mem.timestamp?.toISOString() || 'Unknown'}`);
        console.log(`- Status      : ✅ Terverifikasi Asli (Hash Match)`);
        console.log(`- Isi Memori  :`);
        console.dir(mem.data, { depth: null, colors: true });
        console.log("-------------------------------------------------");
    });
}

// Menjalankan fungsi recall dengan contoh keyword "work"
memwalRecallAndVerify("work");
