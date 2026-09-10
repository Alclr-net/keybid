"use client";

import React, { useState, useEffect } from "react";
import { useMotionValue, useMotionTemplate, motion } from "motion/react";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import { generateRandomString, Icon } from "@/src/components/ui/evervault-card";
import { cn } from "@/src/lib/utils";
import Ping from "./Ping";
import { useKeysStore } from "@/lib/store/keysStore";
import { HOW_IT_WORKS_STEPS, type StepItem } from "@/lib/constant";

function HowItWorksEvervaultCard({ step }: { step: StepItem }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [randomString, setRandomString] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRandomString(generateRandomString(1200));
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    const str = generateRandomString(1200);
    setRandomString(str);
  }

  const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div
      onMouseMove={onMouseMove}
      className={cn(
        "group/card relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl border transition-all duration-300 overflow-hidden select-none cursor-pointer",
        "bg-white dark:bg-zinc-900/50 border-zinc-300 dark:border-white/10 backdrop-blur-xl",
        "shadow-[0_8px_30px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:scale-108 hover:border-zinc-400 dark:hover:border-white/25",
        "h-full min-h-[240px] sm:min-h-[360px]"
      )}
    >
      {/* Corner crosshair icons */}
      <Icon className="absolute h-5 w-5 -top-2.5 -left-2.5 text-zinc-300 dark:text-zinc-700 group-hover/card:text-blue-500 transition-colors pointer-events-none" />
      <Icon className="absolute h-5 w-5 -bottom-2.5 -left-2.5 text-zinc-300 dark:text-zinc-700 group-hover/card:text-blue-500 transition-colors pointer-events-none" />
      <Icon className="absolute h-5 w-5 -top-2.5 -right-2.5 text-zinc-300 dark:text-zinc-700 group-hover/card:text-blue-500 transition-colors pointer-events-none" />
      <Icon className="absolute h-5 w-5 -bottom-2.5 -right-2.5 text-zinc-300 dark:text-zinc-700 group-hover/card:text-blue-500 transition-colors pointer-events-none" />

      {/* ── Background Evervault Encrypted Matrix on Hover ── */}
      {mounted && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-blue-500/10 to-indigo-600/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 backdrop-blur-xs"
            style={style}
          />
          <motion.div
            className="absolute inset-0 opacity-0 group-hover/card:opacity-35 dark:group-hover/card:opacity-40 transition-opacity duration-300"
            style={style}
          >
            <p className="absolute inset-x-0 top-0 text-[10px] sm:text-xs h-full break-words whitespace-pre-wrap text-blue-600 dark:text-blue-400 font-mono font-bold leading-tight select-none">
              {randomString}
            </p>
          </motion.div>
        </div>
      )}

      {/* ── Foreground Content ── */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Step Number */}
          <div className="flex items-center justify-between mb-5">
            <span className="font-mono text-sm sm:text-base font-bold text-zinc-400 dark:text-zinc-500 group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors">
              {step.num}
            </span>
            <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover/card:bg-blue-500 group-hover/card:shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all" />
          </div>

          {/* Title */}
          <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-white leading-snug group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors">
            {step.title}
          </h3>

          {/* Description */}
          <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            {step.desc}
          </p>
        </div>

        {/* Bottom Pill Tag */}
        <div className="pt-6 mt-auto">
          <span className="inline-flex items-center text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded-full border border-zinc-200/80 dark:border-white/10 bg-zinc-100/70 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 group-hover/card:border-blue-500/30 group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors">
            {step.tag}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  const keysList = useKeysStore((state) => state.keys);

  const totalPool = keysList.reduce((acc, k) => acc + (k.current_bid_amount || 0), 0);
  const claimedCount = keysList.length;

  return (
    <section id="how-it-works" className="w-full py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-10 sm:mb-14">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight text-shadow-xs">
              How it works.
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal">
              Simple, transparent, and one-of-a-kind.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Cards Grid with Evervault Hover Reveal */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch text-shadow-xs ">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <HowItWorksEvervaultCard key={step.num} step={step} />
            ))}
          </div>
        </ScrollReveal>

        {/* ── Standalone Visual Break: Hardware UV-Printing & $2,400+ Stat ── */}
        <ScrollReveal delay={0.12} distance={25}>
          <div className="my-16 sm:my-20 relative overflow-hidden rounded-3xl bg-[#090b14] border border-blue-500/20 shadow-[0_20px_60px_-15px_rgba(30,58,138,0.25)] p-8 sm:p-12 text-white select-none">
            {/* Ambient Background Glows & Laser Grid */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Animated Laser UV Print Beam across top */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-70 animate-pulse" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
              {/* Left Column: Big Single Stat */}
              <div className="max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-400 text-xs font-mono font-bold mb-4">
                  <Ping color={'bg-blue-400'}>

                    <span>HARDWARE PRODUCTION SPOTLIGHT</span>
                  </Ping>
                </div>

                <div className="font-mono text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white flex items-baseline gap-1">
                  <span>${totalPool > 0 ? `${totalPool.toLocaleString()}+` : "$0"}</span>
                </div>

                <p className="font-display text-lg sm:text-xl font-bold text-zinc-200 mt-2">
                  Claimed in active auction volume across {claimedCount > 0 ? claimedCount : "28"} keyboard {claimedCount === 1 ? "key" : "keys"}.
                </p>

                <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed">
                  Every winning sponsor decal is custom precision UV-cured at 1200 DPI onto genuine Apple anodized aluminum and matte polycarbonate keycaps. Built for 100,000+ keystrokes per month under live daily engineering workflows.
                </p>
              </div>

              {/* Right Column: Physical UV Print Blueprint Spec Card */}
              <div className="w-full lg:w-auto flex-1 max-w-lg bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono text-zinc-400">
                  <span className="text-blue-400 font-bold uppercase">UV-Decal Precision Specs</span>
                  <span>Tolerance: ±0.05mm</span>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 text-center">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <div className="font-mono text-base sm:text-lg font-extrabold text-white">18×18 mm</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">Keycap Area</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <div className="font-mono text-base sm:text-lg font-extrabold text-blue-400">1200 DPI</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">UV-Cured Resin</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <div className="font-mono text-base sm:text-lg font-extrabold text-emerald-400">365 Days</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">Daily Live Desk</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Adhesion: Industrial Grade
                  </span>
                  <span>Zero Glare Matte Finish</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
