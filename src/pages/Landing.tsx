import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  Globe,
} from "lucide-react";
import {  BarChart3, Brain, Lock, Wallet2, Package, Eye, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';
import { ReactTyped } from 'react-typed';

import { motion } from "framer-motion";
import Footer from "../components/Footer";
const data = [
  { category: 'Food', amount: 400 },
  { category: 'Transport', amount: 250 },
  { category: 'Entertainment', amount: 150 },
  { category: 'Savings', amount: 500 },
];

export const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001e2b] to-[#023430] text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
  {/* Animated Background */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }} // Giảm xuống để nền hiện nhanh hơn
    className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
  ></motion.div>

  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-4xl mx-auto text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }} // Delay vừa phải để tạo hiệu ứng mượt
        className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00ed64] to-[#00b8d4]"
      >
        Secure Your Digital Future
      </motion.h1>

      <div className="flex justify-center items-center">
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.6, delay: 0.8 }} 
          className="md:text-4xl sm:text-4xl text-xl font-bold py-4"
        >
          Solutions for
        </motion.p>
        <ReactTyped 
          className="md:text-4xl sm:text-4xl text-xl font-bold md:pl-4 pl-2"
          strings={['Students', 'Professionals', 'Young Adults']}
          typeSpeed={70} // Giảm tốc độ để dễ đọc hơn
          backSpeed={120}
          onComplete={() => console.log("Typing completed")}
          loop
        />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="text-xl md:text-2xl text-gray-300 mb-8"
      >
        Experience the next generation of secure digital transactions with our cutting-edge platform
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }} // Nút CTA xuất hiện sau nội dung
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
   {/* Financial Chart Section */}
   <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#001e2b] mb-16">Your Financial Overview</h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="category" stroke="#001e2b" />
                <YAxis stroke="#001e2b" />
                <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="amount" fill="#00ed64" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
      {/* How It Works Section */}  
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#001e2b] mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-black">
            {[{icon: Package, title: 'Connect Your Account', desc: 'Securely link your bank to start tracking your money.'},
              {icon: Eye, title: 'Track Expenses', desc: 'Categorize and monitor spending in real-time.'},
              {icon: FileText, title: 'Get Insights', desc: 'Receive detailed financial reports and analytics.'}]
              .map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="p-6 bg-white shadow-lg rounded-xl">
                  <step.icon className="text-[#00ed64] w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
     {/* Features Section */}
     <section className="py-20 px-4 ">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Features that make managing money easier

          </h2>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Wallet2}
              title="Smart Expense Tracking"
              description="Automatically categorize and track your expenses in real-time."
            />
            <FeatureCard
              icon={Brain}
              title="AI Budgeting"
              description="Get personalized recommendations based on your spending habits."
            />
            <FeatureCard
              icon={BarChart3}
              title="Financial Reports"
              description="Detailed analytics and insights to help you make better decisions."
            />
            <FeatureCard
              icon={Lock}
              title="Secure & Private"
              description="Bank-level security to keep your financial data safe."
            />
          </div>
        </div>
      </section>
         {/* Testimonials Section */}
         <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-black mb-16">
            What our users say
          </h2>
          <div className="flex overflow-x-auto pb-8 -mx-4">
            <TestimonialCard
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              name="Sarah Johnson"
              role="Small Business Owner"
              quote="Zen Cash has transformed how I manage both my personal and business finances. The AI recommendations are incredibly helpful!"
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              name="David Chen"
              role="Software Engineer"
              quote="The automated expense tracking saves me hours each month. Best financial app I've ever used!"
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
              name="Emily Rodriguez"
              role="Freelancer"
              quote="Finally, an app that makes budgeting feel effortless. The interface is beautiful and intuitive."
            />
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
<Footer />
    
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
