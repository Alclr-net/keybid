'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { COMPANIES } from '@/app/data/keybidData';
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
  IconCopy,
  IconTrophy,
  IconWorld,
  IconPointFilled,
  IconRefresh,
} from '@tabler/icons-react';

const TOP5 = [...COMPANIES].sort((a, b) => b.bid - a.bid).slice(0, 5);
const POOL = COMPANIES.reduce((s, c) => s + c.bid, 0);

/* ─────────────────────────── Traffic lights ─────────────────────────── */
function TrafficLights() {
  return (
    <div className="flex items-center gap-[7px]">
      <button
        className="w-3 h-3 rounded-full bg-[#ff5f57] ring-1 ring-black/15 flex items-center justify-center hover:brightness-90 transition-all cursor-pointer"
        title="Close"
      />
      <button
        className="w-3 h-3 rounded-full bg-[#ffbd2e] ring-1 ring-black/15 flex items-center justify-center hover:brightness-90 transition-all cursor-pointer"
        title="Minimize"
      />
      <button
        className="w-3 h-3 rounded-full bg-[#28c840] ring-1 ring-black/15 flex items-center justify-center hover:brightness-90 transition-all cursor-pointer"
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
  const [searchValue, setSearchValue] = useState('https://www.keybid.lol');
  const [urlFocused, setUrlFocused] = useState(false);

  return (
    <div
      className={cn(
        'relative flex select-none w-full h-full max-w-5xl',
        'rounded-xl sm:rounded-2xl overflow-hidden',
        'bg-white dark:bg-black',
        'border border-black/15 dark:border-white/10',
        'shadow-[0_20px_50px_-10px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.1)_inset]',
        className,
      )}
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif' }}
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
                <span>Start Page</span>
              </button>

              {/* Tab Groups header & list */}
              <div>
                <p className="px-2 mb-1 text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                  Tab Groups
                </p>
                <ul className="space-y-0.5">
                  <li>
                    <button className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-left bg-black/[0.08] dark:bg-white/[0.12] text-zinc-950 dark:text-white font-semibold shadow-2xs cursor-pointer">
                      <IconTrophy size={13} stroke={2} className="text-amber-500" />
                      <span>Rankings</span>
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-left text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200 transition-all cursor-pointer">
                      <IconCopy size={12} stroke={1.8} className="opacity-75" />
                      <span>Keyboards</span>
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-left text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200 transition-all cursor-pointer">
                      <IconCopy size={12} stroke={1.8} className="opacity-75" />
                      <span>Trending</span>
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
              <span>Bookmarks</span>
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-0.5 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer">
              <ReadingGlassesIcon className="text-blue-500" />
              <span>Reading List</span>
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-0.5 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer">
              <IconUsers size={12} stroke={1.8} className="text-blue-500" />
              <span>Shared with You</span>
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-0.5 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer">
              <IconCloud size={12} stroke={1.8} className="text-blue-500" />
              <span>iCloud Tabs</span>
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
              className="p-1 rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.05] text-zinc-500 dark:text-zinc-400 ml-0.5 transition-colors cursor-pointer"
              title="Privacy Report"
            >
              <IconShield size={13} stroke={1.8} />
            </button>
            <button
              className="p-1 rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.05] text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
              title="Tracking Protection"
            >
              <IconShieldCheck size={13} stroke={1.8} />
            </button>
          </div>

          {/* Center Address / Search Pill */}
          <div
            className={cn(
              'flex-1 max-w-[380px] mx-auto h-[24px] flex items-center justify-center gap-1.5 px-3 rounded-lg text-[11px] transition-all',
              urlFocused
                ? 'bg-white dark:bg-black ring-2 ring-blue-500/40 border border-blue-500/60 shadow-xs'
                : 'bg-black/[0.04] dark:bg-neutral-900/90 border border-black/[0.06] dark:border-white/[0.1] hover:border-black/[0.15] dark:hover:border-white/[0.2]',
            )}
          >
            <IconSearch size={10} className="text-zinc-400 dark:text-zinc-500 shrink-0" stroke={2} />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setUrlFocused(true)}
              onBlur={() => setUrlFocused(false)}
              className="w-full min-w-0 bg-transparent border-none outline-none text-center text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 font-medium"
              placeholder="Search or enter website name"
            />
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
        <nav className="h-7 shrink-0 flex items-center px-2 gap-1 border-b border-black/[0.06] dark:border-white/[0.08] bg-neutral-50/90 dark:bg-black/90 backdrop-blur-md overflow-hidden">
          {/* Pin icon */}
          <div className="px-1 text-zinc-400 dark:text-zinc-500 shrink-0">
            <IconPin size={10} className="-rotate-45" stroke={2} />
          </div>

          {/* Only Ranking Tab */}
          <div className="flex items-center gap-1.5 h-5.5 px-3 rounded-md text-[10.5px] bg-white text-zinc-900 dark:bg-neutral-900 dark:text-white shadow-2xs font-semibold select-none cursor-default border border-black/[0.06] dark:border-white/[0.1]">
            <IconTrophy size={11} className="text-amber-500 shrink-0" stroke={2} />
            <span className="text-[10px]">Rankings</span>
            <span className="text-[9px] px-1 py-0.2 rounded-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold ml-1">
              Live
            </span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2 text-[9.5px] text-zinc-500 dark:text-zinc-400 pr-1">
            <span className="font-mono">Pool: ${POOL}</span>
            <span className="text-zinc-300 dark:text-zinc-600">·</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <IconPointFilled size={7} className="animate-pulse" />
              124 online
            </span>
          </div>
        </nav>

        {/* ── Main Canvas Content Area: Fitted to Window with Zero Drag Scrollbars ── */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden p-2.5 sm:p-3 bg-white dark:bg-black">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-1.5 px-1.5 border-b border-black/[0.05] dark:border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <IconTrophy size={13} className="text-amber-500" stroke={2} />
              <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">Live Rankings Leaderboard</span>
              <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 ml-1">
                Top 5 startups
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono hidden sm:inline">
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
          <div className="flex-1 flex flex-col justify-around py-0.5 space-y-1">
            {TOP5.map((company, i) => {
              const isLeader = i === 0;
              return (
                <div
                  key={company.id}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-lg border transition-all cursor-default group',
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
                      <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">{i + 1}</span>
                    )}
                  </div>

                  {/* Company icon */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={company.iconUrl}
                    alt={company.name}
                    className="w-8 h-8 rounded-lg object-contain shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
                    }}
                  />

                  {/* Name + tagline */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-[11px] font-bold leading-tight truncate',
                        isLeader ? 'text-amber-700 dark:text-amber-300' : 'text-zinc-900 dark:text-zinc-100',
                      )}
                    >
                      {company.name}
                    </p>
                    <p className="text-[9px] text-zinc-500 dark:text-zinc-400 truncate leading-tight mt-0.5">
                      {company.tagline}
                    </p>
                  </div>

                  {/* Clicks */}
                  <div className="hidden sm:block text-right shrink-0">
                    <span className="text-[8.5px] font-mono text-zinc-400 dark:text-zinc-500">
                      {company.clicks} clicks
                    </span>
                  </div>

                  {/* Key Slot Badge */}
                  <div
                    className={cn(
                      'w-5 h-5 flex items-center justify-center rounded border shrink-0 text-[9.5px] font-black',
                      isLeader
                        ? 'border-amber-400/40 bg-amber-400/15 text-amber-700 dark:text-amber-400'
                        : 'border-black/[0.08] bg-black/[0.03] text-zinc-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400',
                    )}
                  >
                    {company.keySlot}
                  </div>

                  {/* Bid */}
                  <div className="w-12 text-right shrink-0">
                    <span
                      className={cn(
                        'text-[11.5px] font-black',
                        isLeader ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-900 dark:text-zinc-200',
                      )}
                    >
                      ${company.bid}
                    </span>
                  </div>

                  {/* Outbid CTA */}
                  <Link
                    href={`/outbid/${company.id}`}
                    className={cn(
                      'shrink-0 flex items-center gap-1 px-2.5 py-0.5 rounded text-[9.5px] font-bold transition-all shadow-2xs cursor-pointer',
                      isLeader
                        ? 'bg-amber-500 hover:bg-amber-400 text-black'
                        : 'bg-violet-600 hover:bg-violet-500 text-white',
                    )}
                  >
                    <IconArrowUp size={9} stroke={2.5} />
                    Outbid
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Bottom Mini Safari Status Bar */}
          <div className="pt-1 px-1 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between text-[8.5px] text-zinc-400 dark:text-zinc-500 font-mono">
            <span className="flex items-center gap-1">
              <IconWorld size={9} />
              https://www.keybid.lol
            </span>
            <span>Total Pool: ${POOL}</span>
          </div>
        </div>
      </main>
    </div>
  );
}