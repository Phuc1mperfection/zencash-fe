import { motion } from "framer-motion";
import { Package, Eye, FileText } from "lucide-react";
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

interface StepCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

const StepCard = ({ icon: Icon, title, description, index }: StepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -10,
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      }}
      className="p-6 bg-white shadow-lg rounded-xl transition-all duration-300"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{
          delay: index * 0.2 + 0.3,
          duration: 0.5,
          ease: "backOut",
        }}
      >
        <Icon className="text-[#00ed64] w-12 h-12 mx-auto mb-4" />
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export const HowItWorksSection = () => {
  const howItWorksSectionRef = useRef<HTMLElement>(null);

  const steps = [
    {
      icon: Package,
      title: "Connect Your Account",
      description: "Securely link your bank to start tracking your money.",
    },
    {
      icon: Eye,
      title: "Track Expenses",
      description: "Categorize and monitor spending in real-time.",
    },
    {
      icon: FileText,
      title: "Get Insights",
      description: "Receive detailed financial reports and analytics.",
    },
  ];

  return (
    <section
      ref={howItWorksSectionRef}
      className="py-20 px-4 bg-gray-100 relative"
    >
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl font-bold text-center text-[#001e2b] mb-6"
        >
          <SplitText
            text="How It Works"
            className="text-4xl font-bold text-[#001e2b]"
          />
        </motion.h2>

        <motion.div
          initial={{ width: "0%" }}
          whileInView={{ width: "100px" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="h-1 bg-[#00ed64] mx-auto mb-16 rounded-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-black">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorksSection;
