"use client";
import React, { useState } from 'react';
import { CanvasText } from './ui/canvas-text';
import ScrollReveal from './ui/ScrollReveal';
import { InputToClaim } from './InputToClaim';
import { cn } from '@/lib/utils';
import OutbidModal from './OutbidModal';
import { COMPANIES, Company } from '@/app/data/keybidData';
import Ping from './Ping';

function HeroSection() {
    const [claimModalState, setClaimModalState] = useState<{
        isOpen: boolean;
        company: Company | null;
        keySlot: string;
        brandName?: string;
        website?: string;
        logo?: string;
    }>({
        isOpen: false,
        company: null,
        keySlot: "",
    });

    const handleClaim = (uri: string, info?: { domain: string; logo: string } | null) => {
        const targetUri = uri.startsWith('http') ? uri : `https://${uri}`;
        const cleanDomain = info?.domain || targetUri.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].split(":")[0];

        // Find key slot: first alphanumeric character or first character
        const firstChar = cleanDomain.match(/[a-zA-Z0-9]/)?.[0]?.toUpperCase() || cleanDomain.charAt(0).toUpperCase();
        const keySlot = firstChar || "";

        // Brand name: capitalize root name before domain extension
        const rawName = cleanDomain.split(".")[0];
        const brandName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "";

        // Check if this key slot is already held by a company
        const existingCompany = keySlot ? (COMPANIES.find(c => c.keySlot?.toUpperCase() === keySlot) || null) : null;

        setClaimModalState({
            isOpen: true,
            company: existingCompany,
            keySlot,
            brandName,
            website: targetUri,
            logo: info?.logo,
        });
    };
    return (

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

                    {/* Near-the-fold Credibility & Social Proof line */}
                    <div className="mt-4 flex items-center justify-center gap-2 sm:gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono select-none">
                        <Ping>
                            <span>12 keys claimed</span>
                        </Ping>
                        <Ping color={"bg-blue-600"}>

                            <span className="text-zinc-700 dark:text-zinc-300 font-semibold">$340 in bids this week</span>
                        </Ping>
                        <Ping color={"bg-red-500"}>
                            <span>Daily live desk placement</span>

                        </Ping>
                    </div>
                </div>
            </ScrollReveal>

            {/* Interactive Key Bidding / Outbidding Modal */}
            <OutbidModal
                company={claimModalState.company}
                isOpen={claimModalState.isOpen}
                initialKeySlot={claimModalState.keySlot}
                initialBrandName={claimModalState.brandName}
                initialWebsite={claimModalState.website}
                initialLogo={claimModalState.logo}
                onClose={() => setClaimModalState((prev) => ({ ...prev, isOpen: false }))}
            />
        </section>
    )
}

export default HeroSection;