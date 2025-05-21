import { motion } from "framer-motion";

interface StatsItemProps {
  value: string;
  label: string;
  index: number;
}

const StatsItem = ({ value, label, index }: StatsItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="text-center"
    >
      <motion.div className="text-4xl font-bold text-[#00ed64] mb-2">
        {value}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{
          duration: 0.5,
          delay: index * 0.1 + 0.4,
          ease: "easeOut",
        }}
        className="text-gray-400"
      >
        {label}
      </motion.div>
    </motion.div>
  );
};

export const StatsSection = () => {
  // Stats data
  const stats = [
    { value: "1M+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "50+", label: "Countries" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <section className="py-20 bg-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatsItem
              key={index}
              value={stat.value}
              label={stat.label}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
