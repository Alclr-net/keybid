"use client";

import React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { IconX, IconShieldCheck, IconAlertTriangle, IconCreditCard, IconExternalLink } from "@tabler/icons-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-white dark:bg-[#12141a] text-zinc-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-300 dark:border-white/10 z-10 my-auto max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <IconShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="font-display text-base sm:text-lg font-bold">Terms</h3>
                  <p className="text-[11px] font-mono text-zinc-500">Placement, Payment & Non-Refundable Agreement</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Close"
              >
                <IconX size={18} />
              </button>
            </div>

            {/* Scrollable Terms Content */}
            <div className="overflow-y-auto py-4 space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pr-1">
              {/* Critical Rule Callout: All Payments Final */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-950 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  <IconAlertTriangle size={15} />
                  All Bid Payments Are Final
                </div>
                <p className="text-xs leading-relaxed">
                  Once payment is confirmed as captured, it is <strong>non-refundable under any circumstance</strong>, including being outbid immediately after payment, losing your position at any later time, or changing your mind.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <IconShieldCheck size={15} className="text-blue-500" />
                  1. The Service & Placement Slot
                </h4>
                <p>
                  Each accepted payment purchases a bidding position on a Key on our virtual keyboard representing a claimed company/startup. The highest bidder holds that position, logo display, and outbound link until outbid. The service offers <strong>no ownership interest, equity, cash return, or deposit/holding fee</strong>.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <IconCreditCard size={15} className="text-emerald-500" />
                  2. Payments and Continuous Bidding
                </h4>
                <p>
                  Bids are one-time payments processed through Dodo Payments. A bid is valid only after successful payment capture. There is no fixed end time — positions can be challenged and outbid at any time, indefinitely.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900 dark:text-white">3. Technical Error Exception</h4>
                <p>
                  If a payment is captured by Dodo Payments but, due to a technical error on our end, is not reflected as a bid on our platform, contact us on X (
                  <a
                    href="https://x.com/seth_rachit_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    @seth_rachit_
                  </a>
                  ) with your payment reference. Confirmed technical errors will be refunded for that specific transaction only.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900 dark:text-white">4. Submissions & Content</h4>
                <p>
                  You confirm you control or are authorized to represent the submitted company or URL. We reserve the right to remove listings that are illegal, unsafe, deceptive, or noncompliant without entitlement to a refund.
                </p>
              </div>

              <div className="pt-1">
                <Link
                  href="/terms"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Read complete Terms and Conditions document</span>
                  <IconExternalLink size={13} />
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-zinc-500 font-mono">Protected by Dodo Payments Security</span>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm cursor-pointer"
              >
                I Understand & Agree
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
