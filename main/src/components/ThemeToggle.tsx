'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { cn } from '@/src/lib/utils';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/80 shrink-0",
          className
        )}
      />
    );
  }

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        "relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border cursor-pointer active:scale-95 shrink-0",
        isDark
          ? "bg-zinc-800/80 border-zinc-700 text-amber-400 hover:bg-zinc-700 hover:border-amber-400/40 hover:text-amber-300"
          : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 hover:border-zinc-300 shadow-xs",
        className
      )}
    >
      {isDark ? (
        <IconSun size={16} stroke={2} className="transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <IconMoon size={16} stroke={2} className="transition-transform duration-200 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
