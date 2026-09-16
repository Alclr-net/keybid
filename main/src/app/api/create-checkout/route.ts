import DodoPayments from "dodopayments";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const isProd =
  process.env.NEXT_PUBLIC_DODO_ENV === "production" ||
  process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode";

const client = new DodoPayments({
  bearerToken:
    (isProd
      ? process.env.DODO_PAYMENTS_API_KEY
      : process.env.TEST_DODO_PAYMENTS_API_KEY || process.env.DODO_PAYMENTS_API_KEY)!,
  environment: isProd ? "live_mode" : "test_mode",
});

const DODO_PRODUCT_ID = (process.env.DODO_PRODUCT_ID || process.env.DODO_PWYW_PRODUCT_ID)!;

const RETURN_URL =
  process.env.DODO_PAYMENTS_RETURN_URL ||
  (isProd
    ? "https://keybid.lol/payments/verify?order_id={order_id}"
    : "https://canopy-proofs-exit.ngrok-free.dev/payments/verify?order_id={order_id}");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { keySlot, bidAmount, brandName, submitted_url, iconUrl, lastSeenHighestBid, country } = body;

  if (
    typeof keySlot !== "string" ||
    keySlot.trim().length === 0 ||
    keySlot.length > 50 ||
    !/^[a-zA-Z0-9_-]+$/.test(keySlot.trim())
  ) {
    return NextResponse.json({ success: false, error: "Invalid key slot" }, { status: 400 });
  }

  if (
    typeof bidAmount !== "number" ||
    !Number.isFinite(bidAmount) ||
    !Number.isInteger(bidAmount) ||
    bidAmount <= 0
  ) {
    return NextResponse.json(
      { success: false, error: "Bid amount must be a positive whole number" },
      { status: 400 }
    );
  }
  if (bidAmount > 10_000_000) {
    return NextResponse.json(
      { success: false, error: "Bid amount exceeds allowed limit" },
      { status: 400 }
    );
  }

  const cleanBrandName = typeof brandName === "string" ? brandName.trim() : "";
  if (
    cleanBrandName.length === 0 ||
    cleanBrandName.length > 100 ||
    !/^[a-zA-Z0-9\s._\-&'!]+$/.test(cleanBrandName)
  ) {
    return NextResponse.json({ success: false, error: "Invalid brand name. Use only letters, numbers, and basic punctuation." }, { status: 400 });
  }

  let domain: string;
  let normalizedUrl: string;
  try {
    const parsed = new URL(submitted_url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("bad protocol");
    parsed.username = "";
    parsed.password = "";
    parsed.hash = "";
    normalizedUrl = parsed.toString();
    domain = parsed.hostname.replace(/^www\./, "");
  } catch {
    return NextResponse.json({ success: false, error: "Invalid submitted URL" }, { status: 400 });
  }

  let validatedIconUrl: string | null = null;
  if (typeof iconUrl === "string" && iconUrl.trim().length > 0) {
    try {
      const parsedIcon = new URL(iconUrl.trim());
      if (parsedIcon.protocol === "https:" && parsedIcon.hostname.length > 0) {
        parsedIcon.username = "";
        parsedIcon.password = "";
        parsedIcon.hash = "";
        validatedIconUrl = parsedIcon.toString();
      }
    } catch {
      validatedIconUrl = null;
    }
  }

  try {
    // STEP 1: still the highest? (same auction logic as before — unchanged)
    const { data: currentKey, error: keyError } = await supabaseAdmin
      .from("keys")
      .select("current_bid_amount")
      .eq("key_slot", keySlot)
      .single();

    if (keyError && keyError.code !== "PGRST116") throw keyError;

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

    // Clear only abandoned pending bids for this slot (> 15-minute TTL) so in-flight checkouts are preserved
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { error: deleteError } = await supabaseAdmin
      .from("pending_bids")
      .delete()
      .eq("key_slot", keySlot)
      .eq("status", "PENDING")
      .lt("created_at", fifteenMinutesAgo);
    if (deleteError) throw deleteError;

    const sanitizedKeySlot = keySlot.trim().replace(/[^A-Za-z0-9_-]/g, "_");
    const pendingOrderId = `order_${sanitizedKeySlot}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const terms_version = process.env.NEXT_TERMS_VERSION ?? "v1.0";

    const { error: insertError } = await supabaseAdmin.from("pending_bids").insert({
      order_id: pendingOrderId,
      key_slot: keySlot,
      bid_amount: bidAmount,
      brand_name: cleanBrandName,
      submitted_url: normalizedUrl,
      key_logo: validatedIconUrl,
      status: "PENDING",
      terms_accepted_at: new Date().toISOString(),
      terms_version: terms_version,
    });
    if (insertError) throw insertError;

    // STEP 2: Dodo checkout session — dynamic PWYW amount for this exact bid
    const derivedEmail = `contact@${domain}`;

    const sessionPayload: Parameters<typeof client.checkoutSessions.create>[0] = {
      product_cart: [
        {
          product_id: DODO_PRODUCT_ID,
          quantity: 1,
          amount: bidAmount * 100, // minor units (cents / paise)
        },
      ],
      return_url: RETURN_URL.replace("{order_id}", pendingOrderId),
      customer: {
        email: derivedEmail,
        name: cleanBrandName,
      },
      metadata: {
        order_id: pendingOrderId, // used by webhook to find matching pending_bids row
      },
    };

    if (country && typeof country === "string" && /^[A-Za-z]{2}$/.test(country.trim())) {
      sessionPayload.billing_address = {
        country: country.trim().toUpperCase() as any,
      };
    }

    const session = await client.checkoutSessions.create(sessionPayload);

    return NextResponse.json({
      success: true,
      checkout_url: session.checkout_url,
      order_id: pendingOrderId,
    });
  } catch (err: any) {
    console.error("checkout error:", err);
    return NextResponse.json(
      { success: false, error: "Order creation failed. Please try again." },
      { status: 500 }
    );
  }
}
