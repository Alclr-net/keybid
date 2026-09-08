"use client";

import React, { useState, useEffect, useCallback, use, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  IconArrowLeft,
  IconShieldCheck,
  IconLock,
  IconAlertCircle,
  IconCheck,
  IconExternalLink,
  IconRotate,
  IconSparkles,
  IconUpload,
  IconHelpCircle,
  IconKeyboard,
  IconFlame,
} from "@tabler/icons-react";
import TermsModal from "@/src/components/TermsModal";
import Ping from "@/src/components/Ping";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { cn } from "@/src/lib/utils";

interface KeyLiveData {
  keySlot: string;
  claimed: boolean;
  currentHolder: {
    id: string;
    name: string;
    url: string;
    tagline: string;
    iconUrl: string;
    bid: number;
    clicks: number;
  } | null;
  currentHighestBid: number;
  minimumNextBid: number;
  lastUpdated: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayErrorResponse {
  error: {
    description?: string;
    code?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: RazorpayErrorResponse) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export default function KeyBidPaymentPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key: rawKeyParam } = use(params);
  const keySlot = decodeURIComponent(rawKeyParam || "").trim().toUpperCase();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-[#080a10] text-zinc-900 dark:text-white flex items-center justify-center transition-colors duration-200">
          <div className="flex flex-col items-center gap-3">
            <div className="h-7 w-7 border-2 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
              Connecting to secure KeyBid auction...
            </p>
          </div>
        </div>
      }
    >
      <BidFormContent keySlot={keySlot} />
    </Suspense>
  );
}

function BidFormContent({ keySlot }: { keySlot: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial query overrides if user came from outbid modal
  const initialBidParam = searchParams.get("amount");
  const initialBrandParam = searchParams.get("brand") || "";
  const initialWebsiteParam = searchParams.get("url") || "";

  // Live key state loaded from API
  const [liveData, setLiveData] = useState<KeyLiveData | null>(null);
  const [loadingLive, setLoadingLive] = useState(true);
  const [liveError, setLiveError] = useState<string | null>(null);

  // Form states
  const [bidAmount, setBidAmount] = useState<number>(10);
  const [brandName, setBrandName] = useState(initialBrandParam);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(initialWebsiteParam);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Submission & payment states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outbidAlert, setOutbidAlert] = useState<{
    highestBid: number;
    minNext: number;
    message: string;
  } | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<{
    keySlot: string;
    bidAmount: number;
    brandName: string;
    paymentId: string;
    orderId: string;
  } | null>(null);

  // Load Razorpay checkout script
  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("razorpay-sdk")) {
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Fetch live key data from server (Requirement 1: live from database, not stale state)
  const fetchLiveData = useCallback(async (silent = false) => {
    if (!silent) setLoadingLive(true);
    setLiveError(null);
    try {
      const res = await fetch(`/api/keys/${encodeURIComponent(keySlot)}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (json.success && json.data) {
        const data: KeyLiveData = json.data;
        setLiveData(data);

        // Pre-fill bid amount with minimum valid next bid ($10 floor)
        setBidAmount((prev) => {
          if (initialBidParam && !silent) {
            const parsed = parseInt(initialBidParam, 10);
            return Math.max(data.minimumNextBid, parsed || data.minimumNextBid);
          }
          return Math.max(prev, data.minimumNextBid);
        });

        // Clear or update outbid alert
        if (data.currentHighestBid >= bidAmount) {
          setOutbidAlert({
            highestBid: data.currentHighestBid,
            minNext: data.minimumNextBid,
            message: `This key was just outbid at $${data.currentHighestBid} — refresh to see the new minimum`,
          });
        } else {
          setOutbidAlert(null);
        }
      } else {
        setLiveError(json.error || "Failed to load live key details");
      }
    } catch (err: any) {
      setLiveError(err?.message || "Failed to contact KeyBid server");
    } finally {
      if (!silent) setLoadingLive(false);
    }
  }, [keySlot, initialBidParam, bidAmount]);

  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogoPreview(ev.target?.result as string);
        setLogoUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Minimum valid next bid calculation
  const currentHighest = liveData?.currentHighestBid || 0;
  const minimumAllowedBid = Math.max(10, currentHighest + 1);

  // Client-side validation
  const isBidAmountValid = bidAmount >= 10 && bidAmount > currentHighest;
  const bidValidationError =
    bidAmount < 10
      ? "Minimum bid amount for every key is $10."
      : bidAmount <= currentHighest
        ? `Must exceed current leading bid of $${currentHighest}. Minimum valid bid is $${minimumAllowedBid}.`
        : null;

  const canSubmit =
    !isSubmitting &&
    termsAgreed &&
    isBidAmountValid &&
    brandName.trim().length > 0 &&
    email.includes("@") &&
    !outbidAlert;

  // Handle Razorpay Payment Flow
  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setOutbidAlert(null);

    try {
      // 1. Live Outbid Protection: Check server-side order creation
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keySlot,
          bidAmount,
          brandName: brandName.trim(),
          email: email.trim(),
          website: website.trim(),
          iconUrl: logoUrl,
          lastSeenHighestBid: currentHighest,
        }),
      });

      const orderData = await orderRes.json();

      // If outbid occurred while filling form, server returns 409 Conflict
      if (orderRes.status === 409 || orderData.code === "OUTBID") {
        setOutbidAlert({
          highestBid: orderData.currentHighestBid || currentHighest,
          minNext: orderData.minimumNextBid || Math.max(10, currentHighest + 1),
          message: orderData.error || `This key was just outbid at $${orderData.currentHighestBid} — refresh to see the new minimum`,
        });
        setBidAmount(orderData.minimumNextBid || Math.max(10, currentHighest + 1));
        setIsSubmitting(false);
        return;
      }

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to generate payment order");
      }

      const { orderId, amount, keyId, isLiveRazorpay } = orderData;

      // 2. Open Razorpay Checkout or Sandbox Simulator
      if (typeof window.Razorpay === "function" && isLiveRazorpay) {
        const options = {
          key: keyId,
          amount: amount,
          currency: "USD",
          name: "KeyBid Hardware Auction",
          description: `Leading Bid for Key [${keySlot}] · Apple Magic Keyboard`,
          image: "/icon_no_border.svg",
          order_id: orderId,
          prefill: {
            name: brandName,
            email: email,
          },
          theme: {
            color: "#2563eb",
          },
          handler: async function (response: any) {
            // Confirm on server
            await completePaymentVerification({
              orderId: response.razorpay_order_id || orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: function () {
              // On cancellation, return to bid page with form state intact
              setIsSubmitting(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          console.error("Razorpay payment failed", response.error);
          setIsSubmitting(false);
          alert(`Payment failed: ${response.error.description || "Transaction cancelled"}`);
        });
        rzp.open();
      } else {
        // High-fidelity Sandbox Simulation for immediate preview without merchant keys
        setTimeout(async () => {
          const mockPaymentId = `pay_rzp_${Date.now()}`;
          await completePaymentVerification({
            orderId,
            paymentId: mockPaymentId,
            signature: "verified_sandbox_sig",
          });
        }, 1200);
      }
    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false);
      alert(err?.message || "An error occurred while preparing your payment.");
    }
  };

  // Complete Payment Verification on Server
  const completePaymentVerification = async ({
    orderId,
    paymentId,
    signature,
  }: {
    orderId: string;
    paymentId: string;
    signature: string;
  }) => {
    try {
      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentId,
          signature,
          keySlot,
          bidAmount,
          brandName: brandName.trim(),
          email: email.trim(),
          website: website.trim(),
          iconUrl: logoUrl,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || "Payment verification failed on server");
      }

      // Display Post-Payment Confirmation state
      setPaymentSuccess({
        keySlot,
        bidAmount,
        brandName: brandName.trim(),
        paymentId,
        orderId,
      });
    } catch (err: any) {
      alert(`Verification error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#080a10] text-zinc-900 dark:text-white flex flex-col items-center select-none mt-20 transition-colors duration-200">
      {/* ── Focused Top Navigation ── */}
      <header className="w-full border-b border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0c0f18]/80 backdrop-blur-xl sticky top-0 z-30 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <IconArrowLeft size={16} />
            <span>Cancel & Return</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-zinc-950 dark:text-white">
              KEY<span className="text-blue-600 dark:text-blue-500">BID</span>
            </span>
            <span className="text-zinc-300 dark:text-zinc-600 text-xs">/</span>
            <span className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-white/5">
              Key [{keySlot}]
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] font-semibold">
              <IconLock size={12} />
              <span className="hidden sm:inline">256-Bit Encrypted</span>
              <span className="sm:hidden">Secure</span>
            </div>
            <ThemeToggle className="w-8 h-8 rounded-lg" />
          </div>
        </div>
      </header>

      {/* ── Main Bid & Payment Form Container ── */}
      <main className="w-full max-w-xl mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        {paymentSuccess ? (
          /* ════════════════ POST-PAYMENT STATE (Requirement 8) ════════════════ */
          <div className="rounded-3xl bg-white dark:bg-[#0e121d] border border-emerald-500/40 dark:border-emerald-500/30 p-8 sm:p-10 text-center shadow-xl dark:shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300 transition-colors">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border-2 border-emerald-500/30 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-[0_0_24px_rgba(16,185,129,0.2)]">
              <IconCheck size={36} stroke={3} />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-mono uppercase tracking-wider mb-2">
                Payment Confirmed · Verified Bid
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                You&apos;re now the leading bid on Key [{paymentSuccess.keySlot}] at ${paymentSuccess.bidAmount}!
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
                Congratulations, <strong className="text-zinc-950 dark:text-white">{paymentSuccess.brandName}</strong>. Your bid has been recorded on the live auction ledger.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="rounded-2xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 p-4 text-xs font-mono space-y-2 text-left">
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Hardware Slot:</span>
                <span className="text-zinc-950 dark:text-white font-bold">Keycap [{paymentSuccess.keySlot}]</span>
              </div>
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Amount Paid:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">${paymentSuccess.bidAmount} USD</span>
              </div>
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Payment Reference:</span>
                <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]">{paymentSuccess.paymentId}</span>
              </div>
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Order ID:</span>
                <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]">{paymentSuccess.orderId}</span>
              </div>
            </div>

            {/* Guarantee Note */}
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-900 dark:text-blue-300 text-xs text-left flex items-start gap-2">
              <IconShieldCheck size={18} className="shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
              <span>
                <strong>Next Step:</strong> You will be notified immediately if challenged. If someone outbids you, your full ${paymentSuccess.bidAmount} will be refunded automatically to your card within 5–7 business days.
              </span>
            </div>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md text-center cursor-pointer"
              >
                ← Return to Keyboard View
              </Link>
              <Link
                href="/auction"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10 transition-all text-center cursor-pointer"
              >
                View Live Leaderboard →
              </Link>
            </div>
          </div>
        ) : (
          /* ════════════════ ACTIVE BID & PAYMENT FORM ════════════════ */
          <div className="space-y-6">
            {/* 1. Context Header: Live Key Info (Requirement 1) */}
            <div className="rounded-3xl bg-white dark:bg-[#0e121d] border border-zinc-200/80 dark:border-white/10 p-5 sm:p-6 shadow-sm dark:shadow-xl relative overflow-hidden transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* 3D Keycap Icon */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-950 border-2 border-blue-500/80 shadow-[0_8px_20px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col items-center justify-center p-1 shrink-0 relative">
                    <span className="font-mono text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                      {keySlot}
                    </span>
                    <span className="text-[8px] font-mono text-zinc-500 dark:text-zinc-400 font-bold uppercase">
                      KEYCAP
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Ping>
                          <span>Live Keycap Registry</span>
                        </Ping>
                      </div>
                    </div>

                    <h2 className="font-display text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight mt-0.5">
                      Bidding on Key &apos;{keySlot}&apos;
                    </h2>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Apple Magic Keyboard · 1.8 × 1.8 cm Hardware Placement
                    </p>
                  </div>
                </div>

                {/* Live Current Bid Badge */}
                <div className="text-right shrink-0 bg-zinc-50 dark:bg-black/40 border border-zinc-200/80 dark:border-white/5 p-2.5 rounded-2xl">
                  <div className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400">
                    Current Highest
                  </div>
                  <div className="font-mono text-lg sm:text-xl font-extrabold text-blue-600 dark:text-blue-400">
                    {loadingLive ? (
                      <span className="animate-pulse">Loading…</span>
                    ) : currentHighest > 0 ? (
                      `$${currentHighest}`
                    ) : (
                      <span className="text-zinc-400 dark:text-zinc-500">$0 (Open)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Holder Row */}
              {liveData?.claimed && liveData.currentHolder && (
                <div className="mt-4 pt-3 border-t border-zinc-200/80 dark:border-white/10 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2 min-w-0">
                    {liveData.currentHolder.iconUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={liveData.currentHolder.iconUrl}
                        alt={liveData.currentHolder.name}
                        className="w-5 h-5 rounded object-contain bg-zinc-100 dark:bg-black/60 p-0.5"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <span className="text-zinc-600 dark:text-zinc-300 truncate">
                      Held by <strong className="text-zinc-950 dark:text-white">{liveData.currentHolder.name}</strong>
                    </span>
                    {liveData.currentHolder.url && (
                      <a
                        href={liveData.currentHolder.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                      >
                        <IconExternalLink size={12} />
                      </a>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
                    {liveData.currentHolder.clicks} clicks
                  </span>
                </div>
              )}
            </div>

            {/* 2. Live Outbid Protection Alert (Requirement 3) */}
            {outbidAlert && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/15 border-2 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3 shadow-md animate-in shake">
                <IconAlertCircle size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="font-bold text-amber-950 dark:text-amber-300">Live Outbid Detected</div>
                  <p className="text-amber-800 dark:text-amber-200">{outbidAlert.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => fetchLiveData(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shrink-0 cursor-pointer transition-colors"
                >
                  Refresh
                </button>
              </div>
            )}

            {/* Form Box */}
            <form onSubmit={handleInitiatePayment} className="space-y-5">
              {/* 3. Bid Amount Input (Requirement 2: Minimum $10 floor) */}
              <div className="rounded-2xl bg-white dark:bg-[#0e121d] border border-zinc-200/80 dark:border-white/10 p-5 space-y-3 shadow-xs transition-colors">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Your Bid Amount (USD) <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    Minimum next bid: <strong className="text-blue-600 dark:text-blue-400">${minimumAllowedBid}</strong>
                  </span>
                </div>

                <div className="relative flex items-center rounded-2xl border-2 border-blue-500 bg-zinc-50 dark:bg-black/60 px-4 py-3 shadow-inner transition-colors">
                  <span className="text-xl sm:text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 select-none pr-2">
                    $
                  </span>
                  <input
                    type="number"
                    min={minimumAllowedBid}
                    value={bidAmount || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setBidAmount(isNaN(val) ? 0 : val);
                      if (outbidAlert) setOutbidAlert(null);
                    }}
                    required
                    className="w-full bg-transparent font-mono text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white outline-none"
                  />
                  <span className="text-xs font-mono uppercase text-zinc-400 dark:text-zinc-500">USD</span>
                </div>

                {/* Inline Error (Requirement 2) */}
                {bidValidationError && (
                  <div className="text-[11px] text-red-500 dark:text-red-400 font-semibold flex items-center gap-1.5 pt-0.5">
                    <IconAlertCircle size={13} />
                    <span>{bidValidationError}</span>
                  </div>
                )}

                {/* Quick Bid Increment Buttons */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500">Quick Bid:</span>
                  {[minimumAllowedBid, minimumAllowedBid + 5, minimumAllowedBid + 10, minimumAllowedBid + 25].map(
                    (amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setBidAmount(amt);
                          if (outbidAlert) setOutbidAlert(null);
                        }}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer",
                          bidAmount === amt
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-700 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white border border-zinc-200/80 dark:border-white/5"
                        )}
                      >
                        ${amt}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* 4. Brand Sponsor Details */}
              <div className="rounded-2xl bg-white dark:bg-[#0e121d] border border-zinc-200/80 dark:border-white/10 p-5 space-y-4 shadow-xs transition-colors">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Sponsor Identity Details
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Brand / Company Name <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme, Supabase"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/40 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-black/60 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Email Address <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alerts@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/40 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-black/60 transition-colors"
                    />
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5 block">
                      Used for instant outbid alerts
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Website URL <span className="text-zinc-400 dark:text-zinc-500 font-normal">(Optional · for live backlink)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/40 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-black/60 transition-colors"
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Decal Logo <span className="text-zinc-400 dark:text-zinc-500 font-normal">(Optional · PNG, SVG)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-zinc-300 dark:border-white/15 hover:border-blue-500 bg-zinc-50/80 dark:bg-black/30 cursor-pointer transition-colors">
                    {logoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-8 h-8 rounded object-contain bg-zinc-100 dark:bg-white/10 p-0.5"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-zinc-200/80 dark:bg-white/5 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                        <IconUpload size={16} />
                      </div>
                    )}
                    <div className="text-xs">
                      <div className="font-semibold text-zinc-800 dark:text-zinc-300">
                        {logoPreview ? "Custom logo attached" : "Upload your vector/high-res logo"}
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-500 font-mono">
                        Inspected by hand before physical UV printing
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/png, image/svg+xml, image/jpeg"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </label>
                </div>
              </div>

              {/* 5. Order Summary Breakdown (Requirement 6) */}
              <div className="rounded-2xl bg-white dark:bg-[#0e121d] border border-zinc-200/80 dark:border-white/10 p-5 space-y-3 shadow-xs transition-colors">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Order Summary
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Keycap Slot Placement [Key {keySlot}]:</span>
                    <span className="text-zinc-950 dark:text-white font-bold">${bidAmount}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>1200 DPI Precision UV Curing:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Included ($0)</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Live 365-Day SEO Backlink:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Included ($0)</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Platform Transaction Fee:</span>
                    <span className="text-zinc-400 dark:text-zinc-500">$0.00</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200 dark:border-white/10 flex justify-between text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                    <span>Total Due Now:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-black">${bidAmount} USD</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1.5">
                  <IconLock size={12} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Processed securely via Razorpay in USD. Zero surprise charges.</span>
                </div>
              </div>

              {/* 6. Trust & Policy Microcopy + Refund Guarantee (Requirement 4) */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs text-blue-900 dark:text-blue-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-900 dark:text-blue-200">
                  <IconRotate size={14} className="text-blue-600 dark:text-blue-400" />
                  100% Outbid Refund Guarantee
                </div>
                <p className="text-[11px] leading-relaxed text-blue-800/90 dark:text-blue-300/90 font-normal">
                  You&apos;ll be automatically refunded within 5–7 business days if someone outbids you before round close. Your funds are protected.
                </p>
              </div>

              {/* 7. Terms & Conditions Checkbox (Requirement 5) */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-black/40 border border-zinc-200/80 dark:border-white/10">
                <label className="flex items-start gap-3 cursor-pointer text-xs text-zinc-700 dark:text-zinc-300 leading-normal">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    required
                    className="mt-0.5 h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>
                    I agree to the KeyBid{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setTermsModalOpen(true);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline font-semibold cursor-pointer"
                    >
                      Auction Rules, 365-day placement terms
                    </button>
                    , and understand outbid refunds are issued automatically within 5–7 business days.
                  </span>
                </label>
              </div>

              {/* 8. Pay Button & State Handling (Requirement 7) */}
              <button
                type="submit"
                disabled={!canSubmit}
                className={cn(
                  "w-full py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-sm text-white transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2",
                  canSubmit
                    ? "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-[0_4px_24px_rgba(37,99,235,0.3)] active:scale-[0.99]"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-300/60 dark:border-white/5 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Preparing Secure Checkout…</span>
                  </>
                ) : (
                  <>
                    <IconLock size={16} />
                    <span>Pay ${bidAmount} & Lock In Key [{keySlot}]</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-zinc-500 dark:text-zinc-400 font-mono">
                Encrypted with Razorpay · Immediate receipt & notification sent to your email
              </p>
            </form>
          </div>
        )}
      </main>

      {/* Terms & Conditions Modal */}
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </div>
  );
}
