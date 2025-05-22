import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ReactTyped } from "react-typed";
import { motion, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

interface SplitTextProps {
  text: string;
  className: string;
}

const SplitText = ({ text, className }: SplitTextProps) => {
  return (
    <span className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.03,
            ease: [0.22, 1, 0.36, 1], // Custom easing curve
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

import type { MotionValue } from "framer-motion";

interface HeroSectionProps {
  scrollYProgress: MotionValue<number>;
}

export const HeroSection = ({ scrollYProgress }: HeroSectionProps) => {
  const heroRef = useRef<HTMLElement>(null);

  // Use spring for smoother animation
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 100,
  });

  // Transform values based on scroll position
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.9]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0.3]);
  const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background with Parallax Effect */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
      ></motion.div>

      <motion.div
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div className="mb-6">
            <SplitText
              text="  Welcome to Zen Cash"
              className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00ed64] to-[#00b8d4]"
            />
          </motion.div>

          <div className="flex justify-center items-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.6,
                delay: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="md:text-4xl sm:text-4xl text-xl font-bold py-4"
            >
              Solutions for
            </motion.p>
            <ReactTyped
              className="md:text-4xl sm:text-4xl text-xl font-bold md:pl-4 pl-2"
              strings={["Students", "Professionals", "Young Adults"]}
              typeSpeed={70}
              backSpeed={120}
              loop
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Experience the next generation of secure digital transactions with
            our cutting-edge platform
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signup"
              className="px-8 py-4 bg-[#00ed64] text-[#001e2b] rounded-lg font-semibold hover:bg-[#00d55a] transition-colors flex items-center justify-center gap-2"
            >
              <motion.span
                className="flex items-center gap-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-white/10  text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Learn More
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-[30px] h-[50px] rounded-full border-2 border-white/30 flex justify-center items-start p-2">
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-[8px] h-[8px] bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
