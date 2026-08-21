import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Steps } from "@/components/landing/Steps";
import { ClosingCta } from "@/components/landing/ClosingCta";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-bg">
      <LandingNav />
      <main>
        <Hero />
        <Features />
        <Steps />
        <ClosingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
