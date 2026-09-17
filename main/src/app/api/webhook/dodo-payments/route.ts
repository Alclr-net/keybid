import { Webhooks } from "@dodopayments/nextjs";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const isProd =
  process.env.NEXT_PUBLIC_DODO_ENV === "production" ||
  process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode";

const webhookKey =
  (isProd
    ? process.env.DODO_PAYMENTS_WEBHOOK_SECRET
    : process.env.TEST_DODO_PAYMENTS_WEBHOOK_SECRET || process.env.DODO_PAYMENTS_WEBHOOK_SECRET) || "";

if (!webhookKey) {
  console.error("[Dodo Webhook] Missing webhook secret in environment variables!");
}

export const POST = Webhooks({
  webhookKey,

  onPaymentSucceeded: async (payload) => {
    const orderId = payload?.data?.metadata?.order_id;
    const dodoPaymentId = payload?.data?.payment_id ? String(payload.data.payment_id) : null;
    const contact = (payload?.data as any)?.customer?.email || (payload?.data as any)?.customer?.phone_number || null;
    const webhookEventId = (payload as any)?.webhook_id || (payload as any)?.event_id || (payload as any)?.id || null;

    if (
      typeof orderId !== "string" ||
      orderId.length === 0 ||
      orderId.length > 200 ||
      !/^order_[A-Za-z0-9_-]+$/.test(orderId)
    ) {
      // Event without our correlation metadata or invalid format — ack and skip, don't throw.
      return;
    }

    // ── Settlement amount/currency ──
    // This is what actually lands in your Dodo balance, already converted
    // from the customer's payment currency. This is what must be compared
    // against bid_amount (which is stored in USD) in confirm_bid.
    const settlementAmountMinor =
      typeof payload?.data?.settlement_amount === "number" && Number.isFinite(payload.data.settlement_amount)
        ? payload.data.settlement_amount
        : null;

    const settlementCurrency =
      typeof payload?.data?.settlement_currency === "string" ? payload.data.settlement_currency : null;

    // ── What the customer actually paid, in their own currency ──
    // For audit/refund reference only — never used for the amount-match check.
    const paidAmountLocal =
      typeof payload?.data?.total_amount === "number" && Number.isFinite(payload.data.total_amount)
        ? payload.data.total_amount / 100
        : null;

    const paidCurrency = typeof payload?.data?.currency === "string" ? payload.data.currency : null;

    // Guard: never let a missing settlement amount silently reach the DB function.
    // A null p_amount_received_minor would make the fraud/amount-mismatch check
    // in confirm_bid evaluate to NULL (treated as false in PL/pgSQL), which would
    // silently bypass the fraud check instead of failing loudly.
    if (settlementAmountMinor === null || !settlementCurrency) {
      console.error(
        `[Webhook] Missing settlement_amount/settlement_currency in payload for order ${orderId}. ` +
        `Payment cannot be safely confirmed.`
      );
      throw new Error("Missing settlement amount in webhook payload"); // let Dodo retry
    }

    const { data, error } = await supabaseAdmin.rpc("confirm_bid", {
      p_order_id: orderId,
      p_provider_payment_id: dodoPaymentId,
      p_provider_contact: contact,
      p_amount_received_minor: settlementAmountMinor,
      p_webhook_event_id: webhookEventId,
      p_paid_currency: paidCurrency,
      p_paid_amount_local: paidAmountLocal,
      p_settlement_currency: settlementCurrency,
    });

    if (error) {
      console.error("Webhook confirm_bid error:", error);
      throw error; // let the adapter surface a 500 so Dodo retries — never swallow a DB failure here
    }

    const result = data as {
      success: boolean;
      alreadyConfirmed?: boolean;
      already_processed?: boolean;
      error?: string;
      code?: string;
    };

    const errCode = (result?.code || result?.error || "").toUpperCase();

    if (
      result?.alreadyConfirmed ||
      result?.already_processed ||
      errCode.includes("ALREADY PROCESSED") ||
      result?.code === "23505"
    ) {
      // Idempotent success — already confirmed earlier
      return;
    }

    if (!result?.success) {
      const isTerminalRejection =
        errCode.includes("REFUND_REQUIRED") ||
        errCode.includes("AMOUNT_MISMATCH") ||
        errCode.includes("OUTBID") ||
        errCode.includes("CURRENCY_MISMATCH");

      if (isTerminalRejection) {
        console.error(
          `[Webhook] Terminal rejection for order ${orderId}: ${result.error || result.code}. ` +
          `Payment captured but bid rejected (refund needed). Acknowledging event to prevent retry loop.`
        );
        // Acknowledge event so Dodo does not retry indefinitely
        return;
      }

      console.error("confirm_bid returned failure:", result.error || result.code);
      throw new Error(result.error || result.code || "Bid confirmation failed");
    }
  },

  onPaymentFailed: async (payload) => {
    const orderId = payload?.data?.metadata?.order_id;
    if (typeof orderId !== "string" || !/^order_[A-Za-z0-9_-]+$/.test(orderId)) return;

    const { error } = await supabaseAdmin.rpc("mark_bid_failed", {
      p_order_id: orderId,
    });

    if (error) {
      console.error("Failed to mark bid as failed via mark_bid_failed RPC:", error);
    }
  },

  onPaymentCancelled: async (payload) => {
    const orderId = payload?.data?.metadata?.order_id;
    if (typeof orderId !== "string" || !/^order_[A-Za-z0-9_-]+$/.test(orderId)) return;

    const { error } = await supabaseAdmin.rpc("mark_bid_failed", {
      p_order_id: orderId,
    });

    if (error) {
      console.error("Failed to mark bid as failed (cancelled) via mark_bid_failed RPC:", error);
    }
  },
});
