import { Cashfree, CFEnvironment } from "cashfree-pg";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const isProd = process.env.NEXT_PUBLIC_CASHFREE_ENV === "production";
const cashfree = new Cashfree(
    isProd ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
    process.env.CASHFREE_APP_ID!,
    process.env.CASHFREE_SECRET_KEY!
);

export async function POST(req: Request) {
    const body = await req.json();
    const { order_id } = body;

    if (!order_id) {
        return NextResponse.json(
            { success: false, error: "Missing order_id" },
            { status: 400 }
        );
    }

    try {
        // ─────────────────────────────────────────────────────────────────────
        // STEP 1: Verify payment status with Cashfree — never trust the client
        // Fetch both the order and its payment details in parallel.
        // ─────────────────────────────────────────────────────────────────────
        const [orderResponse, paymentsResponse] = await Promise.all([
            cashfree.PGFetchOrder(order_id),
            cashfree.PGOrderFetchPayments(order_id),
        ]);

        const orderData = orderResponse.data;
        const orderStatus = orderData.order_status;
        const paymentData = paymentsResponse.data?.[0]; // latest/first payment attempt

        console.log("[verify] order_id:", order_id, "| status:", orderStatus);

        if (orderStatus !== "PAID") {
            return NextResponse.json(
                { success: false, error: `Payment not completed. Status: ${orderStatus}` },
                { status: 400 }
            );
        }

        // ─────────────────────────────────────────────────────────────────────
        // STEP 2: Confirm bid atomically via a single Postgres transaction (RPC).
        //
        // The `verify_and_confirm_bid` function handles everything in ONE
        // database transaction with row-level locking (FOR UPDATE):
        //   • Race condition safety  — only one concurrent caller wins the lock
        //   • Idempotency           — safe to retry; re-calls return alreadyConfirmed
        //   • Atomic writes         — bids INSERT + keys UPSERT + pending_bids DELETE
        //                            all succeed or all roll back together
        //
        // Run this SQL in Supabase SQL editor before deploying:
        //   see: verify_and_confirm_bid.sql (same folder as this file)
        // ─────────────────────────────────────────────────────────────────────
        const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc(
            "verify_and_confirm_bid",
            {
                p_order_id: order_id,
                p_cashfree_payment_id: paymentData?.cf_payment_id?.toString() ?? null,
                p_cashfree_contact: orderData.customer_details?.customer_phone ?? null,
                p_payment_status: paymentData?.payment_status ?? "SUCCESS",
            }
        );

        // rpcError means the RPC call itself failed (network / permission issue)
        if (rpcError) {
            console.error("[verify] RPC call failed:", rpcError);
            throw rpcError;
        }

        // rpcResult is the JSONB returned by the Postgres function
        const result = rpcResult as {
            success: boolean;
            alreadyConfirmed?: boolean;
            error?: string;
        };

        if (!result.success) {
            const isPendingNotFound = result.error === "Pending bid not found";
            console.error("[verify] DB transaction failed:", result.error);
            return NextResponse.json(
                { success: false, error: result.error ?? "Transaction failed" },
                { status: isPendingNotFound ? 404 : 500 }
            );
        }

        return NextResponse.json({
            success: true,
            alreadyConfirmed: result.alreadyConfirmed ?? false,
        });

    } catch (err: any) {
        console.error("[verify] Unhandled error:", err);
        return NextResponse.json(
            {
                success: false,
                error: err.response?.data?.message || err.message || "Verification failed",
            },
            { status: 500 }
        );
    }
}