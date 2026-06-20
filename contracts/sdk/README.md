# @aura-identity/sdk

Universal AI Passport SDK. Portable, verifiable AI memory on Sui + Walrus.

## Instalasi
```bash
npm install @aura-identity/sdk @mysten/sui
```

## Quick Start

```typescript
import { AuraClient } from '@aura-identity/sdk';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

const aura = new AuraClient({
  network: 'testnet',
  packageId: '0xc3427de7ebf039e490518bed162baf864bc2d15a09bd0636449129e1e71e5d14'
});

// App A menyimpan memori
await aura.remember(signer, identityId, {
  type: 'work_pref',
  value: 'prefers dark mode',
  source_app: 'tavern_chat',
  confirmed_by_user: true,
  timestamp: new Date().toISOString()
});

// App B membaca dan memverifikasi
const result = await aura.verify(identityId, blobId);
if (result.verified) {
    console.log("Memory is authentic:", result.data);
}
```

## Fitur Unggulan
1. **Memory Marketplace:** Jual beli akses memori menggunakan `aura.configureMarketplace()` dan `aura.purchaseAccess()`
2. **ZK Memory Proof:** Verifikasi memori tanpa membaca isi datanya menggunakan `aura.proveMemoryCategory()`
