'use client';

import React from 'react';
import { CloudShader } from '@/components/ui/cloud-shader';
import { cn } from '@/lib/utils';

export type HeroSectionProps = {
  className?: string;
  children?: React.ReactNode;
};

function HeroSection({ className, children }: HeroSectionProps) {
  return (
    <section className={cn("w-full py-4 sm:py-8 flex flex-col items-center justify-center", className)}>
      {/* ── Mac Studio Display Monitor Mockup ── */}
      <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center animate-[monitorReveal_0.9s_cubic-bezier(0.16,1,0.3,1)_both]">
        {/* Monitor Screen Frame / Bezel Chassis */}
        <div className="relative w-full aspect-[16/10] max-h-[580px] min-h-[320px] sm:min-h-[460px] rounded-[24px] sm:rounded-[36px] md:rounded-[44px] bg-[#0c0d0e] dark:bg-[#08080a] p-3 sm:p-4 md:p-5 border border-zinc-700/60 dark:border-white/10 ring-1 ring-black/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)] flex flex-col transition-all duration-300">

          {/* Top Bezel Camera & Sensor */}
          <div className="absolute top-2 sm:top-2.5 md:top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 pointer-events-none">
            {/* Camera Lens */}
            <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-black ring-1 ring-zinc-700/70 flex items-center justify-center shadow-inner">
              <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full bg-zinc-800 ring-1 ring-blue-500/20" />
            </div>
            {/* Ambient Light Sensor */}
            <div className="w-1 h-1 rounded-full bg-zinc-900 ring-1 ring-zinc-800/80" />
          </div>

          {/* Inner Display Screen Area */}
          <div className="relative w-full h-full rounded-[14px] sm:rounded-[20px] md:rounded-[26px] overflow-hidden bg-black ring-1 ring-white/10 shadow-inner">
            {/* Cloud Shader Screen Content */}
            {/* <CloudShader className="w-full h-full min-h-0">
              {children}
            </CloudShader> */}

            {/* Subtle Screen Glass Sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.07] mix-blend-screen" />

            {/* Inner Display Vignette Shadow */}
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_24px_rgba(0,0,0,0.35)]" />
          </div>
        </div>

        {/* ── Studio Display Stand ── */}
        <div className="flex flex-col items-center -mt-[1px] select-none pointer-events-none">
          {/* Stand Hinge Connection */}
          <div className="w-24 sm:w-32 h-1.5 bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-700 rounded-t-sm shadow-sm" />

          {/* Stand Neck with Cable Pass-Through Hole */}
          <div className="w-20 sm:w-28 h-8 sm:h-12 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 border-x border-zinc-600/30 shadow-md flex items-center justify-center">
            <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-zinc-950 border border-zinc-700/50 shadow-inner" />
          </div>

          {/* Stand Foot / Base */}
          <div className="w-40 sm:w-56 h-2.5 sm:h-3 rounded-b-xl bg-gradient-to-b from-zinc-500 via-zinc-600 to-zinc-700 shadow-xl border-t border-zinc-400/40 border-b border-zinc-900" />

          {/* Desk Contact Shadow */}
          <div className="w-56 sm:w-72 h-3 rounded-full bg-black/40 dark:bg-black/60 blur-md -mt-1" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
