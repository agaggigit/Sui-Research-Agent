module aura_identity::aura_access_control {
    use std::string::String;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::option::{Self, Option};

    /// Error codes
    const EInvalidScope: u64 = 1;

    /// DelegatePermission represents a granted access right to a Walrus namespace.
    public struct DelegatePermission has key, store {
        id: UID,
        grantee: address,
        namespace: String,
        /// 0 = read-only, 1 = write, 2 = full
        scope: u8, 
        expires_at: Option<u64>,
    }

    /// Event emitted when permission is granted
    public struct PermissionGranted has copy, drop {
        permission_id: address,
        grantor: address,
        grantee: address,
        namespace: String,
        scope: u8,
    }

    /// Event emitted when permission is revoked
    public struct PermissionRevoked has copy, drop {
        permission_id: address,
    }

    /// Grant permission to a grantee
    public entry fun grant_permission(
        grantee: address,
        namespace: String,
        scope: u8,
        expires_at: Option<u64>,
        ctx: &mut TxContext
    ) {
        assert!(scope <= 2, EInvalidScope);

        let id = object::new(ctx);
        let permission_id = object::uid_to_address(&id);

        let permission = DelegatePermission {
            id,
            grantee,
            namespace,
            scope,
            expires_at,
        };

        event::emit(PermissionGranted {
            permission_id,
            grantor: tx_context::sender(ctx),
            grantee,
            namespace,
            scope,
        });

        transfer::transfer(permission, grantee);
    }

    /// Check if permission is valid (has not expired)
    public fun is_valid(permission: &DelegatePermission, ctx: &TxContext): bool {
        if (option::is_some(&permission.expires_at)) {
            let expiry = *option::borrow(&permission.expires_at);
            if (tx_context::epoch_timestamp_ms(ctx) >= expiry) {
                return false

            }
        };
        true
    }

    /// Check permission scope
    public fun check_permission(permission: &DelegatePermission, required_scope: u8, ctx: &TxContext): bool {
        if (!is_valid(permission, ctx)) {
            return false

        };
        permission.scope >= required_scope
    }

    /// Revoke the permission by destroying the object
    public entry fun revoke_permission(permission: DelegatePermission, _ctx: &mut TxContext) {
        let DelegatePermission {
            id,
            grantee: _,
            namespace: _,
            scope: _,
            expires_at: _,
        } = permission;

        event::emit(PermissionRevoked {
            permission_id: object::uid_to_address(&id),
        });

        object::delete(id);
    }
}
