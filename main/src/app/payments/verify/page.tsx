"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Status = "verifying" | "success" | "already_confirmed" | "failed";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const order_id = searchParams.get("order_id");

  const [status, setStatus] = useState<Status>("verifying");
  const [errorMsg, setErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(4);

  // Call verify API
  useEffect(() => {
    if (!order_id) {
      setStatus("failed");
      setErrorMsg("No order ID was found in the URL.");
      setCountdown(5);
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id }),
        });
        const data = await res.json();

        if (!isMounted) return;

        if (data.success) {
          setStatus(data.alreadyConfirmed ? "already_confirmed" : "success");
          setCountdown(4);
        } else {
          setStatus("failed");
          setErrorMsg(data.error || "Payment was not completed or could not be verified.");
          setCountdown(5);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        setStatus("failed");
        setErrorMsg("Network error — could not reach the server.");
        setCountdown(5);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [order_id]);

  // Countdown and auto-transfer to home page for both success and failed states
  useEffect(() => {
    if (status === "verifying") return;

    if (countdown <= 0) {
      router.replace("/");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status, countdown, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#f8fafc] dark:bg-[#080a0d] text-zinc-900 dark:text-white transition-colors selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#121316] shadow-2xl p-8 sm:p-10 flex flex-col items-center gap-6 text-center">

        {/* ── 1. Verifying State ── */}
        {status === "verifying" && (
          <>
            <SpinnerIcon />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Verifying Payment
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Confirming order <span className="font-mono font-medium text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">{order_id || "..."}</span> with gateway.
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Please do not refresh or close this tab.
              </p>
            </div>
          </>
        )}

        {/* ── 2. Success / Confirmed State ── */}
        {(status === "success" || status === "already_confirmed") && (
          <>
            <SuccessIcon />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {status === "already_confirmed" ? "Bid Already Confirmed" : "Payment Confirmed! 🎉"}
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {status === "already_confirmed"
                  ? "This bid has already been recorded and secured."
                  : "Your key has been claimed and your bid is now live!"}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                Transferring you to home in {countdown} second{countdown === 1 ? "" : "s"}...
              </p>
            </div>

            {/* Visual progress bar */}
            <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((4 - countdown) / 4) * 100}%` }}
              />
            </div>

            <Link
              href="/"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-semibold text-sm transition-all text-center block shadow-lg shadow-emerald-500/20"
            >
              Go to keyboard now →
            </Link>
          </>
        )}

        {/* ── 3. Failed State ── */}
        {status === "failed" && (
          <>
            <ErrorIcon />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Payment Not Confirmed
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-xs mx-auto">
                {errorMsg}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium pt-1">
                Transferring you to home in {countdown} second{countdown === 1 ? "" : "s"}...
              </p>
            </div>

            {/* Visual progress bar for error */}
            <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              />
            </div>

            <div className="w-full flex flex-col gap-2.5">
              <Link
                href="/"
                className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 active:scale-[0.98] text-white dark:text-zinc-900 font-semibold text-sm transition-all text-center block shadow-md"
              >
                Return to home now
              </Link>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                If your payment was deducted from bank, please contact{" "}
                <a href="mailto:support@keybid.lol" className="underline hover:text-zinc-700 dark:hover:text-zinc-200">
                  support@keybid.lol
                </a>
              </p>
            </div>
          </>
        )}

      </div>
    </main>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg
        className="w-16 h-16 animate-spin text-zinc-200 dark:text-zinc-800"
        viewBox="0 0 64 64"
        fill="none"
      >
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" />
      </svg>
      <svg
        className="w-16 h-16 animate-spin absolute inset-0 text-blue-600 dark:text-blue-500"
        style={{ animationDuration: "0.8s" }}
        viewBox="0 0 64 64"
        fill="none"
      >
        <path
          d="M32 4a28 28 0 0 1 28 28"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function SuccessIcon() {
  return (
    <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border-2 border-emerald-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.25)]">
      <svg className="w-8 h-8 text-emerald-500 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

function ErrorIcon() {
  return (
    <div className="w-16 h-16 rounded-full bg-red-500/10 dark:bg-red-500/20 border-2 border-red-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.2)]">
      <svg className="w-8 h-8 text-red-500 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      </svg>
    </div>
  );
}

// ── Page Component with Suspense ─────────────────────────────────────────────

export default function PaymentVerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] dark:bg-[#080a0d]">
          <SpinnerIcon />
        </main>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
