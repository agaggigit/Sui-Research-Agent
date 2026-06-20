import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import * as dotenv from 'dotenv';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';

// Load environment variables
dotenv.config({ path: './.env.local' });

const AURA_PACKAGE_ID = process.env.NEXT_PUBLIC_AURA_PACKAGE_ID;
const PRIVATE_KEY = process.env.SUI_PRIVATE_KEY;
const IDENTITY_ID = process.env.AURA_IDENTITY_ID;

if (!AURA_PACKAGE_ID) {
    console.error("Missing NEXT_PUBLIC_AURA_PACKAGE_ID in .env.local");
    process.exit(1);
}

console.log("=== 1. Generating Ephemeral Session Key ===");
// In a real frontend, this keypair is generated in the browser memory
const sessionKeypair = new Ed25519Keypair();
const sessionAddress = sessionKeypair.getPublicKey().toSuiAddress();

console.log(`Generated Session Address: ${sessionAddress}`);
// Note: In a real app, the secret key stays in the browser. 
// We print it here just for PoC demonstration purposes.
console.log(`Session Secret Key (hex): ${Buffer.from(sessionKeypair.getSecretKey()).toString('hex')}`);
console.log("===========================================\n");

async function main() {
    if (!PRIVATE_KEY || !IDENTITY_ID) {
        console.log("⚠️ PENTING: Untuk menjalankan pendaftaran secara otomatis ke blockchain, Anda perlu:");
        console.log("  1. Memasukkan SUI_PRIVATE_KEY dompet utama Anda ke .env.local (format bech32: suiprivkey...)");
        console.log("  2. Memasukkan AURA_IDENTITY_ID (Object ID dari NFT Aura yang sudah Anda mint) ke .env.local\n");
        console.log("Jika Anda ingin melakukannya secara manual via Suiscan, gunakan data ini:");
        console.log(`  Package ID   : ${AURA_PACKAGE_ID}`);
        console.log(`  Target Fungsi: aura_identity::authorize_session`);
        console.log(`  Parameter 1 (identity)            : ${IDENTITY_ID || "<Paste Object_ID_AuraIdentity Anda di sini>"}`);
        console.log(`  Parameter 2 (session_key_address) : ${sessionAddress}`);
        console.log(`  Parameter 3 (duration_epochs)     : 7\n`);
        return;
    }

    console.log("=== 2. Authorizing Session Key On-Chain ===");
    const client = new SuiClient({ url: getFullnodeUrl('testnet') });
    
    // Parse the bech32 private key string
    const { secretKey } = decodeSuiPrivateKey(PRIVATE_KEY);
    const mainWallet = Ed25519Keypair.fromSecretKey(secretKey);

    console.log(`Using Main Wallet: ${mainWallet.getPublicKey().toSuiAddress()}`);
    console.log(`Authorizing session for AuraIdentity: ${IDENTITY_ID}`);

    const tx = new Transaction();
    
    tx.moveCall({
        target: `${AURA_PACKAGE_ID}::aura_identity::authorize_session`,
        arguments: [
            tx.object(IDENTITY_ID),
            tx.pure.address(sessionAddress),
            tx.pure.u64(7) // valid for 7 epochs
        ],
    });

    try {
        const result = await client.signAndExecuteTransaction({
            signer: mainWallet,
            transaction: tx,
            options: {
                showEffects: true,
                showEvents: true,
            },
        });

        console.log("\n✅ Session Key Successfully Authorized!");
        console.log(`Transaction Digest: ${result.digest}`);
        console.log(`Lihat di Suiscan  : https://suiscan.xyz/testnet/tx/${result.digest}`);
    } catch (error) {
        console.error("\n❌ Failed to authorize session:");
        console.error(error);
    }
}

main();
