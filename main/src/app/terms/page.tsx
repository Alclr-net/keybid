import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  IconArrowLeft,
  IconShieldCheck,
  IconAlertTriangle,
  IconCreditCard,
  IconScale,
  IconExternalLink,
  IconFileText,
  IconBrandX,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Terms and Conditions — KeyBid",
  description:
    "Official Terms and Conditions for placing bids, online placements, payments, and final non-refundable rules on KeyBid.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full bg-[#fafafa] dark:bg-[#090a0f] text-zinc-900 dark:text-white py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Back */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <IconArrowLeft size={16} />
            <span>Back</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="pb-8 border-b border-zinc-200 dark:border-white/10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold shadow-2xs">
            <IconFileText size={14} />
            <span>Legal Agreement</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Terms and Conditions
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono pt-1">
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">
              Effective: 9 Sep 2026
            </span>

            <span>Platform Agreement</span>
          </div>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed pt-2">
            By placing a bid or making a payment on our platform, you agree to the placement, payment, and refund rules described here.
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="py-10 space-y-10">
          {/* 1. The Service */}
          <section className="bg-white dark:bg-zinc-900/70 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <IconShieldCheck size={20} />
              </div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-zinc-950 dark:text-white">
                1. The Service
              </h2>
            </div>

            <div className="text-sm text-zinc-600 dark:text-zinc-300 space-y-3.5 leading-relaxed">
              <p>
                Each accepted payment purchases online placement on KeyBid: the highest-bid position on a Key, along with the associated logo display and outbound link, for as long as that position is not exceeded by a later payment. Every accepted payment receives the placement described at checkout, subject to these Terms. The service offers no ownership interest, equity, cash return, or cash-equivalent reward.
              </p>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 space-y-2">
                <p>
                  KeyBid does not guarantee impressions, traffic, clicks, leads, engagement, conversions, sales, revenue, return on spend, position duration, or permanent placement.
                </p>
                <p>
                  Positions can change immediately when another payment for a higher bid completes, a payment is refunded, reversed, or disputed, or a listing is removed under these Terms. Losing your position to a later, higher bid does not constitute a failure to deliver the placement you paid for, and does not entitle you to a refund.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Payments and Bidding */}
          <section className="bg-white dark:bg-zinc-900/70 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <IconCreditCard size={20} />
              </div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-zinc-950 dark:text-white">
                2. Payments and Bidding
              </h2>
            </div>

            <div className="text-sm text-zinc-600 dark:text-zinc-300 space-y-3.5 leading-relaxed">
              <p>
                All bids are one-time payments processed through Razorpay. KeyBid is the seller of the placement; Razorpay is the payment processor only and is not the merchant of record.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                <li>
                  A bid is only valid once payment is confirmed as successfully captured.
                </li>
                <li>
                  The amount required to place a valid bid on a Key is shown at checkout and must exceed the current highest bid (or the listed starting price, if no bid exists yet) by the minimum required amount.
                </li>
                <li>
                  There is no fixed end time to bidding on any Key — a position may be outbid at any time, indefinitely.
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Refunds */}
          <section className="bg-white dark:bg-zinc-900/70 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <IconAlertTriangle size={20} />
              </div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-zinc-950 dark:text-white">
                3. Refunds
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-950 dark:text-amber-200 text-sm leading-relaxed">
                <strong className="block font-bold text-amber-800 dark:text-amber-300 mb-1">
                  All bid payments are final.
                </strong>
                Once your payment is confirmed as captured, it is non-refundable under any circumstance, including but not limited to being outbid immediately after payment, losing your position at any later time, or changing your mind after payment.
              </div>

              <div className="text-sm text-zinc-600 dark:text-zinc-300 space-y-3 leading-relaxed">
                <div className="p-4 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20">
                  <p className="font-semibold text-zinc-950 dark:text-white mb-1">
                    Technical Error Exception:
                  </p>
                  <p>
                    If a payment is captured by Razorpay but, due to a technical error on our end, is not correctly reflected as a bid on the Platform, contact us on X (
                    <a
                      href="https://x.com/seth_rachit_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      @seth_rachit_
                      <IconExternalLink size={12} />
                    </a>
                    ) with your payment reference. We will investigate and, if confirmed as an error on our part, issue a refund for that specific transaction only.
                  </p>
                </div>

                <p>
                  If a payment is refunded, reversed, or disputed for any reason, the corresponding bid is removed and the Key reverts to its next-highest valid bid (or to unclaimed status if none exists).
                </p>
              </div>
            </div>
          </section>

          {/* 4. Your Submission */}
          <section className="bg-white dark:bg-zinc-900/70 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <IconExternalLink size={20} />
              </div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-zinc-950 dark:text-white">
                4. Your Submission
              </h2>
            </div>

            <div className="text-sm text-zinc-600 dark:text-zinc-300 space-y-3.5 leading-relaxed">
              <p>
                You confirm that you control, or are authorized to represent, the company, product, or URL you submit, and that your submission complies with these Terms and any published rules. You grant KeyBid permission to fetch and display public metadata from your submitted URL (such as title, description, and logo/favicon) as part of your listing.
              </p>
              <p>
                We may normalize a submitted URL, refresh its metadata, or remove a listing that is illegal, unsafe, deceptive, unavailable, impersonating, or otherwise noncompliant. Removal for a policy violation does not entitle you to a refund.
              </p>
            </div>
          </section>

          {/* 5. Availability and Liability */}
          <section className="bg-white dark:bg-zinc-900/70 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 flex items-center justify-center shrink-0">
                <IconScale size={20} />
              </div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-zinc-950 dark:text-white">
                5. Availability and Liability
              </h2>
            </div>

            <div className="text-sm text-zinc-600 dark:text-zinc-300 space-y-3.5 leading-relaxed">
              <p>
                The service is provided on an as-available basis and may be changed, interrupted, or discontinued at any time. To the maximum extent permitted by law, KeyBid is not liable for indirect or consequential losses, lost traffic, lost revenue, changes in bid position, being outbid, third-party website content, or any outcome dependent on visitor behavior.
              </p>
              <p className="font-medium text-zinc-800 dark:text-zinc-200">
                You bid entirely at your own discretion and accept full responsibility for that decision.
              </p>
            </div>
          </section>

          {/* 6. Changes */}
          <section className="bg-white dark:bg-zinc-900/70 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-bold text-zinc-950 dark:text-white">
              6. Changes
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              These Terms are effective as of <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">[Insert Date]</span>. Continued use of the Platform after an update means you accept the revised Terms, but an update will not retroactively change the position already secured by a completed payment at the time it was made.
            </p>
          </section>

          {/* 7. Contact */}
          <section className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-100/70 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-base sm:text-lg">
              <IconBrandX size={18} />
              <span>Contact &amp; Refund Inquiries</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              For questions about these Terms, technical payment discrepancies, or refund investigations, direct message Rachit Seth on X:{" "}
              <a
                href="https://x.com/seth_rachit_"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                @seth_rachit_
                <IconExternalLink size={13} />
              </a>
              .
            </p>
          </section>
        </div>

        {/* Footer Back Link */}
        <div className="pt-8 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
            KeyBid © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
}
