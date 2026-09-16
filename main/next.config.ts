import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// React dev mode needs 'unsafe-eval' for stack-trace reconstruction.
// It is never included in production builds.
const scriptSrc = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.dodopayments.com https://test.dodopayments.com",
  "frame-src https://checkout.dodopayments.com https://test.checkout.dodopayments.com",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

const nextConfig: NextConfig = {
  env: {
    BASE_PRICE: process.env.BASE_PRICE || "",
    NEXT_PUBLIC_BASE_PRICE: process.env.NEXT_PUBLIC_BASE_PRICE || process.env.BASE_PRICE || "",
  },

  // LOW-03: HTTP security headers applied to every response
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Content-Security-Policy", value: scriptSrc },
        ],
      },
    ];
  },

  // Only allow ngrok tunnel origins in development
  ...(isDev && {
    allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok.io"],
  }),
};

export default nextConfig;