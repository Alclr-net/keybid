"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import axios from "axios";
import { toast } from "sonner";
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
import { Placeholder } from "./Placeholder";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";

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

// ── client_token storage helpers ──
// The token proves ownership of a pending order to the verify endpoint.
// Stored keyed by order_id so multiple in-flight orders (rare, but possible
// across tabs) don't clobber each other.
const TOKEN_STORAGE_PREFIX = "keybid_client_token_";

function storeClientToken(orderId: string, token: string) {
  try {
    sessionStorage.setItem(`${TOKEN_STORAGE_PREFIX}${orderId}`, token);
  } catch {
    // sessionStorage unavailable (private mode, etc.) — verification will
    // fail server-side with a clear error instead of silently proceeding.
  }
}

function readClientToken(orderId: string): string | null {
  try {
    return sessionStorage.getItem(`${TOKEN_STORAGE_PREFIX}${orderId}`);
  } catch {
    return null;
  }
}

function clearClientToken(orderId: string) {
  try {
    sessionStorage.removeItem(`${TOKEN_STORAGE_PREFIX}${orderId}`);
  } catch {
    /* ignore */
  }
}

// Frontend/backend limit must match /api/create-checkout exactly.
const MAX_BID_AMOUNT = 10_000_000;

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

  const [about, setAbout] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<{
    keySlot: string;
    bidAmount: number;
    brandName: string;
    order_id: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
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

    setAbout("");
    setTermsAgreed(false);
    setIsSubmitting(false);
    setOutbidAlert(null);
    setPaymentSuccess(null);
    setVerifyError(null);
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
    Number.isFinite(bidAmount) && Number.isInteger(bidAmount) && bidAmount >= effectiveMinBid && bidAmount < MAX_BID_AMOUNT;

  // HIGH-02: submitted_url is now required — without it the server cannot process the order
  const isUrlValid = submitted_url.trim().length > 0;

  const MIN_ABOUT_CHARS = 20;
  const isAboutValid = about.trim().length >= MIN_ABOUT_CHARS;

  const canSubmit =
    !isSubmitting &&
    termsAgreed &&
    isBidAmountValid &&
    brandName.trim().length > 0 &&
    targetSlot.length > 0 &&
    isUrlValid &&
    isAboutValid;

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
          toast.error("Please enter a valid website URL (e.g. https://yourcompany.com).");
          setIsSubmitting(false);
          return;
        }
        sanitizedsubmitted_url = safeUrl;
        if (!effectiveIconUrl) {
          const domain = extractValidDomain(sanitizedsubmitted_url)!;
          effectiveIconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
        }
      }

      // Create checkout session server-side with Dodo Payments
      const orderRes = await axios.post(
        "/api/create-checkout",
        {
          keySlot: targetSlot,
          bidAmount,
          brandName: brandName.trim(),
          submitted_url: sanitizedsubmitted_url,
          iconUrl: effectiveIconUrl,
          lastSeenHighestBid: currentHighest,
          about: about.trim(),
        },
        { validateStatus: (status) => status < 500 }
      );

      const orderData = orderRes.data;
      if (orderRes.status === 409 || orderData?.code === "OUTBID") {
        const nextMin = orderData?.minimumNextBid || Math.max(BASE_PRICE, currentHighest + 1);
        const outbidMsg = orderData?.error || `This key was just outbid. Minimum bid is now $${nextMin}.`;
        setOutbidAlert({
          highestBid: orderData?.currentHighestBid || currentHighest,
          minNext: nextMin,
          message: outbidMsg,
        });
        toast.warning(outbidMsg);
        setBidAmount(nextMin);
        setIsSubmitting(false);
        return;
      }

      if (orderRes.status >= 400 || !orderData?.success) {
        throw new Error(orderData?.error || "Failed to generate payment order");
      }

      const { checkout_url, order_id, client_token } = orderData;
      if (!checkout_url || !order_id) {
        throw new Error("Order was not created correctly — missing checkout URL or order id");
      }

      // Persist the ownership token so the verify step (after redirect back
      // from Dodo) can prove this browser created this order. Without this,
      // /api/payments/verify has no way to distinguish this customer's
      // order from anyone else's guessable order_id.
      if (client_token) {
        storeClientToken(order_id, client_token);
      } else {
        console.warn("[checkout] No client_token returned — verification may fail.");
      }

      toast.loading("Redirecting to secure checkout...");

      // Redirect to Dodo hosted checkout page
      window.location.href = checkout_url;
    } catch (err: unknown) {
      const e = err as { message?: string };
      console.error(err);
      setIsSubmitting(false);
      toast.error(e?.message || "An error occurred while preparing checkout.");
    }
  };

  // NOTE: This function remains here in case something in the future needs
  // to trigger verification directly from the modal. In the current flow,
  // verification after returning from Dodo checkout is handled entirely by
  // the dedicated /payments/verify page (which has its own Suspense
  // boundary around useSearchParams) — not by this modal. Do not re-add a
  // useSearchParams-based auto-trigger here; that previously broke the
  // /auction page's static build because this modal has no Suspense
  // boundary of its own.
  const completePaymentVerification = useCallback(
    async ({
      order_id,
      resolvedsubmitted_url,
      resolvedIconUrl,
      resolvedBidAmount,
      resolvedBrandName,
      resolvedKeySlot,
    }: {
      order_id: string;
      resolvedsubmitted_url?: string;
      resolvedIconUrl?: string | null;
      resolvedBidAmount?: number;
      resolvedBrandName?: string;
      resolvedKeySlot?: string;
    }) => {
      setIsVerifying(true);
      setVerifyError(null);

      try {
        const clientToken = readClientToken(order_id);

        if (!clientToken) {
          throw new Error(
            "We couldn't find your payment session in this browser. If you completed payment, please contact support with your order ID."
          );
        }

        const verifyRes = await axios.post(
          "/api/payments/verify",
          { order_id, client_token: clientToken },
          { validateStatus: (status) => status < 500 }
        );

        const verifyData = verifyRes.data;
        if (verifyRes.status >= 400 || !verifyData?.success) {
          throw new Error(verifyData?.error || "Payment verification failed on server");
        }

        const finalBidAmount = resolvedBidAmount ?? bidAmount;
        const finalBrandName = (resolvedBrandName ?? brandName).trim();
        const finalKeySlot = resolvedKeySlot ?? targetSlot;

        setPaymentSuccess({
          keySlot: finalKeySlot,
          bidAmount: finalBidAmount,
          brandName: finalBrandName,
          order_id,
        });

        const updatedKey: Key = {
          id: activeKey?.id || (company && "id" in company ? company.id : `key_${Date.now()}`),
          submitted_url: resolvedsubmitted_url || getKeyUrl(activeKey) || "",
          key_slot: finalKeySlot,
          brand_name: finalBrandName || activeKey?.brand_name || null,
          about: getKeyTagline(activeKey) || `Winning bid by ${finalBrandName}`,
          key_logo: resolvedIconUrl || getKeyLogo(activeKey) || null,
          current_bid_id: `bid_${order_id}`,
          click_count: activeKey?.click_count || 0,
          current_bid_amount: finalBidAmount,
          created_at: activeKey?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        updateStoreKey(updatedKey.id, updatedKey);
        onSuccess?.(finalBidAmount, undefined, updatedKey);
        toast.success("Payment verified! Your bid is now live.");

        // Token has served its purpose — clear it so it can't be reused/leaked.
        clearClientToken(order_id);
      } catch (err: unknown) {
        const e = err as { message?: string };
        const msg = e?.message || "Payment verification failed.";
        setVerifyError(msg);
        toast.error(msg);
      } finally {
        setIsSubmitting(false);
        setIsVerifying(false);
      }
    },
    [activeKey, bidAmount, brandName, company, onSuccess, targetSlot, updateStoreKey]
  );

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <div key="outbid-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
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
              className="relative w-full max-w-[460px] max-h-[90dvh] sm:max-h-[88vh] overflow-y-auto bg-white dark:bg-[#121316] text-zinc-900 dark:text-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 shadow-2xl border border-zinc-200/90 dark:border-white/10 z-10 my-auto transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer z-10"
                title="Close modal"
                type="button"
              >
                <IconX size={16} />
              </button>

              {isVerifying ? (
                <div className="py-8 text-center space-y-3">
                  <span className="inline-block h-7 w-7 border-2 border-zinc-300 border-t-blue-600 dark:border-zinc-700 dark:border-t-blue-400 rounded-full animate-spin" />
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Verifying your payment…</p>
                </div>
              ) : verifyError ? (
                <div className="py-5 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border-2 border-red-500/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto text-xl">
                    <IconAlertCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-950 dark:text-white">Verification Issue</h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
                      {verifyError}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Close
                  </button>
                </div>
              ) : paymentSuccess ? (
                <div className="py-3 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                    <IconCheck size={26} stroke={2.5} />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold font-mono uppercase tracking-wider mb-1">
                      Payment Confirmed · Verified Bid
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                      Key [{paymentSuccess.keySlot}] is Now Yours!
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 max-w-xs mx-auto leading-relaxed">
                      Congratulations, <strong className="text-zinc-950 dark:text-white">{paymentSuccess.brandName}</strong>. Your bid has been recorded on the live auction ledger.
                    </p>
                  </div>
                  <div className="rounded-xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 p-3 text-xs font-mono space-y-1.5 text-left">
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
                      <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[160px]">{paymentSuccess.order_id}</span>
                    </div>
                  </div>
                  <div className="p-[2px] w-full rounded-md transition-all duration-200 ease-out shadow-xs bg-blue-600/20">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-3 px-4 rounded-[6px] font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white transition-all text-center cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]"
                    >
                      Done & Return to Keyboard
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInitiatePayment} className="space-y-3">
                  <Placeholder>
                    {currentHighest > 0 ? (
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                        Current leading bid <strong className="font-bold text-zinc-950 dark:text-white">${currentHighest}</strong>
                        {getKeyName(activeKey) ? ` by ${getKeyName(activeKey)}` : ""}
                      </p>
                    ) : (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        No active bids on this slot
                      </p>
                    )}
                  </Placeholder>

                  {outbidAlert && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2 shadow-xs">
                      <IconAlertCircle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-0.5">
                        <div className="font-bold text-amber-950 dark:text-amber-300">Live Outbid Detected</div>
                        <p className="text-[11px] text-amber-800 dark:text-amber-200">{outbidAlert.message}</p>
                      </div>
                    </div>
                  )}

                  <Field>
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Key Slot</label>
                    <div className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-100/80 dark:bg-zinc-800/50 px-3 py-2 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white truncate">{targetSlot}</span>
                    </div>
                  </Field>

                  <Field>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                        Your Bid Amount<span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                        Min: <strong className="text-blue-600 dark:text-blue-400">${effectiveMinBid}</strong>
                      </span>
                    </div>
                    <div className="relative flex items-center rounded-lg border-2 border-blue-500 bg-zinc-50 dark:bg-zinc-900/60 shadow-xs px-3 py-1.5 transition-all">
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono font-medium text-sm select-none pr-1">$</span>
                      <input
                        type="number"
                        min={effectiveMinBid}
                        max={MAX_BID_AMOUNT}
                        step={1}
                        value={bidAmount || ""}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setBidAmount(Number.isFinite(val) ? Math.max(0, val) : 0);
                          if (outbidAlert) setOutbidAlert(null);
                        }}
                        required
                        className="w-full bg-transparent font-mono text-base sm:text-sm font-bold text-zinc-950 dark:text-white outline-none"
                      />
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono text-[10px] uppercase select-none">USD</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">

                      {[effectiveMinBid, effectiveMinBid + 5, effectiveMinBid + 10, effectiveMinBid + 25].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setBidAmount(amt);
                            if (outbidAlert) setOutbidAlert(null);
                          }}
                          className={cn(
                            "px-2 py-0.5 min-h-[26px] rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center",
                            bidAmount === amt
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white border border-zinc-200/80 dark:border-white/5"
                          )}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <div className="space-y-2.5">
                    <Field>
                      <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Company Website URL <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex w-9 h-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200/90 dark:border-zinc-700 bg-white dark:bg-zinc-800/90 shadow-xs transition-all overflow-hidden select-none">
                          {logoStatus === "loading" ? (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600 dark:border-zinc-700 dark:border-t-blue-400" />
                          ) : logoStatus === "found" && autoLogo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={autoLogo} alt="submitted_url logo" className="w-full h-full object-contain p-1" />
                          ) : logoStatus === "error" ? (
                            <IconAlertCircle size={16} className="text-amber-500" title="Logo not found" />
                          ) : (
                            <IconWorld size={16} className="text-zinc-400 dark:text-zinc-500" />
                          )}
                        </div>
                        <input
                          type="url"
                          placeholder="https://yourcompany.com"
                          value={submitted_url}
                          onChange={(e) => setsubmitted_url(e.target.value)}
                          required
                          aria-label="Company website URL (required)"
                          className="flex-1 min-w-0 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-1.5 text-base sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 transition-colors h-9"
                        />
                      </div>
                    </Field>

                    <Field>
                      <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Brand Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={80}
                        placeholder="Enter Your Brand Name"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-1.5 text-base sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 transition-colors h-9"
                      />
                    </Field>

                    <Field>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <span className={`text-[10px] font-mono transition-colors ${about.trim().length >= 20
                          ? "text-emerald-500 dark:text-emerald-400"
                          : "text-zinc-400 dark:text-zinc-500"
                          }`}>
                          {about.trim().length}/500
                          {about.trim().length < 20 && ` · ${20 - about.trim().length} more`}
                        </span>
                      </div>
                      <Textarea
                        value={about}
                        onChange={(e) => setAbout(e.target.value.slice(0, 500))}
                        required
                        minLength={20}
                        maxLength={500}
                        rows={3}
                        placeholder="Tell us about your brand — what you do, what you make, or why you're claiming this key…"
                        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-2 text-base sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors resize-none leading-relaxed min-h-0"
                      />
                    </Field>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-black/30 border border-zinc-200/80 dark:border-white/10 flex items-start gap-2">
                    <Checkbox
                      id="terms-checkbox"
                      checked={termsAgreed}
                      onCheckedChange={(checked) => setTermsAgreed(checked === true)}
                      required
                      className="mt-0.5 h-3.5 w-3.5 rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label
                      htmlFor="terms-checkbox"
                      className="cursor-pointer text-[11px] text-zinc-700 dark:text-zinc-300 leading-tight"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setTermsModalOpen(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                      >
                        Accept terms &amp; conditions
                      </button>
                    </label>
                  </div>

                  <div className="pt-1.5 border-t border-zinc-100 dark:border-white/10 space-y-1.5">
                    <div className={cn("p-[2px] w-full rounded-md transition-all duration-200 ease-out shadow-xs", canSubmit ? "bg-blue-600/20" : "bg-zinc-200/50 dark:bg-zinc-800/50")}>
                      <button
                        type="submit"
                        disabled={!canSubmit}
                        className={cn(
                          "w-full py-3 px-5 rounded-[6px] font-bold tracking-wider text-xs sm:text-sm text-white transition-all flex items-center justify-center gap-2",
                          canSubmit
                            ? "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 cursor-pointer shadow-[0_4px_16px_rgba(37,99,235,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_rgba(0,0,0,0.1)]"
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-300/60 dark:border-white/5 cursor-not-allowed"
                        )}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Preparing Secure Checkout…</span>
                          </>
                        ) : (
                          <span>Proceed</span>
                        )}
                      </button>
                    </div>


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