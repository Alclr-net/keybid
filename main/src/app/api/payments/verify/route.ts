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

    // ── STEP 2: Supabase RPC — confirm_bid handles the full transaction ──
    const { data, error } = await supabaseAdmin.rpc("confirm_bid", {
        p_order_id: order_id,
        p_cf_payment_id: cfPaymentId,
        p_cf_contact: cfContact,
    });

    if (error) {
        console.error("[verify] RPC error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Verification failed" },
            { status: 500 }
        );
    }

    // data is the jsonb returned by confirm_bid
    const result = data as {
        success: boolean;
        alreadyConfirmed?: boolean;
        bid_id?: string;
        key_id?: string;
        error?: string;
    };

    if (!result.success) {
        const status = result.error?.includes("not found") ? 404 : 400;
        return NextResponse.json({ success: false, error: result.error }, { status });
    }

    return NextResponse.json(result);
}