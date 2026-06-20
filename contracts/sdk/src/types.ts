export interface AuraConfig {
  network: 'testnet' | 'mainnet';
  packageId: string;
  walrusPublisherUrl?: string;
  walrusAggregatorUrl?: string;
}

export interface MemoryFact {
  type: string;
  value: string;
  tags?: string[];
  related_to?: string[];
  source_app: string;
  confirmed_by_user: boolean;
  timestamp: string;
}

export interface AttestedMemory {
  blobId: string;
  dataHash: string;
  epoch: number;
  timestamp: Date;
  attester: string;
  data?: MemoryFact;
  verified?: boolean;
}

export interface RememberResult {
  blobId: string;
  dataHash: string;
  txDigest: string;
  suiscanUrl: string;
  walruscanUrl: string;
}

export interface MarketplaceConfig {
  price: number; // In MIST
  durationEpochs: number;
  isForSale: boolean;
}

export interface AccessPassInfo {
  passId: string;
  identityId: string;
  buyer: string;
  accessType: string;
  expiresAtEpoch: number;
  isValid: boolean;
}

export interface ZKMemoryProof {
  merkleRoot: string;
  revealedField: string;
  revealedValue: string;
  revealedLeafHash: string;
  merklePath: string[];
  pathIndices: number[];
}
