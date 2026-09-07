"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { IconX, IconCheck, IconLock } from "@tabler/icons-react";
import { Company } from "@/app/data/keybidData";
import { cn } from "@/lib/utils";

interface OutbidModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (bidAmount: number, createdCompany?: Company) => void;
  initialKeySlot?: string;
  initialBrandName?: string;
  initialWebsite?: string;
  initialLogo?: string;
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
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const minBid = company ? Math.max(10, company.bid + 1) : 10;
  const [bidAmount, setBidAmount] = useState<number>(minBid);
  const [keySlot, setKeySlot] = useState(company?.keySlot || initialKeySlot || "");
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Synchronize initial bid and values when company or isOpen changes
  useEffect(() => {
    if (!isOpen) return;

    if (company) {
      setBidAmount(Math.max(10, company.bid + 1));
      setKeySlot(company.keySlot);
    } else {
      setBidAmount(10);
      setKeySlot(initialKeySlot || "");
    }
    setBrandName(initialBrandName || "");
    setEmail("");
    setWebsite(initialWebsite || "");
    setLogoPreview(initialLogo || null);
    setSubmitted(false);
    setSubmitting(false);
  }, [company, isOpen, initialKeySlot, initialBrandName, initialWebsite, initialLogo]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

  const deposit = Math.round(bidAmount * 0.2);
  const remaining = Math.max(0, bidAmount - deposit);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount < minBid) return;
    const targetSlot = (company ? company.keySlot : keySlot).trim().toUpperCase();
    if (!targetSlot) return;

    onClose();
    router.push(
      `/bid/${encodeURIComponent(targetSlot)}?amount=${bidAmount}&brand=${encodeURIComponent(
        brandName
      )}&url=${encodeURIComponent(website)}`
    );
  };

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[480px] bg-white dark:bg-[#121316] text-zinc-900 dark:text-white rounded-[26px] sm:rounded-[28px] p-6 sm:p-7 shadow-2xl border border-zinc-200/90 dark:border-white/10 z-10 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Close modal"
              type="button"
            >
              <IconX size={18} />
            </button>

            {submitted ? (
              /* Success confirmation state */
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                  <IconCheck size={28} stroke={2.5} />
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  {company ? "Bid Placed!" : "Key Claimed!"}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
                  Your bid of <strong className="font-bold text-zinc-950 dark:text-white">${bidAmount}</strong> for Key &apos;{company ? company.keySlot : keySlot || "Open Key"}&apos; was registered.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Header Information */}
                <div>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-2",
                    company
                      ? "bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400"
                      : "bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400"
                  )}>
                    {company ? "Outbid Current Holder" : keySlot ? `Bid on Key ${keySlot}` : "Claim an Open Key"}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                    {company ? `Spot ${company.keySlot} · Keycap` : keySlot ? `Key ${keySlot} · Keycap` : "Claim Your Keycap"}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    1.8 × 1.8 cm
                  </p>
                  {company && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      Current bid <strong className="font-bold text-zinc-950 dark:text-white">${company.bid}</strong> by {company.name}
                    </p>
                  )}
                </div>

                {/* Desired Key Slot Input (When claiming a new key) */}
                {!company && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                      Desired Key Slot <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="e.g. K, ESC, CMD, SPACE"
                      value={keySlot}
                      onChange={(e) => setKeySlot(e.target.value.toUpperCase())}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 px-3 py-2 text-xs sm:text-sm font-mono font-bold uppercase text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-blue-500 transition-colors"
                    />
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                      Specify the keyboard key you want to claim
                    </div>
                  </div>
                )}

                {/* Bid Amount Input */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                    Your bid (USD)
                  </label>
                  <div className="relative flex items-center rounded-xl border-2 border-blue-500 bg-white dark:bg-zinc-900/60 shadow-xs px-3.5 py-2.5 transition-all">
                    <input
                      type="number"
                      min={minBid}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Math.max(0, parseInt(e.target.value) || 0))}
                      required
                      className="w-full bg-transparent font-mono text-base font-semibold text-zinc-950 dark:text-white outline-none"
                    />
                    <span className="text-zinc-400 dark:text-zinc-500 font-mono font-medium text-base select-none pl-2">
                      $
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                    Minimum ${minBid}
                  </div>
                </div>


                {/* 2x2 Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                      Brand name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Brand Name"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@handle.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      placeholder="https://@yourhandle.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Logo Upload Dropzone */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                    Logo
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-colors bg-zinc-50/50 dark:bg-zinc-900/30 group"
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
                          className="w-12 h-12 object-contain rounded-lg border border-zinc-200 dark:border-zinc-700 p-1 bg-white dark:bg-zinc-800 shadow-xs"
                        />
                        <div className="text-left">
                          <p className="text-xs font-semibold text-zinc-900 dark:text-white">Logo selected</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLogoPreview(null);
                            }}
                            className="text-[11px] text-red-500 hover:underline font-medium"
                          >
                            Remove logo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                          Upload your logo
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-zinc-100 dark:border-white/10 space-y-2">
                  <button
                    type="submit"
                    disabled={bidAmount < minBid || (!company && !keySlot.trim())}
                    className={cn(
                      "w-full py-3.5 px-6 rounded-xl font-black  tracking-widest text-xs sm:text-sm text-white transition-all shadow-md cursor-pointer flex items-center justify-center gap-2",
                      "shadow-[0_4px_16px_rgba(37,99,235,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.25)]  active:scale-[0.98]",
                      "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
                      "active:scale-[0.99]",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >

                    <span>Proceed ${bidAmount}</span>
                  </button>

                  <p className="text-[11px] text-center text-zinc-500 dark:text-zinc-400 font-normal">
                    Secure 256-bit encrypted checkout via Razorpay
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
