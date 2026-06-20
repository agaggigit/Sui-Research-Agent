#[test_only]
module aura_identity::aura_identity_tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use aura_identity::aura_identity::{Self, AuraIdentity};
    use std::string;
    use sui::coin;
    use sui::sui::SUI;

    #[test]
    fun test_mint_and_update() {
        let mut scenario = ts::begin(@0x1);
        let ctx = ts::ctx(&mut scenario);
        
        let name = b"My Aura";
        let namespace = b"my_walrus_namespace_123";
        
        aura_identity::mint_identity(name, namespace, ctx);
        
        ts::next_tx(&mut scenario, @0x1);
        {
            let mut identity = ts::take_shared<AuraIdentity>(&scenario);
            assert!(aura_identity::get_namespace(&identity) == string::utf8(namespace), 0);
            
            // update namespace
            let ctx = ts::ctx(&mut scenario);
            aura_identity::update_namespace(&mut identity, b"new_namespace", ctx);
            assert!(aura_identity::get_namespace(&identity) == string::utf8(b"new_namespace"), 1);

            ts::return_shared(identity);
        };
        ts::end(scenario);
    }

    #[test]
    fun test_session_auth_and_attest() {
        let mut scenario = ts::begin(@0x1);
        
        // Mint
        {
            let ctx = ts::ctx(&mut scenario);
            aura_identity::mint_identity(b"My Aura", b"ns", ctx);
        };
        
        // Authorize session key @0x2
        ts::next_tx(&mut scenario, @0x1);
        {
            let mut identity = ts::take_shared<AuraIdentity>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            aura_identity::authorize_session(&mut identity, @0x2, 10, ctx);
            ts::return_shared(identity);
        };

        // Attest using session key @0x2
        ts::next_tx(&mut scenario, @0x2);
        {
            let identity = ts::take_shared<AuraIdentity>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            
            // Should succeed
            aura_identity::attest_memory(&identity, string::utf8(b"blob123"), string::utf8(b"hash123"), ctx);

            ts::return_shared(identity);
        };

        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 1)]
    fun test_attest_unauthorized() {
        let mut scenario = ts::begin(@0x1);
        
        // Mint
        {
            let ctx = ts::ctx(&mut scenario);
            aura_identity::mint_identity(b"My Aura", b"ns", ctx);
        };
        
        // Attest using unauthorized key @0x3
        ts::next_tx(&mut scenario, @0x3);
        {
            let identity = ts::take_shared<AuraIdentity>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            
            // Should fail
            aura_identity::attest_memory(&identity, string::utf8(b"blob123"), string::utf8(b"hash123"), ctx);

            ts::return_shared(identity);
        };

        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 1)]
    fun test_session_expiry() {
        let mut scenario = ts::begin(@0x1);
        
        // Mint & Authorize
        {
            let ctx = ts::ctx(&mut scenario);
            aura_identity::mint_identity(b"My Aura", b"ns", ctx);
        };
        
        ts::next_tx(&mut scenario, @0x1);
        {
            let mut identity = ts::take_shared<AuraIdentity>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            // Authorize session key @0x2 for 1 epoch only
            aura_identity::authorize_session(&mut identity, @0x2, 1, ctx);
            ts::return_shared(identity);
        };

        // Advance 2 epochs so it expires
        ts::next_epoch(&mut scenario, @0x0);
        ts::next_epoch(&mut scenario, @0x0);

        // Attest using expired session key @0x2
        ts::next_tx(&mut scenario, @0x2);
        {
            let identity = ts::take_shared<AuraIdentity>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            
            // Should fail due to expiry
            aura_identity::attest_memory(&identity, string::utf8(b"blob123"), string::utf8(b"hash123"), ctx);

            ts::return_shared(identity);
        };

        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 1)]
    fun test_revoke_session() {
        let mut scenario = ts::begin(@0x1);
        
        // Mint & Authorize
        {
            let ctx = ts::ctx(&mut scenario);
            aura_identity::mint_identity(b"My Aura", b"ns", ctx);
        };
        
        ts::next_tx(&mut scenario, @0x1);
        {
            let mut identity = ts::take_shared<AuraIdentity>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            aura_identity::authorize_session(&mut identity, @0x2, 10, ctx);
            ts::return_shared(identity);
        };

        // Revoke the session
        ts::next_tx(&mut scenario, @0x1);
        {
            let mut identity = ts::take_shared<AuraIdentity>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            aura_identity::revoke_session(&mut identity, ctx);
            ts::return_shared(identity);
        };

        // Try to attest using revoked session key @0x2
        ts::next_tx(&mut scenario, @0x2);
        {
            let identity = ts::take_shared<AuraIdentity>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            
            // Should fail because it was revoked
            aura_identity::attest_memory(&identity, string::utf8(b"blob123"), string::utf8(b"hash123"), ctx);

            ts::return_shared(identity);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_revoke_memory() {
        let mut scenario = ts::begin(@0x1);
        
        // Mint
        {
            let ctx = ts::ctx(&mut scenario);
            aura_identity::mint_identity(b"My Aura", b"ns", ctx);
        };

        // Revoke memory
        ts::next_tx(&mut scenario, @0x1);
        {
            let identity = ts::take_shared<AuraIdentity>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            
            aura_identity::revoke_memory(&identity, string::utf8(b"blob123"), ctx);

            ts::return_shared(identity);
        };

        ts::end(scenario);
    }

    // === Marketplace Tests ===

    #[test]
    fun test_marketplace_and_purchase() {
        let mut scenario = ts::begin(@0x1);
        
        // Mint
        {
            let ctx = ts::ctx(&mut scenario);
            aura_identity::mint_identity(b"My Aura", b"ns", ctx);
        };
        
        // Configure marketplace
        ts::next_tx(&mut scenario, @0x1);
        {
            let mut identity = ts::take_shared<AuraIdentity>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            // Set price to 1000 MIST, for 10 epochs
            aura_identity::configure_marketplace(&mut identity, 1000, 10, true, ctx);
            ts::return_shared(identity);
        };

        // Bob (@0x2) buys access
        ts::next_tx(&mut scenario, @0x2);
        {
            let mut identity = ts::take_shared<AuraIdentity>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            let payment = coin::mint_for_testing<SUI>(1000, ctx);
            aura_identity::purchase_memory_access(&mut identity, payment, b"full", ctx);
            ts::return_shared(identity);
        };

        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 2)] // EInsufficientPayment
    fun test_marketplace_insufficient_payment() {
        let mut scenario = ts::begin(@0x1);
        
        // Mint & configure
        {
            let ctx = ts::ctx(&mut scenario);
            aura_identity::mint_identity(b"My Aura", b"ns", ctx);
        };
        ts::next_tx(&mut scenario, @0x1);
        {
            let mut identity = ts::take_shared<AuraIdentity>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            aura_identity::configure_marketplace(&mut identity, 1000, 10, true, ctx);
            ts::return_shared(identity);
        };

        // Bob tries to buy with 500 MIST
        ts::next_tx(&mut scenario, @0x2);
        {
            let mut identity = ts::take_shared<AuraIdentity>(&scenario);
            let ctx = ts::ctx(&mut scenario);
            let payment = coin::mint_for_testing<SUI>(500, ctx);
            aura_identity::purchase_memory_access(&mut identity, payment, b"full", ctx);
            ts::return_shared(identity);
        };

        ts::end(scenario);
    }
}
