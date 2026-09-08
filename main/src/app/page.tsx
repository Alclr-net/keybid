'use client';
import HeroSection from '@/src/components/HeroSection';
import LiveAuctionSection from '@/src/components/LiveAuctionSection';
import HowItWorksSection from '@/src/components/HowItWorksSection';
import FaqSection from '@/src/components/FaqSection';
import Footer from '@/src/components/footer';
import TopBidsCanvasReveal from '@/src/components/TopBidsCanvasReveal';
import MacDisplaySection from '@/src/components/MacDisplaySection';

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



