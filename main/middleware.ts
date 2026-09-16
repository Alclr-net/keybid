import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// CRIT-02: Simple in-memory sliding-window rate limiter.
// Keyed by "IP:route-group". No Redis required — works across hot reloads.
// For a serverless deployment with multiple instances, upgrade to
// @upstash/ratelimit + Redis for cross-instance enforcement.
// ─────────────────────────────────────────────────────────────────────────────
interface WindowEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, WindowEntry>();

const PAYMENT_LIMIT = 10; // max requests per IP per window
const PAYMENT_WINDOW_MS = 60_000; // 1 minute
const WEBHOOK_LIMIT = 60; // webhooks can burst more
const WEBHOOK_WINDOW_MS = 60_000;

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    // New window
    store.set(key, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  if (entry.count > limit) {
    return true;
  }
  return false;
}

// Periodically prune stale entries to prevent memory growth
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now - entry.windowStart > PAYMENT_WINDOW_MS * 2) {
        store.delete(key);
      }
    }
  }, 5 * 60_000);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // ── LOW-02: Enforce JSON content-type on all POST API routes ──────────────
  if (
    req.method === "POST" &&
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/webhook/") // webhooks may send raw body
  ) {
    const ct = req.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
    }
  }

  // ── CRIT-02: Rate limiting ─────────────────────────────────────────────────
  if (
    pathname.startsWith("/api/payments/create-order") ||
    pathname.startsWith("/api/payments/verify")
  ) {
    const key = `payment:${ip}`;
    if (isRateLimited(key, PAYMENT_LIMIT, PAYMENT_WINDOW_MS)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please wait a moment and try again." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": String(PAYMENT_LIMIT),
          },
        }
      );
    }
  }

  if (pathname.startsWith("/api/webhook/")) {
    const key = `webhook:${ip}`;
    if (isRateLimited(key, WEBHOOK_LIMIT, WEBHOOK_WINDOW_MS)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/payments/:path*", "/api/webhook/:path*"],
};
