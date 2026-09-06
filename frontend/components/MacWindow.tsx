'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { COMPANIES, Company } from '@/app/data/keybidData';
import OutbidModal from '@/components/OutbidModal';
import {
  IconChevronLeft,
  IconChevronRight,
  IconLayoutSidebar,
  IconSquare,
  IconSquarePlus,
  IconShare,
  IconSearch,
  IconStar,
  IconBookmark,
  IconUsers,
  IconPlus,
  IconArrowUp,
  IconShield,
  IconShieldCheck,
  IconPin,
  IconCloud,
  IconX,
  IconCopy,
  IconTrophy,
  IconWorld,
  IconPointFilled,
  IconRefresh,
  IconHandClick,
  IconMedal,
} from '@tabler/icons-react';

const TOP5 = [...COMPANIES].sort((a, b) => b.bid - a.bid).slice(0, 5);
const POOL = COMPANIES.reduce((s, c) => s + c.bid, 0);

/* ─────────────────────────── Traffic lights ─────────────────────────── */
function TrafficLights() {
  return (
    <div className="flex items-center gap-[7px]">
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 20, delay: 0.35 }}
        className={cn("w-3 h-3 rounded-full bg-[#ff5f57] flex items-center justify-center hover:brightness-90 transition-all cursor-pointer",
          "shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1.5px_1px_0.5px_rgba(255,255,255,0.2),inset_0_-2px_1px_0.05px_rgba(0,0,0,0.1)]"
        )}
        title="Close"
      />
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 20, delay: 0.40 }}
        className={cn("w-3 h-3 rounded-full bg-[#ffbd2e] flex items-center justify-center hover:brightness-90 transition-all cursor-pointer",
          "shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1.5px_1px_0.5px_rgba(255,255,255,0.2),inset_0_-2px_1px_0.05px_rgba(0,0,0,0.1)]"
        )}
        title="Minimize"
      />
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 20, delay: 0.45 }}
        className={cn("w-3 h-3 rounded-full bg-[#28c840] flex items-center justify-center hover:brightness-90 transition-all cursor-pointer",
          "shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1.5px_1px_0.5px_rgba(255,255,255,0.2),inset_0_-2px_1px_0.05px_rgba(0,0,0,0.1)]"
        )}
        title="Zoom"
      />
    </div>
  );
}

/* ─────────────────────────── Reading glasses icon ─────────────────────────── */
function ReadingGlassesIcon({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="6" cy="14" r="4" />
      <circle cx="18" cy="14" r="4" />
      <path d="M10 14h4" />
      <path d="M6 10l2 -6" />
      <path d="M18 10l-2 -6" />
    </svg>
  );
}

/* ═══════════════════════════ MacWindow (iOS/macOS Safari) ═══════════════════════════ */
export default function MacWindow({ className }: { className?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 24,
        mass: 0.8,
        delay: 0.2,
      }}
      className={cn(
        'relative flex select-none w-full h-full max-w-5xl',
        'rounded-xl sm:rounded-2xl overflow-hidden',
        'bg-white dark:bg-black',
        'border border-black/15 dark:border-white/10',
        'shadow-[0_20px_50px_-10px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.1)_inset]',
        className,
      )}
    >
      {/* ══ LEFT FULL-HEIGHT UNIFIED SIDEBAR ══ */}
      {sidebarOpen && (
        <aside className="w-[160px] sm:w-[180px] shrink-0 flex flex-col justify-between bg-[#fbfbfb]/90 dark:bg-black/95 backdrop-blur-2xl border-r border-black/[0.08] dark:border-white/[0.1] overflow-hidden">
          {/* Top section: Traffic lights + Sidebar controls */}
          <div>
            <div className="h-9 px-3 pt-1 flex items-center justify-between">
              <TrafficLights />
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-md text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                  title="Hide Sidebar"
                >
                  <IconLayoutSidebar size={13} stroke={1.7} />
                </button>
                <button
                  className="p-1 rounded-md text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                  title="New Tab Group"
                >
                  <IconSquarePlus size={13} stroke={1.7} />
                </button>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="px-2 py-1 space-y-2.5 text-[10.5px]">
              {/* Start Page button */}
              <button className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-left text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors cursor-pointer">
                <div className="w-3.5 h-3.5 rounded border border-zinc-400/80 dark:border-zinc-500/80 flex items-center justify-center p-[1.5px]">
                  <div className="w-full h-full border-t border-zinc-400/80 dark:border-zinc-500/80" />
                </div>
                <span className={cn("text-shadow-xs")}>Start Page</span>
              </button>

              {/* Tab Groups header & list */}
              <div>
                <p className={cn("px-2 mb-1 text-[8px] font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase text-shadow-xs")}>
                  Tab Groups
                </p>
                <ul className="space-y-0.5">
                  <li>
                    <button className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-left bg-black/[0.08] dark:bg-white/[0.12] text-zinc-950 dark:text-white font-semibold shadow-2xs cursor-pointer">
                      <IconTrophy size={13} stroke={2} className="text-amber-500" />
                      <span className={cn("text-shadow-xs")}> Top 5 Rankings</span>
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-left text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200 transition-all cursor-pointer">
                      <IconCopy size={12} stroke={1.8} className="opacity-75" />
                      <span className={cn("text-shadow-xs")}>Keyboards</span>
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-left text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200 transition-all cursor-pointer">
                      <IconCopy size={12} stroke={1.8} className="opacity-75" />
                      <span className={cn("text-shadow-xs")}>Trending</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Sidebar section: Bookmarks, Reading List, Shared with You, iCloud Tabs */}
          <div className="px-2 py-2 border-t border-black/[0.06] dark:border-white/[0.06] text-[10.5px] text-zinc-600 dark:text-zinc-400 space-y-0.5">
            <button className="w-full flex items-center gap-2 px-2 py-0.5 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer">
              <IconBookmark size={12} stroke={1.8} className="text-blue-500" />
              <span className={cn("text-shadow-xs")}>Bookmarks</span>
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-0.5 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer">
              <ReadingGlassesIcon className="text-blue-500" />
              <span className={cn("text-shadow-xs")}>Reading List</span>
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-0.5 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer">
              <IconUsers size={12} stroke={1.8} className="text-blue-500" />
              <span className={cn("text-shadow-xs")}>Shared with You</span>
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-0.5 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer">
              <IconCloud size={12} stroke={1.8} className="text-blue-500" />
              <span className={cn("text-shadow-xs")}>iCloud Tabs</span>
            </button>
          </div>
        </aside>
      )}

      {/* ══ RIGHT MAIN BROWSER AREA ══ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-black">
        {/* ── Top Unified Toolbar ── */}
        <header className="h-9 shrink-0 flex items-center gap-2 px-3 border-b border-black/[0.07] dark:border-white/[0.08] bg-white/95 dark:bg-black/95 backdrop-blur-md">
          {/* If sidebar is closed, show traffic lights & toggle on toolbar */}
          {!sidebarOpen && (
            <div className="flex items-center gap-2 mr-1">
              <TrafficLights />
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1 rounded-md text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors ml-1 cursor-pointer"
                title="Show Sidebar"
              >
                <IconLayoutSidebar size={13} stroke={1.7} />
              </button>
            </div>
          )}

          {/* Left navigation controls */}
          <div className="flex items-center gap-0.5 text-zinc-500 dark:text-zinc-400">
            <button
              className="p-1 rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.05] hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              title="Back"
            >
              <IconChevronLeft size={15} stroke={1.8} />
            </button>
            <button
              className="p-1 rounded-md text-zinc-300 dark:text-zinc-600 cursor-not-allowed"
              title="Forward"
            >
              <IconChevronRight size={15} stroke={1.8} />
            </button>

            <button
              className="p-1 rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.05] text-green-500 dark:text-green-400 transition-colors cursor-pointer"
              title="Tracking Protection"
            >
              <IconShieldCheck size={13} stroke={1.8} />
            </button>
          </div>

          {/* Center Address / Search Pill */}
          <div
            className={cn(
              'flex-1 max-w-[380px] mx-auto h-[24px] flex items-center justify-center gap-1.5 px-3 rounded-lg text-[11px] transition-all',
              "shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]",
              'bg-black/[0.04] dark:bg-neutral-900/90 ',
            )}
          >
            <IconSearch size={10} className="text-zinc-400 dark:text-zinc-500 shrink-0" stroke={2} />
            <div

              className={cn("w-full min-w-0 bg-transparent border-none outline-none text-center text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400/50 dark:placeholder:text-zinc-500 font-medium cursor-pointer",

              )}

            >
              <p className={cn("text-shadow-xs")}>
                https://www.keybid.lol
              </p>
            </div>

          </div>

          {/* Right Toolbar Action Icons */}
          <div className="flex items-center gap-0.5 text-zinc-600 dark:text-zinc-400">
            <button
              className="p-1 rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.05] hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              title="Share"
            >
              <IconShare size={13} stroke={1.7} />
            </button>
            <button
              className="p-1 rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.05] hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              title="New Tab"
            >
              <IconPlus size={13} stroke={1.8} />
            </button>
            <button
              className="p-1 rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.05] hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              title="Tab Overview"
            >
              <IconSquare size={13} stroke={1.7} />
            </button>
          </div>
        </header>

        {/* ── Sub-toolbar: Tab Strip (Only Rankings Tab!) ── */}
        <nav className=" shrink-0 flex items-center gap-1 border-b border-black/[0.06] dark:border-white/[0.08] bg-neutral-50/90 dark:bg-black/90 backdrop-blur-md overflow-hidden">
          {/* Pin icon */}


          {/* Only Ranking Tab */}
          <div className="flex items-center gap-1.5   py-2 px-2 text-[10.5px] bg-white text-zinc-900 dark:bg-neutral-900 dark:text-white shadow-xs font-semibold select-none cursor-default group cursor-pointer">
            <div className="px-1 text-zinc-400 dark:text-zinc-500 shrink-0">
              <IconPin size={13} className="-rotate-45 " stroke={2} />
            </div>
            <span className={cn("text-shadow-xs")}> Top 5 Startup</span>
            <IconX size={10} className={cn(" text-transparent group-hover:text-neutral-400 dark:group-hover:text-neutral-500 transition-color duration-300 ease-out")} stroke={2} />
          </div>


        </nav>

        {/* ── Main Canvas Content Area: Fitted to Window with Zero Drag Scrollbars ── */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden p-2.5 sm:p-3 bg-white dark:bg-black">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-1.5 px-1.5 border-b border-black/[0.05] dark:border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] px-1 py-0.2 rounded-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold ml-1 shadow-2xs text-shadow-xs   border-[0.5px] border-emerald-500/30">
                Live
              </span>
              <span className="text-[11px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 text-shadow-xs">Rankings Leaderboard</span>


            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono hidden sm:inline text-shadow-xs tracking-tight">
                sorted by bid
              </span>
              <button
                className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                title="Refresh"
              >
                <IconRefresh size={11} stroke={1.8} />
              </button>
            </div>
          </div>

          {/* All 5 Company Rows Fitted Neatly (No Scrolling!) */}
          <div className="flex-1 flex flex-col justify-around space-y-1">
            {TOP5.map((company, i) => {
              const isLeader = i === 0;
              return (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.38 + i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-4  rounded-xl border transition-all cursor-default group ',
                    "shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]",
                    isLeader
                      ? 'bg-gradient-to-r from-amber-500/[0.12] via-amber-500/[0.03] to-transparent border-amber-500/35'
                      : 'bg-neutral-50/70 dark:bg-neutral-950/70 border-black/[0.05] dark:border-white/[0.06] hover:bg-neutral-100/70 dark:hover:bg-neutral-900/60',
                  )}
                >
                  {/* Rank number / trophy */}
                  <div className="w-4 text-center shrink-0">
                    {isLeader ? (
                      <IconTrophy size={12} className="text-amber-500 mx-auto" />
                    ) : (
                      <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 text-shadow-xs">#{i + 1}</span>
                    )}
                  </div>

                  {/* Company icon */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={company.iconUrl}
                    alt={company.name}
                    className="w-8 h-8 rounded-lg object-contain shrink-0 "
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
                    }}
                  />

                  {/* Name + tagline */}
                  <div className="flex-1 min-w-0">
                    <div className={cn(" flex items-center gap-1")}>

                      <p
                        className={cn(
                          'text-[12px] font-semibold tracking-tight leading-tight truncate text-shadow-xs',
                          isLeader ? 'text-amber-700 dark:text-amber-300' : 'text-zinc-900 dark:text-zinc-100',
                        )}
                      >
                        {company.name}
                      </p>
                      <p className="text-[8px] font-normal text-neutral-400 truncate leading-tight mt-0.5">
                        / Claimed key <span className="text-blue-600 dark:text-blue-400 font-medium text-shadow-xs">{company.keySlot}</span>
                      </p>
                    </div>
                    <p className="text-[9px] font-normal text-neutral-500 dark:text-neutral-400 truncate leading-tight mt-0.5">
                      {company.tagline}
                    </p>
                  </div>

                  {/* Clicks */}
                  <div className=" flex justify-center items-center gap-1 text-right shrink-0">
                    <IconHandClick size={10} className={cn("text-blue-600 dark:text-blue-400")} stroke={2} />
                    <span className="text-[11px] font-mono  text-zinc-600 dark:text-zinc-400">
                      {company.clicks}
                    </span>
                  </div>

                  {/* Outbid CTA */}
                  <div className={cn("p-[2px] rounded-md transition-all duration-200 ease-out shadow-xs",
                    isLeader ? "bg-amber-500/25" : "bg-blue-600/20"
                  )}>
                    <button
                      type="button"
                      onClick={() => setSelectedCompany(company)}
                      className={cn(
                        'shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-[5px] text-xs font-bold transition-colors cursor-pointer shadow-2xs',
                        "shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]",
                        isLeader
                          ? 'bg-amber-400 hover:bg-amber-500 text-black active:bg-amber-600'
                          : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-600/50 disabled:text-white/50',
                      )}
                    >
                      <p className={cn("text-xs text-shadow-xs font-bold flex items-center gap-1")}>
                        Outbid for
                        <span>
                          ${company.bid + 1}
                        </span>
                      </p>
                    </button>
                  </div>
                </motion.div>

              );
            })}
          </div>
        </div>
      </main >

      {/* Outbid Modal */}
      <OutbidModal
        company={selectedCompany}
        isOpen={!!selectedCompany}
        onClose={() => setSelectedCompany(null)}
      />
    </motion.div >
  );
}