"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  IconX,
  IconCheck,
  IconShieldCheck,
  IconAlertCircle,
  IconRotate,
  IconUpload,
} from "@tabler/icons-react";
import type { Key } from "@/lib/types/database";
import { Company } from "@/src/app/data/keybidData";
import { cn } from "@/src/lib/utils";
import TermsModal from "@/src/components/TermsModal";

export type OutbidTarget = Key | Company;

interface OutbidModalProps {
  company: OutbidTarget | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (bidAmount: number, createdCompany?: Company, createdKey?: Key) => void;
  initialKeySlot?: string;
  initialBrandName?: string;
  initialWebsite?: string;
  initialLogo?: string;
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

export default function OutbidModal({
  company,
  isOpen,
  onClose,
  onSuccess,
  initialKeySlot,
  initialBrandName,
  initialWebsite,
  initialLogo,
}: OutbidModalProps) {
  const [mounted, setMounted] = useState(false);

  const getCompanyBid = (c: OutbidTarget | null): number => {
    if (!c) return 0;
    if ("current_bid_amount" in c && typeof c.current_bid_amount === "number") {
      return c.current_bid_amount;
    }
    if ("bid" in c && typeof c.bid === "number") {
      return c.bid;
    }
    return 0;
  };

  const getCompanySlot = (c: OutbidTarget | null): string => {
    if (!c) return "";
    if ("keySlot" in c && typeof c.keySlot === "string" && c.keySlot) return c.keySlot;
    if ("key_name" in c && typeof c.key_name === "string" && c.key_name) return c.key_name;
    if ("submitted_url" in c && typeof c.submitted_url === "string" && c.submitted_url) {
      try {
        const domain = c.submitted_url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].split(":")[0];
        const firstChar = domain.match(/[a-zA-Z0-9]/)?.[0]?.toUpperCase();
        if (firstChar) return firstChar;
      } catch {
        // fallback
      }
    }
    if ("id" in c && typeof c.id === "string" && c.id && c.id.length <= 10) return c.id;
    return "";
  };

  const getCompanyName = (c: OutbidTarget | null): string => {
    if (!c) return "";
    if ("name" in c && typeof c.name === "string" && c.name) return c.name;
    if ("submitted_url" in c && typeof c.submitted_url === "string" && c.submitted_url) {
      try {
        const domain = c.submitted_url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].split(":")[0];
        const raw = domain.split(".")[0];
        if (raw) return raw.charAt(0).toUpperCase() + raw.slice(1);
      } catch {
        // fallback
      }
    }
    if ("key_name" in c && typeof c.key_name === "string" && c.key_name) return c.key_name;
    return "";
  };

  const getCompanyLogo = (c: OutbidTarget | null): string => {
    if (!c) return "";
    if ("iconUrl" in c && typeof c.iconUrl === "string") return c.iconUrl;
    if ("key_logo" in c && typeof c.key_logo === "string") return c.key_logo;
    return "";
  };

  const getCompanyUrl = (c: OutbidTarget | null): string => {
    if (!c) return "";
    if ("url" in c && typeof c.url === "string") return c.url;
    if ("submitted_url" in c && typeof c.submitted_url === "string") return c.submitted_url;
    return "";
  };

  const getCompanyTagline = (c: OutbidTarget | null): string => {
    if (!c) return "";
    if ("tagline" in c && typeof c.tagline === "string") return c.tagline;
    if ("about" in c && typeof c.about === "string") return c.about;
    return "";
  };

  const [keySlot, setKeySlot] = useState(
    (company ? getCompanySlot(company) : "") || initialKeySlot || ""
  );

  const targetSlot = keySlot.trim().toUpperCase();
  const isTargetingCompanySlot = Boolean(
    company && targetSlot && targetSlot === getCompanySlot(company).trim().toUpperCase()
  );
  const currentHighest = isTargetingCompanySlot ? getCompanyBid(company) : 0;
  const minBid = currentHighest > 0 ? Math.max(10, currentHighest + 1) : 10;

  const [outbidAlert, setOutbidAlert] = useState<{
    highestBid: number;
    minNext: number;
    message: string;
  } | null>(null);

  const effectiveMinBid = outbidAlert ? outbidAlert.minNext : minBid;
  const [bidAmount, setBidAmount] = useState<number>(effectiveMinBid);
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Submission & payment states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<{
    keySlot: string;
    bidAmount: number;
    brandName: string;
    paymentId: string;
    orderId: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Synchronize initial bid and values when company or isOpen changes
  useEffect(() => {
    if (!isOpen) return;

    const slot = (company ? getCompanySlot(company) : "") || initialKeySlot || "";
    setKeySlot(slot);

    const companyBid = getCompanyBid(company);
    const minCalculated = companyBid > 0 ? companyBid + 1 : 10;
    setBidAmount(minCalculated);

    setBrandName(initialBrandName || "");
    setEmail("");
    setWebsite(initialWebsite || "");
    setLogoPreview(initialLogo || null);
    setLogoUrl(initialLogo || null);
    setTermsAgreed(false);
    setIsSubmitting(false);
    setOutbidAlert(null);
    setPaymentSuccess(null);
  }, [company, isOpen, initialKeySlot, initialBrandName, initialWebsite, initialLogo]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !termsModalOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, termsModalOpen]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoPreview(result);
        setLogoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isBidAmountValid = typeof bidAmount === "number" && bidAmount >= effectiveMinBid;
  const canSubmit =
    !isSubmitting &&
    termsAgreed &&
    isBidAmountValid &&
    brandName.trim().length > 0 &&
    email.includes("@") &&
    targetSlot.length > 0;

  // Complete in-modal Razorpay payment flow
  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setOutbidAlert(null);

    try {
      // 1. Live Outbid Protection: Create order on server
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keySlot: targetSlot,
          bidAmount,
          brandName: brandName.trim(),
          email: email.trim(),
          website: website.trim(),
          iconUrl: logoUrl,
          lastSeenHighestBid: currentHighest,
        }),
      });

      const orderData = await orderRes.json();

      // If outbid occurred concurrently, server returns 409 Conflict
      if (orderRes.status === 409 || orderData.code === "OUTBID") {
        setOutbidAlert({
          highestBid: orderData.currentHighestBid || currentHighest,
          minNext: orderData.minimumNextBid || Math.max(10, currentHighest + 1),
          message:
            orderData.error ||
            `This key was just outbid at $${orderData.currentHighestBid} — minimum next bid updated.`,
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
        const options: RazorpayOptions = {
          key: keyId,
          amount: amount,
          currency: "USD",
          name: "KeyBid Hardware Auction",
          description: `Leading Bid for Key [${targetSlot}] · Apple Magic Keyboard`,
          image: "/icon_no_border.svg",
          order_id: orderId,
          prefill: {
            name: brandName,
            email: email,
          },
          theme: {
            color: "#2563eb",
          },
          handler: async function (response) {
            await completePaymentVerification({
              orderId: response.razorpay_order_id || orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: RazorpayErrorResponse) {
          console.error("Razorpay payment failed", response.error);
          setIsSubmitting(false);
          alert(`Payment failed: ${response.error?.description || "Transaction cancelled"}`);
        });
        rzp.open();
      } else {
        // Sandbox Simulator for immediate local testing without live gateway keys
        setTimeout(async () => {
          const mockPaymentId = `pay_sim_${Date.now()}`;
          await completePaymentVerification({
            orderId,
            paymentId: mockPaymentId,
            signature: "verified_sandbox_sig",
          });
        }, 1000);
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      console.error(err);
      setIsSubmitting(false);
      alert(e?.message || "An error occurred while preparing your payment.");
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
          keySlot: targetSlot,
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

      // Display In-Modal Post-Payment Confirmation state
      setPaymentSuccess({
        keySlot: targetSlot,
        bidAmount,
        brandName: brandName.trim(),
        paymentId,
        orderId,
      });

      // Notify parent callers to update keyboard/leaderboard state
      const updatedCompany: Company = {
        id: company ? company.id : `comp_${Date.now()}`,
        name: brandName.trim(),
        url: website.trim() || getCompanyUrl(company) || "#",
        tagline: getCompanyTagline(company) || "Winning Keybid Sponsor",
        iconUrl: logoUrl || getCompanyLogo(company) || "",
        bid: bidAmount,
        keySlot: targetSlot,
        clicks: (company && "clicks" in company && typeof company.clicks === "number") ? company.clicks : 0,
        submittedAt: (company && "submittedAt" in company && typeof company.submittedAt === "string") ? company.submittedAt : new Date().toISOString().split("T")[0],
      };

      const updatedKey: Key = {
        id: company && "id" in company ? company.id : `key_${Date.now()}`,
        submitted_url: website.trim() || getCompanyUrl(company) || "",
        keyboard_key: targetSlot,
        key_name: brandName.trim() || (company && "key_name" in company ? (company as Key).key_name : null),
        about: getCompanyTagline(company) || `Winning bid by ${brandName.trim()}`,
        key_logo: logoUrl || getCompanyLogo(company) || null,
        fetch_status: "fetched",
        fetched_at: new Date().toISOString(),
        current_bid_id: `bid_${orderId}`,
        click_count: 0,
        current_bid_amount: bidAmount,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      onSuccess?.(bidAmount, updatedCompany, updatedKey);
    } catch (err: unknown) {
      const e = err as { message?: string };
      alert(`Verification error: ${e?.message || "Payment verification failed"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <div
            key="outbid-modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            {/* Backdrop */}
            <motion.div
              key="outbid-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Dialog Container */}
            <motion.div
              key="outbid-dialog-card"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[500px] max-h-[90vh] overflow-y-auto bg-white dark:bg-[#121316] text-zinc-900 dark:text-white rounded-[26px] sm:rounded-[28px] p-5 sm:p-7 shadow-2xl border border-zinc-200/90 dark:border-white/10 z-10 my-auto transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer z-10"
                title="Close modal"
                type="button"
              >
                <IconX size={18} />
              </button>

              {paymentSuccess ? (
                /* ════════════════ IN-MODAL POST-PAYMENT RECEIPT STATE ════════════════ */
                <div className="py-4 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                    <IconCheck size={30} stroke={2.5} />
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold font-mono uppercase tracking-wider mb-1.5">
                      Payment Confirmed · Verified Bid
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                      Key [{paymentSuccess.keySlot}] is Now Yours!
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
                      Congratulations, <strong className="text-zinc-950 dark:text-white">{paymentSuccess.brandName}</strong>. Your bid has been recorded on the live auction ledger.
                    </p>
                  </div>

                  {/* Receipt Breakdown Box */}
                  <div className="rounded-2xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 p-3.5 text-xs font-mono space-y-2 text-left">
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                      <span>Hardware Slot:</span>
                      <span className="text-zinc-950 dark:text-white font-bold">Key [{paymentSuccess.keySlot}]</span>
                    </div>
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                      <span>Amount Paid:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">${paymentSuccess.bidAmount} USD</span>
                    </div>
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                      <span>Payment Ref:</span>
                      <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[180px]">{paymentSuccess.paymentId}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                      <span>Order ID:</span>
                      <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[180px]">{paymentSuccess.orderId}</span>
                    </div>
                  </div>

                  {/* Guarantee Note */}
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-900 dark:text-blue-300 text-[11px] text-left flex items-start gap-2 leading-relaxed">
                    <IconShieldCheck size={16} className="shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <span>
                      <strong>Automatic Refund Guarantee:</strong> If another sponsor outbids you before the auction round closes, your full ${paymentSuccess.bidAmount} will be refunded automatically to your card within 5–7 business days.
                    </span>
                  </div>

                  {/* Close CTA */}
                  <div className="p-[2px] w-full rounded-md transition-all duration-200 ease-out shadow-xs bg-blue-600/20">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-3.5 px-4 rounded-[6px] font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white transition-all text-center cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]"
                    >
                      Done & Return to Keyboard
                    </button>
                  </div>
                </div>
              ) : (
                /* ════════════════ ACTIVE IN-MODAL BID & PAYMENT FORM ════════════════ */
                <form onSubmit={handleInitiatePayment} className="space-y-4">
                  {/* Header Information */}
                  <div>
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-2",
                      currentHighest > 0
                        ? "bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400"
                        : "bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400"
                    )}>
                      {currentHighest > 0
                        ? "Outbid Current Holder"
                        : targetSlot
                          ? `Bid on Key [${targetSlot}]`
                          : "Claim an Open Key"}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                      {targetSlot ? `Key [${targetSlot}]` : "Claim Your Keycap"}
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Apple Magic Keyboard · 1.8 × 1.8 cm Hardware Placement
                    </p>
                    {currentHighest > 0 ? (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                        Current leading bid <strong className="font-bold text-zinc-950 dark:text-white">${currentHighest}</strong>
                        {getCompanyName(company) ? ` by ${getCompanyName(company)}` : ""}
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        No active bids on this slot · Minimum starting bid <strong className="font-bold text-blue-600 dark:text-blue-400">$10</strong>
                      </p>
                    )}
                  </div>

                  {/* Live Outbid Alert */}
                  {outbidAlert && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/15 border-2 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5 shadow-xs">
                      <IconAlertCircle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-0.5">
                        <div className="font-bold text-amber-950 dark:text-amber-300">Live Outbid Detected</div>
                        <p className="text-[11px] text-amber-800 dark:text-amber-200">{outbidAlert.message}</p>
                      </div>
                    </div>
                  )}

                  {/* Desired Key Slot Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Keycap Slot <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {targetSlot ? `Key [${targetSlot}] selected` : "e.g. K, ESC, CMD, SPACE"}
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="e.g. K, ESC, CMD, SPACE"
                      value={keySlot}
                      onChange={(e) => {
                        setKeySlot(e.target.value.toUpperCase());
                        if (outbidAlert) setOutbidAlert(null);
                      }}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-2 text-xs sm:text-sm font-mono font-bold uppercase text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Bid Amount Input & Quick Bid Increments */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Your Bid Amount (USD) <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                        Min next: <strong className="text-blue-600 dark:text-blue-400">${effectiveMinBid}</strong>
                      </span>
                    </div>

                    <div className="relative flex items-center rounded-xl border-2 border-blue-500 bg-zinc-50 dark:bg-zinc-900/60 shadow-xs px-3.5 py-2 transition-all">
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono font-medium text-base select-none pr-1.5">
                        $
                      </span>
                      <input
                        type="number"
                        min={effectiveMinBid}
                        value={bidAmount || ""}
                        onChange={(e) => {
                          setBidAmount(Math.max(0, parseInt(e.target.value, 10) || 0));
                          if (outbidAlert) setOutbidAlert(null);
                        }}
                        required
                        className="w-full bg-transparent font-mono text-lg font-bold text-zinc-950 dark:text-white outline-none"
                      />
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono text-xs uppercase select-none">
                        USD
                      </span>
                    </div>

                    {/* Quick Bid Increments */}
                    <div className="flex items-center gap-1.5 pt-2 flex-wrap">
                      <span className="text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500">Quick:</span>
                      {[effectiveMinBid, effectiveMinBid + 5, effectiveMinBid + 10, effectiveMinBid + 25].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setBidAmount(amt);
                            if (outbidAlert) setOutbidAlert(null);
                          }}
                          className={cn(
                            "px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer",
                            bidAmount === amt
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white border border-zinc-200/80 dark:border-white/5"
                          )}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2x2 Fields Grid: Sponsor Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Brand Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme, Supabase"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alerts@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Website URL <span className="text-zinc-400 dark:text-zinc-500 font-normal">(Optional · for backlink)</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://yourcompany.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Logo Upload Dropzone */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Decal Logo <span className="text-zinc-400 dark:text-zinc-500 font-normal">(Optional · PNG, SVG)</span>
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="relative border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-3 text-center cursor-pointer transition-colors bg-zinc-50/80 dark:bg-zinc-900/30 group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/svg+xml"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {logoPreview ? (
                        <div className="flex items-center justify-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-9 h-9 object-contain rounded-lg border border-zinc-200 dark:border-zinc-700 p-1 bg-white dark:bg-zinc-800 shadow-xs"
                          />
                          <div className="text-left">
                            <p className="text-xs font-semibold text-zinc-900 dark:text-white">Custom logo attached</p>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLogoPreview(null);
                                setLogoUrl(null);
                              }}
                              className="text-[11px] text-red-500 hover:underline font-medium cursor-pointer"
                            >
                              Remove logo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <IconUpload size={16} />
                          <span className="text-xs font-semibold">Upload vector / high-res logo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 100% Outbid Refund Guarantee */}
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-[11px] text-blue-900 dark:text-blue-300 flex items-start gap-2">
                    <IconRotate size={15} className="shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <span>
                      <strong>Automatic Refund Guarantee:</strong> If another sponsor outbids you before round close, your full ${bidAmount} will be refunded automatically to your payment method.
                    </span>
                  </div>

                  {/* Terms Agreement Checkbox */}
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-black/30 border border-zinc-200/80 dark:border-white/10">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-700 dark:text-zinc-300 leading-tight">
                      <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        required
                        className="mt-0.5 h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>
                        I agree to the{" "}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setTermsModalOpen(true);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                        >
                          365-day placement rules
                        </button>{" "}
                        and automated refund policy.
                      </span>
                    </label>
                  </div>

                  {/* Footer Action: Pay & Lock In Key */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-white/10 space-y-2">
                    <div className={cn(
                      "p-[2px] w-full rounded-md transition-all duration-200 ease-out shadow-xs",
                      canSubmit ? "bg-blue-600/20" : "bg-zinc-200/50 dark:bg-zinc-800/50"
                    )}>
                      <button
                        type="submit"
                        disabled={!canSubmit}
                        className={cn(
                          "w-full py-3.5 px-6 rounded-[6px] font-bold tracking-wider text-xs sm:text-sm text-white transition-all flex items-center justify-center gap-2",
                          canSubmit
                            ? "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 cursor-pointer shadow-[0_4px_16px_rgba(37,99,235,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_rgba(0,0,0,0.1)]"
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-300/60 dark:border-white/5 cursor-not-allowed"
                        )}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Preparing Secure Checkout…</span>
                          </>
                        ) : (
                          <span>Pay ${bidAmount} USD</span>
                        )}
                      </button>
                    </div>

                    {!canSubmit && !isSubmitting && (
                      <p className="text-[10px] text-center text-zinc-400 dark:text-zinc-500">
                        {!targetSlot
                          ? "Please specify a keycap slot"
                          : !brandName.trim()
                            ? "Please enter your brand name"
                            : !email.includes("@")
                              ? "Please enter a valid email address"
                              : !isBidAmountValid
                                ? `Bid must be at least $${effectiveMinBid}`
                                : !termsAgreed
                                  ? "Please agree to the placement rules"
                                  : ""}
                      </p>
                    )}

                    <p className="text-[11px] text-center text-zinc-500 dark:text-zinc-400 font-mono">
                      Encrypted checkout · Immediate confirmation recorded
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Terms & Conditions Overlay */}
      <TermsModal
        key="outbid-terms-modal"
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </>,
    document.body
  );
}
