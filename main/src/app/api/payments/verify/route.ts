import { Cashfree, CFEnvironment } from "cashfree-pg";
import { NextResponse } from "next/server";
import { pgPool } from "@/lib/db/pool";
import type { PoolClient } from "pg";

const isProd = process.env.NEXT_PUBLIC_CASHFREE_ENV === "production";
const cashfree = new Cashfree(
    isProd ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
    process.env.CASHFREE_APP_ID!,
    process.env.CASHFREE_SECRET_KEY!
);

// ─────────────────────────────────────────────────────────────────
// EXTENSIBILITY: naya field add karna ho (pending_bids → keys/bids)
// to bas neeche in dono arrays mein column naam daal do. Query khud
// dynamically ban jaati hai — route ka baaki logic touch nahi karna
// padta. Bas dhyan rahe: column pending_bids mein bhi ho aur target
// table (keys / bids) mein bhi — migration se add kar lena.
// ─────────────────────────────────────────────────────────────────
const KEY_FIELDS_FROM_PENDING = ["brand_name", "submitted_url", "key_logo"] as const;
const BID_FIELDS_FROM_PENDING = ["bid_amount", "terms_version", "terms_accepted_at"] as const;

type PendingBid = {
    id: string;
    order_id: string;
    key_slot: string;
    bid_amount: number;
    status: string;
    [key: string]: any;
};

type KeyRow = {
    id: string;
    current_bid_amount: number | null;
    [key: string]: any;
};

function buildSet(fields: readonly string[], startIndex: number) {
    return fields.map((f, i) => `${f} = $${startIndex + i}`).join(", ");
}

export async function POST(req: Request) {
    // ── Input validation ─────────────────────────────────────────
    let body: any;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const order_id = body?.order_id;
    if (!order_id || typeof order_id !== "string" || !order_id.trim()) {
        return NextResponse.json({ success: false, error: "Missing order_id" }, { status: 400 });
    }

    // ── STEP 1: Cashfree se real status poocho — client se kabhi trust nahi karna ──
    let orderStatus: string;
    let cfPaymentId: string | null = null;
    let cfContact: string | null = null;
    try {
        const orderResponse = await cashfree.PGFetchOrder(order_id);
        orderStatus = orderResponse.data.order_status ?? "UNKNOWN";
        cfPaymentId = orderResponse.data.cf_order_id ? String(orderResponse.data.cf_order_id) : null;
        cfContact = orderResponse.data.customer_details?.customer_phone ?? null;
    } catch (err: any) {
        console.error("Cashfree fetch error:", err?.response?.data || err.message);
        return NextResponse.json(
            { success: false, error: "Could not verify payment with Cashfree" },
            { status: 502 }
        );
    }

    if (orderStatus !== "PAID") {
        return NextResponse.json(
            { success: false, error: `Payment not completed. Status: ${orderStatus}` },
            { status: 400 }
        );
    }

    // ── STEP 2: DB transaction — sab kuch ya to poora hoga, ya kuch nahi ──
    const client: PoolClient = await pgPool.connect();
    try {
        await client.query("BEGIN");

        // Idempotency: agar is order_id ka bid pehle se confirm ho chuka hai
        const existing = await client.query(
            `SELECT id FROM bids WHERE cashfree_order_id = $1 LIMIT 1`,
            [order_id]
        );
        if (existing.rowCount && existing.rowCount > 0) {
            await client.query(`DELETE FROM pending_bids WHERE order_id = $1`, [order_id]);
            await client.query("COMMIT");
            return NextResponse.json({ success: true, alreadyConfirmed: true, bid_id: existing.rows[0].id });
        }

        // pending_bids row ko LOCK karo — isi order_id ki concurrent request
        // yahan wait karegi jab tak yeh transaction commit/rollback na ho jaye.
        const pendingRes = await client.query<PendingBid>(
            `SELECT * FROM pending_bids WHERE order_id = $1 FOR UPDATE`,
            [order_id]
        );

        if (pendingRes.rowCount === 0) {
            await client.query("ROLLBACK");
            return NextResponse.json({ success: false, error: "Pending bid not found" }, { status: 404 });
        }

        const pendingBid = pendingRes.rows[0];

        if (pendingBid.status === "CONFIRMED") {
            await client.query(`DELETE FROM pending_bids WHERE order_id = $1`, [order_id]);
            await client.query("COMMIT");
            return NextResponse.json({ success: true, alreadyConfirmed: true });
        }

        // key_slot se keys row nikalo aur LOCK karo — isi slot ke concurrent
        // bids (bid war) yahan serialize ho jaayenge.
        const keyRes = await client.query<KeyRow>(
            `SELECT * FROM keys WHERE key_slot = $1 FOR UPDATE`,
            [pendingBid.key_slot]
        );

        if (keyRes.rowCount === 0) {
            await client.query("ROLLBACK");
            return NextResponse.json(
                { success: false, error: `Key slot not found: ${pendingBid.key_slot}` },
                { status: 404 }
            );
        }

        const keyRow = keyRes.rows[0];

        // ── STEP A: bids table mein insert (payment ka permanent proof — ──
        // ── chahe yeh bid jeete ya na jeete, record rehna chahiye) ──
        const bidFieldValues = BID_FIELDS_FROM_PENDING.map((f) => pendingBid[f]);
        const bidInsert = await client.query(
            `INSERT INTO bids (
                key_id, cashfree_order_id, cashfree_payment_id, cashfree_contact,
                payment_status, bid_status, ${BID_FIELDS_FROM_PENDING.join(", ")}
             ) VALUES (
                $1, $2, $3, $4, $5, $6, ${BID_FIELDS_FROM_PENDING.map((_, i) => `$${7 + i}`).join(", ")}
             )
             RETURNING id`,
            [
                keyRow.id,
                order_id,
                cfPaymentId,
                cfContact,
                "PAID",
                "CONFIRMED",
                ...bidFieldValues,
            ]
        );
        const bidId = bidInsert.rows[0].id;

        // ── STEP B: sirf tab keys ko "winning bid" se update karo jab naya ──
        // ── bid_amount existing current_bid_amount se zyada ho. Isse race ──
        // ── condition mein koi lower/stale bid, higher confirmed bid ko ──
        // ── overwrite nahi kar payega. Payment record (STEP A) phir bhi ──
        // ── ban chuka hai — paisa capture ho chuka hai, sirf "current" ──
        // ── winner status nahi milega. ──
        const currentAmount = Number(keyRow.current_bid_amount ?? 0);
        const isNewHighestBid = pendingBid.bid_amount > currentAmount;

        if (isNewHighestBid) {
            const keySetValues = KEY_FIELDS_FROM_PENDING.map((f) => pendingBid[f]);
            await client.query(
                `UPDATE keys
                 SET current_bid_id = $1,
                     current_bid_amount = $2,
                     updated_at = now(),
                     ${buildSet(KEY_FIELDS_FROM_PENDING, 3)}
                 WHERE id = $${3 + KEY_FIELDS_FROM_PENDING.length}`,
                [bidId, pendingBid.bid_amount, ...keySetValues, keyRow.id]
            );
        }

        // ── STEP C: pending_bids se row hata do ──
        await client.query(`DELETE FROM pending_bids WHERE order_id = $1`, [order_id]);

        await client.query("COMMIT");

        return NextResponse.json({
            success: true,
            bid_id: bidId,
            key_id: keyRow.id,
            isNewHighestBid,
        });
    } catch (err: any) {
        await client.query("ROLLBACK").catch(() => { });

        // Unique constraint par bids.cashfree_order_id (duplicate concurrent insert)
        // — dono requests ek saath is point tak pahunch gayi thi.
        if (err.code === "23505") {
            return NextResponse.json({ success: true, alreadyConfirmed: true });
        }

        console.error("verify error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Verification failed" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}