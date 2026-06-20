import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { AuraConfig, MarketplaceConfig } from './types';
export declare function configureMarketplace(client: SuiJsonRpcClient, signer: Ed25519Keypair, config: AuraConfig, identityId: string, marketConfig: MarketplaceConfig): Promise<string>;
export declare function purchaseAccess(client: SuiJsonRpcClient, signer: Ed25519Keypair, config: AuraConfig, identityId: string, paymentAmount: number, accessType?: string): Promise<string>;
