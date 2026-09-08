"use client";

import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { cn } from "@/src/lib/utils";
import {
  IconCheck,
  IconDeviceLaptop,
  IconLink,
  IconChartBar,
  IconSparkles,
  IconVideo,
  IconFocus2,
} from "@tabler/icons-react";
import Ping from "../Ping";
import { TrafficLights } from "../MacWindow";

export interface TabItem {
  name: string;
  value: string;
  headline: string;
  badge: string;
  content: React.ReactNode;
  bullets: string[];
  mockup: React.ReactNode;
}

const keybidStudio: TabItem[] = [
  {
    name: "Magic Keyboard Keys",
    value: "keys",
    badge: "Physical Hardware Placement",
    headline: "Your logo on physical Magic Keyboard keys.",
    content: (
      <>
        Claim a key directly on my{" "}
        <span className="text-zinc-950 dark:text-white font-semibold">
          Apple Magic Keyboard
        </span>
        . Winning bidders receive custom precision UV-cured keycap decals that
        stay permanently on my daily-driver setup wherever I design and engineer.
      </>
    ),
    bullets: [
      "Precision 1200 DPI UV-cured resin with zero-glare matte finish",
      "Directly beneath my fingertips during 40+ weekly coding hours",
      "Engineered to withstand 100,000+ keystrokes per month",
    ],
    mockup: (
      <div className="w-full h-full min-h-[260px] rounded-2xl bg-zinc-900 border border-zinc-700/80 p-5 flex flex-col justify-between relative overflow-hidden text-white shadow-xl select-none">

        <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-600/20 rounded-full blur-2xl pointer-events-none " />

        {/* Mockup Header */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/10 pb-3">
          <span className="flex items-center gap-1.5 text-blue-400 font-bold">

            KEYCAP SPECIFICATION
          </span>
          <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-zinc-300">Apple A2450</span>
        </div>

        {/* 3D Keycap Visual */}
        <div className="py-4 flex items-center justify-center gap-6">
          <div className="relative flex flex-col items-center">

            {/* Caliper measurement lines */}
            <div className="absolute -top-4 text-[10px] font-mono text-blue-400">18.0 mm</div>

            {/* Simulated 3D Keycap */}
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-b from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 border-2 border-blue-500 shadow-[0_12px_24px_rgba(0,0,0,0.4),inset_0_2px_1px_rgba(255,255,255,0.4)] flex flex-col items-center justify-center p-2 relative group">

              {/* Logo Decal */}
              <div className={cn(" flex items-center justify-center absolute inset-0  text-black/70 text-shadow-xs text-center font-bold  text-xl")}>K</div>
            </div>

            <div className="mt-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <Ping>
                <p>
                  UV Print Adhesion
                </p>
              </Ping>

            </div>
          </div>

          <div className="text-left space-y-2 text-xs font-mono">
            <div className="text-zinc-400 text-[11px]">Material Layer:</div>
            <div className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-[11px] text-zinc-200">
              01 Polycarbonate Base
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-[11px] text-blue-400">
              02 High-Density UV Pigment
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-[11px] text-zinc-200">
              03 Matte Protective Clear-Coat
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span>Decal Thickness: 0.08mm</span>
          <span className="text-emerald-400">Zero Touch Interference</span>
        </div>
      </div>
    ),
  },
  {
    name: "Studio Workstation",
    value: "display",
    badge: "Daily Desk & Screencasts",
    headline: "Front and center on my desk setup.",
    content: (
      <>
        Showcase your brand front and center on my{" "}
        <span className="text-zinc-950 dark:text-white font-semibold">
          Apple Magic Keyboard
        </span>
        . Featured daily in design engineering screencasts, live demo videos, desk tours, and tech community meetups.
      </>
    ),
    bullets: [
      "Appears in live build sessions shared across Twitter, YouTube & LinkedIn",
      "High-definition 4K top-down keyboard angle in featured tutorials",
      "Estimated 45,000+ targeted monthly engineering impressions",
    ],
    mockup: (
      <div className="w-full h-full min-h-[260px] rounded-2xl bg-zinc-900 border border-zinc-700/80 p-5 flex flex-col justify-between relative overflow-hidden text-white shadow-xl select-none">
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Mockup Header */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/10 pb-3">
          <span className="flex items-center gap-1.5 text-rose-400 font-bold">
            <Ping color={"bg-red-500"}>
              <p>
                LIVE SCREENCAST STREAM
              </p>
            </Ping>

          </span>
          <span className="text-[11px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">4K 60FPS</span>
        </div>

        {/* Studio Desk Mock */}
        <div className="py-3 flex flex-col items-center justify-center gap-3">
          {/* Mini Monitor Frame */}
          <div className="w-full max-w-[280px] h-24 rounded-xl bg-black border border-zinc-700 p-2 relative flex flex-col justify-between shadow-inner">
            <div className="flex items-center gap-1">
              <TrafficLights size="sm" />
              <span className="ml-2 font-mono text-[9px] text-zinc-500">app/components/ui.tsx</span>
            </div>
            <div className="font-mono text-[9px] text-blue-400/80 line-clamp-2">
              const sponsorKey = useKeyboardKey(&quot;V&quot;);<br />
              render(&lt;Keycap logo=&#123;sponsorKey&#125; /&gt;);
            </div>
            <div className="text-[8px] font-mono text-zinc-600 text-right">VS Code · Next.js 15</div>
          </div>


        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span>Camera: Top-Down 4K Cam</span>
          <span className="text-zinc-300">Get Monthly Reach</span>
        </div>
      </div>
    ),
  },
  {
    name: "Live Backlink",
    value: "backlink",
    badge: "SEO & Instant Traffic",
    headline: "365 days of guaranteed traffic.",
    content: (
      <>
        Gain a permanent, clickable{" "}
        <span className="text-zinc-950 dark:text-white font-semibold">
          sponsor backlink
        </span>{" "}
        on Keybid. Track real-time click metrics, capture viral developer and designer
        attention, and secure high-intent inbound visits for your startup.
      </>
    ),
    bullets: [
      "Permanent dofollow backlink indexing on high-intent developer domain",
      "Live transparent telemetry dashboard with exact click tracking",
      "Direct inbound referrals from founders, engineers, and VCs",
    ],
    mockup: (
      <div className="w-full h-full min-h-[260px] rounded-2xl bg-zinc-900 border border-zinc-700/80 p-5 flex flex-col justify-between relative overflow-hidden text-white shadow-xl select-none">
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Mockup Header */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/10 pb-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <IconChartBar size={14} className="fill-emerald-400" />
            LIVE TRAFFIC & TELEMETRY
          </span>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Active 365d</span>
        </div>

        {/* Analytics Mock */}
        <div className="py-2 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-400">Total Inbound Clicks</div>
              <div className="font-mono text-2xl font-black text-white flex items-center gap-2">
                <span>4,820</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                  +34% this week
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono uppercase text-zinc-400">Link Type</div>
              <div className="text-xs font-mono font-bold text-blue-400">Dofollow / Direct</div>
            </div>
          </div>

          {/* Referral source distribution */}
          <div className="space-y-1.5 text-[11px] font-mono">
            <div className="flex justify-between text-zinc-400 text-[10px]">
              <span>Referral Breakdown</span>
              <span>Top: Tech Founders</span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden flex">
              <div className="w-[45%] h-full bg-blue-500" title="Developer Screencasts (45%)" />
              <div className="w-[30%] h-full bg-emerald-500" title="KeyBid Direct (30%)" />
              <div className="w-[25%] h-full bg-purple-500" title="Social/Viral (25%)" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
              <Ping color={"bg-blue-600"}>
                Screencast 45%
              </Ping>
              <Ping color={"bg-emerald-600"}>
                KeyBid 30%
              </Ping>
              <Ping color={"bg-purple-600"}>
                Social 25%
              </Ping>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span className="flex items-center gap-1 text-zinc-300">
            <IconLink size={12} className="text-blue-400 rotate-45" />
            Verified SEO Backlink
          </span>
          <span className="text-emerald-400">Instant HTTP Redirect</span>
        </div>
      </div>
    ),
  },
];

interface Tabs8Props {
  items?: TabItem[];
  defaultValue?: string;
  className?: string;
}

const Tabs8 = ({
  items = keybidStudio,
  defaultValue = "keys",
  className,
}: Tabs8Props) => {
  return (
    <Tabs defaultValue={defaultValue} className={`w-full gap-6 ${className || ""}`}>
      {/* Tab Navigation Pill Bar */}
      <div className="w-fit max-w-full overflow-x-auto overflow-y-hidden scrollbar-hide py-1">
        <TabsList className="bg-transparent flex w-max justify-start gap-2 p-0">
          {items.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer select-none",
                "bg-zinc-100 dark:bg-zinc-900 text-zinc-600  dark:text-zinc-200",
                "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                "border border-zinc-200/90 dark:border-white/10 data-[state=active]:border-blue-600",
                "data-[state=active]:shadow-[0_4px_16px_rgba(37,99,235,0),inset_0_1px_0.5px_rgba(255,255,255,0.25)] "

              )}
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Tab Contents with Split 2-Column Mockup View */}
      {items.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="pt-2 transition-opacity duration-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-300 dark:border-white/10 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
            {/* Left Column: Subheading & Copy */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Tightened Subheading Hierarchy (Subservient to H2/H3) */}
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-mono font-bold uppercase tracking-wider mb-2.5">
                  <span>{tab.badge}</span>
                </div>

                <div className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-3 text-shadow-xs">

                  <span>{tab.headline}</span>
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
                  {tab.content}
                </p>

                {/* Key Bullet Checklist */}
                <div className="mt-5 space-y-2.5">
                  {tab.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                      <span className="w-4 h-4 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <IconCheck size={11} stroke={3} />
                      </span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-200 dark:border-white/10 flex items-center gap-2 text-xs font-mono text-zinc-500">
                <Ping color={"bg-blue-600"}>
                  Live placement active immediately upon auction close
                </Ping>
              </div>
            </div>

            {/* Right Column: Tailored Interactive Mockup */}
            <div className="lg:col-span-6 flex items-center">
              {tab.mockup}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Tabs8;
