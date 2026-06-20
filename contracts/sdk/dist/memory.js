import { Transaction } from '@mysten/sui/transactions';
import { uploadBlob, downloadBlob } from './walrus';
import * as crypto from 'crypto';
function computeSha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}
export async function remember(client, signer, config, identityId, fact) {
    const dataString = JSON.stringify(fact);
    const dataHash = computeSha256(dataString);
    const publisherUrl = config.walrusPublisherUrl || "https://publisher.walrus-testnet.walrus.space";
    const blobId = await uploadBlob(publisherUrl, dataString, 1);
    const tx = new Transaction();
    tx.moveCall({
        target: `${config.packageId}::aura_identity::attest_memory`,
        arguments: [
            tx.object(identityId),
            tx.pure.string(blobId),
            tx.pure.string(dataHash)
        ],
    });
    const result = await client.signAndExecuteTransaction({
        signer,
        transaction: tx,
        options: { showEffects: true }
    });
    return {
        blobId,
        dataHash,
        txDigest: result.digest,
        suiscanUrl: `https://suiscan.xyz/${config.network}/tx/${result.digest}`,
        walruscanUrl: `https://walruscan.com/${config.network}/blob/${blobId}`
    };
}
export async function verify(client, config, identityId, blobId) {
    const aggregatorUrl = config.walrusAggregatorUrl || "https://aggregator.walrus-testnet.walrus.space";
    let actualDataStr = "";
    try {
        actualDataStr = await downloadBlob(aggregatorUrl, blobId);
    }
    catch (e) {
        return { verified: false, data: null };
    }
    const computedHash = computeSha256(actualDataStr);
    // Dapatkan events dari blockchain untuk memverifikasi
    const queryResult = await client.queryEvents({
        query: { MoveEventType: `${config.packageId}::aura_identity::MemoryAttested` },
        order: "descending"
    });
    const event = queryResult.data.find((e) => e.parsedJson.identity_id === identityId && e.parsedJson.blob_id === blobId);
    if (!event)
        return { verified: false, data: null };
    const { data_hash } = event.parsedJson;
    if (computedHash === data_hash) {
        return { verified: true, data: JSON.parse(actualDataStr) };
    }
    return { verified: false, data: null };
}
export async function revokeMemory(client, signer, config, identityId, blobId) {
    const tx = new Transaction();
    tx.moveCall({
        target: `${config.packageId}::aura_identity::revoke_memory`,
        arguments: [
            tx.object(identityId),
            tx.pure.string(blobId)
        ],
    });
    const result = await client.signAndExecuteTransaction({
        signer,
        transaction: tx,
        options: { showEffects: true }
    });
    await client.waitForTransaction({ digest: result.digest });
    return result.digest;
}
