'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { IconArrowLeft, IconCheck, IconLink, IconUpload } from '@tabler/icons-react';
import { ThemeToggle } from '@/src/components/ThemeToggle';

function SubmitForm() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('url') || '';

  const [form, setForm] = useState({
    name: '',
    url: initialUrl,
    tagline: '',
    bid: 1,
  });

  useEffect(() => {
    if (initialUrl && !form.url) {
      setForm((prev) => ({ ...prev, url: initialUrl }));
    }
  }, [initialUrl, form.url]);

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setIconPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b0e] text-zinc-900 dark:text-white flex items-center justify-center px-4 transition-colors duration-200">
        <div className="text-center max-w-md space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/40 flex items-center justify-center text-green-500 mx-auto">
            <IconCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">You&apos;re in the queue!</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal leading-relaxed">
            <strong className="text-zinc-950 dark:text-white font-semibold">{form.name}</strong> has been submitted with a bid of{' '}
            <strong className="text-blue-600 dark:text-blue-400 font-semibold">${form.bid}</strong>. Once reviewed, your company
            will appear on the live leaderboard.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-600/50 disabled:text-white/50 text-white font-bold text-sm transition-colors shadow-sm cursor-pointer"
          >
            View Leaderboard →
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
            <span className="text-zinc-400 dark:text-zinc-500 text-sm">/ Claim a Key</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">Claim a keyboard key</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal leading-relaxed">
            Highest bidder gets displayed on the keyboard. Anyone can outbid you.
            Starting bid is <strong className="text-zinc-900 dark:text-white font-semibold">$1</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Company Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Acme Corp"
              className="w-full rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none px-4 py-3 text-zinc-900 dark:text-white text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-colors shadow-2xs"
            />
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">submitted_url URL</label>
            <div className="relative">
              <IconLink size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <input
                required
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://yourcompany.com"
                className="w-full rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none pl-10 pr-4 py-3 text-zinc-900 dark:text-white text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              One-line tagline <span className="text-zinc-400 dark:text-zinc-600 normal-case font-normal">(optional)</span>
            </label>
            <input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="What does your company do?"
              maxLength={100}
              className="w-full rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none px-4 py-3 text-zinc-900 dark:text-white text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-colors shadow-2xs"
            />
          </div>

          {/* Icon upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Company Icon / Logo <span className="text-zinc-400 dark:text-zinc-600 normal-case font-normal">(PNG, SVG)</span>
            </label>
            <label className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 border-dashed hover:border-blue-600 cursor-pointer transition-colors group shadow-2xs">
              {iconPreview ? (
                <img src={iconPreview} alt="preview" className="w-12 h-12 rounded-lg object-contain" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:text-blue-600 transition-colors">
                  <IconUpload size={22} />
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-zinc-900 dark:text-white">
                  {iconFile ? iconFile.name : 'Upload icon'}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">PNG, SVG, ICO — max 2MB</div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleIcon} />
            </label>
          </div>

          {/* Bid */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Your Bid (USD)</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, bid: Math.max(1, form.bid - 1) })}
                className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-bold hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-2xs"
              >
                −
              </button>
              <div className="flex-1 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-4 py-3 text-center text-2xl font-black text-zinc-950 dark:text-white shadow-2xs">
                ${form.bid}
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, bid: form.bid + 1 })}
                className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-bold hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-2xs"
              >
                +
              </button>
            </div>
            <p className="text-xs text-zinc-500 text-center">
              Minimum bid is $1. Current leader is at <strong className="text-zinc-900 dark:text-white">$43</strong>.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-600/50 disabled:text-white/50 text-white font-bold py-3.5 text-sm transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…
              </>
            ) : (
              'Claim Key & Submit →'
            )}
          </button>

          <p className="text-center text-xs text-zinc-500">
            By submitting you agree that anyone can outbid you for your key at any time.
          </p>
        </form>
      </main>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b0e] flex items-center justify-center">
          <div className="text-zinc-500 text-sm font-mono animate-pulse">Loading form…</div>
        </div>
      }
    >
      <SubmitForm />
    </Suspense>
  );
}
