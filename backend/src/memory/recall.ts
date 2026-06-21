import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { AuraClient } from '@aura-identity/sdk';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

const packageId = process.env.NEXT_PUBLIC_AURA_PACKAGE_ID || '0xa06895fe1ff9c0301aaadad6c2c1c5e9e02c28e40f4e055a487d65de079ff88a';

export async function fetchUserMemories(identityId: string) {
    const client = new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl('testnet'), network: 'testnet' });
    const aura = new AuraClient({ network: 'testnet', packageId });

    // Query Sui events for this identity
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

    const memories = [];
    // Fetch blob data from Walrus via AuraClient
    for (const event of activeMemories) {
        const blobId = (event.parsedJson as any).blob_id;
        try {
            const verifyResult = await aura.verify(identityId, blobId);
            if (verifyResult.verified && verifyResult.data) {
                memories.push(verifyResult.data);
            }
        } catch (e) {
            console.warn("Failed to fetch/verify blob:", blobId, e);
        }
    }

    return memories;
}
