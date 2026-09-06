"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { COMPANIES, Company } from "@/app/data/keybidData";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Ping from "@/components/Ping";
import OutbidModal from "@/components/OutbidModal";
import { cn } from "@/lib/utils";
import {
  IconArrowUp,
  IconExternalLink,
  IconHandClick,
  IconSparkles,
  IconCrown,
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
    label: "Rank #1 Champion",
    badgeBg: "bg-amber-500/10 dark:bg-amber-500/20",
    badgeText: "text-amber-700 dark:text-amber-400",
    badgeBorder: "border-amber-500/40",
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
    label: "Rank #2 Silver",
    badgeBg: "bg-slate-500/10 dark:bg-slate-400/20",
    badgeText: "text-slate-700 dark:text-slate-300",
    badgeBorder: "border-slate-400/40",
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
    label: "Rank #3 Bronze",
    badgeBg: "bg-amber-900/10 dark:bg-amber-800/20",
    badgeText: "text-amber-800 dark:text-amber-500",
    badgeBorder: "border-amber-700/40",
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
  company,
  rank,
  onOutbid,
}: {
  company: Company;
  rank: number;
  onOutbid: (company: Company) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const config = PODIUM_CONFIG[rank] || PODIUM_CONFIG[3];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((prev) => !prev)}
      className={cn(
        "group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer select-none",
        "bg-white/95 dark:bg-zinc-900/85 border-zinc-200/90 dark:border-white/10 backdrop-blur-xl",
        "shadow-[0_4px_24px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_rgba(0,0,0,0.1)]",
        config.borderHover,
        "hover:-translate-y-1 hover:shadow-2xl"
      )}
    >
      {/* Corner crosshairs (Aceternity style) */}
      <CornerIcon className="absolute h-5 w-5 -top-2.5 -left-2.5 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
      <CornerIcon className="absolute h-5 w-5 -bottom-2.5 -left-2.5 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
      <CornerIcon className="absolute h-5 w-5 -top-2.5 -right-2.5 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
      <CornerIcon className="absolute h-5 w-5 -bottom-2.5 -right-2.5 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />

      {/* ── Background Canvas Reveal Effect on Hover ── */}
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
            {/* Ambient vignette gradient */}
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] bg-white/40  pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/40 dark:from-black/90 dark:via-transparent dark:to-black/50 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Foreground Card Content ── */}
      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        {/* Top Header: Rank & Keycap */}
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
          {company.iconUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={company.iconUrl}
              alt={company.name}
              className="w-12 h-12 rounded-lg object-contain shrink-0 "
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
              }}
            />
          ) : (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md">
              {company.name[0]}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-bold tracking-tight text-zinc-950 dark:text-white truncate">
                {company.name}
              </h3>
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-white transition-colors"
                title={`Visit ${company.name}`}
                onClick={(e) => e.stopPropagation()}
              >
                <IconExternalLink size={14} />
              </a>
            </div>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed font-normal">
              {company.tagline}
            </p>
          </div>
        </div>

        {/* Bid & Stats Display */}
        <div className="pt-3  dark:border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Leading Bid
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white text-shadow-sm">
              ${company.bid}
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 font-mono text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100/70 dark:bg-white/5 px-2.5 py-1 rounded-full border border-zinc-200/60 dark:border-white/5">
            <IconHandClick size={13} className="text-zinc-400" />
            <span>{company.clicks} clicks</span>
          </div>
        </div>

        {/* Outbid Action CTA */}
        <div className={cn("p-[2px] w-full rounded-md transition-all duration-200 ease-out shadow-xs",
          config.buttonOuterColor
        )}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOutbid(company);
            }}
            className={cn(
              "w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-[6px] text-xs font-bold transition-all cursor-pointer shadow-2xs",
              "shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]",
              config.buttonColor,
            )}
          >
            <p className={cn("text-lg text-shadow-xs font-bold flex items-center gap-1")}>
              Outbid for
              <span>
                ${company.bid + 1}
              </span>
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TopBidsCanvasReveal() {
  const topThree = [...COMPANIES].sort((a, b) => b.bid - a.bid).slice(0, 3);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  return (
    <section className="w-full py-12 sm:py-20 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <ScrollReveal delay={0.05} distance={20}>
          <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3 shadow-xs select-none">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {topThree.map((company, index) => (
              <PodiumCard
                key={company.id}
                company={company}
                rank={index + 1}
                onOutbid={setSelectedCompany}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Outbid Modal */}
      <OutbidModal
        company={selectedCompany}
        isOpen={!!selectedCompany}
        onClose={() => setSelectedCompany(null)}
      />
    </section>
  );
}
