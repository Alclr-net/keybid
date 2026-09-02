'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { KeyConfig, StartupData } from '../types/keyboard';
import { INITIAL_KEYBOARD_LAYOUT, SAMPLE_STARTUPS } from '../data/sampleStartups';
import { KeyCap } from './KeyCap';
import { ClaimModal } from './ClaimModal';
import {
  IconSearch,
  IconVolume,
  IconVolumeOff,
  IconPlus,
  IconExternalLink,
  IconEdit,
  IconFlame,
} from './Icons';

export const Keyboard: React.FC = () => {
  const [layout, setLayout] = useState<KeyConfig[][]>(INITIAL_KEYBOARD_LAYOUT);
  const [selectedKey, setSelectedKey] = useState<KeyConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  // ── Hydration + persist ──────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('keybid_keyboard_state');
      if (saved) {
        const parsedState: Record<string, StartupData> = JSON.parse(saved);
        setLayout((prev) =>
          prev.map((row) =>
            row.map((k) => ({ ...k, startup: parsedState[k.id] ?? undefined }))
          )
        );
        return;
      }
    } catch { /* silent */ }

    setLayout((prev) =>
      prev.map((row) =>
        row.map((k) => ({ ...k, startup: SAMPLE_STARTUPS[k.id] ?? undefined }))
      )
    );
  }, []);

  const persist = (next: KeyConfig[][]) => {
    try {
      const map: Record<string, StartupData> = {};
      next.forEach((row) => row.forEach((k) => { if (k.startup) map[k.id] = k.startup; }));
      localStorage.setItem('keybid_keyboard_state', JSON.stringify(map));
    } catch { /* silent */ }
  };

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleSave = (keyId: string, startup: StartupData) => {
    const next = layout.map((row) =>
      row.map((k) => (k.id === keyId ? { ...k, startup } : k))
    );
    setLayout(next);
    persist(next);
  };

  const handleRemove = (keyId: string) => {
    const next = layout.map((row) =>
      row.map((k) => (k.id === keyId ? { ...k, startup: undefined } : k))
    );
    setLayout(next);
    persist(next);
  };

  const openUrl = (url: string) => {
    if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer');
  };

  // ── Derived state ────────────────────────────────────────────────────────
  const allKeys = useMemo(() => layout.flat(), [layout]);
  const claimedKeys = useMemo(() => allKeys.filter((k) => k.startup), [allKeys]);

  const matchingIds = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return new Set<string>();
    const s = new Set<string>();
    allKeys.forEach((k) => {
      if (
        k.id.toLowerCase().includes(q) ||
        k.label.toLowerCase().includes(q) ||
        k.startup?.name.toLowerCase().includes(q) ||
        k.startup?.url.toLowerCase().includes(q)
      ) s.add(k.id);
    });
    return s;
  }, [allKeys, searchQuery]);

  if (!mounted) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-zinc-600 text-sm font-mono animate-pulse">Loading keyboard…</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 px-4 py-6">

      {/* ── Controls bar ── */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <IconSearch
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search startup or key…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 outline-none transition-colors"
          />
        </div>

        {/* Stats pill */}
        <div className="flex items-center gap-2 text-xs font-mono px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
          <IconFlame size={14} className="text-red-500" />
          <span className="text-white font-bold">{claimedKeys.length}</span>
          <span className="text-zinc-600">/ {allKeys.length}</span>
          <span>claimed</span>
        </div>

        {/* Sound toggle */}
        <button
          type="button"
          onClick={() => setSoundEnabled((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all shrink-0
            ${soundEnabled
              ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
              : 'bg-zinc-950 border-zinc-800 text-zinc-500'
            }`}
        >
          {soundEnabled
            ? <IconVolume size={14} className="text-red-500" />
            : <IconVolumeOff size={14} />
          }
          <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
        </button>

        {/* Claim CTA */}
        <button
          type="button"
          onClick={() => {
            const unclaimed = allKeys.find((k) => !k.startup);
            setSelectedKey(unclaimed ?? allKeys[0]);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all hover:shadow-lg hover:shadow-red-600/30 shrink-0"
        >
          <IconPlus size={14} />
          Claim Key
        </button>
      </div>

      {/* ── Key grid ── */}
      <div className="relative p-5 md:p-8 rounded-2xl bg-[#1a1c22] border border-zinc-800/60 shadow-2xl overflow-x-auto select-none">
        <div className="min-w-[840px] space-y-1.5">
          {layout.map((row, ri) => (
            <div key={ri} className="flex gap-1.5 justify-between">
              {row.map((key) => {
                const dimmed = searchQuery && !matchingIds.has(key.id);
                return (
                  <div
                    key={key.id}
                    className={`flex-1 transition-all duration-200 ${dimmed ? 'opacity-20 blur-[0.5px]' : ''}`}
                  >
                    <KeyCap
                      keyConfig={key}
                      theme="cyber"
                      soundEnabled={soundEnabled}
                      onSelectKey={setSelectedKey}
                      onOpenStartup={openUrl}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Claimed startups grid ── */}
      {claimedKeys.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
            Claimed Keys
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {claimedKeys.map((k) => {
              const s = k.startup!;
              return (
                <div
                  key={k.id}
                  className="bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-4 space-y-3 transition-all hover:-translate-y-0.5 hover:shadow-xl group"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {s.logo
                        ? <img src={s.logo} alt={s.name} className="w-8 h-8 rounded-lg object-contain bg-zinc-800 p-1" />
                        : (
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center font-bold text-red-400 text-sm">
                            {s.name[0]}
                          </div>
                        )
                      }
                      <div>
                        <div className="font-bold text-sm text-white leading-tight">{s.name}</div>
                        <div className="text-[10px] text-zinc-600 font-mono">Key: {k.label}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedKey(k)}
                      className="p-1.5 rounded-lg bg-zinc-800/0 hover:bg-zinc-800 text-zinc-600 hover:text-white transition-colors"
                    >
                      <IconEdit size={13} />
                    </button>
                  </div>

                  {/* Tagline */}
                  {s.tagline && (
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{s.tagline}</p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                    <span className="text-[10px] font-mono text-zinc-600 truncate max-w-[120px]">
                      {s.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </span>
                    <button
                      type="button"
                      onClick={() => openUrl(s.url)}
                      className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-400 font-semibold transition-colors"
                    >
                      Visit <IconExternalLink size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Modal ── */}
      <ClaimModal
        selectedKey={selectedKey}
        onClose={() => setSelectedKey(null)}
        onSaveStartup={handleSave}
        onRemoveStartup={handleRemove}
      />
    </div>
  );
};
