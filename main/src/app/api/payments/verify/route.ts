import { Cashfree, CFEnvironment } from "cashfree-pg";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const isProd = process.env.NEXT_PUBLIC_CASHFREE_ENV === "production";
const cashfree = new Cashfree(
    isProd ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX, // production mein PRODUCTION karna
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
            return NextResponse.json(
                { success: false, error: "Pending bid not found" },
                { status: 404 }
            );
        }

        // ─────────────────────────────────────────
        // STEP 3: Idempotency check — pehle se CONFIRMED to nahi hai?
        // ─────────────────────────────────────────
        if (pendingBid.status === "CONFIRMED") {
            return NextResponse.json({ success: true, alreadyConfirmed: true });
        }

        // ─────────────────────────────────────────
        // STEP 4: pending_bids ko CONFIRMED mark karo
        // ─────────────────────────────────────────
        const { error: updateError } = await supabaseAdmin
            .from("pending_bids")
            .update({ status: "CONFIRMED" })
            .eq("order_id", order_id);

        if (updateError) throw updateError;

        // ─────────────────────────────────────────
        // STEP 5: Asli keys table update karo
        // ─────────────────────────────────────────
        const { error: keyUpdateError } = await supabaseAdmin
            .from("keys")
            .update({
                current_bid_amount: pendingBid.bid_amount,
                brand_name: pendingBid.brand_name,
                submitted_url: pendingBid.submitted_url,
                key_logo: pendingBid.key_logo,
                updated_at: new Date().toISOString(),
            })
            .eq("key_slot", pendingBid.key_slot);

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