import { motion } from "framer-motion";
import TestimonialCard from "../TestimonialCard";

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

export const TestimonialsSection = () => {
  const testimonials = [
    {
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      name: "Sarah Johnson",
      role: "Small Business Owner",
      quote:
        "Zen Cash has transformed how I manage both my personal and business finances. The AI recommendations are incredibly helpful!",
    },
    {
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      name: "David Chen",
      role: "Software Engineer",
      quote:
        "The automated expense tracking saves me hours each month. Best financial app I've ever used!",
    },
    {
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      name: "Emily Rodriguez",
      role: "Freelancer",
      quote:
        "Finally, an app that makes budgeting feel effortless. The interface is beautiful and intuitive.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-4xl font-bold text-center text-black mb-6"
        >
          <SplitText
            text="What our users say"
            className="text-4xl font-bold text-black"
          />
        </motion.h2>

        <motion.div
          initial={{ width: "0%" }}
          whileInView={{ width: "120px" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="h-1 bg-[#00ed64] mx-auto mb-16 rounded-full"
        />

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-8 pb-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                x: index === 0 ? -50 : index === 2 ? 50 : 0,
                y: index === 1 ? 50 : 0,
              }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
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
              <TestimonialCard
                image={testimonial.image}
                name={testimonial.name}
                role={testimonial.role}
                quote={testimonial.quote}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
