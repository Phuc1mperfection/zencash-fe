import {  BarChart3, Brain, Lock, Wallet2, Link, Eye, FileText } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Hero from '../components/Hero';
import Landing from './Landing';

const data = [
  { category: 'Food', amount: 400 },
  { category: 'Transport', amount: 250 },
  { category: 'Entertainment', amount: 150 },
  { category: 'Savings', amount: 500 },
];

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <Hero />
      <Landing />

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#001e2b] mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[{icon: Link, title: 'Connect Your Account', desc: 'Securely link your bank to start tracking your money.'},
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

      {/* Why Zen Cash? (Comparison Table) */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Why Zen Cash?</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-[#001e2b] text-white">Feature</th>
                  <th className="py-3 px-6 bg-[#00ed64] text-[#001e2b]">Zen Cash</th>
                  <th className="py-3 px-6 bg-gray-200 text-gray-800">Traditional Methods</th>
                </tr>
              </thead>
              <tbody>
                {[['Automatic Expense Tracking', '✔', '✖'],
                  ['AI Budgeting Suggestions', '✔', '✖'],
                  ['Real-Time Financial Insights', '✔', '✖']]
                  .map((row, index) => (
                    <tr key={index} className="border-b">
                      {row.map((col, i) => (
                        <td key={i} className="py-4 px-6 text-center">{col}</td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Financial Chart Section */}
      <section className="py-20 px-4 bg-gray-50">
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
      <section className="py-20 px-4 bg-gray-50">
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
    </>
  );
};

export default Home;
