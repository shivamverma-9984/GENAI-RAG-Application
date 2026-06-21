import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import Footer from "./Footer";

export default function HomePage({ token }) {
  return (
    <div className="flex flex-col min-h-screen bg-[radial-gradient(circle_at_50%_-20%,rgba(79,70,229,0.15),transparent_60%),radial-gradient(circle_at_10%_40%,rgba(59,130,246,0.08),transparent_45%),radial-gradient(circle_at_90%_85%,rgba(6,182,212,0.08),transparent_45%)] bg-bg-primary text-text-primary overflow-x-hidden">
      <Navbar token={token} />
      <HeroSection token={token} />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}
