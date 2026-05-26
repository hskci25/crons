import TopNavBar from "../components/TopNavBar";
import HeroSection from "../components/HeroSection";
import ProductIntro from "../components/ProductIntro";
import SplitPanel from "../components/SplitPanel";
import FeaturesGrid from "../components/FeaturesGrid";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import GridBackground from "../components/GridBackground";

export default function LandingPage() {
  return (
    <>
      <TopNavBar />
      <main>
        <HeroSection />
        <section className="min-h-screen w-full bg-background border-t border-outline-variant">
          <ProductIntro />
          <SplitPanel />
          <FeaturesGrid />
          <CTASection />
        </section>
      </main>
      <Footer />
      <GridBackground />
    </>
  );
}
