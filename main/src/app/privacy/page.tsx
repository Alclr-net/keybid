import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  IconShieldLock,
  IconUserCheck,
  IconDatabase,
  IconCookie,
  IconScale,
  IconWorld,
  IconShare,
  IconClock,
  IconUserExclamation,
  IconAlertTriangle,
  IconExternalLink,
  IconBrandX,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Privacy Policy — KeyBid",
  description:
    "Official Privacy Policy for KeyBid — how we collect, process, and protect your information.",
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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen w-full bg-[#fafafa] dark:bg-[#090a0f] text-zinc-900 dark:text-white py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-8 border-b border-zinc-200 dark:border-white/10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            <IconShieldLock size={14} />
            <span>Privacy Policy</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Privacy Policy
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono pt-1">
            <span className="px-2 py-1 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">
              Effective: 17th Sep 2026
            </span>
            <span className="px-2 py-1 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">
              Last Updated: 18th Sep 2026
            </span>
          </div>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed pt-2">
            This Privacy Policy explains how KeyBid (<a href="https://keybid.lol" className="underline hover:text-blue-600">https://keybid.lol</a>) collects,
            uses, and protects information when you visit the site, click a listing, or pay for a bid. It sits alongside our{" "}
            <Link href="/terms" className="text-blue-600 dark:text-blue-400 underline font-semibold">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/rules" className="text-blue-600 dark:text-blue-400 underline font-semibold">
              Auction Rules
            </Link>
            .
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* 1. Who Is Responsible */}
          <Section
            title="1. Who Is Responsible"
            icon={<IconUserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            iconBg="bg-blue-500/10 dark:bg-blue-500/20"
          >
            <p>
              The data controller for personal data processed through KeyBid is{" "}
              <strong className="text-zinc-900 dark:text-white">Rachit Seth</strong> (sole proprietor), based in India.
            </p>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:support@keybid.lol" className="underline text-blue-600 dark:text-blue-400">
                  support@keybid.lol
                </a>
              </li>
              <li>
                <strong>X (Twitter):</strong> <XLink />
              </li>
            </ul>
          </Section>

          {/* 2. What We Collect */}
          <Section
            title="2. What We Collect"
            icon={<IconDatabase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
            iconBg="bg-indigo-500/10 dark:bg-indigo-500/20"
          >
            <p>
              We believe in data minimization and collect only what is strictly necessary to operate the auction board,
              process payments, and prevent abuse:
            </p>
            <ul className="space-y-2.5 list-disc list-inside">
              <li>
                <strong className="text-zinc-900 dark:text-white">Checkout and Listing Data:</strong> When you place a bid,
                we collect the submitted URL, brand name, logo, short description, bid amount, and target keyboard key slot.
                Payment verification tokens and transaction IDs from Dodo Payments are stored to confirm placement.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Payment Information:</strong> Card details, billing address,
                and payment credentials are collected and processed directly by our payment processor,{" "}
                <strong className="text-zinc-900 dark:text-white">Dodo Payments</strong>. KeyBid never receives or stores your full credit card number or billing details.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Aggregated Click Metrics:</strong> When visitors click a key
                on the keyboard, we record only an aggregate click increment (<code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">click_count</code>).
                We do not track individual visitor identities, user profiles, or store personal IP addresses alongside clicks.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Technical Logs:</strong> Standard request data (IP address,
                browser user agent, referrer) may be temporarily processed by our cloud infrastructure providers (Vercel and Supabase)
                solely for network routing, security, and DDoS mitigation.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Direct Correspondence:</strong> If you contact us via email or X
                for support or dispute inquiries, we retain the conversation to assist you and maintain business records.
              </li>
            </ul>
          </Section>

          {/* 3. Cookies & Local Storage */}
          <Section
            title="3. Cookies and Local Storage"
            icon={<IconCookie className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            iconBg="bg-amber-500/10 dark:bg-amber-500/20"
          >
            <p>
              KeyBid does not use third-party tracking, advertising, or cross-site analytics cookies.
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong className="text-zinc-900 dark:text-white">Session Storage (Functional):</strong> During checkout,
                we temporarily store an unguessable verification token (<code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">client_token</code>)
                in your browser&rsquo;s <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">sessionStorage</code>.
                This links your active checkout tab to the payment verification endpoint to prevent order spoofing, and is deleted when the tab closes.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Local Storage (Preferences):</strong> Your browser stores
                your light/dark theme preference locally so the site displays in your chosen theme.
              </li>
            </ul>
          </Section>

          {/* 4. Why We Use This Data */}
          <Section
            title="4. Why We Process Your Data"
            icon={<IconScale className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            iconBg="bg-emerald-500/10 dark:bg-emerald-500/20"
          >
            <ul className="space-y-2.5 list-disc list-inside">
              <li>
                <strong className="text-zinc-900 dark:text-white">Contractual Performance:</strong> To process payments,
                verify bids, assign your listing to the requested keyboard slot, and display your brand publicly on the board.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Legitimate Interests:</strong> To maintain platform security,
                prevent bot spam and fraudulent bids, display live rankings, and resolve support requests.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Legal &amp; Tax Obligations:</strong> To maintain accounting
                records, transaction histories, and comply with applicable financial reporting laws.
              </li>
            </ul>
          </Section>

          {/* 5. Public Listings */}
          <Section
            title="5. Public Board Information"
            icon={<IconWorld className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
            iconBg="bg-cyan-500/10 dark:bg-cyan-500/20"
          >
            <p>
              KeyBid is an open public leaderboard. Information submitted for a keycap slot — including your brand name,
              logo, short description, destination URL, and confirmed bid amount — is publicly visible to all site visitors and search engines.
            </p>
            <p>
              When a listing is submitted, our servers may fetch open graph metadata (title, description, favicon) from the
              destination URL to render the keycap properly.
            </p>
          </Section>

          {/* 6. Who We Share Data With */}
          <Section
            title="6. Third-Party Service Providers"
            icon={<IconShare className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            iconBg="bg-purple-500/10 dark:bg-purple-500/20"
          >
            <p>We do not sell, rent, or trade your personal data. We share necessary operational data only with trusted providers:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong className="text-zinc-900 dark:text-white">Dodo Payments:</strong> Merchant of record and payment gateway handling checkout transactions and fraud prevention.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Supabase:</strong> Cloud database infrastructure for securely storing keys, bids, and order verification states.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">Vercel:</strong> Application hosting, edge network, and serverless compute infrastructure.
              </li>
            </ul>
          </Section>

          {/* 7. Data Retention */}
          <Section
            title="7. Data Retention"
            icon={<IconClock className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            iconBg="bg-amber-500/10 dark:bg-amber-500/20"
          >
            <p>
              Public key listings remain displayed as long as your bid holds the slot. When a slot is outbid, historical bid records
              and payment verification IDs are retained in database archives as necessary for accounting, tax compliance, and legal dispute defense.
            </p>
            <p>
              Temporary pending bid locks expire automatically after 15 minutes if payment is not completed.
            </p>
          </Section>

          {/* 8. Your Rights */}
          <Section
            title="8. Your Rights"
            icon={<IconUserExclamation className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            iconBg="bg-blue-500/10 dark:bg-blue-500/20"
          >
            <p>
              Under applicable data protection laws (including the GDPR and India&rsquo;s Digital Personal Data Protection Act),
              you have rights to request access to, rectification of, or deletion of personal data we hold about you.
            </p>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:support@keybid.lol" className="underline text-blue-600 dark:text-blue-400 font-semibold">
                support@keybid.lol
              </a>
              . Note that publicly visible data from your company website that you chose to place on the public board is governed by the Terms of Service.
            </p>
          </Section>

          {/* 9. Children's Privacy */}
          <Section
            title="9. Children&rsquo;s Privacy"
            icon={<IconAlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
            iconBg="bg-rose-500/10 dark:bg-rose-500/20"
          >
            <p>
              KeyBid is intended for adults, founders, and businesses. We do not knowingly collect personal information
              from children under the age of 18. If you believe a child has provided us with personal data, please contact us for prompt deletion.
            </p>
          </Section>

          {/* Contact Section */}
          <section className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-100/70 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-base sm:text-lg">
              <IconBrandX size={18} />
              <span>Contact &amp; Privacy Requests</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              If you have any questions about this Privacy Policy or wish to make a data request, please email{" "}
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
            <Link href="/privacy" className="hover:underline font-semibold text-zinc-600 dark:text-zinc-300">
              /privacy
            </Link>
            <Link href="/rules" className="hover:underline">
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
