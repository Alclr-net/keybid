"use client";
export function Placeholder({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-600/15 border border-blue-300/60 dark:border-blue-600/30 text-blue-600 dark:text-blue-400 font-mono text-xs font-semibold">
            {children}
        </span>
    );
}