"use client";

import React from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Ping from "./Ping";

const items = [
  {
    value: "item-1",
    trigger: "Is this real?",
    content:
      "Yes, 100%. Every claimed key is mapped to custom UV-printed decals applied directly to my daily driver Apple Magic Keyboard and displayed in the virtual interactive keyboard.",
  },
  {
    value: "item-2",
    trigger: "How does the bidding work?",
    content:
      "Every key has an initial starting bid of $1. Anyone can outbid the current holder by at least $1. If you're outbid, your spot is replaced and you can choose to outbid back to reclaim it.",
  },
  {
    value: "item-3",
    trigger: "What happens if I get outbid?",
    content:
      "When you get outbid, the new highest bidder takes over that key slot. You will receive an immediate notification so you have the opportunity to defend your spot before the auction closes.",
  },
  {
    value: "item-4",
    trigger: "Can I change my logo or destination link later?",
    content:
      "Yes. Once the auction concludes and you are locked in as the winner for that key, you can submit an updated icon or redirect URL anytime through your verified claim link.",
  },
  {
    value: "item-5",
    trigger: "Can I bid on multiple keys?",
    content:
      "Absolutely! Several companies choose to bid on whole word combinations (e.g., 'A', 'I', or their company initial) or arrow keys for prominent visibility.",
  },
  {
    value: "item-6",
    trigger: "What if the keyboard is damaged, lost, or replaced?",
    content:
      "If the keyboard requires repair or replacement during the 365-day placement period, the exact same custom keycap decal set is reprinted and applied to the replacement Apple Magic Keyboard at zero cost to sponsors.",
  },
];

export function AccordionBasic() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-1"
      className="w-full"
    >
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function FaqSection() {
  const claimants = [
    { name: "Vercel", slot: "V", icon: "https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico" },
    { name: "Stripe", slot: "S", icon: "https://stripe.com/favicon.ico" },
    { name: "Linear", slot: "L", icon: "https://linear.app/favicon.ico" },
    { name: "OpenAI", slot: "O", icon: "https://openai.com/favicon.ico" },
    { name: "Figma", slot: "F", icon: "https://static.figma.com/app/icon/1/favicon.ico" },
    { name: "Cursor", slot: "C", icon: "https://cursor.com/favicon.ico" },
    { name: "Raycast", slot: "R", icon: "https://raycast.com/favicon-production.png" },
    { name: "Supabase", slot: "P", icon: "https://supabase.com/favicon/favicon.ico" },
  ];

  return (
    <section id="faq" className="w-full py-20 sm:py-28 px-4 sm:px-6 bg-zinc-50/70 dark:bg-zinc-950/40 border-t border-zinc-300/80 dark:border-white/5">
      <div className="max-w-4xl mx-auto">
        {/* ── Social Proof & Hardware Credibility Card ── */}
        <ScrollReveal delay={0.05}>
          <div className="mb-14 sm:mb-18 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-300 dark:border-white/10 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-white/10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-600/40 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold mb-2 shadow-2xs select-none">
                  <Ping>

                    <span>LIVE HARDWARE PROVENANCE</span>
                  </Ping>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white text-shadow-xs">
                  12 keys claimed / <span className="text-emerald-600 dark:text-emerald-400">$340</span> in bids this week
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 font-normal">
                  Active brands already secured on my daily driver Apple Magic Keyboard setup.
                </p>
              </div>

              {/* Verified guarantees */}
              <div className="flex flex-col gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                <span className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> 100% Genuine Apple Keyboard Placement
                </span>
                <span className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> 1200 DPI UV-Cured Resin Decals
                </span>
                <span className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> Instant Outbid SMS & Email Alerts
                </span>
              </div>
            </div>

            {/* Real Claimant Brand Logos Bar */}
            <div className="pt-6">
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                Current Claimants:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
                {claimants.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center gap-2 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/5 shadow-2xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.icon}
                      alt={c.name}
                      className="w-5 h-5 rounded object-contain shrink-0"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                      }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                        {c.name}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-10 sm:mb-14">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Questions & Answers
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 font-normal">
              Everything you need to know about the auction and hardware placement.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="border-t border-zinc-300 dark:border-white/10">
            <AccordionBasic />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
