module aura_identity::aura_identity {
    use std::string::{Self, String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::option::{Self, Option};

    /// Error codes
    const ENotOwner: u64 = 0;
    const ENotAuthorized: u64 = 1;

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
    }

    /// Event emitted when an identity is minted
    public struct IdentityMinted has copy, drop {
        identity_id: address,
        owner: address,
        name: String,
        walrus_namespace: String,
    }

    /// Event emitted when a namespace is updated
    public struct NamespaceUpdated has copy, drop {
        identity_id: address,
        new_namespace: String,
        version: u64,
    }

    /// Event emitted when a session key is authorized
    public struct SessionAuthorized has copy, drop {
        identity_id: address,
        session_key: address,
        expires_at_epoch: u64,
    }

    /// Event emitted when a session key is revoked
    public struct SessionRevoked has copy, drop {
        identity_id: address,
    }

    /// Event emitted when a memory is attested (Saran 2)
    public struct MemoryAttested has copy, drop {
        identity_id: address,
        blob_id: String,
        data_hash: String,
        epoch: u64,
        timestamp: u64,
        attester: address,
    }

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
    /// Only the owner can call this.
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

    /// Authorize a new session key. Only the owner can call this.
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

    /// Revoke the current session key. Only the owner can call this.
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

    /// Get the namespace of an identity
    public fun get_namespace(identity: &AuraIdentity): String {
        identity.walrus_namespace
    }
}
