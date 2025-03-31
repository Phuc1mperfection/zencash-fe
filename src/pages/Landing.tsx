import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  BarChart,
  Lock,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

export const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001e2b] to-[#023430] text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
        ></motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00ed64] to-[#00b8d4]"
            >
              Secure Your Digital Future
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-8"
            >
              Experience the next generation of secure digital transactions with
              our cutting-edge platform
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/signup"
                className="px-8 py-4 bg-[#00ed64] text-[#001e2b] rounded-lg font-semibold hover:bg-[#00d55a] transition-colors flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#00ed64]/50 transition-colors"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-[#00ed64]/10 rounded-lg flex items-center justify-center mb-4"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="text-4xl font-bold text-[#00ed64] mb-2"
                >
                  {stat.value}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                  className="text-gray-400"
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of satisfied users who trust our platform for their
              digital transactions
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#00ed64] text-[#001e2b] rounded-lg font-semibold hover:bg-[#00d55a] transition-colors"
              >
                Create Your Account <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: <Shield className="w-6 h-6 text-[#00ed64]" />,
    title: "Bank-Grade Security",
    description:
      "Your data is protected with industry-leading encryption and security protocols",
  },
  {
    icon: <Zap className="w-6 h-6 text-[#00ed64]" />,
    title: "Lightning Fast",
    description:
      "Experience instant transactions with our optimized processing system",
  },
  {
    icon: <Users className="w-6 h-6 text-[#00ed64]" />,
    title: "User-Friendly",
    description: "Intuitive interface designed for the best user experience",
  },
  {
    icon: <BarChart className="w-6 h-6 text-[#00ed64]" />,
    title: "Real-Time Analytics",
    description:
      "Track your transactions and performance with detailed insights",
  },
  {
    icon: <Lock className="w-6 h-6 text-[#00ed64]" />,
    title: "Privacy First",
    description:
      "Your privacy is our top priority with advanced data protection",
  },
  {
    icon: <Globe className="w-6 h-6 text-[#00ed64]" />,
    title: "Global Access",
    description: "Access your account from anywhere in the world, 24/7",
  },
];

const stats = [
  { value: "1M+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "50+", label: "Countries" },
  { value: "24/7", label: "Support" },
];

export default Landing;
