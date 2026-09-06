'use client';

import React, { useState } from 'react';
import { KeyConfig, KeyboardTheme } from '../types/keyboard';
import { IconExternalLink, IconPlus } from './Icons';

interface KeyCapProps {
  keyConfig: KeyConfig;
  theme?: KeyboardTheme;
  soundEnabled?: boolean;
  onSelectKey: (key: KeyConfig) => void;
  onOpenStartup: (url: string) => void;
}

export const KeyCap: React.FC<KeyCapProps> = ({
  keyConfig,
  soundEnabled = true,
  onSelectKey,
  onOpenStartup,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const startup = keyConfig.startup;

  // Audio click synth
  const playClickSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(startup ? 750 : 550, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // Audio context error handle
    }
  };

  const handleMouseDown = () => {
    setIsPressed(true);
    playClickSound();
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (startup) {
      onOpenStartup(startup.url);
    } else {
      onSelectKey(keyConfig);
    }
  };

  const widthMultiplier = keyConfig.widthMultiplier || 1;
  const isFnRow = keyConfig.row === 0;
  const isSpacebar = keyConfig.id === 'SPACE';
  const glowColor = startup?.color || '#e11d48';

  return (
    <div
      className="relative group select-none flex-shrink-0"
      style={{
        flexGrow: widthMultiplier,
        flexShrink: 0,
        minWidth: isFnRow ? `${widthMultiplier * 32}px` : `${widthMultiplier * 38}px`,
        maxWidth: isSpacebar ? '100%' : isFnRow ? `${widthMultiplier * 48}px` : `${widthMultiplier * 64}px`,
        height: isFnRow ? '34px' : '46px',
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => {
        setShowTooltip(false);
        setIsPressed(false);
      }}
    >
      {/* ThinkPad Signature Curved Keycap */}
      <button
        type="button"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        style={{
          boxShadow: isPressed
            ? 'inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.05)'
            : startup
              ? `0 3px 0 #0d0e11, 0 6px 12px ${glowColor}35, inset 0 1px 1px rgba(255,255,255,0.15)`
              : '0 3px 0 #0a0b0d, 0 4px 6px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.12)',
        }}
        className={`
          w-full h-full transition-all duration-75 ease-out flex flex-col items-center justify-between cursor-pointer relative overflow-hidden
          rounded-t-[6px] rounded-b-[10px] border border-zinc-800/90
          ${isFnRow ? 'px-1 py-1 text-[9px]' : 'px-1.5 py-1 text-xs'}
          ${isPressed ? 'translate-y-[2.5px]' : 'translate-y-0 hover:-translate-y-[0.5px]'}
          ${startup
            ? 'bg-gradient-to-b from-zinc-800 to-zinc-900 text-white border-zinc-700/80 hover:border-zinc-500'
            : keyConfig.isSpecial
              ? 'bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-300 hover:text-white hover:from-zinc-800'
              : 'bg-gradient-to-b from-zinc-850 via-zinc-900 to-[#141518] text-zinc-100 hover:from-zinc-800 hover:to-zinc-900'
          }
        `}
      >
        {/* Curved ThinkPad Scoop Bottom Lip Shadow */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 pointer-events-none rounded-b-[10px]" />

        {/* Top Key Label */}
        <div className="w-full flex justify-between items-center font-mono leading-none tracking-tight">
          <span className={`${isFnRow ? 'text-[9px] text-zinc-400 font-sans' : 'text-[11px] font-semibold text-zinc-200'} truncate`}>
            {keyConfig.label}
          </span>
          {startup && (
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
              style={{ backgroundColor: glowColor }}
            />
          )}
        </div>

        {/* Center Keycap Body (Logo or Claim indicator) */}
        <div className="flex-1 w-full flex items-center justify-center relative z-10 px-0.5">
          {startup ? (
            <div className="flex items-center justify-center w-full h-full max-h-[26px] transition-transform group-hover:scale-105">
              {startup.logo ? (
                <img
                  src={startup.logo}
                  alt={startup.name}
                  className="max-h-6 max-w-[85%] object-contain drop-shadow-md rounded"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="font-bold text-[10px] truncate text-zinc-100 max-w-full">
                  {startup.name}
                </span>
              )}
            </div>
          ) : !isFnRow && !keyConfig.isSpecial ? (
            <div className="hidden group-hover:flex items-center gap-0.5 text-[9px] font-bold text-red-400 bg-red-500/10 px-1 py-0.5 rounded border border-red-500/30">
              <IconPlus size={10} />
              <span>Claim</span>
            </div>
          ) : null}
        </div>
      </button>

      {/* Glassmorphic Hover Preview Tooltip Card */}
      {showTooltip && startup && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none min-w-[200px] max-w-[260px]">
          <div className="bg-zinc-950/95 backdrop-blur-xl border border-zinc-700/80 rounded-2xl p-3 shadow-2xl text-left space-y-2 transform transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2.5">
              {startup.logo && (
                <img
                  src={startup.logo}
                  alt={startup.name}
                  className="w-8 h-8 rounded-lg object-contain bg-zinc-900 border border-zinc-800 p-1"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-white truncate flex items-center gap-1.5">
                  {startup.name}
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: glowColor }}
                  />
                </h4>
                <p className="text-[11px] text-zinc-400 truncate">
                  Key: <span className="font-mono font-bold text-zinc-200">{keyConfig.label}</span>
                </p>
              </div>
            </div>

            {startup.tagline && (
              <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed border-t border-zinc-800/80 pt-2">
                {startup.tagline}
              </p>
            )}

            <div className="pt-1 flex items-center justify-between text-[10px] text-red-400 font-medium">
              <span className="flex items-center gap-1">
                <IconExternalLink size={12} /> Click to visit URL
              </span>
              <span className="text-zinc-500 font-mono">
                {startup.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </span>
            </div>
          </div>
          <div className="w-2.5 h-2.5 bg-zinc-950 border-r border-b border-zinc-700 transform rotate-45 mx-auto -mt-1.5" />
        </div>
      )}
    </div>
  );
};
