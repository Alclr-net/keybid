"use client";

import React, { useState } from "react";
import Link from "next/link";
import { COMPANIES, Company } from "@/app/data/keybidData";
import {
  IconArrowRight,
  IconClock,
  IconFlame,
  IconPlus,
  IconShieldCheck,
  IconBolt,
} from "@tabler/icons-react";
import Ping from "./Ping";
import OutbidModal from "@/components/OutbidModal";
import { cn } from "@/lib/utils";

interface BidEvent {
  id: string;
  keySlot: string;
  companyName: string;
  companyId: string;
  event: string;
  amount: number;
  timeAgo: string;
  challenger?: string;
  iconUrl?: string;
  type: "outbid" | "new_bidder" | "defended";
}

const RECENT_EVENTS: BidEvent[] = [
  {
    id: "evt-1",
    keySlot: "S",
    companyName: "Stripe",
    companyId: "stripe",
    event: "Stripe outbid for $32",
    amount: 32,
    timeAgo: "2 min ago",
    challenger: "Square Labs",
    iconUrl: "https://stripe.com/favicon.ico",
    type: "outbid",
  },
  {
    id: "evt-2",
    keySlot: "L",
    companyName: "Linear",
    companyId: "linear",
    event: "New bidder joined on Linear",
    amount: 23,
    timeAgo: "8 min ago",
    challenger: "Sprintly",
    iconUrl: "https://linear.app/favicon.ico",
    type: "new_bidder",
  },
  {
    id: "evt-3",
    keySlot: "V",
    companyName: "Vercel",
    companyId: "vercel",
    event: "Vercel defended Key V with $43 top bid",
    amount: 43,
    timeAgo: "24 min ago",
    iconUrl: "https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico",
    type: "defended",
  },
  {
    id: "evt-4",
    keySlot: "O",
    companyName: "OpenAI",
    companyId: "openai",
    event: "OpenAI outbid on Key O for $19",
    amount: 19,
    timeAgo: "48 min ago",
    challenger: "Anthropic AI",
    iconUrl: "https://openai.com/favicon.ico",
    type: "outbid",
  },
  {
    id: "evt-5",
    keySlot: "P",
    companyName: "Supabase",
    companyId: "supabase",
    event: "Challenger joined on Key P for $7",
    amount: 7,
    timeAgo: "1 hr ago",
    iconUrl: "https://supabase.com/favicon/favicon.ico",
    type: "new_bidder",
  },
  {
    id: "evt-6",
    keySlot: "R",
    companyName: "Raycast",
    companyId: "raycast",
    event: "Raycast locked in new spot on Key R",
    amount: 9,
    timeAgo: "2 hr ago",
    iconUrl: "https://raycast.com/favicon-production.png",
    type: "defended",
  },
];

export default function LiveAuctionSection() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetSlot, setTargetSlot] = useState<string>("");

  const handleOpenModalForEvent = (event: BidEvent) => {
    const comp = COMPANIES.find((c) => c.id === event.companyId) || null;
    setSelectedCompany(comp);
    setTargetSlot(event.keySlot);
    setIsModalOpen(true);
  };

  return (
    <section id="auction" className="w-full py-16 sm:py-24 px-4 sm:px-6 bg-zinc-50/70 dark:bg-zinc-950/40 border-y border-zinc-300/80 dark:border-white/5">
      <div className="max-w-4xl mx-auto">
        {/* Eyebrow & Title */}
        <div className="mb-8 sm:mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-600/40 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-3 shadow-2xs">
              <Ping>
                <span className="text-xs font-bold">Live Activity Stream</span>
              </Ping>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Live round activity.
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 font-normal max-w-xl leading-relaxed">
              Real-time bids, outbid challenges, and slot updates happening live across the Apple Magic Keyboard.
            </p>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Updated 2m ago</span>
          </div>
        </div>

        {/* Live Activity Feed Container */}
        <div className="rounded-2xl sm:rounded-3xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-900/70 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="divide-y divide-zinc-200 dark:divide-white/5">
            {RECENT_EVENTS.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-zinc-50/90 dark:hover:bg-white/[0.02] transition-colors"
              >
                {/* Left: Key Slot Keycap Badge & Company Icon */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative shrink-0 flex items-center justify-center">
                    <span className="font-mono font-extrabold text-xs sm:text-sm px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white border border-zinc-300 dark:border-white/15 shadow-xs">
                      {event.keySlot}
                    </span>
                  </div>

                  {event.iconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={event.iconUrl}
                      alt={event.companyName}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-contain bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 p-0.5 shrink-0 shadow-2xs hidden sm:block"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                      }}
                    />
                  ) : null}

                  {/* Middle: Event description & meta */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-xs sm:text-sm text-zinc-950 dark:text-white truncate">
                        {event.event}
                      </span>
                      {event.type === "outbid" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                          <IconBolt size={10} /> Outbid
                        </span>
                      )}
                      {event.type === "new_bidder" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                          <IconFlame size={10} /> Challenger
                        </span>
                      )}
                      {event.type === "defended" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          <IconShieldCheck size={10} /> Defended
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <IconClock size={11} /> {event.timeAgo}
                      </span>
                      <span>·</span>
                      <span>Key &apos;{event.keySlot}&apos;</span>
                      {event.challenger && (
                        <>
                          <span>·</span>
                          <span className="truncate hidden md:inline">by {event.challenger}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Varied Ghost/Lighter CTA Button */}
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenModalForEvent(event)}
                    className={cn(
                      "flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                      "bg-zinc-100 dark:bg-white/5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white",
                      "text-zinc-800 dark:text-zinc-200 border border-zinc-200/90 dark:border-white/10 hover:border-blue-600",
                      "shadow-2xs active:scale-[0.98]"
                    )}
                  >
                    <span>Challenge</span>
                    <span className="font-mono font-bold">${event.amount + 1}</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Bottom Action Footer with Link to /auction */}
            <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-50 dark:bg-white/[0.02] border-t border-zinc-200 dark:border-white/5">
              <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 text-center sm:text-left">
                <IconPlus size={14} className="text-blue-600 dark:text-blue-400" />
                <span>Want to claim an unlisted key? Starting at just $1.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCompany(null);
                    setTargetSlot("");
                    setIsModalOpen(true);
                  }}
                  className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  + Claim Any Key ($1)
                </button>

                <Link
                  href="/auction"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md active:scale-[0.98]"
                >
                  <span>View full leaderboard (10 keys)</span>
                  <IconArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outbid / Claim Modal */}
      <OutbidModal
        company={selectedCompany}
        isOpen={isModalOpen}
        initialKeySlot={targetSlot}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCompany(null);
          setTargetSlot("");
        }}
        onSuccess={() => {
          setIsModalOpen(false);
        }}
      />
    </section>
  );
}

