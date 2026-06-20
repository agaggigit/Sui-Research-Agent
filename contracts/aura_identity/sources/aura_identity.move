module aura_identity::aura_identity {
    use std::string::{Self, String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::option::{Self, Option};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;

    /// Error codes
    const ENotOwner: u64 = 0;
    const ENotAuthorized: u64 = 1;
    const EInsufficientPayment: u64 = 2;
    const EAccessNotForSale: u64 = 3;

    /// The Aura Identity NFT. Acts as a passport for the user to access
    /// their Walrus-stored memories. Shared object so session keys can access it.
    public struct AuraIdentity has key, store {
        id: UID,
        name: String,
        walrus_namespace: String,
        owner: address,
        created_at: u64,
        version: u64,
        active_session_key: Option<address>,
        session_expires_at: Option<u64>, // Epoch when session expires
        
        // === Memory Marketplace ===
        access_price: u64,                // Harga dalam MIST (1 SUI = 1_000_000_000 MIST)
        access_duration_epochs: u64,      // Durasi akses dalam epoch
        is_for_sale: bool,                // Toggle: apakah memori dijual
        total_revenue: u64,               // Total pendapatan (akumulasi)
    }

    /// Access pass yang dimiliki pembeli setelah membayar
    public struct MemoryAccessPass has key, store {
        id: UID,
        identity_id: address,        // Identity yang diakses
        buyer: address,              // Siapa yang membeli
        access_type: String,         // "full" atau "category:work_pref"
        granted_at_epoch: u64,
        expires_at_epoch: u64,       // Akses kadaluarsa setelah N epoch
    }

    // === Events ===

    public struct IdentityMinted has copy, drop {
        identity_id: address,
        owner: address,
        name: String,
        walrus_namespace: String,
    }

    public struct NamespaceUpdated has copy, drop {
        identity_id: address,
        new_namespace: String,
        version: u64,
    }

    public struct SessionAuthorized has copy, drop {
        identity_id: address,
        session_key: address,
        expires_at_epoch: u64,
    }

    public struct SessionRevoked has copy, drop {
        identity_id: address,
    }

    public struct MemoryAttested has copy, drop {
        identity_id: address,
        blob_id: String,
        data_hash: String,
        epoch: u64,
        timestamp: u64,
        attester: address,
    }

    /// Event ketika akses memori dibeli
    public struct MemoryAccessPurchased has copy, drop {
        identity_id: address,
        buyer: address,
        price_paid: u64,
        access_type: String,
        expires_at_epoch: u64,
    }

    /// Event ketika harga marketplace diubah
    public struct MarketplaceConfigured has copy, drop {
        identity_id: address,
        price: u64,
        duration_epochs: u64,
        is_for_sale: bool,
    }

    /// Event ketika ZK proof berhasil diverifikasi dan di-attest
    public struct ZKProofAttested has copy, drop {
        identity_id: address,
        data_hash: String,             // hash data (tanpa reveal data)
        proven_field: String,          // field yang dibuktikan ("type")
        proven_value: String,          // nilai yang dibuktikan ("work_pref")
        proof_merkle_root: String,     // merkle root dari proof
        verifier: address,             // siapa yang memverifikasi
        epoch: u64,
    }

    // === Public Functions ===

    /// Mint a new AuraIdentity and share it
    public entry fun mint_identity(
        name: vector<u8>,
        walrus_namespace: vector<u8>,
        ctx: &mut TxContext
    ) {
        let owner = tx_context::sender(ctx);
        let id = object::new(ctx);
        
        let identity_address = object::uid_to_address(&id);

        let identity = AuraIdentity {
            id,
            name: string::utf8(name),
            walrus_namespace: string::utf8(walrus_namespace),
            owner,
            created_at: tx_context::epoch_timestamp_ms(ctx),
            version: 1,
            active_session_key: option::none(),
            session_expires_at: option::none(),
            // Marketplace defaults
            access_price: 0,
            access_duration_epochs: 0,
            is_for_sale: false,
            total_revenue: 0,
        };

        event::emit(IdentityMinted {
            identity_id: identity_address,
            owner,
            name: string::utf8(name),
            walrus_namespace: string::utf8(walrus_namespace),
        });

        // Share the object so session keys can interact with it
        transfer::share_object(identity);
    }

    /// Update the Walrus namespace associated with this identity.
    public entry fun update_namespace(
        identity: &mut AuraIdentity,
        new_namespace: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == identity.owner, ENotOwner);

        identity.walrus_namespace = string::utf8(new_namespace);
        identity.version = identity.version + 1;

        event::emit(NamespaceUpdated {
            identity_id: object::uid_to_address(&identity.id),
            new_namespace: string::utf8(new_namespace),
            version: identity.version,
        });
    }

    /// Authorize a new session key.
    public entry fun authorize_session(
        identity: &mut AuraIdentity,
        session_key_address: address,
        duration_epochs: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == identity.owner, ENotOwner);

        let expires_at = tx_context::epoch(ctx) + duration_epochs;
        identity.active_session_key = option::some(session_key_address);
        identity.session_expires_at = option::some(expires_at);

        event::emit(SessionAuthorized {
            identity_id: object::uid_to_address(&identity.id),
            session_key: session_key_address,
            expires_at_epoch: expires_at,
        });
    }

    /// Revoke the current session key.
    public entry fun revoke_session(
        identity: &mut AuraIdentity,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == identity.owner, ENotOwner);

        identity.active_session_key = option::none();
        identity.session_expires_at = option::none();

        event::emit(SessionRevoked {
            identity_id: object::uid_to_address(&identity.id),
        });
    }

    /// Check if the session is still valid
    public fun is_session_valid(identity: &AuraIdentity, ctx: &TxContext): bool {
        if (option::is_some(&identity.session_expires_at)) {
            let expiry = *option::borrow(&identity.session_expires_at);
            if (tx_context::epoch(ctx) >= expiry) {
                return false
            }
        } else {
            return false
        };
        true
    }

    /// Attest a memory blob. Can be called by owner OR active session key.
    public entry fun attest_memory(
        identity: &AuraIdentity,
        blob_id: String,
        data_hash: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        let is_owner = sender == identity.owner;
        let is_valid_session = option::is_some(&identity.active_session_key) && 
                               sender == *option::borrow(&identity.active_session_key) && 
                               is_session_valid(identity, ctx);

        assert!(is_owner || is_valid_session, ENotAuthorized);

        event::emit(MemoryAttested {
            identity_id: object::uid_to_address(&identity.id),
            blob_id,
            data_hash,
            epoch: tx_context::epoch(ctx),
            timestamp: tx_context::epoch_timestamp_ms(ctx),
            attester: sender,
        });
    }

    // === Memory Marketplace Functions ===

    /// Pemilik mengatur harga dan durasi akses memorinya
    public entry fun configure_marketplace(
        identity: &mut AuraIdentity,
        price: u64,              // harga dalam MIST
        duration_epochs: u64,    // durasi akses
        for_sale: bool,          // on/off
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == identity.owner, ENotOwner);
        
        identity.access_price = price;
        identity.access_duration_epochs = duration_epochs;
        identity.is_for_sale = for_sale;

        event::emit(MarketplaceConfigured {
            identity_id: object::uid_to_address(&identity.id),
            price,
            duration_epochs,
            is_for_sale: for_sale,
        });
    }

    /// Pembeli membayar SUI untuk mendapat akses baca memori pengguna
    public entry fun purchase_memory_access(
        identity: &mut AuraIdentity,
        payment: Coin<SUI>,
        access_type: vector<u8>,   // "full" atau "category:work_pref"
        ctx: &mut TxContext
    ) {
        assert!(identity.is_for_sale, EAccessNotForSale);
        assert!(coin::value(&payment) >= identity.access_price, EInsufficientPayment);

        // Transfer payment langsung ke owner
        transfer::public_transfer(payment, identity.owner);
        
        // Update total revenue
        identity.total_revenue = identity.total_revenue + identity.access_price;

        // Buat Access Pass NFT dan kirim ke pembeli
        let buyer = tx_context::sender(ctx);
        let expires = tx_context::epoch(ctx) + identity.access_duration_epochs;

        let pass = MemoryAccessPass {
            id: object::new(ctx),
            identity_id: object::uid_to_address(&identity.id),
            buyer,
            access_type: string::utf8(access_type),
            granted_at_epoch: tx_context::epoch(ctx),
            expires_at_epoch: expires,
        };

        event::emit(MemoryAccessPurchased {
            identity_id: object::uid_to_address(&identity.id),
            buyer,
            price_paid: identity.access_price,
            access_type: string::utf8(access_type),
            expires_at_epoch: expires,
        });

        transfer::public_transfer(pass, buyer);
    }

    /// Verifikasi apakah sebuah Access Pass masih valid (untuk Frontend/SDK)
    public fun is_access_valid(pass: &MemoryAccessPass, ctx: &TxContext): bool {
        tx_context::epoch(ctx) < pass.expires_at_epoch
    }

    // === ZK Memory Proof Functions ===

    /// Attest bahwa sebuah ZK proof telah diverifikasi off-chain
    public entry fun attest_zk_proof(
        identity: &AuraIdentity,
        data_hash: String,
        proven_field: String,
        proven_value: String,
        proof_merkle_root: String,
        ctx: &mut TxContext
    ) {
        // Di implementasi penuh, ini memanggil ZK Verifier on-chain.
        // Untuk PoC, kita mencatat (attest) hasil verifikasi off-chain.
        event::emit(ZKProofAttested {
            identity_id: object::uid_to_address(&identity.id),
            data_hash,
            proven_field,
            proven_value,
            proof_merkle_root,
            verifier: tx_context::sender(ctx),
            epoch: tx_context::epoch(ctx),
        });
    }

    // === View Functions ===

    public fun get_namespace(identity: &AuraIdentity): String {
        identity.walrus_namespace
    }
}
