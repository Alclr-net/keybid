import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

function verifySignature(rawBody: string, timestamp: string, signature: string): boolean {
  const secret = process.env.CASHFREE_SECRET_KEY!;
  if (!secret) {
    console.error("CASHFREE_SECRET_KEY not configured");
    return false;
  }

  const signatureString = timestamp + rawBody;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signatureString)
    .digest("base64");

  const expectedBuf = Buffer.from(expectedSignature);
  const actualBuf = Buffer.from(signature);

  if (expectedBuf.length !== actualBuf.length) return false;

  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  const signature = req.headers.get("x-webhook-signature") || "";
  const timestamp = req.headers.get("x-webhook-timestamp") || "";

  if (!signature || !timestamp) {
    console.error("Webhook missing signature/timestamp headers");
    return NextResponse.json({ error: "Missing signature headers" }, { status: 401 });
  }

  if (!verifySignature(rawBody, timestamp, signature)) {
    console.error("Webhook signature mismatch — rejecting request");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Replay protection — Cashfree sends this timestamp already in milliseconds
  const timestampMs = Number(timestamp);
  if (!Number.isFinite(timestampMs) || Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000) {
    console.error("Webhook timestamp too old or invalid — possible replay");
    return NextResponse.json({ error: "Stale webhook" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.error("Webhook body is not valid JSON");
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const orderId: string = payload?.data?.order?.order_id;
  const paymentStatus: string = payload?.data?.payment?.payment_status;
  const cfPaymentId = payload?.data?.payment?.cf_payment_id
    ? String(payload.data.payment.cf_payment_id)
    : null;

  if (typeof orderId !== "string" || orderId.length === 0 || orderId.length > 200) {
    return NextResponse.json({ error: "Invalid order_id" }, { status: 400 });
  }

  try {
    if (paymentStatus === "SUCCESS") {
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
        if (result.error?.includes("not found")) {
          return NextResponse.json({ received: true });
        }
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    } else if (paymentStatus === "FAILED" || paymentStatus === "USER_DROPPED") {
      const { error } = await supabaseAdmin
        .from("pending_bids")
        .update({ status: "FAILED" }) // confirm this value is allowed by pending_bids' check constraint first
        .eq("order_id", orderId);

      if (error) {
        console.error("Failed to mark pending_bid as FAILED:", error);
        // don't fail the whole webhook over this — log and move on
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("webhook processing error:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}