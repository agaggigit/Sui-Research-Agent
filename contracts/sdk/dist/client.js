import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { remember, verify, revokeMemory } from './memory';
import { configureMarketplace, purchaseAccess } from './marketplace';
import { generateMemoryProof, verifyMemoryProof } from './zkproof';
export class AuraClient {
    client;
    config;
    constructor(config) {
        this.config = config;
        this.client = new SuiJsonRpcClient({
            url: getJsonRpcFullnodeUrl(config.network),
            network: config.network
        });
    }
    // === Core Memory Operations ===
    async remember(signer, identityId, fact) {
        return await remember(this.client, signer, this.config, identityId, fact);
    }
    async verify(identityId, blobId) {
        return await verify(this.client, this.config, identityId, blobId);
    }
    async revoke(signer, identityId, blobId) {
        return await revokeMemory(this.client, signer, this.config, identityId, blobId);
    }
    // === Marketplace Operations ===
    async configureMarketplace(signer, identityId, marketConfig) {
        return await configureMarketplace(this.client, signer, this.config, identityId, marketConfig);
    }
    async purchaseAccess(signer, identityId, paymentAmount, accessType) {
        return await purchaseAccess(this.client, signer, this.config, identityId, paymentAmount, accessType);
    }
    // === ZK Privacy Operations ===
    proveMemoryCategory(dataJson, fieldToProve) {
        return generateMemoryProof(dataJson, fieldToProve);
    }
    verifyMemoryProof(proof, expectedHash, expectedCategory) {
        return verifyMemoryProof(proof, expectedHash, expectedCategory);
    }
}
