import DodoPayments from "dodopayments";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { randomBytes } from "crypto";

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

const DODO_PRODUCT_ID = isProd ? process.env.DODO_PWYW_PRODUCT_ID : process.env.TEST_DODO_PRODUCT_ID;

const RETURN_URL =

  isProd
    ? "https://keybid.lol/payments/verify?order_id={order_id}"
    : "https://canopy-proofs-exit.ngrok-free.dev/payments/verify?order_id={order_id}";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { keySlot, bidAmount, brandName, submitted_url, iconUrl, lastSeenHighestBid, about } = body;

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

  // lastSeenHighestBid is optional client-side UX hint only — validate type so a
  // malformed value can't slip through into the comparison below.
  const safeLastSeenHighestBid =
    typeof lastSeenHighestBid === "number" && Number.isFinite(lastSeenHighestBid)
      ? lastSeenHighestBid
      : 0;

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

  const cleanAbout = typeof about === "string" ? about.trim().slice(0, 500) : "";
  if (cleanAbout.length < 20) {
    return NextResponse.json(
      { success: false, error: "Description must be at least 20 characters" },
      { status: 400 }
    );
  }

  let pendingOrderId: string | null = null;

  try {
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
    pendingOrderId = `order_${sanitizedKeySlot}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const terms_version = process.env.NEXT_TERMS_VERSION ?? "v1.0";

    // Unguessable token tying this order to the browser that created it.
    // Required by the verify endpoint to prevent anyone from polling
    // another customer's order_id and reading their bid status.
    const clientToken = randomBytes(24).toString("hex");

    // ── STEP 1 + 2 combined atomically: outbid check + pending_bids insert ──
    // Both happen inside a single DB transaction with a row lock on `keys`,
    // so two concurrent bids on the same key_slot can no longer both pass
    // the check before either has inserted (the race the old two-step
    // select-then-insert flow was exposed to).
    const { data: createResult, error: createError } = await supabaseAdmin.rpc("create_pending_bid", {
      p_order_id: pendingOrderId,
      p_key_slot: keySlot,
      p_bid_amount: bidAmount,
      p_brand_name: cleanBrandName,
      p_submitted_url: normalizedUrl,
      p_key_logo: validatedIconUrl,
      p_about: cleanAbout,
      p_terms_version: terms_version,
      p_client_token: clientToken,
      p_expected_currency: "USD",
    });

    if (createError) throw createError;

    const result = createResult as {
      success: boolean;
      code?: string;
      error?: string;
      currentHighestBid?: number;
      minimumNextBid?: number;
    };

    if (!result?.success) {
      if (result?.code === "OUTBID") {
        return NextResponse.json(
          {
            success: false,
            code: "OUTBID",
            error: result.error,
            currentHighestBid: result.currentHighestBid,
            minimumNextBid: result.minimumNextBid,
          },
          { status: 409 }
        );
      }
      throw new Error(result?.error || "Failed to create pending bid");
    }

    // Non-security UX hint: warn client-side callers relying on a stale
    // lastSeenHighestBid, even though the atomic check above is authoritative.
    if (typeof result.currentHighestBid === "number" && result.currentHighestBid > safeLastSeenHighestBid) {
      // no-op here — reserved for future UX messaging if needed
    }

    // STEP 2: Dodo checkout session — dynamic PWYW amount for this exact bid
    const derivedEmail = `contact@${domain}`;

    const sessionPayload: Parameters<typeof client.checkoutSessions.create>[0] = {
      product_cart: [
        {
          product_id: DODO_PRODUCT_ID!,
          quantity: 1,
          amount: bidAmount * 100, // minor units (cents)
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

    const session = await client.checkoutSessions.create(sessionPayload);

    if (!session?.checkout_url) {
      throw new Error("Dodo checkout session did not return a checkout_url");
    }

    return NextResponse.json({
      success: true,
      checkout_url: session.checkout_url,
      order_id: pendingOrderId,
      client_token: clientToken, // frontend must store this and send it with verify polling
    });
  } catch (err: any) {
    console.error("checkout error:", err);

    // If the pending_bids row was created but Dodo session creation failed
    // after that, don't leave a phantom PENDING hold on the key_slot until
    // the 15-minute TTL sweep — mark it FAILED immediately.
    if (pendingOrderId) {
      await supabaseAdmin
        .from("pending_bids")
        .update({ status: "FAILED" })
        .eq("order_id", pendingOrderId)
        .eq("status", "PENDING");
    }

    return NextResponse.json(
      { success: false, error: "Order creation failed. Please try again." },
      { status: 500 }
    );
  }
}