"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import axios from "axios";
import {
  IconX,
  IconCheck,
  IconAlertCircle,
  IconWorld,
} from "@tabler/icons-react";
import type { Key } from "@/types/database";
import { useKeysStore } from "@/lib/store/keysStore";
import { cn } from "@/src/lib/utils";
import { extractValidDomain, getFaviconProviders } from "@/lib/constant";
import TermsModal from "@/src/components/TermsModal";

export type OutbidTarget = Key;

interface OutbidModalProps {
  company: OutbidTarget | any | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (bidAmount: number, createdCompany?: any, createdKey?: Key) => void;
  initialKeySlot?: string;
  initialBrandName?: string;
  initialsubmitted_url?: string;
  initialLogo?: string;
}

declare global {
  interface Window {
    Cashfree?: (config?: { mode?: "sandbox" | "production" }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: "_self" | "_modal" | "_blank" | "_top";
      }) => Promise<{ error?: { message: string }; paymentDetails?: unknown }>;
    };
  }
}

const CASHFREE_MODE: "sandbox" | "production" =
  process.env.NEXT_PUBLIC_CASHFREE_ENV === "production" ? "production" : "sandbox";

/** Only allow well-formed http(s) URLs — blocks javascript:, data:, etc. */
function safesubmitted_urlUrl(raw: string): string | null {
  const domain = extractValidDomain(raw);
  if (!domain) return null;
  const withScheme = raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
  try {
    const parsed = new URL(withScheme);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export default function OutbidModal({
  company,
  isOpen,
  onClose,
  onSuccess,
  initialKeySlot,
  initialBrandName,
  initialsubmitted_url,
  initialLogo,
}: OutbidModalProps) {
  const [mounted, setMounted] = useState(false);
  const storeKeys = useKeysStore((state) => state.keys);
  const updateStoreKey = useKeysStore((state) => state.updateKey);

  const getKeyBid = (k: Key | any | null): number =>
    typeof k?.current_bid_amount === "number" ? k.current_bid_amount : 0;

  const getKeySlot = (k: Key | any | null): string => {
    if (!k) return "";
    if (typeof k.key_slot === "string" && k.key_slot) return k.key_slot.trim().toUpperCase();
    if (typeof k.brand_name === "string" && k.brand_name.trim().length === 1) return k.brand_name.trim().toUpperCase();
    if (typeof k.submitted_url === "string" && k.submitted_url) {
      try {
        const domain = k.submitted_url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].split(":")[0];
        const firstChar = domain.match(/[a-zA-Z0-9]/)?.[0]?.toUpperCase();
        if (firstChar) return firstChar;
      } catch { /* ignore */ }
    }
    if (typeof k.id === "string" && k.id && k.id.length <= 10) return k.id;
    return "";
  };

  const getKeyName = (k: Key | any | null): string => {
    if (!k) return "";
    if (typeof k.brand_name === "string" && k.brand_name) return k.brand_name;
    return "";
  };

  const getKeyLogo = (k: Key | any | null): string => (typeof k?.key_logo === "string" ? k.key_logo : "");
  const getKeyUrl = (k: Key | any | null): string => (typeof k?.submitted_url === "string" ? k.submitted_url : "");
  const getKeyTagline = (k: Key | any | null): string => (typeof k?.about === "string" ? k.about : "");

  const [keySlot, setKeySlot] = useState((company ? getKeySlot(company) : "") || initialKeySlot || "");

  const rawBase = Number(process.env.NEXT_PUBLIC_BASE_PRICE || 10);
  const BASE_PRICE = !isNaN(rawBase) && rawBase > 0 ? rawBase : 10;

  const targetSlot = keySlot.trim().toUpperCase();

  const activeKey: Key | null = React.useMemo(() => {
    if (company?.id) {
      const match = storeKeys.find((k) => k.id === company.id);
      if (match) return match;
    }
    if (targetSlot) {
      const match = storeKeys.find(
        (k) => k.key_slot?.trim().toUpperCase() === targetSlot || k.brand_name?.trim().toUpperCase() === targetSlot
      );
      if (match) return match;
    }
    return (company as Key) || null;
  }, [storeKeys, targetSlot, company]);

  const currentHighest = activeKey ? getKeyBid(activeKey) : 0;
  const minBid = currentHighest > 0 ? Math.max(BASE_PRICE, currentHighest + 1) : BASE_PRICE;

  const [outbidAlert, setOutbidAlert] = useState<{ highestBid: number; minNext: number; message: string } | null>(null);
  const effectiveMinBid = outbidAlert ? outbidAlert.minNext : minBid;
  const [bidAmount, setBidAmount] = useState<number>(effectiveMinBid);
  const [brandName, setBrandName] = useState("");
  const [submitted_url, setsubmitted_url] = useState("");
  const [logoStatus, setLogoStatus] = useState<"idle" | "loading" | "found" | "error">("idle");
  const [autoLogo, setAutoLogo] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<{
    keySlot: string;
    bidAmount: number;
    brandName: string;
    order_id: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load Cashfree checkout SDK once
  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("cashfree-sdk")) {
      const script = document.createElement("script");
      script.id = "cashfree-sdk";
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const resolveCompany = useCallback((domain: string) => {
    const providers = getFaviconProviders(domain);
    if (providers.length === 0) {
      setAutoLogo(null);
      setLogoStatus("error");
      return;
    }
    setLogoStatus("loading");

    const loadImage = (url: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject();
        img.src = url;
      });

    (async () => {
      for (const providerUrl of providers) {
        try {
          const img = await loadImage(providerUrl);
          if (img.naturalWidth > 16 && img.naturalHeight > 16) {
            setAutoLogo(providerUrl);
            setLogoStatus("found");
            return;
          }
        } catch { /* try next provider */ }
      }
      setAutoLogo(null);
      setLogoStatus("error");
    })();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const domain = extractValidDomain(submitted_url);
    if (!domain) {
      setAutoLogo(null);
      setLogoStatus("idle");
      return;
    }
    debounceRef.current = setTimeout(() => resolveCompany(domain), 450);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [submitted_url, resolveCompany]);

  useEffect(() => {
    if (!isOpen) return;

    const slot = (company ? getKeySlot(company) : "") || initialKeySlot || "";
    setKeySlot(slot);

    const target = slot.trim().toUpperCase();
    const liveKey =
      (company?.id ? storeKeys.find((k) => k.id === company.id) : null) ||
      (target
        ? storeKeys.find((k) => k.key_slot?.trim().toUpperCase() === target || k.brand_name?.trim().toUpperCase() === target)
        : null) ||
      (company as Key | null);

    const keyBid = getKeyBid(liveKey);
    setBidAmount(keyBid > 0 ? Math.max(BASE_PRICE, keyBid + 1) : BASE_PRICE);
    setBrandName(initialBrandName || "");
    setsubmitted_url(initialsubmitted_url || "");

    if (initialLogo) {
      setAutoLogo(initialLogo);
      setLogoStatus("found");
    } else {
      setAutoLogo(null);
      const domain = initialsubmitted_url ? extractValidDomain(initialsubmitted_url) : null;
      if (domain) resolveCompany(domain);
      else setLogoStatus("idle");
    }

    setTermsAgreed(false);
    setIsSubmitting(false);
    setOutbidAlert(null);
    setPaymentSuccess(null);
  }, [company, isOpen, initialKeySlot, initialBrandName, initialsubmitted_url, initialLogo, storeKeys, BASE_PRICE, resolveCompany]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !termsModalOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, termsModalOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isBidAmountValid =
    Number.isFinite(bidAmount) && Number.isInteger(bidAmount) && bidAmount >= effectiveMinBid && bidAmount < 1_000_000;

  const canSubmit =
    !isSubmitting && termsAgreed && isBidAmountValid && brandName.trim().length > 0 && targetSlot.length > 0;

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setOutbidAlert(null);

    try {
      const trimmedsubmitted_url = submitted_url.trim();
      let sanitizedsubmitted_url = "";
      let effectiveIconUrl = autoLogo;

      if (trimmedsubmitted_url) {
        const safeUrl = safesubmitted_urlUrl(trimmedsubmitted_url);
        if (!safeUrl) {
          alert("Please enter a valid submitted_url URL (e.g. https://yourcompany.com)");
          setIsSubmitting(false);
          return;
        }
        sanitizedsubmitted_url = safeUrl;
        if (!effectiveIconUrl) {
          const domain = extractValidDomain(sanitizedsubmitted_url)!;
          effectiveIconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
        }
      }

      // Create order server-side (does outbid check + Cashfree PGCreateOrder)
      const orderRes = await axios.post(
        "/api/payments/create-order",
        {
          keySlot: targetSlot,
          bidAmount,
          brandName: brandName.trim(),
          submitted_url: sanitizedsubmitted_url,
          iconUrl: effectiveIconUrl,
          lastSeenHighestBid: currentHighest,
        },
        { validateStatus: (status) => status < 500 }
      );

      const orderData = orderRes.data;

      if (orderRes.status === 409 || orderData?.code === "OUTBID") {
        const nextMin = orderData?.minimumNextBid || Math.max(BASE_PRICE, currentHighest + 1);
        setOutbidAlert({
          highestBid: orderData?.currentHighestBid || currentHighest,
          minNext: nextMin,
          message: orderData?.error || `This key was just outbid at $${orderData?.currentHighestBid}.`,
        });
        setBidAmount(nextMin);
        setIsSubmitting(false);
        return;
      }

      if (orderRes.status >= 400 || !orderData?.success) {
        throw new Error(orderData?.error || "Failed to generate payment order");
      }

      const { order_id, payment_session_id } = orderData;
      if (!order_id || !payment_session_id) {
        throw new Error("Order was not created correctly — missing session details");
      }

      if (typeof window.Cashfree !== "function") {
        throw new Error("Payment system is still loading — please try again in a moment.");
      }

      const cashfree = window.Cashfree({ mode: CASHFREE_MODE });

      const result = await cashfree.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget: "_modal",
      });

      if (result?.error) {
        // User closed the modal or payment failed — not a hard error
        setIsSubmitting(false);
        return;
      }

      await completePaymentVerification({
        order_id,
        resolvedsubmitted_url: sanitizedsubmitted_url,
        resolvedIconUrl: effectiveIconUrl,
      });
    } catch (err: unknown) {
      const e = err as { message?: string };
      console.error(err);
      setIsSubmitting(false);
      alert(e?.message || "An error occurred while preparing your payment.");
    }
  };

  const completePaymentVerification = async ({
    order_id,
    resolvedsubmitted_url,
    resolvedIconUrl,
  }: {
    order_id: string;
    resolvedsubmitted_url?: string;
    resolvedIconUrl?: string | null;
  }) => {
    try {
      const verifyRes = await axios.post(
        "/api/payments/verify",
        { order_id },
        { validateStatus: (status) => status < 500 }
      );

      const verifyData = verifyRes.data;
      if (verifyRes.status >= 400 || !verifyData?.success) {
        throw new Error(verifyData?.error || "Payment verification failed on server");
      }

      setPaymentSuccess({
        keySlot: targetSlot,
        bidAmount,
        brandName: brandName.trim(),
        order_id,
      });

      const updatedKey: Key = {
        id: activeKey?.id || (company && "id" in company ? company.id : `key_${Date.now()}`),
        submitted_url: resolvedsubmitted_url || getKeyUrl(activeKey) || "",
        key_slot: targetSlot,
        brand_name: brandName.trim() || activeKey?.brand_name || null,
        about: getKeyTagline(activeKey) || `Winning bid by ${brandName.trim()}`,
        key_logo: resolvedIconUrl || getKeyLogo(activeKey) || null,
        current_bid_id: `bid_${order_id}`,
        click_count: activeKey?.click_count || 0,
        current_bid_amount: bidAmount,
        created_at: activeKey?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      updateStoreKey(updatedKey.id, updatedKey);
      onSuccess?.(bidAmount, undefined, updatedKey);
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
          <div key="outbid-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              key="outbid-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              key="outbid-dialog-card"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[500px] max-h-[90vh] overflow-y-auto bg-white dark:bg-[#121316] text-zinc-900 dark:text-white rounded-[26px] sm:rounded-[28px] p-5 sm:p-7 shadow-2xl border border-zinc-200/90 dark:border-white/10 z-10 my-auto transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer z-10"
                title="Close modal"
                type="button"
              >
                <IconX size={18} />
              </button>

              {paymentSuccess ? (
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
                      <span>Order ID:</span>
                      <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[180px]">{paymentSuccess.order_id}</span>
                    </div>
                  </div>
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
                <form onSubmit={handleInitiatePayment} className="space-y-4">
                  <div>
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-2",
                        currentHighest > 0
                          ? "bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400"
                          : "bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400"
                      )}
                    >
                      {currentHighest > 0 ? "Outbid Current Holder" : targetSlot ? `Bid on Key [${targetSlot}]` : "Claim an Open Key"}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                      {targetSlot ? `Key ${targetSlot}` : "Claim Your Keycap"}
                    </h2>
                    {currentHighest > 0 ? (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                        Current leading bid <strong className="font-bold text-zinc-950 dark:text-white">${currentHighest}</strong>
                        {getKeyName(activeKey) ? ` by ${getKeyName(activeKey)}` : ""}
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        No active bids on this slot · Minimum starting bid <strong className="font-bold text-blue-600 dark:text-blue-400">${BASE_PRICE}</strong>
                      </p>
                    )}
                  </div>

                  {outbidAlert && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/15 border-2 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5 shadow-xs">
                      <IconAlertCircle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-0.5">
                        <div className="font-bold text-amber-950 dark:text-amber-300">Live Outbid Detected</div>
                        <p className="text-[11px] text-amber-800 dark:text-amber-200">{outbidAlert.message}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Keycap Slot</label>
                    <div className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-100/80 dark:bg-zinc-800/50 px-3.5 py-2.5 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-mono font-bold text-zinc-900 dark:text-white truncate">{targetSlot}</span>
                    </div>
                  </div>

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
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono font-medium text-base select-none pr-1.5">$</span>
                      <input
                        type="number"
                        min={effectiveMinBid}
                        step={1}
                        value={bidAmount || ""}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setBidAmount(Number.isFinite(val) ? Math.max(0, val) : 0);
                          if (outbidAlert) setOutbidAlert(null);
                        }}
                        required
                        className="w-full bg-transparent font-mono text-lg font-bold text-zinc-950 dark:text-white outline-none"
                      />
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono text-xs uppercase select-none">USD</span>
                    </div>
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

                  <div className="flex-col justify-center items-center gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        submitted_url <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex w-10 h-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200/90 dark:border-zinc-700 bg-white dark:bg-zinc-800/90 shadow-xs transition-all overflow-hidden select-none">
                          {logoStatus === "loading" ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600 dark:border-zinc-700 dark:border-t-blue-400" />
                          ) : logoStatus === "found" && autoLogo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={autoLogo} alt="submitted_url logo" className="w-full h-full object-contain p-1.5" />
                          ) : logoStatus === "error" ? (
                            <IconAlertCircle size={18} className="text-amber-500" title="Logo not found" />
                          ) : (
                            <IconWorld size={18} className="text-zinc-400 dark:text-zinc-500" />
                          )}
                        </div>
                        <input
                          type="url"
                          placeholder="https://yourcompany.com"
                          value={submitted_url}
                          onChange={(e) => setsubmitted_url(e.target.value)}
                          className="flex-1 min-w-0 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 transition-colors h-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Brand Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={80}
                        placeholder="Enter Your Brand Name"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 transition-colors h-10"
                      />
                    </div>
                  </div>

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
                          Terms &amp; Conditions
                        </button>{" "}
                        and understand that all bid payments are final.
                      </span>
                    </label>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-white/10 space-y-2">
                    <div className={cn("p-[2px] w-full rounded-md transition-all duration-200 ease-out shadow-xs", canSubmit ? "bg-blue-600/20" : "bg-zinc-200/50 dark:bg-zinc-800/50")}>
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
                          <span>Proceed</span>
                        )}
                      </button>
                    </div>
                    {!canSubmit && !isSubmitting && (
                      <p className="text-[10px] text-center text-zinc-400 dark:text-zinc-500">
                        {!targetSlot
                          ? "Please specify a keycap slot"
                          : !brandName.trim()
                            ? "Please enter your brand name"
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

      <TermsModal key="outbid-terms-modal" isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
    </>,
    document.body
  );
}