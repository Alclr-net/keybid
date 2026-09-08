'use client';

import { TooltipProvider } from '@/src/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      <TooltipProvider>

        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
