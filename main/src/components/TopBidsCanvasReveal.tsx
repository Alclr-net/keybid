"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Key } from "@/types/database";
import { trackKeyClick } from "@/lib/helpers/keys";
import { useKeysStore } from "@/lib/store/keysStore";
import { CanvasRevealEffect } from "@/src/components/ui/canvas-reveal-effect";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import Ping from "@/src/components/Ping";
import OutbidModal from "@/src/components/OutbidModal";
import KeyLogo from "@/src/components/ui/KeyLogo";
import { cn } from "@/src/lib/utils";
import {
  IconExternalLink,
  IconTrophy,
  IconArrowRight,
  IconHandClick,
} from "@tabler/icons-react";

export const CornerIcon = ({ className, ...rest }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={cn("pointer-events-none select-none", className)}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

interface PodiumTier {
  rank: number;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  buttonColor: string;
  buttonOuterColor: string;
  colors: number[][];
  containerBg: string;
  animationSpeed: number;
  dotSize: number;
  borderHover: string;
}

const PODIUM_CONFIG: Record<number, PodiumTier> = {
  1: {
    rank: 1,
    label: "Gold Rank",
    badgeBg: "bg-amber-500/15 dark:bg-amber-500/20",
    badgeText: "text-amber-800 dark:text-amber-400",
    badgeBorder: "border-amber-500/50",
    buttonColor: "bg-amber-400 hover:bg-amber-500 text-zinc-950",
    buttonOuterColor: "bg-amber-500/25",
    colors: [
      [245, 158, 11],
      [251, 191, 36],
      [217, 119, 6],
    ],
    containerBg: "bg-amber-950/80 dark:bg-black",
    animationSpeed: 3.2,
    dotSize: 2.5,
    borderHover: "hover:border-amber-500/60 dark:hover:border-amber-500/70",
  },
  2: {
    rank: 2,
    label: "Silver Rank",
    badgeBg: "bg-slate-500/15 dark:bg-slate-400/20",
    badgeText: "text-slate-800 dark:text-slate-300",
    badgeBorder: "border-slate-400/50",
    buttonColor: "bg-blue-600 hover:bg-blue-500 text-white",
    buttonOuterColor: "bg-blue-600/20",
    colors: [
      [203, 213, 225],
      [148, 163, 184],
      [226, 232, 240],
    ],
    containerBg: "bg-slate-950/80 dark:bg-black",
    animationSpeed: 3.2,
    dotSize: 2.3,
    borderHover: "hover:border-slate-400/60 dark:hover:border-slate-400/70",
  },
  3: {
    rank: 3,
    label: "Bronze Rank",
    badgeBg: "bg-amber-900/15 dark:bg-amber-800/20",
    badgeText: "text-amber-900 dark:text-amber-400",
    badgeBorder: "border-amber-700/50",
    buttonColor: "bg-blue-600 hover:bg-blue-500 text-white",
    buttonOuterColor: "bg-blue-600/20",
    colors: [
      [180, 83, 9],
      [217, 119, 6],
      [146, 64, 14],
    ],
    containerBg: "bg-amber-950/80 dark:bg-black",
    animationSpeed: 3.0,
    dotSize: 2.5,
    borderHover: "hover:border-amber-700/60 dark:hover:border-amber-700/70",
  },
};

function PodiumCard({
  keyData,
  rank,
  onOutbid,
}: {
  keyData: Key;
  rank: number;
  onOutbid: (keyData: Key) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const config = PODIUM_CONFIG[rank] || PODIUM_CONFIG[3];
  const name = keyData.key_name || `Key ${keyData.id.slice(0, 4)}`;
  const bidAmount = keyData.current_bid_amount || 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((prev) => !prev)}
      className={cn(
        "group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer select-none",
        "bg-white/95 dark:bg-zinc-900/85 border-zinc-300 dark:border-white/10 backdrop-blur-xl",
        "shadow-[0_8px_30px_rgba(0,0,0,0.07),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_rgba(0,0,0,0.1)]",
        config.borderHover,
        " hover:shadow-2xl"
      )}
    >
      {/* Corner crosshairs */}
      <CornerIcon className="absolute h-5 w-5 -top-2.5 -left-2.5 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
      <CornerIcon className="absolute h-5 w-5 -bottom-2.5 -left-2.5 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
      <CornerIcon className="absolute h-5 w-5 -top-2.5 -right-2.5 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
      <CornerIcon className="absolute h-5 w-5 -bottom-2.5 -right-2.5 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />

      {/* Background Canvas Reveal Effect on Hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full z-0 overflow-hidden"
          >
            <CanvasRevealEffect
              animationSpeed={config.animationSpeed}
              containerClassName={config.containerBg}
              colors={config.colors}
              dotSize={config.dotSize}
              showGradient={false}
            />
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] bg-white/40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/40 dark:from-black/90 dark:via-transparent dark:to-black/50 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Foreground Card Content */}
      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        {/* Top Header: Rank */}
        <div className="flex items-center justify-between gap-3">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition-colors shadow-2xs",
              config.badgeBg,
              config.badgeText,
              config.badgeBorder
            )}
          >
            <span>{config.label}</span>
          </div>
        </div>

        {/* Brand identity */}
        <div className="flex items-start gap-4">
          <KeyLogo
            src={keyData.key_logo}
            alt={name}
            fallbackText={name}
            className="w-12 h-12 rounded-lg object-contain shrink-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 p-1"
            fallbackClassName="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl text-xl"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-bold tracking-tight text-zinc-950 dark:text-white truncate">
                {name}
              </h3>
              {keyData.submitted_url && (
                <a
                  href={keyData.submitted_url.startsWith('http') ? keyData.submitted_url : `https://${keyData.submitted_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400 transition-colors p-0.5"
                  title={`Visit ${name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    trackKeyClick(keyData.id);
                    useKeysStore.getState().incrementClickCount(keyData.id);
                  }}
                >
                  <IconExternalLink size={14} />
                </a>
              )}
            </div>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed font-normal">
              {keyData.about || "Hardware placement on Apple Magic Keyboard"}
            </p>
          </div>
        </div>

        {/* Bid & Clicks Display */}
        <div className="pt-3 dark:border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Leading Bid
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white text-shadow-sm">
              ${bidAmount}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Clicks
            </div>
            <div className="inline-flex items-center gap-1 font-mono text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
              <IconHandClick size={16} className="text-blue-500" />
              <span>{keyData.click_count || 0}</span>
            </div>
          </div>
        </div>

        {/* Outbid Action CTA */}
        <div
          className={cn(
            "p-[2px] w-full rounded-md transition-all duration-200 ease-out shadow-xs",
            config.buttonOuterColor
          )}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOutbid(keyData);
            }}
            className={cn(
              "w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-[6px] text-xs font-bold transition-all cursor-pointer shadow-2xs",
              "shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]",
              config.buttonColor
            )}
          >
            <p className="text-lg text-shadow-xs font-bold flex items-center gap-1">
              Outbid for
              <span>${bidAmount + 1}</span>
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TopBidsCanvasReveal() {
  const keysList = useKeysStore((state) => state.keys);
  const isLoading = useKeysStore((state) => state.isLoading);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only keys that actually have an active bid > 0
  const keysWithBids = keysList.filter((k) => (k.current_bid_amount || 0) > 0);

  const topBids = [...keysWithBids]
    .sort((a, b) => (b.current_bid_amount || 0) - (a.current_bid_amount || 0))
    .slice(0, 3);

  return (
    <section className="w-full py-12 sm:py-20 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <ScrollReveal delay={0.05} distance={20}>
          <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-600/40 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold mb-3 shadow-2xs select-none">
              <Ping>
                <span>Live Matrix Reveal</span>
              </Ping>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
              Top 3 Keys On Auction
            </h2>

            <p className="mt-3 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl font-normal leading-relaxed">
              Hover over each leader card to reveal the interactive canvas particle matrix. The highest bidder on each key claims permanent hardware placement.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Interactive Cards Grid */}
        <ScrollReveal delay={0.15} distance={25}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {[1, 2, 3].map((rank) => (
                <div
                  key={rank}
                  className="p-6 sm:p-7 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl animate-pulse flex flex-col justify-between h-72"
                >
                  <div className="w-20 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                    <div className="space-y-2 flex-1">
                      <div className="w-28 h-4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      <div className="w-36 h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-16 h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="w-24 h-7 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                  <div className="w-full h-10 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                </div>
              ))}
            </div>
          ) : topBids.length === 0 ? (
            <div className="py-14 sm:py-16 px-6 sm:px-10 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl flex flex-col items-center justify-center text-center max-w-lg mx-auto shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
                <IconTrophy size={24} />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white mb-2">
                No bids yet
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
                Be the first to bid on a key
              </p>
              <div className="p-[2px] rounded-md transition-all duration-200 ease-out shadow-xs bg-blue-600/20">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedKey(null);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]"
                >
                  <span>Claim / Bid on a Key</span>
                  <IconArrowRight size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-6 lg:gap-8 items-stretch",
                topBids.length === 1 && "grid-cols-1 max-w-md mx-auto",
                topBids.length === 2 && "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto",
                topBids.length >= 3 && "grid-cols-1 md:grid-cols-3"
              )}
            >
              {topBids.map((keyItem, index) => (
                <PodiumCard
                  key={keyItem.id}
                  keyData={keyItem}
                  rank={index + 1}
                  onOutbid={(key) => {
                    setSelectedKey(key);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </ScrollReveal>
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
    </section>
  );
}
