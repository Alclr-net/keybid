'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { COMPANIES } from '@/app/data/keybidData';
import { IconArrowLeft, IconArrowUp, IconExternalLink, IconFlame, IconTrophy } from '@tabler/icons-react';
import { ThemeToggle } from '@/app/components/ThemeToggle';

export default function OutbidPage() {
  const params = useParams();
  const id = params?.id as string;

  const sorted = [...COMPANIES].sort((a, b) => b.bid - a.bid);
  const companyIdx = sorted.findIndex((c) => c.id === id);
  const company = sorted[companyIdx];

  const [bidAmount, setBidAmount] = useState<number>(company ? company.bid + 1 : 2);
  const [iconErr, setIconErr] = useState(false);
  const [outbid, setOutbid] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!company) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b0e] text-zinc-900 dark:text-white flex items-center justify-center transition-colors duration-200">
        <div className="text-center space-y-4">
          <div className="text-4xl">🔍</div>
          <h1 className="text-xl font-bold">Company not found</h1>
          <Link href="/" className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm">
            ← Back to leaderboard
          </Link>
        </div>
      </div>
    );
  }

  const above = companyIdx > 0 ? sorted[companyIdx - 1] : null;
  const minBid = (above?.bid ?? company.bid) + 1;
  const rank = companyIdx + 1;

  const handleOutbid = () => {
    if (bidAmount < minBid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOutbid(true);
    }, 1800);
  };

  if (outbid) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b0e] text-zinc-900 dark:text-white flex items-center justify-center px-4 transition-colors duration-200">
        <div className="text-center max-w-sm space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-500 mx-auto text-3xl">
            👑
          </div>
          <h1 className="text-2xl font-black">You outbid {company.name}!</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            You placed a bid of <strong className="text-zinc-950 dark:text-white">${bidAmount}</strong> — you now rank
            ahead of <strong className="text-red-500 dark:text-red-400">{company.name}</strong> on the keyboard leaderboard.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors shadow-sm"
          >
            See Live Rankings →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b0e] text-zinc-900 dark:text-white transition-colors duration-200">
      {/* Navbar */}
      <header className="border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-[#0d0e12]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
              <IconArrowLeft size={18} />
            </Link>
            <Image src="/icon_no_border.svg" alt="Keybid" width={28} height={28} className="w-7 h-7" />
            <span className="font-extrabold text-sm tracking-tight text-zinc-950 dark:text-white">
              KEY<span className="text-red-500">BID</span>
            </span>
            <span className="text-zinc-400 dark:text-zinc-600 text-sm">/</span>
            <span className="text-zinc-600 dark:text-zinc-400 text-sm truncate max-w-[140px] sm:max-w-none">{company.name}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12 space-y-8">
        {/* Hero Banner */}
        <div className="rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-500/10 to-white dark:to-zinc-900/60 p-6 text-center space-y-3 shadow-xs">
          <div className="text-xs font-mono text-red-500 dark:text-red-400 uppercase tracking-widest font-semibold">
            {rank === 1 ? '👑 Currently #1' : `Currently #${rank} on leaderboard`}
          </div>
          <h1 className="text-2xl font-black text-zinc-950 dark:text-white">
            OUTBID <span className="text-red-500">@{company.name}</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Beat their bid to take their keyboard key and rank above them.
          </p>
        </div>

        {/* Company card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 flex items-start gap-4 shadow-xs">
          {!iconErr && company.iconUrl ? (
            <img
              src={company.iconUrl}
              alt={company.name}
              width={52}
              height={52}
              onError={() => setIconErr(true)}
              className="rounded-xl object-contain shrink-0 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1"
              style={{ width: 52, height: 52 }}
            />
          ) : (
            <div className="w-[52px] h-[52px] rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xl shrink-0">
              {company.name[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-lg text-zinc-950 dark:text-white">{company.name}</span>
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
              >
                <IconExternalLink size={14} />
              </a>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-0.5 leading-relaxed">{company.tagline}</p>
            <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <IconFlame size={11} className="text-red-500 dark:text-red-400" /> {company.clicks} clicks
              </span>
              <span className="flex items-center gap-1">
                <IconTrophy size={11} className="text-amber-500 dark:text-amber-400" /> #{rank} ranked
              </span>
              <span>Key: {company.keySlot}</span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-2xl font-black text-zinc-950 dark:text-white">${company.bid}</div>
            <div className="text-[11px] text-zinc-500 font-mono">current bid</div>
          </div>
        </div>

        {/* Outbid controls */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-5 shadow-xs">
          <div className="space-y-1">
            <h2 className="font-bold text-zinc-950 dark:text-white text-sm">Your Bid Amount</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              You need to bid at least <strong className="text-zinc-900 dark:text-white">${minBid}</strong> to outrank {company.name}.
            </p>
          </div>

          {/* Bid stepper */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setBidAmount(Math.max(minBid, bidAmount - 1))}
              className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xl font-bold transition-colors cursor-pointer"
            >
              −
            </button>
            <div className="flex-1 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-center py-3">
              <div className="text-3xl font-black text-zinc-950 dark:text-white">${bidAmount}</div>
              <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                {bidAmount >= minBid
                  ? `✓ beats ${company.name} by $${bidAmount - company.bid}`
                  : `Need at least $${minBid}`
                }
              </div>
            </div>
            <button
              onClick={() => setBidAmount(bidAmount + 1)}
              className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xl font-bold transition-colors cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Quick bids */}
          <div className="flex gap-2 flex-wrap">
            {[minBid, minBid + 5, minBid + 10, minBid + 25].map((amt) => (
              <button
                key={amt}
                onClick={() => setBidAmount(amt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  bidAmount === amt
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-400 hover:border-red-500 hover:text-red-500'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          <button
            onClick={handleOutbid}
            disabled={loading || bidAmount < minBid}
            className="w-full rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…
              </>
            ) : (
              <>
                <IconArrowUp size={15} /> Outbid {company.name} for ${bidAmount}
              </>
            )}
          </button>
        </div>

        {/* Leaderboard context — who's around this company */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nearby Rankings</h3>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-transparent shadow-xs">
            {sorted.slice(Math.max(0, companyIdx - 2), companyIdx + 3).map((c) => {
              const actualRank = sorted.indexOf(c) + 1;
              const isTarget = c.id === id;
              return (
                <div
                  key={c.id}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800/50 last:border-b-0 ${
                    isTarget ? 'bg-red-500/10 border-l-2 border-l-red-500' : ''
                  }`}
                >
                  <span
                    className={`text-xs font-mono w-5 text-center ${
                      actualRank === 1 ? 'text-amber-500 font-bold' : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    {actualRank}
                  </span>
                  {!iconErr ? (
                    <img
                      src={c.iconUrl}
                      alt={c.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded object-contain"
                      onError={() => {}}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white text-[10px] font-bold">
                      {c.name[0]}
                    </div>
                  )}
                  <span className={`flex-1 text-xs font-medium ${isTarget ? 'text-red-500 font-bold' : 'text-zinc-800 dark:text-zinc-300'}`}>
                    {c.name}
                    {isTarget && <span className="text-zinc-400 dark:text-zinc-500 font-normal ml-1">← target</span>}
                  </span>
                  <span className="text-xs font-black text-zinc-950 dark:text-white">${c.bid}</span>
                </div>
              );
            })}
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors justify-center"
        >
          <IconArrowLeft size={14} /> Back to full leaderboard
        </Link>
      </main>
    </div>
  );
}
