"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { IconWorld, IconAlertCircle } from "@tabler/icons-react";
import { cn } from "@/src/lib/utils";
import { getFaviconProviders } from "@/lib/constant";

interface CompanyInfo {
    domain: string;
    logo: string;
}

interface UriClaimInputProps {
    onClaim: (uri: string, info: CompanyInfo | null) => void;
    placeholder?: string;
    disabled?: boolean;
    debounceMs?: number;
    className?: string;
}

function normalizeDomain(input: string): string | null {
    const trimmed = input.trim();
    console.log(trimmed)
    if (!trimmed) return null;
    try {
        const url = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return null;
    }
}

export function UriClaimInput({
    onClaim,
    placeholder = "https://yourcompany.com",
    disabled = false,
    debounceMs = 450,
    className,
}: UriClaimInputProps) {
    const [value, setValue] = useState("");
    const [info, setInfo] = useState<CompanyInfo | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">("idle");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resolveCompany = useCallback((domain: string) => {
        setStatus("loading");

        const providers = getFaviconProviders(domain);

        const loadImage = (url: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject();
                img.src = url;
            });
        };

        (async () => {
            for (const logoUrl of providers) {
                try {
                    const img = await loadImage(logoUrl);
                    if (img.naturalWidth > 16 && img.naturalHeight > 16) {
                        setInfo({ domain, logo: logoUrl });
                        setStatus("found");
                        return;
                    }
                } catch {
                    // try next provider
                }
            }
            setInfo(null);
            setStatus("error");
        })();
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const domain = normalizeDomain(value);
        if (!domain) {
            setInfo(null);
            setStatus("idle");
            return;
        }

        debounceRef.current = setTimeout(() => {
            resolveCompany(domain);
        }, debounceMs);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [value, debounceMs, resolveCompany]);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClaimClick = () => {
        const trimmed = value.trim();
        if (!trimmed) {
            inputRef.current?.focus();
            return;
        }
        const domain = normalizeDomain(trimmed);
        const targetUri = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
        const claimInfo = info || (domain ? { domain, logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128` } : null);
        onClaim(targetUri, claimInfo);
    };

    return (
        <div className={cn("w-full max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3", className)}>
            {/* ── Left Group: Separated Logo Badge + Large Spacious Input ── */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                {/* ── 1. Separated Domain/Logo Badge ── */}
                <div className="relative flex w-12 h-12 sm:w-14 sm:h-14 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/90 dark:border-white/15 bg-white dark:bg-zinc-900 shadow-sm transition-all overflow-hidden select-none">
                    {status === "loading" && (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600 dark:border-zinc-700 dark:border-t-blue-400" />
                    )}
                    {status === "found" && info && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={info.logo}
                            alt={`${info.domain} logo`}
                            className="w-full h-full object-contain p-2.5"
                        />
                    )}
                    {status === "error" && (
                        <IconAlertCircle size={22} className="text-amber-500" title="Logo not found" />
                    )}
                    {status === "idle" && (
                        <IconWorld size={22} className="text-zinc-400 dark:text-zinc-500" />
                    )}
                </div>

                {/* ── 2. Separated Large Spacious Text Input Container ── */}
                <div className="flex-1 relative flex items-center h-12 sm:h-14 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-white/15 shadow-sm transition-all duration-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15">
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleClaimClick();
                            }
                        }}
                        placeholder={placeholder}
                        disabled={disabled}
                        spellCheck={false}
                        autoComplete="off"
                        className="w-full h-full bg-transparent px-4 sm:px-6 text-base sm:text-lg text-zinc-950 dark:text-white outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 font-normal"
                    />
                </div>
            </div>

            {/* ── 3. Separated Claim Button (Never dims or shifts color on disable) ── */}
            <div className="w-full sm:w-auto p-[2px] rounded-2xl transition-all duration-200 ease-out shadow-xs bg-blue-600/20 shrink-0">
                <button
                    type="button"
                    onClick={handleClaimClick}
                    className={cn(
                        "w-full sm:w-auto h-12 sm:h-14 px-7 sm:px-9 rounded-[14px] text-sm sm:text-base font-bold tracking-wide transition-all cursor-pointer select-none flex items-center justify-center gap-2",
                        "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white",
                        "shadow-[0_4px_16px_rgba(37,99,235,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.25)] hover:shadow-[0_6px_22px_rgba(37,99,235,0.45)]"
                    )}
                >
                    Claim a Key
                </button>
            </div>
        </div>
    );
}

export { UriClaimInput as InputToClaim };
export default UriClaimInput;