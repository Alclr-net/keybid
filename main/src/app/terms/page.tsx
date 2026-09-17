
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
  IconUser,
  IconKey,
  IconLock,
  IconCircleCheck,
  IconBan,
  IconTrash,
  IconPhoto,
  IconMail,
  IconStar,
  IconHandStop,
  IconWorldWww,
  IconAdjustments,
} from "@tabler/icons-react";
import { Placeholder } from "@/src/components/Placeholder";

export const metadata: Metadata = {
  title: "Terms and Conditions — KeyBid",
  description:
    "Official Terms and Conditions governing access to and use of KeyBid — the paid public bidding board for startup keyboard slots.",
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
  number: string;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
}

function Section({ number, title, icon, iconBg, children }: SectionProps) {
  return (
    <section
      id={`block-${number}`}
      className="bg-white dark:bg-zinc-900/70 rounded-2xl sm:rounded-3xl p-4.5 sm:p-8 border border-zinc-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 scroll-mt-20"
    >
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
    <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
      {children}
    </div>
  );
}

function WarnCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
      {children}
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full bg-[#fafafa] dark:bg-[#090a0f] text-zinc-900 dark:text-white py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">



        {/* Header */}
        <div className="pb-8 border-b border-zinc-200 dark:border-white/10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold">
            <IconFileText size={14} />
            <span>Agreement</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Terms and Conditions
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono pt-1">
            <span className="px-1 py-1 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">
              Effective: <Placeholder>17th sep 2026</Placeholder>
            </span>
            <span className="px-1 py-1 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">
              Last Updated: <Placeholder>9th sep 2026</Placeholder>
            </span>
          </div>
        </div>
        {/* Blocks */}
        <div className="py-10 space-y-6">

          <Section number="1" title="Operator and Contact" icon={<IconUser size={20} />} iconBg="bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <p>
              The Service is operated by{" "}
              <Placeholder>Rachit Seth</Placeholder>, based in{" "}
              <Placeholder>New Delhi, India</Placeholder>.

            </p>
            <p>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">Public contact:</span>{" "}
              <XLink /> on X
            </p>
          </Section>

          <Section number="2" title="What the Service Is?" icon={<IconKey size={20} />} iconBg="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <p>
              KeyBid is a paid public bidding board. You may pay to claim a &ldquo;Key&rdquo; — a slot
              displaying a brand name, submitted URL, and logo — at whatever bid amount currently holds that
              slot. <strong className="text-zinc-800 dark:text-zinc-200">Listings are paid placements, not editorial reviews, certifications, endorsements, or independent rankings.</strong>
            </p>
            <InfoCallout>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">What a payment buys — and what it does not:</p>
              <p className="mb-2">
                A payment buys the chance to occupy a Key slot at the position that amount can take{" "}
                <em>at the time the payment is confirmed and written to the board.</em> It does{" "}
                <strong>not</strong> buy traffic, clicks, customers, revenue, exclusive placement, a fixed
                duration at a specific position, search-engine ranking, or any particular result.
              </p>
              <p>
                Someone else can pay more and take your slot at any time — bidding on a Key has no fixed
                end time. We may change, pause, or discontinue features, including specific Keys,
                categories, or the bidding mechanism itself.
              </p>
            </InfoCallout>
          </Section>

          <Section number="3" title="Eligibility" icon={<IconCircleCheck size={20} />} iconBg="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ul className="list-disc pl-5 space-y-2">
              <li>You must be at least 18 years old and able to form a binding contract.</li>
              <li>
                If you bid on behalf of a company, you represent that you have authority to bind that
                company, and &ldquo;you&rdquo; includes that company.
              </li>
              <li>
                You may not use the Service if you are prohibited from receiving services under the laws
                of India or another applicable jurisdiction, including trade or export sanctions.
              </li>
            </ul>
          </Section>

          <Section number="4" title="Payments and the No-Refund Waiver" icon={<IconCreditCard size={20} />} iconBg="bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <p>
              Checkout is processed by <strong className="text-zinc-800 dark:text-zinc-200">Dodo Payments</strong>.
              We do not collect or store full card numbers. Dodo Payments&rsquo; own terms and privacy notice
              also apply to the payment itself. Amounts are priced in{" "}
              <Placeholder>$15 taxes inclusive </Placeholder> and applicable taxes may be added at checkout.
            </p>
            <p>
              Bid minimums, increments, and any &ldquo;pay only the difference to outbid&rdquo; pricing are shown
              before you pay. Completing checkout is an offer to buy the bid placement on those terms. The bid
              is assigned when payment is confirmed and written to the bids table, at whatever position that
              amount then supports.
            </p>
            <WarnCallout>
              <strong className="block font-bold text-amber-800 dark:text-amber-300 mb-1">
                All payments are final and non-refundable.
              </strong>
              Bid placement is a digital service that begins as soon as payment is confirmed — the Key record
              is created or updated and the paid amount is immediately reflected on the public board. Being
              outbid later, fewer clicks than you hoped for, downtime, or removal for breach of these Terms
              does not create a refund right.
            </WarnCallout>
            <p>
              By completing checkout, you expressly request that we begin this digital service immediately,
              and you acknowledge that you thereby lose any statutory right of withdrawal or cooling-off
              period, to the extent such a waiver is permitted by law. Where a mandatory consumer-protection
              right cannot be waived, that right still applies and controls over this clause.
            </p>
            <InfoCallout>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Technical Error Exception:</p>
              <p>
                If a payment is captured by Dodo Payments but, due to a technical error on our end, is not
                correctly reflected as a bid on the platform, contact us at <XLink /> with your payment
                reference within <Placeholder> 48 hours </Placeholder> of the transaction. If
                confirmed as our error, we will issue a refund for that specific transaction only.
              </p>
            </InfoCallout>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/5">
              <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Chargebacks:</p>
              <p>
                Chargebacks, payment disputes, or reversed payments made without a legally required basis are
                a breach of these Terms. We may remove the associated listing and refuse future use of the
                Service to that user, in addition to any recovery rights we have against reversed amounts and
                fees.
              </p>
            </div>
          </Section>

          <Section number="5" title="Listings Must Have Valid, Verifiable Details" icon={<IconWorldWww size={20} />} iconBg="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <p>
              You may only submit a URL you own or are authorized to represent. The live destination site must
              display valid, current details identifying who is legally responsible for it — a legal/brand name
              and, where applicable law requires it, contact information.
            </p>
            <WarnCallout>
              Details that are missing, fake, incomplete, impersonating another party, or that we cannot
              reasonably verify are grounds for removal at any time, <strong>without refund</strong>.
            </WarnCallout>
          </Section>

          <Section number="6" title="Your Warranties" icon={<IconShieldCheck size={20} />} iconBg="bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <p>By submitting a URL, brand name, logo, or payment, you represent and warrant that:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You have the right to submit that destination and send visitors to it.</li>
              <li>
                The listing and destination comply with all applicable laws, including advertising,
                consumer-protection, privacy, and intellectual-property law.
              </li>
              <li>
                You are not impersonating another person, brand, or company, and are not claiming a Key for
                a competitor&rsquo;s site without authorization.
              </li>
              <li>
                The destination is not malware, phishing, a scam, or primarily designed to deceive visitors.
              </li>
              <li>The information you submit is accurate, and you will keep it accurate.</li>
            </ul>
          </Section>

          <Section number="7" title="Prohibited Listings and Use" icon={<IconBan size={20} />} iconBg="bg-red-500/10 text-red-600 dark:text-red-400">
            <p>You may not list or use the Service for:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Sexual or adult content; invite/chat-group links used to obscure the real destination; link
                shorteners hiding the true destination.
              </li>
              <li>
                Illegal, fraudulent, defamatory, harassing, hateful, or violent content, or anything
                exploiting children.
              </li>
              <li>
                Counterfeit goods, unauthorized streaming, or infringement of copyright, trademark, or other
                rights.
              </li>
              <li>
                Offers requiring licenses you don&rsquo;t hold (certain financial, medical, gambling, or
                regulated-goods offers).
              </li>
              <li>
                Interfering with the Service: scraping beyond ordinary browsing, manipulating click counts,
                automated bid submission without our written permission, or bypassing rate limits.
              </li>
            </ul>
          </Section>

          <Section number="8" title="Our Right to Remove Listings" icon={<IconTrash size={20} />} iconBg="bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <p>
              We may refuse, delay, edit, or permanently remove any listing or Key, with or without notice,
              where we believe these Terms or the law may have been broken, a rights holder complains,
              submitted details are invalid, or the listing creates legal, security, or reputational risk.
            </p>
            <WarnCallout>Removal does not entitle you to a refund.</WarnCallout>
          </Section>

          <Section number="9" title="Fair Use of Third-Party Content" icon={<IconPhoto size={20} />} iconBg="bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <p>
              To run the board, we fetch and display publicly available metadata about submitted destinations:
              brand names, titles, descriptions, logos, and favicons. We use this only to identify the listed
              destination on KeyBid, to show visitors where a paid placement leads, and to operate and moderate
              the Service. We do not suggest sponsorship or endorsement by the rights holder unless the lister
              is that rights holder.
            </p>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/5">
              KeyBid, our name, and the look of the Service are ours. You may not scrape the board to build a
              competing product or use our branding in a way implying our endorsement.
            </div>
          </Section>

          <Section number="10" title="License You Grant Us" icon={<IconLock size={20} />} iconBg="bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <p>
              You grant us a worldwide, non-exclusive, royalty-free license to host, cache, reproduce, and
              publicly display your listing and its metadata for as long as needed to operate, promote, and
              archive the Service.
            </p>
            <p>
              To request takedown, contact us at <XLink />. Takedown does not undo a completed payment.
            </p>
          </Section>

          <Section number="11" title="Complaints and Rights Notices" icon={<IconMail size={20} />} iconBg="bg-pink-500/10 text-pink-600 dark:text-pink-400">
            <p>
              If you believe a listing infringes your rights or is unlawful — including disputes over
              authorization to list a given URL — contact <XLink /> with:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>Your name and contact details</li>
              <li>The Key/listing in question</li>
              <li>The destination URL</li>
              <li>A description of the problem</li>
              <li>A statement that you are the rights holder or authorized to act</li>
            </ol>
            <p>
              We may remove or restrict the listing while we review, and may share the notice with the lister.
              Repeat or abusive notices may be ignored.
            </p>
          </Section>

          <Section number="12" title="No Endorsement, No Earnings Claims" icon={<IconStar size={20} />} iconBg="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
            <p>
              Appearance on the board is not our opinion of a product, and we do not verify listed claims,
              prices, or results. Click counts and visitor stats reflect what our systems recorded, not a
              promise of similar results for you.
            </p>
            <InfoCallout>
              Click counts are approximate, may be affected by bot traffic or ad blockers, and are not
              audited. Links from the Service lead to third-party destinations with their own terms; we are
              not responsible for them.
            </InfoCallout>
          </Section>

          <Section number="13" title="Availability and Changes" icon={<IconAdjustments size={20} />} iconBg="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400">
            <p>
              The Service is provided as-is and may be unavailable, slow, or incorrect. We may change bidding
              rules, minimums, or these Terms; a material change updates the &ldquo;Last Updated&rdquo; date.
              Continued use after a change means acceptance.
            </p>
            <p>
              For a payment already completed, the Terms in effect at the time of that checkout still apply to
              that payment, except where a change is required by law or to address a security/legal risk.
            </p>
          </Section>

          <Section number="14" title="Disclaimers" icon={<IconAlertTriangle size={20} />} iconBg="bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <WarnCallout>
              To the fullest extent permitted by law, we disclaim all warranties, express or implied,
              including merchantability, fitness for a particular purpose, and non-infringement. We do not
              warrant the Service will be uninterrupted, secure, or error-free, or that listings, click
              counts, or bid positions are accurate or complete.
            </WarnCallout>
          </Section>

          <Section number="15" title="Limitation of Liability" icon={<IconScale size={20} />} iconBg="bg-slate-500/10 text-slate-600 dark:text-slate-400">
            <p>
              We do not limit liability that applicable law says cannot be limited, including liability for
              fraud, gross negligence, or injury to life, body, or health. Subject to that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                We are not liable for lost profits, lost data, lost goodwill, or other indirect, incidental,
                or consequential damages.
              </li>
              <li>
                Our total liability for any claim relating to a payment is limited to the amount you paid us
                for the specific bid the claim concerns, in the{" "}
                <Placeholder>three months</Placeholder> before the claim.
              </li>
            </ul>
          </Section>

          <Section number="16" title="Indemnity" icon={<IconHandStop size={20} />} iconBg="bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <p>
              You will defend, indemnify, and hold harmless{" "}
              <Placeholder>Rachit Seth</Placeholder> and anyone working on the Service from claims, damages,
              losses, and reasonable legal fees arising from your listing, your destination site, your payment
              or chargeback, your breach of these Terms, or your infringement of another party&rsquo;s rights.
            </p>
          </Section>

          <Section number="17" title="Governing Law" icon={<IconScale size={20} />} iconBg="bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <p>
              These Terms are governed by the laws of{" "}
              <strong className="text-zinc-800 dark:text-zinc-200">India</strong>, excluding conflict-of-law
              rules. If you are a consumer with a mandatory local right that cannot be displaced, that right
              still protects you. If you are not a consumer, the courts at{" "}
              <Placeholder>New Delhi, India</Placeholder> have exclusive jurisdiction, to the extent permitted.
            </p>
          </Section>

          <Section number="18" title="General" icon={<IconFileText size={20} />} iconBg="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                If part of these Terms is unenforceable, the rest remains in effect, replaced by the closest
                valid equivalent.
              </li>
              <li>Failure to enforce a provision is not a waiver.</li>
              <li>
                You may not assign these Terms without our consent; we may assign them if the Service is
                transferred.
              </li>
              <li>
                These Terms, any published Rules, the Privacy Policy, and the checkout details you confirm
                form the entire agreement.
              </li>
              <li>
                Payments and other third-party services (e.g., Dodo Payments) are outside our control; their
                outages or decisions are not ours to answer for.
              </li>
            </ul>
          </Section>

          {/* Contact section */}
          <section className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-100/70 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-base sm:text-lg">
              <IconBrandX size={18} />
              <span>Contact &amp; Refund Inquiries</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              For questions about these Terms, technical payment discrepancies, or refund investigations,
              direct message Rachit Seth on X: <XLink />.
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
            <Link href="/rules" className="hover:underline">
              /rules
            </Link>
            <Link href="/terms" className="hover:underline font-semibold text-zinc-600 dark:text-zinc-300">
              /terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
