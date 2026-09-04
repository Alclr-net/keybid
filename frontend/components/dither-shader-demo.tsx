"use client";

import React from "react";
import { DitherShader } from "@/components/ui/dither-shader";
import { cn } from "@/lib/utils";
import imgSrc from "@/public/imgSrc.jpg";
interface DitherShaderDemoProps {
  className?: string;
  children?: React.ReactNode;
}

export default function DitherShaderDemo({ className, children }: DitherShaderDemoProps) {
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <DitherShader
        src={imgSrc.src}
        gridSize={2}
        ditherMode="bayer"
        colorMode="original"
        invert={false}
        animated={false}
        animationSpeed={0.02}
        primaryColor="#000000"
        secondaryColor="#f5f5f5"
        threshold={0.5}
        objectFit="cover"
        className="absolute inset-0 w-full h-full"
      />
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
}
