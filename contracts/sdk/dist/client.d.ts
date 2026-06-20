import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { AuraConfig, MemoryFact, RememberResult, MarketplaceConfig, ZKMemoryProof } from './types';
export declare class AuraClient {
    private client;
    private config;
    constructor(config: AuraConfig);
    remember(signer: Ed25519Keypair, identityId: string, fact: MemoryFact): Promise<RememberResult>;
    verify(identityId: string, blobId: string): Promise<{
        verified: boolean;
        data: MemoryFact | null;
    }>;
    configureMarketplace(signer: Ed25519Keypair, identityId: string, marketConfig: MarketplaceConfig): Promise<string>;
    purchaseAccess(signer: Ed25519Keypair, identityId: string, paymentAmount: number, accessType?: string): Promise<string>;
    proveMemoryCategory(dataJson: string, fieldToProve: string): ZKMemoryProof;
    verifyMemoryProof(proof: ZKMemoryProof, expectedHash: string, expectedCategory: string): boolean;
}
