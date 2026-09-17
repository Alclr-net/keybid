import React from "react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import {
  IconArrowRight,
  IconCheck,
  IconDeviceDesktop,
  IconFlame,
  IconHelpCircle,
  IconKeyboard,
  IconScale,
  IconShieldCheck,
  IconSparkles,
  IconWorld,
  IconBolt,
  IconTarget,
} from "@tabler/icons-react";

/**
 * SeoArticleSection
 * Full-length editorial guide and comprehensive SEO resource.
 * Targets all primary and secondary KeyBid keywords with rich comparison tables,
 * conceptual cards, and responsive typography.
 */
export default function SeoArticleSection() {
  return (
    <section
      id="about"
      aria-label="About KeyBid"
      className="w-full border-t border-zinc-200/80 dark:border-white/5 bg-zinc-50/60 dark:bg-zinc-950/40 py-12 sm:py-20 px-4 sm:px-6"
    >
      <div className="max-w-4xl mx-auto space-y-10 sm:space-y-14">

        {/* ── Main Article Header ── */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 dark:bg-blue-500/15 border border-blue-600/20 text-blue-700 dark:text-blue-400 text-xs font-bold shadow-2xs">
            <IconKeyboard size={14} />
            <span>Official Guide &amp; Architecture</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.15]">
            What is KeyBid? The Paid Startup Leaderboard Built on a Real Keyboard
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <strong className="font-semibold text-zinc-950 dark:text-white">KeyBid</strong> (<code className="text-xs sm:text-sm font-mono px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-semibold">keybid.lol</code>) is a paid startup leaderboard with a unique physical dimension: every placement is directly represented on a physical Apple Magic Keyboard. Each keycap across the board maps to an alphanumeric slot, and founders, indie hackers, and product teams bid to claim that key, showcase their brand logo, and drive qualified organic traffic to their websites. It bridges the gap between digital startup launch boards and tangible real-world hardware visibility.
          </p>
        </div>

        {/* ── Section: How It Works ── */}
        <div className="bg-white dark:bg-zinc-900/70 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-zinc-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <IconBolt size={20} />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">
              How Does KeyBid Work?
            </h3>
          </div>

          <p className="text-xs sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            KeyBid operates on a transparent, real-time <strong className="text-zinc-950 dark:text-white">pay-to-rank website auction</strong> model. When you enter your website URL, KeyBid automatically identifies the root domain and assigns you the keycap that matches your brand&rsquo;s first letter. If that key is vacant, you can claim it with an opening bid. If an existing company already holds the slot, you can outbid them live to instantly assume their spot on both the web leaderboard and the physical hardware setup.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider font-mono">
                <IconSparkles size={15} className="text-blue-500" />
                Transparent Pricing
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Opening bids start at just <strong className="text-blue-600 dark:text-blue-400 font-semibold">$15 (taxes inclusive)</strong>. To outbid an existing holder, you pay only the difference plus increment — making KeyBid a genuine <em>pay-what-you-want website ranking</em> platform.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider font-mono">
                <IconFlame size={15} className="text-red-500" />
                Continuous Live Placement
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                There are no arbitrary countdown timers or expiring seasons. Your spot remains featured live on the hardware desk and digital board indefinitely until another builder outbids you.
              </p>
            </div>
          </div>
        </div>

        {/* ── Section: KeyBid vs Outbid.lol Comparison ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <IconScale size={20} />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">
              KeyBid vs. Outbid.lol — The Best Outbid.lol Alternative
            </h3>
          </div>

          <p className="text-xs sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Many indie founders search for <strong className="text-zinc-950 dark:text-white">outbid.lol alternatives</strong> or <em>sites like outbid.lol</em> to find innovative ways to launch startups and capture early adopter traffic. While both platforms employ competitive pay-to-rank auctions, KeyBid innovates with physical hardware integration, brand letter mapping, and higher social shareability.
          </p>
        </div>

        {/* ── Section: Why Founders Use KeyBid ── */}
        <div className="bg-white dark:bg-zinc-900/70 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-zinc-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <IconTarget size={20} />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">
              Why Founders Use KeyBid to Get More Traffic
            </h3>
          </div>

          <p className="text-xs sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Getting genuine visibility for an early-stage product is challenging. Traditional ad networks charge high CPMs with low intent, while crowded product directories bury launches within hours. KeyBid provides a focused, high-contrast alternative:
          </p>

          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-white/5">
              <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                1
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white">High-Converting Early Adopter Audience</h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  KeyBid is frequently visited by developers, makers, venture scouts, and technology enthusiasts looking for innovative launches. A single click from a high-intent peer is worth exponentially more than passive impressions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-white/5">
              <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                2
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white">Viral Competitive Social Proof</h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  The outbid mechanism creates social moments. When someone claims your key, you receive an instant alert and can post about the duel on X, turning routine launch marketing into engaging public momentum.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-white/5">
              <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                3
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white">No Approval Queues or Gatekeeping</h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  Unlike traditional directories that take days to approve listings, KeyBid verification is automated via payment confirmation. Your logo and link go live within seconds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section: What Happens When Outbid? ── */}
        <div className="bg-white dark:bg-zinc-900/70 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-zinc-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <IconHelpCircle size={20} />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">
              What Happens When Someone Outbids Your Listing?
            </h3>
          </div>

          <p className="text-xs sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            If a challenger places a higher bid on your key slot, your company logo is replaced on that key by the new winner. You retain all click history accumulated during your placement, and you are immediately eligible to reclaim the key by submitting a counter-bid.
          </p>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
            <strong>Important Policy:</strong> In accordance with the KeyBid <Link href="/terms" className="underline font-semibold hover:text-blue-600">Terms of Service</Link>, all bid payments purchase immediate placement and are non-refundable. There is no guaranteed minimum duration; the auction remains live 24/7.
          </div>
        </div>

        {/* ── Section: How to Feature Your Site in 30 Seconds ── */}
        <div className="bg-white dark:bg-zinc-900/70 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-zinc-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <IconShieldCheck size={20} />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">
              How to Get Your Website Featured on KeyBid
            </h3>
          </div>

          <p className="text-xs sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Listing your project takes less than a minute with zero technical friction:
          </p>

          <ol className="space-y-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 list-decimal pl-5">
            <li><strong>Enter your website URL:</strong> Paste your startup domain into the input bar. KeyBid automatically pulls your high-resolution favicon and matches your letter key.</li>
            <li><strong>Set your bid amount:</strong> Choose the starting bid or outbid the current holder by $1 or more.</li>
            <li><strong>Complete secure checkout:</strong> Fast, encrypted payment processing powered by Dodo Payments.</li>
            <li><strong>Instant Live Placement:</strong> Your key lights up on the virtual keyboard and leaderboard immediately upon capture.</li>
          </ol>
        </div>



      </div>
    </section>
  );
}
