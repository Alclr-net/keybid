import { Cashfree, CFEnvironment } from "cashfree-pg";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const isProd = process.env.NEXT_PUBLIC_CASHFREE_ENV === "production";
const cashfree = new Cashfree(
    isProd ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
    process.env.CASHFREE_APP_ID!,
    process.env.CASHFREE_SECRET_KEY!
);

export async function POST(req: Request) {
    const body = await req.json();
    const { order_id } = body;

    if (!order_id) {
        return NextResponse.json(
            { success: false, error: "Missing order_id" },
            { status: 400 }
        );
    }

    try {
        // ─────────────────────────────────────────
        // STEP 1: Cashfree se real status poocho — client se kabhi trust nahi karna
        // ─────────────────────────────────────────
        const orderResponse = await cashfree.PGFetchOrder(order_id);
        const orderStatus = orderResponse.data.order_status;

        if (orderStatus !== "PAID") {
            return NextResponse.json(
                { success: false, error: `Payment not completed. Status: ${orderStatus}` },
                { status: 400 }
            );
        }

        // ─────────────────────────────────────────
        // STEP 2: pending_bids se wo record dhoondo
        // ─────────────────────────────────────────
        const { data: pendingBid, error: fetchError } = await supabaseAdmin
            .from("pending_bids")
            .select("*")
            .eq("order_id", order_id)
            .single();

        if (fetchError || !pendingBid) {
            // Agar pehle se move ho chuka hai (retry/double call), bids table mein check karo
            const { data: existingBid } = await supabaseAdmin
                .from("bids")
                .select("order_id")
                .eq("order_id", order_id)
                .single();

            if (existingBid) {
                return NextResponse.json({ success: true, alreadyConfirmed: true });
            }

            return NextResponse.json(
                { success: false, error: "Pending bid not found" },
                { status: 404 }
            );
        }

        // ─────────────────────────────────────────
        // STEP 3: Idempotency check — pehle se move to nahi ho chuka (status CONFIRMED)?
        // Note: agar row abhi bhi pending_bids mein hai to isse hit hone ka
        // matlab abhi move nahi hua — normal flow neeche continue karega.
        // ─────────────────────────────────────────
        if (pendingBid.status === "CONFIRMED") {
            return NextResponse.json({ success: true, alreadyConfirmed: true });
        }

        // ─────────────────────────────────────────
        // STEP 4: bids table mein confirmed record insert karo
        // NOTE: columns ko apne actual `bids` table schema se match karo
        // agar wo alag hai pending_bids se.
        // ─────────────────────────────────────────
        const { error: bidsInsertError } = await supabaseAdmin
            .from("bids")
            .insert({
                order_id: pendingBid.order_id,
                key_slot: pendingBid.key_slot,
                bid_amount: pendingBid.bid_amount,
                brand_name: pendingBid.brand_name,
                submitted_url: pendingBid.submitted_url,
                key_logo: pendingBid.key_logo,
                terms_version: pendingBid.terms_version,
                terms_accepted_at: pendingBid.terms_accepted_at,
                paid_at: new Date().toISOString(),
            });

        if (bidsInsertError) throw bidsInsertError;

        // ─────────────────────────────────────────
        // STEP 5: pending_bids se wo row hata do — ab woh bids mein move ho chuka hai
        // ─────────────────────────────────────────
        const { error: deleteError } = await supabaseAdmin
            .from("pending_bids")
            .delete()
            .eq("order_id", order_id);

        if (deleteError) throw deleteError;

        // ─────────────────────────────────────────
        // STEP 6: Asli keys table upsert karo
        // .update() ki jagah .upsert() — agar key_slot ka row exist
        // nahi karta (naya/pehli baar claim ho raha slot), to .update()
        // SILENTLY 0 rows affect karta hai, koi error nahi deta.
        // .upsert() row missing hone par CREATE kar dega, warna UPDATE.
        // ─────────────────────────────────────────
        const { error: keyUpdateError } = await supabaseAdmin
            .from("keys")
            .upsert(
                {
                    key_slot: pendingBid.key_slot,
                    current_bid_amount: pendingBid.bid_amount,
                    brand_name: pendingBid.brand_name,
                    submitted_url: pendingBid.submitted_url,
                    key_logo: pendingBid.key_logo,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: "key_slot" }
            );

        if (keyUpdateError) throw keyUpdateError;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("verify error:", err);
        return NextResponse.json(
            { success: false, error: err.response?.data?.message || err.message || "Verification failed" },
            { status: 500 }
        );
    }
}