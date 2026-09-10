"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import { Keyboard } from "@/src/components/ui/keyboard";
import {
  IconPerspective,
  IconRotate3d,
  IconDeviceDesktop,
  IconHandClick,
  IconArrowRight,
} from "@tabler/icons-react";
import { cn } from "@/src/lib/utils";
import type { Key } from "@/types/database";
import { useKeysStore } from "@/lib/store/keysStore";
import OutbidModal from "@/src/components/OutbidModal";
import { TextHoverEffect } from "@/src/components/ui/text-hover-effect";

export default function KeyboardDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Mode: "auto" (scroll-driven), "desk" (locked 3D angle), "flat" (locked 0° flat)
  const [perspectiveMode, setPerspectiveMode] = useState<"auto" | "desk" | "flat">("auto");

  // Track live keys from store
  const keysList = useKeysStore((state) => state.keys);
  const isLoading = useKeysStore((state) => state.isLoading);

  // State for interactive key selection (bidding or outbidding)
  const [selectedKey, setSelectedKey] = useState<{
    keyData: Key | null;
    keySlot: string;
    isOpen: boolean;
  }>({
    keyData: null,
    keySlot: "",
    isOpen: false,
  });

  const handleKeyClick = (keySlot: string, keyData: Key | null) => {
    setSelectedKey({
      isOpen: true,
      keyData,
      keySlot,
    });
  };

  // Track viewport width: natural, ergonomic tilt angle (14deg on desktop, 8deg on mobile)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const initialRotateX = isMobile ? 8 : 14;

  // Track scroll progress as the keyboard enters from below the hero section into center viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center 55%"],
  });
  // Spring physics for butter-smooth trackpad/wheel scroll response
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0005,
  });

  // Scroll-driven transforms (grounded on table plane)
  const scrollRotateX = useTransform(
    smoothProgress,
    [0, 1],
    [shouldReduceMotion ? 0 : initialRotateX, 0]
  );
  const scrollScale = useTransform(smoothProgress, [0, 1], [0.96, 1]);

  // Dynamic desk contact shadow values tied to rotation
  // 1. Ambient Tabletop Dispersion (soft penumbra across table surface)
  const shadowSpreadScaleX = useTransform(smoothProgress, [0, 1], [1.0, 1.0]);
  const shadowSpreadScaleY = useTransform(smoothProgress, [0, 1], [1.3, 0.9]);
  const shadowSpreadOpacity = useTransform(smoothProgress, [0, 1], [0.42, 0.25]);
  const shadowSpreadY = useTransform(smoothProgress, [0, 1], [12, 4]);

  // 2. Chassis Body Cast Shadow (desk shadow projected onto table)
  const shadowBodyScaleX = useTransform(smoothProgress, [0, 1], [0.98, 0.99]);
  const shadowBodyScaleY = useTransform(smoothProgress, [0, 1], [1.2, 0.85]);
  const shadowBodyOpacity = useTransform(smoothProgress, [0, 1], [0.55, 0.35]);
  const shadowBodyY = useTransform(smoothProgress, [0, 1], [5, 2]);

  // 3. Crisp Contact Occlusion (crevice where keyboard bottom edge meets table)
  const shadowContactScaleX = useTransform(smoothProgress, [0, 1], [0.96, 0.98]);
  const shadowContactOpacity = useTransform(smoothProgress, [0, 1], [0.85, 0.60]);

  // 4. Ambient Tabletop Surface Pool
  const deskGleamOpacity = useTransform(smoothProgress, [0, 1], [0.35, 0.18]);

  const activeSpreadScaleX =
    perspectiveMode === "desk" ? 1.0 : perspectiveMode === "flat" ? 1.0 : shadowSpreadScaleX;
  const activeSpreadScaleY =
    perspectiveMode === "desk" ? 1.3 : perspectiveMode === "flat" ? 0.9 : shadowSpreadScaleY;
  const activeSpreadOpacity =
    perspectiveMode === "desk" ? 0.42 : perspectiveMode === "flat" ? 0.25 : shadowSpreadOpacity;
  const activeSpreadY =
    perspectiveMode === "desk" ? 12 : perspectiveMode === "flat" ? 4 : shadowSpreadY;

  const activeBodyScaleX =
    perspectiveMode === "desk" ? 0.98 : perspectiveMode === "flat" ? 0.99 : shadowBodyScaleX;
  const activeBodyScaleY =
    perspectiveMode === "desk" ? 1.2 : perspectiveMode === "flat" ? 0.85 : shadowBodyScaleY;
  const activeBodyOpacity =
    perspectiveMode === "desk" ? 0.55 : perspectiveMode === "flat" ? 0.35 : shadowBodyOpacity;
  const activeBodyY =
    perspectiveMode === "desk" ? 5 : perspectiveMode === "flat" ? 2 : shadowBodyY;

  const activeContactScaleX =
    perspectiveMode === "desk" ? 0.96 : perspectiveMode === "flat" ? 0.98 : shadowContactScaleX;
  const activeContactOpacity =
    perspectiveMode === "desk" ? 0.85 : perspectiveMode === "flat" ? 0.60 : shadowContactOpacity;

  const activeGleamOpacity =
    perspectiveMode === "desk" ? 0.35 : perspectiveMode === "flat" ? 0.18 : deskGleamOpacity;

  // Determine active values based on user mode toggle
  const activeRotateX =
    perspectiveMode === "desk"
      ? initialRotateX
      : perspectiveMode === "flat"
        ? 0
        : scrollRotateX;

  const activeScale =
    perspectiveMode === "desk"
      ? 0.96
      : perspectiveMode === "flat"
        ? 1
        : scrollScale;

  return (
    <section

      className="relative flex min-h-[300px] xs:min-h-[340px] sm:min-h-[520px] md:min-h-[620px] lg:min-h-[700px] w-full flex-col items-center justify-center py-4 sm:py-10 md:py-16 overflow-hidden"
      ref={containerRef}
    >
      {/* Perspective Mode Control Pill */}
      <div className="mb-3 sm:mb-6 flex items-center gap-1 sm:gap-1.5 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 p-0.5 sm:p-1 backdrop-blur-md shadow-xs text-[10px] sm:text-[11px] font-medium text-zinc-600 dark:text-zinc-400 select-none z-20 ">
        <button
          type="button"
          onClick={() => setPerspectiveMode("auto")}
          className={cn("flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all cursor-pointer",
            `${perspectiveMode === "auto"
              ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]"
              : "hover:text-blue-600 dark:hover:text-blue-400"
            }`)}
        >
          <IconRotate3d size={12} className={perspectiveMode === "auto" ? "animate-pulse" : ""} />
          <span><span className="hidden sm:inline">Scroll </span>Dynamic</span>
        </button>

        <button
          type="button"
          onClick={() => setPerspectiveMode("desk")}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all cursor-pointer ${perspectiveMode === "desk"
            ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]"
            : "hover:text-blue-600 dark:hover:text-blue-400"
            }`}
        >
          <IconPerspective size={12} />
          <span>3D Desk<span className="hidden sm:inline"> View</span></span>
        </button>

        <button
          type="button"
          onClick={() => setPerspectiveMode("flat")}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all cursor-pointer ${perspectiveMode === "flat"
            ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]"
            : "hover:text-blue-600 dark:hover:text-blue-400"
            }`}
        >
          <IconDeviceDesktop size={12} />
          <span>Flat<span className="hidden sm:inline"> View</span></span>
        </button>
      </div>

      {/* Interactive Helper Hint with TextHoverEffect */}
      <div className="absolute bottom-0 sm:bottom-1 md:bottom-2 inset-x-0 w-full flex justify-center items-center px-4 z-20 pointer-events-auto">
        <div className="w-full max-w-5xl h-20 sm:h-28 md:h-36 lg:h-40 flex items-center justify-center">
          <TextHoverEffect
            text="CLICK ANY KEY TO CLAIM"
            containerRef={containerRef}

          />
        </div>
      </div>

      {/* 3D Perspective Stage Container */}
      <div
        className="relative flex w-full items-center justify-center px-1 sm:px-4"
        style={{
          perspective: isMobile ? 900 : 1400,
          perspectiveOrigin: "50% 40%",
        }}
      >
        {/* 3D Animated Keyboard Frame */}
        <motion.div
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "50% 88%",
            rotateX: activeRotateX,
            scale: activeScale,
          }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 24,
          }}
          className="relative z-10 flex flex-col items-center justify-center will-change-transform"
        >
          <Keyboard onKeyClick={handleKeyClick} keys={keysList} />

          {/* ── Tabletop Desk Contact Shadow Rig (Directly anchored to bottom of keyboard) ── */}
          <div className="pointer-events-none absolute  inset-x-0 flex flex-col items-center justify-center select-none -z-10">
            {/* Layer 1: Razor-Sharp Table Contact Occlusion */}
            <motion.div
              style={{
                scaleX: activeContactScaleX,
                opacity: activeContactOpacity,
              }}
              className="w-[94%] max-w-[740px] h-2.5 sm:h-1 rounded-full bg-black/90 dark:bg-black blur-[2px] sm:blur-[2.5px] transition-all duration-200"
            />

            {/* Layer 2: Chassis Body Cast Shadow */}
            <motion.div
              style={{
                scaleX: activeBodyScaleX,
                scaleY: activeBodyScaleY,
                opacity: activeBodyOpacity,
                y: activeBodyY,
              }}
              className="absolute -top-1 w-[96%] max-w-[780px] h-2  rounded-2xl bg-black/60 dark:bg-black/90 blur-[10px] sm:blur-[14px] transition-all duration-200"
            />

            {/* Layer 3: Ambient Tabletop Dispersion Penumbra */}
            <motion.div
              style={{
                scaleX: activeSpreadScaleX,
                scaleY: activeSpreadScaleY,
                opacity: activeSpreadOpacity,
                y: activeSpreadY,
              }}
              className="absolute -top-2 w-[102%] max-w-[840px] h-16 sm:h-22 rounded-3xl bg-black/40 dark:bg-black/75 blur-[22px] sm:blur-[32px] transition-all duration-200"
            />

            {/* Layer 4: Desk Surface Ambient Reflection */}
            <motion.div
              style={{
                opacity: activeGleamOpacity,
              }}
              className="absolute -top-3 w-[110%] max-w-[920px] h-26 sm:h-34 rounded-full bg-radial from-black/[0.08] dark:from-white/[0.025] via-transparent to-transparent blur-xl transition-opacity duration-200"
            />
          </div>
        </motion.div>
      </div>

      {/* Empty state caption when no keys are claimed yet */}
      {!isLoading && keysList.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 shadow-sm z-20 backdrop-blur-md text-center"
        >
          <span>No keys claimed yet — be the first to claim one</span>
          <button
            type="button"
            onClick={() => handleKeyClick("", null)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm active:scale-[0.98] cursor-pointer text-xs"
          >
            <span>Claim a Key</span>
            <IconArrowRight size={14} />
          </button>
        </motion.div>
      )}


      {/* Interactive Key Bidding & Outbidding Modal */}
      <OutbidModal
        company={selectedKey.keyData}
        isOpen={selectedKey.isOpen}
        initialKeySlot={selectedKey.keySlot}
        onClose={() => setSelectedKey((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={(_bidAmount, _createdCompany, createdKey) => {
          if (createdKey) {
            useKeysStore.getState().updateKey(createdKey.id, createdKey);
          }
        }}
      />
    </section>
  );
}
