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
    if (!order_id || typeof order_id !== "string" || !order_id.trim()) {
        return jsonResponse({ success: false, error: "Missing order_id" }, { status: 400 });
    }

    if (order_id.length > 200 || !/^order_[A-Za-z0-9_-]+$/.test(order_id)) {
        return jsonResponse({ success: false, error: "Invalid order_id format" }, { status: 400 });
    }

    // Poll database up to 4 times with a 600ms delay to allow webhook processing to finalize
    for (let attempt = 0; attempt < 4; attempt++) {
        // 1. Check pending_bids status
        const { data: pendingBid, error: pbError } = await supabaseAdmin
            .from("pending_bids")
            .select("status, key_slot, bid_amount")
            .eq("order_id", order_id)
            .maybeSingle();

        if (pbError) {
            console.error("[verify] DB query error:", pbError);
            return jsonResponse(
                { success: false, error: "Verification failed on server. Please contact support." },
                { status: 500 }
            );
        }

        if (pendingBid?.status === "CONFIRMED") {
            return jsonResponse({ success: true, alreadyConfirmed: true });
        }

        if (pendingBid?.status === "FAILED") {
            return jsonResponse(
                { success: false, error: "Payment was not completed or was cancelled." },
                { status: 400 }
            );
        }

        if (pendingBid?.status === "OUTBID") {
            return jsonResponse(
                { success: false, outbid: true, error: "This slot was outbid by a higher bid before confirmation. A refund has been queued." },
                { status: 409 }
            );
        }

        if (pendingBid?.status === "AMOUNT_MISMATCH" || pendingBid?.status === "REFUND_REQUIRED") {
            return jsonResponse(
                { success: false, error: "Payment amount mismatch. A refund is required. Please contact support." },
                { status: 400 }
            );
        }

        // 2. Also check if bids table was updated with this order (in case pending_bids was pruned)
        const { data: bidData } = await supabaseAdmin
            .from("bids")
            .select("id")
            .eq("provider_order_id", order_id)
            .maybeSingle();

        if (bidData) {
            return jsonResponse({ success: true, alreadyConfirmed: true });
        }

        if (attempt < 3) {
            await new Promise((r) => setTimeout(r, 600));
        }
    }

    // Check if the order even exists
    const { data: finalCheck } = await supabaseAdmin
        .from("pending_bids")
        .select("status")
        .eq("order_id", order_id)
        .maybeSingle();

    if (!finalCheck) {
        return jsonResponse(
            { success: false, notFound: true, error: "Order not found or has expired." },
            { status: 404 }
        );
    }

    // If still PENDING after waiting for webhook
    return jsonResponse({
        success: false,
        pending: true,
        error: "Payment is currently processing. Your bid will appear once the confirmation arrives.",
    });
}

export async function POST(req: Request) {
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return jsonResponse({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const order_id = (body as Record<string, unknown>)?.order_id as string | undefined;
    return checkBidConfirmation(order_id);
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const order_id = searchParams.get("order_id");
    return checkBidConfirmation(order_id);
}