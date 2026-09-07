import { NextRequest, NextResponse } from "next/server";
import { getPendingOrder, finalizeWinningBid } from "@/lib/serverStore";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      paymentId,
      signature,
      keySlot,
      brandName,
      email,
      bidAmount,
      website,
      iconUrl,
    } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required for verification" },
        { status: 400 }
      );
    }

    const pending = getPendingOrder(orderId);
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // Verify cryptographic signature if secret & signature exist
    if (razorpayKeySecret && signature && paymentId) {
      const generatedSignature = crypto
        .createHmac("sha256", razorpayKeySecret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      if (generatedSignature !== signature) {
        return NextResponse.json(
          { error: "Invalid payment signature verification" },
          { status: 400 }
        );
      }
    }

    // Determine final bid attributes (fallback to pending order if omitted in request)
    const slot = keySlot || pending?.keySlot;
    const finalAmount = bidAmount || pending?.bidAmount;
    const finalBrand = brandName || pending?.brandName;
    const finalEmail = email || pending?.email;
    const finalWebsite = website || pending?.website;
    const finalIcon = iconUrl || pending?.iconUrl;

    if (!slot || !finalAmount || !finalBrand) {
      return NextResponse.json(
        { error: "Missing required bid details for completion" },
        { status: 400 }
      );
    }

    // Finalize winning bid on server store
    const updatedState = finalizeWinningBid(slot, {
      bidAmount: finalAmount,
      brandName: finalBrand,
      email: finalEmail || "sponsor@keybid.lol",
      website: finalWebsite,
      iconUrl: finalIcon,
      orderId,
      paymentId: paymentId || `pay_sim_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      message: `You're now the leading bid on Key ${slot} at $${finalAmount}`,
      keySlot: slot,
      bidAmount: finalAmount,
      brandName: finalBrand,
      paymentId: paymentId || `pay_sim_${Date.now()}`,
      orderId,
      updatedState,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
