import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ProblemSolution } from "@/components/sections/ProblemSolution";
import { Personalization } from "@/components/sections/Personalization";
import { DashboardPreview } from "@/components/sections/DashboardPreview";
import { Marketplace } from "@/components/sections/Marketplace";
import { SocialProof } from "@/components/sections/SocialProof";
import { Community } from "@/components/sections/Community";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { BackToTop } from "@/components/ui/BackToTop";
import { Providers } from "@/components/Providers";

export default function Home() {
  return (
    <Providers>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Features />
        <HowItWorks />
        <ProblemSolution />
        <Personalization />
        <DashboardPreview />
        <Marketplace />
        <SocialProof />
        <Community />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <BackToTop />
    </Providers>
  );
}
