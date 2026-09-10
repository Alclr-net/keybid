"use client";
import React, { useRef, useEffect, useState, useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

export interface TextHoverEffectProps {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
  strokeWidth?: number;
  containerRef?: React.RefObject<HTMLElement | null>;
  viewBox?: string;
}

export const TextHoverEffect = ({
  text,
  duration,
  automatic = false,
  className,
  strokeWidth = 0.4,
  containerRef,
  viewBox: customViewBox,
}: TextHoverEffectProps) => {
  const id = useId().replace(/:/g, "-");
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dynamic responsive viewBox & font-size based on character length
  const isShortText = text.length <= 6;
  const computedBoxWidth = isShortText ? 300 : Math.max(600, text.length * 36);
  const computedBoxHeight = isShortText ? 100 : 120;
  const viewBox = customViewBox ?? `0 0 ${computedBoxWidth} ${computedBoxHeight}`;
  const fontSize = isShortText ? 72 : 50;

  // Track position when cursor moves
  useEffect(() => {
    if (svgRef.current && cursor.x !== 0 && cursor.y !== 0) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  // Optional: Listen to parent container hover/mouse movements
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const handleContainerMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      setHovered(true);
      setCursor({ x: e.clientX, y: e.clientY });
    };

    const handleContainerMouseLeave = () => {
      setHovered(false);
    };

    container.addEventListener("mousemove", handleContainerMouseMove);
    container.addEventListener("mouseleave", handleContainerMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleContainerMouseMove);
      container.removeEventListener("mouseleave", handleContainerMouseLeave);
    };
  }, [containerRef]);

  // Handle tap / touch on mobile devices
  const handleTouch = (e: React.TouchEvent) => {
    if (!svgRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const svgRect = svgRef.current.getBoundingClientRect();
    const cxPercentage = ((touch.clientX - svgRect.left) / svgRect.width) * 100;
    const cyPercentage = ((touch.clientY - svgRect.top) / svgRect.height) * 100;

    setHovered(true);
    setIsTapped(true);
    setCursor({ x: touch.clientX, y: touch.clientY });
    setMaskPosition({
      cx: `${cxPercentage}%`,
      cy: `${cyPercentage}%`,
    });

    if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    tapTimeoutRef.current = setTimeout(() => {
      setIsTapped(false);
      setHovered(false);
    }, 2600);
  };

  const handleTap = () => {
    setHovered(true);
    setIsTapped(true);
    if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    tapTimeoutRef.current = setTimeout(() => {
      setIsTapped(false);
      setHovered(false);
    }, 2600);
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      onClick={handleTap}
      className={cn("select-none cursor-pointer w-full", className)}
    >
      <defs>
        <linearGradient
          id={`textGradient-${id}`}
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#fff" />
              <stop offset="25%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#fff" />
              <stop offset="75%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#fff" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id={`revealMask-${id}`}
          gradientUnits="userSpaceOnUse"
          r={isTapped ? "60%" : "22%"}
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? (isTapped ? 0.4 : 0), ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id={`textMask-${id}`}>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#revealMask-${id})`}
          />
        </mask>
      </defs>

      {/* Layer 1: Ambient base outline visible in theme */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth={strokeWidth}
        fontSize={fontSize}
        className={cn(
          "fill-transparent font-display font-extrabold tracking-wider transition-opacity duration-300",
          "stroke-zinc-300 dark:stroke-zinc-800/80"
        )}
        style={{ opacity: hovered ? 0.75 : 0.35 }}
      >
        {text}
      </text>

      {/* Layer 2: Animated initial stroke line draw effect */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth={strokeWidth}
        fontSize={fontSize}
        className={cn(
          "fill-transparent font-display font-extrabold tracking-wider",
          "stroke-zinc-400 dark:stroke-zinc-700"
        )}
        initial={{ strokeDashoffset: 2000, strokeDasharray: 2000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 2000,
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>

      {/* Layer 3: Radiant masked multi-color gradient spotlight */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke={`url(#textGradient-${id})`}
        strokeWidth={strokeWidth * 1.6}
        mask={`url(#textMask-${id})`}
        fontSize={fontSize}
        className="fill-transparent font-display font-extrabold tracking-wider"
      >
        {text}
      </text>
    </svg>
  );
};

export default TextHoverEffect;
