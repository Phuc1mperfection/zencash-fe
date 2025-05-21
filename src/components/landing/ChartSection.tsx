import { useRef } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

export const ChartSection = () => {
  const chartSectionRef = useRef<HTMLElement>(null);

  // Data for chart
  const data = [
    { category: "Food", amount: 400 },
    { category: "Transport", amount: 250 },
    { category: "Entertainment", amount: 150 },
    { category: "Savings", amount: 500 },
  ];

  return (
    <section ref={chartSectionRef} className="py-20 px-4 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl font-bold text-center text-[#001e2b] mb-6"
        >
          <SplitText
            text="Your Financial Overview"
            className="text-4xl font-bold text-[#001e2b]"
          />
        </motion.h2>

        <motion.div
          initial={{ width: "0%" }}
          whileInView={{ width: "120px" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="h-1 bg-[#00ed64] mx-auto mb-16 rounded-full"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="category" stroke="#001e2b" />
              <YAxis stroke="#001e2b" />
              <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
              <Bar dataKey="amount" fill="#00ed64" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </section>
  );
};

export default ChartSection;
