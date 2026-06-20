import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { AuraConfig, MarketplaceConfig, AccessPassInfo } from './types';

export async function configureMarketplace(
    client: SuiJsonRpcClient,
    signer: Ed25519Keypair,
    config: AuraConfig,
    identityId: string,
    marketConfig: MarketplaceConfig
): Promise<string> {
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

export async function purchaseAccess(
    client: SuiJsonRpcClient,
    signer: Ed25519Keypair,
    config: AuraConfig,
    identityId: string,
    paymentAmount: number,
    accessType: string = "full"
): Promise<string> {
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
