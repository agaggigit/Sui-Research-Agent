import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { AuraConfig, MemoryFact, AttestedMemory, RememberResult, MarketplaceConfig, ZKMemoryProof } from './types';
import { remember, verify } from './memory';
import { configureMarketplace, purchaseAccess } from './marketplace';
import { generateMemoryProof, verifyMemoryProof } from './zkproof';

export class AuraClient {
    private client: SuiJsonRpcClient;
    private config: AuraConfig;

    constructor(config: AuraConfig) {
        this.config = config;
        this.client = new SuiJsonRpcClient({ 
            url: getJsonRpcFullnodeUrl(config.network as any),
            network: config.network as any
        });
    }

    // === Core Memory Operations ===

    async remember(signer: Ed25519Keypair, identityId: string, fact: MemoryFact): Promise<RememberResult> {
        return await remember(this.client, signer, this.config, identityId, fact);
    }

    async verify(identityId: string, blobId: string): Promise<{ verified: boolean; data: MemoryFact | null }> {
        return await verify(this.client, this.config, identityId, blobId);
    }

    // === Marketplace Operations ===

    async configureMarketplace(signer: Ed25519Keypair, identityId: string, marketConfig: MarketplaceConfig): Promise<string> {
        return await configureMarketplace(this.client, signer, this.config, identityId, marketConfig);
    }

    async purchaseAccess(signer: Ed25519Keypair, identityId: string, paymentAmount: number, accessType?: string): Promise<string> {
        return await purchaseAccess(this.client, signer, this.config, identityId, paymentAmount, accessType);
    }

    // === ZK Privacy Operations ===

    proveMemoryCategory(dataJson: string, fieldToProve: string): ZKMemoryProof {
        return generateMemoryProof(dataJson, fieldToProve);
    }

    verifyMemoryProof(proof: ZKMemoryProof, expectedHash: string, expectedCategory: string): boolean {
        return verifyMemoryProof(proof, expectedHash, expectedCategory);
    }
}
