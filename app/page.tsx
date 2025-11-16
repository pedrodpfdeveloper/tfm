import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import FaqSection from "@/components/home/FaqSection";
import RotatingRecipesSection from "@/components/home/RotatingRecipesSection";
import { getAuthWithRole } from "@/lib/auth";

export default async function Home() {
  const { user } = await getAuthWithRole();

  return (
      <>
        <HeroSection isLoggedIn={!!user} />
        <RotatingRecipesSection />
        <FeaturesSection />
        <FaqSection />
      </>
  );
}