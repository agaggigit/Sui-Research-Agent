import { getJsonRpcFullnodeUrl, SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: './.env.local' });

async function main() {
    const client = new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl('testnet'), network: 'testnet' });
    const keypair = Ed25519Keypair.fromSecretKey(decodeSuiPrivateKey(process.env.SUI_PRIVATE_KEY!).secretKey);
    const walletAddress = keypair.toSuiAddress();
    console.log("Menggunakan Wallet:", walletAddress);

    const tx = new Transaction();
    tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_AURA_PACKAGE_ID}::aura_identity::mint_identity`,
        arguments: [
            tx.pure.string("My Aura Identity"),
            tx.pure.string("my_namespace")
        ],
    });

    console.log("Minting Aura Identity...");
    const result = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction: tx,
        options: { showEffects: true, showObjectChanges: true }
    });

    if (result.effects?.status.status !== 'success') {
        console.error("Gagal minting!", result.effects?.status.error);
        return;
    }

    const createdObject = result.objectChanges?.find(c => c.type === 'created' && c.objectType.includes('AuraIdentity'));
    if (createdObject) {
        const newId = (createdObject as any).objectId;
        console.log("✅ BERHASIL! Object ID baru:", newId);
        
        let envContent = fs.readFileSync('.env.local', 'utf-8');
        envContent = envContent.replace(/AURA_IDENTITY_ID=".*"/, `AURA_IDENTITY_ID="${newId}"`);
        fs.writeFileSync('.env.local', envContent);
        console.log("✅ File .env.local berhasil diupdate otomatis dengan Identity ID yang baru!");
    }
}
main().catch(console.error);
