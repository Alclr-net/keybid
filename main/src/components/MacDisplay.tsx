'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/src/lib/utils';
import { DitherShader } from '@/src/components/ui/dither-shader';
import imgSrc from '@/public/imgSrc.jpg';
import { FaApple } from "react-icons/fa";
import { BsToggles } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { FaWifi } from "react-icons/fa";
import RealTimeClock from './DateTime';
import { IosDock } from './IosDock';
import MacWindow from './MacWindow';
import { DITHER_SHADER_CONFIG } from '@/lib/constant';

export type MacDisplayProps = {
  className?: string;
  children?: React.ReactNode;
};

function MacDisplay({ className, children }: MacDisplayProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme || theme) === 'dark' : false;
  const shaderConfig = isDark ? DITHER_SHADER_CONFIG.dark : DITHER_SHADER_CONFIG.light;

  return (
    <section className={cn(" hidden  md:flex flex-col items-center justify-center w-full py-4 sm:py-8 ", className)}>

      {/* ── Mac Studio Display Monitor Mockup ── */}
      <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center animate-[monitorReveal_0.9s_cubic-bezier(0.16,1,0.3,1)_both]">
        {/* Monitor Screen Frame / Bezel Chassis */}
        <div className="relative w-full aspect-[16/10] max-h-[580px] min-h-[320px] sm:min-h-[654px] rounded-sm sm:rounded-[36px] md:rounded-xl bg-[#0c0d0e] dark:bg-[#08080a] p-3 sm:p-4 md:p-5  ring-1 ring-black/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)] flex flex-col transition-all duration-300  dark:border dark:border-neutral-700">

          {/* Top Bezel Camera & Sensor */}
          <div className="absolute top-0 left-0 right-0 h-3 sm:h-4 md:h-5 flex items-center justify-center z-20 pointer-events-none">
            <div className="relative flex items-center justify-center">
              {/* Camera Lens (Dead-center) */}
              <div className="w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5 rounded-full bg-black ring-1 ring-zinc-700/70 flex items-center justify-center shadow-inner">
                <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full bg-zinc-800 ring-1 ring-blue-500/20" />
              </div>
              {/* Ambient Light Sensor (Offset to right without shifting camera center) */}
              <div className="absolute left-full ml-1.5 sm:ml-2 w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full bg-zinc-900 ring-1 ring-zinc-800/80" />
            </div>
          </div>

          {/* Inner Display Screen Area */}
          <div className="relative w-full h-full overflow-hidden bg-black ring-1 ring-white/10 shadow-inner">
            {/* Mac Screen Wallpaper: DitherShader */}
            <DitherShader
              src={imgSrc.src}
              gridSize={2}
              ditherMode="bayer"
              colorMode={shaderConfig.colorMode}
              invert={false}
              animated={false}
              animationSpeed={0.02}
              primaryColor={shaderConfig.primaryColor}
              secondaryColor={shaderConfig.secondaryColor}
              brightness={shaderConfig.brightness}
              contrast={shaderConfig.contrast}
              threshold={shaderConfig.threshold}
              objectFit="cover"
              className="absolute inset-0 w-full h-full"
            />

            {/* macOS Menu Bar */}
            <div className="absolute top-0 inset-x-0 px-3 sm:px-2 flex items-center justify-between text-white text-[8px] font-normal z-10 select-none" style={{ letterSpacing: '-0.01em' }}>
              <div className="flex items-center gap-4 text-shadow-xs">
                <FaApple />
                <span className="font-semibold">Finder</span>
                <span className="hidden sm:inline text-white/90">File</span>
                <span className="hidden sm:inline text-white/90">Edit</span>
                <span className="hidden sm:inline text-white/90">View</span>
                <span className="hidden sm:inline text-white/90">Go</span>
                <span className="hidden md:inline text-white/90">Window</span>
                <span className="hidden md:inline text-white/90">Help</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5 text-white/90 font-normal text-[8px] text-shadow-xs">
                <FaWifi />
                <IoSearch />
                <BsToggles />
                <RealTimeClock />
              </div>
            </div>
            {/* macOS Dock */}
            <div className="absolute bottom-3 sm:bottom-4 inset-x-0 flex justify-center items-end z-20 pointer-events-auto">
              <IosDock />
            </div>

            {/* Screen Content — Mac Window (centered between top menu bar and bottom dock) */}
            <div className="absolute top-6 sm:top-7 bottom-18 sm:bottom-20 inset-x-0 z-10 flex items-center justify-center px-4 sm:px-8 md:px-12 pointer-events-auto">
              <MacWindow />
            </div>

            {/* Additional children if any */}
            {children && (
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-6 sm:pt-7">
                {children}
              </div>
            )}

            {/* Subtle Screen Glass Sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.07] mix-blend-screen z-10" />

            {/* Inner Display Vignette Shadow */}
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_24px_rgba(0,0,0,0.35)] z-10" />
          </div>
        </div>

        {/* ── Apple Studio Display Stand ── */}
        <div className="flex flex-col items-center select-none pointer-events-none -z-20">
          {/* Aluminum Stand Neck */}
          <div
            className={cn(
              "relative flex flex-col items-center",
              "w-[260px]",
              "h-24 sm:h-36 md:h-44 overflow-hidden",
              // Apple matte anodized silver aluminum gradient (same in light & dark)
              "bg-gradient-to-b from-[#e3e3e7] via-[#d6d6db] to-[#c7c7cc]",
              // Chamfered edges & subtle specular reflections
              "border-x border-white/40",
              "shadow-[inset_1px_0_0_rgba(255,255,255,0.6),inset_-1px_0_0_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(0,0,0,0.2)]"
            )}
          >
            {/* Cable Pass-Through Hole (Top Center, partially intersecting top edge like real Studio Display) */}
            <div className="relative -top-2 sm:-top-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center ">
              {/* Outer Chamfer / Milled Aluminum Rim */}
              <div
                className={cn(
                  "w-full h-full rounded-full p-[3px] sm:p-[4px]",
                  "bg-gradient-to-b from-[#b8b8bd] via-[#d1d1d6] to-[#ffffff]",
                  "shadow-[0_2px_6px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(0,0,0,0.3)]"
                )}
              >
                {/* Inner Cutout Hole (shows page/desk background through the hole) */}
                <div
                  className={cn(
                    "w-full h-full rounded-full",
                    "bg-white dark:bg-black"
                  )}
                />
              </div>
            </div>

            {/* Subtle vertical brushed metallic reflection line */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
          </div>

          {/* Stand Foot / Base Plate */}
          <div
            className={cn(
              "relative flex flex-col items-center",
              "w-full",
              "h-2.5 sm:h-3.5",
              // Matching aluminum base with rounded front edge (same in light & dark)
              "bg-gradient-to-b from-[#e8e8ec] via-[#dcdce0] to-[#b8b8bd]",
              "rounded-b-lg sm:rounded-b-xl",
              "border-t border-white/60",
              "shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.7)]"
            )}
          >
            {/* Polished front top highlight */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            {/* Dual Black Rubber Feet underneath at corners (as seen in reference image) */}
            <div className="absolute -bottom-1 inset-x-2 sm:inset-x-3 flex justify-between">
              <div className="w-8 sm:w-10 h-0.5 sm:h-1 rounded-b-sm bg-neutral-900 dark:bg-neutral-600 shadow-sm" />
              <div className="w-8 sm:w-10 h-0.5 sm:h-1 rounded-b-sm bg-neutral-900 dark:bg-neutral-600 shadow-sm" />
            </div>
          </div>

          {/* Realistic Desk Contact Shadow */}
          <div className="w-[28%] min-w-[180px] max-w-[300px] h-3.5 bg-black/40 dark:bg-black/70 blur-md rounded-full mt-0.5" />
        </div>
      </div>
    </section>
  );
}

export default MacDisplay;
