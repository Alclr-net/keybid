import { Cashfree, CFEnvironment } from "cashfree-pg";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const isProd = process.env.NEXT_PUBLIC_CASHFREE_ENV === "production";

const cashfree = new Cashfree(
    isProd ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
    process.env.CASHFREE_APP_ID!,
    process.env.CASHFREE_SECRET_KEY!
);

const ORDER_CURRENCY = "INR";

const NOTIFY_URL = isProd
    ? "https://keybid.lol/api/webhook/cashfree"
    : "https://canopy-proofs-exit.ngrok-free.dev/api/webhook/cashfree";

const RETURN_URL = isProd
    ? "https://keybid.lol/payments/verify?order_id={order_id}"
    : "https://canopy-proofs-exit.ngrok-free.dev/payments/verify?order_id={order_id}";

export async function POST(req: Request) {
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid JSON body" },
            { status: 400 }
        );
    }

    const { keySlot, bidAmount, brandName, submitted_url, iconUrl, lastSeenHighestBid } = body;

    // ─────────────────────────────────────────────
    // FIX 1: Strict type + shape validation (not just truthy checks)
    // ─────────────────────────────────────────────
    if (typeof keySlot !== "string" || keySlot.trim().length === 0) {
        return NextResponse.json({ success: false, error: "Invalid key slot" }, { status: 400 });
    }

    if (typeof bidAmount !== "number" || !Number.isFinite(bidAmount) || !Number.isInteger(bidAmount) || bidAmount <= 0) {
        return NextResponse.json({ success: false, error: "Bid amount must be a positive whole number" }, { status: 400 });
    }

    // Sane upper bound to stop absurd/garbage or overflow-style values
    if (bidAmount > 10_000_000) {
        return NextResponse.json({ success: false, error: "Bid amount exceeds allowed limit" }, { status: 400 });
    }

    if (typeof brandName !== "string" || brandName.trim().length === 0 || brandName.length > 100) {
        return NextResponse.json({ success: false, error: "Invalid brand name" }, { status: 400 });
    }

    // FIX 2: Validate submitted_url safely — new URL() throws on malformed input,
    // and previously that error wasn't caught until the generic catch block,
    // producing a vague 500 instead of a clear 400.
    let domain: string;
    try {
        const parsed = new URL(submitted_url);
        if (!["http:", "https:"].includes(parsed.protocol)) {
            throw new Error("Only http/https URLs allowed");
        }
        domain = parsed.hostname.replace("www.", "");
    } catch {
        return NextResponse.json({ success: false, error: "Invalid submitted URL" }, { status: 400 });
    }

    try {
        // ─────────────────────────────────────────────
        // STEP 1: Check if this bid is still the highest
        // ─────────────────────────────────────────────
        const { data: currentKey, error: keyError } = await supabaseAdmin
            .from("keys")
            .select("current_bid_amount")
            .eq("key_slot", keySlot)
            .single();

        if (keyError && keyError.code !== "PGRST116") {
            throw keyError;
        }

        const actualHighest = currentKey?.current_bid_amount || 0;

        if (actualHighest >= bidAmount || actualHighest > (lastSeenHighestBid || 0)) {
            return NextResponse.json(
                {
                    success: false,
                    code: "OUTBID",
                    error: `This key was just outbid at $${actualHighest}.`,
                    currentHighestBid: actualHighest,
                    minimumNextBid: actualHighest + 1,
                },
                { status: 409 }
            );
        }

        // ─────────────────────────────────────────────
        // FIX 3 (your main ask): remove any stale pending bid for this
        // slot before inserting a new one, instead of letting them pile up.
        // This also prevents a user from having 2+ live Cashfree orders
        // open simultaneously for the same slot.
        // ─────────────────────────────────────────────
        const { error: deleteError } = await supabaseAdmin
            .from("pending_bids")
            .delete()
            .eq("key_slot", keySlot);

        if (deleteError) throw deleteError;

        // ─────────────────────────────────────────────
        // STEP 2: Save fresh pending bid
        // ─────────────────────────────────────────────
        const pendingOrderId = `order_${keySlot}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const terms_version = process.env.NEXT_TERMS_VERSION ?? "v1.0";

        const { error: insertError } = await supabaseAdmin
            .from("pending_bids")
            .insert({
                order_id: pendingOrderId,
                key_slot: keySlot,
                bid_amount: bidAmount,
                brand_name: brandName,
                submitted_url: submitted_url,
                key_logo: iconUrl ?? null,
                status: "PENDING",
                terms_accepted_at: new Date().toISOString(),
                terms_version: terms_version,
            });

        if (insertError) throw insertError;

        // ─────────────────────────────────────────────
        // STEP 3: Call Cashfree's PGCreateOrder API
        // ─────────────────────────────────────────────
        const derivedEmail = `contact@${domain}`;

        const orderResponse = await cashfree.PGCreateOrder({
            order_id: pendingOrderId,
            order_amount: bidAmount,
            order_currency: ORDER_CURRENCY,
            customer_details: {
                customer_id: `cust_${Date.now()}`,
                customer_email: derivedEmail,
                customer_phone: "9999999999",
            },
            order_meta: {
                return_url: RETURN_URL,
                notify_url: NOTIFY_URL,
            },
        });

        return NextResponse.json({
            success: true,
            payment_session_id: orderResponse.data.payment_session_id,
            order_id: pendingOrderId,
        });
    } catch (err: any) {
        // FIX 4: log full error server-side, but never leak internals to the client
        console.error("create-order error:", err);
        return NextResponse.json(
            { success: false, error: "Order creation failed. Please try again." },
            { status: 500 }
        );
    }
}