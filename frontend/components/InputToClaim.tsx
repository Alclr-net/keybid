"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface CompanyInfo {
    domain: string;
    logo: string;
}

interface UriClaimInputProps {
    onClaim: (uri: string, info: CompanyInfo | null) => void;
    placeholder?: string;
    disabled?: boolean;
    debounceMs?: number;
}

function normalizeDomain(input: string): string | null {
    const trimmed = input.trim();
    if (!trimmed) return null;
    try {
        const url = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return null;
    }
}

export default function UriClaimInput({
    onClaim,
    placeholder = "yourcompany.com",
    disabled = false,
    debounceMs = 450,
}: UriClaimInputProps) {
    const [value, setValue] = useState("");
    const [info, setInfo] = useState<CompanyInfo | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">("idle");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resolveCompany = useCallback((domain: string) => {
        setStatus("loading");
        const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

        console.log("[UriClaimInput] fetching logo:", logoUrl);

        const img = new Image();
        img.onload = () => {
            console.log("[UriClaimInput] logo loaded ✅", logoUrl);
            setInfo({ domain, logo: logoUrl });
            setStatus("found");
        };
        img.onerror = (e) => {
            console.error("[UriClaimInput] logo FAILED to load ❌", logoUrl, e);
            setInfo(null);
            setStatus("error");
        };
        img.src = logoUrl;
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const domain = normalizeDomain(value);
        if (!domain) {
            setInfo(null);
            setStatus("idle");
            return;
        }

        console.log("[UriClaimInput] typing, debouncing:", domain);

        debounceRef.current = setTimeout(() => {
            resolveCompany(domain);
        }, debounceMs);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [value, debounceMs, resolveCompany]);

    const canClaim = status === "found" && !disabled;

    return (
        <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
            {/* Left: logo preview */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100 text-base dark:bg-neutral-900">
                {status === "loading" && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
                )}
                {status === "found" && info && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={info.logo}
                        alt={`${info.domain} logo`}
                        className="h-full w-full object-contain p-1.5"
                    />
                )}
                {status === "error" && <span title="Logo failed to load">⚠️</span>}
                {status === "idle" && <span className="text-neutral-300 dark:text-neutral-700">🌐</span>}
            </div>

            {/* Middle: input */}
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                spellCheck={false}
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent px-1 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 disabled:opacity-50 dark:text-neutral-100 dark:placeholder:text-neutral-600"
            />

            {/* Right: claim button */}
            <button
                type="button"
                disabled={!canClaim}
                onClick={() => onClaim(value.trim(), info)}
                className="shrink-0 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors enabled:hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 dark:bg-white dark:text-neutral-900 dark:enabled:hover:bg-neutral-200 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-600"
            >
                Claim
            </button>
        </div>
    );
}