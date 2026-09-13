"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Key } from "@/types/database";
import { trackKeyClick } from "@/lib/helpers/keys";
import { useKeysStore } from "@/lib/store/keysStore";
import {
  IconArrowRight,
  IconPlus,
  IconShieldCheck,
  IconAlertCircle,
  IconExternalLink,
  IconHandClick,
} from "@tabler/icons-react";
import Ping from "./Ping";
import OutbidModal from "@/src/components/OutbidModal";
import KeyLogo from "@/src/components/ui/KeyLogo";
import { cn } from "@/src/lib/utils";

export default function LiveAuctionSection() {
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetSlot, setTargetSlot] = useState<string>("");

  const keysList = useKeysStore((state) => state.keys);
  const isLoading = useKeysStore((state) => state.isLoading);

  // Rows with bids sort to the top (highest first), rows without bids sort below
  const sortedKeys = [...keysList].sort((a, b) => {
    const bidA = a.current_bid_amount || 0;
    const bidB = b.current_bid_amount || 0;
    if (bidB !== bidA) {
      return bidB - bidA;
    }
    return (a.brand_name || "").localeCompare(b.brand_name || "");
  });

  const handleOpenModal = (keyItem: Key) => {
    setSelectedKey(keyItem);
    const slot = (keyItem.brand_name || keyItem.id.slice(0, 1)).slice(0, 3).toUpperCase();
    setTargetSlot(slot);
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
                <span className="text-xs font-bold">Live Round Activity</span>
              </Ping>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              The auction, live.
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 font-normal max-w-xl leading-relaxed">
              Real-time bids, outbid challenges, and slot updates happening live across the Apple Magic Keyboard.
            </p>
          </div>
        </div>

        {/* Live Activity Feed Container */}
        <div className="rounded-2xl sm:rounded-3xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-900/70 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="divide-y divide-zinc-200 dark:divide-white/5">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-6 py-4 animate-pulse">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-9 h-7 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                    <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                    <div className="space-y-1.5 flex-1">
                      <div className="w-32 h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      <div className="w-20 h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </div>
                  </div>
                  <div className="w-20 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                </div>
              ))
            ) : sortedKeys.length === 0 ? (
              /* Empty state: zero keys in database */
              <div className="py-16 px-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500 flex items-center justify-center border border-zinc-200 dark:border-white/10">
                  <IconAlertCircle size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                    No keys yet. Claim the first one.
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
                    The auction ledger is currently empty. Choose any keycap on the keyboard to start the bidding.
                  </p>
                </div>
                <div className="p-[2px] rounded-md transition-all duration-200 ease-out shadow-xs bg-blue-600/20">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedKey(null);
                      setTargetSlot("");
                      setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-[6px] text-xs font-bold transition-all cursor-pointer shadow-2xs bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]"
                  >
                    <IconPlus size={15} />
                    <span>Claim a Key</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Keys list: bids on top, unbid below */
              sortedKeys.slice(0, 8).map((keyItem) => {
                const hasBid = (keyItem.current_bid_amount || 0) > 0;
                const bidAmount = keyItem.current_bid_amount || 0;
                const keyName = keyItem.brand_name || `Key ${keyItem.id.slice(0, 4)}`;
                const keySlot = (keyItem.key_slot || keyItem.id.slice(0, 1)).slice(0, 3).toUpperCase();

                return (
                  <div
                    key={keyItem.id}
                    className="flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-zinc-50/90 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Left: Key Slot Keycap Badge & Company Icon */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative shrink-0 flex items-center justify-center">
                        <span className="font-mono font-extrabold text-xs sm:text-sm px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white border border-zinc-300 dark:border-white/15 shadow-xs">
                          {keySlot}
                        </span>
                      </div>

                      <KeyLogo
                        src={keyItem.key_logo}
                        alt={keyName}
                        fallbackText={keyName}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-contain bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 p-0.5 shrink-0 shadow-2xs hidden sm:block"
                        fallbackClassName="w-7 h-7 sm:w-8 sm:h-8 text-xs hidden sm:flex"
                      />

                      {/* Middle: Event description & meta */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-bold text-xs sm:text-sm text-zinc-950 dark:text-white truncate">
                            {keyName}
                          </span>
                          {keyItem.submitted_url && (
                            <a
                              href={keyItem.submitted_url.startsWith('http') ? keyItem.submitted_url : `https://${keyItem.submitted_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.stopPropagation();
                                trackKeyClick(keyItem.id);
                                useKeysStore.getState().incrementClickCount(keyItem.id);
                              }}
                              className="text-zinc-400 hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400 transition-colors p-0.5"
                              title={`Visit ${keyName}`}
                            >
                              <IconExternalLink size={13} />
                            </a>
                          )}
                          {hasBid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                              <IconShieldCheck size={10} /> Leading
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
                              Open Slot
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400 flex-wrap">
                          <span>Key &apos;{keySlot}&apos;</span>
                          <span>·</span>
                          {hasBid ? (
                            <span className="font-semibold text-zinc-900 dark:text-white font-mono">
                              ${bidAmount}
                            </span>
                          ) : (
                            <span className="font-medium italic text-zinc-400 dark:text-zinc-500">
                              No bids yet
                            </span>
                          )}
                          <span>·</span>
                          <span className="inline-flex items-center gap-1 font-mono text-zinc-500 dark:text-zinc-400">
                            <IconHandClick size={12} className="text-blue-500" />
                            <span>{keyItem.click_count || 0} clicks</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Challenge or Be the first to bid CTA Button */}
                    <div className="shrink-0 flex items-center gap-2">
                      {hasBid ? (
                        <div className="p-[2px] rounded-md transition-all duration-200 ease-out shadow-xs bg-blue-600/20">
                          <button
                            type="button"
                            onClick={() => handleOpenModal(keyItem)}
                            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all cursor-pointer bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]"
                          >
                            <span>Outbid for</span>
                            <span className="font-mono font-bold">${bidAmount + 1}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-[2px] rounded-md transition-all duration-200 ease-out shadow-xs bg-blue-600/20">
                          <button
                            type="button"
                            onClick={() => handleOpenModal(keyItem)}
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

            {/* Bottom Action Footer with Link to /auction (Claim button omitted when empty state already contains it) */}
            <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-50 dark:bg-white/[0.02] border-t border-zinc-200 dark:border-white/5">
              <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 text-center sm:text-left">
                <IconPlus size={14} className="text-blue-600 dark:text-blue-400" />
                <span>Want to claim an unlisted key? Starting at just $10.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
                {sortedKeys.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedKey(null);
                      setTargetSlot("");
                      setIsModalOpen(true);
                    }}
                    className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    + Claim Any Key ($10)
                  </button>
                )}

                <div className="p-[2px] rounded-md transition-all duration-200 ease-out shadow-xs bg-blue-600/20">
                  <Link
                    href="/auction"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[6px] text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]"
                  >
                    <span>View full leaderboard ({sortedKeys.length > 0 ? `${sortedKeys.length} keys` : "all keys"})</span>
                    <IconArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outbid / Claim Modal */}
      <OutbidModal
        company={selectedKey}
        isOpen={isModalOpen}
        initialKeySlot={targetSlot}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedKey(null);
          setTargetSlot("");
        }}
        onSuccess={(_bidAmount, _createdCompany, createdKey) => {
          if (createdKey) {
            useKeysStore.getState().updateKey(createdKey.id, createdKey);
          }
        }}
      />
    </section>
  );
}
