import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { AuraConfig, MemoryFact, RememberResult } from './types';
export declare function remember(client: SuiJsonRpcClient, signer: Ed25519Keypair, config: AuraConfig, identityId: string, fact: MemoryFact): Promise<RememberResult>;
export declare function verify(client: SuiJsonRpcClient, config: AuraConfig, identityId: string, blobId: string): Promise<{
    verified: boolean;
    data: MemoryFact | null;
}>;
export declare function revokeMemory(client: SuiJsonRpcClient, signer: Ed25519Keypair, config: AuraConfig, identityId: string, blobId: string): Promise<string>;
