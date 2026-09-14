import { Cashfree, CFEnvironment } from "cashfree-pg";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ─────────────────────────────────────────────
// Environment-based config — no manual flipping needed
// ─────────────────────────────────────────────
const isProd = process.env.NEXT_PUBLIC_CASHFREE_ENV === "production";

const cashfree = new Cashfree(
    isProd ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
    process.env.CASHFREE_APP_ID!,
    process.env.CASHFREE_SECRET_KEY!
);

const ORDER_CURRENCY = isProd ? "INR" : "INR";

const NOTIFY_URL = isProd
    ? "https://keybid.lol/api/webhook/cashfree"
    : "https://canopy-proofs-exit.ngrok-free.dev/api/webhook/cashfree"; // update if your ngrok URL changes

const RETURN_URL = isProd
    ? "https://keybid.lol/payment-status?order_id={order_id}"
    : "https://canopy-proofs-exit.ngrok-free.dev/payment-status?order_id={order_id}";

export async function POST(req: Request) {
    const body = await req.json();
    const {
        keySlot,
        bidAmount,
        brandName,
        website,
        iconUrl,
        lastSeenHighestBid,
    } = body;
    console.log(req.body)
    // Basic validation
    if (!keySlot || !bidAmount || !brandName || !website) {
        return NextResponse.json(
            { success: false, error: "Missing required fields" },
            { status: 400 }
        );
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
            // PGRST116 = no rows found, which is fine (key has no bids yet)
            throw keyError;
        }

        const actualHighest = currentKey?.current_bid_amount || 0;

        // Reject if someone else has already bid higher, or bid doesn't beat current highest
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
        // STEP 2: Save data to pending_bids
        // ─────────────────────────────────────────────
        const pendingOrderId = `order_${keySlot}_${Date.now()}`;
        const terms_version = process.env.TERMS_VERSION ?? "v1.0";

        const { error: insertError } = await supabaseAdmin
            .from("pending_bids")
            .insert({
                order_id: pendingOrderId,
                key_slot: keySlot,
                bid_amount: bidAmount,
                brand_name: brandName,
                website: website,
                key_logo: iconUrl,
                status: "PENDING",
                terms_accepted_at: new Date().toISOString(),
                terms_version: terms_version,
            });

        if (insertError) throw insertError;

        // ─────────────────────────────────────────────
        // STEP 3: Call Cashfree's PGCreateOrder API
        // ─────────────────────────────────────────────
        const domain = new URL(website).hostname.replace("www.", "");
        const derivedEmail = `contact@${domain}`;

        const orderResponse = await cashfree.PGCreateOrder({
            order_id: pendingOrderId,
            order_amount: bidAmount,
            order_currency: ORDER_CURRENCY,
            customer_details: {
                customer_id: `cust_${Date.now()}`,
                customer_email: derivedEmail,
                customer_phone: "9999999999", // required by Cashfree even if unused
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
        console.log("create-order error:", err);
        return NextResponse.json(
            {
                success: false,
                error:
                    err.response?.data?.message ||
                    err.message ||
                    "Order creation failed",
            },
            { status: 500 }
        );
    }
}