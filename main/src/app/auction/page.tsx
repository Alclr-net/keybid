"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { Key } from "@/types/database";
import { trackKeyClick } from "@/lib/helpers/keys";
import { useKeysStore } from "@/lib/store/keysStore";
import OutbidModal from "@/src/components/OutbidModal";
import KeyLogo from "@/src/components/ui/KeyLogo";
import Ping from "@/src/components/Ping";
import { cn } from "@/src/lib/utils";
import {
  IconArrowLeft,
  IconSearch,
  IconExternalLink,
  IconArrowsSort,
  IconTrophy,
  IconPlus,
  IconAlertCircle,
  IconHandClick,
} from "@tabler/icons-react";

export default function AuctionLeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"bid-desc" | "bid-asc" | "clicks-desc">("bid-desc");
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const keysList = useKeysStore((state) => state.keys);
  const isLoading = useKeysStore((state) => state.isLoading);

  const totalPool = useMemo(
    () => keysList.reduce((acc, k) => acc + (k.current_bid_amount || 0), 0),
    [keysList]
  );

  const totalClicks = useMemo(
    () => keysList.reduce((acc, k) => acc + (k.click_count || 0), 0),
    [keysList]
  );

  const filteredKeys = useMemo(() => {
    let list = [...keysList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (k) =>
          (k.key_name && k.key_name.toLowerCase().includes(q)) ||
          (k.about && k.about.toLowerCase().includes(q)) ||
          k.id.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const bidA = a.current_bid_amount || 0;
      const bidB = b.current_bid_amount || 0;
      if (sortBy === "bid-desc") return bidB - bidA;
      if (sortBy === "bid-asc") return bidA - bidB;
      if (sortBy === "clicks-desc") return (b.click_count || 0) - (a.click_count || 0);
      return 0;
    });

    return list;
  }, [keysList, searchQuery, sortBy]);

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
            <span>Back</span>
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
                {isLoading ? "..." : `${keysList.length} / 28`}
              </div>
            </div>
            <div className="h-8 w-px bg-zinc-200 dark:bg-white/10" />
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Total Clicks
              </div>
              <div className="font-mono text-2xl font-bold text-zinc-900 dark:text-white">
                {isLoading ? "..." : totalClicks}
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
              placeholder="Search company or key name..."
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
              onChange={(e) => setSortBy(e.target.value as "bid-desc" | "bid-asc" | "clicks-desc")}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer shadow-2xs"
            >
              <option value="bid-desc">Highest Bid First</option>
              <option value="bid-asc">Lowest Bid First</option>
              <option value="clicks-desc">Most Clicks First</option>
            </select>
          </div>
        </div>

        {/* Full Leaderboard Table */}
        <div className="rounded-2xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-900/70 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="divide-y divide-zinc-200 dark:divide-white/5">
            {/* Loading State */}
            {isLoading ? (
              <div className="divide-y divide-zinc-200 dark:divide-white/5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                    <div className="w-8 h-6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="w-10 h-7 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="w-32 h-4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      <div className="w-48 h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </div>
                    <div className="w-16 h-6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="w-24 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filteredKeys.length === 0 ? (
              /* Empty State */
              <div className="py-16 px-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500 flex items-center justify-center border border-zinc-200 dark:border-white/10">
                  <IconAlertCircle size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                    {searchQuery.trim()
                      ? `No matching keys found for "${searchQuery}".`
                      : "No keys yet. Claim the first one."}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
                    {searchQuery.trim()
                      ? "Try searching for a different company or key slot name."
                      : "The auction ledger is currently empty. Choose any keycap on the keyboard to start the bidding."}
                  </p>
                </div>
                {!searchQuery.trim() && (
                  <div className="p-[2px] rounded-md transition-all duration-200 ease-out shadow-xs bg-blue-600/20">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedKey(null);
                        setIsModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]"
                    >
                      <IconPlus size={15} />
                      <span>Claim a Key</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Live Rows */
              filteredKeys.map((key, idx) => {
                const isLeader = idx === 0 && sortBy === "bid-desc";
                const isSecond = idx === 1 && sortBy === "bid-desc";
                const isThird = idx === 2 && sortBy === "bid-desc";
                const hasBid = (key.current_bid_amount || 0) > 0;
                const bidAmount = key.current_bid_amount || 0;
                const keyName = key.key_name || `Key ${key.id.slice(0, 4)}`;

                return (
                  <div
                    key={key.id}
                    className={cn(
                      "flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 transition-colors",
                      isLeader && hasBid
                        ? "bg-amber-500/[0.04] dark:bg-amber-500/[0.06]"
                        : "hover:bg-zinc-50/80 dark:hover:bg-white/[0.02]"
                    )}
                  >
                    {/* Rank Badge */}
                    <div className="w-8 text-center shrink-0 flex items-center justify-center">
                      {hasBid && isLeader ? (
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-500/40 flex items-center gap-1">
                          <IconTrophy size={11} /> #1
                        </span>
                      ) : hasBid && isSecond ? (
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-400/20 text-slate-800 dark:text-slate-300 border border-slate-400/40">
                          #2
                        </span>
                      ) : hasBid && isThird ? (
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-amber-800/15 text-amber-900 dark:text-amber-400 border border-amber-800/30">
                          #3
                        </span>
                      ) : (
                        <span className="font-mono text-xs font-medium text-zinc-400 dark:text-zinc-500">
                          #{idx + 1}
                        </span>
                      )}
                    </div>

                    {/* Key Slot Badge */}
                    <div className="w-10 text-center shrink-0">
                      <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-white/10 shadow-2xs">
                        {(key.key_name || key.id.slice(0, 1)).slice(0, 3).toUpperCase()}
                      </span>
                    </div>

                    {/* Key Identity with KeyLogo (Placeholder fallback supported) */}
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                      <KeyLogo
                        src={key.key_logo}
                        alt={keyName}
                        fallbackText={keyName}
                        className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 p-0.5 shrink-0 shadow-2xs"
                        fallbackClassName="w-8 h-8 text-xs"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-semibold text-xs sm:text-sm text-zinc-900 dark:text-white truncate">
                            {keyName}
                          </span>
                          {key.submitted_url && (
                            <a
                              href={key.submitted_url.startsWith('http') ? key.submitted_url : `https://${key.submitted_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.stopPropagation();
                                trackKeyClick(key.id);
                                useKeysStore.getState().incrementClickCount(key.id);
                              }}
                              className="text-zinc-400 hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400 transition-colors p-0.5"
                              title={`Visit ${keyName}`}
                            >
                              <IconExternalLink size={13} />
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate hidden sm:block font-normal">
                          {key.about || "Hardware placement key on Apple Magic Keyboard"}
                        </p>
                        <div className="sm:hidden flex items-center gap-1 text-[10px] text-zinc-400 font-mono mt-0.5">
                          <IconHandClick size={11} className="text-blue-500" />
                          <span>{key.click_count || 0} clicks</span>
                        </div>
                      </div>
                    </div>

                    {/* Total Clicks Metric */}
                    <div className="text-right shrink-0 px-2 sm:px-4 hidden sm:block">
                      <div className="font-mono text-sm sm:text-base font-bold text-zinc-950 dark:text-white flex items-center justify-end gap-1">
                        <IconHandClick size={14} className="text-blue-500" />
                        <span>{key.click_count || 0}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        clicks
                      </div>
                    </div>

                    {/* Leading Bid or No bids yet */}
                    <div className="text-right shrink-0 pr-2">
                      {hasBid ? (
                        <>
                          <div className="font-mono text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                            ${bidAmount}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono hidden sm:block">
                            current bid
                          </div>
                        </>
                      ) : (
                        <div className="text-xs font-medium italic text-zinc-400 dark:text-zinc-500">
                          No bids yet
                        </div>
                      )}
                    </div>

                    {/* CTA Button: Outbid for $X or Be the first to bid */}
                    <div className="shrink-0">
                      {hasBid ? (
                        <div className={cn(
                          "p-[2px] rounded-md transition-all duration-200 ease-out shadow-xs",
                          isLeader ? "bg-amber-500/25" : "bg-blue-600/20"
                        )}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedKey(key);
                              setIsModalOpen(true);
                            }}
                            className={cn(
                              "flex items-center justify-center gap-1 px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]",
                              isLeader
                                ? "bg-amber-400 hover:bg-amber-500 text-zinc-950"
                                : "bg-blue-600 hover:bg-blue-500 text-white"
                            )}
                          >
                            <span>Outbid for</span>
                            <span className="font-mono font-bold">${bidAmount + 1}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-[2px] rounded-md transition-all duration-200 ease-out shadow-xs bg-blue-600/20">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedKey(key);
                              setIsModalOpen(true);
                            }}
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all cursor-pointer bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]"
                          >
                            <span>Be the first to bid</span>
                          </button>
                        </div>
                      )}
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
                    Claim any open letter, number, or modifier key starting at $10.
                  </p>
                </div>
              </div>
              <div className="p-[2px] rounded-md transition-all duration-200 ease-out shadow-xs bg-blue-600/20">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedKey(null);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-[6px] text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]"
                >
                  Claim a Key ($10) →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outbid Modal */}
      <OutbidModal
        company={selectedKey}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedKey(null);
        }}
        onSuccess={(bidAmount) => {
          if (selectedKey) {
            useKeysStore.getState().updateKey(selectedKey.id, { current_bid_amount: bidAmount });
          }
        }}
      />
    </div>
  );
}
