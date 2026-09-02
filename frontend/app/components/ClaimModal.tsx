'use client';

import React, { useState, useEffect } from 'react';
import { KeyConfig, StartupData } from '../types/keyboard';
import { IconX, IconUpload, IconCheck, IconTrash, IconSparkles, IconWorld, IconPalette } from './Icons';

interface ClaimModalProps {
  selectedKey: KeyConfig | null;
  onClose: () => void;
  onSaveStartup: (keyId: string, startup: StartupData) => void;
  onRemoveStartup?: (keyId: string) => void;
}

const PRESET_COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#000000', // Stealth Dark
];

export const ClaimModal: React.FC<ClaimModalProps> = ({
  selectedKey,
  onClose,
  onSaveStartup,
  onRemoveStartup,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [tagline, setTagline] = useState('');
  const [logo, setLogo] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedKey?.startup) {
      setName(selectedKey.startup.name || '');
      setUrl(selectedKey.startup.url || '');
      setTagline(selectedKey.startup.tagline || '');
      setLogo(selectedKey.startup.logo || '');
      setColor(selectedKey.startup.color || '#6366f1');
    } else {
      setName('');
      setUrl('');
      setTagline('');
      setLogo('');
      setColor('#6366f1');
    }
    setError('');
  }, [selectedKey]);

  if (!selectedKey) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Logo image must be under 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setLogo(event.target.result as string);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Startup Name is required');
      return;
    }
    if (!url.trim()) {
      setError('Redirect URL is required');
      return;
    }

    // Format URL with https if needed
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const startupData: StartupData = {
      id: selectedKey.startup?.id || `startup-${Date.now()}`,
      name: name.trim(),
      url: formattedUrl,
      logo: logo.trim(),
      tagline: tagline.trim(),
      color,
      claimedAt: selectedKey.startup?.claimedAt || new Date().toISOString().split('T')[0],
    };

    onSaveStartup(selectedKey.id, startupData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono font-bold text-lg">
              {selectedKey.label}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {selectedKey.startup ? 'Edit Key Assignment' : 'Claim Keyboard Key'}
                <IconSparkles size={16} className="text-amber-400" />
              </h3>
              <p className="text-xs text-zinc-400">
                Put your startup logo & URL on Key <span className="font-mono text-zinc-200">{selectedKey.label}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Form & Preview Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs flex items-center gap-2">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Live Key Cap Preview */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Live Keycap Preview
            </span>
            <div className="py-2">
              <div
                style={{
                  boxShadow: `0 4px 0 rgba(0,0,0,0.9), 0 8px 20px ${color}40`,
                  borderColor: color,
                }}
                className="w-24 h-16 rounded-2xl bg-zinc-950 border-2 flex flex-col items-center justify-between p-2 relative overflow-hidden transition-all"
              >
                <div className="w-full flex justify-between items-center text-[10px] font-mono text-zinc-400">
                  <span>{selectedKey.label}</span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                </div>
                <div className="flex-1 w-full flex items-center justify-center">
                  {logo ? (
                    <img src={logo} alt="Preview" className="max-h-8 max-w-[80%] object-contain" />
                  ) : (
                    <span className="text-xs font-bold text-zinc-300 truncate max-w-full">
                      {name || 'Your Logo'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Input: Startup Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              Startup Name <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Supabase"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600"
            />
          </div>

          {/* Input: Redirect Web URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300 flex items-center justify-between">
              <span>Redirect URL <span className="text-indigo-400">*</span></span>
              <span className="text-[10px] text-zinc-500 font-mono">Visitors land here on keypress</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <IconWorld size={16} />
              </div>
              <input
                type="url"
                required
                placeholder="https://yourstartup.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Input: Tagline */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              Tagline / Short Description
            </label>
            <input
              type="text"
              placeholder="e.g. The open source Firebase alternative"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600"
            />
          </div>

          {/* Input: Logo Upload or URL */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              Startup Logo (Image File or Image URL)
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* File Upload Box */}
              <label className="flex flex-col items-center justify-center p-3 bg-zinc-900 border border-dashed border-zinc-700 hover:border-indigo-500/80 rounded-xl cursor-pointer transition-colors group text-center">
                <IconUpload size={20} className="text-zinc-400 group-hover:text-indigo-400 mb-1" />
                <span className="text-xs text-zinc-300 font-medium">Upload Image File</span>
                <span className="text-[10px] text-zinc-500">PNG, SVG, JPG (Max 2MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* URL Input Box */}
              <div className="flex flex-col justify-center space-y-1">
                <input
                  type="text"
                  placeholder="Or paste image URL..."
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-zinc-600"
                />
                <p className="text-[10px] text-zinc-500 px-1">
                  Tip: Upload transparent PNG/SVG for best keycap glow.
                </p>
              </div>
            </div>
          </div>

          {/* Input: Accent & Backlight Color */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <IconPalette size={14} className="text-indigo-400" />
              <span>Backlight & Brand Accent Color</span>
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-xl transition-all border-2 ${
                    color === c ? 'scale-110 border-white ring-2 ring-indigo-500/50' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-7 h-7 rounded-xl bg-transparent border-0 cursor-pointer p-0"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
            {selectedKey.startup && onRemoveStartup ? (
              <button
                type="button"
                onClick={() => {
                  onRemoveStartup(selectedKey.id);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <IconTrash size={14} /> Remove Key
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <IconCheck size={16} /> Save Startup Key
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
