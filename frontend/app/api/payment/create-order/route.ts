import { NextRequest, NextResponse } from "next/server";
import { validateIncomingBid, savePendingOrder } from "@/lib/serverStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      keySlot,
      bidAmount,
      brandName,
      email,
      website,
      iconUrl,
      lastSeenHighestBid,
    } = body;

    if (!keySlot || typeof keySlot !== "string") {
      return NextResponse.json(
        { error: "Key slot is required" },
        { status: 400 }
      );
    }

    if (!bidAmount || typeof bidAmount !== "number") {
      return NextResponse.json(
        { error: "Valid numeric bid amount is required" },
        { status: 400 }
      );
    }

    if (!brandName || typeof brandName !== "string" || !brandName.trim()) {
      return NextResponse.json(
        { error: "Brand name is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required for outbid notifications" },
        { status: 400 }
      );
    }

    // ── LIVE OUTBID PROTECTION & SERVER-SIDE VALIDATION ──
    const validation = validateIncomingBid(
      keySlot,
      bidAmount,
      typeof lastSeenHighestBid === "number" ? lastSeenHighestBid : undefined
    );

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.error,
          code: validation.code,
          currentHighestBid: validation.currentHighestBid,
          minimumNextBid: validation.minimumNextBid,
        },
        { status: 409 } // 409 Conflict for outbid condition
      );
    }

    const slotUpper = keySlot.trim().toUpperCase();
    const amountInCents = Math.round(bidAmount * 100);

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    let orderId = `order_test_${Date.now()}`;
    let isLiveRazorpay = false;

    // If live/test Razorpay API credentials are provided, call Razorpay Orders API
    if (razorpayKeyId && razorpayKeySecret) {
      try {
        const authHeader = Buffer.from(
          `${razorpayKeyId}:${razorpayKeySecret}`
        ).toString("base64");

        const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${authHeader}`,
          },
          body: JSON.stringify({
            amount: amountInCents,
            currency: "USD",
            receipt: `rcpt_${slotUpper}_${Date.now()}`,
            notes: {
              keySlot: slotUpper,
              brandName: brandName.trim(),
              email: email.trim(),
            },
          }),
        });

        if (rzpResponse.ok) {
          const rzpData = await rzpResponse.json();
          orderId = rzpData.id;
          isLiveRazorpay = true;
        } else {
          console.warn(
            "Razorpay API returned status",
            rzpResponse.status,
            "- falling back to sandbox mode"
          );
        }
      } catch (err) {
        console.error("Failed to connect to Razorpay API:", err);
      }
    }

    // Save pending bid order in store
    savePendingOrder(orderId, {
      keySlot: slotUpper,
      bidAmount,
      brandName: brandName.trim(),
      email: email.trim(),
      website: website ? website.trim() : "",
      iconUrl: iconUrl || "",
      isLiveRazorpay,
    });

    return NextResponse.json({
      success: true,
      orderId,
      amount: amountInCents,
      currency: "USD",
      keySlot: slotUpper,
      bidAmount,
      keyId: razorpayKeyId || "rzp_test_keybid_sandbox",
      isLiveRazorpay,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
