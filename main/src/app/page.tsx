'use client';
import HeroSection from '@/src/components/HeroSection';
import LiveAuctionSection from '@/src/components/LiveAuctionSection';
import HowItWorksSection from '@/src/components/HowItWorksSection';
import Footer from '@/src/components/footer';
import TopBidsCanvasReveal from '@/src/components/TopBidsCanvasReveal';
import MacDisplaySection from '@/src/components/MacDisplaySection';
import SeoArticleSection from '@/src/components/SeoArticleSection';

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://keybid.lol/#website",
      "url": "https://keybid.lol",
      "name": "KeyBid",
      "description": "KeyBid is a paid startup leaderboard where you bid to claim a key on a real keyboard and get your website featured.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://keybid.lol/?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://keybid.lol/#organization",
      "name": "KeyBid",
      "url": "https://keybid.lol",
      "logo": {
        "@type": "ImageObject",
        "url": "https://keybid.lol/favicon-512x512.png",
      },
      "sameAs": ["https://x.com/seth_rachit_"],
      "founder": {
        "@type": "Person",
        "name": "Rachit Seth",
        "url": "https://x.com/seth_rachit_",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full flex flex-col items-center">
        <HeroSection />
        <MacDisplaySection />
        <TopBidsCanvasReveal />
        <LiveAuctionSection />
        <HowItWorksSection />
        <Footer />
      </div>
    </>
  );
}



