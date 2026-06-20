import { ZKMemoryProof } from './types';
export declare function generateMemoryProof(dataJson: string, fieldToReveal: string): ZKMemoryProof;
export declare function verifyMemoryProof(proof: ZKMemoryProof, expectedHash: string, expectedCategory: string): boolean;
