"use client";

import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { IconX, IconShieldCheck, IconClock, IconRotateCcw, IconPrinter } from "@tabler/icons-react";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
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
                  <h3 className="font-display text-base sm:text-lg font-bold">KeyBid Auction Rules & Terms</h3>
                  <p className="text-[11px] font-mono text-zinc-500">Official Placement & Refund Agreement</p>
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
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <IconRotateCcw size={14} />
                  1. Automatic Outbid Refund Guarantee
                </div>
                <p className="text-xs">
                  If another sponsor places a higher qualifying bid on your key before the round closes, your payment is <strong>automatically refunded in full (100%)</strong> to your original payment method via Razorpay within <strong>5–7 business days</strong>. No manual claim or ticket is required.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <IconPrinter size={15} className="text-blue-500" />
                  2. Physical Hardware Placement
                </h4>
                <p>
                  Each winning keycap decal is precision UV-cured directly onto genuine Apple anodized aluminum and matte polycarbonate keycaps on the creator&apos;s daily-driver Apple Magic Keyboard. Placement is guaranteed for a minimum of 365 calendar days.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <IconClock size={15} className="text-blue-500" />
                  3. Bidding Rules & Floor
                </h4>
                <p>
                  The minimum starting bid for every keyboard key is <strong>$10 USD</strong>. Each subsequent bid must exceed the current highest bid by at least $1.00 USD. Bids are finalized upon successful payment confirmation.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900 dark:text-white">4. Brand & Content Standards</h4>
                <p>
                  Every logo is hand-inspected before physical UV printing. Logos must represent legitimate projects, brands, or open-source software. Submissions containing illegal, hateful, malicious, or deceptive content will be rejected and refunded immediately.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900 dark:text-white">5. Live Traffic & SEO Backlink</h4>
                <p>
                  Winning sponsors receive a verified, permanent sponsor card with live backlink indexing on Keybid for the duration of the hardware placement. Real-time click metrics are tracked transparently.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-zinc-500 font-mono">Protected by Razorpay Security</span>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm cursor-pointer"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
