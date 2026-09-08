"use client";

import React, { useState } from "react";
import { cn } from "@/src/lib/utils";

interface KeyLogoProps {
  src?: string | null;
  alt: string;
  fallbackText?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export default function KeyLogo({
  src,
  alt,
  fallbackText,
  className,
  fallbackClassName,
}: KeyLogoProps) {
  const [imgError, setImgError] = useState(false);

  // If no logo or image errored out, render the default placeholder
  if (!src || imgError) {
    const letter = (fallbackText || alt || "K").trim().charAt(0).toUpperCase();
    return (
      <div
        className={cn(
          "rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 select-none shadow-2xs",
          fallbackClassName || className
        )}
        title={alt}
      >
        <span>{letter}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setImgError(true)}
      className={cn("object-contain shrink-0", className)}
    />
  );
}
