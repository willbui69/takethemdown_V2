
import RootLayout from "@/components/layout/RootLayout";
import HeroSection from "@/components/sections/HeroSection";
import IntroSection from "@/components/sections/IntroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProcessSection from "@/components/sections/ProcessSection";
import FaqSection from "@/components/sections/FaqSection";
import ContactSection from "@/components/sections/ContactSection";

console.log('Index.tsx: Loading Index page component');

const Index = () => {
  console.log('Index.tsx: Rendering Index page');
  
  return (
    <RootLayout>
      <HeroSection />
      <IntroSection />
      <ServicesSection />
      <ProcessSection />
      <FaqSection />
      <ContactSection />
    </RootLayout>
  );
};

export default Index;
