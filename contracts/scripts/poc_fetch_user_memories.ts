import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

async function main() {
    console.log("=== Demo: Mengambil Semua Memori Milik Satu Wallet/Identity ===");
    
    const packageId = process.env.NEXT_PUBLIC_AURA_PACKAGE_ID;
    const identityId = process.env.AURA_IDENTITY_ID; // Ini mewakili User A
    
    const client = new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl('testnet'), network: 'testnet' });

    console.log(`\nMencari memori untuk Identity: ${identityId}`);
    
    // Kita query ke blockchain: Tolong cari semua memori (event) yang diklaim oleh identityId ini!
    const attestedEvents = await client.queryEvents({
        query: { MoveEventType: `${packageId}::aura_identity::MemoryAttested` }
    });

    const revokedEvents = await client.queryEvents({
        query: { MoveEventType: `${packageId}::aura_identity::MemoryRevoked` }
    });

    // Saring hanya event milik Identity user ini
    const userMemories = attestedEvents.data.filter(e => 
        (e.parsedJson as any).identity_id === identityId
    );

    const revokedMemories = revokedEvents.data.filter(e => 
        (e.parsedJson as any).identity_id === identityId
    ).map(e => (e.parsedJson as any).blob_id);

    // Hilangkan memori yang ada di daftar 'revoked'
    const activeMemories = userMemories.filter(e => 
        !revokedMemories.includes((e.parsedJson as any).blob_id)
    );

    console.log(`\n✅ Ditemukan ${activeMemories.length} memori AKTIF milik user ini! (${revokedMemories.length} memori telah dihapus)`);
    
    activeMemories.forEach((mem, index) => {
        const data = mem.parsedJson as any;
        console.log(`\nMemori #${index + 1}:`);
        console.log(`- Blob ID di Walrus: ${data.blob_id}`);
        console.log(`- Hash Kriptografi : ${data.data_hash}`);
        console.log(`- Bukti bahwa ini milik wallet tersebut tercatat di Tx: ${mem.id.txDigest}`);
    });
}

main().catch(console.error);
