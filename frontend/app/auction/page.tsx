"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { COMPANIES, Company } from "@/app/data/keybidData";
import OutbidModal from "@/components/OutbidModal";
import Ping from "@/components/Ping";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconSearch,
  IconHandClick,
  IconExternalLink,
  IconArrowsSort,
  IconTrophy,
  IconPlus,
} from "@tabler/icons-react";

export default function AuctionLeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"bid-desc" | "bid-asc" | "clicks-desc">("bid-desc");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companiesList, setCompaniesList] = useState<Company[]>(COMPANIES);

  const totalPool = useMemo(() => companiesList.reduce((acc, c) => acc + c.bid, 0), [companiesList]);

  const filteredCompanies = useMemo(() => {
    let list = [...companiesList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.keySlot.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === "bid-desc") return b.bid - a.bid;
      if (sortBy === "bid-asc") return a.bid - b.bid;
      if (sortBy === "clicks-desc") return b.clicks - a.clicks;
      return 0;
    });

    return list;
  }, [companiesList, searchQuery, sortBy]);

  return (
    <div className="min-h-screen w-full bg-[#fafafa] dark:bg-[#090a0f] text-zinc-900 dark:text-white py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Back */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <IconArrowLeft size={16} />
            <span>Back to KeyBid</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-3 shadow-2xs">
              <Ping>
                <span>Complete Hardware Registry</span>
              </Ping>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Full Auction Leaderboard
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 max-w-xl font-normal">
              Every key on the Apple Magic Keyboard is up for grabs. Filter, search, and outbid to secure your brand’s permanent keycap placement.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 sm:gap-6 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 shadow-sm">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Total Pool
              </div>
              <div className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${totalPool}
              </div>
            </div>
            <div className="h-8 w-px bg-zinc-200 dark:bg-white/10" />
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Claimed Keys
              </div>
              <div className="font-mono text-2xl font-bold text-zinc-900 dark:text-white">
                {companiesList.length} / 28
              </div>
            </div>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6">
          <div className="relative w-full sm:w-80">
            <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search company or key slot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-blue-500 transition-colors shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <IconArrowsSort size={15} className="text-zinc-400 hidden sm:block" />
            <span className="text-xs text-zinc-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer shadow-2xs"
            >
              <option value="bid-desc">Highest Bid First</option>
              <option value="bid-asc">Lowest Bid First</option>
              <option value="clicks-desc">Most Clicks</option>
            </select>
          </div>
        </div>

        {/* Full Leaderboard Table */}
        <div className="rounded-2xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-900/70 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="divide-y divide-zinc-200 dark:divide-white/5">
            {filteredCompanies.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs sm:text-sm">
                No matching companies found for &quot;{searchQuery}&quot;.
              </div>
            ) : (
              filteredCompanies.map((company, idx) => {
                const isLeader = idx === 0 && sortBy === "bid-desc";
                const isSecond = idx === 1 && sortBy === "bid-desc";
                const isThird = idx === 2 && sortBy === "bid-desc";

                return (
                  <div
                    key={company.id}
                    className={cn(
                      "flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 transition-colors",
                      isLeader
                        ? "bg-amber-500/[0.04] dark:bg-amber-500/[0.06]"
                        : "hover:bg-zinc-50/80 dark:hover:bg-white/[0.02]"
                    )}
                  >
                    {/* Rank Badge */}
                    <div className="w-8 text-center shrink-0 flex items-center justify-center">
                      {isLeader ? (
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-500/40 flex items-center gap-1">
                          <IconTrophy size={11} /> #1
                        </span>
                      ) : isSecond ? (
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-400/20 text-slate-800 dark:text-slate-300 border border-slate-400/40">
                          #2
                        </span>
                      ) : isThird ? (
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-amber-800/15 text-amber-900 dark:text-amber-400 border border-amber-800/30">
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
                      <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-white/10 shadow-2xs">
                        {company.keySlot}
                      </span>
                    </div>

                    {/* Company Identity */}
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                      {company.iconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.iconUrl}
                          alt={company.name}
                          className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 p-0.5 shrink-0 shadow-2xs"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
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
                            className="text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-white transition-colors"
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

                    {/* Leading Bid */}
                    <div className="text-right shrink-0 pr-2">
                      <div className="font-mono text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                        ${company.bid}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono hidden sm:block">
                        current bid
                      </div>
                    </div>

                    {/* Clicks */}
                    <div className="hidden md:flex items-center justify-center gap-1.5 font-mono text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100/70 dark:bg-white/5 px-2.5 py-1 rounded-full border border-zinc-200/60 dark:border-white/5 shrink-0">
                      <IconHandClick size={12} className="text-zinc-400" />
                      <span>{company.clicks} clicks</span>
                    </div>

                    {/* Varied CTA Button Style */}
                    <div className="shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCompany(company);
                          setIsModalOpen(true);
                        }}
                        className={cn(
                          "flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                          isLeader
                            ? "bg-amber-400 hover:bg-amber-500 text-zinc-950 shadow-sm"
                            : isSecond || isThird
                            ? "bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                            : "bg-zinc-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-600/20 text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 border border-zinc-200 dark:border-white/10 hover:border-blue-500/40"
                        )}
                      >
                        <span>Outbid for</span>
                        <span className="font-mono font-bold">${company.bid + 1}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Bottom Claim Key Promo */}
            <div className="px-4 sm:px-6 py-4 flex items-center justify-between text-xs bg-zinc-50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0">
                  <IconPlus size={16} />
                </div>
                <div>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Want an unclaimed key slot?
                  </span>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Claim any open letter, number, or modifier key starting at $1.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCompany(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-xs cursor-pointer"
              >
                Claim a Key ($1) →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Outbid Modal */}
      <OutbidModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCompany(null);
        }}
        onSuccess={(bidAmount, createdCompany) => {
          if (selectedCompany) {
            setCompaniesList((prev) =>
              prev
                .map((c) => (c.id === selectedCompany.id ? { ...c, bid: bidAmount } : c))
                .sort((a, b) => b.bid - a.bid)
            );
          } else if (createdCompany) {
            setCompaniesList((prev) => [...prev, createdCompany].sort((a, b) => b.bid - a.bid));
          }
        }}
      />
    </div>
  );
}
