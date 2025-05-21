// filepath: d:\code\HTML\zencash-fe\src\pages\Landing.tsx
import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import Footer from "../components/Footer";

// Import landing page sections
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import ChartSection from "../components/landing/ChartSection";
import StatsSection from "../components/landing/StatsSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import CTASection from "../components/landing/CTASection";
import SplitText from "@/components/landing/SplitText";

export const Landing = () => {
  // Ref for scroll animations
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-[#001e2b] to-[#023430] text-white overflow-hidden"
    >
      {/* Hero Section */}
      <HeroSection scrollYProgress={scrollYProgress} />
      <div className="sticky top-0 py-20 bg-[#001e2b]/90  z-10">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-4"
          >
            <SplitText text="Why Choose Us" className="text-4xl font-bold" />
          </motion.h2>
          <motion.div
            initial={{ width: "0%" }}
            whileInView={{ width: "100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-1 bg-[#00ed64] mx-auto mb-16 rounded-full"
          />
        </div>
      </div>

      {/* Features Section */}
      <FeaturesSection />
      {/* Chart Section */}
      <ChartSection />

      {/* Stats Section */}
      <StatsSection />
      {/* How It Works Section */}
      <HowItWorksSection />


      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Feedback Section */}
      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
