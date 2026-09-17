import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import KeysProvider from "@/src/app/KeysProvider";
import Navbar from "@/src/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://keybid.lol";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "KeyBid — Bid to Own a Keyboard Key & Get Your Startup Featured",
    template: "%s — KeyBid",
  },
  description:
    "KeyBid is a paid startup leaderboard where you bid to claim a key on a real keyboard. Pay what you want, outbid competitors, and get your website featured. The best outbid.lol alternative for indie hackers and founders.",
  keywords: [
    "keybid",
    "keybid.lol",
    "outbid.lol alternative",
    "pay to rank website",
    "paid startup leaderboard",
    "bid for website placement",
    "website ranking auction",
    "buy top spot website ranking",
    "pay for website visibility",
    "startup launch leaderboard",
    "product launch bidding platform",
    "pay what you want website ranking",
    "indie hacker leaderboard",
    "get more traffic paid placement",
    "how does keybid work",
    "what happens if someone outbids my website listing",
    "how to get your website featured on a leaderboard",
    "pay to be featured startup",
    "daily leaderboard for indie makers",
    "website bidding board how it works",
    "outbid.lol vs keybid",
    "best startup leaderboard sites",
    "sites like outbid.lol",
    "where to list my startup for visibility",
  ],
  authors: [{ name: "Rachit Seth", url: "https://x.com/seth_rachit_" }],
  creator: "Rachit Seth",
  publisher: "KeyBid",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "KeyBid",
    title: "KeyBid — Bid to Own a Keyboard Key & Get Your Startup Featured",
    description:
      "KeyBid is a paid startup leaderboard where you bid to claim a key on a real keyboard. Pay what you want, outbid competitors, and get your website featured. The best outbid.lol alternative.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KeyBid — Paid Startup Keyboard Leaderboard",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@seth_rachit_",
    creator: "@seth_rachit_",
    title: "KeyBid — Bid to Own a Keyboard Key & Get Your Startup Featured",
    description:
      "KeyBid is a paid startup leaderboard where you bid to claim a key on a real keyboard. Pay what you want, outbid competitors, and get your website featured.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/favicon.svg" },
    ],
  },
  manifest: undefined,
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-apple)] antialiased selection:bg-blue-600 selection:text-white" suppressHydrationWarning>
        <Providers>
          <KeysProvider>
            <Navbar />
            {children}
          </KeysProvider>
        </Providers>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}