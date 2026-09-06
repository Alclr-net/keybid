'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { COMPANIES } from '@/app/data/keybidData';
import Container from '@/components/Container';
import HeroSection from '@/components/hero-section';
import KeyboardDemo from '@/components/keyboard-demo';
import LiveAuctionSection from '@/components/LiveAuctionSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import InputToClaim from '@/components/InputToClaim';
import Ping from '@/components/Ping';
import { cn } from '@/lib/utils';
import { CanvasText } from '@/components/ui/canvas-text';
import TopBidsCanvasReveal from '@/components/TopBidsCanvasReveal';
import CanvasRevealEffectDemo from '@/components/canvas-reveal-effect-demo';

export default function KeybidPage() {
  const router = useRouter();
  const [companies] = useState(() => [...COMPANIES].sort((a, b) => b.bid - a.bid));
  const totalPool = companies.reduce((s, c) => s + c.bid, 0);
  const totalBids = companies.length + 18;

  const handleClaim = (uri: string) => {
    const target = uri.startsWith('http') ? uri : `https://${uri}`;
    router.push(`/submit?url=${encodeURIComponent(target)}`);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* ── 1. Hero Section ("Your brand, on my Mac.") ── */}
      <section className="w-full pt-12 sm:pt-24 md:pt-28 pb-10 sm:pb-16 px-4 flex flex-col items-center text-center">
        {/* Live Pool Pill */}
        <ScrollReveal delay={0.05} distance={15}>
          <button className={cn("group inline-flex items-center gap-2 px-1.5 py-1 mb-4 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 transition-all text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-2xs hover:border-zinc-300 dark:hover:border-white/20")}>
            <span className="flex items-center gap-2">
              <span className={cn(
                "text-xs font-semibold bg-blue-600 rounded-full text-white py-0.5 px-2.5 shadow-xs",
                "shadow-[0_2px_8px_rgba(37,99,235,0.25)]"
              )}>New</span>
              <span className="pr-2 text-zinc-700 dark:text-zinc-300">Live Bidding is here</span>
            </span>
          </button>
        </ScrollReveal>

        {/* Hero Title */}
        <ScrollReveal delay={0.1} blurAmount={12}>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.08] max-w-4xl text-shadow-sm uppercase">
            Claim{" "}
            <CanvasText
              text="the key"
              backgroundClassName="bg-blue-600 dark:bg-blue-500"
              colors={[
                "rgba(0, 153, 255, 1)",
                "rgba(0, 153, 255, 0.9)",
                "rgba(0, 153, 255, 0.8)",
                "rgba(0, 153, 255, 0.7)",
                "rgba(0, 153, 255, 0.6)",
                "rgba(0, 153, 255, 0.5)",
                "rgba(0, 153, 255, 0.4)",
                "rgba(0, 153, 255, 0.3)",
                "rgba(0, 153, 255, 0.2)",
                "rgba(0, 153, 255, 0.1)",
              ]}
              lineGap={4}
              animationDuration={20}
            />{" "}
            that starts with your{" "}
            <CanvasText
              text="company name"
              backgroundClassName="bg-blue-600 dark:bg-blue-500"
              colors={[
                "rgba(0, 153, 255, 1)",
                "rgba(0, 153, 255, 0.9)",
                "rgba(0, 153, 255, 0.8)",
                "rgba(0, 153, 255, 0.7)",
                "rgba(0, 153, 255, 0.6)",
                "rgba(0, 153, 255, 0.5)",
                "rgba(0, 153, 255, 0.4)",
                "rgba(0, 153, 255, 0.3)",
                "rgba(0, 153, 255, 0.2)",
                "rgba(0, 153, 255, 0.1)",
              ]}
              lineGap={4}
              animationDuration={20}
            />
          </h1>
        </ScrollReveal>

        {/* Hero Subtitle */}
        <ScrollReveal delay={0.18} blurAmount={8}>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 font-normal max-w-2xl leading-relaxed">
            Enter your domain below and get your key instantly
          </p>
        </ScrollReveal>

        {/* Hero Action CTAs */}
        <ScrollReveal delay={0.25} distance={20}>
          <div className="mt-8 sm:mt-10 w-full max-w-2xl mx-auto">
            <InputToClaim
              onClaim={handleClaim}
              className="w-full"
            />
          </div>
        </ScrollReveal>
      </section>

      {/* ── 2. Hardware Showcase (Studio Display & Interactive 3D Keyboard) ── */}
      <section className="w-full py-16 sm:py-24 bg-zinc-50/60 dark:bg-zinc-950/40 border-y border-zinc-200/70 dark:border-white/5">
        <Container className="w-full">
          <ScrollReveal delay={0.2} blurAmount={6}>
            <HeroSection />
          </ScrollReveal>

          <ScrollReveal delay={0.15} blurAmount={6}>
            <KeyboardDemo />
          </ScrollReveal>
        </Container>
      </section>

      {/* ── 3. Top 3 Bids Canvas Reveal Showcase ── */}
      <TopBidsCanvasReveal />

      {/* ── 4. The Live Auction Leaderboard Table ── */}
      <LiveAuctionSection />

      {/* ── 5. How It Works ── */}
      <HowItWorksSection />

      {/* ── 6. Questions & Answers (FAQ) ── */}
      <FaqSection />

      {/* ── 7. Footer ── */}
      <Footer />
    </div>
  );
}
