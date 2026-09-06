"use client";

import React, { useState } from "react";
import { COMPANIES, Company } from "@/app/data/keybidData";
import {
  IconTrophy,
  IconArrowUp,
  IconExternalLink,
  IconPlus,
  IconClock,
  IconSparkles,
  IconHandClick,
} from "@tabler/icons-react";
import Ping from "./Ping";
import OutbidModal from "@/components/OutbidModal";
import { cn } from "@/lib/utils";

export default function LiveAuctionSection() {
  const [companies, setCompanies] = useState(() => [...COMPANIES].sort((a, b) => b.bid - a.bid));
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const leader = companies[0];
  const totalPool = companies.reduce((s, c) => s + c.bid, 0);

  return (
    <section id="auction" className="w-full py-20 sm:py-28 px-4 sm:px-6 bg-zinc-50/60 dark:bg-zinc-950/40 border-y border-zinc-200/70 dark:border-white/5">
      <div className="max-w-4xl mx-auto">
        {/* Eyebrow & Title */}
        <div className="mb-8 sm:mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
            <Ping>
              <span className="text-xs font-semibold">Live updates of companies</span>
            </Ping>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            The auction, live.
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 font-normal max-w-2xl leading-relaxed">
            Every key on the keyboard is up for auction. The highest bidder on each key secures permanent hardware placement and a live site backlink.
          </p>
        </div>

        {/* Full Leaderboard Table */}
        <div className="rounded-2xl sm:rounded-3xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900/60 shadow-xs overflow-hidden">
          {/* Table Body Rows */}
          <div className="divide-y divide-zinc-100 dark:divide-white/5">
            {companies.map((company, idx) => {
              const isLeader = idx === 0;
              const isSecond = idx === 1;
              const isThird = idx === 2;
              return (
                <div
                  key={company.id}
                  className={cn(
                    "flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 transition-colors",
                    isLeader
                      ? "bg-amber-500/[0.05] dark:bg-amber-500/[0.06]"
                      : "hover:bg-zinc-50/80 dark:hover:bg-white/[0.02]"
                  )}
                >
                  {/* Rank */}
                  <div className="w-8 text-center shrink-0 flex items-center justify-center">
                    {isLeader ? (
                      <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                        #1
                      </span>
                    ) : isSecond ? (
                      <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-400/30">
                        #2
                      </span>
                    ) : isThird ? (
                      <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-amber-900/15 text-amber-800 dark:text-amber-400 border border-amber-700/30">
                        #3
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-medium text-zinc-400 dark:text-zinc-500">
                        #{idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Key Slot */}
                  <div className="w-10 text-center shrink-0">
                    <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 border border-zinc-200/80 dark:border-white/10 shadow-2xs">
                      {company.keySlot}
                    </span>
                  </div>

                  {/* Company info */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                    {company.iconUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={company.iconUrl}
                        alt={company.name}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-contain bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 p-0.5 shrink-0 shadow-2xs"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                        }}
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
                        {company.name[0]}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-semibold text-xs sm:text-sm text-zinc-900 dark:text-white truncate">
                          {company.name}
                        </span>
                        <a
                          href={company.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-white transition-colors"
                          title="Visit website"
                        >
                          <IconExternalLink size={12} />
                        </a>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate hidden sm:block font-normal">
                        {company.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Clicks */}
                  <div className="hidden md:flex items-center justify-center gap-1.5 font-mono text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100/70 dark:bg-white/5 px-2.5 py-1 rounded-full border border-zinc-200/60 dark:border-white/5 shrink-0">
                    <IconHandClick size={12} className="text-zinc-400" />
                    <span>{company.clicks} clicks</span>
                  </div>

                  {/* Outbid Button */}
                  <div className={cn(
                    "p-[1.5px] rounded-lg transition-all duration-200 ease-out shadow-xs shrink-0",
                    isLeader ? "bg-amber-500/25" : "bg-blue-600/20"
                  )}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCompany(company);
                        setIsModalOpen(true);
                      }}
                      className={cn(
                        "w-[105px] sm:w-[118px] flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-[6px] text-xs font-bold transition-all cursor-pointer shadow-2xs",
                        "shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]",
                        isLeader
                          ? "bg-amber-400 hover:bg-amber-500 text-zinc-950 active:bg-amber-600"
                          : "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700",
                      )}
                    >
                      <span className="text-xs font-bold flex items-center gap-1">
                        Outbid for
                        <span className="font-mono">
                          ${company.bid + 1}
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Claim Open Key Row */}
            <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between text-xs bg-zinc-50/50 dark:bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0">
                  <IconPlus size={14} />
                </div>
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Want your startup on the keyboard?
                  </span>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
                    Claim any open key starting at just $1
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCompany(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-colors shadow-xs cursor-pointer"
              >
                Claim a Key →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Outbid / Claim Modal */}
      <OutbidModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCompany(null);
        }}
        onSuccess={(bidAmount, createdCompany) => {
          if (selectedCompany) {
            setCompanies((prev) =>
              prev
                .map((c) => (c.id === selectedCompany.id ? { ...c, bid: bidAmount } : c))
                .sort((a, b) => b.bid - a.bid)
            );
          } else if (createdCompany) {
            setCompanies((prev) => [...prev, createdCompany].sort((a, b) => b.bid - a.bid));
          }
        }}
      />
    </section>
  );
}
