-- ══════════════════════════════════════════════════════════════════════════════
-- verify_and_confirm_bid
--
-- Atomically confirms a payment by:
--   1. Locking the pending_bid row (FOR UPDATE) — prevents race conditions
--   2. Idempotency check — safe to call multiple times (retries / double-calls)
--   3. Inserting into `bids` with key_id resolved from `keys`
--   4. Upserting `keys` with latest bid info
--   5. Deleting the pending_bid row — only after both writes succeed
--
-- All steps happen in ONE transaction. If anything fails, everything rolls back.
-- ══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION verify_and_confirm_bid(
    p_order_id           TEXT,
    p_cashfree_payment_id TEXT,
    p_cashfree_contact    TEXT,
    p_payment_status      TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER   -- runs with the function owner's privileges
AS $$
DECLARE
    v_pending   pending_bids%ROWTYPE;
    v_key_id    UUID;
BEGIN
    -- ──────────────────────────────────────────────────────────────────────────
    -- STEP 1: Lock the pending_bid row exclusively.
    --   FOR UPDATE acquires row-level lock, blocks concurrent calls for the same
    --   order_id until this transaction ends. When the first caller deletes the
    --   row, any waiting caller will find NOT FOUND and hit the idempotency path.
    -- ──────────────────────────────────────────────────────────────────────────
    SELECT * INTO v_pending
    FROM pending_bids
    WHERE order_id = p_order_id
    FOR UPDATE;

    -- ──────────────────────────────────────────────────────────────────────────
    -- STEP 2: Row not found — two possibilities:
    --   a) Already fully processed (idempotency — safe to return success).
    --   b) Genuinely doesn't exist (bad order_id).
    -- ──────────────────────────────────────────────────────────────────────────
    IF NOT FOUND THEN
        IF EXISTS (
            SELECT 1 FROM bids WHERE cashfree_order_id = p_order_id
        ) THEN
            RETURN jsonb_build_object(
                'success',          true,
                'alreadyConfirmed', true
            );
        END IF;

        RETURN jsonb_build_object(
            'success', false,
            'error',   'Pending bid not found'
        );
    END IF;

    -- ──────────────────────────────────────────────────────────────────────────
    -- STEP 3: Status-level idempotency guard
    --   (belt-and-suspenders — handles cases where status was set CONFIRMED
    --    but row was not yet deleted)
    -- ──────────────────────────────────────────────────────────────────────────
    IF v_pending.status = 'CONFIRMED' THEN
        RETURN jsonb_build_object(
            'success',          true,
            'alreadyConfirmed', true
        );
    END IF;

    -- ──────────────────────────────────────────────────────────────────────────
    -- STEP 4: Resolve key_id from keys table via key_slot
    --   NULL is fine if key doesn't exist yet — upsert in step 6 creates it.
    -- ──────────────────────────────────────────────────────────────────────────
    SELECT id INTO v_key_id
    FROM keys
    WHERE key_slot = v_pending.key_slot;

    -- ──────────────────────────────────────────────────────────────────────────
    -- STEP 5: Insert confirmed bid into `bids`
    -- ──────────────────────────────────────────────────────────────────────────
    INSERT INTO bids (
        key_id,
        bid_amount,
        cashfree_order_id,
        cashfree_payment_id,
        cashfree_contact,
        payment_status,
        bid_status,
        expires_at
    ) VALUES (
        v_key_id,
        v_pending.bid_amount,
        v_pending.order_id,
        p_cashfree_payment_id,
        p_cashfree_contact,
        p_payment_status,
        'active',
        NULL   -- set expiry logic here if needed
    );

    -- ──────────────────────────────────────────────────────────────────────────
    -- STEP 6: Upsert `keys` with latest winning bid info
    --   ON CONFLICT (key_slot) updates existing row; creates one if missing.
    -- ──────────────────────────────────────────────────────────────────────────
    INSERT INTO keys (
        key_slot,
        current_bid_amount,
        brand_name,
        submitted_url,
        key_logo,
        updated_at
    ) VALUES (
        v_pending.key_slot,
        v_pending.bid_amount,
        v_pending.brand_name,
        v_pending.submitted_url,
        v_pending.key_logo,
        NOW()
    )
    ON CONFLICT (key_slot) DO UPDATE SET
        current_bid_amount = EXCLUDED.current_bid_amount,
        brand_name         = EXCLUDED.brand_name,
        submitted_url      = EXCLUDED.submitted_url,
        key_logo           = EXCLUDED.key_logo,
        updated_at         = EXCLUDED.updated_at;

    -- ──────────────────────────────────────────────────────────────────────────
    -- STEP 7: Delete pending_bid ONLY after both writes above succeeded.
    --   If INSERT or UPSERT raised an error, Postgres auto-rolls back the
    --   entire transaction — pending_bid is never orphaned.
    -- ──────────────────────────────────────────────────────────────────────────
    DELETE FROM pending_bids
    WHERE order_id = p_order_id;

    RETURN jsonb_build_object('success', true);

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error',   SQLERRM
        );
END;
$$;

-- Grant execute to the service role used by supabaseAdmin
GRANT EXECUTE ON FUNCTION verify_and_confirm_bid(TEXT, TEXT, TEXT, TEXT)
    TO service_role;
