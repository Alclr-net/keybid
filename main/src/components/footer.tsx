import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG, FOOTER_NAV_LINKS } from '@/lib/constant';

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-100 dark:border-white/5 bg-transparent pt-12 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Top: Bio & Profile */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-zinc-200/80 dark:border-white/15 bg-zinc-100 dark:bg-zinc-800 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/avatar"
              alt={SITE_CONFIG.creator}
              className="w-full h-full object-cover object-center rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white flex items-center gap-1.5">
              Hey, I&apos;m {SITE_CONFIG.creator}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
              A design engineer who can take a concept from initial idea through to shipped product. Right now, people bid for keys off my daily-driver Apple Magic Keyboard. Curious, or want in?{' '}
              <a
                href={SITE_CONFIG.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center"
              >
                Find me on X
              </a>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-zinc-200/80 dark:border-white/10 my-7" />

        {/* Bottom: Links & Apple Disclaimer */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-6 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {FOOTER_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-normal leading-relaxed">
            Keybid is not affiliated with, endorsed by, or sponsored by Apple Inc. Apple Magic Keyboard is a trademark of Apple Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
