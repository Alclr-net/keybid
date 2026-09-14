import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Cashfree sends the raw body + timestamp + signature.
// We MUST verify this before trusting the payload — otherwise anyone
// could POST a fake "SUCCESS" event to this URL.
function verifySignature(rawBody: string, timestamp: string, signature: string) {
  const secret = process.env.CASHFREE_SECRET_KEY!;
  const signatureString = timestamp + rawBody;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signatureString)
    .digest("base64");

  return expectedSignature === signature;
}

export async function POST(req: Request) {
  // IMPORTANT: read as raw text, not req.json() — signature is computed
  // over the exact raw bytes. Parsing to JSON first can subtly change
  // decimal formatting (e.g. 170 vs 170.00) and break verification.
  const rawBody = await req.text();

  const signature = req.headers.get("x-webhook-signature") || "";
  const timestamp = req.headers.get("x-webhook-timestamp") || "";

  if (!verifySignature(rawBody, timestamp, signature)) {
    console.error("Webhook signature mismatch — rejecting request");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const orderId: string = payload?.data?.order?.order_id;
  const paymentStatus: string = payload?.data?.payment?.payment_status;
  const cfPaymentId = payload?.data?.payment?.cf_payment_id;

  if (!orderId) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  try {
    // ─────────────────────────────────────────────
    // Only treat SUCCESS as final. FAILED/PENDING/etc.
    // are transitional — Cashfree may send several events
    // for the same order_id across retries.
    // ─────────────────────────────────────────────
    if (paymentStatus === "SUCCESS") {
      // Idempotency: skip if this order was already marked PAID
      // (Cashfree can send the same webhook more than once)
      const { data: existing } = await supabaseAdmin
        .from("pending_bids")
        .select("status, key_slot, bid_amount, brand_name, submitted_url, key_logo, email")
        .eq("order_id", orderId)
        .single();

      if (!existing) {
        console.error(`Webhook for unknown order_id: ${orderId}`);
        return NextResponse.json({ received: true }); // ack anyway, nothing to do
      }

      if (existing.status === "PAID") {
        // Already processed — avoid double-inserting into bids / double-updating keys
        return NextResponse.json({ received: true });
      }

      // 1. Mark pending_bids as PAID
      const { error: updateError } = await supabaseAdmin
        .from("pending_bids")
        .update({ status: "PAID", cf_payment_id: cfPaymentId })
        .eq("order_id", orderId);

      if (updateError) throw updateError;

      // 2. Move into bids table as the confirmed record
      //    NOTE: adjust these columns to match your actual bids table schema.
      const { error: bidsInsertError } = await supabaseAdmin
        .from("bids")
        .insert({
          order_id: orderId,
          key_slot: existing.key_slot,
          bid_amount: existing.bid_amount,
          brand_name: existing.brand_name,
          submitted_url: existing.submitted_url,
          key_logo: existing.key_logo,
          email: existing.email,
          paid_at: new Date().toISOString(),
        });

      if (bidsInsertError) throw bidsInsertError;

      // 3. Update keys table with the new highest bid
      const { error: keysUpdateError } = await supabaseAdmin
        .from("keys")
        .update({ current_bid_amount: existing.bid_amount })
        .eq("key_slot", existing.key_slot);

      if (keysUpdateError) throw keysUpdateError;
    } else if (paymentStatus === "FAILED" || paymentStatus === "USER_DROPPED") {
      await supabaseAdmin
        .from("pending_bids")
        .update({ status: "FAILED" })
        .eq("order_id", orderId);
    }
    // PENDING / other transitional statuses: no action, wait for next webhook

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("webhook processing error:", err);
    // Still return 200 if you don't want Cashfree to keep retrying on a
    // permanent failure, or 500 if you want it to retry. 500 here on purpose
    // since a DB error is likely transient.
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}