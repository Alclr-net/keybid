"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";

type Status = "verifying" | "success" | "already_confirmed" | "pending" | "failed";

const TOKEN_STORAGE_PREFIX = "keybid_client_token_";

function readClientToken(orderId: string): string | null {
  try {
    return sessionStorage.getItem(`${TOKEN_STORAGE_PREFIX}${orderId}`);
  } catch {
    return null;
  }
}

function clearClientToken(orderId: string) {
  try {
    sessionStorage.removeItem(`${TOKEN_STORAGE_PREFIX}${orderId}`);
  } catch {
    /* ignore */
  }
}

const MAX_CLIENT_RETRIES = 4;
const CLIENT_RETRY_DELAY_MS = 2000;

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const order_id = searchParams.get("order_id");

  const [status, setStatus] = useState<Status>("verifying");
  const [errorMsg, setErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(4);

  const verifyOnce = useCallback(async (orderId: string, clientToken: string | null) => {
    const res = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, client_token: clientToken }),
    });
    return res.json();
  }, []);

  // Call verify API, with client-side retry while the server reports "still processing"
  useEffect(() => {
    if (!order_id) {
      setStatus("failed");
      setErrorMsg("No order ID was found in the URL.");
      setCountdown(5);
      return;
    }

    let isMounted = true;
    const clientToken = readClientToken(order_id);

    if (!clientToken) {
      console.warn("[verify] No client_token found in this browser for order", order_id);
    }

    (async () => {
      for (let attempt = 0; attempt <= MAX_CLIENT_RETRIES; attempt++) {
        try {
          const data = await verifyOnce(order_id, clientToken);
          if (!isMounted) return;

          if (data.success) {
            setStatus(data.alreadyConfirmed ? "already_confirmed" : "success");
            setCountdown(4);
            clearClientToken(order_id);
            return;
          }

          if (data.pending) {
            if (attempt < MAX_CLIENT_RETRIES) {
              await new Promise((r) => setTimeout(r, CLIENT_RETRY_DELAY_MS));
              continue;
            }
            setStatus("pending");
            setCountdown(6);
            return;
          }

          // Terminal failure
          setStatus("failed");
          setErrorMsg(data.error || "Payment was not completed or could not be verified.");
          setCountdown(5);
          return;
        } catch {
          if (!isMounted) return;
          if (attempt < MAX_CLIENT_RETRIES) {
            await new Promise((r) => setTimeout(r, CLIENT_RETRY_DELAY_MS));
            continue;
          }
          setStatus("failed");
          setErrorMsg("Network error — could not reach the server.");
          setCountdown(5);
          return;
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [order_id, verifyOnce]);

  // Countdown and auto-transfer to home page for terminal states
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

  const isVerifying = status === "verifying";
  const isSuccess = status === "success" || status === "already_confirmed";

  // ── Verifying: only the card + spinner, nothing else ──
  if (isVerifying) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 bg-background text-foreground">
        <Card className="w-full max-w-md border border-zinc-200 dark:border-white/10 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-10">
            <Spinner className="size-6 text-blue-600 dark:text-blue-500" />
            <p className="text-sm text-muted-foreground">Verifying payment...</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  // ── Terminal states (success / already_confirmed / pending / failed):
  // no card, just the essential redirect line + the button. ──
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-background text-foreground">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-muted-foreground font-mono">
          Redirecting in {countdown}s...
        </p>

        <div className="p-[2px] rounded-md transition-all duration-200 ease-out shadow-xs bg-blue-600/20">
          <Link
            href="/"
            className="py-2.5 px-6 rounded-[6px] font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer shadow-[0_4px_16px_rgba(37,99,235,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_rgba(0,0,0,0.1)] text-center flex items-center justify-center"
          >
            <span>{isSuccess ? "Go to keyboard now" : "Return to home"}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center p-4 bg-background text-foreground">
          <Card className="w-full max-w-md border border-zinc-200 dark:border-white/10 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-10">
              <Spinner className="size-6 text-blue-600 dark:text-blue-500" />
              <p className="text-sm text-muted-foreground">Verifying payment...</p>
            </CardContent>
          </Card>
        </main>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}