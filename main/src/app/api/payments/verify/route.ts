import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonResponse(data: Record<string, unknown>, init?: { status?: number }) {
    return NextResponse.json(data, {
        status: init?.status ?? 200,
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        },
    });
}

async function checkBidConfirmation(order_id: string | null | undefined) {
    console.log("[verify] checkBidConfirmation called with order_id:", order_id);

    if (!order_id || typeof order_id !== "string" || !order_id.trim()) {
        console.warn("[verify] Missing or invalid order_id");
        return jsonResponse({ success: false, error: "Missing order_id" }, { status: 400 });
    }

    if (order_id.length > 200 || !/^order_[A-Za-z0-9_-]+$/.test(order_id)) {
        console.warn("[verify] Invalid order_id format:", order_id);
        return jsonResponse({ success: false, error: "Invalid order_id format" }, { status: 400 });
    }

    // Poll database up to 4 times with a 600ms delay to allow webhook processing to finalize
    for (let attempt = 0; attempt < 4; attempt++) {
        console.log(`[verify] Attempt ${attempt + 1}/4 — querying pending_bids for order_id: ${order_id}`);

        // 1. Check pending_bids status
        const { data: pendingBid, error: pbError } = await supabaseAdmin
            .from("pending_bids")
            .select("status, key_slot, bid_amount")
            .eq("order_id", order_id)
            .maybeSingle();

        console.log("[verify] pending_bids result:", { pendingBid, pbError });

        if (pbError) {
            console.error("[verify] DB query error:", pbError);
            return jsonResponse(
                { success: false, error: "Verification failed on server. Please contact support." },
                { status: 500 }
            );
        }

        if (pendingBid?.status === "CONFIRMED") {
            console.log("[verify] Status CONFIRMED — returning success for order:", order_id);
            return jsonResponse({ success: true, alreadyConfirmed: true });
        }

        if (pendingBid?.status === "FAILED") {
            console.warn("[verify] Status FAILED for order:", order_id);
            return jsonResponse(
                { success: false, error: "Payment was not completed or was cancelled." },
                { status: 400 }
            );
        }

        if (pendingBid?.status === "OUTBID") {
            console.warn("[verify] Status OUTBID for order:", order_id);
            return jsonResponse(
                { success: false, outbid: true, error: "This slot was outbid by a higher bid before confirmation. A refund has been queued." },
                { status: 409 }
            );
        }

        if (pendingBid?.status === "AMOUNT_MISMATCH" || pendingBid?.status === "REFUND_REQUIRED") {
            console.warn("[verify] Status AMOUNT_MISMATCH/REFUND_REQUIRED for order:", order_id, "| status:", pendingBid.status);
            return jsonResponse(
                { success: false, error: "Payment amount mismatch. A refund is required. Please contact support." },
                { status: 400 }
            );
        }

        if (pendingBid?.status === "CURRENCY_MISMATCH") {
            console.warn("[verify] Status CURRENCY_MISMATCH for order:", order_id);
            return jsonResponse(
                { success: false, error: "Unexpected settlement currency detected. Please contact support." },
                { status: 400 }
            );
        }

        if (pendingBid?.status === "MISSING_SETTLEMENT_DATA") {
            console.warn("[verify] Status MISSING_SETTLEMENT_DATA for order:", order_id);
            return jsonResponse(
                { success: false, error: "Payment confirmation is incomplete. Please contact support." },
                { status: 400 }
            );
        }

        // 2. Also check if bids table was updated with this order (in case pending_bids was pruned)
        console.log("[verify] Checking bids table fallback for order_id:", order_id);
        const { data: bidData } = await supabaseAdmin
            .from("bids")
            .select("id, paid_currency, paid_amount_local, settlement_currency, bid_amount")
            .eq("provider_order_id", order_id)
            .maybeSingle();

        console.log("[verify] bids fallback result:", bidData);

        if (bidData) {
            console.log("[verify] Found in bids table — order already confirmed:", order_id);
            return jsonResponse({
                success: true,
                alreadyConfirmed: true,
                paidCurrency: bidData.paid_currency,
                paidAmountLocal: bidData.paid_amount_local,
                settlementCurrency: bidData.settlement_currency,
                settlementAmount: bidData.bid_amount,
            });
        }

        if (attempt < 3) {
            console.log(`[verify] Still PENDING — waiting 600ms before attempt ${attempt + 2}/4`);
            await new Promise((r) => setTimeout(r, 600));
        }
    }

    // Check if the order even exists
    console.log("[verify] All 4 attempts exhausted. Doing final existence check for order:", order_id);
    const { data: finalCheck } = await supabaseAdmin
        .from("pending_bids")
        .select("status")
        .eq("order_id", order_id)
        .maybeSingle();

    console.log("[verify] Final existence check result:", finalCheck);

    if (!finalCheck) {
        console.warn("[verify] Order not found after all retries:", order_id);
        return jsonResponse(
            { success: false, notFound: true, error: "Order not found or has expired." },
            { status: 404 }
        );
    }

    // If still PENDING after waiting for webhook
    console.warn("[verify] Order still PENDING after all retries — webhook may be delayed. order_id:", order_id, "| final status:", finalCheck?.status);
    return jsonResponse({
        success: false,
        pending: true,
        error: "Payment is currently processing. Your bid will appear once the confirmation arrives.",
    });
}

export async function POST(req: Request) {
    console.log("[verify] POST request received");
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        console.warn("[verify] Failed to parse JSON body");
        return jsonResponse({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const order_id = (body as Record<string, unknown>)?.order_id as string | undefined;
    console.log("[verify] POST order_id:", order_id);
    return checkBidConfirmation(order_id);
}

export async function GET(req: Request) {
    console.log("[verify] GET request received");
    const { searchParams } = new URL(req.url);
    const order_id = searchParams.get("order_id");
    console.log("[verify] GET order_id:", order_id);
    return checkBidConfirmation(order_id);
}