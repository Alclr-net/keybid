import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  IconArrowLeft,
  IconGavel,
  IconKey,
  IconCoin,
  IconChecklist,
  IconLayoutGrid,
  IconClockPlay,
  IconExternalLink,
  IconBrandX,
  IconAlertTriangle,
  IconInfoCircle,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Rules — KeyBid",
  description:
    "Official auction rules and bidding guidelines for KeyBid — the hardware keyboard advertising board.",
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

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
}

function Section({ title, icon, iconBg, children }: SectionProps) {
  return (
    <section className="bg-white dark:bg-zinc-900/70 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-zinc-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
        >
          {icon}
        </div>
        <h2 className="font-display text-lg sm:text-xl font-bold text-zinc-950 dark:text-white pt-0.5">
          {title}
        </h2>
      </div>
      <div className="text-sm text-zinc-600 dark:text-zinc-300 space-y-3.5 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function InfoCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed flex items-start gap-3">
      <IconInfoCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

function WarnCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 text-sm text-amber-950 dark:text-amber-200 leading-relaxed flex items-start gap-3">
      <IconAlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

export default function RulesPage() {
  return (
    <div className="min-h-screen w-full bg-[#fafafa] dark:bg-[#090a0f] text-zinc-900 dark:text-white py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="pb-8 border-b border-zinc-200 dark:border-white/10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold">
            <IconGavel size={14} />
            <span>Auction Rules</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            KeyBid Rules
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            KeyBid is a public bidding board mapped to a physical Apple Magic Keyboard. There are no ads,
            no API keys, and no revenue share. You pay to hold a Key slot above everyone else. Rank is what
            you pay nothing else.
          </p>
        </div>

        {/* Rules Content Sections */}
        <div className="space-y-6">
          {/* 1. The Keys */}
          <Section
            title="The Keys"
            icon={<IconKey className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
            iconBg="bg-indigo-500/10 dark:bg-indigo-500/20"
          >
            <p>
              Each Key is a single slot on the keyboard. There is no separate &ldquo;Today&rdquo; or &ldquo;Daily&rdquo;
              board and a Key&rsquo;s position and hardware decal are held by whoever has the current highest
              confirmed bid on that specific Key, for as long as that bid stands.
            </p>
            <InfoCallout>
              Every keycap is represented both virtually on the interactive board and physically via UV-printed
              decals on the daily driver Apple Magic Keyboard.
            </InfoCallout>
          </Section>

          {/* 2. How Bidding Works */}
          <Section
            title="How Bidding Works"
            icon={<IconCoin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            iconBg="bg-emerald-500/10 dark:bg-emerald-500/20"
          >
            <ul className="space-y-2.5 list-disc list-inside">
              <li>
                <strong className="text-zinc-900 dark:text-white">Starting Bid:</strong> New Key bids start at{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">$10 USD</span> minimum,
                in whole dollars, up to a maximum of $10,000,000 USD.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Outbidding:</strong> Taking a Key that is already
                claimed costs at least <span className="font-semibold text-emerald-600 dark:text-emerald-400">$1 USD more</span>{" "}
                than the current highest confirmed bid on that Key.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Low &amp; Equal Bids Rejected:</strong> Paying less than or
                equal to the current highest bid does not claim the Key. The checkout system automatically validates the
                bid atomically and rejects insufficient amounts outright.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Equal Bids:</strong> The earlier confirmed bid keeps
                the higher rank; a later equal bid is rejected and cannot take the slot.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Raising Your Bid:</strong> KeyBid requires no account or
                login. Each bid is an independent transaction processed for the full bid amount. If you wish to raise your
                own bid to protect your slot, submit a new bid with your new target amount.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Pay-What-You-Want:</strong> KeyBid operates on an open
                PWYW auction model above the floor. You decide what your visibility is worth. Any bid can be outbid at any
                moment by another bidder meeting the increment.
              </li>
            </ul>
          </Section>

          {/* 3. What You Can List */}
          <Section
            title="What You Can List"
            icon={<IconChecklist className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            iconBg="bg-blue-500/10 dark:bg-blue-500/20"
          >
            <ul className="space-y-2.5 list-disc list-inside">
              <li>
                <strong className="text-zinc-900 dark:text-white">Allowed Destinations:</strong> A direct product website,
                SaaS application, startup landing page, personal portfolio, or an X (Twitter) profile URL
                (<code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">https://x.com/handle</code>).
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">No Chat &amp; Invite Links:</strong> Telegram, WhatsApp,
                Discord, Messenger, Signal, or similar group invite links are prohibited. KeyBid is for products, businesses,
                and profiles, not private chat groups.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">No Adult or Illegal Content:</strong> Pornography, NSFW
                content, gambling, illegal activities, or scam sites are strictly banned. Violating listings are removed
                immediately with no refund.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">No Link Shorteners:</strong> URLs from shortening services
                (e.g., bit.ly, tinyurl, t.co) are rejected. You must provide your actual canonical destination domain.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Clean URLs:</strong> Destination URLs are stripped of
                tracking query parameters, UTM tags, and affiliate links before public display.
              </li>
            </ul>
          </Section>

          {/* 4. Key Selection */}
          <Section
            title="Key Selection &amp; Placement"
            icon={<IconLayoutGrid className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            iconBg="bg-purple-500/10 dark:bg-purple-500/20"
          >
            <p>
              KeyBid does not use arbitrary categories. Listings are mapped directly to physical keys on the
              Apple Magic Keyboard (such as individual letters A–Z, numbers 0–9, or modifier keys).
            </p>
            <p>
              You choose the exact key you want your brand to occupy during the bid process. If you notice an issue
              or need support regarding your slot, reach out directly to support.
            </p>
          </Section>

          {/* 5. After You Pay */}
          <Section
            title="After You Pay"
            icon={<IconClockPlay className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            iconBg="bg-amber-500/10 dark:bg-amber-500/20"
          >
            <ul className="space-y-2.5 list-disc list-inside">
              <li>
                <strong className="text-zinc-900 dark:text-white">Immediate Live Display:</strong> Your listing is public
                immediately once your payment is confirmed by Dodo Payments and registered by our webhook.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Confirmed Payments Only:</strong> Initiating checkout or
                viewing a payment form does not reserve a Key. The Key is awarded strictly to the first transaction confirmed
                by the payment gateway.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Non-Refundable:</strong> All payments buy the moment of
                placement and immediate exposure, not a guaranteed duration. All bids are non-refundable, as set out in
                our <Link href="/terms" className="text-blue-600 dark:text-blue-400 underline font-medium">Terms of Service</Link>.
              </li>
            </ul>

            <WarnCallout>
              Paying means you agree to the terms of service. Listed websites must maintain valid, verifiable details identifying who is responsible for the product.
              These Rules operate alongside the Terms of Service; in the event of any conflict, the Terms of Service govern.
            </WarnCallout>
          </Section>

          {/* Contact Section */}
          <section className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-100/70 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-base sm:text-lg">
              <IconBrandX size={18} />
              <span>Questions or Inquiries?</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              For questions about these Rules or your key placement, contact{" "}
              <a
                href="mailto:support@keybid.lol"
                className="underline font-semibold text-zinc-900 dark:text-white hover:text-blue-600"
              >
                support@keybid.lol
              </a>{" "}
              or message Rachit Seth on X: <XLink />.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
            KeyBid &copy; {new Date().getFullYear()}
          </span>
          <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
            <Link href="/faq" className="hover:underline">
              /faq
            </Link>
            <Link href="/privacy" className="hover:underline">
              /privacy
            </Link>
            <Link href="/rules" className="hover:underline font-semibold text-zinc-600 dark:text-zinc-300">
              /rules
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
