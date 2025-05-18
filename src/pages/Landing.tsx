import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Lock,
  Wallet2,
  Package,
  Eye,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import TestimonialCard from "../components/TestimonialCard";
import { ReactTyped } from "react-typed";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useAnimation,
  useInView,
} from "framer-motion";
import { useEffect, useRef,  } from "react";
import Footer from "../components/Footer";

// Data for chart
const data = [
  { category: "Food", amount: 400 },
  { category: "Transport", amount: 250 },
  { category: "Entertainment", amount: 150 },
  { category: "Savings", amount: 500 },
];

// Stats data
const stats = [
  { value: "1M+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "50+", label: "Countries" },
  { value: "24/7", label: "Support" },
];

// Text splitting component type definition
interface SplitTextProps {
  text: string;
  className: string;
}

export const Landing = () => {
  // Refs for scroll animations
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const featuresSectionRef = useRef<HTMLElement>(null);
  const chartSectionRef = useRef<HTMLElement>(null);
  const howItWorksSectionRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  // Viewport detection
  const isInView = useInView(featuresRef, { once: false, amount: 0.2 });

  // Scroll progress animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Use spring for smoother animation
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 100,
  });

  // Transform values based on scroll position
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.9]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0.3]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Animation controls for features section
  const featuresControls = useAnimation();

  // Text splitting effect helpers
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

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-[#001e2b] to-[#023430] text-white overflow-hidden"
    >
      {/* Hero Section with Scroll Effects */}
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
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
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

      {/* Features Section with Sticky Scroll */}
      <section className="py-20 relative" ref={featuresSectionRef}>
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
      {/* Features Section with Advanced Animations */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Background animation elements */}
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-[#00ed64]/5 top-[-100px] right-[-200px] z-0"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute w-[300px] h-[300px] rounded-full bg-[#00b8d4]/5 bottom-[-50px] left-[-100px] z-0"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ 
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1] 
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
            {[
              { 
                icon: Wallet2, 
                title: "Smart Expense Tracking", 
                description: "Automatically categorize and track your expenses in real-time.",
                delay: 0,
                color: "#00ed64"
              },
              { 
                icon: Brain, 
                title: "AI Budgeting", 
                description: "Get personalized recommendations based on your spending habits.",
                delay: 0.2,
                color: "#00ed64"
              },
              { 
                icon: BarChart3, 
                title: "Financial Reports", 
                description: "Detailed analytics and insights to help you make better decisions.",
                delay: 0.4,
                color: "#00ed64"
              },
              { 
                icon: Lock, 
                title: "Secure & Private", 
                description: "Bank-level security to keep your financial data safe.",
                delay: 0.6,
                color: "#00ed64"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ 
                  duration: 0.7, 
                  delay: item.delay,
                  ease: [0.22, 1, 0.36, 1] 
                }}
                whileHover={{ 
                  y: -15,
                  transition: { 
                    type: "spring",
                    stiffness: 300
                  }
                }}
                className="perspective-1000"
              >
                <motion.div
                  whileHover={{ 
                    rotateX: 5,
                    rotateY: 10,
                    boxShadow: `0 20px 30px -10px rgba(${item.color.replace('#', '').match(/.{2}/g)?.map(c => parseInt(c, 16)).join(',') || '0,0,0'}, 0.2)`
                  }}
                  transition={{
                    type: "spring",
                    damping: 15
                  }}
                  className="h-full"
                >
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl transition-all duration-300 border border-white/20 hover:border-[#00ed64]/40 h-full flex flex-col">
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: item.delay + 0.2
                      }}
                      whileHover={{ rotate: 360 }}
                      className={`h-12 w-12 bg-[${item.color}]/10 rounded-lg flex items-center justify-center mb-5 self-start`}
                    >
                      <item.icon className={`h-6 w-6 text-[${item.color}]`} />
                    </motion.div>
                    <motion.h3 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: item.delay + 0.3,
                        duration: 0.5
                      }}
                      className="text-xl font-semibold mb-3 text-white"
                    >
                      {item.title}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ 
                        delay: item.delay + 0.4,
                        duration: 0.5
                      }}
                      className="text-gray-300"
                    >
                      {item.description}
                    </motion.p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
       
      </section>

      {/* Financial Chart Section with Scroll-triggered Animation */}
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

      {/* Stats Section with counter animation */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
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
                  {stat.value}
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
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section with horizontal scroll cards */}
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
            {[
              {
                icon: Package,
                title: "Connect Your Account",
                desc: "Securely link your bank to start tracking your money.",
              },
              {
                icon: Eye,
                title: "Track Expenses",
                desc: "Categorize and monitor spending in real-time.",
              },
              {
                icon: FileText,
                title: "Get Insights",
                desc: "Receive detailed financial reports and analytics.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
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
                  <step.icon className="text-[#00ed64] w-12 h-12 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>



      {/* Testimonials Section with animation */}
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
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                name: "Sarah Johnson",
                role: "Small Business Owner",
                quote:
                  "Zen Cash has transformed how I manage both my personal and business finances. The AI recommendations are incredibly helpful!",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
                name: "David Chen",
                role: "Software Engineer",
                quote:
                  "The automated expense tracking saves me hours each month. Best financial app I've ever used!",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
                name: "Emily Rodriguez",
                role: "Freelancer",
                quote:
                  "Finally, an app that makes budgeting feel effortless. The interface is beautiful and intuitive.",
              },
            ].map((testimonial, index) => (
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

      {/* CTA Section with animated gradient */}
      <section className="py-20 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#001e2b] via-[#00684A] to-[#001e2b] bg-[length:200%_100%]"
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
          }}
          transition={{
            duration: 15,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{ opacity: 0.7 }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              <SplitText
                text="Ready to Get Started?"
                className="text-4xl font-bold"
              />
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of satisfied users who trust our platform for their
              digital transactions
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#00ed64] text-[#001e2b] rounded-lg font-semibold hover:bg-[#00d55a] transition-colors"
              >
                <motion.span
                  className="flex items-center gap-2"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Create Your Account <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
export default Landing;