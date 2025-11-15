import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import FaqSection from "@/components/home/FaqSection";
import RotatingRecipesSection from "@/components/home/RotatingRecipesSection";

export default function Home() {
  return (
      <>
        <HeroSection />
        <RotatingRecipesSection />
        <FeaturesSection />
        <FaqSection />
      </>
  );
}