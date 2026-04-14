import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LogoBar from "@/components/LogoBar";
import StatementSection from "@/components/StatementSection";
import FeatureSections from "@/components/FeatureSections";
import ChangelogSection from "@/components/ChangelogSection";
import CustomerQuotes from "@/components/CustomerQuotes";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div
      style={{
        backgroundColor: "rgb(8, 9, 10)",
        minHeight: "100vh",
        color: "rgb(247, 248, 248)",
        fontFamily:
          '"Inter Variable", "SF Pro Display", -apple-system, "system-ui", sans-serif',
      }}
    >
      {/* Fixed navigation — sits above all content */}
      <Header />

      {/* Main scrollable content — padded to clear the fixed header */}
      <main>
        <HeroSection />
        <LogoBar />
        <StatementSection />
        <FeatureSections />
        <ChangelogSection />
        <CustomerQuotes />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
