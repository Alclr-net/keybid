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
  const cfPaymentId = payload?.data?.payment?.cf_payment_id
    ? String(payload.data.payment.cf_payment_id)
    : null;

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
      // Delegate all DB logic to confirm_bid — same function used by verify route.
      // It handles idempotency (duplicate webhooks), inserts into bids,
      // updates keys, and deletes from pending_bids atomically.
      const { data, error } = await supabaseAdmin.rpc("confirm_bid", {
        p_order_id: orderId,
        p_cf_payment_id: cfPaymentId,
        p_cf_contact: null,
      });

      if (error) {
        console.error("Webhook confirm_bid error:", error);
        return NextResponse.json({ error: "Processing failed" }, { status: 500 });
      }

      const result = data as { success: boolean; error?: string };
      if (!result.success) {
        console.error("Webhook confirm_bid returned failure:", result.error);
        // Still return 200 if bid not found (order may have already been
        // confirmed by the verify route — that's fine).
        if (result.error?.includes("not found")) {
          return NextResponse.json({ received: true });
        }
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
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
    // Return 500 so Cashfree retries on transient DB errors.
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}