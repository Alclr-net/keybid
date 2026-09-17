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
        "group/card relative flex flex-col justify-between p-5 sm:p-7 rounded-2xl border transition-all duration-300 overflow-hidden select-none cursor-pointer",
        "bg-white dark:bg-zinc-900/50 border-zinc-300 dark:border-white/10 backdrop-blur-xl",
        "shadow-[0_8px_30px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-2xl sm:hover:scale-[1.03] hover:border-zinc-400 dark:hover:border-white/25",
        "h-full min-h-[220px] sm:min-h-[340px]"
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
    <section id="how-it-works" className="w-full py-14 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-8 sm:mb-14">
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight text-shadow-xs">
              How it works.
            </h2>
            <p className="mt-2 text-xs sm:text-base text-zinc-600 dark:text-zinc-400 font-normal">
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

      </div>
    </section>
  );
}
