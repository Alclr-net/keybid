'use client';

import HeroSection from '@/components/HeroSection';
import LiveAuctionSection from '@/components/LiveAuctionSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/footer';
import TopBidsCanvasReveal from '@/components/TopBidsCanvasReveal';
import MacDisplaySection from '@/components/MacDisplaySection';

export default function Home() {

  return (
    <div className="w-full flex flex-col items-center">
      <HeroSection />
      <MacDisplaySection />
      <TopBidsCanvasReveal />
      <LiveAuctionSection />
      <HowItWorksSection />
      <FaqSection />
      <Footer />
    </div>
  );
}
