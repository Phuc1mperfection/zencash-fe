import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { Wallet2, Brain, BarChart3, Lock } from "lucide-react";

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
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
  color: string;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
  color,
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -15,
        transition: {
          type: "spring",
          stiffness: 300,
        },
      }}
      className="perspective-1000"
    >
      <motion.div
        whileHover={{
          rotateX: 5,
          rotateY: 10,
          boxShadow: `0 20px 30px -10px rgba(${
            color
              .replace("#", "")
              .match(/.{2}/g)
              ?.map((c) => parseInt(c, 16))
              .join(",") || "0,0,0"
          }, 0.2)`,
        }}
        transition={{
          type: "spring",
          damping: 15,
        }}
        className="h-full"
      >
        <div className="bg-white/10  p-6 rounded-xl transition-all duration-300 border border-white/20 hover:border-[#00ed64]/40 h-full flex flex-col">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: delay + 0.2,
            }}
            whileHover={{ rotate: 360 }}
            className="h-12 w-12 bg-[#00ed64]/10 rounded-lg flex items-center justify-center mb-5 self-start"
          >
            <Icon className="h-6 w-6 text-[#00ed64]" />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              delay: delay + 0.3,
              duration: 0.5,
            }}
            className="text-xl font-semibold mb-3 text-white"
          >
            {title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              delay: delay + 0.4,
              duration: 0.5,
            }}
            className="text-gray-300"
          >
            {description}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const FeaturesSection = () => {
  const featuresSectionRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(featuresRef, { once: false, amount: 0.2 });
  const featuresControls = useAnimation();

  // Trigger animations when sections are in view
  useEffect(() => {
    if (isInView) {
      featuresControls.start({
        opacity: 1,
        y: 0,
        transition: {
          staggerChildren: 0.1,
          ease: [0.22, 1, 0.36, 1], // Custom easing function for spring effect
        },
      });
    }
  }, [isInView, featuresControls]);

  const features = [
    {
      icon: Wallet2,
      title: "Smart Expense Tracking",
      description:
        "Automatically categorize and track your expenses in real-time.",
      delay: 0,
      color: "#00ed64",
    },
    {
      icon: Brain,
      title: "AI Budgeting",
      description:
        "Get personalized recommendations based on your spending habits.",
      delay: 0.2,
      color: "#00ed64",
    },
    {
      icon: BarChart3,
      title: "Financial Reports",
      description:
        "Detailed analytics and insights to help you make better decisions.",
      delay: 0.4,
      color: "#00ed64",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Bank-level security to keep your financial data safe.",
      delay: 0.6,
      color: "#00ed64",
    },
  ];

  return (
    <section className="py-20 relative" ref={featuresSectionRef}>
     
      {/* Features Section with Advanced Animations */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Background animation elements */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-[#00ed64]/5 top-[-100px] right-[-200px] z-0"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full bg-[#00b8d4]/5 bottom-[-50px] left-[-100px] z-0"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10" ref={featuresRef}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-center text-white mb-4">
              <SplitText
                text="Features that make managing money easier"
                className="text-4xl font-bold text-white"
              />
            </h2>

            <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: "180px" }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              className="h-1 bg-[#00ed64] mx-auto mt-6 rounded-full"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={feature.delay}
                color={feature.color}
              />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default FeaturesSection;
