'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import type { Key } from '@/lib/types/database';
import { getKeyById } from '@/lib/helpers/keys';
import KeyLogo from '@/src/components/ui/KeyLogo';
import { IconArrowLeft, IconArrowUp, IconExternalLink, IconFlame, IconTrophy, IconLock } from '@tabler/icons-react';
import { ThemeToggle } from '@/src/components/ThemeToggle';

export default function OutbidPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || '';

  const [keyData, setKeyData] = useState<Key | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(10);
  const [outbid, setOutbid] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function loadKey() {
      setIsLoading(true);
      setError(null);
      try {
        const key = await getKeyById(id);
        if (isMounted) {
          setKeyData(key);
          if (key) {
            const currentHighest = key.current_bid_amount || 0;
            setBidAmount(Math.max(10, currentHighest + 1));
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          const e = err as { message?: string };
          setError(e?.message || "Failed to load key details");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadKey();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b0e] text-zinc-900 dark:text-white flex items-center justify-center transition-colors duration-200">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 border-2 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            Loading key details...
          </p>
        </div>
      </div>
    );
  }

  if (!keyData || error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b0e] text-zinc-900 dark:text-white flex items-center justify-center transition-colors duration-200">
        <div className="text-center space-y-4">
          <div className="text-4xl">🔍</div>
          <h1 className="text-xl font-bold">Key not found</h1>
          <p className="text-sm text-zinc-500">{error || "The requested key could not be located in the auction registry."}</p>
          <Link href="/auction" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-semibold inline-block">
            ← Back to leaderboard
          </Link>
        </div>
      </div>
    );
  }

  const name = keyData.key_name || `Key ${keyData.id.slice(0, 4)}`;
  const keySlot = (keyData.key_name || keyData.id.slice(0, 1)).toUpperCase();
  const currentBid = keyData.current_bid_amount || 0;
  const minBid = Math.max(10, currentBid + 1);

  const handleOutbid = () => {
    if (bidAmount < minBid) return;
    router.push(`/bid/${encodeURIComponent(keySlot)}?amount=${bidAmount}&brand=${encodeURIComponent(name)}`);
  };

  if (outbid) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b0e] text-zinc-900 dark:text-white flex items-center justify-center px-4 transition-colors duration-200">
        <div className="text-center max-w-sm space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-500 mx-auto text-3xl">
            👑
          </div>
          <h1 className="text-2xl font-bold tracking-tight">You outbid {name}!</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal leading-relaxed">
            You placed a bid of <strong className="text-zinc-950 dark:text-white font-semibold">${bidAmount}</strong> — you now rank
            ahead of <strong className="text-blue-600 dark:text-blue-400 font-semibold">{name}</strong> on the keyboard leaderboard.
          </p>
          <Link
            href="/auction"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-600/50 disabled:text-white/50 text-white font-bold text-sm transition-colors shadow-sm cursor-pointer"
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
            <span className="text-zinc-600 dark:text-zinc-400 text-sm truncate max-w-[140px] sm:max-w-none">{name}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12 space-y-8">
        {/* Hero Banner */}
        <div className="rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-500/10 to-white dark:to-zinc-900/60 p-6 text-center space-y-3 shadow-xs">
          <div className="text-xs font-mono text-red-500 dark:text-red-400 uppercase tracking-widest font-semibold">
            Key [{keySlot}] on Apple Magic Keyboard
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            OUTBID <span className="text-blue-600 dark:text-blue-400">@{name}</span>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal">
            Beat their bid to take their keyboard key and claim permanent placement.
          </p>
        </div>

        {/* Key card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 flex items-start gap-4 shadow-xs">
          <KeyLogo
            src={keyData.key_logo}
            alt={name}
            fallbackText={name}
            className="w-[52px] h-[52px] rounded-xl object-contain shrink-0 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1"
            fallbackClassName="w-[52px] h-[52px] rounded-xl text-xl"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-lg text-zinc-950 dark:text-white">{name}</span>
              {keyData.submitted_url && (
                <a
                  href={keyData.submitted_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                >
                  <IconExternalLink size={14} />
                </a>
              )}
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-0.5 leading-relaxed">
              {keyData.about || "Claimed Hardware Placement"}
            </p>
            <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <IconFlame size={11} className="text-red-500 dark:text-red-400" /> Key [{keySlot}]
              </span>
              <span className="flex items-center gap-1">
                <IconTrophy size={11} className="text-amber-500 dark:text-amber-400" /> Current Bid: ${currentBid}
              </span>
            </div>
          </div>
        </div>

        {/* Bid input card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-6 shadow-xs">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Your Bid Amount</span>
              <span>Minimum: <strong className="text-zinc-950 dark:text-white font-bold">${minBid}</strong></span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-zinc-400">$</span>
              <input
                type="number"
                min={minBid}
                value={bidAmount}
                onChange={(e) => setBidAmount(Math.max(minBid, Number(e.target.value)))}
                className="w-full pl-9 pr-4 py-3 text-2xl font-bold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Preset buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[minBid, minBid + 5, minBid + 15, minBid + 50].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setBidAmount(amt)}
                className={`py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  bidAmount === amt
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleOutbid}
            disabled={bidAmount < minBid}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-600/50 disabled:text-white/50 text-white font-bold text-sm transition-colors shadow-sm cursor-pointer"
          >
            <IconArrowUp size={16} />
            <span>Outbid {name} for ${bidAmount}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
