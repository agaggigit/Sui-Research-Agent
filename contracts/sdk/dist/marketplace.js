import { Transaction } from '@mysten/sui/transactions';
export async function configureMarketplace(client, signer, config, identityId, marketConfig) {
    const tx = new Transaction();
    tx.moveCall({
        target: `${config.packageId}::aura_identity::configure_marketplace`,
        arguments: [
            tx.object(identityId),
            tx.pure.u64(marketConfig.price),
            tx.pure.u64(marketConfig.durationEpochs),
            tx.pure.bool(marketConfig.isForSale)
        ],
    });
    const result = await client.signAndExecuteTransaction({
        signer,
        transaction: tx,
    });
    return result.digest;
}
export async function purchaseAccess(client, signer, config, identityId, paymentAmount, accessType = "full") {
    const tx = new Transaction();
    // Split coin for payment
    const [coin] = tx.splitCoins(tx.gas, [paymentAmount]);
    tx.moveCall({
        target: `${config.packageId}::aura_identity::purchase_memory_access`,
        arguments: [
            tx.object(identityId),
            coin,
            tx.pure.string(accessType)
        ],
    });
    const result = await client.signAndExecuteTransaction({
        signer,
        transaction: tx,
        options: { showEffects: true, showEvents: true }
    });
    return result.digest;
}
