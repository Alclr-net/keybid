'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { COMPANIES, Company } from '@/app/data/keybidData';

import HeroSection from '@/components/hero-section';

import { cn } from '@/lib/utils';

import Container from '@/components/Container';
import KeyboardDemo from '@/components/keyboard-demo';

const sorted = [...COMPANIES].sort((a, b) => b.bid - a.bid);
const leader = sorted[0];
const second = sorted[1];
const third = sorted[2];

function CompanyIcon({ company, size = 40 }: { company: Company; size?: number }) {
  const [err, setErr] = useState(false);
  if (!err && company.iconUrl) {
    return (
      <img
        src={company.iconUrl}
        alt={company.name}
        onError={() => setErr(true)}
        className="rounded-xl object-contain border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-800 p-0.5 shadow-xs"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-xs"
      style={{ width: size, height: size, background: '#e11d48', fontSize: size * 0.42 }}
    >
      {company.name[0]}
    </div>
  );
}

function PodiumCard({
  company,
  rank,
  highlight,
}: {
  company: Company;
  rank: number;
  highlight?: boolean;
}) {
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <div
      className={`relative rounded-2xl border flex flex-col items-center p-5 gap-3 transition-all duration-300 ${highlight
        ? 'bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-white dark:from-amber-500/10 dark:via-zinc-900 dark:to-zinc-900 border-amber-500/40 shadow-xl shadow-amber-500/10 scale-[1.06] z-10'
        : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm dark:shadow-none'
        }`}
    >
      <div className="text-xl">{medals[rank - 1]}</div>
      <CompanyIcon company={company} size={44} />
      <div className="text-center space-y-0.5">
        <div className="font-extrabold text-xs text-zinc-900 dark:text-white leading-tight">{company.name}</div>
        <div className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono">{company.clicks} clicks</div>
      </div>
      <div className="text-xl font-black text-zinc-950 dark:text-white">${company.bid}</div>
      <Link
        href={`/outbid/${company.id}`}
        className={`w-full rounded-lg text-center py-1.5 text-[11px] font-bold transition-all ${highlight
          ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-sm'
          : 'bg-zinc-100 hover:bg-red-600 hover:text-white text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-red-600 dark:hover:text-white dark:text-zinc-300 dark:border-zinc-700'
          }`}
      >
        Outbid · ${company.bid + 1}
      </Link>
    </div>
  );
}

export default function KeybidPage() {
  const [companies] = useState(sorted);
  const [quickUrl, setQuickUrl] = useState('');
  const router = useRouter();
  const total = companies.reduce((s, c) => s + c.bid, 0);
  const totalClicks = companies.reduce((s, c) => s + c.clicks, 0);

  const handleClaimKey = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let trimmed = quickUrl.trim();
    if (trimmed) {
      if (!/^https?:\/\//i.test(trimmed)) {
        trimmed = `https://${trimmed}`;
      }
      router.push(`/submit?url=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/submit');
    }
  };

  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);
  const isDark = (resolvedTheme || theme) === 'dark';

  return (

    <>
      <Container>
        <div className="mx-auto w-full pt-4 pb-12">
          <HeroSection />
        </div>
      </Container>
      <KeyboardDemo />

      {/* ── Studio Display Product Mockup Hero ── */}

      {/* ── Podium ── */}
      {/* <section className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
        {second && <PodiumCard company={second} rank={2} />}
        {leader && <PodiumCard company={leader} rank={1} highlight />}
        {third && <PodiumCard company={third} rank={3} />}
      </section> */}

      {/* ── Keyboard ── */}
      {/* <section id="keyboard" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Live Keyboard
          </h2>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-600 font-mono">
            Claimed keys show company logos
          </span>
        </div> */}

      {/* Contiguous Input Section for URL and Claim button */}
      {/* <div className="max-w-xl mx-auto w-full">
          <form
            onSubmit={handleClaimKey}
            className="flex items-center bg-white dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-700/80 rounded-2xl p-1.5 shadow-sm dark:shadow-xl focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all"
          >
            <div className="pl-3.5 pr-1.5 text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 select-none shrink-0">
              <IconLink size={16} />
              <span className="hidden sm:inline text-xs font-mono text-zinc-400 dark:text-zinc-600">https://</span>
            </div> */}
      {/* <input
              type="text"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="yourcompany.com"
              className="flex-1 min-w-0 bg-transparent border-none text-zinc-900 dark:text-white text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none py-2 px-1.5"
            /> */}
      {/* <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <IconPlus size={14} />
              <span>Claim</span>
            </button> */}
      {/* </form>
        </div>

        <div className="rounded-3xl border border-zinc-200/80 dark:border-white/5 bg-white/70 dark:bg-zinc-900/30 p-5 flex justify-center overflow-x-auto shadow-sm dark:shadow-inner backdrop-blur-sm">
          <KeyboardDemo />
        </div>
      </section> */}

      {/* ── Leaderboard ── */}
      {/* <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
            Live Rankings
          </h2>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-600 font-mono">sorted by bid</span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-white/5 overflow-hidden divide-y divide-zinc-200 dark:divide-white/5 bg-white dark:bg-transparent shadow-sm dark:shadow-none">
          {companies.map((company, idx) => {
            const above = idx > 0 ? companies[idx - 1] : null;
            const minBid = above ? above.bid + 1 : company.bid + 1;
            const isLeader = idx === 0;

            return (
              <div
                key={company.id}
                className={`flex items-center gap-4 px-5 py-4 transition-colors group ${isLeader
                  ? 'bg-amber-500/5 hover:bg-amber-500/10'
                  : 'bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
              >
               
                <div className="w-6 text-center shrink-0">
                  {isLeader ? (
                    <span className="text-amber-500 dark:text-amber-400 font-black text-sm">1</span>
                  ) : (
                    <span className="text-zinc-400 dark:text-zinc-600 font-mono text-xs">{idx + 1}</span>
                  )}
                </div>

                
                <CompanyIcon company={company} size={34} />

               
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">{company.name}</span>
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconExternalLink size={12} />
                    </a>
                  </div>
                  <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{company.tagline}</p>
                </div>

              
                <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-600 font-mono shrink-0">
                  <IconUsers size={10} />
                  {company.clicks}
                </div>

                
                <div className="hidden sm:block shrink-0">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700">
                    {company.keySlot}
                  </span>
                </div>

               
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-base font-black text-zinc-950 dark:text-white">${company.bid}</div>
                  <Link
                    href={`/outbid/${company.id}`}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${isLeader
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-sm'
                      : 'bg-zinc-100 hover:bg-red-600 hover:text-white text-zinc-700 border border-zinc-200 hover:border-red-500 dark:bg-zinc-800/80 dark:hover:bg-red-600 dark:hover:text-white dark:text-zinc-400 dark:border-zinc-700/80'
                      }`}
                  >
                    <IconArrowUp size={11} />
                    {isLeader ? `Beat #1 · $${minBid}` : `Outbid · $${minBid}`}
                  </Link>
                </div>
              </div>
            );
          })}

         
          <div className="flex items-center gap-4 px-5 py-4 opacity-60">
            <div className="w-6 text-center text-zinc-400 dark:text-zinc-600 text-xs font-mono">{companies.length + 1}</div>
            <div className="w-[34px] h-[34px] rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center shrink-0">
              <IconPlus size={14} className="text-zinc-400 dark:text-zinc-600" />
            </div>
            <div className="flex-1">
              <div className="text-zinc-600 dark:text-zinc-500 text-xs font-medium">Your company</div>
              <div className="text-zinc-400 dark:text-zinc-700 text-[11px] mt-0.5">Starting bid: $1</div>
            </div>
            <Link
              href="/submit"
              className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-red-500/50 hover:text-red-500 text-zinc-600 dark:border-zinc-800 dark:hover:border-red-500/50 dark:hover:text-red-400 dark:text-zinc-600 text-[11px] font-bold transition-colors"
            >
              Claim →
            </Link>
          </div>
        </div>
      </section>

    
      <section className="rounded-3xl border border-zinc-200 dark:border-white/5 bg-gradient-to-br from-red-500/5 via-zinc-100 to-white dark:from-red-950/30 dark:via-zinc-900/60 dark:to-zinc-900/60 p-8 sm:p-10 text-center space-y-5 shadow-sm dark:shadow-none">
        <h2 className="text-2xl font-black text-zinc-950 dark:text-white">
          Get your company on the keyboard
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
          Submit your URL + icon. Start at $1. Highest bid keeps the key visible to everyone.
        </p>
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-red-600/30"
        >
          <IconPlus size={15} />
          Claim a Keyboard Key
        </Link>
      </section> */}


      {/* ── Footer ── */}
      {/* < footer className = "border-t border-zinc-200 dark:border-white/5 py-10 px-5 text-center space-y-1 mt-4" >
        <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-600">
          KEYBID — The startup keyboard leaderboard. Highest bid owns the key.
        </p>
        <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-700">
          Built with Next.js · Tailwind CSS
        </p>
      </footer > */}
    </>
  );
}
