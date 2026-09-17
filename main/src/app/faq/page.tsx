import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  IconHelpCircle,
  IconExternalLink,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "FAQ — KeyBid",
  description:
    "Frequently asked questions about KeyBid — how the auction works, pricing rules, hardware placement, and guidelines.",
};

function XLink() {
  return (
    <a
      href="https://x.com/seth_rachit_"
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
    >
      @seth_rachit_
      <IconExternalLink size={12} />
    </a>
  );
}

interface FaqCardProps {
  question: string;
  children: React.ReactNode;
}

function FaqCard({ question, children }: FaqCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900/70 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-zinc-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
      <h3 className="font-display text-base sm:text-lg font-bold text-zinc-950 dark:text-white leading-snug">
        {question}
      </h3>
      <div className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed space-y-2.5">
        {children}
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen w-full bg-[#fafafa] dark:bg-[#090a0f] text-zinc-900 dark:text-white py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-8 border-b border-zinc-200 dark:border-white/10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold">
            <IconHelpCircle size={14} />
            <span>Frequently Asked Questions</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Questions &amp; Answers
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Everything you need to know about the KeyBid live bidding board, hardware key placement, and auction rules.
            The{" "}
            <Link href="/rules" className="text-blue-600 dark:text-blue-400 underline font-semibold">
              Rules
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="text-blue-600 dark:text-blue-400 underline font-semibold">
              Terms of Service
            </Link>{" "}
            serve as the official source of truth if anything conflicts.
          </p>
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          <FaqCard question="What is keybid.lol?">
            <p>
              KeyBid is a public website bidding board mapped directly to a physical Apple Magic Keyboard.
              You submit a product website or X (Twitter) profile, pay a bid amount, and hold that key slot above
              competitors. Every confirmed winning bid is also physically UV-printed onto the creator&rsquo;s daily-driver
              hardware keyboard.
            </p>
          </FaqCard>

          <FaqCard question="How does keybid.lol work?">
            <p>
              Enter your product URL or X profile link, choose your preferred keycap on the keyboard, and complete
              checkout via Dodo Payments. The moment payment confirms, your brand, logo, and clean link go live immediately.
            </p>
            <p>
              Bids start at a <strong>$10 USD minimum</strong>. Taking an already-claimed key costs at least{" "}
              <strong>$1 USD more</strong> than the current bid. Bids less than or equal to the current bid are rejected.
            </p>
          </FaqCard>

          <FaqCard question="How much does it cost to bid on a Key?">
            <p>
              All bids are priced in whole <strong>USD ($)</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Starting Bid Floor:</strong> $10 USD minimum.</li>
              <li><strong>Outbid Increment:</strong> At least $1 USD more than the current highest bid.</li>
              <li><strong>Maximum Bid:</strong> $10,000,000 USD.</li>
            </ul>
            <p>
              Above the floor, KeyBid is pay-what-you-want: you choose how much visibility is worth to you and how high you want to set the barrier for competitors.
            </p>
          </FaqCard>

          <FaqCard question="How do I take a Key that's already claimed?">
            <p>
              Submit a bid on that specific Key that is at least <strong>$1 USD higher</strong> than the current bid amount.
              Once your payment confirms through Dodo Payments and is recorded in our database, your listing replaces the previous holder immediately.
            </p>
          </FaqCard>

          <FaqCard question="Are there multiple boards, like 'Today' or 'All-time'?">
            <p>
              No. There are no time-sliced boards or daily resets. Each key on the physical keyboard is a single persistent slot held by whoever holds the highest confirmed bid on that key, for as long as that bid stands.
            </p>
          </FaqCard>

          <FaqCard question="Can I raise my bid after I've already paid?">
            <p>
              Yes. If you already hold a Key and want to deter competitors, simply submit a new bid on that Key for your new target amount.
              Because KeyBid does not use user accounts, each bid is an independent transaction processed for the full bid amount.
            </p>
          </FaqCard>

          <FaqCard question="Are payments on keybid.lol refundable?">
            <p>
              No. All payments are final and non-refundable. Each payment purchases immediate live placement and visibility at that moment in time;
              it does not purchase a guaranteed duration. Being outbid later, receiving fewer clicks than anticipated, or having a listing removed for
              violating content guidelines does not create a refund. See our{" "}
              <Link href="/terms" className="text-blue-600 dark:text-blue-400 underline font-semibold">
                Terms of Service
              </Link>{" "}
              for complete policy details.
            </p>
          </FaqCard>

          <FaqCard question="What can I list on keybid.lol?">
            <p>
              You can list a product website, SaaS landing page, portfolio, or an X (Twitter) profile (
              <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">https://x.com/yourhandle</code>)
              that you own or are authorized to represent.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Prohibited:</strong> Telegram, WhatsApp, Discord, Signal, and group chat invite links.</li>
              <li><strong>Prohibited:</strong> Pornography, adult/NSFW content, gambling, scam operations, or illegal services.</li>
              <li><strong>Prohibited:</strong> Link shorteners (bit.ly, tinyurl, t.co) — only canonical domains are accepted.</li>
              <li><strong>Clean URLs:</strong> Tracking parameters and UTM queries are stripped so clicks go cleanly to your destination.</li>
            </ul>
            <p>
              All listed websites must display valid, verifiable details identifying who is responsible for the site.
            </p>
          </FaqCard>

          <FaqCard question="How do categories work on keybid.lol?">
            <p>
              KeyBid does not use arbitrary software categories (like &ldquo;AI&rdquo; or &ldquo;Dev Tools&rdquo;).
              Instead, the board is organized by the physical keys of an Apple Magic Keyboard (letters A–Z, numbers 0–9, modifier keys, Space, etc.).
              You choose the exact key that fits your brand — such as your company&rsquo;s initial or favorite shortcut.
            </p>
          </FaqCard>

          <FaqCard question="How do I pay for a bid?">
            <p>
              Checkout runs securely through <strong>Dodo Payments</strong>, our Merchant of Record. Dodo Payments accepts major
              credit/debit cards and international payment methods. KeyBid never collects or stores your credit card or billing information.
            </p>
          </FaqCard>

          <FaqCard question="Do Key positions expire?">
            <p>
              No. Positions never expire on a timer. Your listing stays on the virtual board and physical keyboard until another bidder outbids your amount.
            </p>
          </FaqCard>

          <FaqCard question="What happens if someone else pays while I'm checking out?">
            <p>
              When you initiate checkout, KeyBid creates a temporary 15-minute hold on the slot. The Key is officially awarded to the first
              payment confirmed by Dodo Payments and registered in the database. If someone outbids the slot before your checkout starts,
              the system alerts you immediately with the new minimum bid required.
            </p>
          </FaqCard>

          <FaqCard question="Who created keybid.lol?">
            <p>
              KeyBid was created by <strong>Rachit Seth</strong>, a design engineer and indie builder based in India.
              You can follow the hardware build and contact him directly on X: <XLink />.
            </p>
          </FaqCard>

          <FaqCard question="How is keybid.lol different from other directories?">
            <p>
              KeyBid physically connects digital sponsorships to real hardware decals on an Apple Magic Keyboard.
              There are no upvote syndicates, algorithm biases, review backlogs, or recurring subscriptions placement is 100% determined by transparent public bidding.
            </p>
          </FaqCard>

          <FaqCard question="How do I contact support or report a listing?">
            <p>
              Email{" "}
              <a href="mailto:support@keybid.lol" className="underline font-semibold text-zinc-900 dark:text-white hover:text-blue-600">
                support@keybid.lol
              </a>{" "}
              or send a direct message to <XLink /> on X for listing disputes, technical support, or inquiries.
            </p>
          </FaqCard>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
            KeyBid &copy; {new Date().getFullYear()}
          </span>
          <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
            <Link href="/faq" className="hover:underline font-semibold text-zinc-600 dark:text-zinc-300">
              /faq
            </Link>
            <Link href="/rules" className="hover:underline">
              /rules
            </Link>
            <Link href="/privacy" className="hover:underline">
              /privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              /terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
